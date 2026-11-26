/* Heresy Score foundation: player structure and explicit mobile affordances.
   Preserve existing listeners, playback timing, cloud logs and book clearance. */
(()=>{
"use strict";
if(typeof render!=="function")return;
const now=document.getElementById("now");
const controls=now?.querySelector(".now-controls");
const advanced=now?.querySelector(".hs-more");
const pause=document.getElementById("pauseBtn");
const spotify=document.getElementById("openSpotifyBtn");
const conclude=document.getElementById("finishBtn");
if(now&&controls&&advanced&&pause&&spotify&&conclude){
 // Move DOM nodes, never clone: their original click handlers stay attached.
 const extra=document.createElement("div");
 extra.className="hs-player-extra";
 for(const id of ["prevTrackBtn","nextTrackBtn"]){
  const button=document.getElementById(id);
  if(button)extra.append(button);
 }
 advanced.append(extra);
 controls.replaceChildren(pause,spotify,conclude);
 const setNames=()=>{
  pause.textContent=state.active?.paused?"Retomar":"Pausar";
  spotify.textContent="Spotify";
  conclude.textContent="Concluir";
  pause.setAttribute("aria-label",state.active?.paused?"Retomar leitura":"Pausar leitura");
  spotify.setAttribute("aria-label","Abrir playlist do capítulo no Spotify");
  conclude.setAttribute("aria-label","Concluir capítulo e registrar tempo");
 };
 const formerNow=renderNow;
 renderNow=function(...args){const res=formerNow(...args);setNames();return res};
 setNames();
}
// Last-loaded stylesheet wins over the retired in-script design patches.
const stylesheet=document.createElement("link");
stylesheet.rel="stylesheet";
stylesheet.href="./styles/reader-foundation.css";
stylesheet.id="hs-reader-foundation-css";
document.head.append(stylesheet);
const hhStyle=document.createElement("link");
hhStyle.rel="stylesheet";hhStyle.href="./styles/themes/horus-heresy.css";
hhStyle.id="hs-theme-horus-heresy";document.head.append(hhStyle);
// The shell is genre-neutral. Warhammer is only a theme for current books.
function themeSeries(slug){
 return [HSBooks.IV,HSBooks.V,HSBooks.VI].includes(slug)?"warhammer-30k":"neutral";
}
document.body.dataset.hsUiSeries=themeSeries(state.activeBookSlug);
let previousSession="";
const earlier=render;
render=function(...args){
 const result=earlier(...args);
 document.body.dataset.hsUiSeries=themeSeries(state.activeBookSlug);
 document.body.classList.toggle("hs-session-active",!!state.active);
 // Enter compact mode only when a fresh reading session starts.
 // Once in it, the reader remains free to expand or minimize manually.
 const key=state.active?state.activeBookSlug+":"+(state.active.startedAt||"active"):"";
 if(key!==previousSession){
  previousSession=key;
  if(key&&!now?.classList.contains("hs-mini")){
   const toggle=now?.querySelector(".hs-collapse");
   if(toggle&&now?.classList.contains("active"))toggle.click();
  }
 }
 if(controls){controls.setAttribute("role","group");controls.setAttribute("aria-label","Ações de leitura")}
 return result;
};
window.HSReaderFoundation={
 version:"0.18.0",playerButtons:["pauseBtn","openSpotifyBtn","finishBtn"],
 presentationTheme:slug=>window.HSReaderVisuals?.theme(slug)||null
};
})();