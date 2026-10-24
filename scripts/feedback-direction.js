/* P2 sound-direction feedback. Optional and backward compatible with old logs. */
(()=>{
"use strict";
const dialog=document.getElementById("feedbackDialog"),notes=document.getElementById("fbNotes");
if(!dialog||!notes)return;
const categories=[
 {key:"ending",label:"Encerramento / Final Cue",options:[["weak","Perdeu impacto"],["fit","Encaixou"],["over","Pesou demais"]]},
 {key:"ambience",label:"Atmosfera / espaço sonoro",options:[["thin","Faltou ambientação"],["fit","Imersiva"],["intrusive","Distrativa"]]},
 {key:"transitions",label:"Transições entre cenas",options:[["rough","Abruptas"],["fit","Naturais"],["flat","Sem contraste"]]}
];
const dictionary=Object.fromEntries(categories.map(c=>[c.key,Object.fromEntries(c.options.map(([k,v])=>[k,v]))]));
for(const c of categories){
 const caption=document.createElement("div");caption.className="seg-label";caption.textContent=c.label;
 const segment=document.createElement("div");segment.className="seg";segment.dataset.key=c.key;
 for(const [value,name] of c.options){
  const button=document.createElement("button");button.type="button";button.dataset.value=value;button.textContent=name;
  segment.append(button);
 }
 segment.onclick=e=>{
  const clicked=e.target.closest("button[data-value]");
  if(!clicked||!segment.contains(clicked))return;
  segment.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b===clicked));
 };
 notes.before(caption,segment);
}
const baseRenderDebrief=renderDebrief;
renderDebrief=function(){
 baseRenderDebrief();
 const latest=Object.keys(state.done||{}).map(Number).filter(Boolean).sort((a,b)=>b-a)[0];
 const grid=document.querySelector("#debriefBody .debrief-grid");
 if(!latest||!grid)return;
 const entry=state.done[latest]||{};
 for(const c of categories){
  const item=document.createElement("div");item.className="verdict";
  const name=document.createElement("b");name.textContent=c.label;
  const value=document.createElement("span");value.textContent=dictionary[c.key][entry[c.key]]||"Não avaliado";
  item.append(name,value);grid.append(item);
 }
};
const baseRenderLogs=renderLogs;
renderLogs=function(){
 baseRenderLogs();
 const nums=Object.keys(state.done||{}).map(Number).filter(Boolean).sort((a,b)=>b-a);
 const cards=[...document.querySelectorAll("#logHistory .log-card")];
 cards.forEach((card,i)=>{
  const entry=state.done[nums[i]]||{},meta=card.querySelector(".log-meta");
  if(!meta)return;
  for(const c of categories){
   if(!entry[c.key])continue;
   const item=document.createElement("span");
   item.textContent=c.label+": "+(dictionary[c.key][entry[c.key]]||entry[c.key]);
   meta.append(item);
  }
 });
};
const baseDebriefText=debriefText;
debriefText=function(n){
 const entry=state.done[n]||{},base=baseDebriefText(n);
 return base+"\n"+categories.map(c=>c.label+": "+(dictionary[c.key][entry[c.key]]||"—")).join("\n");
};
// The existing openLog and saveFeedback handlers enumerate all .seg controls.
// Newly inserted ratings use the same localState->JSON payload->Supabase lifecycle.
if(typeof render==="function")render();
})();