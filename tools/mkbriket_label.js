const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const W=1188,H=1584,F="'Noto Sans Georgian','Sylfaen',system-ui,sans-serif";
function spec(v,l){return `<div class="sp"><div class="v">${v}</div><div class="l">${l}</div></div>`;}
const html=`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box;font-family:${F}}
html,body{width:${W}px;height:${H}px}
.p{width:${W}px;height:${H}px;position:relative;overflow:hidden;color:#fff;
 background:radial-gradient(900px 520px at 78% 8%,rgba(201,112,26,.45),transparent 60%),radial-gradient(760px 520px at 12% 62%,rgba(180,70,10,.32),transparent 60%),linear-gradient(160deg,#241507,#160c04 55%,#0e0803)}
.hd{display:flex;align-items:center;justify-content:space-between;padding:40px 54px 0}
.hd .lg{display:flex;align-items:center;gap:16px}
.hd .lg img{width:70px;height:70px}
.hd .lg b{font-size:46px;font-weight:900;letter-spacing:1px}
.badge{width:118px;height:118px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffb347,#e6801a);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 8px 26px rgba(230,128,26,.5);border:3px solid #ffd28a}
.badge b{font-size:46px;font-weight:900;color:#2a1400;line-height:.9}.badge span{font-size:22px;font-weight:800;color:#3a2200}
.ti{padding:14px 54px 0}
.ti h1{font-size:96px;line-height:.98;font-weight:900;background:linear-gradient(180deg,#ffcf7a,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent;text-transform:uppercase}
.sub{padding:18px 54px 0;font-size:31px;font-weight:800;color:#ffb347}
.grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin:26px 54px 0}
.sp{background:rgba(255,255,255,.05);border:1.5px solid rgba(201,112,26,.4);border-radius:16px;padding:18px 8px;text-align:center}
.sp .v{font-size:44px;font-weight:900;color:#ffb347;line-height:1}
.sp .l{font-size:19px;font-weight:700;color:#d8c3a6;margin-top:8px}
.pills{display:flex;gap:14px;flex-wrap:wrap;margin:22px 54px 0;justify-content:center}
.pill{background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.22);border-radius:999px;padding:12px 26px;font-size:27px;font-weight:900}
.warn{margin:24px 54px 0;background:#F4C400;border-radius:18px;padding:22px 28px;color:#1c1206}
.warn .h{font-size:31px;font-weight:900;margin-bottom:10px}
.warn .t{font-size:24px;font-weight:700;line-height:1.4}.warn .t b{color:#a1030c}
.info{margin:22px 54px 0;background:rgba(255,255,255,.05);border:1.5px solid rgba(201,112,26,.3);border-radius:18px;padding:22px 28px}
.info p{font-size:24px;font-weight:600;color:#e9dcc7;line-height:1.5;margin-bottom:8px}
.info p:last-child{margin-bottom:0}.info b{color:#ffb347;font-weight:900}
.ben{margin:24px 54px 0;text-align:center;font-size:30px;font-weight:900;color:#ffcf7a;line-height:1.5}
.ft{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(90deg,#0B6B3C,#0F8A4D);padding:26px 54px;text-align:center}
.ft .a{font-size:30px;font-weight:900;color:#fff}
.ft .b{font-size:27px;font-weight:800;color:#eafff2;margin-top:8px}
.ft .c{font-size:20px;font-weight:600;color:#bfeacd;margin-top:6px}
</style>
<div class="p">
 <div class="hd"><div class="lg"><img src="${logo}"><b>RAM IMPEX</b></div><div class="badge"><b>10</b><span>კგ</span></div></div>
 <div class="ti"><h1>ანთრაციტის ბრიკეტი</h1></div>
 <div class="sub">🔥 შეშის სრული ჩანაცვლება · მაღალკალორიული საწვავი</div>
 <div class="grid">
  ${spec('7 951','კკალ/კგ · ~2× შეშა')}
  ${spec('8–12 სთ','ერთ ჩაყრაზე')}
  ${spec('50×50×32','მმ ზომა')}
  ${spec('≤ 1,16%','გოგირდი')}
  ${spec('≤ 11,1%','ნაცარი')}
  ${spec('ცოტა','კვამლი')}
 </div>
 <div class="pills"><span class="pill">ISO 9001</span><span class="pill">ISO 14001</span><span class="pill">ISO 45001</span><span class="pill">ГОСТ Р</span></div>
 <div class="warn"><div class="h">⚠️ უსაფრთხოება</div><div class="t">განკუთვნილია <b>მხოლოდ გათბობისთვის</b> (დახურული ბუხარი, ღუმელი, ფეჩი, სათბური). <b>არ არის რეკომენდებული ღია ცეცხლზე საკვების მოსამზადებლად.</b> ძლიერი სიმხურვალის გამო სასურველია ღუმელი/ფეჩი იყოს <b>თუჯის</b> (ნახშირზე გათვლილი) ან აღჭურვილი <b>თუჯის ცხაურით (ბადე/სეტკა)</b>. შეინახეთ ბავშვებისგან მოშორებით.</div></div>
 <div class="info">
  <p><b>შემადგენლობა:</b> 100% ანთრაციტის ქვანახშირი · <b>წმინდა წონა:</b> 10 კგ · <b>ზომა:</b> 50×50×32 მმ</p>
  <p><b>მწარმოებელი:</b> რუსეთის ფედერაცია · <b>შენახვის ვადა:</b> შეუზღუდავი (მშრალ პირობებში)</p>
  <p><b>შენახვა:</b> მშრალ, ვენტილირებად ადგილას, ტენისა და ცეცხლის წყაროსგან მოშორებით.</p>
 </div>
 <div class="ben">🔥 2× მეტი სითბო · ⏱ ხანგრძლივი წვა · 💨 ცოტა კვამლი · 💰 ეკონომიური და სუფთა</div>
 <div class="ft"><div class="a">🇬🇪 იმპორტიორი: შპს „რამ იმპექს" · ს/კ 405565794</div><div class="b">📞 595 533 500 · ramimpex.com.ge · info@ramimpex.com.ge</div><div class="c">იმპორტი და დისტრიბუცია საქართველოში</div></div>
</div>`;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:3});
 fs.writeFileSync(__dirname+'/_lbl.html',html);await p.goto('file://'+__dirname+'/_lbl.html');await p.waitForTimeout(400);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 await p.screenshot({path:__dirname+'/RAM_IMPEX_briketi_etiketi.png',type:'png'});
 await b.close();console.log('label rendered');
})();
