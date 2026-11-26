/* node tests/bookvi-read-ahead.js
   No network/Spotify account. Tests 3-slot auto preflight and guardrails. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"../scripts/bookvi-read-ahead.js"),"utf8");
const events={},timers=[],status={textContent:""},retry={disabled:false,onclick:null};
const panel={innerHTML:"",hidden:false,style:{},querySelector:s=>s==="#hsReadAheadStatus"?status:retry};
const document={visibilityState:"visible",getElementById:()=>({before(){}}),createElement:()=>panel,
 addEventListener:(name,fn)=>{events["document:"+name]=fn}};
const window={addEventListener:(name,fn)=>{events[name]=fn}};
const state={activeBookSlug:"descent-of-angels",active:null,done:{},spotify:{
 playlists:{},chapterRuntime:{},auditResults:{},playlistId:"old",playlistUrl:"old-url"
}};
const books={VI:"descent-of-angels",unitLabel:(_,n)=>n===1?"Prelude":"Capítulo "+(n-1)};
const chapters=Array.from({length:25},(_,i)=>({number:i+1,title:i?"CHAPTER "+i:"PRELUDE"}));
const SCORES=Object.fromEntries(Array.from({length:25},(_,i)=>[i+1,[["Cue "+(i+1),"Composer"]]]));
let calls=[],renders=0;
const ctx={window,document,state,HSBooks:books,chapters,SCORES,
 spotifyConnected:()=>true,
 spotifySyncChapter:async n=>{calls.push(n);state.spotify.chapterRuntime[n]={verified:true,status:"WITHIN_RANGE",durationMs:1000,targetMs:1000}},
 save(){},render(){renders++},
 setTimeout(fn){timers.push(fn);return timers.length},clearTimeout(){}};
window.HSScoreReadiness={spotifyPrepared:n=>state.spotify.chapterRuntime[n]?.verified===true};
vm.runInNewContext(source,ctx);
(async()=>{
 assert.equal(window.HSBookVIReadAhead.windowSize,3);
 assert(timers.length>0,"First authenticated foreground launch schedules an automatic preflight");
 await window.HSBookVIReadAhead.prepare(true);
 assert.equal(calls.join(","),"1,2,3","Only three upcoming units are prepared");
 assert.equal(state.spotify.playlistId,"old","Read-ahead must not steal the active Spotify pointer");
 assert.equal(state.spotify.playlistUrl,"old-url");
 assert.match(status.textContent,/Verificadas 3\/3/);
 await window.HSBookVIReadAhead.prepare();
 assert.equal(calls.join(","),"1,2,3","Do not repeat successful audits on render");
 state.done[1]={minutes:17};state.done[2]={minutes:22};state.done[3]={minutes:23};
 await window.HSBookVIReadAhead.prepare(true);
 assert.equal(calls.join(","),"1,2,3,4,5,6","After Prelude and Chapters 1–2, prepare Chapters 3–5 (indices 4–6)");
 assert.match(status.textContent,/Verificadas 3\/3/,"Next three Spotify units verified");
 await window.HSBookVIReadAhead.prepare();
 assert.equal(calls.join(","),"1,2,3,4,5,6","No duplicate preflights");
 state.done[4]={minutes:25};
 await window.HSBookVIReadAhead.prepare(true);
 assert.equal(calls.join(","),"1,2,3,4,5,6,7","Now prepare Chapter 6 after Chapter 3");
 state.active={chapter:5};await window.HSBookVIReadAhead.prepare(true);
 assert.equal(calls.join(","),"1,2,3,4,5,6,7","No Spotify mutation during active reading");
 console.log("PASS auto-three preflight, logged completion, restored pointer, and no in-reading mutation.");
})().catch(e=>{console.error(e);process.exitCode=1});
