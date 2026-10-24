/* Opt-in diagnostics: no remote calls and no account tokens in the report. */
(()=>{
 const settings=document.querySelector('[data-view-panel="settings"]');if(!settings)return;
 const section=document.createElement("section");section.className="panel";
 section.innerHTML='<h2>Cogitator // Diagnostics</h2><p class="small">Verificações locais; não muda os logs, não acessa Spotify nem Supabase.</p><button class="btn" id="hsRunDiagnostics">Run local diagnostics</button><button class="btn" id="hsCopyDiagnostics">Copy sanitized report</button><pre id="hsDiagnosticsResult" class="small" style="white-space:pre-wrap;overflow-wrap:anywhere">Not yet checked.</pre>';
 settings.append(section);
 let report="";
 function inspect(){
  const slug=state.activeBookSlug||HSBooks.IV,b=state.books||{};
  const logs=x=>Object.keys(b[x]?.done||{}).length;
  const currentDone=JSON.stringify(state.done||{})===JSON.stringify(b[slug]?.done||{});
  const list=state.spotify?.playlists||{};
  const checks=[
   ["release","0.11.6"],
   ["book selected",slug],
   ["saved book log consistency",currentDone?"OK":"Needs review"],
   ["Eisenstein recorded chapters",logs(HSBooks.IV)],
   ["Fulgrim recorded chapters",logs(HSBooks.V)],
   ["local personal art storage",typeof indexedDB!=="undefined"?"Available":"Not available"],
   ["Spotify authenticated",spotifyConnected()?"Yes":"No"],
   ["chapter-scoped Spotify playlists",Object.keys(list).length],
   ["cloud enabled",!!state.cloud?.enabled],
   ["cloud last error",state.cloud?.lastError?"Check cloud panel":"None"],
   ["PWA offline controller",!!navigator.serviceWorker?.controller],
   ["direction feedback fields",["ending","ambience","transitions"].every(k=>!!document.querySelector('.seg[data-key="'+k+'"]'))?"Ready":"Not ready"]
  ];
  report="HERESY SCORE // LOCAL P2 DIAGNOSTICS\n"+new Date().toISOString()+"\n"+checks.map(([k,v])=>k+": "+v).join("\n")+"\nNo account tokens or reading notes included.";
  section.querySelector("#hsDiagnosticsResult").textContent=report;
 }
 section.querySelector("#hsRunDiagnostics").onclick=inspect;
 section.querySelector("#hsCopyDiagnostics").onclick=async()=>{
  if(!report)inspect();
  try{await navigator.clipboard.writeText(report);if(typeof toast==="function")toast("diagnostics copied")}
  catch(e){if(typeof toast==="function")toast("clipboard unavailable")}
 };
})();