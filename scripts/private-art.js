/* Local-only portrait importer for personal reading use. */
(()=>{
const dbName="hs-private-portraits";
function openDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open(dbName,1);req.onupgradeneeded=()=>req.result.createObjectStore("images");req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
function storeImage(name,file,artist){return openDB().then(db=>new Promise((resolve,reject)=>{const tx=db.transaction("images","readwrite");tx.objectStore("images").put({file,artist},name);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)}))}
function readImage(name){return openDB().then(db=>new Promise((resolve,reject)=>{const tx=db.transaction("images","readonly");const r=tx.objectStore("images").get(name);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)}))}
const holder=document.querySelector('[data-view-panel="settings"]');
if(!holder)return;
const panel=document.createElement("section");panel.className="panel";panel.innerHTML='<h2>Personal Portrait Library</h2><p class="small">Imagens locais deste navegador. Não são enviadas ao servidor.</p><select id="privatePortraitName"></select><input id="privatePortraitArtist" placeholder="Crédito do artista" value="@tattoo_babay"><input type="file" id="privatePortraitFile" accept="image/png,image/jpeg,image/webp"><button class="btn" id="privatePortraitSave">Importar imagem</button><p id="privatePortraitMessage" class="small"></p>';
holder.append(panel);
const sel=panel.querySelector("select");
for(const person of people){let option=document.createElement("option");option.textContent=person.name;option.value=person.name;sel.append(option)}
async function restore(){for(const person of people){const entry=await readImage(person.name);if(entry?.file){person.image=URL.createObjectURL(entry.file);person.visual="PERSONAL ART // "+entry.artist}}render()}
panel.querySelector("button").onclick=async()=>{const f=panel.querySelector('input[type="file"]').files[0];if(!f||f.size>9000000){panel.querySelector("#privatePortraitMessage").textContent="Escolha uma imagem de até 9 MB";return}await storeImage(sel.value,f,panel.querySelector("#privatePortraitArtist").value);panel.querySelector("#privatePortraitMessage").textContent="Imagem salva neste aparelho";await restore()};
window.HSPrivateArt={refresh:restore};
window.addEventListener("hs-portraits-updated",()=>restore().catch(()=>{}));
restore().catch(e=>{panel.querySelector("#privatePortraitMessage").textContent="Armazenamento indisponível: "+e.message});
})();