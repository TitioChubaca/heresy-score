/* Musical QA is distinct from Spotify's URI/duration verification.
   No unverified track can be silently promoted to editorial approval. */
(function(root){"use strict";
function review(tracks){
 if(!Array.isArray(tracks))return {total:0,structurallyAnalyzed:0,fullyListened:0,approved:0,status:"NO_CUES"};
 let analyzed=0,listened=0,approved=0;
 const pending=[];
 for(const cue of tracks){
  const audit=cue?.fullAudioQA||{};
  const analyzedTrack=audit.independentAudioSource===true&&audit.structuralProfile===true;
  const listenedTrack=audit.fullListeningReviewed===true;
  if(analyzedTrack)analyzed++;
  if(listenedTrack)listened++;
  const approvedTrack=analyzedTrack&&listenedTrack&&audit.roleFitApproved===true&&audit.status==="APPROVED";
  if(approvedTrack)approved++;
  else pending.push(cue?.title||"(sem título)");
 }
 return {
  total:tracks.length,structurallyAnalyzed:analyzed,fullyListened:listened,
  approved,pending,
  status:approved===tracks.length&&tracks.length?"EDITORIALLY_APPROVED":"FULL_AUDIO_REVIEW_PENDING",
  explanation:approved===tracks.length&&tracks.length?
   "Todos os trechos foram analisados e escutados; curadoria editorial aprovada.":
   "Tempo/ordem no Spotify não substituem análise do áudio completo nem escuta crítica."
 };
}
root.HSMusicQA=Object.freeze({review,version:"1.0"});
})(window);
