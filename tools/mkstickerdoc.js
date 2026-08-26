const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,ImageRun,ShadingType,AlignmentType,BorderStyle,VerticalAlign}=require('docx');
const GEO="Sylfaen";
const OR="C9701A", DK="1F1F1F";
const qr=fs.readFileSync(__dirname+'/qr_info_b64.txt','utf8').trim().replace(/^data:image\/png;base64,/,'');
const qrBuf=Buffer.from(qr,'base64');

const t=(s,o={})=>new TextRun({text:s,font:GEO,...o});
const P=(runs,o={})=>new Paragraph({children:Array.isArray(runs)?runs:[runs],...o});
const H=(s)=>P(t(s,{bold:true,size:20,color:OR,allCaps:false}),{spacing:{before:120,after:50},border:{bottom:{style:BorderStyle.SINGLE,size:6,color:OR,space:2}}});
const bullet=(s)=>P([t("■  ",{size:14,color:DK}),t(s,{size:19})],{spacing:{after:40}});
const lv=(l,v)=>P([t(l+":  ",{size:19}),t(v,{bold:true,size:19})],{spacing:{after:30}});

// warning box (nested single-cell table)
const warnBox=new Table({
 width:{size:5000,type:WidthType.DXA},columnWidths:[5000],
 borders:{top:{style:BorderStyle.SINGLE,size:12,color:DK},bottom:{style:BorderStyle.SINGLE,size:12,color:DK},left:{style:BorderStyle.SINGLE,size:12,color:DK},right:{style:BorderStyle.SINGLE,size:12,color:DK}},
 rows:[new TableRow({children:[new TableCell({margins:{top:90,bottom:90,left:130,right:130},width:{size:5000,type:WidthType.DXA},children:[
   P(t("გაფრთხილება",{bold:true,size:20}),{spacing:{after:60}}),
   P([t("⚠️ განკუთვნილია მხოლოდ გათბობისთვის — ღუმელი, ფეჩი, სათბური. არ არის რეკომენდებული ღია ცეცხლზე საკვების მოსამზადებლად.",{size:18})],{spacing:{after:70}}),
   P([t("🔩 ძლიერი სიმხურვალის გამო სასურველია ღუმელი/ფეჩი იყოს თუჯის (ნახშირზე გათვლილი), ან აღჭურვილი თუჯის ცხაურით (ბადე/სეტკა).",{size:18})]),
 ]})]})],
});

const NOB={style:BorderStyle.NONE,size:0,color:"FFFFFF"};
const noBorders={top:NOB,bottom:NOB,left:NOB,right:NOB,insideHorizontal:NOB,insideVertical:NOB};

const leftCell=new TableCell({width:{size:5233,type:WidthType.DXA},margins:{top:60,bottom:60,left:60,right:180},verticalAlign:VerticalAlign.TOP,borders:{right:{style:BorderStyle.SINGLE,size:8,color:DK},top:NOB,bottom:NOB,left:NOB},children:[
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
 bullet("სათბურების გათბობა."),
 bullet("სამრეწველო ქვაბები."),
]});

