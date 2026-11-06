
/* ===== Thẻ Đa lớp tần số và cân bằng tải (lb) — đợt 19 lộ trình (BRIEF 18) ===== */
const LBS={v:'cov',raf:0,last:0,pause:false};
const LBV=[['cov','Vùng phủ băng thấp 700/900'],['idle','Lớp tần số, chọn lại cell khi rỗi'],['iflb','Cân bằng tải khi kết nối (IFLB/MLB)'],['adv','Cân bằng tải 5G-A'],['sim','Mô phỏng 7 trạm × 5 lớp theo giờ'],['vd','Tham số, KPI, lỗi']];
const LBR={},LBP={},LBF={};
const lg10=x=>Math.log10(Math.max(x,1e-30));
/* điều khiển: data-lbi="mục:khoá" */
function lSl(vw,k,l,mn,mx,st,f,hint,pk){LBF[vw+':'+k]=f;const v=LBP[vw][k];
  return `<label class="c"><span class="cl">${l}<output>${f(v)}</output></span><input type="range" data-lbi="${vw}:${k}" min="${mn}" max="${mx}" step="${st}" value="${v}">${hint?`<span class="u3ph">${hint}</span>`:''}${pk?lPnTag(pk):''}</label>`;}
function lSel(vw,k,l,opts,hint,pk){const v=LBP[vw][k];
  return `<label class="c"><span class="cl">${l}</span><select data-lbi="${vw}:${k}">${opts.map(o=>`<option value="${o[0]}"${String(o[0])===String(v)?' selected':''}>${nE(o[1])}</option>`).join('')}</select>${hint?`<span class="u3ph">${hint}</span>`:''}${pk?lPnTag(pk):''}</label>`;}
function lChk(vw,k,l,pk){return `<label class="u3ck"><input type="checkbox" data-lbi="${vw}:${k}"${LBP[vw][k]?' checked':''}> ${l}</label>${pk?lPnTag(pk):''}`;}
function lPn(key){const r=(typeof LBPAR!=='undefined'?LBPAR:[]).find(x=>x[0]===key);if(!r)return'';const v=nVn();if(v==='3gpp')return'';
  return nVName(v)+': '+r[{huawei:3,nokia:4,ericsson:5}[v]]+(r[7]==='v'?' (cần đối chiếu)':'');}
function lPnTag(key){const t=lPn(key);return t?`<span class="vh ndvh">${nE(t)}</span>`:'';}
const lKv=(a,b)=>`<dt>${a}</dt><dd>${b}</dd>`;
const lSet=(id,h)=>{const e=document.getElementById(id);if(e)e.innerHTML=h;};
function lPct(a,p){if(!a.length)return 0;const b=a.slice().sort((x,y)=>x-y),i=nC((b.length-1)*p,0,b.length-1),lo=Math.floor(i),hi=Math.ceil(i);return b[lo]+(b[hi]-b[lo])*(i-lo);}
const lAvg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
function lLog(list,n){const ms=(list||[]).slice(-(n||14));return nLog(ms,ms.length-1);}
/* ---------- mô hình băng tần dùng chung cho thẻ ----------
   pt: tổng công suất cell (dBm), g: độ lợi anten phát (dBi, đã gồm búp sóng với Massive MIMO), nr: số nhánh thu,
   du: [tỉ lệ thời gian DL, UL] (TDD khung 5 ms DDDSU, ô S 10:2:2), rk: hệ số lớp MIMO tối đa (rút gọn) */
const LBB={
  n28:{n:'n28 · 700 MHz',s:'700',f:0.78,dx:'FDD',bw:10,scs:15,pt:49,g:15.5,nr:2,du:[1,1],rk:1.5,c:'#D9822B',lo:1},
  n8:{n:'n8 · 900 MHz',s:'900',f:0.942,dx:'FDD',bw:10,scs:15,pt:49,g:16,nr:2,du:[1,1],rk:1.5,c:'#B8962E',lo:1,dss:1},
  n3:{n:'n3 · 1800 MHz',s:'1800',f:1.84,dx:'FDD',bw:20,scs:15,pt:53.8,g:18,nr:4,du:[1,1],rk:2.2,c:'#2BA37A'},
  n1:{n:'n1 · 2100 MHz',s:'2100',f:2.14,dx:'FDD',bw:20,scs:15,pt:52,g:18,nr:4,du:[1,1],rk:2.2,c:'#3AA6C9'},
  n41:{n:'n41 · 2600 MHz',s:'2600',f:2.6,dx:'TDD',bw:100,scs:30,pt:53,g:25,nr:64,du:[0.74,0.23],rk:3,c:'#7B6CE0'},
  n78:{n:'n78 · 3500 MHz',s:'3500',f:3.5,dx:'TDD',bw:100,scs:30,pt:53,g:25,nr:64,du:[0.74,0.23],rk:3,c:'#2F7FE0'},
  n258:{n:'n258 · 26 GHz',s:'26G',f:26,dx:'TDD',bw:400,scs:120,pt:33,g:30,nr:64,du:[0.74,0.23],rk:1.6,c:'#D9488F',mm:1}
};
const LBK=Object.keys(LBB);
const lNprb=k=>{const b=LBB[k];return (typeof NRB!=='undefined'&&NRB[b.scs]&&NRB[b.scs][b.bw])||Math.floor(b.bw*1000/(12*b.scs)*0.95);};
const lPre=k=>LBB[k].pt-10*lg10(lNprb(k)*12);           /* công suất mỗi RE (dBm) */
const lGul=k=>{const b=LBB[k];return b.g-(b.nr>=64?4:0)+(b.nr>=64?9:b.nr>=4?5:2.5);}; /* độ lợi thu UL rút gọn */
/* suy hao: dạng TR 38.901 UMa NLOS rút gọn; môi trường đổi hệ số chặn và độ dốc */
const LBENV={du:['Đô thị dày',4,39.08],ur:['Đô thị',0,39.08],su:['Ngoại ô',-3,37],ru:['Nông thôn (cột cao)',-6,34]};
function lPL(dm,f,env){const e=LBENV[env]||LBENV.ur;return 13.54+20*lg10(f)+e[1]+e[2]*lg10(Math.max(dm,10))+(f>10?0.02*Math.max(dm,10)/10:0);}
function lRad(mapl,f,env){const e=LBENV[env]||LBENV.ur;let d=Math.pow(10,(mapl-13.54-20*lg10(f)-e[1])/e[2]);if(f>10){for(let i=0;i<8;i++)d=Math.pow(10,(mapl-13.54-20*lg10(f)-e[1]-0.02*d/10)/e[2]);}return nC(d,10,60000);}
/* suy hao xuyên toà nhà theo TR 38.901 bảng 7.4.3-1/-2 (kính, bê tông, kính IRR) + 0,5 dB/m trong nhà */
const LBIND={out:'Ngoài trời',car:'Trong ô tô',low:'Trong nhà (tường thường, 5 m)',high:'Trong nhà (bê tông, kính phủ, 10 m)',deep:'Trong nhà sâu (tầng hầm, 25 m + tường trong)'};
function lPen(f,ty){if(ty==='out')return 0;if(ty==='car')return 9;const lgl=2+0.2*f,lc=5+4*f,irr=23+0.3*f;
  if(ty==='low')return 5-10*lg10(0.3*Math.pow(10,-lgl/10)+0.7*Math.pow(10,-lc/10))+2.5;
  const hi=5-10*lg10(0.7*Math.pow(10,-irr/10)+0.3*Math.pow(10,-lc/10));return ty==='high'?hi+5:hi+12.5+5;}
/* SINR cần cho tốc độ R (Mbit/s) trên băng thông B (Hz), hiệu suất 0,75 Shannon */
const lSinrReq=(R,B,du)=>nDb(Math.pow(2,R*1e6/(B*0.75*du))-1);
/* quỹ đường truyền một băng */
function lLink(k,P){const b=LBB[k],nprb=lNprb(k),pen=lPen(b.f,P.ind),Bdl=nprb*12*b.scs*1e3;
  const sDl=lSinrReq(P.rdl,Bdl,b.du[0]),sensDl=-174+10*lg10(Bdl)+P.nfu+sDl;
  const mDl=b.pt+b.g+(b.mm?8:0)-sensDl-pen-P.sh-P.imd-P.body;
  const Bul=Math.min(P.ulb*1e6,Bdl),sUl=lSinrReq(P.rul,Bul,b.du[1]),sensUl=-174+10*lg10(Bul)+P.nfg+sUl;
  const mUl=P.ue+lGul(k)+(b.mm?8:0)-sensUl-pen-P.sh-P.imu-P.body;
  const rDl=lRad(mDl,b.f,P.env),rUl=lRad(mUl,b.f,P.env);
  return {k,b,pen,sDl,sUl,mDl,mUl,rDl,rUl,r:Math.min(rDl,rUl),lim:rUl<rDl?'UL':'DL'};}
const lRsrp=(k,d,env,pen)=>lPre(k)+LBB[k].g-lPL(d,LBB[k].f,env)-(pen||0);
/* đơn vị phần trăm, km */
const lKm=m=>m>=1000?nF(m/1000,m>=10000?0:2)+' km':nF(m,0)+' m';

/* ---------- Mục 1: Vùng phủ băng thấp ---------- */
LBP.cov={env:'ur',ind:'high',sh:8,imd:3,imu:2,body:0,nfu:7,nfg:3.5,ue:23,rdl:5,rul:0.5,ulb:2,sul:false,dss:50,sel:'n28',spd:1,
  on:{n28:true,n8:true,n3:true,n1:true,n41:true,n78:true,n258:false}};
const LBCOV={t:0,ev:[],lastD:-1,inb:null};
function lCovAll(){const P=LBP.cov;return LBK.map(k=>lLink(k,P));}
function lCovSul(){/* n78 dùng UL bổ sung n83 (700) hoặc n81 (900) */const P=LBP.cov,s=P.sul;if(!s)return null;const lo=s==='n83'?'n28':'n8',L=lLink(lo,P),D=lLink('n78',P);
  return {lo,ul:L.rUl,dl:D.rDl,r:Math.min(L.rUl,D.rDl)};}
function lCovMap(){const P=LBP.cov,A=lCovAll().filter(x=>P.on[x.k]),W=520,H=360,cx=W/2,cy=H/2+6;
  if(!A.length)return `<svg viewBox="0 0 ${W} ${H}" class="u3svg"><text x="${cx}" y="${cy}" class="u3x" text-anchor="middle">Chọn ít nhất một băng</text></svg>`;
  const rmax=Math.max(...A.map(x=>x.r)),sc=(H/2-26)/rmax,R=x=>Math.max(2,x*sc);
  const sul=lCovSul();let s=`<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="Bán kính phủ của các lớp tần số">`;
  s+=`<rect x="0" y="0" width="${W}" height="${H}" class="u3pbg"/>`;
  [...A].sort((a,b)=>b.r-a.r).forEach((x,i)=>{const sel=x.k===P.sel;s+=`<circle cx="${cx}" cy="${cy}" r="${R(x.r).toFixed(1)}" style="fill:${x.b.c};fill-opacity:${sel?.2:.08};stroke:${x.b.c};stroke-width:${sel?2.6:1.4}${x.lim==='UL'?';stroke-dasharray:6 4':''}"/>`;
    const a=-Math.PI/2+0.42*i-0.9,tx=cx+R(x.r)*Math.cos(a),ty=cy+R(x.r)*Math.sin(a);
    s+=`<text x="${tx.toFixed(1)}" y="${(ty+4).toFixed(1)}" class="lbtxt" text-anchor="middle" style="fill:${x.b.c}">${x.b.s} · ${lKm(x.r)}</text>`;});
  if(sul&&P.on.n78)s+=`<circle cx="${cx}" cy="${cy}" r="${R(sul.r).toFixed(1)}" style="fill:none;stroke:${LBB.n78.c};stroke-width:2.2;stroke-dasharray:2 3"/><text x="${cx}" y="${(cy+R(sul.r)+14).toFixed(1)}" class="lbtxt" text-anchor="middle" style="fill:${LBB.n78.c}">n78 + SUL ${sul.lo==='n28'?'n83':'n81'}</text>`;
  s+=`<rect x="${cx-6}" y="${cy-14}" width="12" height="18" class="ndbs n"/><text x="${cx}" y="${cy-18}" class="lbsm" text-anchor="middle">gNB</text>`;
  const d=LBCOV.d||0,ux=cx+d*sc*Math.cos(0.35),uy=cy+d*sc*Math.sin(0.35);
  s+=`<line x1="${cx}" y1="${cy}" x2="${ux.toFixed(1)}" y2="${uy.toFixed(1)}" style="stroke:var(--muted);stroke-dasharray:3 3"/><circle cx="${ux.toFixed(1)}" cy="${uy.toFixed(1)}" r="7" class="ndue"/>`;
  s+=`<text x="${W-8}" y="${H-10}" class="lbsm" text-anchor="end">nét đứt: giới hạn bởi đường lên · tỉ lệ ${lKm(rmax)} = ${nF(H/2-26,0)} px</text></svg>`;return s;}
function lCovUe(){const P=LBP.cov,d=LBCOV.d||0,pen=null;const rows=LBK.filter(k=>P.on[k]).map(k=>{const L=lLink(k,P),rs=lRsrp(k,d,P.env,L.pen),ok=d<=L.r;return {k,rs,ok,L};});
  return `<p class="hint">UE cách trạm <b>${lKm(d)}</b> (${nE(LBIND[P.ind])}). Lớp còn dùng được (cả DL và UL đạt tốc độ biên):</p><div class="lbchips">${rows.map(r=>`<span class="lbchip${r.ok?'':' off'}" style="color:${LBB[r.k].c}">${LBB[r.k].s} · ${nF(r.rs,0)} dBm</span>`).join('')}</div>`;}
function lCovTable(){const P=LBP.cov,A=lCovAll(),ref=A.find(x=>x.k==='n78');
  return `<table class="ndtb lbtb"><thead><tr><th>Băng</th><th>Xuyên toà nhà</th><th>MAPL DL</th><th>MAPL UL</th><th>Giới hạn</th><th>Bán kính</th><th>Diện tích so n78</th><th>Trạm / 100 km²</th></tr></thead><tbody>${A.map(x=>{const area=1.95*x.r*x.r/1e6;
   return `<tr class="${x.k===P.sel?'lbsel':''}"><td><b style="color:${x.b.c}">${nE(x.b.n)}</b> ${x.b.dx}${x.b.dss?' · DSS':''}</td><td>${nF(x.pen,1)} dB</td><td>${nF(x.mDl,1)} dB</td><td>${nF(x.mUl,1)} dB</td><td>${x.lim==='UL'?'<span class="lbbad">đường lên</span>':'đường xuống'}</td><td>${lKm(x.r)}</td><td>× ${nF(x.r*x.r/(ref.r*ref.r),x.r>ref.r*3?0:1)}</td><td>${nF(100/area,area>10?1:0)}</td></tr>`;}).join('')}</tbody></table>`;}
function lCovPlot(){const P=LBP.cov,ks=LBK.filter(k=>P.on[k]);if(!ks.length)return '';const A=lCovAll(),rmax=Math.max(...A.filter(x=>P.on[x.k]).map(x=>x.r))*1.25;
  const xs=[];for(let i=0;i<=60;i++)xs.push(Math.max(20,rmax*i/60));
  const ser=ks.map(k=>{const pen=lPen(LBB[k].f,P.ind);return {c:LBB[k].c,pts:xs.map(d=>[d/1000,lRsrp(k,d,P.env,pen)])};});
  return nPlot({w:640,h:220,x0:0,x1:rmax/1000,y0:-140,y1:-50,yt:[-140,-120,-100,-80,-60],xt:[0,rmax/4000,rmax/2000,rmax*3/4000,rmax/1000],xf:v=>nF(v,v<10?1:0),series:ser,
    hl:[[-120,'var(--warn)','−120 dBm'],[-110,'var(--muted)','−110 dBm']],cur:(LBCOV.d||0)/1000,ylab:'RSRP (dBm)',xlab:'km',aria:'RSRP theo khoảng cách'});}
function lCovOut(){const P=LBP.cov,A=lCovAll(),g=k=>A.find(x=>x.k===k),a=g('n28'),b=g('n8'),c=g('n78'),sul=lCovSul();
  const nrTput=(k,sh)=>{const x=LBB[k];return lNprb(k)*12*x.scs*1e3*x.du[0]*4*x.rk/2*0.75/1e6*(sh==null?1:sh);};
  return lKv('Bán kính n28 / n8',lKm(a.r)+' / '+lKm(b.r))+lKv('n28 phủ rộng hơn n78',`× ${nF(a.r*a.r/(c.r*c.r),0)} diện tích`)+lKv('Chênh suy hao 700 → 3500 MHz','≈ '+nF(20*lg10(3.5/0.78),1)+' dB (hạng 20·log f) + '+nF(lPen(3.5,P.ind)-lPen(0.78,P.ind),1)+' dB xuyên toà nhà')
   +lKv('n78 bị giới hạn bởi',c.lim==='UL'?'đường lên (UE '+P.ue+' dBm, UL chỉ '+nF(LBB.n78.du[1]*100,0)+' % thời gian)':'đường xuống')
   +(sul?lKv('n78 + SUL '+(sul.lo==='n28'?'n83':'n81'),lKm(sul.r)+' (UL đi qua '+(sul.lo==='n28'?'700':'900')+' MHz)'):'')
   +lKv('Dung lượng NR trên n8 khi DSS '+P.dss+' %','≈ '+nF(nrTput('n8',P.dss/100*0.88),0)+' Mbit/s trung bình cell (trừ ~12 % CRS LTE)')+lKv('Dung lượng n78 100 MHz','≈ '+nF(nrTput('n78'),0)+' Mbit/s trung bình cell');}
