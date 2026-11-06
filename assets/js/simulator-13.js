
/* ===== Thẻ Network slicing, QoS và tính cước (nsl) — đợt 5 lộ trình (BRIEF 21) ===== */
const NSLS={v:"arch",raf:0,last:0,pause:false,at:0,lt:0,qa:0,qs:0,sa:0,ra:0,ra2:0,ca:0,job:0};
const NSLV=[['arch','Kiến trúc slice'],['qos','QoS đầu-cuối'],['rrm','Chia tài nguyên RAN'],['pol','Chính sách và định tuyến'],['chg','Tính cước và SLA'],['vd','Tham số, KPI, lỗi']];
const NSLR={},NSLP={},NSLF={};
function nslSl(vw,k,l,mn,mx,st,f,hint,pk){NSLF[vw+':'+k]=f;const v=NSLP[vw][k];
  return `<label class="c"><span class="cl">${l}<output>${f(v)}</output></span><input type="range" data-nsli="${vw}:${k}" min="${mn}" max="${mx}" step="${st}" value="${v}">${hint?`<span class="u3ph">${hint}</span>`:''}${pk?nslPnTag(pk):''}</label>`;}
function nslSel(vw,k,l,opts,hint,pk){const v=NSLP[vw][k];
  return `<label class="c"><span class="cl">${l}</span><select data-nsli="${vw}:${k}">${opts.map(o=>`<option value="${o[0]}"${String(o[0])===String(v)?' selected':''}>${nE(o[1])}</option>`).join('')}</select>${hint?`<span class="u3ph">${hint}</span>`:''}${pk?nslPnTag(pk):''}</label>`;}
function nslChk(vw,k,l,pk){return `<label class="u3ck"><input type="checkbox" data-nsli="${vw}:${k}"${NSLP[vw][k]?' checked':''}> ${l}</label>${pk?nslPnTag(pk):''}`;}
function nslPn(key){const r=(typeof NSLPAR!=='undefined'?NSLPAR:[]).find(x=>x[0]===key);if(!r)return'';const v=nVn();if(v==='3gpp')return'';
  return nVName(v)+': '+r[{huawei:3,nokia:4,ericsson:5}[v]]+' (cần đối chiếu)';}
function nslPnTag(key){const t=nslPn(key);return t?`<span class="vh ndvh">${nE(t)}</span>`:'';}
const nslKv=(a,b)=>`<dt>${a}</dt><dd>${b}</dd>`;
const nslSet=(id,h)=>{const e=document.getElementById(id);if(e)e.innerHTML=h;};
const nslOk=(b,t)=>`<span class="kpC ${b?'ok':'no'}">${t||(b?'Đạt':'Không đạt')}</span>`;
const nslMs=x=>!isFinite(x)?'—':x>=1000?nF(x/1000,2)+' s':nF(x,x<10?2:x<100?1:0)+' ms';
const nslMb=x=>x>=1000?nF(x/1000,2)+' Gbit/s':nF(x,x<10?2:x<100?1:0)+' Mbit/s';
function nslPct(a,p){if(!a.length)return 0;const b=a.slice().sort((x,y)=>x-y),i=nC(Math.ceil(b.length*p)-1,0,b.length-1);return b[i];}
function nslNrb(bw){return (typeof NRB!=='undefined'&&NRB[30]&&NRB[30][bw])||Math.floor(bw*1000/360*0.98);}
/* danh mục slice dùng chung cho cả thẻ */
const NSLSL={
 emb:{n:'eMBB',l:'eMBB phổ thông',sst:1,sd:'',c:'var(--nr)',q:'9, 8'},
 url:{n:'URLLC',l:'URLLC nhà máy',sst:2,sd:'0000A1',c:'var(--warn)',q:'82, 83'},
 mtc:{n:'mMTC',l:'mMTC đo đếm',sst:3,sd:'000010',c:'var(--k1)',q:'9 (ưu tiên thấp)'},
 fwa:{n:'FWA',l:'FWA hộ gia đình',sst:1,sd:'00F0A0',c:'var(--lte)',q:'8, 9'},
 v2x:{n:'V2X',l:'V2X xe kết nối',sst:4,sd:'000001',c:'var(--acc)',q:'79, 83, 86'}
};
const NSLSK=Object.keys(NSLSL),NSLK4=['emb','url','mtc','fwa'];
const nslSn=k=>{const s=NSLSL[k];return 'SST '+s.sst+(s.sd?' · SD '+s.sd:'');};
const nslDot=k=>`<i class="nsldot" style="background:${NSLSL[k].c}"></i>`;

/* ---------- Mục 1: kiến trúc slice ---------- */
const NSLSST={1:'eMBB (băng rộng)',2:'URLLC (siêu tin cậy, trễ thấp)',3:'MIoT (IoT số lượng lớn)',4:'V2X (xe kết nối)',5:'HMTC (MTC hiệu năng cao, Rel-17)',6:'HDLLC (dữ liệu cao, trễ thấp, Rel-18)',128:'Giá trị riêng của nhà mạng (128–255)'};
const NSLRC=['#0 · không có trong PLMN/SNPN hiện tại','#1 · không có trong vùng đăng ký hiện tại','#2 · NSSAA thất bại hoặc bị thu hồi','#3 · đã đạt số UE tối đa của slice (NSAC)'];
const NSLAMFA=['emb','mtc','fwa'];
NSLP.arch={sst:1,sd:'00000A',map:0,hsst:1,hsd:'000001',aa:'ok',nsac:0,intent:'url',slr:1,rap:1,nest:'url',life:0,
 rq_emb:1,rq_url:1,rq_mtc:0,rq_fwa:0,rq_v2x:1,sub_emb:1,sub_url:1,sub_mtc:1,sub_fwa:0,sub_v2x:0,ta_emb:1,ta_url:1,ta_mtc:1,ta_fwa:1,ta_v2x:0};
function nslNssai(){const P=NSLP.arch;let rq=NSLSK.filter(k=>P['rq_'+k]);const al=[],rj=[],pd=[];let def=false;
  if(!rq.length){def=true;}
  rq.forEach(k=>{if(!P['sub_'+k])rj.push([k,0]);else if(!P['ta_'+k])rj.push([k,1]);else if(k==='url'&&P.nsac)rj.push([k,3]);
    else if(k==='url'&&P.aa!=='off'){if(P.aa==='fail')rj.push([k,2]);else if(P.aa==='pend')pd.push(k);else al.push(k);}else al.push(k);});
  if(!al.length&&!pd.length&&P.sub_emb&&P.ta_emb&&!al.includes('emb')&&!rj.some(r=>r[0]==='emb'&&r[1]>0)){al.push('emb');def=true;}
  const rr=al.concat(pd).some(k=>!NSLAMFA.includes(k));
  return {rq,al,rj,pd,def,rr,r62:!al.length&&!pd.length};}
function nslEnc(){const P=NSLP.arch,ok=x=>/^[0-9A-Fa-f]{6}$/.test(x),sd=ok(P.sd)?P.sd.toUpperCase():'',hs=ok(P.hsd)?P.hsd.toUpperCase():'';
  const h2=v=>(v&255).toString(16).toUpperCase().padStart(2,'0'),b=[['SST',h2(P.sst)]];
  if(sd)b.push(['SD',sd.slice(0,2)],['SD',sd.slice(2,4)],['SD',sd.slice(4,6)]);
  if(P.map){b.push(['SST HPLMN',h2(P.hsst)]);if(sd&&hs)b.push(['SD HPLMN',hs.slice(0,2)],['SD HPLMN',hs.slice(2,4)],['SD HPLMN',hs.slice(4,6)]);}
  return {sd,hs,b,bad:P.sd&&!sd};}
function nslEncHtml(){const E=nslEnc(),P=NSLP.arch;
  return `<div class="nslbytes"><span class="nslby nsll"><small>Độ dài</small>${E.b.length}</span>${E.b.map(x=>`<span class="nslby${x[0].includes('HPLMN')?' nslh':''}"><small>${x[0]}</small>${x[1]}</span>`).join('')}</div>
   <dl class="kv">${nslKv('Giá trị','SST '+P.sst+' = '+nE(NSLSST[P.sst]||'')+(E.sd?', SD 0x'+E.sd:', không có SD (chỉ dùng được một slice cho mỗi SST)'))
   +nslKv('Mã hoá IE S-NSSAI','TS 24.501 §9.11.2.8: độ dài 1 (SST), 2 (SST + SST HPLMN), 4 (SST + SD), 5 (SST + SD + SST HPLMN) hoặc 8 (đủ cả SD HPLMN). Ở NGAP và SBI, S-NSSAI là cặp {sst, sd}.')
   +nslKv('Khi chuyển vùng',P.map?'UE ở mạng khách: S-NSSAI của VPLMN đi kèm giá trị ánh xạ về HPLMN để SMF/UDM nhà ánh xạ đúng thuê bao.':'Ở mạng nhà: không cần giá trị ánh xạ.')}</dl>${E.bad?'<p class="note lbbad">SD phải đúng 6 chữ số hex; đang bỏ qua SD.</p>':''}`;}
function nslNssaiHtml(){const P=NSLP.arch,R=nslNssai(),st=k=>{if(R.al.includes(k))return '<span class="kpC ok">Allowed</span>';if(R.pd.includes(k))return '<span class="kpC mid">Pending (chờ NSSAA)</span>';
   const j=R.rj.find(r=>r[0]===k);return j?`<span class="lbbad">Rejected ${nE(NSLRC[j[1]])}</span>`:'<span class="note">—</span>';};
  const ck=(k,p)=>`<input type="checkbox" aria-label="${p} ${NSLSL[k].n}" data-nsli="arch:${p}_${k}"${P[p+'_'+k]?' checked':''}>`;
  return `<div class="scroll"><table class="ndtb"><thead><tr><th>Slice</th><th>S-NSSAI</th><th>UE xin (Requested)</th><th>Thuê bao UDM (Subscribed)</th><th>TA hiện tại hỗ trợ</th><th>Kết quả</th></tr></thead><tbody>
   ${NSLSK.map(k=>`<tr><td>${nslDot(k)}${nE(NSLSL[k].l)}</td><td class="u3tag">${nslSn(k)}</td><td>${ck(k,'rq')}</td><td>${ck(k,'sub')}</td><td>${ck(k,'ta')}</td><td>${st(k)}</td></tr>`).join('')}</tbody></table></div>`;}
function nslNssaiOut(){const R=nslNssai(),n=a=>a.length?a.map(k=>NSLSL[k].n).join(', '):'(trống)';
  return `<dl class="kv">${nslKv('Configured NSSAI','Do mạng gửi trong Registration Accept hoặc Configuration Update; UE dùng để tạo Requested NSSAI lần sau (tối đa 16 S-NSSAI).')
   +nslKv('Requested NSSAI',R.def&&!R.rq.length?'UE không gửi → AMF dùng S-NSSAI mặc định của thuê bao':n(R.rq))
   +nslKv('Allowed NSSAI',`<b>${n(R.al)}</b>${R.def&&R.al.length?' (lấy S-NSSAI mặc định của thuê bao)':''} · tối đa 8 S-NSSAI, có hiệu lực trong vùng đăng ký`)
   +nslKv('Rejected NSSAI',R.rj.length?R.rj.map(r=>NSLSL[r[0]].n+' '+NSLRC[r[1]].split(' · ')[0]).join(', '):'(trống)')
   +nslKv('Pending NSSAI (Rel-17)',n(R.pd))
   +nslKv('Kết quả đăng ký',R.r62?'<span class="lbbad">Registration Reject #62 (No network slices available)</span>':'<span class="lbgood">Registration Accept</span>')
   +nslKv('AMF',R.r62?'—':R.rr?'AMF ban đầu (set A) không phục vụ URLLC/V2X → NSSF trả AMF set B → <b>đổi AMF</b> (Reroute NAS qua gNB hoặc chuyển thẳng)':'AMF ban đầu (set A) phục vụ được mọi slice được phép, không cần đổi')}</dl>`;}
/* sơ đồ NSSF chọn AMF set */
const NSLNP={ue:[50,150,'UE'],gnb:[165,150,'gNB'],amfa:[320,80,'AMF set A'],udm:[505,40,'UDM'],nssf:[505,132,'NSSF'],amfb:[320,232,'AMF set B'],nrf:[505,224,'NRF']};
function nslRoute(){const R=nslNssai();
  const p=[['ue','gnb','RRCSetupComplete + Registration Request (Requested NSSAI)'],['gnb','amfa','Initial UE Message: gNB chọn AMF theo NSSAI ở tầng AS'],['amfa','udm','Nudm_SDM_Get: Subscribed S-NSSAIs'],['udm','amfa','S-NSSAI thuê bao, đánh dấu mặc định'],
   ['amfa','nssf','Nnssf_NSSelection_Get (Requested, Subscribed, TAI)'],['nssf','amfa',R.r62?'Không có S-NSSAI được phép':R.rr?'Allowed NSSAI + AMF set B (+ NRF của set)':'Allowed NSSAI, AMF hiện tại phù hợp']];
  if(!R.r62&&R.rr)p.push(['amfa','nrf','Nnrf_NFDiscovery: tìm AMF trong set B'],['nrf','amfa','Danh sách AMF set B'],['amfa','gnb','Reroute NAS Request (AMF Set ID)'],['gnb','amfb','Initial UE Message tới AMF set B'],['amfb','gnb','Registration Accept (qua gNB)'],['gnb','ue','Registration Accept: Allowed / Rejected / Pending NSSAI']);
  else p.push(['amfa','gnb',R.r62?'Registration Reject #62':'Registration Accept'],['gnb','ue',R.r62?'Registration Reject #62 (Rejected NSSAI kèm cause)':'Registration Accept: Allowed / Rejected / Pending NSSAI']);
  return p;}
function nslRouteSvg(){const R=nslNssai(),p=nslRoute(),used=new Set();p.forEach(x=>{used.add(x[0]+'-'+x[1]);used.add(x[1]+'-'+x[0]);});let s='';
  [['ue','gnb'],['gnb','amfa'],['gnb','amfb'],['amfa','udm'],['amfa','nssf'],['amfa','nrf'],['amfb','nssf']].forEach(([a,b])=>{const A=NSLNP[a],B=NSLNP[b],on=used.has(a+'-'+b);
    s+=`<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" style="stroke:${on?'var(--up)':'var(--line)'};stroke-width:${on?2:1.2};${on?'':'stroke-dasharray:4 4'}"/>`;});
  Object.entries(NSLNP).forEach(([k,n])=>{const hi=(k==='amfb'&&R.rr&&!R.r62)||k==='nssf';
    s+=`<rect x="${n[0]-44}" y="${n[1]-16}" width="88" height="32" rx="7" style="fill:var(--panel);stroke:${hi?'var(--warn)':'var(--line)'};stroke-width:${hi?2:1.2}"/><text x="${n[0]}" y="${n[1]+4}" class="sftx" text-anchor="middle">${n[2]}</text>`;});
  s+=`<text x="320" y="122" class="sfsm" text-anchor="middle">eMBB · mMTC · FWA</text><text x="320" y="274" class="sfsm" text-anchor="middle">URLLC · V2X</text>`;
  s+=`<circle id="nslRDot" r="6" cx="-20" cy="-20" style="fill:var(--warn)"/>`;
  return `<svg viewBox="0 0 600 290" class="u3svg nslsvg" role="img" aria-label="NSSF chọn AMF set">${s}</svg>`;}
