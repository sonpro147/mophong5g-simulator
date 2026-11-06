
/* ===== Thẻ Hiệu quả tần số tại một trạm (sf) — đợt 21 lộ trình (BRIEF 19) ===== */
const SFS={v:'cfg',raf:0,last:0,pause:false,acc:0,dr:0,job:0};
const SFV=[['cfg','Cấu hình trạm và PRB vật lý'],['grid','Lưới PRB theo thời gian'],['split','Chia lưu lượng giữa sóng mang'],['alg','So sánh thuật toán cân bằng'],['scn','Kịch bản'],['vd','Tham số, KPI, lỗi']];
const SFR={},SFP={},SFF={};let SFX={};
function sfSl(vw,k,l,mn,mx,st,f,hint,pk){SFF[vw+':'+k]=f;const v=sfGet(vw,k);
  return `<label class="c"><span class="cl">${l}<output>${f(v)}</output></span><input type="range" data-sfi="${vw}:${k}" min="${mn}" max="${mx}" step="${st}" value="${v}">${hint?`<span class="u3ph">${hint}</span>`:''}${pk?sfPnTag(pk):''}</label>`;}
function sfSel(vw,k,l,opts,hint,pk){const v=sfGet(vw,k);
  return `<label class="c"><span class="cl">${l}</span><select data-sfi="${vw}:${k}">${opts.map(o=>`<option value="${o[0]}"${String(o[0])===String(v)?' selected':''}>${nE(o[1])}</option>`).join('')}</select>${hint?`<span class="u3ph">${hint}</span>`:''}${pk?sfPnTag(pk):''}</label>`;}
function sfChk(vw,k,l,pk){return `<label class="u3ck"><input type="checkbox" data-sfi="${vw}:${k}"${sfGet(vw,k)?' checked':''}> ${l}</label>${pk?sfPnTag(pk):''}`;}
function sfGet(vw,k){const P=SFP[vw],ks=k.split('.');return ks.length>1?P[ks[0]][ks[1]]:P[k];}
function sfPn(key){const r=(typeof SFPAR!=='undefined'?SFPAR:[]).find(x=>x[0]===key);if(!r)return'';const v=nVn();if(v==='3gpp')return'';
  return nVName(v)+': '+r[{huawei:3,nokia:4,ericsson:5}[v]]+(r[7]==='v'?' (cần đối chiếu)':'');}
function sfPnTag(key){const t=sfPn(key);return t?`<span class="vh ndvh">${nE(t)}</span>`:'';}
const sfKv=(a,b)=>`<dt>${a}</dt><dd>${b}</dd>`;
const sfSet=(id,h)=>{const e=document.getElementById(id);if(e)e.innerHTML=h;};
const sfAvg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
function sfPct(a,p){if(!a.length)return 0;const b=a.slice().sort((x,y)=>x-y),i=nC((b.length-1)*p,0,b.length-1),lo=Math.floor(i),hi=Math.ceil(i);return b[lo]+(b[hi]-b[lo])*(i-lo);}
const sfMb=x=>x>=1000?nF(x/1000,2)+' Gbit/s':nF(x,x<10?1:0)+' Mbit/s';

/* ---------- Danh mục sóng mang cùng trạm ---------- */
const SFC={
 n41:{n:'NR n41 · 2600 TDD',s:'n41',rat:'nr',f:2.6,mhz:'2496–2690',dx:'TDD',scs:30,bws:[40,50,60,80,90,100],ant:['64T','32T','8T'],c:'#7B6CE0'},
 n77:{n:'NR n77 · 3800 TDD',s:'n77',rat:'nr',f:3.85,mhz:'3300–4200',dx:'TDD',scs:30,bws:[40,50,60,80,90,100],ant:['64T','32T','8T'],c:'#2F7FE0'},
 b3:{n:'LTE B3 · 1800 FDD',s:'B3',rat:'lte',f:1.84,mhz:'1805–1880 / 1710–1785',dx:'FDD',scs:15,bws:[5,10,15,20],ant:['4T','2T'],c:'#2BA37A'},
 b1:{n:'LTE B1 · 2100 FDD',s:'B1',rat:'lte',f:2.14,mhz:'2110–2170 / 1920–1980',dx:'FDD',scs:15,bws:[5,10,15,20],ant:['4T','2T'],c:'#3AA6C9'},
 b7:{n:'LTE B7 · 2600 FDD',s:'B7',rat:'lte',f:2.655,mhz:'2620–2690 / 2500–2570',dx:'FDD',scs:15,bws:[10,15,20],ant:['4T','2T'],c:'#C98A1E'},
 b40:{n:'LTE B40 · 2300 TDD',s:'B40',rat:'lte',f:2.35,mhz:'2300–2400',dx:'TDD',scs:15,bws:[10,15,20],ant:['8T','4T'],c:'#B05FC4'},
 n28:{n:'NR n28 · 700 FDD',s:'n28',rat:'nr',f:0.78,mhz:'758–803 / 703–748',dx:'FDD',scs:15,bws:[10,15,20],ant:['2T','4T'],c:'#D9822B'},
 n1:{n:'NR n1 · 2100 FDD',s:'n1',rat:'nr',f:2.14,mhz:'2110–2170 / 1920–1980',dx:'FDD',scs:15,bws:[10,15,20],ant:['4T','2T'],c:'#4FB36A'}
};
const SFK=Object.keys(SFC);
const SFAN={'64T':{n:'64T64R (mMIMO)',g:25,lay:4,pw:200,p0:450,pm:1100},'32T':{n:'32T32R (mMIMO)',g:22,lay:4,pw:160,p0:350,pm:800},'8T':{n:'8T8R',g:19,lay:4,pw:120,p0:200,pm:450},'4T':{n:'4T4R',g:18,lay:4,pw:80,p0:150,pm:350},'2T':{n:'2T2R',g:17,lay:2,pw:60,p0:100,pm:250}};
const SFTD={DDDSU:'DDDSU · 2,5 ms (DL ≈ 74 %)',DDDDDDDSUU:'DDDDDDDSUU · 5 ms (DL ≈ 74 %)',DDSUU:'DDSUU · 2,5 ms (UL nhiều, DL ≈ 54 %)',DSUDD:'LTE TDD cấu hình 2 · DSUDD',DSUUD:'LTE TDD cấu hình 1 · DSUUD'};
const SFPRI={n77:7,n41:6,n1:4,n28:2,b3:5,b1:4,b7:3,b40:3};
const SFCLS={l1:{n:'4G không CA',c:'#8A9BB0',rat:'lte',ca:1},lca:{n:'4G LTE-A CA',c:'#2BA37A',rat:'lte',ca:3},nr1:{n:'5G SA không CA',c:'#9C7BE0',rat:'nr',ca:1},nca:{n:'5G SA CA n41+n77',c:'#2F7FE0',rat:'nr',ca:2},endc:{n:'EN-DC (neo LTE + NR)',c:'#C98A1E',rat:'endc',ca:2},ga:{n:'5G-A CA nhiều CC',c:'#D9488F',rat:'nr',ca:4}};
const SFCK=Object.keys(SFCLS);
const SFSVC={vid:{n:'Video',c:'#E05A5A',p:35},web:{n:'Web',c:'#3AA6C9',p:40},bulk:{n:'Tải file',c:'#7B6CE0',p:15},voi:{n:'Thoại VoNR/VoLTE',c:'#2BA37A',p:10}};
const SFAL={off:{n:'Tắt cân bằng (ưu tiên cố định, PCell trước)',s:'Tắt',pl:'prio',sp:'pcell',lb:false,c:'var(--muted)'},
 load:{n:'Theo tải PRB',s:'Tải PRB',pl:'load',sp:'load',lb:true,c:'#D9822B'},
 se:{n:'Theo hiệu suất phổ (CQI)',s:'Hiệu suất phổ',pl:'se',sp:'cqi',lb:false,c:'#3AA6C9'},
 cap:{n:'Theo dung lượng còn lại (SE × (1 − tải))',s:'Dung lượng còn lại',pl:'cap',sp:'cap',lb:true,c:'#2BA37A'},
 pc:{n:'Ưu tiên PCell + IFLB nội trạm',s:'PCell + IFLB',pl:'prio',sp:'pcell',lb:true,c:'#7B6CE0'}};
const SFAK=Object.keys(SFAL);
const SFHP=[.16,.1,.07,.06,.07,.14,.3,.5,.64,.7,.72,.76,.8,.74,.72,.76,.82,.88,.96,1,.97,.88,.6,.32];

SFP.cfg={on:{n41:true,n77:true,b3:true,b1:true,b7:false,b40:false,n28:false,n1:false},bw:{n41:100,n77:100,b3:20,b1:15,b7:20,b40:20,n28:10,n1:20},
 ant:{n41:'64T',n77:'64T',b3:'4T',b1:'4T',b7:'4T',b40:'8T',n28:'2T',n1:'4T'},tdd:{n41:'DDDSU',n77:'DDDSU',b40:'DSUDD'},cs:1,cfi:2,ssb:20,qam:256,sel:'n41'};
SFP.ue={n:160,dem:1,ind:60,pos:0,rad:550,iLoad:50,s_l1:10,s_lca:15,s_nr1:20,s_nca:25,s_endc:15,s_ga:15,alg:'off',thr:70,diff:20,nmax:4,scAct:20,scDeact:160,xcs:false,mcs:true,ulr:10,seed:1};

/* ---------- Lớp vật lý: PRB, overhead, đỉnh ---------- */
function sfNrb(k,bw){const c=SFC[k];bw=bw||SFP.cfg.bw[k];return c.rat==='lte'?(LTEBW[bw]||bw*5):((NRB[c.scs]&&NRB[c.scs][bw])||0);}
function sfPat(k,cf){const c=SFC[k];cf=cf||SFP.cfg;return c.dx==='FDD'?'D':(c.rat==='lte'?(cf.tdd.b40||'DSUDD'):(cf.tdd[k]||'DDDSU'));}
function sfFrac(pat,fdd){if(fdd)return {dl:1,ul:1};let d=0,u=0;for(const ch of pat){if(ch==='D')d+=14;else if(ch==='U')u+=14;else{d+=10;u+=2;}}return {dl:d/(pat.length*14),ul:u/(pat.length*14)};}
function sfOh(k,cf){cf=cf||SFP.cfg;const c=SFC[k],a=SFAN[cf.ant[k]],nrb=sfNrb(k,cf.bw[k]),lte=c.rat==='lte',spm=c.scs/15;
  const pd=(lte?cf.cfi:cf.cs)/14,dm=lte?(a.lay>=4?0.095:0.067):1/14;
  const ssb=lte?(6*6+6*2)/(nrb*14*10*1):(((c.f>3?8:4)*4*20)/(cf.ssb*spm*nrb*14));
  const csi=lte?0.004:(1/20+4/40)/14;
  return {pd,dm,ssb,csi,tot:pd+dm+ssb+csi};}
function sfCce(k,cf){cf=cf||SFP.cfg;const c=SFC[k],nrb=sfNrb(k,cf.bw[k]);return c.rat==='lte'?Math.floor(nrb*cf.cfi*12*0.8/36):Math.floor(Math.floor(nrb/6)*cf.cs);}
function sfPeak(k,cf){cf=cf||SFP.cfg;const c=SFC[k],a=SFAN[cf.ant[k]],nrb=sfNrb(k,cf.bw[k]),fr=sfFrac(sfPat(k,cf),c.dx==='FDD'),oh=sfOh(k,cf).tot,ueL=c.rat==='nr'&&c.dx==='TDD'?4:2,lay=Math.min(a.lay,ueL),qm=cf.qam===64?6:8;
  const sym=14*1000*c.scs/15;return {dl:lay*qm*(948/1024)*nrb*12*sym*(1-oh)*fr.dl/1e6,ul:(c.rat==='nr'&&c.dx==='TDD'?2:1)*6*(948/1024)*nrb*12*sym*(1-0.14)*fr.ul/1e6,lay,fr};}
/* suy hao TR 38.901 UMa NLOS rút gọn, xuyên toà nhà low-loss */
function sfPL(f,d){return 13.54+39.08*Math.log10(Math.max(d,20))+20*Math.log10(f);}
function sfO2I(f){const lg=2+0.2*f,lc=5+4*f;return 5-10*Math.log10(0.3*Math.pow(10,-lg/10)+0.7*Math.pow(10,-lc/10));}
function sfRad(k,cf,indoor,ul){cf=cf||SFP.cfg;const c=SFC[k],a=SFAN[cf.ant[k]],nrb=sfNrb(k,cf.bw[k]),mg=14+(indoor?sfO2I(c.f)+5:0);
  const budget=ul?(23-10*Math.log10(48)+a.g-3)-(-174+10*Math.log10(c.scs*1e3)+3.5)+3:(10*Math.log10(a.pw*1000)-10*Math.log10(nrb*12)+a.g)-(-174+10*Math.log10(c.scs*1e3)+7)+6;
  const pl=budget-mg;return Math.pow(10,(pl-13.54-20*Math.log10(c.f))/39.08);}
function sfCar(k,cf,rec){const c=SFC[k],a=SFAN[cf.ant[k]],nrb=sfNrb(k,cf.bw[k]),oh=sfOh(k,cf),pat=sfPat(k,cf);
  const C={k,c,a,bw:cf.bw[k],nrb,spm:c.scs/15,pat,oh,re:168*(1-oh.pd-oh.dm-oh.csi),reU:168*0.86,cce:Math.max(4,Math.floor(sfCce(k,cf)*0.65)),cs:c.rat==='lte'?cf.cfi:cf.cs,
    pre:10*Math.log10(a.pw*1000)-10*Math.log10(nrb*12),N0:-174+10*Math.log10(c.scs*1e3)+7,N0u:-174+10*Math.log10(c.scs*1e3)+3.5,ueL:c.rat==='nr'&&c.dx==='TDD'?4:2,
    ssbPer:c.rat==='lte'?5:cf.ssb*c.scs/15,ssbN:c.rat==='lte'?1:(c.f>3?4:2),ssbW:c.rat==='lte'?6:20,pucch:nrb>100?8:4,
    slot:0,L:0,us:[],uu:[],used:0,av:0,usedU:0,avU:0,bits:0,bitsU:0,waste:0,wD:0,wA:0,wU:0,wUa:0,hd:0,ha:0,hu:0,hua:0,fr:0,go:false,dlf:0,ulf:0,ty:'D',ptr:0,ptrU:0,cceL:0};
  C.mu=cf.ant[k]==='64T'?1.35:cf.ant[k]==='32T'?1.2:1;C.s0=Math.max(0,Math.floor(nrb/2)-C.ssbW/2);
  if(rec){C.rg=[];for(let i=0;i<20;i++)C.rg.push({ty:'',sl:-1,own:new Int16Array(nrb).fill(-1),ownU:new Int16Array(nrb).fill(-1),cce:0});C.rp=0;}
  return C;}
function sfLk(C,u,P){const f=C.c.f,pl=sfPL(f,u.d)+(u.in?sfO2I(f)+u.ix:0)+u.sh,snr=C.pre+C.a.g-pl-C.N0,x=u.d/P.rad,sir=24-20*Math.pow(x,1.2)-10*Math.log10(Math.max(0.05,P.iLoad/100));
  const sinr=Math.min(30,-10*Math.log10(Math.pow(10,-snr/10)+Math.pow(10,-sir/10))),rk=nC(1+Math.floor((sinr-1)/5),1,Math.min(C.a.lay,C.ueL));
  const se=sinr<-6?0:Math.min(P.qam===64?5.55:7.4,0.75*Math.log2(1+nLin(sinr))),u1=23-10*Math.log10(12)+C.a.g-3-pl-C.N0u-2;
  return {sinr,rk,se,bp:C.re*se*rk*C.mu,u1,pl,ulMax:nC(Math.floor(nLin(u1-3)),0,C.nrb)};}
function sfUlBits(C,L,n,ulf){const s=L.u1-10*Math.log10(n);if(s<-6)return 0;return n*C.reU*ulf*Math.min(5.55,0.7*Math.log2(1+nLin(Math.min(s,25))))*(C.c.rat==='nr'&&C.c.dx==='TDD'&&s>12?2:1);}

/* ---------- Bộ mô phỏng lập lịch theo khe 0,5 ms ---------- */
function sfParams(o){return Object.assign({},SFP.ue,{cfg:SFP.cfg,qam:SFP.cfg.qam,warm:0},o||{});}
function sfArr(u,P){const r=u.rg;let b=0;
  if(u.svc==='vid'){b=u.vr*2e6*P.dem;u.nx+=2;}
  else if(u.svc==='web'){b=Math.min(160e6,8e6*Math.exp(Math.log(1.5)+0.8*nGs(r)))*P.dem;u.nx+=-Math.log(Math.max(1e-6,r()))*8;}
  else if(u.svc==='bulk'){b=160e6*P.dem*(0.5+r());u.nx+=-Math.log(Math.max(1e-6,r()))*25;}
  else{b=640;u.nx+=0.02;}
  return b;}
function sfMkU(P,CC){const r=nRng(P.seed*7919+13),U=[],sh=SFCK.map(c=>Math.max(0,+P['s_'+c]||0)),st=sh.reduce((a,b)=>a+b,0)||1,sv=Object.keys(SFSVC),e=0.5*Math.pow(2,-P.pos);
  for(let i=0;i<P.n;i++){let q=r()*st,cls=SFCK[SFCK.length-1];for(let j=0;j<SFCK.length;j++){if(q<sh[j]){cls=SFCK[j];break;}q-=sh[j];}if(P.only)cls=P.only;
    let q2=r()*100,svc='web';for(const s of sv){if(q2<SFSVC[s].p){svc=s;break;}q2-=SFSVC[s].p;}
    const u={i,cls,svc,d:P.rad*Math.max(0.04,Math.pow(r(),e)),in:r()*100<P.ind,ix:r()*8,sh:6*nGs(r),L:{},on:{},ds:{},bD:0,bU:0,avg:2e6,avgU:3e5,got:0,gotU:0,pb:0,ps:0,vr:3+5*r(),pc:null,cf:[],ulc:null,idle:0,pa:0,fst:-1,fs:null,r0:0,nd:0,mst:-1,blk:false,fb:false};
    u.rg=nRng(P.seed*1009+i*31+5);u.nx=u.rg()*(svc==='bulk'?12:svc==='web'?5:2);CC.forEach(C=>{u.L[C.k]=sfLk(C,u,P);});U.push(u);}
  return U;}
function sfRate(u,P){return ({vid:u.vr*1e6,web:2e6,bulk:6.4e6,voi:3.2e4})[u.svc]*P.dem;}
function sfCapU(E,C,u){const fr=sfFrac(C.pat,C.c.dx==='FDD').dl;return Math.max(1,u.L[C.k].bp*C.nrb*1000*C.spm*fr);}
function sfPick(E,u,cand){const pl=E.A.pl;let best=null,bv=-1e18;
  for(const C of cand){const L=u.L[C.k],ld=E.est[C.k]||0;let v;
    if(pl==='prio')v=SFPRI[C.k]*1e6+L.bp;else if(pl==='load')v=-ld*1e3+L.bp*1e-6;else if(pl==='se')v=L.bp;else v=sfCapU(E,C,u)*Math.max(0.03,1-ld);
    if(v>bv){bv=v;best=C;}}
  return best;}