function lCovSeries(){/* các mốc mất lớp khi UE đi ra xa */const P=LBP.cov,A=lCovAll().filter(x=>P.on[x.k]);return A.map(x=>({k:x.k,r:x.r})).sort((a,b)=>a.r-b.r);}
LBR.cov={
 html(){const P=LBP.cov;
  return `<div class="cols"><div>
   <div class="panel"><h3>Bản đồ vùng phủ nhiều lớp (một trạm)</h3><div class="lbmap" id="lbCovMap">${lCovMap()}</div><div id="lbCovUe">${lCovUe()}</div>
    <div class="row">${lPlayBtn('cov','lbCovPlay')}<span class="note">UE đi ra rồi đi về, mất dần các lớp dung lượng; băng thấp giữ kết nối xa nhất.</span></div></div>
   <div class="panel"><h3>RSRP theo khoảng cách</h3><div class="scroll"><div class="lbw" id="lbCovPl">${lCovPlot()}</div></div><p class="legend">${LBK.filter(k=>P.on[k]).map(k=>`<span><i style="background:${LBB[k].c}"></i>${LBB[k].s}</span>`).join('')}<span>đường nét đứt: mức RSRP tham chiếu</span></p></div>
   <div class="panel"><h3>Quỹ đường truyền và bán kính cell</h3><div class="scroll" id="lbCovTb">${lCovTable()}</div><p class="note">MAPL = công suất phát + độ lợi anten − độ nhạy (nhiễu nền + SINR cần cho tốc độ biên) − xuyên toà nhà − dự phòng che khuất − dự phòng nhiễu. Bán kính tính ngược từ suy hao rút gọn TR 38.901 UMa; trạm / 100 km² theo lưới 3 sector (diện tích ≈ 1,95·R²). Số liệu để so sánh giữa các băng, không thay công cụ quy hoạch.</p></div>
   <div class="panel"><h3>Nhật ký UE đi ra xa</h3><div id="lbCovLog">${lLog(LBCOV.ev)}</div></div>
  </div><div>
   <div class="panel"><h3>Tham số</h3><div class="ctl">
    ${lSel('cov','env','Môi trường',Object.entries(LBENV).map(([k,v])=>[k,v[0]]))}
    ${lSel('cov','ind','Vị trí UE',Object.entries(LBIND))}
    ${lSel('cov','sel','Băng làm nổi',LBK.map(k=>[k,LBB[k].n]))}
    ${lSl('cov','rdl','Tốc độ DL ở biên',1,50,1,v=>v+' Mbit/s')}
    ${lSl('cov','rul','Tốc độ UL ở biên',0.1,5,0.1,v=>nF(v,1)+' Mbit/s','Thoại VoNR/VoLTE cần khoảng 0,05–0,1 Mbit/s; dữ liệu cơ bản 0,5–1 Mbit/s.')}
    ${lSl('cov','ulb','Băng thông UL cấp cho UE biên',0.5,20,0.5,v=>nF(v,1)+' MHz','UE biên thiếu công suất nên chỉ nhận ít PRB.')}
    ${lSel('cov','ue','Công suất UE',[[23,'23 dBm · PC3'],[26,'26 dBm · PC2 (HPUE, TDD)']])}
    ${lSl('cov','sh','Dự phòng che khuất',0,14,0.5,v=>nF(v,1)+' dB')}
    ${lSl('cov','imd','Dự phòng nhiễu DL',0,8,0.5,v=>nF(v,1)+' dB')}
    ${lSl('cov','imu','Dự phòng nhiễu UL',0,8,0.5,v=>nF(v,1)+' dB')}
    ${lSl('cov','body','Suy hao thân người',0,5,1,v=>v+' dB')}
    ${lSel('cov','sul','UL bổ sung (SUL) cho n78',[[false,'Không'],['n83','n83 · UL 700 MHz'],['n81','n81 · UL 900 MHz']],'SUL: n78 giữ DL 3,5 GHz, đường lên chuyển sang băng thấp.','sul')}
    ${lSl('cov','dss','Phần tài nguyên n8 cho NR (DSS)',0,100,10,v=>v+' %','','dss')}
    ${lSl('cov','spd','Tốc độ hoạt hình',0.5,4,0.5,v=>'× '+nF(v,1))}
   </div><p class="hint" style="margin-top:8px">Băng hiển thị:</p><div class="row" style="margin-top:0">${LBK.map(k=>`<label class="u3ck"><input type="checkbox" data-lbon="${k}"${P.on[k]?' checked':''}> <span style="color:${LBB[k].c};font-weight:700">${LBB[k].s}</span></label>`).join('')}</div></div>
   <div class="panel"><h3>Kết quả</h3><dl class="kv" id="lbCovOut">${lCovOut()}</dl></div>
   <div class="panel"><h3>Băng thấp 700/900 dùng để làm gì</h3><div class="u3stk">
    <div style="border-left-color:${LBB.n28.c}"><b>Lớp phủ</b> · suy hao thấp hơn 3,5 GHz khoảng 13 dB theo tần số và 5–10 dB khi xuyên toà nhà; một trạm 700 MHz phủ diện tích gấp hàng chục lần n78. Dùng cho nông thôn, trong nhà sâu, thoại VoNR/VoLTE và IoT.</div>
    <div style="border-left-color:${LBB.n8.c}"><b>DSS trên 900</b> · LTE B8 và NR n8 chia động cùng 10 MHz; NR phải tránh RE chứa CRS của LTE (rate matching), mất khoảng 10–15 % tài nguyên. Hợp khi máy 4G còn đông.</div>
    <div style="border-left-color:${LBB.n78.c}"><b>SUL và neo NSA</b> · n78 thường bị giới hạn bởi đường lên (UE 23 dBm, UL chỉ ~23 % thời gian). SUL n83/n81 hoặc ghép UL với băng thấp kéo dài vùng phủ n78; ở NSA, LTE 1800/900 làm neo và mang đường lên khi NR yếu.</div>
    <div style="border-left-color:var(--warn)"><b>Rủi ro</b> · băng thấp hẹp (5–10 MHz), dung lượng nhỏ; nếu ưu tiên chọn lại cell và ngưỡng không hợp lý, UE dồn về 700/900 làm nghẽn lớp phủ (xem mục 2, 3, 5).</div></div>
    <p class="note" style="margin-top:8px">Đổi băng của cell đang mô phỏng ở thẻ Phủ sóng (cấu hình chung) nay có thêm n8 900 MHz.</p></div>
  </div></div>`;},
 after(){this.draw(true);},
 draw(force){const P=LBP.cov,rs=lCovSeries(),rmax=rs.length?rs[rs.length-1].r:1000,T=30/P.spd,ph=(LBCOV.t%T)/T,d=rmax*1.08*(0.5-0.5*Math.cos(2*Math.PI*ph));LBCOV.d=d;
  const k=Math.round(d/Math.max(rmax/90,1));if(!force&&k===LBCOV.lastD)return;LBCOV.lastD=k;
  /* sự kiện mất/được lớp */const inb=rs.filter(x=>d<=x.r).map(x=>x.k).join(',');if(LBCOV.inb!==null&&inb!==LBCOV.inb){const was=LBCOV.inb.split(',').filter(Boolean),now=inb.split(',').filter(Boolean);
    was.filter(x=>!now.includes(x)).forEach(x=>LBCOV.ev.push({t:LBCOV.t,p:'RRC',m:'Mất lớp '+LBB[x].s,a:'UE ở '+lKm(d)+': không còn đạt tốc độ biên trên '+LBB[x].n,d:now.length?'Còn: '+now.map(y=>LBB[y].s).join(', '):'Ra khỏi vùng phủ mọi lớp'}));
    now.filter(x=>!was.includes(x)).forEach(x=>LBCOV.ev.push({t:LBCOV.t,p:'RRC',m:'Vào lại lớp '+LBB[x].s,a:'UE ở '+lKm(d)}));if(LBCOV.ev.length>40)LBCOV.ev.splice(0,LBCOV.ev.length-40);lSet('lbCovLog',lLog(LBCOV.ev));}
  LBCOV.inb=inb;lSet('lbCovMap',lCovMap());lSet('lbCovUe',lCovUe());lSet('lbCovPl',lCovPlot());},
 tick(dt){if(!LBS.pause)LBCOV.t+=dt;this.draw(dt===0);},
 upd(k){if(k==='spd')return;lSet('lbCovTb',lCovTable());lSet('lbCovOut',lCovOut());LBCOV.inb=null;this.draw(true);},
 act(a){if(a==='play')lPlayTog('lbCovPlay');}
};

/* ---------- Mục 2: Chiến lược lớp tần số, chọn lại cell khi rỗi (TS 38.304 §5.2.4) ---------- */
const LBL5=['n28','n8','n3','n41','n78'];
LBP.idle={p_n28:2,p_n8:3,p_n3:5,p_n41:6,p_n78:7,q:-124,xh:10,xl:6,sl:4,sn:20,tr:1,qh:2,ded:'none',t320:60,ind:'low',env:'ur',dmax:2500,start:'n28',spd:1,seed:3};
const LBID={t:0,R:null,lastK:-1};
const LBDED={none:['Không (dùng ưu tiên trong SIB)',null],cap:['Đẩy lên lớp dung lượng (thuê bao dữ liệu lớn)',{n78:7,n41:7,n3:4,n8:1,n28:0}],cov:['Giữ ở lớp phủ (IoT, RedCap, thoại)',{n28:7,n8:6,n3:3,n41:1,n78:0}],flat:['Cùng ưu tiên mọi lớp (xếp hạng R)',{n28:5,n8:5,n3:5,n41:5,n78:5}]};
function lIdlePri(t){const P=LBP.idle,d=LBDED[P.ded][1];if(d&&t<P.t320)return d;const o={};LBL5.forEach(k=>o[k]=P['p_'+k]);return o;}
function lIdleRun(){const P=LBP.idle,T=90,dt=0.25,N=Math.round(T/dt),r=nRng(P.seed*7+11),ph=LBL5.map(()=>[r()*6.28,r()*6.28,r()*6.28]),pen=LBL5.map(k=>lPen(LBB[k].f,P.ind));
  const S=[],msgs=[];let srv=P.start,tm={},camp=0,nRes=0,pp=0,oos=0,last=[],hist={};LBL5.forEach(k=>{tm[k]=0;hist[k]=0;});
  msgs.push({t:0,p:'RRC',m:'SIB1, SIB2, SIB4',a:'UE đọc thông tin hệ thống trên '+LBB[srv].s,d:'SIB2: ưu tiên lớp phục vụ, threshServingLowP, s-NonIntraSearchP; SIB4: danh sách tần số khác với ưu tiên, threshX-HighP/LowP'});
  for(let i=0;i<=N;i++){const t=i*dt,u=t/T,d=80+(P.dmax-80)*(0.5-0.5*Math.cos(2*Math.PI*u)),pri=lIdlePri(t);
    const rs={};LBL5.forEach((k,j)=>{const f=ph[j];rs[k]=lRsrp(k,d,P.env,pen[j])+3*Math.sin(t*0.21+f[0])+2*Math.sin(t*0.57+f[1])+1.2*Math.sin(t*1.3+f[2]);});
    const sx=k=>rs[k]-P.q;
    if(i>0&&P.ded!=='none'&&LBDED[P.ded][1]&&Math.abs(t-P.t320)<dt/2)msgs.push({t,p:'RRC',m:'Hết T320',a:'Ưu tiên riêng (dedicated) hết hạn, UE quay về ưu tiên trong SIB'});
    if(sx(srv)<=0){/* không còn thoả tiêu chí S: chọn cell lại */const ok=LBL5.filter(k=>sx(k)>0).sort((a,b)=>pri[b]-pri[a]||rs[b]-rs[a]);
      if(ok.length){if(ok[0]!==srv){msgs.push({t,p:'RRC',m:'Chọn cell lại (tiêu chí S)',a:LBB[srv].s+' → '+LBB[ok[0]].s,d:'Srxlev lớp đang ở = '+nF(sx(srv),1)+' dB ≤ 0'});last.push([t,srv,ok[0]]);srv=ok[0];nRes++;camp=0;LBL5.forEach(k=>tm[k]=0);}}
      else oos+=dt;}
    else{const meas=k=>pri[k]>pri[srv]||sx(srv)<=P.sn;let best=null;
      LBL5.forEach(k=>{if(k===srv||!meas(k)){tm[k]=0;return;}let c;
        if(pri[k]>pri[srv])c=sx(k)>P.xh;else if(pri[k]<pri[srv])c=sx(srv)<P.sl&&sx(k)>P.xl;else c=rs[k]>rs[srv]+P.qh;
        tm[k]=c?tm[k]+dt:0;if(c&&tm[k]>=P.tr&&camp>=1){if(!best||pri[k]>pri[best]||(pri[k]===pri[best]&&rs[k]>rs[best]))best=k;}});
      if(best){const why=pri[best]>pri[srv]?`ưu tiên cao hơn (${pri[best]} > ${pri[srv]}): Srxlev ${nF(sx(best),1)} > threshX-HighP ${P.xh} dB trong ${P.tr} s`:pri[best]<pri[srv]?`ưu tiên thấp hơn: lớp đang ở Srxlev ${nF(sx(srv),1)} < threshServingLowP ${P.sl}, đích ${nF(sx(best),1)} > threshX-LowP ${P.xl} dB`:`cùng ưu tiên: R đích ${nF(rs[best],1)} > R phục vụ + Qhyst ${nF(rs[srv]+P.qh,1)} dBm`;
        msgs.push({t,p:'RRC',m:'Chọn lại cell '+LBB[srv].s+' → '+LBB[best].s,a:why,d:'UE cách trạm '+lKm(d)});
        const back=last.length&&last[last.length-1][1]===best&&t-last[last.length-1][0]<10;if(back)pp++;last.push([t,srv,best]);srv=best;nRes++;camp=0;LBL5.forEach(k=>tm[k]=0);}}
    camp+=dt;hist[srv]+=dt;S.push({t,d,rs,srv,pri});}
  return {S,msgs,T,dt,nRes,pp,oos,hist};}
function lIdlePlot(){const R=LBID.R;if(!R)return '';const P=LBP.idle,bands=[];let a=0;for(let i=1;i<=R.S.length;i++){if(i===R.S.length||R.S[i].srv!==R.S[a].srv){bands.push([R.S[a].t,R.S[Math.min(i,R.S.length-1)].t,LBB[R.S[a].srv].c,.18]);a=i;}}
  const st=Math.max(1,Math.floor(R.S.length/240)),ser=LBL5.map(k=>({c:LBB[k].c,pts:R.S.filter((x,i)=>i%st===0).map(x=>[x.t,x.rs[k]])}));
  return nPlot({w:680,h:240,x0:0,x1:R.T,y0:-135,y1:-55,yt:[-130,-110,-90,-70],xt:[0,15,30,45,60,75,90],series:ser,bands,hl:[[P.q+P.xh,'var(--k1)','q-RxLevMin + threshX-High'],[P.q+P.xl,'var(--k4)','+ threshX-Low'],[P.q,'var(--warn)','q-RxLevMin']],cur:LBID.t,ylab:'RSRP (dBm)',xlab:'giây',aria:'RSRP các lớp và lớp UE đang ở'});}
function lIdleMap(){const R=LBID.R;if(!R)return '';const i=Math.min(R.S.length-1,Math.floor(LBID.t/R.dt)),s=R.S[i],P=LBP.idle,W=720,H=86,X=d=>40+d/P.dmax*(W-90);
  return `<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="UE đi trên đường, trạm ở đầu trái"><line x1="${X(0)}" y1="54" x2="${X(P.dmax)}" y2="54" class="ndroad"/><rect x="${X(0)-7}" y="26" width="14" height="28" class="ndbs n"/><text x="${X(0)}" y="18" class="u3x" text-anchor="middle">trạm 5 lớp</text>
   <line x1="${X(s.d)}" y1="54" x2="${X(0)}" y2="38" style="stroke:${LBB[s.srv].c};stroke-width:2.4"/><circle cx="${X(s.d)}" cy="54" r="8" class="ndue"/><text x="${Math.max(170,Math.min(W-170,X(s.d)))}" y="80" class="u3x" text-anchor="middle">${lKm(s.d)} · đang ở ${LBB[s.srv].s} · ${nF(s.rs[s.srv],0)} dBm</text></svg>`;}
function lIdleSib(){const P=LBP.idle,pri={};LBL5.forEach(k=>pri[k]=P['p_'+k]);const sv=LBID.R?LBID.R.S[Math.min(LBID.R.S.length-1,Math.floor(LBID.t/LBID.R.dt))].srv:P.start;
  const fq=k=>({n28:'152690',n8:'188500',n3:'368500',n41:'518598',n78:'633984'})[k];
  let s=`SIB2 (trên ${LBB[sv].s})\n  cellReselectionInfoCommon: q-Hyst dB${P.qh}\n  cellReselectionServingFreqInfo:\n    s-NonIntraSearchP ${P.sn/2} (× 2 dB = ${P.sn} dB)\n    threshServingLowP ${P.sl/2} (× 2 dB = ${P.sl} dB)\n    cellReselectionPriority ${pri[sv]}\n  intraFreqCellReselectionInfo: q-RxLevMin ${P.q/2} (× 2 = ${P.q} dBm), t-ReselectionNR ${P.tr}\nSIB4 interFreqCarrierFreqList:\n`;
  LBL5.filter(k=>k!==sv).forEach(k=>{s+=`  - dl-CarrierFreq ${fq(k)} (${LBB[k].s} MHz)  cellReselectionPriority ${pri[k]}  threshX-HighP ${P.xh/2}  threshX-LowP ${P.xl/2}  q-RxLevMin ${P.q/2}  t-ReselectionNR ${P.tr}\n`;});
  if(P.ded!=='none'){const d=LBDED[P.ded][1];s+=`RRCRelease\n  cellReselectionPriorities: freqPriorityListNR {${LBL5.map(k=>LBB[k].s+'='+d[k]).join(', ')}}\n  t320 min${P.t320>=60?60:P.t320>=30?30:P.t320>=20?20:10} (mô phỏng rút gọn: hết hạn ở giây ${P.t320})\n`;}
  return `<pre class="schex" style="white-space:pre-wrap;max-height:300px;overflow:auto">${nE(s)}</pre><p class="note">Giá trị SIB mã hoá theo bước 2 dB (ReselectionThreshold, Q-RxLevMin); NR-ARFCN lấy tâm băng minh hoạ. Tần số LTE (SIB5) dùng cùng quy tắc.</p>`;}
function lIdleOut(){const R=LBID.R;if(!R)return '';const T=R.T;return lKv('Số lần chọn lại cell',R.nRes)+lKv('Chọn lại qua lại trong 10 s',R.pp?'<span class="lbbad">'+R.pp+'</span>':'0')+lKv('Ngoài vùng phủ',nF(R.oos,1)+' s')
  +LBL5.map(k=>lKv('Thời gian ở '+LBB[k].s,nF(R.hist[k]/T*100,0)+' %')).join('');}
function lIdleAdv(){const P=LBP.idle,R=LBID.R,o=[];if(!R)return '';const pri={};LBL5.forEach(k=>pri[k]=P['p_'+k]);
  if(R.hist.n28+R.hist.n8>0.5*R.T)o.push('UE ở băng thấp hơn nửa thời gian: kiểm tra threshX-HighP (đang '+P.xh+' dB, tức RSRP lớp cao > '+(P.q+P.xh)+' dBm) và ưu tiên của lớp dung lượng.');
  if(R.pp)o.push('Có chọn lại qua lại: tăng Qhyst/threshX hoặc t-Reselection, tránh hai lớp cùng ưu tiên có RSRP sát nhau.');
  if(P.sn<P.sl)o.push('s-NonIntraSearchP nhỏ hơn threshServingLowP: UE chưa đo lớp thấp hơn thì đã đủ điều kiện rời, dễ rơi vào chọn cell lại khi mất phủ.');
  if(pri.n28>=pri.n78)o.push('Băng thấp có ưu tiên ≥ n78: UE sẽ ở 700 MHz cả khi gần trạm, lãng phí lớp dung lượng.');
  if(P.xh<4)o.push('threshX-HighP quá thấp: UE nhảy lên lớp dung lượng ở mức RSRP rất yếu, dễ RLF hoặc tốc độ thấp ở biên.');
  return o.length?`<ul class="u3ul">${o.map(x=>`<li>${nE(x)}</li>`).join('')}</ul>`:'<p class="hint">Cấu hình hợp lý: UE ở lớp dung lượng khi gần trạm, về băng thấp khi xa, không chọn lại qua lại.</p>';}
