/* Run: node tests/spotify-audit-ui-consistency.js
   Regression of the exact stale-target/stale-directive screenshot from 16 Nov.
   Does not access real Spotify or reader state. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const html=read("index.html");
const begin=html.indexOf(" const scoreMeta=SCORE_META[c.number];");
const end=html.indexOf(" a.className=\"chapter \"+st;",begin);
assert(begin>0&&end>begin,"Chapter card should derive target and badge from current state");
const derive=new Function("state","SCORE_META","HSBooks","window","c","st",
 html.slice(begin,end)+"return {targetClock,verified,cardTag,estimate,calibrated};");
const state={activeBookSlug:"fulgrim"};
const HSBooks={V:"fulgrim"};
const meta={22:{estimatedMinutes:26.2,baseEstimatedMinutes:27.1}};
const live={HSScoreReadiness:{spotifyPrepared:n=>n===22}};
const view=derive(state,meta,HSBooks,live,{number:22,estimatedMinutes:27.1},"ready");
assert.deepEqual(view,{targetClock:"26:12",verified:true,cardTag:"SPOTIFY OK",estimate:26.2,calibrated:true},
 "The card must no longer display 27.1 minutes or READY after a 26:12 verified audit.");
// Reload: SCORE_META resets to 27.1 but the verified target of 26:12 persists.
const persisted={activeBookSlug:"fulgrim",spotify:{chapterRuntime:{22:{verified:true,status:"WITHIN_RANGE",targetMs:1572000}}}};
const reread=derive(persisted,{22:{estimatedMinutes:27.1}},HSBooks,live,
 {number:22,estimatedMinutes:27.1},"ready");
assert.deepEqual(reread,{targetClock:"26:12",verified:true,cardTag:"SPOTIFY OK",estimate:26.2,calibrated:true},
 "Restart must restore confirmed 26:12, not stale 27.1 editorial estimate.");
const pending=derive(state,meta,HSBooks,{HSScoreReadiness:{spotifyPrepared:()=>false}},{number:22,estimatedMinutes:27.1},"ready");
assert.equal(pending.cardTag,"SCORE PRONTO","A curated score is not proof of Spotify verification.");
const readiness=read("scripts/score-readiness.js");
const list=[...Array(21)].map((_,i)=>i+1).reduce((o,n)=>(o[n]={minutes:26},o),{});
const source=[["Cue A","Artist"],["Cue B","Artist"]];
const stateWithAudit={activeBookSlug:"fulgrim",done:list,active:null,spotify:{
  playlists:{"fulgrim:22":{id:"P",scoreSignature:JSON.stringify(source),preflightComplete:true,sourceVerifiedBy:"0.16.7"}},
  chapterRuntime:{22:{verified:true,status:"WITHIN_RANGE",durationMs:1540000,targetMs:1572000}}
 }};
const ui={directive:{textContent:""},progressText:{textContent:""}};
const ctx={
 HSBooks:{V:"fulgrim"},state:stateWithAudit,SCORES:{22:source},SCORE_META:{22:meta[22]},
 chapters:[{number:22}],window:{},spotifySyncChapter:async()=>{},save(){},
 document:{getElementById:id=>ui[id]||null},
 render(){}
};
require("node:vm").runInNewContext(readiness,ctx);
assert.match(ui.directive.textContent,/PLAYLIST CONFIRMADA NO SPOTIFY/);
assert.equal(ctx.window.HSScoreReadiness.spotifyPrepared(22),true);
stateWithAudit.spotify.chapterRuntime[22].status="FAILED";
ctx.render();
assert.match(ui.directive.textContent,/AUDITORIA SPOTIFY NECESSÁRIA/);
const switchSource=read("scripts/book-switch.js");
assert.match(switchSource,/state\.spotify\.auditResults\[number\]=\{status:"VERIFIED"/);
assert.match(switchSource,/state\.spotify\.auditResults\[number\]=\{status:"FAILED"/);
assert.match(switchSource,/save\(\);\s*\/\/ Rebuild the whole reading card[\s\S]*?render\(\);/);
assert.match(read("scripts/spotify-audit-panel.js"),/if\(state\.activeBookSlug==="fulgrim"&&!state\.active&&typeof render==="function"\)render\(\);/);
console.log("PASS: screenshot-regression, calibrated time, verified badge, directive updates, and persisted audit outcomes.");
