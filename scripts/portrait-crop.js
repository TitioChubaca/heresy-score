/* Per-person crop display controls, with non-destructive local metadata. */
(()=>{
const presets={"Nathaniel Garro":[50,18,108],"Mortarion":[50,22,102],"Garviel Loken":[50,16,110],"Ezekyle Abaddon":[50,17,107]};
const get=n=>{try{return JSON.parse(localStorage.getItem("hs-crop:"+n))||presets[n]||[50,20,100]}catch{return presets[n]||[50,20,100]}};
const style=document.createElement("style");style.textContent=".person-visual img{max-width:none}.hs-preview{width:210px;height:250px;overflow:hidden;border:1px solid #536746;margin:12px auto}.hs-preview img{width:100%;height:100%;object-fit:cover}";document.head.append(style);
function decorate(){document.querySelectorAll(".person").forEach(card=>{const n=card.querySelector(".pname")?.textContent,img=card.querySelector(".person-visual img");if(!n||!img)return;const [x,y,z]=get(n);img.style.objectPosition=x+"% "+y+"%";img.style.transform="scale("+(z/100)+")";img.style.transformOrigin=x+"% "+y+"%";img.style.filter="saturate(.88) contrast(1.025)"})}
const original=render;render=function(){original();decorate()};
const oldOpen=openPerson;openPerson=function(p){oldOpen(p);const img=document.getElementById("personDialogImg");if(img){img.style.objectFit="contain";img.style.transform="none";img.style.filter="saturate(.88) contrast(1.025)"}};
const settings=document.querySelector('[data-view-panel="settings"]');if(!settings)return;
const panel=document.createElement("section");panel.className="panel";
panel.innerHTML='<h2>Portrait Crop Studio</h2><label class="small">Personagem <select id="hsCropPerson"></select></label><div class="hs-preview"><img id="hsCropImage" alt="Prévia"></div><label class="small">Horizontal <input id="hsCropX" type="range" min="0" max="100"></label><label class="small">Vertical <input id="hsCropY" type="range" min="0" max="100"></label><label class="small">Zoom <input id="hsCropZ" type="range" min="70" max="160"></label><button class="btn" id="hsCropSave">Salvar recorte</button><button class="btn" id="hsCropReset">Restaurar padrão</button>';
settings.append(panel);
const $=id=>document.getElementById(id),selector=$("hsCropPerson");
const choices=["Nathaniel Garro","Mortarion","Garviel Loken","Ezekyle Abaddon"];
for(const p of people)if(!choices.includes(p.name))choices.push(p.name);
for(const n of choices){const option=document.createElement("option");option.value=n;option.textContent=n;selector.append(option)}
let previewURL=null;
const read=async n=>new Promise((ok,no)=>{const r=indexedDB.open("hs-private-portraits",1);r.onsuccess=()=>{const d=r.result;if(!d.objectStoreNames.contains("images"))return ok(null);const x=d.transaction("images").objectStore("images").get(n);x.onsuccess=()=>ok(x.result);x.onerror=()=>no(x.error)};r.onerror=()=>no(r.error)});
async function preview(){let n=selector.value,img=$("hsCropImage");const [x,y,z]=get(n);$("hsCropX").value=x;$("hsCropY").value=y;$("hsCropZ").value=z;try{const rec=await read(n);if(previewURL)URL.revokeObjectURL(previewURL);previewURL=rec?.file?URL.createObjectURL(rec.file):null;if(previewURL){img.src=previewURL;img.style.display="block"}else img.style.display="none"}catch{img.style.display="none"}setPreview()}
function setPreview(){const im=$("hsCropImage"),x=+$("hsCropX").value,y=+$("hsCropY").value,z=+$("hsCropZ").value;im.style.objectPosition=x+"% "+y+"%";im.style.transform="scale("+(z/100)+")";im.style.transformOrigin=x+"% "+y+"%"}
selector.onchange=preview;for(const id of ["hsCropX","hsCropY","hsCropZ"])$(id).oninput=setPreview;
$("hsCropSave").onclick=()=>{localStorage.setItem("hs-crop:"+selector.value,JSON.stringify([+$("hsCropX").value,+$("hsCropY").value,+$("hsCropZ").value]));render();preview()};
$("hsCropReset").onclick=()=>{localStorage.removeItem("hs-crop:"+selector.value);render();preview()};
window.addEventListener("hs-portraits-updated",preview);
preview();
})();