/* Adaptive Spotify runtime. Source-reviewed bridge candidates, never numerical filler.
   Runs when the reader explicitly clicks Check Spotify Runtime / Begin Chapter.
   Keeps the final cue in its authored order; never changes an active session. */
(()=>{
"use strict";
const candidates={
10:[8,["Reaper Chase","Cris Velasco"],"energy bridge"],
11:[5,["The Still, Cold World (Bonus Track)","Piotr Musiał"],"restrained transition"],
12:[4,["Leaving Earth","Clint Mansell"],"reflective transition"],
13:[5,["Surkesh","Christopher Lennertz"],"suspense bridge"],
14:[6,["The Royal Conservatory","Daniel Licht"],"creative atmosphere"],
15:[7,["Reaper Chase","Cris Velasco"],"action bridge"],
16:[5,["I'm Sorry","Cris Velasco"],"quiet tension"],
17:[5,["Surkesh","Christopher Lennertz"],"dialogue bridge"],
18:[4,["A Cerberus Agent","Sam Hulick"],"transition to tension"],
19:[5,["The Scientists","Cris Velasco"],"industrial atmosphere"],
20:[5,["Leaving Earth","Clint Mansell"],"reflective transition"],
21:[7,["I'm Sorry","Cris Velasco"],"emotional transition"],
22:[5,["The Royal Conservatory","Daniel Licht"],"theatrical transition"],
23:[7,["Reaper Chase","Cris Velasco"],"kinetic bridge"],
24:[7,["A Cerberus Agent","Sam Hulick"],"tense action bridge"],
25:[8,["I Was Lost Without You","Sam Hulick"],"reflective bridge"]
};
const alternatives={
10:[["Aralakh Company","Cris Velasco"],["The End Run","Jack Wall"]],
11:[["I Was Lost Without You","Sam Hulick"],["Leaving Earth","Clint Mansell"]],
12:[["I Was Lost Without You","Sam Hulick"],["The Still, Cold World (Bonus Track)","Piotr Musiał"]],
13:[["Prothean Beacon","Cris Velasco"],["The Still, Cold World (Bonus Track)","Piotr Musiał"]],
14:[["Surkesh","Christopher Lennertz"],["The Still, Cold World (Bonus Track)","Piotr Musiał"]],
15:[["Aralakh Company","Cris Velasco"],["The End Run","Jack Wall"]],
16:[["The Still, Cold World (Bonus Track)","Piotr Musiał"],["Prothean Beacon","Cris Velasco"]],
17:[["I Was Lost Without You","Sam Hulick"],["Leaving Earth","Clint Mansell"]],
18:[["Reaper Chase","Cris Velasco"],["Aralakh Company","Cris Velasco"]],
19:[["Prothean Beacon","Cris Velasco"],["Surkesh","Christopher Lennertz"]],
20:[["I Was Lost Without You","Sam Hulick"],["The Still, Cold World (Bonus Track)","Piotr Musiał"]],
21:[["Leaving Earth","Clint Mansell"],["The Still, Cold World (Bonus Track)","Piotr Musiał"]],
22:[["Surkesh","Christopher Lennertz"],["I'm Sorry","Cris Velasco"]],
23:[["The End Run","Jack Wall"],["Aralakh Company","Cris Velasco"]],
24:[["Aralakh Company","Cris Velasco"],["Reaper Chase","Cris Velasco"]],
25:[["Leaving Earth","Clint Mansell"],["The Still, Cold World (Bonus Track)","Piotr Musiał"]]
};

async function liveTracks(id){
 const out=[];
 for(let offset=0;offset<500;offset+=100){
  const page=await spotifyApi("/playlists/"+encodeURIComponent(id)+"/items?limit=100&offset="+offset);
  const entries=page?.items||[];
  for(const e of entries){const t=e?.item||e?.track;if(t?.uri&&Number.isFinite(t.duration_ms))out.push({uri:t.uri,ms:t.duration_ms,title:t.name||""});}
  if(!page?.next||entries.length<100)break;
 }
 return out;
}
function normalizeTitle(s){return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"");}
function cueMatches(t,c){return normalizeTitle(t.title)===normalizeTitle(c[0])||normalizeTitle(t.title).includes(normalizeTitle(c[0]).replace("bonustrack",""));}
function storeActual(n,p,r,tracks){
 r.durationMs=p.durationMs=tracks.reduce((a,t)=>a+t.ms,0);
 r.trackCount=p.trackCount=tracks.length;
 r.finalCueIndex=p.finalCueIndex=tracks.length-1;
}
async function undoBridge(id,n,p,r,tracks){
 const pos=candidates[n]?.[0],score=SCORES[n]||[];
 if(pos==null||tracks.length!==score.length+1||pos>=tracks.length-1)return false;
 if(!tracks.filter((_,i)=>i!==pos).every((t,i)=>cueMatches(t,score[i])))return false;
 const extra=tracks[pos],approved=[candidates[n][1],...(alternatives[n]||[])];
 if(!approved.some(c=>cueMatches(extra,c)))return false;
 await spotifyApi("/playlists/"+encodeURIComponent(id)+"/items",{method:"DELETE",body:JSON.stringify({items:[{uri:extra.uri,positions:[pos]}]})});
 const fresh=await liveTracks(id);
 if(fresh.length!==score.length)throw Error("Spotify não confirmou a remoção");
 storeActual(n,p,r,fresh);
 delete p.autoFitSignature;delete p.autoFitResult;
 r.autoFitResult="Ponte extra removida ("+Math.round(extra.ms/1000)+"s); sequência preservada";
 save();return true;
}

window.HSApprovedBridges=candidates;
const original=spotifySyncChapter;
spotifySyncChapter=async function(n){
 const id=await original(n);
 if(state.activeBookSlug!=="fulgrim")return id;
 const policy=candidates[n],meta=SCORE_META[n],session=state.active;
 if(!policy||!meta||!id)return id;
 const runtime=state.spotify.chapterRuntime?.[n];
 const play=state.spotify.playlists?.["fulgrim:"+n];
 if(!runtime||!play)return id;
 if(session){runtime.autoFitResult="Leitura ativa: trilha preservada";save();return id;}
 const signature=JSON.stringify({score:SCORES[n]||[],policy,options:alternatives[n]||[]});
 let tracks;
 try{tracks=await liveTracks(id);if(!tracks.length)throw Error("playlist vazia");storeActual(n,play,runtime,tracks);if(n===11){runtime.auditTracks=tracks.map((t,i)=>({position:i+1,title:t.title,seconds:Math.round(t.ms/1000)}));runtime.auditTargetMs=Math.round((meta.estimatedMinutes||0)*60000);runtime.auditOrderMatches=tracks.length===(SCORES[n]||[]).length&&tracks.every((t,i)=>cueMatches(t,SCORES[n][i]));}}
 catch(e){runtime.autoFitResult="Falha ao conferir Spotify: "+String(e.message||e);save();return id;}
 const target=Math.round((meta.estimatedMinutes||0)*60000);
 let gap=target-runtime.durationMs;
 let removedExtra=false;
 if(gap < -45000){
  try{if(await undoBridge(id,n,play,runtime,tracks)){removedExtra=true;tracks=await liveTracks(id);gap=target-runtime.durationMs;}}
  catch(e){runtime.autoFitResult="Falha ao remover ponte: "+String(e.message||e);save();return id;}
 }
 if(removedExtra){runtime.autoFitResult+="; novo desvio "+Math.round(gap/1000)+"s (sem reinserir automaticamente)";save();return id;}
 if(gap < -45000){runtime.autoFitResult="Trilha "+Math.round(-gap/1000)+"s longa; sem corte editorial aprovado. Ordem preservada.";if(n===11)runtime.autoFitResult+=" Auditoria das "+tracks.length+" faixas disponível; não remova músicas originais automaticamente.";save();return id;}
 if(Math.abs(gap)<=45000){runtime.autoFitResult="Duração dentro de ±45s do alvo";save();return id;}
 if(play.autoFitSignature===signature){runtime.autoFitResult=play.autoFitResult||"Verificado";save();return id;}
 if(play.autoFitSignature&&play.autoFitSignature!==signature){delete play.autoFitSignature;delete play.autoFitResult;}
 const actual=runtime.durationMs;
 gap=target-actual;
 // Do not pad only to hit a number. A shortfall must be meaningfully large,
 // and the optional cue must match a previously selected narrative bridge.
 if(gap<90000||gap>330000){
  runtime.autoFitResult=gap<=0?"Duração suficiente":"Fora da janela de uma ponte musical";
  return id;
 }
 const [position,track,role]=policy;
 const lastIndex=SCORES[n]?.length-1;
 if(position<1||position>lastIndex){
  runtime.autoFitResult="Sem ponte narrativa aprovada";return id;
 }
 const options=[track,...(alternatives[n]||[])].filter(c=>!SCORES[n].some(x=>x[0]===c[0]&&x[1]===c[1]));
 const candidatesFound=[];
 for(const [title,artist] of options){
  try{
   const uri=await spotifyResolveTrack(title,artist);
   if(!uri?.startsWith("spotify:track:"))continue;
   const trackId=uri.split(":").pop();
   const data=await spotifyApi("/tracks/"+encodeURIComponent(trackId));
   const ms=data?.duration_ms;
   if(!Number.isFinite(ms)||ms<45000||ms>300000)continue;
   const nrm=x=>String(x||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"");
   if(data?.name&&!nrm(data.name).includes(nrm(title).replace("bonustrack","")))continue;
   candidatesFound.push({uri,title,artist,ms,difference:Math.abs(gap-ms)});
  }catch(err){}
 }
 candidatesFound.sort((a,b)=>a.difference-b.difference);
 const chosen=candidatesFound[0];
 if(!chosen||chosen.difference>45000){
  runtime.autoFitResult="Sem ponte aprovada próxima do alvo";
  play.autoFitSignature=signature;play.autoFitResult=runtime.autoFitResult;save();return id;
 }
 if(state.active||state.activeBookSlug!=="fulgrim")return id;
 try{
  await spotifyApi("/playlists/"+encodeURIComponent(id)+"/items",{
   method:"POST",body:JSON.stringify({uris:[chosen.uri],position})
  });
  const verified=await liveTracks(id);
  storeActual(n,play,runtime,verified);

  runtime.autoFitResult="Ponte aplicada: "+chosen.title+" (+"
   +Math.round(chosen.ms/1000)+"s), sem alterar a última faixa";
  play.autoFitSignature=signature;play.autoFitResult=runtime.autoFitResult;
  play.durationMs=runtime.durationMs;play.finalCueIndex=runtime.finalCueIndex;
  play.trackCount=runtime.trackCount;
  save();
 }catch(err){
  runtime.autoFitResult="Ponte não aplicada: "+String(err?.message||err).slice(0,90);
 }

 return id;
};
})();