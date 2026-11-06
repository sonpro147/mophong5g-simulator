
/* ===== Thẻ Mạng riêng 5G (pn) — đợt 15 lộ trình (BRIEF 20) ===== */
const PNS={v:'arch',raf:0,last:0,pause:false,at:0,lt:0,ut:0,tt:0,ft:0,job:0,drag:-1,dirty:0};
const PNV=[['arch','Mô hình triển khai'],['rf','Vô tuyến khuôn viên'],['urllc','URLLC công nghiệp'],['tsn','TSN và 5G LAN'],['svc','FWA và dịch vụ ngành'],['vd','Tham số, KPI, lỗi']];
const PNR={},PNP={},PNF={};
function pnSl(vw,k,l,mn,mx,st,f,hint,pk){PNF[vw+':'+k]=f;const v=PNP[vw][k];
  return `<label class="c"><span class="cl">${l}<output>${f(v)}</output></span><input type="range" data-pni="${vw}:${k}" min="${mn}" max="${mx}" step="${st}" value="${v}">${hint?`<span class="u3ph">${hint}</span>`:''}${pk?pnPnTag(pk):''}</label>`;}
function pnSel(vw,k,l,opts,hint,pk){const v=PNP[vw][k];
  return `<label class="c"><span class="cl">${l}</span><select data-pni="${vw}:${k}">${opts.map(o=>`<option value="${o[0]}"${String(o[0])===String(v)?' selected':''}>${nE(o[1])}</option>`).join('')}</select>${hint?`<span class="u3ph">${hint}</span>`:''}${pk?pnPnTag(pk):''}</label>`;}
function pnChk(vw,k,l,pk){return `<label class="u3ck"><input type="checkbox" data-pni="${vw}:${k}"${PNP[vw][k]?' checked':''}> ${l}</label>${pk?pnPnTag(pk):''}`;}
function pnPn(key){const r=(typeof PNPAR!=='undefined'?PNPAR:[]).find(x=>x[0]===key);if(!r)return'';const v=nVn();if(v==='3gpp')return'';
  return nVName(v)+': '+r[{huawei:3,nokia:4,ericsson:5}[v]]+' (cần đối chiếu)';}
function pnPnTag(key){const t=pnPn(key);return t?`<span class="vh ndvh">${nE(t)}</span>`:'';}
const pnKv=(a,b)=>`<dt>${a}</dt><dd>${b}</dd>`;
const pnSet=(id,h)=>{const e=document.getElementById(id);if(e)e.innerHTML=h;};
function pnPct(b,p){if(!b.length)return 0;const i=nC((b.length-1)*p,0,b.length-1),lo=Math.floor(i),hi=Math.ceil(i);return b[lo]+(b[hi]-b[lo])*(i-lo);}
const pnMs=x=>!isFinite(x)||x>=1e8?'mất gói':x<0.1?nF(x*1000,0)+' µs':nF(x,x<10?2:1)+' ms';
const pnMb=x=>x>=1000?nF(x/1000,2)+' Gbit/s':nF(x,x<10?1:0)+' Mbit/s';
const pnOk=(b,t)=>`<span class="kpC ${b?'ok':'no'}">${t||(b?'Đạt':'Không đạt')}</span>`;
const PNE='var(--nr)',PNO='var(--lte)',PNSH='var(--up)';

/* ---------- Mục 1: mô hình triển khai ---------- */
const PNM={
 snpn:{n:'SNPN độc lập (RAN + 5GC tại chỗ)',s:'SNPN',d:'Doanh nghiệp sở hữu cả RAN và lõi 5GC đặt trong khuôn viên. Mạng nhận dạng bằng cặp PLMN ID + NID, không dựa vào nhà mạng công cộng; dữ liệu và hồ sơ thuê bao nằm tại chỗ.',
  loc:{ru:'e',cu:'e',cp:'e',upf:'e',mec:'e'},cp:['ue','ru','cu','cp'],up:['ue','ru','cu','upf','mec'],
  t:['Cao: dữ liệu, thuê bao, khoá đều ở khuôn viên','5–10 ms (UPF tại chỗ)','Cao: mua RAN, lõi, cần phổ cục bộ','Không','Khó: phải dùng N3IWF qua PLMN hoặc thoả thuận riêng','3–6 tháng']},
 pni:{n:'PNI-NPN (slice riêng + CAG trên mạng công cộng)',s:'PNI-NPN',d:'Mạng riêng là một phần của mạng công cộng: nhà mạng cấp lát cắt (S-NSSAI, DNN) riêng và giới hạn cell bằng CAG (Closed Access Group). RAN, lõi và UPF đều của nhà mạng.',
  loc:{ru:'o',cu:'o',cp:'o',upf:'o',mec:'o'},cp:['ue','ru','cu','cp'],up:['ue','ru','cu','upf','mec'],
  t:['Thấp: dữ liệu đi qua lõi nhà mạng','15–30 ms (UPF ở trung tâm vùng)','Thấp: thuê dịch vụ theo tháng','Hoàn toàn','Có sẵn: cùng SIM, roaming bình thường','Vài tuần']},
 hyb:{n:'Lai: RAN chia sẻ MOCN, UPF/MEC tại doanh nghiệp',s:'Lai',d:'Trạm trong khuôn viên chia sẻ MOCN với nhà mạng (phát cả PLMN công cộng và mạng riêng). Lõi điều khiển (AMF, SMF, UDM) ở nhà mạng; UPF và MEC đặt tại doanh nghiệp để dữ liệu sản xuất không rời khuôn viên.',
  loc:{ru:'s',cu:'s',cp:'o',upf:'e',mec:'e'},cp:['ue','ru','cu','cp'],up:['ue','ru','cu','upf','mec'],
  t:['Trung bình–cao: dữ liệu người dùng ở lại, báo hiệu ra nhà mạng','5–10 ms (UPF tại chỗ)','Trung bình','Một phần (lõi điều khiển, UDM)','Có (thuê bao là của nhà mạng)','1–3 tháng']},
 n3iwf:{n:'SNPN truy nhập qua PLMN (N3IWF) và ngược lại',s:'Qua N3IWF',d:'UE ở ngoài khuôn viên dùng mạng công cộng như đường truyền IP, rồi dựng đường hầm IPsec (NWu) tới N3IWF của SNPN để đăng ký và dùng dịch vụ mạng riêng. Chiều ngược lại: UE trong SNPN truy nhập dịch vụ PLMN qua N3IWF của nhà mạng.',
  loc:{ru:'e',cu:'e',cp:'e',upf:'e',mec:'e'},cp:['ue','pran','pupf','inet','n3','cp'],up:['ue','pran','pupf','inet','n3','upf','mec'],
  t:['Cao (lõi vẫn tại chỗ)','20–40 ms (qua Internet, IPsec)','Thấp (thêm N3IWF)','Phụ thuộc vùng phủ nhà mạng ngoài khuôn viên','Chính là cách ra ngoài khuôn viên','Vài tuần nếu đã có SNPN']}
};
const PNMK=Object.keys(PNM);
const PNN={
 ue:{l:'UE',r:'Thiết bị đầu cuối công nghiệp: AGV, camera, PLC có modem 5G, CPE. Cấu hình danh sách SNPN (PLMN ID + NID) hoặc danh sách CAG được phép.',v:{h:'Mô-đun 5G RedCap/eMBB của bên thứ ba',n:'Mô-đun và CPE công nghiệp của đối tác',e:'Mô-đun và router công nghiệp của đối tác'}},
 ru:{l:'Small cell',r:'Khối vô tuyến trong nhà xưởng: 4T4R, 250 mW–1 W mỗi cổng, gắn trần hoặc cột 6–10 m. Số lượng do vùng lõm sau máy kim loại quyết định.',v:{h:'LampSite / small cell 5G',n:'AirScale indoor, small cell',e:'Radio Dot System'}},
 cu:{l:'DU/CU (gNB)',r:'Băng gốc: lập lịch, HARQ, RRC. Với URLLC nên đặt cùng khuôn viên để giảm trễ fronthaul/midhaul.',v:{h:'BBU 5900 (giải pháp 5GtoB)',n:'AirScale baseband (DAC)',e:'Baseband 6630 (Ericsson Private 5G)'}},
 cp:{l:'5GC: AMF, SMF, AUSF, UDM',r:'Lõi mặt phẳng điều khiển: đăng ký, xác thực, phiên PDU, chính sách. SNPN cần UDM/AUSF riêng giữ thuê bao và credential.',v:{h:'UNC gọn cho 5GtoB',n:'Lõi tích hợp trong Nokia DAC',e:'Lõi gọn trong Ericsson Private 5G'}},
 upf:{l:'UPF',r:'Chuyển tiếp mặt phẳng người dùng. Đặt tại chỗ để dữ liệu không rời khuôn viên và trễ thấp; có thể làm chuyển mạch 5G LAN (N19, chuyển cục bộ).',v:{h:'UDG / MEP@campus',n:'UPF trong MX Industrial Edge',e:'Local Packet Gateway'}},
 mec:{l:'MEC / ứng dụng',r:'Máy chủ biên: điều khiển AGV, phân tích hình ảnh AI, SCADA, PLC ảo.',v:{h:'MEC@campus',n:'MX Industrial Edge',e:'Edge của Ericsson Private 5G'}},
 n3:{l:'N3IWF',r:'Cổng tương tác không tin cậy: kết thúc IKEv2/IPsec (NWu) từ UE, nối N2/N3 vào lõi SNPN.',v:{h:'N3IWF/ePDG',n:'N3IWF trong lõi Nokia',e:'N3IWF trong Dual-mode Core'}},
 pran:{l:'gNB nhà mạng',r:'Trạm macro của mạng công cộng phục vụ UE khi ra khỏi khuôn viên.',v:{h:'—',n:'—',e:'—'}},
 pupf:{l:'5GC + UPF nhà mạng',r:'Lõi công cộng cấp phiên PDU Internet cho UE; gói IPsec tới N3IWF đi trong phiên này.',v:{h:'—',n:'—',e:'—'}},
 inet:{l:'Internet',r:'Đường IP công cộng giữa mạng nhà mạng và N3IWF của doanh nghiệp.',v:{h:'—',n:'—',e:'—'}}
};
const PNPOS={ue:[70,232],ru:[150,82],cu:[250,160],cp:{e:[340,92],o:[600,92]},upf:{e:[290,232],o:[600,232]},mec:{e:[420,232],o:[680,180]},n3:[420,140],pran:[560,150],pupf:[640,232],inet:[650,60]};
function pnPos(k,m){const p=PNPOS[k];if(Array.isArray(p)){if(k==='ue'&&m==='n3iwf')return [520,272];return p;}const l=PNM[m].loc[k];return p[l==='o'?'o':'e'];}
function pnNodes(m){return ['ue','ru','cu','cp','upf','mec'].concat(m==='n3iwf'?['n3','pran','pupf','inet']:[]);}
function pnOwn(k,m){if(['pran','pupf','inet'].includes(k))return 'o';if(k==='n3'||k==='ue')return 'e';return PNM[m].loc[k];}
const PNOC={e:PNE,o:PNO,s:PNSH};
const PNON={e:'doanh nghiệp',o:'nhà mạng',s:'chia sẻ (MOCN)'};
PNP.arch={m:'snpn',node:'cp',lad:'reg',step:0,sel:'auto',cred:'usim'};
function pnArchSvg(){const m=PNP.arch.m,M=PNM[m],ns=pnNodes(m);let s='';
  s+=`<rect x="8" y="22" width="462" height="270" rx="12" style="fill:color-mix(in srgb,${PNE} 7%,transparent);stroke:${PNE};stroke-dasharray:6 5"/><text x="18" y="40" class="sftx">Khuôn viên nhà máy</text>`;
  s+=`<rect x="486" y="22" width="226" height="270" rx="12" style="fill:color-mix(in srgb,${PNO} 7%,transparent);stroke:${PNO};stroke-dasharray:6 5"/><text x="498" y="40" class="sftx">Nhà mạng công cộng</text>`;
  [[110,120],[200,60],[60,150]].forEach(([x,y])=>{s+=`<rect x="${x-9}" y="${y-6}" width="18" height="12" rx="3" style="fill:none;stroke:var(--muted);opacity:.6"/>`;});
  s+=`<rect x="160" y="200" width="60" height="44" rx="4" style="fill:var(--muted);opacity:.18"/><text x="190" y="226" class="sfsm" text-anchor="middle">máy</text>`;
  const ln=(a,b,c,d)=>{const p=pnPos(a,m),q=pnPos(b,m);return `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" style="stroke:${c};stroke-width:2;${d?'stroke-dasharray:5 4;':''}opacity:.75"/>`;};
  for(let i=0;i<M.cp.length-1;i++)s+=ln(M.cp[i],M.cp[i+1],'var(--cp)',1);
  for(let i=0;i<M.up.length-1;i++)s+=ln(M.up[i],M.up[i+1],'var(--up)');
  if(m==='hyb')s+=ln('upf','cp','var(--cp)',1);
  if(!ns.some(k=>pnOwn(k,m)==='o'))s+=`<text x="599" y="160" class="sfsm" text-anchor="middle">không dùng trong mô hình này</text>`;
  ns.forEach(k=>{const [x,y]=pnPos(k,m),o=pnOwn(k,m),sel=PNP.arch.node===k,w=k==='cp'?170:k==='ue'?44:k==='mec'||k==='pupf'?116:100;
    s+=`<g class="pnnd" data-pna="arch:node|${k}" role="button" tabindex="0" aria-label="${nE(PNN[k].l)}"><rect x="${x-w/2}" y="${y-15}" width="${w}" height="30" rx="7" style="fill:var(--panel);stroke:${PNOC[o]};stroke-width:${sel?3.2:1.6}"/><text x="${x}" y="${y+4}" class="sftx" text-anchor="middle" style="font-size:11px">${nE(PNN[k].l)}</text></g>`;});
  s+=`<circle id="pnDotC" r="5" style="fill:var(--cp)"/><circle id="pnDotU" r="5" style="fill:var(--up)"/>`;
  s+=`<g transform="translate(20,282)"><line x1="0" y1="0" x2="22" y2="0" style="stroke:var(--cp);stroke-width:2;stroke-dasharray:5 4"/><text x="28" y="4" class="sfsm">CP (báo hiệu)</text><line x1="120" y1="0" x2="142" y2="0" style="stroke:var(--up);stroke-width:2"/><text x="148" y="4" class="sfsm">UP (dữ liệu)</text><rect x="240" y="-6" width="12" height="12" style="fill:none;stroke:${PNE}"/><text x="258" y="4" class="sfsm">doanh nghiệp</text><rect x="346" y="-6" width="12" height="12" style="fill:none;stroke:${PNO}"/><text x="364" y="4" class="sfsm">nhà mạng</text></g>`;
  return `<svg viewBox="0 0 720 300" class="u3svg pnsvg" role="img" aria-label="Sơ đồ khuôn viên theo mô hình ${nE(M.s)}">${s}</svg>`;}
function pnPath(ids,m,f){const P=ids.map(k=>pnPos(k,m));let L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));
  const d=(f%1)*L[L.length-1];let i=1;while(i<L.length-1&&L[i]<d)i++;const t=(d-L[i-1])/Math.max(1e-6,L[i]-L[i-1]);return [P[i-1][0]+(P[i][0]-P[i-1][0])*t,P[i-1][1]+(P[i][1]-P[i-1][1])*t];}
function pnNodeInfo(){const m=PNP.arch.m,k=PNP.arch.node,N=PNN[k],o=pnOwn(k,m),v=nVn();
  const vp=v==='3gpp'?['Huawei: '+N.v.h,'Nokia: '+N.v.n,'Ericsson: '+N.v.e].map(nE).join('<br>'):nVName(v)+': '+nE(N.v[v[0]]);
  return `<dl class="kv">${pnKv('Nút',nE(N.l))+pnKv('Vai trò',nE(N.r))+pnKv('Vị trí trong mô hình này',`<b style="color:${PNOC[o]}">${PNON[o]}</b>`)+pnKv('Sản phẩm vendor',vp+' <span class="kpC mid">Cần đối chiếu</span>')}</dl>`;}
function pnSib(){const m=PNP.arch.m;const L=['SIB1','  cellAccessRelatedInfo'];
  if(m==='pni'){L.push('    plmn-IdentityInfoList','      [1] plmn-IdentityList: [ mcc 452, mnc 0x ]  (mạng công cộng)','          trackingAreaCode: 2101, cellIdentity: gNB 7001 cell 1','          cellReservedForOperatorUse: notReserved','    npn-IdentityInfoList-r16','      [1] npn-IdentityList-r16: pni-npn-IdentityList-r16','            plmn-Identity: mcc 452, mnc 0x','            cag-IdentityList-r16: [ 0x0000A1B2 ]','          trackingAreaCode-r16: 2101','  (UE chỉ được ở cell nếu CAG 0x0000A1B2 có trong Allowed CAG list;','   cell "CAG-only" thì UE ngoài CAG coi như bị cấm)');}
  else{if(m==='hyb')L.push('    plmn-IdentityInfoList','      [1] plmn-IdentityList: [ mcc 452, mnc 0x ]  (nhà mạng, MOCN)','          trackingAreaCode: 2101, cellReservedForOperatorUse: notReserved');
    else L.push('    plmn-IdentityInfoList: (không có PLMN công cộng)');
    L.push('    cellReservedForOtherUse: true   (UE thường coi cell bị cấm)','    npn-IdentityInfoList-r16','      [1] npn-IdentityList-r16: snpn-IdentityList-r16','            plmn-Identity: mcc 999, mnc 99','            nid-List-r16: [ 0x1A2B3C4D5E6 ]   (NID 44 bit, 11 chữ số hex)','          trackingAreaCode-r16: 0001','          cellIdentity-r16: gNB 1 cell 1','  SIB10: HRNN "Nha may A - 5G rieng" (tên đọc được cho chọn thủ công)');
    if(m==='n3iwf')L.push('  (UE ở ngoài: đọc SIB1 bình thường của PLMN, sau đó tìm N3IWF','   của SNPN qua DNS/cấu hình, dựng IKEv2 trên phiên PDU Internet)');}
  return `<pre class="u3pre pnpre">${nE(L.join('\n'))}</pre>`;}
const PNCRED={usim:['USIM (5G-AKA hoặc EAP-AKA′)','Thẻ SIM/eSIM do doanh nghiệp cấp; UDM/AUSF của SNPN giữ khoá K. Quen thuộc, an toàn, hợp với thiết bị đông.'],
 ch:['Credentials Holder bên ngoài (AAA)','Rel-17: AUSF của SNPN chuyển xác thực sang AAA-S hoặc AUSF/UDM của bên giữ credential (nhà mạng khác, hệ thống IT doanh nghiệp). UE dùng credential sẵn có, không cần thẻ riêng.'],
 tls:['EAP-TLS (chứng chỉ, không SIM)','Thiết bị mang chứng chỉ X.509; AUSF làm EAP server hoặc chuyển tiếp. Hợp với thiết bị IT có PKI sẵn (TS 33.501 Annex B).'],
 ttls:['EAP-TTLS (tên đăng nhập/mật khẩu trong đường hầm)','Rel-17 cho SNPN: đường hầm TLS bảo vệ thông tin đăng nhập bên trong; dễ triển khai cho thiết bị không SIM, kém hơn về chống lộ thông tin.']};
