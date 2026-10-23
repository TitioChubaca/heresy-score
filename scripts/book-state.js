/* Heresy Score book-state migration, v3. Pure functions for safe local-first archives. */
(function(root){
"use strict";
const IV="flight-of-the-eisenstein",V="fulgrim",VERSION=3;
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
 const active=state.activeBookSlug===V?V:IV;
 const legacyDone=state.done&&typeof state.done==="object"?state.done:{};
 const iv=ensureBook(state.books,IV,"The Flight of the Eisenstein",17,"completed");
 const v=ensureBook(state.books,V,"Fulgrim",null,"preparing");
 iv.chapterCount=17;
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
 return state;
}
root.HSBooks={IV,V,VERSION,migrate,persistActive,switchBook};
})(typeof window!=="undefined"?window:globalThis);
