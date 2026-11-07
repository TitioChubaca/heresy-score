/* Run: node tests/spotify-runtime-reconciliation.js
 * No Spotify tokens, network calls, reader logs or live playlist edits. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const source=fs.readFileSync(path.join(__dirname,"../scripts/spotify-runtime-fit.js"),"utf8");
function scenario(denied=false){
 const catalog={
  a:{uri:"spotify:track:a",name:"A",duration_ms:100000,artists:[{name:"Artist"}]},
  b:{uri:"spotify:track:b",name:"B",duration_ms:200000,artists:[{name:"Artist"}]},
  c:{uri:"spotify:track:c",name:"C",duration_ms:100000,artists:[{name:"Artist"}]}
 };
 const state={active:null,activeBookSlug:"fulgrim",spotify:{playlists:{
  "fulgrim:12":{id:"P",url:"https://open.spotify.com/playlist/P"}
 }}};
 let playlist=["a","b","c"],puts=0,reads=0;
 const ctx={
  window:{},state,SCORES:{12:[["A","Artist"],["C","Artist"]]},
  SCORE_META:{12:{estimatedMinutes:3.3}},
  save(){},setTimeout,spotifySyncChapter:async()=>{throw Error("Unexpected legacy sync");},
  spotifyEnsurePlaylist:async()=>({id:"P"}),
  spotifyResolveTrack:async title=>"spotify:track:"+title.toLowerCase(),
  spotifyApi:async function(url,opt){
   if(denied&&url.includes("/items")&&!opt)throw Error("Spotify API 403");
   if(url.startsWith("/tracks/"))return catalog[url.split("/").pop()];
   if(url.includes("/items")&&opt?.method==="PUT"){
    puts++;playlist=JSON.parse(opt.body).uris.map(s=>s.split(":").pop());
    return {snapshot_id:"ok"};
   }
   if(url.includes("/items")){
    reads++;return {items:playlist.map(id=>({item:catalog[id]})),next:null};
   }
   throw Error("Unexpected call "+url);
  }
 };
 vm.runInNewContext(source,ctx,{filename:"spotify-runtime-fit.js"});
 return {ctx,state,stats:()=>({playlist,puts,reads})};
}
(async()=>{
 const a=scenario();
 await a.ctx.spotifySyncChapter(12);
 assert.equal(a.stats().puts,1);
 assert.equal(a.stats().playlist.join(","),"a,c");
 assert.equal(a.state.spotify.chapterRuntime[12].verified,true);
 assert.equal(a.state.spotify.chapterRuntime[12].finalCueIndex,1);
 await a.ctx.spotifySyncChapter(12);
 assert.equal(a.stats().puts,1,"second audit should not rewrite");
 const b=scenario();b.state.active={chapter:12};
 await b.ctx.spotifySyncChapter(12);
 assert.equal(b.stats().puts,0,"active session must not be changed");
 const c=scenario(true);
 await assert.rejects(()=>c.ctx.spotifySyncChapter(12),/permissão/i);
 assert.equal(c.state.spotify.chapterRuntime[12].verified,false);
 assert.match(fs.readFileSync(path.join(__dirname,"../index.html"),"utf8"),/playlist-read-private/);
 console.log("PASS: source reconciliation, readback, idempotence, final cue, active-session lock, 403 fail-closed, OAuth scope");
})().catch(err=>{console.error(err);process.exitCode=1});
