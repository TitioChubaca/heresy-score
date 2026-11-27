/* Shared, book-agnostic visual archive presentation.
   Images are unlocked by reading units and labeled as reconstructions. */
(()=>{
"use strict";
const registry=window.HSReaderVisuals;
const reading=document.querySelector('[data-view-panel="reading"]');
if(!registry||!reading||typeof render!=="function")return;
const positions={nw:"0% 0%",ne:"100% 0%",sw:"0% 100%",se:"100% 100%"};
const book=()=>state.activeBookSlug;
const known=()=>registry.known(book(),maxClearance());
function artTile(art,name){
 const element=document.createElement("div");
 element.className="hs-art";
 element.setAttribute("role","img");
 element.setAttribute("aria-label",name+" — reconstrução artística, não oficial");
 if(art?.asset && positions[art.quadrant]){
  element.style.backgroundImage=art.fallbackAsset?
   "url("+art.asset+"),url("+art.fallbackAsset+")":"url("+art.asset+")";
  element.style.backgroundSize=art.fallbackAsset?"200% 200%,200% 200%":"200% 200%";
  element.style.backgroundPosition=art.fallbackAsset?
   positions[art.quadrant]+","+positions[art.quadrant]:positions[art.quadrant];
 }else{
  element.classList.add("hs-art-unavailable");
  element.textContent="Imagem não disponível";
 }
 return element;
}
const home=document.createElement("section");home.id="hsVisualHome";home.hidden=true;
home.setAttribute("aria-label","Arquivo visual desbloqueado");
const heading=document.createElement("div");heading.className="hs-visual-head";
const titles=document.createElement("div");
const kicker=document.createElement("span");kicker.className="hs-visual-eyebrow";kicker.textContent="Dossiês liberados";
const title=document.createElement("h2");title.textContent="Arquivo visual";
titles.append(kicker,title);
const links=document.createElement("div");links.className="hs-visual-actions";
for(const [label,view] of [["Personagens","personae"],["Lugares","archive"]]){
 const button=document.createElement("button");button.type="button";button.textContent=label;
 button.onclick=()=>setView(view);links.append(button);
}
heading.append(titles,links);
const grid=document.createElement("div");grid.className="hs-visual-grid";
const source=document.createElement("a");
source.className="hs-official-reference";
source.href=registry.officialBookArt?.url||"#";
source.target="_blank";source.rel="noopener noreferrer";
source.textContent="Consultar arte oficial da capa · Neil Roberts";
source.title="Link ao catálogo oficial, não um retrato dos personagens";
home.append(heading,grid,source);
(reading.querySelector("main.frame")||reading).append(home);
function openEntry(entry){
 if(entry.unlock>maxClearance())return;
 if(entry.kind==="character"){
  const p=people.find(p=>p.name===entry.name && p.unlock<=maxClearance());
  if(p)openPerson(p);
 }else{
  const record=archiveRecords.find(p=>p.key===entry.id && p.unlock<=maxClearance());
  if(record)openArchiveRecord(record);
 }
}
function card(entry){
 const button=document.createElement("button");button.type="button";button.className="hs-visual-card";
 button.setAttribute("aria-label","Abrir dossiê: "+entry.name);
 const image=document.createElement("span");image.className="hs-visual-media";
 image.append(artTile(entry.art||{asset:registry.theme(book()).artwork,fallbackAsset:registry.theme(book()).fallback,quadrant:entry.quadrant},entry.name));
 const credit=document.createElement("span");credit.className="hs-art-credit";credit.textContent="Reconstrução";
 image.append(credit);
 const copy=document.createElement("span");copy.className="hs-visual-copy";
 const category=document.createElement("span");category.className="hs-visual-kind";
 category.textContent=entry.kind==="character"?"Personagem":"Local";
 const name=document.createElement("span");name.className="hs-visual-name";name.textContent=entry.name;
 const summary=document.createElement("span");summary.className="hs-visual-blurb";summary.textContent=entry.summary;
 copy.append(category,name,summary);button.append(image,copy);
 button.onclick=()=>openEntry(entry);return button;
}
let lastKey="";
function renderHome(){
 const all=known();
 const items=all.filter(e=>e.art?.asset);
 const buttons=[...links.querySelectorAll("button")];
 if(buttons[0])buttons[0].textContent="Personagens ("+all.filter(e=>e.kind==="character").length+")";
 if(buttons[1])buttons[1].textContent="Lugares ("+all.filter(e=>e.kind==="place").length+")";
 home.hidden=!items.length;
 if(!items.length){grid.replaceChildren();lastKey="";return}
 const key=book()+"|"+items.map(e=>e.id).join(",");
 if(key===lastKey)return;lastKey=key;
 const order=["caliban-forests","zahariel","nemiel","the-order-fortress"];
 const sorted=[...items].sort((a,b)=>(order.indexOf(a.id)<0?99:order.indexOf(a.id))-
  (order.indexOf(b.id)<0?99:order.indexOf(b.id)));
 grid.replaceChildren(...sorted.map(card));
}
function missingArtwork(name){
 const el=document.createElement("div");
 el.className="hs-art-pending";el.setAttribute("role","note");
 const emblem=document.createElement("span");emblem.className="hs-art-pending-icon";
 emblem.setAttribute("aria-hidden","true");emblem.textContent="◈";
 const label=document.createElement("span");
 label.textContent="RETRATO EM PESQUISA";
 const hint=document.createElement("small");
 hint.textContent="Arte oficial ou fanart autorizada";
 el.append(emblem,label,hint);
 el.setAttribute("aria-label","Retrato de "+name+" ainda sem imagem segura verificada");
 return el;
}
function decoratePeople(){
 const clearance=maxClearance(),slug=book();
 const cards=[...document.querySelectorAll("#roster .person")];
 cards.forEach((card,i)=>{
  const person=people[i],entry=person&&registry.byName(slug,person.name);
  if(!entry||entry.kind!=="character"||entry.unlock>clearance)return;
  const element=card.querySelector(".person-visual");
  if(element)element.replaceChildren(person.art?.asset?
   artTile(person.art,entry.name):missingArtwork(entry.name));
 });
}
function decoratePlaces(){
 const clearance=maxClearance(),slug=book();
 const records=archiveRecords.filter(r=>state.archiveFilter==="all"||r.kind===state.archiveFilter);
 const cards=[...document.querySelectorAll("#worldArchive .world-card")];
 cards.forEach((card,i)=>{
  const record=records[i],entry=record&&registry.entry(slug,record.key);
  if(!entry||entry.unlock>clearance)return;
  const element=card.querySelector(".world-visual");
  if(element)element.replaceChildren(record.art?.asset?
   artTile(record.art,entry.name):missingArtwork(entry.name));
 });
}
const originalRoster=renderRoster;
renderRoster=function(...args){const result=originalRoster(...args);decoratePeople();return result};
const originalArchive=renderArchive;
renderArchive=function(...args){const result=originalArchive(...args);decoratePlaces();return result};
function modalArt(box,entry,name){
 const previous=box.querySelector(".hs-modal-visual");
 if(previous)previous.remove();
 box.querySelector(".hs-art-research-status")?.remove();
 if(!entry){
  const note=document.createElement("p");
  note.className="hs-art-research-status";
  note.textContent="Nenhum retrato individual adequado e com autorização de uso confirmado. Priorizamos arte oficial e fanart autorizada; não será gerado automaticamente.";
  const heading=box.querySelector(".title");
  if(heading)heading.after(note);else box.prepend(note);
  return;
 }
 const wrapper=document.createElement("div");wrapper.className="hs-modal-visual";
 wrapper.append(artTile(entry,name));
 const badge=document.createElement("span");badge.className="hs-art-credit";
 badge.textContent="Reconstrução original · não oficial";wrapper.append(badge);
 const heading=box.querySelector(".title");
 if(heading)heading.after(wrapper);else box.prepend(wrapper);
}
const originalOpenPerson=openPerson;
openPerson=function(person){
 if(!person||person.unlock>maxClearance())return;
 originalOpenPerson(person);
 modalArt(document.getElementById("personDialog"),person.art,person.name);
};
const originalOpenArchive=openArchiveRecord;
openArchiveRecord=function(record){
 if(!record||record.unlock>maxClearance())return;
 originalOpenArchive(record);
 modalArt(document.getElementById("archiveDialog"),record.art,record.name);
};
const originalRender=render;
render=function(...args){const result=originalRender(...args);renderHome();return result};
window.addEventListener("hs-book-changed",()=>{lastKey="";renderHome()});
renderHome();
window.HSVisualArchiveUI={renderHome,version:2};
})();