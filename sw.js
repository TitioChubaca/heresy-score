const CACHE="heresy-score-v0118";
const PATCH="./patch-v0102.js";
const ASSETS=["./","./index.html","./manifest.webmanifest","./patch-v0102.js","./scripts/book-state.js","./scripts/private-art.js","./scripts/book-backup.js","./scripts/book-switch.js","./scripts/portrait-crop.js","./scripts/portrait-pack.js","./scripts/feedback-direction.js","./data/fulgrim-score.js","./data/eisenstein-score.js","./data/eisenstein-compendium.js","./assets/ui/icons/app-icon-maskable-512.png","./assets/ui/icons/app-icon-512.png","./assets/ui/icons/app-icon-192.png","./assets/ui/symbols/aquila.png","./assets/ui/symbols/skull-bw-1.png","./assets/ui/symbols/administratum.png","./assets/ui/animated/administratum.gif"];

self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));

async function patchedPage(request){
  let res;
  try{res=await fetch(request,{cache:"no-store"})}catch(e){res=await caches.match("./index.html")}
  if(!res)return new Response("Heresy Score offline",{status:503,headers:{"Content-Type":"text/plain"}});
  let txt=await res.text();
  if(!txt.includes('src="./patch-v0102.js"'))txt=txt.replace("</body>",'<script src="./patch-v0102.js"></script><script src="./scripts/private-art.js"></script><script src="./scripts/book-backup.js"></script><script src="./data/fulgrim-score.js"></script><script src="./scripts/book-switch.js"></script><script src="./scripts/portrait-crop.js"></script><script src="./scripts/portrait-pack.js"></script><script src="./scripts/feedback-direction.js"></script></body>');
  let headers=new Headers(res.headers);headers.set("Content-Type","text/html; charset=utf-8");headers.set("Cache-Control","no-cache");
  return new Response(txt,{status:res.status,statusText:res.statusText,headers});
}

self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  if(e.request.mode==="navigate"){e.respondWith(patchedPage(e.request));return}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{let c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return res}).catch(()=>caches.match("./index.html"))));
});