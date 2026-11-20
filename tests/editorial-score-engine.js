/* node tests/editorial-score-engine.js — no Spotify access, no book spoilers. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,"../scripts/editorial-score-engine.js"),"utf8"),ctx);
const engine=ctx.window.HSEditorialScore;
const cue=(id,role,min,intensity=2)=>({uri:"spotify:track:"+id,role,durationMs:min*60000,intensity});
const plan={slots:[
 {role:"atmosphere",at:0,required:true,choices:[cue("first","atmosphere",2)]},
 {role:"action",at:.25,required:true,choices:[cue("battle","action",3,5)]},
 {role:"transition",at:.70,required:false,choices:[cue("bridge","transition",2)]},
 {role:"closing",at:.86,required:true,choices:[cue("final","closing",2)]}
]};
assert.equal(engine.validate(plan).length,0);
const nine=engine.fit(plan,9*60000);
assert.equal(nine.ok,true);
assert.equal(nine.durationMs,540000);
assert.equal(nine.uris.length,4);
assert(nine.uris.includes("spotify:track:battle"));
const seven=engine.fit(plan,7*60000);
assert.equal(seven.ok,true);
assert.equal(seven.durationMs,420000);
assert.deepEqual([...seven.skippedOptionalSlots],[2]);
assert(seven.uris.includes("spotify:track:battle"),"Required action cue must survive all cuts");
const impossible=engine.fit(plan,3*60000);
assert.equal(impossible.ok,false);
assert.match(impossible.reason,/obrigatórios/);
const invalid=JSON.parse(JSON.stringify(plan));
invalid.slots[1].choices[0].role="dialogue";
assert(engine.validate(invalid).some(x=>x.includes("incompatível")));
console.log("PASS narrative roles, protected transitions, optional bridge cuts and explicit impossibility.");