LBR.idle={
 html(){const P=LBP.idle;if(!LBID.R)LBID.R=lIdleRun();
  return `<div class="cols"><div>
   <div class="panel"><h3>Ba lớp: phủ, dung lượng, mmWave</h3><div class="u3stk">
    <div style="border-left-color:${LBB.n28.c}"><b>Lớp phủ 700/900</b> · mọi trạm, ưu tiên thấp, giữ UE ở rìa và trong nhà sâu; mang thoại, IoT khi lớp cao yếu.</div>
    <div style="border-left-color:${LBB.n3.c}"><b>Lớp dung lượng FDD 1800/2100</b> · ưu tiên trung bình, thường là neo LTE cho NSA và DSS.</div>
    <div style="border-left-color:${LBB.n78.c}"><b>Lớp dung lượng TDD 2600/3500</b> · ưu tiên cao nhất ở vùng có phủ, Massive MIMO, 100 MHz.</div>
    <div style="border-left-color:${LBB.n258.c}"><b>mmWave 26 GHz</b> · điểm nóng, thêm bằng SCell (NR-DC/CA), không làm lớp chờ.</div></div>
    <p class="note" style="margin-top:8px">Khi rỗi (RRC_IDLE/INACTIVE) mạng không chuyển UE; UE tự chọn lớp theo ưu tiên và ngưỡng trong SIB. Khi kết nối, cân bằng bằng chuyển giao (mục 3).</p></div>
   <div class="panel"><h3>UE đi ra xa rồi quay lại</h3><div class="scroll"><div class="lbw" id="lbIdMap">${lIdleMap()}</div></div>
    <div class="row">${lPlayBtn('idle','lbIdPlay')}<button type="button" class="btn sm" data-lba="idle:rst">⟲ Về đầu</button><button type="button" class="btn sm" data-lba="idle:seed">Đổi pha đinh</button><span class="note" id="lbIdT"></span></div>
    <div class="scroll"><div class="lbw" id="lbIdPl">${lIdlePlot()}</div></div><p class="legend">${LBL5.map(k=>`<span><i style="background:${LBB[k].c}"></i>${LBB[k].s}</span>`).join('')}<span>nền màu: lớp UE đang ở</span></p></div>
   <div class="panel"><h3>Quy tắc chọn lại cell giữa tần số (TS 38.304 §5.2.4.5)</h3><div class="scroll"><table class="ndtb lbtb"><thead><tr><th>Đích so với lớp đang ở</th><th>Điều kiện (giữ trong t-Reselection)</th></tr></thead><tbody>
    <tr><td>Ưu tiên cao hơn</td><td>Srxlev đích > threshX-HighP (luôn đo lớp ưu tiên cao)</td></tr>
    <tr><td>Ưu tiên thấp hơn</td><td>Srxlev phục vụ < threshServingLowP và Srxlev đích > threshX-LowP</td></tr>
    <tr><td>Cùng ưu tiên</td><td>Xếp hạng R: RSRP đích − Qoffset > RSRP phục vụ + Qhyst</td></tr>
    <tr><td>Đo lớp thấp/bằng</td><td>chỉ khi Srxlev phục vụ ≤ s-NonIntraSearchP</td></tr></tbody></table></div><p class="note">Srxlev = RSRP − q-RxLevMin (bỏ qua bù công suất). Có thể dùng ngưỡng theo RSRQ (threshX-HighQ, Squal) nếu cấu hình.</p></div>
   <div class="panel"><h3>Nhật ký bản tin</h3><div id="lbIdLog"></div></div>
  </div><div>
   <div class="panel"><h3>Ưu tiên chọn lại cell (cellReselectionPriority)</h3><div class="lbpri">${LBL5.map(k=>lSel('idle','p_'+k,`<span style="color:${LBB[k].c}">${LBB[k].n}</span>`,[0,1,2,3,4,5,6,7].map(v=>[v,String(v)]))).join('')}</div>${lPnTag('cellResPrio')}</div>
   <div class="panel"><h3>Ngưỡng</h3><div class="ctl">
    ${lSl('idle','q','q-RxLevMin',-140,-100,2,v=>v+' dBm','','qRxLevMin')}
    ${lSl('idle','xh','threshX-HighP',0,30,2,v=>v+' dB','','threshXHigh')}
    ${lSl('idle','xl','threshX-LowP',0,30,2,v=>v+' dB','','threshXLow')}
    ${lSl('idle','sl','threshServingLowP',0,30,2,v=>v+' dB','','threshSrvLow')}
    ${lSl('idle','sn','s-NonIntraSearchP',0,40,2,v=>v+' dB','','sNonIntra')}
    ${lSl('idle','tr','t-ReselectionNR',0,7,1,v=>v+' s','','tResel')}
    ${lSl('idle','qh','q-Hyst',0,8,1,v=>v+' dB')}
    ${lSel('idle','ded','Ưu tiên riêng qua RRCRelease',Object.entries(LBDED).map(([k,v])=>[k,v[0]]),'','dedPrio')}
    ${lSl('idle','t320','T320 (rút gọn: giây mô phỏng)',10,90,5,v=>v+' s')}
    ${lSel('idle','ind','Vị trí UE',Object.entries(LBIND))}
    ${lSel('idle','env','Môi trường',Object.entries(LBENV).map(([k,v])=>[k,v[0]]))}
    ${lSl('idle','dmax','Quãng đường xa nhất',1000,12000,500,v=>lKm(v))}
    ${lSel('idle','start','Lớp bắt đầu',LBL5.map(k=>[k,LBB[k].n]))}
    ${lSl('idle','spd','Tua nhanh',0.5,6,0.5,v=>'× '+nF(v,1))}
   </div></div>
   <div class="panel"><h3>Kết quả</h3><dl class="kv" id="lbIdOut">${lIdleOut()}</dl></div>
   <div class="panel"><h3>Gợi ý</h3><div id="lbIdAdv">${lIdleAdv()}</div></div>
   <div class="panel"><h3>SIB và RRCRelease sinh ra</h3><div id="lbIdSib">${lIdleSib()}</div></div>
  </div></div>`;},
 after(){this.draw(true);},
 draw(force){const R=LBID.R;if(!R)return;const k=Math.floor(LBID.t*4);if(!force&&k===LBID.lastK)return;LBID.lastK=k;
  lSet('lbIdMap',lIdleMap());lSet('lbIdPl',lIdlePlot());lSet('lbIdLog',lLog(R.msgs.filter(m=>m.t<=LBID.t),12));
  const e=document.getElementById('lbIdT');if(e)e.textContent=`t = ${nF(LBID.t,1)} / ${R.T} s`;if(k%8===0)lSet('lbIdSib',lIdleSib());},
 tick(dt){if(!LBS.pause){LBID.t+=dt*LBP.idle.spd*2;if(LBID.t>LBID.R.T)LBID.t=0;}this.draw(dt===0);},
 upd(k){if(k==='spd')return;LBID.R=lIdleRun();if(LBID.t>LBID.R.T)LBID.t=0;lSet('lbIdOut',lIdleOut());lSet('lbIdAdv',lIdleAdv());lSet('lbIdSib',lIdleSib());this.draw(true);},
 act(a){if(a==='play')lPlayTog('lbIdPlay');else if(a==='rst'){LBID.t=0;this.draw(true);}else if(a==='seed'){LBP.idle.seed++;this.upd('seed');}}
};

/* ---------- Mục 3: Cân bằng tải khi kết nối: IFLB (giữa tần số) và MLB (giữa gNB qua Xn) ---------- */
LBP.iflb={mode:'n78n41',peak:100,tgt:25,thr:70,diff:20,per:10,nmax:8,a4:-110,cap:75,sel:'good',exVo:true,pen:30,prot:true,cioMax:6,cioStep:1,coord:true,mu:-104,spd:1,seed:4};
const LBIFM={n78n41:['IFLB cùng trạm: n78 → n41','n78','n41'],n3n1:['IFLB cùng trạm: n3 → n1','n3','n1'],n28n3:['Rút UE khỏi băng thấp: n28 → n3','n28','n3'],inter:['MLB giữa hai gNB cùng lớp n78 (CIO qua Xn)','n78','n78']};
const LBIF={t:0,R:null,lastK:-1};
function lIflbRun(){const P=LBP.iflb,M=LBIFM[P.mode],r=nRng(P.seed*13+5),T=600,inter=P.mode==='inter';
  const kS=M[1],kT=M[2],capS=lNprb(kS)*LBB[kS].du[0]*LBB[kS].rk,capT=lNprb(kT)*LBB[kT].du[0]*LBB[kT].rk,ratio=capS/capT;
  const U=[];let uid=0,cio=0,att=0,ok=0,ppN=0,rounds=0,rej=0;const S=[],msgs=[],marks=[];
  msgs.push({t:0,p:'XnAP',m:'Resource Status Request',a:inter?'gNB1 đăng ký báo cáo tải của cell gNB2 (chu kỳ '+P.per+' s)':'Trong một gNB tải các lớp đọc trực tiếp, không cần Xn',d:inter?'Report Characteristics: PRB Periodic, Composite Available Capacity Periodic':''});
  const prof=t=>{const x=t/T;return 0.35+(P.peak/100-0.35)*Math.exp(-Math.pow((x-0.55)/0.22,2));};
  const meanDur=60,uLoad=()=>(1.2+r()*2.8);
  let bgT=P.tgt;
  for(let t=0;t<=T;t++){
    /* đến mới vào cell nguồn theo ưu tiên khi rỗi; ra khi xong phiên */
    const offered=prof(t)*100,lam=offered/(2.6*meanDur);
    let n=0;const L=lam;let p=Math.exp(-L),q=r(),acc=p;while(q>acc&&n<20){n++;p*=L/n;acc+=p;}
    for(let i=0;i<n;i++){const vo=r()<0.12;U.push({id:++uid,c:'S',l:vo?0.4:uLoad(),end:t+(vo?90:-Math.log(Math.max(r(),1e-6))*meanDur),cap:r()<P.cap/100,vo,rsT:P.mu+8*nGs(r),dA3:-14+r()*16,mv:-1e9,from:''});}
    for(let i=U.length-1;i>=0;i--)if(U[i].end<=t)U.splice(i,1);
    bgT=nC(bgT+(r()-0.5)*1.2+(P.tgt-bgT)*0.05,0,100);
    const ldS=()=>U.filter(u=>u.c==='S').reduce((a,u)=>a+u.l,0),ldT=()=>bgT+U.filter(u=>u.c==='T').reduce((a,u)=>a+u.l*(inter?1:ratio)*(u.vo?1:1.15),0);
    if(t>0&&t%P.per===0){
      let lS=ldS(),lT=ldT();
      if(inter){msgs.push({t,p:'XnAP',m:'Resource Status Update',a:`gNB2 báo tải PRB DL ${nF(lT,0)} %, dung lượng còn ${nF(Math.max(0,100-lT),0)}`,d:''});
        const old=cio;if(lS>P.thr&&lS-lT>P.diff)cio=Math.min(P.cioMax,cio+P.cioStep);else if(lS-lT<P.diff/2||lT>P.thr)cio=Math.max(0,cio-P.cioStep);
        if(cio!==old){rounds++;marks.push([t,'CIO '+cio,'var(--k4)']);msgs.push({t,p:'XnAP',m:'Mobility Settings Change Request',a:`đề xuất CIO nguồn→đích ${cio} dB${P.coord?', đích chỉnh −'+cio+' dB chiều ngược lại':''}`,d:'Cause: load balancing'});
          if(P.coord)msgs.push({t,p:'XnAP',m:'Mobility Settings Change Acknowledge',a:'gNB2 chấp nhận dải CIO'});}
        /* HO A3 theo CIO */
        U.forEach(u=>{if(u.c==='S'&&u.dA3+cio>2&&t-u.mv>2){att++;if(lT<97){ok++;if(t-u.mv<30&&u.from==='T')ppN++;u.c='T';u.mv=t;u.from='S';}else rej++;}
          else if(u.c==='T'&&-u.dA3-(P.coord?cio:0)>2&&t-u.mv>2){att++;ok++;if(t-u.mv<30)ppN++;u.c='S';u.mv=t;u.from='T';}});
      }else{
        const trig=lS>P.thr&&lS-lT>P.diff&&(!P.prot||lT<P.thr-5);
        if(trig){rounds++;const cand=U.filter(u=>u.c==='S'&&u.cap&&!(P.exVo&&u.vo)&&u.rsT>P.a4&&(!P.prot||t-u.mv>P.pen));
          cand.sort((a,b)=>P.sel==='good'?b.rsT-a.rsT:P.sel==='heavy'?b.l-a.l:a.rsT-b.rsT);const pick=cand.slice(0,P.nmax);
          msgs.push({t,p:'RRC',m:'RRCReconfiguration (MeasConfig A4)',a:`tải ${LBB[kS].s} ${nF(lS,0)} % > ${P.thr} %, chênh ${nF(lS-lT,0)} % > ${P.diff} %: đo A4 trên ${LBB[kT].s} cho ${cand.length} UE đủ điều kiện`,d:'A4: RSRP đích > '+P.a4+' dBm'});
          let k2=0;pick.forEach(u=>{if(P.prot&&ldT()+u.l*ratio*1.15>P.thr)return;att++;const pS=1/(1+Math.exp(-(u.rsT+117)/2.5));if(r()<pS&&ldT()<97){ok++;k2++;if(t-u.mv<30&&u.from==='T')ppN++;u.c='T';u.mv=t;u.from='S';}else{rej++;}});
          if(pick.length){msgs.push({t,p:'RRC',m:'MeasurementReport (A4) → HO',a:`${k2}/${pick.length} UE chuyển sang ${LBB[kT].s}`,d:'Lý do HO: reduce-load-in-serving-cell (nội gNB không cần Xn)'});marks.push([t,'↘'+k2,'var(--nr)']);}}
        /* chiều ngược lại khi không có bảo vệ: lớp đích lại vượt ngưỡng */
        lS=ldS();lT=ldT();
        if(!P.prot&&lT>P.thr-10&&lT-lS>P.diff/2){const back=U.filter(u=>u.c==='T').slice(0,P.nmax);back.forEach(u=>{att++;ok++;if(t-u.mv<30)ppN++;u.c='S';u.mv=t;u.from='T';});
          if(back.length){rounds++;msgs.push({t,p:'RRC',m:'HO ngược (không có bảo vệ)',a:`${back.length} UE quay về ${LBB[kS].s}: lớp đích tải ${nF(lT,0)} %`,d:'Thiếu cấm quay lại và trễ ngưỡng → ping-pong tải'});marks.push([t,'↗'+back.length,'var(--warn)']);}}
      }
    }
    S.push({t,lS:ldS(),lT:ldT(),off:offered,cio,nS:U.filter(u=>u.c==='S').length,nT:U.filter(u=>u.c==='T').length});
  }
  const hi=S.filter(x=>x.lS>85).length;
  return {S,msgs,marks,T,att,ok,ppN,rounds,rej,hi,peakS:Math.max(...S.map(x=>x.lS)),peakOff:Math.max(...S.map(x=>x.off)),kS,kT,inter};}
function lIflbPlot(){const R=LBIF.R;if(!R)return '';const P=LBP.iflb,st=2,pts=f=>R.S.filter((x,i)=>i%st===0).map(x=>[x.t/60,Math.min(140,f(x))]);
  return nPlot({w:680,h:240,x0:0,x1:R.T/60,y0:0,y1:140,yt:[0,25,50,70,100,125],xt:[0,2,4,6,8,10],series:[{c:'var(--muted)',dash:'4 4',pts:pts(x=>x.off)},{c:LBB[R.kS].c,w:2.4,pts:pts(x=>x.lS)},{c:R.inter?'#E0603A':LBB[R.kT].c,w:2.4,pts:pts(x=>x.lT)}],
    hl:[[P.thr,'var(--warn)','ngưỡng '+P.thr+' %']],marks:R.marks.filter((m,i)=>i%Math.max(1,Math.ceil(R.marks.length/14))===0).map((m,i)=>[m[0]/60,m[1],m[2],i%2]),cur:LBIF.t/60,ylab:'tải PRB DL (%)',xlab:'phút',aria:'Tải hai cell theo thời gian'});}
function lIflbCio(){const R=LBIF.R;if(!R||!R.inter)return '';return nPlot({w:680,h:120,x0:0,x1:R.T/60,y0:0,y1:Math.max(2,LBP.iflb.cioMax),yt:[0,Math.max(2,LBP.iflb.cioMax)],xt:[0,2,4,6,8,10],series:[{c:'var(--k4)',w:2,pts:R.S.filter((x,i)=>i%2===0).map(x=>[x.t/60,x.cio])}],cur:LBIF.t/60,ylab:'CIO dB',xlab:'phút',aria:'CIO theo thời gian'});}
function lIflbPic(){const R=LBIF.R;if(!R)return '';const i=Math.min(R.S.length-1,Math.floor(LBIF.t)),s=R.S[i],W=520,H=170,cS=LBB[R.kS].c,cT=R.inter?'#E0603A':LBB[R.kT].c;
  const bar=(x,l,c,t)=>`<rect x="${x}" y="30" width="46" height="110" rx="5" class="u3pbg"/><rect x="${x}" y="${140-Math.min(110,l*1.1)}" width="46" height="${Math.min(110,l*1.1)}" rx="5" style="fill:${c};opacity:.75"/><text x="${x+23}" y="${152}" class="lbtxt" text-anchor="middle">${t}</text><text x="${x+23}" y="24" class="lbtxt" text-anchor="middle">${nF(l,0)} %</text>`;
  let g=bar(90,s.lS,cS,R.inter?'gNB1 · n78':LBB[R.kS].s)+bar(380,s.lT,cT,R.inter?'gNB2 · n78':LBB[R.kT].s);
  g+=`<line x1="150" y1="${140-LBP.iflb.thr*1.1}" x2="370" y2="${140-LBP.iflb.thr*1.1}" style="stroke:var(--warn);stroke-dasharray:4 4"/>`;
  const dots=(n,x0,c)=>{let o='';for(let j=0;j<Math.min(n,40);j++)o+=`<circle cx="${x0+(j%8)*9}" cy="${48+Math.floor(j/8)*11}" r="3.2" style="fill:${c}"/>`;return o;};
  g+=dots(s.nS,160,cS)+dots(s.nT,236,cT);g+=`<text x="260" y="128" class="lbsm" text-anchor="middle">UE đang kết nối: ${s.nS} | ${s.nT}${R.inter?' · CIO '+s.cio+' dB':''}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="Tải hai cell">${g}</svg>`;}
function lIflbOut(){const R=LBIF.R;if(!R)return '';return lKv('Tải đỉnh nguồn (không cân bằng → có)',nF(R.peakOff,0)+' % → '+nF(R.peakS,0)+' %')+lKv('Thời gian nguồn > 85 %',nF(R.hi/60,1)+' phút')+lKv('Lượt kích hoạt cân bằng',R.rounds)
  +lKv('HO cân bằng tải: thử / thành công',R.att+' / '+R.ok)+lKv('IFLB/MLB HO SR',R.att?nF(R.ok/R.att*100,1)+' %':'—')+lKv('Ping-pong (quay lại < 30 s)',R.ppN?'<span class="lbbad">'+R.ppN+'</span>':'0');}