function sfPlace(E,u){const cls=SFCLS[u.cls],nr=E.CC.filter(C=>C.c.rat==='nr'),lt=E.CC.filter(C=>C.c.rat==='lte'),cov=(C,th)=>u.L[C.k].sinr>=th;
  let pool=cls.rat==='nr'?nr:lt,cand=pool.filter(C=>cov(C,0));if(!cand.length)cand=pool.filter(C=>cov(C,-5));
  if(!cand.length&&cls.rat==='nr'){cand=lt.filter(C=>cov(C,-5));u.fb=true;pool=lt;}
  if(!cand.length&&cls.rat!=='nr'&&u.cls!=='l1'&&u.cls!=='lca'){cand=nr.filter(C=>cov(C,-5));u.fb=true;pool=nr;}
  if(!cand.length){u.blk=true;return;}
  const pc=sfPick(E,u,cand);u.pc=pc.k;u.cf=[pc.k];u.on[pc.k]=true;
  if(!u.fb){if(u.cls==='endc'){const nc=nr.filter(C=>cov(C,-3));if(nc.length){const s=sfPick(E,u,nc);u.cf.push(s.k);u.on[s.k]=true;}}
    else if(cls.ca>1){let sc=pool.filter(C=>C.k!==pc.k&&cov(C,-3));
      if(u.cls==='nca'){const pr=['n41','n77'].filter(k=>k!==pc.k);sc=sc.sort((a,b)=>(pr.includes(b.k)-pr.includes(a.k))||(u.L[b.k].bp-u.L[a.k].bp)).slice(0,1);}
      else sc=sc.sort((a,b)=>u.L[b.k].bp-u.L[a.k].bp).slice(0,cls.ca-1);
      sc.forEach(C=>u.cf.push(C.k));}}
  const r=sfRate(u,E.P);u.cf.forEach(k=>{E.est[k]+=r/u.cf.length/sfCapU(E,E.byK[k],u);});
  u.ulc=u.pc;if(u.cls==='endc'&&u.cf[1]&&u.L[u.cf[1]].u1>=12)u.ulc=u.cf[1];}
function sfLog(E,p,m,a,d){if(!E.rec)return;E.log.push({t:E.t,p,m,a,d});if(E.log.length>80)E.log.shift();}
function sfMk(P,A,rec){const cf=P.cfg,CC=SFK.filter(k=>cf.on[k]&&k!==P.off).map(k=>sfCar(k,cf,rec));
  const E={P,A,CC,byK:{},U:[],t:0,step:0,warm:P.warm||0,rec:!!rec,est:{},cb:[],smp:[],fl:{},log:[],dciT:0,dciB:0,ho:0,caT:0,caOn:0,hist:[],tb:[],tbc:{},tu:null,reset:false};
  CC.forEach(C=>{E.byK[C.k]=C;E.est[C.k]=0;});SFCK.forEach(c=>E.fl[c]={});
  E.U=sfMkU(P,CC);E.U.forEach(u=>sfPlace(E,u));sfLists(E);
  const hv=u=>u.svc==='vid'||u.svc==='bulk';E.tu=E.U.find(u=>(u.cls==='ga'||u.cls==='nca')&&u.cf.length>1&&hv(u))||E.U.find(u=>u.cls==='ga'&&u.cf.length>2&&u.svc!=='voi')||E.U.find(u=>(u.cls==='ga'||u.cls==='nca')&&u.cf.length>1&&u.svc!=='voi')||E.U.find(u=>u.cf.length>1)||E.U.find(u=>!u.blk)||null;
  if(E.tu){const u=E.tu;sfLog(E,'RRC','RRCSetup / RRCReconfiguration',`UE${u.i} (${SFCLS[u.cls].n}) PCell ${E.byK[u.pc].c.s}`,`Chọn PCell theo «${A.n}»`);
    if(u.cf.length>1)sfLog(E,'RRC',u.cls==='endc'?'RRCReconfiguration (SgNB Addition, SCG)':'RRCReconfiguration (sCellToAddModList)',u.cf.slice(1).map(k=>E.byK[k].c.s).join(', '),u.cls==='endc'?'X2AP SgNB Addition Request → Ack; nhánh NR luôn hoạt động':'SCell ở trạng thái tắt cho tới khi có MAC CE kích hoạt');}
  return E;}
function sfLists(E){E.CC.forEach(C=>{C.us=E.U.filter(u=>!u.blk&&u.cf.includes(C.k));C.uu=E.U.filter(u=>!u.blk&&u.ulc===C.k);});}
function sfShare(E,u){const a=u.cf.filter(k=>u.on[k]&&u.L[k].se>0),o={};if(a.length<=1){if(a[0])o[a[0]]=1;return o;}
  const sp=E.A.sp;if(sp==='pcell'){o[a.includes(u.pc)?u.pc:a[0]]=1;return o;}
  let s=0;a.forEach(k=>{const C=E.byK[k],w=sp==='cqi'?u.L[k].bp:sp==='load'?Math.max(0.03,1-C.L):u.L[k].bp*C.nrb*Math.max(0.03,1-C.L);o[k]=w;s+=w;});a.forEach(k=>o[k]/=s||1);return o;}
function sfMark(C,own,n,id){let p=C.ptr;while(n>0&&p<C.nrb){if(own[p]===-1){own[p]=id;n--;}p++;}C.ptr=p;}
function sfDone(E,u,dt){if(u.bD<=0){u.bD=0;if(u.svc!=='voi'&&u.ps>=0&&u.pb>2e5&&E.t>=E.warm)E.smp.push(u.pb/Math.max(0.0005,E.t+dt-u.ps));u.ps=-1;}}
function sfSch(E,C,ps){const P=E.P,st=E.step,dlf=C.dlf;let free=ps===1?C.av0:C.fr;if(free<=0){if(ps===2)C.bl=C.us.some(u=>u.on[C.k]&&u.bD>0);return;}
  const cand=E.cb;cand.length=0;
  for(const u of C.us){if(!u.on[C.k]||u.bD<=0)continue;const L=u.L[C.k];if(L.se<=0)continue;
    if(ps===1){if(u.fst!==st){u.fst=st;u.r0=u.bD;u.fs=sfShare(E,u);}const f=u.fs[C.k]||0;if(f<=0)continue;u.nd=Math.min(u.bD,f*u.r0);}else u.nd=u.bD;cand.push(u);}
  if(cand.length){const k=C.k;cand.sort((a,b)=>b.L[k].bp/(b.avg+1e4)-a.L[k].bp/(a.avg+1e4));
    const own=E.rec&&C.cur?C.cur.own:null,dt=0.001/C.spm;const cap=ps===1?Math.max(4,Math.ceil(free/Math.min(cand.length,6))):1e9;
    for(const u of cand){if(free<=0)break;const L=u.L[k],bp=L.bp*dlf;if(bp<=0)continue;
      if(u.ds[k]!==st){let sc=C;if(P.xcs&&k!==u.pc&&E.byK[u.pc]&&E.byK[u.pc].c.rat===C.c.rat&&E.byK[u.pc].go)sc=E.byK[u.pc];const ss=u.L[sc.k].sinr;E.dciT++;
        if(ss<-4){E.dciB++;continue;}let al=ss>10?2:ss>4?4:ss>-1?8:16;if(P.mcs&&u.cls==='ga'&&u.mst===st)al=0;
        if(sc.cceL<al){E.dciB++;continue;}sc.cceL-=al;u.mst=st;u.ds[k]=st;}
      const n=Math.min(free,cap,Math.ceil(u.nd/bp));if(n<=0)continue;free-=n;const bits=Math.min(u.bD,n*bp);
      u.bD-=bits;u.pb+=bits;u.got+=bits;C.bits+=bits;C.used+=n;C.wD+=n;C.hd+=n;E.fl[u.cls][k]=(E.fl[u.cls][k]||0)+bits;if(u===E.tu)E.tbc[k]=(E.tbc[k]||0)+bits;
      if(own)sfMark(C,own,n,u.i);sfDone(E,u,dt);}}
  C.fr=free;if(ps===2)C.bl=cand.some(u=>u.bD>0);}
function sfSchU(E,C){let free=C.nrb-C.pucch;const ulf=C.ulf,own=E.rec&&C.cur?C.cur.ownU:null;if(own){for(let i=0;i<C.pucch/2;i++){own[i]=-3;own[C.nrb-1-i]=-3;}}C.ptrU=C.pucch/2;
  const cand=C.uu.filter(u=>u.bU>0&&u.L[C.k].ulMax>0);cand.sort((a,b)=>b.L[C.k].u1-a.L[C.k].u1+(a.avgU-b.avgU)*1e-6);let n0=0;
  for(const u of cand){if(free<=0||n0>=8)break;const L=u.L[C.k];let n=Math.min(free,L.ulMax,Math.max(1,Math.ceil(u.bU/Math.max(1,sfUlBits(C,L,1,ulf)))));const b=sfUlBits(C,L,n,ulf);if(b<=0)continue;
    free-=n;n0++;u.bU=Math.max(0,u.bU-b);u.gotU+=b;C.bitsU+=b;C.usedU+=n;C.wU+=n;C.hu+=n;if(own){let p=C.ptrU;let m=n;while(m>0&&p<C.nrb){if(own[p]===-1){own[p]=u.i;m--;}p++;}C.ptrU=p;}}
  C.avU+=C.nrb;C.wUa+=C.nrb;C.hua+=C.nrb;}
function sfStats0(E){E.CC.forEach(C=>{C.used=C.av=C.usedU=C.avU=C.bits=C.bitsU=C.waste=0;});E.smp=[];SFCK.forEach(c=>E.fl[c]={});E.dciT=E.dciB=E.ho=E.caT=E.caOn=0;E.U.forEach(u=>{if(u.bD>0){u.ps=E.t;u.pb=0;}});}
function sfStep(E){const P=E.P,t=E.t,st=++E.step,CC=E.CC,U=E.U;
  if(!E.reset&&E.warm>0&&t>=E.warm){E.reset=true;sfStats0(E);}
  for(const u of U){if(u.blk)continue;while(u.nx<=t){const b=sfArr(u,P);if(u.bD<=0&&u.svc!=='voi'){u.ps=t;u.pb=0;}u.bD+=b;u.bU+=u.svc==='voi'?640:b*P.ulr/100;}}
  if(st%2===0){for(const u of U){if(u.blk||u.cf.length<2)continue;const ca=u.cls!=='endc';if(u.bD>0){E.caT++;if(u.cf.slice(1).some(k=>u.on[k]))E.caOn++;}
    if(!ca)continue;const sc=u.cf.slice(1),anyOn=sc.some(k=>u.on[k]);
    if(u.bD>P.scAct*8000&&!anyOn&&!u.pa){u.pa=t+0.003;if(u===E.tu)sfLog(E,'MAC','SCell Activation/Deactivation MAC CE',`bật ${sc.map(k=>E.byK[k].c.s).join(', ')}`,`bộ đệm ${nF(u.bD/8e6,2)} MB > ngưỡng ${P.scAct} kB; có hiệu lực sau ≈ 3 ms`);}
    if(u.pa&&t>=u.pa){sc.forEach(k=>{u.on[k]=true;});u.pa=0;}
    if(u.bD<=0){u.idle+=0.001;if(anyOn&&u.idle*1000>=P.scDeact){sc.forEach(k=>{u.on[k]=false;});if(u===E.tu)sfLog(E,'MAC','SCell Activation/Deactivation MAC CE',`tắt ${sc.map(k=>E.byK[k].c.s).join(', ')}`,`hết sCellDeactivationTimer ${P.scDeact} ms không có dữ liệu`);}}else u.idle=0;}}
  for(const C of CC){C.go=(st%(2/C.spm)===0);if(!C.go)continue;const sl=C.slot++,ty=C.pat[sl%C.pat.length];C.ty=ty;C.sl=sl;
    C.dlf=ty==='D'?1:ty==='S'?10/14:0;C.ulf=C.c.dx==='FDD'?1:(ty==='U'?1:ty==='S'?2/14:0);C.cceL=C.cce;C.ptr=0;C.fr=0;C.bl=false;
    const ssb=C.c.rat==='lte'?(sl%5===0):((sl%C.ssbPer)<C.ssbN);C.av0=C.nrb-(ssb?C.ssbW:0);
    if(E.rec){const e=C.rg[C.rp];C.rp=(C.rp+1)%20;e.ty=ty;e.sl=sl;e.own.fill(-1);e.ownU.fill(-1);if(ssb&&C.dlf>0)for(let i=0;i<C.ssbW;i++)e.own[C.s0+i]=-2;C.cur=e;}else C.cur=null;}
  for(const C of CC)if(C.go&&C.dlf>0)sfSch(E,C,1);
  for(const C of CC)if(C.go&&C.dlf>0)sfSch(E,C,2);
  const full={};for(const C of CC)if(C.go&&C.dlf>0&&C.fr<=0&&C.bl)full[C.c.rat]=C;
  for(const C of CC){if(!C.go)continue;if(C.dlf>0){const used=C.nrb-C.fr;C.av+=C.nrb;C.wA+=C.nrb;C.ha+=C.nrb;C.L=0.99*C.L+0.01*(used/C.nrb);const fu=full[C.c.rat];if(fu&&C!==fu&&C.fr>0)C.waste+=C.fr;if(C.cur)C.cur.cce=C.cce-C.cceL;}
    if(C.ulf>0)sfSchU(E,C);}
  for(const u of U){if(u.blk)continue;u.avg=0.995*u.avg+0.005*(u.got/0.0005);u.got=0;u.avgU=0.99*u.avgU+0.01*(u.gotU/0.0005);u.gotU=0;}
  if(st%20===0&&E.rec){const b={};CC.forEach(C=>{b[C.k]=E.tbc[C.k]||0;});b.on=E.tu?E.tu.cf.filter(k=>E.tu.on[k]).length:0;b.buf=E.tu?E.tu.bD:0;E.tb.push(b);if(E.tb.length>200)E.tb.shift();E.tbc={};}
  if(st%200===0){const h={t:E.t,d:{},u:{}};CC.forEach(C=>{h.d[C.k]=C.ha?C.hd/C.ha*100:0;h.u[C.k]=C.hua?C.hu/C.hua*100:0;C.hd=C.ha=C.hu=C.hua=0;});E.hist.push(h);if(E.hist.length>300)E.hist.shift();}
  if(E.A.lb&&st%2000===0)sfIflb(E);
  E.t+=0.0005;}
function sfIflb(E){const P=E.P;let moved=false;
  for(const g of ['nr','lte']){const cs=E.CC.filter(C=>C.c.rat===g&&C.wA>0);if(cs.length<2)continue;cs.forEach(C=>{C.Lw=C.wD/C.wA;});cs.sort((a,b)=>b.Lw-a.Lw);const hi=cs[0],lo=cs[cs.length-1];
    if(hi.Lw*100<P.thr||(hi.Lw-lo.Lw)*100<P.diff)continue;
    const mv=E.U.filter(u=>!u.blk&&((u.pc===hi.k&&u.cf.length===1)||(u.cls==='endc'&&u.cf[1]===hi.k))&&u.L[lo.k].sinr>=0&&u.bD>0).sort((a,b)=>b.L[lo.k].sinr-a.L[lo.k].sinr).slice(0,P.nmax);
    mv.forEach(u=>{if(u.cls==='endc'){u.cf[1]=lo.k;u.on[hi.k]=false;u.on[lo.k]=true;if(u.ulc===hi.k)u.ulc=lo.k;}else{u.pc=lo.k;u.cf=[lo.k];u.on={};u.on[lo.k]=true;u.ulc=lo.k;}});
    if(mv.length){moved=true;E.ho+=mv.length;sfLog(E,mv.some(u=>u.cls==='endc')?'X2AP':'RRC',mv.some(u=>u.cls==='endc')?'SgNB Modification (đổi PSCell) / RRCReconfiguration':'RRCReconfiguration (HO nội trạm khác tần số)',`${mv.length} UE ${hi.c.s} → ${lo.c.s}`,`tải ${nF(hi.Lw*100,0)} % > ${P.thr} %, chênh ${nF((hi.Lw-lo.Lw)*100,0)} % ≥ ${P.diff} %; cause: load balancing`);}}
  E.CC.forEach(C=>{C.wD=C.wA=C.wU=C.wUa=0;});if(moved)sfLists(E);}
function sfRes(E){const T=Math.max(1e-3,E.t-(E.warm||0)),CC=E.CC,tot=CC.reduce((a,C)=>a+C.bits,0)||1,bw=CC.reduce((a,C)=>a+C.bw,0);
  const smp=E.smp.slice();E.U.forEach(u=>{if(u.bD>0&&u.ps>=0&&u.svc!=='voi'&&E.t-u.ps>0.3&&u.pb>0)smp.push(u.pb/(E.t-u.ps));else if(u.bD>0&&u.ps>=0&&u.svc!=='voi'&&E.t-u.ps>0.3)smp.push(1e3);});
  const per={};CC.forEach(C=>{per[C.k]={dl:C.av?C.used/C.av*100:0,ul:C.avU?C.usedU/C.avU*100:0,tp:C.bits/T/1e6,tpU:C.bitsU/T/1e6,se:C.bits/T/(C.bw*1e6),sh:C.bits/tot*100,waste:C.av?C.waste/C.av*100:0,nu:C.us.length};});
  const gi=g=>{const v=CC.filter(C=>C.c.rat===g).map(C=>per[C.k].dl);return v.length>1?Math.max(...v)-Math.min(...v):0;},dl=[0];
  return {per,ks:CC.map(C=>C.k),tot:CC.reduce((a,C)=>a+C.bits,0)/T/1e6,totU:CC.reduce((a,C)=>a+C.bitsU,0)/T/1e6,se:CC.reduce((a,C)=>a+C.bits,0)/T/(bw*1e6),imb:Math.max(gi('nr'),gi('lte')),
    mean:sfAvg(smp)/1e6,p5:sfPct(smp,0.05)/1e6,n:smp.length,ca:E.caT?E.caOn/E.caT*100:0,pdb:E.dciT?E.dciB/E.dciT*100:0,ho:E.ho,blk:E.U.filter(u=>u.blk).length,
    waste:CC.reduce((a,C)=>a+C.waste,0)/Math.max(1,CC.reduce((a,C)=>a+C.av,0))*100,fl:E.fl};}
function sfRun(o,algKey,T){const P=sfParams(Object.assign({warm:1},o||{})),E=sfMk(P,SFAL[algKey]||SFAL.off,false),n=Math.round((T||6)/0.0005)+Math.round(P.warm/0.0005);for(let i=0;i<n;i++)sfStep(E);return sfRes(E);}
function sfBatch(tag,jobs,done){const id=++SFS.job;let i=0;const out=[];const prog=()=>sfSet('sfProg_'+tag,i<jobs.length?`<span class="note">Đang mô phỏng ${i}/${jobs.length}…</span>`:'');prog();
  const nx=()=>{if(id!==SFS.job)return;if(i>=jobs.length){prog();done(out);return;}try{out.push(jobs[i]());}catch(e){console.error(e);out.push(null);}i++;prog();setTimeout(nx,0);};setTimeout(nx,30);}
