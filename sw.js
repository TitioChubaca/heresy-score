const CACHE="heresy-score-v0149";
const PATCH="./patch-v0102.js";
const ASSETS=["./","./index.html","./manifest.webmanifest","./patch-v0102.js","./scripts/book-state.js","./scripts/private-art.js","./scripts/book-backup.js","./scripts/book-switch.js","./scripts/spotify-resilient.js","./scripts/score-readiness.js","./scripts/spotify-runtime-fit.js","./scripts/compact-reader.js","./scripts/portrait-crop.js","./scripts/portrait-pack.js","./scripts/feedback-direction.js","./scripts/p2-diagnostics.js","./scripts/scene-transition-markers.js","./scripts/spotify-chapter-resume.js","./scripts/portrait-compendium-help.js","./scripts/fulgrim-archive-curated.js","./data/fulgrim-score.js","./data/fulgrim-future-scores.js","./data/fulgrim-ch09-bridge.js","./data/fulgrim-curated-art.js","./assets/ui/portraits/fulgrim/fulgrim.webp","./assets/ui/portraits/fulgrim/solomon-demeter.webp","./assets/ui/portraits/fulgrim/ostian-delafour.webp","./assets/ui/portraits/fulgrim/serena-dangelus.webp","./assets/ui/portraits/fulgrim/bequa-kynska.webp","./assets/ui/portraits/fulgrim/paljor-dorji.webp","./assets/ui/portraits/fulgrim/julius-kaesoron.webp","./assets/ui/portraits/fulgrim/marius-vairosean.webp","./assets/ui/portraits/fulgrim/gaius-caphen.webp","./assets/ui/portraits/fulgrim/coraline-aseneca.webp","./assets/ui/portraits/fulgrim/eidolon.webp","./assets/ui/portraits/fulgrim/vespasian.webp","./assets/ui/portraits/fulgrim/fabius.webp","./assets/ui/portraits/fulgrim/saul-tarvitz.webp","./assets/ui/portraits/fulgrim/lucius.webp","./assets/ui/portraits/fulgrim/ferrus-manus.webp","./data/eisenstein-score.js","./data/eisenstein-compendium.js","./assets/ui/icons/app-icon-maskable-512.png","./assets/ui/icons/app-icon-512.png","./assets/ui/icons/app-icon-192.png","./assets/ui/symbols/aquila.png","./assets/ui/symbols/skull-bw-1.png","./assets/ui/symbols/administratum.png","./assets/ui/animated/administratum.gif"];

self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(async c=>{await Promise.allSettled(ASSETS.map(async asset=>{const res=await fetch(asset,{cache:"reload"});if(res.ok)await c.put(asset,res)}));}).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));

async function patchedPage(request){
  let res;
  try{res=await fetch(request,{cache:"no-store"})}catch(e){res=await (await caches.open(CACHE)).match("./index.html")}
  if(!res)return new Response("Heresy Score offline",{status:503,headers:{"Content-Type":"text/plain"}});
  let txt=await res.text();
  if(!txt.includes('src="./patch-v0102.js"'))txt=txt.replace("</body>",'<script src="./patch-v0102.js"></script><script src="./scripts/private-art.js"></script><script src="./scripts/book-backup.js"></script><script src="./data/fulgrim-score.js"></script><script src="./scripts/book-switch.js"></script><script src="./scripts/portrait-crop.js"></script><script src="./scripts/portrait-pack.js"></script><script src="./scripts/feedback-direction.js"></script><script src="./scripts/p2-diagnostics.js"></script><script src="./scripts/scene-transition-markers.js"></script></body>');
  if(!txt.includes('src="./data/fulgrim-curated-art.js"'))txt=txt.replace('<script src="./scripts/book-switch.js"></script>','<script src="./data/fulgrim-curated-art.js"></script><script src="./scripts/book-switch.js"></script>');

  if(!txt.includes('src="./scripts/fulgrim-archive-curated.js"'))txt=txt.replace('<script src="./scripts/portrait-crop.js"></script>','<script src="./scripts/fulgrim-archive-curated.js"></script><script src="./scripts/portrait-crop.js"></script>');
  if(!txt.includes('src="./data/fulgrim-future-scores.js'))txt=txt.replace(/(<script src="\\.\/data\/fulgrim-score\\.js[^"]*"><\/script>)/,'$1<script src="./data/fulgrim-future-scores.js?v=0131"></script>');
  let headers=new Headers(res.headers);headers.set("Content-Type","text/html; charset=utf-8");headers.set("Cache-Control","no-cache");
  return new Response(txt,{status:res.status,statusText:res.statusText,headers});
}

self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  if(new URL(e.request.url).origin!==self.location.origin)return; // Never cache Spotify API or authenticated third-party responses.
  if(e.request.mode==="navigate"){e.respondWith(patchedPage(e.request));return}
  e.respondWith(caches.open(CACHE).then(cache=>cache.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res.ok)cache.put(e.request,res.clone());return res}).catch(()=>cache.match("./index.html")))));
});
self.addEventListener("activate",event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith("heresy-score-v")&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})());});
