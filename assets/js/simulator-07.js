
/* ===== Thẻ NSA EN-DC và di động 5G-A (nd) — đợt 13 ===== */
const ND={v:'arch',raf:0,last:0};
const NDV=[['arch','Kiến trúc NSA/SA và các option'],['sgnb','Thêm, đổi, xoá SgNB'],['scg','Lỗi SCG và rớt EN-DC'],['dup','PDCP duplication và NR-DC'],['mob','Di động 5G-A: CHO, DAPS, LTM'],['vd','Tham số, KPI, lỗi']];
const NDR={};   /* mỗi mục: html(), after(), tick(dt), upd(k), act(a,el) */
const NDP={};   /* tham số điều khiển của từng mục */
const NDF={};   /* hàm hiển thị giá trị thanh trượt */
const nE=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const nF=(x,d)=>{d=d||0;const p=Math.pow(10,d);return (Math.round(x*p)/p).toFixed(d).replace('.',',');};
const nC=(x,a,b)=>x<a?a:x>b?b:x;
const nRng=seed=>{let s=seed|0;return()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};};
const nGs=r=>{let u=0,v=0;while(!u)u=r();while(!v)v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);};
const nDb=x=>10*Math.log10(Math.max(x,1e-30)),nLin=d=>Math.pow(10,d/10);
const nVn=()=>S.vendor||'3gpp';
const nVName=v=>({'3gpp':'3GPP',huawei:'Huawei',nokia:'Nokia',ericsson:'Ericsson'})[v]||v;
const nReduced=()=>!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
/* suy hao 3GPP UMa rút gọn (dB) theo khoảng cách m và tần số GHz */
const nPL=(d,f)=>28+22*Math.log10(Math.max(d,10))+20*Math.log10(f);
/* thanh trượt, ô chọn, ô tích: thuộc tính data-ndi="mục:khoá" */
function nSl(vw,k,l,mn,mx,st,f,hint,pk){NDF[vw+':'+k]=f;const v=NDP[vw][k];
  return `<label class="c"><span class="cl">${l}<output>${f(v)}</output></span><input type="range" data-ndi="${vw}:${k}" min="${mn}" max="${mx}" step="${st}" value="${v}">${hint?`<span class="u3ph">${hint}</span>`:''}${pk?nPnTag(pk):''}</label>`;}
function nSel(vw,k,l,opts,hint,pk){const v=NDP[vw][k];
  return `<label class="c"><span class="cl">${l}</span><select data-ndi="${vw}:${k}">${opts.map(o=>`<option value="${o[0]}"${String(o[0])===String(v)?' selected':''}>${nE(o[1])}</option>`).join('')}</select>${hint?`<span class="u3ph">${hint}</span>`:''}${pk?nPnTag(pk):''}</label>`;}
function nChk(vw,k,l){return `<label class="u3ck"><input type="checkbox" data-ndi="${vw}:${k}"${NDP[vw][k]?' checked':''}> ${l}</label>`;}
/* tên tham số vendor đang chọn (lấy từ NDPAR theo khoá) */
function nPn(key){const r=(typeof NDPAR!=='undefined'?NDPAR:[]).find(x=>x[0]===key);if(!r)return'';const v=nVn();if(v==='3gpp')return'';
  return nVName(v)+': '+r[{huawei:3,nokia:4,ericsson:5}[v]]+(r[7]==='v'?' (cần đối chiếu)':'');}
function nPnTag(key){const t=nPn(key);return t?`<span class="vh ndvh">${nE(t)}</span>`:'';}
/* nhật ký bản tin dùng chung */
function nLog(list,cur){if(!list||!list.length)return '<p class="hint">Chưa có bản tin.</p>';
  return `<ol class="u3log ndlog">${list.map((m,i)=>`<li class="${i===cur?'ndcur':''}"><span class="u3t">${nF(m.t,2)} s</span><span class="ndpr ndpr-${m.p}">${nE(m.p)}</span> <b>${nE(m.m)}</b> <span class="u3msg">${nE(m.a)}</span>${m.d?`<br><span class="note">${nE(m.d)}</span>`:''}</li>`).join('')}</ol>`;}
/* liên kết sang thẻ khác */
const NDLK={
  arch:{e2:[['data','nsa'],['reg','sa'],['fb','nsa'],['irat','nsa']],kpi:['endc4','sgnbdrop','hosr5']},
  sgnb:{e2:[['data','nsa'],['ho','nsa']],kpi:['endc4','sgnbdrop']},
  scg:{e2:[['data','nsa'],['ho','nsa']],kpi:['sgnbdrop','endc4']},
  dup:{e2:[['data','sa']],kpi:['hosr5']},
  mob:{e2:[['ho','sa'],['ho','nsa'],['irat','sa']],kpi:['hosr5','hosr4','c5_eps']},
  vd:{e2:[['data','nsa'],['ho','nsa'],['ho','sa'],['fb','nsa'],['irat','nsa']],kpi:[]}
};
const NDT={g3:'3G',g4:'4G',nsa:'5G NSA',sa:'5G SA'};
function ndLinks(){
  const L=NDLK[ND.v]||{e2:[],kpi:[]},hasE2=typeof E2S!=='undefined',hasK=typeof KL!=='undefined';
  const e2=hasE2?L.e2.map(([id,tk])=>{const s=E2S.find(x=>x.id===id);return s&&s.f&&(s.f[tk]||(tk==='nsa'&&s.f.g4))?[s,tk]:null;}).filter(Boolean):[];
  const kp=hasK?L.kpi.map(id=>KL.find(k=>k.id===id)).filter(Boolean):[];
  return `<div class="panel u3lk"><h3>Xem tiếp ở thẻ khác</h3>
  ${e2.length?`<p class="e2x"><b>Luồng ở thẻ Toàn trình E2E</b> (mở sẵn đúng công nghệ):</p><div class="e2go">${e2.map(([s,tk])=>`<button type="button" class="btn sm" data-ndgo="e2:${s.id}:${tk}">${nE(s.n)} · ${NDT[tk]} →</button>`).join('')}</div>`:''}
  ${kp.length?`<p class="e2x" style="margin-top:10px"><b>KPI liên quan ở thẻ KPI mạng</b> (công thức, bộ đếm ba vendor):</p><div class="e2go">${kp.map(k=>`<button type="button" class="btn sm" data-ndgo="kpi:${k.id}">${nE(k.nm)} →</button>`).join('')}</div>`:''}
  <p class="e2x" style="margin-top:10px"><b>Thẻ liên quan:</b></p><div class="e2go"><button type="button" class="btn sm" data-tab="hx">Chuyển giao →</button><button type="button" class="btn sm" data-tab="mob">Di động và điều hướng →</button><button type="button" class="btn sm" data-tab="ca">Ghép sóng mang →</button><button type="button" class="btn sm" data-tab="sig">Báo hiệu và lưu lượng →</button></div>
  </div>`;
}
function ndNav(){return `<div class="seg u3seg ndseg" role="group" aria-label="Mục của thẻ NSA EN-DC">${NDV.map((v,i)=>`<button type="button" data-ndv="${v[0]}" aria-pressed="${v[0]===ND.v}"><span class="ndn">${i+1}</span>${v[1]}</button>`).join('')}</div>`;}
function renderNd(){
  const nav=$('#ndNav'),body=$('#ndBody');if(!nav||!body)return;
  if(!NDR[ND.v])ND.v='arch';
  nav.innerHTML=ndNav();
  const V=NDR[ND.v];body.innerHTML=V.html()+ndLinks();
  if(V.after)V.after();
  if(S.tab==='nd'&&!nReduced())ndStart();else{ndStop();if(V.tick&&S.tab==='nd')V.tick(0);}
}
function ndStart(){if(ND.raf)return;ND.last=performance.now();ND.raf=requestAnimationFrame(ndLoop);}
function ndStop(){if(ND.raf)cancelAnimationFrame(ND.raf);ND.raf=0;}
function ndLoop(now){
  ND.raf=0;if(S.tab!=='nd')return;
  if(document.hidden){ND.last=now;ND.raf=requestAnimationFrame(ndLoop);return;}
  const dt=Math.max(0,Math.min(0.1,(now-ND.last)/1000));ND.last=now;
  const V=NDR[ND.v];if(V&&V.tick){try{V.tick(dt);}catch(e){console.error(e);}}
  ND.raf=requestAnimationFrame(ndLoop);
}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-ndgo]');
  if(g){const [t,id,tk]=g.dataset.ndgo.split(':');
    try{tourStop();}catch(x){}try{stopSig();}catch(x){}
    const top=()=>window.scrollTo({top:Math.min(window.scrollY,$('main').offsetTop-$('.bar').offsetHeight)});
    if(t==='e2'){try{e2Stop();}catch(x){}S.e2Sc=id;S.e2R=tk||'nsa';S.e2M=S.mode;if(typeof E2A!=='undefined'){E2A.key='';E2A.i=0;}S.tab='e2';renderAll();top();}
    else if(t==='kpi'){S.tab='kpi';KP.tech='all';KP.ly='all';KP.cat='all';KP.q='';KP.node='';KP.sel=id;kpSig='';renderAll();setTimeout(()=>{const d=$('#kpDet');if(d)d.scrollIntoView({block:'start',behavior:'smooth'});},60);}
    else if(t==='nd'){S.tab='nd';if(id)ND.v=id;renderAll();top();}
    return;}
  const t=e.target.closest('#t-nd [data-ndv],#t-nd [data-nda]');if(!t)return;
  if(t.dataset.ndv){if(t.dataset.ndv===ND.v)return;ND.v=t.dataset.ndv;ndStop();renderNd();return;}
  const [vw,a]=t.dataset.nda.split(':');const V=NDR[vw];if(V&&V.act)V.act(a,t);
});
function ndInp(el){const [vw,k]=el.dataset.ndi.split(':');const P=NDP[vw];if(!P)return;
  P[k]=el.type==='checkbox'?el.checked:(el.tagName==='SELECT'&&isNaN(+el.value)?el.value:+el.value);
  const o=el.parentElement.querySelector('output');if(o&&NDF[vw+':'+k])o.textContent=NDF[vw+':'+k](P[k]);
  const V=NDR[vw];if(V&&V.upd)V.upd(k);}
