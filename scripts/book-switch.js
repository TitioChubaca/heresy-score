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
const oldRender=render;render=function(){
 oldRender();
 setBanner();
 // Reader completed Chapter V without a score in the public app. Archive it
 // only through an explicit click: never fabricate reading minutes or finish date.
 if(state.activeBookSlug===v&&state.done?.[4]&&!state.done?.[5]&&!state.active){
  const card=[...document.querySelectorAll("#chapters .chapter")].find(el=>el.querySelector(".chname")?.textContent.includes("CHAPTER 05"));
  const action=card?.querySelector(".actions");
  if(action){
   const btn=document.createElement("button");btn.type="button";btn.className="btn primary";
   btn.textContent="Mark Chapter V Already Read";
   btn.onclick=()=>{
    if(state.active||state.activeBookSlug!==v||state.done?.[5])return;
    state.done[5]={minutes:null,length:"not_measured",readingType:"read_outside_app",
     notes:"Capítulo V concluído antes de haver score; tempo individual não medido no Heresy Score.",
     cloudSynced:false};
    save();render();toast("Chapter V archived without invented timing // VI available");
   };
   action.replaceChildren(btn);
  }
 }
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
   check.type="button";check.className="btn";check.textContent="Check Spotify Runtime";
   check.onclick=async()=>{
    check.disabled=true;check.textContent="Checking Spotify...";
    try{
     if(!spotifyConnected())throw Error("Spotify precisa estar conectado");
     const sourceBook=state.activeBookSlug;
     await spotifySyncChapter(number);
     if(state.activeBookSlug!==sourceBook)throw Error("Livro alterado durante a verificacao");
     const r=state.spotify.chapterRuntime?.[number];
     if(!r||!Number.isFinite(r.durationMs))throw Error("Duracao nao retornada pelo Spotify");
     const m=Math.floor(r.durationMs/60000),seconds=String(Math.floor(r.durationMs/1000)%60).padStart(2,"0");
     const info=card.querySelector(".details");
     if(info){
      let line=card.querySelector(".hs-runtime-verified");
      if(!line){line=document.createElement("span");line.className="hs-runtime-verified";info.append(line)}
      line.textContent="Spotify runtime "+m+":"+seconds+" // final cue #"+(r.finalCueIndex+1);
     }
     toast("Score verificado no Spotify // "+m+":"+seconds);
    }catch(err){toast("Spotify QA: "+err.message)}
    finally{check.disabled=false;check.textContent="Check Spotify Runtime"}
   };
   actions.append(check);
  }
 }

 if(state.activeBookSlug===v){
  const count=Object.keys(state.done||{}).length;
  const prog=document.getElementById("progress");if(prog)prog.style.width="0%";
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
panel.innerHTML='<h2>Active Book // Library</h2><p class="small">O progresso, as anotações e a sincronização na nuvem são separados por livro. Não é possível trocar durante uma leitura ativa. Capítulo V pode ser arquivado como lido sem tempo inventado. Scores VI–VIII preparados, liberados na sequência da leitura. IX e posteriores selados.</p><label class="small">Selected book <select id="hsBookSwitch" style="width:100%;margin-top:8px;background:#101a0f;color:#d2cbb7;padding:12px;border:1px solid #536746"><option value="flight-of-the-eisenstein">IV — The Flight of the Eisenstein</option><option value="fulgrim">V — Fulgrim (scores VI–VIII prepared)</option></select></label>';
nav.append(panel);
document.getElementById("hsBookSwitch").onchange=e=>change(e.target.value);

// Optional single preflight batch: one manual click prepares all three private
// per-chapter Spotify playlists. No playback, timer or future story is exposed.
const batch=document.createElement("button");
batch.type="button";batch.className="btn";batch.id="hsBatchSpotify";
batch.textContent="Prepare Spotify Playlists VI–VIII";
const batchReport=document.createElement("p");batchReport.className="small";
batchReport.id="hsBatchSpotifyReport";batchReport.setAttribute("aria-live","polite");
panel.append(batch,batchReport);
batch.onclick=async()=>{
 if(state.active||typeof beginPending!=="undefined"&&beginPending){batchReport.textContent="Finalize primeiro a sessão ativa.";return}
 if(state.activeBookSlug!==v){batchReport.textContent="Selecione Fulgrim antes da checagem.";return}
 if(!spotifyConnected()){batchReport.textContent="Conecte o Spotify nas configurações do app.";return}
 batch.disabled=true;
 const activeSlug=state.activeBookSlug,oldId=state.spotify.playlistId,oldURL=state.spotify.playlistUrl;
 const outcomes=[];
 try{
  for(const n of [6,7,8]){
   if(state.activeBookSlug!==activeSlug||state.active)break;
   batchReport.textContent="Preparando capítulo "+String(n).padStart(2,"0")+"...";
   try{
    await spotifySyncChapter(n);
    const runtime=state.spotify.chapterRuntime?.[n];
    const sec=runtime?.durationMs?Math.round(runtime.durationMs/1000):null;
    outcomes.push("CH "+String(n).padStart(2,"0")+": "+(sec!==null?Math.floor(sec/60)+":"+String(sec%60).padStart(2,"0"):"duração não informada"));
   }catch(e){outcomes.push("CH "+String(n).padStart(2,"0")+": erro — "+(e.message||"Spotify"))}
  }
 }finally{
  // Preflight never leaves the currently-active playlist pointer set to VIII.
  if(state.activeBookSlug===activeSlug){state.spotify.playlistId=oldId||"";state.spotify.playlistUrl=oldURL||"";save()}
  batchReport.textContent=outcomes.join(" | ")+" // Nenhuma reprodução iniciada.";
  batch.disabled=false;
 }
};

if(state.activeBookSlug===v)installData(v);
render();
// Initialization also needs a second portrait pass: private-art loads before the book router.
window.dispatchEvent(new Event("hs-book-changed"));
})();
