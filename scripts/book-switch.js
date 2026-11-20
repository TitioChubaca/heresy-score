/* Book switch layer: do not expose uncurated Fulgrim chapters or scores. */
(()=>{
const iv=HSBooks.IV,v=HSBooks.V,vi=HSBooks.VI;
const ivData={scores:{...SCORES},meta:{...SCORE_META},chapters:chapters.map(x=>({...x})),people:[...people],archive:[...archiveRecords]};
const clearScore=()=>{for(const k of Object.keys(SCORES))delete SCORES[k];for(const k of Object.keys(SCORE_META))delete SCORE_META[k]};
function installData(slug){
 clearScore();chapters.splice(0);people.splice(0);archiveRecords.splice(0);
 if(slug===iv){Object.assign(SCORES,ivData.scores);Object.assign(SCORE_META,ivData.meta);chapters.push(...ivData.chapters);people.push(...ivData.people);archiveRecords.push(...ivData.archive)}
 else {const d=slug===v?window.HS_FULGRIM_DATA:slug===vi?window.HS_DESCENT_DATA:null;
  if(d){Object.assign(SCORES,d.scores);Object.assign(SCORE_META,d.scoreMeta);chapters.push(...d.chapters);people.push(...d.people);archiveRecords.push(...d.archive)}
  else chapters.push({number:1,title:"PREPARAÇÃO PENDENTE",estimatedMinutes:null,startCue:null});
 }
}
function setBanner(){
 const slug=state.activeBookSlug||iv,title=state.books[slug]?.title||"";
 const head=document.querySelector(".bookhead .title");if(head)head.textContent=title;
 const eyebrow=document.querySelector(".bookhead .eyebrow");if(eyebrow)eyebrow.textContent="ARCHIVE "+(slug===iv?"IV":slug===v?"V":"VI")+" // THE HORUS HERESY";
 const cards=document.querySelectorAll(".book-record");
 if(cards[3]){cards[3].classList.toggle("active-book",slug===iv);cards[3].querySelector(".book-state").textContent=slug===iv?"selected":"completed"}
 if(cards[4]){cards[4].classList.toggle("sealed",false);cards[4].classList.toggle("active-book",slug===v);cards[4].querySelector(".btitle").textContent="Fulgrim";cards[4].querySelector(".book-state").textContent=slug===v?"selected":"completed";
 cards[4].querySelector(".bmeta").textContent="25 capítulos · concluído · 3/5 Dreadnoughts"}
 const sixth=document.getElementById("hsBookVIRecord");
 if(sixth){
  sixth.classList.toggle("active-book",slug===vi);
  sixth.querySelector(".book-state").textContent=slug===vi?"selected":"not started";
  sixth.querySelector(".bmeta").textContent=slug===vi?"0 / 25 unidades · trilha em curadoria":"25 unidades · próximo livro";
 }
 const panel=document.getElementById("hsBookSwitch");
 if(panel)panel.value=slug;
 const locked=slug===v&&!state.done?.[1];
 for(const el of document.querySelectorAll('[data-view="personae"],[data-view="archive"]'))el.disabled=locked;
}
// Reader corrected an accidental "already read" click for chapter V.
// Remove ONLY the artificial record created by the old bridge button.
function restoreUnreadChapterV(){
 const book=state.books?.[v];
 const fake=r=>r&&r.readingType==="read_outside_app"&&r.minutes==null;
 let dirty=false;
 if(fake(book?.done?.[5])){delete book.done[5];dirty=true}
 if(state.activeBookSlug===v&&fake(state.done?.[5])){delete state.done[5];dirty=true}
 if(dirty)save();
 return dirty;
}
restoreUnreadChapterV();
// An old artificial record may still exist in the cloud; never let a pull
// restore it. Real finished reading logs (with measured time) remain untouched.
const originalCloudPull=cloudPullLogs;
cloudPullLogs=async function(...args){
 const result=await originalCloudPull(...args);
 if(state.activeBookSlug===v&&restoreUnreadChapterV())render();
 return result;
};
const oldRender=render;render=function(){
 oldRender();
 setBanner();
 // Only the next unread, scored chapter can be checked. The Spotify preflight
 // resolves real tracks without starting a reading timer or playing music.
 if(state.activeBookSlug===v&&!state.active){
  const next=chapters.find(c=>!state.done?.[c.number]&&!!SCORES[c.number]&&
    (c.number===1||!!state.done?.[c.number-1]));
  const number=next?.number;
  const card=number?[...document.querySelectorAll("#chapters .chapter")]
   .find(x=>x.querySelector(".chname")?.textContent.includes("CHAPTER "+String(number).padStart(2,"0"))):null;
  const actions=card?.querySelector(".actions");
  if(actions){
   const check=document.createElement("button");
   check.type="button";check.className="btn";check.textContent="Auditar duração Spotify";
   const report=document.createElement("div");report.className="hs-audit-inline small";
   report.setAttribute("role","status");report.setAttribute("aria-live","polite");
   report.style.cssText="width:100%;flex-basis:100%;padding:10px;margin-top:4px;border:1px solid #354b33;background:#091009;line-height:1.6;overflow-wrap:anywhere";
   const prior=state.spotify.chapterRuntime?.[number];
   const latestAttempt=state.spotify.auditResults?.[number];
   const passed=!!window.HSScoreReadiness?.spotifyPrepared?.(number);
   const clock=ms=>Math.floor(ms/60000)+":"+String(Math.floor(ms/1000)%60).padStart(2,"0");
   if(latestAttempt?.status==="FAILED"){
    report.textContent="NÃO CORRIGIDO · "+latestAttempt.message;
    report.style.borderColor="#a54840";
   }else if(passed&&Number.isFinite(prior?.durationMs)&&Number.isFinite(prior?.targetMs)){
    const gap=Math.round((prior.durationMs-prior.targetMs)/1000);
    const fit=state.spotify.playlists?.[v+":"+number]?.editorialFit;
    report.textContent="CONFIRMADO NO SPOTIFY · "+clock(prior.durationMs)+
     " / alvo calibrado "+clock(prior.targetMs)+" / desvio "+(gap>=0?"+":"")+gap+" s · "+
     prior.trackCount+" faixas · "+((fit?.removedIndexes||[]).length)+" cortes opcionais · "+
     ((fit?.addedCues||[]).length)+" reservas. Verificação técnica; encaixe narrativo ainda depende da leitura.";
    report.style.borderColor="#5c804b";
   }else{
    report.textContent=prior?.status==="FAILED"?("NÃO CORRIGIDO · "+(prior.autoFitResult||"Auditoria anterior falhou.")):
     "Trilha cadastrada, mas ainda não confirmada no Spotify. Toque para auditar.";
    report.style.borderColor=prior?.status==="FAILED"?"#a54840":"#354b33";
   }
   check.onclick=async()=>{
    if(check.disabled)return;
    check.disabled=true;check.textContent="Auditando Spotify…";
    report.style.borderColor="#b88b4e";
    report.textContent="Iniciando auditoria do capítulo "+String(number).padStart(2,"0")+"...";
    const update=e=>{
     if(e.detail?.chapter!==number)return;
     report.textContent=e.detail.message;
     report.style.borderColor=e.detail.phase==="error"?"#a54840":e.detail.phase==="success"?"#5c804b":"#b88b4e";
    };
    window.addEventListener("hs-spotify-audit-progress",update);
    try{
     if(state.active)throw Error("Existe uma leitura ativa; não é seguro modificar a playlist.");
     if(!spotifyConnected())throw Error("Spotify desconectado ou autorização expirada. Abra Configurações > Conectar Spotify.");
     const book=state.activeBookSlug;
     await spotifySyncChapter(number);
     if(state.activeBookSlug!==book)throw Error("Livro mudou durante a auditoria.");
     const runtime=state.spotify.chapterRuntime?.[number];
     if(!runtime?.verified||runtime.status!=="WITHIN_RANGE"||!Number.isFinite(runtime.durationMs))
      throw Error("O Spotify não confirmou uma playlist dentro da meta.");
     const clock=ms=>Math.floor(ms/60000)+":"+String(Math.floor(ms/1000)%60).padStart(2,"0");
     state.spotify.auditResults=state.spotify.auditResults||{};
     state.spotify.auditResults[number]={status:"VERIFIED",at:new Date().toISOString(),message:"Spotify confirmou a sequência e a duração"};
     save();
     // Rebuild the whole reading card and directive from one authoritative
     // audited runtime; otherwise the target and the status remain stale.
     render();
    }catch(err){
     const r=state.spotify.chapterRuntime?.[number];
     const message=String(err?.message||err)+
      (r?.durationMs&&r?.targetMs?" · Última medição: "+clock(r.durationMs)+" / meta "+clock(r.targetMs)+".":"");
     state.spotify.auditResults=state.spotify.auditResults||{};
     state.spotify.auditResults[number]={status:"FAILED",message,at:new Date().toISOString()};
     save();
     render();
    }finally{
     window.removeEventListener("hs-spotify-audit-progress",update);
     check.disabled=false;check.textContent="Auditar duração Spotify";
    }
   };
   actions.append(check,report);
  }
 }

 if(state.activeBookSlug===vi){
  const completed=Object.keys(state.done||{}).filter(k=>state.done[k]).length;
  const total=chapters.length||25;
  const progressBar=document.getElementById("progress");
  if(progressBar)progressBar.style.width=Math.min(100,completed/total*100)+"%";
  const text=document.getElementById("progressText");
  if(text)text.textContent=completed+" / "+total+" unidades concluídas // Livro VI";
  const archiveLabel=document.getElementById("bookArchiveProgress");
  if(archiveLabel)archiveLabel.textContent="17 capítulos · concluído";
  const tag=document.getElementById("clearanceLabel");
  if(tag)tag.textContent=completed?"Livro VI · "+completed+" unidades concluídas":"Livro VI · ainda não iniciado";
  const next=chapters.find(c=>!state.done?.[c.number]);
  const directive=document.getElementById("directive");
  if(directive&&!state.active){
   const verified=next&&window.HSScoreReadiness?.spotifyPrepared?.(next.number);
   directive.textContent=!next?"DESCENT OF ANGELS // todas as unidades concluídas.":
    verified?"DESCENT OF ANGELS // "+next.title+" // PILOTO CONFIRMADO NO SPOTIFY · encaixe narrativo a avaliar":
    SCORES[next.number]?"DESCENT OF ANGELS // "+next.title+" // PILOTO MUSICAL · audite as gravações no Spotify":
    "DESCENT OF ANGELS // "+next.title+" // curadoria musical pendente, leitura ainda não liberada.";
  }
 }
 if(state.activeBookSlug===v){
  const count=Object.keys(state.done||{}).length;
  const prog=document.getElementById("progress");if(prog)prog.style.width=Math.min(100,(count/25)*100)+"%";
  const text=document.getElementById("progressText");if(text)text.textContent=count+" / 25 chapters // Book V";
  const label=document.getElementById("clearanceLabel");if(label)label.textContent="Book V // "+(count?"through chapter "+String(Math.max(...Object.keys(state.done).map(Number))).padStart(2,"0"):"no chapters read");
  const directive=document.getElementById("directive");if(directive&&!state.active){const next=chapters.find(c=>!state.done?.[c.number]);directive.textContent=next&&SCORES[next.number]?"FULGRIM // CHAPTER "+String(next.number).padStart(2,"0")+" SCORE PREPARED // CHECK SPOTIFY RUNTIME.":"FULGRIM // Next score remains sealed."}
  const archive=document.getElementById("bookArchiveProgress");if(archive)archive.textContent="17 chapters // completed";
  
  // Prevent chapter-I dossier records from appearing before the reader logs I.
  if(!state.done?.[1]){
    const roster=document.getElementById("roster");if(roster)roster.replaceChildren();
    const world=document.getElementById("worldArchive");if(world)world.replaceChildren();
  }
 }
};
function change(slug){
 if(![iv,v,vi].includes(slug))return;
 if(typeof beginPending!=="undefined"&&beginPending){
  toast("Aguarde o preparo da sessao atual");
  const p=document.getElementById("hsBookSwitch");if(p)p.value=state.activeBookSlug;
  return;
 }
 if(state.activeBookSlug===slug)return;
 try{
  HSBooks.switchBook(state,slug);
  installData(slug);
  restoreUnreadChapterV();
  // HSBooks.switchBook restores the book-specific audit snapshot; do not clear it.
  // Per-chapter playlists live in state.spotify.playlists. Clear the active
  // pointer on switches; do not let Open Spotify link to another book's score.
  state.spotify.playlistId="";
  state.spotify.playlistUrl="";
  state.view="reading";
  save();render();applyView("reading");
  // Reapply any personal-only portraits that were imported before this book had a roster.
  window.dispatchEvent(new Event("hs-book-changed"));
  toast(slug===iv?"Eisenstein archive loaded":slug===v?"Fulgrim archive loaded":"Descent of Angels selected · spoiler-safe preparation");
 }catch(e){toast(e.message);const p=document.getElementById("hsBookSwitch");if(p)p.value=state.activeBookSlug}
}
const nav=document.querySelector('[data-view-panel="books"]');
const panel=document.createElement("section");panel.id="hsBooksPanel";panel.className="panel";
panel.innerHTML='<h2>Active Book // Library</h2><p class="small">O progresso, as anotações e a sincronização na nuvem são separados por livro. Não é possível trocar durante uma leitura ativa. Os próximos scores são pré-curados e exigem confirmação de duração e ordem no Spotify antes da leitura.</p><label class="small">Selected book <select id="hsBookSwitch" style="width:100%;margin-top:8px;background:#101a0f;color:#d2cbb7;padding:12px;border:1px solid #536746"><option value="flight-of-the-eisenstein">IV — The Flight of the Eisenstein</option><option value="fulgrim">V — Fulgrim (concluído)</option><option value="descent-of-angels">VI — Descent of Angels (curadoria em andamento)</option></select></label>';
const library=document.querySelector('[data-view-panel="books"] .library');
if(library&&!document.getElementById("hsBookVIRecord")){
 const card=document.createElement("div");
 card.className="book-record";card.id="hsBookVIRecord";
 card.innerHTML='<div class="book-num">VI</div><div><div class="btitle">Descent of Angels</div><div class="bmeta">25 unidades · próximo livro</div></div><span class="book-state">not started</span>';
 library.append(card);
}
nav.append(panel);
document.getElementById("hsBookSwitch").onchange=e=>change(e.target.value);

// Optional preflight for all prepared chapters. Does not start music, timers or readings.
const batch=document.createElement("button");
batch.type="button";batch.className="btn";batch.id="hsBatchSpotify";
batch.textContent="Auditar próximas 3 playlists (opcional)";
const cancelBatch=document.createElement("button");cancelBatch.type="button";cancelBatch.className="btn";cancelBatch.textContent="Parar preparo";cancelBatch.style.marginLeft="8px";cancelBatch.hidden=true;let batchStopped=false;
const batchReport=document.createElement("p");batchReport.className="small";
batchReport.id="hsBatchSpotifyReport";batchReport.setAttribute("aria-live","polite");
panel.append(batch,cancelBatch,batchReport);cancelBatch.onclick=()=>{batchStopped=true;cancelBatch.disabled=true;batchReport.textContent="Parando após a faixa em andamento..."};
batch.onclick=async()=>{
 if(state.active||typeof beginPending!=="undefined"&&beginPending){batchReport.textContent="Finalize primeiro a sessão ativa.";return}
 if(state.activeBookSlug!==v){batchReport.textContent="Selecione Fulgrim antes da checagem.";return}
 if(!spotifyConnected()){batchReport.textContent="Conecte o Spotify nas configurações do app.";return}
 batch.disabled=true;batchStopped=false;cancelBatch.hidden=false;cancelBatch.disabled=false;
 const activeSlug=state.activeBookSlug,oldId=state.spotify.playlistId,oldURL=state.spotify.playlistUrl;
 const outcomes=[];
 try{
  const readNumbers=Object.keys(state.done||{}).map(Number).filter(Number.isInteger);
  const first=Math.min(25,Math.max(0,...readNumbers)+1),last=Math.min(25,first+2);
  for(let n=first;n<=last;n++){
   if(batchStopped||state.activeBookSlug!==activeSlug||state.active)break;
   batchReport.textContent="Preparando capítulo "+String(n).padStart(2,"0")+"...";
   try{
    await spotifySyncChapter(n);
    const runtime=state.spotify.chapterRuntime?.[n];
    const sec=runtime?.durationMs?Math.round(runtime.durationMs/1000):null;
    const targetSec=Math.round((SCORE_META[n]?.estimatedMinutes||0)*60);const delta=sec===null?null:sec-targetSec;
    outcomes.push("CH "+String(n).padStart(2,"0")+": "+(sec!==null?Math.floor(sec/60)+":"+String(sec%60).padStart(2,"0"):"duração não informada")+(delta===null?"":(" / alvo "+Math.floor(targetSec/60)+":"+String(targetSec%60).padStart(2,"0")+" / "+(delta>0?"+":"")+delta+"s"+(delta>45?" ⚠ LONGA":""))));
   }catch(e){outcomes.push("CH "+String(n).padStart(2,"0")+": erro — "+(e.message||"Spotify"))}
  }
 }finally{
  // Preflight never leaves the currently-active playlist pointer set to VIII.
  if(state.activeBookSlug===activeSlug){state.spotify.playlistId=oldId||"";state.spotify.playlistUrl=oldURL||"";save()}
  batchReport.textContent=outcomes.join(" | ")+(batchStopped?" // Preparo interrompido.":" // Nenhuma reprodução iniciada.");
  batch.disabled=false;cancelBatch.hidden=true;cancelBatch.disabled=false;
 }
};

if(state.activeBookSlug===v||state.activeBookSlug===vi)installData(state.activeBookSlug);
render();
// Initialization also needs a second portrait pass: private-art loads before the book router.
window.dispatchEvent(new Event("hs-book-changed"));
})();
