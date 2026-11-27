/* Book-neutral visual registry v2 — canon-first, spoiler-aware.
   ONLY reader-confirmed Prelude + chapters 1–5 of the provided Descent of
   Angels edition (indices 1–6). Never infer unlock from the printed dramatis
   personae alone: it also lists people encountered in later chapters.
   Source order: publisher image verified safe/licensed for display,
   credited fanart with permission, original reconstruction only by request.
   Future plot text and unapproved image references are NOT public. */
(function(root){
"use strict";
const BOOK="descent-of-angels";
const ATLAS="./assets/visuals/caliban-first-archive.webp";
const BACKUP="./assets/visuals/caliban-first-archive.svg";
const reconstruction="Reconstrução artística original, não oficial e não canônica";
const officialBookArt={
 type:"publisher_reference",
 url:"https://www.warhammerart.com/products/descent-of-angels",
 source:"Warhammer Art / Neil Roberts",
 label:"Arte oficial da capa do livro",
 license:"reference_link_only",
 note:"Ilustração oficial do livro; não representa retratos verificados destes indivíduos."
};
const raw=[
 {id:"caliban-forests",name:"Florestas de Caliban",kind:"place",unlock:1,
  group:"Caliban",role:"Ambiente",quadrant:"sw",
  summary:"Florestas imensas e perigosas que marcam o cotidiano e os costumes do planeta."},
 {id:"the-order-fortress",name:"Aldurukh",kind:"place",unlock:2,
  group:"A Ordem",role:"Fortaleza-mosteiro",quadrant:"se",
  summary:"Fortaleza da Ordem em Caliban, onde ocorrem treinamentos e cerimônias."},
 {id:"caliban",name:"Caliban",kind:"place",unlock:1,
  group:"Caliban",role:"Planeta",
  summary:"Mundo de antigas ordens de cavalaria e feras que habitam suas florestas."},
 {id:"circle-chamber",name:"Câmara Circular",kind:"place",unlock:3,
  group:"A Ordem",role:"Salão",
  summary:"Salão de reunião e discursos dos cavaleiros e aspirantes da Ordem."},
 {id:"northwilds",name:"Northwilds",kind:"place",unlock:1,
  group:"Caliban",role:"Região",
  summary:"Extensão remota das florestas de Caliban, mencionada no início do livro."},
 {id:"zahariel",name:"Zahariel",kind:"character",unlock:2,
  group:"A Ordem",role:"Aspirante a cavaleiro",quadrant:"nw",
  summary:"Jovem de Caliban em formação na Ordem, dedicado aos ideais da cavalaria."},
 {id:"nemiel",name:"Nemiel",kind:"character",unlock:3,
  group:"A Ordem",role:"Aspirante a cavaleiro",quadrant:"ne",
  summary:"Primo de Zahariel e companheiro de formação, com quem partilha uma rivalidade amistosa."},
 {id:"lion-eljonson",name:"Lion El’Jonson",kind:"character",unlock:1,
  group:"A Ordem",role:"Comandante da Ordem",
  summary:"Líder que inspira os cavaleiros de Caliban na campanha contra as grandes feras."},
 {id:"luther",name:"Luther",kind:"character",unlock:1,
  group:"A Ordem",role:"Segundo comandante",
  summary:"Um dos principais líderes da Ordem e aliado próximo de Lion El’Jonson."},
 {id:"lord-cypher",name:"Lord Cypher",kind:"character",unlock:2,
  group:"A Ordem",role:"Guardião das tradições",
  summary:"Figura ligada aos ritos, juramentos e costumes da Ordem."},
 {id:"master-ramiel",name:"Mestre Ramiel",kind:"character",unlock:2,
  group:"A Ordem",role:"Instrutor",
  summary:"Mestre responsável por ensinar e disciplinar os jovens aspirantes."},
 {id:"brother-amadis",name:"Irmão Amadis",kind:"character",unlock:3,
  group:"A Ordem",role:"Cavaleiro da Ordem",
  summary:"Cavaleiro admirado entre os aspirantes, conhecido por seus feitos e discursos."},
 {id:"attias",name:"Attias",kind:"character",unlock:4,
  group:"A Ordem",role:"Aspirante a cavaleiro",
  summary:"Um dos jovens que participam dos treinos e desafios da Ordem."},
 {id:"eliath",name:"Eliath",kind:"character",unlock:4,
  group:"A Ordem",role:"Aspirante a cavaleiro",
  summary:"Aspirante que integra o círculo de treinamento de Zahariel."}
];
const records=Object.freeze(raw.map(source=>{
 const art=source.quadrant?Object.freeze({
  kind:"reconstruction",source:"Ilustração original do projeto",
  asset:ATLAS,fallbackAsset:BACKUP,quadrant:source.quadrant,
  clearedAt:source.unlock,licenseNote:reconstruction
 }):null;
 return Object.freeze({...source,art,artStatus:art?"ORIGINAL_RECONSTRUCTION":"NO_SAFE_IMAGE_VERIFIED"});
}));
const data={};
data[BOOK]={theme:{
 name:"Caliban · Era das Ordens",accent:"#a8db72",accentStrong:"#d3e0c2",
 surface:"#101a12",background:"#080e0a",border:"#435d3c",artwork:ATLAS,fallback:BACKUP
},records};
const known=(slug,clearance)=>{
 const n=Number.isFinite(+clearance)?Math.max(0,Math.floor(+clearance)):0;
 return (data[slug]?.records||[]).filter(e=>e.unlock<=n);
};
const entry=(slug,id)=>(data[slug]?.records||[]).find(e=>e.id===id)||null;
const byName=(slug,name)=>(data[slug]?.records||[]).find(e=>e.name===name)||null;
const theme=slug=>data[slug]?.theme||{
 name:"Arquivo de leitura",accent:"#b8c7ae",accentStrong:"#e3e7da",
 surface:"#141919",background:"#0b0e0e",border:"#394541",artwork:null
};
root.HSReaderVisuals=Object.freeze({
 schema:2,books:data,known,entry,byName,theme,
 asset:ATLAS,backupAsset:BACKUP,provenance:reconstruction,
 officialBookArt,sourcePolicy:"official-safe-and-licensed > permitted-credited-fanart > explicitly-requested-original"
});
const book=root.HS_DESCENT_DATA;
if(book?.slug!==BOOK)return;
for(const v of records){
 if(v.kind==="character"){
  book.people.push({
   id:v.id,name:v.name,role:v.role+" // "+v.group,affiliation:v.group,
   unlock:v.unlock,visual:v.art?"Reconstrução artística original":"Retrato em pesquisa",
   image:null,art:v.art,artStatus:v.artStatus,
   facts:[{ch:v.unlock,text:v.summary}],
   note:v.art?"Ilustração interpretativa; não é um retrato canônico.":
    "Nenhum retrato individual seguro e com licença de uso verificada. Arte oficial e fanart são priorizadas antes de qualquer geração."
  });
 }else{
  book.archive.push({
   key:v.id,name:v.name,kind:"theatre",kindLabel:v.role,
   unlock:v.unlock,glyph:"◈",visual:v.art?"Reconstrução original":"Imagem em pesquisa",
   note:v.summary,art:v.art,artStatus:v.artStatus
  });
 }
}
book.relations=[
 {a:"Zahariel",b:"Nemiel",label:"Primos e companheiros de treinamento",unlock:3},
 {a:"Lion El’Jonson",b:"Luther",label:"Liderança da Ordem",unlock:1}
];
})(typeof window!=="undefined"?window:globalThis);
