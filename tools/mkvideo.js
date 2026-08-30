// RAM IMPEX — info video slides (vertical 9:16, 1080x1920). One slide per info-page heading.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const LANG=process.argv[2]||'ka';
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const foto='data:image/jpeg;base64,'+fs.readFileSync(__dirname+'/b_full1.jpg').toString('base64');
const W=1080,H=1920;
const F="'Noto Sans Georgian','Noto Sans Armenian','Segoe UI',system-ui,sans-serif";

// ---- content per language (mirrors ramimpex/info T[LANG]) ----
const D={
 ka:{
  brand:'RAM IMPEX', site:'ramimpex.com.ge/info', phone:'📞 595 533 500', wh:'📍 საწყობი — ნატახტარი',
  title:'ანთრაციტის ბრიკეტი', sub:'მაღალკალორიული, უკვამლო საწვავი გათბობისა და მრეწველობისთვის',
  chips:[['7 951','კკალ/კგ · ~2× შეშა'],['8–12 სთ','ერთ ჩაყრაზე'],['99,4%','გამძლეობა'],['≤ 1,16%','გოგირდი'],['50×50×32','მმ ზომა'],['ცოტა','კვამლი/ნაცარი']],
  made_h:'🧱 რისგან მზადდება?',
  made:[['100% ანთრაციტის ქვანახშირი','ანთრაციტი — ყველაზე მაღალხარისხიანი ქვანახშირი ნახშირბადის უმაღლესი შემცველობით. მაქსიმალური სითბო და ხანგრძლივი, სუფთა წვა.'],['ქიმიური დანამატების გარეშე','მიიღება ანთრაციტის წვრილი ფრაქციის მაღალი წნევით შეკუმშვით. სუფთა, ერთგვაროვანი პროდუქტი.']],
  how_h:'⚙️ როგორ მზადდება',
  how:[['წვრილი ფრაქცია','მოპოვებისას რჩება წვრილი ნატეხი/მტვერი — ცალკე კარგად ვერ იწვის.'],['მაღალი წნევა','ეს ფრაქცია დიდი წნევით იწნეხება ერთგვაროვან ბრიკეტებად.'],['მზა ბრიკეტი','მყარი, მშრალი, სტაბილური ბრიკეტი — დიდხანს და თანაბრად იწვის.']],
  how_note:'➜ ამიტომ ბრიკეტი გაცილებით ეფექტურია, ვიდრე ნახშირის მტვერი ან ცალკეული ნატეხები.',
  why_h:'🔥 რატომ ჯობია შეშას?',
  why:['🌡 <b>2× მეტი სითბო</b> — მაღალი კალორიულობა (7 951 კკალ/კგ).','⏱ <b>8–12 საათი</b> ერთ ჩაყრაზე (შეშა მხოლოდ 1–2 სთ).','💨 <b>ცოტა კვამლი და ნაცარი</b> — უფრო სუფთა წვა.','💰 <b>ეკონომიური</b> — ნაკლები ხარჯი გათბობაზე.','📦 <b>კომპაქტური და მშრალი</b> — მარტივი შენახვა.','🎯 <b>სტაბილური ხარისხი</b> — ერთგვაროვანი ყოველ პარტიაში.'],
  cmp_h:'🪵 ბრიკეტი vs შეშა',cmp_brik:'1 კგ ბრიკეტი',cmp_brik_s:'~10 სთ წვა · 7 951 კკალ/კგ',cmp_wood:'~10 კგ შეშა',cmp_wood_s:'6–8× დამატება · ~2 100 კკალ/კგ',cmp_big:'1 კგ ბრიკეტი = ~10 კგ შეშა',cmp_note:'1 კუბი შეშა ≈ 500 კგ → იმავე სითბოს ~50 კგ ბრიკეტი იძლევა.',
  econ_h:'💚 ზამთრის ეკონომია — 4 თვე',econ:[['🪵 შეშა (8 კუბი)','8 × 200 = 1600 ₾'],['🔥 ბრიკეტი (400 კგ)','400 × 2 = 800 ₾'],['✅ ეკონომია','≈ 800 ₾']],econ_note:'~2 კუბი/თვე × 4 თვე = 8 კუბი. ბრიკეტით ~2× ნაკლები ხარჯი.',
  use_h:'📍 სად გამოიყენება',uses:[['🔥','დახურული ფეჩი და ღუმელი'],['🏠','საოჯახო გათბობა'],['🌱','სათბურების გათბობა'],['🏭','სამრეწველო ქვაბები'],['♨️','წყლის გამათბობელი'],['🏢','კომერციული ობიექტები']],
  spec_h:'📊 ტექნიკური მაჩვენებლები',spec:[['ზომა','50×50×32 მმ'],['თბოგამოცემა (NCV)','7 951 კკალ/კგ'],['გოგირდი','≤ 1,16%'],['ნაცარი','≤ 11,1%'],['ტენიანობა','≤ 6,5%'],['აქროლადი ნივთ.','≤ 8,5%']],
  cert_h:'✓ სერტიფიცირებული ხარისხი',cert_t:'პროდუქტი შემოწმებულია ლაბორატორიულად — თბოგამოცემა, გოგირდი, ნაცარი და ტენიანობა შეესაბამება დეკლარირებულ მაჩვენებლებს.',
  price_h:'💰 ფასები',price_unit:'₾/კგ',tiers:[['≤ 1000 კგ','2.00','10 კგ ტომარა',false],['1000 – 21000 კგ','1.80','10 კგ ტომარა',true],['21000 კგ +','1.30','ბიგ-ბეგი',false]],price_pop:'პოპულარული',price_notes:['✅ ფასი დღგ-ის ჩათვლით','🏭 საწყობი — ნატახტარი','📦 10 კგ ტომარა ან ბიგ-ბეგი'],
  rules_h:'📘 მოხმარების წესები',rules:['🔥 <b>დანთება:</b> ბრიკეტი მკვრივია და პირდაპირ ძნელად ინთება — ჯერ დაანთეთ ნახშირით ან შეშის ნახშირით (ან სპეც. სანთებით), რომ გახურდეს და აინთოს.','🌬️ <b>აერაცია:</b> უზრუნველყავით ჰაერის (ჟანგბადის) მიწოდება — ასე ბრიკეტი სტაბილურად ღვივდება და ინარჩუნებს მაღალ სიმხურვალეს.'],
  safe_h:'⚠️ უსაფრთხოება',safe:[['🔥','<b>მხოლოდ გათბობისთვის.</b> დახურული ფეჩების, ღუმელებისა და სათბურებისთვის. არ არის რეკომენდებული ღია ცეცხლზე საკვების მოსამზადებლად.'],['🌫️','წვისას გამოყოფს <b>CO₂-სა და CO-ს.</b> გამოიყენეთ მხოლოდ დახურულ ფეჩებში — საკვამურითა და კარგი ვენტილაციით.'],['🔩','მაღალი წვის ტემპერატურის გამო სასურველია <b>ძლიერი რკინის ან თუჯის</b> ფეჩი/ღუმელი.']],
  wh_h:'📍 საწყობი — ნატახტარი',wh_t:'ეწვიე ჩვენს საწყობს ან დაგვირეკე — მიწოდება შესაძლებელია.',out_call:'დაგვირეკე ან ეწვიე საიტს',
 }
};
const t=D[LANG];

