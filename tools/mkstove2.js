// RAM IMPEX — clean image only: cast-iron grate empty vs with glowing briquettes (no text)
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const W=1280,H=1000;
function bars(w){let s='';const n=13;for(let i=0;i<n;i++){s+=`<div style="position:absolute;left:26px;right:26px;top:${26+i*60}px;height:30px;border-radius:16px;background:linear-gradient(180deg,#525255,#26262a 58%,#0e0e10);box-shadow:0 4px 6px rgba(0,0,0,.65),inset 0 2px 3px rgba(255,255,255,.13)"></div>`;}return s;}
function brq(x,y,r,glow){return `<div style="position:absolute;left:${x}px;top:${y}px;width:112px;height:76px;border-radius:50%;transform:rotate(${r}deg);
 background:radial-gradient(closest-side at 40% 34%, ${glow?'#ffcf7a':'#5c5c60'}, ${glow?'#e07a1a':'#3c3c40'} 48%, ${glow?'#7a2e08':'#171719'} 90%);
 box-shadow:${glow?'0 0 34px 9px rgba(255,120,20,.6),':''}inset 0 -7px 12px rgba(0,0,0,.55)"></div>`;}
let pile='';
const P=[[70,150,-8,1],[180,138,6,1],[290,150,-4,1],[400,146,8,1],[120,200,10,1],[235,205,-10,1],[350,200,5,1],[50,235,4,0],[455,235,-6,1],[175,255,-6,1],[300,258,8,1],[110,300,6,0],[240,305,-4,1],[370,300,7,1],[200,345,4,1],[320,348,-8,0]];
P.forEach(p=>pile+=brq(p[0],p[1],p[2],p[3]));
const html=`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}
.p{width:${W}px;height:${H}px;position:relative;overflow:hidden;
 background:radial-gradient(900px 700px at 78% 60%,rgba(201,112,26,.28),transparent 60%),radial-gradient(700px 600px at 20% 30%,rgba(60,60,70,.25),transparent 60%),linear-gradient(160deg,#17130e,#0c0a07 60%,#070504)}
.wrap{position:absolute;inset:0;display:flex;gap:40px;align-items:center;justify-content:center;padding:70px}
.stove{position:relative;flex:1;height:820px;border-radius:26px;overflow:hidden;border:8px solid #2c2c30;
 background:linear-gradient(180deg,#1b1b1e,#0b0b0d);box-shadow:inset 0 0 60px rgba(0,0,0,.75),0 20px 50px rgba(0,0,0,.5)}
.stove.hot{border-color:#3c2b13}
.glow{position:absolute;left:0;right:0;bottom:0;height:82%;background:radial-gradient(62% 72% at 50% 92%,rgba(255,125,20,.6),rgba(200,60,10,.16) 55%,transparent 76%)}
.pile{position:absolute;left:20px;right:20px;top:230px;height:440px}
</style>
<div class="p"><div class="wrap">
 <div class="stove">${bars()}</div>
 <div class="stove hot"><div class="glow"></div>${bars()}<div class="pile">${pile}</div></div>
</div></div>`;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:2});
 await p.setContent(html);await p.waitForTimeout(200);
 await p.screenshot({path:__dirname+'/RAM_IMPEX_stove_clean.jpg',quality:94,type:'jpeg'});
 await b.close();console.log('ok');
})();
