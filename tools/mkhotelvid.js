// RAM IMPEX — hotel-heating video overlays (1080x1920 transparent PNGs)
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const W=1080,H=1920;
const F="'Noto Sans Georgian','Segoe UI',system-ui,sans-serif";
const base=(inner)=>`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box;font-family:${F}}
html,body{background:transparent}
.f{width:${W}px;height:${H}px;position:relative;overflow:hidden}
</style><div class="f">${inner}</div>`;

// persistent top brand bar
const brand=`
<div style="position:absolute;top:34px;left:28px;right:28px;display:flex;align-items:center;justify-content:space-between;gap:12px">
 <div style="display:flex;align-items:center;gap:14px;background:rgba(13,8,3,.55);border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:12px 24px 12px 14px;backdrop-filter:blur(2px)">
   <img src="${logo}" style="width:60px;height:60px"><b style="font-size:40px;font-weight:900;color:#fff;letter-spacing:.5px">RAM IMPEX</b>
 </div>
 <div style="background:#F2B807;color:#3a2600;font-weight:900;font-size:26px;padding:12px 22px;border-radius:999px">🏨 სასტუმროებს</div>
</div>`;

// bottom caption panel
function cap(text,accent){return `
<div style="position:absolute;left:0;right:0;bottom:0;height:520px;background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(11,6,3,.55) 42%,rgba(11,6,3,.92) 100%)"></div>
<div style="position:absolute;left:40px;right:40px;bottom:120px">
 <div style="width:78px;height:8px;border-radius:6px;background:${accent};margin-bottom:22px"></div>
 <div style="font-size:60px;line-height:1.14;font-weight:900;color:#fff;text-shadow:0 3px 14px rgba(0,0,0,.6)">${text}</div>
</div>`;}

const OUT=[
 ['_ov_brand.png', brand],
 ['_ov_cap1.png', brand+cap('🏨 იდეალური <span style="color:#ffcf7a">სასტუმროს გათბობისთვის</span>','#F2B807')],
 ['_ov_cap2.png', brand+cap('🔥 <span style="color:#ffcf7a">8–12 საათი</span> წვა · ~2× მეტი სითბო ვიდრე შეშა','#ff8c1a')],
 ['_ov_cap3.png', brand+cap('💨 უკვამლო · ცოტა ნაცარი · <span style="color:#6dffab">ეკონომიური</span>','#0F8A4D')],
 ['_ov_cap4.png', brand+cap('💰 <span style="color:#ffcf7a">2.00 ₾/კგ-დან</span><br>📞 595 533 500 · ramimpex.com.ge/info','#F2B807')],
];
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:1});
 for(const [file,inner] of OUT){
  await p.goto('data:text/html;charset=utf-8,'+encodeURIComponent(base(inner)));
  await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
  await p.waitForTimeout(150);
  await p.screenshot({path:__dirname+'/'+file,omitBackground:true});
  console.log('ov',file);
 }
 await b.close();
})();
