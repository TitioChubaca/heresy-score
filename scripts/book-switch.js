/* Book switch layer: do not expose uncurated Fulgrim chapters or scores. */
(()=>{
const iv=HSBooks.IV,v=HSBooks.V;
const ivData={scores:{...SCORES},meta:{...SCORE_META},chapters:chapters.map(x=>({...x})),people:[...people],archive:[...archiveRecords]};
const clearScore=()=>{for(const k of Object.keys(SCORES))delete SCORES[k];for(const k of Object.keys(SCORE_META))delete SCORE_META[k]};
function installData(slug){
 clearScore();chapters.splice(0);people.splice(0);archiveRecords.splice(0);
 if(slug===iv){Object.assign(SCORES,ivData.scores);Object.assign(SCORE_META,ivData.meta);chapters.push(...ivData.chapters);people.push(...ivData.people);archiveRecords.push(...ivData.archive)}
 else {chapters.push({number:1,title:"CHAPTER 01 // SCORE NOT CURATED",estimatedMinutes:null,startCue:null})}
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
 const locked=slug===v;
 for(const el of document.querySelectorAll('[data-view="personae"],[data-view="archive"]'))el.disabled=locked;
}
const oldRender=render;render=function(){
 oldRender();
 setBanner();
 if(state.activeBookSlug===v){
  const count=Object.keys(state.done||{}).length;
  const prog=document.getElementById("progress");if(prog)prog.style.width="0%";
  const text=document.getElementById("progressText");if(text)text.textContent=count+" logged // score pending";
  const label=document.getElementById("clearanceLabel");if(label)label.textContent="Book V // no chapters read";
  const directive=document.getElementById("directive");if(directive)directive.textContent="FULGRIM // score do capítulo I ainda não validado. Nenhum evento narrativo foi antecipado.";
  const archive=document.getElementById("bookArchiveProgress");if(archive)archive.textContent="17 chapters // completed";
  const chapter=document.querySelector("#chapters .chapter .actions");if(chapter)chapter.innerHTML='<span class="small">Chapter I score pending QA</span>';
  const roster=document.getElementById("roster");if(roster)roster.replaceChildren();
  const world=document.getElementById("worldArchive");if(world)world.replaceChildren();
 }
};
function change(slug){
 if(slug!==iv&&slug!==v)return;
 if(state.activeBookSlug===slug)return;
 try{
  HSBooks.switchBook(state,slug);
  installData(slug);
  state.spotify.scoreDurations={};state.spotify.chapterRuntime={};
  state.view="reading";
  save();render();applyView("reading");
  toast(slug===iv?"Eisenstein archive loaded":"Fulgrim archive selected; score still sealed");
 }catch(e){toast(e.message);const p=document.getElementById("hsBookSwitch");if(p)p.value=state.activeBookSlug}
}
const nav=document.querySelector('[data-view-panel="books"]');
const panel=document.createElement("section");panel.id="hsBooksPanel";panel.className="panel";
panel.innerHTML='<h2>Active Book // Library</h2><p class="small">O progresso, as anotações e a sincronização na nuvem são separados por livro. Não é possível trocar durante uma leitura ativa. O score de Fulgrim permanece selado.</p><label class="small">Selected book <select id="hsBookSwitch" style="width:100%;margin-top:8px;background:#101a0f;color:#d2cbb7;padding:12px;border:1px solid #536746"><option value="flight-of-the-eisenstein">IV — The Flight of the Eisenstein</option><option value="fulgrim">V — Fulgrim (preparing)</option></select></label>';
nav.append(panel);
document.getElementById("hsBookSwitch").onchange=e=>change(e.target.value);
if(state.activeBookSlug===v)installData(v);
render();
})();
