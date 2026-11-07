/* Fallback if one OST recording cannot be resolved in the user's Spotify market.
   The main synced score remains unchanged unless Spotify explicitly rejects a track. */
(()=>{
"use strict";
const normalSync=spotifySyncChapter;
spotifySyncChapter=async function(chapter){
 try{return await normalSync(chapter)}
 catch(initialError){
  if(!/track not found/i.test(String(initialError?.message||initialError)))throw initialError;
  const slug=state.activeBookSlug||HSBooks.IV,score=SCORES[chapter]||[];
  const p=await spotifyEnsurePlaylist(chapter),uris=[],missingTracks=[];
  for(const [title,artist] of score){
   if(state.activeBookSlug!==slug)throw new Error("Livro alterado durante o preparo do Spotify");
   try{const uri=await spotifyResolveTrack(title,artist);if(uri)uris.push(uri);else missingTracks.push(title)}
   catch(err){missingTracks.push(title)}
  }
  if(!uris.length)throw initialError;
  if(state.activeBookSlug!==slug)throw new Error("Livro alterado durante o preparo do Spotify");
  await spotifyApi("/playlists/"+p.id+"/items",{method:"PUT",body:JSON.stringify({uris})});
  let durationMs=0;
  try{
   for(const uri of uris){
    const track=await spotifyApi("/tracks/"+encodeURIComponent(String(uri).split(":").pop()));
    durationMs+=Number(track?.duration_ms)||0;
   }
  }catch(err){}
  state.spotify.playlistId=p.id;
  state.spotify.playlistUrl="https://open.spotify.com/playlist/"+p.id;
  state.spotify.chapterRuntime=state.spotify.chapterRuntime||{};
  state.spotify.chapterRuntime[chapter]={durationMs:durationMs||null,targetMs:(SCORE_META[chapter]?.estimatedMinutes||0)*60000,finalCueIndex:uris.length-1,trackCount:uris.length,missingTracks,partial:true};
  save();
  toast("Trilha preparada: "+uris.length+" faixas. "+missingTracks.length+" não disponíveis no catálogo.");
  return p.id;
 }
};
})();