document.addEventListener('input',e=>{const el=e.target;if(!el.dataset||!el.dataset.ndi||el.type!=='range')return;ndInp(el);});
document.addEventListener('change',e=>{const el=e.target;if(!el.dataset||!el.dataset.ndi||el.type==='range')return;ndInp(el);});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest&&e.target.closest('#t-nd [data-nda]')&&e.target.tagName!=='BUTTON'){e.preventDefault();e.target.closest('[data-nda]').dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
/* đồ thị đường: dùng lại uPlot của thẻ 3G */
const nPlot=o=>uPlot(o);
/* thanh ngang so sánh */
function nBars(rows,max,unit,d){return `<div class="ndbars">${rows.map(r=>`<div class="ndbr"><span class="ndbl">${nE(r[0])}</span><span class="ndbt"><i style="width:${nC(r[1]/max*100,0,100)}%;background:${r[2]}"></i></span><b>${nF(r[1],d==null?1:d)}${unit||''}</b></div>`).join('')}</div>`;}
/* ---------- Mục 1: Kiến trúc NSA/SA và các option ---------- */
NDP.arch={opt:'3x',r:70,capL:150,capN:900,lat:5,dots:1};
const NDA={sel:'',dots:[],acc:0,cpAcc:0};
const NDN={
  inet:{x:390,y:38,w:110,h:34,l:'Internet / DN',k:'ext'},
  mme:{x:80,y:118,w:96,h:36,l:'MME',k:'epc'},
  gw:{x:222,y:118,w:118,h:36,l:'S-GW / P-GW',k:'epc'},
  amf:{x:520,y:118,w:72,h:36,l:'AMF',k:'5gc'},
  smf:{x:610,y:118,w:72,h:36,l:'SMF',k:'5gc'},
  upf:{x:700,y:118,w:72,h:36,l:'UPF',k:'5gc'},
  lte:{x:210,y:262,w:128,h:44,l:'eNB',k:'ran'},
  nr:{x:570,y:262,w:128,h:44,l:'gNB',k:'ran'},
  ue:{x:390,y:384,w:96,h:40,l:'UE',k:'ue'}
};
/* giao diện giữa hai nút: tên ở lõi EPC / lõi 5GC */
const NDE={
  'inet-gw':['SGi','SGi'],'inet-upf':['N6','N6'],'mme-gw':['S11','S11'],'amf-smf':['N11','N11'],'smf-upf':['N4','N4'],
  'mme-lte':['S1-MME','S1-MME'],'gw-lte':['S1-U','S1-U'],'gw-nr':['S1-U','S1-U'],'mme-nr':['—','—'],
  'amf-lte':['N2','N2'],'amf-nr':['N2','N2'],'upf-lte':['N3','N3'],'upf-nr':['N3','N3'],
  'lte-nr':['X2 (X2-C, X2-U)','Xn (Xn-C, Xn-U)'],'lte-ue':['LTE-Uu','LTE-Uu'],'nr-ue':['NR-Uu','NR-Uu']
};
const NDOO=['1','2','3','3a','3x','4','4a','5','7','7x'];
const NDOPT={
  '1':{n:'Option 1 · LTE + EPC',cn:'epc',m:'lte',s:null,kind:'Chỉ 4G',bearer:'MCG bearer',
    d:'Mạng 4G thuần: eNB nối EPC. Làm mốc để so sánh.',
    up:r=>[[['inet','gw','lte','ue'],1]],cp:[['mme','lte','ue']],
    tb:['EPC','eNB','—','eNB','Không','—','VoLTE','Không có NR']},
  '3':{n:'Option 3 · EN-DC, tách ở eNB',cn:'epc',m:'lte',s:'nr',kind:'NSA',bearer:'MCG split bearer (PDCP ở eNB)',
    d:'eNB là nút chính (MN), en-gNB là nút phụ (SN). Lõi EPC. Dữ liệu từ S-GW về eNB, PDCP ở eNB chia một phần sang gNB qua X2-U. eNB phải xử lý toàn bộ lưu lượng 5G nên dễ nghẽn baseband và X2.',
    up:r=>[[['inet','gw','lte','ue'],1-r],[['inet','gw','lte','nr','ue'],r]],cp:[['mme','lte','ue'],['lte','nr']],
    tb:['EPC','eNB (MN)','en-gNB (SN)','eNB','Có (X2-U eNB → gNB)','PDCP eNB','VoLTE trên LTE','Ít dùng: eNB phải nâng cấp lớn']},
  '3a':{n:'Option 3a · EN-DC, SCG bearer',cn:'epc',m:'lte',s:'nr',kind:'NSA',bearer:'SCG bearer (S-GW tách theo bearer)',
    d:'S-GW gửi thẳng từng E-RAB tới eNB hoặc gNB qua S1-U. Không tách trong một bearer nên không cần X2-U mạnh; một bearer chỉ đi một nhánh.',
    up:r=>[[['inet','gw','lte','ue'],1-r],[['inet','gw','nr','ue'],r]],cp:[['mme','lte','ue'],['lte','nr']],
    tb:['EPC','eNB (MN)','en-gNB (SN)','eNB','Không (tách theo E-RAB ở S-GW)','—','VoLTE trên LTE','Tốc độ một bearer không gộp được hai nhánh']},
  '3x':{n:'Option 3x · EN-DC, tách ở gNB',cn:'epc',m:'lte',s:'nr',kind:'NSA',bearer:'SCG split bearer (PDCP ở gNB)',
    d:'Phổ biến nhất khi triển khai NSA. S-GW gửi dữ liệu tới gNB (sau E-RAB Modification), PDCP của gNB chia một phần về eNB qua X2-U. eNB chỉ giữ RRC và báo hiệu với MME.',
    up:r=>[[['inet','gw','nr','ue'],r],[['inet','gw','nr','lte','ue'],1-r]],cp:[['mme','lte','ue'],['lte','nr']],
    tb:['EPC','eNB (MN)','en-gNB (SN)','eNB','Có (X2-U gNB → eNB)','PDCP gNB','VoLTE trên LTE','Cấu hình chuẩn của đa số nhà mạng']},
  '2':{n:'Option 2 · SA, NR + 5GC',cn:'5gc',m:'nr',s:null,kind:'SA',bearer:'Luồng QoS trên DRB của gNB',
    d:'gNB nối thẳng 5GC qua N2/N3. Có slicing, QoS theo luồng, VoNR hoặc EPS fallback, độ trễ thấp, tiết kiệm pin hơn vì không giữ hai kết nối.',
    up:r=>[[['inet','upf','nr','ue'],1]],cp:[['amf','nr','ue']],
    tb:['5GC','gNB','—','gNB','Không','SDAP/PDCP gNB','VoNR hoặc EPS fallback','Mục tiêu dài hạn']},
  '4':{n:'Option 4 · NE-DC, gNB chính',cn:'5gc',m:'nr',s:'lte',kind:'SA + LTE phụ',bearer:'MCG split bearer (PDCP ở gNB)',
    d:'gNB là MN, ng-eNB là SN, lõi 5GC. Dùng LTE để tăng dung lượng hoặc phủ cho UE 5G SA.',
    up:r=>[[['inet','upf','nr','ue'],r],[['inet','upf','nr','lte','ue'],1-r]],cp:[['amf','nr','ue'],['nr','lte']],
    tb:['5GC','gNB (MN)','ng-eNB (SN)','gNB','Có (Xn-U gNB → ng-eNB)','PDCP gNB','VoNR','Ít triển khai thương mại']},
  '4a':{n:'Option 4a · NE-DC, UPF tách theo luồng',cn:'5gc',m:'nr',s:'lte',kind:'SA + LTE phụ',bearer:'SCG bearer',
    d:'UPF gửi thẳng tới gNB hoặc ng-eNB theo PDU session hoặc luồng QoS.',
    up:r=>[[['inet','upf','nr','ue'],r],[['inet','upf','lte','ue'],1-r]],cp:[['amf','nr','ue'],['nr','lte']],
    tb:['5GC','gNB (MN)','ng-eNB (SN)','gNB','Không','—','VoNR','Ít triển khai']},
  '5':{n:'Option 5 · ng-eNB + 5GC',cn:'5gc',m:'lte',s:null,kind:'eLTE',bearer:'DRB của ng-eNB',
    d:'eNB nâng cấp thành ng-eNB nối 5GC qua N2/N3: UE LTE dùng được slicing và QoS của 5GC.',
    up:r=>[[['inet','upf','lte','ue'],1]],cp:[['amf','lte','ue']],
    tb:['5GC','ng-eNB','—','ng-eNB','Không','PDCP ng-eNB','VoLTE qua 5GC/IMS','Hiếm']},
  '7':{n:'Option 7 · NGEN-DC, ng-eNB chính',cn:'5gc',m:'lte',s:'nr',kind:'NSA trên 5GC',bearer:'MCG split bearer',
    d:'ng-eNB là MN, gNB là SN, lõi 5GC. Giống option 3 nhưng lõi là 5GC.',
    up:r=>[[['inet','upf','lte','ue'],1-r],[['inet','upf','lte','nr','ue'],r]],cp:[['amf','lte','ue'],['lte','nr']],
    tb:['5GC','ng-eNB (MN)','gNB (SN)','ng-eNB','Có (Xn-U)','PDCP ng-eNB','VoLTE/VoNR','Hiếm']},
  '7x':{n:'Option 7x · NGEN-DC, tách ở gNB',cn:'5gc',m:'lte',s:'nr',kind:'NSA trên 5GC',bearer:'SCG split bearer',
    d:'UPF gửi tới gNB, gNB chia một phần về ng-eNB qua Xn-U.',
    up:r=>[[['inet','upf','nr','ue'],r],[['inet','upf','nr','lte','ue'],1-r]],cp:[['amf','lte','ue'],['lte','nr']],
    tb:['5GC','ng-eNB (MN)','gNB (SN)','ng-eNB','Có (Xn-U gNB → ng-eNB)','PDCP gNB','VoLTE/VoNR','Hiếm']}
};
const NDNODE={
  mme:{d:'Quản lý di động và phiên ở EPC. Với EN-DC: kiểm tra thuê bao có được dùng NR (Access Restriction Data từ HSS, bit NR as Secondary RAT), nhận E-RAB Modification Indication khi đường dữ liệu chuyển sang gNB, ghi nhận Secondary RAT Data Usage Report để tính cước.',v:{huawei:'USN / UNC (MME)',nokia:'Cloud Mobility Manager (CMM)',ericsson:'Packet Core Controller (PCC)'}},
  gw:{d:'S-GW là điểm neo dữ liệu khi di động, P-GW cấp IP và nối Internet. Với option 3x: S-GW nhận Modify Bearer Request và chuyển đầu S1-U sang địa chỉ TEID của gNB.',v:{huawei:'UDG (SGW/PGW)',nokia:'Cloud Mobile Gateway (CMG)',ericsson:'Packet Core Gateway (PCG)'}},
  amf:{d:'Quản lý đăng ký, kết nối, di động của 5GC. Nối gNB/ng-eNB qua N2 (NGAP).',v:{huawei:'UNC (AMF)',nokia:'Cloud Mobility Manager (CMM)',ericsson:'Packet Core Controller (PCC)'}},
  smf:{d:'Quản lý phiên PDU, chọn UPF, điều khiển UPF qua N4 (PFCP).',v:{huawei:'UNC (SMF)',nokia:'Cloud Mobile Gateway (CMG)',ericsson:'Packet Core Controller (PCC)'}},
  upf:{d:'Chuyển tiếp dữ liệu người dùng, nối gNB qua N3 (GTP-U) và mạng ngoài qua N6.',v:{huawei:'UDG (UPF)',nokia:'Cloud Mobile Gateway (CMG)',ericsson:'Packet Core Gateway (PCG)'}},
  lte:{d:'Trạm 4G. Trong EN-DC là nút chính (MN): giữ RRC với UE, quyết định thêm SgNB khi nhận báo cáo B1, nối MME qua S1-MME. Trong option 7/5 là ng-eNB nối 5GC.',v:{huawei:'BBU5900 / BTS5900 (LTE)',nokia:'AirScale (LTE)',ericsson:'Baseband 6630/6648 (LTE)'}},
  nr:{d:'Trạm 5G. Trong EN-DC là en-gNB (nút phụ SN): không có S1-MME, chỉ có S1-U tới S-GW và X2 tới eNB. Trong SA là gNB nối AMF/UPF.',v:{huawei:'BBU5900 + AAU (NR)',nokia:'AirScale + Habrok/AEQx',ericsson:'Baseband 6648 + AIR 6449/3268'}},
  ue:{d:'Máy đầu cuối. Với EN-DC phải hỗ trợ tổ hợp băng tần EN-DC (ví dụ DC_3A_n78A) trong UE capability (UE-MRDC-Capability). Báo cáo đo B1 cho tần số NR do eNB cấu hình.',v:{}},
  inet:{d:'Mạng dữ liệu ngoài (Internet, IMS APN/DNN).',v:{}}
};
function ndOpt(){return NDOPT[NDP.arch.opt]||NDOPT['3x'];}
function ndNodeLabel(id){const o=ndOpt();if(id==='lte')return o.cn==='5gc'?'ng-eNB':'eNB';if(id==='nr')return o.cn==='epc'?'en-gNB':'gNB';return NDN[id].l;}
function ndRole(id){const o=ndOpt();if(id!=='lte'&&id!=='nr')return '';if(o.m===id)return 'MN';if(o.s===id)return 'SN';return '';}
function ndUsedNodes(){const o=ndOpt(),r=NDP.arch.r/100,s=new Set(['ue','inet']);
  o.up(r).forEach(p=>{if(p[1]>0)p[0].forEach(n=>s.add(n));});o.cp.forEach(p=>p.forEach(n=>s.add(n)));
  if(o.cn==='epc'){s.add('mme');s.add('gw');}else{s.add('amf');s.add('smf');s.add('upf');}return s;}
function ndKey(a,b){const k1=a+'-'+b,k2=b+'-'+a;return NDE[k1]?k1:NDE[k2]?k2:null;}
function ndEdges(){const o=ndOpt(),r=NDP.arch.r/100,up=new Set(),cp=new Set();
  o.up(r).forEach(p=>{if(p[1]<=0)return;for(let i=0;i<p[0].length-1;i++){const k=ndKey(p[0][i],p[0][i+1]);if(k)up.add(k);}});
  o.cp.forEach(p=>{for(let i=0;i<p.length-1;i++){const k=ndKey(p[i],p[i+1]);if(k)cp.add(k);}});
  if(o.cn==='epc')cp.add('mme-gw');else{cp.add('amf-smf');cp.add('smf-upf');}
  return {up,cp};}
function ndArchSvg(){
  const o=ndOpt(),used=ndUsedNodes(),E=ndEdges(),ci=o.cn==='epc'?0:1;let s='';
  s+=`<rect x="20" y="88" width="276" height="62" rx="10" class="u3zone"${o.cn==='epc'?'':' style="opacity:.45"'}/><text x="30" y="84" class="u3zt">Lõi EPC (4G)</text>`;
  s+=`<rect x="470" y="88" width="276" height="62" rx="10" class="u3zone"${o.cn==='5gc'?'':' style="opacity:.45"'}/><text x="736" y="84" class="u3zt" text-anchor="end">Lõi 5GC</text>`;
  s+=`<rect x="128" y="222" width="526" height="82" rx="10" class="u3zone"/><text x="644" y="298" class="u3zt" text-anchor="end">RAN: ${o.s?'kết nối kép (MR-DC)':'một trạm'}</text>`;
  for(const k in NDE){const [a,b]=k.split('-'),A=NDN[a],B=NDN[b];if(!A||!B)continue;if(k==='mme-nr')continue;
    const onU=E.up.has(k),onC=E.cp.has(k);if(!onU&&!onC&&!(used.has(a)&&used.has(b)&&(k==='lte-ue'||k==='nr-ue')))continue;
    const cls=onU?'ndlnU':onC?'ndlnC':'ndlnX';
    const mx=(A.x+B.x)/2,my=(A.y+B.y)/2;
    s+=`<g class="ndlk"><line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" class="${cls}"/><text x="${mx}" y="${my-5}" class="ndel" text-anchor="middle">${nE(NDE[k][ci])}</text></g>`;}
  for(const id in NDN){const n=NDN[id],on=used.has(id),sel=NDA.sel===id,role=ndRole(id);
    if(!on&&(n.k==='epc'||n.k==='5gc'))continue;
    s+=`<g class="u3nd ndnd ndk-${n.k}${sel?' sel':''}${on?'':' off'}" data-nda="arch:nd-${id}" tabindex="0" role="button" aria-label="${nE(ndNodeLabel(id))}"><rect x="${n.x-n.w/2}" y="${n.y-n.h/2}" width="${n.w}" height="${n.h}" rx="9"/><text x="${n.x}" y="${n.y+(role?-1:4)}" class="u3nt" text-anchor="middle">${nE(ndNodeLabel(id))}</text>${role?`<text x="${n.x}" y="${n.y+13}" class="ndrole" text-anchor="middle">${role==='MN'?'nút chính (MN)':'nút phụ (SN)'}</text>`:''}</g>`;}
  s+=`<g id="ndArchDots"></g>`;
  return `<svg viewBox="0 0 780 412" class="u3svg ndarch" role="img" aria-label="Sơ đồ kiến trúc ${nE(o.n)}">${s}</svg>`;
}
function ndArchOut(){const o=ndOpt(),P=NDP.arch,r=P.r/100;const paths=o.up(r);
  let leg={L:0,N:0};paths.forEach(p=>{const last=p[0][p[0].length-2];leg[last==='nr'?'N':'L']+=p[1];});
  let tp;if(leg.N>0&&leg.L>0)tp=Math.min(P.capL/leg.L,P.capN/leg.N);else tp=leg.N>0?P.capN:P.capL;
  const viaX=paths.some(p=>p[1]>0&&p[0].includes('lte')&&p[0].includes('nr'));
  const xs=paths.filter(p=>p[0].includes('lte')&&p[0].includes('nr')).reduce((a,p)=>a+p[1],0);
  const kv=(a,b)=>`<dt>${a}</dt><dd>${b}</dd>`;
  return kv('Loại triển khai',o.kind)+kv('Lõi mạng',o.cn==='epc'?'EPC (MME, S-GW, P-GW)':'5GC (AMF, SMF, UPF)')+kv('Nút chính (giữ RRC với lõi)',ndNodeLabel(o.m))+kv('Nút phụ',o.s?ndNodeLabel(o.s):'—')+kv('Kiểu bearer',o.bearer)
   +'<div class="sep"></div>'+kv('Phần dữ liệu đi qua NR',nF(leg.N*100)+' %')+kv('Phần dữ liệu đi qua LTE',nF(leg.L*100)+' %')
   +kv('Tốc độ gộp ước tính',`<span data-ndcount="${tp}">${nF(tp)}</span> Mbit/s`)+kv('Đi qua X2/Xn-U',viaX?nF(xs*100)+' % · cộng '+nF(P.lat)+' ms':'không')
   +kv('Nút cổ chai',leg.N>0&&leg.L>0?(P.capL/leg.L<P.capN/leg.N?'nhánh LTE (giảm phần qua LTE)':'nhánh NR'):'—');}
function ndArchInfo(){const id=NDA.sel;if(!id){const o=ndOpt();return `<p class="e2x"><b>${nE(o.n)}</b></p><p class="e2d">${nE(o.d)}</p><p class="note">Chạm một nút trên sơ đồ để xem vai trò và sản phẩm theo vendor.</p>`;}
  const n=NDNODE[id]||{d:'',v:{}},v=nVn();
  return `<p class="e2x"><b>${nE(ndNodeLabel(id))}</b>${ndRole(id)?` · ${ndRole(id)==='MN'?'nút chính':'nút phụ'}`:''}</p><p class="e2d">${nE(n.d)}</p>${Object.keys(n.v).length?`<p class="e2x">Sản phẩm: ${v==='3gpp'?Object.entries(n.v).map(([k,x])=>nVName(k)+': '+nE(x)).join(' · '):nE(n.v[v]||'—')}</p>`:''}`;}
NDR.arch={
 html(){const P=NDP.arch;
  return `<div class="cols"><div>
   <div class="panel"><h3>Sơ đồ ${nE(ndOpt().n)}</h3><div class="scroll"><div id="ndArchSvg">${ndArchSvg()}</div></div>
    <p class="legend"><span><i style="background:var(--up)"></i>Dữ liệu người dùng</span><span><i style="background:var(--cp)"></i>Báo hiệu</span><span><i style="background:var(--nr)"></i>Gói đi nhánh NR</span><span><i style="background:var(--lte)"></i>Gói đi nhánh LTE</span></p></div>
  </div><div>
   <div class="panel"><h3>Chọn option và tham số</h3><div class="ctl">
    ${nSel('arch','opt','Option triển khai',NDOO.map(k=>[k,NDOPT[k].n]))}
    ${nSl('arch','r','Phần dữ liệu qua NR (chia lưu lượng)',0,100,5,v=>v+' %','Với split bearer: tỉ lệ do bộ điều khiển luồng X2-U quyết định; với option 3a/4a/7a: tỉ lệ bearer đặt ở nhánh phụ.','splitRatio')}
    ${nSl('arch','capL','Dung lượng nhánh LTE',20,400,10,v=>v+' Mbit/s')}
    ${nSl('arch','capN','Dung lượng nhánh NR',100,2000,50,v=>v+' Mbit/s')}
    ${nSl('arch','lat','Trễ truyền dẫn X2/Xn',1,30,1,v=>v+' ms','Trễ một chiều giữa hai trạm; trên 10 ms gây sắp xếp lại gói và giảm tốc độ TCP.','x2Lat')}
   </div></div>
   <div class="panel"><h3>Kết quả</h3><dl class="kv" id="ndArchOut">${ndArchOut()}</dl></div>
   <div class="panel" id="ndArchInfo" aria-live="polite">${ndArchInfo()}</div>
  </div></div>
  <div class="panel"><h3>So sánh các option</h3><div class="scroll"><table class="ndtb"><thead><tr><th>Option</th><th>Lõi</th><th>Nút chính</th><th>Nút phụ</th><th>Giữ RRC</th><th>Tách trong bearer</th><th>Điểm tách</th><th>Thoại</th><th>Ghi chú</th></tr></thead><tbody>${NDOO.map(k=>[k,NDOPT[k]]).map(([k,o])=>`<tr class="${k===P.opt?'ndhl':''}"><td><button type="button" class="u3lnkbtn" data-nda="arch:opt-${k}">${nE(k)}</button></td>${o.tb.map(c=>`<td>${nE(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>
  <div class="cols"><div class="panel"><h3>NSA và SA khác nhau ở đâu</h3><div class="scroll"><table class="ndtb"><thead><tr><th>Khía cạnh</th><th>NSA (option 3x)</th><th>SA (option 2)</th></tr></thead><tbody>${NDNSASA.map(r=>`<tr><td>${nE(r[0])}</td><td>${nE(r[1])}</td><td>${nE(r[2])}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="panel"><h3>Bốn kiểu bearer trong MR-DC</h3><div class="u3stk">${NDBEAR.map(b=>`<div style="border-left-color:${b[2]}"><b>${nE(b[0])}</b> · ${nE(b[1])}</div>`).join('')}</div>
   <h3 style="margin-top:14px">Khi nào máy hiện biểu tượng 5G</h3><p class="e2d">Ở NSA, máy có thể hiện “5G” cả khi chưa có SCG: eNB phát <span class="u3tag">upperLayerIndication-r15</span> trong SIB2 báo cell neo có NR phía trên. GSMA mô tả 4 cách hiển thị (Config A–D): A chỉ khi đang có SCG; B khi kết nối và cell neo có NR; C khi đang rỗi ở cell neo; D (hay dùng) khi cell neo có ULI dù rỗi hay kết nối. Vì vậy “thấy 5G” chưa chắc đang dùng NR.</p></div></div>`;},
 after(){NDA.dots=[];},
 upd(k){if(k==='opt'){NDA.sel='';NDA.dots=[];renderNd();return;}
  const o=$('#ndArchOut');if(o)o.innerHTML=ndArchOut();if(k==='r'){NDA.dots=[];const g=$('#ndArchSvg');if(g)g.innerHTML=ndArchSvg();}},
 act(a){if(a.startsWith('nd-')){const id=a.slice(3);NDA.sel=NDA.sel===id?'':id;const g=$('#ndArchSvg');if(g)g.innerHTML=ndArchSvg();const i=$('#ndArchInfo');if(i)i.innerHTML=ndArchInfo();}
  else if(a.startsWith('opt-')){NDP.arch.opt=a.slice(4);NDA.sel='';renderNd();}},
 tick(dt){const g=$('#ndArchDots');if(!g)return;const o=ndOpt(),r=NDP.arch.r/100,paths=o.up(r).filter(p=>p[1]>0);
  NDA.acc+=dt*7;while(NDA.acc>1){NDA.acc-=1;let x=Math.random(),p=paths[0];for(const q of paths){if(x<q[1]){p=q;break;}x-=q[1];}
    if(p){const last=p[0][p[0].length-2];NDA.dots.push({pts:p[0].map(n=>[NDN[n].x,NDN[n].y]),s:0,c:last==='nr'?'var(--nr)':'var(--lte)',cp:0});}}
  NDA.cpAcc+=dt*.6;while(NDA.cpAcc>1){NDA.cpAcc-=1;o.cp.forEach(p=>NDA.dots.push({pts:p.slice().reverse().map(n=>[NDN[n].x,NDN[n].y]).reverse(),s:0,c:'var(--cp)',cp:1}));}
  let h='';const keep=[];
  for(const d of NDA.dots){d.s+=dt*(d.cp?150:230);let L=0,seg=[];for(let i=0;i<d.pts.length-1;i++){const a=d.pts[i],b=d.pts[i+1],l=Math.hypot(b[0]-a[0],b[1]-a[1]);seg.push([a,b,l]);L+=l;}
    if(d.s>=L)continue;keep.push(d);let s=d.s;for(const [a,b,l] of seg){if(s<=l){const t=s/l;h+=`<circle cx="${a[0]+(b[0]-a[0])*t}" cy="${a[1]+(b[1]-a[1])*t}" r="${d.cp?4:4.5}" class="u3dot" style="fill:${d.c}"/>`;break;}s-=l;}}
  NDA.dots=keep.slice(-80);g.innerHTML=h;}
};
const NDNSASA=[
 ['Lõi mạng','EPC hiện có (cần bật hỗ trợ DCNR, HSS cấp quyền NR)','5GC mới (AMF, SMF, UPF, UDM, PCF…)'],
 ['Báo hiệu điều khiển','Qua LTE (RRC của eNB); NR chỉ có SRB3 tuỳ chọn','RRC NR trực tiếp với gNB'],
 ['Thời gian lên 5G','Phải kết nối LTE, đo B1 rồi thêm SgNB (thêm khoảng 100–300 ms)','Có NR ngay khi kết nối'],
 ['Độ trễ người dùng','Như LTE + đường X2 khi split','Thấp hơn, hỗ trợ URLLC, mini-slot'],
 ['Thoại','VoLTE trên LTE (NR không mang thoại)','VoNR hoặc EPS fallback về VoLTE'],
 ['Slicing, QoS luồng','Không (chỉ QCI/E-RAB)','Có S-NSSAI, 5QI theo luồng, URSP'],
 ['Pin máy','Tốn hơn: giữ hai kết nối, đo NR thường xuyên','Tốt hơn, có RRC Inactive'],
 ['Phủ sóng đường lên','Có thể để đường lên đi LTE (UL data split) khi NR yếu','Cần SUL, CA đường lên hoặc tần thấp'],
 ['Di động','HO do eNB (MN) điều khiển; SgNB change/release theo NR','HO NR trực tiếp, có CHO, DAPS, LTM'],
 ['KPI chính','SgNB Addition SR, SCG abnormal release, tỉ lệ thời gian EN-DC','Registration SR, PDU session SR, HOSR NR, VoNR']
];
const NDBEAR=[
 ['MCG bearer','dữ liệu chỉ đi qua nút chính (thường là LTE).','var(--lte)'],
 ['SCG bearer','dữ liệu chỉ đi qua nút phụ, lõi gửi thẳng tới nút phụ (option 3a).','var(--nr)'],
 ['MCG split bearer','PDCP ở nút chính chia gói sang hai nhánh (option 3).','var(--k4)'],
 ['SCG split bearer','PDCP ở nút phụ chia gói về hai nhánh (option 3x). Từ Rel-15 gộp gọi chung là split bearer có PDCP đặt ở MN hoặc SN.','var(--up)']
];
/* ---------- Mục 2: Thêm, đổi, xoá SgNB (EN-DC option 3x) ---------- */
NDP.sgnb={v:30,b1:-110,a2:-118,hys:2,ttt:320,pscell:true,a3:3,mode:'split',capL:120,capN:900,prohib:2,seed:7,play:6};
const NDSA={t:0,R:null,acc:0,lastDraw:-1};
const NDG={enb:{x:1250,y:330,f:1.8,p:48,l:'eNB (neo LTE)'},g1:{x:700,y:110,f:3.5,p:25,l:'gNB 1'},g2:{x:1800,y:110,f:3.5,p:25,l:'gNB 2'}};
const NDROAD=2400;
/* bóng che tương quan theo quãng đường (AR1, khoảng tương quan ~40 m) */
function ndShadow(seed,n,step,sig){const r=nRng(seed);const a=Math.exp(-step/40),b=Math.sqrt(1-a*a);let v=nGs(r)*sig;const o=[];for(let i=0;i<n;i++){v=a*v+b*nGs(r)*sig;o.push(v);}return o;}
const ndPLn=(d,f)=>13.54+39.08*Math.log10(Math.max(d,20))+20*Math.log10(f);  /* UMa NLOS rút gọn */
const ndEff=sinr=>nC(0.75*Math.log2(1+nLin(sinr)),0,5.5);
function ndMsgs(kind,t0,o){const M=[],a=(dt,p,m,ar,d)=>M.push({t:t0+dt/1000,p,m,a:ar,d});const g=o&&o.g||'gNB',g2=o&&o.g2||'gNB đích';
  if(kind==='add'){a(0,'RRC','MeasurementReport (B1-NR)','UE → eNB','RSRP NR '+nF(o.v,1)+' dBm vượt ngưỡng B1');a(5,'X2AP','SgNB Addition Request','eNB → '+g,'E-RAB, UE capability MR-DC, cấu hình đề xuất');a(32,'X2AP','SgNB Addition Request Acknowledge','eNB ← '+g,'Cấu hình SCG (NR RRCReconfiguration) bọc trong container');a(36,'RRC','RRCConnectionReconfiguration','eNB → UE','chứa nr-Config-r15, nr-RadioBearerConfig');a(52,'RRC','RRCConnectionReconfigurationComplete','UE → eNB','');a(56,'X2AP','SgNB Reconfiguration Complete','eNB → '+g,'');a(60,'MAC','Truy nhập ngẫu nhiên NR (Msg1–Msg4)','UE → '+g,'đồng bộ đường lên tới PSCell');
    if(o.ok){a(82,'X2AP','SN Status Transfer + chuyển tiếp dữ liệu','eNB → '+g,'');a(88,'S1AP','E-RAB Modification Indication','eNB → MME','đổi đầu S1-U sang TEID của gNB');a(98,'GTPv2','Modify Bearer Request / Response','MME ↔ S-GW','');a(108,'S1AP','E-RAB Modification Confirm','MME → eNB','EN-DC thành công');}
    else{a(160,'RRC','SCGFailureInformationNR','UE → eNB','cause: randomAccessProblem (đường lên NR không đủ)');a(166,'X2AP','SgNB Release Request','eNB → '+g,'');a(190,'X2AP','SgNB Release Request Acknowledge','eNB ← '+g,'');a(196,'RRC','RRCConnectionReconfiguration (giải phóng SCG)','eNB → UE','đếm SgNB addition thất bại');}}
  else if(kind==='rel'){a(0,'RRC','MeasurementReport (A2 trên PSCell)','UE → '+g,'RSRP NR '+nF(o.v,1)+' dBm dưới ngưỡng A2');a(6,'X2AP','SgNB Release Required','eNB ← '+g,'SN chủ động xin giải phóng');a(12,'X2AP','SgNB Release Confirm','eNB → '+g,'');a(16,'RRC','RRCConnectionReconfiguration (giải phóng SCG)','eNB → UE','');a(30,'RRC','RRCConnectionReconfigurationComplete','UE → eNB','');a(36,'S1AP','E-RAB Modification Indication','eNB → MME','đường dữ liệu về lại eNB');a(40,'X2AP','Secondary RAT Data Usage Report','eNB ← '+g,'lưu lượng NR để tính cước');a(48,'X2AP','UE Context Release','eNB → '+g,'giải phóng bình thường');}
  else if(kind==='chg'){a(0,'RRC','MeasurementReport (A3 NR)','UE → '+g,'PSCell lân cận mạnh hơn '+nF(o.v,1)+' dB');a(6,'X2AP','SgNB Change Required','eNB ← '+g,'');a(10,'X2AP','SgNB Addition Request','eNB → '+g2,'');a(36,'X2AP','SgNB Addition Request Acknowledge','eNB ← '+g2,'');a(40,'X2AP','SgNB Change Confirm','eNB → '+g,'');a(44,'RRC','RRCConnectionReconfiguration','eNB → UE','SCG mới');a(60,'RRC','RRCConnectionReconfigurationComplete','UE → eNB','');a(64,'X2AP','SgNB Reconfiguration Complete','eNB → '+g2,'');a(68,'MAC','Truy nhập ngẫu nhiên NR','UE → '+g2,'');a(88,'X2AP','SN Status Transfer','… → '+g2,'');a(94,'S1AP','E-RAB Modification Indication','eNB → MME','');a(104,'X2AP','UE Context Release','eNB → '+g,'');}
  else if(kind==='rlf'){a(0,'PHY','Mất đồng bộ NR: N310 lần out-of-sync, chạy T310','UE','');a(o.t310,'RRC','SCGFailureInformationNR','UE → eNB','cause: t310-Expiry, kèm kết quả đo');a(o.t310+6,'X2AP','SgNB Release Request','eNB → '+g,'');a(o.t310+30,'X2AP','SgNB Release Request Acknowledge','eNB ← '+g,'');a(o.t310+34,'RRC','RRCConnectionReconfiguration (giải phóng SCG)','eNB → UE','đếm giải phóng SgNB bất thường');a(o.t310+48,'S1AP','E-RAB Modification Indication','eNB → MME','');}
  return M;}
function ndSgSim(){
  const P=NDP.sgnb,dt=0.1,vms=P.v/3.6,T=Math.max(30,NDROAD/vms),n=Math.ceil(T/dt),step=vms*dt;
  const sh={enb:ndShadow(P.seed*7+1,n,step,4),g1:ndShadow(P.seed*7+2,n,step,6),g2:ndShadow(P.seed*7+3,n,step,6)},rf=nRng(P.seed*13+5);
  const S2=[],ev=[],msgs=[];let st='lte',pc='',tB1=0,tA2=0,tA3=0,busy=0,pend=null,prohib=0,f={enb:null,g1:null,g2:null},oos=0,t310=-1,lastAdd=-99,lastRel=-99;
  const ST={addAtt:0,addOk:0,addFail:0,rel:0,abn:0,chg:0,pp:0,tScg:0,sumT:0,sumN:0};const tttS=P.ttt/1000,a=0.4;
  for(let i=0;i<n;i++){const t=i*dt,x=Math.min(NDROAD,t*vms);
    const r={};for(const k in NDG){const G=NDG[k],d=Math.hypot(x-G.x,G.y),pl=ndPLn(d,G.f);r[k]=G.p-pl+(k==='enb'?15:24)-30+sh[k][i];f[k]=f[k]==null?r[k]:f[k]+a*(r[k]-f[k]);}
    const best=f.g1>=f.g2?'g1':'g2',oth=best==='g1'?'g2':'g1';
    if(busy>0){busy-=dt;if(busy<=0&&pend){const p=pend;pend=null;
        if(p.k==='add'){if(p.ok){st='scg';pc=p.g;ST.addOk++;lastAdd=t;ev.push([t,'+SgNB','var(--nr)']);}else{st='lte';pc='';ST.addFail++;prohib=P.prohib;ev.push([t,'✕ thêm','var(--warn)']);}}
        else if(p.k==='rel'){st='lte';pc='';lastRel=t;prohib=P.prohib;}
        else if(p.k==='chg'){pc=p.g;st='scg';}
        else if(p.k==='rlf'){st='lte';pc='';lastRel=t;prohib=P.prohib;}}}
    else if(st==='lte'){prohib-=dt;
      if(prohib<=0&&f[best]>P.b1+P.hys){tB1+=dt;if(tB1>=tttS){tB1=0;ST.addAtt++;
          /* đường lên NR: UE 23 dBm, giới hạn suy hao truy nhập ngẫu nhiên khoảng 141 dB */
          const d=Math.hypot(x-NDG[best].x,NDG[best].y),ok=ndPLn(d,3.5)-sh[best][i]<141+nGs(rf)*1.5;
          msgs.push(...ndMsgs('add',t,{g:NDG[best].l,v:f[best],ok}));busy=ok?0.11:0.2;pend={k:'add',ok,g:best};st='adding';
          if(t-lastRel<5&&lastRel>0){ST.pp++;}}}else tB1=0;}
    else if(st==='scg'){const cur=f[pc],nb=pc==='g1'?'g2':'g1';
      /* phát hiện lỗi vô tuyến NR: mẫu tức thời có fading */
      const inst=r[pc]+nGs(rf)*3;if(inst<-121){oos++;}else{oos=Math.max(0,oos-2);}
      if(t310<0&&oos>=10)t310=0;if(t310>=0){t310+=dt;if(inst>-117)t310=-1;}
      if(t310>=1){t310=-1;oos=0;ST.abn++;msgs.push(...ndMsgs('rlf',t-1,{g:NDG[pc].l,t310:1000}));busy=0.05;pend={k:'rlf'};st='rel';ev.push([t,'SCG RLF','var(--warn)']);}
      else if(cur<P.a2-P.hys){tA2+=dt;if(tA2>=tttS){tA2=0;tA3=0;ST.rel++;msgs.push(...ndMsgs('rel',t,{g:NDG[pc].l,v:cur}));busy=0.05;pend={k:'rel'};st='rel';ev.push([t,'−SgNB','var(--lte)']);if(t-lastAdd<5)ST.pp++;}}
      else{tA2=0;
        if(P.pscell&&f[nb]>cur+P.a3+P.hys){tA3+=dt;if(tA3>=tttS){tA3=0;ST.chg++;msgs.push(...ndMsgs('chg',t,{g:NDG[pc].l,g2:NDG[nb].l,v:f[nb]-cur}));busy=0.1;pend={k:'chg',g:nb};st='changing';ev.push([t,'đổi PSCell','var(--up)']);}}else tA3=0;}}
    /* tốc độ */
    const thrL=P.capL*ndEff(f.enb+128-3)/5.5;let thrN=0;
    if(st==='scg'||st==='changing'){thrN=st==='changing'?0:P.capN*ndEff(f[pc]+120-3)/5.5;ST.tScg+=dt;}
    let tot=thrL,nPart=0;if(thrN>0){if(P.mode==='split'){tot=thrL+thrN*0.97;nPart=thrN*0.97;}else{tot=thrN;nPart=thrN;}}
    ST.sumT+=tot*dt;ST.sumN+=nPart*dt;
    S2.push({t,x,l:f.enb,n1:f.g1,n2:f.g2,st,pc,tot,nPart});}
  return {T,S:S2,ev,msgs,ST};
}
function ndSgPlots(){const R=NDSA.R,cur=NDSA.t;const pts=k=>R.S.filter((s,i)=>i%3===0).map(s=>[s.t,s[k]]);
  const bands=[];let b0=null;R.S.forEach(s=>{const on=s.st==='scg';if(on&&b0==null)b0=s.t;if(!on&&b0!=null){bands.push([b0,s.t,'var(--nr)',.13]);b0=null;}});if(b0!=null)bands.push([b0,R.T,'var(--nr)',.13]);
  const xt=[];for(let v=0;v<=R.T;v+=R.T>150?30:R.T>60?15:10)xt.push(v);
  const p1=nPlot({w:680,h:230,x0:0,x1:R.T,y0:-130,y1:-60,yt:[-130,-120,-110,-100,-90,-80,-70,-60],xt,series:[{pts:pts('l'),c:'var(--lte)'},{pts:pts('n1'),c:'var(--nr)'},{pts:pts('n2'),c:'var(--up)'}],
    hl:[[NDP.sgnb.b1,'var(--nr)','B1'],[NDP.sgnb.a2,'var(--warn)','A2']],marks:R.ev.slice(0,24).map((e,i)=>[e[0],e[1],e[2],i%3]),bands,cur,ylab:'RSRP (dBm)',xlab:'thời gian (s)',aria:'RSRP LTE và NR theo thời gian'});
  const mx=Math.max(100,...R.S.map(s=>s.tot))*1.05;
  const p2=nPlot({w:680,h:170,x0:0,x1:R.T,y0:0,y1:mx,yt:[0,mx/4,mx/2,3*mx/4].map(Math.round),xt,series:[{pts:pts('tot'),c:'var(--ink)'},{pts:pts('nPart'),c:'var(--nr)',dash:'4 3'}],bands,cur,ylab:'Mbit/s',xlab:'thời gian (s)',aria:'Tốc độ'});
  return [p1,p2];}
function ndSgMap(){const R=NDSA.R,i=Math.min(R.S.length-1,Math.floor(NDSA.t/0.1)),s=R.S[i],W=720,H=200,X=x=>20+x/NDROAD*(W-40),Y=y=>170-y/360*150;
  let h=`<line x1="${X(0)}" y1="${Y(0)}" x2="${X(NDROAD)}" y2="${Y(0)}" class="ndroad"/>`;
  for(const k in NDG){const G=NDG[k];h+=`<circle cx="${X(G.x)}" cy="${Y(G.y)}" r="${k==='enb'?44:34}" class="ndcov ${k==='enb'?'l':'n'}"/><rect x="${X(G.x)-6}" y="${Y(G.y)-6}" width="12" height="12" class="ndbs ${k==='enb'?'l':'n'}"/><text x="${X(G.x)}" y="${Y(G.y)-12}" class="u3x" text-anchor="middle">${nE(G.l)}</text>`;}
  const ux=X(s.x),uy=Y(0);h+=`<line x1="${ux}" y1="${uy}" x2="${X(NDG.enb.x)}" y2="${Y(NDG.enb.y)}" class="ndlnk l"/>`;
  if(s.pc&&(s.st==='scg'||s.st==='changing'))h+=`<line x1="${ux}" y1="${uy}" x2="${X(NDG[s.pc].x)}" y2="${Y(NDG[s.pc].y)}" class="ndlnk n"/>`;
  h+=`<circle cx="${ux}" cy="${uy}" r="8" class="ndue"/><text x="${ux}" y="${uy+22}" class="u3x" text-anchor="middle">UE ${s.st==='scg'?'· 5G':''}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="Bản đồ UE đi qua hai gNB dưới một eNB neo">${h}</svg>`;}
function ndSgOut(){const R=NDSA.R,T=R.ST;const kv=(a,b)=>`<dt>${a}</dt><dd>${b}</dd>`;
  return kv('Thời gian có EN-DC',nF(T.tScg/R.T*100,1)+' %')+kv('Thêm SgNB: thử / thành công',T.addAtt+' / '+T.addOk)+kv('SgNB Addition SR',T.addAtt?nF(T.addOk/T.addAtt*100,1)+' %':'—')
   +kv('Giải phóng bình thường (A2)',T.rel)+kv('Giải phóng bất thường (SCG RLF)',T.abn)+kv('Đổi PSCell',T.chg)+kv('Ping-pong thêm ↔ xoá (< 5 s)',T.pp)
   +'<div class="sep"></div>'+kv('Tốc độ trung bình',`<span data-ndcount="${T.sumT/R.T}">${nF(T.sumT/R.T)}</span> Mbit/s`)+kv('Phần qua NR',nF(T.sumT?T.sumN/T.sumT*100:0)+' %');}
function ndSgAdvice(){const P=NDP.sgnb,T=NDSA.R.ST,o=[];
  if(T.addFail>0)o.push('Có lần thêm SgNB thất bại vì đường lên NR không đủ: B1 đang thấp ('+P.b1+' dBm). Tăng B1 lên khoảng −108 đến −105 dBm hoặc bật UL data split về LTE.');
  if(T.pp>1)o.push('Có ping-pong thêm/xoá: khoảng cách B1 − A2 = '+(P.b1-P.a2)+' dB còn hẹp. Giữ chênh lệch ≥ 6 dB, tăng TTT hoặc tăng thời gian cấm thêm lại.');
  if(T.abn>0)o.push('Có SCG RLF trước khi A2 kịp giải phóng: A2 quá thấp ('+P.a2+' dBm) hoặc TTT dài. Nâng A2 lên −115…−112 dBm.');
  if(!P.pscell&&T.rel>1)o.push('Đang tắt đổi PSCell: mỗi lần sang gNB khác phải xoá rồi thêm lại, mất 5G vài giây. Bật PSCell change (A3).');
  if(P.mode!=='split')o.push('Đang để chỉ NR mang dữ liệu: khi có SCG tốc độ không cộng thêm nhánh LTE.');
  if(!o.length)o.push('Cấu hình cân bằng: ít ping-pong, không có SCG RLF trong lần chạy này.');
  return `<ul class="u3ul">${o.map(x=>`<li>${nE(x)}</li>`).join('')}</ul>`;}
NDR.sgnb={
 html(){NDSA.R=ndSgSim();if(NDSA.t>NDSA.R.T)NDSA.t=0;const [p1,p2]=ndSgPlots();
  return `<div class="panel"><h3>UE đi qua hai gNB dưới một eNB neo</h3><div class="scroll"><div class="ndmap" id="ndSgMap">${ndSgMap()}</div></div>
   <div class="row"><button type="button" class="btn sm" data-nda="sgnb:play" id="ndSgPlay">${ND.pause?'▶ Chạy':'⏸ Dừng'}</button><button type="button" class="btn sm" data-nda="sgnb:rst">⟲ Về đầu</button><button type="button" class="btn sm" data-nda="sgnb:seed">Đổi bóng che (lần chạy khác)</button><span class="note" id="ndSgT"></span></div></div>
  <div class="cols"><div>
   <div class="panel"><h3>RSRP đo được và sự kiện</h3><div class="scroll"><div class="ndw" id="ndSgP1">${p1}</div></div><p class="legend"><span><i style="background:var(--lte)"></i>LTE neo</span><span><i style="background:var(--nr)"></i>gNB 1</span><span><i style="background:var(--up)"></i>gNB 2</span><span><i style="background:var(--nr);opacity:.3"></i>đang có SCG</span></p></div>
   <div class="panel"><h3>Tốc độ người dùng</h3><div class="scroll"><div class="ndw" id="ndSgP2">${p2}</div></div><p class="legend"><span><i style="background:var(--ink)"></i>Tổng</span><span><i style="background:var(--nr)"></i>Phần qua NR</span></p></div>
   <div class="panel"><h3>Nhật ký bản tin X2AP / RRC / S1AP</h3><div id="ndSgLog"></div></div>
  </div><div>
   <div class="panel"><h3>Tham số</h3><div class="ctl">
    ${nSl('sgnb','b1','Ngưỡng B1 (thêm SgNB)',-125,-90,1,v=>v+' dBm','RSRP NR phải vượt ngưỡng + trễ trong TTT.','b1Thr')}
    ${nSl('sgnb','a2','Ngưỡng A2 (xoá SgNB)',-130,-100,1,v=>v+' dBm','Đo trên PSCell; nên thấp hơn B1 ít nhất 6 dB.','a2Scg')}
    ${nSl('sgnb','hys','Độ trễ (hysteresis)',0,6,0.5,v=>nF(v,1)+' dB','','hysNr')}
    ${nSel('sgnb','ttt','Time to trigger',[[40,'40 ms'],[80,'80 ms'],[160,'160 ms'],[320,'320 ms'],[640,'640 ms'],[1280,'1280 ms']],'','tttB1')}
    ${nSl('sgnb','a3','Offset A3 đổi PSCell',0,8,0.5,v=>nF(v,1)+' dB','','a3PsCell')}
    ${nSl('sgnb','prohib','Thời gian cấm thêm lại sau khi xoá',0,10,0.5,v=>nF(v,1)+' s','Giảm ping-pong thêm/xoá.','addProhib')}
    ${nSel('sgnb','mode','Chia dữ liệu khi có SCG',[['split','Split bearer: cộng LTE + NR'],['scg','Chỉ NR mang dữ liệu']],'','splitMode')}
    ${nSl('sgnb','v','Tốc độ UE',3,120,1,v=>v+' km/h')}
    ${nSl('sgnb','play','Tua nhanh',1,20,1,v=>'× '+v)}
    <div class="c">${nChk('sgnb','pscell','Cho phép đổi PSCell (A3) thay vì xoá rồi thêm')}</div>
   </div></div>
   <div class="panel"><h3>Kết quả lần chạy</h3><dl class="kv" id="ndSgOut">${ndSgOut()}</dl></div>
   <div class="panel"><h3>Gợi ý tối ưu</h3><div id="ndSgAdv">${ndSgAdvice()}</div></div>
   <div class="panel"><h3>Ba thủ tục chính</h3><div class="u3stk">
    <div style="border-left-color:var(--nr)"><b>Thêm SgNB</b> · eNB cấu hình đo B1 khi UE kết nối và có khả năng EN-DC → B1 → SgNB Addition → UE truy nhập ngẫu nhiên vào PSCell → E-RAB Modification chuyển S1-U sang gNB (3x).</div>
    <div style="border-left-color:var(--up)"><b>Đổi PSCell</b> · trong cùng gNB: SgNB Modification; khác gNB: SgNB Change (SN hoặc MN khởi tạo). Không đổi eNB.</div>
    <div style="border-left-color:var(--lte)"><b>Xoá SgNB</b> · A2 trên PSCell, eNB đổi cell (HO LTE thường kéo theo xoá rồi thêm lại), hoặc lỗi SCG. Gửi Secondary RAT Data Usage Report trước khi xoá.</div></div></div>
  </div></div>`;},
 after(){this.draw(true);},
 draw(force){const R=NDSA.R;if(!R)return;const k=Math.floor(NDSA.t*4);if(!force&&k===NDSA.lastDraw)return;NDSA.lastDraw=k;
  const m=$('#ndSgMap');if(m)m.innerHTML=ndSgMap();const [p1,p2]=ndSgPlots();const a=$('#ndSgP1');if(a)a.innerHTML=p1;const b=$('#ndSgP2');if(b)b.innerHTML=p2;
  const L=$('#ndSgLog');if(L){const ms=R.msgs.filter(x=>x.t<=NDSA.t);L.innerHTML=nLog(ms.slice(-14),ms.slice(-14).length-1);}
  const tt=$('#ndSgT');if(tt){const i=Math.min(R.S.length-1,Math.floor(NDSA.t/0.1)),s=R.S[i];tt.textContent=`t = ${nF(NDSA.t,1)} / ${nF(R.T)} s · ${s.st==='scg'?'EN-DC ('+NDG[s.pc].l+')':s.st==='lte'?'chỉ LTE':'đang thủ tục'} · ${nF(s.tot)} Mbit/s`;}},
 tick(dt){if(!ND.pause){NDSA.t+=dt*NDP.sgnb.play;if(NDSA.t>NDSA.R.T)NDSA.t=0;}this.draw(dt===0);},
 upd(k){if(k==='play')return;NDSA.R=ndSgSim();if(NDSA.t>NDSA.R.T)NDSA.t=0;const o=$('#ndSgOut');if(o)o.innerHTML=ndSgOut();const a=$('#ndSgAdv');if(a)a.innerHTML=ndSgAdvice();this.draw(true);},
 act(a){if(a==='play'){ND.pause=!ND.pause;const b=$('#ndSgPlay');if(b)b.textContent=ND.pause?'▶ Chạy':'⏸ Dừng';}else if(a==='rst'){NDSA.t=0;this.draw(true);}else if(a==='seed'){NDP.sgnb.seed++;this.upd('seed');}}
};
/* ---------- Mục 3: Lỗi SCG và rớt EN-DC ---------- */
NDP.scg={b1:-112,a2:-118,n310:10,t310:1000,n311:1,ulPath:'thr',ulThr:-112,ueP:23,load:50,spd:30,cfg:0.5,x2:0.3,users:300,seed:3};
const NDSC={R:null,sel:'t310',samp:0};
const NDSCGC={
 t310:{n:'t310-Expiry',c:'var(--warn)',d:'Mất đồng bộ đường xuống NR: UE đếm N310 lần out-of-sync liên tiếp rồi chạy T310; hết T310 mà chưa nhận đủ N311 lần in-sync thì báo lỗi SCG.',
  why:['Vùng phủ NR yếu ở rìa cell, A2 quá thấp nên chưa kịp giải phóng','Nhiễu cao do tải cell lân cận, PCI mod 30 trùng (DMRS/SSB)','Che khuất nhanh (vào nhà, sau xe lớn), FR2 bị cơ thể che'],
  fix:['Nâng ngưỡng A2 xoá SgNB, giảm TTT A2','Tối ưu tilt/azimuth, giảm chồng lấn, kiểm tra PCI','Tăng N310/T310 vừa phải (đánh đổi: giữ SCG xấu lâu hơn)']},
 ra:{n:'randomAccessProblem',c:'var(--k4)',d:'Truy nhập ngẫu nhiên vào PSCell thất bại khi thêm SgNB hoặc đổi PSCell: đường lên NR không đủ (UE hết công suất) hoặc PRACH cấu hình sai.',
  why:['B1 quá thấp: thêm SgNB khi đường xuống được nhưng đường lên không tới','Sai cấu hình PRACH: root sequence trùng, zeroCorrelationZone nhỏ so với bán kính','Lệch đồng bộ TDD, nhiễu đường lên cao (RSSI UL)'],
  fix:['Nâng B1, hoặc dùng ngưỡng B1 riêng cho UE ở rìa','Kiểm tra quy hoạch PRACH, RSSI UL theo PRB','Cân nhắc UE công suất cao (HPUE 26 dBm), SUL']},
 rlc:{n:'rlc-MaxNumRetx',c:'var(--sip)',d:'RLC phát lại đến số lần tối đa mà vẫn không thành công, thường ở đường lên NR khi UE ở rìa.',
  why:['Để đường lên dữ liệu đi NR khi NR UL đã yếu','maxRetxThreshold nhỏ','Nhiễu đường lên'],
  fix:['Chuyển đường lên dữ liệu về LTE theo ngưỡng (ul-DataSplitThreshold, primaryPath LTE)','Tăng maxRetxThreshold (8 → 16/32)','Dò nhiễu UL']},
 chg:{n:'synchReconfigFailureSCG (T307)',c:'var(--up)',d:'Đổi PSCell thất bại: UE không truy nhập được PSCell đích trước khi T307 hết.',
  why:['A3 đổi PSCell quá muộn, PSCell đích còn yếu','UE đi nhanh, TTT dài','Lân cận NR khai báo sai (PCI/SSB ARFCN)'],
  fix:['Giảm offset/TTT A3 NR','Kiểm tra khai báo lân cận NR và X2 giữa các gNB','Xem xét CHO cho PSCell (Rel-16 CPC)']},
 cfg:{n:'scg-reconfigFailure',c:'var(--muted)',d:'UE không áp dụng được cấu hình SCG (không tương thích khả năng UE, tổ hợp băng tần, lỗi phần mềm).',
  why:['Tổ hợp băng tần EN-DC không có trong UE capability','Cấu hình vượt khả năng UE (số lớp, BWP)','Lỗi phần mềm UE/RAN'],
  fix:['Lọc theo UE capability (bandCombinationList, featureSetCombination)','Đối chiếu IOT với dòng máy','Nâng cấp phần mềm']},
 x2:{n:'Lỗi X2 / SgNB không phản hồi',c:'var(--k3)',d:'SgNB Addition Request không có phản hồi hoặc bị từ chối (X2 đứt, gNB hết tài nguyên, thiếu khai báo X2). Không phải lỗi SCG phía UE nhưng làm giảm SgNB Addition SR.',
  why:['Truyền dẫn X2 mất gói, chưa thiết lập X2 (ANR X2 tắt)','gNB quá tải, hết license','IPsec/MTU giữa eNB và gNB'],
  fix:['Kiểm tra trạng thái liên kết X2, SCTP','Bật X2 ANR, kiểm tra license EN-DC','Kiểm tra MTU, phân mảnh GTP-U trên X2']}
};
function ndScSim(){
  const P=NDP.scg,r=nRng(P.seed*31+7),dt=0.1,N=P.users,dur=60,iot=nDb(1+P.load/100*7),maps=141+(P.ueP-23);
  const C={t310:0,ra:0,rlc:0,chg:0,cfg:0,x2:0},ST={att:0,ok:0,rel:0,tScg:0,sess:N};let samp=null;
  for(let u=0;u<N;u++){
    let d=80+Math.sqrt(r())*820,vr=(r()*2-1)*P.spd/3.6,sh=nGs(r)*6,st='lte',oos=0,ins=0,t310=-1,tb1=0,ta2=0,ulLow=0,cool=0,ptA=0;
    const tr=[],evs=[];
    for(let i=0;i<dur/dt;i++){const t=i*dt;d=nC(d+vr*dt,40,1100);if(d<=40||d>=1100)vr=-vr;
      sh=0.98*sh+nGs(r)*1.19;
      const rs=30-ndPLn(d,3.5)+24-30+sh,inst=rs+nGs(r)*3,sinr=inst+114-iot,ulpl=ndPLn(d,3.5)-sh;
      if(st==='lte'){cool-=dt;if(cool<=0&&rs>P.b1+1){tb1+=dt;if(tb1>=0.32){tb1=0;ST.att++;
            if(r()<P.x2/100){C.x2++;cool=2;evs.push([t,'X2']);}
            else if(r()<P.cfg/100){C.cfg++;cool=5;evs.push([t,'cfg']);}
            else if(ulpl>maps+nGs(r)*1.5){C.ra++;cool=2;evs.push([t,'RA']);}
            else{ST.ok++;st='scg';oos=0;t310=-1;evs.push([t,'+SgNB']);}}}else tb1=0;}
      else{ST.tScg+=dt;
        if(sinr<-8){oos++;ins=0;}else if(sinr>-6){ins++;if(t310<0)oos=0;}
        if(t310<0&&oos>=P.n310)t310=0;
        if(t310>=0){t310+=dt;if(ins>=P.n311){t310=-1;oos=0;}}
        const ulNr=P.ulPath==='nr'||(P.ulPath==='thr'&&rs>P.ulThr);
        if(ulNr&&ulpl>maps-2){ulLow+=dt;}else ulLow=Math.max(0,ulLow-dt);
        ptA+=dt;
        if(t310>=P.t310/1000){C.t310++;st='lte';cool=1;evs.push([t,'T310']);}
        else if(ulLow>1.2){C.rlc++;st='lte';cool=1;ulLow=0;evs.push([t,'RLC']);}
        else if(ptA>8&&r()<0.00015*(1+Math.abs(vr)/8)&&rs<-108){C.chg++;st='lte';cool=1;evs.push([t,'T307']);ptA=0;}
        else if(rs<P.a2-1){ta2+=dt;if(ta2>=0.32){ta2=0;ST.rel++;st='lte';cool=2;evs.push([t,'−SgNB']);}}else ta2=0;}
      if(u<40)tr.push([t,sinr,st==='scg'?1:0,t310>=0?1:0]);}
    if(u<40&&!samp&&evs.some(e=>e[1]==='T310'))samp={tr,evs,u};
    if(u===39&&!samp)samp={tr,evs,u};}
  const fail=C.t310+C.ra+C.rlc+C.chg+C.cfg;
  return {C,ST,fail,samp};}
function ndScOut(){const R=NDSC.R,C=R.C,T=R.ST,kv=(a,b)=>`<dt>${a}</dt><dd>${b}</dd>`,abn=C.t310+C.rlc+C.chg;
  const addSr=T.att?T.ok/T.att*100:0,drop=(T.ok?abn/T.ok*100:0);
  return kv('Số phiên UE (60 s mỗi phiên)',T.sess)+kv('SgNB Addition: thử / thành công',T.att+' / '+T.ok)+kv('SgNB Addition SR',`<span data-ndcount="${addSr}" data-d="1">${nF(addSr,1)}</span> %`)
   +kv('Giải phóng bình thường (A2)',T.rel)+kv('Giải phóng bất thường (lỗi SCG sau khi đã thêm)',abn)+kv('Tỉ lệ rớt SgNB',`<b style="color:${drop>3?'var(--warn)':'var(--k1)'}">${nF(drop,2)} %</b>`)
   +kv('Lỗi SCG trên mỗi giờ EN-DC',nF(abn/Math.max(T.tScg/3600,1e-3),1))+kv('Thời gian EN-DC trung bình',nF(T.tScg/T.sess/60*100,1)+' % phiên');}
function ndScBars(){const C=NDSC.R.C,tot=Math.max(1,Object.values(C).reduce((a,b)=>a+b,0)),mx=Math.max(1,...Object.values(C));
  return `<div class="ndbars">${Object.keys(NDSCGC).map(k=>`<div class="ndbr${NDSC.sel===k?' on':''}" data-nda="scg:c-${k}" role="button" tabindex="0"><span class="ndbl">${nE(NDSCGC[k].n)}</span><span class="ndbt"><i style="width:${C[k]/mx*100}%;background:${NDSCGC[k].c}"></i></span><b>${C[k]} · ${nF(C[k]/tot*100)} %</b></div>`).join('')}</div>`;}
function ndScCause(){const k=NDSC.sel,c=NDSCGC[k],v=nVn();
  const fl={t310:[['UE','Đếm N310 lần out-of-sync (SINR < Qout ≈ −8 dB)'],['UE','Chạy T310 = '+NDP.scg.t310+' ms; không đủ N311 in-sync'],['UE → eNB','RRC SCGFailureInformationNR (failureType t310-Expiry, measResultSCG)'],['eNB → gNB','X2AP SgNB Release Request'],['eNB → UE','RRCConnectionReconfiguration giải phóng SCG'],['eNB → MME','E-RAB Modification Indication (S1-U về eNB)']],
    ra:[['eNB → UE','RRCConnectionReconfiguration có cấu hình SCG'],['UE → gNB','PRACH Msg1 lặp tới preambleTransMax, tăng công suất tới 23 dBm'],['UE','T304 của SCG hết hạn'],['UE → eNB','SCGFailureInformationNR (randomAccessProblem / synchReconfigFailureSCG)'],['eNB → gNB','SgNB Release Request']],
    rlc:[['UE → gNB','PUSCH dữ liệu, RLC AM phát lại'],['UE','Đạt maxRetxThreshold'],['UE → eNB','SCGFailureInformationNR (rlc-MaxNumRetx)'],['eNB → gNB','SgNB Release Request']],
    chg:[['UE → gNB','MeasurementReport A3 NR'],['gNB ↔ eNB ↔ gNB đích','SgNB Change Required / Addition / Change Confirm'],['eNB → UE','RRCConnectionReconfiguration (PSCell mới, T307)'],['UE','Truy nhập PSCell đích thất bại, T307 hết'],['UE → eNB','SCGFailureInformationNR (synchReconfigFailureSCG)']],
    cfg:[['eNB → UE','RRCConnectionReconfiguration có nr-Config'],['UE','Không áp dụng được cấu hình'],['UE → eNB','SCGFailureInformationNR (scg-reconfigFailure) hoặc RRC re-establishment']],
    x2:[['eNB → gNB','X2AP SgNB Addition Request'],['eNB','Không có phản hồi trong TDCprep hoặc nhận SgNB Addition Request Reject'],['eNB','Đếm SgNB Addition thất bại; UE vẫn chỉ ở LTE']]}[k];
  const cnt={huawei:'L.NsaDc.SCG.Fail.* theo cause (cần đối chiếu)',nokia:'Bộ đếm SCG failure theo cause, nhóm LTE EN-DC (cần đối chiếu)',ericsson:'pmEndcRelUeAbnormalSgnb, pmEndcRelUeAbnormalMenb, pmEndcScgFailure* (cần đối chiếu)'};
  return `<p class="e2x"><b>${nE(c.n)}</b></p><p class="e2d">${nE(c.d)}</p>
   <ol class="ndlad">${fl.map(s=>`<li><span class="u3tag">${nE(s[0])}</span> ${nE(s[1])}</li>`).join('')}</ol>
   <div class="u3two"><div><b>Nguyên nhân hay gặp</b><ul class="u3ul">${c.why.map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div><div><b>Cách xử lý</b><ul class="u3ul">${c.fix.map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div></div>
   <p class="note">Bộ đếm: ${v==='3gpp'?Object.entries(cnt).map(([a,b])=>nVName(a)+': '+nE(b)).join(' · '):nE(cnt[v])}</p>`;}
function ndScSample(){const s=NDSC.R.samp;if(!s)return '';const bands=[];let b0=null;s.tr.forEach(p=>{if(p[2]&&b0==null)b0=p[0];if(!p[2]&&b0!=null){bands.push([b0,p[0],'var(--nr)',.12]);b0=null;}});if(b0!=null)bands.push([b0,60,'var(--nr)',.12]);
  let t0=null;s.tr.forEach(p=>{if(p[3]&&t0==null)t0=p[0];if(!p[3]&&t0!=null){bands.push([t0,p[0],'var(--warn)',.25]);t0=null;}});
  return nPlot({w:680,h:200,x0:0,x1:60,y0:-20,y1:30,yt:[-20,-10,0,10,20,30],xt:[0,10,20,30,40,50,60],series:[{pts:s.tr.filter((p,i)=>i%2===0).map(p=>[p[0],p[1]]),c:'var(--nr)',w:1.2}],
   hl:[[-8,'var(--warn)','Qout'],[-6,'var(--k1)','Qin']],marks:s.evs.slice(0,12).map((e,i)=>[e[0],e[1],e[1]==='+SgNB'?'var(--nr)':e[1]==='−SgNB'?'var(--lte)':'var(--warn)',i%3]),bands,ylab:'SINR NR (dB)',xlab:'giây',aria:'SINR NR của một UE mẫu'});}
function ndScAdvice(){const P=NDP.scg,R=NDSC.R,C=R.C,o=[];const tot=Math.max(1,R.fail);
  if(C.ra/tot>0.3)o.push('Lỗi truy nhập ngẫu nhiên chiếm nhiều: B1 = '+P.b1+' dBm quá thấp so với giới hạn đường lên. Nâng B1 thêm 3–5 dB.');
  if(C.t310/tot>0.3)o.push('t310-Expiry chiếm nhiều: nâng A2 (đang '+P.a2+' dBm) để giải phóng SCG sớm hơn, kiểm tra nhiễu (tải lân cận '+P.load+' %).');
  if(C.rlc>0&&P.ulPath==='nr')o.push('Có rlc-MaxNumRetx: đang để đường lên luôn đi NR. Chọn “theo ngưỡng” để chuyển UL về LTE khi NR yếu.');
  if(P.n310<=2||P.t310<=200)o.push('N310/T310 đang rất ngắn: dễ báo lỗi SCG vì suy giảm thoáng qua.');
  if(C.x2>0)o.push('Có lỗi X2: kiểm tra liên kết SCTP X2, mất gói truyền dẫn ('+P.x2+' %).');
  if(!o.length)o.push('Tỉ lệ lỗi SCG thấp với cấu hình hiện tại.');
  return `<ul class="u3ul">${o.map(x=>`<li>${nE(x)}</li>`).join('')}</ul>`;}
NDR.scg={
 html(){NDSC.R=ndScSim();
  return `<div class="cols"><div>
   <div class="panel"><h3>Phân bố lỗi theo nguyên nhân</h3><p class="hint">Mô phỏng ${NDP.scg.users} phiên UE trong một cell EN-DC; bấm một dòng để xem luồng bản tin và cách xử lý.</p><div id="ndScBars">${ndScBars()}</div></div>
   <div class="panel"><h3>Một UE mẫu: SINR NR, N310/T310</h3><div class="scroll"><div class="ndw" id="ndScSamp">${ndScSample()}</div></div><p class="legend"><span><i style="background:var(--nr);opacity:.4"></i>có SCG</span><span><i style="background:var(--warn);opacity:.5"></i>T310 đang chạy</span></p></div>
   <div class="panel" id="ndScCause">${ndScCause()}</div>
  </div><div>
   <div class="panel"><h3>Tham số</h3><div class="ctl">
    ${nSl('scg','b1','Ngưỡng B1',-125,-95,1,v=>v+' dBm','','b1Thr')}
    ${nSl('scg','a2','Ngưỡng A2 xoá SgNB',-130,-105,1,v=>v+' dBm','','a2Scg')}
    ${nSel('scg','n310','N310',[1,2,3,4,6,8,10,20].map(x=>[x,String(x)]),'Số lần out-of-sync liên tiếp (mỗi lần ~ 10–20 ms, ở đây quy về mẫu 100 ms).','n310Scg')}
    ${nSel('scg','t310','T310',[0,50,100,200,500,1000,2000].map(x=>[x,x+' ms']),'','t310Scg')}
    ${nSel('scg','n311','N311',[1,2,3,4,5,6,8,10].map(x=>[x,String(x)]),'','n311Scg')}
    ${nSel('scg','ulPath','Đường lên dữ liệu',[['nr','Luôn qua NR'],['lte','Luôn qua LTE'],['thr','Theo ngưỡng RSRP NR']],'primaryPath / ul-DataSplitThreshold','ulPath')}
    ${nSl('scg','ulThr','Ngưỡng chuyển UL sang LTE',-120,-95,1,v=>v+' dBm','Dùng khi chọn “theo ngưỡng”.','ulThr')}
    ${nSel('scg','ueP','Công suất phát UE',[[23,'23 dBm (lớp 3)'],[26,'26 dBm (HPUE lớp 2)']])}
    ${nSl('scg','load','Tải cell lân cận',0,100,5,v=>v+' %')}
    ${nSl('scg','spd','Tốc độ UE tối đa',0,120,5,v=>v+' km/h')}
    ${nSl('scg','cfg','UE không tương thích cấu hình',0,3,0.1,v=>nF(v,1)+' %')}
    ${nSl('scg','x2','Lỗi X2 / không phản hồi',0,3,0.1,v=>nF(v,1)+' %')}
    ${nSel('scg','users','Số phiên mô phỏng',[[100,'100'],[300,'300'],[600,'600']])}
   </div><div class="row"><button type="button" class="btn sm" data-nda="scg:seed">Chạy lại với mẫu ngẫu nhiên khác</button></div></div>
   <div class="panel"><h3>Kết quả</h3><dl class="kv" id="ndScOut">${ndScOut()}</dl></div>
   <div class="panel"><h3>Gợi ý tối ưu</h3><div id="ndScAdv">${ndScAdvice()}</div></div>
  </div></div>
  <div class="panel"><h3>Quy trình xử lý khi tỉ lệ rớt SgNB cao</h3><ol class="u3ul">
   <li>Tách theo nguyên nhân SCG failure (t310, RA, RLC, T307, reconfig) và theo phía khởi tạo (MeNB hay SgNB).</li>
   <li>Lọc top cell, so với giờ cao điểm; xem tải PRB, RSSI UL theo PRB của gNB.</li>
   <li>Đối chiếu ngưỡng B1/A2 với phân bố RSRP NR lúc thêm và lúc lỗi (MR/MDT, trace UE).</li>
   <li>Kiểm tra X2: trạng thái SCTP, độ trễ, mất gói, MTU; khai báo lân cận NR và X2 ANR.</li>
   <li>Kiểm tra UE: dòng máy chiếm tỉ lệ lỗi cao (TAC/IMEISV), tổ hợp băng tần.</li>
   <li>Đổi một tham số mỗi lần, theo dõi 3–7 ngày, so với cell đối chứng.</li></ol></div>`;},
 upd(){NDSC.R=ndScSim();const s=(id,h)=>{const e=$(id);if(e)e.innerHTML=h;};s('#ndScBars',ndScBars());s('#ndScSamp',ndScSample());s('#ndScOut',ndScOut());s('#ndScAdv',ndScAdvice());s('#ndScCause',ndScCause());if(window.gxCount)gxCount($('#ndScOut'));},
 act(a){if(a==='seed'){NDP.scg.seed++;this.upd();}else if(a.startsWith('c-')){NDSC.sel=a.slice(2);const b=$('#ndScBars');if(b)b.innerHTML=ndScBars();const c=$('#ndScCause');if(c)c.innerHTML=ndScCause();}}
};
/* ---------- Mục 4: PDCP duplication và NR-DC ---------- */
NDP.dup={mode:'on',copies:2,p1:1,p2:2,rho:10,l1:2,l2:4,jit:1.5,bud:5,act:2,rate:20,
  fr1:100,fr2:400,blk:6,bdur:1.5,keep:'wait'};
const NDDA={pk:[],acc:0,sent:0,ok:0,lost:0,late:0,dupd:0,actOn:false,win:[]};
function ndDupFail(P){const p=[P.p1,P.p2,(P.p1+P.p2)/2,(P.p1+P.p2)/2].slice(0,P.mode==='off'?1:P.copies).map(x=>x/100),rho=P.rho/100;
  const ind=p.reduce((a,b)=>a*b,1);return rho*Math.min(...p)+(1-rho)*ind;}
const ndNines=f=>f<=0?12:Math.min(12,-Math.log10(f));
function ndDupLegs(){const P=NDP.dup;return P.mode==='off'?1:P.copies;}
function ndDupSvg(){const n=ndDupLegs(),W=720,H=70+n*46,P=NDP.dup;let s='';
  s+=`<rect x="10" y="20" width="96" height="${H-40}" rx="10" class="ndbox"/><text x="58" y="${H/2-4}" class="u3nt" text-anchor="middle">PDCP</text><text x="58" y="${H/2+12}" class="u3ax" text-anchor="middle">gNB</text>`;
  s+=`<rect x="${W-106}" y="20" width="96" height="${H-40}" rx="10" class="ndbox"/><text x="${W-58}" y="${H/2-4}" class="u3nt" text-anchor="middle">PDCP</text><text x="${W-58}" y="${H/2+12}" class="u3ax" text-anchor="middle">UE · bỏ bản trùng</text>`;
  const lab=['MCG / CC1 (n78)','SCG / CC2 (n41)','CC3','CC4'];
  for(let i=0;i<n;i++){const y=50+i*46;s+=`<line x1="106" y1="${y}" x2="${W-106}" y2="${y}" class="ndlane"/><rect x="150" y="${y-13}" width="78" height="26" rx="6" class="ndrlc"/><text x="189" y="${y+4}" class="u3ax" text-anchor="middle">RLC ${i+1}</text><text x="${W/2}" y="${y-16}" class="u3ax" text-anchor="middle">${lab[i]} · mất ${nF(i===0?P.p1:i===1?P.p2:(P.p1+P.p2)/2,1)} % · ${nF(i===0?P.l1:i===1?P.l2:(P.l1+P.l2)/2,1)} ms</text>`;}
  s+=`<g id="ndDupPk"></g>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="Gói PDCP được nhân đôi qua các nhánh RLC">${s}</svg>`;}
function ndDupOut(){const P=NDP.dup,f=ndDupFail(P),kv=(a,b)=>`<dt>${a}</dt><dd>${b}</dd>`,A=NDDA;
  const single=Math.min(P.p1,P.p2)/100;
  return kv('Xác suất mất gói (lý thuyết)',f<1e-12?'< 1e-12':f.toExponential(2).replace('.',','))+kv('Độ tin cậy',nF((1-f)*100,Math.min(8,Math.max(2,Math.ceil(ndNines(f)))))+' % · '+nF(ndNines(f),1)+' số 9')
   +kv('Không nhân đôi (nhánh tốt nhất)',nF((1-single)*100,3)+' %')+kv('Tài nguyên vô tuyến dùng',`× ${P.mode==='off'?1:P.copies}`)+kv('Đạt URLLC 99,999 %?',ndNines(f)>=5?'<b style="color:var(--k1)">Đạt</b>':'<b style="color:var(--warn)">Chưa đạt</b>')
   +'<div class="sep"></div>'+kv('Gói đã gửi (hoạt hình)',A.sent)+kv('Tới đúng hạn',A.ok)+kv('Mất / quá hạn '+P.bud+' ms',A.lost+' / '+A.late)+kv('Bản trùng đã bỏ ở UE',A.dupd)
   +(P.mode==='dyn'?kv('Nhân đôi đang',A.actOn?'<b style="color:var(--nr)">bật (MAC CE)</b>':'tắt'):'');}
function ndDupChart(){const P=NDP.dup,xs=[];for(let x=0.1;x<=10.001;x+=0.1)xs.push(x);
  const ser=[1,2,3,4].map((c,i)=>({pts:xs.map(x=>{const q=x/100,rho=P.rho/100,f=rho*q+(1-rho)*Math.pow(q,c);return [x,ndNines(f)];}),c:['var(--muted)','var(--nr)','var(--up)','var(--k4)'][i],w:c===(P.mode==='off'?1:P.copies)?2.6:1.3}));
  return nPlot({w:680,h:200,x0:0,x1:10,y0:0,y1:8,yt:[0,1,2,3,4,5,6,7,8],xt:[0,2,4,6,8,10],series:ser,hl:[[5,'var(--warn)','99,999 %']],ylab:'số số 9',xlab:'% mất mỗi nhánh',aria:'Độ tin cậy theo số bản sao'});}
/* NR-DC: FR1 làm MCG, FR2 làm SCG, FR2 bị che theo quá trình Poisson */
function ndNrdc(){const P=NDP.dup,r=nRng(99+P.blk*7+Math.round(P.bdur*10)),T=60,dt=0.1;let blocked=0,rem=0,t310=0,scg=true,down=0;const pts=[],p2=[];let sum=0,sumF=0,lost=0;
  const thr1=P.fr1*5.2*0.74,thr2=P.fr2*4*0.74;   /* Mbit/s: hiệu suất phổ × phần DL của TDD */
  for(let i=0;i<T/dt;i++){const t=i*dt;
    if(!blocked&&r()<P.blk/60*dt){blocked=1;rem=-Math.log(1-r())*P.bdur;}
    if(blocked){rem-=dt;if(rem<=0)blocked=0;}
    if(scg&&blocked){t310+=dt;if(P.keep==='fast'&&t310>0.2){scg=false;down=1.0;lost++;}else if(t310>1.0){scg=false;down=2.0;lost++;}}else if(!blocked)t310=0;
    if(!scg){down-=dt;if(down<=0&&!blocked){scg=true;t310=0;}}
    const f2=scg&&!blocked?thr2:0,tot=thr1+f2;sum+=tot*dt;sumF+=f2*dt;pts.push([t,tot]);p2.push([t,f2]);}
  return {pts,p2,avg:sum/T,f2share:sum?sumF/sum:0,lost,thr1,thr2};}
function ndNrdcPlot(R){return nPlot({w:680,h:180,x0:0,x1:60,y0:0,y1:(R.thr1+R.thr2)*1.1,yt:[0,500,1000,1500,2000].filter(v=>v<=(R.thr1+R.thr2)*1.1),xt:[0,10,20,30,40,50,60],series:[{pts:R.pts.filter((p,i)=>i%2===0),c:'var(--ink)'},{pts:R.p2.filter((p,i)=>i%2===0),c:'var(--up)',dash:'4 3'}],ylab:'Mbit/s',xlab:'giây',aria:'Tốc độ NR-DC'});}
function ndNrdcOut(){const R=ndNrdc(),kv=(a,b)=>`<dt>${a}</dt><dd>${b}</dd>`;
  return [kv('Tốc độ đỉnh FR1 (MCG)',nF(R.thr1)+' Mbit/s')+kv('Tốc độ đỉnh FR2 (SCG)',nF(R.thr2)+' Mbit/s')+kv('Tốc độ trung bình 60 s',`<span data-ndcount="${R.avg}">${nF(R.avg)}</span> Mbit/s`)+kv('Phần do FR2 mang',nF(R.f2share*100,1)+' %')+kv('Số lần mất SCG FR2',R.lost),ndNrdcPlot(R)];}
NDR.dup={
 html(){const [o,p]=ndNrdcOut();
  return `<div class="cols"><div>
   <div class="panel"><h3>PDCP duplication: một gói, nhiều nhánh RLC</h3><div class="scroll"><div class="ndw" id="ndDupSvg">${ndDupSvg()}</div></div>
    <p class="legend"><span><i style="background:var(--nr)"></i>bản tới trước (được nhận)</span><span><i style="background:var(--muted)"></i>bản trùng bị bỏ</span><span><i style="background:var(--warn)"></i>bị mất / quá hạn</span></p>
    <div class="row"><button type="button" class="btn sm" data-nda="dup:rst">Đặt lại bộ đếm</button></div></div>
   <div class="panel"><h3>Độ tin cậy theo số bản sao</h3><div class="scroll"><div class="ndw" id="ndDupCh">${ndDupChart()}</div></div><p class="legend"><span><i style="background:var(--muted)"></i>1 nhánh</span><span><i style="background:var(--nr)"></i>2 bản</span><span><i style="background:var(--up)"></i>3 bản</span><span><i style="background:var(--k4)"></i>4 bản (Rel-16)</span></p>
    <p class="note">Tương quan mất gói giữa hai nhánh (cùng che khuất, cùng nhiễu) làm lợi ích giảm mạnh: với 10 % tương quan, hai nhánh mất 1 % chỉ còn khoảng 3 số 9 thay vì 4.</p></div>
  </div><div>
   <div class="panel"><h3>Tham số nhân đôi</h3><div class="ctl">
    ${nSel('dup','mode','Chế độ',[['off','Tắt (một nhánh)'],['on','Luôn bật'],['dyn','Bật/tắt bằng MAC CE theo chất lượng']],'Cấu hình pdcp-Duplication trong RadioBearerConfig; gNB bật/tắt bằng Duplication Activation/Deactivation MAC CE.','pdcpDup')}
    ${nSel('dup','copies','Số bản sao',[[2,'2 (Rel-15)'],[3,'3 (Rel-16)'],[4,'4 (Rel-16)']])}
    ${nSl('dup','p1','Mất gói nhánh 1 sau HARQ/RLC',0,10,0.1,v=>nF(v,1)+' %')}
    ${nSl('dup','p2','Mất gói nhánh 2',0,10,0.1,v=>nF(v,1)+' %')}
    ${nSl('dup','rho','Tương quan mất gói',0,100,5,v=>v+' %')}
    ${nSl('dup','l1','Trễ nhánh 1',0.5,10,0.5,v=>nF(v,1)+' ms')}
    ${nSl('dup','l2','Trễ nhánh 2',0.5,10,0.5,v=>nF(v,1)+' ms')}
    ${nSl('dup','jit','Độ rung trễ',0,5,0.5,v=>nF(v,1)+' ms')}
    ${nSl('dup','bud','Ngân sách trễ',1,20,1,v=>v+' ms')}
    ${nSl('dup','act','Ngưỡng bật nhân đôi (mất gói nhánh 1)',0.5,10,0.5,v=>nF(v,1)+' %','Chỉ dùng ở chế độ MAC CE.')}
   </div></div>
   <div class="panel"><h3>Kết quả</h3><dl class="kv" id="ndDupOut">${ndDupOut()}</dl></div>
  </div></div>
  <div class="cols"><div>
   <div class="panel"><h3>NR-DC: FR1 làm MCG, FR2 làm SCG</h3><div class="scroll"><div class="ndw" id="ndNrP">${p}</div></div><p class="legend"><span><i style="background:var(--ink)"></i>Tổng</span><span><i style="background:var(--up)"></i>Phần FR2</span></p>
   <p class="note">FR2 (mmWave) dễ bị che bởi cơ thể, xe, cây. Khi bị che lâu hơn T310 thì SCG lỗi và phải thêm lại; FR1 giữ kết nối nên phiên không rớt.</p></div>
  </div><div>
   <div class="panel"><h3>Tham số NR-DC</h3><div class="ctl">
    ${nSl('dup','fr1','Băng thông FR1',20,100,10,v=>v+' MHz')}
    ${nSl('dup','fr2','Băng thông FR2',100,800,100,v=>v+' MHz')}
    ${nSl('dup','blk','Số lần bị che mỗi phút',0,20,1,v=>v+' lần')}
    ${nSl('dup','bdur','Thời gian che trung bình',0.2,5,0.1,v=>nF(v,1)+' s')}
    ${nSel('dup','keep','Khi FR2 bị che',[['wait','Chờ T310 (1 s) rồi báo lỗi SCG'],['fast','Phát hiện nhanh, giải phóng sớm (0,2 s)']])}
   </div></div>
   <div class="panel"><h3>Kết quả NR-DC</h3><dl class="kv" id="ndNrOut">${o}</dl></div>
  </div></div>
  <div class="panel"><h3>Bốn dạng kết nối kép đa công nghệ (MR-DC)</h3><div class="scroll"><table class="ndtb"><thead><tr><th>Dạng</th><th>Nút chính</th><th>Nút phụ</th><th>Lõi</th><th>Option</th><th>Dùng khi</th></tr></thead><tbody>
   <tr><td>EN-DC</td><td>eNB</td><td>en-gNB</td><td>EPC</td><td>3, 3a, 3x</td><td>Triển khai 5G NSA ban đầu</td></tr>
   <tr><td>NGEN-DC</td><td>ng-eNB</td><td>gNB</td><td>5GC</td><td>7, 7a, 7x</td><td>LTE nâng cấp nối 5GC</td></tr>
   <tr><td>NE-DC</td><td>gNB</td><td>ng-eNB</td><td>5GC</td><td>4, 4a</td><td>SA cần thêm dung lượng LTE</td></tr>
   <tr><td>NR-DC</td><td>gNB</td><td>gNB</td><td>5GC</td><td>2 + DC</td><td>FR1 + FR2, hoặc hai gNB FR1 (Rel-15/16)</td></tr></tbody></table></div>
   <p class="note">Khác với ghép sóng mang (CA) dùng chung một MAC trong một gNB, kết nối kép có hai MAC ở hai nút, nối với nhau qua X2/Xn, chịu được trễ truyền dẫn giữa hai trạm.</p></div>`;},
 after(){},
 upd(k){const s=(id,h)=>{const e=$(id);if(e)e.innerHTML=h;};
  if(['fr1','fr2','blk','bdur','keep'].includes(k)){const [o,p]=ndNrdcOut();s('#ndNrOut',o);s('#ndNrP',p);return;}
  if(k==='mode'||k==='copies'){NDDA.pk=[];s('#ndDupSvg',ndDupSvg());}
  if(['p1','p2','l1','l2'].includes(k))s('#ndDupSvg',ndDupSvg());
  this.rst();s('#ndDupCh',ndDupChart());s('#ndDupOut',ndDupOut());},
 rst(){Object.assign(NDDA,{pk:[],sent:0,ok:0,lost:0,late:0,dupd:0,win:[]});},
 act(a){if(a==='rst'){this.rst();const e=$('#ndDupOut');if(e)e.innerHTML=ndDupOut();}},
 tick(dt){const P=NDP.dup,A=NDDA,g=$('#ndDupPk');if(!g)return;const W=720,x0=110,x1=W-110,sp=(x1-x0)/1.6;
  const pl=[P.p1,P.p2,(P.p1+P.p2)/2,(P.p1+P.p2)/2],lt=[P.l1,P.l2,(P.l1+P.l2)/2,(P.l1+P.l2)/2];
  /* chế độ MAC CE: bật khi mất gói gần đây trên nhánh 1 vượt ngưỡng */
  if(P.mode==='dyn'){const w=A.win.slice(-50),pr=w.length?w.filter(x=>x).length/w.length*100:0;A.actOn=pr>=P.act||P.p1>=P.act;}
  const nleg=P.mode==='off'?1:P.mode==='dyn'&&!A.actOn?1:P.copies;
  A.acc+=dt*3;while(A.acc>1){A.acc-=1;A.sent++;const id=A.sent,cps=[];let anyOk=false,best=1e9;const lostAll=Math.random()<P.rho/100?Math.random()<Math.min(...pl.slice(0,nleg))/100:null;
    for(let i=0;i<nleg;i++){const lost=lostAll!==null?lostAll:Math.random()<pl[i]/100,lat=lt[i]+Math.abs(nGs(Math.random))*P.jit;cps.push({i,lost,lat,x:x0,done:0});if(!lost&&lat<=P.bud){anyOk=true;best=Math.min(best,lat);}}
    A.win.push(cps[0].lost);
    cps.forEach(c=>{c.first=!c.lost&&c.lat===best;});
    if(anyOk)A.ok++;else if(cps.some(c=>!c.lost))A.late++;else A.lost++;
    A.dupd+=Math.max(0,cps.filter(c=>!c.lost).length-1);
    A.pk.push({id,cps,age:0});}
  let h='';A.pk.forEach(p=>{p.age+=dt;p.cps.forEach(c=>{const prog=Math.min(1,p.age/(0.9+c.lat/20));const y=50+c.i*46;let x=x0+(x1-x0)*prog;
    if(c.lost&&prog>0.55){h+=`<text x="${x0+(x1-x0)*0.55}" y="${y+5}" class="ndx">✕</text>`;return;}
    const cls=c.lost?'lost':c.first?'ok':(c.lat>P.bud?'lost':'dup');h+=`<rect x="${x-8}" y="${y-6}" width="16" height="12" rx="3" class="ndpk ${prog>=1?cls:'fly'}"/>`;});});
  A.pk=A.pk.filter(p=>p.age<2.2).slice(-60);g.innerHTML=h;
  ND.dupT=(ND.dupT||0)+dt;if(ND.dupT>0.5){ND.dupT=0;const e=$('#ndDupOut');if(e)e.innerHTML=ndDupOut();}}
};
/* ---------- Mục 5: Di động 5G-A — HO thường, CHO, DAPS, LTM ---------- */
NDP.mob={sc:'corner',v:60,D:500,off:3,hys:1,ttt:256,cPrep:-2,cExe:3,cTtt:160,nCand:2,l1w:100,lOff:3,lTtt:80,rachless:true,n310:10,t310:1000,runs:120,show:'cho',seed:5};
const NDMS={R:null,t:0,lastDraw:-1};
const NDSCH=[['ho','HO thường','var(--muted)'],['cho','CHO','var(--nr)'],['daps','DAPS','var(--up)'],['ltm','LTM','var(--k4)']];
const NDMSC={road:'Đường phố, hai cell bình thường',corner:'Rẽ góc phố: cell nguồn bị toà nhà che đột ngột',fast:'Đường cao tốc, đi nhanh'};
function ndMobRun(seed,P){const r=nRng(seed),dt=0.02,D=P.D,v=(P.sc==='fast'?Math.max(P.v,100):P.v)/3.6,x0=0.12*D,x1=1.05*D,n=Math.ceil((x1-x0)/v/dt);
  const A=new Float32Array(n),B=new Float32Array(n),fa=new Float32Array(n),fb=new Float32Array(n);let sa=nGs(r)*4,sb=nGs(r)*4;const step=v*dt,ac=Math.exp(-step/30),bc=Math.sqrt(1-ac*ac);
  for(let i=0;i<n;i++){const x=x0+i*step;sa=ac*sa+bc*nGs(r)*5;sb=ac*sb+bc*nGs(r)*5;
    let pa=30-ndPLn(Math.hypot(x,40),3.5)-6+sa,pb=30-ndPLn(Math.hypot(D-x,40),3.5)-6+sb;
    if(P.sc==='corner'){const c=0.55*D,k=nC((x-c)/15,0,1);pa-=24*k*k*(3-2*k);pb+=4*k;}
    A[i]=pa;B[i]=pb;fa[i]=pa+nGs(r)*2.2;fb[i]=pb+nGs(r)*2.2;}
  return {n,dt,A,B,fa,fb,x0,step};}
function ndSinr(s,o){return s-10*Math.log10(Math.pow(10,o/10)*0.7+Math.pow(10,-118/10));}
/* chạy một phương án trên một mẫu kênh */
function ndMobScheme(ch,sch,P,log){const {n,dt,A,B,fa,fb}=ch,R=[fa,fb],L3=[A,B];
  let s=0,ttt=0,pend=null,prep=null,oos=0,t310=-1,lastHo=-9,hoN=0,hof=0,pp=0,intr=0,sig=0,early=0,rlf=0,rec=0,fb2=0,blk=0;const ev=[];const tttS=P.ttt/1000;
  const l1=[new Float32Array(n),new Float32Array(n)];const wn=Math.max(1,Math.round(P.l1w/1000/dt));
  if(sch==='ltm'){for(const c of [0,1]){let acc=0;for(let i=0;i<n;i++){acc+=R[c][i];if(i>=wn)acc-=R[c][i-wn];l1[c][i]=acc/Math.min(i+1,wn);}}}
  const msg=(t,p,m,a)=>{if(log)log.push({t,p,m,a});};
  for(let i=0;i<n;i++){const t=i*dt,o=1-s,sin=ndSinr(R[s][i],R[o][i]);
    if(blk>0){blk-=dt;continue;}
    /* theo dõi lỗi vô tuyến ở cell phục vụ */
    if(sin<-8)oos++;else if(sin>-6){oos=0;t310=-1;}
    if(t310<0&&oos>=P.n310*0.5)t310=0;if(t310>=0)t310+=dt;
    if(t310>=P.t310/1000){rlf++;const late=L3[o][i]>L3[s][i];if(t-lastHo<1&&!late)early++;
      if(sch==='cho'&&prep!=null){rec++;intr+=80;msg(t,'RRC','RLF → thực hiện CHO đã chuẩn bị (phục hồi nhanh)','UE → cell '+(o?'B':'A'));s=o;}
      else{intr+=400;hof++;msg(t,'RRC','RLF '+(late?'(HO quá muộn)':'')+' → RRCReestablishment','UE → cell '+(R[o][i]>R[s][i]?(o?'B':'A'):(s?'B':'A')));if(R[o][i]>R[s][i])s=o;}
      t310=-1;oos=0;pend=null;prep=null;ttt=0;lastHo=t;blk=0.2;ev.push([t,'RLF',sch]);continue;}
    const tgt=1-s;
    if(sch==='ltm'){
      if(!pend){if(l1[tgt][i]>l1[s][i]+P.lOff){ttt+=dt;if(ttt>=P.lTtt/1000){ttt=0;pend={t:t+0.006,g:tgt};sig+=1;msg(t,'L1','Báo cáo đo lớp 1 (L1 measurement report)','UE → gNB-DU');}}else ttt=0;}
      else if(t>=pend.t){if(sin>-7){sig+=1;msg(t,'MAC','LTM Cell Switch Command (MAC CE)','gNB-DU → UE');const tsin=ndSinr(R[pend.g][i],R[s][i]);
          if(tsin>-7){if(t-lastHo<1)pp++;hoN++;lastHo=t;s=pend.g;intr+=P.rachless?8:22;sig+=P.rachless?0:2;msg(t,P.rachless?'MAC':'MAC',P.rachless?'Chuyển cell không RACH (đã có TA sớm)':'Truy nhập ngẫu nhiên tới cell đích','UE → cell '+(s?'B':'A'));ev.push([t,'LTM',sch]);}
          else{hof++;intr+=300;msg(t,'RRC','Truy nhập cell đích thất bại → tái lập','UE');lastHo=t;}}
        pend=null;}}
    else if(sch==='cho'){
      if(prep==null){if(L3[tgt][i]>L3[s][i]+P.cPrep+P.hys){ttt+=dt;if(ttt>=tttS){ttt=0;if(sin>-7){prep=tgt;sig+=4+3*(P.nCand-1)+2;msg(t,'RRC','MeasurementReport → chuẩn bị '+P.nCand+' ô ứng viên','UE → gNB');msg(t+0.05,'XnAP','Handover Request / Ack (CHO) × '+P.nCand,'gNB nguồn ↔ gNB đích');msg(t+0.06,'RRC','RRCReconfiguration có conditionalReconfiguration','gNB → UE');}}}else ttt=0;}
      else{if(L3[prep][i]>L3[s][i]+P.cExe){ttt+=dt;if(ttt>=P.cTtt/1000){ttt=0;const tsin=ndSinr(R[prep][i],R[s][i]);
            if(tsin>-7){if(t-lastHo<1)pp++;hoN++;lastHo=t;s=prep;intr+=50;sig+=3+(P.nCand-1);msg(t,'RRC','UE tự thực hiện CHO khi điều kiện thoả → RACH → RRCReconfigurationComplete','UE → cell '+(s?'B':'A'));msg(t+0.03,'XnAP','HO Success → SN Status Transfer; huỷ ô ứng viên khác','gNB đích → gNB nguồn');ev.push([t,'CHO',sch]);}
            else{hof++;intr+=300;msg(t,'RRC','CHO thất bại khi truy nhập → tái lập','UE');lastHo=t;}
            prep=null;}}else ttt=0;}}
    else{/* HO thường và DAPS */
      if(!pend){if(L3[tgt][i]>L3[s][i]+P.off+P.hys){ttt+=dt;if(ttt>=tttS){ttt=0;pend={t:t+0.05,g:tgt};sig+=1;msg(t,'RRC','MeasurementReport (A3)','UE → gNB nguồn');}}else ttt=0;}
      else if(t>=pend.t){if(sin>-7){sig+=6;msg(t,'XnAP','Handover Request / Acknowledge'+(sch==='daps'?' (DAPS)':''),'gNB nguồn ↔ gNB đích');msg(t+0.002,'RRC','RRCReconfiguration (reconfigurationWithSync'+(sch==='daps'?', daps-Config':'')+')','gNB → UE');const tsin=ndSinr(R[pend.g][i],R[s][i]);
          if(tsin>-7){if(t-lastHo<1)pp++;hoN++;lastHo=t;s=pend.g;intr+=sch==='daps'?1:50;msg(t+0.03,'RRC','RRCReconfigurationComplete'+(sch==='daps'?'; giữ dữ liệu cell nguồn tới khi giải phóng':''),'UE → cell '+(s?'B':'A'));msg(t+0.04,'NGAP','Path Switch Request / Ack','gNB đích ↔ AMF');ev.push([t,sch==='daps'?'DAPS':'HO',sch]);}
          else if(sch==='daps'&&sin>-7){fb2++;msg(t,'RRC','DAPS: truy nhập đích thất bại → quay lại cell nguồn, không gián đoạn','UE');}
          else{hof++;intr+=300;msg(t,'RRC','HO thất bại khi truy nhập → tái lập','UE');lastHo=t;}
          pend=null;}
        else if(t>pend.t+1.5)pend=null;}}}
  return {hoN,hof,pp,intr,sig,rlf,early,rec,fb2,ev,T:n*dt};}
function ndMobSim(){const P=NDP.mob,agg={};NDSCH.forEach(([k])=>agg[k]={hoN:0,hof:0,pp:0,intr:0,sig:0,rlf:0,early:0,rec:0,fb2:0});
  for(let i=0;i<P.runs;i++){const ch=ndMobRun(P.seed*1000+i,P);for(const [k] of NDSCH){const o=ndMobScheme(ch,k,P);for(const q in agg[k])agg[k][q]+=o[q];}}
  const ch=ndMobRun(P.seed*1000+1,P),samp={};const logs={};for(const [k] of NDSCH){logs[k]=[];samp[k]=ndMobScheme(ch,k,P,logs[k]);}
  return {agg,ch,samp,logs};}
function ndMobBars(){const A=NDMS.R.agg,P=NDP.mob,rows=k=>{const a=A[k],att=Math.max(1,a.hoN+a.hof);return {hof:a.hof/att*100,pp:a.hoN?a.pp/a.hoN*100:0,intr:a.intr/P.runs,ihp:a.hoN?a.intr/Math.max(1,a.hoN+a.hof):0,sig:a.hoN?a.sig/Math.max(1,a.hoN):0};};
  const Rw={};NDSCH.forEach(([k])=>Rw[k]=rows(k));
  const grp=(t,f,u,d)=>{const mx=Math.max(1e-6,...NDSCH.map(([k])=>Rw[k][f]));return `<div class="ndgrp"><b>${t}</b>${nBars(NDSCH.map(([k,n,c])=>[n,Rw[k][f],c]),mx*1.05,u,d)}</div>`;};
  return `<div class="ndgrid2">${grp('Tỉ lệ chuyển giao lỗi (HOF + RLF)','hof',' %',1)}${grp('Tỉ lệ ping-pong (quay lại < 1 s)','pp',' %',1)}${grp('Gián đoạn dữ liệu trung bình mỗi lần chạy','intr',' ms',0)}${grp('Bản tin báo hiệu mỗi lần chuyển giao','sig','',1)}</div>`;}
function ndMobPlot(){const R=NDMS.R,ch=R.ch,show=NDP.mob.show,pts=a=>{const o=[];for(let i=0;i<ch.n;i+=5)o.push([i*ch.dt,a[i]]);return o;},T=ch.n*ch.dt;
  const marks=[];NDSCH.forEach(([k,n,c],j)=>R.samp[k].ev.forEach(e=>marks.push([e[0],e[1],c,j])));
  const xt=[];for(let v=0;v<=T;v+=T>40?10:T>15?5:2)xt.push(v);
  return nPlot({w:680,h:230,x0:0,x1:T,y0:-125,y1:-55,yt:[-120,-110,-100,-90,-80,-70,-60],xt,series:[{pts:pts(ch.A),c:'var(--lte)'},{pts:pts(ch.B),c:'var(--nr)'}],marks,cur:NDMS.t,ylab:'RSRP L3 (dBm)',xlab:'giây',aria:'RSRP hai cell và thời điểm chuyển giao của từng phương án'});}
function ndMobMap(){const R=NDMS.R,ch=R.ch,P=NDP.mob,i=Math.min(ch.n-1,Math.floor(NDMS.t/ch.dt)),x=ch.x0+i*ch.step,W=720,H=150,X=v=>30+v/(1.1*P.D)*(W-60);
  let srv=0;const ev=R.samp[P.show].ev;for(const e of ev){if(e[0]<=NDMS.t&&e[1]!=='RLF')srv=1-srv;}
  let h=`<line x1="${X(0)}" y1="110" x2="${X(1.1*P.D)}" y2="110" class="ndroad"/>`;
  if(P.sc==='corner')h+=`<rect x="${X(0.47*P.D)}" y="58" width="${X(0.55*P.D)-X(0.47*P.D)}" height="40" rx="4" class="ndbld"/><text x="${X(0.51*P.D)}" y="82" class="u3ax" text-anchor="middle">toà nhà</text>`;
  [['A',0,'l'],['B',P.D,'n']].forEach(([l,cx,c])=>{h+=`<rect x="${X(cx)-7}" y="40" width="14" height="14" class="ndbs ${c}"/><text x="${X(cx)}" y="32" class="u3x" text-anchor="middle">Cell ${l}</text>`;});
  h+=`<line x1="${X(x)}" y1="110" x2="${X(srv?P.D:0)}" y2="47" class="ndlnk ${srv?'n':'l'}"/><circle cx="${X(x)}" cy="110" r="8" class="ndue"/><text x="${X(x)}" y="135" class="u3x" text-anchor="middle">UE · ${nE(NDSCH.find(s=>s[0]===P.show)[1])} · cell ${srv?'B':'A'}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="UE đi từ cell A sang cell B">${h}</svg>`;}
function ndMobLog(){const L=NDMS.R.logs[NDP.mob.show]||[],ms=L.filter(m=>m.t<=NDMS.t);return nLog(ms.slice(-12),ms.slice(-12).length-1);}
NDR.mob={
 html(){NDMS.R=ndMobSim();const T=NDMS.R.ch.n*NDMS.R.ch.dt;if(NDMS.t>T)NDMS.t=0;
  return `<div class="panel"><h3>So sánh bốn cách chuyển giao trên ${NDP.mob.runs} lần đi</h3><p class="hint">${nE(NDMSC[NDP.mob.sc])}. Cùng một mẫu kênh cho cả bốn phương án để so sánh công bằng.</p><div id="ndMobBars">${ndMobBars()}</div></div>
  <div class="cols"><div>
   <div class="panel"><h3>Một lần đi mẫu</h3><div class="scroll"><div class="ndw" id="ndMobMap">${ndMobMap()}</div></div><div class="scroll"><div class="ndw" id="ndMobPlot">${ndMobPlot()}</div></div>
    <p class="legend"><span><i style="background:var(--lte)"></i>Cell A (nguồn)</span><span><i style="background:var(--nr)"></i>Cell B (đích)</span>${NDSCH.map(s=>`<span><i style="background:${s[2]}"></i>${s[1]}</span>`).join('')}</p>
    <div class="row"><button type="button" class="btn sm" data-nda="mob:play" id="ndMobPlay">${ND.pause?'▶ Chạy':'⏸ Dừng'}</button><button type="button" class="btn sm" data-nda="mob:rst">⟲ Về đầu</button><button type="button" class="btn sm" data-nda="mob:seed">Mẫu kênh khác</button></div></div>
   <div class="panel"><h3>Nhật ký bản tin của phương án đang xem</h3><div id="ndMobLog">${ndMobLog()}</div></div>
  </div><div>
   <div class="panel"><h3>Kịch bản và tham số</h3><div class="ctl">
    ${nSel('mob','sc','Kịch bản',Object.entries(NDMSC))}
    ${nSel('mob','show','Phương án hiện trên bản đồ',NDSCH.map(s=>[s[0],s[1]]))}
    ${nSl('mob','v','Tốc độ UE',3,200,1,v=>v+' km/h')}
    ${nSl('mob','D','Khoảng cách hai cell',300,1000,50,v=>v+' m')}
    ${nSl('mob','off','HO thường/DAPS: offset A3',0,8,0.5,v=>nF(v,1)+' dB','','a3Off')}
    ${nSel('mob','ttt','HO thường/DAPS: TTT',[[40,'40 ms'],[80,'80 ms'],[160,'160 ms'],[256,'256 ms'],[320,'320 ms'],[640,'640 ms']],'','tttA3')}
    ${nSl('mob','cPrep','CHO: offset chuẩn bị',-3,5,0.5,v=>nF(v,1)+' dB','Thấp hơn offset thực thi để chuẩn bị sớm.','choPrep')}
    ${nSl('mob','cExe','CHO: offset thực thi (CondEvent A3)',0,8,0.5,v=>nF(v,1)+' dB','','choExe')}
    ${nSel('mob','cTtt','CHO: TTT thực thi',[[40,'40 ms'],[80,'80 ms'],[160,'160 ms'],[320,'320 ms']],'','choTtt')}
    ${nSel('mob','nCand','CHO: số ô ứng viên chuẩn bị',[[1,'1'],[2,'2'],[3,'3'],[4,'4'],[8,'8']],'Nhiều ứng viên tăng báo hiệu và giữ tài nguyên ở cell đích.','choCand')}
    ${nSl('mob','l1w','LTM: cửa sổ lọc L1',10,200,10,v=>v+' ms','Ngắn: phản ứng nhanh nhưng dễ ping-pong.','ltmL1')}
    ${nSl('mob','lOff','LTM: offset chuyển cell',0,8,0.5,v=>nF(v,1)+' dB','','ltmOff')}
    <div class="c">${nChk('mob','rachless','LTM không RACH (TA lấy sớm)')}</div>
    ${nSel('mob','runs','Số lần đi',[[60,'60'],[120,'120'],[240,'240']])}
   </div></div>
   <div class="panel"><h3>Khác nhau ở đâu</h3><div class="scroll"><table class="ndtb"><thead><tr><th></th><th>Ai quyết định</th><th>Gián đoạn</th><th>Điểm mạnh</th><th>Đánh đổi</th></tr></thead><tbody>
    <tr><td>HO thường</td><td>gNB sau báo cáo A3</td><td>≈ 30–60 ms</td><td>Đơn giản</td><td>Lỗi khi tín hiệu nguồn sụt nhanh (lệnh HO không tới)</td></tr>
    <tr><td>CHO (Rel-16)</td><td>UE tự thực hiện khi điều kiện thoả</td><td>≈ 30–60 ms</td><td>Lệnh gửi sớm khi nguồn còn tốt; phục hồi nhanh sau RLF</td><td>Giữ tài nguyên ở nhiều cell, báo hiệu tăng</td></tr>
    <tr><td>DAPS (Rel-16)</td><td>gNB, UE giữ cả hai cell</td><td>≈ 0 ms</td><td>Không gián đoạn, quay lại nguồn nếu đích lỗi</td><td>UE phải hỗ trợ, hai chồng giao thức, không dùng cùng CA/DC</td></tr>
    <tr><td>LTM (Rel-18)</td><td>gNB-DU theo báo cáo L1, lệnh MAC CE</td><td>≈ 5–20 ms</td><td>Nhanh, cấu hình sẵn, có thể không RACH</td><td>Dễ ping-pong nếu lọc L1 ngắn; phạm vi trong một gNB-CU</td></tr></tbody></table></div></div>
  </div></div>`;},
 after(){this.draw(true);},
 draw(force){const k=Math.floor(NDMS.t*5);if(!force&&k===NDMS.lastDraw)return;NDMS.lastDraw=k;const s=(id,h)=>{const e=$(id);if(e)e.innerHTML=h;};s('#ndMobMap',ndMobMap());s('#ndMobPlot',ndMobPlot());s('#ndMobLog',ndMobLog());},
 tick(dt){const T=NDMS.R.ch.n*NDMS.R.ch.dt;if(!ND.pause){NDMS.t+=dt*Math.max(1,T/25);if(NDMS.t>T)NDMS.t=0;}this.draw(dt===0);},
 upd(k){if(k==='show'){this.draw(true);return;}NDMS.R=ndMobSim();const T=NDMS.R.ch.n*NDMS.R.ch.dt;if(NDMS.t>T)NDMS.t=0;const b=$('#ndMobBars');if(b)b.innerHTML=ndMobBars();if(k==='sc'){renderNd();return;}this.draw(true);},
 act(a){if(a==='play'){ND.pause=!ND.pause;const b=$('#ndMobPlay');if(b)b.textContent=ND.pause?'▶ Chạy':'⏸ Dừng';}else if(a==='rst'){NDMS.t=0;this.draw(true);}else if(a==='seed'){NDP.mob.seed++;this.upd('seed');}}
};
/* ---------- Mục 6: Tham số, KPI, lỗi ---------- */
NDP.vd={grp:'all',q:'',kf:'all'};
/* [khoá, nhóm, tên/ý nghĩa 3GPP, Huawei, Nokia, Ericsson, giá trị điển hình, cờ: c = tên thường gặp, v = cần đối chiếu theo release] */
const NDPAR=[
 ['endcAllow','Bật EN-DC','Bật EN-DC ở cell neo LTE; MME/HSS phải cho phép NR (Access Restriction Data bit "NR as secondary RAT not allowed" = 0)','NsaDcAlgoSwitch (MO NSADCMGMTCONFIG)','actEnDc / LNCEL EN-DC activation','EN-DC feature (ENodeBFunction, featureState) + EndcProfile','Bật ở cell neo có X2 tới gNB','v'],
 ['nrNbr','Bật EN-DC','Danh sách tần NR để đo B1 (MeasObjectNR: ssbFrequency, SMTC, SCS)','NRSCGFREQCONFIG (tần SCG)','NRFREQ / LNCEL nrFreqList','GUtranFreqRelation, GUtranSyncSignalFrequency','Đúng ARFCN SSB và SMTC của gNB','v'],
 ['x2anr','Bật EN-DC','Thiết lập X2 eNB–gNB tự động (ANR EN-DC) hay khai báo tay','X2 tự thiết lập qua ANR (NR neighbour ANR)','ANR EN-DC, LNADJGNB','GUtranCellRelation (ANR tạo), TermPointToGNB','Bật ANR, kiểm tra số X2 tối đa','v'],
 ['uli','Bật EN-DC','upperLayerIndication-r15 trong SIB2: báo cell neo có NR để máy hiện biểu tượng 5G','NsaDcUliSwitch / ULI trong SIB2','actUpperLayerIndication','upperLayerIndication (EUtranCellFDD)','Bật ở cell có phủ NR phía trên','v'],
 ['b1Thr','Thêm SgNB (B1)','b1-ThresholdNR-r15 (RSRP) trong ReportConfigInterRAT, sự kiện B1','NsaDcB1ThldRsrp','b1ThresholdNrRsrp','ReportConfigB1GUtra.b1ThresholdRsrp','−105 … −110 dBm','v'],
 ['hysNr','Thêm SgNB (B1)','hysteresis của B1','NsaDcB1Hyst','b1HysteresisNr','ReportConfigB1GUtra.hysteresis','1 … 2 dB','v'],
 ['tttB1','Thêm SgNB (B1)','timeToTrigger của B1','NsaDcB1TimeToTrigger','b1TimeToTriggerNr','ReportConfigB1GUtra.timeToTrigger','256 … 640 ms','v'],
 ['addProhib','Thêm SgNB (B1)','Thời gian chờ trước khi thử thêm lại SgNB sau khi xoá hoặc thất bại (theo vendor)','SgNB thêm lại: timer cấm (NsaDcMgmtConfig)','tSgNbAddRetry','EndcProfile: thời gian chờ thử lại','1 … 10 s','v'],
 ['a2Scg','Xoá và đổi SCG','A2 trên PSCell (gNB cấu hình qua SRB3 hoặc qua eNB) để xoá SgNB','NR: NsaDcScgA2RsrpThld (gNB)','a2ThresholdRsrpScg','ReportConfigA2 (NR, NRCellCU).a2ThresholdRsrp','−115 … −118 dBm','v'],
 ['a3PsCell','Xoá và đổi SCG','A3 trong NR để đổi PSCell (intra- hoặc inter-SgNB)','NR intra-freq HO A3 offset (NRCellIntraFHoMeaGrp)','a3OffsetNr','ReportConfigA3.offset (NR)','2 … 3 dB','v'],
 ['splitMode','Chia dữ liệu','Kiểu bearer và cách chia: SCG split (3x), chỉ NR, chỉ LTE','gNBPdcpParamGroup: DL split mode','dlDataSplitMode','EndcProfile: split cho phép / dlDataPathNr','Split bearer, ưu tiên NR','v'],
 ['splitRatio','Chia dữ liệu','Điều khiển luồng X2-U: Downlink Data Delivery Status (TS 38.425), bộ đệm mong muốn','Flow control X2-U (DL)','x2FlowControl','X2-U flow control (tự động)','Tự động theo bộ đệm và trễ','v'],
 ['ulPath','Chia dữ liệu','primaryPath (cellGroup) và ul-DataSplitThreshold trong PDCP-Config','UL primary path / UlDataSplitThld','ulDataSplitThreshold, ulPrimaryPath','ulDataSplitThreshold (EndcProfile)','Primary NR, ngưỡng 0 … 800 byte hoặc theo RSRP','v'],
 ['ulThr','Chia dữ liệu','Ngưỡng RSRP NR để đổi đường lên dữ liệu về LTE (tính năng vendor)','UL path switch theo RSRP NR','ulPathSwitchThreshold','uplink path switch (EndcProfile)','−110 … −112 dBm','v'],
 ['x2Lat','Chia dữ liệu','Trễ truyền dẫn X2 giữa eNB và gNB (không phải tham số; yêu cầu thiết kế)','—','—','—','< 5 ms, tối đa 10 ms cho split','c'],
 ['n310Scg','Lỗi SCG','N310 trong RLF-TimersAndConstants của SCG (SpCellConfig)','gNB: N310','n310Nr','NRCellDU / ReportConfig: n310','n10','v'],
 ['t310Scg','Lỗi SCG','T310 của SCG (ms0 … ms6000)','gNB: T310','t310Nr','t310 (NR)','1000 … 2000 ms','v'],
 ['n311Scg','Lỗi SCG','N311 của SCG','gNB: N311','n311Nr','n311 (NR)','n1','v'],
 ['maxRetx','Lỗi SCG','maxRetxThreshold của RLC AM (t1 … t32)','RlcMaxRetxThreshold (RLC parameter group)','maxRetxThreshold','RlcProfile / maxRetxThreshold','t16 … t32','v'],
 ['t304Scg','Lỗi SCG','T304 cho SCG (ReconfigurationWithSync), hết hạn → synchReconfigFailureSCG','T304 (gNB)','t304Scg','t304 (NR)','1000 … 2000 ms','v'],
 ['pdcpDup','PDCP duplication','pdcp-Duplication, moreThanOneRLC (Rel-15), moreThanTwoRLC-DRB-r16 (tối đa 4 RLC); bật/tắt bằng Duplication Activation/Deactivation MAC CE','PDCP duplication switch (URLLC)','actPdcpDuplication','pdcpDuplication (DrbRlc/QoS profile)','Chỉ cho luồng URLLC/SRB quan trọng','v'],
 ['choPrep','CHO (Rel-16)','Ngưỡng/offset để gNB chuẩn bị CHO (báo cáo đo của UE)','CHO preparation A3 offset','choPrepOffset','condHoPrepOffset','Thấp hơn offset thực thi 1 … 3 dB','v'],
 ['choExe','CHO (Rel-16)','condEventA3 (a3-Offset) trong CondTriggerConfig-r16','CHO execution A3 offset','choExecA3Offset','condHoA3Offset','3 … 5 dB','v'],
 ['choTtt','CHO (Rel-16)','timeToTrigger trong CondTriggerConfig-r16','CHO TTT','choExecTtt','condHoTimeToTrigger','80 … 160 ms','v'],
 ['choCand','CHO (Rel-16)','Số ô ứng viên trong condReconfigToAddModList (tối đa 8)','CHO max candidate cells','maxNumChoCandidates','condHoMaxCandidates','2 … 3','v'],
 ['daps','DAPS (Rel-16)','daps-Config-r16 cho DRB; UE báo intraFreqDAPS-r16 trong capability','DAPS HO switch','actDapsHo','dapsHo (feature)','Bật cho dịch vụ nhạy gián đoạn','v'],
 ['ltmL1','LTM (Rel-18)','Báo cáo đo L1 cho LTM (LTM-CSI-ReportConfig), lọc và chu kỳ','Chưa phổ biến (Rel-18)','Chưa phổ biến (Rel-18)','Chưa phổ biến (Rel-18)','Chu kỳ 20 … 80 ms','v'],
 ['ltmOff','LTM (Rel-18)','Ngưỡng gNB-DU dùng để gửi LTM Cell Switch Command MAC CE','Chưa phổ biến (Rel-18)','Chưa phổ biến (Rel-18)','Chưa phổ biến (Rel-18)','2 … 3 dB','v'],
 ['a3Off','Chuyển giao NR (SA)','a3-Offset trong ReportConfigNR cho HO thường','NRCellIntraFHoMeaGrp.IntraFreqHoA3Offset','a3OffsetIntraFreq','ReportConfigA3.offset','2 … 3 dB','v'],
 ['tttA3','Chuyển giao NR (SA)','timeToTrigger của A3','IntraFreqHoA3TimeToTrig','a3TimeToTrigger','ReportConfigA3.timeToTrigger','160 … 320 ms','v']
];
const NDKPI=[
 ['SgNB Addition Success Rate','SgNB Addition thành công (UE hoàn tất RACH vào PSCell) / SgNB Addition thử × 100','L.NsaDc.SgNB.Add.Succ / L.NsaDc.SgNB.Add.Att','EN-DC SgNB addition att/succ (LTE EN-DC counter group)','pmEndcSetupUeSucc / pmEndcSetupUeAtt','≥ 95 %','sgnb','endc4'],
 ['Tỉ lệ rớt SgNB (giải phóng bất thường)','Giải phóng SgNB bất thường (MeNB + SgNB khởi tạo) / SgNB thêm thành công × 100','L.NsaDc.SgNB.AbnormRel / L.NsaDc.SgNB.Add.Succ','EN-DC abnormal release (MeNB, SgNB)','(pmEndcRelUeAbnormalMenb + pmEndcRelUeAbnormalSgnb) / pmEndcSetupUeSucc','≤ 2 … 3 %','scg','sgnbdrop'],
 ['Lỗi SCG theo nguyên nhân','Đếm SCGFailureInformationNR theo failureType (t310, RA, RLC, synchReconfig, reconfig)','L.NsaDc.SCG.Fail.* theo cause','SCG failure per cause','pmEndcScgFailure… theo cause','Tách nguyên nhân để xử lý','scg',''],
 ['PSCell Change Success Rate','Đổi PSCell thành công / thử × 100, tách trong gNB và giữa các gNB','L.NsaDc.PSCellChg.Succ / Att','PSCell change att/succ','pmEndcPSCellChangeSuccIntraSgnb / …Att, …InterSgnb','≥ 95 %','sgnb',''],
 ['Tỉ lệ thời gian có EN-DC','Thời gian UE có SCG / thời gian UE kết nối ở cell neo × 100','L.NsaDc.SCG.Time / L.RRC.Conn.Time (quy ước)','EN-DC duration ratio','pmEndcUeDurationSum / thời gian kết nối','Theo phủ NR','sgnb',''],
 ['Phần lưu lượng qua NR','Lưu lượng NR (Secondary RAT Data Usage Report) / tổng lưu lượng UE EN-DC × 100','L.Thrp.bits.DL.NR (qua gNB) / tổng','Secondary RAT data volume','pmEndcPdcpVolDlNr / tổng','Càng cao càng tốt khi NR rảnh','arch',''],
 ['Tỉ lệ UE có khả năng EN-DC','UE báo EN-DC capable / UE kết nối ở cell neo','L.NsaDc.CapableUe','EN-DC capable UEs','pmEndcCapableUe','Theo thị phần máy 5G','arch',''],
 ['NR Handover Success Rate (SA)','Chuẩn bị thành công / thử × thực thi thành công / thử (TS 28.554)','N.HO.Prep/Exec Succ/Att','NR HO att/succ','pmHoExeSucc / pmHoExeAtt (NR)','≥ 98 %','mob','hosr5'],
 ['CHO: tỉ lệ thực thi thành công','CHO thực thi thành công / CHO thực thi thử; kèm số ô chuẩn bị trên mỗi lần thực thi','CHO exec succ/att (Rel-16 counter)','CHO execution att/succ','pmCondHoExe…','≥ 98 %, ô chuẩn bị/lần thực thi ≤ 2','mob',''],
 ['Thời gian gián đoạn chuyển giao','Từ lệnh HO tới khi có dữ liệu ở cell đích (trace UE, drive test)','Không có bộ đếm trực tiếp','—','—','HO thường 30–60 ms; DAPS ≈ 0; LTM 5–20 ms','mob',''],
 ['Quá muộn / quá sớm / ping-pong (MRO)','Phân loại RLF theo cell ngay trước và sau (TS 38.300 MRO)','HO too late/early/wrong cell','MRO counters','pmHoTooLate / TooEarly / WrongCell','Dùng cho tối ưu offset từng cặp cell','mob','hosr4'],
 ['PDCP duplication: tỉ lệ thời gian bật','Thời gian bật duplication / thời gian kết nối DRB URLLC; số gói trùng bị bỏ','Tuỳ vendor','Tuỳ vendor','Tuỳ vendor','Theo dịch vụ','dup','']
];
/* [tiêu đề, triệu chứng, nguyên nhân[], kiểm tra[], gợi ý vendor {h,n,e}, KPI liên quan] */
const NDFLT=[
 ['Máy hiện 5G nhưng tốc độ như 4G','Biểu tượng 5G có, tốc độ thấp; tỉ lệ thời gian EN-DC thấp',['ULI bật ở cell neo nhưng UE không đạt B1','Thiếu khai báo tần NR / SMTC sai','gNB khoá hoặc hết license'],['Đối chiếu ULI với phủ NR thực tế','Kiểm tra MeasObjectNR (ssbFrequency, SMTC)','Xem số lần B1 và SgNB Addition Att'],{h:'Kiểm tra NRSCGFREQCONFIG, NsaDcAlgoSwitch',n:'Kiểm tra danh sách tần NR của LNCEL',e:'Kiểm tra GUtranFreqRelation, EndcProfile'},'Tỉ lệ thời gian có EN-DC'],
 ['SgNB Addition SR thấp do không phản hồi','Nhiều SgNB Addition Request không có Ack',['X2 chưa thiết lập hoặc đứt','gNB quá tải, hết license','MTU/IPsec trên X2'],['Trạng thái liên kết X2 (SCTP)','Tải CPU/license gNB','Trace X2AP lấy cause của Reject'],{h:'Cảnh báo X2 interface fault, kiểm tra SCTPLNK',n:'Alarm X2 link, LNADJGNB',e:'TermPointToGNB operationalState'},'SgNB Addition Success Rate'],
 ['SgNB Addition SR thấp do RACH NR','Có Ack từ gNB nhưng UE không vào được PSCell',['B1 quá thấp so với giới hạn đường lên','PRACH: root sequence trùng, ZCZ nhỏ','Nhiễu đường lên NR (RSSI UL cao)'],['Phân bố RSRP NR lúc thêm','Quy hoạch PRACH, RSSI UL theo PRB','SCGFailureInformationNR cause randomAccessProblem'],{h:'Nâng NsaDcB1ThldRsrp, kiểm tra PRACH root',n:'Nâng b1ThresholdNrRsrp',e:'Nâng b1ThresholdRsrp, kiểm tra NRCellDU prachRootSequenceIndex'},'SgNB Addition Success Rate'],
 ['Rớt SgNB cao vì t310-Expiry','SCG failure cause t310 chiếm đa số',['A2 thấp, SCG được giữ tới khi mất sóng','Chồng lấn và nhiễu NR cao','Che khuất nhanh'],['Phân bố RSRP/SINR lúc lỗi','PCI mod 30, tilt','N310/T310 có quá ngắn'],{h:'Nâng ngưỡng A2 SCG',n:'Nâng a2ThresholdRsrpScg',e:'Nâng a2ThresholdRsrp NR'},'Tỉ lệ rớt SgNB'],
 ['Rớt SgNB do rlc-MaxNumRetx','Lỗi SCG ở rìa cell, khi tải lên',['Đường lên dữ liệu đi NR khi NR yếu','maxRetxThreshold nhỏ'],['Cấu hình primaryPath và ul-DataSplitThreshold','Thông lượng UL NR ở rìa'],{h:'Bật chuyển UL path theo RSRP',n:'ulPathSwitchThreshold',e:'uplink path switch trong EndcProfile'},'Tỉ lệ rớt SgNB'],
 ['Ping-pong thêm/xoá SgNB','Nhiều lần thêm rồi xoá trong vài giây',['B1 và A2 quá gần','TTT ngắn','Không có thời gian cấm thêm lại'],['Chênh lệch B1 − A2 (nên ≥ 6 dB)','Số lần thêm trên mỗi UE'],{h:'Tăng chênh lệch B1/A2, timer cấm',n:'tSgNbAddRetry',e:'Thời gian chờ thử lại trong EndcProfile'},'SgNB Addition Success Rate'],
 ['Tốc độ split bearer thấp','Có SCG nhưng tốc độ không tăng',['Trễ X2 lớn gây sắp xếp lại gói','Flow control đẩy về LTE','Bộ đệm TCP nhỏ'],['Trễ và mất gói X2-U','Tỉ lệ chia NR/LTE','Thông lượng từng nhánh'],{h:'Kiểm tra DL split mode',n:'dlDataSplitMode',e:'dlDataPathNr, split trong EndcProfile'},'Phần lưu lượng qua NR'],
 ['Mất 5G mỗi khi đổi cell LTE','EN-DC rớt sau mỗi HO LTE',['HO LTE kéo theo xoá SgNB','Không hỗ trợ giữ SgNB khi đổi MeNB','Cell neo mới thiếu khai báo NR'],['Số SgNB release cause HO','Khai báo NR ở mọi cell neo'],{h:'Kiểm tra giữ SgNB khi HO (intra-MeNB)',n:'—',e:'Kiểm tra khai báo GUtranFreqRelation ở cell đích'},'Tỉ lệ thời gian có EN-DC'],
 ['UE không bao giờ lên EN-DC','Một số dòng máy không có SgNB Addition',['Tổ hợp băng tần không có trong capability','HSS chặn NR cho thuê bao','UE tắt 5G'],['UE-MRDC-Capability','Access Restriction Data ở HSS','Lọc theo TAC'],{h:'Kiểm tra lọc UE capability',n:'—',e:'—'},'Tỉ lệ UE có khả năng EN-DC'],
 ['Đổi PSCell thất bại (T307)','synchReconfigFailureSCG cao',['A3 muộn','Lân cận NR khai sai','UE đi nhanh'],['Khai báo lân cận NR và X2 giữa gNB','TTT A3 NR'],{h:'Kiểm tra NR neighbour',n:'—',e:'NRCellRelation'},'PSCell Change Success Rate'],
 ['HO NR quá muộn ở góc phố','RLF trước khi nhận lệnh HO',['TTT dài','Offset lớn','Tín hiệu nguồn sụt nhanh'],['MRO: too late','Bản đồ RLF'],{h:'Giảm offset theo cặp cell (CIO), xem xét CHO',n:'Bật CHO',e:'CIO, condHo'},'Quá muộn / quá sớm / ping-pong (MRO)'],
 ['Ping-pong HO NR','HO qua lại dưới 1 s',['Offset nhỏ, TTT ngắn','Vùng chồng lấn rộng','LTM với lọc L1 quá ngắn'],['Tỉ lệ ping-pong','Phân bố RSRP vùng biên'],{h:'Tăng hysteresis/TTT',n:'—',e:'—'},'Quá muộn / quá sớm / ping-pong (MRO)'],
 ['CHO chiếm tài nguyên','Nhiều ô chuẩn bị nhưng ít thực thi; cell đích báo thiếu tài nguyên',['Số ứng viên lớn','Offset chuẩn bị quá thấp'],['Tỉ lệ ô chuẩn bị / lần thực thi','Tải cell đích'],{h:'Giảm số ứng viên CHO',n:'maxNumChoCandidates',e:'condHoMaxCandidates'},'CHO: tỉ lệ thực thi thành công']
];
function ndParRows(){const P=NDP.vd,q=P.q.trim().toLowerCase(),v=nVn();
  const rows=NDPAR.filter(r=>(P.grp==='all'||r[1]===P.grp)&&(!q||r.join(' ').toLowerCase().includes(q)));
  const cols=v==='3gpp'?[3,4,5]:[{huawei:3,nokia:4,ericsson:5}[v]];
  return rows.map(r=>`<tr><td><span class="chip">${nE(r[1])}</span><br>${nE(r[2])}</td>${cols.map(c=>`<td class="u3tag">${nE(r[c])}</td>`).join('')}<td>${nE(r[6])}</td><td>${r[7]==='v'?'<span class="kpC mid">Cần đối chiếu</span>':'<span class="kpC ok">Thường gặp</span>'}</td></tr>`).join('')||'<tr><td colspan="6">Không có tham số khớp.</td></tr>';}
function ndParHead(){const v=nVn();return `<tr><th>Tham số (3GPP / ý nghĩa)</th>${v==='3gpp'?'<th>Huawei</th><th>Nokia</th><th>Ericsson</th>':`<th>${nVName(v)}</th>`}<th>Điển hình</th><th>Độ tin cậy tên</th></tr>`;}
function ndKpiRows(){const v=nVn(),f=NDP.vd.kf;return NDKPI.filter(k=>f==='all'||k[6]===f).map(k=>`<tr><td><b>${nE(k[0])}</b>${k[7]&&typeof KL!=='undefined'&&KL.find(x=>x.id===k[7])?`<br><button type="button" class="u3lnkbtn" data-ndgo="kpi:${k[7]}">Mở ở thẻ KPI →</button>`:''}</td><td>${nE(k[1])}</td><td class="u3tag">${v==='3gpp'?['Huawei: '+k[2],'Nokia: '+k[3],'Ericsson: '+k[4]].map(nE).join('<br>'):nE(k[{huawei:2,nokia:3,ericsson:4}[v]])}<br><span class="kpC mid">cần đối chiếu</span></td><td>${nE(k[5])}</td><td><button type="button" class="btn sm" data-ndgo="nd:${k[6]}">Mô phỏng →</button></td></tr>`).join('');}
function ndFltHtml(){const v=nVn();return NDFLT.map(f=>`<details class="u3flt ndflt"><summary><b>${nE(f[0])}</b></summary><p class="e2d">${nE(f[1])}</p><div class="u3two"><div><b>Nguyên nhân</b><ul class="u3ul">${f[2].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div><div><b>Kiểm tra</b><ul class="u3ul">${f[3].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div></div><p class="note">${v==='3gpp'?['Huawei: '+f[4].h,'Nokia: '+f[4].n,'Ericsson: '+f[4].e].map(nE).join(' · '):nVName(v)+': '+nE(f[4][v[0]])} · KPI: ${nE(f[5])}</p></details>`).join('');}
function ndCalc(){const g=id=>{const e=$('#'+id);return e?+e.value:0;},o=$('#ndcOut');if(!o)return;
  const att=g('ndcAtt'),ok=g('ndcOk'),ab=g('ndcAb'),pa=g('ndcPa'),ps=g('ndcPs'),ts=g('ndcTs'),tc=g('ndcTc'),vn=g('ndcVn'),vl=g('ndcVl');const kv=(a,b)=>`<dt>${a}</dt><dd>${b}</dd>`;
  o.innerHTML=kv('SgNB Addition SR',att?nF(ok/att*100,2)+' %':'—')+kv('Tỉ lệ rớt SgNB',ok?nF(ab/ok*100,2)+' %':'—')+kv('PSCell Change SR',pa?nF(ps/pa*100,2)+' %':'—')+kv('Tỉ lệ thời gian EN-DC',tc?nF(ts/tc*100,1)+' %':'—')+kv('Phần lưu lượng qua NR',vn+vl?nF(vn/(vn+vl)*100,1)+' %':'—')+kv('Lỗi SCG trên mỗi giờ EN-DC',ts?nF(ab/(ts/3600),2):'—');}
NDR.vd={
 html(){const P=NDP.vd,grps=[...new Set(NDPAR.map(r=>r[1]))];
  return `<div class="panel"><h3>Bảng tham số EN-DC và di động 5G-A</h3><p class="hint">Chọn vendor ở thanh trên để chỉ hiện cột của vendor đó. Tên gắn “Cần đối chiếu” là tên thường gặp, phải kiểm tra lại theo tài liệu release đang dùng.</p>
   <div class="ctl" style="margin-bottom:10px">${nSel('vd','grp','Nhóm',[['all','Tất cả']].concat(grps.map(g=>[g,g])))}<label class="c"><span class="cl">Lọc</span><input type="search" id="ndvq" value="${nE(P.q)}" placeholder="Ví dụ: B1, T310, CHO"></label></div>
   <div class="scroll"><table class="ndtb"><thead id="ndParH">${ndParHead()}</thead><tbody id="ndParB">${ndParRows()}</tbody></table></div></div>
  <div class="panel"><h3>KPI theo dõi</h3><div class="ctl" style="margin-bottom:10px">${nSel('vd','kf','Theo mục',[['all','Tất cả']].concat(NDV.filter(v=>v[0]!=='vd').map(v=>[v[0],v[1]])))}</div>
   <div class="scroll"><table class="ndtb"><thead><tr><th>KPI</th><th>Công thức</th><th>Bộ đếm</th><th>Mục tiêu</th><th></th></tr></thead><tbody id="ndKpB">${ndKpiRows()}</tbody></table></div>
   <div class="u3calc"><b>Tính nhanh từ bộ đếm</b><div class="ctl ndcalc" style="margin-top:8px">
    ${[['ndcAtt','SgNB Addition thử',1200],['ndcOk','SgNB Addition thành công',1158],['ndcAb','Giải phóng SgNB bất thường',27],['ndcPa','Đổi PSCell thử',340],['ndcPs','Đổi PSCell thành công',331],['ndcTs','Thời gian có SCG (s)',52000],['ndcTc','Thời gian kết nối ở cell neo (s)',80000],['ndcVn','Lưu lượng NR (GB)',410],['ndcVl','Lưu lượng LTE của UE EN-DC (GB)',95]].map(r=>`<label class="c"><span class="cl">${r[1]}</span><input type="number" id="${r[0]}" value="${r[2]}" min="0"></label>`).join('')}
   </div><dl class="kv" id="ndcOut" style="margin-top:8px"></dl></div></div>
  <div class="panel"><h3>Lỗi thường gặp và cách kiểm tra</h3>${ndFltHtml()}</div>`;},
 after(){ndCalc();},
 upd(k){if(k==='grp'){const b=$('#ndParB');if(b)b.innerHTML=ndParRows();}if(k==='kf'){const b=$('#ndKpB');if(b)b.innerHTML=ndKpiRows();}}
};
document.addEventListener('input',e=>{const t=e.target;if(t.id==='ndvq'){NDP.vd.q=t.value;const b=$('#ndParB');if(b)b.innerHTML=ndParRows();}else if(t.id&&/^ndc/.test(t.id))ndCalc();});
/* ---------- Gắn thẻ vào ứng dụng: RENDER, tìm kiếm chung, liên kết E2E và KPI ---------- */
RENDER.nd=renderNd;
if(typeof qSnap==='function'){const _qn=qSnap;qSnap=function(){_qn.apply(this,arguments);if(!QS||!QS.I||QS.nd)return;QS.nd=1;
  const CAT='Thẻ NSA EN-DC và di động 5G-A';
  const keep=QS.I.filter(e=>!(e.c===CAT&&typeof e.sel==='function'));keep.seen=QS.I.seen;QS.I.length=0;keep.forEach(e=>QS.I.push(e));
  const body=$('#ndBody'),cur=ND.v;
  if(body){for(const [v,vn] of NDV){try{ND.v=v;body.innerHTML=NDR[v].html();
    body.querySelectorAll('.panel').forEach(pn=>{const h=pn.querySelector('h3'),tt=h?h.textContent:vn,txt=qText(pn).slice(0,6000);if(txt.trim().length<12)return;
      qAdd(QS.I,CAT+' · '+vn,tt,txt,1,()=>{S.tab='nd';ND.v=v;},()=>[...document.querySelectorAll('#t-nd .panel')].find(p=>{const x=p.querySelector('h3');return x&&x.textContent===tt;}));});}catch(e){console.error(e);}}
    ND.v=cur;try{if(S.tab==='nd')renderNd();else body.innerHTML='';}catch(e){}}
  const go=(v,f)=>()=>{S.tab='nd';ND.v=v;if(f)f();};
  NDPAR.forEach(r=>qAdd(QS.I,'NSA EN-DC · Tham số '+r[1],r[2],['Huawei: '+r[3],'Nokia: '+r[4],'Ericsson: '+r[5],'Điển hình: '+r[6]].join('. '),3,go('vd',()=>{NDP.vd.grp=r[1];NDP.vd.q='';}),'#ndParB'));
  NDKPI.forEach(k=>qAdd(QS.I,'NSA EN-DC · KPI',k[0],[k[1],'Huawei: '+k[2],'Nokia: '+k[3],'Ericsson: '+k[4],k[5]].join('. '),3,go('vd'),'#ndKpB'));
  NDFLT.forEach(f=>qAdd(QS.I,'NSA EN-DC · Lỗi thường gặp',f[0],[f[1],f[2].join('; '),f[3].join('; '),f[4].h,f[4].n,f[4].e].join('. '),3,go('vd'),()=>{const d=[...document.querySelectorAll('#t-nd .ndflt')].find(x=>x.querySelector('summary').textContent===f[0]);if(d)d.open=true;return d;}));
  Object.entries(NDOPT).forEach(([k,o])=>qAdd(QS.I,'NSA EN-DC · Option triển khai',o.n,o.d+' '+o.bearer+' '+o.tb.join(' '),3,go('arch',()=>{NDP.arch.opt=k;NDA.sel='';}),'#ndArchSvg'));
  Object.entries(NDSCGC).forEach(([k,c])=>qAdd(QS.I,'NSA EN-DC · Nguyên nhân lỗi SCG',c.n,c.d+' '+c.why.join('; ')+' '+c.fix.join('; '),3,go('scg',()=>{NDSC.sel=k;}),'#ndScCause'));
  NDSCH.forEach(([k,n])=>qAdd(QS.I,'NSA EN-DC · Di động 5G-A',n,'Chuyển giao, gián đoạn, HOF, ping-pong, CHO conditional handover, DAPS dual active protocol stack, LTM L1/L2 triggered mobility',2,go('mob',()=>{NDP.mob.show=k;}),'#ndMobBars'));};}
/* thẻ Toàn trình E2E: khi đang xem 5G NSA/SA có nút sang thẻ này */
const NDE2V={data:'arch',reg:'arch',ho:'mob',irat:'mob',fb:'arch',idle:'mob'};
if(typeof e2Kpi==='function'){const _kn=e2Kpi;e2Kpi=function(){_kn.apply(this,arguments);if(S.e2R!=='nsa'&&S.e2R!=='sa')return;const b=$('#e2Kpi .e2go');let v=NDE2V[S.e2Sc];if(!v)return;
  if(S.e2R==='nsa'&&S.e2Sc==='data')v='sgnb';if(S.e2R==='nsa'&&S.e2Sc==='ho')v='sgnb';
  if(b)b.insertAdjacentHTML('afterbegin',`<button type="button" class="btn sm pri" data-ndgo="nd:${v}">NSA EN-DC và di động 5G-A · ${nE((NDV.find(x=>x[0]===v)||[,''])[1])} →</button>`);};}
/* thẻ KPI: KPI liên quan có nút sang mô phỏng tương ứng */
const NDKV={endc4:'sgnb',sgnbdrop:'scg',hosr5:'mob',c5_eps:'mob'};
if(typeof kpDetHtml==='function'){const _dn=kpDetHtml;kpDetHtml=function(k){let h=_dn.apply(this,arguments);if(k&&NDKV[k.id]){const v=NDKV[k.id];h+=`<p class="u3kpl"><button type="button" class="btn sm" data-ndgo="nd:${v}">Xem mô phỏng ở thẻ NSA EN-DC và di động 5G-A · ${nE(NDV.find(x=>x[0]===v)[1])} →</button></p>`;}return h;};}

