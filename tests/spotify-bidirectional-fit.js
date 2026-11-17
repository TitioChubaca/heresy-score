/* Run: node tests/spotify-bidirectional-fit.js
   Offline Spotify API simulation. No tokens, network, real playlists or logs. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const code=fs.readFileSync(path.join(__dirname,"../scripts/spotify-runtime-fit.js"),"utf8");
function scenario({durations,target,removable=[],reserve=0,denyWrite=false}){
 const main=durations.map((m,i)=>({uri:"spotify:track:t"+i,name:"Cue "+i,duration_ms:m*60000,artists:[{name:"Composer"}]}));
 const bonus={uri:"spotify:track:extra",name:"Ambient Bridge",duration_ms:reserve*60000,artists:[{name:"Composer"}]};
 const catalog=new Map([...main,bonus].map(t=>[t.uri,t]));
 let items=main.map(t=>t.uri),writes=0;
 const state={activeBookSlug:"fulgrim",active:null,done:{},spotify:{playlists:{"fulgrim:22":{id:"P",url:"https://open.spotify.com/playlist/P"}},trackCache:{}}};
 const ctx={
  state,
  chapters:[{number:22,estimatedMinutes:target}],
  SCORES:{22:main.map(t=>[t.name,"Composer"])},
  SCORE_META:{22:{estimatedMinutes:target,editorialFitPlan:{
   optionalIndexes:removable,
   protectedIndexes:durations.map((_,i)=>i).filter(i=>!removable.includes(i)),
   anchors:[],
   approvedExtensions:reserve?[{afterIndex:1,track:["Ambient Bridge","Composer"],role:"ambient"}]:[]
  }}},
  save(){},setTimeout,CustomEvent:function(_,p){this.detail=p.detail},
  window:{dispatchEvent(){}},
  spotifySyncChapter:async()=>{throw Error("Unexpected legacy sync")},
  spotifyEnsurePlaylist:async()=>({id:"P"}),
  spotifyResolveTrack:async title=>"spotify:track:"+(title==="Ambient Bridge"?"extra":"t"+title.slice(4)),
  spotifyApi:async (endpoint,opt={})=>{
   if(endpoint.startsWith("/tracks/"))return catalog.get("spotify:track:"+endpoint.split("/").pop());
   if(endpoint.includes("/playlists/P/items")){
    if(opt.method==="PUT"){
     if(denyWrite)throw Error("Spotify HTTP 403");
     items=JSON.parse(opt.body).uris;writes++;return {snapshot_id:"s"+writes};
    }
    return {items:items.map(uri=>({item:catalog.get(uri)})),next:null};
   }
   throw Error("Unexpected mock endpoint: "+endpoint);
  }
 };
 vm.runInNewContext(code,ctx,{filename:"spotify-runtime-fit.js"});
 return {state,sync:()=>ctx.spotifySyncChapter(22),stats:()=>({items:[...items],writes})};
}
(async()=>{
 const shorter=scenario({durations:[4,3,4,4],target:18,removable:[1],reserve:3});
 await shorter.sync();assert.equal(shorter.state.spotify.chapterRuntime[22].status,"WITHIN_RANGE");
 assert.equal(shorter.state.spotify.chapterRuntime[22].durationMs,18*60000);
 assert.equal(shorter.stats().items.length,5,"adds only approved atmospheric reserve");
 assert(shorter.stats().items.includes("spotify:track:extra"));
 const longer=scenario({durations:[4,4,4,4,4],target:16,removable:[1]});
 await longer.sync();assert.deepEqual(longer.stats().items,["spotify:track:t0","spotify:track:t2","spotify:track:t3","spotify:track:t4"]);
 const repeat=scenario({durations:[4,4,4,4,4],target:18,removable:[1],reserve:2});
 await repeat.sync();await repeat.sync();
 assert.equal(repeat.stats().writes,1,"audit must be idempotent even when fitted length equals original");
 const impossible=scenario({durations:[4,4,4],target:19});
 await assert.rejects(()=>impossible.sync(),/TRILHA CURTA.*Nenhuma correção declarada/i);
 assert.equal(impossible.stats().writes,0,"never write arbitrary music to meet target");
 const forbidden=scenario({durations:[4,3,4,4],target:18,removable:[1],reserve:3,denyWrite:true});
 await assert.rejects(()=>forbidden.sync(),/GRAVAR.*403/i);
 assert.equal(forbidden.stats().writes,0);
 assert.equal(forbidden.state.spotify.chapterRuntime[22].status,"FAILED");
 console.log("PASS bidirectional fitting, protected cues, verified read-back, idempotence, impossible-fit and 403 diagnostics.");
})().catch(err=>{console.error(err);process.exitCode=1});
