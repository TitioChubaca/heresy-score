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
 // Only the next chapter exposes an optional Spotify preflight. It edits the
 // active private playlist, but never starts a reading timer or playback.
 if(state.activeBookSlug===v&&state.done?.[1]&&!state.done?.[2]&&!state.active){
  const card=[...document.querySelectorAll("#chapters .chapter")]
   .find(x=>x.querySelector(".chname")?.textContent.includes("CHAPTER 02"));
  const actions=card?.querySelector(".actions");
  if(actions){
   const check=document.createElement("button");
   check.type="button";check.className="btn";check.textContent="Check Spotify Runtime";
   check.onclick=async()=>{
    check.disabled=true;check.textContent="Checking Spotify...";
    try{
     if(!spotifyConnected())throw Error("Spotify precisa estar conectado");
     await spotifySyncChapter(2);
     const r=state.spotify.chapterRuntime?.[2];
     if(!r||!Number.isFinite(r.durationMs))throw Error("Duracao nao retornada pelo Spotify");
     const m=Math.floor(r.durationMs/60000),seconds=String(Math.floor(r.durationMs/1000)%60).padStart(2,"0");
     const info=card.querySelector(".details");
     if(info){const line=document.createElement("span");line.textContent="Spotify runtime "+m+":"+seconds+" // final cue #"+(r.finalCueIndex+1);info.append(line)}
     toast("Score validado no Spotify // "+m+":"+seconds);
    }catch(err){toast("Spotify QA: "+err.message)}
    finally{check.disabled=false;check.textContent="Check Spotify Runtime"}
   };
   actions.append(check);
  }
 }

 if(state.activeBookSlug===v){
  const count=Object.keys(state.done||{}).length;
  const prog=document.getElementById("progress");if(prog)prog.style.width="0%";
  const text=document.getElementById("progressText");if(text)text.textContent=count+" / 1 curated // Book V";
  const label=document.getElementById("clearanceLabel");if(label)label.textContent="Book V // no chapters read";
  const directive=document.getElementById("directive");if(directive&&!state.active)directive.textContent=count>=2?"FULGRIM // Next score remains sealed.":count===1?"FULGRIM // CHAPTER 02 SCORE READY.":"FULGRIM // CHAPTER 01 SCORE READY.";
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
  Promise.resolve(window.HSPrivateArt?.refresh?.()).catch(()=>{});
  toast(slug===iv?"Eisenstein archive loaded":"Fulgrim archive selected; score still sealed");
 }catch(e){toast(e.message);const p=document.getElementById("hsBookSwitch");if(p)p.value=state.activeBookSlug}
}
const nav=document.querySelector('[data-view-panel="books"]');
const panel=document.createElement("section");panel.id="hsBooksPanel";panel.className="panel";
panel.innerHTML='<h2>Active Book // Library</h2><p class="small">O progresso, as anotações e a sincronização na nuvem são separados por livro. Não é possível trocar durante uma leitura ativa. Apenas o capítulo I de Fulgrim está preparado.</p><label class="small">Selected book <select id="hsBookSwitch" style="width:100%;margin-top:8px;background:#101a0f;color:#d2cbb7;padding:12px;border:1px solid #536746"><option value="flight-of-the-eisenstein">IV — The Flight of the Eisenstein</option><option value="fulgrim">V — Fulgrim (chapter I ready)</option></select></label>';
nav.append(panel);
document.getElementById("hsBookSwitch").onchange=e=>change(e.target.value);
if(state.activeBookSlug===v)installData(v);
render();
})();
