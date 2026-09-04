// RAM IMPEX — cast-iron grate + briquettes vs empty (educational image)
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const W=1080,H=1140;
const F="'Noto Sans Georgian','Segoe UI',system-ui,sans-serif";
// grate bars
function bars(){let s='';for(let i=0;i<7;i++){s+=`<div style="position:absolute;left:24px;right:24px;top:${28+i*46}px;height:26px;border-radius:14px;background:linear-gradient(180deg,#4a4a4d,#232326 60%,#111);box-shadow:0 3px 5px rgba(0,0,0,.6),inset 0 2px 2px rgba(255,255,255,.12)"></div>`;}return s;}
// a briquette (oval), glowing optionally
function brq(x,y,r,glow){return `<div style="position:absolute;left:${x}px;top:${y}px;width:96px;height:66px;border-radius:50%;transform:rotate(${r}deg);
 background:radial-gradient(closest-side at 40% 35%, ${glow?'#ffb347':'#5a5a5e'}, ${glow?'#c9541a':'#3a3a3e'} 55%, #1a1a1c);
 box-shadow:${glow?'0 0 26px 6px rgba(255,120,20,.55),':''}inset 0 -6px 10px rgba(0,0,0,.5)"></div>`;}
let pile='';
const P=[[60,150,-8,1],[150,140,6,1],[240,152,-4,1],[110,190,10,1],[200,196,-10,1],[40,205,4,0],[280,200,8,1],[150,235,-6,1],[75,255,6,0],[235,252,-8,1],[160,285,4,1]];
P.forEach(p=>pile+=brq(p[0],p[1],p[2],p[3]));
const html=`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box;font-family:${F}}
.p{width:${W}px;height:${H}px;position:relative;overflow:hidden;color:#fff;
 background:radial-gradient(1000px 560px at 82% 2%,rgba(201,112,26,.4),transparent 60%),linear-gradient(158deg,#241507,#160c04 55%,#0b0603)}
.hd{display:flex;align-items:center;gap:16px;padding:36px 52px 0}
.hd img{width:60px;height:60px}.hd b{font-size:38px;font-weight:900}
.h1{padding:14px 52px 0;font-size:52px;line-height:1.05;font-weight:900;background:linear-gradient(180deg,#ffcf7a,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
.panels{display:flex;gap:24px;margin:26px 52px 0}
.panel{flex:1}
.stove{position:relative;height:420px;border-radius:22px;overflow:hidden;border:6px solid #2b2b2e;
 background:linear-gradient(180deg,#1a1a1d,#0c0c0e);box-shadow:inset 0 0 40px rgba(0,0,0,.7)}
.stove.hot{border-color:#3a2a12}
.glow{position:absolute;left:0;right:0;bottom:0;height:80%;background:radial-gradient(60% 70% at 50% 90%,rgba(255,120,20,.55),rgba(200,60,10,.15) 55%,transparent 75%)}
.lbl{margin-top:14px;text-align:center}
.lbl .t{font-size:30px;font-weight:900}
.lbl .s{font-size:21px;font-weight:700;color:#cbbfae;margin-top:2px}
.bad .t{color:#c9b8a2}.good .t{color:#ffce7d}
.why{margin:28px 52px 0;background:rgba(15,138,77,.16);border:2px solid rgba(15,138,77,.5);border-radius:18px;padding:22px 26px}
.why h3{font-size:28px;font-weight:900;color:#8ff0bd;margin-bottom:12px}
.why .li{font-size:26px;font-weight:700;color:#eef7f0;line-height:1.3;margin-top:12px}
.why .li b{color:#ffd486}
.cta{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(90deg,#0B6B3C,#0F8A4D);padding:24px 52px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
.cta .u{font-size:26px;font-weight:900;color:#eafff2}.cta .ph{font-size:42px;font-weight:900;color:#fff}
</style>
<div class="p">
 <div class="hd"><img src="${logo}"><b>RAM IMPEX</b></div>
 <div class="h1">🔥 თუჯის ღუმელი — იდეალურია<br>ანთრაციტის ბრიკეტისთვის</div>
 <div class="panels">
   <div class="panel">
     <div class="stove">${bars()}</div>
     <div class="lbl bad"><div class="t">❌ ცარიელი თუჯის ბადე</div><div class="s">მზადაა ჩასაყრელად</div></div>
   </div>
   <div class="panel">
     <div class="stove hot"><div class="glow"></div>${bars()}<div style="position:absolute;left:24px;right:24px;top:40px;height:360px">${pile}</div></div>
     <div class="lbl good"><div class="t">✅ ბრიკეტით სავსე</div><div class="s">ღვივის სტაბილურად, დიდხანს</div></div>
   </div>
 </div>
 <div class="why"><h3>🔩 რატომ თუჯი?</h3>
   <div class="li">🌡 <b>უძლებს მაღალ ტემპერატურას</b> — ბრიკეტი ცხლად იწვის.</div>
   <div class="li">♨️ <b>აკუმულირებს და თანაბრად ასხივებს</b> სითბოს ოთახში.</div>
   <div class="li">⏱ <b>დიდხანს ინახავს სითბოს</b> — ჩაქრობის შემდეგაც თბილია.</div>
 </div>
 <div class="cta"><div><div class="u">🌐 ramimpex.com.ge/info</div><div style="font-size:20px;font-weight:700;color:#bff0d3">📍 საწყობი — ნატახტარი</div></div><div class="ph">📞 595 533 500</div></div>
</div>`;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:2});
 await p.setContent(html);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 await p.waitForTimeout(250);
 await p.screenshot({path:__dirname+'/RAM_IMPEX_stove.jpg',quality:93,type:'jpeg'});
 await b.close();console.log('ok');
})();
