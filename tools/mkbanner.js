// RAM IMPEX — Facebook launch banner (anthracite sales start) 1080x1550
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const foto='data:image/jpeg;base64,'+fs.readFileSync(__dirname+'/b_full1.jpg').toString('base64');
const W=1080,H=1210;
const F="'Noto Sans Georgian','Segoe UI',system-ui,sans-serif";
const tiers=[['≤ 1000 კგ','2.00','10 კგ ტომარა',false],['1000–21000 კგ','1.80','10 კგ ტომარა',true],['21000 კგ +','1.30','ბიგ-ბეგი',false]];
const html=`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box;font-family:${F}}
.p{width:${W}px;height:${H}px;position:relative;overflow:hidden;color:#fff;
 background:radial-gradient(1000px 560px at 82% 4%,rgba(201,112,26,.5),transparent 60%),radial-gradient(820px 560px at 8% 74%,rgba(180,70,10,.33),transparent 60%),linear-gradient(158deg,#241507,#160c04 55%,#0b0603)}
.hd{display:flex;align-items:center;gap:16px;padding:40px 52px 0}
.hd img{width:66px;height:66px}.hd b{font-size:40px;font-weight:900;letter-spacing:.5px}
.kick{margin:20px 52px 0;display:inline-block;background:#F2B807;color:#3a2600;font-weight:900;font-size:30px;padding:11px 26px;border-radius:999px}
.ti{padding:14px 52px 0}
.ti h1{font-size:82px;line-height:.98;font-weight:900;background:linear-gradient(180deg,#ffcf7a,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{margin:10px 52px 0;font-size:30px;font-weight:800;color:#ffdca6}
.foto{margin:18px 52px 0;height:300px;border-radius:22px;overflow:hidden;border:3px solid rgba(201,112,26,.55)}
.foto img{width:100%;height:100%;object-fit:cover}
.pr{margin:22px 52px 0}
.prh{font-size:30px;font-weight:900;color:#fff;margin-bottom:12px}
.tiers{display:flex;gap:14px}
.tier{flex:1;position:relative;background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.16);border-radius:18px;padding:22px 12px;text-align:center}
.tier.pop{border-color:#F2B807;background:linear-gradient(180deg,rgba(242,184,7,.16),rgba(255,255,255,.05))}
.pop-b{position:absolute;top:-15px;left:50%;transform:translateX(-50%);background:#F2B807;color:#2a1a05;font-size:18px;font-weight:900;padding:5px 14px;border-radius:999px;white-space:nowrap}
.tq{font-size:23px;font-weight:800;color:#e9dccb}
.tp{font-size:56px;font-weight:900;color:#ffce7d;line-height:1;margin:8px 0 2px}
.tp small{font-size:22px;font-weight:800;color:#d9cbbc}
.tpk{font-size:20px;font-weight:700;color:#c9bcae}
.rw{display:flex;gap:14px;margin:22px 52px 0}
.rules,.warn{flex:1;border-radius:18px;padding:20px 22px}
.rules{background:rgba(30,111,168,.16);border:2px solid #5aa0d6}
.warn{background:rgba(242,184,7,.1);border:2px solid rgba(242,184,7,.55)}
.bh{font-size:24px;font-weight:900;margin-bottom:10px}
.rules .bh{color:#bfe0f7}.warn .bh{color:#ffe08a}
.li{font-size:22px;font-weight:600;color:#f2ece2;line-height:1.32;margin-top:9px}
.li b{color:#ffd486}
.cta{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(90deg,#0B6B3C,#0F8A4D);padding:24px 52px}
.cta .r{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
.cta .ph{font-size:40px;font-weight:900;color:#fff}
.cta .u{font-size:28px;font-weight:900;color:#eafff2}
.cta .wh{font-size:22px;font-weight:700;color:#bff0d3;margin-top:4px}
</style>
<div class="p">
 <div class="hd"><img src="${logo}"><b>RAM IMPEX</b></div>
 <div><span class="kick">🎉 გაყიდვა დაიწყო</span></div>
 <div class="ti"><h1>ანთრაციტის ბრიკეტი</h1></div>
 <div class="sub">🔥 ~2× მეტი სითბო ვიდრე შეშა · 8–12 სთ წვა · უკვამლო</div>
 <div class="foto"><img src="${foto}"></div>
 <div class="pr"><div class="prh">💰 ფასები <span style="font-size:22px;font-weight:800;color:#d9cbbc">(₾/კგ, დღგ-ის ჩათვლით)</span></div>
  <div class="tiers">${tiers.map(t=>`<div class="tier ${t[3]?'pop':''}">${t[3]?'<div class="pop-b">პოპულარული</div>':''}<div class="tq">${t[0]}</div><div class="tp">${t[1]}<small> ₾</small></div><div class="tpk">${t[2]}</div></div>`).join('')}</div>
 </div>
 <div class="rw">
  <div class="rules"><div class="bh">📘 გამოყენება</div>
   <div class="li">🔥 <b>დანთება:</b> ჯერ ნახშირით/შეშის ნახშირით გააღვივეთ.</div>
   <div class="li">🌬️ <b>აერაცია:</b> უზრუნველყავით ჰაერის მიწოდება.</div>
  </div>
  <div class="warn"><div class="bh">⚠️ გაფრთხილება</div>
   <div class="li">მხოლოდ <b>დახურულ ფეჩში/ღუმელში</b>, საკვამურითა და კარგი ვენტილაციით.</div>
  </div>
 </div>
 <div class="cta"><div class="r"><div><div class="ph">📞 595 533 500</div><div class="wh">📍 საწყობი — ნატახტარი</div></div><div style="text-align:right"><div class="u">🌐 ramimpex.com.ge/info</div><div class="wh">სრული ინფო & ჩამოტვირთვა</div></div></div></div>
</div>`;
(async()=>{
 fs.writeFileSync(__dirname+'/_banner.html',html);
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:2});
 await p.goto('file://'+__dirname+'/_banner.html');await p.waitForTimeout(350);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 await p.screenshot({path:__dirname+'/RAM_IMPEX_banner_launch.jpg',quality:93,type:'jpeg'});
 await b.close();console.log('ok');
})();
