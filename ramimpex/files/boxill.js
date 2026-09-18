/* RAM IMPEX — მუყაოს შეფუთვის პროპორციული ილუსტრაცია (ზომებით + შრეებით).
   RAM_boxIll({size:'400×300×250', ply:'5', kind:'box', dims:true, caption:true}) → inline SVG string
   RAM_boxIllURI(opts) → data:image/svg+xml (<img src>-ისთვის)
   RAM_boxPNG(opts, scale, cb) → cb(pngDataURL) — ჩამოსატვირთად/გასაგზავნად
   kind: box|pizza|tray|wine|cake|shoe|tube|sheet|corner|medical  */
(function(){
  var C={t:'#e8c48f',l:'#dcab6e',r:'#c8925a',ed:'#7a4a1e',inr:'#b78d55',seam:'#b07c40',dim:'#0B6B3C',cap:'#7a4a1e',ply:'#c9701a',bg:'#fdfbf6'};
  function nums(s){var m=(''+(s||'')).match(/\d+(?:[.,]\d+)?/g);return m?m.map(function(n){return parseFloat(n.replace(',','.'));}).filter(function(n){return !isNaN(n)&&n>0;}):[];}
  function esc(s){return (s==null?'':(''+s)).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function dimsFor(kind,size){
    var v=nums(size),L,W,H,known=(v.length>=2);
    if(v.length>=3){L=v[0];W=v[1];H=v[2];}
    else if(v.length===2){L=v[0];W=v[1];
      H=kind==='pizza'?Math.max(20,Math.round(W*0.12)):kind==='sheet'?Math.max(3,Math.round(Math.min(L,W)*0.02)):kind==='tray'?Math.max(25,Math.round(W*0.28)):Math.round((L+W)/2*0.55);
    } else if(v.length===1){L=W=H=v[0];}
    else{known=false;var pr={pizza:[50,50,6],sheet:[60,42,2],tray:[44,32,12],wine:[22,22,42],cake:[30,30,18],shoe:[42,26,15],box:[40,30,26],tube:[30,30,60],corner:[50,50,50],medical:[26,26,34]}[kind]||[40,30,26];L=pr[0];W=pr[1];H=pr[2];}
    return {L:L,W:W,H:H,known:known,n:v.length};
  }

  window.RAM_boxIll=function(opts){
    opts=opts||{};
    var kind=opts.kind||'box',showCap=opts.caption!==false,d=dimsFor(kind,opts.size),L=d.L,W=d.W,H=d.H;
    var showDims=(opts.dims!==false)&&d.known&&kind!=='corner';
    var minX=1e9,maxX=-1e9,minY=1e9,maxY=-1e9;
    function reg(x,y){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}
    function P(p){reg(p[0],p[1]);return p[0].toFixed(1)+','+p[1].toFixed(1);}
    function face(pts,fill){return '<polygon points="'+pts.map(P).join(' ')+'" fill="'+fill+'" stroke="'+C.ed+'" stroke-width="2.4" stroke-linejoin="round"/>';}
    function dLine(x1,y1,x2,y2){reg(x1,y1);reg(x2,y2);return '<line x1="'+x1.toFixed(1)+'" y1="'+y1.toFixed(1)+'" x2="'+x2.toFixed(1)+'" y2="'+y2.toFixed(1)+'" stroke="'+C.dim+'" stroke-width="1.7" marker-start="url(#ra)" marker-end="url(#ra)"/>';}
    function dTxt(x,y,t,rot){reg(x-18,y-8);reg(x+18,y+8);return '<text x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" fill="'+C.dim+'" font-size="19" font-weight="800" text-anchor="middle"'+(rot?' transform="rotate('+rot+' '+x.toFixed(1)+' '+y.toFixed(1)+')"':'')+'>'+esc(t)+'</text>';}
    var body='';

    if(kind==='tube'){
      var s=150/Math.max(W,H),rx=Math.max(16,W*s/2*0.55),ry=rx*0.34,ht=H*s,cx=0;
      body='<path d="M'+(cx-rx)+' 0 L'+(cx-rx)+' '+ht+' A'+rx+' '+ry+' 0 0 0 '+(cx+rx)+' '+ht+' L'+(cx+rx)+' 0" fill="'+C.l+'" stroke="'+C.ed+'" stroke-width="2.4"/>'+
           '<ellipse cx="'+cx+'" cy="0" rx="'+rx+'" ry="'+ry+'" fill="'+C.t+'" stroke="'+C.ed+'" stroke-width="2.4"/>'+
           '<ellipse cx="'+cx+'" cy="0" rx="'+(rx*0.5)+'" ry="'+(ry*0.5)+'" fill="'+C.inr+'"/>';
      reg(cx-rx,-ry);reg(cx+rx,ht+ry);
      if(showDims){body+=dLine(cx+rx+16,0,cx+rx+16,ht)+dTxt(cx+rx+36,ht/2,H+' მმ',-90)+dLine(cx-rx,ht+ry+16,cx+rx,ht+ry+16)+dTxt(cx,ht+ry+40,'Ø '+W+' მმ',0);}
    }
    else if(kind==='corner'){
      body='<path d="M20 24 L64 24 L64 40 L36 40 L36 104 L20 104 Z" fill="'+C.l+'" stroke="'+C.ed+'" stroke-width="2.2" stroke-linejoin="round"/>'+
           '<path d="M20 24 L36 10 L80 10 L64 24 Z" fill="'+C.t+'" stroke="'+C.ed+'" stroke-width="2.2" stroke-linejoin="round"/>'+
           '<path d="M64 24 L80 10 L80 26 L64 40 Z" fill="'+C.r+'" stroke="'+C.ed+'" stroke-width="2.2" stroke-linejoin="round"/>'+
           '<path d="M36 40 L52 26 L52 90 L36 104 Z" fill="'+C.r+'" stroke="'+C.ed+'" stroke-width="2.2" stroke-linejoin="round"/>';
      reg(20,10);reg(80,104);
    }
    else{
      var maxd=Math.max(L,W,H),s2=150/maxd,wpx=W*s2,hpx=H*s2,dep=L*s2*0.5,ang=-32*Math.PI/180,dx=dep*Math.cos(ang),dy=dep*Math.sin(ang);
      var A=[0,0],B=[wpx,0],Cc=[wpx,-hpx],D=[0,-hpx],D2=[dx,-hpx+dy],C2=[wpx+dx,-hpx+dy],B2=[wpx+dx,dy];
      body=face([D,Cc,C2,D2],C.t)+face([B,Cc,C2,B2],C.r)+face([A,B,Cc,D],C.l);
      body+='<line x1="'+(wpx/2).toFixed(1)+'" y1="0" x2="'+(wpx/2).toFixed(1)+'" y2="'+(-hpx).toFixed(1)+'" stroke="'+C.seam+'" stroke-width="1.1" stroke-dasharray="5 4"/>';
      if(kind==='tray'){var m=wpx*0.13;var t1=[D[0]+m,D[1]],t2=[Cc[0]-m,Cc[1]],t3=[Cc[0]-m+dx*0.72,Cc[1]+dy*0.72],t4=[D[0]+m+dx*0.72,D[1]+dy*0.72];body+='<polygon points="'+P(t1)+' '+P(t2)+' '+P(t3)+' '+P(t4)+'" fill="'+C.inr+'" stroke="'+C.ed+'" stroke-width="1.4"/>';}
      if(kind==='cake'||kind==='pizza'){body+='<line x1="'+D[0].toFixed(1)+'" y1="'+(D[1]+hpx*0.24).toFixed(1)+'" x2="'+Cc[0].toFixed(1)+'" y2="'+(Cc[1]+hpx*0.24).toFixed(1)+'" stroke="'+C.seam+'" stroke-width="1.4"/>';}
      if(kind==='shoe'){var e=wpx*0.05;var L1=[D[0]-e,D[1]],L2=[Cc[0]+e,Cc[1]],L3=[Cc[0]+e+dx,Cc[1]+dy],L4=[D[0]-e+dx,D[1]+dy];body+='<polygon points="'+P(L1)+' '+P(L2)+' '+P(L3)+' '+P(L4)+'" fill="'+C.t+'" stroke="'+C.ed+'" stroke-width="2"/>';}
      if(showDims){
        body+=dLine(A[0]-20,A[1],D[0]-20,D[1])+dTxt(A[0]-40,(A[1]+D[1])/2,H+' მმ',-90);
        body+=dLine(A[0],A[1]+24,B[0],B[1]+24)+dTxt((A[0]+B[0])/2,A[1]+48,W+' მმ',0);
        var lx1=D[0]-4,ly1=D[1]-26,lx2=D2[0]-4,ly2=D2[1]-26,deg=Math.atan2(ly2-ly1,lx2-lx1)*180/Math.PI;
        body+=dLine(lx1,ly1,lx2,ly2)+dTxt((lx1+lx2)/2,(ly1+ly2)/2-13,L+' მმ',deg);
      }
    }

    // header (caption + ply) ზემოთ — ხაზებს ზემოთ, ნათელი დაშორებით
    var head='';
    var capTxt=showCap?('📦 '+(opts.size?esc(opts.size)+(/[a-zა-ჰ]/i.test(''+opts.size)?'':' მმ'):(d.known?(L+'×'+W+'×'+H+' მმ'):''))):'';
    var plyTxt=opts.ply?('🧱 '+esc(opts.ply)+' შრიანი'):'';
    var cxMid=(minX+maxX)/2;
    if(capTxt||plyTxt){
      var gap=30;
      var plyY=minY-gap;
      var capY=plyTxt?(plyY-24):plyY;
      if(plyTxt)head+='<text x="'+cxMid.toFixed(1)+'" y="'+plyY.toFixed(1)+'" text-anchor="middle" font-size="16" font-weight="800" fill="'+C.ply+'">'+plyTxt+'</text>';
      if(capTxt)head+='<text x="'+cxMid.toFixed(1)+'" y="'+capY.toFixed(1)+'" text-anchor="middle" font-size="18" font-weight="800" fill="'+C.cap+'">'+capTxt+'</text>';
      reg(cxMid, capY-16);
    }
    var pad=14;
    var vbx=(minX-pad),vby=(minY-pad),vbw=(maxX-minX+2*pad),vbh=(maxY-minY+2*pad);
    var defs='<defs><marker id="ra" markerWidth="9" markerHeight="9" refX="4.5" refY="4.5" orient="auto"><path d="M1 4.5 L8 1.5 L8 7.5 Z" fill="'+C.dim+'"/></marker></defs>';
    var bgRect=opts.bg===false?'':'<rect x="'+vbx.toFixed(1)+'" y="'+vby.toFixed(1)+'" width="'+vbw.toFixed(1)+'" height="'+vbh.toFixed(1)+'" fill="'+C.bg+'"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+vbx.toFixed(1)+' '+vby.toFixed(1)+' '+vbw.toFixed(1)+' '+vbh.toFixed(1)+'" font-family="Arial,\'Noto Sans Georgian\',sans-serif" style="display:block;width:100%;height:auto">'+defs+bgRect+body+head+'</svg>';
  };

  window.RAM_boxIllURI=function(opts){return 'data:image/svg+xml,'+encodeURIComponent(window.RAM_boxIll(opts));};
  window.RAM_boxPNG=function(opts,scale,cb){
    scale=scale||2;var svg=window.RAM_boxIll(opts);
    var img=new Image();
    img.onload=function(){
      var vb=svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(parseFloat);
      var ar=vb[2]/vb[3],w=560*scale,h=Math.round(w/ar);
      var cv=document.createElement('canvas');cv.width=w;cv.height=h;
      var cx=cv.getContext('2d');cx.fillStyle='#fdfbf6';cx.fillRect(0,0,w,h);cx.drawImage(img,0,0,w,h);
      try{cb(cv.toDataURL('image/png'),w,h);}catch(e){cb(null);}
    };
    img.onerror=function(){cb(null);};
    img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  };
})();
