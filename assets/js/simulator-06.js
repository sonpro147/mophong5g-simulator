
/* ===== Thẻ Mạng 3G UTRAN (u3) — đợt 12 ===== */
const U3={v:'arch',raf:0,last:0};
const U3V=[['arch','Kiến trúc và giao thức'],['phy','Lớp vật lý WCDMA'],['rrc','Trạng thái RRC'],['ho','Chuyển giao'],['hs','HSPA / HSPA+'],['vd','Tham số, KPI, lỗi']];
const U3R={};          /* mỗi mục: html(), after(), tick(dt), upd(k) */
const U3P={};          /* tham số điều khiển của từng mục */
const U3F={};          /* hàm hiển thị giá trị thanh trượt */
const uE=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const uF=(x,d)=>(Math.round(x*Math.pow(10,d||0))/Math.pow(10,d||0)).toFixed(d||0).replace('.',',');
const uClamp=(x,a,b)=>x<a?a:x>b?b:x;
const uRng=seed=>{let s=seed|0;return()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};};
const uGauss=r=>{let u=0,v=0;while(!u)u=r();while(!v)v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);};
const uDb=x=>10*Math.log10(Math.max(x,1e-30)),uLin=d=>Math.pow(10,d/10);
const uVn=()=>S.vendor||'3gpp';
const uVName=v=>({'3gpp':'3GPP',huawei:'Huawei',nokia:'Nokia',ericsson:'Ericsson'})[v]||v;
const uReduced=()=>!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
/* thanh trượt và ô chọn: thuộc tính data-u3i="mục:khoá" (không dùng data-k để tránh bộ xử lý chung) */
function uSl(vw,k,l,mn,mx,st,f,hint){U3F[vw+':'+k]=f;const v=U3P[vw][k];
  return `<label class="c"><span class="cl">${l}<output>${f(v)}</output></span><input type="range" data-u3i="${vw}:${k}" min="${mn}" max="${mx}" step="${st}" value="${v}">${hint?`<span class="u3ph">${hint}</span>`:''}</label>`;}
function uSel(vw,k,l,opts,hint){const v=U3P[vw][k];
  return `<label class="c"><span class="cl">${l}</span><select data-u3i="${vw}:${k}">${opts.map(o=>`<option value="${o[0]}"${String(o[0])===String(v)?' selected':''}>${uE(o[1])}</option>`).join('')}</select>${hint?`<span class="u3ph">${hint}</span>`:''}</label>`;}
function uChk(vw,k,l){return `<label class="u3ck"><input type="checkbox" data-u3i="${vw}:${k}"${U3P[vw][k]?' checked':''}> ${l}</label>`;}
/* tên tham số theo vendor đang chọn (lấy từ bảng tham số U3PAR theo khoá) */
function uPn(key){const r=(typeof U3PAR!=='undefined'?U3PAR:[]).find(x=>x[0]===key);if(!r)return'';const v=uVn();
  if(v==='3gpp')return '';
  return uVName(v)+': '+r[{huawei:3,nokia:4,ericsson:5}[v]];}
/* nút liên kết sang thẻ khác */
const U3LK={
  arch:{e2:['reg','data','mo','mt','sms','off'],kpi:['u_rrc','u_rabcs','u_rabps','u_cssr','lu3']},
  phy:{e2:['data','mo'],kpi:['u_rtwp','u_cong','u_avail','u_erl']},
  rrc:{e2:['data','mt','idle'],kpi:['u_rrc','u_rabps','u_psdrop','u_users']},
  ho:{e2:['ho','irat','idle'],kpi:['u_sho','u_iratho','u_csdrop','u_psdrop']},
  hs:{e2:['data'],kpi:['u_hsdpa','u_hsupa','u_users','u_cong']},
  vd:{e2:['reg','data','mo','mt','idle','ho','irat','chg','sms','roam','off'],kpi:[]}
};
function u3Links(){
  const L=U3LK[U3.v]||{e2:[],kpi:[]},hasE2=typeof E2S!=='undefined',hasK=typeof KL!=='undefined';
  const e2=hasE2?L.e2.map(id=>E2S.find(s=>s.id===id)).filter(s=>s&&s.f&&s.f.g3):[];
  const kp=hasK?L.kpi.map(id=>KL.find(k=>k.id===id)).filter(Boolean):[];
  return `<div class="panel u3lk"><h3>Xem tiếp ở thẻ khác</h3>
  ${e2.length?`<p class="e2x"><b>Luồng 3G ở thẻ Toàn trình E2E</b> (mở sẵn công nghệ 3G UMTS):</p><div class="e2go">${e2.map(s=>`<button type="button" class="btn sm" data-u3go="e2:${s.id}">${uE(s.n)} →</button>`).join('')}</div>`:''}
  ${kp.length?`<p class="e2x" style="margin-top:10px"><b>KPI 3G liên quan ở thẻ KPI mạng</b> (công thức, bộ đếm ba vendor, luồng đo):</p><div class="e2go">${kp.map(k=>`<button type="button" class="btn sm" data-u3go="kpi:${k.id}">${uE(k.nm)} →</button>`).join('')}</div>`:''}
  </div>`;
}
function u3Nav(){return `<div class="seg u3seg" role="group" aria-label="Mục của thẻ 3G">${U3V.map(v=>`<button type="button" data-u3v="${v[0]}" aria-pressed="${v[0]===U3.v}">${v[1]}</button>`).join('')}</div>`;}
function renderU3(){
  const nav=$('#u3Nav'),body=$('#u3Body');if(!nav||!body)return;
  if(!U3R[U3.v])U3.v='arch';
  nav.innerHTML=u3Nav();
  const V=U3R[U3.v];body.innerHTML=V.html()+u3Links();
  if(V.after)V.after();
  if(S.tab==='u3'&&!uReduced())u3Start();else{u3Stop();if(V.tick&&S.tab==='u3')V.tick(0);}
}
function u3Start(){if(U3.raf)return;U3.last=performance.now();U3.raf=requestAnimationFrame(u3Loop);}
function u3Stop(){if(U3.raf)cancelAnimationFrame(U3.raf);U3.raf=0;}
function u3Loop(now){
  U3.raf=0;if(S.tab!=='u3'){return;}
  if(document.hidden){U3.last=now;U3.raf=requestAnimationFrame(u3Loop);return;}
  const dt=Math.min(0.1,(now-U3.last)/1000);U3.last=now;
  const V=U3R[U3.v];if(V&&V.tick){try{V.tick(dt);}catch(e){console.error(e);}}
  U3.raf=requestAnimationFrame(u3Loop);
}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-u3go]');
  if(g){const [t,id]=g.dataset.u3go.split(':');
    try{tourStop();}catch(x){}try{stopSig();}catch(x){}
    if(t==='e2'){try{e2Stop();}catch(x){}S.e2Sc=id;S.e2R='g3';S.e2M=S.mode;if(typeof E2A!=='undefined'){E2A.key='';E2A.i=0;}S.tab='e2';renderAll();window.scrollTo({top:Math.min(window.scrollY,$('main').offsetTop-$('.bar').offsetHeight)});}
    else if(t==='kpi'){S.tab='kpi';KP.tech='all';KP.ly='all';KP.cat='all';KP.q='';KP.node='';KP.sel=id;kpSig='';renderAll();setTimeout(()=>{const d=$('#kpDet');if(d)d.scrollIntoView({block:'start',behavior:'smooth'});},60);}
    else if(t==='u3'){S.tab='u3';if(id)U3.v=id;renderAll();window.scrollTo({top:Math.min(window.scrollY,$('main').offsetTop-$('.bar').offsetHeight)});}
    return;}
  const t=e.target.closest('#t-u3 [data-u3v],#t-u3 [data-u3a]');if(!t)return;
  if(t.dataset.u3v){if(t.dataset.u3v===U3.v)return;U3.v=t.dataset.u3v;u3Stop();renderU3();return;}
  const [vw,a]=t.dataset.u3a.split(':');const V=U3R[vw];if(V&&V.act)V.act(a,t);
});
function u3Inp(el){const [vw,k]=el.dataset.u3i.split(':');const P=U3P[vw];if(!P)return;
  P[k]=el.type==='checkbox'?el.checked:(el.tagName==='SELECT'&&isNaN(+el.value)?el.value:+el.value);
  const o=el.parentElement.querySelector('output');if(o&&U3F[vw+':'+k])o.textContent=U3F[vw+':'+k](P[k]);
  const V=U3R[vw];if(V&&V.upd)V.upd(k);}
