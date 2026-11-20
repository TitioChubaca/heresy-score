/* Coherent accessibility pass without replacing the established archive look. */
(()=>{"use strict";
const style=document.createElement("style");style.id="hs-readable-design-v2";
style.textContent=`
:root{--body-scale:1}
html{font-size:14px}
body{line-height:1.5}
.small,.spoiler-note,.book-record .bmeta,.world-kind,.world-note,.person-summary,.person-note,.log-meta{font-size:12px;line-height:1.55}
.top,.eyebrow,.sub,.archive-code,.archive-head .small,.bookhead .chip,.details,.clearance,.visual-badge{font-size:11px;line-height:1.5;letter-spacing:.06em}
.panel-title h2,.panel h2{font-size:14px;letter-spacing:.09em;line-height:1.35}
.bookhead .title{font-size:clamp(27px,6.6vw,36px);line-height:1.2}
.chapter .chname{font-size:17px;letter-spacing:.08em}
.chapter .details{font-size:13px;line-height:1.6}
.btn,.hs-deck-footer button,.hs-deck-arrow,.navitem{min-height:44px;font-size:12px;line-height:1.4}
.btn{padding:11px 13px}
.navitem{font-size:12px}
input,select,textarea{font-size:14px;min-width:0}
.log-card,.person,.world-card{overflow-wrap:anywhere}
.person-status,.visual-badge,.clearance{font-size:11px;letter-spacing:.03em}
#progressText,#paceText{font-size:12px;line-height:1.6}
#hsDeckStatus,.hs-deck-footer .hs-deck-hint{font-size:11px;line-height:1.5}
.hs-deck-eyebrow{font-size:10px}
#hsDeckTitle{font-size:21px}
.hs-audit-inline{font-size:12px!important;line-height:1.6!important}
.actions{gap:8px}
input:focus-visible,select:focus-visible,button:focus-visible,.person:focus-visible,.world-card:focus-visible{
 outline:2px solid var(--green);outline-offset:3px
}
@media(max-width:520px){
 .shell{padding-left:12px;padding-right:12px}
 .top{font-size:10px}
 .mast{gap:8px;margin:12px 0}
 .mast h1{font-size:19px;letter-spacing:.08em}
 .mast .sub{font-size:10px}
 .bookhead{padding:15px}
 .bookhead .chip{font-size:10px}
 .chapter{padding:14px}
 .chapter .actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
 .chapter .actions .btn{width:100%;min-width:0;font-size:12px}
 .chapter .hs-audit-inline{grid-column:1/-1}
 .person-copy{padding:12px}
 .archive-head{gap:10px}
}
@media(prefers-reduced-motion:reduce){*{animation-duration:.001ms!important;transition-duration:.001ms!important}}
`;
document.head.append(style);
})();