const rightCell=new TableCell({width:{size:5233,type:WidthType.DXA},margins:{top:60,bottom:60,left:180,right:60},verticalAlign:VerticalAlign.TOP,borders:noBorders,children:[
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

// weight + notes strip
const wCell=new TableCell({width:{size:4600,type:WidthType.DXA},margins:{top:120,bottom:120,left:120,right:120},verticalAlign:VerticalAlign.CENTER,borders:{right:{style:BorderStyle.SINGLE,size:8,color:DK},top:NOB,bottom:NOB,left:NOB},children:[
 P([t("წონა:  ",{bold:true,size:30}),t("________________",{size:30}),t("  კგ",{bold:true,size:30})]),
 P(t("(ხელით ჩაწერეთ)",{size:16}),{spacing:{before:40}}),
]});
const nCell=new TableCell({width:{size:5866,type:WidthType.DXA},margins:{top:120,bottom:120,left:180,right:60},verticalAlign:VerticalAlign.CENTER,borders:noBorders,children:[
 P(t("შენიშვნა / პარტია",{bold:true,size:18}),{spacing:{after:60}}),
 P(t("________________________________",{size:22})),
 P(t("________________________________",{size:22})),
]});
const bottomStrip=new Table({columnWidths:[4600,5866],width:{size:10466,type:WidthType.DXA},borders:{top:{style:BorderStyle.SINGLE,size:8,color:DK},bottom:NOB,left:NOB,right:NOB,insideVertical:NOB,insideHorizontal:NOB},rows:[new TableRow({children:[wCell,nCell]})]});

// header row (brand | contact)
const hL=new TableCell({width:{size:6000,type:WidthType.DXA},borders:noBorders,verticalAlign:VerticalAlign.CENTER,children:[
 P([new TextRun({text:"RAM IMPEX",bold:true,size:34,color:"111111"})]),
 P(t("ანთრაციტის ბრიკეტი",{size:16,bold:true})),
]});
const hR=new TableCell({width:{size:4466,type:WidthType.DXA},borders:noBorders,verticalAlign:VerticalAlign.CENTER,children:[
 P(t("იმპორტიორი · დისტრიბუტორი",{size:16,bold:true}),{alignment:AlignmentType.RIGHT}),
 P(t("595 533 500 · ramimpex.com.ge",{size:16,bold:true}),{alignment:AlignmentType.RIGHT}),
]});
const headerTable=new Table({columnWidths:[6000,4466],width:{size:10466,type:WidthType.DXA},borders:{bottom:{style:BorderStyle.SINGLE,size:12,color:DK},top:NOB,left:NOB,right:NOB,insideVertical:NOB,insideHorizontal:NOB},rows:[new TableRow({children:[hL,hR]})]});

// footer (qr | text)
const fQr=new TableCell({width:{size:1400,type:WidthType.DXA},borders:noBorders,verticalAlign:VerticalAlign.CENTER,children:[P(new ImageRun({type:"png",data:qrBuf,transformation:{width:80,height:80}}))]});
const fTx=new TableCell({width:{size:9066,type:WidthType.DXA},borders:noBorders,verticalAlign:VerticalAlign.CENTER,margins:{left:160},children:[
 P([t("იმპორტიორი: შპს „რამ იმპექს“",{bold:true,size:18}),t("  ·  ს/კ 405565794",{size:18})]),
 P(t("📞 595 533 500 · ✉ info@ramimpex.com.ge · 🌐 ramimpex.com.ge",{size:17}),{spacing:{before:30}}),
 P(t("დაასკანერე QR — სრული ინფორმაცია, ფასები და მდებარეობა",{size:15,italics:true}),{spacing:{before:30}}),
]});
const footerTable=new Table({columnWidths:[1400,9066],width:{size:10466,type:WidthType.DXA},borders:{top:{style:BorderStyle.SINGLE,size:8,color:DK},bottom:NOB,left:NOB,right:NOB,insideVertical:NOB,insideHorizontal:NOB},rows:[new TableRow({children:[fQr,fTx]})]});

const doc=new Document({
 styles:{default:{document:{run:{font:GEO}}}},
 sections:[{
  properties:{page:{margin:{top:600,bottom:500,left:620,right:620}}},
  children:[
   headerTable,
   P(t("ანთრაციტის ბრიკეტი",{bold:true,size:40}),{alignment:AlignmentType.CENTER,spacing:{before:120,after:0}}),
   P(t("მაღალკალორიული, უკვამლო საწვავი გათბობისთვის",{size:19,bold:true}),{alignment:AlignmentType.CENTER,spacing:{after:0}}),
   P(new TextRun({text:"ANTHRACITE COAL BRIQUETTE",size:15,bold:true,color:"555555"}),{alignment:AlignmentType.CENTER,spacing:{after:60}}),
   P([t("💧 ნესტგამძლე      🔥 მაღალკალორიული      💨 უკვამლო      ⏱ ხანგრძლივი წვა",{size:18,bold:true})],{alignment:AlignmentType.CENTER,spacing:{after:120},border:{top:{style:BorderStyle.SINGLE,size:6,color:DK,space:6},bottom:{style:BorderStyle.SINGLE,size:6,color:DK,space:6}}}),
   bodyTable,
   P(t("",{size:6}),{spacing:{before:60}}),
   bottomStrip,
   P(t("",{size:6}),{spacing:{before:40}}),
   footerTable,
  ],
 }],
});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync(__dirname+'/RAM_IMPEX_stikeri_word.docx',b);console.log('sticker docx',b.length);});
