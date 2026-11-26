/* Descent of Angels — reader-private source review for next 3 units (7–9).
   These indices correspond to narrative Chapters 6, 7 and 8.
   Source chapters were re-read from the reader's provided MOBI 25/11.
   Public code contains music data/abstract roles ONLY; NO story events,
   characters, places, prose, extracts or private scene-map descriptions.
   Exact Spotify identity and full-audio listening remain UNVERIFIED. */
(()=>{
"use strict";
const data=window.HS_DESCENT_DATA;
if(!data||data.slug!=="descent-of-angels")return;
const HK="Christopher Larkin";
const musical=[
 {n:7,roles:[
  ["Roundtable Hold","Tsukasa Saitoh",141,"atmosphere",1],
  ["Mantis Lords",HK,105,"action",4],
  ["The White Lady",HK,79,"aftermath",1],
  ["Old Castle","Yoshimi Kudo",236,"atmosphere",2],
  ["Liurnia of the Lakes","Yoshimi Kudo",180,"dialogue",1],
  ["Great Underground Rivers","Yuka Kitamura",159,"dialogue",1],
  ["Divine Tower","Yuka Kitamura",174,"suspense",2],
  ["Eternal City","Yuka Kitamura",208,"suspense",2],
  ["Crystal Peak",HK,248,"transition",2],
  ["Dirtmouth",HK,115,"dialogue",1],
  ["Resting Grounds",HK,132,"aftermath",1],
  ["Queen's Gardens",HK,106,"aftermath",1],
  ["Academy of Raya Lucaria","Yuka Kitamura",118,"dialogue",2],
  ["Nosk",HK,110,"suspense",3],
  ["Tunnels","Yuka Kitamura",139,"suspense",2],
  ["Hollow Knight",HK,96,"closing",2]
 ]},
 {n:8,roles:[
  ["Limgrave","Tsukasa Saitoh",191,"atmosphere",1],
  ["Tunnels","Yuka Kitamura",139,"suspense",2],
  ["Caves","Yoshimi Kudo",170,"atmosphere",2],
  ["Mt. Gelmir","Yoshimi Kudo",164,"suspense",2],
  ["Subterranean Shunning-Grounds","Shoi Miyazawa",150,"suspense",2],
  ["Consecrated Snowfield","Yoshimi Kudo",157,"atmosphere",1],
  ["Prison Town","Yoshimi Kudo",159,"dialogue",2],
  ["Nosk",HK,110,"suspense",3],
  ["Formidable Foe I","Yuka Kitamura",147,"action",4]
 ]},
 {n:9,roles:[
  ["Erdtree Knights","Tai Tomisawa",167,"action",4],
  ["Old Warriors","Yoshimi Kudo",114,"action",4],
  ["Nosk",HK,110,"suspense",3],
  ["Decisive Battle",HK,125,"action",4],
  ["Hornet",HK,166,"action",4],
  ["Broken Vessel",HK,119,"aftermath",2],
  ["Reflection",HK,99,"closing",1]
 ]}
];
const reviewMark="SCENE_MAPPED_AUDIO_UNVERIFIED";
for(const {n,roles} of musical){
 const score=data.scores, meta=data.scoreMeta, chapter=data.chapters[n-1];
 const total=roles.reduce((sum,t)=>sum+t[2],0);
 const target=Math.round(chapter.wordCountApprox/197*60);
 if(Math.abs(total-target)>45)throw Error("Scene-map length outside tolerance for unit "+n);
 const starts=[];let elapsed=0;
 const cues=roles.map(([title,artist,seconds,role,intensity])=>{
  starts.push(Math.round(elapsed/total*1000)/1000);elapsed+=seconds;
  return {uri:null,title,artist,role,durationApproxSeconds:seconds,
   intensity,required:true,fullAudioQA:{
    status:"NOT_ANALYZED",independentAudioSource:false,structuralProfile:false,
    fullListeningReviewed:false,roleFitApproved:false
   }};
 });
 score[n]=cues.map(c=>[c.title,c.artist]);
 meta[n]={...meta[n],estimatedMinutes:chapter.wordCountApprox/197,
  baseEstimatedMinutes:chapter.wordCountApprox/197,
  startCue:cues[0].title,finalCueIndex:cues.length-1,
  editorialPositions:starts,recordingReferences:cues,
  catalogDurationApproxSeconds:total,
  editorialStatus:reviewMark,
  stage:"SCENE_MAPPED_SPOTIFY_PENDING",
  sceneReview:{reviewed:true,method:"reader_supplied_mobi_private_passages",
   musicRolesReviewed:true,fullAudioReviewed:false,
   recordingIdentityVerified:false},
  playbackPolicy:"strict-track-identity-time-and-sequence;no-human-audio-approval"
 };
 chapter.startCue=cues[0].title;
 chapter.estimatedMinutes=chapter.wordCountApprox/197;
 const old=window.HSBookVIFullDraft?.ranges?.[n];
 if(old){old.count=cues.length;old.approximateSeconds=total;old.stage="SCENE_MAPPED_SPOTIFY_PENDING";}
}
window.HSBookVINextSceneReview=Object.freeze({
 version:"0.18.2",units:[7,8,9],
 status:reviewMark,fullAudioReviewed:false
});
})();