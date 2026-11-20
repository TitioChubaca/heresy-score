/* Portable local reading archives — export + non-destructive restore.
   Spotify credentials, cloud sync secrets, MOBI text and personal art stay OUT. */
(()=>{
"use strict";
const panel=document.querySelector('[data-view-panel="settings"]');
if(!panel)return;
const section=document.createElement("section");section.className="panel";section.id="hsBackupRestore";
section.innerHTML='<h2>Backup e recuperação dos livros</h2>'+
 '<p class="small">Exporte seus logs antes de trocar de dispositivo. A restauração só adiciona registros que ainda não existem; nunca substitui avaliações ou anotações atuais. Tokens Spotify e chaves de sincronização não entram no arquivo.</p>'+
 '<div class="actions"><button type="button" class="btn" id="hsExportLogs">Exportar backup JSON</button></div>'+
 '<label class="small" for="hsImportLogs">Selecionar backup para conferir (nenhuma alteração automática)</label>'+
 '<input id="hsImportLogs" type="file" accept=".json,application/json" style="display:block;max-width:100%;margin:9px 0">'+
 '<div class="small" id="hsImportPreview" role="status" aria-live="polite">Nenhum backup selecionado.</div>'+
 '<button type="button" class="btn" id="hsImportApply" disabled>Restaurar apenas registros ausentes</button>';
panel.append(section);
const out=section.querySelector("#hsImportPreview"),fileInput=section.querySelector("#hsImportLogs"),apply=section.querySelector("#hsImportApply");
let preview=null;
const slugMap=()=>({[HSBooks.IV]:17,[HSBooks.V]:25,[HSBooks.VI]:25});
const goodRecord=r=>r&&typeof r==="object"&&!Array.isArray(r)&&
 (typeof r.notes==="string"||Number.isFinite(r.minutes)||typeof r.finishedAt==="string"||Array.isArray(r.trackFeedback));
function candidates(obj){
 if(!obj||typeof obj!=="object"||!obj.books||typeof obj.books!=="object")throw Error("O arquivo não contém um backup de livros do Heresy Score.");
 if(![3,4].includes(Number(obj.schemaVersion)))throw Error("Versão do backup não suportada; somente v3/v4.");
 const changes=[],known=slugMap();
 for(const [slug,max] of Object.entries(known)){
  const records=obj.books?.[slug]?.done||{};
  if(typeof records!=="object"||Array.isArray(records))throw Error("Registros inválidos para "+slug);
  for(const [raw,data] of Object.entries(records)){
   const n=Number(raw);
   if(!/^\d+$/.test(raw)||!Number.isInteger(n)||n<1||n>max||!goodRecord(data))
    throw Error("Registro inválido em "+slug+" / "+raw+". Nenhuma alteração feita.");
   if(state.books?.[slug]?.done?.[n]||state.activeBookSlug===slug&&state.done?.[n])continue;
   changes.push({slug,chapter:n,data:JSON.parse(JSON.stringify(data))});
  }
 }
 return changes;
}
section.querySelector("#hsExportLogs").onclick=()=>{
 try{
  HSBooks.persistActive(state);
  const books=JSON.parse(JSON.stringify(state.books||{}));
  for(const entry of Object.values(books)){
   delete entry.spotifyAuditSnapshot;delete entry.spotify;delete entry.token;
  }
  const payload={schemaVersion:HSBooks.VERSION,exportVersion:"reading-backup-v2",
   exportedAt:new Date().toISOString(),books};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="heresy-score-leituras-"+new Date().toISOString().slice(0,10)+".json";
  a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
  out.textContent="Backup exportado. Guarde o JSON fora do dispositivo antes de qualquer migração.";
 }catch(e){out.textContent="Não foi possível exportar: "+String(e?.message||e)}
};
fileInput.onchange=async()=>{
 apply.disabled=true;preview=null;
 const f=fileInput.files?.[0];if(!f){out.textContent="Nenhum arquivo selecionado.";return}
 try{
  if(f.size>6_000_000)throw Error("Backup maior que 6 MB. Confira a origem.");
  const parsed=JSON.parse(await f.text());
  HSBooks.persistActive(state);
  const changes=candidates(parsed);
  preview=changes;
  const counts=Object.fromEntries(Object.keys(slugMap()).map(slug=>[slug,changes.filter(x=>x.slug===slug).length]));
  out.textContent="Prévia validada — somente registros ausentes: "+JSON.stringify(counts)+
   ". Logs existentes serão preservados. Nenhum dado foi importado ainda.";
  apply.disabled=changes.length===0;
 }catch(e){out.textContent="Backup recusado: "+String(e?.message||e)}
};
apply.onclick=()=>{
 if(!preview?.length)return;
 if(!window.confirm("Adicionar "+preview.length+" registros ausentes aos livros? Registros existentes não serão modificados."))return;
 try{
  HSBooks.persistActive(state);
  let imported=0;
  for(const row of preview){
   const b=state.books[row.slug];
   if(!b||b.done[row.chapter])continue;
   const item={...row.data,cloudSynced:false,restoredFromBackup:true};
   b.done[row.chapter]=item;
   if(state.activeBookSlug===row.slug)state.done[row.chapter]=JSON.parse(JSON.stringify(item));
   imported++;
  }
  save();render();preview=null;apply.disabled=true;
  out.textContent=imported+" registros recuperados sem substituir os existentes. Confira Logs e sincronize quando desejar.";
 }catch(e){out.textContent="Falha na restauração: "+String(e?.message||e)}
};
})();
