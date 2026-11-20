/* Explore previously revealed voidcraft, places and factions without exposing
   names of locked future records. No content changes or external calls. */
(()=>{"use strict";
const gallery=document.getElementById("worldArchive");
if(!gallery||typeof renderArchive!=="function")return;
const section=document.createElement("section");
section.className="hs-archive-search";
section.innerHTML='<label for="hsWorldSearch">Buscar local, nave ou facção já conhecida</label>'+
 '<input id="hsWorldSearch" type="search" autocomplete="off" placeholder="Buscar nos registros desbloqueados">'+
 '<p id="hsWorldCounter" role="status" aria-live="polite"></p>';
gallery.before(section);
const input=section.querySelector("input"),counter=section.querySelector("#hsWorldCounter");
const style=document.createElement("style");style.textContent=`
.hs-archive-search{margin:9px 0 12px;display:grid;gap:7px;padding:0 10px}
.hs-archive-search label{font-size:12px;color:var(--green2);line-height:1.5}
.hs-archive-search input{font-size:14px;width:100%;min-height:44px;padding:10px 12px;background:#0d160d;color:var(--bone);border:1px solid #526949;border-radius:3px}
.hs-archive-search p{font-size:12px;color:var(--dim);margin:0 0 5px;line-height:1.5}
#worldArchive .world-card[hidden]{display:none!important}
`;document.head.append(style);
function update(){
 const permitted=archiveRecords.filter(r=>(r.unlock||1)<=maxClearance());
 const listed=archiveRecords.filter(r=>state.archiveFilter==="all"||r.kind===state.archiveFilter);
 const nodes=[...gallery.querySelectorAll(".world-card")];
 const query=input.value.trim().toLocaleLowerCase();
 let shown=0;
 listed.forEach((r,i)=>{
  const known=(r.unlock||1)<=maxClearance();
  const match=!query||[r.name,r.kindLabel,r.note].join(" ").toLocaleLowerCase().includes(query);
  const visible=known&&match;
  if(nodes[i]){nodes[i].hidden=!visible;nodes[i].setAttribute("aria-hidden",String(!visible))}
  if(visible)shown++;
 });
 counter.textContent=permitted.length?
  shown+" registros visíveis · "+permitted.length+" conhecidos até agora. Registros futuros ocultos.":
  "Nenhum local ou nave revelado até esta unidade de leitura.";
}
const before=renderArchive;
renderArchive=function(){before();update()};
input.addEventListener("input",update);
window.addEventListener("hs-book-changed",()=>{input.value="";update()});
update();
})();
