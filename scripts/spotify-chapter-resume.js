/* Heresy Score: explicit resume of the book's own Spotify playlist at the
   reading timer, even after listening to unrelated music in Spotify.
   Never changes other audio until the reader taps the button. */
(()=>{
"use strict";
const now=document.getElementById("now");if(!now)return;
const b=document.createElement("button");b.type="button";b.className="btn primary";
b.id="hsRestoreChapterMusic";b.textContent="Retomar trilha no ponto da leitura";
b.style.cssText="margin:8px 4px 4px 0";
const info=document.createElement("div");info.className="small";
info.id="hsRestoreChapterStatus";info.setAttribute("aria-live","polite");
info.style.margin="5px 0 9px";info.textContent="Se você ouviu outras músicas, retome a trilha no tempo do cronômetro.";
const controls=document.createElement("div");controls.style.cssText="display:flex;flex-wrap:wrap;gap:5px";
const minus=document.createElement("button"),plus=document.createElement("button");
minus.type=plus.type="button";minus.className=plus.className="btn";
minus.textContent="−30s";plus.textContent="+30s";minus.disabled=plus.disabled=true;
controls.append(b,minus,plus);now.append(controls,info);
let lastTarget=null,busy=false;
function clock(ms){const n=Math.max(0,Math.floor(ms/1000));return Math.floor(n/60)+":"+String(n%60).padStart(2,"0")}
function mySession(){return state.activeBookSlug+"::"+state.active?.chapter}
function currentPlaylist(){
 const chapter=state.active?.chapter,slug=state.activeBookSlug||HSBooks.IV;
 return state.spotify.playlists?.[slug+":"+chapter]||null;
}
async function playlistTracks(id){
 // The playlist itself is authoritative: trackCache may represent other markets,
 // old playlist revisions, or a previous chapter's curated music.
 const list=[],limit=100;
 for(let offset=0;offset<500;offset+=limit){
  const page=await spotifyApi("/playlists/"+encodeURIComponent(id)+"/items?limit="+limit+"&offset="+offset);
  const items=page?.items||[];
  for(const entry of items){
   const t=entry?.item||entry?.track;
   if(t?.type==="track"&&t.uri&&Number.isFinite(t.duration_ms))
    list.push({uri:t.uri,title:t.name||"",durationMs:Math.max(0,t.duration_ms)});
  }
  if(items.length<limit||!page?.next)break;
 }
 return list;
}
function locate(tracks,milliseconds){
 let left=Math.max(0,Math.floor(milliseconds));
 for(let i=0;i<tracks.length;i++){
  const duration=tracks[i].durationMs;
  if(left<duration||i===tracks.length-1)
   return {index:i,positionMs:Math.max(0,Math.min(left,Math.max(0,duration-1000))),title:tracks[i].title};
  left-=duration;
 }
 return {index:0,positionMs:0,title:tracks[0]?.title||""};
}
async function restore(delta){
 if(busy||!state.active)return;
 if(!spotifyConnected()){info.textContent="Conecte sua conta Spotify antes de retomar.";return}
 const session=mySession(),chapter=state.active.chapter,at=elapsed();
 busy=true;b.disabled=minus.disabled=plus.disabled=true;b.textContent="Sincronizando...";
 try{
  let entry=currentPlaylist();
  if(!entry?.id){
   const id=await spotifySyncChapter(chapter);
   entry=currentPlaylist()||{id};
  }
  if(!entry?.id)throw Error("Playlist deste capítulo não encontrada");
  const tracks=await playlistTracks(entry.id);
  if(!tracks.length)throw Error("A playlist está vazia ou não informou durações");
  if(mySession()!==session)throw Error("Sessão alterada");
  // User-adjusted delta persists only within the current reading session.
  const previous=Number(state.active.musicOffsetMs)||0;
  const adjust=delta?previous+delta:previous;
  const desired=Math.max(0,at+adjust);
  const target=locate(tracks,desired);
  const device=await spotifyResolveDevice();
  if(!device?.id)throw Error("Abra o Spotify neste aparelho para ativar um dispositivo e tente novamente");
  if(mySession()!==session)throw Error("Sessão alterada");
  await spotifyApi("/me/player/play?device_id="+encodeURIComponent(device.id),{
   method:"PUT",body:JSON.stringify({
    context_uri:"spotify:playlist:"+entry.id,
    offset:{position:target.index},position_ms:target.positionMs
   })
  });
  if(mySession()!==session)return;
  state.active.musicOffsetMs=adjust;
  state.active.musicRestoredAt=new Date().toISOString();
  state.active.musicRestoredTrack=target.index;
  state.active.musicRestoredPositionMs=target.positionMs;
  state.spotify.playlistId=entry.id;
  state.spotify.playlistUrl=entry.url||"https://open.spotify.com/playlist/"+entry.id;
  state.spotify.deviceActive=true;
  // This is a deliberate resume action. If the reading timer is paused,
  // resume it only after Spotify accepts the command.
  if(state.active.paused){
   state.active.paused=false;state.active.resumedAt=Date.now();
   state.active.pausedAt=null;
  }
  lastTarget={session,index:target.index,positionMs:target.positionMs};
  save();renderNow();renderSpotify();refreshPlayer();
  info.textContent="Retomada: faixa "+(target.index+1)+" aos "+clock(target.positionMs)+" · cronômetro "+clock(at)+". Ajuste ±30s se necessário.";
  minus.disabled=plus.disabled=false;
 }catch(e){
  info.textContent="Não foi possível posicionar a trilha: "+(e.message||e)+". O cronômetro foi preservado.";
 }finally{busy=false;b.disabled=false;b.textContent="Retomar trilha no ponto da leitura"}
}
// The existing Resume button must NOT resume unrelated Spotify music.
const originalToggle=toggleSessionPause;
toggleSessionPause=async function(){
 if(state.active?.paused&&spotifyConnected())return restore(0);
 return originalToggle();
};
const pauseButton=document.getElementById("pauseBtn");
if(pauseButton)pauseButton.onclick=toggleSessionPause;
b.onclick=()=>restore(0);
minus.onclick=()=>restore(-30000);plus.onclick=()=>restore(30000);
const previousRender=renderNow;
renderNow=function(){
 previousRender();
 const active=!!state.active;
 b.style.display=controls.style.display=active?"":"none";
 info.style.display=active?"":"none";
 if(!active){lastTarget=null;minus.disabled=plus.disabled=true}
};
renderNow();
window.HSResumeScore={locate,restore};
})();