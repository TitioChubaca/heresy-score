/* node tests/bookvi-prelude-spotify.js
   Fake authenticated Spotify API. Never edits real playlists or stores tokens. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
function makeScenario(problem){
 const window={dispatchEvent(){}},ctx={
  window,
  state:{activeBookSlug:"descent-of-angels",active:null,spotify:{
   playlists:{},chapterRuntime:{},auditResults:{},scoreDurations:{}
  }},
  HSBooks:{VI:"descent-of-angels"},
  spotifySyncChapter:async()=>{throw Error("Legacy Spotify flow must not handle Book VI")},
  CustomEvent:function(_,o){this.detail=o.detail},
  save(){},
  setTimeout
 };
 vm.runInNewContext(read("scripts/editorial-score-engine.js"),ctx);
 vm.runInNewContext(read("data/descent-of-angels.js"),ctx);
 const d=window.HS_DESCENT_DATA;ctx.SCORES=d.scores;ctx.SCORE_META=d.scoreMeta;
 const references=d.scoreMeta[1].recordingReferences;
 const songs=new Map(references.map(ref=>[ref.uri,{
  uri:ref.uri,name:ref.title,artists:[{name:ref.artist}],
  duration_ms:(ref.durationApproxSeconds+(problem==="long"&&ref.title==="Majula"?180:0))*1000
 }]));
 if(problem==="artist")songs.get(references[0].uri).artists[0].name="Unknown Artist";
 let actual=[],writes=0,created=0;
 ctx.spotifyEnsurePlaylist=async n=>{
  const key="descent-of-angels:"+n;
  if(!ctx.state.spotify.playlists[key]){
   created++;
   ctx.state.spotify.playlists[key]={id:"test_playlist",url:"https://open.spotify.com/playlist/test_playlist"};
  }
  return {id:"test_playlist"};
 };
 ctx.spotifyApi=async(endpoint,opt={})=>{
  if(endpoint.startsWith("/tracks/"))return songs.get("spotify:track:"+endpoint.split("/").pop());
  if(endpoint.startsWith("/playlists/test_playlist/items")){
   if(opt.method==="PUT"){writes++;actual=JSON.parse(opt.body).uris.slice();return {snapshot_id:"fake"+writes}}
   return {items:actual.map(uri=>({item:songs.get(uri)})),next:null};
  }
  throw Error("Unmocked Spotify API: "+endpoint);
 };
 vm.runInNewContext(read("scripts/spotify-bookvi-pilot.js"),ctx);
 return {ctx,d,metrics:()=>({writes,created,actual:[...actual]})};
}
(async()=>{
 const ok=makeScenario();
 assert.equal(ok.d.chapters[0].unitId,"prelude");
 assert.equal(ok.d.chapters[1].unitId,"ch01");
 assert.equal(Object.keys(ok.d.scores).length,1,"Only Prelude should have a published candidate score");
 assert.equal(ok.d.scoreMeta[1].editorialStatus,"PILOT_UNLISTENED");
 await ok.ctx.spotifySyncChapter(1);
 const runtime=ok.ctx.state.spotify.chapterRuntime[1];
 assert.equal(runtime.verified,true);
 assert.equal(runtime.status,"WITHIN_RANGE");
 assert.equal(runtime.durationMs,998000,"The six original Spotify references should total 16:38");
 assert.equal(runtime.targetMs,Math.round(3238/197*60000));
 assert.equal(ok.ctx.state.spotify.playlists["descent-of-angels:1"].sourceVerifiedBy,"0.17.3");
 await ok.ctx.spotifySyncChapter(1);
 assert.equal(ok.metrics().writes,1,"Repeat audit should reuse the identical playlist and avoid rewriting");
 assert.equal(ok.metrics().created,1,"Repeat audit must not create a second playlist");
 assert.equal(ok.metrics().actual.length,6);
 const invalid=makeScenario("artist");
 await assert.rejects(()=>invalid.ctx.spotifySyncChapter(1),/Gravação indisponível\/divergente/i);
 assert.equal(invalid.metrics().writes,0);
 assert.equal(invalid.metrics().created,0);
 assert.equal(invalid.ctx.state.spotify.chapterRuntime[1].verified,false);
 const long=makeScenario("long");
 await assert.rejects(()=>long.ctx.spotifySyncChapter(1),/(?:validação editorial|fora da meta)/i);
 assert.equal(long.metrics().created,0);
 assert.equal(long.metrics().writes,0);
 await assert.rejects(()=>ok.ctx.spotifySyncChapter(2),/unidades futuras continuam protegidas/i);
 console.log("PASS Book VI: six original track URIs, exact readback, no duplicates, fail-closed checks, spoiler-locked future.");
})().catch(err=>{console.error(err);process.exitCode=1});
