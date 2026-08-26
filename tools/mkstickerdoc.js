const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,ImageRun,ShadingType,AlignmentType,BorderStyle,VerticalAlign}=require('docx');
const GEO="Sylfaen";
const OR="C9701A", DK="1F1F1F";
const ICO=__dirname+'/pkgicons';
const qr=fs.readFileSync(__dirname+'/qr_info_b64.txt','utf8').trim().replace(/^data:image\/png;base64,/,'');
const qrBuf=Buffer.from(qr,'base64');
const icoBuf=n=>fs.readFileSync(`${ICO}/${n}.png`);

const t=(s,o={})=>new TextRun({text:s,font:GEO,...o});
const P=(runs,o={})=>new Paragraph({children:Array.isArray(runs)?runs:[runs],...o});
const H=(s)=>P(t(s,{bold:true,size:20,color:OR}),{spacing:{before:110,after:50},border:{bottom:{style:BorderStyle.SINGLE,size:6,color:OR,space:2}}});
const bullet=(s)=>P([t("■  ",{size:13,color:DK}),t(s,{size:18})],{spacing:{after:36}});
const lv=(l,v)=>P([t(l+":  ",{size:18}),t(v,{bold:true,size:18})],{spacing:{after:28}});
const NOB={style:BorderStyle.NONE,size:0,color:"FFFFFF"};
const noBorders={top:NOB,bottom:NOB,left:NOB,right:NOB,insideHorizontal:NOB,insideVertical:NOB};

// ---- pictogram strip: 4 icons + labels ----
const picts=[
 ['keepdry','ნესტისგან დაცვა','მშრალად შეინახეთ'],
 ['flammable','აალებადი','მოერიდეთ ცეცხლს'],
 ['temp','ტემპერატურის ლიმიტი','ზომიერ ტემპერატურაზე'],
 ['nochildren','ბავშვებისგან მოშორებით','მიუწვდომელ ადგილას'],
];
const thin={style:BorderStyle.SINGLE,size:6,color:"9A9A9A"};
const pictCell=([ic,nm,mn])=>new TableCell({width:{size:2616,type:WidthType.DXA},verticalAlign:VerticalAlign.CENTER,
 margins:{top:80,bottom:80,left:60,right:60},borders:{top:thin,bottom:thin,left:thin,right:thin},children:[
  P(new ImageRun({type:"png",data:icoBuf(ic),transformation:{width:44,height:44}}),{alignment:AlignmentType.CENTER,spacing:{after:20}}),
  P(t(nm,{bold:true,size:17}),{alignment:AlignmentType.CENTER,spacing:{after:8}}),
  P(t(mn,{size:14,color:"555555"}),{alignment:AlignmentType.CENTER}),
]});
const pictStrip=new Table({columnWidths:[2616,2616,2617,2617],width:{size:10466,type:WidthType.DXA},borders:noBorders,
 rows:[new TableRow({children:picts.map(pictCell)})]});

// ---- warning box ----
const warnBox=new Table({width:{size:5000,type:WidthType.DXA},columnWidths:[5000],
 borders:{top:{style:BorderStyle.SINGLE,size:12,color:DK},bottom:{style:BorderStyle.SINGLE,size:12,color:DK},left:{style:BorderStyle.SINGLE,size:12,color:DK},right:{style:BorderStyle.SINGLE,size:12,color:DK}},
 rows:[new TableRow({children:[new TableCell({margins:{top:80,bottom:80,left:120,right:120},width:{size:5000,type:WidthType.DXA},children:[
   P(t("გაფრთხილება",{bold:true,size:19}),{spacing:{after:50}}),
   P([t("⚠️ განკუთვნილია მხოლოდ გათბობისთვის — ღუმელი, ფეჩი, სათბური. არ არის რეკომენდებული ღია ცეცხლზე საკვების მოსამზადებლად.",{size:17})],{spacing:{after:60}}),
   P([t("🔩 ძლიერი სიმხურვალის გამო სასურველია ღუმელი/ფეჩი იყოს თუჯის (ნახშირზე გათვლილი), ან აღჭურვილი თუჯის ცხაურით (ბადე/სეტკა).",{size:17})]),
 ]})]})]});