const chip=(v,l)=>`<div class="chip"><b>${v}</b><span>${l}</span></div>`;
const S=[]; // {dur, html}
const push=(dur,cls,inner)=>S.push({dur,html:`<div class="slide ${cls}">${inner}</div>`});

// footer bar reused
const foot=`<div class="foot"><span>${t.phone}</span><span>${t.site}</span></div>`;
const head=(h)=>`<div class="sh">${h}</div>`;

// 1 — intro / hero
push(4.6,'s-intro',`
 <div class="ibg"></div>
 <div class="itop"><img class="lg" src="${logo}"><b>${t.brand}</b></div>
 <div class="iphoto"><img src="${foto}"></div>
 <h1 class="ih">${t.title}</h1>
 <div class="isub">${t.sub}</div>
 <div class="chips">${t.chips.map(c=>chip(c[0],c[1])).join('')}</div>
 ${foot}`);

// 2 — made
push(6.2,'',`${head(t.made_h)}
 <div class="cards">${t.made.map(m=>`<div class="card"><div class="ct">${m[0]}</div><div class="cd">${m[1]}</div></div>`).join('')}</div>
 ${foot}`);

// 3 — how
push(6.2,'',`${head(t.how_h)}
 <div class="steps">${t.how.map((s,i)=>`<div class="step"><div class="sn">${i+1}</div><div><div class="st">${s[0]}</div><div class="sd">${s[1]}</div></div></div>`).join('')}</div>
 <div class="note">${t.how_note}</div>
 ${foot}`);

