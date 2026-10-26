/* Per-person crop display controls, with non-destructive local metadata. */
(()=>{
const presets={"Nathaniel Garro":[50,18,108],"Mortarion":[50,22,102],"Garviel Loken":[50,16,110],"Ezekyle Abaddon":[50,17,107]};
const get=n=>{try{return JSON.parse(localStorage.getItem("hs-crop:"+n))||[50,50,100]}catch{return [50,50,100]}};
const fit=n=>localStorage.getItem("hs-crop-fit:"+n)==="cover"?"cover":"contain";
const style=document.createElement("style");style.textContent=".person-visual img{max-width:none}.hs-preview{width:210px;height:250px;overflow:hidden;border:1px solid #536746;margin:12px auto}.hs-preview img{width:100%;height:100%;object-fit:contain}.hs-original{width:130px;height:210px;background:#050805;border:1px solid #536746;margin:8px auto}.hs-original img{width:100%;height:100%;object-fit:contain}";document.head.append(style);
function decorate(){document.querySelectorAll(".person").forEach(card=>{const n=card.querySelector(".pname")?.textContent,img=card.querySelector(".person-visual img");if(!n||!img)return;const [x,y,z]=get(n);img.style.objectFit=fit(n);img.style.objectPosition=x+"% "+y+"%";img.style.transform="scale("+(z/100)+")";img.style.transformOrigin=x+"% "+y+"%";img.style.filter="saturate(.88) contrast(1.025)"})}
const original=render;render=function(){original();decorate()};
const oldOpen=openPerson;openPerson=function(p){oldOpen(p);const img=document.getElementById("personDialogImg");if(img){img.style.objectFit="contain";img.style.transform="none";img.style.filter="saturate(.88) contrast(1.025)"}};
const settings=document.querySelector('[data-view-panel="settings"]');if(!settings)return;
const panel=document.createElement("section");panel.className="panel";
panel.innerHTML='<h2>Portrait Crop Studio</h2><label class="small">Personagem ou retrato importado <select id="hsCropPerson"></select></label><p id="hsCropAvailability" class="small" aria-live="polite">Verificando arquivo...</p><p class="small">Arquivo original (sempre completo)</p><div class="hs-original"><img id="hsCropOriginal" alt="Imagem original sem recorte"></div><p class="small">Prévia do card</p><div class="hs-preview"><img id="hsCropImage" alt="Prévia do card"></div><label class="small">Exibição no card <select id="hsCropFit"><option value="contain">Imagem inteira (sem cortes)</option><option value="cover">Preencher card (com recorte)</option></select></label><label class="small">Horizontal <input id="hsCropX" type="range" min="0" max="100"></label><label class="small">Vertical <input id="hsCropY" type="range" min="0" max="100"></label><label class="small">Zoom <input id="hsCropZ" type="range" min="70" max="160"></label><button class="btn" id="hsCropSave">Salvar recorte</button><button class="btn" id="hsCropReset">Restaurar padrão</button>';
settings.append(panel);
const $=id=>document.getElementById(id),selector=$("hsCropPerson");
let previewURL=null;
async function refreshChoices(){
 const prior=selector.value;
 const unlocked=window.HSPrivateArt?.availablePeople?.().map(p=>p.name)||[];
 const stored=await window.HSPrivateArt?.keys?.()||[];
 const names=[...new Set([...unlocked,...stored.filter(k=>typeof k==="string"&&!k.startsWith("reference:"))])];
 selector.replaceChildren();
 for(const n of names){const o=document.createElement("option");o.textContent=n;o.value=n;selector.append(o)}
 if(names.includes(prior))selector.value=prior;
 selector.disabled=!names.length;
 for(const id of ["hsCropX","hsCropY","hsCropZ","hsCropFit","hsCropSave","hsCropReset"])$(id).disabled=!names.length;
 if(names.length)await preview();
 else {
   $("hsCropOriginal").style.display="none";$("hsCropImage").style.display="none";
   $("hsCropAvailability").textContent="Nenhum personagem liberado ou retrato importado ainda.";
 }
}
const read=async n=>new Promise((ok,no)=>{const r=indexedDB.open("hs-private-portraits",1);r.onsuccess=()=>{const d=r.result;if(!d.objectStoreNames.contains("images"))return ok(null);const x=d.transaction("images").objectStore("images").get(n);x.onsuccess=()=>ok(x.result);x.onerror=()=>no(x.error)};r.onerror=()=>no(r.error)});
async function preview(){let n=selector.value,img=$("hsCropImage"),original=$("hsCropOriginal");const [x,y,z]=get(n);$("hsCropX").value=x;$("hsCropY").value=y;$("hsCropZ").value=z;$("hsCropFit").value=fit(n);try{const rec=await read(n);if(previewURL)URL.revokeObjectURL(previewURL);previewURL=rec?.file?URL.createObjectURL(rec.file):null;if(previewURL){img.src=previewURL;original.src=previewURL;img.style.display="block";original.style.display="block";$("hsCropAvailability").textContent="Imagem armazenada neste navegador."}else {img.style.display="none";original.style.display="none";$("hsCropAvailability").textContent="Sem retrato importado para este nome. Use Personal Portrait Library ou importe o pacote."}}catch{img.style.display="none";original.style.display="none";$("hsCropAvailability").textContent="Não foi possível acessar o arquivo."}setPreview()}
function setPreview(){const im=$("hsCropImage"),x=+$("hsCropX").value,y=+$("hsCropY").value,z=+$("hsCropZ").value;im.style.objectFit=$("hsCropFit").value;im.style.objectPosition=x+"% "+y+"%";im.style.transform="scale("+(z/100)+")";im.style.transformOrigin=x+"% "+y+"%"}
selector.onchange=preview;$("hsCropFit").onchange=setPreview;for(const id of ["hsCropX","hsCropY","hsCropZ"])$(id).oninput=setPreview;
$("hsCropSave").onclick=()=>{localStorage.setItem("hs-crop:"+selector.value,JSON.stringify([+$("hsCropX").value,+$("hsCropY").value,+$("hsCropZ").value]));localStorage.setItem("hs-crop-fit:"+selector.value,$("hsCropFit").value);render();preview()};
$("hsCropReset").onclick=()=>{localStorage.removeItem("hs-crop:"+selector.value);localStorage.removeItem("hs-crop-fit:"+selector.value);render();preview()};
window.addEventListener("hs-portraits-updated",()=>refreshChoices().catch(()=>{}));
window.addEventListener("hs-book-changed",()=>refreshChoices().catch(()=>{}));
refreshChoices().catch(e=>$("hsCropAvailability").textContent=e.message);
})();