// ---- two-column body ----
const leftCell=new TableCell({width:{size:5233,type:WidthType.DXA},margins:{top:40,bottom:40,left:40,right:170},verticalAlign:VerticalAlign.TOP,borders:{right:{style:BorderStyle.SINGLE,size:8,color:DK},top:NOB,bottom:NOB,left:NOB},children:[
 H("შემადგენლობა"),
 bullet("100% ანთრაციტის ქვანახშირი — უმაღლესი ხარისხის."),
 H("ტექნიკური მაჩვენებლები"),
 lv("თბოგამოცემა (NCV)","7 951 კკალ/კგ"),
 lv("ზომა","50×50×32 მმ"),
 lv("გოგირდი","≤ 1,16%"),
 lv("ნაცარი","≤ 11,1%"),
 lv("ტენიანობა","≤ 6,5%"),
 lv("აქროლადი ნივთ.","≤ 8,5%"),
 H("რატომ არის კარგი"),
 bullet("2× მეტი სითბო, ვიდრე შეშა (მაღალი კალორიულობა)."),
 bullet("8–12 საათი იწვის ერთ ჩაყრაზე (შეშა 1–2 სთ)."),
 bullet("ცოტა კვამლი და ნაცარი — სუფთა წვა."),
 bullet("ეკონომიური და სტაბილური ხარისხის."),
 H("სად გამოიყენება"),
 bullet("ღუმელი და ქურა."),
 bullet("ფეჩი / საოჯახო გათბობა."),
 bullet("სათბურების გათბობა · სამრეწველო ქვაბები."),
]});
const rightCell=new TableCell({width:{size:5233,type:WidthType.DXA},margins:{top:40,bottom:40,left:170,right:40},verticalAlign:VerticalAlign.TOP,borders:noBorders,children:[
 warnBox,
 H("მწარმოებელი / იმპორტიორი"),
 lv("მწარმოებელი","რუსეთის ფედერაცია"),
 lv("იმპორტიორი","შპს „რამ იმპექს“"),
 lv("შეფუთვა","10 კგ ტომარა / ბიგ-ბეგი"),
 lv("სერტიფიკატები","ISO · ГОСТ Р · MSDS"),
 H("შენახვის პირობები"),
 bullet("ვენტილირებად ადგილას; ტენის, ცეცხლისა და ბავშვებისგან მოშორებით."),
 bullet("შენახვის ვადა შეუზღუდავი — ხანგრძლივი შენახვა არაფერს უშლის ხელს."),
 bullet("საწყობი: ნატახტარი (თვითგატანა შესაძლებელია)."),
]});
const bodyTable=new Table({columnWidths:[5233,5233],width:{size:10466,type:WidthType.DXA},borders:noBorders,rows:[new TableRow({children:[leftCell,rightCell]})]});

// ---- big centered WEIGHT box (notes removed) ----
const weightBig=new Table({alignment:AlignmentType.CENTER,width:{size:8200,type:WidthType.DXA},columnWidths:[8200],
 borders:{top:{style:BorderStyle.SINGLE,size:24,color:DK},bottom:{style:BorderStyle.SINGLE,size:24,color:DK},left:{style:BorderStyle.SINGLE,size:24,color:DK},right:{style:BorderStyle.SINGLE,size:24,color:DK}},
 rows:[new TableRow({children:[new TableCell({width:{size:8200,type:WidthType.DXA},margins:{top:220,bottom:200,left:200,right:200},verticalAlign:VerticalAlign.CENTER,children:[
   P([t("წონა:  ",{bold:true,size:52}),t("________________",{size:46}),t("  კგ",{bold:true,size:52})],{alignment:AlignmentType.CENTER}),
   P(t("(ხელით ჩაწერეთ)",{size:18,color:"555555"}),{alignment:AlignmentType.CENTER,spacing:{before:140}}),
 ]})]})]});