LBR.iflb={
 html(){const P=LBP.iflb;if(!LBIF.R)LBIF.R=lIflbRun();const inter=P.mode==='inter';
  return `<div class="cols"><div>
   <div class="panel"><h3>Hai cell trong giờ cao điểm (10 phút)</h3><div class="lbmap" id="lbIfPic">${lIflbPic()}</div>
    <div class="row">${lPlayBtn('iflb','lbIfPlay')}<button type="button" class="btn sm" data-lba="iflb:rst">⟲ Về đầu</button><button type="button" class="btn sm" data-lba="iflb:seed">Đổi lưu lượng</button><span class="note" id="lbIfT"></span></div>
    <div class="scroll"><div class="lbw" id="lbIfPl">${lIflbPlot()}</div></div><p class="legend"><span><i style="background:var(--muted)"></i>tải nguồn nếu không cân bằng</span><span><i style="background:${LBB[LBIFM[P.mode][1]].c}"></i>nguồn</span><span><i style="background:${inter?'#E0603A':LBB[LBIFM[P.mode][2]].c}"></i>đích</span></p>
    ${inter?`<div class="scroll"><div class="lbw" id="lbIfCio">${lIflbCio()}</div></div>`:''}</div>
   <div class="panel"><h3>Cách hoạt động</h3><div class="u3two"><div><b>IFLB / MLB giữa tần số (cùng gNB)</b><ul class="u3ul"><li>Đo tải PRB (và số UE) mỗi chu kỳ.</li><li>Tải nguồn > ngưỡng và chênh với đích > ngưỡng chênh → chọn UE.</li><li>Lọc UE: hỗ trợ băng đích, không đang thoại (tuỳ chọn), không vừa bị chuyển.</li><li>Cấu hình A4 (hoặc A5) trên tần số đích; UE báo đủ mạnh → HO với lý do «reduce load».</li></ul></div>
    <div><b>MLB giữa gNB (Xn)</b><ul class="u3ul"><li>XnAP Resource Status Request/Update trao đổi tải PRB, Composite Available Capacity.</li><li>Nguồn tăng CIO về phía đích (Mobility Settings Change) để biên HO A3 lùi vào cell nguồn.</li><li>Đích phải chỉnh CIO chiều ngược lại, nếu không UE vừa sang sẽ quay về (ping-pong).</li></ul></div></div></div>
   <div class="panel"><h3>Nhật ký bản tin</h3><div id="lbIfLog"></div></div>
  </div><div>
   <div class="panel"><h3>Tham số</h3><div class="ctl">
    ${lSel('iflb','mode','Kịch bản',Object.entries(LBIFM).map(([k,v])=>[k,v[0]]))}
    ${lSl('iflb','peak','Tải đỉnh đến cell nguồn',60,160,5,v=>v+' %')}
    ${lSl('iflb','tgt','Tải nền cell đích',0,80,5,v=>v+' %')}
    ${lSl('iflb','thr','Ngưỡng tải kích hoạt',40,95,5,v=>v+' %','','mlbThr')}
    ${lSl('iflb','diff','Ngưỡng chênh tải',0,50,5,v=>v+' %','','mlbDiff')}
    ${lSl('iflb','per','Chu kỳ đánh giá / báo cáo Xn',2,30,1,v=>v+' s','','mlbPer')}
    ${inter?`${lSl('iflb','cioStep','Bước CIO',0.5,3,0.5,v=>nF(v,1)+' dB')}${lSl('iflb','cioMax','CIO lớn nhất',1,12,1,v=>v+' dB','','cio')}${lChk('iflb','coord','Phối hợp CIO hai chiều (Mobility Settings Change)')}`
     :`${lSl('iflb','nmax','Số UE tối đa mỗi lượt',1,20,1,v=>v,'','mlbUeNum')}${lSl('iflb','a4','Ngưỡng A4 (RSRP đích)',-125,-90,1,v=>v+' dBm','','a4Thr')}${lSl('iflb','mu','RSRP trung bình trên lớp đích',-120,-85,1,v=>v+' dBm')}${lSel('iflb','sel','Chọn UE ưu tiên',[['good','RSRP đích tốt nhất'],['heavy','Dùng nhiều PRB nhất'],['edge','RSRP đích yếu nhất (không nên)']])}${lSl('iflb','cap','UE hỗ trợ băng đích',10,100,5,v=>v+' %')}${lChk('iflb','exVo','Không chuyển UE đang thoại (5QI 1)')}${lChk('iflb','prot','Bảo vệ ping-pong (cấm quay lại, đích < ngưỡng − 5 %)')}${lSl('iflb','pen','Thời gian cấm quay lại',0,120,10,v=>v+' s')}`}
    ${lSl('iflb','spd','Tua nhanh',1,40,1,v=>'× '+v)}
   </div></div>
   <div class="panel"><h3>Kết quả</h3><dl class="kv" id="lbIfOut">${lIflbOut()}</dl></div>
   <div class="panel"><h3>Ghi nhớ</h3><div class="u3stk">
    <div style="border-left-color:var(--nr)"><b>Chọn UE tốt</b> · chuyển UE có RSRP đích tốt, dùng nhiều PRB: ít HO mà giảm tải nhiều, HO SR cao.</div>
    <div style="border-left-color:var(--warn)"><b>Ping-pong tải</b> · đích nhận UE rồi vượt ngưỡng, đẩy ngược lại. Cần trễ ngưỡng, cấm quay lại, chỉ chuyển khi đích còn dư.</div>
    <div style="border-left-color:var(--k4)"><b>Khi rỗi</b> · cân bằng khi kết nối chỉ chữa phần ngọn; nếu ưu tiên SIB dồn UE về một lớp, sửa ở mục 2 hoặc dùng phân bổ khi giải phóng (RRCRelease).</div></div></div>
  </div></div>`;},
 after(){this.draw(true);},
 draw(force){const R=LBIF.R;if(!R)return;const k=Math.floor(LBIF.t/2);if(!force&&k===LBIF.lastK)return;LBIF.lastK=k;
  lSet('lbIfPic',lIflbPic());lSet('lbIfPl',lIflbPlot());lSet('lbIfCio',lIflbCio());lSet('lbIfLog',lLog(R.msgs.filter(m=>m.t<=LBIF.t),12));
  const e=document.getElementById('lbIfT');if(e)e.textContent=`t = ${Math.floor(LBIF.t/60)}:${String(Math.floor(LBIF.t%60)).padStart(2,'0')} / 10:00`;},
 tick(dt){if(!LBS.pause){LBIF.t+=dt*LBP.iflb.spd*3;if(LBIF.t>LBIF.R.T)LBIF.t=0;}this.draw(dt===0);},
 upd(k){if(k==='spd')return;LBIF.R=lIflbRun();if(k==='mode'){renderLb();return;}lSet('lbIfOut',lIflbOut());this.draw(true);},
 act(a){if(a==='play')lPlayTog('lbIfPlay');else if(a==='rst'){LBIF.t=0;this.draw(true);}else if(a==='seed'){LBP.iflb.seed++;this.upd('seed');}}
};

/* ---------- Mục 4: Cân bằng tải 5G-Advanced (một cụm 4 lớp, nhiều loại UE) ---------- */
const LBA={l18:{n:'LTE B3 1800 (neo NSA)',s:'L1800',bw:20,du:[1,1],rk:2,c:'#C98A1E'},n28:{n:'NR n28 700',s:'n28',bw:10,du:[1,1],rk:1.5,c:LBB.n28.c},n41:{n:'NR n41 2600',s:'n41',bw:100,du:[0.74,0.23],rk:3,c:LBB.n41.c},n78:{n:'NR n78 3500',s:'n78',bw:100,du:[0.74,0.23],rk:3,c:LBB.n78.c}};
const LBAK=['l18','n28','n41','n78'],LBACOV={n78:0,n41:3,l18:6,n28:11};
const LBACL={lte:['Chỉ 4G',['l18']],nsa:['5G NSA (EN-DC)',['l18','n78','n41']],sa:['5G SA không CA',['n78','n41','n28']],ca:['5G SA có CA',['n78','n41','n28']],rc:['RedCap',['n78','n41','n28']]};
LBP.adv={n:220,dem:0.3,sLte:20,sNsa:25,sSa:25,sCa:20,sRc:10,thr:70,mlb:true,pcell:true,bwp:false,cho:false,ens:true,ai:false,lag:5,rate:4,surge:80,seed:2,spd:1};
const LBAD={t:0,R:null,B:null,T:null,lastK:-1};
function lAdvUes(){const P=LBP.adv,r=nRng(P.seed*17+3),tot=P.sLte+P.sNsa+P.sSa+P.sCa+P.sRc||1,cum=[['lte',P.sLte],['nsa',P.sNsa],['sa',P.sSa],['ca',P.sCa],['rc',P.sRc]];const U=[];
  for(let i=0;i<P.n;i++){let q=r()*tot,c='sa';for(const [k,v] of cum){if(q<v){c=k;break;}q-=v;}const x=Math.sqrt(r()),sh=2*nGs(r),D=-Math.log(Math.max(r(),1e-6))*P.dem;const C={};
    LBAK.forEach(l=>{const a=LBA[l],sinr=24-(27-LBACOV[l])*Math.pow(x,1.3)+sh,lin=nLin(sinr),rk=c==='rc'?1:1+(a.rk-1)*nC((sinr-3)/15,0,1),bw=c==='rc'?Math.min(20,a.bw):a.bw;C[l]=sinr>(a.du[0]<1?-1:-5)?bw*a.du[0]*0.75*Math.log2(1+lin)*rk*0.85:0;});
    U.push({c,x,D,C});}
  return U;}
function lAdvEval(U,F){const P=LBP.adv,thr=(F.ai?P.thr-10:P.thr)/100;const X=U.map(()=>({}));let ho=0;
  const ok=(u,l)=>u.C[l]>0&&LBACL[u.c][1].includes(l);
  U.forEach((u,i)=>{const x=X[i];if(u.c==='lte'){if(ok(u,'l18'))x.l18=1;return;}
    if(u.c==='nsa'){const nr=['n78','n41'].find(l=>ok(u,l));if(nr)x[nr]=1;else if(ok(u,'l18'))x.l18=1;return;}
    const pr=['n78','n41','n28'].filter(l=>ok(u,l));if(!pr.length)return;
    if(u.c==='ca'&&pr.length>1){x[pr[0]]=0.5;x[pr[1]]=0.5;}else x[pr[0]]=1;});
  const ovh=u=>(u.c==='rc'?(F.bwp?0.002:0.005):(F.bwp&&u.D<0.5?0.0012:0.0025));
  const load=()=>{const L={};LBAK.forEach(l=>L[l]=0);U.forEach((u,i)=>{for(const l in X[i]){if(X[i][l]>0)L[l]+=X[i][l]*u.D/u.C[l]+ovh(u);}});return L;};
  let L=load();
  const split=(i,legs)=>{const u=U[i],w=legs.map(l=>u.C[l]*Math.max(0.03,1-L[l]));const s=w.reduce((a,b)=>a+b,0)||1;const x={};legs.forEach((l,j)=>{if(w[j]/s>0.02)x[l]=w[j]/s;});X[i]=x;};
  for(let it=0;it<6;it++){
    if(F.pcell)U.forEach((u,i)=>{if(u.c!=='ca')return;const legs=['n78','n41','n28'].filter(l=>ok(u,l)).sort((a,b)=>u.C[b]*(1-L[b])-u.C[a]*(1-L[a])).slice(0,2);if(legs.length)split(i,legs);});
    if(F.ens)U.forEach((u,i)=>{if(u.c!=='nsa')return;const nr=Object.keys(X[i]).find(l=>l!=='l18')||['n78','n41'].find(l=>ok(u,l));if(nr&&ok(u,'l18'))split(i,['l18',nr]);});
    L=load();}
  if(F.mlb){for(let it=0;it<400;it++){const hi=LBAK.slice().sort((a,b)=>L[b]-L[a])[0];if(L[hi]<thr)break;let best=null;
      U.forEach((u,i)=>{const ks=Object.keys(X[i]);if(ks.length!==1||ks[0]!==hi)return;LBACL[u.c][1].forEach(l=>{if(l===hi||!ok(u,l))return;const add=u.D/u.C[l];if(L[l]+add>thr-0.03)return;const g=u.D/u.C[hi];const sc=g-add*0.6;if(!best||sc>best.sc)best={i,l,sc,add,g};});});
      if(!best)break;X[best.i]={[best.l]:1};ho++;L=load();}}
  const tp=U.map((u,i)=>{let s=0,any=false;for(const l in X[i]){if(X[i][l]>0){any=true;s+=u.C[l]*Math.max(0.03,1-Math.min(L[l],0.97));}}return any?s:0;});
  const served=tp.filter(x=>x>0),flow={};U.forEach((u,i)=>{for(const l in X[i]){const k=u.c+'|'+l;flow[k]=(flow[k]||0)+X[i][l]*u.D;}});
  const lv=LBAK.map(l=>L[l]),hosr=F.cho?99.4:97.6;
  return {L,X,ho,tp,mean:lAvg(served),p5:lPct(served,0.05),imb:(Math.max(...lv)-Math.min(...lv))*100,low:U.filter((u,i)=>X[i].n28===1).length/U.length*100,flow,hosr,intr:F.cho?'≈ 5–10 ms (LTM) / 0 khi CHO chuẩn bị sẵn':'≈ 30–60 ms (HO thường)',blocked:U.length-served.length};}
function lAdvTime(){/* 60 phút: phản ứng theo đo đạc so với dự báo AI */const P=LBP.adv,r=nRng(P.seed*5+1),thr=P.thr,out={re:[],ai:[],off:[],fc:[]};let oR=0,oA=0,mR=0,mA=0;
  const o=t=>40+P.surge*(1/(1+Math.exp(-(t-20)/2.5)))-P.surge*0.7*(1/(1+Math.exp(-(t-44)/3)))+3*Math.sin(t*0.9);
  for(let t=0;t<=60;t+=0.5){const now=o(t),meas=o(Math.max(0,t-P.lag/2)),fc=o(t+P.lag)+2*nGs(r);
    if(meas-oR>thr)oR+=P.rate*0.5;else if(meas-oR<thr-15)oR=Math.max(0,oR-P.rate*0.5);
    if(fc-oA>thr||now-oA>thr)oA+=P.rate*0.5;else if(fc-oA<thr-15)oA=Math.max(0,oA-P.rate*0.5);
    oR=Math.min(oR,now);oA=Math.min(oA,now);const a=now-oR,b=now-oA;if(a>90)mR+=0.5;if(b>90)mA+=0.5;out.re.push([t,a]);out.ai.push([t,b]);out.off.push([t,now]);out.fc.push([t,fc]);}
  out.mR=mR;out.mA=mA;return out;}
function lAdvRun(){const P=LBP.adv,U=lAdvUes();LBAD.U=U;LBAD.R=lAdvEval(U,{mlb:P.mlb,pcell:P.pcell,bwp:P.bwp,cho:P.cho,ens:P.ens,ai:P.ai});LBAD.B=lAdvEval(U,{});LBAD.T=lAdvTime();}
function lAdvFlow(){const R=LBAD.R,U=LBAD.U;if(!R)return '';const W=640,H=300,cls=Object.keys(LBACL),tot=Object.values(R.flow).reduce((a,b)=>a+b,0)||1;
  const cy=i=>40+i*55,ly=i=>50+i*66;let s=`<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="Lưu lượng từ loại UE sang lớp">`;
  cls.forEach((c,i)=>{const n=U.filter(u=>u.c===c).length;s+=`<rect x="10" y="${cy(i)-16}" width="150" height="32" rx="6" class="u3pbg"/><text x="20" y="${cy(i)+4}" class="lbtxt">${LBACL[c][0]} · ${n}</text>`;});
  for(const k in R.flow){const [c,l]=k.split('|'),i=cls.indexOf(c),j=LBAK.indexOf(l),w=Math.max(0.8,R.flow[k]/tot*90);
    s+=`<path d="M160 ${cy(i)} C 300 ${cy(i)}, 360 ${ly(j)}, 470 ${ly(j)}" style="fill:none;stroke:${LBA[l].c};stroke-width:${w.toFixed(1)};opacity:.45"/>`;}
  LBAK.forEach((l,j)=>{const v=R.L[l]*100,b=LBAD.B.L[l]*100,c=v>85?'var(--warn)':LBA[l].c;s+=`<rect x="470" y="${ly(j)-22}" width="160" height="44" rx="6" class="u3pbg"/><rect x="470" y="${ly(j)-22}" width="${Math.min(160,v*1.6).toFixed(1)}" height="44" rx="6" style="fill:${c};opacity:.35"/>`
    +`<line x1="${470+Math.min(160,b*1.6)}" y1="${ly(j)-24}" x2="${470+Math.min(160,b*1.6)}" y2="${ly(j)+24}" style="stroke:var(--muted);stroke-width:2;stroke-dasharray:3 2"/><text x="478" y="${ly(j)-4}" class="lbtxt">${LBA[l].n}</text><text x="478" y="${ly(j)+14}" class="lbsm">tải ${nF(v,0)} % (không cân bằng ${nF(b,0)} %)</text>`;});
  return s+`<line x1="${470+LBP.adv.thr*1.6}" y1="20" x2="${470+LBP.adv.thr*1.6}" y2="${H-12}" style="stroke:var(--warn);stroke-dasharray:4 4"/><text x="${470+LBP.adv.thr*1.6}" y="${H-2}" class="lbsm" text-anchor="middle">ngưỡng</text></svg>`;}
function lAdvTimePlot(){const T=LBAD.T;if(!T)return '';return nPlot({w:680,h:220,x0:0,x1:60,y0:0,y1:130,yt:[0,30,60,90,120],xt:[0,10,20,30,40,50,60],series:[{c:'var(--muted)',dash:'4 4',pts:T.off},{c:'var(--k4)',dash:'2 3',w:1.2,pts:T.fc},{c:'var(--warn)',w:2.2,pts:T.re},{c:'var(--nr)',w:2.2,pts:T.ai}],hl:[[90,'var(--warn)','90 %'],[LBP.adv.thr,'var(--muted)','ngưỡng']],cur:LBAD.t,ylab:'tải n78 (%)',xlab:'phút',aria:'Phản ứng và dự báo'});}
function lAdvOut(){const R=LBAD.R,B=LBAD.B;if(!R)return '';const c=(a,b,hi)=>`${nF(a,1)} <span class="${(hi?a>=b:a<=b)?'lbgood':'lbbad'}">(${nF(b,1)})</span>`;
  return lKv('Tốc độ UE trung bình (không cân bằng)',c(R.mean,B.mean,1)+' Mbit/s')+lKv('Tốc độ UE 5 % (biên)',c(R.p5,B.p5,1)+' Mbit/s')+lKv('Độ lệch tải giữa lớp',c(R.imb,B.imb,0)+' %')+lKv('UE chỉ ở n28',nF(R.low,1)+' %')
   +lKv('HO cân bằng tải',R.ho)+lKv('HO SR ước tính',nF(R.hosr,1)+' %')+lKv('Gián đoạn mỗi HO',R.intr)+lKv('Phút tải > 90 % (phản ứng / AI)',nF(LBAD.T.mR,1)+' / '+nF(LBAD.T.mA,1));}
