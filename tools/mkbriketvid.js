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
push(4.6,'s-out',`
 <div class="ibg"></div>
 <div class="otop"><img class="lg" src="${logo}"><b>${brand}</b></div>
 <div class="ih2">🔥 ანთრაციტის ბრიკეტი</div>
 <div class="ot">სითბო, რომელსაც ენდობი</div>
 <div class="bigflame">🔥</div>`);

// what is it
scene(5.4,'🧱 რა არის ანთრაციტი','ანთრაციტის ბრიკეტი — ყველაზე <b>მაღალხარისხიანი მყარი საწვავი</b>. მზადდება სუფთა ანთრაციტის ქვანახშირისგან, ნახშირბადის უმაღლესი შემცველობით, <b>ქიმიური დანამატების გარეშე</b>.');
scene(5.2,'','წვრილი ფრაქცია <b>მაღალი წნევით</b> იწნეხება მკვრივ, ერთგვაროვან ბრიკეტად. შედეგი — <b>მაქსიმალური სითბო</b> და ხანგრძლივი, სუფთა წვა.');

// why better
scene(5.4,'🔥 რატომ ჯობია','<b>1 კგ ბრიკეტი ≈ 10 კგ შეშა</b>. იწვის <b>8–12 საათი</b> ერთ ჩაყრაზე — ცოტა კვამლი და ნაცარი, ეკონომიური.');
scene(5.6,'','ანთრაციტის შეშასთან შედარება <b>უადგილოა</b> — შეშის ერთადერთი უპირატესობა ღია ცეცხლზე საკვების მომზადებაა.');

// how to use / what to consider
scene(5.4,'⚙️ რა უნდა გაითვალისწინოთ','<span class="num">1</span> სჭირდება <b>ჰაერის მიწოდება ქვემოდან</b> — ცხაურიანი ფეჩი.');
scene(5.8,'','<span class="num">2</span> საჭიროა <b>კარგი გამწოვობა</b>, რომ ცეცხლი არ ჩაქრეს — ღუმლის მილი <b>5–6 მეტრზე</b> ნაკლები არ უნდა იყოს.');
scene(5.4,'','<span class="num">3</span> წვის ტემპერატურა <b>ჰაერის მიწოდებაზეა</b> დამოკიდებული — რაც მეტი ჰაერი, მით მაღალი სიმხურვალე.');

// stove / boiler
scene(6.0,'🏭 ღუმელი / ქვაბი','ეფექტურობა დამოკიდებულია ღუმელსა და ქვაბზე. თუ ქვაბი ან ბოილერი <b>ქვანახშირზეა გათვლილი</b> — ანთრაციტიც მიდის.');
scene(5.6,'','ეს ზუსტდება <b>ღუმლის/ბოილერის მწარმოებელთან</b>, ხოლო კუსტარულ ღუმელზე — მის <b>ხელოსანთან</b>.');
scene(6.2,'🛡 თუჯის ცხაური','თუჯის ცხაური ღუმლის დაცვას მარტივად წყვეტს: ანთრაციტი საყოფაცხოვრებო ღუმელში იშვიათად ადის <b>1000°C-მდე</b>, თუჯი კი <b>1200°C-ზე</b> დნება.');

// outro
push(5.2,'s-out',`
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
