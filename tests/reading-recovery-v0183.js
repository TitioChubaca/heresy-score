/* node tests/reading-recovery-v0183.js — no cloud writes or Spotify audio.
   Exercise accidental completion recovery, deliberate finish, cloud guard,
   visible mini-player resume and prepaint archive skin. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const script=read("scripts/reading-recovery.js");
const modelWindow={};
vm.runInNewContext(script,{window:modelWindow});
const model=modelWindow.HSReadingRecoveryModel;
assert(model);
const justFinished=new Date(Date.now()-5*60000).toISOString();
const localRecord={
 minutes:12,startedAt:new Date(Date.now()-12*60000).toISOString(),
 finishedAt:justFinished,notes:"Nota preservada",
 musicTelemetry:{readDurationMs:712345,lastObservedTrack:"Trilha em andamento",
  lastSpotifyProgress:{uri:"spotify:track:0000000000000000000001",
   playlistId:"playlist7",positionMs:48000,capturedAt:Date.now()-30000}}
};
assert.equal(model.latestDone({6:{minutes:23},7:localRecord}),7);
assert(model.recentlyFinished({7:localRecord},7));
assert(!model.recentlyFinished({7:{...localRecord,finishedAt:"2025-01-01T00:00:00Z"}},7));
const recovered=model.makePausedSession(7,localRecord,null,Date.now());
assert.equal(recovered.chapter,7);
assert.equal(recovered.elapsedMs,712345,"Use recorded millisecond accuracy, not rounded minutes");
assert.equal(recovered.paused,true);
assert.equal(recovered.resumeFromSavedPoint,true);
assert.equal(recovered.lastSpotifyProgress.positionMs,48000);
const precise=model.makePausedSession(7,localRecord,{
 active:{startedAt:Date.now()-60000,paused:false,musicOffsetMs:1500,
  currentTrack:{uri:"spotify:track:old"},trackFeedback:[{verdict:"mismatch"}]},
 elapsedMs:551234
});
assert.equal(precise.elapsedMs,551234,"Snapshot outranks rounded finished log");
assert.equal(precise.musicOffsetMs,1500);
const fallback=model.makePausedSession(7,{minutes:12,finishedAt:justFinished},null);
assert.equal(fallback.elapsedMs,720000,"Existing accidental closure without live snapshot remains recoverable");
assert.equal(fallback.paused,true);

class Fake {
 constructor(tag="",id=""){
  this.tagName=tag;this.id=id;this.children=[];this.open=false;
  this.hidden=false;this.onclick=null;this.style={};this.textContent="";
  this.className="";
 }
 append(...children){this.children.push(...children);return undefined}
 after(child){this.afterChild=child}
 close(){this.open=false}
 showModal(){this.open=true}
 querySelector(q){
  if(this.id==="feedbackDialog"&&q===".actions")return feedbackActions;
  if(this.id==="reading"&&q===".frame")return frame;
  if(this.id==="logHistory"&&q===".log-card .actions")return logActions;
  return null;
 }
}
const slug="descent-of-angels",state={
 activeBookSlug:slug,active:null,done:{1:{minutes:17},6:{minutes:23},7:structuredClone(localRecord)},
 books:{[slug]:{done:{},pendingReopens:{}}},
 spotify:{}
};
const player=new Fake("div","now"),finish=new Fake("button","finishBtn");
const feedback=new Fake("dialog","feedbackDialog");
const reading=new Fake("div","reading"),frame=new Fake("main","frame");
const feedbackActions=new Fake("div","feedbackActions"),logActions=new Fake("div","logActions");
const logHistory=new Fake("div","logHistory");
let rendered=0,saved=0,view="settings",target=null;
const dialogs={};
const document={
 getElementById(id){return {now:player,finishBtn:finish,feedbackDialog:feedback,logHistory}[id]||null},
 querySelector(q){return q==='[data-view-panel="reading"]'?reading:null},
 createElement(tag){return new Fake(tag)},
 body:{append(el){dialogs[el.id]=el}}
};
const ctx={window:{},document,state,HSBooks:{
 unitLabel:(book,n)=>"Capítulo "+(n-1)
},render(){rendered++},renderLogs(){},openLog(n){target=n;feedback.open=true},
 setView(n){view=n},toast(){},elapsed(){return state.active?.elapsedMs||0},
 save(){
  saved++;
  state.books[slug].done=structuredClone(state.done);
  state.books[slug].active=state.active?structuredClone(state.active):null;
 },target};
finish.onclick=function(){
 const c=state.active.chapter;
 state.done[c]={minutes:Math.round(state.active.elapsedMs/60000),finishedAt:new Date().toISOString()};
 state.active=null;ctx.target=c;ctx.openLog(c);ctx.render();
};
vm.runInNewContext(script,ctx);
assert(ctx.window.HSReadingRecovery);
ctx.window.HSReadingRecovery.offerReopen(7);
assert(dialogs.hsConfirmReopen.open,"Recovery must ask before altering a chapter");
assert(state.done[7],"No changes until user explicitly confirms reopening");
dialogs.hsConfirmReopen.children[2].children[1].onclick();
assert.equal(state.done[7],undefined,"Accidental log no longer counts as completed");
assert.equal(state.active.chapter,7);
assert.equal(state.active.paused,true);
assert.equal(state.active.elapsedMs,712345);
assert.equal(state.books[slug].pendingReopens[7].record.notes,"Nota preservada");
assert.equal(state.books[slug].done[7],undefined,"Saved book state must match reopened progress");
assert.equal(view,"reading");
assert(saved>0&&rendered>0);
// A single finish click cannot close the reopened session.
finish.onclick();
assert(dialogs.hsConfirmFinish.open);
assert.equal(state.active.chapter,7);
assert.equal(state.done[7],undefined);
dialogs.hsConfirmFinish.children[2].children[0].onclick();
assert.equal(state.active.chapter,7,"Cancel must preserve reading");
finish.onclick();
dialogs.hsConfirmFinish.children[2].children[1].onclick();
assert.equal(state.active,null,"Explicit confirmation finally closes the reading session");
assert.equal(state.done[7].notes,"Nota preservada","Reopened notes survive the final completion");
assert.equal(state.books[slug].pendingReopens[7],undefined,"Cloud tombstone clears only on real finish");

const html=read("index.html"),foundation=read("scripts/reader-foundation.js"),
 resume=read("scripts/spotify-chapter-resume.js"),skin=read("styles/themes/horus-heresy.css"),
 sw=read("sw.js"),build=read("scripts/app-build.js");
assert(html.includes('<body class="hs-reader-ux" data-hs-ui-series="warhammer-30k">'));
assert(html.indexOf('id="hs-reader-foundation-css"')<html.indexOf("</head>"));
assert(html.indexOf('id="hs-theme-horus-heresy"')<html.indexOf("</head>"));
assert(html.includes('src="./scripts/reading-recovery.js"'));
assert(sw.includes('"./scripts/reading-recovery.js"')&&sw.includes('heresy-score-v0183'));
assert(build.includes('version:"0.18.3"'));
assert(foundation.includes('if(recovered)controls.append(recovered)'));
assert(resume.includes('controls.id="hsRestoreControls"'));
assert(resume.includes('resumeFromSavedPoint')&&resume.includes('saved?.playlistId===entry.id'));
assert(skin.includes("#now.hs-mini .now-controls>.hs-restore-controls"));
assert(skin.includes("border-radius:0!important"),"Classic square edges should override rounded UI");
assert(html.includes('pendingReopens?.[r.chapter]&&!state.done?.[r.chapter]'),
 "Cloud pull must not resurrect a reopened chapter");
console.log("PASS accidental completion guard, exact-time reopen, cloud conflict protection, Spotify seek restore and first-paint classic theme.");
