/* One-chapter reading deck. No log, soundtrack or spoiler-clearance mutations. */
(()=>{
"use strict";
const host=document.getElementById("chapters");
if(!host||typeof render!=="function")return;
const original=render;
const toolbar=document.createElement("nav");
toolbar.className="hs-deck-nav";
toolbar.setAttribute("aria-label","Navegar entre os capítulos");
toolbar.innerHTML='<button type="button" class="hs-deck-arrow" data-dir="-1" aria-label="Capítulo anterior">‹</button><div class="hs-deck-center"><span class="hs-deck-eyebrow">CAPÍTULO EM FOCO</span><strong id="hsDeckTitle" aria-live="polite"></strong><span id="hsDeckStatus"></span></div><button type="button" class="hs-deck-arrow" data-dir="1" aria-label="Próximo capítulo">›</button>';
host.before(toolbar);
const footer=document.createElement("div");footer.className="hs-deck-footer";
footer.innerHTML='<button type="button" class="hs-deck-current">Voltar ao capítulo atual</button><button type="button" class="hs-deck-history">Ver todos os logs</button><span class="hs-deck-hint">Deslize para os lados ou use as setas</span>';
host.after(footer);
const oldToggle=document.querySelector(".archive-toggle");
if(oldToggle)oldToggle.hidden=true;
const style=document.createElement("style");style.textContent=`
/* Reading deck + responsive alignment audit */
.shell{width:100%;min-width:0}
.mast{grid-template-columns:86px minmax(0,1fr) auto}
.mast>div:nth-child(2){min-width:0}
.mast h1{overflow-wrap:anywhere;line-height:1.12}
.frame,.panel,.bookhead,.chapter,.world-card,.person{min-width:0}
.chapters{padding:0 13px 12px;min-height:155px}
.chapter{margin:0;min-width:0;animation:hsCardIn .2s ease-out}
.chapter[hidden]{display:none!important}
@keyframes hsCardIn{from{opacity:.35;transform:translateX(9px)}to{opacity:1;transform:translateX(0)}}
.chapter .row{flex-wrap:wrap;align-items:flex-start}
.chapter .chname{min-width:0;overflow-wrap:anywhere;line-height:1.5;flex:1 1 155px}
.chapter .details{min-width:0;overflow-wrap:anywhere}
.chapter .details span{min-width:0}
.chapter .actions .btn{max-width:100%;white-space:normal;text-align:center}
.hs-deck-nav{display:grid;grid-template-columns:42px minmax(0,1fr) 42px;align-items:stretch;gap:9px;padding:13px 13px 10px;border-top:1px solid var(--line)}
.hs-deck-center{min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;text-align:center}
.hs-deck-eyebrow{font-size:8px;letter-spacing:.19em;color:var(--amber)}
#hsDeckTitle{font:20px Georgia,serif;color:var(--bone);line-height:1.1;overflow-wrap:anywhere}
#hsDeckStatus{font-size:9px;color:var(--dim);letter-spacing:.06em}
.hs-deck-arrow{border:1px solid #4d6643;background:#111b10;color:var(--green);font:29px Georgia,serif;min-height:54px;cursor:pointer;border-radius:3px}
.hs-deck-arrow:disabled{opacity:.23;cursor:default}
.hs-deck-footer{padding:0 13px 13px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.hs-deck-footer button{background:transparent;border:1px solid #394c36;color:var(--green2);padding:8px 10px;font-size:9px;cursor:pointer;min-height:38px}
.hs-deck-footer .hs-deck-hint{flex:1 1 100%;font-size:8px;color:var(--dim);text-align:center}
.hs-deck-footer .hs-deck-current[hidden]{display:none}
.archive-toggle[hidden]{display:none!important}
.roster,.world-archive{grid-template-columns:repeat(2,minmax(0,1fr));align-items:stretch}
.person,.world-card{display:flex;flex-direction:column;min-width:0;overflow:hidden}
.person-copy,.world-copy{min-width:0;flex:1}
.person .pname,.world-name,.person .clearance,.visual-badge{overflow-wrap:anywhere}
.person .clearance,.visual-badge{letter-spacing:.045em;line-height:1.45}
.person-visual{flex:0 0 164px;height:164px}
.person-visual img{object-fit:contain;background:#050805}
.archive-head{flex-wrap:wrap;align-items:center}
.archive-head>div:first-child{min-width:0;flex:1 1 240px}
.archive-code{max-width:100%;overflow-wrap:anywhere}
.book-record{grid-template-columns:auto minmax(0,1fr) auto}
.book-record .btitle,.book-record .bmeta{overflow-wrap:anywhere}
.now-controls .btn{min-width:0}
@media(max-width:520px){
.mast{grid-template-columns:68px minmax(0,1fr) 38px;gap:8px}
.sigil{width:68px;height:50px}.sigil img{width:60px;height:40px}
h1{font-size:19px}.sub{font-size:8px;letter-spacing:.09em}
.roster,.world-archive{grid-template-columns:minmax(0,1fr)}
.person-visual{flex-basis:175px;height:175px}
.hs-deck-nav{grid-template-columns:40px minmax(0,1fr) 40px;gap:7px}
#hsDeckTitle{font-size:18px}
.panel,.chapter{padding:12px}
}
@media(prefers-reduced-motion:reduce){.chapter{animation:none!important}}
`;
document.head.append(style);
let selected=null,book=null,previousCurrent=null;
function readingNumber(){
 const n=chapters.find(c=>!state.done?.[c.number]);
 return state.active?.chapter||n?.number||chapters[chapters.length-1]?.number||1;
}
function currentNumber(){return Math.min(chapters.length,Math.max(1,readingNumber()))}
function show(){
 const active=currentNumber();
 if(book!==state.activeBookSlug){book=state.activeBookSlug;selected=active;previousCurrent=active}
 if(selected===null||selected===previousCurrent&&active!==previousCurrent)selected=active;
 previousCurrent=active;
 selected=Math.max(1,Math.min(chapters.length,selected||active));
 const cards=[...host.querySelectorAll(".chapter")];
 cards.forEach((card,i)=>{
  const number=chapters[i]?.number;
  if(number==null)return;
  const visible=number===selected;
  card.hidden=!visible;
  card.setAttribute("aria-hidden",String(!visible));
  if(visible){
   if(number>active&&!state.done?.[number]){
    const details=card.querySelector(".details"),actions=card.querySelector(".actions");
    if(details)details.replaceChildren();
    if(actions){actions.replaceChildren();const note=document.createElement("span");note.className="small";note.textContent="Conteúdo e trilha protegidos até os capítulos anteriores serem concluídos.";actions.append(note)}
    const ch=card.querySelector(".chname");if(ch)ch.textContent="CHAPTER "+String(number).padStart(2,"0")+" // SEALED";
   }
  }
 });
 const current=chapters.find(c=>c.number===selected);
 const title=toolbar.querySelector("#hsDeckTitle");
 title.textContent="Capítulo "+String(selected).padStart(2,"0")+" / "+chapters.length;
 const tag=toolbar.querySelector("#hsDeckStatus");
 tag.textContent=selected===active?"Leitura atual":state.done?.[selected]?"Concluído · log disponível":"Futuro · protegido contra spoilers";
 toolbar.querySelector('[data-dir="-1"]').disabled=selected<=1;
 toolbar.querySelector('[data-dir="1"]').disabled=selected>=chapters.length;
 footer.querySelector(".hs-deck-current").hidden=selected===active;
}
function go(direction){selected=Math.max(1,Math.min(chapters.length,(selected||currentNumber())+direction));show();}
toolbar.querySelector('[data-dir="-1"]').onclick=()=>go(-1);
toolbar.querySelector('[data-dir="1"]').onclick=()=>go(1);
footer.querySelector(".hs-deck-current").onclick=()=>{selected=currentNumber();show()};
footer.querySelector(".hs-deck-history").onclick=()=>setView("logs");
let startX=null,startY=null;
host.addEventListener("touchstart",e=>{if(e.touches.length!==1)return;startX=e.touches[0].clientX;startY=e.touches[0].clientY},{passive:true});
host.addEventListener("touchend",e=>{
 if(startX===null||!e.changedTouches.length)return;
 const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;
 startX=null;startY=null;
 if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.4)go(dx<0?1:-1);
},{passive:true});
toolbar.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();go(e.key==="ArrowLeft"?-1:1)}});
render=function(...args){
 // Keep the complete card model for Spotify audit and log handlers;
 // the deck changes only what is visible.
 state.showAllChapters=true;
 original(...args);
 show();
};
show();
})();
