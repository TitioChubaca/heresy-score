/* Source-verified Book V archive images. Non-matching locations keep their
   neutral icon: a reference must not pretend to depict a location it cannot. */
(()=>{
"use strict";
const SOURCES=[{"key":"pride-of-the-emperor","url":"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/fcf06a40-01bb-4661-bb5c-4b343a377fb9/d2qc9c0-d8addc6e-a54b-4843-be86-bf0887212b52.jpg/v1/fill/w_900%2Ch_627%2Cq_75%2Cstrp/pride_of_the_emperor_by_terraluna5_d2qc9c0-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjI3IiwicGF0aCI6IlwvZlwvZmNmMDZhNDAtMDFiYi00NjYxLWJiNWMtNGIzNDNhMzc3ZmI5XC9kMnFjOWMwLWQ4YWRkYzZlLWE1NGItNDg0My1iZTg2LWJmMDg4NzIxMmI1Mi5qcGciLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.JOa1wIbXA5pm8pvwsAtYOce0Q9qEHH4BKLxQcZedgmE","category":"fanart","credit":"terraluna5 — Pride of the Emperor (2010)","label":"FANART // TERRALUNA5"},{"key":"laer","url":"https://vignette.wikia.nocookie.net/es.warhammer40k/images/1/10/Wh40k_laer_warrior_by_julienhainault-d9w9c33.jpg/revision/latest?cb=20160408184642","category":"fanart","credit":"Julien Hainault — Laer Warrior","label":"FANART // JULIEN HAINAULT"}];
const data=window.HS_FULGRIM_DATA;if(!data?.archive)return;
for(const entry of SOURCES){
 const r=data.archive.find(x=>x.key===entry.key);
 if(!r||r.unlock>5||typeof Image!=="function")continue;
 const img=new Image();
 img.referrerPolicy="no-referrer";
 img.onload=()=>{
  r.image=entry.url;r.visual=entry.label;
  r.art={kind:entry.category,credit:entry.credit};
  if(state.activeBookSlug==="fulgrim"&&typeof renderArchive==="function")renderArchive();
 };
 img.src=entry.url;
}
function decorate(){
 if(state.activeBookSlug!=="fulgrim")return;
 const items=archiveRecords.filter(r=>state.archiveFilter==="all"||r.kind===state.archiveFilter);
 const cards=[...document.querySelectorAll("#worldArchive .world-card")];
 items.forEach((r,i)=>{
  if(!r.image||r.unlock>maxClearance())return;
  const holder=cards[i]?.querySelector(".world-visual");if(!holder)return;
  const img=document.createElement("img");img.src=r.image;img.alt=r.name+" // "+(r.art?.kind||"reference");img.loading="lazy";
  img.style.cssText="width:100%;height:100%;object-fit:contain;display:block";
  holder.replaceChildren(img);
  const badge=cards[i].querySelector(".visual-badge");if(badge)badge.textContent=r.visual;
 });
}
const originalRender=renderArchive;renderArchive=function(){originalRender();decorate()};
const originalOpen=openArchiveRecord;openArchiveRecord=function(r){
 originalOpen(r);
 if(state.activeBookSlug!=="fulgrim"||!r.image||r.unlock>maxClearance())return;
 const holder=document.getElementById("archiveDialogVisual");if(!holder)return;
 const img=document.createElement("img");img.src=r.image;img.alt=r.name;
 img.style.cssText="width:100%;max-height:370px;object-fit:contain";
 holder.replaceChildren(img);
};
decorate();
})();