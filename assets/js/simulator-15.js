
/* ===== Thẻ Truyền dẫn vệ tinh LEO (leo) — đợt 31 lộ trình (BRIEF 23) ===== */
const STLS={v:'arch',raf:0,last:0,pause:false,job:0,at:0,lt:0,acc:0,rt:0,vt:0,mt:0,mclk:0,qt:0,win:null,day:null,sig:'',daySig:'',tcp:null,voc:null,qos:null,sla:null,game:null,an:'ut'};
const STLV=[['arch','Kiến trúc toàn trình'],['link','Kênh vệ tinh theo thời gian'],['ran','4G/5G chạy trên đường vệ tinh'],['dim','Định cỡ, dự phòng, chi phí'],['mon','Giám sát, kiểm soát toàn trình'],['vd','Tham số, KPI, lỗi']];
const STLR={},STLF={};
const STLP={
 arch:{path:'bp',bh:'inet',spd:5},
 link:{h:550,emin:25,sw:15,nc:8,term:'std',obs:[0,0,0,0,0,0,0,0],rain:60,rdur:40,rh:16,rgw:0,load:75,wh:20,seed:1,gwkm:300,popkm:400,isl:0,spd:1},
 ran:{hb:5,rtoi:1,rtomin:0.5,rtomax:4,pmr:3,amr:5,dpd:10,dpdr:4,echo:60,t3:3,n3:3,out:20,rtp:20,ipv:4,ipo:4,pay:1400,esp:'gcm',natt:1,vlan:1,mtu:1500,n3x:1,codec:'wb',osc:'ocxo',tsz:20,cbw:100,nsite:20,nue:150},
 dim:{nl:1,lbw:15,nn:0,nbw:40,mimo:4,nsec:3,subs:400,ru:0.1,ulr:0.15,term:'std',nt:1,bond:85,mw:0,mwa:99.95,btsw:800,kwp:4,bat:20,psh:4.5,grid:1,fkm:25,mwh:3,yrs:5},
 mon:{site:0,fault:'none',qos:'shape',nv:12,slat:99.5,ans:'',seg:'',cause:'',raw:0,mth:7},
 vd:{grp:'all',q:'',kf:'all'}
};
function stlSl(vw,k,l,mn,mx,st,f,hint,pk){STLF[vw+':'+k]=f;const v=STLP[vw][k];
  return `<label class="c"><span class="cl">${l}<output>${f(v)}</output></span><input type="range" data-stli="${vw}:${k}" min="${mn}" max="${mx}" step="${st}" value="${v}">${hint?`<span class="u3ph">${hint}</span>`:''}${pk?stlPnTag(pk):''}</label>`;}
function stlSel(vw,k,l,opts,hint,pk){const v=STLP[vw][k];
  return `<label class="c"><span class="cl">${l}</span><select data-stli="${vw}:${k}">${opts.map(o=>`<option value="${o[0]}"${String(o[0])===String(v)?' selected':''}>${nE(o[1])}</option>`).join('')}</select>${hint?`<span class="u3ph">${hint}</span>`:''}${pk?stlPnTag(pk):''}</label>`;}
function stlChk(vw,k,l,pk){return `<label class="u3ck"><input type="checkbox" data-stli="${vw}:${k}"${STLP[vw][k]?' checked':''}> ${l}</label>${pk?stlPnTag(pk):''}`;}
function stlPn(key){const r=(typeof STLPAR!=='undefined'?STLPAR:[]).find(x=>x[0]===key);if(!r)return'';const v=nVn();if(v==='3gpp')return'';
  return nVName(v)+': '+r[{huawei:3,nokia:4,ericsson:5}[v]]+' (cần đối chiếu)';}
function stlPnTag(key){const t=stlPn(key);return t?`<span class="vh ndvh">${nE(t)}</span>`:'';}
const stlKv=(a,b)=>`<dt>${a}</dt><dd>${b}</dd>`;
const stlSet=(id,h)=>{const e=document.getElementById(id);if(e)e.innerHTML=h;};
const stlMs=x=>!isFinite(x)?'—':nF(x,x<10?1:0)+' ms';
const stlPct=(x,d)=>!isFinite(x)?'—':nF(x,d==null?2:d)+' %';
const stlMb=x=>!isFinite(x)?'—':x>=1000?nF(x/1000,2)+' Gbit/s':nF(x,x<10?1:0)+' Mbit/s';
const stlS=x=>!isFinite(x)?'—':x>=120?nF(x/60,1)+' phút':nF(x,x<10?1:0)+' s';
function stlPlayBtn(vw,id){return `<button type="button" class="btn sm" data-stla="${vw}:play" id="${id}">${STLS.pause?'▶ Chạy':'⏸ Dừng'}</button>`;}
function stlPlayTog(id){STLS.pause=!STLS.pause;const b=document.getElementById(id);if(b)b.textContent=STLS.pause?'▶ Chạy':'⏸ Dừng';}
function stlQ(a,p){if(!a||!a.length)return NaN;const s=Float64Array.from(a).sort();return s[Math.min(s.length-1,Math.max(0,Math.round(p/100*(s.length-1))))];}
function stlCore(){const m=(typeof S!=='undefined'&&S.mode)||'SA';
  return m==='SA'?{ran:'gNB',core:'5GC',c:'NG-C (N2)',u:'N3',cn:'AMF',un:'UPF',ap:'NGAP',x:'Xn',t:'5G SA'}:m==='NSA'?{ran:'eNB + gNB',core:'EPC',c:'S1-C',u:'S1-U',cn:'MME',un:'SGW/PGW',ap:'S1AP',x:'X2',t:'5G NSA'}:{ran:'eNB',core:'EPC',c:'S1-C',u:'S1-U',cn:'MME',un:'SGW/PGW',ap:'S1AP',x:'X2',t:'4G'};}

/* ---------- Mô hình vật lý dùng chung ---------- */
const STLRE=6371,STLCK=299792.458,STLMU=398600.4418;
function stlSlant(h,el){const r=STLRE,e=el*Math.PI/180;return Math.sqrt((r+h)*(r+h)-Math.pow(r*Math.cos(e),2))-r*Math.sin(e);}
function stlTheta(h,el){const e=el*Math.PI/180;return 90-el-Math.asin(STLRE*Math.cos(e)/(STLRE+h))*180/Math.PI;}
function stlElTh(h,th){const t=th*Math.PI/180,R=STLRE,x=(R+h)*Math.abs(Math.sin(t)),y=(R+h)*Math.cos(t)-R;return Math.atan2(y,x)*180/Math.PI;}
function stlSlTh(h,th){const t=th*Math.PI/180,R=STLRE;return Math.sqrt(R*R+(R+h)*(R+h)-2*R*(R+h)*Math.cos(t));}
const stlPeriod=h=>2*Math.PI*Math.sqrt(Math.pow(STLRE+h,3)/STLMU);
const STLTERM={std:{n:'Terminal tiêu chuẩn',snr:13,dl:300,ul:40,w:[75,100],fov:110},mini:{n:'Terminal mini',snr:10,dl:150,ul:25,w:[25,40],fov:110}};
const STLMC=[[-2.4,0.49,'QPSK 1/4'],[1.0,0.99,'QPSK 1/2'],[3.1,1.32,'QPSK 2/3'],[5.2,1.65,'QPSK 5/6'],[6.6,1.98,'8PSK 2/3'],[9.0,2.48,'8PSK 5/6'],[10.2,2.64,'16APSK 2/3'],[12.9,3.30,'16APSK 5/6'],[13.6,3.52,'32APSK 3/4'],[16.0,4.12,'32APSK 9/10']];
function stlMod(snr){let m=null;for(const r of STLMC)if(snr>=r[0])m=r;return m;}
/* hệ số k, alpha gần đúng theo ITU-R P.838-3 (trung bình phân cực ngang/dọc) — cần đối chiếu bảng gốc */
const STLRK={ku_dl:[11.7,0.0220,1.17],ku_ul:[14.25,0.0350,1.14],ka_dl:[18.5,0.0750,1.08],ka_ul:[28.5,0.2000,0.97]};
function stlRainA(R,band,el,hR){if(!(R>0))return 0;const c=STLRK[band],f=c[0],g=c[1]*Math.pow(R,c[2]),e=Math.max(5,el)*Math.PI/180,Ls=Math.max(0.1,(hR||5)-0.05)/Math.sin(e),LG=Ls*Math.cos(e),
  r=1/(1+0.78*Math.sqrt(LG*g/f)-0.38*(1-Math.exp(-2*LG)));return g*Ls*nC(r,0.05,1.5);}
const STLDAY=[35,28,22,18,16,18,25,38,48,55,58,60,62,60,58,60,66,74,85,95,100,98,85,58];
function stlRainAt(P,t){if(!(P.rain>0))return 0;const tc=P.rh*3600,w=Math.max(60,P.rdur*60/2.5),x=(t-tc)/w;if(Math.abs(x)>3)return 0;return P.rain*Math.exp(-x*x)*(0.7+0.6*Math.abs(Math.sin(t/37)));}
function stlPos(s,t){const r0=90-s.el0,a0=s.az0*Math.PI/180,d=s.dir*Math.PI/180,x=r0*Math.sin(a0)+s.sp*t*Math.sin(d),y=r0*Math.cos(a0)+s.sp*t*Math.cos(d),r=Math.hypot(x,y);
  return {el:90-r,az:(Math.atan2(x,y)*180/Math.PI+360)%360};}
function stlObs(P,p){return p.el<P.obs[Math.floor(p.az/45)%8];}
function stlSkyObsPct(P){const e0=Math.sin(P.emin*Math.PI/180);let s=0;P.obs.forEach(o=>{if(o>P.emin)s+=Math.sin(o*Math.PI/180)-e0;});return 100*s/(8*(1-e0));}
function stlMkSlot(rng,P){const c=[];for(let j=0;j<P.nc;j++){const el0=P.emin+(90-P.emin)*(1-Math.sqrt(rng()));c.push({el0,az0:rng()*360,dir:rng()*360,sp:0.35+0.45*el0/90});}
  let ch=0,bs=-1e9;c.forEach((s,j)=>{let ob=0,em=0;for(let q=0;q<=4;q++){const p=stlPos(s,q/4*P.sw);if(p.el<P.emin||stlObs(P,p))ob++;em+=p.el;}const sc=-ob*1000+em/5;if(sc>bs){bs=sc;ch=j;}});
  return {c,ch,eg:35+rng()*45,qf:0.7+0.6*rng()};}
function stlRun(P,t0,dur,dt,seed,keep){const rng=nRng((seed||1)*7919+Math.round(t0)),n=Math.max(1,Math.round(dur/dt)),T=STLTERM[P.term]||STLTERM.std;
  const o={t0,dt,n,rtt:new Float32Array(n),dl:new Float32Array(n),ul:new Float32Array(n),loss:new Float32Array(n),out:new Uint8Array(n),el:new Float32Array(n),snr:new Float32Array(n),rain:new Float32Array(n),mc:new Array(keep?n:0),sw:[],slots:[]};
  let slot=null,sk=-1;const isl=P.isl*1800,gnd=(P.gwkm+P.popkm)*0.01+2;
  for(let i=0;i<n;i++){const t=t0+i*dt,k=Math.floor(t/P.sw),ts=t-k*P.sw;
    if(k!==sk){sk=k;slot=stlMkSlot(rng,P);if(keep)o.slots.push({t:i*dt,s:slot});if(i>0)o.sw.push(i*dt);}
    const sv=slot.c[slot.ch],p=stlPos(sv,ts),blk=p.el<P.emin||stlObs(P,p),el=nC(p.el,P.emin*0.5,90),hr=Math.floor(((t/3600)%24+24)%24);
    const R=stlRainAt(P,t),dU=stlSlant(P.h,el),dG=stlSlant(P.h,slot.eg),u=nC(P.load/100*STLDAY[hr]/100,0,0.97);
    const prop=2*(dU+dG+isl)/STLCK*1000,q=4+18*u*u/(1-u+0.1),spike=ts<0.4?12+rng()*25:0;
    const rtt=prop+16+P.isl*1+q*(slot.qf+0.15*nGs(rng))+gnd+Math.abs(nGs(rng))*3+rng()*4+spike;
    const aU=stlRainA(R,'ku_dl',el,5),aG=P.rgw?stlRainA(R*0.8,'ka_dl',slot.eg,5):0,snrU=T.snr-10*Math.log10(dU/P.h)-aU+nGs(rng)*0.6,snrG=20-aG;
    const snr=-10*Math.log10(Math.pow(10,-snrU/10)+Math.pow(10,-snrG/10)),m=stlMod(snr),out=blk||!m,fse=m?m[1]/4.12:0;
    o.rtt[i]=rtt;o.el[i]=p.el;o.snr[i]=snr;o.rain[i]=R;o.out[i]=out?1:0;if(keep)o.mc[i]=m?m[2]:'—';
    o.dl[i]=out?0:T.dl*fse*(1-0.75*u)*(0.8+0.4*rng());o.ul[i]=out?0:T.ul*Math.min(1,fse*1.3)*(1-0.6*u)*(0.8+0.4*rng());
    o.loss[i]=out?100:nC(0.15+(ts<0.3?6+rng()*10:0)+(snr<m[0]+1?1.5:0)+(u>0.85?(u-0.85)*10:0),0,100);}
  return o;}
function stlStats(o){const ok=[],dls=[],uls=[];let ls=0,jit=0,jn=0,prev=null,on=0,ev=0,cur=0,mx=0;
  for(let i=0;i<o.n;i++){ls+=o.loss[i];if(o.out[i]){on++;if(!cur)ev++;cur+=o.dt;if(cur>mx)mx=cur;prev=null;continue;}cur=0;
    if(prev!=null){jit+=Math.abs(o.rtt[i]-prev);jn++;}prev=o.rtt[i];ok.push(o.rtt[i]);dls.push(o.dl[i]);uls.push(o.ul[i]);}
  return {p50:stlQ(ok,50),p95:stlQ(ok,95),p99:stlQ(ok,99),loss:ls/o.n,jit:jn?jit/jn:NaN,outMin:on*o.dt/60,avail:100*(1-on/o.n),ev,mx,dl50:stlQ(dls,50),dl10:stlQ(dls,10),ul50:stlQ(uls,50),ul10:stlQ(uls,10),nsw:o.sw.length};}
function stlLinkSig(){const P=STLP.link;return JSON.stringify([P.h,P.emin,P.sw,P.nc,P.term,P.obs,P.rain,P.rdur,P.rh,P.rgw,P.load,P.wh,P.seed,P.gwkm,P.popkm,P.isl]);}
function stlLinkRun(force){const s=stlLinkSig();if(!force&&STLS.win&&STLS.sig===s)return;const P=STLP.link;STLS.sig=s;STLS.win=stlRun(P,P.wh*3600,120,0.1,P.seed,true);STLS.winSt=stlStats(STLS.win);STLS.lt=Math.min(STLS.lt,119.9);}
function stlDayRun(){const s=stlLinkSig();if(STLS.day&&STLS.daySig===s)return STLS.dayAgg;const P=STLP.link;STLS.daySig=s;const o=stlRun(P,0,86400,1,P.seed,false);STLS.day=o;STLS.daySt=stlStats(o);
  const A={rt:[],rx:[],dl:[],ul:[],out:[],rain:[]};for(let m=0;m<1440;m++){const a=[];let d=0,u=0,ot=0,rn=0;for(let j=0;j<60;j++){const i=m*60+j;rn=Math.max(rn,o.rain[i]);if(o.out[i]){ot++;continue;}a.push(o.rtt[i]);d+=o.dl[i];u+=o.ul[i];}
    const k=60-ot,h=m/60;A.rt.push([h,a.length?stlQ(a,50):null]);A.rx.push([h,a.length?stlQ(a,95):null]);A.dl.push([h,k?d/k:0]);A.ul.push([h,k?u/k:0]);A.out.push([h,ot]);A.rain.push([h,rn]);}
  A.rt=A.rt.map(x=>x[1]==null?null:x);A.rx=A.rx.map(x=>x[1]==null?null:x);STLS.dayAgg=A;return A;}
function stlDaySt(){stlDayRun();return STLS.daySt;}

/* ---------- Mục 1: Kiến trúc toàn trình ---------- */
const STLAN={
 ue:{n:'UE',s:'điện thoại, CPE',d:'Thuê bao trong vùng phủ trạm. Không biết đường truyền phía sau là vệ tinh, chỉ thấy trễ lớn hơn.',l:'Vô tuyến 10–20 ms (4G), 4–10 ms (5G)',m:'MDT, đo kiểm drive test, bộ đếm RRC/E-RAB/QoS flow ở OSS'},
 ran:{n:'eNB/gNB',s:'trạm',d:'Kết thúc giao diện vô tuyến; S1/NG đi qua IPsec về lõi. Cần GNSS tại trạm vì PTP không đi qua vệ tinh được.',l:'Xử lý < 1 ms',m:'Cảnh báo S1/NG link, SCTP, GTP-U echo, GNSS, bộ đếm KPI'},
 csr:{n:'Router trạm (CSR)',s:'IPsec, QoS',d:'Thường kiêm IPsec client (hoặc eNB tự làm), đánh dấu DSCP, shaping dưới năng lực terminal, BFD/IP SLA, chuyển đường khi có viba dự phòng.',l:'< 1 ms',m:'SNMP/telemetry, BFD, TWAMP sender, bộ đếm hàng đợi'},
 ut:{n:'Terminal vệ tinh',s:'phased array Ku',d:'Anten mảng pha điều hướng búp sóng điện tử, bám vệ tinh LEO; nhận cấu hình lập lịch từ mạng vệ tinh. Cấp nguồn PoE/DC; công suất tiêu thụ trung bình 75–100 W (bản tiêu chuẩn) hoặc 25–40 W (bản mini).',l:'Lập lịch, đóng khung: phần lớn trong 15–20 ms «xử lý» (cần đối chiếu)',m:'API/gRPC của terminal: trạng thái, SNR, % che khuất, thời gian gián đoạn, trễ tới PoP (tên trường cần đối chiếu)'},
 sat:{n:'Vệ tinh LEO',s:'~480–570 km',d:'Chòm LEO kiểu Starlink: hàng nghìn vệ tinh trên nhiều mặt phẳng quỹ đạo. Liên kết người dùng băng Ku (xuống 10,7–12,7 GHz, lên 14,0–14,5 GHz); liên kết gateway băng Ka; có liên kết laser giữa vệ tinh.',l:'Lan truyền 2 chặng 3,6–15 ms một chiều tuỳ góc ngẩng',m:'Không trực tiếp; suy ra từ telemetry terminal và trễ PoP'},
 gw:{n:'Trạm mặt đất (gateway)',s:'Ka',d:'Nối vệ tinh xuống mặt đất (băng Ka 17,8–19,3 / 27,5–30,0 GHz). Mưa lớn tại gateway cũng làm giảm chất lượng cho nhiều terminal cùng lúc.',l:'Cáp quang gateway → PoP vài ms',m:'Nhà cung cấp vệ tinh (trang trạng thái, ticket); nhà mạng chỉ thấy gián tiếp'},
 pop:{n:'PoP',s:'CGNAT, Internet',d:'Điểm kết nối Internet của nhà cung cấp vệ tinh: cấp địa chỉ CGNAT 100.64.0.0/10 hoặc IPv6, có thể có IP công khai hoặc kết nối riêng tuỳ gói doanh nghiệp (cần đối chiếu hợp đồng).',l:'Vài ms',m:'Ping/TWAMP tới địa chỉ PoP, traceroute'},
 inet:{n:'Internet / kết nối riêng',s:'transit',d:'Đi Internet công cộng hoặc kết nối riêng (L2/L3, peering) tới nhà mạng. Kết nối riêng giảm trễ và ổn định hơn nhưng phụ thuộc hợp đồng.',l:'Phụ thuộc khoảng cách PoP → SeGW',m:'TWAMP CSR ↔ SeGW, traceroute, BGP'},
 segw:{n:'SeGW',s:'IPsec, NAT-T',d:'Cổng bảo mật của nhà mạng: kết thúc IKEv2/IPsec ESP từ trạm (TS 33.210 NDS/IP, TS 33.401/33.501 cho S1/N2/N3 qua mạng không tin cậy). Phải hỗ trợ NAT-T (UDP 4500) vì trạm nằm sau CGNAT.',l:'< 1 ms',m:'Bộ đếm IKE/IPsec SA, rekey, DPD, giải mã lỗi'},
 core:{n:'Lõi EPC/5GC',s:'MME/AMF, UPF',d:'MME, SGW/PGW (4G) hoặc AMF, SMF, UPF (5G SA). Thấy trạm qua S1/NG như mọi trạm khác; chỉ khác là trễ, jitter, gián đoạn lớn hơn.',l:'Xử lý lõi vài ms',m:'Bộ đếm S1/NG setup, SCTP, paging, GTP-U path, KPI theo trạm'}};
