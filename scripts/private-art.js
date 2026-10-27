/* Local, book-aware portrait library. Art never leaves this browser. */
(()=>{
"use strict";
const DB_NAME="hs-private-portraits",STORE="images";
let generation=0;
const objectURLs=new Map();
const holder=document.querySelector('[data-view-panel="settings"]');
if(!holder)return;
const panel=document.createElement("section");
panel.className="panel";
panel.innerHTML='<h2>Personal Portrait Library</h2><p class="small">Arquivos guardados apenas neste aparelho. Imagens importadas não fazem parte do backup dos logs.</p><p id="hsPortraitCoverage" class="small" aria-live="polite">Verificando coleção pessoal...</p><label class="small">Personagem deste livro <select id="privatePortraitName"></select></label><input id="privatePortraitArtist" placeholder="Crédito do artista" value="origem a confirmar"><input type="file" id="privatePortraitFile" accept="image/png,image/jpeg,image/webp"><button class="btn" type="button" id="privatePortraitSave">Importar retrato individual</button><button class="btn" type="button" id="hsPortraitRefresh">Reverificar retratos</button><p id="privatePortraitMessage" class="small"></p>';
holder.append(panel);
const $=s=>panel.querySelector(s),sel=$("#privatePortraitName");
function db(){return new Promise((ok,no)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
const read=async(name)=>{const d=await db();return new Promise((ok,no)=>{const r=d.transaction(STORE).objectStore(STORE).get(name);r.onsuccess=()=>ok(r.result||null);r.onerror=()=>no(r.error)})};
const put=async(name,entry)=>{const d=await db();return new Promise((ok,no)=>{const t=d.transaction(STORE,"readwrite");t.objectStore(STORE).put(entry,name);t.oncomplete=ok;t.onerror=()=>no(t.error)})};
const keys=async()=>{const d=await db();return new Promise((ok,no)=>{const r=d.transaction(STORE).objectStore(STORE).getAllKeys();r.onsuccess=()=>ok(r.result||[]);r.onerror=()=>no(r.error)})};
function availablePeople(){
 const slug=state.activeBookSlug||"flight-of-the-eisenstein";
 if(slug==="fulgrim"&&!state.done?.[1])return [];
 const clearance=typeof maxClearance==="function"?maxClearance():1;
 return [...people].filter(p=>p&&p.name&&(p.unlock||1)<=clearance);
}
function choices(){
 const names=[...new Set(availablePeople().map(p=>p.name))];
 const prior=sel.value;
 sel.replaceChildren();
 for(const name of names){const o=document.createElement("option");o.value=name;o.textContent=name;sel.append(o)}
 if(names.includes(prior))sel.value=prior;
 sel.disabled=!names.length;
 $("#privatePortraitSave").disabled=!names.length;
}
async function refresh(){
 const gen=++generation,selected=[...availablePeople()];
 const [available,records]=await Promise.all([keys(),Promise.all(selected.map(async p=>({person:p,record:await read(p.name)})))]);
 if(gen!==generation)return null;
 const loaded=[];
 for(const {person,record} of records){
  if(!record?.file)continue;
  if(!people.includes(person))continue;
  const old=objectURLs.get(person.name);
  const url=URL.createObjectURL(record.file);
  objectURLs.set(person.name,url);
  person.image=url;
  const kind=record.sourceKind==="archive_reconstruction"?"archive_reconstruction":"personal_reference";
  const label=String(record.artist||"crédito pendente").replace(/[<>&\"\']/g,"").slice(0,100);
  person.visual=(kind==="archive_reconstruction"?"ARCHIVE RECONSTRUCTION // ":"PERSONAL ART // ")+label;
  person.art={kind,subjectExact:false};
  if(old)URL.revokeObjectURL(old);
  loaded.push(person.name);
 }
 choices();
 const missing=selected.filter(p=>!available.includes(p.name)).map(p=>p.name);
 const refs=available.filter(k=>String(k).startsWith("reference:")).length;
 $("#hsPortraitCoverage").textContent="Livro ativo: "+loaded.length+"/"+selected.length+" retratos disponíveis. Coleção local: "+(available.length-refs)+" retratos, "+refs+" referências. "+(missing.length?"Ainda sem arquivo para: "+missing.join(", ")+".":"Todos os personagens disponíveis têm retrato.");
 if(typeof render==="function")render();
 return {loaded,missing,stored:available.length};
}
$("#privatePortraitSave").onclick=async()=>{
 const f=$("#privatePortraitFile").files?.[0],name=sel.value;
 if(!f||!name||f.size>9000000||!["image/jpeg","image/png","image/webp"].includes(f.type)){
  $("#privatePortraitMessage").textContent="Escolha uma imagem JPG, PNG ou WEBP de até 9 MB.";return;
 }
 try{
  await put(name,{file:f,artist:$("#privatePortraitArtist").value.trim()||"crédito pendente",source:"individual"});
  $("#privatePortraitMessage").textContent="Retrato salvo para "+name+".";
  await refresh();
 }catch(e){$("#privatePortraitMessage").textContent="Erro no armazenamento local: "+e.message}
};
$("#hsPortraitRefresh").onclick=()=>refresh().catch(e=>$("#privatePortraitMessage").textContent=e.message);
window.HSPrivateArt={refresh,read,keys,availablePeople};
window.addEventListener("hs-portraits-updated",()=>refresh().catch(()=>{}));
window.addEventListener("hs-book-changed",()=>refresh().catch(()=>{}));
refresh().catch(e=>$("#hsPortraitCoverage").textContent="Coleção local indisponível: "+e.message);
})();