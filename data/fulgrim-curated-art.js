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
window.HS_FULGRIM_ART_SOURCE=ART;
function attach(p){
 const a=ART[p.name];if(!a||p.unlock>a.unlock)return;
 if(p.art?.kind==="personal_reference"||p.art?.kind==="archive_reconstruction")return;
 // Do not reset an already-loaded official/fan illustration on every chapter log.
 if(p.art?.verifiedOnDevice&&p.image===a.url)return;
 if(p.art?.kind==="pending"&&p.art.credit==="Imagem remota falhou no dispositivo")return;
 p.image=a.fallback||null;
 p.visual=a.fallback?"RECONSTRUÇÃO ARTÍSTICA // NÃO CANÔNICA":"ILUSTRAÇÃO VERIFICADA PENDENTE";
 p.art=a.fallback?{kind:"original_reconstruction",category:"generated",credit:"Heresy Score",fallback:a.fallback}:{kind:"pending",credit:"Fonte em verificação"};
 // Miniature photographs are references only; prefer illustration or the existing reconstruction.
 if(a.subtype==="forgeworld_model")return;
 if(!a.url||typeof Image!=="function")return;
 const preflight=new Image();
 preflight.onload=()=>{
  // Never override the user's individually imported artwork from IndexedDB.
  if(p.image!==(a.fallback||null))return;
  p.image=a.url;
  p.visual=a.label;
  p.art={kind:a.category,sourceKind:a.subtype||a.category,credit:a.credit,sourcePage:a.page||"",fallback:a.fallback,verifiedOnDevice:true};
  if(typeof state!=="undefined"&&state.activeBookSlug==="fulgrim"&&typeof render==="function")render();
 };
 preflight.onerror=()=>{
  // Public-host hotlink unavailable: keep the original matte painting, not SVG vector.
  if(p.image===(a.fallback||null)){
   p.visual=a.fallback?"RECONSTRUÇÃO ARTÍSTICA // FONTE EXTERNA INDISPONÍVEL":"ILUSTRAÇÃO EXTERNA INDISPONÍVEL";
   p.art={kind:"pending",credit:"Imagem remota falhou no dispositivo",sourcePage:a.page||""};
   if(typeof state!=="undefined"&&state.activeBookSlug==="fulgrim"&&typeof render==="function")render();
  }
 };
 preflight.referrerPolicy="no-referrer";
 preflight.src=a.url;
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
  const t=p.art.kind==="official"?"ARTE OFICIAL":p.art.kind==="fanart"?"FANART CREDITADA":p.art.kind==="personal_reference"?"ARTE PESSOAL":"RECONSTRUÇÃO NÃO CANÔNICA";
  credit.textContent=t+" // "+String(p.art.credit||p.visual||"origem não identificada");
 };
}
})();