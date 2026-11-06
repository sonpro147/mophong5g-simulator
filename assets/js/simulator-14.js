
/* ===== Thẻ UDM và dữ liệu thuê bao (udm) — đợt 20 lộ trình (BRIEF 22) ===== */
const UDXS={v:"arch",raf:0,last:0,pause:false,lt:0,pa:0,ga:0,gt:0,job:0,plog:[],pcur:-1,ia:0};UDXS.pa=1;
const UDXV=[['arch','Kiến trúc UDM, UDR, AUSF'],['svc','Dịch vụ Nudm, Nausf, Nudr'],['data','Dữ liệu thuê bao, provisioning'],['geo','Dự phòng và bão đăng ký'],['iwk','Liên hoạt động HSS–UDM'],['vd','Tham số, KPI, lỗi']];
const UDXR={},UDXP={},UDXF={};
function udxSl(vw,k,l,mn,mx,st,f,hint,pk){UDXF[vw+':'+k]=f;const v=UDXP[vw][k];
  return `<label class="c"><span class="cl">${l}<output>${f(v)}</output></span><input type="range" data-udxi="${vw}:${k}" min="${mn}" max="${mx}" step="${st}" value="${v}">${hint?`<span class="u3ph">${hint}</span>`:''}${pk?udxPnTag(pk):''}</label>`;}
function udxSel(vw,k,l,opts,hint,pk){const v=UDXP[vw][k];
  return `<label class="c"><span class="cl">${l}</span><select data-udxi="${vw}:${k}">${opts.map(o=>`<option value="${o[0]}"${String(o[0])===String(v)?' selected':''}>${nE(o[1])}</option>`).join('')}</select>${hint?`<span class="u3ph">${hint}</span>`:''}${pk?udxPnTag(pk):''}</label>`;}
function udxChk(vw,k,l,pk){return `<label class="u3ck"><input type="checkbox" data-udxi="${vw}:${k}"${UDXP[vw][k]?' checked':''}> ${l}</label>${pk?udxPnTag(pk):''}`;}
function udxPn(key){const r=(typeof UDXPAR!=='undefined'?UDXPAR:[]).find(x=>x[0]===key);if(!r)return'';const v=nVn();if(v==='3gpp')return'';
  return nVName(v)+': '+r[{huawei:3,nokia:4,ericsson:5}[v]]+' (cần đối chiếu)';}
function udxPnTag(key){const t=udxPn(key);return t?`<span class="vh ndvh">${nE(t)}</span>`:'';}
const udxKv=(a,b)=>`<dt>${a}</dt><dd>${b}</dd>`;
const udxSet=(id,h)=>{const e=document.getElementById(id);if(e)e.innerHTML=h;};
const udxMs=x=>!isFinite(x)?'—':x>=1?nF(x,x<10?2:1)+' s':nF(x*1000,x<0.01?1:0)+' ms';
const udxK=x=>x>=1e6?nF(x/1e6,2)+' triệu':x>=1000?nF(x/1000,1)+' nghìn':nF(x,0);
function udxPlayBtn(vw,id){return `<button type="button" class="btn sm" data-udxa="${vw}:play" id="${id}">${UDXS.pause?'▶ Chạy':'⏸ Dừng'}</button>`;}
function udxPlayTog(id){UDXS.pause=!UDXS.pause;const b=document.getElementById(id);if(b)b.textContent=UDXS.pause?'▶ Chạy':'⏸ Dừng';}
function udxJson(o,ind){ind=ind||'';const n=ind+'  ';
  if(o===null)return '<span class="n">null</span>';
  if(Array.isArray(o))return o.length?'[\n'+o.map(x=>n+udxJson(x,n)).join(',\n')+'\n'+ind+']':'[]';
  if(typeof o==='object'){const k=Object.keys(o);return k.length?'{\n'+k.map(x=>`${n}<span class="k">"${nE(x)}"</span>: ${udxJson(o[x],n)}`).join(',\n')+'\n'+ind+'}':'{}';}
  if(typeof o==='string')return `<span class="s">"${nE(o)}"</span>`;return `<span class="n">${nE(String(o))}</span>`;}

/* ---------- Bộ vẽ lược đồ bản tin dùng chung ---------- */
const UDXLX=[50,172,294,416,538,656];
function udxLadSvg(L,cur,did){const n=L.m.length,X=UDXLX,C=L.c;let s='';
  C.forEach((c,i)=>{s+=`<text x="${X[i]}" y="18" class="udxtx" text-anchor="middle">${nE(c)}</text><line x1="${X[i]}" y1="26" x2="${X[i]}" y2="${36+n*26}" style="stroke:var(--line);stroke-width:1.4"/>`;});
  L.m.forEach((q,i)=>{const y=44+i*26,a=X[q[0]],b=X[q[1]],on=i<=cur,c=i===cur?'var(--warn)':on?'var(--ink)':'var(--line)',tx=q[3].length>60?q[3].slice(0,58)+'…':q[3];
    if(a===b)s+=`<path d="M${a} ${y-6} h24 v12 h-24" style="fill:none;stroke:${c};stroke-width:1.4"/><text x="${a>500?a-6:a+30}" y="${y+4}" class="udxsm" text-anchor="${a>500?'end':'start'}" style="fill:${on?'var(--ink)':'var(--muted)'}">${nE(tx)}</text>`;
    else{const dir=b>a?1:-1;s+=`<line x1="${a}" y1="${y}" x2="${b}" y2="${y}" style="stroke:${c};stroke-width:${i===cur?2.4:1.3}"/><path d="M${b} ${y} l${-dir*7} -4 v8z" style="fill:${c}"/><text x="${Math.min(a,b)+8}" y="${y-5}" class="udxsm" style="fill:${on?'var(--ink)':'var(--muted)'}">${nE(tx)}</text>`;}});
  s+=`<circle id="${did}" r="5" cx="-20" cy="-20" class="udxdot"/>`;
  return `<svg viewBox="0 0 706 ${50+n*26}" class="u3svg udxsvg" role="img" aria-label="Lược đồ bản tin ${nE(L.n)}">${s}</svg>`;}
function udxLadLog(L,cur){return nLog(L.m.slice(0,cur+1).map((q,i)=>({t:i*0.015,p:q[2],m:q[3],a:L.c[q[0]]+' → '+L.c[q[1]],d:q[4]})),cur);}
function udxLadDot(L,step,did){const q=L.m[step],d=document.getElementById(did);if(!d||!q)return;const f=Math.min(1,UDXS.lt/0.9),a=UDXLX[q[0]],b=UDXLX[q[1]];
  d.setAttribute('cx',a===b?a+12:a+(b-a)*f);d.setAttribute('cy',44+step*26);}

/* ---------- Mục 1: kiến trúc ---------- */
const UDXN={ue:[40,190,'UE',''],gnb:[130,190,'gNB',''],amf:[250,110,'AMF',''],smf:[250,250,'SMF',''],mme:[250,340,'MME','4G'],sepp:[110,56,'SEPP','khách ↔ nhà'],
 ausf:[420,50,'AUSF',''],udm:[420,172,'UDM','ARPF · SIDF'],hss:[420,300,'HSS-FE','S6a · Cx · SWx'],udr:[600,172,'UDR','dữ liệu'],pcf:[600,56,'PCF',''],nef:[640,292,'NEF',''],cscf:[540,350,'S-CSCF','IMS']};
const UDXE=[['ue','gnb','Uu'],['gnb','amf','N2'],['amf','smf','N11'],['amf','ausf','N12'],['ausf','udm','N13'],['amf','udm','N8'],['smf','udm','N10'],['udm','udr','N35'],['pcf','udr','N36'],['nef','udr','N37'],['hss','udr','Ud'],['mme','hss','S6a'],['cscf','hss','Cx'],['amf','sepp','N32'],['sepp','ausf','N32'],['udm','hss','hội tụ']];
const UDX4G=['mme','hss','cscf'];
const UDXPR={
 auth:{n:'Xác thực khi đăng ký (5G-AKA)',h:[['ue','gnb','Registration Request (SUCI)'],['gnb','amf','N2: Initial UE Message'],['amf','ausf','Nausf_UEAuthentication_Authenticate (SUCI, tên mạng phục vụ)'],['ausf','udm','Nudm_UEAU_Get: generate-auth-data'],['udm','udm','SIDF giải SUCI → SUPI bằng khoá riêng mạng nhà'],['udm','udr','Nudr: đọc K, OPc, SQN (authentication-subscription)'],['udr','udm','ARPF tạo 5G HE AV, ghi SQN mới'],['udm','ausf','5G HE AV (RAND, AUTN, XRES*, KAUSF) + SUPI'],['ausf','amf','5G SE AV (RAND, AUTN, HXRES*)'],['amf','ue','Authentication Request → Response (RES*)'],['amf','ausf','RES*: AUSF so với XRES*'],['ausf','udm','Nudm_UEAU_ResultConfirmation (ghi sự kiện xác thực)']]},
 reg:{n:'Đăng ký với UDM (UECM, SDM)',h:[['amf','udm','Nudm_UECM_Registration (amf-3gpp-access)'],['udm','udr','Nudr: ghi AMF đang phục vụ (context-data)'],['amf','udm','Nudm_SDM_Get: AM data, SMF selection, UE context in SMF'],['udm','udr','Nudr: đọc provisioned-data'],['udr','udm','AM data: GPSI, UE-AMBR, NSSAI, hạn chế RAT và vùng'],['udm','amf','200 OK dữ liệu thuê bao'],['amf','udm','Nudm_SDM_Subscribe (nhận thay đổi gói cước)'],['amf','ue','Registration Accept (Allowed NSSAI)']]},
 pdu:{n:'Lập phiên PDU (SM data)',h:[['ue','amf','PDU Session Establishment Request (DNN, S-NSSAI)'],['amf','smf','Nsmf_PDUSession_CreateSMContext'],['smf','udm','Nudm_UECM_Registration (smf-registrations)'],['smf','udm','Nudm_SDM_Get sm-data (DNN, S-NSSAI)'],['udm','udr','Nudr: đọc sm-data'],['udr','udm','5QI, ARP, Session-AMBR, loại PDU, SSC'],['udm','smf','200 OK sm-data'],['smf','udm','Nudm_SDM_Subscribe (sm-data)'],['smf','amf','N1N2: PDU Session Establishment Accept'],['amf','ue','QoS rule, Session-AMBR']]},
 pol:{n:'UDR dùng chung: PCF, NEF',h:[['pcf','udr','N36 Nudr: đọc policy-data (gói, hạn mức)'],['udr','pcf','PolicyData: dịch vụ, hạn mức đã dùng'],['pcf','udr','Nudr subscribe thay đổi policy-data'],['nef','udr','N37: application-data, exposure-data (AF)'],['udr','pcf','Notify: AF yêu cầu điều hướng lưu lượng'],['udr','udm','Một UDR, nhiều tập dữ liệu: subscription, policy, exposure, application']]},
 conv:{n:'HSS+UDM hội tụ (4G, IMS)',h:[['mme','hss','S6a AIR (IMSI): xin EPS AV'],['hss','udr','đọc cùng K, SQN với 5G'],['hss','mme','AIA (EPS AV)'],['mme','hss','S6a ULR (MME đang phục vụ)'],['hss','udm','UE đang có AMF → huỷ đăng ký phía 5G'],['udm','amf','Nudm_UECM_DeregistrationNotification'],['hss','mme','ULA: APN, AMBR từ cùng hồ sơ'],['cscf','hss','Cx SAR: tải hồ sơ IMS'],['hss','cscf','SAA: iFC, IMPU']]},
 roam:{n:'Chuyển vùng quốc tế (qua SEPP)',h:[['amf','sepp','AMF khách: Nausf qua vSEPP → hSEPP (N32)'],['sepp','ausf','N32-f: TLS hoặc PRINS'],['ausf','udm','Nudm_UEAU_Get (kiểm tên mạng phục vụ)'],['udm','udr','đọc authentication-subscription'],['udm','ausf','5G HE AV'],['ausf','sepp','5G SE AV'],['sepp','amf','về AMF khách'],['amf','sepp','Nudm_UECM_Registration, SDM_Get qua SEPP'],['sepp','udm','UDM nhà kiểm roaming, ODB, SoR'],['udm','sepp','AM data hoặc 403 ROAMING_NOT_ALLOWED']]}
};
UDXP.arch={pr:'auth',step:0,conv:1,dm:'sl',sites:2};
function udxArchHops(){const P=UDXP.arch,h=UDXPR[P.pr].h;if(P.dm==='sl')return h;
  return h.map(x=>x[0]==='udm'&&x[1]==='udr'||x[0]==='udr'&&x[1]==='udm'?['udm','udm',x[2]+' (lưu ngay trong UDM)']:x[1]==='udr'&&x[0]!=='udm'?[x[0],'udm',x[2]+' (UDM giữ dữ liệu)']:x[0]==='udr'?['udm',x[1],x[2]]:x);}
function udxArchSvg(){const P=UDXP.arch,H=udxArchHops(),cur=H[P.step]||H[0],N=UDXN;let s='';
  const dim=k=>(!P.conv&&UDX4G.includes(k))||(P.dm==='st'&&k==='udr');
  UDXE.forEach(([a,b,l])=>{if(l==='hội tụ'&&!P.conv)return;const A=N[a],B=N[b],on=cur&&((cur[0]===a&&cur[1]===b)||(cur[0]===b&&cur[1]===a)),dm=dim(a)||dim(b);
    s+=`<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" class="udxe${on?' on':''}${dm?' dim':''}${l==='hội tụ'||(P.dm==='st'&&l==='N35')?' dsh':''}"/><text x="${(A[0]+B[0])/2+4}" y="${(A[1]+B[1])/2-4}" class="udxif">${l}</text>`;});
  Object.entries(N).forEach(([k,n])=>{const on=cur&&(cur[0]===k||cur[1]===k),w=k==='udm'||k==='udr'?96:78,h=k==='udm'||k==='udr'?46:32;
    s+=`<g class="udxn${on?' on':''}${dim(k)?' dim':''}"><rect x="${n[0]-w/2}" y="${n[1]-h/2}" width="${w}" height="${h}" rx="${k==='udr'?14:7}"/><text x="${n[0]}" y="${n[1]+(n[3]?-2:4)}" class="udxtx" text-anchor="middle">${n[2]}</text>${n[3]?`<text x="${n[0]}" y="${n[1]+12}" class="udxsm" text-anchor="middle">${nE(n[3])}</text>`:''}</g>`;});
  if(P.sites>1)s+=`<text x="600" y="214" class="udxsm" text-anchor="middle">${P.sites} site, sao chép</text>`;
  s+=`<circle id="udxADot" r="6" cx="-20" cy="-20" class="udxdot"/>`;
  return `<svg viewBox="0 0 700 380" class="u3svg udxsvg" role="img" aria-label="Sơ đồ UDM, UDR, AUSF và các NF liên quan">${s}</svg>`;}
