/* Run via node tests/descent-full-book-v1.js */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const ctx={window:{},console};vm.runInNewContext(read("data/descent-of-angels.js"),ctx);
const early=JSON.stringify(ctx.window.HS_DESCENT_DATA.scores);
vm.runInNewContext(read("data/descent-of-angels-future-scores.js"),ctx);
vm.runInNewContext(read("data/descent-next-scene-review.js"),ctx);
const d=ctx.window.HS_DESCENT_DATA,full=ctx.window.HSBookVIFullDraft;
assert.equal(d.chapters.length,25);
assert.equal(Object.keys(d.scores).length,25);
assert.equal(JSON.stringify(Object.fromEntries(Array.from({length:6},(_,i)=>[i+1,d.scores[i+1]]))),early);
assert.equal(full.catalogRecords>=50,true,"Verified official catalogs must offer a meaningful choice");
const supported=new Set(["atmosphere","dialogue","suspense","action","aftermath","closing","transition"]);
let total=0;
for(let n=7;n<=25;n++){
 const unit=d.scoreMeta[n],refs=unit.recordingReferences;
 assert.equal(unit.editorialStatus,n<=9?"SCENE_MAPPED_AUDIO_UNVERIFIED":
 "PREPLANNED_FULL_AUDIO_UNVERIFIED","No plan is audio-approved");
 if(n<=9)assert(unit.sceneReview?.reviewed,"Upcoming units grounded in actual source passages");
 else assert(!unit.sceneReview?.reviewed,"Future catalog drafts must not pass the source gate");
 assert(refs.length>=1&&refs.length<=18,"Reasonable cue count "+n);
 assert.equal(refs.length,d.scores[n].length);
 assert.equal(unit.editorialPositions.length,refs.length);
 assert(unit.editorialPositions.every((v,i)=>v>=0&&v<=1&&(i===0||v>=unit.editorialPositions[i-1])));
 assert(refs.every(r=>supported.has(r.role)&&r.fullAudioQA.status==="NOT_ANALYZED"));
 assert.equal(new Set(refs.map(r=>r.title+"|"+r.artist)).size,refs.length,"No duplicate recording inside chapter "+n);
 const totalSec=refs.reduce((s,r)=>s+r.durationApproxSeconds,0),target=Math.round(unit.estimatedMinutes*60);
 const difference=totalSec-target;
 assert(difference>=-45&&difference<=60,"Unit "+n+" catalog duration drift "+difference+" sec; re-curate");
 assert.equal(unit.stage,n<=9?"SCENE_MAPPED_SPOTIFY_PENDING":"CATALOG_PREPLANNED_SPOTIFY_PENDING");
 total+=refs.length;
}
assert.equal(d.scoreMeta[25].recordingReferences.length,1,"Aftermath must not be padded with extra tracks");
assert.equal(d.chapters[24].unitId,"aftermath");
assert(full.ranges[7].count>10&&full.ranges[25].count===1);
assert.equal(ctx.window.HSBookVINextSceneReview.units.join(","),"7,8,9");
assert(!read("data/descent-of-angels-future-scores.js").includes("Zahariel"),
 "Private narrative people and future story beats must not leak into public cue code");
assert(read("styles/themes/horus-heresy.css").includes('data-hs-ui-series="warhammer-30k"'));
const sw=read("sw.js"),html=read("index.html");
assert(sw.includes('"./data/descent-of-angels-future-scores.js"'));
assert(sw.includes('"./data/descent-next-scene-review.js"'));
assert(sw.includes('"./styles/themes/horus-heresy.css"'));
assert(html.indexOf('src="./data/descent-of-angels-future-scores.js"')>
 html.indexOf('src="./data/descent-of-angels.js"'));
assert(html.indexOf('src="./data/descent-of-angels-future-scores.js"')<
 html.indexOf('src="./scripts/book-switch.js"'));
assert(/version:"0\.18\.2"/.test(read("scripts/app-build.js")));
assert(sw.includes('const CACHE="heresy-score-v0182"'));
console.log("PASS full 25 unit music-only draft ("+total+" new cues), timing budgets, soundtrack metadata, privacy and isolated Warhammer UI theme.");
