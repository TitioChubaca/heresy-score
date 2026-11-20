/* node tests/music-quality-gate.js
   Metadata-only workflow; never downloads streaming audio. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const src=fs.readFileSync(path.join(__dirname,"../scripts/music-quality-gate.js"),"utf8");
const ctx={window:{}};
vm.runInNewContext(src,ctx);
const qa=ctx.window.HSMusicQA;
const unreviewed=[{title:"Majula"},{title:"Catacombs"},{title:"Roundtable Hold"}];
const basic=qa.review(unreviewed);
assert.equal(basic.total,3);
assert.equal(basic.structurallyAnalyzed,0);
assert.equal(basic.fullyListened,0);
assert.equal(basic.approved,0);
assert.equal(basic.status,"FULL_AUDIO_REVIEW_PENDING");
const half=qa.review([{
 title:"Majula",fullAudioQA:{
  independentAudioSource:true,structuralProfile:true,fullListeningReviewed:false,
  roleFitApproved:false,status:"PROFILED"
 }
}]);
assert.equal(half.structurallyAnalyzed,1);
assert.equal(half.approved,0,"Waveform scan alone must never imply approval");
const dishonest=qa.review([{
 title:"Unverified source",fullAudioQA:{
  independentAudioSource:false,structuralProfile:true,
  fullListeningReviewed:true,roleFitApproved:true,status:"APPROVED"
 }
}]);
assert.equal(dishonest.approved,0,"Streaming metadata must not imply authorized full-audio analysis");
const good=qa.review([{
 title:"Reviewed",fullAudioQA:{independentAudioSource:true,structuralProfile:true,
  fullListeningReviewed:true,roleFitApproved:true,status:"APPROVED"}
}]);
assert.equal(good.approved,1);
assert.equal(good.status,"EDITORIALLY_APPROVED");
console.log("PASS independent audio scanning, listening, and role approval gates.");
