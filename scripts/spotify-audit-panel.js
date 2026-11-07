/* v0.15.2: durable audit of already-read and next-unread Fulgrim chapters.
   Never exposes future scene maps or changes reading logs. */
(()=>{
"use strict";
const settings=document.querySelector('[data-view-panel="settings"]');
if(!settings)return;
const panel=document.createElement("section");panel.className="panel";
panel.innerHTML='<h2>Spotify // Conferência de playlists</h2>'+
 '<p class="small">Compara a ordem aprovada com o Spotify, corrige divergências e confirma a duração real. Não inicia músicas nem altera seus logs. Excesso musical ainda não resolvido será indicado claramente.</p>'+
 '<div class="config"><select id="hsAuditChapter" aria-label="Capítulo para auditar"></select>'+
 '<button class="btn primary" id="hsAuditRun">Conferir / corrigir</button></div>'+
 '<pre id="hsAuditOutput" class="small" style="white-space:pre-wrap;overflow-wrap:anywhere" aria-live="polite">Selecione um capítulo.</pre>';
settings.append(panel);
const select=panel.querySelector("#hsAuditChapter"),button=panel.querySelector("#hsAuditRun");
const output=panel.querySelector("#hsAuditOutput");
function permitted(){
 const f=state.activeBookSlug==="fulgrim"?state.done:(state.books?.fulgrim?.done||{});
 const numbers=Object.keys(f||{}).map(Number).filter(Number.isInteger);
 return Math.min(25,Math.max(0,...numbers)+1);
}
function options(){
 const before=select.value;
 const limit=permitted();
 select.replaceChildren();
 for(let n=1;n<=limit;n++){
  if(!SCORES[n] && state.activeBookSlug==="fulgrim")continue;
  const opt=document.createElement("option");opt.value=String(n);
  opt.textContent="Fulgrim // capítulo "+String(n).padStart(2,"0")+
   (n===limit?" (próximo)":" (lido)");
  select.append(opt);
 }
 if([...select.options].some(o=>o.value===before))select.value=before;
 else select.value=String(limit);
}
function result(n){
 const r=state.spotify.chapterRuntime?.[n];
 if(!r){output.textContent="Spotify não devolveu resultados.";return;}
 const fmt=ms=>Math.floor(ms/60000)+":"+String(Math.floor(ms/1000)%60).padStart(2,"0");
 const delta=Number(r.durationMs)-Number(r.targetMs);
 let lines=[
  "CH "+String(n).padStart(2,"0")+" // "+(r.verified?"ORDEM CONFIRMADA":"NÃO CONFIRMADO"),
  r.durationMs?"Spotify "+fmt(r.durationMs)+" / estimativa "+fmt(r.targetMs||0)+" / desvio "+(delta>=0?"+":"")+Math.round(delta/1000)+"s":"Duração indisponível",
  "Faixas: "+(r.trackCount??"—"),
  "Status: "+(r.autoFitResult||r.status||"sem resultado")
 ];
 // The next chapter's track choices and narrative progression remain private.
 if(n<permitted()&&r.verified&&Array.isArray(r.auditTracks)){
  lines.push("", "Faixas reproduzidas no Spotify:");
  for(const t of r.auditTracks)lines.push(String(t.position).padStart(2,"0")+
   " · "+t.title+" · "+fmt(t.seconds*1000));
 }
 output.textContent=lines.join("\n");
}
async function readerForecast(n){
 try{
  const response=await fetch("./data/fulgrim-chapter-metrics.json",{cache:"no-store"});
  if(!response.ok)return null;
  const metrics=await response.json();
  const chapters=metrics?.chapters||[];
  const earlier=chapters.filter(c=>c.number<n&&c.words>0&&
   Number(state.done?.[c.number]?.minutes)>=10).slice(-8);
  if(earlier.length<3)return null;
  const words=earlier.reduce((a,c)=>a+c.words,0);
  const minutes=earlier.reduce((a,c)=>a+Number(state.done[c.number].minutes),0);
  const pace=words/minutes,now=chapters.find(c=>c.number===n);
  if(!now?.words||!Number.isFinite(pace)||pace<90||pace>350)return null;
  return {minutes:now.words/pace,pace,samples:earlier.length};
 }catch(err){return null;}
}
button.onclick=async()=>{
 options();
 const n=Number(select.value);
 if(state.activeBookSlug!=="fulgrim"){output.textContent="Selecione Fulgrim na Biblioteca antes da auditoria.";return;}
 if(state.active){output.textContent="Não modificar playlists durante a leitura ativa.";return;}
 if(!spotifyConnected()){output.textContent="Conecte ou reautorize o Spotify nas Configurações.";return;}
 button.disabled=true;output.textContent="Lendo a playlist do Spotify e conferindo as gravações...";
 try{
  await spotifySyncChapter(n);result(n);
  const forecast=await readerForecast(n);
  if(forecast)output.textContent+="\\nPrevisão por ritmo real: "+forecast.minutes.toFixed(1)+
    " min ("+forecast.samples+" capítulos, "+Math.round(forecast.pace)+" palavras/min). "+
    "Projeção separada da duração musical; não autoriza cortar cenas.";
 }
 catch(err){result(n);output.textContent+="\nErro: "+String(err?.message||err);}
 finally{button.disabled=false;}
};
select.onchange=()=>result(Number(select.value));
options();
window.addEventListener("hs-book-changed",options);
})();