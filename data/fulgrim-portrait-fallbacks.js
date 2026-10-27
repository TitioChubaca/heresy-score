/* Default spoiler-gated artwork for Book V. Generated SVGs are ORIGINAL procedural
   archive illustrations, never labeled as official art or direct book canon.
   Reader's private IndexedDB portraits, if imported, always replace these. */
(()=>{
"use strict";
const d=window.HS_FULGRIM_DATA;
if(!d||!Array.isArray(d.people))return;
const profiles={
 "Fulgrim":["#f2e4d8","#d8b49a","#653884","#ddbc66","primarch"],
 "Solomon Demeter":["#242431","#b99584","#583775","#cab07c","marine"],
 "Ostian Delafour":["#342d2d","#d2a98b","#6b6154","#ad9d86","sculptor"],
 "Serena d'Angelus":["#181f30","#d8ae95","#304a83","#c59f6d","painter"],
 "Bequa Kynska":["#293e87","#e1b49c","#554173","#dfb97c","musician"],
 "Paljor Dorji":["#302524","#be9275","#6a443d","#d6a867","noble"],
 "Julius Kaesoron":["#272431","#ccaa92","#614084","#e1bb74","marine"],
 "Marius Vairosean":["#21212d","#c29a84","#5c397b","#dbad71","marine"],
 "Gaius Caphen":["#88745c","#c8a58f","#533976","#c5af85","marine"],
 "Coraline Aseneca":["#795d4d","#e1bba1","#604a63","#cbb08b","performer"],
 "Eidolon":["#d2b99d","#d1b095","#67408e","#e3c37e","marine"],
 "Vespasian":["#bfb3a0","#cdaa91","#594273","#d1b78b","marine"],
 "Fabius":["#dfd0b8","#bea08f","#848b7c","#c3c2a4","apothecary"],
 "Saul Tarvitz":["#b6a18a","#c8a48a","#5c427e","#d7bd8d","marine"],
 "Lucius":["#a28865","#c59b7c","#59347b","#dfbb78","marine"],
 "Ferrus Manus":["#161a20","#b8a393","#303d48","#bcc5c9","primarch"]
};
function portrait([hair,skin,robe,metal,kind],name){
 const marine=kind==="marine"||kind==="primarch";
 const arts=kind==="sculptor"?'<path d="M326 432l23-144" stroke="#c9a67e" stroke-width="9"/>':kind==="painter"?'<path d="M314 438l39-151" stroke="#b9a784" stroke-width="7"/><path d="M352 287l4-23-13 4z" fill="#efe6cc"/>':kind==="musician"?'<path d="M298 439q49-122 43-150M308 441l38-124M315 438l30-115M325 437l20-120" stroke="#d6b885" stroke-width="3" fill="none"/>':kind==="apothecary"?'<path d="M314 376h55m-27-26v57" stroke="#b5d7cc" stroke-width="12"/>':"";
 const bg=marine?"#172231":kind==="apothecary"?"#202b27":"#2a2432";
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><radialGradient id="b"><stop stop-color="'+robe+'"/><stop offset="1" stop-color="'+bg+'"/></radialGradient><radialGradient id="f" cx=".36" cy=".3" r=".8"><stop stop-color="'+skin+'"/><stop offset="1" stop-color="#77554b"/></radialGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".57" numOctaves="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".09"/></feComponentTransfer></filter></defs>'+
 '<rect width="400" height="500" fill="url(#b)"/><path d="M45 500V99Q45 46 200 41Q354 46 354 99V500" fill="none" stroke="'+metal+'" stroke-width="10" stroke-opacity=".27"/>'+
 '<path d="M0 500Q15 350 116 317L200 331L284 317Q387 351 400 500" fill="'+robe+'" stroke="'+metal+'" stroke-width="5"/>'+
 (marine?'<path d="M0 500L19 381Q29 312 94 310L143 354L107 500M400 500L380 381Q371 312 306 310L257 354L292 500" stroke="'+metal+'" stroke-width="8" fill="'+robe+'"/><circle cx="73" cy="393" r="55" fill="none" stroke="'+metal+'" stroke-width="8"/><circle cx="327" cy="393" r="55" fill="none" stroke="'+metal+'" stroke-width="8"/>':'')+
 '<path d="M129 197Q101 80 199 78Q300 78 272 197L291 346Q260 368 250 309L146 309Q130 374 112 340Z" fill="'+hair+'" stroke="#22232a" stroke-width="4"/>'+
 '<path d="M161 276l-18 63q55 48 114 0l-18-63" fill="'+skin+'" stroke="#7a5849" stroke-width="3"/>'+
 '<ellipse cx="200" cy="221" rx="66" ry="99" fill="url(#f)" stroke="#5a423b" stroke-width="3"/>'+
 '<path d="M136 174Q144 114 201 114Q253 114 269 174Q244 149 194 150Q157 147 136 174" fill="'+hair+'"/>'+
 '<path d="M157 218q17-10 32-1m24 0q17-11 34 0" stroke="#392c2c" stroke-width="5" fill="none"/>'+
 '<path d="M196 228l-5 32 15 5m-34 19q28 12 55-2" stroke="#714d44" stroke-width="3" fill="none"/>'+
 '<path d="M154 336q48 36 92 0" stroke="'+metal+'" stroke-width="5" fill="none"/>'+arts+
 (marine?'<path d="M155 423l45-40 46 40-46 38z" fill="'+metal+'" opacity=".8"/><path d="M200 394v56m-31-26h63" stroke="#31283a" stroke-width="4"/>':'')+
 '<rect width="400" height="500" filter="url(#grain)" opacity=".8"/><rect x="8" y="8" width="384" height="484" fill="none" stroke="'+metal+'" stroke-width="3" stroke-opacity=".6"/>'+
 '<rect y="466" width="400" height="34" fill="#090e16" opacity=".9"/><text x="200" y="487" font-family="Georgia,serif" font-size="14" letter-spacing="1.4" fill="#d6c6a5" text-anchor="middle">ARCHIVE RECONSTRUCTION</text></svg>';
}
for(const p of d.people){
 const args=profiles[p.name];
 if(!args||p.unlock>5||p.image)continue;
 const svg=portrait(args,p.name);
 p.image="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
 p.visual="ARCHIVE RECONSTRUCTION // ARTISTIC, NON-CANON";
 p.art={kind:"procedural_reconstruction",source:"Heresy Score original",subjectExact:false};
}
})();