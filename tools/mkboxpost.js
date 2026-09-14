// RAM IMPEX — მუყაოს ყუთების პოსტი (1080x1350)
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const FILES=__dirname+'/../ramimpex/files/';
function du(p){const ext=(p.split('.').pop()||'png').toLowerCase();const mime=ext==='jpg'||ext==='jpeg'?'image/jpeg':ext==='webp'?'image/webp':'image/png';return 'data:'+mime+';base64,'+fs.readFileSync(FILES+p).toString('base64');}
const gallery=['cakebox.png','pizza_square_kraft.png','wine_box_ill.png','box_generic.png'].map(du);
const W=1080,H=1350;
const F="'Noto Sans Georgian','Segoe UI',system-ui,sans-serif";
const t={kicker:'📦 შესაფუთი',title:'მუყაოს ყუთები',hook:'600+ მზა ზომა — ნებისმიერი ფორმა',
 sub:'რა გვაქვს 👇',
 b:['🍰  საკონდიტრო · ტორტი · 🍕 პიცა','🥦  ბოსტნეული · ხილი · 🥩 ხორცი · 🥛 რძე','🍷  ღვინო · სასმელი · 🍺 ლუდი · 🍶 მინა','✨  ნებისმიერი ზომა + ბრენდირება'],
 cta:'სრული კატალოგი & შეკვეთა:',wh:'📍 საწყობი — ნატახტარი'};
const html=`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box;font-family:${F}}
.p{width:${W}px;height:${H}px;position:relative;overflow:hidden;color:#fff;
 background:radial-gradient(900px 500px at 80% 6%,rgba(201,112,26,.5),transparent 60%),radial-gradient(760px 520px at 10% 70%,rgba(180,70,10,.35),transparent 60%),linear-gradient(160deg,#241507,#160c04 55%,#0d0703)}
.hd{display:flex;align-items:center;gap:16px;padding:40px 48px 0}
.hd img{width:64px;height:64px}.hd b{font-size:38px;font-weight:900;letter-spacing:.5px}
.kick{margin:20px 48px 0;display:inline-block;background:#F2B807;color:#3a2600;font-weight:900;font-size:26px;padding:9px 22px;border-radius:999px}
.ti{padding:12px 48px 0}
.ti h1{font-size:78px;line-height:1.0;font-weight:900;background:linear-gradient(180deg,#ffcf7a,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
.hook{margin:12px 48px 0;font-size:34px;font-weight:900;color:#fff}
.foto{margin:16px 48px 0;height:300px;border-radius:20px;overflow:hidden;border:3px solid rgba(201,112,26,.55);background:#f3ede3;display:flex;align-items:center;justify-content:space-around;gap:10px;padding:16px 18px}
.foto img{flex:1;min-width:0;max-width:24%;max-height:100%;object-fit:contain}
.sub{margin:20px 48px 6px;font-size:24px;font-weight:800;color:#ffb347}
.bl{margin:0 48px;display:flex;flex-direction:column;gap:12px}
.bi{background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.16);border-radius:14px;padding:15px 20px;font-size:26px;font-weight:800;line-height:1.25}
.cta{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(90deg,#0B6B3C,#0F8A4D);padding:24px 48px}
.cta .c{font-size:25px;font-weight:800;color:#eafff2}
.cta .u{font-size:40px;font-weight:900;color:#fff;margin-top:2px}
.cta .r{display:flex;justify-content:space-between;align-items:center;margin-top:12px;flex-wrap:wrap;gap:8px}
.cta .ph{font-size:34px;font-weight:900;color:#fff}
.cta .wh{font-size:21px;font-weight:700;color:#bff0d3}
</style>
<div class="p">
 <div class="hd"><img src="${logo}"><b>RAM IMPEX</b></div>
 <div><span class="kick">${t.kicker}</span></div>
 <div class="ti"><h1>${t.title}</h1></div>
 <div class="hook">📦 ${t.hook}</div>
 <div class="foto">${gallery.map(g=>`<img src="${g}">`).join('')}</div>
 <div class="sub">${t.sub}</div>
 <div class="bl">${t.b.map(x=>`<div class="bi">${x}</div>`).join('')}</div>
 <div class="cta"><div class="c">${t.cta}</div><div class="u">ramimpex.com.ge/shesafuti</div>
  <div class="r"><div class="ph">📞 595 533 500</div><div class="wh">${t.wh}</div></div></div>
</div>`;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb','--no-sandbox']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:2});
 fs.writeFileSync(__dirname+'/_boxpost.html',html);
 await p.goto('file://'+__dirname+'/_boxpost.html');await p.waitForTimeout(350);
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 await p.screenshot({path:__dirname+'/RAM_IMPEX_boxes_post_ka.jpg',quality:92,type:'jpeg'});
 console.log('boxes post done');
 await b.close();
})();
