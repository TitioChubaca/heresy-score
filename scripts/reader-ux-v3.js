/* Heresy Score v0.17.8 — reading-first mobile UX.
   Presentation + optional feedback only: existing reading, Spotify,
   chapter-gating, storage, and cloud functions remain authoritative. */
(()=>{
"use strict";
const nextUnit=(units,done,active)=>active?.chapter||units.find(c=>!done?.[c.number])?.number||null;
const playlistFor=(slug,number,playlists)=> {
 const p=playlists?.[slug+":"+number];
 return p?.url||(p?.id?"https://open.spotify.com/playlist/"+p.id:null);
};
const options=[
 ["volume","Volume irregular"],
 ["short","Trilha terminou cedo"],
 ["long","Sobrou música"],
 ["mood","Música fora da cena"],
 ["transition","Transição brusca"]
];
window.HSReaderUXModel={nextUnit,playlistFor,issueKeys:options.map(x=>x[0])};

const reading=document.querySelector('[data-view-panel="reading"]');
const settings=document.querySelector('[data-view-panel="settings"]');
const chaptersHost=document.getElementById("chapters");
const dialog=document.getElementById("feedbackDialog");
if(!reading||!settings||!chaptersHost||!dialog||typeof render!=="function")return;

const style=document.createElement("style");
style.id="hs-reader-ux-v3";
style.textContent=[
 ':root{--hs-surface:#111a13;--hs-outline:#394b39;--hs-lime:#a8d776}',
 'body.hs-reader-ux{font-size:15px;line-height:1.5}',
 'body.hs-reader-ux .bookhead{padding:17px 18px 14px;border-radius:16px 16px 0 0}',
 'body.hs-reader-ux .bookhead .ambient-gif,body.hs-reader-ux .bookhead .meta{display:none!important}',
 'body.hs-reader-ux .bookhead .eyebrow{font-size:10px;letter-spacing:.12em;opacity:.7}',
 'body.hs-reader-ux .bookhead .title{font-size:clamp(24px,6vw,32px);letter-spacing:.015em;line-height:1.18;margin:7px 0 13px}',
 'body.hs-reader-ux .bookhead .progresslabel{margin-top:9px}',
 'body.hs-reader-ux #paceText{display:none!important}',
 'body.hs-reader-ux #progressText{font-size:13px;color:#c7c9b7;letter-spacing:.01em}',
 '#hsQuickReadingStatus{display:flex;gap:7px;align-items:center;margin-top:10px;color:var(--hs-lime);font-size:13px;line-height:1.45}',
 '#hsQuickReadingStatus::before{content:"";width:7px;height:7px;background:currentColor;border-radius:100%;flex:none}',
 'body.hs-reader-ux .hs-deck-nav{border-top:0;padding:15px 15px 9px;grid-template-columns:42px minmax(0,1fr) 42px;gap:9px}',
 'body.hs-reader-ux .hs-deck-center{gap:2px}',
 'body.hs-reader-ux .hs-deck-eyebrow{display:none!important}',
 'body.hs-reader-ux #hsDeckTitle{font:600 clamp(20px,5vw,25px) Georgia,serif;letter-spacing:0;line-height:1.18}',
 'body.hs-reader-ux #hsDeckStatus{font-size:12px;color:#aab9a0;letter-spacing:0}',
 'body.hs-reader-ux .hs-deck-arrow{min-height:46px;border-radius:12px;font-size:24px;background:#172219}',
 'body.hs-reader-ux .chapters{padding:0 15px 6px;min-height:0}',
 'body.hs-reader-ux .chapter{padding:17px!important;background:var(--hs-surface);border:1px solid var(--hs-outline);border-radius:16px;box-shadow:none!important}',
 'body.hs-reader-ux .chapter .rivet{display:none!important}',
 'body.hs-reader-ux .chapter .row{margin-bottom:8px}',
 'body.hs-reader-ux .chapter .chname{font:600 21px Georgia,serif;letter-spacing:.015em;line-height:1.2}',
 'body.hs-reader-ux .chapter .tag{font-size:10px;padding:5px 8px;letter-spacing:.06em}',
 'body.hs-reader-ux .chapter .details{font-size:14px;line-height:1.4;color:#aab9a0;margin:7px 0 15px}',
 'body.hs-reader-ux .chapter .details span:not(:first-child){display:none!important}',
 'body.hs-reader-ux .chapter .actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}',
 'body.hs-reader-ux .chapter .actions .btn{font:600 14px/1.3 system-ui,sans-serif;min-height:50px;border-radius:12px;padding:12px 9px;letter-spacing:0}',
 'body.hs-reader-ux .chapter .actions .btn.primary{background:#a4cc73;color:#142015;border-color:#a4cc73}',
 'body.hs-reader-ux .chapter .actions .hs-open-spotify{background:#192b1c;border-color:#557950;color:#e2ebdb}',
 'body.hs-reader-ux .chapter .actions .hs-spotify-hint{grid-column:1/-1;font-size:12px;color:#b9c7ab;line-height:1.4}',
 'body.hs-reader-ux .hs-deck-footer{padding:8px 15px 17px}',
 'body.hs-reader-ux .hs-deck-footer .hs-deck-hint{display:none}',
 'body.hs-reader-ux .hs-deck-footer button{min-height:43px;border-radius:10px;font-size:12px;padding:8px 12px}',
 'body.hs-reader-ux .panel-title h2{font-size:15px}',
 'body.hs-reader-ux .hs-tech-settings{border:1px solid #344b35;border-radius:14px;padding:12px;margin:14px 0}',
 'body.hs-reader-ux .hs-tech-settings>summary{font-size:14px;cursor:pointer;color:#c1d6b1;min-height:35px;display:list-item;line-height:1.7}',
 'body.hs-reader-ux .hs-tech-settings .panel{border:0;margin:8px 0 0;padding:6px 0}',
 'body.hs-reader-ux .hs-tech-settings .small{font-size:13px}',
 'body.hs-reader-ux #feedbackDialog{width:min(calc(100vw - 24px),520px);max-height:calc(100dvh - 40px);overflow-y:auto;border-radius:18px;padding:22px;background:#111a13;color:#e5e3d4}',
 'body.hs-reader-ux #feedbackDialog #fbChapter{font-size:21px!important;margin:7px 0 12px!important}',
 'body.hs-reader-ux #feedbackDialog .hs-note-label{font-size:15px;font-weight:600;line-height:1.45;display:block;margin-bottom:8px}',
 'body.hs-reader-ux #fbNotes{width:100%;min-height:96px;font-size:15px;line-height:1.5;border-radius:12px;box-sizing:border-box;padding:12px}',
 'body.hs-reader-ux .hs-issues-title{font-size:13px;color:#b5c4ab;margin:12px 0 8px}',
 'body.hs-reader-ux .hs-issues{display:flex;flex-wrap:wrap;gap:7px}',
 'body.hs-reader-ux .hs-issues button{border:1px solid #465c43;border-radius:20px;background:#17251a;color:#c9d6c3;padding:9px 12px;min-height:42px;font-size:13px}',
 'body.hs-reader-ux .hs-issues button[aria-pressed="true"]{background:#a3cd75;color:#172019;border-color:#a3cd75;font-weight:650}',
 'body.hs-reader-ux .hs-feedback-advanced{margin:14px 0;border:1px solid #344b35;border-radius:12px;padding:12px}',
 'body.hs-reader-ux .hs-feedback-advanced>summary{min-height:30px;cursor:pointer;color:#bfccb7;font-size:13px}',
 'body.hs-reader-ux .hs-feedback-advanced .seg{margin:5px 0 12px}',
 'body.hs-reader-ux .hs-feedback-advanced .seg-label{font-size:13px;margin-top:12px}',
 'body.hs-reader-ux #feedbackDialog .actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}',
 'body.hs-reader-ux #feedbackDialog .actions button{min-height:49px;border-radius:12px;font-size:14px}',
 'body.hs-reader-ux .log-card .log-meta span:empty{display:none}',
 'body.hs-reader-ux .hs-log-issue{color:#d2c4a1}',
 'body.hs-reader-ux #now .hs-more summary{font-size:13px}',
 'body.hs-reader-ux #now.hs-mini .now-controls #prevTrackBtn,body.hs-reader-ux #now.hs-mini .now-controls #nextTrackBtn{display:none!important}',
 'body.hs-reader-ux #now.hs-mini{max-height:118px!important}',
 'body.hs-reader-ux #now.hs-mini .now-controls .btn{min-height:42px!important;border-radius:10px!important;padding:7px 10px!important;font-size:12px!important}',
 'body.hs-reader-ux #now.hs-mini .now-controls #finishBtn{background:#a4cc73;color:#172019}',
 '@media(max-width:400px){body.hs-reader-ux #now.hs-mini .now-controls{gap:3px!important}body.hs-reader-ux #now.hs-mini .now-controls .btn{padding:7px 6px!important;font-size:11px!important}body.hs-reader-ux #now.hs-mini #timer{font-size:21px!important}body.hs-reader-ux .bookhead{padding:14px!important}body.hs-reader-ux .hs-deck-nav{padding-left:10px;padding-right:10px}}',
 '@media(prefers-reduced-motion:reduce){body.hs-reader-ux .chapter{animation:none!important}}'
].join("\n");
document.head.append(style);
document.body.classList.add("hs-reader-ux");

const notes=document.getElementById("fbNotes");
const saveBtn=document.getElementById("saveFeedback");
const laterBtn=document.getElementById("closeFb");
let issueButtons=[];
if(notes && saveBtn && laterBtn && !document.getElementById("hsFeedbackIssues")){
 const noteLabel=document.createElement("label");
 noteLabel.className="hs-note-label";noteLabel.htmlFor="fbNotes";
 noteLabel.textContent="Algo funcionou muito bem ou incomodou? (opcional)";
 notes.before(noteLabel);
 notes.placeholder="Ex.: música muito alta no meio do capítulo, ótima entrada no final...";
 const title=document.createElement("p");
 title.className="hs-issues-title";title.textContent="Marcar um problema (opcional)";
 const issues=document.createElement("div");issues.className="hs-issues";issues.id="hsFeedbackIssues";
 for(const [value,label] of options){
  const button=document.createElement("button");
  button.type="button";button.dataset.issue=value;
  button.textContent=label;button.setAttribute("aria-pressed","false");
  button.addEventListener("click",()=>{
   const pressed=button.getAttribute("aria-pressed")==="true";
   button.setAttribute("aria-pressed",String(!pressed));
  });
  issues.append(button);issueButtons.push(button);
 }
 notes.after(title,issues);
 const advanced=document.createElement("details");
 advanced.className="hs-feedback-advanced";
 const summary=document.createElement("summary");
 summary.textContent="Avaliações detalhadas (opcional)";
 advanced.append(summary);
 for(const item of [...dialog.querySelectorAll(".seg-label,.seg")])advanced.append(item);
 issues.after(advanced);
 saveBtn.textContent="Salvar e continuar";
 laterBtn.textContent="Sem observações";
 const originalOpen=openLog;
 openLog=function(n){
  originalOpen(n);
  const d=state.done?.[n]||{};
  const selected=new Set(d.feedbackIssues||[]);
  issueButtons.forEach(button=>button.setAttribute("aria-pressed",String(selected.has(button.dataset.issue))));
  laterBtn.textContent=(d.notes||d.feedbackIssues?.length||d.length||d.intensity||d.opening||d.peak)?"Cancelar":"Sem observações";
  advanced.open=false;
 };
 const originalSave=saveBtn.onclick;
 saveBtn.onclick=async function(...args){
  if(typeof target!=="undefined"&&state.done?.[target]){
   state.done[target].feedbackIssues=issueButtons
    .filter(b=>b.getAttribute("aria-pressed")==="true").map(b=>b.dataset.issue);
  }
  return originalSave?.apply(this,args);
 };
 // Closing the feedback form does not roll back the already saved timer/log.
 laterBtn.title="Sem observações também salva e sincroniza o registro neutro";
 const baseLater=laterBtn.onclick;
 laterBtn.onclick=function(...args){
  if(laterBtn.textContent==="Cancelar"){
   return baseLater?.apply(this,args);
  }
  // No default "good" ratings. Still push the already measured reading
  // minutes to the cloud when the reader had nothing particular to report.
  notes.value="";
  issueButtons.forEach(b=>b.setAttribute("aria-pressed","false"));
  return saveBtn.onclick?.call(saveBtn);
 };
 const originalRenderLogs=renderLogs;
 renderLogs=function(){
  originalRenderLogs();
  const chapters=Object.keys(state.done||{}).map(Number).sort((a,b)=>b-a);
  const cards=[...document.querySelectorAll("#logHistory .log-card")];
  cards.forEach((card,index)=>{
   const metadata=card.querySelector(".log-meta");
   if(!metadata)return;
   for(const item of [...metadata.children]){
    if(/^(length|opening|peak)\s+[—-]$/.test(item.textContent.trim()))item.remove();
   }
   const chosen=new Set(state.done?.[chapters[index]]?.feedbackIssues||[]);
   for(const [key,text] of options){
    if(!chosen.has(key))continue;
    const item=document.createElement("span");
    item.className="hs-log-issue";item.textContent=text;metadata.append(item);
   }
  });
 };
 const originalDebriefText=debriefText;
 debriefText=function(n){
  const selected=new Set(state.done?.[n]?.feedbackIssues||[]);
  const labels=options.filter(x=>selected.has(x[0])).map(x=>x[1]);
  return originalDebriefText(n)+(labels.length?"\nOcorrências: "+labels.join(", "):"");
 };
}

const now=document.getElementById("now");
if(now){
 const controls=now.querySelector(".now-controls");
 const spotify=document.getElementById("openSpotifyBtn");
 const finish=document.getElementById("finishBtn");
 if(controls&&spotify&&finish){
  spotify.textContent="Spotify";
  spotify.title="Abrir playlist deste capítulo no Spotify";
  finish.textContent="Concluir";
  finish.title="Concluir e registrar o tempo de leitura";
  controls.append(spotify,finish);
 }
 const more=now.querySelector(".hs-more summary");
 if(more)more.textContent="Outras opções";
}

let technical=null;
const readAhead=document.getElementById("hsBookVIReadAhead");
if(readAhead){
 technical=document.createElement("details");
 technical.className="hs-tech-settings";technical.id="hsTechSettings";
 const summary=document.createElement("summary");
 summary.textContent="Preparação e diagnósticos das playlists";
 technical.append(summary,readAhead);
 const directive=document.getElementById("directive")?.closest(".panel");
 if(directive)technical.append(directive);
 settings.append(technical);
}

// Historical debrief remains accessible under Logs, not on the daily reading
// home screen. Do not remove it: older detailed marks and exports depend on it.
const debrief=document.querySelector('[data-view-panel="reading"] .debrief');
const logPage=document.querySelector('[data-view-panel="logs"]');
if(debrief&&logPage){
 const legacy=document.createElement("details");
 legacy.className="hs-tech-settings";
 const label=document.createElement("summary");
 label.textContent="Resumo do último registro (detalhado)";
 legacy.append(label,debrief);
 logPage.append(legacy);
}

const header=document.querySelector(".bookhead");
let statusNode=null;
if(header){
 statusNode=document.createElement("div");
 statusNode.id="hsQuickReadingStatus";statusNode.setAttribute("role","status");
 header.append(statusNode);
}

function showUX(){
 const slug=state.activeBookSlug;
 const current=nextUnit(chapters,state.done,state.active);
 const selected=[...chaptersHost.querySelectorAll(".chapter")].find(a=>!a.hidden);
 const selectedIndex=selected?[...chaptersHost.querySelectorAll(".chapter")].indexOf(selected):-1;
 const selectedNumber=chapters[selectedIndex]?.number;
 const ready=!!current&&!!SCORES[current]&&!!window.HSScoreReadiness?.spotifyPrepared?.(current);
 const connected=typeof spotifyConnected==="function"&&spotifyConnected();
 if(statusNode){
  statusNode.textContent=state.active?"Leitura em andamento":
   !current?"Livro concluído":
   !connected?"Conecte o Spotify para iniciar":
   ready?"Trilha do próximo capítulo preparada":
   SCORES[current]?"Preparando trilha do próximo capítulo":"Trilha ainda em curadoria";
 }
 if(technical)technical.hidden=slug!==HSBooks.VI;
 const progress=document.getElementById("progressText");
 if(progress&&chapters.length){
  const done=chapters.filter(c=>!!state.done?.[c.number]).length;
  progress.textContent=done+" de "+chapters.length+" unidades concluídas";
 }
 const deckTitle=document.getElementById("hsDeckTitle");
 if(deckTitle&&slug===HSBooks.VI&&selectedNumber)
  deckTitle.textContent=HSBooks.unitLabel(slug,selectedNumber);
 const deckStatus=document.getElementById("hsDeckStatus");
 if(deckStatus&&selectedNumber===current&&!state.active)
  deckStatus.textContent="Próxima leitura";
 if(!selected||!selectedNumber)return;
 const actions=selected.querySelector(".actions");
 const main=actions?.querySelector(".btn");
 if(!main)return;
 if(selectedNumber!==current||state.active||!SCORES[current])return;
 main.textContent="Começar leitura";
 main.title="Iniciar cronômetro e solicitar reprodução da trilha no Spotify";
 if(!actions.querySelector(".hs-open-spotify")){
  const spotifyBtn=document.createElement("button");
  spotifyBtn.type="button";spotifyBtn.className="btn hs-open-spotify";
  spotifyBtn.textContent="Abrir Spotify";
  const url=ready?playlistFor(slug,current,state.spotify.playlists):null;
  spotifyBtn.disabled=!url;
  spotifyBtn.title=url?"Abrir playlist do capítulo no Spotify":"Playlist ainda não confirmada";
  spotifyBtn.onclick=()=>{
   const activeNumber=nextUnit(chapters,state.done,state.active);
   if(activeNumber!==current)return;
   const href=window.HSScoreReadiness?.spotifyPrepared?.(current)?
    playlistFor(slug,current,state.spotify.playlists):null;
   if(!href)return;
   window.open(href,"_blank","noopener");
  };
  actions.append(spotifyBtn);
  if(!url){
   const hint=document.createElement("div");hint.className="hs-spotify-hint";
   hint.textContent=connected?"A playlist será disponibilizada após a verificação automática.":"Conecte o Spotify em Configurações.";
   actions.append(hint);
  }
 }
}
const originalRender=render;
render=function(...args){const out=originalRender(...args);showUX();return out;};
showUX();
window.HSReaderUX={version:"0.17.8",show:showUX};
})();