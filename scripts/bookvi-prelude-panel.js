/* Book VI Prelude: a persistent user-visible technical QA panel.
   Never claims emotional/narrative approval from a numeric Spotify readback. */
(()=>{
"use strict";
if(typeof render!=="function")return;
const base=render;
const clock=ms=>Math.floor(ms/60000)+":"+String(Math.floor(ms/1000)%60).padStart(2,"0");
function mount(){
 if(state.activeBookSlug!==HSBooks.VI||!SCORES[1])return;
 const list=[...document.querySelectorAll("#chapters .chapter")];
 const card=list.find((node,i)=>chapters[i]?.number===1);
 const actions=card?.querySelector(".actions");
 if(!actions||actions.querySelector(".hs-prelude-audit"))return;
 const button=document.createElement("button");
 button.type="button";button.className="btn hs-prelude-audit";
 button.textContent="Auditar trilha do Prelude";
 const report=document.createElement("div");
 report.className="hs-audit-inline small";
 report.style.cssText="grid-column:1/-1;flex-basis:100%;white-space:normal;padding:12px;border:1px solid #3d5140;background:#0a130c;line-height:1.6;overflow-wrap:anywhere";
 report.setAttribute("role","status");report.setAttribute("aria-live","polite");
 const passed=!!window.HSScoreReadiness?.spotifyPrepared?.(1);
 const info=state.spotify.chapterRuntime?.[1],last=state.spotify.auditResults?.[1];
 if(last?.status==="FAILED"){
  report.style.borderColor="#a54840";
  report.textContent="NÃO CONFIRMADO: "+last.message;
 }else if(passed&&Number.isFinite(info?.durationMs)){
  report.style.borderColor="#65835d";
  report.textContent="CONFIRMADO NO SPOTIFY: "+clock(info.durationMs)+" / alvo "+clock(info.targetMs)+
   " · "+info.trackCount+" músicas. Curadoria PILOTO: qualidade narrativa ainda precisa ser avaliada durante a leitura.";
 }else{
  report.textContent="PILOTO · 6 músicas instrumentais. Referência: 16:38 / alvo estimado 16:26. "+
   "A auditoria confirma gravações, duração e ordem na sua conta. "+
   "A playlist não pública será criada automaticamente ao auditar, ou reutilizada se já existir. Pastas no Spotify são opcionais e exigem organização pelo Spotify.";
 }
 button.onclick=async()=>{
  button.disabled=true;
  button.textContent="Conferindo Spotify...";
  report.style.borderColor="#ac8747";
  report.textContent="Iniciando auditoria do Prelude (sem publicar spoilers)...";
  const onProgress=e=>{
   if(e.detail?.bookSlug!==HSBooks.VI||e.detail?.chapter!==1)return;
   report.textContent=e.detail.message;
   report.style.borderColor=e.detail.phase==="error"?"#a54840":
    e.detail.phase==="success"?"#65835d":"#ac8747";
  };
  window.addEventListener("hs-spotify-audit-progress",onProgress);
  try{
   if(!spotifyConnected())throw Error("Spotify desconectado. Conecte sua conta nas Configurações.");
   await spotifySyncChapter(1);
   if(state.activeBookSlug!==HSBooks.VI)throw Error("Livro alterado durante a auditoria.");
   if(!window.HSScoreReadiness?.spotifyPrepared?.(1))
    throw Error("A API não confirmou uma trilha completa dentro da meta.");
  }catch(err){
   const message=String(err?.message||err);
   state.spotify.auditResults=state.spotify.auditResults||{};
   state.spotify.auditResults[1]={status:"FAILED",at:new Date().toISOString(),message};
   save();
  }finally{
   window.removeEventListener("hs-spotify-audit-progress",onProgress);
   render();
  }
 };
 const cueDetails=document.createElement("details");
 cueDetails.style.cssText="grid-column:1/-1;flex-basis:100%;font-size:12px;border-top:1px solid #354b33;padding:8px 0";
 const summary=document.createElement("summary");
 summary.textContent="Conhecer as seis gravações do piloto (sem spoilers)";
 cueDetails.append(summary);
 for(const [i,cue] of (SCORE_META[1]?.recordingReferences||[]).entries()){
  const item=document.createElement("div");
  item.style.cssText="padding:6px 0;line-height:1.6";
  const link=document.createElement("a");
  link.textContent=(i+1)+". "+cue.title+" — "+cue.artist;
  link.href="https://open.spotify.com/track/"+cue.uri.split(":").pop();
  link.target="_blank";link.rel="noopener noreferrer";link.style.color="#a8db72";
  const role=document.createElement("span");role.textContent=" · "+cue.role+" · "+
   Math.floor(cue.durationApproxSeconds/60)+":"+
   String(cue.durationApproxSeconds%60).padStart(2,"0")+" (referência)";
  item.append(link,role);cueDetails.append(item);
 }
 actions.append(button,report,cueDetails);
}
render=function(...args){const result=base(...args);mount();return result;};
if(state.activeBookSlug===HSBooks.VI)render();
})();