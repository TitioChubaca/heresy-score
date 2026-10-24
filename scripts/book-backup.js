/* Offline JSON export: all book histories, no Spotify tokens or cloud recovery secret. */
(()=>{
 const panel=document.querySelector('[data-view-panel="settings"]');if(!panel)return;
 const b=document.createElement("button");b.className="btn";
 b.textContent="Export all books backup";b.style.marginTop="12px";
 b.onclick=()=>{
  try{
   HSBooks.persistActive(state);
   const clone=x=>JSON.parse(JSON.stringify(x));
   const books=clone(state.books||{});
   const iv=books[HSBooks.IV]?.done||{};
   const obj={schemaVersion:state.schemaVersion||HSBooks.VERSION,exportVersion:"0.11.6",exportDate:new Date().toISOString(),
    activeBookSlug:state.activeBookSlug||HSBooks.IV,books,legacyBookIVLogs:clone(iv),
    description:"Reading logs only; Spotify credentials and cloud recovery token excluded. Private IndexedDB images are not included."};
   const blob=new Blob([JSON.stringify(obj,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),link=document.createElement("a");
   const day=new Date().toISOString().slice(0,10);
   link.href=url;link.download="heresy-score-books-backup-"+day+".json";link.click();
   setTimeout(()=>URL.revokeObjectURL(url),60000);
  }catch(e){if(typeof toast==="function")toast("Backup failed: "+e.message)}
 };
 panel.append(b);
})();