function udxArchLog(){const P=UDXP.arch,H=udxArchHops();return nLog(H.slice(0,P.step+1).map((h,i)=>({t:i*0.02,p:UDX4G.includes(h[0])||UDX4G.includes(h[1])?(h[0]==='cscf'||h[1]==='cscf'?'DIA':'DIA'):h[0]==='ue'||h[1]==='ue'?'NAS':'SBI',m:h[2],a:UDXN[h[0]][2]+' → '+UDXN[h[1]][2]})),P.step);}
function udxArchUpd(){udxSet('udxArch',udxArchSvg());udxSet('udxALog',udxArchLog());const H=udxArchHops();udxSet('udxACap',`<b>Bước ${UDXP.arch.step+1}/${H.length}:</b> ${nE(H[UDXP.arch.step][2])}`);}
UDXR.arch={
 html(){const P=UDXP.arch;
  return `<div class="panel"><h3>Các NF quản lý dữ liệu thuê bao</h3><div class="scroll"><table class="ndtb"><thead><tr><th>NF</th><th>Vai trò</th><th>Giao diện chính</th><th>Tương đương 4G/3G</th></tr></thead><tbody>
   <tr><td><b>UDM</b> (Unified Data Management)</td><td>Front-end xử lý logic: tạo vector xác thực, quản lý đăng ký AMF/SMF/SMSF (UECM), cấp dữ liệu thuê bao (SDM), sự kiện (EE), cập nhật tham số (PP), SoR/UPU</td><td>N8 (AMF), N10 (SMF), N13 (AUSF), N21 (SMSF), N52 (NEF), N35 (UDR)</td><td>HSS (S6a), HLR (MAP C/D/Gr)</td></tr>
   <tr><td><b>ARPF</b></td><td>Chức năng trong UDM giữ K, OPc, chạy MILENAGE/TUAK tạo AV</td><td>Nội bộ UDM</td><td>AuC</td></tr>
   <tr><td><b>SIDF</b></td><td>Chức năng trong UDM giải SUCI → SUPI bằng khoá riêng mạng nhà (ECIES Profile A/B)</td><td>Nội bộ UDM</td><td>Không có (IMSI gửi rõ)</td></tr>
   <tr><td><b>AUSF</b></td><td>Máy chủ xác thực ở mạng nhà: so RES*, giữ KAUSF, bảo vệ SoR và UPU</td><td>N12 (AMF), N13 (UDM)</td><td>Một phần HSS/AAA</td></tr>
   <tr><td><b>UDR</b></td><td>Back-end lưu trữ: subscription data, policy data, exposure data, application data</td><td>N35 (UDM), N36 (PCF), N37 (NEF)</td><td>Back-end UDC (Ud, TS 23.335)</td></tr>
   <tr><td><b>HSS+UDM</b></td><td>Nút hội tụ phục vụ cả EPC (S6a), IMS (Cx, Sh), Wi-Fi (SWx) và 5GC, dùng chung một hồ sơ</td><td>S6a, Cx, Sh, SWx + N8/N10/N13</td><td>TS 23.632 (liên hoạt động, cùng tồn tại)</td></tr></tbody></table></div>
   <p class="note">Kiến trúc front-end/back-end: UDM không trạng thái (dễ scale, nhiều phiên bản trong NF set), dữ liệu nằm ở UDR; TS 23.501 cho phép UDM tự lưu dữ liệu nếu không có UDR. Giải SUCI thật bằng X25519 và cây khoá có ở <button type="button" class="u3lnkbtn" data-scgo="sc:aka">thẻ Bảo mật · 5G-AKA, SUCI, SIDF</button>; credential cho mạng riêng SNPN (EAP-TLS, AAA bên ngoài) ở <button type="button" class="u3lnkbtn" data-pngo="pn:arch">thẻ Mạng riêng 5G · mô hình triển khai</button>.</p></div>
  <div class="panel"><h3>Sơ đồ: chấm chạy theo thủ tục</h3>
   <div class="seg u3seg sfsub" role="group" aria-label="Thủ tục">${Object.entries(UDXPR).map(([k,v])=>`<button type="button" data-udxa="arch:pr|${k}" aria-pressed="${k===P.pr}">${nE(v.n)}</button>`).join('')}</div>
   <div class="ctl" style="margin-top:8px">${udxChk('arch','conv','HSS+UDM hội tụ (hiện MME, IMS)','conv')}${udxSel('arch','dm','Lưu dữ liệu',[['sl','UDM không trạng thái + UDR riêng'],['st','UDM tự lưu (không UDR)']],'','geo')}${udxSl('arch','sites',' Số site UDR',1,3,1,v=>v+' site','','repl')}</div>
   <div class="row">${udxPlayBtn('arch','udxAPlay')}<button type="button" class="btn sm" data-udxa="arch:prev">◀ Bước trước</button><button type="button" class="btn sm" data-udxa="arch:next">Bước sau ▶</button></div>
   <p class="hint" id="udxACap" aria-live="polite"></p>
   <div class="scroll"><div class="udxw" id="udxArch">${udxArchSvg()}</div></div><div id="udxALog">${udxArchLog()}</div></div>
  <div class="panel"><h3>Ai đọc gì ở UDR</h3><div class="scroll"><table class="ndtb"><thead><tr><th>Tập dữ liệu UDR</th><th>NF dùng</th><th>Ví dụ nội dung</th></tr></thead><tbody>
   <tr><td>subscription-data</td><td>UDM (N35)</td><td>authentication-subscription, am-data, sm-data, smf-selection, sms-data, context-data (AMF/SMF đang phục vụ)</td></tr>
   <tr><td>policy-data</td><td>PCF (N36)</td><td>gói dịch vụ, hạn mức dùng, sponsor, nhóm ứng dụng</td></tr>
   <tr><td>exposure-data</td><td>NEF (N37)</td><td>vị trí, trạng thái kết nối được phép mở cho AF</td></tr>
   <tr><td>application-data</td><td>PCF, NEF</td><td>yêu cầu ảnh hưởng lưu lượng từ AF, dữ liệu PFD</td></tr></tbody></table></div>
   <p class="note">Chính sách theo slice, URSP và PCF chi tiết ở <button type="button" class="u3lnkbtn" data-nslgo="nsl:pol">thẻ Network slicing · chính sách</button>.</p></div>`;},
 after(){udxArchUpd();},
 upd(k){if(k==='conv'&&!UDXP.arch.conv&&UDXP.arch.pr==='conv')UDXP.arch.pr='auth';UDXP.arch.step=Math.min(UDXP.arch.step,udxArchHops().length-1);udxArchUpd();},
 tick(dt){const P=UDXP.arch,H=udxArchHops(),q=H[P.step],d=document.getElementById('udxADot');if(!UDXS.pause)UDXS.lt+=dt;
  if(d&&q){const f=Math.min(1,UDXS.lt/0.9),A=UDXN[q[0]],B=UDXN[q[1]];d.setAttribute('cx',q[0]===q[1]?A[0]+Math.cos(f*6.28)*30:A[0]+(B[0]-A[0])*f);d.setAttribute('cy',q[0]===q[1]?A[1]+Math.sin(f*6.28)*16:A[1]+(B[1]-A[1])*f);}
  if(!UDXS.pause&&UDXS.lt>1.6){UDXS.lt=0;P.step=(P.step+1)%H.length;udxArchUpd();}},
 act(a){const P=UDXP.arch,[k,v]=a.split('|');
  if(k==='pr'){P.pr=v;P.step=0;UDXS.lt=0;if(v==='conv')P.conv=1;renderUdm();}else if(k==='play')udxPlayTog('udxAPlay');
  else if(k==='next'||k==='prev'){const n=udxArchHops().length;P.step=(P.step+(k==='next'?1:n-1))%n;UDXS.lt=0;udxArchUpd();if(nReduced())UDXR.arch.tick(0);}}
};

/* ---------- Mục 2: dịch vụ Nudm, Nausf, Nudr ---------- */
const UDXSV=[
 ['Nudm_UEAU','Get (generate-auth-data), ResultConfirmation, GetHssAv','AUSF, HSS-FE','Tạo vector xác thực, ghi kết quả, đồng bộ lại SQN (AUTS)','TS 29.503'],
 ['Nudm_UECM','Registration, Deregistration, DeregistrationNotification, Get, Update, PEI update','AMF, SMF, SMSF','Ghi nhận NF đang phục vụ UE; báo AMF cũ khi đổi AMF','TS 29.503'],
 ['Nudm_SDM','Get, Subscribe, Unsubscribe, Notification, Info (SoR, UPU, NSSAI ack)','AMF, SMF, SMSF','Cấp và đẩy thay đổi dữ liệu thuê bao (AM, SM, SMF selection, SMS, NSSAI)','TS 29.503'],
 ['Nudm_EE','Subscribe, Notify, Unsubscribe','NEF, AF','Sự kiện: mất kết nối, đổi vị trí, roaming, đổi PEI','TS 29.503'],
 ['Nudm_PP','Update (5G VN group, CAG, tham số dự kiến UE)','NEF','Cập nhật tham số từ bên ngoài','TS 29.503'],
 ['Nudm_NIDDAU, MT, SSAU','Ủy quyền NIDD, truy vấn MT, xác thực theo dịch vụ','NEF, AMF','Dịch vụ phụ (IoT, vị trí, dịch vụ đặc thù)','TS 29.503'],
 ['Nausf_UEAuthentication','Authenticate (5G-AKA, EAP-AKA′), Confirmation, Deregister','AMF','Xác thực chính, dẫn xuất KSEAF','TS 29.509'],
 ['Nausf_SoRProtection, UPUProtection','Protect','UDM','Bảo vệ toàn vẹn danh sách SoR và cập nhật tham số UE','TS 29.509'],
 ['Nudr_DataRepository','Query, Create, Delete, Update, Subscribe, Notify','UDM, PCF, NEF','Đọc ghi UDR theo cây tài nguyên /subscription-data, /policy-data, /exposure-data, /application-data','TS 29.504, 29.505']];
const UDXC6=['UE','AMF','AUSF','UDM','UDR','SMF · PCF'];
const UDXLAD={
 reg:{n:'Đăng ký ban đầu',c:UDXC6,m:[[0,1,'NAS','Registration Request (SUCI, initial)','qua gNB, N2 Initial UE Message'],[1,2,'SBI','POST Nausf_UEAuthentication_Authenticate (SUCI, SN name)',''],[2,3,'SBI','POST Nudm_UEAU …/{suci}/security-information/generate-auth-data','SIDF giải SUCI → SUPI'],
  [3,4,'SBI','GET Nudr …/{supi}/authentication-data/authentication-subscription','K, OPc, SQN'],[3,4,'SBI','PATCH …/authentication-subscription (SQN mới)','ARPF tăng SQN'],[3,2,'SBI','200 OK: 5G HE AV (RAND, AUTN, XRES*, KAUSF), SUPI',''],[2,1,'SBI','201 Created: 5G SE AV (RAND, AUTN, HXRES*)',''],
  [1,0,'NAS','Authentication Request (RAND, AUTN, ngKSI)',''],[0,1,'NAS','Authentication Response (RES*)','MAC sai → #20, SQN lệch → #21 kèm AUTS'],[1,2,'SBI','PUT …/5g-aka-confirmation (RES*)','AUSF so RES* với XRES*'],[2,3,'SBI','POST Nudm_UEAU_ResultConfirmation (auth-events)',''],
  [1,0,'NAS','Security Mode Command / Complete',''],[1,3,'SBI','PUT Nudm_UECM …/{supi}/registrations/amf-3gpp-access','UDM ghi AMF đang phục vụ'],[3,4,'SBI','PUT Nudr …/context-data/amf-3gpp-access',''],
  [1,3,'SBI','GET Nudm_SDM …/{supi}?dataset-names=AM,SMF_SEL,UEC_SMF',''],[3,4,'SBI','GET Nudr …/provisioned-data',''],[1,3,'SBI','POST Nudm_SDM …/{supi}/sdm-subscriptions (callback AMF)','để nhận đổi gói cước'],
  [1,5,'SBI','Npcf_AMPolicyControl_Create','PCF đọc policy-data qua N36'],[1,0,'NAS','Registration Accept (5G-GUTI, Allowed NSSAI)',''],[0,1,'NAS','Registration Complete','']]},
 pdu:{n:'Lập phiên PDU',c:UDXC6,m:[[0,1,'NAS','PDU Session Establishment Request (DNN internet, S-NSSAI 1)',''],[1,5,'SBI','Nsmf_PDUSession_CreateSMContext','AMF chọn SMF theo SMF selection data'],[5,3,'SBI','PUT Nudm_UECM …/registrations/smf-registrations/{pduSessionId}',''],
  [3,4,'SBI','PUT Nudr …/context-data/smf-registrations',''],[5,3,'SBI','GET Nudm_SDM …/sm-data?single-nssai=…&dnn=internet',''],[3,4,'SBI','GET Nudr …/provisioned-data/sm-data',''],
  [3,5,'SBI','200 OK sm-data: IPv4v6, SSC 1, 5QI 9, ARP 8, Session-AMBR','gói cước quyết định 5QI và AMBR mặc định'],[5,3,'SBI','POST Nudm_SDM_Subscribe (sm-data)',''],[5,5,'SBI','Npcf_SMPolicyControl_Create → PCC rule','PCF đọc policy-data qua N36'],
  [5,1,'SBI','Namf_Communication_N1N2MessageTransfer',''],[1,0,'NAS','PDU Session Establishment Accept (QoS rule, Session-AMBR)','']]},
 amf:{n:'Đổi AMF',c:['UE','AMF mới','AMF cũ','UDM','UDR','SMF'],m:[[0,1,'NAS','Registration Request (mobility, 5G-GUTI cũ)','UE sang vùng của AMF set khác'],[1,2,'SBI','Namf_Communication_UEContextTransfer','lấy ngữ cảnh, không cần xác thực lại nếu khớp'],
  [2,1,'SBI','200 OK UE context (SUPI, khoá, phiên PDU)',''],[1,3,'SBI','PUT Nudm_UECM amf-3gpp-access (AMF mới)',''],[3,4,'SBI','PUT Nudr …/amf-3gpp-access (ghi đè AMF)',''],
  [3,2,'SBI','POST Nudm_UECM_DeregistrationNotification (UE_REGISTRATION_AREA_CHANGE)','AMF cũ xoá ngữ cảnh'],[2,3,'SBI','DELETE Nudm_SDM_Unsubscribe',''],[1,3,'SBI','GET Nudm_SDM (AM data) + POST Subscribe',''],
  [1,5,'SBI','Nsmf_PDUSession_UpdateSMContext (AMF mới)',''],[1,0,'NAS','Registration Accept (5G-GUTI mới)','']]},
 roam:{n:'Chuyển vùng',c:['UE','AMF khách','vSEPP · hSEPP','AUSF nhà','UDM nhà','UDR nhà'],m:[[0,1,'NAS','Registration Request (SUCI của PLMN nhà)',''],[1,2,'SBI','Nausf_UEAuthentication_Authenticate (N32)','vSEPP–hSEPP: TLS hoặc PRINS'],
  [2,3,'SBI','chuyển tới AUSF nhà',''],[3,4,'SBI','Nudm_UEAU_Get (SUCI, serving network name)','UDM kiểm mạng phục vụ có được phép'],[4,5,'SBI','Nudr query authentication-subscription',''],[4,3,'SBI','5G HE AV',''],
  [3,1,'SBI','5G SE AV qua SEPP','mạng nhà vẫn quyết định kết quả xác thực'],[1,0,'NAS','Authentication Request / Response',''],[1,4,'SBI','Nudm_UECM_Registration (AMF khách) qua SEPP',''],
  [1,4,'SBI','Nudm_SDM_Get AM data, SoR','UDM có thể gửi danh sách PLMN ưu tiên (Steering of Roaming)'],[4,5,'SBI','Nudr: roaming, ODB, hạn chế vùng',''],[4,1,'SBI','200 OK am-data hoặc 403 ROAMING_NOT_ALLOWED','bị cấm: AMF trả #11 hoặc #13'],[1,0,'NAS','Registration Accept (+ SoR container)','']]},
 upd:{n:'Đổi gói cước (subscribe/notify)',c:['BSS/CRM','PG provisioning','UDR','UDM','AMF','SMF · UE'],m:[[0,1,'OAM','Lệnh đổi gói: 5G 300 Mbit/s, thêm slice FWA','từ CRM, hệ thống tính cước'],[1,2,'OAM','REST/SOAP/LDAP cập nhật am-data, sm-data','PG kiểm tra hợp lệ rồi ghi UDR'],
  [2,3,'SBI','Nudr_DataRepository_Notify (subscription-data thay đổi)','UDM đã subscribe UDR'],[3,4,'SBI','POST Nudm_SDM_Notification (am-data: UE-AMBR, NSSAI)','tới callback AMF đã subscribe'],[3,5,'SBI','POST Nudm_SDM_Notification (sm-data: Session-AMBR, 5QI)','tới SMF'],
  [4,5,'NAS','UE Configuration Update Command (Configured NSSAI mới)','AMF cập nhật NSSAI cho UE'],[5,5,'NAS','PDU Session Modification Command (Session-AMBR mới)','SMF → UPF: N4 cập nhật QER'],[2,1,'OAM','Kết quả ghi UDR',''],[1,0,'OAM','Hoàn tất lệnh','KPI: tỉ lệ thông báo SDM thành công']]},
 sync:{n:'Đồng bộ lại SQN (AUTS)',c:UDXC6,m:[[0,1,'NAS','Registration Request (SUCI)',''],[1,2,'SBI','Nausf_UEAuthentication_Authenticate',''],[2,3,'SBI','Nudm_UEAU_Get',''],
  [3,2,'SBI','5G HE AV (SQN_HE = 1205)','SQN ở UDR bị lùi, ví dụ khôi phục từ bản sao cũ'],[1,0,'NAS','Authentication Request (RAND, AUTN)',''],[0,0,'NAS','USIM: SQN_HE ngoài cửa sổ (SQN_MS = 1380)',''],
  [0,1,'NAS','Authentication Failure #21 Synch failure (AUTS)',''],[1,2,'SBI','Nausf_UEAuthentication_Authenticate (RAND, AUTS)',''],[2,3,'SBI','Nudm_UEAU_Get (resynchronizationInfo: RAND, AUTS)','ARPF giải AUTS lấy SQN_MS, đặt SQN_HE = SQN_MS + 1'],
  [3,4,'SBI','PATCH Nudr SQN mới',''],[3,2,'SBI','5G HE AV mới',''],[1,0,'NAS','Authentication Request mới → thành công','KPI: tỉ lệ sync failure ở thẻ Bảo mật']]}
};
UDXP.svc={lad:'reg',step:0};
function udxSvcUpd(){const P=UDXP.svc,L=UDXLAD[P.lad];udxSet('udxLad',udxLadSvg(L,P.step,'udxLDot'));udxSet('udxLadLog',udxLadLog(L,P.step));}
UDXR.svc={
 html(){const P=UDXP.svc;
  return `<div class="panel"><h3>Dịch vụ SBI của UDM, AUSF, UDR</h3><div class="scroll"><table class="ndtb"><thead><tr><th>Dịch vụ</th><th>Thao tác</th><th>NF gọi</th><th>Dùng để</th><th>Đặc tả</th></tr></thead><tbody>${UDXSV.map(r=>`<tr><td><b>${nE(r[0])}</b></td><td>${nE(r[1])}</td><td>${nE(r[2])}</td><td>${nE(r[3])}</td><td>${nE(r[4])}</td></tr>`).join('')}</tbody></table></div>
   <p class="note">Mọi dịch vụ chạy trên HTTP/2, JSON, OAuth2 (token từ NRF); AMF tìm UDM qua NRF theo dải SUPI, routing indicator trong SUCI hoặc nhóm UDM (UDM group ID). Lỗi trả về dạng ProblemDetails có trường cause, ví dụ USER_NOT_FOUND, DATA_NOT_FOUND, CONTEXT_NOT_FOUND.</p></div>
  <div class="panel"><h3>Lược đồ bản tin từng bước</h3><div class="seg u3seg sfsub" role="group" aria-label="Kịch bản bản tin">${Object.entries(UDXLAD).map(([k,v])=>`<button type="button" data-udxa="svc:lad|${k}" aria-pressed="${k===P.lad}">${nE(v.n)}</button>`).join('')}</div>
   <div class="row">${udxPlayBtn('svc','udxLPlay')}<button type="button" class="btn sm" data-udxa="svc:prev">◀ Bước trước</button><button type="button" class="btn sm" data-udxa="svc:next">Bước sau ▶</button></div>
   <div class="scroll"><div class="udxw" id="udxLad">${udxLadSvg(UDXLAD[P.lad],P.step,'udxLDot')}</div></div><div id="udxLadLog">${udxLadLog(UDXLAD[P.lad],P.step)}</div>
   <p class="note">Toàn bộ luồng có RAN, NAS, NGAP ở <button type="button" class="u3lnkbtn" data-udxgo="e2:reg:sa">thẻ E2E · Đăng ký 5G SA</button>, <button type="button" class="u3lnkbtn" data-udxgo="e2:data:sa">thẻ E2E · Dữ liệu 5G SA</button>, <button type="button" class="u3lnkbtn" data-udxgo="e2:roam:sa">thẻ E2E · Roaming</button>. Đồng bộ SQN/AUTS và MAC failure được giải thích cùng với MILENAGE ở <button type="button" class="u3lnkbtn" data-scgo="sc:aka">thẻ Bảo mật</button>.</p></div>`;},
 after(){},
 upd(){},
 tick(dt){const P=UDXP.svc,L=UDXLAD[P.lad];if(!UDXS.pause)UDXS.lt+=dt;udxLadDot(L,P.step,'udxLDot');
  if(!UDXS.pause&&UDXS.lt>1.5){UDXS.lt=0;P.step=(P.step+1)%L.m.length;udxSvcUpd();}},
 act(a){const P=UDXP.svc,[k,v]=a.split('|');
  if(k==='lad'){P.lad=v;P.step=0;UDXS.lt=0;renderUdm();}else if(k==='play')udxPlayTog('udxLPlay');
  else if(k==='next'||k==='prev'){const n=UDXLAD[P.lad].m.length;P.step=(P.step+(k==='next'?1:n-1))%n;UDXS.lt=0;udxSvcUpd();if(nReduced())UDXR.svc.tick(0);}}
};

