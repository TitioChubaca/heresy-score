/* Book VI Prelude ONLY: exact-URI, fail-closed Spotify audit.
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
 throw Error("Spotify não confirmou a sequência e duração do Prelude após a gravação. Não liberado.");
}
spotifySyncChapter=async function(n){
 if(state.activeBookSlug!==BOOK)return original(n);
 if(n!==1)throw Error("Só o Prelude possui curadoria piloto; unidades futuras continuam protegidas.");
 if(state.active)throw Error("Não alterar a playlist durante uma leitura ativa.");
 const refs=SCORE_META[n]?.recordingReferences;
 if(!Array.isArray(refs)||refs.length!==SCORES[n]?.length||refs.length<3)
  throw Error("Plano musical do Prelude ausente ou incompleto.");
 const key=BOOK+":"+n,signature=JSON.stringify(SCORES[n]),targetMs=Math.round(SCORE_META[n].estimatedMinutes*60000);
 if(!targetMs)throw Error("Tempo de leitura não está definido para o Prelude.");
 try{
  emit(n,"measuring","Conferindo os seis títulos, artistas, URIs e durações reais...");
  const verified=[];
  for(let i=0;i<refs.length;i++){
   if(state.activeBookSlug!==BOOK)throw Error("Livro alterado durante a conferência.");
   const cue=refs[i],id=cue.uri?.split(":")[2];
   if(!/^[A-Za-z0-9]{22}$/.test(id||""))throw Error("URI inválida para "+cue.title);
   const t=await spotifyApi("/tracks/"+encodeURIComponent(id));
   if(t?.uri!==cue.uri||norm(t.name)!==norm(cue.title)||
      !(t.artists||[]).some(a=>norm(a.name)===norm(cue.artist))||
      !Number.isFinite(t.duration_ms)||t.duration_ms<=0)
    throw Error("Gravação indisponível/divergente: "+cue.title+" — "+cue.artist+
      ". Não substituir automaticamente por outra versão.");
   verified.push({uri:t.uri,ms:t.duration_ms,title:t.name,artists:t.artists.map(a=>a.name)});
   emit(n,"measuring","Gravações exatas confirmadas "+(i+1)+"/"+refs.length+".");
  }
  const desired=verified.map(x=>x.uri),actualMs=verified.reduce((sum,x)=>sum+x.ms,0),diff=actualMs-targetMs;
  const positions=[0,.19,.31,.51,.65,.81];
  const plan={slots:refs.map((cue,i)=>({role:cue.role,at:positions[i],required:cue.required,
   anchorWeight:i===0||i===refs.length-1?3:1,
   choices:[{uri:verified[i].uri,role:cue.role,durationMs:verified[i].ms,intensity:cue.intensity}]}))};
  const editorial=window.HSEditorialScore?.fit?.(plan,targetMs);
  if(!editorial?.ok||!same(editorial.uris,desired))
   throw Error("A sequência de papéis musicais obrigatórios falhou na validação editorial. "+
    (editorial?.reason||"Motor narrativo indisponível."));
  if(diff< -45000||diff>60000)throw Error("Prelude fora da meta: "+clock(actualMs)+
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
   emit(n,"writing","Gravando seis músicas na playlist já associada ao Prelude...");
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
  entry.sourceVerifiedBy="0.17.3";
  entry.editorialStatus="PILOT_UNLISTENED";
  entry.lastCorrection=needsWrite?"playlist-updated-and-verified":"existing-playlist-verified";
  state.spotify.chapterRuntime=state.spotify.chapterRuntime||{};
  state.spotify.chapterRuntime[n]={
   verified:true,status:"WITHIN_RANGE",durationMs:measured,targetMs,trackCount:confirmed.length,
   finalCueIndex:confirmed.length-1,verifiedAt:time,sourceSignature:signature,
   auditTracks:confirmed.map((t,i)=>({position:i+1,title:t.title,seconds:Math.round(t.ms/1000)})),
   editorialStatus:"PILOT_FULL_AUDIO_UNVERIFIED",autoFitResult:"PILOTO CONFIRMADO TECNICAMENTE · "+
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
  throw Error("Prelude não confirmado no Spotify: "+message);
 }
};
window.HSBookVIQA={version:"0.17.3",status:()=>state.spotify.chapterRuntime?.[1]||null};
})();