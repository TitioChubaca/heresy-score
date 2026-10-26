/* Optional in-session cue-boundary markers. No story or scene labels are exposed. */
(()=>{
"use strict";
const now=document.getElementById("now");
if(!now)return;
const panel=document.createElement("section");
panel.className="hs-transition-markers";
panel.style.cssText="margin:10px 0;padding:10px;border:1px solid #536746;border-radius:4px";
const title=document.createElement("div");title.className="small";title.textContent="AJUSTE FINO // transição musical (opcional)";
const hint=document.createElement("div");hint.className="small";hint.textContent="Toque somente se a música estiver atrasada em relação ao texto. A marca guarda o tempo do cronômetro e a faixa atual.";
const row=document.createElement("div");row.style.cssText="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px";
const choices=[["need-action","Começou ação / música calma"],["need-calm","Terminou ação / música intensa"]];
const status=document.createElement("div");status.className="small";status.setAttribute("aria-live","polite");status.style.marginTop="6px";
for(const [type,label] of choices){
 const b=document.createElement("button");b.type="button";b.className="btn";b.textContent=label;
 b.onclick=()=>{
  if(!state.active){status.textContent="Abra uma sessão antes de marcar a transição.";return}
  const active=state.active;
  active.sceneMarkers=active.sceneMarkers||[];
  if(active.sceneMarkers.length>=80){status.textContent="Limite de marcas nesta sessão.";return}
  const mark={kind:type,elapsedMs:Math.round(elapsed()),track:active.currentTrack?{
    title:active.currentTrack.title||null,artist:active.currentTrack.artist||null,
    uri:active.currentTrack.uri||null}:null,at:new Date().toISOString()};
  active.sceneMarkers.push(mark);save();
  const t=Math.floor(mark.elapsedMs/60000)+":"+String(Math.floor(mark.elapsedMs/1000)%60).padStart(2,"0");
  status.textContent="Marca "+active.sceneMarkers.length+" salva aos "+t+".";
 };
 row.append(b);
}
panel.append(title,hint,row,status);
const controls=now.querySelector(".track-feedback");
if(controls)controls.after(panel);else now.append(panel);
const baseFinish=finish;
finish=function(){
 const active=state.active;
 const chapter=active?.chapter;
 const markers=Array.isArray(active?.sceneMarkers)?[...active.sceneMarkers]:[];
 baseFinish();
 if(chapter&&state.done?.[chapter]){
  state.done[chapter].sceneMarkers=markers;
  save();
 }
};
document.getElementById("finishBtn").onclick=finish;
const baseRenderLogs=renderLogs;
renderLogs=function(){
 baseRenderLogs();
 const nums=Object.keys(state.done||{}).map(Number).sort((a,b)=>b-a);
 const cards=[...document.querySelectorAll("#logHistory .log-card")];
 cards.forEach((card,i)=>{
  const count=state.done?.[nums[i]]?.sceneMarkers?.length||0;
  if(count){
   const meta=card.querySelector(".log-meta");
   if(meta){const item=document.createElement("span");item.textContent=count+" marcas de transição";meta.append(item)}
  }
 });
};
const baseDebriefText=debriefText;
debriefText=function(n){
 const base=baseDebriefText(n),marks=state.done?.[n]?.sceneMarkers||[];
 if(!marks.length)return base;
 const toClock=ms=>Math.floor(ms/60000)+":"+String(Math.floor(ms/1000)%60).padStart(2,"0");
 return base+"\nTransições anotadas:\n"+marks.map(m=>toClock(m.elapsedMs)+" "+(m.kind==="need-action"?"ação, música calma":"pós-ação, música intensa")+" // "+(m.track?.title||"faixa não detectada")).join("\n");
};
})();