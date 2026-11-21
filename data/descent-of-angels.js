/* Book VI: Descent of Angels — reader-safe structural registry.
   PRIVATE novel text and future scene maps are NOT shipped.
   Prelude and Chapters 1–2 have unlistened PILOT soundtracks. Other units remain uncurated. No Spotify playlist may be labeled confirmed without authenticated read-back. */
(()=>{"use strict";
const chapters=[
  {
    "number": 1,
    "unitId": "prelude",
    "sequenceIndex": 1,
    "type": "prelude",
    "title": "PRELUDE",
    "wordCountApprox": 3238,
    "estimatedMinutes": 16.4,
    "startCue": null
  },
  {
    "number": 2,
    "unitId": "ch01",
    "sequenceIndex": 2,
    "type": "chapter",
    "title": "CHAPTER 01",
    "wordCountApprox": 4365,
    "estimatedMinutes": 22.2,
    "startCue": null
  },
  {
    "number": 3,
    "unitId": "ch02",
    "sequenceIndex": 3,
    "type": "chapter",
    "title": "CHAPTER 02",
    "wordCountApprox": 4498,
    "estimatedMinutes": 22.8,
    "startCue": null
  },
  {
    "number": 4,
    "unitId": "ch03",
    "sequenceIndex": 4,
    "type": "chapter",
    "title": "CHAPTER 03",
    "wordCountApprox": 4956,
    "estimatedMinutes": 25.2,
    "startCue": null
  },
  {
    "number": 5,
    "unitId": "ch04",
    "sequenceIndex": 5,
    "type": "chapter",
    "title": "CHAPTER 04",
    "wordCountApprox": 2295,
    "estimatedMinutes": 11.6,
    "startCue": null
  },
  {
    "number": 6,
    "unitId": "ch05",
    "sequenceIndex": 6,
    "type": "chapter",
    "title": "CHAPTER 05",
    "wordCountApprox": 5058,
    "estimatedMinutes": 25.7,
    "startCue": null
  },
  {
    "number": 7,
    "unitId": "ch06",
    "sequenceIndex": 7,
    "type": "chapter",
    "title": "CHAPTER 06",
    "wordCountApprox": 7729,
    "estimatedMinutes": 39.2,
    "startCue": null
  },
  {
    "number": 8,
    "unitId": "ch07",
    "sequenceIndex": 8,
    "type": "chapter",
    "title": "CHAPTER 07",
    "wordCountApprox": 4545,
    "estimatedMinutes": 23.1,
    "startCue": null
  },
  {
    "number": 9,
    "unitId": "ch08",
    "sequenceIndex": 9,
    "type": "chapter",
    "title": "CHAPTER 08",
    "wordCountApprox": 2904,
    "estimatedMinutes": 14.7,
    "startCue": null
  },
  {
    "number": 10,
    "unitId": "ch09",
    "sequenceIndex": 10,
    "type": "chapter",
    "title": "CHAPTER 09",
    "wordCountApprox": 6486,
    "estimatedMinutes": 32.9,
    "startCue": null
  },
  {
    "number": 11,
    "unitId": "ch10",
    "sequenceIndex": 11,
    "type": "chapter",
    "title": "CHAPTER 10",
    "wordCountApprox": 3926,
    "estimatedMinutes": 19.9,
    "startCue": null
  },
  {
    "number": 12,
    "unitId": "ch11",
    "sequenceIndex": 12,
    "type": "chapter",
    "title": "CHAPTER 11",
    "wordCountApprox": 3541,
    "estimatedMinutes": 18,
    "startCue": null
  },
  {
    "number": 13,
    "unitId": "ch12",
    "sequenceIndex": 13,
    "type": "chapter",
    "title": "CHAPTER 12",
    "wordCountApprox": 3778,
    "estimatedMinutes": 19.2,
    "startCue": null
  },
  {
    "number": 14,
    "unitId": "ch13",
    "sequenceIndex": 14,
    "type": "chapter",
    "title": "CHAPTER 13",
    "wordCountApprox": 2991,
    "estimatedMinutes": 15.2,
    "startCue": null
  },
  {
    "number": 15,
    "unitId": "ch14",
    "sequenceIndex": 15,
    "type": "chapter",
    "title": "CHAPTER 14",
    "wordCountApprox": 4695,
    "estimatedMinutes": 23.8,
    "startCue": null
  },
  {
    "number": 16,
    "unitId": "ch15",
    "sequenceIndex": 16,
    "type": "chapter",
    "title": "CHAPTER 15",
    "wordCountApprox": 4954,
    "estimatedMinutes": 25.1,
    "startCue": null
  },
  {
    "number": 17,
    "unitId": "ch16",
    "sequenceIndex": 17,
    "type": "chapter",
    "title": "CHAPTER 16",
    "wordCountApprox": 4060,
    "estimatedMinutes": 20.6,
    "startCue": null
  },
  {
    "number": 18,
    "unitId": "ch17",
    "sequenceIndex": 18,
    "type": "chapter",
    "title": "CHAPTER 17",
    "wordCountApprox": 4413,
    "estimatedMinutes": 22.4,
    "startCue": null
  },
  {
    "number": 19,
    "unitId": "ch18",
    "sequenceIndex": 19,
    "type": "chapter",
    "title": "CHAPTER 18",
    "wordCountApprox": 6476,
    "estimatedMinutes": 32.9,
    "startCue": null
  },
  {
    "number": 20,
    "unitId": "ch19",
    "sequenceIndex": 20,
    "type": "chapter",
    "title": "CHAPTER 19",
    "wordCountApprox": 3542,
    "estimatedMinutes": 18,
    "startCue": null
  },
  {
    "number": 21,
    "unitId": "ch20",
    "sequenceIndex": 21,
    "type": "chapter",
    "title": "CHAPTER 20",
    "wordCountApprox": 5173,
    "estimatedMinutes": 26.3,
    "startCue": null
  },
  {
    "number": 22,
    "unitId": "ch21",
    "sequenceIndex": 22,
    "type": "chapter",
    "title": "CHAPTER 21",
    "wordCountApprox": 4130,
    "estimatedMinutes": 21,
    "startCue": null
  },
  {
    "number": 23,
    "unitId": "ch22",
    "sequenceIndex": 23,
    "type": "chapter",
    "title": "CHAPTER 22",
    "wordCountApprox": 4385,
    "estimatedMinutes": 22.3,
    "startCue": null
  },
  {
    "number": 24,
    "unitId": "ch23",
    "sequenceIndex": 24,
    "type": "chapter",
    "title": "CHAPTER 23",
    "wordCountApprox": 3657,
    "estimatedMinutes": 18.6,
    "startCue": null
  },
  {
    "number": 25,
    "unitId": "aftermath",
    "sequenceIndex": 25,
    "type": "aftermath",
    "title": "AFTERMATH",
    "wordCountApprox": 446,
    "estimatedMinutes": 2.3,
    "startCue": null
  }
];
const scoreMeta=Object.fromEntries(chapters.map(u=>[u.number,{
 readingUnitId:u.unitId,sequenceIndex:u.sequenceIndex,kind:u.type,
 readingEstimateMinutes:u.estimatedMinutes,estimatedMinutes:null,
 stage:"EDITORIAL_CURATION_PENDING",spotifyRuntimeStatus:"not-audited"
}]));

/* PRELUDE ONLY. Reader has not started Book VI.
   Six publicly verifiable OST recordings, no future novel plot terms.
   Editorial sequence is a first-pass PILOT, not a listened/approved mix.
   The exact Spotify URIs are verified on public track pages; the app MUST
   confirm recording metadata/duration with the user's authenticated API. */
const preludeCues=[
 {uri:"spotify:track:0VezF1gAZbBHitiRlVnxlr",title:"Majula",artist:"Motoi Sakuraba",role:"atmosphere",durationApproxSeconds:198,intensity:1,required:true},
 {uri:"spotify:track:3jOjqaqG7Of1gb8eoFjWk5",title:"Catacombs",artist:"Yuka Kitamura",role:"suspense",durationApproxSeconds:113,intensity:2,required:true},
 {uri:"spotify:track:4PpMIuuZUBU34wnRw2Fk0y",title:"Leyndell, Royal Capital",artist:"Yuka Kitamura",role:"transition",durationApproxSeconds:197,intensity:3,required:true},
 {uri:"spotify:track:2upZ542q9ScxpYFnvLRf6O",title:"Roundtable Hold",artist:"Tsukasa Saitoh",role:"dialogue",durationApproxSeconds:141,intensity:2,required:true},
 {uri:"spotify:track:1lNlOXH1goSj2dRBPUCzrg",title:"Fire Keepers",artist:"Motoi Sakuraba",role:"aftermath",durationApproxSeconds:163,intensity:1,required:true},
 {uri:"spotify:track:0oLK0KuDVLT3JVDpQQLHOT",title:"Firelink Shrine",artist:"Yuka Kitamura",role:"closing",durationApproxSeconds:186,intensity:2,required:true}
];
const preludeTargetMinutes=3238/197;
const score={1:preludeCues.map(c=>[c.title,c.artist])};
scoreMeta[1]={
 ...scoreMeta[1],estimatedMinutes:preludeTargetMinutes,baseEstimatedMinutes:preludeTargetMinutes,
 startCue:preludeCues[0].title,finalCueIndex:preludeCues.length-1,
 editorialStatus:"PILOT_FULL_AUDIO_UNVERIFIED",stage:"PILOT_EXACT_URI_PENDING_DEVICE_QA",
 recordingReferences:preludeCues.map(({uri,title,artist,role,intensity,required,durationApproxSeconds})=>
  ({uri,title,artist,role,intensity,required,durationApproxSeconds,
   fullAudioQA:{status:"NOT_ANALYZED",independentAudioSource:false,
    structuralProfile:false,fullListeningReviewed:false,roleFitApproved:false}})),
 scoreSource:"private reader-supplied MOBI, no plot information in public metadata",
 playbackPolicy:"do-not-start-until-exact-Spotify-readback"
};
chapters[0].startCue=preludeCues[0].title;
chapters[0].estimatedMinutes=preludeTargetMinutes;
// Early-book three-unit buffer: source chapter ONE and TWO were reviewed
// privately. Only generic MUSIC ROLES are public; no story beats, future
// characters or events are serialized into the PWA.
// Public reference timings from the original Elden Ring OST album, not
// authenticated Spotify metadata and NOT full-track listening approval.
// For records without a prior verified track ID, the runtime must resolve
// title+artist against Spotify, GET the exact recording and fail closed on
// any mismatch. NEVER invent a URI to satisfy a timing target.
const earlyScorePlans=[
 {number:2,wordCount:4365,cues:[
  ["Caves","Yoshimi Kudo","suspense",170,2],
  ["Tunnels","Yuka Kitamura","suspense",139,2],
  ["Roundtable Hold","Tsukasa Saitoh","dialogue",141,1],
  ["Old Castle","Yoshimi Kudo","atmosphere",236,2],
  ["Eternal City","Yuka Kitamura","suspense",208,3],
  ["Academy of Raya Lucaria","Yuka Kitamura","dialogue",118,2],
  ["Divine Tower","Yuka Kitamura","transition",174,2],
  ["Stormveil Castle","Tai Tomisawa","closing",132,2]
 ]},
 {number:3,wordCount:4498,cues:[
  ["Limgrave","Tsukasa Saitoh","atmosphere",191,1],
  ["Character Creation","Shoi Miyazawa","transition",165,2],
  ["Liurnia of the Lakes","Yoshimi Kudo","dialogue",180,1],
  ["Great Underground Rivers","Yuka Kitamura","dialogue",159,1],
  ["Academy of Raya Lucaria","Yuka Kitamura","suspense",118,2],
  ["Eternal City","Yuka Kitamura","transition",208,2],
  ["Altus Plateau","Shoi Miyazawa","atmosphere",177,2],
  ["Divine Tower","Yuka Kitamura","closing",174,2]
 ]}
];
for(const item of earlyScorePlans){
 const cues=item.cues.map(([title,artist,role,durationApproxSeconds,intensity])=>({
  uri:null,title,artist,role,durationApproxSeconds,intensity,required:true,
  fullAudioQA:{status:"NOT_ANALYZED",independentAudioSource:false,
    structuralProfile:false,fullListeningReviewed:false,roleFitApproved:false}
 }));
 const n=item.number,estimatedMinutes=item.wordCount/197;
 score[n]=cues.map(c=>[c.title,c.artist]);
 scoreMeta[n]={...scoreMeta[n],estimatedMinutes,baseEstimatedMinutes:estimatedMinutes,
  startCue:cues[0].title,finalCueIndex:cues.length-1,
  // Relative passage boundaries from private editorial structure,
  // published as generic numeric markers with NO plot references.
  editorialPositions:n===2?[0,.12,.23,.34,.51,.67,.78,.91]:
                    [0,.13,.28,.39,.51,.61,.77,.87],
  editorialStatus:"PILOT_FULL_AUDIO_UNVERIFIED",
  stage:"PILOT_SPOTIFY_URI_RESOLUTION_PENDING",
  recordingReferences:cues,
  scoreSource:"Private reader-supplied MOBI; public album metadata for recording candidates",
  playbackPolicy:"verify-exact-spotify-metadata-and-sequence-before-reading"
 };
 chapters[n-1].startCue=cues[0].title;
 chapters[n-1].estimatedMinutes=estimatedMinutes;
}

window.HS_DESCENT_DATA={
 slug:"descent-of-angels",title:"Descent of Angels",chapterCount:25,
 partsCount:4,source:"reader-provided MOBI",sourceVerified:"structure-only",
 chapters,scores:score,scoreMeta,people:[],archive:[]
};
})();