const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const ICO=__dirname+'/pkgicons';
const qr=fs.readFileSync(__dirname+'/qr_info_b64.txt','utf8').trim();
const b64=n=>'data:image/png;base64,'+fs.readFileSync(`${ICO}/${n}.png`).toString('base64');
const W=794,H=1123,F="'Noto Sans Georgian','Sylfaen',sans-serif";
const picts=[['keepdry','ნესტისგან დაცვა','მშრალად შეინახეთ'],['flammable','აალებადი','მოერიდეთ ცეცხლს'],['temp','ტემპერატურის ლიმიტი','ზომიერ ტემპერატურაზე'],['nochildren','ბავშვებისგან მოშორებით','მიუწვდომელ ადგილას']];
const pc=([i,n,m])=>`<div class="pc"><img src="${b64(i)}"><div class="pn">${n}</div><div class="pm">${m}</div></div>`;
const html=`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box;font-family:${F};color:#111}
html,body{width:${W}px;height:${H}px;background:#fff}
.page{width:${W}px;height:${H}px;padding:13px}
.frame{border:3px solid #000;height:100%;display:flex;flex-direction:column}
.hd{display:flex;justify-content:space-between;align-items:center;padding:9px 16px;border-bottom:2.5px solid #000}
.hd .b{font-weight:900;font-size:26px}.hd .b small{display:block;font-size:10px;font-weight:700}
.hd .r{font-size:11px;text-align:right;line-height:1.4;font-weight:700}
.ti{text-align:center;padding:8px 14px 2px}
.ti h1{font-size:34px;font-weight:900;line-height:1.02}
.ti .s{font-size:14px;font-weight:700;margin-top:3px}
.ti .en{font-size:10px;font-weight:600;letter-spacing:2px;color:#555;margin-top:2px}
.strip{display:flex;gap:8px;padding:8px 14px 6px}
.pc{flex:1;border:1.5px solid #9a9a9a;border-radius:8px;padding:8px 4px;text-align:center}
.pc img{width:40px;height:40px}
.pn{font-weight:800;font-size:12.5px;margin-top:4px}
.pm{font-size:10.5px;color:#555;margin-top:2px}
.body{flex:1;display:flex;border-top:2px solid #000}
.col{flex:1;padding:8px 14px}.col.l{border-right:2px solid #000}
.h2{font-size:13.5px;font-weight:900;color:#C9701A;border-bottom:1.5px solid #C9701A;padding-bottom:2px;margin:8px 0 5px}
.h2:first-child{margin-top:0}
.li{font-size:12.5px;line-height:1.32;margin-bottom:4px;padding-left:15px;position:relative;font-weight:600}
.li:before{content:"■";position:absolute;left:0;font-size:8px;top:3px}
.lv{font-size:12.5px;margin-bottom:3px}.lv b{font-weight:800}
.warn{border:2px solid #000;padding:7px 10px;margin-bottom:2px}
.warn .wh{font-weight:900;font-size:13px;margin-bottom:4px}
.warn .wl{font-size:11.5px;line-height:1.38;margin-bottom:6px;font-weight:600}.warn .wl:last-child{margin-bottom:0}
.bottom{border-top:2px solid #000;padding:16px 20px;display:flex;justify-content:center}
.sq{border:4px solid #000;padding:20px 30px;text-align:center;width:78%}
.sq .l{font-size:34px;font-weight:900;letter-spacing:1px}.sq .h{font-size:13px;color:#555;margin-top:12px}
.sq .l .ln{font-weight:400}
.ft{border-top:2px solid #000;padding:8px 14px;display:flex;align-items:center;gap:12px}
.ft .qr{width:74px;height:74px;flex:0 0 auto;border:1.5px solid #000}.ft .qr img{width:100%;height:100%;display:block}
.ft .ftx{flex:1;font-size:11px;line-height:1.5}.ft .ftx b{font-weight:900}.ft .sc{font-size:10px;font-weight:700;font-style:italic;margin-top:2px}
</style>
<div class="page"><div class="frame">
 <div class="hd"><div class="b">RAM IMPEX<small>ანთრაციტის ბრიკეტი</small></div><div class="r">იმპორტიორი · დისტრიბუტორი<br>595 533 500 · ramimpex.com.ge</div></div>
 <div class="ti"><h1>ანთრაციტის ბრიკეტი</h1><div class="s">მაღალკალორიული, უკვამლო საწვავი გათბობისთვის და სამეწარმეო ინდუსტრიისთვის</div><div class="en">ANTHRACITE COAL BRIQUETTE</div></div>
 <div class="strip">${picts.map(pc).join('')}</div>
 <div class="body">
  <div class="col l">
   <div class="h2">შემადგენლობა</div>
   <div class="li">100% ანთრაციტის ქვანახშირი — უმაღლესი ხარისხის.</div>
   <div class="h2">ტექნიკური მაჩვენებლები</div>
   <div class="lv">თბოგამოცემა (NCV): <b>7 951 კკალ/კგ</b></div>
   <div class="lv">ზომა: <b>50×50×32 მმ</b></div>
   <div class="lv">გოგირდი: <b>≤ 1,16%</b></div>
   <div class="lv">ნაცარი: <b>≤ 11,1%</b></div>
   <div class="lv">ტენიანობა: <b>≤ 6,5%</b></div>
   <div class="lv">აქროლადი ნივთ.: <b>≤ 8,5%</b></div>
   <div class="h2">რატომ არის კარგი</div>
   <div class="li">2× მეტი სითბო, ვიდრე შეშა (მაღალი კალორიულობა).</div>
   <div class="li">8–12 საათი იწვის ერთ ჩაყრაზე (შეშა 1–2 სთ).</div>
   <div class="li">ცოტა კვამლი და ნაცარი — სუფთა წვა.</div>
   <div class="li">ეკონომიური და სტაბილური ხარისხის.</div>
   <div class="h2">სად გამოიყენება</div>
   <div class="li">ღუმელი და ქურა.</div>
   <div class="li">ფეჩი / საოჯახო გათბობა.</div>
   <div class="li">სათბურების გათბობა · სამრეწველო ქვაბები.</div>
  </div>
  <div class="col">
   <div class="warn"><div class="wh">გაფრთხილება</div>
    <div class="wl">⚠️ განკუთვნილია მხოლოდ გათბობისთვის — ღუმელი, ფეჩი, სათბური. არ არის რეკომენდებული ღია ცეცხლზე საკვების მოსამზადებლად.</div>
    <div class="wl">🔩 ძლიერი სიმხურვალის გამო სასურველია ღუმელი/ფეჩი იყოს თუჯის (ნახშირზე გათვლილი), ან აღჭურვილი თუჯის ცხაურით (ბადე/სეტკა).</div></div>
   <div class="h2">მწარმოებელი / იმპორტიორი</div>
   <div class="lv">მწარმოებელი: <b>რუსეთის ფედერაცია</b></div>
   <div class="lv">იმპორტიორი: <b>შპს „რამ იმპექს“</b></div>
   <div class="lv">შეფუთვა: <b>10 კგ ტომარა / ბიგ-ბეგი</b></div>
   <div class="lv">სერტიფიკატები: <b>ISO · ГОСТ Р · MSDS</b></div>
   <div class="h2">შენახვის პირობები</div>
   <div class="li">ვენტილირებად ადგილას; ტენის, ცეცხლისა და ბავშვებისგან მოშორებით.</div>
   <div class="li">შენახვის ვადა შეუზღუდავი — ხანგრძლივი შენახვა არაფერს უშლის ხელს.</div>
   <div class="li">საწყობი: ნატახტარი (თვითგატანა შესაძლებელია).</div>
  </div>
 </div>
 <div class="bottom">
  <div class="sq"><div class="l">წონა: <span class="ln">________________</span> კგ</div><div class="h">(ხელით ჩაწერეთ)</div></div>
 </div>
 <div class="ft"><div class="qr"><img src="${qr}"></div><div class="ftx"><b>იმპორტიორი: შპს „რამ იმპექს“</b> · ს/კ 405565794<br>📞 595 533 500 · ✉ info@ramimpex.com.ge · 🌐 ramimpex.com.ge<div class="sc">დაასკანერე QR — სრული ინფორმაცია, ფასები და მდებარეობა</div></div></div>
</div></div>`;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:2});
 fs.writeFileSync(__dirname+'/_stkdoc.html',html);await p.goto('file://'+__dirname+'/_stkdoc.html');await p.waitForTimeout(300);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 const m=await p.evaluate(()=>({fs:document.querySelector('.frame').scrollHeight,fc:document.querySelector('.frame').clientHeight}));
 await p.screenshot({path:__dirname+'/_stkdoc_preview.png'});
 await b.close();console.log(JSON.stringify(m));
})();