/* slice ở RAN Rel-17 */
const NSLFQ=[['n78','n78 · 3500 MHz',5,{url:7,emb:5,fwa:4}],['n41','n41 · 2600 MHz',4,{fwa:6,emb:4}],['n28','n28 · 700 MHz',3,{mtc:6,v2x:5,emb:3}]];
const NSLNSAG={url:1,emb:2,mtc:3,fwa:4,v2x:5};
function nslRanOut(){const P=NSLP.arch,k=P.intent,g=NSLNSAG[k];let best=null;
  if(P.slr)NSLFQ.forEach(f=>{const pr=f[3][k];if(pr!=null&&(!best||pr>best[1]))best=[f,pr];});
  const ch=best?best[0]:NSLFQ.slice().sort((a,b)=>b[2]-a[2])[0],rach=P.rap&&ch[3][k]!=null;
  const rows=NSLFQ.map(f=>`<tr${f===ch?' class="nslhl"':''}><td>${nE(f[1])}</td><td>${f[2]}</td>${NSLSK.map(s=>`<td>${f[3][s]!=null?f[3][s]:'—'}</td>`).join('')}</tr>`).join('');
  return `<div class="scroll"><table class="ndtb"><thead><tr><th>Tần số</th><th>Ưu tiên chung</th>${NSLSK.map(s=>`<th>${nslDot(s)}NSAG ${NSLNSAG[s]} · ${NSLSL[s].n}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>
  <dl class="kv">${nslKv('UE chọn lại cell',`<b>${nE(ch[1])}</b>: ${best?'ưu tiên theo slice (FreqPriorityListSlicing, SIB16) cho NSAG '+g+' = '+best[1]:'dùng cellReselectionPriority chung vì '+(P.slr?'không tần số nào khai báo NSAG này':'cell không phát thông tin slice')}`)
   +nslKv('Truy nhập ngẫu nhiên',rach?`Preamble riêng của NSAG ${g} (FeatureCombinationPreambles-r17 có nsag-List): gNB biết slice ngay từ Msg1, ưu tiên Msg2/Msg3 và giãn back-off riêng khi slice khác tắc`:'Dùng chung preamble với mọi slice: gNB chỉ biết slice sau khi nhận NSSAI ở RRCSetupComplete')
   +nslKv('Phía gNB','NG Setup báo TAI Slice Support List; gNB chọn AMF theo NSSAI trong RRCSetupComplete; mọi phiên PDU mang S-NSSAI để áp RRM policy (mục 3)')}</dl>`;}
/* quản lý slice: GST/NEST và vòng đời */
const NSLNEST={
 emb:{n:'eMBB đô thị',a:[['Vùng phục vụ','Toàn quốc'],['Số UE tối đa','2 000 000'],['Thông lượng DL mỗi UE','≥ 50 Mbit/s giờ bận'],['Trễ người dùng','≤ 30 ms'],['Độ sẵn sàng','99,9 %'],['Cô lập','Logic, dùng chung tài nguyên'],['5QI','9, 8']],ran:'RRM policy min 30 %, max 100 %',cn:'AMF set A, SMF/UPF trung tâm, NSACF không giới hạn',tn:'VPN L3 dùng chung, lớp best effort'},
 url:{n:'URLLC nhà máy',a:[['Vùng phục vụ','Khuôn viên nhà máy (2 TA)'],['Số UE tối đa','500'],['Thông lượng mỗi UE','2–10 Mbit/s đảm bảo'],['Trễ người dùng','≤ 10 ms, p99,999'],['Độ tin cậy','99,999 %'],['Cô lập','Tài nguyên PRB dành riêng, UPF riêng tại chỗ'],['5QI','82, 83']],ran:'RRM policy dedicated 10 %, min 20 %, max 40 %',cn:'AMF set B, SMF và UPF edge tại nhà máy, NSACF 500 UE',tn:'VLAN/SR policy riêng, lớp EF, đường ngắn nhất'},
 mtc:{n:'mMTC đồng hồ điện nước',a:[['Vùng phục vụ','Toàn quốc'],['Số UE tối đa','5 000 000'],['Thông lượng mỗi UE','< 100 kbit/s'],['Trễ người dùng','≤ 10 s'],['Độ sẵn sàng','99,5 %'],['Cô lập','Logic'],['5QI','9 ưu tiên thấp']],ran:'RRM policy max 10 % để không lấn eMBB',cn:'AMF set A, SMF/UPF IoT, NEF cho Non-IP',tn:'VPN L3 dùng chung'},
 fwa:{n:'FWA hộ gia đình',a:[['Vùng phục vụ','Các quận phủ n41/n78'],['Số UE tối đa','200 000 CPE'],['Thông lượng mỗi hộ','≥ 100 Mbit/s giờ bận'],['Trễ người dùng','≤ 30 ms'],['Độ sẵn sàng','99,9 %'],['Cô lập','Logic, có hạn mức tối đa'],['5QI','8, 9']],ran:'RRM policy min 20 %, max 50 %',cn:'AMF set A, UPF vùng gần IXP',tn:'VPN L3, chính sách băng thông theo hộ'}
};
const NSLLIFE=[['Chuẩn bị','Thiết kế NEST từ GST (GSMA NG.116), kiểm tra khả năng phục vụ, ước tài nguyên'],['Đặt hàng','CSMF nhận yêu cầu dịch vụ (ServiceProfile, TS 28.541); NSMF tạo NSI và chia SliceProfile cho từng miền'],
 ['Cấu hình','NSSMF RAN: S-NSSAI ở cell và TA, RRM policy · NSSMF lõi: NSSF, AMF/SMF/UPF, NSACF · NSSMF truyền dẫn: VLAN, SR policy, QoS'],['Kích hoạt','Thêm S-NSSAI vào thuê bao UDM, quy tắc URSP ở PCF, hồ sơ cước ở CHF'],
 ['Vận hành','Giám sát KPI theo slice (TS 28.552/28.554), NWDAF phân tích tải slice, tự điều chỉnh RRM policy và NSACF'],['Ngừng','Gỡ S-NSSAI khỏi thuê bao và TA, giải phóng tài nguyên, đóng hồ sơ cước']];
function nslNestHtml(){const P=NSLP.arch,N=NSLNEST[P.nest];
  return `<div class="cols"><div><div class="scroll"><table class="ndtb"><thead><tr><th colspan="2">NEST «${nE(N.n)}»</th></tr></thead><tbody>${N.a.map(r=>`<tr><td>${nE(r[0])}</td><td>${nE(r[1])}</td></tr>`).join('')}</tbody></table></div></div>
   <div><dl class="kv">${nslKv('SliceProfile RAN',nE(N.ran))+nslKv('SliceProfile lõi',nE(N.cn))+nslKv('SliceProfile truyền dẫn',nE(N.tn))}</dl>
   <div class="nsllife">${NSLLIFE.map((l,i)=>`<span class="${i===P.life?'on':i<P.life?'done':''}">${i+1}. ${nE(l[0])}</span>`).join('')}</div>
   <p class="e2d"><b>${nE(NSLLIFE[P.life][0])}:</b> ${nE(NSLLIFE[P.life][1])}</p>
   <div class="row"><button type="button" class="btn sm" data-nsla="arch:life|-1">◀ Bước trước</button><button type="button" class="btn sm" data-nsla="arch:life|1">Bước sau ▶</button></div></div></div>`;}
function nslMgmtSvg(){const B=[[210,20,'CSMF','yêu cầu dịch vụ'],[210,90,'NSMF','NSI, SliceProfile'],[50,170,'NSSMF RAN','RRM policy'],[210,170,'NSSMF lõi','NSSF, SMF, UPF'],[370,170,'NSSMF truyền dẫn','VLAN, SR']];let s='';
  [[1,2],[1,3],[1,4],[0,1]].forEach(([a,b])=>{s+=`<line x1="${B[a][0]+60}" y1="${B[a][1]+40}" x2="${B[b][0]+60}" y2="${B[b][1]}" style="stroke:var(--line);stroke-width:1.4"/>`;});
  B.forEach((b,i)=>{const on=(NSLP.arch.life===1&&i<2)||(NSLP.arch.life===2&&i>=2)||(NSLP.arch.life===4&&i===1);s+=`<rect x="${b[0]}" y="${b[1]}" width="120" height="40" rx="7" style="fill:var(--panel);stroke:${on?'var(--warn)':'var(--line)'};stroke-width:${on?2:1.2}"/><text x="${b[0]+60}" y="${b[1]+17}" class="sftx" text-anchor="middle">${b[2]}</text><text x="${b[0]+60}" y="${b[1]+32}" class="sfsm" text-anchor="middle">${b[3]}</text>`;});
  return `<svg viewBox="40 10 460 210" class="u3svg nslsvg" style="max-width:560px" role="img" aria-label="Quản lý slice CSMF NSMF NSSMF">${s}</svg>`;}
NSLR.arch={
 html(){const P=NSLP.arch;
  return `${typeof lte==='function'&&lte()?'<p class="note">Đang ở chế độ 4G: EPC chỉ có DCN (Dedicated Core Network) và chọn theo APN/QCI; network slicing với S-NSSAI là của 5GC (Rel-15 trở đi). Thẻ trình bày 5G SA.</p>':''}
  <div class="panel"><h3>S-NSSAI: SST và SD</h3><div class="ctl">${nslSel('arch','sst','SST (loại slice)',Object.entries(NSLSST).map(([k,v])=>[+k,k+' · '+v]),'','sst')}
   <label class="c"><span class="cl">SD (6 chữ số hex, để trống nếu không dùng)</span><input type="text" id="nslSd" value="${nE(P.sd)}" maxlength="6" spellcheck="false" autocomplete="off"></label>
   ${nslChk('arch','map','UE đang chuyển vùng (kèm S-NSSAI ánh xạ HPLMN)')}</div><div id="nslEnc">${nslEncHtml()}</div>
   <p class="note">SST 1–6 do 3GPP chuẩn hoá (TS 23.501 §5.15.2.2), 128–255 nhà mạng tự đặt. SD phân biệt nhiều slice cùng SST, ví dụ hai doanh nghiệp cùng dùng SST 1.</p></div>
  <div class="panel"><h3>NSSAI cấu hình, xin, được phép và bị từ chối</h3><p class="hint">Tích ô để đổi điều kiện; AMF xét từng S-NSSAI theo thuê bao, vùng đăng ký, NSSAA và NSAC.</p>
   <div class="ctl" style="margin-bottom:8px">${nslSel('arch','aa','NSSAA cho slice URLLC',[['off','Không yêu cầu'],['ok','Yêu cầu, EAP thành công'],['pend','Yêu cầu, đang chờ (Pending NSSAI)'],['fail','Yêu cầu, EAP thất bại']],'','nssaa')}${nslChk('arch','nsac','NSACF: slice URLLC đã đủ số UE tối đa','nsac')}</div>
   <div id="nslNssT">${nslNssaiHtml()}</div><div id="nslNssO">${nslNssaiOut()}</div>
   <p class="note">Xác thực theo slice (NSSAA, EAP qua NSSAAF tới AAA-S của doanh nghiệp) chạy sau xác thực chính 5G-AKA; xem <button type="button" class="u3lnkbtn" data-scgo="sc:aka">5G-AKA, EAP-AKA′ ở thẻ Bảo mật</button> và ladder NSSAA ở mục 4.</p></div>
  <div class="panel"><h3>NSSF chọn slice và AMF set</h3><div class="row">${nslPlayBtn('arch','nslAPlay')}</div><div class="scroll"><div class="nslw" id="nslRFig">${nslRouteSvg()}</div></div><p class="e2d" id="nslRCap"></p></div>
  <div class="panel"><h3>Slice ở RAN (Rel-17): chọn lại cell và RACH theo slice</h3><div class="ctl">${nslSel('arch','intent','Slice UE định dùng',NSLSK.map(k=>[k,NSLSL[k].l]))}${nslChk('arch','slr','Cell phát thông tin slice (SIB16, TS 38.331)','slr')}${nslChk('arch','rap','RACH phân vùng theo NSAG','rap')}</div>
   <div id="nslRan">${nslRanOut()}</div><p class="note">NSAG (Network Slice AS Group) gom các S-NSSAI để tầng AS biết slice mà không lộ S-NSSAI trong bản tin quảng bá. Thứ tự xét: TS 38.304 §5.2.4.11.</p></div>
  <div class="panel"><h3>Quản lý slice: NSMF/NSSMF, GST/NEST</h3><div class="seg u3seg sfsub" role="group" aria-label="Mẫu NEST">${NSLK4.map(k=>`<button type="button" data-nsla="arch:nest|${k}" aria-pressed="${k===P.nest}">${nE(NSLNEST[k].n)}</button>`).join('')}</div>
   <div class="scroll"><div class="nslw" id="nslMg">${nslMgmtSvg()}</div></div><div id="nslNest">${nslNestHtml()}</div>
   <p class="note">Mô hình quản lý theo TS 28.530/28.531/28.541 (ServiceProfile, SliceProfile, RRMPolicyRatio); GST/NEST theo GSMA NG.116.</p></div>`;},
 after(){},
 upd(k){if(['sst','map'].includes(k))nslSet('nslEnc',nslEncHtml());
  if(/^(rq|sub|ta)_|^(aa|nsac)$/.test(k)){nslSet('nslNssT',nslNssaiHtml());nslSet('nslNssO',nslNssaiOut());nslSet('nslRFig',nslRouteSvg());NSLS.at=0;}
  if(['intent','slr','rap'].includes(k))nslSet('nslRan',nslRanOut());},
 tick(dt){const p=nslRoute(),n=p.length;if(!NSLS.pause)NSLS.at=(NSLS.at+dt/(n*1.1))%1;
  const f=NSLS.at*n,i=Math.min(n-1,Math.floor(f)),u=f-i,A=NSLNP[p[i][0]],B=NSLNP[p[i][1]],d=document.getElementById('nslRDot');
  if(d){d.setAttribute('cx',A[0]+(B[0]-A[0])*u);d.setAttribute('cy',A[1]+(B[1]-A[1])*u);}
  const c=document.getElementById('nslRCap');if(c){const t=`Bước ${i+1}/${n}: ${A[2]} → ${B[2]} · ${p[i][2]}`;if(c.textContent!==t)c.textContent=t;}},
 act(a){const P=NSLP.arch,[k,v]=a.split('|');
  if(k==='play')nslPlayTog('nslAPlay');
  else if(k==='nest'){P.nest=v;renderNsl();}
  else if(k==='life'){P.life=(P.life+(+v)+NSLLIFE.length)%NSLLIFE.length;nslSet('nslNest',nslNestHtml());nslSet('nslMg',nslMgmtSvg());}}
};

/* ---------- Mục 2: QoS đầu-cuối ---------- */
/* 5QI chuẩn hoá: [5QI, loại G/N/D, mức ưu tiên, PDB ms, PER, MDBV byte, ví dụ, QCI tương ứng] — TS 23.501 Bảng 5.7.4-1 */
const NSLQI=[
 [1,'G',20,100,'10⁻²','','Thoại hội thoại (VoNR, VoLTE)',1],[2,'G',40,150,'10⁻³','','Video hội thoại trực tiếp',2],[3,'G',30,50,'10⁻³','','Game thời gian thực, V2X, giám sát tự động hoá',3],
 [4,'G',50,300,'10⁻⁶','','Video không hội thoại (có đệm)',4],[65,'G',7,75,'10⁻²','','Thoại MC-PTT',65],[66,'G',20,100,'10⁻²','','Thoại PTT không nhiệm vụ',66],[67,'G',15,100,'10⁻³','','Video nhiệm vụ (MC video)',67],
 [71,'G',56,150,'10⁻⁶','','Truyền trực tiếp UL (camera)',''],[72,'G',56,300,'10⁻⁴','','Truyền trực tiếp UL',''],[73,'G',56,300,'10⁻⁸','','Truyền trực tiếp UL độ tin cậy cao',''],[74,'G',56,500,'10⁻⁸','','Truyền trực tiếp UL',''],[76,'G',56,500,'10⁻⁴','','Truyền trực tiếp UL',''],
 [5,'N',10,100,'10⁻⁶','','Báo hiệu IMS (SIP)',5],[6,'N',60,300,'10⁻⁶','','Video có đệm, ứng dụng TCP (web, email)',6],[7,'N',70,100,'10⁻³','','Thoại, video trực tiếp, game tương tác',7],
 [8,'N',80,300,'10⁻⁶','','Video có đệm, TCP (thuê bao ưu tiên)',8],[9,'N',90,300,'10⁻⁶','','Mặc định: web, tải tệp, video có đệm',9],[69,'N',5,60,'10⁻⁶','','Báo hiệu MC-PTT',69],[70,'N',55,200,'10⁻⁶','','Dữ liệu nhiệm vụ',70],
 [79,'N',65,50,'10⁻²','','Bản tin V2X',79],[80,'N',68,10,'10⁻⁶','','eMBB trễ thấp, AR',80],
 [82,'D',19,10,'10⁻⁴',255,'Tự động hoá rời rạc (điều khiển chuyển động)',''],[83,'D',22,10,'10⁻⁴',1354,'Tự động hoá rời rạc, V2X đoàn xe',''],[84,'D',24,30,'10⁻⁵',1354,'Hệ thống giao thông thông minh',''],
 [85,'D',21,5,'10⁻⁵',255,'Phân phối điện cao thế',''],[86,'D',18,5,'10⁻⁴',1354,'V2X tránh va chạm','']];
const NSLQT={G:'GBR',N:'Non-GBR',D:'Delay-critical GBR'};
/* luồng mô phỏng: k, tên, 5QI, loại, mức ưu tiên, PDB, tốc độ Mbit/s, GFBR, độ dao động, số UE, màu */
const NSLQF=[
 {k:'ur',n:'Điều khiển robot',q:82,t:'D',p:19,pdb:10,r:6,g:6,b:0.1,u:4,c:'var(--warn)'},
 {k:'vo',n:'Thoại VoNR (20 UE)',q:1,t:'G',p:20,pdb:100,r:1.0,g:1.0,b:0.15,u:20,c:'var(--k1)'},
 {k:'gm',n:'Game thời gian thực',q:3,t:'G',p:30,pdb:50,r:12,g:8,b:0.4,u:6,c:'var(--acc)'},
 {k:'vd',n:'Video trực tiếp',q:2,t:'G',p:40,pdb:150,r:60,g:40,b:0.5,u:5,c:'var(--lte)'},
 {k:'wb',n:'Web, ứng dụng',q:8,t:'N',p:80,pdb:300,r:90,g:0,b:0.8,u:30,c:'var(--nr)'},
 {k:'be',n:'Tải tệp nền',q:9,t:'N',p:90,pdb:300,r:180,g:0,b:0.5,u:25,c:'var(--muted)'}];
NSLP.qos={f:'all',bw:100,se:4,ld:150,mode:'q',dr1:0,map:'11',rq:1,an:30,ap:6,apc:1};
function nslQSim(mode,dr1){const P=NSLP.qos,nrb=nslNrb(P.bw),bpp=P.se*180,N=4000,F=NSLQF,nf=F.length,rnd=nRng(11+P.bw*7+Math.round(P.se*13)+P.ld*3);
  const Q=F.map(()=>[]),H=F.map(()=>0),tok=F.map(()=>0),al=new Float32Array(N*nf),R=F.map(()=>({arr:0,sv:0,dl:[],miss:0}));const fifo=[];let fh=0;
  const rate=F.map(f=>f.r*(f.t==='N'?P.ld/100:1)*500);/* bit mỗi khe 0,5 ms */
  const done=(i,pk,s)=>{const d=(s-pk.t+1)*0.5+0.5;R[i].dl.push(d);if(d>F[i].pdb)R[i].miss++;};
  const serve=(i,bits,s)=>{let used=0;const q=Q[i];while(bits>1e-9&&H[i]<q.length){const pk=q[H[i]],x=Math.min(pk.r,bits);pk.r-=x;bits-=x;used+=x;if(pk.r<=1e-9){H[i]++;done(i,pk,s);}}
    if(H[i]>512){q.splice(0,H[i]);H[i]=0;}R[i].sv+=used;return used;};
  const back=i=>{let b=0;const q=Q[i];for(let j=H[i];j<q.length;j++)b+=q[j].r;return b;};
  for(let s=0;s<N;s++){
    F.forEach((f,i)=>{let b;if(f.k==='vo')b=(s%40===i)?rate[i]*40:0;else if(f.k==='ur')b=(s%2===0)?rate[i]*2:0;else b=rate[i]*Math.max(0,1+f.b*nGs(rnd));
      if(b>0){const pk={t:s,r:b,i};Q[i].push(pk);if(dr1)fifo.push(pk);R[i].arr+=b;}tok[i]=Math.min(tok[i]+f.g*500,f.g*500*40);});
    let bud=nrb*bpp;const use=F.map(()=>0);
    if(dr1){/* một DRB chung: gNB không phân biệt luồng, phục vụ theo thứ tự đến */
      while(bud>1e-9&&fh<fifo.length){const pk=fifo[fh],x=Math.min(pk.r,bud);pk.r-=x;bud-=x;use[pk.i]+=x;R[pk.i].sv+=x;if(pk.r<=1e-9){fh++;done(pk.i,pk,s);}}
      if(fh>2048){fifo.splice(0,fh);fh=0;}}
    else{
      if(mode==='q'){const ord=F.map((f,i)=>i).filter(i=>F[i].t!=='N').sort((a,b)=>F[a].p-F[b].p);
        for(const i of ord){if(bud<=0)break;const lim=F[i].t==='D'?bud:Math.min(bud,tok[i]);const x=serve(i,lim,s);tok[i]=Math.max(0,tok[i]-x);use[i]+=x;bud-=x;}}
      /* phần còn lại: water-filling theo trọng số (PF theo UE; chế độ QoS nhân thêm trọng số mức ưu tiên) */
      let act=F.map((f,i)=>i).filter(i=>H[i]<Q[i].length);const B=F.map((f,i)=>act.includes(i)?back(i):0);
      for(let it=0;it<6&&act.length&&bud>1e-9;it++){const w=act.map(i=>F[i].u*(mode==='q'?Math.max(1,(100-F[i].p)/10):1)),W=w.reduce((a,b)=>a+b,0);let sat=false;
        const sh=act.map((i,j)=>bud*w[j]/W);act.forEach((i,j)=>{if(B[i]<=sh[j]+1e-9){sat=true;}});
        if(!sat){act.forEach((i,j)=>{const x=serve(i,sh[j],s);use[i]+=x;B[i]-=x;});bud=0;break;}
        const keep=[];let spent=0;act.forEach((i,j)=>{if(B[i]<=sh[j]+1e-9){const x=serve(i,B[i],s);use[i]+=x;spent+=x;B[i]=0;}else keep.push(i);});bud-=spent;act=keep;}}
    for(let i=0;i<nf;i++)al[s*nf+i]=use[i]/bpp;}
  for(let i=0;i<nf;i++){const q=Q[i];for(let j=H[i];j<q.length;j++){if((N-q[j].t)*0.5>F[i].pdb){R[i].miss++;R[i].dl.push(F[i].pdb*1.5);}}}
  return {al,nrb,N,cap:nrb*bpp*2/1000,R:R.map((r,i)=>{const n=r.dl.length;return {off:r.arr*2/N/1000,thr:r.sv*2/N/1000,prb:0,mean:n?r.dl.reduce((a,b)=>a+b,0)/n:0,p99:nslPct(r.dl,0.99),miss:n?r.miss/n*100:0};}),
   prb:F.map((f,i)=>{let t=0;for(let s=0;s<N;s++)t+=al[s*nf+i];return t/N/nrb*100;})};}
let NSLQR=null;
function nslQRun(){const P=NSLP.qos;NSLQR={a:nslQSim(P.mode,P.dr1),b:nslQSim(P.mode==='q'?'pf':'q',0)};NSLS.qs=0;}
function nslQTbl(){const P=NSLP.qos,A=NSLQR.a,B=NSLQR.b,lb=P.dr1?'1 DRB chung':P.mode==='q'?'Theo 5QI':'PF thuần',lb2=P.mode==='q'?'PF thuần':'Theo 5QI';
  return `<p class="hint">Dung lượng ô ≈ ${nslMb(A.cap)} (${A.nrb} PRB × ${nF(P.se,1)} bit/s/Hz). Mỗi lần đổi tham số chạy lại ${nF(A.N,0)} khe 0,5 ms (2 s).</p><div class="scroll"><table class="ndtb"><thead><tr><th>Luồng</th><th>5QI · loại</th><th>Ưu tiên</th><th>PDB</th><th>Tải đưa vào</th><th>Phục vụ</th><th>PRB</th><th>Trễ TB · p99</th><th>Vượt PDB (${lb})</th><th>Vượt PDB (${lb2})</th></tr></thead><tbody>
   ${NSLQF.map((f,i)=>{const r=A.R[i],q=B.R[i];return `<tr><td>${`<i class="nsldot" style="background:${f.c}"></i>`}${nE(f.n)}</td><td>${f.q} · ${NSLQT[f.t]}</td><td>${f.p}</td><td>${f.pdb} ms</td><td>${nslMb(r.off)}</td><td>${nslMb(r.thr)}</td><td>${nF(A.prb[i],1)} %</td><td>${nslMs(r.mean)} · ${nslMs(r.p99)}</td><td>${nslOk(r.miss<=1,nF(r.miss,2)+' %')}</td><td>${nslOk(q.miss<=1,nF(q.miss,2)+' %')}</td></tr>`;}).join('')}</tbody></table></div>
   <p class="note">Theo 5QI: luồng GBR và delay-critical GBR được phục vụ trước theo mức ưu tiên (tới GFBR), phần còn lại chia theo PF có trọng số mức ưu tiên. PF thuần: mọi UE ngang nhau. «1 DRB chung»: SDAP dồn mọi QoS flow vào một DRB nên gNB phục vụ theo thứ tự đến, gói robot xếp sau gói tải nền. Lập lịch PF theo từng khe và PRB của nhiều sóng mang có ở <button type="button" class="u3lnkbtn" data-sfgo="sf:grid">thẻ Hiệu quả tần số một trạm</button>.</p>`;}
function nslQGrid(s0){const A=NSLQR.a,nf=NSLQF.length,W=40;let s='';for(let c=0;c<W;c++){const sl=(s0+c)%A.N;let y=0;
   for(let i=0;i<nf;i++){const h=A.al[sl*nf+i]/A.nrb*150;if(h>0.2){s+=`<rect x="${30+c*14}" y="${160-y-h}" width="12" height="${h}" style="fill:${NSLQF[i].c}"/>`;}y+=h;}}
  s+=`<line x1="28" y1="10" x2="28" y2="160" style="stroke:var(--line)"/><text x="24" y="16" class="sfsm" text-anchor="end">${A.nrb}</text><text x="24" y="160" class="sfsm" text-anchor="end">0</text><text x="30" y="176" class="sfsm">khe ${s0}</text><text x="590" y="176" class="sfsm" text-anchor="end">+40 khe (20 ms)</text>`;
  return `<svg viewBox="0 0 600 180" class="u3svg nslsvg" role="img" aria-label="PRB theo luồng từng khe">${s}</svg>`;}
/* SDAP: QoS flow → DRB */
const NSLMAP={'11':'Mỗi QoS flow một DRB','n1':'GBR riêng, non-GBR chung DRB mặc định','1':'Một DRB cho cả phiên'};
function nslDrb(i){const m=NSLP.qos.map,f=NSLQF[i];if(m==='1')return 0;if(m==='n1')return f.t==='N'?2:f.t==='D'?0:1;return i;}
function nslSdapSvg(){const m=NSLP.qos.map,nd=m==='1'?1:m==='n1'?3:NSLQF.length;let s='';
  s+=`<rect x="10" y="20" width="110" height="200" rx="8" style="fill:var(--panel);stroke:var(--line)"/><text x="65" y="40" class="sftx" text-anchor="middle">UPF</text><text x="65" y="56" class="sfsm" text-anchor="middle">PDR → QFI (QER)</text>`;
  s+=`<rect x="250" y="20" width="110" height="200" rx="8" style="fill:var(--panel);stroke:var(--line)"/><text x="305" y="40" class="sftx" text-anchor="middle">gNB · SDAP</text><text x="305" y="56" class="sfsm" text-anchor="middle">QFI → DRB</text>`;
  s+=`<rect x="490" y="20" width="100" height="200" rx="8" style="fill:var(--panel);stroke:var(--line)"/><text x="540" y="40" class="sftx" text-anchor="middle">UE</text><text x="540" y="56" class="sfsm" text-anchor="middle">QoS rule (UL)</text>`;
  s+=`<rect x="120" y="70" width="130" height="140" style="fill:color-mix(in srgb,var(--up) 8%,transparent);stroke:var(--up);stroke-dasharray:5 4"/><text x="185" y="86" class="sfsm" text-anchor="middle">N3: GTP-U + QFI</text>`;
  for(let d=0;d<nd;d++){const y=90+d*(120/Math.max(1,nd-1||1));s+=`<line x1="360" y1="${nd===1?150:y}" x2="490" y2="${nd===1?150:y}" style="stroke:var(--line);stroke-width:7;opacity:.55"/><text x="425" y="${(nd===1?150:y)-6}" class="sfsm" text-anchor="middle">DRB ${d+1}</text>`;}
  NSLQF.forEach((f,i)=>{s+=`<circle id="nslPk${i}" r="5" cx="-20" cy="-20" style="fill:${f.c}"/>`;});
  return `<svg viewBox="0 0 600 230" class="u3svg nslsvg" role="img" aria-label="Ánh xạ QoS flow sang DRB">${s}</svg>`;}
function nslSdapOut(){const P=NSLP.qos;
  return `<dl class="kv">${nslKv('Ánh xạ',nE(NSLMAP[P.map])+' · '+(P.map==='11'?'gNB lập lịch riêng từng luồng nhưng tốn DRB (tối đa 29 DRB mỗi UE từ Rel-16) và báo hiệu RRC':P.map==='n1'?'cách hay dùng: thoại, URLLC, video GBR có DRB riêng; web và tải nền chung DRB mặc định':'đơn giản nhất nhưng mất phân biệt QoS ở tầng RLC/MAC'))
   +nslKv('Tiêu đề SDAP DL','1 byte: RDI (Reflective QoS flow to DRB mapping Indication), RQI (Reflective QoS Indication), QFI 6 bit'+(P.rq?' · đang đặt <b>RQI = 1</b> cho luồng web':''))
   +nslKv('Tiêu đề SDAP UL','1 byte: D/C, R, QFI 6 bit')
   +nslKv('QoS phản ánh',P.rq?'SMF gửi RQA cho QoS flow ở N2; UPF đánh RQI trong gói DL; UE tự tạo QoS rule UL bằng cách đảo địa chỉ/cổng của gói DL, giữ trong RQ timer (mặc định 60 s). Không cần báo hiệu NAS cho từng luồng ứng dụng.':'Tắt: UE chỉ dùng QoS rule tường minh do SMF gửi trong PDU Session Establishment/Modification.')}</dl>`;}
/* ARP: chiếm quyền khi ô đầy */
const NSLARP=[['Video giám sát',8,1,30],['VoNR (cuộc gọi khẩn có ARP 1)',2,0,10],['Game',10,1,25],['Camera nhà máy',6,1,25]];
function nslArpOut(){const P=NSLP.qos,used=NSLARP.reduce((a,b)=>a+b[3],0),free=100-used;let res,pre=[];
  if(P.an<=free)res='<span class="lbgood">Nhận luồng mới, không cần chiếm quyền</span>';
  else if(!P.apc)res='<span class="lbbad">Từ chối (luồng mới không có pre-emption capability)</span>';
  else{const cand=NSLARP.filter(r=>r[2]&&r[1]>P.ap).sort((a,b)=>b[1]-a[1]);let f=free;for(const c of cand){if(f>=P.an)break;pre.push(c);f+=c[3];}
    res=f>=P.an?`<span class="kpC mid">Nhận, chiếm quyền: ${pre.map(c=>nE(c[0])+' (ARP '+c[1]+')').join(', ')}</span>`:'<span class="lbbad">Từ chối: không đủ luồng có ARP thấp hơn và cho phép bị chiếm</span>';if(f<P.an)pre=[];}
  return `<div class="scroll"><table class="ndtb"><thead><tr><th>Luồng GBR đang có</th><th>Mức ARP</th><th>Cho phép bị chiếm (PVI)</th><th>Tài nguyên GBR</th></tr></thead><tbody>${NSLARP.map(r=>`<tr${pre.includes(r)?' class="nslhl"':''}><td>${nE(r[0])}</td><td>${r[1]}</td><td>${r[2]?'Có':'Không'}</td><td>${r[3]} %</td></tr>`).join('')}</tbody></table></div>
   <dl class="kv">${nslKv('Còn trống',free+' %')+nslKv('Kết quả',res)}</dl><p class="note">ARP gồm mức ưu tiên 1–15 (1 cao nhất), pre-emption capability (PCI) và pre-emption vulnerability (PVI). ARP chỉ dùng khi nhận hoặc giữ luồng, không ảnh hưởng lập lịch từng khe (việc đó do mức ưu tiên của 5QI).</p>`;}
function nslQiRows(){const f=NSLP.qos.f;return NSLQI.filter(r=>f==='all'||r[1]===f).map(r=>`<tr><td><b>${r[0]}</b></td><td>${NSLQT[r[1]]}</td><td>${r[2]}</td><td>${r[3]} ms</td><td>${r[4]}</td><td>${r[5]?r[5]+' B':'—'}</td><td>${nE(r[6])}</td><td>${r[7]===''?'—':'QCI '+r[7]}</td></tr>`).join('');}
NSLR.qos={
 html(){const P=NSLP.qos;
  return `<div class="panel"><h3>5QI, ARP, QFI và so với QCI của 4G</h3><div class="ctl" style="margin-bottom:8px">${nslSel('qos','f','Loại tài nguyên',[['all','Tất cả'],['G','GBR'],['N','Non-GBR'],['D','Delay-critical GBR']])}</div>
   <div class="scroll"><table class="ndtb"><thead><tr><th>5QI</th><th>Loại</th><th>Mức ưu tiên</th><th>PDB</th><th>PER</th><th>MDBV</th><th>Ví dụ dịch vụ</th><th>4G</th></tr></thead><tbody id="nslQiB">${nslQiRows()}</tbody></table></div>
   <p class="note">Giá trị theo TS 23.501 Bảng 5.7.4-1 (đối chiếu bản release đang dùng; 5QI 128–254 do nhà mạng định nghĩa). QFI (6 bit) là nhãn của QoS flow trong một phiên PDU, mang trên N3 và SDAP; 5QI là bộ đặc tính gắn với QFI. Delay-critical GBR có MDBV (lượng dữ liệu lớn nhất phải phục vụ trong PDB) và cửa sổ trung bình 2 000 ms.</p>
   <div class="scroll"><table class="ndtb"><thead><tr><th>Khái niệm</th><th>4G EPS</th><th>5GS</th></tr></thead><tbody>
   <tr><td>Đơn vị QoS</td><td>EPS bearer (QCI, 1 bearer = 1 DRB = 1 GTP tunnel)</td><td>QoS flow (QFI) trong phiên PDU; nhiều flow chung 1 tunnel N3, SDAP ánh xạ sang DRB</td></tr>
   <tr><td>Đặc tính</td><td>QCI 1–9, 65–80</td><td>5QI (thêm delay-critical GBR 82–86, PDB/PER có thể ghi đè)</td></tr>
   <tr><td>Tốc độ</td><td>GBR/MBR, APN-AMBR, UE-AMBR</td><td>GFBR/MFBR mỗi flow, Session-AMBR, UE-AMBR, UE-Slice-MBR (Rel-17)</td></tr>
   <tr><td>Chính sách</td><td>PCRF, Gx (PCEF), Rx (P-CSCF)</td><td>PCF, N7 (SMF), N5 (AF), N15 (AMF)</td></tr>
   <tr><td>Luồng UL</td><td>TFT do mạng gửi</td><td>QoS rule tường minh hoặc QoS phản ánh</td></tr></tbody></table></div></div>
  <div class="panel"><h3>Mô phỏng: nhiều luồng chia PRB theo 5QI</h3><div class="ctl">${nslSel('qos','bw','Băng thông (SCS 30 kHz)',[[40,'40 MHz'],[60,'60 MHz'],[100,'100 MHz']])}${nslSl('qos','se','Hiệu suất phổ trung bình',1,7,0.5,v=>nF(v,1)+' bit/s/Hz')}
   ${nslSl('qos','ld','Tải web + tải nền',20,400,10,v=>v+' %','100 % = 90 + 180 Mbit/s')}${nslSel('qos','mode','Bộ lập lịch',[['q','Theo 5QI (ưu tiên GBR, trọng số)'],['pf','PF thuần, bỏ qua 5QI']],'','sched')}${nslChk('qos','dr1','Dồn mọi QoS flow vào 1 DRB','sdap')}</div>
   <div class="row">${nslPlayBtn('qos','nslQPlay')}</div><div class="scroll"><div class="nslw" id="nslQGrid"></div></div><div id="nslQTbl"></div></div>
  <div class="panel"><h3>QoS flow → DRB (SDAP) và QoS phản ánh</h3><div class="ctl">${nslSel('qos','map','Ánh xạ QFI → DRB',Object.entries(NSLMAP),'','sdap')}${nslChk('qos','rq','QoS phản ánh (RQI)','rqos')}</div>
   <div class="scroll"><div class="nslw" id="nslSdap">${nslSdapSvg()}</div></div><div id="nslSdapO">${nslSdapOut()}</div></div>
  <div class="panel"><h3>ARP: nhận và chiếm quyền khi ô đầy</h3><div class="ctl">${nslSl('qos','an','Tài nguyên luồng mới cần',5,60,5,v=>v+' %')}${nslSl('qos','ap','Mức ARP luồng mới',1,15,1,v=>String(v))}${nslChk('qos','apc','Luồng mới có pre-emption capability','arp')}</div><div id="nslArp">${nslArpOut()}</div></div>`;},
 after(){nslQRun();nslSet('nslQTbl',nslQTbl());nslSet('nslQGrid',nslQGrid(0));},
 upd(k){if(k==='f')nslSet('nslQiB',nslQiRows());
  if(['bw','se','ld','mode','dr1'].includes(k)){nslQRun();nslSet('nslQTbl',nslQTbl());nslSet('nslQGrid',nslQGrid(0));}
  if(['map','rq'].includes(k)){nslSet('nslSdap',nslSdapSvg());nslSet('nslSdapO',nslSdapOut());}
  if(['an','ap','apc'].includes(k))nslSet('nslArp',nslArpOut());},
 tick(dt){if(!NSLQR)return;if(!NSLS.pause){NSLS.qa+=dt;NSLS.sa=(NSLS.sa+dt*0.35)%1;}
  if(NSLS.qa>0.15){NSLS.qa=0;NSLS.qs=(NSLS.qs+4)%NSLQR.a.N;nslSet('nslQGrid',nslQGrid(NSLS.qs));}
  const m=NSLP.qos.map,nd=m==='1'?1:m==='n1'?3:NSLQF.length;
  NSLQF.forEach((f,i)=>{const e=document.getElementById('nslPk'+i);if(!e)return;const u=(NSLS.sa+i/NSLQF.length)%1,y0=80+i*24,d=nslDrb(i),y1=nd===1?150:90+d*(120/Math.max(1,nd-1));let x,y;
    if(u<0.4){x=70+u/0.4*235;y=y0;}else if(u<0.5){x=305;y=y0+(y1-y0)*(u-0.4)/0.1;}else{x=305+(u-0.5)/0.5*235;y=y1;}e.setAttribute('cx',x.toFixed(1));e.setAttribute('cy',y.toFixed(1));});},
 act(a){if(a==='play')nslPlayTog('nslQPlay');}
};

/* ---------- Mục 3: chia tài nguyên RAN giữa các slice ---------- */
NSLP.rrm={ded_emb:0,min_emb:30,max_emb:100,dem_emb:50,ded_url:10,min_url:20,max_url:40,dem_url:12,ded_mtc:0,min_mtc:5,max_mtc:15,dem_mtc:4,ded_fwa:0,min_fwa:20,max_fwa:50,dem_fwa:25,surge:300,show:'url'};
const NSLUE={emb:40,url:6,mtc:150,fwa:30};
function nslPol(k){const P=NSLP.rrm,d=nC(P['ded_'+k],0,100),m=Math.max(d,P['min_'+k]),x=Math.max(m,P['max_'+k]);return {d,m,x};}
function nslAlloc(D,U,pol){const A={},rem={};NSLK4.forEach(k=>{A[k]=0;rem[k]=D[k];});let waste=0,pool=100;
  if(pol){let sd=0;NSLK4.forEach(k=>sd+=nslPol(k).d);const sc=sd>100?100/sd:1;
    NSLK4.forEach(k=>{const d=nslPol(k).d*sc,x=Math.min(rem[k],d);A[k]+=x;rem[k]-=x;waste+=d-x;pool-=d;});
    let need=0;const pr={};NSLK4.forEach(k=>{const p=nslPol(k);pr[k]=Math.min(rem[k],Math.max(0,p.m-p.d));need+=pr[k];});const f=need>pool?pool/Math.max(need,1e-9):1;
    NSLK4.forEach(k=>{const x=pr[k]*f;A[k]+=x;rem[k]-=x;pool-=x;});}
  /* phần chung: PF theo số UE (water-filling), giới hạn max nếu có policy */
  let act=NSLK4.filter(k=>rem[k]>1e-9);for(let it=0;it<6&&act.length&&pool>1e-9;it++){
    const cap=k=>pol?Math.max(0,nslPol(k).x-A[k]):Infinity,w=act.map(k=>U[k]),W=w.reduce((a,b)=>a+b,0);let sat=false;const keep=[];let spent=0;
    act.forEach((k,j)=>{const sh=pool*w[j]/W,lim=Math.min(rem[k],cap(k));if(lim<=sh+1e-9){A[k]+=lim;rem[k]-=lim;spent+=lim;sat=true;}else keep.push([k,sh]);});
    if(!sat){keep.forEach(([k,sh])=>{A[k]+=sh;rem[k]-=sh;});pool=0;break;}pool-=spent;act=keep.map(x=>x[0]).filter(k=>rem[k]>1e-9&&cap(k)>1e-9);}
  return {A,waste,free:Math.max(0,pool)};}
function nslRSim(pol){const P=NSLP.rrm,rnd=nRng(5),T=120,out={A:{},D:{},dl:[],waste:[],free:[]},bl={emb:0,url:0,mtc:0,fwa:0};NSLK4.forEach(k=>{out.A[k]=[];out.D[k]=[];});
  for(let s=0;s<T;s++){const t=s*0.5,bump=t<15?0:t<20?(t-15)/5:t<40?1:t<45?(45-t)/5:0,f=1+(P.surge/100-1)*bump,D={},U={};
    NSLK4.forEach(k=>{const n=1+0.06*nGs(rnd);D[k]=Math.max(0,P['dem_'+k]*(k==='emb'?f:1)*n*(k==='url'?(1+0.25*Math.sin(s*1.3)):1));U[k]=NSLUE[k]*(k==='emb'?f:1);});
    const De={};NSLK4.forEach(k=>De[k]=D[k]+bl[k]/0.5);const r=nslAlloc(De,U,pol);NSLK4.forEach(k=>{out.A[k].push(r.A[k]);out.D[k].push(D[k]);bl[k]=Math.max(0,bl[k]+(D[k]-r.A[k])*0.5);});
    out.dl.push(Math.min(500,2+1000*bl.url/Math.max(r.A.url,0.05)));out.waste.push(r.waste);out.free.push(r.free);}
  return out;}
let NSLRR=null;
function nslRRun(){NSLRR={n:nslRSim(false),p:nslRSim(true)};}
function nslRPlot(){const R=NSLRR,k=NSLP.rrm.show,sv=o=>o.A[k].map((a,i)=>[i*0.5,o.D[k][i]>0.01?Math.min(100,a/o.D[k][i]*100):100]);
  const p1=nPlot({w:640,h:200,x0:0,x1:60,y0:0,y1:100,yt:[0,25,50,75,100],xt:[0,10,20,30,40,50,60],xf:v=>v+' s',ylab:'% nhu cầu được phục vụ',bands:[[15,45,'var(--warn)',.08]],cur:NSLS.ra*60,
    series:[{pts:sv(R.n),c:'var(--muted)',dash:'5 4',w:2},{pts:sv(R.p),c:NSLSL[k].c,w:2.4}],aria:'Phần nhu cầu được phục vụ'});
  const p2=nPlot({w:640,h:170,x0:0,x1:60,y0:0,y1:100,yt:[0,10,25,50,100],xt:[0,10,20,30,40,50,60],xf:v=>v+' s',ylab:'trễ URLLC (ms)',hl:[[10,'var(--warn)','PDB 10 ms']],bands:[[15,45,'var(--warn)',.08]],cur:NSLS.ra*60,
    series:[{pts:R.n.dl.map((d,i)=>[i*0.5,d]),c:'var(--muted)',dash:'5 4',w:2},{pts:R.p.dl.map((d,i)=>[i*0.5,d]),c:'var(--warn)',w:2.4}],aria:'Trễ URLLC'});
  return p1+uLeg([['Không hạn mức (PF chung)','var(--muted)'],['Có RRM policy · '+NSLSL[k].n,NSLSL[k].c]])+p2+uLeg([['Trễ URLLC không hạn mức','var(--muted)'],['Trễ URLLC có RRM policy','var(--warn)']]);}
function nslRBar(o,i,t){let s='',x=0;NSLK4.forEach(k=>{const w=o.A[k][i];if(w>0.05)s+=`<i style="width:${w}%;background:${NSLSL[k].c}" title="${NSLSL[k].n} ${nF(w,1)} %"></i>`;x+=w;});
  if(o.waste[i]>0.05)s+=`<i class="nslwaste" style="width:${o.waste[i]}%" title="Dành riêng chưa dùng"></i>`;return `<p class="e2x">${t}</p><div class="nslstk">${s}</div>`;}
function nslRNow(){const R=NSLRR,i=Math.min(119,Math.floor(NSLS.ra*120)),t=i*0.5;
  return `<p class="hint">Thời điểm ${nF(t,1)} s${t>=15&&t<45?' · <b>eMBB đang tăng tải ×'+nF(NSLP.rrm.surge/100,1)+'</b>':''}</p>${nslRBar(R.n,i,'Không hạn mức')}${nslRBar(R.p,i,'Có RRM policy')}${uLeg(NSLK4.map(k=>[NSLSL[k].n,NSLSL[k].c]).concat([['Dành riêng chưa dùng','var(--line)']]))}`;}
function nslRTbl(){const R=NSLRR,avg=a=>a.reduce((x,y)=>x+y,0)/a.length,sv=(o,k,lo,hi)=>{let a=0,d=0;for(let i=lo;i<hi;i++){a+=o.A[k][i];d+=o.D[k][i];}return d>0?Math.min(100,a/d*100):100;};
  let sd=0,sm=0;NSLK4.forEach(k=>{const p=nslPol(k);sd+=p.d;sm+=p.m;});const vio=o=>o.dl.filter(d=>d>10).length*0.5;
  return `${sd>100?'<p class="note lbbad">Tổng dedicated vượt 100 %: đang thu nhỏ theo tỉ lệ.</p>':''}${sm>100?'<p class="note lbbad">Tổng min vượt 100 %: phần ưu tiên bị chia theo tỉ lệ khi các slice cùng đông.</p>':''}
  <div class="scroll"><table class="ndtb"><thead><tr><th>Slice</th><th>Dedicated · min · max</th><th>Nhu cầu TB</th><th>Phục vụ cả kỳ (không / có)</th><th>Phục vụ lúc eMBB tăng (không / có)</th></tr></thead><tbody>
  ${NSLK4.map(k=>{const p=nslPol(k);return `<tr><td>${nslDot(k)}${nE(NSLSL[k].l)}</td><td>${nF(p.d,0)} · ${nF(p.m,0)} · ${nF(p.x,0)} %</td><td>${nF(avg(R.p.D[k]),1)} %</td><td>${nF(sv(R.n,k,0,120),1)} / ${nF(sv(R.p,k,0,120),1)} %</td><td>${nslOk(sv(R.n,k,40,80)>=99,nF(sv(R.n,k,40,80),1)+' %')} / ${nslOk(sv(R.p,k,40,80)>=99,nF(sv(R.p,k,40,80),1)+' %')}</td></tr>`;}).join('')}</tbody></table></div>
  <dl class="kv">${nslKv('URLLC vượt PDB 10 ms',`không hạn mức ${nF(vio(R.n),1)} s / có RRM policy ${nF(vio(R.p),1)} s trong 60 s`)+nslKv('PRB dành riêng bỏ trống (TB)',nF(avg(R.p.waste),1)+' % (cái giá của cô lập cứng)')+nslKv('PRB rảnh hẳn (TB)',`${nF(avg(R.n.free),1)} % / ${nF(avg(R.p.free),1)} %`)}</dl>`;}
function nslPolFig(){return NSLK4.map(k=>{const p=nslPol(k);return `<div class="nslpol"><span>${nslDot(k)}${NSLSL[k].n}</span><div class="nslpb"><i class="d" style="width:${p.d}%;background:${NSLSL[k].c}"></i><i class="m" style="left:${p.d}%;width:${p.m-p.d}%;background:${NSLSL[k].c}"></i><i class="x" style="left:${p.m}%;width:${p.x-p.m}%;border-color:${NSLSL[k].c}"></i></div></div>`;}).join('')
  +'<p class="note">Đậm: dedicated (chỉ slice này dùng, bỏ trống thì phí) · nhạt: prioritized (slice được ưu tiên, rảnh thì cho slice khác mượn) · viền: shared tới max (tranh chung, không vượt max).</p>';}
NSLR.rrm={
 html(){const P=NSLP.rrm,row=k=>`<tr><td>${nslDot(k)}${nE(NSLSL[k].l)}<br><span class="note">${NSLUE[k]} UE hoạt động</span></td><td>${nslSl('rrm','ded_'+k,'Dedicated',0,50,1,v=>v+' %','',k==='url'?'ded':'')}</td><td>${nslSl('rrm','min_'+k,'Min',0,80,1,v=>v+' %','',k==='url'?'min':'')}</td><td>${nslSl('rrm','max_'+k,'Max',5,100,1,v=>v+' %','',k==='url'?'max':'')}</td><td>${nslSl('rrm','dem_'+k,'Nhu cầu',1,80,1,v=>v+' % PRB')}</td></tr>`;
  return `<div class="panel"><h3>RRM policy: dedicated, prioritized, shared</h3><p class="hint">TS 28.541 RRMPolicyRatio gán cho từng nhóm thành viên (PLMN + S-NSSAI) ba tỉ lệ PRB: rRMPolicyDedicatedRatio ≤ rRMPolicyMinRatio ≤ rRMPolicyMaxRatio. 3GPP không chuẩn hoá thuật toán lập lịch bên trong; đây là cách hiểu phổ biến.</p>
   <div class="scroll"><table class="ndtb nslrt"><thead><tr><th>Slice</th><th>Dedicated</th><th>Min (dedicated + prioritized)</th><th>Max</th><th>Nhu cầu bình thường</th></tr></thead><tbody>${NSLK4.map(row).join('')}</tbody></table></div>
   <div id="nslPolF">${nslPolFig()}</div></div>
  <div class="panel"><h3>Cô lập slice khi tải tăng: có và không có hạn mức</h3><div class="ctl">${nslSl('rrm','surge','eMBB tăng tải trong 15–45 s',100,600,25,v=>'× '+nF(v/100,2),'số UE eMBB tăng theo')}${nslSel('rrm','show','Xem slice trên đồ thị',NSLK4.map(k=>[k,NSLSL[k].l]))}</div>
   <div class="row">${nslPlayBtn('rrm','nslRPlay')}</div><div id="nslRNow"></div><div class="scroll"><div class="nslw" id="nslRPlot"></div></div><div id="nslRTbl"></div>
   <p class="note">Không hạn mức: phần chung chia theo số UE (PF), eMBB đông UE lấn URLLC. Có policy: URLLC giữ phần dedicated + prioritized, eMBB bị chặn ở max. Mô hình gộp theo slice mỗi 0,5 s; lưới PRB × khe và bộ lập lịch PF thật có ở <button type="button" class="u3lnkbtn" data-sfgo="sf:grid">thẻ sf mục Lưới PRB</button>, so sánh thuật toán ở <button type="button" class="u3lnkbtn" data-sfgo="sf:alg">mục So sánh thuật toán</button>.</p></div>`;},
 after(){nslRRun();nslSet('nslRPlot',nslRPlot());nslSet('nslRTbl',nslRTbl());nslSet('nslRNow',nslRNow());},
 upd(k){nslSet('nslPolF',nslPolFig());if(k!=='show')nslRRun();nslSet('nslRPlot',nslRPlot());nslSet('nslRTbl',nslRTbl());nslSet('nslRNow',nslRNow());},
 tick(dt){if(!NSLRR)return;if(!NSLS.pause){NSLS.ra=(NSLS.ra+dt/20)%1;NSLS.ca+=dt;}
  if(NSLS.ca>0.25){NSLS.ca=0;nslSet('nslRNow',nslRNow());nslSet('nslRPlot',nslRPlot());}},
 act(a){if(a==='play')nslPlayTog('nslRPlay');}
};

/* ---------- Mục 4: chính sách và định tuyến ---------- */
const NSLUR=[
 {p:1,td:'App ID: vn.factory.robot',m:a=>a==='robot',rsd:[{s:'url',dnn:'factory',ssc:1}]},
 {p:2,td:'FQDN: *.meet.congty.vn',m:a=>a==='meet',rsd:[{s:'emb',dnn:'enterprise',ssc:1},{s:'emb',dnn:'internet',ssc:1}]},
 {p:3,td:'DNN ims (connection capability IMS)',m:a=>a==='voice',rsd:[{s:'emb',dnn:'ims',ssc:1}]},
 {p:4,td:'App ID: vn.utility.meter',m:a=>a==='meter',rsd:[{s:'mtc',dnn:'iot',ssc:1,pt:'Non-IP'},{s:'emb',dnn:'iot',ssc:1}]},
 {p:5,td:'Lưu lượng LAN của CPE (DNN fwa)',m:a=>a==='cpe',rsd:[{s:'fwa',dnn:'fwa',ssc:1}]},
 {p:6,td:'App ID: vn.car.v2x',m:a=>a==='v2x',rsd:[{s:'v2x',dnn:'v2x',ssc:2}]},
 {p:255,td:'Match-all (mọi lưu lượng còn lại)',m:()=>true,rsd:[{s:'emb',dnn:'internet',ssc:1}]}];
const NSLAPP=[['robot','Điều khiển robot'],['meet','Họp trực tuyến công ty'],['voice','Gọi thoại VoNR'],['meter','Đồng hồ điện'],['cpe','Router FWA'],['v2x','Ứng dụng xe V2X'],['video','Xem video'],['web','Trình duyệt']];
NSLP.pol={al_emb:1,al_url:1,al_mtc:1,al_fwa:1,al_v2x:0,ent:1,ursp:1,app:'robot',lad:'reg',step:0};
function nslUrspEval(a){const P=NSLP.pol;if(!P.ursp)return {r:null,d:{s:'emb',dnn:'internet',ssc:1},why:'UE không hỗ trợ URSP: dùng phiên mặc định theo cấu hình UE'};
  const tried=[];for(const R of NSLUR.slice().sort((x,y)=>x.p-y.p)){if(!R.m(a))continue;
    for(let j=0;j<R.rsd.length;j++){const d=R.rsd[j],ok=P['al_'+d.s]&&(d.dnn!=='enterprise'||P.ent);if(ok)return {r:R,j,d,why:tried.length?'Bỏ qua: '+tried.join('; '):''};
      tried.push(`quy tắc ${R.p} RSD ${j+1} (${!P['al_'+d.s]?NSLSL[d.s].n+' không có trong Allowed NSSAI':'chưa có thuê bao DNN '+d.dnn})`);}}
  return {r:null,d:null,why:'Không RSD nào hợp lệ: '+tried.join('; ')};}
const NSLSMF={url:['SMF-edge nhà máy','UPF tại khuôn viên','≈ 2 ms'],emb:['SMF vùng','UPF trung tâm','≈ 15 ms'],mtc:['SMF IoT','UPF IoT / NEF (Non-IP)','≈ 20 ms'],fwa:['SMF vùng','UPF gần IXP','≈ 8 ms'],v2x:['SMF-V2X','UPF MEC ven đường','≈ 4 ms']};
function nslUrspHtml(){const P=NSLP.pol,ev=NSLAPP.map(a=>[a,nslUrspEval(a[0])]),ss={};
  ev.forEach(([a,e])=>{if(!e.d)return;const key=e.d.s+'|'+e.d.dnn+'|'+e.d.ssc;(ss[key]=ss[key]||[]).push(a[1]);});
  return `<div class="scroll"><table class="ndtb"><thead><tr><th>Ứng dụng</th><th>Quy tắc khớp</th><th>RSD chọn (S-NSSAI, DNN, SSC)</th><th>Ghi chú</th></tr></thead><tbody>${ev.map(([a,e])=>`<tr${a[0]===P.app?' class="nslhl"':''}><td>${nE(a[1])}</td><td>${e.r?e.r.p+' · '+nE(e.r.td):'—'}</td><td>${e.d?nslDot(e.d.s)+nE(NSLSL[e.d.s].n)+' ('+nslSn(e.d.s)+'), DNN '+nE(e.d.dnn)+', SSC '+e.d.ssc+(e.d.pt?', '+e.d.pt:''):'<span class="lbbad">Không lập được phiên</span>'}</td><td class="note">${nE(e.why)}</td></tr>`).join('')}</tbody></table></div>
   <dl class="kv">${nslKv('Phiên PDU cần có',Object.keys(ss).length+' phiên: '+Object.entries(ss).map(([k,v])=>{const [s,d]=k.split('|');return `${NSLSL[s].n}/${d} (${v.length} ứng dụng)`;}).join(' · '))}</dl>`;}
function nslSmfHtml(){const e=nslUrspEval(NSLP.pol.app);if(!e.d)return '<p class="note lbbad">Ứng dụng đang chọn không có RSD hợp lệ nên không chọn SMF.</p>';const s=NSLSMF[e.d.s];
  return `<dl class="kv">${nslKv('AMF hỏi NRF','Nnrf_NFDiscovery: target-nf-type=SMF, snssais={'+nslSn(e.d.s)+'}, dnn='+e.d.dnn+', tai')+nslKv('SMF được chọn',nE(s[0]))+nslKv('SMF chọn UPF',nE(s[1])+' (theo S-NSSAI, DNN, vị trí UE, DNAI); trễ tới ứng dụng '+s[2])
   +nslKv('PCF',`SMF lập SM policy (N7): PCC rule 5QI ${nE(NSLSL[e.d.s].q)}, Session-AMBR, rating group; có thể chọn PCF theo slice`)}</dl>`;}
const NSLLAD={
 reg:{n:'Registration với Requested NSSAI',m:[[0,1,'RRC','RRCSetupRequest → RRCSetup',''],[0,1,'RRC','RRCSetupComplete (s-NSSAI-List, Registration Request)','NSSAI ở tầng AS giúp gNB chọn AMF'],
  [1,2,'NGAP','Initial UE Message (Requested NSSAI eMBB, URLLC)','gNB chọn AMF hỗ trợ các S-NSSAI'],[2,3,'SBI','Nausf_UEAuthentication (5G-AKA)','xác thực chính, xem thẻ Bảo mật'],[2,3,'SBI','Nudm_SDM_Get (Subscribed S-NSSAIs)',''],
  [2,3,'SBI','Nnssf_NSSelection_Get (Requested, Subscribed, TAI)',''],[3,2,'SBI','Allowed NSSAI {eMBB, URLLC}, AMF set phù hợp',''],[2,4,'SBI','Npcf_AMPolicyControl_Create / UEPolicy (URSP)','PCF đẩy URSP qua AMF'],
  [2,1,'NGAP','Initial Context Setup Request (Allowed NSSAI)','gNB lưu slice của UE'],[2,0,'NAS','Registration Accept (Allowed, Configured, Rejected NSSAI)',''],[0,2,'NAS','Registration Complete','UE lưu Allowed NSSAI theo vùng đăng ký']]},
 rej:{n:'Từ chối theo slice (#62, Rejected NSSAI)',m:[[0,1,'RRC','RRCSetupComplete (s-NSSAI-List: V2X)',''],[1,2,'NGAP','Initial UE Message (Requested NSSAI V2X)',''],[2,3,'SBI','Nudm_SDM_Get: thuê bao không có V2X, không có S-NSSAI mặc định dùng được',''],
  [2,3,'SBI','Nnssf_NSSelection_Get','NSSF không có slice nào cho TA này'],[3,2,'SBI','Allowed NSSAI rỗng',''],[2,0,'NAS','Registration Reject #62 (Rejected NSSAI: V2X cause #0)','UE không xin lại V2X ở PLMN này'],
  [0,0,'NAS','UE chờ, dựng Requested NSSAI mới từ Configured NSSAI','có thể dùng back-off timer'],[0,2,'NAS','Registration Request (Requested NSSAI eMBB)','lần thử sau thành công']]},
 nssaa:{n:'NSSAA: xác thực theo slice (EAP)',m:[[2,0,'NAS','Registration Accept (Allowed eMBB, Pending NSSAI URLLC)','Rel-17: slice chờ NSSAA'],[2,3,'SBI','Nnssaaf_NSSAA_Authenticate (GPSI, S-NSSAI URLLC)','NSSAAF chuyển tới AAA-S doanh nghiệp'],
  [3,2,'EAP','EAP Request/Identity (qua AAA-P)',''],[2,0,'NAS','Network Slice-Specific Authentication Command (EAP)',''],[0,2,'NAS','Network Slice-Specific Authentication Complete (EAP Response)',''],
  [2,3,'EAP','EAP-TLS trao chứng thư với AAA-S',''],[3,2,'EAP','EAP Success',''],[2,0,'NAS','Network Slice-Specific Authentication Result',''],[2,0,'NAS','Configuration Update Command (Allowed NSSAI: eMBB, URLLC)','URLLC chuyển từ Pending sang Allowed']]},
 pdu:{n:'Lập phiên PDU có slice',m:[[0,2,'NAS','PDU Session Establishment Request (S-NSSAI URLLC, DNN factory)','UE chọn theo URSP'],[2,3,'SBI','Nnrf_NFDiscovery (SMF, snssai, dnn)','NRF trả SMF của slice'],[2,4,'SBI','Nsmf_PDUSession_CreateSMContext',''],
  [4,3,'SBI','Nudm_SDM_Get (SM data: 5QI, Session-AMBR theo S-NSSAI, DNN)',''],[4,4,'SBI','Npcf_SMPolicyControl_Create → PCC rule (5QI 82, ARP, GFBR, rating group)',''],[4,4,'SBI','Nchf_ConvergedCharging_Create (S-NSSAI, rating group)','CHF cấp hạn mức'],
  [4,4,'PFCP','N4 Session Establishment (PDR, QER có QFI, URR)','UPF tại khuôn viên'],[4,2,'SBI','Namf_Communication_N1N2MessageTransfer',''],[2,1,'NGAP','PDU Session Resource Setup Request (S-NSSAI, QFI 1 → 5QI 82)','gNB kiểm tra RRM policy của slice'],
  [1,0,'RRC','RRCReconfiguration (DRB, SDAP QFI → DRB, NAS Accept)',''],[1,2,'NGAP','PDU Session Resource Setup Response (TEID N3)',''],[2,4,'SBI','Nsmf_PDUSession_UpdateSMContext → N4 Modification','dữ liệu bắt đầu đi']]},
 pdurej:{n:'Từ chối phiên PDU (#69, NSAC)',m:[[0,2,'NAS','PDU Session Establishment Request (S-NSSAI URLLC)',''],[2,4,'SBI','Nsmf_PDUSession_CreateSMContext',''],[4,3,'SBI','Nnsacf_NSAC_NumOfPDUsUpdate (tăng)','NSACF đếm phiên của slice'],
  [3,4,'SBI','Đã đạt số phiên tối đa của slice',''],[4,2,'SBI','N1 SM: PDU Session Establishment Reject',''],[2,0,'NAS','PDU Session Establishment Reject #69 (insufficient resources for specific slice), back-off timer','UE không thử lại slice này tới khi hết timer']]}
};
const NSLLC=['UE','gNB','AMF','NSSF · UDM · NSSAAF/AAA','SMF · PCF · CHF · UPF'],NSLLX=[50,190,330,485,635];
function nslLadSvg(){const L=NSLLAD[NSLP.pol.lad],n=L.m.length,cur=NSLP.pol.step,X=NSLLX;let s='';
  NSLLC.forEach((c,i)=>{s+=`<text x="${X[i]}" y="18" class="sftx" text-anchor="middle">${nE(c)}</text><line x1="${X[i]}" y1="26" x2="${X[i]}" y2="${36+n*26}" style="stroke:var(--line);stroke-width:1.4"/>`;});
  L.m.forEach((q,i)=>{const y=44+i*26,a=X[q[0]],b=X[q[1]],on=i<=cur,c=i===cur?'var(--warn)':on?'var(--ink)':'var(--line)',tx=q[3].length>58?q[3].slice(0,56)+'…':q[3];
    if(a===b)s+=`<path d="M${a} ${y-6} h24 v12 h-24" style="fill:none;stroke:${c};stroke-width:1.4"/><text x="${a>500?a-6:a+30}" y="${y+4}" class="sfsm" text-anchor="${a>500?'end':'start'}" style="fill:${on?'var(--ink)':'var(--muted)'}">${nE(tx)}</text>`;
    else{const dir=b>a?1:-1;s+=`<line x1="${a}" y1="${y}" x2="${b}" y2="${y}" style="stroke:${c};stroke-width:${i===cur?2.4:1.3}"/><path d="M${b} ${y} l${-dir*7} -4 v8z" style="fill:${c}"/><text x="${Math.min(a,b)+8}" y="${y-5}" class="sfsm" style="fill:${on?'var(--ink)':'var(--muted)'}">${nE(tx)}</text>`;}});
  s+=`<circle id="nslLDot" r="5" cx="-20" cy="-20" style="fill:var(--warn)"/>`;
  return `<svg viewBox="0 0 700 ${50+n*26}" class="u3svg nslsvg" role="img" aria-label="Lược đồ bản tin ${nE(L.n)}">${s}</svg>`;}
function nslLadLog(){const L=NSLLAD[NSLP.pol.lad];return nLog(L.m.slice(0,NSLP.pol.step+1).map((q,i)=>({t:i*0.012,p:q[2],m:q[3],a:NSLLC[q[0]]+' → '+NSLLC[q[1]],d:q[4]})),NSLP.pol.step);}
function nslLadUpd(){nslSet('nslLad',nslLadSvg());nslSet('nslLadLog',nslLadLog());}
NSLR.pol={
 html(){const P=NSLP.pol;
  return `<div class="panel"><h3>PCF và các loại chính sách</h3><div class="scroll"><table class="ndtb"><thead><tr><th>Chính sách</th><th>Giao diện 5G</th><th>Nội dung</th><th>Tương đương 4G</th></tr></thead><tbody>
   <tr><td>AM policy (truy nhập, di động)</td><td>N15 Npcf_AMPolicyControl (AMF)</td><td>RFSP (ưu tiên tần số/RAT), vùng phục vụ, UE-Slice-MBR</td><td>Không có (RFSP từ HSS qua S6a)</td></tr>
   <tr><td>SM policy (phiên)</td><td>N7 Npcf_SMPolicyControl (SMF)</td><td>PCC rule: luồng dịch vụ, 5QI, ARP, GFBR/MFBR, Session-AMBR, rating group, online/offline, usage monitoring</td><td>Gx (PCRF–PCEF)</td></tr>
   <tr><td>UE policy</td><td>N15 Npcf_UEPolicyControl → N1 qua AMF</td><td>URSP (ứng dụng → slice/DNN), ANDSP</td><td>Không có (chỉ ANDSF)</td></tr>
   <tr><td>Thông tin từ ứng dụng</td><td>N5 Npcf_PolicyAuthorization (AF, P-CSCF)</td><td>Media thoại/video, yêu cầu QoS, sự kiện</td><td>Rx</td></tr>
   <tr><td>Dữ liệu chính sách</td><td>N36 Nudr (UDR)</td><td>Gói cước, hạn mức, trạng thái sử dụng</td><td>Sp/Ud</td></tr></tbody></table></div>
   <p class="note">PCF có thể chọn theo S-NSSAI (mỗi slice một PCF). Kiến trúc PCC: TS 23.503, TS 29.512/29.513 (PCC rule, ánh xạ QoS).</p></div>
  <div class="panel"><h3>URSP trên UE: ứng dụng → S-NSSAI, DNN</h3><div class="ctl">${NSLSK.map(k=>nslChk('pol','al_'+k,'Allowed: '+NSLSL[k].n)).join('')}${nslChk('pol','ent','Thuê bao có DNN enterprise')}${nslChk('pol','ursp','UE hỗ trợ URSP','ursp')}${nslSel('pol','app','Tô sáng ứng dụng',NSLAPP)}</div>
   <div class="scroll"><table class="ndtb"><thead><tr><th>Ưu tiên</th><th>Traffic descriptor</th><th>Route selection descriptor (theo thứ tự)</th></tr></thead><tbody>${NSLUR.map(R=>`<tr><td>${R.p}</td><td>${nE(R.td)}</td><td>${R.rsd.map((d,j)=>`${j+1}. ${NSLSL[d.s].n}, DNN ${d.dnn}, SSC ${d.ssc}${d.pt?', '+d.pt:''}`).join('<br>')}</td></tr>`).join('')}</tbody></table></div>
   <div id="nslUr">${nslUrspHtml()}</div><p class="note">UE xét quy tắc theo thứ tự ưu tiên; quy tắc khớp nhưng không RSD nào hợp lệ thì xét quy tắc kế tiếp (TS 24.526 §4.2.2). Ví dụ URSP ngắn có ở <button type="button" class="u3lnkbtn" data-bkgo="slice2">chuyên đề Cắt lát nâng cao</button> và <button type="button" class="u3lnkbtn" data-pngo="pn:vd">thẻ Mạng riêng 5G</button>.</p></div>
  <div class="panel"><h3>Chọn SMF, UPF theo slice</h3><div id="nslSmf">${nslSmfHtml()}</div></div>
  <div class="panel"><h3>Lược đồ đăng ký và lập phiên có slice</h3><div class="seg u3seg sfsub" role="group" aria-label="Kịch bản bản tin">${Object.entries(NSLLAD).map(([k,v])=>`<button type="button" data-nsla="pol:lad|${k}" aria-pressed="${k===P.lad}">${nE(v.n)}</button>`).join('')}</div>
   <div class="row">${nslPlayBtn('pol','nslLPlay')}<button type="button" class="btn sm" data-nsla="pol:prev">◀ Bước trước</button><button type="button" class="btn sm" data-nsla="pol:next">Bước sau ▶</button></div>
   <div class="scroll"><div class="nslw nsllad" id="nslLad">${nslLadSvg()}</div></div><div id="nslLadLog">${nslLadLog()}</div>
   <p class="note">Toàn bộ luồng đăng ký và dữ liệu 5G SA có ở <button type="button" class="u3lnkbtn" data-nslgo="e2:reg:sa">thẻ E2E · Đăng ký</button> và <button type="button" class="u3lnkbtn" data-nslgo="e2:data:sa">thẻ E2E · Dữ liệu</button>.</p></div>`;},
 after(){},
 upd(k){nslSet('nslUr',nslUrspHtml());nslSet('nslSmf',nslSmfHtml());},
 tick(dt){const P=NSLP.pol,L=NSLLAD[P.lad],q=L.m[P.step],d=document.getElementById('nslLDot'),X=NSLLX;if(!NSLS.pause)NSLS.lt+=dt;
  if(d&&q){const f=Math.min(1,NSLS.lt/0.9),a=X[q[0]],b=X[q[1]];d.setAttribute('cx',a===b?a+12:a+(b-a)*f);d.setAttribute('cy',44+P.step*26);}
  if(!NSLS.pause&&NSLS.lt>1.5){NSLS.lt=0;P.step=(P.step+1)%L.m.length;nslLadUpd();}},
 act(a){const P=NSLP.pol,[k,v]=a.split('|');
  if(k==='lad'){P.lad=v;P.step=0;NSLS.lt=0;renderNsl();}else if(k==='play')nslPlayTog('nslLPlay');
  else if(k==='next'||k==='prev'){const n=NSLLAD[P.lad].m.length;P.step=(P.step+(k==='next'?1:n-1))%n;NSLS.lt=0;nslLadUpd();if(nReduced())NSLR.pol.tick(0);}}
};

/* ---------- Mục 5: tính cước và SLA ---------- */
NSLP.chg={rate:40,gu:200,thr:80,vt:120,bal:2000,fui:'thr',n_emb:200,gb_emb:30,q8:0,n_url:40,gbr_url:6,n_mtc:5000,mb_mtc:5,n_fwa:150,gb_fwa:400,mon:1};
const NSLFUI={term:'Kết thúc phiên (TERMINATE)',red:'Chuyển hướng tới trang nạp tiền (REDIRECT)',thr:'Giảm tốc độ còn 1 Mbit/s (PCF đổi QoS)'};
function nslCSim(){const P=NSLP.chg,rnd=nRng(3+P.rate),T=600,ev=[],U=[],B=[];let bal=P.bal,used=0,inG=0,g=Math.min(P.gu,bal),tg=0,mode='ok',rp=0;
  ev.push({t:0,p:'SBI',m:'Nchf_ConvergedCharging_Create',a:'SMF → CHF',d:`Xin hạn mức rating group 10; CHF cấp ${nF(g,0)} MB, ngưỡng ${P.thr} %, hiệu lực ${P.vt} s`});
  for(let t=1;t<=T;t++){const on=rnd()<0.75,r=mode==='thr'?1:mode==='red'||mode==='end'?0:P.rate*(on?1:0.15),x=r/8;used+=x;inG+=x;rp+=x;
    if(mode==='ok'){const hit=inG>=g*P.thr/100,exp=t-tg>=P.vt,out=inG>=g;
      if(hit||exp||out){bal=Math.max(0,bal-rp);const ng=Math.min(P.gu,bal);
        ev.push({t,p:'SBI',m:'Nchf_ConvergedCharging_Update',a:'SMF → CHF',d:`${exp&&!hit?'Hết hiệu lực hạn mức':'Đạt ngưỡng '+P.thr+' %'}: báo dùng ${nF(rp,0)} MB; số dư ${nF(bal,0)} MB; ${ng>0?'cấp thêm '+nF(ng,0)+' MB':'hết tiền → Final Unit Indication'}`});
        rp=0;inG=0;g=ng;tg=t;if(ng<=0){mode=P.fui==='term'?'end':P.fui==='red'?'red':'thr';
          ev.push({t,p:mode==='end'?'NAS':'SBI',m:mode==='end'?'PDU Session Release (do cước)':mode==='red'?'Áp chuyển hướng HTTP tới cổng nạp tiền':'Npcf_SMPolicyControl_Update: Session-AMBR 1 Mbit/s',a:mode==='end'?'SMF → UE':'SMF/PCF → UPF',d:NSLFUI[P.fui]});
          if(mode==='end')ev.push({t,p:'SBI',m:'Nchf_ConvergedCharging_Release',a:'SMF → CHF',d:'Đóng phiên cước, CHF ghi CDR'});}}}
    U.push([t,used]);B.push([t,Math.max(0,bal-rp)]);}
  if(mode!=='end')ev.push({t:T,p:'SBI',m:'Nchf_ConvergedCharging_Release',a:'SMF → CHF',d:`Kết thúc phiên: tổng ${nF(used,0)} MB; CHF ghi CDR (S-NSSAI, rating group, 5QI) gửi BD qua Bx`});
  return {ev,U,B,used,mode};}
let NSLCR=null;
function nslCPlot(){const C=NSLCR,P=NSLP.chg,ym=Math.max(P.bal,C.used)*1.08,cur=NSLS.ra2*600;
  return nPlot({w:640,h:210,x0:0,x1:600,y0:0,y1:ym,yt:[0,ym/4,ym/2,ym*3/4].map(v=>Math.round(v)),xt:[0,120,240,360,480,600],xf:v=>v+' s',ylab:'MB',cur,
   marks:C.ev.filter(e=>/Update|Release|Policy|chuyển|Release/.test(e.m)).slice(0,14).map((e,i)=>[e.t,/Update/.test(e.m)?'U':/Release/.test(e.m)?'R':'!',/Update/.test(e.m)?'var(--muted)':'var(--warn)',i%2]),
   series:[{pts:C.U,c:'var(--nr)',w:2.2},{pts:C.B,c:'var(--lte)',w:2.2,dash:'6 4'}],aria:'Dùng và số dư theo thời gian'})+uLeg([['Lưu lượng đã dùng','var(--nr)'],['Số dư ở CHF','var(--lte)'],['U: Update, R: Release, !: hết hạn mức','var(--warn)']]);}
function nslCLog(){const C=NSLCR,t=NSLS.ra2*600;let cur=0;C.ev.forEach((e,i)=>{if(e.t<=t)cur=i;});return nLog(C.ev,cur);}
const NSLTAR={emb:'10 đv/GB (5QI 8: × 1,3)',url:'400 đv/thiết bị + 50 đv mỗi Mbit/s GFBR',mtc:'2 đv/thiết bị + 0,5 đv/MB',fwa:'250 đv/CPE, FUP 500 GB rồi giảm tốc'};
function nslBill(){const P=NSLP.chg;return {
  emb:P.n_emb*P.gb_emb*10*(P.q8?1.3:1),url:P.n_url*(400+50*P.gbr_url),mtc:P.n_mtc*(2+0.5*P.mb_mtc),fwa:P.n_fwa*250};}
const NSLSLA={emb:[['Độ sẵn sàng','%',99.9,'u'],['Thông lượng DL giờ bận','Mbit/s',50,'u'],['Trễ RTT','ms',30,'d']],url:[['Độ sẵn sàng','%',99.99,'u'],['Trễ p99,999','ms',10,'d'],['Gói đúng hạn','%',99.999,'u']],
 mtc:[['Độ sẵn sàng','%',99.5,'u'],['Tỉ lệ đăng ký thành công','%',99,'u']],fwa:[['Độ sẵn sàng','%',99.9,'u'],['Tốc độ hộ giờ bận','Mbit/s',100,'u']]};
function nslSlaRep(){const P=NSLP.chg,rnd=nRng(101+P.mon*17),B=nslBill(),rows=[];let tot=0,cr=0;
  NSLK4.forEach(k=>{let bad=0;const m=NSLSLA[k].map(r=>{const tg=r[2],z=nGs(rnd);let v;
      if(r[1]==='%'){const gap=100-tg;v=Math.min(100,tg+gap*(0.6+0.5*z));}else v=r[3]==='u'?tg*(1.15+0.15*z):tg*(0.8+0.18*z);
      const ok=r[3]==='u'?v>=tg:v<=tg;if(!ok)bad++;return [r,v,ok];});
    const c=Math.min(25,bad*5),cv=B[k]*c/100;tot+=B[k];cr+=cv;rows.push([k,m,c,cv]);});
  return `<div class="scroll"><table class="ndtb"><thead><tr><th>Slice</th><th>Chỉ tiêu SLA (đo được / cam kết)</th><th>Cước tháng</th><th>Hoàn tiền SLA</th></tr></thead><tbody>${rows.map(([k,m,c,cv])=>`<tr><td>${nslDot(k)}${nE(NSLSL[k].l)}</td><td>${m.map(([r,v,ok])=>`${nE(r[0])}: ${nslOk(ok,nF(v,r[1]==='%'?(r[2]>=99.99?3:2):1)+' '+r[1])} / ${r[3]==='u'?'≥':'≤'} ${nF(r[2],r[2]>=99.99?3:r[2]%1?1:0)} ${r[1]}`).join('<br>')}</td><td>${nF(nslBill()[k],0)} đv</td><td>${c?`<span class="lbbad">${c} % = ${nF(cv,0)} đv</span>`:'0'}</td></tr>`).join('')}</tbody></table></div>
   <dl class="kv">${nslKv('Tổng cước',nF(tot,0)+' đv')+nslKv('Hoàn tiền SLA',nF(cr,0)+' đv ('+nF(tot?cr/tot*100:0,1)+' %)')+nslKv('Nguồn số liệu','KPI theo S-NSSAI (TS 28.552/28.554), NWDAF (Nnwdaf, analytics slice load, QoS sustainability), CDR của CHF; mức hoàn tiền 5 % mỗi chỉ tiêu, tối đa 25 % (ví dụ minh hoạ)')}</dl>`;}
function nslBillHtml(){const B=nslBill(),t=NSLK4.reduce((a,k)=>a+B[k],0);
  return `<div class="scroll"><table class="ndtb"><thead><tr><th>Slice</th><th>Mô hình cước (minh hoạ)</th><th>Cước tháng</th><th>Tỉ trọng</th></tr></thead><tbody>${NSLK4.map(k=>`<tr><td>${nslDot(k)}${nE(NSLSL[k].l)}</td><td>${nE(NSLTAR[k])}</td><td>${nF(B[k],0)} đv</td><td><span class="pnbar"><i style="width:${t?B[k]/t*100:0}%;background:${NSLSL[k].c}"></i></span> ${nF(t?B[k]/t*100:0,1)} %</td></tr>`).join('')}</tbody></table></div><p class="note">«đv» là đơn vị cước giả định để so sánh, không phải giá thật.</p>`;}
NSLR.chg={
 html(){const P=NSLP.chg;
  return `<div class="panel"><h3>CHF và Nchf converged charging</h3><div class="cols"><div><dl class="kv">${nslKv('CTF','Nằm trong SMF (dữ liệu), AMF (SMS, vị trí), IMS AS, NEF; thu số liệu sử dụng theo URR của UPF')+nslKv('CHF','Hội tụ online + offline: cấp hạn mức (quota), định giá, trừ tiền, tạo CDR (TS 32.290, 32.291)')
   +nslKv('Nchf_ConvergedCharging','Create (đầu phiên), Update (đạt ngưỡng, hết hiệu lực, đổi QoS, đổi slice/vị trí), Release (cuối phiên); Notify khi CHF đòi báo lại')+nslKv('Khoá tính cước','Rating group + service ID trong PCC rule; S-NSSAI, 5QI, DNN, RAT đi kèm trong bản tin để định giá theo slice và QoS')
   +nslKv('CDR','CHF (CGF) ghi CDR, gửi hệ thống tính cước BD qua Bx; offline thuần không cần hạn mức')}</dl></div>
   <div><div class="scroll"><table class="ndtb"><thead><tr><th></th><th>4G</th><th>5G</th></tr></thead><tbody><tr><td>Online</td><td>OCS, Gy (PCEF), Ro (IMS)</td><td rowspan="2">CHF, N40 Nchf (SMF), Nchf cho IMS AS</td></tr><tr><td>Offline</td><td>OFCS, Gz/Rf</td></tr><tr><td>Hạn mức chi tiêu</td><td>Sy (PCRF–OCS)</td><td>N28 Nchf_SpendingLimitControl (PCF–CHF)</td></tr><tr><td>Giao thức</td><td>Diameter</td><td>HTTP/2 + JSON (SBI)</td></tr></tbody></table></div></div></div>
   <p class="note">Luồng cước toàn trình (tính cước trực tuyến và chính sách theo gói) có ở <button type="button" class="u3lnkbtn" data-nslgo="e2:chg:sa">thẻ E2E · Cước</button>.</p></div>
  <div class="panel"><h3>Hạn mức online: Create, Update, Release</h3><div class="ctl">${nslSl('chg','rate','Tốc độ dùng khi bận',5,200,5,v=>v+' Mbit/s')}${nslSl('chg','gu','Hạn mức mỗi lần cấp',50,1000,50,v=>v+' MB','','quota')}${nslSl('chg','thr','Ngưỡng báo lại',50,95,5,v=>v+' %','','thr')}
   ${nslSl('chg','vt','Thời hạn hiệu lực',30,600,30,v=>v+' s','','vt')}${nslSl('chg','bal','Số dư tài khoản',200,8000,200,v=>nF(v,0)+' MB')}${nslSel('chg','fui','Khi hết tiền',Object.entries(NSLFUI),'','fui')}</div>
   <div class="row">${nslPlayBtn('chg','nslCPlay')}</div><div class="scroll"><div class="nslw" id="nslCPlot"></div></div><div id="nslCLog"></div></div>
  <div class="panel"><h3>Cước theo slice và QoS (doanh nghiệp)</h3><div class="ctl">${nslSl('chg','n_emb','eMBB: số thuê bao',0,1000,10,v=>v)}${nslSl('chg','gb_emb','eMBB: GB/thuê bao/tháng',1,200,1,v=>v+' GB')}${nslChk('chg','q8','eMBB dùng 5QI 8 (ưu tiên)')}
   ${nslSl('chg','n_url','URLLC: số thiết bị',0,500,5,v=>v)}${nslSl('chg','gbr_url','URLLC: GFBR mỗi thiết bị',1,20,1,v=>v+' Mbit/s')}${nslSl('chg','n_mtc','mMTC: số thiết bị',0,50000,500,v=>nF(v,0))}${nslSl('chg','mb_mtc','mMTC: MB/thiết bị/tháng',1,100,1,v=>v+' MB')}${nslSl('chg','n_fwa','FWA: số CPE',0,1000,10,v=>v)}</div><div id="nslBill">${nslBillHtml()}</div></div>
  <div class="panel"><h3>SLA và báo cáo tháng</h3><div class="row"><button type="button" class="btn sm" data-nsla="chg:mon">Tạo báo cáo tháng khác ↻</button><span class="note">Tháng mẫu số <b id="nslMon">${P.mon}</b></span></div><div id="nslSla">${nslSlaRep()}</div></div>
  <div class="panel"><h3>Ví dụ bốn slice</h3><div class="nslcards">
   <div class="nslcard" style="--c:${NSLSL.emb.c}"><b>eMBB phổ thông</b><p>SST 1, 5QI 9/8, RRM min 30 %, cước theo GB, SLA thông lượng giờ bận. Phần lớn thuê bao di động.</p></div>
   <div class="nslcard" style="--c:${NSLSL.url.c}"><b>URLLC nhà máy</b><p>SST 2 SD 0000A1, 5QI 82, PRB dedicated, UPF tại khuôn viên, NSSAA với AAA của doanh nghiệp; cước theo thiết bị + GFBR, SLA trễ và độ tin cậy. Mô phỏng trễ Monte Carlo ở <button type="button" class="u3lnkbtn" data-pngo="pn:urllc">thẻ Mạng riêng · URLLC</button>, kịch bản ngành ở <button type="button" class="u3lnkbtn" data-pngo="pn:svc">mục FWA và dịch vụ ngành</button>.</p></div>
   <div class="nslcard" style="--c:${NSLSL.mtc.c}"><b>mMTC đo đếm</b><p>SST 3, Non-IP qua NEF, PSM/eDRX, RRM max 10 %; cước theo thiết bị, SLA tỉ lệ đăng ký và độ sẵn sàng.</p></div>
   <div class="nslcard" style="--c:${NSLSL.fwa.c}"><b>FWA hộ gia đình</b><p>SST 1 SD 00F0A0, 5QI 8/9, RRM min 20 % max 50 %; cước thuê bao tháng, FUP; SLA tốc độ hộ giờ bận. Số hộ mỗi sector ở <button type="button" class="u3lnkbtn" data-pngo="pn:svc">thẻ Mạng riêng · FWA</button>.</p></div></div></div>`;},
 after(){NSLCR=nslCSim();NSLS.ra2=0;nslSet('nslCPlot',nslCPlot());nslSet('nslCLog',nslCLog());},
 upd(k){if(['rate','gu','thr','vt','bal','fui'].includes(k)){NSLCR=nslCSim();nslSet('nslCPlot',nslCPlot());nslSet('nslCLog',nslCLog());}
  else{nslSet('nslBill',nslBillHtml());nslSet('nslSla',nslSlaRep());}},
 tick(dt){if(!NSLCR)return;if(!NSLS.pause){NSLS.ra2=(NSLS.ra2+dt/24)%1;NSLS.ca+=dt;}if(NSLS.ca>0.3){NSLS.ca=0;nslSet('nslCPlot',nslCPlot());nslSet('nslCLog',nslCLog());}},
 act(a){if(a==='play')nslPlayTog('nslCPlay');else if(a==='mon'){NSLP.chg.mon++;nslSet('nslSla',nslSlaRep());nslSet('nslMon',String(NSLP.chg.mon));}}
};

/* ---------- Mục 6: tham số, KPI, lỗi ---------- */
/* [khoá, nhóm, tham số 3GPP / ý nghĩa, Huawei, Nokia, Ericsson, điển hình] — tên vendor đều cần đối chiếu */
const NSLPAR=[
 ['sst','Lõi','S-NSSAI (SST, SD) của slice (TS 23.003 §28.4, 23.501 §5.15.2)','S-NSSAI trong cấu hình UNC/UDG và gNB (NRDUCell slice)','sNSSAI trong cấu hình AMF/SMF và NRCELL','Thuộc tính sNSSAI (sst, sd) ở GNBCUCPFunction / AMF','SST 1–6 chuẩn; SD 6 hex'],
 ['tasl','RAN','TAI Slice Support List báo trong NG Setup / RAN Configuration Update','Danh sách slice hỗ trợ theo TA của gNB','Supported S-NSSAI per TAC','pLMNInfoList (sNSSAI) ở NRCellDU','Mỗi TA khai đủ slice được bán ở vùng đó'],
 ['defn','Lõi','Default Configured NSSAI và S-NSSAI mặc định trong thuê bao UDM','Default S-NSSAI (UDM/HSS hội tụ)','Default S-NSSAI (UDM)','defaultSingleNssais (UDM)','eMBB SST 1 làm mặc định'],
 ['nssf','Lõi','NSSF: ánh xạ (S-NSSAI, TAI) → Allowed NSSAI, AMF Set, NRF (Nnssf_NSSelection)','Bảng chọn slice của NSSF','NSSF slice selection policy','NSSF NsiProfile / AMF set mapping','Có khi các AMF set phục vụ slice khác nhau'],
 ['nssaa','Lõi','NSSAA bắt buộc cho S-NSSAI (cờ trong thuê bao), NSSAAF, địa chỉ AAA-S','Cờ NSSAA theo S-NSSAI, AAA-S','NSSAA required per slice','nssaaRequired, AAA server','Bật cho slice doanh nghiệp'],
 ['nsac','Lõi','NSACF: số UE / số phiên PDU tối đa mỗi slice (Rel-17)','Hạn mức UE/phiên theo slice','Max UEs / PDU sessions per S-NSSAI','NSACF quota','Theo hợp đồng slice (ví dụ 500 UE)'],
 ['slr','RAN','SIB16 FreqPriorityListSlicing-r17: ưu tiên tần số theo NSAG','Ưu tiên chọn lại theo slice (Rel-17)','Slice-based cell reselection','sliceBasedCellResel (NRCellCU)','Tần số có PRB dành riêng được ưu tiên cho NSAG'],
 ['rap','RAN','FeatureCombinationPreambles-r17 (nsag-List): RACH riêng theo slice','RACH partition theo NSAG','RACH partitioning per slice','RACH feature combination','Chỉ dùng khi có nhiều UE Rel-17'],
 ['ded','RAN','rRMPolicyDedicatedRatio (TS 28.541 RRMPolicyRatio)','Tỉ lệ PRB dành riêng của slice','RRM policy dedicated ratio','RRMPolicyRatio.rRMPolicyDedicatedRatio','0 % cho eMBB; 5–15 % cho URLLC'],
 ['min','RAN','rRMPolicyMinRatio (dedicated + prioritized)','Tỉ lệ PRB tối thiểu của slice','RRM policy min ratio','RRMPolicyRatio.rRMPolicyMinRatio','Theo cam kết SLA'],
 ['max','RAN','rRMPolicyMaxRatio (trần PRB của slice)','Tỉ lệ PRB tối đa của slice','RRM policy max ratio','RRMPolicyRatio.rRMPolicyMaxRatio','100 % eMBB; 10 % mMTC'],
 ['memb','RAN','rRMPolicyMemberList (PLMN ID + S-NSSAI) của từng policy','Thành viên policy theo slice','Policy member list','rRMPolicyMemberList','Một policy có thể gom nhiều S-NSSAI'],
 ['sched','RAN','Trọng số lập lịch theo mức ưu tiên 5QI (QoS-aware scheduling)','Trọng số lập lịch theo 5QI','QoS class scheduling weight','Trọng số theo 5QI (QoS profile)','Theo priority level của 5QI'],
 ['qi','RAN','Cấu hình riêng theo 5QI: RLC mode, PDCP discard timer, t-Reordering, DRX','Cấu hình theo 5QI (NR5QI)','QoS profile per 5QI','QoS profile (NRCellCU)','5QI 1: RLC UM; 5QI 9: RLC AM'],
 ['sdap','RAN','SDAP-Config: mappedQoS-FlowsToAdd, defaultDRB, sdap-HeaderDL/UL','Chính sách ánh xạ QFI → DRB','QoS flow to DRB mapping','QoS flow to DRB mapping policy','GBR riêng DRB, non-GBR chung'],
 ['rqos','Lõi','Reflective QoS: RQA (N2), RQ timer (mặc định 60 s)','Reflective QoS ở SMF/UPF','Reflective QoS','Reflective QoS, RQ timer','Bật cho dịch vụ nhiều luồng ngắn'],
 ['arp','Lõi','ARP: mức ưu tiên 1–15, pre-emption capability / vulnerability','ARP theo PCC rule','ARP in QoS profile','ARP (PCF/SMF)','Khẩn cấp 1–2; thường 8–10'],
 ['ambr','Lõi','Session-AMBR, UE-AMBR, UE-Slice-MBR (Rel-17)','AMBR theo DNN và slice','AMBR settings','sessionAmbr, ueAmbr','Theo gói cước'],
 ['ursp','Lõi','URSP (PCF): precedence, traffic descriptor, RSD (S-NSSAI, DNN, SSC) — TS 24.526','Quy tắc URSP ở PCF','URSP rule','URSP policy (PCF)','Quy tắc 255 match-all ở cuối'],
 ['smfsel','Lõi','Chọn SMF/UPF theo S-NSSAI, DNN, DNAI (NRF, NF profile sNssais)','NF profile theo slice ở NRF','NF profile snssaiList','NF profile sNssais','Mỗi slice ít nhất 2 SMF dự phòng'],
 ['quota','Cước','Nchf: granted unit (volume/time), rating group','Hạn mức cấp mỗi lần (CHF)','Granted service unit','Granted unit (CHF)','50–500 MB tuỳ gói'],
 ['thr','Cước','Volume/time threshold (báo lại trước khi hết hạn mức)','Ngưỡng báo lại hạn mức','Quota threshold','Volume threshold','80 %'],
 ['vt','Cước','Validity time, quota holding time','Thời hạn hạn mức','Validity time','Validity time','600–3600 s'],
 ['fui','Cước','Final Unit Indication: TERMINATE / REDIRECT / RESTRICT_ACCESS','Hành động khi hết tiền','Final unit action','Final unit action','REDIRECT tới cổng nạp tiền'],
 ['chfsel','Cước','Chọn CHF (địa chỉ trong thuê bao/PCF), failure handling khi CHF không trả lời','Chọn CHF, xử lý lỗi','CHF selection, failure handling','CHF selection, failureHandling','CONTINUE để không cắt dịch vụ']];
const NSLKPI=[
 ['Tỉ lệ đăng ký slice thành công','S-NSSAI vào Allowed NSSAI / S-NSSAI trong Requested NSSAI × 100','Đếm đăng ký theo S-NSSAI (UNC)','Registration per S-NSSAI (AMF)','Registration per slice (AMF)','≥ 99,5 %','arch','nsl_reg'],
 ['Thông lượng DL theo slice','Khối lượng DL của slice / thời gian có dữ liệu (DRB.UEThpDl theo S-NSSAI)','DL throughput theo slice','UE throughput per S-NSSAI','pmPdcpVolDlDrb per slice','Theo SLA (eMBB ≥ 50 Mbit/s)','rrm','nsl_thp'],
 ['Trễ gói DL theo 5QI','Tổng trễ gói / số gói, nhóm theo 5QI (DRB.RlcSduDelayDl theo QoS)','Trễ DL theo 5QI','DL delay per QoS class','Trễ DL theo 5QI','≤ PDB phần RAN (5QI 82: ≤ 5 ms)','qos','nsl_lat'],
 ['Tỉ lệ PRB theo slice','PRB DL dùng cho slice / PRB DL khả dụng × 100','PRB dùng theo slice','PRB usage per S-NSSAI','PRB usage per slice','≤ max của RRM policy','rrm','nsl_prb'],
 ['Tỉ lệ vi phạm SLA','Chu kỳ đo có KPI SLA vi phạm / tổng chu kỳ × 100','Báo cáo SLA (iMaster/NCE)','Slice assurance report','Slice assurance (EO/ENM)','≤ 1 % chu kỳ','chg','nsl_sla'],
 ['Tỉ lệ thiết lập PDU theo slice','PDU Session Establishment Accept / Request theo S-NSSAI','SM theo S-NSSAI (UNC)','PDU session per S-NSSAI','PDU session per slice','≥ 99,5 %','pol','slice5'],
 ['Tỉ lệ lập QoS flow theo 5QI','QoS flow lập thành công / yêu cầu, theo 5QI','QoS flow setup theo 5QI','QoS flow setup per 5QI','QoS flow setup per 5QI','≥ 99 %','qos','qf5']];
const NSLFLT=[
 ['UE không được cấp slice URLLC (Rejected cause #1)','Registration Accept có Rejected NSSAI URLLC «không có trong vùng đăng ký».',['TA hiện tại không khai S-NSSAI trong NG Setup','NSSF chưa ánh xạ slice cho TAI này','UE ra ngoài khuôn viên'],['So TAI Slice Support List của gNB với cấu hình NSSF','Kiểm tra Allowed NSSAI theo từng TA trong log NAS'],{h:'Kiểm tra slice theo TA ở gNB và UNC',n:'Kiểm tra supported S-NSSAI per TAC',e:'Kiểm tra pLMNInfoList sNSSAI'},'Tỉ lệ đăng ký slice','arch'],
 ['Registration Reject #62 (No network slices available)','UE chỉ xin slice không có trong thuê bao và không có S-NSSAI mặc định dùng được.',['Configured NSSAI trên UE cũ hoặc sai SD','Thuê bao UDM thiếu S-NSSAI mặc định','NSSF từ chối mọi slice cho TA'],['Đối chiếu Requested NSSAI với Subscribed S-NSSAIs','Gửi Configuration Update để làm mới Configured NSSAI'],{h:'Thống kê reject theo cause trên UNC',n:'AMF reject cause #62',e:'AMF reject cause'},'Tỉ lệ đăng ký slice','arch'],
 ['NSSAA thất bại, slice bị thu hồi','UE có Pending NSSAI hoặc Rejected cause #2 sau EAP.',['AAA-S doanh nghiệp không trả lời, chứng thư EAP-TLS hết hạn','Sai GPSI hoặc định danh EAP','NSSAAF không tới được AAA-P'],['Log Nnssaaf và EAP trên AMF','Thời gian đáp của AAA-S, trạng thái chứng thư'],{h:'Log NSSAA ở UNC',n:'NSSAA trace',e:'NSSAA trace'},'Tỉ lệ đăng ký slice','pol'],
 ['PDU Session Reject #69 (thiếu tài nguyên cho slice)','Phiên PDU của slice bị từ chối kèm back-off timer.',['NSACF đã đạt số phiên/UE tối đa','SMF của slice quá tải','UPF của slice hết dung lượng'],['Đếm phiên theo S-NSSAI ở NSACF','Tải SMF/UPF theo slice'],{h:'Kiểm tra NSAC quota',n:'NSACF counters',e:'NSACF quota'},'Tỉ lệ thiết lập PDU theo slice','pol'],
 ['Ứng dụng không vào đúng slice (URSP không khớp)','Ứng dụng doanh nghiệp đi slice mặc định eMBB.',['UE hoặc hệ điều hành không hỗ trợ URSP','App ID khác nhau giữa Android/iOS','PCF chưa gửi UE policy section'],['Log Manage UE Policy Command trên UE','So traffic descriptor với ứng dụng thật'],{h:'URSP trên PCF',n:'URSP trên PCF',e:'URSP trên PCF'},'Thông lượng theo slice','pol'],
 ['Trễ URLLC vượt PDB khi eMBB tăng tải','Trễ 5QI 82 tăng vọt vào giờ cao điểm eMBB.',['Không có RRM policy dedicated/min cho URLLC','URLLC dồn chung DRB với non-GBR','Thiếu trọng số lập lịch theo 5QI'],['Xem PRB theo slice và trễ theo 5QI cùng thời điểm','Kiểm tra SDAP mapping và rRMPolicy'],{h:'Kiểm tra RRM policy theo slice ở gNB',n:'Kiểm tra slice RRM policy',e:'Kiểm tra RRMPolicyRatio'},'Trễ theo 5QI, PRB theo slice','rrm'],
 ['QoS flow GBR không lập được','PDU Session Resource Setup trả failure cho QoS flow GBR.',['Admission control: hết tài nguyên GBR','ARP thấp, không được chiếm quyền','5QI không có cấu hình ở gNB'],['Cause trong PDU Session Resource Setup Response','Cấu hình 5QI và ngưỡng admission'],{h:'Admission theo 5QI',n:'GBR admission',e:'Admission control'},'Tỉ lệ lập QoS flow','qos'],
 ['Cước sai hoặc dịch vụ bị cắt do CHF','Phiên bị cắt, CDR thiếu hoặc tính sai slice.',['CHF không trả lời, failure handling = TERMINATE','PCC rule thiếu rating group theo slice','Hạn mức nhỏ, Update quá dày gây tải CHF'],['Log Nchf Create/Update và mã lỗi HTTP','Cấu hình rating group, ngưỡng, thời hạn hiệu lực'],{h:'CHF (CBS) và UNC log Nchf',n:'CHF log',e:'CHF (Charging) log'},'Tỉ lệ vi phạm SLA','chg']];
NSLP.vd={grp:'all',q:'',kf:'all'};
function nslParRows(){const P=NSLP.vd,q=P.q.trim().toLowerCase(),v=nVn();const rows=NSLPAR.filter(r=>(P.grp==='all'||r[1]===P.grp)&&(!q||r.join(' ').toLowerCase().includes(q)));
  const cols=v==='3gpp'?[3,4,5]:[{huawei:3,nokia:4,ericsson:5}[v]];
  return rows.map(r=>`<tr><td><span class="chip">${nE(r[1])}</span><br>${nE(r[2])}</td>${cols.map(c=>`<td class="u3tag">${nE(r[c])}</td>`).join('')}<td>${nE(r[6])}</td><td><span class="kpC mid">Cần đối chiếu</span></td></tr>`).join('')||'<tr><td colspan="6">Không có tham số khớp.</td></tr>';}
function nslParHead(){const v=nVn();return `<tr><th>Tham số (3GPP / ý nghĩa)</th>${v==='3gpp'?'<th>Huawei</th><th>Nokia</th><th>Ericsson</th>':`<th>${nVName(v)}</th>`}<th>Điển hình</th><th>Độ tin cậy tên</th></tr>`;}
function nslKpiRows(){const v=nVn(),f=NSLP.vd.kf;return NSLKPI.filter(k=>f==='all'||k[6]===f).map(k=>`<tr><td><b>${nE(k[0])}</b>${k[7]&&typeof KL!=='undefined'&&KL.find(x=>x.id===k[7])?`<br><button type="button" class="u3lnkbtn" data-nslgo="kpi:${k[7]}">Mở ở thẻ KPI →</button>`:''}</td><td>${nE(k[1])}</td><td class="u3tag">${v==='3gpp'?['Huawei: '+k[2],'Nokia: '+k[3],'Ericsson: '+k[4]].map(nE).join('<br>'):nE(k[{huawei:2,nokia:3,ericsson:4}[v]])}<br><span class="kpC mid">cần đối chiếu</span></td><td>${nE(k[5])}</td><td><button type="button" class="btn sm" data-nslgo="nsl:${k[6]}">Mô phỏng →</button></td></tr>`).join('');}
function nslFltHtml(){const v=nVn();return NSLFLT.map(f=>`<details class="u3flt ndflt nslflt"><summary><b>${nE(f[0])}</b></summary><p class="e2d">${nE(f[1])}</p><div class="u3two"><div><b>Nguyên nhân</b><ul class="u3ul">${f[2].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div><div><b>Kiểm tra</b><ul class="u3ul">${f[3].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div></div><p class="note">${v==='3gpp'?['Huawei: '+f[4].h,'Nokia: '+f[4].n,'Ericsson: '+f[4].e].map(nE).join(' · '):nVName(v)+': '+nE(f[4][v[0]])} (cần đối chiếu) · KPI: ${nE(f[5])} · <button type="button" class="u3lnkbtn" data-nslgo="nsl:${f[6]}">Mô phỏng →</button></p></details>`).join('');}
function nslCalc(){const g=id=>{const e=document.getElementById(id);return e?+e.value||0:0;},o=document.getElementById('nslcOut');if(!o)return;
  const rq=g('nslcRq'),al=g('nslcAl'),vo=g('nslcVo'),tt=g('nslcTt'),ds=g('nslcDs'),dn=g('nslcDn'),pu=g('nslcPu'),pa=g('nslcPa'),sv=g('nslcSv'),sp=g('nslcSp');
  o.innerHTML=nslKv('Tỉ lệ đăng ký slice thành công',rq?`<span class="${al/rq*100<99.5?'lbbad':'lbgood'}">${nF(al/rq*100,2)} %</span>`:'—')
   +nslKv('Thông lượng DL của slice',tt?nslMb(vo*8/tt):'—')+nslKv('Trễ DL trung bình của 5QI',dn?`<span class="${ds/dn>5?'lbbad':'lbgood'}">${nF(ds/dn,2)} ms</span>`:'—')
   +nslKv('Tỉ lệ PRB của slice',pa?`<span class="${pu/pa*100>(NSLP.rrm.max_url||40)?'lbbad':'lbgood'}">${nF(pu/pa*100,1)} %</span> (so với max URLLC ${nF(nslPol('url').x,0)} %)`:'—')
   +nslKv('Tỉ lệ vi phạm SLA',sp?`<span class="${sv/sp*100>1?'lbbad':'lbgood'}">${nF(sv/sp*100,2)} %</span>`:'—');}
NSLR.vd={
 html(){const P=NSLP.vd,grps=[...new Set(NSLPAR.map(r=>r[1]))];
  return `<div class="panel"><h3>Tham số slicing, QoS và cước</h3><p class="hint">Chọn vendor ở thanh trên để chỉ hiện cột vendor đó. Mọi tên tham số vendor đều cần đối chiếu theo tài liệu release đang dùng.</p>
   <div class="ctl" style="margin-bottom:10px">${nslSel('vd','grp','Nhóm',[['all','Tất cả']].concat(grps.map(g=>[g,g])))}<label class="c"><span class="cl">Lọc</span><input type="search" id="nslvq" value="${nE(P.q)}" placeholder="Ví dụ: NSSAI, rRMPolicy, quota"></label></div>
   <div class="scroll"><table class="ndtb"><thead>${nslParHead()}</thead><tbody id="nslParB">${nslParRows()}</tbody></table></div></div>
  <div class="panel"><h3>KPI theo dõi</h3><div class="ctl" style="margin-bottom:10px">${nslSel('vd','kf','Theo mục',[['all','Tất cả']].concat(NSLV.filter(v=>v[0]!=='vd').map(v=>[v[0],v[1]])))}</div>
   <div class="scroll"><table class="ndtb"><thead><tr><th>KPI</th><th>Công thức</th><th>Bộ đếm</th><th>Mục tiêu</th><th></th></tr></thead><tbody id="nslKpB">${nslKpiRows()}</tbody></table></div>
   <div class="u3calc"><b>Tính nhanh từ bộ đếm</b><div class="ctl ndcalc" style="margin-top:8px">
    ${[['nslcRq','S-NSSAI trong Requested NSSAI',52000],['nslcAl','S-NSSAI vào Allowed NSSAI',51830],['nslcVo','Khối lượng DL của slice (MB)',184000],['nslcTt','Thời gian có dữ liệu (s)',21600],['nslcDs','Tổng trễ DL 5QI 82 (ms)',1820000],['nslcDn','Số gói DL 5QI 82',900000],['nslcPu','PRB DL dùng cho slice URLLC',5.1e6],['nslcPa','PRB DL khả dụng',2.36e7],['nslcSv','Chu kỳ 15 phút vi phạm SLA',4],['nslcSp','Tổng chu kỳ 15 phút trong tháng',2880]].map(r=>`<label class="c"><span class="cl">${r[1]}</span><input type="number" id="${r[0]}" value="${r[2]}" step="any"></label>`).join('')}
   </div><dl class="kv" id="nslcOut" style="margin-top:8px"></dl></div></div>
  <div class="panel"><h3>Lỗi thường gặp và cách kiểm tra</h3>${nslFltHtml()}</div>
  <div class="panel"><h3>Tiêu chuẩn tham chiếu</h3><ul class="u3ul"><li>TS 23.501 §5.15 (network slicing, S-NSSAI, NSSAI, NSSAA, NSAC), §5.7 (mô hình QoS, Bảng 5.7.4-1 5QI)</li><li>TS 23.502 §4.2.2 (đăng ký, chọn AMF qua NSSF), §4.3.2 (lập phiên PDU), §4.2.9 (NSSAA)</li><li>TS 23.503 (PCC, URSP), TS 24.526 (URSP trên UE), TS 24.501 (NAS: 5GMM #62, 5GSM #69, Rejected NSSAI)</li><li>TS 37.324 (SDAP), TS 38.300 §16.3 (slicing ở RAN), TS 38.304 §5.2.4.11 và TS 38.331 (slice-based reselection, RACH theo NSAG, Rel-17)</li><li>TS 28.530/28.531/28.541 (quản lý slice, ServiceProfile, SliceProfile, RRMPolicyRatio), TS 28.552/28.554 (đo lường và KPI theo slice), GSMA NG.116 (GST/NEST)</li><li>TS 32.240/32.290/32.291 (converged charging, Nchf), TS 32.255 (cước dữ liệu 5G)</li></ul></div>`;},
 after(){nslCalc();},
 upd(k){if(k==='grp')nslSet('nslParB',nslParRows());if(k==='kf')nslSet('nslKpB',nslKpiRows());}
};

/* ---------- Khung thẻ ---------- */
const NSLLK={arch:{e2:[['reg','sa']],kpi:['nsl_reg','c5_reg']},qos:{e2:[['data','sa']],kpi:['nsl_lat','qf5','lat5']},rrm:{e2:[['data','sa']],kpi:['nsl_prb','nsl_thp','prb5']},
 pol:{e2:[['reg','sa'],['data','sa']],kpi:['slice5','c5_pdu','nsl_reg']},chg:{e2:[['chg','sa']],kpi:['nsl_sla']},vd:{e2:[['reg','sa'],['data','sa'],['chg','sa']],kpi:[]}};
const NSLTB=[['pn','Mạng riêng 5G'],['core','Mạng lõi'],['sc','Bảo mật (5G-AKA, EAP)'],['sf','Hiệu quả tần số một trạm'],['prb','Cấp phát PRB'],['vo','VoLTE (QCI 1)'],['rsh','Chia sẻ RAN']];
function nslLinks(){const L=NSLLK[NSLS.v]||{e2:[],kpi:[]},hasE2=typeof E2S!=='undefined',hasK=typeof KL!=='undefined';
  const e2=hasE2?L.e2.map(([id,tk])=>{const s=E2S.find(x=>x.id===id);return s&&s.f&&s.f[tk]?[s,tk]:null;}).filter(Boolean):[];
  const kp=hasK?L.kpi.map(id=>KL.find(k=>k.id===id)).filter(Boolean):[],tabs=NSLTB.filter(t=>typeof RENDER!=='undefined'&&RENDER[t[0]]);
  return `<div class="panel u3lk"><h3>Xem tiếp ở thẻ khác</h3>
  ${e2.length?`<p class="e2x"><b>Luồng ở thẻ Toàn trình E2E</b> (mở sẵn 5G SA):</p><div class="e2go">${e2.map(([s,tk])=>`<button type="button" class="btn sm" data-nslgo="e2:${s.id}:${tk}">${nE(s.n)} · 5G SA →</button>`).join('')}</div>`:''}
  ${kp.length?`<p class="e2x" style="margin-top:10px"><b>KPI liên quan ở thẻ KPI mạng</b>:</p><div class="e2go">${kp.map(k=>`<button type="button" class="btn sm" data-nslgo="kpi:${k.id}">${nE(k.nm)} →</button>`).join('')}</div>`:''}
  <p class="e2x" style="margin-top:10px"><b>Thẻ liên quan:</b></p><div class="e2go">${tabs.map(t=>`<button type="button" class="btn sm" data-tab="${t[0]}">${t[1]} →</button>`).join('')}<button type="button" class="btn sm" data-bkgo="slice">Chuyên đề Cắt lát →</button><button type="button" class="btn sm" data-bkgo="qos">Chuyên đề Luồng QoS →</button><button type="button" class="btn sm" data-bkgo="slice2">Chuyên đề Cắt lát nâng cao →</button></div></div>`;}
function nslNav(){return `<div class="seg u3seg ndseg nslseg" role="group" aria-label="Mục của thẻ Network slicing, QoS và tính cước">${NSLV.map((v,i)=>`<button type="button" data-nslv="${v[0]}" aria-pressed="${v[0]===NSLS.v}"><span class="ndn">${i+1}</span>${v[1]}</button>`).join('')}</div>`;}
function nslPlayBtn(vw,id){return `<button type="button" class="btn sm" data-nsla="${vw}:play" id="${id}">${NSLS.pause?'▶ Chạy':'⏸ Dừng'}</button>`;}
function nslPlayTog(id){NSLS.pause=!NSLS.pause;const b=document.getElementById(id);if(b)b.textContent=NSLS.pause?'▶ Chạy':'⏸ Dừng';}
function renderNsl(){const nav=document.getElementById('nslNav'),body=document.getElementById('nslBody');if(!nav||!body)return;if(!NSLR[NSLS.v])NSLS.v='arch';
  NSLS.job++;nav.innerHTML=nslNav();const V=NSLR[NSLS.v];body.innerHTML=V.html()+nslLinks();if(V.after)V.after();
  if(S.tab==='nsl'&&!nReduced()&&V.tick)nslStart();else{nslStop();if(V.tick&&S.tab==='nsl')V.tick(0);}}
function nslStart(){if(NSLS.raf)return;NSLS.last=performance.now();NSLS.raf=requestAnimationFrame(nslLoop);}
function nslStop(){if(NSLS.raf)cancelAnimationFrame(NSLS.raf);NSLS.raf=0;}
function nslLoop(now){NSLS.raf=0;if(S.tab!=='nsl')return;
  if(document.hidden){NSLS.last=now;NSLS.raf=requestAnimationFrame(nslLoop);return;}
  const dt=Math.max(0,Math.min(0.1,(now-NSLS.last)/1000));NSLS.last=now;const V=NSLR[NSLS.v];if(V&&V.tick){try{V.tick(dt);}catch(e){console.error(e);}}else return;
  NSLS.raf=requestAnimationFrame(nslLoop);}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-nslgo]');
  if(g){const [t,id,tk]=g.dataset.nslgo.split(':');try{tourStop();}catch(x){}try{stopSig();}catch(x){}
    const top=()=>window.scrollTo({top:Math.min(window.scrollY,$('main').offsetTop-$('.bar').offsetHeight)});
    if(t==='e2'){try{e2Stop();}catch(x){}S.e2Sc=id;S.e2R=tk||'sa';S.e2M=S.mode;if(typeof E2A!=='undefined'){E2A.key='';E2A.i=0;}S.tab='e2';renderAll();top();}
    else if(t==='kpi'){S.tab='kpi';KP.tech='all';KP.ly='all';KP.cat='all';KP.q='';KP.node='';KP.sel=id;kpSig='';renderAll();setTimeout(()=>{const d=$('#kpDet');if(d)d.scrollIntoView({block:'start',behavior:'smooth'});},60);}
    else if(t==='nsl'){S.tab='nsl';if(id&&NSLR[id])NSLS.v=id;renderAll();top();}
    return;}
  const t=e.target.closest('#t-nsl [data-nslv],#t-nsl [data-nsla]');if(!t)return;
  if(t.dataset.nslv){if(t.dataset.nslv===NSLS.v)return;NSLS.v=t.dataset.nslv;nslStop();renderNsl();return;}
  const [vw,...r]=t.dataset.nsla.split(':');const V=NSLR[vw];if(V&&V.act)V.act(r.join(':'),t);
});
const NSLLITE=['qos:an','qos:ap','rrm:surge','chg:rate','chg:gu','chg:thr','chg:vt','chg:bal','chg:n_emb','chg:gb_emb','chg:n_url','chg:gbr_url','chg:n_mtc','chg:mb_mtc','chg:n_fwa'];
function nslInp(el,live){const [vw,k]=el.dataset.nsli.split(':');const P=NSLP[vw];if(!P)return;
  let v=el.type==='checkbox'?(el.checked?1:0):(el.tagName==='SELECT'&&isNaN(+el.value)?el.value:+el.value);P[k]=v;
  const o=el.parentElement.querySelector('output');if(o&&NSLF[vw+':'+k])o.textContent=NSLF[vw+':'+k](v);
  if(live&&!NSLLITE.includes(vw+':'+k))return;
  document.querySelectorAll(`#t-nsl [data-nsli="${vw}:${k}"]`).forEach(x=>{if(x!==el){if(x.type==='checkbox')x.checked=!!v;else x.value=v;const oo=x.parentElement.querySelector('output');if(oo&&NSLF[vw+':'+k])oo.textContent=NSLF[vw+':'+k](v);}});
  const V=NSLR[vw];if(V&&V.upd)V.upd(k,vw);}
