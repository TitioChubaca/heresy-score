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
// Editorially removable bridges only; all other cues and the final cue are protected.
// Indexes refer to the original chapter cue sheet, not a previously trimmed playlist.
// Duration fitting uses exact Spotify recordings. Keep opening and final cue;
// preserve source order and at least 60% of the musical sequence.
// A fitted duration is a technical pass, not proof of editorial scene alignment.
async function canonicalTrackData(uris){
 const out=[];
 for(const uri of uris){
  const t=await spotifyApi("/tracks/"+encodeURIComponent(uri.split(":").pop()));
  if(t?.uri!==uri||!Number.isFinite(t.duration_ms)||t.duration_ms<=0)
   throw Error("Spotify não confirmou duração da gravação "+uri);
  out.push({uri,ms:t.duration_ms,title:t.name,artists:(t.artists||[]).map(a=>a.name)});
 }
 return out;
}
// Source-derived private metrics contain counts only. No copyrighted text,
 // event details, or future character information is shipped.
const CHAPTER_WORDS={1:4776,2:5359,3:4476,4:5511,5:6110,6:5245,7:5604,8:5961,9:4951,10:6320,11:4255,12:5900,13:4610,14:4804,15:6399,16:4848,17:5590,18:4405,19:5277,20:5517,21:5418,22:5283,23:5319,24:5015,25:5586};
function calibratedTarget(n){
 const base=Number(SCORE_META[n]?.baseEstimatedMinutes||SCORE_META[n]?.estimatedMinutes);
 if(!Number.isFinite(base)||base<=0||!CHAPTER_WORDS[n])return null;
 const logs=Object.entries(state.done||{}).map(([chapter,log])=>{
  const i=Number(chapter),min=Number(log?.minutes),words=CHAPTER_WORDS[i];
  return {i,min,wpm:words/min};
 }).filter(x=>x.i<n&&x.i>0&&x.min>=14&&x.min<=65&&Number.isFinite(x.wpm)&&x.wpm>=145&&x.wpm<=255)
 .sort((a,b)=>b.i-a.i).slice(0,8);
 if(logs.length<3)return Math.round(base*10)/10;
 const speeds=logs.map(x=>x.wpm).sort((a,b)=>a-b);
 const mid=Math.floor(speeds.length/2),median=speeds.length%2?speeds[mid]:(speeds[mid-1]+speeds[mid])/2;
 const measured=CHAPTER_WORDS[n]/Math.max(165,Math.min(235,median));
 // Smooth against editorial estimate; do not whipsaw on a single session.
 const blended=base*.25+measured*.75;
 return Math.round(Math.max(base*.78,Math.min(base*1.23,blended))*10)/10;
}
function chooseEditorialSequence(n,tracks,target){
 const plan=SCORE_META[n]?.editorialFitPlan;
 // DO NOT remove arbitrary cues: the old subset fitter crossed dialogue,
 // action and atmosphere boundaries to make the arithmetic look correct.
 if(!plan||!Array.isArray(plan.optionalIndexes)||!plan.optionalIndexes.length||!target||tracks.length!==SCORES[n].length)return null;
 const allowed=[...new Set(plan.optionalIndexes)].filter(i=>Number.isInteger(i)&&i>0&&i<tracks.length-1);
 const protectedCue=new Set([0,tracks.length-1,...(plan.protectedIndexes||[])]);
 if(!allowed.length||allowed.some(i=>protectedCue.has(i))||allowed.length>12)return null;
 const initial=tracks.reduce((sum,t)=>sum+t.ms,0);
 if(initial<=target+60000)return null;
 let best=null;
 for(let mask=1;mask<(1<<allowed.length);mask++){
  const removed=allowed.filter((_,j)=>mask&(1<<j));
  const removing=new Set(removed);
  const kept=tracks.filter((_,i)=>!removing.has(i));
  const total=kept.reduce((sum,t)=>sum+t.ms,0);
  if(total<target-90000||total>target+60000||kept.length<Math.ceil(tracks.length*.6))continue;
  const msBefore=index=>tracks.reduce((sum,t,i)=>sum+(i<index&&!removing.has(i)?t.ms:0),0);
  const anchorLoss=(plan.anchors||[]).reduce((sum,a)=>{
   if(removing.has(a.index))return sum+100;
   return sum+Math.abs(msBefore(a.index)-a.at*target)/60000*(a.weight||1);
  },0);
  const durationLoss=Math.abs(total-target)/60000;
  const loss=durationLoss*2+anchorLoss*.8+removed.length*.25;
  if(!best||loss<best.loss)best={uris:kept.map(t=>t.uri),removed,total,error:Math.abs(total-target),anchorLoss,loss};
 }
 return best;
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
  autoFitResult:(change?"Playlist modificada e conferida":"Sequência Spotify conferida")+
   " • "+hhmm(total)+(target?" / alvo "+hhmm(target)+" • "+(gap>=0?"+":"")+seconds(gap)+"s":"")+
   (status==="OVER_TARGET"?" • EXCESSO MUSICAL AINDA NÃO RESOLVIDO":
    status==="UNDER_TARGET"?" • TRILHA CURTA; REVISÃO EDITORIAL PENDENTE":" • duração aceitável")};
 play.durationMs=total;play.trackCount=tracks.length;play.finalCueIndex=tracks.length-1;
 play.scoreSignature=source;play.preflightComplete=status==="WITHIN_RANGE";play.verifiedAt=r[n].verifiedAt;
 play.verifiedSequence=tracks.map(t=>t.uri);play.sourceVerifiedBy="0.15.7";play.lastCorrection=change||"already-matched";
 state.spotify.scoreDurations=state.spotify.scoreDurations||{};
 state.spotify.scoreDurations[n]=total;
 save();
 return r[n];
}
spotifySyncChapter=async function(n){
 if(state.activeBookSlug!==BOOK)return previousSync(n);
 if(!Array.isArray(SCORES[n])||!SCORES[n].length)throw Error("Capítulo ainda não possui trilha aprovada");
 // Recalculate only the next unread score using real logged reading speed.
 // An invalid 1-minute chapter log is excluded by calibratedTarget().
 if(n>Math.max(0,...Object.keys(state.done||{}).map(Number).filter(Number.isInteger))){
  const meta=SCORE_META[n];
  if(meta){
   if(!Number.isFinite(meta.baseEstimatedMinutes))meta.baseEstimatedMinutes=Number(meta.estimatedMinutes);
   const estimated=calibratedTarget(n);
   if(estimated)meta.estimatedMinutes=estimated;
  }
 }
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
  const expected=(cached?.sourceVerifiedBy==="0.15.7"&&cached?.scoreSignature===source&&
   Array.isArray(cached.verifiedSequence)&&cached.verifiedSequence.length===SCORES[n].length)
    ?cached.verifiedSequence.slice():await canonicalUris(SCORES[n]);
  if(state.activeBookSlug!==BOOK||state.active)throw Error("Contexto de leitura mudou");
  let actual=await playlistTracks(id);
  let changed="";
  // Re-evaluate against the full authored source, not a previously cut list.
  // This prevents a prior cut from being silently restored or compounded.
  const target=Math.round((SCORE_META[n]?.estimatedMinutes||0)*60000);
  // Earlier builds pruned any interior cue; those saved cuts may have
  // destroyed a scene transition and must NEVER be reused.
  const retained=(cached?.editorialFit?.mode==="scene-protected-duration-fit"&&
    cached.editorialFit.source===source&&
    Array.isArray(cached.editorialFit.uris))?cached.editorialFit.uris:null;
  let desired=retained||expected;
  if(target>0){
   const full=urisEqual(actual.map(t=>t.uri),expected)?actual:await canonicalTrackData(expected);
   const fullMs=full.reduce((sum,t)=>sum+t.ms,0);
   if(fullMs>target+60000){
    const fit=chooseEditorialSequence(n,full,target);
    if(fit){
     desired=fit.uris;
     const entry=state.spotify.playlists?.[key];
     if(entry)entry.editorialFit={source,uris:fit.uris,removedIndexes:fit.removed,
      targetMs:target,plannedMs:fit.total,mode:"scene-protected-duration-fit",anchorLoss:fit.anchorLoss};
    }else{
     // Do not replace a playlist with the overlong source when fitting fails.
     desired=retained||expected;
    }
   }else{
    desired=expected;
    if(cached)delete cached.editorialFit;
   }
  }
  if(!urisEqual(actual.map(t=>t.uri),desired)||
     actual.some(t=>!Number.isFinite(t.ms)||t.ms<=0)){
   // The only authority for playlist content is the editorial chapter cue sheet.
   // A previous auto-inserted bridge or obsolete saved playlist is reconciled here.
   await spotifyApi("/playlists/"+encodeURIComponent(id)+"/items",{
    method:"PUT",body:JSON.stringify({uris:desired})
   });
   actual=await verify(id,desired);
   changed="source-reconciled";
  } else {
   actual=await verify(id,desired);
  }
  if(state.activeBookSlug!==BOOK||state.active)throw Error("Contexto de leitura mudou; conferência descartada");
  const entry=state.spotify.playlists?.[key];
  if(!entry||entry.id!==id)throw Error("Playlist mudou durante a auditoria");
  updateAudit(n,entry,actual,source,changed);
  // Verification is not fitting. Never silently label an overlong score ready.
  if(state.spotify.chapterRuntime?.[n]?.status!=="WITHIN_RANGE"){
   const r=state.spotify.chapterRuntime[n];
   r.autoFitResult+=" // BLOQUEADO: exige nova curadoria musical antes da leitura";
   entry.preflightComplete=false;
   save();
   throw Error("Playlist conferida, mas FORA DA META: "+hhmm(r.durationMs)+" / "+hhmm(r.targetMs)+". Não foi ajustada.");
  }
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
window.HSSpotifyRuntimeQA={version:"0.16.6",get:n=>state.spotify.chapterRuntime?.[n]||null,
 readOnly:n=>state.spotify.chapterRuntime?.[n]?.verified===true,
 ready:n=>state.spotify.chapterRuntime?.[n]?.status==="WITHIN_RANGE"};
})();