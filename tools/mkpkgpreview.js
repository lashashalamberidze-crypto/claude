const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');
const ICO=__dirname+'/pkgicons';
const b64=n=>'data:image/png;base64,'+fs.readFileSync(`${ICO}/${n}.png`).toString('base64');
const rows=[
 ['keepdry','ნესტისგან დაცვა','შეფუთვა დაიცავით წვიმის/ტენისგან — მშრალად შენახვა.'],
 ['nofire','ცეცხლისგან მოშორებით','არ მოათავსოთ ღია ცეცხლთან ან სითბოს წყაროსთან ახლოს.'],
 ['nosun','მზის სხივებისგან დაცვა','არ დატოვოთ პირდაპირ მზის სხივებზე ან სითბოზე.'],
 ['flammable','აალებადი','პროდუქტი აალებადია — მოერიდეთ ცეცხლს/ნაპერწკალს.'],
 ['nochildren','ბავშვებისგან მოშორებით','შეინახეთ ბავშვებისთვის მიუწვდომელ ადგილას.'],
 ['ventilate','ვენტილირებად ადგილას','შეინახეთ კარგად განიავებად ადგილას.'],
 ['recycle','გადამუშავებადი შეფუთვა','შეფუთვა ექვემდებარება გადამუშავებას.'],
 ['thiswayup','ზემოთ (This Way Up)','შეფუთვა ინახება/გადააქვთ მითითებული მიმართულებით.'],
 ['nostack','არ დააწყოთ ერთმანეთზე','ზემოდან სხვა ტვირთის დადება აკრძალულია.'],
 ['stacklimit','დაწყობის ლიმიტი','ერთმანეთზე დაწყობის მაქსიმალური რაოდენობა.'],
 ['handlecare','სიფრთხილით','ფრთხილად დატვირთვა/გადატანა.'],
 ['fragile','მსხვრევადი','ფრთხილად — მსხვრევადი შიგთავსი.'],
 ['nohooks','კაუჭები აკრძალულია','ტვირთის გადასაადგილებლად კაუჭი არ გამოიყენოთ.'],
 ['temp','ტემპერატურის ლიმიტი','შეინახეთ მითითებულ ტემპერატურულ დიაპაზონში.'],
 ['gravity','სიმძიმის ცენტრი','ტვირთის სიმძიმის ცენტრის აღნიშვნა.'],
 ['weight','წონა / ნეტო მასა','შეფუთვის წონის აღნიშვნა (მაგ. 10 კგ).'],
];
const F="'Noto Sans Georgian','Sylfaen',sans-serif";
const tr=(r,i)=>`<tr style="background:${i%2?'#f5f5f5':'#fff'}">
 <td class="c ic"><img src="${b64(r[0])}"></td>
 <td class="c nm">${r[1]}</td>
 <td class="c mn">${r[2]}</td>
 <td class="c nd"></td></tr>`;
const html=`<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;font-family:${F}}
body{width:900px;margin:0;padding:28px 30px;background:#fff;color:#111}
.h1{text-align:center;font-weight:900;font-size:26px}
.h2{text-align:center;font-weight:800;font-size:17px;color:#C9701A;margin:4px 0 14px}
.intro{border-top:2px solid #C9701A;border-bottom:2px solid #C9701A;padding:9px 4px;font-size:13.5px;line-height:1.5;margin-bottom:16px}
table{border-collapse:collapse;width:100%}
th{background:#1f1f1f;color:#fff;font-weight:800;font-size:13px;padding:8px 10px;text-align:left;border:1px solid #bfbfbf}
.c{border:1px solid #bfbfbf;padding:7px 10px;vertical-align:middle}
.ic{width:74px;text-align:center}.ic img{width:48px;height:48px}
.nm{width:200px;font-weight:800;font-size:13.5px}
.mn{font-size:13px}
.nd{width:150px}
.foot{margin-top:16px;font-weight:800;font-size:13.5px}
</style>
<div class="h1">RAM IMPEX</div>
<div class="h2">ანთრაციტის ბრიკეტი — შეფუთვის ნიშნები (პიქტოგრამები)</div>
<div class="intro">როგორ გამოვიყენოთ ეს დოკუმენტი: ბოლო სვეტში „მჭირდება?" ჩაწერეთ <b>კი</b> ან <b>არა</b>, ან უბრალოდ წაშალეთ ის სტრიქონები, რომლებიც არ გჭირდებათ. დაამატეთ კომენტარიც (მაგ. ზომა, ფერი). შემდეგ დამიბრუნეთ და შესაბამის ნიშნებს დავამატებ ეტიკეტზე/ტომარაზე.</div>
<table><tr><th style="width:74px">ნიშანი</th><th style="width:200px">დასახელება</th><th>რას ნიშნავს</th><th style="width:150px">მჭირდება? / კომენტარი</th></tr>
${rows.map(tr).join('')}</table>
<div class="foot">დამატებითი შენიშვნები (ჩაწერეთ თავისუფლად):</div>`;
(async()=>{
 const br=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await br.newPage({viewport:{width:900,height:100},deviceScaleFactor:2});
 await p.setContent(html);await p.waitForTimeout(300);
 await p.screenshot({path:__dirname+'/_pkgdoc_preview.png',fullPage:true});
 await br.close();console.log('preview rendered');
})();
