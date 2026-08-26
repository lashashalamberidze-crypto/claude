const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const OUT=__dirname+'/useicons';
if(!fs.existsSync(OUT))fs.mkdirSync(OUT);
const B='#111';
const S=(inner)=>`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const icons={
 // 2x more heat — flame
 heat:S(`<path d="M50 12 c13 17 21 24 21 40 a21 21 0 0 1-42 0 c0-11 8-19 11-27 c3 9 8 11 11 16 c3-11-3-19 0-29z" fill="${B}"/>`),
 // long burn — clock
 time:S(`<circle cx="50" cy="52" r="34" fill="none" stroke="${B}" stroke-width="7"/>
   <path d="M50 52 V30 M50 52 L66 62" fill="none" stroke="${B}" stroke-width="7" stroke-linecap="round"/>
   <path d="M38 10 h24" stroke="${B}" stroke-width="7" stroke-linecap="round"/>`),
 // stove / cooktop with pot + flame
 stove:S(`<g stroke="${B}" stroke-width="6" fill="none" stroke-linejoin="round">
   <rect x="24" y="40" width="52" height="14" rx="2"/>
   <path d="M30 54 v22 M70 54 v22"/></g>
   <g fill="${B}"><ellipse cx="50" cy="36" rx="20" ry="6"/><rect x="30" y="22" width="40" height="12" rx="3"/></g>
   <path d="M50 8 c4 5 6 7 6 11 a6 6 0 0 1-12 0 c0-3 2-5 3-7 c1 3 2 3 3 5z" fill="${B}"/>`),
 // home heating — house + flame
 home:S(`<path d="M50 16 L84 44 H72 V82 H28 V44 H16 Z" fill="none" stroke="${B}" stroke-width="6" stroke-linejoin="round"/>
   <path d="M50 50 c5 6 8 9 8 15 a8 8 0 0 1-16 0 c0-4 3-7 4-10 c1 3 3 4 4 6 c1-4-1-7 0-11z" fill="${B}"/>`),
 // greenhouse — arched roof + sprout
 greenhouse:S(`<path d="M22 84 V50 a28 28 0 0 1 56 0 V84" fill="none" stroke="${B}" stroke-width="6"/>
   <path d="M16 84 h68" stroke="${B}" stroke-width="6" stroke-linecap="round"/>
   <path d="M50 84 V58 M50 66 c-8 0-12-6-12-6 c0 0 8-2 12 6 M50 62 c8 0 12-6 12-6 c0 0-8-2-12 6" fill="none" stroke="${B}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`),
 // industrial boiler — factory
 industry:S(`<path d="M18 84 V50 l20 12 V50 l20 12 V34 h24 V84 Z" fill="none" stroke="${B}" stroke-width="6" stroke-linejoin="round"/>
   <path d="M14 84 h74" stroke="${B}" stroke-width="6" stroke-linecap="round"/>
   <rect x="70" y="18" width="10" height="16" fill="${B}"/>`),
};
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:300,height:300},deviceScaleFactor:4});
 for(const [k,svg] of Object.entries(icons)){
  await p.setContent(`<div style="width:200px;height:200px;padding:12px">${svg.replace('<svg','<svg width="200" height="200"')}</div>`);
  const el=await p.$('div');
  await el.screenshot({path:`${OUT}/${k}.png`,omitBackground:true});
 }
 await b.close();console.log('use icons rendered',Object.keys(icons).length);
})();
