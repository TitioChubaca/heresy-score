(()=>{
if(window.__HS_PATCH_0102)return;window.__HS_PATCH_0102=true;

state.spotify=state.spotify||{};
state.spotify.scoreDurations=state.spotify.scoreDurations||{};
state.spotify.chapterRuntime=state.spotify.chapterRuntime||{};

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
SCORE_META[11]={estimatedMinutes:32,startCue:"Offworld Auspex",stage:"prepared",reserveIndexes:[],finalCueIndex:8,durationReserve:[["Barren","Nikola Nikita Jeremić"],["Across The Void","Guillaume David"]]};

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
SCORE_META[12]={estimatedMinutes:34,startCue:"Nightsider",stage:"prepared",reserveIndexes:[],finalCueIndex:8,durationReserve:[["Across The Void","Guillaume David"]]};

SCORES[13]=[
["Offworld Auspex","Jesper Kyd"],
["The Mourningstar","Jesper Kyd"],
["Shadow Quarters","Pawel Perepelica"],
["Visions","Jonathan Cacherat"],
["The Imperium","Dmitry V. Silantyev"],
["Across The Void","Guillaume David"],
["Martyr's Endurance","Pawel Perepelica"],
["Absolution","Pawel Perepelica"]
];
SCORE_META[13]={estimatedMinutes:32,startCue:"Offworld Auspex",stage:"prepared",reserveIndexes:[],finalCueIndex:7,durationReserve:[["Voidborn","Pawel Perepelica"]]};

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
  let total=infos.reduce((n,t)=>n+(t.durationMs||0),0),target=(meta.estimatedMinutes||0)*60000,threshold=Math.max(0,target-60000),used=new Set(infos.map(x=>x.uri));
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
  ship.note="Representative Forge World Gladius-class frigate miniatures used only as a scale/form reference. This is not claimed as the exact Eisenstein hull.";
}
const term=archiveRecords.find(r=>r.key==="terminus-est");
if(term){
  term.image=null;
  term.visual="visual redacted // exact pre-Heresy configuration uncertain";
  term.note="The exact pre-Heresy exterior is not reliably fixed in current safe sources. Later corrupted imagery is deliberately withheld.";
}

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
ensurePerson({name:"Racel Vought",role:"Executive Officer // Eisenstein",unlock:7,visual:"visual record redacted",image:null,statuses:[{ch:7,status:"active"}],facts:[{ch:7,text:"Executive officer da Eisenstein e segunda na cadeia de comando humana abaixo de Baryk Carya."},{ch:10,text:"Ajuda Carya a manter a nave e a tripulação operando durante a fuga de Isstvan."}],note:"No reliable individual visual selected yet."});
ensurePerson({name:"Tirin Maas",role:"Vox Officer // Eisenstein",unlock:7,visual:"visual record redacted",image:null,statuses:[{ch:7,status:"active"},{ch:10,status:"deceased"}],facts:[{ch:7,text:"Vox officer da Eisenstein e integrante humano da tripulação de comando."},{ch:10,text:"Tenta alertar Calas Typhon sobre a fuga por acreditar que Garro está cometendo motim; Garro descobre a transmissão e o mata antes que comprometa a missão."}],note:"Status reflects only information revealed through Chapter X."});
ensurePerson({name:"Severnaya",role:"Navigator // Eisenstein",unlock:10,visual:"visual record redacted",image:null,statuses:[{ch:10,status:"active"}],facts:[{ch:10,text:"Navigator da Eisenstein, responsável por conduzir a fragata pelas rotas do Immaterium."}],note:"No reliable individual visual selected yet."});

let sendek=people.find(x=>x.name==="Tollen Sendek");
if(sendek&&!sendek.facts.some(f=>f.ch===10))sendek.facts.push({ch:10,text:"Durante a fuga de Isstvan, destaca-se também pela leitura analítica da situação e pelas avaliações táticas junto ao comando."});
let carya=people.find(x=>x.name==="Baryk Carya");
if(carya&&!carya.facts.some(f=>f.ch===10))carya.facts.push({ch:10,text:"Na fuga de Isstvan, sua experiência naval e a coordenação da bridge crew tornam-se tão importantes quanto a força dos Astartes."});

save();render();
})();