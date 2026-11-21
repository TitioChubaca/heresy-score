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
const SCORES={1:[["A","C"]],2:[["B","C"]],3:[["C","C"]]};
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
 state.done[1]={minutes:16};
 await window.HSBookVIReadAhead.prepare(true);
 assert.equal(calls.join(","),"1,2,3","Previously verified future units are reused");
 assert.match(status.textContent,/curadoria musical ainda pendente/,"When buffer exceeds available pilot, show an honest gap");
 state.active={chapter:2};await window.HSBookVIReadAhead.prepare(true);
 assert.equal(calls.join(","),"1,2,3","Never modify playlists during active reading");
 console.log("PASS auto-three preflight, logged completion, restored pointer, and no in-reading mutation.");
})().catch(e=>{console.error(e);process.exitCode=1});
