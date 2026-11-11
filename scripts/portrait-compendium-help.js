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
 box.hidden=!isV||!read;box.style.display=box.hidden?"none":"";
 if(box.hidden)return;
 const unlocked=people.filter(p=>(p.unlock||1)<=maxClearance());
 const exact=unlocked.filter(p=>p.art?.kind==="official"||p.art?.kind==="fanart"||p.art?.kind==="personal_reference").length;
 const pending=unlocked.length-exact;
 if(!unlocked.length){text.textContent="Ainda não há personagens liberados.";button.hidden=true;return}
 button.hidden=false;
 text.textContent=exact+" de "+unlocked.length+" personagens com arte original ou pessoal. "+pending+
  " com identificação simbólica/provisória ou reconstrução ainda não substituída. As placas simbólicas não são retratos.";
 button.textContent="Gerenciar arte dos personagens";

 button.onclick=()=>{
  if(unlocked.length>0){setView("settings");const section=document.querySelector("#hsPortraitCoverage");section?.scrollIntoView?.({behavior:"smooth",block:"center"});return}
  fileInput=document.getElementById("hsPackFile");
  const upload=document.getElementById("hsPackButton");
  if(!fileInput||!upload){setView("settings");return}
  fileInput.onchange=()=>{if(fileInput.files?.length)upload.click();fileInput.onchange=null};
  setView("settings"); // Open the panel before invoking the Android file picker.
  fileInput.click();
 };
}
const base=render;render=function(){base();update()};
window.addEventListener("hs-portraits-updated",update);
window.addEventListener("hs-book-changed",update);
update();
})();