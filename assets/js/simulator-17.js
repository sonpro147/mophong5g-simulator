
/* ===== Hero theo từng thẻ + mục con, nhãn tên, nền gradient theo thẻ ===== */
(function(){
  const reduced=()=>!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  const E=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  /* ---- nét vẽ cơ bản; mỗi phần bọc <g data-k> để làm sáng theo mục con ---- */
  const P=(d,c)=>`<path class="${c||'ln d'}" d="${d}" pathLength="1"/>`;
  const K=(k,inner)=>`<g class="gpt" data-k="${k}">${inner}</g>`;
  const T=(x,y,t,a)=>`<text class="tx f" x="${x}" y="${y}" text-anchor="${a||'middle'}">${E(t)}</text>`;
  const node=(x,y,r,t)=>`<circle class="nd d" cx="${x}" cy="${y}" r="${r}" pathLength="1"/>`+(t?T(x,y+4,t):'');
  const box=(x,y,w,h,t,rx)=>`<rect class="nd d" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx==null?6:rx}" pathLength="1"/>`+(t?T(x+w/2,y+h/2+4,t):'');
  const tower=(x,y,s)=>{s=s||1;return P(`M${x} ${y} L${x-12*s} ${y+70*s} M${x} ${y} L${x+12*s} ${y+70*s} M${x-9*s} ${y+52*s} H${x+9*s} M${x-5*s} ${y+30*s} H${x+5*s}`)+`<circle class="fl f" cx="${x}" cy="${y-3}" r="${3.5*s}"/>`;};
  const waves=(x,y)=>[1,2,3].map(i=>`<path class="wave${i>1?' w'+i:''}" d="M${x-30} ${y} a40 40 0 0 1 60 0" style="transform-origin:${x}px ${y+20}px"/>`).join('');
  const phone=(x,y,w,h)=>{w=w||22;h=h||38;return box(x-w/2,y-h/2,w,h,'',5)+P(`M${x-4} ${y+h/2-6} h8`);};
  const cloud=(x,y,t)=>P(`M${x-36} ${y+14} a16 16 0 0 1 2 -30 a22 22 0 0 1 40 -8 a18 18 0 0 1 30 12 a14 14 0 0 1 -4 26 z`)+(t?T(x,y+6,t):'');
  const mv=(path,dur,delay)=>reduced()?'':`<circle class="pk" r="3"><animateMotion dur="${dur}s" begin="${delay||0}s" repeatCount="indefinite" path="${path}"/></circle>`;
  const link=(a,b,c)=>P(`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`,c||'ln s d d2');
  const hex=(x,y,r)=>{let d='';for(let i=0;i<6;i++){const a=Math.PI/3*i+Math.PI/6;d+=(i?'L':'M')+(x+r*Math.cos(a)).toFixed(1)+' '+(y+r*Math.sin(a)).toFixed(1);}return P(d+'Z','nd d');};
  const rings=`<ellipse class="ring" cx="420" cy="190" rx="290" ry="86"/><ellipse class="ring r2" cx="420" cy="190" rx="220" ry="60"/>`;
  /* ---- cảnh theo thẻ: trả về chuỗi SVG; các phần data-k = 0,1,2… ---- */
  const SC={
  e2:()=>{const X=[380,450,520,590,660],L=['UE','RAN','TX','LÕI','DN'];let s='';
    for(let i=0;i<4;i++)s+=link([X[i]+18,190],[X[i+1]-18,190],'ln d d2');
    X.forEach((x,i)=>{s+=K(i,i===0?phone(x,190)+T(x,236,L[i]):node(x,190,18,L[i]));});
    return s+mv(`M380 190 L660 190`,3.2)+mv(`M380 190 L660 190`,3.2,1.6);},
  arch:()=>{let s='';const R=[['Lõi 5GC / EPC',110],['Truyền dẫn',160],['RAN: CU · DU · RU',210]];R.forEach((r,i)=>{s+=K(i,box(420,r[1],220,36,r[0]));});
    s+=K(3,phone(372,228)+link([382,228],[420,228]));return s+P('M530 146 V160 M530 196 V210','ln2 d d3')+mv('M372 228 L530 228 L530 128',3);},
  core:()=>{const N=[[440,120,'AMF'],[520,100,'SMF'],[600,130,'UPF'],[470,200,'AUSF'],[560,195,'UDM'],[630,230,'PCF'],[400,170,'NRF']],Ed=[[0,1],[1,2],[0,3],[3,4],[1,4],[4,5],[2,5],[6,0],[6,3]];
    let s='';Ed.forEach(([a,b])=>{s+=link(N[a],N[b]);});N.forEach((n,i)=>{s+=K(i,node(n[0],n[1],17,n[2]));});
    return s+mv('M440 120 L520 100 L600 130',3.4)+mv('M400 170 L440 120 L470 200 L560 195',4.2,1);},
  ims:()=>{let s=cloud(520,110,'IMS');const N=[[420,190,'P-CSCF'],[500,230,'S-CSCF'],[590,230,'I-CSCF'],[650,170,'HSS'],[560,160,'MMTel']];
    N.forEach((n,i)=>{s+=K(i,node(n[0],n[1],22,n[2]));});s+=link(N[0],N[1])+link(N[1],N[2])+link(N[2],N[3])+link(N[1],N[4]);
    return s+K(5,phone(370,240))+link([380,236],[400,200])+mv('M370 240 L420 190 L500 230 L560 160',3.6);},
  rm:()=>{let s=P('M430 200 a70 70 0 1 0 140 0 a70 70 0 1 0 -140 0','nd d')+P('M430 200 h140 M500 130 v140 M445 165 q55 20 110 0 M445 235 q55 -20 110 0','ln s d d2');
    s+=K(0,box(372,110,70,28,'HPLMN'))+K(1,box(600,240,70,28,'VPLMN'))+K(2,node(500,200,16,'SEPP'));
    return s+P('M407 138 C 420 80, 620 90, 635 240','ln2 d d3')+mv('M407 138 C 420 80, 620 90, 635 240',4);},
  it:()=>{let s=K(0,cloud(420,150,'Nhà mạng'))+K(1,cloud(620,150,'Internet'))+K(2,node(520,220,18,'IX'));
    return s+link([440,170],[505,210])+link([600,170],[535,210])+mv('M440 170 L520 220 L600 170',3)+mv('M600 170 L520 220 L440 170',3,1.5);},
  u3:()=>{let s=K(0,tower(420,120))+K(1,box(470,180,80,34,'RNC'))+K(2,box(580,180,80,34,'MSC/SGSN'))+link([432,170],[470,196])+link([550,197],[580,197]);
    const B=[[520,110],[560,110],[600,110],[640,110]];s+=K(3,P('M500 140 L540 120 L580 140 M540 120 L540 100 M580 140 L600 125 M580 140 L620 125','ln d d2')+T(560,96,'OVSF'));
    s+=K(4,phone(380,250));return s+waves(420,118)+mv('M380 250 L420 125 L510 197 L620 197',3.8);},
  radio:()=>{let s=K(0,tower(470,110))+waves(470,108);[60,95,130].forEach((r,i)=>{s+=K(i+1,`<circle class="ln s d d${i+1}" cx="470" cy="180" r="${r}" pathLength="1"/>`);});
    s+=K(4,phone(600,240));return s+P('M360 270 C 450 200, 520 270, 640 230','ln2 d d3')+mv('M360 270 C 450 200, 520 270, 640 230',5);},
  mob:()=>{let s='';[[420,190],[500,150],[500,230],[580,190],[660,150]].forEach((c,i)=>{s+=K(i,hex(c[0],c[1],42)+T(c[0],c[1]+4,'Cell '+(i+1)));});
    return s+P('M380 230 C 470 160, 560 230, 680 160','ln2 d d3')+mv('M380 230 C 470 160, 560 230, 680 160',5);},
  hx:()=>{let s=K(0,tower(420,120)+T(420,214,'nguồn'))+K(1,tower(620,120)+T(620,214,'đích'))+K(2,phone(520,230));
    return s+P('M440 160 Q 520 110 600 160','ln2 d d2')+P('M590 152 L600 160 L588 166','ln2 d d2')+mv('M440 230 L600 230',3.5);},
  nd:()=>{let s=K(0,tower(420,120)+T(420,214,'eNB · LTE'))+K(1,tower(620,120)+T(620,214,'gNB · NR'))+K(2,P('M434 140 H606','ln d d2')+T(520,132,'X2 / Xn'));
    s+=K(3,phone(520,250));s+=K(4,link([514,236],[428,180])+link([526,236],[612,180]));return s+K(5,T(520,292,'EN-DC · CHO · DAPS · LTM'))+mv('M520 250 L612 180',2.4)+mv('M520 250 L428 180',2.8,1);},
  ro:()=>{let s=K(0,P('M380 150 Q 470 90 560 150','ln2 d')+T(470,96,'TDD · RIM'));
    s+=K(1,[0,1,2,3,4,5,6].map(i=>`<rect class="bar fl f" x="${370+i*12}" y="${250-[18,30,22,46,26,20,34][i]}" width="8" height="${[18,30,22,46,26,20,34][i]}" style="opacity:.55"/>`).join('')+T(410,268,'IoT/PRB'));
    s+=K(2,P('M470 260 V200 M462 210 L470 198 L478 210','ln d d2')+T(470,276,'P0 · α'));
    s+=K(3,P('M500 250 L515 250 L520 200 L525 250 L560 250','ln d d2')+T(530,268,'PRACH'));
    s+=K(4,hex(610,180,26)+T(610,184,'PCI'));s+=K(5,box(590,230,70,40,'KPI'));return s+K(6,tower(560,110,.8))+waves(560,108);},
  lb:()=>{let s=K(0,tower(410,120)+[1,2,3].map(i=>P(`M${410-28*i} 200 a${28*i} ${28*i} 0 0 1 ${56*i} 0`,'ln s d d'+i)).join('')+T(410,226,'700 · 900'));
    s+=K(1,['3500','2600','1800','900','700'].map((t,i)=>box(492,100+i*24,62,18,'',4)+T(523,113+i*24,t)).join(''));
    s+=K(2,`<rect class="bar fl f" x="572" y="150" width="14" height="70" style="opacity:.55"/><rect class="bar fl f" x="602" y="190" width="14" height="30" style="opacity:.55"/>`+P('M579 142 Q 596 118 609 182','ln2 d d2')+T(594,238,'MLB'));
    s+=K(3,box(632,104,62,22,'CA',5)+box(632,132,62,22,'BWP',5));
    s+=K(4,hex(663,196,13)+hex(641,209,13)+hex(685,209,13));
    s+=K(5,T(560,286,'IFLB · MLB · NWDAF/RIC'));
    return s+mv('M579 142 Q 596 118 609 182',2.6);},
  sf:()=>{let s=K(0,tower(392,120)+T(392,214,'1 trạm'));
    s+=K(1,[['n77 3800',0],['n41 2600',1],['B1 2100',2],['B3 1800',3]].map(([t,i])=>box(440,100+i*30,84,22,'',4)+T(482,115+i*30,t)).join(''));
    let g='';for(let r=0;r<4;r++)for(let c=0;c<6;c++){const on=(r*5+c*3)%4<2;g+=`<rect class="${on?'fl bar f':'nd d'}" x="${548+c*14}" y="${100+r*30}" width="11" height="22" rx="2" ${on?'style="opacity:.5"':'pathLength="1"'}/>`;}
    s+=K(2,g+T(590,236,'PRB × khe'));
    s+=K(3,P('M524 111 C 536 111, 536 141, 548 141','ln2 d d2')+P('M524 171 C 536 171, 536 141, 548 141','ln2 d d2')+T(470,236,'CA · EN-DC'));
    s+=K(4,P('M640 210 H690 M665 210 V188 M645 188 H685 M645 188 l-7 14 h14 z M685 188 l-7 14 h14 z','ln d d3')+T(665,236,'cân bằng'));
    s+=K(5,T(540,286,'PRB · bit/s/Hz · 5G-A'));
    return s+mv('M404 140 L440 111',2.2)+mv('M404 150 L440 141',2.6,.8);},
  rsh:()=>{let s=K(0,tower(520,110))+waves(520,108);[['Nhà mạng A',400],['Nhà mạng B',520],['Nhà mạng C',640]].forEach((o,i)=>{s+=K(i+1,box(o[1]-45,230,90,30,o[0]))+link([520,182],[o[1],230]);});return s+mv('M520 182 L400 230',2.6)+mv('M520 182 L640 230',2.9,1);},
  frame:()=>{let s='';const sl='DDDSU';for(let i=0;i<5;i++)s+=K(i,box(380+i*58,130,52,120,'',4)+T(406+i*58,270,sl[i]));
    let g='';for(let r=0;r<6;r++)g+=P(`M380 ${150+r*18} H666`,'ln s d d3');return s+g+T(520,118,'slot · ký hiệu · PRB');},
  prb:()=>{let s='';for(let r=0;r<5;r++)for(let c=0;c<8;c++){const on=(r*3+c*5)%7<3;s+=`<rect class="${on?'fl bar':'nd'} ${on?'f':'d'}" x="${380+c*34}" y="${120+r*30}" width="28" height="24" rx="3" style="${on?'opacity:.5':''}" ${on?'':'pathLength="1"'}/>`;}
    return K(0,s)+K(1,T(520,288,'UE1 · UE2 · UE3 · lập lịch'));},
  ca:()=>{let s='';[['CC1',60],['CC2',100],['CC3',80],['CC4',120]].forEach((c,i)=>{s+=K(i,`<rect class="bar fl f" x="${400+i*60}" y="${260-c[1]}" width="40" height="${c[1]}" rx="4" style="opacity:.5"/>`+T(420+i*60,280,c[0]));});return s+P('M390 260 H650','ln s d')+T(520,110,'5G-Advanced');},
  pn:()=>{let s=K(0,P('M380 250 V176 L420 146 L460 176 L500 146 L540 176 V250 Z','nd d')+T(460,272,'nhà máy · SNPN'));
    s+=K(1,[[410,206],[460,196],[510,206]].map(([x,y])=>`<circle class="fl f" cx="${x}" cy="${y}" r="5"/>`).join('')+waves(460,194));
    s+=K(2,`<circle class="nd d" cx="600" cy="110" r="22" pathLength="1"/>`+P('M600 110 V94 M600 110 L612 116','ln2 d d2')+T(600,150,'URLLC 1 ms'));
    s+=K(3,P('M560 186 H640 M560 180 v12 M640 180 v12','ln d d2')+T(600,176,'TSN · gPTP'));
    s+=K(4,P('M585 252 v-24 l20 -16 l20 16 v24 z M600 252 v-12 h10 v12','nd d d3')+T(605,272,'FWA'));
    s+=K(5,T(470,300,'CAG · 5G LAN · ngành'));
    return s+mv('M460 196 L600 110',2.4)+mv('M510 206 L605 236',2.8,.9);},
  nsl:()=>{let s='';[['eMBB',112],['URLLC',152],['mMTC',192]].forEach((r,i)=>{s+=box(380,r[1],170,28,r[0]);});s=K(0,s);
    s+=K(1,P('M560 126 H660 M560 166 H660 M560 206 H660','ln2 d d2')+T(610,118,'5QI · QFI'));
    let b='';[[380,90],[470,50],[520,30]].forEach((r,i)=>{b+=`<rect class="fl f" x="${r[0]}" y="246" width="${r[1]}" height="14" rx="3" style="opacity:${.3+i*.2}"/>`;});s+=K(2,b+T(470,280,'PRB theo slice'));
    s+=K(3,box(590,236,74,28,'PCF · URSP'));
    s+=K(4,`<circle class="nd d" cx="420" cy="84" r="16" pathLength="1"/>`+T(420,89,'CHF'));
    s+=K(5,T(560,90,'SLA · KPI slice'));
    return s+mv('M380 126 H660',2.4)+mv('M380 206 H660',3,.8);},
  udm:()=>{let s=K(0,box(420,110,110,40,'UDM')+T(475,166,'ARPF · SIDF'));
    s+=K(1,node(350,130,17,'AMF')+node(615,94,19,'AUSF')+link([367,130],[420,130])+link([597,100],[530,122])+T(475,92,'Nudm · Nausf'));
    s+=K(2,P('M430 222 a45 10 0 1 0 90 0 a45 10 0 1 0 -90 0 M430 222 V258 a45 10 0 0 0 90 0 V222','nd d')+T(475,250,'UDR')+link([475,150],[475,212]));
    s+=K(3,P('M585 228 a32 8 0 1 0 64 0 a32 8 0 1 0 -64 0 M585 228 V256 a32 8 0 0 0 64 0 V228','nd d d2')+P('M522 240 H583','ln2 d d3')+T(617,284,'site B'));
    s+=K(4,box(326,222,70,28,'HSS')+link([396,236],[430,236])+T(361,270,'S6a · Cx'));
    s+=K(5,T(480,318,'UECM · SDM · tải UDR'));
    return s+mv('M350 130 L420 130 L475 150 L475 222',3)+mv('M615 94 L530 120',2.4,.8)+mv('M522 240 H583',1.8,.4);},
  beam:()=>{let s=K(0,box(380,150,40,90,'',4)+P('M390 160 v70 M400 160 v70 M410 160 v70','ln s d d2'));
    [-22,0,22].forEach((a,i)=>{s+=K(i+1,`<path class="beam${i===1?'':' b2'}" d="M420 195 L640 ${195+a*4-40} A60 60 0 0 1 640 ${195+a*4+40} Z" style="transform-origin:420px 195px"/>`);});return s+K(4,phone(640,195));},
  es:()=>{let s=K(0,tower(440,110))+K(1,P('M560 120 a30 30 0 1 0 30 40 a24 24 0 0 1 -30 -40 z','nd d')+T(575,190,'ngủ cell'));
    s+=K(2,box(530,220,80,34,'',6)+`<rect class="fl f glw" x="536" y="226" width="40" height="22" rx="3"/>`+P('M610 230 v14','ln d'));return s+K(3,P('M420 260 c 20 -40 60 -40 70 -10 c -30 0 -50 10 -70 10 z','nd d d2'));},
  vo:()=>{let s=K(0,phone(420,190,40,72))+K(1,P('M450 160 a20 20 0 0 1 0 30 M460 150 a34 34 0 0 1 0 50','ln d d2'));
    s+=K(2,P('M490 190 L505 190 L512 160 L520 220 L528 150 L536 230 L544 175 L552 205 L560 190 L640 190','ln2 d d3')+T(565,240,'VoLTE · AMR-WB · EVS'));return s;},
  sv:()=>{let s=K(0,phone(420,190,46,80));[['Video',500,130],['Game',580,130],['Web',500,210],['IoT',580,210]].forEach((a,i)=>{s+=K(i+1,box(a[1]-30,a[2]-22,60,44,a[0],10));});return s+mv('M443 190 L500 130',2)+mv('M443 190 L580 210',2.4,.8);},
  sig:()=>{let s='';[['UE',400],['gNB',480],['AMF',560],['SMF',640]].forEach((l,i)=>{s+=K(i,T(l[1],116,l[0])+P(`M${l[1]} 124 V280`,'ln s d d2'));});
    [[400,480,150],[480,560,180],[560,640,210],[640,560,240],[480,400,268]].forEach((m,i)=>{s+=P(`M${m[0]} ${m[2]} L${m[1]} ${m[2]} M${m[1]-(m[1]>m[0]?8:-8)} ${m[2]-4} L${m[1]} ${m[2]} L${m[1]-(m[1]>m[0]?8:-8)} ${m[2]+4}`,'ln d d'+(1+i%3));});return s;},
  pr:()=>{let s='';['Ứng dụng','TCP/UDP · IP','PDCP · SDAP','RLC · MAC','PHY'].forEach((l,i)=>{s+=K(i,box(430,108+i*36,180,30,l,5));});return s+mv('M640 110 L640 280',3);},
  stack:()=>{let s='';['RRC/SDAP','PDCP','RLC','MAC','PHY'].forEach((l,i)=>{s+=K(i,box(390,108+i*34,110,28,l,5));});
    s+=K(5,P('M500 250 C 560 250, 560 180, 620 180','ln2 d d3')+box(620,160,50,40,'RU',6)+T(560,240,'eCPRI'));return s+`<path class="fib" d="M500 250 C 560 250, 560 180, 620 180" pathLength="134"/>`;},
  sc:()=>{let s=K(0,`<g class="shd">`+P('M520 100 l50 18 v42 c0 32 -22 52 -50 64 c-28 -12 -50 -32 -50 -64 v-42 z','nd d')+`<rect class="fl f" x="505" y="150" width="30" height="24" rx="3"/>`+P('M510 150 v-10 a10 10 0 0 1 20 0 v10','ln d d2')+`</g>`);
    s+=K(1,P('M390 200 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M418 200 H460 M448 200 v10 M456 200 v8','ln d d2')+T(420,236,'AKA'));
    s+=K(2,T(620,150,'SEPP'));s+=K(3,T(630,200,'IPsec'));s+=K(4,T(610,250,'NESAS'));s+=K(5,T(430,280,'5G-AKA · SUCI · NEA/NIA'));return s;},
  tx:()=>{let s='';const f=['M370 150 C 440 110, 500 190, 680 140','M370 190 C 450 160, 520 230, 680 190','M370 230 C 460 200, 510 270, 680 240'];
    f.forEach((d,i)=>{s+=K(i,P(d,'ln s d d'+(i+1))+`<path class="fib${i?' f'+(i+1):''}" d="${d}" pathLength="134"/>`);});
    return s+K(3,P('M600 90 a26 26 0 0 1 0 40 M600 90 v40 M600 110 h20 M620 110 v60','ln d d2')+T(600,84,'viba'))+T(470,286,'IP/MPLS · SRv6 · OTN');},
  leo:()=>{let s=K(0,tower(400,150,0.9)+box(436,206,34,12,'',2)+T(420,252,'trạm + terminal'));
    s+=K(1,P('M370 112 Q 520 36 690 112','ln s d d2')+node(520,74,7,'')+node(450,90,5,'')+node(600,88,5,''));
    s+=K(2,link([453,206],[520,81])+link([520,81],[600,198])+P('M588 206 a12 12 0 0 1 24 0 z','nd d')+T(600,226,'gateway')+T(612,160,'IPsec · SCTP','start'));
    s+=K(3,`<rect class="bar fl f" x="380" y="292" width="16" height="36" rx="2" style="opacity:.55"/><rect class="bar fl f" x="402" y="278" width="16" height="50" rx="2" style="opacity:.55"/><rect class="bar fl f" x="424" y="300" width="16" height="28" rx="2" style="opacity:.55"/>`);
    s+=K(4,box(560,262,110,56,'',6)+P('M570 306 l18 -14 l14 8 l20 -20 l16 10 l20 -8','ln2 d d3')+T(615,280,'SLA · RCA'));
    s+=K(5,T(500,356,'SCTP · DPD · MTU · TWAMP'));
    return s+mv('M453 206 L520 81 L600 198',2.6)+mv('M600 198 L520 81 L453 206',3.2,1.1);},
  fw:()=>{let s='';for(let r=0;r<5;r++)for(let c=0;c<3;c++)s+=`<rect class="nd d d${1+(r+c)%3}" x="${500+c*28+(r%2)*14}" y="${120+r*28}" width="26" height="24" rx="2" pathLength="1"/>`;
    s=K(0,s);s+=K(1,P('M380 160 H495','ln2 d')+T(430,150,'cho phép'))+K(2,P('M380 230 H492 M480 220 l12 10 l-12 10','ln d d2')+T(430,250,'chặn'));
    return s+K(3,P('M600 160 H680','ln2 d d3'))+mv('M380 160 L680 160',3)+mv('M380 230 L492 230',2,.6);},
  kpi:()=>{let s=P('M385 260 H600 M385 260 V120','ln s d');const hs=[50,80,62,104,88,120];hs.forEach((h,i)=>{s+=K(i,`<rect class="bar fl f" x="${400+i*32}" y="${260-h}" width="22" height="${h}" rx="3" style="opacity:.55"/>`);});
    return s+`<polyline class="trend" points="395,230 427,200 459,212 491,160 523,175 555,136 590,118" pathLength="1"/>`+K(6,P('M610 240 a36 36 0 0 1 72 0','ln d d2')+`<line class="ln ndl" x1="646" y1="240" x2="646" y2="212"/>`);},
  al:()=>{let s=K(0,P('M440 120 c-24 0 -34 20 -34 44 v26 l-10 14 h88 l-10 -14 v-26 c0 -24 -10 -44 -34 -44 z M432 210 a8 8 0 0 0 16 0','nd d')+`<circle class="fl glw" cx="462" cy="128" r="6"/>`);
    s+=K(1,P('M540 120 L580 190 H500 Z M540 145 v22 M540 176 v4','ln d d2'));s+=K(2,P('M380 250 H680','ln s d d3')+[420,480,560,640].map((x,i)=>`<circle class="${i===2?'fl glw':'nd d'}" cx="${x}" cy="250" r="6" pathLength="1"/>`).join(''));
    return s+T(530,280,'cảnh báo → sự cố → RCA');},
  ml:()=>{const L=[[400,[140,190,240]],[480,[120,165,210,255]],[560,[140,190,240]],[640,[190]]];let s='';
    for(let i=0;i<3;i++)L[i][1].forEach(y=>L[i+1][1].forEach(y2=>{s+=P(`M${L[i][0]} ${y} L${L[i+1][0]} ${y2}`,'ln s d d'+(i+1));}));
    L.forEach((l,i)=>{s+=K(i,l[1].map(y=>`<circle class="nd d" cx="${l[0]}" cy="${y}" r="10" pathLength="1"/>`).join(''));});return s+mv('M400 190 L480 165 L560 190 L640 190',2.6);},
  vendor:()=>{let s='';['Huawei','Nokia','Ericsson'].forEach((v,i)=>{s+=K(i,box(390+i*95,110,80,150,'',8)+T(430+i*95,132,v)+P(`M${410+i*95} ${170} l8 8 l16 -16 M${410+i*95} ${210} l8 8 l16 -16`,'ln2 d d2'));});return s;},
  book:()=>{let s=K(0,P('M420 250 C 460 236, 490 236, 510 250 V146 C 490 132, 460 132, 420 146 Z','nd d'))+K(1,P('M510 250 C 530 236, 560 236, 600 250 V146 C 560 132, 530 132, 510 146 Z','nd d d2'));
    s+=`<path class="nd pg" d="M510 146 C 530 134, 552 134, 580 144 V240 C 552 230, 530 230, 510 242 Z" style="opacity:.7"/>`;
    [0,1,2,3].forEach(i=>{s+=P(`M435 ${166+i*18} C 455 ${160+i*18}, 480 ${160+i*18}, 498 ${166+i*18}`,'ln s d d'+(1+i%3));});return s+K(2,T(510,286,'3GPP · ITU · GSMA · RFC'));}
  };
  /* ---- màu theo nhóm + lệch theo thẻ ---- */
  const GH=[205,190,216,228,178,200];
  function tabInfo(){const t=S.tab,b=document.querySelector(`#tabs [data-tab="${t}"]`),gs=[...document.querySelectorAll('#tabs .tgrp')],g=b?b.closest('.tgrp'):null;
    const gi=Math.max(0,gs.indexOf(g)),its=g?[...g.querySelectorAll('[data-tab]')]:[],ti=Math.max(0,its.findIndex(x=>x.dataset.tab===t));
    return {t,gi:Math.min(gi,5),ti,n:its.length,name:b?b.textContent.trim():t,grp:g?g.querySelector('.tgn').textContent.trim():''};}
  /* ---- mục con đang chọn: tên và chỉ số ---- */
  function subInfo(t){const sec=document.getElementById('t-'+t);if(!sec)return {l:'',i:0};
    const clean=s=>s.replace(/\s+/g,' ').trim();
    let b=sec.querySelector('.u3navp [aria-pressed="true"]');
    if(b){const sibs=[...b.parentElement.children],i=sibs.indexOf(b),num=b.querySelector('.ndn');let l=clean(num?b.textContent.replace(num.textContent,''):b.textContent);l=(i+1)+' · '+l;
      const sub=sec.querySelector('.rxsub [aria-pressed="true"]');if(sub&&t==='ro')l+=' › '+clean(sub.textContent);return {l,i};}
    if(t==='e2'){const sel=sec.querySelector('select'),tk=sec.querySelector('.seg [aria-pressed="true"]');if(sel&&sel.selectedIndex>=0)return {l:clean(sel.options[sel.selectedIndex].text)+(tk?' · '+clean(tk.textContent):''),i:sel.selectedIndex};}
    if(t==='kpi'&&typeof KP!=='undefined'&&KP.sel&&typeof KL!=='undefined'){const k=KL.find(x=>x.id===KP.sel);if(k)return {l:k.nm,i:KL.indexOf(k)};}
    if(t==='ml'){const z=sec.querySelector('.mlzs [aria-pressed="true"],.mlzs .on');if(z){return {l:clean(z.textContent),i:[...z.parentElement.children].indexOf(z)};}}
    const sel=[...sec.querySelectorAll('select')].find(s=>s.dataset.k!=='sgSpeed'&&s.options.length>1);
    if(sel&&sel.selectedIndex>=0)return {l:clean(sel.options[sel.selectedIndex].text),i:sel.selectedIndex};
    const p=sec.querySelector('.seg [aria-pressed="true"]');if(p)return {l:clean(p.textContent),i:[...p.parentElement.children].indexOf(p)};
    return {l:'',i:0};}
  let curT='',curSub='';
  function colors(I){const dark=document.documentElement.dataset.theme==='dark';const h=GH[I.gi]+(I.n>1?Math.round((I.ti/(I.n-1)-0.5)*16):0);
    const r=document.documentElement.style;r.setProperty('--th',h);
    const fx=document.querySelector('header.top .hero-fx');if(fx){fx.style.setProperty('--gfx',dark?`hsl(${h} 88% 62%)`:`hsl(${h} 86% 34%)`);fx.style.setProperty('--gfx2',dark?`hsl(${h+8} 90% 76%)`:`hsl(${h+8} 80% 46%)`);}}
  function label(I,sub){let el=document.querySelector('header.top .gxlab');const top=document.querySelector('header.top');if(!top)return;
    if(!el){el=document.createElement('div');el.className='gxlab';el.setAttribute('aria-live','polite');top.appendChild(el);}
    const l2=sub.l||I.grp;el.innerHTML=`<b>${E(I.name)}</b><span>${E(l2)}</span>`;el.title=I.grp+' › '+I.name+(sub.l?' › '+sub.l:'');}
  function hl(sub){const sv=document.querySelector('header.top .hero-fx svg.gxs:not(.out)');if(!sv)return;const ps=[...sv.querySelectorAll('.gpt')];if(!ps.length)return;
    const ks=[...new Set(ps.map(p=>p.dataset.k))],k=ks[((sub.i%ks.length)+ks.length)%ks.length];ps.forEach(p=>p.classList.toggle('hl',p.dataset.k===k));sv.classList.add('hashl');}
  function scene(I,anim){const fx=document.querySelector('header.top .hero-fx');if(!fx)return;fx.dataset.g=I.gi;fx.dataset.t=I.t;
    const old=[...fx.querySelectorAll('svg')];const nv=document.createElementNS('http://www.w3.org/2000/svg','svg');nv.setAttribute('viewBox','300 50 420 330');nv.setAttribute('preserveAspectRatio','xMaxYMid meet');
    nv.setAttribute('class','gxs gxt'+(anim&&!reduced()?' in':''));nv.innerHTML=rings+(SC[I.t]||SC.book)();
    if(!anim||reduced())nv.querySelectorAll('.d,.f').forEach(e=>e.style.animationDuration='0s');
    fx.appendChild(nv);old.forEach(o=>{if(!anim||reduced()){o.remove();return;}o.classList.add('gxs','out');setTimeout(()=>o.remove(),460);});}
  function update(anim){try{const I=tabInfo(),sub=subInfo(I.t);
    if(I.t!==curT){curT=I.t;colors(I);scene(I,anim);}
    const key=sub.l+'|'+sub.i;if(key!==curSub||anim===false){curSub=key;}label(I,sub);hl(sub);}catch(e){console.error('gxTab',e);}}
  function hook(){if(typeof setState!=='function')return;const _s=setState;setState=function(){const r=_s.apply(this,arguments);setTimeout(()=>update(true),0);return r;};}
  let tm=0;const later=()=>{clearTimeout(tm);tm=setTimeout(()=>update(true),60);};
  document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('main, .mnu, #tabs'))later();},true);
  document.addEventListener('change',e=>{if(e.target.closest&&e.target.closest('main'))later();},true);document.addEventListener('input',e=>{if(e.target.closest&&e.target.closest('main')&&e.target.tagName==='SELECT')later();},true);
  new MutationObserver(()=>{if(!curT)return;const I=tabInfo();colors(I);}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  function init(){if(!document.querySelector('.gx-tint')){const d=document.createElement('div');d.className='gx-tint';d.setAttribute('aria-hidden','true');document.body.prepend(d);}/* tắt bộ đổi theo nhóm cũ nếu có */hook();update(false);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.gxTabUpdate=update;
})();

