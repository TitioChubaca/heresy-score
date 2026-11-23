/* node tests/bookvi-prelude-spotify.js
   Exact-URI and search-resolution QA for the first 6 Book VI units.
   Fake Spotify only; no account access, audio, tokens or book spoilers. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
function makeScenario(problem){
 const window={dispatchEvent(){}},ctx={
  window,state:{activeBookSlug:"descent-of-angels",active:null,spotify:{
   playlists:{},chapterRuntime:{},auditResults:{},scoreDurations:{}
  }},
  HSBooks:{VI:"descent-of-angels",unitLabel:(_,n)=>n===1?"Prelude":"Capítulo "+(n-1)},
  spotifySyncChapter:async()=>{throw Error("Legacy Spotify flow must not handle Book VI")},
  CustomEvent:function(_,o){this.detail=o.detail},save(){},setTimeout
 };
 vm.runInNewContext(read("scripts/editorial-score-engine.js"),ctx);
 vm.runInNewContext(read("data/descent-of-angels.js"),ctx);
 const data=window.HS_DESCENT_DATA;
 ctx.SCORES=data.scores;ctx.SCORE_META=data.scoreMeta;
 const tracks=new Map(),lookup=new Map();
 let auto=0;
 for(let n=1;n<=6;n++)for(const cue of data.scoreMeta[n].recordingReferences){
  const key=cue.title+"|"+cue.artist;
  let uri=cue.uri||lookup.get(key);
  if(!uri){
   auto++;
   uri="spotify:track:"+String(auto).padStart(22,"0");
  }
  lookup.set(key,uri);
  if(!tracks.has(uri))tracks.set(uri,{
   uri,name:cue.title,artists:[{name:cue.artist}],
   duration_ms:(cue.durationApproxSeconds+
    (problem==="long"&&cue.title==="Majula"?180:0))*1000
  });
 }
 const prelude=data.scoreMeta[1].recordingReferences;
 if(problem==="artist")tracks.get(prelude[0].uri).artists[0].name="Unknown Artist";
 const actual=new Map();
 let writes=0,created=0;
 ctx.spotifyResolveTrack=async(name,artist)=>lookup.get(name+"|"+artist);
 ctx.spotifyEnsurePlaylist=async n=>{
  const key="descent-of-angels:"+n;
  if(!ctx.state.spotify.playlists[key]){
   created++;
   ctx.state.spotify.playlists[key]={
    id:"test_playlist_"+n,
    url:"https://open.spotify.com/playlist/test_playlist_"+n
   };
  }
  return {id:"test_playlist_"+n};
 };
 ctx.spotifyApi=async(endpoint,opt={})=>{
  if(endpoint.startsWith("/tracks/"))return tracks.get("spotify:track:"+endpoint.split("/").pop());
  const m=endpoint.match(/^\/playlists\/test_playlist_(\d+)\/items/);
  if(m){
   const n=Number(m[1]);
   if(opt.method==="PUT"){
    writes++;
    actual.set(n,JSON.parse(opt.body).uris.slice());
    return {snapshot_id:"fake"+writes};
   }
   return {items:(actual.get(n)||[]).map(uri=>({item:tracks.get(uri)})),next:null};
  }
  throw Error("Unmocked Spotify API: "+endpoint);
 };
 vm.runInNewContext(read("scripts/spotify-bookvi-pilot.js"),ctx);
 return {ctx,data,metrics:()=>({writes,created,tracksByUnit:[1,2,3,4,5,6].map(n=>(actual.get(n)||[]).length)})};
}
(async()=>{
 const ok=makeScenario();
 assert.equal(ok.data.chapters[0].unitId,"prelude");
 assert.equal(ok.data.chapters[1].unitId,"ch01");
 assert.equal(ok.data.chapters[2].unitId,"ch02");
 assert.equal(Object.keys(ok.data.scores).join(","),"1,2,3,4,5,6");
 assert.equal(ok.data.scoreMeta[1].editorialStatus,"PILOT_FULL_AUDIO_UNVERIFIED");
 for(let n=1;n<=6;n++){
  await ok.ctx.spotifySyncChapter(n);
  const runtime=ok.ctx.state.spotify.chapterRuntime[n];
  assert.equal(runtime.verified,true);
  assert.equal(runtime.status,"WITHIN_RANGE");
  assert.equal(runtime.trackCount,({1:6,2:8,3:8,4:9,5:6,6:8})[n]);
  const expected=ok.data.scoreMeta[n].recordingReferences
    .reduce((sum,c)=>sum+c.durationApproxSeconds*1000,0);
  assert.equal(runtime.durationMs,expected,"Exactly the authored full recordings must be confirmed");
  assert(Math.abs(runtime.durationMs-runtime.targetMs)<=60000);
  assert.equal(ok.ctx.state.spotify.playlists["descent-of-angels:"+n].sourceVerifiedBy,"0.17.7");
 }
 assert.equal(ok.metrics().writes,6);
 assert.equal(ok.metrics().created,6);
 assert.deepEqual(ok.metrics().tracksByUnit,[6,8,8,9,6,8]);
 for(let n=1;n<=6;n++)await ok.ctx.spotifySyncChapter(n);
 assert.equal(ok.metrics().writes,6,"Repeat preflight must not rewrite preverified playlists");
 assert.equal(ok.metrics().created,6,"Repeat preflight must not duplicate playlists");
 const wrong=makeScenario("artist");
 await assert.rejects(()=>wrong.ctx.spotifySyncChapter(1),/Gravação indisponível\/divergente/i);
 assert.equal(wrong.metrics().writes,0);
 assert.equal(wrong.metrics().created,0);
 const tooLong=makeScenario("long");
 await assert.rejects(()=>tooLong.ctx.spotifySyncChapter(1),/(?:validação editorial|fora da meta)/i);
 assert.equal(tooLong.metrics().writes,0);
 assert.equal(tooLong.metrics().created,0);
 await assert.rejects(()=>ok.ctx.spotifySyncChapter(7),/curadoria musical piloto/i);
 console.log("PASS Book VI six pilots with three-unit buffer: exact/resolved recordings, duration, readback, idempotence, fail-closed and future-sealing.");
})().catch(err=>{console.error(err);process.exitCode=1});