LBR.adv={
 html(){const P=LBP.adv;if(!LBAD.R)lAdvRun();
  return `<div class="cols"><div>
   <div class="panel"><h3>Lưu lượng từ loại UE sang lớp (một cụm trạm)</h3><div class="scroll"><div class="lbw" id="lbAdFl">${lAdvFlow()}</div></div><p class="note">Độ dày dây ∝ lưu lượng; vạch đứt trên mỗi lớp là tải khi tắt mọi thuật toán. Mô hình hàng đợi chia thời gian: tốc độ UE = tốc độ đỉnh của UE trên lớp × (1 − tải lớp).</p></div>
   <div class="panel"><h3>Phản ứng theo đo đạc hay dự báo (AI/ML)</h3><div class="scroll"><div class="lbw" id="lbAdTm">${lAdvTimePlot()}</div></div>
    <p class="legend"><span><i style="background:var(--muted)"></i>tải đến (chưa giảm)</span><span><i style="background:var(--k4)"></i>dự báo NWDAF/RIC</span><span><i style="background:var(--warn)"></i>phản ứng sau đo</span><span><i style="background:var(--nr)"></i>chủ động theo dự báo</span></p>
    <div class="row">${lPlayBtn('adv','lbAdPlay')}<span class="note" id="lbAdT"></span></div></div>
   <div class="panel"><h3>Các cơ chế 5G-A</h3><div class="u3two">
    <div><b>Chọn PCell/SCell theo tải (CA)</b><p class="e2d">UE CA được chọn PCell ở lớp ít tải, SCell kích hoạt/tắt động (MAC CE), chia gói theo dung lượng còn lại. Xem thẻ Ghép sóng mang.</p></div>
    <div><b>BWP riêng từng UE</b><p class="e2d">RedCap, UE ít lưu lượng dùng BWP hẹp: giảm PDCCH, CSI, tiết kiệm pin; lớp rộng dành cho UE nặng.</p></div>
    <div><b>CHO / LTM nhận biết tải</b><p class="e2d">Ứng viên CHO chọn theo tải đích (Xn Resource Status); LTM chuyển ở L1/L2 nên gián đoạn ngắn, HO cân bằng tải ít rủi ro hơn. Xem thẻ NSA EN-DC và di động 5G-A.</p></div>
    <div><b>NSA/SA, 4G/5G</b><p class="e2d">Split bearer chia giữa neo LTE và nhánh NR theo tải; đổi SN (n78 ↔ n41); chuyển UE SA ↔ NSA khi lớp NR đầy.</p></div>
    <div><b>AI/ML</b><p class="e2d">NWDAF (TS 23.288) cung cấp phân tích tải NF/cell; RIC (xApp traffic steering, rApp chính sách qua A1) dự báo và đặt CIO, ngưỡng trước khi nghẽn. Xem thẻ Học máy.</p></div></div></div>
   <div class="panel"><h3>Nhật ký bản tin</h3><div id="lbAdLog"></div></div>
  </div><div>
   <div class="panel"><h3>Thuật toán</h3><div class="ctl" style="grid-template-columns:1fr">
    ${lChk('adv','mlb','MLB/IFLB theo tải PRB (chuyển cả UE)','mlbThr')}${lChk('adv','pcell','Chọn PCell/SCell theo tải trong CA','scellAct')}${lChk('adv','ens','Chia tải NSA/SA, neo LTE ↔ NR (split bearer)')}
    ${lChk('adv','bwp','BWP riêng cho RedCap / UE ít lưu lượng','bwp')}${lChk('adv','cho','CHO / LTM nhận biết tải','cho')}${lChk('adv','ai','AI/ML dự báo (NWDAF, RIC): ngưỡng chủ động thấp hơn 10 %')}</div></div>
   <div class="panel"><h3>Tham số</h3><div class="ctl">
    ${lSl('adv','n','Số UE kết nối',40,400,10,v=>v)}${lSl('adv','dem','Lưu lượng trung bình mỗi UE',0.1,2,0.05,v=>nF(v,2)+' Mbit/s')}
    ${lSl('adv','sLte','Tỉ lệ UE chỉ 4G',0,60,5,v=>v)}${lSl('adv','sNsa','Tỉ lệ UE NSA',0,60,5,v=>v)}${lSl('adv','sSa','Tỉ lệ UE SA không CA',0,60,5,v=>v)}${lSl('adv','sCa','Tỉ lệ UE SA có CA',0,60,5,v=>v)}${lSl('adv','sRc','Tỉ lệ UE RedCap',0,40,5,v=>v)}
    ${lSl('adv','thr','Ngưỡng tải',40,95,5,v=>v+' %')}${lSl('adv','surge','Lưu lượng tăng đột biến (phút 20)',10,90,5,v=>'+ '+v+' %')}${lSl('adv','lag','Trễ đo + quyết định',1,10,1,v=>v+' phút')}${lSl('adv','rate','Tốc độ chuyển tải',1,15,1,v=>v+' %/phút')}
   </div><div class="row"><button type="button" class="btn sm" data-lba="adv:seed">Đổi vị trí UE</button></div></div>
   <div class="panel"><h3>Kết quả (trong ngoặc: không cân bằng)</h3><dl class="kv" id="lbAdOut">${lAdvOut()}</dl></div>
  </div></div>`;},
 after(){this.draw(true);},
 msgs(){const P=LBP.adv,m=[{t:0,p:'NGAP',m:'Đo tải',a:'gNB thu PRB, số UE, Composite Available Capacity mỗi lớp'}];
  if(P.ai)m.push({t:2,p:'SBI',m:'Nnwdaf_AnalyticsSubscription_Subscribe',a:'Analytics ID: NF load / Network Performance, vùng cell'},{t:4,p:'E2AP',m:'RIC Indication (KPM)',a:'xApp traffic steering nhận KPM tải theo cell'},{t:6,p:'A1',m:'A1 policy',a:'rApp đặt mục tiêu tải ≤ '+(P.thr-10)+' %'});
  if(P.pcell)m.push({t:8,p:'MAC',m:'SCell Activation/Deactivation MAC CE',a:'bật SCell lớp còn dư, tắt SCell lớp đầy'});
  if(P.ens)m.push({t:9,p:'X2AP',m:'SgNB Modification (split bearer)',a:'đổi tỉ lệ chia LTE/NR theo tải'});
  if(P.bwp)m.push({t:10,p:'RRC',m:'RRCReconfiguration (BWP riêng)',a:'RedCap/UE nhẹ vào BWP 20 MHz; DCI chuyển BWP khi cần'});
  if(P.mlb)m.push({t:12,p:'RRC',m:'MeasConfig A4 → HO',a:LBAD.R?LBAD.R.ho+' UE chuyển lớp vì tải':''});
  if(P.cho)m.push({t:13,p:'RRC',m:'CHO: RRCReconfiguration (conditionalReconfiguration)',a:'ứng viên chọn theo tải đích; LTM: cell switch qua MAC CE'});
  return m;},
 draw(force){const k=Math.floor(LBAD.t*2);if(!force&&k===LBAD.lastK)return;LBAD.lastK=k;lSet('lbAdTm',lAdvTimePlot());const e=document.getElementById('lbAdT');if(e)e.textContent=`phút ${nF(LBAD.t,0)} / 60`;if(force)lSet('lbAdLog',lLog(this.msgs()));},
 tick(dt){if(!LBS.pause){LBAD.t+=dt*3*LBP.adv.spd;if(LBAD.t>60)LBAD.t=0;}this.draw(dt===0);},
 upd(k){lAdvRun();lSet('lbAdFl',lAdvFlow());lSet('lbAdOut',lAdvOut());this.draw(true);},
 act(a){if(a==='play')lPlayTog('lbAdPlay');else if(a==='seed'){LBP.adv.seed++;this.upd('seed');}}
};

/* ---------- Mục 5: Mô phỏng 7 trạm × 5 lớp theo giờ ---------- */
LBP.sim={isd:900,n:420,hot:30,ind:60,cap:80,ca:35,tdd:'all',xh:-108,iflb:true,mlb:true,pull:true,ca5:true,ai:false,thr:70,cio:6,dem:1,spd:1,seed:3};
const LBPROF=[0.18,0.12,0.09,0.08,0.08,0.11,0.2,0.36,0.5,0.56,0.6,0.66,0.72,0.66,0.6,0.6,0.63,0.7,0.78,0.88,0.96,1,0.8,0.45];
const LBSM={h:0,R:null,lastK:-1};
function lSimRadio(){const P=LBP.sim,r=nRng(P.seed*101+7),I=P.isd,sites=[[0,0]];for(let k=0;k<6;k++){const a=Math.PI/6+k*Math.PI/3;sites.push([I*Math.cos(a),I*Math.sin(a)]);}
  const has=(s,l)=>!(P.tdd==='part'&&(l==='n41'||l==='n78')&&s>3);const U=[];
  for(let i=0;i<P.n;i++){let x,y;if(r()<P.hot/100){x=I*0.3+I*0.2*nGs(r);y=I*0.1+I*0.2*nGs(r);}else{do{x=(r()*2-1)*1.55*I;y=(r()*2-1)*1.55*I;}while(x*x+y*y>(1.55*I)*(1.55*I));}
    const ind=r()<P.ind/100,ty=ind?(r()<0.5?'low':'high'):'out',cap=r()<P.cap/100,ca=cap&&r()<P.ca/100,D=-Math.log(Math.max(r(),1e-6))*4,sh=sites.map(()=>6*nGs(r)),act=LBPROF.map(()=>r());
    const rad={};LBL5.forEach(l=>{const pen=lPen(LBB[l].f,ty),rs=sites.map((s,j)=>has(j,l)?lRsrp(l,Math.hypot(x-s[0],y-s[1]),'ur',pen)+sh[j]:-999);let b=-1,b2=-1;rs.forEach((v,j)=>{if(v<=-998)return;if(b<0||v>rs[b]){b2=b;b=j;}else if(b2<0||v>rs[b2])b2=j;});rad[l]={rs,b,b2};});
    U.push({x,y,ind,cap,ca,D,act,rad});}
  return {sites,U,has};}
function lSimHour(G,h,F){const P=LBP.sim,U=G.U,S=G.sites.length,thr=(F.ai?P.thr-10:P.thr)/100,fac=F.ai?Math.max(1,LBPROF[(h+1)%24]/LBPROF[h]):1;
  const nz={};LBL5.forEach(l=>nz[l]=Math.pow(10,(-174+10*lg10(LBB[l].scs*1e3)+7)/10));
  const usable=(u,l)=>u.rad[l].b>=0&&u.rad[l].rs[u.rad[l].b]>-120&&((l!=='n41'&&l!=='n78')||u.cap);
  const act=U.map(u=>u.act[h]<LBPROF[h]*0.75);
  const rho=G.sites.map(()=>{const o={};LBL5.forEach(l=>o[l]=0.3);return o;});
  const cap=(u,l,s)=>{const rs=u.rad[l].rs,b=LBB[l];let I=0;rs.forEach((v,j)=>{if(j!==s&&v>-998)I+=Math.pow(10,v/10)*Math.max(0.1,Math.min(1,rho[j][l]));});const sinr=Math.pow(10,rs[s]/10)/(I+nz[l]),sd=nDb(sinr);
    const rk=1+(b.rk-1)*nC((sd-3)/15,0,1);return Math.max(0.05,b.bw*b.du[0]*0.75*Math.log2(1+sinr)*rk*0.85*(b.dss?0.88:1));};
  const A=U.map((u,i)=>{if(!act[i])return null;const order=['n78','n41','n3','n8','n28'].filter(l=>usable(u,l));if(!order.length)return null;
    const th={n78:P.xh,n41:P.xh,n3:P.xh,n8:P.xh-6,n28:-999};const l=order.find((k,j)=>j===order.length-1||u.rad[k].rs[u.rad[k].b]>th[k]);
    return {legs:[[l,u.rad[l].b,1]],moved:0};});
  const recompute=()=>{let C=[];for(let pass=0;pass<2;pass++){const nr=G.sites.map(()=>{const o={};LBL5.forEach(l=>o[l]=0);return o;});C=[];
      A.forEach((a,i)=>{if(!a)return;C[i]=a.legs.map(([l,s,w])=>{const c=cap(U[i],l,s);nr[s][l]+=w*U[i].D*P.dem/c;return c;});});G.sites.forEach((s,j)=>LBL5.forEach(l=>rho[j][l]=nr[j][l]));}return C;};
  let C=recompute(),ho=0,nI=0,nM=0,nP=0,mvc=0;const bump=()=>{if(++mvc%4===0)C=recompute();};
  const d=(i,l,s)=>U[i].D*P.dem/cap(U[i],l,s);
  if(F.pull){A.forEach((a,i)=>{if(!a||a.legs.length!==1)return;const [l]=a.legs[0];if(l!=='n28'&&l!=='n8')return;const u=U[i];
      const t=['n78','n41','n3'].find(k=>usable(u,k)&&u.rad[k].rs[u.rad[k].b]>-115&&(rho[u.rad[k].b][k]+d(i,k,u.rad[k].b))*fac<thr-0.1);if(t){const s=u.rad[t].b;rho[a.legs[0][1]][l]-=d(i,l,a.legs[0][1]);a.legs=[[t,s,1]];rho[s][t]+=d(i,t,s);a.moved=1;ho++;nP++;bump();}});C=recompute();}
  if(F.iflb)for(let pass=0;pass<3;pass++){G.sites.forEach((st,s)=>LBL5.forEach(l=>{if(rho[s][l]*fac<=thr)return;
      const cand=A.map((a,i)=>a&&a.legs.length===1&&a.legs[0][0]===l&&a.legs[0][1]===s?i:-1).filter(i=>i>=0);
      const opts=[];cand.forEach(i=>{const u=U[i];LBL5.forEach(k=>{if(k===l||!usable(u,k)||u.rad[k].b!==s||u.rad[k].rs[s]<-115)return;opts.push([i,k,cap(u,k,s)]);});});opts.sort((a,b)=>b[2]-a[2]);
      for(const [i,k,c] of opts){if(rho[s][l]*fac<=thr)break;const a=A[i];if(a.legs[0][0]!==l)continue;const add=U[i].D*P.dem/c;if((rho[s][k]+add)*fac>thr-0.12)continue;rho[s][l]-=d(i,l,s);rho[s][k]+=add;a.legs=[[k,s,1]];a.moved=1;ho++;nI++;bump();}}));C=recompute();}
  if(F.mlb){G.sites.forEach((st,s)=>LBL5.forEach(l=>{if(rho[s][l]*fac<=thr)return;
      A.forEach((a,i)=>{if(!a||rho[s][l]*fac<=thr||a.legs.length!==1||a.legs[0][0]!==l||a.legs[0][1]!==s)return;const u=U[i],b2=u.rad[l].b2;if(b2<0||u.rad[l].rs[b2]<u.rad[l].rs[s]-P.cio||(rho[b2][l]+d(i,l,b2))*fac>thr-0.1)return;
        rho[s][l]-=d(i,l,s);rho[b2][l]+=d(i,l,b2);a.legs=[[l,b2,1]];a.moved=1;ho++;nM++;bump();});}));C=recompute();}
  if(F.ca5){for(let it=0;it<2;it++)A.forEach((a,i)=>{if(!a||!U[i].ca)return;const u=U[i],[l0,s0]=a.legs[0];const alt=LBL5.filter(k=>k!==l0&&usable(u,k)&&u.rad[k].b===s0&&rho[s0][k]<thr).sort((x,y)=>cap(u,y,s0)*(1-rho[s0][y])-cap(u,x,s0)*(1-rho[s0][x]))[0];if(!alt)return;
      const w0=cap(u,l0,s0)*Math.max(0.03,1-rho[s0][l0]),w1=cap(u,alt,s0)*Math.max(0.03,1-rho[s0][alt]),f0=w0/(w0+w1);a.legs.forEach(([l,s,w])=>rho[s][l]-=w*d(i,l,s));a.legs=[[l0,s0,f0],[alt,s0,1-f0]];a.legs.forEach(([l,s,w])=>rho[s][l]+=w*d(i,l,s));});}
  C=recompute();
  const tp=[],share={},lay={},mx={};LBL5.forEach(l=>{share[l]=0;const v=G.sites.map((s,j)=>G.has(j,l)?rho[j][l]:null).filter(x=>x!==null);lay[l]=lAvg(v.map(x=>Math.min(x,1.2)))*100;mx[l]=Math.max(...v)*100;});
  let nAct=0;A.forEach((a,i)=>{if(!a)return;nAct++;share[a.legs[0][0]]++;let t=0;a.legs.forEach(([l,s,w],j)=>{t+=C[i][j]*Math.max(0.03,1-Math.min(rho[s][l],0.97));});tp.push(t);});
  LBL5.forEach(l=>share[l]=nAct?share[l]/nAct*100:0);let over=0;G.sites.forEach((s,j)=>LBL5.forEach(l=>{if(G.has(j,l)&&rho[j][l]>0.85)over++;}));
  const worst=[];G.sites.forEach((s,j)=>LBL5.forEach(l=>{if(G.has(j,l))worst.push([rho[j][l],j,l]);}));worst.sort((a,b)=>b[0]-a[0]);
  const ue=new Int8Array(U.length).fill(-1),ue2=new Int8Array(U.length).fill(-1);A.forEach((a,i)=>{if(!a)return;ue[i]=LBL5.indexOf(a.legs[0][0]);if(a.legs[1])ue2[i]=LBL5.indexOf(a.legs[1][0]);});
  return {h,rho:rho.map(o=>Object.assign({},o)),lay,mx,share,low:share.n28+share.n8,mean:lAvg(tp),p5:lPct(tp,0.05),over,ho,nI,nM,nP,nAct,ue,ue2,worst:worst.slice(0,2)};}
function lSimRun(){const P=LBP.sim,G=lSimRadio();const F={iflb:P.iflb,mlb:P.mlb,pull:P.pull,ca5:P.ca5,ai:P.ai};const cur=[],base=[],msgs=[];
  for(let h=0;h<24;h++){const c=lSimHour(G,h,F),b=lSimHour(G,h,{});cur.push(c);base.push(b);const w=c.worst[0];
    const parts=[];if(c.nP)parts.push(`kéo ${c.nP} UE khỏi 700/900`);if(c.nI)parts.push(`IFLB ${c.nI} UE`);if(c.nM)parts.push(`MLB qua Xn ${c.nM} UE`);
    msgs.push({t:h,p:c.over?'O&M':'PM',m:`${String(h).padStart(2,'0')}:00 · ${c.nAct} UE hoạt động`,a:`cell nặng nhất T${w[1]+1}/${LBB[w[2]].s} ${nF(w[0]*100,0)} %${parts.length?' · '+parts.join(', '):''}`,d:`UE ở băng thấp ${nF(c.low,0)} % (không cân bằng ${nF(b.low,0)} %); cell > 85 %: ${c.over} (không cân bằng ${b.over})`});}
  return {G,cur,base,msgs};}
