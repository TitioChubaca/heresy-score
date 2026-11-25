/* Heresy Score visual registry v1.
   Book data, discovery clearance and artwork provenance are separate from
   the visual presentation. A later non-Warhammer book can register its own
   records and theme without changing the reading engine.
   Only Book VI facts revealed through Chapter 3 (internal unit 4) appear. */
(function(root){
"use strict";
const BOOK="descent-of-angels";
const ATLAS="./assets/visuals/caliban-first-archive.webp";
const reconstruction="Reconstrução artística original — não é uma ilustração oficial";
const records=Object.freeze([
 {id:"zahariel",name:"Zahariel",kind:"character",unlock:2,
  group:"A Ordem",role:"Aspirante a cavaleiro",quadrant:"nw",
  summary:"Jovem de Caliban que treina sob as tradições e exigências da Ordem."},
 {id:"nemiel",name:"Nemiel",kind:"character",unlock:3,
  group:"A Ordem",role:"Aspirante a cavaleiro",quadrant:"ne",
  summary:"Primo de Zahariel e seu companheiro de formação na Ordem."},
 {id:"caliban-forests",name:"Florestas de Caliban",kind:"place",unlock:1,
  group:"Caliban",role:"Local",quadrant:"sw",
  summary:"Matas antigas, imensas e perigosas que moldam a vida no planeta."},
 {id:"the-order-fortress",name:"Aldurukh",kind:"place",unlock:1,
  group:"A Ordem",role:"Fortaleza-mosteiro",quadrant:"se",
  summary:"Fortaleza da Ordem nas montanhas de Caliban, conhecida desde a abertura do livro."}
]);
const visuals={};
visuals[BOOK]={theme:{
  name:"Caliban · Era das Ordens",accent:"#b9bc8e",accentStrong:"#dfdbb1",
  surface:"#151918",background:"#0b0e0e",border:"#444945",artwork:ATLAS
 },records};
function known(slug,clearance){
 const n=Number.isFinite(+clearance)?Math.max(0,Math.floor(+clearance)):0;
 return (visuals[slug]?.records||[]).filter(e=>e.unlock<=n);
}
function entry(slug,id){return (visuals[slug]?.records||[]).find(e=>e.id===id)||null}
function byName(slug,name){return (visuals[slug]?.records||[]).find(e=>e.name===name)||null}
function theme(slug){return visuals[slug]?.theme||{
 name:"Arquivo de leitura",accent:"#b8c7ae",accentStrong:"#e3e7da",
 surface:"#141919",background:"#0b0e0e",border:"#394541",artwork:null
}}
const api=Object.freeze({schema:1,books:visuals,known,entry,byName,theme,
 asset:ATLAS,provenance:reconstruction});
root.HSReaderVisuals=api;

const book=root.HS_DESCENT_DATA;
if(book?.slug===BOOK){
 // The legacy compendium accepts people/places with an unlock index.
 // Reuse those models rather than creating a second competing archive.
 for(const v of records){
  const art={kind:"reconstruction",source:"original generated artwork",
   asset:ATLAS,quadrant:v.quadrant,clearedAt:v.unlock,licenseNote:reconstruction};
  if(v.kind==="character")book.people.push({
    name:v.name,role:v.role+" // "+v.group,affiliation:v.group,
    unlock:v.unlock,visual:"Reconstrução original",image:null,
    art, facts:[{ch:v.unlock,text:v.summary}],
    note:"Aparência ilustrativa: o livro não fornece um retrato canônico preciso."
  });
  else book.archive.push({
    key:v.id,name:v.name,kind:"theatre",kindLabel:v.role,
    unlock:v.unlock,glyph:"◈",visual:"Reconstrução original",note:v.summary,
    art
  });
 }
 book.relations=[
  {a:"Zahariel",b:"Nemiel",label:"Primos e companheiros de formação",unlock:3}
 ];
}
})(typeof window!=="undefined"?window:globalThis);
