// RAM IMPEX — ანთრაციტის ვიდეო (ტექსტი ეკრანზე), ვერტიკალური 1080x1920
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const TAG='story';
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const W=1080,H=1920;
const F="'Noto Sans Georgian','Segoe UI',system-ui,sans-serif";
const brand='RAM IMPEX', site='ramimpex.com.ge/info', phone='📞 595 533 500';
const foot=`<div class="foot"><span>${phone}</span><span>${site}</span></div>`;
const S=[];
const push=(dur,cls,inner)=>S.push({dur,html:`<div class="slide ${cls}">${inner}</div>`});
const scene=(dur,header,body,extra)=>push(dur,'s-body',`${header?`<div class="kh">${header}</div>`:''}<div class="bd">${body}</div>${extra||''}${foot}`);

// 1 — intro
push(6.7,'s-out',`
 <div class="ibg"></div>
 <div class="otop"><img class="lg" src="${logo}"><b>${brand}</b></div>
 <div class="ih2">🔥 ანთრაციტის ბრიკეტი</div>
 <div class="ot" style="color:#ffd486;font-weight:900">📘 გამოყენების წესები</div>
 <div class="bigflame">🔥</div>`);

// what is it
scene(7.8,'🧱 რა არის ანთრაციტი','ანთრაციტის ბრიკეტი — ყველაზე <b>მაღალხარისხიანი მყარი საწვავი</b>. მზადდება სუფთა ანთრაციტის ქვანახშირისგან, ნახშირბადის უმაღლესი შემცველობით, <b>ქიმიური დანამატების გარეშე</b>.');
scene(7.5,'','წვრილი ფრაქცია <b>მაღალი წნევით</b> იწნეხება მკვრივ, ერთგვაროვან ბრიკეტად. შედეგი — <b>მაქსიმალური სითბო</b> და ხანგრძლივი, სუფთა წვა.');

// why better
scene(7.8,'🔥 რატომ ჯობია','<b>1 კგ ბრიკეტი ≈ 10 კგ შეშა</b>. იწვის <b>8–12 საათი</b> ერთ ჩაყრაზე — ცოტა კვამლი და ნაცარი, ეკონომიური.');
scene(8.1,'','ანთრაციტის შეშასთან შედარება <b>უადგილოა</b> — შეშის ერთადერთი უპირატესობა ღია ცეცხლზე საკვების მომზადებაა.');

