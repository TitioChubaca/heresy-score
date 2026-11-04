/* Compact non-destructive reading player. Existing timer and Spotify controls remain authoritative. */
(()=>{"use strict";
const now=document.getElementById("now");if(!now)return;
const style=document.createElement("style");style.textContent=`
#now.hs-mini{position:fixed!important;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom));top:auto!important;z-index:90;max-width:740px;margin:0 auto!important;padding:10px 12px!important;box-shadow:0 8px 35px #000c;border:1px solid #789663}
#now.hs-mini .rivet,#now.hs-mini .pulse,#now.hs-mini .playerline,#now.hs-mini .track-feedback,#now.hs-mini .actions,#now.hs-mini #finalCueBtn{display:none!important}
#now.hs-mini .nowhead{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
#now.hs-mini #timer{font-size:21px!important;line-height:1.2;margin:0!important}
#now.hs-mini .now-controls{display:flex!important;gap:6px;margin:0!important}
#now.hs-mini .now-controls .btn{min-height:38px;padding:7px 10px;font-size:11px}
#now .hs-collapse{border:1px solid #526949;background:#101a0f;color:#a8db72;padding:7px 10px;cursor:pointer;min-height:36px}
#now.hs-mini .hs-collapse{min-height:32px}
#now .hs-more{margin-top:8px}
#now .hs-more summary{cursor:pointer;color:#a8db72;padding:8px;border:1px solid #30402c;font-size:11px}
#now .hs-more .actions{display:flex;flex-wrap:wrap;margin-top:8px}
#now.hs-mini .hs-more{display:none}
@media(max-width:480px){#now.hs-mini .now-controls .btn{font-size:10px;padding:6px 7px}}
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