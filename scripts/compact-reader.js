/* Compact non-destructive reading player. Existing timer and Spotify controls remain authoritative. */
(()=>{"use strict";
const now=document.getElementById("now");if(!now)return;
const style=document.createElement("style");style.textContent=`
#now.hs-mini{position:fixed!important;left:8px!important;right:8px!important;bottom:calc(8px + env(safe-area-inset-bottom))!important;top:auto!important;z-index:90!important;width:auto!important;max-width:740px!important;min-height:0!important;max-height:110px!important;margin:0 auto!important;padding:9px 10px!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;grid-template-rows:auto auto!important;gap:4px 10px!important;overflow:hidden!important;box-shadow:0 8px 35px #000c!important;border:1px solid #789663!important}
#now.hs-mini > :not(.nowhead):not(#timer):not(.now-controls){display:none!important}
#now.hs-mini .nowhead{grid-column:1;grid-row:1;display:flex!important;align-items:center;justify-content:flex-start;gap:8px;min-width:0;margin:0!important;padding:0!important}
#now.hs-mini .nowhead .small{font-size:9px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#now.hs-mini .nowhead .pulse{display:none!important}
#now.hs-mini #timer{grid-column:1;grid-row:2;font-size:23px!important;line-height:1.1!important;margin:0!important;padding:0!important;letter-spacing:0!important}
#now.hs-mini .now-controls{grid-column:2;grid-row:1 / span 2;display:flex!important;flex-wrap:nowrap!important;align-items:center;justify-content:flex-end;gap:4px!important;width:auto!important;margin:0!important;padding:0!important}
#now.hs-mini .now-controls .btn{width:auto!important;min-width:0!important;min-height:38px!important;padding:7px 8px!important;font-size:10px!important;white-space:nowrap!important;flex:0 0 auto!important}
#now.hs-mini .now-controls #finalCueBtn{display:none!important}
#now .hs-collapse{border:1px solid #526949;background:#101a0f;color:#a8db72;padding:7px 10px;cursor:pointer;min-height:36px}
#now.hs-mini .hs-collapse{font-size:10px!important;min-height:26px!important;padding:4px 6px!important;white-space:nowrap}
#now .hs-more{margin-top:8px}
#now .hs-more summary{cursor:pointer;color:#a8db72;padding:8px;border:1px solid #30402c;font-size:11px}
#now .hs-more .actions{display:flex;flex-wrap:wrap;margin-top:8px}
@media(max-width:390px){#now.hs-mini{gap:3px 5px!important;padding:7px!important}#now.hs-mini .now-controls .btn{padding:6px!important;font-size:9px!important}#now.hs-mini #timer{font-size:20px!important}}
`;document.head.appendChild(style);
const head=now.querySelector(".nowhead");
const toggle=document.createElement("button");toggle.type="button";toggle.className="hs-collapse";toggle.textContent="Minimizar ↓";toggle.setAttribute("aria-label","Minimizar player para navegar no compêndio");head.appendChild(toggle);
const more=document.createElement("details");more.className="hs-more";const summary=document.createElement("summary");summary.textContent="Mais ações · feedback e encerramento";more.appendChild(summary);
const actions=now.querySelector(".actions"),feedback=now.querySelector(".track-feedback"),final=document.getElementById("finalCueBtn");
if(feedback)more.appendChild(feedback);if(actions)more.appendChild(actions);if(final){const row=document.createElement("div");row.className="actions";row.appendChild(final);more.appendChild(row)}now.appendChild(more);
let compact=false;
function apply(){now.classList.toggle("hs-mini",compact&&now.classList.contains("active"));toggle.textContent=compact?"Expandir ↑":"Minimizar ↓";toggle.setAttribute("aria-expanded",String(!compact));}
toggle.onclick=()=>{compact=!compact;apply();};
const observer=new MutationObserver(()=>{if(!now.classList.contains("active"))compact=false;apply()});observer.observe(now,{attributes:true,attributeFilter:["class"]});
apply();
})();