document.addEventListener('input',e=>{const el=e.target;if(!el||!el.id){}else if(/^nslc[A-Z][a-z]$/.test(el.id)){nslCalc();return;}else if(el.id==='nslSd'){NSLP.arch.sd=el.value.trim();nslSet('nslEnc',nslEncHtml());return;}
  else if(el.id==='nslvq'){NSLP.vd.q=el.value;nslSet('nslParB',nslParRows());return;}
  if(!el.dataset||!el.dataset.nsli||el.type!=='range')return;nslInp(el,true);});
document.addEventListener('change',e=>{const el=e.target;if(!el.dataset||!el.dataset.nsli)return;nslInp(el,false);});

/* ---------- Gắn thẻ vào ứng dụng ---------- */
RENDER.nsl=renderNsl;
(function(){if(typeof K!=='function'||typeof KL==='undefined')return;try{
  if(typeof KPB!=='undefined'&&!KPB.nsl)KPB.nsl={t:"Network slicing và QoS: đăng ký slice, thông lượng, trễ, PRB, SLA",
    st:["Tách KPI theo S-NSSAI và 5QI, không xem tổng cell: slice nhỏ (URLLC) bị che khi gộp.","Với đăng ký: đọc Rejected NSSAI và cause (#0 PLMN, #1 vùng đăng ký, #2 NSSAA, #3 NSAC) hoặc Reject #62; so Requested với Subscribed và TAI Slice Support List.","Với trễ và thông lượng: đặt PRB theo slice cạnh trễ theo 5QI cùng khung giờ; kiểm tra RRM policy (dedicated/min/max) và SDAP mapping.","Với phiên PDU: cause #69/#67, hạn mức NSACF, tải SMF/UPF của slice, URSP trên UE.","Với SLA: đối chiếu KPI đo với chỉ tiêu hợp đồng, nguồn NWDAF và CDR; ghi nhận chu kỳ vi phạm và hoàn tiền."],
    ca:["TA không khai S-NSSAI","Thiếu RRM policy cho slice ưu tiên","URLLC dồn chung DRB","NSACF đủ hạn mức","URSP không khớp ứng dụng","CHF không trả lời"],
    pa:["TAI Slice Support List, NSSF mapping","rRMPolicyDedicatedRatio/MinRatio/MaxRatio","SDAP mappedQoS-Flows, trọng số 5QI","NSACF quota, URSP, Nchf quota/threshold"],cs:[],gen:1};
  const add=a=>{if(KL.some(k=>k.id===a[0]))return;K(...a);};
  add(["nsl_reg","5G","core","acc","Network Slice Registration Success Rate","ue,cucp,amf,udm","nsl","g|%|90|100|u|99.5|98|99.6",
   "Tỉ lệ % = số S-NSSAI được đưa vào Allowed NSSAI / số S-NSSAI trong Requested NSSAI × 100 (tính riêng từng S-NSSAI).","TS 28.552 (đo lường AMF theo S-NSSAI), TS 28.554 (KPI slice), TS 24.501 (Rejected NSSAI, #62). Tên bộ đếm cần đối chiếu.",
   "?Tra Huawei UNC (đăng ký theo S-NSSAI)","?Tra Ericsson AMF (registration per slice)","?Tra Nokia AMF (registration per S-NSSAI)",
   "Cho biết thuê bao có vào được slice đã bán hay không; tỉ lệ đăng ký tổng vẫn cao khi chỉ slice doanh nghiệp bị từ chối.","≥ 99,5 % mỗi slice.",
   "ue>cucp:RRCSetupComplete (s-NSSAI-List);cucp>amf:Initial UE Message (Requested NSSAI)!A;amf>udm:Subscribed S-NSSAIs;amf>ue:Registration Accept (Allowed NSSAI)!S"]);
  add(["nsl_thp","5G","ran","int","DL Throughput per Network Slice","du,cuup,upf","nsl","g|Mbit/s|0|300|u|50|20|85",
   "Thông lượng = khối lượng DL của các DRB thuộc S-NSSAI / thời gian có dữ liệu (bỏ khe rỗi), trung bình theo UE.","TS 28.552 (DRB.UEThpDl theo S-NSSAI), TS 28.554 (throughput of network slice). Tên bộ đếm cần đối chiếu.",
   "?Tra Huawei NR PM (throughput per slice)","?Tra Ericsson NR PM (per S-NSSAI)","?Tra Nokia 5G PM (per S-NSSAI)",
   "Là chỉ tiêu SLA chính của slice eMBB/FWA; so với cam kết giờ bận.","≥ cam kết SLA (ví dụ eMBB 50 Mbit/s, FWA 100 Mbit/s).",
   "upf>cuup:N3 (DL theo S-NSSAI);cuup>du:F1-U;du>ue:PDSCH!S"]);
  add(["nsl_lat","5G","ran","int","DL Packet Delay per 5QI","du,cuup,ue","nsl","g|ms|0|50|d|5|20|3.2",
   "Trễ TB = tổng trễ gói DL trong gNB (từ PDCP/RLC tới khi gửi xong) / số gói, nhóm theo 5QI.","TS 28.552 (DRB.RlcSduDelayDl, DRB.PdcpSduDelayDl theo QoS). Tên bộ đếm cần đối chiếu.",
   "?Tra Huawei NR PM (delay per 5QI)","?Tra Ericsson NR PM (delay per QoS)","?Tra Nokia 5G PM (delay per 5QI)",
   "So trực tiếp với PDB của 5QI: 5QI 82 có PDB 10 ms cả đường nên phần RAN chỉ còn vài ms.","≤ phần PDB dành cho RAN (5QI 82: ≤ 5 ms, 5QI 1: ≤ 50 ms).",
   "cuup>du:PDCP → RLC (5QI)!A;du>ue:PDSCH, HARQ ACK!S"]);
  add(["nsl_prb","5G","ran","utl","PRB Usage per Network Slice","du","nsl","g|%|0|100|d|70|90|45",
   "Tỉ lệ % = PRB DL dùng cho DRB thuộc S-NSSAI / PRB DL khả dụng × 100.","TS 28.552 (PRB usage theo S-NSSAI), TS 28.541 (RRMPolicyRatio). Tên bộ đếm cần đối chiếu.",
   "?Tra Huawei NR PM (PRB per slice)","?Tra Ericsson NR PM (PRB per slice)","?Tra Nokia 5G PM (PRB per slice)",
   "Cho biết slice có chạm max hoặc dùng hết phần dedicated không; là căn cứ chỉnh RRM policy và tính cước theo tài nguyên.","Dưới max của RRM policy; slice ưu tiên không thiếu so với min.",
   "du>du:Lập lịch theo RRM policy;du>ue:PDSCH theo slice!S"]);
  add(["nsl_sla","5G","core","int","Network Slice SLA Violation Ratio","amf,smf,upf,pcf","nsl","g|%|0|20|d|1|5|0.6",
   "Tỉ lệ % = số chu kỳ đo (15 phút) có ít nhất một KPI SLA vi phạm / tổng chu kỳ × 100, theo slice.","TS 28.554 (KPI slice), TS 28.541 (ServiceProfile), NWDAF (TS 23.288). Chỉ số tự tính.",
   "?Tra Huawei (slice assurance)","?Tra Ericsson (slice assurance)","?Tra Nokia (slice assurance)",
   "Đo trực tiếp cam kết với khách hàng doanh nghiệp, quyết định hoàn tiền.","≤ 1 % chu kỳ mỗi tháng.",
   "upf>smf:Báo cáo sử dụng (URR);smf>pcf:Sự kiện QoS;pcf>amf:Phân tích slice!S"]);
  const XN={nsl_reg:["Tỉ lệ đăng ký slice thành công","Slice reg SR","S-NSSAI|NSSAI|Allowed NSSAI|Rejected NSSAI|network slice","Phần S-NSSAI UE xin được đưa vào Allowed NSSAI."],
    nsl_thp:["Thông lượng DL theo slice","Slice DL thp","network slice|S-NSSAI|thông lượng slice|SLA","Tốc độ DL trung bình của UE trong một slice."],
    nsl_lat:["Trễ gói DL theo 5QI","Delay per 5QI","5QI|PDB|trễ theo QoS|QoS flow","Trễ trong gNB của gói DL, nhóm theo 5QI."],
    nsl_prb:["Tỉ lệ PRB theo slice","PRB per slice","RRM policy|rRMPolicy|PRB slice|network slice","Phần PRB DL dùng cho một slice."],
    nsl_sla:["Tỉ lệ vi phạm SLA của slice","SLA violation","SLA|slice assurance|NWDAF|network slice","Phần chu kỳ đo có KPI SLA không đạt."]};
  const EN={nsl_reg:"Network Slice Registration Success Rate",nsl_thp:"DL Throughput per Network Slice",nsl_lat:"DL Packet Delay per 5QI",nsl_prb:"PRB Usage per Network Slice",nsl_sla:"Network Slice SLA Violation Ratio"};
  for(const id in XN){const k=KL.find(x=>x.id===id);if(!k)continue;const x=XN[id];if(typeof KX!=='undefined')KX[id]=x;if(typeof KEN!=='undefined')KEN[id]=EN[id];
    k.fn=x[0];k.ab=[x[1]].concat(x[2].split('|'));k.gl=x[3];k.dn=k.fn+' ('+x[1]+')';k.en=EN[id];}
  const ids=Object.keys(XN),moved=ids.map(id=>{const i=KL.findIndex(k=>k.id===id);return i>=0?KL.splice(i,1)[0]:null;}).filter(Boolean);
  let j=KL.findIndex(k=>k.id==='pn_fwa');if(j<0)j=KL.findIndex(k=>k.id==='sf_waste');KL.splice(j>=0?j+1:KL.length,0,...moved);
}catch(e){console.error('KPI slicing',e);}})();
/* tìm kiếm chung */
if(typeof qSnap==='function'){const _qs=qSnap;qSnap=function(){_qs.apply(this,arguments);if(!QS||!QS.I||QS.nsl)return;QS.nsl=1;
  const CAT='Thẻ Network slicing, QoS, cước',body=document.getElementById('nslBody'),cur=NSLS.v;
  if(body){for(const [v,vn] of NSLV){try{NSLS.v=v;body.innerHTML=NSLR[v].html();
    body.querySelectorAll('.panel').forEach(pn=>{const h=pn.querySelector('h3'),tt=h?h.textContent:vn,txt=qText(pn).slice(0,6000);if(txt.trim().length<12)return;
      qAdd(QS.I,CAT+' · '+vn,tt,txt,1,()=>{S.tab='nsl';NSLS.v=v;},()=>[...document.querySelectorAll('#t-nsl .panel')].find(p=>{const x=p.querySelector('h3');return x&&x.textContent===tt;}));});}catch(e){console.error(e);}}
    NSLS.v=cur;NSLS.job++;try{if(S.tab==='nsl')renderNsl();else body.innerHTML='';}catch(e){}}
  const go=(v,f)=>()=>{S.tab='nsl';NSLS.v=v;if(f)f();};
  NSLPAR.forEach(r=>qAdd(QS.I,'Slicing, QoS, cước · Tham số '+r[1],r[2],['Huawei: '+r[3],'Nokia: '+r[4],'Ericsson: '+r[5],'Điển hình: '+r[6]].join('. '),3,go('vd',()=>{NSLP.vd.grp=r[1];NSLP.vd.q='';}),'#nslParB'));
  NSLKPI.forEach(k=>qAdd(QS.I,'Slicing, QoS, cước · KPI',k[0],[k[1],k[5]].join('. '),3,go('vd'),'#nslKpB'));
  NSLFLT.forEach(f=>qAdd(QS.I,'Slicing, QoS, cước · Lỗi thường gặp',f[0],[f[1],f[2].join('; '),f[3].join('; ')].join('. '),3,go('vd'),()=>{const d=[...document.querySelectorAll('#t-nsl .nslflt')].find(x=>x.querySelector('summary').textContent===f[0]);if(d)d.open=true;return d;}));
  NSLQI.forEach(r=>qAdd(QS.I,'Slicing, QoS, cước · 5QI','5QI '+r[0]+' ('+NSLQT[r[1]]+')',`Mức ưu tiên ${r[2]}, PDB ${r[3]} ms, PER ${r[4]}. ${r[6]}`,2,go('qos',()=>{NSLP.qos.f=r[1];}),'#nslQiB'));
  Object.values(NSLLAD).forEach(l=>qAdd(QS.I,'Slicing, QoS, cước · Lược đồ bản tin',l.n,l.m.map(q=>q[3]).join('. '),2,go('pol',()=>{NSLP.pol.lad=Object.keys(NSLLAD).find(k=>NSLLAD[k]===l);NSLP.pol.step=0;}),'#nslLad'));
  [['S-NSSAI, SST, SD, NSSF, NSSAI','Configured Requested Allowed Rejected Pending NSSAI AMF set NSSAA NSAC slice-based cell reselection SIB16 NSAG RACH GST NEST NSMF NSSMF','arch'],['QoS 5QI, QFI, ARP, SDAP','GBR non-GBR delay-critical GBR QoS flow DRB reflective QoS RQI RQA AMBR QCI','qos'],
   ['RRM policy chia PRB theo slice','rRMPolicyDedicatedRatio MinRatio MaxRatio cô lập slice dedicated prioritized shared','rrm'],['PCF, URSP, chọn SMF/UPF','PCC rule N7 N15 N5 Gx Rx route selection descriptor traffic descriptor Reject #62 #69','pol'],['Tính cước CHF, Nchf, SLA','converged charging quota rating group CDR online offline Final Unit Indication SLA báo cáo','chg']].forEach(([n,x,v])=>qAdd(QS.I,'Network slicing, QoS, cước',n,x,2,go(v),'#nslBody'));};}
