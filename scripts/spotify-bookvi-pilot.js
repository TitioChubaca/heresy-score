/* Book VI published pilots: exact-recording, fail-closed Spotify audit.
   Neither the 2026-11-20 private novel nor scene notes are bundled.
   This verifies recording metadata and runtime, NOT emotional suitability. */
(()=>{
"use strict";
const original=spotifySyncChapter,BOOK=HSBooks.VI;
const norm=x=>String(x||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const clock=ms=>Math.floor(ms/60000)+":"+String(Math.floor(ms/1000)%60).padStart(2,"0");
const emit=(n,phase,message)=>{
 const detail={bookSlug:BOOK,chapter:n,phase,message,at:new Date().toISOString()};
 window.HSSpotifyAuditProgress=detail;
 window.dispatchEvent(new CustomEvent("hs-spotify-audit-progress",{detail}));
};
const same=(a,b)=>a.length===b.length&&a.every((t,i)=>t===b[i]);
const delay=ms=>new Promise(r=>setTimeout(r,ms));
// spotifyResolveTrack can return a plain URI OR an object containing {uri}.
// Never assume a string, and never silently use a search result without GET.
const candidateTrackUri=result=>{
 const value=typeof result==="string"?result:
  result&&typeof result==="object"&&typeof result.uri==="string"?result.uri:
  result&&typeof result==="object"&&typeof result.id==="string"?
   "spotify:track:"+result.id:null;
 return typeof value==="string"&&/^spotify:track:[A-Za-z0-9]{22}$/.test(value)?value:null;
};
window.HSBookVITrackUri=candidateTrackUri;
async function readPlaylist(id){
 const items=[];
 for(let offset=0;offset<200;offset+=50){
  const page=await spotifyApi("/playlists/"+encodeURIComponent(id)+"/items?limit=50&offset="+offset);
  if(!Array.isArray(page?.items))throw Error("Spotify não devolveu itens da playlist");
  for(const entry of page.items){
   const t=entry.item||entry.track;
   items.push({uri:t?.uri||null,ms:t?.duration_ms,title:t?.name||null,artists:(t?.artists||[]).map(x=>x.name)});
  }
  if(!page.next)break;
 }
 return items;
}
async function confirm(id,expected){
 for(let attempt=0;attempt<4;attempt++){
  const tracks=await readPlaylist(id);
  if(same(tracks.map(t=>t.uri),expected)&&tracks.every(x=>Number.isFinite(x.ms)&&x.ms>0))
   return tracks;
  if(attempt<3)await delay(250*(attempt+1));
 }
 throw Error("Spotify não confirmou a sequência e a duração da unidade após a gravação. Não liberado.");
}
const activeChecks=new Map();
const syncUnwrapped=async function(n){
 if(state.activeBookSlug!==BOOK)return original(n);
 if(!Number.isInteger(n)||n<1||n>25||!SCORES[n]||!Array.isArray(SCORE_META[n]?.recordingReferences))throw Error("Esta unidade ainda não tem curadoria musical piloto; nenhuma playlist foi criada.");
 if(state.active)throw Error("Não alterar a playlist durante uma leitura ativa.");
 // A catalog-only algorithm is not a chapter-by-chapter narrative review.
 // Never publish an unreviewed future score as if it were scene-mapped.
 if(n>=7&&SCORE_META[n]?.sceneReview?.reviewed!==true)
  throw Error("Trilha deste capítulo ainda requer curadoria cinematográfica; nenhuma playlist foi alterada.");
 const refs=SCORE_META[n]?.recordingReferences;
 if(!Array.isArray(refs)||refs.length!==SCORES[n]?.length||refs.length<(n===25?1:3))
  throw Error("Plano musical da unidade "+n+" ausente ou incompleto.");
 const key=BOOK+":"+n,signature=JSON.stringify(SCORES[n]),targetMs=Math.round(SCORE_META[n].estimatedMinutes*60000);
 if(!targetMs)throw Error("Tempo de leitura não definido para esta unidade.");
 try{
  emit(n,"measuring","Conferindo títulos, artistas, URIs e durações reais da unidade "+n+"...");
  const verified=[];
  for(let i=0;i<refs.length;i++){
   if(state.activeBookSlug!==BOOK)throw Error("Livro alterado durante a conferência.");
   const cue=refs[i];
   // Prelude has source-grounded exact IDs. Subsequent early-book recordings
   // are resolved by title + composer, then STRICTLY verified by Spotify GET.
   // Never trust the first search hit (or its cached URI) without checking.
   const lookup=cue.uri||await spotifyResolveTrack(cue.title,cue.artist);
   const candidateUri=candidateTrackUri(lookup);
   if(!candidateUri)throw Error("Spotify não devolveu uma URI de faixa válida para "+cue.title+
     ". Refaça a busca; nenhuma playlist foi alterada.");
   const id=candidateUri.slice("spotify:track:".length);
   const t=await spotifyApi("/tracks/"+encodeURIComponent(id));
   if(t?.uri!==candidateUri||norm(t.name)!==norm(cue.title)||
      !(t.artists||[]).some(a=>norm(a.name)===norm(cue.artist))||
      !Number.isFinite(t.duration_ms)||t.duration_ms<=0||
      (n!==1&&Math.abs(t.duration_ms-cue.durationApproxSeconds*1000)>8000))
    throw Error("Gravação indisponível/divergente: "+cue.title+" — "+cue.artist+
      ". Não substituir automaticamente por outra versão.");
   verified.push({uri:t.uri,ms:t.duration_ms,title:t.name,artists:t.artists.map(a=>a.name)});
   emit(n,"measuring","Gravações exatas confirmadas "+(i+1)+"/"+refs.length+".");
  }
  const desired=verified.map(x=>x.uri),actualMs=verified.reduce((sum,x)=>sum+x.ms,0),diff=actualMs-targetMs;
  const positions=SCORE_META[n]?.editorialPositions||
   refs.map((_,i)=>i/refs.length);
  if(positions.length!==refs.length)throw Error("Mapa editorial incompleto; não publicar a playlist.");
  const plan={slots:refs.map((cue,i)=>({role:cue.role,at:positions[i],required:cue.required,
   anchorWeight:i===0||i===refs.length-1?3:1,
   choices:[{uri:verified[i].uri,role:cue.role,durationMs:verified[i].ms,intensity:cue.intensity}]}))};
  const editorial=window.HSEditorialScore?.fit?.(plan,targetMs);
  if(!editorial?.ok||!same(editorial.uris,desired))
   throw Error("A sequência de papéis musicais obrigatórios falhou na validação editorial. "+
    (editorial?.reason||"Motor narrativo indisponível."));
  if(diff< -45000||diff>60000)throw Error("Trilha fora da meta para "+HSBooks.unitLabel(BOOK,n)+": "+clock(actualMs)+
    " vs "+clock(targetMs)+" ("+(diff>0?"+":"")+Math.round(diff/1000)+
    "s). Exige nova curadoria; a playlist não será escrita.");
  emit(n,"connecting","Duração planejada "+clock(actualMs)+" / alvo "+clock(targetMs)+
    ". Buscando playlist existente, sem duplicá-la...");
  const play=await spotifyEnsurePlaylist(n);
  if(state.activeBookSlug!==BOOK)throw Error("Livro alterado durante preparo.");
  const id=play.id,found=await readPlaylist(id);
  const needsWrite=!same(found.map(t=>t.uri),desired)||
    found.some((t,i)=>t.ms!==verified[i]?.ms);
  if(needsWrite){
   emit(n,"writing","Gravando "+desired.length+" músicas na playlist já associada à unidade...");
   await spotifyApi("/playlists/"+encodeURIComponent(id)+"/items",{
    method:"PUT",body:JSON.stringify({uris:desired})
   });
  }
  emit(n,"verifying","Relendo Spotify para confirmar ordem e duração exatas...");
  const confirmed=await confirm(id,desired);
  if(state.activeBookSlug!==BOOK)throw Error("Livro alterado durante auditoria.");
  const measured=confirmed.reduce((sum,t)=>sum+t.ms,0);
  if(Math.abs(measured-actualMs)>0)throw Error("Spotify devolveu durações diferentes após gravação.");
  const time=new Date().toISOString(),entry=state.spotify.playlists[key];
  if(!entry||entry.id!==id)throw Error("Vínculo da playlist foi alterado durante a conferência.");
  entry.scoreSignature=signature;
  entry.preflightComplete=true;
  entry.verifiedSequence=desired;
  entry.durationMs=measured;
  entry.finalCueIndex=confirmed.length-1;
  entry.trackCount=confirmed.length;
  entry.verifiedAt=time;
  entry.sourceVerifiedBy="0.18.2";
  entry.editorialStatus=SCORE_META[n].editorialStatus;
  entry.lastCorrection=needsWrite?"playlist-updated-and-verified":"existing-playlist-verified";
  state.spotify.chapterRuntime=state.spotify.chapterRuntime||{};
  state.spotify.chapterRuntime[n]={
   verified:true,status:"WITHIN_RANGE",durationMs:measured,targetMs,trackCount:confirmed.length,
   finalCueIndex:confirmed.length-1,verifiedAt:time,sourceSignature:signature,
   auditTracks:confirmed.map((t,i)=>({position:i+1,title:t.title,seconds:Math.round(t.ms/1000)})),
   editorialStatus:SCORE_META[n].editorialStatus,autoFitResult:"PILOTO CONFIRMADO TECNICAMENTE · "+
   clock(measured)+" / "+clock(targetMs)+" · revisão narrativa pendente"
  };
  state.spotify.auditResults=state.spotify.auditResults||{};
  state.spotify.auditResults[n]={status:"VERIFIED",at:time,
    message:"Spotify confirmou as gravações e o tempo; qualidade narrativa será avaliada após leitura."};
  state.spotify.scoreDurations=state.spotify.scoreDurations||{};
  state.spotify.scoreDurations[n]=measured;
  state.spotify.playlistId=id;
  state.spotify.playlistUrl=entry.url||"https://open.spotify.com/playlist/"+id;
  save();
  emit(n,"success","Confirmado: "+clock(measured)+" / alvo "+clock(targetMs)+
    ". Playlist privada reutilizada; encaixe narrativo ainda em avaliação.");
  return id;
 }catch(err){
  const message=String(err?.message||err);
  state.spotify.chapterRuntime=state.spotify.chapterRuntime||{};
  state.spotify.chapterRuntime[n]={...(state.spotify.chapterRuntime[n]||{}),
   verified:false,status:"FAILED",autoFitResult:"NÃO CONFIRMADO · "+message};
  state.spotify.auditResults=state.spotify.auditResults||{};
  state.spotify.auditResults[n]={status:"FAILED",at:new Date().toISOString(),message};
  if(state.spotify.playlists?.[key])state.spotify.playlists[key].preflightComplete=false;
  save();
  emit(n,"error",message);
  throw Error(HSBooks.unitLabel(BOOK,n)+" não confirmado no Spotify: "+message);
 }
};
spotifySyncChapter=async function(n){
 if(state.activeBookSlug!==BOOK)return original(n);
 const key=BOOK+":"+n;
 if(activeChecks.has(key))return activeChecks.get(key);
 const promise=syncUnwrapped(n);
 activeChecks.set(key,promise);
 try{return await promise}finally{activeChecks.delete(key)}
};
window.HSBookVIQA={
 version:"0.18.2",
 status:n=>state.spotify.chapterRuntime?.[n]||null,
 verified:n=>state.spotify.chapterRuntime?.[n]?.verified===true&&
  state.spotify.chapterRuntime?.[n]?.status==="WITHIN_RANGE"
};
})();