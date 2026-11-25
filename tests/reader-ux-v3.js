/* node tests/reader-ux-v3.js
   Portable UX contract and integration regression — no Spotify or cloud writes. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const src=read("scripts/reader-ux-v3.js");
const w={};
vm.runInNewContext(src,{window:w,document:{querySelector:()=>null,getElementById:()=>null}},{
 filename:"reader-ux-v3.js",timeout:1000
});
assert(w.HSReaderUXModel,"Pure helper model should be available without the DOM");
const model=w.HSReaderUXModel,units=Array.from({length:25},(_,i)=>({number:i+1}));
assert.equal(model.nextUnit(units,{},null),1,"Prelude is the first reading unit");
assert.equal(model.nextUnit(units,{1:{minutes:17},2:{minutes:22},3:{minutes:23}},null),4,
 "Prelude plus chapters 1 and 2 => internal index 4 (Chapter 3)");
assert.equal(model.nextUnit(units,{1:{},2:{},3:{},4:{}},null),5,
 "After Chapter 3 is marked read, internal index 5 must become current");
assert.equal(model.nextUnit(units,{1:{},2:{}},{chapter:2}),2,
 "Active reading must trump the next unread unit");
assert.equal(model.playlistFor("descent-of-angels",5,{
 "descent-of-angels:5":{id:"playlist-chapter4",url:"https://open.spotify.com/playlist/playlist-chapter4"},
 "fulgrim:5":{id:"wrong-book",url:"https://open.spotify.com/playlist/wrong-book"}
}),"https://open.spotify.com/playlist/playlist-chapter4",
 "Opening Spotify must use the selected book and unit, never stale global pointer");
assert.equal(model.playlistFor("descent-of-angels",7,{}),null,
 "Unverified/absent playlists should not invent Spotify URLs");
assert.equal(model.playlistFor("descent-of-angels",5,{
 "descent-of-angels:5":{id:"12345"}
}),"https://open.spotify.com/playlist/12345");
assert.equal(model.issueKeys.length,5,"Five optional issue categories, no mandatory rating");
assert(!model.issueKeys.includes("good"),"Neutral logs must not manufacture positive feedback");

const html=read("index.html"),sw=read("sw.js"),build=read("scripts/app-build.js");
assert(html.includes('<script src="./scripts/reader-ux-v3.js"></script>'),
 "UX module is loaded by the PWA shell");
assert(html.indexOf('src="./scripts/reader-ux-v3.js"')>
 html.indexOf('src="./scripts/bookvi-read-ahead.js"'),
 "UX module is last after the Spotify buffer and deck wrappers");
assert(sw.includes('"./scripts/reader-ux-v3.js"'),"UX module must be available offline");
const currentBuild=(build.match(/version:"([^"]+)"/)||[])[1];
assert(currentBuild,"Application must declare a release version");
assert(sw.includes('const CACHE="heresy-score-v'+currentBuild.replace(/\./g,"")+'"'));
assert(/^0\.\d+\.\d+$/.test(currentBuild),"Version uses semver patch convention");
assert(src.includes('hs-open-spotify')&&src.includes('window.open(href,"_blank","noopener")'),
 "Chapter card must offer direct playlist access inside an immediate click handler");
assert(src.includes('controls.append(spotify,finish)'),
 "Spotify and Conclude buttons must stay in the player controls");
assert(src.includes('originalOpen(n)')&&src.includes('originalSave?.apply(this,args)'),
 "Existing log edit and persistence pathways must be preserved");
assert(src.includes('laterBtn.onclick')&&src.includes('saveBtn.onclick?.call(saveBtn)'),
 "No-comment option must use normal archive and cloud push path");
assert(src.includes('feedbackIssues')&&src.includes('advanced.open=false'),
 "Structured optional issues persist and detailed ratings stay collapsed");
assert(!src.includes("localStorage.clear("),"Never reset historical user data");
assert(!src.includes("state.done={}"),"Never wipe read chapters");
console.log("PASS reading-first UI helper logic, book-scoped Spotify links, neutral logs, PWA wiring and privacy guardrails.");
