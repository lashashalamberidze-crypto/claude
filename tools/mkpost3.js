const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const foto='data:image/jpeg;base64,'+fs.readFileSync(__dirname+'/b_full1.jpg').toString('base64');
const W=1080;
const F="'Noto Sans Georgian','Noto Sans Armenian','Segoe UI',system-ui,sans-serif";
const COLS=[
 {fl:'🇬🇪',nm:'ქართული',tt:'ანთრაციტის ბრიკეტი',hk:'2× მეტი სითბო, ვიდრე შეშა',
  b:['🌡 7 951 კკალ/კგ','⏱ 8–12 საათი წვა','💨 უკვამლო, ცოტა ნაცარი','💰 ეკონომიური გათბობა']},
 {fl:'🇦🇿',nm:'Azərbaycan',tt:'Antrasit briket',hk:'Odundan 2× çox istilik',
  b:['🌡 7 951 kkal/kq','⏱ 8–12 saat yanma','💨 Tüstüsüz, az kül','💰 Qənaətli istilik']},
 {fl:'🇦🇲',nm:'Հայերեն',tt:'Անտրացիտային բրիկետ',hk:'Փայտից 2× ավելի ջերմություն',
  b:['🌡 7 951 կկալ/կգ','⏱ 8–12 ժամ այրում','💨 Առանց ծխի, քիչ մոխիր','💰 Խնայող ջեռուցում']}
];
const col=c=>`<div class="col"><div class="fl">${c.fl}</div><div class="nm">${c.nm}</div><div class="tt">${c.tt}</div><div class="hk">🔥 ${c.hk}</div><ul>${c.b.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
const html=`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box;font-family:${F}}
html,body{margin:0;background:#0d0703}
.p{width:${W}px;overflow:hidden;color:#fff;padding-bottom:0;
 background:radial-gradient(900px 500px at 82% 5%,rgba(201,112,26,.5),transparent 60%),radial-gradient(760px 520px at 8% 55%,rgba(180,70,10,.32),transparent 60%),linear-gradient(160deg,#241507,#160c04 60%,#0d0703)}
.hd{display:flex;align-items:center;gap:16px;padding:38px 46px 0}
.hd img{width:60px;height:60px}.hd b{font-size:36px;font-weight:900}
.kick{margin:16px 46px 0;display:inline-block;background:#F2B807;color:#3a2600;font-weight:900;font-size:25px;padding:9px 22px;border-radius:999px}
.foto{margin:16px 46px 0;height:300px;border-radius:18px;overflow:hidden;border:3px solid rgba(201,112,26,.55)}
.foto img{width:100%;height:100%;object-fit:cover}
.cols{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:20px 46px 0}
.col{background:rgba(255,255,255,.06);border:1.5px solid rgba(201,112,26,.4);border-radius:16px;padding:16px 12px}
.col .fl{font-size:34px;text-align:center;line-height:1}
.col .nm{text-align:center;font-weight:900;font-size:19px;color:#ffb347;margin:4px 0 7px}
.col .tt{font-weight:900;font-size:20px;line-height:1.12;text-align:center;min-height:44px;display:flex;align-items:center;justify-content:center}
.col .hk{text-align:center;font-weight:800;font-size:15.5px;color:#fff;background:rgba(242,184,7,.18);border:1px solid rgba(242,184,7,.4);border-radius:9px;padding:7px 6px;margin:8px 0 11px;min-height:56px;display:flex;align-items:center;justify-content:center}
.col ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:7px}
.col li{font-size:15.5px;font-weight:700;color:#ece1d0;line-height:1.25}
.cta{margin-top:22px;background:linear-gradient(90deg,#0B6B3C,#0F8A4D);padding:24px 46px}
.cta .u{font-size:46px;font-weight:900;color:#fff;line-height:1}
.cta .r{display:flex;justify-content:space-between;align-items:center;margin-top:10px;flex-wrap:wrap;gap:8px}
.cta .ph{font-size:34px;font-weight:900;color:#fff}
.cta .wh{font-size:20px;font-weight:700;color:#bff0d3;text-align:right}
</style>
<div class="p">
 <div class="hd"><img src="${logo}"><b>RAM IMPEX</b></div>
 <div><span class="kick">🔥 გათბობის სეზონი · İstiləşmə mövsümü · Ջեռուցման սեզոն</span></div>
 <div class="foto"><img src="${foto}"></div>
 <div class="cols">${COLS.map(col).join('')}</div>
 <div class="cta"><div class="u">ramimpex.com.ge/info</div>
  <div class="r"><div class="ph">📞 595 533 500</div><div class="wh">📍 საწყობი — ნატახტარი<br>Anbar · Պահեստ · თვითგატანა</div></div></div>
</div>`;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage({viewport:{width:W,height:1200},deviceScaleFactor:2});
 fs.writeFileSync(__dirname+'/_post3.html',html);await p.goto('file://'+__dirname+'/_post3.html');await p.waitForTimeout(350);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 const el=await p.$('.p');
 await el.screenshot({path:__dirname+'/RAM_IMPEX_post_3lang.jpg',quality:92,type:'jpeg'});
 await b.close();console.log('3-lang post rendered');
})();
