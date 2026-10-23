/* Import personal .hsartpack JSON; original art never leaves this browser. */
(()=>{
const settings=document.querySelector('[data-view-panel="settings"]');if(!settings)return;
const panel=document.createElement("section");panel.className="panel";
panel.innerHTML='<h2>Importar coleção pessoal</h2><p class="small">Selecione o arquivo .hsartpack. As artes serão guardadas apenas neste navegador, sem upload.</p><input type="file" accept=".hsartpack,application/json" id="hsPackFile"><button type="button" class="btn" id="hsPackButton">Importar coleção</button><p class="small" id="hsPackStatus"></p>';
settings.append(panel);
const status=panel.querySelector("#hsPackStatus");
const open=()=>new Promise((ok,no)=>{const r=indexedDB.open("hs-private-portraits",1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains("images"))r.result.createObjectStore("images")};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
const put=async(db,key,entry)=>new Promise((ok,no)=>{const tx=db.transaction("images","readwrite");tx.objectStore("images").put(entry,key);tx.oncomplete=ok;tx.onerror=()=>no(tx.error)});
panel.querySelector("#hsPackButton").onclick=async()=>{
 const file=panel.querySelector("#hsPackFile").files?.[0];if(!file)return;
 status.textContent="Importando referências locais...";
 try{
  if(file.size>15000000)throw Error("Arquivo excede 15 MB");
  const data=JSON.parse(await file.text());
  if(data.format!=="heresy-score-personal-art-pack"||data.version!==1||!Array.isArray(data.entries)||data.entries.length>100)throw Error("Pacote inválido");
  const db=await open();let portraits=0,references=0;
  for(const e of data.entries){
   if(!e.id||!e.imageBase64||!e.imageBase64.length||e.imageBase64.length>3000000)continue;
   const raw=atob(e.imageBase64),bytes=new Uint8Array(raw.length);
   for(let j=0;j<raw.length;j++)bytes[j]=raw.charCodeAt(j);
   const isPortrait=!!e.characterName&&!e.referenceOnly;
   const key=isPortrait?e.characterName:"reference:"+e.id;
   await put(db,key,{file:new Blob([bytes],{type:"image/webp"}),artist:e.credit||"origem a verificar",source:"local-pack"});
   if(isPortrait)portraits++;else references++;
  }
  await window.HSPrivateArt?.refresh?.();
  window.dispatchEvent(new Event("hs-portraits-updated"));
  status.textContent=portraits+" retratos e "+references+" referências importados neste dispositivo.";
 }catch(err){status.textContent="Falha: "+err.message}
};
})();