/* bộ mô phỏng chạy trực tiếp cho mục 2, 3 */
const SFL={E:null};
function sfLive(){if(!SFL.E)SFL.E=sfMk(sfParams(),SFAL[SFP.ue.alg]||SFAL.off,true);return SFL.E;}
function sfReset(){SFL.E=null;SFX={};SFS.job++;}

/* ---------- Mục 1: Cấu hình trạm và PRB vật lý ---------- */
function sfOn(){return SFK.filter(k=>SFP.cfg.on[k]);}
function sfSpec(){const ks=SFK.filter(k=>SFP.cfg.on[k]).sort((a,b)=>SFC[a].f-SFC[b].f),W=700,H=150;let x=14,s=`<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="Phổ tần các sóng mang của trạm">`;
  const tw=ks.reduce((a,k)=>a+30+SFP.cfg.bw[k]*3.2,0),sc=Math.min(1,(W-28-ks.length*14)/Math.max(1,tw));
  s+=`<line x1="10" y1="104" x2="${W-10}" y2="104" style="stroke:var(--line);stroke-width:1.5"/>`;
  ks.forEach(k=>{const c=SFC[k],bw=SFP.cfg.bw[k],w=(30+bw*3.2)*sc,nrb=sfNrb(k),g=nrb*12*c.scs/1000/bw;
    s+=`<rect x="${x}" y="${40}" width="${w}" height="62" rx="5" style="fill:${c.c};opacity:.16;stroke:${c.c}"/><rect x="${x+w*(1-g)/2}" y="46" width="${w*g}" height="50" rx="3" style="fill:${c.c};opacity:.42"/>`
     +`<text x="${x+w/2}" y="66" class="sftx" text-anchor="middle">${c.s} · ${bw} MHz</text><text x="${x+w/2}" y="84" class="sfsm" text-anchor="middle">${nrb} PRB · ${c.scs} kHz</text>`
     +`<text x="${x+w/2}" y="120" class="sfsm" text-anchor="middle">${nF(c.f*1000,0)} MHz</text><text x="${x+w/2}" y="136" class="sfsm" text-anchor="middle">${c.dx}${c.dx==='TDD'?' '+sfPat(k):''}</text>`
     +`<text x="${x+w/2}" y="30" class="sfsm" text-anchor="middle">${c.rat==='nr'?'NR':'LTE'} · ${SFP.cfg.ant[k]}</text>`;x+=w+14;});
  return s+'</svg>';}
function sfCfgRows(){const cf=SFP.cfg;return SFK.map(k=>{const c=SFC[k],on=cf.on[k],p=sfPeak(k),oh=sfOh(k);
  const bw=`<select data-sfi="cfg:bw.${k}" aria-label="Băng thông ${c.s}">${c.bws.map(b=>`<option value="${b}"${b===cf.bw[k]?' selected':''}>${b} MHz</option>`).join('')}</select>`;
  const an=`<select data-sfi="cfg:ant.${k}" aria-label="Anten ${c.s}">${c.ant.map(a=>`<option value="${a}"${a===cf.ant[k]?' selected':''}>${SFAN[a].n}</option>`).join('')}</select>`;
  const td=c.dx==='TDD'?`<select data-sfi="cfg:tdd.${c.rat==='lte'?'b40':k}" aria-label="Khung TDD ${c.s}">${(c.rat==='lte'?['DSUDD','DSUUD']:['DDDSU','DDDDDDDSUU','DDSUU']).map(t=>`<option value="${t}"${t===sfPat(k)?' selected':''}>${nE(SFTD[t])}</option>`).join('')}</select>`:'FDD';
  return `<tr class="${cf.sel===k?'sfsel':''}${on?'':' sfoff'}"><td><label class="u3ck"><input type="checkbox" data-sfi="cfg:on.${k}"${on?' checked':''}> <b style="color:${c.c}">${c.n}</b></label><br><span class="note">${c.mhz} MHz</span></td><td>${bw}</td><td>${c.scs} kHz</td><td><b>${sfNrb(k)}</b></td><td>${td}</td><td>${an}</td>
   <td>${nF(oh.tot*100,1)} %</td><td>${sfMb(p.dl)}</td><td>${sfMb(p.ul)}</td><td>${nF(sfRad(k,null,0,0)/1000,1)} / ${nF(sfRad(k,null,1,0)/1000,1)}</td><td>${nF(sfRad(k,null,0,1)/1000,2)}</td><td><button type="button" class="btn sm" data-sfa="cfg:sel:${k}">Chi tiết</button></td></tr>`;}).join('');}
function sfTot(){const ks=sfOn();let dl=0,ul=0,bw=0,prb=0,nr=0,lt=0;ks.forEach(k=>{const p=sfPeak(k);dl+=p.dl;ul+=p.ul;bw+=SFP.cfg.bw[k];prb+=sfNrb(k);if(SFC[k].rat==='nr')nr+=SFP.cfg.bw[k];else lt+=SFP.cfg.bw[k];});
  const w=[];if(SFP.cfg.on.b1&&SFP.cfg.on.n1)w.push('B1 và n1 cùng dải 2100 MHz: cần DSS hoặc chia phổ, không thể bật cả hai trên cùng khối phổ.');
  if(SFP.cfg.on.b7&&SFP.cfg.on.n41)w.push('B7 nằm trong dải n41 (2496–2690 MHz): chỉ dùng khi n41 không chồng khối phổ B7.');
  if(SFP.cfg.on.n41&&SFP.cfg.on.n77&&sfPat('n41')!==sfPat('n77'))w.push('n41 và n77 khác mẫu khung TDD: hai băng khác nhau nên không nhiễu chéo trực tiếp, nhưng CA n41+n77 cần căn biên khe và lập lịch HARQ phức tạp hơn; thường dùng cùng DDDSU.');
  return sfKv('Số sóng mang / tổng băng thông',`${ks.length} · ${bw} MHz (NR ${nr} MHz, LTE ${lt} MHz)`)+sfKv('Tổng PRB vật lý',prb)+sfKv('Tốc độ đỉnh DL / UL cả trạm',sfMb(dl)+' / '+sfMb(ul))
   +sfKv('Hiệu suất phổ đỉnh DL',nF(dl/Math.max(1,bw),2)+' bit/s/Hz')+(w.length?sfKv('Lưu ý',`<span class="lbbad">${w.map(nE).join('<br>')}</span>`):'');}
function sfPatSvg(k){const pat=sfPat(k),c=SFC[k],n=c.dx==='FDD'?10:Math.max(10,pat.length*2),W=640,cw=(W-20)/n;let s=`<svg viewBox="0 0 ${W} 74" class="u3svg" role="img" aria-label="Mẫu khung">`;
  for(let i=0;i<n;i++){const t=c.dx==='FDD'?'D':pat[i%pat.length],x=10+i*cw;
    if(t==='S'){s+=`<rect x="${x}" y="14" width="${cw*10/14-1}" height="34" style="fill:${c.c};opacity:.5"/><rect x="${x+cw*10/14}" y="14" width="${cw*2/14}" height="34" style="fill:var(--line)"/><rect x="${x+cw*12/14}" y="14" width="${cw*2/14-1}" height="34" style="fill:var(--warn);opacity:.5"/>`;}
    else s+=`<rect x="${x}" y="14" width="${cw-1}" height="34" style="fill:${t==='D'?c.c:'var(--warn)'};opacity:${t==='D'?.5:.45}"/>`;
    s+=`<rect x="${x}" y="14" width="${cw*(c.rat==='lte'?SFP.cfg.cfi:SFP.cfg.cs)/14}" height="34" style="fill:#E0A030;opacity:${t==='U'?0:.85}"/><text x="${x+cw/2}" y="36" class="sftx" text-anchor="middle">${t}</text><text x="${x+cw/2}" y="64" class="sfsm" text-anchor="middle">${i}</text>`;}
  return s+`</svg>`;}
function sfDet(){const k=SFP.cfg.sel,c=SFC[k],cf=SFP.cfg;if(!cf.on[k])return `<p class="hint">${nE(c.n)} đang tắt. Bật ở bảng bên trên để xem chi tiết.</p>`;
  const nrb=sfNrb(k),bw=cf.bw[k],oh=sfOh(k),p=sfPeak(k),cce=sfCce(k),g=1-nrb*12*c.scs/1000/bw,a=SFAN[cf.ant[k]],sym=14*c.scs/15;
  const rows=[['PDCCH / CORESET',oh.pd*100,'#E0A030'],[c.rat==='lte'?'CRS (tham chiếu ô)':'DMRS PDSCH',oh.dm*100,'#8A9BB0'],[c.rat==='lte'?'PSS/SSS/PBCH':'SSB (PSS/SSS/PBCH)',oh.ssb*100,'#D9488F'],[c.rat==='lte'?'Khác':'CSI-RS / TRS',oh.csi*100,'#3AA6C9']];
  return `<div class="u3two"><div><dl class="kv">${sfKv('Sóng mang',nE(c.n))+sfKv('Băng thông / SCS',`${bw} MHz · ${c.scs} kHz (khe ${nF(1/(c.scs/15),c.scs===15?0:1)} ms)`)+sfKv('PRB vật lý',`<b>${nrb}</b> (${nrb*12} sóng mang con, ${c.rat==='lte'?'TS 36.101 §5.6':'TS 38.101-1 bảng 5.3.2-1'})`)
   +sfKv('Băng bảo vệ',nF(g*100,1)+' % băng thông')+sfKv('RE mỗi PRB mỗi khe','12 × 14 = 168; dữ liệu ≈ '+nF(168*(1-oh.tot),0))+sfKv('Anten / lớp',`${a.n} · tối đa ${p.lay} lớp DL cho UE${a.pw?' · '+a.pw+' W':''}`)
   +sfKv(c.rat==='lte'?'PDCCH (CFI)':'CORESET',c.rat==='lte'?`${cf.cfi} ký hiệu, ≈ ${cce} CCE`:`${cf.cs} ký hiệu × ${Math.floor(nrb/6)*6} PRB → ${cce} CCE (≈ ${Math.floor(cce*0.65/4)} DCI DL ở AL4)`)
   +sfKv(c.rat==='lte'?'Đồng bộ':'SSB',c.rat==='lte'?'PSS/SSS/PBCH 6 PRB giữa, subframe 0 và 5':`L<sub>max</sub> = ${c.f>3?8:4}, chu kỳ ${cf.ssb} ms, 20 PRB`)
   +sfKv('Tỉ lệ khe DL / UL',nF(p.fr.dl*100,1)+' % / '+nF(p.fr.ul*100,1)+' %')+sfKv('Đỉnh DL (TS 38.306 §4.1.2)',sfMb(p.dl))+sfKv('Đỉnh UL',sfMb(p.ul))}</dl></div>
   <div><b>Overhead DL theo loại</b>${nBars(rows,25,' %',1)}<p class="note">Đỉnh = lớp × Q<sub>m</sub> (${cf.qam===64?6:8}) × 948/1024 × N<sub>PRB</sub> × 12 × ${nF(sym*1000,0)} ký hiệu/s × (1 − OH ${nF(oh.tot*100,1)} %) × tỉ lệ khe DL ${nF(p.fr.dl,3)}.</p></div></div>
   <p style="margin:8px 0 2px"><b>Mẫu khung</b> (cam: PDCCH ở đầu khe; S = ${c.rat==='lte'?'DwPTS : GP : UpPTS':'10 DL : 2 GP : 2 UL'})</p><div class="scroll"><div class="sfw">${sfPatSvg(k)}</div></div>`;}
function sfCfgMsgs(){const ks=sfOn(),m=[];let t=0;
  ks.filter(k=>SFC[k].rat==='nr').forEach(k=>{const c=SFC[k];m.push({t:t+=0.01,p:'RRC',m:`MIB + SIB1 (${c.s})`,a:`servingCellConfigCommon: carrierBandwidth ${sfNrb(k)}, subcarrierSpacing kHz${c.scs}${c.dx==='TDD'?', tdd-UL-DL-ConfigurationCommon '+sfPat(k):''}`,d:`ssb-periodicityServingCell ms${SFP.cfg.ssb}, CORESET ${SFP.cfg.cs} ký hiệu`});});
  ks.filter(k=>SFC[k].rat==='lte').forEach(k=>{const c=SFC[k];m.push({t:t+=0.01,p:'RRC',m:`MIB + SIB1/SIB2 (${c.s})`,a:`dl-Bandwidth n${sfNrb(k)}${c.dx==='TDD'?', tdd-Config sa'+(sfPat(k)==='DSUDD'?2:1):''}`,d:`CFI ${SFP.cfg.cfi}, CRS ${SFAN[SFP.cfg.ant[k]].lay>=4?4:2} cổng`});});
  const nr=ks.filter(k=>SFC[k].rat==='nr'),lt=ks.filter(k=>SFC[k].rat==='lte');
  if(nr.length>1)m.push({t:t+=0.05,p:'RRC',m:'RRCReconfiguration (NR CA)',a:`sCellToAddModList: ${nr.slice(1).map(k=>SFC[k].s).join(', ')}`,d:'SCell thêm ở trạng thái tắt; kích hoạt bằng MAC CE (TS 38.321 §5.9)'});
  if(lt.length>1)m.push({t:t+=0.05,p:'RRC',m:'RRCConnectionReconfiguration (LTE-A CA)',a:`sCellToAddModList-r10: ${lt.slice(1).map(k=>SFC[k].s).join(', ')}`});
  if(nr.length&&lt.length)m.push({t:t+=0.05,p:'X2AP',m:'SgNB Addition Request / Ack (EN-DC)',a:`MCG ${SFC[lt[0]].s} + SCG ${SFC[nr[0]].s}`,d:'RRCConnectionReconfiguration chứa nr-Config-r15 (RRCReconfiguration của gNB)'});
  return m;}
SFR.cfg={
 html(){return `<div class="panel"><h3>Phổ tần của trạm</h3><div class="scroll"><div class="sfw" id="sfSpec">${sfSpec()}</div></div><p class="note">Vùng đậm là phần băng thông thực sự chứa PRB, hai bên là băng bảo vệ. Mặc định: n41 2600 TDD 100 MHz + n77 3800 TDD 100 MHz, kèm LTE B3 1800 20 MHz (neo EN-DC) và B1 2100 15 MHz.</p></div>
  <div class="panel"><h3>Sóng mang cùng trạm</h3><div class="scroll"><table class="ndtb sftb"><thead><tr><th>Sóng mang</th><th>Băng thông</th><th>SCS</th><th>PRB</th><th>Khung</th><th>Anten</th><th>OH DL</th><th>Đỉnh DL</th><th>Đỉnh UL</th><th>Phủ DL ngoài/trong nhà (km)</th><th>Phủ UL (km)</th><th></th></tr></thead><tbody id="sfCfgTb">${sfCfgRows()}</tbody></table></div>
   <p class="note">Bán kính phủ ước tính theo TR 38.901 UMa NLOS, biên 14 dB (che khuất, thân người, nhiễu), trong nhà cộng xuyên toà nhà low-loss + 5 dB; UL: UE 23 dBm trên 4 PRB. n77 kém n41 khoảng 3–4 dB do tần số và xuyên toà nhà.</p></div>
  <div class="cols"><div>
   <div class="panel"><h3>Chi tiết sóng mang</h3><div id="sfDet">${sfDet()}</div></div>
   <div class="panel"><h3>Nhật ký bản tin cấu hình</h3><div id="sfCfgLog">${nLog(sfCfgMsgs(),-1)}</div></div>
  </div><div>
   <div class="panel"><h3>Tổng cả trạm</h3><dl class="kv" id="sfTot">${sfTot()}</dl></div>
   <div class="panel"><h3>Tham số chung</h3><div class="ctl" style="grid-template-columns:1fr">
    ${sfSel('cfg','cs','CORESET NR (ký hiệu)',[[1,'1 ký hiệu'],[2,'2 ký hiệu'],[3,'3 ký hiệu']],'','coreset')}
    ${sfSel('cfg','cfi','PDCCH LTE (CFI)',[[1,'CFI 1'],[2,'CFI 2'],[3,'CFI 3']],'','cfi')}
    ${sfSel('cfg','ssb','Chu kỳ SSB',[[5,'5 ms'],[10,'10 ms'],[20,'20 ms'],[40,'40 ms'],[80,'80 ms'],[160,'160 ms']],'','ssbPer')}
    ${sfSel('cfg','qam','Điều chế DL tối đa',[[64,'64QAM'],[256,'256QAM']],'1024QAM (Rel-17) có ở thẻ Ghép sóng mang')}
   </div></div>
   <div class="panel"><h3>Số PRB theo băng thông</h3><p class="note">NR 30 kHz: 40 MHz → 106, 50 → 133, 60 → 162, 80 → 217, 90 → 245, 100 → 273 PRB. NR 15 kHz: 10 → 52, 15 → 79, 20 → 106. LTE: 5 → 25, 10 → 50, 15 → 75, 20 → 100. Cùng bảng với thẻ Cấp phát PRB và Ghép sóng mang.</p></div>
  </div></div>`;},
 upd(k,vw){if(vw==='cfg'){sfSet('sfSpec',sfSpec());sfSet('sfCfgTb',sfCfgRows());sfSet('sfTot',sfTot());sfSet('sfDet',sfDet());sfSet('sfCfgLog',nLog(sfCfgMsgs(),-1));}},
 act(a,t){const [x,k]=a.split('|');if(x==='sel'){SFP.cfg.sel=k;sfSet('sfCfgTb',sfCfgRows());sfSet('sfDet',sfDet());}}
};

