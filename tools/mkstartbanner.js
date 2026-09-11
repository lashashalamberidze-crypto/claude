// RAM IMPEX — /start wide banner + og:image (1200x630, FB/link-preview standard)
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const foto='data:image/jpeg;base64,'+fs.readFileSync(__dirname+'/b_full1.jpg').toString('base64');
const W=1200,H=630;
const F="'Noto Sans Georgian','Segoe UI',system-ui,sans-serif";
const html=`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box;font-family:${F}}
.p{width:${W}px;height:${H}px;position:relative;overflow:hidden;color:#fff;display:flex;
 background:radial-gradient(760px 520px at 72% 0%,rgba(201,112,26,.5),transparent 60%),radial-gradient(560px 480px at 2% 92%,rgba(180,70,10,.32),transparent 60%),linear-gradient(158deg,#241507,#160c04 55%,#0b0603)}
.left{flex:1;padding:40px 16px 40px 48px;display:flex;flex-direction:column;justify-content:center}
.hd{display:flex;align-items:center;gap:13px}
.hd img{width:52px;height:52px}.hd b{font-size:31px;font-weight:900;letter-spacing:.5px}
.kick{margin-top:14px;align-self:flex-start;background:#F2B807;color:#3a2600;font-weight:900;font-size:21px;padding:7px 18px;border-radius:999px}
h1{margin-top:11px;font-size:60px;line-height:.98;font-weight:900;background:linear-gradient(180deg,#ffcf7a,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
.hook{margin-top:11px;font-size:26px;font-weight:900;color:#fff}
.hook span{color:#ffb347}
.url{margin-top:20px;align-self:flex-start;display:flex;align-items:center;gap:10px;background:linear-gradient(90deg,#0B6B3C,#0F8A4D);border-radius:13px;padding:12px 20px}
.url .u{font-size:29px;font-weight:900;color:#fff}
.row{margin-top:14px;display:flex;align-items:center;gap:22px;flex-wrap:wrap}
.row .ph{font-size:27px;font-weight:900;color:#fff}
.row .wh{font-size:19px;font-weight:700;color:#cdd9d0}
.right{width:430px;position:relative;flex:0 0 auto}
.right img{width:100%;height:100%;object-fit:cover}
.right::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#160c04,rgba(22,12,4,0) 26%)}
</style>
<div class="p">
 <div class="left">
  <div class="hd"><img src="${logo}"><b>RAM IMPEX</b></div>
  <div class="kick">🔥 გათბობის სეზონი</div>
  <h1>ანთრაციტის ბრიკეტი</h1>
  <div class="hook">ერთ ბმულზე — <span>ყველა ინფორმაცია</span> ⤵</div>
  <div class="url"><span class="u">🌐 ramimpex.com.ge/start</span></div>
  <div class="row"><div class="ph">📞 595 533 500</div><div class="wh">📍 საწყობი — ნატახტარი</div></div>
 </div>
 <div class="right"><img src="${foto}"></div>
</div>`;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb','--no-sandbox']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:2});
 fs.writeFileSync(__dirname+'/_startbanner.html',html);
 await p.goto('file://'+__dirname+'/_startbanner.html');await p.waitForTimeout(350);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 await p.screenshot({path:__dirname+'/RAM_IMPEX_start_banner.jpg',quality:92,type:'jpeg'});
 console.log('start banner done');
 await b.close();
})();
