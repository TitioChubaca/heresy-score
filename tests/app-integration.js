/* node tests/app-integration.js — executable scripts, cache and release wiring. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.join(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const html=read("index.html"),sw=read("sw.js");
const scripts=[...html.matchAll(/<script\s+src="([^"]+)"\s*><\/script>/g)].map(m=>m[1].split("?")[0].replace(/^\.\//,""));
const unique=new Set(scripts);
assert.equal(unique.size,scripts.length,"Script tags must not be duplicated");
for(const p of scripts)assert(fs.existsSync(path.join(root,p)),"Missing script referenced by HTML: "+p);
const at=p=>scripts.indexOf(p);
assert(at("data/descent-of-angels.js")>=0,"Book VI file must load");
assert(at("data/descent-of-angels.js")<at("scripts/book-switch.js"),"Book registry before switch");
assert(at("scripts/app-build.js")<at("scripts/book-switch.js"),"Build ID before router");
assert(at("scripts/editorial-score-engine.js")<at("scripts/spotify-runtime-fit.js"),"Narrative score validator first");
assert(at("scripts/dramatis-personae-v2.js")>at("scripts/chapter-deck.js"),"Roster enhancer after deck");
const list=sw.match(/const ASSETS=(\[[^;]*\]);/);
assert(list,"Service worker must have an explicit pre-cache list");
const assets=JSON.parse(list[1]);
for(const p of scripts)assert(assets.includes("./"+p),"Script must be in PWA pre-cache: "+p);
for(const p of assets){
 if(p==="./")continue;
 assert(fs.existsSync(path.join(root,p.replace(/^\.\//,""))),"Missing PWA asset: "+p);
}
assert.match(sw,/Promise\.all\(essential\.map/,"Essential app scripts must install atomically");
assert.equal((sw.match(/addEventListener\("activate"/g)||[]).length,1,"Single SW activation");
const release=read("scripts/app-build.js").match(/version:"([^"]+)"/)[1];
const cache=sw.match(/const CACHE="heresy-score-v(\d+)"/)[1];
assert.equal(cache,"v"+release.replace(/\./g,"").padStart(4,"0").slice(1),
 "SW cache version should match app build code");
console.log("PASS script order, all linked files, PWA precache and atomic install.");
