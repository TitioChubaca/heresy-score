/* Heresy Score — portable narrative-score contract.
   Requires ZERO book prose, Spotify audio streams or scene spoilers in code.
   Public input should contain ONLY cues already cleared for the reader. */
(function(root){"use strict";
const roles=new Set(["atmosphere","dialogue","suspense","action","aftermath","closing","transition"]);
const finite=x=>typeof x==="number"&&Number.isFinite(x);
function validate(plan){
 const problems=[];
 if(!plan||typeof plan!=="object"||!Array.isArray(plan.slots)||!plan.slots.length)
  return ["Plano ausente ou sem slots editoriais."];
 let last=-1;
 for(const [i,slot] of plan.slots.entries()){
  if(!roles.has(slot.role))problems.push("Slot "+i+": papel musical desconhecido.");
  if(!finite(slot.at)||slot.at<0||slot.at>1||slot.at<last)
   problems.push("Slot "+i+": posição relativa inválida ou fora de ordem.");
  last=slot.at;
  if(slot.required===false&&i===0||slot.required===false&&i===plan.slots.length-1)
   problems.push("Abertura e encerramento não podem ser slots opcionais.");
  if(!Array.isArray(slot.choices)||!slot.choices.length)problems.push("Slot "+i+": faltam gravações candidatas.");
  for(const candidate of slot.choices||[]){
   if(!/^spotify:track:[A-Za-z0-9]+$/.test(candidate.uri||""))problems.push("Slot "+i+": Spotify URI inválida.");
   if(!finite(candidate.durationMs)||candidate.durationMs<=0)problems.push("Slot "+i+": duração real ausente.");
   if(candidate.role!==slot.role)problems.push("Slot "+i+": gravação tem papel incompatível com a cena.");
   if(!finite(candidate.intensity)||candidate.intensity<0||candidate.intensity>5)
    problems.push("Slot "+i+": intensidade deve estar entre 0 e 5.");
  }
 }
 return problems;
}
function fit(plan,targetMs,limits={under:45000,over:60000}){
 const issues=validate(plan);if(issues.length)return {ok:false,reason:issues.join(" ")};
 if(!finite(targetMs)||targetMs<=0)return {ok:false,reason:"Tempo-alvo inválido"};
 // Enumerate a bounded number of editorially allowed alternatives. A required
 // scene is NEVER dropped; optional transitions may be omitted explicitly.
 let states=[{tracks:[],durationMs:0,at:[],penalty:0,skipped:[]}];
 for(const [index,slot] of plan.slots.entries()){
  const next=[];
  for(const state of states){
   const possibilities=slot.choices.slice(0,6);
   if(slot.required===false)possibilities.push(null);
   for(const cue of possibilities){
    const consumed=state.durationMs;
    const selected=cue?[...state.tracks,cue]:state.tracks;
    const penalty=state.penalty+(cue?Math.abs(consumed/targetMs-slot.at)*Math.max(1,slot.anchorWeight||1):.45);
    next.push({tracks:selected,durationMs:consumed+(cue?.durationMs||0),
     at:cue?[...state.at,{slot:index,timeMs:consumed}]:state.at,
     penalty,skipped:cue?state.skipped:[...state.skipped,index]});
   }
  }
  // Beam search, retains both near-target and best scene-position candidates.
  next.sort((a,b)=>(Math.abs(a.durationMs-targetMs)/(targetMs||1)*1.5+a.penalty*.4)-
   (Math.abs(b.durationMs-targetMs)/(targetMs||1)*1.5+b.penalty*.4));
  states=next.slice(0,500);
 }
 const candidates=states.filter(s=>s.durationMs>=targetMs-limits.under&&s.durationMs<=targetMs+limits.over);
 if(!candidates.length)return {ok:false,reason:"Nenhuma combinação de gravações aprovadas alcança a meta sem perder slots narrativos obrigatórios.",
  nearestMs:states.reduce((best,s)=>Math.abs(s.durationMs-targetMs)<Math.abs(best-targetMs)?s.durationMs:best,states[0]?.durationMs||0)};
 candidates.sort((a,b)=>(Math.abs(a.durationMs-targetMs)/60000+a.penalty*.6)-
  (Math.abs(b.durationMs-targetMs)/60000+b.penalty*.6));
 const selected=candidates[0];
 return {ok:true,uris:selected.tracks.map(t=>t.uri),durationMs:selected.durationMs,targetMs,
  skippedOptionalSlots:selected.skipped,anchorError:selected.penalty,stages:selected.at};
}
root.HSEditorialScore={roles:[...roles],validate,fit,version:1};
})(typeof window!=="undefined"?window:globalThis);
