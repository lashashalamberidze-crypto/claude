// RAM IMPEX — distributor agreement (sample) → A4 PDF
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const logo=fs.readFileSync(__dirname+'/logo_b64.txt','utf8').trim();
const html=`<!doctype html><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}
body{font-family:'Noto Sans Georgian','Sylfaen',serif;color:#14261c;font-size:12.5px;line-height:1.5}
.pg{padding:14mm 16mm}
.hd{display:flex;align-items:center;gap:14px;border-bottom:3px solid #0F8A4D;padding-bottom:10px;margin-bottom:14px}
.hd img{width:52px;height:52px}
.hd .b{font-size:22px;font-weight:900;color:#0B6B3C}
.hd .s{font-size:11px;color:#5c6b62}
h1{text-align:center;font-size:19px;color:#0B6B3C;margin:6px 0 2px}
.sub{text-align:center;font-size:11px;color:#8a6a00;background:#FFF4D6;border:1px solid #f0d98a;border-radius:6px;padding:5px 8px;margin:8px 0 14px}
.meta{display:flex;justify-content:space-between;font-size:11.5px;color:#333;margin-bottom:12px}
.party{background:#f3faf5;border:1px solid #cfe6d8;border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:12px}
.party b{color:#0B6B3C}
h2{font-size:13.5px;color:#0B6B3C;margin:14px 0 5px;border-left:4px solid #F2B807;padding-left:8px}
p{margin:4px 0}
.hl{background:#FFF4D6;border:1px solid #f0d98a;border-radius:6px;padding:8px 10px;font-weight:700}
.fill{border-bottom:1px dotted #888;display:inline-block;min-width:120px}
.sign{display:flex;justify-content:space-between;margin-top:26px;gap:30px}
.sign .c{flex:1;font-size:11.5px}
.sign .l{border-top:1px solid #333;margin-top:34px;padding-top:4px;color:#555}
.foot{margin-top:16px;border-top:1px solid #ddd;padding-top:8px;font-size:10.5px;color:#5c6b62;text-align:center}
</style>
<div class="pg">
 <div class="hd"><img src="${logo}"><div><div class="b">RAM IMPEX</div><div class="s">შპს „რამ იმპექს" · ს/კ 405565794 · ნატახტარი · 595 533 500 · ramimpex.com.ge</div></div></div>
 <h1>სადისტრიბუციო ხელშეკრულება</h1>
 <div class="sub">⚠️ ნიმუში — საბოლოო პირობები დაზუსტდება მხარეთა შეთანხმებით და ხელმოწერით.</div>
 <div class="meta"><div>ქ. <span class="fill"></span></div><div>თარიღი: <span class="fill"></span> 20<span class="fill" style="min-width:24px"></span> წ.</div><div>№ <span class="fill" style="min-width:60px"></span></div></div>

 <div class="party"><b>მიმწოდებელი:</b> შპს „რამ იმპექს", ს/კ 405565794, მის.: ნატახტარი, ტელ.: 595 533 500 (შემდგომში — „მიმწოდებელი").</div>
 <div class="party"><b>დისტრიბუტორი:</b> <span class="fill" style="min-width:220px"></span>, ს/კ <span class="fill"></span>, მის.: <span class="fill" style="min-width:200px"></span>, ტელ.: <span class="fill"></span> (შემდგომში — „დისტრიბუტორი").</div>

 <h2>1. ხელშეკრულების საგანი</h2>
 <p>1.1. მიმწოდებელი აწვდის, ხოლო დისტრიბუტორი ავრცელებს/ყიდის მიმწოდებლის პროდუქციას — <b>ანთრაციტის ბრიკეტს</b> — შეთანხმებულ ტერიტორიაზე.</p>
 <p>1.2. ტერიტორია: რეგიონი <span class="fill"></span>, მუნიციპალიტეტ(ებ)ი <span class="fill" style="min-width:160px"></span>.</p>

 <h2>2. მინიმალური მოცულობა</h2>
 <p class="hl">2.1. დისტრიბუტორი იღებს ვალდებულებას უზრუნველყოს <b>მინიმუმ 5000 კგ (5 ტონა) პროდუქციის დისტრიბუცია</b> შეთანხმებულ პერიოდში (თვეში / კვარტალში — შესაბამისი აღინიშნება: <span class="fill"></span>).</p>
 <p>2.2. მინიმალური მოცულობის შეუსრულებლობის შემთხვევაში მხარეები უფლებამოსილნი არიან გადახედონ პირობებს ან შეწყვიტონ ხელშეკრულება.</p>

 <h2>3. ფასი და გადახდა</h2>
 <p>3.1. პროდუქციის ფასი განისაზღვრება მიმწოდებლის მოქმედი პრაის-ლისტით/შეთანხმებით; მოცულობაზე მოქმედებს შესაბამისი საბითუმო ფასი.</p>
 <p>3.2. გადახდის პირობა: <span class="fill" style="min-width:200px"></span> (მაგ. წინასწარ / 50%-50% / კონსიგნაცია — შეთანხმებით).</p>

 <h2>4. მიწოდება</h2>
 <p>4.1. მიწოდება ხდება მიმწოდებლის საწყობიდან (ნატახტარი) ან მხარეთა შეთანხმებით — ტრანსპორტირების პირობები აღინიშნება ცალკე.</p>

 <h2>5. მხარეთა ვალდებულებები</h2>
 <p>5.1. მიმწოდებელი უზრუნველყოფს პროდუქციის სტაბილურ მიწოდებას, ხარისხსა და საჭირო დოკუმენტაციას (ზედნადები, სერტიფიკატი).</p>
 <p>5.2. დისტრიბუტორი უზრუნველყოფს პროდუქციის რეალიზაციას, სწორ შენახვას და ბრენდის რეპუტაციის დაცვას.</p>

 <h2>6. ხარისხი</h2>
 <p>6.1. პროდუქცია შეესაბამება დეკლარირებულ ტექნიკურ მაჩვენებლებს; ხარვეზის შემთხვევაში მოქმედებს ჩანაცვლების/დაბრუნების წესი შეთანხმებით.</p>

 <h2>7. ვადა და შეწყვეტა</h2>
 <p>7.1. ხელშეკრულება ძალაშია ხელმოწერიდან <span class="fill"></span>-მდე და გრძელდება ავტომატურად, თუ მხარე არ განაცხადებს შეწყვეტას <span class="fill" style="min-width:40px"></span> დღით ადრე.</p>

 <h2>8. დასკვნითი დებულებები</h2>
 <p>8.1. ყველა დანარჩენი პირობა რეგულირდება საქართველოს კანონმდებლობით. დავა წყდება მოლაპარაკებით, შეუთანხმებლობისას — სასამართლოში.</p>
 <p>8.2. ხელშეკრულება შედგენილია ორ თანაბარ ეგზემპლარად, თითო მხარისთვის.</p>

 <div class="sign">
   <div class="c"><b>მიმწოდებელი</b><br>შპს „რამ იმპექს"<div class="l">ხელმოწერა / ბეჭედი</div></div>
   <div class="c"><b>დისტრიბუტორი</b><br><span class="fill" style="min-width:180px"></span><div class="l">ხელმოწერა</div></div>
 </div>
 <div class="foot">RAM IMPEX · შპს „რამ იმპექს" · ს/კ 405565794 · 📞 595 533 500 · 🌐 ramimpex.com.ge · IBAN GE47BG0000000611211417</div>
</div>`;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--force-color-profile=srgb']});
 const p=await b.newPage();
 await p.setContent(html,{waitUntil:'load'});
 await p.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;}))));
 await p.waitForTimeout(200);
 await p.pdf({path:__dirname+'/RAM_IMPEX_distributor_contract.pdf',format:'A4',printBackground:true});
 await b.close();console.log('ok');
})();
