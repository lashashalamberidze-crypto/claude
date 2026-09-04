// RAM IMPEX — distributor banner, single trilingual (ka + az + hy)
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const foto='data:image/jpeg;base64,'+fs.readFileSync(__dirname+'/b_full1.jpg').toString('base64');
const W=1080,H=1200;
const F="'Noto Sans Georgian','Noto Sans Armenian','Segoe UI',system-ui,sans-serif";
const cards=[
 {fl:'🇬🇪',h:'ვეძებთ წარმომადგენლებს რეგიონებში',d:'ანთრაციტის ბრიკეტის დისტრიბუცია რეგიონებსა და მუნიციპალიტეტებში. საჭიროა <b>საცალო/საბითუმო გაყიდვების გამოცდილება</b>.'},
 {fl:'🇦🇿',h:'Bölgələrdə nümayəndələr axtarırıq',d:'Antrasit briketin distribusiyası bölgə və bələdiyyələrdə. <b>Pərakəndə/topdan satış təcrübəsi</b> tələb olunur.'},
 {fl:'🇦🇲',h:'Փնտրում ենք ներկայացուցիչներ մարզերում',d:'Անտրացիտային բրիկետի բաշխում մարզերում և համայնքներում. Պահանջվում է <b>մանրածախ/մեծածախ վաճառքի փորձ</b>.'}
];
const html=`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box;font-family:${F}}
.p{width:${W}px;height:${H}px;position:relative;overflow:hidden;color:#fff;
 background:radial-gradient(1000px 560px at 82% 2%,rgba(201,112,26,.5),transparent 60%),radial-gradient(820px 560px at 6% 84%,rgba(180,70,10,.32),transparent 60%),linear-gradient(158deg,#241507,#160c04 55%,#0b0603)}
.hd{display:flex;align-items:center;gap:16px;padding:38px 52px 0}
.hd img{width:64px;height:64px}.hd b{font-size:40px;font-weight:900;letter-spacing:.5px}
.kick{margin:20px 52px 0;display:inline-block;background:#F2B807;color:#3a2600;font-weight:900;font-size:26px;padding:11px 24px;border-radius:999px}
.h1{padding:12px 52px 2px;font-size:60px;line-height:1.02;font-weight:900;background:linear-gradient(180deg,#ffcf7a,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
.cards{margin:16px 52px 0;display:flex;flex-direction:column;gap:16px}
.c{background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.15);border-left:8px solid #F2B807;border-radius:18px;padding:20px 24px}
.c .fh{display:flex;align-items:center;gap:14px;margin-bottom:8px}
.c .fh .fl{font-size:42px;flex:0 0 auto}
.c .fh .h{font-size:33px;font-weight:900;color:#ffce7d;line-height:1.08}
.c .d{font-size:25px;font-weight:600;color:#f0e8dc;line-height:1.32}
.c .d b{color:#ffd486;font-weight:900}
.strip{margin:16px 52px 0;display:flex;align-items:center;gap:16px;background:linear-gradient(90deg,rgba(15,138,77,.22),rgba(255,255,255,.03));border:1.5px solid rgba(15,138,77,.5);border-radius:16px;padding:14px 20px}
.strip .ph{width:96px;height:96px;border-radius:12px;overflow:hidden;border:2px solid rgba(201,112,26,.6);flex:0 0 auto}
.strip .ph img{width:100%;height:100%;object-fit:cover}
.strip .t{font-size:24px;font-weight:800;color:#eafff2;line-height:1.28}
.strip .t b{color:#ffce7d}
.cta{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(90deg,#0B6B3C,#0F8A4D);padding:24px 52px}
.cta .r{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
.cta .big{font-size:30px;font-weight:900;color:#fff}
.cta .u{font-size:24px;font-weight:900;color:#eafff2;margin-top:2px}
.cta .ph{font-size:44px;font-weight:900;color:#fff}
</style>
<div class="p">
 <div class="hd"><img src="${logo}"><b>RAM IMPEX</b></div>
 <div><span class="kick">🤝 თანამშრომლობა · Əməkdaşlıq · Համագործակցություն</span></div>
 <div class="h1">🤝 ვეძებთ დისტრიბუტორებს</div>
 <div class="cards">${cards.map(c=>`<div class="c"><div class="fh"><span class="fl">${c.fl}</span><span class="h">${c.h}</span></div><div class="d">${c.d}</div></div>`).join('')}</div>
 <div class="strip"><div class="ph"><img src="${foto}"></div><div class="t">🔥 <b>ანთრაციტის ბრიკეტი</b> — ~2× მეტი სითბო ვიდრე შეშა, უკვამლო · ზამთრის ჰიტ-პროდუქტი</div></div>
 <div class="cta"><div class="r"><div><div class="big">📞 დაგვიკავშირდი · Əlaqə · Կապ</div><div class="u">🌐 ramimpex.com.ge/info</div></div><div class="ph">595 533 500</div></div></div>
</div>`;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:2});
 await p.setContent(html);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 await p.waitForTimeout(300);
 await p.screenshot({path:__dirname+'/RAM_IMPEX_distrib_3lang.jpg',quality:93,type:'jpeg'});
 await b.close();console.log('ok');
})();
