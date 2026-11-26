/* Descent of Angels — complete music-only draft for unread reading units.
   PRIVATE MOBI was inspected chapter by chapter. This PUBLIC file contains
   only timing anchors and musical functions, with no plot, people, events,
   place revelations, dialogue, copyrighted book prose or future imagery.
   These are CATALOG-VERIFIED CANDIDATES, NOT FULL-AUDIO-APPROVED SCORES.
   Spotify recordings remain fail-closed until authenticated read-back. */
(()=>{
"use strict";
const book=window.HS_DESCENT_DATA;
if(!book||book.slug!=="descent-of-angels")return;
const read=book.scoreMeta,prior=book.scores;
const ROLE={A:"atmosphere",D:"dialogue",S:"suspense",X:"action",F:"aftermath",C:"closing",T:"transition"};
// Album timing/candidate identity: official Christopher Larkin and Jesper Kyd
// catalogs; never assert that catalog metadata establishes Spotify identity.
// Schema: title, artist, catalog length (sec), generic role codes, intensity,
// timbre affinity. No future-book source material.
const HK="Christopher Larkin",JK="Jesper Kyd";
const catalog=[
 ["Enter Hallownest",HK,89,"ATCF",1,"organic"],
 ["Dirtmouth",HK,115,"ADFC",1,"organic"],
 ["Crossroads",HK,147,"ADTS",1,"organic"],
 ["False Knight",HK,184,"SX",4,"organic"],
 ["Greenpath",HK,217,"ADTC",2,"organic"],
 ["Hornet",HK,166,"SX",4,"organic"],
 ["Reflection",HK,99,"ADFC",1,"organic"],
 ["Mantis Lords",HK,105,"X",4,"organic"],
 ["City of Tears",HK,178,"ADFC",1,"organic"],
 ["Dung Defender",HK,127,"X",4,"organic"],
 ["Crystal Peak",HK,248,"ST",2,"organic"],
 ["Fungal Wastes",HK,184,"ASD",2,"organic"],
 ["Decisive Battle",HK,125,"X",4,"organic"],
 ["Soul Sanctum",HK,270,"AS",3,"organic"],
 ["Resting Grounds",HK,132,"ADFC",1,"organic"],
 ["Queen's Gardens",HK,106,"ADFC",1,"organic"],
 ["The White Lady",HK,79,"ADFC",1,"organic"],
 ["Broken Vessel",HK,119,"SX",3,"organic"],
 ["Kingdom's Edge",HK,141,"ST",2,"organic"],
 ["Nosk",HK,110,"SX",3,"organic"],
 ["Dream",HK,121,"ADFC",1,"organic"],
 ["Dream Battle",HK,145,"SX",4,"organic"],
 ["White Palace",HK,258,"ADT",2,"organic"],
 ["Hollow Knight",HK,96,"FC",2,"organic"],
 ["Darktide Main Theme",JK,257,"AT",3,"industrial"],
 ["The Uprising on Hive Tertium",JK,164,"SX",4,"industrial"],
 ["Prison Break",JK,158,"SX",3,"industrial"],
 ["Onboard the Tancred Bastion",JK,117,"ADT",2,"industrial"],
 ["Escaping the Prison Ship",JK,97,"SX",4,"industrial"],
 ["The Imperium Unites",JK,93,"AT",2,"industrial"],
 ["Immortal Imperium",JK,234,"ATD",2,"industrial"],
 ["Dropship to Hive Tertium",JK,141,"AT",2,"industrial"],
 ["The Transit Horde",JK,124,"SX",4,"industrial"],
 ["Imperium of Man",JK,161,"ATD",2,"industrial"],
 ["The Mourningstar",JK,147,"ADFC",1,"industrial"],
 ["Disposal Unit (Imperium Mix)",JK,213,"SX",4,"industrial"],
 ["Late Night Entertainment",JK,116,"AD",1,"industrial"],
 ["Nightsider",JK,181,"ASD",2,"industrial"],
 ["City of Tertium",JK,119,"AD",1,"industrial"],
 ["Broadcast Apparatus",JK,132,"SDT",2,"industrial"],
 ["Apparatus Receiving",JK,142,"SDT",2,"industrial"],
 ["Data Interference",JK,134,"ST",3,"industrial"],
 ["Forge Manufactorum",JK,156,"AT",3,"industrial"],
 ["Atoma Prime",JK,235,"AS",2,"industrial"],
 ["Entering Throneside",JK,106,"ATD",2,"industrial"],
 ["Waiting to Strike",JK,142,"SX",3,"industrial"],
 ["Path of Trust",JK,237,"ADFC",1,"industrial"],
 ["Unrest in Throneside",JK,122,"SX",3,"industrial"],
 ["Transmission Commences",JK,219,"ADT",2,"industrial"],
 ["Offworld Auspex",JK,154,"SDT",2,"industrial"],
 ["Hive City Lowest Level",JK,208,"AS",2,"industrial"],
 ["The Torrent Fights Back",JK,163,"SX",4,"industrial"],
 ["Warp Traveller",JK,190,"AT",2,"industrial"],
 ["Debriefing",JK,72,"DFC",1,"industrial"],
 ["Escape Initiated",JK,78,"SX",3,"industrial"],
 ["Imperial Advance",JK,122,"X",4,"industrial"],
 ["The Will of the Imperium",JK,149,"ATD",2,"industrial"],
 ["Write Transmit",JK,193,"ADT",2,"industrial"],
 ["Sublevel Data Interrogation",JK,136,"SD",2,"industrial"],
 ["Reality Slipping",JK,165,"SX",3,"industrial"],
 ["Heart of Heresy",JK,114,"AS",3,"industrial"],
 ["Last Man Standing",JK,130,"X",4,"industrial"],
 ["Admonition",JK,143,"DFC",1,"industrial"],
 ["Transmission Commences (Late Night Mix)",JK,233,"AT",2,"industrial"]
].map(([title,artist,seconds,roles,intensity,palette])=>
 ({title,artist,seconds,roles,intensity,palette}));
// Relative anchors are musical editorial categories ONLY, not named scenes.
// Each timeline was inspected in the supplied MOBI; no novel data escapes.
const outlines={
 7:"0:A .10:D .23:S .34:X .43:D .54:S .66:D .76:F .86:S .94:C",
 8:"0:A .13:S .29:D .43:A .53:S .67:D .79:S .93:X",
 9:"0:X .15:X .38:S .57:X .78:X .92:F",
 10:"0:F .13:D .27:A .42:D .57:S .72:D .87:A .93:C",
 11:"0:A .10:S .25:X .39:D .57:S .69:X .88:X .95:C",
 12:"0:X .21:X .36:S .49:X .66:X .82:F .94:C",
 13:"0:X .18:S .33:X .43:F .57:D .75:S .90:C",
 14:"0:F .16:D .30:A .45:S .60:T .78:A .91:C",
 15:"0:A .14:D .26:T .44:D .59:S .73:D .84:A .94:C",
 16:"0:T .13:D .23:A .34:D .51:S .65:D .78:S .91:C",
 17:"0:A .17:T .33:D .48:S .65:X .77:S .91:C",
 18:"0:A .12:S .24:D .39:S .51:D .65:S .82:D .92:C",
 19:"0:A .11:D .20:T .35:D .51:S .65:D .78:T .91:C",
 20:"0:D .13:A .31:D .44:S .60:D .77:S .92:C",
 21:"0:D .13:S .26:T .38:D .52:S .65:X .79:S .92:C",
 22:"0:X .20:S .33:X .48:F .62:D .77:S .90:C",
 23:"0:A .11:X .30:S .43:X .62:X .79:S .93:C",
 24:"0:S .13:A .28:D .41:S .55:X .76:X .91:F",
 25:"0:C"
};
function parseAnchor(s){
 return s.split(/\s+/).map(part=>{const [at,letter]=part.split(":");return {at:+at,role:ROLE[letter]}})
}
function trackRole(r){return Object.entries(ROLE).find(([,v])=>v===r)?.[0]}
function selectors(unit,target,anchorText,previous){
 const anchors=parseAnchor(anchorText);
 if(!anchors.length||anchors[0].at!==0)throw Error("No opening anchor in unit "+unit);
 const count=unit===25?1:Math.max(3,Math.round(target/155));
 const slots=Array.from({length:count},(_,i)=>{
  const at=i/count;let role=anchors[0].role;
  for(const a of anchors)if(a.at<=at)role=a.role;
  return {at:Math.round(at*1000)/1000,role};
 });
 const industrial=unit>=18;
 const shortlist=slots.map((slot,i)=>{
  const choices=catalog.filter(c=>c.roles.includes(trackRole(slot.role)));
  if(!choices.length)throw Error("No catalog candidates "+slot.role);
  return choices;
 });
 let states=[{tracks:[],seconds:0,penalty:0}];
 const recent=new Set(previous.flat());
 for(let i=0;i<slots.length;i++){
  const next=[],ideal=target*(i+1)/slots.length;
  for(const state of states){
   for(const c of shortlist[i]){
    if(state.tracks.some(x=>x.title===c.title&&x.artist===c.artist))continue;
    const usedRecent=recent.has(c.title+"|"+c.artist);
    const diff=c.seconds;
    const newTime=state.seconds+diff;
    // Reuse inside adjacent chapters is possible only when duration otherwise
    // fails; it receives a strong penalty. Genre palette is editorial, never
    // a hard spoiler-causing switch of track names or dynamic approval.
    const palettePenalty=(industrial?c.palette!=="industrial":c.palette!=="organic")?7:0;
    const dynPenalty=["atmosphere","dialogue","aftermath","closing"].includes(slots[i].role)&&c.intensity>2?14:0;
    const penalty=state.penalty+palettePenalty+dynPenalty+(usedRecent?11:0);
    const heuristic=Math.abs(newTime-ideal)*.22+penalty;
    next.push({tracks:[...state.tracks,c],seconds:newTime,penalty,heuristic});
   }
  }
  next.sort((a,b)=>a.heuristic-b.heuristic||
    a.tracks.map(x=>x.title).join("|").localeCompare(b.tracks.map(x=>x.title).join("|")));
  states=next.slice(0,120);
  if(!states.length)throw Error("No musical combinations for unit "+unit);
 }
 const acceptable=states.filter(s=>s.seconds>=target-45&&s.seconds<=target+60);
 const candidates=acceptable.length?acceptable:states;
 candidates.sort((a,b)=>Math.abs(a.seconds-target)*1.1+a.penalty-
  (Math.abs(b.seconds-target)*1.1+b.penalty));
 const best=candidates[0];
 return {slots,tracks:best.tracks,seconds:best.seconds,valid:!!acceptable.length};
}
const chosen={};
for(let n=7;n<=25;n++){
 const words=book.chapters[n-1].wordCountApprox,target=Math.round(words/197*60);
 const previous=[n-1,n-2].map(k=>chosen[k]||[]).map(a=>a.map(x=>x.title+"|"+x.artist));
 const selection=selectors(n,target,outlines[n],previous);
 chosen[n]=selection.tracks;
 const cues=selection.tracks.map((c,i)=>({
  uri:null,title:c.title,artist:c.artist,role:selection.slots[i].role,
  durationApproxSeconds:c.seconds,intensity:c.intensity,required:true,
  fullAudioQA:{status:"NOT_ANALYZED",independentAudioSource:false,
   structuralProfile:false,fullListeningReviewed:false,roleFitApproved:false}
 }));
 prior[n]=cues.map(c=>[c.title,c.artist]);
 read[n]={...read[n],estimatedMinutes:words/197,baseEstimatedMinutes:words/197,
  startCue:cues[0].title,finalCueIndex:cues.length-1,
  editorialPositions:selection.slots.map(s=>s.at),
  editorialStatus:"PREPLANNED_FULL_AUDIO_UNVERIFIED",
  stage:selection.valid?"CATALOG_PREPLANNED_SPOTIFY_PENDING":"CATALOG_DURATION_REVIEW_REQUIRED",
  recordingReferences:cues,
  catalogDurationApproxSeconds:selection.seconds,
  scoreSource:"Private reader-provided book (structure); official public soundtrack catalogs (track duration and composer only)",
  playbackPolicy:"verify-exact-Spotify-identity-time-sequence;never-mark-audio-approved"
 };
 book.chapters[n-1].startCue=cues[0].title;
 book.chapters[n-1].estimatedMinutes=words/197;
}
window.HSBookVIFullDraft={
 version:"0.18.1",unitCount:25,catalogRecords:catalog.length,
 ranges:Object.fromEntries(Array.from({length:19},(_,i)=>{
  const n=i+7;return [n,{count:chosen[n].length,
    approximateSeconds:read[n].catalogDurationApproxSeconds,
    estimatedSeconds:Math.round(read[n].estimatedMinutes*60),stage:read[n].stage}]
 }))
};
})();