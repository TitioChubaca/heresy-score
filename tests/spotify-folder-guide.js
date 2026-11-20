/* node tests/spotify-folder-guide.js
   The Spotify folder itself is client-only. We test safe linking of a
   user-owned empty playlist, never overwriting another chapter's music. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"../scripts/spotify-folder-guide.js"),"utf8");
const playlistId="0123456789abcdefghijAB";
function scenario({foreign=false,filled=false,usedElsewhere=false}={}){
 const elements={};
 const input={value:"https://open.spotify.com/playlist/"+playlistId};
 const status={textContent:""};
 const button={disabled:false};
 const panel={append(){}};
 const wrapper={innerHTML:"",querySelector:selector=>{
  if(selector==="#hsSpotifyFolderPlaylistLink")return input;
  if(selector==="#hsSpotifyFolderResult")return status;
  if(selector==="#hsSpotifyFolderBind")return button;
  return null;
 }};
 const state={active:null,activeBookSlug:"descent-of-angels",done:{},spotify:{playlists:usedElsewhere?{
  "fulgrim:1":{id:playlistId}
 }: {}}};
 let hidden=false,requests=0,saved=0;
 const ctx={
  document:{querySelector:selector=>selector==='[data-view-panel="settings"]'?panel:null,createElement:()=>wrapper},
  state,HSBooks:{VI:"descent-of-angels",unitLabel:()=>"Prelude"},
  chapters:[{number:1}],SCORES:{1:[["Majula","Motoi Sakuraba"]]},
  spotifyConnected:()=>true,
  spotifyApi:async(uri,opt)=>{
   requests++;
   if(uri==="/me")return {id:"owner"};
   if(uri.startsWith("/playlists/")&&uri.endsWith("/items?limit=1"))
    return {items:filled?[{item:{uri:"spotify:track:whatever"}}]:[]};
   if(uri.startsWith("/playlists/")){
    if(opt?.method==="PUT"){hidden=JSON.parse(opt.body).public===false;return {}}
    return {id:playlistId,owner:{id:foreign?"someone-else":"owner"},collaborative:false,external_urls:{spotify:"https://open.spotify.com/playlist/"+playlistId}};
   }
   throw Error("Unexpected API "+uri);
  },
  save(){saved++},
  window:{confirm:()=>true}
 };
 vm.runInNewContext(source,ctx);
 return {button,status,state,counts:()=>({saved,hidden,requests})};
}
(async()=>{
 const good=scenario();
 await good.button.onclick();
 assert.equal(good.state.spotify.playlists["descent-of-angels:1"].id,playlistId);
 assert.equal(good.state.spotify.playlists["descent-of-angels:1"].connectedFromUserFolder,true);
 assert.equal(good.counts().hidden,true,"New empty playlist should be made non-public");
 assert.equal(good.counts().saved,1);
 const foreign=scenario({foreign:true});await foreign.button.onclick();
 assert.equal(foreign.state.spotify.playlists["descent-of-angels:1"],undefined);
 assert.match(foreign.status.textContent,/precisa ser sua/i);
 const filled=scenario({filled:true});await filled.button.onclick();
 assert.equal(filled.state.spotify.playlists["descent-of-angels:1"],undefined);
 assert.match(filled.status.textContent,/precisa estar vazia/i);
 const reused=scenario({usedElsewhere:true});await reused.button.onclick();
 assert.equal(reused.state.spotify.playlists["descent-of-angels:1"],undefined);
 assert.match(reused.status.textContent,/já está associada/i);
 console.log("PASS Spotify folder playlist linking: owned/empty/non-public; reject foreign, filled and duplicate.");
})().catch(err=>{console.error(err);process.exitCode=1});
