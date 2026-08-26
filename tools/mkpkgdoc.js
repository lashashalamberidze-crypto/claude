const fs=require('fs');
const D=require('docx');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,ImageRun,ShadingType,AlignmentType,BorderStyle,HeadingLevel,VerticalAlign}=D;
const ICO=__dirname+'/pkgicons';
const GEO="Sylfaen";
const img=n=>fs.readFileSync(`${ICO}/${n}.png`);

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

const NOBORDER={style:BorderStyle.NONE,size:0,color:"FFFFFF"};
const cellBorder={top:{style:BorderStyle.SINGLE,size:4,color:"BFBFBF"},bottom:{style:BorderStyle.SINGLE,size:4,color:"BFBFBF"},left:{style:BorderStyle.SINGLE,size:4,color:"BFBFBF"},right:{style:BorderStyle.SINGLE,size:4,color:"BFBFBF"}};
const geo=(t,o={})=>new TextRun({text:t,font:GEO,...o});
const P=(runs,o={})=>new Paragraph({children:Array.isArray(runs)?runs:[runs],...o});

const headerCell=(t,w)=>new TableCell({width:{size:w,type:WidthType.DXA},shading:{type:ShadingType.CLEAR,fill:"1F1F1F",color:"auto"},verticalAlign:VerticalAlign.CENTER,margins:{top:80,bottom:80,left:120,right:120},borders:cellBorder,children:[P(geo(t,{bold:true,color:"FFFFFF",size:22}))]});

const COLS=[1300,3000,4166,2000];
const headerRow=new TableRow({tableHeader:true,children:[headerCell("ნიშანი",COLS[0]),headerCell("დასახელება",COLS[1]),headerCell("რას ნიშნავს",COLS[2]),headerCell("მჭირდება? / კომენტარი",COLS[3])]});

const bodyRows=rows.map(([icon,name,mean],i)=>{
 const shade=i%2? "F5F5F5":"FFFFFF";
 const mk=(children,w,align)=>new TableCell({width:{size:w,type:WidthType.DXA},shading:{type:ShadingType.CLEAR,fill:shade,color:"auto"},verticalAlign:VerticalAlign.CENTER,margins:{top:70,bottom:70,left:120,right:120},borders:cellBorder,children});
 return new TableRow({children:[
  mk([P(new ImageRun({type:"png",data:img(icon),transformation:{width:52,height:52}}),{alignment:AlignmentType.CENTER})],COLS[0]),
  mk([P(geo(name,{bold:true,size:22}))],COLS[1]),
  mk([P(geo(mean,{size:21}))],COLS[2]),
  mk([P(geo("",{size:22}))],COLS[3]),
 ]});
});

const table=new Table({columnWidths:COLS,width:{size:COLS.reduce((a,b)=>a+b,0),type:WidthType.DXA},rows:[headerRow,...bodyRows]});

const doc=new Document({
 styles:{default:{document:{run:{font:GEO}}}},
 sections:[{
  properties:{page:{margin:{top:900,bottom:900,left:720,right:720}}},
  children:[
   P([new TextRun({text:"RAM IMPEX",bold:true,size:40,color:"111111"})],{alignment:AlignmentType.CENTER,spacing:{after:40}}),
   P([geo("ანთრაციტის ბრიკეტი — შეფუთვის ნიშნები (პიქტოგრამები)",{bold:true,size:28,color:"C9701A"})],{alignment:AlignmentType.CENTER,spacing:{after:120}}),
   P([geo("როგორ გამოვიყენოთ ეს დოკუმენტი: ბოლო სვეტში „მჭირდება?“ ჩაწერეთ ",{size:22}),geo("კი",{bold:true,size:22}),geo(" ან ",{size:22}),geo("არა",{bold:true,size:22}),geo(", ან უბრალოდ წაშალეთ ის სტრიქონები, რომლებიც არ გჭირდებათ. დაამატეთ კომენტარიც (მაგ. ზომა, ფერი). შემდეგ დამიბრუნეთ და შესაბამის ნიშნებს დავამატებ ეტიკეტზე/ტომარაზე.",{size:22})],{spacing:{after:160},border:{top:{style:BorderStyle.SINGLE,size:4,color:"C9701A",space:6},bottom:{style:BorderStyle.SINGLE,size:4,color:"C9701A",space:6}}}),
   P([geo("",{size:12})]),
   table,
   P([geo("",{size:12})],{spacing:{before:160}}),
   P([geo("დამატებითი შენიშვნები (ჩაწერეთ თავისუფლად):",{bold:true,size:22})],{spacing:{after:60}}),
   P([geo("• ",{size:22})]),
   P([geo("• ",{size:22})]),
   P([geo("• ",{size:22})]),
  ],
 }],
});
Packer.toBuffer(doc).then(buf=>{fs.writeFileSync(__dirname+'/RAM_IMPEX_shefutvis_nishnebi.docx',buf);console.log('docx written',buf.length);});