// 4 — why
push(6.6,'',`${head(t.why_h)}
 <div class="why">${t.why.map(w=>`<div class="wi">${w}</div>`).join('')}</div>
 ${foot}`);

// 5 — cmp
push(5.6,'',`${head(t.cmp_h)}
 <div class="cmp">
  <div class="cx cbrik"><div class="cxb">${t.cmp_brik}</div><div class="cxs">${t.cmp_brik_s}</div></div>
  <div class="ceq">=</div>
  <div class="cx cwood"><div class="cxb">${t.cmp_wood}</div><div class="cxs">${t.cmp_wood_s}</div></div>
 </div>
 <div class="cbig">${t.cmp_big}</div>
 <div class="note">${t.cmp_note}</div>
 ${foot}`);

// 6 — econ
push(5.6,'',`${head(t.econ_h)}
 <div class="econ">${t.econ.map((e,i)=>`<div class="er ${i===2?'save':''}"><span>${e[0]}</span><b>${e[1]}</b></div>`).join('')}</div>
 <div class="note">${t.econ_note}</div>
 ${foot}`);

// 7 — uses
push(5.2,'',`${head(t.use_h)}
 <div class="uses">${t.uses.map(u=>`<div class="use"><div class="ue">${u[0]}</div><div class="ul">${u[1]}</div></div>`).join('')}</div>
 ${foot}`);

// 8 — spec
push(6.0,'',`${head(t.spec_h)}
 <div class="spec">${t.spec.map(s=>`<div class="sr"><span>${s[0]}</span><b>${s[1]}</b></div>`).join('')}</div>
 ${foot}`);

// 9 — cert
push(3.8,'s-cert',`${head(t.cert_h)}
 <div class="certbox"><div class="certmark">✓</div><div class="certt">${t.cert_t}</div></div>
 ${foot}`);

// 10 — price
push(5.8,'',`${head(t.price_h)}
 <div class="tiers">${t.tiers.map(tr=>`<div class="tier ${tr[3]?'pop':''}">${tr[3]?`<div class="pop-b">${t.price_pop}</div>`:''}<div class="tq">${tr[0]}</div><div class="tp"><b>${tr[1]}</b><span>${t.price_unit}</span></div><div class="tpk">${tr[2]}</div></div>`).join('')}</div>
 <div class="pnotes">${t.price_notes.map(n=>`<span>${n}</span>`).join('')}</div>
 ${foot}`);

// 11 — rules
push(6.2,'s-rules',`${head(t.rules_h)}
 <div class="rules">${t.rules.map((r,i)=>`<div class="rule"><div class="rn">${i+1}</div><div class="rd">${r}</div></div>`).join('')}</div>
 ${foot}`);

// 12 — safe
push(7.0,'s-safe',`${head(t.safe_h)}
 <div class="safe">${t.safe.map(s=>`<div class="sf"><div class="se">${s[0]}</div><div class="sd2">${s[1]}</div></div>`).join('')}</div>
 ${foot}`);

// 13 — outro / contact
push(5.2,'s-out',`
 <div class="ibg"></div>
 <div class="otop"><img class="lg" src="${logo}"><b>${t.brand}</b></div>
 <div class="oh">${t.wh_h}</div>
 <div class="ot">${t.wh_t}</div>
 <div class="obig">${t.phone}</div>
 <div class="ourl">🌐 ${t.site}</div>
 <div class="ocall">${t.out_call}</div>`);