const bottomStrip=new Table({columnWidths:[10466],width:{size:10466,type:WidthType.DXA},borders:{top:{style:BorderStyle.SINGLE,size:8,color:DK},bottom:NOB,left:NOB,right:NOB,insideVertical:NOB,insideHorizontal:NOB},
 rows:[new TableRow({children:[new TableCell({width:{size:10466,type:WidthType.DXA},margins:{top:200,bottom:200,left:120,right:120},children:[weightBig]})]})]});

// ---- header ----
const hL=new TableCell({width:{size:6000,type:WidthType.DXA},borders:noBorders,verticalAlign:VerticalAlign.CENTER,children:[
 P([new TextRun({text:"RAM IMPEX",bold:true,size:34,color:"111111"})]),
 P(t("ანთრაციტის ბრიკეტი",{size:16,bold:true})),
]});
const hR=new TableCell({width:{size:4466,type:WidthType.DXA},borders:noBorders,verticalAlign:VerticalAlign.CENTER,children:[
 P(t("იმპორტიორი · დისტრიბუტორი",{size:16,bold:true}),{alignment:AlignmentType.RIGHT}),
 P(t("595 533 500 · ramimpex.com.ge",{size:16,bold:true}),{alignment:AlignmentType.RIGHT}),
]});
const headerTable=new Table({columnWidths:[6000,4466],width:{size:10466,type:WidthType.DXA},borders:{bottom:{style:BorderStyle.SINGLE,size:12,color:DK},top:NOB,left:NOB,right:NOB,insideVertical:NOB,insideHorizontal:NOB},rows:[new TableRow({children:[hL,hR]})]});

// ---- footer ----
const fQr=new TableCell({width:{size:1400,type:WidthType.DXA},borders:noBorders,verticalAlign:VerticalAlign.CENTER,children:[P(new ImageRun({type:"png",data:qrBuf,transformation:{width:74,height:74}}))]});
const fTx=new TableCell({width:{size:9066,type:WidthType.DXA},borders:noBorders,verticalAlign:VerticalAlign.CENTER,margins:{left:160},children:[
 P([t("იმპორტიორი: შპს „რამ იმპექს“",{bold:true,size:17}),t("  ·  ს/კ 405565794",{size:17})]),
 P(t("📞 595 533 500 · ✉ info@ramimpex.com.ge · 🌐 ramimpex.com.ge",{size:16}),{spacing:{before:26}}),
 P(t("დაასკანერე QR — სრული ინფორმაცია, ფასები და მდებარეობა",{size:14,italics:true}),{spacing:{before:26}}),
]});
const footerTable=new Table({columnWidths:[1400,9066],width:{size:10466,type:WidthType.DXA},borders:{top:{style:BorderStyle.SINGLE,size:8,color:DK},bottom:NOB,left:NOB,right:NOB,insideVertical:NOB,insideHorizontal:NOB},rows:[new TableRow({children:[fQr,fTx]})]});

const doc=new Document({
 styles:{default:{document:{run:{font:GEO}}}},
 sections:[{
  properties:{page:{margin:{top:540,bottom:440,left:600,right:600}}},
  children:[
   headerTable,
   P(t("ანთრაციტის ბრიკეტი",{bold:true,size:38}),{alignment:AlignmentType.CENTER,spacing:{before:100,after:0}}),
   P(t("მაღალკალორიული, უკვამლო საწვავი გათბობისთვის და სამეწარმეო ინდუსტრიისთვის",{size:18,bold:true}),{alignment:AlignmentType.CENTER,spacing:{after:0}}),
   P(new TextRun({text:"ANTHRACITE COAL BRIQUETTE",size:14,bold:true,color:"555555"}),{alignment:AlignmentType.CENTER,spacing:{after:80}}),
   pictStrip,
   P(t("",{size:6}),{spacing:{before:40}}),
   bodyTable,
   P(t("",{size:6}),{spacing:{before:40}}),
   bottomStrip,
   P(t("",{size:6}),{spacing:{before:30}}),
   footerTable,
  ],
 }],
});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync(__dirname+'/RAM_IMPEX_stikeri_word.docx',b);console.log('sticker docx',b.length);});
