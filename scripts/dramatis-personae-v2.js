/* Searchable spoiler-safe Dramatis Personae for all books.
   Never search or display people before their reading-unit clearance. */
(()=>{
"use strict";
const host=document.getElementById("roster");
if(!host||typeof renderRoster!=="function")return;
const parent=host.parentElement;
const controls=document.createElement("section");controls.className="hs-dramatis-controls";
controls.innerHTML='<label for="hsDramatisSearch">Buscar personagem já conhecido</label>'+
 '<input id="hsDramatisSearch" type="search" autocomplete="off" placeholder="Nome, função ou organização" aria-label="Buscar personagem desbloqueado">'+
 '<label for="hsDramatisGroup">Grupo / afiliação</label><select id="hsDramatisGroup" aria-label="Filtrar personagens por grupo"></select>'+
 '<p id="hsDramatisCount" role="status" aria-live="polite"></p>';
host.before(controls);
const search=controls.querySelector("#hsDramatisSearch"),group=controls.querySelector("#hsDramatisGroup"),count=controls.querySelector("#hsDramatisCount");
const style=document.createElement("style");style.textContent=`
.hs-dramatis-controls{padding:14px 15px 8px;display:grid;grid-template-columns:minmax(0,1fr) minmax(135px,.7fr);gap:7px 12px;align-items:end}
.hs-dramatis-controls label{font-size:12px;line-height:1.4;color:var(--green2)}
.hs-dramatis-controls input,.hs-dramatis-controls select{width:100%;min-width:0;min-height:44px;background:#0d160d;border:1px solid #536947;color:var(--bone);padding:9px 10px;border-radius:3px;font-size:14px}
.hs-dramatis-controls p{grid-column:1/-1;color:var(--dim);font-size:12px;line-height:1.5;margin:3px 0 6px}
#roster .person[hidden]{display:none!important}
#roster .person .person-summary,#roster .person .person-note{font-size:13px;line-height:1.55;overflow-wrap:anywhere}
#roster .person .pname{font-size:16px;line-height:1.3}
#roster .person{cursor:pointer}
@media(max-width:490px){.hs-dramatis-controls{grid-template-columns:1fr}.hs-dramatis-controls label{margin-top:4px}}
`;
document.head.append(style);
function affiliation(p){
 if(p.affiliation)return String(p.affiliation);
 const r=String(p.role||"").toLowerCase();
 if(/emperor.?s children|iii legion/.test(r))return "Emperor's Children";
 if(/iron hands|x legion/.test(r))return "Iron Hands";
 if(/eldar|ulthw|wraithlord|farseer/.test(r))return "Eldar / Ulthwé";
 if(/remembrancer/.test(r))return "Remembrancers";
 if(/expedition|archivist/.test(r))return "Expedição Imperial";
 return "Outros";
}
function allowed(p){return (p.unlock||1)<=maxClearance()}
function visibleFacts(p){return (p.facts||[]).filter(x=>(x.ch||1)<=maxClearance()).map(x=>x.text||"").join(" ")}
function refresh(){
 const known=people.filter(allowed);
 const groups=[...new Set(known.map(affiliation))].sort((a,b)=>a.localeCompare(b));
 const current=group.value||"all";
 group.replaceChildren();
 const base=document.createElement("option");base.value="all";base.textContent="Todos os grupos";group.append(base);
 for(const name of groups){const opt=document.createElement("option");opt.value=name;opt.textContent=name;group.append(opt)}
 group.value=groups.includes(current)?current:"all";
 const query=search.value.toLocaleLowerCase().trim(),chosen=group.value;
 const cards=[...host.querySelectorAll(".person")];
 let shown=0;
 people.forEach((p,i)=>{
  const searchable=[p.name,p.role,affiliation(p),visibleFacts(p)].join(" ").toLocaleLowerCase();
  const visible=allowed(p)&&(!query||searchable.includes(query))&&(chosen==="all"||affiliation(p)===chosen);
  if(cards[i])cards[i].hidden=!visible;
  if(visible)shown++;
 });
 count.textContent=known.length?
  "Exibindo "+shown+" de "+known.length+" personagens conhecidos · "+groups.length+" grupos. Informações futuras permanecem ocultas.":
  "Nenhum personagem foi encontrado durante a leitura até aqui. As fichas aparecem após os encontros no texto.";
}
const oldRenderRoster=renderRoster;
renderRoster=function(){oldRenderRoster();refresh()};
search.oninput=refresh;group.onchange=refresh;
window.addEventListener("hs-book-changed",()=>{search.value="";group.value="all";refresh()});
refresh();
})();
