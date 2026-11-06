
/* ===== Thẻ Tối ưu vô tuyến (ro) — đợt 3 lộ trình (BRIEF 15) ===== */
const RXS={v:'tdd',raf:0,last:0,pause:false};
const RXV=[['tdd','Nhiễu TDD: nhiễu xa, CLI, đồng bộ'],['ul','Nhiễu UL: PIM, nhiễu ngoài, noise floor'],['pc','Điều khiển công suất PUSCH/PUCCH, PHR'],['rach','RACH/PRACH và timing advance'],['pci','Quy hoạch PCI/RSI, tilt, chồng lấn'],['vd','Tham số, KPI, lỗi']];
const RXR={};   /* mỗi mục: html(), after(), tick(dt), upd(k), act(a,el) */
const RXP={};   /* tham số điều khiển */
const RXF={};   /* hàm hiển thị giá trị thanh trượt */
const rxC=299792.458;           /* km/s */
const rxTc=1/(480000*4096);     /* đơn vị thời gian cơ bản NR (s), TS 38.211 §4.1 */
const rxK=64;                   /* κ = Ts/Tc */
/* điều khiển: data-rxi="mục:khoá" */
function rSl(vw,k,l,mn,mx,st,f,hint,pk){RXF[vw+':'+k]=f;const v=RXP[vw][k];
  return `<label class="c"><span class="cl">${l}<output>${f(v)}</output></span><input type="range" data-rxi="${vw}:${k}" min="${mn}" max="${mx}" step="${st}" value="${v}">${hint?`<span class="u3ph">${hint}</span>`:''}${pk?rPnTag(pk):''}</label>`;}
function rSel(vw,k,l,opts,hint,pk){const v=RXP[vw][k];
  return `<label class="c"><span class="cl">${l}</span><select data-rxi="${vw}:${k}">${opts.map(o=>`<option value="${o[0]}"${String(o[0])===String(v)?' selected':''}>${nE(o[1])}</option>`).join('')}</select>${hint?`<span class="u3ph">${hint}</span>`:''}${pk?rPnTag(pk):''}</label>`;}
function rChk(vw,k,l){return `<label class="u3ck"><input type="checkbox" data-rxi="${vw}:${k}"${RXP[vw][k]?' checked':''}> ${l}</label>`;}
function rPn(key){const r=(typeof RXPAR!=='undefined'?RXPAR:[]).find(x=>x[0]===key);if(!r)return'';const v=nVn();if(v==='3gpp')return'';
  return nVName(v)+': '+r[{huawei:3,nokia:4,ericsson:5}[v]]+(r[7]==='v'?' (cần đối chiếu)':'');}
function rPnTag(key){const t=rPn(key);return t?`<span class="vh ndvh">${nE(t)}</span>`:'';}
const rKv=(a,b)=>`<dt>${a}</dt><dd>${b}</dd>`;
const rUl=a=>`<ul class="u3ul">${a.map(x=>`<li>${nE(x)}</li>`).join('')}</ul>`;
/* phân vị */
function rPct(a,p){if(!a.length)return 0;const b=a.slice().sort((x,y)=>x-y),i=nC((b.length-1)*p,0,b.length-1),lo=Math.floor(i),hi=Math.ceil(i);return b[lo]+(b[hi]-b[lo])*(i-lo);}
/* hệ số tương quan Pearson */
function rCorr(a,b){const n=Math.min(a.length,b.length);if(n<3)return 0;let ma=0,mb=0;for(let i=0;i<n;i++){ma+=a[i];mb+=b[i];}ma/=n;mb/=n;let sab=0,saa=0,sbb=0;for(let i=0;i<n;i++){const x=a[i]-ma,y=b[i]-mb;sab+=x*y;saa+=x*x;sbb+=y*y;}return saa&&sbb?sab/Math.sqrt(saa*sbb):0;}
/* suy hao */
const rFspl=(dkm,fGHz)=>92.45+20*Math.log10(Math.max(dkm,1e-3))+20*Math.log10(fGHz);
const rUma=(dm,fGHz)=>13.54+39.08*Math.log10(Math.max(dm,20))+20*Math.log10(fGHz);  /* TR 38.901 UMa NLOS rút gọn (h_UE 1,5 m) */
/* giản đồ anten 3 sector theo TR 38.901 §7.3 (AH, AV, Am = 30 dB) */
function rAnt(phiDeg,thetaDeg,tilt,bwH,bwV){const AH=-Math.min(12*Math.pow(phiDeg/(bwH||65),2),30),AV=-Math.min(12*Math.pow((thetaDeg-tilt)/(bwV||10),2),30);return -Math.min(-(AH+AV),30);}
const rAng=a=>{a=((a%360)+540)%360-180;return a;};
/* nhật ký: dùng nLog của thẻ nd */
function rLog(list,n){const ms=(list||[]).slice(-(n||14));return nLog(ms,ms.length-1);}
/* liên kết sang thẻ khác */
const RXLK={
  tdd:{e2:[['reg','sa'],['data','sa'],['data','g4']],kpi:['r_rim','ulint4','r_ulint5','rach5']},
  ul:{e2:[['data','sa'],['mo','g4'],['data','g3']],kpi:['r_ulint5','ulint4','u_rtwp','g_icm','tputul5']},
  pc:{e2:[['data','sa'],['mo','sa'],['data','g4']],kpi:['r_phr','tputul5','tputul4','bler4','cqi5']},
  rach:{e2:[['reg','sa'],['reg','g4'],['mt','sa']],kpi:['rach5','rach4','r_ta','g_ta']},
  pci:{e2:[['ho','sa'],['idle','sa'],['ho','g4']],kpi:['r_pci','hosr5','hosr4','cqi5','r_ta']},
  vd:{e2:[['reg','sa'],['data','sa'],['ho','sa'],['idle','g4']],kpi:[]}
};
const RXT={g3:'3G',g4:'4G',nsa:'5G NSA',sa:'5G SA'};
function rxLinks(){
  const L=RXLK[RXS.v]||{e2:[],kpi:[]},hasE2=typeof E2S!=='undefined',hasK=typeof KL!=='undefined';
  const e2=hasE2?L.e2.map(([id,tk])=>{const s=E2S.find(x=>x.id===id);return s&&s.f&&s.f[tk]?[s,tk]:null;}).filter(Boolean):[];
  const kp=hasK?L.kpi.map(id=>KL.find(k=>k.id===id)).filter(Boolean):[];
  return `<div class="panel u3lk"><h3>Xem tiếp ở thẻ khác</h3>
  ${e2.length?`<p class="e2x"><b>Luồng ở thẻ Toàn trình E2E</b> (mở sẵn đúng công nghệ):</p><div class="e2go">${e2.map(([s,tk])=>`<button type="button" class="btn sm" data-rxgo="e2:${s.id}:${tk}">${nE(s.n)} · ${RXT[tk]} →</button>`).join('')}</div>`:''}
  ${kp.length?`<p class="e2x" style="margin-top:10px"><b>KPI liên quan ở thẻ KPI mạng</b> (công thức, bộ đếm ba vendor):</p><div class="e2go">${kp.map(k=>`<button type="button" class="btn sm" data-rxgo="kpi:${k.id}">${nE(k.nm)} →</button>`).join('')}</div>`:''}
  <p class="e2x" style="margin-top:10px"><b>Thẻ liên quan:</b></p><div class="e2go"><button type="button" class="btn sm" data-tab="radio">Phủ sóng và di động →</button><button type="button" class="btn sm" data-tab="frame">Khung và lưới tài nguyên →</button><button type="button" class="btn sm" data-tab="beam">Búp sóng 3D →</button><button type="button" class="btn sm" data-tab="prb">Cấp phát PRB →</button><button type="button" class="btn sm" data-tab="u3">Mạng 3G UTRAN →</button></div>
  </div>`;
}
function rxNav(){return `<div class="seg u3seg ndseg rxseg" role="group" aria-label="Mục của thẻ Tối ưu vô tuyến">${RXV.map((v,i)=>`<button type="button" data-rxv="${v[0]}" aria-pressed="${v[0]===RXS.v}"><span class="ndn">${i+1}</span>${v[1]}</button>`).join('')}</div>`;}
function renderRx(){
  const nav=$('#rxNav'),body=$('#rxBody');if(!nav||!body)return;
  if(!RXR[RXS.v])RXS.v='tdd';
  nav.innerHTML=rxNav();
  const V=RXR[RXS.v];body.innerHTML=V.html()+rxLinks();
  if(V.after)V.after();
  if(S.tab==='ro'&&!nReduced())rxStart();else{rxStop();if(V.tick&&S.tab==='ro')V.tick(0);}
}
function rxStart(){if(RXS.raf)return;RXS.last=performance.now();RXS.raf=requestAnimationFrame(rxLoop);}
function rxStop(){if(RXS.raf)cancelAnimationFrame(RXS.raf);RXS.raf=0;}
function rxLoop(now){
  RXS.raf=0;if(S.tab!=='ro')return;
  if(document.hidden){RXS.last=now;RXS.raf=requestAnimationFrame(rxLoop);return;}
  const dt=Math.max(0,Math.min(0.1,(now-RXS.last)/1000));RXS.last=now;
  const V=RXR[RXS.v];if(V&&V.tick){try{V.tick(dt);}catch(e){console.error(e);}}
  RXS.raf=requestAnimationFrame(rxLoop);
}
function rxPlayBtn(vw,id){return `<button type="button" class="btn sm" data-rxa="${vw}:play" id="${id}">${RXS.pause?'▶ Chạy':'⏸ Dừng'}</button>`;}
function rxPlayTog(id){RXS.pause=!RXS.pause;const b=$('#'+id);if(b)b.textContent=RXS.pause?'▶ Chạy':'⏸ Dừng';}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-rxgo]');
  if(g){const [t,id,tk]=g.dataset.rxgo.split(':');
    try{tourStop();}catch(x){}try{stopSig();}catch(x){}
    const top=()=>window.scrollTo({top:Math.min(window.scrollY,$('main').offsetTop-$('.bar').offsetHeight)});
    if(t==='e2'){try{e2Stop();}catch(x){}S.e2Sc=id;S.e2R=tk||'sa';S.e2M=S.mode;if(typeof E2A!=='undefined'){E2A.key='';E2A.i=0;}S.tab='e2';renderAll();top();}
    else if(t==='kpi'){S.tab='kpi';KP.tech='all';KP.ly='all';KP.cat='all';KP.q='';KP.node='';KP.sel=id;kpSig='';renderAll();setTimeout(()=>{const d=$('#kpDet');if(d)d.scrollIntoView({block:'start',behavior:'smooth'});},60);}
    else if(t==='rx'){S.tab='ro';if(id&&RXR[id])RXS.v=id;renderAll();top();}
    return;}
  const t=e.target.closest('#t-ro [data-rxv],#t-ro [data-rxa]');if(!t)return;
  if(t.dataset.rxv){if(t.dataset.rxv===RXS.v)return;RXS.v=t.dataset.rxv;rxStop();renderRx();return;}
  const [vw,a,x]=t.dataset.rxa.split(':');const V=RXR[vw];if(V&&V.act)V.act(a,t,x);
});
function rxInp(el){const [vw,k]=el.dataset.rxi.split(':');const P=RXP[vw];if(!P)return;
  P[k]=el.type==='checkbox'?el.checked:(el.tagName==='SELECT'&&isNaN(+el.value)?el.value:+el.value);
  const o=el.parentElement.querySelector('output');if(o&&RXF[vw+':'+k])o.textContent=RXF[vw+':'+k](P[k]);
  const V=RXR[vw];if(V&&V.upd)V.upd(k);}
