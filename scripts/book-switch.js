/* Book switch layer: do not expose uncurated Fulgrim chapters or scores. */
(()=>{
const iv=HSBooks.IV,v=HSBooks.V;
const ivData={scores:{...SCORES},meta:{...SCORE_META},chapters:chapters.map(x=>({...x})),people:[...people],archive:[...archiveRecords]};
const clearScore=()=>{for(const k of Object.keys(SCORES))delete SCORES[k];for(const k of Object.keys(SCORE_META))delete SCORE_META[k]};
function installData(slug){
 clearScore();chapters.splice(0);people.splice(0);archiveRecords.splice(0);
 if(slug===iv){Object.assign(SCORES,ivData.scores);Object.assign(SCORE_META,ivData.meta);chapters.push(...ivData.chapters);people.push(...ivData.people);archiveRecords.push(...ivData.archive)}
 else {const d=window.HS_FULGRIM_DATA;if(d){Object.assign(SCORES,d.scores);Object.assign(SCORE_META,d.scoreMeta);chapters.push(...d.chapters);people.push(...d.people);archiveRecords.push(...d.archive)}else chapters.push({number:1,title:"CHAPTER 01 // SCORE NOT CURATED",estimatedMinutes:null,startCue:null})}
}
function setBanner(){
 const slug=state.activeBookSlug||iv,title=state.books[slug]?.title||"";
 const head=document.querySelector(".bookhead .title");if(head)head.textContent=title;
 const eyebrow=document.querySelector(".bookhead .eyebrow");if(eyebrow)eyebrow.textContent="ARCHIVE "+(slug===iv?"IV":"V")+" // THE HORUS HERESY";
 const cards=document.querySelectorAll(".book-record");
 if(cards[3]){cards[3].classList.toggle("active-book",slug===iv);cards[3].querySelector(".book-state").textContent=slug===iv?"selected":"completed"}
 if(cards[4]){cards[4].classList.toggle("sealed",false);cards[4].classList.toggle("active-book",slug===v);cards[4].querySelector(".btitle").textContent="Fulgrim";cards[4].querySelector(".book-state").textContent=slug===v?"selected":"preparing"}
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
   report.textContent=prior?.verified&&prior?.status==="WITHIN_RANGE"?
    "Última auditoria: "+prior.autoFitResult+" · Toque para verificar novamente no Spotify.":
    prior?.autoFitResult||"Auditoria disponível · as etapas e erros aparecerão aqui e não desaparecerão.";
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
     const fit=state.spotify.playlists?.[book+":"+number]?.editorialFit;
     report.textContent="CONFIRMADO NO SPOTIFY · "+clock(runtime.durationMs)+" / meta "+
      clock(runtime.targetMs)+" · "+runtime.trackCount+" faixas. "+
      (fit?((fit.removedIndexes||[]).length+" cortes editoriais; "+(fit.addedCues||[]).length+" reservas adicionadas."):"Sequência conferida.");
     report.style.borderColor="#5c804b";
    }catch(err){
     const r=state.spotify.chapterRuntime?.[number];
     report.textContent="NÃO CORRIGIDO · "+String(err?.message||err)+
      (r?.durationMs&&r?.targetMs?" · Última medição: "+Math.round(r.durationMs/60000)+" / "+Math.round(r.targetMs/60000)+" min.":"");
     report.style.borderColor="#a54840";
    }finally{
     window.removeEventListener("hs-spotify-audit-progress",update);
     check.disabled=false;check.textContent="Auditar duração Spotify";
    }
   };
   actions.append(check,report);
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
 if(slug!==iv&&slug!==v)return;
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
  state.spotify.scoreDurations={};state.spotify.chapterRuntime={};
  // Per-chapter playlists live in state.spotify.playlists. Clear the active
  // pointer on switches; do not let Open Spotify link to another book's score.
  state.spotify.playlistId="";
  state.spotify.playlistUrl="";
  state.view="reading";
  save();render();applyView("reading");
  // Reapply any personal-only portraits that were imported before this book had a roster.
  window.dispatchEvent(new Event("hs-book-changed"));
  toast(slug===iv?"Eisenstein archive loaded":"Fulgrim archive selected; next score follows reader clearance");
 }catch(e){toast(e.message);const p=document.getElementById("hsBookSwitch");if(p)p.value=state.activeBookSlug}
}
const nav=document.querySelector('[data-view-panel="books"]');
const panel=document.createElement("section");panel.id="hsBooksPanel";panel.className="panel";
panel.innerHTML='<h2>Active Book // Library</h2><p class="small">O progresso, as anotações e a sincronização na nuvem são separados por livro. Não é possível trocar durante uma leitura ativa. Os próximos scores são pré-curados e exigem confirmação de duração e ordem no Spotify antes da leitura.</p><label class="small">Selected book <select id="hsBookSwitch" style="width:100%;margin-top:8px;background:#101a0f;color:#d2cbb7;padding:12px;border:1px solid #536746"><option value="flight-of-the-eisenstein">IV — The Flight of the Eisenstein</option><option value="fulgrim">V — Fulgrim (scores I–XXV precurados)</option></select></label>';
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

if(state.activeBookSlug===v)installData(v);
render();
// Initialization also needs a second portrait pass: private-art loads before the book router.
window.dispatchEvent(new Event("hs-book-changed"));
})();