/* thẻ E2E: nút sang thẻ này */
if(typeof e2Kpi==='function'){const _ke=e2Kpi;e2Kpi=function(){_ke.apply(this,arguments);if(!['reg','data','chg'].includes(S.e2Sc)||S.e2R!=='sa')return;const b=$('#e2Kpi .e2go');
  if(b&&!b.querySelector('[data-nslgo]'))b.insertAdjacentHTML('beforeend',S.e2Sc==='reg'?`<button type="button" class="btn sm" data-nslgo="nsl:arch">Slicing · Requested/Allowed NSSAI, NSSF →</button>`:S.e2Sc==='data'?`<button type="button" class="btn sm" data-nslgo="nsl:qos">Slicing · 5QI, QoS flow, RRM policy →</button>`:`<button type="button" class="btn sm" data-nslgo="nsl:chg">Slicing · CHF, Nchf, hạn mức →</button>`);};}
/* thẻ KPI: nút sang mục tương ứng */
const NSLKV={nsl_reg:'arch',nsl_thp:'rrm',nsl_lat:'qos',nsl_prb:'rrm',nsl_sla:'chg',slice5:'pol',qf5:'qos'};
if(typeof kpDetHtml==='function'){const _kd=kpDetHtml;kpDetHtml=function(k){let h=_kd.apply(this,arguments);if(k&&NSLKV[k.id]){const v=NSLKV[k.id];h+=`<p class="u3kpl"><button type="button" class="btn sm" data-nslgo="nsl:${v}">Xem mô phỏng ở thẻ Network slicing · ${nE(NSLV.find(x=>x[0]===v)[1])} →</button></p>`;}return h;};}
/* thanh nút ở các thẻ liên quan */
const NSLTABL={core:[['arch','NSSF, AMF set, NSSAI'],['pol','PCF, URSP, chọn SMF/UPF'],['chg','CHF, Nchf']],sc:[['arch','NSSAA: xác thực theo slice'],['pol','Ladder NSSAA (EAP)']],sf:[['rrm','Chia PRB theo slice (RRM policy)'],['qos','Chia PRB theo 5QI']],prb:[['qos','PRB theo 5QI'],['rrm','PRB theo slice']],vo:[['qos','5QI 1 so với QCI 1, GBR, ARP']]};
const nslBar=t=>`<div class="sclkbar nsllkbar nogl"><span>Mô phỏng ở thẻ <b>Network slicing, QoS và tính cước</b>:</span>${t.map(x=>`<button type="button" class="btn sm" data-nslgo="nsl:${x[0]}">${nE(x[1])} →</button>`).join('')}</div>`;
Object.keys(NSLTABL).forEach(t=>{const f=RENDER[t];if(typeof f!=='function')return;RENDER[t]=function(){const r=f.apply(this,arguments);try{const sec=document.getElementById('t-'+t);if(sec&&!sec.querySelector('.nsllkbar')){const ld=sec.querySelector('.lead');if(ld)ld.insertAdjacentHTML('afterend',nslBar(NSLTABL[t]));else sec.insertAdjacentHTML('afterbegin',nslBar(NSLTABL[t]));}}catch(e){}return r;};});
/* thẻ Mạng riêng 5G: mục svc (slice, 5QI) và vd (URSP) */
if(typeof PNR!=='undefined'){[['svc',[['arch','S-NSSAI, NSSAI, NSSF'],['qos','5QI 82, QoS flow, SDAP'],['rrm','PRB dành riêng cho slice nhà máy'],['chg','Cước và SLA slice URLLC, FWA']]],['vd',[['pol','URSP: ứng dụng → S-NSSAI, DNN'],['vd','Tham số slice, 5QI, cước']]]].forEach(([v,L])=>{const R=PNR[v];if(!R||typeof R.html!=='function')return;const h=R.html;
  R.html=function(){return h.apply(this,arguments)+`<div class="panel nslpnp">${nslBar(L)}</div>`;};});
  if(typeof PNTB!=='undefined'&&Array.isArray(PNTB)&&!PNTB.some(x=>x[0]==='nsl'))PNTB.push(['nsl','Network slicing, QoS, cước']);}
/* chuyên đề cắt lát, QoS ở thẻ book */
if(typeof RENDER.book==='function'){const _b=RENDER.book;RENDER.book=function(){const r=_b.apply(this,arguments);try{const sec=document.getElementById('t-book');if(sec){const o=sec.querySelector('.nsllkbar');if(o)o.remove();
  const M={slice:[['arch','Kiến trúc slice, NSSF'],['rrm','Chia PRB theo slice']],qos:[['qos','5QI, SDAP, QoS phản ánh']],slice2:[['pol','URSP, NSSAA, #69'],['rrm','RRM policy']]}[S.bk];if(M){const ld=sec.querySelector('.lead');if(ld)ld.insertAdjacentHTML('afterend',nslBar(M));}}}catch(e){}return r;};}