const STLAK=['ue','ran','csr','ut','sat','gw','pop','inet','segw','core'];
const STLCP=[[100,60],[300,60],[500,60],[700,60],[900,60],[900,200],[700,200],[500,200],[300,200],[100,200]];
function stlChainSvg(){const P=STLP.arch,C=stlCore(),N=STLCP,lab={ran:C.ran,core:C.core},sub={core:C.cn+' · '+C.un,inet:P.bh==='inet'?'Internet':'kết nối riêng'};
  const E=[['Uu','10–20 ms'],['Ethernet','< 1 ms'],['Ethernet','< 1 ms'],['Ku','2–7 ms'],[P.path==='isl'?'Ka + laser':'Ka','2–7 ms'],['cáp quang','1–5 ms'],[P.bh==='inet'?'IP transit':'L2/L3 riêng','2–15 ms'],['IPsec ESP','—'],[C.c+' · '+C.u,'< 1 ms']];let s='';
  for(let i=0;i<9;i++){const a=N[i],b=N[i+1],v=a[0]===b[0];const x1=v?a[0]:a[0]+(b[0]>a[0]?62:-62),x2=v?b[0]:b[0]+(b[0]>a[0]?-62:62),y1=v?a[1]+24:a[1],y2=v?b[1]-24:b[1],mx=(x1+x2)/2,my=(y1+y2)/2;
   s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="stle${i>=2&&i<=7?' on':''}"/>`+(v?`<text x="${mx+10}" y="${my-2}" class="stlmo">${nE(E[i][0])}</text><text x="${mx+10}" y="${my+11}" class="stlmo">${E[i][1]}</text>`:`<text x="${mx}" y="${my-7}" class="stlmo" text-anchor="middle">${nE(E[i][0])}</text><text x="${mx}" y="${my+15}" class="stlmo" text-anchor="middle">${E[i][1]}</text>`);}
  s+=`<text x="500" y="272" class="stlsm" text-anchor="middle">Cạnh màu xanh: đi trong đường hầm IPsec ESP/UDP 4500 (NAT-T) từ router trạm tới SeGW — ${nE(C.c)}, ${nE(C.u)}, ${nE(C.x)}, OAM đều ở bên trong</text>`;
  STLAK.forEach((k,i)=>{const n=STLAN[k],p=N[i];s+=`<g class="stln${STLS.an===k?' on':''}" data-stla="arch:node:${k}" tabindex="0" role="button" aria-label="${nE(n.n)}"><rect x="${p[0]-62}" y="${p[1]-24}" width="124" height="48" rx="8"/><text x="${p[0]}" y="${p[1]-4}" class="stltx" text-anchor="middle">${nE(lab[k]||n.n)}</text><text x="${p[0]}" y="${p[1]+13}" class="stlsm" text-anchor="middle">${nE(sub[k]||n.s)}</text></g>`;});
  s+=`<circle id="stlPkU" r="5" cx="-20" cy="-20" class="stldot"/><circle id="stlPkD" r="5" cx="-20" cy="-20" style="fill:var(--acc)"/>`;
  return `<svg viewBox="0 0 1000 285" class="u3svg stlsvg" role="img" aria-label="Chuỗi truyền dẫn toàn trình qua vệ tinh LEO">${s}</svg>`;}
function stlChainAt(f){const N=STLCP,seg=f*9,i=Math.min(8,Math.floor(seg)),q=seg-i,a=N[i],b=N[i+1];return [a[0]+(b[0]-a[0])*q,a[1]+(b[1]-a[1])*q];}
function stlNodeHtml(){const k=STLS.an,n=STLAN[k],C=stlCore();return `<h3>${nE(k==='ran'?C.ran:k==='core'?C.core+' ('+C.cn+', '+C.un+')':n.n)}</h3><p class="e2d">${nE(n.d)}</p><dl class="kv">${stlKv('Đóng góp trễ',nE(n.l))}${stlKv('Nguồn số đo giám sát',nE(n.m))}</dl><p class="row"><button type="button" class="btn sm" data-stlgo="leo:mon">Xem đoạn này trên dashboard giám sát →</button></p>`;}
/* hình học cạnh bên: góc tâm thật θ, vẽ với hệ số phóng 2,6 */
const STLGK=2.6,STLGC=[500,1240],STLGR=1000,STLGO=90;
function stlGxy(th,r){const f=th*STLGK*Math.PI/180;return [STLGC[0]+r*Math.sin(f),STLGC[1]-r*Math.cos(f)];}
function stlGeo(){const P=STLP.arch,L=STLP.link,isl=P.path==='isl';return {h:L.h,emin:L.emin,tT:isl?-6:-4,tG:isl?11:4,sp:6,pl:[0,2,4],isl};}
function stlSideSvg(){const G=stlGeo();const ea=stlGxy(-13,STLGR),eb=stlGxy(13,STLGR);let s=`<path d="M${ea[0].toFixed(1)} 380 L${ea[0].toFixed(1)} ${ea[1].toFixed(1)} A${STLGR} ${STLGR} 0 0 1 ${eb[0].toFixed(1)} ${eb[1].toFixed(1)} L${eb[0].toFixed(1)} 380 Z" class="stlearth"/>`;
  G.pl.forEach((o,j)=>{const r=STLGR+STLGO+(j-1)*10;s+=`<path d="M${stlGxy(-12,r)[0]} ${stlGxy(-12,r)[1]} A${r} ${r} 0 0 1 ${stlGxy(12,r)[0]} ${stlGxy(12,r)[1]}" class="stlorb"/>`;});
  const T=stlGxy(G.tT,STLGR),Gw=stlGxy(G.tG,STLGR);
  s+=`<path id="stlFoot" d="" class="stlfoot"/><path id="stlBmT" d="" class="stlbeam"/><path id="stlBmG" d="" class="stlbeam"/><path id="stlIsl" d="" class="stlisl"/>`;
  for(let j=0;j<27;j++)s+=`<circle id="stlSv${j}" r="4.5" cx="-20" cy="-20" class="stlsat"/>`;
  s+=`<rect x="${T[0]-9}" y="${T[1]-14}" width="18" height="10" rx="2" style="fill:var(--warn)"/><text x="${T[0]}" y="${T[1]+16}" class="stltx" text-anchor="middle">Terminal tại trạm</text>`;
  s+=`<path d="M${Gw[0]-12} ${Gw[1]-2} a12 12 0 0 1 24 0 z" style="fill:var(--acc)"/><text x="${Gw[0]}" y="${Gw[1]+16}" class="stltx" text-anchor="middle">Gateway${G.isl?' (xa)':''}</text>`;
  s+=`<text x="12" y="118" class="stlsm">Hình học phóng to: góc tâm × ${STLGK}, độ cao không theo tỉ lệ. Vệ tinh tím viền cam là vệ tinh đang phục vụ.</text>`;
  return `<svg viewBox="0 100 1000 280" class="u3svg stlsvg" role="img" aria-label="Chòm vệ tinh LEO chuyển động và terminal đổi vệ tinh">${s}</svg>`;}
function stlArchSats(t){const G=stlGeo(),h=G.h,om=360/stlPeriod(h),A=[];/* om: độ góc tâm mỗi giây */
  G.pl.forEach((o,j)=>{for(let q=-4;q<=4;q++){const L=G.sp*9;let th=((((q+4)*G.sp+o+om*t)%L)+L)%L;th=th-G.sp*4.5;A.push({th,j,id:A.length});}});return A;}
function stlArchPick(A,G){let bt=null,bg=null,bs=-1e9;const ok=s=>stlElTh(G.h,s.th-G.tT)>=G.emin,okg=s=>stlElTh(G.h,s.th-G.tG)>=G.emin;
  if(!G.isl){A.forEach(s=>{if(ok(s)&&okg(s)){const v=Math.min(stlElTh(G.h,s.th-G.tT),stlElTh(G.h,s.th-G.tG));if(v>bs){bs=v;bt=s;}}});return {t:bt,g:bt,hops:0};}
  A.forEach(s=>{if(ok(s)){const v=stlElTh(G.h,s.th-G.tT);if(v>bs){bs=v;bt=s;}}});if(!bt)return {t:null,g:null,hops:0};bs=-1e9;
  A.forEach(s=>{if(s.j===bt.j&&okg(s)){const v=stlElTh(G.h,s.th-G.tG);if(v>bs){bs=v;bg=s;}}});return {t:bt,g:bg,hops:bg?Math.round(Math.abs(bg.th-bt.th)/G.sp):0};}
function stlArchTick(dt){const P=STLP.arch,G=stlGeo();if(!STLS.pause)STLS.at+=dt*P.spd;const t=STLS.at,sw=STLP.link.sw,A=stlArchSats(t);
  const k=Math.floor(t/sw);if(STLS.ak!==k||!STLS.apk){STLS.ak=k;STLS.apk=stlArchPick(A,G);STLS.apkT=STLS.apk.t?STLS.apk.t.id:-1;STLS.apkG=STLS.apk.g?STLS.apk.g.id:-1;}
  const srv=A.find(s=>s.id===STLS.apkT),sg=A.find(s=>s.id===STLS.apkG);
  A.forEach(s=>{const e=document.getElementById('stlSv'+s.id);if(!e)return;const r=STLGR+STLGO+(s.j-1)*10,p=stlGxy(s.th,r),vis=Math.abs(s.th)<12;e.setAttribute('cx',vis?p[0]:-20);e.setAttribute('cy',vis?p[1]:-20);
    e.setAttribute('class','stlsat'+(s===srv||s===sg?' srv':''));});
  const T=stlGxy(G.tT,STLGR),Gw=stlGxy(G.tG,STLGR),set=(id,d)=>{const e=document.getElementById(id);if(e)e.setAttribute('d',d);};
  if(srv){const r=STLGR+STLGO+(srv.j-1)*10,p=stlGxy(srv.th,r),th=stlTheta(G.h,G.emin),a=stlGxy(srv.th-th,STLGR),b=stlGxy(srv.th+th,STLGR);
    set('stlBmT',`M${T[0]} ${T[1]-10} L${p[0]} ${p[1]}`);set('stlFoot',`M${p[0]} ${p[1]} L${a[0]} ${a[1]} L${b[0]} ${b[1]} Z`);
    if(sg){const r2=STLGR+STLGO+(sg.j-1)*10,p2=stlGxy(sg.th,r2);set('stlBmG',`M${p2[0]} ${p2[1]} L${Gw[0]} ${Gw[1]-6}`);
      set('stlIsl',G.isl&&sg!==srv?`M${p[0]} ${p[1]} A${r} ${r} 0 0 1 ${p2[0]} ${p2[1]}`:'');}else{set('stlBmG','');set('stlIsl','');}}else{['stlBmT','stlBmG','stlIsl','stlFoot'].forEach(i=>set(i,''));}
  /* gói tin chạy trên chuỗi */
  const pu=(t*0.35)%1,pd=(t*0.35+0.5)%1,mv=(id,f,rev)=>{const e=document.getElementById(id);if(!e)return;const p=stlChainAt(rev?1-f:f);e.setAttribute('cx',p[0]+(rev?0:0));e.setAttribute('cy',p[1]+(rev?7:-7));};mv('stlPkU',pu,false);mv('stlPkD',pd,true);
  STLS.acc=(STLS.acc||0)+dt;if(STLS.acc<0.2&&dt>0)return;STLS.acc=0;
  const eT=srv?stlElTh(G.h,srv.th-G.tT):NaN,dT=srv?stlSlTh(G.h,srv.th-G.tT):NaN,eG=sg?stlElTh(G.h,sg.th-G.tG):NaN,dG=sg?stlSlTh(G.h,sg.th-G.tG):NaN,hops=STLS.apk.hops||0,
    isk=srv&&sg&&G.isl?Math.abs(sg.th-srv.th)*Math.PI/180*(STLRE+G.h):0,ow=(dT+dG+isk)/STLCK*1000,L=STLP.link,gnd=(L.gwkm+L.popkm)*0.01+2;
  stlSet('stlANow',`<div class="stlbig"><div><b>${nF(sw-(t%sw),1)} s</b><span>tới lần đổi vệ tinh kế tiếp (chu kỳ ${sw} s)</span></div><div><b>${isFinite(eT)?nF(eT,1)+'°':'—'}</b><span>góc ngẩng terminal → vệ tinh</span></div><div><b>${isFinite(dT)?nF(dT,0)+' km':'—'}</b><span>khoảng cách nghiêng lên</span></div><div><b>${isFinite(dG)?nF(dG,0)+' km':'—'}</b><span>vệ tinh → gateway${G.isl?' (sau '+hops+' chặng laser, '+nF(isk,0)+' km)':''}</span></div><div><b>${stlMs(ow)}</b><span>trễ lan truyền một chiều (vệ tinh)</span></div><div><b>${stlMs(2*ow+16+gnd)}</b><span>RTT ước tính trạm ↔ SeGW (không tải)</span></div></div>`);}
const STLADDR=[['UE','IP của UE (PDN/PDU)','10.x hoặc IPv6 của nhà mạng','PGW/SMF-UPF cấp; chỉ thấy trong GTP-U'],['eNB/gNB','IP S1/NG, X2/Xn, OAM (bên trong đường hầm)','IP nội bộ nhà mạng','Đi trong ESP, nhà cung cấp vệ tinh không thấy'],
 ['CSR / IPsec client','Địa chỉ ngoài WAN','100.64.0.0/10 (CGNAT) hoặc IPv6 nhà cung cấp; IP công khai tuỳ gói (cần đối chiếu)','Bị NAT ở PoP → bắt buộc NAT-T (UDP 4500), keepalive NAT-T (RFC 3948 gợi ý 20 s)'],
 ['PoP','IP công khai sau CGNAT','Dải của nhà cung cấp vệ tinh, có thể đổi khi đổi PoP','IP nguồn SeGW thấy có thể thay đổi → IKE phải chấp nhận định danh theo chứng thư, không theo IP; nên bật MOBIKE (RFC 4555) nếu hỗ trợ'],
 ['SeGW','IP công khai của nhà mạng','Cố định','ACL chỉ mở UDP 500/4500 và ESP; chống DoS'],['Tuỳ chọn','GRE/SD-WAN trong hoặc ngoài IPsec','—','Ghép nhiều terminal, chuyển đường viba ↔ vệ tinh, đo SLA từng đường']];
const STLCMP=[['Cáp quang','2–10 ms','1–100 Gbit/s','3–12 tháng (đào, kéo cáp)','Không','CAPEX cao theo km, OPEX thấp','Tốt nhất khi có tuyến'],
 ['Viba nhiều chặng','5–20 ms','0,4–10 Gbit/s','1–3 tháng (cột, giấy phép tần số)','Mưa ở băng cao (E-band)','CAPEX theo chặng, cần LOS','Dự phòng tốt cho vệ tinh'],
 ['Vệ tinh LEO kiểu Starlink','25–60 ms (trung vị giờ cao điểm ~25–40 ms)','DL ~100–300, UL ~10–40 Mbit/s mỗi terminal','1–2 tuần','Mưa Ku/Ka, che khuất, nghẽn beam','CAPEX thấp, phí thuê bao tháng','Trạm vùng sâu, đảo, khẩn cấp'],
 ['VSAT GEO (so sánh)','550–700 ms','Vài chục Mbit/s','Vài tuần','Mưa','Phí băng thông cao','Chỉ ghi để so sánh, không mô phỏng']];
STLR.arch={
 html(){const P=STLP.arch;return `<div class="panel"><h3>Chuỗi truyền dẫn toàn trình: trạm ${nE(stlCore().ran)} → vệ tinh LEO → lõi ${nE(stlCore().core)} (${nE(stlCore().t)})</h3>
   <div class="ctl">${stlSel('arch','path','Đường đi qua vệ tinh',[['bp','Bent-pipe: terminal → vệ tinh → gateway gần'],['isl','Qua liên kết laser giữa vệ tinh (gateway xa)']])}${stlSel('arch','bh','PoP → SeGW',[['inet','Qua Internet công cộng'],['priv','Kết nối riêng (L2/L3) tới nhà mạng']])}${stlSel('arch','spd','Tốc độ hoạt hình',[[1,'1× (thời gian thật)'],[5,'5×'],[20,'20×']])}</div>
   <div class="scroll"><div class="stlw">${stlChainSvg()}</div></div><div class="panel" id="stlANd" style="margin-top:8px">${stlNodeHtml()}</div>
   <p class="note">Bấm vào từng khối để xem vai trò, đóng góp trễ và nguồn số đo. Giao diện ${nE(stlCore().c)}, ${nE(stlCore().u)} đổi theo chế độ mạng đang chọn (5G SA → N2/N3 về AMF/UPF; 4G và NSA → S1 về MME, SGW/PGW). Chỉ xét truyền dẫn từ trạm về lõi; UE truy nhập thẳng vệ tinh (NTN) ở <button type="button" class="u3lnkbtn" data-stlgo="bk:ntn">chuyên đề NTN</button>.</p></div>
  <div class="panel"><h3>Chòm vệ tinh chuyển động và đổi vệ tinh theo chu kỳ</h3><div class="row">${stlPlayBtn('arch','stlAPlay')}<button type="button" class="btn sm" data-stla="arch:rst">↺ Về 0</button></div>
   <div class="scroll"><div class="stlw">${stlSideSvg()}</div></div><div id="stlANow"></div>
   <p class="note">Vệ tinh chạy quanh Trái Đất khoảng ${nF(stlPeriod(STLP.link.h)/60,1)} phút một vòng ở ${STLP.link.h} km (tính theo định luật Kepler). Terminal chỉ dùng vệ tinh có góc ngẩng ≥ ${STLP.link.emin}° (vùng phủ màu cam). Mạng vệ tinh cấu hình lại liên kết theo chu kỳ đồng bộ toàn cầu khoảng 15 s (đo thực nghiệm), mỗi lần đổi có thể làm trễ nhảy bậc và mất vài gói. Bent-pipe cần một vệ tinh thấy được cả terminal và gateway; nếu gateway xa thì đi qua liên kết laser, trễ tăng thêm khoảng 3,3 ms mỗi 1 000 km.</p></div>
  <div class="panel"><h3>Các lớp địa chỉ và vì sao cần IPsec NAT-T</h3><div class="scroll"><table class="ndtb"><thead><tr><th>Điểm</th><th>Lớp địa chỉ</th><th>Ví dụ</th><th>Ghi chú vận hành</th></tr></thead><tbody>${STLADDR.map(r=>`<tr>${r.map(x=>`<td>${nE(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
   <p class="note">Đường vệ tinh là mạng không tin cậy, nên S1/NG, X2/Xn và OAM phải đi trong IPsec tới SeGW (TS 33.210 NDS/IP; TS 33.401 §11 và TS 33.501 §9.2–9.3). Vì trạm nằm sau CGNAT, IKEv2 phát hiện NAT và chuyển ESP vào UDP 4500 (RFC 3948). Chi tiết IKEv2, chứng thư CMPv2, SeGW: <button type="button" class="u3lnkbtn" data-scgo="sc:tnl">thẻ Bảo mật · IPsec, SeGW</button>.</p></div>
  <div class="panel"><h3>So sánh với cáp quang, viba và GEO</h3><div class="scroll"><table class="ndtb"><thead><tr><th>Phương án</th><th>RTT điển hình</th><th>Dung lượng</th><th>Triển khai</th><th>Thời tiết</th><th>Chi phí</th><th>Dùng khi</th></tr></thead><tbody>${STLCMP.map(r=>`<tr>${r.map((x,i)=>`<td>${i?nE(x):'<b>'+nE(x)+'</b>'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
   <p class="note">Nguồn: độ cao, kế hoạch hạ quỹ đạo từ ~550 km xuống ~480 km trong năm 2026 và băng tần theo tin công bố; trễ trung vị giờ cao điểm 25,7 ms (Mỹ, 2025) theo báo cáo mạng của nhà cung cấp; chu kỳ cấu hình lại 15 s và trễ bent-pipe 36–48 ms theo nghiên cứu đo đạc (xem mục 6). Giá trị ở Việt Nam phụ thuộc gateway/PoP gần nhất: cần đo thực tế.</p></div>`;},
 after(){STLS.ak=-1;stlArchTick(0);},
 tick(dt){stlArchTick(dt);},
 upd(k){if(k==='path'||k==='bh'){STLS.ak=-1;renderLeo();}},
 act(a){const [x,k]=a.split(':');if(x==='node'&&STLAN[k]){STLS.an=k;stlSet('stlANd',stlNodeHtml());document.querySelectorAll('#t-leo .stln').forEach(g=>g.classList.toggle('on',g.dataset.stla==='arch:node:'+k));}
  else if(x==='play')stlPlayTog('stlAPlay');else if(x==='rst'){STLS.at=0;STLS.ak=-1;stlArchTick(0);}}
};

/* ---------- Mục 2: Kênh vệ tinh theo thời gian ---------- */
const STLPW=680,STLPL=44;
function stlWedge(cx,cy,r1,r2,a1,a2){const p=(r,a)=>[cx+r*Math.sin(a*Math.PI/180),cy-r*Math.cos(a*Math.PI/180)],A=p(r2,a1),B=p(r2,a2),C=p(r1,a2),D=p(r1,a1);
  return `M${A[0].toFixed(1)} ${A[1].toFixed(1)} A${r2} ${r2} 0 0 1 ${B[0].toFixed(1)} ${B[1].toFixed(1)} L${C[0].toFixed(1)} ${C[1].toFixed(1)} A${r1} ${r1} 0 0 0 ${D[0].toFixed(1)} ${D[1].toFixed(1)} Z`;}
function stlSkySvg(){const P=STLP.link,c=120,R=100,rr=e=>(90-e)/90*R;let s=`<circle cx="${c}" cy="${c}" r="${R}" class="stlring"/>`;
  [30,60].forEach(e=>{s+=`<circle cx="${c}" cy="${c}" r="${rr(e)}" class="stlring"/><text x="${c+3}" y="${c-rr(e)+11}" class="stlmo">${e}°</text>`;});
  s+=`<circle cx="${c}" cy="${c}" r="${rr(P.emin)}" class="stlring" style="stroke:var(--warn);stroke-dasharray:4 3"/><text x="${c+3}" y="${c+rr(P.emin)-3}" class="stlmo" style="fill:var(--warn)">ε min ${P.emin}°</text>`;
  P.obs.forEach((o,i)=>{if(o>0)s+=`<path d="${stlWedge(c,c,rr(o),R,i*45+1,(i+1)*45-1)}" class="stlobs" data-stla="link:obs:${i}"/>`;s+=`<path d="${stlWedge(c,c,o>0?2:2,o>0?rr(o):R,i*45+1,(i+1)*45-1)}" class="stlobs0" data-stla="link:obs:${i}" tabindex="0" role="button" aria-label="Hướng ${['Bắc','Đông Bắc','Đông','Đông Nam','Nam','Tây Nam','Tây','Tây Bắc'][i]}, vật cản ${o}°"/>`;});
  ['B','Đ','N','T'].forEach((t,i)=>{const a=i*90*Math.PI/180;s+=`<text x="${c+(R+10)*Math.sin(a)}" y="${c-(R+10)*Math.cos(a)+4}" class="stlsm" text-anchor="middle">${t}</text>`;});
  s+=`<line id="stlSkL" x1="${c}" y1="${c}" x2="${c}" y2="${c}" class="stlbeam"/>`;for(let j=0;j<16;j++)s+=`<circle id="stlSk${j}" r="4" cx="-20" cy="-20" class="stlsat"/>`;
  return `<svg viewBox="0 0 240 240" class="u3svg stlsvg" style="max-width:300px;margin:auto" role="img" aria-label="Bầu trời nhìn từ terminal, vật cản và vệ tinh">${s}</svg>`;}
function stlWinPlots(){const o=STLS.win,P=STLP.link,X=[],rt=[],dl=[],ul=[],ls=[];if(!o)return'';
  for(let i=0;i<o.n;i++){const t=i*o.dt;rt.push(o.out[i]?null:[t,o.rtt[i]]);dl.push([t,o.dl[i]]);ul.push([t,o.ul[i]]);ls.push([t,o.loss[i]]);}
  const mk=o.sw.map((t,j)=>[t,j?'':'đổi vệ tinh','var(--muted)']),bands=[];let b0=-1;for(let i=0;i<=o.n;i++){const v=i<o.n&&o.out[i];if(v&&b0<0)b0=i;if(!v&&b0>=0){bands.push([b0*o.dt,i*o.dt,'#E5484D',.25]);b0=-1;}}
  const ymax=Math.max(80,Math.ceil((stlQ(rt.filter(Boolean).map(x=>x[1]),99)||80)/20)*20+20),dmax=Math.max(50,Math.ceil(STLTERM[P.term].dl/50)*50);
  const base={w:STLPW,h:170,pl:STLPL,x0:0,x1:120,xt:[0,15,30,45,60,75,90,105,120],xf:v=>v+' s',marks:mk,bands,cur:STLS.lt};
  return `<div class="scroll"><div class="stlwn" id="stlP1">${nPlot(Object.assign({},base,{y0:0,y1:ymax,yt:[0,ymax/4,ymax/2,ymax*3/4,ymax],ylab:'RTT (ms)',series:[{pts:rt,c:'var(--warn)',w:1.4}],aria:'RTT 120 s'}))}</div></div>
   <div class="scroll"><div class="stlwn" id="stlP2">${nPlot(Object.assign({},base,{y0:0,y1:dmax,yt:[0,dmax/2,dmax],ylab:'Mbit/s',series:[{pts:dl,c:'var(--acc)',w:1.3},{pts:ul,c:'var(--nr)',w:1.3}],aria:'Thông lượng 120 s'}))}</div></div>${uLeg([['Tải xuống (lõi → trạm)','var(--acc)'],['Tải lên (trạm → lõi)','var(--nr)'],['Gián đoạn','#E5484D']])}
   <div class="scroll"><div class="stlwn" id="stlP3">${nPlot(Object.assign({},base,{h:130,y0:0,y1:20,yt:[0,10,20],ylab:'Mất gói %',series:[{pts:ls,c:'#E5484D',w:1.2}],aria:'Mất gói 120 s'}))}</div></div>`;}
function stlStTbl(st,lbl){return `<div class="stlbig"><div><b>${stlMs(st.p50)}</b><span>RTT p50 ${lbl}</span></div><div><b>${stlMs(st.p95)}</b><span>RTT p95</span></div><div><b>${stlMs(st.p99)}</b><span>RTT p99</span></div><div><b>${stlMs(st.jit)}</b><span>jitter (|ΔRTT| trung bình)</span></div><div><b>${stlPct(st.loss)}</b><span>mất gói trung bình</span></div><div><b>${stlS(st.outMin*60)}</b><span>tổng gián đoạn (${st.ev} lần, dài nhất ${stlS(st.mx)})</span></div><div><b>${stlPct(st.avail,3)}</b><span>sẵn sàng</span></div><div><b>${stlMb(st.dl50)} / ${stlMb(st.ul50)}</b><span>thông lượng p50 xuống / lên</span></div></div>`;}
function stlDayPlots(){const A=stlDayRun(),P=STLP.link,ym=Math.max(80,Math.ceil((stlQ(A.rx.filter(Boolean).map(x=>x[1]),99)||80)/20)*20+20),xt=[0,3,6,9,12,15,18,21,24];
  const base={w:STLPW,h:160,pl:STLPL,x0:0,x1:24,xt,xf:v=>v+' h',bands:[[P.wh,P.wh+120/3600,'var(--warn)',.35]]};
  return `<div class="scroll"><div class="stlwn">${nPlot(Object.assign({},base,{y0:0,y1:ym,yt:[0,ym/2,ym],ylab:'RTT (ms)',series:[{pts:A.rx,c:'#E5484D',w:1},{pts:A.rt,c:'var(--warn)',w:1.4}],aria:'RTT 24 giờ'}))}</div></div>${uLeg([['RTT p50 theo phút','var(--warn)'],['RTT p95 theo phút','#E5484D']])}
   <div class="scroll"><div class="stlwn">${nPlot(Object.assign({},base,{y0:0,y1:Math.max(50,STLTERM[P.term].dl),yt:[0,STLTERM[P.term].dl/2,STLTERM[P.term].dl],ylab:'Mbit/s',series:[{pts:A.dl,c:'var(--acc)',w:1.2},{pts:A.ul,c:'var(--nr)',w:1.2}],aria:'Thông lượng 24 giờ'}))}</div></div>
   <div class="scroll"><div class="stlwn">${nPlot(Object.assign({},base,{h:130,y0:0,y1:60,yt:[0,30,60],ylab:'s gián đoạn/phút',series:[{pts:A.out,c:'#E5484D',w:1.2},{pts:A.rain.map(x=>[x[0],Math.min(60,x[1]/3)]),c:'var(--lte)',w:1,dash:'3 3'}],aria:'Gián đoạn 24 giờ'}))}</div></div>${uLeg([['Giây gián đoạn mỗi phút','#E5484D'],['Cường độ mưa (mm/h ÷ 3)','var(--lte)']])}`;}
function stlLinkNow(){const o=STLS.win;if(!o)return;const i=Math.min(o.n-1,Math.max(0,Math.floor(STLS.lt/o.dt))),P=STLP.link;
  stlSet('stlLNow',`<dl class="kv">${stlKv('Thời điểm',`${Math.floor(P.wh)}:${String(Math.round((P.wh%1)*60)).padStart(2,'0')} + ${nF(STLS.lt,1)} s`)}${stlKv('Trạng thái',o.out[i]?'<b class="stlno">gián đoạn</b> (vệ tinh bị che hoặc tín hiệu dưới ngưỡng)':'<b class="stlok">kết nối</b>')}${stlKv('Góc ngẩng vệ tinh phục vụ',nF(o.el[i],1)+'° · nghiêng '+nF(stlSlant(P.h,Math.max(1,o.el[i])),0)+' km')}${stlKv('SNR · điều chế (minh hoạ)',nF(o.snr[i],1)+' dB · '+o.mc[i])}${stlKv('Mưa tại trạm',nF(o.rain[i],0)+' mm/h → suy hao Ku '+nF(stlRainA(o.rain[i],'ku_dl',Math.max(5,o.el[i]),5),1)+' dB')}${stlKv('RTT · mất gói',o.out[i]?'—':stlMs(o.rtt[i])+' · '+stlPct(o.loss[i],1))}${stlKv('Xuống / lên',stlMb(o.dl[i])+' / '+stlMb(o.ul[i]))}</dl>`);}
function stlSkyUpd(){const o=STLS.win;if(!o||!o.slots.length)return;let k=0;for(let j=0;j<o.slots.length;j++)if(o.slots[j].t<=STLS.lt)k=j;const sl=o.slots[k],ts=STLS.lt-sl.t,c=120,R=100,P=STLP.link;
  for(let j=0;j<16;j++){const e=document.getElementById('stlSk'+j);if(!e)continue;const s=sl.s.c[j];if(!s){e.setAttribute('cx',-20);continue;}const p=stlPos(s,ts),r=(90-p.el)/90*R;
    if(p.el<0){e.setAttribute('cx',-20);continue;}const x=c+r*Math.sin(p.az*Math.PI/180),y=c-r*Math.cos(p.az*Math.PI/180);e.setAttribute('cx',x);e.setAttribute('cy',y);
    const ob=p.el<P.emin||stlObs(P,p);e.setAttribute('class','stlsat'+(j===sl.s.ch?' srv':ob?' obs':''));if(j===sl.s.ch){const L=document.getElementById('stlSkL');if(L){L.setAttribute('x2',x);L.setAttribute('y2',y);L.style.stroke=ob?'#E5484D':'';}}}}
function stlCurMove(){const x=STLPL+STLS.lt/120*(STLPW-STLPL-10);['stlP1','stlP2','stlP3'].forEach(id=>{const l=document.querySelector('#'+id+' .u3cur');if(l){l.setAttribute('x1',x);l.setAttribute('x2',x);}});}
STLR.link={
 html(){const P=STLP.link;stlLinkRun();const W=STLS.winSt,obsP=stlSkyObsPct(P);
  return `<div class="panel"><h3>Hình học: độ cao, góc ngẩng, khoảng cách nghiêng và trễ</h3>
   <div class="ctl">${stlSl('link','h','Độ cao vệ tinh',480,570,10,v=>v+' km','Lớp ~550 km đang hạ xuống ~480 km trong năm 2026')}${stlSel('link','emin','Góc ngẩng tối thiểu',[[25,'25°'],[20,'20°'],[10,'10°']],'25° theo cấp phép ban đầu; từ 2026 được phép thấp hơn ở quỹ đạo thấp hơn')}${stlSl('link','sw','Chu kỳ cấu hình lại',5,30,5,v=>v+' s','đo thực nghiệm ≈ 15 s')}${stlSl('link','isl','Số chặng laser giữa vệ tinh',0,6,1,v=>v?v+' chặng':'bent-pipe')}${stlSl('link','gwkm','Gateway → PoP',20,1500,20,v=>nF(v,0)+' km cáp')}${stlSl('link','popkm','PoP → SeGW nhà mạng',10,3000,10,v=>nF(v,0)+' km')}</div>
   <div id="stlGeoT">${stlGeoTbl()}</div></div>
  <div class="panel"><h3>Mô phỏng theo thời gian: cửa sổ 120 s</h3>
   <div class="ctl">${stlSel('link','term','Terminal',[['std','Tiêu chuẩn (75–100 W)'],['mini','Mini (25–40 W)']])}${stlSl('link','nc','Số vệ tinh ứng viên trên bầu trời',3,15,1,v=>v+' vệ tinh')}${stlSl('link','wh','Giờ bắt đầu cửa sổ',0,23.5,0.5,v=>`${Math.floor(v)}:${v%1?'30':'00'}`)}${stlSl('link','load','Tải beam giờ cao điểm',10,98,1,v=>v+' %','tỉ lệ sử dụng tế bào phủ của vệ tinh')}${stlSl('link','rain','Mưa đỉnh',0,150,5,v=>v+' mm/h')}${stlSl('link','rh','Giờ có mưa',0,23,1,v=>v+' h')}${stlSl('link','rdur','Thời gian mưa',10,180,10,v=>v+' phút')}${stlChk('link','rgw','Mưa cả ở gateway (Ka)')}${stlSel('link','spd','Tốc độ phát',[[1,'1×'],[4,'4×'],[10,'10×']])}</div>
   <div class="row">${stlPlayBtn('link','stlLPlay')}<button type="button" class="btn sm" data-stla="link:seed">🎲 Lần chạy khác</button><button type="button" class="btn sm" data-stla="link:obsclr">Xoá vật cản</button><button type="button" class="btn sm" data-stla="link:obsdemo">Vật cản mẫu (cây phía Tây, nhà phía Nam)</button></div>
   <div class="stltwo"><div>${stlSkySvg()}<p class="note">Bấm vào từng hướng (8 hướng × 45°) để đổi độ cao vật cản 0 → 15° → 30° → 45° → 60°. Che ${nF(obsP,1)} % bầu trời khả dụng. Chấm cam là vệ tinh phục vụ, chấm đỏ là vệ tinh bị che.</p></div><div id="stlLNow"></div></div>
   ${stlWinPlots()}<div id="stlWSt">${stlStTbl(W,'(120 s)')}</div>
   <p class="note">Mô hình: mỗi chu kỳ ${P.sw} s, mạng chọn vệ tinh không bị che có góc ngẩng cao nhất; RTT = lan truyền 2 chặng × 2 + xử lý, lập lịch ~16 ms (cần đối chiếu) + hàng đợi theo tải beam + cáp gateway → PoP → SeGW + gai khi đổi vệ tinh. Suy hao mưa theo ITU-R P.618 rút gọn (hệ số P.838-3 gần đúng, độ cao mưa 5 km); SNR → điều chế theo bảng kiểu DVB-S2 chỉ để minh hoạ, giao diện vô tuyến thật không công bố.</p></div>
  <div class="panel"><h3>Mô phỏng 24 giờ (mỗi giây một mẫu)</h3><div id="stlDay">${stlDayPlots()}</div><div id="stlDSt">${stlStTbl(stlDaySt(),'(24 h)')}</div>
   <p class="note">Tải beam theo giờ trong ngày (cao điểm 19–22 h) làm RTT p95 và thông lượng dao động; mưa làm SNR giảm, hạ điều chế rồi gián đoạn; vật cản gây gián đoạn ngắn lặp lại. Dải cam trên trục thời gian là cửa sổ 120 s ở trên.</p></div>`;},
 after(){stlSkyUpd();stlLinkNow();},
 tick(dt){const P=STLP.link;if(!STLS.pause){STLS.lt+=dt*P.spd;if(STLS.lt>=120)STLS.lt=0;}stlCurMove();stlSkyUpd();STLS.acc=(STLS.acc||0)+dt;if(STLS.acc>=0.15||dt===0){STLS.acc=0;stlLinkNow();}},
 upd(k){if(k==='spd')return;if(['h','emin','sw','isl','gwkm','popkm'].includes(k))stlSet('stlGeoT',stlGeoTbl());stlLinkRun();renderLeo();},
 act(a){const [x,i]=a.split(':'),P=STLP.link;if(x==='play')stlPlayTog('stlLPlay');else if(x==='seed'){P.seed=(P.seed%997)+1;stlLinkRun(true);renderLeo();}
  else if(x==='obs'){const j=+i;P.obs[j]=P.obs[j]>=60?0:P.obs[j]+15;stlLinkRun();renderLeo();}else if(x==='obsclr'){P.obs=[0,0,0,0,0,0,0,0];stlLinkRun();renderLeo();}
  else if(x==='obsdemo'){P.obs=[0,0,0,0,30,15,45,45];stlLinkRun();renderLeo();}}
};
function stlGeoTbl(){const P=STLP.link,rows=[90,60,45,P.emin].filter((v,i,a)=>a.indexOf(v)===i).map(e=>{const d=stlSlant(P.h,e),ow=2*d/STLCK*1000;return [e+'°',nF(d,0)+' km',nF(stlTheta(P.h,e)*Math.PI/180*STLRE,0)+' km',stlMs(d/STLCK*1000),stlMs(ow+P.isl*1800/STLCK*1000),stlMs(2*(ow+P.isl*1800/STLCK*1000)+16+(P.gwkm+P.popkm)*0.01+2)];});
  return `<div class="scroll"><table class="ndtb"><thead><tr><th>Góc ngẩng (cả 2 chặng)</th><th>Khoảng cách nghiêng</th><th>Bán kính vùng phủ mặt đất</th><th>Một chặng</th><th>Một chiều terminal → gateway</th><th>RTT trạm ↔ SeGW không tải</th></tr></thead><tbody>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="note">Chu kỳ quỹ đạo ở ${P.h} km: ${nF(stlPeriod(P.h)/60,1)} phút; tốc độ vệ tinh ${nF(Math.sqrt(STLMU/(STLRE+P.h)),2)} km/s. Một chặng laser giả định 1 800 km (cần đối chiếu). Đo thực tế trên đường bent-pipe cho RTT tối thiểu 36–48 ms, trung vị khoảng 40 ms ở hầu hết các nước khảo sát.</p>`;}

/* ---------- Mục 3: Mạng di động chạy trên đường vệ tinh ---------- */
function stlRtt(){try{const st=stlDaySt();return isFinite(st.p50)?st.p50/1000:0.045;}catch(e){return 0.045;}}
function stlDet(){const P=STLP.ran,rtt=stlRtt(),r0=nC(rtt+4*0.01,P.rtomin,P.rtomax),R=k=>Math.min(P.rtomax,r0*Math.pow(2,k));
  let s=P.hb*0.5,tp=NaN,ta=NaN;for(let k=0;k<=P.amr;k++){const to=s+R(k);if(k===P.pmr&&!isFinite(tp))tp=to;if(k===P.amr)ta=to;s=to+P.hb;}
  let da=0;for(let k=0;k<=P.amr;k++)da+=R(k);
  let dd=P.dpd*0.5;for(let k=0;k<P.dpdr;k++)dd+=Math.min(10,Math.pow(2,k));
  const gt=P.echo*0.5+P.t3*(P.n3+1);return {r0,tp,ta,da,dd,gt,rtt};}
function stlRanEv(){const P=STLP.ran,D=stlDet(),C=stlCore(),out=P.out,ev=[];const rt=D.rtt;
  ev.push({t:0,p:'LINK',m:'Terminal mất kết nối vệ tinh (che khuất, mưa, sự cố)',a:'đường vệ tinh',d:`Gián đoạn dài ${stlS(out)}.`});
  if(out>0.2)ev.push({t:Math.min(out,0.2),p:'GTP',m:'Gói GTP-U trong ESP bị mất, TCP người dùng bắt đầu truyền lại',a:'S1-U/N3',d:'Không có cảnh báo ngay; bộ đếm mất gói TWAMP tăng.'});
  const saDead=out>=D.dd,tIke=saDead?out+5+2*rt+1:out,eff=saDead?tIke:out,assocDead=eff>=D.ta,gtpDead=out>=D.gt,voDrop=out>=P.rtp||assocDead,pathDown=eff>=D.tp;
  if(saDead)ev.push({t:D.dd,p:'IKE',m:'DPD không trả lời → xoá IKE SA và IPsec SA',a:'CSR ↔ SeGW',d:`Sau ${P.dpdr} lần thử (khoảng ${stlS(D.dd)}). Cảnh báo IPsec tunnel down ở SeGW và trạm.`});
  if(pathDown)ev.push({t:D.tp,p:'SCTP',m:'Đường SCTP bị đánh dấu không hoạt động (Path.Max.Retrans)',a:C.ap,d:'Một đường duy nhất: chưa đóng association, nhưng không gửi được báo hiệu.'});
  if(gtpDead)ev.push({t:D.gt,p:'GTP',m:'GTP-U path failure (không nhận Echo Response)',a:C.u,d:`Echo mỗi ${P.echo} s, T3 ${P.t3} s × ${P.n3}. Một số lõi/trạm giải phóng bearer khi path failure (cần đối chiếu).`});
  if(P.rtp<=out&&!assocDead)ev.push({t:P.rtp,p:'SIP',m:'Hết giờ RTP/RTCP → giải phóng cuộc gọi VoLTE',a:'P-CSCF/IMS',d:'SIP BYE với lý do RTP timeout; KPI rớt cuộc gọi VoLTE tăng.'});
  if(assocDead){ev.push({t:D.ta,p:'SCTP',m:'Association.Max.Retrans vượt ngưỡng → ABORT association',a:C.ap,d:`Phát hiện sau ${stlS(D.ta)} (heartbeat ${P.hb} s, RTO ${nF(D.r0,2)}→${P.rtomax} s, ${P.amr} lần thử).`});
    ev.push({t:D.ta+0.1,p:C.ap,m:`${C.c} link down → cell ngừng phục vụ (out of service)`,a:C.ran,d:'Toàn bộ UE mất dịch vụ, rớt E-RAB/QoS flow, cuộc gọi; UE chọn lại cell khác nếu có.'});}
  ev.push({t:out,p:'LINK',m:'Terminal kết nối lại vệ tinh',a:'đường vệ tinh',d:'IP ngoài có thể đổi (CGNAT) → ánh xạ NAT cũ mất.'});
  if(saDead)ev.push({t:tIke,p:'IKE',m:'IKE_SA_INIT + IKE_AUTH thành công, dựng lại IPsec SA (NAT-T)',a:'CSR ↔ SeGW',d:'Chờ bộ hẹn giờ thử lại phía trạm (~5 s, cần đối chiếu) + 2 RTT + kiểm chứng thư.'});
  let tUp=eff;if(assocDead){const t1=eff+5,t2=t1+2*rt,t3=t2+rt;ev.push({t:t2,p:'SCTP',m:'INIT / INIT-ACK / COOKIE-ECHO / COOKIE-ACK',a:C.ap,d:'Trạm thử lại kết nối SCTP theo chu kỳ (giả định 10 s, trung bình chờ 5 s).'});
    ev.push({t:t3,p:C.ap,m:C.ap==='NGAP'?'NG Setup Request / Response':'S1 Setup Request / Response',a:C.cn,d:'Cell phát sóng lại; UE bắt đầu đăng ký/attach lại.'});tUp=t3;}
  else if(out>0.2)ev.push({t:eff+rt,p:'SCTP',m:'HEARTBEAT-ACK trở lại, association giữ nguyên',a:C.ap,d:'Bản tin báo hiệu đang chờ được truyền lại; UE gần như không bị rớt.'});
  ev.sort((a,b)=>a.t-b.t);return {ev,D,saDead,assocDead,gtpDead,voDrop,tUp,tIke,eff};}
function stlTlSvg(R){const P=STLP.ran,C=stlCore(),T=Math.max(P.out+10,R.tUp+10,(R.assocDead?R.D.ta:0)+5),W=700,L=118,iw=W-L-10,X=t=>L+t/T*iw,rows=[];
  const seg=(seq)=>seq.filter(s=>s[1]>s[0]).map(s=>`<rect x="${X(s[0]).toFixed(1)}" y="0" width="${Math.max(1,X(s[1])-X(s[0])).toFixed(1)}" height="14" rx="2" style="fill:${s[2]}"/>`).join('');
  const G='var(--up)',O='var(--warn)',Rr='#E5484D',out=P.out;
  rows.push(['Đường vệ tinh',[[0,out,Rr],[out,T,G]]]);
  rows.push(['IPsec SA',R.saDead?[[0,R.D.dd,O],[R.D.dd,R.tIke,Rr],[R.tIke,T,G]]:[[0,out,O],[out,T,G]]]);
  rows.push(['SCTP '+C.ap,R.assocDead?[[0,R.D.ta,O],[R.D.ta,R.tUp,Rr],[R.tUp,T,G]]:[[0,R.eff,O],[R.eff,T,G]]]);
  rows.push(['GTP-U path',R.gtpDead?[[0,R.D.gt,O],[R.D.gt,Math.max(R.D.gt,R.eff),Rr],[Math.max(R.D.gt,R.eff),T,G]]:[[0,R.eff,O],[R.eff,T,G]]]);
  rows.push(['Cell',R.assocDead?[[0,R.D.ta,O],[R.D.ta,R.tUp,Rr],[R.tUp,T,G]]:[[0,R.eff,O],[R.eff,T,G]]]);
  rows.push(['Cuộc gọi VoLTE',R.voDrop?[[0,Math.min(R.assocDead?R.D.ta:P.rtp,P.rtp),O],[Math.min(R.assocDead?R.D.ta:P.rtp,P.rtp),T,Rr]]:[[0,R.eff,O],[R.eff,T,G]]]);
  rows.push(['Dữ liệu (TCP)',R.assocDead?[[0,R.D.ta,O],[R.D.ta,R.tUp+3,Rr],[R.tUp+3,T,G]]:[[0,R.eff,O],[R.eff,T,G]]]);
  let s='';rows.forEach((r,i)=>{s+=`<text x="4" y="${24+i*22}" class="stlsm">${nE(r[0])}</text><g transform="translate(0 ${13+i*22})">${seg(r[1])}</g>`;});
  const step=T>300?60:T>120?30:T>40?10:5;for(let t=0;t<=T;t+=step)s+=`<text x="${X(t)}" y="${24+rows.length*22}" class="stlmo" text-anchor="middle">${t}s</text>`;
  return `<svg viewBox="0 0 ${W} ${36+rows.length*22}" class="u3svg stlsvg" role="img" aria-label="Dòng thời gian khi gián đoạn">${s}</svg>${uLeg([['Bình thường','var(--up)'],['Đang chờ phát hiện / mất gói','var(--warn)'],['Ngừng','#E5484D']])}`;}
function stlRanTl(){const R=stlRanEv(),D=R.D,P=STLP.ran;
  return `<div class="stlbig"><div><b>${stlS(D.ta)}</b><span>SCTP phát hiện khi rỗi (heartbeat)</span></div><div><b>${stlS(D.da)}</b><span>SCTP phát hiện khi đang có báo hiệu</span></div><div><b>${stlS(D.dd)}</b><span>IPsec DPD xoá SA</span></div><div><b>${stlS(D.gt)}</b><span>GTP-U path failure</span></div><div><b class="${R.assocDead?'stlno':'stlok'}">${R.assocDead?'Cell ngừng '+stlS(R.tUp-D.ta):'Sống sót'}</b><span>với gián đoạn ${stlS(P.out)}</span></div></div>
   <div class="scroll"><div class="stlwn">${stlTlSvg(R)}</div></div>${nLog(R.ev,-1)}
   <p class="note">Ngưỡng sống sót: gián đoạn ngắn hơn thời gian phát hiện của SCTP (và IPsec) thì association giữ nguyên, chỉ mất gói và tiếng ngắt. Đổi vệ tinh mỗi 15 s chỉ gây gián đoạn vài trăm ms nên không làm rớt S1/NG nếu timer hợp lý. Timer quá ngắn (RTO.max nhỏ, ít lần thử) làm S1/NG «chập chờn» theo từng lần che khuất; quá dài thì cell «treo» khi đường đã chết. RTT dùng để tính RTO lấy từ mô phỏng mục 2: ${stlMs(D.rtt*1000)}.</p>`;}
const STLCOD={wb:['AMR-WB 12,65',33],wb2:['AMR-WB 23,85',61],evs:['EVS 13,2',35],nb:['AMR 12,2',32]};
function stlOvh(pay){const P=STLP.ran,ui=P.ipv===6?40:20,oi=P.ipo===6?40:20,gtp=8+(P.n3x&&S.mode==='SA'?8:0),inner=pay+gtp+8+oi,iv=P.esp==='gcm'?8:16,icv=P.esp==='gcm'?16:12,blk=P.esp==='gcm'?4:16;
  const pl=inner+2,pad=(blk-(pl%blk))%blk,esp=8+iv+inner+pad+2+icv,tot=esp+(P.natt?8:0)+oi;return {ui,oi,gtp,inner,iv,icv,pad,esp,tot,h:[['IP của UE',ui],['GTP-U'+(gtp>8?' + PDU container':''),gtp],['UDP 2152',8],['IP '+(P.ipo===6?'v6':'v4')+' trạm',oi],['ESP SPI+Seq',8],['ESP IV',iv],['Đệm + trailer',pad+2],['ICV',icv],['NAT-T UDP 4500',P.natt?8:0],['IP ngoài',oi]]};}
function stlOvhHtml(){const P=STLP.ran,o=stlOvh(P.pay);let mx=P.pay;while(mx>200&&stlOvh(mx).tot>P.mtu)mx--;const mss=mx-o.ui-20,cod=STLCOD[P.codec],vp=cod[1]+12+8+o.ui,vo=stlOvh(vp);
  const cols=['#5A6B85','#1E8E7E','#2F6FB5','#7B6CE0','#B5651D','#C98A1E','#8A5A2B','#E5484D','#3D8B37','#36597A'],tb=o.tot-P.pay+o.ui,bar=[['Dữ liệu UE',P.pay-o.ui,'var(--acc)']].concat(o.h.slice(1).filter(x=>x[1]>0).map((x,i)=>[x[0],x[1],cols[i+1]]));
  return `<div class="stlbar">${bar.map(b=>`<i style="width:${(b[1]/o.tot*100).toFixed(2)}%;background:${b[2]}" title="${nE(b[0])}: ${b[1]} B">${b[1]/o.tot>0.08?nE(b[0]):''}</i>`).join('')}</div>
   <div class="scroll"><table class="ndtb"><thead><tr><th>Lớp</th><th>Byte</th></tr></thead><tbody>${o.h.map(x=>`<tr><td>${nE(x[0])}</td><td>${x[1]}</td></tr>`).join('')}<tr><td><b>Gói IP trên đường vệ tinh</b></td><td><b class="${o.tot>P.mtu?'stlno':'stlok'}">${o.tot} B ${o.tot>P.mtu?'> MTU '+P.mtu+' → phân mảnh hoặc bị bỏ nếu DF':'≤ MTU '+P.mtu}</b></td></tr></tbody></table></div>
   <dl class="kv">${stlKv('Gói IP lớn nhất của UE không phân mảnh',`<b>${mx} B</b> (MTU UE/PDN nên đặt ≤ ${mx})`)}${stlKv('MSS clamping đề nghị cho TCP',`<b>${mss} B</b> (IPv${P.ipv} + TCP 20 B)`)}${stlKv('Overhead với gói '+P.pay+' B',nF(tb/o.tot*100,1)+' % ('+tb+' B)')}${stlKv('Một cuộc VoLTE '+cod[0]+' (50 gói/s, một chiều)',`${vp} B/gói UE → ${vo.tot} B trên vệ tinh → <b>${nF(vo.tot*8*50/1000,1)} kbit/s</b> (so với ${nF(vp*8*50/1000,1)} kbit/s nếu không IPsec)`)}</dl>
   <p class="note">S1-U/N3 không có nén tiêu đề (ROHC chỉ ở giao diện vô tuyến), nên thoại trên vệ tinh tốn gấp ~3 lần tốc độ mã hoá. Nếu MTU đường vệ tinh nhỏ hơn 1 500 B (cần đo bằng ping DF), phải giảm MTU PDN/APN hoặc kẹp MSS ở PGW/UPF và CSR; IPsec nên phân mảnh trước khi mã hoá (pre-fragmentation) để tránh SeGW phải ráp mảnh.</p>`;}
const STLOSC={tcxo:['TCXO',5e-9,1e-9],ocxo:['OCXO',5e-11,1e-10],rb:['Rubidium',5e-12,1e-11]};
function stlHoldHtml(){const P=STLP.ran,o=STLOSC[P.osc],a=o[2]/86400,te=t=>(o[1]*t+0.5*a*t*t)*1e6;let lim=0;for(let t=60;t<=86400*7;t+=60)if(te(t)>=1.5){lim=t;break;}
  const pts=[];for(let h=0;h<=72;h+=0.5)pts.push([h,Math.min(5,te(h*3600))]);
  return `<div class="scroll"><div class="stlwn">${nPlot({w:STLPW,h:150,pl:STLPL,x0:0,x1:72,y0:0,y1:5,xt:[0,12,24,36,48,60,72],xf:v=>v+' h',yt:[0,1.5,3,5],yd:1,ylab:'lệch thời gian µs',series:[{pts,c:'var(--acc)',w:1.6}],hl:[[1.5,'#E5484D','±1,5 µs (TDD)']],aria:'Holdover'})}</div></div>
   <p class="e2d">Mất GNSS với bộ dao động <b>${o[0]}</b>: giữ được trong ngưỡng ±1,5 µs khoảng <b>${lim?stlS(lim):'> 7 ngày'}</b>. Sau đó cell TDD (n41, n77, n78) phải tắt hoặc gây nhiễu chéo khung; FDD chỉ cần tần số (±50 ppb) nên chịu lâu hơn. Mô hình TE = y₀·t + ½·D·t² với y₀ = ${o[1].toExponential(0)}, lão hoá ${o[2].toExponential(0)}/ngày (minh hoạ, cần đối chiếu thông số thiết bị).</p>
   <p class="note">PTP (G.8275.1/.2) không đi qua đường vệ tinh được: trễ biến thiên hàng chục ms và bất đối xứng lên/xuống làm sai số thời gian lớn gấp nghìn lần ngưỡng. Vì vậy trạm dùng vệ tinh làm truyền dẫn bắt buộc có GNSS tại trạm (anten thông thoáng, chống sét) và bộ dao động holdover tốt. Đồng bộ mức vô tuyến, mất GNSS và nhiễu TDD: <button type="button" class="u3lnkbtn" data-rxgo="rx:tdd">thẻ Tối ưu vô tuyến</button>; PTP/SyncE trên truyền dẫn: <button type="button" class="u3lnkbtn" data-tab="tx">thẻ Truyền dẫn</button>.</p>`;}
function stlBudget(){const st=stlDaySt(),R=STLP.ran,bh=[st.p50,st.p95],fb=[5,8],th=Math.max(5,st.dl50||50);
  const rows=[['VoLTE/VoNR miệng-tai (một đầu ở trạm vệ tinh)',x=>95+x/2+40,'≤ 150 ms tốt, ≤ 275 chấp nhận (G.114)',v=>v<=150?2:v<=275?1:0],
   ['Thiết lập cuộc gọi VoLTE (~12 vòng báo hiệu qua backhaul)',x=>1500+12*x,'≤ 3 s (tham khảo)',v=>v<=3000?2:v<=5000?1:0],
   ['Trang web 2 MB (~15 RTT + truyền)',x=>15*(x+30)+2*8/th*1000,'≤ 3 s',v=>v<=3000?2:v<=6000?1:0],
   ['Bắt đầu phát video (3 RTT + đệm 2 s ở 5 Mbit/s)',x=>3*(x+30)+2*5/Math.max(5,th)*1000,'≤ 2 s',v=>v<=2000?2:v<=4000?1:0],
   ['Game trực tuyến (RTT tới máy chủ)',x=>x+30,'≤ 60 ms tốt, ≤ 100 chấp nhận',v=>v<=60?2:v<=100?1:0],
   ['URLLC (trễ một chiều mặt người dùng)',x=>x/2+1,'1–10 ms',v=>v<=10?2:0]];
  const cl=['stlno','stlmid','stlok'],tx=['Không đạt','Chấp nhận','Đạt'];
  return `<div class="scroll"><table class="ndtb"><thead><tr><th>Dịch vụ</th><th>Cáp quang</th><th>LEO p50 (${stlMs(bh[0])})</th><th>LEO p95 (${stlMs(bh[1])})</th><th>Mục tiêu</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${nE(r[0])}</td>${[fb[0],bh[0],bh[1]].map(x=>{const v=r[1](x),g=r[3](v);return `<td class="${cl[g]}">${nF(v,0)} ms · ${tx[g]}</td>`;}).join('')}<td>${nE(r[2])}</td></tr>`).join('')}</tbody></table></div>
   <p class="note">RTT backhaul lấy từ mô phỏng 24 h ở mục 2 (đổi tham số ở đó sẽ đổi bảng này). «+30 ms» là phần vô tuyến và Internet phía sau lõi; miệng-tai 95 ms gồm mã hoá, đóng gói, vô tuyến hai đầu, bộ đệm jitter ~40 ms. Số vòng báo hiệu là ước lượng.</p>`;}
/* phiên TCP và cuộc gọi VoLTE */
function stlTcp(env){const P=STLP.ran,o=STLS.win,rng=nRng(17+P.tsz),mss=1360,sz=P.tsz*1e6;let t=0,del=0,cw=10,ss=1e9,wmax=0,ep=0,pts=[[0,0]],cwp=[[0,10]],it=0;
  while(del<sz&&t<120&&it<20000){it++;let rtt,cap,loss;if(env==='leo'&&o){const i=Math.min(o.n-1,Math.floor((t%120)/o.dt));if(o.out[i]){t+=0.2;pts.push([t,del/1e6]);continue;}rtt=o.rtt[i]/1000;cap=Math.max(1,o.dl[i]);loss=o.loss[i]/100;}
    else{rtt=0.005+rng()*0.001;cap=P.cbw;loss=0.0001;}
    const bdp=cap*1e6/8*rtt/mss,send=Math.min(cw,bdp*1.5+8),pk=Math.max(1,Math.round(send)),lo=rng()<Math.min(1,loss*25);
    del+=Math.min(pk*mss,cap*1e6/8*rtt*1.02);t+=rtt*(send>bdp?send/bdp:1);
    if(lo){wmax=cw;cw=Math.max(2,cw*0.7);ss=cw;ep=t;}else if(cw<ss)cw*=2;else{const K=Math.cbrt(wmax*0.3/0.4),tt=t-ep;cw=Math.max(cw+1/cw,0.4*Math.pow(tt-K,3)+wmax);}
    cw=Math.min(cw,4*bdp+20);pts.push([t,Math.min(del,sz)/1e6]);cwp.push([t,cw]);}
  return {t:del>=sz?t:NaN,pts,cwp,thr:del*8/Math.max(t,0.01)/1e6};}
function stlTcpHtml(){stlLinkRun();const P=STLP.ran,a=stlTcp('fib'),b=stlTcp('leo'),T=Math.min(120,Math.max(5,(isFinite(b.t)?b.t:120)*1.1)),st=STLS.winSt;
  const bdpF=P.cbw*1e6/8*0.005/1000,bdpL=(st.dl50||100)*1e6/8*(st.p50||45)/1000/1000;
  return `<div class="scroll"><div class="stlwn">${nPlot({w:STLPW,h:170,pl:STLPL,x0:0,x1:T,y0:0,y1:P.tsz,xt:[0,T/4,T/2,3*T/4,T].map(x=>Math.round(x*10)/10),xf:v=>nF(v,1)+' s',yt:[0,P.tsz/2,P.tsz],ylab:'MB đã nhận',series:[{pts:a.pts,c:'var(--nr)',w:1.6},{pts:b.pts,c:'var(--warn)',w:1.6}],aria:'Tải tệp TCP'})}</div></div>${uLeg([['Cáp quang (RTT 5 ms, '+P.cbw+' Mbit/s)','var(--nr)'],['Vệ tinh LEO (chuỗi 120 s ở mục 2)','var(--warn)']])}
   <dl class="kv">${stlKv('Thời gian tải '+P.tsz+' MB',`cáp quang <b>${isFinite(a.t)?stlS(a.t):'> 120 s'}</b> · vệ tinh <b>${isFinite(b.t)?stlS(b.t):'> 120 s'}</b>`)}${stlKv('Thông lượng TB',stlMb(a.thr)+' · '+stlMb(b.thr))}${stlKv('BDP',nF(bdpF,0)+' kB · '+nF(bdpL,0)+' kB (cửa sổ TCP phải ≥ BDP)')}</dl>
   <p class="note">Mô hình CUBIC rút gọn theo từng RTT: slow start nhân đôi, mất gói (gai khi đổi vệ tinh, mưa, gián đoạn) làm cửa sổ giảm 30 %. Với RTT lớn hơn, cùng một tệp nhỏ tải lâu hơn vì số vòng slow start; tệp lớn bị giới hạn bởi dung lượng beam. BBR ít nhạy với mất gói ngẫu nhiên hơn (không mô phỏng). TCP chi tiết, Mathis, bufferbloat: <button type="button" class="u3lnkbtn" data-tab="tx">thẻ Truyền dẫn</button>.</p>`;}
function stlVo(env){const o=STLS.win,rng=nRng(5),N=6000,d=new Float32Array(N),lost=new Uint8Array(N);let late=0,ls=0,jb=40,sum=0,ns=0,hist=[];
  for(let i=0;i<N;i++){const t=i*0.02;let ow,lo;if(env==='leo'&&o){const k=Math.min(o.n-1,Math.floor(t/o.dt));ow=o.rtt[k]/2+Math.abs(nGs(rng))*2;lo=o.out[k]||rng()*100<o.loss[k];}else{ow=2.5+Math.abs(nGs(rng))*0.3;lo=rng()<0.0002;}
    d[i]=ow;if(lo){lost[i]=1;ls++;continue;}hist.push(ow);if(hist.length>100)hist.shift();if(i%50===0&&hist.length>10){const q=Float64Array.from(hist).sort();jb=nC(q[Math.floor(q.length*0.95)]-q[Math.floor(q.length*0.05)]+10,20,200);}
    const base=hist.length?Math.min(...hist.slice(-50)):ow;if(ow>base+jb){late++;lost[i]=2;}else{sum+=ow+jb;ns++;}}
  const ppl=(ls+late)/N*100,m2e=95-40+(ns?sum/ns:0),Id=0.024*m2e+(m2e>177.3?0.11*(m2e-177.3):0),Ie=5+(95-5)*ppl/(ppl+10),Rf=93.2-Id-Ie,mos=Rf<0?1:Rf>100?4.5:1+0.035*Rf+Rf*(Rf-60)*(100-Rf)*7e-6;
  return {d,lost,ls:ls/N*100,late:late/N*100,m2e,Rf,mos,jb};}
function stlVoHtml(){stlLinkRun();const a=stlVo('fib'),b=stlVo('leo'),pts=[],lp=[];for(let i=0;i<6000;i+=5){const t=i*0.02;if(b.lost[i]===1)lp.push([t,2]);else pts.push([t,b.d[i]]);}
  const ym=Math.max(60,Math.ceil(stlQ(Array.from(b.d),99)/20)*20+20);
  return `<div class="scroll"><div class="stlwn">${nPlot({w:STLPW,h:160,pl:STLPL,x0:0,x1:120,y0:0,y1:ym,xt:[0,30,60,90,120],xf:v=>v+' s',yt:[0,ym/2,ym],ylab:'trễ một chiều ms',series:[{pts,c:'var(--acc)',w:1},{pts:lp,c:'#E5484D',w:3}],marks:(STLS.win?STLS.win.sw:[]).map(t=>[t,'','var(--muted)']),aria:'Trễ gói RTP'})}</div></div>${uLeg([['Trễ một chiều gói RTP qua backhaul','var(--acc)'],['Gói mất','#E5484D']])}
   <div class="scroll"><table class="ndtb"><thead><tr><th></th><th>Cáp quang</th><th>Vệ tinh LEO</th></tr></thead><tbody>
   <tr><td>Mất gói trên đường</td><td>${stlPct(a.ls,2)}</td><td>${stlPct(b.ls,2)}</td></tr><tr><td>Đến muộn, bộ đệm jitter bỏ</td><td>${stlPct(a.late,2)}</td><td>${stlPct(b.late,2)}</td></tr>
   <tr><td>Bộ đệm jitter thích nghi (cuối)</td><td>${stlMs(a.jb)}</td><td>${stlMs(b.jb)}</td></tr><tr><td>Miệng-tai ước tính</td><td>${stlMs(a.m2e)}</td><td>${stlMs(b.m2e)}</td></tr>
   <tr><td>R-factor · MOS (E-model rút gọn)</td><td>${nF(a.Rf,0)} · ${nF(a.mos,2)}</td><td class="${b.mos<3.6?'stlmid':'stlok'}">${nF(b.Rf,0)} · ${nF(b.mos,2)}</td></tr></tbody></table></div>
   <p class="note">Cuộc gọi 120 s, 50 gói/s, dùng đúng chuỗi trễ/mất gói của cửa sổ 120 s ở mục 2. Mỗi lần đổi vệ tinh có thể mất 1–3 gói liên tiếp (nghe «tích»). E-model (ITU-T G.107) rút gọn với Ie = 5, Bpl = 10 (cần đối chiếu G.113 cho AMR-WB). Tham số và phân tích log VoLTE: <button type="button" class="u3lnkbtn" data-tab="vo">thẻ VoLTE</button>.</p>`;}
function stlStormHtml(){const P=STLP.ran,R=stlRanEv(),C=stlCore(),act=P.nue*0.35,tot=P.nsite*P.nue,sp=10;
  return `<dl class="kv">${stlKv('Cell ngừng phục vụ',R.assocDead?`<b>${P.nsite*3} cell</b> trong ${stlS(R.tUp-R.D.ta)} (mỗi trạm 3 cell)`:'Không (association sống sót)')}${stlKv('Rớt '+(C.core==='5GC'?'QoS flow/PDU':'E-RAB'),R.assocDead?nF(P.nsite*act,0)+' phiên đang hoạt động':'0 (chỉ mất gói)')}${stlKv('Rớt cuộc gọi VoLTE',R.voDrop?'≈ '+nF(P.nsite*P.nue*0.02,0)+' cuộc (2 % thuê bao đang gọi)':'0')}${stlKv('Khi hồi phục cùng lúc',R.assocDead?`${P.nsite} ${C.ap==='NGAP'?'NG':'S1'} Setup, ~${nF(tot,0)} UE đăng ký/attach lại trong ~${sp} s → đỉnh ≈ <b>${nF(tot/sp,0)} yêu cầu/s</b> tới ${C.cn} và UDM/HSS`:'Không có bão đăng ký')}</dl>
   <p class="note">Nhiều trạm cùng beam hoặc cùng gateway (mưa lớn tại gateway, PoP sự cố) mất kết nối và hồi phục gần như đồng thời. Nên rải ngẫu nhiên bộ hẹn giờ kết nối lại SCTP ở trạm và bật chống quá tải ở lõi. Bão đăng ký, back-off T3346, chống quá tải OCI/LCI ở UDM: <button type="button" class="u3lnkbtn" data-udxgo="udm:geo">thẻ UDM · dự phòng và bão đăng ký</button>.</p>`;}
const STLRLITE=['out','hb','rtoi','rtomin','rtomax','pmr','amr','dpd','dpdr','echo','t3','n3','rtp','ipv','ipo','pay','esp','natt','vlan','mtu','n3x','codec','osc','nsite','nue'];
STLR.ran={
 html(){const C=stlCore();return `<div class="panel"><h3>Mặt điều khiển: SCTP ${nE(C.c)}, IPsec DPD, GTP-U echo khi đường vệ tinh gián đoạn</h3>
   <div class="ctl">${stlSl('ran','out','Thời gian gián đoạn',0.5,600,0.5,stlS,'che khuất, mưa, gateway')}${stlSl('ran','hb','SCTP HB.interval',1,30,1,v=>v+' s','','hb')}${stlSl('ran','rtomin','RTO.min',0.1,3,0.1,v=>nF(v,1)+' s','','rtomin')}${stlSl('ran','rtomax','RTO.max',0.5,60,0.5,v=>nF(v,1)+' s','','rtomax')}${stlSl('ran','pmr','Path.Max.Retrans',1,10,1,v=>v,'','pmr')}${stlSl('ran','amr','Association.Max.Retrans',2,20,1,v=>v,'','amr')}
   ${stlSl('ran','dpd','IKE DPD interval',2,60,1,v=>v+' s','','dpd')}${stlSl('ran','dpdr','Số lần thử DPD',1,8,1,v=>v,'','dpdr')}${stlSl('ran','echo','GTP-U Echo interval',10,300,10,v=>v+' s','TS 29.281 gợi ý ≥ 60 s','echo')}${stlSl('ran','t3','T3-RESPONSE',1,10,1,v=>v+' s')}${stlSl('ran','n3','N3-REQUESTS',1,8,1,v=>v)}${stlSl('ran','rtp','Hết giờ RTP ở IMS',5,60,1,v=>v+' s','','rtp')}</div>
   <div id="stlRTl">${stlRanTl()}</div></div>
  <div class="panel"><h3>Mặt người dùng: GTP-U trong IPsec ESP NAT-T — overhead, MTU, MSS</h3>
   <div class="ctl">${stlSl('ran','pay','Gói IP của UE',60,1500,10,v=>v+' B')}${stlSel('ran','ipv','IP của UE',[[4,'IPv4'],[6,'IPv6']])}${stlSel('ran','ipo','IP truyền dẫn và ngoài',[[4,'IPv4 (CGNAT)'],[6,'IPv6']])}${stlSel('ran','esp','Mã hoá ESP',[['gcm','AES-GCM-128'],['cbc','AES-CBC + HMAC-SHA1-96']],'','esp')}${stlSl('ran','mtu','MTU đường vệ tinh',1280,1500,4,v=>v+' B','cần đo bằng ping DF','mtu')}${stlChk('ran','natt','NAT-T (UDP 4500)')}${stlChk('ran','n3x','PDU Session Container (N3, chỉ ở 5G SA)')}${stlSel('ran','codec','Mã thoại',Object.entries(STLCOD).map(([k,v])=>[k,v[0]]))}</div>
   <div id="stlOvh">${stlOvhHtml()}</div></div>
  <div class="panel"><h3>Đồng bộ: GNSS tại trạm và holdover</h3><div class="ctl">${stlSel('ran','osc','Bộ dao động',Object.entries(STLOSC).map(([k,v])=>[k,v[0]]),'','gnss')}</div><div id="stlHold">${stlHoldHtml()}</div></div>
  <div class="panel"><h3>Ngân sách trễ theo dịch vụ</h3>${stlBudget()}</div>
  <div class="panel"><h3>Một cuộc gọi VoLTE qua đường vệ tinh</h3><div id="stlVo">${stlVoHtml()}</div></div>
  <div class="panel"><h3>Một phiên TCP: slow start và BDP, cáp quang so với vệ tinh</h3><div class="ctl">${stlSl('ran','tsz','Kích thước tệp',1,200,1,v=>v+' MB')}${stlSl('ran','cbw','Dung lượng cáp quang so sánh',20,1000,10,v=>v+' Mbit/s')}</div><div id="stlTcp">${stlTcpHtml()}</div></div>
  <div class="panel"><h3>Ảnh hưởng tới KPI RAN và bão đăng ký khi đường hồi phục</h3><div class="ctl">${stlSl('ran','nsite','Số trạm cùng beam/gateway',1,200,1,v=>v+' trạm')}${stlSl('ran','nue','UE mỗi trạm',10,2000,10,v=>v+' UE')}</div><div id="stlStorm">${stlStormHtml()}</div></div>`;},
 upd(k){if(['pay','ipv','ipo','esp','mtu','natt','n3x','codec','vlan'].includes(k))stlSet('stlOvh',stlOvhHtml());else if(k==='osc')stlSet('stlHold',stlHoldHtml());else if(k==='tsz'||k==='cbw')stlSet('stlTcp',stlTcpHtml());
  else{stlSet('stlRTl',stlRanTl());stlSet('stlStorm',stlStormHtml());}}
};

/* ---------- Mục 4: Định cỡ, dự phòng, chi phí ---------- */
function stlCap(term){const L=STLP.link;if(L.term===term){const s=stlDaySt();if(isFinite(s.dl50))return {dl50:s.dl50,dl10:s.dl10,ul50:s.ul50,ul10:s.ul10,src:'mô phỏng 24 h ở mục 2'};}
  const T=STLTERM[term];return {dl50:T.dl*0.55,dl10:T.dl*0.3,ul50:T.ul*0.55,ul10:T.ul*0.3,src:'hệ số điển hình (cần đối chiếu)'};}
function stlCapG(t){const c=stlCap(t);return {dl50:Math.max(1,c.dl50),dl10:Math.max(1,c.dl10),ul50:Math.max(0.5,c.ul50),ul10:Math.max(0.5,c.ul10),src:c.src};}
function stlDimCalc(){const P=STLP.dim,lp=P.lbw*3.75*2,lu=P.lbw*3,np=P.nbw*5*Math.min(4,P.mimo)*0.74,nu=P.nbw*5*0.23,pk=Math.max(P.nl?lp:0,P.nn?np:0),pu=Math.max(P.nl?lu:0,P.nn?nu:0);
  const bh=P.subs*P.ru,bu=bh*P.ulr,ov=1.15,dl=Math.max(pk,bh)*ov,ul=Math.max(pu,bu)*ov,dlm=bh*ov,ulm=bu*ov,cap=stlCapG(P.term),k=P.nt*(P.nt>1?P.bond/100:1);
  return {lp,lu,np,nu,pk,pu,bh,bu,dl,ul,dlm,ulm,cap,cdl:cap.dl50*k,cul:cap.ul50*k,cdl10:cap.dl10*k,cul10:cap.ul10*k,need:Math.max(1,Math.ceil(Math.max(dlm/(cap.dl10*0.8),ulm/(cap.ul10*0.8))))};}
function stlDimHtml(){const P=STLP.dim,D=stlDimCalc(),u1=D.dlm/D.cdl10*100,u2=D.ulm/D.cul10*100,mx=Math.max(D.dl,D.cdl,10),mu=Math.max(D.ul,D.cul,5);
  return `<div class="scroll"><table class="ndtb"><thead><tr><th></th><th>Tải xuống (lõi → trạm)</th><th>Tải lên (trạm → lõi)</th></tr></thead><tbody>
   <tr><td>Đỉnh một cell LTE ${P.lbw} MHz 2×2 · NR ${P.nbw} MHz ${P.mimo} lớp TDD</td><td>${P.nl?stlMb(D.lp):'—'} · ${P.nn?stlMb(D.np):'—'}</td><td>${P.nl?stlMb(D.lu):'—'} · ${P.nn?stlMb(D.nu):'—'}</td></tr>
   <tr><td>Trung bình giờ bận cả trạm (${nF(P.subs,0)} thuê bao × ${nF(P.ru,2)} Mbit/s)</td><td>${stlMb(D.bh)}</td><td>${stlMb(D.bu)}</td></tr>
   <tr><td><b>Băng thông backhaul cần</b> = max(đỉnh 1 cell, TB giờ bận) × 1,15 overhead</td><td><b>${stlMb(D.dl)}</b> (TB ${stlMb(D.dlm)})</td><td><b>${stlMb(D.ul)}</b> (TB ${stlMb(D.ulm)})</td></tr>
   <tr><td>Năng lực ${P.nt} terminal ${STLTERM[P.term].n.toLowerCase()} (p50 · p10, ${nE(D.cap.src)})</td><td>${stlMb(D.cdl)} · ${stlMb(D.cdl10)}</td><td>${stlMb(D.cul)} · ${stlMb(D.cul10)}</td></tr>
   <tr><td>Tỉ lệ sử dụng giờ bận so với p10</td><td class="${u1>80?'stlno':u1>60?'stlmid':'stlok'}">${nF(u1,0)} %</td><td class="${u2>80?'stlno':u2>60?'stlmid':'stlok'}">${nF(u2,0)} %</td></tr></tbody></table></div>
   <div class="stltwo"><div>${nBars([['Cần DL (đỉnh)',D.dl,'var(--acc)'],['Cần DL (TB)',D.dlm,'var(--acc)'],['Có DL (p50)',D.cdl,'var(--up)'],['Có DL (p10)',D.cdl10,'var(--up)']],mx,' Mbit/s',0)}</div><div>${nBars([['Cần UL (đỉnh)',D.ul,'var(--nr)'],['Cần UL (TB)',D.ulm,'var(--nr)'],['Có UL (p50)',D.cul,'var(--up)'],['Có UL (p10)',D.cul10,'var(--up)']],mu,' Mbit/s',0)}</div></div>
   <p class="e2d">Khuyến nghị: <b>${D.need} terminal</b> để TB giờ bận ≤ 80 % năng lực p10 ở cả hai chiều. ${u2>u1?'<b>Chiều lên là nút cổ chai</b> (terminal phát lên yếu hơn nhiều so với thu xuống): đặt shaping UL ở CSR thấp hơn năng lực p10 để hàng đợi nằm ở CSR (nơi có QoS) chứ không ở terminal.':'Chiều xuống chiếm ưu thế.'} Tỉ lệ đỉnh/trung bình ${nF(D.dl/Math.max(1,D.dlm),1)} lần: đỉnh một cell không thể đạt khi backhaul hẹp, UE sẽ thấy tốc độ tối đa bị giới hạn bởi vệ tinh.</p>
   <p class="note">Công thức backhaul theo hướng dẫn ước lượng lưu lượng backhaul LTE của NGMN (max của đỉnh một cell và tổng trung bình giờ bận). Hiệu suất phổ đỉnh: LTE 3,75 bit/s/Hz/lớp, NR 5 bit/s/Hz/lớp × 74 % khung DL (TDD) — minh hoạ. Ghép nhiều terminal bằng SD-WAN/ECMP hiệu dụng ${P.bond} %.</p>`;}
function stlRedHtml(){const P=STLP.dim,R=stlDet(),st=stlDaySt(),A1=Math.min(99.99,st.avail),U1=1-A1/100,Um=1-P.mwa/100,rho=0.5,U2=U1*(rho+(1-rho)*U1),m=43200;
  const rows=[['1 terminal vệ tinh',A1,'—'],['2 terminal (cùng vị trí, tương quan mưa/gateway ρ = 0,5)',100*(1-U2),'< 1 s (ECMP/SD-WAN, cùng đường hầm)'],['Chỉ viba',P.mwa,'—'],['Viba + vệ tinh (hai đường hầm IPsec dựng sẵn)',100*(1-U1*Um),'≈ 0,3–1 s (BFD 3 × 100 ms + định tuyến)'],['Viba + vệ tinh (dựng IPsec khi chuyển)',100*(1-U1*Um),'≈ 5–15 s (IKE lại)']];
  return `<div class="scroll"><table class="ndtb"><thead><tr><th>Phương án</th><th>Sẵn sàng</th><th>Gián đoạn/tháng</th><th>Thời gian chuyển đường</th><th>SCTP sống sót?</th></tr></thead><tbody>${rows.map((r,i)=>{const ft=i===3?0.6:i===4?10:i===1?0.5:NaN;return `<tr><td>${nE(r[0])}</td><td>${stlPct(r[1],3)}</td><td>${nF((1-r[1]/100)*m,0)} phút</td><td>${nE(r[2])}</td><td>${isFinite(ft)?(ft<R.ta?'<span class="stlok">có</span>':'<span class="stlno">không</span>'):'—'}</td></tr>`;}).join('')}</tbody></table></div>
   <p class="note">Sẵn sàng 1 terminal lấy từ mô phỏng 24 h ở mục 2 (gồm che khuất, mưa đã chọn). Hai terminal cùng chỗ không độc lập vì cùng chịu mưa và cùng gateway; viba và vệ tinh gần như độc lập. SCTP sống sót nếu thời gian chuyển đường nhỏ hơn thời gian phát hiện SCTP ở mục 3 (${stlS(R.ta)}).</p>`;}
function stlPwrHtml(){const P=STLP.dim,T=STLTERM[P.term],tw=P.nt*(T.w[0]+T.w[1])/2,base=P.btsw+40+tw,pts=[],sol=[],ld=[];let soc=100,minS=100,cap=P.bat*1000;
  for(let h=0;h<=72;h+=0.25){const hh=h%24,load=P.btsw*(0.6+0.4*STLDAY[Math.floor(hh)]/100)+40+tw,day=Math.floor(h/24),wf=[1,0.35,1][day]||1,sun=hh>6&&hh<18?Math.sin((hh-6)/12*Math.PI):0,pv=P.kwp*1000*0.75*sun*wf*P.psh/7.64;
    soc=P.grid?nC(soc+(pv-load)*0.25/cap*100/0.8,0,100):100;minS=Math.min(minS,soc);pts.push([h,soc]);sol.push([h,Math.min(100,pv/Math.max(1,base*2)*100)]);ld.push([h,load/Math.max(1,base*2)*100]);}
  const day=base*24/1000,pvd=P.kwp*P.psh*0.75,aut=cap*0.8/base;
  return `<div class="scroll"><div class="stlwn">${nPlot({w:STLPW,h:170,pl:STLPL,x0:0,x1:72,y0:0,y1:100,xt:[0,12,24,36,48,60,72],xf:v=>v+' h',yt:[0,50,100],ylab:'%',series:[{pts:sol,c:'var(--lte)',w:1,dash:'3 3'},{pts:ld,c:'var(--muted)',w:1},{pts,c:'var(--up)',w:1.8}],hl:[[20,'#E5484D','ngưỡng cắt tải']],marks:[[24,'ngày 2: trời u ám'],[48,'ngày 3']],aria:'Nguồn 72 giờ'})}</div></div>${uLeg([['Ắc quy SoC','var(--up)'],['Điện mặt trời (tương đối)','var(--lte)'],['Phụ tải (tương đối)','var(--muted)']])}
   <dl class="kv">${stlKv('Công suất trung bình',`${nF(base,0)} W (trạm ${P.btsw} W + CSR 40 W + ${P.nt} terminal ${nF(tw,0)} W)`)}${stlKv('Điện năng/ngày',nF(day,1)+' kWh · điện mặt trời '+nF(pvd,1)+' kWh/ngày nắng')}${stlKv('Chạy bằng ắc quy (DoD 80 %)','<b>'+nF(aut,1)+' giờ</b>')}${stlKv('SoC thấp nhất trong 72 h',`<b class="${minS<20?'stlno':'stlok'}">${nF(minS,0)} %</b>${P.grid?' (giả định mất điện lưới cả 72 h)':''}`)}</dl>
   <p class="note">Công suất terminal: bản tiêu chuẩn trung bình 75–100 W, bản mini 25–40 W (thông số công bố của thiết bị). Terminal có sưởi tan tuyết làm tăng công suất (không áp dụng ở Việt Nam). Khi ắc quy cạn, mất terminal trước hay mất trạm trước đều làm S1/NG đứt: nên đặt ưu tiên cắt tải (cắt sóng mang phụ trước, giữ terminal và CSR).</p>`;}
const STLCOST={f:[12,0.05],m:[25,0.4],l:[3,1,1.2]};
function stlCostHtml(){const P=STLP.dim,D=stlDimCalc(),nt=Math.max(P.nt,D.need),Y=P.yrs,cf=m=>STLCOST.f[0]*P.fkm+STLCOST.f[1]*P.fkm*m,cm=m=>STLCOST.m[0]*P.mwh+STLCOST.m[1]*P.mwh*m,cl=m=>(STLCOST.l[0]+STLCOST.l[1])*nt+STLCOST.l[2]*nt*m;
  const a=[],b=[],c=[];for(let m=0;m<=Y*12;m+=3){a.push([m/12,cf(m)]);b.push([m/12,cm(m)]);c.push([m/12,cl(m)]);}const ym=Math.max(cf(Y*12),cm(Y*12),cl(Y*12))*1.1,best=[['Cáp quang',cf(Y*12)],['Viba',cm(Y*12)],['Vệ tinh LEO',cl(Y*12)]].sort((x,y)=>x[1]-y[1])[0];
  const capOk=D.dlm<=D.cap.dl10*nt*0.8&&D.ulm<=D.cap.ul10*nt*0.8;
  return `<div class="scroll"><div class="stlwn">${nPlot({w:STLPW,h:170,pl:STLPL,x0:0,x1:Y,y0:0,y1:ym,xt:Array.from({length:Y+1},(_,i)=>i),xf:v=>v+' năm',yt:[0,ym/2,ym],ylab:'đv tích luỹ',series:[{pts:a,c:'var(--nr)',w:1.6},{pts:b,c:'var(--acc)',w:1.6},{pts:c,c:'var(--warn)',w:1.6}],aria:'Tổng chi phí'})}</div></div>${uLeg([['Cáp quang','var(--nr)'],['Viba','var(--acc)'],['Vệ tinh LEO ('+nt+' terminal)','var(--warn)']])}
   <div class="scroll"><table class="ndtb"><thead><tr><th>Phương án</th><th>Đầu tư (đv)</th><th>Chi phí tháng (đv)</th><th>Tổng ${Y} năm</th><th>Triển khai</th></tr></thead><tbody>
   <tr><td>Cáp quang ${P.fkm} km</td><td>${nF(cf(0),0)}</td><td>${nF(STLCOST.f[1]*P.fkm,1)}</td><td>${nF(cf(Y*12),0)}</td><td>${P.fkm>20?'6–12 tháng':'3–6 tháng'}</td></tr>
   <tr><td>Viba ${P.mwh} chặng</td><td>${nF(cm(0),0)}</td><td>${nF(STLCOST.m[1]*P.mwh,1)}</td><td>${nF(cm(Y*12),0)}</td><td>1–3 tháng</td></tr>
   <tr><td>Vệ tinh LEO ${nt} terminal</td><td>${nF(cl(0),0)}</td><td>${nF(STLCOST.l[2]*nt,1)}</td><td>${nF(cl(Y*12),0)}</td><td>1–2 tuần</td></tr></tbody></table></div>
   <p class="e2d">Khuyến nghị: ${!capOk?'<b>Vệ tinh không đủ dung lượng giờ bận</b> → dùng viba/cáp quang, vệ tinh chỉ làm dự phòng hoặc tạm thời.':best[0]==='Vệ tinh LEO'?'<b>Vệ tinh LEO</b> rẻ nhất trong '+Y+' năm và triển khai nhanh nhất; giữ trạm ở cấu hình ít sóng mang, ưu tiên thoại và báo hiệu.':'<b>'+best[0]+'</b> rẻ nhất trong '+Y+' năm; vệ tinh hợp khi cần phát sóng gấp (sự kiện, khẩn cấp) rồi chuyển sang '+best[0].toLowerCase()+' sau.'}</p>
   <p class="note">Đơn vị «đv» giả định, chỉ để so sánh tương đối: cáp quang 12 đv/km + 0,05 đv/km/tháng; viba 25 đv/chặng + 0,4 đv/chặng/tháng; vệ tinh 3 đv terminal + 1 đv lắp đặt + 1,2 đv/tháng thuê bao doanh nghiệp. Không phải giá thật.</p>`;}
STLR.dim={
 html(){return `<div class="panel"><h3>Lưu lượng trạm → băng thông vệ tinh cần</h3>
   <div class="ctl">${stlSl('dim','nl','Số sóng mang LTE',0,3,1,v=>v)}${stlSel('dim','lbw','Băng thông LTE',[[10,'10 MHz'],[15,'15 MHz'],[20,'20 MHz']])}${stlSl('dim','nn','Số sóng mang NR',0,2,1,v=>v)}${stlSel('dim','nbw','Băng thông NR',[[20,'20 MHz'],[40,'40 MHz'],[60,'60 MHz'],[80,'80 MHz'],[100,'100 MHz']])}${stlSel('dim','mimo','Số lớp NR',[[2,'2'],[4,'4']])}
   ${stlSl('dim','subs','Thuê bao phục vụ',100,10000,100,v=>nF(v,0))}${stlSl('dim','ru','Lưu lượng TB giờ bận mỗi thuê bao',0.02,1,0.01,v=>nF(v,2)+' Mbit/s')}${stlSl('dim','ulr','Tỉ lệ UL/DL',0.05,0.5,0.01,v=>nF(v*100,0)+' %')}${stlSel('dim','term','Terminal',[['std','Tiêu chuẩn'],['mini','Mini']])}${stlSl('dim','nt','Số terminal ghép',1,4,1,v=>v)}${stlSl('dim','bond','Hiệu suất ghép',60,100,1,v=>v+' %')}</div>
   <div id="stlDim">${stlDimHtml()}</div></div>
  <div class="panel"><h3>Dự phòng: nhiều terminal, lai viba + vệ tinh, tự chuyển đường</h3><div class="ctl">${stlSl('dim','mwa','Sẵn sàng tuyến viba',99,99.999,0.001,v=>nF(v,3)+' %')}</div><div id="stlRed">${stlRedHtml()}</div></div>
  <div class="panel"><h3>Cấp nguồn: terminal, điện mặt trời và ắc quy</h3><div class="ctl">${stlSl('dim','btsw','Công suất trạm',300,4000,50,v=>v+' W')}${stlSl('dim','kwp','Pin mặt trời',0,15,0.5,v=>nF(v,1)+' kWp')}${stlSl('dim','bat','Ắc quy',2,80,1,v=>v+' kWh')}${stlSl('dim','psh','Giờ nắng đỉnh',2.5,6,0.5,v=>nF(v,1)+' h/ngày')}${stlChk('dim','grid','Mô phỏng mất điện lưới 72 h')}</div><div id="stlPwr">${stlPwrHtml()}</div></div>
  <div class="panel"><h3>Chi phí minh hoạ và thời gian triển khai</h3><div class="ctl">${stlSl('dim','fkm','Cáp quang phải kéo',1,100,1,v=>v+' km')}${stlSl('dim','mwh','Số chặng viba',1,8,1,v=>v)}${stlSl('dim','yrs','Thời gian so sánh',1,10,1,v=>v+' năm')}</div><div id="stlCost">${stlCostHtml()}</div></div>`;},
 upd(k){stlSet('stlDim',stlDimHtml());stlSet('stlRed',stlRedHtml());stlSet('stlPwr',stlPwrHtml());stlSet('stlCost',stlCostHtml());}
};

/* ---------- Mục 5: Giám sát và kiểm soát toàn trình ---------- */
const STLSITE=[{n:'Trạm A · miền núi phía Bắc',obs:[0,15,0,0,0,30,30,0],rain:80,load:70,pwr:'solar',mw:0,gw:'G1'},{n:'Trạm B · Tây Nguyên',obs:[0,0,0,0,15,0,0,0],rain:100,load:60,pwr:'grid',mw:1,gw:'G2'},
 {n:'Trạm C · đảo xa',obs:[0,0,0,0,0,0,0,0],rain:120,load:50,pwr:'solar',mw:0,gw:'G2'},{n:'Trạm D · ven biển miền Trung',obs:[0,0,0,15,15,0,0,0],rain:150,load:80,pwr:'grid',mw:0,gw:'G2'},
 {n:'Trạm E · đồng bằng sông nước',obs:[30,0,0,0,0,0,0,15],rain:90,load:90,pwr:'grid',mw:1,gw:'G3'},{n:'Trạm F · biên giới Tây Bắc',obs:[30,30,0,0,0,0,15,30],rain:70,load:40,pwr:'solar',mw:0,gw:'G1'}];
const STLSEGS=[['ue','UE ↔ cell','KPI 15 phút ở OSS: RRC, E-RAB/QoS flow, thông lượng, MOS'],['cell','Cell ↔ eNB/gNB','Trạng thái cell, cảnh báo trạm'],['csr','eNB/gNB ↔ CSR','Cổng Ethernet, BFD, SNMP/telemetry, bộ đếm hàng đợi'],
 ['ut','CSR ↔ terminal','API terminal: trạng thái, SNR, % che khuất, gián đoạn (tên trường cần đối chiếu)'],['sat','Terminal ↔ vệ tinh','Trễ, mất gói tới PoP do terminal đo; ping từ CSR'],['gw','Vệ tinh ↔ gateway/PoP','Ping/traceroute tới PoP; trang trạng thái nhà cung cấp'],
 ['inet','PoP ↔ Internet/kết nối riêng','Ping IP công khai SeGW, traceroute, BGP'],['segw','Internet ↔ SeGW','Bộ đếm IKE/IPsec SA, DPD, rekey ở SeGW; TWAMP trong đường hầm'],['core','SeGW ↔ lõi','SCTP, S1/NG setup, GTP-U echo ở MME/AMF, SGW/UPF'],['site','Nguồn và đồng bộ trạm','Rectifier, ắc quy, GNSS (số vệ tinh, holdover)']];
const STLFI={none:{n:'Không có lỗi'},rain:{n:'Mưa lớn tại trạm',seg:'sat'},obs:{n:'Che khuất (cây mọc, công trình mới)',seg:'sat'},cong:{n:'Nghẽn beam giờ cao điểm',seg:'sat'},pop:{n:'Gateway/PoP sự cố',seg:'gw'},
 ike:{n:'IPsec rekey/IKE lỗi (chứng thư hết hạn)',seg:'segw'},mtu:{n:'MTU sai, thiếu MSS clamping',seg:'csr'},gnss:{n:'Mất GNSS tại trạm',seg:'site'},pwr:{n:'Mất điện trạm, ắc quy cạn',seg:'site'}};
const STLFX={rain:'Theo dõi radar mưa; chờ hết mưa, nếu kéo dài thì chuyển viba dự phòng; xem xét terminal thứ hai ở vị trí khác không giúp vì cùng mưa.',obs:'Đo lại bản đồ vật cản từ ứng dụng terminal, nâng cột anten hoặc dời vị trí, chặt tỉa cây; trong lúc chờ có thể tăng Association.Max.Retrans để S1/NG không chập chờn.',
 cong:'Mở ticket nhà cung cấp kèm số đo TWAMP theo giờ; đặt shaping và ưu tiên thoại ở CSR; cân nhắc gói dịch vụ ưu tiên hoặc thêm terminal/đường viba.',pop:'Kiểm tra trang trạng thái nhà cung cấp, mở ticket; nếu có viba dự phòng thì ép chuyển đường; theo dõi bão đăng ký khi hồi phục.',
 ike:'Gia hạn chứng thư qua CMPv2, kiểm tra đồng hồ (NTP) và CRL/OCSP; kiểm tra định danh IKE khi IP CGNAT đổi; dựng lại SA.',mtu:'Đặt MTU đường hầm phù hợp, bật MSS clamping ở CSR và PGW/UPF, pre-fragmentation trước mã hoá; kiểm tra bằng ping DF nhiều cỡ gói.',
 gnss:'Kiểm tra anten GNSS, cáp, chống sét, bộ thu; theo dõi thời gian holdover; nếu quá hạn thì tắt cell TDD để tránh nhiễu, giữ cell FDD.',pwr:'Điều ứng cứu máy phát; cấu hình cắt tải ưu tiên giữ CSR và terminal; tăng dung lượng ắc quy/pin mặt trời cho trạm vùng mưa.'};
const STLMS={ran:0};
function stlAff(si){const g=STLS.mg;if(!g||g.fid==='none')return false;if(si===g.si)return true;return g.fid==='pop'&&STLSITE[si].gw===STLSITE[g.si].gw;}
function stlMonState(si,clk){const s=STLSITE[si],g=STLS.mg,f=stlAff(si)?g.fid:'none',tf=g?clk-g.t:0,r=nRng(si*131+Math.floor(clk/30)),hr=Math.floor(clk/3600)%24,C=stlCore();
  let u=nC(s.load/100*STLDAY[hr]/100,0,0.97);if(f==='cong')u=0.97;const obsP=stlSkyObsPct({emin:25,obs:s.obs});
  let rtt=36+30*u*u/(1-u+0.1)+r()*6,loss=0.2+r()*0.3,snr=10.5+r(),outs=obsP*2*(0.5+r()),dl=180*(1-0.7*u)*(0.85+0.3*r()),ul=22*(1-0.5*u)*(0.85+0.3*r()),on=1,pop=1,ike='up',s1='up',cell=1,gn=1,pw=s.pwr==='grid'?'điện lưới':'mặt trời + ắc quy '+(70+Math.floor(r()*25))+' %',mos=4.1-r()*0.15,thr=0,big=1,segw=1,obsx=obsP,A=[];
  if(si===2)A.push([-600,'Warning','Tủ trạm','Cửa tủ mở',9]);if(si===4)A.push([-1800,'Minor','Tủ trạm','Nhiệt độ tủ cao',9]);
  if(f==='rain'){snr=1.5+r()*2;outs=90+r()*90;loss=3+r()*3;rtt+=12;dl*=0.3;ul*=0.35;mos=3.3;thr=1;A.push([0,'Minor','Terminal','SNR thấp, giảm điều chế',2],[20,'Major','TWAMP CSR→SeGW','Mất gói > 1 % trong 15 phút',3],[60,'Minor',C.ran,'MOS VoLTE trung bình < 3,5',6]);}
  else if(f==='obs'){outs=150+r()*80;loss=1.2+r();obsx=Math.max(obsP,9+r()*3);mos=3.6;A.push([0,'Minor','Terminal','Gián đoạn lặp lại (che khuất)',2],[45,'Major','SeGW','IPsec DPD timeout, tự dựng lại',3],[47,'Warning',C.ran,'SCTP path flap',4]);}
  else if(f==='cong'){rtt=150+r()*90;loss=1.5+r()*1.5;dl=10+r()*6;ul=1.5+r()*1.5;mos=3.5;thr=1;A.push([0,'Major','TWAMP CSR→SeGW','RTT p95 > 100 ms trong 15 phút',3],[30,'Minor',C.ran,'Thông lượng UE trung bình thấp',6]);}
  else if(f==='pop'){pop=0;loss=100;dl=0;ul=0;if(tf>=20)ike='down';if(tf>=45){s1='down';cell=0;}A.push([0,'Minor','Terminal','Ping PoP thất bại (terminal vẫn online)',2],[20,'Critical','SeGW','IPsec tunnel down',3],[45,'Critical',C.ran,C.c+' link down',4],[46,'Critical',C.ran,'Cell out of service × 3',5],[50,'Major',C.cn,'Mất kết nối trạm',4]);}
  else if(f==='ike'){ike='down: AUTHENTICATION_FAILED';segw=0;loss=0.3;dl=0;ul=0;if(tf>=45){s1='down';cell=0;}A.push([0,'Major','SeGW','IKE_AUTH thất bại (chứng thư)',3],[1,'Critical','Trạm','IPsec tunnel down',3],[45,'Critical',C.ran,C.c+' link down',4],[46,'Critical',C.ran,'Cell out of service × 3',5]);}
  else if(f==='mtu'){thr=2;big=0;mos=4.0;A.push([0,'Minor',C.ran,'Thông lượng UE trung bình thấp, TCP truyền lại cao',6],[30,'Warning','CSR','ICMP Fragmentation-needed tăng',2]);}
  else if(f==='gnss'){gn=0;A.push([0,'Major',C.ran,'GNSS mất khoá, vào holdover',1]);if(tf>=300){cell=0.5;A.push([300,'Critical',C.ran,'Lệch đồng bộ: cell TDD ngừng phát',5]);}}
  else if(f==='pwr'){pw='mất điện lưới, ắc quy '+Math.max(0,12-Math.floor(tf/3))+' %';A.push([0,'Major','Trạm','Mất điện lưới (mains failure)',1],[20,'Critical','Trạm','Ắc quy thấp',1]);
    if(tf>=30){on=0;pop=0;loss=100;dl=0;ul=0;A.push([30,'Critical','Terminal','Offline',2],[31,'Critical','OAM','NE mất kết nối quản lý',1]);}if(tf>=50){ike='down';A.push([50,'Critical','SeGW','IPsec tunnel down',3]);}if(tf>=75){s1='down';cell=0;A.push([75,'Critical',C.cn,C.c+' link down',4]);}}
  const act=A.filter(a=>a[0]<=tf||a[0]<0).map(a=>({t:(g&&a[0]>=0?g.t:clk)+a[0],sv:a[1],ne:a[2],m:a[3],ly:a[4]}));
  const st=(c,w)=>c?'crit':w?'warn':'ok';
  const seg={ue:{st:st(!cell,thr||mos<3.6),v:cell?`MOS ${nF(mos,1)} · DL TB ${nF(dl*0.3,0)} Mbit/s${thr===2?' · TCP chậm':''}`:'mất dịch vụ'},
   cell:{st:cell===1?'ok':cell?'warn':'crit',v:cell===1?'3/3 cell phục vụ':cell?'cell TDD tắt':'0/3 cell (OOS)'},csr:{st:on?'ok':'crit',v:on?'BFD lên · lỗi 0':'không quản lý được'},
   ut:{st:!on?'crit':(outs>60||snr<5)?'warn':'ok',v:on?`online · SNR ${nF(snr,1)} dB · che ${nF(obsx,1)} % · gián đoạn ${nF(outs,0)} s/15′`:'offline'},
   sat:{st:!on?'crit':(rtt>100||(loss>1&&pop))?'warn':'ok',v:on&&pop?`${stlMs(rtt-6)} · mất ${stlPct(loss,1)}`:on?'terminal online':'—'},
   gw:{st:!on?'unk':pop?'ok':'crit',v:!on?'không đo được':pop?'PoP trả lời':'PoP không trả lời'},inet:{st:!on||!pop?'unk':'ok',v:on&&pop?'ping IP công khai SeGW '+stlMs(rtt+2):'không đo được'},
   segw:{st:ike==='up'?'ok':'crit',v:ike==='up'?'IKE/IPsec SA lên':ike},core:{st:s1==='up'?'ok':'crit',v:s1==='up'?`${C.ap} lên · GTP-U echo OK`:`${C.ap} down`},
   site:{st:f==='pwr'?'crit':!gn?'warn':'ok',v:`${pw} · GNSS ${gn?'khoá ('+(9+Math.floor(r()*5))+' vệ tinh)':'mất khoá, holdover'}`}};
  return {seg,rtt:on&&pop&&ike==='up'?rtt:null,loss:on&&pop?Math.min(loss,100):100,snr,outs,obsx,dl,ul,mos,act,f,tf,big,pop,on,ike,s1,cell,gn,pw,u};}
function stlClk(c){const h=Math.floor(c/3600)%24,m=Math.floor(c/60)%60,s=Math.floor(c)%60;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}
function stlSegHtml(){const P=STLP.mon,M=stlMonState(P.site,STLS.mclk);return `<div class="stlseg">${STLSEGS.map(x=>{const q=M.seg[x[0]];return `<button type="button" class="${q.st}" data-stla="mon:seg:${x[0]}" aria-pressed="${P.seg===x[0]}"><b>${nE(x[1])}</b><span>${nE(q.v)}</span></button>`;}).join('')}</div>
  ${P.seg?`<p class="e2d"><b>${nE(STLSEGS.find(x=>x[0]===P.seg)[1])}</b> — nguồn số đo: ${nE(STLSEGS.find(x=>x[0]===P.seg)[2])}. Trạng thái: <span class="stlst ${M.seg[P.seg].st}">${{ok:'bình thường',warn:'suy giảm',crit:'hỏng',unk:'không đo được'}[M.seg[P.seg].st]}</span></p>`:'<p class="note">Bấm vào một đoạn để xem nguồn số đo. Màu viền trái: xanh bình thường, cam suy giảm, đỏ hỏng, xám không đo được.</p>'}`;}
function stlSpark(){const H=STLS.mh||[];if(!H.length)return'';const n=H.length,rt=H.map((h,i)=>h.r==null?null:[i,h.r]),ls=H.map((h,i)=>[i,Math.min(20,h.l)]),ym=Math.max(100,Math.ceil(Math.max(...H.map(h=>h.r||0))/50)*50);
  return `<div class="stltwo"><div class="scroll"><div class="stlwn" style="min-width:320px">${nPlot({w:420,h:130,pl:40,x0:0,x1:Math.max(10,n-1),y0:0,y1:ym,yt:[0,ym/2,ym],xt:[],ylab:'RTT ms',series:[{pts:rt,c:'var(--warn)',w:1.5}],hl:[[100,'#E5484D','ngưỡng 100 ms']],aria:'RTT gần đây'})}</div></div>
   <div class="scroll"><div class="stlwn" style="min-width:320px">${nPlot({w:420,h:130,pl:40,x0:0,x1:Math.max(10,n-1),y0:0,y1:20,yt:[0,10,20],xt:[],ylab:'mất gói %',series:[{pts:ls,c:'#E5484D',w:1.5}],hl:[[1,'var(--warn)','1 %']],aria:'Mất gói gần đây'})}</div></div></div>`;}
function stlAlmHtml(){const P=STLP.mon,M=stlMonState(P.site,STLS.mclk),A=M.act.slice().sort((a,b)=>a.t-b.t);if(!A.length)return '<p class="note">Không có cảnh báo.</p>';
  const li=(a,c)=>`<li class="${c||''}"><span class="sv ${a.sv}">${a.sv}</span> ${stlClk(a.t)} · <b>${nE(a.ne)}</b>: ${nE(a.m)}</li>`;
  if(P.raw)return `<ul class="stlalm">${A.map(a=>li(a)).join('')}</ul>`;
  const main=A.filter(a=>a.ly<9),noise=A.filter(a=>a.ly>=9);if(!main.length)return `<ul class="stlalm">${noise.map(a=>li(a)).join('')}</ul>`;
  const root=main.slice().sort((a,b)=>a.ly-b.ly||a.t-b.t)[0],kids=main.filter(a=>a!==root);
  return `<ul class="stlalm">${li(root,'root')}${kids.map(a=>li(a,'chi')).join('')}${noise.map(a=>li(a)).join('')}</ul><p class="note">Gốc được chọn theo lớp thấp nhất trong cửa sổ 120 s (nguồn → terminal → IPsec → SCTP/S1/NG → cell → KPI). ${main.length} cảnh báo gom thành 1 sự cố; ${noise.length} cảnh báo không liên quan để riêng.</p>`;}
const STLTHR=[['RTT p95 trạm ↔ SeGW (TWAMP)','> 100 ms trong 15 phút','Major','TWAMP RFC 5357, gói EF và BE'],['Mất gói TWAMP','> 1 % trong 15 phút','Major','TWAMP'],['Jitter TWAMP','> 20 ms','Minor','TWAMP'],['Gián đoạn terminal','> 60 s trong 15 phút','Minor','API terminal (cần đối chiếu)'],
 ['% bầu trời bị che','> 2 %','Warning','API terminal (cần đối chiếu)'],['IPsec SA','down hoặc rekey thất bại','Critical','SeGW'],['S1/NG link','down','Critical','eNB/gNB, MME/AMF'],['GTP-U path','echo thất bại','Major','eNB/gNB, SGW/UPF'],['GNSS','mất khoá > 5 phút','Major','trạm'],['Ắc quy','< 30 %','Critical','rectifier']];
const STLPRB={tel:'Telemetry terminal (API)',ping:'Ping từ CSR: PoP, IP công khai SeGW',twamp:'TWAMP CSR ↔ SeGW (EF, BE)',df:'Ping DF 1 300/1 400/1 472 B qua đường hầm',ike:'show ike/ipsec sa ở SeGW',sctp:'SCTP, S1/NG, GTP-U echo ở trạm',pwr:'Nguồn và GNSS',nbr:'So với trạm cùng vùng/gateway',kpi:'KPI 15 phút của trạm'};
function stlProbe(k){const P=STLP.mon,M=stlMonState(P.site,STLS.mclk),s=STLSITE[P.site],C=stlCore(),f=M.f,y=v=>v?'ĐẠT':'THẤT BẠI';
  switch(k){
  case 'tel':return M.on?`state: ONLINE\nsnr_db: ${nF(M.snr,1)}  (bình thường 9–12)\nfraction_obstructed: ${nF(M.obsx,1)} %\noutage_s_last_15min: ${nF(M.outs,0)}\npop_ping_latency_ms: ${M.pop?nF(M.rtt?M.rtt-6:0,0):'timeout'}\npop_ping_drop: ${M.pop?nF(M.loss,1)+' %':'100 %'}\n(tên trường minh hoạ — cần đối chiếu API thực tế)`:'Không kết nối được terminal (mất nguồn hoặc mất quản lý).';
  case 'ping':return !M.on?'CSR không trả lời (mất nguồn?).':`ping PoP: ${M.pop?'OK '+stlMs(M.rtt-6)+', mất '+stlPct(M.loss,1):'100 % mất'}\nping IP công khai SeGW: ${M.pop?'OK '+stlMs(M.rtt+2):'100 % mất'}`;
  case 'twamp':return !M.on||!M.pop?'TWAMP: không có phản hồi (100 % mất).':M.ike!=='up'?'TWAMP trong đường hầm: 100 % mất (đường hầm chưa lên).':`TWAMP EF: RTT p50 ${stlMs(M.rtt)}, p95 ${stlMs(M.rtt*1.35)}, jitter ${stlMs(3+M.u*8)}, mất ${stlPct(M.loss,2)}\nTWAMP BE: RTT p95 ${stlMs(M.rtt*1.5)}, mất ${stlPct(M.loss*1.2,2)}`;
  case 'df':return !M.on||!M.pop||M.ike!=='up'?'Không thử được (đường hầm chưa lên).':`DF 1300 B: ${y(1)}\nDF 1400 B: ${y(M.big)}\nDF 1472 B: ${y(M.big&&0)} ${M.big?'(bình thường: 1472 + overhead > MTU)':'(ICMP frag-needed không về / bị chặn)'}`;
  case 'ike':return M.ike==='up'?`IKE SA: ESTABLISHED (NAT-T, UDP 4500), rekey gần nhất OK\nIPsec SA: 2 cặp, byte vào/ra tăng đều`:M.ike.indexOf('AUTH')>=0?'IKE_AUTH: AUTHENTICATION_FAILED\nlý do: chứng thư trạm hết hạn (notAfter < hiện tại)\nIKE_SA_INIT: OK (thấy được trạm qua NAT-T)':'IKE SA: không có (không nhận được IKE_SA_INIT từ trạm)';
  case 'sctp':return M.s1==='up'?`SCTP ${C.ap}: ESTABLISHED, HB OK, retransmission ${f==='obs'?'cao':'thấp'}\nGTP-U echo: OK\n${C.ap} Setup: OK`:`SCTP ${C.ap}: CLOSED (Association.Max.Retrans vượt)\nGTP-U echo: thất bại\nThử INIT mỗi 10 s`;
  case 'pwr':return `Nguồn: ${M.pw}\nGNSS: ${M.gn?'khoá':'MẤT KHOÁ, holdover '+stlS(M.tf)}`;
  case 'nbr':{const o=STLSITE.map((x,i)=>i===P.site?null:`${x.n} (${x.gw}): ${stlAff(i)?'CŨNG LỖI':'bình thường'}${f==='rain'&&Math.abs(i-P.site)===1?' · đang có mưa':''}${f==='cong'&&x.gw===s.gw?' · RTT giờ cao điểm cao hơn thường lệ':''}`).filter(Boolean);return o.join('\n');}
  case 'kpi':return M.cell?`RRC SR: ${M.cell===1?'99,6 %':'giảm (cell TDD tắt)'}\n${C.core==='5GC'?'QoS flow':'E-RAB'} drop: ${f==='obs'||f==='rain'?'0,9 %':'0,2 %'}\nThông lượng UE TB: ${nF(M.dl*0.3,0)} Mbit/s${M.big?'':' (TCP truyền lại 8 %)'}\nVoLTE MOS: ${nF(M.mos,1)}`:'Cell không phục vụ: không có KPI.';}
  return '';}
const STLTREE={q:'Nguồn trạm và CSR có điện?',n:{c:'pwr'},y:{q:'Terminal online ổn định (SNR tốt, không gián đoạn lặp lại)?',n:{q:'% bầu trời bị che cao?',y:{c:'obs'},n:{q:'SNR thấp, đang mưa (radar, trạm lân cận)?',y:{c:'rain'},n:{l:'Terminal/cáp/PoE hỏng: thay thiết bị'}}},
 y:{q:'Ping PoP tốt?',n:{q:'Nhiều trạm cùng gateway cùng lỗi?',y:{c:'pop'},n:{l:'Mở ticket nhà cung cấp kèm traceroute'}},y:{q:'RTT/thông lượng xấu vào giờ cao điểm dù SNR tốt?',y:{c:'cong'},n:{q:'IKE/IPsec SA lên?',n:{c:'ike'},y:{q:'Gói lớn có DF qua được đường hầm?',n:{c:'mtu'},y:{q:'GNSS khoá?',n:{c:'gnss'},y:{l:'Không phải truyền dẫn: xem RAN/lõi'}}}}}}}};
function stlTreeHtml(hit){const path=[];const find=(nd,acc)=>{if(nd.c===hit){path.push(...acc,nd);return true;}if(nd.q){return find(nd.y,acc.concat(nd))||find(nd.n,acc.concat(nd));}return false;};if(hit)find(STLTREE,[]);
  const rd=(nd,lab)=>{const h=path.includes(nd)?' hit':'';if(nd.q)return `<li class="${h}"><span>${lab?'<b>'+lab+'</b> → ':''}${nE(nd.q)}</span><ul>${rd(nd.y,'Có')}${rd(nd.n,'Không')}</ul></li>`;
    return `<li class="leaf${h}"><span><b>${lab}</b> → ${nE(nd.c?STLFI[nd.c].n:nd.l)}</span></li>`;};
  return `<ul class="stltree">${rd(STLTREE,'')}</ul>`;}
function stlGameHtml(){const G=STLS.game,P=STLP.mon;if(!G)return `<p class="note">Bấm «Tiêm lỗi ngẫu nhiên» để bắt đầu: một trạm sẽ gặp một sự cố ẩn. Xem dashboard, cảnh báo, chạy các lệnh kiểm tra rồi chọn đoạn hỏng và nguyên nhân. Điểm: đúng đoạn 40, đúng nguyên nhân 40, nhanh tối đa 20, mỗi lệnh kiểm tra sau lệnh thứ 3 trừ 3 điểm.</p>${STLS.hist&&STLS.hist.length?`<p class="e2d">Lịch sử: ${STLS.hist.map(h=>h.s+' điểm ('+nE(STLFI[h.f].n)+')').join(' · ')}</p>`:''}`;
  return `<p class="e2d">Sự cố ẩn đang ở <b>${nE(STLSITE[G.si].n)}</b>. Đã dùng ${G.pr.length} lệnh kiểm tra.</p><div class="row">${Object.entries(STLPRB).map(([k,v])=>`<button type="button" class="btn sm" data-stla="mon:probe:${k}"${G.done?' disabled':''}>${nE(v)}</button>`).join('')}</div>
   <div class="stlout" id="stlPOut">${G.pr.length?G.pr.map(p=>'$ '+STLPRB[p[0]]+'\n'+nE(p[1])).join('\n\n'):'Chưa chạy lệnh nào.'}</div>
   ${G.done?stlRevealHtml():`<div class="ctl">${stlSel('mon','ans','Đoạn hỏng',[['','— chọn —']].concat(STLSEGS.map(x=>[x[0],x[1]])))}${stlSel('mon','cause','Nguyên nhân',[['','— chọn —']].concat(Object.entries(STLFI).filter(x=>x[0]!=='none').map(([k,v])=>[k,v.n])))}</div><div class="row"><button type="button" class="btn" data-stla="mon:submit">Nộp kết luận</button><button type="button" class="btn sm" data-stla="mon:giveup">Xem đáp án</button></div>`}`;}
function stlRevealHtml(){const G=STLS.game,F=STLFI[G.fid];return `<p class="stlscore">${G.score} / 100 điểm</p><dl class="kv">${stlKv('Đáp án',`<b>${nE(F.n)}</b> — đoạn «${nE(STLSEGS.find(x=>x[0]===F.seg)[1])}»`)}${stlKv('Bạn chọn',G.ans?nE((STLSEGS.find(x=>x[0]===G.ans.seg)||['','—'])[1])+' · '+nE((STLFI[G.ans.c]||{n:'—'}).n):'xem đáp án')}${stlKv('Chi tiết điểm',nE(G.why||''))}${stlKv('Cách xử lý',nE(STLFX[G.fid]))}</dl>
   <p class="e2x"><b>Đường đi trên cây RCA</b>:</p>${stlTreeHtml(G.fid)}<div class="row"><button type="button" class="btn sm" data-stla="mon:inject">🎲 Lỗi khác</button><button type="button" class="btn sm" data-stla="mon:clear">Xoá lỗi</button></div>`;}
const STLQOS=[['Báo hiệu S1-C/NG-C (SCTP), X2-C/Xn-C','CS5 (40) hoặc AF31','Ưu tiên cao, không bỏ','cần đối chiếu quy hoạch DSCP nhà mạng'],['Thoại VoLTE/VoNR (QCI/5QI 1)','EF (46)','Ưu tiên tuyệt đối (LLQ) có giới hạn','gói nhỏ, 50 gói/s mỗi chiều'],
 ['Báo hiệu IMS SIP (QCI/5QI 5)','AF41 hoặc CS5','Ưu tiên cao',''],['Video thoại, GBR (QCI 2–4)','AF41/AF42','WFQ trọng số cao',''],['Dữ liệu ưu tiên (QCI 6–8)','AF21/AF11','WFQ',''],['Dữ liệu thường (QCI 9)','BE (0)','Phần còn lại',''],['OAM, giám sát','CS2 (16)','WFQ thấp','TWAMP gửi cả EF và BE để so sánh'],['Đồng bộ PTP','—','Không dùng qua vệ tinh','đồng bộ bằng GNSS tại trạm']];
function stlQosSim(mode){stlLinkRun();const o=STLS.win,P=STLP.mon,R=STLP.ran,vb=stlOvh(STLCOD[R.codec][1]+12+8+(R.ipv===6?40:20)).tot*8*50/1e6,V=P.nv*vb,sg=0.15,cap=[],caps=[],st=STLS.winSt,sh=Math.max(1,(st.ul10||5)*0.85);
  let qt=0,qv=0,qd=0,vd=[],vl=0,vt=0,dd=0;const B=0.5,rng=nRng(9);
  for(let s=0;s<120;s++){let c=0,k=0;for(let i=s*10;i<s*10+10&&i<o.n;i++){c+=o.ul[i];k++;}c=k?c/k:0;const off=V+sg+Math.max(c,sh)*1.4*(0.8+0.4*rng());
    if(mode==='none'||mode==='prio'){const inp=off;qt=Math.max(0,qt+inp-c);const lim=Math.max(0.5,c*B);let lo=0;if(qt>lim){lo=(qt-lim)/inp;qt=lim;}const d=c>0?qt/c*1000:2000;vd.push([s,Math.min(2000,d+(o.rtt[s*10]||60)/2)]);vl+=lo*V;vt+=V;dd+=Math.min(c,inp)-V*(1-lo);}
    else{const cs=Math.min(sh,c),vs=Math.min(V,cs),rem=Math.max(0,cs-vs-sg);qd=Math.max(0,Math.min(sh*0.1,qd+off-V-sg-rem));const tq=Math.max(0,qt+Math.min(sh,off)-c);qt=Math.min(tq,Math.max(0.5,c*B));const d=c>0?qt/c*1000:2000;vd.push([s,Math.min(2000,d+(o.rtt[s*10]||60)/2+2)]);vl+=Math.max(0,V-vs);vt+=V;dd+=rem;}}
  return {vd,vl:vt?vl/vt*100:0,p95:stlQ(vd.map(x=>x[1]),95),dd:dd/120,V,sh};}
function stlQosHtml(){const P=STLP.mon,r={none:stlQosSim('none'),prio:stlQosSim('prio'),shape:stlQosSim('shape')},c=r[P.qos],ym=Math.max(200,Math.ceil(Math.max(...c.vd.map(x=>x[1]))/100)*100);
  return `<div class="scroll"><div class="stlwn">${nPlot({w:STLPW,h:150,pl:STLPL,x0:0,x1:120,y0:0,y1:ym,xt:[0,30,60,90,120],xf:v=>v+' s',yt:[0,ym/2,ym],ylab:'trễ thoại ms',series:[{pts:c.vd,c:'var(--acc)',w:1.6}],hl:[[150,'#E5484D','150 ms']],aria:'Trễ thoại'})}</div></div>
   <div class="scroll"><table class="ndtb"><thead><tr><th>Cách làm (chiều lên, ${P.nv} cuộc gọi, ${nF(c.V,2)} Mbit/s thoại)</th><th>Trễ thoại p95</th><th>Mất gói thoại</th><th>Dữ liệu TB</th></tr></thead><tbody>
   ${[['none','Không QoS, hàng đợi FIFO ở terminal'],['prio','DSCP + ưu tiên ở CSR, không shaping (hàng đợi vẫn ở terminal)'],['shape','DSCP + ưu tiên + shaping CSR ở '+nF(c.sh,1)+' Mbit/s (85 % p10)']].map(([k,n])=>`<tr${k===P.qos?' style="font-weight:700"':''}><td>${nE(n)}</td><td class="${r[k].p95>150?'stlno':'stlok'}">${stlMs(r[k].p95)}</td><td>${stlPct(r[k].vl,2)}</td><td>${stlMb(r[k].dd)}</td></tr>`).join('')}</tbody></table></div>
   <p class="note">Nhà cung cấp vệ tinh thường không tôn trọng DSCP bên trong đường hầm (DSCP có được chép ra header ngoài hay không tuỳ cấu hình, cần đối chiếu). Đánh dấu DSCP mà không shaping thì hàng đợi vẫn nằm ở terminal (FIFO, bufferbloat) nên thoại vẫn trễ. Shaping ở CSR thấp hơn năng lực terminal đưa hàng đợi về CSR, nơi ưu tiên EF có tác dụng; đổi lại mất một phần dung lượng. Khi năng lực tụt dưới mức shaping (mưa, gián đoạn), hàng đợi lại dồn về terminal.</p>`;}
function stlSla(){const P=STLP.mon,R=stlDet(),m=+P.mth||7,wet=m>=5&&m<=10,T=R.ta,res=[];
  STLSITE.forEach((s,si)=>{const r=nRng(1000+si*37+m*7),obsP=stlSkyObsPct({emin:25,obs:s.obs}),gwE=[],rd=[],pwE=[];
    const gr=nRng(500+m*13+(+s.gw.slice(1))*101);for(let k=0;k<2;k++)if(gr()<0.6)gwE.push([Math.floor(gr()*43200),10+Math.floor(gr()*50)]);
    for(let d=0;d<30;d++){if(r()<(wet?0.45:0.12))rd.push([d*1440+(14+Math.floor(r()*7))*60,20+Math.floor(r()*70),s.rain*(0.3+0.7*r())]);if(s.pwr==='solar'&&r()<(wet?0.04:0.01))pwE.push([d*1440+240,60+Math.floor(r()*180)]);}
    let out=0,run=0,drops=0,rt=[],ls=[],mos=0;for(let i=0;i<43200;i++){const h=Math.floor(i/60)%24,u=nC(s.load/100*STLDAY[h]/100,0,0.97);let os=Math.min(60,obsP/100*60*0.15*2*r()),R2=0;
      for(const e of rd)if(i>=e[0]&&i<e[0]+e[1]){const x=(i-e[0]-e[1]/2)/(e[1]/2.5);R2=e[2]*Math.exp(-x*x);}
      if(R2>0){const sn=11-stlRainA(R2,'ku_dl',45,5);if(sn<-2.4)os=60;else if(sn<1)os=Math.max(os,20);}
      for(const e of gwE)if(i>=e[0]&&i<e[0]+e[1])os=60;if(s.mw&&os<60)os=0;else if(s.mw)os=0;let pw=0;for(const e of pwE)if(i>=e[0]&&i<e[0]+e[1])pw=1;if(pw)os=60;
      out+=os;if(os>=30){run+=os;}else{if(run>=T)drops++;run=0;}
      const rr=36+30*u*u/(1-u+0.1)+r()*8+(R2>0?10:0),ll=0.2+r()*0.3+(u>0.85?(u-0.85)*10:0)+(R2>0?2:0)+os/60*100*0.02;rt.push(rr);ls.push(ll);
      const Id=0.024*(95+rr/2+40),Ie=5+90*ll/(ll+10),Rf=93.2-Id-Ie;mos+=Rf<0?1:1+0.035*Rf+Rf*(Rf-60)*(100-Rf)*7e-6;}
    if(run>=T)drops++;res.push({s,av:100*(1-out/(43200*60)),om:out/60,p95:stlQ(rt,95),l95:stlQ(ls,95),drops,mos:mos/43200});});
  return res;}
function stlSlaHtml(){const P=STLP.mon,R=STLS.sla||(STLS.sla=stlSla());
  return `<div class="scroll"><table class="ndtb"><thead><tr><th>Trạm</th><th>Sẵn sàng</th><th>Phút gián đoạn</th><th>RTT p95</th><th>Mất gói p95</th><th>Lần đứt ${nE(stlCore().ap)}</th><th>MOS TB</th><th>SLA ${nF(P.slat,1)} %</th></tr></thead><tbody>
   ${R.map(x=>`<tr><td>${nE(x.s.n)}${x.s.mw?' <span class="u3tag">+viba</span>':''}</td><td>${stlPct(x.av,3)}</td><td>${nF(x.om,0)}</td><td>${stlMs(x.p95)}</td><td>${stlPct(x.l95,2)}</td><td>${x.drops}</td><td>${nF(x.mos,2)}</td><td class="${x.av>=P.slat?'stlok':'stlno'}">${x.av>=P.slat?'Đạt':'Không đạt'}</td></tr>`).join('')}</tbody></table></div>
   <p class="e2x"><b>Phút gián đoạn trong tháng</b></p>${nBars(R.map(x=>[x.s.n.split(' · ')[0],x.om,x.av>=P.slat?'var(--up)':'#E5484D']),Math.max(10,...R.map(x=>x.om)),' phút',0)}<div class="row"><button type="button" class="btn sm" data-stla="mon:csv">⬇ Tải CSV</button></div>
   <p class="note">Mô phỏng từng phút trong 30 ngày: che khuất theo bản đồ vật cản từng trạm, mưa theo mùa (tháng 5–10 nhiều mưa), sự cố gateway dùng chung (trạm B, C, D cùng G2), mất điện trạm dùng pin mặt trời; trạm có viba dự phòng bỏ qua gián đoạn vệ tinh. «Lần đứt» đếm các gián đoạn dài hơn thời gian phát hiện SCTP ở mục 3 (${stlS(stlDet().ta)}).</p>`;}
function stlCsv(){const R=STLS.sla||(STLS.sla=stlSla()),rows=[['site','availability_pct','outage_min','rtt_p95_ms','loss_p95_pct','s1ng_drops','mos']].concat(R.map(x=>[x.s.n,x.av.toFixed(3),x.om.toFixed(0),x.p95.toFixed(1),x.l95.toFixed(2),x.drops,x.mos.toFixed(2)]));
  try{const b=new Blob(['﻿'+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n')],{type:'text/csv'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='bao-cao-sla-leo.csv';document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}catch(e){}}
function stlMonUpd(){stlSet('stlSeg',stlSegHtml());stlSet('stlSpark',stlSpark());stlSet('stlAlm',stlAlmHtml());stlSet('stlClk',`<b>${stlClk(STLS.mclk)}</b> · ${nE(STLSITE[STLP.mon.site].n)}${STLS.mg&&STLS.mg.vis?' · lỗi đang tiêm: '+nE(STLFI[STLS.mg.fid].n):STLS.mg&&!STLS.mg.vis?' · <b>có sự cố ẩn</b>':''}`);}
function stlMonStep(){const P=STLP.mon,M=stlMonState(P.site,STLS.mclk);STLS.mh=STLS.mh||[];STLS.mh.push({r:M.rtt,l:M.loss});if(STLS.mh.length>60)STLS.mh.shift();}
function stlInject(fid,vis){const P=STLP.mon,keys=Object.keys(STLFI).filter(k=>k!=='none');const r=nRng(Math.floor(performance.now())%100000);if(!fid)fid=keys[Math.floor(r()*keys.length)];
  let si=P.site;if(!vis){si=fid==='pop'?[1,2,3][Math.floor(r()*3)]:Math.floor(r()*6);}if(fid==='cong')STLS.mclk=20.5*3600;
  STLS.mg={fid,si,t:STLS.mclk-(vis?0:90),vis};P.site=si;STLS.mh=[];if(!vis){STLS.game={fid,si,t0:performance.now(),pr:[],done:false};P.ans='';P.cause='';}else STLS.game=null;}
STLR.mon={
 html(){const P=STLP.mon;if(!STLS.mclk)STLS.mclk=19.5*3600;if(!STLS.mh||!STLS.mh.length)for(let i=0;i<20;i++){STLS.mclk+=30;stlMonStep();}
  return `<div class="panel"><h3>Dashboard toàn trình theo đoạn</h3>
   <div class="ctl">${stlSel('mon','site','Trạm',STLSITE.map((s,i)=>[i,s.n+' (gateway '+s.gw+')']))}${stlSel('mon','fault','Tiêm lỗi chọn trước (hiện)',Object.entries(STLFI).map(([k,v])=>[k,v.n]))}</div>
   <div class="row">${stlPlayBtn('mon','stlMPlay')}<span id="stlClk"></span></div><div id="stlSeg">${stlSegHtml()}</div><div id="stlSpark">${stlSpark()}</div>
   <p class="note">Đồng hồ chạy nhanh 30 lần. Mỗi đoạn lấy số đo từ một nguồn khác nhau: KPI ở OSS, cảnh báo trạm, telemetry terminal (API của nhà cung cấp, tên trường cần đối chiếu), đo chủ động TWAMP, bộ đếm IKE/IPsec ở SeGW, SCTP/S1/NG ở lõi. Không nguồn nào một mình đủ để biết đoạn nào hỏng.</p></div>
  <div class="panel"><h3>Cảnh báo và tương quan sự cố</h3><div class="ctl">${stlChk('mon','raw','Xem danh sách thô (chưa tương quan)')}</div><div id="stlAlm">${stlAlmHtml()}</div>
   <details><summary><b>Ngưỡng cảnh báo đề nghị</b></summary><div class="scroll"><table class="ndtb"><thead><tr><th>Chỉ số</th><th>Ngưỡng</th><th>Mức</th><th>Nguồn</th></tr></thead><tbody>${STLTHR.map(r=>`<tr>${r.map(x=>`<td>${nE(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>
   <details><summary><b>Đo chủ động và thụ động</b></summary><ul class="u3ul"><li><b>TWAMP</b> (RFC 5357) hoặc TWAMP Light/STAMP từ CSR tới SeGW hoặc router lõi, chạy cả lớp EF và BE, chu kỳ 1 s, báo cáo 15 phút: trễ, jitter, mất gói hai chiều. Đây là số đo chính cho KPI backhaul.</li><li><b>Ping/traceroute</b> tới PoP và IP công khai SeGW: tách lỗi phía vệ tinh với phía Internet/nhà mạng.</li><li><b>iperf</b> theo lịch thấp điểm: đo năng lực thật UL/DL (không chạy giờ cao điểm).</li><li><b>Y.1731</b> chỉ dùng trong miền Ethernet của nhà mạng (CSR ↔ router hội tụ khi có viba); không đi qua Internet vệ tinh.</li><li><b>Thụ động</b>: bộ đếm IKE/IPsec (SA, rekey, gói giải mã lỗi), SCTP (retransmission, path down), GTP-U echo, S1/NG setup; KPI RAN theo trạm.</li><li><b>Terminal</b>: SNR, % che khuất, thời gian gián đoạn, trễ và mất gói tới PoP qua API của thiết bị (cần đối chiếu tên trường và quyền truy cập).</li></ul>
   <p class="note">Xem cách thẻ Cảnh báo xử lý sự cố chung: <button type="button" class="u3lnkbtn" data-tab="al">thẻ Cảnh báo, sự cố</button>; TWAMP, Y.1731 chi tiết: <button type="button" class="u3lnkbtn" data-tab="tx">thẻ Truyền dẫn</button>.</p></details></div>
  <div class="panel"><h3>Tiêm lỗi có chấm điểm: tìm đúng đoạn hỏng</h3><div class="row"><button type="button" class="btn" data-stla="mon:inject">🎲 Tiêm lỗi ngẫu nhiên (ẩn)</button><button type="button" class="btn sm" data-stla="mon:clear">Xoá lỗi</button></div><div id="stlGame">${stlGameHtml()}</div>
   <details><summary><b>Cây RCA đầy đủ</b></summary>${stlTreeHtml(STLS.mg&&STLS.mg.vis?STLS.mg.fid:'')}</details></div>
  <div class="panel"><h3>QoS: DSCP và ưu tiên trên router trạm</h3><div class="scroll"><table class="ndtb"><thead><tr><th>Lưu lượng</th><th>DSCP</th><th>Xử lý ở CSR</th><th>Ghi chú</th></tr></thead><tbody>${STLQOS.map(r=>`<tr>${r.map(x=>`<td>${nE(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
   <div class="ctl">${stlSel('mon','qos','Cách làm',[['none','Không QoS'],['prio','DSCP + ưu tiên, không shaping'],['shape','DSCP + ưu tiên + shaping']])}${stlSl('mon','nv','Số cuộc gọi VoLTE đồng thời',1,60,1,v=>v)}</div><div id="stlQos">${stlQosHtml()}</div></div>
  <div class="panel"><h3>Báo cáo SLA tháng theo trạm</h3><div class="ctl">${stlSel('mon','mth','Tháng',Array.from({length:12},(_,i)=>[i+1,'Tháng '+(i+1)]))}${stlSl('mon','slat','Mục tiêu sẵn sàng',98,99.99,0.01,v=>nF(v,2)+' %')}</div><div id="stlSla">${stlSlaHtml()}</div></div>`;},
 after(){stlMonUpd();},
 tick(dt){if(STLS.pause)return;STLS.mclk+=dt*30;STLS.mt=(STLS.mt||0)+dt;if(STLS.mt>=1){STLS.mt=0;stlMonStep();stlMonUpd();}},
 upd(k){const P=STLP.mon;if(k==='site'){STLS.mh=[];for(let i=0;i<20;i++){STLS.mclk+=30;stlMonStep();}stlMonUpd();}else if(k==='fault'){if(P.fault==='none'){STLS.mg=null;STLS.game=null;}else stlInject(P.fault,true);renderLeo();}
  else if(k==='raw')stlSet('stlAlm',stlAlmHtml());else if(k==='qos'||k==='nv')stlSet('stlQos',stlQosHtml());else if(k==='mth'){STLS.sla=null;stlSet('stlSla',stlSlaHtml());}else if(k==='slat')stlSet('stlSla',stlSlaHtml());},
 act(a){const [x,k]=a.split(':'),P=STLP.mon,G=STLS.game;
  if(x==='play')stlPlayTog('stlMPlay');else if(x==='seg'){P.seg=P.seg===k?'':k;stlSet('stlSeg',stlSegHtml());}
  else if(x==='inject'){P.fault='none';stlInject('',false);renderLeo();}else if(x==='clear'){STLS.mg=null;STLS.game=null;P.fault='none';STLS.mh=[];renderLeo();}
  else if(x==='probe'&&G&&!G.done){G.pr.push([k,stlProbe(k)]);stlSet('stlGame',stlGameHtml());const o=document.getElementById('stlPOut');if(o)o.scrollTop=o.scrollHeight;}
  else if((x==='submit'||x==='giveup')&&G&&!G.done){const F=STLFI[G.fid];let sc=0,why=[];if(x==='submit'){if(P.ans===F.seg){sc+=40;why.push('đúng đoạn +40');}else why.push('sai đoạn');if(P.cause===G.fid){sc+=40;why.push('đúng nguyên nhân +40');}else why.push('sai nguyên nhân');
     const el=(performance.now()-G.t0)/1000,tb=Math.max(0,Math.round(20-el/15));sc+=tb;why.push('nhanh +'+tb+' ('+nF(el,0)+' s)');const pen=Math.max(0,G.pr.length-3)*3;sc=Math.max(0,sc-pen);if(pen)why.push('lệnh kiểm tra −'+pen);G.ans={seg:P.ans,c:P.cause};}else why.push('xem đáp án: 0 điểm');
   G.done=true;G.score=sc;G.why=why.join(', ');STLS.hist=(STLS.hist||[]).concat([{s:sc,f:G.fid}]).slice(-6);STLS.mg.vis=true;stlSet('stlGame',stlGameHtml());}
  else if(x==='csv')stlCsv();}
};

/* ---------- Mục 6: Tham số, KPI, lỗi ---------- */
const STLPAR=[
 ['hb','SCTP','SCTP heartbeat interval','SCTP template: heartbeat interval','SCTP profile: heartbeat interval','SctpProfile: heartbeatInterval','5 s (RFC 30 s)','Đường vệ tinh: 5–10 s để phát hiện nhanh nhưng không quá nhạy'],
 ['rtoi','SCTP','RTO.Initial','SCTP template: RTO initial','SCTP profile: RTO initial','SctpProfile: initialRto','1 s (RFC 3 s)','Phải lớn hơn RTT p99 (~100 ms)'],
 ['rtomin','SCTP','RTO.Min','SCTP template: RTO min','SCTP profile: RTO min','SctpProfile: minimumRto','0,5 s (RFC 1 s)','Không đặt dưới 2 × RTT p99 của vệ tinh'],
 ['rtomax','SCTP','RTO.Max','SCTP template: RTO max','SCTP profile: RTO max','SctpProfile: maximumRto','4 s (RFC 60 s)','Quyết định thời gian phát hiện'],
 ['pmr','SCTP','Path.Max.Retrans','SCTP template: path max retransmissions','SCTP profile: path max retransmissions','SctpProfile: pathMaxRetrans','3 (RFC 5)',''],
 ['amr','SCTP','Association.Max.Retrans','SCTP template: association max retransmissions','SCTP profile: association max retransmissions','SctpProfile: assocMaxRetrans','5 (RFC 10)','Tăng để S1/NG sống qua gián đoạn ngắn do che khuất'],
 ['sinit','SCTP','Chu kỳ thử INIT lại','S1 interface: retry timer','S1/NG link: reconnect timer','SctpProfile: maxInitRetrans / init timer','10 s','Rải ngẫu nhiên để tránh bão khi hồi phục'],
 ['dpd','IPsec/IKE','IKE DPD (liveness) interval','IKE peer: DPD interval','IPsec: DPD interval','IkePeer: dpdTime','10 s','Ngắn hơn thời gian phát hiện SCTP'],
 ['dpdr','IPsec/IKE','Số lần thử DPD','IKE peer: DPD retransmissions','IPsec: DPD retries','IkePeer: dpdRetries','4',''],
 ['ikel','IPsec/IKE','IKE SA lifetime','IKE proposal: lifetime','IKE policy: lifetime','IkePeer: ikeSaLifetime','86 400 s','Rekey lệch giờ cao điểm'],
 ['ipsl','IPsec/IKE','IPsec (Child) SA lifetime','IPsec proposal: lifetime','IPsec policy: lifetime','IpsecProposal: lifetime','3 600 s',''],
 ['natka','IPsec/IKE','NAT-T keepalive','IKE: NAT keepalive','IPsec: NAT-T keepalive','IkePeer: natKeepAlive','20 s (RFC 3948)','Giữ ánh xạ CGNAT'],
 ['esp','IPsec/IKE','Thuật toán ESP','IPsec proposal: encryption/integrity','IPsec policy: transforms','IpsecProposal: encryptionAlgorithm','AES-GCM-128','GCM ít overhead hơn CBC + HMAC'],
 ['ikeau','IPsec/IKE','Xác thực IKE','PKI: certificate, CMPv2','PKI: CMPv2 enrolment','Certificate management: CMPv2','Chứng thư X.509, CMPv2','Theo dõi hạn chứng thư, NTP'],
 ['echo','GTP-U','GTP-U Echo interval','GTP-U: echo interval','GTP-U: echo interval','GtpuSupervision: echoInterval','60 s (TS 29.281 gợi ý ≥ 60 s)',''],
 ['t3n3','GTP-U','T3-RESPONSE, N3-REQUESTS','GTP-U: T3, N3','GTP-U: T3, N3','GtpuSupervision: t3, n3','3 s, 3',''],
 ['mtu','MTU/QoS','MTU giao diện, đường hầm','Interface: MTU','IP interface: MTU','IpInterface: mtu','1 500 B (đo bằng ping DF)','Đường vệ tinh có thể nhỏ hơn'],
 ['mss','MTU/QoS','TCP MSS clamping','CSR: tcp adjust-mss','CSR: tcp-mss','PGW/UPF: MSS adjust','≈ 1 300–1 360 B','Theo kết quả mục 3'],
 ['dscpc','MTU/QoS','DSCP báo hiệu S1/NG','DIFFPRI: signalling DSCP','QoS profile: signalling DSCP','Dscp: s1Signalling','CS5 hoặc AF31','Theo quy hoạch DSCP nhà mạng'],
 ['dscpv','MTU/QoS','DSCP thoại QCI/5QI 1','QCI 1: DSCP','QCI 1: DSCP','QciProfile: dscp','EF (46)',''],
 ['shape','MTU/QoS','Shaping chiều lên ở CSR','CSR: port shaping','CSR: egress rate','CSR: shaper','85 % năng lực p10 terminal','Đưa hàng đợi về CSR'],
 ['gnss','Đồng bộ','Nguồn đồng bộ và holdover','Clock source: GNSS, holdover','Sync: GNSS receiver, holdover','RadioEquipmentClock: GNSS, holdover','GNSS tại trạm, OCXO/Rb','PTP không đi qua vệ tinh'],
 ['twamp','Giám sát','TWAMP chu kỳ và ngưỡng','NQA/TWAMP: interval, threshold','OAM-PM: TWAMP Light','TWAMP: session interval','1 s, báo cáo 15 phút','RTT p95 > 100 ms, mất > 1 %'],
 ['rtp','Giám sát','Hết giờ RTP/RTCP ở IMS','P-CSCF/SBC: media timeout','P-CSCF: RTP inactivity','SBC: media inactivity timer','20 s','Ngắn quá thì rớt cuộc gọi khi che khuất'],
 ['s1rt','Giám sát','Báo cảnh báo S1/NG down sau','Alarm delay','Alarm filter','Alarm delay','10–30 s','Lọc cảnh báo chập chờn']];
const STLKPI=[['RTT backhaul p95 (TWAMP)','p95 của RTT TWAMP trong 15 phút','NQA/TWAMP RTT','OAM-PM TWAMP RTT','TWAMP RTT','≤ 80 ms (giờ bận ≤ 100 ms)','link','stl_lat'],['Sẵn sàng đường vệ tinh','100 × (1 − thời gian gián đoạn / thời gian đo)','Terminal outage + TWAMP','Terminal outage + TWAMP','Terminal outage + TWAMP','≥ 99,5 %','mon','stl_avail'],
 ['Mất gói backhaul','100 × gói TWAMP mất / gói gửi','NQA loss','OAM-PM loss','TWAMP loss','≤ 0,5 %','link','stl_loss'],['Jitter backhaul','trung bình |ΔRTT| giữa hai gói liên tiếp','NQA jitter','OAM-PM jitter','TWAMP jitter','≤ 10 ms','link','stl_jit'],
 ['Số lần đứt S1/NG mỗi trạm-ngày','số lần S1/NG link down / (số trạm × số ngày)','S1 link fault alarm','S1/NG link failure','S1/NG link down','≤ 0,5','ran','stl_s1'],['BadLink (trễ, jitter, mất gói)','phần trăm link không đạt','NQA','OAM-PM','TWAMP','≤ 2 %','mon','t_bad'],
 ['GNSS và đồng bộ trạm','số vệ tinh GNSS, trạng thái holdover','Clock alarm','Sync alarm','Sync alarm','≥ 4 vệ tinh, không holdover','ran','t_gnss'],['Rớt E-RAB theo trạm','E-RAB rớt bất thường / E-RAB','L.E-RAB.AbnormRel','ERAB drop','pmErabRelAbnormal','≤ 1 %','ran','erabdrop4']];
const STLFLT=[['S1/NG chập chờn theo che khuất','Cảnh báo S1/NG down–up lặp lại vài lần mỗi giờ, cell OOS ngắn.',['Vật cản (cây, nhà) che một phần bầu trời','SCTP RTO.max/Association.Max.Retrans quá nhỏ'],['Telemetry % che khuất, bản đồ vật cản','So thời gian gián đoạn với thời gian phát hiện SCTP (mục 3)'],{h:'S1 link fault (cần đối chiếu)',n:'S1/NG link failure (cần đối chiếu)',e:'S1 link down (cần đối chiếu)'},'stl_s1, stl_avail','ran'],
 ['IPsec không dựng lại sau khi đổi IP CGNAT','Terminal hồi phục, nhưng đường hầm không lên hoặc lên chậm.',['SeGW ràng buộc định danh theo IP','Ánh xạ NAT-T cũ còn ở SeGW','Không có MOBIKE'],['Xem IP nguồn trên SeGW','Định danh IKE theo chứng thư (DN/FQDN)','Bật MOBIKE, NAT-T keepalive'],{h:'IPsec tunnel fault',n:'IPsec tunnel down',e:'IPsec tunnel failure'},'stl_avail','arch'],
 ['Thông lượng thấp, web treo, thoại bình thường','Gói nhỏ qua được, gói lớn mất.',['MTU sau IPsec + NAT-T vượt MTU đường vệ tinh','Không MSS clamping','ICMP frag-needed bị chặn'],['Ping DF nhiều cỡ','Bộ đếm phân mảnh ở CSR/SeGW','Kiểm MSS trong SYN'],{h:'(không có cảnh báo)',n:'(không có cảnh báo)',e:'(không có cảnh báo)'},'t_bad','ran'],
 ['Thoại «tích» đều mỗi ~15 s','Mất 1–3 gói RTP định kỳ.',['Gai trễ, mất gói khi mạng vệ tinh cấu hình lại','Bộ đệm jitter quá nhỏ'],['Tương quan thời điểm mất gói với chu kỳ 15 s','Xem bộ đệm jitter thích nghi ở UE/MGW'],{h:'Voice quality alarm',n:'VoLTE quality',e:'VoLTE MOS'},'stl_loss, stl_jit','link'],
 ['Mất GNSS, cell TDD tắt','Sau vài giờ holdover, cell n78/n41 ngừng phát.',['Anten GNSS hỏng, cáp, sét','Bộ dao động kém'],['Số vệ tinh GNSS, trạng thái holdover','Thời gian holdover theo bộ dao động'],{h:'GNSS/clock alarm',n:'Sync source failure',e:'Sync reference lost'},'t_gnss','ran'],
 ['Trễ cao giờ cao điểm','RTT p95 > 150 ms 19–22 h, thông lượng giảm.',['Nghẽn beam/tế bào phủ của vệ tinh','Không shaping, bufferbloat ở terminal'],['TWAMP theo giờ','So với trạm lân cận cùng vùng','Shaping CSR + ưu tiên EF'],{h:'NQA threshold',n:'OAM-PM threshold',e:'TWAMP threshold'},'stl_lat','link'],
 ['Mưa lớn mất dịch vụ','SNR giảm, gián đoạn dài khi mưa đỉnh.',['Suy hao Ku tại trạm','Mưa tại gateway (Ka)'],['Radar mưa, trạm lân cận','Terminal SNR theo thời gian'],{h:'Link degraded',n:'Link degraded',e:'Link degraded'},'stl_avail','link'],
 ['Bão đăng ký khi đường hồi phục','Nhiều trạm cùng gateway lên lại cùng lúc, lõi quá tải.',['Gateway/PoP sự cố','Bộ hẹn giờ kết nối lại không rải ngẫu nhiên'],['Đếm S1/NG Setup theo phút','Bật chống quá tải, back-off'],{h:'MME overload',n:'MME/AMF overload',e:'MME overload'},'stl_s1','ran']];
function stlParRows(){const P=STLP.vd,q=P.q.trim().toLowerCase(),v=nVn();const rows=STLPAR.filter(r=>(P.grp==='all'||r[1]===P.grp)&&(!q||r.join(' ').toLowerCase().includes(q)));
  return rows.map(r=>`<tr><td><b>${nE(r[2])}</b><br><span class="note">${nE(r[1])}</span></td><td class="u3tag">${v==='3gpp'?['Huawei: '+r[3],'Nokia: '+r[4],'Ericsson: '+r[5]].map(nE).join('<br>'):nE(r[{huawei:3,nokia:4,ericsson:5}[v]])}<br><span class="kpC mid">cần đối chiếu</span></td><td>${nE(r[6])}</td><td>${nE(r[7])}</td></tr>`).join('')||'<tr><td colspan="4">Không có tham số khớp.</td></tr>';}
function stlKpiRows(){const v=nVn(),f=STLP.vd.kf;return STLKPI.filter(k=>f==='all'||k[6]===f).map(k=>`<tr><td><b>${nE(k[0])}</b>${k[7]&&typeof KL!=='undefined'&&KL.find(x=>x.id===k[7])?`<br><button type="button" class="u3lnkbtn" data-stlgo="kpi:${k[7]}">Mở ở thẻ KPI →</button>`:''}</td><td>${nE(k[1])}</td><td class="u3tag">${v==='3gpp'?['Huawei: '+k[2],'Nokia: '+k[3],'Ericsson: '+k[4]].map(nE).join('<br>'):nE(k[{huawei:2,nokia:3,ericsson:4}[v]])}<br><span class="kpC mid">cần đối chiếu</span></td><td>${nE(k[5])}</td><td><button type="button" class="btn sm" data-stlgo="leo:${k[6]}">Mô phỏng →</button></td></tr>`).join('');}
function stlFltHtml(){const v=nVn();return STLFLT.map(f=>`<details class="u3flt ndflt stlflt"><summary><b>${nE(f[0])}</b></summary><p class="e2d">${nE(f[1])}</p><div class="u3two"><div><b>Nguyên nhân</b><ul class="u3ul">${f[2].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div><div><b>Kiểm tra</b><ul class="u3ul">${f[3].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div></div><p class="note">${v==='3gpp'?['Huawei: '+f[4].h,'Nokia: '+f[4].n,'Ericsson: '+f[4].e].map(nE).join(' · '):nVName(v)+': '+nE(f[4][v[0]])} (cần đối chiếu) · KPI: ${nE(f[5])} · <button type="button" class="u3lnkbtn" data-stlgo="leo:${f[6]}">Mô phỏng →</button></p></details>`).join('');}
function stlCalc(){const g=id=>{const e=document.getElementById(id);return e?+e.value||0:0;},o=document.getElementById('stlcOut');if(!o)return;
  const ts=g('stlcTs'),tr=g('stlcTr'),rs=g('stlcRs'),rn=g('stlcRn'),js=g('stlcJs'),jn=g('stlcJn'),om=g('stlcOm'),tm=g('stlcTm'),sd=g('stlcSd'),ns=g('stlcNs'),nd=g('stlcNd'),p95=g('stlcP9');
  const c=(v,ok,fmt)=>`<span class="${ok?'lbgood':'lbbad'}">${fmt}</span>`;
  o.innerHTML=stlKv('RTT trung bình',rn?c(rs/rn,rs/rn<=60,nF(rs/rn,1)+' ms'):'—')+stlKv('RTT p95 (nhập từ hệ thống đo)',c(p95,p95<=80,nF(p95,0)+' ms'))+stlKv('Mất gói',ts?c((ts-tr)/ts*100,(ts-tr)/ts*100<=0.5,nF((ts-tr)/ts*100,3)+' %'):'—')
   +stlKv('Jitter',jn?c(js/jn,js/jn<=10,nF(js/jn,1)+' ms'):'—')+stlKv('Sẵn sàng',tm?c(100*(1-om/tm),100*(1-om/tm)>=99.5,nF(100*(1-om/tm),3)+' %'):'—')+stlKv('Đứt S1/NG mỗi trạm-ngày',ns&&nd?c(sd/(ns*nd),sd/(ns*nd)<=0.5,nF(sd/(ns*nd),2)):'—');}
STLR.vd={
 html(){const P=STLP.vd,grps=[...new Set(STLPAR.map(r=>r[1]))];
  return `<div class="panel"><h3>Tham số (${STLPAR.length})</h3><div class="ctl">${stlSel('vd','grp','Nhóm',[['all','Tất cả']].concat(grps.map(g=>[g,g])))}<label class="c"><span class="cl">Lọc</span><input type="search" id="stlvq" value="${nE(P.q)}" placeholder="SCTP, DPD, MTU…"></label></div>
   <div class="scroll"><table class="ndtb"><thead><tr><th>Tham số</th><th>Tên theo vendor${nVn()==='3gpp'?'':' ('+nVName(nVn())+')'}</th><th>Giá trị điển hình</th><th>Ghi chú</th></tr></thead><tbody id="stlParB">${stlParRows()}</tbody></table></div><p class="note">Tên tham số vendor là mô tả theo đối tượng cấu hình, chưa kiểm chứng: tất cả cần đối chiếu tài liệu hiện hành của từng hãng.</p></div>
  <div class="panel"><h3>KPI</h3><div class="ctl">${stlSel('vd','kf','Theo mục',[['all','Tất cả']].concat(STLV.slice(0,5).map(v=>[v[0],v[1]])))}</div><div class="scroll"><table class="ndtb"><thead><tr><th>KPI</th><th>Công thức</th><th>Bộ đếm</th><th>Mục tiêu</th><th></th></tr></thead><tbody id="stlKpB">${stlKpiRows()}</tbody></table></div>
   <div class="u3calc"><b>Tính nhanh từ bộ đếm</b><div class="ctl ndcalc" style="margin-top:8px">${[['stlcTs','Gói TWAMP gửi',864000],['stlcTr','Gói TWAMP nhận',861500],['stlcRs','Tổng RTT (ms)',38880000],['stlcRn','Số mẫu RTT',861500],['stlcP9','RTT p95 (ms)',72],['stlcJs','Tổng |ΔRTT| (ms)',5100000],['stlcJn','Số cặp',861000],['stlcOm','Phút gián đoạn',95],['stlcTm','Tổng phút đo',43200],['stlcSd','Số lần S1/NG down',14],['stlcNs','Số trạm',6],['stlcNd','Số ngày',30]].map(r=>`<label class="c"><span class="cl">${r[1]}</span><input type="number" id="${r[0]}" value="${r[2]}" step="any"></label>`).join('')}</div><dl class="kv" id="stlcOut" style="margin-top:8px"></dl></div></div>
  <div class="panel"><h3>Lỗi thường gặp và cách kiểm tra</h3>${stlFltHtml()}</div>
  <div class="panel"><h3>Tiêu chuẩn và nguồn tham khảo</h3><ul class="u3ul">
   <li>3GPP TS 23.501 §5.43 «Support for 5G Satellite Backhaul» (Rel-18): §5.43.4 báo loại backhaul vệ tinh cho SMF, §5.43.5 giám sát QoS khi backhaul vệ tinh động (DYNAMIC_LEO…); tóm tắt ở TS 21.918 §5.1. TS 28.541/28.552 thêm thuộc tính quản lý backhaul vệ tinh. TS 22.261 có yêu cầu cho truy nhập/backhaul vệ tinh (số mục cần đối chiếu); TR 23.737 nghiên cứu vệ tinh trong 5GS (Rel-17).</li>
   <li>TS 33.210 (NDS/IP), TS 33.401 §11, TS 33.501 §9.2–9.3 (bảo vệ S1/N2/N3 qua mạng không tin cậy); RFC 7296 (IKEv2), RFC 3948 (NAT-T), RFC 4555 (MOBIKE).</li>
   <li>TS 36.412 / 38.412 (SCTP cho S1/NG), RFC 9260 (SCTP, thay RFC 4960); TS 29.281 (GTP-U, Echo).</li>
   <li>ITU-R P.618 (suy hao mưa đường vệ tinh), P.838 (hệ số k, α), P.839 (độ cao mưa); ITU-T G.114 (trễ miệng-tai), G.107 (E-model); ITU-T G.8271 (ngưỡng thời gian).</li>
   <li>RFC 5357 (TWAMP), RFC 8762 (STAMP), ITU-T Y.1731 (OAM Ethernet), Y.1540/Y.1541 (chỉ tiêu IP).</li></ul>
   <p class="e2x"><b>Nguồn thông số công khai đã tra</b> (chỉ minh hoạ «chòm LEO kiểu Starlink»):</p><ul class="u3ul">
   <li><a href="https://arxiv.org/abs/2310.09242v2" target="_blank" rel="noopener">A Multifaceted Look at Starlink Performance</a> — chu kỳ cấu hình lại 15 s đồng bộ toàn cầu; trễ bent-pipe 36–48 ms, trung vị ~40 ms; RTT tăng 2–4 lần khi tải.</li>
   <li><a href="https://www.theregister.com/2025/07/16/starlink_network_update/" target="_blank" rel="noopener">Báo cáo mạng 2025</a> — trễ trung vị giờ cao điểm 25,7 ms (Mỹ).</li>
   <li><a href="https://www.theregister.com/2026/01/02/starlink_lower_orbits/" target="_blank" rel="noopener">Hạ quỹ đạo 2026</a> — khoảng 4 400 vệ tinh từ ~550 km xuống ~480 km.</li>
   <li><a href="https://5gstore.com/blog/2026/05/02/starlink-performance-boost-lower-dish-angles/" target="_blank" rel="noopener">Góc ngẩng tối thiểu</a> — từ 25° xuống 20° (400–500 km) và 10° (dưới 400 km), cấp phép 1/2026.</li>
   <li><a href="https://www.speedcast.com/shop/starlink-standard-4-kit/" target="_blank" rel="noopener">Terminal tiêu chuẩn</a> (75–100 W, FOV 110°, IP67) · <a href="https://www.speedcast.com/shop/starlink-mini/" target="_blank" rel="noopener">terminal mini</a> (25–40 W).</li>
   <li><a href="https://www.cellstream.com/?p=15643" target="_blank" rel="noopener">Băng tần</a> — người dùng Ku 10,7–12,7 / 14,0–14,5 GHz; gateway Ka 17,8–19,3 / 27,5–30,0 GHz.</li>
   <li><a href="https://www.itecspec.com/3gpp/21.918/s/5.1" target="_blank" rel="noopener">TS 21.918 §5.1</a> · <a href="https://whatthespec.net/sos/spec/ts-23501/5.43" target="_blank" rel="noopener">TS 23.501 §5.43</a>.</li></ul>
   <p class="note">Thông số không công khai (thời gian xử lý, lập lịch, dung lượng beam, MODCOD, tên trường API terminal, MTU đường vệ tinh) để giá trị điển hình và gắn «cần đối chiếu».</p></div>`;},
 after(){stlCalc();},
 upd(k){if(k==='grp')stlSet('stlParB',stlParRows());if(k==='kf')stlSet('stlKpB',stlKpiRows());}
};

/* ---------- Khung thẻ ---------- */
const STLLK={arch:{e2:[['data','g4'],['data','sa']],kpi:['stl_lat','t_bad']},link:{e2:[['data','sa']],kpi:['stl_lat','stl_loss','stl_jit']},ran:{e2:[['mo','g4'],['mo','sa'],['data','sa']],kpi:['stl_s1','erabdrop4','voltedrop4','i_mos','t_gnss']},
 dim:{e2:[['data','g4']],kpi:['stl_avail']},mon:{e2:[['data','sa'],['mo','g4']],kpi:['stl_avail','stl_lat','stl_s1','t_bad']},vd:{e2:[['data','g4'],['mo','sa']],kpi:[]}};
const STLT={g3:'3G',g4:'4G',nsa:'5G NSA',sa:'5G SA'};
function stlLinks(){const L=STLLK[STLS.v]||{e2:[],kpi:[]},hasE2=typeof E2S!=='undefined',hasK=typeof KL!=='undefined';
  const e2=hasE2?L.e2.map(([id,tk])=>{const s=E2S.find(x=>x.id===id);return s&&s.f&&s.f[tk]?[s,tk]:null;}).filter(Boolean):[];
  const kp=hasK?L.kpi.map(id=>KL.find(k=>k.id===id)).filter(Boolean):[];
  return `<div class="panel u3lk"><h3>Xem tiếp ở thẻ khác</h3>
  ${e2.length?`<p class="e2x"><b>Luồng ở thẻ Toàn trình E2E</b>:</p><div class="e2go">${e2.map(([s,tk])=>`<button type="button" class="btn sm" data-stlgo="e2:${s.id}:${tk}">${nE(s.n)} · ${STLT[tk]} →</button>`).join('')}</div>`:''}
  ${kp.length?`<p class="e2x" style="margin-top:10px"><b>KPI liên quan ở thẻ KPI mạng</b>:</p><div class="e2go">${kp.map(k=>`<button type="button" class="btn sm" data-stlgo="kpi:${k.id}">${nE(k.nm)} →</button>`).join('')}</div>`:''}
  <p class="e2x" style="margin-top:10px"><b>Thẻ liên quan:</b></p><div class="e2go">${[['tx','Truyền dẫn'],['al','Cảnh báo, sự cố'],['vo','VoLTE']].filter(t=>typeof RENDER!=='undefined'&&RENDER[t[0]]).map(t=>`<button type="button" class="btn sm" data-tab="${t[0]}">${t[1]} →</button>`).join('')}<button type="button" class="btn sm" data-scgo="sc:tnl">Bảo mật · IPsec, SeGW →</button><button type="button" class="btn sm" data-rxgo="rx:tdd">Tối ưu vô tuyến · đồng bộ GNSS →</button><button type="button" class="btn sm" data-pngo="pn:svc">Mạng riêng · FWA, vùng xa →</button><button type="button" class="btn sm" data-udxgo="udm:geo">UDM · bão đăng ký →</button><button type="button" class="btn sm" data-stlgo="bk:ntn">Chuyên đề NTN (UE qua vệ tinh) →</button></div></div>`;}
function stlNav(){return `<div class="seg u3seg ndseg stlsg" role="group" aria-label="Mục của thẻ Truyền dẫn vệ tinh LEO">${STLV.map((v,i)=>`<button type="button" data-stlv="${v[0]}" aria-pressed="${v[0]===STLS.v}"><span class="ndn">${i+1}</span>${v[1]}</button>`).join('')}</div>`;}
function renderLeo(){const nav=document.getElementById('leoNav'),body=document.getElementById('leoBody');if(!nav||!body)return;if(!STLR[STLS.v])STLS.v='arch';
  STLS.job++;nav.innerHTML=stlNav();const V=STLR[STLS.v];body.innerHTML=V.html()+stlLinks();if(V.after)V.after();
  if(S.tab==='leo'&&!nReduced()&&V.tick)stlStart();else{stlStop();if(V.tick&&S.tab==='leo')V.tick(0);}}
function stlStart(){if(STLS.raf)return;STLS.last=performance.now();STLS.raf=requestAnimationFrame(stlLoop);}
function stlStop(){if(STLS.raf)cancelAnimationFrame(STLS.raf);STLS.raf=0;}
function stlLoop(now){STLS.raf=0;if(S.tab!=='leo')return;
  if(document.hidden){STLS.last=now;STLS.raf=requestAnimationFrame(stlLoop);return;}
  const dt=Math.max(0,Math.min(0.1,(now-STLS.last)/1000));STLS.last=now;const V=STLR[STLS.v];if(V&&V.tick){try{V.tick(dt);}catch(e){console.error(e);}}else return;
  STLS.raf=requestAnimationFrame(stlLoop);}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-stlgo]');
  if(g){const [t,id,tk]=g.dataset.stlgo.split(':');try{tourStop();}catch(x){}try{stopSig();}catch(x){}
    const top=()=>window.scrollTo({top:Math.min(window.scrollY,$('main').offsetTop-$('.bar').offsetHeight)});
    if(t==='e2'){try{e2Stop();}catch(x){}S.e2Sc=id;S.e2R=tk||'sa';S.e2M=S.mode;if(typeof E2A!=='undefined'){E2A.key='';E2A.i=0;}S.tab='e2';renderAll();top();}
    else if(t==='kpi'){S.tab='kpi';KP.tech='all';KP.ly='all';KP.cat='all';KP.q='';KP.node='';KP.sel=id;kpSig='';renderAll();setTimeout(()=>{const d=$('#kpDet');if(d)d.scrollIntoView({block:'start',behavior:'smooth'});},60);}
    else if(t==='leo'){S.tab='leo';if(id&&STLR[id])STLS.v=id;renderAll();top();}
    else if(t==='bk'){S.xMoreV='ntn';S.bk='more';S.bkStep=3;S.tab='book';renderAll();window.scrollTo(0,0);}
    return;}
  const t=e.target.closest('#t-leo [data-stlv],#t-leo [data-stla]');if(!t)return;
  if(t.dataset.stlv){if(t.dataset.stlv===STLS.v)return;STLS.v=t.dataset.stlv;stlStop();renderLeo();return;}
  const [vw,...r]=t.dataset.stla.split(':');const V=STLR[vw];if(V&&V.act)V.act(r.join(':'),t);
});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest&&e.target.closest('#t-leo [data-stla]')&&e.target.tagName!=='BUTTON'){e.preventDefault();e.target.closest('[data-stla]').dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
const STLLIVE=['ran','dim','mon:nv','mon:slat'];
function stlInp(el,live){const [vw,k]=el.dataset.stli.split(':');const P=STLP[vw];if(!P)return;
  let v=el.type==='checkbox'?(el.checked?1:0):((el.tagName==='SELECT'&&isNaN(+el.value))?el.value:+el.value);if(el.tagName==='SELECT'&&el.value==='')v='';P[k]=v;
  const o=el.parentElement.querySelector('output');if(o&&STLF[vw+':'+k])o.textContent=STLF[vw+':'+k](v);
  if(live&&!(STLLIVE.includes(vw)||STLLIVE.includes(vw+':'+k)))return;
  const V=STLR[vw];if(V&&V.upd)V.upd(k,vw);}
document.addEventListener('input',e=>{const el=e.target;if(el&&el.id){if(/^stlc[A-Z][a-z0-9]$/.test(el.id)){stlCalc();return;}if(el.id==='stlvq'){STLP.vd.q=el.value;stlSet('stlParB',stlParRows());return;}}
  if(!el.dataset||!el.dataset.stli||el.type!=='range')return;stlInp(el,true);});
document.addEventListener('change',e=>{const el=e.target;if(!el.dataset||!el.dataset.stli)return;stlInp(el,false);});

/* ---------- Gắn thẻ vào ứng dụng ---------- */
RENDER.leo=renderLeo;
(function(){if(typeof K!=='function'||typeof KL==='undefined')return;try{
  if(typeof KSC!=='undefined'&&!KSC.leo)KSC.leo={t:"Truyền dẫn vệ tinh LEO: trạm – terminal – vệ tinh – gateway/PoP – SeGW – lõi",n:{
   gnb:[45,150,"eNB/gNB","Trạm: S1/NG, X2/Xn đi trong IPsec","ran"],csr:[140,150,"CSR","Router trạm: IPsec client, DSCP, shaping, TWAMP sender","tx"],ut:[235,95,"Terminal","Anten mảng pha băng Ku, telemetry SNR, che khuất","tx"],
   sat:[345,45,"Vệ tinh LEO","~480–570 km, đổi vệ tinh ~15 s, liên kết laser","tx"],gw:[455,95,"Gateway","Trạm mặt đất băng Ka","tx"],pop:[540,150,"PoP","CGNAT, Internet hoặc kết nối riêng","ip"],
   segw:[625,150,"SeGW","Kết thúc IKEv2/IPsec, NAT-T","core"],core:[700,240,"Lõi","MME/AMF, SGW/PGW/UPF","core"],nms:[345,255,"NMS/Probe","TWAMP reflector, cảnh báo, SLA","it"]},
   e:[["gnb","csr","S1/NG"],["csr","ut","Ethernet"],["ut","sat","Ku"],["sat","gw","Ka"],["gw","pop","quang"],["pop","segw","Internet/riêng"],["segw","core","S1/NG"],["nms","csr","TWAMP"],["nms","segw","TWAMP"]]};
  if(typeof KSRC!=='undefined'){KSRC.stl_meas=KSRC.stl_meas||["A Multifaceted Look at Starlink Performance (đo 15 s, trễ bent-pipe)","https://arxiv.org/abs/2310.09242v2"];KSRC.stl_23501=KSRC.stl_23501||["3GPP TS 23.501 §5.43 Support for 5G Satellite Backhaul","https://whatthespec.net/sos/spec/ts-23501/5.43"];
   KSRC.stl_p618=KSRC.stl_p618||["ITU-R P.618 Propagation data for Earth-space systems","https://www.itu.int/rec/R-REC-P.618"];KSRC.stl_rfc3948=KSRC.stl_rfc3948||["RFC 3948 UDP Encapsulation of IPsec ESP (NAT-T)","https://www.rfc-editor.org/rfc/rfc3948"];KSRC.stl_rfc9260=KSRC.stl_rfc9260||["RFC 9260 Stream Control Transmission Protocol","https://www.rfc-editor.org/rfc/rfc9260"];}
  if(typeof KPB!=='undefined'&&!KPB.stl)KPB.stl={t:"Backhaul vệ tinh LEO: trễ, mất gói, gián đoạn, đứt S1/NG",
    st:["Tách theo đoạn: telemetry terminal (SNR, % che khuất, gián đoạn) → ping PoP → ping IP công khai SeGW → IKE/IPsec SA → SCTP/S1/NG → KPI cell.","Nếu nhiều trạm cùng gateway lỗi cùng lúc: sự cố gateway/PoP, mở ticket nhà cung cấp, chuẩn bị chống bão đăng ký khi hồi phục.","Nếu trễ cao theo giờ: nghẽn beam; đặt shaping CSR dưới năng lực p10 và ưu tiên EF cho thoại, báo hiệu.","Nếu gián đoạn lặp lại: kiểm tra vật cản, so thời gian gián đoạn với thời gian phát hiện SCTP và DPD; điều chỉnh timer hoặc dời anten.","Nếu gói nhỏ qua, gói lớn mất: MTU/MSS; nếu IKE_AUTH lỗi: chứng thư, NTP, định danh khi IP CGNAT đổi."],
    ca:["Che khuất","Mưa Ku/Ka","Nghẽn beam","Gateway/PoP sự cố","IPsec/IKE (chứng thư, NAT-T)","MTU/MSS","Mất GNSS","Mất điện trạm"],
    pa:["SCTP RTO.min/max, Path/Association.Max.Retrans, HB.interval","IKE DPD, NAT-T keepalive, SA lifetime","MTU, MSS clamp, DSCP, shaping","TWAMP chu kỳ và ngưỡng"],cs:[],gen:1};
  const add=a=>{if(KL.some(k=>k.id===a[0]))return;K(...a);};
  add(["stl_lat","TX","tx","ipq","Satellite Backhaul RTT p95","csr,ut,sat,gw,pop,segw,nms","stl","g|ms|0|250|d|80|120|58",
   "RTT p95 = phân vị 95 của RTT TWAMP CSR ↔ SeGW trong 15 phút (lớp EF).","Đo chủ động RFC 5357; 3GPP Rel-18 có giám sát QoS cho backhaul vệ tinh động (TS 23.501 §5.43.5). Tên bộ đếm cần đối chiếu.",
   "?NQA/TWAMP: RTT p95 (cần đối chiếu)","?TWAMP: RTT p95 (cần đối chiếu)","?OAM-PM TWAMP Light: delay p95 (cần đối chiếu)",
   "Cho biết đường vệ tinh có đáp ứng thoại và báo hiệu không; tăng vào giờ cao điểm do nghẽn beam.","≤ 80 ms; giờ bận ≤ 120 ms (tham khảo, tự đặt theo SLA).",
   "csr>segw:TWAMP-Test qua vệ tinh!A;segw>csr:Phản hồi!S","rfc5357,stl_meas,stl_23501","","leo"]);
  add(["stl_avail","TX","tx","avl","Satellite Backhaul Availability","ut,sat,gw,pop,segw,nms","stl","g|%|97|100|u|99.5|99|99.6",
   "Sẵn sàng = 100 × (1 − thời gian gián đoạn / thời gian đo); gián đoạn khi TWAMP mất liên tục ≥ 10 s hoặc terminal offline.","Tự định nghĩa theo SLA; số liệu từ TWAMP và telemetry terminal. Cần đối chiếu.",
   "?NQA + telemetry terminal (cần đối chiếu)","?TWAMP + telemetry terminal (cần đối chiếu)","?OAM-PM availability (cần đối chiếu)",
   "Phản ánh che khuất, mưa, sự cố gateway; mỗi gián đoạn dài hơn thời gian phát hiện SCTP làm cell ngừng phục vụ.","≥ 99,5 %/tháng (tham khảo).",
   "csr>segw:TWAMP liên tục!A;segw>csr:Có phản hồi!S","rfc5357,stl_p618","","leo"]);
  add(["stl_loss","TX","tx","ipq","Satellite Backhaul Packet Loss","csr,ut,sat,gw,pop,segw","stl","g|%|0|5|d|0.5|1|0.4",
   "Mất gói = 100 × (gói TWAMP gửi − nhận) / gửi, 15 phút, không tính thời gian gián đoạn.","RFC 5357. Tên bộ đếm cần đối chiếu.",
   "?NQA: packet loss (cần đối chiếu)","?TWAMP: loss (cần đối chiếu)","?OAM-PM: frame/packet loss (cần đối chiếu)",
   "Mất gói tập trung lúc đổi vệ tinh (~15 s) và khi mưa; làm thoại ngắt và TCP giảm cửa sổ.","≤ 0,5 %.",
   "csr>segw:TWAMP-Test!A;segw>csr:Phản hồi nhận được!S","rfc5357,stl_meas","","leo"]);
  add(["stl_jit","TX","tx","ipq","Satellite Backhaul Jitter","csr,ut,sat,gw,segw","stl","g|ms|0|50|d|10|20|7",
   "Jitter = trung bình |RTTᵢ − RTTᵢ₋₁| của gói TWAMP liên tiếp (hoặc IPDV theo Y.1540).","RFC 5357, ITU-T Y.1540. Cần đối chiếu.",
   "?NQA: jitter (cần đối chiếu)","?TWAMP: jitter (cần đối chiếu)","?OAM-PM: delay variation (cần đối chiếu)",
   "Bộ đệm jitter thoại phải lớn hơn jitter; gai khi đổi vệ tinh làm jitter tăng.","≤ 10 ms.",
   "csr>segw:TWAMP-Test!A;segw>csr:Phản hồi!S","rfc5357,y1541","","leo"]);
  add(["stl_s1","TX","tx","avl","S1/NG Link Drops per Site-Day (satellite)","gnb,csr,ut,segw,core","stl","g|lần|0|5|d|0.5|2|0.3",
   "Số lần S1/NG link down / (số trạm × số ngày), chỉ tính trạm dùng backhaul vệ tinh.","TS 36.412/38.412 (SCTP), RFC 9260. Chỉ số tự tính, cần đối chiếu.",
   "?S1 link fault alarm count (cần đối chiếu)","?S1/NG link down events (cần đối chiếu)","?S1/NG link failure alarms (cần đối chiếu)",
   "Đo hậu quả của gián đoạn với RAN: mỗi lần đứt là cell ngừng phục vụ, rớt E-RAB/QoS flow, bão đăng ký khi hồi phục.","≤ 0,5 lần/trạm-ngày.",
   "gnb>core:SCTP HEARTBEAT!A;core>gnb:HEARTBEAT-ACK!S","stl_rfc9260,stl_rfc3948","","leo"]);
  const XN={stl_lat:["RTT backhaul vệ tinh phân vị 95","Sat BH RTT p95","vệ tinh|LEO|Starlink|backhaul vệ tinh|TWAMP|RTT","Trễ khứ hồi p95 trạm ↔ SeGW qua vệ tinh."],
    stl_avail:["Độ sẵn sàng đường truyền vệ tinh","Sat BH avail","vệ tinh|LEO|sẵn sàng|availability|gián đoạn","Phần thời gian đường vệ tinh dùng được."],
    stl_loss:["Tỉ lệ mất gói backhaul vệ tinh","Sat BH loss","vệ tinh|LEO|mất gói|packet loss","Phần gói TWAMP bị mất."],
    stl_jit:["Jitter backhaul vệ tinh","Sat BH jitter","vệ tinh|LEO|jitter|IPDV","Độ biến thiên trễ giữa các gói."],
    stl_s1:["Số lần đứt S1/NG mỗi trạm mỗi ngày (backhaul vệ tinh)","S1/NG drops","vệ tinh|LEO|S1 down|NG down|SCTP","Tần suất mất S1/NG ở trạm dùng vệ tinh."]};
  const EN={stl_lat:"Satellite Backhaul RTT p95",stl_avail:"Satellite Backhaul Availability",stl_loss:"Satellite Backhaul Packet Loss",stl_jit:"Satellite Backhaul Jitter",stl_s1:"S1/NG Link Drops per Site-Day (satellite)"};
  for(const id in XN){const k=KL.find(x=>x.id===id);if(!k)continue;const x=XN[id];if(typeof KX!=='undefined')KX[id]=x;if(typeof KEN!=='undefined')KEN[id]=EN[id];
    k.fn=x[0];k.ab=[x[1]].concat(x[2].split('|'));k.gl=x[3];k.dn=k.fn+' ('+x[1]+')';k.en=EN[id];}
  const ids=Object.keys(XN),moved=ids.map(id=>{const i=KL.findIndex(k=>k.id===id);return i>=0?KL.splice(i,1)[0]:null;}).filter(Boolean);
  let j=KL.findIndex(k=>k.id==='udm_load');if(j<0)j=KL.findIndex(k=>k.id==='nsl_sla');KL.splice(j>=0?j+1:KL.length,0,...moved);
}catch(e){console.error('KPI LEO',e);}})();
/* tìm kiếm chung */
if(typeof qSnap==='function'){const _qs=qSnap;qSnap=function(){_qs.apply(this,arguments);if(!QS||!QS.I||QS.leo)return;QS.leo=1;
  const CAT='Thẻ Truyền dẫn vệ tinh LEO',body=document.getElementById('leoBody'),cur=STLS.v;
  if(body){for(const [v,vn] of STLV){try{STLS.v=v;body.innerHTML=STLR[v].html();
    body.querySelectorAll('.panel').forEach(pn=>{const h=pn.querySelector('h3'),tt=h?h.textContent:vn,txt=qText(pn).slice(0,6000);if(txt.trim().length<12)return;
      qAdd(QS.I,CAT+' · '+vn,tt,txt,1,()=>{S.tab='leo';STLS.v=v;},()=>[...document.querySelectorAll('#t-leo .panel')].find(p=>{const x=p.querySelector('h3');return x&&x.textContent===tt;}));});}catch(e){console.error(e);}}
    STLS.v=cur;STLS.job++;try{if(S.tab==='leo')renderLeo();else body.innerHTML='';}catch(e){}}
  const go=(v,f)=>()=>{S.tab='leo';STLS.v=v;if(f)f();};
  STLPAR.forEach(r=>qAdd(QS.I,'Vệ tinh LEO · Tham số '+r[1],r[2],['Huawei: '+r[3],'Nokia: '+r[4],'Ericsson: '+r[5],'Điển hình: '+r[6],r[7]].join('. '),3,go('vd',()=>{STLP.vd.grp=r[1];STLP.vd.q='';}),'#stlParB'));
  STLKPI.forEach(k=>qAdd(QS.I,'Vệ tinh LEO · KPI',k[0],[k[1],k[5]].join('. '),3,go('vd'),'#stlKpB'));
  STLFLT.forEach(f=>qAdd(QS.I,'Vệ tinh LEO · Lỗi thường gặp',f[0],[f[1],f[2].join('; '),f[3].join('; ')].join('. '),3,go('vd'),()=>{const d=[...document.querySelectorAll('#t-leo .stlflt')].find(x=>x.querySelector('summary').textContent===f[0]);if(d)d.open=true;return d;}));
  Object.entries(STLFI).filter(x=>x[0]!=='none').forEach(([k,f])=>qAdd(QS.I,'Vệ tinh LEO · Tiêm lỗi, RCA',f.n,STLFX[k],2,go('mon'),'#stlGame'));
  [['Backhaul vệ tinh LEO kiểu Starlink','terminal phased array Ku gateway Ka PoP CGNAT SeGW IPsec NAT-T bent-pipe laser ISL','arch'],['Kênh vệ tinh theo thời gian','độ cao góc ngẩng khoảng cách nghiêng đổi vệ tinh 15 s che khuất mưa ITU-R P.618 nghẽn beam RTT p95','link'],
   ['SCTP S1 NG qua vệ tinh','heartbeat RTO Association.Max.Retrans DPD GTP-U echo MTU MSS overhead ESP GNSS holdover VoLTE TCP BDP bão đăng ký','ran'],['Định cỡ backhaul vệ tinh','NGMN băng thông terminal bonding SD-WAN viba dự phòng điện mặt trời ắc quy chi phí','dim'],
   ['Giám sát toàn trình backhaul vệ tinh','dashboard theo đoạn TWAMP tương quan cảnh báo RCA tiêm lỗi chấm điểm DSCP shaping SLA tháng','mon']].forEach(([n,x,v])=>qAdd(QS.I,'Truyền dẫn vệ tinh LEO',n,x,2,go(v),'#leoBody'));};}
/* thẻ E2E: nút sang thẻ này */
if(typeof e2Kpi==='function'){const _ke=e2Kpi;e2Kpi=function(){_ke.apply(this,arguments);if(!['data','mo'].includes(S.e2Sc)||!['g4','nsa','sa'].includes(S.e2R))return;const b=$('#e2Kpi .e2go');
  if(b&&!b.querySelector('[data-stlgo]'))b.insertAdjacentHTML('beforeend',S.e2Sc==='mo'?`<button type="button" class="btn sm" data-stlgo="leo:ran">Vệ tinh LEO · VoLTE và SCTP qua backhaul vệ tinh →</button>`:`<button type="button" class="btn sm" data-stlgo="leo:link">Vệ tinh LEO · trễ, mất gói backhaul →</button>`);};}
/* thẻ KPI: nút sang mục tương ứng */
const STLKV={stl_lat:'link',stl_avail:'mon',stl_loss:'link',stl_jit:'link',stl_s1:'ran',t_bad:'mon',t_gnss:'ran'};
if(typeof kpDetHtml==='function'){const _kd=kpDetHtml;kpDetHtml=function(k){let h=_kd.apply(this,arguments);if(k&&STLKV[k.id]){const v=STLKV[k.id];h+=`<p class="u3kpl"><button type="button" class="btn sm" data-stlgo="leo:${v}">Xem mô phỏng ở thẻ Truyền dẫn vệ tinh LEO · ${nE(STLV.find(x=>x[0]===v)[1])} →</button></p>`;}return h;};}
/* thanh nút ở các thẻ liên quan */
const STLTABL={tx:[['arch','Backhaul vệ tinh LEO toàn trình'],['link','Kênh vệ tinh theo thời gian'],['mon','Giám sát, TWAMP, SLA']],sc:[['arch','IPsec NAT-T sau CGNAT'],['ran','DPD, MTU/ESP overhead']],ro:[['ran','GNSS bắt buộc, holdover']],
 pn:[['dim','Vùng xa: định cỡ, nguồn, chi phí']],vo:[['ran','VoLTE qua vệ tinh: trễ, MOS']],al:[['mon','Tương quan cảnh báo, RCA, tiêm lỗi']]};
const stlBar=t=>`<div class="sclkbar stllkbar nogl"><span>Mô phỏng ở thẻ <b>Truyền dẫn vệ tinh LEO</b>:</span>${t.map(x=>`<button type="button" class="btn sm" data-stlgo="leo:${x[0]}">${nE(x[1])} →</button>`).join('')}</div>`;
Object.keys(STLTABL).forEach(t=>{const f=RENDER[t];if(typeof f!=='function')return;RENDER[t]=function(){const r=f.apply(this,arguments);try{const sec=document.getElementById('t-'+t);if(sec&&!sec.querySelector('.stllkbar')){const ld=sec.querySelector('.lead');if(ld)ld.insertAdjacentHTML('afterend',stlBar(STLTABL[t]));else sec.insertAdjacentHTML('afterbegin',stlBar(STLTABL[t]));}}catch(e){}return r;};});
/* thẻ Mạng riêng 5G: mục svc (FWA, vùng xa) */
if(typeof PNR!=='undefined'){const R=PNR.svc;if(R&&typeof R.html==='function'){const h=R.html;R.html=function(){return h.apply(this,arguments)+`<div class="panel stlpnp">${stlBar([['arch','Backhaul vệ tinh cho trạm vùng xa'],['dim','Định cỡ, nguồn, chi phí']])}</div>`;};}
  if(typeof PNTB!=='undefined'&&Array.isArray(PNTB)&&!PNTB.some(x=>x[0]==='leo'))PNTB.push(['leo','Truyền dẫn vệ tinh LEO']);}
if(typeof SCLK!=='undefined'){['tnl','vd'].forEach(v=>{const L=SCLK[v];if(L){L.tab=L.tab||[];if(!L.tab.some(x=>x[0]==='leo'))L.tab.push(['leo','Truyền dẫn vệ tinh LEO']);}});}
/* chuyên đề NTN ở thẻ book */
if(typeof RENDER.book==='function'){const _b=RENDER.book;RENDER.book=function(){const r=_b.apply(this,arguments);try{const sec=document.getElementById('t-book');if(sec){const o=sec.querySelector('.stllkbar');if(o)o.remove();
  if(S.bk==='more'){const ld=sec.querySelector('.lead');if(ld)ld.insertAdjacentHTML('afterend',stlBar([['arch','Vệ tinh LEO làm truyền dẫn trạm (không phải NTN UE)'],['link','Kênh vệ tinh theo thời gian']]));}}}catch(e){}return r;};}

