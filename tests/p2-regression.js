/* Node: node tests/p2-regression.js. No Spotify/Supabase credentials needed. */
(function(root){
 async function run(read){
  const paths=["index.html","patch-v0102.js","sw.js","scripts/book-state.js","scripts/book-switch.js","scripts/book-backup.js","scripts/feedback-direction.js","scripts/p2-diagnostics.js"];
  const sources={};for(const p of paths)sources[p]=await read(p);
  const ok=(condition,msg)=>{if(!condition)throw Error(msg)};
  const html=sources["index.html"],start=html.indexOf("<script>\n");
  ok(start>=0,"app inline script missing");
  const base=html.slice(start+9,html.indexOf("</script>",start));
  for(const path of paths)if(path!=="index.html")new Function(sources[path]);
  new Function(base);
  const clip=(prefix,suffix)=>{const a=base.indexOf(prefix),b=base.indexOf(suffix,a);ok(a>=0&&b>a,"missing "+prefix);return base.slice(a,b)};
  const cloud=clip("async function cloudPushChapter(chapter,loud=false)","async function cloudConnect()");
  const spotify=clip("async function spotifyEnsurePlaylist(chapter)","async function spotifySyncChapter(chapter)");
  const mock={activeBookSlug:"flight-of-the-eisenstein",done:{1:{minutes:33,ending:"fit"}},cloud:{enabled:true,token:"fake"}};
  const pending=[];
  const helpers={state:mock,HSBooks:{IV:"flight-of-the-eisenstein",V:"fulgrim"},cloudConfigured:()=>true,
   sha256Hex:async()=>"fake",cloudRequest:()=>new Promise(resolve=>pending.push(resolve)),save:()=>{},
   render:()=>{},renderCloud:()=>{},toast:()=>{}};
  const api=new Function(...Object.keys(helpers),cloud+";return {push:cloudPushChapter,pull:cloudPullLogs}")
   (...Object.values(helpers));
  const push=api.push(1);for(let i=0;i<6;i++)await Promise.resolve();
  ok(pending.length===1,"push did not start");
  mock.activeBookSlug="fulgrim";mock.done={1:{minutes:25,ending:"weak"}};pending.shift()([]);
  ok(await push===false&&mock.done[1].minutes===25,"late push corrupted other book");
  const pull=api.pull();for(let i=0;i<6;i++)await Promise.resolve();
  ok(pending.length===1,"pull did not start");
  mock.activeBookSlug="flight-of-the-eisenstein";mock.done={1:{minutes:33,ending:"fit"}};
  pending.shift()([{book_slug:"fulgrim",chapter:1,minutes:100,payload:{}}]);
  ok(await pull===false&&mock.done[1].minutes===33,"late pull corrupted other book");
  const ids=["IV1","V2"],created=[];
  const state={activeBookSlug:"flight-of-the-eisenstein",spotify:{playlistId:"legacy"}},
   spHelpers={state,HSBooks:{IV:"flight-of-the-eisenstein"},save:()=>{},
    spotifyApi:async(p,opt)=>{if(p==="/me/playlists"){const id=ids.shift();created.push(id);return{id}}return{id:p.split("/").pop()}}};
  const ensure=new Function(...Object.keys(spHelpers),spotify+";return spotifyEnsurePlaylist")
   (...Object.values(spHelpers));
  const a=await ensure(1);state.activeBookSlug="fulgrim";const b=await ensure(2);
  state.activeBookSlug="flight-of-the-eisenstein";const again=await ensure(1);
  ok(a.id==="IV1"&&b.id==="V2"&&again.id==="IV1"&&created.length===2,"Spotify playlists shared/overwritten");
  ok(sources["scripts/feedback-direction.js"].includes('key:"ending"')&&
   sources["scripts/feedback-direction.js"].includes('key:"ambience"')&&
   sources["scripts/feedback-direction.js"].includes('key:"transitions"'),"feedback dimensions missing");
  ok(sources["scripts/book-backup.js"].includes("legacyBookIVLogs:clone(iv)"),"backup mislabel");
  ok(sources["sw.js"].includes('"./scripts/p2-diagnostics.js"')&&
   sources["sw.js"].includes('"./scripts/feedback-direction.js"'),"PWA new files not cached");
  return "P2 regression PASS: source syntax, book-race guards, chapter playlists, feedback, backups, offline cache.";
 }
 root.HSP2Regression={run};
 if(typeof module!=="undefined"&&typeof require==="function"&&require.main===module){
  const fs=require("fs"),path=require("path");
  run(p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8"))
   .then(x=>process.stdout.write(x+"\n"))
   .catch(e=>{process.stderr.write(String(e.stack||e)+"\n");process.exitCode=1});
 }
})(typeof globalThis!=="undefined"?globalThis:this);