function lSimMap(){const R=LBSM.R;if(!R)return '';const G=R.G,h=Math.floor(LBSM.h)%24,c=R.cur[h],I=LBP.sim.isd,W=600,H=560,sc=(H/2-20)/(1.75*I),X=x=>W/2+x*sc,Y=y=>H/2+y*sc;
  let s=`<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="Bản đồ 7 trạm, UE tô màu theo lớp"><rect x="0" y="0" width="${W}" height="${H}" class="u3pbg"/>`;
  G.U.forEach((u,i)=>{const k=c.ue[i];if(k<0){s+=`<circle cx="${X(u.x).toFixed(1)}" cy="${Y(u.y).toFixed(1)}" r="1.6" class="lbue off" style="fill:var(--muted)"/>`;return;}
    const k2=c.ue2[i];s+=`<circle cx="${X(u.x).toFixed(1)}" cy="${Y(u.y).toFixed(1)}" r="${u.ind?3.4:2.8}" class="lbue" style="fill:${LBB[LBL5[k]].c}${k2>=0?';stroke:'+LBB[LBL5[k2]].c+';stroke-width:1.8':''}"/>`;});
  G.sites.forEach((p,j)=>{const x=X(p[0]),y=Y(p[1]);s+=`<rect x="${(x-30).toFixed(1)}" y="${(y-22).toFixed(1)}" width="60" height="36" rx="5" class="lbsite"/><text x="${x.toFixed(1)}" y="${(y-26).toFixed(1)}" class="lbtxt" text-anchor="middle">T${j+1}</text>`;
    LBL5.forEach((l,q)=>{const has=G.has(j,l),v=has?Math.min(1.2,c.rho[j][l]):0,hh=v/1.2*28;s+=`<rect x="${(x-26+q*11).toFixed(1)}" y="${(y+10-hh).toFixed(1)}" width="8" height="${hh.toFixed(1)}" style="fill:${v>0.85?'var(--warn)':LBB[l].c}"/>`+(has?'':`<text x="${(x-22+q*11).toFixed(1)}" y="${(y+8).toFixed(1)}" class="lbsm" text-anchor="middle">·</text>`);});});
  s+=`<text x="10" y="20" class="lbtxt">${String(h).padStart(2,'0')}:00 · ${c.nAct} UE hoạt động · ISD ${lKm(I)}</text><text x="10" y="${H-10}" class="lbsm">Cột nhỏ ở mỗi trạm: tải 5 lớp (700, 900, 1800, 2600, 3500); đỏ khi > 85 %. Viền chấm UE: sóng mang thứ hai (CA).</text></svg>`;return s;}
function lSimPlot(){const R=LBSM.R;if(!R)return '';const ser=[];LBL5.forEach(l=>{ser.push({c:LBB[l].c,w:2.2,pts:R.cur.map(c=>[c.h,c.lay[l]])});ser.push({c:LBB[l].c,w:1,dash:'3 3',op:.7,pts:R.base.map(c=>[c.h,c.lay[l]])});});
  return nPlot({w:680,h:230,x0:0,x1:23,y0:0,y1:Math.max(100,...R.base.map(c=>Math.max(...LBL5.map(l=>c.lay[l])))),yt:[0,25,50,75,100],xt:[0,3,6,9,12,15,18,21],xf:v=>v+'h',series:ser,hl:[[LBP.sim.thr,'var(--warn)','ngưỡng']],cur:LBSM.h%24,ylab:'tải PRB trung bình (%)',xlab:'giờ',aria:'Tải theo lớp theo giờ'});}
function lSimTpPlot(){const R=LBSM.R;if(!R)return '';const y1=Math.max(...R.cur.map(c=>c.mean),...R.base.map(c=>c.mean))*1.1;
  return nPlot({w:680,h:200,x0:0,x1:23,y0:0,y1:y1,yt:[0,y1/4,y1/2,3*y1/4].map(v=>Math.round(v)),xt:[0,3,6,9,12,15,18,21],xf:v=>v+'h',series:[{c:'var(--nr)',w:2.2,pts:R.cur.map(c=>[c.h,c.mean])},{c:'var(--nr)',w:1,dash:'3 3',pts:R.base.map(c=>[c.h,c.mean])},{c:'var(--warn)',w:2.2,pts:R.cur.map(c=>[c.h,c.p5])},{c:'var(--warn)',w:1,dash:'3 3',pts:R.base.map(c=>[c.h,c.p5])}],cur:LBSM.h%24,ylab:'Mbit/s',xlab:'giờ',aria:'Tốc độ UE theo giờ'});}
function lSimCmp(){const R=LBSM.R;if(!R)return '';const bh=R.cur.reduce((a,c,i)=>c.nAct>R.cur[a].nAct?i:a,0),c=R.cur[bh],b=R.base[bh],sum=(A,f)=>A.reduce((x,y)=>x+f(y),0);
  const row=(n,a,v,u,hi,d)=>`<tr><td>${n}</td><td>${nF(a,d==null?1:d)}${u}</td><td>${nF(v,d==null?1:d)}${u}</td><td class="${(hi?a>=v:a<=v)?'lbgood':'lbbad'}">${a>=v?'+':''}${nF(a-v,d==null?1:d)}</td></tr>`;
  return `<p class="hint">Giờ bận ${bh}:00 (nhiều UE hoạt động nhất) và cả ngày. Cột “Không cân bằng”: tắt mọi thuật toán ở trên, giữ nguyên ưu tiên khi rỗi.</p><table class="ndtb lbtb"><thead><tr><th>Chỉ số</th><th>Đang bật</th><th>Không cân bằng</th><th>Chênh</th></tr></thead><tbody>
   ${row('Tốc độ UE trung bình (giờ bận)',c.mean,b.mean,' Mbit/s',1)}${row('Tốc độ UE 5 % (giờ bận)',c.p5,b.p5,' Mbit/s',1,2)}${row('UE ở băng thấp 700/900',c.low,b.low,' %',0)}
   ${LBL5.map(l=>row('Tải trung bình '+LBB[l].s,c.lay[l],b.lay[l],' %',0,0)).join('')}${row('Cell > 85 % (giờ bận)',c.over,b.over,'',0,0)}${row('Cell-giờ > 85 % (cả ngày)',sum(R.cur,x=>x.over),sum(R.base,x=>x.over),'',0,0)}${row('HO cân bằng tải (cả ngày)',sum(R.cur,x=>x.ho),0,'',0,0)}</tbody></table>`;}
function lSimShare(){const R=LBSM.R;if(!R)return '';const h=Math.floor(LBSM.h)%24,c=R.cur[h],b=R.base[h];return nBars(LBL5.map(l=>[LBB[l].s+' (không CB '+nF(b.share[l],0)+' %)',c.share[l],LBB[l].c]),100,' %',0);}
LBR.sim={
 html(){const P=LBP.sim;if(!LBSM.R)LBSM.R=lSimRun();
  return `<div class="cols"><div>
   <div class="panel"><h3>Bảy trạm, năm lớp tần số, 24 giờ</h3><div class="lbmap" id="lbSmMap">${lSimMap()}</div>
    <div class="row">${lPlayBtn('sim','lbSmPlay')}<button type="button" class="btn sm" data-lba="sim:prev">◀ Giờ trước</button><button type="button" class="btn sm" data-lba="sim:next">Giờ sau ▶</button><button type="button" class="btn sm" data-lba="sim:seed">Đổi phân bố UE</button></div>
    <p class="legend">${LBL5.map(l=>`<span><i style="background:${LBB[l].c}"></i>${LBB[l].n}</span>`).join('')}</p></div>
   <div class="panel"><h3>Tải PRB trung bình từng lớp theo giờ</h3><div class="scroll"><div class="lbw" id="lbSmPl">${lSimPlot()}</div></div><p class="legend"><span>nét liền: thuật toán đang bật</span><span>nét đứt: không cân bằng</span></p></div>
   <div class="panel"><h3>Tốc độ người dùng theo giờ</h3><div class="scroll"><div class="lbw" id="lbSmTp">${lSimTpPlot()}</div></div><p class="legend"><span><i style="background:var(--nr)"></i>trung bình</span><span><i style="background:var(--warn)"></i>UE 5 % (biên)</span><span>nét đứt: không cân bằng</span></p></div>
   <div class="panel"><h3>So sánh bật/tắt</h3><div class="scroll" id="lbSmCmp">${lSimCmp()}</div></div>
   <div class="panel"><h3>Nhật ký theo giờ</h3><div id="lbSmLog"></div></div>
  </div><div>
   <div class="panel"><h3>Thuật toán</h3><div class="ctl" style="grid-template-columns:1fr">
    ${lChk('sim','pull','Kéo UE khỏi 700/900 khi lớp cao đủ mạnh (A4, ưu tiên riêng)','dedPrio')}${lChk('sim','iflb','IFLB giữa lớp cùng trạm','mlbThr')}${lChk('sim','mlb','MLB giữa trạm (CIO qua Xn)','cio')}${lChk('sim','ca5','CA / 5G-A chia tải theo dung lượng còn lại','scellAct')}${lChk('sim','ai','AI/ML dự báo giờ tới (NWDAF/RIC)')}</div></div>
   <div class="panel"><h3>Mạng và người dùng</h3><div class="ctl">
    ${lSl('sim','isd','Khoảng cách trạm (ISD)',400,3000,100,v=>lKm(v))}${lSel('sim','tdd','n41/n78 triển khai',[['all','Cả 7 trạm'],['part','Chỉ 4 trạm (T1–T4)']])}
    ${lSl('sim','n','Số thuê bao',150,800,10,v=>v)}${lSl('sim','dem','Hệ số lưu lượng',0.3,3,0.1,v=>'× '+nF(v,1))}${lSl('sim','hot','UE tập trung quanh T1',0,70,5,v=>v+' %')}${lSl('sim','ind','UE trong nhà',0,100,5,v=>v+' %')}
    ${lSl('sim','cap','UE hỗ trợ n41/n78',10,100,5,v=>v+' %')}${lSl('sim','ca','UE có CA (trong số trên)',0,100,5,v=>v+' %')}
    ${lSl('sim','xh','Ngưỡng RSRP lên lớp cao khi rỗi',-120,-95,1,v=>v+' dBm','q-RxLevMin + threshX-HighP','threshXHigh')}${lSl('sim','thr','Ngưỡng tải cân bằng',40,95,5,v=>v+' %','','mlbThr')}${lSl('sim','cio','Biên CIO tối đa (MLB)',0,10,1,v=>v+' dB','','cio')}
    ${lSl('sim','spd','Tốc độ chạy giờ',0.5,4,0.5,v=>'× '+nF(v,1))}</div></div>
   <div class="panel"><h3>Tỉ lệ UE theo lớp (giờ đang xem)</h3><div id="lbSmSh">${lSimShare()}</div></div>
   <div class="panel"><h3>Mô hình</h3><p class="note">Trạm đa hướng (bỏ sector) để dễ nhìn; suy hao TR 38.901 UMa rút gọn, che khuất 6 dB, xuyên toà nhà theo băng. SINR tính nhiễu từ trạm khác cùng lớp nhân tải của trạm đó. Tốc độ UE theo hàng đợi chia thời gian: tốc độ đỉnh × (1 − tải). Chọn lớp khi rỗi: ưu tiên n78 > n41 > n3 > n8 > n28 với ngưỡng RSRP ở trên.</p></div>
  </div></div>`;},
 after(){this.draw(true);},
 draw(force){const R=LBSM.R;if(!R)return;const k=Math.floor(LBSM.h*4);if(!force&&k===LBSM.lastK)return;const hk=Math.floor(LBSM.h)%24,ch=force||Math.floor(LBSM.lastK/4)!==Math.floor(k/4);LBSM.lastK=k;
  if(ch){lSet('lbSmMap',lSimMap());lSet('lbSmSh',lSimShare());lSet('lbSmLog',lLogH(R.msgs.slice(0,hk+1)));}lSet('lbSmPl',lSimPlot());lSet('lbSmTp',lSimTpPlot());},
 tick(dt){if(!LBS.pause){LBSM.h+=dt*0.8*LBP.sim.spd;if(LBSM.h>=24)LBSM.h-=24;}this.draw(dt===0);},
 upd(k){if(k==='spd')return;LBSM.R=lSimRun();lSet('lbSmCmp',lSimCmp());this.draw(true);},
 act(a){if(a==='play')lPlayTog('lbSmPlay');else if(a==='prev'){LBSM.h=(Math.floor(LBSM.h)+23)%24;this.draw(true);}else if(a==='next'){LBSM.h=(Math.floor(LBSM.h)+1)%24;this.draw(true);}else if(a==='seed'){LBP.sim.seed++;this.upd('seed');}}
};
function lLogH(list){const ms=list.slice(-10);if(!ms.length)return '<p class="hint">Chưa có bản tin.</p>';
  return `<ol class="u3log ndlog">${ms.map((m,i)=>`<li class="${i===ms.length-1?'ndcur':''}"><span class="ndpr ndpr-${m.p}">${nE(m.p)}</span> <b>${nE(m.m)}</b> <span class="u3msg">${nE(m.a)}</span>${m.d?`<br><span class="note">${nE(m.d)}</span>`:''}</li>`).join('')}</ol>`;}

