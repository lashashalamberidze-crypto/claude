const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const qr=fs.readFileSync(__dirname+'/qr_info_b64.txt','utf8').trim();
const W=794,H=1123,F="'Noto Sans Georgian','Sylfaen',system-ui,sans-serif";
function fb(ic,t){return `<div class="fb"><span class="e">${ic}</span><span class="t">${t}</span></div>`;}
const html=`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box;font-family:${F};color:#000}
html,body{width:${W}px;height:${H}px;background:#fff}
.page{width:${W}px;height:${H}px;padding:14px}
.frame{border:3px solid #000;height:100%;display:flex;flex-direction:column}
.hd{display:flex;justify-content:space-between;align-items:center;padding:12px 18px;border-bottom:2.5px solid #000}
.hd .b{font-weight:900;font-size:28px;letter-spacing:1px}
.hd .b small{display:block;font-size:11px;font-weight:700;letter-spacing:0}
.hd .r{font-size:12px;text-align:right;line-height:1.4;font-weight:700}
.ti{text-align:center;padding:10px 16px 4px}
.ti h1{font-size:38px;font-weight:900;line-height:1.03;text-transform:uppercase}
.ti .s{font-size:15px;font-weight:700;margin-top:5px}
.ti .en{font-size:11px;font-weight:600;letter-spacing:2px;margin-top:2px}
.feat{display:flex;gap:8px;padding:8px 16px 4px;justify-content:center;flex-wrap:wrap}
.fb{border:1.5px solid #000;border-radius:8px;padding:6px 11px;display:flex;align-items:center;gap:7px;font-weight:800;font-size:13px}
.fb .e{font-size:17px}
.body{flex:1;display:flex;gap:0;border-top:2px solid #000}
.col{flex:1;padding:10px 16px}
.col.l{border-right:2px solid #000}
.h2{font-size:15.5px;font-weight:900;text-transform:uppercase;border-bottom:1.5px solid #000;padding-bottom:3px;margin:9px 0 6px;letter-spacing:.5px}
.h2:first-child{margin-top:0}
.spec{width:100%;border-collapse:collapse;font-size:13.5px}
.spec td{padding:4px 0;border-bottom:1px dotted #999}
.spec td.v{text-align:right;font-weight:800;white-space:nowrap}
.li{font-size:13.5px;line-height:1.35;margin-bottom:5px;padding-left:17px;position:relative;font-weight:600}
.li:before{content:"■";position:absolute;left:0;font-size:9px;top:3px}
.warn{border:2px solid #000;padding:8px 11px;margin-top:2px}
.warn .wh{font-weight:900;font-size:14px;text-transform:uppercase;margin-bottom:5px}
.warn .wl{font-size:12.5px;line-height:1.4;margin-bottom:8px;font-weight:600}
.warn .wl:last-child{margin-bottom:0}
.info td{font-size:13px;padding:4px 0;border-bottom:1px dotted #999}
.info td.v{font-weight:800;text-align:right}
.bottom{display:flex;gap:0;border-top:2px solid #000}
.wt{flex:0 0 46%;border-right:2px solid #000;padding:12px 16px;display:flex;flex-direction:column;justify-content:center}
.wt .lb{font-size:22px;font-weight:900}
.wt .row{display:flex;align-items:flex-end;gap:10px;margin-top:8px}
.wt .ln{flex:1;border-bottom:2.5px solid #000;height:30px}
.wt .u{font-size:22px;font-weight:900}
.wt .h{font-size:11px;font-weight:600;margin-top:4px}
.nt{flex:1;padding:12px 16px}
.nt .nh{font-size:13px;font-weight:900;text-transform:uppercase;margin-bottom:6px}
.nt .nl{border-bottom:1.5px solid #000;height:26px;margin-top:9px}
.ft{border-top:2px solid #000;padding:10px 16px;display:flex;align-items:center;gap:14px}
.ft .qr{width:88px;height:88px;flex:0 0 auto;border:1.5px solid #000}
.ft .qr img{width:100%;height:100%;display:block}
.ft .ftx{flex:1;font-size:12px;line-height:1.5}
.ft .ftx b{font-weight:900}
.ft .sc{font-size:10.5px;font-weight:700;margin-top:2px}
</style>
<div class="page"><div class="frame">
 <div class="hd"><div class="b">RAM IMPEX<small>ანთრაციტის ბრიკეტი</small></div><div class="r">იმპორტიორი · დისტრიბუტორი<br>595 533 500 · ramimpex.com.ge</div></div>
 <div class="ti"><h1>ანთრაციტის ბრიკეტი</h1><div class="s">მაღალკალორიული, უკვამლო საწვავი გათბობისთვის</div><div class="en">ANTHRACITE COAL BRIQUETTE</div></div>
 <div class="feat">
  ${fb('💧','ნესტგამძლე')}
  ${fb('🔥','მაღალკალორიული')}
  ${fb('💨','უკვამლო')}
  ${fb('⏱','ხანგრძლივი წვა')}
 </div>
 <div class="body">
  <div class="col l">
   <div class="h2">შემადგენლობა</div>
   <div class="li">100% ანთრაციტის ქვანახშირი — უმაღლესი ხარისხის.</div>
   <div class="h2">ტექნიკური მაჩვენებლები</div>
   <table class="spec">
    <tr><td>თბოგამოცემა (NCV)</td><td class="v">7 951 კკალ/კგ</td></tr>
    <tr><td>ზომა</td><td class="v">50×50×32 მმ</td></tr>
    <tr><td>გოგირდი</td><td class="v">≤ 1,16%</td></tr>
    <tr><td>ნაცარი</td><td class="v">≤ 11,1%</td></tr>
    <tr><td>ტენიანობა</td><td class="v">≤ 6,5%</td></tr>
    <tr><td>აქროლადი ნივთ.</td><td class="v">≤ 8,5%</td></tr>
   </table>
   <div class="h2">რატომ არის კარგი</div>
   <div class="li">2× მეტი სითბო, ვიდრე შეშა (მაღალი კალორიულობა).</div>
   <div class="li">8–12 საათი იწვის ერთ ჩაყრაზე (შეშა 1–2 სთ).</div>
   <div class="li">ცოტა კვამლი და ნაცარი — სუფთა წვა.</div>
   <div class="li">ეკონომიური და სტაბილური ხარისხის.</div>
   <div class="h2">სად გამოიყენება</div>
   <div class="li">ღუმელი და ქურა.</div>
   <div class="li">ფეჩი / საოჯახო გათბობა.</div>
   <div class="li">სათბურების გათბობა.</div>
   <div class="li">სამრეწველო ქვაბები.</div>
  </div>
  <div class="col">
   <div class="warn">
    <div class="wh">გაფრთხილება</div>
    <div class="wl">⚠️ განკუთვნილია მხოლოდ გათბობისთვის — ღუმელი, ფეჩი, სათბური. არ არის რეკომენდებული ღია ცეცხლზე საკვების მოსამზადებლად.</div>
    <div class="wl">🔩 ძლიერი სიმხურვალის გამო სასურველია ღუმელი/ფეჩი იყოს თუჯის (ნახშირზე გათვლილი), ან აღჭურვილი თუჯის ცხაურით (ბადე/სეტკა).</div>
   </div>
   <div class="h2">მწარმოებელი / იმპორტიორი</div>
   <table class="info" style="width:100%;border-collapse:collapse">
    <tr><td>მწარმოებელი</td><td class="v">რუსეთის ფედერაცია</td></tr>
    <tr><td>იმპორტიორი</td><td class="v">შპს „რამ იმპექს"</td></tr>
    <tr><td>შეფუთვა</td><td class="v">10 კგ ტომარა / ბიგ-ბეგი</td></tr>
    <tr><td>სერტიფიკატები</td><td class="v">ISO · ГОСТ Р · MSDS</td></tr>
   </table>
   <div class="h2">შენახვის პირობები</div>
   <div class="li">ვენტილირებად ადგილას; ტენის, ცეცხლისა და ბავშვებისგან მოშორებით.</div>
   <div class="li">შენახვის ვადა შეუზღუდავი — ხანგრძლივი შენახვა არაფერს უშლის ხელს.</div>
   <div class="li">საწყობი: ნატახტარი (თვითგატანა შესაძლებელია).</div>
  </div>
 </div>
 <div class="bottom">
  <div class="wt"><div class="lb">წონა:</div><div class="row"><div class="ln"></div><div class="u">კგ</div></div><div class="h">(ხელით ჩაწერეთ)</div></div>
  <div class="nt"><div class="nh">შენიშვნა / პარტია</div><div class="nl"></div><div class="nl"></div></div>
 </div>
 <div class="ft"><div class="qr"><img src="${qr}"></div><div class="ftx"><b>იმპორტიორი: შპს „რამ იმპექს"</b> · ს/კ 405565794<br>📞 595 533 500 · ✉ info@ramimpex.com.ge · 🌐 ramimpex.com.ge<div class="sc">დაასკანერე QR — სრული ინფორმაცია, ფასები და მდებარეობა</div></div></div>
</div></div>`;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:3});
 fs.writeFileSync(__dirname+'/_stk.html',html);await p.goto('file://'+__dirname+'/_stk.html');await p.waitForTimeout(400);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 await p.screenshot({path:__dirname+'/RAM_IMPEX_briketi_stikeri.png',type:'png'});
 await b.close();console.log('sticker rendered');
})();
