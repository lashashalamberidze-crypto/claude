// RAM IMPEX — corrugated paper tube (გილზა) product image
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const S=1000;
const html=`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box;font-family:'Noto Sans Georgian',system-ui,sans-serif}
.stage{width:${S}px;height:${S}px;position:relative;overflow:hidden;
 background:radial-gradient(700px 520px at 50% 38%,#ffffff,#eef1f4 62%,#dfe4e9)}
/* ground shadow */
.sh{position:absolute;left:50%;bottom:120px;transform:translateX(-50%);width:340px;height:60px;border-radius:50%;
 background:radial-gradient(closest-side,rgba(40,40,40,.28),transparent 72%)}
.tube{position:absolute;left:50%;top:130px;transform:translateX(-50%);width:250px;height:720px}
/* body cylinder */
.body{position:absolute;top:40px;left:0;right:0;bottom:0;border-radius:0 0 14px 14px;
 background:
  repeating-linear-gradient(66deg, rgba(150,120,60,.14) 0 3px, rgba(255,255,255,0) 3px 40px),
  linear-gradient(90deg,#b9ad8f 0%,#d9cfb6 14%,#f4efe2 50%,#d9cfb6 86%,#b0a488 100%);
 box-shadow:inset 0 -30px 40px rgba(90,74,40,.14)}
/* winding tape hints (yellow/green like photos) */
.tape{position:absolute;left:0;right:0;height:8px;background:linear-gradient(90deg,transparent,rgba(224,178,20,.55),transparent);opacity:.5}
/* top rim (cut edge) */
.rim{position:absolute;top:0;left:0;right:0;height:96px;border-radius:50%;
 background:linear-gradient(90deg,#a99c7c,#efe9db 45%,#f6f1e6 55%,#a99c7c);
 box-shadow:0 3px 8px rgba(0,0,0,.12)}
/* hole */
.hole{position:absolute;top:20px;left:26px;right:26px;height:60px;border-radius:50%;
 background:radial-gradient(closest-side at 50% 42%,#7a715c,#4a4335 55%,#241f16);
 box-shadow:inset 0 6px 14px rgba(0,0,0,.6)}
.brand{position:absolute;left:36px;bottom:34px;display:flex;align-items:center;gap:12px;opacity:.92}
.brand img{width:52px;height:52px}
.brand b{font-size:34px;font-weight:900;color:#0B6B3C;letter-spacing:.4px}
.tag{position:absolute;right:34px;top:34px;background:#0B6B3C;color:#fff;font-weight:900;font-size:26px;padding:10px 20px;border-radius:999px}
</style>
<div class="stage">
 <div class="tag">📦 გოფრირებული მილი</div>
 <div class="sh"></div>
 <div class="tube">
   <div class="body">
     <div class="tape" style="top:120px"></div><div class="tape" style="top:250px;background:linear-gradient(90deg,transparent,rgba(20,150,80,.5),transparent)"></div>
     <div class="tape" style="top:400px"></div><div class="tape" style="top:540px;background:linear-gradient(90deg,transparent,rgba(20,150,80,.5),transparent)"></div>
   </div>
   <div class="rim"></div>
   <div class="hole"></div>
 </div>
 <div class="brand"><img src="${logo}"><b>RAM IMPEX</b></div>
</div>`;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage({viewport:{width:S,height:S},deviceScaleFactor:2});
 await p.setContent(html);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 await p.waitForTimeout(200);
 await p.screenshot({path:__dirname+'/RAM_IMPEX_gofrirebuli_mili.jpg',type:'jpeg',quality:92});
 await b.close();console.log('ok');
})();
