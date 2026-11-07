/* Heresy Score v0.15.0 — authoritative Spotify playlist reconciliation.
   A checked chapter is NEVER reported corrected until Spotify returns the
   exact authored URI sequence and actual per-recording durations.
   No duration-only inserts, deletes, loops, or silent substitutions. */
(()=>{
"use strict";
const previousSync=spotifySyncChapter;
const BOOK="fulgrim";
const norm=value=>String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const seconds=ms=>Math.round(ms/1000);
const hhmm=ms=>Math.floor(ms/60000)+":"+String(Math.floor(ms/1000)%60).padStart(2,"0");
const urisEqual=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function playlistTracks(id){
 const found=[];
 for(let offset=0;offset<500;offset+=100){
  const page=await spotifyApi("/playlists/"+encodeURIComponent(id)+"/items?limit=100&offset="+offset);
  if(!Array.isArray(page?.items))throw Error("Spotify não retornou a lista de faixas");
  for(const e of page.items){
   const t=e?.item||e?.track;
   // Keep unavailable items as placeholders: never falsely verify a partial playlist.
   found.push({uri:t?.uri||null,ms:Number.isFinite(t?.duration_ms)?t.duration_ms:null,
     title:t?.name||"(indisponível)",artists:(t?.artists||[]).map(x=>x.name||"")});
  }
  if(!page.next)break;
 }
 return found;
}
async function verify(id,uris){
 let last=[];
 for(let attempt=0;attempt<5;attempt++){
  last=await playlistTracks(id);
  if(urisEqual(last.map(t=>t.uri),uris)&&last.every(t=>Number.isFinite(t.ms)&&t.ms>0))return last;
  if(attempt<4)await pause(300*(attempt+1));
 }
 throw Error("Spotify não confirmou a sequência: "+last.length+"/"+uris.length+
    " faixas. Nenhuma correção pode ser declarada.");
}
async function canonicalUris(score){
 const resolved=[];
 for(const [title,artist] of score){
  const cached=await spotifyResolveTrack(title,artist);
  const uri=typeof cached==="string"?cached:cached?.uri;
  if(!uri?.startsWith("spotify:track:"))throw Error("URI inválida: "+title);
  resolved.push(uri);
 }
 // Spotify removed GET /tracks?ids=... for development-mode apps in 2026.
 // Validate each exact recording individually before touching a playlist.
 for(let i=0;i<resolved.length;i++){
  const [title,artist]=score[i];
  const t=await spotifyApi("/tracks/"+encodeURIComponent(resolved[i].split(":").pop()));
  const expectedTitle=norm(title),actualTitle=norm(t?.name);
  const titleOK=actualTitle===expectedTitle||
    actualTitle===expectedTitle.replace(/ bonus track$/,"");
  const artistOK=(t?.artists||[]).some(a=>norm(a.name)===norm(artist));
  if(!t||!Number.isFinite(t.duration_ms)||t.duration_ms<=0||!titleOK||!artistOK){
   throw Error("Gravação não confirmada: "+title+" / "+artist+
     ". Nenhuma substituição automática foi realizada.");
  }
 }
 return resolved;
}
function updateAudit(n,play,tracks,source,change){
 const target=Math.round((SCORE_META[n]?.estimatedMinutes||0)*60000);
 const total=tracks.reduce((sum,t)=>sum+t.ms,0),gap=total-target;
 const status=target&&gap>60000?"OVER_TARGET":target&&gap< -90000?"UNDER_TARGET":"WITHIN_RANGE";
 const r=state.spotify.chapterRuntime=state.spotify.chapterRuntime||{};
 r[n]={...(r[n]||{}),durationMs:total,targetMs:target,trackCount:tracks.length,
  finalCueIndex:tracks.length-1,auditTracks:tracks.map((t,i)=>({
   position:i+1,title:t.title,seconds:seconds(t.ms)})),
  auditTargetMs:target,auditOrderMatches:true,verified:true,
  verifiedAt:new Date().toISOString(),status,sourceSignature:source,
  autoFitResult:(change?"Playlist corrigida e confirmada":"Sequência Spotify confirmada")+
   " • "+hhmm(total)+(target?" / alvo "+hhmm(target)+" • "+(gap>=0?"+":"")+seconds(gap)+"s":"")+
   (status==="OVER_TARGET"?" • EXCESSO MUSICAL AINDA NÃO RESOLVIDO":
    status==="UNDER_TARGET"?" • TRILHA CURTA; REVISÃO EDITORIAL PENDENTE":" • duração aceitável")};
 play.durationMs=total;play.trackCount=tracks.length;play.finalCueIndex=tracks.length-1;
 play.scoreSignature=source;play.preflightComplete=true;play.verifiedAt=r[n].verifiedAt;
 play.verifiedSequence=tracks.map(t=>t.uri);play.sourceVerifiedBy="0.15.2";play.lastCorrection=change||"already-matched";
 state.spotify.scoreDurations=state.spotify.scoreDurations||{};
 state.spotify.scoreDurations[n]=total;
 save();
 return r[n];
}
spotifySyncChapter=async function(n){
 if(state.activeBookSlug!==BOOK)return previousSync(n);
 if(!Array.isArray(SCORES[n])||!SCORES[n].length)throw Error("Capítulo ainda não possui trilha aprovada");
 const source=JSON.stringify(SCORES[n]),key=BOOK+":"+n;
 const session=!!state.active;
 const play=state.spotify.playlists?.[key];
 if(session){
  // Restore / resume may audit but must never replace the music mid-reading.
  if(!play?.id)throw Error("Leitura em andamento sem playlist: não modificar a sessão");
  state.spotify.playlistId=play.id;
  state.spotify.playlistUrl=play.url||"https://open.spotify.com/playlist/"+play.id;
  const r=state.spotify.chapterRuntime=state.spotify.chapterRuntime||{};
  r[n]={...(r[n]||{}),verified:false,autoFitResult:"Leitura ativa: nenhuma alteração de playlist permitida"};
  save();return play.id;
 }
 let id="";
 try{
  // Always validate current Spotify contents, even for a cached preflight.
  const ensured=await spotifyEnsurePlaylist(n);
  id=ensured.id;
  if(state.activeBookSlug!==BOOK||state.active)throw Error("Contexto de leitura mudou");
  // Reuse only a sequence that THIS strict reconciler previously confirmed.
  // Legacy preflightComplete/scoreSignature alone is never proof.
  const cached=state.spotify.playlists?.[key];
  const expected=(cached?.sourceVerifiedBy==="0.15.2"&&cached?.scoreSignature===source&&
   Array.isArray(cached.verifiedSequence)&&cached.verifiedSequence.length===SCORES[n].length)
    ?cached.verifiedSequence.slice():await canonicalUris(SCORES[n]);
  if(state.activeBookSlug!==BOOK||state.active)throw Error("Contexto de leitura mudou");
  let actual=await playlistTracks(id);
  let changed="";
  if(!urisEqual(actual.map(t=>t.uri),expected)||
     actual.some(t=>!Number.isFinite(t.ms)||t.ms<=0)){
   // The only authority for playlist content is the editorial chapter cue sheet.
   // A previous auto-inserted bridge or obsolete saved playlist is reconciled here.
   await spotifyApi("/playlists/"+encodeURIComponent(id)+"/items",{
    method:"PUT",body:JSON.stringify({uris:expected})
   });
   actual=await verify(id,expected);
   changed="source-reconciled";
  } else {
   actual=await verify(id,expected);
  }
  if(state.activeBookSlug!==BOOK||state.active)throw Error("Contexto de leitura mudou; conferência descartada");
  const entry=state.spotify.playlists?.[key];
  if(!entry||entry.id!==id)throw Error("Playlist mudou durante a auditoria");
  updateAudit(n,entry,actual,source,changed);
  state.spotify.playlistId=id;
  state.spotify.playlistUrl=entry.url||"https://open.spotify.com/playlist/"+id;
  save();return id;
 }catch(err){
  const raw=String(err?.message||err);
  const message=/\b403\b|scope|forbidden/i.test(raw)?"Spotify sem permissão de leitura da playlist privada. Reautorize com Conectar Spotify nas Configurações. Detalhe: "+raw:raw;
  const r=state.spotify.chapterRuntime=state.spotify.chapterRuntime||{};
  r[n]={...(r[n]||{}),verified:false,status:"FAILED",autoFitResult:"NÃO CONFIRMADO: "+message.slice(0,180)};
  const entry=state.spotify.playlists?.[key];
  if(entry){entry.preflightComplete=false;delete entry.verifiedAt;}
  save();
  throw Error("Auditoria Spotify "+String(n).padStart(2,"0")+": "+message);
 }
};
// Avoid simultaneous preflights racing to overwrite the same playlist.
const oneAtATime=spotifySyncChapter,inFlight=new Map();
spotifySyncChapter=async function(n){
 if(state.activeBookSlug!==BOOK)return oneAtATime(n);
 if(inFlight.has(n))return inFlight.get(n);
 const work=oneAtATime(n);
 inFlight.set(n,work);
 try{return await work;}finally{if(inFlight.get(n)===work)inFlight.delete(n);}
};
window.HSSpotifyRuntimeQA={version:"0.15.2",get:n=>state.spotify.chapterRuntime?.[n]||null,
 readOnly:n=>state.spotify.chapterRuntime?.[n]?.verified===true};
})();