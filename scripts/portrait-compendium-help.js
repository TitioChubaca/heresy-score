/* Compendium portrait diagnostics and local import shortcut (no cloud art uploads). */
(()=>{
"use strict";
const panel=document.querySelector('[data-view-panel="personae"]');
const roster=document.getElementById("roster");
if(!panel||!roster)return;
const box=document.createElement("section");
box.className="panel";box.id="hsPortraitHelp";
box.style.cssText="margin-top:12px;padding:12px";
const text=document.createElement("p");text.className="small";text.id="hsPortraitHelpText";
const button=document.createElement("button");button.className="btn";button.type="button";
box.append(text,button);
roster.before(box);
let fileInput=null;
function update(){
 const isV=state.activeBookSlug==="fulgrim",read=!!state.done?.[1];
 box.hidden=!isV||!read;
 if(box.hidden)return;
 const unlocked=people.filter(p=>(p.unlock||1)<=maxClearance()),count=unlocked.filter(p=>!!p.image).length;
 const missing=unlocked.length-count;
 if(!unlocked.length){text.textContent="Ainda não há personagens liberados.";button.hidden=true;return}
 button.hidden=false;
 if(count===unlocked.length){
  text.textContent="Todos os retratos disponíveis deste capítulo foram carregados.";
  button.textContent="Gerenciar coleção local";
 }else if(count===0){
  text.textContent="Nenhum retrato deste livro está carregado. As imagens anexadas ao projeto ChatGPT não são instaladas automaticamente no navegador.";
  button.textContent="Importar arquivo .hsartpack";
 }else{
  text.textContent=count+" de "+unlocked.length+" retratos aparecem neste livro. "+missing+" personagens ainda não possuem imagens individuais aprovadas.";
  button.textContent="Gerenciar retratos pendentes";
 }
 button.onclick=()=>{
  if(count>0){setView("settings");const section=document.querySelector("#hsPortraitCoverage");section?.scrollIntoView?.({behavior:"smooth",block:"center"});return}
  fileInput=document.getElementById("hsPackFile");
  const upload=document.getElementById("hsPackButton");
  if(!fileInput||!upload){setView("settings");return}
  fileInput.onchange=()=>{if(fileInput.files?.length)upload.click();fileInput.onchange=null};
  fileInput.click();
 };
}
const base=render;render=function(){base();update()};
window.addEventListener("hs-portraits-updated",update);
window.addEventListener("hs-book-changed",update);
update();
})();