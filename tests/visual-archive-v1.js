/* node tests/visual-archive-v1.js — never uses private book source or credentials. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const ctx={window:{}};
vm.runInNewContext(read("data/descent-of-angels.js"),ctx);
assert.equal(ctx.window.HS_DESCENT_DATA.people.length,0);
assert.equal(ctx.window.HS_DESCENT_DATA.archive.length,0);
vm.runInNewContext(read("data/visual-registry.js"),ctx);
const api=ctx.window.HSReaderVisuals,book=ctx.window.HS_DESCENT_DATA;
assert(api&&api.schema===1);
assert.equal(api.known("descent-of-angels",0).length,0,"No images before completing Prelude");
assert.equal(api.known("descent-of-angels",1).length,2,"Prelude reveals only Caliban geography");
assert.equal(api.known("descent-of-angels",2).length,3,"Zahariel is safe after Chapter 1");
assert.equal(api.known("descent-of-angels",3).length,4,"Nemiel is safe after Chapter 2");
assert.equal(api.known("descent-of-angels",4).length,4,"Reader through Chapter 3 sees four visual records");
assert.equal(api.known("descent-of-angels",5).length,4,"No implied future content");
assert.equal(api.known("fulgrim",25).length,0,"Do not bleed Book VI art into other books");
assert.equal(api.theme("a-future-book").name,"Arquivo de leitura","Generic theme fallback for other genres");
const entries=Array.from(api.known("descent-of-angels",4));
const ids=entries.map(e=>e.id);
assert.equal(new Set(ids).size,4,"Unique visual IDs");
assert.equal(entries.filter(e=>e.kind==="character").length,2);
assert.equal(entries.filter(e=>e.kind==="place").length,2);
assert.equal(book.people.length,2,"Existing Dramatis archive receives two safe people");
assert.equal(book.archive.length,2,"Existing location archive receives two safe places");
assert.equal(book.relations.length,1);
assert(book.people.every(p=>p.art?.kind==="reconstruction"));
assert(book.archive.every(p=>p.art?.kind==="reconstruction"));
assert(book.people.every(p=>p.unlock<=4&&p.facts.every(f=>f.ch<=4)));
assert(book.archive.every(p=>p.unlock<=4));
assert.equal(book.scores[1].length,6);
assert.equal(book.scores[6].length,8);
assert.equal(book.scores[7],undefined,"Visual registry must not publish future music");
const file=api.asset.replace(/^\.\//,"");
const photo=fs.readFileSync(path.join(__dirname,"..",file));
assert(file.startsWith("assets/visuals/")&&file.endsWith(".webp"));
assert.equal(photo.toString("ascii",0,4),"RIFF");
assert.equal(photo.toString("ascii",8,12),"WEBP");
assert(photo.length>5000&&photo.length<250000);
const svg=read(api.backupAsset.replace(/^\.\//,""));
assert.match(svg,/<svg/);
assert.match(svg,/<\/svg>/);
assert.equal((svg.match(/clip-path="url\(#(?:a|b|c|d)\)"/g)||[]).length,4);
assert(!/<image\b[^>]*https?:/i.test(svg),"Local original art only; no remote hotlinks");
const html=read("index.html"),sw=read("sw.js"),css=read("styles/reader-foundation.css");
const after=(x,y)=>html.indexOf(x)>html.indexOf(y);
assert(after('src="./data/visual-registry.js"','src="./data/descent-of-angels.js"'));
assert(after('src="./scripts/book-switch.js"','src="./data/visual-registry.js"'));
assert(after('src="./scripts/visual-archive-ui.js"','src="./scripts/reader-ux-v3.js"'));
assert(after('src="./scripts/reader-foundation.js"','src="./scripts/visual-archive-ui.js"'));
for(const p of [
 "data/visual-registry.js","scripts/visual-archive-ui.js",
 "scripts/reader-foundation.js","styles/reader-foundation.css",
 "assets/visuals/caliban-first-archive.svg",
 "assets/visuals/caliban-first-archive.webp"
])assert(sw.includes('"./'+p+'"'),"PWA must precache "+p);
assert.match(sw,/heresy-score-v0183/);
assert.match(read("scripts/app-build.js"),/version:"0\.18\.3"/);
assert(css.includes("grid-template-columns:minmax(0,1fr)!important"),
 "Chapter actions stack vertically on small screens");
assert(css.includes("#now.hs-mini .now-controls"),"Compact player action grid must be defined");
const ui=read("scripts/visual-archive-ui.js");
assert(ui.includes("maxClearance()")&&ui.includes("registry.known"),
 "UI must enforce unlock status at render time");
assert(ui.includes('setView(view)'),"Archive shortcut should preserve dedicated navigation");
console.log("PASS book-neutral visuals, four spoiler-safe illustrations, Dramatis/location reuse, mobile layout and offline bundle.");
