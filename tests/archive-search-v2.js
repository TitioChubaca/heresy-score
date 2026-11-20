/* node tests/archive-search-v2.js — only discovered records are searchable. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"../scripts/archive-search-v2.js"),"utf8");
const cards=[0,1].map(()=>({hidden:false,setAttribute(name,value){this[name]=value}}));
const input={value:"",addEventListener(_,fn){this.onInput=fn}},count={textContent:""};
const root={before(){},querySelectorAll:()=>cards};
const panel={innerHTML:"",querySelector:selector=>selector==="input"?input:count};
const doc={getElementById:()=>root,createElement:tag=>tag==="section"?panel:{textContent:""},head:{append(){}}};
const state={archiveFilter:"all"};
const archiveRecords=[
 {name:"Known Ship",kind:"voidcraft",kindLabel:"Voidcraft",note:"Known",unlock:1},
 {name:"Sealed Ship",kind:"voidcraft",kindLabel:"Voidcraft",note:"Future secret",unlock:5}
];
const ctx={document:doc,state,archiveRecords,maxClearance:()=>1,renderArchive(){},window:{addEventListener(){}}};
vm.runInNewContext(source,ctx);
ctx.renderArchive();
assert.equal(cards[0].hidden,false);
assert.equal(cards[1].hidden,true);
assert.doesNotMatch(count.textContent,/Future secret|Sealed Ship/);
input.value="Future";input.onInput();
assert.equal(cards[0].hidden,true);
assert.equal(cards[1].hidden,true);
input.value="Known";input.onInput();
assert.equal(cards[0].hidden,false);
assert.equal(cards[1].hidden,true);
console.log("PASS place archive hides sealed records and excludes their metadata from search.");