/* ---------- Mục 6: Tham số, KPI, lỗi ---------- */
LBP.vd={grp:'all',q:'',kf:'all'};
/* [khoá, nhóm, tên/ý nghĩa 3GPP, Huawei, Nokia, Ericsson, giá trị điển hình, cờ: c = tên thường gặp, v = cần đối chiếu] */
const LBPAR=[
 ['cellResPrio','Chọn lại cell khi rỗi','cellReselectionPriority (SIB2 lớp phục vụ, SIB4 NR khác tần số, SIB5 E-UTRA), 0…7, có thể kèm cellReselectionSubPriority','NRCellFreqRelation: CellReselPriority; NRCellReselConfig (lớp phục vụ)','NRFREQREL / NRCELL: cellReselectionPriority','NRFreqRelation: cellReselectionPriority; NRCellCU (lớp phục vụ)','n78 = 6–7, n41 = 6, 1800/2100 = 4–5, 900 = 3, 700 = 2','v'],
 ['qRxLevMin','Chọn lại cell khi rỗi','q-RxLevMin (bước 2 dB), Srxlev = RSRP − q-RxLevMin − bù công suất','NRCellReselConfig: MinimumRxLevel','NRCELL: qRxLevMin','NRCellCU / NRFreqRelation: qRxLevMin','−124 … −128 dBm (băng thấp có thể −130)','v'],
 ['threshXHigh','Chọn lại cell khi rỗi','threshX-HighP (SIB4/SIB5): lên lớp ưu tiên cao khi Srxlev đích lớn hơn','NRCellFreqRelation: ThreshXHigh','NRFREQREL: threshXHigh','NRFreqRelation: threshXHigh','8 … 14 dB (RSRP đích > −116 … −110 dBm)','v'],
 ['threshXLow','Chọn lại cell khi rỗi','threshX-LowP: xuống lớp ưu tiên thấp khi Srxlev đích lớn hơn','NRCellFreqRelation: ThreshXLow','NRFREQREL: threshXLow','NRFreqRelation: threshXLow','4 … 10 dB','v'],
 ['threshSrvLow','Chọn lại cell khi rỗi','threshServingLowP (SIB2): lớp đang ở yếu hơn mức này mới được xuống lớp thấp','NRCellReselConfig: ThrshServLow','NRCELL: threshServingLowP','NRCellCU: threshServingLow','2 … 8 dB','v'],
 ['sNonIntra','Chọn lại cell khi rỗi','s-NonIntraSearchP (SIB2): ngưỡng bắt đầu đo lớp ưu tiên bằng/thấp hơn','NRCellReselConfig: SNonIntraSearch','NRCELL: sNonIntraSearchP','NRCellCU: sNonIntraSearchP','10 … 24 dB, nên ≥ threshServingLowP','v'],
 ['tResel','Chọn lại cell khi rỗi','t-ReselectionNR (0…7 s), hệ số theo tốc độ UE','NRCellFreqRelation: TReselNr','NRFREQREL: tReselectionNR','NRFreqRelation: tReselectionNr','1 … 2 s','v'],
 ['dedPrio','Chọn lại cell khi rỗi','RRCRelease cellReselectionPriorities (ưu tiên riêng), T320 (5…180 phút); phân bổ khi giải phóng theo tải/thuê bao','Tính năng ưu tiên riêng theo SPID / phân bổ lớp khi giải phóng','Tính năng dedicated priority / load-based idle mode distribution','Tính năng Idle Mode Load Distribution / Release with Redirect theo tải','T320 = 30 … 180 phút','v'],
 ['a4Thr','Đo đạc và HO tải','A4 (lân cận > ngưỡng) hoặc A5 trên tần số đích, cấu hình riêng cho HO cân bằng tải','NRInterFreqHoGroup / ngưỡng A4 cho MLB','Ngưỡng A4 cho IFLB (NRHOIF)','ReportConfigA5/A4 cho tải (ReportConfigA1A2A4A5)','−110 … −105 dBm','v'],
 ['cio','Đo đạc và HO tải','cellIndividualOffset (CIO) theo cặp cell, −24…24 dB; MLB chỉnh qua XnAP Mobility Settings Change','NRCellRelation: CellIndividualOffset','NRREL: cellIndividualOffset','NRCellRelation: cellIndividualOffsetNR','0 dB; MLB thay ±1 … ±6 dB','v'],
 ['mlbThr','MLB / IFLB','Ngưỡng tải kích hoạt cân bằng giữa tần số (PRB DL/UL, số UE)','NRCellMlb: InterFreqMlbThd (theo PRB, theo UE)','Inter-frequency load balancing: lbThreshold / ngưỡng PRB','Inter-Frequency Load Balancing (NR): ngưỡng tải','60 … 80 %','v'],
 ['mlbDiff','MLB / IFLB','Ngưỡng chênh tải nguồn − đích để chuyển UE (trễ ngưỡng chống ping-pong)','InterFreqMlbLoadDiff / độ lệch tải','lbLoadDiff (tên gần đúng)','lbCeiling / chênh tải giữa cell','10 … 30 %','v'],
 ['mlbPer','MLB / IFLB','Chu kỳ đánh giá tải; XnAP Resource Status Reporting Periodicity (500 ms … 10 s)','MlbPeriod','mlbEvalPeriod (tên gần đúng)','lbEvaluationPeriod','5 … 10 s','v'],
 ['mlbUeNum','MLB / IFLB','Số UE tối đa chuyển mỗi lượt, cách chọn UE (theo PRB, RSRP đích, dịch vụ)','MlbUeSelectNum / chiến lược chọn UE','lbMaxUeNum (tên gần đúng)','Số UE mỗi lượt cân bằng','3 … 10 UE','v'],
 ['xnRs','MLB / IFLB','XnAP Resource Status Request/Response/Update: Radio Resource Status, Composite Available Capacity Group, số UE RRC (TS 38.423 §8.4.10)','Bật trao đổi tải qua Xn cho MLB giữa gNB','Inter-gNB MLB qua Xn','Inter-gNB load balancing qua Xn','chu kỳ 1 … 10 s','v'],
 ['dss','Băng thấp, DSS, SUL','DSS: LTE CRS rate matching (lte-CRS-ToMatchAround), chia động RE giữa LTE và NR trên cùng sóng mang','NR DSS (LTE FDD và NR Spectrum Sharing)','Dynamic Spectrum Sharing (LTE–NR)','Ericsson Spectrum Sharing (ESS)','900 MHz 10 MHz; NR mất ~10–15 % do CRS','v'],
 ['sul','Băng thấp, DSS, SUL','supplementaryUplink (ServingCellConfigCommon), băng SUL n80–n86 (n81 = UL 900, n83 = UL 700)','NR SUL / UL-DL Decoupling','Supplementary Uplink','Uplink-Downlink decoupling / SUL','n78 DL + n83/n81 UL','v'],
 ['scellAct','5G-A','SCell Activation/Deactivation MAC CE, sCellDeactivationTimer; chọn PCell/SCell theo tải; multi-cell PDSCH (Rel-18)','NR CA: SCell chọn theo tải, kích hoạt động','CA load-aware SCell configuration','Carrier Aggregation: SCell selection theo tải','sCellDeactivationTimer 40 … 320 ms','v'],
 ['bwp','5G-A','BWP riêng UE (BWP-Downlink/Uplink dedicated), bwp-InactivityTimer, chuyển BWP bằng DCI','NR BWP theo UE (RedCap, tiết kiệm năng lượng)','UE-specific BWP','Bandwidth Part adaptation','BWP 20 MHz cho RedCap; timer 20 … 100 ms','v'],
 ['cho','5G-A','CHO (conditionalReconfiguration, condEventA3/A5), LTM (Rel-18, cell switch MAC CE); chọn ứng viên theo tải','NR CHO / LTM','Conditional Handover, LTM','Conditional Handover, LTM','2 … 4 ứng viên','v']
];
const LBKPI=[
 ['Tải PRB theo lớp tần số','PRB dùng / PRB có × 100 cho từng lớp (gộp cell cùng tần số), DL và UL','N.PRB.DL.Used.Avg / N.PRB.DL.Avail.Avg theo cell','PRB usage theo cell (tra NetAct)','pmMacRBSymUsedPdschTypeA / pmMacRBSymAvailDl','Không lớp nào > 80 % khi lớp khác < 40 %','sim','prb5'],
 ['Độ lệch tải giữa lớp','max(tải lớp) − min(tải lớp) trong cùng trạm/vùng','Tự tính từ PRB theo cell','Tự tính','Tự tính','≤ 20 % giờ bận','iflb','lb_imb'],
 ['Tỉ lệ UE theo lớp / ở băng thấp','Số UE RRC kết nối trung bình theo lớp / tổng × 100; lớp 700/900','N.User.RRCConn.Avg theo cell','RRC connected users theo cell','pmRrcConnLevelSum / pmRrcConnLevelSamp','UE ở 700/900 ≤ 25–35 % nơi có lớp cao','idle','lb_low'],
 ['IFLB/MLB HO SR','HO thành công lý do cân bằng tải / HO thử lý do cân bằng tải × 100','Bộ đếm HO khác tần số theo lý do MLB','HO theo cause load balancing','pmHoExeSuccLb… (theo lý do)','≥ 97 %','iflb','lb_ho'],
 ['Thông lượng UE biên (5 %)','Phân vị 5 % tốc độ UE (DL) trong giờ bận, theo vùng','Phân bố tốc độ UE (User DL Throughput distribution)','User throughput distribution','pmUeThpDl… phân bố','≥ 5–10 Mbit/s tuỳ mục tiêu','sim','lb_edge'],
 ['Số lần chọn lại / HO ping-pong giữa lớp','HO quay lại cell cũ trong T (10–30 s) / tổng HO','Bộ đếm HO ping-pong','Ping-pong HO','pmHoPingPong…','≤ 2 %','iflb','']
];
const LBFLT=[
 ['UE kẹt ở băng thấp 700/900','UE gần trạm vẫn ở n28/n8, tốc độ thấp, lớp n78 rảnh',['threshX-HighP quá cao hoặc ưu tiên n28 ≥ lớp cao','Thiếu tần số lớp cao trong SIB4 / quan hệ lân cận','UE không hỗ trợ băng cao','Không có HO A4 kéo lên khi kết nối'],['So tỉ lệ UE theo lớp với độ phủ RSRP lớp cao','Kiểm tra SIB4, ưu tiên, ngưỡng','Bật A4/ưu tiên riêng khi giải phóng'],{h:'Kiểm tra CellReselPriority, ThreshXHigh, lớp n78 trong NRCellFreqRelation',n:'Kiểm tra NRFREQREL, threshXHigh',e:'Kiểm tra NRFreqRelation cellReselectionPriority, threshXHigh'},'Tỉ lệ UE ở băng thấp','idle'],
 ['Nghẽn lớp 700/900','Tải PRB n28/n8 > 85 %, tốc độ UE rất thấp, nhiều UE trong nhà sâu',['Lớp phủ hẹp (10 MHz) gánh UE xa và trong nhà','Ngưỡng xuống lớp thấp quá dễ','DSS chia quá ít cho NR'],['Phân bố RSRP/TA của UE trên lớp thấp','Chỉnh threshServingLowP, threshX-LowP','Thêm lớp FDD 1800/2100, tăng phần NR trong DSS'],{h:'MLB từ lớp thấp sang 1800/2100',n:'IFLB từ n28/n8',e:'Inter-frequency offload từ lớp phủ'},'Tải PRB theo lớp','sim'],
 ['Ping-pong tải giữa hai lớp','UE chuyển qua lại liên tục, HO tăng vọt, tải dao động',['Không có trễ ngưỡng (chênh tải nhỏ)','Không cấm quay lại','CIO giữa gNB không phối hợp hai chiều','Ngưỡng chọn lại khi rỗi trái với ngưỡng HO tải'],['Bộ đếm HO ping-pong theo lý do','Đồ thị tải hai lớp theo phút','So ngưỡng idle và connected'],{h:'Kiểm tra InterFreqMlbLoadDiff, thời gian phạt',n:'Kiểm tra lbLoadDiff, penalty timer',e:'Kiểm tra lbCeiling, hysteresis'},'IFLB/MLB HO SR, ping-pong','iflb'],
 ['Một lớp đầy, lớp kia rảnh','n78 > 85 %, n41 < 30 % cùng trạm',['IFLB tắt hoặc ngưỡng quá cao','Ít UE hỗ trợ băng đích','A4 quá chặt, ít UE đủ điều kiện','UE CA không chia tải theo dung lượng còn lại'],['Tỉ lệ UE hỗ trợ băng (UE capability)','Số UE đủ điều kiện A4','Cấu hình CA, SCell'],{h:'Bật NR MLB giữa tần số, kiểm tra A4',n:'Bật IFLB',e:'Bật Inter-Frequency Load Balancing'},'Độ lệch tải giữa lớp','adv'],
 ['HO cân bằng tải thất bại','IFLB HO SR < 95 %',['Chọn UE có RSRP đích yếu','Đích quá tải từ chối (admission)','Thiếu lân cận / sai tần số'],['Phân bố RSRP đích của UE được chọn','Nguyên nhân thất bại','Lân cận, NR-ARFCN'],{h:'Kiểm tra chiến lược chọn UE, ngưỡng A4',n:'Kiểm tra ngưỡng A4 IFLB',e:'Kiểm tra ngưỡng A5 tải'},'IFLB/MLB HO SR','iflb'],
 ['Vùng lõm trong nhà dù có 700/900','UE trong nhà mất kết nối dữ liệu, chỉ còn thoại',['Ngưỡng q-RxLevMin quá cao trên băng thấp','UL giới hạn (UE công suất thấp)','Thiếu SUL/UL băng thấp cho n78'],['RSRP/PHR của UE trong nhà','So MAPL UL các lớp','Cân nhắc SUL n83/n81'],{h:'Kiểm tra MinimumRxLevel, NR SUL',n:'Kiểm tra qRxLevMin, SUL',e:'Kiểm tra qRxLevMin, UL-DL decoupling'},'Thông lượng UE biên','cov']
];
function lbParRows(){const P=LBP.vd,q=P.q.trim().toLowerCase(),v=nVn();const rows=LBPAR.filter(r=>(P.grp==='all'||r[1]===P.grp)&&(!q||r.join(' ').toLowerCase().includes(q)));
  const cols=v==='3gpp'?[3,4,5]:[{huawei:3,nokia:4,ericsson:5}[v]];
  return rows.map(r=>`<tr><td><span class="chip">${nE(r[1])}</span><br>${nE(r[2])}</td>${cols.map(c=>`<td class="u3tag">${nE(r[c])}</td>`).join('')}<td>${nE(r[6])}</td><td>${r[7]==='v'?'<span class="kpC mid">Cần đối chiếu</span>':'<span class="kpC ok">Thường gặp</span>'}</td></tr>`).join('')||'<tr><td colspan="6">Không có tham số khớp.</td></tr>';}
function lbParHead(){const v=nVn();return `<tr><th>Tham số (3GPP / ý nghĩa)</th>${v==='3gpp'?'<th>Huawei</th><th>Nokia</th><th>Ericsson</th>':`<th>${nVName(v)}</th>`}<th>Điển hình</th><th>Độ tin cậy tên</th></tr>`;}
function lbKpiRows(){const v=nVn(),f=LBP.vd.kf;return LBKPI.filter(k=>f==='all'||k[6]===f).map(k=>`<tr><td><b>${nE(k[0])}</b>${k[7]&&typeof KL!=='undefined'&&KL.find(x=>x.id===k[7])?`<br><button type="button" class="u3lnkbtn" data-lbgo="kpi:${k[7]}">Mở ở thẻ KPI →</button>`:''}</td><td>${nE(k[1])}</td><td class="u3tag">${v==='3gpp'?['Huawei: '+k[2],'Nokia: '+k[3],'Ericsson: '+k[4]].map(nE).join('<br>'):nE(k[{huawei:2,nokia:3,ericsson:4}[v]])}<br><span class="kpC mid">cần đối chiếu</span></td><td>${nE(k[5])}</td><td><button type="button" class="btn sm" data-lbgo="lb:${k[6]}">Mô phỏng →</button></td></tr>`).join('');}
function lbFltHtml(){const v=nVn();return LBFLT.map(f=>`<details class="u3flt ndflt lbflt"><summary><b>${nE(f[0])}</b></summary><p class="e2d">${nE(f[1])}</p><div class="u3two"><div><b>Nguyên nhân</b><ul class="u3ul">${f[2].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div><div><b>Kiểm tra</b><ul class="u3ul">${f[3].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div></div><p class="note">${v==='3gpp'?['Huawei: '+f[4].h,'Nokia: '+f[4].n,'Ericsson: '+f[4].e].map(nE).join(' · '):nVName(v)+': '+nE(f[4][v[0]])} · KPI: ${nE(f[5])} · <button type="button" class="u3lnkbtn" data-lbgo="lb:${f[6]}">Mô phỏng →</button></p></details>`).join('');}
function lbCalc(){const g=id=>{const e=document.getElementById(id);return e?+e.value:0;},o=document.getElementById('lbcOut');if(!o)return;
  const u1=g('lbcU1'),a1=g('lbcA1'),u2=g('lbcU2'),a2=g('lbcA2'),n1=g('lbcN1'),nt=g('lbcNt'),ha=g('lbcHa'),hs=g('lbcHs'),pp=g('lbcPp');const l1=a1?u1/a1*100:0,l2=a2?u2/a2*100:0;
  o.innerHTML=lKv('Tải lớp 1 / lớp 2',nF(l1,1)+' % / '+nF(l2,1)+' %')+lKv('Độ lệch tải',`<span class="${Math.abs(l1-l2)>20?'lbbad':'lbgood'}">${nF(Math.abs(l1-l2),1)} %</span>`)+lKv('Tỉ lệ UE ở băng thấp',nt?nF(n1/nt*100,1)+' %':'—')+lKv('IFLB/MLB HO SR',ha?`<span class="${hs/ha<0.97?'lbbad':'lbgood'}">${nF(hs/ha*100,2)} %</span>`:'—')+lKv('Tỉ lệ ping-pong',hs?nF(pp/hs*100,2)+' %':'—');}
LBR.vd={
 html(){const P=LBP.vd,grps=[...new Set(LBPAR.map(r=>r[1]))];
  return `<div class="panel"><h3>Bảng tham số đa lớp và cân bằng tải</h3><p class="hint">Chọn vendor ở thanh trên để chỉ hiện cột của vendor đó. Tên vendor gắn “Cần đối chiếu” phải kiểm tra theo tài liệu release đang dùng.</p>
   <div class="ctl" style="margin-bottom:10px">${lSel('vd','grp','Nhóm',[['all','Tất cả']].concat(grps.map(g=>[g,g])))}<label class="c"><span class="cl">Lọc</span><input type="search" id="lbvq" value="${nE(P.q)}" placeholder="Ví dụ: threshX, CIO, SUL"></label></div>
   <div class="scroll"><table class="ndtb"><thead>${lbParHead()}</thead><tbody id="lbParB">${lbParRows()}</tbody></table></div></div>
  <div class="panel"><h3>KPI theo dõi</h3><div class="ctl" style="margin-bottom:10px">${lSel('vd','kf','Theo mục',[['all','Tất cả']].concat(LBV.filter(v=>v[0]!=='vd').map(v=>[v[0],v[1]])))}</div>
   <div class="scroll"><table class="ndtb"><thead><tr><th>KPI</th><th>Công thức</th><th>Bộ đếm</th><th>Mục tiêu</th><th></th></tr></thead><tbody id="lbKpB">${lbKpiRows()}</tbody></table></div>
   <div class="u3calc"><b>Tính nhanh từ bộ đếm</b><div class="ctl ndcalc" style="margin-top:8px">
    ${[['lbcU1','PRB dùng lớp 1 (n78)',230],['lbcA1','PRB có lớp 1',273],['lbcU2','PRB dùng lớp 2 (n41)',80],['lbcA2','PRB có lớp 2',273],['lbcN1','UE trung bình ở 700/900',140],['lbcNt','UE trung bình mọi lớp',420],['lbcHa','HO thử lý do cân bằng tải',5200],['lbcHs','HO thành công lý do cân bằng tải',5080],['lbcPp','HO ping-pong',96]].map(r=>`<label class="c"><span class="cl">${r[1]}</span><input type="number" id="${r[0]}" value="${r[2]}" step="any"></label>`).join('')}
   </div><dl class="kv" id="lbcOut" style="margin-top:8px"></dl></div></div>
  <div class="panel"><h3>Lỗi thường gặp và cách kiểm tra</h3>${lbFltHtml()}</div>
  <div class="panel"><h3>Tiêu chuẩn tham chiếu</h3><ul class="u3ul"><li>TS 38.304 §5.2.4: chọn lại cell theo ưu tiên, tiêu chí S, xếp hạng R</li><li>TS 38.331: SIB2, SIB4, SIB5, RRCRelease (cellReselectionPriorities, T320), MeasConfig A4/A5, SUL, BWP, CHO, LTM</li><li>TS 38.423 §8.4.10–8.4.11: Xn Resource Status Reporting, Mobility Settings Change</li><li>TS 38.300 §9.2 (di động), §15 (SON, MLB), TS 28.552 (đo PRB, số UE), TS 28.554 (KPI)</li><li>TS 23.288 (NWDAF), O-RAN WG2/WG3 (A1, E2, traffic steering)</li><li>TR 38.901 §7.4 (suy hao, xuyên toà nhà); TS 38.101-1 (băng n8, n28, SUL n81, n83)</li></ul></div>`;},
 after(){lbCalc();},
 upd(k){if(k==='grp'){lSet('lbParB',lbParRows());}if(k==='kf'){lSet('lbKpB',lbKpiRows());}}
};
document.addEventListener('input',e=>{const t=e.target;if(t.id==='lbvq'){LBP.vd.q=t.value;lSet('lbParB',lbParRows());}else if(t.id&&/^lbc[A-Z]/.test(t.id))lbCalc();});

/* ---------- Khung thẻ: điều hướng, vòng hoạt hình, sự kiện ---------- */
const LBLK={
  cov:{e2:[['reg','sa'],['idle','sa'],['data','g4']],kpi:['lb_edge','tputdl5','tputul5']},
  idle:{e2:[['idle','sa'],['idle','g4'],['reg','sa']],kpi:['lb_low']},
  iflb:{e2:[['ho','sa'],['ho','g4'],['data','sa']],kpi:['lb_ho','lb_imb','hosr5','prb5']},
  adv:{e2:[['data','sa'],['data','nsa'],['ho','sa']],kpi:['lb_imb','prb5','tputdl5']},
  sim:{e2:[['data','sa'],['idle','sa'],['ho','sa']],kpi:['lb_imb','lb_low','lb_edge','prb5']},
  vd:{e2:[['idle','sa'],['ho','sa'],['data','sa']],kpi:[]}
};
const LBT={g3:'3G',g4:'4G',nsa:'5G NSA',sa:'5G SA'};
function lbLinks(){const L=LBLK[LBS.v]||{e2:[],kpi:[]},hasE2=typeof E2S!=='undefined',hasK=typeof KL!=='undefined';
  const e2=hasE2?L.e2.map(([id,tk])=>{const s=E2S.find(x=>x.id===id);return s&&s.f&&s.f[tk]?[s,tk]:null;}).filter(Boolean):[];
  const kp=hasK?L.kpi.map(id=>KL.find(k=>k.id===id)).filter(Boolean):[];
  const tabs=[['sf','Hiệu quả tần số tại một trạm'],['radio','Phủ sóng và di động'],['ro','Tối ưu vô tuyến'],['nd','NSA EN-DC và di động 5G-A'],['ca','5G-Advanced (ghép sóng mang)'],['prb','Cấp phát PRB'],['es','Tiết kiệm điện'],['ml','Học máy']].filter(t=>typeof RENDER!=='undefined'&&RENDER[t[0]]);
  return `<div class="panel u3lk"><h3>Xem tiếp ở thẻ khác</h3>
  ${e2.length?`<p class="e2x"><b>Luồng ở thẻ Toàn trình E2E</b> (mở sẵn đúng công nghệ):</p><div class="e2go">${e2.map(([s,tk])=>`<button type="button" class="btn sm" data-lbgo="e2:${s.id}:${tk}">${nE(s.n)} · ${LBT[tk]} →</button>`).join('')}</div>`:''}
  ${kp.length?`<p class="e2x" style="margin-top:10px"><b>KPI liên quan ở thẻ KPI mạng</b>:</p><div class="e2go">${kp.map(k=>`<button type="button" class="btn sm" data-lbgo="kpi:${k.id}">${nE(k.nm)} →</button>`).join('')}</div>`:''}
  <p class="e2x" style="margin-top:10px"><b>Thẻ liên quan:</b></p><div class="e2go">${tabs.map(t=>`<button type="button" class="btn sm" data-tab="${t[0]}">${t[1]} →</button>`).join('')}</div></div>`;}
