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
 if(session){runtime.autoFitResult="Leitura ativa: trilha preservada";return id;}
 const signature=JSON.stringify(SCORES[n]||[]);
 if(play.autoFitSignature===signature){
  runtime.autoFitResult=play.autoFitResult||"Verificado";return id;
 }
 if(play.autoFitSignature&&play.autoFitSignature!==signature){
  delete play.autoFitSignature;delete play.autoFitResult;
 }
 const target=Math.round((meta.estimatedMinutes||0)*60000);
 const actual=runtime.durationMs;
 if(!Number.isFinite(target)||!target||!Number.isFinite(actual)||!actual)return id;
 const gap=target-actual;
 // Do not pad only to hit a number. A shortfall must be meaningfully large,
 // and the optional cue must match a previously selected narrative bridge.
 if(gap<90000||gap>330000){
  runtime.autoFitResult=gap<=0?"Duração suficiente":"Fora da janela de uma ponte musical";
  return id;
 }
 const [position,track,role]=policy;
 const beforeFinal=SCORES[n]?.length-1;
 if(position<1||position>beforeFinal||SCORES[n].some(c=>c[0]===track[0]&&c[1]===track[1])){
  runtime.autoFitResult="Sem ponte extra aprovada";return id;
 }
 try{
  const uri=await spotifyResolveTrack(track[0],track[1]);
  if(!uri?.startsWith("spotify:track:"))throw Error("faixa não encontrada");
  const trackId=uri.split(":").pop();
  const info=await spotifyApi("/tracks/"+encodeURIComponent(trackId));
  const sec=info?.duration_ms;
  if(!Number.isFinite(sec)||sec<45000||sec>300000)throw Error("duração da ponte indisponível");
  // Allow up to 45 seconds overshoot; do not add an unrelated long song.
  if(Math.abs(gap-sec)>45000){
   runtime.autoFitResult="Não há ponte aprovada com duração próxima";return id;
  }
  if(state.active||state.activeBookSlug!=="fulgrim")return id;
  await spotifyApi("/playlists/"+encodeURIComponent(id)+"/items",{
   method:"POST",body:JSON.stringify({uris:[uri],position})
  });
  runtime.durationMs+=sec;
  runtime.trackCount=(runtime.trackCount||SCORES[n].length)+1;
  if((runtime.finalCueIndex??beforeFinal)>=position)runtime.finalCueIndex++;
  runtime.autoFitResult="Ponte inserida no trecho "+(position+1)+" · +"+Math.round(sec/1000)+"s";
  play.autoFitSignature=signature;
  play.autoFitResult=runtime.autoFitResult;
  play.durationMs=runtime.durationMs;
  play.finalCueIndex=runtime.finalCueIndex;
  play.trackCount=runtime.trackCount;
  save();
 }catch(err){
  runtime.autoFitResult="Ponte não aplicada: "+String(err?.message||err).slice(0,100);
 }
 return id;
};
})();