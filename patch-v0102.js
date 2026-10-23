(()=>{
if(window.__HS_PATCH_0102)return;window.__HS_PATCH_0102=true;

state.spotify=state.spotify||{};
state.spotify.scoreDurations=state.spotify.scoreDurations||{};
state.spotify.chapterRuntime=state.spotify.chapterRuntime||{};
if(typeof MUSIC_CALIBRATION!=="undefined"){
  MUSIC_CALIBRATION.strongFits=MUSIC_CALIBRATION.strongFits||[];
  if(!MUSIC_CALIBRATION.strongFits.includes("Across The Void"))MUSIC_CALIBRATION.strongFits.push("Across The Void");
  MUSIC_CALIBRATION.chapterXII={readerMinutes:33,length:"good",note:"Across The Void matched the closing passage; one later cue remained unused. Calm faith dialogue should prefer restrained clerical or choral texture."};
  MUSIC_CALIBRATION.chapterXIII={readerMinutes:26,length:"good",note:"Score fit well but ended roughly 1–2 minutes before the chapter. The chapter moved from uncertainty and human reflection into Imperial relief; keep the next targets chapter-specific rather than inflating all scores."};
  MUSIC_CALIBRATION.chapterXIV={readerMinutes:30,length:"short",note:"The score fit, but again ended about one track early. Future playlists should keep roughly 1–2 minutes of deliberate musical headroom, using only curated reserves."};
  MUSIC_CALIBRATION.chapterXV={readerMinutes:36,length:"short",note:"Third consecutive short ending. Repetition was also noticeable and some reflective scenes needed less musical pressure. Chapter XVI therefore uses a mostly fresh palette and about three minutes of planned headroom instead of a single emergency reserve."};
}
if(typeof LEITMOTIFS!=="undefined"){
  LEITMOTIFS.faithAwakening={track:"Imperium of Man",artist:"Jesper Kyd",strength:"developing"};
}

SCORES[11]=[
["Offworld Auspex","Jesper Kyd"],
["Nightsider","Jesper Kyd"],
["Visions","Jonathan Cacherat"],
["Shadow Quarters","Pawel Perepelica"],
["Metallic Breathing","Jonathan Cacherat"],
["Lost Signal","Guillaume David"],
["TenSions","Jonathan Cacherat"],
["Martyr's Endurance","Pawel Perepelica"],
["Absolution","Pawel Perepelica"]
];
SCORE_META[11]={estimatedMinutes:32,startCue:"Offworld Auspex",stage:"prepared",reserveIndexes:[],finalCueIndex:8,trimIndexes:[5],durationReserve:[["Barren","Nikola Nikita Jeremić"],["Across The Void","Guillaume David"]]};

SCORES[12]=[
["Nightsider","Jesper Kyd"],
["Visions","Jonathan Cacherat"],
["Floating Machinery","Jonathan Cacherat"],
["Shadow Quarters","Pawel Perepelica"],
["Lost Signal","Guillaume David"],
["TenSions","Jonathan Cacherat"],
["Martyr's Endurance","Pawel Perepelica"],
["Barren","Nikola Nikita Jeremić"],
["Absolution","Pawel Perepelica"]
];
SCORE_META[12]={estimatedMinutes:34,startCue:"Nightsider",stage:"prepared",reserveIndexes:[],finalCueIndex:8,trimIndexes:[4],durationReserve:[["Across The Void","Guillaume David"]]};

SCORES[13]=[
["Offworld Auspex","Jesper Kyd"],
["Shadow Quarters","Pawel Perepelica"],
["The Mourningstar","Jesper Kyd"],
["Path of Trust","Jesper Kyd"],
["The Imperium Unites","Jesper Kyd"],
["Across The Void","Guillaume David"],
["Our Endless March","Dmitry V. Silantyev"],
["Absolution","Pawel Perepelica"]
];
SCORE_META[13]={estimatedMinutes:33,startCue:"Offworld Auspex",stage:"prepared",reserveIndexes:[],finalCueIndex:7,trimIndexes:[3],durationReserve:[["Voidborn","Pawel Perepelica"]]};

SCORES[14]=[
["The Mourningstar","Jesper Kyd"],
["Path of Trust","Jesper Kyd"],
["The Imperium","Dmitry V. Silantyev"],
["Across The Void","Guillaume David"],
["Imperium of Man","Jesper Kyd"],
["Our Endless March","Dmitry V. Silantyev"],
["Absolution","Pawel Perepelica"]
];
SCORE_META[14]={estimatedMinutes:30,startCue:"The Mourningstar",stage:"prepared",reserveIndexes:[],finalCueIndex:6,trimIndexes:[3],durationReserve:[["Voidborn","Pawel Perepelica"]]};

SCORES[15]=[
["The Imperium Unites","Jesper Kyd"],
["Offworld Auspex","Jesper Kyd"],
["Path of Trust","Jesper Kyd"],
["Inside The Station","Guillaume David"],
["Noosphere","Guillaume David"],
["Across The Void","Guillaume David"],
["Absolution","Pawel Perepelica"]
];
SCORE_META[15]={estimatedMinutes:31,startCue:"The Imperium Unites",stage:"prepared",reserveIndexes:[],finalCueIndex:6,trimIndexes:[3],durationReserve:[["The Imperium","Dmitry V. Silantyev"]]};

SCORES[16]=[
["Severance Ambient","Steve Molitz"],
["Reality Slipping","Jesper Kyd"],
["Warp Whispers","Nima Fakhrara"],
["The Scourge","Steve Molitz"],
["Severance Combat","Steve Molitz"],
["Onslaught","Nima Fakhrara"],
["Death Is My Duty","Nima Fakhrara"],
["The Resilient","Nima Fakhrara"],
["Heart of Heresy","Jesper Kyd"],
["Imperium of Man","Jesper Kyd"],
["Immortal Imperium","Jesper Kyd"],
["The Emperor of Mankind","Jesper Kyd"],
["The Might of the Emperor","Nima Fakhrara"],
["Duty Without End Outro","Steve Molitz"]
];
SCORE_META[16]={estimatedMinutes:37,startCue:"Severance Ambient",stage:"prepared",reserveIndexes:[],finalCueIndex:13,trimIndexes:[],durationReserve:[["Voidsong","Steve Molitz"],["The Will of the Imperium","Jesper Kyd"]]};

delete SCORES[17];
delete SCORE_META[17];
chapters.splice(17);
// Chapter XVII is a short unscored epilogue, logged separately without inventing playback or timing.
if(chapters[16]){chapters[16].title="CHAPTER 17 // EPILOGUE";chapters[16].estimatedMinutes=null;chapters[16].startCue=null;}
[11,12,13,14,15,16].forEach(n=>{if(chapters[n-1]){chapters[n-1].estimatedMinutes=SCORE_META[n].estimatedMinutes;chapters[n-1].startCue=SCORE_META[n].startCue}});

async function resolveTrackInfo(title,artist){
  let key=spotifyNorm(title+"|"+artist),cached=state.spotify.trackCache[key];
  if(cached&&typeof cached==="object"&&cached.uri&&cached.durationMs)return cached;
  let q=encodeURIComponent('track:"'+title+'" artist:"'+artist+'"');
  let j=await spotifyApi("/search?q="+q+"&type=track&limit=5"),items=j.tracks?.items||[];
  if(!items.length)throw new Error("Track not found: "+title);
  let nt=spotifyNorm(title),na=spotifyNorm(artist);
  let best=items.map(x=>({x,score:(spotifyNorm(x.name)===nt?4:spotifyNorm(x.name).includes(nt)?2:0)+((x.artists||[]).some(a=>spotifyNorm(a.name)===na)?4:0)})).sort((a,b)=>b.score-a.score)[0].x;
  let info={uri:best.uri,durationMs:best.duration_ms||0,title:best.name||title,artist:(best.artists||[]).map(a=>a.name).join(", ")||artist};
  state.spotify.trackCache[key]=info;save();return info;
}

spotifySyncChapter=async function(chapter){
  let score=SCORES[chapter],meta=SCORE_META[chapter]||{};
  if(!score)throw new Error("Score for this chapter is still sealed");
  let p=await spotifyEnsurePlaylist(chapter),infos=[];
  for(const [title,artist] of score)infos.push(await resolveTrackInfo(title,artist));
  let finalIndex=meta.finalCueIndex==null?infos.length-1:meta.finalCueIndex;
  let total=infos.reduce((n,t)=>n+(t.durationMs||0),0),target=(meta.estimatedMinutes||0)*60000,threshold=Math.max(0,target+90000),ceiling=target+240000,used=new Set(infos.map(x=>x.uri));
  if(target&&total>ceiling&&Array.isArray(meta.trimIndexes)){
    for(const idx of [...meta.trimIndexes].sort((a,b)=>b-a)){
      if(total<=ceiling)break;
      if(idx<0||idx>=infos.length||idx===finalIndex)continue;
      let removed=infos.splice(idx,1)[0];total-=removed?.durationMs||0;if(idx<finalIndex)finalIndex--;
    }
  }
  if(target&&total<threshold&&Array.isArray(meta.durationReserve)){
    for(const [title,artist] of meta.durationReserve){
      let extra=await resolveTrackInfo(title,artist);
      if(used.has(extra.uri))continue;
      infos.splice(finalIndex,0,extra);used.add(extra.uri);total+=extra.durationMs||0;finalIndex++;
      if(total>=threshold)break;
    }
  }
  let uris=infos.map(x=>x.uri);
  await spotifyApi("/playlists/"+p.id+"/items",{method:"PUT",body:JSON.stringify({uris})});
  await spotifyApi("/playlists/"+p.id,{method:"PUT",body:JSON.stringify({name:"Heresy Score // Eisenstein // CH "+String(chapter).padStart(2,"0"),public:false,description:"Active spoiler-safe score. Curated by chapter."})});
  state.spotify.playlistUrl="https://open.spotify.com/playlist/"+p.id;
  state.spotify.scoreDurations[chapter]=total;
  state.spotify.chapterRuntime[chapter]={durationMs:total,targetMs:target,finalCueIndex:finalIndex,trackCount:infos.length};
  save();return p.id;
};

spotifyFinalCue=async function(){
  if(!state.active)return;
  let meta=SCORE_META[state.active.chapter],runtime=state.spotify.chapterRuntime&&state.spotify.chapterRuntime[state.active.chapter];
  let idx=runtime&&runtime.finalCueIndex!=null?runtime.finalCueIndex:meta&&meta.finalCueIndex;
  if(idx==null){toast("no protected final cue");return}
  if(!state.spotify.playlistId){toast("playlist not synced");return}
  try{
    await spotifyApi("/me/player/play",{method:"PUT",body:JSON.stringify({context_uri:"spotify:playlist:"+state.spotify.playlistId,offset:{position:idx},position_ms:0})});
    setTimeout(refreshPlayer,500);toast("final cue engaged");
  }catch(e){toast(e.message)}
};

const ship=archiveRecords.find(r=>r.key==="eisenstein");
if(ship){
  ship.image="https://miniset.net/files/set/gw-sg-bfg-g-008-0.jpg";
  ship.visual="representative frigate reference";
  ship.note=maxClearance()>=14?"Depois que os sobreviventes são transferidos para a Phalanx, a fragata gravemente danificada é destruída para eliminar qualquer risco de contaminação do Warp. A missão da Eisenstein termina mesmo que a nave não sobreviva.":"Representative Forge World Gladius-class frigate miniatures used only as a scale/form reference. This is not claimed as the exact Eisenstein hull.";
  if(maxClearance()>=14)ship.status="destroyed";
}
const istvaan=archiveRecords.find(r=>r.key==="istvaan-iii");
if(istvaan){
  istvaan.image="https://assets.warhammer-community.com/articles/0-2026/october/wc12-10/image1-gbizqrzzhe.jpg";
  istvaan.visual="official current-book theatre reference";
  istvaan.note="Official Warhammer Community Flight of the Eisenstein cover art, now safe at the current clearance; used as an Isstvan III theatre reference rather than a literal orbital map.";
}
const term=archiveRecords.find(r=>r.key==="terminus-est");
if(term){
  term.image=null;
  term.visual="visual redacted // exact pre-Heresy configuration uncertain";
  term.note="The exact pre-Heresy exterior is not reliably fixed in current safe sources. Later corrupted imagery is deliberately withheld.";
}

[
{key:"reanimated-death-guard",name:"Reanimated Death Guard",kind:"entity",kindLabel:"Entity // Nurgle",unlock:11,glyph:"☣",image:"https://assets.warhammer-community.com/art9_deathguard-nov21-pic1-twl3i27fqq.jpg",visual:"representative Plague Marine reference",note:"Chapter XI reveals Grulgor and his traitor Astartes returned as plague-corrupted monsters. This official Death Guard artwork is a later generic visual analogue, not a claim that their exact Chapter XI appearance matches this armour."},
{key:"life-eater-revenants",name:"Life-Eater Revenants",kind:"entity",kindLabel:"Entity // Reanimated Dead",unlock:11,glyph:"☠",image:null,visual:"visual reconstruction pending",note:"Crew killed by the Life-Eater are seen moving again as distorted corpses. They are best treated as Nurgle-tainted revenants here rather than equating them exactly with a later tabletop unit such as Poxwalkers."},
{key:"warp-disc-entity",name:"Disc-like Warp Entity",kind:"entity",kindLabel:"Entity // Warp fauna",unlock:11,glyph:"◈",image:"https://assets.warhammer-community.com/articles/1c8abaaa-307d-4895-9538-04badcf25218/1aqpry1janqfwaq5.jpg",visual:"possible Screamer analogue // not confirmed",note:"The novel describes a spinning purple blade/disc with trailing cilia. Community readers have long compared it to a Screamer of Tzeentch, and official Screamer lore fits warp-flying, ship-hunting behaviour, but the novel does not explicitly name the creature. The image is therefore only a visual analogue."}
].forEach(r=>{if(!archiveRecords.some(x=>x.key===r.key))archiveRecords.push(r)});
if(!archiveRecords.some(x=>x.key==="phalanx"))archiveRecords.push({key:"phalanx",name:"Phalanx",kind:"voidcraft",kindLabel:"Voidcraft // Imperial Fists",unlock:13,glyph:"⬢",image:"https://assets.warhammer-community.com/articles/3f937ee3-c7c1-4c45-ad3b-bf8e0e8a8b92/3xgsoauoqzk2kohv.jpg",visual:"official Phalanx interior showcase",note:"The colossal mobile fortress-monastery of the Imperial Fists. This official Warhammer Community image shows a later hobby reconstruction of an interior hangar, used only as a spatial reference rather than an exact Heresy-era exterior."});

const tabs=document.querySelector(".archive-tabs");
if(tabs&&!tabs.querySelector('[data-archive-filter="entity"]')){
  const b=document.createElement("button");
  b.className="btn"; b.dataset.archiveFilter="entity"; b.textContent="Entities";
  tabs.appendChild(b);
  b.onclick=()=>{state.archiveFilter="entity";save();renderArchive()};
}
const archiveTitle=document.querySelector('[data-view-panel="archive"] h2');
if(archiveTitle)archiveTitle.textContent="Voidcraft, Theatres & Entity Compendium";

openArchiveRecord=function(r){
  if(maxClearance()<r.unlock)return;
  $("archiveDialogType").textContent=r.kindLabel.toUpperCase()+" DOSSIER";
  $("archiveDialogName").textContent=r.name;
  $("archiveDialogMeta").textContent="CLEARANCE // CH "+String(r.unlock).padStart(2,"0")+" // "+r.visual.toUpperCase();
  $("archiveDialogNote").textContent=r.note;
  $("archiveDialogVisual").innerHTML=r.image?'<img src="'+r.image+'" alt="'+r.name+'" style="width:100%;height:100%;object-fit:cover" referrerpolicy="no-referrer" onerror="this.parentElement.innerHTML=\'<div class=&quot;world-redacted&quot;>VISUAL OFFLINE</div>\'">':'<div class="big-glyph">'+r.glyph+'</div>';
  $("archiveDialog").showModal();
};

renderArchive=function(){
  let clearance=maxClearance(),box=$("worldArchive");if(!box)return;
  $("worldArchiveCode").textContent="CLEARANCE // CH "+String(clearance).padStart(2,"0");box.innerHTML="";
  let items=archiveRecords.filter(r=>state.archiveFilter==="all"||r.kind===state.archiveFilter);
  items.forEach(r=>{
    let unlocked=clearance>=r.unlock,el=document.createElement("article");el.className="world-card"+(unlocked?"":" locked");
    let center=!unlocked?'<div class="world-redacted">RECORD SEALED<br>requires chapter '+String(r.unlock).padStart(2,"0")+'</div>':r.image?'<img src="'+r.image+'" alt="'+r.name+'" style="width:100%;height:100%;object-fit:cover" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.innerHTML=\'<div class=&quot;world-glyph&quot;>'+r.glyph+'</div>\'">':'<div class="world-glyph">'+r.glyph+'</div>';
    el.innerHTML='<div class="world-visual">'+center+'</div><div class="world-copy"><div class="world-name">'+(unlocked?r.name:"REDACTED")+'</div><div class="world-kind">'+(unlocked?r.kindLabel:"classified archive")+'</div><div class="world-note">'+(unlocked?r.note:"Spoiler protocol active.")+'</div><span class="visual-badge">'+(unlocked?r.visual:"sealed")+'</span></div>';
    if(unlocked)el.onclick=()=>openArchiveRecord(r);box.appendChild(el);
  });
  document.querySelectorAll("[data-archive-filter]").forEach(b=>b.classList.toggle("on",b.dataset.archiveFilter===state.archiveFilter));
};

function ensurePerson(p){if(!people.some(x=>x.name===p.name))people.push(p)}
ensurePerson({name:"Rogal Dorn",role:"Primarch // VII Legion Imperial Fists",unlock:13,visual:"official Horus Heresy reference",image:"https://assets.warhammer-community.com/articles/4615f4d0-6b15-4749-99ef-83c06673117e/fqcgwqlk7yl7jmg1.jpg",statuses:[{ch:13,status:"active"}],facts:[{ch:13,text:"Primarch dos Imperial Fists. Sua frota encontra a Eisenstein à deriva depois que a explosão dos motores de Warp funciona como um chamado no vazio."}],note:"Official Horus Heresy-era Rogal Dorn visual reference."});
ensurePerson({name:"Efried",role:"Captain // Imperial Fists",unlock:14,visual:"visual record redacted",image:null,statuses:[{ch:14,status:"active"}],facts:[{ch:14,text:"Captain dos Imperial Fists presente na reorganização da frota depois que Dorn aceita a notícia da traição."}],note:"No reliable period-safe individual visual selected yet."});
ensurePerson({name:"Halbrecht",role:"Captain // Imperial Fists",unlock:14,visual:"visual record redacted",image:null,statuses:[{ch:14,status:"active"}],facts:[{ch:14,text:"Captain dos Imperial Fists presente entre as forças de Dorn quando a Legião se divide entre Terra e uma resposta a Isstvan."}],note:"No reliable period-safe individual visual selected yet."});
ensurePerson({name:"Racel Vought",role:"Executive Officer // Eisenstein",unlock:7,visual:"visual record redacted",image:null,statuses:[{ch:7,status:"active"}],facts:[{ch:7,text:"Executive officer da Eisenstein e segunda na cadeia de comando humana abaixo de Baryk Carya."},{ch:10,text:"Ajuda Carya a manter a nave e a tripulação operando durante a fuga de Isstvan."}],note:"No reliable individual visual selected yet."});
ensurePerson({name:"Tirin Maas",role:"Vox Officer // Eisenstein",unlock:7,visual:"visual record redacted",image:null,statuses:[{ch:7,status:"active"},{ch:10,status:"deceased"}],facts:[{ch:7,text:"Vox officer da Eisenstein e integrante humano da tripulação de comando."},{ch:10,text:"Tenta alertar Calas Typhon sobre a fuga por acreditar que Garro está cometendo motim; Garro descobre a transmissão e o mata antes que comprometa a missão."}],note:"Status reflects only information revealed through Chapter X."});
ensurePerson({name:"Severnaya",role:"Navigator // Eisenstein",unlock:10,visual:"visual record redacted",image:null,statuses:[{ch:10,status:"active"}],facts:[{ch:10,text:"Navigator da Eisenstein, responsável por conduzir a fragata pelas rotas do Immaterium."}],note:"No reliable individual visual selected yet."});

const dornNow=people.find(x=>x.name==="Rogal Dorn");
if(dornNow&&!dornNow.facts.some(f=>f.ch===14))dornNow.facts.push({ch:14,text:"Recebe a denúncia de Garro com incredulidade e raiva diante da ideia de Horus ter traído o Emperor; as gravações mnemônicas de Mersadie finalmente tornam a evidência impossível de ignorar. Depois disso, reorganiza suas forças para levar o aviso a Terra e responder a Isstvan."});
const mersadieNow=people.find(x=>x.name==="Mersadie Oliton");
if(mersadieNow&&!mersadieNow.facts.some(f=>f.ch===14))mersadieNow.facts.push({ch:14,text:"Na Phalanx, suas gravações mnemônicas se tornam a prova decisiva que confirma o testemunho de Garro diante de Rogal Dorn."});
let sendek=people.find(x=>x.name==="Tollen Sendek");
if(sendek&&!sendek.facts.some(f=>f.ch===10))sendek.facts.push({ch:10,text:"Durante a fuga de Isstvan, destaca-se também pela leitura analítica da situação e pelas avaliações táticas junto ao comando."});
const grulgor=people.find(x=>x.name==="Ignatius Grulgor");
if(grulgor){
  grulgor.statuses=[{ch:1,status:"active"},{ch:8,status:"lost"},{ch:11,status:"corrupted"}];
  if(!grulgor.facts.some(f=>f.ch===11))grulgor.facts.push({ch:11,text:"Durante a falha do Geller field, retorna com seus homens como uma forma monstruosamente corrompida por Nurgle. Garro força a Eisenstein de volta ao realspace para romper a influência do Warp."});
}
let carya=people.find(x=>x.name==="Baryk Carya");
if(carya&&!carya.facts.some(f=>f.ch===10))carya.facts.push({ch:10,text:"Na fuga de Isstvan, sua experiência naval e a coordenação da bridge crew tornam-se tão importantes quanto a força dos Astartes."});
if(carya&&!carya.facts.some(f=>f.ch===13))carya.facts.push({ch:13,text:"Como shipmaster humano, Carya oferece a Garro uma perspectiva rara sobre os Astartes: seres quase sobre-humanos que ainda repetem impulsos profundamente humanos de fraternidade, rivalidade e desejo de aprovação."});

const baseRenderV0107=render;
render=function(){
  baseRenderV0107();
  const total=17;
  const logged=Object.keys(state.done||{}).map(Number).filter(n=>n>=1&&n<=total).length;
  if($("progress"))$("progress").style.width=(logged/total*100)+"%";
  if($("progressText"))$("progressText").textContent=logged+" / "+total+" logged";
  if($("bookArchiveProgress"))$("bookArchiveProgress").textContent=logged+" / "+total+" chapters logged";
  // A separately completed epilogue should not demand a new Spotify playlist.
  if(!state.done[17] && state.done[16]){
    const ep=[...document.querySelectorAll(".chapter")].find(x=>x.querySelector(".chname")?.textContent.includes("EPILOGUE"));
    const action=ep?.querySelector(".actions");
    if(action){action.innerHTML="";const b=document.createElement("button");b.className="btn primary";b.textContent="Log Read Epilogue";b.onclick=()=>{state.done[17]={minutes:null,length:"unscored",notes:"Short epilogue read together with Chapter XVI; no independent score or recorded duration.",finishedAt:new Date().toISOString(),cloudSynced:false};save();render();openLog(17);};action.appendChild(b);}
  }
  document.querySelectorAll(".chip").forEach(x=>{
    if(x.textContent.includes("chapters"))x.textContent=total+" chapters";
    if(x.textContent.includes("protocol v"))x.textContent="protocol v0.10.8";
  });
};
save();render();
})();