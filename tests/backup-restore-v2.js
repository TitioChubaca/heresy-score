/* node tests/backup-restore-v2.js
   Verify that import previews, then restores only missing reading logs. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const ctx={window:{}};vm.runInNewContext(read("scripts/book-state.js"),ctx);
const HS=ctx.window.HSBooks;
const state=HS.migrate({activeBookSlug:HS.V,books:{
 [HS.V]:{done:{"1":{minutes:25,notes:"KEEP ORIGINAL"}}},
 [HS.IV]:{done:{}}
},spotify:{playlists:{}}});
const elements={};
const el=id=>(elements[id]||(elements[id]={textContent:"",disabled:false,files:[],style:{}}));
const section={className:"",id:"",innerHTML:"",querySelector:el,append(){}};
const document={querySelector:sel=>sel==='[data-view-panel="settings"]'?{append(){}}:null,createElement:()=>section};
const payload={schemaVersion:4,books:{
 [HS.V]:{done:{"1":{minutes:2,notes:"WRONG"},"2":{minutes:22,notes:"Restored"}}},
 [HS.VI]:{done:{"1":{minutes:16,notes:"Prelude"}}}
}};
const window={confirm:()=>true};
const sandbox={document,state,HSBooks:HS,window,
 save(){HS.persistActive(state)},render(){},Blob,URL};
vm.runInNewContext(read("scripts/book-backup.js"),sandbox);
(async()=>{
 const input=el("#hsImportLogs"),apply=el("#hsImportApply"),preview=el("#hsImportPreview");
 input.files=[{size:1200,text:async()=>JSON.stringify(payload)}];
 await input.onchange();
 assert.match(preview.textContent,/somente registros ausentes/);
 assert.equal(apply.disabled,false);
 assert.equal(state.done[2],undefined,"Preview must not import anything");
 apply.onclick();
 assert.equal(state.done[1].notes,"KEEP ORIGINAL");
 assert.equal(state.done[2].minutes,22);
 assert.equal(state.books[HS.VI].done[1].minutes,16);
 assert.equal(apply.disabled,true);
 console.log("PASS backup preview, non-destructive merge and Book VI unit restoration.");
})().catch(err=>{console.error(err);process.exitCode=1});
