/* Curated Book V references. Public official/fanart URLs link to their source's image,
   not copyrighted files copied to this public repository. All user assets remain local.
   Only characters introduced by reader clearance through Chapter V are included. */
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
window.HS_FULGRIM_ART_SOURCE=ART;
function attach(p){
 const a=ART[p.name];if(!a||p.unlock>a.unlock||p.unlock>5)return;
 p.image=a.fallback;
 p.visual="RECONSTRUÇÃO ARTÍSTICA // NÃO CANÔNICA";
 p.art={kind:"original_reconstruction",category:"generated",credit:"Heresy Score",fallback:a.fallback};
 if(!a.url||typeof Image!=="function")return;
 const preflight=new Image();
 preflight.onload=()=>{
  // Never override the user's individually imported artwork from IndexedDB.
  if(p.image!==a.fallback)return;
  p.image=a.url;
  p.visual=a.label;
  p.art={kind:a.category,sourceKind:a.subtype||a.category,credit:a.credit,sourcePage:a.page||"",fallback:a.fallback,verifiedOnDevice:true};
  if(typeof state!=="undefined"&&state.activeBookSlug==="fulgrim"&&typeof render==="function")render();
 };
 preflight.onerror=()=>{
  // Public-host hotlink unavailable: keep the original matte painting, not SVG vector.
  if(p.image===a.fallback){p.visual="RECONSTRUÇÃO ARTÍSTICA // FONTE EXTERNA INDISPONÍVEL";}
 };
 preflight.referrerPolicy="no-referrer";
 preflight.src=a.url;
}
for(const p of d.people)attach(p);
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