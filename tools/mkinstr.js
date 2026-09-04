// RAM IMPEX — გამოყენების ინსტრუქცია (ვიდეო, ვერტიკალური 1080x1920)
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const TAG='instr';
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const W=1080,H=1920;
const F="'Noto Sans Georgian','Segoe UI',system-ui,sans-serif";
const brand='RAM IMPEX', site='ramimpex.com.ge/info', phone='📞 595 533 500';
const foot=`<div class="foot"><span>${phone}</span><span>${site}</span></div>`;
const head=h=>`<div class="sh">${h}</div>`;
const S=[];
const push=(dur,cls,inner)=>S.push({dur,html:`<div class="slide ${cls}">${inner}</div>`});
// step slide helper
const step=(n,emoji,title,desc)=>`<div class="step"><div class="sn">${n}</div><div><div class="st">${emoji} ${title}</div><div class="sd">${desc}</div></div></div>`;

// 1 — intro
push(4.6,'s-out',`
 <div class="ibg"></div>
 <div class="otop"><img class="lg" src="${logo}"><b>${brand}</b></div>
 <div class="ih2">🔥 ანთრაციტის ბრიკეტი</div>
 <div class="ih3">გამოყენების ინსტრუქცია</div>
 <div class="ot">როგორ დავანთოთ და გავათბოთ სწორად — ნაბიჯ‑ნაბიჯ</div>
 <div class="bigflame">🔥</div>`);

// 2 — grate + aeration (ორ ნაბიჯში)
push(6.4,'',`${head('💨 ჰაერი და ცხაური')}
 <div class="steps">
  ${step(1,'🔲','ცხაური (колосник)','ფეჩს უნდა ჰქონდეს <b>ცხაური</b> — ბრიკეტი მასზე ელაგება და ჰაერი <b>ქვევიდან</b> შემოდის.')}
  ${step(2,'💨','აერაცია / წევა','ქვანახშირი <b>ჰაერით იწვის</b>. დატოვე ღია საჰაერე სარქველი / ნაცრის კარი — <b>დრაფტი (წევა) აუცილებელია</b>.')}
 </div>
 ${foot}`);

// 3 — tight packing
push(5.8,'',`${head('📦 მჭიდროდ დალაგება')}
 <div class="steps">
  ${step(3,'📦','დაფარე მთელი ცხაური','ბრიკეტი <b>მჭიდროდ</b> დააწყვე მთელ ცხაურზე. თხელი ან ნაწილობრივი ფენა კარგად <b>ვერ იწვის</b>.')}
 </div>
 <div class="note">➜ მჭიდრო, თანაბარი ფენა ინარჩუნებს მაღალ სიმხურვალეს და დიდხანს იწვის.</div>
 ${foot}`);

// 4 — ignition
push(6.6,'',`${head('🔥 ანთება')}
 <div class="steps">
  ${step(4,'🪵','ჯერ გააჩაღე','აანთე <b>შეშა/ნაფოტი ან ხის ნახშირი</b> — ბრიკეტი მკვრივია და პირდაპირ ძნელად ინთება.')}
  ${step(5,'🔥','გავარვარებამდე','დაელოდე, სანამ ცეცხლი <b>კარგად გაჩაღდება</b>, მერე დააყარე ბრიკეტი ფენებად.')}
 </div>
 ${foot}`);

// 5 — layers
push(6.2,'',`${head('⏱ ფენებად დამატება')}
 <div class="steps">
  ${step(6,'➕','ცოტ‑ცოტა','დაამატე მცირე პორციებით. დაელოდე <b>5–10 წუთი</b>, სანამ ფენა <b>გაწითლდება/გავარვარდება</b>.')}
  ${step(7,'🔁','მერე შემდეგი','გავარვარების შემდეგ დააყარე მომდევნო ფენა — ასე მიიღება მყარი, ცხელი საწვავი ფენა.')}
 </div>
 ${foot}`);

// 6 — heat control
push(5.8,'',`${head('🌡 სითბოს რეგულირება')}
 <div class="ctrl">
  <div class="cc hot"><div class="ce">🔥</div><div class="ct">სარქველი ღია</div><div class="cs">მეტი ჰაერი → ცხელა და <b>სწრაფად</b> იწვის</div></div>
  <div class="cc slow"><div class="ce">🌙</div><div class="ct">სარქველი მიხურული</div><div class="cs">ნაკლები ჰაერი → <b>ნელა, დიდხანს</b> (8–12 სთ)</div></div>
 </div>
 ${foot}`);

