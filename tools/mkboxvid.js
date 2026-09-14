// RAM IMPEX — მუყაოს ყუთების ვიდეო (1080x1920 vertical frames)
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const FILES=__dirname+'/../ramimpex/files/';
function img(p){try{const abs=p.startsWith('/')?p:FILES+p;const ext=(p.split('.').pop()||'png').toLowerCase();const mime=ext==='jpg'||ext==='jpeg'?'image/jpeg':ext==='webp'?'image/webp':'image/png';return 'data:'+mime+';base64,'+fs.readFileSync(abs).toString('base64');}catch(e){return null;}}
const W=1080,H=1920;
const F="'Noto Sans Georgian','Segoe UI',system-ui,sans-serif";

// [emoji, imageFile|null, title, subtitle, durationSeconds]
const SC=[
 ['📦',null,'გოფრირებული მუყაოს ყუთები','RAM IMPEX — შესაფუთი ყველა მიმართულებით',6.5],
 ['✅','box_generic.png','600+ მზა ზომა','ყველა მიმართულებისთვის — ერთ კატალოგში',5.0],
 ['🍰','cakebox.png','საკონდიტრო & ტორტი','ლანგრები და ტორტის ყუთები',5.0],
 ['🍕','pizza_square_kraft.png','პიცის ლანგრები','კვადრატული · მოჭრილკუთხებიანი · მრგვალი',4.5],
 ['🥦',null,'ბოსტნეული & ხილი','თვითაწყობადი ლანგრები — ავტომატური ხაზებისთვის',4.5],
 ['🥩',null,'ხორცი & რძის ნაწარმი','გაყინული ხორცპროდუქტისა და რძის შესაფუთი',5.0],
 ['🍷','wine_box_ill.png','ღვინო · სასმელი · ლუდი','ღვინის ყუთები, Bag-in-Box, კეგების შესაფუთი',5.0],
 ['🍶',null,'მინის ტარა','ლანგრები და ქვესადგამები ბოთლებისთვის',4.0],
 ['🏥','safetybox_cut.png','სამედიცინო · საარქივო · ფეხსაცმელი','ნარჩენების ყუთები და სპეც. კონსტრუქციები',5.0],
 ['📐','RAM_IMPEX_gofrirebuli_mili.jpg','კუთხოვანი დამცავები & მილები','პალეტის დაცვა და გოფრირებული მილები',5.5],
 ['✨',null,'ნებისმიერი ზომა + ბრენდირება','შენი ლოგოთი და დიზაინით — ინდივიდუალურად',6.0],
 ['🅱️',null,'ყველა პროფილი','B · E · C · CE · BC',5.0],
 ['⚡',null,'ხარისხი · სისწრაფე · ფასი','პირდაპირ მწარმოებლისგან',5.0],
 ['📲',null,'__CTA__','',8.5]
];

function slide(sc){
 const [emoji,imgf,title,sub]=sc;
 const im=imgf?img(imgf):null;
 if(title==='__CTA__'){
  return `<!doctype html><meta charset="utf-8"><style>*{margin:0;box-sizing:border-box;font-family:${F}}
  .p{width:${W}px;height:${H}px;color:#fff;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;
   background:radial-gradient(900px 620px at 50% 12%,rgba(15,138,77,.5),transparent 60%),linear-gradient(160deg,#0B6B3C,#08351f 70%)}
  .l{display:flex;align-items:center;gap:18px;margin-bottom:40px}.l img{width:96px;height:96px}.l b{font-size:56px;font-weight:900}
  h1{font-size:70px;font-weight:900;line-height:1.05;background:linear-gradient(180deg,#ffe9b0,#ffce6b);-webkit-background-clip:text;background-clip:text;color:transparent}
  .u{margin-top:26px;background:#F2B807;color:#3a2600;font-size:52px;font-weight:900;padding:20px 44px;border-radius:22px}
  .ph{margin-top:34px;font-size:60px;font-weight:900}
  .wh{margin-top:14px;font-size:34px;font-weight:700;color:#cdeeda}</style>
  <div class="p"><div class="l"><img src="${logo}"><b>RAM IMPEX</b></div>
  <h1>სრული კატალოგი<br>& ონლაინ შეკვეთა</h1>
  <div class="u">🌐 ramimpex.com.ge</div>
  <div class="ph">📞 595 533 500</div>
  <div class="wh">📍 საწყობი — ნატახტარი</div></div>`;
 }
 const art=im
   ? `<div class="art"><img src="${im}"></div>`
   : `<div class="art emoji">${emoji}</div>`;
 return `<!doctype html><meta charset="utf-8"><style>*{margin:0;box-sizing:border-box;font-family:${F}}
 .p{width:${W}px;height:${H}px;color:#fff;overflow:hidden;position:relative;display:flex;flex-direction:column;
  background:radial-gradient(900px 560px at 78% 6%,rgba(201,112,26,.5),transparent 60%),radial-gradient(760px 560px at 8% 82%,rgba(180,70,10,.32),transparent 60%),linear-gradient(160deg,#241507,#160c04 58%,#0b0603)}
 .hd{display:flex;align-items:center;gap:16px;padding:56px 60px 0}.hd img{width:66px;height:66px}.hd b{font-size:40px;font-weight:900;letter-spacing:.5px}
 .art{margin:54px 60px 0;height:900px;border-radius:30px;overflow:hidden;border:4px solid rgba(201,112,26,.5);background:#f3ede3;display:flex;align-items:center;justify-content:center}
 .art img{width:100%;height:100%;object-fit:cover}
 .art.emoji{background:linear-gradient(160deg,#2c1c0c,#171009);font-size:340px;line-height:1}
 .tx{padding:52px 60px 0}
 .tx h1{font-size:86px;line-height:1.02;font-weight:900;background:linear-gradient(180deg,#ffcf7a,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
 .tx .s{margin-top:20px;font-size:42px;font-weight:800;color:#f3e7d6;line-height:1.25}
 .badge{position:absolute;top:60px;right:60px;background:#F2B807;color:#3a2600;font-size:44px;font-weight:900;width:96px;height:96px;border-radius:50%;display:flex;align-items:center;justify-content:center}</style>
 <div class="p"><div class="hd"><img src="${logo}"><b>RAM IMPEX</b></div>
 <div class="badge">${emoji}</div>
 ${art}
 <div class="tx"><h1>${title}</h1><div class="s">${sub}</div></div></div>`;
}
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb','--no-sandbox']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:1});
 const durs=[];
 for(let i=0;i<SC.length;i++){
  const n=String(i+1).padStart(2,'0');
  fs.writeFileSync(__dirname+'/_vbox_'+n+'.html',slide(SC[i]));
  await p.goto('file://'+__dirname+'/_vbox_'+n+'.html');await p.waitForTimeout(250);
  await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
  await p.screenshot({path:__dirname+'/_vbox_'+n+'.png'});
  durs.push(SC[i][4]);
  console.log('frame',n);
 }
 fs.writeFileSync(__dirname+'/_vdurs_box.json',JSON.stringify(durs));
 await b.close();
 console.log('frames done, durations sum',durs.reduce((a,x)=>a+x,0));
})();