/* ---------- Mục 2: Lưới PRB × khe theo thời gian ---------- */
SFP.grid={view:'dl',col:'ue',spd:60,hr:20};
function sfCol(){const cs=getComputedStyle(document.documentElement),g=n=>(cs.getPropertyValue(n)||'').trim();return {line:g('--line')||'#ccd',muted:g('--muted')||'#889',panel:g('--panel2')||'#f4f6fb',ink:g('--ink')||'#123',warn:g('--warn')||'#d55'};}
function sfUeC(E,id){const u=E.U[id];if(!u)return '#999';const m=SFP.grid.col;return m==='svc'?SFSVC[u.svc].c:m==='cls'?SFCLS[u.cls].c:`hsl(${(id*67)%360} 62% 52%)`;}
function sfDrawCv(E,C,cv,K){if(!cv||!C.rg)return;const dpr=Math.min(2,window.devicePixelRatio||1),W=720,nrb=C.nrb,rh=Math.max(1,Math.floor(300/nrb)),H=nrb*rh+22;
  if(cv.width!==W*dpr||cv.height!==H*dpr){cv.width=W*dpr;cv.height=H*dpr;cv.style.aspectRatio=W+'/'+H;}
  const x=cv.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);const L=40,cw=(W-L-4)/20,ul=SFP.grid.view==='ul';
  x.fillStyle=K.panel;x.fillRect(L,0,W-L-4,nrb*rh);x.font='10px sans-serif';
  for(let i=0;i<20;i++){const e=C.rg[(C.rp+i)%20];if(e.sl<0)continue;const x0=L+i*cw,isUl=ul?(e.ty==='D'&&C.c.dx==='TDD'):(e.ty==='U');
    if(isUl){x.fillStyle=K.line;x.globalAlpha=.55;x.fillRect(x0,0,cw-1,nrb*rh);x.globalAlpha=1;}
    else{const own=ul?e.ownU:e.own;let p=0;while(p<nrb){const o=own[p];let q=p+1;while(q<nrb&&own[q]===o)q++;
        if(o!==-1){x.fillStyle=o===-2?'#D9488F':o===-3?'#8A9BB0':sfUeC(E,o);x.globalAlpha=o<0?.9:.85;x.fillRect(x0,(nrb-q)*rh,cw-1,(q-p)*rh);x.globalAlpha=1;}p=q;}
      if(!ul){x.fillStyle='#E0A030';x.globalAlpha=.9;x.fillRect(x0,0,cw*C.cs/14,nrb*rh);x.globalAlpha=1;
        if(C.c.rat==='nr'&&(e.sl%20===2||e.sl%40===10||e.sl%40===11)){x.fillStyle='#3AA6C9';x.fillRect(x0+cw*(e.sl%20===2?12:6)/14,0,Math.max(1,cw/14),nrb*rh);}}
      if(e.ty==='S'){x.fillStyle=K.line;x.globalAlpha=.8;if(ul)x.fillRect(x0,0,cw*12/14,nrb*rh);else x.fillRect(x0+cw*10/14,0,cw*4/14-1,nrb*rh);x.globalAlpha=1;}}
    x.fillStyle=K.muted;x.textAlign='center';x.fillText(e.ty+(i%5===0?' '+e.sl:''),x0+cw/2,nrb*rh+14);}
  x.textAlign='right';x.fillStyle=K.muted;x.fillText(nrb-1,L-4,10);x.fillText('0',L-4,nrb*rh);x.save();x.translate(10,nrb*rh/2);x.rotate(-Math.PI/2);x.textAlign='center';x.fillText('PRB',0,0);x.restore();}
function sfGInfo(E,C){const h=E.hist.slice(-10),d=sfAvg(h.map(x=>x.d[C.k]||0)),u=sfAvg(h.map(x=>x.u[C.k]||0)),e=C.rg?C.rg[(C.rp+19)%20]:null,act=C.us.filter(x=>x.on[C.k]&&x.bD>0).length;
  return `DL <b class="${d>85?'lbbad':''}">${nF(d,0)} %</b> · UL <b class="${u>85?'lbbad':''}">${nF(u,0)} %</b> · UE cấu hình ${C.us.length}, có dữ liệu ${act} · CCE ${e?e.cce:0}/${C.cce} · khe ${C.c.scs===30?'0,5':'1'} ms`;}
function sfGLoadPlot(E){const h=E.hist;if(!h.length)return '<p class="hint">Đang thu số liệu…</p>';const t1=Math.max(5,h[h.length-1].t),t0=Math.max(0,t1-10),ul=SFP.grid.view==='ul';
  return nPlot({w:680,h:200,x0:t0,x1:t1,y0:0,y1:100,yt:[0,25,50,75,100],xt:[0,1,2,3,4,5].map(i=>t0+(t1-t0)*i/5),xf:v=>nF(v,1),series:E.CC.map(C=>({c:C.c.c,w:2,pts:h.filter(x=>x.t>=t0).map(x=>[x.t,(ul?x.u:x.d)[C.k]||0])})),hl:[[SFP.ue.thr,'var(--warn)','ngưỡng '+SFP.ue.thr+' %']],ylab:'tải PRB '+(ul?'UL':'DL')+' (%)',xlab:'giây (mô phỏng)',aria:'Tải PRB theo giây'});}
function sfGHourPlot(E){const h=E.hist.slice(-20);if(!h.length)return '';const ref=SFHP[SFP.grid.hr]||1;
  const ser=E.CC.map(C=>{const cur=sfAvg(h.map(x=>x.d[C.k]||0));return {c:C.c.c,w:2,pts:SFHP.map((v,i)=>[i,Math.min(100,cur*v/ref)])};});
  return nPlot({w:680,h:190,x0:0,x1:23,y0:0,y1:100,yt:[0,25,50,75,100],xt:[0,3,6,9,12,15,18,21,23],series:ser,cur:SFP.grid.hr,hl:[[85,'var(--warn)','85 %']],ylab:'tải PRB DL (%)',xlab:'giờ',aria:'Tải ước tính theo giờ'});}
function sfLeg(){const m=SFP.grid.col;const it=m==='svc'?Object.values(SFSVC).map(s=>[s.n,s.c]):m==='cls'?Object.values(SFCLS).map(s=>[s.n,s.c]):[['mỗi màu là một UE','hsl(200 62% 52%)']];
  return `<p class="legend">${it.concat([['PDCCH / CORESET','#E0A030'],['SSB / PBCH','#D9488F'],['CSI-RS / TRS','#3AA6C9'],['PUCCH (UL)','#8A9BB0'],['khe chiều kia / GP','var(--line)']]).map(i=>`<span><i style="background:${i[1]}"></i>${nE(i[0])}</span>`).join('')}</p>`;}
function sfAlgSel(vw){return sfSel('ue','alg','Thuật toán đang chạy',SFAK.map(a=>[a,SFAL[a].n]),'','mlbIntra');}
SFR.grid={
 html(){const E=sfLive();return `<div class="cols"><div>
   <div class="panel"><h3>Lưới PRB × khe từng sóng mang (${SFP.grid.view==='ul'?'đường lên':'đường xuống'})</h3>
    <div class="row" style="margin-top:0">${sfPlayBtn('grid','sfGPlay')}<button type="button" class="btn sm" data-sfa="grid:step">Bước 1 khe</button><button type="button" class="btn sm" data-sfa="grid:reset">Chạy lại từ đầu</button><span class="note" id="sfGT"></span></div>
    ${E.CC.map(C=>`<div class="sfgh"><b style="color:${C.c.c}">${nE(C.c.n)}</b> · ${C.bw} MHz · ${C.nrb} PRB <span class="note" id="sfGi_${C.k}">${sfGInfo(E,C)}</span></div><div class="scroll"><div class="sfw"><canvas class="sfcv" id="sfCv_${C.k}" role="img" aria-label="Lưới PRB ${nE(C.c.s)}"></canvas></div></div>`).join('')}
    ${sfLeg()}<p class="note">Mỗi cột là một khe (NR 30 kHz: 0,5 ms; LTE và NR 15 kHz: 1 ms), cột phải là khe mới nhất, 20 khe gần nhất. Trục đứng là từng PRB vật lý. PDSCH cấp liên tục (type 1); SSB và PBCH chiếm 20 PRB giữa băng (LTE: 6 PRB) ở các khe có SSB; PDCCH ở ${SFP.cfg.cs} ký hiệu đầu khe NR, ${SFP.cfg.cfi} ký hiệu đầu subframe LTE.</p></div>
   <div class="panel"><h3>Tải PRB ${SFP.grid.view==='ul'?'UL':'DL'} theo giây</h3><div class="scroll"><div class="sfw" id="sfGl">${sfGLoadPlot(E)}</div></div><p class="legend">${E.CC.map(C=>`<span><i style="background:${C.c.c}"></i>${C.c.s}</span>`).join('')}</p></div>
   <div class="panel"><h3>Tải DL ước tính theo giờ</h3><div class="scroll"><div class="sfw" id="sfGh">${sfGHourPlot(E)}</div></div><p class="note">Ngoại suy tuyến tính từ tải đang đo theo hồ sơ lưu lượng 24 giờ (giờ đang mô phỏng ở vạch đứng). Mô phỏng đủ 24 giờ với cân bằng tải có ở mục Kịch bản.</p></div>
  </div><div>
   <div class="panel"><h3>Hiển thị</h3><div class="ctl" style="grid-template-columns:1fr">
    ${sfSel('grid','view','Chiều',[['dl','Đường xuống (PDSCH)'],['ul','Đường lên (PUSCH)']])}${sfSel('grid','col','Tô màu PRB theo',[['ue','Từng UE'],['svc','Dịch vụ'],['cls','Loại UE (CA / không CA)']])}
    ${sfSl('grid','spd','Tốc độ chạy',5,600,5,v=>v+' khe/giây')}${sfSl('grid','hr','Giờ đang mô phỏng',0,23,1,v=>v+' h')}</div></div>
   <div class="panel"><h3>Lưu lượng và thuật toán</h3><div class="ctl" style="grid-template-columns:1fr">
    ${sfAlgSel('grid')}${sfSl('ue','n','Số UE kết nối',20,400,10,v=>v)}${sfSl('ue','dem','Hệ số lưu lượng mỗi UE',0.2,3,0.1,v=>'× '+nF(v,1))}</div></div>
   <div class="panel"><h3>Nhật ký bản tin</h3><div id="sfGlog">${sfLogH(E)}</div></div>
  </div></div>`;},
 after(){this.draw(true);},
 draw(force){const E=sfLive(),K=sfCol();E.CC.forEach(C=>sfDrawCv(E,C,document.getElementById('sfCv_'+C.k),K));
  const now=performance.now();if(force||now-SFS.dr>400){SFS.dr=now;E.CC.forEach(C=>sfSet('sfGi_'+C.k,sfGInfo(E,C)));sfSet('sfGl',sfGLoadPlot(E));sfSet('sfGh',sfGHourPlot(E));sfSet('sfGlog',sfLogH(E));const t=document.getElementById('sfGT');if(t)t.textContent=`t = ${nF(E.t,3)} s mô phỏng`;}},
 tick(dt){const E=sfLive();if(!SFS.pause){SFS.acc+=dt*SFP.grid.spd*2;let n=Math.min(1200,Math.floor(SFS.acc));SFS.acc-=n;for(let i=0;i<n;i++)sfStep(E);if(n||dt===0)this.draw(dt===0);}else if(dt===0)this.draw(true);},
 upd(k,vw){if(vw==='ue'&&k!=='alg'&&k!=='n'&&k!=='dem')return;if(k==='spd')return;if(k==='hr'){sfSet('sfGh',sfGHourPlot(sfLive()));return;}renderSf();},
 act(a){if(a==='play')sfPlayTog('sfGPlay');else if(a==='step'){const E=sfLive();sfStep(E);sfStep(E);this.draw(true);}else if(a==='reset'){SFL.E=null;renderSf();}}
};
function sfLogH(E){const ms=E.log.slice(-12);return nLog(ms,ms.length-1);}

/* ---------- Mục 3: Chia lưu lượng giữa các sóng mang ---------- */
function sfSankey(E){const W=680,H=330,cls=SFCK,ks=E.CC.map(C=>C.k);let tot=0;cls.forEach(c=>ks.forEach(k=>{tot+=E.fl[c][k]||0;}));tot=tot||1;
  const cy=i=>30+i*50,ly=j=>40+j*(260/Math.max(1,ks.length-1||1)),h=E.hist.slice(-10);let s=`<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="Lưu lượng từ loại UE sang sóng mang">`;
  cls.forEach((c,i)=>{const n=E.U.filter(u=>u.cls===c&&!u.blk).length;s+=`<rect x="8" y="${cy(i)-16}" width="170" height="32" rx="6" class="u3pbg" style="stroke:${SFCLS[c].c}"/><text x="16" y="${cy(i)+4}" class="sftx">${nE(SFCLS[c].n)} · ${n}</text>`;});
  cls.forEach((c,i)=>ks.forEach((k,j)=>{const v=E.fl[c][k]||0;if(v<=0)return;const w=Math.max(0.8,v/tot*80);s+=`<path d="M178 ${cy(i)} C 330 ${cy(i)}, 360 ${ly(j)}, 480 ${ly(j)}" style="fill:none;stroke:${SFC[k].c};stroke-width:${w.toFixed(1)};opacity:.45"/>`;}));
  ks.forEach((k,j)=>{const ld=sfAvg(h.map(x=>x.d[k]||0)),sh=cls.reduce((a,c)=>a+(E.fl[c][k]||0),0)/tot*100,c=ld>85?'var(--warn)':SFC[k].c;
    s+=`<rect x="480" y="${ly(j)-22}" width="190" height="44" rx="6" class="u3pbg"/><rect x="480" y="${ly(j)-22}" width="${nC(ld*1.9,0,190).toFixed(1)}" height="44" rx="6" style="fill:${c};opacity:.32"/><text x="488" y="${ly(j)-4}" class="sftx">${nE(SFC[k].n)}</text><text x="488" y="${ly(j)+14}" class="sfsm">tải DL ${nF(ld,0)} % · ${nF(sh,0)} % lưu lượng</text>`;});
  return s+'</svg>';}
function sfTuPlot(E){const u=E.tu;if(!u)return '<p class="hint">Không có UE CA để theo dõi.</p>';const b=E.tb.slice(-150),W=680,H=200,L=44,bw=(W-L-10)/150;let mx=10;
  b.forEach(x=>{let s=0;u.cf.forEach(k=>{s+=x[k]||0;});mx=Math.max(mx,s/0.01/1e6);});mx=Math.ceil(mx/50)*50||50;
  let s=`<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="Tốc độ theo từng CC của UE đang theo dõi"><rect x="${L}" y="10" width="${W-L-10}" height="${H-40}" class="u3pbg"/>`;
  [0,0.5,1].forEach(f=>{const y=10+(H-40)*(1-f);s+=`<line x1="${L}" x2="${W-10}" y1="${y}" y2="${y}" class="u3grid"/><text x="${L-4}" y="${y+4}" class="u3ax" text-anchor="end">${nF(mx*f,0)}</text>`;});
  b.forEach((x,i)=>{let y0=H-30;u.cf.forEach(k=>{const v=(x[k]||0)/0.01/1e6,h=v/mx*(H-40);if(h>0.2){s+=`<rect x="${L+i*bw}" y="${(y0-h).toFixed(1)}" width="${Math.max(0.6,bw-0.3).toFixed(2)}" height="${h.toFixed(1)}" style="fill:${SFC[k].c};opacity:.8"/>`;y0-=h;}});
    s+=`<rect x="${L+i*bw}" y="${H-24}" width="${Math.max(0.6,bw-0.3).toFixed(2)}" height="6" style="fill:${x.on>1?'var(--k1)':'var(--line)'}"/>`;});
  return s+`<text x="12" y="${10+(H-40)/2}" class="u3ax" transform="rotate(-90 12 ${10+(H-40)/2})" text-anchor="middle">Mbit/s</text><text x="${W-10}" y="${H-4}" class="u3ax" text-anchor="end">1,5 s gần nhất (bước 10 ms) · dải dưới: xanh = SCell đang bật</text></svg>`;}
function sfTuInfo(E){const u=E.tu;if(!u)return '';return sfKv('UE',`UE${u.i} · ${nE(SFCLS[u.cls].n)} · ${nE(SFSVC[u.svc].n)}`)+sfKv('Vị trí',`${nF(u.d,0)} m${u.in?', trong nhà':', ngoài trời'}`)
  +sfKv('PCell / SCell',u.cf.map((k,i)=>`<span style="color:${SFC[k].c}">${SFC[k].s}${i?'':' (P)'}${u.on[k]?'':' – tắt'}</span>`).join(' · '))
  +sfKv('SINR từng CC',u.cf.map(k=>`${SFC[k].s} ${nF(u.L[k].sinr,1)} dB, ${u.L[k].rk} lớp`).join(' · '))+sfKv('Bộ đệm DL',nF(u.bD/8e6,2)+' MB')+sfKv('Đường lên trên',E.byK[u.ulc]?SFC[u.ulc].s:'—');}
function sfClsTb(E){const ks=E.CC.map(C=>C.k);return `<table class="ndtb sftb"><thead><tr><th>Loại UE</th><th>UE</th><th>CC cấu hình</th><th>Lưu lượng theo sóng mang</th></tr></thead><tbody>${SFCK.map(c=>{const us=E.U.filter(u=>u.cls===c&&!u.blk);if(!us.length)return '';const tot=ks.reduce((a,k)=>a+(E.fl[c][k]||0),0)||1;
  return `<tr><td><b style="color:${SFCLS[c].c}">${nE(SFCLS[c].n)}</b></td><td>${us.length}${us.some(u=>u.fb)?` <span class="note">(${us.filter(u=>u.fb).length} rơi về LTE)</span>`:''}</td><td>${nF(sfAvg(us.map(u=>u.cf.length)),1)}</td><td>${ks.filter(k=>(E.fl[c][k]||0)>0).map(k=>`<span class="lbchip" style="color:${SFC[k].c}">${SFC[k].s} ${nF((E.fl[c][k]||0)/tot*100,0)} %</span>`).join(' ')||'—'}</td></tr>`;}).join('')}</tbody></table>`;}