// how to use / what to consider
scene(7.8,'⚙️ რა უნდა გაითვალისწინოთ','<span class="num">1</span> სჭირდება <b>ჰაერის მიწოდება ქვემოდან</b> — ცხაურიანი ფეჩი.');
// stove illustration scene
push(8.4,'s-stove',`<div class="kh">✅ ასეთი ღუმელი გამოდგება</div>
 <div class="stovewrap">
 <svg viewBox="0 0 900 900" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" font-family="${F}">
  <defs>
   <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6b6f75"/><stop offset=".45" stop-color="#3a3d42"/><stop offset="1" stop-color="#1c1e21"/></linearGradient>
   <linearGradient id="steelD" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a4d52"/><stop offset="1" stop-color="#141517"/></linearGradient>
   <linearGradient id="door" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#55585d"/><stop offset="1" stop-color="#232528"/></linearGradient>
  </defs>
  <!-- legs -->
  <g stroke="#2a2c2f" stroke-width="14" stroke-linecap="round">
   <line x1="250" y1="640" x2="215" y2="820"/><line x1="640" y1="640" x2="700" y2="820"/>
   <line x1="360" y1="655" x2="345" y2="805"/><line x1="560" y1="655" x2="600" y2="805"/>
   <line x1="230" y1="760" x2="680" y2="760"/>
  </g>
  <!-- body -->
  <polygon points="250,250 640,250 700,300 700,655 250,655" fill="url(#steel)" stroke="#111" stroke-width="3"/>
  <polygon points="250,250 640,250 700,300 260,300" fill="url(#steelD)" stroke="#111" stroke-width="3"/>
  <polygon points="640,250 700,300 700,655 640,610" fill="#17181a" stroke="#111" stroke-width="3"/>
  <!-- chimney -->
  <rect x="300" y="150" width="70" height="105" rx="6" fill="url(#steelD)" stroke="#111" stroke-width="3"/>
  <ellipse cx="335" cy="152" rx="35" ry="12" fill="#0d0e0f" stroke="#111" stroke-width="3"/>
  <!-- upper door -->
  <rect x="285" y="330" width="330" height="120" rx="8" fill="url(#door)" stroke="#0c0c0c" stroke-width="4"/>
  <rect x="600" y="378" width="34" height="24" rx="5" fill="#7a7d82"/>
  <!-- grate door (middle) -->
  <rect x="285" y="462" width="330" height="120" rx="8" fill="url(#door)" stroke="#0c0c0c" stroke-width="4"/>
  <g stroke="#0b0b0b" stroke-width="7"><line x1="315" y1="500" x2="585" y2="500"/><line x1="315" y1="522" x2="585" y2="522"/><line x1="315" y1="544" x2="585" y2="544"/></g>
  <rect x="600" y="508" width="34" height="24" rx="5" fill="#7a7d82"/>
  <!-- ash door (small, bottom) -->
  <rect x="300" y="596" width="120" height="46" rx="6" fill="url(#door)" stroke="#0c0c0c" stroke-width="3"/>
  <!-- labels -->
  <g font-weight="900" font-size="30" fill="#ffd486">
   <line x1="335" y1="150" x2="150" y2="95" stroke="#F2B807" stroke-width="4"/><circle cx="335" cy="150" r="7" fill="#F2B807"/>
   <text x="20" y="86">🌫️ საკვამური</text><text x="20" y="120" font-size="24" fill="#e9d9c2">(წევა · 5–6 მ+)</text>
   <line x1="585" y1="522" x2="760" y2="470" stroke="#2ec77e" stroke-width="4"/><circle cx="585" cy="522" r="7" fill="#2ec77e"/>
   <text x="640" y="455" fill="#7dfab0">🔲 ცხაური</text>
   <line x1="360" y1="619" x2="150" y2="700" stroke="#F2B807" stroke-width="4"/><circle cx="360" cy="619" r="7" fill="#F2B807"/>
   <text x="20" y="726">💨 ნაცრის კარი</text><text x="20" y="760" font-size="24" fill="#e9d9c2">ჰაერი ქვევიდან ⬆</text>
  </g>
 </svg></div>
 ${foot}`);
scene(8.4,'','<span class="num">2</span> საჭიროა <b>კარგი გამწოვობა</b>, რომ ცეცხლი არ ჩაქრეს — ღუმელის მილი <b>5–6 მეტრზე</b> ნაკლები არ უნდა იყოს.');
scene(7.8,'','<span class="num">3</span> წვის ტემპერატურა <b>ჰაერის მიწოდებაზეა</b> დამოკიდებული — რაც მეტი ჰაერი, მით მაღალი სიმხურვალე.');

// stove / boiler
scene(8.7,'🏭 ღუმელი / ქვაბი','ეფექტურობა დამოკიდებულია ღუმელსა და ქვაბზე. თუ ქვაბი ან ბოილერი <b>ქვანახშირზეა გათვლილი</b> — ანთრაციტიც მიდის.');
scene(8.1,'','ეს ზუსტდება <b>ღუმელის/ბოილერის მწარმოებელთან</b>, ხოლო კუსტარულ ღუმელზე — მის <b>ხელოსანთან</b>.');
scene(9.0,'🛡 თუჯის ცხაური','თუჯის ცხაური ღუმელის დაცვას მარტივად წყვეტს: ანთრაციტი საყოფაცხოვრებო ღუმელში იშვიათად ადის <b>1000°C-მდე</b>, თუჯი კი <b>1200°C-ზე</b> დნება.');

