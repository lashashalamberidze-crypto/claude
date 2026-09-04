// RAM IMPEX — distributor recruitment banner (1080x1350)
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const foto='data:image/jpeg;base64,'+fs.readFileSync(__dirname+'/b_full1.jpg').toString('base64');
const W=1080,H=1150;
const F="'Noto Sans Georgian','Segoe UI',system-ui,sans-serif";
const html=`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box;font-family:${F}}
.p{width:${W}px;height:${H}px;position:relative;overflow:hidden;color:#fff;
 background:radial-gradient(1000px 560px at 82% 2%,rgba(201,112,26,.5),transparent 60%),radial-gradient(820px 560px at 6% 82%,rgba(180,70,10,.32),transparent 60%),linear-gradient(158deg,#241507,#160c04 55%,#0b0603)}
.hd{display:flex;align-items:center;gap:16px;padding:40px 52px 0}
.hd img{width:64px;height:64px}.hd b{font-size:40px;font-weight:900;letter-spacing:.5px}
.kick{margin:22px 52px 0;display:inline-block;background:#F2B807;color:#3a2600;font-weight:900;font-size:28px;padding:11px 26px;border-radius:999px}
.h1{padding:16px 52px 0;font-size:76px;line-height:1.0;font-weight:900;background:linear-gradient(180deg,#ffcf7a,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{margin:12px 52px 0;font-size:32px;font-weight:800;color:#ffdca6}
.sub small{display:block;font-size:24px;font-weight:700;color:#e7d6c2;margin-top:4px}
.cols{display:flex;gap:18px;margin:26px 52px 0}
.col{flex:1;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.15);border-radius:20px;padding:24px 22px}
.col h3{font-size:27px;font-weight:900;margin-bottom:14px}
.col.a h3{color:#ffce7d}.col.b h3{color:#8ff0bd}
.li{font-size:24px;font-weight:700;color:#f2ece2;line-height:1.3;margin-top:14px;display:flex;gap:10px}
.li i{font-style:normal;flex:0 0 auto}
.strip{margin:26px 52px 0;display:flex;align-items:center;gap:18px;background:linear-gradient(90deg,rgba(242,184,7,.14),rgba(255,255,255,.04));border:1.5px solid rgba(242,184,7,.4);border-radius:18px;padding:18px 22px}
.strip .ph{width:120px;height:120px;border-radius:14px;overflow:hidden;border:2px solid rgba(201,112,26,.6);flex:0 0 auto}
.strip .ph img{width:100%;height:100%;object-fit:cover}
.strip .t{font-size:26px;font-weight:800;color:#fff;line-height:1.3}
.strip .t b{color:#ffce7d}
.cta{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(90deg,#0B6B3C,#0F8A4D);padding:26px 52px}
.cta .r{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
.cta .big{font-size:34px;font-weight:900;color:#fff}
.cta .ph{font-size:42px;font-weight:900;color:#fff}
.cta .u{font-size:26px;font-weight:900;color:#eafff2;margin-top:2px}
</style>
<div class="p">
 <div class="hd"><img src="${logo}"><b>RAM IMPEX</b></div>
 <div><span class="kick">🤝 თანამშრომლობა</span></div>
 <div class="h1">ვეძებთ წარმომადგენლებს</div>
 <div class="sub">ანთრაციტის ბრიკეტის დისტრიბუცია<small>რეგიონებსა და მუნიციპალიტეტებში 📍</small></div>
 <div class="cols">
   <div class="col a"><h3>👥 ვის ვეძებთ</h3>
     <div class="li"><i>🏪</i>საცალო და საბითუმო გაყიდვების გამოცდილება</div>
     <div class="li"><i>📍</i>საკუთარ რეგიონში/მუნიციპალიტეტში საქმიანობა</div>
     <div class="li"><i>📈</i>კლიენტების ბაზა — უპირატესობა</div>
   </div>
   <div class="col b"><h3>🎁 რას გთავაზობთ</h3>
     <div class="li"><i>🔥</i>მოთხოვნადი სეზონური პროდუქტი</div>
     <div class="li"><i>💰</i>მიმზიდველი პირობები</div>
     <div class="li"><i>🚚</i>სტაბილური მიწოდება</div>
   </div>
 </div>
 <div class="strip"><div class="ph"><img src="${foto}"></div><div class="t">🔥 <b>ანთრაციტის ბრიკეტი</b> — ~2× მეტი სითბო ვიდრე შეშა, უკვამლო. ზამთრის ჰიტ-პროდუქტი.</div></div>
 <div class="cta"><div class="r"><div><div class="big">📞 დაგვიკავშირდი</div><div class="u">🌐 ramimpex.com.ge/info</div></div><div class="ph">595 533 500</div></div></div>
</div>`;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:2});
 await p.setContent(html);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 await p.waitForTimeout(300);
 await p.screenshot({path:__dirname+'/RAM_IMPEX_distrib.jpg',quality:93,type:'jpeg'});
 await b.close();console.log('ok');
})();