function lbNav(){return `<div class="seg u3seg ndseg lbseg" role="group" aria-label="Mục của thẻ Đa lớp tần số và cân bằng tải">${LBV.map((v,i)=>`<button type="button" data-lbv="${v[0]}" aria-pressed="${v[0]===LBS.v}"><span class="ndn">${i+1}</span>${v[1]}</button>`).join('')}</div>`;}
function lPlayBtn(vw,id){return `<button type="button" class="btn sm" data-lba="${vw}:play" id="${id}">${LBS.pause?'▶ Chạy':'⏸ Dừng'}</button>`;}
function lPlayTog(id){LBS.pause=!LBS.pause;const b=document.getElementById(id);if(b)b.textContent=LBS.pause?'▶ Chạy':'⏸ Dừng';}
function renderLb(){const nav=$('#lbNav'),body=$('#lbBody');if(!nav||!body)return;if(!LBR[LBS.v])LBS.v='cov';
  nav.innerHTML=lbNav();const V=LBR[LBS.v];body.innerHTML=V.html()+lbLinks();if(V.after)V.after();
  if(S.tab==='lb'&&!nReduced())lbStart();else{lbStop();if(V.tick&&S.tab==='lb')V.tick(0);}}
function lbStart(){if(LBS.raf)return;LBS.last=performance.now();LBS.raf=requestAnimationFrame(lbLoop);}
function lbStop(){if(LBS.raf)cancelAnimationFrame(LBS.raf);LBS.raf=0;}
function lbLoop(now){LBS.raf=0;if(S.tab!=='lb')return;
  if(document.hidden){LBS.last=now;LBS.raf=requestAnimationFrame(lbLoop);return;}
  const dt=Math.max(0,Math.min(0.1,(now-LBS.last)/1000));LBS.last=now;const V=LBR[LBS.v];if(V&&V.tick){try{V.tick(dt);}catch(e){console.error(e);}}
  LBS.raf=requestAnimationFrame(lbLoop);}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-lbgo]');
  if(g){const [t,id,tk]=g.dataset.lbgo.split(':');try{tourStop();}catch(x){}try{stopSig();}catch(x){}
    const top=()=>window.scrollTo({top:Math.min(window.scrollY,$('main').offsetTop-$('.bar').offsetHeight)});
    if(t==='e2'){try{e2Stop();}catch(x){}S.e2Sc=id;S.e2R=tk||'sa';S.e2M=S.mode;if(typeof E2A!=='undefined'){E2A.key='';E2A.i=0;}S.tab='e2';renderAll();top();}
    else if(t==='kpi'){S.tab='kpi';KP.tech='all';KP.ly='all';KP.cat='all';KP.q='';KP.node='';KP.sel=id;kpSig='';renderAll();setTimeout(()=>{const d=$('#kpDet');if(d)d.scrollIntoView({block:'start',behavior:'smooth'});},60);}
    else if(t==='lb'){S.tab='lb';if(id&&LBR[id])LBS.v=id;renderAll();top();}
    return;}
  const on=e.target.closest('#t-lb [data-lbon]');if(on){LBP.cov.on[on.dataset.lbon]=on.checked;LBR.cov.upd('on');const p=document.getElementById('lbCovPl');return;}
  const t=e.target.closest('#t-lb [data-lbv],#t-lb [data-lba]');if(!t)return;
  if(t.dataset.lbv){if(t.dataset.lbv===LBS.v)return;LBS.v=t.dataset.lbv;lbStop();renderLb();return;}
  const [vw,a]=t.dataset.lba.split(':');const V=LBR[vw];if(V&&V.act)V.act(a,t);
});
function lbInp(el){const [vw,k]=el.dataset.lbi.split(':');const P=LBP[vw];if(!P)return;
  let v=el.type==='checkbox'?el.checked:(el.tagName==='SELECT'&&isNaN(+el.value)?el.value:+el.value);if(v==='false')v=false;if(v==='true')v=true;P[k]=v;
  const o=el.parentElement.querySelector('output');if(o&&LBF[vw+':'+k])o.textContent=LBF[vw+':'+k](P[k]);
  const V=LBR[vw];if(V&&V.upd)V.upd(k);}
document.addEventListener('input',e=>{const el=e.target;if(!el.dataset||!el.dataset.lbi||el.type!=='range')return;lbInp(el);});
document.addEventListener('change',e=>{const el=e.target;if(!el.dataset||!el.dataset.lbi||el.type==='range')return;lbInp(el);});

/* ---------- Gắn thẻ vào ứng dụng ---------- */
RENDER.lb=renderLb;
(function(){if(typeof K!=='function'||typeof KL==='undefined')return;try{
  if(typeof KPB!=='undefined'&&!KPB.mlb)KPB.mlb={t:"Mất cân bằng tải giữa lớp tần số",
    st:["Lập bảng tải PRB và số UE theo lớp cho từng trạm trong giờ bận; tìm cặp lớp lệch > 20 %.","Đối chiếu tỉ lệ UE theo lớp với độ phủ RSRP của lớp cao (UE kẹt băng thấp hay thiếu phủ).","Kiểm tra ưu tiên chọn lại cell, threshX-High/Low trong SIB và ngưỡng IFLB/MLB khi kết nối có cùng hướng không.","Xem HO lý do cân bằng tải: số thử, thành công, ping-pong; tỉ lệ UE hỗ trợ băng đích."],
    ca:["Ưu tiên SIB dồn UE về một lớp","IFLB/MLB tắt hoặc ngưỡng cao","Ít UE hỗ trợ băng đích","A4 quá chặt","CIO giữa gNB không phối hợp"],
    pa:["cellReselectionPriority, threshX-HighP/LowP","Ngưỡng tải, chênh tải, số UE mỗi lượt","A4/A5, CIO"],cs:[],gen:1};
  const add=a=>{if(KL.some(k=>k.id===a[0]))return;K(...a);};
  add(["lb_imb","5G","ran","utl","Inter-frequency PRB Load Imbalance","du","mlb","g|%|0|60|d|20|35|10",
   "Độ lệch tải = max(tải PRB các lớp cùng trạm) − min(tải PRB các lớp cùng trạm), tính theo giờ bận.","TS 28.552 (PRB usage theo cell), TS 38.300 §15 (MLB). Chỉ số tự tính.",
   "?Tự tính từ N.PRB.DL.Used.Avg theo cell (tra Huawei NR PM)","?Tự tính từ pmMacRBSymUsedPdschTypeA (tra Ericsson NR PM)","?Tự tính từ PRB usage (tra Nokia 5G PM)",
   "Lớp này đầy trong khi lớp kia rảnh: lãng phí phổ, tốc độ UE thấp ở lớp đầy.","≤ 20 % giờ bận.",
   "du>cucp:Tải PRB từng lớp;cucp>ue:RRCReconfiguration (MeasConfig A4)!A;ue>cucp:MeasurementReport (A4);cucp>ue:RRCReconfiguration (HO sang lớp ít tải)!S"]);
  add(["lb_low","5G","ran","utl","Low-band UE Share (700/900 MHz)","du,ue","mlb","g|%|0|100|d|35|50|25",
   "UE ở băng thấp % = UE RRC kết nối trung bình trên cell n28/n8 / tổng UE RRC kết nối của trạm × 100.","TS 28.552 (số UE RRC kết nối theo cell). Chỉ số tự tính.",
   "?N.User.RRCConn.Avg theo cell (tra Huawei NR PM)","?pmRrcConnLevelSum/Samp (tra Ericsson NR PM)","?RRC connected users (tra Nokia 5G PM)",
   "Cao bất thường nơi có lớp dung lượng nghĩa là UE kẹt băng thấp (ưu tiên, ngưỡng hoặc thiếu kéo lên).","≤ 25–35 % nơi có phủ lớp cao.",
   "cucp>ue:SIB4 (ưu tiên, threshX-HighP)!A;ue>du:Chọn lại cell lên lớp cao;cucp>ue:RRCRelease (ưu tiên riêng)!S"]);
  add(["lb_ho","5G","ran","mob","Load Balancing HO Success Rate","ue,cucp,gnb2","mlb","r",
   "IFLB/MLB HO SR = HO thành công có lý do cân bằng tải / HO thử có lý do cân bằng tải × 100 (nội gNB và qua Xn).","TS 28.552 (HO theo lý do), TS 38.423 (Cause: reduce-load-in-serving-cell).",
   "?Bộ đếm HO khác tần số theo lý do MLB (tra Huawei NR PM)","?pmHoExeSucc… theo lý do (tra Ericsson NR PM)","?HO cause load balancing (tra Nokia 5G PM)",
   "HO cân bằng tải thất bại làm rớt cuộc, nên chọn UE có RSRP đích tốt.","≥ 97 %.",
   "cucp>ue:MeasConfig A4 (tần số đích)!A;ue>cucp:MeasurementReport;cucp>gnb2:Xn Handover Request (reduce-load-in-serving-cell);gnb2>cucp:Handover Request Ack;ue>gnb2:RRCReconfigurationComplete!S"]);
  add(["lb_edge","5G","ran","int","Cell-edge User Throughput (5th percentile)","du,ue","tput","g|Mbps|0|100|u|10|3|20",
   "Tốc độ UE biên = phân vị 5 % của tốc độ DL theo UE (đã loại thời gian chờ) trong giờ bận.","TS 28.552 (phân bố tốc độ UE), TS 28.554 §6.3 (user throughput).",
   "?User DL throughput distribution (tra Huawei NR PM)","?pmUeThpDl… phân bố (tra Ericsson NR PM)","?User throughput distribution (tra Nokia 5G PM)",
   "Phản ánh trải nghiệm UE ở biên và lớp nghẽn; cân bằng tải tốt nâng chỉ số này nhiều hơn tốc độ trung bình.","≥ 5–10 Mbit/s tuỳ mục tiêu.",
   "cuup>du:Lưu lượng DL;du>ue:Lập lịch PRB trên lớp ít tải!S"]);
  const XN={lb_imb:["Độ lệch tải PRB giữa lớp tần số","LB Imb","load imbalance|cân bằng tải|MLB|IFLB|inter-frequency load","Chênh tải PRB giữa lớp đầy nhất và lớp rảnh nhất cùng trạm. Lớn nghĩa là chiến lược lớp hoặc cân bằng tải chưa hiệu quả."],
    lb_low:["Tỉ lệ UE ở băng thấp 700/900","LowBand","700 MHz|900 MHz|n28|n8|băng thấp|kẹt băng thấp|coverage layer","Tỉ lệ UE kết nối trên lớp phủ 700/900. Cao nơi có lớp dung lượng là dấu hiệu UE kẹt băng thấp."],
    lb_ho:["Tỉ lệ HO cân bằng tải thành công","LB HO SR","IFLB|MLB HO|load balancing handover|reduce-load|A4","Tỉ lệ thành công của chuyển giao vì cân bằng tải giữa tần số hoặc giữa gNB."],
    lb_edge:["Tốc độ UE biên (phân vị 5 %)","Edge Tput","cell edge throughput|5%-tile|5 percentile|tốc độ biên","Tốc độ DL của 5 % UE kém nhất trong giờ bận."]};
  const EN={lb_imb:"Inter-frequency PRB Load Imbalance",lb_low:"Low-band (700/900 MHz) UE Share",lb_ho:"Load Balancing Handover Success Rate",lb_edge:"Cell-edge User Throughput (5th percentile)"};
  for(const id in XN){const k=KL.find(x=>x.id===id);if(!k)continue;const x=XN[id];if(typeof KX!=='undefined')KX[id]=x;if(typeof KEN!=='undefined')KEN[id]=EN[id];
    k.fn=x[0];k.ab=[x[1]].concat(x[2].split('|'));k.gl=x[3];k.dn=k.fn+' ('+x[1]+')';k.en=EN[id];}
  const ids=['lb_imb','lb_low','lb_ho','lb_edge'],moved=ids.map(id=>{const i=KL.findIndex(k=>k.id===id);return i>=0?KL.splice(i,1)[0]:null;}).filter(Boolean);
  const j=KL.findIndex(k=>k.id==='prb5');KL.splice(j>=0?j+1:KL.length,0,...moved);
}catch(e){console.error('KPI đa lớp mới',e);}})();
/* tìm kiếm chung */
if(typeof qSnap==='function'){const _ql=qSnap;qSnap=function(){_ql.apply(this,arguments);if(!QS||!QS.I||QS.lb)return;QS.lb=1;
  const CAT='Thẻ Đa lớp tần số và cân bằng tải',body=$('#lbBody'),cur=LBS.v;
  if(body){for(const [v,vn] of LBV){try{LBS.v=v;body.innerHTML=LBR[v].html();
    body.querySelectorAll('.panel').forEach(pn=>{const h=pn.querySelector('h3'),tt=h?h.textContent:vn,txt=qText(pn).slice(0,6000);if(txt.trim().length<12)return;
      qAdd(QS.I,CAT+' · '+vn,tt,txt,1,()=>{S.tab='lb';LBS.v=v;},()=>[...document.querySelectorAll('#t-lb .panel')].find(p=>{const x=p.querySelector('h3');return x&&x.textContent===tt;}));});}catch(e){console.error(e);}}
    LBS.v=cur;try{if(S.tab==='lb')renderLb();else body.innerHTML='';}catch(e){}}
  const go=(v,f)=>()=>{S.tab='lb';LBS.v=v;if(f)f();};
  LBPAR.forEach(r=>qAdd(QS.I,'Đa lớp và cân bằng tải · Tham số '+r[1],r[2],['Huawei: '+r[3],'Nokia: '+r[4],'Ericsson: '+r[5],'Điển hình: '+r[6]].join('. '),3,go('vd',()=>{LBP.vd.grp=r[1];LBP.vd.q='';}),'#lbParB'));
  LBKPI.forEach(k=>qAdd(QS.I,'Đa lớp và cân bằng tải · KPI',k[0],[k[1],'Huawei: '+k[2],'Nokia: '+k[3],'Ericsson: '+k[4],k[5]].join('. '),3,go('vd'),'#lbKpB'));
  LBFLT.forEach(f=>qAdd(QS.I,'Đa lớp và cân bằng tải · Lỗi thường gặp',f[0],[f[1],f[2].join('; '),f[3].join('; ')].join('. '),3,go('vd'),()=>{const d=[...document.querySelectorAll('#t-lb .lbflt')].find(x=>x.querySelector('summary').textContent===f[0]);if(d)d.open=true;return d;}));
  LBK.forEach(k=>qAdd(QS.I,'Đa lớp và cân bằng tải · Băng tần',LBB[k].n,`${LBB[k].dx}, ${LBB[k].bw} MHz, vùng phủ, MAPL, bán kính cell, xuyên toà nhà${LBB[k].lo?', lớp phủ băng thấp':''}${LBB[k].dss?', DSS LTE/NR':''}`,2,go('cov',()=>{LBP.cov.sel=k;LBP.cov.on[k]=true;}),'#lbCovTb'));
  [['SUL n81 n83 UL bổ sung','supplementary uplink 700 900 n78 giới hạn đường lên UL-DL decoupling','cov'],['DSS 900 MHz','dynamic spectrum sharing LTE NR CRS rate matching n8 B8','cov'],['Ưu tiên chọn lại cell','cellReselectionPriority threshX-HighP threshX-LowP threshServingLowP s-NonIntraSearchP SIB4 RRCRelease T320 dedicated priority','idle'],
   ['IFLB MLB cân bằng tải','inter-frequency load balancing mobility load balancing A4 CIO Xn Resource Status Mobility Settings Change ping-pong','iflb'],['Cân bằng tải 5G-A','PCell SCell theo tải BWP RedCap CHO LTM split bearer NSA SA NWDAF RIC xApp traffic steering','adv'],['Mô phỏng nhiều lớp theo giờ','7 trạm 5 lớp tải PRB theo giờ UE kẹt băng thấp tốc độ biên','sim']].forEach(([n,x,v])=>qAdd(QS.I,'Đa lớp và cân bằng tải',n,x,2,go(v),'#lbBody'));};}
/* thẻ E2E: nút sang thẻ này */
const LBE2V={idle:'idle',ho:'iflb',data:'adv',reg:'cov'};
if(typeof e2Kpi==='function'){const _kl=e2Kpi;e2Kpi=function(){_kl.apply(this,arguments);if(!['g4','nsa','sa'].includes(S.e2R))return;const v=LBE2V[S.e2Sc];if(!v)return;const b=$('#e2Kpi .e2go');
  if(b&&!b.querySelector('[data-lbgo]'))b.insertAdjacentHTML('beforeend',`<button type="button" class="btn sm" data-lbgo="lb:${v}">Đa lớp và cân bằng tải · ${nE(LBV.find(x=>x[0]===v)[1])} →</button>`);};}
/* thẻ KPI: nút sang mục tương ứng */
const LBKV={lb_imb:'iflb',lb_low:'idle',lb_ho:'iflb',lb_edge:'sim',prb5:'sim',prbdl4:'sim',prbul4:'sim'};
if(typeof kpDetHtml==='function'){const _kl2=kpDetHtml;kpDetHtml=function(k){let h=_kl2.apply(this,arguments);if(k&&LBKV[k.id]){const v=LBKV[k.id];h+=`<p class="u3kpl"><button type="button" class="btn sm" data-lbgo="lb:${v}">Xem mô phỏng ở thẻ Đa lớp và cân bằng tải · ${nE(LBV.find(x=>x[0]===v)[1])} →</button></p>`;}return h;};}
/* thanh nút ở các thẻ liên quan */
const LBTABL={radio:[['cov','Vùng phủ 700/900'],['idle','Ưu tiên chọn lại cell'],['sim','7 trạm × 5 lớp']],ca:[['adv','Cân bằng tải 5G-A']],prb:[['iflb','IFLB/MLB theo tải PRB']],ro:[['cov','Vùng phủ băng thấp, SUL'],['iflb','Cân bằng tải']],nd:[['adv','Chia tải NSA/SA, CHO/LTM theo tải']],es:[['sim','Tải theo giờ nhiều lớp']]};
Object.keys(LBTABL).forEach(t=>{const f=RENDER[t];if(typeof f!=='function')return;RENDER[t]=function(){const r=f.apply(this,arguments);try{const sec=document.getElementById('t-'+t);if(sec&&!sec.querySelector('.lblkbar')){const h=`<div class="sclkbar lblkbar nogl"><span>Mô phỏng ở thẻ <b>Đa lớp tần số và cân bằng tải</b>:</span>${LBTABL[t].map(x=>`<button type="button" class="btn sm" data-lbgo="lb:${x[0]}">${nE(x[1])} →</button>`).join('')}</div>`;const ld=sec.querySelector('.lead');if(ld)ld.insertAdjacentHTML('afterend',h);else sec.insertAdjacentHTML('afterbegin',h);}}catch(e){}return r;};});