// outro
push(7.5,'s-out',`
 <div class="ibg"></div>
 <div class="otop"><img class="lg" src="${logo}"><b>${brand}</b></div>
 <div class="oh">ანთრაციტის ბრიკეტი</div>
 <div class="ot">სითბო, რომელსაც ენდობი</div>
 <div class="obig">${phone}</div>
 <div class="ourl">🌐 ${site}</div>`);

const CSS=`
*{margin:0;padding:0;box-sizing:border-box;font-family:${F};-webkit-font-smoothing:antialiased}
.slide{width:${W}px;height:${H}px;position:relative;overflow:hidden;color:#fff;padding:0 78px;display:flex;flex-direction:column;justify-content:center;
 background:radial-gradient(1100px 700px at 82% 4%,rgba(201,112,26,.42),transparent 60%),radial-gradient(950px 720px at 8% 82%,rgba(180,70,10,.32),transparent 60%),linear-gradient(158deg,#241507,#160c04 55%,#0b0603)}
.foot{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;padding:30px 64px;background:linear-gradient(90deg,#0B6B3C,#0F8A4D);font-size:32px;font-weight:900;color:#fff}
.s-body .kh{font-size:56px;font-weight:900;line-height:1.1;margin-bottom:40px;background:linear-gradient(180deg,#ffcf7a,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
.s-body .bd{font-size:64px;font-weight:800;line-height:1.34;color:#f6efe6}
.s-body .bd b{color:#ffce7d}
.num{display:inline-flex;align-items:center;justify-content:center;width:74px;height:74px;border-radius:50%;background:linear-gradient(160deg,#F2B807,#d97a12);color:#2a1a05;font-size:44px;font-weight:900;margin-right:16px;vertical-align:middle}
.ibg{position:absolute;inset:0;background:radial-gradient(900px 620px at 50% 30%,rgba(242,184,7,.16),transparent 62%)}
.s-stove .kh{font-size:56px;font-weight:900;line-height:1.1;margin-bottom:24px;text-align:center;color:#7dfab0}
.s-stove .stovewrap{flex:1;max-height:1080px;display:flex;align-items:center;justify-content:center;margin-bottom:40px}
.s-out{align-items:center;text-align:center}
.otop{display:flex;align-items:center;gap:20px;justify-content:center}
.lg{width:92px;height:92px}.otop b{font-size:50px;font-weight:900;letter-spacing:.5px}
.ih2{margin-top:70px;font-size:96px;font-weight:900;background:linear-gradient(180deg,#ffd486,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent;line-height:1}
.oh{margin-top:80px;font-size:80px;font-weight:900;background:linear-gradient(180deg,#ffd486,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
.ot{margin-top:26px;font-size:48px;font-weight:800;color:#efe2d2;line-height:1.3}
.bigflame{margin-top:70px;font-size:300px;line-height:1}
.obig{margin-top:74px;font-size:100px;font-weight:900;color:#fff}
.ourl{margin-top:28px;font-size:52px;font-weight:900;color:#6dffab}
`;
const doc=`<!doctype html><meta charset="utf-8"><style>${CSS}</style><body style="margin:0;background:#000">${S.map(s=>s.html).join('\n')}</body>`;
(async()=>{
 fs.writeFileSync(__dirname+'/_video_'+TAG+'.html',doc);
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:1});
 await p.goto('file://'+__dirname+'/_video_'+TAG+'.html');
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 await p.waitForTimeout(400);
 const els=await p.$$('.slide');const durs=[];
 for(let i=0;i<els.length;i++){const n=String(i+1).padStart(2,'0');await els[i].screenshot({path:__dirname+'/_v'+TAG+'_'+n+'.png'});durs.push(S[i].dur);}
 fs.writeFileSync(__dirname+'/_vdurs_'+TAG+'.json',JSON.stringify(durs));
 console.log('slides',els.length,'total',durs.reduce((a,b)=>a+b,0).toFixed(1)+'s');
 await b.close();
})();
