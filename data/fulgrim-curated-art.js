/* Book V illustration-first source catalog. Unlocks follow the reader log; external sources retain credit. */
(()=>{
"use strict";
const d=window.HS_FULGRIM_DATA;
if(!d||!Array.isArray(d.people))return;
const ART={
  "Fulgrim": {
    "category": "official",
    "subtype": "black_library_cover",
    "label": "OFICIAL // BLACK LIBRARY (30K)",
    "credit": "Black Library — Fulgrim: The Palatine Phoenix",
    "url": "https://grimdarkgamer.com/images/Fulgrim-The-Palatine-Phoenix.jpg",
    "page": "https://grimdarkgamer.com/primarchs/",
    "fallback": "./assets/ui/portraits/fulgrim/fulgrim.webp",
    "unlock": 1
  },
  "Solomon Demeter": {
    "category": "fanart",
    "label": "FANART // LIL LEGEND STUDIO",
    "credit": "Myles — Lil Legend Studio (miniatura personalizada de Solomon)",
    "url": "https://lillegendstudio.com/wp-content/uploads/2019/10/DSCF1353-1024x902.jpg",
    "page": "https://lillegendstudio.com/2019/10/16/solomon-demeter-comission/",
    "fallback": "./assets/ui/portraits/fulgrim/solomon-demeter.webp",
    "unlock": 1
  },
  "Ostian Delafour": {
    "category": "generated",
    "label": "RECONSTRUÇÃO ARTÍSTICA // NÃO CANÔNICA",
    "credit": "Heresy Score — pintura original gerada",
    "fallback": "./assets/ui/portraits/fulgrim/ostian-delafour.webp",
    "unlock": 1
  },
  "Serena d'Angelus": {
    "category": "generated",
    "label": "RECONSTRUÇÃO ARTÍSTICA // NÃO CANÔNICA",
    "credit": "Heresy Score — pintura original gerada",
    "fallback": "./assets/ui/portraits/fulgrim/serena-dangelus.webp",
    "unlock": 1
  },
  "Bequa Kynska": {
    "category": "generated",
    "label": "RECONSTRUÇÃO ARTÍSTICA // NÃO CANÔNICA",
    "credit": "Heresy Score — pintura original gerada",
    "fallback": "./assets/ui/portraits/fulgrim/bequa-kynska.webp",
    "unlock": 1
  },
  "Paljor Dorji": {
    "category": "generated",
    "label": "RECONSTRUÇÃO ARTÍSTICA // NÃO CANÔNICA",
    "credit": "Heresy Score — pintura original gerada",
    "fallback": "./assets/ui/portraits/fulgrim/paljor-dorji.webp",
    "unlock": 1
  },
  "Julius Kaesoron": {
    "category": "generated",
    "label": "RECONSTRUÇÃO ARTÍSTICA // NÃO CANÔNICA",
    "credit": "Heresy Score — pintura original gerada",
    "fallback": "./assets/ui/portraits/fulgrim/julius-kaesoron.webp",
    "unlock": 1
  },
  "Marius Vairosean": {
    "category": "generated",
    "label": "RECONSTRUÇÃO ARTÍSTICA // NÃO CANÔNICA",
    "credit": "Heresy Score — pintura original gerada",
    "fallback": "./assets/ui/portraits/fulgrim/marius-vairosean.webp",
    "unlock": 1
  },
  "Gaius Caphen": {
    "category": "generated",
    "label": "RECONSTRUÇÃO ARTÍSTICA // NÃO CANÔNICA",
    "credit": "Heresy Score — pintura original gerada",
    "fallback": "./assets/ui/portraits/fulgrim/gaius-caphen.webp",
    "unlock": 1
  },
  "Coraline Aseneca": {
    "category": "generated",
    "label": "RECONSTRUÇÃO ARTÍSTICA // NÃO CANÔNICA",
    "credit": "Heresy Score — pintura original gerada",
    "fallback": "./assets/ui/portraits/fulgrim/coraline-aseneca.webp",
    "unlock": 1
  },
  "Eidolon": {
    "category": "official",
    "subtype": "forgeworld_model",
    "label": "OFICIAL // FORGE WORLD (30K)",
    "credit": "Games Workshop / Forge World — Lord Commander Eidolon",
    "url": "https://miniset.net/files/set/gw-99560102232-8.jpg",
    "page": "https://miniset.net/sets/gw-99560102232",
    "fallback": "./assets/ui/portraits/fulgrim/eidolon.webp",
    "unlock": 2
  },
  "Vespasian": {
    "category": "generated",
    "label": "RECONSTRUÇÃO ARTÍSTICA // NÃO CANÔNICA",
    "credit": "Heresy Score — pintura original gerada",
    "fallback": "./assets/ui/portraits/fulgrim/vespasian.webp",
    "unlock": 2
  },
  "Fabius": {
    "category": "generated",
    "label": "RECONSTRUÇÃO ARTÍSTICA // NÃO CANÔNICA",
    "credit": "Heresy Score — pintura original gerada; aparência inicial, não versão futura",
    "fallback": "./assets/ui/portraits/fulgrim/fabius.webp",
    "unlock": 3
  },
  "Saul Tarvitz": {
    "category": "official",
    "subtype": "forgeworld_model",
    "label": "OFICIAL // FORGE WORLD (30K)",
    "credit": "Games Workshop / Forge World — Captain Saul Tarvitz",
    "url": "https://modelgeek.com/upload/media/entries/2020-12/27/60-entry-2-1609073583.jpg",
    "page": "https://www.warhammer-community.com/en-gb/articles/zl9wmpdq/saul-tarvitz-the-first-loyalist/",
    "fallback": "./assets/ui/portraits/fulgrim/saul-tarvitz.webp",
    "unlock": 4
  },
  "Lucius": {
    "category": "generated",
    "label": "RECONSTRUÇÃO ARTÍSTICA // NÃO CANÔNICA",
    "credit": "Heresy Score — pintura original gerada; sem usar versões posteriores com spoilers",
    "fallback": "./assets/ui/portraits/fulgrim/lucius.webp",
    "unlock": 4
  },
  "Ferrus Manus": {
    "category": "official",
    "subtype": "black_library_cover",
    "label": "OFICIAL // BLACK LIBRARY (30K)",
    "credit": "Mikhail Savier — capa Black Library: Ferrus Manus, Gorgon of Medusa",
    "url": "https://www.blacklibrary.com/Images/Product/DefaultBL/xlarge/BLPROCESSED-Ferrus-Manus-Cover.jpg",
    "page": "https://www.blacklibrary.com/the-horus-heresy/novels/ferrus-manus-gorgon-of-medusa-ebook.html",
    "fallback": "./assets/ui/portraits/fulgrim/ferrus-manus.webp",
    "unlock": 4
  }
};
// Additional reader-cleared original 2D artwork sources. A remote image is
// displayed only after the browser confirms it loads successfully.
ART["Eldrad Ulthran"]={
 category:"official",subtype:"codex_illustration",
 label:"ILUSTRAÇÃO OFICIAL // CODEX: ELDAR",
 credit:"Games Workshop — Codex: Eldar (4th Edition), p. 50",
 url:"https://wh40k.lexicanum.com/mediawiki/images/d/db/Eldrad_Ulthran_Art.jpg",
 page:"https://wh40k.lexicanum.com/mediawiki/index.php?title=File:Eldrad_Ulthran_Art.jpg",
 unlock:11
};
// Offline-safe illustrated identification plates for newly added people.
// These are symbolic UI graphics, NEVER claimed as canonical portraits.
function symbolicPlate(p){
 const eldar=/Eldrad|Khiraen/i.test(p.name);
 const iron=/Balhaan|Santor/i.test(p.name);
 const bg=eldar?"#142c2d":iron?"#252b30":"#302739";
 const accent=eldar?"#9bd6bb":iron?"#b5c4c6":"#d8b88c";
 const emblem=eldar?"✧":iron?"⚙":"✦";
 const label=p.name.replace(/[&<>"]/g,"").slice(0,28);
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="480" height="600" viewBox="0 0 480 600"><rect width="480" height="600" fill="'+bg+'"/><rect x="23" y="23" width="434" height="554" rx="8" fill="none" stroke="'+accent+'" stroke-width="3"/><path d="M90 170 L240 72 L390 170 M90 435 L240 527 L390 435" fill="none" stroke="'+accent+'" stroke-opacity=".5" stroke-width="3"/><text x="240" y="332" font-size="174" text-anchor="middle" fill="'+accent+'" font-family="serif">'+emblem+'</text><text x="240" y="480" font-size="24" text-anchor="middle" fill="#eee9db" font-family="sans-serif">'+label+'</text><text x="240" y="552" font-size="15" text-anchor="middle" fill="'+accent+'" font-family="sans-serif">IDENTIFICAÇÃO SIMBÓLICA · NÃO É RETRATO</text></svg>';
 return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
}
for(const p of d.people){
 if(!p.image&&!ART[p.name]){
  p.image=symbolicPlate(p);
  p.visual="IDENTIFICAÇÃO SIMBÓLICA // RETRATO PENDENTE";
  p.art={kind:"symbolic",credit:"Heresy Score — placa gráfica, não representa a aparência do personagem"};
 }
}
// Reader-safe two-dimensional art, with source pages identifying the exact character.
ART["Fulgrim"]={
 category:"official",subtype:"black_library_cover",
 label:"ARTE OFICIAL // PALATINE PHOENIX",
 credit:"Mikhail Savier — Fulgrim: The Palatine Phoenix (Warhammer Art)",
 url:"https://www.warhammerart.com/cdn/shop/files/Fulgrim-The-Palatine-Phoenix.jpg?v=1741515735&width=1946",
 page:"https://www.warhammerart.com/products/fulgrim-the-palatine-phoenix",
 unlock:1
};
ART["Lucius"]={
 category:"official",subtype:"horus_heresy_artbook",
 label:"ARTE OFICIAL // LUCIUS PRÉ-HERESIA",
 credit:"Games Workshop — Horus Heresy artbooks, Lucius (pre-Heresy)",
 url:"https://wh40k.lexicanum.com/mediawiki/images/a/a3/LuciusPreHeresy.jpg",
 page:"https://wh40k.lexicanum.com/wiki/File:LuciusPreHeresy.jpg",
 unlock:4
};
ART["Saul Tarvitz"]={
 category:"official",subtype:"horus_heresy_legions_art",
 label:"ARTE OFICIAL // HORUS HERESY LEGIONS",
 credit:"Games Workshop — The Horus Heresy: Legions, carta de Saul Tarvitz",
 url:"https://wh40k.lexicanum.com/mediawiki/images/e/e0/SaulTarvitzArt.jpg",
 page:"https://wh40k.lexicanum.com/wiki/File:SaulTarvitzArt.jpg",
 unlock:4
};
window.HS_FULGRIM_ART_SOURCE=ART;
function attach(p){
 const a=ART[p.name];if(!a)return;
 if(p.art?.kind==="personal_reference"||p.art?.kind==="archive_reconstruction")return;
 if(p.art?.verifiedOnDevice&&p.image===a.url)return;
 // Never present old AI-generated art as a verified likeness.
 const fallback=symbolicPlate(p);
 p.image=fallback;
 p.visual="IDENTIFICAÇÃO SIMBÓLICA // RETRATO REAL PENDENTE";
 p.art={kind:"symbolic",credit:"Heresy Score — identificação gráfica, não é a aparência do personagem",sourcePage:a.page||""};
 if(!a.url||a.subtype==="forgeworld_model"||typeof Image!=="function")return;
 const candidate=new Image();
 candidate.referrerPolicy="no-referrer";
 candidate.onload=()=>{
  if(p.art?.kind==="personal_reference"||p.art?.kind==="archive_reconstruction")return;
  if(p.image!==fallback)return;
  p.image=a.url;
  p.visual=a.label;
  p.art={kind:a.category,sourceKind:a.subtype||a.category,credit:a.credit,sourcePage:a.page||"",fallback,verifiedOnDevice:true};
  if(typeof state!=="undefined"&&state.activeBookSlug==="fulgrim"&&typeof render==="function")render();
 };
 candidate.onerror=()=>{
  if(p.image!==fallback)return;
  p.visual="IDENTIFICAÇÃO SIMBÓLICA // ARTE REMOTA INDISPONÍVEL";
  p.art={kind:"symbolic",credit:"Heresy Score — arte remota indisponível; não é um retrato",sourcePage:a.page||""};
  if(typeof state!=="undefined"&&state.activeBookSlug==="fulgrim"&&typeof render==="function")render();
 };
 candidate.src=a.url;
}
for(const p of d.people)attach(p);
// Re-evaluate newly unlocked records after each completed chapter and book switch.
window.addEventListener("hs-book-changed",()=>{for(const p of d.people)attach(p)});
const logSave=document.getElementById("saveFeedback");
if(logSave)logSave.addEventListener("click",()=>setTimeout(()=>{
 if(state.activeBookSlug!=="fulgrim")return;
 for(const p of d.people)attach(p);
 window.HSPrivateArt?.refresh?.();
 if(typeof render==="function")render();
},0));
// A source label also follows the enlarged dossier, where users most need
// to distinguish an actual official likeness from artist interpretation.
const artDialog=document.getElementById("personDialog");
const artDialogImg=document.getElementById("personDialogImg");
if(artDialog&&artDialogImg&&typeof openPerson==="function"){
 const credit=document.createElement("p");credit.id="hsArtProvenance";credit.className="small";
 credit.style.cssText="margin:9px 0;color:#c7b48e;font-size:11px";
 artDialogImg.after(credit);
 const oldOpen=openPerson;
 openPerson=function(p){
  oldOpen(p);
  if(state.activeBookSlug!=="fulgrim"||!p.art){credit.style.display="none";return}
  credit.style.display="block";
  const t=p.art.kind==="symbolic"||p.art.kind==="pending"?"IDENTIFICAÇÃO SIMBÓLICA":p.art.kind==="official"?"ARTE OFICIAL":p.art.kind==="fanart"?"FANART CREDITADA":p.art.kind==="personal_reference"?"ARTE PESSOAL":"RECONSTRUÇÃO NÃO CANÔNICA";
  credit.textContent=t+" // "+String(p.art.credit||p.visual||"origem não identificada");
 };
}
})();