SFR.split={
 html(){const E=sfLive(),P=SFP.ue;return `<div class="cols"><div>
   <div class="panel"><h3>Lưu lượng từ loại UE sang sóng mang (cộng dồn)</h3><div class="row" style="margin-top:0">${sfPlayBtn('split','sfSPlay')}<button type="button" class="btn sm" data-sfa="split:reset">Chạy lại từ đầu</button><span class="note" id="sfST"></span></div>
    <div class="scroll"><div class="sfw" id="sfSk">${sfSankey(E)}</div></div><p class="note">Độ dày dây ∝ lượng bit đã truyền. Ô bên phải: tải PRB DL 1 giây gần nhất và phần lưu lượng của cả trạm. Thuật toán: <b>${nE(SFAL[P.alg].n)}</b>.</p></div>
   <div class="panel"><h3>UE đang theo dõi: gói chia giữa các CC</h3><dl class="kv" id="sfTuI">${sfTuInfo(E)}</dl><div class="scroll"><div class="sfw" id="sfTu">${sfTuPlot(E)}</div></div>
    <div class="row"><button type="button" class="btn sm" data-sfa="split:next">Theo dõi UE CA khác</button></div></div>
   <div class="panel"><h3>Theo loại UE</h3><div class="scroll" id="sfCt">${sfClsTb(E)}</div></div>
   <div class="panel"><h3>Các kiểu UE và cách chia gói</h3><div class="u3two">
    <div><b>UE không CA</b><p class="e2d">Gắn một sóng mang (PCell). Muốn đổi tần số phải HO nội trạm khác tần số (IFLB) hoặc chọn lại cell khi rỗi. Đây là nhóm làm lệch tải nhiều nhất.</p></div>
    <div><b>4G LTE-A CA (2–3 CC)</b><p class="e2d">B3 + B1 (+ B7/B40): MAC eNB chia gói giữa CC theo CQI và tải; SCell kích hoạt bằng MAC CE (TS 36.321).</p></div>
    <div><b>NR CA n41 + n77</b><p class="e2d">Hai sóng mang TDD 100 MHz cùng gNB, cùng mẫu khung; MAC gNB chia gói mỗi khe. SCell n77 phủ kém hơn nên ở xa chỉ còn n41.</p></div>
    <div><b>EN-DC</b><p class="e2d">Neo LTE (MCG, thường B3) + NR (SCG n41 hoặc n77). Chia ở PDCP (split bearer) giữa eNB và gNB qua X2-U; đường lên theo ul-DataSplitThreshold.</p></div>
    <div><b>5G-A nhiều CC</b><p class="e2d">CA mọi CC NR, kích hoạt/tắt SCell động, lập lịch chéo sóng mang, Rel-18 một DCI 1_3 lập lịch PDSCH trên nhiều cell (giảm CCE PDCCH).</p></div></div>
    <p class="note">Xem thêm cơ chế từng CC (tổ hợp băng, 1024QAM, đỉnh ghép) ở thẻ Ghép sóng mang; cân bằng 5G-A nhiều trạm ở thẻ Đa lớp tần số và cân bằng tải.</p></div>
   <div class="panel"><h3>Nhật ký bản tin (UE theo dõi, IFLB)</h3><div id="sfSlog">${sfLogH(E)}</div></div>
  </div><div>
   <div class="panel"><h3>Chia gói và SCell</h3><div class="ctl" style="grid-template-columns:1fr">
    ${sfAlgSel('split')}${sfSl('ue','scAct','Ngưỡng bộ đệm kích hoạt SCell',1,2000,1,v=>v+' kB','MAC CE Activation/Deactivation','scellAct')}
    ${sfSel('ue','scDeact','sCellDeactivationTimer',[[20,'20 ms'],[40,'40 ms'],[80,'80 ms'],[160,'160 ms'],[320,'320 ms'],[640,'640 ms'],[1280,'1280 ms']],'','scellDeact')}
    ${sfChk('ue','xcs','Lập lịch chéo sóng mang (DCI của SCell gửi trên PCell)','xcs')}${sfChk('ue','mcs','5G-A: một DCI lập lịch nhiều cell (Rel-18, DCI 1_3)','mcs')}</div></div>
   <div class="panel"><h3>Tỉ lệ loại UE</h3><div class="ctl">
    ${SFCK.map(c=>sfSl('ue','s_'+c,nE(SFCLS[c].n),0,60,5,v=>v)).join('')}</div>
    <div class="ctl">${sfSl('ue','n','Số UE kết nối',20,400,10,v=>v)}${sfSl('ue','dem','Hệ số lưu lượng',0.2,3,0.1,v=>'× '+nF(v,1))}${sfSl('ue','ulr','Lưu lượng UL / DL',1,40,1,v=>v+' %')}</div></div>
  </div></div>`;},
 after(){this.draw(true);},
 draw(force){const now=performance.now();if(!force&&now-SFS.dr<350)return;SFS.dr=now;const E=sfLive();sfSet('sfSk',sfSankey(E));sfSet('sfTu',sfTuPlot(E));sfSet('sfTuI',sfTuInfo(E));sfSet('sfCt',sfClsTb(E));sfSet('sfSlog',sfLogH(E));const t=document.getElementById('sfST');if(t)t.textContent=`t = ${nF(E.t,2)} s mô phỏng`;},
 tick(dt){const E=sfLive();if(!SFS.pause){const n=Math.round(dt*800);for(let i=0;i<n;i++)sfStep(E);}this.draw(dt===0);},
 upd(k,vw){if(vw==='ue')renderSf();},
 act(a){if(a==='play')sfPlayTog('sfSPlay');else if(a==='reset'){SFL.E=null;renderSf();}else if(a==='next'){const E=sfLive(),ca=E.U.filter(u=>u.cf.length>1&&u.svc!=='voi');if(ca.length){const i=ca.indexOf(E.tu);E.tu=ca[(i+1)%ca.length];E.tb=[];E.tbc={};sfLog(E,'RRC','Theo dõi UE mới',`UE${E.tu.i} · ${SFCLS[E.tu.cls].n}`);}this.draw(true);}}
};

/* ---------- Mục 4: So sánh thuật toán cân bằng ---------- */
SFP.alg={on:{off:true,load:true,se:true,cap:true,pc:true},T:4};
function sfKey(x){const u=Object.assign({},SFP.ue);delete u.alg;return JSON.stringify([SFP.cfg.on,SFP.cfg.bw,SFP.cfg.ant,SFP.cfg.tdd,SFP.cfg.cs,SFP.cfg.cfi,SFP.cfg.ssb,SFP.cfg.qam,u,x]);}
function sfAlgRun(){const ks=SFAK.filter(a=>SFP.alg.on[a]),key=sfKey(['alg',ks,SFP.alg.T]);if(SFX.alg&&SFX.alg.key===key){sfAlgShow();return;}
  SFX.alg={key,res:null};sfSet('sfAt','');sfBatch('alg',ks.map(a=>()=>[a,sfRun({},a,SFP.alg.T)]),out=>{const r={};out.forEach(x=>{if(x)r[x[0]]=x[1];});if(SFX.alg&&SFX.alg.key===key){SFX.alg.res=r;sfAlgShow();}});}
function sfAlgTb(R){const ids=Object.keys(R);if(!ids.length)return '<p class="hint">Chọn ít nhất một thuật toán.</p>';const b=R.off||R[ids[0]],ks=R[ids[0]].ks;
  const best=(f,hi)=>{const v=ids.map(i=>f(R[i]));return hi?Math.max(...v):Math.min(...v);};const cell=(v,bv,d,u)=>`<td class="${Math.abs(v-bv)<1e-9?'lbgood':''}">${nF(v,d)}${u||''}</td>`;
  return `<table class="ndtb sftb"><thead><tr><th>Thuật toán</th>${ks.map(k=>`<th style="color:${SFC[k].c}">PRB ${SFC[k].s}</th>`).join('')}<th>Lệch tải (cùng RAT)</th><th>Thông lượng trạm</th><th>UE trung bình</th><th>UE 5 %</th><th>SE (bit/s/Hz)</th><th>PRB bỏ phí</th><th>Chặn PDCCH</th><th>HO cân bằng</th></tr></thead><tbody>
   ${ids.map(i=>{const r=R[i];return `<tr><td><b>${nE(SFAL[i].n)}</b></td>${ks.map(k=>`<td class="${r.per[k].dl>85?'lbbad':''}">${nF(r.per[k].dl,0)} %</td>`).join('')}${cell(r.imb,best(x=>x.imb,0),0,' %')}${cell(r.tot,best(x=>x.tot,1),0,' Mbit/s')}${cell(r.mean,best(x=>x.mean,1),0,' Mbit/s')}${cell(r.p5,best(x=>x.p5,1),1,' Mbit/s')}${cell(r.se,best(x=>x.se,1),2)}${cell(r.waste,best(x=>x.waste,0),1,' %')}<td>${nF(r.pdb,1)} %</td><td>${r.ho}</td></tr>`;}).join('')}</tbody></table>`;}
function sfAlgBars(R){const ids=Object.keys(R);if(!ids.length)return '';const ks=R[ids[0]].ks,W=680,gh=24,H=30+ks.length*(ids.length*gh+16);let s=`<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="Tải PRB từng tần số theo thuật toán">`,y=14;
  ks.forEach(k=>{s+=`<text x="8" y="${y+8}" class="sftx" style="fill:${SFC[k].c}">${nE(SFC[k].n)}</text>`;y+=14;ids.forEach(i=>{const v=R[i].per[k].dl;s+=`<text x="8" y="${y+13}" class="sfsm">${nE(SFAL[i].s)}</text><rect x="150" y="${y+2}" width="${(W-220)}" height="${gh-8}" class="u3pbg"/><rect x="150" y="${y+2}" width="${(v/100*(W-220)).toFixed(1)}" height="${gh-8}" style="fill:${SFC[k].c};opacity:${i==='off'?.35:.7}"/><text x="${W-62}" y="${y+14}" class="sftx">${nF(v,0)} %</text>`;y+=gh;});y+=4;});
  return s+`</svg>`;}
function sfAlgShow(){const R=SFX.alg&&SFX.alg.res;if(!R)return;sfSet('sfAt',sfAlgTb(R));sfSet('sfAb',sfAlgBars(R));const ids=Object.keys(R);
  sfSet('sfAu',ids.length?`<b>Thông lượng UE trung bình</b>${nBars(ids.map(i=>[SFAL[i].s,R[i].mean,SFAL[i].c]),Math.max(...ids.map(i=>R[i].mean))*1.1||1,' Mbit/s',0)}<b>UE 5 % (biên)</b>${nBars(ids.map(i=>[SFAL[i].s,R[i].p5,SFAL[i].c]),Math.max(...ids.map(i=>R[i].p5))*1.1||1,' Mbit/s',1)}<b>Hiệu suất phổ cả trạm</b>${nBars(ids.map(i=>[SFAL[i].s,R[i].se,SFAL[i].c]),Math.max(...ids.map(i=>R[i].se))*1.1||1,' bit/s/Hz',2)}`:'');
  const o=R.off,c=R.cap;sfSet('sfAk',o&&c?sfKv('Lệch tải: tắt → dung lượng còn lại',`${nF(o.imb,0)} % → ${nF(c.imb,0)} %`)+sfKv('UE 5 %',`${nF(o.p5,1)} → ${nF(c.p5,1)} Mbit/s`)+sfKv('PRB bỏ phí',`${nF(o.waste,1)} % → ${nF(c.waste,1)} %`)+sfKv('Thông lượng trạm',`${nF(o.tot,0)} → ${nF(c.tot,0)} Mbit/s`):'<span class="note">Bật «Tắt cân bằng» và «Theo dung lượng còn lại» để xem tóm tắt.</span>');}
SFR.alg={
 html(){return `<div class="cols"><div>
   <div class="panel"><h3>Kết quả (cùng UE, cùng lưu lượng, ${SFP.alg.T} s mô phỏng sau 1 s khởi động)</h3><div id="sfProg_alg"></div><div class="scroll" id="sfAt"></div><p class="note">Tô xanh: tốt nhất trong các thuật toán đang so. «PRB bỏ phí»: PRB rảnh trên CC này đúng lúc CC khác cùng RAT đầy và còn hàng đợi. «Lệch tải»: chênh tải PRB lớn nhất giữa các CC cùng RAT (NR với NR, LTE với LTE).</p></div>
   <div class="panel"><h3>Tải PRB DL từng tần số</h3><div class="scroll"><div class="sfw" id="sfAb"></div></div></div>
   <div class="panel"><h3>Trải nghiệm người dùng và hiệu suất phổ</h3><div id="sfAu"></div></div>
   <div class="panel"><h3>Mỗi thuật toán chọn sóng mang thế nào</h3><div class="u3two">
    <div><b>Tắt cân bằng</b><p class="e2d">UE không CA chọn theo ưu tiên cố định (n77 > n41, B3 > B1) nếu đủ sóng; UE CA đẩy gói vào PCell trước, SCell chỉ nhận phần dư.</p></div>
    <div><b>Theo tải PRB</b><p class="e2d">Gắn UE vào CC đang ít tải; UE CA chia theo (1 − tải); mỗi giây IFLB nội trạm chuyển tối đa ${SFP.ue.nmax} UE khi tải > ${SFP.ue.thr} % và chênh ≥ ${SFP.ue.diff} %.</p></div>
    <div><b>Theo hiệu suất phổ</b><p class="e2d">Gắn vào CC có bit/PRB cao nhất, chia theo CQI. Dồn UE về lớp sóng tốt (n41) dù lớp đó đầy.</p></div>
    <div><b>Theo dung lượng còn lại</b><p class="e2d">Điểm = hiệu suất phổ × số PRB × (1 − tải): cân bằng giữa chất lượng sóng và tải, có IFLB.</p></div>
    <div><b>Ưu tiên PCell + IFLB</b><p class="e2d">Giữ cách chia PCell trước của nhiều cấu hình mặc định nhưng bật IFLB để chuyển UE không CA.</p></div></div></div>
  </div><div>
   <div class="panel"><h3>Thuật toán đem so</h3><div class="ctl" style="grid-template-columns:1fr">${SFAK.map(a=>sfChk('alg','on.'+a,nE(SFAL[a].n))).join('')}</div></div>
   <div class="panel"><h3>Lưu lượng và ngưỡng</h3><div class="ctl">
    ${sfSl('ue','n','Số UE kết nối',20,400,10,v=>v)}${sfSl('ue','dem','Hệ số lưu lượng',0.2,3,0.1,v=>'× '+nF(v,1))}
    ${sfSl('ue','thr','Ngưỡng tải IFLB',40,95,5,v=>v+' %','','mlbThr')}${sfSl('ue','diff','Chênh tải tối thiểu',5,50,5,v=>v+' %','','mlbDiff')}${sfSl('ue','nmax','UE chuyển mỗi giây',1,20,1,v=>v,'','mlbN')}
    ${sfSl('alg','T','Thời gian mô phỏng',2,10,1,v=>v+' s')}</div>
    <div class="row"><button type="button" class="btn sm" data-sfa="alg:run">Chạy so sánh</button><button type="button" class="btn sm" data-sfa="alg:seed">Đổi vị trí UE</button></div></div>
   <div class="panel"><h3>Tóm tắt</h3><dl class="kv" id="sfAk"></dl></div>
   <div class="panel"><h3>Nhiều trạm, nhiều lớp</h3><p class="note">Mục này nhìn trong MỘT trạm. Cân bằng giữa nhiều trạm và năm lớp (700/900/1800/2600/3500) theo giờ, MLB qua Xn, AI/ML ở thẻ Đa lớp tần số và cân bằng tải.</p><div class="e2go"><button type="button" class="btn sm" data-lbgo="lb:adv">Cân bằng tải 5G-A →</button><button type="button" class="btn sm" data-lbgo="lb:sim">7 trạm × 5 lớp theo giờ →</button></div></div>
  </div></div>`;},
 after(){if(SFX.alg&&SFX.alg.res&&SFX.alg.key===sfKey(['alg',SFAK.filter(a=>SFP.alg.on[a]),SFP.alg.T]))sfAlgShow();else sfAlgRun();},
 upd(k,vw){if(vw==='alg'||vw==='ue')sfAlgRun();},
 act(a){if(a==='run'){SFX.alg=null;sfAlgRun();}else if(a==='seed'){SFP.ue.seed++;sfReset();sfAlgRun();}}
};

/* ---------- Mục 5: Kịch bản ---------- */
SFP.scn={m:'peak',off:'n77',hr:3};
const SFSM=[['peak','Giờ cao điểm (24 h)'],['ca','Tỉ lệ máy hỗ trợ CA'],['pos','UE gần / xa'],['es','Tắt một sóng mang'],['tech','4G CA · 5G CA · EN-DC']];
function sfMix(x){const P=SFP.ue,nc=['l1','nr1'],ca=['lca','nca','endc','ga'],wN=nc.reduce((a,c)=>a+P['s_'+c],0)||2,wC=ca.reduce((a,c)=>a+P['s_'+c],0)||4,o={};
  nc.forEach(c=>{o['s_'+c]=(P['s_'+c]||(wN===2?1:0))/wN*(100-x);});ca.forEach(c=>{o['s_'+c]=(P['s_'+c]||(wC===4?1:0))/wC*x;});return o;}
function sfScnJobs(m){const P=SFP.ue,T=3;
  if(m==='peak'){const H=[2,6,9,12,15,18,20,22],J=[];H.forEach(h=>['off','cap'].forEach(a=>J.push(()=>({h,a,r:sfRun({dem:P.dem*SFHP[h],warm:0.5},a,T)}))));return J;}
  if(m==='ca'){const J=[];[0,25,50,75,100].forEach(x=>['off','cap'].forEach(a=>J.push(()=>({x,a,r:sfRun(Object.assign(sfMix(x),{warm:0.5}),a,T)}))));return J;}
  if(m==='pos')return [-1,0,1].map(p=>()=>({p,r:sfRun({pos:p,warm:0.5},'cap',T)}));
  if(m==='es'){const off=SFP.cfg.on[SFP.scn.off]?SFP.scn.off:'';return [()=>({k:'all',r:sfRun({dem:P.dem*SFHP[SFP.scn.hr],warm:0.5},'cap',T)}),()=>({k:off,r:sfRun({dem:P.dem*SFHP[SFP.scn.hr],off,warm:0.5},'cap',T)})];}
  return ['lca','nca','endc','ga'].map(c=>()=>({c,r:sfRun({only:c,warm:0.5},'cap',T)}));}
function sfScnRun(){const m=SFP.scn.m,key=sfKey(['scn',m,SFP.scn.off,SFP.scn.hr]);if(SFX['s_'+m]&&SFX['s_'+m].key===key){sfScnShow();return;}
  SFX['s_'+m]={key,res:null};sfSet('sfScR','');sfBatch('scn',sfScnJobs(m),out=>{if(SFX['s_'+m]&&SFX['s_'+m].key===key){SFX['s_'+m].res=out.filter(Boolean);if(SFP.scn.m===m)sfScnShow();}});}
function sfSinrPlot(){const P=sfParams(),cf=SFP.cfg,ks=sfOn(),dmax=Math.max(600,P.rad*2.5),pts=[];const CC=ks.map(k=>sfCar(k,cf,false));
  const ser=[];CC.forEach(C=>{[0,1].forEach(ind=>{const p=[];for(let i=0;i<=40;i++){const d=20+(dmax-20)*i/40,L=sfLk(C,{d,in:!!ind,ix:4,sh:0},P);p.push([d,L.sinr]);}ser.push({c:C.c.c,w:2,dash:ind?'5 4':'',pts:p});});});
  return nPlot({w:680,h:220,x0:20,x1:dmax,y0:-15,y1:32,yt:[-10,-5,0,10,20,30],xt:[0,dmax/4,dmax/2,dmax*3/4,dmax].map(Math.round),xf:v=>nF(v/1000,2),series:ser,hl:[[-5,'var(--warn)','ngưỡng phủ ≈ −5 dB']],marks:[[P.rad,'bán kính phân bố UE','var(--muted)']],ylab:'SINR DL (dB)',xlab:'km',aria:'SINR theo khoảng cách'});}