/* ---------- Mục 3: mô hình dữ liệu và provisioning ---------- */
const UDXPLAN={eco:{n:'Gói 5G tiết kiệm',ad:50,au:20,sad:50,sau:20,q:9,arp:9,s_emb:1,s_url:0,s_fwa:0,d_int:1,d_ims:1,d_ent:0,ims:1},
 max:{n:'Gói 5G cao cấp',ad:1000,au:200,sad:1000,sau:200,q:8,arp:7,s_emb:1,s_url:0,s_fwa:0,d_int:1,d_ims:1,d_ent:0,ims:1},
 ent:{n:'Doanh nghiệp (URLLC + DNN riêng)',ad:500,au:200,sad:300,sau:150,q:9,arp:6,s_emb:1,s_url:1,s_fwa:0,d_int:1,d_ims:1,d_ent:1,ims:1},
 fwa:{n:'FWA hộ gia đình',ad:500,au:100,sad:500,sau:100,q:9,arp:9,s_emb:0,s_url:0,s_fwa:1,d_int:1,d_ims:0,d_ent:0,ims:0}};
const UDXSTN={act:'Đang hoạt động',odb:'Chặn dữ liệu (ODB, nợ cước)',lock:'Khoá dịch vụ',del:'Đã xoá khỏi UDR'};
const UDXSNS={emb:{sst:1,sd:'',n:'eMBB'},url:{sst:2,sd:'0000A1',n:'URLLC'},fwa:{sst:1,sd:'00F0A0',n:'FWA'}};
UDXP.data=Object.assign({st:'act',plan:'max',nr:1,lte:1,roam:1,sms:1,view:'am'},UDXPLAN.max);
const udxAmbr=x=>x>=1000?nF(x/1000,x%1000?1:0)+' Gbps':x+' Mbps';
function udxSubSn(){const P=UDXP.data;return Object.keys(UDXSNS).filter(k=>P['s_'+k]);}
function udxSnObj(k){const s=UDXSNS[k];return s.sd?{sst:s.sst,sd:s.sd}:{sst:s.sst};}
function udxDoc(){const P=UDXP.data,sn=udxSubSn(),def=sn.includes('emb')?'emb':sn[0];
  if(P.st==='del')return {'404':{title:'Not Found',status:404,cause:'USER_NOT_FOUND',detail:'SUPI imsi-001010000000123 không có trong UDR'}};
  const rat=[];if(!P.nr)rat.push('NR');if(!P.lte)rat.push('EUTRA');
  const am={gpsis:['msisdn-84900000123'],subscribedUeAmbr:{uplink:udxAmbr(P.au),downlink:udxAmbr(P.ad)},nssai:{defaultSingleNssais:def?[udxSnObj(def)]:[],singleNssais:sn.filter(k=>k!==def).map(udxSnObj)},
   ratRestrictions:rat,subsRegTimer:3240,rfspIndex:P.plan==='max'?1:P.plan==='fwa'?20:10,mpsPriority:false,micoAllowed:P.plan==='fwa'};
  if(P.st==='lock')am.coreNetworkTypeRestrictions=['5GC','EPC'];
  if(P.st==='odb')am.odbPacketServices='BARRING_ALL_EXCEPT_IMS (ví dụ)';
  if(!P.roam)am.odbPacketServices=am.odbPacketServices||'ROAMER_ACCESS_HPLMN_AP_BARRED';
  const dnns=k=>[P.d_int&&k!=='url'?{dnn:'internet',defaultDnnIndicator:true}:null,P.d_ims&&k==='emb'?{dnn:'ims'}:null,P.d_ent&&k==='url'?{dnn:'factory.ent'}:null].filter(Boolean);
  const smfSel={subscribedSnssaiInfos:Object.fromEntries(sn.map(k=>[UDXSNS[k].sst+(UDXSNS[k].sd?'-'+UDXSNS[k].sd:''),{dnnInfos:dnns(k)}]))};
  const dc=(dnn,q,arp,ad,au,ssc)=>({pduSessionTypes:{defaultSessionType:dnn==='ims'?'IPV6':'IPV4V6'},sscModes:{defaultSscMode:ssc||'SSC_MODE_1'},'5gQosProfile':{'5qi':q,arp:{priorityLevel:arp,preemptCap:'NOT_PREEMPT',preemptVuln:'PREEMPTABLE'},priorityLevel:q===5?10:q===82?19:q===8?80:90},sessionAmbr:{uplink:udxAmbr(au),downlink:udxAmbr(ad)}});
  const sm=sn.map(k=>{const c={};dnns(k).forEach(d=>{c[d.dnn]=d.dnn==='ims'?dc('ims',5,2,2,2):d.dnn==='factory.ent'?dc(d.dnn,82,P.arp,P.sad,P.sau,'SSC_MODE_1'):dc(d.dnn,P.q,P.arp,P.sad,P.sau);});return {singleNssai:udxSnObj(k),dnnConfigurations:c};});
  const sms={smsSubscribed:!!P.sms},auth={authenticationMethod:'5G_AKA',encPermanentKey:'(mã hoá, không hiển thị)',protectionParameterId:'1',sequenceNumber:{sqn:'000000000F3C',sqnScheme:'NON_TIME_BASED',lastIndexes:{ausf:28}},authenticationManagementField:'8000',algorithmId:'milenage'};
  const ims={imsProfile:P.ims?{impu:['sip:+84900000123@ims.mnc001.mcc001.3gppnetwork.org','tel:+84900000123'],ifc:'MMTel AS (VoNR/VoLTE)'}:null};
  return {am,smfSel,sm,sms,auth,ims};}
const UDXDV=[['am','am-data (N8, AMF)'],['smfSel','smf-selection-subscription-data'],['sm','sm-data (N10, SMF)'],['sms','sms-subscription-data'],['auth','authentication-subscription'],['ims','IMS (Cx/Sh hoặc Nhss)']];
function udxDocHtml(){const P=UDXP.data,D=udxDoc(),k=P.st==='del'?'404':P.view,base='/nudr-dr/v2/subscription-data/imsi-001010000000123';
  const path={am:'/provisioned-data/am-data',smfSel:'/provisioned-data/smf-selection-subscription-data',sm:'/provisioned-data/sm-data',sms:'/provisioned-data/sms-data',auth:'/authentication-data/authentication-subscription',ims:' (hồ sơ IMS ở HSS hội tụ)','404':''}[k];
  return `<p class="hint">GET ${nE(base+path)}</p><pre class="udxjs">${udxJson(D[k])}</pre>`;}
function udxTry(){const P=UDXP.data,sn=udxSubSn(),R=[];const add=(a,b,c,d)=>R.push([a,b,c,d]);
  if(P.st==='del'){add('Đăng ký 5G','no','AUSF/UDM trả 404 USER_NOT_FOUND → Registration Reject #3 Illegal UE (ánh xạ thường gặp, cần đối chiếu cấu hình AMF)','svc');
    add('Lập phiên PDU','mid','Không thực hiện được vì chưa đăng ký','');add('Gọi thoại IMS','mid','Không thực hiện được','');add('Chuyển vùng','mid','Không thực hiện được','');return R;}
  if(P.st==='lock'){add('Đăng ký 5G','no','coreNetworkTypeRestrictions chứa 5GC → Registration Reject #7 5GS services not allowed (hoặc #3 tuỳ cấu hình)','svc');add('Đăng ký 4G','no','HSS+UDM từ chối ULR → Attach Reject (#7 EPS services not allowed)','iwk');add('Lập phiên PDU','mid','Không thực hiện được','');return R;}
  if(!P.nr){add('Đăng ký 5G','no','ratRestrictions = NR → Registration Reject #27 N1 mode not allowed; UE ở lại 4G nếu được phép','svc');}
  else{const al=sn.map(k=>UDXSNS[k].n);add('Đăng ký 5G','ok',`Registration Accept. UE xin eMBB, URLLC, FWA → Allowed NSSAI {${al.join(', ')||'trống'}}`+(sn.length<3?`; còn lại vào Rejected NSSAI cause #0`:'')+(sn.length?'':' → không có slice nào: Registration Reject #62'),'svc');}
  add('Đăng ký 4G (EPS)',P.lte?'ok':'no',P.lte?'HSS+UDM trả ULA cùng hồ sơ (APN internet, ims)':'ratRestrictions = EUTRA → DIAMETER_ERROR_RAT_NOT_ALLOWED → Attach Reject (#15 thường gặp)','iwk');
  const okReg=P.nr&&sn.length;
  if(okReg){
    if(P.st==='odb')add('Phiên PDU internet','no','ODB chặn dữ liệu → PDU Session Establishment Reject #8 Operator determined barring','svc');
    else if(P.d_int&&(P.s_emb||P.s_fwa))add('Phiên PDU internet','ok',`5QI ${P.q}, ARP ${P.arp}, Session-AMBR ${udxAmbr(P.sad)}/${udxAmbr(P.sau)}; UE-AMBR ${udxAmbr(P.ad)}`,'svc');
    else add('Phiên PDU internet','no','DNN internet không có trong sm-data của slice → Reject #27 Missing or unknown DNN','svc');
    if(P.d_ims&&P.ims&&P.s_emb)add('Phiên PDU ims (VoNR)','ok','DNN ims, 5QI 5 cho báo hiệu SIP; cuộc gọi tạo 5QI 1 (xem thẻ VoLTE và IMS)','svc');
    else add('Phiên PDU ims (VoNR)','no',!P.ims?'Không có hồ sơ IMS → không đăng ký IMS, không VoNR/VoLTE':'Thiếu DNN ims trên slice eMBB → #27','svc');
    if(P.s_url&&P.d_ent&&P.st!=='odb')add('Phiên PDU factory.ent (URLLC)','ok','S-NSSAI 2/0000A1, 5QI 82 (DC-GBR), xem thẻ Network slicing','svc');
    else add('Phiên PDU factory.ent (URLLC)','no',!P.s_url?'S-NSSAI URLLC không được đăng ký → Rejected NSSAI #0, PDU bị từ chối':P.st==='odb'?'ODB chặn dữ liệu → #8':'Thiếu DNN factory.ent → #27','svc');
  }
  add('Chuyển vùng quốc tế',P.roam?'ok':'no',P.roam?'UDM nhà cho phép, có thể gửi SoR':'ODB roaming → 403 ROAMING_NOT_ALLOWED → AMF khách trả #11 PLMN not allowed hoặc #13','svc');
  add('SMS qua NAS',P.sms?'ok':'mid',P.sms?'AMF chọn SMSF, SMSF gọi Nudm_UECM_Registration (smsf-3gpp-access)':'Không đăng ký SMSF; chỉ còn SMS over IP nếu có IMS','');
  return R;}
function udxTryHtml(){return `<div class="scroll"><table class="ndtb udxres"><thead><tr><th>Thủ tục</th><th>Kết quả</th><th>Diễn giải</th></tr></thead><tbody>${udxTry().map(r=>`<tr><td>${nE(r[0])}</td><td class="${r[1]}">${r[1]==='ok'?'Thành công':r[1]==='no'?'Bị từ chối':'Không áp dụng'}</td><td>${nE(r[2])}${r[3]?` <button type="button" class="u3lnkbtn" data-udxgo="udm:${r[3]}">lược đồ →</button>`:''}</td></tr>`).join('')}</tbody></table></div>`;}
const UDXPV={open:{n:'Mở thuê bao',st:'act',e:['CRM tạo hợp đồng, PG ghi đủ bộ: auth K/OPc, am-data, sm-data','UDR tạo bản ghi mới; chưa có AMF nào subscribe','UE bật máy: đăng ký đầy đủ, AUSF lấy AV lần đầu (SQN khởi tạo)']},
 chg:{n:'Đổi gói cước',st:null,e:['PG cập nhật am-data (UE-AMBR, NSSAI) và sm-data (Session-AMBR, 5QI)','UDR báo UDM (Nudr Notify) → Nudm_SDM_Notification tới AMF, SMF','AMF gửi UE Configuration Update, SMF sửa phiên PDU, UPF đổi QER ngay không cần đăng ký lại']},
 odb:{n:'Chặn dữ liệu (nợ cước)',st:'odb',e:['PG đặt ODB packet services (trừ IMS)','UDM báo SMF qua SDM Notification','SMF giải phóng phiên internet (cause #8 khi lập lại); thoại và khẩn cấp vẫn được']},
 lock:{n:'Khoá dịch vụ',st:'lock',e:['PG đặt hạn chế 5GC và EPC','UDM gửi Nudm_UECM_DeregistrationNotification (SUBSCRIPTION_WITHDRAWN) tới AMF','AMF huỷ đăng ký UE (Deregistration Request phía mạng), giải phóng mọi phiên']},
 del:{n:'Xoá thuê bao',st:'del',e:['PG xoá bản ghi trên mọi site UDR','UDM gửi DeregistrationNotification (SUBSCRIPTION_WITHDRAWN) tới AMF/SMF/SMSF đang phục vụ','Lần đăng ký sau: 404 USER_NOT_FOUND']},
 res:{n:'Mở lại',st:'act',e:['PG gỡ ODB/khoá','UDM gửi SDM Notification','UE đăng ký lại bình thường (sau khi bị huỷ đăng ký cần chờ UE thử lại hoặc khởi động lại)']}};
const UDXPC=['CRM / BSS','PG','UDR','UDM','AMF · SMF'];
function udxProvSvg(){const X=[60,200,340,480,620];let s='';X.forEach((x,i)=>{if(i)s+=`<line x1="${X[i-1]+48}" y1="40" x2="${x-48}" y2="40" class="udxe"/>`;s+=`<g class="udxn"><rect x="${x-48}" y="22" width="96" height="36" rx="7"/><text x="${x}" y="45" class="udxtx" text-anchor="middle">${UDXPC[i]}</text></g>`;});
  return `<svg viewBox="0 0 680 70" class="u3svg udxsvg" role="img" aria-label="Chuỗi provisioning">${s}<circle id="udxPDot" r="6" cx="-20" cy="40" class="udxdot"/></svg>`;}
function udxProv(k){const P=UDXP.data,V=UDXPV[k];if(V.st)P.st=V.st;
  const t0=UDXS.plog.length?UDXS.plog[UDXS.plog.length-1].t+0.4:0;
  V.e.forEach((e,i)=>UDXS.plog.push({t:t0+i*0.12,p:i===0?'OAM':i===1?'SBI':'NAS',m:(i?'':V.n+': ')+e,a:i===0?'CRM → PG → UDR':i===1?'UDR → UDM → AMF/SMF':'Mạng → UE'}));
  if(UDXS.plog.length>18)UDXS.plog=UDXS.plog.slice(-18);UDXS.pcur=UDXS.plog.length-1;UDXS.pa=0;}
function udxDataUpd(full){udxSet('udxDoc',udxDocHtml());udxSet('udxTry',udxTryHtml());udxSet('udxPLog',nLog(UDXS.plog,UDXS.pcur));udxSet('udxSt',`<span class="udxst ${UDXP.data.st}">${UDXSTN[UDXP.data.st]}</span>`);
  if(full)document.querySelectorAll('#t-udm [data-udxi^="data:"]').forEach(x=>{const k=x.dataset.udxi.split(':')[1],v=UDXP.data[k];if(x.type==='checkbox')x.checked=!!v;else x.value=v;const o=x.parentElement.querySelector('output');if(o&&UDXF['data:'+k])o.textContent=UDXF['data:'+k](v);});}