const PNLAD={
 reg:{n:'Registration vào SNPN thành công',c:['UE','gNB','AMF','AUSF/UDM'],m:[
  [1,0,'RRC','SIB1 (npn-IdentityInfoList: 999-99 + NID)','UE ở chế độ truy nhập SNPN: chỉ chọn cell có PLMN ID + NID nằm trong danh sách đã cấu hình'],
  [0,1,'RRC','RRCSetupRequest',''],[1,0,'RRC','RRCSetup',''],
  [0,1,'RRC','RRCSetupComplete (selectedPLMN/NID, Registration Request)','Chỉ số SNPN được chọn và NAS Registration Request (SUCI)'],
  [1,2,'NGAP','Initial UE Message (Registration Request, NID)','gNB chọn AMF hỗ trợ SNPN đó và gửi NID kèm theo'],
  [2,3,'NAS','Nausf_UEAuthentication (5G-AKA / EAP-TLS)','AUSF xác định phương thức theo credential của SUPI'],
  [2,0,'NAS','Authentication Request / Response',''],[2,0,'NAS','Security Mode Command / Complete','Khoá NAS dẫn xuất từ K_AMF'],
  [2,1,'NGAP','Initial Context Setup Request','Khoá K_gNB, Allowed NSSAI'],[2,0,'NAS','Registration Accept (5G-GUTI, Allowed NSSAI)',''],[0,2,'NAS','Registration Complete','UE đã đăng ký SNPN']]},
 cag:{n:'UE không thuộc CAG → Registration Reject #76',c:['UE','gNB','AMF','UDM'],m:[
  [1,0,'RRC','SIB1 (cag-IdentityList: 0x0000A1B2)','Cell CAG của PNI-NPN'],
  [0,1,'RRC','RRCSetupComplete (Registration Request)','UE chọn nhầm (chọn thủ công) hoặc danh sách Allowed CAG cũ'],
  [1,2,'NGAP','Initial UE Message (NAS, CAG ID của cell)',''],
  [2,3,'NAS','Nudm_SDM_Get (Allowed CAG list)','Thuê bao không có CAG 0x0000A1B2'],
  [2,0,'NAS','Registration Reject (5GMM cause #76)','#76: Not authorized for this CAG or authorized for CAG cells only; kèm danh sách Allowed CAG mới'],
  [0,0,'NAS','UE cập nhật Allowed CAG list, không chọn lại cell này','Rel-17: thêm thời hạn hiệu lực của CAG']]},
 nid:{n:'NID sai hoặc thuê bao không có SNPN → Reject #74/#75',c:['UE','gNB','AMF','AUSF/UDM'],m:[
  [1,0,'RRC','SIB1 (999-99 + NID 0x1A2B3C4D5E6)','UE cấu hình NID 0x1A2B3C4D5E7 (gõ sai một ký tự)'],
  [0,0,'RRC','Không tìm thấy SNPN khớp → không chọn cell','Nếu ép chọn thủ công:'],
  [0,1,'RRC','RRCSetupComplete (Registration Request)',''],[1,2,'NGAP','Initial UE Message',''],
  [2,3,'NAS','Xác thực thất bại / không có thuê bao','UDM không có SUPI cho SNPN này'],
  [2,0,'NAS','Registration Reject (cause #74 hoặc #75)','#74 Temporarily not authorized for this SNPN; #75 Permanently not authorized for this SNPN'],
  [0,0,'NAS','UE thêm SNPN vào danh sách bị cấm','Kiểm tra NID, SUPI, credential']]},
 n3:{n:'Truy nhập SNPN qua PLMN (N3IWF)',c:['UE','PLMN (gNB + UPF)','N3IWF','AMF SNPN'],m:[
  [0,1,'NAS','Registration + phiên PDU Internet trên PLMN','UE dùng SIM nhà mạng làm đường truyền IP'],
  [0,2,'IKE','IKE_SA_INIT','Địa chỉ N3IWF lấy từ cấu hình hoặc DNS'],
  [0,2,'IKE','IKE_AUTH (EAP-5G, NAS Registration Request)','Bản tin NAS bọc trong EAP-5G'],
  [2,3,'NGAP','Initial UE Message (NAS)','N3IWF chọn AMF của SNPN'],
  [3,0,'NAS','Authentication / Security Mode (qua NWu)','Xác thực theo credential của SNPN'],
  [3,2,'NGAP','Initial Context Setup (K_N3IWF)',''],
  [2,0,'IKE','IKE_AUTH xong, lập IPsec SA cho NAS','Đường hầm NWu'],
  [3,0,'NAS','Registration Accept',''],[0,2,'IKE','CREATE_CHILD_SA cho phiên PDU SNPN','Dữ liệu người dùng đi IPsec → N3IWF → N3 → UPF của SNPN']]}
};
function pnLadSvg(){const L=PNLAD[PNP.arch.lad],n=L.m.length,cur=PNP.arch.step,X=[60,250,450,640];let s='';
  L.c.forEach((c,i)=>{s+=`<text x="${X[i]}" y="18" class="sftx" text-anchor="middle">${nE(c)}</text><line x1="${X[i]}" y1="26" x2="${X[i]}" y2="${36+n*26}" style="stroke:var(--line);stroke-width:1.4"/>`;});
  L.m.forEach((q,i)=>{const y=44+i*26,a=X[q[0]],b=X[q[1]],on=i<=cur,c=i===cur?'var(--warn)':on?'var(--ink)':'var(--line)';
    if(a===b)s+=`<path d="M${a} ${y-6} h26 v12 h-26" style="fill:none;stroke:${c};stroke-width:1.4"/><text x="${a+32}" y="${y+4}" class="sfsm" style="fill:${on?'var(--ink)':'var(--muted)'}">${nE(q[3])}</text>`;
    else{const dir=b>a?1:-1;s+=`<line x1="${a}" y1="${y}" x2="${b}" y2="${y}" style="stroke:${c};stroke-width:${i===cur?2.4:1.3}"/><path d="M${b} ${y} l${-dir*7} -4 v8z" style="fill:${c}"/><text x="${Math.min(a,b)+8}" y="${y-5}" class="sfsm" style="fill:${on?'var(--ink)':'var(--muted)'}">${nE(q[3].length>62?q[3].slice(0,60)+'…':q[3])}</text>`;}});
  s+=`<circle id="pnLadDot" r="5" cx="-20" cy="-20" style="fill:var(--warn)"/>`;
  return `<svg viewBox="0 0 700 ${50+n*26}" class="u3svg pnsvg" role="img" aria-label="Lược đồ bản tin ${nE(L.n)}">${s}</svg>`;}