function sfCovShare(){const out=[];[-1,0,1].forEach(p=>{const P=sfParams({pos:p}),CC=sfOn().map(k=>sfCar(k,SFP.cfg,false)),U=sfMkU(P,CC);out.push([p,CC.map(C=>[C.k,U.filter(u=>u.L[C.k].sinr>=-3).length/U.length*100])]);});return out;}
function sfScnShow(){const m=SFP.scn.m,X=SFX['s_'+m];if(!X||!X.res)return;const R=X.res;let h='';
  if(m==='peak'){const H=[...new Set(R.map(x=>x.h))],ks=R[0].r.ks,g=(h,a)=>R.find(x=>x.h===h&&x.a===a).r;
    h=`<p><b>Tải PRB DL theo giờ</b> (nét liền: dung lượng còn lại; nét đứt: tắt cân bằng)</p><div class="scroll"><div class="sfw">${nPlot({w:680,h:210,x0:0,x1:23,y0:0,y1:100,yt:[0,25,50,75,100],xt:[0,3,6,9,12,15,18,21,23],series:ks.flatMap(k=>[{c:SFC[k].c,w:2,pts:H.map(x=>[x,g(x,'cap').per[k].dl])},{c:SFC[k].c,w:1.5,dash:'5 4',pts:H.map(x=>[x,g(x,'off').per[k].dl])}]),hl:[[85,'var(--warn)','85 %']],ylab:'tải PRB (%)',xlab:'giờ',aria:'Tải theo giờ'})}</div></div>
     <p class="legend">${ks.map(k=>`<span><i style="background:${SFC[k].c}"></i>${SFC[k].s}</span>`).join('')}</p>
     <p><b>Tốc độ UE 5 % (biên) theo giờ</b></p><div class="scroll"><div class="sfw">${nPlot({w:680,h:190,x0:0,x1:23,y0:0,y1:Math.max(10,...R.map(x=>x.r.p5))*1.1,yt:[0,10,20,40,80].filter(v=>v<=Math.max(10,...R.map(x=>x.r.p5))*1.1),xt:[0,3,6,9,12,15,18,21,23],series:[{c:'var(--muted)',dash:'5 4',w:2,pts:H.map(x=>[x,g(x,'off').p5])},{c:'var(--k1)',w:2.4,pts:H.map(x=>[x,g(x,'cap').p5])}],ylab:'Mbit/s',xlab:'giờ',aria:'UE 5 % theo giờ'})}</div></div>
     <table class="ndtb sftb"><thead><tr><th>Giờ</th><th>Lệch tải (tắt → cân bằng)</th><th>UE 5 %</th><th>Thông lượng trạm</th></tr></thead><tbody>${H.map(x=>{const o=g(x,'off'),c=g(x,'cap');return `<tr><td>${x} h</td><td>${nF(o.imb,0)} → <b>${nF(c.imb,0)}</b> %</td><td>${nF(o.p5,1)} → <b>${nF(c.p5,1)}</b> Mbit/s</td><td>${nF(o.tot,0)} → ${nF(c.tot,0)} Mbit/s</td></tr>`;}).join('')}</tbody></table>`;}
  else if(m==='ca'){const xs=[...new Set(R.map(x=>x.x))],g=(x,a)=>R.find(y=>y.x===x&&y.a===a).r,mx=Math.max(...R.map(x=>x.r.tot))*1.1,m5=Math.max(5,...R.map(x=>x.r.p5))*1.1;
    h=`<p><b>Thông lượng trạm theo tỉ lệ UE hỗ trợ CA</b></p><div class="scroll"><div class="sfw">${nPlot({w:680,h:200,x0:0,x1:100,y0:0,y1:mx,yt:[0,mx/4,mx/2,mx*3/4].map(Math.round),xt:xs,xf:v=>v+' %',series:[{c:'var(--muted)',dash:'5 4',w:2,pts:xs.map(x=>[x,g(x,'off').tot])},{c:'var(--nr)',w:2.4,pts:xs.map(x=>[x,g(x,'cap').tot])}],ylab:'Mbit/s',xlab:'UE hỗ trợ CA',aria:'Thông lượng theo tỉ lệ CA'})}</div></div>
     <p><b>UE 5 % theo tỉ lệ CA</b></p><div class="scroll"><div class="sfw">${nPlot({w:680,h:180,x0:0,x1:100,y0:0,y1:m5,yt:[0,m5/2,m5].map(v=>Math.round(v)),xt:xs,xf:v=>v+' %',series:[{c:'var(--muted)',dash:'5 4',w:2,pts:xs.map(x=>[x,g(x,'off').p5])},{c:'var(--k1)',w:2.4,pts:xs.map(x=>[x,g(x,'cap').p5])}],ylab:'Mbit/s',aria:'UE 5 % theo tỉ lệ CA'})}</div></div>
     <p class="legend"><span>nét đứt: tắt cân bằng</span><span>nét liền: dung lượng còn lại</span></p>
     <table class="ndtb sftb"><thead><tr><th>UE CA</th><th>Lệch tải</th><th>PRB bỏ phí</th><th>SE (bit/s/Hz)</th></tr></thead><tbody>${xs.map(x=>{const o=g(x,'off'),c=g(x,'cap');return `<tr><td>${x} %</td><td>${nF(o.imb,0)} → <b>${nF(c.imb,0)}</b> %</td><td>${nF(o.waste,1)} → <b>${nF(c.waste,1)}</b> %</td><td>${nF(o.se,2)} → ${nF(c.se,2)}</td></tr>`;}).join('')}</tbody></table><p class="note">Càng nhiều UE CA, MAC tự chia gói giữa CC nên lệch tải giảm ngay cả khi tắt cân bằng; với ít UE CA, cân bằng phải dựa vào IFLB chuyển UE.</p>`;}
  else if(m==='pos'){const cs=sfCovShare(),ks=R[0].r.ks,nm={'-1':'Gần trạm','0':'Đều','1':'Xa trạm'};
    h=`<p><b>Tỉ lệ UE và lưu lượng theo phân bố vị trí</b> (thuật toán dung lượng còn lại)</p><table class="ndtb sftb"><thead><tr><th>Phân bố</th>${ks.map(k=>`<th style="color:${SFC[k].c}">${SFC[k].s}: phủ / lưu lượng</th>`).join('')}<th>UE 5 %</th></tr></thead><tbody>${R.map(x=>{const c=cs.find(y=>y[0]===x.p)[1];return `<tr><td>${nm[x.p]}</td>${ks.map(k=>`<td>${nF((c.find(y=>y[0]===k)||[0,0])[1],0)} % / ${nF(x.r.per[k].sh,0)} %</td>`).join('')}<td>${nF(x.r.p5,1)} Mbit/s</td></tr>`;}).join('')}</tbody></table><p class="note">«Phủ»: UE có SINR ≥ −3 dB trên CC (đủ để thêm SCell). Ở xa, n77 mất trước n41 nên UE CA còn một CC và lưu lượng dồn về n41 và LTE.</p>`;}
  else if(m==='es'){const a=R[0].r,b=R[1].r,k=R[1].k,pw=(r,kk)=>{const an=SFAN[SFP.cfg.ant[kk]];return an.p0+(an.pm-an.p0)*(r.per[kk]?r.per[kk].dl:0)/100;};
    const ks=a.ks,pa=ks.reduce((s,kk)=>s+pw(a,kk),0),pb=ks.reduce((s,kk)=>s+(kk===k?SFAN[SFP.cfg.ant[kk]].p0*0.1:pw(b,kk)),0);
    h=k?`<table class="ndtb sftb"><thead><tr><th></th>${ks.map(kk=>`<th style="color:${SFC[kk].c}">PRB ${SFC[kk].s}</th>`).join('')}<th>UE 5 %</th><th>UE trung bình</th><th>Công suất RF ước tính</th></tr></thead><tbody>
     <tr><td>Đủ sóng mang</td>${ks.map(kk=>`<td>${nF(a.per[kk].dl,0)} %</td>`).join('')}<td>${nF(a.p5,1)}</td><td>${nF(a.mean,0)}</td><td>${nF(pa,0)} W</td></tr>
     <tr><td>Tắt ${SFC[k].s}</td>${ks.map(kk=>`<td class="${b.per[kk]&&b.per[kk].dl>85?'lbbad':''}">${b.per[kk]?nF(b.per[kk].dl,0)+' %':'tắt'}</td>`).join('')}<td>${nF(b.p5,1)}</td><td>${nF(b.mean,0)}</td><td>${nF(pb,0)} W</td></tr></tbody></table>
     <dl class="kv">${sfKv('Tiết kiệm',`${nF(pa-pb,0)} W (${nF((pa-pb)/pa*100,0)} %) lúc ${SFP.scn.hr} h`)+sfKv('Đánh đổi',`UE 5 % ${nF(a.p5,1)} → ${nF(b.p5,1)} Mbit/s`)+sfKv('Khuyến nghị',b.per&&Object.values(b.per).some(x=>x.dl>70)?'<span class="lbbad">CC còn lại vượt 70 %: không nên tắt ở giờ này</span>':'<span class="lbgood">CC còn lại dưới 70 %: có thể tắt</span>')}</dl>
     <p class="note">Công suất = P₀ + (P<sub>max</sub> − P₀) × tải (mô hình tuyến tính, cần đối chiếu số liệu thiết bị). Các chế độ ngủ ký hiệu, tắt kênh, ngủ sâu ở thẻ Tiết kiệm điện.</p><div class="e2go"><button type="button" class="btn sm" data-tab="es">Thẻ Tiết kiệm điện →</button></div>`:'<p class="hint">Chọn một sóng mang đang bật để tắt.</p>';}
  else {const ks=R[0].r.ks;h=`<table class="ndtb sftb"><thead><tr><th>Tất cả UE là</th>${ks.map(k=>`<th style="color:${SFC[k].c}">PRB ${SFC[k].s}</th>`).join('')}<th>Thông lượng trạm</th><th>UE trung bình</th><th>UE 5 %</th><th>SE</th><th>SCell bật</th></tr></thead><tbody>${R.map(x=>`<tr><td><b>${nE(SFCLS[x.c].n)}</b></td>${ks.map(k=>`<td>${nF(x.r.per[k].dl,0)} %</td>`).join('')}<td>${nF(x.r.tot,0)} Mbit/s</td><td>${nF(x.r.mean,0)}</td><td>${nF(x.r.p5,1)}</td><td>${nF(x.r.se,2)}</td><td>${nF(x.r.ca,0)} %</td></tr>`).join('')}</tbody></table>
     <p class="note">4G CA chỉ dùng phổ LTE nên n41/n77 bỏ trống; EN-DC dùng cả hai nhưng neo LTE gánh báo hiệu và một phần dữ liệu; 5G SA CA và 5G-A dùng hết phổ NR, SE cao nhất. Cùng số UE và lưu lượng. 5G-A khác 5G SA CA khi trạm có thêm CC NR (bật n28 hoặc n1 ở mục 1).</p>`;}
  sfSet('sfScR',h.replace(/<table/g,'<div class="scroll"><table').replace(/<\/table>/g,'</table></div>'));}
SFR.scn={
 html(){const m=SFP.scn.m;return `<div class="panel"><div class="seg u3seg sfsub" role="group" aria-label="Kịch bản">${SFSM.map(x=>`<button type="button" data-sfa="scn:m|${x[0]}" aria-pressed="${x[0]===m}">${x[1]}</button>`).join('')}</div></div>
  <div class="cols"><div>
   ${m==='pos'?`<div class="panel"><h3>SINR theo khoảng cách từng sóng mang</h3><div class="scroll"><div class="sfw" id="sfSinr">${sfSinrPlot()}</div></div><p class="legend">${sfOn().map(k=>`<span><i style="background:${SFC[k].c}"></i>${SFC[k].s}</span>`).join('')}<span>nét đứt: trong nhà</span></p></div>`:''}
   <div class="panel"><h3>${nE(SFSM.find(x=>x[0]===m)[1])}</h3><div id="sfProg_scn"></div><div id="sfScR"></div></div>
  </div><div>
   <div class="panel"><h3>Thiết lập</h3><div class="ctl" style="grid-template-columns:1fr">
    ${m==='es'?sfSel('scn','off','Sóng mang tắt',sfOn().map(k=>[k,SFC[k].n]))+sfSl('scn','hr','Giờ',0,23,1,v=>v+' h (lưu lượng '+nF(SFHP[v]*100,0)+' % giờ bận)'):''}
    ${m==='pos'?sfSl('ue','rad','Bán kính phân bố UE',200,2500,50,v=>nF(v/1000,2)+' km')+sfSl('ue','ind','UE trong nhà',0,100,5,v=>v+' %'):''}
    ${sfSl('ue','n','Số UE kết nối (giờ bận)',20,400,10,v=>v)}${sfSl('ue','dem','Hệ số lưu lượng',0.2,3,0.1,v=>'× '+nF(v,1))}</div>
    <div class="row"><button type="button" class="btn sm" data-sfa="scn:run">Chạy lại</button></div></div>
   <div class="panel"><h3>Cách đọc</h3><p class="note">${({peak:'Mỗi giờ chạy 3 s mô phỏng với lưu lượng theo hồ sơ 24 h, so tắt cân bằng với cân bằng theo dung lượng còn lại.',ca:'Đổi tỉ lệ UE hỗ trợ CA (4G CA, NR CA, EN-DC, 5G-A) từ 0 đến 100 %, giữ nguyên tổng UE.',pos:'n77 3800 MHz suy hao lớn hơn n41 2600 MHz khoảng 3–4 dB; UE xa hoặc sâu trong nhà mất n77 trước.',es:'Tắt một sóng mang lúc ít tải (ví dụ 2–5 h), UE dồn sang sóng mang còn lại; kiểm tra tải còn lại và trải nghiệm biên.',tech:'Cùng trạm, cùng lưu lượng, đổi toàn bộ UE sang một loại để thấy giá trị của CA 5G so với 4G CA và EN-DC.'})[m]}</p></div>
  </div></div>`;},
 after(){sfScnRun();},
 upd(k,vw){if(vw==='scn'||vw==='ue'){if(SFP.scn.m==='pos')sfSet('sfSinr',sfSinrPlot());sfScnRun();}},
 act(a){const [x,v]=a.split('|');if(x==='m'){SFP.scn.m=v;renderSf();}else if(x==='run'){SFX['s_'+SFP.scn.m]=null;sfScnRun();}}
};