// 7 — tips / safety
push(6.6,'s-safe',`${head('✅ რჩევები')}
 <div class="safe">
  <div class="sf"><div class="se">🧹</div><div class="sd2"><b>ფერფლი ჩამოაცალე</b> ცხაურიდან — გაწმენდილი ცხაური კარგ წევას/ჰაერს უზრუნველყოფს.</div></div>
  <div class="sf"><div class="se">🔩</div><div class="sd2">გამოიყენე <b>ძლიერი რკინის ან თუჯის</b> ფეჩი — წვის მაღალი ტემპერატურის გამო.</div></div>
  <div class="sf"><div class="se">🌫️</div><div class="sd2">მხოლოდ <b>დახურულ ფეჩში</b>, საკვამურითა და კარგი <b>ვენტილაციით</b> (CO).</div></div>
 </div>
 ${foot}`);

// 8 — outro
push(5.0,'s-out',`
 <div class="ibg"></div>
 <div class="otop"><img class="lg" src="${logo}"><b>${brand}</b></div>
 <div class="oh">📍 საწყობი — ნატახტარი</div>
 <div class="ot">კითხვები? დაგვირეკე ან ეწვიე საიტს</div>
 <div class="obig">${phone}</div>
 <div class="ourl">🌐 ${site}</div>`);

const CSS=`
*{margin:0;padding:0;box-sizing:border-box;font-family:${F};-webkit-font-smoothing:antialiased}
.slide{width:${W}px;height:${H}px;position:relative;overflow:hidden;color:#fff;padding:0 64px;
 background:radial-gradient(1100px 700px at 82% 4%,rgba(201,112,26,.42),transparent 60%),radial-gradient(950px 720px at 8% 78%,rgba(180,70,10,.32),transparent 60%),linear-gradient(158deg,#241507,#160c04 55%,#0b0603)}
.sh{font-size:66px;font-weight:900;line-height:1.08;padding:110px 0 50px;background:linear-gradient(180deg,#ffcf7a,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
.foot{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;padding:30px 64px;background:linear-gradient(90deg,#0B6B3C,#0F8A4D);font-size:32px;font-weight:900;color:#fff}
.ibg{position:absolute;inset:0;background:radial-gradient(900px 620px at 50% 30%,rgba(242,184,7,.16),transparent 62%)}
.otop{display:flex;align-items:center;gap:20px;padding:110px 0 0;justify-content:center}
.lg{width:92px;height:92px}.otop b{font-size:50px;font-weight:900;letter-spacing:.5px}
.steps{display:flex;flex-direction:column;gap:34px}
.step{display:flex;gap:30px;align-items:flex-start;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.14);border-left:10px solid #F2B807;border-radius:24px;padding:44px 46px}
.sn{flex:none;width:96px;height:96px;border-radius:50%;background:linear-gradient(160deg,#F2B807,#d97a12);color:#2a1a05;font-size:56px;font-weight:900;display:flex;align-items:center;justify-content:center}
.st{font-size:50px;font-weight:900;color:#ffce7d;margin-bottom:14px;line-height:1.1}
.sd{font-size:40px;font-weight:600;color:#efe6da;line-height:1.38}
.sd b,.sd2 b,.cs b,.ot b{color:#ffd486;font-weight:900}
.note{margin-top:44px;font-size:40px;font-weight:800;color:#bff0d3;background:rgba(15,138,77,.18);border:2px solid rgba(15,138,77,.5);border-radius:20px;padding:34px 40px;line-height:1.38}
/* heat control */
.ctrl{display:flex;flex-direction:column;gap:34px;margin-top:20px}
.cc{border-radius:26px;padding:52px 46px;text-align:center}
.cc.hot{background:linear-gradient(160deg,#c9701a,#8f4b10);border:3px solid #ffb347}
.cc.slow{background:rgba(80,110,160,.18);border:2px solid #6a8fc0}
.ce{font-size:110px;line-height:1}
.ct{font-size:54px;font-weight:900;color:#fff;margin-top:14px}
.cs{font-size:38px;font-weight:700;color:#f0e6da;margin-top:16px;line-height:1.3}
/* safe */
.s-safe .safe{display:flex;flex-direction:column;gap:32px}
.sf{display:flex;gap:30px;align-items:flex-start;background:rgba(242,184,7,.1);border:2px solid rgba(242,184,7,.5);border-radius:24px;padding:40px 44px}
.se{font-size:82px;line-height:1;flex:none}
.sd2{font-size:40px;font-weight:600;color:#f4ecdf;line-height:1.4}
/* intro/outro */
.s-out{display:flex;flex-direction:column;align-items:center;text-align:center}
.ih2{margin-top:90px;font-size:92px;font-weight:900;background:linear-gradient(180deg,#ffd486,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent;line-height:1}
.ih3{margin-top:20px;font-size:60px;font-weight:900;color:#fff}
.oh{margin-top:80px;font-size:70px;font-weight:900;background:linear-gradient(180deg,#ffd486,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
.ot{margin-top:30px;font-size:44px;font-weight:700;color:#efe2d2;line-height:1.35;max-width:840px}
.bigflame{margin-top:70px;font-size:280px;line-height:1}
.obig{margin-top:70px;font-size:100px;font-weight:900;color:#fff}
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
 console.log('slides',els.length,'durs',durs.join(','));
 await b.close();
})();
