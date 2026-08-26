const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const OUT=__dirname+'/pkgicons';
// Each icon: a 100x100 viewBox black-on-white pictogram (ISO 780 style)
const S=(inner)=>`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#fff"/>${inner}</svg>`;
const B='#111';
const icons={
 // Keep dry — umbrella + rain
 keepdry:S(`
  <g fill="${B}">
   <ellipse cx="50" cy="52" rx="30" ry="16"/>
   <rect x="4" y="50" width="92" height="8"/>
  </g>
  <path d="M50 52 V78 a9 9 0 0 1-18 0" fill="none" stroke="${B}" stroke-width="6" stroke-linecap="round"/>
  <g fill="${B}">
   ${[[22,20],[37,14],[52,18],[67,13],[81,22]].map(([x,y])=>`<path d="M${x} ${y} c-4 6-4 9 0 9 c4 0 4-3 0-9z"/>`).join('')}
  </g>`),
 // Fragile — glass
 fragile:S(`<g fill="none" stroke="${B}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
   <path d="M34 18 h20 l-3 26 a7 7 0 0 1-14 0 z"/>
   <line x1="44" y1="51" x2="44" y2="74"/><line x1="32" y1="78" x2="56" y2="78"/>
   <path d="M66 20 l14 30 M80 20 l-14 30" stroke-width="5"/>
  </g>`),
 // This way up
 thiswayup:S(`<g stroke="${B}" stroke-width="6" fill="${B}" stroke-linejoin="round">
   <line x1="34" y1="82" x2="34" y2="26"/><path d="M34 16 l-11 16 h22 z" stroke="none"/>
   <line x1="66" y1="82" x2="66" y2="26"/><path d="M66 16 l-11 16 h22 z" stroke="none"/>
   <line x1="16" y1="88" x2="84" y2="88" stroke-width="6"/>
  </g>`),
 // Keep away from sunlight / heat — box under sun
 nosun:S(`<g fill="${B}"><circle cx="50" cy="30" r="12"/>
   ${Array.from({length:8}).map((_,i)=>{const a=i*Math.PI/4;const x1=50+Math.cos(a)*17,y1=30+Math.sin(a)*17,x2=50+Math.cos(a)*24,y2=30+Math.sin(a)*24;return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${B}" stroke-width="4" stroke-linecap="round"/>`;}).join('')}
   <rect x="30" y="56" width="40" height="30" fill="none" stroke="${B}" stroke-width="5"/>
  </g>`),
 // Keep away from fire / flame with bar
 nofire:S(`<path d="M50 20 c10 12 16 18 16 30 a16 16 0 0 1-32 0 c0-8 6-14 8-20 c2 6 6 8 8 12 c2-8-2-14 0-22z" fill="${B}"/>
  <line x1="16" y1="16" x2="84" y2="84" stroke="${B}" stroke-width="7"/>`),
 // Flammable (GHS flame)
 flammable:S(`<path d="M50 14 c12 16 20 22 20 38 a20 20 0 0 1-40 0 c0-10 8-18 10-26 c3 8 8 10 10 15 c3-10-3-18 0-27z" fill="${B}"/>
  <path d="M20 88 h60" stroke="${B}" stroke-width="6"/>`),
 // Keep away from children
 nochildren:S(`<g fill="${B}"><circle cx="40" cy="30" r="9"/>
   <path d="M40 40 c-10 0-16 8-16 18 v14 h8 v14 h16 v-14 h8 v-14 c0-10-6-18-16-18z"/>
   <circle cx="70" cy="34" r="6"/><path d="M70 41 c-7 0-11 5-11 12 v10 h6 v11 h10 v-11 h6 v-10 c0-7-4-12-11-12z"/>
  </g>
  <circle cx="50" cy="50" r="42" fill="none" stroke="${B}" stroke-width="6"/>
  <line x1="21" y1="21" x2="79" y2="79" stroke="${B}" stroke-width="6"/>`),
 // Do not stack
 nostack:S(`<g fill="none" stroke="${B}" stroke-width="5">
   <rect x="30" y="30" width="40" height="22"/><rect x="30" y="56" width="40" height="22"/></g>
  <line x1="18" y1="18" x2="82" y2="82" stroke="${B}" stroke-width="7"/>`),
 // Stacking limit (n boxes)
 stacklimit:S(`<g fill="none" stroke="${B}" stroke-width="5">
   <rect x="34" y="20" width="32" height="18"/><rect x="34" y="42" width="32" height="18"/><rect x="34" y="64" width="32" height="18"/></g>`),
 // Handle with care (hands under box)
 handlecare:S(`<g fill="none" stroke="${B}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
   <rect x="36" y="24" width="28" height="24"/>
   <path d="M18 62 c6-6 12-4 16 0 l6 6 M82 62 c-6-6-12-4-16 0 l-6 6"/>
   <path d="M22 60 v16 M78 60 v16"/></g>`),
 // Recyclable
 recycle:S(`<g fill="none" stroke="${B}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
   <path d="M50 22 l10 17 -8 0 M60 39 l-20 0"/>
   <path d="M30 44 l-9 16 7 4 M21 60 l10 18"/>
   <path d="M70 44 l9 16 -7 4 M79 60 l-10 18"/>
   <path d="M35 82 l30 0"/></g>
  <g fill="${B}"><path d="M50 18 l7 12 -14 0z"/><path d="M20 56 l-3 14 12-5z"/><path d="M80 56 l3 14 -12-5z"/></g>`),
 // Ventilated / keep in ventilated place (box with air arrows)
 ventilate:S(`<g fill="none" stroke="${B}" stroke-width="5"><rect x="34" y="34" width="32" height="32"/></g>
  <g stroke="${B}" stroke-width="4" stroke-linecap="round">
   <path d="M14 44 h14 M14 56 h14 M72 44 h14 M72 56 h14"/></g>
  <g fill="${B}"><path d="M28 44 l-6-3 0 6z" transform="rotate(180 25 44)"/></g>
  <path d="M20 40 q6 4 0 8 M78 40 q6 4 0 8" fill="none" stroke="${B}" stroke-width="4"/>`),
 // No hooks
 nohooks:S(`<path d="M40 22 v14 a12 12 0 1 0 24 0" fill="none" stroke="${B}" stroke-width="6" stroke-linecap="round"/>
  <circle cx="52" cy="54" r="5" fill="${B}"/>
  <line x1="18" y1="18" x2="82" y2="82" stroke="${B}" stroke-width="7"/>`),
 // Temperature limits
 temp:S(`<g fill="none" stroke="${B}" stroke-width="5"><path d="M46 24 a6 6 0 0 1 12 0 v34 a12 12 0 1 1-12 0z"/></g>
  <circle cx="52" cy="70" r="7" fill="${B}"/><rect x="50" y="40" width="4" height="26" fill="${B}"/>
  <g stroke="${B}" stroke-width="3"><line x1="62" y1="34" x2="70" y2="34"/><line x1="62" y1="46" x2="70" y2="46"/><line x1="62" y1="58" x2="70" y2="58"/></g>`),
 // Center of gravity
 gravity:S(`<circle cx="50" cy="50" r="26" fill="none" stroke="${B}" stroke-width="5"/>
  <path d="M50 24 v52 M24 50 h52" stroke="${B}" stroke-width="5"/>
  <path d="M50 50 m0 0 a13 13 0 0 1 13 13 l-13 0z" fill="${B}"/><path d="M50 50 m0 0 a13 13 0 0 1-13-13 l0 13z" fill="${B}"/>`),
 // Weight / net mass (box with kg)
 weight:S(`<g fill="none" stroke="${B}" stroke-width="5"><path d="M32 40 h36 l6 40 h-48z"/></g>
  <text x="50" y="70" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle" fill="${B}">კგ</text>
  <path d="M42 40 a8 8 0 0 1 16 0" fill="none" stroke="${B}" stroke-width="4"/>`),
};
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:300,height:300},deviceScaleFactor:4});
 for(const [k,svg] of Object.entries(icons)){
  await p.setContent(`<div style="width:220px;height:220px;padding:10px;background:#fff">${svg.replace('<svg','<svg width="220" height="220"')}</div>`);
  const el=await p.$('div');
  await el.screenshot({path:`${OUT}/${k}.png`});
 }
 await b.close();
 console.log('rendered',Object.keys(icons).length,'icons');
})();