const CSS=`
*{margin:0;padding:0;box-sizing:border-box;font-family:${F};-webkit-font-smoothing:antialiased}
.slide{width:${W}px;height:${H}px;position:relative;overflow:hidden;color:#fff;padding:0 64px;
 background:radial-gradient(1100px 700px at 82% 4%,rgba(201,112,26,.42),transparent 60%),radial-gradient(950px 720px at 8% 78%,rgba(180,70,10,.32),transparent 60%),linear-gradient(158deg,#241507,#160c04 55%,#0b0603)}
.sh{font-size:62px;font-weight:900;line-height:1.08;padding:96px 0 44px;background:linear-gradient(180deg,#ffcf7a,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
.foot{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;padding:30px 64px;background:linear-gradient(90deg,#0B6B3C,#0F8A4D);font-size:32px;font-weight:900;color:#fff}
/* intro */
.ibg{position:absolute;inset:0;background:radial-gradient(900px 620px at 50% 30%,rgba(242,184,7,.16),transparent 62%)}
.itop,.otop{display:flex;align-items:center;gap:20px;padding:72px 0 0;position:relative}
.lg{width:92px;height:92px}.itop b,.otop b{font-size:50px;font-weight:900;letter-spacing:.5px}
.iphoto{margin:44px 0 0;height:560px;border-radius:28px;overflow:hidden;border:4px solid rgba(201,112,26,.6);position:relative}
.iphoto img{width:100%;height:100%;object-fit:cover}
.ih{margin:38px 0 0;font-size:96px;line-height:.98;font-weight:900;background:linear-gradient(180deg,#ffd486,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
.isub{margin:20px 0 0;font-size:38px;font-weight:700;color:#f0e0cf;line-height:1.25}
.chips{margin:40px 0 0;display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px}
.chip{background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.16);border-radius:18px;padding:20px 14px;text-align:center}
.chip b{display:block;font-size:40px;font-weight:900;color:#ffb347}.chip span{font-size:22px;font-weight:700;color:#d9cbbc;line-height:1.15}
/* cards (made) */
.cards{display:flex;flex-direction:column;gap:36px}
.card{background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.14);border-left:10px solid #F2B807;border-radius:22px;padding:40px 44px}
.ct{font-size:50px;font-weight:900;color:#ffce7d;margin-bottom:20px;line-height:1.1}
.cd{font-size:38px;font-weight:600;color:#efe6da;line-height:1.4}
.cd b,.sd b,.wi b,.sd2 b,.rd b{color:#ffd486;font-weight:900}
/* steps (how) */
.steps{display:flex;flex-direction:column;gap:30px}
.step{display:flex;gap:30px;align-items:flex-start;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.13);border-radius:22px;padding:36px 40px}
.sn{flex:none;width:88px;height:88px;border-radius:50%;background:linear-gradient(160deg,#F2B807,#d97a12);color:#2a1a05;font-size:52px;font-weight:900;display:flex;align-items:center;justify-content:center}
.st{font-size:46px;font-weight:900;color:#ffce7d;margin-bottom:10px}
.sd{font-size:36px;font-weight:600;color:#efe6da;line-height:1.35}
.note{margin-top:40px;font-size:38px;font-weight:800;color:#bff0d3;background:rgba(15,138,77,.18);border:2px solid rgba(15,138,77,.5);border-radius:18px;padding:30px 36px;line-height:1.35}
/* why */
.why{display:flex;flex-direction:column;gap:26px}
.wi{background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.15);border-radius:20px;padding:34px 40px;font-size:42px;font-weight:700;color:#f3ece2;line-height:1.3}
/* cmp */
.cmp{display:flex;align-items:stretch;gap:26px;margin-top:10px}
.cx{flex:1;border-radius:24px;padding:48px 32px;text-align:center}
.cbrik{background:linear-gradient(160deg,#c9701a,#8f4b10);border:3px solid #ffb347}
.cwood{background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.2)}
.cxb{font-size:52px;font-weight:900;color:#fff}.cxs{font-size:30px;font-weight:700;color:#f0e2d2;margin-top:14px;line-height:1.25}
.ceq{align-self:center;font-size:80px;font-weight:900;color:#ffb347}
.cbig{margin-top:46px;text-align:center;font-size:64px;font-weight:900;background:linear-gradient(180deg,#ffd486,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent;line-height:1.05}
/* econ */
.econ{display:flex;flex-direction:column;gap:28px}
.er{display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.15);border-radius:20px;padding:40px 44px}
.er span{font-size:44px;font-weight:800;color:#f0e6da}.er b{font-size:52px;font-weight:900;color:#fff}
.er.save{background:linear-gradient(90deg,rgba(11,107,60,.35),rgba(15,138,77,.35));border-color:#2ec77e}
.er.save span{color:#bff0d3}.er.save b{color:#6dffab}
/* uses */
.uses{display:grid;grid-template-columns:1fr 1fr;gap:26px}
.use{background:rgba(255,255,255,.07);border:1.5px solid rgba(255,255,255,.15);border-radius:22px;padding:44px 30px;text-align:center}
.ue{font-size:88px;line-height:1}.ul{margin-top:22px;font-size:38px;font-weight:800;color:#f2e8dc;line-height:1.2}
/* spec */
.spec{display:flex;flex-direction:column;gap:20px}
.sr{display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.14);border-radius:18px;padding:36px 44px}
.sr span{font-size:44px;font-weight:700;color:#e8dccd}.sr b{font-size:48px;font-weight:900;color:#ffce7d}
/* cert */
.s-cert .certbox{margin-top:40px;display:flex;flex-direction:column;align-items:center;gap:48px;text-align:center;padding:0 20px}
.certmark{width:280px;height:280px;border-radius:50%;background:linear-gradient(160deg,#0B6B3C,#0F8A4D);border:8px solid #2ec77e;display:flex;align-items:center;justify-content:center;font-size:180px;font-weight:900;color:#fff}
.certt{font-size:44px;font-weight:700;color:#eee4d6;line-height:1.4}
/* price */
.tiers{display:flex;flex-direction:column;gap:26px}
.tier{position:relative;background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.16);border-radius:22px;padding:40px 44px;display:flex;align-items:center;justify-content:space-between}
.tier.pop{border-color:#F2B807;background:linear-gradient(90deg,rgba(242,184,7,.14),rgba(255,255,255,.06))}
.pop-b{position:absolute;top:-22px;left:44px;background:#F2B807;color:#2a1a05;font-size:26px;font-weight:900;padding:8px 20px;border-radius:999px}
.tq{font-size:44px;font-weight:800;color:#f0e6da}
.tp{display:flex;align-items:baseline;gap:10px}.tp b{font-size:72px;font-weight:900;color:#ffce7d}.tp span{font-size:30px;font-weight:800;color:#d9cbbc}
.tpk{font-size:30px;font-weight:700;color:#c9bcae}
.pnotes{margin-top:36px;display:flex;flex-direction:column;gap:16px}
.pnotes span{font-size:36px;font-weight:700;color:#e6ded2}
/* rules */
.s-rules .rules{display:flex;flex-direction:column;gap:34px}
.rule{display:flex;gap:30px;align-items:flex-start;background:rgba(30,111,168,.16);border:2px solid #5aa0d6;border-radius:22px;padding:40px 44px}
.rn{flex:none;width:84px;height:84px;border-radius:50%;background:#1e6fa8;color:#fff;font-size:50px;font-weight:900;display:flex;align-items:center;justify-content:center}
.rd{font-size:40px;font-weight:600;color:#eaf3fb;line-height:1.38}
/* safe */
.s-safe .safe{display:flex;flex-direction:column;gap:30px}
.sf{display:flex;gap:30px;align-items:flex-start;background:rgba(242,184,7,.1);border:2px solid rgba(242,184,7,.5);border-radius:22px;padding:36px 40px}
.se{font-size:76px;line-height:1;flex:none}
.sd2{font-size:36px;font-weight:600;color:#f4ecdf;line-height:1.36}
/* outro */
.s-out{display:flex;flex-direction:column;align-items:center;text-align:center}
.otop{justify-content:center;padding-top:150px}
.oh{margin-top:80px;font-size:74px;font-weight:900;background:linear-gradient(180deg,#ffd486,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
.ot{margin-top:30px;font-size:42px;font-weight:700;color:#efe2d2;line-height:1.35;max-width:820px}
.obig{margin-top:80px;font-size:104px;font-weight:900;color:#fff}
.ourl{margin-top:30px;font-size:52px;font-weight:900;color:#6dffab}
.ocall{margin-top:70px;font-size:44px;font-weight:800;color:#F2B807;background:rgba(242,184,7,.12);border:2px solid #F2B807;border-radius:999px;padding:26px 56px}
`;

const doc=`<!doctype html><meta charset="utf-8"><style>${CSS}</style><body style="margin:0;background:#000">${S.map(s=>s.html).join('\n')}</body>`;

(async()=>{
 fs.writeFileSync(__dirname+'/_video_'+LANG+'.html',doc);
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:1});
 await p.goto('file://'+__dirname+'/_video_'+LANG+'.html');
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 await p.waitForTimeout(400);
 const els=await p.$$('.slide');
 const durs=[];
 for(let i=0;i<els.length;i++){
  const n=String(i+1).padStart(2,'0');
  await els[i].screenshot({path:__dirname+'/_v'+LANG+'_'+n+'.png'});
  durs.push(S[i].dur);
 }
 fs.writeFileSync(__dirname+'/_vdurs_'+LANG+'.json',JSON.stringify(durs));
 console.log('slides',els.length,'durs',durs.join(','));
 await b.close();
})();