document.addEventListener('input',e=>{const el=e.target;if(!el.dataset||!el.dataset.u3i||el.type!=='range')return;u3Inp(el);});
document.addEventListener('change',e=>{const el=e.target;if(!el.dataset||!el.dataset.u3i||el.type==='range')return;u3Inp(el);});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest&&e.target.closest('#t-u3 [data-u3a]')&&e.target.tagName!=='BUTTON'){e.preventDefault();e.target.closest('[data-u3a]').dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
/* khung đồ thị đường SVG dùng chung */
function uPlot(o){/* o:{w,h,x0,x1,y0,y1,series:[{pts:[[x,y]],c,dash,w}],yl,xl,grid,ylab,xlab,marks,hl} */
  const W=o.w||640,H=o.h||200,L=o.pl||44,R=10,T=10,B=o.pb||26,iw=W-L-R,ih=H-T-B;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*iw,Y=y=>T+(1-(uClamp(y,o.y0,o.y1)-o.y0)/(o.y1-o.y0))*ih;
  let s=`<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="${uE(o.aria||'Đồ thị')}">`;
  s+=`<rect x="${L}" y="${T}" width="${iw}" height="${ih}" class="u3pbg"/>`;
  (o.yt||[]).forEach(v=>{s+=`<line x1="${L}" x2="${L+iw}" y1="${Y(v)}" y2="${Y(v)}" class="u3grid"/><text x="${L-5}" y="${Y(v)+4}" class="u3ax" text-anchor="end">${uF(v,o.yd||0)}</text>`;});
  (o.xt||[]).forEach(v=>{s+=`<text x="${X(v)}" y="${H-8}" class="u3ax" text-anchor="middle">${o.xf?o.xf(v):uF(v)}</text>`;});
  (o.bands||[]).forEach(b=>{s+=`<rect x="${X(b[0])}" y="${T}" width="${Math.max(0,X(b[1])-X(b[0]))}" height="${ih}" style="fill:${b[2]};opacity:${b[3]||.12}"/>`;});
  (o.hl||[]).forEach(h=>{s+=`<line x1="${L}" x2="${L+iw}" y1="${Y(h[0])}" y2="${Y(h[0])}" style="stroke:${h[1]};stroke-dasharray:5 4;stroke-width:1.3"/>${h[2]?`<text x="${L+iw-4}" y="${Y(h[0])-4}" class="u3ax" text-anchor="end" style="fill:${h[1]}">${uE(h[2])}</text>`:''}`;});
  (o.series||[]).forEach(sr=>{if(!sr.pts.length)return;let d='';sr.pts.forEach((p,i)=>{if(p==null){return;}d+=(i&&sr.pts[i-1]!=null?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1);});
    s+=`<path d="${d}" style="fill:none;stroke:${sr.c};stroke-width:${sr.w||1.8};${sr.dash?'stroke-dasharray:'+sr.dash+';':''}${sr.op?'opacity:'+sr.op:''}"/>`;});
  (o.marks||[]).forEach(m=>{const x=X(m[0]);s+=`<line x1="${x}" x2="${x}" y1="${T}" y2="${T+ih}" style="stroke:${m[2]||'var(--muted)'};stroke-width:1;stroke-dasharray:2 3"/><text x="${x+2}" y="${T+10+(m[3]||0)*11}" class="u3ev" style="fill:${m[2]||'var(--ink)'}">${uE(m[1])}</text>`;});
  if(o.cur!=null){const x=X(o.cur);s+=`<line x1="${x}" x2="${x}" y1="${T}" y2="${T+ih}" class="u3cur"/>`;}
  if(o.ylab)s+=`<text x="12" y="${T+ih/2}" class="u3ax" transform="rotate(-90 12 ${T+ih/2})" text-anchor="middle">${uE(o.ylab)}</text>`;
  if(o.xlab)s+=`<text x="${L+iw}" y="${H-8}" class="u3ax" text-anchor="end">${uE(o.xlab)}</text>`;
  return s+(o.extra||'')+'</svg>';
}
function uLeg(items){return `<p class="legend">${items.map(i=>`<span><i style="background:${i[1]}"></i>${uE(i[0])}</span>`).join('')}</p>`;}

/* ---------- Mục 1: Kiến trúc UTRAN và lõi 3G, giao diện, ngăn xếp giao thức ---------- */
const U3N={
 ue:{x:70,y:255,l:'UE',k:'ue',d:'Máy đầu cuối 3G (USIM + ME). Đo CPICH Ec/Io, RSCP; gửi báo cáo đo; điều khiển công suất phát 1500 lần/giây theo lệnh TPC; kết hợp tín hiệu nhiều cell khi chuyển giao mềm bằng bộ thu RAKE.',f:['Lớp vật lý WCDMA: trải phổ, giải trải phổ bằng RAKE, đo đạc','MAC, RLC, PDCP, RRC đầu UE; NAS (MM, CC, GMM, SM)','USIM chứa IMSI, khoá K, thuật toán Milenage cho AKA']},
 nb1:{x:240,y:120,l:'NodeB 1',k:'nb',d:'Trạm gốc WCDMA: xử lý lớp vật lý (mã hoá kênh, trải phổ, điều chế, đo đạc), điều khiển công suất vòng trong, kết hợp softer HO giữa các sector của chính nó. Từ Rel-5/6 có thêm MAC-hs (lập lịch HSDPA, HARQ) và MAC-e (lập lịch HSUPA).',f:['Lớp vật lý, inner loop power control, đo RTWP, SIR','MAC-hs/ehs: lập lịch HSDPA mỗi 2 ms, HARQ, chọn TBS theo CQI','MAC-e: lập lịch HSUPA, gửi E-AGCH/E-RGCH, HARQ E-HICH','Tài nguyên phần cứng: Channel Element (CE), công suất PA, cổng Iub'],v:{huawei:'BTS3900/DBS3900 (WCDMA), sau là BTS5900 multi-mode',nokia:'Flexi Multiradio BTS, AirScale',ericsson:'RBS 3000/6000, Baseband 5216/6630 (multi-standard)'}},
 nb2:{x:240,y:255,l:'NodeB 2',k:'nb',d:'Trạm gốc thứ hai cùng RNC 1. Khi UE ở biên giữa NodeB 1 và NodeB 2, RNC 1 thêm cell của NodeB 2 vào active set (soft HO); tín hiệu đường lên được RNC chọn khung tốt hơn (selection combining), đường xuống UE kết hợp RAKE.',f:['Như NodeB 1','Soft HO giữa hai NodeB: kết hợp ở RNC (đường lên) và ở UE (đường xuống)']},
 nb3:{x:240,y:400,l:'NodeB 3',k:'nb',d:'Trạm gốc thuộc RNC 2. Khi UE còn do RNC 1 phục vụ mà thêm cell của NodeB 3, đường truyền đi NodeB 3 → RNC 2 → Iur → RNC 1. RNC 2 đóng vai DRNC.',f:['Như NodeB 1','Cell của DRNC: tài nguyên do DRNC cấp, dữ liệu chuyển tiếp qua Iur']},
 rnc1:{x:440,y:185,l:'RNC 1 (SRNC)',k:'rnc',d:'Bộ điều khiển mạng vô tuyến. Với một UE cụ thể, RNC giữ kết nối Iu và RRC của UE gọi là SRNC (Serving RNC). Còn RNC quản lý cell và tài nguyên của NodeB gọi là CRNC (Controlling RNC).',f:['RRC: thiết lập, cấu hình lại, giải phóng kết nối; quản lý trạng thái CELL_DCH/FACH/PCH/URA_PCH','Quản lý tài nguyên vô tuyến: điều khiển nhận (admission), tải (LDR/OLC), cấp mã OVSF, chọn tốc độ','Chuyển giao mềm/cứng/IRAT, quyết định active set, compressed mode','Điều khiển công suất vòng ngoài (đặt SIR target theo BLER)','Mã hoá (f8) và toàn vẹn (f9) ở RNC, không ở NodeB','MAC-d, RLC, PDCP, kết hợp macro diversity (selection combining)'],v:{huawei:'BSC6900, BSC6910 (RNC/BSC chung)',nokia:'RNC2600, mcRNC, Flexi Direct RNC (RNC tích hợp trong trạm)',ericsson:'RNC 3820, Evo Controller 8200/RNC'}},
 rnc2:{x:440,y:400,l:'RNC 2 (DRNC)',k:'rnc',d:'DRNC (Drift RNC): RNC khác SRNC nhưng đang cấp tài nguyên vô tuyến cho UE qua cell của mình. DRNC chỉ chuyển tiếp dữ liệu qua Iur; RRC vẫn kết thúc ở SRNC. Khi mọi cell trong active set thuộc DRNC, mạng có thể chuyển vai SRNC sang RNC 2 (SRNS relocation) để giải phóng Iur.',f:['CRNC của NodeB 3','Cấp kênh vô tuyến theo yêu cầu RNSAP Radio Link Setup từ SRNC','Đích của SRNS relocation']},
 msc:{x:660,y:62,l:'MSC Server / VLR',k:'cs',d:'Điều khiển cuộc gọi miền chuyển mạch kênh (CS). Từ Rel-4 tách thành MSC Server (điều khiển) và MGW (xử lý luồng thoại). VLR lưu bản sao hồ sơ thuê bao đang ở vùng phục vụ.',f:['MM: cập nhật vị trí (LAU), xác thực, TMSI','CC: thiết lập, giải phóng cuộc gọi; SMS CS','Điều khiển MGW qua Mc (H.248)','RANAP với RNC: RAB Assignment, Relocation, Paging'],v:{huawei:'MSOFTX3000 (MSC Server), UMG8900 (MGW)',nokia:'MSC Server (MSS), Open MGW',ericsson:'MSC-S Blade Cluster, M-MGw'}},
 mgw:{x:660,y:185,l:'MGW',k:'cs',d:'Media Gateway: kết thúc luồng thoại Iu-CS (Iu-UP), chuyển mã AMR ↔ G.711 khi cần, nối sang PSTN/mạng khác hoặc MGW khác qua Nb.',f:['Iu-UP chế độ hỗ trợ (support mode) cho AMR','Chuyển mã, khử vọng, TrFO/TFO','Do MSC Server điều khiển qua Mc']},
 sgsn:{x:660,y:330,l:'SGSN',k:'ps',d:'Nút phục vụ miền chuyển mạch gói (PS): quản lý di động gói (GMM: attach, RAU), phiên (SM: PDP context), chuyển tiếp dữ liệu giữa RNC và GGSN.',f:['GMM: attach, RAU, xác thực, P-TMSI','SM: kích hoạt PDP context, QoS','Iu-PS: RANAP, GTP-U tới RNC (hoặc Direct Tunnel RNC–GGSN)','Ghi cước (S-CDR)'],v:{huawei:'USN9810 (SGSN/MME)',nokia:'Flexi NS (SGSN/MME)',ericsson:'SGSN-MME'}},
 hlr:{x:870,y:200,l:'HLR / AuC',k:'db',d:'Cơ sở dữ liệu thuê bao chính (HLR) và trung tâm xác thực (AuC). AuC sinh bộ vector xác thực 3G (RAND, XRES, CK, IK, AUTN) cho VLR/SGSN.',f:['Hồ sơ thuê bao: dịch vụ, APN, QoS, roaming','Vị trí: VLR/SGSN đang phục vụ','AuC: Milenage, số thứ tự SQN'],v:{huawei:'HLR9820, sau là UDM/HSS hội tụ',nokia:'Nokia HLR/HSS (NetAct quản lý), sau là One-NDS',ericsson:'HLR-FE, CUDB (dữ liệu tách lớp)'}},
 ggsn:{x:870,y:400,l:'GGSN',k:'ps',d:'Cổng ra mạng dữ liệu ngoài (Internet, APN doanh nghiệp). Cấp địa chỉ IP, áp chính sách, tính cước trực tuyến qua Gy.',f:['Neo phiên PDP, cấp IP','Gi tới mạng ngoài (RADIUS/DHCP)','Gy (OCS), Gx (PCRF) ở các bản sau'],v:{huawei:'UGW9811',nokia:'Flexi ISN',ericsson:'GGSN-MPG, sau là EPG'}},
 pstn:{x:970,y:62,l:'PSTN / mạng khác',k:'ext',d:'Mạng điện thoại cố định hoặc mạng di động khác. Nối từ MGW qua TDM (E1 SS7/ISUP) hoặc SIP-I/BICC.',f:['Báo hiệu ISUP/BICC/SIP-I','Luồng thoại G.711 TDM hoặc IP']},
 inet:{x:970,y:470,l:'Internet / APN',k:'ext',d:'Mạng dữ liệu ngoài theo APN.',f:['Máy chủ ứng dụng','DNS, RADIUS']}
};
const U3L=[
 ['uu1','ue','nb1','Uu','b'],['uu2','ue','nb2','Uu','b'],['uu3','ue','nb3','Uu','b',1],
 ['iub1','nb1','rnc1','Iub','b'],['iub2','nb2','rnc1','Iub','b'],['iub3','nb3','rnc2','Iub','b'],
 ['iur','rnc1','rnc2','Iur','b'],
 ['iucs','rnc1','msc','Iu-CS','c'],['iucsu','rnc1','mgw','Iu-CS','u'],['iups','rnc1','sgsn','Iu-PS','b'],
 ['iucs2','rnc2','mgw','Iu-CS','b',1],['iups2','rnc2','sgsn','Iu-PS','b',1],
 ['mc','msc','mgw','Mc','c'],['d','msc','hlr','D','c'],['gr','sgsn','hlr','Gr','c'],['gs','msc','sgsn','Gs','c',1],
 ['gn','sgsn','ggsn','Gn','b'],['gi','ggsn','inet','Gi','b'],['nb','mgw','pstn','Nb / PSTN','u']
];
/* giao diện: hai đầu, ngăn xếp mặt phẳng điều khiển (cp) và người dùng (up) theo IP, bản ATM, tài liệu, bản tin ví dụ */
const U3I={
 'Uu':{e:'UE – NodeB (lớp vật lý), UE – RNC (MAC, RLC, PDCP, RRC)',cp:['RRC','RLC (AM/UM)','MAC','WCDMA PHY'],up:['PDCP (chỉ PS)','RLC (TM cho thoại AMR, AM/UM cho PS)','MAC-d / MAC-hs / MAC-e','WCDMA PHY'],atm:'Không áp dụng (giao diện vô tuyến)',sp:'TS 25.2xx (PHY), 25.321 (MAC), 25.322 (RLC), 25.323 (PDCP), 25.331 (RRC)',d:'Giao diện vô tuyến WCDMA FDD, băng thông 5 MHz, tốc độ chip 3,84 Mcps. Mỗi UE phân biệt bằng mã scrambling đường lên; mỗi cell bằng một trong 512 mã scrambling chính đường xuống.',m:['RRC Connection Request / Setup / Setup Complete','Measurement Report (e1a, e2d, e4a…)','Active Set Update / Complete','Radio Bearer Setup / Reconfiguration','Cell Update / Cell Update Confirm']},
 'Iub':{e:'NodeB – RNC',cp:['NBAP','SCTP','IP','Ethernet / L2'],up:['Iub FP (DCH, HS-DSCH, E-DCH, RACH/FACH/PCH FP)','UDP','IP','Ethernet / L2'],atm:'Điều khiển: NBAP / SSCF-UNI / SSCOP / AAL5 / ATM. Người dùng: FP / AAL2 / ATM, thiết lập kênh AAL2 bằng ALCAP (Q.2630.2).',sp:'TS 25.433 (NBAP), 25.427 (DCH FP), 25.435 (FP kênh chung, HS-DSCH, E-DCH), 25.426 (truyền tải)',d:'NBAP chia hai phần: common NBAP (cấu hình cell, tạo liên kết vô tuyến đầu tiên, đo chung) và dedicated NBAP (điều khiển từng liên kết vô tuyến của UE). FP chở khung dữ liệu kênh truyền tải kèm CRC, chỉ thị chất lượng, đồng bộ khung.',m:['NBAP Radio Link Setup Request / Response','NBAP Radio Link Reconfiguration Prepare / Ready / Commit','NBAP Cell Setup, Common Transport Channel Setup','NBAP Dedicated Measurement Report','HS-DSCH Capacity Request / Allocation (FP điều khiển luồng)']},
 'Iur':{e:'RNC – RNC (SRNC – DRNC)',cp:['RNSAP','SCCP','M3UA','SCTP','IP'],up:['Iur FP (DCH FP, HS-DSCH FP)','UDP','IP'],atm:'Điều khiển: RNSAP / SCCP / MTP3-B / SSCF-NNI / SSCOP / AAL5. Người dùng: FP / AAL2 + ALCAP.',sp:'TS 25.423 (RNSAP), 25.424–25.427',d:'Cho phép chuyển giao mềm qua biên RNC mà không phải relocation ngay. Bốn nhóm thủ tục RNSAP: di động cơ bản, kênh riêng (DCH), kênh chung, đo toàn cục.',m:['RNSAP Radio Link Setup / Addition / Deletion','RNSAP Uplink Signalling Transfer (khi UE ở FACH cell DRNC)','RNSAP Relocation Commit','RNSAP Common Measurement']},
 'Iu-CS':{e:'RNC – MSC Server (điều khiển) / MGW (người dùng)',cp:['RANAP','SCCP','M3UA','SCTP','IP'],up:['Iu-UP (chế độ hỗ trợ cho AMR)','RTP / RTCP','UDP','IP'],atm:'Điều khiển: RANAP / SCCP / MTP3-B / SSCF-NNI / SSCOP / AAL5. Người dùng: Iu-UP / AAL2 + ALCAP.',sp:'TS 25.413 (RANAP), 25.415 (Iu-UP), 25.414',d:'RANAP chở bản tin NAS (MM, CC, SMS) trong Initial UE Message / Direct Transfer, thiết lập RAB thoại (RAB Assignment), relocation, paging. Iu-UP chở khung AMR với các RAB sub-flow combination.',m:['Initial UE Message (CM Service Request, LU Request)','Direct Transfer (Setup, Alerting, Connect)','Security Mode Command','RAB Assignment Request / Response','Iu Release Command / Complete','Relocation Required / Command']},
 'Iu-PS':{e:'RNC – SGSN (hoặc RNC – GGSN khi Direct Tunnel)',cp:['RANAP','SCCP','M3UA','SCTP','IP'],up:['GTP-U (Iu-UP ở chế độ trong suốt)','UDP','IP'],atm:'Điều khiển: RANAP / SCCP / MTP3-B / SSCF-NNI / SSCOP / AAL5. Người dùng: GTP-U / UDP / IP / AAL5 / ATM.',sp:'TS 25.413, 25.414, 29.060 (GTP)',d:'Giống Iu-CS ở mặt điều khiển, nhưng mặt người dùng là đường hầm GTP-U theo từng RAB. Với Direct Tunnel (Rel-7), GTP-U đi thẳng RNC – GGSN, SGSN chỉ giữ báo hiệu.',m:['Initial UE Message (Attach, RAU, Service Request)','RAB Assignment Request (TEID, QoS)','Relocation Request / Ack','Iu Release']},
 'Gn':{e:'SGSN – GGSN (và SGSN – SGSN)',cp:['GTP-C v1','UDP','IP'],up:['GTP-U v1','UDP','IP'],atm:'Thường là IP/Ethernet',sp:'TS 29.060',d:'Lập, sửa, xoá PDP context; chở dữ liệu người dùng trong đường hầm GTP-U (mỗi chiều một TEID). Giữa hai PLMN gọi là Gp (qua GRX).',m:['Create PDP Context Request / Response','Update PDP Context','Delete PDP Context','Echo Request / Response']},
 'Gi':{e:'GGSN – mạng dữ liệu ngoài',cp:['RADIUS / Diameter (xác thực, cấp IP)','UDP / TCP','IP'],up:['IP người dùng','L2'],atm:'—',sp:'TS 29.061',d:'Điểm ra Internet hoặc APN doanh nghiệp. GGSN có thể xác thực qua RADIUS, cấp IP qua DHCP, NAT ở tường lửa phía sau.',m:['RADIUS Access-Request / Accept','Accounting Start / Stop']},
 'Gr':{e:'SGSN – HLR',cp:['MAP','TCAP','SCCP','M3UA / MTP3','SCTP / MTP2'],up:[],atm:'SS7 TDM hoặc SIGTRAN',sp:'TS 29.002 (MAP)',d:'SGSN lấy vector xác thực và hồ sơ thuê bao PS, báo vị trí.',m:['MAP Send Authentication Info','MAP Update GPRS Location','MAP Insert Subscriber Data','MAP Cancel Location']},
 'D':{e:'VLR (MSC Server) – HLR',cp:['MAP','TCAP','SCCP','M3UA / MTP3','SCTP / MTP2'],up:[],atm:'SS7 TDM hoặc SIGTRAN',sp:'TS 29.002',d:'Cập nhật vị trí CS, lấy vector xác thực, hồ sơ thuê bao, xử lý cuộc gọi đến (Provide Roaming Number).',m:['MAP Update Location','MAP Send Authentication Info','MAP Insert Subscriber Data','MAP Provide Roaming Number']},
 'Mc':{e:'MSC Server – MGW',cp:['H.248 (MEGACO)','SCTP','IP'],up:[],atm:'—',sp:'TS 29.232',d:'MSC Server điều khiển MGW: tạo/nối termination, chọn codec.',m:['H.248 Add / Modify / Subtract']},
 'Gs':{e:'MSC/VLR – SGSN (tuỳ chọn)',cp:['BSSAP+','SCCP','M3UA','SCTP','IP'],up:[],atm:'—',sp:'TS 29.016, 29.018',d:'Phối hợp cập nhật vị trí CS/PS (combined attach/RAU, Network Mode of Operation I) và tìm gọi CS qua SGSN.',m:['BSSAP+ Location Update Request','BSSAP+ Paging Request']},
 'Nb / PSTN':{e:'MGW – MGW khác hoặc PSTN',cp:['(Báo hiệu ở Nc: BICC / SIP-I; với PSTN: ISUP)'],up:['RTP / UDP / IP hoặc TDM G.711'],atm:'AAL2 cho Nb kiểu cũ',sp:'TS 29.414, 29.415',d:'Mang luồng thoại giữa các MGW hoặc ra PSTN.',m:['ISUP IAM / ACM / ANM / REL','SIP-I INVITE']}
};
/* giao thức: nơi kết thúc và chức năng */
const U3PR=[
 ['NAS (MM/CC/GMM/SM)',0,3,'nas','Báo hiệu không truy nhập giữa UE và lõi: MM, CC (CS); GMM, SM (PS). RNC chỉ chuyển tiếp trong bản tin RRC Direct Transfer và RANAP Direct Transfer.'],
 ['RRC',0,2,'cp','Điều khiển kết nối vô tuyến (TS 25.331): thiết lập/giải phóng kết nối, cấu hình RB, đo đạc, chuyển giao, quản lý trạng thái, bảo mật lớp AS. Kết thúc ở SRNC.'],
 ['PDCP',0,2,'up','Nén header IP (RFC 2507, ROHC RFC 3095), chỉ cho dữ liệu PS. Kết thúc ở SRNC.'],
 ['BMC',0,2,'up','Broadcast/Multicast Control: tin nhắn cell broadcast (CBS) trên CTCH.'],
 ['RLC (TM/UM/AM)',0,2,'b','Phân đoạn, ghép, phát lại ARQ (chế độ AM), đánh số thứ tự. TM cho thoại AMR, UM cho dịch vụ thời gian thực, AM cho báo hiệu và dữ liệu cần tin cậy. Mã hoá f8 với RLC UM/AM thực hiện ở đây; với TM ở MAC-d.'],
 ['MAC-d',0,2,'b','MAC cho kênh riêng (DCH): chọn định dạng truyền tải (TFC), ghép kênh logic lên kênh truyền tải. Ở SRNC.'],
 ['MAC-c/sh',0,2,'b','MAC cho kênh chung (RACH, FACH, PCH) ở CRNC: lập lịch FACH, xử lý truy nhập ngẫu nhiên.'],
 ['MAC-hs / MAC-ehs',0,1,'b','MAC HSDPA ở NodeB: lập lịch mỗi 2 ms, HARQ, chọn TBS và điều chế theo CQI, điều khiển luồng Iub. MAC-ehs (Rel-7) cho phép RLC kích thước linh hoạt và phân đoạn ở MAC.'],
 ['MAC-e / MAC-es',0,1,'b','HSUPA: MAC-e ở NodeB (lập lịch, HARQ, E-AGCH/E-RGCH); MAC-es ở SRNC (sắp xếp lại thứ tự, kết hợp macro diversity giữa nhiều NodeB).'],
 ['WCDMA PHY',0,1,'b','Mã hoá kênh (turbo/convolutional), ghép xen, khớp tốc độ, trải phổ OVSF, scrambling, điều chế QPSK/16QAM/64QAM, đo đạc, điều khiển công suất vòng trong.'],
 ['Iub FP',1,2,'tp','Frame Protocol: khung dữ liệu kênh truyền tải giữa NodeB và RNC kèm CRCI, QE, CFN; điều khiển luồng HS-DSCH (Capacity Request / Allocation).'],
 ['NBAP',1,2,'cp','NodeB Application Part (TS 25.433): cấu hình cell, tạo/sửa/xoá liên kết vô tuyến, đo chung và riêng, cấu hình HSDPA/HSUPA.'],
 ['ALCAP',1,2,'tp','Access Link Control Application Part (Q.2630.2): thiết lập kênh AAL2 trên Iub/Iur/Iu-CS khi truyền tải ATM. Không dùng khi truyền tải IP.'],
 ['RNSAP',2,2,'cp','RNC – RNC (TS 25.423): soft HO qua Iur, relocation commit, chuyển tiếp báo hiệu kênh chung, đo chung.'],
 ['RANAP',2,3,'cp','RNC – lõi (TS 25.413): RAB, Direct Transfer, Security Mode, Paging, Relocation, Iu Release.'],
 ['Iu-UP',2,3,'up','Iu User Plane (TS 25.415): chế độ hỗ trợ cho thoại AMR (khởi tạo, điều khiển tốc độ, khung có số thứ tự); chế độ trong suốt cho PS.'],
 ['GTP-U',2,3,'up','Đường hầm dữ liệu PS trên Iu-PS, Gn (TEID mỗi chiều).']
];
U3P.arch={flow:'cs',spd:1,play:1};
const U3FL={
 cs:{n:'Cuộc gọi thoại CS (AMR 12,2 kbps)',st:[
  ['uu1','ue>nb1','c','RRC Connection Request','PRACH / RACH, nguyên nhân Originating Conversational Call'],
  ['iub1','nb1>rnc1','c','RACH FP → RRC tới RNC','RNC quyết định trạng thái CELL_DCH, cấp mã OVSF, gửi NBAP Radio Link Setup'],
  ['iub1','rnc1>nb1','c','NBAP Radio Link Setup Request','RNC yêu cầu NodeB lập liên kết vô tuyến riêng (DPCH)'],
  ['uu1','nb1>ue','c','RRC Connection Setup (trên FACH)','UE chuyển sang CELL_DCH, đồng bộ DPCH, gửi Setup Complete'],
  ['iucs','rnc1>msc','c','RANAP Initial UE Message: CM Service Request','NAS qua RNC tới MSC Server'],
  ['d','msc>hlr','c','MAP Send Authentication Info (nếu VLR hết vector)','AuC sinh RAND, XRES, CK, IK, AUTN'],
  ['iucs','msc>rnc1','c','Authentication, Security Mode Command','RNC bật mã hoá f8, toàn vẹn f9 với UE'],
  ['iucs','msc>rnc1','c','RAB Assignment Request (thoại)','RNC lập RB AMR: RLC TM, SF128 đường xuống'],
  ['mc','msc>mgw','c','H.248 Add (termination Iu)','MSC Server nối luồng tại MGW'],
  ['uu1','ue>nb1','u','Thoại AMR trên DCH','DPDCH 12,2 kbps, TTI 20 ms, điều khiển công suất 1500 Hz'],
  ['iub1','nb1>rnc1','u','Iub DCH FP','Khung FP mỗi 20 ms, kèm CRCI và QE cho kết hợp macro diversity'],
  ['iucsu','rnc1>mgw','u','Iu-UP (support mode) / RTP','Khung AMR có số thứ tự'],
  ['nb','mgw>pstn','u','G.711 TDM hoặc RTP qua Nb','Chuyển mã AMR ↔ G.711 nếu bên kia là PSTN']]},
 ps:{n:'Dữ liệu PS qua HSDPA',st:[
  ['uu1','ue>nb1','c','RRC Connection Request','Nguyên nhân Originating Interactive/Background'],
  ['iups','rnc1>sgsn','c','RANAP Initial UE Message: Service Request','Hoặc Activate PDP Context Request nếu chưa có PDP'],
  ['gn','sgsn>ggsn','c','GTP-C Create PDP Context Request','APN, QoS, IMSI, MSISDN'],
  ['gi','ggsn>inet','c','RADIUS / DHCP (tuỳ APN)','GGSN cấp IP cho UE'],
  ['gn','ggsn>sgsn','c','Create PDP Context Response','TEID GGSN, địa chỉ IP'],
  ['iups','sgsn>rnc1','c','RAB Assignment Request (PS)','TEID SGSN, QoS: interactive, MBR'],
  ['iub1','rnc1>nb1','c','NBAP Radio Link Reconfiguration (HS-DSCH)','Cấu hình MAC-hs, HS-SCCH, serving cell'],
  ['gi','inet>ggsn','u','Gói IP xuống từ Internet','Ví dụ trang web'],
  ['gn','ggsn>sgsn','u','GTP-U trên Gn','Đường hầm TEID'],
  ['iups','sgsn>rnc1','u','GTP-U trên Iu-PS','RNC: PDCP nén header, RLC AM phân đoạn'],
  ['iub1','rnc1>nb1','u','HS-DSCH FP','Điều khiển luồng theo Capacity Allocation của NodeB'],
  ['uu1','nb1>ue','u','HS-PDSCH (2 ms, QPSK/16QAM/64QAM)','MAC-hs lập lịch theo CQI, HARQ ACK/NACK trên HS-DPCCH']]},
 att:{n:'Bật máy: đăng ký CS và PS',st:[
  ['uu1','ue>nb1','c','RRC Connection Request (Registration)','UE đọc SIB trên P-CCPCH trước đó'],
  ['iups','rnc1>sgsn','c','Initial UE Message: Attach Request','Combined attach nếu NMO I (qua Gs)'],
  ['gr','sgsn>hlr','c','MAP Send Authentication Info','Lấy vector xác thực 3G'],
  ['iups','sgsn>rnc1','c','Authentication and Ciphering Request','UE kiểm tra AUTN, trả RES'],
  ['gr','sgsn>hlr','c','MAP Update GPRS Location','HLR gửi Insert Subscriber Data (hồ sơ PS)'],
  ['iups','sgsn>rnc1','c','Attach Accept (P-TMSI)','UE gửi Attach Complete'],
  ['iucs','rnc1>msc','c','Initial UE Message: Location Updating Request','Nếu không combined: LAU riêng tới VLR'],
  ['d','msc>hlr','c','MAP Update Location','HLR gửi Insert Subscriber Data, huỷ VLR cũ'],
  ['iucs','msc>rnc1','c','Location Updating Accept (TMSI)','Sau đó Iu Release, RRC Connection Release']]},
 sho:{n:'Chuyển giao mềm qua Iur (SRNC – DRNC)',st:[
  ['uu1','ue>nb1','c','Measurement Report e1A (cell NodeB 3)','Cell mới nằm trong reporting range so với cell tốt nhất'],
  ['iur','rnc1>rnc2','c','RNSAP Radio Link Setup Request','SRNC xin DRNC cấp liên kết vô tuyến trên cell của NodeB 3'],
  ['iub3','rnc2>nb3','c','NBAP Radio Link Setup Request','DRNC (là CRNC của NodeB 3) cấp mã OVSF, CE'],
  ['uu1','nb1>ue','c','Active Set Update (thêm cell NodeB 3)','UE trả Active Set Update Complete'],
  ['uu3','ue>nb3','u','Đường lên tới NodeB 3','UE phát một tín hiệu; cả hai NodeB cùng thu'],
  ['iub3','nb3>rnc2','u','Iub DCH FP','Khung FP kèm chỉ thị chất lượng QE/CRCI'],
  ['iur','rnc2>rnc1','u','Iur DCH FP','DRNC chuyển tiếp; SRNC chọn khung tốt nhất (selection combining)'],
  ['uu1','ue>nb1','u','Đường lên tới NodeB 1','Nhánh thứ hai của macro diversity'],
  ['iucsu','rnc1>mgw','u','Iu-UP tới MGW','Chỉ SRNC giữ Iu; lõi không biết có Iur']]},
 srns:{n:'SRNS relocation (chuyển vai SRNC)',st:[
  ['iups','rnc1>sgsn','c','RANAP Relocation Required','Mọi cell trong active set thuộc DRNC; SRNC đề nghị chuyển vai'],
  ['iups2','sgsn>rnc2','c','RANAP Relocation Request','Lõi yêu cầu RNC 2 chuẩn bị Iu cho UE'],
  ['iups2','rnc2>sgsn','c','Relocation Request Acknowledge','RNC 2 sẵn sàng (TEID mới)'],
  ['iups','sgsn>rnc1','c','RANAP Relocation Command','Cho phép thực hiện'],
  ['iur','rnc1>rnc2','c','RNSAP Relocation Commit','UE không phải đổi kênh vô tuyến (UE không tham gia)'],
  ['iups2','rnc2>sgsn','c','Relocation Detect, Relocation Complete','RNC 2 thành SRNC mới'],
  ['uu3','nb3>ue','c','UTRAN Mobility Information (U-RNTI mới)','UE trả UTRAN Mobility Information Confirm'],
  ['iups','sgsn>rnc1','c','Iu Release Command','Giải phóng Iu cũ và đường Iur']]}
};
const U3A={i:0,t:0,sel:null};
function u3ArchSvg(){
  const fl=U3FL[U3P.arch.flow],st=fl.st[U3A.i]||fl.st[0],cur=st[0];
  const used=new Set(fl.st.map(s=>s[0]));
  let s=`<svg viewBox="0 0 1040 520" class="u3svg u3arch" role="img" aria-label="Kiến trúc UTRAN và lõi 3G">`;
  s+=`<rect x="160" y="22" width="355" height="476" rx="12" class="u3zone"/><text x="172" y="42" class="u3zt">UTRAN</text><rect x="585" y="22" width="445" height="476" rx="12" class="u3zone"/><text x="597" y="42" class="u3zt">Lõi 3G: miền CS (trên), miền PS (dưới)</text>`;
  for(const L of U3L){const a=U3N[L[1]],b=U3N[L[2]],on=L[0]===cur,ln=used.has(L[0]);
    const cl=L[4]==='c'?'var(--cp)':L[4]==='u'?'var(--up)':'var(--muted)';
    s+=`<g data-u3a="arch:if:${L[3]}" class="u3lnk" tabindex="0" role="button" aria-label="Giao diện ${uE(L[3])}"><line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="u3hitln"/><line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" style="stroke:${on?'var(--ink)':cl};stroke-width:${on?3.4:1.6};${L[5]?'stroke-dasharray:6 5;':''}opacity:${ln||on?1:.55}"/>`;
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;s+=`<text x="${mx}" y="${my-5}" class="e2if" text-anchor="middle">${uE(L[3])}</text></g>`;}
  for(const id in U3N){const n=U3N[id],w=id==='ue'?54:n.l.length*7.4+18,h=34,on=U3A.sel===id;
    const fill={ue:'var(--k1)',nb:'var(--u1)',rnc:'var(--u5)',cs:'var(--u4)',ps:'var(--u2)',db:'var(--u6)',ext:'var(--muted)'}[n.k];
    s+=`<g data-u3a="arch:node:${id}" class="u3nd" tabindex="0" role="button" aria-label="${uE(n.l)}"><rect x="${n.x-w/2}" y="${n.y-h/2}" width="${w}" height="${h}" rx="8" style="fill:var(--panel);stroke:${fill};stroke-width:${on?3.2:2}"/><text x="${n.x}" y="${n.y+5}" text-anchor="middle" class="u3nt">${uE(n.l)}</text></g>`;}
  s+=`<circle id="u3dot" r="8" cx="-20" cy="-20" class="u3dot"/>`;
  return s+'</svg>';
}
function u3ArchPos(){const fl=U3FL[U3P.arch.flow],st=fl.st[U3A.i];if(!st)return;const [a,b]=st[1].split('>'),A=U3N[a],B=U3N[b],u=uClamp(U3A.t,0,1),d=$('#u3dot');if(!d)return;
  d.setAttribute('cx',A.x+(B.x-A.x)*u);d.setAttribute('cy',A.y+(B.y-A.y)*u);d.style.fill=st[2]==='u'?'var(--up)':'var(--cp)';}
function u3ArchStep(){const fl=U3FL[U3P.arch.flow],st=fl.st[U3A.i],L=U3L.find(l=>l[0]===st[0]);
  return `<p class="e2step">Bước ${U3A.i+1}/${fl.st.length} · ${st[2]==='u'?'Dữ liệu người dùng':'Báo hiệu'} · giao diện ${uE(L?L[3]:'')}</p><h3 class="e2msg" style="border-left-color:${st[2]==='u'?'var(--up)':'var(--cp)'}">${uE(st[3])}</h3><p class="e2d">${uE(st[4])}</p>`;}
function u3IfHtml(k){const I=U3I[k];if(!I)return'';const blk=(a,c)=>a.length?`<div class="u3stk">${a.map(x=>`<div style="border-left-color:${c}">${uE(x)}</div>`).join('')}</div>`:'<p class="note">Chỉ có mặt phẳng điều khiển.</p>';
  return `<p class="e2step">Giao diện</p><h3 class="e2msg">${uE(k)}</h3><p class="e2x"><b>Hai đầu:</b> ${uE(I.e)}</p><p class="e2d">${uE(I.d)}</p>
  <div class="u3two"><div><b>Mặt phẳng điều khiển (IP)</b>${blk(I.cp,'var(--cp)')}</div><div><b>Mặt phẳng người dùng (IP)</b>${blk(I.up,'var(--up)')}</div></div>
  <p class="e2x"><b>Khi truyền tải ATM:</b> ${uE(I.atm)}</p><p class="e2x"><b>Bản tin tiêu biểu:</b> ${I.m.map(uE).join('; ')}.</p><p class="note">Tài liệu: ${uE(I.sp)}</p>`;}
function u3NodeHtml(id){const n=U3N[id],v=uVn();
  return `<p class="e2step">Nút mạng</p><h3 class="e2msg">${uE(n.l)}</h3><p class="e2d">${uE(n.d)}</p><ul class="u3ul">${n.f.map(x=>`<li>${uE(x)}</li>`).join('')}</ul>${n.v?`<p class="e2x"><b>Sản phẩm thường gặp${v==='3gpp'?'':' ('+uVName(v)+')'}:</b> ${v==='3gpp'?['huawei','nokia','ericsson'].map(x=>uVName(x)+': '+uE(n.v[x])).join('. '):uE(n.v[v])}.</p><p class="note">Tên sản phẩm thay đổi theo đời thiết bị.</p>`:''}`;}
function u3StackGrid(){
  const cols=['UE','NodeB','RNC (SRNC/CRNC)','Lõi (MSC/SGSN)'];
  const c={nas:'var(--u6)',cp:'var(--cp)',up:'var(--up)',b:'var(--u5)',tp:'var(--u2)'};
  return `<div class="u3grid4"><div class="u3gh">${cols.map(x=>`<span>${x}</span>`).join('')}</div>${U3PR.map((p,i)=>`<button type="button" class="u3gr" data-u3a="arch:pr:${i}" style="grid-column:${p[1]+1}/${p[2]+2};border-color:${c[p[3]]};background:color-mix(in srgb, ${c[p[3]]} 14%, var(--panel))">${uE(p[0])}</button>`).join('')}</div>`;}
U3R.arch={
 html(){const P=U3P.arch;return `<div class="panel"><h3>Kiến trúc UTRAN và lõi 3G (Rel-99 đến Rel-7)</h3>
   <div class="e2row"><label class="e2lb" for="u3flow">Luồng chạy trên sơ đồ</label><select id="u3flow" data-u3i="arch:flow">${Object.keys(U3FL).map(k=>`<option value="${k}"${k===P.flow?' selected':''}>${uE(U3FL[k].n)}</option>`).join('')}</select>
   <button type="button" class="btn sm" data-u3a="arch:prev">◀ Lùi</button><button type="button" class="btn sm pri" data-u3a="arch:play" id="u3aPlay">${P.play?'❚❚ Dừng':'▶ Chạy'}</button><button type="button" class="btn sm" data-u3a="arch:next">Tới ▶</button>
   <label class="e2lb" for="u3aSpd">Tốc độ</label><select id="u3aSpd" data-u3i="arch:spd" style="width:auto">${[0.5,1,2].map(v=>`<option value="${v}"${v===P.spd?' selected':''}>${uF(v,v<1?1:0)}×</option>`).join('')}</select></div>
   <div class="scroll"><div class="u3wide" id="u3ArchSvg">${u3ArchSvg()}</div></div>
   ${uLeg([['Báo hiệu','var(--cp)'],['Dữ liệu người dùng','var(--up)'],['Cả hai','var(--muted)']])}
   <p class="note" style="margin:6px 0 0">Nét đứt: liên kết chỉ dùng khi có soft HO qua Iur hoặc relocation. Chạm vào một nút hoặc một đường để xem vai trò và ngăn xếp giao thức của giao diện.</p></div>
   <div class="cols"><div class="panel" id="u3ArchInfo" aria-live="polite">${u3ArchStep()}</div>
   <div class="panel" id="u3ArchSel"><p class="hint">Chọn một nút hoặc giao diện trên sơ đồ.</p>${u3IfHtml('Iub')}</div></div>
   <div class="panel"><h3>Ngăn xếp giao thức: lớp nào kết thúc ở đâu</h3><p class="hint">Mỗi thanh trải từ nút đầu tới nút cuối mà giao thức đó chạy giữa. Bấm một thanh để xem chức năng.</p><div class="scroll"><div style="min-width:640px">${u3StackGrid()}</div></div><div id="u3PrInfo" class="u3box" aria-live="polite"><p class="e2d">${uE(U3PR[7][4])}</p></div>
   <p class="note">Điểm khác 4G: RNC giữ RRC, RLC, PDCP và mã hoá; NodeB chỉ lớp vật lý (thêm MAC-hs/MAC-e từ HSPA). Ở 4G, eNB gộp chức năng của NodeB và RNC.</p></div>
   <div class="panel"><h3>Bảng giao diện 3G</h3><div class="scroll"><table class="e2tb u3w"><thead><tr><th>Giao diện</th><th>Hai đầu</th><th>Điều khiển (IP)</th><th>Người dùng (IP)</th><th>Tài liệu</th></tr></thead><tbody>${Object.keys(U3I).map(k=>{const I=U3I[k];return `<tr><td><button type="button" class="u3lnkbtn" data-u3a="arch:if:${uE(k)}">${uE(k)}</button></td><td>${uE(I.e)}</td><td>${uE(I.cp.join(' / '))}</td><td>${uE(I.up.join(' / ')||'—')}</td><td>${uE(I.sp)}</td></tr>`;}).join('')}</tbody></table></div></div>`;},
 after(){u3ArchPos();},
 tick(dt){const P=U3P.arch;if(!P.play)return;const fl=U3FL[P.flow];U3A.t+=dt*P.spd/1.1;
   if(U3A.t>1.55){U3A.t=0;U3A.i=(U3A.i+1)%fl.st.length;const g=$('#u3ArchSvg');if(g)g.innerHTML=u3ArchSvg();const inf=$('#u3ArchInfo');if(inf)inf.innerHTML=u3ArchStep();}
   u3ArchPos();},
 upd(k){if(k==='flow'){U3A.i=0;U3A.t=0;}const g=$('#u3ArchSvg');if(g)g.innerHTML=u3ArchSvg();const inf=$('#u3ArchInfo');if(inf)inf.innerHTML=u3ArchStep();u3ArchPos();},
 act(a,el){const P=U3P.arch,parts=el.dataset.u3a.split(':'),fl=U3FL[P.flow];
   if(a==='play'){P.play=P.play?0:1;el.textContent=P.play?'❚❚ Dừng':'▶ Chạy';if(P.play)u3Start();return;}
   if(a==='prev'||a==='next'){P.play=0;const b=$('#u3aPlay');if(b)b.textContent='▶ Chạy';U3A.i=(U3A.i+(a==='next'?1:-1)+fl.st.length)%fl.st.length;U3A.t=0.5;this.upd('');return;}
   if(a==='node'){U3A.sel=parts[2];$('#u3ArchSel').innerHTML=u3NodeHtml(parts[2]);const g=$('#u3ArchSvg');if(g)g.innerHTML=u3ArchSvg();u3ArchPos();return;}
   if(a==='if'){$('#u3ArchSel').innerHTML=u3IfHtml(parts.slice(2).join(':'));if(window.innerWidth<900)$('#u3ArchSel').scrollIntoView({block:'nearest',behavior:'smooth'});return;}
   if(a==='pr'){const p=U3PR[+parts[2]];$('#u3PrInfo').innerHTML=`<p class="e2x"><b>${uE(p[0])}</b> · giữa ${['UE','NodeB','RNC','lõi'][p[1]]} và ${['UE','NodeB','RNC','lõi'][p[2]]}</p><p class="e2d">${uE(p[4])}</p>`;}
 }
};

/* ---------- Mục 2: Lớp vật lý WCDMA ---------- */
U3P.phy={sfA:4,kA:1,sfB:8,kB:4,lam:6,mix:'mix',pol:'compact',hsN:10,dyn:1,spd:60,
  v:30,step:1,bler:1,pc:'io',dist:0.6,
  nV:40,nP:4,nH:1,oi:0.6,ebno:5,adm:75,ext:0,indoor:12,run24:0};
const uOv=(sf,k)=>{let c=[1];let n=1;const bits=[];let kk=k;for(let s=sf;s>1;s/=2){bits.unshift(kk&1);kk>>=1;}for(const b of bits){c=b?c.concat(c.map(x=>-x)):c.concat(c);n*=2;}return c;};
/* trải phổ: hai người dùng A, B; 16 chip */
function u3Spread(){
  const P=U3P.phy,N=16,ca=uOv(P.sfA,P.kA),cb=uOv(P.sfB,P.kB);
  const da=[1,-1,1,-1,-1,1,1,-1].slice(0,N/P.sfA),db=[-1,-1,1,1,-1,1,-1,1].slice(0,N/P.sfB);
  const A=[],B=[],T=[];for(let i=0;i<N;i++){A.push(da[Math.floor(i/P.sfA)]*ca[i%P.sfA]);B.push(db[Math.floor(i/P.sfB)]*cb[i%P.sfB]);T.push(A[i]+B[i]);}
  const rec=da.map((_,j)=>{let s=0;for(let i=j*P.sfA;i<(j+1)*P.sfA;i++)s+=T[i]*ca[i%P.sfA];return s/P.sfA;});
  /* trực giao? mã B nằm trên nhánh của mã A (cha/con) hoặc trùng thì không trực giao */
  const lo=Math.min(P.sfA,P.sfB),kl=P.sfA<P.sfB?P.kA:P.kB,kh=P.sfA<P.sfB?P.kB:P.kA,hi=Math.max(P.sfA,P.sfB);
  const conflict=Math.floor(kh/(hi/lo))===kl;
  return {N,ca,cb,da,db,A,B,T,rec,conflict};
}
function u3SpreadSvg(cur){
  const P=U3P.phy,R=u3Spread(),W=700,cw=38,x0=120,rows=[['Dữ liệu A',R.da,P.sfA,'var(--u1)'],['Chip A = dữ liệu × mã',R.A,1,'var(--u1)'],['Dữ liệu B',R.db,P.sfB,'var(--u2)'],['Chip B',R.B,1,'var(--u2)'],['Tổng phát (A+B)',R.T,1,'var(--ink)']];
  let s=`<svg viewBox="0 0 ${x0+cw*16+14} ${rows.length*50+96}" class="u3svg" role="img" aria-label="Trải phổ hai người dùng">`;
  rows.forEach((r,i)=>{const y=20+i*50,mid=y+18;s+=`<text x="4" y="${mid+4}" class="u3ax" style="font-size:12px">${uE(r[0])}</text><line x1="${x0}" x2="${x0+cw*16}" y1="${mid}" y2="${mid}" class="u3grid"/>`;
    const vals=r[1],w=cw*r[2];vals.forEach((v,j)=>{const h=v*9;s+=`<rect x="${x0+j*w+1}" y="${h>0?mid-h:mid}" width="${w-2}" height="${Math.max(1,Math.abs(h))}" style="fill:${r[3]};opacity:${r[2]>1?.45:.85}"/>${r[2]>1||i===4?`<text x="${x0+j*w+w/2}" y="${mid+(v>=0?22:-12)+(v>=0?0:0)}" class="u3ax" text-anchor="middle">${v>0?'+':''}${v}</text>`:''}`;});});
  const y=20+rows.length*50;s+=`<text x="4" y="${y+22}" class="u3ax" style="font-size:12px">Giải trải phổ A</text>`;
  R.rec.forEach((v,j)=>{const w=cw*P.sfA,ok=Math.sign(v)===R.da[j]&&Math.abs(Math.abs(v)-1)<1e-9;s+=`<rect x="${x0+j*w+2}" y="${y+6}" width="${w-4}" height="26" rx="5" style="fill:${ok?'var(--k1)':'var(--warn)'};opacity:.18;stroke:${ok?'var(--k1)':'var(--warn)'}"/><text x="${x0+j*w+w/2}" y="${y+24}" text-anchor="middle" class="u3nt">${uF(v,2)}</text>`;});
  if(cur!=null){const cx=x0+cur*cw;s+=`<line x1="${cx}" x2="${cx}" y1="10" y2="${y+36}" class="u3cur"/>`;}
  return s+'</svg>';
}
/* cây OVSF và mô phỏng cấp mã */
const U3SV={amr:{n:'Thoại AMR 12,2k',sf:128,h:90,c:'var(--u1)'},p64:{n:'PS 64k',sf:32,h:40,c:'var(--u3)'},p128:{n:'PS 128k',sf:16,h:40,c:'var(--u5)'},p384:{n:'PS 384k',sf:8,h:30,c:'var(--u4)'}};
const U3CM={com:{n:'Kênh chung (CPICH, P-CCPCH, AICH, PICH, S-CCPCH)',c:'var(--muted)'},hsc:{n:'HS-SCCH, E-AGCH, E-RGCH/E-HICH',c:'var(--u6)'},hs:{n:'HS-PDSCH (SF16)',c:'var(--u2)'}};
const U3O={leaf:new Uint8Array(256),al:[],t:0,att:0,ok:0,blk:0,frag:0,seed:7,hsCur:10,ev:[]};
function uOvFree(sf,k){const w=256/sf;for(let i=k*w;i<(k+1)*w;i++)if(U3O.leaf[i])return false;return true;}
function uOvSet(sf,k,v){const w=256/sf;for(let i=k*w;i<(k+1)*w;i++)U3O.leaf[i]=v;}
function u3OvReset(){const O=U3O;O.leaf.fill(0);O.al=[];O.t=0;O.att=O.ok=O.blk=O.frag=0;O.ev=[];O.r=uRng(O.seed++);
  [[256,0],[256,1],[256,2],[256,3],[64,1]].forEach(c=>{uOvSet(c[0],c[1],1);O.al.push({sf:c[0],k:c[1],t:'com',end:1e18});});
  [[128,4],[128,5],[128,6],[128,7],[256,16],[128,9]].forEach(c=>{uOvSet(c[0],c[1],2);O.al.push({sf:c[0],k:c[1],t:'hsc',end:1e18});});
  O.hsCur=U3P.phy.hsN;u3OvHs();}
function u3OvHs(){const O=U3O;O.al=O.al.filter(a=>{if(a.t==='hs'){uOvSet(a.sf,a.k,0);return false;}return true;});
  let n=0;for(let k=15;k>=1&&n<O.hsCur;k--){if(uOvFree(16,k)){uOvSet(16,k,3);O.al.push({sf:16,k,t:'hs',end:1e18});n++;}else break;}O.hsCur=n;}
function u3OvPick(sf){const O=U3O,n=sf;let best=-1,bs=-1;
  for(let k=0;k<n;k++){if(!uOvFree(sf,k))continue;if(U3P.phy.pol==='first')return k;
    /* chọn mã có "anh em" bận nhiều nhất để dồn cây, giữ nhánh lớn còn trống */
    let sc=0,s2=sf,kk=k;while(s2>4){const sib=kk^1,w=256/s2;let used=0;for(let i=sib*w;i<(sib+1)*w;i++)if(O.leaf[i])used++;sc=sc*2+used/w;s2/=2;kk>>=1;}
    if(sc>bs){bs=sc;best=k;}}
  return best;}
function u3OvStep(dt){while(dt>1){u3OvStep1(1);dt-=1;}u3OvStep1(dt);}
function u3OvStep1(dt){const O=U3O,P=U3P.phy;if(!O.r)u3OvReset();O.t+=dt;
  O.al=O.al.filter(a=>{if(a.end<=O.t){uOvSet(a.sf,a.k,0);return false;}return true;});
  const mix=P.mix==='voice'?{amr:1}:P.mix==='data'?{p64:.35,p128:.4,p384:.25}:{amr:.6,p64:.15,p128:.15,p384:.1};
  const lam=P.lam/60,Lp=Math.exp(-lam*dt);let n=0,pr=O.r();while(pr>Lp&&n<60){n++;pr*=O.r();} /* số yêu cầu đến trong dt: phân bố Poisson */
  for(let j=0;j<n;j++){let u=O.r(),ty='amr';for(const k in mix){if(u<mix[k]){ty=k;break;}u-=mix[k];}
    const sv=U3SV[ty];O.att++;let k=u3OvPick(sv.sf);
    if(k<0&&P.dyn&&O.hsCur>5){O.hsCur--;u3OvHs();k=u3OvPick(sv.sf);if(k>=0)O.ev.unshift([O.t,'Giảm HS-PDSCH còn '+O.hsCur+' mã để nhận '+sv.n]);}
    if(k<0){O.blk++;let free=0;for(let i=0;i<256;i++)if(!O.leaf[i])free++;if(free>=256/sv.sf){O.frag++;O.ev.unshift([O.t,'Chặn '+sv.n+' do phân mảnh cây (còn '+free+'/256 lá trống)']);}else O.ev.unshift([O.t,'Chặn '+sv.n+': hết mã SF'+sv.sf]);}
    else{O.ok++;uOvSet(sv.sf,k,ty==='amr'?4:ty==='p64'?5:ty==='p128'?6:7);O.al.push({sf:sv.sf,k,t:ty,end:O.t+sv.h*(-Math.log(1-O.r()*0.999))});}}
  if(P.dyn&&O.hsCur<P.hsN&&uOvFree(16,15-O.hsCur)){O.hsCur++;u3OvHs();}
  if(O.ev.length>40)O.ev.length=40;}
function u3OvSvg(){const O=U3O,W=960,lv=[4,8,16,32,64,128,256],rh=26,x0=58;
  const col=['','var(--muted)','var(--u6)','var(--u2)','var(--u1)','var(--u3)','var(--u5)','var(--u4)'];
  let s=`<svg viewBox="0 0 ${W+x0+6} ${lv.length*rh+16}" class="u3svg" role="img" aria-label="Cây mã OVSF">`;
  lv.forEach((sf,r)=>{const y=6+r*rh,w=W/sf;s+=`<text x="4" y="${y+16}" class="u3ax">SF${sf}</text>`;
    for(let k=0;k<sf;k++){const lw=256/sf;let st=0,own=0;for(let i=k*lw;i<(k+1)*lw;i++)if(O.leaf[i]){st++;own=O.leaf[i];}
      const a=O.al.find(q=>q.sf===sf&&q.k===k);const fill=a?col[O.leaf[k*lw]]:st?'var(--line)':'var(--panel2)';
      s+=`<rect x="${x0+k*w+.4}" y="${y}" width="${Math.max(.6,w-.8)}" height="${rh-6}" style="fill:${fill};${a?'':'opacity:'+(st?.55:1)}" ${sf<=64?`data-u3a="phy:ov:${sf}:${k}" class="u3ovc"`:''}><title>Cch,${sf},${k}${a?' – đang dùng':st?' – bị chặn (nhánh có mã đang dùng)':' – trống'}</title></rect>`;}});
  return s+'</svg>';}
function u3OvStats(){const O=U3O;let used=0;for(let i=0;i<256;i++)if(O.leaf[i])used++;const cnt={};O.al.forEach(a=>cnt[a.t]=(cnt[a.t]||0)+1);
  const hh=Math.floor(O.t/3600),mm=Math.floor(O.t%3600/60),ss=Math.floor(O.t%60);
  return `<dt>Thời gian mô phỏng</dt><dd>${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}</dd>
  <dt>Mức dùng cây mã</dt><dd>${uF(used/256*100,1)} %</dd><dt>HS-PDSCH đang giữ</dt><dd>${O.hsCur} mã SF16</dd>
  ${Object.keys(U3SV).map(k=>`<dt>${U3SV[k].n} (SF${U3SV[k].sf})</dt><dd>${cnt[k]||0}</dd>`).join('')}
  <dt>Yêu cầu / được cấp</dt><dd>${O.att} / ${O.ok}</dd><dt>Chặn do hết mã</dt><dd>${O.blk} (${O.att?uF(O.blk/O.att*100,1):0} %)</dd><dt>Trong đó do phân mảnh</dt><dd>${O.frag}</dd>`;}
/* kênh logic, truyền tải, vật lý */
const U3CH={
 lg:[['BCCH','Thông tin hệ thống (SIB)','DL'],['PCCH','Tìm gọi','DL'],['CCCH','Báo hiệu chung (RRC Connection Request/Setup)','UL/DL'],['DCCH','Báo hiệu riêng của UE','UL/DL'],['DTCH','Dữ liệu riêng của UE','UL/DL'],['CTCH','Cell broadcast (CBS)','DL']],
 tr:[['BCH','Quảng bá, TTI 20 ms, cố định 12,3 kbps','DL'],['PCH','Tìm gọi, gắn với PICH','DL'],['FACH','Kênh truy nhập xuôi chung (CELL_FACH)','DL'],['RACH','Truy nhập ngẫu nhiên, preamble + message','UL'],['DCH','Kênh riêng, hỗ trợ soft HO, điều khiển công suất nhanh','UL/DL'],['HS-DSCH','Chia sẻ tốc độ cao, TTI 2 ms, HARQ ở NodeB','DL'],['E-DCH','Kênh riêng tăng cường đường lên, TTI 2/10 ms','UL']],
 ph:[['P-CCPCH','SF256 (Cch,256,1), chở BCH, không phát ở 256 chip đầu mỗi slot (nhường SCH)','DL'],['S-CCPCH','SF4–256, chở FACH và PCH','DL'],['PRACH','Preamble 4096 chip + phần message SF32–256','UL'],['DPDCH','Dữ liệu của DCH, SF4–256 (lên), SF4–512 (xuống)','UL/DL'],['DPCCH','Pilot, TPC, TFCI, FBI; SF256 đường lên','UL/DL'],['HS-PDSCH','SF16 cố định, tối đa 15 mã, QPSK/16QAM/64QAM','DL'],['E-DPDCH','Dữ liệu E-DCH, SF2–256, tối đa 2×SF2 + 2×SF4','UL'],
  ['CPICH','Pilot chung (Cch,256,0), mốc đo Ec/Io, RSCP, thường 10 % công suất cell','DL'],['SCH','Đồng bộ chính/phụ (P-SCH, S-SCH), không trải phổ OVSF, 256 chip đầu slot','DL'],['AICH','Trả lời preamble PRACH','DL'],['PICH','Chỉ thị tìm gọi, UE ở DRX chỉ thức dậy đọc PICH','DL'],['F-DPCH','DPCH rút gọn chỉ chở TPC (Rel-6), tiết kiệm mã','DL'],['HS-SCCH','SF128, báo UE nào, mã nào, điều chế, TBS, HARQ cho TTI tới','DL'],['HS-DPCCH','SF256, ACK/NACK và CQI đường lên','UL'],['E-DPCCH','Điều khiển E-DCH: E-TFCI, RSN, happy bit','UL'],['E-AGCH','Grant tuyệt đối, SF256','DL'],['E-RGCH','Grant tương đối UP/HOLD/DOWN','DL'],['E-HICH','ACK/NACK HARQ của E-DCH','DL']],
 m1:[['BCCH','BCH'],['BCCH','FACH'],['PCCH','PCH'],['CCCH','RACH'],['CCCH','FACH'],['DCCH','RACH'],['DCCH','FACH'],['DCCH','DCH'],['DCCH','HS-DSCH'],['DCCH','E-DCH'],['DTCH','RACH'],['DTCH','FACH'],['DTCH','DCH'],['DTCH','HS-DSCH'],['DTCH','E-DCH'],['CTCH','FACH']],
 m2:[['BCH','P-CCPCH'],['PCH','S-CCPCH'],['FACH','S-CCPCH'],['RACH','PRACH'],['DCH','DPDCH'],['HS-DSCH','HS-PDSCH'],['E-DCH','E-DPDCH']]
};
let U3CHS='DTCH';
function u3ChSvg(){const C=U3CH,sel=U3CHS,W=820,colx=[20,300,580],bw=210,rh=26;
  const pos={};C.lg.forEach((c,i)=>pos[c[0]]=[colx[0],14+i*rh*1.5]);C.tr.forEach((c,i)=>pos[c[0]]=[colx[1],14+i*rh*1.5]);C.ph.forEach((c,i)=>pos[c[0]]=[colx[2],14+i*rh]);
  const H=Math.max(14+C.ph.length*rh,14+C.tr.length*rh*1.5)+10;
  const rel=new Set([sel]);let ch=true;while(ch){ch=false;for(const m of C.m1.concat(C.m2)){if(rel.has(m[0])&&!rel.has(m[1])&&(C.lg.some(x=>x[0]===sel)||C.tr.some(x=>x[0]===sel)&&C.tr.some(x=>x[0]===m[0])||m[0]===sel)){rel.add(m[1]);ch=true;}}}
  for(const m of C.m1.concat(C.m2)){if(rel.has(m[1])&&m[1]===sel)rel.add(m[0]);}
  if(C.tr.some(x=>x[0]===sel))C.m1.forEach(m=>{if(m[1]===sel)rel.add(m[0]);});
  if(C.ph.some(x=>x[0]===sel)){C.m2.forEach(m=>{if(m[1]===sel){rel.add(m[0]);C.m1.forEach(q=>{if(q[1]===m[0])rel.add(q[0]);});}});}
  let s=`<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="Ánh xạ kênh"><text x="${colx[0]}" y="10" class="u3ax">KÊNH LOGIC (MAC ↔ RLC)</text><text x="${colx[1]}" y="10" class="u3ax">KÊNH TRUYỀN TẢI (PHY ↔ MAC)</text><text x="${colx[2]}" y="10" class="u3ax">KÊNH VẬT LÝ</text>`;
  const ln=(a,b)=>{const A=pos[a],B=pos[b],on=rel.has(a)&&rel.has(b);return `<path d="M${A[0]+bw} ${A[1]+rh/2+6} C ${A[0]+bw+40} ${A[1]+rh/2+6}, ${B[0]-40} ${B[1]+rh/2+6}, ${B[0]} ${B[1]+rh/2+6}" style="fill:none;stroke:${on?'var(--up)':'var(--line)'};stroke-width:${on?2.6:1.2}"/>`;};
  C.m1.forEach(m=>s+=ln(m[0],m[1]));C.m2.forEach(m=>s+=ln(m[0],m[1]));
  const box=(c)=>{const p=pos[c[0]],on=rel.has(c[0]),me=c[0]===sel;return `<g data-u3a="phy:ch:${c[0]}" class="u3nd" tabindex="0" role="button"><rect x="${p[0]}" y="${p[1]+6}" width="${bw}" height="${rh-4}" rx="6" style="fill:${me?'var(--ink)':on?'color-mix(in srgb, var(--up) 18%, var(--panel))':'var(--panel)'};stroke:${on?'var(--up)':'var(--line)'}"/><text x="${p[0]+8}" y="${p[1]+rh/2+10}" class="u3nt" style="${me?'fill:var(--bg)':''}">${uE(c[0])} <tspan class="u3ax" style="${me?'fill:var(--bg)':''}">${uE(c[2])}</tspan></text></g>`;};
  C.lg.forEach(c=>s+=box(c));C.tr.forEach(c=>s+=box(c));C.ph.forEach(c=>s+=box(c));
  return s+'</svg>';}
function u3ChInfo(){const C=U3CH,all=C.lg.concat(C.tr,C.ph),c=all.find(x=>x[0]===U3CHS)||all[0];const kind=C.lg.includes(c)?'Kênh logic':C.tr.includes(c)?'Kênh truyền tải':'Kênh vật lý';
  const up=C.m1.filter(m=>m[1]===c[0]).map(m=>m[0]).concat(C.m2.filter(m=>m[1]===c[0]).map(m=>m[0])),dn=C.m1.filter(m=>m[0]===c[0]).map(m=>m[1]).concat(C.m2.filter(m=>m[0]===c[0]).map(m=>m[1]));
  return `<p class="e2x"><b>${uE(c[0])}</b> · ${kind} · ${uE(c[2])}</p><p class="e2d">${uE(c[1])}</p><p class="note">${dn.length?'Ánh xạ xuống: '+dn.join(', ')+'. ':''}${up.length?'Nhận từ: '+up.join(', ')+'.':''}${!dn.length&&!up.length?'Kênh vật lý không chở kênh truyền tải nào (chỉ báo hiệu lớp 1).':''}</p>`;}
/* điều khiển công suất vòng trong / vòng ngoài */
const U3PC={sl:0,ph:[],phase:[],ptx:10,tgt:6,tpc:[],hist:[],errs:0,blk:0,tti:[],sumP:0,nP:0,maxc:0,r:uRng(11),acc:0,sirAcc:0,sirN:0};
function u3PcReset(){const C=U3PC;C.sl=0;C.ph=[];C.phase=[];for(let i=0;i<10;i++){C.ph.push(C.r()*2*Math.PI);C.phase.push(C.r()*2*Math.PI);}C.ptx=10;C.tgt=6;C.tpc=[0];C.hist=[];C.errs=0;C.blk=0;C.tti=[];C.sumP=0;C.nP=0;C.maxc=0;C.acc=0;C.sirAcc=0;C.sirN=0;}
function u3PcSlot(){const C=U3PC,P=U3P.phy,t=C.sl/1500,fd=P.v/3.6*1.95e9/3e8;
  let re=0,im=0;for(let n=0;n<10;n++){const a=2*Math.PI*fd*Math.cos(C.ph[n])*t+C.phase[n];re+=Math.cos(a);im+=Math.sin(a);}
  const g=uDb((re*re+im*im)/10),pl=128.1+37.6*Math.log10(Math.max(.05,P.dist)),I=-102;
  if(P.pc==='off'){C.ptx=uClamp(pl-117+2,-50,24);} /* vòng hở: ước lượng theo suy hao trung bình, không bám fading */
  const sir=C.ptx-pl+g-I+21;
  const est=sir+uGauss(C.r)*0.8;let cmd=est<C.tgt?1:-1;if(C.r()<0.04)cmd=-cmd;
  if(P.pc!=='off'){C.ptx=uClamp(C.ptx+cmd*P.step,-50,24);}
  if(C.ptx>=24)C.maxc++;C.sumP+=C.ptx;C.nP++;C.sirAcc+=sir;C.sirN++;
  C.hist.push([C.sl,g,C.ptx,sir,C.tgt]);if(C.hist.length>1500)C.hist.shift();
  if(C.sl%30===29){const sa=C.sirAcc/C.sirN;C.sirAcc=0;C.sirN=0;const pe=1/(1+Math.exp(2.2*(sa-4)));const err=C.r()<pe;C.blk++;if(err)C.errs++;C.tti.push(err?1:0);if(C.tti.length>500)C.tti.shift();
    if(P.pc==='io'){const b=P.bler/100,up=0.5;C.tgt=uClamp(C.tgt+(err?up:-up*b/(1-b)),-2,14);}}
  C.sl++;}
function u3PcSvg(){const C=U3PC,H=C.hist;if(!H.length)return '';const x0=H[0][0],x1=x0+1500;
  const a=uPlot({w:700,h:170,x0,x1,y0:-30,y1:26,yt:[-30,-20,-10,0,10,20],aria:'Fading và công suất phát UE',ylab:'dB / dBm',xt:[],series:[{pts:H.map(h=>[h[0],h[1]]),c:'var(--muted)',w:1.2},{pts:H.map(h=>[h[0],h[2]]),c:'var(--u4)',w:1.8}],hl:[[24,'var(--warn)','Công suất tối đa 24 dBm']]});
  const b=uPlot({w:700,h:150,x0,x1,y0:-6,y1:16,yt:[-5,0,5,10,15],aria:'SIR thu và SIR target',ylab:'SIR dB',xt:[],series:[{pts:H.map(h=>[h[0],h[3]]),c:'var(--u1)',w:1.2},{pts:H.map(h=>[h[0],h[4]]),c:'var(--k1)',w:2.2}]});
  return a+uLeg([['Fading kênh (dB)','var(--muted)'],['Công suất phát UE (dBm)','var(--u4)']])+b+uLeg([['SIR thu tại NodeB','var(--u1)'],['SIR target (vòng ngoài đặt)','var(--k1)']]);}
function u3PcStats(){const C=U3PC,P=U3P.phy,pl=d=>128.1+37.6*Math.log10(d);const nf=pl(2)-pl(0.1);
  const recent=C.tti.slice(-250),bl=recent.length?recent.reduce((a,b)=>a+b,0)/recent.length:0;
  return `<dt>BLER đo (5 s gần nhất)</dt><dd>${uF(bl*100,2)} %</dd><dt>BLER mục tiêu</dt><dd>${uF(P.bler,1)} %</dd><dt>SIR target hiện tại</dt><dd>${uF(C.tgt,1)} dB</dd>
  <dt>Công suất phát UE trung bình</dt><dd>${C.nP?uF(C.sumP/C.nP,1):'—'} dBm</dd><dt>Thời gian ở công suất tối đa</dt><dd>${C.nP?uF(C.maxc/C.nP*100,1):0} %</dd>
  <dt>Tần số Doppler</dt><dd>${uF(P.v/3.6*1.95e9/3e8,0)} Hz</dd><dt>Gần – xa không điều khiển (100 m so với 2 km)</dt><dd>${uF(nf,0)} dB</dd>`;}
/* tải đường lên, noise rise và thở cell */
const U3H24=[.25,.18,.12,.1,.1,.15,.3,.55,.75,.85,.9,.92,.88,.86,.88,.9,.92,.95,1,.98,.9,.75,.55,.38];
const U3UL={h:0,trace:[]};
function u3Ul(mult){const P=U3P.phy,m=mult==null?1:mult,W=3.84e6;
  const eta=(r,e,v)=>1/(1+W/(uLin(e)*r*v));
  const nV=P.nV*m,nP=P.nP*m,nH=P.nH*m;
  const own=nV*eta(12200,P.ebno,0.67)+nP*eta(64000,2,1)+nH*eta(384000,1,1);
  const tot=Math.min(0.99,own*(1+P.oi));const nr=-10*Math.log10(1-tot);
  const N0=-105.1,rt=uDb(uLin(N0)/(1-tot)+uLin(N0+P.ext)*(P.ext>0?1:0));
  const nrT=rt-N0;
  const mapl=nr2=>21+18-3-(N0-24.98+P.ebno+nr2)-7-P.indoor; /* thoại 12,2k: PG = 24,98 dB */
  const rad=nr2=>Math.pow(10,(mapl(nr2)-137.4)/35.2);
  return {own,tot,nr,rt,nrT,rad:rad(nrT),rad0:rad(0),rad50:rad(3.01),adm:tot*100>P.adm,ma:mapl(nrT)};}
function u3UlSvg(){const P=U3P.phy,u=u3Ul(U3P.phy.run24?U3H24[Math.floor(U3UL.h)%24]:1);
  const pts=[];for(let e=0;e<=0.95;e+=0.01)pts.push([e*100,-10*Math.log10(1-e)]);
  const a=uPlot({w:460,h:240,x0:0,x1:100,y0:0,y1:14,yt:[0,3,6,9,12],xt:[0,25,50,75,100],xf:v=>v+'%',aria:'Noise rise theo tải',ylab:'Noise rise dB',series:[{pts,c:'var(--ink)',w:2}],marks:[[P.adm,'Ngưỡng nhận '+P.adm+'%','var(--warn)']],
    extra:(()=>{const X=44+(u.tot*100)/100*(460-54),Y=10+(1-Math.min(14,u.nr)/14)*(240-36);return `<circle cx="${X}" cy="${Y}" r="7" style="fill:${u.adm?'var(--warn)':'var(--k1)'};stroke:var(--panel);stroke-width:2"/>`;})()});
  /* thở cell: 7 cell, khoảng cách theo bán kính thiết kế ở tải 50 % */
  const R0=u.rad50,D=Math.sqrt(3)*R0,sc=150/(D*1.6),cx=230,cy=170;let b=`<svg viewBox="0 0 460 340" class="u3svg" role="img" aria-label="Thở cell"><rect x="0" y="0" width="460" height="340" class="u3pbg"/>`;
  const cs=[[0,0]];for(let i=0;i<6;i++)cs.push([D*Math.cos(Math.PI/6+i*Math.PI/3),D*Math.sin(Math.PI/6+i*Math.PI/3)]);
  cs.forEach((c,i)=>{b+=`<circle cx="${cx+c[0]*sc}" cy="${cy+c[1]*sc}" r="${R0*sc}" style="fill:none;stroke:var(--line);stroke-dasharray:4 4"/><circle cx="${cx+c[0]*sc}" cy="${cy+c[1]*sc}" r="${u.rad*sc}" style="fill:${i?'var(--u1)':'var(--u4)'};opacity:.16;stroke:${i?'var(--u1)':'var(--u4)'};stroke-width:1.5"/><circle cx="${cx+c[0]*sc}" cy="${cy+c[1]*sc}" r="3" style="fill:var(--ink)"/>`;});
  b+=`<text x="10" y="20" class="u3ax">Nét đứt: vùng phủ thiết kế (tải 50 %). Vùng tô: vùng phủ thoại hiện tại.</text>`;
  if(P.run24)b+=`<text x="450" y="330" class="u3nt" text-anchor="end">${String(Math.floor(U3UL.h)%24).padStart(2,'0')}:00 · lưu lượng ${Math.round(U3H24[Math.floor(U3UL.h)%24]*100)}%</text>`;
  b+='</svg>';
  return {a,b,u};}
function u3UlStats(u){return `<dt>Hệ số tải đường lên η</dt><dd>${uF(u.tot*100,1)} %</dd><dt>Noise rise (do tải)</dt><dd>${uF(u.nr,2)} dB</dd><dt>RTWP đo ở NodeB</dt><dd>${uF(u.rt,1)} dBm</dd>
  <dt>Bán kính thoại hiện tại</dt><dd>${uF(u.rad*1000,0)} m</dd><dt>Bán kính khi cell rỗng</dt><dd>${uF(u.rad0*1000,0)} m</dd><dt>Điều khiển nhận (admission)</dt><dd style="color:${u.adm?'var(--warn)':'inherit'}">${u.adm?'Từ chối RAB mới':'Còn nhận'}</dd>`;}
U3R.phy={
 html(){const P=U3P.phy,sv=Object.keys(U3SV);if(!U3O.r)u3OvReset();if(!U3PC.ph.length)u3PcReset();const ul=u3UlSvg();
  return `<div class="panel"><h3>Trải phổ, mã channelisation (OVSF) và mã scrambling</h3>
  <p class="e2d">WCDMA trải mỗi ký hiệu thành SF chip ở tốc độ cố định 3,84 Mcps. Mã channelisation OVSF tách các kênh trong cùng một nguồn phát (đường xuống: các UE trong một cell; đường lên: các kênh của một UE). Sau đó nhân thêm mã scrambling: đường xuống phân biệt cell (512 mã chính, chia 64 nhóm × 8), đường lên phân biệt UE (hàng triệu mã dài). Hai mã OVSF trực giao khi không nằm trên cùng một nhánh của cây.</p>
  <div class="ctl">${uSel('phy','sfA','Hệ số trải phổ của A',[[4,'SF4'],[8,'SF8'],[16,'SF16']])}${uSel('phy','kA','Chỉ số mã của A',Array.from({length:P.sfA},(_,i)=>[i,'Cch,'+P.sfA+','+i]))}${uSel('phy','sfB','Hệ số trải phổ của B',[[4,'SF4'],[8,'SF8'],[16,'SF16']])}${uSel('phy','kB','Chỉ số mã của B',Array.from({length:P.sfB},(_,i)=>[i,'Cch,'+P.sfB+','+i]))}</div>
  <div class="scroll"><div class="u3wide" style="min-width:620px" id="u3Spr">${u3SpreadSvg(null)}</div></div><div id="u3SprNote" class="u3box"></div>
  <div class="scroll"><table class="e2tb u3w"><thead><tr><th>SF đường xuống</th><th>Tốc độ ký hiệu</th><th>Tốc độ dữ liệu xấp xỉ (DPCH)</th><th>Độ lợi xử lý</th><th>Dịch vụ thường gặp</th></tr></thead><tbody>
  ${[[512,'7,5 ksps','1–3 kbps','27,1 dB','Kênh báo hiệu SRB 3,4 kbps (một số cấu hình)'],[256,'15 ksps','6–12 kbps','24,1 dB','SRB 3,4k, kênh chung CPICH/P-CCPCH'],[128,'30 ksps','12–24 kbps','21,1 dB','Thoại AMR 12,2 kbps'],[64,'60 ksps','30–48 kbps','18,1 dB','CS 28,8k, PS 32k'],[32,'120 ksps','64 kbps','15,1 dB','PS 64k, video call CS 64k'],[16,'240 ksps','128 kbps','12,0 dB','PS 128k; HS-PDSCH luôn SF16'],[8,'480 ksps','384 kbps','9,0 dB','PS 384k'],[4,'960 ksps','~ 1 Mbps (đa mã đến 2 Mbps)','6,0 dB','Tốc độ cao R99 (hiếm)']].map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  <p class="note">Tốc độ dữ liệu phụ thuộc tỉ lệ mã hoá kênh và phần DPCCH; số liệu là cấu hình điển hình. Đường lên dùng SF4–256 cho DPDCH, DPCCH luôn SF256.</p></div>

  <div class="panel"><h3>Cây mã OVSF: cấp phát, chặn và phân mảnh (mô phỏng tải)</h3>
  <p class="hint">Mỗi hàng là một mức SF; ô tô màu là mã đang dùng, ô xám là mã bị chặn vì nằm trên nhánh của mã đang dùng. Bấm một ô ở mức SF4–SF64 để cấp hoặc thu hồi bằng tay. Mô phỏng sinh cuộc gọi đến ngẫu nhiên và so sánh hai cách chọn mã.</p>
  <div class="ctl">${uSl('phy','lam','Yêu cầu mới mỗi phút',1,40,1,v=>v)}${uSel('phy','mix','Cơ cấu dịch vụ',[['mix','Hỗn hợp thoại + dữ liệu'],['voice','Chỉ thoại AMR'],['data','Chỉ dữ liệu R99']])}${uSel('phy','pol','Cách chọn mã',[['compact','Dồn cây (best fit)'],['first','Mã trống đầu tiên']])}${uSel('phy','hsN','Số mã HS-PDSCH đặt trước',[[0,'0 (không HSDPA)'],[5,'5 mã'],[10,'10 mã'],[15,'15 mã']])}${uChk('phy','dyn','Cấp mã HS-PDSCH động (nhường mã cho R99)')}${uSel('phy','spd','Tốc độ mô phỏng',[[10,'10× thời gian thực'],[60,'60×'],[300,'300×']])}</div>
  <div class="e2row" style="margin-top:8px"><button type="button" class="btn sm" data-u3a="phy:ovreset">Làm lại từ đầu</button><button type="button" class="btn sm pri" data-u3a="phy:ovrun" id="u3OvRun">${U3O.run?'❚❚ Dừng':'▶ Chạy tải'}</button></div>
  <div class="scroll"><div class="u3wide" id="u3Ov">${u3OvSvg()}</div></div>
  ${uLeg([[U3CM.com.n,'var(--muted)'],[U3CM.hsc.n,'var(--u6)'],[U3CM.hs.n,'var(--u2)']].concat(sv.map(k=>[U3SV[k].n+' (SF'+U3SV[k].sf+')',U3SV[k].c])))}
  <div class="cols"><dl class="kv" id="u3OvSt">${u3OvStats()}</dl><div><p class="e2x"><b>Nhật ký</b></p><ol class="u3log" id="u3OvLog"></ol></div></div>
  <p class="note">Mã cố định theo chuẩn: CPICH = Cch,256,0; P-CCPCH = Cch,256,1. Các kênh chung còn lại, HS-SCCH, E-AGCH, E-RGCH/E-HICH do vendor tự chọn vị trí. Mỗi cell chỉ có một cây mã cho mỗi mã scrambling; thiếu mã là một nguyên nhân nghẽn (code congestion) dù công suất còn.</p></div>

  <div class="panel"><h3>Kênh logic, kênh truyền tải và kênh vật lý</h3><p class="hint">Bấm một kênh để tô chuỗi ánh xạ.</p>
  <div class="scroll"><div class="u3wide" style="min-width:720px" id="u3Ch">${u3ChSvg()}</div></div><div class="u3box" id="u3ChInfo">${u3ChInfo()}</div></div>

  <div class="panel"><h3>Điều khiển công suất vòng trong (1500 Hz) và vòng ngoài</h3>
  <p class="e2d">Vòng trong: mỗi slot (0,667 ms) NodeB so SIR đo với SIR target rồi gửi lệnh TPC tăng/giảm. Vòng ngoài ở RNC: mỗi khối truyền tải (TTI 20 ms) xem CRC; lỗi thì tăng SIR target, đúng thì giảm một chút sao cho BLER đạt mục tiêu. Công suất UE "lật ngược" fading: kênh xấu thì phát mạnh lên.</p>
  <div class="ctl">${uSel('phy','pc','Chế độ',[['io','Vòng trong + vòng ngoài'],['i','Chỉ vòng trong (target cố định 6 dB)'],['off','Không điều khiển nhanh (chỉ vòng hở)']])}${uSl('phy','v','Tốc độ UE',3,120,1,v=>v+' km/h')}${uSel('phy','step','Bước TPC',[[0.5,'0,5 dB'],[1,'1 dB'],[2,'2 dB']])}${uSl('phy','bler','BLER mục tiêu',0.1,10,0.1,v=>uF(v,1)+' %',uPn('bler'))}${uSl('phy','dist','Khoảng cách tới NodeB',0.1,3,0.05,v=>uF(v*1000,0)+' m')}</div>
  <div class="scroll"><div class="u3wide" style="min-width:560px" id="u3Pc"></div></div><dl class="kv" id="u3PcSt"></dl>
  <p class="note">Tốc độ cao (Doppler lớn) làm vòng trong bám không kịp: SIR dao động mạnh hơn, vòng ngoài phải đẩy target lên. Xa trạm: UE chạm 24 dBm, SIR tụt, BLER vượt mục tiêu (giới hạn vùng phủ đường lên).</p></div>

  <div class="panel"><h3>Tải đường lên, nhiễu (RTWP) và thở cell</h3>
  <p class="e2d">Mỗi UE là nhiễu của các UE khác. Hệ số tải η = (1+i)·Σ 1/(1 + W/(Eb/No·R·ν)); noise rise = −10·log(1−η). Tải tăng thì sàn nhiễu tăng, UE ở biên phải phát mạnh hơn, đến khi chạm công suất tối đa thì vùng phủ co lại: đó là thở cell.</p>
  <div class="ctl">${uSl('phy','nV','Số cuộc thoại AMR',0,100,1,v=>v)}${uSl('phy','nP','Số phiên PS 64k',0,30,1,v=>v)}${uSl('phy','nH','Số phiên PS 384k',0,6,1,v=>v)}${uSl('phy','oi','Nhiễu cell khác / cell mình (i)',0.2,1.2,0.05,v=>uF(v,2))}${uSl('phy','ebno','Eb/No yêu cầu cho thoại',3,8,0.5,v=>uF(v,1)+' dB')}${uSl('phy','adm','Ngưỡng điều khiển nhận UL',50,95,1,v=>v+' %',uPn('ulAdm'))}${uSl('phy','ext','Nhiễu ngoài (so với sàn nhiễu)',0,20,1,v=>v?'+'+v+' dB':'không')}${uSl('phy','indoor','Suy hao xuyên tường',0,25,1,v=>v+' dB')}</div>
  <div class="e2row" style="margin-top:8px"><button type="button" class="btn sm pri" data-u3a="phy:run24" id="u3Run24">${P.run24?'❚❚ Dừng':'▶ Chạy 24 giờ'}</button><span class="note">Số người dùng nhân theo hồ sơ lưu lượng trong ngày.</span></div>
  <div class="cols"><div><div id="u3UlA">${ul.a}</div></div><div><div id="u3UlB">${ul.b}</div></div></div>
  <dl class="kv" id="u3UlSt">${u3UlStats(ul.u)}</dl>
  <p class="note">Sàn nhiễu nhiệt 5 MHz −108,1 dBm cộng hệ số tạp âm 3 dB = −105,1 dBm. Mô hình suy hao 137,4 + 35,2·log d (km), độ lợi anten 18 dBi, dự trữ fading 7 dB: chỉ để minh hoạ xu hướng. RTWP cao mà ít lưu lượng thường là nhiễu ngoài (xem bảng lỗi ở mục Tham số, KPI, lỗi).</p></div>`;},
 after(){this.sprNote();this.pcDraw();this.ovLog();},
 sprNote(){const R=u3Spread(),el=$('#u3SprNote');if(el)el.innerHTML=`<p class="e2x" style="color:${R.conflict?'var(--warn)':'var(--k1)'}"><b>${R.conflict?'Không trực giao':'Trực giao'}:</b> ${R.conflict?'mã B nằm trên cùng nhánh cây với mã A (là cha, con hoặc trùng), nên khi giải trải phổ A còn sót năng lượng của B, ký hiệu khôi phục sai lệch (ô đỏ). Đây là lý do khi cấp một mã thì mọi mã cha và con của nó bị chặn.':'mã A và mã B ở hai nhánh khác nhau, giải trải phổ A cho đúng ±1 dù B phát cùng lúc.'} Độ lợi xử lý của A: ${uF(10*Math.log10(U3P.phy.sfA),1)} dB; tốc độ ký hiệu ${uF(3840/U3P.phy.sfA,0)} ksps.</p>`;},
 pcDraw(){const a=$('#u3Pc');if(a)a.innerHTML=u3PcSvg();const b=$('#u3PcSt');if(b)b.innerHTML=u3PcStats();},
 ovLog(){const l=$('#u3OvLog');if(l)l.innerHTML=U3O.ev.slice(0,8).map(e=>`<li><span class="u3t">${Math.floor(e[0]/60)}′${String(Math.floor(e[0]%60)).padStart(2,'0')}″</span> ${uE(e[1])}</li>`).join('')||'<li class="note">Chưa có sự kiện chặn.</li>';},
 tick(dt){const P=U3P.phy;
  /* điều khiển công suất: 0,2× thời gian thực (300 slot/giây) */
  U3PC.acc+=dt*300;let n=Math.floor(U3PC.acc);U3PC.acc-=n;if(n>40)n=40;for(let i=0;i<n;i++)u3PcSlot();
  this._pf=(this._pf||0)+dt;if(this._pf>0.05){this._pf=0;this.pcDraw();}
  if(U3O.run){u3OvStep(dt*P.spd);this._of=(this._of||0)+dt;if(this._of>0.15){this._of=0;const o=$('#u3Ov');if(o)o.innerHTML=u3OvSvg();const s=$('#u3OvSt');if(s)s.innerHTML=u3OvStats();this.ovLog();}}
  if(P.run24){U3UL.h=(U3UL.h+dt*1.2)%24;this._uf=(this._uf||0)+dt;if(this._uf>0.12){this._uf=0;this.ulDraw();}}
 },
 ulDraw(){const r=u3UlSvg();const a=$('#u3UlA'),b=$('#u3UlB'),s=$('#u3UlSt');if(a)a.innerHTML=r.a;if(b)b.innerHTML=r.b;if(s)s.innerHTML=u3UlStats(r.u);},
 upd(k){const P=U3P.phy;
  if(k==='sfA'||k==='sfB'){if(P.kA>=P.sfA)P.kA=P.sfA-1;if(P.kB>=P.sfB)P.kB=P.sfB-1;renderU3();return;}
  if(k==='kA'||k==='kB'){const s=$('#u3Spr');if(s)s.innerHTML=u3SpreadSvg(null);this.sprNote();return;}
  if(k==='hsN'){U3O.hsCur=P.hsN;u3OvHs();const o=$('#u3Ov');if(o)o.innerHTML=u3OvSvg();const s=$('#u3OvSt');if(s)s.innerHTML=u3OvStats();return;}
  if(['pc','v','step','bler','dist'].includes(k)){if(k==='pc'){U3PC.tgt=6;U3PC.errs=U3PC.blk=0;U3PC.tti=[];}U3PC.sumP=U3PC.nP=U3PC.maxc=0;if(!U3.raf){for(let i=0;i<1500;i++)u3PcSlot();}this.pcDraw();return;}
  if(['nV','nP','nH','oi','ebno','adm','ext','indoor'].includes(k))this.ulDraw();},
 act(a,el){const P=U3P.phy,p=el.dataset.u3a.split(':');
  if(a==='ovreset'){u3OvReset();const o=$('#u3Ov');if(o)o.innerHTML=u3OvSvg();const s=$('#u3OvSt');if(s)s.innerHTML=u3OvStats();this.ovLog();return;}
  if(a==='ovrun'){U3O.run=!U3O.run;el.textContent=U3O.run?'❚❚ Dừng':'▶ Chạy tải';if(U3O.run)u3Start();return;}
  if(a==='run24'){P.run24=P.run24?0:1;el.textContent=P.run24?'❚❚ Dừng':'▶ Chạy 24 giờ';this.ulDraw();if(P.run24)u3Start();return;}
  if(a==='ch'){U3CHS=p[2];$('#u3Ch').innerHTML=u3ChSvg();$('#u3ChInfo').innerHTML=u3ChInfo();return;}
  if(a==='ov'){const sf=+p[2],k=+p[3],i=U3O.al.findIndex(q=>q.sf===sf&&q.k===k);
   if(i>=0){if(U3O.al[i].t==='com'){U3O.ev.unshift([U3O.t,'Không thu hồi được kênh chung Cch,'+sf+','+k]);}else{uOvSet(sf,k,0);U3O.al.splice(i,1);U3O.ev.unshift([U3O.t,'Thu hồi tay Cch,'+sf+','+k]);}}
   else if(uOvFree(sf,k)){const ty=sf===128?'amr':sf===32?'p64':sf===16?'p128':sf<=8?'p384':'p64';uOvSet(sf,k,ty==='amr'?4:ty==='p64'?5:ty==='p128'?6:7);U3O.al.push({sf,k,t:ty,end:U3O.t+1e9});U3O.ev.unshift([U3O.t,'Cấp tay Cch,'+sf+','+k+' (chặn mọi mã cha và con)']);}
   else U3O.ev.unshift([U3O.t,'Cch,'+sf+','+k+' bị chặn: nhánh đã có mã đang dùng']);
   $('#u3Ov').innerHTML=u3OvSvg();$('#u3OvSt').innerHTML=u3OvStats();this.ovLog();}
 }
};

/* ---------- Mục 3: Trạng thái RRC và chuyển trạng thái theo lưu lượng ---------- */
U3P.rrc={prof:'mix',t1:5,t2:10,t3:120,thr:1024,pch:1,ura:1,fd:0,fdT:3,mob:2,hsr:7,seed:3,spd:6,T:240};
const U3ST={IDLE:{n:'Idle',c:'var(--u6)',mA:2},DCH:{n:'CELL_DCH',c:'var(--u4)',mA:220},FACH:{n:'CELL_FACH',c:'var(--u2)',mA:110},PCH:{n:'CELL_PCH',c:'var(--u1)',mA:4},URA:{n:'URA_PCH',c:'var(--u3)',mA:3}};
const U3PROF={web:'Duyệt web (trang 0,2–1,5 MB, đọc 15–45 s)',chat:'Nhắn tin, keep-alive (gói nhỏ định kỳ)',mix:'Web + nhắn tin nền',video:'Video (nạp bộ đệm 1,5 MB mỗi 10 s)',file:'Tải một tệp lớn 25 MB',voice:'Cuộc gọi thoại CS 20–80 s + nhắn tin nền'};
const U3RM={
 'IDLE>DCH':['RRC Connection Request','RRC Connection Setup (trên DCH)','RRC Connection Setup Complete','Initial Direct Transfer (Service Request)','Security Mode Command','Security Mode Complete','Radio Bearer Setup','Radio Bearer Setup Complete'],
 'IDLE>FACH':['RRC Connection Request','RRC Connection Setup (trên FACH)','RRC Connection Setup Complete','Initial Direct Transfer (Service Request)','Security Mode Command','Security Mode Complete','Radio Bearer Setup','Radio Bearer Setup Complete'],
 'FACH>DCH':['Measurement Report (e4a: lưu lượng vượt ngưỡng)','Radio Bearer Reconfiguration (lên DCH/HS-DSCH)','Radio Bearer Reconfiguration Complete'],
 'DCH>FACH':['Radio Bearer Reconfiguration (xuống FACH)','Radio Bearer Reconfiguration Complete'],
 'FACH>PCH':['Physical Channel Reconfiguration (sang CELL_PCH)','Physical Channel Reconfiguration Complete'],
 'FACH>URA':['Physical Channel Reconfiguration (sang URA_PCH)','Physical Channel Reconfiguration Complete'],
 'PCH>FACH':['Cell Update (nguyên nhân: dữ liệu đường lên / trả lời tìm gọi)','Cell Update Confirm','UTRAN Mobility Information Confirm'],
 'URA>FACH':['Cell Update (dữ liệu / trả lời tìm gọi)','Cell Update Confirm','UTRAN Mobility Information Confirm'],
 'PCH>URA':['Cell Update (chọn lại cell)','Cell Update Confirm (chuyển URA_PCH)'],
 'PCH>IDLE':['Paging type 1','Cell Update','RRC Connection Release','RRC Connection Release Complete'],
 'URA>IDLE':['Paging type 1','Cell Update','RRC Connection Release','RRC Connection Release Complete'],
 'FACH>IDLE':['RRC Connection Release','RRC Connection Release Complete'],
 'DCH>IDLE':['RRC Connection Release','RRC Connection Release Complete'],
 'DCH>PCH':['Signalling Connection Release Indication (fast dormancy)','Physical Channel Reconfiguration (sang CELL_PCH)','Physical Channel Reconfiguration Complete'],
 'CU':['Cell Update (chọn lại cell)','Cell Update Confirm'],
 'UU':['URA Update','URA Update Confirm']
};
let U3RS=null;const U3RA={t:0,play:1,hold:0};
function u3RrcTraffic(P){const r=uRng(P.seed*7919+11),A=[],T=P.T;let cs=null;
  const web=()=>{let t=2+r()*4;while(t<T){const sz=2e5+Math.pow(r(),2)*1.3e6;A.push([t,2000]);A.push([t+0.15,sz*0.6]);A.push([t+0.8,sz*0.25]);A.push([t+1.6,sz*0.15]);t+=15+r()*30;}};
  const chat=()=>{let t=5+r()*8;while(t<T){A.push([t,300+r()*600]);t+=8+r()*32;}};
  if(P.prof==='web')web();else if(P.prof==='chat')chat();else if(P.prof==='mix'){web();chat();}
  else if(P.prof==='video'){for(let t=5;t<T-10;t+=10)A.push([t,1.5e6]);}
  else if(P.prof==='file'){A.push([5,2.5e7]);A.push([T-40,2000]);}
  else if(P.prof==='voice'){chat();cs=[20,80];}
  A.sort((a,b)=>a[0]-b[0]);
  const rs=[];let t=0;if(P.mob>0){while(true){t+=-Math.log(1-r()*0.999)*60/P.mob;if(t>=T)break;rs.push(t);}}
  return {A,cs,rs};}
function u3RrcSim(){const P=U3P.rrc,{A,cs,rs}=u3RrcTraffic(P),dt=0.01,T=P.T;
  const rate={DCH:P.hsr*1e6/8,FACH:4000},dly={'IDLE>DCH':1.8,'IDLE>FACH':1.2,'PCH>FACH':0.3,'URA>FACH':0.35,'FACH>DCH':0.6};
  let st='IDLE',buf=0,pend=null,last=-1e9,entry=0,ai=0,ri=0,wait=null,cuN=0;
  const tl=[],ev=[],tm={IDLE:0,DCH:0,FACH:0,PCH:0,URA:0};let msgs=0,trans=0,energy=0,dsum=0,dn=0,fd=0,cuTot=0,uraUp=0,pg=0;
  const go=(to,key,note)=>{const k=key||st+'>'+to;const m=U3RM[k]||[];msgs+=m.length;trans++;ev.push([t,st,to,m,note||'']);st=to;entry=t;};
  let t=0;
  for(let n=0;n*dt<T;n++){t=n*dt;
    const inCall=cs&&t>=cs[0]&&t<cs[1];
    if(pend&&t>=pend.at){go(pend.to,pend.key,pend.note);pend=null;}
    while(ai<A.length&&A[ai][0]<=t){if(buf<=0&&!['DCH','FACH'].includes(st)&&wait==null)wait=t;buf+=A[ai][1];last=t;ai++;}
    if(inCall){last=t;if(st!=='DCH'&&!pend){const k=st==='IDLE'?'IDLE>DCH':st==='FACH'?'FACH>DCH':st+'>FACH';pend={to:st==='IDLE'||st==='FACH'?'DCH':'FACH',at:t+(dly[k]||0.5),key:k,note:st==='IDLE'?'Cuộc gọi thoại CS: RRC thiết lập thẳng trên DCH':'Cuộc gọi thoại cần DCH'};}}
    if(buf>0&&!pend){
      if(st==='IDLE'){const to=buf>P.thr?'DCH':'FACH';pend={to,at:t+dly['IDLE>'+to],key:'IDLE>'+to,note:'Có dữ liệu, '+(to==='DCH'?'lượng lớn hơn ngưỡng nên lập thẳng trên DCH':'lượng nhỏ nên lập trên FACH')};}
      else if(st==='PCH'||st==='URA'){pg++;pend={to:'FACH',at:t+dly[st+'>FACH'],key:st+'>FACH',note:'Có dữ liệu: UE gửi Cell Update (dữ liệu xuống thì mạng tìm gọi trước)'};}
      else if(st==='FACH'&&buf>P.thr){pend={to:'DCH',at:t+dly['FACH>DCH'],key:'FACH>DCH',note:'Bộ đệm '+Math.round(buf)+' B vượt ngưỡng 4a ('+P.thr+' B)'};}}
    if(st==='FACH'&&buf>P.thr&&!pend&&!inCall)pend={to:'DCH',at:t+dly['FACH>DCH'],key:'FACH>DCH',note:'Bộ đệm vượt ngưỡng 4a'};
    if(rate[st]&&buf>0){const s=Math.min(buf,rate[st]*dt);buf-=s;last=t;if(wait!=null){dsum+=t-wait;dn++;wait=null;}}
    if(buf<=0&&!pend&&!inCall){const idle=t-Math.max(last,entry);
      if(st==='DCH'){if(P.fd&&P.fdT<P.t1&&t-last>=P.fdT){fd++;if(P.pch)go('PCH','DCH>PCH','Fast dormancy: UE báo không còn dữ liệu (SCRI), mạng đưa thẳng về CELL_PCH');else go('IDLE','DCH>IDLE','Fast dormancy kiểu cũ: SCRI rồi giải phóng hẳn về Idle');}
        else if(idle>=P.t1)go('FACH','DCH>FACH','Không có dữ liệu '+P.t1+' s (bộ đếm DCH→FACH hết)');}
      else if(st==='FACH'&&idle>=P.t2){if(P.pch)go('PCH','FACH>PCH','Không có dữ liệu '+P.t2+' s ở CELL_FACH');else go('IDLE','FACH>IDLE','Không bật CELL_PCH: giải phóng về Idle');}
      else if((st==='PCH'||st==='URA')&&idle>=P.t3)go('IDLE',st+'>IDLE','Không có dữ liệu '+P.t3+' s ở '+U3ST[st].n+': giải phóng kết nối');}
    while(ri<rs.length&&rs[ri]<=t){if(st==='PCH'){cuN++;cuTot++;msgs+=2;ev.push([t,'PCH','PCH',U3RM.CU,'Chọn lại cell ở CELL_PCH: phải báo Cell Update']);
        if(P.ura&&cuN>=2&&!pend){go('URA','PCH>URA','Chọn lại cell nhiều lần: chuyển URA_PCH để giảm Cell Update');cuN=0;}}
      else if(st==='URA'&&((ri*7)%10===0)){uraUp++;msgs+=2;ev.push([t,'URA','URA',U3RM.UU,'Sang URA mới: URA Update']);}
      ri++;}
    if(st!=='PCH')cuN=0;
    tm[st]+=dt;energy+=(U3ST[st].mA+(pend?120:0))*dt/3600;
    if(n%10===0)tl.push([t,st,buf]);}
  return {tl,ev,tm,msgs,trans,energy,dly:dn?dsum/dn:0,dn,fd,cuTot,uraUp,pg,A,cs,T};}
function u3RrcStAt(t){const R=U3RS;let i=Math.min(R.tl.length-1,Math.max(0,Math.floor(t*10)));return R.tl[i];}
function u3RrcDiag(){const cur=U3RS?u3RrcStAt(U3RA.t)[1]:'IDLE';const P=U3P.rrc;
  const N={IDLE:[95,175],DCH:[340,75],FACH:[340,235],PCH:[590,130],URA:[590,280]};
  const last=U3RS?U3RS.ev.filter(e=>e[0]<=U3RA.t&&e[1]!==e[2]).slice(-1)[0]:null;
  let s=`<svg viewBox="0 0 700 330" class="u3svg" style="max-width:820px;margin:0 auto" role="img" aria-label="Sơ đồ trạng thái RRC"><defs><marker id="u3ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker><marker id="u3ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--warn)"/></marker></defs>`;
  s+=`<rect x="220" y="18" width="470" height="304" rx="14" class="u3zone"/><text x="234" y="38" class="u3zt">Chế độ kết nối (RRC Connected)</text>`;
  const ar=(a,b,l,dy)=>{const A=N[a],B=N[b],on=last&&last[1]===a&&last[2]===b;const dis=(a==='PCH'||b==='PCH')&&!P.pch||(a==='URA'||b==='URA')&&!P.ura;
    const dx=B[0]-A[0],dyy=B[1]-A[1],L=Math.hypot(dx,dyy),ux=dx/L,uy=dyy/L,o=dy||0,ox=-uy*o,oy=ux*o;
    const ex=Math.min(Math.abs(78/(ux||1e-9)),Math.abs(30/(uy||1e-9)));
    const x1=A[0]+ux*ex+ox,y1=A[1]+uy*ex+oy,x2=B[0]-ux*ex+ox,y2=B[1]-uy*ex+oy,lx=x1+(x2-x1)*0.5+ox*2.2,ly=y1+(y2-y1)*0.5+oy*2.2+4;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${on?'var(--warn)':'var(--muted)'};stroke-width:${on?3:1.4};opacity:${dis?.25:1}" marker-end="url(#${on?'u3ah2':'u3ah'})"/>${l?`<text x="${lx}" y="${ly}" class="u3ax u3al" text-anchor="middle" style="opacity:${dis?.3:1}">${uE(l)}</text>`:''}`;};
  s+=ar('IDLE','DCH','RRC setup',-12)+ar('DCH','IDLE','release',-12)+ar('IDLE','FACH','RRC setup',-12)+ar('FACH','IDLE','release',-12)+ar('FACH','DCH','e4a',-14)+ar('DCH','FACH','T DCH→FACH',-14)+ar('FACH','PCH','T FACH→PCH',-12)+ar('PCH','FACH','Cell Update',-12)+ar('FACH','URA','',-12)+ar('URA','FACH','Cell Update',-12)+ar('PCH','URA','nhiều Cell Update',-14);
  if(P.fd&&P.pch)s+=ar('DCH','PCH','SCRI',0);
  for(const k in N){const p=N[k],on=k===cur,dis=k==='PCH'&&!P.pch||k==='URA'&&!P.ura;
    s+=`<g style="opacity:${dis?.3:1}"><rect x="${p[0]-78}" y="${p[1]-26}" width="156" height="52" rx="12" style="fill:${on?U3ST[k].c:'var(--panel)'};stroke:${U3ST[k].c};stroke-width:${on?3:2}"/><text x="${p[0]}" y="${p[1]-2}" text-anchor="middle" class="u3nt" style="${on?'fill:#fff':''}">${U3ST[k].n}</text><text x="${p[0]}" y="${p[1]+15}" text-anchor="middle" class="u3ax" style="${on?'fill:#fff':''}">${{IDLE:'không kết nối RRC',DCH:'kênh riêng / HSPA',FACH:'kênh chung, tốc độ thấp',PCH:'ngủ, biết theo cell',URA:'ngủ, biết theo URA'}[k]}</text></g>`;}
  return s+'</svg>';}
function u3RrcTl(){const R=U3RS,P=U3P.rrc,T=R.T,W=760,L=70,iw=W-L-10;const X=t=>L+t/T*iw;
  const rows=['DCH','FACH','PCH','URA','IDLE'],rh=18,y0=46;let s=`<svg viewBox="0 0 ${W} ${y0+rows.length*rh+40}" class="u3svg" role="img" aria-label="Dòng thời gian trạng thái RRC">`;
  s+=`<text x="4" y="14" class="u3ax">Dữ liệu đến</text>`;
  R.A.forEach(a=>{const h=Math.min(30,4+Math.log10(Math.max(1,a[1]))*4);s+=`<rect x="${X(a[0])-1}" y="${40-h}" width="2.4" height="${h}" style="fill:var(--up)"/>`;});
  if(R.cs)s+=`<rect x="${X(R.cs[0])}" y="34" width="${X(R.cs[1])-X(R.cs[0])}" height="6" style="fill:var(--cp)"/><text x="${X(R.cs[0])}" y="30" class="u3ax">thoại CS</text>`;
  rows.forEach((r,i)=>{const y=y0+i*rh;s+=`<text x="4" y="${y+13}" class="u3ax">${U3ST[r].n}</text><line x1="${L}" x2="${L+iw}" y1="${y+rh}" y2="${y+rh}" class="u3grid"/>`;});
  let segS=0,segT=R.tl[0][1];const flush=(a,b,st)=>{const i=rows.indexOf(st);s+=`<rect x="${X(a)}" y="${y0+i*rh+2}" width="${Math.max(1,X(b)-X(a))}" height="${rh-4}" rx="2" style="fill:${U3ST[st].c}"/>`;};
  R.tl.forEach((p,i)=>{if(p[1]!==segT){flush(segS,p[0],segT);segS=p[0];segT=p[1];}});flush(segS,T,segT);
  for(let t=0;t<=T;t+=30)s+=`<text x="${X(t)}" y="${y0+rows.length*rh+16}" class="u3ax" text-anchor="middle">${t} s</text>`;
  s+=`<line id="u3RrcCur" x1="${X(U3RA.t)}" x2="${X(U3RA.t)}" y1="4" y2="${y0+rows.length*rh}" class="u3cur"/>`;
  return s+'</svg>';}
function u3RrcStats(){const R=U3RS,T=R.T;const pc=k=>uF(R.tm[k]/T*100,1)+' %';
  return `<dt>Thời gian CELL_DCH</dt><dd>${pc('DCH')}</dd><dt>Thời gian CELL_FACH</dt><dd>${pc('FACH')}</dd><dt>Thời gian CELL_PCH / URA_PCH</dt><dd>${pc('PCH')} / ${pc('URA')}</dd><dt>Thời gian Idle</dt><dd>${pc('IDLE')}</dd>
  <dt>Số lần chuyển trạng thái</dt><dd>${R.trans}</dd><dt>Bản tin RRC (ước tính)</dt><dd>${R.msgs}</dd><dt>Cell Update do chọn lại cell / URA Update</dt><dd>${R.cuTot} / ${R.uraUp}</dd>
  <dt>Trễ trung bình trước gói đầu tiên</dt><dd>${R.dn?uF(R.dly*1000,0)+' ms':'—'}</dd><dt>Năng lượng UE (tương đối)</dt><dd>${uF(R.energy,2)} mAh</dd>${R.fd?`<dt>Fast dormancy kích hoạt</dt><dd>${R.fd} lần</dd>`:''}`;}
function u3RrcLog(){const R=U3RS,list=R.ev.filter(e=>e[0]<=U3RA.t).slice(-7).reverse();
  return list.map(e=>`<li><span class="u3t">${uF(e[0],1)} s</span> <b>${e[1]===e[2]?U3ST[e[1]].n:U3ST[e[1]].n+' → '+U3ST[e[2]].n}</b>${e[4]?' · '+uE(e[4]):''}<br><span class="u3msg">${e[3].map(uE).join(' → ')}</span></li>`).join('')||'<li class="note">Chưa có chuyển trạng thái.</li>';}
U3R.rrc={
 html(){const P=U3P.rrc;U3RS=u3RrcSim();
  return `<div class="panel"><h3>Năm trạng thái của UE 3G</h3>
  <div class="scroll"><div class="u3wide" style="min-width:560px" id="u3RrcD">${u3RrcDiag()}</div></div>
  <div class="scroll"><table class="e2tb u3w"><thead><tr><th>Trạng thái</th><th>Kênh dùng</th><th>Mạng biết UE ở đâu</th><th>Di động</th><th>Tốc độ / trễ</th><th>Pin UE</th></tr></thead><tbody>
  <tr><td>Idle</td><td>Không có kết nối RRC; nghe PICH/PCH theo chu kỳ DRX</td><td>Theo LA (CS) / RA (PS) ở lõi</td><td>Chọn lại cell, LAU/RAU</td><td>Lập kết nối mất 1–2 s</td><td>Rất thấp</td></tr>
  <tr><td>CELL_DCH</td><td>DCH riêng, HS-DSCH, E-DCH</td><td>Theo cell (active set)</td><td>Chuyển giao do mạng điều khiển (soft/hard HO)</td><td>Cao nhất, trễ thấp nhất</td><td>Cao nhất</td></tr>
  <tr><td>CELL_FACH</td><td>RACH lên, FACH xuống (Rel-7/8: HS-FACH, E-RACH)</td><td>Theo cell</td><td>UE tự chọn lại cell, báo Cell Update</td><td>Vài chục kbps</td><td>Khoảng một nửa DCH</td></tr>
  <tr><td>CELL_PCH</td><td>Không kênh nào; nghe PICH theo DRX</td><td>Theo cell</td><td>Mỗi lần đổi cell phải Cell Update</td><td>Lên FACH mất ~0,3 s</td><td>Thấp như Idle</td></tr>
  <tr><td>URA_PCH</td><td>Như CELL_PCH</td><td>Theo URA (nhóm cell)</td><td>Chỉ báo URA Update khi đổi URA</td><td>Như CELL_PCH</td><td>Thấp nhất khi di chuyển nhiều</td></tr></tbody></table></div>
  <p class="note">Kết nối RRC vẫn giữ ở FACH, PCH, URA_PCH nên quay lại nhanh và không phải lập lại bảo mật, RAB. Chuyển FACH → DCH dựa trên đo lưu lượng (sự kiện 4a khi bộ đệm vượt ngưỡng, 4b khi dưới ngưỡng).</p></div>

  <div class="panel"><h3>Mô phỏng chuyển trạng thái theo lưu lượng và bộ đếm</h3>
  <div class="ctl">${uSel('rrc','prof','Kiểu lưu lượng',Object.keys(U3PROF).map(k=>[k,U3PROF[k]]))}${uSl('rrc','t1','Bộ đếm DCH → FACH',1,30,1,v=>v+' s',uPn('d2f'))}${uSl('rrc','t2','Bộ đếm FACH → PCH',1,60,1,v=>v+' s',uPn('f2p'))}${uSl('rrc','t3','Bộ đếm PCH → Idle',10,600,10,v=>v+' s',uPn('p2i'))}${uSl('rrc','thr','Ngưỡng 4a FACH → DCH',128,8192,128,v=>v+' B',uPn('e4a'))}${uSl('rrc','mob','Số lần chọn lại cell mỗi phút',0,10,1,v=>v)}${uSl('rrc','hsr','Tốc độ trên DCH/HSPA',0.4,21,0.1,v=>uF(v,1)+' Mbps')}${uSl('rrc','spd','Tốc độ phát lại',1,20,1,v=>v+'×')}</div>
  <div class="e2row" style="margin-top:10px">${uChk('rrc','pch','Bật CELL_PCH')}${uChk('rrc','ura','Bật URA_PCH')}${uChk('rrc','fd','UE dùng fast dormancy (SCRI sau '+P.fdT+' s)')}
  <button type="button" class="btn sm" data-u3a="rrc:seed">Tạo lưu lượng khác</button><button type="button" class="btn sm" data-u3a="rrc:rew">⏮ Về đầu</button><button type="button" class="btn sm pri" data-u3a="rrc:play" id="u3RrcPlay">${U3RA.play?'❚❚ Dừng':'▶ Chạy'}</button></div>
  <div class="scroll"><div class="u3wide" style="min-width:640px" id="u3RrcTl">${u3RrcTl()}</div></div>
  ${uLeg(Object.keys(U3ST).map(k=>[U3ST[k].n,U3ST[k].c]).concat([['Gói dữ liệu đến (cao theo log kích thước)','var(--up)']]))}
  <div class="cols"><div><p class="e2x"><b>Đang ở:</b> <span id="u3RrcNow"></span></p><ol class="u3log" id="u3RrcLog">${u3RrcLog()}</ol></div><dl class="kv" id="u3RrcSt">${u3RrcStats()}</dl></div>
  <p class="note">Bộ đếm ngắn: tiết kiệm mã, công suất, pin nhưng nhiều chuyển trạng thái, nhiều báo hiệu, trễ lần đầu cao. Bộ đếm dài: ngược lại. Mạng nhiều smartphone thường bật CELL_PCH/URA_PCH và fast dormancy Rel-8 để tránh UE tự giải phóng về Idle rồi lập lại liên tục (bão báo hiệu). Thời gian lập kết nối và tốc độ FACH 32 kbps là giá trị minh hoạ.</p></div>`;},
 after(){this.now();},
 now(){const e=$('#u3RrcNow');if(e&&U3RS){const p=u3RrcStAt(U3RA.t);e.innerHTML=`<b style="color:${U3ST[p[1]].c}">${U3ST[p[1]].n}</b> · t = ${uF(U3RA.t,1)} s · bộ đệm ${uF(p[2]/1000,1)} kB`;}},
 draw(full){if(full){const d=$('#u3RrcTl');if(d)d.innerHTML=u3RrcTl();const s=$('#u3RrcSt');if(s)s.innerHTML=u3RrcStats();}
  const c=$('#u3RrcCur');if(c){const x=70+U3RA.t/U3RS.T*680;c.setAttribute('x1',x);c.setAttribute('x2',x);}
  const g=$('#u3RrcD');if(g)g.innerHTML=u3RrcDiag();const l=$('#u3RrcLog');if(l)l.innerHTML=u3RrcLog();this.now();},
 tick(dt){if(!U3RA.play||!U3RS)return;if(U3RA.hold>0){U3RA.hold-=dt;if(U3RA.hold<=0)U3RA.t=0;return;}
  const prev=u3RrcStAt(U3RA.t)[1],pe=U3RS.ev.filter(e=>e[0]<=U3RA.t).length;U3RA.t+=dt*U3P.rrc.spd;if(U3RA.t>=U3RS.T){U3RA.t=U3RS.T;U3RA.hold=2;}
  const c=$('#u3RrcCur');if(c){const x=70+U3RA.t/U3RS.T*680;c.setAttribute('x1',x);c.setAttribute('x2',x);}
  if(u3RrcStAt(U3RA.t)[1]!==prev||U3RS.ev.filter(e=>e[0]<=U3RA.t).length!==pe){const g=$('#u3RrcD');if(g)g.innerHTML=u3RrcDiag();const l=$('#u3RrcLog');if(l)l.innerHTML=u3RrcLog();}
  this._n=(this._n||0)+dt;if(this._n>0.1){this._n=0;this.now();}},
 upd(k){if(k==='spd')return;U3RS=u3RrcSim();if(U3RA.t>U3RS.T)U3RA.t=0;this.draw(true);},
 act(a,el){if(a==='play'){U3RA.play=U3RA.play?0:1;el.textContent=U3RA.play?'❚❚ Dừng':'▶ Chạy';if(U3RA.play)u3Start();}
  else if(a==='rew'){U3RA.t=0;U3RA.hold=0;this.draw(false);}
  else if(a==='seed'){U3P.rrc.seed++;U3RS=u3RrcSim();U3RA.t=0;this.draw(true);}}
};

/* ---------- Mục 4: Chuyển giao mềm, cứng, IRAT, SRNS relocation ---------- */
U3P.ho={sc:'sho',v:50,r1a:3,r1b:5,h1c:2,h1d:3,ttt1a:320,ttt1b:640,ttt1c:320,ttt1d:640,maxAS:3,k:3,sig:4,load:50,q2:'ecno',t2d:-14,t2f:-12,t2dr:-100,t2fr:-97,tF2:-12,tLte:-110,irm:'ho',spd:10,seed:1};
const U3HOS={
 sho:{n:'Soft và softer HO trong một RNC',len:4200,sites:[['A',400,-200,1,'F1'],['B',2100,220,1,'F1'],['C',3800,-200,1,'F1']]},
 iur:{n:'Soft HO qua Iur sang DRNC, rồi SRNS relocation',len:5300,sites:[['A',400,-200,1,'F1'],['B',1900,220,1,'F1'],['C',3400,-200,2,'F1'],['D',4900,220,2,'F1']]},
 ifho:{n:'Chuyển giao cứng liên tần F1 → F2 (2D, 2B, 2F)',len:4400,f1end:2500,sites:[['A',400,-200,1,'F1'],['B',1700,220,1,'F1'],['E',3300,-200,1,'F2'],['G',4600,220,1,'F2']]},
 irat:{n:'IRAT 3G → 4G LTE (2D, 3A)',len:4400,f1end:2500,sites:[['A',400,-200,1,'F1'],['B',1700,220,1,'F1'],['L',3300,-200,0,'L'],['M',4600,220,0,'L']]}
};
const U3TTT=[0,40,80,160,320,640,1280,2560];
let U3HR=null;const U3HA={t:0,play:1,hold:0};
function u3HoCells(){const sc=U3HOS[U3P.ho.sc],C=[];let ci=0;const col=['var(--u1)','var(--u2)','var(--u3)','var(--u4)','var(--u5)','var(--u6)','var(--k1)','var(--cp)'];
  sc.sites.forEach(s=>{const up=s[2]<0;[[up?150:210,1],[up?30:330,2]].forEach(a=>{C.push({id:s[0]+a[1],site:s[0],x:s[1],y:s[2],az:a[0],rnc:s[3],f:s[4],c:col[ci++%col.length]});});});return C;}
function u3HoSim(){const P=U3P.ho,sc=U3HOS[P.sc],C=u3HoCells(),r=uRng(P.seed*977+5),v=P.v/3.6,T=sc.len/v,dt=0.1;
  const shp=C.map(()=>[0,1,2,3].map(()=>[r()*2*Math.PI,150+r()*450]));
  const gain=(c,x)=>{const ang=Math.atan2(0-c.y,x-c.x)*180/Math.PI;let d=Math.abs(((ang-c.az)%360+540)%360-180);return 15-Math.min(12*Math.pow(d/65,2),20);};
  const Dl=10*Math.log10((0.15+0.85*P.load/100)/0.1),a=1/Math.pow(2,P.k/2);
  const F={},Fr={};let AS=[],sv=null,uf='F1',cm=false,cmT=0,state='3G',srnc=1,dropT=0,lteRsrp=-140;
  const cond={},rec=[],ev=[],cnt={e1a:0,e1b:0,e1c:0,e1d:0,e2d:0,e2f:0,hho:0,irat:0,rel:0,drop:0,softer:0,iur:0};
  let asSum=0,asN=0,cmTime=0,asHist=[0,0,0,0,0,0,0],relSince=null,rlf=0;
  const meas=x=>{const M={};const io={F1:uLin(-100),F2:uLin(-100)};
    C.forEach((c,i)=>{const d=Math.max(0.03,Math.hypot(x-c.x,c.y)/1000);let sh=0;shp[i].forEach(q=>sh+=Math.sin(2*Math.PI*x/q[1]+q[0]));sh*=P.sig/2;
      let ex=0;if(sc.f1end&&c.f==='F1'&&x>sc.f1end)ex=(x-sc.f1end)*0.03;
      const pl=128.1+37.6*Math.log10(d)+ex,rs=(c.f==='L'?15:33)+gain(c,x)-pl+sh;M[c.id]={rscp:rs};if(c.f!=='L')io[c.f]+=uLin(rs+Dl);});
    C.forEach(c=>{if(c.f!=='L')M[c.id].ecno=M[c.id].rscp-uDb(io[c.f]);});return M;};
  const on=(k,c,t,ms)=>{if(c){if(cond[k]==null)cond[k]=t;return t-cond[k]>=ms/1000-1e-9;}cond[k]=null;return false;};
  const E=(t,tag,txt,m)=>{ev.push([t,tag,txt,m||[]]);};
  const best=()=>AS.reduce((b,id)=>b==null||F[id]>F[b]?id:b,null);
  for(let n=0;n*dt<=T;n++){const t=n*dt,x=v*t,M=meas(x);
    C.forEach(c=>{if(c.f==='L'){Fr[c.id]=Fr[c.id]==null?M[c.id].rscp:(1-a)*Fr[c.id]+a*M[c.id].rscp;return;}F[c.id]=F[c.id]==null?M[c.id].ecno:(1-a)*F[c.id]+a*M[c.id].ecno;Fr[c.id]=Fr[c.id]==null?M[c.id].rscp:(1-a)*Fr[c.id]+a*M[c.id].rscp;});
    lteRsrp=Math.max(-140,...C.filter(c=>c.f==='L').map(c=>Fr[c.id]));
    if(n===0){const U=C.filter(c=>c.f===uf).sort((p,q)=>F[q.id]-F[p.id]);AS=[U[0].id];sv=U[0].id;E(0,'start','Bắt đầu cuộc gọi trên '+U[0].id+' (CELL_DCH)',['RRC Connection Setup','Radio Bearer Setup']);}
    if(state==='3G'){
      const U=C.filter(c=>c.f===uf),b=best(),bF=F[b],cid=id=>C.find(c=>c.id===id);
      /* 1A / 1C */
      U.forEach(c=>{if(AS.includes(c.id)){cond['1a'+c.id]=null;cond['1c'+c.id]=null;return;}
        if(AS.length<P.maxAS){if(on('1a'+c.id,F[c.id]>=bF-P.r1a,t,P.ttt1a)){
          const soft=AS.some(id=>cid(id).site===c.site),iur=c.rnc!==srnc;AS.push(c.id);cnt.e1a++;if(soft)cnt.softer++;if(iur)cnt.iur++;cond['1a'+c.id]=null;
          E(t,'1A','Thêm '+c.id+(soft?' (softer: cùng NodeB '+c.site+', kết hợp MRC trong NodeB)':iur?' (cell của DRNC: đi qua Iur)':' (soft HO giữa hai NodeB)'),['Measurement Report (e1a, '+c.id+')',iur?'RNSAP Radio Link Setup Request → DRNC → NBAP Radio Link Setup':soft?'NBAP Radio Link Addition (cùng NodeB)':'NBAP Radio Link Setup Request','Active Set Update (thêm '+c.id+')','Active Set Update Complete']);}}
        else{const w=AS.reduce((p,id)=>p==null||F[id]<F[p]?id:p,null);if(on('1c'+c.id,F[c.id]>=F[w]+P.h1c/2,t,P.ttt1c)){
          AS[AS.indexOf(w)]=c.id;cnt.e1c++;cond['1c'+c.id]=null;if(sv===w)sv=c.id;
          E(t,'1C','Thay '+w+' bằng '+c.id+' (active set đã đủ '+P.maxAS+')',['Measurement Report (e1c)','NBAP Radio Link Setup ('+c.id+')','Active Set Update (thêm '+c.id+', bỏ '+w+')','Active Set Update Complete','NBAP Radio Link Deletion ('+w+')']);}}});
      /* 1B */
      if(AS.length>1)AS.slice().forEach(id=>{const bb=best();if(id===bb){cond['1b'+id]=null;return;}if(on('1b'+id,F[id]<=F[bb]-P.r1b,t,P.ttt1b)){AS.splice(AS.indexOf(id),1);cnt.e1b++;cond['1b'+id]=null;if(sv===id)sv=best();
        E(t,'1B','Bỏ '+id+' khỏi active set',['Measurement Report (e1b, '+id+')','Active Set Update (bỏ '+id+')','Active Set Update Complete',cid(id).rnc!==srnc?'RNSAP Radio Link Deletion':'NBAP Radio Link Deletion']);}});
      /* 1D: đổi cell phục vụ HS-DSCH */
      AS.forEach(id=>{if(id===sv){cond['1d'+id]=null;return;}if(on('1d'+id,F[id]>F[sv]+P.h1d/2,t,P.ttt1d)){const o=sv;sv=id;cnt.e1d++;cond['1d'+id]=null;
        E(t,'1D','Cell tốt nhất đổi '+o+' → '+id+': đổi serving cell HSDPA',['Measurement Report (e1d)','NBAP Radio Link Reconfiguration (HS-DSCH sang '+id+')','Radio Bearer Reconfiguration / Physical Channel Reconfiguration','... Complete']);}});
      if(!AS.includes(sv))sv=best();
      /* SRNS relocation */
      if(P.sc==='iur'){if(AS.every(id=>cid(id).rnc!==srnc)){if(relSince==null)relSince=t;if(t-relSince>=1){const nr=cid(AS[0]).rnc;srnc=nr;cnt.rel++;relSince=null;
          E(t,'REL','SRNS relocation: RNC '+nr+' thành SRNC, giải phóng Iur',['RANAP Relocation Required (RNC cũ → lõi)','RANAP Relocation Request (lõi → RNC '+nr+')','Relocation Request Acknowledge','RANAP Relocation Command','RNSAP Relocation Commit','Relocation Detect, Relocation Complete','UTRAN Mobility Information (U-RNTI mới)','Iu Release (RNC cũ)']);}}else relSince=null;}
      /* 2D / 2F / 2B / 3A */
      const hasX=C.some(c=>c.f!==uf);const bb=best();const Q=P.q2==='ecno'?F[bb]:Fr[bb],t2d=P.q2==='ecno'?P.t2d:P.t2dr,t2f=P.q2==='ecno'?P.t2f:P.t2fr;
      if(hasX&&!cm&&on('2d',Q<t2d,t,320)){cm=true;cmT=t;cnt.e2d++;cond['2d']=null;E(t,'2D','Chất lượng tần đang dùng dưới ngưỡng: bật compressed mode',['Measurement Report (e2d)','NBAP Radio Link Reconfiguration (cấu hình khe nén)','Physical Channel Reconfiguration (TGPS: khe trống để đo '+(C.some(c=>c.f==='L')?'E-UTRA':'F2')+')','Physical Channel Reconfiguration Complete','Measurement Control (đo liên tần / liên hệ thống)']);}
      if(cm&&on('2f',Q>t2f,t,320)){cm=false;cnt.e2f++;cond['2f']=null;E(t,'2F','Chất lượng hồi phục: tắt compressed mode',['Measurement Report (e2f)','Physical Channel Reconfiguration (huỷ khe nén)','... Complete']);}
      if(cm)cmTime+=dt;
      if(cm&&t-cmT>=1.2&&C.some(c=>c.f==='F2'&&c.f!==uf)){const T2=C.filter(c=>c.f==='F2').sort((p,q)=>F[q.id]-F[p.id])[0];
        if(on('2b',F[T2.id]>P.tF2&&Q<t2d,t,320)){const old=AS.slice();AS=[T2.id];sv=T2.id;uf='F2';cm=false;cnt.hho++;cond['2b']=null;
          E(t,'HHO','Chuyển giao cứng liên tần sang '+T2.id+' (F2)',['Measurement Report (e2b, '+T2.id+' Ec/Io '+uF(F[T2.id],1)+' dB)','NBAP Radio Link Setup ('+T2.id+')','Physical Channel Reconfiguration (tần số F2)','UE đồng bộ cell mới, gửi ... Complete','NBAP Radio Link Deletion ('+old.join(', ')+')']);}}
      if(cm&&t-cmT>=1.8&&C.some(c=>c.f==='L')){if(on('3a',lteRsrp>P.tLte&&Q<t2d,t,320)){state='LTE';cnt.irat++;
          E(t,'3A','IRAT sang LTE ('+(P.irm==='ho'?'PS handover':'redirection')+'), RSRP '+uF(lteRsrp,0)+' dBm',P.irm==='ho'?['Measurement Report (e3a, E-UTRA)','RANAP Relocation Required (đích: eNB)','SGSN → MME: Forward Relocation Request (S3/Gn)','MME → eNB: Handover Request / Ack','RANAP Relocation Command','Handover from UTRAN Command (E-UTRA)','UE → eNB: RRC Connection Reconfiguration Complete','Iu Release (3G)']:['Measurement Report (e3a) hoặc hết dữ liệu','RRC Connection Release (redirectionInfo: E-UTRA EARFCN)','UE chọn cell LTE, gửi TAU Request','Iu Release (3G)']);}}
      /* rớt cuộc gọi: chất lượng quá thấp kéo dài (mất đồng bộ, T313) */
      if(on('rlf',F[best()]<-20||Fr[best()]<-117,t,1500)){state='DROP';dropT=t;cnt.drop++;cond['rlf']=null;E(t,'DROP','Rớt cuộc gọi: mất đồng bộ đường truyền (radio link failure)',['NBAP Radio Link Failure Indication','(UE: hết T313, N313)','RANAP Iu Release Request (cause: radio connection with UE lost)']);}
    } else if(state==='DROP'&&t-dropT>3){const U=C.filter(c=>c.f!=='L').sort((p,q)=>F[q.id]-F[p.id]);if(F[U[0].id]>-16){state='3G';uf=U[0].f;AS=[U[0].id];sv=U[0].id;cm=false;srnc=U[0].rnc;E(t,'start','Thiết lập lại cuộc gọi mới trên '+U[0].id,['RRC Connection Request','RRC Connection Setup','...']);}}
    if(state==='3G'){asSum+=AS.length;asN++;asHist[AS.length]++;}
    rec.push({t,x,F:Object.assign({},F),Fr:Object.assign({},Fr),AS:AS.slice(),sv,cm,state,uf,srnc,lte:lteRsrp});}
  return {C,rec,ev,cnt,T,len:sc.len,sho:asN?(asSum/asN-1)*100:0,asHist,asN,cm:cmTime/T*100};}
function u3HoAt(t){const R=U3HR;return R.rec[Math.min(R.rec.length-1,Math.max(0,Math.round(t/0.1)))];}
function u3HoMap(){const R=U3HR,P=U3P.ho,W=900,H=210,sx=860/R.len,cy=110,X=x=>20+x*sx,Y=y=>cy-y*sx*1.25;
  let s=`<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="Bản đồ tuyến đường và các cell"><rect x="0" y="0" width="${W}" height="${H}" class="u3pbg"/>`;
  if(P.sc==='iur'){const xs=Math.min(...R.C.filter(c=>c.rnc===2).map(c=>c.x))-750;s+=`<rect x="${X(xs)}" y="4" width="${W-X(xs)-4}" height="${H-8}" rx="8" style="fill:var(--u5);opacity:.08"/><text x="${X(xs)+8}" y="20" class="u3ax">Vùng RNC 2</text><text x="28" y="20" class="u3ax">Vùng RNC 1</text>`;}
  const sc=U3HOS[P.sc];if(sc.f1end)s+=`<line x1="${X(sc.f1end)}" x2="${X(sc.f1end)}" y1="8" y2="${H-8}" style="stroke:var(--warn);stroke-dasharray:4 4"/><text x="${X(sc.f1end)+4}" y="20" class="u3ax" style="fill:var(--warn)">hết vùng phủ F1</text>`;
  s+=`<line x1="${X(0)}" x2="${X(R.len)}" y1="${cy}" y2="${cy}" style="stroke:var(--muted);stroke-width:7;opacity:.25;stroke-linecap:round"/>`;
  R.C.forEach(c=>{const a1=(c.az-32)*Math.PI/180,a2=(c.az+32)*Math.PI/180,rr=46,x0=X(c.x),y0=Y(c.y);
    s+=`<path d="M${x0} ${y0}L${x0+rr*Math.cos(a1)} ${y0-rr*Math.sin(a1)}A${rr} ${rr} 0 0 0 ${x0+rr*Math.cos(a2)} ${y0-rr*Math.sin(a2)}Z" style="fill:${c.c};opacity:.28;stroke:${c.c}"/><text x="${x0+(rr+12)*Math.cos(c.az*Math.PI/180)}" y="${y0-(rr+12)*Math.sin(c.az*Math.PI/180)+4}" text-anchor="middle" class="u3nt" style="font-size:12px">${c.id}${c.f!=='F1'?' · '+(c.f==='L'?'LTE':c.f):''}</text>`;});
  sc.sites.forEach(si=>{s+=`<rect x="${X(si[1])-6}" y="${Y(si[2])-6}" width="12" height="12" rx="${si[4]==='L'?0:6}" style="fill:var(--ink)"/>`;});
  return s+`<g id="u3HoDyn"></g></svg>`;}
function u3HoDyn(){const R=U3HR,r=u3HoAt(U3HA.t),sx=860/R.len,cy=110,X=x=>20+x*sx,Y=y=>cy-y*sx*1.25;const ux=X(r.x);let s='';
  if(r.state==='3G')r.AS.forEach(id=>{const c=R.C.find(q=>q.id===id);s+=`<line x1="${ux}" y1="${cy}" x2="${X(c.x)}" y2="${Y(c.y)}" style="stroke:${c.c};stroke-width:${id===r.sv?4:2};${id===r.sv?'':'stroke-dasharray:5 3'}"/>`;});
  if(r.state==='LTE'){const c=R.C.filter(q=>q.f==='L').sort((p,q)=>r.Fr[q.id]-r.Fr[p.id])[0];s+=`<line x1="${ux}" y1="${cy}" x2="${X(c.x)}" y2="${Y(c.y)}" style="stroke:var(--lte);stroke-width:4"/>`;}
  s+=`<circle cx="${ux}" cy="${cy}" r="9" style="fill:${r.state==='DROP'?'var(--warn)':'var(--k1)'};stroke:var(--panel);stroke-width:2.5"/><text x="${ux}" y="${cy+26}" text-anchor="middle" class="u3nt">UE${r.cm?' · CM':''}</text>`;
  return s;}
function u3HoCharts(){const R=U3HR,P=U3P.ho,T=R.T,cells=R.C.filter(c=>c.f!=='L');
  const step=Math.max(1,Math.floor(R.rec.length/700));const pick=R.rec.filter((_,i)=>i%step===0);
  const marks=R.ev.filter(e=>e[1]!=='start').map((e,i)=>[e[0],e[1],e[1]==='DROP'?'var(--warn)':e[1]==='REL'||e[1]==='HHO'||e[1]==='3A'?'var(--cp)':'var(--muted)',i%3]);
  const hl=P.q2==='ecno'&&R.C.some(c=>c.f!=='F1')?[[P.t2d,'var(--warn)','2D '+P.t2d+' dB'],[P.t2f,'var(--k1)','2F '+P.t2f+' dB']]:[];
  const a=uPlot({w:820,h:250,x0:0,x1:T,y0:-24,y1:0,yt:[-24,-18,-12,-6,0],xt:[0,T/4,T/2,3*T/4,T].map(v=>Math.round(v)),xf:v=>v+' s',aria:'Ec/Io đã lọc của các cell',ylab:'CPICH Ec/Io dB',
    series:cells.map(c=>({pts:pick.map(r=>[r.t,r.F[c.id]]),c:c.c,w:1.6,dash:c.f==='F2'?'5 3':''})),marks,hl,extra:'<line id="u3HoCur" x1="44" x2="44" y1="10" y2="224" class="u3cur"/>'});
  /* dải active set */
  const W=820,L=44,iw=W-54,rh=14;let b=`<svg viewBox="0 0 ${W} ${cells.length*rh+30}" class="u3svg" role="img" aria-label="Active set theo thời gian">`;
  cells.forEach((c,i)=>{const y=4+i*rh;b+=`<text x="4" y="${y+11}" class="u3ax">${c.id}</text><line x1="${L}" x2="${L+iw}" y1="${y+rh-1}" y2="${y+rh-1}" class="u3grid"/>`;
    let st=null,sv=false;const fl=(t0,t1,s2)=>{b+=`<rect x="${L+t0/T*iw}" y="${y+2}" width="${Math.max(1,(t1-t0)/T*iw)}" height="${rh-4}" style="fill:${c.c};opacity:${s2?1:.45}"/>`;};
    R.rec.forEach(r=>{const inn=r.state==='3G'&&r.AS.includes(c.id),isv=r.sv===c.id;if(inn&&st==null){st=r.t;sv=isv;}else if(st!=null&&(!inn||isv!==sv)){fl(st,r.t,sv);st=inn?r.t:null;sv=isv;}});if(st!=null)fl(st,T,sv);});
  b+=`<text x="${L}" y="${cells.length*rh+22}" class="u3ax">Thanh đậm: cell phục vụ HSDPA (tốt nhất). Thanh nhạt: cell khác trong active set.</text></svg>`;
  /* RSCP và RSRP */
  const ser=[{pts:pick.map(r=>[r.t,r.state==='3G'?Math.max(...r.AS.map(id=>r.Fr[id])):null]),c:'var(--u1)',w:1.8}];
  if(R.C.some(c=>c.f==='L'))ser.push({pts:pick.map(r=>[r.t,r.lte]),c:'var(--lte)',w:1.8});
  const hl2=[];if(P.q2==='rscp'&&R.C.some(c=>c.f!=='F1'))hl2.push([P.t2dr,'var(--warn)','2D '+P.t2dr+' dBm'],[P.t2fr,'var(--k1)','2F']);if(R.C.some(c=>c.f==='L'))hl2.push([P.tLte,'var(--lte)','ngưỡng LTE 3A '+P.tLte+' dBm']);
  const c2=uPlot({w:820,h:170,x0:0,x1:T,y0:-130,y1:-50,yt:[-130,-110,-90,-70,-50],xt:[],aria:'RSCP và RSRP',ylab:'dBm',series:ser,hl:hl2,extra:'<line id="u3HoCur2" x1="44" x2="44" y1="10" y2="144" class="u3cur"/>'});
  return {a,b,c2};}
function u3HoStats(){const R=U3HR,c=R.cnt,h=R.asHist,n=R.asN||1;
  return `<dt>Sự kiện 1A / 1B / 1C / 1D</dt><dd>${c.e1a} / ${c.e1b} / ${c.e1c} / ${c.e1d}</dd><dt>Trong đó softer / qua Iur</dt><dd>${c.softer} / ${c.iur}</dd>
  <dt>SHO overhead (|active set| trung bình − 1)</dt><dd>${uF(R.sho,1)} %</dd><dt>Thời gian AS = 1 / 2 / 3 cell</dt><dd>${uF(h[1]/n*100,0)} / ${uF(h[2]/n*100,0)} / ${uF(h[3]/n*100,0)} %</dd>
  <dt>2D / 2F (compressed mode)</dt><dd>${c.e2d} / ${c.e2f}</dd><dt>Thời gian ở compressed mode</dt><dd>${uF(R.cm,1)} %</dd>
  <dt>HHO liên tần / IRAT / SRNS relocation</dt><dd>${c.hho} / ${c.irat} / ${c.rel}</dd><dt>Rớt cuộc gọi</dt><dd style="color:${c.drop?'var(--warn)':'inherit'}">${c.drop}</dd>`;}
function u3HoLog(){const R=U3HR,list=R.ev.filter(e=>e[0]<=U3HA.t).slice(-6).reverse();
  return list.map(e=>`<li><span class="u3t">${uF(e[0],1)} s</span> <b class="u3tag">${uE(e[1]==='start'?'Bắt đầu':e[1]==='REL'?'Relocation':e[1]==='DROP'?'Rớt':e[1])}</b> ${uE(e[2])}<br><span class="u3msg">${e[3].map(uE).join(' → ')}</span></li>`).join('');}
function u3HoNow(){const r=u3HoAt(U3HA.t),R=U3HR;if(r.state==='LTE')return `<b>Đã sang LTE</b> · t = ${uF(r.t,1)} s · RSRP ${uF(r.lte,0)} dBm`;if(r.state==='DROP')return `<b style="color:var(--warn)">Mất kết nối</b> · t = ${uF(r.t,1)} s`;
  return `t = ${uF(r.t,1)} s · vị trí ${uF(r.x,0)} m · tần ${r.uf}${U3P.ho.sc==='iur'?' · SRNC = RNC '+r.srnc:''}<br>Active set: ${r.AS.map(id=>`<b style="color:${R.C.find(c=>c.id===id).c}">${id}${id===r.sv?'★':''}</b> (${uF(r.F[id],1)} dB)`).join(', ')}${r.cm?' · <b>compressed mode</b>':''}`;}
U3R.ho={
 html(){const P=U3P.ho,tt=U3TTT.map(v=>[v,v+' ms']);U3HR=u3HoSim();if(U3HA.t>U3HR.T)U3HA.t=0;const ch=u3HoCharts();
  return `<div class="panel"><h3>Mô phỏng UE đi trên đường: active set, sự kiện 1A–1D, 2D/2F, 2B, 3A</h3>
  <div class="e2row"><label class="e2lb" for="u3HoSc">Kịch bản</label><select id="u3HoSc" data-u3i="ho:sc">${Object.keys(U3HOS).map(k=>`<option value="${k}"${k===P.sc?' selected':''}>${uE(U3HOS[k].n)}</option>`).join('')}</select>
  <button type="button" class="btn sm" data-u3a="ho:rew">⏮ Về đầu</button><button type="button" class="btn sm pri" data-u3a="ho:play" id="u3HoPlay">${U3HA.play?'❚❚ Dừng':'▶ Chạy'}</button><button type="button" class="btn sm" data-u3a="ho:seed">Đổi địa hình (che khuất)</button></div>
  <div class="scroll"><div class="u3wide" style="min-width:640px" id="u3HoMap">${u3HoMap()}</div></div>
  <p class="e2x" id="u3HoNow" aria-live="polite"></p>
  <div class="scroll"><div class="u3wide" style="min-width:640px"><div id="u3HoA">${ch.a}</div><div id="u3HoB">${ch.b}</div><div id="u3HoC">${ch.c2}</div></div></div>
  ${uLeg(U3HR.C.filter(c=>c.f!=='L').map(c=>[c.id+(c.f==='F2'?' (F2, nét đứt)':''),c.c]).concat(U3HR.C.some(c=>c.f==='L')?[['RSRP LTE tốt nhất','var(--lte)']]:[],[['RSCP tốt nhất trong active set','var(--u1)']]))}
  <div class="cols"><div><p class="e2x"><b>Báo cáo đo và bản tin</b></p><ol class="u3log" id="u3HoLog"></ol></div><dl class="kv" id="u3HoSt">${u3HoStats()}</dl></div></div>

  <div class="panel"><h3>Tham số chuyển giao</h3><p class="hint">Đổi tham số, mô phỏng chạy lại cùng địa hình. Dòng nhỏ dưới mỗi tham số là tên tương ứng theo vendor đang chọn ở thanh trên (đề nghị đối chiếu tài liệu release đang dùng).</p>
  <details open><summary><b>Nội tần (soft/softer HO)</b></summary><div class="ctl" style="margin-top:10px">${uSl('ho','v','Tốc độ UE',3,120,1,v=>v+' km/h')}${uSl('ho','r1a','Reporting range 1A',0,8,0.5,v=>uF(v,1)+' dB',uPn('r1a'))}${uSl('ho','r1b','Reporting range 1B',0,10,0.5,v=>uF(v,1)+' dB',uPn('r1b'))}${uSl('ho','h1c','Hysteresis 1C',0,8,0.5,v=>uF(v,1)+' dB',uPn('h1c'))}${uSl('ho','h1d','Hysteresis 1D',0,8,0.5,v=>uF(v,1)+' dB',uPn('h1d'))}
   ${uSel('ho','ttt1a','Time to trigger 1A',tt,uPn('ttt1a'))}${uSel('ho','ttt1b','Time to trigger 1B',tt)}${uSel('ho','ttt1c','Time to trigger 1C',tt)}${uSel('ho','ttt1d','Time to trigger 1D',tt)}${uSl('ho','maxAS','Kích thước active set tối đa',1,4,1,v=>v+' cell',uPn('maxas'))}${uSl('ho','k','Hệ số lọc lớp 3 (k)',0,9,1,v=>v,uPn('filt'))}${uSl('ho','sig','Độ lệch che khuất',0,8,0.5,v=>uF(v,1)+' dB')}${uSl('ho','load','Tải đường xuống',10,100,5,v=>v+' %')}</div></details>
  <details open style="margin-top:8px"><summary><b>Liên tần, liên hệ thống</b></summary><div class="ctl" style="margin-top:10px">${uSel('ho','q2','Đại lượng cho 2D/2F',[['ecno','CPICH Ec/Io'],['rscp','CPICH RSCP']])}${uSl('ho','t2d','Ngưỡng 2D (Ec/Io)',-20,-8,0.5,v=>uF(v,1)+' dB',uPn('t2d'))}${uSl('ho','t2f','Ngưỡng 2F (Ec/Io)',-18,-6,0.5,v=>uF(v,1)+' dB',uPn('t2f'))}${uSl('ho','t2dr','Ngưỡng 2D (RSCP)',-115,-90,1,v=>v+' dBm')}${uSl('ho','t2fr','Ngưỡng 2F (RSCP)',-112,-85,1,v=>v+' dBm')}${uSl('ho','tF2','Ngưỡng tần đích 2B (Ec/Io F2)',-18,-8,0.5,v=>uF(v,1)+' dB',uPn('t2b'))}${uSl('ho','tLte','Ngưỡng LTE cho 3A (RSRP)',-125,-95,1,v=>v+' dBm',uPn('t3a'))}${uSel('ho','irm','Cách sang LTE',[['ho','PS handover (Relocation)'],['redir','Redirection khi giải phóng']])}${uSl('ho','spd','Tốc độ phát lại',1,40,1,v=>v+'×')}</div></details>
  <p class="note">Mô hình: suy hao 128,1 + 37,6·log d, anten sector 65°, CPICH 33 dBm, che khuất thay đổi chậm theo vị trí; Ec/Io tính với tổng công suất các cell cùng tần. Nokia thường kích compressed mode bằng sự kiện 1F/1E thay cho 2D/2F; Huawei, Ericsson dùng 2D/2F. Đây là mô hình rút gọn để thấy xu hướng, không thay cho drive test.</p></div>

  <div class="panel"><h3>Tóm tắt các loại chuyển giao 3G</h3><div class="scroll"><table class="e2tb u3w"><thead><tr><th>Loại</th><th>Khi nào</th><th>Đặc điểm</th><th>Bản tin chính</th></tr></thead><tbody>
  <tr><td>Softer HO</td><td>Hai sector cùng NodeB</td><td>Kết hợp tỉ lệ cực đại (MRC) ngay trong NodeB, không tốn Iub thêm</td><td>Active Set Update; NBAP Radio Link Addition</td></tr>
  <tr><td>Soft HO</td><td>Hai NodeB cùng tần</td><td>Make-before-break; RNC chọn khung tốt (selection combining) đường lên; tốn CE, Iub, mã đường xuống</td><td>Measurement Report e1a/e1b/e1c; Active Set Update</td></tr>
  <tr><td>Soft HO qua Iur</td><td>Cell của RNC khác</td><td>DRNC cấp tài nguyên; dữ liệu đi Iur; lõi không biết</td><td>RNSAP Radio Link Setup/Addition</td></tr>
  <tr><td>SRNS relocation</td><td>Mọi cell active set thuộc DRNC (hoặc qua hard HO)</td><td>Chuyển vai SRNC, giải phóng Iur; kiểu "UE not involved" hoặc "UE involved"</td><td>RANAP Relocation Required/Request/Command; RNSAP Relocation Commit</td></tr>
  <tr><td>Hard HO liên tần</td><td>Tần đang dùng yếu, tần khác tốt (layer, biên vùng phủ)</td><td>Break-before-make, cần compressed mode để đo</td><td>e2d → Physical Channel Reconfiguration (CM) → e2b → Physical Channel Reconfiguration</td></tr>
  <tr><td>IRAT 3G → 4G</td><td>3G yếu, LTE đủ tốt; hoặc ưu tiên đưa UE dữ liệu lên LTE</td><td>PS handover (Rel-8) hoặc redirection; idle thì chọn lại cell theo ưu tiên tuyệt đối (SIB19)</td><td>e2d → CM → e3a → Relocation / Handover from UTRAN Command hoặc RRC Release có redirection</td></tr>
  <tr><td>Serving cell change HSDPA</td><td>Cell tốt nhất đổi (1D)</td><td>HS-DSCH chỉ phát từ một cell; đổi cell gây ngắt ngắn, mất dữ liệu bộ đệm MAC-hs nếu không có cơ chế cải tiến</td><td>e1d → RB/Physical Channel Reconfiguration</td></tr></tbody></table></div></div>`;},
 after(){const a=$('#u3HoNow');if(a)a.innerHTML=u3HoNow();this.dyn(true);},
 dyn(force){const g=$('#u3HoDyn');if(g)g.innerHTML=u3HoDyn();const R=U3HR,x=44+U3HA.t/R.T*(820-54);['#u3HoCur','#u3HoCur2'].forEach(id=>{const c=$(id);if(c){c.setAttribute('x1',x);c.setAttribute('x2',x);}});
  const n=R.ev.filter(e=>e[0]<=U3HA.t).length;if(force||n!==this._ne){this._ne=n;const l=$('#u3HoLog');if(l)l.innerHTML=u3HoLog();}const w=$('#u3HoNow');if(w)w.innerHTML=u3HoNow();},
 tick(dt){if(!U3HA.play||!U3HR)return;if(U3HA.hold>0){U3HA.hold-=dt;if(U3HA.hold<=0)U3HA.t=0;return;}U3HA.t+=dt*U3P.ho.spd;if(U3HA.t>=U3HR.T){U3HA.t=U3HR.T;U3HA.hold=2.5;}this.dyn(false);},
 upd(k){if(k==='spd')return;clearTimeout(this._tm);if(k==='sc'){this.upd2(k);return;}this._tm=setTimeout(()=>this.upd2(k),110);},
 upd2(k){if(k==='sc')U3HA.t=0;U3HR=u3HoSim();if(U3HA.t>U3HR.T)U3HA.t=0;if(k==='sc'){renderU3();return;}
  const m=$('#u3HoMap');if(m)m.innerHTML=u3HoMap();const ch=u3HoCharts();['A','B','C'].forEach((x,i)=>{const e=$('#u3Ho'+x);if(e)e.innerHTML=[ch.a,ch.b,ch.c2][i];});const s=$('#u3HoSt');if(s)s.innerHTML=u3HoStats();this.dyn(true);},
 act(a,el){if(a==='play'){U3HA.play=U3HA.play?0:1;el.textContent=U3HA.play?'❚❚ Dừng':'▶ Chạy';if(U3HA.play)u3Start();}
  else if(a==='rew'){U3HA.t=0;U3HA.hold=0;this.dyn(true);}
  else if(a==='seed'){U3P.ho.seed++;this.upd('seed');}}
};

/* ---------- Mục 5: HSPA / HSPA+ ---------- */
U3P.hs={cat:14,n:4,sch:'pf',codes:15,scch:3,q64:1,mimo:0,dc:0,v:3,buf:'full',spd:25,eN:3,rot:6,r99:20,nbr:0,ecat:6,ebuf:'full'};
const U3DC={6:[5,0,0,0,3.6],8:[10,0,0,0,7.2],10:[15,0,0,0,14.0],14:[15,1,0,0,21.1],16:[15,0,1,0,27.9],20:[15,1,1,0,42.2],24:[15,1,0,1,42.2],28:[15,1,1,1,84.4]};
const U3UC={3:[1450,'2×SF4, TTI 10 ms, BPSK'],5:[2000,'2×SF2, TTI 10 ms'],6:[5760,'2×SF2 + 2×SF4, TTI 2 ms'],7:[11500,'như cat 6 + 16QAM'],9:[22900,'DC-HSUPA + 16QAM']};
/* bảng CQI xấp xỉ: [TBS bit, số mã, điều chế] cho UE 15 mã; 64QAM thay ở CQI 26–30 */
const U3CQ=[null,[137,1,2],[173,1,2],[233,1,2],[317,1,2],[377,1,2],[461,1,2],[650,2,2],[792,2,2],[931,2,2],[1262,3,2],[1483,3,2],[1742,3,2],[2279,4,2],[2583,4,2],[3319,5,2],[3565,5,4],[4189,5,4],[4664,5,4],[5287,5,4],[5887,5,4],[6554,5,4],[7168,5,4],[9719,7,4],[11418,8,4],[14411,10,4],[17237,12,4],[21754,15,4],[23370,15,4],[24222,15,4],[27952,15,4]];
const U3CQ64={26:[26490,15,6],27:[29144,15,6],28:[32264,15,6],29:[36255,15,6],30:[42192,15,6]};
const U3HD={u:[],tti:0,grid:[],acc:0,r:uRng(5),log:[]};
function u3HsCap(){const P=U3P.hs,c=U3DC[P.cat];return {codes:Math.min(c[0],P.codes),q64:!!(c[1]&&P.q64),mimo:!!(c[2]&&P.mimo),dc:!!(c[3]&&P.dc)};}
function u3HsReset(){const P=U3P.hs,D=U3HD;D.u=[];D.tti=0;D.grid=[];D.r=uRng(5+P.n);
  for(let i=0;i<P.n;i++){const m=P.n>1?20-i*24/(P.n-1):12;D.u.push({m,ph:[0,1].map(()=>Array.from({length:8},()=>[D.r()*6.283,D.r()*6.283])),hist:[],avg:1e-3,bits:0,bits1:[],tx:0,nack:0,res:0,last:0,retx:[],q64:0,mimo:0,sch:0,buf:P.buf==='full'?1e12:0,cqi:1,snr:0});}}
function u3HsSnr(u,car,t){const P=U3P.hs,fd=Math.max(1,P.v/3.6*2.1e9/3e8);let re=0,im=0;u.ph[car].forEach(p=>{const a=2*Math.PI*fd*Math.cos(p[0])*t+p[1];re+=Math.cos(a);im+=Math.sin(a);});return u.m+uDb((re*re+im*im)/8);}
function u3HsTbs(cqi,cap,codesAv){cqi=uClamp(Math.round(cqi),1,30);let e=U3CQ[cqi];if(cap.q64&&U3CQ64[cqi])e=U3CQ64[cqi];
  let cm=Math.min(cap.codes,codesAv);let bits=e[0];if(e[1]>cm)bits=Math.floor(bits*cm/e[1]);return {bits,codes:Math.min(e[1],cm),mod:e[2]};}
function u3HsTti(){const P=U3P.hs,D=U3HD,cap=u3HsCap(),t=D.tti*0.002,cars=cap.dc?2:1,col=[];
  D.u.forEach(u=>{u.snrNow=[0,1].map(c=>u3HsSnr(u,c,t));u.hist.push(u.snrNow.slice());if(u.hist.length>4)u.hist.shift();u.cqiR=u.hist[0].map(s=>Math.round(s+3)<1?0:Math.min(30,Math.round(s+3)));u.cqi=u.cqiR[0];u.snr=u.snrNow[0];
    if(P.buf==='burst'&&u.buf<=0&&D.r()<0.004)u.buf=8e6*(0.2+D.r());});
  const served={};
  for(let c=0;c<cars;c++){let codes=P.codes,scch=P.scch;const blocks=[];
    const ready=D.u.map((u,i)=>[u,i]).filter(([u])=>u.retx.some(r=>r.c===c&&D.tti>=r.at));
    const cand=D.u.map((u,i)=>[u,i]).filter(([u,i])=>u.buf>0&&u.cqiR[c]>0&&!ready.some(q=>q[1]===i));
    const met=([u,i])=>{const tb=u3HsTbs(u.cqiR[c],cap,15).bits;return P.sch==='rr'?(D.tti-u.last):P.sch==='maxci'?u.cqiR[c]+D.r()*0.01:tb/(u.avg+1)+D.r()*1e-6;};
    cand.sort((a,b)=>met(b)-met(a));
    const order=ready.concat(cand);
    for(const [u,i] of order){if(scch<=0||codes<=0)break;let r=u.retx.find(q=>q.c===c&&D.tti>=q.at);let tb,mm=false;
      if(r){u.retx.splice(u.retx.indexOf(r),1);if(r.codes>codes){u.retx.push(r);continue;}tb={bits:r.bits,codes:r.codes,mod:r.mod};}
      else{let cq=u.cqiR[c];if(cap.mimo&&u.hist[0][c]>=14){mm=true;const cs=uClamp(Math.round(u.hist[0][c]-4+3),1,30);const a=u3HsTbs(cs,cap,codes);tb={bits:a.bits*2,codes:a.codes,mod:a.mod};}else tb=u3HsTbs(cq,cap,codes);
        r={bits:tb.bits,codes:tb.codes,mod:tb.mod,n:0,req:(mm?u.hist[0][c]-4:Math.min(u.hist[0][c],27)),c,mimo:mm};}
      r.n++;codes-=tb.codes;scch--;u.tx++;u.sch++;u.last=D.tti;
      const snr=u.snrNow[c]-(r.mimo?4:0)+10*Math.log10(r.n),pe=1/(1+Math.exp(1.2*(snr-r.req+1.8)));
      const ok=D.r()>pe;if(tb.mod===6)u.q64++;if(r.mimo)u.mimo++;
      if(ok){u.bits+=tb.bits;served[i]=(served[i]||0)+tb.bits;if(P.buf==='burst')u.buf=Math.max(0,u.buf-tb.bits);}
      else{u.nack++;if(r.n<4){r.at=D.tti+6;u.retx.push(r);}else u.res++;}
      blocks.push({i,codes:tb.codes,ok,re:r.n>1,mod:tb.mod,mm:r.mimo});}
    col.push(blocks);}
  D.u.forEach((u,i)=>{const s=served[i]||0;u.avg=u.avg*0.99+s*0.01;u.bits1.push(s);if(u.bits1.length>500)u.bits1.shift();});
  D.grid.push(col);if(D.grid.length>60)D.grid.shift();D.tti++;}
const U3UCOL=['var(--u1)','var(--u2)','var(--u3)','var(--u4)','var(--u5)','var(--u6)','var(--k1)','var(--cp)'];
function u3HsGrid(){const D=U3HD,P=U3P.hs,cars=u3HsCap().dc?2:1,W=760,L=60,cw=(W-L-6)/60,ch=110;
  let s=`<svg viewBox="0 0 ${W} ${cars*(ch+18)+24}" class="u3svg" role="img" aria-label="Lưới TTI HSDPA">`;
  for(let c=0;c<cars;c++){const y0=8+c*(ch+18);s+=`<text x="4" y="${y0+14}" class="u3ax">${cars>1?'Sóng mang '+(c+1):'15 mã'}</text><text x="4" y="${y0+30}" class="u3ax">1 cột</text><text x="4" y="${y0+44}" class="u3ax">= 2 ms</text><rect x="${L}" y="${y0}" width="${W-L-6}" height="${ch}" class="u3pbg"/>`;
    D.grid.forEach((col,k)=>{const x=L+k*cw;let y=y0+ch;(col[c]||[]).forEach(b=>{const h=b.codes/15*ch;y-=h;s+=`<rect x="${x+.5}" y="${y}" width="${cw-1}" height="${h}" style="fill:${U3UCOL[b.i%8]};opacity:${b.re?.55:1};${b.re?'stroke:var(--ink);stroke-dasharray:2 2;':''}"/>${b.ok?'':`<text x="${x+cw/2}" y="${y+h/2+4}" text-anchor="middle" class="u3x">×</text>`}${b.mm?`<text x="${x+cw/2}" y="${y+10}" text-anchor="middle" class="u3ax" style="font-size:8px;fill:#fff">M</text>`:''}`;});});}
  return s+`<text x="${L}" y="${cars*(ch+18)+18}" class="u3ax">Cao = số mã được cấp. ×: NACK (sẽ phát lại sau 6 TTI). Nét đứt nhạt: lần phát lại HARQ. M: MIMO hai luồng.</text></svg>`;}
function u3HsTable(){const D=U3HD,mod=c=>c>=26&&u3HsCap().q64?'64QAM':c>=16?'16QAM':'QPSK';let tot=0,s2=0,n=0;
  const rows=D.u.map((u,i)=>{const thr=u.bits1.reduce((a,b)=>a+b,0)/(u.bits1.length*0.002)/1e6||0;tot+=thr;s2+=thr*thr;n++;
    return `<tr><td><span class="u3sw" style="background:${U3UCOL[i%8]}"></span>UE ${i+1}</td><td>${uF(u.m,0)} dB</td><td>${u.cqi}</td><td>${mod(u.cqi)}</td><td>${D.tti?uF(u.sch/D.tti*100,0):0} %</td><td>${u.tx?uF(u.nack/u.tx*100,1):0} %</td><td><div class="u3bar"><i style="width:${Math.min(100,thr/((U3DC[U3P.hs.cat][4]))*100)}%;background:${U3UCOL[i%8]}"></i></div>${uF(thr,2)} Mbps</td></tr>`;}).join('');
  const jain=n&&s2?tot*tot/(n*s2):0;return {rows,tot,jain};}
function u3HsStats(tot,jain){const D=U3HD;let tx=0,q=0,m=0,re=0,nk=0;D.u.forEach(u=>{tx+=u.tx;q+=u.q64;m+=u.mimo;re+=u.res;nk+=u.nack;});const cap=u3HsCap();
  return `<dt>Thông lượng cell (1 s gần nhất)</dt><dd>${uF(tot,2)} Mbps</dd><dt>Đỉnh lý thuyết của category ${U3P.hs.cat}</dt><dd>${uF(U3DC[U3P.hs.cat][4],1)} Mbps</dd><dt>Công bằng (chỉ số Jain)</dt><dd>${uF(jain,2)}</dd>
  <dt>Tỉ lệ NACK (mọi lần phát)</dt><dd>${tx?uF(nk/tx*100,1):0} %</dd><dt>Mất sau 4 lần HARQ (RLC phải phát lại)</dt><dd>${re}</dd><dt>Dùng 64QAM / MIMO</dt><dd>${tx?uF(q/tx*100,0):0} % / ${tx?uF(m/tx*100,0):0} %</dd>
  <dt>Đặc tính đang bật</dt><dd>${cap.codes} mã${cap.q64?', 64QAM':''}${cap.mimo?', MIMO':''}${cap.dc?', DC-HSDPA':''}</dd><dt>Đã chạy</dt><dd>${D.tti} TTI (${uF(D.tti*0.002,1)} s)</dd>`;}
/* HSUPA */
const U3GL=[0,16,32,64,128,256,384,512,768,1024,1450,2000,2900,4000,5760,8000,11500,16000,22900];
const U3HU={u:[],t:0,rot:[],log:[],acc:0,r:uRng(9),nbrT:0};
function u3HuReset(){const P=U3P.hs,H=U3HU;H.u=[];H.t=0;H.rot=[];H.log=[];H.r=uRng(9+P.eN);for(let i=0;i<P.eN;i++)H.u.push({g:0,buf:P.ebuf==='full'?1e12:0,idle:0,bits:0,b1:[]});}
function u3HuStep(){const P=U3P.hs,H=U3HU,W=3.84e6,cap=U3UC[P.ecat][0];const maxL=U3GL.findIndex(g=>g>=cap);const lim=maxL<0?U3GL.length-1:maxL;
  H.u.forEach((u,i)=>{if(P.ebuf==='burst'&&u.buf<=0&&H.r()<0.01)u.buf=2e6*(0.3+H.r());});
  const eta=R=>R>0?1/(1+W/(uLin(R>5760?4:2)*R*1000)):0;
  const load=()=>{let own=0;H.u.forEach(u=>{own+=0.004+eta(U3GL[u.g]*(u.buf>0?1:0.05));});const r99=P.r99/100*0.75,oth=own*(P.nbr?0.9:0.3);const tot=Math.min(0.97,own+r99+oth);return {own,r99,tot,rot:-10*Math.log10(1-tot)};};
  let L=load();const lg=m=>{H.log.unshift([H.t,m]);if(H.log.length>30)H.log.length=30;};
  if(L.rot>P.rot+0.2){const j=H.u.reduce((b,u,i)=>b<0||u.g>H.u[b].g?i:b,-1);if(j>=0&&H.u[j].g>0){H.u[j].g--;lg('E-RGCH DOWN → UE '+(j+1)+': '+U3GL[H.u[j].g]+' kbps (RoT '+uF(L.rot,1)+' dB > mục tiêu)');}}
  else if(L.rot<P.rot-0.5){const nw=H.u.findIndex(u=>u.g===0&&u.buf>0);
    if(nw>=0){H.u[nw].g=3;lg('E-AGCH → UE '+(nw+1)+': grant tuyệt đối '+U3GL[3]+' kbps (bắt đầu có dữ liệu)');}
    else{let j=-1;H.u.forEach((u,i)=>{if(u.buf>0&&u.g<lim&&(j<0||u.g<H.u[j].g))j=i;});if(j>=0){H.u[j].g++;lg('E-RGCH UP → UE '+(j+1)+': '+U3GL[H.u[j].g]+' kbps (happy bit = không vui, còn dư RoT)');}}}
  if(P.nbr&&H.t-H.nbrT>0.1){H.nbrT=H.t;H.u.forEach((u,i)=>{if(u.g>4){u.g--;}});lg('E-RGCH non-serving DOWN từ cell lân cận quá tải: mọi UE giảm 1 mức');}
  H.u.forEach((u,i)=>{if(u.buf<=0&&u.g>0){u.idle+=0.01;if(u.idle>0.3){u.g=0;u.idle=0;lg('E-AGCH → UE '+(i+1)+': grant về 0 (hết dữ liệu, thu hồi tài nguyên)');}}else u.idle=0;
    const b=u.buf>0?U3GL[u.g]*10*(H.r()<0.1?0:1):0;u.bits+=b;u.b1.push(b);if(u.b1.length>100)u.b1.shift();if(P.ebuf==='burst')u.buf=Math.max(0,u.buf-b);});
  L=load();H.rot.push([H.t,L.rot,-10*Math.log10(1-L.r99)]);if(H.rot.length>2000)H.rot.shift();H.t+=0.01;}
function u3HuSvg(){const H=U3HU,P=U3P.hs;if(!H.rot.length)return'';const t1=H.rot[H.rot.length-1][0],t0=Math.max(0,t1-20);const pts=H.rot.filter(p=>p[0]>=t0);
  return uPlot({w:700,h:200,x0:t0,x1:Math.max(t0+20,t1),y0:0,y1:14,yt:[0,3,6,9,12],xt:[],aria:'RoT đường lên',ylab:'RoT dB',series:[{pts:pts.map(p=>[p[0],p[1]]),c:'var(--u4)',w:1.8},{pts:pts.map(p=>[p[0],p[2]]),c:'var(--muted)',w:1.4,dash:'4 3'}],hl:[[P.rot,'var(--warn)','RoT mục tiêu '+P.rot+' dB']]});}
function u3HuBars(){const H=U3HU,cap=U3UC[U3P.hs.ecat][0];return H.u.map((u,i)=>{const r=u.b1.reduce((a,b)=>a+b,0)/(u.b1.length*0.01||1)/1e6;return `<tr><td><span class="u3sw" style="background:${U3UCOL[i%8]}"></span>UE ${i+1}</td><td>${U3GL[u.g]} kbps</td><td>${u.buf>0?'có':'không'}</td><td><div class="u3bar"><i style="width:${Math.min(100,r*1000/cap*100)}%;background:${U3UCOL[i%8]}"></i></div>${uF(r,2)} Mbps</td></tr>`;}).join('');}
U3R.hs={
 html(){const P=U3P.hs;if(!U3HD.u.length)u3HsReset();if(!U3HU.u.length)u3HuReset();const T=u3HsTable();
  return `<div class="panel"><h3>HSDPA: lập lịch 2 ms theo CQI, HARQ, 64QAM, MIMO, DC-HSDPA</h3>
  <p class="e2d">Mỗi 2 ms, MAC-hs ở NodeB chọn UE nào được phát trên HS-PDSCH (tối đa 15 mã SF16 dùng chung), dựa vào CQI UE báo trên HS-DPCCH. HS-SCCH báo trước cho UE được chọn mã nào, điều chế, kích thước khối. UE trả ACK/NACK; NACK thì NodeB phát lại sau 12 ms và UE kết hợp mềm (HARQ chase combining) nên lần sau dễ giải mã hơn.</p>
  <div class="ctl">${uSel('hs','cat','Category UE (TS 25.306)',Object.keys(U3DC).map(k=>[k,'Cat '+k+' · '+U3DC[k][0]+' mã'+(U3DC[k][1]?' · 64QAM':'')+(U3DC[k][2]?' · MIMO':'')+(U3DC[k][3]?' · DC':'')+' · '+uF(U3DC[k][4],1)+' Mbps']))}${uSl('hs','n','Số UE trong cell',1,8,1,v=>v)}${uSel('hs','sch','Bộ lập lịch',[['pf','Proportional fair'],['rr','Round robin'],['maxci','Max C/I']],uPn('hsSch'))}${uSel('hs','codes','Số mã HS-PDSCH của cell',[[5,'5'],[10,'10'],[15,'15']],uPn('hsCodes'))}${uSel('hs','scch','Số HS-SCCH (UE tối đa mỗi TTI)',[[1,'1'],[2,'2'],[3,'3'],[4,'4']],uPn('hsScch'))}${uSl('hs','v','Tốc độ UE',3,120,1,v=>v+' km/h')}${uSel('hs','buf','Lưu lượng',[['full','Bộ đệm luôn đầy'],['burst','Theo đợt (tải tệp ngẫu nhiên)']])}${uSel('hs','spd','Tốc độ chạy',[[5,'5 TTI/giây (rất chậm)'],[25,'25 TTI/giây'],[100,'100 TTI/giây'],[500,'Thời gian thực']])}</div>
  <div class="e2row" style="margin-top:10px">${uChk('hs','q64','Bật 64QAM')}${uChk('hs','mimo','Bật MIMO 2×2')}${uChk('hs','dc','Bật DC-HSDPA (2 sóng mang)')}<button type="button" class="btn sm" data-u3a="hs:reset">Làm lại</button></div>
  <div class="scroll"><div class="u3wide" style="min-width:600px" id="u3HsG">${u3HsGrid()}</div></div>
  <div class="cols"><div class="scroll"><table class="e2tb"><thead><tr><th>UE</th><th>SNR trung bình</th><th>CQI</th><th>Điều chế</th><th>Được lập lịch</th><th>NACK</th><th>Thông lượng</th></tr></thead><tbody id="u3HsT">${T.rows}</tbody></table></div><dl class="kv" id="u3HsSt">${u3HsStats(T.tot,T.jain)}</dl></div>
  <p class="note">Max C/I cho tổng thông lượng cao nhưng UE xa gần như không được phục vụ; round robin công bằng về thời gian nhưng bỏ phí lúc kênh tốt; proportional fair cân bằng hai mặt. Tốc độ cao làm CQI báo về lỗi thời (trễ 3 TTI) nên NACK tăng. Đặc tính chỉ có tác dụng khi category UE hỗ trợ. Bảng CQI là xấp xỉ bảng 7D/7G của TS 25.214.</p></div>

  <div class="panel"><h3>HSUPA: grant, E-AGCH, E-RGCH và giữ RoT dưới mục tiêu</h3>
  <p class="e2d">Đường lên bị giới hạn bởi nhiễu (RoT). MAC-e ở NodeB phát grant: E-AGCH đặt mức tuyệt đối, E-RGCH tăng/giữ/giảm từng bước. Cell lân cận không phục vụ nhưng nằm trong active set có thể gửi E-RGCH DOWN khi nó quá tải. UE báo "happy bit" cho biết grant hiện tại có đủ không.</p>
  <div class="ctl">${uSel('hs','ecat','Category E-DCH',Object.keys(U3UC).map(k=>[k,'Cat '+k+' · '+U3UC[k][1]+' · '+uF(U3UC[k][0]/1000,2)+' Mbps']))}${uSl('hs','eN','Số UE HSUPA',1,6,1,v=>v)}${uSl('hs','rot','RoT mục tiêu',3,10,0.5,v=>uF(v,1)+' dB',uPn('rot'))}${uSl('hs','r99','Tải R99 (thoại, DCH)',0,60,5,v=>v+' %')}${uSel('hs','ebuf','Lưu lượng',[['full','Luôn có dữ liệu'],['burst','Theo đợt']])}</div>
  <div class="e2row" style="margin-top:10px">${uChk('hs','nbr','Cell lân cận quá tải (gửi non-serving RG DOWN)')}<button type="button" class="btn sm" data-u3a="hs:ureset">Làm lại</button></div>
  <div class="cols"><div><div id="u3HuSvg">${u3HuSvg()}</div>${uLeg([['RoT tổng','var(--u4)'],['Phần do R99','var(--muted)']])}</div><div class="scroll"><table class="e2tb"><thead><tr><th>UE</th><th>Grant</th><th>Dữ liệu</th><th>Tốc độ</th></tr></thead><tbody id="u3HuT">${u3HuBars()}</tbody></table></div></div>
  <ol class="u3log" id="u3HuLog"></ol></div>

  <div class="panel"><h3>Category UE và đặc tính HSPA+</h3><div class="scroll"><table class="e2tb u3w"><thead><tr><th>HSDPA cat</th><th>Mã tối đa</th><th>Điều chế</th><th>MIMO</th><th>Đa sóng mang</th><th>Đỉnh (Mbps)</th><th>Release</th></tr></thead><tbody>
  ${[[6,5,'16QAM','—','—','3,6','Rel-5'],[8,10,'16QAM','—','—','7,2','Rel-5'],[10,15,'16QAM','—','—','14,0','Rel-5'],[14,15,'64QAM','—','—','21,1','Rel-7'],[16,15,'16QAM','2×2','—','27,9','Rel-7'],[18,15,'64QAM hoặc MIMO','2×2','—','27,9 / 21,1','Rel-7'],[20,15,'64QAM','2×2','—','42,2','Rel-8'],[24,15,'64QAM','—','DC','42,2','Rel-8'],[28,15,'64QAM','2×2','DC','84,4','Rel-9'],[32,15,'64QAM','2×2','4 sóng mang','168,8','Rel-10']].map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  <div class="scroll" style="margin-top:10px"><table class="e2tb u3w"><thead><tr><th>HSUPA cat</th><th>Cấu hình E-DPDCH</th><th>TTI</th><th>Điều chế</th><th>Đỉnh (Mbps)</th><th>Release</th></tr></thead><tbody>
  ${[[1,'1×SF4','10 ms','BPSK','0,73','Rel-6'],[3,'2×SF4','10 ms','BPSK','1,46','Rel-6'],[5,'2×SF2','10 ms','BPSK','2,0','Rel-6'],[6,'2×SF2 + 2×SF4','2 / 10 ms','BPSK','5,76','Rel-6'],[7,'2×SF2 + 2×SF4','2 ms','16QAM','11,5','Rel-7'],[9,'DC-HSUPA','2 ms','16QAM','22,9','Rel-9']].map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  <div class="scroll" style="margin-top:10px"><table class="e2tb u3w"><thead><tr><th>Đặc tính</th><th>Tác dụng</th><th>Ghi chú</th></tr></thead><tbody>
  <tr><td>CPC (DTX/DRX, HS-SCCH less)</td><td>UE ngắt DPCCH khi không có dữ liệu, giảm nhiễu UL, tăng số UE "luôn kết nối"</td><td>Rel-7; cần UE và mạng cùng hỗ trợ</td></tr>
  <tr><td>F-DPCH</td><td>Thay DPCH đường xuống bằng kênh chỉ chở TPC; 10 UE dùng chung một mã SF256</td><td>Giảm tiêu thụ mã OVSF</td></tr>
  <tr><td>Enhanced CELL_FACH (HS-FACH, E-RACH)</td><td>Dùng HS-DSCH và E-DCH ngay ở CELL_FACH, chuyển trạng thái nhanh, tốc độ cao hơn FACH</td><td>Rel-7/8</td></tr>
  <tr><td>Flexible RLC, MAC-ehs</td><td>RLC PDU kích thước linh hoạt, phân đoạn ở MAC; cần cho tốc độ cao</td><td>Rel-7</td></tr>
  <tr><td>SRB over HSPA</td><td>Báo hiệu đi trên HS-DSCH/E-DCH, giảm trễ thiết lập và chuyển trạng thái</td><td>Cần chú ý độ tin cậy khi đổi serving cell</td></tr>
  <tr><td>Enhanced serving cell change</td><td>Đổi cell HS-DSCH nhanh, giảm mất dữ liệu khi 1D</td><td>Rel-8</td></tr></tbody></table></div></div>`;},
 after(){},
 tick(dt){const P=U3P.hs;U3HD.acc+=dt*P.spd;let n=Math.floor(U3HD.acc);U3HD.acc-=n;if(n>60)n=60;for(let i=0;i<n;i++)u3HsTti();
  U3HU.acc+=dt*100;let m=Math.floor(U3HU.acc);U3HU.acc-=m;if(m>30)m=30;for(let i=0;i<m;i++)u3HuStep();
  this._f=(this._f||0)+dt;if(this._f>=0.08){this._f=0;this.draw();}},
 draw(){const g=$('#u3HsG');if(g)g.innerHTML=u3HsGrid();const T=u3HsTable();const tb=$('#u3HsT');if(tb)tb.innerHTML=T.rows;const st=$('#u3HsSt');if(st)st.innerHTML=u3HsStats(T.tot,T.jain);
  const hs=$('#u3HuSvg');if(hs)hs.innerHTML=u3HuSvg();const ht=$('#u3HuT');if(ht)ht.innerHTML=u3HuBars();const hl=$('#u3HuLog');if(hl)hl.innerHTML=U3HU.log.slice(0,6).map(e=>`<li><span class="u3t">${uF(e[0],2)} s</span> ${uE(e[1])}</li>`).join('');},
 upd(k){if(['n','buf','cat'].includes(k))u3HsReset();if(['eN','ebuf','ecat'].includes(k))u3HuReset();if(k==='dc'||k==='cat')U3HD.grid=[];if(!U3.raf){for(let i=0;i<300;i++){u3HsTti();u3HuStep();}}this.draw();},
 act(a){if(a==='reset'){u3HsReset();this.draw();}else if(a==='ureset'){u3HuReset();this.draw();}}
};

/* ---------- Mục 6: Tham số, KPI, lỗi thường gặp theo vendor ---------- */
/* [khoá, nhóm, ý nghĩa (3GPP), Huawei, Nokia, Ericsson, giá trị điển hình, độ chắc chắn c=tên thường gặp / v=đề nghị đối chiếu release] */
const U3PAR=[
 ['qqual','Chọn và chọn lại cell','Qqualmin: CPICH Ec/Io tối thiểu để ở cell (SIB3)','UCELLSELRESEL: Qqualmin','WCEL: QqualMin','UtranCell: qQualMin','−18 dB','c'],
 ['qrx','Chọn và chọn lại cell','Qrxlevmin: CPICH RSCP tối thiểu','UCELLSELRESEL: Qrxlevmin','WCEL: QrxlevMin','UtranCell: qRxLevMin','−115 dBm (Huawei nhập theo bước 2 dB)','c'],
 ['sintra','Chọn và chọn lại cell','Sintrasearch: dưới ngưỡng này UE mới đo cell cùng tần','UCELLSELRESEL: Sintrasearch','WCEL: Sintrasearch','UtranCell: sIntraSearch','8–10 dB','c'],
 ['sinter','Chọn và chọn lại cell','Sintersearch: ngưỡng bắt đầu đo khác tần','UCELLSELRESEL: Sintersearch','WCEL: Sintersearch','UtranCell: sInterSearch','4–6 dB','c'],
 ['srat','Chọn và chọn lại cell','SsearchRAT: ngưỡng bắt đầu đo hệ thống khác','UCELLSELRESEL: SsearchRat','WCEL: SsearchRAT','UtranCell: sRatSearch','2–4 dB','c'],
 ['qhyst','Chọn và chọn lại cell','Qhyst2s: độ trễ chọn lại cell theo Ec/Io','UCELLSELRESEL: Qhyst2s','WCEL: Qhyst2','UtranCell: qHyst2','2–4 dB','c'],
 ['tresel','Chọn và chọn lại cell','Treselection: cell mới phải tốt hơn trong thời gian này','UCELLSELRESEL: Treselections','WCEL: Treselection','UtranCell: treSelection','1–2 s','c'],
 ['qoff','Chọn và chọn lại cell','Qoffset2s,n: lệch riêng cho từng cặp cell','UINTRAFREQNCELL: IdleQoffset2sn','ADJS: AdjsQoffset2','UtranRelation: qOffset2sn','0 dB','v'],
 ['prio','Chọn và chọn lại cell','Ưu tiên tuyệt đối E-UTRA (SIB19) để UE rỗi lên LTE','UCELLNFREQPRIOINFO: NPriority, ThdToHigh','WCEL/ADJL: AbsPrioCellReselec, ngưỡng E-UTRA','EutranFreqRelation: cellReselectionPriority, threshHigh','LTE ưu tiên cao hơn UMTS','v'],
 ['cpich','Công suất','Công suất CPICH (mốc đo vùng phủ)','UCELL: PCPICHPower','WCEL: PtxPrimaryCPICH','UtranCell: primaryCpichPower','33 dBm ≈ 10 % công suất cell','c'],
 ['pmax','Công suất','Công suất phát tối đa của cell','UCELL: MaxTxPower','WCEL: PtxCellMax','UtranCell: maximumTransmissionPower','43 dBm (20 W)','c'],
 ['bler','Công suất','BLER mục tiêu của điều khiển công suất vòng ngoài','UTYPRABOLPC: BLERQuality','RNC: BLER target theo kiểu RAB','RncFunction/UeRc: BLER target theo RAB','1 % thoại; 1–10 % dữ liệu','v'],
 ['ulpmax','Công suất','Công suất phát tối đa cho phép của UE','UCELLSELRESEL: MaxAllowedUlTxPower','WCEL: UEtxPowerMaxDCH','UtranCell: maxTxPowerUl','21–24 dBm','v'],
 ['r1a','Chuyển giao mềm','Reporting range 1A (thêm cell vào active set)','UCELLINTRAFREQHO: IntraRelThdFor1ACSVP / IntraRelThdFor1APS','HOPS: AdditionWindow','UtranCell: reportingRange1a','3 dB','v'],
 ['r1b','Chuyển giao mềm','Reporting range 1B (bỏ cell khỏi active set)','UCELLINTRAFREQHO: IntraRelThdFor1BCSVP / IntraRelThdFor1BPS','HOPS: DropWindow','UtranCell: reportingRange1b','5–6 dB','v'],
 ['h1c','Chuyển giao mềm','Hysteresis 1C (thay cell yếu nhất khi active set đầy)','UCELLINTRAFREQHO: Hystfor1C','HOPS: ReplacementWindow','UtranCell: hysteresis1c','2 dB','v'],
 ['h1d','Chuyển giao mềm','Hysteresis 1D (cell tốt nhất đổi, đổi serving cell HSDPA)','UCELLINTRAFREQHO: Hystfor1D','HOPS: HSDPA serving cell window','UtranCell: hysteresis1d','3–4 dB','v'],
 ['ttt1a','Chuyển giao mềm','Time to trigger 1A / 1B / 1C / 1D','UCELLINTRAFREQHO: TrigTime1A, TrigTime1B, TrigTime1C, TrigTime1D','HOPS: AdditionTime, DropTime, ReplacementTime','UtranCell: timeToTrigger1a, timeToTrigger1b…','320 / 640 / 320 / 640 ms','v'],
 ['maxas','Chuyển giao mềm','Số cell tối đa trong active set','UCELLINTRAFREQHO: MaxCellInActiveSet','FMCS: MaxActiveSetSize','UtranCell: maxActiveSet','3','v'],
 ['filt','Chuyển giao mềm','Hệ số lọc lớp 3 (k) cho đo Ec/Io','UCELLINTRAFREQHO: FilterCoef','FMCS: EcNoFilterCoefficient','UtranCell/RncFunction: filterCoefficient','k = 3–5','v'],
 ['wgt','Chuyển giao mềm','Hệ số trọng số W khi tính ngưỡng theo cả active set','UCELLINTRAFREQHO: WeightForUsedFreq','FMCS: ActiveSetWeightingCoefficient','UtranCell: weighting factor','0','v'],
 ['nbr','Chuyển giao mềm','Danh sách lân cận cùng tần','ADD UINTRAFREQNCELL','ADJS (dưới WCEL)','UtranRelation','≤ 32 cell trong danh sách đo','c'],
 ['t2d','Liên tần và IRAT','Ngưỡng 2D: bắt đầu compressed mode','UINTERFREQHOCOV / UINTERRATHOCOV: InterFreqCSThd2DEcN0, InterRATCSThd2DEcN0 (và bản RSCP)','FMCS: HHoEcNoThreshold, HHoRscpThreshold (sự kiện 1F)','UtranCell: usedFreqThresh2dEcno, usedFreqThresh2dRscp','−14 dB / −100 dBm','v'],
 ['t2f','Liên tần và IRAT','Ngưỡng 2F: dừng compressed mode','InterFreqCSThd2FEcN0, InterRATCSThd2FEcN0','FMCS: HHoEcNoCancel, HHoRscpCancel (sự kiện 1E)','UtranCell: usedFreqRelThresh2fEcno, usedFreqRelThresh2fRscp','2D + 2 dB','v'],
 ['t2b','Liên tần và IRAT','Ngưỡng chất lượng tần đích cho HHO liên tần','UINTERFREQHOCOV: TargetFreqCsThdEcN0 (theo kiểu dịch vụ)','FMCI: ngưỡng Ec/Io tần đích','UtranFreqRelation: ngưỡng tần đích','−12 dB','v'],
 ['t3a','Liên tần và IRAT','Ngưỡng hệ thống đích cho 3A (RSRP/RSRQ LTE)','ngưỡng đo E-UTRA trong lệnh đo U2L','FMCL / ADJL: ngưỡng E-UTRA','EutranFreqRelation: ngưỡng đo','RSRP −110 dBm','v'],
 ['u2l','Liên tần và IRAT','Cách đưa UE dữ liệu sang LTE','Công tắc PS handover / redirection U2L (thuật toán RNC)','Tính năng LTE PS handover / redirection','Feature PS handover / release with redirect to LTE','Redirection phổ biến hơn','v'],
 ['ifnb','Liên tần và IRAT','Danh sách lân cận khác tần và LTE','ADD UINTERFREQNCELL, ADD ULTENCELL','ADJI, ADJL','UtranRelation (khác tần), EutranFreqRelation','—','c'],
 ['d2f','Trạng thái RRC','Bộ đếm không hoạt động DCH/HS → FACH','UUESTATETRANS: BeD2FStateTransTimer, BeH2FStateTransTimer','RNC: InactivityTimerDownlinkDCH, InactivityTimerUplinkDCH','ChannelSwitching / RncFunction: hsdschInactivityTimer, downswitchTimer','2–5 s','v'],
 ['f2p','Trạng thái RRC','Bộ đếm FACH → CELL_PCH / URA_PCH','UUESTATETRANS: BeF2PStateTransTimer','RNC: bộ đếm rời Cell_FACH','ChannelSwitching: bộ đếm FACH → URA/PCH','5–30 s','v'],
 ['p2i','Trạng thái RRC','Bộ đếm PCH → Idle','UUESTATETRANS: bộ đếm rời CELL_PCH/URA_PCH','RNC: MSActivitySupervision','RncFunction: bộ đếm không hoạt động ở PCH','vài phút đến 30 phút','v'],
 ['e4a','Trạng thái RRC','Ngưỡng đo lưu lượng 4a (FACH → DCH/HS)','UUESTATETRANS: BeF2DTvmThd, BeF2HTvmThd','RNC: TrafVolThresholdULLow, TrafVolThresholdDLLow','ChannelSwitching: ulRlcBufUpswitch, dlRlcBufUpswitch','256–1024 B','v'],
 ['fd','Trạng thái RRC','Xử lý fast dormancy (SCRI Rel-8)','Công tắc fast dormancy ở RNC','Tính năng Fast Dormancy','Feature Fast Dormancy Handling','Bật, đưa về CELL_PCH','v'],
 ['hsCodes','HSDPA','Số mã HS-PDSCH (cố định hoặc động)','UCELLHSDPA: AllocCodeMode, HsPdschMaxCodeNum, HsPdschMinCodeNum','WCEL: HSPDSCHCodeSet, cấp mã động','Hsdsch: numHsPdschCodes','5–15, cấp động','v'],
 ['hsScch','HSDPA','Số HS-SCCH (số UE tối đa mỗi TTI)','UCELLHSDPA: HsScchCodeNum','WCEL: MaxNbrOfHSSCCHCodes','Hsdsch: numHsScchCodes','2–4','v'],
 ['hsSch','HSDPA','Thuật toán lập lịch MAC-hs','NodeB: phương thức lập lịch (PF, MAX C/I, RR, EPF)','WBTS: HSDPA scheduler (PF)','Hsdsch: lập lịch PF có trọng số QoS','PF','v'],
 ['cqiOff','HSDPA','Lệch công suất đo CQI (MPO)','UCELLHSDPA: tham số MPO','WCEL: HSDPA measurement power offset','Hsdsch: hsMeasurementPowerOffset','tuỳ công suất HS','v'],
 ['eagch','HSUPA','Số mã E-AGCH, E-RGCH/E-HICH','UCELLHSUPA: EagchCodeNum, ErgchEhichCodeNum','WCEL: số kênh E-AGCH, E-RGCH/E-HICH','Eul: numEagchCodes, numEhichErgchCodes','1 và 1–2','v'],
 ['rot','HSUPA','RoT / tải đường lên mục tiêu cho lập lịch E-DCH','NodeB: hệ số tải UL mục tiêu tối đa','WCEL: PrxMaxTargetBTS','Eul / NodeBFunction: RoT tối đa','6–8 dB','v'],
 ['ulAdm','Điều khiển nhận và tải','Ngưỡng nhận đường lên (tải hoặc noise rise)','UCELLCAC: UlNonCtrlThdForAMR, UlNonCtrlThdForNonAMR (%)','WCEL: PrxTarget, PrxOffset (dB)','UtranCell: aseUlAdm / ngưỡng tải UL','~75 % (≈ 6 dB)','v'],
 ['dlAdm','Điều khiển nhận và tải','Ngưỡng nhận đường xuống theo công suất','UCELLCAC: DlConvAMRThd, DlOtherThd (%)','WCEL: PtxTarget, PtxOffset','UtranCell: pwrAdm, pwrAdmOffset','80–90 %','v'],
 ['ldr','Điều khiển nhận và tải','Xử lý khi nghẽn: hạ tốc BE, chuyển tải sang tần khác','UCELLLDR (LDR), OLC','WCEL: điều khiển quá tải','UtranCell: congestion control','—','v'],
 ['t300','Bộ đếm thời gian','T300 / N300: chờ RRC Connection Setup, số lần gửi lại','UIDLEMODETIMER: T300, N300','WCEL/RNC: T300, N300','UtranCell/RncFunction: T300, N300','T300 1–2 s, N300 3','v'],
 ['t312','Bộ đếm thời gian','T312 / N312: chờ đồng bộ khi lập kênh riêng','UIDLEMODETIMER: T312, N312','WCEL: T312, N312','RncFunction: T312, N312','T312 1–6 s','v'],
 ['t313','Bộ đếm thời gian','T313 / N313: phát hiện mất đồng bộ liên kết','UCONNMODETIMER: T313, N313','RNC: T313, N313','RncFunction: T313, N313','T313 3 s, N313 20','v'],
 ['t305','Bộ đếm thời gian','T305: cập nhật định kỳ ở CELL_PCH/URA_PCH','UCONNMODETIMER: T305','RNC: T305','RncFunction: T305','30 phút','v']
];
/* lỗi thường gặp: [tên, triệu chứng, nguyên nhân[], kiểm tra[], KPI[], {h,n,e} gợi ý theo vendor] */
const U3FLT=[
 ['Thiếu lân cận (missing neighbour)','Rớt cuộc gọi ở vùng biên dù có cell mạnh gần đó; drive test thấy cell mạnh nằm ở "detected set" chứ không trong monitored set.',['Chưa khai báo quan hệ lân cận, hoặc chỉ khai một chiều','Danh sách vượt giới hạn 32 cell nên bị cắt','Đổi mã scrambling mà chưa cập nhật lân cận'],['Đọc báo cáo detected set (UE báo cell không có trong danh sách)','Đối chiếu danh sách lân cận hai chiều','Xem tỉ lệ rớt theo cell kề và theo giờ'],['u_csdrop','u_sho'],{h:'LST UINTRAFREQNCELL; ADD UINTRAFREQNCELL',n:'NetAct: đối tượng ADJS dưới WCEL',e:'lget UtranCell=…,UtranRelation (moshell)'}],
 ['Nhiễm bẩn pilot','Ec/Io thấp (dưới −12 dB) dù RSCP tốt; nhiều cell gần ngang nhau, active set thay đổi liên tục.',['Anten quá cao hoặc tilt quá nhỏ, cell phủ quá xa (overshooting)','Thiếu cell chủ đạo ở khu vực mở (cầu, nhà cao tầng)'],['Drive test: số cell trong phạm vi 3–5 dB so với cell tốt nhất','Bản đồ cell tốt nhất có lốm đốm','Thống kê khoảng cách UE theo cell (propagation delay)'],['u_csdrop','u_sho','u_hsdpa'],{h:'Chỉnh tilt điện (RET), giảm PCPICHPower có kiểm soát',n:'Chỉnh tilt, PtxPrimaryCPICH',e:'Chỉnh tilt, primaryCpichPower'}],
 ['Trùng mã scrambling','Chuyển giao vào nhầm cell, rớt ngay sau 1A; báo cáo đo có SC nhưng cell thực không phải lân cận đã khai.',['Hai cell gần nhau dùng cùng mã scrambling chính','Lân cận của lân cận trùng mã'],['Kiểm tra quy hoạch SC: cell cùng SC phải đủ xa','Đối chiếu RSCP đo được với khoảng cách tới cell khai báo'],['u_sho','u_csdrop'],{h:'LST UCELL (PScrambCode)',n:'WCEL: PriScrCode',e:'UtranCell: primaryScramblingCode'}],
 ['RTWP cao, nhiễu đường lên','RTWP trên khoảng −95 dBm ngay cả khi ít lưu lượng (ban đêm); RRC thất bại không có phản hồi; vùng phủ co lại.',['Nhiễu ngoài: repeater lỗi, thiết bị phát trái phép, xuyên điều chế','Lỗi phần cứng: đầu nối lỏng, VSWR cao, LNA/TMA hỏng','Lệch giữa hai nhánh thu (diversity)'],['Xem RTWP theo giờ: cao suốt ngày đêm thì không phải do tải','So sánh RTWP hai nhánh RX','Quét phổ đường lên tại trạm'],['u_rtwp','u_rrc','u_hsupa'],{h:'Bộ đếm VS.MeanRTWP; kiểm tra cảnh báo RF của NodeB',n:'Bộ đếm PrxTotal trung bình theo cell',e:'Bộ đếm pmAverageRssi; moshell: lấy RSSI theo nhánh'}],
 ['Nghẽn mã OVSF','Từ chối RAB hoặc hạ tốc độ do hết mã, trong khi công suất và CE còn.',['Đặt cố định nhiều mã HS-PDSCH','Nhiều kết nối R99 tốc độ cao (SF8)','Không dùng F-DPCH, cây mã phân mảnh'],['Bộ đếm từ chối do code','Tỉ lệ sử dụng cây mã theo giờ','Xem cấu hình mã HS cố định hay động'],['u_cong','u_rabps','u_rabcs'],{h:'UCELLHSDPA: AllocCodeMode (Automatic), bật F-DPCH',n:'Cấp mã HS-PDSCH động',e:'Hsdsch: numHsPdschCodes; bật F-DPCH'}],
 ['Nghẽn công suất đường xuống','Từ chối RAB do công suất; tốc độ HSDPA thấp giờ cao điểm.',['Lưu lượng lớn','CPICH và kênh chung chiếm nhiều công suất','Cell phủ quá rộng, nhiều UE ở xa'],['Công suất phát trung bình và tối đa theo giờ','Tỉ lệ công suất kênh chung','Phân bố UE theo khoảng cách'],['u_cong','u_hsdpa'],{h:'UCELLCAC (ngưỡng DL), UCELLLDR',n:'WCEL: PtxTarget, PtxOffset',e:'UtranCell: pwrAdm, pwrAdmOffset'}],
 ['Nghẽn CE hoặc Iub','Từ chối RAB do tài nguyên NodeB/Iub; thông lượng HSPA bị giới hạn dù CQI tốt.',['License CE không đủ','Băng thông Iub thấp, cấu hình QoS truyền tải sai','Điều khiển luồng HS-DSCH giới hạn'],['Mức dùng CE theo giờ','Mất gói, trễ trên Iub; FP congestion','Thông lượng MAC-hs so với khả năng vô tuyến'],['u_cong','u_hsdpa','u_rabps'],{h:'Bộ đếm sử dụng CE, Iub; kiểm tra license',n:'Bộ đếm CE theo LCG, Iub',e:'Bộ đếm CE (license), băng thông Iub'}],
 ['RRC thất bại do không phản hồi','UE gửi RRC Connection Request nhưng không gửi Setup Complete; tỉ lệ RRC SR thấp ở biên cell.',['Mất cân bằng vùng phủ: đường xuống (CPICH) phủ xa hơn đường lên','RTWP cao','Lỗi đồng bộ (T312, N312)'],['Phân loại nguyên nhân thất bại RRC','So sánh CPICH với ngân sách đường lên','RTWP cùng thời điểm'],['u_rrc','u_rtwp'],{h:'Phân tích theo nguyên nhân thất bại RRC ở RNC',n:'Bộ đếm RRC setup failure theo nguyên nhân',e:'pmNoFailedRrcConnectReq…; theo nguyên nhân'}],
 ['IRAT sang LTE thất bại hoặc không xảy ra','UE dữ liệu ở lại 3G dù có LTE; tỉ lệ thành công IRAT thấp.',['Thiếu lân cận LTE, sai EARFCN','Ngưỡng 3A hoặc ưu tiên tuyệt đối đặt sai','UE không hỗ trợ compressed mode / đo E-UTRA','Lỗi chuẩn bị ở lõi hoặc eNB (Relocation Preparation Failure)'],['Trace RANAP: cause của Relocation Preparation Failure','Tỉ lệ thành công theo cặp cell','Kiểm tra SIB19 (ưu tiên tuyệt đối) cho UE rỗi'],['u_iratho'],{h:'LST ULTENCELL, UCELLNFREQPRIOINFO',n:'NetAct: ADJL, tham số ưu tiên tuyệt đối',e:'EutranFreqRelation, EutranCellRelation'}],
 ['SRNS relocation hoặc Iur lỗi','Rớt khi đi qua biên RNC; dịch vụ HSPA hạ về R99 ở vùng DRNC.',['Iur nghẽn hoặc không hỗ trợ HS-DSCH qua Iur','Tham số relocation sai, lỗi chuẩn bị ở lõi','Lệch cấu hình hai RNC (lân cận, tính năng)'],['Trace RNSAP, RANAP quanh biên RNC','Tỉ lệ thành công relocation','Tải và lỗi trên Iur'],['u_sho','u_psdrop','u_csdrop'],{h:'Kiểm tra cấu hình Iur, lân cận khác RNC',n:'Kiểm tra cấu hình Iur, ADJS sang RNC khác',e:'IurLink, ExternalUtranCell'}],
 ['SHO overhead quá cao','Tỉ lệ UE có từ 2 cell trở lên trong active set rất cao (overhead trên 40–50 %), tốn CE, mã, công suất.',['Reporting range 1A quá lớn','Vùng chồng lấn nhiều (pilot pollution)'],['Phân bố kích thước active set','So sánh 1A/1B với tối ưu tilt'],['u_sho','u_cong'],{h:'IntraRelThdFor1A…, IntraRelThdFor1B…',n:'HOPS: AdditionWindow, DropWindow',e:'reportingRange1a, reportingRange1b'}],
 ['Thông lượng HSDPA thấp','Tốc độ người dùng thấp dù ít người; CQI trung bình thấp.',['CQI thấp do nhiễu, pilot pollution','Ít mã HS hoặc công suất HS thấp','UE category thấp; 64QAM/MIMO chưa bật','Iub giới hạn'],['Phân bố CQI, tỉ lệ 16QAM/64QAM','Số mã trung bình mỗi TTI','Thông lượng Iub so với vô tuyến'],['u_hsdpa','u_users'],{h:'UCELLHSDPA, công tắc 64QAM/MIMO',n:'WCEL: tính năng HSDPA 64QAM, MIMO',e:'Hsdsch: tính năng 64QAM, MIMO, số mã'}],
 ['Thông lượng HSUPA thấp','Tải lên chậm; grant thấp; RoT dao động hoặc luôn sát mục tiêu.',['RoT mục tiêu thấp','Nhiễu ngoài làm RTWP cao','Cell lân cận gửi non-serving RG DOWN','UE ở biên (giới hạn công suất)'],['RoT và RTWP theo giờ','Phân bố grant, tỉ lệ TTI 2 ms','Thống kê happy bit'],['u_hsupa','u_rtwp'],{h:'Tham số RoT mục tiêu NodeB, TTI 2 ms',n:'WCEL: PrxMaxTargetBTS, HSUPA 2 ms TTI',e:'Eul: tham số RoT, TTI 2 ms'}],
 ['Bão báo hiệu do chuyển trạng thái','Số RRC Connection Request rất cao, CPU RNC tăng, RRC SR giảm giờ cao điểm.',['Bộ đếm quá ngắn','Smartphone gửi keep-alive định kỳ','Không bật CELL_PCH/URA_PCH, UE dùng fast dormancy kiểu cũ (về Idle)'],['Số lần thử RRC theo nguyên nhân','Tỉ lệ thời gian theo trạng thái','Tải xử lý của RNC'],['u_rrc','u_rabps'],{h:'UUESTATETRANS, bật CELL_PCH/URA_PCH',n:'Tham số inactivity, MSActivitySupervision',e:'ChannelSwitching, URA_PCH'}],
 ['Cell không phục vụ','Cell mất lưu lượng đột ngột; tỉ lệ sẵn sàng giảm.',['Lỗi phần cứng, mất truyền dẫn Iub','Cell bị khoá hoặc hết license','Lỗi đồng bộ'],['Trạng thái hoạt động của cell và cảnh báo','Thời gian không sẵn sàng theo cell'],['u_avail'],{h:'DSP UCELL; xem cảnh báo NodeB',n:'Trạng thái WCEL, cảnh báo NetAct',e:'lget UtranCell operationalState; alarm list'}],
 ['Mất cân bằng tải giữa hai sóng mang','F1 nghẽn trong khi F2 rỗi; UE cứ quay về F1.',['Tham số chọn lại cell nghiêng về F1','Chưa bật cân bằng tải liên tần, HSPA chỉ ở một sóng mang'],['Tỉ lệ lưu lượng giữa hai sóng mang','Nghẽn theo sóng mang'],['u_cong','u_erl'],{h:'Tham số chọn lại cell liên tần, cân bằng tải liên tần',n:'Tham số Sintersearch, Qoffset, load balancing',e:'Tham số inter-frequency load sharing'}]
];
U3P.vd={grp:'all',q:'',kf:'all'};
function u3ParRows(){const P=U3P.vd,v=uVn(),q=P.q.trim().toLowerCase();
  let g0='';const nc=v==='3gpp'?6:4;
  return U3PAR.filter(r=>(P.grp==='all'||r[1]===P.grp)&&(!q||r.join(' ').toLowerCase().includes(q))).map(r=>`${r[1]!==g0?(g0=r[1],`<tr class="u3gh2"><td colspan="${nc}">${uE(r[1])}</td></tr>`):''}<tr${r[7]==='v'?' class="u3vchk"':''}><td>${uE(r[2])}</td>${v==='3gpp'?`<td>${uE(r[3])}</td><td>${uE(r[4])}</td><td>${uE(r[5])}</td>`:`<td>${uE(r[{huawei:3,nokia:4,ericsson:5}[v]])}</td>`}<td>${uE(r[6])}</td><td>${r[7]==='c'?'Thường gặp':'Cần đối chiếu'}</td></tr>`).join('')||`<tr><td colspan="6">Không có dòng khớp.</td></tr>`;}
function u3KpiRows(){if(typeof KL==='undefined')return'';const v=uVn(),f=U3P.vd.kf;
  return KL.filter(k=>k.tech==='3G'&&(f==='all'||k.cat===f)).map(k=>{const cnt=v==='huawei'?k.hw:v==='nokia'?k.nk:v==='ericsson'?k.er:null;const cs=a=>a.map(x=>uE(x.replace(/^[!?]/,''))).join(', ');
    return `<tr><td>${uE(k.nm)}</td><td>${uE(k.fm)}</td><td>${cnt?cs(cnt)||'—':'H: '+cs(k.hw)+'<br>N: '+cs(k.nk)+'<br>E: '+cs(k.er)}</td><td>${uE(k.th||'')}</td><td><button type="button" class="btn sm" data-u3go="kpi:${k.id}">Mở →</button></td></tr>`;}).join('');}
function u3FltHtml(){const v=uVn(),kn=id=>{const k=typeof KL!=='undefined'&&KL.find(x=>x.id===id);return k?`<button type="button" class="chip u3chip" data-u3go="kpi:${id}">${uE(k.nm)}</button>`:'';};
  return U3FLT.map((f,i)=>`<details class="u3flt"${i<2?' open':''}><summary><b>${uE(f[0])}</b></summary><p class="e2d"><b>Triệu chứng:</b> ${uE(f[1])}</p><div class="u3two"><div><b>Nguyên nhân hay gặp</b><ul class="u3ul">${f[2].map(x=>`<li>${uE(x)}</li>`).join('')}</ul></div><div><b>Cách kiểm tra</b><ul class="u3ul">${f[3].map(x=>`<li>${uE(x)}</li>`).join('')}</ul></div></div>
   <p class="e2x"><b>${v==='3gpp'?'Gợi ý theo vendor':'Gợi ý '+uVName(v)}:</b> ${v==='3gpp'?['h','n','e'].map(x=>({h:'Huawei',n:'Nokia',e:'Ericsson'})[x]+': '+uE(f[5][x])).join('. '):uE(f[5][{huawei:'h',nokia:'n',ericsson:'e'}[v]])}</p><p class="e2x"><b>KPI bị ảnh hưởng:</b> ${f[4].map(kn).join(' ')}</p></details>`).join('');}
function u3Calc(){const g=id=>+(($('#'+id)||{}).value||0);const rt=g('u3cRt'),nf=g('u3cNf'),a=g('u3cRrc'),b=g('u3cRab');
  const nr=rt-nf,eta=1-Math.pow(10,-nr/10);const o=$('#u3cOut');if(o)o.innerHTML=`<dt>Noise rise</dt><dd>${uF(nr,1)} dB</dd><dt>Hệ số tải UL tương đương</dt><dd>${nr<0?'—':uF(eta*100,1)+' %'}</dd><dt>CSSR = RRC SR × RAB SR</dt><dd>${uF(a*b/100,2)} %</dd>`;}
U3R.vd={
 html(){const P=U3P.vd,v=uVn(),grps=[...new Set(U3PAR.map(r=>r[1]))];
  return `<div class="panel"><h3>Tham số 3G chính theo vendor</h3><p class="hint">Bấm nút vendor ở thanh trên để xem cột tương ứng (3GPP = cả ba). Dòng có nền nhạt: tên MO/tham số khác nhau giữa các release, đề nghị đối chiếu tài liệu vendor trước khi sửa cấu hình. Giá trị điển hình chỉ để tham khảo.</p>
  <div class="ctl">${uSel('vd','grp','Nhóm',[['all','Tất cả']].concat(grps.map(g=>[g,g])))}<label class="c"><span class="cl">Tìm nhanh</span><input type="search" id="u3vq" value="${uE(P.q)}" placeholder="ví dụ 1A, CPICH, T313" autocomplete="off"></label></div>
  <div class="scroll" style="margin-top:10px"><table class="e2tb u3w"><thead><tr><th>Ý nghĩa (3GPP)</th>${v==='3gpp'?'<th>Huawei (MO: tham số)</th><th>Nokia (MO: tham số)</th><th>Ericsson (MO: tham số)</th>':`<th>${uVName(v)} (MO: tham số)</th>`}<th>Giá trị điển hình</th><th>Tên MO/tham số</th></tr></thead><tbody id="u3ParB">${u3ParRows()}</tbody></table></div></div>

  <div class="panel"><h3>KPI 3G và bộ đếm theo vendor</h3><p class="hint">Lấy từ thẻ KPI mạng (cùng một nguồn dữ liệu). Bấm Mở để xem luồng đo, nguyên nhân và cách xử lý chi tiết.</p>
  <div class="ctl">${uSel('vd','kf','Nhóm KPI',[['all','Tất cả'],['acc','Truy cập'],['ret','Duy trì'],['mob','Di động'],['int','Toàn vẹn (thông lượng)'],['avl','Sẵn sàng'],['utl','Sử dụng, nghẽn']])}</div>
  <div class="scroll" style="margin-top:10px"><table class="e2tb u3w"><thead><tr><th>KPI</th><th>Công thức</th><th>Bộ đếm ${v==='3gpp'?'(H / N / E)':uVName(v)}</th><th>Mục tiêu tham khảo</th><th></th></tr></thead><tbody id="u3KpB">${u3KpiRows()}</tbody></table></div>
  <div class="u3calc"><b>Tính nhanh</b><div class="ctl" style="margin-top:8px"><label class="c"><span class="cl">RTWP đo (dBm)</span><input type="number" id="u3cRt" value="-101" step="0.1"></label><label class="c"><span class="cl">Sàn nhiễu (dBm)</span><input type="number" id="u3cNf" value="-105.1" step="0.1"></label><label class="c"><span class="cl">RRC SR (%)</span><input type="number" id="u3cRrc" value="99.4" step="0.1"></label><label class="c"><span class="cl">CS RAB SR (%)</span><input type="number" id="u3cRab" value="99.6" step="0.1"></label></div><dl class="kv" id="u3cOut" style="margin-top:8px"></dl></div></div>

  <div class="panel"><h3>Lỗi thường gặp ở mạng 3G và cách kiểm tra</h3>${u3FltHtml()}</div>`;},
 after(){u3Calc();},
 upd(k){if(k==='grp'){const b=$('#u3ParB');if(b)b.innerHTML=u3ParRows();}if(k==='kf'){const b=$('#u3KpB');if(b)b.innerHTML=u3KpiRows();}}
};
document.addEventListener('input',e=>{const t=e.target;if(t.id==='u3vq'){U3P.vd.q=t.value;const b=$('#u3ParB');if(b)b.innerHTML=u3ParRows();}else if(t.id&&/^u3c/.test(t.id))u3Calc();});

/* ---------- Gắn thẻ vào ứng dụng: RENDER, tìm kiếm chung, liên kết E2E và KPI ---------- */
RENDER.u3=renderU3;
/* chọn trước nút/giao diện/giao thức khi nhảy từ ô tìm kiếm */
(function(){const a=U3R.arch.after;U3R.arch.after=function(){a.call(this);
  if(U3.pIf){const e=$('#u3ArchSel');if(e)e.innerHTML=u3IfHtml(U3.pIf);U3.pIf=null;}
  if(U3.pNd){U3A.sel=U3.pNd;const e=$('#u3ArchSel');if(e)e.innerHTML=u3NodeHtml(U3.pNd);const g=$('#u3ArchSvg');if(g)g.innerHTML=u3ArchSvg();u3ArchPos();U3.pNd=null;}
  if(U3.pPr!=null){const p=U3PR[U3.pPr],e=$('#u3PrInfo');if(e&&p)e.innerHTML=`<p class="e2x"><b>${uE(p[0])}</b></p><p class="e2d">${uE(p[4])}</p>`;U3.pPr=null;}};})();
if(typeof qSnap==='function'){const _q3=qSnap;qSnap=function(){_q3.apply(this,arguments);if(!QS||!QS.I||QS.u3)return;QS.u3=1;
  const CAT='Thẻ Mạng 3G UTRAN';
  /* bỏ mục do bộ quét chung tạo cho thẻ này (không biết đang ở mục con nào), thay bằng mục theo từng mục con */
  const keep=QS.I.filter(e=>!(e.c===CAT&&typeof e.sel==='function'));keep.seen=QS.I.seen;QS.I.length=0;keep.forEach(e=>QS.I.push(e));
  const body=$('#u3Body'),cur=U3.v,ra=U3.raf;
  if(body){for(const [v,vn] of U3V){try{U3.v=v;body.innerHTML=U3R[v].html();
    body.querySelectorAll('.panel').forEach(pn=>{const h=pn.querySelector('h3'),tt=h?h.textContent:vn,txt=qText(pn).slice(0,6000);if(txt.trim().length<12)return;
      qAdd(QS.I,CAT+' · '+vn,tt,txt,1,()=>{S.tab='u3';U3.v=v;},()=>[...document.querySelectorAll('#t-u3 .panel')].find(p=>{const x=p.querySelector('h3');return x&&x.textContent===tt;}));});}catch(e){console.error(e);}}
    U3.v=cur;try{if(S.tab==='u3')renderU3();else body.innerHTML='';}catch(e){}}
  const go=(v,f)=>()=>{S.tab='u3';U3.v=v;if(f)f();};
  U3PAR.forEach(r=>qAdd(QS.I,'Mạng 3G · Tham số '+r[1],r[2],['Huawei: '+r[3],'Nokia: '+r[4],'Ericsson: '+r[5],'Điển hình: '+r[6]].join('. '),3,go('vd',()=>{U3P.vd.grp=r[1];U3P.vd.q='';}),'#u3ParB'));
  U3FLT.forEach(f=>qAdd(QS.I,'Mạng 3G · Lỗi thường gặp',f[0],[f[1],f[2].join('; '),f[3].join('; '),f[5].h,f[5].n,f[5].e].join('. '),3,go('vd'),()=>{const d=[...document.querySelectorAll('#t-u3 .u3flt')].find(x=>x.querySelector('summary').textContent===f[0]);if(d)d.open=true;return d;}));
  Object.keys(U3I).forEach(k=>{const I=U3I[k];qAdd(QS.I,'Mạng 3G · Giao diện',k+' ('+I.e+')',[I.d,I.cp.join(' / '),I.up.join(' / '),I.atm,I.sp,I.m.join('; ')].join('. '),3,go('arch',()=>{U3.pIf=k;}),'#u3ArchSel');});
  Object.keys(U3N).forEach(id=>{const n=U3N[id];qAdd(QS.I,'Mạng 3G · Nút mạng',n.l,[n.d,n.f.join('; '),n.v?Object.values(n.v).join('; '):''].join('. '),2,go('arch',()=>{U3.pNd=id;}),'#u3ArchSel');});
  U3PR.forEach((p,i)=>qAdd(QS.I,'Mạng 3G · Giao thức',p[0],p[4],2,go('arch',()=>{U3.pPr=i;}),'#u3PrInfo'));
  U3CH.lg.concat(U3CH.tr,U3CH.ph).forEach(c=>qAdd(QS.I,'Mạng 3G · Kênh WCDMA',c[0],c[1]+' ('+c[2]+')',2,go('phy',()=>{U3CHS=c[0];}),'#u3ChInfo'));
  Object.keys(U3FL).forEach(k=>qAdd(QS.I,'Mạng 3G · Luồng trên sơ đồ kiến trúc',U3FL[k].n,U3FL[k].st.map(s=>s[3]).join('; '),2,go('arch',()=>{U3P.arch.flow=k;U3A.i=0;U3A.t=0;}),'#u3ArchSvg'));
  Object.keys(U3HOS).forEach(k=>qAdd(QS.I,'Mạng 3G · Mô phỏng chuyển giao',U3HOS[k].n,'Soft HO, softer, active set, sự kiện 1A 1B 1C 1D 2D 2F 2B 3A, compressed mode, SRNS relocation',2,go('ho',()=>{U3P.ho.sc=k;U3HA.t=0;}),'#u3HoMap'));};}
/* thẻ Toàn trình E2E: khi đang xem luồng 3G thì có nút sang thẻ 3G */
const U3E2V={reg:'arch',data:'hs',mo:'arch',mt:'rrc',idle:'rrc',ho:'ho',irat:'ho',chg:'arch',sms:'arch',roam:'arch',off:'rrc'};
if(typeof e2Kpi==='function'){const _k3=e2Kpi;e2Kpi=function(){_k3.apply(this,arguments);if(S.e2R!=='g3')return;const b=$('#e2Kpi .e2go');const v=U3E2V[S.e2Sc]||'arch';
  if(b)b.insertAdjacentHTML('afterbegin',`<button type="button" class="btn sm pri" data-u3go="u3:${v}">Mạng 3G UTRAN · ${uE((U3V.find(x=>x[0]===v)||[,''])[1])} →</button>`);};}
/* thẻ KPI: KPI 3G có nút sang mô phỏng tương ứng */
const U3KV={u_rrc:'rrc',u_rabcs:'arch',u_rabps:'rrc',u_cssr:'arch',u_csdrop:'ho',u_psdrop:'rrc',u_sho:'ho',u_iratho:'ho',u_hsdpa:'hs',u_hsupa:'hs',u_cong:'phy',u_avail:'phy',u_rtwp:'phy',u_users:'hs',u_erl:'phy',lu3:'arch'};
if(typeof kpDetHtml==='function'){const _d3=kpDetHtml;kpDetHtml=function(k){let h=_d3.apply(this,arguments);if(k&&U3KV[k.id]){const v=U3KV[k.id];h+=`<p class="u3kpl"><button type="button" class="btn sm" data-u3go="u3:${v}">Xem mô phỏng ở thẻ Mạng 3G UTRAN · ${uE(U3V.find(x=>x[0]===v)[1])} →</button></p>`;}return h;};}

