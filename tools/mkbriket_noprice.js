const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const qr=fs.readFileSync(__dirname+'/qr_b64.txt','utf8').trim();
const W=1080,F="'Noto Sans Georgian','Sylfaen',system-ui,sans-serif";
function chip(v,l){return `<div class="ch"><div class="cv">${v}</div><div class="cl">${l}</div></div>`;}
function why(ic,t){return `<div class="wi">${ic} ${t}</div>`;}
function use(ic,t){return `<div class="ui"><span class="e">${ic}</span>${t}</div>`;}
function val(ic,t){return `<div class="vi"><span class="e">${ic}</span><span class="t">${t}</span></div>`;}
function ri(ic,t){return `<div class="ri"><span class="e">${ic}</span><div>${t}</div></div>`;}
const CSS=`*{margin:0;box-sizing:border-box}html,body{width:${W}px;font-family:${F};background:#fff}
.p{width:${W}px;background:linear-gradient(180deg,#fff,#fbf7f0)}
.hd{display:flex;align-items:center;gap:15px;padding:32px 54px 0}.hd img{width:60px;height:60px}
.bn{font-weight:900;font-size:36px;color:#0B6B3C}.bn small{display:block;font-size:14px;font-weight:600;color:#5C6B62}
.tb{margin:20px 54px 0;background:linear-gradient(90deg,#1c1206,#3a2410);border-radius:18px;padding:22px 30px;color:#fff;position:relative;overflow:hidden}
.tb:after{content:"🔥";position:absolute;right:26px;top:16px;font-size:60px}
.tb h1{font-size:46px;font-weight:900;line-height:1.02}.tb .s{color:#ffb347;font-weight:800;font-size:22px;margin-top:7px}
.hero{margin:18px 54px 0;height:360px;border-radius:16px;overflow:hidden;border:3px solid rgba(201,112,26,.35);position:relative}
.hero img{width:100%;height:100%;object-fit:cover}
.hero .lab{position:absolute;left:0;bottom:0;background:linear-gradient(90deg,rgba(28,18,6,.92),transparent);color:#fff;font-weight:800;font-size:23px;padding:30px 24px 15px;width:78%}
.chips{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 54px 0}
.ch{background:#fff;border:1.5px solid #ead9c2;border-radius:14px;padding:13px 8px;text-align:center}
.cv{color:#c9701a;font-weight:900;font-size:27px;line-height:1}.cl{color:#5b4a37;font-weight:700;font-size:14px;margin-top:6px}
.sec{margin:26px 54px 0}
.sh{font-weight:900;font-size:30px;color:#0B6B3C;margin-bottom:14px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.bx{background:#fff;border:1.5px solid #e3d7c3;border-radius:14px;padding:18px 20px}
.bx .t{font-weight:900;font-size:22px;color:#3a2410;margin-bottom:7px}
.bx .d{font-weight:600;font-size:18.5px;color:#5b4a37;line-height:1.4}.bx .d b{color:#0B6B3C}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.st{background:#fff;border:1.5px solid #e3d7c3;border-radius:14px;padding:18px 16px;position:relative}
.st .num{position:absolute;top:-14px;left:16px;background:#c9701a;color:#fff;font-weight:900;font-size:17px;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.st .t{font-weight:900;font-size:20px;color:#3a2410;margin:8px 0 6px}
.st .d{font-weight:600;font-size:17px;color:#5b4a37;line-height:1.35}
.note2{margin-top:12px;background:#eef7f1;border:1.5px solid #bfe3ce;border-radius:12px;padding:13px 18px;font-weight:700;font-size:18px;color:#0B6B3C}
.why{background:linear-gradient(90deg,#fff7ea,#fdefd6);border:2px solid #f0c46a;border-radius:16px;padding:18px 24px}
.wg{display:grid;grid-template-columns:1fr 1fr;gap:12px 22px}
.wi{font-size:19px;color:#3a2f22;font-weight:600;line-height:1.3}.wi b{color:#0B6B3C}
.uses{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.ui{background:#fff;border:1.5px solid #e3d7c3;border-radius:12px;padding:14px 14px;font-weight:800;font-size:18px;color:#3a2410;display:flex;align-items:center;gap:11px}
.ui .e{font-size:26px}
table{width:100%;border-collapse:collapse;font-size:20px;background:#fff;border-radius:12px;overflow:hidden}
th,td{padding:12px 18px;text-align:left;border-bottom:1px solid #ece2d2}
th{background:#0B6B3C;color:#fff;font-weight:800}
td.v{text-align:right;font-weight:900;color:#0B6B3C;white-space:nowrap}
tr:nth-child(even) td{background:#faf5ec}
.pills{display:flex;flex-wrap:wrap;gap:10px}
.pill{background:#eaf6ef;border:1.5px solid #bfe3ce;border-radius:999px;padding:10px 17px;font-weight:800;font-size:19px;color:#0B6B3C}
.pill.g{background:#fff4d6;border-color:#e6a700;color:#8a6a00}
.recbox{background:#FFF7E4;border:2px solid #E6A700;border-radius:16px;padding:6px 24px}
.ri{display:flex;gap:16px;align-items:flex-start;padding:16px 0;border-bottom:1px dashed #edcf94}
.ri:last-child{border-bottom:none}
.ri .e{font-size:34px;flex:0 0 auto;line-height:1.1}
.ri div{font-weight:600;font-size:19px;color:#5a4415;line-height:1.42}
.ri div b{color:#8a2b00}.ri div .g{color:#0B6B3C;font-weight:900}
.loc{margin:0 54px 0;background:#fff;border:2px solid #bfe3ce;border-radius:16px;padding:18px 22px;display:flex;align-items:center;gap:22px}
.loc .qr{width:150px;height:150px;flex:0 0 auto;border-radius:10px;overflow:hidden;border:1px solid #e3ece7}
.loc .qr img{width:100%;height:100%}
.loc .lt{flex:1}
.loc .lt .h{font-weight:900;font-size:24px;color:#0B6B3C;margin-bottom:6px}
.loc .lt .d{font-weight:700;font-size:18px;color:#3a2410;line-height:1.35}
.loc .lt .sc{margin-top:9px;font-weight:800;font-size:16px;color:#c9701a}
.vals{margin:16px 54px 0;display:flex;flex-direction:column;gap:11px}
.vi{background:#fff;border:1.5px solid #ead9c2;border-radius:13px;padding:14px 18px;display:flex;align-items:center;gap:15px}
.vi .e{font-size:30px;flex:0 0 auto}.vi .t{font-weight:700;font-size:19px;color:#3a2410;line-height:1.3}.vi .t b{color:#0B6B3C}
.foot{margin-top:28px;background:#0F8A4D;color:#fff;padding:20px 54px;display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:21px;flex-wrap:wrap;gap:8px}
.foot .r{font-weight:700;font-size:16px}`;
const html=`<!doctype html><meta charset="utf-8"><style>${CSS}</style>
<div class="p">
 <div class="hd"><img src="${logo}"><div class="bn">RAM IMPEX<small>იმპორტი · დისტრიბუცია საქართველოში</small></div></div>
 <div class="tb"><h1>ანთრაციტის ბრიკეტი</h1><div class="s">სრული ინფორმაცია · უპირატესობები · უსაფრთხოება</div></div>
 <div class="hero"><img src="b_full1.jpg"><div class="lab">მაღალკალორიული · უკვამლო · ხანგრძლივი წვა</div></div>

 <div class="chips">
  ${chip('7 951','კკალ/კგ · ~2× შეშა')}
  ${chip('8–12 სთ','წვა ერთ ჩაყრაზე')}
  ${chip('99,4%','გამძლეობა')}
  ${chip('≤ 1,16%','გოგირდი')}
  ${chip('50×50×32','მმ ზომა')}
  ${chip('ცოტა','კვამლი და ნაცარი')}
 </div>

 <div class="sec"><div class="sh">🧱 რისგან მზადდება?</div>
  <div class="two">
   <div class="bx"><div class="t">100% ანთრაციტის ქვანახშირი</div><div class="d">ანთრაციტი — <b>ყველაზე მაღალხარისხიანი ქვანახშირი</b> (ნახშირბადის უმაღლესი შემცველობით). სწორედ ის იძლევა მაქსიმალურ სითბოს და ხანგრძლივ, სუფთა წვას.</div></div>
   <div class="bx"><div class="t">ქიმიური დანამატების გარეშე</div><div class="d">ბრიკეტი მიიღება ანთრაციტის წვრილი ფრაქციის <b>მაღალი წნევით შეკუმშვით</b> — ბუნებრივი შემკვრელით. სუფთა, ერთგვაროვანი პროდუქტი.</div></div>
  </div></div>

 <div class="sec"><div class="sh">⚙️ როგორ მზადდება — და რატომ არა პირდაპირ</div>
  <div class="steps">
   <div class="st"><div class="num">1</div><div class="t">წვრილი ფრაქცია</div><div class="d">ანთრაციტის მოპოვებისას რჩება წვრილი ნატეხი/მტვერი — ის ცალკე <b>კარგად ვერ იწვის</b>: ცვივა ცხაურში და ახშობს ჰაერს.</div></div>
   <div class="st"><div class="num">2</div><div class="t">მაღალი წნევა</div><div class="d">ეს ფრაქცია <b>დიდი წნევით იწნეხება</b> ერთგვაროვან ბრიკეტებად — ამიტომ პირდაპირ, დაუმუშავებლად გამოყენება არ ხდება.</div></div>
   <div class="st"><div class="num">3</div><div class="t">მზა ბრიკეტი</div><div class="d">შედეგი — <b>მყარი, მშრალი, სტაბილური</b> ბრიკეტი, რომელიც დიდხანს და თანაბრად იწვის, ადვილი შესანახი და სატრანსპორტოა.</div></div>
  </div>
  <div class="note2">➜ ამიტომ ბრიკეტი გაცილებით ეფექტურია, ვიდრე ნახშირის მტვერი ან ცალკეული ნატეხები.</div></div>

 <div class="sec"><div class="sh">🔥 რატომ ჯობია შეშას?</div>
  <div class="why"><div class="wg">
   ${why('🌡','<b>2× მეტი სითბო</b> — მაღალი კალორიულობა (7 951 კკალ/კგ).')}
   ${why('⏱','<b>8–12 საათი</b> ერთ ჩაყრაზე (შეშა მხოლოდ 1–2 სთ).')}
   ${why('💨','<b>ცოტა კვამლი და ნაცარი</b> — უფრო სუფთა წვა.')}
   ${why('💰','<b>ეკონომიური</b> — ნაკლები ხარჯი გათბობაზე.')}
   ${why('📦','<b>კომპაქტური და მშრალი</b> — მარტივი შენახვა/ტრანსპორტი.')}
   ${why('🎯','<b>სტაბილური ხარისხი</b> — ერთგვაროვანი ყოველ პარტიაში.')}
  </div></div></div>

 <div class="sec"><div class="sh">📍 სად გამოიყენება</div>
  <div class="uses">
   ${use('🔥','დახურული ფეჩი და ღუმელი')}
   ${use('🏠','საოჯახო გათბობა')}
   ${use('🌱','სათბურების გათბობა')}
   ${use('🏭','სამრეწველო ქვაბები')}
   ${use('♨️','წყლის გამათბობელი')}
   ${use('🏢','კომერციული ობიექტები')}
  </div></div>

 <div class="sec"><div class="sh">📊 ტექნიკური მაჩვენებლები</div>
  <table><tr><th>მაჩვენებელი</th><th style="text-align:right">მნიშვნელობა</th></tr>
   <tr><td>კლასი / ზომა</td><td class="v">50×50×32 მმ</td></tr>
   <tr><td>თბოგამოცემა (NCV, მშრ. უნაცრო)</td><td class="v">7 951 კკალ/კგ</td></tr>
   <tr><td>გოგირდი (რაბ. ბაზა)</td><td class="v">≤ 1,16%</td></tr>
   <tr><td>ნაცარი (მშრალზე)</td><td class="v">≤ 11,1%</td></tr>
   <tr><td>ტენიანობა</td><td class="v">≤ 6,5%</td></tr>
   <tr><td>აქროლადი ნივთიერებები</td><td class="v">≤ 8,5%</td></tr></table></div>

 <div class="sec"><div class="sh">✓ სერტიფიცირებული ხარისხი</div>
  <div class="pills"><span class="pill">ISO 9001</span><span class="pill">ISO 14001</span><span class="pill">ISO 45001</span><span class="pill g">ГОСТ Р 57016-2016</span><span class="pill">MSDS</span><span class="pill">COTECNA</span></div></div>

 <div class="sec"><div class="sh">⚠️ უსაფრთხოება და რეკომენდაცია</div>
  <div class="recbox">
   ${ri('🔥','<b>მხოლოდ გათბობისთვის.</b> განკუთვნილია <span class="g">დახურული ფეჩების, ღუმელებისა და სათბურებისთვის.</span> არ არის რეკომენდებული ღია ცეცხლზე საკვების მოსამზადებლად.')}
   ${ri('🌫️','წვისას <b>გამოყოფს ნახშირორჟანგს (CO₂) და ნახშირჟანგს (CO).</b> ამიტომ გამოიყენეთ <span class="g">მხოლოდ დახურულ ფეჩებსა და ღუმელებში</span> — აუცილებელი საკვამურითა და კარგი ვენტილაციით. დახურულ, გაუნიავებელ სივრცეში გამოყენება <b>საშიშია.</b>')}
   ${ri('🔩','<b>მაღალი წვის ტემპერატურის გამო</b> სასურველია <span class="g">ძლიერი (მძიმე) რკინის ან თუჯის ფეჩი/ღუმელი</span> — თხელი ლითონი შესაძლოა გადახუროს/დეფორმირდეს. იდეალურია <b>თუჯის</b> ან ნახშირზე გათვლილი ღუმელი (თუჯის ცხაურით — ბადე/სეტკა).')}
  </div></div>

 <div class="sec"><div class="sh">📍 საწყობი — ნატახტარი</div>
  <div class="loc"><div class="qr"><img src="${qr}"></div>
   <div class="lt"><div class="h">📍 მოდი ადგილზე — ნატახტარი</div>
    <div class="d">დაასკანერე QR-კოდი — პირდაპირ Google Maps-ზე გადახვალ საწყობის მდებარეობაზე. თვითგატანა შესაძლებელია.</div>
    <div class="sc">📱 დაასკანერე რუკისთვის · 📞 595 533 500</div></div></div></div>

 <div class="vals">
  ${val('⏱','<b>ერთხელ ჩააგდე — 10 საათი:</b> შეშას 6–8-ჯერ ამატებ იმავე დროში. ღამით აღარ დგები.')}
  ${val('💧','<b>წყალს არ იხდი:</b> შეშა წყალს შეიცავს — სითბოს ნაწილი აორთქლებაზე/კვამლში იკარგება. ბრიკეტი მშრალია.')}
  ${val('💨','<b>თითქმის უკვამლო:</b> ცოტა ნაცარი, საკვამურს არ ახერგავს.')}
 </div>

 <div class="foot"><div>📞 595 533 500</div><div class="r">ramimpex.com.ge · info@ramimpex.com.ge</div></div>
</div>`;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage({viewport:{width:W,height:1400},deviceScaleFactor:2});
 fs.writeFileSync(__dirname+'/_noprice.html',html);await p.goto('file://'+__dirname+'/_noprice.html');await p.waitForTimeout(400);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 await p.screenshot({path:__dirname+'/RAM_IMPEX_briketi_info.jpg',quality:93,type:'jpeg',fullPage:true});
 await b.close();console.log('no-price booklet rendered');
})();
