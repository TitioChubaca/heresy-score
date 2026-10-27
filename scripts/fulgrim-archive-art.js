/* Book V Voidcraft/Theatre archive: noncanonical original illustrated defaults.
   Covers only public, already-introduced records; never copies private assets. */
(()=>{
"use strict";
const known={
 "pride-of-the-emperor":"ship","laeran":"planet","atoll-19":"battlefield",
 "laer":"xenos","recital":"theatre","legion-iron-hands":"legion",
 "pride-apothecarion":"medical"
};
function svg(kind){
 const bg=kind==="planet"?"#1b4252":kind==="battlefield"?"#354c48":kind==="medical"?"#263840":"#232a3d";
 const common='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340"><defs><radialGradient id="sky" cx=".45" cy=".45"><stop stop-color="'+bg+'"/><stop offset="1" stop-color="#070c15"/></radialGradient><linearGradient id="steel"><stop stop-color="#a5a9aa"/><stop offset=".55" stop-color="#343e51"/><stop offset="1" stop-color="#111723"/></linearGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".32" numOctaves="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".12"/></feComponentTransfer></filter></defs><rect width="600" height="340" fill="url(#sky)"/>';
 let shape="";
 if(kind==="ship")shape='<path d="M36 194l184-25 48-68 42 4 36 65 210 26-209 20-51 80-45-9-36-71z" fill="url(#steel)" stroke="#c1a675" stroke-width="6"/><path d="M225 166l44-126h64l33 128M255 140l8-83m69 84-4-88" stroke="#a5aab3" stroke-width="9"/><path d="M70 199h438m-257-12h102M151 182v30M420 181v35" stroke="#ddb971" stroke-width="5"/><circle cx="54" cy="197" r="22" fill="#8be1ef" opacity=".8"/><path d="M8 194h41" stroke="#aee8ed" stroke-width="19" opacity=".6"/>';
 else if(kind==="planet")shape='<circle cx="319" cy="175" r="129" fill="#396b68" stroke="#c2ae88" stroke-width="6"/><path d="M217 125q110-90 216-15m-220 112q97-28 232 21M226 151q130 95 187-57m-143 167 24-240" stroke="#99ad81" stroke-width="26" opacity=".58" fill="none"/><ellipse cx="319" cy="175" rx="190" ry="34" fill="none" stroke="#d5d8bf" stroke-width="13" opacity=".52" transform="rotate(-21 319 175)"/>';
 else if(kind==="battlefield")shape='<path d="M0 224l70-63 57 42 112-95 68 75 69-83 86 84 72-41 66 79v118H0" fill="#526563" stroke="#b0ad83" stroke-width="3"/><path d="M0 260q140-40 230-5t370-22v107H0" fill="#172d33"/><path d="M54 215L120 105m200 143 41-148m60 149 120-93" stroke="#d2a66a" stroke-width="11"/><path d="M110 85h30v33h-30m228-37h36v29h-36" fill="#ad9a6f"/>';
 else if(kind==="xenos")shape='<path d="M227 279Q190 193 230 123Q272 68 349 100Q402 141 355 209Q316 256 363 309" stroke="#91b3a3" stroke-width="53" fill="none"/><path d="M237 170q-85 3-107 77m221-78q93-15 134 59M271 247l-81 83m148-81 88 80" stroke="#7f9f9e" stroke-width="25" fill="none"/><path d="M258 122l-37-54m104 31 52-50" stroke="#d6b67c" stroke-width="13"/><ellipse cx="267" cy="156" rx="10" ry="8" fill="#f4e1b0"/><ellipse cx="330" cy="155" rx="10" ry="8" fill="#f4e1b0"/>';
 else if(kind==="theatre")shape='<path d="M39 64q110-45 200 10t320-10v235H39Z" fill="#502e4e" stroke="#cbac76" stroke-width="6"/><path d="M78 91q115 13 156 56m279-57q-115 13-156 56" stroke="#d6af78" stroke-width="18" fill="none"/><path d="M183 235q127-122 246 0" stroke="#bdad87" stroke-width="10" fill="none"/><circle cx="302" cy="119" r="46" fill="#f2d0a2" opacity=".33"/><path d="M144 285h312M166 303h263" stroke="#ba9972" stroke-width="8"/>';
 else if(kind==="legion")shape='<circle cx="300" cy="169" r="101" fill="#353b3d" stroke="#a5ada9" stroke-width="28" stroke-dasharray="28 12"/><circle cx="300" cy="169" r="54" fill="#111c28" stroke="#c9bf9b" stroke-width="12"/><path d="M273 169h54m-27-27v54" stroke="#c9bf9b" stroke-width="17"/>';
 else shape='<rect x="82" y="48" width="436" height="232" rx="20" fill="#30414c" stroke="#9cb4ac" stroke-width="9"/><path d="M123 82h352v170H123z" fill="#0e1f26" stroke="#82a8a4" stroke-width="4"/><path d="M172 151h257m-129-47v95" stroke="#a4c5b0" stroke-width="20"/><path d="M145 230q122-50 310 4" stroke="#4f7b86" stroke-width="14" fill="none"/>';
 return common+shape+'<rect width="600" height="340" opacity=".5" filter="url(#grain)"/><rect width="600" height="340" fill="none" stroke="#c1a170" stroke-opacity=".45" stroke-width="9"/></svg>';
}
function decorate(){
 if(state.activeBookSlug!=="fulgrim")return;
 const items=archiveRecords.filter(r=>state.archiveFilter==="all"||r.kind===state.archiveFilter);
 const cards=[...document.querySelectorAll("#worldArchive .world-card")];
 items.forEach((r,i)=>{
  if(!known[r.key]||r.unlock>maxClearance())return;
  r.image=r.image||"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg(known[r.key]));
  r.visual="ARCHIVE RECONSTRUCTION // NON-CANON";
  const v=cards[i]?.querySelector(".world-visual");
  if(!v)return;
  const img=document.createElement("img");img.alt=r.name+" — artistic reconstruction";img.loading="lazy";img.src=r.image;
  img.style.cssText="width:100%;height:100%;object-fit:cover;display:block";
  v.replaceChildren(img);
  const badge=cards[i]?.querySelector(".visual-badge");if(badge)badge.textContent=r.visual;
 });
}
const baseRender=renderArchive;
renderArchive=function(){baseRender();decorate()};
const baseOpen=openArchiveRecord;
openArchiveRecord=function(r){
 baseOpen(r);
 if(state.activeBookSlug!=="fulgrim"||!known[r.key]||r.unlock>maxClearance())return;
 const display=document.getElementById("archiveDialogVisual");if(!display)return;
 const img=document.createElement("img");img.src=r.image||"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg(known[r.key]));img.alt=r.name+" — artistic reconstruction";img.style.cssText="width:100%;max-height:350px;object-fit:contain";
 display.replaceChildren(img);
};
decorate();
})();