document.addEventListener('input',e=>{const el=e.target;if(!el.dataset||!el.dataset.rxi||el.type!=='range')return;rxInp(el);});
document.addEventListener('change',e=>{const el=e.target;if(!el.dataset||!el.dataset.rxi||el.type==='range')return;rxInp(el);});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest&&e.target.closest('#t-ro [data-rxa]')&&e.target.tagName!=='BUTTON'){e.preventDefault();e.target.closest('[data-rxa]').dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
/* chọn chế độ con trong một mục (data-rxa="mục:sub:giá trị") */
function rSub(vw,k,opts){const v=RXP[vw][k];return `<div class="seg rxsub" role="group">${opts.map(o=>`<button type="button" data-rxa="${vw}:sub:${o[0]}" aria-pressed="${o[0]===v}">${nE(o[1])}</button>`).join('')}</div>`;}

/* ---------- Mục 1: Nhiễu TDD — nhiễu xa/ducting (RIM-RS, back-off), nhiễu chéo CLI, lệch đồng bộ ---------- */
RXP.tdd={sub:'duct',pat:'DDDSU',gp:2,dist:150,spr:100,nAg:40,pw:46,load:60,tilt:6,season:1,rim:'fw1',rimThr:6,rimBack:0,back:0,bpw:0,hour:2,play:30,
  pA:'DDDSU',pB:'DSUUU',isd:500,dUe:60,pUe:23,rsrp:-95,cliMit:'none',
  off:0,osc:'ocxo',hLoss:0,isd2:1.5,gnss:true};
/* các cấu hình khung 30 kHz (slot 0,5 ms, 14 ký hiệu); ô S là nD:nG:nU */
const RXPAT={
  DDDSU:{n:'DDDSU · 2,5 ms (S 10:2:2)',sl:'DDDSU',uS:2,gp:2},
  DDDDDDDSUU:{n:'DDDDDDDSUU · 5 ms (S 6:4:4)',sl:'DDDDDDDSUU',uS:4,gp:4},
  DDDSUDDSUU:{n:'DDDSUDDSUU · 5 ms (S 10:2:2)',sl:'DDDSUDDSUU',uS:2,gp:2},
  DSUUU:{n:'DSUUU · 2,5 ms, nặng UL (S 4:2:8)',sl:'DSUUU',uS:8,gp:2},
  DDSUU:{n:'DDSUU · 2,5 ms (S 10:2:2)',sl:'DDSUU',uS:2,gp:2}
};
const RX_TS=500/14;   /* độ dài ký hiệu trung bình (µs) ở 30 kHz */
/* mảng ký hiệu một chu kỳ: 'D','G','U' */
function rxFrame(pat,gp,back){const P=RXPAT[pat],sy=[];gp=gp==null?P.gp:gp;const uS=Math.min(P.uS,14-gp-1),dS=14-gp-uS;
  for(const c of P.sl){if(c==='S'){for(let i=0;i<dS;i++)sy.push('D');for(let i=0;i<gp;i++)sy.push('G');for(let i=0;i<uS;i++)sy.push('U');}else for(let i=0;i<14;i++)sy.push(c);}
  /* back-off phía gây nhiễu: tắt b ký hiệu DL cuối trước khoảng bảo vệ */
  if(back){const n=sy.length,ends=[];for(let i=0;i<n;i++)if(sy[i]==='D'&&sy[(i+1)%n]==='G')ends.push(i);
    ends.forEach(i=>{let b=back,j=i;while(b>0&&sy[(j+n)%n]==='D'){sy[(j+n)%n]='M';b--;j--;}});}
  return sy;}
/* mức 1 µs: mặt nạ DL của bên gây nhiễu */
function rxMask(sy){const T=Math.round(sy.length*RX_TS),m=new Float32Array(T);for(let s=0;s<T;s++){const k=Math.min(sy.length-1,Math.floor(s/RX_TS));m[s]=sy[k]==='D'?1:0;}return m;}
/* hệ số ống dẫn theo giờ (mạnh nhất lúc ~4 giờ sáng) */
const rxDuct=(h,season)=>season*Math.pow(Math.max(0,Math.cos(2*Math.PI*(h-4)/24)),2);
const rxN=(nf,scs)=>-174+10*Math.log10(12*(scs||30)*1e3)+(nf==null?3.5:nf);
/* danh sách gNB gây nhiễu: khoảng cách (km), cố định theo tham số */
function rxAggs(P){const r=nRng(91+P.nAg),a=[];for(let i=0;i<P.nAg;i++)a.push(Math.max(30,P.dist+(r()-0.5)*P.spr));return a.sort((x,y)=>x-y);}
/* IoT theo từng ký hiệu UL của nạn nhân */
function rxDuctIoT(P,h,back,bpw){const vs=rxFrame(P.pat,P.gp,0),as=rxFrame(P.pat,P.gp,back),m=rxMask(as),T=m.length,N=rxN(),s=rxDuct(h,P.season);
  const g=17-12*Math.pow(P.tilt/10,2),eirp=P.pw-10*Math.log10(273)+g-(bpw||0)+10*Math.log10(Math.max(P.load,1)/100);
  const ag=rxAggs(P),ul=[];vs.forEach((c,k)=>{if(c==='U')ul.push(k);});
  const I=ul.map(()=>0);let pmax=-999;
  ag.forEach(d=>{const L=rFspl(d,3.5)+0.03*d+(1-s)*45,pr=eirp+g-L;pmax=Math.max(pmax,pr);const tau=Math.round(d/rxC*1e6),lin=nLin(pr);
    ul.forEach((k,j)=>{const a=Math.round(k*RX_TS),b=Math.round((k+1)*RX_TS);let o=0;for(let x=a;x<b;x++)o+=m[((x-tau)%T+T)%T];I[j]+=lin*o/(b-a);});});
  const iot=I.map(v=>nDb(nLin(N)+v)-N);
  return {ul,iot,vs,as,N,s,pmax,tmin:ag[0]/rxC*1e6,tmax:ag[ag.length-1]/rxC*1e6};}
/* số ký hiệu back-off khi có RIM: 0 = tự động theo trễ đo được từ RIM-RS */
function rxRimB(P){if(P.rimBack)return P.rimBack;const ag=rxAggs(P),tmax=ag[ag.length-1]/rxC*1e6,nd=rxFrame(P.pat,P.gp,0).filter(c=>c==='D').length;return Math.min(nd,Math.max(1,Math.ceil((tmax-P.gp*RX_TS)/RX_TS)+1));}
/* mô phỏng 24 h, bước 5 phút, có RIM framework 1/2 */
function rxDuctDay(){const P=RXP.tdd,st=288,R={h:[],iot1:[],iotm:[],mit:[],rs1:[],ev:[],msgs:[]};let mit=false,rs1=false,rs2=false,since=-1;
  const hm=h=>{const H=Math.floor(h),M=Math.round((h-H)*60);return String(H).padStart(2,'0')+':'+String(M===60?59:M).padStart(2,'0');};
  const lg=(h,p,m,a,d)=>R.msgs.push({tl:hm(h),h,p,m,a,d});
  for(let i=0;i<st;i++){const h=i*24/st;
    const manualB=P.rim==='off'?P.back:0,manualP=P.rim==='off'?P.bpw:0;
    const X=rxDuctIoT(P,h,mit?rxRimB(P):manualB,mit?3:manualP),mx=Math.max(...X.iot),mean=X.iot.reduce((a,b)=>a+b,0)/X.iot.length;
    R.h.push(h);R.iot1.push(X.iot[0]);R.iotm.push(mean);R.mit.push(mit);R.rs1.push(rs1);
    if(P.rim==='off')continue;
    /* RIM-RS: kênh thuận nghịch, gNB gây nhiễu nghe được RIM-RS khi đường ống đủ mạnh (≈ cùng điều kiện gây IoT) */
    const hear=X.pmax+10>X.N-6;
    if(!rs1&&mx>P.rimThr){rs1=true;since=h;lg(h,'RIM','Phát RIM-RS loại 1','gNB nạn nhân → tập gNB nghi gây nhiễu','IoT ký hiệu UL đầu '+nF(mx,1)+' dB > ngưỡng '+P.rimThr+' dB; mang set ID của nhóm nạn nhân, phát ở cuối vùng DL ngay trước khoảng bảo vệ');R.ev.push([h,'RS-1','var(--warn)']);}
    if(rs1&&hear&&!mit){mit=true;lg(h,'RIM','Phát hiện RIM-RS loại 1','tập gNB gây nhiễu','Độ trễ thu ≈ '+nF(X.tmin/1000,2)+'–'+nF(X.tmax/1000,2)+' ms ⇒ khoảng cách '+Math.round(P.dist-P.spr/2)+'–'+Math.round(P.dist+P.spr/2)+' km');
      lg(h,'OAM','Áp dụng back-off','gNB gây nhiễu','Tắt '+rxRimB(P)+' ký hiệu DL cuối (nới khoảng bảo vệ'+(P.rimBack?'':', số ký hiệu suy từ trễ RIM-RS')+') và giảm 3 dB công suất DL');
      if(P.rim==='fw1'){lg(h,'RIM','Phát RIM-RS loại 2','gNB gây nhiễu → gNB nạn nhân','Báo “ống dẫn còn tồn tại”; nạn nhân tiếp tục RS-1 khi còn nghe RS-2');}
      else{lg(h,'NGAP','Uplink RIM Information Transfer','gNB gây nhiễu → AMF','RIM-RS detection: detected; victim set ID');lg(h,'NGAP','Downlink RIM Information Transfer','AMF → gNB nạn nhân','qua backhaul, không cần RS-2 trên vô tuyến');}
      R.ev.push([h,'back-off','var(--nr)']);}
    if(mit&&!hear){mit=false;rs1=false;lg(h,'RIM','Không còn nghe RIM-RS loại 1','tập gNB gây nhiễu','Ống dẫn tan; dừng back-off, trả lại ký hiệu DL');
      if(P.rim==='fw1')lg(h,'RIM','Dừng RIM-RS loại 2','gNB gây nhiễu','nạn nhân không còn nghe RS-2 ⇒ dừng RS-1');else lg(h,'NGAP','Uplink/Downlink RIM Information Transfer','gNB gây nhiễu → AMF → nạn nhân','RIM-RS detection: disappeared');
      R.ev.push([h,'kết thúc','var(--up)']);}
    if(rs1&&!mit&&mx<P.rimThr-2&&!hear){rs1=false;}}
  return R;}
const RXTD={t:0,R:null,lastDraw:-1};
function rxTdFrameSvg(X){const sy=X.vs,n=sy.length,W=720,x0=70,w=(W-x0-10)/n,col={D:'var(--lte)',G:'var(--panel2)',U:'var(--nr)',M:'var(--muted)'};
  let h='',lb='';const row=(y,arr,lab,shift)=>{lb+=`<text x="4" y="${y+13}" class="u3x">${lab}</text>`;arr.forEach((c,k)=>{h+=`<rect x="${(x0+k*w+(shift||0)).toFixed(1)}" y="${y}" width="${Math.max(0.5,w-0.6).toFixed(1)}" height="18" style="fill:${col[c]};opacity:${c==='D'||c==='U'?.85:.6}"/>`;});};
  row(14,sy,'Nạn nhân');
  const sh1=X.tmin/RX_TS*w,sh2=X.tmax/RX_TS*w;
  h+=`<g class="rxclip">`;row(46,X.as,'DL tới, gần',sh1);row(72,X.as,'DL tới, xa',sh2);h+=`</g>`;
  /* cột IoT theo ký hiệu UL */
  const mx=Math.max(10,...X.iot);X.ul.forEach((k,j)=>{const v=X.iot[j],hh=v/mx*60;h+=`<rect x="${(x0+k*w).toFixed(1)}" y="${(164-hh).toFixed(1)}" width="${Math.max(0.5,w-0.6).toFixed(1)}" height="${hh.toFixed(1)}" style="fill:${v>6?'var(--warn)':v>3?'var(--k4)':'var(--nr)'}"/>`;});
  h+=`<line x1="${x0}" y1="164" x2="${W-10}" y2="164" class="u3grid"/><text x="4" y="150" class="u3x">IoT UL</text><text x="4" y="162" class="u3ax">0…${nF(mx,0)} dB</text>`;
  const ms=(n*RX_TS/1000);h+=`<text x="${x0}" y="186" class="u3ax">0</text><text x="${W-10}" y="186" class="u3ax" text-anchor="end">${nF(ms,1)} ms</text>`;
  return `<svg viewBox="0 0 ${W} 192" class="u3svg" role="img" aria-label="Khung TDD của nạn nhân và tín hiệu DL bên gây nhiễu tới trễ">${h}${lb}<defs><clipPath id="rxcp"><rect x="${x0}" y="0" width="${W-x0-10}" height="192"/></clipPath></defs></svg>`.replace('<g class="rxclip">','<g clip-path="url(#rxcp)">');}
function rxTdMap(X,ph){const W=720,H=170;let h=`<rect x="0" y="120" width="${W}" height="50" class="rxearth"/>`;
  const s=X.s,yD=60;h+=`<path d="M60 112 Q 360 ${yD-20} 660 112" class="rxduct" style="opacity:${0.15+0.75*s}"/>`;
  if(s>0.05){for(let i=0;i<6;i++){const u=((ph*0.25+i/6)%1),x=60+600*u,y=(1-u)*(1-u)*112+2*u*(1-u)*(yD-20)+u*u*112;h+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" class="rxwave" style="opacity:${s}"/>`;}}
  h+=`<rect x="44" y="84" width="10" height="34" class="ndbs n"/><text x="50" y="78" class="u3x" text-anchor="middle">nạn nhân</text>`;
  for(let i=0;i<5;i++){h+=`<rect x="${630+i*14}" y="${90+(i%2)*6}" width="8" height="${28-(i%2)*6}" class="ndbs l"/>`;}
  h+=`<text x="664" y="78" class="u3x" text-anchor="middle">${RXP.tdd.nAg} gNB gây nhiễu</text><text x="360" y="150" class="u3x" text-anchor="middle">${Math.round(RXP.tdd.dist)} km ± ${Math.round(RXP.tdd.spr/2)} km · trễ ${nF(X.tmin/1000,2)}–${nF(X.tmax/1000,2)} ms</text>`;
  h+=`<text x="360" y="${yD-8}" class="u3x" text-anchor="middle">${s>0.3?'Ống dẫn khí quyển (nghịch nhiệt) mạnh':s>0.05?'Ống dẫn yếu':'Không có ống dẫn'} · hệ số ${nF(s,2)}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="Sóng DL đi theo ống dẫn khí quyển tới trạm nạn nhân ở xa">${h}</svg>`;}
function rxTdPlot(){const R=RXTD.R,P=RXP.tdd,pts=a=>a.map((v,i)=>[R.h[i],v]);const bands=[];let b0=null;
  R.mit.forEach((m,i)=>{if(m&&b0==null)b0=R.h[i];if(!m&&b0!=null){bands.push([b0,R.h[i],'var(--nr)',.14]);b0=null;}});if(b0!=null)bands.push([b0,24,'var(--nr)',.14]);
  const mx=Math.max(12,...R.iot1)*1.05;
  return nPlot({w:680,h:220,x0:0,x1:24,y0:0,y1:mx,yt:[0,mx/4,mx/2,3*mx/4].map(v=>Math.round(v)),xt:[0,3,6,9,12,15,18,21,24],xf:v=>v+'h',series:[{pts:pts(R.iot1),c:'var(--warn)'},{pts:pts(R.iotm),c:'var(--k4)',dash:'4 3'}],
    hl:P.rim!=='off'?[[P.rimThr,'var(--warn)','ngưỡng RIM']]:[],bands,marks:R.ev.slice(0,10).map((e,i)=>[e[0],e[1],e[2],i%3]),cur:P.hour,ylab:'IoT (dB)',aria:'IoT theo giờ'});}
function rxTdOut(X){const P=RXP.tdd,mx=Math.max(...X.iot),bad=X.iot.filter(v=>v>3).length,sl=X.iot.length>1?X.iot[0]-X.iot[X.iot.length-1]:0;
  const lim=Math.max(0,Math.ceil((X.tmax-P.gp*RX_TS)/RX_TS));
  return rKv('Noise floor / PRB',nF(X.N,1)+' dBm')+rKv('Trễ truyền',nF(X.tmin/1000,2)+'–'+nF(X.tmax/1000,2)+' ms ('+Math.round(X.tmin/RX_TS)+'–'+Math.round(X.tmax/RX_TS)+' ký hiệu)')
   +rKv('Khoảng bảo vệ hiện có',P.gp+' ký hiệu = '+nF(P.gp*RX_TS/1000*1e3,0)+' µs ≈ '+nF(P.gp*RX_TS*rxC/1e6,1)+' km')
   +rKv('IoT lớn nhất / ký hiệu UL',nF(mx,1)+' dB')+rKv('Số ký hiệu UL bị nhiễu > 3 dB',bad+' / '+X.iot.length)+rKv('Độ dốc (đầu − cuối)',nF(sl,1)+' dB')
   +rKv('Back-off đủ để hết nhiễu',lim+' ký hiệu DL (với khoảng cách xa nhất)');}
function rxTdAdv(){const P=RXP.tdd,R=RXTD.R,o=[],mxDay=Math.max(...R.iot1),hrs=R.iot1.filter(v=>v>6).length*24/288;
  if(mxDay>6)o.push('Nhiễu xa vượt 6 dB khoảng '+nF(hrs,1)+' giờ/ngày, chủ yếu ban đêm và sáng sớm: dấu hiệu ống dẫn, không phải nhiễu ngoài 24/7.');
  if(P.rim==='off'&&mxDay>6)o.push('Bật RIM (framework 1 hoặc 2) để back-off tự động chỉ khi có ống dẫn, thay vì cắt ký hiệu DL cả ngày.');
  if(P.rim==='off'&&P.back>0){const fr=rxFrame(P.pat,P.gp,0),nd=fr.filter(c=>c==='D').length,nm=rxFrame(P.pat,P.gp,P.back).filter(c=>c==='M').length;o.push('Đang back-off cố định '+P.back+' ký hiệu: mất ≈ '+nF(nm/nd*100,1)+' % ký hiệu DL suốt ngày, kể cả khi không có ống dẫn.');}
  if(P.rim!=='off'&&rxRimB(P)*RX_TS+P.gp*RX_TS<(P.dist+P.spr/2)/rxC*1e6)o.push('Back-off '+rxRimB(P)+' ký hiệu chưa đủ với trạm xa nhất ('+Math.round(P.dist+P.spr/2)+' km): tăng số ký hiệu back-off hoặc kết hợp giảm công suất, nâng tilt.');
  o.push('Kiểm tra theo hướng: ký hiệu UL đầu nhiễu nặng nhất, giảm dần ⇒ nhiễu xa; nhiễu đều mọi ký hiệu ⇒ nhiễu ngoài hoặc PIM (mục 2).');
  return rUl(o);}
/* ---- CLI: hai cell khác cấu hình khung ---- */
function rxCli(){const P=RXP.tdd,a0=rxFrame(P.pA),b0=rxFrame(P.pB),n=Math.max(a0.length,b0.length);const A=[],B=[];for(let i=0;i<n;i++){A.push(a0[i%a0.length]);B.push(b0[i%b0.length]);}
  const cf=A.map((a,i)=>a==='D'&&B[i]==='U'?1:a==='U'&&B[i]==='D'?2:0);
  const N=rxN(),Nue=rxN(9),gB=17-12*Math.pow(6/10,2);
  /* gNB → gNB: trên mái nhà gần LOS; giảm thêm khi phối hợp */
  const mit=P.cliMit,extra={none:0,guard:0,pwr:6,tilt:8,sync:0}[mit];
  const bsI=46-10*Math.log10(273)+2*gB-(rFspl(P.isd/1000,3.5)+10)-extra;
  const ueI=P.pUe-10*Math.log10(50)-(32.4+20*Math.log10(3.5)+31.9*Math.log10(Math.max(P.dUe,5)));
  const S1=P.rsrp+10*Math.log10(12),In=nDb(nLin(Nue)*2);
  const sinr0=S1-In,sinr1=S1-nDb(nLin(In)+nLin(ueI));
  const frac=cf.filter(x=>x).length/n,f1=cf.filter(x=>x===1).length/n,f2=cf.filter(x=>x===2).length/n;
  return {A,B,cf,n,bsIoT:nDb(nLin(N)+nLin(bsI))-N,bsI,ueI,ueINR:ueI-Nue,sinr0,sinr1,frac,f1,f2,N,Nue,mit};}
function rxCliSvg(C){const W=720,x0=70,w=(W-x0-10)/C.n,col={D:'var(--lte)',G:'var(--panel2)',U:'var(--nr)'};let h='';
  const row=(y,arr,l)=>{h+=`<text x="4" y="${y+13}" class="u3x">${l}</text>`;arr.forEach((c,k)=>{h+=`<rect x="${(x0+k*w).toFixed(1)}" y="${y}" width="${Math.max(.5,w-.5).toFixed(1)}" height="18" style="fill:${col[c]};opacity:.85"/>`;});};
  row(10,C.A,'Cell A');row(36,C.B,'Cell B');
  C.cf.forEach((c,k)=>{if(c&&!(C.mit==='sync'))h+=`<rect x="${(x0+k*w).toFixed(1)}" y="62" width="${Math.max(.5,w-.5).toFixed(1)}" height="10" style="fill:${c===1?'var(--warn)':'var(--k4)'}"/>`;});
  h+=`<text x="4" y="71" class="u3x">Xung đột</text>`;
  return `<svg viewBox="0 0 ${W} 82" class="u3svg" role="img" aria-label="Hai cấu hình khung và các ký hiệu xung đột">${h}</svg>`;}
/* ---- lệch đồng bộ ---- */
const RXOSC={tcxo:['TCXO',4],ocxo:['OCXO',0.25],rb:['Rubidi',0.02]};
function rxSync(){const P=RXP.tdd,drift=RXOSC[P.osc][1],off=P.gnss?P.off:P.off+drift*P.hLoss;
  const prop=P.isd2/rxC*1e6,gp=RXPAT[P.pat].gp*RX_TS,late=off+prop;
  /* phần DL của A trễ lấn vào UL đầu tiên của B */
  const ovl=Math.max(0,late-gp),gB=17-12*Math.pow(6/10,2),I=46-10*Math.log10(273)+2*gB-(rFspl(P.isd2,3.5)+25),N=rxN();
  const nSym=Math.ceil(ovl/RX_TS),iot=ovl>0?nDb(nLin(N)+nLin(I)*Math.min(1,ovl/RX_TS))-N:0;
  const tTo=drift>0?Math.max(0,(1.5-P.off)/drift):Infinity;
  return {off,prop,gp,late,ovl,nSym,iot,I,tTo,drift,ok:Math.abs(off)<=1.5};}
function rxSyncSvg(Y){const W=720,x0=130,sc=(W-x0-20)/300,X=t=>x0+(t+60)*sc;let h='';
  /* cửa sổ −60 … 240 µs quanh ranh giới cuối DL của B */
  const gp=Y.gp;h+=`<text x="4" y="24" class="u3x">gNB B</text><rect x="${X(-60)}" y="12" width="${60*sc}" height="18" style="fill:var(--lte)"/><rect x="${X(0)}" y="12" width="${gp*sc}" height="18" style="fill:var(--panel2);stroke:var(--line)"/><rect x="${X(gp)}" y="12" width="${(240-gp)*sc}" height="18" style="fill:var(--nr)"/>`;
  h+=`<text x="4" y="56" class="u3x">DL của A tới B</text><rect x="${X(-60)}" y="44" width="${Math.max(0,(60+Y.late)*sc)}" height="18" style="fill:var(--lte);opacity:.8"/>`;
  if(Y.ovl>0)h+=`<rect x="${X(gp)}" y="10" width="${Math.min(240-gp,Y.ovl)*sc}" height="54" style="fill:var(--warn);opacity:.35"/>`;
  for(let t=-60;t<=240;t+=30)h+=`<text x="${X(t)}" y="84" class="u3ax" text-anchor="middle">${t}</text>`;
  h+=`<text x="${W-10}" y="98" class="u3ax" text-anchor="end">µs quanh điểm kết thúc DL</text><text x="${X(gp/2)}" y="8" class="u3ax" text-anchor="middle">GP</text>`;
  return `<svg viewBox="0 0 ${W} 102" class="u3svg" role="img" aria-label="Lệch pha giữa hai gNB quanh khoảng bảo vệ">${h}</svg>`;}
function rxTdLogT(list,n){const ms=(list||[]).slice(-(n||14));if(!ms.length)return '<p class="hint">Chưa có bản tin.</p>';
  return `<ol class="u3log ndlog">${ms.map((m,i)=>`<li class="${i===ms.length-1?'ndcur':''}"><span class="u3t">${nE(m.tl)}</span><span class="ndpr ndpr-${m.p}">${nE(m.p)}</span> <b>${nE(m.m)}</b> <span class="u3msg">${nE(m.a)}</span>${m.d?`<br><span class="note">${nE(m.d)}</span>`:''}</li>`).join('')}</ol>`;}
RXR.tdd={
 html(){const P=RXP.tdd;
  const subs=rSub('tdd','sub',[['duct','Nhiễu xa / ducting'],['cli','Nhiễu chéo CLI'],['sync','Lệch đồng bộ']]);
  const fr=Object.entries(RXPAT).map(([k,v])=>[k,v.n]);
  if(P.sub==='duct'){RXTD.R=rxDuctDay();
   return `<div class="panel">${subs}<h3>Nhiễu xa: DL trạm cách hàng trăm km rơi vào UL</h3><p class="hint">Ban đêm, lớp nghịch nhiệt tạo ống dẫn khí quyển làm sóng 3,5 GHz đi rất xa với suy hao gần như không gian tự do. Tín hiệu DL của gNB ở xa tới trễ τ = d / c, vượt khoảng bảo vệ (GP) và đè lên các ký hiệu UL đầu của nạn nhân. Cùng cấu hình khung nên kênh thuận nghịch: RIM-RS (Rel-16, TS 38.211, TS 38.300 §16) dựa vào điều này.</p>
    <div class="scroll"><div class="ndw rxmapc" id="rxTdMap"></div></div>
    <div class="row">${rxPlayBtn('tdd','rxTdPlay')}<button type="button" class="btn sm" data-rxa="tdd:rst">⟲ Về 0 giờ</button><span class="note" id="rxTdT"></span></div></div>
   <div class="cols"><div>
    <div class="panel"><h3>Khung TDD và ký hiệu UL bị đè</h3><div class="scroll"><div class="ndw" id="rxTdFr"></div></div><p class="legend"><span><i style="background:var(--lte)"></i>DL</span><span><i style="background:var(--nr)"></i>UL</span><span><i style="background:var(--panel2);border:1px solid var(--line)"></i>GP</span><span><i style="background:var(--muted)"></i>DL bị tắt (back-off)</span><span><i style="background:var(--warn)"></i>IoT &gt; 6 dB</span></p></div>
    <div class="panel"><h3>IoT trong 24 giờ</h3><div class="scroll"><div class="ndw" id="rxTdP"></div></div><p class="legend"><span><i style="background:var(--warn)"></i>ký hiệu UL đầu</span><span><i style="background:var(--k4)"></i>trung bình UL</span><span><i style="background:var(--nr);opacity:.3"></i>đang back-off (RIM)</span></p></div>
    <div class="panel"><h3>Nhật ký RIM / OAM / NGAP</h3><div id="rxTdLog"></div></div>
   </div><div>
    <div class="panel"><h3>Tham số</h3><div class="ctl">
     ${rSel('tdd','pat','Cấu hình khung (cả hai phía)',fr,'','tddPat')}
     ${rSl('tdd','gp','Khoảng bảo vệ trong ô S',1,6,1,v=>v+' ký hiệu ≈ '+Math.round(v*RX_TS*rxC/1e6)+' km','Mỗi ký hiệu 35,7 µs ≈ 10,7 km đường truyền.','tddSs')}
     ${rSl('tdd','dist','Khoảng cách trung bình tới nhóm gây nhiễu',60,400,10,v=>v+' km')}
     ${rSl('tdd','spr','Độ trải khoảng cách',0,200,10,v=>v+' km')}
     ${rSl('tdd','nAg','Số gNB gây nhiễu',1,120,1,v=>v)}
     ${rSl('tdd','tilt','Tilt anten',0,12,1,v=>v+'°','Tilt lớn giảm năng lượng phát ngang chân trời.','eTilt')}
     ${rSl('tdd','load','Tải DL bên gây nhiễu',5,100,5,v=>v+' %')}
     ${rSel('tdd','season','Mùa',[[1,'Xuân, hè: ống dẫn mạnh'],[0.5,'Chuyển mùa'],[0.2,'Thu, đông: yếu']])}
     ${rSel('tdd','rim','Quản lý nhiễu xa (RIM)',[['off','Tắt, back-off thủ công'],['fw1','Framework 1: RIM-RS-1 + RIM-RS-2'],['fw2','Framework 2: RIM-RS-1 + backhaul (NGAP)']],'','rimSw')}
     ${P.rim==='off'?rSl('tdd','back','Back-off thủ công (tắt ký hiệu DL cuối)',0,10,1,v=>v+' ký hiệu','Áp dụng cả ngày.','rimBack')+rSl('tdd','bpw','Giảm công suất DL thủ công',0,10,1,v=>v+' dB'):rSl('tdd','rimThr','Ngưỡng IoT kích hoạt RIM-RS',3,15,1,v=>v+' dB','','rimThr')+rSl('tdd','rimBack','Số ký hiệu back-off khi có RIM',0,20,1,v=>v?v+' ký hiệu':'tự động theo trễ RIM-RS','Back-off nhiều ký hiệu làm mất dung lượng DL trong lúc có ống dẫn.','rimBack')}
     ${rSl('tdd','hour','Giờ đang xem',0,23.9,0.1,v=>{const H=Math.floor(v);return String(H).padStart(2,'0')+':'+String(Math.floor((v-H)*60)).padStart(2,'0');})}
     ${rSl('tdd','play','Tua nhanh',5,120,5,v=>'1 s = '+v+' phút')}
    </div></div>
    <div class="panel"><h3>Kết quả ở giờ đang xem</h3><dl class="kv" id="rxTdOut"></dl></div>
    <div class="panel"><h3>Gợi ý tối ưu</h3><div id="rxTdAdv">${rxTdAdv()}</div></div>
    <div class="panel"><h3>Cách RIM hoạt động</h3><div class="u3stk">
     <div style="border-left-color:var(--warn)"><b>Phát hiện</b> · nạn nhân thấy IoT dốc ở ký hiệu UL đầu, lặp lại theo đêm, rồi phát RIM-RS loại 1 ở cuối vùng DL (cấu hình theo set ID, chu kỳ phát).</div>
     <div style="border-left-color:var(--nr)"><b>Framework 1</b> · gNB gây nhiễu nghe được RS-1, áp dụng back-off và phát RIM-RS loại 2 để báo “ống dẫn vẫn còn”.</div>
     <div style="border-left-color:var(--k4)"><b>Framework 2</b> · gNB gây nhiễu báo qua backhaul: NGAP Uplink RIM Information Transfer tới AMF, AMF chuyển Downlink RIM Information Transfer tới tập nạn nhân.</div>
     <div style="border-left-color:var(--up)"><b>Back-off</b> · tắt ký hiệu DL cuối (nới GP), giảm công suất, nâng tilt, hoặc đổi chu kỳ khung theo vendor.</div></div></div>
   </div></div>`;}
  if(P.sub==='cli'){const C=rxCli();
   return `<div class="panel">${subs}<h3>Nhiễu chéo (CLI) khi hai cell dùng cấu hình khung khác nhau</h3><p class="hint">Khi cell A đang DL mà cell B đang UL: gNB A phát thẳng vào máy thu gNB B (gNB–gNB), và UE của B phát UL làm nhiễu UE của A đang thu DL (UE–UE). Rel-16 thêm đo SRS-RSRP và CLI-RSSI (TS 38.215) để UE báo nhiễu chéo; giữa các gNB trao đổi cấu hình khung dự định qua Xn (cần đối chiếu tên IE theo release).</p>
    <div class="scroll"><div class="ndw rxmapc" id="rxCliSvg">${rxCliSvg(C)}</div></div><p class="legend"><span><i style="background:var(--lte)"></i>DL</span><span><i style="background:var(--nr)"></i>UL</span><span><i style="background:var(--warn)"></i>A DL ↔ B UL</span><span><i style="background:var(--k4)"></i>A UL ↔ B DL</span></p></div>
   <div class="cols"><div>
    <div class="panel"><h3>Mức nhiễu</h3><dl class="kv" id="rxCliOut"></dl><div id="rxCliBars"></div></div>
    <div class="panel"><h3>Nhật ký RRC / XnAP</h3><div id="rxCliLog"></div></div>
   </div><div>
    <div class="panel"><h3>Tham số</h3><div class="ctl">
     ${rSel('tdd','pA','Khung cell A',fr)}${rSel('tdd','pB','Khung cell B',fr)}
     ${rSl('tdd','isd','Khoảng cách hai gNB',100,5000,100,v=>v+' m')}
     ${rSl('tdd','dUe','Khoảng cách UE–UE',5,400,5,v=>v+' m')}
     ${rSl('tdd','pUe','Công suất UE gây nhiễu',0,26,1,v=>v+' dBm','PC3 = 23 dBm, PC2 = 26 dBm.')}
     ${rSl('tdd','rsrp','RSRP DL của UE bị nhiễu',-120,-70,1,v=>v+' dBm')}
     ${rSel('tdd','cliMit','Biện pháp',[['none','Chưa xử lý'],['pwr','Giảm công suất DL 6 dB ở ký hiệu xung đột'],['tilt','Hạ tilt, che chắn (−8 dB ghép gNB–gNB)'],['sync','Đồng bộ cùng cấu hình khung (khuyến nghị)']])}
    </div></div>
    <div class="panel"><h3>Gợi ý</h3><div id="rxCliAdv"></div></div>
   </div></div>`;}
  const Y=rxSync();
  return `<div class="panel">${subs}<h3>Lệch đồng bộ giữa hai gNB TDD</h3><p class="hint">TDD đòi mọi cell chồng phủ cùng tần số lệch pha không quá 3 µs (TS 38.133 §7.4), tức mỗi trạm ±1,5 µs so với nguồn chung (GNSS hoặc PTP). Mất GNSS, trạm chạy giữ pha (holdover) bằng dao động nội; sai pha tăng dần và DL của trạm lệch lấn sang UL của trạm bên cạnh.</p>
   <div class="scroll"><div class="ndw rxmapc" id="rxSySvg">${rxSyncSvg(Y)}</div></div>
   <div class="row">${rxPlayBtn('tdd','rxSyPlay')}<button type="button" class="btn sm" data-rxa="tdd:loss">${P.gnss?'Cắt GNSS ở gNB A':'Khôi phục GNSS'}</button><span class="note" id="rxSyT"></span></div></div>
  <div class="cols"><div>
   <div class="panel"><h3>Kết quả</h3><dl class="kv" id="rxSyOut"></dl></div>
   <div class="panel"><h3>Nhật ký đồng bộ</h3><div id="rxSyLog"></div></div>
  </div><div>
   <div class="panel"><h3>Tham số</h3><div class="ctl">
    ${rSel('tdd','pat','Cấu hình khung',fr,'','tddPat')}
    ${rSl('tdd','off','Lệch pha ban đầu của gNB A',-3,3,0.1,v=>nF(v,1)+' µs')}
    ${rSel('tdd','osc','Dao động nội khi holdover',Object.entries(RXOSC).map(([k,v])=>[k,v[0]+' · ≈ '+nF(v[1],2)+' µs/giờ (minh hoạ)']),'','syncSrc')}
    ${rSl('tdd','isd2','Khoảng cách hai gNB',0.3,10,0.1,v=>nF(v,1)+' km')}
    ${rSl('tdd','hLoss','Thời gian mất GNSS',0,48,0.5,v=>nF(v,1)+' giờ')}
   </div></div>
   <div class="panel"><h3>Gợi ý</h3><div id="rxSyAdv"></div></div>
  </div></div>`;},
 after(){this.draw(true);},
 draw(force){const P=RXP.tdd;
  if(P.sub==='duct'){const k=Math.floor(P.hour*12);if(!force&&k===RXTD.lastDraw){const m=$('#rxTdMap');if(m)m.innerHTML=rxTdMap(RXTD.X,RXTD.t);return;}RXTD.lastDraw=k;
   const R=RXTD.R,i=Math.min(287,Math.floor(P.hour/24*288)),mit=R.mit[i];
   const X=rxDuctIoT(P,P.hour,mit?rxRimB(P):(P.rim==='off'?P.back:0),mit?3:(P.rim==='off'?P.bpw:0));RXTD.X=X;
   const s=(id,h)=>{const e=$('#'+id);if(e)e.innerHTML=h;};
   s('rxTdMap',rxTdMap(X,RXTD.t));s('rxTdFr',rxTdFrameSvg(X));s('rxTdP',rxTdPlot());s('rxTdOut',rxTdOut(X));
   s('rxTdLog',rxTdLogT(R.msgs.filter(m=>m.h<=P.hour),12));
   const t=$('#rxTdT');if(t){const H=Math.floor(P.hour);t.textContent=`${String(H).padStart(2,'0')}:${String(Math.floor((P.hour-H)*60)).padStart(2,'0')} · IoT ký hiệu UL đầu ${nF(X.iot[0],1)} dB${mit?' · đang back-off':''}`;}
   const o=$('[data-rxi="tdd:hour"]');if(o&&document.activeElement!==o){o.value=P.hour;const out=o.parentElement.querySelector('output');if(out)out.textContent=RXF['tdd:hour'](P.hour);}
   return;}
  if(P.sub==='cli'){const C=rxCli(),s=(id,h)=>{const e=$('#'+id);if(e)e.innerHTML=h;};
   const sync=C.mit==='sync';
   s('rxCliSvg',rxCliSvg(C));
   s('rxCliOut',rKv('Ký hiệu xung đột',sync?'0 %':nF(C.frac*100,1)+' % (A DL/B UL '+nF(C.f1*100,1)+' %, A UL/B DL '+nF(C.f2*100,1)+' %)')
    +rKv('gNB A → gNB B, mỗi PRB',sync?'—':nF(C.bsI,1)+' dBm (noise '+nF(C.N,1)+' dBm)')+rKv('IoT ở gNB B khi xung đột',sync?'0 dB':nF(C.bsIoT,1)+' dB')
    +rKv('UE B → UE A, mỗi PRB',sync?'—':nF(C.ueI,1)+' dBm (INR '+nF(C.ueINR,1)+' dB)')+rKv('SINR DL của UE A',nF(C.sinr0,1)+' dB → '+(sync?nF(C.sinr0,1):nF(C.sinr1,1))+' dB khi xung đột'));
   s('rxCliBars',nBars([['IoT gNB B',sync?0:Math.max(0,C.bsIoT),'var(--warn)'],['INR UE A',sync?0:Math.max(0,C.ueINR),'var(--k4)'],['Mất SINR UE A',sync?0:Math.max(0,C.sinr0-C.sinr1),'var(--up)']],Math.max(30,C.bsIoT),' dB'));
   const L=[{t:0,p:'XnAP',m:'Xn Setup / NG-RAN Node Configuration Update',a:'gNB A ↔ gNB B',d:'trao đổi cấu hình TDD đang dùng (TDD-UL-DL-ConfigCommon) và cấu hình dự định (Rel-16, cần đối chiếu tên IE)'},
     {t:0.02,p:'RRC',m:'RRCReconfiguration (measConfig: MeasObjectCLI-r16)',a:'gNB A → UE A',d:'srs-ResourceConfig-r16 của UE B, rssi-ResourceConfig-r16'},
     {t:0.4,p:'RRC',m:'MeasurementReport (cli-EventI1 / định kỳ)',a:'UE A → gNB A',d:'SRS-RSRP '+nF(C.ueI+10*Math.log10(1/12),1)+' dBm, CLI-RSSI '+nF(C.ueI,1)+' dBm/PRB'}];
   if(!sync&&C.frac>0)L.push({t:0.42,p:'MAC',m:'Lập lịch tránh ký hiệu xung đột',a:'gNB A',d:'không xếp UE A gần UE B vào ký hiệu B đang UL'});
   s('rxCliLog',nLog(L,L.length-1));
   const o=[];if(sync||C.frac===0)o.push('Hai cell cùng khung: không có ký hiệu xung đột.');else{
     if(C.bsIoT>20)o.push('Nhiễu gNB–gNB '+nF(C.bsIoT,0)+' dB làm UL của B gần như không dùng được ở ký hiệu xung đột. Với trạm macro, cách duy nhất là cùng cấu hình khung (theo quy định phổ tần) hoặc dùng khoảng bảo vệ tần số/ khoảng cách địa lý.');
     if(C.ueINR>6)o.push('UE–UE ở '+P.dUe+' m gây INR '+nF(C.ueINR,0)+' dB: dùng đo CLI (SRS-RSRP) để gNB tránh xếp UE gần nhau vào ký hiệu xung đột.');
     o.push('Mạng riêng (DSUUU, nặng UL) cạnh mạng công cộng (DDDSU) là ca phổ biến: cần thoả thuận đồng bộ hoặc tách tần số, dùng khung bán đồng bộ (cùng ranh giới DL lớn).');}
   s('rxCliAdv',rUl(o));return;}
  const Y=rxSync(),s=(id,h)=>{const e=$('#'+id);if(e)e.innerHTML=h;};
  s('rxSySvg',rxSyncSvg(Y));
  s('rxSyOut',rKv('Lệch pha gNB A',nF(Y.off,2)+' µs '+(Y.ok?'<span class="kpC ok">trong ±1,5 µs</span>':'<span class="kpC no">vượt ±1,5 µs</span>'))+rKv('Trễ truyền A → B',nF(Y.prop,2)+' µs')+rKv('Khoảng bảo vệ',nF(Y.gp,1)+' µs')
   +rKv('DL của A lấn vào UL của B',nF(Y.ovl,1)+' µs ('+Y.nSym+' ký hiệu)')+rKv('IoT ký hiệu UL đầu của B',nF(Y.iot,1)+' dB')+rKv('Thời gian giữ ±1,5 µs khi mất GNSS',isFinite(Y.tTo)?nF(Y.tTo,1)+' giờ':'—'));
  const L=[{t:0,p:'OAM',m:'Nguồn đồng bộ: GNSS khoá',a:'gNB A',d:'lệch pha '+nF(P.off,2)+' µs'}];
  if(!P.gnss){L.push({t:P.hLoss>0?0.01:0,p:'OAM',m:'Cảnh báo mất nguồn đồng bộ GNSS',a:'gNB A',d:'chuyển sang holdover bằng '+RXOSC[P.osc][0]});
    if(P.hLoss>=Y.tTo)L.push({t:Y.tTo,p:'OAM',m:'Hết thời gian holdover cho phép',a:'gNB A',d:'lệch pha > 1,5 µs; nên tự khoá phát (TX off) hoặc chuyển nguồn PTP để tránh nhiễu cả cụm'});}
  s('rxSyLog',`<ol class="u3log ndlog">${L.map((m,i)=>`<li class="${i===L.length-1?'ndcur':''}"><span class="u3t">${nF(m.t,1)} h</span><span class="ndpr ndpr-${m.p}">${m.p}</span> <b>${nE(m.m)}</b> <span class="u3msg">${nE(m.a)}</span><br><span class="note">${nE(m.d)}</span></li>`).join('')}</ol>`);
  const o=[];if(Y.ovl>0)o.push('DL của A lấn '+nF(Y.ovl,0)+' µs vào UL của B: KPI UL, RACH của B sụt. Kiểm tra cảnh báo đồng bộ, đối chiếu thời điểm mất GNSS.');
  if(!Y.ok)o.push('Lệch quá ±1,5 µs: cấu hình hành động khi hết holdover (tắt phát hoặc giảm công suất) và nguồn dự phòng PTP (ITU-T G.8275.1) qua truyền dẫn.');
  if(P.osc==='tcxo')o.push('TCXO giữ pha rất ngắn: trạm TDD nên dùng OCXO hoặc nguồn PTP dự phòng.');
  if(!o.length)o.push('Đồng bộ tốt: lệch pha và trễ truyền vẫn nằm trong khoảng bảo vệ.');
  s('rxSyAdv',rUl(o));
  const t=$('#rxSyT');if(t)t.textContent=P.gnss?'GNSS đang khoá':'Mất GNSS '+nF(P.hLoss,1)+' giờ';},
 tick(dt){const P=RXP.tdd;if(P.sub==='duct'){RXTD.t+=dt;if(!RXS.pause){P.hour+=dt*P.play/60;if(P.hour>=24)P.hour-=24;}this.draw(dt===0);}
  else if(P.sub==='sync'&&!P.gnss&&!RXS.pause){const old=P.hLoss;P.hLoss=Math.min(48,P.hLoss+dt*0.5);if(Math.floor(old*4)!==Math.floor(P.hLoss*4)){this.draw(true);const o=$('[data-rxi="tdd:hLoss"]');if(o){o.value=P.hLoss;const out=o.parentElement.querySelector('output');if(out)out.textContent=RXF['tdd:hLoss'](P.hLoss);}}}
  else if(dt===0)this.draw(true);},
 upd(k){const P=RXP.tdd;if(k==='play'||k==='hour'){this.draw(true);return;}
  if(k==='rim'||(k==='pat'&&P.sub!=='cli')){renderRx();return;}
  if(P.sub==='duct'){RXTD.R=rxDuctDay();const a=$('#rxTdAdv');if(a)a.innerHTML=rxTdAdv();}
  this.draw(true);},
 act(a,el,x){const P=RXP.tdd;if(a==='sub'){if(P.sub===x)return;P.sub=x;renderRx();}
  else if(a==='play')rxPlayTog(P.sub==='sync'?'rxSyPlay':'rxTdPlay');
  else if(a==='rst'){P.hour=0;this.draw(true);}
  else if(a==='loss'){P.gnss=!P.gnss;P.hLoss=0;renderRx();}}
};

/* ---------- Mục 2: Nhiễu UL — PIM, nhiễu ngoài, dò nhiễu theo RSSI/PRB, noise floor ---------- */
RXP.ul={band:'n3',f1:1815,b1:20,f2:1870,b2:10,ptx:46,pimQ:-125,nf:3.5,hour:20,play:30,
  sPim:true,sNb:false,nbPrb:2,nbW:3,nbLv:-105,sWb:false,wbLv:6,sBr:false,brLv:8,sDuct:false,sLoad:true,ldLv:3,guess:'pim'};
/* băng tần: [tên, song công, UL thấp, UL cao, DL thấp, DL cao, tâm UL, BW sóng mang, SCS, số PRB] */
const RXBAND={
  n3:['n3 / B3 · FDD 1800 MHz','FDD',1710,1785,1805,1880,1747.5,20,15,106],
  n1:['n1 / B1 · FDD 2100 MHz','FDD',1920,1980,2110,2170,1950,20,15,106],
  n8:['n8 / B8 · FDD 900 MHz','FDD',880,915,925,960,902.5,10,15,52],
  n28:['n28 · FDD 700 MHz','FDD',703,748,758,803,738,10,15,52],
  n78:['n78 · TDD 3,5 GHz','TDD',3300,3800,3300,3800,3500,100,30,273],
  n41:['n41 · TDD 2,6 GHz','TDD',2496,2690,2496,2690,2593,100,30,273]
};
const RXSRC=[['pim','PIM (xuyên điều chế thụ động)'],['nb','Nhiễu ngoài băng hẹp (thiết bị phát lậu)'],['wb','Nhiễu băng rộng (repeater, khuếch đại lậu)'],['br','Lỗi một nhánh thu (feeder, LNA, VSWR)'],['duct','Nhiễu xa TDD (ống dẫn)'],['load','Nhiễu nội hệ thống (UE cell lân cận)']];
/* tải theo giờ (0…1), đỉnh trưa và tối */
const rxLoad=h=>nC(0.12+0.5*Math.exp(-Math.pow((h-11)/2.6,2))+0.8*Math.exp(-Math.pow((h-20.5)/2.4,2)),0.08,1);
/* các sản phẩm PIM bậc 3/5/7 của hai sóng mang DL */
function rxPimProd(P){const B=RXBAND[P.band],o=[];if(B[1]!=='FDD')return o;
  const f1=P.f1,f2=P.f2,w1=P.b1,w2=P.b2;
  [[3,2,1,0],[5,3,2,-10],[7,4,3,-20]].forEach(([ord,m,n,lv])=>{
    o.push({ord,f:m*f1-n*f2,w:m*w1+n*w2,lv,lab:`${m}f1−${n}f2`});o.push({ord,f:m*f2-n*f1,w:m*w2+n*w1,lv,lab:`${m}f2−${n}f1`});});
  return o;}
function rxUlCfg(){const P=RXP.ul,B=RXBAND[P.band];const nP=B[9],scs=B[8],prbW=12*scs/1000,f0=B[6]-nP*prbW/2;
  return {B,nP,scs,prbW,f0,fdd:B[1]==='FDD',N:rxN(P.nf,scs)};}
/* ma trận nhiễu [giờ][nhánh][PRB] (mW) cộng noise */
function rxUlSim(src){const P=RXP.ul,C=rxUlCfg(),r=nRng(17),Nl=nLin(C.N),H=24,br=4;
  const has=k=>src?src.includes(k):({pim:P.sPim,nb:P.sNb,wb:P.sWb,br:P.sBr,duct:P.sDuct,load:P.sLoad})[k];
  const prod=rxPimProd(P),out=[];
  /* phần PIM trên từng PRB (mức tương đối, chưa nhân công suất) */
  const pimW=new Float32Array(C.nP);
  if(C.fdd)prod.forEach(p=>{for(let k=0;k<C.nP;k++){const fk=C.f0+(k+0.5)*C.prbW,u=(fk-p.f)/(p.w/2);if(Math.abs(u)<1){const sh=Math.cos(u*Math.PI/2);pimW[k]+=nLin(p.lv)*sh*sh*C.prbW/(p.w/2);}}});
  const pimOn=pimW.some(x=>x>0);
  for(let h=0;h<H;h++){const L=rxLoad(h+0.5),row=[];
    /* PIM bậc 3 tăng ≈ 2,5 dB mỗi dB công suất phát (thực tế 2…3) */
    const pTone=P.ptx+10*Math.log10(L),pim=nLin(43+P.pimQ+2.5*(pTone-43));
    const du=rxDuct(h+0.5,1),duI=Nl*(nLin(14*du)-1);
    for(let b=0;b<br;b++){const v=new Float32Array(C.nP);
      for(let k=0;k<C.nP;k++){let x=Nl*nLin(nGs(r)*0.4);
        if(has('pim')&&pimOn)x+=pim*pimW[k]*[1,0.25,0.03,0.03][b];
        if(has('nb')&&k>=P.nbPrb&&k<P.nbPrb+P.nbW)x+=nLin(P.nbLv+nGs(r)*0.8);
        if(has('wb'))x+=Nl*(nLin(P.wbLv)-1)*nLin(nGs(r)*0.3);
        if(has('br')&&b===1)x+=Nl*(nLin(P.brLv)-1);
        if(has('duct')&&!C.fdd)x+=duI*nLin(nGs(r)*0.5);
        if(has('load'))x+=Nl*(nLin(P.ldLv*L)-1)*(0.4+1.2*r());
        v[k]=x;}
      row.push(v);}
    out.push(row);}
  return {C,M:out,prod,pimOn};}
const rxIoT=(x,N)=>nDb(x)-N;
/* đặc trưng để dò nhiễu */
function rxUlFeat(R){const C=R.C,N=C.N,mean=[],brm=[0,0,0,0],load=[];
  R.M.forEach((row,h)=>{let s=0;row.forEach((v,b)=>{let sb=0;for(let k=0;k<C.nP;k++)sb+=v[k];sb/=C.nP;brm[b]+=rxIoT(sb,N)/24;s+=sb;});mean.push(rxIoT(s/row.length,N));load.push(rxLoad(h+0.5));});
  const avgPrb=new Float32Array(C.nP);R.M.forEach(row=>row.forEach(v=>{for(let k=0;k<C.nP;k++)avgPrb[k]+=v[k]/96;}));
  const iotP=[...avgPrb].map(x=>rxIoT(x,N)),med=rPct(iotP,0.5),top=iotP.map((v,k)=>[v,k]).sort((a,b)=>b[0]-a[0]),hi=iotP.filter(v=>v>med+6).length;
  const night=(mean.slice(0,6).reduce((a,b)=>a+b,0)/6)-(mean.slice(10,18).reduce((a,b)=>a+b,0)/8);
  const std=Math.sqrt(mean.reduce((a,b)=>a+b*b,0)/24-Math.pow(mean.reduce((a,b)=>a+b,0)/24,2));
  return {mean,brm,load,corr:rCorr(mean,load),imb:Math.max(...brm)-Math.min(...brm),med,nbW:hi,nbAt:top[0][1],nbPk:top[0][0]-med,night,std,avg:mean.reduce((a,b)=>a+b,0)/24,iotP};}
function rxUlDiag(F,C){const c=[];
  if(F.corr>0.6&&F.imb>3&&F.avg>1)c.push(['pim',Math.min(99,Math.round(60+30*F.corr+F.imb)),'IoT bám theo tải DL (r = '+nF(F.corr,2)+') và lệch giữa các nhánh '+nF(F.imb,1)+' dB']);
  if(F.nbW>0&&F.nbW<C.nP*0.2&&F.nbPk>6)c.push(['nb',Math.min(97,Math.round(55+F.nbPk*2)),'Đỉnh hẹp '+F.nbW+' PRB quanh PRB '+F.nbAt+', cao hơn trung vị '+nF(F.nbPk,1)+' dB, không đổi theo giờ']);
  if(F.med>2.5&&F.std<1.2&&F.imb<2)c.push(['wb',Math.min(95,Math.round(50+F.med*5)),'Toàn băng nâng đều '+nF(F.med,1)+' dB, gần như không đổi theo giờ, mọi nhánh như nhau']);
  if(F.imb>3&&!(F.corr>0.6))c.push(['br',Math.min(95,Math.round(55+F.imb*4)),'Một nhánh cao hơn '+nF(F.imb,1)+' dB và không theo tải: kiểm tra feeder, đầu nối, LNA, VSWR']);
  if(!C.fdd&&F.night>3)c.push(['duct',Math.min(97,Math.round(55+F.night*3)),'IoT ban đêm cao hơn ban ngày '+nF(F.night,1)+' dB (ống dẫn)']);
  if(F.corr>0.5&&F.imb<2&&F.avg>0.8)c.push(['load',Math.round(40+30*F.corr),'IoT theo giờ cao điểm nhưng các nhánh như nhau: nhiễu từ UE cell lân cận (P0, alpha cao)']);
  if(!c.length)c.push(['none',90,'IoT trung bình '+nF(F.avg,1)+' dB: nằm trong mức nền']);
  return c.sort((a,b)=>b[1]-a[1]);}
function rxPimHit(){const C=rxUlCfg();if(!C.fdd)return false;const lo=C.f0,hi=C.f0+C.nP*C.prbW;return rxPimProd(RXP.ul).some(p=>p.f+p.w/2>lo&&p.f-p.w/2<hi);}
const RXUL={R:null,F:null,lastDraw:-1,quiz:null,t:0};
function rxUlSpec(){const R=RXUL.R,C=R.C,h=Math.floor(RXP.ul.hour)%24,row=R.M[h],cols=['var(--warn)','var(--k4)','var(--nr)','var(--up)'];
  const st=Math.max(1,Math.round(C.nP/110)),pts=b=>{const a=[];for(let k=0;k<C.nP;k+=st)a.push([k,nDb(row[b][k])]);return a;};
  const mx=Math.max(C.N+12,...row.map(v=>Math.max(...[...v].map(nDb))))+3;
  const bands=[[0,4,'var(--k4)',.12],[C.nP-4,C.nP,'var(--k4)',.12],[8,14,'var(--sip)',.14]];
  return nPlot({w:680,h:230,x0:0,x1:C.nP,y0:C.N-6,y1:mx,yt:[C.N-6,C.N,C.N+6,C.N+12,C.N+18,C.N+24,C.N+30].filter(v=>v<=mx).map(v=>Math.round(v)),xt:[0,Math.round(C.nP/4),Math.round(C.nP/2),Math.round(3*C.nP/4),C.nP],
    series:[0,1,2,3].map(b=>({pts:pts(b),c:cols[b],w:1.3})),hl:[[C.N,'var(--muted)','noise floor']],bands,ylab:'dBm / PRB',aria:'RSSI UL theo PRB, bốn nhánh thu'});}
function rxUlHeat(){const R=RXUL.R,C=R.C,N=C.N,bin=Math.max(1,Math.ceil(C.nP/92)),nb=Math.ceil(C.nP/bin),W=720,x0=40,cw=(W-x0-60)/nb,ch=6;let h='';
  const col=v=>{const t=nC(v/20,0,1);return `hsl(${Math.round(210-210*t)},${Math.round(60+30*t)}%,${Math.round(55-12*t)}%)`;};
  R.M.forEach((row,hr)=>{for(let j=0;j<nb;j++){let s=0,c=0;for(let k=j*bin;k<Math.min(C.nP,(j+1)*bin);k++){s+=(row[0][k]+row[1][k]+row[2][k]+row[3][k])/4;c++;}const v=rxIoT(s/c,N);h+=`<rect x="${(x0+j*cw).toFixed(1)}" y="${4+hr*ch}" width="${(cw+0.3).toFixed(1)}" height="${ch+0.3}" style="fill:${col(v)}"><title>${hr}h · PRB ${j*bin}: ${nF(v,1)} dB</title></rect>`;}
    if(hr%3===0)h+=`<text x="${x0-4}" y="${4+hr*ch+6}" class="u3ax" text-anchor="end">${hr}h</text>`;});
  const yH=4+Math.floor(RXP.ul.hour)*ch;h+=`<rect x="${x0}" y="${yH}" width="${nb*cw}" height="${ch}" class="rxhcur"/>`;
  for(let i=0;i<=4;i++){const v=i*5;h+=`<rect x="${W-50}" y="${8+i*28}" width="12" height="24" style="fill:${col(v)}"/><text x="${W-34}" y="${24+i*28}" class="u3ax">${v} dB</text>`;}
  h+=`<text x="${x0}" y="${4+24*ch+14}" class="u3ax">PRB 0</text><text x="${x0+nb*cw}" y="${4+24*ch+14}" class="u3ax" text-anchor="end">PRB ${C.nP-1}</text>`;
  return `<svg viewBox="0 0 ${W} ${24*ch+24}" class="u3svg" role="img" aria-label="Bản đồ nhiệt IoT theo giờ và PRB">${h}</svg>`;}
function rxUlDay(){const F=RXUL.F,mx=Math.max(8,...F.mean)*1.1;
  return nPlot({w:680,h:190,x0:0,x1:24,y0:0,y1:mx,yt:[0,mx/4,mx/2,3*mx/4].map(v=>Math.round(v*10)/10),yd:1,xt:[0,3,6,9,12,15,18,21,24],xf:v=>v+'h',
    series:[{pts:F.mean.map((v,i)=>[i+0.5,v]),c:'var(--warn)'},{pts:F.load.map((v,i)=>[i+0.5,v*mx]),c:'var(--muted)',dash:'4 3'}],cur:RXP.ul.hour,ylab:'IoT (dB)',aria:'IoT trung bình và tải theo giờ'});}
function rxUlPimTab(){const P=RXP.ul,R=RXUL.R,C=R.C;if(!C.fdd)return '<p class="hint">Băng TDD: DL và UL cùng tần số nên PIM của DL rơi đúng vào băng thu khi có nguồn phi tuyến; ở đây tập trung vào nhiễu xa và nhiễu ngoài. Chọn băng FDD để xem tính sản phẩm PIM.</p>';
  const ul=[C.B[2],C.B[3]],car=[C.f0,C.f0+C.nP*C.prbW];
  return `<div class="scroll"><table class="ndtb"><thead><tr><th>Sản phẩm</th><th>Bậc</th><th>Tần số tâm</th><th>Độ rộng</th><th>Rơi vào</th></tr></thead><tbody>${R.prod.map(p=>{const lo=p.f-p.w/2,hi=p.f+p.w/2,inCar=hi>car[0]&&lo<car[1],inUl=hi>ul[0]&&lo<ul[1];
    return `<tr class="${inCar?'ndhl':''}"><td>${p.lab}</td><td>IM${p.ord}</td><td>${nF(p.f,1)} MHz</td><td>${nF(p.w,0)} MHz</td><td>${inCar?'<span class="kpC no">sóng mang UL đang dùng</span>':inUl?'<span class="kpC mid">băng UL (sóng mang khác)</span>':'ngoài băng UL'}</td></tr>`;}).join('')}</tbody></table></div>
   <p class="note">Sóng mang UL ${nF(car[0],1)}–${nF(car[1],1)} MHz. Mức PIM tham chiếu theo IEC 62037 (hai tông 2 × 43 dBm); bậc 3 tăng khoảng 2,5 dB cho mỗi dB công suất (lý thuyết 3 dB). Bậc 5 và 7 lấy thấp hơn 10 dB và 20 dB (rút gọn).</p>`;}
function rxUlOut(){const R=RXUL.R,C=R.C,F=RXUL.F,h=Math.floor(RXP.ul.hour)%24;let s=0;R.M[h].forEach(v=>{for(let k=0;k<C.nP;k++)s+=v[k];});const now=rxIoT(s/(4*C.nP),C.N);
  const rr=Math.pow(10,-F.avg/35);
  return rKv('Noise floor / PRB',`−174 + 10·log10(12 × ${C.scs} kHz) + NF ${nF(RXP.ul.nf,1)} = ${nF(C.N,1)} dBm`)+rKv('IoT trung bình lúc '+h+'h',nF(now,1)+' dB')+rKv('IoT trung bình 24 giờ',nF(F.avg,1)+' dB')
   +rKv('Tương quan IoT với tải',nF(F.corr,2))+rKv('Lệch giữa các nhánh thu',nF(F.imb,1)+' dB')+rKv('PRB cao hơn trung vị 6 dB',F.nbW)
   +'<div class="sep"></div>'+rKv('Bán kính phủ UL còn',nF(rr*100,0)+' % (n = 3,5)')+rKv('Diện tích phủ UL còn',nF(rr*rr*100,0)+' %');}
function rxUlDiagHtml(){const C=RXUL.R.C,D=rxUlDiag(RXUL.F,C),nm=k=>k==='none'?'Không thấy nguồn bất thường':(RXSRC.find(x=>x[0]===k)||[,k])[1];
  const q=RXUL.quiz;
  return `${q?`<p class="note"><b>Bài tập:</b> nguồn nhiễu đang ẩn. Đọc phổ, bản đồ nhiệt và đồ thị theo giờ rồi chọn đáp án.</p><div class="ctl">${rSel('ul','guess','Bạn đoán',RXSRC.filter(s=>rxPimHit()||s[0]!=='pim').filter(s=>!C.fdd||s[0]!=='duct'))}</div><div class="row"><button type="button" class="btn sm pri" data-rxa="ul:check">Kiểm tra</button><button type="button" class="btn sm" data-rxa="ul:quit">Thoát bài tập</button></div><div id="rxUlQ"></div>`:
   `<ol class="rxdiag">${D.map(d=>`<li><b>${nE(nm(d[0]))}</b> <span class="chip">${d[1]} %</span><br><span class="note">${nE(d[2])}</span></li>`).join('')}</ol><div class="row"><button type="button" class="btn sm" data-rxa="ul:quiz">Bài tập: tìm nguồn nhiễu ẩn</button></div>`}`;}
function rxUlLog(){const R=RXUL.R,F=RXUL.F,L=[],h0=RXP.ul.hour;let on=false;
  F.mean.forEach((v,h)=>{if(h>h0)return;if(!on&&v>6){on=true;L.push({tl:String(h).padStart(2,'0')+':00',p:'OAM',m:'Cảnh báo nhiễu UL của cell',a:'gNB → OSS',d:'IoT trung bình '+nF(v,1)+' dB > 6 dB (ngưỡng cảnh báo theo vendor, cần đối chiếu tên)'});}
    else if(on&&v<4){on=false;L.push({tl:String(h).padStart(2,'0')+':00',p:'OAM',m:'Xoá cảnh báo nhiễu UL',a:'gNB → OSS',d:'IoT '+nF(v,1)+' dB'});}
    if(h%6===0)L.push({tl:String(h).padStart(2,'0')+':00',p:'PHY',m:'Báo cáo RSSI theo PRB (15 phút)',a:'gNB',d:'trung bình 4 nhánh, lớn nhất ở PRB '+F.nbAt});});
  return rxTdLogT(L,10);}
RXR.ul={
 html(){const P=RXP.ul,C=rxUlCfg();RXUL.R=rxUlSim(RXUL.quiz?[RXUL.quiz]:null);RXUL.F=rxUlFeat(RXUL.R);
  const srcCk=RXUL.quiz?'<p class="note">Đang ẩn nguồn nhiễu (bài tập).</p>':`<div class="c">${rChk('ul','sPim','PIM (chỉ FDD)')}</div><div class="c">${rChk('ul','sNb','Nhiễu ngoài băng hẹp')}</div><div class="c">${rChk('ul','sWb','Nhiễu băng rộng (repeater)')}</div><div class="c">${rChk('ul','sBr','Lỗi nhánh thu RX1')}</div><div class="c">${rChk('ul','sDuct','Nhiễu xa (chỉ TDD)')}</div><div class="c">${rChk('ul','sLoad','Nhiễu nội hệ thống')}</div>`;
  return `<div class="panel"><h3>Phổ RSSI UL theo PRB, bốn nhánh thu</h3><p class="hint">gNB đo công suất thu trên từng PRB khi không có UE nào được xếp lịch (hoặc trừ phần tín hiệu), lấy trung bình 15 phút. IoT = nhiễu cộng noise so với noise floor. Vùng tô: PUCCH ở hai mép, PRACH ở PRB 8–13.</p>
   <div class="scroll"><div class="ndw rxmapc" id="rxUlSp"></div></div><p class="legend"><span><i style="background:var(--warn)"></i>RX0</span><span><i style="background:var(--k4)"></i>RX1</span><span><i style="background:var(--nr)"></i>RX2</span><span><i style="background:var(--up)"></i>RX3</span><span><i style="background:var(--k4);opacity:.3"></i>PUCCH</span><span><i style="background:var(--sip);opacity:.3"></i>PRACH</span></p>
   <div class="row">${rxPlayBtn('ul','rxUlPlay')}<span class="note" id="rxUlT"></span></div></div>
  <div class="cols"><div>
   <div class="panel"><h3>Bản đồ nhiệt IoT: 24 giờ × PRB</h3><div class="scroll"><div class="ndw" id="rxUlHm"></div></div></div>
   <div class="panel"><h3>IoT và tải theo giờ</h3><div class="scroll"><div class="ndw" id="rxUlDy"></div></div><p class="legend"><span><i style="background:var(--warn)"></i>IoT trung bình</span><span><i style="background:var(--muted)"></i>tải DL (tỉ lệ)</span></p></div>
   <div class="panel"><h3>Sản phẩm PIM của hai sóng mang DL</h3><div id="rxUlPim">${rxUlPimTab()}</div></div>
   <div class="panel"><h3>Nhật ký đo và cảnh báo</h3><div id="rxUlLog"></div></div>
  </div><div>
   <div class="panel"><h3>Tham số</h3><div class="ctl">
    ${rSel('ul','band','Băng tần',Object.entries(RXBAND).map(([k,b])=>[k,b[0]+' · '+b[7]+' MHz, '+b[9]+' PRB']))}
    ${rSl('ul','nf','Hệ số tạp âm máy thu (NF)',1,8,0.5,v=>nF(v,1)+' dB','TS 38.104: yêu cầu độ nhạy tương ứng NF khoảng 5 dB; thiết bị thực thường 2…4 dB.')}
    ${C.fdd?rSl('ul','f1','Sóng mang DL f1 (tâm)',C.B[4]+P.b1/2,C.B[5]-P.b1/2,0.5,v=>nF(v,1)+' MHz')+rSl('ul','b1','Độ rộng f1',5,20,5,v=>v+' MHz')+rSl('ul','f2','Sóng mang DL f2 (tâm)',C.B[4]+P.b2/2,C.B[5]-P.b2/2,0.5,v=>nF(v,1)+' MHz')+rSl('ul','b2','Độ rộng f2',5,20,5,v=>v+' MHz')+rSl('ul','ptx','Công suất mỗi sóng mang',37,49,1,v=>v+' dBm'):''}
    ${rSl('ul','pimQ','Mức PIM của tuyến anten',-165,-100,1,v=>v+' dBc @2×43 dBm','≤ −153 dBc: đạt; −120 dBc: đầu nối lỏng, ăn mòn.','pimDet')}
    ${rSl('ul','nbPrb','Nhiễu băng hẹp: PRB bắt đầu',0,Math.max(0,C.nP-1),1,v=>v)}
    ${rSl('ul','nbW','Nhiễu băng hẹp: số PRB',1,30,1,v=>v)}
    ${rSl('ul','nbLv','Nhiễu băng hẹp: mức',-125,-80,1,v=>v+' dBm/PRB')}
    ${rSl('ul','wbLv','Nhiễu băng rộng: nâng nền',0,15,0.5,v=>nF(v,1)+' dB')}
    ${rSl('ul','brLv','Lỗi nhánh RX1: nâng nền',0,15,0.5,v=>nF(v,1)+' dB')}
    ${rSl('ul','ldLv','Nhiễu nội hệ thống lúc cao điểm',0,8,0.5,v=>nF(v,1)+' dB','Phụ thuộc P0, alpha của cell lân cận (mục 3).')}
    ${rSl('ul','hour','Giờ đang xem',0,23.9,0.1,v=>Math.floor(v)+'h')}
    ${srcCk}
   </div></div>
   <div class="panel"><h3>Kết quả</h3><dl class="kv" id="rxUlOut"></dl></div>
   <div class="panel"><h3>Dò nhiễu tự động</h3><div id="rxUlDg">${rxUlDiagHtml()}</div></div>
   <div class="panel"><h3>Cách khoanh vùng nguồn nhiễu</h3><div class="u3stk">
    <div style="border-left-color:var(--warn)"><b>PIM</b> · bám tải DL, lệch nhánh, tăng sau mưa gió; thử giảm công suất DL hoặc tắt một sóng mang để xem IoT tụt; đo PIM tại chỗ, siết hoặc thay đầu nối, xem vật kim loại gần anten.</div>
    <div style="border-left-color:var(--k4)"><b>Nhiễu ngoài</b> · không theo tải, có thể 24/7 hoặc theo giờ hành chính; quét phổ, dò hướng bằng anten định hướng, báo cơ quan quản lý tần số.</div>
    <div style="border-left-color:var(--nr)"><b>Phần cứng</b> · một nhánh cao: đổi chéo feeder/RRU để xem lỗi đi theo phần cứng hay theo anten; kiểm VSWR, cảnh báo RRU.</div>
    <div style="border-left-color:var(--up)"><b>Nội hệ thống</b> · đều các nhánh, theo giờ cao điểm: giảm P0, alpha ở cell lân cận, bật IRC, kiểm tra chồng lấn (mục 5).</div></div></div>
  </div></div>`;},
 after(){this.draw(true);},
 draw(force){const k=Math.floor(RXP.ul.hour);if(!force&&k===RXUL.lastDraw)return;RXUL.lastDraw=k;const s=(id,h)=>{const e=$('#'+id);if(e)e.innerHTML=h;};
  s('rxUlSp',rxUlSpec());s('rxUlHm',rxUlHeat());s('rxUlDy',rxUlDay());s('rxUlOut',rxUlOut());s('rxUlLog',rxUlLog());
  const t=$('#rxUlT');if(t)t.textContent=k+'h · tải '+Math.round(rxLoad(k+0.5)*100)+' %';
  const o=$('[data-rxi="ul:hour"]');if(o&&document.activeElement!==o){o.value=RXP.ul.hour;const out=o.parentElement.querySelector('output');if(out)out.textContent=RXF['ul:hour'](RXP.ul.hour);}},
 tick(dt){if(!RXS.pause){RXP.ul.hour+=dt*RXP.ul.play/60;if(RXP.ul.hour>=24)RXP.ul.hour-=24;}this.draw(dt===0);},
 upd(k){if(k==='hour'){this.draw(true);return;}if(k==='guess')return;
  if(k==='band'){const C=rxUlCfg();const P=RXP.ul;if(C.fdd){P.f1=C.B[4]+P.b1/2+5;P.f2=C.B[5]-P.b2/2-3;}P.nbPrb=Math.min(P.nbPrb,C.nP-1);renderRx();return;}
  RXUL.R=rxUlSim(RXUL.quiz?[RXUL.quiz]:null);RXUL.F=rxUlFeat(RXUL.R);const p=$('#rxUlPim');if(p)p.innerHTML=rxUlPimTab();const d=$('#rxUlDg');if(d)d.innerHTML=rxUlDiagHtml();this.draw(true);},
 act(a){if(a==='play')rxPlayTog('rxUlPlay');
  else if(a==='quiz'){const C=rxUlCfg(),hit=rxPimHit(),pool=RXSRC.map(s=>s[0]).filter(s=>(hit||s!=='pim')&&(!C.fdd||s!=='duct'));const r=Math.floor(Math.random()*pool.length);RXUL.quiz=pool[r];
    const P=RXP.ul;if(RXUL.quiz==='pim')P.pimQ=Math.max(P.pimQ,-122);if(RXUL.quiz==='nb'){P.nbPrb=Math.floor(Math.random()*(C.nP-10));P.nbLv=-100;}if(RXUL.quiz==='wb')P.wbLv=Math.max(P.wbLv,5);if(RXUL.quiz==='br')P.brLv=Math.max(P.brLv,7);if(RXUL.quiz==='load')P.ldLv=Math.max(P.ldLv,4);renderRx();}
  else if(a==='quit'){RXUL.quiz=null;renderRx();}
  else if(a==='check'){const q=RXUL.quiz,g=RXP.ul.guess,o=$('#rxUlQ');const nm=k=>(RXSRC.find(x=>x[0]===k)||[,k])[1];
    if(o)o.innerHTML=g===q?`<p class="kpC ok">Đúng: ${nE(nm(q))}.</p>`:`<p class="kpC no">Chưa đúng. Nguồn thật: ${nE(nm(q))}.</p><p class="note">${nE(rxUlDiag(RXUL.F,RXUL.R.C).map(d=>d[2]).join(' · '))}</p>`;}}
};

/* ---------- Mục 3: Điều khiển công suất PUSCH/PUCCH (P0, alpha, TPC), PHR ---------- */
RXP.pc={load:50,p0:-100,alpha:0.8,mrb:20,mu:1,pcmax:23,dtf:0,d:400,pen:0,iot:3,p0c:-110,dfp:0,isd:500,sh:8,
  tpc:'acc',sinrT:10,v:30,phrPer:20,phrProh:10,phrChg:3,play:4,seed:3};
/* chỉ số báo cáo PH theo TS 38.133 bảng 10.1.17.1-1 (64 mức; bước 1 dB tới 22 dB, 2 dB tới 38 dB) */
function rxPhIdx(ph){if(ph<-32)return 0;if(ph<22)return Math.floor(ph)+33;if(ph<38)return 55+Math.floor((ph-22)/2);return 63;}
const rxEff=s=>nC(0.6*Math.log2(1+nLin(s)),0,5.5);
/* một UE: công thức TS 38.213 §7.1.1 (PUSCH) và §7.2.1 (PUCCH) */
function rxPcOne(){const P=RXP.pc,PL=rUma(P.d,3.5)+P.pen,bw=10*Math.log10(Math.pow(2,P.mu)*P.mrb);
  const open=P.p0+bw+P.alpha*PL+P.dtf,pus=Math.min(P.pcmax,open),ph=P.pcmax-open;
  const pucOpen=P.p0c+10*Math.log10(Math.pow(2,P.mu)*1)+PL+P.dfp,puc=Math.min(P.pcmax,pucOpen);
  const N=rxN(3.5,15*Math.pow(2,P.mu)),rx=pus-10*Math.log10(P.mrb)-PL+17,sinr=rx-(N+P.iot);
  const rxc=puc-PL+17,sinrc=rxc-(N+P.iot);
  const thr=rxEff(sinr)*P.mrb*12*15*Math.pow(2,P.mu)/1000;
  return {PL,bw,open,pus,ph,idx:rxPhIdx(ph),pucOpen,puc,N,rx,sinr,rxc,sinrc,thr,lim:open>P.pcmax};}
/* Monte Carlo: 19 cell lục giác, mỗi cell một UE cùng PRB; xem UE ở cell giữa */
function rxPcMC(alpha,p0,n){const P=RXP.pc,r=nRng(500+P.seed),R=P.isd/Math.sqrt(3),cells=[[0,0]];
  for(let k=0;k<6;k++){const a=Math.PI/3*k+Math.PI/6;cells.push([P.isd*Math.cos(a),P.isd*Math.sin(a)]);}
  for(let k=0;k<12;k++){const a=Math.PI/6*k+Math.PI/6,d=k%2?P.isd*Math.sqrt(3):2*P.isd;cells.push([d*Math.cos(a),d*Math.sin(a)]);}
  const N=rxN(3.5,15*Math.pow(2,P.mu)),mpr=10*Math.log10(P.mrb),bw1=10*Math.log10(Math.pow(2,P.mu)),out={s:[],t:[],iot:[],lim:0};
  for(let it=0;it<n;it++){let I=0,s0=0;
    for(let c=0;c<cells.length;c++){let x,y;do{x=(r()*2-1)*R;y=(r()*2-1)*R;}while(Math.hypot(x,y)>R||Math.hypot(x,y)<20);
      const ux=cells[c][0]+x,uy=cells[c][1]+y,sh=nGs(r)*P.sh,PLo=rUma(Math.hypot(x,y),3.5)+sh+P.pen*r();
      const pp=Math.min(P.pcmax-mpr,p0+bw1+alpha*PLo);if(c===0&&p0+bw1+alpha*PLo>P.pcmax-mpr)out.lim++;
      if(c===0)s0=pp-PLo+17;else if(r()<P.load/100){/* UE gắn cell phục vụ tốt nhất: suy hao tới gNB giữa không nhỏ hơn tới cell của nó */const PLv=Math.max(PLo,rUma(Math.hypot(ux,uy),3.5)+nGs(r)*P.sh);I+=nLin(pp-PLv+17);}}
    const sinr=s0-nDb(nLin(N)+I);out.s.push(sinr);out.t.push(rxEff(sinr)*P.mrb*12*15*Math.pow(2,P.mu)/1000);out.iot.push(nDb(nLin(N)+I)-N);}
  out.lim/=n;return out;}
function rxPcSweep(){const P=RXP.pc,plRef=rUma(P.isd/3,3.5),A=[0.4,0.5,0.6,0.7,0.8,0.9,1],o=[];
  A.forEach(a=>{const p0=P.p0+(P.alpha-a)*plRef,m=rxPcMC(a,p0,500);o.push({a,p0,e:rPct(m.t,0.05),m:rPct(m.t,0.5),iot:m.iot.reduce((x,y)=>x+y,0)/m.iot.length});});return o;}
/* mô phỏng vòng kín TPC + PHR theo thời gian, bước 20 ms */
function rxPcLoop(){const P=RXP.pc,dt=0.02,T=60,n=Math.round(T/dt),r=nRng(77+P.seed),N=rxN(3.5,15*Math.pow(2,P.mu)),bw=10*Math.log10(Math.pow(2,P.mu)*P.mrb);
  const S=[],msgs=[],ev=[];let f=0,sh=0,tPer=0,tPro=0,lastPL=null,lim=0,nPhr=0,limOn=false;const a=Math.exp(-dt*P.v/3.6/30),b=Math.sqrt(1-a*a);
  const pos=t=>{const u=(t%T)/T;return 60+1100*(u<0.5?u*2:2-u*2);};
  for(let i=0;i<n;i++){const t=i*dt,d=pos(t);sh=a*sh+b*nGs(r)*6;const PL=rUma(d,3.5)+sh+P.pen,fad=nGs(r)*1.2;
    const open=P.p0+bw+P.alpha*PL+P.dtf,p=Math.min(P.pcmax,open+f),ph=P.pcmax-(open+f);
    const sinr=p-10*Math.log10(P.mrb)-PL+17+fad-(N+P.iot);
    /* gNB: lệnh TPC trong DCI 0_1 mỗi 20 ms */
    let d0=0;if(P.tpc==='acc'){d0=sinr<P.sinrT-3?3:sinr<P.sinrT-0.5?1:sinr>P.sinrT+0.5?-1:0;if(p>=P.pcmax&&d0>0)d0=0;f=nC(f+d0,-20,20);}
    else{const need=P.sinrT-(sinr-f);f=need>2.5?4:need>0?1:need>-2.5?-1:-4;d0=f;}
    if(d0&&(i%10===0||Math.abs(d0)===3||Math.abs(d0)===4))msgs.push({t,p:'DCI',m:'DCI 0_1 · TPC '+(d0>0?'+':'')+d0+' dB',a:'gNB → UE',d:(P.tpc==='acc'?'tích luỹ, f = ':'tuyệt đối, f = ')+nF(f,0)+' dB; SINR đo '+nF(sinr,1)+' dB, đích '+P.sinrT+' dB'});
    /* PHR: hết chu kỳ, hoặc suy hao đổi quá phr-Tx-PowerFactorChange khi đã hết thời gian cấm */
    tPer-=dt*1000;tPro-=dt*1000;let trig='';
    if(lastPL==null)trig='lần đầu sau cấu hình';else if(tPer<=0)trig='phr-PeriodicTimer hết hạn';else if(tPro<=0&&Math.abs(PL-lastPL)>=P.phrChg)trig='suy hao đổi '+nF(Math.abs(PL-lastPL),1)+' dB ≥ '+P.phrChg+' dB';
    if(trig){nPhr++;lastPL=PL;tPer=P.phrPer*10;tPro=P.phrProh*10;msgs.push({t,p:'MAC',m:'PHR MAC CE · PH '+nF(ph,1)+' dB (chỉ số '+rxPhIdx(ph)+')',a:'UE → gNB',d:trig+'; P_CMAX,f,c = '+P.pcmax+' dBm'});ev.push([t,'PHR','var(--k4)']);}
    if(ph<0&&!limOn){limOn=true;lim++;ev.push([t,'giới hạn','var(--warn)']);msgs.push({t,p:'PHY',m:'UE chạm P_CMAX',a:'UE',d:'PH < 0: gNB nên giảm số PRB cấp cho UE (link adaptation theo PHR)'});}
    if(ph>1)limOn=false;
    S.push({t,d,PL,p,ph,sinr,f});}
  return {T,dt,S,msgs,ev,nPhr,lim,limT:S.filter(s=>s.ph<0).length*dt};}
const RXPC={t:0,L:null,W:null,lastDraw:-1};
function rxPcFormula(X){const P=RXP.pc;
  return `<div class="rxeq"><b>P<sub>PUSCH</sub></b> = min{ P<sub>CMAX</sub> ; P<sub>O_PUSCH</sub> + 10·log<sub>10</sub>(2<sup>μ</sup>·M<sub>RB</sub>) + α·PL + Δ<sub>TF</sub> + f }<br>
  = min{ ${P.pcmax} ; ${P.p0} + ${nF(X.bw,1)} + ${nF(P.alpha,1)} × ${nF(X.PL,1)} + ${P.dtf} } = <b>${nF(X.pus,1)} dBm</b>${X.lim?' <span class="kpC no">giới hạn P_CMAX</span>':''}</div>
  <div class="rxeq"><b>PH</b> (loại 1) = P<sub>CMAX</sub> − (P<sub>O_PUSCH</sub> + 10·log<sub>10</sub>(2<sup>μ</sup>·M<sub>RB</sub>) + α·PL + Δ<sub>TF</sub> + f) = <b>${nF(X.ph,1)} dB</b> → chỉ số báo cáo <b>${X.idx}</b></div>
  <div class="rxeq"><b>P<sub>PUCCH</sub></b> = min{ P<sub>CMAX</sub> ; P<sub>O_PUCCH</sub> + 10·log<sub>10</sub>(2<sup>μ</sup>·M<sub>RB</sub>) + PL + Δ<sub>F_PUCCH</sub> + Δ<sub>TF</sub> + g } = min{ ${P.pcmax} ; ${P.p0c} + ${nF(10*Math.log10(Math.pow(2,P.mu)),1)} + ${nF(X.PL,1)} + ${P.dfp} } = <b>${nF(X.puc,1)} dBm</b></div>`;}
function rxPcOut(X){return rKv('Suy hao PL (UMa NLOS + xuyên tường)',nF(X.PL,1)+' dB')+rKv('Công suất thu PUSCH / PRB tại gNB',nF(X.rx,1)+' dBm')+rKv('Noise floor / PRB + IoT',nF(X.N,1)+' + '+RXP.pc.iot+' dB')
  +rKv('SINR PUSCH',nF(X.sinr,1)+' dB')+rKv('Tốc độ UL ước tính',nF(X.thr,1)+' Mbit/s')+rKv('SINR PUCCH (1 PRB)',nF(X.sinrc,1)+' dB '+(X.sinrc<-3?'<span class="kpC no">thấp: dễ mất HARQ-ACK/CSI</span>':''));}
function rxPcSwPlot(){const W=RXPC.W,P=RXP.pc,mx=Math.max(1,...W.map(w=>w.m))*1.15;
  return nPlot({w:680,h:200,x0:0.4,x1:1,y0:0,y1:mx,yt:[0,mx/4,mx/2,3*mx/4].map(v=>Math.round(v*10)/10),yd:1,xt:[0.4,0.5,0.6,0.7,0.8,0.9,1],xf:v=>nF(v,1),
    series:[{pts:W.map(w=>[w.a,w.e]),c:'var(--warn)'},{pts:W.map(w=>[w.a,w.m]),c:'var(--nr)'}],hl:[],marks:[[P.alpha,'đang chọn','var(--up)',0]],ylab:'Mbit/s',aria:'Tốc độ UL rìa cell và trung vị theo alpha'});}
function rxPcCdf(){const P=RXP.pc,m=rxPcMC(P.alpha,P.p0,800),s=m.s.slice().sort((a,b)=>a-b),pts=s.filter((v,i)=>i%8===0).map((v,i,a)=>[v,(i+1)/a.length]);RXPC.M=m;
  return nPlot({w:680,h:190,x0:-15,x1:35,y0:0,y1:1,yt:[0,0.25,0.5,0.75,1],yd:2,xt:[-15,-5,5,15,25,35],series:[{pts,c:'var(--k1)'}],hl:[[0.05,'var(--warn)','5 %']],ylab:'CDF',aria:'Phân bố SINR PUSCH'});}
function rxPcLoopPlot(){const L=RXPC.L,pts=k=>L.S.filter((s,i)=>i%5===0).map(s=>[s.t,s[k]]),cur=RXPC.t;
  const p1=nPlot({w:680,h:200,x0:0,x1:L.T,y0:-20,y1:30,yt:[-20,-10,0,10,20,30],xt:[0,10,20,30,40,50,60],series:[{pts:pts('p'),c:'var(--warn)'},{pts:pts('ph'),c:'var(--k4)'},{pts:pts('sinr'),c:'var(--nr)',w:1.2}],
    hl:[[RXP.pc.pcmax,'var(--warn)','P_CMAX'],[0,'var(--muted)','PH = 0']],marks:L.ev.filter(e=>e[1]!=='PHR').slice(0,14).map((e,i)=>[e[0],e[1],e[2],i%3]),cur,ylab:'dBm / dB',aria:'Công suất PUSCH, PH và SINR theo thời gian'});
  return p1;}
function rxPcMap(){const L=RXPC.L,i=Math.min(L.S.length-1,Math.floor(RXPC.t/L.dt)),s=L.S[i],W=720,H=80,X=d=>40+d/1250*(W-80);
  return `<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="UE đi xa dần trạm"><line x1="${X(0)}" y1="50" x2="${X(1250)}" y2="50" class="ndroad"/><rect x="${X(0)-7}" y="22" width="14" height="28" class="ndbs n"/><text x="${X(0)}" y="16" class="u3x" text-anchor="middle">gNB</text>
   <line x1="${X(s.d)}" y1="50" x2="${X(0)}" y2="34" class="ndlnk n"/><circle cx="${X(s.d)}" cy="50" r="8" class="ndue${s.ph<0?' rxlim':''}"/><text x="${X(s.d)}" y="74" class="u3x" text-anchor="middle">${Math.round(s.d)} m · ${nF(s.p,1)} dBm · PH ${nF(s.ph,1)} dB</text></svg>`;}
function rxPcAdv(X){const P=RXP.pc,o=[],W=RXPC.W;if(!W)return'';const best=W.reduce((a,b)=>b.e>a.e?b:a);
  if(X.lim)o.push('UE ở '+P.d+' m đã chạm P_CMAX: PH âm, gNB phải giảm số PRB. Muốn phủ xa hơn: giảm M_RB cho UE rìa, dùng PUSCH repetition hoặc băng thấp.');
  if(Math.abs(best.a-P.alpha)>0.05)o.push('Với ISD '+P.isd+' m, alpha ≈ '+nF(best.a,1)+' (P0 ≈ '+Math.round(best.p0)+' dBm) cho tốc độ rìa cell tốt nhất trong lần chạy này.');
  if(P.alpha>=1)o.push('alpha = 1 bù đủ suy hao: UE rìa phát mạnh, nhiễu cell lân cận cao (IoT tăng). Phân số 0,7…0,8 thường cân bằng hơn.');
  if(P.p0>-80)o.push('P0 cao ('+P.p0+' dBm): mọi UE phát mạnh hơn, IoT tăng, PH của UE rìa cạn nhanh.');
  if(X.sinrc<-3)o.push('PUCCH yếu: tăng P0_PUCCH hoặc dùng định dạng PUCCH dài (format 1, 3, 4) cho UE rìa.');
  if(!o.length)o.push('Cấu hình hợp lý cho UE đang xét.');return rUl(o);}
RXR.pc={
 html(){const P=RXP.pc,X=rxPcOne();RXPC.W=rxPcSweep();RXPC.L=rxPcLoop();if(RXPC.t>RXPC.L.T)RXPC.t=0;
  return `<div class="cols"><div>
   <div class="panel"><h3>Công thức công suất cho một UE</h3>${rxPcFormula(X)}<p class="note">PL do UE tự ước lượng = referenceSignalPower − RSRP lọc lớp 3. P<sub>O_PUSCH</sub> = P<sub>O_NOMINAL_PUSCH</sub> + P<sub>O_UE_PUSCH</sub>; f là phần vòng kín từ lệnh TPC. Mô hình kênh rút gọn TR 38.901 UMa.</p></div>
   <div class="panel"><h3>Đánh đổi alpha: rìa cell và trung vị (19 cell, Monte Carlo)</h3><div class="scroll"><div class="ndw" id="rxPcSw">${rxPcSwPlot()}</div></div><p class="legend"><span><i style="background:var(--warn)"></i>tốc độ 5 % (rìa)</span><span><i style="background:var(--nr)"></i>trung vị</span><span>trục ngang: alpha</span></p><p class="note">Khi đổi alpha, P0 tự chỉnh để UE ở suy hao tham chiếu (cách trạm ISD/3) giữ nguyên công suất, đúng cách kỹ sư hay tinh chỉnh cặp P0 – alpha.</p></div>
   <div class="panel"><h3>Phân bố SINR PUSCH với cấu hình hiện tại</h3><div class="scroll"><div class="ndw" id="rxPcCdf">${rxPcCdf()}</div></div><p class="legend"><span>trục ngang: SINR PUSCH (dB)</span></p><dl class="kv" id="rxPcMc"></dl></div>
   <div class="panel"><h3>Vòng kín TPC và báo cáo PHR theo thời gian</h3><div class="scroll"><div class="ndw" id="rxPcMap"></div></div>
    <div class="row">${rxPlayBtn('pc','rxPcPlay')}<button type="button" class="btn sm" data-rxa="pc:rst">⟲ Về đầu</button><button type="button" class="btn sm" data-rxa="pc:seed">Đổi bóng che</button><span class="note" id="rxPcT"></span></div>
    <div class="scroll"><div class="ndw" id="rxPcLp"></div></div><p class="legend"><span><i style="background:var(--warn)"></i>P_PUSCH</span><span><i style="background:var(--k4)"></i>PH</span><span><i style="background:var(--nr)"></i>SINR</span><span>trục ngang: giây</span></p></div>
   <div class="panel"><h3>Nhật ký DCI / MAC (TPC, PHR)</h3><div id="rxPcLog"></div></div>
  </div><div>
   <div class="panel"><h3>Tham số</h3><div class="ctl">
    ${rSl('pc','p0','P0 nominal PUSCH',-126,-60,1,v=>v+' dBm','p0-NominalWithGrant: −202 … 24 dBm.','p0Pusch')}
    ${rSel('pc','alpha','alpha (hệ số bù suy hao)',[[0,'0'],[0.4,'0,4'],[0.5,'0,5'],[0.6,'0,6'],[0.7,'0,7'],[0.8,'0,8'],[0.9,'0,9'],[1,'1']],'','alpha')}
    ${rSl('pc','p0c','P0 nominal PUCCH',-130,-90,1,v=>v+' dBm','','p0Pucch')}
    ${rSl('pc','dfp','Δ_F_PUCCH (theo định dạng)',-2,8,1,v=>v+' dB','','dFPucch')}
    ${rSl('pc','mrb','Số PRB cấp cho UE',1,100,1,v=>v)}
    ${rSel('pc','mu','SCS',[[0,'15 kHz (μ = 0)'],[1,'30 kHz (μ = 1)']])}
    ${rSel('pc','pcmax','P_CMAX (lớp công suất)',[[23,'23 dBm · PC3'],[26,'26 dBm · PC2'],[20,'20 dBm (giảm do MPR)']],'','pMax')}
    ${rSl('pc','d','Khoảng cách UE đang xét',30,1500,10,v=>v+' m')}
    ${rSl('pc','pen','Xuyên tường',0,25,1,v=>v+' dB')}
    ${rSl('pc','iot','IoT tại gNB',0,15,0.5,v=>nF(v,1)+' dB')}
    ${rSl('pc','isd','Khoảng cách trạm (Monte Carlo)',200,2000,50,v=>v+' m')}${rSl('pc','load','Tải cell lân cận (cùng PRB)',10,100,10,v=>v+' %')}
    ${rSel('pc','tpc','Kiểu TPC',[['acc','Tích luỹ (−1, 0, +1, +3 dB)'],['abs','Tuyệt đối (−4, −1, +1, +4 dB)']],'','tpcAcc')}
    ${rSl('pc','sinrT','SINR đích của vòng kín',0,20,1,v=>v+' dB')}
    ${rSel('pc','phrPer','phr-PeriodicTimer',[[10,'sf10'],[20,'sf20'],[50,'sf50'],[100,'sf100'],[200,'sf200'],[500,'sf500'],[1000,'sf1000']],'Đơn vị subframe 1 ms (giá trị × 10 ms ở đây là rút gọn để dễ thấy).','phrPer')}
    ${rSel('pc','phrProh','phr-ProhibitTimer',[[0,'sf0'],[10,'sf10'],[20,'sf20'],[50,'sf50'],[100,'sf100']],'','phrProh')}
    ${rSel('pc','phrChg','phr-Tx-PowerFactorChange',[[1,'dB1'],[3,'dB3'],[6,'dB6']],'','phrChg')}
    ${rSl('pc','v','Tốc độ UE',3,120,1,v=>v+' km/h')}
    ${rSl('pc','play','Tua nhanh',1,10,1,v=>'× '+v)}
   </div></div>
   <div class="panel"><h3>Kết quả cho UE đang xét</h3><dl class="kv" id="rxPcOut">${rxPcOut(X)}</dl></div>
   <div class="panel"><h3>Gợi ý tối ưu</h3><div id="rxPcAdv">${rxPcAdv(X)}</div></div>
   <div class="panel"><h3>Ghi nhớ</h3><div class="u3stk">
    <div style="border-left-color:var(--warn)"><b>P0</b> · mức công suất thu mong muốn trên mỗi PRB (khi alpha = 1). Tăng P0: UE phát mạnh hơn, SINR tăng nhưng IoT cell lân cận cũng tăng.</div>
    <div style="border-left-color:var(--nr)"><b>alpha</b> · bù một phần suy hao (fractional PC). alpha nhỏ: UE rìa phát yếu hơn, ít nhiễu, đổi lại tốc độ rìa giảm.</div>
    <div style="border-left-color:var(--k4)"><b>TPC</b> · lệnh 2 bit trong DCI 0_0/0_1 (PUSCH), 1_0/1_1 (PUCCH), DCI 2_2 cho nhóm UE.</div>
    <div style="border-left-color:var(--up)"><b>PHR</b> · MAC CE báo P_CMAX trừ công suất cần; PH âm nghĩa là UE thiếu công suất cho số PRB hiện tại.</div></div></div>
  </div></div>`;},
 after(){const m=RXPC.M,o=$('#rxPcMc');if(m&&o)o.innerHTML=rKv('SINR 5 % / 50 %',nF(rPct(m.s,0.05),1)+' / '+nF(rPct(m.s,0.5),1)+' dB')+rKv('Tốc độ 5 % / 50 %',nF(rPct(m.t,0.05),2)+' / '+nF(rPct(m.t,0.5),2)+' Mbit/s')+rKv('IoT trung bình ở gNB giữa',nF(m.iot.reduce((a,b)=>a+b,0)/m.iot.length,1)+' dB')+rKv('UE giới hạn công suất',nF(m.lim*100,1)+' %');this.draw(true);},
 draw(force){const L=RXPC.L;if(!L)return;const k=Math.floor(RXPC.t*4);if(!force&&k===RXPC.lastDraw)return;RXPC.lastDraw=k;const s=(id,h)=>{const e=$('#'+id);if(e)e.innerHTML=h;};
  s('rxPcMap',rxPcMap());s('rxPcLp',rxPcLoopPlot());const ms=L.msgs.filter(m=>m.t<=RXPC.t);s('rxPcLog',rLog(ms,12));
  const t=$('#rxPcT');if(t)t.textContent=`t = ${nF(RXPC.t,1)} / ${L.T} s · PHR ${L.nPhr} lần · thời gian PH < 0: ${nF(L.limT,1)} s`;},
 tick(dt){if(!RXS.pause){RXPC.t+=dt*RXP.pc.play;if(RXPC.t>RXPC.L.T)RXPC.t=0;}this.draw(dt===0);},
 upd(k){if(k==='play')return;const X=rxPcOne(),s=(id,h)=>{const e=$('#'+id);if(e)e.innerHTML=h;};
  const loopK=['tpc','sinrT','phrPer','phrProh','phrChg','v','seed','p0','alpha','mrb','mu','pcmax','pen','iot','dtf'];
  if(['p0','alpha','mrb','mu','pcmax','isd','pen','seed','load'].includes(k)){RXPC.W=rxPcSweep();s('rxPcSw',rxPcSwPlot());s('rxPcCdf',rxPcCdf());this.after();}
  if(loopK.includes(k)){RXPC.L=rxPcLoop();}
  const f=$('#t-ro .rxeq');if(f)f.parentElement.innerHTML=`<h3>Công thức công suất cho một UE</h3>${rxPcFormula(X)}<p class="note">PL do UE tự ước lượng = referenceSignalPower − RSRP lọc lớp 3. P<sub>O_PUSCH</sub> = P<sub>O_NOMINAL_PUSCH</sub> + P<sub>O_UE_PUSCH</sub>; f là phần vòng kín từ lệnh TPC. Mô hình kênh rút gọn TR 38.901 UMa.</p>`;
  s('rxPcOut',rxPcOut(X));s('rxPcAdv',rxPcAdv(X));this.draw(true);},
 act(a){if(a==='play')rxPlayTog('rxPcPlay');else if(a==='rst'){RXPC.t=0;this.draw(true);}else if(a==='seed'){RXP.pc.seed++;this.upd('seed');}}
};

/* ---------- Mục 4: RACH/PRACH (root sequence, ZCZ, bán kính cell), timing advance ---------- */
RXP.rach={fmt:'0',mu:1,zcz:7,lr:0,pre:5,dly:3,snr:-14,thr:11,ds:5.2,intf:'none',iD:9,iPre:20,iLv:0,
  p0:-104,step:2,tmax:10,ulI:3,rate:40,ncb:56,roP:10,rwin:10,
  h:30,tilt:6,rPlan:0.8,seed:5,play:1};
/* NCS theo zeroCorrelationZoneConfig, tập không hạn chế: TS 38.211 bảng 6.3.3.1-5 (1,25 kHz), -6 (5 kHz), -7 (L = 139) */
const RXNCS={'1.25':[0,13,15,18,22,26,32,38,46,59,76,93,119,167,279,419],'5':[0,13,26,33,38,41,49,55,64,76,93,119,139,209,279,419],s:[0,2,4,6,8,10,12,13,15,17,19,23,27,34,46,69]};
/* định dạng: L, ΔfRA, N_u (κ), N_CP (κ), tổng thời lượng (µs, chỉ định dạng dài) ; định dạng ngắn tính theo κ·2^−μ */
const RXFMT={
  '0':{n:'0 · L = 839, 1,25 kHz',L:839,ra:'1.25',nu:24576,ncp:3168,tot:1000,rep:1},
  '1':{n:'1 · L = 839, 1,25 kHz (dài, cell rất lớn)',L:839,ra:'1.25',nu:2*24576,ncp:21024,tot:3000,rep:2},
  '2':{n:'2 · L = 839, 1,25 kHz (lặp 4 lần, phủ sâu)',L:839,ra:'1.25',nu:4*24576,ncp:4688,tot:3500,rep:4},
  '3':{n:'3 · L = 839, 5 kHz (tốc độ cao)',L:839,ra:'5',nu:4*6144,ncp:3168,tot:1000,rep:4},
  A1:{n:'A1 · L = 139',L:139,ra:'s',nu:2*2048,ncp:288,rep:2},A2:{n:'A2 · L = 139',L:139,ra:'s',nu:4*2048,ncp:576,rep:4},A3:{n:'A3 · L = 139',L:139,ra:'s',nu:6*2048,ncp:864,rep:6},
  B4:{n:'B4 · L = 139',L:139,ra:'s',nu:12*2048,ncp:936,rep:12},C0:{n:'C0 · L = 139',L:139,ra:'s',nu:2048,ncp:1240,rep:1},C2:{n:'C2 · L = 139',L:139,ra:'s',nu:4*2048,ncp:2048,rep:4}
};
/* chỉ số logic → u vật lý: L = 839 trích 24 giá trị đầu bảng 6.3.3.1-3 (cần đối chiếu); L = 139 theo quy luật 1, 138, 2, 137 … (bảng 6.3.3.1-4) */
const RXU839=[129,710,140,699,120,719,210,629,168,671,84,755,105,734,93,746,70,769,60,779,2,837,1,838];
const rxRoot=(L,i)=>L===839?RXU839[i%RXU839.length]:(i%2?139-Math.ceil((i+1)/2):Math.ceil((i+1)/2));
function rxFmtT(k,mu){const F=RXFMT[k],sc=F.L===139?Math.pow(2,-mu):1,us=x=>x*rxK*rxTc*1e6*sc;
  const tseq=us(F.nu/F.rep),tcp=us(F.ncp),tgt=F.tot?F.tot-us(F.ncp)-us(F.nu):null;return {F,tseq,tcp,tgt,ncsT:F.ra==='s'?RXNCS.s:RXNCS[F.ra]};}
/* bán kính tối đa (km) theo NCS, CP, GT */
function rxRad(k,mu,ncs,ds){const T=rxFmtT(k,mu),L=T.F.L,rN=ncs?rxC*(ncs*T.tseq/L-ds)/2e6:Infinity,rC=rxC*(T.tcp-ds)/2e6,rG=T.tgt!=null?rxC*T.tgt/2e6:Infinity;
  return {rN,rC,rG,r:Math.max(0,Math.min(rN,rC,rG)),per:ncs?Math.floor(L/ncs):1,roots:Math.ceil(64/(ncs?Math.floor(L/ncs):1)),T};}
/* chuỗi Zadoff-Chu và bộ tương quan vòng */
function rxZc(u,L){const re=new Float64Array(L),im=new Float64Array(L);for(let n=0;n<L;n++){const ph=-Math.PI*u*n*(n+1)/L;re[n]=Math.cos(ph);im[n]=Math.sin(ph);}return [re,im];}
function rxDetect(){const P=RXP.rach,T=rxFmtT(P.fmt,P.mu),L=T.F.L,ncs=T.ncsT[P.zcz]||0,per=ncs?Math.floor(L/ncs):1,u=rxRoot(L,P.lr),[xr,xi]=rxZc(u,L),r=nRng(900+P.seed);
  const smp=T.tseq/L;/* µs mỗi mẫu */
  const D=Math.round(2*P.dly/rxC*1e6/smp),v=Math.min(P.pre,per-1),Cv=v*ncs;
  const yr=new Float64Array(L),yi=new Float64Array(L),sg=Math.sqrt(Math.pow(10,-P.snr/10)/2);
  for(let n=0;n<L;n++){const k=((n-D+Cv)%L+L)%L;yr[n]=xr[k]+nGs(r)*sg;yi[n]=xi[k]+nGs(r)*sg;}
  if(P.intf!=='none'){const u2=P.intf==='same'?u:rxRoot(L,P.lr+2*Math.max(1,Math.ceil(64/per))),[zr,zi]=rxZc(u2,L),D2=Math.round(2*P.iD/rxC*1e6/smp),C2=(Math.min(P.iPre,per-1))*ncs,a=Math.pow(10,P.iLv/20);
    for(let n=0;n<L;n++){const k=((n-D2+C2)%L+L)%L;yr[n]+=a*zr[k];yi[n]+=a*zi[k];}}
  const pw=new Float64Array(L);let mean=0;
  for(let t=0;t<L;t++){let sr=0,si=0;for(let n=0;n<L;n++){const k=(n+t)%L;sr+=yr[n]*xr[k]+yi[n]*xi[k];si+=yi[n]*xr[k]-yr[n]*xi[k];}pw[t]=(sr*sr+si*si)/(L*L);mean+=pw[t];}
  mean/=L;const db=[...pw].map(x=>nDb(x/mean));
  /* cửa sổ của tiền tố w: τ ∈ (C_w − NCS, C_w] */
  const det=[];if(ncs){for(let w=0;w<per;w++){let best=-99,bt=0;for(let j=0;j<ncs;j++){const t=((w*ncs-j)%L+L)%L;if(db[t]>best){best=db[t];bt=j;}}if(best>P.thr)det.push({w,pk:best,dl:bt});}}
  else{let best=-99,bt=0;db.forEach((x,t)=>{if(x>best){best=x;bt=t;}});if(best>P.thr)det.push({w:0,pk:best,dl:bt});}
  return {T,L,ncs,per,u,D,v,Cv,db,det,smp};}
function rxPdpPlot(R){const P=RXP.rach,pts=R.db.map((v,t)=>[t,v]),bands=[];
  if(R.ncs){for(let w=0;w<R.per;w++){const a=w*R.ncs-R.ncs+1,b=w*R.ncs+1;if(w%2===0)bands.push([Math.max(0,a),b,'var(--k4)',.08]);if(w===R.v)bands.push([Math.max(0,a),b,'var(--nr)',.18]);}}
  const xt=[];const st=R.L>200?100:20;for(let x=0;x<=R.L;x+=st)xt.push(x);
  return nPlot({w:680,h:220,x0:0,x1:R.L,y0:-10,y1:Math.max(25,...R.db)+2,yt:[-10,0,10,20,30],xt,series:[{pts,c:'var(--k1)',w:1}],hl:[[P.thr,'var(--warn)','ngưỡng']],bands,
    marks:R.det.slice(0,8).map((d,i)=>[((d.w*R.ncs-d.dl)%R.L+R.L)%R.L,'#'+d.w,d.w===R.v?'var(--nr)':'var(--warn)',i%3]),ylab:'dB trên mức trung bình',aria:'Hàm tương quan tiền tố'});}
function rxDetOut(R){const P=RXP.rach,sm=R.smp,ok=R.det.find(d=>d.w===R.v&&Math.abs(d.dl-R.D)<=2),wrong=R.det.filter(d=>d!==ok);
  const tr=x=>nF(x*sm*rxC/2e6*1000,0)+' m';
  return rKv('Gốc u (logic '+P.lr+')',R.u+' · L = '+R.L)+rKv('N_CS / tiền tố mỗi gốc',R.ncs+' / '+R.per)+rKv('Mỗi mẫu',nF(sm,3)+' µs ≈ '+nF(sm*rxC/2e3,0)+' m (một chiều)')
   +rKv('UE gửi',`tiền tố #${R.v}, trễ ${R.D} mẫu (${nF(P.dly,2)} km)`)
   +rKv('gNB thấy',R.det.length?R.det.map(d=>`#${d.w} (TA ${tr(d.dl)}, ${nF(d.pk,1)} dB)`).join('; '):'không có tiền tố vượt ngưỡng')
   +rKv('Kết luận',ok&&!wrong.length?'<span class="kpC ok">đúng tiền tố, đúng TA</span>':!ok&&R.det.some(d=>d.w===(R.v-1+R.per)%R.per)&&R.D>=R.ncs?'<span class="kpC no">trễ ≥ N_CS: nhận nhầm thành tiền tố khác, TA sai</span>':wrong.length?'<span class="kpC no">có tiền tố “ma” (false alarm / trùng gốc với cell lân cận)</span>':!R.det.length?'<span class="kpC mid">bỏ lỡ (SNR thấp hoặc ngưỡng cao)</span>':'<span class="kpC mid">sai lệch TA</span>');}
function rxNcsTab(){const P=RXP.rach,T=rxFmtT(P.fmt,P.mu);
  return `<div class="scroll"><table class="ndtb"><thead><tr><th>ZCZ</th><th>N_CS</th><th>Tiền tố / gốc</th><th>Số gốc cho 64</th><th>Bán kính theo N_CS</th><th>Bán kính tối đa</th></tr></thead><tbody>${T.ncsT.map((n,i)=>{const R=rxRad(P.fmt,P.mu,n,P.ds);
    return `<tr class="${i===P.zcz?'ndhl':''}"><td>${i}</td><td>${n}</td><td>${R.per}</td><td>${R.roots}</td><td>${isFinite(R.rN)?nF(Math.max(0,R.rN),2)+' km':'—'}</td><td>${nF(R.r,2)} km</td></tr>`;}).join('')}</tbody></table></div>
   <p class="note">r = c · (N_CS · T_SEQ / L − τ_trải) / 2, giới hạn thêm bởi CP (${nF(T.tcp,1)} µs)${T.tgt!=null?' và GT ('+nF(T.tgt,1)+' µs)':''}. T_SEQ = ${nF(T.tseq,2)} µs. Định dạng ngắn tính với SCS ${15*Math.pow(2,P.mu)} kHz.</p>`;}
/* TA */
function rxTaStep(mu){return 16*64*rxTc/Math.pow(2,mu)*1e6;}   /* µs mỗi đơn vị T_A (khứ hồi) */
function rxTaDist(){const P=RXP.rach,r=nRng(300+P.seed),bw=10;
  const edge=P.tilt>bw/2?P.h/Math.tan((P.tilt-bw/2)*Math.PI/180)/1000:15,dmax=Math.min(15,Math.max(P.rPlan,edge));
  const s=[];for(let i=0;i<4000;i++){let d;const u=r();if(u<0.85)d=P.rPlan*Math.sqrt(r());else d=P.rPlan+(dmax-P.rPlan)*Math.pow(r(),1.6);s.push(Math.max(0.02,d+nGs(r)*0.05));}
  const step=rxTaStep(P.mu)*rxC/2e6,ta=s.map(d=>Math.round(d/step));return {s,ta,edge,dmax,step,over:s.filter(d=>d>P.rPlan*1.1).length/s.length};}
function rxTaHist(D){const P=RXP.rach,nb=30,mx=Math.max(P.rPlan*1.5,D.dmax),h=new Array(nb).fill(0);D.s.forEach(d=>{h[Math.min(nb-1,Math.floor(d/mx*nb))]++;});
  const W=680,H=170,x0=44,bw=(W-x0-10)/nb,top=Math.max(...h);let g='';
  h.forEach((c,i)=>{const hh=c/top*120,dd=(i+0.5)*mx/nb;g+=`<rect x="${(x0+i*bw).toFixed(1)}" y="${(140-hh).toFixed(1)}" width="${(bw-1).toFixed(1)}" height="${hh.toFixed(1)}" style="fill:${dd>P.rPlan*1.1?'var(--warn)':'var(--nr)'}"><title>${nF(i*mx/nb,2)}–${nF((i+1)*mx/nb,2)} km: ${c} mẫu</title></rect>`;});
  const xp=x0+P.rPlan/mx*nb*bw;g+=`<line x1="${xp}" y1="10" x2="${xp}" y2="140" style="stroke:var(--ink);stroke-dasharray:4 3"/><text x="${xp+4}" y="20" class="u3ax">bán kính quy hoạch</text>`;
  for(let i=0;i<=5;i++)g+=`<text x="${x0+i*nb*bw/5}" y="156" class="u3ax" text-anchor="middle">${nF(i*mx/5,1)}</text>`;
  g+=`<text x="${W-10}" y="168" class="u3ax" text-anchor="end">khoảng cách (km) · 1 T_A ≈ ${nF(D.step*1000,1)} m</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="Phân bố TA">${g}</svg>`;}
/* thủ tục RA và tăng bậc công suất: Monte Carlo */
function rxRaMC(){const P=RXP.rach,r=nRng(700+P.seed),N=-174+10*Math.log10(839*1250)+3.5+P.ulI,req=-10,n=2000;
  const lamRo=P.rate/(1000/P.roP),pcol=1-Math.exp(-lamRo/P.ncb);let ok=0,att=0,fail=0,colF=0;const at=new Array(P.tmax+1).fill(0);
  for(let i=0;i<n;i++){const d=Math.max(30,P.rPlan*1000*Math.sqrt(r())),PL=rUma(d,3.5)+nGs(r)*7-17;let done=false;
    for(let k=1;k<=P.tmax;k++){att++;const tgt=P.p0+(k-1)*P.step,ptx=Math.min(23,tgt+PL),snr=ptx-PL-N;const pd=1/(1+Math.exp(-(snr-req)/1.5));
      if(r()<pd){if(r()<pcol){colF++;continue;}ok++;at[k]++;done=true;break;}}
    if(!done)fail++;}
  return {sr:ok/n,mean:att/n,fail:fail/n,pcol,at,n,N};}
function rxRaUe(){const P=RXP.rach,d=P.dly*1000,PL=rUma(Math.max(30,d),3.5)-17,N=-174+10*Math.log10(839*1250)+3.5+P.ulI,r=nRng(41+P.seed),M=[];let t=0,okk=0;
  const ta=Math.round(2*d/rxC/1e3*1e6/rxTaStep(P.mu));
  for(let k=1;k<=P.tmax;k++){const tgt=P.p0+(k-1)*P.step,ptx=Math.min(23,tgt+PL),snr=ptx-PL-N,pd=1/(1+Math.exp(-(snr-(-10))/1.5));
    M.push({t:t/1000,p:'PHY',m:`Msg1 · tiền tố #${P.pre} lần ${k}`,a:'UE → gNB',d:`PREAMBLE_RECEIVED_TARGET_POWER = ${P.p0} + ${(k-1)*P.step} = ${tgt} dBm; P_PRACH = min(23, ${tgt} + PL ${nF(PL,1)}) = ${nF(ptx,1)} dBm`});
    t+=P.roP;
    if(r()<pd){okk=k;M.push({t:t/1000,p:'MAC',m:'Msg2 · Random Access Response',a:'gNB → UE',d:`RA-RNTI; RAPID ${P.pre}; TA command T_A = ${ta} (${nF(ta*rxTaStep(P.mu),2)} µs); UL grant cho Msg3; TC-RNTI`});
      M.push({t:(t+4)/1000,p:'RRC',m:'Msg3 · RRCSetupRequest',a:'UE → gNB',d:'gửi đã áp TA; công suất Msg3 = P0_PUSCH + msg3-DeltaPreamble …'});
      M.push({t:(t+12)/1000,p:'RRC',m:'Msg4 · RRCSetup + Contention Resolution',a:'gNB → UE',d:'UE Contention Resolution Identity khớp ⇒ thành công; khởi động timeAlignmentTimer'});break;}
    M.push({t:t/1000,p:'MAC',m:'Không nhận RAR trong ra-ResponseWindow',a:'UE',d:`chờ ${P.rwin} slot; tăng PREAMBLE_POWER_RAMPING_COUNTER`});t+=P.rwin*0.5;}
  if(!okk)M.push({t:t/1000,p:'MAC',m:'PREAMBLE_TRANSMISSION_COUNTER = preambleTransMax + 1',a:'UE',d:'báo lỗi truy nhập ngẫu nhiên lên RRC (RLF hoặc thử lại sau)'});
  return {M,okk,ta,PL};}
const RXRA={R:null,D:null,MC:null,U:null,t:0,lastDraw:-1};
RXR.rach={
 html(){const P=RXP.rach,T=rxFmtT(P.fmt,P.mu);if(P.zcz>15)P.zcz=15;RXRA.R=rxDetect();RXRA.D=rxTaDist();RXRA.MC=rxRaMC();RXRA.U=rxRaUe();
  const per=RXRA.R.per,ncsOpt=T.ncsT.map((n,i)=>[i,i+' · N_CS = '+n]);
  return `<div class="panel"><h3>Bộ dò tiền tố PRACH: tương quan Zadoff-Chu tính thật</h3><p class="hint">Mỗi cell có 64 tiền tố, tạo bằng cách dịch vòng chuỗi Zadoff-Chu gốc x<sub>u</sub>(n) = e<sup>−jπun(n+1)/L</sup> một bước N_CS; hết chỗ thì sang gốc kế tiếp. gNB tương quan tín hiệu thu với chuỗi gốc: đỉnh rơi vào cửa sổ nào là tiền tố đó, vị trí trong cửa sổ là độ trễ khứ hồi (TA). Trễ vượt N_CS thì đỉnh lọt sang cửa sổ bên cạnh.</p>
   <div class="scroll"><div class="ndw rxmapc" id="rxPdp">${rxPdpPlot(RXRA.R)}</div></div><p class="legend"><span><i style="background:var(--nr);opacity:.4"></i>cửa sổ của tiền tố UE gửi</span><span><i style="background:var(--k4);opacity:.25"></i>cửa sổ xen kẽ</span><span><i style="background:var(--warn)"></i>ngưỡng phát hiện</span><span>trục ngang: độ trễ vòng τ (mẫu)</span></p>
   <dl class="kv" id="rxDetOut">${rxDetOut(RXRA.R)}</dl></div>
  <div class="cols"><div>
   <div class="panel"><h3>N_CS, số gốc và bán kính cell</h3><div id="rxNcs">${rxNcsTab()}</div></div>
   <div class="panel"><h3>Timing advance và phân bố TA</h3><dl class="kv" id="rxTaOut"></dl><div class="scroll"><div class="ndw" id="rxTaH">${rxTaHist(RXRA.D)}</div></div><p class="legend"><span><i style="background:var(--nr)"></i>trong bán kính</span><span><i style="background:var(--warn)"></i>vượt bán kính quy hoạch (overshoot)</span></p></div>
   <div class="panel"><h3>Thủ tục RA của một UE (tăng bậc công suất)</h3><div class="row">${rxPlayBtn('rach','rxRaPlay')}<button type="button" class="btn sm" data-rxa="rach:rst">⟲ Chạy lại</button><button type="button" class="btn sm" data-rxa="rach:seed">Lần chạy khác</button></div><div id="rxRaSt"></div><div id="rxRaLog"></div></div>
  </div><div>
   <div class="panel"><h3>Tham số PRACH</h3><div class="ctl">
    ${rSel('rach','fmt','Định dạng tiền tố',Object.entries(RXFMT).map(([k,f])=>[k,f.n]),'Từ prach-ConfigurationIndex.','prachCfg')}
    ${RXFMT[P.fmt].L===139?rSel('rach','mu','SCS PRACH',[[0,'15 kHz'],[1,'30 kHz'],[2,'60 kHz'],[3,'120 kHz']]):''}
    ${rSel('rach','zcz','zeroCorrelationZoneConfig',ncsOpt,'','zcz')}
    ${rSl('rach','lr','prach-RootSequenceIndex (logic)',0,23,1,v=>v+' → u = '+rxRoot(RXFMT[P.fmt].L,v),'','rsi')}
    ${rSl('rach','pre','Tiền tố UE chọn',0,Math.max(0,per-1),1,v=>'#'+v)}
    ${rSl('rach','dly','Khoảng cách UE',0,20,0.05,v=>nF(v,2)+' km')}
    ${rSl('rach','snr','SNR mỗi mẫu',-30,0,1,v=>v+' dB','Độ lợi xử lý 10·log10(L) ≈ '+nF(10*Math.log10(RXFMT[P.fmt].L),1)+' dB.')}
    ${rSl('rach','thr','Ngưỡng phát hiện',6,20,0.5,v=>nF(v,1)+' dB')}
    ${rSl('rach','ds','Trải trễ kênh',0,10,0.1,v=>nF(v,1)+' µs')}
    ${rSel('rach','intf','Cell lân cận cùng lúc có UE gửi',[['none','Không'],['same','Cùng gốc u (trùng RSI)'],['diff','Gốc khác (quy hoạch đúng)']],'','rsi')}
    ${P.intf!=='none'?rSl('rach','iD','Khoảng cách UE lân cận tới gNB này',0.5,20,0.5,v=>nF(v,1)+' km')+rSl('rach','iPre','Tiền tố UE lân cận',0,Math.max(0,per-1),1,v=>'#'+v)+rSl('rach','iLv','Mức so với UE của mình',-20,10,1,v=>v+' dB'):''}
   </div></div>
   <div class="panel"><h3>Tham số truy nhập</h3><div class="ctl">
    ${rSl('rach','p0','Công suất đích tiền tố',-120,-90,2,v=>v+' dBm','preambleReceivedTargetPower: −202 … −60 dBm, bước 2.','preTgt')}
    ${rSel('rach','step','powerRampingStep',[[0,'dB0'],[2,'dB2'],[4,'dB4'],[6,'dB6']],'','ramp')}
    ${rSel('rach','tmax','preambleTransMax',[[3,'n3'],[4,'n4'],[5,'n5'],[6,'n6'],[7,'n7'],[8,'n8'],[10,'n10'],[20,'n20']],'','transMax')}
    ${rSel('rach','rwin','ra-ResponseWindow',[[4,'sl4'],[10,'sl10'],[20,'sl20'],[40,'sl40'],[80,'sl80']],'','raWin')}
    ${rSl('rach','ulI','IoT trên PRACH',0,20,0.5,v=>nF(v,1)+' dB','Lấy từ mục 1–2.')}
    ${rSl('rach','rate','Số lần truy nhập mỗi giây',5,400,5,v=>v)}
    ${rSel('rach','roP','Chu kỳ dịp RACH (RO)',[[5,'5 ms'],[10,'10 ms'],[20,'20 ms'],[40,'40 ms']],'Theo prach-ConfigurationIndex.')}
    ${rSl('rach','ncb','Số tiền tố tranh chấp',8,64,1,v=>v,'totalNumberOfRA-Preambles trừ phần dành cho CFRA.','raPre')}
   </div></div>
   <div class="panel"><h3>Phủ và TA</h3><div class="ctl">
    ${rSl('rach','rPlan','Bán kính quy hoạch',0.3,10,0.1,v=>nF(v,1)+' km','','cellRad')}
    ${rSl('rach','h','Độ cao anten',10,60,1,v=>v+' m')}
    ${rSl('rach','tilt','Tilt (cơ + điện)',0,15,0.5,v=>nF(v,1)+'°','','eTilt')}
   </div></div>
   <div class="panel"><h3>Kết quả RACH (2000 UE)</h3><dl class="kv" id="rxRaOut"></dl></div>
   <div class="panel"><h3>Gợi ý tối ưu</h3><div id="rxRaAdv"></div></div>
  </div></div>`;},
 after(){this.fill();this.draw(true);},
 fill(){const P=RXP.rach,M=RXRA.MC,D=RXRA.D,R=RXRA.R,rr=rxRad(P.fmt,P.mu,R.ncs,P.ds),s=(id,h)=>{const e=$('#'+id);if(e)e.innerHTML=h;};
  const st=rxTaStep(P.mu),ta=Math.round(2*P.dly/rxC*1e6/st);
  s('rxTaOut',rKv('Bước T_A',nF(st,4)+' µs = 16·64·T_c / 2^μ ≈ '+nF(st*rxC/2e3,1)+' m một chiều')+rKv('UE ở '+nF(P.dly,2)+' km',`T_A = ${ta} (RAR, 12 bit, 0 … 3846)`)+rKv('Mép búp chính chạm đất',D.edge>=15?'xa hơn 15 km (tilt nhỏ)':nF(D.edge,2)+' km')+rKv('Mẫu vượt bán kính quy hoạch',nF(D.over*100,1)+' %'));
  s('rxRaOut',rKv('Tỉ lệ RA thành công',nF(M.sr*100,2)+' %')+rKv('Số tiền tố trung bình / UE',nF(M.mean,2))+rKv('Lỗi sau preambleTransMax',nF(M.fail*100,2)+' %')+rKv('Xác suất va chạm mỗi lần',nF(M.pcol*100,2)+' %')+rKv('Noise trên băng PRACH + IoT',nF(M.N,1)+' dBm')
   +rKv('Bán kính tối đa với cấu hình',nF(rr.r,2)+' km '+(rr.r<P.rPlan?'<span class="kpC no">nhỏ hơn bán kính quy hoạch</span>':'<span class="kpC ok">đủ</span>')));
  s('rxRaSt',nBars(M.at.slice(1).map((c,i)=>['Lần '+(i+1),c/M.n*100,i===0?'var(--nr)':i<3?'var(--k4)':'var(--warn)']),Math.max(1,...M.at.slice(1).map(c=>c/M.n*100)),' %'));
  const o=[];if(rr.r<P.rPlan)o.push('N_CS = '+R.ncs+' chỉ đủ cho '+nF(rr.r,2)+' km < bán kính quy hoạch '+nF(P.rPlan,1)+' km: tăng zeroCorrelationZoneConfig (tốn thêm gốc) hoặc đổi định dạng.');
  if(R.det.some(d=>d.w!==R.v))o.push('Có tiền tố “ma”: cell lân cận dùng cùng gốc hoặc dải gốc chồng nhau. Quy hoạch RSI (mục 5) để các cell gần không trùng dải [RSI, RSI + số gốc − 1].');
  if(D.over>0.08)o.push('Hơn '+nF(D.over*100,0)+' % mẫu TA vượt bán kính: cell overshoot. Tăng tilt (mép búp chạm đất ở '+nF(Math.min(D.edge,15),1)+' km), xem mục 5.');
  if(M.mean>1.6)o.push('Trung bình '+nF(M.mean,2)+' tiền tố/UE: tăng preambleReceivedTargetPower hoặc powerRampingStep, kiểm tra IoT PRACH.');
  if(M.pcol>0.03)o.push('Va chạm '+nF(M.pcol*100,1)+' %: thêm dịp RACH (prach-ConfigurationIndex dày hơn, msg1-FDM) hoặc thêm tiền tố tranh chấp.');
  if(!o.length)o.push('Cấu hình RACH ổn trong lần chạy này.');s('rxRaAdv',rUl(o));},
 draw(force){const U=RXRA.U;if(!U)return;const last=U.M.length?U.M[U.M.length-1].t:0,T=last+0.3;const k=Math.floor(RXRA.t*20);if(!force&&k===RXRA.lastDraw)return;RXRA.lastDraw=k;
  const ms=U.M.filter(m=>m.t<=RXRA.t);const L=$('#rxRaLog');if(L)L.innerHTML=rLog(ms,12);},
 tick(dt){const U=RXRA.U;if(!U)return;const last=U.M.length?U.M[U.M.length-1].t:0;if(!RXS.pause){RXRA.t+=dt*0.04*RXP.rach.play;if(RXRA.t>last+0.06)RXRA.t=0;}this.draw(dt===0);},
 upd(k){const P=RXP.rach;if(['fmt','intf','mu'].includes(k)){const T=rxFmtT(P.fmt,P.mu);if(P.zcz>=T.ncsT.length)P.zcz=T.ncsT.length-1;renderRx();return;}
  if(k==='zcz'){renderRx();return;}
  const s=(id,h)=>{const e=$('#'+id);if(e)e.innerHTML=h;};
  if(['lr','pre','dly','snr','thr','ds','iD','iPre','iLv','seed'].includes(k)){RXRA.R=rxDetect();s('rxPdp',rxPdpPlot(RXRA.R));s('rxDetOut',rxDetOut(RXRA.R));s('rxNcs',rxNcsTab());}
  if(['h','tilt','rPlan','seed','mu'].includes(k)){RXRA.D=rxTaDist();s('rxTaH',rxTaHist(RXRA.D));}
  RXRA.MC=rxRaMC();RXRA.U=rxRaUe();this.fill();this.draw(true);},
 act(a){if(a==='play')rxPlayTog('rxRaPlay');else if(a==='rst'){RXRA.t=0;this.draw(true);}else if(a==='seed'){RXP.rach.seed++;this.upd('seed');}}
};

/* ---------- Mục 5: Quy hoạch PCI/RSI (mod 3/4/30, xung đột), tilt/azimuth, chồng lấn ---------- */
RXP.pci={isd:500,h:30,tilt:6,plan:'rand',rsiPlan:'reuse',view:'pci',ovThr:6,ovN:4,shd:true,play:3,seed:1};
const RXG=56;   /* độ phân giải lưới bản đồ */
const RXPC_={cells:[],sel:-1,G:null,N:null,C:null,drive:{t:0,msgs:[],lastI:-1,path:[]},lastDraw:-1};
function rxSites(isd){const s=[[0,0]];for(let k=1;k<=2;k++){const v=m=>[k*isd*Math.cos(m*Math.PI/3),k*isd*Math.sin(m*Math.PI/3)];
  for(let m=0;m<6;m++){const a=v(m),b=v(m+1);for(let j=0;j<k;j++)s.push([a[0]+(b[0]-a[0])*j/k,a[1]+(b[1]-a[1])*j/k]);}}return s;}
function rxRoots(){const P=RXP.rach,R=rxRad(P.fmt,P.mu,(rxFmtT(P.fmt,P.mu).ncsT[P.zcz]||0),P.ds);return R.roots;}
function rxCellsInit(){RXPC_.N=null;RXPC_.G=null;const P=RXP.pci,S=rxSites(P.isd),C=[];S.forEach((p,si)=>{for(let k=0;k<3;k++)C.push({site:si,sec:k,x:p[0],y:p[1],az:90-120*k,daz:0,tilt:P.tilt,p:46,pci:0,rsi:0});});RXPC_.cells=C;rxPlanPci();rxPlanRsi();}
const rxHash=(a,b,c)=>{let h=(a*73856093)^(b*19349663)^(c*83492791);h=(h^(h>>>13))*1274126177;return ((h^(h>>>16))>>>0)/4294967296;};
/* RSRP (dBm/RE) của một cell tại điểm (x,y) m */
function rxRsrp(c,x,y,ix,iy){const P=RXP.pci,dx=x-c.x,dy=y-c.y,d=Math.max(15,Math.hypot(dx,dy));
  const ph=rAng(Math.atan2(dy,dx)*180/Math.PI-(c.az+c.daz)),th=Math.atan2(P.h-1.5,d)*180/Math.PI;
  const sh=P.shd&&ix!=null?(rxHash(ix,iy,c.site)-0.5)*2*6:0;
  return c.p-10*Math.log10(3276)+17+rAnt(ph,th,c.tilt,65,10)-rUma(d,3.5)+sh;}
function rxGrid(){const P=RXP.pci,C=RXPC_.cells,ext=2.5*P.isd,st=2*ext/RXG,N=rxN(7,30)-10*Math.log10(12),G=[];
  for(let iy=0;iy<RXG;iy++)for(let ix=0;ix<RXG;ix++){const x=-ext+(ix+0.5)*st,y=ext-(iy+0.5)*st;let b=-1,bv=-999,b2=-1,b2v=-999,tot=0;const rs=new Float32Array(C.length);
    for(let i=0;i<C.length;i++){const v=rxRsrp(C[i],x,y,ix,iy);rs[i]=v;tot+=nLin(v);if(v>bv){b2=b;b2v=bv;b=i;bv=v;}else if(v>b2v){b2=i;b2v=v;}}
    let ov=0;for(let i=0;i<C.length;i++)if(rs[i]>bv-P.ovThr)ov++;
    const sinr=bv-nDb(tot-nLin(bv)+nLin(N));G.push({x,y,b,bv,b2,b2v,ov,sinr,rs});}
  return {G,ext,st};}
/* quan hệ lân cận: cặp (phục vụ, cell trong 10 dB) đếm theo số điểm */
function rxNbr(){const C=RXPC_.cells,n=C.length,M=Array.from({length:n},()=>new Float32Array(n));
  RXPC_.G.G.forEach(g=>{for(let i=0;i<n;i++){if(i!==g.b&&g.rs[i]>g.bv-10){M[g.b][i]+=1;M[i][g.b]+=1;}}});
  const nb=M.map((r,i)=>[...r].map((v,j)=>[j,v]).filter(e=>e[1]>=3&&e[0]!==i).sort((a,b)=>b[1]-a[1]).map(e=>e[0]));return {M,nb};}
function rxPlanPci(){const P=RXP.pci,C=RXPC_.cells,r=nRng(40+P.seed);
  if(P.plan==='rand')C.forEach(c=>c.pci=Math.floor(r()*48));
  else if(P.plan==='site')C.forEach(c=>c.pci=3*(c.site+10)+c.sec);
  else{/* tham lam: cần quan hệ lân cận theo vùng phủ hiện tại */
    if(!RXPC_.N){RXPC_.G=rxGrid();RXPC_.N=rxNbr();}const N=RXPC_.N,used=new Array(C.length).fill(-1),ord=C.map((c,i)=>i).sort((a,b)=>N.nb[b].length-N.nb[a].length);
    ord.forEach(i=>{let best=0,bc=1e18;const nb=N.nb[i],nb2=new Set();nb.forEach(j=>N.nb[j].forEach(k=>{if(k!==i)nb2.add(k);}));
      for(let p=0;p<1008;p++){let cost=p*1e-6;for(const j of nb){const q=used[j];if(q<0)continue;const w=N.M[i][j];if(q===p)cost+=1e6;if(q%3===p%3)cost+=10*w;if(q%30===p%30)cost+=3*w;if(q%4===p%4)cost+=w;}
        for(const k of nb2){if(used[k]===p)cost+=5e5;}if(cost<bc){bc=cost;best=p;}}
      used[i]=best;});C.forEach((c,i)=>c.pci=used[i]);}}
function rxPlanRsi(){const P=RXP.pci,C=RXPC_.cells,nr=rxRoots(),r=nRng(70+P.seed);
  C.forEach((c,i)=>{c.rsi=P.rsiPlan==='seq'?(i*nr)%838:P.rsiPlan==='reuse'?(i%6)*nr:Math.floor(r()*(838-nr));});}
function rxConf(){const C=RXPC_.cells,N=RXPC_.N,nr=rxRoots(),o={col:[],conf:[],m3:[],m4:[],m30:[],rsi:[]};const seen=new Set();
  C.forEach((c,i)=>{N.nb[i].forEach(j=>{if(j<=i)return;const d=C[j],w=N.M[i][j],strong=w>=8;const k=i+'-'+j;if(seen.has(k))return;seen.add(k);
    if(c.pci===d.pci)o.col.push([i,j,w]);else{if(strong&&c.pci%3===d.pci%3)o.m3.push([i,j,w]);if(strong&&c.pci%30===d.pci%30)o.m30.push([i,j,w]);if(strong&&c.pci%4===d.pci%4)o.m4.push([i,j,w]);}
    if(Math.abs(c.rsi-d.rsi)<nr)o.rsi.push([i,j,w]);});
    const nb=N.nb[i];for(let a=0;a<nb.length;a++)for(let b=a+1;b<nb.length;b++)if(C[nb[a]].pci===C[nb[b]].pci)o.conf.push([i,nb[a],nb[b]]);});
  return o;}
function rxPciStats(){const P=RXP.pci,G=RXPC_.G,C=RXPC_.cells,n=G.G.length;let ov=0,neg=0,sm=0;const far=new Array(C.length).fill(0),cnt=new Array(C.length).fill(0);
  G.G.forEach(g=>{if(g.ov>=P.ovN)ov++;if(g.sinr<0)neg++;sm+=g.sinr;const c=C[g.b],d=Math.hypot(g.x-c.x,g.y-c.y);cnt[g.b]++;if(d>1.5*P.isd)far[g.b]++;});
  const over=C.map((c,i)=>[i,cnt[i]?far[i]/cnt[i]:0]).filter(e=>e[1]>0.15);
  return {ov:ov/n,neg:neg/n,sinr:sm/n,over};}
function rxPciColor(g,C){const P=RXP.pci,v=P.view;
  if(v==='pci'){const c=C[g.b],h=[200,30,130][c.pci%3],l=38+((c.site*7+c.sec*3)%5)*6;return `hsl(${h},60%,${l}%)`;}
  if(v==='mod30'){const c=C[g.b];return `hsl(${(c.pci%30)*12},55%,50%)`;}
  if(v==='rsrp'){const t=nC((g.bv+125)/55,0,1);return `hsl(${Math.round(t*130)},70%,${40+t*12}%)`;}
  if(v==='sinr'){const t=nC((g.sinr+5)/30,0,1);return `hsl(${Math.round(t*130)},70%,${40+t*10}%)`;}
  const t=nC((g.ov-1)/4,0,1);return `hsl(${Math.round(130-130*t)},70%,${45}%)`;}
function rxPciMap(){const P=RXP.pci,G=RXPC_.G,C=RXPC_.cells,W=600,sc=W/(2*G.ext),X=x=>(x+G.ext)*sc,Y=y=>(G.ext-y)*sc,cs=G.st*sc;let h='';
  G.G.forEach(g=>{h+=`<rect x="${(X(g.x)-cs/2).toFixed(1)}" y="${(Y(g.y)-cs/2).toFixed(1)}" width="${(cs+0.4).toFixed(1)}" height="${(cs+0.4).toFixed(1)}" style="fill:${rxPciColor(g,C)}"/>`;});
  const sp=c=>{const a=(c.az+c.daz)*Math.PI/180;return [c.x+0.22*P.isd*Math.cos(a),c.y+0.22*P.isd*Math.sin(a)];};
  const K=RXPC_.K;if(K){const ln=(i,j,cl,dash)=>{const a=sp(C[i]),b=sp(C[j]);h+=`<line x1="${X(a[0]).toFixed(1)}" y1="${Y(a[1]).toFixed(1)}" x2="${X(b[0]).toFixed(1)}" y2="${Y(b[1]).toFixed(1)}" class="rxcf ${cl}"${dash?' stroke-dasharray="4 3"':''}/>`;};
    K.m3.slice(0,40).forEach(e=>ln(e[0],e[1],'m3',1));K.rsi.slice(0,40).forEach(e=>ln(e[0],e[1],'rs',1));K.col.forEach(e=>ln(e[0],e[1],'col'));K.conf.slice(0,12).forEach(e=>{ln(e[1],e[0],'conf');ln(e[2],e[0],'conf');});}
  C.forEach((c,i)=>{const a=(c.az+c.daz)*Math.PI/180,x1=X(c.x),y1=Y(c.y),x2=X(c.x+0.3*P.isd*Math.cos(a)),y2=Y(c.y+0.3*P.isd*Math.sin(a));
    h+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="rxaz${i===RXPC_.sel?' sel':''}"/>`;
    const q=sp(c);h+=`<text x="${X(q[0]).toFixed(1)}" y="${(Y(q[1])+3).toFixed(1)}" class="rxpl${i===RXPC_.sel?' sel':''}" text-anchor="middle">${c.pci}</text>`;});
  RXPC_.cells.filter(c=>c.sec===0).forEach(c=>{h+=`<circle cx="${X(c.x).toFixed(1)}" cy="${Y(c.y).toFixed(1)}" r="3.5" class="rxsite"/>`;});
  const D=RXPC_.drive;if(D.path.length){const p=D.path[0],q=D.path[D.path.length-1];h+=`<line x1="${X(p[0])}" y1="${Y(p[1])}" x2="${X(q[0])}" y2="${Y(q[1])}" class="rxroute"/>`;
    const u=D.cur;if(u)h+=`<circle cx="${X(u.x).toFixed(1)}" cy="${Y(u.y).toFixed(1)}" r="6" class="ndue"/>`;}
  return `<svg viewBox="0 0 ${W} ${W}" class="u3svg rxpcimap" role="img" aria-label="Bản đồ vùng phục vụ 19 trạm × 3 sector" data-rxmap="1">${h}</svg>`;}
function rxPciLegend(){const v=RXP.pci.view;
  if(v==='pci')return '<span><i style="background:hsl(200,60%,45%)"></i>PCI mod 3 = 0</span><span><i style="background:hsl(30,60%,45%)"></i>mod 3 = 1</span><span><i style="background:hsl(130,60%,45%)"></i>mod 3 = 2</span>';
  if(v==='mod30')return '<span>Màu theo PCI mod 30 (nhóm chuỗi DMRS/SRS UL)</span>';
  if(v==='rsrp')return '<span><i style="background:hsl(0,70%,40%)"></i>−125 dBm</span><span><i style="background:hsl(65,70%,46%)"></i>−97</span><span><i style="background:hsl(130,70%,52%)"></i>−70 dBm</span>';
  if(v==='sinr')return '<span><i style="background:hsl(0,70%,40%)"></i>−5 dB</span><span><i style="background:hsl(65,70%,45%)"></i>10</span><span><i style="background:hsl(130,70%,50%)"></i>25 dB</span>';
  return '<span><i style="background:hsl(130,70%,45%)"></i>1 cell</span><span><i style="background:hsl(65,70%,45%)"></i>3</span><span><i style="background:hsl(0,70%,45%)"></i>≥ 5 cell trong ngưỡng</span>';}
const rxCn=i=>{const c=RXPC_.cells[i];return `S${c.site}-${c.sec+1} (PCI ${c.pci})`;};
function rxPciOut(){const K=RXPC_.K,St=RXPC_.St,P=RXP.pci;
  return rKv('PCI collision (lân cận trùng PCI)',K.col.length)+rKv('PCI confusion (hai lân cận cùng PCI)',K.conf.length)+rKv('Trùng mod 3 (PSS) giữa lân cận mạnh',K.m3.length)+rKv('Trùng mod 4 (dịch DMRS PBCH)',K.m4.length)+rKv('Trùng mod 30 (nhóm DMRS/SRS UL)',K.m30.length)
   +rKv('RSI chồng dải (số gốc mỗi cell: '+rxRoots()+')',K.rsi.length)+'<div class="sep"></div>'+rKv('Điểm có ≥ '+P.ovN+' cell trong '+P.ovThr+' dB',nF(St.ov*100,1)+' %')+rKv('Điểm SINR SSB < 0 dB',nF(St.neg*100,1)+' %')+rKv('SINR trung bình',nF(St.sinr,1)+' dB')+rKv('Cell overshoot (> 15 % vùng phục vụ ngoài 1,5 ISD)',St.over.length);}
function rxPciList(){const K=RXPC_.K,r=[];K.col.forEach(e=>r.push(['Collision',e[0],`${rxCn(e[0])} ↔ ${rxCn(e[1])}`]));K.conf.forEach(e=>r.push(['Confusion',e[0],`${rxCn(e[0])}: ${rxCn(e[1])} và ${rxCn(e[2])}`]));
  K.rsi.forEach(e=>r.push(['RSI',e[0],`${rxCn(e[0])} RSI ${RXPC_.cells[e[0]].rsi} ↔ ${rxCn(e[1])} RSI ${RXPC_.cells[e[1]].rsi}`]));K.m3.forEach(e=>r.push(['mod 3',e[0],`${rxCn(e[0])} ↔ ${rxCn(e[1])}`]));
  RXPC_.St.over.forEach(e=>r.push(['Overshoot',e[0],`${rxCn(e[0])}: ${nF(e[1]*100,0)} % vùng phục vụ ngoài 1,5 ISD`]));
  if(!r.length)return '<p class="kpC ok">Không có xung đột.</p>';
  return `<div class="scroll rxcfl"><table class="ndtb"><thead><tr><th>Loại</th><th>Cell</th><th></th></tr></thead><tbody>${r.slice(0,40).map(x=>`<tr><td><span class="chip">${x[0]}</span></td><td>${nE(x[2])}</td><td><button type="button" class="btn sm" data-rxa="pci:pick:${x[1]}">Chọn</button></td></tr>`).join('')}</tbody></table></div>${r.length>40?`<p class="note">… và ${r.length-40} mục khác.</p>`:''}`;}
function rxCellEd(){const i=RXPC_.sel,P=RXP.pci;if(i<0)return '<p class="hint">Bấm vào bản đồ hoặc nút “Chọn” để sửa một cell.</p>';const c=RXPC_.cells[i],tr=Math.atan2(P.h-1.5,P.isd*2/3)*180/Math.PI+5;
  const nb=RXPC_.N.nb[i].slice(0,6).map(j=>rxCn(j)).join(', ');
  return `<p><b>${rxCn(i)}</b> · N<sub>ID</sub><sup>(1)</sup> = ${Math.floor(c.pci/3)}, N<sub>ID</sub><sup>(2)</sup> = ${c.pci%3} · mod 4 = ${c.pci%4} · mod 30 = ${c.pci%30} · RSI ${c.rsi}</p>
   <div class="ctl"><label class="c"><span class="cl">PCI (0 … 1007)</span><input type="number" id="rxCePci" min="0" max="1007" value="${c.pci}"></label>
    <label class="c"><span class="cl">Lệch azimuth<output>${c.daz}°</output></span><input type="range" id="rxCeAz" min="-60" max="60" step="5" value="${c.daz}"></label>
    <label class="c"><span class="cl">Tilt<output>${c.tilt}°</output></span><input type="range" id="rxCeTi" min="0" max="15" step="0.5" value="${c.tilt}"><span class="u3ph">Gợi ý cho bán kính 2/3 ISD: ≈ ${nF(tr,1)}° (góc tới mép + nửa độ rộng búp dọc)</span>${rPnTag('eTilt')}</label>
    <label class="c"><span class="cl">Công suất<output>${c.p} dBm</output></span><input type="range" id="rxCeP" min="36" max="49" step="1" value="${c.p}"></label></div>
   <p class="note">Lân cận chính: ${nE(nb||'—')}</p>`;}
/* tuyến chạy thử: UE đi ngang bản đồ, ghi HO và lỗi PCI */
function rxDrive(){const P=RXP.pci,C=RXPC_.cells,ext=1.9*P.isd,n=240,path=[],msgs=[];let srv=-1,t=0;const N=RXPC_.N;
  for(let i=0;i<n;i++){const x=-ext+2*ext*i/(n-1),y=0.37*P.isd+0.25*P.isd*Math.sin(i/n*Math.PI*2);path.push([x,y]);}
  const st=[];path.forEach((p,i)=>{t=i*0.25;let b=-1,bv=-999;const rs=C.map((c,k)=>{const v=rxRsrp(c,p[0],p[1],Math.floor((p[0]+2.5*P.isd)/(5*P.isd)*RXG),Math.floor((2.5*P.isd-p[1])/(5*P.isd)*RXG));if(v>bv){bv=v;b=k;}return v;});
    if(srv<0){srv=b;msgs.push({t,p:'RRC',m:'Bắt đầu ở '+rxCn(b),a:'UE',d:'RSRP '+nF(bv,1)+' dBm'});}
    else if(b!==srv&&rs[b]>rs[srv]+3){const tp=C[b].pci,cands=N.nb[srv].filter(j=>C[j].pci===tp),known=N.nb[srv].includes(b);
      msgs.push({t,p:'RRC',m:'MeasurementReport (A3) · PCI '+tp,a:'UE → gNB',d:'RSRP đích '+nF(rs[b],1)+' dBm, phục vụ '+nF(rs[srv],1)+' dBm'});
      if(C[b].pci===C[srv].pci)msgs.push({t,p:'SON',m:'PCI collision',a:'gNB',d:'đích và phục vụ cùng PCI '+tp+': UE không phân biệt được, SSB chồng nhau'});
      if(cands.length>1){msgs.push({t,p:'SON',m:'PCI confusion: '+cands.length+' lân cận cùng PCI '+tp,a:'gNB',d:'gNB yêu cầu UE đọc CGI (reportCGI) trước khi HO, hoặc HO nhầm đích → RLF'});msgs.push({t:t+0.05,p:'RRC',m:'RRCReconfiguration (reportConfig: reportCGI)',a:'gNB → UE',d:'UE đọc SIB1 của cell PCI '+tp+' để lấy NCGI'});}
      if(!known)msgs.push({t,p:'SON',m:'ANR: thêm quan hệ lân cận mới',a:'gNB',d:'PCI '+tp+' chưa có trong danh sách; đọc NCGI rồi thêm NRCellRelation'});
      msgs.push({t:t+0.1,p:'XnAP',m:'Handover Request → Acknowledge',a:rxCn(srv)+' → '+rxCn(b),d:''});srv=b;}
    st.push({x:p[0],y:p[1],srv,rs:bv});});
  return {path,msgs,st,T:t};}
function rxPciRecalc(keepPlan){RXPC_.G=rxGrid();RXPC_.N=rxNbr();if(!keepPlan){}RXPC_.K=rxConf();RXPC_.St=rxPciStats();const d=rxDrive();Object.assign(RXPC_.drive,{path:d.path,msgs:d.msgs,st:d.st,T:d.T});if(RXPC_.drive.t>d.T)RXPC_.drive.t=0;}
function rxPciAdv(){const K=RXPC_.K,St=RXPC_.St,P=RXP.pci,o=[];
  if(K.col.length||K.conf.length)o.push('Có '+K.col.length+' collision và '+K.conf.length+' confusion: dùng quy hoạch “tham lam” hoặc SON PCI tự động; sau khi đổi PCI phải cập nhật quan hệ lân cận ở cell kề.');
  if(K.m3.length>4)o.push(K.m3.length+' cặp lân cận mạnh trùng mod 3: PSS giống nhau làm đồng bộ, ước lượng kênh SSB kém ở vùng chồng lấn. Giữ ba sector cùng trạm khác mod 3, cell đối diện cũng khác.');
  if(K.rsi.length)o.push(K.rsi.length+' cặp chồng dải root sequence: dễ sinh tiền tố “ma” (mục 4). Cấp RSI liên tiếp cách nhau đúng số gốc mỗi cell ('+rxRoots()+').');
  if(St.ov>0.15)o.push('Chồng lấn cao ('+nF(St.ov*100,0)+' % điểm có ≥ '+P.ovN+' cell): tăng tilt hoặc giảm công suất ở cell overshoot, chỉnh azimuth để giảm vùng phủ thừa.');
  if(St.over.length)o.push(St.over.length+' cell overshoot: tilt '+P.tilt+'° với anten '+P.h+' m làm mép búp chạm đất ở '+(P.tilt>5?nF(P.h/Math.tan((P.tilt-5)*Math.PI/180)/1000,2)+' km':'rất xa')+'.');
  if(!o.length)o.push('Quy hoạch sạch: không có xung đột PCI/RSI đáng kể.');return rUl(o);}
RXR.pci={
 html(){const P=RXP.pci;if(!RXPC_.cells.length||RXPC_.isd!==P.isd){RXPC_.isd=P.isd;rxCellsInit();}rxPciRecalc();
  return `<div class="cols"><div>
   <div class="panel"><h3>Bản đồ 19 trạm × 3 sector</h3><p class="hint">PCI = 3·N<sub>ID</sub><sup>(1)</sup> + N<sub>ID</sub><sup>(2)</sup> (1008 giá trị; PSS mang N<sub>ID</sub><sup>(2)</sup> = PCI mod 3, SSS mang N<sub>ID</sub><sup>(1)</sup>). Vạch đỏ: collision/confusion; vạch cam đứt: trùng mod 3; vạch tím đứt: chồng dải RSI. Bấm vào bản đồ để chọn cell.</p>
    ${rSub('pci','view',[['pci','Phục vụ (PCI mod 3)'],['mod30','PCI mod 30'],['rsrp','RSRP SSB'],['sinr','SINR SSB'],['ovl','Chồng lấn']])}
    <div class="rxmapw" id="rxPciMap">${rxPciMap()}</div><p class="legend" id="rxPciLg">${rxPciLegend()}</p>
    <div class="row">${rxPlayBtn('pci','rxPciPlay')}<button type="button" class="btn sm" data-rxa="pci:rst">⟲ Tuyến chạy về đầu</button><span class="note" id="rxPciT"></span></div></div>
   <div class="panel"><h3>Nhật ký tuyến chạy thử (RRC / XnAP / SON)</h3><div id="rxPciLog"></div></div>
   <div class="panel"><h3>Danh sách xung đột</h3><div id="rxPciL">${rxPciList()}</div></div>
  </div><div>
   <div class="panel"><h3>Quy hoạch</h3><div class="ctl">
    ${rSel('pci','plan','Cách gán PCI',[['rand','Ngẫu nhiên trong 48 giá trị (hay gặp khi khai tay)'],['site','Theo nhóm trạm: PCI = 3·nhóm + sector'],['greedy','Tham lam: tránh collision, confusion, mod 3/30/4']],'','pci')}
    ${rSel('pci','rsiPlan','Cách gán RSI',[['reuse','Lặp lại 6 dải (dễ trùng)'],['seq','Liên tiếp theo số gốc mỗi cell'],['rand','Ngẫu nhiên']],'Số gốc mỗi cell lấy từ cấu hình mục 4.','rsi')}
    ${rSl('pci','isd','Khoảng cách trạm (ISD)',200,1500,50,v=>v+' m')}
    ${rSl('pci','h','Độ cao anten',10,60,1,v=>v+' m')}
    ${rSl('pci','tilt','Tilt chung (đặt lại mọi cell)',0,15,0.5,v=>nF(v,1)+'°','','eTilt')}
    ${rSl('pci','ovThr','Ngưỡng chồng lấn',3,10,1,v=>v+' dB')}
    ${rSl('pci','ovN','Số cell tính là chồng lấn',3,6,1,v=>'≥ '+v)}
    <div class="c">${rChk('pci','shd','Bóng che (6 dB)')}</div>
    ${rSl('pci','play','Tua nhanh tuyến chạy',1,10,1,v=>'× '+v)}
   </div><div class="row"><button type="button" class="btn sm pri" data-rxa="pci:auto">Quy hoạch lại PCI + RSI</button></div></div>
   <div class="panel"><h3>Sửa cell đang chọn</h3><div id="rxCe">${rxCellEd()}</div></div>
   <div class="panel"><h3>Kết quả</h3><dl class="kv" id="rxPciOut">${rxPciOut()}</dl></div>
   <div class="panel"><h3>Gợi ý tối ưu</h3><div id="rxPciAdv">${rxPciAdv()}</div></div>
   <div class="panel"><h3>Quy tắc quy hoạch</h3><div class="u3stk">
    <div style="border-left-color:var(--warn)"><b>Không collision, không confusion</b> · hai cell lân cận không trùng PCI; một cell không có hai lân cận cùng PCI (nếu không, HO tới nhầm đích).</div>
    <div style="border-left-color:var(--k4)"><b>mod 3, mod 4, mod 30</b> · mod 3: PSS; mod 4: vị trí DMRS của PBCH; mod 30: nhóm chuỗi DMRS PUSCH/SRS khi dùng PCI làm n<sub>ID</sub>. Tránh trùng giữa cell chồng lấn mạnh.</div>
    <div style="border-left-color:var(--nr)"><b>RSI</b> · dải [RSI, RSI + số gốc − 1] của các cell gần nhau không chồng; cell lớn cần N_CS lớn nên tốn nhiều gốc hơn.</div>
    <div style="border-left-color:var(--up)"><b>Tilt, azimuth</b> · tilt ≈ góc tới mép phủ + nửa độ rộng búp dọc; azimuth tránh hai sector chĩa thẳng vào nhau gần trạm khác.</div></div></div>
  </div></div>`;},
 after(){this.draw(true);},
 refresh(){rxPciRecalc();const s=(id,h)=>{const e=$('#'+id);if(e)e.innerHTML=h;};s('rxPciMap',rxPciMap());s('rxPciLg',rxPciLegend());s('rxPciOut',rxPciOut());s('rxPciL',rxPciList());s('rxPciAdv',rxPciAdv());s('rxCe',rxCellEd());this.draw(true);},
 draw(force){const D=RXPC_.drive;if(!D.st)return;const i=Math.min(D.st.length-1,Math.floor(D.t/0.25));if(!force&&i===D.lastI)return;D.lastI=i;D.cur=D.st[i];
  const m=$('#rxPciMap svg');if(m){let u=m.querySelector('circle.ndue');const W=600,sc=W/(2*RXPC_.G.ext),x=(D.cur.x+RXPC_.G.ext)*sc,y=(RXPC_.G.ext-D.cur.y)*sc;
    if(!u){m.insertAdjacentHTML('beforeend',`<circle cx="${x}" cy="${y}" r="6" class="ndue"/>`);}else{u.setAttribute('cx',x.toFixed(1));u.setAttribute('cy',y.toFixed(1));}}
  const L=$('#rxPciLog');if(L)L.innerHTML=rLog(D.msgs.filter(x=>x.t<=D.t),12);
  const t=$('#rxPciT');if(t)t.textContent=`t = ${nF(D.t,1)} s · phục vụ ${rxCn(D.cur.srv)} · RSRP ${nF(D.cur.rs,1)} dBm`;},
 tick(dt){const D=RXPC_.drive;if(!D.st)return;if(!RXS.pause){D.t+=dt*RXP.pci.play;if(D.t>D.T)D.t=0;}this.draw(dt===0);},
 upd(k){const P=RXP.pci;if(k==='play')return;
  if(k==='isd'){RXPC_.isd=P.isd;rxCellsInit();}
  else if(k==='plan'){if(P.plan==='greedy'){RXPC_.G=rxGrid();RXPC_.N=rxNbr();}rxPlanPci();}
  else if(k==='rsiPlan')rxPlanRsi();
  else if(k==='tilt')RXPC_.cells.forEach(c=>c.tilt=P.tilt);
  this.refresh();},
 act(a,el,x){const P=RXP.pci;if(a==='sub'){P.view=x;const s=(id,h)=>{const e=$('#'+id);if(e)e.innerHTML=h;};s('rxPciMap',rxPciMap());s('rxPciLg',rxPciLegend());$$('#t-ro .rxsub button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.rxa==='pci:sub:'+x));this.draw(true);}
  else if(a==='play')rxPlayTog('rxPciPlay');else if(a==='rst'){RXPC_.drive.t=0;this.draw(true);}
  else if(a==='pick'){RXPC_.sel=+x;this.refresh();const e=$('#rxCe');if(e)e.scrollIntoView({block:'nearest',behavior:'smooth'});}
  else if(a==='auto'){if(P.plan==='rand')P.plan='greedy';if(P.rsiPlan!=='seq')P.rsiPlan='seq';RXPC_.G=rxGrid();RXPC_.N=rxNbr();rxPlanPci();rxPlanRsi();renderRx();}}
};
document.addEventListener('click',e=>{const sv=e.target.closest&&e.target.closest('#rxPciMap svg');if(!sv||!RXPC_.G)return;const r=sv.getBoundingClientRect(),W=600,ux=(e.clientX-r.left)/r.width*W,uy=(e.clientY-r.top)/r.height*W;
  const ix=Math.floor(ux/W*RXG),iy=Math.floor(uy/W*RXG);if(ix<0||iy<0||ix>=RXG||iy>=RXG)return;const g=RXPC_.G.G[iy*RXG+ix];RXPC_.sel=g.b;RXR.pci.refresh();});
document.addEventListener('input',e=>{const t=e.target;if(!t.id||!/^rxCe/.test(t.id)||RXPC_.sel<0)return;const c=RXPC_.cells[RXPC_.sel];
  if(t.id==='rxCePci'){const v=Math.round(+t.value);if(!(v>=0&&v<=1007))return;c.pci=v;}else if(t.id==='rxCeAz')c.daz=+t.value;else if(t.id==='rxCeTi')c.tilt=+t.value;else if(t.id==='rxCeP')c.p=+t.value;
  const o=t.parentElement.querySelector('output');if(o)o.textContent=t.id==='rxCeP'?t.value+' dBm':t.value+'°';
  clearTimeout(RXPC_.tm);RXPC_.tm=setTimeout(()=>{const keep=document.activeElement&&document.activeElement.id;rxPciRecalc();const s=(id,h)=>{const e=$('#'+id);if(e)e.innerHTML=h;};s('rxPciMap',rxPciMap());s('rxPciOut',rxPciOut());s('rxPciL',rxPciList());s('rxPciAdv',rxPciAdv());RXR.pci.draw(true);},t.id==='rxCePci'?400:120);});

/* ---------- Mục 6: Tham số, KPI, lỗi ---------- */
RXP.vd={grp:'all',q:'',kf:'all'};
/* [khoá, nhóm, tên/ý nghĩa 3GPP, Huawei, Nokia, Ericsson, giá trị điển hình, cờ: c = tên thường gặp, v = cần đối chiếu] */
const RXPAR=[
 ['tddPat','TDD và nhiễu xa','TDD-UL-DL-ConfigCommon: referenceSubcarrierSpacing, pattern1 (dl-UL-TransmissionPeriodicity, nrofDownlinkSlots, nrofDownlinkSymbols, nrofUplinkSlots, nrofUplinkSymbols)','NRDUCell: SlotAssignment / SlotStructure','NRCELL: tddFrameStructure / frameStructureType','NRCellDU: tddUlDlPattern','DDDSU (2,5 ms) hoặc DDDDDDDSUU (5 ms), cùng nhà mạng lân cận','v'],
 ['tddSs','TDD và nhiễu xa','Cấu hình ô S: số ký hiệu DL : GP : UL (nrofDownlinkSymbols, nrofUplinkSymbols)','NRDUCell: SpecialSlotStructure','NRCELL: specialSlotFormat','NRCellDU: tddSpecialSlotPattern','10:2:2 hoặc 6:4:4','v'],
 ['rimSw','TDD và nhiễu xa','Quản lý nhiễu xa RIM (Rel-16): framework 1 (RIM-RS-1/2) hoặc 2 (backhaul NGAP), TS 38.300 §16','Tính năng Remote Interference Management (switch theo cell)','Tính năng RIM (activation flag)','Tính năng Remote Interference Management','Bật ở vùng ven biển, đồng bằng có ống dẫn','v'],
 ['rimThr','TDD và nhiễu xa','Ngưỡng phát hiện nhiễu xa (IoT ở ký hiệu UL đầu) để phát RIM-RS','Ngưỡng phát hiện nhiễu xa','rimDetectionThreshold','Ngưỡng RIM','5 … 8 dB','v'],
 ['rimBack','TDD và nhiễu xa','Số ký hiệu DL tắt khi back-off (tăng GP), giảm công suất, đổi tilt','Mức back-off của RIM','rimBackoffSymbols','Hành động giảm nhiễu RIM','2 … 8 ký hiệu, theo khoảng cách','v'],
 ['syncSrc','Đồng bộ','Nguồn đồng bộ (GNSS, PTP G.8275.1), thời gian holdover, hành động khi vượt ±1,5 µs','CLKMODE / GPS, holdover','SYNC: syncInputPrio, holdover','Synchronization, RadioEquipmentClock, TimeSyncIO','Lệch pha ≤ 3 µs giữa các cell (TS 38.133)','v'],
 ['ulIntThr','Nhiễu UL','Ngưỡng cảnh báo nhiễu UL theo PRB / trung bình cell','Ngưỡng alarm UL interference','Ngưỡng alarm nhiễu UL','Ngưỡng cảnh báo nhiễu UL','Noise floor + 6 dB','v'],
 ['pimDet','Nhiễu UL','Phát hiện / triệt PIM (tính năng vendor; IEC 62037 cho đo hiện trường)','PIM detection, AIM (Anti-Interference) / PIM cancellation','PIM detection / cancellation','PIM detection (Interference Detection), PIM mitigation','≤ −153 dBc @2×43 dBm tại hiện trường','v'],
 ['irc','Nhiễu UL','Bộ thu IRC (Interference Rejection Combining) cho PUSCH','Thuật toán thu UL IRC','IRC receiver activation','Thuật toán thu IRC','Bật cho 4R/8R','v'],
 ['p0Pusch','Công suất PUSCH','p0-NominalWithGrant (PUSCH-ConfigCommon, −202 … 24 dBm), p0-PUSCH-AlphaSet','NRDUCellPusch: P0NominalPusch','NRCELL: p0NomPusch','NRCellDU: pZeroNomPuschGrant','−100 … −85 dBm (theo alpha)','v'],
 ['alpha','Công suất PUSCH','alpha trong P0-PUSCH-AlphaSet: alpha0, 04, 05 … 09, 1','NRDUCellPusch: PathLossCoeff','NRCELL: ulpcAlpha','NRCellDU: pathLossCompensation / alpha','0,7 … 0,8','v'],
 ['p0Pucch','Công suất PUCCH','p0-nominal (PUCCH-ConfigCommon, −202 … 24 dBm), p0-Set','NRDUCellPucch: P0NominalPucch','NRCELL: p0NomPucch','NRCellDU: pZeroNomPucch','−110 … −100 dBm','v'],
 ['dFPucch','Công suất PUCCH','deltaF-PUCCH-f0 … f4 (PUCCH-PowerControl)','DeltaFPucchFormat*','deltaFPucchF*','deltaFPucchFormat*','0 … 2 dB theo định dạng','v'],
 ['pMax','Công suất PUSCH','p-Max / p-NR-FR1 (SIB1, RRCReconfiguration) giới hạn P_CMAX','NRCellReselection / NRDUCell: UePMax','NRCELL: pMaxNr','NRCellCU / NRCellDU: pMax','23 dBm (PC3)','v'],
 ['tpcAcc','Công suất PUSCH','tpc-Accumulation (PUSCH-PowerControl): bật = tích luỹ, tắt = tuyệt đối','Mặc định tích luỹ','tpcAccumulation','Mặc định tích luỹ','Tích luỹ','v'],
 ['msg3Delta','Công suất PUSCH','msg3-DeltaPreamble (−1 … 6, × 2 dB) cho công suất Msg3','NRDUCellPusch: Msg3DeltaPreamble','msg3DeltaPreamble','msg3DeltaPreamble','0 … 2','v'],
 ['phrPer','PHR','phr-PeriodicTimer (sf10 … sf1000, infinity) trong PHR-Config','PhrPeriodicTimer','phrPeriodicTimer','phrPeriodicTimer','sf20 … sf50','v'],
 ['phrProh','PHR','phr-ProhibitTimer (sf0 … sf1000)','PhrProhibitTimer','phrProhibitTimer','phrProhibitTimer','sf10 … sf20','v'],
 ['phrChg','PHR','phr-Tx-PowerFactorChange (dB1, dB3, dB6, infinity)','PhrTxPowerFactorChange','phrTxPowerFactorChange','phrTxPowerFactorChange','dB1 … dB3','v'],
 ['prachCfg','RACH/PRACH','prach-ConfigurationIndex (RACH-ConfigGeneric): định dạng, chu kỳ, slot có RO','NRDUCell: PrachConfigIndex','NRCELL: prachConfIndex','NRCellDU: prachConfigIndex','Theo bán kính cell và tải truy nhập','v'],
 ['zcz','RACH/PRACH','zeroCorrelationZoneConfig (0 … 15) → N_CS theo TS 38.211 bảng 6.3.3.1-5/6/7','NRDUCell: ZeroCorrelationZoneCfg / CellRadius','NRCELL: zeroCorrelationZoneConfig (theo prachCS)','NRCellDU: zeroCorrelationZoneCfg','Từ bán kính cell cộng biên','v'],
 ['rsi','RACH/PRACH','prach-RootSequenceIndex (l839: 0 … 837, l139: 0 … 137)','NRDUCell: LogicalRootSeqIndex','NRCELL: prachRootSeqIndex','NRCellDU: rachRootSequence','Theo quy hoạch, không chồng dải với cell gần','v'],
 ['restrict','RACH/PRACH','restrictedSetConfig: unrestricted, type A, type B (tốc độ cao, chỉ 1,25/5 kHz)','HighSpeedFlag','highSpeedFlag / restrictedSetConfig','restrictedSetConfig','Unrestricted trừ đường sắt cao tốc','v'],
 ['preTgt','RACH/PRACH','preambleReceivedTargetPower (−202 … −60 dBm, bước 2)','PreambleRcvTargetPwr','prachPreambleTargetPwr','preambleRecTargetPower','−110 … −100 dBm','v'],
 ['ramp','RACH/PRACH','powerRampingStep (dB0, dB2, dB4, dB6)','PwrRampingStep','prachPwrRampStep','powerRampingStep','dB2 … dB4','v'],
 ['transMax','RACH/PRACH','preambleTransMax (n3 … n200)','PreambleTransMax','preambleTransMax','preambleTransMax','n7 … n10','v'],
 ['raWin','RACH/PRACH','ra-ResponseWindow (sl1 … sl80)','RaRspWindowSize','raResponseWindow','raResponseWindow','sl10 … sl20','v'],
 ['raPre','RACH/PRACH','totalNumberOfRA-Preambles, ssb-perRACH-OccasionAndCB-PreamblesPerSSB','Số tiền tố CBRA / CFRA','numberOfRaPreambles','numberOfRaPreambles','56 tranh chấp + 8 CFRA','v'],
 ['tat','RACH/PRACH','timeAlignmentTimer (ms500 … ms10240, infinity)','TimeAlignmentTimer','timeAlignmentTimer','timeAlignmentTimer','ms1920 … infinity','v'],
 ['cellRad','RACH/PRACH','Bán kính cell (tham số vendor suy ra N_CS và định dạng)','NRDUCell: CellRadius','cellRadius','cellRange','Theo thiết kế, có biên 10–20 %','v'],
 ['pci','PCI và anten','physCellId (0 … 1007) = 3·N_ID(1) + N_ID(2); SON PCI tự quy hoạch','NRDUCell: PhysicalCellId','NRCELL: physCellId','NRCellDU: nRPCI','Theo quy hoạch tránh collision/confusion, mod 3/30','v'],
 ['eTilt','PCI và anten','Tilt điện (RET, AISG) và tilt cơ; với anten AAU là tilt số của búp SSB','RET: Tilt / NRDUCellTrpBeam: Tilt','RETU: angle / tilt','AntennaNearUnit / RetSubUnit: electricalAntennaTilt','4 … 10° tuỳ độ cao và ISD','v'],
 ['azim','PCI và anten','Azimuth sector (khảo sát, khai báo trong OSS để phân tích)','SectorEqm: Azimuth','Azimuth (thông tin trạm)','SectorCarrier / AntennaSubunit: azimuth','0°, 120°, 240° ± chỉnh theo địa hình','v'],
 ['ssbPwr','PCI và anten','ss-PBCH-BlockPower (SIB1, −60 … 50 dBm) – EPRE của SSS','NRDUCell: SsbPower / MaxTransmitPower','NRCELL: ssPbchBlockPower','NRCellDU: ssbPowerBoost / configuredMaxTxPower','Theo công suất RRU','v']
];
const RXKPI=[
 ['Nhiễu UL trung bình theo PRB (NR)','Trung bình công suất nhiễu thu trên mỗi PRB (dBm) và IoT so với noise floor','N.UL.Interference.Avg (theo PRB)','UL interference per PRB','pmRadioRecInterferencePwrPrb (NR)','IoT ≤ 3 dB lúc rỗi','ul','r_ulint5'],
 ['Tỉ lệ PRB nhiễu cao','Số PRB có nhiễu > noise floor + 6 dB / tổng PRB × 100','Tự tính từ nhiễu theo PRB','Tự tính','Tự tính','≤ 5 %','ul',''],
 ['IoT ký hiệu UL đầu (nhiễu xa)','IoT ở ký hiệu UL đầu ô S/slot U; độ dốc so với ký hiệu cuối','Bộ đếm nhiễu theo ký hiệu (RIM)','Remote interference counters','Đo nhiễu theo ký hiệu','< 3 dB; dốc > 3 dB là nhiễu xa','tdd','r_rim'],
 ['Thời gian back-off RIM','Tổng thời gian cell áp dụng back-off trong ngày','Thời gian kích hoạt RIM','RIM active time','Thời gian RIM hoạt động','Càng ngắn càng tốt','tdd',''],
 ['Tỉ lệ UE giới hạn công suất (PHR)','Số báo cáo PHR có PH < 0 / tổng báo cáo PHR × 100','N.PHR.Neg / N.PHR.Total (quy ước)','PHR distribution counters','pmPowerHeadroom… (phân bố)','≤ 10 %','pc','r_phr'],
 ['SINR PUSCH trung bình và 5 %','Phân bố SINR PUSCH đo ở gNB','Phân bố SINR UL','UL SINR distribution','pmSinrPusch… (phân bố)','5 % > 0 dB','pc',''],
 ['UL BLER / HARQ lần đầu','Khối PUSCH lỗi lần truyền đầu / tổng × 100','N.UL.BLER (quy ước)','UL HARQ BLER','pmMacHarqUl…','≈ 10 % (theo đích link adaptation)','pc','bler4'],
 ['Tốc độ UL người dùng (rìa cell)','Thông lượng UL UE, phân vị 5 %','N.ThpVol.UL / N.ThpTime.UL','UL UE throughput','pmMacVolUl / pmMacTimeUl','Theo hợp đồng dịch vụ','pc','tputul5'],
 ['NR RACH Success Rate','RA thành công / số tiền tố nhận × 100','N.RA.Att / N.RA.Succ (quy ước)','RACH att/succ','pmRaAttCbra / pmRaSuccCbra','≥ 95 %','rach','rach5'],
 ['Tỉ lệ Msg2 không có Msg3','RAR gửi nhưng không nhận Msg3 / RAR gửi × 100 (tiền tố “ma”, TA sai, UL yếu)','Đếm RAR và Msg3','Msg2/Msg3 counters','pmRaMsg2… / pmRaMsg3…','≤ 10 %','rach',''],
 ['Phân bố TA, tỉ lệ vượt bán kính','Số mẫu TA > bán kính quy hoạch / tổng mẫu × 100','N.TA.Index* (phân bố)','TA distribution','pmTaDistr…','≤ 5 %','rach','r_ta'],
 ['Xung đột PCI (collision, confusion)','Số cặp lân cận trùng PCI và số cell có hai lân cận trùng PCI','Báo cáo SON / ANR PCI conflict','SON PCI conflict alarm','PCI conflict alarm (SON)','0','pci','r_pci'],
 ['Tỉ lệ chồng lấn (≥ 4 cell trong 6 dB)','Mẫu MR/MDT có từ 4 cell trở lên trong 6 dB so với cell mạnh nhất / tổng mẫu × 100','MR/MDT phân tích','MDT, MR','MDT, cell trace','≤ 10 %','pci',''],
 ['Tỉ lệ HO sai đích / quá sớm / quá muộn','MRO theo cặp cell, tách ca do PCI confusion','HO too early / late / wrong cell','MRO counters','pmHoTooEarly / TooLate / WrongCell','Thấp, ổn định','pci','hosr5']
];
/* [tiêu đề, triệu chứng, nguyên nhân[], kiểm tra[], gợi ý vendor {h,n,e}, KPI liên quan, mục] */
const RXFLT=[
 ['Nhiễu UL tăng ban đêm ở cụm TDD ven biển','IoT 10–25 dB từ 22h tới 8h, ký hiệu UL đầu nặng nhất, nhiều cell cùng lúc',['Ống dẫn khí quyển đưa DL trạm cách 100–400 km tới','GP ngắn (2 ký hiệu ≈ 21 km)'],['Đồ thị IoT theo ký hiệu (độ dốc)','So nhiều cell theo hướng biển','Thời tiết: nghịch nhiệt, mùa'],{h:'Bật RIM, xem bộ đếm nhiễu xa theo ký hiệu',n:'Bật RIM, kiểm tra rimBackoffSymbols',e:'Bật Remote Interference Management'},'IoT ký hiệu UL đầu (nhiễu xa)','tdd'],
 ['UL sụt khi mạng riêng cạnh dùng khung khác','IoT cao ở một số ký hiệu cố định, theo lịch hoạt động khu công nghiệp',['Mạng riêng DSUUU cạnh mạng công cộng DDDSU','Không đồng bộ ranh giới khung'],['Đối chiếu khung TDD của bên lân cận','Nhiễu theo ký hiệu khớp ký hiệu DL của họ'],{h:'Phối hợp cấu hình SlotAssignment',n:'Phối hợp tddFrameStructure',e:'Phối hợp tddUlDlPattern'},'Nhiễu UL trung bình theo PRB (NR)','tdd'],
 ['Cả cụm nhiễu sau sự cố GNSS','Nhiễu UL tăng dần ở các cell quanh một trạm, kèm cảnh báo đồng bộ',['Mất GNSS, hết holdover, lệch pha > 1,5 µs','Ăng-ten GNSS hỏng, che khuất'],['Cảnh báo đồng bộ, thời điểm mất GNSS','Lệch pha báo cáo của trạm'],{h:'Kiểm tra GPS alarm, cấu hình holdover',n:'Kiểm tra SYNC alarm',e:'Kiểm tra RadioEquipmentClock, TimeSyncIO'},'Nhiễu UL trung bình theo PRB (NR)','tdd'],
 ['PIM: nhiễu UL bám theo tải DL','IoT tăng giờ cao điểm, lệch nhánh, nặng sau mưa gió',['Đầu nối lỏng, ăn mòn; kim loại gần anten','Hai sóng mang DL tạo IM3 rơi vào UL'],['Tương quan IoT với tải DL','Thử giảm công suất/tắt một sóng mang','Đo PIM hiện trường (IEC 62037)'],{h:'PIM detection, AIM',n:'PIM detection',e:'Interference detection / PIM mitigation'},'Nhiễu UL trung bình theo PRB (NR)','ul'],
 ['Đỉnh nhiễu hẹp cố định ở vài PRB','Nhiễu không đổi theo tải, có thể 24/7 hoặc theo giờ hành chính',['Thiết bị phát lậu, camera không dây, bộ khuếch đại hỏng','Hài của hệ thống khác'],['Phổ theo PRB, dò hướng','Báo cơ quan quản lý tần số'],{h:'Quét phổ UL tại trạm',n:'Spectrum scan UL',e:'UL spectrum analyzer (tính năng trạm)'},'Tỉ lệ PRB nhiễu cao','ul'],
 ['Toàn băng nâng nền đều','Noise floor cao 3–10 dB mọi PRB, mọi giờ',['Repeater lậu tự kích, khuếch đại băng rộng','Bộ lọc hỏng'],['Phổ phẳng, không theo giờ','Tắt thử repeater trong vùng'],{h:'Kiểm tra cảnh báo nhiễu UL',n:'—',e:'—'},'Nhiễu UL trung bình theo PRB (NR)','ul'],
 ['Một nhánh thu nhiễu cao','RX1 cao hơn nhánh khác vài dB, không theo tải',['Feeder, đầu nối, LNA, VSWR','Lỗi RRU'],['So nhánh, đổi chéo feeder','Cảnh báo VSWR'],{h:'RRU RX branch imbalance alarm',n:'RX diversity imbalance',e:'Kiểm tra RfBranch, VSWR'},'Nhiễu UL trung bình theo PRB (NR)','ul'],
 ['UE rìa cell UL kém, PH âm nhiều','Tốc độ UL rìa thấp, tỉ lệ PHR âm cao',['P0 hoặc alpha thấp so với phủ','Cấp quá nhiều PRB cho UE thiếu công suất','Xuyên tường lớn'],['Phân bố PHR','Phân bố SINR PUSCH'],{h:'Tăng P0NominalPusch hoặc PathLossCoeff',n:'Tăng p0NomPusch, ulpcAlpha',e:'Tăng pZeroNomPuschGrant'},'Tỉ lệ UE giới hạn công suất (PHR)','pc'],
 ['IoT cả mạng tăng sau khi nâng P0','IoT cao ở nhiều cell giờ cao điểm, SINR UL không cải thiện',['P0 quá cao, alpha = 1','Mật độ trạm dày'],['So IoT trước/sau thay đổi','Đánh đổi tốc độ rìa và trung vị'],{h:'Giảm P0, alpha 0,7–0,8',n:'Giảm p0NomPusch',e:'Giảm pZeroNomPuschGrant'},'Nhiễu UL trung bình theo PRB (NR)','pc'],
 ['Mất HARQ-ACK/CSI ở rìa cell','DL BLER tăng, CQI mất, PUCCH DTX cao',['P0 PUCCH thấp','Định dạng PUCCH ngắn ở rìa'],['Tỉ lệ DTX PUCCH','SINR PUCCH'],{h:'Tăng P0NominalPucch',n:'Tăng p0NomPucch',e:'Tăng pZeroNomPucch'},'UL BLER / HARQ lần đầu','pc'],
 ['RACH thấp do tiền tố “ma”','Nhiều Msg2 nhưng không có Msg3, RACH SR thấp ở cặp cell',['Hai cell gần trùng gốc hoặc chồng dải RSI'],['Quy hoạch RSI theo số gốc mỗi cell','Đếm Msg2 không có Msg3'],{h:'Đổi LogicalRootSeqIndex',n:'Đổi prachRootSeqIndex',e:'Đổi rachRootSequence'},'Tỉ lệ Msg2 không có Msg3','rach'],
 ['RACH lỗi với UE ở xa','UE xa trạm không vào được, TA ước lượng sai',['N_CS nhỏ so với bán kính thật','Định dạng tiền tố có CP/GT ngắn'],['Phân bố TA so với bán kính','Bảng N_CS'],{h:'Tăng CellRadius / ZeroCorrelationZoneCfg',n:'Tăng zeroCorrelationZoneConfig',e:'Tăng cellRange'},'NR RACH Success Rate','rach'],
 ['Cell overshoot','TA lớn, cell phục vụ vùng xa, HO nhiều cặp lạ',['Tilt quá nhỏ, anten cao','Địa hình (đồi, mặt nước)'],['Phân bố TA','Bản đồ vùng phục vụ'],{h:'Tăng tilt RET',n:'Tăng tilt',e:'Tăng electricalAntennaTilt'},'Phân bố TA, tỉ lệ vượt bán kính','pci'],
 ['HO tới nhầm cell (PCI confusion)','RLF sau HO ở một số cặp, MRO wrong cell',['Hai lân cận cùng PCI','Khai báo lân cận theo PCI không có NCGI'],['Danh sách lân cận và PCI','Báo cáo SON conflict'],{h:'Bật SON PCI conflict detection',n:'SON PCI management',e:'ANR, PCI conflict detection'},'Xung đột PCI (collision, confusion)','pci'],
 ['SINR SSB thấp vùng chồng lấn','Nhiều cell trong 6 dB, ping-pong, CQI thấp',['Tilt, azimuth chưa tối ưu','Trùng mod 3 giữa cell đối diện'],['Bản đồ chồng lấn','PCI mod 3 của cặp chồng lấn'],{h:'Tối ưu RET, PCI',n:'Tối ưu tilt, PCI',e:'Tối ưu tilt, PCI'},'Tỉ lệ chồng lấn (≥ 4 cell trong 6 dB)','pci'],
 ['PCI đổi xong mà HO vẫn lỗi','Sau quy hoạch lại PCI, HO tới cell đó thất bại',['Cell lân cận chưa cập nhật PCI mới','NR-CGI ↔ PCI cũ còn trong danh sách'],['Đồng bộ cấu hình qua Xn (NG-RAN Configuration Update)','Kiểm tra NRCellRelation'],{h:'Kiểm tra NRExternalCell',n:'Kiểm tra NRADJNRCELL',e:'Kiểm tra ExternalNRCellCU'},'Tỉ lệ HO sai đích / quá sớm / quá muộn','pci']
];
function rxParRows(){const P=RXP.vd,q=P.q.trim().toLowerCase(),v=nVn();
  const rows=RXPAR.filter(r=>(P.grp==='all'||r[1]===P.grp)&&(!q||r.join(' ').toLowerCase().includes(q)));
  const cols=v==='3gpp'?[3,4,5]:[{huawei:3,nokia:4,ericsson:5}[v]];
  return rows.map(r=>`<tr><td><span class="chip">${nE(r[1])}</span><br>${nE(r[2])}</td>${cols.map(c=>`<td class="u3tag">${nE(r[c])}</td>`).join('')}<td>${nE(r[6])}</td><td>${r[7]==='v'?'<span class="kpC mid">Cần đối chiếu</span>':'<span class="kpC ok">Thường gặp</span>'}</td></tr>`).join('')||'<tr><td colspan="6">Không có tham số khớp.</td></tr>';}
function rxParHead(){const v=nVn();return `<tr><th>Tham số (3GPP / ý nghĩa)</th>${v==='3gpp'?'<th>Huawei</th><th>Nokia</th><th>Ericsson</th>':`<th>${nVName(v)}</th>`}<th>Điển hình</th><th>Độ tin cậy tên</th></tr>`;}
function rxKpiRows(){const v=nVn(),f=RXP.vd.kf;return RXKPI.filter(k=>f==='all'||k[6]===f).map(k=>`<tr><td><b>${nE(k[0])}</b>${k[7]&&typeof KL!=='undefined'&&KL.find(x=>x.id===k[7])?`<br><button type="button" class="u3lnkbtn" data-rxgo="kpi:${k[7]}">Mở ở thẻ KPI →</button>`:''}</td><td>${nE(k[1])}</td><td class="u3tag">${v==='3gpp'?['Huawei: '+k[2],'Nokia: '+k[3],'Ericsson: '+k[4]].map(nE).join('<br>'):nE(k[{huawei:2,nokia:3,ericsson:4}[v]])}<br><span class="kpC mid">cần đối chiếu</span></td><td>${nE(k[5])}</td><td><button type="button" class="btn sm" data-rxgo="rx:${k[6]}">Mô phỏng →</button></td></tr>`).join('');}
function rxFltHtml(){const v=nVn();return RXFLT.map(f=>`<details class="u3flt ndflt rxflt"><summary><b>${nE(f[0])}</b></summary><p class="e2d">${nE(f[1])}</p><div class="u3two"><div><b>Nguyên nhân</b><ul class="u3ul">${f[2].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div><div><b>Kiểm tra</b><ul class="u3ul">${f[3].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div></div><p class="note">${v==='3gpp'?['Huawei: '+f[4].h,'Nokia: '+f[4].n,'Ericsson: '+f[4].e].map(nE).join(' · '):nVName(v)+': '+nE(f[4][v[0]])} · KPI: ${nE(f[5])} · <button type="button" class="u3lnkbtn" data-rxgo="rx:${f[6]}">Mô phỏng →</button></p></details>`).join('');}
function rxCalc(){const g=id=>{const e=$('#'+id);return e?+e.value:0;},o=$('#rxcOut');if(!o)return;
  const ia=g('rxcIa'),nf=g('rxcNf'),scs=g('rxcScs'),hi=g('rxcHi'),np=g('rxcNp'),pn=g('rxcPn'),pt=g('rxcPt'),ra=g('rxcRa'),rs=g('rxcRs'),ta=g('rxcTa'),to=g('rxcTo');const N=-174+10*Math.log10(12*scs*1e3)+nf;
  o.innerHTML=rKv('Noise floor / PRB',nF(N,1)+' dBm')+rKv('IoT trung bình',nF(ia-N,1)+' dB')+rKv('Tỉ lệ PRB nhiễu cao',np?nF(hi/np*100,1)+' %':'—')+rKv('Tỉ lệ UE giới hạn công suất',pt?nF(pn/pt*100,1)+' %':'—')+rKv('RACH SR',ra?nF(rs/ra*100,2)+' %':'—')+rKv('TA vượt bán kính',ta?nF(to/ta*100,1)+' %':'—');}
RXR.vd={
 html(){const P=RXP.vd,grps=[...new Set(RXPAR.map(r=>r[1]))];
  return `<div class="panel"><h3>Bảng tham số tối ưu vô tuyến</h3><p class="hint">Chọn vendor ở thanh trên để chỉ hiện cột của vendor đó. Tên gắn “Cần đối chiếu” là tên thường gặp, phải kiểm tra lại theo tài liệu release đang dùng.</p>
   <div class="ctl" style="margin-bottom:10px">${rSel('vd','grp','Nhóm',[['all','Tất cả']].concat(grps.map(g=>[g,g])))}<label class="c"><span class="cl">Lọc</span><input type="search" id="rxvq" value="${nE(P.q)}" placeholder="Ví dụ: P0, alpha, root, PCI"></label></div>
   <div class="scroll"><table class="ndtb"><thead id="rxParH">${rxParHead()}</thead><tbody id="rxParB">${rxParRows()}</tbody></table></div></div>
  <div class="panel"><h3>KPI theo dõi</h3><div class="ctl" style="margin-bottom:10px">${rSel('vd','kf','Theo mục',[['all','Tất cả']].concat(RXV.filter(v=>v[0]!=='vd').map(v=>[v[0],v[1]])))}</div>
   <div class="scroll"><table class="ndtb"><thead><tr><th>KPI</th><th>Công thức</th><th>Bộ đếm</th><th>Mục tiêu</th><th></th></tr></thead><tbody id="rxKpB">${rxKpiRows()}</tbody></table></div>
   <div class="u3calc"><b>Tính nhanh từ bộ đếm</b><div class="ctl ndcalc rxcalc" style="margin-top:8px">
    ${[['rxcIa','Nhiễu UL trung bình / PRB (dBm)',-112],['rxcNf','NF máy thu (dB)',3.5],['rxcScs','SCS (kHz)',30],['rxcHi','Số PRB nhiễu > N + 6 dB',14],['rxcNp','Tổng PRB',273],['rxcPn','Báo cáo PHR có PH < 0',1850],['rxcPt','Tổng báo cáo PHR',24000],['rxcRa','Tiền tố nhận',52000],['rxcRs','RA thành công',50100],['rxcTa','Mẫu TA',90000],['rxcTo','Mẫu TA vượt bán kính',6200]].map(r=>`<label class="c"><span class="cl">${r[1]}</span><input type="number" id="${r[0]}" value="${r[2]}" step="any"></label>`).join('')}
   </div><dl class="kv" id="rxcOut" style="margin-top:8px"></dl></div></div>
  <div class="panel"><h3>Lỗi thường gặp và cách kiểm tra</h3>${rxFltHtml()}</div>
  <div class="panel"><h3>Tiêu chuẩn tham chiếu</h3><ul class="u3ul"><li>TS 38.211: PRACH (§6.3.3, bảng N_CS 6.3.3.1-5/6/7, gốc 6.3.3.1-3/4), RIM-RS (Rel-16)</li><li>TS 38.213: điều khiển công suất PUSCH/PUCCH/SRS/PRACH (§7), timing advance (§4.2)</li><li>TS 38.321: truy nhập ngẫu nhiên (§5.1), TA (§5.2), PHR (§5.4.6); TS 38.133: chỉ số PH (bảng 10.1.17.1-1), đồng bộ cell 3 µs (§7.4)</li><li>TS 38.331: TDD-UL-DL-ConfigCommon, RACH-ConfigCommon, PUSCH/PUCCH-PowerControl, PHR-Config, MeasObjectCLI</li><li>TS 38.215: SRS-RSRP, CLI-RSSI; TS 38.300 §16 (RIM, CLI); TS 38.413 (NGAP RIM Information Transfer)</li><li>TR 38.866 (RIM), TR 38.828 (CLI), TR 38.901 (kênh, anten), TS 38.104 (máy thu trạm), TS 28.552 (bộ đếm PM), IEC 62037 (PIM), ITU-R P.452 (ống dẫn)</li></ul></div>`;},
 after(){rxCalc();},
 upd(k){if(k==='grp'){const b=$('#rxParB');if(b)b.innerHTML=rxParRows();}if(k==='kf'){const b=$('#rxKpB');if(b)b.innerHTML=rxKpiRows();}}
};
document.addEventListener('input',e=>{const t=e.target;if(t.id==='rxvq'){RXP.vd.q=t.value;const b=$('#rxParB');if(b)b.innerHTML=rxParRows();}else if(t.id&&/^rxc[A-Z]/.test(t.id))rxCalc();});

/* ---------- Gắn thẻ vào ứng dụng: RENDER, KPI mới, tìm kiếm chung, liên kết E2E/KPI/thẻ cũ ---------- */
RENDER.ro=renderRx;
/* KPI mới cho thẻ KPI mạng (nhóm 5G RAN) */
(function(){if(typeof K!=='function'||typeof KL==='undefined')return;try{
  if(typeof KPB!=='undefined'){
   if(!KPB.rim)KPB.rim={t:"Nhiễu xa TDD (remote interference)",
    st:["Xem IoT theo từng ký hiệu UL: ký hiệu đầu cao nhất, giảm dần là chữ ký nhiễu xa; nhiễu đều mọi ký hiệu là nhiễu ngoài hoặc PIM.","Đối chiếu theo giờ (22h–8h) và theo mùa; xem cùng lúc nhiều cell hướng ra biển, đồng bằng.","Ước lượng khoảng cách từ số ký hiệu bị đè: mỗi ký hiệu 30 kHz ≈ 10,7 km sau khoảng bảo vệ.","Bật RIM framework 1 hoặc 2; kiểm tra RIM-RS set ID và chu kỳ phát giống nhau trong vùng.","Tạm thời: back-off ký hiệu DL cuối ở cụm gây nhiễu, nâng tilt, giảm công suất."],
    ca:["Ống dẫn khí quyển (nghịch nhiệt) ban đêm","Khoảng bảo vệ ngắn so với khoảng cách gây nhiễu","Anten tilt nhỏ, trạm cao ven biển"],
    pa:["Cấu hình khung TDD và ô S","Bật RIM, ngưỡng, số ký hiệu back-off","Tilt"],cs:[],gen:1};
   if(!KPB.pci)KPB.pci={t:"Xung đột PCI và chồng lấn",
    st:["Liệt kê collision (lân cận trùng PCI) và confusion (hai lân cận trùng PCI) từ SON/ANR hoặc từ cấu hình lân cận.","Đối chiếu HO wrong cell / RLF sau HO theo cặp cell (MRO).","Kiểm tra mod 3 (PSS), mod 4 (DMRS PBCH), mod 30 (DMRS/SRS UL) giữa cell chồng lấn mạnh.","Sau khi đổi PCI, cập nhật lân cận ở mọi cell kề (NG-RAN Configuration Update, external cell).","Xem chồng lấn: tilt, azimuth, công suất; cell overshoot qua phân bố TA."],
    ca:["Gán PCI tay, lặp lại trong vùng nhỏ","Cell mới bật không quy hoạch lại","Overshoot làm cell xa thành lân cận"],
    pa:["physCellId","Danh sách lân cận, ANR","Tilt, azimuth"],cs:[],gen:1};}
  const add=a=>{if(KL.some(k=>k.id===a[0]))return;K(...a);};
  add(["r_ulint5","5G","ran","utl","NR UL Interference per PRB","du","intf","g|dB|0|20|d|3|6|1",
   "IoT (dB) = công suất nhiễu thu trung bình trên PRB − noise floor; noise floor = −174 + 10·log10(12·SCS) + NF.","TS 28.552 (đo nhiễu UL theo PRB, tên đo theo release); TS 38.104 (máy thu trạm).",
   "?Counter nhiễu UL theo PRB (tra Huawei NR PM Reference)","?pmRadioRecInterferencePwr… NR (tra Ericsson NR PM)","?Counter nhiễu UL NR (tra Nokia 5G PM Counter Reference)",
   "Nhiễu UL cao làm SINR PUSCH, PUCCH, PRACH giảm; KPI truy cập và tốc độ UL sụt trước.","IoT lúc rỗi ≤ 3 dB; > 6 dB cần dò nguồn (PIM, nhiễu ngoài, nhiễu xa).",
   "ue>du:PUSCH/PUCCH (nhiễu cộng thêm tại anten)"]);
  add(["r_rim","5G","ran","utl","Remote Interference (IoT ký hiệu UL đầu)","du","rim","g|dB|0|25|d|3|6|1",
   "IoT ký hiệu UL đầu = nhiễu trên ký hiệu UL đầu tiên sau GP − noise floor; độ dốc = IoT ký hiệu đầu − ký hiệu cuối.","TS 38.300 §16 (RIM), TR 38.866, TS 38.211 (RIM-RS).",
   "?Counter nhiễu xa theo ký hiệu (tra Huawei NR)","?Counter RIM (tra Ericsson NR)","?Counter RIM (tra Nokia 5G)",
   "Nhiễu xa làm UL, RACH ở ký hiệu đầu sụt theo đêm, trên diện rộng.","< 3 dB; dốc > 3 dB và lặp theo đêm là nhiễu xa.",
   "du>du:DL trạm xa tới trễ τ = d/c, đè lên UL!A;du>du:RIM-RS-1 / back-off!S"]);
  add(["r_phr","5G","ran","int","Tỉ lệ UE giới hạn công suất (PHR < 0)","ue,du","intf","g|%|0|40|d|10|20|5",
   "UE giới hạn công suất % = báo cáo PHR có PH < 0 / tổng báo cáo PHR × 100; PH = P_CMAX − công suất PUSCH cần.","TS 38.321 §5.4.6 (PHR), TS 38.213 §7.1.1, TS 38.133 bảng 10.1.17.1-1.",
   "?Counter phân bố PHR (tra Huawei NR PM)","?pmPowerHeadroom… (tra Ericsson NR PM)","?Counter PHR (tra Nokia 5G PM)",
   "Nhiều UE thiếu công suất: tốc độ UL rìa thấp, nên giảm PRB cho UE rìa hoặc chỉnh P0/alpha.","≤ 10 %, phụ thuộc phủ.",
   "ue>du:PHR MAC CE (PH, P_CMAX)!A;du>ue:DCI 0_1 (TPC, số PRB)!S"]);
  add(["r_ta","5G","ran","utl","TA Distribution / Overshoot","ue,du","rach","g|%|0|30|d|5|10|2",
   "TA vượt bán kính % = mẫu T_A lớn hơn bán kính quy hoạch / tổng mẫu × 100; 1 T_A = 16·64·T_c/2^μ (≈ 39 m một chiều ở 30 kHz).","TS 38.213 §4.2, TS 38.321 §5.2, TS 28.552 (phân bố TA).",
   "?Counter phân bố TA (tra Huawei NR PM)","?pmTaDistr… (tra Ericsson NR PM)","?Counter TA (tra Nokia 5G PM)",
   "Phát hiện cell overshoot, N_CS không đủ cho bán kính thật.","≤ 5 % mẫu vượt bán kính.",
   "du>ue:RAR (TA command 12 bit)!A;du>ue:TA MAC CE (6 bit)!S"]);
  add(["r_pci","5G","ran","mob","Xung đột PCI (collision / confusion)","du,cucp","pci","g|cặp|0|10|d|1|3|0",
   "Số cặp lân cận trùng PCI + số cell có hai lân cận trùng PCI (từ SON/ANR hoặc phân tích cấu hình).","TS 38.211 §7.4.2 (PCI = 3·N_ID(1) + N_ID(2)), TS 38.300 (SON, ANR), TS 32.500.",
   "?Cảnh báo PCI conflict (Huawei SON)","?PCI conflict detection (Ericsson SON)","?SON PCI management (Nokia)",
   "PCI trùng làm HO tới nhầm cell, RLF, SSB chồng nhau.","0.",
   "ue>cucp:MeasurementReport (PCI)!A;cucp>ue:reportCGI khi confusion;cucp>cucp:Xn HO tới đích đúng NCGI!S"]);
  const XN={r_ulint5:["Nhiễu UL trung bình theo PRB (NR)","UL IoT","UL interference|IoT|noise rise|RSSI UL|noise floor","Mức nhiễu thu đường lên trên mỗi PRB so với noise floor của máy thu gNB. Cao do PIM, nhiễu ngoài, repeater, nhiễu xa TDD hoặc UE cell lân cận phát mạnh."],
    r_rim:["Nhiễu xa ở ký hiệu UL đầu (TDD)","RI","remote interference|RIM|ducting|ống dẫn|atmospheric duct|RIM-RS","IoT ở ký hiệu UL đầu tiên sau khoảng bảo vệ. Ban đêm, ống dẫn khí quyển đưa DL trạm cách hàng trăm km tới trễ, đè lên UL; dấu hiệu là IoT dốc theo ký hiệu."],
    r_phr:["Tỉ lệ UE giới hạn công suất","PHR<0","power headroom|PHR|PH âm|power limited|P_CMAX","Tỉ lệ báo cáo power headroom âm: UE đã phát hết công suất mà vẫn chưa đủ cho số PRB được cấp. Phản ánh phủ UL và cấu hình P0/alpha."],
    r_ta:["Phân bố timing advance và overshoot","TA Over","timing advance|TA|overshoot|cell radius|bán kính","Tỉ lệ mẫu TA vượt bán kính quy hoạch. Cao nghĩa là cell phục vụ quá xa (tilt nhỏ, anten cao) hoặc N_CS của PRACH không đủ."],
    r_pci:["Xung đột PCI (collision, confusion)","PCI Conf","PCI conflict|PCI collision|PCI confusion|physCellId|mod 3|mod 30","Số xung đột PCI giữa các cell lân cận: trùng PCI hoặc một cell có hai lân cận cùng PCI. Gây HO sai đích và RLF."]};
  const EN={r_ulint5:"NR Uplink Interference per PRB (IoT)",r_rim:"Remote Interference (first UL symbol IoT)",r_phr:"Power-Limited UE Ratio (PHR < 0)",r_ta:"Timing Advance Overshoot Ratio",r_pci:"PCI Collision / Confusion Count"};
  for(const id in XN){const k=KL.find(x=>x.id===id);if(!k)continue;const x=XN[id];if(typeof KX!=='undefined')KX[id]=x;if(typeof KEN!=='undefined')KEN[id]=EN[id];
    k.fn=x[0];k.ab=[x[1]].concat(x[2].split('|'));k.gl=x[3];k.dn=k.fn+' ('+x[1]+')';k.en=EN[id];}
  /* đặt sau rach5 */
  const ids=['r_ulint5','r_rim','r_phr','r_ta','r_pci'],moved=ids.map(id=>{const i=KL.findIndex(k=>k.id===id);return i>=0?KL.splice(i,1)[0]:null;}).filter(Boolean);
  const j=KL.findIndex(k=>k.id==='rach5');KL.splice(j>=0?j+1:KL.length,0,...moved);
}catch(e){console.error('KPI tối ưu vô tuyến mới',e);}})();
/* tìm kiếm chung */
if(typeof qSnap==='function'){const _qr=qSnap;qSnap=function(){_qr.apply(this,arguments);if(!QS||!QS.I||QS.ro)return;QS.ro=1;
  const CAT='Thẻ Tối ưu vô tuyến';
  const body=$('#rxBody'),cur=RXS.v,curSub=RXP.tdd.sub;
  if(body){for(const [v,vn] of RXV){const subs=v==='tdd'?['duct','cli','sync']:[null];for(const sb of subs){try{RXS.v=v;if(sb)RXP.tdd.sub=sb;body.innerHTML=RXR[v].html();
    body.querySelectorAll('.panel').forEach(pn=>{const h=pn.querySelector('h3'),tt=h?h.textContent:vn,txt=qText(pn).slice(0,6000);if(txt.trim().length<12)return;
      qAdd(QS.I,CAT+' · '+vn,tt,txt,1,()=>{S.tab='ro';RXS.v=v;if(sb)RXP.tdd.sub=sb;},()=>[...document.querySelectorAll('#t-ro .panel')].find(p=>{const x=p.querySelector('h3');return x&&x.textContent===tt;}));});}catch(e){console.error(e);}}}
    RXS.v=cur;RXP.tdd.sub=curSub;try{if(S.tab==='ro')renderRx();else body.innerHTML='';}catch(e){}}
  const go=(v,f)=>()=>{S.tab='ro';RXS.v=v;if(f)f();};
  RXPAR.forEach(r=>qAdd(QS.I,'Tối ưu vô tuyến · Tham số '+r[1],r[2],['Huawei: '+r[3],'Nokia: '+r[4],'Ericsson: '+r[5],'Điển hình: '+r[6]].join('. '),3,go('vd',()=>{RXP.vd.grp=r[1];RXP.vd.q='';}),'#rxParB'));
  RXKPI.forEach(k=>qAdd(QS.I,'Tối ưu vô tuyến · KPI',k[0],[k[1],'Huawei: '+k[2],'Nokia: '+k[3],'Ericsson: '+k[4],k[5]].join('. '),3,go('vd'),'#rxKpB'));
  RXFLT.forEach(f=>qAdd(QS.I,'Tối ưu vô tuyến · Lỗi thường gặp',f[0],[f[1],f[2].join('; '),f[3].join('; '),f[4].h,f[4].n,f[4].e].join('. '),3,go('vd'),()=>{const d=[...document.querySelectorAll('#t-ro .rxflt')].find(x=>x.querySelector('summary').textContent===f[0]);if(d)d.open=true;return d;}));
  Object.entries(RXPAT).forEach(([k,p])=>qAdd(QS.I,'Tối ưu vô tuyến · Cấu hình khung TDD',p.n,'TDD-UL-DL-ConfigCommon, ô S, khoảng bảo vệ GP, nhiễu xa, ducting, CLI nhiễu chéo',2,go('tdd',()=>{RXP.tdd.sub='duct';RXP.tdd.pat=k;}),'#rxTdFr'));
  [['duct','Nhiễu xa, ống dẫn khí quyển, RIM-RS, back-off','remote interference ducting RIM RIM-RS framework 1 framework 2 back-off NGAP RIM Information Transfer'],['cli','Nhiễu chéo CLI giữa hai cấu hình khung','cross-link interference CLI SRS-RSRP CLI-RSSI dynamic TDD gNB-gNB UE-UE'],['sync','Lệch đồng bộ TDD, mất GNSS, holdover','GNSS PTP holdover 3 µs TS 38.133 phase synchronization OCXO']].forEach(([k,n,x])=>qAdd(QS.I,'Tối ưu vô tuyến · Nhiễu TDD',n,x,3,go('tdd',()=>{RXP.tdd.sub=k;}),'#rxBody'));
  RXSRC.forEach(([k,n])=>qAdd(QS.I,'Tối ưu vô tuyến · Nguồn nhiễu UL',n,'dò nhiễu UL RSSI theo PRB noise floor IoT PIM IM3 2f1-f2 repeater jammer nhánh thu',2,go('ul'),'#rxUlSp'));
  Object.entries(RXFMT).forEach(([k,f])=>qAdd(QS.I,'Tối ưu vô tuyến · Định dạng PRACH',f.n,'PRACH preamble format Zadoff-Chu root sequence N_CS zeroCorrelationZoneConfig bán kính cell CP GT',2,go('rach',()=>{RXP.rach.fmt=k;}),'#rxNcs'));
  [['Zadoff-Chu và root sequence','x_u(n) cyclic shift N_CS prach-RootSequenceIndex logical root u RSI tiền tố ma'],['Timing advance (TA)','T_A 12 bit RAR TA MAC CE 16·64·Tc timeAlignmentTimer overshoot'],['Tăng bậc công suất PRACH','preambleReceivedTargetPower powerRampingStep preambleTransMax ra-ResponseWindow Msg1 Msg2 Msg3 Msg4']].forEach(([n,x])=>qAdd(QS.I,'Tối ưu vô tuyến · RACH',n,x,2,go('rach'),'#rxPdp'));
  [['Công thức P_PUSCH (P0, alpha)','P0 nominal PUSCH alpha fractional power control TS 38.213 PL'],['Power headroom (PHR)','PHR MAC CE phr-PeriodicTimer phr-ProhibitTimer phr-Tx-PowerFactorChange PH chỉ số 38.133'],['TPC vòng kín','TPC DCI 0_1 tích luỹ tuyệt đối tpc-Accumulation P_CMAX'],['Công suất PUCCH','P0 PUCCH deltaF-PUCCH HARQ-ACK CSI']].forEach(([n,x])=>qAdd(QS.I,'Tối ưu vô tuyến · Điều khiển công suất',n,x,2,go('pc'),'#rxPcSw'));
  [['PCI collision, confusion','physCellId trùng lân cận, reportCGI, ANR, SON'],['PCI mod 3, mod 4, mod 30','PSS N_ID(2), DMRS PBCH, DMRS SRS nhóm chuỗi'],['Quy hoạch RSI','root sequence index chồng dải số gốc mỗi cell'],['Tilt, azimuth, chồng lấn, overshoot','pilot pollution chồng lấn 6 dB RET tilt azimuth overshoot TA']].forEach(([n,x])=>qAdd(QS.I,'Tối ưu vô tuyến · Quy hoạch PCI/RSI',n,x,2,go('pci'),'#rxPciMap'));};}
/* thẻ Toàn trình E2E: nút sang thẻ này (4G, 5G NSA/SA) */
const RXE2V={reg:'rach',data:'pc',ho:'pci',idle:'pci',mo:'ul',mt:'rach'};
if(typeof e2Kpi==='function'){const _kr=e2Kpi;e2Kpi=function(){_kr.apply(this,arguments);if(!['g4','nsa','sa'].includes(S.e2R))return;const v=RXE2V[S.e2Sc];if(!v)return;const b=$('#e2Kpi .e2go');
  if(b&&!b.querySelector('[data-rxgo]'))b.insertAdjacentHTML('beforeend',`<button type="button" class="btn sm" data-rxgo="rx:${v}">Tối ưu vô tuyến · ${nE(RXV.find(x=>x[0]===v)[1])} →</button>`);};}
/* thẻ KPI: KPI liên quan có nút sang mục tương ứng */
const RXKV={r_ulint5:'ul',r_rim:'tdd',r_phr:'pc',r_ta:'rach',r_pci:'pci',ulint4:'ul',u_rtwp:'ul',g_icm:'ul',rach4:'rach',rach5:'rach',g_ta:'rach',tputul5:'pc',tputul4:'pc',bler4:'pc',cqi5:'pci'};
if(typeof kpDetHtml==='function'){const _kq=kpDetHtml;kpDetHtml=function(k){let h=_kq.apply(this,arguments);if(k&&RXKV[k.id]){const v=RXKV[k.id];h+=`<p class="u3kpl"><button type="button" class="btn sm" data-rxgo="rx:${v}">Xem mô phỏng ở thẻ Tối ưu vô tuyến · ${nE(RXV.find(x=>x[0]===v)[1])} →</button></p>`;}return h;};}
/* thẻ Phủ sóng, Khung, Búp sóng, Cấp phát PRB: thanh nút sang thẻ này */
const RXTABL={radio:[['pci','PCI/RSI, tilt, chồng lấn'],['pc','Công suất UL, PHR'],['rach','RACH, TA']],frame:[['tdd','Nhiễu xa, CLI, đồng bộ TDD'],['rach','Định dạng PRACH']],beam:[['pci','Tilt, azimuth, chồng lấn']],prb:[['ul','Nhiễu UL theo PRB'],['pc','P0, alpha, TPC']]};
Object.keys(RXTABL).forEach(t=>{const f=RENDER[t];if(typeof f!=='function')return;RENDER[t]=function(){const r=f.apply(this,arguments);try{const sec=document.getElementById('t-'+t);if(sec&&!sec.querySelector('.rxlkbar')){const h=`<div class="sclkbar rxlkbar nogl"><span>Mô phỏng chuyên sâu ở thẻ <b>Tối ưu vô tuyến</b>:</span>${RXTABL[t].map(x=>`<button type="button" class="btn sm" data-rxgo="rx:${x[0]}">${nE(x[1])} →</button>`).join('')}</div>`;const ld=sec.querySelector('.lead');if(ld)ld.insertAdjacentHTML('afterend',h);else sec.insertAdjacentHTML('afterbegin',h);}}catch(e){}return r;};});