/* ---------- Mục 6: Tham số, KPI, lỗi ---------- */
SFP.vd={grp:'all',q:'',kf:'all'};
/* [khoá, nhóm, tên/ý nghĩa 3GPP, Huawei, Nokia, Ericsson, giá trị điển hình, cờ: v = cần đối chiếu] */
const SFPAR=[
 ['carrierBw','Cấu hình sóng mang','carrierBandwidth trong SCS-SpecificCarrier (số PRB, TS 38.101-1 bảng 5.3.2-1), offsetToCarrier','NRDUCell: DlBandwidth / UlBandwidth','NRCELL: chBw','NRSectorCarrier: bSChannelBwDL / bSChannelBwUL','100 MHz → 273 PRB (30 kHz)','v'],
 ['tddPat','Cấu hình sóng mang','tdd-UL-DL-ConfigurationCommon: dl-UL-TransmissionPeriodicity, nrofDownlinkSlots, nrofDownlinkSymbols, nrofUplinkSymbols, nrofUplinkSlots','NRDUCell: SlotAssignment, SlotStructure','NRCELL: tddFrameStructure','NRCellDU: tddUlDlPattern, tddSpecialSlotPattern','DDDSU, S = 10:2:2 (n41 và n77 cùng mẫu)','v'],
 ['coreset','Cấu hình sóng mang','ControlResourceSet: duration 1…3 ký hiệu, frequencyDomainResources (bội 6 PRB); số CCE = PRB × ký hiệu / 6','NRDUCellPdcch: OccupiedSymbolNum','NRCELL: coresetDuration','NRCellDU: pdcchSymbConfig','1–2 ký hiệu (2 khi nhiều UE)','v'],
 ['cfi','Cấu hình sóng mang','LTE CFI (PCFICH) 1…3 ký hiệu PDCCH, có thể thích ứng','CellPdcchAlgo: InitPdcchSymNum, PdcchSymNumSwitch','LNCEL: maxNrSymPdcch','EUtranCellFDD: pdcchCfiMode','CFI 2 hoặc tự động','v'],
 ['ssbPer','Cấu hình sóng mang','ssb-periodicityServingCell 5…160 ms; ssb-PositionsInBurst (L<sub>max</sub> 4 dưới 3 GHz, 8 ở 3–6 GHz)','NRDUCell: SsbPeriod','NRCELL: ssbPeriodicity','NRCellDU: ssbPeriodicity','20 ms','v'],
 ['scellAdd','CA và SCell','Thêm SCell: sCellToAddModList sau đo A4 trên tần số SCell (hoặc thêm mù khi cùng trạm, cùng hướng)','NRCellCaMgmtCfg: SCell A4 RSRP threshold','NRCELL: caScellAddThreshold','CaCellProfile: sCellAddThreshold','RSRP SCell > −110 … −105 dBm','v'],
 ['scellAct','CA và SCell','Kích hoạt SCell bằng MAC CE (TS 38.321 §5.9) khi bộ đệm vượt ngưỡng','NRCellCaMgmtCfg: SCell activation data threshold','NRCELL: sCellActivationMethod / ngưỡng dữ liệu','CaCellProfile: sCellActDataThreshold','10–50 kB','v'],
 ['scellDeact','CA và SCell','sCellDeactivationTimer (ms20 … ms1280, vô hạn): tắt SCell khi không có dữ liệu','NRCellCaMgmtCfg: SCellDeactivationTimer','NRCELL: sCellDeactivationTimer','CaCellProfile: sCellDeactivationTimer','160–320 ms','v'],
 ['caComb','CA và SCell','Tổ hợp băng (supportedBandCombinationList trong UE capability): CA_n41A-n77A, CA_1A-3A, DC_3A_n41A, DC_3A_n77A','NRCellCaGroup / CaGroupSCellCfg','NRBTS: danh sách tổ hợp CA','NRCellCU: caBandCombination (qua CaCellProfile)','Theo năng lực UE','v'],
 ['xcs','CA và SCell','CrossCarrierSchedulingConfig: schedulingCellId, cif-Presence (DCI của SCell gửi trên PCell)','NRDUCellCaCfg: CrossCarrierSchSwitch','NRCELL: actCrossCarrierScheduling','CaCellProfile: crossCarrierScheduling','Tắt; bật khi PDCCH SCell yếu','v'],
 ['mcs','5G-A','Lập lịch nhiều cell bằng một DCI (DCI 1_3 / 0_3, Rel-18, TS 38.212 §7.3.1): tới 4 cell mỗi DCI','Tính năng 5G-A multi-cell scheduling','Tính năng 5G-A multi-cell scheduling','Tính năng 5G-A multi-cell scheduling','Tới 4 cell','v'],
 ['pcellSel','5G-A','Chọn PCell theo tải và tổ hợp băng của UE lúc thiết lập/sau HO; đổi PCell nội trạm (PCell change)','NR PCell selection based on load','PCell selection / CA PCell swap','Traffic steering at setup (theo năng lực UE)','CC có dung lượng còn lại lớn nhất','v'],
 ['mlbIntra','Cân bằng nội trạm','Cân bằng tải giữa tần số trong cùng gNB (IFLB nội trạm) bằng HO A4 hoặc đổi PCell, cause: load balancing','NRCellMlb: InterFreqMlbSwitch','NRCELL: actInterFreqLoadBal','NRCellCU: interFreqLoadBalancing','Bật','v'],
 ['mlbThr','Cân bằng nội trạm','Ngưỡng tải PRB (hoặc số UE) của CC nguồn để bắt đầu chuyển UE','NRCellMlb: InterFreqMlbPrbThld','NRCELL: lbPrbThreshold','NRCellCU: lbCeiling','60–80 %','v'],
 ['mlbDiff','Cân bằng nội trạm','Chênh tải tối thiểu giữa CC nguồn và đích (chống ping-pong)','NRCellMlb: InterFreqMlbLoadDiff','NRCELL: lbLoadDiff','NRCellCU: lbHysteresis','15–25 %','v'],
 ['mlbN','Cân bằng nội trạm','Số UE chuyển mỗi chu kỳ đánh giá, chu kỳ đánh giá','NRCellMlb: InterFreqMlbUeNum, period','NRCELL: lbMaxUeNum','NRCellCU: lbMaxHoPerPeriod','2–10 UE mỗi 1–5 s','v'],
 ['endcSplit','EN-DC','Split bearer: chia DL ở PDCP giữa MCG (LTE) và SCG (NR) qua X2-U; ul-DataSplitThreshold cho UL','gNBPdcpParamGroup: DlDataSplitMode, UlDataSplitThreshold','NRBTS: dlDataSplitMode, ulDataSplitThreshold','GNBCUUPFunction: dlDataSplitAlgo; ulDataSplitThreshold','NR ưu tiên, LTE khi NR nghẽn','v'],
 ['anchor','EN-DC','Chọn neo LTE cho EN-DC (B3 ưu tiên), cấm B1/B7 làm neo nếu không có tổ hợp DC','NsaDcMgmtConfig: anchor priority','LNCEL: endcAnchorPriority','EUtranCellFDD: endcAnchorPriority','B3 làm neo','v'],
 ['bwp','5G-A','BWP riêng từng UE (RedCap, UE ít lưu lượng): giảm CCE PDCCH và CSI, dành BWP rộng cho UE nặng','NRDUCellBwp: BWP config','NRCELL: bwpConfig','NRCellDU: bwpProfile','20 / 40 / 100 MHz','v']
];
const SFKPI=[
 ['Tải PRB DL/UL từng sóng mang','PRB dùng / PRB có × 100 cho từng CC, DL và UL riêng','N.PRB.DL.Used.Avg / N.PRB.DL.Avail.Avg theo cell','PRB usage DL/UL theo NRCELL (tra NetAct)','pmMacRBSymUsedPdschTypeA / pmMacRBSymAvailDl','< 80 % giờ bận; lệch giữa CC ≤ 20 %','grid','prb5'],
 ['Tỉ lệ UE CA (SCell đang bật)','UE có SCell hoạt động khi có dữ liệu / UE CA-capable có dữ liệu × 100','Số UE CA kích hoạt / UE CA-capable (tra Huawei NR PM)','CA configured / activated users (tra Nokia)','pmCaActivatedDlSum / pmCaCapableDlSum (tra Ericsson)','≥ 60–80 %','split','sf_ca5'],
 ['Tỉ lệ lưu lượng mỗi CC','Bit DL qua CC / tổng bit DL cả trạm × 100','N.ThpVol.DL theo cell','DL MAC/PDCP volume theo cell','pmMacVolDl theo NRCellDU','Gần tỉ lệ dung lượng các CC','split','sf_ccsh'],
 ['Hiệu suất phổ DL','Thông lượng cell DL / băng thông kênh (bit/s/Hz)','Tự tính từ N.ThpVol.DL và DlBandwidth','Tự tính','Tự tính','≥ 3–5 bit/s/Hz với mMIMO','alg','sf_se'],
 ['Thông lượng UE trung bình / 5 %','Bit / thời gian có dữ liệu theo UE; phân vị 5 % cho UE biên','N.ThpVol.DL / N.ThpTime.DL','User throughput DL (tra Nokia)','pmUeThpVolDl / pmUeThpTimeDl','Theo mục tiêu nhà mạng','alg','tputdl5'],
 ['PRB bỏ phí khi CC khác nghẽn','PRB rảnh trên CC này trong khe mà CC khác đầy và còn hàng đợi / PRB có × 100','Tự tính từ PRB theo khe','Tự tính','Tự tính','≈ 0 %','alg','sf_waste'],
 ['Chặn PDCCH (thiếu CCE)','DCI không cấp được do hết CCE hoặc SINR quá thấp / DCI cần × 100','Bộ đếm CCE allocation fail (tra Huawei)','PDCCH blocking (tra Nokia)','pmPdcchCceUtil, pmPdcchBlocking… (tra Ericsson)','< 2 %','split','']
];
const SFFLT=[
 ['Một tần số đầy, một tần số rảnh','n77 > 85 % trong khi n41 < 30 % cùng trạm, tốc độ UE trên n77 thấp',['Ưu tiên chọn lại cell dồn UE không CA lên n77','UE không CA gắn cố định một CC, IFLB nội trạm tắt','Chia gói ưu tiên PCell nên SCell chỉ nhận phần dư','Ít UE hỗ trợ CA_n41A-n77A'],['Tải từng CC theo phút giờ bận','Tỉ lệ UE CA, tỉ lệ lưu lượng mỗi CC','Chiến lược chia gói, ngưỡng IFLB'],{h:'Kiểm tra InterFreqMlbSwitch, CaAlgoSwitch',n:'Kiểm tra actInterFreqLoadBal, cách chia CA',e:'Kiểm tra interFreqLoadBalancing, CaCellProfile'},'Tải PRB từng CC, PRB bỏ phí','alg'],
 ['SCell không kích hoạt','UE hỗ trợ CA nhưng chỉ chạy trên PCell; tỉ lệ UE CA thấp',['Ngưỡng bộ đệm kích hoạt quá cao','sCellDeactivationTimer quá ngắn, SCell tắt ngay sau mỗi cụm gói','A4 thêm SCell quá chặt hoặc SCell n77 không đủ phủ ở xa','Thiếu cấu hình tổ hợp băng'],['Bộ đếm SCell add/activation','RSRP SCell của UE CA','Thử giảm ngưỡng, tăng timer'],{h:'Kiểm tra SCell activation threshold, SCellDeactivationTimer',n:'Kiểm tra sCellActivationMethod, sCellDeactivationTimer',e:'Kiểm tra sCellActDataThreshold, sCellDeactivationTimer'},'Tỉ lệ UE CA','split'],
 ['UE không hỗ trợ tổ hợp băng','UE có cả n41 và n77 nhưng không được CA; hoặc EN-DC chỉ với một băng NR',['UE capability thiếu CA_n41A-n77A hoặc DC_3A_n77A','Danh sách tổ hợp trên gNB thiếu hoặc sai thứ tự ưu tiên','Lọc capability (UECapabilityEnquiry) không yêu cầu đủ băng'],['Giải mã UECapabilityInformation','So danh sách tổ hợp cấu hình','Thống kê theo model máy'],{h:'Kiểm tra NRCellCaGroup, band combination',n:'Kiểm tra danh sách tổ hợp CA',e:'Kiểm tra CaCellProfile, band combination'},'Tỉ lệ UE CA','split'],
 ['Mất cân bằng UL','DL tốt nhưng UL nghẽn hoặc kém ở biên; UL n77 đầy trong khi n41 UL rảnh',['UL đặt trên PCell băng cao (n77) phủ UL kém','Không có UL CA, SUL hay chuyển UL sang LTE (EN-DC)','ul-DataSplitThreshold không phù hợp'],['Tải UL từng CC, PHR, SINR UL','Phân bố UE theo CC UL','Cân nhắc PCell n41 cho UE xa'],{h:'Kiểm tra UlDataSplitThreshold, PCell selection',n:'Kiểm tra ulDataSplitThreshold',e:'Kiểm tra ulDataSplitThreshold, UL traffic steering'},'Tải PRB UL','grid'],
 ['Chặn PDCCH khi nhiều UE nhỏ','PRB còn nhưng không cấp được DCI, độ trễ thoại/IoT tăng',['CORESET 1 ký hiệu với nhiều UE','AL cao (8, 16) cho UE biên','Nhiều UE thoại, IoT lưu lượng nhỏ'],['Mức dùng CCE, tỉ lệ chặn PDCCH','Phân bố AL'],{h:'Kiểm tra OccupiedSymbolNum, PDCCH AL',n:'Kiểm tra coresetDuration',e:'Kiểm tra pdcchSymbConfig'},'Chặn PDCCH','split'],
 ['Neo LTE nghẽn làm EN-DC chậm','B3 > 90 % do UE 4G và báo hiệu/dữ liệu neo EN-DC, tốc độ EN-DC thấp dù NR rảnh',['Split bearer gửi nhiều qua LTE','Quá nhiều UE 4G trên B3, thiếu B1/B7','Neo đặt trên băng hẹp'],['Tỉ lệ chia LTE/NR','Tải B3 theo giờ','Chuyển UE 4G không CA sang B1'],{h:'Kiểm tra DlDataSplitMode, anchor',n:'Kiểm tra dlDataSplitMode',e:'Kiểm tra dlDataSplitAlgo, endcAnchorPriority'},'Tải PRB B3, tỉ lệ lưu lượng mỗi CC','scn']
];
function sfParRows(){const P=SFP.vd,q=P.q.trim().toLowerCase(),v=nVn();const rows=SFPAR.filter(r=>(P.grp==='all'||r[1]===P.grp)&&(!q||r.join(' ').toLowerCase().includes(q)));
  const cols=v==='3gpp'?[3,4,5]:[{huawei:3,nokia:4,ericsson:5}[v]];
  return rows.map(r=>`<tr><td><span class="chip">${nE(r[1])}</span><br>${r[2]}</td>${cols.map(c=>`<td class="u3tag">${nE(r[c])}</td>`).join('')}<td>${nE(r[6])}</td><td>${r[7]==='v'?'<span class="kpC mid">Cần đối chiếu</span>':'<span class="kpC ok">Thường gặp</span>'}</td></tr>`).join('')||'<tr><td colspan="6">Không có tham số khớp.</td></tr>';}
function sfParHead(){const v=nVn();return `<tr><th>Tham số (3GPP / ý nghĩa)</th>${v==='3gpp'?'<th>Huawei</th><th>Nokia</th><th>Ericsson</th>':`<th>${nVName(v)}</th>`}<th>Điển hình</th><th>Độ tin cậy tên</th></tr>`;}
function sfKpiRows(){const v=nVn(),f=SFP.vd.kf;return SFKPI.filter(k=>f==='all'||k[6]===f).map(k=>`<tr><td><b>${nE(k[0])}</b>${k[7]&&typeof KL!=='undefined'&&KL.find(x=>x.id===k[7])?`<br><button type="button" class="u3lnkbtn" data-sfgo="kpi:${k[7]}">Mở ở thẻ KPI →</button>`:''}</td><td>${nE(k[1])}</td><td class="u3tag">${v==='3gpp'?['Huawei: '+k[2],'Nokia: '+k[3],'Ericsson: '+k[4]].map(nE).join('<br>'):nE(k[{huawei:2,nokia:3,ericsson:4}[v]])}<br><span class="kpC mid">cần đối chiếu</span></td><td>${nE(k[5])}</td><td><button type="button" class="btn sm" data-sfgo="sf:${k[6]}">Mô phỏng →</button></td></tr>`).join('');}
function sfFltHtml(){const v=nVn();return SFFLT.map(f=>`<details class="u3flt ndflt sfflt"><summary><b>${nE(f[0])}</b></summary><p class="e2d">${nE(f[1])}</p><div class="u3two"><div><b>Nguyên nhân</b><ul class="u3ul">${f[2].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div><div><b>Kiểm tra</b><ul class="u3ul">${f[3].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div></div><p class="note">${v==='3gpp'?['Huawei: '+f[4].h,'Nokia: '+f[4].n,'Ericsson: '+f[4].e].map(nE).join(' · '):nVName(v)+': '+nE(f[4][v[0]])} (cần đối chiếu) · KPI: ${nE(f[5])} · <button type="button" class="u3lnkbtn" data-sfgo="sf:${f[6]}">Mô phỏng →</button></p></details>`).join('');}
function sfCalc(){const g=id=>{const e=document.getElementById(id);return e?+e.value:0;},o=document.getElementById('sfcOut');if(!o)return;
  const u1=g('sfcU1'),a1=g('sfcA1'),u2=g('sfcU2'),a2=g('sfcA2'),v1=g('sfcV1'),v2=g('sfcV2'),tp=g('sfcTp'),bw=g('sfcBw'),ca=g('sfcCa'),cc=g('sfcCc');const l1=a1?u1/a1*100:0,l2=a2?u2/a2*100:0;
  o.innerHTML=sfKv('Tải CC1 / CC2',nF(l1,1)+' % / '+nF(l2,1)+' %')+sfKv('Độ lệch tải',`<span class="${Math.abs(l1-l2)>20?'lbbad':'lbgood'}">${nF(Math.abs(l1-l2),1)} %</span>`)+sfKv('Tỉ lệ lưu lượng CC1',v1+v2>0?nF(v1/(v1+v2)*100,1)+' %':'—')
   +sfKv('Hiệu suất phổ',bw?nF(tp/bw,2)+' bit/s/Hz':'—')+sfKv('Tỉ lệ UE CA',cc?`<span class="${ca/cc<0.6?'lbbad':'lbgood'}">${nF(ca/cc*100,1)} %</span>`:'—')+sfKv('Thông lượng mỗi PRB CC1',u1?nF(tp/2/Math.max(1,u1),2)+' Mbit/s/PRB (giả sử nửa lưu lượng)':'—');}
SFR.vd={
 html(){const P=SFP.vd,grps=[...new Set(SFPAR.map(r=>r[1]))];
  return `<div class="panel"><h3>Tham số sóng mang, CA và cân bằng nội trạm</h3><p class="hint">Chọn vendor ở thanh trên để chỉ hiện cột của vendor đó. Tên tham số vendor đều cần đối chiếu theo tài liệu release đang dùng.</p>
   <div class="ctl" style="margin-bottom:10px">${sfSel('vd','grp','Nhóm',[['all','Tất cả']].concat(grps.map(g=>[g,g])))}<label class="c"><span class="cl">Lọc</span><input type="search" id="sfvq" value="${nE(P.q)}" placeholder="Ví dụ: SCell, CORESET, split"></label></div>
   <div class="scroll"><table class="ndtb"><thead>${sfParHead()}</thead><tbody id="sfParB">${sfParRows()}</tbody></table></div></div>
  <div class="panel"><h3>KPI theo dõi</h3><div class="ctl" style="margin-bottom:10px">${sfSel('vd','kf','Theo mục',[['all','Tất cả']].concat(SFV.filter(v=>v[0]!=='vd').map(v=>[v[0],v[1]])))}</div>
   <div class="scroll"><table class="ndtb"><thead><tr><th>KPI</th><th>Công thức</th><th>Bộ đếm</th><th>Mục tiêu</th><th></th></tr></thead><tbody id="sfKpB">${sfKpiRows()}</tbody></table></div>
   <div class="u3calc"><b>Tính nhanh từ bộ đếm</b><div class="ctl ndcalc" style="margin-top:8px">
    ${[['sfcU1','PRB DL dùng CC1 (n77)',240],['sfcA1','PRB DL có CC1',273],['sfcU2','PRB DL dùng CC2 (n41)',90],['sfcA2','PRB DL có CC2',273],['sfcV1','Lưu lượng DL CC1 (GB/giờ)',210],['sfcV2','Lưu lượng DL CC2 (GB/giờ)',95],['sfcTp','Thông lượng DL cả hai CC (Mbit/s)',820],['sfcBw','Tổng băng thông (MHz)',200],['sfcCa','UE có SCell đang bật',65],['sfcCc','UE hỗ trợ CA có dữ liệu',140]].map(r=>`<label class="c"><span class="cl">${r[1]}</span><input type="number" id="${r[0]}" value="${r[2]}" step="any"></label>`).join('')}
   </div><dl class="kv" id="sfcOut" style="margin-top:8px"></dl></div></div>
  <div class="panel"><h3>Lỗi thường gặp và cách kiểm tra</h3>${sfFltHtml()}</div>
  <div class="panel"><h3>Tiêu chuẩn tham chiếu</h3><ul class="u3ul"><li>TS 38.101-1 §5.3 (băng thông, số PRB), TS 36.101 §5.6 (LTE)</li><li>TS 38.211 (khung, SSB, DMRS, CSI-RS), TS 38.213 §10 (PDCCH, CORESET, CCE), §11.1 (khung TDD)</li><li>TS 38.212 §7.3.1 (DCI 1_1, 1_3 nhiều cell Rel-18), TS 38.214 §5.1.2 (cấp phát PRB type 0/1)</li><li>TS 38.321 §5.9 (kích hoạt/tắt SCell), TS 38.331 (sCellToAddModList, CrossCarrierSchedulingConfig, sCellDeactivationTimer)</li><li>TS 38.306 §4.1.2 (tốc độ đỉnh), TS 37.340 (EN-DC, split bearer), TS 38.300 §10 (CA), §15 (MLB)</li><li>TS 28.552 (PRB usage, lưu lượng theo cell), TS 28.554 (KPI người dùng)</li></ul></div>`;},
 after(){sfCalc();},
 upd(k){if(k==='grp')sfSet('sfParB',sfParRows());if(k==='kf')sfSet('sfKpB',sfKpiRows());}
};
document.addEventListener('input',e=>{const t=e.target;if(t.id==='sfvq'){SFP.vd.q=t.value;sfSet('sfParB',sfParRows());}else if(t.id&&/^sfc[A-Z]/.test(t.id))sfCalc();});

/* ---------- Khung thẻ: điều hướng, vòng hoạt hình, sự kiện ---------- */
const SFLK={
  cfg:{e2:[['reg','sa'],['reg','nsa']],kpi:['prb5','tputdl5']},
  grid:{e2:[['data','sa'],['data','nsa']],kpi:['prb5','prbdl4','sf_waste']},
  split:{e2:[['data','sa'],['data','nsa'],['data','g4']],kpi:['sf_ca5','sf_ccsh','ca4']},
  alg:{e2:[['data','sa'],['ho','sa']],kpi:['sf_se','sf_waste','lb_imb','tputdl5']},
  scn:{e2:[['data','sa'],['data','nsa']],kpi:['sf_se','lb_edge','prb5']},
  vd:{e2:[['data','sa']],kpi:[]}
};
const SFT={g3:'3G',g4:'4G',nsa:'5G NSA',sa:'5G SA'};
function sfLinks(){const L=SFLK[SFS.v]||{e2:[],kpi:[]},hasE2=typeof E2S!=='undefined',hasK=typeof KL!=='undefined';
  const e2=hasE2?L.e2.map(([id,tk])=>{const s=E2S.find(x=>x.id===id);return s&&s.f&&s.f[tk]?[s,tk]:null;}).filter(Boolean):[];
  const kp=hasK?L.kpi.map(id=>KL.find(k=>k.id===id)).filter(Boolean):[];
  const tabs=[['ca','Ghép sóng mang'],['prb','Cấp phát PRB'],['frame','Khung và lưới'],['nd','NSA EN-DC và di động 5G-A'],['es','Tiết kiệm điện'],['ml','Học máy']].filter(t=>typeof RENDER!=='undefined'&&RENDER[t[0]]);
  const hasLb=typeof RENDER!=='undefined'&&RENDER.lb;
  return `<div class="panel u3lk"><h3>Xem tiếp ở thẻ khác</h3>
  ${hasLb?`<p class="e2x"><b>Nhiều trạm, nhiều lớp</b> ở thẻ Đa lớp tần số và cân bằng tải:</p><div class="e2go"><button type="button" class="btn sm" data-lbgo="lb:adv">Cân bằng tải 5G-A →</button><button type="button" class="btn sm" data-lbgo="lb:sim">Mô phỏng 7 trạm × 5 lớp theo giờ →</button><button type="button" class="btn sm" data-lbgo="lb:iflb">IFLB/MLB →</button></div>`:''}
  ${e2.length?`<p class="e2x" style="margin-top:10px"><b>Luồng ở thẻ Toàn trình E2E</b> (mở sẵn đúng công nghệ):</p><div class="e2go">${e2.map(([s,tk])=>`<button type="button" class="btn sm" data-sfgo="e2:${s.id}:${tk}">${nE(s.n)} · ${SFT[tk]} →</button>`).join('')}</div>`:''}
  ${kp.length?`<p class="e2x" style="margin-top:10px"><b>KPI liên quan ở thẻ KPI mạng</b>:</p><div class="e2go">${kp.map(k=>`<button type="button" class="btn sm" data-sfgo="kpi:${k.id}">${nE(k.nm)} →</button>`).join('')}</div>`:''}
  <p class="e2x" style="margin-top:10px"><b>Thẻ liên quan:</b></p><div class="e2go">${tabs.map(t=>`<button type="button" class="btn sm" data-tab="${t[0]}">${t[1]} →</button>`).join('')}</div></div>`;}
