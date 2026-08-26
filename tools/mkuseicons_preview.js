const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const b64=n=>'data:image/png;base64,'+fs.readFileSync(`${__dirname}/useicons/${n}.png`).toString('base64');
const F="'Noto Sans Georgian','Sylfaen',sans-serif";
const groups=[
 ['რატომ არის კარგი',[['heat','2× მეტი სითბო','ვიდრე შეშა'],['time','8–12 სთ წვა','ერთ ჩაყრაზე']]],
 ['სად გამოიყენება',[['stove','ღუმელი / ქურა',''],['home','ფეჩი / საოჯახო',''],['greenhouse','სათბურის გათბობა',''],['industry','სამრეწველო ქვაბები','']]],
];
const row=([i,a,b])=>`<div class="r"><img src="${b64(i)}"><div><div class="a">${a}</div>${b?`<div class="b">${b}</div>`:''}</div></div>`;
const grp=([t,rows])=>`<div class="g"><div class="gt">${t}</div><div class="rows">${rows.map(row).join('')}</div></div>`;
const html=`<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;font-family:${F};color:#111}
body{width:760px;margin:0;padding:26px 28px;background:#fff}
.h{font-weight:900;font-size:22px;margin-bottom:4px}
.sub{color:#666;font-size:14px;margin-bottom:20px}
.g{margin-bottom:22px}
.gt{font-weight:900;font-size:17px;color:#C9701A;border-bottom:2px solid #C9701A;padding-bottom:4px;margin-bottom:12px}
.rows{display:flex;flex-wrap:wrap;gap:12px}
.r{display:flex;align-items:center;gap:12px;border:1.5px solid #ccc;border-radius:10px;padding:10px 16px;min-width:220px}
.r img{width:44px;height:44px}
.a{font-weight:800;font-size:16px}.b{font-size:12.5px;color:#666;margin-top:1px}
</style>
<div class="h">🔥 აიკონები + შემოკლებული ტექსტი</div>
<div class="sub">თითო აიკონი ცალკე PNG ფაილად — ჩასვი ტექსტის გვერდით</div>
${groups.map(grp).join('')}`;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:760,height:100},deviceScaleFactor:2});
 await p.setContent(html);await p.waitForTimeout(250);
 await p.screenshot({path:__dirname+'/_useicons_map.png',fullPage:true});
 await b.close();console.log('map rendered');
})();
