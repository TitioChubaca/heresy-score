/* Heresy Score 0.18.3 — deliberate finishing and lossless reopen.
   UI-only change: existing logs, Spotify playlists and cloud schema remain
   authoritative. Never delete an archived record without keeping a copy. */
(()=>{
"use strict";
const copy=value=>JSON.parse(JSON.stringify(value));
const parseTime=x=>Number.isFinite(Date.parse(x||""))?Date.parse(x):null;
function makePausedSession(chapter,record,snapshot,now=Date.now()){
 const previous=snapshot?.active||null;
 let ms=Number(record?.musicTelemetry?.readDurationMs);
 if(!Number.isFinite(ms)||ms<0)ms=Number(record?.minutes)*60000;
 if(previous){
  const precise=Number(snapshot?.elapsedMs);
  if(Number.isFinite(precise)&&precise>=0)ms=precise;
 }
 ms=Number.isFinite(ms)&&ms>=0?Math.round(ms):0;
 const started=parseTime(record?.startedAt)||
  parseTime(previous?.startedAt)||(now-ms);
 const observed=record?.musicTelemetry?.lastSpotifyProgress||
  previous?.lastSpotifyProgress||null;
 return {
  chapter,startedAt:started,resumedAt:now,elapsedMs:ms,paused:true,
  pausedAt:now,currentTrack:previous?.currentTrack||null,
  trackFeedback:copy(previous?.trackFeedback||record?.trackFeedback||[]),
  musicOffsetMs:Number.isFinite(Number(previous?.musicOffsetMs))?
   Number(previous.musicOffsetMs):0,
  lastSpotifyProgress:observed?copy(observed):null,
  resumeFromSavedPoint:!!observed
 };
}
function latestDone(done){
 return Object.keys(done||{}).map(Number).filter(n=>Number.isInteger(n)&&n>0&&done[n])
  .sort((a,b)=>b-a)[0]||null;
}
function recentlyFinished(done,n,now=Date.now()){
 const at=parseTime(done?.[n]?.finishedAt);
 return at!==null&&now>=at&&now-at<=48*60*60*1000;
}
window.HSReadingRecoveryModel={makePausedSession,latestDone,recentlyFinished};
if(typeof document==="undefined")return;

const player=document.getElementById("now");
const finish=document.getElementById("finishBtn");
const feedback=document.getElementById("feedbackDialog");
const reading=document.querySelector('[data-view-panel="reading"]');
if(!player||!finish||!feedback||!reading||typeof render!=="function")return;
const addDialog=(id,title,message,left,right)=>{
 const dlg=document.createElement("dialog");
 dlg.id=id;dlg.className="hs-decision-dialog";
 const heading=document.createElement("h2");heading.textContent=title;
 const description=document.createElement("p");description.textContent=message;
 const actions=document.createElement("div");actions.className="hs-decision-actions";
 const cancel=document.createElement("button");cancel.type="button";
 cancel.className="btn";cancel.textContent=left;
 const accept=document.createElement("button");accept.type="button";
 accept.className="btn primary";accept.textContent=right;
 actions.append(cancel,accept);dlg.append(heading,description,actions);
 document.body.append(dlg);
 cancel.onclick=()=>dlg.close();
 return {dlg,heading,description,accept,cancel};
};
const finishDialog=addDialog("hsConfirmFinish","Concluir este capítulo?",
 "A conclusão encerra o cronômetro. Se você só interrompeu a leitura, escolha Continuar lendo; o tempo e a posição serão preservados.",
 "Continuar lendo","Confirmar conclusão");
let finishingSession=null;
const originalFinish=finish.onclick;
finish.onclick=function(){
 if(!state.active||typeof originalFinish!=="function")return;
 finishingSession={book:state.activeBookSlug,chapter:state.active.chapter,
  startedAt:state.active.startedAt};
 finishDialog.heading.textContent="Concluir "+HSBooks.unitLabel(state.activeBookSlug,state.active.chapter)+"?";
 finishDialog.dlg.showModal();
};
finishDialog.accept.onclick=()=>{
 const current=state.active,match=finishingSession&&current&&
  finishingSession.book===state.activeBookSlug&&
  finishingSession.chapter===current.chapter&&
  finishingSession.startedAt===current.startedAt;
 finishDialog.dlg.close();
 finishingSession=null;
 if(!match)return;
 const slug=state.activeBookSlug,chapter=current.chapter,at=Date.now();
 const lastBook=state.books[slug];
 const snapshot={chapter,book:slug,active:copy(current),elapsedMs:elapsed(),
  closedAt:at};
 lastBook.recentFinishSnapshot=snapshot;
 originalFinish.call(finish);
 // Keep the original record when reopening and then completing it properly.
 const suspended=lastBook.pendingReopens?.[chapter];
 if(suspended&&state.done?.[chapter]){
  const old=suspended.record||{},fresh=state.done[chapter];
  for(const k of ["notes","length","intensity","opening","peak","feedbackIssues"]){
   if(fresh[k]===undefined||fresh[k]==="")if(old[k]!==undefined)fresh[k]=copy(old[k]);
  }
  delete lastBook.pendingReopens[chapter];
  fresh.cloudSynced=false;
 }
 save();
};

const reopenDialog=addDialog("hsConfirmReopen","Reabrir capítulo?",
 "O registro anterior ficará guardado. O capítulo volta a ficar em andamento com o tempo já lido, mas pausado. O Spotify só tocará quando você pedir.",
 "Cancelar","Reabrir leitura");
let reopenTarget=null;
function offerReopen(n){
 if(state.active||n!==latestDone(state.done)||!state.done?.[n])return;
 reopenTarget={book:state.activeBookSlug,chapter:n};
 reopenDialog.heading.textContent="Reabrir "+HSBooks.unitLabel(state.activeBookSlug,n)+"?";
 reopenDialog.dlg.showModal();
}
reopenDialog.accept.onclick=()=>{
 const request=reopenTarget;reopenTarget=null;reopenDialog.dlg.close();
 if(!request||state.active||request.book!==state.activeBookSlug||
  request.chapter!==latestDone(state.done)||!state.done[request.chapter])return;
 const {book,chapter}=request,b=state.books[book],record=copy(state.done[chapter]);
 const snapshot=b.recentFinishSnapshot?.book===book&&
  b.recentFinishSnapshot?.chapter===chapter?b.recentFinishSnapshot:null;
 const reopened=makePausedSession(chapter,record,snapshot);
 b.pendingReopens=b.pendingReopens||{};
 b.pendingReopens[chapter]={record,reopenedAt:new Date().toISOString()};
 delete state.done[chapter];
 state.active=reopened;
 // Cloud row, if any, is not deleted; restoring an old pull cannot silently
 // re-complete a deliberately reopened chapter (see cloudPullLogs guard).
 if(feedback.open)feedback.close();
 save();render();setView("reading");
 toast("Leitura reaberta e pausada. Toque em Retomar trilha no ponto.");
};

const inFeedback=document.createElement("button");
inFeedback.id="hsReopenFromFeedback";inFeedback.type="button";
inFeedback.className="btn hs-reopen-link";inFeedback.textContent="Reabrir leitura";
feedback.querySelector(".actions")?.append(inFeedback);
inFeedback.onclick=()=>{
 const n=typeof target!=="undefined"?target:null;
 if(!n)return;
 if(feedback.open)feedback.close();
 offerReopen(n);
};
const originalOpenLog=openLog;
openLog=function(n){
 const result=originalOpenLog(n);
 inFeedback.hidden=!!state.active||n!==latestDone(state.done);
 return result;
};
const readRecovery=document.createElement("div");readRecovery.id="hsRecentCompletion";
readRecovery.className="hs-recent-completion";readRecovery.hidden=true;
const recoveryText=document.createElement("span");
const recoveryBtn=document.createElement("button");
recoveryBtn.type="button";recoveryBtn.className="btn";
recoveryBtn.textContent="Reabrir capítulo";
readRecovery.append(recoveryText,recoveryBtn);
const frame=reading.querySelector(".frame");
if(frame)frame.after(readRecovery);
function paintRecovery(){
 const n=latestDone(state.done);
 readRecovery.hidden=!!state.active||!n||!recentlyFinished(state.done,n);
 if(!readRecovery.hidden){
  recoveryText.textContent=HSBooks.unitLabel(state.activeBookSlug,n)+
   " foi concluído recentemente. Ainda estava lendo?";
  recoveryBtn.onclick=()=>offerReopen(n);
 }
}
const oldRenderLogs=renderLogs;
renderLogs=function(...args){
 const result=oldRenderLogs(...args);
 const latest=latestDone(state.done);
 const actions=document.querySelector("#logHistory .log-card .actions");
 if(!state.active&&latest&&actions&&!actions.querySelector(".hs-reopen-log")){
  const button=document.createElement("button");button.type="button";
  button.className="btn hs-reopen-log";button.textContent="Reabrir leitura";
  button.onclick=()=>offerReopen(latest);actions.append(button);
 }
 return result;
};
const oldRender=render;
render=function(...args){
 const result=oldRender(...args);
 paintRecovery();
 if(typeof target!=="undefined")inFeedback.hidden=
  !!state.active||target!==latestDone(state.done);
 return result;
};
paintRecovery();
window.HSReadingRecovery={offerReopen,version:"0.18.3"};
})();
