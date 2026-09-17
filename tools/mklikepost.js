// RAM IMPEX — "დაალაიქე გვერდი" პოსტი (1080x1350) + ბანერი (1200x630)
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const foto='data:image/jpeg;base64,'+fs.readFileSync(__dirname+'/b_full1.jpg').toString('base64');
const F="'Noto Sans Georgian','Segoe UI',system-ui,sans-serif";

// ---------- POST 1080x1350 ----------
const PW=1080,PH=1350;
const post=`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box;font-family:${F}}
.p{width:${PW}px;height:${PH}px;position:relative;overflow:hidden;color:#fff;
 background:radial-gradient(900px 500px at 80% 6%,rgba(201,112,26,.5),transparent 60%),radial-gradient(760px 520px at 10% 72%,rgba(180,70,10,.35),transparent 60%),linear-gradient(160deg,#241507,#160c04 55%,#0d0703)}
.hd{display:flex;align-items:center;gap:16px;padding:40px 48px 0}.hd img{width:64px;height:64px}.hd b{font-size:38px;font-weight:900;letter-spacing:.5px}
.kick{margin:20px 48px 0;display:inline-flex;align-items:center;gap:10px;background:#1877F2;color:#fff;font-weight:900;font-size:28px;padding:11px 24px;border-radius:999px}
.ti{padding:14px 48px 0}.ti h1{font-size:76px;line-height:1.0;font-weight:900;background:linear-gradient(180deg,#ffcf7a,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
.hook{margin:14px 48px 0;font-size:33px;font-weight:800;color:#f3e7d6;line-height:1.28}
.hook b{color:#ffb347}
.foto{margin:20px 48px 0;height:330px;border-radius:20px;overflow:hidden;border:3px solid rgba(201,112,26,.55)}
.foto img{width:100%;height:100%;object-fit:cover}
.bl{margin:22px 48px 0;display:flex;flex-direction:column;gap:12px}
.bi{background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.16);border-radius:14px;padding:15px 20px;font-size:27px;font-weight:800}
.cta{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(90deg,#1877F2,#0f5fc2);padding:24px 48px}
.cta .c{font-size:30px;font-weight:900;color:#fff}
.cta .u{font-size:34px;font-weight:900;color:#fff;margin-top:4px}
.cta .r{display:flex;justify-content:space-between;align-items:center;margin-top:10px;flex-wrap:wrap;gap:8px}
.cta .ph{font-size:32px;font-weight:900;color:#fff}
</style>
<div class="p">
 <div class="hd"><img src="${logo}"><b>RAM IMPEX</b></div>
 <div><span class="kick">👍 დაალაიქე ჩვენი გვერდი</span></div>
 <div class="ti"><h1>სად იყიდი ანთრაციტს?</h1></div>
 <div class="hook">გაიგე, სად შეგიძლია შეიძინო <b>ანთრაციტის ბრიკეტი შენს რეგიონში</b> 👇</div>
 <div class="foto"><img src="${foto}"></div>
 <div class="bl">
  <div class="bi">📍 დისტრიბუტორები რეგიონებში</div>
  <div class="bi">🆕 ახალი წერტილები — ეტაპობრივად</div>
  <div class="bi">🔔 დაალაიქე, რომ არ გამოგრჩეს</div>
 </div>
 <div class="cta"><div class="c">👍 Like & Follow — RAM IMPEX</div><div class="u">🌐 ramimpex.com.ge/contact</div>
  <div class="r"><div class="ph">📞 595 533 500</div><div style="font-size:21px;font-weight:700;color:#dcebff">📍 საწყობი — ნატახტარი</div></div></div>
</div>`;

// ---------- BANNER 1200x630 ----------
const BW=1200,BH=630;
const banner=`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box;font-family:${F}}
.p{width:${BW}px;height:${BH}px;position:relative;overflow:hidden;color:#fff;display:flex;
 background:radial-gradient(760px 520px at 72% 0%,rgba(201,112,26,.5),transparent 60%),linear-gradient(158deg,#241507,#160c04 55%,#0b0603)}
.left{flex:1;padding:40px 16px 40px 48px;display:flex;flex-direction:column;justify-content:center}
.hd{display:flex;align-items:center;gap:13px}.hd img{width:52px;height:52px}.hd b{font-size:31px;font-weight:900}
.kick{margin-top:14px;align-self:flex-start;background:#1877F2;color:#fff;font-weight:900;font-size:22px;padding:8px 20px;border-radius:999px}
h1{margin-top:12px;font-size:62px;line-height:.98;font-weight:900;background:linear-gradient(180deg,#ffcf7a,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
.hk{margin-top:12px;font-size:27px;font-weight:800;color:#f3e7d6;line-height:1.25}.hk b{color:#ffb347}
.cta{margin-top:20px;align-self:flex-start;display:flex;align-items:center;gap:10px;background:#1877F2;border-radius:13px;padding:12px 22px}
.cta .u{font-size:28px;font-weight:900;color:#fff}
.row{margin-top:14px;font-size:24px;font-weight:900}
.right{width:430px;position:relative;flex:0 0 auto}.right img{width:100%;height:100%;object-fit:cover}
.right::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#160c04,rgba(22,12,4,0) 26%)}
</style>
<div class="p"><div class="left">
 <div class="hd"><img src="${logo}"><b>RAM IMPEX</b></div>
 <div class="kick">👍 დაალაიქე ჩვენი გვერდი</div>
 <h1>სად იყიდი ანთრაციტს?</h1>
 <div class="hk">გაიგე, სად შეიძენ <b>ბრიკეტს შენს რეგიონში</b> — დისტრიბუტორები ეტაპობრივად 📍</div>
 <div class="cta"><span class="u">👍 Like & Follow</span></div>
 <div class="row">📞 595 533 500 · 🌐 ramimpex.com.ge/contact</div>
</div><div class="right"><img src="${foto}"></div></div>`;

(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb','--no-sandbox']});
 const p=await b.newPage({deviceScaleFactor:2});
 await p.setViewportSize({width:PW,height:PH});
 fs.writeFileSync(__dirname+'/_likepost.html',post);
 await p.goto('file://'+__dirname+'/_likepost.html');await p.waitForTimeout(350);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 await p.screenshot({path:__dirname+'/RAM_IMPEX_like_post_ka.jpg',quality:92,type:'jpeg'});
 await p.setViewportSize({width:BW,height:BH});
 fs.writeFileSync(__dirname+'/_likebanner.html',banner);
 await p.goto('file://'+__dirname+'/_likebanner.html');await p.waitForTimeout(300);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 await p.screenshot({path:__dirname+'/RAM_IMPEX_like_banner.jpg',quality:92,type:'jpeg'});
 await b.close();console.log('like post + banner done');
})();
