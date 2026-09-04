// RAM IMPEX — round wire-mesh plate basket with anthracite briquettes (clean image)
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const W=1080,H=1080;
function brq(x,y,r,s){return `<div style="position:absolute;left:${x}px;top:${y}px;width:${118*s}px;height:${84*s}px;border-radius:50%;transform:rotate(${r}deg);
 background:radial-gradient(closest-side at 42% 34%, #55555a, #35353a 52%, #16161a 92%);
 box-shadow:inset 0 -8px 14px rgba(0,0,0,.55), 0 6px 12px rgba(0,0,0,.45);border:1px solid rgba(0,0,0,.3)"></div>`;}
let pile='';
// piled briquettes centered in the round mesh plate (plate box 900x620, center ~450,310)
const rows=[{y:195,n:4},{y:250,n:5},{y:305,n:5},{y:360,n:5},{y:415,n:4},{y:465,n:3}];
rows.forEach(row=>{const span=(row.n-1)*90;const x0=450-span/2;for(let i=0;i<row.n;i++){const x=x0+i*90+(Math.random()*10-5);const s=0.98+Math.random()*0.14;const r=Math.round(Math.random()*18-9);pile+=brq(Math.round(x-59*s),Math.round(row.y-42*s),r,s);}});
const html=`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}
.p{width:${W}px;height:${H}px;position:relative;overflow:hidden;
 background:radial-gradient(760px 620px at 50% 42%,#ffffff,#e9edf1 60%,#d6dbe1)}
.shadow{position:absolute;left:50%;top:640px;transform:translateX(-50%);width:820px;height:150px;border-radius:50%;
 background:radial-gradient(closest-side,rgba(30,35,40,.34),transparent 72%)}
.plate{position:absolute;left:50%;top:150px;transform:translateX(-50%);width:900px;height:620px}
/* outer metallic rim ring */
.rim{position:absolute;inset:0;border-radius:50%;
 background:linear-gradient(150deg,#f2f4f7,#b9c0c8 30%,#8f97a1 55%,#c7ced6 75%,#eef1f4);
 box-shadow:0 18px 34px rgba(0,0,0,.28)}
/* recessed mesh area */
.dish{position:absolute;inset:34px;border-radius:50%;overflow:hidden;
 background:radial-gradient(closest-side at 50% 46%, #3a3f45, #23272c 62%, #14171a);
 box-shadow:inset 0 14px 30px rgba(0,0,0,.6)}
/* wire crosshatch */
.mesh{position:absolute;inset:0;
 background:
  repeating-linear-gradient(36deg, transparent 0 30px, rgba(214,222,232,.0) 30px 31px, rgba(214,222,232,.6) 31px 34px, rgba(150,158,168,.6) 34px 36px, transparent 36px 66px),
  repeating-linear-gradient(-36deg, transparent 0 30px, rgba(214,222,232,.55) 31px 34px, rgba(150,158,168,.55) 34px 36px, transparent 36px 66px);
 opacity:.9}
.rimline{position:absolute;inset:24px;border-radius:50%;border:6px solid rgba(230,235,240,.55);box-shadow:inset 0 0 0 3px rgba(0,0,0,.25)}
</style>
<div class="p">
 <div class="shadow"></div>
 <div class="plate">
   <div class="rim"></div>
   <div class="dish"><div class="mesh"></div></div>
   <div class="rimline"></div>
   ${pile}
 </div>
</div>`;
(async()=>{
 const {chromium:cr}=require('/opt/node22/lib/node_modules/playwright');
 const b=await cr.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:2});
 await p.setContent(html);await p.waitForTimeout(200);
 await p.screenshot({path:__dirname+'/RAM_IMPEX_mesh.jpg',quality:94,type:'jpeg'});
 await b.close();console.log('ok');
})();
