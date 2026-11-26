/* Book VI: self-maintaining THREE-UNIT Spotify preparation window.
   Runs only in an authenticated, visible, idle foreground browser session.
   Never runs in a service worker or starts audio/reading. Never invents
   scores or claims technical verification without exact Spotify read-back. */
(()=>{
"use strict";
const BOOK=HSBooks.VI,WINDOW=3;
let inFlight=null,scheduled=null,lastAttemptedKey="";
const section=document.createElement("section");
section.className="panel";section.id="hsBookVIReadAhead";
section.style.cssText="margin:12px 0;line-height:1.6";
section.innerHTML='<div class="hs-prep-heading"><strong>Playlists dos próximos capítulos</strong>'+
 '<span class="hs-prep-label">Spotify</span></div>'+
 '<div id="hsReadAheadStatus" role="status" aria-live="polite"></div>'+
 '<details class="hs-prep-log"><summary>Ver capítulos e pendências</summary>'+
 '<div id="hsReadAheadVerbose" class="small"></div>'+
 '<p class="small">A verificação confirma músicas, ordem e duração, não aprovação artística. O app não inicia a reprodução.</p></details>'+
 '<button class="btn" id="hsReadAheadRetry" type="button">Reverificar trilhas</button>';
const chapterHost=document.getElementById("chapters");
if(chapterHost)chapterHost.before(section);
const label=section.querySelector("#hsReadAheadStatus");
const verbose=section.querySelector("#hsReadAheadVerbose");
const retry=section.querySelector("#hsReadAheadRetry");
const reviewed=n=>n<7||typeof SCORE_META!=="undefined"&&SCORE_META[n]?.sceneReview?.reviewed===true;
const currentUnits=()=>{
 const index=chapters.findIndex(c=>!state.done?.[c.number]);
 return index<0?[]:chapters.slice(index,index+WINDOW);
};
function verified(n){
 return !!window.HSScoreReadiness?.spotifyPrepared?.(n);
}
function clock(ms){
 const seconds=Math.round(ms/1000);
 return Math.floor(seconds/60)+":"+String(seconds%60).padStart(2,"0");
}
function details(extra=""){
 section.hidden=state.activeBookSlug!==BOOK;
 if(section.hidden)return;
 const items=currentUnits();
 const content=items.map(c=>{
  const ready=verified(c.number),aud=state.spotify.auditResults?.[c.number],runtime=state.spotify.chapterRuntime?.[c.number];
  return HSBooks.unitLabel(BOOK,c.number)+": "+(
   ready&&runtime?.durationMs&&runtime?.targetMs?
    "Spotify confirmado "+clock(runtime.durationMs)+" / "+clock(runtime.targetMs):
   !reviewed(c.number)?"mapeamento narrativo em revisão":
   aud?.status==="FAILED"?"falha na conferência — "+String(aud.message||"Spotify não confirmou").slice(0,150):
   SCORES[c.number]?"músicas selecionadas; aguardando Spotify":"curadoria musical pendente");
 });
 const confirmed=items.filter(c=>verified(c.number)).length;
 const pending=items.length-confirmed;
 label.textContent="Verificadas "+confirmed+"/"+items.length+
  (pending?" · "+pending+" pendente"+(pending===1?"":"s"):" · Prontas para abrir");
 if(verbose)verbose.textContent=content.join(" | ")+(extra?" | "+extra:"");
}
async function prepare(force=false){
 if(state.activeBookSlug!==BOOK||state.active||!spotifyConnected()||
    typeof document!=="undefined"&&document.visibilityState==="hidden"){
  details(!spotifyConnected()?"Spotify desconectado: preparação automática indisponível.":"");
  return false;
 }
 if(inFlight)return inFlight;
 const windowUnits=currentUnits();
 const key=windowUnits.map(c=>c.number).join(",")+"|"+
  windowUnits.map(c=>JSON.stringify(SCORES[c.number]||[])).join("|");
 if(!force&&key===lastAttemptedKey){details();return false}
 lastAttemptedKey=key;
 retry.disabled=true;
 const job=(async()=>{
  const activeSlug=state.activeBookSlug,oldId=state.spotify.playlistId,oldUrl=state.spotify.playlistUrl;
  let total=0,errors=0;
  try{
   for(const unit of windowUnits){
    if(state.activeBookSlug!==activeSlug||state.active)break;
    const n=unit.number;
    if(!SCORES[n]||!reviewed(n)){
     errors++;details(HSBooks.unitLabel(BOOK,n)+" aguardando revisão narrativa.");
     continue;
    }
    if(verified(n)){total++;details(total+"/"+windowUnits.length+" verificadas.");continue}
    details("Preparando automaticamente "+HSBooks.unitLabel(BOOK,n)+"...");
    try{
     await spotifySyncChapter(n);
     if(!verified(n))throw Error("Playlist não passou na verificação de sequência e duração.");
     total++;
    }catch(err){
     errors++;
     details(HSBooks.unitLabel(BOOK,n)+": "+String(err?.message||err).slice(0,160));
    }
   }
  }finally{
   // The three preflights should not leave the player pointing to a FUTURE
   // chapter. Begin() always selects the desired unit explicitly.
   if(state.activeBookSlug===activeSlug&&!state.active){
    state.spotify.playlistId=oldId||"";
    state.spotify.playlistUrl=oldUrl||"";
    save();
   }
   retry.disabled=false;
   details("Verificadas "+total+"/"+windowUnits.length+"; pendências "+errors+
    ". Não houve reprodução automática.");
   if(state.activeBookSlug===BOOK&&typeof render==="function")render();
  }
  return errors===0;
 })();
 inFlight=job;
 try{return await job}finally{inFlight=null}
}
function queue(force=false){
 if(scheduled!==null)clearTimeout(scheduled);
 scheduled=setTimeout(()=>{scheduled=null;prepare(force).catch(err=>details(String(err.message||err)))},900);
}
retry.onclick=()=>queue(true);
const renderBefore=render;
render=function(...args){
 const result=renderBefore(...args);
 details();
 if(state.activeBookSlug===BOOK&&!state.active&&spotifyConnected()){
  const units=currentUnits(),key=units.map(c=>c.number).join(",")+"|"+
   units.map(c=>JSON.stringify(SCORES[c.number]||[])).join("|");
  if(key!==lastAttemptedKey&&!inFlight)queue();
 }
 return result;
};
window.addEventListener("hs-book-changed",()=>{lastAttemptedKey="";details();queue()});
document.addEventListener("visibilitychange",()=>{
 if(document.visibilityState==="visible"){lastAttemptedKey="";queue()}
});
window.addEventListener("pageshow",()=>queue());
window.HSBookVIReadAhead={prepare,details,version:"0.18.2",windowSize:WINDOW};
details();
queue();
})();