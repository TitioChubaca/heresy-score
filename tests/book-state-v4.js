/* node tests/book-state-v4.js
   No network or user data; verifies non-destructive migration + Book VI. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const load=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const ctx={window:{}};vm.runInNewContext(load("scripts/book-state.js"),ctx);
const HS=ctx.window.HSBooks;
assert.equal(HS.VERSION,4);
assert.equal(HS.VI,"descent-of-angels");
const prior={activeBookSlug:"fulgrim",
 done:{"1":{minutes:25},"25":{minutes:27,notes:"book V history"}},
 books:{"fulgrim":{done:{"1":{minutes:25},"25":{minutes:27,notes:"book V history"}}},
 "flight-of-the-eisenstein":{done:{"1":{minutes:39}}}},
 spotify:{playlists:{"fulgrim:25":{id:"valid-private-playlist"}},
 chapterRuntime:{"25":{durationMs:1620000}},
 auditResults:{"25":{status:"VERIFIED"}},
 scoreDurations:{"25":1620000},accessToken:"session-private"}
};
let state=HS.migrate(JSON.parse(JSON.stringify(prior)));
const original=JSON.stringify(state.books.fulgrim.done);
HS.switchBook(state,HS.VI);
assert.equal(state.activeBookSlug,HS.VI);
assert.equal(Object.keys(state.done).length,0);
assert.equal(state.books[HS.VI].chapterCount,25);
assert.equal(state.spotify.accessToken,"session-private","OAuth credentials remain global");
HS.switchBook(state,HS.IV);
assert.equal(state.done[1].minutes,39);
HS.switchBook(state,HS.V);
assert.equal(JSON.stringify(state.done),original);
assert.equal(state.spotify.chapterRuntime[25].durationMs,1620000);
assert.equal(state.spotify.auditResults[25].status,"VERIFIED");
assert.equal(state.spotify.playlists["fulgrim:25"].id,"valid-private-playlist");
assert.throws(()=>HS.switchBook({...state,active:{chapter:25}},HS.VI),/Finish or cancel/);
const parsed={window:{}};
vm.runInNewContext(load("data/descent-of-angels.js"),parsed);
const d=parsed.window.HS_DESCENT_DATA;
assert.equal(d.chapters.length,25);
assert.equal(d.chapters[0].unitId,"prelude");
assert.equal(d.chapters[0].number,1);
assert.equal(d.chapters[1].unitId,"ch01");
assert.equal(d.chapters[23].unitId,"ch23");
assert.equal(d.chapters[24].unitId,"aftermath");
assert.equal(d.chapters[24].number,25);
assert.equal(d.chapters[24].wordCountApprox,446);
assert.equal(Object.keys(d.scores).join(","),"1,2,3","Exactly the three near-term Book VI units may have soundtrack pilots");
assert.equal(d.scores[1].length,6,"Prelude must contain its six original verified public track references");
assert.equal(d.scores[2].length,8,"Book VI Chapter 1 must contain eight cues");
assert.equal(d.scores[3].length,8,"Book VI Chapter 2 must contain eight cues");
for(let unit=4;unit<=25;unit++)assert.equal(d.scores[unit],undefined,"Future reading unit "+unit+" must remain uncurated");
for(let n=1;n<=3;n++)assert.equal(d.scoreMeta[n].editorialStatus,"PILOT_FULL_AUDIO_UNVERIFIED");
assert.equal(d.people.length,0,"No Book VI characters accidentally spoiled");
assert.equal(d.archive.length,0,"No future locations prematurely released");
console.log("PASS IV->V->VI migration, Spotify audit isolation, completed logs and 25 Book VI units.");
