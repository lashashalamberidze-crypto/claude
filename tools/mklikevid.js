// RAM IMPEX — "დაალაიქე გვერდი" მოკლე რილსი (1080x1920)
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const foto='data:image/jpeg;base64,'+fs.readFileSync(__dirname+'/b_full1.jpg').toString('base64');
const W=1080,H=1920;
const F="'Noto Sans Georgian','Segoe UI',system-ui,sans-serif";
// [emoji, useFoto, title, sub, dur]
const SC=[
 ['🔥',true,'სად იყიდი ანთრაციტს?','ბრიკეტი შენს რეგიონში',3.0],
 ['INFO',false,'','',4.4],
 ['📍',false,'იმერეთი · სამტრედია','ირაკლი · 📞 579 21 99 01',3.8],
 ['🆕',false,'სხვა რეგიონები','ეტაპობრივად ემატება',2.8],
 ['👍',false,'დაალაიქე ჩვენი გვერდი','რომ არ გამოგრჩეს ახლოს გახსნილი წერტილი',3.2],
 ['CTA',false,'','',3.4]
];
const INFO_FACTS=['🌡 ~7 951 კკალ/კგ — 2× მეტი სითბო','⏱ 8–12 საათი ერთ ჩაყრაზე','💨 უკვამლო · ცოტა ნაცარი','💰 ეკონომიური — 1 კგ = ~10 კგ შეშა'];
function slide(sc){
 const [emoji,useFoto,title,sub]=sc;
 if(emoji==='CTA'){
  return `<!doctype html><meta charset="utf-8"><style>*{margin:0;box-sizing:border-box;font-family:${F}}
  .p{width:${W}px;height:${H}px;color:#fff;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;
   background:radial-gradient(900px 620px at 50% 12%,rgba(24,119,242,.55),transparent 60%),linear-gradient(160deg,#1877F2,#0b3d80 72%)}
  .l{display:flex;align-items:center;gap:18px;margin-bottom:44px}.l img{width:100px;height:100px}.l b{font-size:58px;font-weight:900}
  .big{font-size:200px;line-height:1}
  h1{margin-top:10px;font-size:78px;font-weight:900;color:#fff}
  .u{margin-top:30px;background:#fff;color:#0b3d80;font-size:50px;font-weight:900;padding:20px 44px;border-radius:22px}
  .ph{margin-top:30px;font-size:58px;font-weight:900}</style>
  <div class="p"><div class="l"><img src="${logo}"><b>RAM IMPEX</b></div>
  <div class="big">👍</div><h1>Like & Follow</h1>
  <div class="u">🌐 ramimpex.com.ge/start</div>
  <div class="ph">📞 595 533 500</div></div>`;
 }
 if(emoji==='INFO'){
  return `<!doctype html><meta charset="utf-8"><style>*{margin:0;box-sizing:border-box;font-family:${F}}
  .p{width:${W}px;height:${H}px;color:#fff;overflow:hidden;position:relative;display:flex;flex-direction:column;justify-content:center;
   background:radial-gradient(900px 560px at 78% 6%,rgba(201,112,26,.5),transparent 60%),radial-gradient(760px 560px at 8% 82%,rgba(180,70,10,.34),transparent 60%),linear-gradient(160deg,#241507,#160c04 58%,#0b0603)}
  .hd{display:flex;align-items:center;gap:16px;padding:0 60px}.hd img{width:66px;height:66px}.hd b{font-size:40px;font-weight:900}
  h1{margin:26px 60px 0;font-size:82px;line-height:1.02;font-weight:900;background:linear-gradient(180deg,#ffcf7a,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
  .bl{margin:40px 60px 0;display:flex;flex-direction:column;gap:22px}
  .bi{background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.18);border-radius:20px;padding:30px 34px;font-size:46px;font-weight:800;line-height:1.2}</style>
  <div class="p"><div class="hd"><img src="${logo}"><b>RAM IMPEX</b></div>
  <h1>🔥 ანთრაციტის ბრიკეტი</h1>
  <div class="bl">${INFO_FACTS.map(f=>'<div class="bi">'+f+'</div>').join('')}</div></div>`;
 }
 const art=useFoto?`<div class="art"><img src="${foto}"></div>`:`<div class="art emoji">${emoji}</div>`;
 return `<!doctype html><meta charset="utf-8"><style>*{margin:0;box-sizing:border-box;font-family:${F}}
 .p{width:${W}px;height:${H}px;color:#fff;overflow:hidden;position:relative;display:flex;flex-direction:column;
  background:radial-gradient(900px 560px at 78% 6%,rgba(24,119,242,.4),transparent 60%),radial-gradient(760px 560px at 8% 82%,rgba(201,112,26,.34),transparent 60%),linear-gradient(160deg,#101826,#0b1017 58%,#070a0f)}
 .hd{display:flex;align-items:center;gap:16px;padding:56px 60px 0}.hd img{width:66px;height:66px}.hd b{font-size:40px;font-weight:900}
 .art{margin:60px 60px 0;height:920px;border-radius:30px;overflow:hidden;border:4px solid rgba(24,119,242,.5);background:linear-gradient(160deg,#12203a,#0c1524);display:flex;align-items:center;justify-content:center}
 .art img{width:100%;height:100%;object-fit:cover}
 .art.emoji{font-size:360px;line-height:1}
 .tx{padding:56px 60px 0}
 .tx h1{font-size:90px;line-height:1.02;font-weight:900;background:linear-gradient(180deg,#bcdcff,#69a8ff);-webkit-background-clip:text;background-clip:text;color:transparent}
 .tx .s{margin-top:20px;font-size:44px;font-weight:800;color:#e9f1fb;line-height:1.25}
 .badge{position:absolute;top:60px;right:60px;background:#1877F2;color:#fff;font-size:46px;font-weight:900;width:100px;height:100px;border-radius:50%;display:flex;align-items:center;justify-content:center}</style>
 <div class="p"><div class="hd"><img src="${logo}"><b>RAM IMPEX</b></div>
 <div class="badge">${emoji}</div>${art}
 <div class="tx"><h1>${title}</h1><div class="s">${sub}</div></div></div>`;
}
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb','--no-sandbox']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:1});
 const durs=[];
 for(let i=0;i<SC.length;i++){const n=String(i+1).padStart(2,'0');
  fs.writeFileSync(__dirname+'/_vlike_'+n+'.html',slide(SC[i]));
  await p.goto('file://'+__dirname+'/_vlike_'+n+'.html');await p.waitForTimeout(250);
  await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
  await p.screenshot({path:__dirname+'/_vlike_'+n+'.png'});durs.push(SC[i][4]);console.log('frame',n);}
 fs.writeFileSync(__dirname+'/_vdurs_like.json',JSON.stringify(durs));
 await b.close();console.log('sum',durs.reduce((a,x)=>a+x,0));
})();
