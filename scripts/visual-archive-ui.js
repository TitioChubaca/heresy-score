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
  element.style.backgroundImage="url("+art.asset+")";
  element.style.backgroundSize="200% 200%";
  element.style.backgroundPosition=positions[art.quadrant];
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
home.append(heading,grid);
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
 image.append(artTile(entry.art||{asset:registry.theme(book()).artwork,quadrant:entry.quadrant},entry.name));
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
 const items=known();home.hidden=!items.length;
 if(!items.length){grid.replaceChildren();lastKey="";return}
 const key=book()+"|"+items.map(e=>e.id).join(",");
 if(key===lastKey)return;lastKey=key;
 const order=["caliban-forests","zahariel","nemiel","the-order-fortress"];
 const sorted=[...items].sort((a,b)=>(order.indexOf(a.id)<0?99:order.indexOf(a.id))-
  (order.indexOf(b.id)<0?99:order.indexOf(b.id)));
 grid.replaceChildren(...sorted.map(card));
}
function decoratePeople(){
 const clearance=maxClearance(),slug=book();
 const cards=[...document.querySelectorAll("#roster .person")];
 cards.forEach((card,i)=>{
  const person=people[i],entry=person&&registry.byName(slug,person.name);
  if(!entry||entry.kind!=="character"||entry.unlock>clearance)return;
  const element=card.querySelector(".person-visual");
  if(element)element.replaceChildren(artTile(person.art,entry.name));
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
  if(element)element.replaceChildren(artTile(record.art,entry.name));
 });
}
const originalRoster=renderRoster;
renderRoster=function(...args){const result=originalRoster(...args);decoratePeople();return result};
const originalArchive=renderArchive;
renderArchive=function(...args){const result=originalArchive(...args);decoratePlaces();return result};
function modalArt(box,entry,name){
 const previous=box.querySelector(".hs-modal-visual");
 if(previous)previous.remove();
 if(!entry)return;
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
window.HSVisualArchiveUI={renderHome,version:1};
})();