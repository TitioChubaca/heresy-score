/* Book VI: Descent of Angels — reader-safe structural registry.
   PRIVATE novel text and future scene maps are NOT shipped.
   Only Prelude has a PILOT soundtrack. Other units remain uncurated. No Spotify playlist may be labeled confirmed without authenticated read-back. */
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
window.HS_DESCENT_DATA={
 slug:"descent-of-angels",title:"Descent of Angels",chapterCount:25,
 partsCount:4,source:"reader-provided MOBI",sourceVerified:"structure-only",
 chapters,scores:score,scoreMeta,people:[],archive:[]
};
})();