UDXR.data={
 html(){const P=UDXP.data,am=v=>udxAmbr(v);
  return `<div class="panel"><h3>Thuê bao mẫu imsi-001010000000123 <span id="udxSt"></span></h3>
   <p class="hint">Sửa trực tiếp hồ sơ; bảng JSON và kết quả thử các thủ tục cập nhật ngay. Mỗi thay đổi ở đây tương ứng một lệnh provisioning ghi vào UDR.</p>
   <div class="ctl">${udxSel('data','plan','Gói cước',Object.entries(UDXPLAN).map(([k,v])=>[k,v.n]),'','ambr')}${udxSl('data','ad','UE-AMBR DL',10,2000,10,am,'','ambr')}${udxSl('data','au','UE-AMBR UL',5,500,5,am)}${udxSl('data','sad','Session-AMBR DL',10,2000,10,am)}${udxSl('data','sau','Session-AMBR UL',5,500,5,am)}
    ${udxSel('data','q','5QI mặc định (internet)',[[9,'9 (non-GBR, mặc định)'],[8,'8 (ưu tiên hơn)'],[7,'7 (video/thoại tương tác)'],[6,'6 (TCP ưu tiên)']],'','q5')}${udxSl('data','arp','ARP (mức ưu tiên)',1,15,1,v=>v)}</div>
   <div class="ctl" style="margin-top:6px">${udxChk('data','s_emb','S-NSSAI eMBB (SST 1)')}${udxChk('data','s_url','S-NSSAI URLLC (2/0000A1)')}${udxChk('data','s_fwa','S-NSSAI FWA (1/00F0A0)')}${udxChk('data','d_int','DNN internet')}${udxChk('data','d_ims','DNN ims')}${udxChk('data','d_ent','DNN factory.ent')}</div>
   <div class="ctl" style="margin-top:6px">${udxChk('data','nr','Cho phép NR (5G)','rat')}${udxChk('data','lte','Cho phép E-UTRA (4G)')}${udxChk('data','roam','Cho phép chuyển vùng','odb')}${udxChk('data','sms','SMS qua NAS')}${udxChk('data','ims','Có hồ sơ IMS')}</div>
   <p class="note">S-NSSAI, NSSAI và 5QI giải thích đầy đủ ở <button type="button" class="u3lnkbtn" data-nslgo="nsl:arch">thẻ Network slicing · S-NSSAI, NSSAI</button> và <button type="button" class="u3lnkbtn" data-nslgo="nsl:qos">thẻ Network slicing · 5QI, ARP</button>.</p></div>
  <div class="udxtwo"><div class="panel"><h3>Dữ liệu ở UDR (JSON)</h3><div class="seg u3seg sfsub" role="group" aria-label="Tập dữ liệu">${UDXDV.map(v=>`<button type="button" data-udxa="data:view|${v[0]}" aria-pressed="${v[0]===P.view}">${nE(v[1])}</button>`).join('')}</div><div id="udxDoc"></div></div>
   <div class="panel"><h3>Thử các thủ tục với hồ sơ này</h3><div id="udxTry"></div></div></div>
  <div class="panel"><h3>Provisioning và ảnh hưởng tới mạng</h3><div class="row">${Object.entries(UDXPV).map(([k,v])=>`<button type="button" class="btn sm" data-udxa="data:prov|${k}">${nE(v.n)}</button>`).join('')}<button type="button" class="btn sm" data-udxa="data:clr">Xoá nhật ký</button></div>
   <div class="scroll"><div class="udxw">${udxProvSvg()}</div></div><div id="udxPLog"></div>
   <p class="note">Đổi gói không cần UE đăng ký lại nhờ cơ chế Nudm_SDM_Subscribe/Notification (xem lược đồ «Đổi gói cước» ở <button type="button" class="u3lnkbtn" data-udxgo="udm:svc">mục 2</button>). Khoá hoặc xoá dùng Nudm_UECM_DeregistrationNotification với lý do SUBSCRIPTION_WITHDRAWN. Cấu trúc dữ liệu theo TS 29.505 (Nudr subscription data) và TS 29.503 (Nudm).</p></div>`;},
 after(){udxDataUpd();},
 upd(k){const P=UDXP.data;if(k==='plan'){Object.assign(P,UDXPLAN[P.plan]);udxProv('chg');udxDataUpd(true);return;}udxDataUpd();},
 tick(dt){if(UDXS.pa<1){UDXS.pa=Math.min(1,UDXS.pa+dt/2.4);const d=document.getElementById('udxPDot');if(d)d.setAttribute('cx',60+560*UDXS.pa);if(UDXS.pa>=1&&d)d.setAttribute('cx',-20);}},
 act(a){const P=UDXP.data,[k,v]=a.split('|');
  if(k==='view'){P.view=v;document.querySelectorAll('#t-udm [data-udxa^="data:view"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.udxa==='data:view|'+v));udxSet('udxDoc',udxDocHtml());}
  else if(k==='prov'){udxProv(v);udxDataUpd(true);if(nReduced())UDXS.pa=1;}
  else if(k==='clr'){UDXS.plog=[];UDXS.pcur=-1;udxDataUpd();}}
};

/* ---------- Mục 4: dự phòng địa lý và bão đăng ký ---------- */
UDXP.geo={sites:2,mode:'aa',cap:2500,base:600,ev:'both',nue:1000,spread:30,det:10,bo:1,bomin:30,bomax:600,olc:1,tmo:3,repl:'async',rdel:200};
const UDXGT=900,UDXG0=120;
function udxGSim(ovr){const Q=Object.assign({},UDXP.geo,ovr||{}),T=UDXGT,t0=UDXG0,rnd=nRng(7+Q.nue*3+Q.sites*11+Q.cap);
  const nS=+Q.sites,aa=Q.mode==='aa',udr=Q.ev!=='storm',storm=Q.ev!=='udr',N=storm?Q.nue*1000:0;
  const capN=aa?nS*Q.cap:Q.cap,capF=nS>1?(aa?(nS-1)*Q.cap:Q.cap):0;
  const H=T+Math.max(Q.bomax,20)+5,Db=new Float64Array(H+2),Ds=new Float64Array(H+2);let cb=0,cs=0;
  const addR=(isS,t,c,lo,hi)=>{if(c<=0)return;lo=Math.min(H,t+lo);hi=Math.min(H,Math.max(lo,t+hi));const D=isS?Ds:Db,per=c/(hi-lo+1);D[lo]+=per;D[hi+1]-=per;};
  const retry=(isS,t,c,rej)=>{if(Q.bo&&rej)addR(isS,t,c,Q.bomin,Q.bomax);else if(Q.bo)addR(isS,t,c,Math.min(Q.bomin,15),Math.max(Q.bomin,15)+5);else addR(isS,t,c,5,15);};
  const off=[],ok=[],wst=[],rej=[],lat=[],reg=[],capA=[],fail=[];let q=[],sOk=0,sAtt=0,wTot=0,rTot=0,fTot=0,pk=0,t99=null;
  const lw=udr&&Q.repl==='async'?Math.round(Q.base*2*Q.rdel/1000):0,lat0=0.012+(Q.repl==='sync'&&nS>1?Q.rdel/1000:0);
  for(let t=0;t<T;t++){cb+=Db[t];cs+=Ds[t];
    const dead=udr&&t>=t0&&t<t0+Q.det?(aa?1/nS:1):0,cap=udr&&t>=t0?(t<t0+Q.det&&!aa?0:capF):capN;
    let b=Math.max(0,Q.base*(1+0.06*nGs(rnd))),s=storm&&t>=t0&&t<t0+Q.spread?N/Q.spread:0;
    b+=Math.max(0,cb);s+=Math.max(0,cs);if(udr&&t===t0+Q.det&&lw)b+=lw;sAtt+=s;const O=b+s;
    let fb=b*dead,fs=s*dead;b-=fb;s-=fs;fTot+=fb+fs;
    if(fb+fs>0){retry(false,t+Q.tmo,fb,false);retry(true,t+Q.tmo,fs,false);}
    let rb=0,rs=0;
    if(Q.olc){const ql=q.reduce((a,c)=>a+c.b+c.s,0),room=Math.max(0,cap*Math.min(1,Q.tmo*0.5)-ql+cap*0.95),inn=b+s;
      if(inn>room){const f=(inn-room)/inn;rb=b*f;rs=s*f;b-=rb;s-=rs;retry(false,t,rb,true);retry(true,t,rs,true);}}
    if(b+s>0)q.push({a:t,b,s,f:0});
    q.forEach(c=>{if(!c.f&&t-c.a>=Q.tmo){c.f=1;retry(false,t,c.b,false);retry(true,t,c.s,false);}});
    let srv=cap,okb=0,oks=0,w=0,wsum=0;
    while(srv>1e-9&&q.length){const c=q[0],tot=c.b+c.s,take=Math.min(srv,tot),fr=take/tot;srv-=take;
      if(c.f)w+=take;else{okb+=c.b*fr;oks+=c.s*fr;wsum+=take*(t-c.a);}c.b-=c.b*fr;c.s-=c.s*fr;if(c.b+c.s<1e-6)q.shift();}
    q=q.filter(c=>t-c.a<=60);
    const ql=q.reduce((a,c)=>a+c.b+c.s,0),L=lat0+(okb+oks>0?wsum/(okb+oks):0)+(cap>0?Math.min(60,ql/cap)*0:0);
    const Lq=cap>0?ql/cap:(ql>0?60:0);
    sOk+=oks;wTot+=w;rTot+=rb+rs;
    off.push([t,O]);ok.push([t,okb+oks]);wst.push([t,w+fb+fs]);rej.push([t,rb+rs]);capA.push([t,cap]);
    const lt=Math.min(60,lat0+Lq);lat.push([t,lt]);if(t>=t0)pk=Math.max(pk,lt);fail.push([t,fb+fs]);
    const r=N?Math.min(1,sOk/N):1;reg.push([t,r*100]);if(N&&t99==null&&r>=0.99)t99=t-t0;}
  return {off,ok,wst,rej,lat,reg,capA,N,t99,pk,wTot,rTot,fTot,att:N?sAtt/N:0,lw,capN,capF,lat0};}
let UDXGR=null;
function udxGRun(){UDXGR={a:udxGSim(),b:udxGSim({bo:0,olc:0}),c:udxGSim({bo:1,olc:1})};}
function udxGPlot(){const A=UDXGR.a,cur=UDXS.ga*UDXGT,ym=Math.max(A.capN,...A.off.map(p=>p[1]))*1.05,k=v=>v/1000;
  return nPlot({w:640,h:210,x0:0,x1:UDXGT,y0:0,y1:k(ym),yt:[0,.25,.5,.75,1].map(f=>+(k(ym)*f).toFixed(1)),yd:1,xt:[0,120,300,500,700,900],xf:v=>v+' s',ylab:'nghìn/s',cur,
   bands:[[UDXG0,UDXG0+UDXP.geo.det,'var(--warn)',.14]],marks:[[UDXG0,'sự cố','var(--warn)',0]],
   series:[{pts:A.off.map(p=>[p[0],k(p[1])]),c:'var(--muted)',w:1.6,dash:'5 4'},{pts:A.capA.map(p=>[p[0],k(p[1])]),c:'var(--lte)',w:1.6},{pts:A.ok.map(p=>[p[0],k(p[1])]),c:'var(--nr)',w:2.2},{pts:A.wst.map(p=>[p[0],k(p[1])]),c:'#E5484D',w:1.6}],aria:'Tải đăng ký và xử lý thành công theo thời gian'})
   +uLeg([['Yêu cầu tới (kể cả thử lại)','var(--muted)'],['Năng lực còn lại','var(--lte)'],['Xử lý thành công','var(--nr)'],['Hỏng/quá hạn (bỏ phí)','#E5484D']]);}
function udxGPlot2(){const A=UDXGR.a,B=UDXGR.b,cur=UDXS.ga*UDXGT,yl=Math.max(UDXP.geo.tmo*2,Math.min(60,A.pk*1.1),0.5);
  return `<div class="udxtwo"><div>${nPlot({w:320,h:190,x0:0,x1:UDXGT,y0:0,y1:100,yt:[0,50,100],xt:[0,300,600],xf:v=>v+' s',ylab:'% UE',cur,
   series:[{pts:B.reg,c:'var(--muted)',w:1.6,dash:'5 4'},{pts:A.reg,c:'var(--nr)',w:2.2}],aria:'Tỉ lệ UE đã đăng ký lại'})}${uLeg([['Cấu hình đang chọn','var(--nr)'],['Không back-off, không chống quá tải','var(--muted)']])}</div>
   <div>${nPlot({w:320,h:190,x0:0,x1:UDXGT,y0:0,y1:yl,yt:[0,yl/2,yl].map(v=>+v.toFixed(1)),yd:1,xt:[0,300,600],xf:v=>v+' s',ylab:'giây',cur,hl:[[UDXP.geo.tmo,'var(--warn)','hết giờ']],
   series:[{pts:A.lat,c:'var(--acc)',w:2}],aria:'Độ trễ xử lý Nudm'})}${uLeg([['Độ trễ chờ ở UDM','var(--acc)']])}</div></div>`;}
function udxGTbl(){const P=UDXP.geo,row=(n,R)=>`<tr><td>${n}</td><td>${R.N?(R.t99!=null?nF(R.t99,0)+' s':'> '+(UDXGT-UDXG0)+' s'):'—'}</td><td>${udxMs(R.pk)}</td><td>${R.N?nF(R.att,2):'—'}</td><td>${udxK(R.wTot+R.fTot)}</td><td>${udxK(R.rTot)}</td></tr>`;
  return `<div class="scroll"><table class="ndtb"><thead><tr><th>Phương án</th><th>Về 99 % UE đăng ký</th><th>Trễ đỉnh</th><th>Số lần thử/UE</th><th>Yêu cầu hỏng, bỏ phí</th><th>Từ chối sớm (503, T3346)</th></tr></thead><tbody>
   ${row('Cấu hình đang chọn',UDXGR.a)}${row('Không back-off, không chống quá tải',UDXGR.b)}${row('Back-off + chống quá tải',UDXGR.c)}</tbody></table></div>
   <p class="note">${P.ev!=='storm'?`Mất site: ${P.mode==='aa'?'các site còn lại gánh ngay phần tải, chỉ yêu cầu gửi tới site hỏng trong '+P.det+' s phát hiện bị mất':'site dự phòng chỉ nhận tải sau '+P.det+' s phát hiện, mọi yêu cầu trong khoảng đó đều hỏng'}. `:''}${P.ev!=='storm'&&P.sites>1?(P.repl==='async'?`Sao chép không đồng bộ ${P.rdel} ms: khoảng ${nF(UDXGR.a.lw,0)} lần ghi (SQN, đăng ký AMF) chưa kịp sang site khác → có thể gây sync failure (AUTS) hoặc đọc sai AMF đang phục vụ.`:`Sao chép đồng bộ: không mất dữ liệu nhưng mỗi lần ghi chậm thêm ${P.rdel} ms (trễ nền ${udxMs(UDXGR.a.lat0)}).`):''}${P.sites<2&&P.ev!=='storm'?' Chỉ 1 site: mất site là mất dịch vụ hoàn toàn.':''}</p>`;}
function udxGNow(){const A=UDXGR.a,i=Math.min(UDXGT-1,Math.floor(UDXS.ga*UDXGT)),P=UDXP.geo;
  return `<div class="udxbig"><div><span>Thời điểm</span><b>${i} s</b></div><div><span>Yêu cầu tới</span><b>${udxK(A.off[i][1])}/s</b></div><div><span>Thành công</span><b>${udxK(A.ok[i][1])}/s</b></div><div><span>Trễ chờ</span><b>${udxMs(A.lat[i][1])}</b></div><div><span>UE đã đăng ký lại</span><b>${A.N?nF(A.reg[i][1],1)+' %':'—'}</b></div></div>`;}
function udxGeoSvg(){const P=UDXP.geo,i=Math.floor(UDXS.ga*UDXGT),down=P.ev!=='storm'&&i>=UDXG0,X=[130,350,570].slice(0,P.sites);let s='';
  s+=`<g class="udxn"><rect x="270" y="10" width="160" height="30" rx="7"/><text x="350" y="30" class="udxtx" text-anchor="middle">AMF set · SCP · NRF</text></g>`;
  X.forEach((x,k)=>{const dd=down&&k===0,stb=P.mode==='as'&&k>0&&!(down&&k===1&&i>=UDXG0+P.det);
    s+=`<line x1="350" y1="40" x2="${x}" y2="86" class="udxe${dd||stb?' dim dsh':''}"/>`;
    s+=`<g class="udxn${dd?' dead':''}${stb?' dim':''}"><rect x="${x-80}" y="86" width="160" height="104" rx="9"/><text x="${x}" y="104" class="udxtx" text-anchor="middle">Site ${'ABC'[k]}${P.mode==='as'?(k===0?' (chính)':' (dự phòng)'):''}</text>
     <text x="${x}" y="126" class="udxsm" text-anchor="middle">UDM FE × 3 · AUSF</text><rect x="${x-44}" y="138" width="88" height="40" rx="12"/><text x="${x}" y="162" class="udxsm" text-anchor="middle">UDR bản sao</text></g>`;
    if(dd)s+=`<path d="M${x-30} 110 l60 60 M${x+30} 110 l-60 60" style="stroke:#E5484D;stroke-width:3"/>`;});
  for(let k=1;k<X.length;k++)s+=`<line x1="${X[k-1]+44}" y1="158" x2="${X[k]-44}" y2="158" class="udxe${down&&k===1?' dim':''}"/><text x="${(X[k-1]+X[k])/2}" y="150" class="udxif" text-anchor="middle">${P.repl==='async'?'không đồng bộ':'đồng bộ'} ${P.rdel} ms</text><circle class="udxrep" r="4" cx="-9" cy="158" data-x0="${X[k-1]+44}" data-x1="${X[k]-44}"/>`;
  return `<svg viewBox="0 0 700 200" class="u3svg udxsvg" role="img" aria-label="Các site UDM và UDR">${s}</svg>`;}
let UDXGL=0;
UDXR.geo={
 html(){const P=UDXP.geo;if(!UDXGR)udxGRun();
  return `<div class="panel"><h3>Dự phòng địa lý UDM/UDR</h3>
   <div class="ctl">${udxSel('geo','sites','Số site',[[1,'1 site'],[2,'2 site'],[3,'3 site']])}${udxSel('geo','mode','Mô hình',[['aa','Active-active (chia tải)'],['as','Active-standby']],'','geo')}${udxSel('geo','repl','Sao chép UDR',[['async','Không đồng bộ'],['sync','Đồng bộ']],'','repl')}${udxSl('geo','rdel','Trễ sao chép',10,2000,10,v=>v+' ms')}${udxSl('geo','det','Thời gian phát hiện lỗi, chuyển tải',2,60,1,v=>v+' s','NRF heartbeat, SCP health check','det')}</div>
   <div class="scroll"><div class="udxw" id="udxGeo">${udxGeoSvg()}</div></div></div>
  <div class="panel"><h3>Mô phỏng tải theo thời gian (900 s, sự cố ở giây 120)</h3>
   <div class="ctl">${udxSel('geo','ev','Sự cố',[['udr','Mất 1 site UDM/UDR'],['storm','Bão đăng ký (AMF/RAN khởi động lại)'],['both','Cả hai cùng lúc']])}${udxSl('geo','cap','Năng lực mỗi site',500,10000,500,v=>nF(v,0)+' đăng ký/s')}${udxSl('geo','base','Tải nền',100,3000,50,v=>nF(v,0)+'/s')}
    ${udxSl('geo','nue','Số UE phải đăng ký lại',100,3000,50,v=>udxK(v*1000))}${udxSl('geo','spread','UE dồn đến trong',5,120,5,v=>v+' s')}${udxSl('geo','tmo','Hết giờ chờ ở AMF',1,10,1,v=>v+' s')}</div>
   <div class="ctl" style="margin-top:6px">${udxChk('geo','olc','Chống quá tải (503 + OCI/LCI, TS 29.500)','olc')}${udxChk('geo','bo','Back-off T3346 ngẫu nhiên','t3346')}${udxSl('geo','bomin','Back-off nhỏ nhất',5,300,5,v=>v+' s')}${udxSl('geo','bomax','Back-off lớn nhất',30,900,30,v=>v+' s')}</div>
   <div class="row">${udxPlayBtn('geo','udxGPlay')}<button type="button" class="btn sm" data-udxa="geo:rst">↺ Chạy lại từ đầu</button></div>
   <div id="udxGNow">${udxGNow()}</div><div class="scroll"><div class="udxw" id="udxGP1">${udxGPlot()}</div></div><div class="scroll"><div class="udxw" id="udxGP2">${udxGPlot2()}</div></div>
   <div id="udxGT">${udxGTbl()}</div>
   <p class="note">Không chống quá tải: hàng đợi phình, yêu cầu chờ quá hạn vẫn được xử lý (bỏ phí), UE thử lại sau 5–15 s làm tải tăng tiếp (sụp đổ do tắc nghẽn). Có chống quá tải: UDM/SCP trả 503 sớm kèm OCI, AMF giảm gửi và trả Registration Reject #22 với T3346 ngẫu nhiên, tải được trải ra theo thời gian. Mô hình gộp mỗi đăng ký thành một yêu cầu tới UDM, số liệu minh hoạ. Chống quá tải và scale NF chi tiết sẽ ở thẻ 5GC cloud-native (đợt 11).</p></div>`;},
 after(){},
 upd(k){if(k==='bomin'&&UDXP.geo.bomin>UDXP.geo.bomax)UDXP.geo.bomax=Math.min(900,Math.ceil(UDXP.geo.bomin/30)*30);if(k==='bomax'&&UDXP.geo.bomax<UDXP.geo.bomin)UDXP.geo.bomin=UDXP.geo.bomax;
  udxGRun();udxGUpd(true);},
 tick(dt){if(!UDXS.pause){UDXS.ga+=dt/24;if(UDXS.ga>1)UDXS.ga=0;}UDXGL+=dt;
  UDXS.gt=(UDXS.gt+dt*0.25)%1;document.querySelectorAll('#udxGeo .udxrep').forEach((c,i)=>{const a=+c.dataset.x0,b=+c.dataset.x1;c.setAttribute('cx',a+(b-a)*((UDXS.gt+i*0.3)%1));});
  if(UDXGL>0.25||dt===0){UDXGL=0;udxGUpd(false);}},
 act(a){if(a==='play')udxPlayTog('udxGPlay');else if(a==='rst'){UDXS.ga=0;udxGUpd(false);}}
};
function udxGUpd(all){udxSet('udxGNow',udxGNow());udxSet('udxGP1',udxGPlot());udxSet('udxGP2',udxGPlot2());udxSet('udxGeo',udxGeoSvg());if(all)udxSet('udxGT',udxGTbl());}

/* ---------- Mục 5: liên hoạt động HSS ↔ UDM ---------- */
const UDXIF=[['S6a / S6d','MME/SGSN ↔ HSS','Diameter','AIR/AIA, ULR/ULA, CLR, IDR, DSR, PUR, NOR','N8 (AMF ↔ UDM), N13 (AUSF ↔ UDM)'],
 ['Cx','I/S-CSCF ↔ HSS','Diameter','UAR, SAR, LIR, MAR, RTR, PPR','Nhss_ims (TS 29.562, IMS dùng SBA, Rel-16)'],
 ['Sh','AS (MMTel) ↔ HSS','Diameter','UDR, PUR, SNR, PNR','Nhss_ims SDM / Nudr'],
 ['SWx','3GPP AAA ↔ HSS','Diameter','MAR, SAR, PPR, RTR','N13 + AUSF (EAP-AKA′)'],
 ['S6t, S6m','SCEF, MTC-IWF ↔ HSS','Diameter','CIR, NIR, SIR','N52 (NEF ↔ UDM)'],
 ['Gr, C, D','SGSN, MSC/VLR ↔ HLR','MAP (SS7)','SAI, UL, ISD, CL','(thay bởi S6a, N8)'],
 ['N8, N10, N13, N21','AMF, SMF, AUSF, SMSF ↔ UDM','HTTP/2 SBI','Nudm_UEAU, UECM, SDM','—'],
 ['N35, N36, N37','UDM, PCF, NEF ↔ UDR','HTTP/2 SBI','Nudr_DataRepository','Ud (UDC, LDAP/SOAP)']];
const UDXMAP=[['5001 DIAMETER_ERROR_USER_UNKNOWN','404 USER_NOT_FOUND','#3 Illegal UE (hoặc #7)'],['5420 DIAMETER_ERROR_UNKNOWN_EPS_SUBSCRIPTION','404 DATA_NOT_FOUND','#7 / #15 tuỳ cấu hình'],
 ['5421 DIAMETER_ERROR_RAT_NOT_ALLOWED','403 RAT_NOT_ALLOWED','#27 N1 mode not allowed (5G), #15 (4G)'],['5004 DIAMETER_ERROR_ROAMING_NOT_ALLOWED','403 ROAMING_NOT_ALLOWED','#11 hoặc #13'],
 ['4181 DIAMETER_AUTHENTICATION_DATA_UNAVAILABLE','403 AUTHENTICATION_REJECTED / 503','tạm thời, AMF thử lại hoặc #22'],['3004 DIAMETER_TOO_BUSY','503 + OCI (overload)','#22 Congestion + T3346'],
 ['3002 DIAMETER_UNABLE_TO_DELIVER','504 / hết giờ SCP','#22 hoặc thử UDM khác'],['5420 (không có APN)','404 DATA_NOT_FOUND (sm-data, DNN)','5GSM #27 Missing or unknown DNN']];
const UDXIWF={
 air:{n:'S6a AIR → Nudm_UEAU',d:['Command: Authentication-Information-Request (318)','User-Name: 001010000000123','Visited-PLMN-Id: 00F110','Requested-EUTRAN-Authentication-Info: Number-Of-Requested-Vectors = 1','Re-Synchronization-Info (khi có AUTS)'],
  h:['POST /nudm-ueau/v1/imsi-001010000000123/security-information/generate-auth-data','{ "servingNetworkName": "5G:mnc001.mcc001.3gppnetwork.org",','  "ausfInstanceId": "…", "resynchronizationInfo": null }','→ 200 AuthenticationInfoResult { authType: 5G_AKA, authenticationVector … }'],x:'HSS+UDM dùng chung ARPF: cùng K, cùng SQN cho EPS AV và 5G HE AV.'},
 ulr:{n:'S6a ULR → Nudm_UECM + SDM',d:['Command: Update-Location-Request (316)','User-Name: 001010000000123','RAT-Type: EUTRAN (1004)','ULR-Flags: S6a/S6d-Indicator, Initial-Attach-Indicator','Origin-Host: mme01.epc…'],
  h:['(phía 5G tương đương)','PUT /nudm-uecm/v1/{supi}/registrations/amf-3gpp-access { amfInstanceId, deregCallbackUri, ratType: NR }','GET /nudm-sdm/v2/{supi}?dataset-names=AM,SMF_SEL','→ 200 am-data (UE-AMBR, NSSAI), smf-selection'],x:'Trong HSS+UDM, ULR từ MME làm UDM huỷ đăng ký AMF (một nút phục vụ), trừ khi UE ở chế độ đăng ký kép.'},
 clr:{n:'S6a CLR ↔ DeregistrationNotification',d:['Command: Cancel-Location-Request (317)','Cancellation-Type: MME_UPDATE_PROCEDURE (0) / SUBSCRIPTION_WITHDRAWAL (2)'],
  h:['POST {deregCallbackUri} (Nudm_UECM_DeregistrationNotification)','{ "deregReason": "UE_INITIAL_REGISTRATION" | "SUBSCRIPTION_WITHDRAWN" }','→ 204 No Content'],x:'MME_UPDATE_PROCEDURE ≈ UE_REGISTRATION_AREA_CHANGE / đổi nút phục vụ; SUBSCRIPTION_WITHDRAWAL ≈ SUBSCRIPTION_WITHDRAWN.'},
 idr:{n:'S6a IDR ↔ SDM Notification',d:['Command: Insert-Subscriber-Data-Request (319)','Subscription-Data: AMBR, APN-Configuration-Profile, Access-Restriction-Data'],
  h:['POST {callbackReference} (Nudm_SDM_Notification)','{ "notifyItems": [ { "resourceId": "…/am-data", "changes": [ { "op": "REPLACE", "path": "subscribedUeAmbr" … } ] } ] }','→ 204'],x:'4G đẩy toàn bộ dữ liệu bằng IDR; 5G chỉ gửi phần thay đổi tới NF đã subscribe.'},
 pur:{n:'S6a PUR ↔ UECM Deregistration',d:['Command: Purge-UE-Request (321)','User-Name, PUR-Flags'],
  h:['PATCH /nudm-uecm/v1/{supi}/registrations/amf-3gpp-access { "purgeFlag": true }','→ 204'],x:'MME/AMF báo đã xoá ngữ cảnh UE (lâu không liên lạc).'},
 mar:{n:'Cx MAR → Nhss_imsUEAU',d:['Command: Multimedia-Auth-Request (303)','Public-Identity: sip:+84900000123@ims…','SIP-Auth-Data-Item: SIP-Authentication-Scheme = Digest-AKAv1-MD5','Server-Name: scscf1.ims…'],
  h:['POST /nhss-ims-ueau/v1/{impi}/security-information/generate-sip-auth-data','{ "authenticationScheme": "DIGEST_AKAV1_MD5", "serverName": "scscf1…" }','→ 200 SipAuthenticationInfoResult'],x:'IMS dùng SBA (Rel-16) hoặc Cx truyền thống; HSS hội tụ phục vụ cả hai.'}};
const UDXC2=['UE','MME','HSS+UDM','AMF','SMF+PGW-C','P/S-CSCF'];
const UDXLAD2={
 non26:{n:'5G → 4G không N26',c:UDXC2,m:[[0,1,'NAS','Attach Request (Handover attach, PDN connectivity)','không có N26: UE tự đăng ký lại ở 4G'],[1,2,'DIA','S6a AIR (IMSI)','cùng K, SQN với 5G'],[2,1,'DIA','AIA (EPS AV)',''],
  [1,2,'DIA','S6a ULR (RAT EUTRAN)',''],[2,1,'DIA','ULA (APN ims, internet; FQDN SMF+PGW-C đã dùng ở 5G)','UDM lưu SMF+PGW-C khi lập phiên 5G, nên giữ được IP'],[2,3,'SBI','Nudm_UECM_DeregistrationNotification (theo cấu hình, TS 23.502 §4.11)','AMF xoá ngữ cảnh'],
  [1,4,'GTPv2','Create Session Request (handover indication)',''],[4,1,'GTPv2','Create Session Response (IP cũ)',''],[1,0,'NAS','Attach Accept','']]},
 n26:{n:'5G → 4G có N26',c:UDXC2,m:[[0,1,'NAS','TAU Request (GUTI ánh xạ từ 5G-GUTI)',''],[1,3,'GTPv2','N26 Context Request','MME lấy ngữ cảnh từ AMF, không cần xác thực lại'],[3,1,'GTPv2','Context Response (MM, EPS bearer ánh xạ)',''],
  [1,2,'DIA','S6a ULR (ULR-Flags, Single-Registration-Indication)',''],[2,3,'SBI','Nudm_UECM_DeregistrationNotification','HSS+UDM huỷ đăng ký AMF'],[2,1,'DIA','ULA (dữ liệu thuê bao)',''],
  [1,4,'GTPv2','Modify Bearer Request',''],[1,0,'NAS','TAU Accept','']]},
 to5:{n:'4G → 5G (đăng ký di động)',c:UDXC2,m:[[0,3,'NAS','Registration Request (mobility, GUTI ánh xạ)',''],[3,1,'GTPv2','N26 Context Request','nếu có N26'],[1,3,'GTPv2','Context Response',''],
  [3,2,'SBI','Nudm_UECM_Registration (amf-3gpp-access)',''],[2,1,'DIA','S6a CLR (MME_UPDATE_PROCEDURE)','HSS+UDM huỷ MME'],[3,2,'SBI','Nudm_SDM_Get + Subscribe',''],[3,4,'SBI','Nsmf_PDUSession_CreateSMContext (chuyển PDN → PDU)',''],[3,0,'NAS','Registration Accept','']]},
 ims:{n:'Đăng ký IMS qua HSS hội tụ',c:UDXC2,m:[[0,5,'SIP','REGISTER (IMPI, IMPU)','qua P-CSCF; I-CSCF chọn S-CSCF'],[5,2,'DIA','Cx UAR/UAA',''],[5,2,'DIA','Cx MAR (IMS-AKA)','hoặc Nhss_imsUEAU nếu IMS dùng SBA'],
  [5,0,'SIP','401 Unauthorized (RAND, AUTN)',''],[0,5,'SIP','REGISTER (RES)',''],[5,2,'DIA','Cx SAR (REGISTRATION)','tải hồ sơ IMS: iFC'],[2,3,'SBI','Cùng hồ sơ: AMF/SMF thấy DNN ims, 5QI 5','dữ liệu dùng chung UDR'],[5,0,'SIP','200 OK','']]}};
UDXP.iwk={cmd:'air',lad:'non26',step:0};
function udxIwfSvg(){return `<svg viewBox="0 0 680 70" class="u3svg udxsvg" role="img" aria-label="Chuyển đổi qua IWF"><line x1="108" y1="35" x2="282" y2="35" class="udxe"/><line x1="398" y1="35" x2="572" y2="35" class="udxe"/>
  <text x="195" y="27" class="udxif" text-anchor="middle">Diameter (S6a/Cx)</text><text x="485" y="27" class="udxif" text-anchor="middle">HTTP/2 + JSON (SBI)</text>
  ${[[60,'MME / CSCF'],[340,'IWF / HSS-FE'],[620,'UDM']].map(([x,t])=>`<g class="udxn"><rect x="${x-56}" y="18" width="112" height="34" rx="7"/><text x="${x}" y="40" class="udxtx" text-anchor="middle">${t}</text></g>`).join('')}<circle id="udxIDot" r="6" cx="-20" cy="35" class="udxdot"/></svg>`;}
function udxIwfHtml(){const C=UDXIWF[UDXP.iwk.cmd];return `<div class="udxtwo"><div><b>Diameter (AVP)</b><pre class="udxjs">${C.d.map(nE).join('\n')}</pre></div><div><b>HTTP/2 tương đương</b><pre class="udxjs">${C.h.map(nE).join('\n')}</pre></div></div><p class="note">${nE(C.x)}</p>`;}
function udxIwkUpd(){const P=UDXP.iwk,L=UDXLAD2[P.lad];udxSet('udxLad2',udxLadSvg(L,P.step,'udxL2Dot'));udxSet('udxLad2Log',udxLadLog(L,P.step));}
UDXR.iwk={
 html(){const P=UDXP.iwk;
  return `<div class="panel"><h3>Giao diện HSS (4G, IMS) và UDM (5G)</h3><div class="scroll"><table class="ndtb"><thead><tr><th>Giao diện</th><th>Nối</th><th>Giao thức</th><th>Bản tin chính</th><th>Tương đương 5G</th></tr></thead><tbody>${UDXIF.map(r=>`<tr>${r.map((c,i)=>`<td>${i?nE(c):'<b>'+nE(c)+'</b>'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
   <p class="note">Ba cách triển khai: HSS và UDM riêng (cần IWF hoặc chỉ dùng chung UDR), HSS+UDM hội tụ một sản phẩm (phổ biến khi có N26), hoặc HSS-FE và UDM cùng đọc một UDR. Quy định ở TS 23.632 (liên hoạt động, cùng tồn tại và di chuyển dữ liệu người dùng), TS 29.563 (HSS dịch vụ cho UDM), TS 29.562 (Nhss_ims).</p></div>
  <div class="panel"><h3>Chuyển đổi Diameter ↔ HTTP/2</h3><div class="seg u3seg sfsub" role="group" aria-label="Bản tin">${Object.entries(UDXIWF).map(([k,v])=>`<button type="button" data-udxa="iwk:cmd|${k}" aria-pressed="${k===P.cmd}">${nE(v.n)}</button>`).join('')}</div>
   <div class="scroll"><div class="udxw">${udxIwfSvg()}</div></div><div id="udxIwf">${udxIwfHtml()}</div>
   <h3 style="margin-top:12px">Ánh xạ mã lỗi</h3><div class="scroll"><table class="ndtb"><thead><tr><th>Diameter (Result-Code / Experimental)</th><th>HTTP/2 ProblemDetails</th><th>Cause NAS thường gặp</th></tr></thead><tbody>${UDXMAP.map(r=>`<tr><td>${nE(r[0])}</td><td>${nE(r[1])}</td><td>${nE(r[2])}</td></tr>`).join('')}</tbody></table></div>
   <p class="note">Ánh xạ cause NAS phụ thuộc cấu hình AMF/MME (bảng ánh xạ của nhà mạng): <span class="kpC mid">Cần đối chiếu</span>.</p></div>
  <div class="panel"><h3>Lược đồ liên hoạt động 4G–5G và IMS</h3><div class="seg u3seg sfsub" role="group" aria-label="Kịch bản">${Object.entries(UDXLAD2).map(([k,v])=>`<button type="button" data-udxa="iwk:lad|${k}" aria-pressed="${k===P.lad}">${nE(v.n)}</button>`).join('')}</div>
   <div class="row">${udxPlayBtn('iwk','udxIPlay')}<button type="button" class="btn sm" data-udxa="iwk:prev">◀ Bước trước</button><button type="button" class="btn sm" data-udxa="iwk:next">Bước sau ▶</button></div>
   <div class="scroll"><div class="udxw" id="udxLad2">${udxLadSvg(UDXLAD2[P.lad],P.step,'udxL2Dot')}</div></div><div id="udxLad2Log">${udxLadLog(UDXLAD2[P.lad],P.step)}</div>
   <p class="note">Luồng đầy đủ ở <button type="button" class="u3lnkbtn" data-udxgo="e2:irat:sa">thẻ E2E · Chuyển hệ thống</button>; S6a và HSS ở <button type="button" class="u3lnkbtn" data-tab="core">thẻ Mạng lõi</button>, Cx ở <button type="button" class="u3lnkbtn" data-tab="ims">thẻ IMS</button>.</p></div>`;},
 after(){},
 upd(){},
 tick(dt){const P=UDXP.iwk,L=UDXLAD2[P.lad];if(!UDXS.pause)UDXS.lt+=dt;udxLadDot(L,P.step,'udxL2Dot');
  UDXS.ia=(UDXS.ia+dt/2)%1;const d=document.getElementById('udxIDot');if(d)d.setAttribute('cx',108+(572-108)*UDXS.ia);
  if(!UDXS.pause&&UDXS.lt>1.5){UDXS.lt=0;P.step=(P.step+1)%L.m.length;udxIwkUpd();}},
 act(a){const P=UDXP.iwk,[k,v]=a.split('|');
  if(k==='cmd'){P.cmd=v;document.querySelectorAll('#t-udm [data-udxa^="iwk:cmd"]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.udxa==='iwk:cmd|'+v));udxSet('udxIwf',udxIwfHtml());UDXS.ia=0;}
  else if(k==='lad'){P.lad=v;P.step=0;UDXS.lt=0;renderUdm();}else if(k==='play')udxPlayTog('udxIPlay');
  else if(k==='next'||k==='prev'){const n=UDXLAD2[P.lad].m.length;P.step=(P.step+(k==='next'?1:n-1))%n;UDXS.lt=0;udxIwkUpd();if(nReduced())UDXR.iwk.tick(0);}}
};

/* ---------- Mục 6: tham số, KPI, lỗi ---------- */
/* [khoá, nhóm, tham số 3GPP / ý nghĩa, Huawei, Nokia, Ericsson, điển hình] — tên vendor đều cần đối chiếu */
const UDXPAR=[
 ['auth','Xác thực','authenticationMethod: 5G_AKA hoặc EAP_AKA_PRIME theo thuê bao','UDM: AUTHMETHOD trong hồ sơ thuê bao','UDM: authenticationMethod (subscriber profile)','UDM: AuthenticationProfile.authMethod','5G_AKA'],
 ['suci','Xác thực','Home Network Public Key ID và protection scheme (Profile A X25519 / B P-256) cho SIDF','UDM: HNKEY (key id, profile)','UDM: hnPublicKey / SIDF key id','UDM: SidfKey (keyId, scheme)','Profile A, key id 1–255, có khoá dự phòng'],
 ['sqn','Xác thực','Quản lý SQN: độ dài IND, cửa sổ Δ, kiểm tra thời gian (TS 33.102 Phụ lục C)','AuC: SQNIND, SQNDELTA','UDM: sqnScheme, indLength','UDM: SqnPolicy (IND bit, delta)','IND 5 bit, Δ = 2^28'],
 ['avn','Xác thực','Số AV mỗi lần yêu cầu (5G: 1; EPS: 1–5) và tái dùng AV','HSS: AVNUM','HSS: numberOfVectors','HSS: AuthVectorCount','5G: 1; EPS: 3–5'],
 ['algo','Xác thực','Thuật toán f1–f5: MILENAGE (OPc) hoặc TUAK','AuC: ALGTYPE, OPC','UDM: algorithmId','UDM: AuthAlgorithm','MILENAGE, OPc lưu sẵn'],
 ['sdmexp','SDM','Thời hạn sdm-subscription (expires), implicit subscribe khi Get','UDM: SDMSUBEXPIRY','UDM: sdmSubscriptionValidity','UDM: SdmSubscriptionExpiry','24 h'],
 ['ntfrt','SDM','Thử lại Nudm_SDM_Notification khi NF không trả lời','UDM: NTFRETRY, NTFINTERVAL','UDM: notificationRetry','UDM: NotificationRetryPolicy','3 lần, 5 s'],
 ['regt','UECM','subsRegTimer: chu kỳ đăng ký định kỳ gửi cho AMF','UDM: PERIODICREGTMR','UDM: subsRegTimer','UDM: PeriodicRegistrationTimer','54 phút (T3512)'],
 ['purge','UECM','Xoá đăng ký AMF/SMF khi UE mất liên lạc lâu (purgeFlag)','UDM: PURGETIMER','UDM: purgeTimer','UDM: UePurgeTimer','theo T3512 + mobile reachable'],
 ['ambr','Dữ liệu','subscribedUeAmbr, sessionAmbr theo gói cước','UDM: UEAMBRUL/DL, SESSAMBR','UDM: ueAmbr, sessionAmbr','UDM: AmbrProfile','theo gói'],
 ['dnn','Dữ liệu','DNN mặc định (defaultDnnIndicator), danh sách DNN theo S-NSSAI','UDM: DNNTPL, DEFDNN','UDM: dnnConfiguration','UDM: DnnProfile','internet mặc định, ims'],
 ['q5','Dữ liệu','5QI, ARP, mức ưu tiên mặc định trong 5gQosProfile','UDM: QOSTPL (5QI, ARP)','UDM: 5gQosProfile','UDM: QosProfile','5QI 9, ARP 8'],
 ['rat','Dữ liệu','ratRestrictions, coreNetworkTypeRestrictions, forbiddenAreas','UDM: RATRESTRICT, CNTYPERESTRICT','UDM: ratRestrictions','UDM: AccessRestriction','trống'],
 ['odb','Dữ liệu','ODB packet services, ODB roaming, SoR','UDM: ODBPS, ODBROAM','UDM: odbData','UDM: OdbProfile','tắt'],
 ['nssai','Dữ liệu','NSSAI đăng ký (default/single S-NSSAI) trong am-data','UDM: NSSAITPL','UDM: nssai','UDM: NssaiProfile','eMBB mặc định'],
 ['geo','Dự phòng','Mô hình site UDM/UDR: active-active / active-standby, nhóm UDM (groupId)','UDM: GEOMODE','UDM: siteRedundancyMode','UDM: GeoRedundancyMode','active-active 2 site'],
 ['repl','Dự phòng','Sao chép UDR giữa site: đồng bộ / không đồng bộ, trễ tối đa','UDR: REPLMODE, REPLDELAY','UDR (One-NDS): replicationMode','UDR (CUDB): ReplicationMode','không đồng bộ, < 1 s'],
 ['det','Dự phòng','Phát hiện NF hỏng: NRF heartbeat, SCP health check, thời gian chuyển tải','NRF: HEARTBEATTIMER','NRF: heartBeatTimer','NRF: HeartbeatInterval','heartbeat 10 s'],
 ['olc','Dự phòng','Chống quá tải SBI: OCI/LCI, ngưỡng CPU, tỉ lệ từ chối (TS 29.500 §6.3, §6.4)','UDM: OCITHD, LCI','UDM: overloadControl','UDM: OverloadControlPolicy','OCI khi CPU > 80 %'],
 ['t3346','Dự phòng','Back-off T3346 ở AMF khi nghẽn (min–max, ngẫu nhiên)','AMF: T3346MIN/MAX','AMF: t3346Range','AMF: MmCongestionBackoff','15–30 phút'],
 ['nfp','NRF','NF profile UDM: supiRanges, routingIndicators, groupId để AMF/AUSF chọn UDM','UDM: NFPROFILE (SUPI range, RI)','UDM: nfProfile.udmInfo','UDM: NfProfile.UdmInfo','routing indicator 0000'],
 ['iwf','Liên hoạt động','Bảng ánh xạ mã lỗi Diameter ↔ HTTP ↔ cause NAS','HSS/UDM: ERRMAP','UDM: causeMapping','UDM: CauseCodeMapping','theo TS 29.563 + cấu hình'],
 ['single','Liên hoạt động','HSS+UDM: một nút phục vụ (single registration), huỷ AMF khi có ULR và ngược lại','HSS: SINGLEREG','HSS/UDM: singleRegistration','HSS/UDM: InterworkingMode','bật khi có N26']];
/* [tên, công thức, Huawei, Nokia, Ericsson, mục tiêu, mục, id KPI] */
const UDXKPI=[
 ['Tỉ lệ UECM Registration thành công','Nudm_UECM_Registration 2xx / tổng yêu cầu × 100','UDM PM: UECM reg succ/att','UDM PM: uecmRegistrationSuccess','UDM PM: UecmRegSucc/Att','≥ 99,9 %','svc','udm_uecm'],
 ['Tỉ lệ SDM Get thành công','Nudm_SDM_Get 2xx / tổng × 100 (loại trừ 404 do thuê bao không tồn tại)','UDM PM: SDM get succ/att','UDM PM: sdmGetSuccess','UDM PM: SdmGetSucc/Att','≥ 99,9 %','data','udm_sdm'],
 ['Tỉ lệ thông báo SDM tới được NF','Nudm_SDM_Notification nhận 2xx / số thông báo gửi × 100','UDM PM: notify succ/att','UDM PM: sdmNotifySuccess','UDM PM: SdmNotifSucc/Att','≥ 99,5 %','data','udm_ntf'],
 ['Thời gian đáp ứng Nudm trung bình','Tổng thời gian xử lý / số yêu cầu (theo dịch vụ)','UDM PM: mean response time','UDM PM: avgResponseTime','UDM PM: MeanRespTime','≤ 50 ms (UEAU ≤ 100 ms)','geo','udm_lat'],
 ['Tải UDR','TPS thực / TPS định cỡ × 100 (đỉnh 15 phút)','UDR PM: TPS usage','One-NDS PM: transaction load','CUDB PM: TPS utilisation','≤ 70 % giờ bận; còn dư khi mất 1 site','geo','udm_load'],
 ['Tỉ lệ xác thực 5G-AKA thành công','Xác thực thành công / yêu cầu Nausf × 100','AUSF PM: auth succ/att','AUSF PM: authenticationSuccess','AUSF PM: AuthSucc/Att','≥ 99,5 %','svc','s_suci'],
 ['Tỉ lệ sync failure (AUTS)','Số Authentication Failure #21 / số lần xác thực × 100','AMF PM: auth fail #21','AMF PM: syncFailure','AMF PM: AuthFailSynch','≤ 0,5 %','svc','s_synch'],
 ['Tỉ lệ S6a AIR/ULR thành công','AIA/ULA thành công / tổng × 100','HSS PM: S6a succ','HSS PM: s6aSuccess','HSS PM: S6aSucc','≥ 99,9 %','iwk','e_s6a']];
/* [lỗi, mô tả, nguyên nhân[], kiểm tra[], {h,n,e}, KPI, mục] */
const UDXFLT=[
 ['404 USER_NOT_FOUND','UDM/AUSF không tìm thấy SUPI: UE bị Registration Reject #3 hoặc #7, hay gặp sau khi đổi SIM, chuyển mạng.',['Thuê bao chưa provisioning hoặc đã xoá','Sai routing indicator / dải SUPI ở NRF, AUSF chọn nhầm nhóm UDM','SIDF giải sai do khoá mạng nhà không khớp'],['Tra UDR theo IMSI','Kiểm NF profile UDM ở NRF (supiRanges, RI)','Đối chiếu key id trong SUCI với khoá ở UDM'],{h:'Tra lệnh LST SUB theo IMSI (cần đối chiếu)',n:'Tra One-NDS theo IMSI (cần đối chiếu)',e:'Tra CUDB theo IMSI (cần đối chiếu)'},'udm_sdm, c5_reg','data'],
 ['404 DATA_NOT_FOUND','Thuê bao có nhưng thiếu tập dữ liệu: thiếu sm-data cho DNN/S-NSSAI → PDU reject #27, thiếu am-data → đăng ký lỗi.',['Mẫu gói cước thiếu DNN hoặc S-NSSAI','Provisioning dở dang (lỗi giữa chừng)','Sai phiên bản API giữa AMF/SMF và UDM'],['Đọc từng tập dữ liệu ở UDR','So sm-data với DNN, S-NSSAI trong PDU Request','Xem log provisioning'],{h:'Kiểm mẫu DNN/QoS (cần đối chiếu)',n:'Kiểm template thuê bao (cần đối chiếu)',e:'Kiểm profile (cần đối chiếu)'},'udm_sdm','data'],
 ['Auth reject do MAC failure (#20)','UE thấy AUTN sai MAC: K/OPc ở UDR không khớp SIM, hay gặp khi nạp sai lô SIM hoặc thuật toán.',['Sai K/OPc khi nạp lô SIM','Sai thuật toán (MILENAGE/TUAK) hoặc hằng số','SIM giả / sao chép'],['Đối chiếu file lô SIM với UDR','Thử AV bằng công cụ kiểm tra','Theo dõi theo dải IMSI'],{h:'Kiểm KI/OPC (cần đối chiếu)',n:'Kiểm khoá thuê bao (cần đối chiếu)',e:'Kiểm khoá (cần đối chiếu)'},'s_suci, s_macf','svc'],
 ['Sync failure (#21, AUTS) lặp','SQN mạng lùi so với SIM: mỗi lần xác thực cần thêm một vòng AUTS, tăng trễ đăng ký.',['Khôi phục UDR từ bản sao cũ','Sao chép không đồng bộ, đọc SQN ở site chưa cập nhật','Nhiều AUSF/HSS dùng chung dải IND sai'],['Đếm #21 theo site UDR','Kiểm trễ sao chép, quy tắc ghi SQN','Kiểm cấu hình IND'],{h:'Kiểm SQN (cần đối chiếu)',n:'Kiểm sqnScheme (cần đối chiếu)',e:'Kiểm SqnPolicy (cần đối chiếu)'},'s_synch','geo'],
 ['SUCI không giải được','UDM trả lỗi khi giải SUCI: UE có thể bị Identity Request hoặc bị từ chối.',['Đổi khoá mạng nhà nhưng SIM còn khoá cũ','Sai protection scheme','SIM gửi SUCI null-scheme khi mạng bắt buộc bảo vệ'],['Thống kê key id trong SUCI','Giữ khoá cũ song song khi xoay khoá','Đối chiếu cấu hình SIM'],{h:'Kiểm HNKEY (cần đối chiếu)',n:'Kiểm SIDF key (cần đối chiếu)',e:'Kiểm SidfKey (cần đối chiếu)'},'s_sucif','arch'],
 ['Không đổi được gói (SDM Notification lỗi)','Đã đổi trên UDR nhưng UE vẫn tốc độ cũ: thông báo không tới AMF/SMF.',['Callback URI của NF cũ (NF đã scale lại)','sdm-subscription hết hạn','SCP/ tường lửa chặn chiều UDM → NF'],['Đếm Notification lỗi theo NF','Kiểm thời hạn subscription','Thử UE đăng ký lại để kiểm chứng'],{h:'Kiểm SDM subscription (cần đối chiếu)',n:'Kiểm notification log (cần đối chiếu)',e:'Kiểm subscription (cần đối chiếu)'},'udm_ntf','data'],
 ['503, hết giờ Nudm khi bão đăng ký','UDM quá tải sau sự cố lớn: trễ tăng, AMF hết giờ chờ, UE thử lại liên tục.',['Không bật chống quá tải SBI','Back-off T3346 quá ngắn hoặc cố định','Thiếu năng lực khi mất 1 site'],['Theo dõi TPS, CPU UDM/UDR','Bật OCI/LCI, back-off ngẫu nhiên','Định cỡ N+1 site'],{h:'Kiểm overload control (cần đối chiếu)',n:'Kiểm overload policy (cần đối chiếu)',e:'Kiểm OverloadControlPolicy (cần đối chiếu)'},'udm_lat, udm_load','geo'],
 ['Mất đăng ký sau chuyển 4G ↔ 5G','UE không nhận cuộc gọi hoặc không về 5G: HSS và UDM không biết nút phục vụ đúng.',['HSS và UDM tách rời, không đồng bộ nút phục vụ','Thiếu Nudm_UECM_DeregistrationNotification/CLR','Không có N26 nhưng không lưu SMF+PGW-C'],['Kiểm ULR/CLR và UECM theo IMSI','Kiểm chế độ single registration','Đối chiếu bảng ánh xạ IWF'],{h:'Kiểm interworking (cần đối chiếu)',n:'Kiểm IWF (cần đối chiếu)',e:'Kiểm InterworkingMode (cần đối chiếu)'},'e_s6a, udm_uecm','iwk']];
UDXP.vd={grp:'all',q:'',kf:'all'};
function udxParRows(){const P=UDXP.vd,q=P.q.trim().toLowerCase(),v=nVn();const rows=UDXPAR.filter(r=>(P.grp==='all'||r[1]===P.grp)&&(!q||r.join(' ').toLowerCase().includes(q)));
  const cols=v==='3gpp'?[3,4,5]:[{huawei:3,nokia:4,ericsson:5}[v]];
  return rows.map(r=>`<tr><td><span class="chip">${nE(r[1])}</span><br>${nE(r[2])}</td>${cols.map(c=>`<td class="u3tag">${nE(r[c])}</td>`).join('')}<td>${nE(r[6])}</td><td><span class="kpC mid">Cần đối chiếu</span></td></tr>`).join('')||'<tr><td colspan="6">Không có tham số khớp.</td></tr>';}
function udxParHead(){const v=nVn();return `<tr><th>Tham số (3GPP / ý nghĩa)</th>${v==='3gpp'?'<th>Huawei</th><th>Nokia</th><th>Ericsson</th>':`<th>${nVName(v)}</th>`}<th>Điển hình</th><th>Độ tin cậy tên</th></tr>`;}
function udxKpiRows(){const v=nVn(),f=UDXP.vd.kf;return UDXKPI.filter(k=>f==='all'||k[6]===f).map(k=>`<tr><td><b>${nE(k[0])}</b>${k[7]&&typeof KL!=='undefined'&&KL.find(x=>x.id===k[7])?`<br><button type="button" class="u3lnkbtn" data-udxgo="kpi:${k[7]}">Mở ở thẻ KPI →</button>`:''}</td><td>${nE(k[1])}</td><td class="u3tag">${v==='3gpp'?['Huawei: '+k[2],'Nokia: '+k[3],'Ericsson: '+k[4]].map(nE).join('<br>'):nE(k[{huawei:2,nokia:3,ericsson:4}[v]])}<br><span class="kpC mid">cần đối chiếu</span></td><td>${nE(k[5])}</td><td><button type="button" class="btn sm" data-udxgo="udm:${k[6]}">Mô phỏng →</button></td></tr>`).join('');}
function udxFltHtml(){const v=nVn();return UDXFLT.map(f=>`<details class="u3flt ndflt udxflt"><summary><b>${nE(f[0])}</b></summary><p class="e2d">${nE(f[1])}</p><div class="u3two"><div><b>Nguyên nhân</b><ul class="u3ul">${f[2].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div><div><b>Kiểm tra</b><ul class="u3ul">${f[3].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div></div><p class="note">${v==='3gpp'?['Huawei: '+f[4].h,'Nokia: '+f[4].n,'Ericsson: '+f[4].e].map(nE).join(' · '):nVName(v)+': '+nE(f[4][v[0]])} · KPI: ${nE(f[5])} · <button type="button" class="u3lnkbtn" data-udxgo="udm:${f[6]}">Mô phỏng →</button></p></details>`).join('');}
function udxCalc(){const g=id=>{const e=document.getElementById(id);return e?+e.value||0:0;},o=document.getElementById('udxcOut');if(!o)return;
  const ua=g('udxcUa'),us=g('udxcUs'),sa=g('udxcSa'),ss=g('udxcSs'),na=g('udxcNa'),ns=g('udxcNs'),tt=g('udxcTt'),tn=g('udxcTn'),tp=g('udxcTp'),tc=g('udxcTc'),aa=g('udxcAa'),as=g('udxcAs');
  const pc=(a,b,th)=>b?`<span class="${a/b*100<th?'lbbad':'lbgood'}">${nF(a/b*100,3)} %</span>`:'—';
  o.innerHTML=udxKv('UECM Registration thành công',pc(us,ua,99.9))+udxKv('SDM Get thành công',pc(ss,sa,99.9))+udxKv('Thông báo SDM tới được NF',pc(ns,na,99.5))
   +udxKv('Thời gian đáp ứng Nudm TB',tn?`<span class="${tt/tn>50?'lbbad':'lbgood'}">${nF(tt/tn,1)} ms</span>`:'—')
   +udxKv('Tải UDR',tc?`<span class="${tp/tc*100>70?'lbbad':'lbgood'}">${nF(tp/tc*100,1)} %</span>${tp/tc*100>50?' (mất 1 trong 2 site sẽ quá tải)':''}`:'—')+udxKv('Xác thực 5G-AKA thành công',pc(as,aa,99.5));}
UDXR.vd={
 html(){const P=UDXP.vd,grps=[...new Set(UDXPAR.map(r=>r[1]))];
  return `<div class="panel"><h3>Tham số UDM, AUSF, UDR</h3><p class="hint">Chọn vendor ở thanh trên để chỉ hiện cột vendor đó. Mọi tên tham số vendor đều cần đối chiếu theo tài liệu release đang dùng.</p>
   <div class="ctl" style="margin-bottom:10px">${udxSel('vd','grp','Nhóm',[['all','Tất cả']].concat(grps.map(g=>[g,g])))}<label class="c"><span class="cl">Lọc</span><input type="search" id="udxvq" value="${nE(P.q)}" placeholder="Ví dụ: SQN, AMBR, OCI"></label></div>
   <div class="scroll"><table class="ndtb"><thead>${udxParHead()}</thead><tbody id="udxParB">${udxParRows()}</tbody></table></div></div>
  <div class="panel"><h3>KPI theo dõi</h3><div class="ctl" style="margin-bottom:10px">${udxSel('vd','kf','Theo mục',[['all','Tất cả']].concat(UDXV.filter(v=>v[0]!=='vd').map(v=>[v[0],v[1]])))}</div>
   <div class="scroll"><table class="ndtb"><thead><tr><th>KPI</th><th>Công thức</th><th>Bộ đếm</th><th>Mục tiêu</th><th></th></tr></thead><tbody id="udxKpB">${udxKpiRows()}</tbody></table></div>
   <div class="u3calc"><b>Tính nhanh từ bộ đếm</b><div class="ctl ndcalc" style="margin-top:8px">
    ${[['udxcUa','UECM Registration: yêu cầu',2400000],['udxcUs','UECM Registration: 2xx',2398100],['udxcSa','SDM Get: yêu cầu',5100000],['udxcSs','SDM Get: 2xx',5097300],['udxcNa','SDM Notification: gửi',41000],['udxcNs','SDM Notification: 2xx',40850],['udxcTt','Tổng thời gian đáp ứng (ms)',148000000],['udxcTn','Số yêu cầu Nudm',9800000],['udxcTp','TPS đỉnh UDR',21000],['udxcTc','TPS định cỡ UDR',40000],['udxcAa','Yêu cầu xác thực Nausf',1900000],['udxcAs','Xác thực thành công',1893500]].map(r=>`<label class="c"><span class="cl">${r[1]}</span><input type="number" id="${r[0]}" value="${r[2]}" step="any"></label>`).join('')}
   </div><dl class="kv" id="udxcOut" style="margin-top:8px"></dl></div></div>
  <div class="panel"><h3>Lỗi thường gặp và cách kiểm tra</h3>${udxFltHtml()}</div>
  <div class="panel"><h3>Tiêu chuẩn tham chiếu</h3><ul class="u3ul"><li>TS 23.501 §6.2.6–6.2.8 (UDM, AUSF, UDR), §5.2.3 (UDM front-end/back-end); TS 23.502 §4.2.2.2 (đăng ký), §5.2.3 (dịch vụ Nudm), §4.11 (liên hoạt động EPS)</li><li>TS 29.503 (Nudm), TS 29.509 (Nausf), TS 29.504 và 29.505 (Nudr, subscription data), TS 29.500 §6.3–6.4 (chống quá tải, LCI/OCI)</li><li>TS 33.501 §6.1 (5G-AKA, EAP-AKA′, SIDF), TS 33.102 Phụ lục C (SQN), TS 35.206 (MILENAGE)</li><li>TS 23.632 (liên hoạt động, cùng tồn tại HSS–UDM), TS 29.563 (HSS phục vụ UDM), TS 29.562 (Nhss_ims), TS 29.272 (S6a), TS 29.228/229 (Cx)</li><li>TS 23.335 (UDC, giao diện Ud), TS 24.501 (5GMM cause #3, #7, #11, #13, #22, #27; 5GSM #8, #27), TS 28.552 (đo lường UDM/AUSF)</li></ul></div>`;},
 after(){udxCalc();},
 upd(k){if(k==='grp')udxSet('udxParB',udxParRows());if(k==='kf')udxSet('udxKpB',udxKpiRows());}
};

/* ---------- Khung thẻ ---------- */
const UDXLK={arch:{e2:[['reg','sa']],kpi:['s_suci','c5_reg','s_sucif']},svc:{e2:[['reg','sa'],['data','sa'],['roam','sa']],kpi:['udm_uecm','udm_sdm','sbi5']},data:{e2:[['data','sa']],kpi:['udm_ntf','udm_sdm']},
 geo:{e2:[['reg','sa']],kpi:['udm_load','udm_lat','c5_reg']},iwk:{e2:[['irat','sa']],kpi:['e_s6a','udm_uecm']},vd:{e2:[['reg','sa'],['data','sa']],kpi:[]}};
const UDXTB=[['sc','Bảo mật (5G-AKA, SUCI, SIDF)'],['core','Mạng lõi'],['pn','Mạng riêng 5G (credential SNPN)'],['nsl','Network slicing, QoS, cước'],['ims','IMS'],['rm','Roaming'],['vo','VoLTE']];
function udxLinks(){const L=UDXLK[UDXS.v]||{e2:[],kpi:[]},hasE2=typeof E2S!=='undefined',hasK=typeof KL!=='undefined';
  const e2=hasE2?L.e2.map(([id,tk])=>{const s=E2S.find(x=>x.id===id);return s&&s.f&&s.f[tk]?[s,tk]:null;}).filter(Boolean):[];
  const kp=hasK?L.kpi.map(id=>KL.find(k=>k.id===id)).filter(Boolean):[],tabs=UDXTB.filter(t=>typeof RENDER!=='undefined'&&RENDER[t[0]]);
  return `<div class="panel u3lk"><h3>Xem tiếp ở thẻ khác</h3>
  ${e2.length?`<p class="e2x"><b>Luồng ở thẻ Toàn trình E2E</b> (mở sẵn 5G SA):</p><div class="e2go">${e2.map(([s,tk])=>`<button type="button" class="btn sm" data-udxgo="e2:${s.id}:${tk}">${nE(s.n)} · 5G SA →</button>`).join('')}</div>`:''}
  ${kp.length?`<p class="e2x" style="margin-top:10px"><b>KPI liên quan ở thẻ KPI mạng</b>:</p><div class="e2go">${kp.map(k=>`<button type="button" class="btn sm" data-udxgo="kpi:${k.id}">${nE(k.nm)} →</button>`).join('')}</div>`:''}
  <p class="e2x" style="margin-top:10px"><b>Thẻ liên quan:</b></p><div class="e2go">${tabs.map(t=>`<button type="button" class="btn sm" data-tab="${t[0]}">${t[1]} →</button>`).join('')}<button type="button" class="btn sm" data-scgo="sc:aka">Bảo mật · 5G-AKA, SUCI →</button><button type="button" class="btn sm" data-pngo="pn:arch">Mạng riêng · credential SNPN →</button><button type="button" class="btn sm" data-nslgo="nsl:arch">Slicing · S-NSSAI →</button><button type="button" class="btn sm" data-nslgo="nsl:qos">Slicing · 5QI →</button></div></div>`;}
function udxNav(){return `<div class="seg u3seg ndseg udxseg" role="group" aria-label="Mục của thẻ UDM và dữ liệu thuê bao">${UDXV.map((v,i)=>`<button type="button" data-udxv="${v[0]}" aria-pressed="${v[0]===UDXS.v}"><span class="ndn">${i+1}</span>${v[1]}</button>`).join('')}</div>`;}
function renderUdm(){const nav=document.getElementById('udmNav'),body=document.getElementById('udmBody');if(!nav||!body)return;if(!UDXR[UDXS.v])UDXS.v='arch';
  UDXS.job++;nav.innerHTML=udxNav();const V=UDXR[UDXS.v];body.innerHTML=V.html()+udxLinks();if(V.after)V.after();
  if(S.tab==='udm'&&!nReduced()&&V.tick)udxStart();else{udxStop();if(V.tick&&S.tab==='udm')V.tick(0);}}
function udxStart(){if(UDXS.raf)return;UDXS.last=performance.now();UDXS.raf=requestAnimationFrame(udxLoop);}
function udxStop(){if(UDXS.raf)cancelAnimationFrame(UDXS.raf);UDXS.raf=0;}
function udxLoop(now){UDXS.raf=0;if(S.tab!=='udm')return;
  if(document.hidden){UDXS.last=now;UDXS.raf=requestAnimationFrame(udxLoop);return;}
  const dt=Math.max(0,Math.min(0.1,(now-UDXS.last)/1000));UDXS.last=now;const V=UDXR[UDXS.v];if(V&&V.tick){try{V.tick(dt);}catch(e){console.error(e);}}else return;
  UDXS.raf=requestAnimationFrame(udxLoop);}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-udxgo]');
  if(g){const [t,id,tk]=g.dataset.udxgo.split(':');try{tourStop();}catch(x){}try{stopSig();}catch(x){}
    const top=()=>window.scrollTo({top:Math.min(window.scrollY,$('main').offsetTop-$('.bar').offsetHeight)});
    if(t==='e2'){try{e2Stop();}catch(x){}S.e2Sc=id;S.e2R=tk||'sa';S.e2M=S.mode;if(typeof E2A!=='undefined'){E2A.key='';E2A.i=0;}S.tab='e2';renderAll();top();}
    else if(t==='kpi'){S.tab='kpi';KP.tech='all';KP.ly='all';KP.cat='all';KP.q='';KP.node='';KP.sel=id;kpSig='';renderAll();setTimeout(()=>{const d=$('#kpDet');if(d)d.scrollIntoView({block:'start',behavior:'smooth'});},60);}
    else if(t==='udm'){S.tab='udm';if(id&&UDXR[id])UDXS.v=id;renderAll();top();}
    return;}
  const t=e.target.closest('#t-udm [data-udxv],#t-udm [data-udxa]');if(!t)return;
  if(t.dataset.udxv){if(t.dataset.udxv===UDXS.v)return;UDXS.v=t.dataset.udxv;udxStop();renderUdm();return;}
  const [vw,...r]=t.dataset.udxa.split(':');const V=UDXR[vw];if(V&&V.act)V.act(r.join(':'),t);
});
const UDXLITE=['arch:sites'];
function udxInp(el,live){const [vw,k]=el.dataset.udxi.split(':');const P=UDXP[vw];if(!P)return;
  let v=el.type==='checkbox'?(el.checked?1:0):((el.tagName==='SELECT'&&isNaN(+el.value))?el.value:+el.value);P[k]=v;
  const o=el.parentElement.querySelector('output');if(o&&UDXF[vw+':'+k])o.textContent=UDXF[vw+':'+k](v);
  if(live&&!UDXLITE.includes(vw+':'+k))return;
  const V=UDXR[vw];if(V&&V.upd)V.upd(k,vw);}
document.addEventListener('input',e=>{const el=e.target;if(!el||!el.id){}else if(/^udxc[A-Z][a-z]$/.test(el.id)){udxCalc();return;}
  else if(el.id==='udxvq'){UDXP.vd.q=el.value;udxSet('udxParB',udxParRows());return;}
  if(!el.dataset||!el.dataset.udxi||el.type!=='range')return;udxInp(el,true);});
document.addEventListener('change',e=>{const el=e.target;if(!el.dataset||!el.dataset.udxi)return;udxInp(el,false);});

/* ---------- Gắn thẻ vào ứng dụng ---------- */
RENDER.udm=renderUdm;
(function(){if(typeof K!=='function'||typeof KL==='undefined')return;try{
  if(typeof KPB!=='undefined'&&!KPB.udm)KPB.udm={t:"UDM, AUSF, UDR: đăng ký, dữ liệu thuê bao, đáp ứng, tải",
    st:["Tách lỗi theo dịch vụ (UEAU, UECM, SDM) và theo mã ProblemDetails (USER_NOT_FOUND, DATA_NOT_FOUND, 503, hết giờ).","Với 404: tra UDR theo SUPI, kiểm NF profile UDM ở NRF (dải SUPI, routing indicator) và khoá SIDF.","Với trễ và 503: so TPS với định cỡ từng site, kiểm chống quá tải (OCI/LCI) và back-off T3346 ở AMF; xem có sự cố lớn gây bão đăng ký.","Với đổi gói không có tác dụng: đếm SDM Notification lỗi, thời hạn sdm-subscription, callback NF.","Với sync failure tăng: kiểm trễ sao chép UDR, khôi phục dữ liệu, cấu hình IND; với 4G ↔ 5G: kiểm ULR/CLR và UECM cùng IMSI."],
    ca:["Thuê bao chưa/sai provisioning","Sai dải SUPI/routing indicator ở NRF","UDR quá tải hoặc mất site","Không bật chống quá tải","Sao chép UDR chậm (SQN cũ)","HSS và UDM không đồng bộ nút phục vụ"],
    pa:["supiRanges, routingIndicators, groupId","sdm-subscription expires, retry","OCI/LCI, T3346 min–max","Chế độ sao chép UDR, heartbeat NRF"],cs:[],gen:1};
  const add=a=>{if(KL.some(k=>k.id===a[0]))return;K(...a);};
  add(["udm_uecm","5G","core","acc","Nudm_UECM Registration Success Rate","amf,smf,udm","udm","g|%|95|100|u|99.9|99|99.95",
   "Tỉ lệ % = số Nudm_UECM_Registration trả 2xx / số yêu cầu × 100 (AMF và SMF).","TS 29.503 (Nudm_UECM), TS 28.552 (đo lường UDM). Tên bộ đếm cần đối chiếu.",
   "?Tra Huawei UDM PM (UECM registration)","?Tra Ericsson UDM PM (UECM)","?Tra Nokia UDM PM (UECM)",
   "UDM ghi nhận AMF/SMF đang phục vụ; lỗi làm đăng ký và lập phiên thất bại dù RAN tốt.","≥ 99,9 %.",
   "amf>udm:Nudm_UECM_Registration (amf-3gpp-access)!A;udm>amf:201/204!S"]);
  add(["udm_sdm","5G","core","acc","Nudm_SDM Get Success Rate","amf,smf,udm","udm","g|%|95|100|u|99.9|99|99.94",
   "Tỉ lệ % = số Nudm_SDM_Get trả 2xx / tổng yêu cầu × 100 (có thể loại 404 USER_NOT_FOUND do thuê bao không tồn tại).","TS 29.503 (Nudm_SDM), TS 28.552. Tên bộ đếm cần đối chiếu.",
   "?Tra Huawei UDM PM (SDM get)","?Tra Ericsson UDM PM (SDM)","?Tra Nokia UDM PM (SDM)",
   "AMF lấy AM data, SMF lấy SM data (DNN, S-NSSAI, 5QI, AMBR); lỗi DATA_NOT_FOUND thường do mẫu gói cước.","≥ 99,9 %.",
   "amf>udm:Nudm_SDM_Get (AM, SMF_SEL)!A;smf>udm:Nudm_SDM_Get (sm-data);udm>amf:200 OK!S"]);
  add(["udm_ntf","5G","core","int","Nudm_SDM Notification Success Rate","udm,amf,smf","udm","g|%|90|100|u|99.5|98|99.7",
   "Tỉ lệ % = số Nudm_SDM_Notification nhận 2xx / số thông báo UDM gửi × 100.","TS 29.503 (SDM Subscribe/Notification). Chỉ số tự tính, tên bộ đếm cần đối chiếu.",
   "?Tra Huawei UDM PM (SDM notify)","?Tra Ericsson UDM PM (notification)","?Tra Nokia UDM PM (notification)",
   "Cho biết đổi gói, khoá, chặn dữ liệu có tới mạng ngay không; thấp thì khách hàng phải khởi động lại máy.","≥ 99,5 %.",
   "udm>amf:Nudm_SDM_Notification (am-data)!A;udm>smf:Nudm_SDM_Notification (sm-data);amf>udm:204!S"]);
  add(["udm_lat","5G","core","int","Nudm Mean Response Time","amf,smf,udm","udm","g|ms|0|300|d|50|150|28",
   "Thời gian TB = tổng thời gian từ khi UDM nhận tới khi trả lời / số yêu cầu, theo dịch vụ (UEAU, UECM, SDM).","TS 29.503, TS 28.552. Tên bộ đếm cần đối chiếu.",
   "?Tra Huawei UDM PM (response time)","?Tra Ericsson UDM PM (latency)","?Tra Nokia UDM PM (latency)",
   "Tăng trước khi tỉ lệ thành công giảm: dấu hiệu sớm của quá tải UDR hoặc sao chép đồng bộ chậm.","≤ 50 ms (UEAU ≤ 100 ms).",
   "amf>udm:Yêu cầu Nudm!A;udm>amf:Trả lời!S"]);
  add(["udm_load","5G","core","utl","UDR Load (TPS Utilisation)","udm","udm","g|%|0|100|d|70|90|46",
   "Tỉ lệ % = TPS đỉnh 15 phút của UDR / TPS định cỡ × 100, theo site.","TS 29.504 (Nudr), số liệu nền tảng. Chỉ số tự tính.",
   "?Tra Huawei USCDB/UDR PM (TPS)","?Tra Ericsson CUDB PM (TPS)","?Tra Nokia One-NDS PM (transactions)",
   "Định cỡ N+1: với 2 site chia tải, mỗi site nên dưới 50 % để gánh được khi mất site kia.","≤ 70 % giờ bận; ≤ 50 % nếu 2 site active-active.",
   "udm>udm:Nudr Query/Update (N35)!A;udm>udm:Trả lời UDR!S"]);
  const XN={udm_uecm:["Tỉ lệ đăng ký UECM ở UDM thành công","UECM reg SR","UDM|UECM|Nudm|amf-3gpp-access|đăng ký AMF","Phần yêu cầu Nudm_UECM_Registration thành công."],
    udm_sdm:["Tỉ lệ lấy dữ liệu thuê bao SDM thành công","SDM Get SR","UDM|SDM|Nudm_SDM|am-data|sm-data|DATA_NOT_FOUND","Phần yêu cầu Nudm_SDM_Get thành công."],
    udm_ntf:["Tỉ lệ thông báo đổi dữ liệu thuê bao tới được NF","SDM notify SR","SDM Notification|đổi gói|provisioning|subscribe","Phần thông báo SDM được AMF/SMF nhận."],
    udm_lat:["Thời gian đáp ứng Nudm trung bình","Nudm latency","UDM|độ trễ Nudm|response time|UDR","Thời gian UDM trả lời một yêu cầu."],
    udm_load:["Tải UDR theo TPS","UDR load","UDR|TPS|CUDB|One-NDS|định cỡ","Phần năng lực giao dịch UDR đang dùng."]};
  const EN={udm_uecm:"Nudm_UECM Registration Success Rate",udm_sdm:"Nudm_SDM Get Success Rate",udm_ntf:"Nudm_SDM Notification Success Rate",udm_lat:"Nudm Mean Response Time",udm_load:"UDR Load (TPS Utilisation)"};
  for(const id in XN){const k=KL.find(x=>x.id===id);if(!k)continue;const x=XN[id];if(typeof KX!=='undefined')KX[id]=x;if(typeof KEN!=='undefined')KEN[id]=EN[id];
    k.fn=x[0];k.ab=[x[1]].concat(x[2].split('|'));k.gl=x[3];k.dn=k.fn+' ('+x[1]+')';k.en=EN[id];}
  const ids=Object.keys(XN),moved=ids.map(id=>{const i=KL.findIndex(k=>k.id===id);return i>=0?KL.splice(i,1)[0]:null;}).filter(Boolean);
  let j=KL.findIndex(k=>k.id==='nsl_sla');if(j<0)j=KL.findIndex(k=>k.id==='pn_fwa');KL.splice(j>=0?j+1:KL.length,0,...moved);
}catch(e){console.error('KPI UDM',e);}})();
/* tìm kiếm chung */
if(typeof qSnap==='function'){const _qs=qSnap;qSnap=function(){_qs.apply(this,arguments);if(!QS||!QS.I||QS.udm)return;QS.udm=1;
  const CAT='Thẻ UDM và dữ liệu thuê bao',body=document.getElementById('udmBody'),cur=UDXS.v;
  if(body){for(const [v,vn] of UDXV){try{UDXS.v=v;body.innerHTML=UDXR[v].html();
    body.querySelectorAll('.panel').forEach(pn=>{const h=pn.querySelector('h3'),tt=h?h.textContent:vn,txt=qText(pn).slice(0,6000);if(txt.trim().length<12)return;
      qAdd(QS.I,CAT+' · '+vn,tt,txt,1,()=>{S.tab='udm';UDXS.v=v;},()=>[...document.querySelectorAll('#t-udm .panel')].find(p=>{const x=p.querySelector('h3');return x&&x.textContent===tt;}));});}catch(e){console.error(e);}}
    UDXS.v=cur;UDXS.job++;try{if(S.tab==='udm')renderUdm();else body.innerHTML='';}catch(e){}}
  const go=(v,f)=>()=>{S.tab='udm';UDXS.v=v;if(f)f();};
  UDXPAR.forEach(r=>qAdd(QS.I,'UDM, dữ liệu thuê bao · Tham số '+r[1],r[2],['Huawei: '+r[3],'Nokia: '+r[4],'Ericsson: '+r[5],'Điển hình: '+r[6]].join('. '),3,go('vd',()=>{UDXP.vd.grp=r[1];UDXP.vd.q='';}),'#udxParB'));
  UDXKPI.forEach(k=>qAdd(QS.I,'UDM, dữ liệu thuê bao · KPI',k[0],[k[1],k[5]].join('. '),3,go('vd'),'#udxKpB'));
  UDXFLT.forEach(f=>qAdd(QS.I,'UDM, dữ liệu thuê bao · Lỗi thường gặp',f[0],[f[1],f[2].join('; '),f[3].join('; ')].join('. '),3,go('vd'),()=>{const d=[...document.querySelectorAll('#t-udm .udxflt')].find(x=>x.querySelector('summary').textContent===f[0]);if(d)d.open=true;return d;}));
  Object.entries(UDXLAD).forEach(([k,l])=>qAdd(QS.I,'UDM · Lược đồ bản tin',l.n,l.m.map(q=>q[3]).join('. '),2,go('svc',()=>{UDXP.svc.lad=k;UDXP.svc.step=0;}),'#udxLad'));
  Object.entries(UDXLAD2).forEach(([k,l])=>qAdd(QS.I,'UDM · Liên hoạt động HSS',l.n,l.m.map(q=>q[3]).join('. '),2,go('iwk',()=>{UDXP.iwk.lad=k;UDXP.iwk.step=0;}),'#udxLad2'));
  UDXMAP.forEach(r=>qAdd(QS.I,'UDM · Ánh xạ mã lỗi',r[0],r[1]+'. '+r[2],2,go('iwk'),'#udmBody'));
  [['UDM, UDR, AUSF, ARPF, SIDF','HSS+UDM hội tụ front-end back-end UDR dùng chung PCF NEF N8 N10 N13 N35 N36 N37','arch'],['Nudm UEAU UECM SDM EE PP, Nausf, Nudr','subscribe notify đổi AMF roaming SoR AUTS resynchronization','svc'],
   ['Dữ liệu thuê bao AM, SM, SMF selection','am-data sm-data DNN S-NSSAI 5QI AMBR provisioning khoá xoá thuê bao ODB','data'],['Geo-redundancy UDR, bão đăng ký','active-active active-standby sao chép đồng bộ back-off T3346 overload OCI LCI 503','geo'],
   ['Liên hoạt động HSS UDM Diameter HTTP/2','S6a Cx SWx IWF N26 ULR CLR IDR AIR ánh xạ mã lỗi','iwk']].forEach(([n,x,v])=>qAdd(QS.I,'UDM và dữ liệu thuê bao',n,x,2,go(v),'#udmBody'));};}
/* thẻ E2E: nút sang thẻ này */
if(typeof e2Kpi==='function'){const _ke=e2Kpi;e2Kpi=function(){_ke.apply(this,arguments);if(!['reg','data','roam'].includes(S.e2Sc)||S.e2R!=='sa')return;const b=$('#e2Kpi .e2go');
  if(b&&!b.querySelector('[data-udxgo]'))b.insertAdjacentHTML('beforeend',S.e2Sc==='reg'?`<button type="button" class="btn sm" data-udxgo="udm:svc">UDM · Nudm UEAU, UECM, SDM khi đăng ký →</button>`:S.e2Sc==='data'?`<button type="button" class="btn sm" data-udxgo="udm:data">UDM · SM data: DNN, S-NSSAI, 5QI, AMBR →</button>`:`<button type="button" class="btn sm" data-udxgo="udm:svc">UDM · roaming qua SEPP, SoR →</button>`);};}
/* thẻ KPI: nút sang mục tương ứng */
const UDXKV={udm_uecm:'svc',udm_sdm:'data',udm_ntf:'data',udm_lat:'geo',udm_load:'geo',s_suci:'arch',s_synch:'svc',e_s6a:'iwk',sbi5:'svc'};
if(typeof kpDetHtml==='function'){const _kd=kpDetHtml;kpDetHtml=function(k){let h=_kd.apply(this,arguments);if(k&&UDXKV[k.id]){const v=UDXKV[k.id];h+=`<p class="u3kpl"><button type="button" class="btn sm" data-udxgo="udm:${v}">Xem mô phỏng ở thẻ UDM · ${nE(UDXV.find(x=>x[0]===v)[1])} →</button></p>`;}return h;};}
/* thanh nút ở các thẻ liên quan */
const UDXTABL={sc:[['arch','UDM, AUSF, ARPF, SIDF'],['svc','Ladder 5G-AKA, đồng bộ SQN (AUTS)']],core:[['arch','UDM, UDR, AUSF, HSS+UDM'],['svc','Nudm, Nausf, Nudr'],['geo','Dự phòng UDR, bão đăng ký']],
 nsl:[['data','SM data: S-NSSAI, DNN, 5QI, AMBR'],['svc','Ladder lập phiên PDU, SDM Get']],ims:[['iwk','HSS hội tụ: Cx, Nhss_ims']],rm:[['svc','Roaming: UDM nhà, SoR'],['iwk','Diameter ↔ HTTP/2']]};
const udxBar=t=>`<div class="sclkbar udxlkbar nogl"><span>Mô phỏng ở thẻ <b>UDM và dữ liệu thuê bao</b>:</span>${t.map(x=>`<button type="button" class="btn sm" data-udxgo="udm:${x[0]}">${nE(x[1])} →</button>`).join('')}</div>`;
Object.keys(UDXTABL).forEach(t=>{const f=RENDER[t];if(typeof f!=='function')return;RENDER[t]=function(){const r=f.apply(this,arguments);try{const sec=document.getElementById('t-'+t);if(sec&&!sec.querySelector('.udxlkbar')){const ld=sec.querySelector('.lead');if(ld)ld.insertAdjacentHTML('afterend',udxBar(UDXTABL[t]));else sec.insertAdjacentHTML('afterbegin',udxBar(UDXTABL[t]));}}catch(e){}return r;};});
/* thẻ Mạng riêng 5G: mục arch (credential SNPN) */
if(typeof PNR!=='undefined'){const R=PNR.arch;if(R&&typeof R.html==='function'){const h=R.html;R.html=function(){return h.apply(this,arguments)+`<div class="panel udxpnp">${udxBar([['arch','UDM/AUSF giữ credential, SIDF'],['svc','Ladder xác thực, UECM, SDM'],['data','Hồ sơ thuê bao, S-NSSAI, DNN']])}</div>`;};}
  if(typeof PNTB!=='undefined'&&Array.isArray(PNTB)&&!PNTB.some(x=>x[0]==='udm'))PNTB.push(['udm','UDM và dữ liệu thuê bao']);}
if(typeof NSLTB!=='undefined'&&Array.isArray(NSLTB)&&!NSLTB.some(x=>x[0]==='udm'))NSLTB.push(['udm','UDM (SM data)']);
if(typeof SCLK!=='undefined'){['aka','vd'].forEach(v=>{const L=SCLK[v];if(L){L.tab=L.tab||[];if(!L.tab.some(x=>x[0]==='udm'))L.tab.unshift(['udm','UDM và dữ liệu thuê bao']);}});}