function pnLadLog(){const L=PNLAD[PNP.arch.lad];return nLog(L.m.slice(0,PNP.arch.step+1).map((q,i)=>({t:i*0.018,p:q[2],m:q[3],a:L.c[q[0]]+' → '+L.c[q[1]],d:q[4]})),PNP.arch.step);}
function pnArchTbl(){const R=['Độc lập dữ liệu','Trễ người dùng điển hình','Chi phí đầu tư','Phụ thuộc nhà mạng','Roaming ra mạng công cộng','Thời gian triển khai'];
  return `<div class="scroll"><table class="ndtb"><thead><tr><th>Tiêu chí</th>${PNMK.map(k=>`<th${k===PNP.arch.m?' class="pnhl"':''}>${nE(PNM[k].s)}</th>`).join('')}</tr></thead><tbody>${R.map((r,i)=>`<tr><td>${r}</td>${PNMK.map(k=>`<td${k===PNP.arch.m?' class="pnhl"':''}>${nE(PNM[k].t[i])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
PNR.arch={
 html(){const P=PNP.arch,M=PNM[P.m];
  return `${typeof lte==='function'&&lte()?'<p class="note">Đang ở chế độ 4G: mạng riêng LTE chỉ có dạng PLMN riêng hoặc CSG/APN riêng; thẻ này trình bày NPN của 5G (Rel-16 trở đi).</p>':''}
  <div class="panel"><h3>Bốn mô hình triển khai</h3><div class="seg u3seg sfsub" role="group" aria-label="Mô hình">${PNMK.map(k=>`<button type="button" data-pna="arch:m|${k}" aria-pressed="${k===P.m}">${nE(PNM[k].s)}</button>`).join('')}</div>
   <p class="e2d" style="margin-top:8px"><b>${nE(M.n)}.</b> ${nE(M.d)}</p>
   <div class="scroll"><div id="pnArchFig" class="pnfig pnw">${pnArchSvg()}</div></div><p class="hint">Chấm hồng chạy theo đường báo hiệu, chấm xanh theo đường dữ liệu của mô hình đang chọn. Bấm một khối để xem vai trò, vị trí đặt và sản phẩm vendor.</p>
   <div id="pnNodeInfo">${pnNodeInfo()}</div></div>
  <div class="panel"><h3>Nhận dạng mạng, chọn mạng và credential</h3><div class="cols"><div>${pnSib()}</div><div>
   <dl class="kv">${pnKv('Định danh',P.m==='pni'?'PLMN ID của nhà mạng + CAG ID (32 bit) + S-NSSAI/DNN riêng':'PLMN ID (có thể dùng MCC 999 dành cho mạng riêng) + NID 44 bit; NID tự gán hoặc phối hợp (chữ số đầu cho biết chế độ gán)')+pnKv('UE biết mạng nào',P.m==='pni'?'Allowed CAG list do AMF/UDM cấp; cờ "chỉ dùng cell CAG"':'Danh sách SNPN đã đăng ký (PLMN ID + NID) cấu hình sẵn hoặc qua UE Onboarding (Rel-17, ON-SNPN)')}</dl>
   <div class="ctl" style="margin-top:8px">${pnSel('arch','sel','Chọn mạng',[['auto','Tự động'],['man','Thủ công']],'','sel')}${pnSel('arch','cred','Credential',Object.entries(PNCRED).map(([k,v])=>[k,v[0]]),'','cred')}</div>
   <div id="pnSelOut"></div></div></div></div>
  <div class="panel"><h3>Lược đồ bản tin</h3><div class="seg u3seg sfsub" role="group" aria-label="Kịch bản bản tin">${Object.entries(PNLAD).map(([k,v])=>`<button type="button" data-pna="arch:lad|${k}" aria-pressed="${k===P.lad}">${nE(v.n)}</button>`).join('')}</div>
   <div class="row">${pnPlayBtn('arch','pnAPlay')}<button type="button" class="btn sm" data-pna="arch:prev">◀ Bước trước</button><button type="button" class="btn sm" data-pna="arch:next">Bước sau ▶</button></div>
   <div class="scroll"><div class="pnw pnlad" id="pnLad">${pnLadSvg()}</div></div><div id="pnLadLog">${pnLadLog()}</div></div>
  <div class="panel"><h3>So sánh bốn mô hình</h3>${pnArchTbl()}<p class="note">Giá trị điển hình để so sánh tương đối. Khái niệm NPN, SNPN, CAG và các bước UE vào mạng riêng có ở <button type="button" class="u3lnkbtn" data-tab="rsh">thẻ Chia sẻ RAN</button> và <button type="button" class="u3lnkbtn" data-bkgo="npn">chuyên đề Mạng riêng 5G</button>; thẻ này đi sâu vào triển khai.</p></div>`;},
 after(){pnSelOut();},
 upd(k){pnSelOut();},
 tick(dt){const P=PNP.arch,M=PNM[P.m];if(!PNS.pause){PNS.at=(PNS.at+dt*0.28)%1;PNS.lt+=dt;}
  const c=document.getElementById('pnDotC'),u=document.getElementById('pnDotU');
  if(c){const p=pnPath(M.cp,P.m,PNS.at);c.setAttribute('cx',p[0]);c.setAttribute('cy',p[1]);}
  if(u){const p=pnPath(M.up,P.m,(PNS.at+0.5)%1);u.setAttribute('cx',p[0]);u.setAttribute('cy',p[1]);}
  const L=PNLAD[P.lad],q=L.m[P.step],d=document.getElementById('pnLadDot'),X=[60,250,450,640];
  if(d&&q){const f=Math.min(1,PNS.lt/0.9),a=X[q[0]],b=X[q[1]];d.setAttribute('cx',a===b?a+13:a+(b-a)*f);d.setAttribute('cy',44+P.step*26);}
  if(!PNS.pause&&PNS.lt>1.5){PNS.lt=0;P.step=(P.step+1)%L.m.length;pnLadUpd();}},
 act(a){const P=PNP.arch,[k,v]=a.split('|');
  if(k==='m'){P.m=v;renderPn();}else if(k==='node'){P.node=v;pnSet('pnNodeInfo',pnNodeInfo());pnSet('pnArchFig',pnArchSvg());}
  else if(k==='lad'){P.lad=v;P.step=0;PNS.lt=0;renderPn();}
  else if(k==='play')pnPlayTog('pnAPlay');
  else if(k==='next'||k==='prev'){const n=PNLAD[P.lad].m.length;P.step=(P.step+(k==='next'?1:n-1))%n;PNS.lt=0;pnLadUpd();if(nReduced())PNR.arch.tick(0);}}
};
function pnLadUpd(){pnSet('pnLad',pnLadSvg());pnSet('pnLadLog',pnLadLog());}
function pnSelOut(){const P=PNP.arch,c=PNCRED[P.cred];
  pnSet('pnSelOut',`<dl class="kv">${pnKv('Chọn mạng',P.sel==='auto'?'Tự động: UE ở chế độ SNPN chỉ xét các SNPN có thuê bao, theo thứ tự ưu tiên đã cấu hình; với PNI-NPN, UE chọn PLMN như thường rồi chỉ ở cell CAG có trong Allowed CAG list.':'Thủ công: UE quét và hiện tên HRNN (SIB10) của các SNPN/CAG tìm thấy; người dùng chọn cả mạng không có trong danh sách, có thể bị Reject #74/#75/#76.')
   +pnKv('Credential',`<b>${nE(c[0])}</b>: ${nE(c[1])}`)}</dl><p class="note">Chi tiết 5G-AKA, EAP-AKA′, SUCI và cây khoá ở <button type="button" class="u3lnkbtn" data-tab="sc">thẻ Bảo mật và xác thực</button>.</p>`);}

/* ---------- Mục 2: vô tuyến khuôn viên ---------- */
const PNB={
 n78:{n:'n78 · 3300–3800 MHz (khối cục bộ)',f:3.7,scs:30,bws:[20,40,60,80,100],lic:'Đức 3700–3800 MHz cấp cục bộ; Nhật 4,6–4,9 GHz (n79) và 28 GHz local 5G; nhiều nước châu Âu, châu Á mở khối 3,8–4,2 GHz'},
 n77:{n:'n77 · 3300–4200 MHz',f:3.9,scs:30,bws:[20,40,60,80,100],lic:'Anh 3,8–4,2 GHz Shared Access; Pháp, Hà Lan, Thuỵ Điển có khối 3,8–4,2 GHz cục bộ'},
 n79:{n:'n79 · 4400–5000 MHz',f:4.7,scs:30,bws:[40,60,80,100],lic:'Nhật local 5G 4,6–4,9 GHz; Trung Quốc 4,9 GHz cho ngành'},
 n40:{n:'n40 · 2300–2400 MHz',f:2.35,scs:30,bws:[20,40,50,80],lic:'Một số nước cấp 2,3 GHz cho mạng chuyên dùng'},
 n48:{n:'n48 · 3550–3700 MHz (CBRS)',f:3.6,scs:30,bws:[20,40,60,80,100],lic:'Mỹ CBRS: GAA không cần giấy phép, PAL đấu giá theo hạt, SAS điều phối'},
 n258:{n:'n258 · 24,25–27,5 GHz (mmWave)',f:26,scs:120,bws:[50,100,200],lic:'Nhiều nước dành một phần 26 GHz cho mạng cục bộ; Nhật 28 GHz (n257) local 5G'},
 n257:{n:'n257 · 26,5–29,5 GHz (mmWave)',f:28,scs:120,bws:[50,100,200],lic:'Nhật 28,2–29,1 GHz local 5G; Mỹ 28 GHz'}
};
const PNIF={'InF-SL':[33,25.5,20,'Ít vật cản, trần cao'],'InF-DL':[18.6,35.7,20,'Dày vật cản, trần thấp'],'InF-SH':[32.4,23,20,'Ít vật cản, anten cao'],'InF-DH':[33.63,21.9,20,'Dày vật cản, anten cao']};
const PNOB=[{x:0,y:56,w:34,h:1.5,t:'wall'},{x:32.5,y:56,w:1.5,h:24,t:'wall'},{x:40,y:8,w:46,h:3,t:'rack'},{x:40,y:18,w:46,h:3,t:'rack'},{x:40,y:28,w:46,h:3,t:'rack'},{x:40,y:38,w:46,h:3,t:'rack'},
 {x:96,y:36,w:12,h:10,t:'mach'},{x:94,y:58,w:16,h:9,t:'mach'},{x:56,y:56,w:14,h:12,t:'mach'},{x:118,y:0,w:2,h:80,t:'wall'}];
const PNOBL={wall:12,rack:6,mach:9};const PNOBN={wall:'Tường bê tông',rack:'Kệ kim loại cao',mach:'Máy kim loại lớn'};
const PNSCD=[[20,20],[100,20],[20,68],[100,72],[62,48],[62,4],[90,50],[16,44]];
const PNTD={DDDSU:'DDDSU (DL nhiều, giống nhà mạng)',DSUUU:'DSUUU (UL nhiều cho camera)',DDSUU:'DDSUU (cân bằng)'};
PNP.rf={band:'n78',bw:100,n:4,sc:PNSCD.map(p=>p.slice()),sub:'InF-DH',pw:24,ld:50,lay:'sinr',thr:-100,st:0,tdd:'DSUUU',pub:'DDDSU',sync:1,dist:400,gd:20,rDl:600,rUl:400};
function pnFrac(p){let d=0,u=0;for(const c of p){if(c==='D')d+=14;else if(c==='U')u+=14;else{d+=10;u+=2;}}return {dl:d/(p.length*14),ul:u/(p.length*14)};}
function pnNrb(b,bw){const B=PNB[b];return (typeof NRB!=='undefined'&&NRB[B.scs]&&NRB[B.scs][bw])||Math.floor(bw*1000/(12*B.scs)*0.95);}
function pnSegHit(x0,y0,x1,y1,r){let t0=0,t1=1;const dx=x1-x0,dy=y1-y0,p=[-dx,dx,-dy,dy],q=[x0-r.x,r.x+r.w-x0,y0-r.y,r.y+r.h-y0];
  for(let i=0;i<4;i++){if(p[i]===0){if(q[i]<0)return false;}else{const t=q[i]/p[i];if(p[i]<0){if(t>t1)return false;if(t>t0)t0=t;}else{if(t<t0)return false;if(t<t1)t1=t;}}}return true;}
function pnPLinf(d,f,sub,x0,y0,x1,y1){d=Math.max(1,Math.hypot(d,6));const los=31.84+21.5*Math.log10(d)+19*Math.log10(f);let ex=0,nl=false;
  for(const o of PNOB)if(pnSegHit(x0,y0,x1,y1,o)){nl=true;ex+=PNOBL[o.t];}
  if(!nl)return los;const c=PNIF[sub];return Math.max(los,c[0]+c[1]*Math.log10(d)+c[2]*Math.log10(f))+ex*(f>10?1.8:1);}
function pnRf(){const P=PNP.rf,B=PNB[P.band],nrb=pnNrb(P.band,P.bw),N0=-174+10*Math.log10(B.scs*1e3)+7,pre=P.pw+6-10*Math.log10(nrb*12)+5,ld=P.ld/100;
  const gx=60,gy=40,cs=P.sc.slice(0,P.n),R=new Float32Array(gx*gy),Q=new Float32Array(gx*gy),U=new Float32Array(gx*gy),srv=new Int8Array(gx*gy);
  const per=cs.map(()=>({a:0,se:0,su:0}));let ok=0,sumSe=0;
  for(let j=0;j<gy;j++)for(let i=0;i<gx;i++){const x=i*2+1,y=j*2+1;let best=-999,bi=0,tot=0;const rs=[];
    for(let c=0;c<cs.length;c++){const pl=pnPLinf(Math.hypot(x-cs[c][0],y-cs[c][1]),B.f,P.sub,cs[c][0],cs[c][1],x,y),r=pre-pl;rs.push(r);tot+=nLin(r);if(r>best){best=r;bi=c;}}
    const I=(tot-nLin(best))*ld,sinr=nDb(nLin(best)/(I+nLin(N0))),k=j*gx+i;R[k]=best;Q[k]=sinr;srv[k]=bi;
    const plb=pre-best,su=nDb(nLin(23-10*Math.log10(Math.min(nrb,50)*12)+5-plb)/(nLin(N0-3.5)*(1+ld*2)));U[k]=su;
    const se=sinr<-6?0:Math.min(7.4,0.75*Math.log2(1+nLin(Math.min(sinr,30)))),seu=su<-6?0:Math.min(5.5,0.7*Math.log2(1+nLin(Math.min(su,25))));
    per[bi].a++;per[bi].se+=se;per[bi].su+=seu;if(best>=P.thr&&sinr>=P.st)ok++;sumSe+=se;}
  const fr=pnFrac(P.tdd),oh=0.18,lay=B.f>10?2:4;
  const cap=per.map(p=>({dl:p.a?p.se/p.a*P.bw*(1-oh)*fr.dl*lay*0.6:0,ul:p.a?p.su/p.a*P.bw*0.86*fr.ul*(lay>2?2:1)*0.7:0,a:p.a*4}));
  const dl=cap.reduce((s,c)=>s+c.dl,0),ul=cap.reduce((s,c)=>s+c.ul,0),cov=ok/(gx*gy)*100;
  return {R,Q,U,srv,gx,gy,cov,dl,ul,cap,nrb,avgSe:sumSe/(gx*gy),fr};}
function pnHeat(v,lo,hi){const t=nC((v-lo)/(hi-lo),0,1);return `hsl(${Math.round(t*215)} 80% ${42+t*10}%)`;}
function pnRfDraw(){const cv=document.getElementById('pnRfCv');if(!cv)return;const P=PNP.rf,r=PNS.rfR||(PNS.rfR=pnRf());
  const W=600,H=400,dpr=Math.min(2,window.devicePixelRatio||1);if(cv.width!==W*dpr){cv.width=W*dpr;cv.height=H*dpr;}const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);
  const sx=W/120,sy=H/80,lay=P.lay;
  for(let j=0;j<r.gy;j++)for(let i=0;i<r.gx;i++){const k=j*r.gx+i,v=lay==='rsrp'?r.R[k]:lay==='sinr'?r.Q[k]:r.U[k];
    const bad=r.R[k]<P.thr||r.Q[k]<P.st;g.fillStyle=bad?'#5A1020':lay==='rsrp'?pnHeat(v,-115,-55):pnHeat(v,-5,30);g.fillRect(i*2*sx,j*2*sy,2*sx+0.6,2*sy+0.6);}
  for(const o of PNOB){g.fillStyle=o.t==='wall'?'#9AA6B8':o.t==='rack'?'#C7CDD6':'#6E7B8F';g.globalAlpha=.9;g.fillRect(o.x*sx,o.y*sy,o.w*sx,o.h*sy);g.globalAlpha=1;}
  g.font='600 12px system-ui,sans-serif';
  P.sc.slice(0,P.n).forEach((c,i)=>{g.beginPath();g.arc(c[0]*sx,c[1]*sy,9,0,7);g.fillStyle='#0B2545';g.fill();g.lineWidth=2.5;g.strokeStyle=PNS.drag===i?'#FFB547':'#FFFFFF';g.stroke();g.fillStyle='#FFFFFF';g.textAlign='center';g.fillText(String(i+1),c[0]*sx,c[1]*sy+4);});
  g.textAlign='left';g.fillStyle='rgba(0,0,0,.55)';g.fillRect(4,H-22,250,18);g.fillStyle='#fff';g.font='500 11px system-ui,sans-serif';g.fillText('120 m × 80 m · ô đỏ thẫm = vùng lõm dưới ngưỡng',8,H-9);}
function pnRfOut(){const P=PNP.rf,r=PNS.rfR||(PNS.rfR=pnRf()),need=Math.max(Math.ceil(P.rDl/Math.max(1,r.dl/P.n)),Math.ceil(P.rUl/Math.max(1,r.ul/P.n)));
  const covN=r.cov<95?P.n+Math.ceil((95-r.cov)/12):P.n,nn=Math.max(need,covN),rec=[];
  if(r.cov<95)rec.push('Diện tích đạt ngưỡng dưới 95 %: kéo small cell tới gần vùng lõm (sau máy kim loại, giữa các dãy kệ) hoặc thêm cell.');
  if(r.ul<P.rUl)rec.push(`UL tổng ${pnMb(r.ul)} thấp hơn yêu cầu ${pnMb(P.rUl)}: dùng khung UL nhiều (DSUUU), thêm cell hoặc băng thông.`);
  if(r.dl<P.rDl)rec.push(`DL tổng ${pnMb(r.dl)} thấp hơn yêu cầu ${pnMb(P.rDl)}.`);
  if(P.ld>70&&P.n>4)rec.push('Tải cao và cell dày: nhiễu giữa các small cell cùng tần số làm SINR giảm; cân nhắc tách sóng mang hoặc phối hợp nhiễu.');
  if(!rec.length)rec.push('Cấu hình đạt cả phủ sóng và dung lượng.');
  pnSet('pnRfOut',pnKv('Diện tích đạt RSRP ≥ '+P.thr+' dBm và SINR ≥ '+P.st+' dB',`<b class="${r.cov>=95?'lbgood':'lbbad'}">${nF(r.cov,1)} %</b>`)+pnKv('Hiệu suất phổ DL trung bình',nF(r.avgSe,2)+' bit/s/Hz')
   +pnKv('Dung lượng DL / UL tổng (khung '+P.tdd+')',pnMb(r.dl)+' / '+pnMb(r.ul))+pnKv('Số PRB',r.nrb+' PRB · SCS '+PNB[P.band].scs+' kHz')+pnKv('Số cell cần (phủ + dung lượng)',`<b>${nn}</b> (đang đặt ${P.n})`)+pnKv('Khuyến nghị','<ul class="u3ul">'+rec.map(x=>`<li>${nE(x)}</li>`).join('')+'</ul>'));
  pnSet('pnRfCells',nBars(r.cap.map((c,i)=>['Cell '+(i+1)+' · '+nF(c.a,0)+' m²',c.dl,'var(--up)']),Math.max(1,...r.cap.map(c=>c.dl)),' Mbit/s DL',0));}
function pnCli(){const P=PNP.rf,a=P.tdd,b=P.pub,ex=s=>{let o='';for(const c of s)o+=c==='D'?'D'.repeat(14):c==='U'?'U'.repeat(14):'DDDDDDDDDDGGUU';return o;},A=ex(a),Bp=ex(b);
  let vic=0,agg=0,ulN=0,dlN=0;for(let i=0;i<A.length;i++){if(A[i]==='U'){ulN++;if(Bp[i]==='D'||!P.sync)vic+=P.sync?1:0.35;}if(A[i]==='D'){dlN++;if(Bp[i]==='U'||!P.sync)agg+=P.sync?1:0.35;}}
  const f=PNB[P.band].f,eirp=75-10*Math.log10(273*12),acir=Math.min(65,33+P.gd*0.8),pl=28+22*Math.log10(Math.max(P.dist,30))+20*Math.log10(f)+18,I=eirp-pl-acir+5,N0=-174+10*Math.log10(30e3)+5,iot=nDb(1+nLin(I-N0));
  const dIso=Math.pow(10,(eirp-acir+5-18-(N0-6)-28-20*Math.log10(f))/22);
  return {A,Bp,vic:ulN?vic/ulN*100:0,agg:dlN?agg/dlN*100:0,iot,dIso,acir};}
function pnCliSvg(c){let s='';const row=(str,y,lab)=>{s+=`<text x="0" y="${y+11}" class="sfsm">${lab}</text>`;for(let i=0;i<str.length;i++){const ch=str[i],x=96+i*8.2,col=ch==='D'?'var(--g-pdsch,#1F5D96)':ch==='U'?'var(--g-pusch,#8A5A2B)':'var(--line)';s+=`<rect x="${x}" y="${y}" width="7.4" height="16" style="fill:${col}"/>`;}};
  row(c.A,6,'Mạng riêng');row(c.Bp,30,'Nhà mạng');
  for(let i=0;i<c.A.length;i++){const x=96+i*8.2;if((c.A[i]==='U'&&c.Bp[i]==='D')||(c.A[i]==='D'&&c.Bp[i]==='U'))s+=`<rect x="${x}" y="50" width="7.4" height="6" style="fill:var(--warn)"/>`;}
  s+=`<text x="96" y="70" class="sfsm">Đỏ: ký hiệu xung đột (D của bên này trùng U của bên kia); mỗi ô = 1 ký hiệu, 5 khe × 14 ký hiệu, SCS 30 kHz</text>`;
  return `<svg viewBox="0 0 680 76" class="u3svg pnsvg" role="img" aria-label="So khung TDD hai mạng">${s}</svg>`;}
function pnCliOut(){const c=pnCli(),P=PNP.rf;pnSet('pnCliFig',pnCliSvg(c));
  pnSet('pnCliOut',pnKv('Ký hiệu UL của mạng riêng bị DL nhà mạng đè',`<b class="${c.vic>5?'lbbad':'lbgood'}">${nF(c.vic,1)} %</b>`)+pnKv('Ký hiệu DL mạng riêng gây nhiễu UL nhà mạng',nF(c.agg,1)+' %')
   +pnKv('ACIR ước tính (khoảng bảo vệ '+P.gd+' MHz)',nF(c.acir,0)+' dB')+pnKv('IoT trên các ký hiệu xung đột',`<b class="${c.iot>3?'lbbad':c.iot>1?'':'lbgood'}">${nF(c.iot,1)} dB</b>`)
   +pnKv('Khoảng cách cách ly cho IoT ≤ 1 dB',nF(c.dIso>=1000?c.dIso/1000:c.dIso,c.dIso>=1000?1:0)+(c.dIso>=1000?' km':' m'))
   +pnKv('Gợi ý',c.vic<1?'Khung khớp hoặc không xung đột.':'Dùng cùng khung với nhà mạng (đồng bộ), khung bán đồng bộ (chỉ lệch ở vài khe), tăng khoảng bảo vệ, hoặc che chắn toà nhà. Đồng bộ GNSS/PTP bắt buộc.'));}
PNR.rf={
 html(){const P=PNP.rf,B=PNB[P.band];
  return `<div class="panel"><h3>Băng tần thường dùng cho mạng riêng</h3><div class="scroll"><table class="ndtb"><thead><tr><th>Băng</th><th>SCS</th><th>Ghi chú cấp phép (ví dụ)</th></tr></thead><tbody>${Object.entries(PNB).map(([k,b])=>`<tr${k===P.band?' class="sfsel"':''}><td><b>${nE(b.n)}</b></td><td>${b.scs} kHz</td><td>${nE(b.lic)} <span class="kpC mid">Cần đối chiếu</span></td></tr>`).join('')}</tbody></table></div></div>
  <div class="panel"><h3>Bản đồ nhà xưởng: kéo thả small cell</h3>
   <div class="ctl">${pnSel('rf','band','Băng',Object.entries(PNB).map(([k,b])=>[k,b.n]))}${pnSel('rf','bw','Băng thông',B.bws.map(b=>[b,b+' MHz']))}${pnSl('rf','n','Số small cell',2,8,1,v=>v)}${pnSel('rf','sub','Kịch bản TR 38.901',Object.entries(PNIF).map(([k,v])=>[k,k+' · '+v[3]]))}
    ${pnSl('rf','pw','Công suất mỗi cổng',18,33,1,v=>v+' dBm')}${pnSl('rf','ld','Tải cell lân cận',0,100,5,v=>v+' %')}${pnSel('rf','lay','Lớp tô màu',[['sinr','SINR DL'],['rsrp','RSRP'],['ul','SINR UL']])}${pnSl('rf','thr','Ngưỡng RSRP',-115,-80,1,v=>v+' dBm')}${pnSl('rf','st','Ngưỡng SINR',-5,15,1,v=>v+' dB')}${pnSel('rf','tdd','Khung TDD mạng riêng',Object.entries(PNTD))}
    ${pnSl('rf','rDl','Yêu cầu DL tổng',50,4000,50,v=>pnMb(v))}${pnSl('rf','rUl','Yêu cầu UL tổng',20,3000,20,v=>pnMb(v))}</div>
   <div class="cols"><div><canvas id="pnRfCv" class="sfcv pncv" width="600" height="400" aria-label="Bản đồ phủ sóng nhà xưởng, kéo các chấm số để di chuyển small cell" role="img"></canvas>
    <p class="legend"><span><i style="background:${pnHeat(0,0,1)}"></i>kém</span><span><i style="background:${pnHeat(.5,0,1)}"></i>trung bình</span><span><i style="background:${pnHeat(1,0,1)}"></i>tốt</span><span><i style="background:#5A1020"></i>dưới ngưỡng</span><span><i style="background:#C7CDD6"></i>kệ</span><span><i style="background:#6E7B8F"></i>máy</span><span><i style="background:#9AA6B8"></i>tường</span></p>
    <div class="row"><button type="button" class="btn sm" data-pna="rf:reset">Vị trí mặc định</button><button type="button" class="btn sm" data-pna="rf:auto">Tự đặt lại (lưới đều)</button></div></div>
    <div><dl class="kv" id="pnRfOut"></dl><div id="pnRfCells"></div></div></div>
   <p class="note">Suy hao InF theo TR 38.901 §7.4.1 (LOS 31,84 + 21,5 log d + 19 log f; NLOS theo kịch bản), thêm suy hao vật cản khi đường thẳng cắt kệ, máy hoặc tường. Mô hình rút gọn để thấy xu hướng.</p></div>
  <div class="panel"><h3>Khung TDD và nhiễu với nhà mạng lân cận</h3>
   <div class="ctl">${pnSel('rf','pub','Khung của nhà mạng',[['DDDSU','DDDSU'],['DDSUU','DDSUU'],['DSUUU','DSUUU']])}${pnChk('rf','sync','Đồng bộ thời gian (GNSS/PTP)')}${pnSl('rf','dist','Khoảng cách tới trạm nhà mạng',30,3000,10,v=>v+' m')}${pnSl('rf','gd','Khoảng bảo vệ tần số',0,60,5,v=>v+' MHz')}</div>
   <div id="pnCliFig" class="pnfig"></div><dl class="kv" id="pnCliOut"></dl>
   <p class="note">DSUUU cho camera nhiều UL nhưng ngược khung với nhà mạng DDDSU. Phân tích nhiễu chéo, RIM và mất đồng bộ GNSS chi tiết ở <button type="button" class="u3lnkbtn" data-rxgo="rx:tdd">thẻ Tối ưu vô tuyến</button>.</p></div>`;},
 after(){PNS.rfR=pnRf();pnRfDraw();pnRfOut();pnCliOut();pnRfBind();},
 upd(k){if(['pub','sync','dist','gd'].includes(k)){pnCliOut();return;}if(k==='band'){const B=PNB[PNP.rf.band];if(!B.bws.includes(PNP.rf.bw))PNP.rf.bw=B.bws[B.bws.length-1];renderPn();return;}
  if(k==='tdd')pnCliOut();PNS.rfR=pnRf();pnRfDraw();pnRfOut();},
 act(a){const P=PNP.rf;if(a==='reset')P.sc=PNSCD.map(p=>p.slice());else if(a==='auto'){const n=P.n,c=Math.ceil(Math.sqrt(n*1.5)),r=Math.ceil(n/c);P.sc=PNSCD.map(p=>p.slice());for(let i=0;i<n;i++)P.sc[i]=[(i%c+0.5)*120/c,(Math.floor(i/c)+0.5)*80/r];}
  PNS.rfR=pnRf();pnRfDraw();pnRfOut();}
};
function pnRfBind(){const cv=document.getElementById('pnRfCv');if(!cv||cv._pn)return;cv._pn=1;
  const pt=e=>{const b=cv.getBoundingClientRect();return [nC((e.clientX-b.left)/b.width*120,1,119),nC((e.clientY-b.top)/b.height*80,1,79)];};
  cv.addEventListener('pointerdown',e=>{const [x,y]=pt(e),P=PNP.rf;let bi=-1,bd=7;P.sc.slice(0,P.n).forEach((c,i)=>{const d=Math.hypot(c[0]-x,c[1]-y);if(d<bd){bd=d;bi=i;}});if(bi<0)return;PNS.drag=bi;try{cv.setPointerCapture(e.pointerId);}catch(x){}e.preventDefault();pnRfDraw();});
  cv.addEventListener('pointermove',e=>{if(PNS.drag<0)return;const p=pt(e);PNP.rf.sc[PNS.drag]=p;if(!PNS.dirty){PNS.dirty=1;requestAnimationFrame(()=>{PNS.dirty=0;PNS.rfR=pnRf();pnRfDraw();});}e.preventDefault();});
  const up=()=>{if(PNS.drag<0)return;PNS.drag=-1;PNS.rfR=pnRf();pnRfDraw();pnRfOut();};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.style.touchAction='none';}

/* ---------- Mục 3: URLLC công nghiệp ---------- */
PNP.ur={dir:'ul',scs:30,ms:2,gr:'cg',mon:'sym',harq:1,mcs:'le',cqi3:1,dup:0,pre:1,ulc:1,upf:'loc',dx:'fdd',emb:50,fade:-5,bud:1,npk:5,per:2,sv:0,nUe:20,seed:1};
const PNN1={15:3,30:4.5,60:9,120:24},PNN2={15:5,30:5.5,60:11,120:36};
const PNUC=[['al','Căn khe, chờ cơ hội phát','#7B6CE0'],['sr','SR và cấp grant','#D9488F'],['em','Chờ eMBB (không preemption/UL cancel)','#C98A1E'],['tx','Truyền trên không','#2F7FE0'],['pr','Xử lý gNB/UE','#3AA6C9'],['hq','HARQ truyền lại','#E05A5A'],['tr','Truyền dẫn + UPF','#2BA37A']];
function pnPatArr(dx){if(dx==='fdd')return {D:new Array(14).fill(1),U:new Array(14).fill(1),P:14};const p=dx==='dsuuu'?'DSUUU':'DDDSU',D=[],U=[];
  for(const c of p){for(let i=0;i<14;i++){const t=c==='D'?'D':c==='U'?'U':(i<10?'D':i<12?'G':'U');D.push(t==='D'?1:0);U.push(t==='U'?1:0);}}return {D,U,P:p.length*14};}
function pnOppTab(arr,P,len,al){const n=3*P,o=new Int32Array(P);
  const ok=s=>{if(s%al)return false;if((s%14)+len>14)return false;for(let k=0;k<len;k++)if(!arr[(s+k)%P])return false;return true;};
  for(let i=0;i<P;i++){let s=i;while(s<i+n&&!ok(s))s++;o[i]=s-i;}return o;}
function pnUrCtx(){const P=PNP.ur,pa=pnPatArr(P.dx),ms=P.ms,symT=1/(14*P.scs/15),al=P.mon==='slot'?14:Math.min(ms,2);
  const p1=P.cqi3?1e-5:(P.mcs==='le'?1e-3:1e-1);
  return {P,pa,ms,symT,p1,p2:Math.max(1e-7,p1*0.05),N1:PNN1[P.scs],N2:PNN2[P.scs],
    txU:pnOppTab(pa.U,pa.P,ms,ms),txD:pnOppTab(pa.D,pa.P,ms,P.mon==='slot'?14:ms),pd:pnOppTab(pa.D,pa.P,1,al),pu:pnOppTab(pa.U,pa.P,1,1),sr:pnOppTab(pa.U,pa.P,1,Math.max(1,ms)),
    tr:{loc:[0.08,0.01],reg:[0.8,0.08],cen:[4,0.5]}[P.upf],pf:Math.pow(10,P.fade)};}
function pnW(tab,P,t){const i=Math.ceil(t-1e-9),b=Math.floor(i/P)*P;return i+tab[i-b];}
function pnUrOne(C,r,rec,a){const P=C.P,Pp=C.pa.P,c={al:0,sr:0,em:0,tx:0,pr:0,hq:0,tr:0};let t=a==null?r()*Pp:a;const t0=t;
  const ph=(s,e,k)=>{if(rec&&e>s)rec.push([s,e,k]);};const fade=r()<C.pf;
  if(P.dir==='ul'){
    if(P.gr==='sr'){let s=pnW(C.sr,Pp,t);c.al+=s-t;ph(t,s,'al');t=s+1;ph(s,t,'sr');c.sr+=1;s=pnW(C.pd,Pp,t+1);c.sr+=s+1-t;ph(t,s+1,'sr');t=s+1+C.N2;c.sr+=C.N2;ph(s+1,t,'sr');}
    if(r()<P.emb/100&&!P.ulc){const w=r()*14;c.em+=w;ph(t,t+w,'em');t+=w;}
    let s=pnW(C.txU,Pp,t);(P.gr==='sr'?c.sr+=s-t:c.al+=s-t);ph(t,s,P.gr==='sr'?'sr':'al');t=s+C.ms;c.tx+=C.ms;ph(s,t,'tx');t+=3;c.pr+=3;ph(t-3,t,'pr');
    let ok=!fade&&r()>=C.p1,k=0;while(!ok&&k<P.harq){k++;const t1=t;s=pnW(C.pd,Pp,t);t=s+1+C.N2;s=pnW(C.txU,Pp,t);t=s+C.ms+3;c.hq+=t-t1;ph(t1,t,'hq');ok=!fade&&r()>=C.p2;}
    let ms=(t-t0)*C.symT;const tr=C.tr[0]+Math.abs(nGs(r))*C.tr[1]+0.02;c.tr=tr/C.symT;return {lat:ok?ms+tr:Infinity,c,t0,t1:t};}
  const tr=C.tr[0]+Math.abs(nGs(r))*C.tr[1]+0.02;c.tr=tr/C.symT;t+=1;c.pr+=1;
  if(r()<P.emb/100&&!P.pre){const w=r()*14;c.em+=w;ph(t,t+w,'em');t+=w;}
  let s=pnW(C.txD,Pp,t);c.al+=s-t;ph(t,s,'al');t=s+C.ms;c.tx+=C.ms;ph(s,t,'tx');t+=C.N1;c.pr+=C.N1;ph(t-C.N1,t,'pr');
  let ok=!fade&&r()>=C.p1,k=0;while(!ok&&k<P.harq){k++;const t1=t;s=pnW(C.pu,Pp,t);t=s+1+3;s=pnW(C.txD,Pp,t);t=s+C.ms+C.N1;c.hq+=t-t1;ph(t1,t,'hq');ok=!fade&&r()>=C.p2;}
  return {lat:ok?(t-t0)*C.symT+tr:Infinity,c,t0,t1:t};}
function pnUrRun(){const C=pnUrCtx(),P=PNP.ur,N=Math.round(Math.pow(10,P.npk)),lat=new Float64Array(N),cs={al:0,sr:0,em:0,tx:0,pr:0,hq:0,tr:0},r=nRng(P.seed*7919+N),job=++PNS.job;let i=0;
  const pr=document.getElementById('pnUrProg'),t00=performance.now();
  const step=()=>{if(job!==PNS.job)return;const tEnd=performance.now()+28;
    while(i<N&&performance.now()<tEnd){for(let q=0;q<2000&&i<N;q++,i++){const a=pnUrOne(C,r),b=P.dup?pnUrOne(C,r,null,null):null;let o=a;if(b&&b.lat<a.lat)o=b;lat[i]=o.lat;for(const k in cs)cs[k]+=o.c[k];}}
    if(pr)pr.innerHTML=`<span class="pnbar"><i style="width:${i/N*100}%"></i></span> ${nF(i/N*100,0)} %`;
    if(i<N){setTimeout(step,0);return;}
    lat.sort();let lost=0;for(let k=N-1;k>=0&&!isFinite(lat[k]);k--)lost++;
    PNS.urR={lat,N,lost,cs,ms:performance.now()-t00,C};pnUrOut();};
  step();}
function pnUrOut(){const R=PNS.urR,P=PNP.ur;if(!R)return;const {lat,N,lost}=R,fin=N-lost,B=P.bud;
  let lo=0,hi=N;while(lo<hi){const m=(lo+hi)>>1;if(lat[m]<=B)lo=m+1;else hi=m;}const inB=lo/N,q=1-inB;
  const pp=p=>{const i=Math.ceil(p*N)-1;return i<fin?lat[Math.max(0,i)]:Infinity;};
  const tgt=0.99999,okR=inB>=tgt,m=P.sv>0?Math.floor(P.sv/P.per):0,pfs=Math.pow(q,m+1),mtbf=pfs>0?P.per/pfs/3.6e6:Infinity;
  pnSet('pnUrOut',pnKv('Số gói mô phỏng',nF(N,0)+' (mất '+nF(lost,0)+') · '+nF(R.ms/1000,2)+' s')+pnKv('Trễ trung vị / 99 % / 99,9 %',pnMs(pp(.5))+' / '+pnMs(pp(.99))+' / '+pnMs(pp(.999)))
   +pnKv('Trễ phân vị 99,999 %',`<b>${pnMs(pp(.99999))}</b>${N<1e6?' <span class="note">(cần ≥ 10⁶ gói để ổn định)</span>':''}`)
   +pnKv(`Độ tin cậy trong hạn ${nF(B,B<1?2:0)} ms`,`<b class="${okR?'lbgood':'lbbad'}">${inB>=0.999999?'≥ 99,9999':nF(inB*100,inB>0.9999?5:3)} %</b> ${pnOk(okR,okR?'đạt 99,999 %':'chưa đạt 99,999 %')}`)
   +pnKv('Survival time',P.sv>0?`${P.sv} ms = ${m} chu kỳ ${P.per} ms được phép lỡ liên tiếp; xác suất mất dịch vụ mỗi chu kỳ ≈ ${pfs<1e-12?'< 10⁻¹²':pfs.toExponential(1).replace('.',',')}; trung bình ${isFinite(mtbf)?(mtbf>1e5?'> 10⁵':nF(mtbf,mtbf<10?2:0))+' giờ':'∞'} giữa hai lần`:'0: mỗi gói lỡ hạn là lỗi ứng dụng'));
  const sum=Object.values(R.cs).reduce((a,b)=>a+b,0)||1,sT=R.C.symT;
  pnSet('pnUrStack',`<div class="pnstk">${PNUC.map(([k,n,c])=>{const v=R.cs[k]/N*sT;return v>0.0005?`<i style="width:${R.cs[k]/sum*100}%;background:${c}" title="${nE(n)}: ${pnMs(v)}"></i>`:'';}).join('')}</div><p class="legend">${PNUC.map(([k,n,c])=>`<span><i style="background:${c}"></i>${nE(n)}: ${pnMs(R.cs[k]/N*sT)}</span>`).join('')}</p>`);
  const xm=Math.max(B*3,Math.min(isFinite(pp(.99999))?pp(.99999)*1.3:B*4,B*20)),pts=[];for(let i=0;i<=120;i++){const x=xm*i/120;let a=0,b=N;while(a<b){const m2=(a+b)>>1;if(lat[m2]<=x)a=m2+1;else b=m2;}const cnt=N-a;if(cnt<=0){pts.push([x,-Math.log10(N)-0.2]);break;}pts.push([x,Math.log10(cnt/N)]);}
  const y0=-Math.ceil(Math.log10(N))-0.5;
  pnSet('pnUrCcdf',nPlot({w:640,h:220,x0:0,x1:xm,y0,y1:0,yt:[0,-1,-2,-3,-4,-5,-6].filter(v=>v>=y0),xt:[0,xm/4,xm/2,3*xm/4].map(v=>+v.toFixed(2)),xf:v=>nF(v,2),series:[{pts,c:'var(--up)',w:2.2}],hl:[[-5,'var(--warn)','10⁻⁵ (99,999 %)']],marks:[[B,'hạn '+nF(B,2)+' ms','var(--k1)']],ylab:'log₁₀ P(trễ > x)',xlab:'trễ một chiều (ms)',aria:'CCDF trễ'}));
  const C=R.C,frac=nC(P.nUe*(1/P.per)*C.ms*C.symT*0.15*(1+R.cs.hq/Math.max(1,R.cs.tx)),0,0.9),base=P.scs===120?2400:P.scs===60?1200:900,emb=base*(1-(P.pre?frac*1.5:frac));
  pnSet('pnUrEmb',nBars([['eMBB khi không có URLLC',base,'var(--muted)'],[P.pre?'eMBB khi URLLC chiếm chỗ (preemption)':'eMBB khi URLLC chờ khe',emb,'var(--up)']],base,' Mbit/s',0)+`<p class="note">URLLC dùng ≈ ${nF(frac*100,1)} % tài nguyên (${P.nUe} UE, chu kỳ ${P.per} ms). Preemption (DCI 2_1) đục lỗ PDSCH eMBB: eMBB mất thêm phần truyền lại CBG; không preemption thì gói URLLC DL phải chờ hết khe eMBB.</p>`);}
function pnUrAnim(){const C=pnUrCtx(),r=nRng(PNS.urSeed||(PNS.urSeed=3)),rec=[],o=pnUrOne(C,r,rec);PNS.urA={rec,o,C};}
function pnUrAnimSvg(){const A=PNS.urA;if(!A)return'';const {rec,o,C}=A,t0=Math.floor(o.t0/14)*14,span=Math.max(28,Math.ceil((o.t1-t0+2)/14)*14),W=680,sx=(W-20)/span;let s='';
  for(let i=0;i<span;i++){const k=(t0+i)%C.pa.P,ch=C.pa.D[k]?'D':C.pa.U[k]?'U':'G',col=C.P.dx==='fdd'?(C.P.dir==='ul'?'var(--g-pusch,#8A5A2B)':'var(--g-pdsch,#1F5D96)'):ch==='D'?'var(--g-pdsch,#1F5D96)':ch==='U'?'var(--g-pusch,#8A5A2B)':'var(--line)';
    s+=`<rect x="${10+i*sx}" y="8" width="${Math.max(1,sx-1)}" height="16" style="fill:${col};opacity:.8"/>`;if(i%14===0)s+=`<line x1="${10+i*sx}" y1="4" x2="${10+i*sx}" y2="64" style="stroke:var(--ink);stroke-width:1"/><text x="${12+i*sx}" y="62" class="sfsm">khe ${(t0+i)/14|0}</text>`;}
  const cm=Object.fromEntries(PNUC.map(x=>[x[0],x[2]]));rec.forEach(([a,b,k])=>{s+=`<rect x="${10+(a-t0)*sx}" y="30" width="${Math.max(1.5,(b-a)*sx)}" height="14" rx="2" style="fill:${cm[k]}"/>`;});
  s+=`<circle id="pnUrDot" cx="${10+(o.t0-t0)*sx}" cy="37" r="6" style="fill:var(--warn);stroke:var(--panel);stroke-width:2"/>`;
  PNS.urA.sx=sx;PNS.urA.base=t0;
  return `<svg viewBox="0 0 ${W} 68" class="u3svg pnsvg" role="img" aria-label="Một gói URLLC chạy qua các khe">${s}</svg><p class="hint">Gói ví dụ: ${isFinite(o.lat)?'trễ '+pnMs(o.lat)+' (gồm truyền dẫn)':'bị mất'}. Hàng trên: ${C.P.dx==='fdd'?'FDD, mọi ký hiệu dùng được':'khung TDD (xanh D, nâu U, xám G)'}; hàng dưới: các pha của gói.</p>`;}
PNR.urllc={
 html(){const P=PNP.ur;
  return `<div class="panel"><h3>Cấu hình URLLC</h3><div class="ctl">${pnSel('ur','dir','Hướng',[['ul','UL (cảm biến → PLC)'],['dl','DL (PLC → cơ cấu chấp hành)']])}${pnSel('ur','scs','SCS',[[15,'15 kHz'],[30,'30 kHz'],[60,'60 kHz'],[120,'120 kHz (FR2)']],'','scs')}${pnSel('ur','ms','Độ dài mini-slot',[[2,'2 ký hiệu'],[4,'4 ký hiệu'],[7,'7 ký hiệu'],[14,'14 ký hiệu (cả khe)']],'','ms')}
   ${pnSel('ur','gr','Cấp tài nguyên UL',[['cg','Configured grant (grant-free)'],['sr','SR → grant động']],'','cg')}${pnSel('ur','mon','PDCCH monitoring',[['sym','Mỗi 2 ký hiệu'],['slot','Mỗi khe']],'','mon')}${pnSl('ur','harq','Số lần HARQ truyền lại tối đa',0,3,1,v=>v)}
   ${pnSel('ur','mcs','Bảng MCS',[['le','qam64LowSE'],['n','qam256 (eMBB)']],'','mcs')}${pnSel('ur','dx','Song công',[['fdd','FDD'],['dddsu','TDD DDDSU'],['dsuuu','TDD DSUUU']])}${pnSel('ur','upf','Vị trí UPF',[['loc','Tại khuôn viên'],['reg','Vùng (≈ 100 km)'],['cen','Trung tâm (≈ 600 km)']],'','upf')}
   ${pnSl('ur','emb','Tải eMBB cùng cell',0,100,5,v=>v+' %')}${pnSl('ur','fade','Xác suất suy giảm sâu kéo dài',-7,-2,0.5,v=>'10^'+nF(v,1))}${pnSl('ur','bud','Hạn trễ',0.5,10,0.5,v=>nF(v,1)+' ms')}
   ${pnSl('ur','npk','Số gói Monte Carlo',4,6,0.5,v=>nF(Math.pow(10,v),0))}${pnSl('ur','per','Chu kỳ gói',0.5,20,0.5,v=>nF(v,1)+' ms')}${pnSl('ur','sv','Survival time',0,20,0.5,v=>nF(v,1)+' ms')}${pnSl('ur','nUe','Số UE URLLC trong cell',1,100,1,v=>v)}</div>
   <div class="row">${pnChk('ur','cqi3','Bảng CQI 3 (BLER mục tiêu 10⁻⁵)','cqi3')}${pnChk('ur','dup','PDCP duplication (2 chân độc lập)','dup')}${pnChk('ur','pre','Preemption DL (DCI 2_1)','pre')}${pnChk('ur','ulc','UL cancellation (DCI 2_4)','ulc')}</div>
   <div class="row"><button type="button" class="btn sm" data-pna="urllc:run">Chạy lại Monte Carlo</button><button type="button" class="btn sm" data-pna="urllc:seed">Đổi hạt giống</button><button type="button" class="btn sm" data-pna="urllc:best">Cấu hình URLLC mẫu</button><button type="button" class="btn sm" data-pna="urllc:embb">Cấu hình eMBB thường</button><span id="pnUrProg" class="note"></span></div></div>
  <div class="panel"><h3>Một gói chạy qua các khe</h3><div class="row" style="margin-top:0">${pnPlayBtn('urllc','pnUPlay')}<button type="button" class="btn sm" data-pna="urllc:next">Gói khác</button></div><div id="pnUrAnim"></div></div>
  <div class="cols"><div class="panel"><h3>Kết quả</h3><dl class="kv" id="pnUrOut"><dd>Đang chạy…</dd></dl></div>
   <div class="panel"><h3>Ngân sách trễ trung bình theo khối</h3><div id="pnUrStack"></div><h3 style="margin-top:12px">Ảnh hưởng tới eMBB cùng cell</h3><div id="pnUrEmb"></div></div></div>
  <div class="panel"><h3>Phân bố trễ (CCDF, trục dọc log)</h3><div id="pnUrCcdf" class="pnfig"></div><p class="note">Mô hình: BLER lần đầu ${P.cqi3?'10⁻⁵':P.mcs==='le'?'10⁻³':'10⁻¹'}, lần truyền lại nhỏ hơn 20 lần nhờ kết hợp mềm; thời gian xử lý N1/N2 theo năng lực UE 2 (FR1) hoặc 1 (FR2) của TS 38.214; suy giảm sâu làm hỏng mọi lần truyền của một chân. PDCP duplication lặp gói qua hai sóng mang độc lập (xem <button type="button" class="u3lnkbtn" data-ndgo="nd:dup">thẻ NSA EN-DC · PDCP duplication</button>). Chuyên đề lý thuyết: <button type="button" class="u3lnkbtn" data-bkgo="urllc">URLLC 1 ms, 99,999 %</button>.</p></div>`;},
 after(){pnUrAnim();pnSet('pnUrAnim',pnUrAnimSvg());pnUrRun();},
 upd(k){if(['npk','bud','sv','per','nUe'].includes(k)&&PNS.urR&&k!=='npk'){pnUrOut();return;}pnUrAnim();pnSet('pnUrAnim',pnUrAnimSvg());pnUrRun();},
 tick(dt){const A=PNS.urA;if(!A)return;if(!PNS.pause)PNS.ut+=dt*14*1.2;const span=A.o.t1-A.o.t0+6,t=PNS.ut%span,d=document.getElementById('pnUrDot');
  if(d)d.setAttribute('cx',10+(Math.min(A.o.t1,A.o.t0+t)-A.base)*A.sx);
  if(!PNS.pause&&PNS.ut>span*2){PNS.ut=0;PNS.urSeed=(PNS.urSeed||3)+1;pnUrAnim();pnSet('pnUrAnim',pnUrAnimSvg());}},
 act(a){const P=PNP.ur;if(a==='run')pnUrRun();else if(a==='seed'){P.seed++;pnUrRun();}else if(a==='play')pnPlayTog('pnUPlay');else if(a==='next'){PNS.urSeed=(PNS.urSeed||3)+1;PNS.ut=0;pnUrAnim();pnSet('pnUrAnim',pnUrAnimSvg());}
  else if(a==='best'){Object.assign(P,{scs:30,ms:2,gr:'cg',mon:'sym',harq:1,mcs:'le',cqi3:1,dup:1,pre:1,ulc:1,upf:'loc',dx:'fdd'});renderPn();}
  else if(a==='embb'){Object.assign(P,{scs:30,ms:14,gr:'sr',mon:'slot',harq:3,mcs:'n',cqi3:0,dup:0,pre:0,ulc:0,upf:'cen',dx:'dddsu'});renderPn();}}
};

/* ---------- Mục 4: TSN và 5G LAN ---------- */
PNP.tsn={lsz:64,hops:2,src:'gnss',dist:80,pdc:'ta',scs:30,cyc:2,nDev:24,tscai:1,dl:50,sz:64,seed:1,lsrc:0,cast:'uni',ldst:3,upfs:1,ehc:1};
function pnTe(){const P=PNP.tsn,mu=Math.log2(P.scs/15),prop=P.dist/0.2998,pdc=P.pdc==='none'?prop:P.pdc==='ta'?16*64*0.509/Math.pow(2,mu)/2:30;
  return [['GM → NW-TT qua '+P.hops+' cầu TSN (gPTP)',40+P.hops*45],['NW-TT/UPF đóng dấu thời gian',20],['Đồng bộ gNB với giờ 5G ('+(P.src==='gnss'?'GNSS tại chỗ':'PTP qua truyền dẫn')+')',P.src==='gnss'?100:160],
   ['SIB9 / ReferenceTimeInfo (độ chi tiết 10 ns)',10],['Trễ lan truyền Uu '+(P.pdc==='none'?'không bù ('+P.dist+' m)':P.pdc==='ta'?'bù theo TA (dư)':'bù theo RTT (Rel-17)'),pdc],['Xử lý trong UE và DS-TT',70],['DS-TT → thiết bị cuối',20]];}
function pnCyc(){const P=PNP.tsn,r=nRng(P.seed*131+P.nDev),cyc=P.cyc,dl=cyc*P.dl/100,nc=Math.max(200,Math.round(2000/Math.max(1,P.nDev/8))),cap=Math.max(1,Math.floor(273*2/Math.max(4,Math.ceil(P.sz*8/(2*12*2*0.6)))));
  const mini=2/(14*P.scs/15),L=[],per=new Int32Array(P.nDev),cons=new Int32Array(P.nDev);let late=0,tot=0,s1=0,s2=0,mxc=0;
  for(let c=0;c<nc;c++){const row=[];
    for(let d=0;d<P.nDev;d++){let l;
      if(P.tscai){const slot=Math.floor(d/cap);l=0.35+slot*mini+Math.abs(nGs(r))*0.015+(r()<1e-3?mini*4:0);}
      else{const q=Math.floor(r()*P.nDev/Math.max(1,cap/2));l=r()*0.5+0.25+q*mini+0.35+Math.abs(nGs(r))*0.05+(r()<0.01?0.5:0);}
      const lt=l>dl;if(lt){late++;cons[d]++;if(cons[d]>mxc)mxc=cons[d];}else cons[d]=0;tot++;s1+=l;s2+=l*l;row.push(l);}
    L.push(row);}
  const m=s1/tot;return {L,late:late/tot,jit:Math.sqrt(Math.max(0,s2/tot-m*m)),mean:m,dl,mxc,nc,cap};}
function pnCycSvg(){const R=PNS.tsR,P=PNP.tsn;if(!R)return'';const nC2=8,off=Math.floor(PNS.tt)%Math.max(1,R.nc-nC2),W=680,H=150,cw=(W-40)/nC2,nd=Math.min(P.nDev,24);let s='';
  for(let c=0;c<nC2;c++){const x=30+c*cw;s+=`<rect x="${x}" y="10" width="${cw-4}" height="${H-30}" rx="4" style="fill:var(--panel2);stroke:var(--line)"/><line x1="${x+(cw-4)*R.dl/P.cyc}" y1="10" x2="${x+(cw-4)*R.dl/P.cyc}" y2="${H-20}" style="stroke:var(--warn);stroke-dasharray:3 3"/><text x="${x+2}" y="${H-6}" class="sfsm">chu kỳ ${off+c+1}</text>`;
    const row=R.L[off+c];for(let d=0;d<nd;d++){const l=row[d],xx=x+Math.min(cw-6,(cw-4)*l/P.cyc),y=16+d*(H-40)/Math.max(1,nd-1);s+=`<circle cx="${xx}" cy="${y}" r="2.6" style="fill:${l>R.dl?'var(--warn)':'var(--k1)'}"/>`;}}
  s+=`<text x="2" y="20" class="sfsm">TB</text><text x="2" y="${H-24}" class="sfsm">${nd}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="u3svg pnsvg" role="img" aria-label="Gói PLC tới IO theo chu kỳ">${s}</svg>`;}
function pnTsnOut(){const te=pnTe(),tot=te.reduce((a,b)=>a+b[1],0),rms=Math.sqrt(te.reduce((a,b)=>a+b[1]*b[1],0));
  pnSet('pnTe',nBars(te.map(x=>[x[0],x[1],x[1]>150?'var(--warn)':'var(--up)']),Math.max(400,...te.map(x=>x[1])),' ns',0)+`<dl class="kv">${pnKv('Tổng xấu nhất (cộng thẳng)',`<b class="${tot<=1000?'lbgood':'lbbad'}">${nF(tot,0)} ns</b> so với ngân sách 1 µs ${pnOk(tot<=1000)}`)+pnKv('Tổng thống kê (căn bậc hai tổng bình phương)',nF(rms,0)+' ns')}</dl>`);
  const R=PNS.tsR=pnCyc(),P=PNP.tsn;
  pnSet('pnCycOut',pnKv('Hạn mỗi gói',nF(R.dl,2)+' ms ('+P.dl+' % chu kỳ '+P.cyc+' ms)')+pnKv('Trễ trung bình / jitter (độ lệch chuẩn)',pnMs(R.mean)+' / '+pnMs(R.jit))+pnKv('Gói lỡ hạn',`<b class="${R.late<1e-4?'lbgood':'lbbad'}">${R.late<1e-6?'< 10⁻⁶':nF(R.late*100,R.late<0.01?3:1)+' %'}</b>`)+pnKv('Số chu kỳ lỡ liên tiếp lớn nhất (một thiết bị)',R.mxc)+pnKv('Thiết bị mỗi mini-slot',R.cap));
  pnSet('pnCyc',pnCycSvg());}
const PNLU=['PLC','Robot 1','Robot 2','AGV','Camera','HMI'];
function pnLanPath(){const P=PNP.tsn,two=P.upfs===2,upf=i=>two&&i>=3?1:0,dst=P.cast==='uni'?[P.ldst]:P.cast==='multi'?[1,2,3].filter(x=>x!==P.lsrc):PNLU.map((_,i)=>i).filter(i=>i!==P.lsrc);
  return dst.map(d=>{const a=upf(P.lsrc),b=upf(d);return {d,via:a===b?[a]:[a,b]};});}
function pnLanPos(){return {ue:PNLU.map((_,i)=>[60+(i%3)*90+(i>=3?380:0),i%3===1?250:220]),gnb:[[150,150],[530,150]],upf:PNP.tsn.upfs===2?[[260,70],[420,70]]:[[340,70],[420,70]]};}
function pnLanSvg(){const P=PNP.tsn,Ps=pnLanPos(),two=P.upfs===2;let s='';
  s+=`<rect x="200" y="40" width="280" height="64" rx="10" style="fill:none;stroke:var(--line);stroke-dasharray:5 4"/><text x="204" y="34" class="sfsm">5G VN "line-1" (PDU session Ethernet)</text>`;
  s+=`<line x1="${Ps.upf[0][0]}" y1="70" x2="${Ps.upf[1][0]}" y2="70" style="stroke:${two?'var(--up)':'var(--line)'};stroke-width:2;${two?'':'stroke-dasharray:3 4'}"/><text x="340" y="64" class="sfsm" text-anchor="middle">${two?'N19':''}</text>`;
  Ps.gnb.forEach((g,i)=>{s+=`<line x1="${g[0]}" y1="${g[1]}" x2="${Ps.upf[two?i:0][0]}" y2="70" style="stroke:var(--up);stroke-width:1.6"/>`;});
  PNLU.forEach((n,i)=>{const p=Ps.ue[i],g=Ps.gnb[i>=3?1:0];s+=`<line x1="${p[0]}" y1="${p[1]}" x2="${g[0]}" y2="${g[1]}" style="stroke:var(--line);stroke-width:1.2"/>`;});
  Ps.gnb.forEach((g,i)=>{s+=`<rect x="${g[0]-34}" y="${g[1]-14}" width="68" height="28" rx="6" style="fill:var(--panel);stroke:var(--nr)"/><text x="${g[0]}" y="${g[1]+4}" class="sftx" text-anchor="middle">gNB ${i+1}</text>`;});
  Ps.upf.forEach((u,i)=>{if(!two&&i)return;s+=`<rect x="${u[0]-36}" y="56" width="72" height="28" rx="6" style="fill:var(--panel);stroke:var(--up);stroke-width:2"/><text x="${u[0]}" y="74" class="sftx" text-anchor="middle">UPF ${two?i+1:''}</text>`;});
  const ds=pnLanPath().map(x=>x.d);
  PNLU.forEach((n,i)=>{const p=Ps.ue[i],src=i===P.lsrc,dst=ds.includes(i);s+=`<g data-pna="tsn:ue|${i}" role="button" tabindex="0" class="pnnd"><rect x="${p[0]-36}" y="${p[1]-13}" width="72" height="26" rx="6" style="fill:var(--panel);stroke:${src?'var(--warn)':dst?'var(--k1)':'var(--muted)'};stroke-width:${src||dst?2.6:1.2}"/><text x="${p[0]}" y="${p[1]+4}" class="sftx" text-anchor="middle">${nE(n)}</text></g>`;});
  s+=`<g id="pnLanDots"></g>`;
  return `<svg viewBox="0 0 700 280" class="u3svg pnsvg" role="img" aria-label="5G LAN: khung Ethernet giữa các UE">${s}</svg>`;}
function pnLanDots(f){const g=document.getElementById('pnLanDots');if(!g)return;const P=PNP.tsn,Ps=pnLanPos(),two=P.upfs===2;let s='';
  pnLanPath().forEach(x=>{const pts=[Ps.ue[P.lsrc],Ps.gnb[P.lsrc>=3?1:0],Ps.upf[two?x.via[0]:0].map((v,i)=>i?70:v)];if(x.via.length>1)pts.push([Ps.upf[x.via[1]][0],70]);pts.push(Ps.gnb[x.d>=3?1:0],Ps.ue[x.d]);
    let L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const d=f*L[L.length-1];let i=1;while(i<L.length-1&&L[i]<d)i++;const t=(d-L[i-1])/Math.max(1e-6,L[i]-L[i-1]);
    s+=`<rect x="${pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t-7}" y="${pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t-5}" width="14" height="10" rx="2" style="fill:var(--warn)"/>`;});g.innerHTML=s;}
function pnLanOut(){const P=PNP.tsn,ps=pnLanPath(),hdr=P.ehc?3:18,air=P.lsz+hdr+7,lat=x=>0.5+0.05+(x.via.length>1?0.15:0)+0.5;
  pnSet('pnLanOut',pnKv('Kiểu',{uni:'Unicast: UPF học địa chỉ MAC và chuyển tới đúng phiên',multi:'Multicast: UPF nhân bản tới các thành viên nhóm (ở đây Robot 1, Robot 2, AGV)',broad:'Broadcast: UPF nhân bản tới mọi UE của 5G VN'}[P.cast])
   +pnKv('Số bản sao xuống DL',ps.length)+pnKv('Đường đi',ps.map(x=>`${PNLU[P.lsrc]} → UPF${x.via.length>1?' '+(x.via[0]+1)+' → N19 → UPF '+(x.via[1]+1):''} → ${PNLU[x.d]}`).map(nE).join('<br>'))
   +pnKv('Trễ ước tính (UL + UPF + DL)',ps.map(x=>pnMs(lat(x))).join(', ')+' (UPF tại chỗ, chuyển cục bộ, không ra N6)')
   +pnKv('Byte trên giao diện vô tuyến mỗi khung',`${air} B (tải ${P.lsz} B + Ethernet ${hdr} B${P.ehc?' sau nén EHC':''} + PDCP/RLC/MAC 7 B) · tiết kiệm ${P.ehc?nF((1-air/(P.lsz+25))*100,0):0} %`));}
PNR.tsn={
 html(){const P=PNP.tsn;
  return `<div class="panel"><h3>5GS như một cầu TSN</h3><div class="cols"><div><svg viewBox="0 0 700 150" class="u3svg pnsvg" role="img" aria-label="Cầu TSN logic 5GS">
   <rect x="150" y="30" width="400" height="80" rx="12" style="fill:none;stroke:var(--up);stroke-dasharray:6 5"/><text x="160" y="24" class="sfsm">Cầu TSN logic = 5GS</text>
   ${[['Thiết bị IO',50,70],['DS-TT + UE',210,70],['gNB',320,70],['UPF + NW-TT',440,70],['Mạng TSN / PLC',620,70],['TSN AF',440,130]].map(([t,x,y])=>`<rect x="${x-52}" y="${y-14}" width="104" height="28" rx="6" style="fill:var(--panel);stroke:var(--nr)"/><text x="${x}" y="${y+4}" class="sftx" text-anchor="middle">${t}</text>`).join('')}
   <line x1="102" y1="70" x2="158" y2="70" style="stroke:var(--ink)"/><line x1="262" y1="70" x2="268" y2="70" style="stroke:var(--ink)"/><line x1="372" y1="70" x2="388" y2="70" style="stroke:var(--ink)"/><line x1="492" y1="70" x2="568" y2="70" style="stroke:var(--ink)"/><line x1="440" y1="84" x2="440" y2="116" style="stroke:var(--cp);stroke-dasharray:4 3"/></svg></div>
   <div><dl class="kv">${pnKv('DS-TT / NW-TT','Bộ chuyển đổi TSN ở phía UE và phía UPF: cổng Ethernet của cầu, đóng dấu thời gian vào/ra để tính thời gian lưu trú trong 5GS, xử lý gPTP.')+pnKv('TSN AF','Nối với CNC của mạng TSN (IEEE 802.1Qcc): báo khả năng cầu (trễ, cổng), nhận lịch luồng, chuyển thành QoS và TSC Assistance Information.')+pnKv('TSCTSF (Rel-17)','Cung cấp dịch vụ đồng bộ thời gian và TSC cho ứng dụng không qua TSN AF (AF bên ngoài qua NEF).')+pnKv('TSCAI','Chu kỳ luồng, thời điểm đến của burst, kích thước burst, hướng, survival time. gNB dùng để đặt configured grant/SPS đúng lúc gói đến.')}</dl></div></div></div>
  <div class="panel"><h3>gPTP qua 5G: ngân sách sai số thời gian</h3><div class="ctl">${pnSl('tsn','hops','Số cầu TSN trước NW-TT',0,6,1,v=>v)}${pnSel('tsn','src','Nguồn giờ 5G cho gNB',[['gnss','GNSS tại trạm'],['ptp','PTP qua truyền dẫn']],'','gptp')}${pnSl('tsn','dist','Khoảng cách UE – gNB',5,600,5,v=>v+' m')}${pnSel('tsn','pdc','Bù trễ lan truyền',[['none','Không bù'],['ta','Theo TA'],['rtt','Theo RTT (Rel-17)']],'','pdc')}${pnSel('tsn','scs','SCS',[[15,'15 kHz'],[30,'30 kHz'],[60,'60 kHz'],[120,'120 kHz']])}</div>
   <div id="pnTe"></div><p class="note">TS 22.104 yêu cầu sai số đồng bộ ≤ 1 µs giữa các thiết bị trong một miền thời gian; phần Uu thường được phân bổ vài trăm ns. Không bù lan truyền thì mỗi 100 m tốn ≈ 333 ns. Đồng bộ mức vô tuyến và mất GNSS: <button type="button" class="u3lnkbtn" data-rxgo="rx:tdd">thẻ Tối ưu vô tuyến</button>; PTP trên mạng truyền dẫn: <button type="button" class="u3lnkbtn" data-tab="tx">thẻ Truyền dẫn</button>.</p></div>
  <div class="panel"><h3>Chu kỳ PLC ↔ IO qua 5G</h3><div class="ctl">${pnSel('tsn','cyc','Chu kỳ',[[1,'1 ms'],[2,'2 ms'],[4,'4 ms'],[10,'10 ms']])}${pnSl('tsn','nDev','Số thiết bị IO',1,96,1,v=>v)}${pnSl('tsn','dl','Hạn trễ (phần trăm chu kỳ)',20,100,5,v=>v+' %')}${pnSl('tsn','sz','Kích thước khung',32,1500,4,v=>v+' B')}</div>
   <div class="row">${pnChk('tsn','tscai','Lập lịch biết chu kỳ (TSCAI → configured grant theo burst)','tscai')}${pnPlayBtn('tsn','pnTPlay')}<button type="button" class="btn sm" data-pna="tsn:seed">Đổi hạt giống</button></div>
   <div class="scroll"><div id="pnCyc" class="pnfig pnw"></div></div><p class="legend"><span><i style="background:var(--k1)"></i>đúng hạn</span><span><i style="background:var(--warn)"></i>lỡ hạn</span><span>vạch đỏ: hạn trễ trong chu kỳ</span></p><dl class="kv" id="pnCycOut"></dl></div>
  <div class="panel"><h3>5G LAN-type service</h3><div class="ctl">${pnSel('tsn','lsrc','UE nguồn',PNLU.map((n,i)=>[i,n]))}${pnSel('tsn','cast','Kiểu gửi',[['uni','Unicast'],['multi','Multicast nhóm'],['broad','Broadcast']])}${pnSel('tsn','ldst','UE đích (unicast)',PNLU.map((n,i)=>[i,n]))}${pnSel('tsn','upfs','Số UPF',[[1,'1 UPF (chuyển cục bộ)'],[2,'2 UPF (nối N19)']],'','vn')}${pnSl('tsn','lsz','Kích thước tải',32,1500,4,v=>v+' B')}</div>
   <div class="row">${pnChk('tsn','ehc','Nén header Ethernet (EHC, Rel-16)','ehc')}</div><div class="scroll"><div class="pnw pnfig">${pnLanSvg()}</div></div><dl class="kv" id="pnLanOut"></dl>
   <p class="note">5G VN: nhóm UE dùng chung một DNN/S-NSSAI, mỗi UE có phiên PDU kiểu Ethernet (hoặc IP); SMF cấu hình UPF chuyển khung giữa các phiên cùng nhóm ngay tại UPF (chuyển cục bộ) hoặc qua đường hầm N19 giữa hai UPF, không cần ra N6. Bấm một UE để chọn làm nguồn.</p></div>`;},
 after(){pnTsnOut();pnLanOut();},
 upd(k){if(['lsrc','cast','ldst','upfs','ehc','lsz'].includes(k)){const w=document.querySelector('#pnBody .pnw svg[aria-label^="5G LAN"]');if(w)w.outerHTML=pnLanSvg();pnLanOut();return;}pnTsnOut();},
 tick(dt){if(!PNS.pause){PNS.tt+=dt*1.2;PNS.ft=(PNS.ft+dt*0.45)%1;}const R=PNS.tsR;if(R){const c=document.getElementById('pnCyc');if(c&&Math.floor(PNS.tt)!==PNS.tl){PNS.tl=Math.floor(PNS.tt);c.innerHTML=pnCycSvg();}}pnLanDots(PNS.ft);},
 act(a){const P=PNP.tsn,[k,v]=a.split('|');if(k==='play')pnPlayTog('pnTPlay');else if(k==='seed'){P.seed++;pnTsnOut();}else if(k==='ue'){P.lsrc=+v;if(P.ldst===P.lsrc)P.ldst=(P.lsrc+1)%PNLU.length;renderPn();}}
};

/* ---------- Mục 5: FWA và dịch vụ ngành ---------- */
const PNHP=typeof SFHP!=='undefined'?SFHP:[.16,.1,.07,.06,.07,.14,.3,.5,.64,.7,.72,.76,.8,.74,.72,.76,.82,.88,.96,1,.97,.88,.6,.32];
PNP.svc={cpe:'out',bw:100,nh:60,conc:20,com:100,fib:300,sc:'fac',m:'snpn',band:'n78',tdd:'DSUUU',upf:'loc',ur:1,tsn:1,lan:0,red:1,pos:1,ar:20000,dev:400,uld:4,dld:2};
const PNCPE={out:{n:'CPE ngoài trời (anten 12 dBi)',g:12,o2i:0,se:9,pk:1500,pu:28},in:{n:'CPE trong nhà (anten 5 dBi, xuyên tường)',g:5,o2i:18,se:5.5,pk:900,pu:23}};
function pnFwa(){const P=PNP.svc,C=PNCPE[P.cpe],cap=C.se*P.bw*0.74*0.85,f=3.7,N0=-174+10*Math.log10(30e3)+7,pre=76-10*Math.log10(273*12);
  const pld=pre+C.g-C.o2i-(N0-3)-8,plu=C.pu-10*Math.log10(50*12)+C.g+25-C.o2i-(N0-3.5+3)-8,pl=Math.min(pld,plu),rad=Math.pow(10,(pl-13.54-20*Math.log10(f))/39.08);
  const homes=Math.floor(cap/(P.com*P.conc/100)),hr=PNHP.map((h,i)=>{const act=Math.max(1,P.nh*P.conc/100*h);return Math.min(C.pk,cap/act);});
  return {cap,rad,homes,hr,min:Math.min(...hr),ul:plu<pld};}
const PNSC={
 fac:{n:'Nhà máy (AGV, camera AI, AR bảo trì)',r:{ul:800,dl:300,lat:10,rel:99.999,den:1,pos:1,av:99.999,loc:1},ar:30000,dev:600,def:{m:'snpn',band:'n78',tdd:'DSUUU',upf:'loc',ur:1,tsn:1,lan:1,red:1,pos:1}},
 port:{n:'Cảng (cẩu điều khiển từ xa)',r:{ul:1200,dl:200,lat:20,rel:99.99,den:0.05,pos:0.5,av:99.99,loc:1},ar:500000,dev:300,def:{m:'hyb',band:'n78',tdd:'DSUUU',upf:'loc',ur:1,tsn:0,lan:0,red:1,pos:1}},
 mine:{n:'Mỏ (xe tự hành, giám sát)',r:{ul:400,dl:150,lat:30,rel:99.99,den:0.02,pos:3,av:99.99,loc:1},ar:2000000,dev:200,def:{m:'snpn',band:'n40',tdd:'DSUUU',upf:'loc',ur:0,tsn:0,lan:0,red:1,pos:1}},
 hosp:{n:'Bệnh viện (thiết bị y tế, video)',r:{ul:300,dl:600,lat:20,rel:99.99,den:0.5,pos:2,av:99.999,loc:1},ar:60000,dev:1500,def:{m:'snpn',band:'n78',tdd:'DDDSU',upf:'loc',ur:0,tsn:0,lan:1,red:1,pos:1}},
 air:{n:'Sân bay (vận hành sân đỗ, hành lý)',r:{ul:500,dl:800,lat:30,rel:99.99,den:0.2,pos:3,av:99.99,loc:0},ar:1500000,dev:2000,def:{m:'hyb',band:'n78',tdd:'DDDSU',upf:'loc',ur:0,tsn:0,lan:0,red:1,pos:1}},
 uni:{n:'Khuôn viên đại học (eMBB, IoT, thí nghiệm)',r:{ul:300,dl:2000,lat:50,rel:99.9,den:0.3,pos:10,av:99.9,loc:0},ar:400000,dev:5000,def:{m:'pni',band:'n78',tdd:'DDDSU',upf:'reg',ur:0,tsn:0,lan:0,red:0,pos:0}}
};
const PNSCK=Object.keys(PNSC);
function pnSvcEval(){const P=PNP.svc,S=PNSC[P.sc],R=S.r,fr=pnFrac(P.tdd),bw=P.band==='n258'?200:100,inF=S.ar<100000;
  const cell=inF?1500:P.band==='n40'?250000:P.band==='n258'?8000:60000,ulc=fr.ul*bw*3.2*0.86*2*0.7,dlc=fr.dl*bw*6*0.82*4*0.6;
  const nCov=Math.ceil(S.ar/cell),nCap=Math.max(Math.ceil(R.ul/ulc),Math.ceil(R.dl/dlc)),n=Math.max(nCov,nCap);
  const upfL=P.m==='pni'&&P.upf==='loc'?'reg':P.upf,lat=(P.ur?0.8:4)+(P.tdd==='DDDSU'?1.6:0.6)+{loc:0.2,reg:3,cen:15}[upfL]+(P.m==='hyb'?0.2:0);
  const rel=P.ur?(P.red?99.9999:99.999):99.9,pos=P.pos?(inF?1:3):(inF?15:50),av=P.red?(P.m==='pni'?99.99:99.999):(P.m==='pni'?99.99:99.9),loc=P.m!=='pni'&&upfL==='loc';
  const ulA=n*ulc,dlA=n*dlc;
  return {n,nCov,nCap,ulc,dlc,rows:[['UL tổng',pnMb(R.ul),pnMb(ulA),ulA>=R.ul],['DL tổng',pnMb(R.dl),pnMb(dlA),dlA>=R.dl],['Trễ một chiều',R.lat+' ms','≈ '+nF(lat,1)+' ms',lat<=R.lat],['Độ tin cậy',nF(R.rel,R.rel>=99.999?3:2)+' %',nF(rel,4)+' %',rel>=R.rel],
   ['Mật độ thiết bị',nF(S.dev/S.ar*1000,1)+' / 1000 m² ('+nF(S.dev,0)+' thiết bị)','≈ '+nF(S.dev/n,0)+' thiết bị mỗi cell',S.dev/n<=400],['Định vị',(R.pos<1?'< ':'≤ ')+R.pos+' m',P.pos?'NR positioning ≈ '+pos+' m':'Cell-ID ≈ '+pos+' m',pos<=R.pos],
   ['Độ sẵn sàng',R.av+' %',nF(av,3)+' %',av>=R.av],['Dữ liệu ở lại khuôn viên',R.loc?'bắt buộc':'không bắt buộc',loc?'có':'không',!R.loc||loc],
   ['TSN cho điều khiển chuyển động',S===PNSC.fac?'cần':'không cần',P.tsn?'bật':'tắt',S!==PNSC.fac||!!P.tsn]]};}
function pnSvcOut(){const E=pnSvcEval(),P=PNP.svc;
  pnSet('pnSvcChk',`<div class="scroll"><table class="ndtb"><thead><tr><th>Yêu cầu</th><th>Mức cần</th><th>Cấu hình đạt</th><th></th></tr></thead><tbody>${E.rows.map(r=>`<tr><td>${r[0]}</td><td>${nE(r[1])}</td><td>${nE(r[2])}</td><td>${pnOk(r[3])}</td></tr>`).join('')}</tbody></table></div>
   <dl class="kv">${pnKv('Số small cell/trạm đề xuất',`<b>${E.n}</b> (phủ ${E.nCov}, dung lượng ${E.nCap})`)+pnKv('Dung lượng mỗi cell',pnMb(E.dlc)+' DL / '+pnMb(E.ulc)+' UL với '+P.tdd)+pnKv('Kết luận',E.rows.every(r=>r[3])?'<b class="lbgood">Đạt mọi yêu cầu</b>':'<b class="lbbad">Còn '+E.rows.filter(r=>!r[3]).length+' yêu cầu chưa đạt</b>: chỉnh cấu hình hoặc bấm «Cấu hình đề xuất»')}</dl>`);}
function pnFwaOut(){const F=pnFwa(),P=PNP.svc;
  pnSet('pnFwaOut',pnKv('Dung lượng DL mỗi sector',pnMb(F.cap))+pnKv('Bán kính phục vụ (giới hạn '+(F.ul?'UL':'DL')+')',nF(F.rad/1000,2)+' km')+pnKv('Số hộ mỗi sector ở tốc độ cam kết',`<b>${F.homes}</b> hộ (cam kết ${P.com} Mbit/s, ${P.conc} % hộ cùng tải giờ bận)`)
   +pnKv('Tốc độ hộ thấp nhất trong ngày',`<b class="${F.min>=P.com?'lbgood':'lbbad'}">${pnMb(F.min)}</b> với ${P.nh} hộ`)+pnKv('So với cáp quang',`Gói cáp quang ${P.fib} Mbit/s gần như không đổi theo giờ; FWA ${F.min>=P.fib?'theo kịp':'kém hơn'} lúc cao điểm.`));
  pnSet('pnFwaPlot',nPlot({w:640,h:200,x0:0,x1:23,y0:0,y1:Math.max(P.fib,...F.hr)*1.1,yt:[0,Math.round(Math.max(P.fib,...F.hr)/2),Math.round(Math.max(P.fib,...F.hr))],xt:[0,4,8,12,16,20],xf:v=>v+'h',series:[{pts:F.hr.map((v,i)=>[i,v]),c:'var(--up)',w:2.2},{pts:F.hr.map((v,i)=>[i,P.fib*0.95]),c:'var(--k1)',dash:'6 4'}],hl:[[P.com,'var(--warn)','cam kết']],ylab:'Mbit/s mỗi hộ',aria:'Tốc độ hộ FWA theo giờ'})+uLeg([['FWA',`var(--up)`],['Cáp quang','var(--k1)']]));}
function pnDimOut(){const P=PNP.svc,g=id=>{const e=document.getElementById(id);return e?Math.max(0,+e.value||0):0;},ar=g('pndA'),dv=g('pndD'),ul=g('pndU'),dl=g('pndL'),ses=g('pndS');
  const cell=ar<100000?1500:60000,fr=pnFrac(P.tdd),ulc=fr.ul*100*3.2*0.86*2*0.7,dlc=fr.dl*100*6*0.82*4*0.6,n=Math.max(1,Math.ceil(ar/cell),Math.ceil(dv*ul/ulc),Math.ceil(dv*dl/dlc)),upf=(dv*(ul+dl))*1.3/1000;
  const cost={snpn:n*1+30+n*0.15*5,hyb:n*1+12+n*0.25*5,pni:n*0.2+n*0.5*5,n3iwf:n*1+33+n*0.15*5};const mx=Math.max(...Object.values(cost));
  pnSet('pndOut',pnKv('Số small cell',`<b>${n}</b>`)+pnKv('Thông lượng UPF cần (dự phòng 30 %)',nF(upf,2)+' Gbit/s')+pnKv('Số phiên PDU',nF(dv*ses,0))+pnKv('Chi phí tương đối 5 năm (RAN + lõi + vận hành)',nBars(Object.entries(cost).map(([k,v])=>[PNM[k].s,v/mx*100,k===P.m?'var(--warn)':'var(--up)']),100,'',0)+'<span class="note">Chỉ số tương đối (100 = cao nhất), không phải giá thật.</span>'));}
PNR.svc={
 html(){const P=PNP.svc,S=PNSC[P.sc];
  return `<div class="panel"><h3>FWA: truy nhập vô tuyến cố định</h3><div class="ctl">${pnSel('svc','cpe','CPE',Object.entries(PNCPE).map(([k,v])=>[k,v.n]))}${pnSel('svc','bw','Băng thông n78',[[40,'40 MHz'],[60,'60 MHz'],[80,'80 MHz'],[100,'100 MHz']])}${pnSl('svc','nh','Số hộ mỗi sector',10,500,10,v=>v)}${pnSl('svc','conc','Hộ cùng tải giờ bận',5,60,1,v=>v+' %')}${pnSl('svc','com','Tốc độ cam kết',10,500,10,v=>v+' Mbit/s')}${pnSl('svc','fib','Gói cáp quang so sánh',100,2000,50,v=>v+' Mbit/s')}</div>
   <div class="cols"><div id="pnFwaPlot" class="pnfig"></div><dl class="kv" id="pnFwaOut"></dl></div><p class="note">Hệ số tải giờ theo hồ sơ lưu lượng dân cư. Dung lượng một trạm nhiều sóng mang: <button type="button" class="u3lnkbtn" data-sfgo="sf:cfg">thẻ Hiệu quả tần số tại một trạm</button>; lớp phủ băng thấp cho vùng xa: <button type="button" class="u3lnkbtn" data-lbgo="lb:cov">thẻ Đa lớp tần số</button>; FWA trong <button type="button" class="u3lnkbtn" data-bkgo="more">chuyên đề FWA, V2X, MBS, NTN</button>.</p></div>
  <div class="panel"><h3>Kịch bản ngành: yêu cầu → cấu hình → kiểm tra</h3><div class="seg u3seg sfsub" role="group" aria-label="Kịch bản ngành">${PNSCK.map(k=>`<button type="button" data-pna="svc:sc|${k}" aria-pressed="${k===P.sc}">${nE(PNSC[k].n.split(' (')[0])}</button>`).join('')}</div>
   <p class="e2d" style="margin-top:8px"><b>${nE(S.n)}</b> · diện tích ${nF(S.ar/1e4,1)} ha · ${nF(S.dev,0)} thiết bị.</p>
   <div class="ctl">${pnSel('svc','m','Mô hình',PNMK.map(k=>[k,PNM[k].s]))}${pnSel('svc','band','Băng',[['n78','n78 3,7 GHz'],['n40','n40 2,3 GHz'],['n258','n258 26 GHz']])}${pnSel('svc','tdd','Khung TDD',Object.entries(PNTD))}${pnSel('svc','upf','Vị trí UPF',[['loc','Tại chỗ'],['reg','Vùng'],['cen','Trung tâm']])}</div>
   <div class="row">${pnChk('svc','ur','URLLC (mini-slot, CG, 5QI 82–85)')}${pnChk('svc','tsn','TSN')}${pnChk('svc','lan','5G LAN')}${pnChk('svc','red','Dự phòng (lõi kép, PDCP duplication, hai đường truyền dẫn)')}${pnChk('svc','pos','Định vị NR (Rel-16/17)')}<button type="button" class="btn sm" data-pna="svc:def">Cấu hình đề xuất</button></div>
   <p class="note">Slice gợi ý: eMBB (S-NSSAI SST 1, 5QI 9) cho camera/AR, URLLC (SST 2, 5QI 82–85 có hạn trễ) cho điều khiển, mMTC (SST 3) cho cảm biến. Slicing chi tiết sẽ có ở đợt riêng.</p><div id="pnSvcChk"></div></div>
  <div class="panel"><h3>Máy tính dimension</h3><div class="ctl ndcalc">${[['pndA','Diện tích (m²)',S.ar],['pndD','Số thiết bị',S.dev],['pndU','UL mỗi thiết bị (Mbit/s)',+(S.r.ul/S.dev).toFixed(2)],['pndL','DL mỗi thiết bị (Mbit/s)',+(S.r.dl/S.dev).toFixed(2)],['pndS','Phiên PDU mỗi thiết bị',1]].map(r=>`<label class="c"><span class="cl">${r[1]}</span><input type="number" id="${r[0]}" value="${r[2]}" min="0" step="any"></label>`).join('')}</div><dl class="kv" id="pndOut" style="margin-top:8px"></dl></div>`;},
 after(){pnFwaOut();pnSvcOut();pnDimOut();},
 upd(k){if(['cpe','bw','nh','conc','com','fib'].includes(k))pnFwaOut();else{pnSvcOut();pnDimOut();}},
 act(a){const P=PNP.svc,[k,v]=a.split('|');if(k==='sc'){P.sc=v;Object.assign(P,PNSC[v].def);renderPn();}else if(k==='def'){Object.assign(P,PNSC[P.sc].def);renderPn();}}
};
document.addEventListener('input',e=>{const t=e.target;if(t.id&&/^pnd[A-Z]$/.test(t.id))pnDimOut();else if(t.id&&/^pnc[A-Z][a-z]?$/.test(t.id))pnCalc();else if(t.id==='pnvq'){PNP.vd.q=t.value;pnSet('pnParB',pnParRows());}});

/* ---------- Mục 6: tham số, KPI, lỗi ---------- */
const PNPAR=[
 ['nid','Nhận dạng','NID (Network Identifier) của SNPN, 44 bit','NPN NID (tra MML gNB/UNC)','nidList trong NRCELL (tra Nokia)','nid trong NRCellCU / SNPN config (tra Ericsson)','11 chữ số hex, kèm PLMN 999-xx'],
 ['cag','Nhận dạng','CAG ID list (PNI-NPN), 32 bit mỗi CAG','CAG ID cell (tra MML)','cagIdList (tra Nokia)','cagIdList (tra Ericsson)','1–12 CAG mỗi PLMN'],
 ['npnl','Nhận dạng','npn-IdentityInfoList-r16 trong SIB1','Cấu hình NPN của cell (tra)','npnIdentityInfoList (tra)','NpnIdentityInfo (tra)','≤ 12 mục'],
 ['crou','Nhận dạng','cellReservedForOtherUse (cell chỉ cho SNPN)','CellReservedForOtherUse (tra)','cellReservedForOtherUse (tra)','cellReservedForOtherUse (tra)','true cho cell chỉ SNPN'],
 ['hrnn','Nhận dạng','HRNN trong SIB10 (tên mạng đọc được)','HRNN (tra)','hrnn (tra)','humanReadableNetworkName (tra)','Chuỗi ≤ 48 ký tự'],
 ['sel','Chọn mạng','Chế độ chọn SNPN/CAG tự động hay thủ công (UE)','— (cấu hình UE)','— (cấu hình UE)','— (cấu hình UE)','Tự động'],
 ['cred','Xác thực','Phương thức xác thực theo SUPI: 5G-AKA, EAP-AKA′, EAP-TLS, EAP-TTLS, AAA bên ngoài','AuthType theo dải SUPI (UNC/UDM, tra)','authMethod (tra Nokia UDM)','authenticationMethod (tra Ericsson UDM)','5G-AKA cho USIM; EAP-TLS cho thiết bị IT'],
 ['onb','Xác thực','UE onboarding qua ON-SNPN (Rel-17), DCS, PVS','Onboarding (tra)','onboarding (tra)','onboarding (tra)','Chỉ khi thiết bị chưa có credential'],
 ['ursp','Phiên','URSP: luồng ứng dụng → S-NSSAI/DNN','URSP rule trên PCF (tra)','URSP policy (tra)','URSP (tra)','Mỗi ứng dụng một DNN/slice'],
 ['dnn','Phiên','DNN và S-NSSAI riêng cho mạng doanh nghiệp','DNN/S-NSSAI (tra)','dnn, sNssai (tra)','dnn, sNssai (tra)','dnn "factory", SST 1/2'],
 ['upf','Phiên','Vị trí UPF / chọn UPF theo DNN và TAI','UPF selection (UNC, tra)','UPF selection (tra)','UPF selection (tra)','UPF tại khuôn viên'],
 ['cg','URLLC','configuredGrantConfig (type 1/2, chu kỳ)','NRDUCELLUL CG (tra)','configuredGrant (tra)','configuredGrant (tra)','Type 1, chu kỳ = mini-slot'],
 ['ms','URLLC','Mini-slot: PDSCH/PUSCH mapping type B, 2/4/7 ký hiệu','Mapping type B (tra)','pdschMappingTypeB (tra)','mappingTypeB (tra)','2 ký hiệu'],
 ['mcs','URLLC','mcs-Table qam64LowSE','McsTable (tra)','mcsTable (tra)','mcsTable (tra)','qam64LowSE cho luồng URLLC'],
 ['cqi3','URLLC','cqi-Table table3 (BLER 10⁻⁵)','CqiTable (tra)','cqiTable (tra)','cqiTable (tra)','table3'],
 ['mon','URLLC','PDCCH monitoring trong khe (monitoringSymbolsWithinSlot)','PDCCH monitoring (tra)','searchSpace monitoring (tra)','searchSpace (tra)','Mỗi 2 ký hiệu'],
 ['scs','URLLC','Subcarrier spacing của BWP URLLC','SCS (tra)','scs (tra)','subCarrierSpacing (tra)','30 kHz FR1, 120 kHz FR2'],
 ['dup','URLLC','PDCP duplication (CA hoặc DC)','PDCP duplication (tra)','pdcpDuplication (tra)','pdcpDuplication (tra)','Bật cho DRB URLLC'],
 ['pre','URLLC','Preemption DL (DCI 2_1, INT-RNTI)','DL preemption (tra)','preemption (tra)','preemption (tra)','Bật khi có eMBB cùng cell'],
 ['ulc','URLLC','UL cancellation (DCI 2_4, CI-RNTI)','UL cancel (tra)','ulCancellation (tra)','ulCancellation (tra)','Rel-16, tuỳ UE hỗ trợ'],
 ['tscai','TSN','TSC Assistance Information (chu kỳ, thời điểm đến, survival time)','TSCAI (tra)','tscai (tra)','tscai (tra)','Từ TSN AF/TSCTSF'],
 ['gptp','TSN','gPTP domain, nguồn giờ 5G cho gNB (GNSS/PTP)','Clock source (tra MML)','syncSource (tra)','timeSyncSource (tra)','GNSS + PTP dự phòng'],
 ['pdc','TSN','Bù trễ lan truyền (propagationDelayCompensation, Rel-17)','PDC (tra)','pdc (tra)','propagationDelayCompensation (tra)','TA-based; RTT khi cần < 100 ns'],
 ['vn','5G LAN','5G VN group (DNN, S-NSSAI, thành viên GPSI), chuyển cục bộ/N19','5G LAN (UNC/UDG, tra)','5G LAN (tra)','5G LAN (tra)','Một nhóm mỗi dây chuyền'],
 ['ehc','5G LAN','Nén header Ethernet (EHC) trên PDCP','EHC (tra)','ehc (tra)','ethernetHeaderCompression (tra)','Bật cho PDU Ethernet']
].map(r=>r.concat(['v']));
const PNKPI=[
 ['Trễ E2E phân vị 99,999 %','Phân vị 99,999 % của trễ một chiều UE ↔ ứng dụng (đo bằng dấu thời gian hoặc TWAMP)','?Tra Huawei NR PM (URLLC latency)','?Tra Nokia (URLLC latency)','?Tra Ericsson (latency)','≤ 1 ms (điều khiển chuyển động) / ≤ 10 ms','urllc','pn_lat'],
 ['Gói đúng hạn','Gói tới trong hạn / gói gửi × 100','?Tra Huawei','?Tra Nokia','?Tra Ericsson','≥ 99,999 %','urllc','pn_rel'],
 ['Sai số thời gian TSN','Max |giờ DS-TT − giờ GM| trong cửa sổ đo','?Tra Huawei (clock)','?Tra Nokia (sync)','?Tra Ericsson (sync)','≤ 1 µs','tsn','pn_sync'],
 ['Tỉ lệ Registration Reject #76','Reject #76 / Registration Request × 100','?Tra Huawei UNC','?Tra Nokia AMF','?Tra Ericsson AMF','≤ 0,5 %','arch','pn_cag'],
 ['Tốc độ hộ FWA giờ bận','Lưu lượng DL CPE giờ bận / thời gian có dữ liệu','?Tra Huawei','?Tra Nokia','?Tra Ericsson','≥ tốc độ cam kết','svc','pn_fwa'],
 ['Diện tích đạt ngưỡng phủ','Ô đo RSRP ≥ ngưỡng và SINR ≥ ngưỡng / tổng ô × 100 (drive/walk test)','—','—','—','≥ 95–99 %','rf',''],
 ['Tỉ lệ đăng ký SNPN thành công','Registration Accept / Registration Request (SNPN) × 100','?Tra Huawei UNC','?Tra Nokia AMF','?Tra Ericsson AMF','≥ 99,5 %','arch','']
];
const PNFLT=[
 ['UE không vào được SNPN','UE không thấy mạng hoặc bị Reject #74/#75',['NID cấu hình trên UE khác NID phát trong SIB1','UE không bật chế độ truy nhập SNPN','Thiếu credential/thuê bao trong UDM của SNPN','cellReservedForOtherUse làm UE thường bỏ qua cell'],['So NID trong SIB1 (log UE) với cấu hình UE','Kiểm tra SUPI, phương thức xác thực trên UDM/AUSF','Log NAS: cause của Registration Reject'],{h:'Kiểm tra NPN NID cell và UNC',n:'Kiểm tra nidList',e:'Kiểm tra NID và UDM subscription'},'Tỉ lệ đăng ký SNPN','arch'],
 ['Registration Reject #76 (CAG)','UE bị từ chối ở cell CAG',['Allowed CAG list của thuê bao thiếu CAG cell','UE chọn thủ công cell CAG','CAG hết hạn hiệu lực (Rel-17)'],['UDM: Allowed CAG list','SIB1: cag-IdentityList','Log UE: danh sách Allowed CAG'],{h:'Kiểm tra CAG ID trên cell và UNC',n:'Kiểm tra cagIdList',e:'Kiểm tra cagIdList, AMF'},'pn_cag','arch'],
 ['Trễ đuôi cao','p99,999 vượt hạn dù trễ trung bình tốt',['Dùng SR → grant thay vì configured grant','PDCCH monitoring mỗi khe','HARQ nhiều lần do BLER cao (bảng MCS eMBB)','Khung TDD ít cơ hội UL'],['Phân bố trễ theo khối','Tỉ lệ HARQ retx','Cấu hình CG, mini-slot, mcs-Table'],{h:'Kiểm tra CG, MCS table',n:'Kiểm tra configuredGrant, mcsTable',e:'Kiểm tra configuredGrant, mcsTable'},'pn_lat','urllc'],
 ['Nhiễu TDD với nhà mạng lân cận','IoT UL cao ở các ký hiệu cố định',['Mạng riêng DSUUU cạnh nhà mạng DDDSU','Mất GNSS ở một bên','Khoảng bảo vệ tần số nhỏ'],['IoT theo ký hiệu','Trạng thái đồng bộ','Khoảng cách tới trạm nhà mạng'],{h:'Kiểm tra khung TDD, clock',n:'Kiểm tra tddConfig, sync',e:'Kiểm tra tddPattern, sync'},'Nhiễu UL (thẻ Tối ưu vô tuyến)','rf'],
 ['Mất gPTP / sai số thời gian lớn','Thiết bị TSN báo lệch giờ > 1 µs',['Không bù trễ lan truyền khi UE xa gNB','gNB mất GNSS, PTP dự phòng kém','Cầu TSN không hỗ trợ gPTP'],['Ngân sách sai số từng chặng','Trạng thái clock gNB','Cấu hình PDC'],{h:'Kiểm tra clock source',n:'Kiểm tra syncSource',e:'Kiểm tra timeSyncSource'},'pn_sync','tsn'],
 ['UPF đặt xa (hairpin về lõi trung tâm)','Trễ 15–40 ms, dữ liệu rời khuôn viên',['Chọn UPF theo DNN sai','Mô hình PNI-NPN không có UPF tại chỗ','URSP đẩy ứng dụng vào DNN Internet'],['Đường đi N3/N6, traceroute','Quy tắc chọn UPF','URSP trên UE'],{h:'Kiểm tra UPF selection',n:'Kiểm tra UPF selection',e:'Kiểm tra UPF selection'},'pn_lat','urllc'],
 ['FWA chậm giờ bận','Tốc độ hộ tụt dưới cam kết 19–22 h',['Quá nhiều hộ mỗi sector','CPE trong nhà suy hao xuyên tường lớn','Không đủ băng thông'],['Số hộ, hệ số đồng thời','RSRP/SINR của CPE','PRB giờ bận'],{h:'Kiểm tra PRB, số user',n:'Kiểm tra PRB, số user',e:'Kiểm tra PRB, số user'},'pn_fwa','svc'],
 ['Vùng lõm sau máy kim loại','AGV mất kết nối ở một vài lối đi',['Small cell đặt sau dãy kệ cao','Máy kim loại che khuất','Thiếu cell'],['Walk test, bản đồ RSRP','Vị trí lắp đặt','Mô phỏng InF'],{h:'Kiểm tra vị trí small cell',n:'Kiểm tra vị trí small cell',e:'Kiểm tra vị trí Radio Dot'},'Diện tích đạt ngưỡng phủ','rf']
];
PNP.vd={grp:'all',q:'',kf:'all'};
function pnParRows(){const P=PNP.vd,q=P.q.trim().toLowerCase(),v=nVn();const rows=PNPAR.filter(r=>(P.grp==='all'||r[1]===P.grp)&&(!q||r.join(' ').toLowerCase().includes(q)));
  const cols=v==='3gpp'?[3,4,5]:[{huawei:3,nokia:4,ericsson:5}[v]];
  return rows.map(r=>`<tr><td><span class="chip">${nE(r[1])}</span><br>${nE(r[2])}</td>${cols.map(c=>`<td class="u3tag">${nE(r[c])}</td>`).join('')}<td>${nE(r[6])}</td><td><span class="kpC mid">Cần đối chiếu</span></td></tr>`).join('')||'<tr><td colspan="6">Không có tham số khớp.</td></tr>';}
function pnParHead(){const v=nVn();return `<tr><th>Tham số (3GPP / ý nghĩa)</th>${v==='3gpp'?'<th>Huawei</th><th>Nokia</th><th>Ericsson</th>':`<th>${nVName(v)}</th>`}<th>Điển hình</th><th>Độ tin cậy tên</th></tr>`;}
function pnKpiRows(){const v=nVn(),f=PNP.vd.kf;return PNKPI.filter(k=>f==='all'||k[6]===f).map(k=>`<tr><td><b>${nE(k[0])}</b>${k[7]&&typeof KL!=='undefined'&&KL.find(x=>x.id===k[7])?`<br><button type="button" class="u3lnkbtn" data-pngo="kpi:${k[7]}">Mở ở thẻ KPI →</button>`:''}</td><td>${nE(k[1])}</td><td class="u3tag">${v==='3gpp'?['Huawei: '+k[2],'Nokia: '+k[3],'Ericsson: '+k[4]].map(nE).join('<br>'):nE(k[{huawei:2,nokia:3,ericsson:4}[v]])}<br><span class="kpC mid">cần đối chiếu</span></td><td>${nE(k[5])}</td><td><button type="button" class="btn sm" data-pngo="pn:${k[6]}">Mô phỏng →</button></td></tr>`).join('');}
function pnFltHtml(){const v=nVn();return PNFLT.map(f=>`<details class="u3flt ndflt pnflt"><summary><b>${nE(f[0])}</b></summary><p class="e2d">${nE(f[1])}</p><div class="u3two"><div><b>Nguyên nhân</b><ul class="u3ul">${f[2].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div><div><b>Kiểm tra</b><ul class="u3ul">${f[3].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div></div><p class="note">${v==='3gpp'?['Huawei: '+f[4].h,'Nokia: '+f[4].n,'Ericsson: '+f[4].e].map(nE).join(' · '):nVName(v)+': '+nE(f[4][v[0]])} (cần đối chiếu) · KPI: ${nE(f[5])} · <button type="button" class="u3lnkbtn" data-pngo="pn:${f[6]}">Mô phỏng →</button></p></details>`).join('');}
function pnCalc(){const g=id=>{const e=document.getElementById(id);return e?+e.value||0:0;},o=document.getElementById('pncOut');if(!o)return;
  const rq=g('pncRq'),rj=g('pncRj'),ac=g('pncAc'),tx=g('pncTx'),ot=g('pncOt'),te=g('pncTe'),fv=g('pncFv'),ft=g('pncFt');
  o.innerHTML=pnKv('Tỉ lệ Reject #76',rq?`<span class="${rj/rq*100>0.5?'lbbad':'lbgood'}">${nF(rj/rq*100,2)} %</span>`:'—')+pnKv('Tỉ lệ đăng ký SNPN thành công',rq?nF(ac/rq*100,2)+' %':'—')
   +pnKv('Gói đúng hạn',tx?`<span class="${ot/tx<0.99999?'lbbad':'lbgood'}">${nF(ot/tx*100,5)} %</span> (lỡ ${nF(tx-ot,0)} gói)`:'—')+pnKv('Sai số thời gian TSN',`<span class="${te>1000?'lbbad':'lbgood'}">${nF(te,0)} ns</span>`)
   +pnKv('Tốc độ hộ FWA giờ bận',ft?nF(fv*8/ft,1)+' Mbit/s':'—');}
PNR.vd={
 html(){const P=PNP.vd,grps=[...new Set(PNPAR.map(r=>r[1]))];
  return `<div class="panel"><h3>Tham số mạng riêng, URLLC, TSN</h3><p class="hint">Chọn vendor ở thanh trên để chỉ hiện cột của vendor đó. Mọi tên tham số vendor đều cần đối chiếu theo tài liệu release đang dùng.</p>
   <div class="ctl" style="margin-bottom:10px">${pnSel('vd','grp','Nhóm',[['all','Tất cả']].concat(grps.map(g=>[g,g])))}<label class="c"><span class="cl">Lọc</span><input type="search" id="pnvq" value="${nE(P.q)}" placeholder="Ví dụ: NID, CAG, gPTP"></label></div>
   <div class="scroll"><table class="ndtb"><thead>${pnParHead()}</thead><tbody id="pnParB">${pnParRows()}</tbody></table></div></div>
  <div class="panel"><h3>KPI theo dõi</h3><div class="ctl" style="margin-bottom:10px">${pnSel('vd','kf','Theo mục',[['all','Tất cả']].concat(PNV.filter(v=>v[0]!=='vd').map(v=>[v[0],v[1]])))}</div>
   <div class="scroll"><table class="ndtb"><thead><tr><th>KPI</th><th>Công thức</th><th>Bộ đếm</th><th>Mục tiêu</th><th></th></tr></thead><tbody id="pnKpB">${pnKpiRows()}</tbody></table></div>
   <div class="u3calc"><b>Tính nhanh từ bộ đếm</b><div class="ctl ndcalc" style="margin-top:8px">
    ${[['pncRq','Registration Request (SNPN/CAG)',12000],['pncRj','Registration Reject #76',40],['pncAc','Registration Accept',11900],['pncTx','Gói URLLC đã gửi',1000000],['pncOt','Gói tới trong hạn',999993],['pncTe','Sai số thời gian lớn nhất (ns)',620],['pncFv','Lưu lượng DL CPE giờ bận (MB)',27000],['pncFt','Thời gian có dữ liệu (s)',1800]].map(r=>`<label class="c"><span class="cl">${r[1]}</span><input type="number" id="${r[0]}" value="${r[2]}" step="any"></label>`).join('')}
   </div><dl class="kv" id="pncOut" style="margin-top:8px"></dl></div></div>
  <div class="panel"><h3>Lỗi thường gặp và cách kiểm tra</h3>${pnFltHtml()}</div>
  <div class="panel"><h3>Tiêu chuẩn tham chiếu</h3><ul class="u3ul"><li>TS 23.501 §5.30 (NPN: SNPN, PNI-NPN, CAG, onboarding), §5.27 (TSC, TSCAI, đồng bộ thời gian), §5.28 (5G LAN, 5G VN)</li><li>TS 23.502 §4.2.2 (đăng ký), §4.12 (truy nhập không tin cậy qua N3IWF)</li><li>TS 22.104 (yêu cầu dịch vụ cyber-physical: trễ, tin cậy, survival time, đồng bộ), TS 22.261 (yêu cầu 5G, mạng riêng)</li><li>TR 38.824 (URLLC Rel-16 lớp vật lý), TS 38.214 §5.3/§6.4 (thời gian xử lý N1/N2), TS 38.213 §11.2 (DCI 2_1), §11.2A (DCI 2_4)</li><li>TR 38.901 §7.4 (kịch bản InF), TS 38.331 (npn-IdentityInfoList, SIB9, SIB10)</li><li>TS 33.501 Annex I (xác thực SNPN, credentials holder bên ngoài), Annex B (EAP-TLS)</li><li>TS 24.501 (5GMM cause #74, #75, #76)</li></ul></div>`;},
 after(){pnCalc();},
 upd(k){if(k==='grp')pnSet('pnParB',pnParRows());if(k==='kf')pnSet('pnKpB',pnKpiRows());}
};

/* ---------- Khung thẻ ---------- */
const PNLK={arch:{e2:[['reg','sa']],kpi:['pn_cag']},rf:{e2:[['data','sa']],kpi:['prb5','sf_se']},urllc:{e2:[['data','sa']],kpi:['pn_lat','pn_rel']},tsn:{e2:[['data','sa']],kpi:['pn_sync','pn_rel']},svc:{e2:[['data','sa']],kpi:['pn_fwa','tputdl5']},vd:{e2:[['reg','sa'],['data','sa']],kpi:[]}};
const PNTB=[['rsh','Chia sẻ RAN (NPN, MOCN)'],['sc','Bảo mật và xác thực'],['nd','NSA EN-DC (PDCP duplication)'],['ro','Tối ưu vô tuyến (TDD, CLI)'],['sf','Hiệu quả tần số một trạm'],['lb','Đa lớp tần số'],['core','Mạng lõi'],['tx','Truyền dẫn'],['stack','Giao thức và fronthaul']];
function pnLinks(){const L=PNLK[PNS.v]||{e2:[],kpi:[]},hasE2=typeof E2S!=='undefined',hasK=typeof KL!=='undefined';
  const e2=hasE2?L.e2.map(([id,tk])=>{const s=E2S.find(x=>x.id===id);return s&&s.f&&s.f[tk]?[s,tk]:null;}).filter(Boolean):[];
  const kp=hasK?L.kpi.map(id=>KL.find(k=>k.id===id)).filter(Boolean):[],tabs=PNTB.filter(t=>typeof RENDER!=='undefined'&&RENDER[t[0]]);
  return `<div class="panel u3lk"><h3>Xem tiếp ở thẻ khác</h3>
  ${e2.length?`<p class="e2x"><b>Luồng ở thẻ Toàn trình E2E</b> (mở sẵn 5G SA):</p><div class="e2go">${e2.map(([s,tk])=>`<button type="button" class="btn sm" data-pngo="e2:${s.id}:${tk}">${nE(s.n)} · 5G SA →</button>`).join('')}</div>`:''}
  ${kp.length?`<p class="e2x" style="margin-top:10px"><b>KPI liên quan ở thẻ KPI mạng</b>:</p><div class="e2go">${kp.map(k=>`<button type="button" class="btn sm" data-pngo="kpi:${k.id}">${nE(k.nm)} →</button>`).join('')}</div>`:''}
  <p class="e2x" style="margin-top:10px"><b>Thẻ liên quan:</b></p><div class="e2go">${tabs.map(t=>`<button type="button" class="btn sm" data-tab="${t[0]}">${t[1]} →</button>`).join('')}<button type="button" class="btn sm" data-bkgo="npn">Chuyên đề Mạng riêng 5G →</button></div></div>`;}
function pnNav(){return `<div class="seg u3seg ndseg pnseg" role="group" aria-label="Mục của thẻ Mạng riêng 5G">${PNV.map((v,i)=>`<button type="button" data-pnv="${v[0]}" aria-pressed="${v[0]===PNS.v}"><span class="ndn">${i+1}</span>${v[1]}</button>`).join('')}</div>`;}
function pnPlayBtn(vw,id){return `<button type="button" class="btn sm" data-pna="${vw}:play" id="${id}">${PNS.pause?'▶ Chạy':'⏸ Dừng'}</button>`;}
function pnPlayTog(id){PNS.pause=!PNS.pause;const b=document.getElementById(id);if(b)b.textContent=PNS.pause?'▶ Chạy':'⏸ Dừng';}
function renderPn(){const nav=document.getElementById('pnNav'),body=document.getElementById('pnBody');if(!nav||!body)return;if(!PNR[PNS.v])PNS.v='arch';
  PNS.job++;nav.innerHTML=pnNav();const V=PNR[PNS.v];body.innerHTML=V.html()+pnLinks();if(V.after)V.after();
  if(S.tab==='pn'&&!nReduced()&&V.tick)pnStart();else{pnStop();if(V.tick&&S.tab==='pn')V.tick(0);}}
function pnStart(){if(PNS.raf)return;PNS.last=performance.now();PNS.raf=requestAnimationFrame(pnLoop);}
function pnStop(){if(PNS.raf)cancelAnimationFrame(PNS.raf);PNS.raf=0;}
function pnLoop(now){PNS.raf=0;if(S.tab!=='pn')return;
  if(document.hidden){PNS.last=now;PNS.raf=requestAnimationFrame(pnLoop);return;}
  const dt=Math.max(0,Math.min(0.1,(now-PNS.last)/1000));PNS.last=now;const V=PNR[PNS.v];if(V&&V.tick){try{V.tick(dt);}catch(e){console.error(e);}}else return;
  PNS.raf=requestAnimationFrame(pnLoop);}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-pngo]');
  if(g){const [t,id,tk]=g.dataset.pngo.split(':');try{tourStop();}catch(x){}try{stopSig();}catch(x){}
    const top=()=>window.scrollTo({top:Math.min(window.scrollY,$('main').offsetTop-$('.bar').offsetHeight)});
    if(t==='e2'){try{e2Stop();}catch(x){}S.e2Sc=id;S.e2R=tk||'sa';S.e2M=S.mode;if(typeof E2A!=='undefined'){E2A.key='';E2A.i=0;}S.tab='e2';renderAll();top();}
    else if(t==='kpi'){S.tab='kpi';KP.tech='all';KP.ly='all';KP.cat='all';KP.q='';KP.node='';KP.sel=id;kpSig='';renderAll();setTimeout(()=>{const d=$('#kpDet');if(d)d.scrollIntoView({block:'start',behavior:'smooth'});},60);}
    else if(t==='pn'){S.tab='pn';if(id&&PNR[id])PNS.v=id;renderAll();top();}
    return;}
  const t=e.target.closest('#t-pn [data-pnv],#t-pn [data-pna]');if(!t)return;
  if(t.dataset.pnv){if(t.dataset.pnv===PNS.v)return;PNS.v=t.dataset.pnv;pnStop();renderPn();return;}
  const [vw,...r]=t.dataset.pna.split(':');const V=PNR[vw];if(V&&V.act)V.act(r.join(':'),t);
});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest&&e.target.closest('#t-pn g[data-pna]')){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
const PNVW={arch:'arch',rf:'rf',ur:'urllc',tsn:'tsn',svc:'svc',vd:'vd'};
const PNLITE=['ur:bud','ur:sv','ur:per','ur:nUe','rf:thr','rf:st','rf:ld','rf:pw','rf:dist','rf:gd','tsn:hops','tsn:dist','svc:nh','svc:conc','svc:com','svc:fib'];
function pnInp(el,live){const [vw,k]=el.dataset.pni.split(':');const P=PNP[vw];if(!P)return;
  let v=el.type==='checkbox'?(el.checked?1:0):(el.tagName==='SELECT'&&isNaN(+el.value)?el.value:+el.value);P[k]=v;
  const o=el.parentElement.querySelector('output');if(o&&PNF[vw+':'+k])o.textContent=PNF[vw+':'+k](v);
  if(live&&!PNLITE.includes(vw+':'+k))return;
  document.querySelectorAll(`#t-pn [data-pni="${vw}:${k}"]`).forEach(x=>{if(x!==el){if(x.type==='checkbox')x.checked=!!v;else x.value=v;const oo=x.parentElement.querySelector('output');if(oo&&PNF[vw+':'+k])oo.textContent=PNF[vw+':'+k](v);}});
  const V=PNR[PNVW[vw]];if(V&&V.upd)V.upd(k,vw);}
document.addEventListener('input',e=>{const el=e.target;if(!el.dataset||!el.dataset.pni||el.type!=='range')return;pnInp(el,true);});
document.addEventListener('change',e=>{const el=e.target;if(!el.dataset||!el.dataset.pni)return;pnInp(el,false);});

/* ---------- Gắn thẻ vào ứng dụng ---------- */
RENDER.pn=renderPn;
(function(){if(typeof K!=='function'||typeof KL==='undefined')return;try{
  if(typeof KPB!=='undefined'&&!KPB.pn)KPB.pn={t:"Mạng riêng 5G: trễ, tin cậy, đồng bộ, truy nhập",
    st:["Xác định KPI vi phạm theo luồng ứng dụng (DNN/slice, 5QI) chứ không theo cell: trễ đuôi, gói đúng hạn, sai số thời gian.","Tách trễ theo khối: căn khe, SR/grant, HARQ, truyền dẫn, UPF; so với cấu hình CG, mini-slot, mcs-Table.","Kiểm tra vị trí UPF và đường N3/N6 (hairpin về lõi trung tâm).","Với lỗi truy nhập: log NAS (cause #74/#75/#76), NID/CAG trên SIB1 và trên UE, thuê bao UDM.","Với TSN: ngân sách sai số từng chặng, trạng thái GNSS/PTP, bù trễ lan truyền."],
    ca:["SR → grant thay vì configured grant","UPF đặt xa","Nhiễu TDD với nhà mạng lân cận","NID/CAG sai","Mất nguồn giờ GNSS"],
    pa:["configuredGrantConfig, mapping type B, mcs-Table, cqi-Table","PDCP duplication, preemption","NID, CAG ID list, cellReservedForOtherUse","TSCAI, propagationDelayCompensation"],cs:[],gen:1};
  const add=a=>{if(KL.some(k=>k.id===a[0]))return;K(...a);};
  add(["pn_lat","5G","ran","int","URLLC E2E Latency (99.999th percentile)","ue,du,upf","pn","g|ms|0|20|d|1|10|0.6",
   "Trễ p99,999 = phân vị 99,999 % của trễ một chiều từ ứng dụng UE tới ứng dụng sau UPF (hoặc ngược lại), đo trên mẫu ≥ 10⁶ gói.","TS 22.104 §5 (yêu cầu trễ), TS 28.552 (trễ DL/UL theo lớp). Chỉ số đo theo luồng.",
   "?Tra Huawei NR PM (URLLC latency)","?Tra Ericsson NR PM (latency)","?Tra Nokia 5G PM (latency)",
   "Điều khiển chuyển động và cơ cấu chấp hành cần trễ đuôi chứ không phải trễ trung bình: một gói trễ là một chu kỳ điều khiển hỏng.","≤ 1 ms (điều khiển chuyển động), ≤ 10 ms (AGV, giám sát).",
   "ue>du:PUSCH (configured grant, mini-slot)!A;du>cuup:F1-U;cuup>upf:N3 (UPF tại chỗ);upf>dn:N6 tới PLC!S"]);
  add(["pn_rel","5G","ran","int","Packets Delivered within Deadline (Survival)","ue,du,upf","pn","g|%|99|100|u|99.999|99.9|99.9995",
   "Gói đúng hạn % = gói tới đích trong hạn trễ / gói gửi × 100 (theo luồng TSC).","TS 22.104 (độ tin cậy dịch vụ, survival time). Chỉ số đo theo luồng.",
   "?Tra Huawei (đếm gói trễ hạn)","?Tra Ericsson","?Tra Nokia",
   "Cùng với survival time cho biết ứng dụng có bị dừng hay không: lỡ quá số chu kỳ cho phép là máy dừng an toàn.","≥ 99,999 % (công nghiệp), ≥ 99,9999 % cho chuyển động.",
   "ue>du:PUSCH lần 1!A;du>ue:HARQ NACK → truyền lại;du>cuup:PDCP (duplication);upf>dn:Tới hạn!S"]);
  add(["pn_sync","5G","ran","syn","5G TSN Time Synchronization Error","du,ue,upf","pn","g|ns|0|2000|d|500|1000|400",
   "Sai số thời gian = max |giờ tại DS-TT − giờ grandmaster TSN| trong cửa sổ đo.","TS 22.104 §5.6 (đồng bộ ≤ 1 µs), TS 23.501 §5.27.1, TS 38.331 (SIB9, ReferenceTimeInfo).",
   "?Tra Huawei (clock, PTP)","?Tra Ericsson (time sync)","?Tra Nokia (sync)",
   "Thiết bị cùng dây chuyền phải chung một giờ: lệch quá 1 µs làm chuyển động đồng bộ (robot, servo) sai pha.","≤ 1 µs đầu-cuối; phần Uu vài trăm ns.",
   "upf>du:gPTP qua NW-TT, giờ 5G;du>ue:SIB9 / ReferenceTimeInfo;ue>ue:DS-TT điều chỉnh giờ!S"]);
  add(["pn_cag","5G","core","acc","Registration Reject #76 Ratio (CAG)","ue,amf,udm","pn","g|%|0|10|d|0.5|2|0.2",
   "Tỉ lệ Reject #76 % = Registration Reject cause #76 / Registration Request trên cell CAG × 100.","TS 24.501 (5GMM cause #76), TS 23.501 §5.30.3 (CAG).",
   "?Tra Huawei UNC (registration reject by cause)","?Tra Ericsson AMF (reject cause)","?Tra Nokia AMF (reject cause)",
   "Tăng cao nghĩa là danh sách Allowed CAG trên UE/UDM lệch với CAG phát ở cell, hoặc UE ngoài nhóm cố vào cell CAG-only.","≤ 0,5 %.",
   "ue>cucp:RRCSetupComplete (Registration Request)!A;cucp>amf:Initial UE Message (CAG ID);amf>udm:Allowed CAG list;amf>ue:Registration Reject #76!S"]);
  add(["pn_fwa","5G","ran","utl","FWA Busy-hour Household Throughput","du,ue","pn","g|Mbit/s|0|500|u|100|30|120",
   "Tốc độ hộ = lưu lượng DL của CPE trong giờ bận / thời gian có dữ liệu (bỏ khe rỗi).","TS 28.552 (thông lượng UE), TS 28.554. Chỉ số tự tính theo CPE.",
   "?Tra Huawei (DL throughput theo UE)","?Tra Ericsson (pmUeThp)","?Tra Nokia (UE throughput)",
   "Thước đo trải nghiệm FWA: so trực tiếp với gói cáp quang và tốc độ cam kết.","≥ tốc độ cam kết lúc giờ bận.",
   "cuup>du:Lưu lượng DL;du>ue:PDSCH tới CPE!S"]);
  const XN={pn_lat:["Trễ E2E URLLC phân vị 99,999 %","p99.999 latency","URLLC latency|trễ đuôi|tail latency|mạng riêng","Trễ một chiều mà 99,999 % số gói không vượt."],
    pn_rel:["Tỉ lệ gói đúng hạn","On-time ratio","reliability|độ tin cậy|survival time|TSC","Phần gói tới trong hạn trễ của luồng công nghiệp."],
    pn_sync:["Sai số thời gian TSN qua 5G","Time error","gPTP|TSN|đồng bộ thời gian|SIB9","Độ lệch giờ giữa thiết bị TSN và grandmaster."],
    pn_cag:["Tỉ lệ Registration Reject #76 (CAG)","Reject #76","CAG|PNI-NPN|Closed Access Group|mạng riêng","Phần đăng ký bị từ chối vì UE không thuộc CAG."],
    pn_fwa:["Tốc độ hộ FWA giờ bận","FWA thp","FWA|truy nhập cố định|CPE|fixed wireless","Tốc độ DL mỗi hộ FWA lúc đông nhất."]};
  const EN={pn_lat:"URLLC E2E Latency (99.999th percentile)",pn_rel:"Packets Delivered within Deadline",pn_sync:"5G TSN Time Synchronization Error",pn_cag:"Registration Reject #76 Ratio",pn_fwa:"FWA Busy-hour Household Throughput"};
  for(const id in XN){const k=KL.find(x=>x.id===id);if(!k)continue;const x=XN[id];if(typeof KX!=='undefined')KX[id]=x;if(typeof KEN!=='undefined')KEN[id]=EN[id];
    k.fn=x[0];k.ab=[x[1]].concat(x[2].split('|'));k.gl=x[3];k.dn=k.fn+' ('+x[1]+')';k.en=EN[id];}
  const ids=Object.keys(XN),moved=ids.map(id=>{const i=KL.findIndex(k=>k.id===id);return i>=0?KL.splice(i,1)[0]:null;}).filter(Boolean);
  let j=KL.findIndex(k=>k.id==='sf_waste');if(j<0)j=KL.findIndex(k=>k.id==='lb_edge');KL.splice(j>=0?j+1:KL.length,0,...moved);
}catch(e){console.error('KPI mạng riêng',e);}})();
/* tìm kiếm chung */
if(typeof qSnap==='function'){const _qs=qSnap;qSnap=function(){_qs.apply(this,arguments);if(!QS||!QS.I||QS.pn)return;QS.pn=1;
  const CAT='Thẻ Mạng riêng 5G',body=document.getElementById('pnBody'),cur=PNS.v;
  if(body){for(const [v,vn] of PNV){try{PNS.v=v;body.innerHTML=PNR[v].html();
    body.querySelectorAll('.panel').forEach(pn=>{const h=pn.querySelector('h3'),tt=h?h.textContent:vn,txt=qText(pn).slice(0,6000);if(txt.trim().length<12)return;
      qAdd(QS.I,CAT+' · '+vn,tt,txt,1,()=>{S.tab='pn';PNS.v=v;},()=>[...document.querySelectorAll('#t-pn .panel')].find(p=>{const x=p.querySelector('h3');return x&&x.textContent===tt;}));});}catch(e){console.error(e);}}
    PNS.v=cur;PNS.job++;try{if(S.tab==='pn')renderPn();else body.innerHTML='';}catch(e){}}
  const go=(v,f)=>()=>{S.tab='pn';PNS.v=v;if(f)f();};
  PNPAR.forEach(r=>qAdd(QS.I,'Mạng riêng 5G · Tham số '+r[1],r[2],['Huawei: '+r[3],'Nokia: '+r[4],'Ericsson: '+r[5],'Điển hình: '+r[6]].join('. '),3,go('vd',()=>{PNP.vd.grp=r[1];PNP.vd.q='';}),'#pnParB'));
  PNKPI.forEach(k=>qAdd(QS.I,'Mạng riêng 5G · KPI',k[0],[k[1],k[5]].join('. '),3,go('vd'),'#pnKpB'));
  PNFLT.forEach(f=>qAdd(QS.I,'Mạng riêng 5G · Lỗi thường gặp',f[0],[f[1],f[2].join('; '),f[3].join('; ')].join('. '),3,go('vd'),()=>{const d=[...document.querySelectorAll('#t-pn .pnflt')].find(x=>x.querySelector('summary').textContent===f[0]);if(d)d.open=true;return d;}));
  PNMK.forEach(k=>qAdd(QS.I,'Mạng riêng 5G · Mô hình triển khai',PNM[k].n,PNM[k].d+' '+PNM[k].t.join('. '),3,go('arch',()=>{PNP.arch.m=k;}),'#pnArchFig'));
  PNSCK.forEach(k=>qAdd(QS.I,'Mạng riêng 5G · Kịch bản ngành',PNSC[k].n,'yêu cầu UL DL trễ tin cậy mật độ định vị sẵn sàng, đề xuất cấu hình, kiểm tra đạt',2,go('svc',()=>{PNP.svc.sc=k;Object.assign(PNP.svc,PNSC[k].def);}),'#pnSvcChk'));
  [['SNPN, PNI-NPN, CAG, NID, N3IWF','npn-IdentityInfoList cellReservedForOtherUse Registration Reject cause 76 74 75 EAP-TLS credentials holder','arch'],['Vô tuyến khuôn viên, InF, small cell','TR 38.901 Indoor Factory InF-SL InF-DH n78 n79 n48 CBRS mmWave khung TDD DSUUU nhiễu nhà mạng','rf'],
   ['URLLC công nghiệp','mini-slot configured grant qam64LowSE CQI table 3 preemption DCI 2_1 UL cancellation DCI 2_4 Monte Carlo 99,999 % survival time','urllc'],['TSN, gPTP, 5G LAN','DS-TT NW-TT TSN AF TSCTSF TSCAI SIB9 bù trễ lan truyền 5G VN PDU Ethernet N19 EHC','tsn'],['FWA và dịch vụ ngành','CPE số hộ oversubscription nhà máy cảng mỏ bệnh viện sân bay đại học dimension','svc']].forEach(([n,x,v])=>qAdd(QS.I,'Mạng riêng 5G',n,x,2,go(v),'#pnBody'));};}
/* thẻ E2E: nút sang thẻ này */
if(typeof e2Kpi==='function'){const _ke=e2Kpi;e2Kpi=function(){_ke.apply(this,arguments);if(!['reg','data'].includes(S.e2Sc)||S.e2R!=='sa')return;const b=$('#e2Kpi .e2go');
  if(b&&!b.querySelector('[data-pngo]'))b.insertAdjacentHTML('beforeend',S.e2Sc==='reg'?`<button type="button" class="btn sm" data-pngo="pn:arch">Mạng riêng 5G · Registration vào SNPN, CAG →</button>`:`<button type="button" class="btn sm" data-pngo="pn:urllc">Mạng riêng 5G · URLLC, UPF tại chỗ →</button>`);};}
/* thẻ KPI: nút sang mục tương ứng */
const PNKV={pn_lat:'urllc',pn_rel:'urllc',pn_sync:'tsn',pn_cag:'arch',pn_fwa:'svc'};
if(typeof kpDetHtml==='function'){const _kd=kpDetHtml;kpDetHtml=function(k){let h=_kd.apply(this,arguments);if(k&&PNKV[k.id]){const v=PNKV[k.id];h+=`<p class="u3kpl"><button type="button" class="btn sm" data-pngo="pn:${v}">Xem mô phỏng ở thẻ Mạng riêng 5G · ${nE(PNV.find(x=>x[0]===v)[1])} →</button></p>`;}return h;};}
/* thanh nút ở các thẻ liên quan */
const PNTABL={rsh:[['arch','Bốn mô hình NPN, SIB1, Reject #76'],['rf','Vô tuyến khuôn viên']],sc:[['arch','Credential SNPN: EAP-TLS, AAA bên ngoài']],nd:[['urllc','URLLC với PDCP duplication']],ro:[['rf','Khung TDD mạng riêng cạnh nhà mạng']],sf:[['svc','FWA: số hộ mỗi sector']],lb:[['svc','FWA và dung lượng']],core:[['arch','5GC tại chỗ, SNPN, N3IWF']],tx:[['tsn','gPTP qua 5G']],stack:[['tsn','5G LAN, PDU Ethernet, EHC']]};
const pnBar=t=>`<div class="sclkbar pnlkbar nogl"><span>Mô phỏng ở thẻ <b>Mạng riêng 5G</b>:</span>${t.map(x=>`<button type="button" class="btn sm" data-pngo="pn:${x[0]}">${nE(x[1])} →</button>`).join('')}</div>`;
Object.keys(PNTABL).forEach(t=>{const f=RENDER[t];if(typeof f!=='function')return;RENDER[t]=function(){const r=f.apply(this,arguments);try{const sec=document.getElementById('t-'+t);if(sec&&!sec.querySelector('.pnlkbar')){const ld=sec.querySelector('.lead');if(ld)ld.insertAdjacentHTML('afterend',pnBar(PNTABL[t]));else sec.insertAdjacentHTML('afterbegin',pnBar(PNTABL[t]));}}catch(e){}return r;};});
/* chuyên đề Mạng riêng, URLLC, FWA ở thẻ book */
if(typeof RENDER.book==='function'){const _b=RENDER.book;RENDER.book=function(){const r=_b.apply(this,arguments);try{const sec=document.getElementById('t-book');if(sec){const o=sec.querySelector('.pnlkbar');if(o)o.remove();
  const M={npn:[['arch','Mô hình triển khai'],['vd','Tham số, KPI, lỗi']],urllc:[['urllc','Monte Carlo URLLC 10⁵–10⁶ gói']],more:[['svc','FWA và dịch vụ ngành']]}[S.bk];if(M){const ld=sec.querySelector('.lead');if(ld)ld.insertAdjacentHTML('afterend',pnBar(M));}}}catch(e){}return r;};}

