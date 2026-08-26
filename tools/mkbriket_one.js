const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const qr=fs.readFileSync(__dirname+'/qr_b64.txt','utf8').trim();
const W=1080,F="'Noto Sans Georgian','Sylfaen',system-ui,sans-serif";
const TIERS=[
 {rng:'≤ 1000 კგ', price:'2.00', pack:'10 კგ ტომარა'},
 {rng:'1000 – 21000 კგ', price:'1.80', pack:'10 კგ ტომარა', best:true},
 {rng:'21000 კგ +', price:'1.30', pack:'ბიგ-ბეგი'},
];
function pc(t){return `<div class="pc${t.best?' best':''}">${t.best?'<div class="tag">⭐ პოპულარული</div>':''}<div class="rng">${t.rng}</div><div class="prc"><span class="n">${t.price}</span><span class="u">₾/კგ</span></div><div class="pk">📦 ${t.pack}</div></div>`;}
function chip(v,l){return `<div class="ch"><div class="cv">${v}</div><div class="cl">${l}</div></div>`;}
function why(ic,t){return `<div class="wi">${ic} ${t}</div>`;}
function use(ic,t){return `<div class="ui"><span class="e">${ic}</span>${t}</div>`;}
function val(ic,t){return `<div class="vi"><span class="e">${ic}</span><span class="t">${t}</span></div>`;}
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
.warn{margin:22px 54px 0;background:#FFF4D6;border:2px solid #E6A700;border-radius:14px;padding:16px 22px;display:flex;gap:14px;align-items:flex-start}
.warn .e{font-size:36px}.warn .t{font-weight:800;font-size:20px;color:#6a4e00;line-height:1.3}.warn .t b{color:#b00020}
.cards{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
.pc{background:#fff;border:2px solid #ead9c2;border-radius:16px;padding:22px 12px 16px;text-align:center;position:relative;display:flex;flex-direction:column;align-items:center}
.pc.best{border-color:#e6a700;background:linear-gradient(180deg,#fffdf5,#fff8e6)}
.pc .tag{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:#e6a700;color:#3a2600;font-weight:900;font-size:13px;padding:4px 13px;border-radius:999px;white-space:nowrap}
.pc .rng{font-weight:900;font-size:20px;color:#3a2410;min-height:48px;display:flex;align-items:center;line-height:1.15}
.pc .prc{margin:6px 0 4px;display:flex;align-items:baseline;gap:3px}
.pc .prc .n{font-weight:900;font-size:50px;color:#c9701a;line-height:1}.pc .prc .u{font-weight:800;font-size:17px;color:#8a6a00}
.pc .pk{margin-top:8px;font-weight:800;font-size:15.5px;color:#0B6B3C}
.info{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:14px}
.ib{background:#eaf6ef;border:1.5px solid #bfe3ce;border-radius:12px;padding:13px 15px;font-weight:800;font-size:16.5px;color:#0B6B3C;display:flex;align-items:center;gap:9px}.ib .e{font-size:24px}
.loc{margin-top:16px;background:#fff;border:2px solid #bfe3ce;border-radius:16px;padding:18px 22px;display:flex;align-items:center;gap:22px}
.loc .qr{width:150px;height:150px;flex:0 0 auto;border-radius:10px;overflow:hidden;border:1px solid #e3ece7}
.loc .qr img{width:100%;height:100%}
.loc .lt{flex:1}
.loc .lt .h{font-weight:900;font-size:24px;color:#0B6B3C;margin-bottom:6px}
.loc .lt .d{font-weight:700;font-size:18px;color:#3a2410;line-height:1.35}
.loc .lt .sc{margin-top:9px;font-weight:800;font-size:16px;color:#c9701a}
.cmp{display:flex;align-items:stretch;gap:14px}
.col{flex:1;border-radius:18px;padding:22px 18px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:flex-start}
.brik{background:linear-gradient(180deg,#1c1206,#3a2410);color:#fff;border:2px solid #c9701a;position:relative}
.wood{background:#f4efe6;border:2px solid #e2d6c2}
.brik .ph{width:132px;height:90px;border-radius:12px;overflow:hidden;margin-bottom:9px;border:2px solid rgba(201,112,26,.5)}
.brik .ph img{width:100%;height:100%;object-fit:cover}
.col .em{font-size:56px;line-height:1}
.col .qty{font-weight:900;font-size:30px;margin-top:8px;line-height:1.05}
.brik .qty{color:#ffb347}.wood .qty{color:#3a2410}
.col .hrs{font-weight:900;font-size:21px;margin-top:9px}.brik .hrs{color:#fff}.wood .hrs{color:#8a6a2a}
.col .sub{font-weight:700;font-size:15px;margin-top:6px}.brik .sub{color:#e9d6bd}.wood .sub{color:#7a6a52}
.eq{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:0 0 auto}
.eq .s1{font-weight:900;font-size:44px;color:#c9701a}.eq .s2{font-weight:800;font-size:13px;color:#0B6B3C;margin-top:4px;line-height:1.2}
.prow{margin:16px 0 0;display:flex;gap:14px;align-items:center}
.pcell{flex:1;border-radius:14px;padding:15px;text-align:center;font-weight:900;font-size:25px}
.pbrik{background:#0B6B3C;color:#fff}.pwood{background:#efe6d6;color:#6a4e00}
.pcell small{display:block;font-weight:700;font-size:14px;margin-top:5px;opacity:.9}
.win{flex:0 0 auto;font-weight:900;font-size:20px;color:#c9701a;text-align:center;line-height:1.15}
.seas{margin:18px 0 0;background:linear-gradient(90deg,#fff7ea,#fdefd6);border:2px solid #f0c46a;border-radius:16px;padding:18px 22px}
.seas .r2{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.seas .box{flex:1;min-width:200px;background:#fff;border:1.5px solid #ead0a6;border-radius:12px;padding:14px 16px;text-align:center}
.seas .box b{display:block;font-size:20px;color:#3a2410;font-weight:900}.seas .box span{font-size:16px;font-weight:700;color:#7a6a52}
.seas .arr{font-weight:900;font-size:32px;color:#c9701a}
.seas .box.g{background:#0B6B3C;border-color:#0B6B3C}.seas .box.g b{color:#fff}.seas .box.g span{color:#bff0d3}
.seas .sn{margin-top:12px;font-weight:800;font-size:17px;color:#8a6a00;text-align:center}
.econ{margin:16px 0 0;background:linear-gradient(90deg,#0B6B3C,#0F8A4D);border-radius:16px;padding:20px 24px;color:#fff}
.econ .eh{font-weight:900;font-size:23px;margin-bottom:14px;color:#fff}
.econ .er{display:flex;gap:12px}
.econ .ec{flex:1;background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.28);border-radius:12px;padding:14px 12px;text-align:center}
.econ .ec span{display:block;font-size:16px;font-weight:800;color:#dff5e8}
.econ .ec b{display:block;font-size:20px;font-weight:900;margin-top:6px;color:#fff}
.econ .ec.save{background:#F2B807;border-color:#F2B807}.econ .ec.save span{color:#5a4600}.econ .ec.save b{color:#1c1500;font-size:26px}
.econ .en{margin-top:12px;font-size:15px;font-weight:700;color:#dff5e8;text-align:center}
.vals{margin:16px 54px 0;display:flex;flex-direction:column;gap:11px}
.vi{background:#fff;border:1.5px solid #ead9c2;border-radius:13px;padding:14px 18px;display:flex;align-items:center;gap:15px}
.vi .e{font-size:30px;flex:0 0 auto}.vi .t{font-weight:700;font-size:19px;color:#3a2410;line-height:1.3}.vi .t b{color:#0B6B3C}
.foot{margin-top:28px;background:#0F8A4D;color:#fff;padding:20px 54px;display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:21px;flex-wrap:wrap;gap:8px}
.foot .r{font-weight:700;font-size:16px}`;
const html=`<!doctype html><meta charset="utf-8"><style>${CSS}</style>
<div class="p">
 <div class="hd"><img src="${logo}"><div class="bn">RAM IMPEX<small>იმპორტი · დისტრიბუცია საქართველოში</small></div></div>
 <div class="tb"><h1>ანთრაციტის ბრიკეტი</h1><div class="s">სრული ინფორმაცია · ფასები · შედარება შეშასთან</div></div>
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
   ${use('🔥','ღუმელი და ქურა')}
   ${use('🏠','ფეჩი / საოჯახო გათბობა')}
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

 <div class="warn"><div class="e">⚠️</div><div class="t">განკუთვნილია <b>მხოლოდ გათბობისთვის</b> — ღუმელი, ფეჩი, სათბური. <b>არ არის რეკომენდებული ღია ცეცხლზე საკვების მოსამზადებლად.</b><br><br>🔩 ძლიერი სიმხურვალის გამო სასურველია ღუმელი/ფეჩი იყოს <b>თუჯის</b> (ნახშირზე გათვლილი), ან აღჭურვილი <b>თუჯის ცხაურით (ბადე/სეტკა)</b>.</div></div>

 <div class="sec"><div class="sh">💰 ფასები — ₾ / კგ</div>
  <div class="cards">${TIERS.map(pc).join('')}</div>
  <div class="info">
   <div class="ib"><span class="e">✅</span>ფასი დღგ-ის ჩათვლით</div>
   <div class="ib"><span class="e">🏭</span>საწყობი — ნატახტარი</div>
   <div class="ib"><span class="e">📦</span>10 კგ ტომარა ან ბიგ-ბეგი</div>
  </div>
  <div class="loc"><div class="qr"><img src="${qr}"></div>
   <div class="lt"><div class="h">📍 საწყობი — ნატახტარი</div>
    <div class="d">მოდი ადგილზე ან დაასკანერე QR-კოდი — პირდაპირ Google Maps-ზე გადახვალ საწყობის მდებარეობაზე.</div>
    <div class="sc">📱 დაასკანერე რუკისთვის · 📞 595 533 500</div></div></div></div>

 <div class="sec"><div class="sh">🪵 რატომ არის ბრიკეტი შეშაზე იაფი?</div>
  <div class="cmp">
   <div class="col brik"><div class="ph"><img src="b_full1.jpg"></div><div class="qty">1 კგ ბრიკეტი</div><div class="hrs">🕙 ~10 საათი წვა</div><div class="sub">7 951 კკალ/კგ · ერთხელ ჩაყრით</div></div>
   <div class="eq"><div class="s1">=</div><div class="s2">იგივე<br>სითბო</div></div>
   <div class="col wood"><div class="em">🪵</div><div class="qty">~10 კგ შეშა</div><div class="hrs">🔁 6–8× დამატება</div><div class="sub">~2 100 კკალ/კგ</div></div>
  </div>
  <div class="prow">
   <div class="pcell pbrik">2.00 ₾<small>1 კგ ბრიკეტი · საბითუმო 1.30 ₾</small></div>
   <div class="win">ბრიკეტი<br>2× იაფი →</div>
   <div class="pcell pwood">4.00 ₾<small>~10 კგ შეშა (0.40 ₾/კგ)</small></div>
  </div>
  <div class="seas">
   <div class="r2">
    <div class="box"><b>1 კუბი შეშა</b><span>≈ 500 კგ · 200 ₾</span></div>
    <div class="arr">=</div>
    <div class="box g"><b>50 კგ ბრიკეტი</b><span>100 ₾ საცალო · 65 ₾ საბითუმო</span></div>
   </div>
   <div class="sn">ℹ️ 1 კუბი შეშა ≈ 500 კგ → 50 კგ ბრიკეტი (რომ იგივე დაიწვას)</div>
  </div>
  <div class="econ"><div class="eh">💚 ზამთრის ჯამური ეკონომია — 4 თვე</div>
   <div class="er">
    <div class="ec"><span>🪵 შეშა (8 კუბი)</span><b>8 × 200 = 1600 ₾</b></div>
    <div class="ec"><span>🔥 ბრიკეტი (400 კგ)</span><b>400 × 2 = 800 ₾</b></div>
    <div class="ec save"><span>✅ ეკონომია</span><b>≈ 800 ₾</b></div>
   </div>
   <div class="en">მაგალითი: ~2 კუბი/თვე × 4 თვე = 8 კუბი. ბრიკეტით სეზონზე ~2× ნაკლებ ხარჯავ.</div></div>
 </div>

 <div class="vals">
  ${val('⏱','<b>ერთხელ ჩააგდე — 10 საათი:</b> შეშას 6–8-ჯერ ამატებ იმავე დროში. ღამით აღარ დგები.')}
  ${val('💧','<b>წყალს არ იხდი:</b> შეშა წყალს შეიცავს — სითბოს ნაწილი აორთქლებაზე/კვამლში იკარგება. ბრიკეტი მშრალია.')}
  ${val('💨','<b>თითქმის უკვამლო:</b> ცოტა ნაცარი, ბუხარსა და საკვამურს არ ახერგავს.')}
 </div>

 <div class="foot"><div>📞 595 533 500</div><div class="r">ramimpex.com.ge · info@ramimpex.com.ge</div></div>
</div>`;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage({viewport:{width:W,height:1400},deviceScaleFactor:2});
 fs.writeFileSync(__dirname+'/_one.html',html);await p.goto('file://'+__dirname+'/_one.html');await p.waitForTimeout(400);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 await p.screenshot({path:__dirname+'/RAM_IMPEX_briketi_bukleti.jpg',quality:93,type:'jpeg',fullPage:true});
 await b.close();console.log('combined booklet rendered');
})();
