// Book IV music data extracted verbatim from the original base app (pre-runtime-patch).
var SCORES={
2:[
["Darkness Between the Stars","Pawel Perepelica"],["Lost Civilizations","Guillaume David"],["Ancient Mystery","Nikolay Filipovich"],["Pulsar","Guillaume David"],["The Expanse","Pawel Perepelica"],["The War Room","Doyle W. Donehoo"],["The Master Plan","Doyle W. Donehoo"],["Noosphere","Guillaume David"],["The Chant","Doyle W. Donehoo"],["As An Iron Feather","Guillaume David"],["Reprieve and Reprisal","Doyle W. Donehoo"]
],
3:[
["EMV Charon","Guillaume David"],["Across The Void","Guillaume David"],["Lost Civilizations","Guillaume David"],["Caestus Metalican","Guillaume David"],["The Imperium","Dmitry V. Silantyev"],["Magnae Accessio","Vsevolod Borisov"],["A Speech On Earth","Guillaume David"],["Side By Side","Guillaume David"],["Voidborn","Pawel Perepelica"],["Minus 273 Degrees","Guillaume David"],["Absolution","Pawel Perepelica"],["Imperium's Bastion","Dmitry V. Silantyev"],["Cycles","Guillaume David"]
],
4:[
["Across The Void","Guillaume David"],["The Expanse","Pawel Perepelica"],["Ancient Mystery","Nikolay Filipovich"],["Inside The Station","Guillaume David"],["The Imperium","Dmitry V. Silantyev"],["A Fool's Hope","Guillaume David"],["Side By Side","Guillaume David"],["Sparks in the Dark","Nikolay Filipovich"],["Magnae Accessio","Vsevolod Borisov"],["Beyond The Asteroid Belt","Guillaume David"],["Cycles","Guillaume David"]
],
5:[
["Planetfall","Nikola Nikita Jeremic"],["Impending Storm","Vsevolod Borisov"],["Warriors of Mars","Guillaume David"],["Dock Alpha-Rho Skirmish","Pawel Perepelica"],["Millennial Rage","Guillaume David"],["Clash of Convictions","Nikolay Filipovich"],["Broadside Cannonade","Pawel Perepelica"],["Martyr's Endurance","Pawel Perepelica"],["A Fool's Hope","Guillaume David"],["Absolution","Pawel Perepelica"]
],
6:[
["Minus 273 Degrees","Guillaume David"],["Shadow Quarters","Pawel Perepelica"],["Inside The Station","Guillaume David"],["Darkness Between the Stars","Pawel Perepelica"],["Ancient Mystery","Nikolay Filipovich"],["Beyond The Asteroid Belt","Guillaume David"],["Lost Signal","Guillaume David"],["Barren","Nikola Nikita Jeremic"],["Adrift","Pawel Perepelica"],["Imperium's Bastion","Dmitry V. Silantyev"],["Our Endless March","Dmitry V. Silantyev"]
],
7:[
["Shadow Quarters","Pawel Perepelica"],["Impending Storm","Vsevolod Borisov"],["Lost Signal","Guillaume David"],["Caestus Metalican","Guillaume David"],["Warriors of Mars","Guillaume David"],["Clash of Convictions","Nikolay Filipovich"],["Millennial Rage","Guillaume David"],["Absolution","Pawel Perepelica"],["Our Endless March","Dmitry V. Silantyev"]
],
8:[
["Impending Storm","Vsevolod Borisov"],
["When the Stars Tremble","Pawel Perepelica"],
["Broadside Cannonade","Pawel Perepelica"],
["The Maelstrom","Vsevolod Borisov"],
["Death's Play","Vsevolod Borisov"],
["Clash of Convictions","Nikolay Filipovich"],
["Millennial Rage","Guillaume David"],
["Scuffle on the Deck","Pawel Perepelica"],
["Martyr's Endurance","Pawel Perepelica"],
["Voidborn","Pawel Perepelica"],
["Barren","Nikola Nikita Jeremić"],
["Absolution","Pawel Perepelica"]
],
9:[
["Shadow Quarters","Pawel Perepelica"],
["A Fool's Hope","Guillaume David"],
["Across The Void","Guillaume David"],
["Lost Signal","Guillaume David"],
["The Imperium","Dmitry V. Silantyev"],
["The Chant","Doyle W. Donehoo"],
["Voidborn","Pawel Perepelica"],
["Absolution","Pawel Perepelica"],
["Our Endless March","Dmitry V. Silantyev"]
],
10:[
["The Mourningstar","Jesper Kyd"],
["Path of Trust","Jesper Kyd"],
["Offworld Auspex","Jesper Kyd"],
["The Expanse","Pawel Perepelica"],
["Our Enemies Approach","Doyle W. Donehoo"],
["When the Stars Tremble","Pawel Perepelica"],
["Broadside Cannonade","Pawel Perepelica"],
["Across The Void","Guillaume David"],
["Voidborn","Pawel Perepelica"],
["Absolution","Pawel Perepelica"]
],
11:[
["Offworld Auspex","Jesper Kyd"],
["Nightsider","Jesper Kyd"],
["Shadow Quarters","Pawel Perepelica"],
["Visions","Jonathan Cacherat"],
["Lost Signal","Guillaume David"],
["Barren","Nikola Nikita Jeremić"],
["Death's Play","Vsevolod Borisov"],
["Martyr's Endurance","Pawel Perepelica"],
["Absolution","Pawel Perepelica"]
]};
var SCORE_META={
2:{estimatedMinutes:39,startCue:"Darkness Between the Stars",stage:"logged",reserveIndexes:[],finalCueIndex:10},
3:{estimatedMinutes:36,startCue:"EMV Charon",stage:"logged",reserveIndexes:[],finalCueIndex:12},
4:{estimatedMinutes:36,startCue:"Across The Void",stage:"ready",reserveIndexes:[],finalCueIndex:10},
5:{estimatedMinutes:34,startCue:"Planetfall",stage:"prepared",reserveIndexes:[6],finalCueIndex:9},
6:{estimatedMinutes:35,startCue:"Minus 273 Degrees",stage:"prepared",reserveIndexes:[],finalCueIndex:10},
7:{estimatedMinutes:34,startCue:"Shadow Quarters",stage:"prepared",reserveIndexes:[6],finalCueIndex:8},
8:{estimatedMinutes:32,startCue:"Impending Storm",stage:"logged",reserveIndexes:[],finalCueIndex:11},
9:{estimatedMinutes:32,startCue:"Shadow Quarters",stage:"prepared",reserveIndexes:[],finalCueIndex:8},
10:{estimatedMinutes:33,startCue:"The Mourningstar",stage:"prepared",reserveIndexes:[],finalCueIndex:9},
11:{estimatedMinutes:32,startCue:"Offworld Auspex",stage:"prepared",reserveIndexes:[],finalCueIndex:8}
};
var MUSIC_CALIBRATION={
avoid:["Side By Side","A Speech On Earth"],
strongFits:["Noosphere","Beyond The Asteroid Belt"],
readingProfile:{minutesPerPage:1.5,rollingChapterMinutes:34,window:[33,33,36,35,36,32]},
rule:"Target each chapter independently from scene structure, expected chapter size and observed reading pace. Do not add a generic end buffer just because the previous chapter ran short.",
notes:"Chapter VII ended 2–3 minutes after its score; Chapter VIII finished around 32 minutes with roughly 1.5 tracks left; Chapter IX ran about 30 minutes and needed roughly 1–2 more minutes. Treat each as chapter-specific calibration. For catastrophes the reader already knows are coming, prefer melancholy/inevitability over heroic epic scoring.",artists:["Guillaume David","Pawel Perepelica","Dmitry V. Silantyev","Nikolay Filipovich","Vsevolod Borisov","Nikola Nikita Jeremić","Doyle W. Donehoo","Jesper Kyd","Jonathan Cacherat"]
};
var LEITMOTIFS={
liminalGarro:{track:"Beyond The Asteroid Belt",artist:"Guillaume David",strength:"established by reader fit"},
blankPresence:{track:"Noosphere",artist:"Guillaume David",strength:"established by reader fit"},
eisensteinTension:{track:"Shadow Quarters",artist:"Pawel Perepelica",strength:"developing"}
};
var chapters=Array.from({length:20},(_,k)=>{const i=k+1,m=SCORE_META[i]||{};return{number:i,title:"CHAPTER "+String(i).padStart(2,"0"),estimatedMinutes:m.estimatedMinutes||null,startCue:m.startCue||null}});