function sfNav(){return `<div class="seg u3seg ndseg sfseg" role="group" aria-label="Mục của thẻ Hiệu quả tần số tại một trạm">${SFV.map((v,i)=>`<button type="button" data-sfv="${v[0]}" aria-pressed="${v[0]===SFS.v}"><span class="ndn">${i+1}</span>${v[1]}</button>`).join('')}</div>`;}
function sfPlayBtn(vw,id){return `<button type="button" class="btn sm" data-sfa="${vw}:play" id="${id}">${SFS.pause?'▶ Chạy':'⏸ Dừng'}</button>`;}
function sfPlayTog(id){SFS.pause=!SFS.pause;const b=document.getElementById(id);if(b)b.textContent=SFS.pause?'▶ Chạy':'⏸ Dừng';}
function renderSf(){const nav=$('#sfNav'),body=$('#sfBody');if(!nav||!body)return;if(!SFR[SFS.v])SFS.v='cfg';
  nav.innerHTML=sfNav();const V=SFR[SFS.v];body.innerHTML=V.html()+sfLinks();if(V.after)V.after();
  if(S.tab==='sf'&&!nReduced()&&V.tick)sfStart();else{sfStop();if(V.tick&&S.tab==='sf')V.tick(0);}}
function sfStart(){if(SFS.raf)return;SFS.last=performance.now();SFS.raf=requestAnimationFrame(sfLoop);}
function sfStop(){if(SFS.raf)cancelAnimationFrame(SFS.raf);SFS.raf=0;}
function sfLoop(now){SFS.raf=0;if(S.tab!=='sf')return;
  if(document.hidden){SFS.last=now;SFS.raf=requestAnimationFrame(sfLoop);return;}
  const dt=Math.max(0,Math.min(0.1,(now-SFS.last)/1000));SFS.last=now;const V=SFR[SFS.v];if(V&&V.tick){try{V.tick(dt);}catch(e){console.error(e);}}else return;
  SFS.raf=requestAnimationFrame(sfLoop);}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-sfgo]');
  if(g){const [t,id,tk]=g.dataset.sfgo.split(':');try{tourStop();}catch(x){}try{stopSig();}catch(x){}
    const top=()=>window.scrollTo({top:Math.min(window.scrollY,$('main').offsetTop-$('.bar').offsetHeight)});
    if(t==='e2'){try{e2Stop();}catch(x){}S.e2Sc=id;S.e2R=tk||'sa';S.e2M=S.mode;if(typeof E2A!=='undefined'){E2A.key='';E2A.i=0;}S.tab='e2';renderAll();top();}
    else if(t==='kpi'){S.tab='kpi';KP.tech='all';KP.ly='all';KP.cat='all';KP.q='';KP.node='';KP.sel=id;kpSig='';renderAll();setTimeout(()=>{const d=$('#kpDet');if(d)d.scrollIntoView({block:'start',behavior:'smooth'});},60);}
    else if(t==='sf'){S.tab='sf';if(id&&SFR[id])SFS.v=id;renderAll();top();}
    return;}
  const t=e.target.closest('#t-sf [data-sfv],#t-sf [data-sfa]');if(!t)return;
  if(t.dataset.sfv){if(t.dataset.sfv===SFS.v)return;SFS.v=t.dataset.sfv;sfStop();renderSf();return;}
  const [vw,...r]=t.dataset.sfa.split(':');const V=SFR[vw];if(V&&V.act)V.act(r.join('|'),t);
});
const SFLITE=['grid:spd','grid:hr'];
function sfInp(el,live){const [vw,k]=el.dataset.sfi.split(':');const P=SFP[vw];if(!P)return;
  let v=el.type==='checkbox'?el.checked:(el.tagName==='SELECT'&&isNaN(+el.value)?el.value:+el.value);
  const ks=k.split('.');
  if(ks.length>1){if(vw==='cfg'&&ks[0]==='on'&&!v&&sfOn().length<=1){el.checked=true;return;}P[ks[0]][ks[1]]=v;}else P[k]=v;
  const o=el.parentElement.querySelector('output');if(o&&SFF[vw+':'+k])o.textContent=SFF[vw+':'+k](v);
  if(live&&!SFLITE.includes(vw+':'+k))return;
  if(vw==='cfg'||vw==='ue'){if(!(vw==='ue'&&k==='alg'))sfReset();else{SFL.E=null;}}
  if(vw==='cfg'&&ks[0]==='on'&&!v&&SFP.scn.off===ks[1])SFP.scn.off=sfOn()[0];
  const V=SFR[SFS.v];if(V&&V.upd)V.upd(k,vw);}
document.addEventListener('input',e=>{const el=e.target;if(!el.dataset||!el.dataset.sfi||el.type!=='range')return;sfInp(el,true);});
document.addEventListener('change',e=>{const el=e.target;if(!el.dataset||!el.dataset.sfi)return;sfInp(el,false);});

/* ---------- Gắn thẻ vào ứng dụng ---------- */
RENDER.sf=renderSf;
(function(){if(typeof K!=='function'||typeof KL==='undefined')return;try{
  const add=a=>{if(KL.some(k=>k.id===a[0]))return;K(...a);};
  add(["sf_se","5G","ran","utl","Downlink Spectral Efficiency per Carrier","du","tput","g|bit/s/Hz|0|10|u|3|1.5|4",
   "SE = thông lượng DL của cell (bit/s) / băng thông kênh (Hz), tính theo giờ bận cho từng sóng mang.","TS 28.552 (lưu lượng theo cell), TS 38.101-1 (băng thông). Chỉ số tự tính.",
   "?Tự tính từ N.ThpVol.DL và DlBandwidth (tra Huawei NR PM)","?Tự tính từ pmMacVolDl và bSChannelBwDL (tra Ericsson NR PM)","?Tự tính từ DL volume và chBw (tra Nokia 5G PM)",
   "Cho biết mỗi MHz đang mang bao nhiêu bit: so sánh hiệu quả giữa các tần số cùng trạm (n41, n77, LTE).","≥ 3–5 bit/s/Hz giờ bận với mMIMO; LTE 1,5–2,5.",
   "cuup>du:Lưu lượng DL;du>ue:PDSCH trên nhiều CC!S"]);
  add(["sf_ca5","5G","ran","utl","NR CA Active User Ratio (SCell activated)","du,ue","tput","g|%|0|100|u|60|30|70",
   "CA active % = UE có SCell đang kích hoạt khi có dữ liệu / UE hỗ trợ CA có dữ liệu × 100.","TS 38.321 §5.9 (kích hoạt SCell), TS 28.552. Chỉ số theo quy ước khai thác.",
   "?Số UE CA kích hoạt / CA-capable (tra Huawei NR PM)","?pmCaActivatedDlSum / pmCaCapableDlSum (tra Ericsson NR PM)","?CA activated users (tra Nokia 5G PM)",
   "Thấp nghĩa là UE có khả năng ghép n41 + n77 nhưng chỉ chạy một CC: phí phổ và lệch tải.","≥ 60–80 % UE CA-capable.",
   "cucp>ue:RRCReconfiguration (sCellToAddModList)!A;ue>cucp:RRCReconfigurationComplete;du>ue:SCell Activation MAC CE!S"]);
  add(["sf_ccsh","5G","ran","utl","Traffic Share per Component Carrier","du","tput","g|%|0|100|d|60|80|50",
   "Tỉ lệ lưu lượng CC = bit DL qua CC / tổng bit DL các CC cùng trạm × 100.","TS 28.552 (lưu lượng theo cell). Chỉ số tự tính.",
   "?N.ThpVol.DL theo cell (tra Huawei NR PM)","?pmMacVolDl theo NRCellDU (tra Ericsson NR PM)","?DL volume theo NRCELL (tra Nokia 5G PM)",
   "Hai CC cùng băng thông nên chia gần đều; một CC gánh > 70 % là dấu hiệu ưu tiên hoặc chia gói lệch.","Gần tỉ lệ dung lượng các CC.",
   "du>ue:PDSCH CC1;du>ue:PDSCH CC2!S"]);
  add(["sf_waste","5G","ran","utl","Idle PRB while Other Carrier Congested","du","mlb","g|%|0|60|d|5|15|1",
   "PRB bỏ phí % = PRB rảnh trên CC trong các khe mà CC khác cùng trạm đầy và còn hàng đợi / PRB có × 100.","TS 28.552 (PRB usage). Chỉ số tự tính theo khe hoặc theo phút.",
   "?Tự tính từ PRB usage theo cell, độ phân giải cao (tra Huawei NR PM)","?Tự tính từ pmMacRBSymUsedPdschTypeA (tra Ericsson NR PM)","?Tự tính từ PRB usage (tra Nokia 5G PM)",
   "Đo trực tiếp phần phổ lãng phí vì không cân bằng giữa các tần số cùng trạm.","≈ 0 %; > 10 % cần xem chiến lược chia gói/IFLB.",
   "du>du:Đo tải PRB từng CC;cucp>ue:RRCReconfiguration (HO nội trạm khác tần số)!S"]);
  const XN={sf_se:["Hiệu suất phổ DL từng sóng mang","SE","spectral efficiency|bit/s/Hz|hiệu suất phổ|hiệu quả tần số","Bit trên giây trên mỗi Hz của từng sóng mang."],
    sf_ca5:["Tỉ lệ UE CA có SCell đang bật","CA active","SCell activation|carrier aggregation|ghép sóng mang|NR CA","UE hỗ trợ CA thực sự có SCell kích hoạt khi truyền dữ liệu."],
    sf_ccsh:["Tỉ lệ lưu lượng mỗi sóng mang","CC share","traffic share|component carrier|lưu lượng CC","Phần lưu lượng DL của trạm đi qua từng CC."],
    sf_waste:["PRB bỏ phí khi CC khác nghẽn","Idle PRB","PRB bỏ phí|idle PRB|wasted PRB|mất cân bằng nội trạm","PRB rảnh trên một CC đúng lúc CC khác cùng trạm đầy."]};
  const EN={sf_se:"Downlink Spectral Efficiency per Carrier",sf_ca5:"NR CA Active User Ratio",sf_ccsh:"Traffic Share per Component Carrier",sf_waste:"Idle PRB while Other Carrier Congested"};
  for(const id in XN){const k=KL.find(x=>x.id===id);if(!k)continue;const x=XN[id];if(typeof KX!=='undefined')KX[id]=x;if(typeof KEN!=='undefined')KEN[id]=EN[id];
    k.fn=x[0];k.ab=[x[1]].concat(x[2].split('|'));k.gl=x[3];k.dn=k.fn+' ('+x[1]+')';k.en=EN[id];}
  const ids=['sf_se','sf_ca5','sf_ccsh','sf_waste'],moved=ids.map(id=>{const i=KL.findIndex(k=>k.id===id);return i>=0?KL.splice(i,1)[0]:null;}).filter(Boolean);
  let j=KL.findIndex(k=>k.id==='lb_edge');if(j<0)j=KL.findIndex(k=>k.id==='prb5');KL.splice(j>=0?j+1:KL.length,0,...moved);
}catch(e){console.error('KPI hiệu quả tần số',e);}})();
/* tìm kiếm chung */
if(typeof qSnap==='function'){const _qs=qSnap;qSnap=function(){_qs.apply(this,arguments);if(!QS||!QS.I||QS.sf)return;QS.sf=1;
  const CAT='Thẻ Hiệu quả tần số tại một trạm',body=$('#sfBody'),cur=SFS.v;
  if(body){for(const [v,vn] of SFV){try{SFS.v=v;body.innerHTML=SFR[v].html();
    body.querySelectorAll('.panel').forEach(pn=>{const h=pn.querySelector('h3'),tt=h?h.textContent:vn,txt=qText(pn).slice(0,6000);if(txt.trim().length<12)return;
      qAdd(QS.I,CAT+' · '+vn,tt,txt,1,()=>{S.tab='sf';SFS.v=v;},()=>[...document.querySelectorAll('#t-sf .panel')].find(p=>{const x=p.querySelector('h3');return x&&x.textContent===tt;}));});}catch(e){console.error(e);}}
    SFS.v=cur;try{if(S.tab==='sf')renderSf();else body.innerHTML='';}catch(e){}}
  const go=(v,f)=>()=>{S.tab='sf';SFS.v=v;if(f)f();};
  SFPAR.forEach(r=>qAdd(QS.I,'Hiệu quả tần số · Tham số '+r[1],r[2].replace(/<[^>]+>/g,''),['Huawei: '+r[3],'Nokia: '+r[4],'Ericsson: '+r[5],'Điển hình: '+r[6]].join('. '),3,go('vd',()=>{SFP.vd.grp=r[1];SFP.vd.q='';}),'#sfParB'));
  SFKPI.forEach(k=>qAdd(QS.I,'Hiệu quả tần số · KPI',k[0],[k[1],'Huawei: '+k[2],'Nokia: '+k[3],'Ericsson: '+k[4],k[5]].join('. '),3,go('vd'),'#sfKpB'));
  SFFLT.forEach(f=>qAdd(QS.I,'Hiệu quả tần số · Lỗi thường gặp',f[0],[f[1],f[2].join('; '),f[3].join('; ')].join('. '),3,go('vd'),()=>{const d=[...document.querySelectorAll('#t-sf .sfflt')].find(x=>x.querySelector('summary').textContent===f[0]);if(d)d.open=true;return d;}));
  SFK.forEach(k=>qAdd(QS.I,'Hiệu quả tần số · Sóng mang',SFC[k].n,`${SFC[k].dx}, ${SFC[k].mhz} MHz, SCS ${SFC[k].scs} kHz, số PRB vật lý, khung TDD, overhead PDCCH SSB CSI-RS, tốc độ đỉnh`,2,go('cfg',()=>{SFP.cfg.sel=k;}),'#sfCfgTb'));
  [['Lưới PRB × khe','bản đồ PRB thời gian thực PDSCH PUSCH CORESET SSB CSI-RS TRS PUCCH tải PRB theo giây theo giờ','grid'],['Chia lưu lượng giữa sóng mang','UE không CA LTE-A CA NR CA n41 n77 EN-DC split bearer 5G-A SCell activation deactivation MAC CE cross-carrier scheduling DCI 1_3 multi-cell scheduling','split'],
   ['So sánh thuật toán cân bằng nội trạm','theo tải PRB hiệu suất phổ dung lượng còn lại ưu tiên PCell IFLB nội trạm độ lệch tải PRB bỏ phí UE 5% spectral efficiency','alg'],['Kịch bản một trạm','giờ cao điểm tỉ lệ máy hỗ trợ CA UE gần xa n77 phủ kém tắt sóng mang tiết kiệm điện 4G CA 5G CA EN-DC','scn']].forEach(([n,x,v])=>qAdd(QS.I,'Hiệu quả tần số tại một trạm',n,x,2,go(v),'#sfBody'));};}
/* thẻ E2E: nút sang thẻ này */
if(typeof e2Kpi==='function'){const _ke=e2Kpi;e2Kpi=function(){_ke.apply(this,arguments);if(S.e2Sc!=='data'||!['g4','nsa','sa'].includes(S.e2R))return;const b=$('#e2Kpi .e2go');
  if(b&&!b.querySelector('[data-sfgo]'))b.insertAdjacentHTML('beforeend',`<button type="button" class="btn sm" data-sfgo="sf:split">Hiệu quả tần số tại một trạm · Chia lưu lượng giữa sóng mang →</button>`);};}
/* thẻ KPI: nút sang mục tương ứng */
const SFKV={sf_se:'alg',sf_ca5:'split',sf_ccsh:'split',sf_waste:'alg',prb5:'grid',prbdl4:'grid',prbul4:'grid',ca4:'split',lb_imb:'alg'};
if(typeof kpDetHtml==='function'){const _kd=kpDetHtml;kpDetHtml=function(k){let h=_kd.apply(this,arguments);if(k&&SFKV[k.id]){const v=SFKV[k.id];h+=`<p class="u3kpl"><button type="button" class="btn sm" data-sfgo="sf:${v}">Xem mô phỏng ở thẻ Hiệu quả tần số tại một trạm · ${nE(SFV.find(x=>x[0]===v)[1])} →</button></p>`;}return h;};}
/* thanh nút ở các thẻ liên quan */
const SFTABL={ca:[['split','Chia lưu lượng giữa CC'],['alg','So sánh thuật toán']],prb:[['grid','Lưới PRB nhiều sóng mang']],frame:[['cfg','PRB vật lý từng sóng mang']],es:[['scn','Tắt một sóng mang lúc ít tải']]};
Object.keys(SFTABL).forEach(t=>{const f=RENDER[t];if(typeof f!=='function')return;RENDER[t]=function(){const r=f.apply(this,arguments);try{const sec=document.getElementById('t-'+t);if(sec&&!sec.querySelector('.sflkbar')){const h=`<div class="sclkbar sflkbar nogl"><span>Mô phỏng ở thẻ <b>Hiệu quả tần số tại một trạm</b>:</span>${SFTABL[t].map(x=>`<button type="button" class="btn sm" data-sfgo="sf:${x[0]}">${nE(x[1])} →</button>`).join('')}</div>`;const ld=sec.querySelector('.lead');if(ld)ld.insertAdjacentHTML('afterend',h);else sec.insertAdjacentHTML('afterbegin',h);}}catch(e){}return r;};});
/* thẻ lb (mục adv, sim): nút sang thẻ này */
if(typeof LBR!=='undefined')[['adv','Cân bằng 5G-A nhìn trong MỘT trạm'],['sim','Một trạm của bản đồ, nhìn tới từng PRB']].forEach(([v,tt])=>{const V=LBR[v];if(!V||V._sf)return;const h=V.html;V._sf=1;
  V.html=function(){return h.apply(this,arguments)+`<div class="panel sflkp"><h3>${tt}: thẻ Hiệu quả tần số tại một trạm</h3><p class="note">Mục này xét nhiều trạm và nhiều lớp. Thẻ Hiệu quả tần số tại một trạm đi sâu vào một trạm n41 2600 + n77 3800 + LTE: lưới PRB từng sóng mang theo khe, chia gói UE CA/không CA, so sánh thuật toán cân bằng và hiệu suất phổ từng tần số.</p><div class="e2go"><button type="button" class="btn sm" data-sfgo="sf:grid">Lưới PRB × khe →</button><button type="button" class="btn sm" data-sfgo="sf:split">Chia lưu lượng giữa sóng mang →</button><button type="button" class="btn sm" data-sfgo="sf:alg">So sánh thuật toán cân bằng →</button>${v==='sim'?'<button type="button" class="btn sm" data-sfgo="sf:scn">Giờ cao điểm, tắt sóng mang →</button>':''}</div></div>`;};});

