/* Keep published cue sheets independent of the reading-progress state.
   Once a chapter was verified in Spotify, its original private playlist is
   reused without resolving every track again. Source changes invalidate cache. */
(()=>{
"use strict";
const slug=HSBooks.V;
function signature(n){return JSON.stringify(SCORES[n]||[])}
function playlistKey(n){return slug+":"+n}
const originalSync=spotifySyncChapter;
spotifySyncChapter=async function(n){
 if(state.activeBookSlug!==slug)return originalSync(n);
 const key=playlistKey(n),entry=state.spotify.playlists?.[key];
 const current=signature(n);
 if(entry?.id&&entry.scoreSignature===current&&entry.preflightComplete){
  state.spotify.playlistId=entry.id;
  state.spotify.playlistUrl=entry.url||"https://open.spotify.com/playlist/"+entry.id;
  const runtime=state.spotify.chapterRuntime=state.spotify.chapterRuntime||{};
  if(!runtime[n]&&entry.durationMs!=null)
    runtime[n]={durationMs:entry.durationMs,finalCueIndex:entry.finalCueIndex,trackCount:entry.trackCount};
  save();
  return entry.id;
 }
 const id=await originalSync(n);
 if(state.activeBookSlug!==slug)return id;
 const play=state.spotify.playlists?.[key],runtime=state.spotify.chapterRuntime?.[n];
 if(play&&play.id===id){
  play.scoreSignature=current;
  play.preflightComplete=true;
  if(runtime){play.durationMs=runtime.durationMs;play.finalCueIndex=runtime.finalCueIndex;play.trackCount=runtime.trackCount;}
  save();
 }
 return id;
};
window.HSScoreReadiness={
 isPrepared:n=>!!SCORES[n],
 spotifyPrepared:n=>{const p=state.spotify.playlists?.[playlistKey(n)];return !!p?.id&&p.scoreSignature===signature(n)&&!!p.preflightComplete},
 scoreCount:()=>Object.keys(SCORES).length
};
// Never alter state.done when new music scores are published.
const baseRender=render;
render=function(){
 baseRender();
 if(state.activeBookSlug!==slug)return;
 const count=Object.keys(SCORES).filter(k=>+k>=1&&+k<=25).length;
 const progress=document.getElementById("progressText");
 if(progress)progress.textContent=Object.keys(state.done||{}).length+" / 25 lidos // "+count+" trilhas preparadas";
 const ready=[...chapters].find(c=>!state.done?.[c.number]&&(c.number===1||state.done?.[c.number-1]));
 const info=document.getElementById("directive");
 if(info&&!state.active&&ready){
  info.textContent=!!SCORES[ready.number]
    ?"FULGRIM // CHAPTER "+String(ready.number).padStart(2,"0")+" // TRILHA JÁ PREPARADA"
    :"FULGRIM // Próximo capítulo ainda sem trilha";
 }
};
render();
})();