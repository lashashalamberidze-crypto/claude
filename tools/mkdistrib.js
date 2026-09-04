// RAM IMPEX — distributor recruitment banner, multi-language (1080x1150)
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const foto='data:image/jpeg;base64,'+fs.readFileSync(__dirname+'/b_full1.jpg').toString('base64');
const W=1080,H=1150;
const F="'Noto Sans Georgian','Noto Sans Armenian','Segoe UI',system-ui,sans-serif";
const T={
 ka:{kick:'🤝 თანამშრომლობა',h1:'ვეძებთ წარმომადგენლებს',sub:'ანთრაციტის ბრიკეტის დისტრიბუცია',subs:'რეგიონებსა და მუნიციპალიტეტებში 📍',
  aH:'👥 ვის ვეძებთ',a:['🏪 საცალო და საბითუმო გაყიდვების გამოცდილება','📍 საკუთარ რეგიონში/მუნიციპალიტეტში საქმიანობა','📈 კლიენტების ბაზა — უპირატესობა'],
  bH:'🎁 რას გთავაზობთ',b:['🔥 მოთხოვნადი სეზონური პროდუქტი','💰 მიმზიდველი პირობები','🚚 სტაბილური მიწოდება'],
  strip:'🔥 <b>ანთრაციტის ბრიკეტი</b> — ~2× მეტი სითბო ვიდრე შეშა, უკვამლო. ზამთრის ჰიტ-პროდუქტი.',cta:'📞 დაგვიკავშირდი',url:'ramimpex.com.ge/info'},
 az:{kick:'🤝 Əməkdaşlıq',h1:'Nümayəndələr axtarırıq',sub:'Antrasit briketin distribusiyası',subs:'Bölgələrdə və bələdiyyələrdə 📍',
  aH:'👥 Kimi axtarırıq',a:['🏪 Pərakəndə və topdan satış təcrübəsi','📍 Öz bölgəsində/bələdiyyəsində fəaliyyət','📈 Müştəri bazası — üstünlük'],
  bH:'🎁 Nə təklif edirik',b:['🔥 Tələbat olan mövsümi məhsul','💰 Cəlbedici şərtlər','🚚 Sabit tədarük'],
  strip:'🔥 <b>Antrasit briket</b> — odundan 2× çox istilik, tüstüsüz. Qışın hit məhsulu.',cta:'📞 Bizimlə əlaqə',url:'ramimpex.com.ge/info?lang=az'},
 hy:{kick:'🤝 Համագործակցություն',h1:'Փնտրում ենք ներկայացուցիչներ',sub:'Անտրացիտային բրիկետի բաշխում',subs:'Մարզերում և համայնքներում 📍',
  aH:'👥 Ում ենք փնտրում',a:['🏪 Մանրածախ և մեծածախ վաճառքի փորձ','📍 Գործունեություն սեփական մարզում/համայնքում','📈 Հաճախորդների բազա — առավելություն'],
  bH:'🎁 Ինչ ենք առաջարկում',b:['🔥 Պահանջված սեզոնային ապրանք','💰 Գրավիչ պայմաններ','🚚 Կայուն մատակարարում'],
  strip:'🔥 <b>Անտրացիտային բրիկետ</b> — փայտից 2× ավելի ջերմություն, առանց ծխի. Ձմռան հիթ-ապրանք.',cta:'📞 Կապվեք մեզ հետ',url:'ramimpex.com.ge/info?lang=hy'},
 ru:{kick:'🤝 Сотрудничество',h1:'Ищем представителей',sub:'Дистрибуция антрацитового брикета',subs:'В регионах и муниципалитетах 📍',
  aH:'👥 Кого ищем',a:['🏪 Опыт розничных и оптовых продаж','📍 Работа в своём регионе/муниципалитете','📈 База клиентов — преимущество'],
  bH:'🎁 Что предлагаем',b:['🔥 Востребованный сезонный продукт','💰 Привлекательные условия','🚚 Стабильные поставки'],
  strip:'🔥 <b>Антрацитовый брикет</b> — в 2× больше тепла, чем дрова, без дыма. Хит зимы.',cta:'📞 Свяжитесь с нами',url:'ramimpex.com.ge/info?lang=ru'}
};
function page(t){return `<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box;font-family:${F}}
.p{width:${W}px;height:${H}px;position:relative;overflow:hidden;color:#fff;
 background:radial-gradient(1000px 560px at 82% 2%,rgba(201,112,26,.5),transparent 60%),radial-gradient(820px 560px at 6% 82%,rgba(180,70,10,.32),transparent 60%),linear-gradient(158deg,#241507,#160c04 55%,#0b0603)}
.hd{display:flex;align-items:center;gap:16px;padding:38px 52px 0}
.hd img{width:62px;height:62px}.hd b{font-size:38px;font-weight:900;letter-spacing:.5px}
.kick{margin:20px 52px 0;display:inline-block;background:#F2B807;color:#3a2600;font-weight:900;font-size:27px;padding:11px 26px;border-radius:999px}
.h1{padding:14px 52px 0;font-size:62px;line-height:1.02;font-weight:900;background:linear-gradient(180deg,#ffcf7a,#ff8c1a);-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{margin:12px 52px 0;font-size:31px;font-weight:800;color:#ffdca6}
.sub small{display:block;font-size:23px;font-weight:700;color:#e7d6c2;margin-top:4px}
.cols{display:flex;gap:18px;margin:24px 52px 0}
.col{flex:1;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.15);border-radius:20px;padding:22px 20px}
.col h3{font-size:26px;font-weight:900;margin-bottom:12px}
.col.a h3{color:#ffce7d}.col.b h3{color:#8ff0bd}
.li{font-size:23px;font-weight:700;color:#f2ece2;line-height:1.28;margin-top:13px}
.li b{color:#ffd486;font-weight:900}
.strip{margin:24px 52px 0;display:flex;align-items:center;gap:18px;background:linear-gradient(90deg,rgba(242,184,7,.14),rgba(255,255,255,.04));border:1.5px solid rgba(242,184,7,.4);border-radius:18px;padding:18px 22px}
.strip .ph{width:118px;height:118px;border-radius:14px;overflow:hidden;border:2px solid rgba(201,112,26,.6);flex:0 0 auto}
.strip .ph img{width:100%;height:100%;object-fit:cover}
.strip .t{font-size:25px;font-weight:800;color:#fff;line-height:1.3}
.strip .t b{color:#ffce7d}
.cta{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(90deg,#0B6B3C,#0F8A4D);padding:24px 52px}
.cta .r{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
.cta .big{font-size:32px;font-weight:900;color:#fff}
.cta .ph{font-size:42px;font-weight:900;color:#fff}
.cta .u{font-size:25px;font-weight:900;color:#eafff2;margin-top:2px}
</style>
<div class="p">
 <div class="hd"><img src="${logo}"><b>RAM IMPEX</b></div>
 <div><span class="kick">${t.kick}</span></div>
 <div class="h1">${t.h1}</div>
 <div class="sub">${t.sub}<small>${t.subs}</small></div>
 <div class="cols">
   <div class="col a"><h3>${t.aH}</h3>${t.a.map(x=>`<div class="li">${x}</div>`).join('')}</div>
   <div class="col b"><h3>${t.bH}</h3>${t.b.map(x=>`<div class="li">${x}</div>`).join('')}</div>
 </div>
 <div class="strip"><div class="ph"><img src="${foto}"></div><div class="t">${t.strip}</div></div>
 <div class="cta"><div class="r"><div><div class="big">${t.cta}</div><div class="u">🌐 ${t.url}</div></div><div class="ph">📞 595 533 500</div></div></div>
</div>`;}
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:2});
 for(const [lang,t] of Object.entries(T)){
  await p.setContent(page(t));
  await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
  await p.waitForTimeout(250);
  await p.screenshot({path:__dirname+'/RAM_IMPEX_distrib_'+lang+'.jpg',quality:93,type:'jpeg'});
  console.log('distrib',lang);
 }
 await b.close();
})();
