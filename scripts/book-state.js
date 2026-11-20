/* Heresy Score book-state migration, v3. Pure functions for safe local-first archives. */
(function(root){
"use strict";
const IV="flight-of-the-eisenstein",V="fulgrim",VI="descent-of-angels",VERSION=4;
const VALID_BOOKS=new Set([IV,V,VI]);
const copy=x=>JSON.parse(JSON.stringify(x===undefined?{}:x));
function ensureBook(books,slug,title,chapterCount,status){
 if(!books[slug] || typeof books[slug]!=="object")books[slug]={};
 const b=books[slug];b.slug=slug;b.title=title;
 if(b.chapterCount===undefined)b.chapterCount=chapterCount;
 if(!b.done||typeof b.done!=="object"||Array.isArray(b.done))b.done={};
 if(!b.status)b.status=status;
 return b;
}
function migrate(raw){
 const state=raw&&typeof raw==="object"?raw:{};
 if(!state.books||typeof state.books!=="object")state.books={};
 const active=VALID_BOOKS.has(state.activeBookSlug)?state.activeBookSlug:IV;
 const legacyDone=state.done&&typeof state.done==="object"?state.done:{};
 const iv=ensureBook(state.books,IV,"The Flight of the Eisenstein",17,"completed");
 const v=ensureBook(state.books,V,"Fulgrim",25,"completed");
 const vi=ensureBook(state.books,VI,"Descent of Angels",25,"not-started");
 if(v.chapterCount==null)v.chapterCount=25;
 iv.chapterCount=17;
 vi.chapterCount=25;
 // Only the currently selected Book IV may replenish Book IV from legacy state.done.
 // This guards against a Book V reload polluting historical IV logs.
 if(active===IV){
  for(const [chapter,record] of Object.entries(legacyDone)){
   if(!iv.done[chapter])iv.done[chapter]=copy(record);
   else if((record.finishedAt||"")>(iv.done[chapter].finishedAt||""))
    iv.done[chapter]=copy(record);
  }
  if(state.active && !iv.active)iv.active=copy(state.active);
 }
 state.activeBookSlug=active;
 // Old versions kept Spotify runtime keyed solely by chapter number. Capture
 // the currently selected book before the first cross-book switch; no tokens.
 if(state.spotify&&!state.books[active].spotifyAuditSnapshot){
  state.books[active].spotifyAuditSnapshot={
   chapterRuntime:copy(state.spotify.chapterRuntime||{}),
   scoreDurations:copy(state.spotify.scoreDurations||{}),
   auditResults:copy(state.spotify.auditResults||{})
  };
 }
 state.done=copy(state.books[active].done);
 state.active=state.books[active].active?copy(state.books[active].active):null;
 state.schemaVersion=VERSION;
 return state;
}
function persistActive(state){
 if(!state.books)state.books={};
 const slug=state.activeBookSlug||IV;
 const b=state.books[slug];
 if(!b)throw Error("Unknown book "+slug);
 b.done=copy(state.done||{});
 b.active=state.active?copy(state.active):null;
 if(state.spotify){b.spotifyAuditSnapshot={
  chapterRuntime:copy(state.spotify.chapterRuntime||{}),
  scoreDurations:copy(state.spotify.scoreDurations||{}),
  auditResults:copy(state.spotify.auditResults||{})
 };}
 state.schemaVersion=VERSION;
 return state;
}
function switchBook(state,slug){
 if(!state.books || !state.books[slug])throw Error("Book not in archive: "+slug);
 if(state.active)throw Error("Finish or cancel the current reading session before switching books");
 if(slug===state.activeBookSlug)return state;
 persistActive(state);
 state.activeBookSlug=slug;
 state.done=copy(state.books[slug].done);
 state.active=state.books[slug].active?copy(state.books[slug].active):null;
 state.spotify=state.spotify||{};
 const snapshot=state.books[slug].spotifyAuditSnapshot||{};
 state.spotify.chapterRuntime=copy(snapshot.chapterRuntime||{});
 state.spotify.scoreDurations=copy(snapshot.scoreDurations||{});
 state.spotify.auditResults=copy(snapshot.auditResults||{});
 state.spotify.playlistId="";state.spotify.playlistUrl="";
 return state;
}
function unitLabel(slug,sequenceIndex){
 const n=Number(sequenceIndex);
 if(slug===VI){
  if(n===1)return "Prelude";
  if(n===25)return "Aftermath";
  if(n>=2&&n<=24)return "Capítulo "+(n-1);
 }
 return "Capítulo "+String(n).padStart(2,"0");
}
root.HSBooks={IV,V,VI,VERSION,migrate,persistActive,switchBook,unitLabel,validSlugs:[IV,V,VI]};
})(typeof window!=="undefined"?window:globalThis);
