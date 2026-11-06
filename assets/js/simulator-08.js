
/* ===== Thẻ Bảo mật và xác thực (sc) — đợt 14 ===== */
const SCS={v:'aka',raf:0,last:0,pause:false};
const SCV=[['aka','5G-AKA, EAP-AKA′, SUPI/SUCI'],['key','Phân cấp khoá, Security Mode, NEA/NIA'],['roam','Roaming: SEPP, N32, SS7/Diameter'],['tnl','IPsec/SEG, chứng chỉ, MACsec, UP'],['fbs','Trạm giả, downgrade, DoS, NESAS/SCAS'],['vd','Tham số, KPI, lỗi']];
const SCR={};   /* mỗi mục: html(), after(), tick(dt), upd(k), act(a,el) */
const SCP={};   /* tham số điều khiển */
const SCF={};   /* hàm hiển thị giá trị thanh trượt */
/* ---------- mật mã dùng thật (rút gọn): SHA-256, HMAC-SHA-256, KDF TS 33.220, X25519 ---------- */
const sHex=b=>Array.from(b,x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();
const sFromHex=h=>{h=String(h||'').replace(/[^0-9a-f]/gi,'');if(h.length%2)h='0'+h;const o=new Uint8Array(h.length/2);for(let i=0;i<o.length;i++)o[i]=parseInt(h.substr(i*2,2),16);return o;};
const sUtf=s=>new TextEncoder().encode(s);
const sCat=(...a)=>{let n=0;a.forEach(x=>n+=x.length);const o=new Uint8Array(n);let p=0;a.forEach(x=>{o.set(x,p);p+=x.length;});return o;};
const sXor=(a,b)=>{const o=new Uint8Array(a.length);for(let i=0;i<a.length;i++)o[i]=a[i]^b[i%b.length];return o;};
const sShort=(b,n)=>{const h=typeof b==='string'?b:sHex(b);n=n||16;return h.length<=n*2?h:h.slice(0,n)+'…'+h.slice(-8);};
const SHA_K=new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
function sSha(m){const l=m.length,nb=((l+9+63)>>6)<<6,b=new Uint8Array(nb);b.set(m);b[l]=0x80;const bits=l*8;b[nb-4]=bits>>>24&255;b[nb-3]=bits>>>16&255;b[nb-2]=bits>>>8&255;b[nb-1]=bits&255;b[nb-5]=Math.floor(l/0x20000000)&255;
  const H=new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]),W=new Uint32Array(64);
  for(let o=0;o<nb;o+=64){for(let i=0;i<16;i++)W[i]=b[o+i*4]<<24|b[o+i*4+1]<<16|b[o+i*4+2]<<8|b[o+i*4+3];
    for(let i=16;i<64;i++){const x=W[i-15],y=W[i-2];const s0=(x>>>7|x<<25)^(x>>>18|x<<14)^(x>>>3),s1=(y>>>17|y<<15)^(y>>>19|y<<13)^(y>>>10);W[i]=W[i-16]+s0+W[i-7]+s1|0;}
    let a=H[0],c=H[1],d=H[2],e=H[3],f=H[4],g=H[5],h=H[6],k=H[7];
    for(let i=0;i<64;i++){const S1=(f>>>6|f<<26)^(f>>>11|f<<21)^(f>>>25|f<<7),ch=f&g^~f&h,t1=k+S1+ch+SHA_K[i]+W[i]|0,S0=(a>>>2|a<<30)^(a>>>13|a<<19)^(a>>>22|a<<10),mj=a&c^a&d^c&d,t2=S0+mj|0;k=h;h=g;g=f;f=e+t1|0;e=d;d=c;c=a;a=t1+t2|0;}
    H[0]+=a;H[1]+=c;H[2]+=d;H[3]+=e;H[4]+=f;H[5]+=g;H[6]+=h;H[7]+=k;}
  const out=new Uint8Array(32);for(let i=0;i<8;i++){out[i*4]=H[i]>>>24;out[i*4+1]=H[i]>>>16&255;out[i*4+2]=H[i]>>>8&255;out[i*4+3]=H[i]&255;}return out;}
function sHmac(k,m){if(k.length>64)k=sSha(k);const kp=new Uint8Array(64);kp.set(k);return sSha(sCat(sXor(kp,[0x5c]),sSha(sCat(sXor(kp,[0x36]),m))));}
/* KDF chung TS 33.220 Annex B.2: HMAC-SHA-256(Key, FC || P0 || L0 || P1 || L1 ...) */
function sKdf(key,fc,...ps){const parts=[Uint8Array.of(fc)];ps.forEach(p=>{parts.push(p,Uint8Array.of(p.length>>8&255,p.length&255));});return sHmac(key,sCat(...parts));}
/* X25519 (RFC 7748) bằng BigInt */
const SP25=(1n<<255n)-19n;
const sMd=a=>{a%=SP25;return a<0n?a+SP25:a;};
function sPw(b,e){let r=1n;b=sMd(b);while(e>0n){if(e&1n)r=r*b%SP25;b=b*b%SP25;e>>=1n;}return r;}
function sLE(u){let r=0n;for(let i=u.length-1;i>=0;i--)r=(r<<8n)|BigInt(u[i]);return r;}
function sBE(n){const o=new Uint8Array(32);for(let i=0;i<32;i++){o[i]=Number(n&255n);n>>=8n;}return o;}
function sX25519(k,u){k=Uint8Array.from(k);k[0]&=248;k[31]&=127;k[31]|=64;const kn=sLE(k),x1=sLE(u)&((1n<<255n)-1n);let x2=1n,z2=0n,x3=x1,z3=1n,sw=0n;
  for(let t=254;t>=0;t--){const kt=(kn>>BigInt(t))&1n;sw^=kt;if(sw){[x2,x3]=[x3,x2];[z2,z3]=[z3,z2];}sw=kt;
    const A=sMd(x2+z2),AA=A*A%SP25,B=sMd(x2-z2),BB=B*B%SP25,E=sMd(AA-BB),C=sMd(x3+z3),D=sMd(x3-z3),DA=D*A%SP25,CB=C*B%SP25;
    x3=sMd((DA+CB)*(DA+CB));z3=sMd(x1*sMd((DA-CB)*(DA-CB)));x2=AA*BB%SP25;z2=sMd(E*sMd(AA+121665n*E));}
  if(sw){[x2,x3]=[x3,x2];[z2,z3]=[z3,z2];}return sBE(x2*sPw(z2,SP25-2n)%SP25);}
const S_BASE=(()=>{const b=new Uint8Array(32);b[0]=9;return b;})();
/* ANSI X9.63 KDF với SHA-256 (dùng trong ECIES của SUCI) */
function sX963(z,info,len){const o=[];let c=1,n=0;while(n<len){const h=sSha(sCat(z,Uint8Array.of(c>>>24,c>>>16&255,c>>>8&255,c&255),info));o.push(h);n+=32;c++;}return sCat(...o).slice(0,len);}
/* dòng khoá minh hoạ thay AES-128-CTR (ghi rõ trên giao diện) */
function sCtr(key,icb,data){const o=new Uint8Array(data.length);for(let i=0;i<data.length;i+=32){const ks=sSha(sCat(key,icb,Uint8Array.of(i>>5)));for(let j=0;j<32&&i+j<data.length;j++)o[i+j]=data[i+j]^ks[j];}return o;}
const sBcd=d=>{d=String(d).replace(/\D/g,'');if(d.length%2)d+='F';const o=new Uint8Array(d.length/2);for(let i=0;i<o.length;i++)o[i]=parseInt(d[i*2+1]+d[i*2],16);return o;};
const sUnBcd=b=>Array.from(b,x=>(x&15).toString(16)+(x>>4).toString(16)).join('').replace(/f$/i,'');
/* số giả ngẫu nhiên tất định từ chuỗi (để lần chạy lặp lại được) */
const sSeedBytes=(s,n)=>sSha(sUtf(s)).slice(0,n||16);
/* ---------- tiện ích giao diện (dùng lại nE, nF, nC, nRng, nVn, nVName, nPlot, nBars, nLog của thẻ NSA) ---------- */
function sSl(vw,k,l,mn,mx,st,f,hint,pk){SCF[vw+':'+k]=f;const v=SCP[vw][k];
  return `<label class="c"><span class="cl">${l}<output>${f(v)}</output></span><input type="range" data-sci="${vw}:${k}" min="${mn}" max="${mx}" step="${st}" value="${v}">${hint?`<span class="u3ph">${hint}</span>`:''}${pk?sPnTag(pk):''}</label>`;}
function sSel(vw,k,l,opts,hint,pk){const v=SCP[vw][k];
  return `<label class="c"><span class="cl">${l}</span><select data-sci="${vw}:${k}">${opts.map(o=>`<option value="${o[0]}"${String(o[0])===String(v)?' selected':''}>${nE(o[1])}</option>`).join('')}</select>${hint?`<span class="u3ph">${hint}</span>`:''}${pk?sPnTag(pk):''}</label>`;}
function sChk(vw,k,l,pk){return `<label class="u3ck"><input type="checkbox" data-sci="${vw}:${k}"${SCP[vw][k]?' checked':''}> ${l}</label>${pk?sPnTag(pk):''}`;}
function sTxt(vw,k,l,hint,ml){const v=SCP[vw][k];return `<label class="c"><span class="cl">${l}</span><input type="text" class="sctxt" data-sci="${vw}:${k}" value="${nE(v)}" maxlength="${ml||40}" spellcheck="false" autocomplete="off">${hint?`<span class="u3ph">${hint}</span>`:''}</label>`;}
function sPn(key){const r=(typeof SCPAR!=='undefined'?SCPAR:[]).find(x=>x[0]===key);if(!r)return'';const v=nVn();if(v==='3gpp')return'';
  return nVName(v)+': '+r[{huawei:3,nokia:4,ericsson:5}[v]]+(r[7]==='v'?' (cần đối chiếu)':'');}
function sPnTag(key){const t=sPn(key);return t?`<span class="vh ndvh">${nE(t)}</span>`:'';}
const sKv=(a,b,c)=>`<dt>${a}</dt><dd${c?` class="${c}"`:''}>${b}</dd>`;
const sCode=(h,cls)=>`<code class="schex${cls?' '+cls:''}">${nE(h)}</code>`;
/* sản phẩm theo vendor (tên thương mại, cần đối chiếu theo hợp đồng) */
const SCPROD={
  udm:{huawei:'UDM (UNC/UDM, CloudDB)',nokia:'Nokia Cloud SDM (UDM/AUSF)',ericsson:'Cloud Core Subscription Manager (CCSM)'},
  ausf:{huawei:'AUSF trong UDM/UNC',nokia:'Nokia Cloud SDM (AUSF)',ericsson:'CCSM (AUSF)'},
  amf:{huawei:'UNC (AMF)',nokia:'Cloud Mobility Manager (CMM)',ericsson:'Packet Core Controller (PCC)'},
  sepp:{huawei:'SEPP (UNC/USCDB)',nokia:'Nokia SEPP (Cloud Signaling)',ericsson:'Signaling Controller (SC: SEPP, SCP)'},
  secgw:{huawei:'Firewall USG/Eudemon làm SecGW',nokia:'Nokia SR (7750) / NGFW làm SecGW',ericsson:'SecGW đối tác (Juniper, Palo Alto…)'},
  gnb:{huawei:'BBU5900 (gNodeB)',nokia:'AirScale gNB',ericsson:'Baseband 6648 (gNB)'}
};
function sProd(k){const p=SCPROD[k];if(!p)return'';const v=nVn();return v==='3gpp'?Object.entries(p).map(([a,b])=>nVName(a)+': '+b).join(' · ')+' (cần đối chiếu)':nVName(v)+': '+p[v]+' (cần đối chiếu)';}
/* ---------- sơ đồ bản tin (ladder) dùng chung ---------- */
/* L={cols:[[id,nhãn,lớp]],steps:[{f,t,p,s,m,a,d,bad,ok}]}; P={t,i} */
function sLadSvg(L,cur,id){const cw=Math.max(L.cw||150,Math.round(660/L.cols.length)),n=L.cols.length,W=n*cw,rh=L.rh||30,top=56,H=top+L.steps.length*rh+16;const X=c=>cw/2+L.cols.findIndex(x=>x[0]===c)*cw;
  let s=`<defs>${['a','c','w','k'].map(k=>`<marker id="scM${id}${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="scmk-${k}"/></marker>`).join('')}</defs>`;
  L.cols.forEach((c,i)=>{const x=cw/2+i*cw;s+=`<line x1="${x}" y1="${top-14}" x2="${x}" y2="${H-6}" class="sclife"/><rect x="${x-cw/2+8}" y="6" width="${cw-16}" height="30" rx="8" class="sccol ${c[2]||''}"/><text x="${x}" y="25" text-anchor="middle" class="sccolt">${nE(c[1])}</text>`;});
  L.steps.forEach((st,i)=>{const y=top+i*rh+rh/2,cls=i<cur?'done':i===cur?'cur':'fut',k=st.bad?'w':i===cur?'c':'a';
    if(st.f===st.t){const x=X(st.f);s+=`<g class="scst ${cls}${st.bad?' bad':''}"><rect x="${x-cw/2+14}" y="${y-11}" width="${cw-28}" height="22" rx="5" class="scloc"/><text x="${x}" y="${y+4}" text-anchor="middle" class="scmt">${nE(st.s||st.m)}</text></g>`;}
    else{const x1=X(st.f),x2=X(st.t),dir=x2>x1?1:-1,lx=(x1+x2)/2;s+=`<g class="scst ${cls}${st.bad?' bad':''}"><line x1="${x1+dir*3}" y1="${y+6}" x2="${x2-dir*3}" y2="${y+6}" marker-end="url(#scM${id}${k})"/><text x="${lx}" y="${y}" text-anchor="middle" class="scmt">${nE(st.s||st.m)}</text></g>`;}});
  s+=`<circle id="scDot${id}" r="5.5" class="scdot" cx="-20" cy="-20"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="u3svg sclad" style="min-width:${Math.min(W,n*128)}px;max-width:${Math.round(W*1.15)}px;margin:0 auto" role="img" aria-label="Sơ đồ bản tin">${s}</svg>`;}
function sLadDot(L,cur,fr,id){const c=document.getElementById('scDot'+id);if(!c)return;const st=L.steps[cur];if(!st){c.setAttribute('cx',-20);return;}
  const cw=Math.max(L.cw||150,Math.round(660/L.cols.length)),rh=L.rh||30,top=56,X=q=>cw/2+L.cols.findIndex(x=>x[0]===q)*cw,y=top+cur*rh+rh/2+6;
  if(st.f===st.t){c.setAttribute('cx',X(st.f)-cw/2+18+(cw-36)*fr);c.setAttribute('cy',y-6);}else{c.setAttribute('cx',X(st.f)+(X(st.t)-X(st.f))*fr);c.setAttribute('cy',y);}
  c.classList.toggle('bad',!!st.bad);}
/* trình phát dùng chung: P={t,dur,hold} trả về {i,fr,end} */
function sPlay(P,L,dt,spd){const n=L.steps.length,du=P.dur||1.1;if(!SCS.pause)P.t+=dt*(spd||1);const tot=n*du+(P.hold||2.5);if(P.t>tot)P.t=0;const i=Math.min(n,Math.floor(P.t/du));return {i,fr:i<n?(P.t-i*du)/du:1,end:i>=n};}
function sLadLog(L,i){const ms=L.steps.slice(0,Math.min(L.steps.length,i+1)).map((s,k)=>({t:k*(L.du||1.1),p:s.p,m:s.m,a:s.a||'',d:s.d||''}));const sl=ms.slice(-12);return sLog(sl,sl.length-1);}
function sLog(list,cur){if(!list||!list.length)return '<p class="hint">Chưa có bản tin.</p>';
  return `<ol class="u3log ndlog sclog">${list.map((m,i)=>`<li class="${i===cur?'ndcur':''}${m.bad?' scbadl':''}"><span class="u3t">${nF(m.t,1)} s</span><span class="ndpr scpr-${String(m.p).replace(/[^A-Za-z0-9]/g,'')}">${nE(m.p)}</span> <b>${nE(m.m)}</b> <span class="u3msg">${nE(m.a)}</span>${m.d?`<br><span class="note">${nE(m.d)}</span>`:''}</li>`).join('')}</ol>`;}
function sCtlBtns(vw,extra){return `<div class="row scrow"><button type="button" class="btn sm" data-sca="${vw}:play" data-scplay>${SCS.pause?'▶ Chạy':'⏸ Dừng'}</button><button type="button" class="btn sm" data-sca="${vw}:prev">⏮ Lùi</button><button type="button" class="btn sm" data-sca="${vw}:next">⏭ Tiến</button><button type="button" class="btn sm" data-sca="${vw}:rst">⟲ Về đầu</button>${extra||''}<span class="note" id="scT-${vw}"></span></div>`;}
/* liên kết sang thẻ khác */
const SCLK={
  aka:{e2:[['reg','sa'],['reg','nsa'],['reg','g4'],['reg','g3']],kpi:['s_suci','s_synch','s_macf','s_sucif'],tab:[['core','Mạng lõi'],['rm','Roaming']]},
  key:{e2:[['reg','sa'],['ho','sa'],['data','sa']],kpi:['s_smc','s_suci'],tab:[['hx','Chuyển giao'],['stack','Giao thức và fronthaul']]},
  roam:{e2:[['roam','sa'],['roam','g4'],['roam','g3']],kpi:['s_sepp','s_sig'],tab:[['rm','Roaming'],['fw','Tường lửa']]},
  tnl:{e2:[['data','sa'],['data','g4']],kpi:['s_ike','s_vpn','s_cert'],tab:[['tx','Truyền dẫn'],['fw','Tường lửa'],['stack','Giao thức và fronthaul']]},
  fbs:{e2:[['reg','g4'],['reg','sa'],['idle','sa']],kpi:['s_suci','s_ddos','s_sig'],tab:[['fw','Tường lửa'],['al','Cảnh báo, sự cố']]},
  vd:{e2:[['reg','sa'],['roam','sa'],['data','sa']],kpi:[],tab:[['rm','Roaming'],['fw','Tường lửa'],['tx','Truyền dẫn']]}
};
const SCT={g3:'3G',g4:'4G',nsa:'5G NSA',sa:'5G SA'};
function scLinks(){
  const L=SCLK[SCS.v]||{e2:[],kpi:[],tab:[]},hasE2=typeof E2S!=='undefined',hasK=typeof KL!=='undefined';
  const e2=hasE2?L.e2.map(([id,tk])=>{const s=E2S.find(x=>x.id===id);return s&&s.f&&s.f[tk]?[s,tk]:null;}).filter(Boolean):[];
  const kp=hasK?L.kpi.map(id=>KL.find(k=>k.id===id)).filter(Boolean):[];
  return `<div class="panel u3lk"><h3>Xem tiếp ở thẻ khác</h3>
  ${e2.length?`<p class="e2x"><b>Luồng ở thẻ Toàn trình E2E</b> (mở sẵn đúng công nghệ):</p><div class="e2go">${e2.map(([s,tk])=>`<button type="button" class="btn sm" data-scgo="e2:${s.id}:${tk}">${nE(s.n)} · ${SCT[tk]} →</button>`).join('')}</div>`:''}
  ${kp.length?`<p class="e2x" style="margin-top:10px"><b>KPI liên quan ở thẻ KPI mạng</b> (công thức, bộ đếm ba vendor):</p><div class="e2go">${kp.map(k=>`<button type="button" class="btn sm" data-scgo="kpi:${k.id}">${nE(k.nm)} →</button>`).join('')}</div>`:''}
  <p class="e2x" style="margin-top:10px"><b>Thẻ liên quan:</b></p><div class="e2go">${(L.tab||[]).map(t=>`<button type="button" class="btn sm" data-tab="${t[0]}">${nE(t[1])} →</button>`).join('')}</div>
  </div>`;
}
function scNav(){return `<div class="seg u3seg ndseg scseg" role="group" aria-label="Mục của thẻ Bảo mật và xác thực">${SCV.map((v,i)=>`<button type="button" data-scv="${v[0]}" aria-pressed="${v[0]===SCS.v}"><span class="ndn">${i+1}</span>${v[1]}</button>`).join('')}</div>`;}
function renderSc(){
  const nav=$('#scNav'),body=$('#scBody');if(!nav||!body)return;
  if(!SCR[SCS.v])SCS.v='aka';
  nav.innerHTML=scNav();
  const V=SCR[SCS.v];body.innerHTML=V.html()+scLinks();
  if(V.after)V.after();
  if(S.tab==='sc'&&!nReduced())scStart();else{scStop();if(V.tick&&S.tab==='sc')V.tick(0);}
}
function scStart(){if(SCS.raf)return;SCS.last=performance.now();SCS.raf=requestAnimationFrame(scLoop);}
function scStop(){if(SCS.raf)cancelAnimationFrame(SCS.raf);SCS.raf=0;}
function scLoop(now){
  SCS.raf=0;if(S.tab!=='sc')return;
  if(document.hidden){SCS.last=now;SCS.raf=requestAnimationFrame(scLoop);return;}
  const dt=Math.max(0,Math.min(0.1,(now-SCS.last)/1000));SCS.last=now;
  const V=SCR[SCS.v];if(V&&V.tick){try{V.tick(dt);}catch(e){console.error(e);}}
  SCS.raf=requestAnimationFrame(scLoop);
}
function scPauseBtns(){document.querySelectorAll('#t-sc [data-scplay]').forEach(b=>b.textContent=SCS.pause?'▶ Chạy':'⏸ Dừng');}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-scgo]');
  if(g){const [t,id,tk]=g.dataset.scgo.split(':');
    try{tourStop();}catch(x){}try{stopSig();}catch(x){}
    const top=()=>window.scrollTo({top:Math.min(window.scrollY,$('main').offsetTop-$('.bar').offsetHeight)});
    if(t==='e2'){try{e2Stop();}catch(x){}S.e2Sc=id;S.e2R=tk||'sa';S.e2M=S.mode;if(typeof E2A!=='undefined'){E2A.key='';E2A.i=0;}S.tab='e2';renderAll();top();}
    else if(t==='kpi'){S.tab='kpi';KP.tech='all';KP.ly='all';KP.cat='all';KP.q='';KP.node='';KP.sel=id;kpSig='';renderAll();setTimeout(()=>{const d=$('#kpDet');if(d)d.scrollIntoView({block:'start',behavior:'smooth'});},60);}
    else if(t==='sc'){S.tab='sc';if(id)SCS.v=id;renderAll();top();}
    return;}
  const t=e.target.closest('#t-sc [data-scv],#t-sc [data-sca]');if(!t)return;
  if(t.dataset.scv){if(t.dataset.scv===SCS.v)return;SCS.v=t.dataset.scv;scStop();renderSc();return;}
  const [vw,a]=t.dataset.sca.split(':');
  if(a==='play'){SCS.pause=!SCS.pause;scPauseBtns();return;}
  const V=SCR[vw];if(V&&V.act)V.act(a,t);
});
function scInp(el){const [vw,k]=el.dataset.sci.split(':');const P=SCP[vw];if(!P)return;
  P[k]=el.type==='checkbox'?el.checked:el.type==='text'?el.value:(el.tagName==='SELECT'&&isNaN(+el.value)?el.value:+el.value);
  const o=el.parentElement.querySelector('output');if(o&&SCF[vw+':'+k])o.textContent=SCF[vw+':'+k](P[k]);
  const V=SCR[vw];if(V&&V.upd)V.upd(k);}
document.addEventListener('input',e=>{const el=e.target;if(!el.dataset||!el.dataset.sci||el.type!=='range')return;scInp(el);});
document.addEventListener('change',e=>{const el=e.target;if(!el.dataset||!el.dataset.sci||el.type==='range')return;scInp(el);});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest&&e.target.closest('#t-sc [data-sca]')&&e.target.tagName!=='BUTTON'&&e.target.tagName!=='INPUT'){e.preventDefault();e.target.closest('[data-sca]').dispatchEvent(new MouseEvent('click',{bubbles:true}));}});

/* ---------- Mục 1: 5G-AKA, EAP-AKA′, SUPI/SUCI, so với EPS-AKA và UMTS AKA ---------- */
SCP.aka={meth:'5g',fault:'none',sch:'A',mcc:'001',mnc:'01',msin:'0123456789',k:'465B5CE8B199B49FAA5F0A2EE238A6BC',sqn:'00000000A3F1',spd:1};
const SCA={t:0,i:-1,L:null,V:null};
const SCAM=[['5g','5G-AKA (5G SA)'],['eap','EAP-AKA′ (5G SA)'],['eps','EPS-AKA (4G LTE)'],['umts','UMTS AKA (3G)']];
const SCAF=[['none','Bình thường (thành công)'],['synch','Synch failure: SQN lệch (AUTS)'],['mac','MAC failure: mạng không xác thực được'],['res','RES*/RES sai: UE không qua xác thực'],['suci','UDM không giải mã được SUCI']];
const OPC=sFromHex('CD63CB71954A9F4E48A5994E37A02BAF');
/* hàm f1…f5 minh hoạ (thay MILENAGE/TUAK): HMAC-SHA-256(K, nhãn || OPc || dữ liệu) cắt ngắn */
const sF=(K,tag,data,n)=>sHmac(K,sCat(sUtf(tag),OPC,data)).slice(0,n);
function sPrfP(K,S,n){const o=[];let T=new Uint8Array(0),i=1,len=0;while(len<n){T=sHmac(K,sCat(T,S,Uint8Array.of(i)));o.push(T);len+=32;i++;}return sCat(...o).slice(0,n);}
function sPlmn(mcc,mnc){const c=mcc.padEnd(3,'0'),n=mnc.length===2?mnc+'F':mnc;return Uint8Array.of(parseInt(c[1]+c[0],16),parseInt(n[2]+c[2],16),parseInt(n[1]+n[0],16));}
function scKey16(h){let b=sFromHex(h);if(b.length<16){const o=new Uint8Array(16);o.set(b,16-b.length);b=o;}return b.slice(0,16);}
function scVec(){const P=SCP.aka,mcc=(P.mcc.replace(/\D/g,'')+'001').slice(0,3),mnc=(P.mnc.replace(/\D/g,'')||'01').slice(0,3),msin=(P.msin.replace(/\D/g,'')||'0123456789').slice(0,10);
  const K=scKey16(P.k),imsi=mcc+mnc+msin,supi='imsi-'+imsi,snn='5G:mnc'+mnc.padStart(3,'0')+'.mcc'+mcc+'.3gppnetwork.org';
  let sqnB=sFromHex(P.sqn);if(sqnB.length<6){const o=new Uint8Array(6);o.set(sqnB,6-sqnB.length);sqnB=o;}sqnB=sqnB.slice(-6);
  const R=sSeedBytes('RAND|'+sHex(K)+'|'+sHex(sqnB)+'|'+P.meth,16),AMF=Uint8Array.of(0x80,0x00);
  const mk=(K2,R2,sq)=>{const ak=sF(K2,'f5',R2,6),mac=sF(K2,'f1',sCat(sq,R2,AMF),8),res=sF(K2,'f2',R2,8),ck=sF(K2,'f3',R2,16),ik=sF(K2,'f4',R2,16),sxa=sXor(sq,ak);return {ak,mac,res,ck,ik,sxa,autn:sCat(sxa,AMF,mac)};};
  const V={K,mcc,mnc,msin,imsi,supi,snn,sqn:sqnB,rand:R,AMF};Object.assign(V,mk(K,R,sqnB));
  const ckik=sCat(V.ck,V.ik);
  V.xresS=sKdf(ckik,0x6B,sUtf(snn),R,V.res).slice(16);V.hxres=sSha(sCat(R,V.xresS)).slice(16);
  V.kausf5=sKdf(ckik,0x6A,sUtf(snn),V.sxa);
  const ckp=sKdf(ckik,0x20,sUtf(snn),V.sxa);V.ckp=ckp.slice(0,16);V.ikp=ckp.slice(16);
  V.mk=sPrfP(sCat(V.ikp,V.ckp),sCat(sUtf("EAP-AKA'"),sUtf('0'+imsi+'@nai.5gc.mnc'+mnc.padStart(3,'0')+'.mcc'+mcc+'.3gppnetwork.org')),208);V.kausfE=V.mk.slice(144,176);
  V.kausf=P.meth==='eap'?V.kausfE:V.kausf5;V.kseaf=sKdf(V.kausf,0x6C,sUtf(snn));V.abba=Uint8Array.of(0,0);V.kamf=sKdf(V.kseaf,0x6D,sUtf(imsi),V.abba);
  V.kasme=sKdf(ckik,0x10,sPlmn(mcc,mnc),V.sxa);
  /* phía UE: lỗi được chèn tại đây */
  const Kue=P.fault==='mac'?scKey16(sHex(sXor(K,Uint8Array.of(0x5A)))):K;const ue=mk(Kue,R,sqnB);V.xmac=ue.mac;V.macOk=sHex(ue.mac)===sHex(V.mac);
  V.resUe=ue.res;const snnUe=P.fault==='res'?'5G:mnc'+String((+mnc+1)%1000).padStart(3,'0')+'.mcc'+mcc+'.3gppnetwork.org':snn;
  V.resS=sKdf(sCat(ue.ck,ue.ik),0x6B,sUtf(snnUe),R,ue.res).slice(16);V.hres=sSha(sCat(R,V.resS)).slice(16);V.resOk=sHex(V.resS)===sHex(V.xresS);
  if(P.fault==='res'){V.resUe=sXor(ue.res,Uint8Array.of(1));}
  /* đồng bộ lại: USIM đã thấy SQN cao hơn */
  const sqnMs=Uint8Array.from(sqnB);sqnMs[5]=(sqnMs[5]+0x40)&255;if(sqnMs[5]<sqnB[5])sqnMs[4]=(sqnMs[4]+1)&255;V.sqnMs=sqnMs;
  const akS=sF(K,'f5*',R,6),macS=sF(K,'f1*',sCat(sqnMs,R,Uint8Array.of(0,0)),8);V.auts=sCat(sXor(sqnMs,akS),macS);
  /* SUCI: ECIES Profile A (X25519 thật; mã hoá dòng khoá minh hoạ thay AES-128-CTR) */
  const hnPriv=sSeedBytes('HN-PRIV|'+mcc+mnc,32),hnPub=sX25519(hnPriv,S_BASE),ePriv=sSeedBytes('EPH|'+imsi+'|'+P.sch+'|'+sHex(R),32),ePub=sX25519(ePriv,S_BASE);
  const z=sX25519(ePriv,hnPub),kd=sX963(z,ePub,64),encK=kd.slice(0,16),icb=kd.slice(16,32),macK=kd.slice(32,64),plain=sBcd(msin),ct=sCtr(encK,icb,plain),tag=sHmac(macK,ct).slice(0,8);
  V.hnPub=hnPub;V.ePub=ePub;V.z=z;V.ct=ct;V.tag=tag;V.plain=plain;
  const pid={null:0,A:1,B:2}[P.sch];V.kid=P.sch==='null'?0:1;
  V.schOut=P.sch==='null'?plain:sCat(P.sch==='B'?sCat(Uint8Array.of(0x02),ePub):ePub,ct,tag);
  V.suci='suci-0-'+mcc+'-'+mnc+'-0000-'+pid+'-'+V.kid+'-'+sHex(V.schOut);
  /* UDM/SIDF giải mã */
  const hnPrivUdm=P.fault==='suci'?sSeedBytes('HN-PRIV-CU|'+mcc+mnc,32):hnPriv,z2=sX25519(hnPrivUdm,ePub),kd2=sX963(z2,ePub,64),tag2=sHmac(kd2.slice(32,64),ct).slice(0,8);
  V.deOk=P.sch==='null'||sHex(tag2)===sHex(tag);V.deMsin=V.deOk?(P.sch==='null'?msin:sUnBcd(sCtr(kd2.slice(0,16),kd2.slice(16,32),ct))):'—';V.tag2=tag2;
  return V;}
const sSt=(f,t,p,s,m,a,d,o)=>Object.assign({f,t,p,s,m:m||s,a:a||'',d:d||''},o||{});
function scAkaSteps(V){const P=SCP.aka,F=P.fault,M=P.meth;
  if(M==='5g'||M==='eap'){const E=M==='eap',L={cols:[['ue','UE (USIM + ME)','ue'],['gnb','gNB','ran'],['amf','AMF / SEAF','core'],['ausf','AUSF','core'],['udm','UDM / ARPF / SIDF','core']],cw:156},S=[];
    S.push(sSt('ue','ue','USIM',P.sch==='null'?'SUCI null-scheme':'ME tạo SUCI (ECIES)','Tạo SUCI từ SUPI',P.sch==='null'?'Null-scheme: MSIN để rõ':'Profile '+P.sch+': khoá công khai nhà mạng nhà, khoá tạm thời của UE','SUCI che MSIN bằng mã hoá công khai (ECIES). Mỗi lần đăng ký tạo khoá tạm thời mới nên hai SUCI của cùng một thuê bao khác nhau, kẻ nghe lén không liên kết được.',{v:['suci']}));
    S.push(sSt('ue','gnb','RRC','RRCSetupComplete','RRCSetupComplete (dedicatedNAS: Registration Request)','UE → gNB','NAS đi trong RRC, chưa có bảo vệ AS.'));
    S.push(sSt('gnb','amf','NGAP','Initial UE Message','Initial UE Message (Registration Request, SUCI)','gNB → AMF','5GS mobile identity = SUCI, ngKSI = 7 (chưa có khoá), UE security capabilities.'));
    S.push(sSt('amf','ausf','SBI','Authenticate Req (SUCI, SNN)','Nausf_UEAuthentication_Authenticate Request','AMF/SEAF → AUSF','Gửi SUCI và serving network name '+V.snn+'. SN name ràng buộc khoá vào mạng phục vụ: mạng khác không dùng lại được vector.',{v:['snn']}));
    S.push(sSt('ausf','udm','SBI','Get Req (SUCI, SNN)','Nudm_UEAuthentication_Get Request','AUSF → UDM','AUSF kiểm tra mạng phục vụ có được phép dùng SN name này.'));
    if(F==='suci'&&P.sch!=='null'){S.push(sSt('udm','udm','SIDF','SIDF: MAC ECIES sai','SIDF không giải mã được SUCI','UDM','Thẻ SIM dùng khoá công khai/key id khác khoá riêng ở SIDF (ví dụ đổi khoá chưa đồng bộ lô SIM). MAC tag ECIES không khớp.',{bad:1,v:['supi']}));
      S.push(sSt('udm','ausf','SBI','Get Resp: lỗi','Nudm_UEAuthentication_Get Response (lỗi)','UDM → AUSF','Mã lỗi HTTP/ProblemDetails tuỳ triển khai (cần đối chiếu).',{bad:1}));
      S.push(sSt('ausf','amf','SBI','Authenticate Resp: lỗi','Nausf_UEAuthentication_Authenticate Response (lỗi)','AUSF → AMF','',{bad:1}));
      S.push(sSt('amf','ue','NAS','Registration Reject','Registration Reject','AMF → UE','5GMM cause tuỳ triển khai (cần đối chiếu). KPI: tỉ lệ giải mã SUCI lỗi tăng theo lô SIM hoặc key id.',{bad:1}));
      L.steps=S;return L;}
    S.push(sSt('udm','udm','SIDF','SIDF giải mã SUCI → SUPI','SIDF giải mã SUCI','UDM','Dùng khoá riêng nhà mạng nhà (thường lưu trong HSM). Ra SUPI '+V.supi+'.',{v:['supi']}));
    S.push(sSt('udm','udm','ARPF',E?'ARPF tạo AV′ (CK′, IK′)':'ARPF tạo 5G HE AV','ARPF chọn '+(E?'EAP-AKA′':'5G-AKA')+' theo dữ liệu thuê bao, tạo vector',E?'RAND, AUTN, XRES, CK′, IK′':'RAND, AUTN, XRES*, KAUSF','SQN tăng mỗi lần tạo vector; AUTN = (SQN ⊕ AK) ‖ AMF ‖ MAC. Bit tách biệt của trường AMF = 1 cho 5G/4G.',{v:E?['rand','sqn','autn','xres','ckp','ikp']:['rand','sqn','autn','xresS','kausf']}));
    S.push(sSt('udm','ausf','SBI','Get Resp (AV, SUPI)','Nudm_UEAuthentication_Get Response','UDM → AUSF',E?'Vector EAP-AKA′ và SUPI.':'5G HE AV và SUPI.'));
    if(E){S.push(sSt('ausf','ausf','AUSF','Tính MK, KAUSF (EMSK)','AUSF tính MK = PRF′(IK′‖CK′, "EAP-AKA′"‖Identity)','AUSF','KAUSF = 256 bit đầu của EMSK (RFC 9048).',{v:['mk','kausf']}));
      S.push(sSt('ausf','amf','SBI','Authenticate Resp (EAP-Request)','Nausf_UEAuthentication_Authenticate Response','AUSF → AMF','EAP-Request/AKA′-Challenge: AT_RAND, AT_AUTN, AT_KDF, AT_KDF_INPUT (SN name), AT_MAC.'));}
    else{S.push(sSt('ausf','ausf','AUSF','Lưu XRES*, tính HXRES*, KSEAF','AUSF lưu XRES*, tính HXRES* và KSEAF','AUSF','HXRES* = 128 bit thấp của SHA-256(RAND ‖ XRES*). AUSF giữ KSEAF đến khi UE trả đúng RES*.',{v:['hxres','kseaf']}));
      S.push(sSt('ausf','amf','SBI','Authenticate Resp (5G SE AV)','Nausf_UEAuthentication_Authenticate Response','AUSF → AMF','5G SE AV = RAND, AUTN, HXRES*. Mạng khách không nhận XRES* nên không tự kết luận thay mạng nhà.'));}
    const chal=(n)=>sSt('amf','ue','NAS','Authentication Request'+(n?' (lần '+n+')':''),'Authentication Request','AMF → UE',E?'EAP message, ngKSI, ABBA':'RAND, AUTN, ngKSI, ABBA');
    S.push(chal());
    if(F==='synch'){S.push(sSt('ue','ue','USIM','USIM: SQN ngoài dải → AUTS','USIM kiểm tra MAC đúng nhưng SQN không hợp lệ','UE','SQN trong AUTN không lớn hơn SQN USIM đã thấy (hoặc ngoài cửa sổ Δ). USIM tạo AUTS = (SQN_MS ⊕ AK*) ‖ MAC-S.',{bad:1,v:['xmac','auts']}));
      S.push(sSt('ue','amf','NAS',E?'Auth Response (AKA′-Sync-Failure)':'Authentication Failure (#21)',E?'Authentication Response (EAP-Response/AKA′-Synchronization-Failure, AT_AUTS)':'Authentication Failure (5GMM cause #21 Synch failure, AUTS)','UE → AMF','UE chạy T3520 (15 s).',{bad:1}));
      S.push(sSt('amf','ausf','SBI','Authenticate Req (RAND, AUTS)','Nausf_UEAuthentication_Authenticate Request (resynchronizationInfo)','AMF → AUSF',''));
      S.push(sSt('ausf','udm','SBI','Get Req (RAND, AUTS)','Nudm_UEAuthentication_Get Request (resynchronizationInfo)','AUSF → UDM',''));
      S.push(sSt('udm','udm','ARPF','ARPF đồng bộ lại SQN','ARPF kiểm tra MAC-S, lấy SQN_MS, đặt SQN_HE = SQN_MS','UDM','Nếu MAC-S sai: không đồng bộ, báo lỗi. Đúng: tạo vector mới với SQN lớn hơn SQN_MS.'));
      S.push(sSt('udm','ausf','SBI','Get Resp (AV mới)','Nudm_UEAuthentication_Get Response (vector mới)','UDM → AUSF',''));
      S.push(sSt('ausf','amf','SBI','Authenticate Resp (AV mới)','Nausf_UEAuthentication_Authenticate Response','AUSF → AMF',''));
      S.push(chal(2));
      S.push(sSt('ue','ue','USIM','USIM: MAC, SQN đúng','USIM kiểm tra lại: hợp lệ','UE','',{v:['res']}));}
    else if(F==='mac'){S.push(sSt('ue','ue','USIM','USIM: XMAC ≠ MAC','USIM tính XMAC khác MAC trong AUTN','UE','Mạng không chứng minh được biết K: K/OPc ở ARPF khác USIM (lô SIM sai) hoặc trạm giả phát lại AUTN sửa đổi.',{bad:1,v:['xmac']}));
      S.push(sSt('ue','amf','NAS','Authentication Failure (#20)','Authentication Failure (5GMM cause #20 MAC failure)','UE → AMF','UE chạy T3520.',{bad:1}));
      S.push(sSt('amf','ue','NAS','Identity Request (SUCI)','Identity Request','AMF → UE','AMF có thể hỏi lại danh tính để loại trừ nhầm GUTI. UE chỉ trả SUCI, không bao giờ trả SUPI.'));
      S.push(sSt('ue','amf','NAS','Identity Response (SUCI)','Identity Response','UE → AMF','SUCI mới (khoá tạm thời mới).'));
      S.push(sSt('amf','ausf','SBI','Authenticate Req','Nausf_UEAuthentication_Authenticate Request','AMF → AUSF','Lấy vector mới.'));
      S.push(sSt('ausf','amf','SBI','Authenticate Resp','Nausf_UEAuthentication_Authenticate Response','AUSF → AMF',''));
      S.push(chal(2));
      S.push(sSt('ue','ue','USIM','MAC failure lần nữa','USIM: MAC vẫn sai','UE','',{bad:1}));
      S.push(sSt('ue','amf','NAS','Authentication Failure (#20)','Authentication Failure (#20)','UE → AMF','',{bad:1}));
      S.push(sSt('ue','ue','ME','Cell bị coi là chặn','UE coi mạng không qua kiểm tra xác thực','UE','UE coi cell hiện tại bị chặn (barred) và chọn cell/mạng khác. Đây cũng là dấu hiệu trạm giả (mục 5).',{bad:1}));L.steps=S;return L;}
    else S.push(sSt('ue','ue','USIM','USIM: kiểm tra MAC, SQN → RES','USIM kiểm tra MAC và SQN, tính RES, CK, IK','UE','Xác thực mạng: chỉ ai có K mới tạo được MAC đúng.',{v:['xmac','res']}));
    if(F==='res'){S.push(sSt('ue','ue','ME',E?'ME tính AT_RES sai':'ME tính RES* với SN name sai','ME tính '+(E?'RES':'RES*')+' sai','UE','Ví dụ ME cấu hình sai PLMN nên SN name khác; hoặc một bên thứ ba trả lời thay UE.',{bad:1,v:['resS']}));
      S.push(sSt('ue','amf','NAS','Authentication Response','Authentication Response',E?'EAP-Response (AT_RES)':'RES*','UE → AMF'));
      if(!E)S.push(sSt('amf','amf','SEAF','SEAF: HRES* ≠ HXRES*','SEAF tính HRES* và so với HXRES*','AMF','Không khớp: SEAF coi xác thực thất bại, vẫn chuyển RES* lên AUSF để mạng nhà kết luận.',{bad:1,v:['hres']}));
      S.push(sSt('amf','ausf','SBI','Authenticate Req ('+(E?'EAP-Response':'RES*')+')','Nausf_UEAuthentication_Authenticate Request','AMF → AUSF',''));
      S.push(sSt('ausf','ausf','AUSF',E?'AT_RES ≠ XRES':'RES* ≠ XRES*','AUSF so sánh','AUSF','',{bad:1}));
      S.push(sSt('ausf','udm','SBI','ResultConfirmation (thất bại)','Nudm_UEAuthentication_ResultConfirmation','AUSF → UDM','Ghi kết quả thất bại cho thuê bao.'));
      S.push(sSt('ausf','amf','SBI','Authenticate Resp (thất bại)','Nausf_UEAuthentication_Authenticate Response',E?'EAP-Failure':'AUTHENTICATION_FAILURE','AUSF → AMF'));
      S.push(sSt('amf','ue','NAS','Authentication Reject','Authentication Reject','AMF → UE','UE coi USIM không hợp lệ với 5GS đến khi tắt máy hoặc tháo SIM, xoá GUTI, ngKSI.',{bad:1}));L.steps=S;return L;}
    if(!E)S.push(sSt('ue','ue','ME','ME tính RES*, KAUSF, KSEAF','ME tính RES*, KAUSF, KSEAF','UE','UE tự tính cùng khoá với mạng, không bao giờ gửi K hay CK/IK qua giao diện vô tuyến.',{v:['resS']}));
    else S.push(sSt('ue','ue','ME','ME tính CK′, IK′, MK, KAUSF','ME tính CK′, IK′, MK và KAUSF','UE','',{v:['resS']}));
    S.push(sSt('ue','amf','NAS','Authentication Response','Authentication Response',E?'EAP-Response/AKA′-Challenge (AT_RES, AT_MAC)':'RES*','UE → AMF'));
    if(!E)S.push(sSt('amf','amf','SEAF','SEAF: HRES* = HXRES*','SEAF tính HRES* và so với HXRES*','AMF','Khớp: xác thực tại mạng khách thành công.',{v:['hres']}));
    S.push(sSt('amf','ausf','SBI','Authenticate Req ('+(E?'EAP-Response':'RES*')+')','Nausf_UEAuthentication_Authenticate Request','AMF → AUSF',''));
    S.push(sSt('ausf','ausf','AUSF',E?'AT_RES = XRES, AT_MAC đúng':'RES* = XRES* (mạng nhà xác nhận)','AUSF kiểm tra','AUSF','Mạng nhà là bên kết luận cuối cùng: điểm mới so với 4G (MME tự so RES/XRES).'));
    S.push(sSt('ausf','udm','SBI','ResultConfirmation','Nudm_UEAuthentication_ResultConfirmation','AUSF → UDM','SUPI, thời điểm, SN name, kết quả (chống gian lận roaming).'));
    S.push(sSt('ausf','amf','SBI','Authenticate Resp (SUPI, KSEAF)','Nausf_UEAuthentication_Authenticate Response','AUSF → AMF',E?'EAP-Success, KSEAF, SUPI':'Kết quả, SUPI, KSEAF',{v:E?['kseaf']:[]}));
    S.push(sSt('amf','amf','SEAF','KAMF = KDF(KSEAF, SUPI, ABBA)','SEAF tính KAMF','AMF','Xong xác thực. Bước tiếp là NAS Security Mode Command (mục 2).',{v:['kamf']}));
    S.push(sSt('amf','ue','NAS','Security Mode Command →','NAS Security Mode Command'+(E?' (kèm EAP-Success)':''),'AMF → UE','Xem mục 2: chọn NEA/NIA, bật bảo vệ NAS.',{ok:1}));
    L.steps=S;return L;}
  if(M==='eps'){const L={cols:[['ue','UE (USIM)','ue'],['enb','eNB','ran'],['mme','MME','core'],['hss','HSS / AuC','core']],cw:170},S=[];
    S.push(sSt('ue','enb','RRC','RRCConnectionSetupComplete','RRCConnectionSetupComplete (Attach Request)','UE → eNB',''));
    S.push(sSt('enb','mme','S1AP','Initial UE Message (IMSI)','Initial UE Message (Attach Request: IMSI hoặc GUTI)','eNB → MME','Lần đầu hoặc GUTI không dùng được: IMSI gửi rõ trên vô tuyến, trước mọi bảo vệ. Đây là chỗ IMSI catcher khai thác.',{v:['imsi']}));
    const air=(r)=>sSt('mme','hss','Diameter','AIR'+(r?' (Re-Sync-Info)':''),'Authentication-Information-Request (S6a)'+(r?' kèm Re-Synchronization-Info (RAND ‖ AUTS)':''),'MME → HSS','IMSI, Visited-PLMN-Id, số vector yêu cầu');
    S.push(air());
    S.push(sSt('hss','hss','AuC','AuC tạo EPS AV','AuC tạo RAND, AUTN, XRES, KASME','HSS','KASME = KDF(CK‖IK, SN id, SQN ⊕ AK). Vector có thể tạo sẵn nhiều bộ.',{v:['rand','sqn','autn','xres','kasme']}));
    S.push(sSt('hss','mme','Diameter','AIA (EPS AV)','Authentication-Information-Answer','HSS → MME','MME nhận cả XRES và KASME: mạng khách tự kết luận.'));
    const chal=(n)=>sSt('mme','ue','NAS','Authentication Request'+(n?' (lần 2)':''),'Authentication Request','MME → UE','RAND, AUTN, KSIASME');
    S.push(chal());
    if(F==='synch'){S.push(sSt('ue','ue','USIM','USIM: SQN ngoài dải → AUTS','USIM: Synch failure','UE','',{bad:1,v:['xmac','auts']}));S.push(sSt('ue','mme','NAS','Authentication Failure (#21)','Authentication Failure (EMM cause #21, AUTS)','UE → MME','UE chạy T3420.',{bad:1}));S.push(air(1));S.push(sSt('hss','hss','AuC','Đồng bộ lại SQN','AuC kiểm tra MAC-S, đặt lại SQN','HSS',''));S.push(sSt('hss','mme','Diameter','AIA (vector mới)','Authentication-Information-Answer','HSS → MME',''));S.push(chal(2));S.push(sSt('ue','ue','USIM','USIM: hợp lệ → RES','USIM kiểm tra lại: hợp lệ','UE','',{v:['res']}));}
    else if(F==='mac'){S.push(sSt('ue','ue','USIM','USIM: XMAC ≠ MAC','USIM: MAC failure','UE','',{bad:1,v:['xmac']}));S.push(sSt('ue','mme','NAS','Authentication Failure (#20)','Authentication Failure (EMM cause #20)','UE → MME','UE chạy T3418.',{bad:1}));S.push(sSt('mme','ue','NAS','Identity Request (IMSI)','Identity Request (IMSI)','MME → UE','4G: UE trả IMSI rõ. Kẻ giả mạo cũng làm vậy để thu IMSI.',{bad:1}));S.push(sSt('ue','mme','NAS','Identity Response (IMSI rõ)','Identity Response','UE → MME','IMSI không mã hoá.',{bad:1}));S.push(chal(2));S.push(sSt('ue','ue','USIM','MAC failure lần nữa → cell bị chặn','USIM: MAC vẫn sai','UE','',{bad:1}));L.steps=S;return L;}
    else S.push(sSt('ue','ue','USIM','USIM: MAC, SQN → RES, CK, IK','USIM kiểm tra, ME tính KASME','UE','',{v:['xmac','res']}));
    if(F==='res'){S.push(sSt('ue','mme','NAS','Authentication Response (RES sai)','Authentication Response','UE → MME','',{bad:1}));S.push(sSt('mme','mme','MME','RES ≠ XRES','MME so RES với XRES','MME','',{bad:1}));S.push(sSt('mme','ue','NAS','Authentication Reject','Authentication Reject','MME → UE','UE coi USIM không hợp lệ cho EPS.',{bad:1}));L.steps=S;return L;}
    S.push(sSt('ue','mme','NAS','Authentication Response (RES)','Authentication Response','UE → MME','RES'));
    S.push(sSt('mme','mme','MME','RES = XRES','MME so RES với XRES (mạng khách tự quyết)','MME','Khác 5G: mạng nhà không nhận xác nhận kết quả.'));
    S.push(sSt('mme','ue','NAS','Security Mode Command →','NAS Security Mode Command (EEA/EIA)','MME → UE','Tương tự mục 2 nhưng khoá gốc là KASME.',{ok:1}));L.steps=S;return L;}
  /* UMTS AKA */
  const L={cols:[['ue','UE (USIM)','ue'],['rnc','NodeB / RNC','ran'],['vlr','MSC / SGSN (VLR)','core'],['hlr','HLR / AuC','core']],cw:170},S=[];
  S.push(sSt('ue','vlr','MM','Location Updating Request (IMSI)','Location Updating / Attach Request (IMSI hoặc TMSI)','UE → MSC/SGSN','IMSI gửi rõ khi chưa có TMSI.',{v:['imsi']}));
  const sai=r=>sSt('vlr','hlr','MAP','MAP SendAuthInfo'+(r?' (Re-sync)':''),'MAP Send Authentication Info'+(r?' (Re-synchronisation Info: RAND, AUTS)':''),'VLR → HLR','IMSI');
  S.push(sai());
  S.push(sSt('hlr','hlr','AuC','AuC tạo bộ 5 (quintet)','AuC tạo RAND, XRES, CK, IK, AUTN','HLR','Thường tạo nhiều bộ một lần, VLR dùng dần.',{v:['rand','sqn','autn','xres','ck']}));
  S.push(sSt('hlr','vlr','MAP','SendAuthInfo Ack (quintets)','MAP Send Authentication Info Ack','HLR → VLR','CK, IK gửi sang mạng khách qua SS7/MAP, thường không mã hoá.'));
  const chal=n=>sSt('vlr','ue','MM','Authentication Request'+(n?' (lần 2)':''),'Authentication Request','VLR → UE','RAND, AUTN');
  S.push(chal());
  if(F==='synch'){S.push(sSt('ue','ue','USIM','USIM: SQN ngoài dải → AUTS','USIM: Synch failure','UE','',{bad:1,v:['xmac','auts']}));S.push(sSt('ue','vlr','MM','Authentication Failure (#21)','Authentication Failure (cause #21 Synch failure, AUTS)','UE → VLR','',{bad:1}));S.push(sai(1));S.push(sSt('hlr','hlr','AuC','Đồng bộ lại SQN','AuC kiểm tra MAC-S','HLR',''));S.push(sSt('hlr','vlr','MAP','SendAuthInfo Ack (mới)','MAP Send Authentication Info Ack','HLR → VLR',''));S.push(chal(2));S.push(sSt('ue','ue','USIM','USIM: hợp lệ → RES','USIM kiểm tra lại','UE','',{v:['res']}));}
  else if(F==='mac'){S.push(sSt('ue','ue','USIM','USIM: XMAC ≠ MAC','USIM: MAC failure','UE','',{bad:1,v:['xmac']}));S.push(sSt('ue','vlr','MM','Authentication Failure (#20)','Authentication Failure (cause #20 MAC failure)','UE → VLR','',{bad:1}));S.push(sSt('ue','ue','USIM','Cell bị coi là chặn','UE coi mạng không qua kiểm tra','UE','',{bad:1}));L.steps=S;return L;}
  else S.push(sSt('ue','ue','USIM','USIM: MAC, SQN → RES, CK, IK','USIM kiểm tra','UE','',{v:['xmac','res']}));
  if(F==='res'){S.push(sSt('ue','vlr','MM','Authentication Response (RES sai)','Authentication Response','UE → VLR','',{bad:1}));S.push(sSt('vlr','ue','MM','Authentication Reject','Authentication Reject','VLR → UE','',{bad:1}));L.steps=S;return L;}
  S.push(sSt('ue','vlr','MM','Authentication Response (RES)','Authentication Response','UE → VLR','RES'));
  S.push(sSt('vlr','vlr','VLR','RES = XRES','VLR so RES với XRES','VLR',''));
  S.push(sSt('vlr','rnc','RANAP','Security Mode Command (CK, IK)','RANAP Security Mode Command','VLR → RNC','Gửi CK, IK và danh sách UEA/UIA cho RNC.'));
  S.push(sSt('rnc','ue','RRC','Security Mode Command','RRC Security Mode Command (UEA1/2, UIA1/2)','RNC → UE','Bảo vệ kết thúc ở RNC (không tới tận lõi).',{ok:1}));
  L.steps=S;return L;}
/* các giá trị hiển thị: khoá → [nhãn, nơi tính, hàm giá trị, phương thức] */
function scAkaRows(V){const M=SCP.aka.meth,E=M==='eap';
  const r=[['suci','SUCI','UE (ME)',()=>V.suci,'5g eap'],['snn','Serving network name','AMF/SEAF',()=>V.snn,'5g eap'],['imsi','IMSI (gửi rõ)','UE',()=>V.imsi,'eps umts'],['supi','SUPI sau giải mã','UDM/SIDF',()=>V.deOk?'imsi-'+V.mcc+V.mnc+V.deMsin:'không giải mã được (MAC '+sHex(V.tag2).slice(0,8)+'… ≠ '+sHex(V.tag).slice(0,8)+'…)','5g eap'],
   ['rand','RAND','ARPF/AuC',()=>sHex(V.rand),'all'],['sqn','SQN ⊕ AK','ARPF/AuC',()=>sHex(V.sxa),'all'],['autn','AUTN = SQN⊕AK ‖ AMF ‖ MAC','ARPF/AuC',()=>sHex(V.autn),'all'],
   ['xres','XRES (f2)','ARPF/AuC',()=>sHex(V.res),'eap eps umts'],['xresS','XRES* (KDF FC=0x6B)','ARPF',()=>sHex(V.xresS),'5g'],
   ['hxres','HXRES* = SHA-256(RAND‖XRES*)[128 bit thấp]','AUSF',()=>sHex(V.hxres),'5g'],
   ['ckp','CK′ (KDF FC=0x20)','ARPF',()=>sHex(V.ckp),'eap'],['ikp','IK′','ARPF',()=>sHex(V.ikp),'eap'],['mk','MK = PRF′(IK′‖CK′, …) (208 byte)','AUSF / ME',()=>sShort(V.mk,20),'eap'],
   ['ck','CK ‖ IK','AuC / USIM',()=>sHex(V.ck)+' ‖ '+sHex(V.ik),'umts'],
   ['kausf',E?'KAUSF = EMSK[0..255]':'KAUSF (KDF FC=0x6A)','ARPF / ME',()=>sHex(V.kausf),'5g eap'],['kseaf','KSEAF (FC=0x6C)','AUSF / ME',()=>sHex(V.kseaf),'5g eap'],
   ['kasme','KASME (FC=0x10, SN id)','HSS / ME',()=>sHex(V.kasme),'eps'],
   ['xmac','XMAC do USIM tính','USIM',()=>sHex(V.xmac)+(V.macOk?' = MAC ✓':' ≠ MAC '+sHex(V.mac)+' ✕'),'all'],
   ['auts','AUTS = SQN_MS⊕AK* ‖ MAC-S','USIM',()=>sHex(V.auts),'all'],
   ['res','RES (f2)','USIM',()=>sHex(V.resUe),'all'],['resS',E?'AT_RES':'RES* (FC=0x6B)','ME',()=>E?sHex(V.resUe):sHex(V.resS)+(V.resOk?' ✓':' ✕'),'5g eap'],['hres','HRES*','SEAF',()=>sHex(V.hres)+(V.resOk?' = HXRES* ✓':' ≠ HXRES* ✕'),'5g'],
   ['kamf','KAMF (FC=0x6D, SUPI, ABBA=0x0000)','AMF / ME',()=>sHex(V.kamf),'5g eap']];
  return r.filter(x=>x[4]==='all'||x[4].split(' ').includes(M));}
function scAkaVals(){const L=SCA.L,V=SCA.V,i=SCA.i,shown=new Set();L.steps.forEach((s,k)=>{if(k<=i&&s.v)s.v.forEach(x=>shown.add(x));});
  return `<table class="ndtb sctb scvals"><thead><tr><th>Giá trị</th><th>Nơi tính</th><th>Hex</th></tr></thead><tbody>${scAkaRows(V).map(r=>{const on=shown.has(r[0]);return `<tr class="${on?'scon':'scoff'}"><td>${nE(r[1])}</td><td>${nE(r[2])}</td><td>${on?sCode(r[3]()):'<span class="note">chưa tới bước</span>'}</td></tr>`;}).join('')}</tbody></table>`;}
function scSuciBox(V){const P=SCP.aka;if(P.meth!=='5g'&&P.meth!=='eap')return `<p class="e2d">${P.meth==='eps'?'4G':'3G'} không có SUCI: lần đầu (hoặc khi bị hỏi Identity Request) UE gửi IMSI <b>${nE(V.imsi)}</b> rõ trên vô tuyến. 4G/3G che bằng GUTI/TMSI tạm thời, nhưng trạm giả vẫn hỏi được IMSI.</p>`;
  const out=sHex(V.schOut),ep=P.sch==='null'?'':P.sch==='B'?out.slice(0,66):out.slice(0,64),rest=out.slice(ep.length),ct=P.sch==='null'?rest:rest.slice(0,-16),tg=P.sch==='null'?'':rest.slice(-16);
  return `<div class="scsuci"><span class="scf f1" title="SUPI type">0</span><span class="scf f2" title="MCC">${nE(V.mcc)}</span><span class="scf f2" title="MNC">${nE(V.mnc)}</span><span class="scf f3" title="Routing Indicator">0000</span><span class="scf f4" title="Protection scheme">${P.sch==='null'?0:P.sch==='A'?1:2}</span><span class="scf f4" title="HN public key id">${V.kid}</span>${ep?`<span class="scf f5" title="Khoá công khai tạm thời của UE">${ep.slice(0,12)}…</span>`:''}<span class="scf f6" title="MSIN đã mã hoá">${nE(ct)}</span>${tg?`<span class="scf f7" title="MAC tag 64 bit">${tg}</span>`:''}</div>
   <p class="legend"><span><i class="scfi f1"></i>Loại SUPI (0 = IMSI)</span><span><i class="scfi f2"></i>MCC, MNC (rõ)</span><span><i class="scfi f3"></i>Routing Indicator (chọn AUSF/UDM)</span><span><i class="scfi f4"></i>Scheme, key id</span><span><i class="scfi f5"></i>Khoá tạm thời UE</span><span><i class="scfi f6"></i>MSIN ${P.sch==='null'?'rõ (BCD)':'đã mã hoá'}</span>${tg?'<span><i class="scfi f7"></i>MAC 64 bit</span>':''}</p>
   <dl class="kv">${sKv('Khoá công khai nhà mạng nhà (X25519)',sCode(sShort(V.hnPub,12)))}${sKv('Bí mật chung ECDH (UE và SIDF cùng tính)',P.sch==='null'?'— (null-scheme)':sCode(sShort(V.z,12)))}${sKv('Độ dài scheme output',V.schOut.length+' byte')}</dl>
   <p class="note">${P.sch==='null'?'Null-scheme chỉ dùng khi chưa cấp khoá nhà mạng, cuộc gọi khẩn cấp không SIM, hoặc thử nghiệm: MSIN lộ như IMSI 4G.':P.sch==='A'?'Profile A: X25519, ANSI X9.63 KDF (SHA-256), AES-128-CTR, HMAC-SHA-256 cắt 64 bit. Ở đây X25519, KDF, HMAC tính thật; AES-128-CTR thay bằng dòng khoá SHA-256 minh hoạ.':'Profile B: secp256r1, khoá công khai nén 33 byte. Mô phỏng dùng X25519 cho phép tính nhưng giữ độ dài 33 byte để minh hoạ.'}</p></div>`;}
const SCAKACMP=[
 ['Danh tính trên vô tuyến','IMSI rõ khi chưa có TMSI/P-TMSI','IMSI rõ khi chưa có GUTI hoặc khi bị Identity Request','SUCI (mã hoá ECIES); không bao giờ gửi SUPI rõ'],
 ['Nơi tạo vector','HLR/AuC (bộ 5)','HSS/AuC (EPS AV)','UDM/ARPF (5G HE AV)'],
 ['Ai kết luận xác thực','VLR/SGSN của mạng khách','MME của mạng khách','AUSF mạng nhà (SEAF kiểm tra sơ bộ bằng HXRES*)'],
 ['Ràng buộc mạng phục vụ','Không','KASME gắn SN id (PLMN)','KAUSF/RES* gắn serving network name'],
 ['Khoá gốc tại mạng khách','CK, IK gửi qua MAP','KASME','KSEAF → KAMF (không gửi CK, IK)'],
 ['Phương thức','UMTS AKA','EPS-AKA (EAP-AKA′ cho truy nhập non-3GPP)','5G-AKA hoặc EAP-AKA′ (và EAP-TLS cho mạng riêng)'],
 ['Thuật toán vô tuyến','UEA1/2, UIA1/2 (Kasumi, SNOW 3G)','EEA/EIA 0–3','NEA/NIA 0–3 (thêm 256 bit đang chuẩn hoá, cần đối chiếu)'],
 ['Bảo vệ kết thúc ở','RNC','eNB (AS), MME (NAS)','gNB-CU (AS), AMF (NAS); UP integrity tuỳ chọn'],
 ['Lỗi xác thực','MM cause #20/#21','EMM cause #20/#21, T3418/T3420','5GMM cause #20/#21/#26, T3520'],
 ['Tiêu chuẩn','TS 33.102','TS 33.401','TS 33.501']];
function scAkaInfo(){const L=SCA.L,i=SCA.i,s=L.steps[Math.max(0,Math.min(L.steps.length-1,i))];if(!s)return '';
  return `<p class="e2x"><b>Bước ${Math.min(i+1,L.steps.length)}/${L.steps.length}: ${nE(s.m)}</b>${s.bad?' <span class="kpC no scbad">lỗi</span>':''}</p><p class="e2d">${nE(s.a)}${s.a&&s.d?' · ':''}${nE(s.d)}</p>`;}
function scAkaOut(){const V=SCA.V,L=SCA.L,P=SCP.aka,bad=L.steps.some(s=>s.bad),nm=L.steps.filter(s=>s.f!==s.t).length;
  return sKv('Phương thức',nE((SCAM.find(m=>m[0]===P.meth)||[])[1]))+sKv('Kết quả',bad?'<span class="scbad">thất bại / phải làm lại</span>':'<span class="scok">thành công</span>')+sKv('Số bản tin',`<span data-ndcount="${nm}">${nm}</span>`)
   +sKv('Bên kết luận',P.meth==='5g'||P.meth==='eap'?'AUSF (mạng nhà)':P.meth==='eps'?'MME (mạng khách)':'VLR (mạng khách)')+sKv('Danh tính lộ trên vô tuyến',P.meth==='5g'||P.meth==='eap'?(P.sch==='null'?'MSIN lộ (null-scheme)':'không (SUCI)'):'IMSI '+nE(V.imsi));}
function scAkaBuild(){SCA.V=scVec();SCA.L=scAkaSteps(SCA.V);SCA.L.du=1.1;}
SCR.aka={
 html(){scAkaBuild();const P=SCP.aka;SCA.i=-1;
  return `<div class="panel"><h3>Sơ đồ bản tin xác thực</h3><div class="scroll scladw" id="scAkaLadW"><div id="scAkaLad">${sLadSvg(SCA.L,-1,'a')}</div></div>${sCtlBtns('aka')}
   <p class="legend"><span><i style="background:var(--up)"></i>Bản tin đang chạy</span><span><i style="background:var(--ink)"></i>Đã qua</span><span><i style="background:var(--warn)"></i>Lỗi</span><span><i class="scfi scloci"></i>Tính toán tại chỗ</span></p></div>
  <div class="cols"><div>
   <div class="panel" id="scAkaInfo" aria-live="polite"></div>
   <div class="panel"><h3>Giá trị tính được (HMAC-SHA-256 thật, f1…f5 minh hoạ)</h3><div class="scroll" id="scAkaVals"></div><p class="note">KDF theo TS 33.220 Annex B: HMAC-SHA-256(Key, FC ‖ P0 ‖ L0 ‖ …). f1…f5 (MILENAGE/TUAK) thay bằng HMAC-SHA-256 có nhãn để gọn; đổi K, SQN, MCC/MNC sẽ thấy mọi khoá đổi theo.</p></div>
   <div class="panel"><h3>Nhật ký bản tin</h3><div id="scAkaLog"></div></div>
  </div><div>
   <div class="panel"><h3>Chọn kịch bản</h3><div class="ctl">
    ${sSel('aka','meth','Phương thức xác thực',SCAM,'','authMethod')}
    ${sSel('aka','fault','Tình huống',SCAF,'Lỗi được chèn để xem bản tin và nguyên nhân (cause) tương ứng.')}
    ${sSel('aka','sch','Bảo vệ SUCI',[['A','Profile A (X25519)'],['B','Profile B (secp256r1)'],['null','Null-scheme (không mã hoá)']],'','suciProfile')}
    ${sTxt('aka','mcc','MCC','Thử nghiệm: 001',3)}${sTxt('aka','mnc','MNC','2 hoặc 3 chữ số',3)}${sTxt('aka','msin','MSIN (9–10 chữ số)','',10)}
    ${sTxt('aka','k','Khoá K (hex 128 bit)','Chỉ có ở USIM và ARPF/AuC, không bao giờ rời khỏi hai nơi này.',32)}
    ${sTxt('aka','sqn','SQN (hex 48 bit)','',12)}
    ${sSl('aka','spd','Tốc độ chạy',0.25,3,0.25,v=>'× '+nF(v,2))}
   </div></div>
   <div class="panel"><h3>Kết quả</h3><dl class="kv" id="scAkaOut"></dl></div>
   <div class="panel"><h3>Cấu trúc SUCI</h3><div id="scSuci"></div></div>
  </div></div>
  <div class="panel"><h3>So sánh AKA 3G, 4G, 5G</h3><div class="scroll"><table class="ndtb"><thead><tr><th>Khía cạnh</th><th>UMTS AKA (3G)</th><th>EPS-AKA (4G)</th><th>5G-AKA / EAP-AKA′ (5G)</th></tr></thead><tbody>${SCAKACMP.map(r=>`<tr>${r.map((c,j)=>`<td>${j?nE(c):'<b>'+nE(c)+'</b>'}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>
  <div class="cols"><div class="panel"><h3>5G-AKA và EAP-AKA′ khác nhau ở đâu</h3><div class="u3stk">
   <div style="border-left-color:var(--up)"><b>5G-AKA</b> · bản tin NAS riêng (RAND, AUTN, RES*). SEAF kiểm tra sơ bộ bằng HXRES*, AUSF kết luận. KAUSF tính trực tiếp từ CK‖IK.</div>
   <div style="border-left-color:var(--sip)"><b>EAP-AKA′</b> · gói EAP trong NAS; AMF chỉ chuyển tiếp (pass-through). CK′, IK′ gắn SN name (AT_KDF_INPUT); KAUSF = 256 bit đầu của EMSK. Dùng chung khung EAP với Wi-Fi/non-3GPP.</div>
   <div style="border-left-color:var(--k1)"><b>Chọn phương thức</b> · UDM/ARPF quyết định theo dữ liệu đăng ký (authenticationMethod) và chính sách nhà mạng; UE phải hỗ trợ cả hai.</div></div></div>
  <div class="panel"><h3>Ba lỗi xác thực hay gặp</h3><div class="u3stk">
   <div style="border-left-color:var(--k4)"><b>Synch failure (#21, AUTS)</b> · SQN ở UDM thấp hơn SQN USIM đã thấy: sau khôi phục backup UDM/HSS, chuyển thuê bao giữa hai HSS, SIM dùng ở nhiều mạng thử. Mạng tự đồng bộ bằng AUTS; tỉ lệ cao làm tăng thời gian đăng ký.</div>
   <div style="border-left-color:var(--warn)"><b>MAC failure (#20)</b> · USIM không xác thực được mạng: K/OPc sai (lô SIM nạp sai), thuật toán khác (MILENAGE vs TUAK), hoặc trạm giả. Lỗi theo lô SIM là cấu hình; theo vùng là nghi trạm giả.</div>
   <div style="border-left-color:var(--cp)"><b>Authentication Reject</b> · RES* sai: SIM nhân bản, ME sai PLMN/SN name, chặn bởi AUSF. UE coi USIM không hợp lệ đến khi khởi động lại.</div></div></div></div>`;},
 after(){SCA.t=0;SCA.i=-1;this.draw(true);},
 draw(force){const L=SCA.L;const r=sPlay(SCA,L,0,0);const i=r.i;
  if(force||i!==SCA.i){SCA.i=i;const g=$('#scAkaLad');if(g)g.innerHTML=sLadSvg(L,i,'a');const lg=$('#scAkaLog');if(lg)lg.innerHTML=sLadLog(L,Math.min(i,L.steps.length-1));
   const inf=$('#scAkaInfo');if(inf)inf.innerHTML=scAkaInfo();const v=$('#scAkaVals');if(v)v.innerHTML=scAkaVals();const o=$('#scAkaOut');if(o&&(force||!o.innerHTML))o.innerHTML=scAkaOut();const su=$('#scSuci');if(su&&force)su.innerHTML=scSuciBox(SCA.V);
   const w=$('#scAkaLadW');if(w&&i>=0&&i<L.steps.length){const y=56+i*30;if(y<w.scrollTop+40||y>w.scrollTop+w.clientHeight-40)w.scrollTop=Math.max(0,y-w.clientHeight/2);}}
  sLadDot(L,Math.min(i,L.steps.length-1),i>=L.steps.length?1:r.fr,'a');
  const tt=$('#scT-aka');if(tt)tt.textContent=i>=L.steps.length?'Hết luồng, chạy lại sau ít giây':`Bước ${i+1}/${L.steps.length}`;},
 tick(dt){sPlay(SCA,SCA.L,dt,SCP.aka.spd);this.draw(false);},
 upd(k){if(k==='spd')return;scAkaBuild();SCA.t=0;this.draw(true);},
 act(a){const du=1.1,n=SCA.L.steps.length;if(a==='next'){SCA.t=Math.min(n*du,(Math.floor(SCA.t/du)+1)*du+0.01);}else if(a==='prev'){SCA.t=Math.max(0,(Math.floor(SCA.t/du)-1)*du+0.01);}else if(a==='rst'){SCA.t=0;}this.draw(true);}
};

/* ---------- Mục 2: Phân cấp khoá, NAS/AS Security Mode, NEA/NIA ---------- */
SCP.key={ue1:true,ue2:true,ue3:true,nasPri:'2,3,1',asPri:'2,3,1',intPri:'2,3,1',null0:false,bid:false,ul:0,hops:3,hoType:'xn',pci:101,arfcn:632628,tamper:false,replay:false,spd:1};
const SCK={t:0,i:-1,L:null,sel:'kamf',V:null,K:null};
const SCALG={0:['NEA0 / NIA0','Không mã hoá / không toàn vẹn (null)','—','Chỉ cho cuộc gọi khẩn cấp không xác thực; NIA0 cấm cho bản tin thường.'],1:['128-NEA1 / 128-NIA1','SNOW 3G','128 bit','Kế thừa UEA2/UIA2 của 3G, EEA1/EIA1 4G.'],2:['128-NEA2 / 128-NIA2','AES-128 CTR / AES-128 CMAC','128 bit','Phổ biến nhất; nhiều chip có tăng tốc phần cứng.'],3:['128-NEA3 / 128-NIA3','ZUC','128 bit','Bắt buộc ở một số thị trường; UE hỗ trợ tuỳ chọn.']};
function scKeyVec(){const sv=SCP.aka;SCP.aka=Object.assign({},sv,{meth:'5g',fault:'none'});let V;try{V=scVec();}finally{SCP.aka=sv;}return V;}
function scNeg(pri,ue,allow0){const l=pri.split(',').map(Number);if(allow0)l.push(0);return l.find(a=>a===0||ue[a]);}
function scKeys(){const P=SCP.key,V=scKeyVec(),ue={1:P.ue1,2:P.ue2,3:P.ue3},ueSeen=P.bid?{1:true,2:false,3:false}:ue;
  const nea=scNeg(P.nasPri,ueSeen,P.null0||P.bid),nia=scNeg(P.intPri,ueSeen,false)||1,aea=scNeg(P.asPri,ueSeen,P.null0||P.bid),aia=scNeg(P.intPri,ueSeen,false)||1;
  const k=V.kamf,u8=x=>Uint8Array.of(x),cnt=Uint8Array.of(P.ul>>>24&255,P.ul>>>16&255,P.ul>>>8&255,P.ul&255);
  const K={kamf:k,nasEnc:sKdf(k,0x69,u8(1),u8(nea==null?0:nea)).slice(16),nasInt:sKdf(k,0x69,u8(2),u8(nia)).slice(16),kgnb:sKdf(k,0x6E,cnt,u8(1))};
  K.rrcEnc=sKdf(K.kgnb,0x69,u8(3),u8(aea==null?0:aea)).slice(16);K.rrcInt=sKdf(K.kgnb,0x69,u8(4),u8(aia)).slice(16);K.upEnc=sKdf(K.kgnb,0x69,u8(5),u8(aea==null?0:aea)).slice(16);K.upInt=sKdf(K.kgnb,0x69,u8(6),u8(aia)).slice(16);
  K.n3iwf=sKdf(k,0x6E,cnt,u8(2));
  /* chuỗi chuyển giao */
  const pciB=p=>Uint8Array.of(p>>8&255,p&255),arB=a=>Uint8Array.of(a>>16&255,a>>8&255,a&255);let cur=K.kgnb,nh=null,ncc=0,nhPrev=K.kgnb;const hops=[];
  for(let h=1;h<=P.hops;h++){const pci=P.pci+h*7,ar=P.arfcn;let kind,base;
    if(P.hoType==='n2'||(nh&&P.hoType==='xn')){/* dọc: dùng NH mới */ if(P.hoType==='n2'){nh=sKdf(k,0x6F,nhPrev);nhPrev=nh;ncc=(ncc+1)%8;}kind='dọc (NH, NCC='+ncc+')';base=nh;}
    else{kind='ngang (KgNB cũ, NCC='+ncc+')';base=cur;}
    const kn=sKdf(base,0x70,pciB(pci),arB(ar));hops.push({h,pci,kind,k:kn,ncc});cur=kn;
    if(P.hoType==='xn'){/* Path Switch Ack mang {NH,NCC} mới cho lần sau */nh=sKdf(k,0x6F,nhPrev);nhPrev=nh;ncc=(ncc+1)%8;}}
  K.nh1=sKdf(k,0x6F,K.kgnb);
  return {V,K,nea,nia,aea,aia,hops,ue,ueSeen};}
/* cây khoá: id → [x,y,nhãn,nơi giữ,lớp,công thức,lấy giá trị] */
const SCKT={
  k:[70,40,'K','USIM, ARPF','home','Khoá bí mật dài hạn 128/256 bit, nạp vào USIM lúc sản xuất và vào ARPF. Không bao giờ truyền đi.',R=>R.V.K],
  ckik:[70,110,'CK ‖ IK','USIM, ARPF','home','f3, f4 (MILENAGE/TUAK) từ K và RAND.',R=>sCat(R.V.ck,R.V.ik)],
  kausf:[70,180,'KAUSF','ME, AUSF','home','5G-AKA: KDF(CK‖IK, FC=0x6A, SN name, SQN⊕AK). EAP-AKA′: 256 bit đầu của EMSK. AUSF có thể giữ để dùng lại (SoR, UPU, AKMA).',R=>R.V.kausf5],
  kseaf:[70,250,'KSEAF','ME, SEAF','sn','KDF(KAUSF, FC=0x6C, SN name). Khoá neo của mạng phục vụ.',R=>R.V.kseaf],
  kamf:[250,250,'KAMF','ME, AMF','sn','KDF(KSEAF, FC=0x6D, SUPI, ABBA). Đổi AMF có thể tạo KAMF′ (FC=0x72) hoặc xác thực lại.',R=>R.K.kamf],
  nasInt:[430,180,'KNASint','ME, AMF','nas','KDF(KAMF, FC=0x69, 0x02, NIA id) lấy 128 bit thấp.',R=>R.K.nasInt],
  nasEnc:[430,250,'KNASenc','ME, AMF','nas','KDF(KAMF, FC=0x69, 0x01, NEA id) lấy 128 bit thấp.',R=>R.K.nasEnc],
  kgnb:[250,330,'KgNB','ME, gNB','as','KDF(KAMF, FC=0x6E, NAS UL COUNT, 0x01). AMF gửi cho gNB trong Initial Context Setup.',R=>R.K.kgnb],
  nh:[70,330,'NH (NCC)','ME, AMF','sn','NH = KDF(KAMF, FC=0x6F, SYNC-input). NH đầu dùng KgNB làm SYNC-input, các NH sau dùng NH trước. NCC đếm 0–7.',R=>R.K.nh1],
  n3iwf:[430,330,'KN3IWF','ME, N3IWF','as','KDF(KAMF, FC=0x6E, NAS UL COUNT, 0x02) cho truy nhập non-3GPP (Wi-Fi).',R=>R.K.n3iwf],
  rrcInt:[130,420,'KRRCint','UE, gNB-CU-CP','as','KDF(KgNB, FC=0x69, 0x04, NIA id).',R=>R.K.rrcInt],
  rrcEnc:[250,420,'KRRCenc','UE, gNB-CU-CP','as','KDF(KgNB, FC=0x69, 0x03, NEA id).',R=>R.K.rrcEnc],
  upEnc:[370,420,'KUPenc','UE, gNB-CU-UP','as','KDF(KgNB, FC=0x69, 0x05, NEA id).',R=>R.K.upEnc],
  upInt:[490,420,'KUPint','UE, gNB-CU-UP','as','KDF(KgNB, FC=0x69, 0x06, NIA id). Chỉ dùng khi chính sách UP integrity bật.',R=>R.K.upInt]
};
const SCKE=[['k','ckik'],['ckik','kausf'],['kausf','kseaf'],['kseaf','kamf'],['kamf','nasInt'],['kamf','nasEnc'],['kamf','kgnb'],['kamf','nh'],['kamf','n3iwf'],['kgnb','rrcInt'],['kgnb','rrcEnc'],['kgnb','upEnc'],['kgnb','upInt']];
function scKeySvg(R){let s='';
  s+=`<rect x="10" y="12" width="120" height="200" rx="10" class="u3zone"/><text x="20" y="226" class="u3zt">Mạng nhà</text><rect x="10" y="232" width="520" height="122" rx="10" class="u3zone"/><text x="520" y="368" class="u3zt" text-anchor="end">Mạng phục vụ: AMF</text><rect x="10" y="384" width="540" height="62" rx="10" class="u3zone"/><text x="540" y="460" class="u3zt" text-anchor="end">Trạm gNB</text>`;
  SCKE.forEach(([a,b])=>{const A=SCKT[a],B=SCKT[b];s+=`<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" class="sckl"/>`;});
  for(const id in SCKT){const n=SCKT[id],sel=SCK.sel===id;s+=`<g class="u3nd sckn sck-${n[4]}${sel?' sel':''}" data-sca="key:nd-${id}" tabindex="0" role="button" aria-label="${nE(n[2])}"><rect x="${n[0]-50}" y="${n[1]-17}" width="100" height="34" rx="8"/><text x="${n[0]}" y="${n[1]+1}" text-anchor="middle" class="u3nt">${nE(n[2])}</text><text x="${n[0]}" y="${n[1]+13}" text-anchor="middle" class="ndrole">${nE(n[3])}</text></g>`;}
  return `<svg viewBox="0 0 560 470" class="u3svg sckt" role="img" aria-label="Cây phân cấp khoá 5G">${s}</svg>`;}
function scKeyInfo(R){const n=SCKT[SCK.sel];if(!n)return '';return `<p class="e2x"><b>${nE(n[2])}</b> · giữ ở ${nE(n[3])}</p><p class="e2d">${nE(n[5])}</p><p>${sCode(sHex(n[6](R)))}</p>`;}
function scSmcSteps(R){const P=SCP.key,cols=[['ue','UE','ue']];if(P.bid)cols.push(['x','Kẻ trung gian','atk']);cols.push(['gnb','gNB','ran'],['amf','AMF','core']);
  const S=[],capTxt=c=>['NEA0','NEA1','NEA2','NEA3'].filter((x,i)=>i===0||c[i]).join(', ');
  if(P.bid){S.push(sSt('ue','x','NAS','Registration Request','Registration Request (UE security capabilities)','UE → …','UE gửi: '+capTxt(R.ue)));S.push(sSt('x','x','MITM','Xoá NEA2, NEA3 khỏi danh sách','Kẻ trung gian sửa khả năng bảo mật','—','Mục tiêu: ép mạng chọn thuật toán yếu hoặc null.',{bad:1}));S.push(sSt('x','amf','NAS','Registration Request (đã sửa)','Registration Request (đã bị sửa)','… → AMF','AMF thấy: '+capTxt(R.ueSeen),{bad:1}));}
  else S.push(sSt('ue','amf','NAS','Registration Request (UE sec. cap.)','Registration Request','UE → AMF','UE security capabilities: '+capTxt(R.ue)+' / NIA tương ứng'));
  S.push(sSt('amf','amf','AMF','Chọn NEA'+R.nea+'/NIA'+R.nia+', tính KNAS','AMF chọn thuật toán NAS theo danh sách ưu tiên','AMF','Thứ tự ưu tiên của nhà mạng: NEA '+P.nasPri.replace(/,/g,' > ')+'. Tính KNASenc, KNASint từ KAMF.'));
  S.push(sSt('amf','ue','NAS','Security Mode Command (MAC)','NAS Security Mode Command','AMF → UE','NEA'+R.nea+', NIA'+R.nia+', ngKSI, ABBA, replayed UE security capabilities, IMEISV request. Có MAC bằng KNASint, chưa mã hoá.'));
  if(P.bid){S.push(sSt('ue','ue','UE','Khả năng phát lại ≠ đã gửi','UE so replayed UE security capabilities với bản đã gửi','UE','Không khớp: phát hiện bị sửa trên đường lên. UE không bật bảo vệ.',{bad:1}));S.push(sSt('ue','amf','NAS','Security Mode Reject (#23)','Security Mode Reject','UE → AMF','5GMM cause #23 UE security capabilities mismatch. Tấn công hạ cấp thất bại.',{bad:1}));return {cols,steps:S,cw:150};}
  S.push(sSt('ue','ue','UE','Kiểm tra MAC, khả năng phát lại','UE kiểm tra MAC và replayed capabilities','UE','Khớp: tính KNASenc, KNASint, bật bảo vệ NAS.'));
  S.push(sSt('ue','amf','NAS','Security Mode Complete','NAS Security Mode Complete','UE → AMF','Mã hoá + toàn vẹn. Mang IMEISV và NAS message container (bản Registration Request đầy đủ).'));
  S.push(sSt('amf','amf','AMF','Tính KgNB (UL COUNT '+P.ul+')','AMF tính KgNB','AMF','KgNB = KDF(KAMF, 0x6E, UL NAS COUNT, 0x01).'));
  S.push(sSt('amf','gnb','NGAP','Initial Context Setup Req (KgNB)','Initial Context Setup Request','AMF → gNB','Security Key (KgNB), UE security capabilities, NCC = 0.'));
  S.push(sSt('gnb','gnb','gNB','Chọn NEA'+R.aea+'/NIA'+R.aia+' cho AS','gNB chọn thuật toán AS','gNB','Danh sách ưu tiên AS của gNB: NEA '+P.asPri.replace(/,/g,' > ')+'. Tính KRRCint, KRRCenc, KUPenc, KUPint.'));
  S.push(sSt('gnb','ue','RRC','SecurityModeCommand (MAC-I)','RRC SecurityModeCommand','gNB → UE','Toàn vẹn bằng KRRCint, chưa mã hoá.'));
  S.push(sSt('ue','ue','UE','Tính KgNB, khoá AS, kiểm tra MAC-I','UE tính khoá AS','UE',''));
  S.push(sSt('ue','gnb','RRC','SecurityModeComplete','RRC SecurityModeComplete','UE → gNB','Toàn vẹn; từ đây mọi bản tin RRC được mã hoá.'));
  S.push(sSt('gnb','amf','NGAP','Initial Context Setup Resp','Initial Context Setup Response','gNB → AMF',''));
  S.push(sSt('gnb','ue','RRC','RRCReconfiguration (DRB, UP security)','RRCReconfiguration','gNB → UE','Cấu hình DRB; mã hoá/toàn vẹn UP theo chính sách SMF gửi cho gNB (mục 4).',{ok:1}));
  return {cols,steps:S,cw:150};}
function scIntDemo(R){const P=SCP.key,msg=sUtf('Registration Accept: 5G-GUTI, TAI list, allowed NSSAI'),cnt=Uint8Array.of(0,0,0,P.ul+1),hdr=Uint8Array.of(0x01,0x00);
  const mac=sHmac(R.K.nasInt,sCat(cnt,hdr,msg)).slice(0,4);let rx=Uint8Array.from(msg),rcnt=cnt;if(P.tamper)rx[12]^=0x04;if(P.replay)rcnt=Uint8Array.of(0,0,0,Math.max(0,P.ul-1));
  const mac2=sHmac(R.K.nasInt,sCat(rcnt,hdr,rx)).slice(0,4),ok=sHex(mac)===sHex(mac2)&&!P.replay;
  return `<dl class="kv">${sKv('Bản tin gửi',nE(new TextDecoder().decode(msg)))}${sKv('NAS COUNT gửi',P.ul+1)}${sKv('MAC (32 bit) do AMF tính',sCode(sHex(mac)))}
   ${sKv('Bản tin nhận',nE(new TextDecoder().decode(rx)),P.tamper?'scbad':'')}${sKv('COUNT nhận',P.replay?(Math.max(0,P.ul-1))+' (cũ, đã dùng)':P.ul+1,P.replay?'scbad':'')}${sKv('XMAC do UE tính',sCode(sHex(mac2)))}
   ${sKv('Kết luận',ok?'<span class="scok">Toàn vẹn đúng, xử lý bản tin</span>':`<span class="scbad">${P.replay?'COUNT không tăng: bản tin phát lại, bỏ':'MAC sai: bản tin bị sửa, bỏ'} (đếm integrity check failure)</span>`)}</dl>
   <p class="note">Minh hoạ: NIA2 thật dùng AES-CMAC với COUNT, BEARER, DIRECTION; ở đây dùng HMAC-SHA-256 với KNASint thật để thấy nguyên lý.</p>`;}
function scHopTbl(R){return `<table class="ndtb sctb"><thead><tr><th>Lần HO</th><th>PCI đích</th><th>Kiểu dẫn xuất KgNB*</th><th>KgNB* (rút gọn)</th></tr></thead><tbody><tr><td>0</td><td>${SCP.key.pci}</td><td>KgNB ban đầu (NCC 0)</td><td>${sCode(sShort(R.K.kgnb,10))}</td></tr>${R.hops.map(h=>`<tr><td>${h.h}</td><td>${h.pci}</td><td>${nE(h.kind)}</td><td>${sCode(sShort(h.k,10))}</td></tr>`).join('')}</tbody></table>`;}
SCR.key={
 html(){const P=SCK.R=scKeys(),Q=SCP.key;SCK.L=scSmcSteps(P);SCK.L.du=1.1;SCK.i=-1;const pri=[['2,3,1','NEA2 > NEA3 > NEA1'],['3,2,1','NEA3 > NEA2 > NEA1'],['1,2,3','NEA1 > NEA2 > NEA3'],['2,1','NEA2 > NEA1 (không NEA3)']];
  return `<div class="cols"><div>
   <div class="panel"><h3>Cây phân cấp khoá 5G (giá trị tính thật)</h3><div class="scroll"><div id="scKeySvg">${scKeySvg(P)}</div></div>
    <p class="legend"><span><i style="background:var(--k1)"></i>Mạng nhà</span><span><i style="background:var(--up)"></i>Mạng phục vụ</span><span><i style="background:var(--k4)"></i>Khoá NAS</span><span><i style="background:var(--nr)"></i>Khoá AS / gNB</span></p></div>
   <div class="panel" id="scKeyInfo" aria-live="polite">${scKeyInfo(P)}</div>
  </div><div>
   <div class="panel"><h3>Thuật toán và tham số</h3><div class="ctl">
    <div class="c"><span class="cl">UE hỗ trợ (NEA0 luôn có)</span>${sChk('key','ue1','NEA1/NIA1')}${sChk('key','ue2','NEA2/NIA2')}${sChk('key','ue3','NEA3/NIA3')}</div>
    ${sSel('key','nasPri','Ưu tiên mã hoá NAS (AMF)',pri,'','nasCiph')}
    ${sSel('key','intPri','Ưu tiên toàn vẹn (NIA)',pri.map(p=>[p[0],p[1].replace(/NEA/g,'NIA')]),'','nasInt')}
    ${sSel('key','asPri','Ưu tiên mã hoá AS (gNB)',pri,'','asCiph')}
    <div class="c">${sChk('key','null0','Cho phép NEA0 (không mã hoá)','nullAlg')}${sChk('key','bid','Kẻ trung gian sửa khả năng bảo mật (bidding-down)')}</div>
    ${sSl('key','ul','NAS UL COUNT khi tính KgNB',0,255,1,v=>v)}
    ${sSl('key','hops','Số lần chuyển giao',1,6,1,v=>v)}
    ${sSel('key','hoType','Kiểu chuyển giao',[['xn','Xn (có Path Switch, NH cho lần sau)'],['n2','N2 qua AMF (NH mới ngay)']])}
    ${sSl('key','spd','Tốc độ chạy',0.25,3,0.25,v=>'× '+nF(v,2))}
   </div></div>
   <div class="panel"><h3>Kết quả thương lượng</h3><dl class="kv" id="scKeyOut"></dl></div>
  </div></div>
  <div class="panel"><h3>NAS và AS Security Mode</h3><div class="scroll scladw" id="scSmcW"><div id="scSmc">${sLadSvg(SCK.L,-1,'k')}</div></div>${sCtlBtns('key')}<div id="scSmcLog"></div></div>
  <div class="cols"><div class="panel"><h3>Chuỗi khoá khi chuyển giao (NH/NCC)</h3><div class="scroll" id="scHop">${scHopTbl(P)}</div><p class="note">Ngang: KgNB* từ KgNB cũ (gNB nguồn biết khoá đích). Dọc: từ NH do AMF cấp, gNB nguồn cũ không suy ra được khoá sau hai lần chuyển giao (forward security). PCI và ARFCN-DL của cell đích là đầu vào FC=0x70.</p></div>
  <div class="panel"><h3>Thử toàn vẹn NAS</h3><div class="ctl">${sChk('key','tamper','Sửa 1 bit trên đường đi')} ${sChk('key','replay','Phát lại bản tin cũ (COUNT cũ)')}</div><div id="scInt">${scIntDemo(P)}</div></div></div>
  <div class="panel"><h3>Thuật toán NEA/NIA (5G), EEA/EIA (4G), UEA/UIA (3G)</h3><div class="scroll"><table class="ndtb"><thead><tr><th>Mã</th><th>5G</th><th>Lõi thuật toán</th><th>Khoá</th><th>4G / 3G tương ứng</th><th>Ghi chú</th></tr></thead><tbody>${[0,1,2,3].map(a=>`<tr class="${a===P.nea?'ndhl':''}"><td>${a.toString(2).padStart(4,'0')}</td><td>${nE(SCALG[a][0])}</td><td>${nE(SCALG[a][1])}</td><td>${SCALG[a][2]}</td><td>${['EEA0/EIA0 · UEA0','EEA1/EIA1 · UEA2/UIA2','EEA2/EIA2 · —','EEA3/EIA3 · —'][a]}</td><td>${nE(SCALG[a][3])}</td></tr>`).join('')}<tr><td>—</td><td>Thuật toán 256 bit</td><td>Đang chuẩn hoá cho 5G-Advanced/6G</td><td>256 bit</td><td>—</td><td>Tên và mã cụ thể: cần đối chiếu theo release.</td></tr><tr><td>—</td><td>3G UEA1/UIA1</td><td>KASUMI</td><td>128 bit</td><td>—</td><td>Chỉ 3G; 2G A5/1, A5/3 (KASUMI), A5/0 không mã hoá.</td></tr></tbody></table></div>
   <div class="u3two" style="margin-top:10px"><div><b>Bản tin NAS được bảo vệ</b><div class="scpkt"><span class="p1">EPD</span><span class="p1">Sec. header</span><span class="p2">MAC 32 bit</span><span class="p3">SQN 8 bit</span><span class="p4">Bản tin NAS (mã hoá)</span></div></div><div><b>PDU PDCP (SRB/DRB)</b><div class="scpkt"><span class="p1">Header (SN)</span><span class="p4">Dữ liệu (mã hoá)</span><span class="p2">MAC-I 32 bit</span></div></div></div></div>`;},
 after(){SCK.t=0;SCK.i=-1;this.out();this.draw(true);},
 out(){const R=SCK.R,o=$('#scKeyOut');if(!o)return;o.innerHTML=sKv('NAS: mã hoá / toàn vẹn',R.nea==null?'—':'NEA'+R.nea+' / NIA'+R.nia,R.nea===0?'scbad':'')+sKv('AS: mã hoá / toàn vẹn',R.aea==null?'—':'NEA'+R.aea+' / NIA'+R.aia,R.aea===0?'scbad':'')+sKv('Hạ cấp',SCP.key.bid?'<span class="scok">bị phát hiện ở UE (#23)</span>':'không')+sKv('KAMF',sCode(sShort(R.K.kamf,8)))+sKv('KgNB',sCode(sShort(R.K.kgnb,8)));},
 draw(force){const L=SCK.L,r=sPlay(SCK,L,0,0),i=r.i;
  if(force||i!==SCK.i){SCK.i=i;const g=$('#scSmc');if(g)g.innerHTML=sLadSvg(L,i,'k');const lg=$('#scSmcLog');if(lg)lg.innerHTML=sLadLog(L,Math.min(i,L.steps.length-1));}
  sLadDot(L,Math.min(i,L.steps.length-1),i>=L.steps.length?1:r.fr,'k');const tt=$('#scT-key');if(tt)tt.textContent=i>=L.steps.length?'Hết luồng':`Bước ${i+1}/${L.steps.length}`;},
 tick(dt){sPlay(SCK,SCK.L,dt,SCP.key.spd);this.draw(false);},
 upd(k){if(k==='spd')return;SCK.R=scKeys();if(k==='tamper'||k==='replay'){const d=$('#scInt');if(d)d.innerHTML=scIntDemo(SCK.R);return;}
  SCK.L=scSmcSteps(SCK.R);SCK.L.du=1.1;SCK.t=0;const a=$('#scKeySvg');if(a)a.innerHTML=scKeySvg(SCK.R);const b=$('#scKeyInfo');if(b)b.innerHTML=scKeyInfo(SCK.R);const c=$('#scHop');if(c)c.innerHTML=scHopTbl(SCK.R);const d=$('#scInt');if(d)d.innerHTML=scIntDemo(SCK.R);this.out();this.draw(true);},
 act(a){if(a.startsWith('nd-')){SCK.sel=a.slice(3);const s=$('#scKeySvg');if(s)s.innerHTML=scKeySvg(SCK.R);const b=$('#scKeyInfo');if(b)b.innerHTML=scKeyInfo(SCK.R);return;}
  const du=1.1,n=SCK.L.steps.length;if(a==='next')SCK.t=Math.min(n*du,(Math.floor(SCK.t/du)+1)*du+0.01);else if(a==='prev')SCK.t=Math.max(0,(Math.floor(SCK.t/du)-1)*du+0.01);else if(a==='rst')SCK.t=0;this.draw(true);}
};

/* ---------- Mục 3: Roaming: SEPP, N32 (TLS/PRINS), bảo vệ SS7/Diameter/GTP ---------- */
SCP.roam={meth:'tls',atk:'none',spd:1,att:3,cat1:true,cat2:true,cat3:true,smsHR:true,dia:true,gtp:true,seed:5};
const SCRM={t:0,i:-1,L:null,fl:[],acc:0,MC:null};
const SCRA=[['none','Bình thường'],['cert','Chứng thư SEPP đối tác hết hạn'],['plmn','PLMN-ID trong bản tin không khớp chứng thư'],['ipxmod','IPX sửa trường không được phép'],['tamper','Bản tin bị sửa trên đường (TLS)']];
function scRoamSteps(){const P=SCP.roam,PR=P.meth==='prins',A=P.atk,S=[],cols=[['amf','vAMF (mạng khách)','core'],['vs','vSEPP','sec'],['ipx','IPX','ip'],['hs','hSEPP','sec'],['ausf','hAUSF / UDM','core']];
  S.push(sSt('vs','hs','N32-c','TLS 1.2/1.3 hai chiều (mTLS)','N32-c: TLS handshake hai chiều','vSEPP ↔ hSEPP','Mỗi SEPP trình chứng thư; bên kia kiểm tra chuỗi CA và trust anchor gắn PLMN-ID. N32-c luôn dùng TLS.'));
  if(A==='cert'){S.push(sSt('hs','hs','TLS','Chứng thư hết hạn → alert','hSEPP: chứng thư vSEPP hết hạn','hSEPP','TLS alert certificate_expired. Không có N32-c nên không có roaming 5G với đối tác này; UE phải dùng 4G/Diameter nếu được.',{bad:1}));S.push(sSt('hs','vs','TLS','TLS alert, đóng kết nối','TLS alert','hSEPP → vSEPP','KPI N32-c SR giảm; cảnh báo chứng thư sắp hết hạn lẽ ra phải có trước 30 ngày.',{bad:1}));return {cols,steps:S,cw:150};}
  S.push(sSt('hs','hs','SEPP','Chứng thư hợp lệ, PLMN-ID khớp','Kiểm tra chứng thư','hSEPP','Một chứng thư chỉ được ánh xạ một trust anchor; ánh xạ nhiều bị từ chối.'));
  S.push(sSt('vs','hs','N32-c','SecNegotiateReq (TLS, PRINS)','N32-c Security Capability Negotiation Request','vSEPP → hSEPP','Danh sách phương thức hỗ trợ cho N32-f.'));
  S.push(sSt('hs','vs','N32-c','SecNegotiateRsp ('+(PR?'PRINS':'TLS')+')','Security Capability Negotiation Response','hSEPP → vSEPP',PR?'Chọn PRINS vì có IPX cần đọc/sửa một số trường.':'Chọn TLS: N32-f là phiên TLS riêng, không có trung gian sửa nội dung.'));
  if(PR){S.push(sSt('vs','hs','N32-c','Parameter Exchange (cipher suite)','N32-c Parameter Exchange: cipher suite JWE/JWS','vSEPP ↔ hSEPP',''));
    S.push(sSt('hs','vs','N32-c','Parameter Exchange (protection, modification policy)','Protection policy và IPX modification policy','hSEPP ↔ vSEPP','Protection policy: IE nào phải mã hoá (SUPI, khoá, vector). Modification policy: IPX được sửa IE nào.'));}
  S.push(sSt('amf','vs','SBI','Nausf_UEAuthentication_Authenticate Req','Nausf_UEAuthentication_Authenticate Request (HTTP/2)','vAMF → vSEPP','Chứa SUCI và serving network name của mạng khách.'));
  if(PR){S.push(sSt('vs','vs','PRINS','JWE mã hoá IE nhạy cảm, JWS phần còn lại','vSEPP bọc bản tin bằng JOSE','vSEPP','Tách phần IPX được đọc và phần chỉ hSEPP đọc được.'));
    S.push(sSt('vs','ipx','N32-f','N32-f (JOSE)','N32-f qua IPX','vSEPP → IPX',''));
    if(A==='ipxmod'){S.push(sSt('ipx','ipx','IPX','Sửa IE không được phép','IPX sửa trường ngoài modification policy','IPX','Ví dụ đổi địa chỉ đích hoặc giá trị trong phần được ký.',{bad:1}));S.push(sSt('ipx','hs','N32-f','N32-f (đã sửa)','N32-f','IPX → hSEPP','',{bad:1}));S.push(sSt('hs','hs','PRINS','Chữ ký JWS/policy sai → bỏ','hSEPP kiểm tra sửa đổi theo policy','hSEPP','Phát hiện sửa trái phép, từ chối và ghi log.',{bad:1}));S.push(sSt('hs','vs','N32-f','Lỗi (từ chối)','Phản hồi lỗi','hSEPP → vSEPP','',{bad:1}));return {cols,steps:S,cw:150};}
    S.push(sSt('ipx','ipx','IPX','Sửa IE được phép, ký patch','IPX áp dụng sửa đổi được phép và ký','IPX','Ví dụ thay đổi thông tin định tuyến; mỗi sửa đổi có chữ ký của IPX.'));
    S.push(sSt('ipx','hs','N32-f','N32-f (JOSE + patch)','N32-f','IPX → hSEPP',''));
    S.push(sSt('hs','hs','PRINS','Giải JWE, kiểm tra JWS và patch','hSEPP kiểm tra','hSEPP',''));}
  else{if(A==='ipxmod'){S.push(sSt('vs','hs','N32-f','N32-f (TLS đầu cuối)','N32-f qua TLS riêng','vSEPP → hSEPP','Với TLS, IPX chỉ chuyển gói đã mã hoá, không đọc hay sửa được trường nào. Tấn công này không áp dụng.'));}
    else if(A==='tamper'){S.push(sSt('vs','ipx','N32-f','N32-f (TLS)','N32-f','vSEPP → …',''));S.push(sSt('ipx','ipx','IPX','Sửa byte trong bản ghi TLS','Có kẻ sửa gói trên đường','—','',{bad:1}));S.push(sSt('ipx','hs','N32-f','Bản ghi TLS sai MAC','N32-f','… → hSEPP','',{bad:1}));S.push(sSt('hs','hs','TLS','AEAD sai → alert, đóng','TLS phát hiện sửa đổi','hSEPP','bad_record_mac: phiên đóng, bản tin không tới AUSF.',{bad:1}));return {cols,steps:S,cw:150};}
    else S.push(sSt('vs','hs','N32-f','N32-f (TLS riêng)','N32-f qua TLS','vSEPP → hSEPP','Phiên TLS N32-f tách khỏi N32-c.'));}
  if(A==='plmn'){S.push(sSt('hs','hs','SEPP','PLMN-ID bản tin ≠ chứng thư','hSEPP so PLMN-ID','hSEPP','Serving network name/PLMN trong bản tin khác PLMN-ID của chứng thư N32: dấu hiệu giả mạo mạng khách. Từ chối và ghi log.',{bad:1}));S.push(sSt('hs','vs','N32-f','403 Forbidden','Từ chối','hSEPP → vSEPP','',{bad:1}));return {cols,steps:S,cw:150};}
  S.push(sSt('hs','hs','SEPP','PLMN-ID khớp, ẩn topo','hSEPP kiểm tra PLMN-ID, ẩn cấu trúc mạng nhà','hSEPP','Topology hiding: đối tác chỉ thấy SEPP, không thấy địa chỉ AUSF/UDM.'));
  S.push(sSt('hs','ausf','SBI','Authenticate Req','Nausf_UEAuthentication_Authenticate Request','hSEPP → hAUSF',''));
  S.push(sSt('ausf','hs','SBI','Authenticate Resp (5G SE AV)','Response','hAUSF → hSEPP','Vector (RAND, AUTN, HXRES*) — với PRINS được JWE mã hoá.'));
  S.push(sSt('hs','vs','N32-f','N32-f (phản hồi)','N32-f','hSEPP → vSEPP',''));
  S.push(sSt('vs','amf','SBI','Authenticate Resp','Response','vSEPP → vAMF','Tiếp tục 5G-AKA như mục 1.',{ok:1}));
  return {cols,steps:S,cw:150};}
/* tường lửa báo hiệu: loại bản tin [mã, tên, giao thức, hợp lệ?, tỉ lệ, chặn bởi, mô tả] */
const SCSIG=[
 ['ul','UpdateLocation / ULR của khách roaming thật','SS7/Diameter',1,40,'','Lưu lượng roaming bình thường.'],
 ['sai','SendAuthInfo / AIR thật','SS7/Diameter',1,30,'',''],
 ['sms','SRI-SM cho SMS thật','SS7',1,15,'',''],
 ['csr','GTP-C Create Session của khách roaming','GTP',1,15,'',''],
 ['ati','AnyTimeInterrogation (dò vị trí)','SS7',0,1,'cat1','Loại 1: chỉ hợp lệ trong nội mạng; từ ngoài vào là dò vị trí thuê bao.'],
 ['sri','SRI-SM để lấy IMSI và MSC phục vụ','SS7',0,1,'smsHR','Dùng làm bước đầu của theo dõi. SMS home routing trả IMSI giả, MSC giả.'],
 ['psi','ProvideSubscriberInfo cho thuê bao nhà','SS7',0,1,'cat2','Loại 2: kiểm tra nguồn có đúng mạng thuê bao đang roaming.'],
 ['ulf','UpdateLocation giả (chuyển hướng cuộc gọi/SMS)','SS7',0,1,'cat3','Loại 3: kiểm tra hợp lý vị trí/tốc độ di chuyển.'],
 ['idr','Diameter IDR/ULR từ realm lạ','Diameter',0,1,'dia','FS.19: kiểm tra Origin-Realm, Origin-Host khớp nguồn kết nối.'],
 ['clr','Diameter CLR (huỷ đăng ký, từ chối dịch vụ)','Diameter',0,1,'dia',''],
 ['gtps','GTP-C giả phiên (spoof TEID)','GTP',0,1,'gtp','FS.20: kiểm tra trạng thái phiên, IP nguồn của đối tác.']];
function scSigMC(){const P=SCP.roam,r=nRng(P.seed*31+7),N=4000,att=P.att/100;let a={pass:0,block:0},l={pass:0,fp:0};const per={};
  const legit=SCSIG.filter(x=>x[3]),bad=SCSIG.filter(x=>!x[3]),wL=legit.reduce((s,x)=>s+x[4],0),wB=bad.reduce((s,x)=>s+x[4],0);
  const pick=(L,w)=>{let u=r()*w;for(const x of L){if(u<x[4])return x;u-=x[4];}return L[L.length-1];};
  for(let i=0;i<N;i++){if(r()<att){const m=pick(bad,wB),on=P[m[5]],hit=on&&r()<(m[5]==='cat3'?0.9:0.985);per[m[0]]=per[m[0]]||{n:0,b:0};per[m[0]].n++;if(hit){a.block++;per[m[0]].b++;}else a.pass++;}
    else{const m=pick(legit,wL);const fp=(P.cat3&&m[0]==='ul'&&r()<0.004)||(P.dia&&r()<0.0008);if(fp)l.fp++;else l.pass++;}}
  return {N,a,l,per};}
function scSigSvg(){return `<svg viewBox="0 0 640 150" class="u3svg scsig" role="img" aria-label="Luồng bản tin báo hiệu qua tường lửa"><rect x="10" y="40" width="120" height="70" rx="10" class="sccol ip"/><text x="70" y="70" text-anchor="middle" class="sccolt">IPX / đối tác</text><text x="70" y="88" text-anchor="middle" class="ndrole">SS7, Diameter, GTP</text>
  <rect x="260" y="30" width="120" height="90" rx="10" class="sccol sec"/><text x="320" y="68" text-anchor="middle" class="sccolt">Tường lửa</text><text x="320" y="86" text-anchor="middle" class="ndrole">STP/DEA/GTP FW</text>
  <rect x="510" y="40" width="120" height="70" rx="10" class="sccol core"/><text x="570" y="70" text-anchor="middle" class="sccolt">HLR / HSS / MME</text><text x="570" y="88" text-anchor="middle" class="ndrole">mạng nhà</text>
  <line x1="130" y1="75" x2="260" y2="75" class="sclife"/><line x1="380" y1="75" x2="510" y2="75" class="sclife"/><g id="scSigDots"></g></svg>`;}
function scSigOut(){const R=SCRM.MC,P=SCP.roam,A=R.a.pass+R.a.block,pct=(x,n)=>n?nF(x/n*100,1)+' %':'—';
  return `<dl class="kv">${sKv('Bản tin mô phỏng',R.N)}${sKv('Tấn công bị chặn',`<span data-ndcount="${R.a.block}">${R.a.block}</span> / ${A} (${pct(R.a.block,A)})`)}${sKv('Tấn công lọt',R.a.pass,R.a.pass?'scbad':'')}${sKv('Chặn nhầm bản tin thật',R.l.fp+' ('+nF(R.l.fp/Math.max(1,R.l.fp+R.l.pass)*1e4,1)+' / 10 000)',R.l.fp?'scwarn':'')}</dl>
   ${nBars(SCSIG.filter(x=>!x[3]).map(x=>{const q=R.per[x[0]]||{n:0,b:0};return [x[1],q.n?q.b/q.n*100:0,P[x[5]]?'var(--k1)':'var(--warn)'];}),100,' %',0)}<p class="note">Thanh: phần trăm bị chặn theo loại tấn công. Màu đỏ: quy tắc tương ứng đang tắt.</p>`;}
const SCRMT=[
 ['Giao thức','SS7 MAP/CAP trên SCCP (STP)','Diameter (S6a, S6d, Gx…) qua DEA/DRA','HTTP/2 SBI qua SEPP (N32)','GTP-C/U (Gp, S8, N9)'],
 ['Xác thực nguồn','Không (dựa Global Title)','Origin-Host/Realm khai báo, không ký','mTLS: chứng thư gắn PLMN-ID','IP nguồn, TEID'],
 ['Bảo mật đường','Không','IPsec/TLS tuỳ chọn, ít dùng giữa đối tác','N32-c TLS; N32-f TLS hoặc PRINS (JWE/JWS)','IPsec tuỳ chọn'],
 ['Tấn công điển hình','Dò vị trí, chặn SMS, chuyển hướng cuộc gọi, DoS','Dò vị trí, huỷ đăng ký (CLR), gian lận','Giả PLMN, IPX sửa nội dung (đã có cơ chế chống)','Giả phiên, chiếm dữ liệu, DoS'],
 ['Biện pháp','Tường lửa SS7 GSMA FS.11 (loại 1/2/3), SMS home routing','Tường lửa Diameter GSMA FS.19, DEA kiểm tra realm','SEPP kiểm tra PLMN-ID, topology hiding, chính sách sửa đổi','Tường lửa GTP GSMA FS.20'],
 ['Tiêu chuẩn','GSMA FS.11, FS.07','GSMA FS.19, TS 29.272','TS 33.501 §13, TS 29.573','GSMA FS.20, TS 29.274']];
SCR.roam={
 html(){SCRM.L=scRoamSteps();SCRM.L.du=1.1;SCRM.i=-1;SCRM.MC=scSigMC();
  return `<div class="panel"><h3>N32 giữa hai SEPP</h3><div class="scroll scladw" id="scRmW"><div id="scRmLad">${sLadSvg(SCRM.L,-1,'r')}</div></div>${sCtlBtns('roam')}</div>
  <div class="cols"><div>
   <div class="panel" id="scRmInfo" aria-live="polite"></div>
   <div class="panel"><h3>Nhật ký bản tin N32</h3><div id="scRmLog"></div></div>
  </div><div>
   <div class="panel"><h3>Cấu hình N32</h3><div class="ctl">
    ${sSel('roam','meth','Bảo vệ N32-f',[['tls','TLS (không có IPX sửa nội dung)'],['prins','PRINS (qua IPX, JWE/JWS)']],'','n32Sec')}
    ${sSel('roam','atk','Tình huống',SCRA)}
    ${sSl('roam','spd','Tốc độ chạy',0.25,3,0.25,v=>'× '+nF(v,2))}
   </div><p class="note">Sản phẩm SEPP: ${nE(sProd('sepp'))}</p></div>
   <div class="panel"><h3>Vì sao 5G cần SEPP</h3><p class="e2d">SS7 và Diameter tin nguồn theo khai báo: ai nối được vào IPX là gửi được bản tin "như một nhà mạng". SEPP đặt ở biên mỗi mạng 5G, xác thực đối tác bằng chứng thư gắn PLMN-ID, kiểm tra PLMN trong từng bản tin, ẩn topo mạng nhà, và với PRINS vẫn cho IPX sửa một số trường có kiểm soát.</p></div>
  </div></div>
  <div class="panel"><h3>Tường lửa báo hiệu liên mạng (SS7, Diameter, GTP)</h3>
   <div class="cols"><div><div class="scroll">${scSigSvg()}</div><p class="legend"><span><i style="background:var(--k1)"></i>Bản tin thật cho qua</span><span><i style="background:var(--warn)"></i>Tấn công bị chặn</span><span><i style="background:var(--k4)"></i>Tấn công lọt</span><span><i style="background:var(--muted)"></i>Chặn nhầm</span></p><div id="scSigOut">${scSigOut()}</div></div>
   <div><div class="ctl">${sSl('roam','att','Tỉ lệ bản tin tấn công',0.5,15,0.5,v=>nF(v,1)+' %')}
    <div class="c">${sChk('roam','cat1','SS7 loại 1: chặn bản tin chỉ dùng nội mạng','ss7fw')}${sChk('roam','cat2','SS7 loại 2: kiểm tra nguồn theo thuê bao')}${sChk('roam','cat3','SS7 loại 3: kiểm tra hợp lý vị trí, tốc độ')}${sChk('roam','smsHR','SMS home routing')}${sChk('roam','dia','Diameter: kiểm tra Origin-Realm/Host','diaFw')}${sChk('roam','gtp','GTP-C: kiểm tra trạng thái phiên','gtpFw')}</div>
    <div class="row"><button type="button" class="btn sm" data-sca="roam:seed">Chạy lại (mẫu khác)</button></div></div>
    <div class="scroll"><table class="ndtb sctb"><thead><tr><th>Bản tin</th><th>Giao thức</th><th>Quy tắc chặn</th></tr></thead><tbody>${SCSIG.filter(x=>!x[3]).map(x=>`<tr><td>${nE(x[1])}<br><span class="note">${nE(x[6])}</span></td><td>${x[2]}</td><td>${nE({cat1:'SS7 loại 1',cat2:'SS7 loại 2',cat3:'SS7 loại 3',smsHR:'SMS home routing',dia:'Diameter FS.19',gtp:'GTP FS.20'}[x[5]])}</td></tr>`).join('')}</tbody></table></div></div></div></div>
  <div class="panel"><h3>So sánh bảo vệ liên mạng 2G/3G, 4G, 5G</h3><div class="scroll"><table class="ndtb"><thead><tr><th></th><th>2G/3G SS7</th><th>4G Diameter</th><th>5G SEPP</th><th>GTP</th></tr></thead><tbody>${SCRMT.map(r=>`<tr>${r.map((c,j)=>`<td>${j?nE(c):'<b>'+nE(c)+'</b>'}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;},
 after(){SCRM.t=0;SCRM.i=-1;SCRM.fl=[];this.draw(true);},
 draw(force){const L=SCRM.L,r=sPlay(SCRM,L,0,0),i=r.i;
  if(force||i!==SCRM.i){SCRM.i=i;const g=$('#scRmLad');if(g)g.innerHTML=sLadSvg(L,i,'r');const lg=$('#scRmLog');if(lg)lg.innerHTML=sLadLog(L,Math.min(i,L.steps.length-1));const s=L.steps[Math.max(0,Math.min(i,L.steps.length-1))],inf=$('#scRmInfo');if(inf&&s)inf.innerHTML=`<p class="e2x"><b>Bước ${Math.min(i+1,L.steps.length)}/${L.steps.length}: ${nE(s.m)}</b></p><p class="e2d">${nE(s.a)}${s.d?' · '+nE(s.d):''}</p>`;}
  sLadDot(L,Math.min(i,L.steps.length-1),i>=L.steps.length?1:r.fr,'r');const tt=$('#scT-roam');if(tt)tt.textContent=i>=L.steps.length?'Hết luồng':`Bước ${i+1}/${L.steps.length}`;},
 tick(dt){sPlay(SCRM,SCRM.L,dt,SCP.roam.spd);this.draw(false);
  const g=$('#scSigDots');if(!g)return;const P=SCP.roam;if(!SCS.pause){SCRM.acc+=dt*6;while(SCRM.acc>1){SCRM.acc-=1;const atk=Math.random()<P.att/100*4,m=atk?SCSIG.filter(x=>!x[3])[Math.floor(Math.random()*7)]:null,blk=atk&&P[m[5]]&&Math.random()<0.95,fp=!atk&&P.cat3&&Math.random()<0.02;SCRM.fl.push({x:130,c:atk?(blk?'var(--warn)':'var(--k4)'):fp?'var(--muted)':'var(--k1)',stop:atk&&blk||fp,y:60+Math.random()*30});}
   SCRM.fl.forEach(d=>{d.x+=dt*150;if(d.stop&&d.x>320){d.x=320;d.age=(d.age||0)+dt;}});}
  SCRM.fl=SCRM.fl.filter(d=>d.x<510&&!(d.age>0.8)).slice(-40);g.innerHTML=SCRM.fl.map(d=>`<circle cx="${d.x}" cy="${d.y}" r="4.5" style="fill:${d.c}"${d.age?` opacity="${1-d.age}"`:''}/>`).join('');},
 upd(k){if(k==='spd')return;if(k==='meth'||k==='atk'){SCRM.L=scRoamSteps();SCRM.L.du=1.1;SCRM.t=0;this.draw(true);return;}SCRM.MC=scSigMC();const o=$('#scSigOut');if(o)o.innerHTML=scSigOut();},
 act(a){if(a==='seed'){SCP.roam.seed++;this.upd('seed');return;}const du=1.1,n=SCRM.L.steps.length;if(a==='next')SCRM.t=Math.min(n*du,(Math.floor(SCRM.t/du)+1)*du+0.01);else if(a==='prev')SCRM.t=Math.max(0,(Math.floor(SCRM.t/du)-1)*du+0.01);else if(a==='rst')SCRM.t=0;this.draw(true);}
};

/* ---------- Mục 4: IPsec/SEG, chứng chỉ, MACsec fronthaul, integrity protection UP ---------- */
SCP.tnl={macsec:true,f1:true,bh:true,upi:true,pkt:1400,mtu:1500,ip6:false,cap:10000,flt:'none',spd:1,day:300,auto:true,pol:'pref',ueFull:true,sess:300,rate:50,ipCap:20,sel:'bh'};
const SCTN={t:0,i:-1,L:null,dots:[],acc:0};
const SCTF=[['none','Bình thường'],['cert','Chứng thư gNB hết hạn'],['ntp','Đồng hồ gNB sai (NTP lỗi)'],['prop','Đề xuất IKE không khớp (DH group)'],['crl','Không tới được CRL/OCSP'],['mtu','Phân mảnh IKE_AUTH bị chặn (MTU)']];
/* các chặng truyền dẫn: id → [x1,x2,nhãn,giao thức,khoá bật] */
const SCSEG={fh:[120,250,'Fronthaul','eCPRI / O-RAN 7.2x','macsec'],f1:[330,460,'Midhaul F1','F1-C (SCTP), F1-U (GTP-U)','f1'],bh:[540,700,'Backhaul N2/N3/Xn','qua SecGW (NDS/IP)','bh']};
const SCSEGD={fh:'Fronthaul RU–DU chạy trên Ethernet lớp 2. MACsec (IEEE 802.1AE) mã hoá và toàn vẹn từng khung, thêm khoảng 32 byte (SecTAG + ICV). Khoá thường do MKA (802.1X) quản lý. O-RAN WG11 yêu cầu bảo vệ M-plane (SSH/TLS) và khuyến nghị bảo vệ fronthaul tuỳ mức rủi ro.',
  f1:'Midhaul F1 giữa DU và CU. TS 33.501 §9.8: F1-C phải bảo vệ bằng IPsec (NDS/IP) hoặc DTLS; F1-U dùng IPsec. Nếu DU và CU trong cùng phòng máy bảo vệ vật lý có thể không cần (quyết định của nhà mạng).',
  bh:'Backhaul N2/N3 và Xn qua mạng truyền dẫn không tin cậy. TS 33.501 §9.2–9.4 và TS 33.210: dùng IPsec ESP chế độ đường hầm, IKEv2 với chứng thư (TS 33.310). SecGW (Security Gateway) là đầu cuối IPsec phía lõi; DTLS cho N2 cũng được phép.'};
function scOvh(seg){const P=SCP.tnl,ipH=P.ip6?40:20;let base=P.pkt,ext=0;
  if(seg==='fh'){/* fronthaul lớp 2, khung jumbo: không phân mảnh IP */ext=P.macsec?32:0;const tot=base+22+ext;return {tot,frag:false,nFr:1,eff:P.pkt/tot,ext,l2:true};}
  base+=ipH+8+8+4;   /* GTP-U (có header mở rộng) / UDP / IP bên trong */
  const on=seg==='f1'?P.f1:P.bh;if(on){const pad=(4-((base+2)%4))%4;ext=ipH+8+8+pad+2+16;}
  const tot=base+ext,frag=tot>P.mtu,nFr=frag?Math.ceil((tot-ipH)/(P.mtu-ipH)):1,eff=P.pkt/(tot+(nFr-1)*ipH);return {tot,frag,nFr,eff,ext};}
function scTnlSvg(){const P=SCP.tnl;let s='';const nd=(x,l,c)=>`<rect x="${x-40}" y="56" width="80" height="40" rx="9" class="sccol ${c}"/><text x="${x}" y="81" text-anchor="middle" class="sccolt">${l}</text>`;
  for(const id in SCSEG){const g=SCSEG[id],on=P[g[4]],sel=P.sel===id;s+=`<g class="scseg${on?' on':' off'}${sel?' sel':''}" data-sca="tnl:sg-${id}" tabindex="0" role="button" aria-label="${nE(g[2])}"><line x1="${g[0]}" y1="76" x2="${g[1]}" y2="76"/><rect x="${g[0]}" y="64" width="${g[1]-g[0]}" height="24" class="schit"/><text x="${(g[0]+g[1])/2}" y="50" text-anchor="middle" class="scmt">${nE(g[2])}</text><text x="${(g[0]+g[1])/2}" y="112" text-anchor="middle" class="ndrole">${on?'🔒 ':'⚠ '}${nE(g[3])}</text></g>`;}
  s+=nd(80,'RU','ran')+nd(290,'DU','ran')+nd(500,'CU','ran')+`<rect x="700" y="50" width="70" height="52" rx="9" class="sccol sec"/><text x="735" y="80" text-anchor="middle" class="sccolt">SecGW</text>`+nd(830,'5GC','core');
  s+=`<line x1="770" y1="76" x2="790" y2="76" class="sclife"/><text x="20" y="142" class="ndrole">UE ↔ CU: PDCP mã hoá ${P.upi?'+ toàn vẹn UP':'(không toàn vẹn UP)'} xuyên qua RU, DU</text><line x1="40" y1="128" x2="500" y2="128" class="scpdcp${P.upi?' on':''}"/><g id="scTnlDots"></g>`;
  return `<svg viewBox="0 0 880 150" class="u3svg sctnl" role="img" aria-label="Các chặng truyền dẫn và bảo vệ">${s}</svg>`;}
function scTnlOut(){const P=SCP.tnl;const rows=['fh','f1','bh'].map(k=>{const o=scOvh(k);return [k,o];});
  return `<table class="ndtb sctb"><thead><tr><th>Chặng</th><th>Byte trên dây / gói ${P.pkt} B</th><th>Mảnh</th><th>Hiệu suất</th><th>Tốc độ hữu ích</th></tr></thead><tbody>${rows.map(([k,o])=>`<tr class="${P.sel===k?'ndhl':''}"><td>${nE(SCSEG[k][2])}</td><td>${o.tot}</td><td>${o.l2?'1 (khung jumbo)':o.frag?`<span class="scbad">${o.nFr} (phân mảnh)</span>`:'1'}</td><td>${nF(o.eff*100,1)} %</td><td><span data-ndcount="${P.cap*o.eff}">${nF(P.cap*o.eff)}</span> Mbit/s</td></tr>`).join('')}</tbody></table>
   ${nBars(rows.map(([k,o])=>[SCSEG[k][2]+' · thêm do bảo mật',o.ext,'var(--k4)']),80,' B',0)}
   <p class="note">${(()=>{const o=scOvh('bh');return o.frag?'Gói '+P.pkt+' B cộng GTP-U và ESP vượt MTU '+P.mtu+' B: bị phân mảnh, tăng tải SecGW và mất gói khi một mảnh rơi. Hạ MSS/MTU của UE (ví dụ MTU N3 nội bộ 1400–1420) hoặc dùng jumbo frame trên backhaul.':'Không phân mảnh ở MTU '+P.mtu+' B.';})()}</p>`;}
function scIkeSteps(){const F=SCP.tnl.flt,S=[],cols=[['gnb','gNB','ran'],['ra','RA/CA (CMPv2)','sec'],['sgw','SecGW','sec'],['core','AMF / UPF','core']];
  S.push(sSt('gnb','gnb','gNB','Khởi động: chứng thư vendor','gNB có chứng thư vendor cài từ nhà máy','gNB','Dùng để xin chứng thư nhà mạng lần đầu (TS 33.310 §9.5).'));
  if(F==='ntp'){S.push(sSt('gnb','gnb','NTP','Đồng hồ = 01/01/1970','gNB chưa đồng bộ thời gian','gNB','Mọi chứng thư nhìn từ gNB đều "chưa tới hạn hiệu lực".',{bad:1}));}
  S.push(sSt('gnb','ra','CMPv2','Initialization Request (ký bằng chứng thư vendor)','CMPv2 Initialization Request','gNB → RA','Chứa khoá công khai mới của gNB; ký bằng khoá vendor.'));
  if(F==='ntp'){S.push(sSt('ra','gnb','CMPv2','Initialization Response','CMPv2 Initialization Response','RA → gNB',''));S.push(sSt('gnb','gnb','gNB','Chứng thư CA "chưa hiệu lực" → bỏ','gNB kiểm tra chứng thư thất bại do thời gian','gNB','Cảnh báo: certificate not yet valid. Xử lý: kiểm tra NTP/GNSS trước khi xin chứng thư.',{bad:1}));return {cols,steps:S,cw:160};}
  S.push(sSt('ra','ra','RA','Kiểm tra chứng thư vendor (root CA vendor)','RA xác minh thiết bị','RA','Danh sách root CA vendor được nhà mạng tin cậy; có thể kiểm tra số serial trong kho.'));
  S.push(sSt('ra','gnb','CMPv2','Initialization Response (chứng thư nhà mạng)','CMPv2 Initialization Response','RA → gNB','Chứng thư gNB do CA nhà mạng ký, kèm chuỗi CA.'));
  S.push(sSt('gnb','ra','CMPv2','Certificate Confirm','CMPv2 Certificate Confirm / PKI Confirm','gNB ↔ RA',''));
  S.push(sSt('gnb','sgw','IKEv2','IKE_SA_INIT (SA, KE, Ni)','IKE_SA_INIT request','gNB → SecGW','Đề xuất: AES-GCM-128/256, PRF-HMAC-SHA-256, DH group 19/20.'));
  if(F==='prop'){S.push(sSt('sgw','gnb','IKEv2','NO_PROPOSAL_CHOSEN','IKE_SA_INIT response: NO_PROPOSAL_CHOSEN','SecGW → gNB','SecGW chỉ cho phép DH group 20, gNB đề xuất group 14. Sửa proposal hai đầu cho khớp.',{bad:1}));return {cols,steps:S,cw:160};}
  S.push(sSt('sgw','gnb','IKEv2','IKE_SA_INIT resp (+CERTREQ)','IKE_SA_INIT response','SecGW → gNB','Hai bên có khoá IKE SA (DH).'));
  if(F==='mtu'){S.push(sSt('gnb','sgw','IKEv2','IKE_AUTH (CERT, 4 KB, phân mảnh IP)','IKE_AUTH request','gNB → SecGW','Chuỗi chứng thư lớn làm gói UDP > MTU, bị phân mảnh IP.',{bad:1}));S.push(sSt('gnb','gnb','IKEv2','Thiết bị giữa đường bỏ mảnh IP → timeout','Không có phản hồi, phát lại','gNB','Cách xử lý: bật IKEv2 fragmentation (RFC 7383), giảm chuỗi chứng thư, cho phép mảnh IP trên firewall.',{bad:1}));return {cols,steps:S,cw:160};}
  S.push(sSt('gnb','sgw','IKEv2','IKE_AUTH (IDi, CERT, AUTH, SA, TS)','IKE_AUTH request (mã hoá)','gNB → SecGW','AUTH ký bằng khoá riêng gNB; TSi/TSr là dải địa chỉ N2/N3/Xn/O&M.'));
  if(F==='cert'){S.push(sSt('sgw','sgw','SecGW','Chứng thư gNB hết hạn','SecGW kiểm tra chứng thư thất bại','SecGW','',{bad:1}));S.push(sSt('sgw','gnb','IKEv2','AUTHENTICATION_FAILED','IKE_AUTH response: AUTHENTICATION_FAILED','SecGW → gNB','Trạm mất N2/N3: cell không phục vụ. Phòng ngừa: tự gia hạn CMPv2 trước 30–60 ngày, cảnh báo KPI chứng thư.',{bad:1}));return {cols,steps:S,cw:160};}
  if(F==='crl'){S.push(sSt('sgw','sgw','SecGW','Không tới CRL/OCSP','SecGW không kiểm tra được thu hồi','SecGW','Chính sách fail-closed: từ chối (an toàn nhưng mất dịch vụ). Fail-open: cho qua (giữ dịch vụ nhưng rủi ro). Nên đặt bản sao CRL nội bộ.',{bad:1}));S.push(sSt('sgw','gnb','IKEv2','AUTHENTICATION_FAILED (fail-closed)','IKE_AUTH response','SecGW → gNB','',{bad:1}));return {cols,steps:S,cw:160};}
  S.push(sSt('sgw','sgw','SecGW','Chuỗi CA, hạn, CRL/OCSP: hợp lệ','SecGW kiểm tra chứng thư','SecGW',''));
  S.push(sSt('sgw','gnb','IKEv2','IKE_AUTH resp (Child SA ESP)','IKE_AUTH response','SecGW → gNB','Child SA cho ESP; lifetime ví dụ 24 h, rekey trước hạn.'));
  S.push(sSt('gnb','core','SCTP','SCTP INIT (N2) trong ESP','SCTP association tới AMF','gNB → AMF','Đi trong đường hầm IPsec.'));
  S.push(sSt('gnb','core','NGAP','NG Setup Request','NG Setup Request','gNB → AMF',''));
  S.push(sSt('core','gnb','NGAP','NG Setup Response','NG Setup Response','AMF → gNB','Trạm vào dịch vụ.'));
  S.push(sSt('gnb','sgw','IKEv2','CREATE_CHILD_SA (rekey)','CREATE_CHILD_SA','gNB ↔ SecGW','Đổi khoá ESP định kỳ; DPD (dead peer detection) phát hiện đường hầm chết.',{ok:1}));
  return {cols,steps:S,cw:160};}
const SCCERT=[['Chứng thư gNB (nhà mạng)',365,30],['Chứng thư SecGW',730,60],['Chứng thư SEPP (N32)',365,45],['Chứng thư đối tác N32 (roaming)',395,0],['CA trung gian nhà mạng',1825,180],['Chứng thư NF trong SBA (AMF, SMF… TLS)',180,20]];
function scCertTbl(){const P=SCP.tnl;let warn=0,exp=0;const rows=SCCERT.map(c=>{const auto=P.auto&&c[2]>0;let left=c[1]-(auto?P.day%Math.max(1,c[1]-c[2]):P.day);const stt=left<=0?'exp':left<=30?'warn':'ok';if(stt==='exp')exp++;else if(stt==='warn')warn++;
   return `<tr><td>${nE(c[0])}</td><td>${c[1]} ngày</td><td>${auto?'tự động (CMPv2/ACME, trước '+c[2]+' ngày)':'thủ công'}</td><td>${left<=0?'<span class="scbad">đã hết hạn '+(-left)+' ngày</span>':left<=30?'<span class="scwarn">còn '+left+' ngày</span>':'<span class="scok">còn '+left+' ngày</span>'}</td></tr>`;}).join('');
  return `<table class="ndtb sctb"><thead><tr><th>Chứng thư</th><th>Hạn</th><th>Gia hạn</th><th>Trạng thái ngày ${P.day}</th></tr></thead><tbody>${rows}</tbody></table><p class="e2x">KPI chứng thư ≤ 30 ngày: <b>${warn}</b> · đã hết hạn: <b class="${exp?'scbad':''}">${exp}</b>${exp?' → trạm/roaming liên quan mất dịch vụ':''}</p>`;}
function scUpi(){const P=SCP.tnl;const want=P.pol!=='no',canUe=P.ueFull||P.rate<=0.064,load=P.pol==='no'?0:P.sess*P.rate/1000/P.ipCap*100,over=load>100;
  let act,res;if(!want){act=false;res='Không bật (chính sách Not needed).';}
  else if(!canUe){act=false;res=P.pol==='req'?'UE không hỗ trợ toàn vẹn UP ở tốc độ này: PDU session bị từ chối (Required).':'UE không hỗ trợ ở tốc độ này: phiên chạy không toàn vẹn (Preferred).';}
  else if(over){act=P.pol==='req';res=P.pol==='req'?'gNB thiếu năng lực: từ chối thêm phiên mới (PDU Session Resource Setup Unsuccessful).':'gNB quá tải toàn vẹn: phiên mới chạy không toàn vẹn (Preferred).';}
  else{act=true;res='Bật toàn vẹn UP cho phiên.';}
  return `<dl class="kv">${sKv('Toàn vẹn UP',act?'<span class="scok">bật</span>':'<span class="scwarn">tắt</span>')}${sKv('Tải toàn vẹn UP tại gNB-CU-UP',`<span data-ndcount="${Math.min(load,999)}">${nF(Math.min(load,999))}</span> %`,over?'scbad':'')}${sKv('Kết quả',nE(res),(!act&&P.pol==='req')?'scbad':'')}</dl>`;}
SCR.tnl={
 html(){SCTN.L=scIkeSteps();SCTN.L.du=1.1;SCTN.i=-1;const P=SCP.tnl;
  return `<div class="panel"><h3>Các chặng truyền dẫn và lớp bảo vệ</h3><div class="scroll"><div id="scTnlSvg">${scTnlSvg()}</div></div><p class="note" id="scSegInfo">${nE(SCSEGD[P.sel])}</p></div>
  <div class="cols"><div>
   <div class="panel"><h3>Chi phí byte của bảo mật</h3><div id="scOvh">${scTnlOut()}</div></div>
  </div><div>
   <div class="panel"><h3>Bật/tắt bảo vệ và gói tin</h3><div class="ctl">
    <div class="c">${sChk('tnl','macsec','MACsec fronthaul','macsec')}${sChk('tnl','f1','IPsec F1 (DU–CU)','f1Sec')}${sChk('tnl','bh','IPsec backhaul qua SecGW','ipsecProp')}${sChk('tnl','upi','Toàn vẹn UP (PDCP)','upIntPol')}${sChk('tnl','ip6','IPv6 ngoài')}</div>
    ${sSl('tnl','pkt','Cỡ gói người dùng',64,1500,4,v=>v+' B')}
    ${sSel('tnl','mtu','MTU đường truyền',[[1500,'1500 B'],[1600,'1600 B'],[2000,'2000 B'],[9000,'9000 B (jumbo)']],'','mtuBh')}
    ${sSl('tnl','cap','Dung lượng mỗi chặng',1000,25000,1000,v=>nF(v/1000)+' Gbit/s')}
   </div><p class="note">SecGW: ${nE(sProd('secgw'))}</p></div>
  </div></div>
  <div class="panel"><h3>Trạm lên dịch vụ: CMPv2 và IKEv2</h3><div class="ctl" style="margin-bottom:8px">${sSel('tnl','flt','Tình huống',SCTF)}${sSl('tnl','spd','Tốc độ chạy',0.25,3,0.25,v=>'× '+nF(v,2))}</div>
   <div class="scroll scladw" id="scIkeW"><div id="scIke">${sLadSvg(SCTN.L,-1,'t')}</div></div>${sCtlBtns('tnl')}<div id="scIkeLog"></div></div>
  <div class="cols"><div class="panel"><h3>Vòng đời chứng thư</h3><div class="ctl">${sSl('tnl','day','Ngày kể từ khi cấp',0,900,5,v=>v+' ngày')}${sChk('tnl','auto','Tự động gia hạn','certRenew')}</div><div id="scCert">${scCertTbl()}</div></div>
  <div class="panel"><h3>Toàn vẹn dữ liệu người dùng (UP integrity)</h3><div class="ctl">
    ${sSel('tnl','pol','Chính sách của SMF cho DNN/slice',[['req','Required (bắt buộc)'],['pref','Preferred (nếu được)'],['no','Not needed']],'','upIntPol')}
    ${sChk('tnl','ueFull','UE hỗ trợ toàn vẹn UP tốc độ đầy đủ (Rel-16+)')}
    ${sSl('tnl','sess','Số phiên đang bật toàn vẹn',10,2000,10,v=>v)}${sSl('tnl','rate','Tốc độ mỗi phiên',1,500,1,v=>v+' Mbit/s')}${sSl('tnl','ipCap','Năng lực toàn vẹn UP của gNB-CU-UP',2,100,1,v=>v+' Gbit/s')}
   </div><div id="scUpi">${scUpi()}</div><p class="note">4G không có toàn vẹn UP: kẻ có trạm chuyển tiếp có thể đổi bit trong gói đã mã hoá (tấn công kiểu aLTEr chuyển hướng DNS). 5G cho phép bật toàn vẹn UP theo chính sách từng phiên; Rel-15 UE chỉ bắt buộc tới 64 kbit/s.</p></div></div>`;},
 after(){SCTN.t=0;SCTN.i=-1;SCTN.dots=[];this.draw(true);},
 draw(force){const L=SCTN.L,r=sPlay(SCTN,L,0,0),i=r.i;
  if(force||i!==SCTN.i){SCTN.i=i;const g=$('#scIke');if(g)g.innerHTML=sLadSvg(L,i,'t');const lg=$('#scIkeLog');if(lg)lg.innerHTML=sLadLog(L,Math.min(i,L.steps.length-1));}
  sLadDot(L,Math.min(i,L.steps.length-1),i>=L.steps.length?1:r.fr,'t');const tt=$('#scT-tnl');if(tt)tt.textContent=i>=L.steps.length?'Hết luồng':`Bước ${i+1}/${L.steps.length}`;},
 tick(dt){sPlay(SCTN,SCTN.L,dt,SCP.tnl.spd);this.draw(false);const g=$('#scTnlDots');if(!g)return;const P=SCP.tnl;
  if(!SCS.pause){SCTN.acc+=dt*3;while(SCTN.acc>1){SCTN.acc-=1;SCTN.dots.push({x:80});}SCTN.dots.forEach(d=>d.x+=dt*160);}
  SCTN.dots=SCTN.dots.filter(d=>d.x<830).slice(-30);
  g.innerHTML=SCTN.dots.map(d=>{const seg=d.x<120||d.x>790?null:d.x<=250?'fh':d.x<330?null:d.x<=460?'f1':d.x<540?null:d.x<=700?'bh':null;const on=seg?P[SCSEG[seg][4]]:true;return `<rect x="${d.x-6}" y="70" width="12" height="12" rx="3" class="scpk ${seg?(on?'enc':'clr'):'in'}"/>`;}).join('');},
 upd(k){if(k==='spd')return;if(k==='flt'){SCTN.L=scIkeSteps();SCTN.L.du=1.1;SCTN.t=0;this.draw(true);return;}
  if(k==='day'||k==='auto'){const c=$('#scCert');if(c)c.innerHTML=scCertTbl();return;}
  if(['pol','ueFull','sess','rate','ipCap'].includes(k)){const u=$('#scUpi');if(u)u.innerHTML=scUpi();return;}
  const a=$('#scTnlSvg');if(a)a.innerHTML=scTnlSvg();const o=$('#scOvh');if(o)o.innerHTML=scTnlOut();},
 act(a){if(a.startsWith('sg-')){SCP.tnl.sel=a.slice(3);const s=$('#scTnlSvg');if(s)s.innerHTML=scTnlSvg();const i=$('#scSegInfo');if(i)i.textContent=SCSEGD[SCP.tnl.sel];const o=$('#scOvh');if(o)o.innerHTML=scTnlOut();return;}
  const du=1.1,n=SCTN.L.steps.length;if(a==='next')SCTN.t=Math.min(n*du,(Math.floor(SCTN.t/du)+1)*du+0.01);else if(a==='prev')SCTN.t=Math.max(0,(Math.floor(SCTN.t/du)-1)*du+0.01);else if(a==='rst')SCTN.t=0;this.draw(true);}
};

/* ---------- Mục 5: Trạm giả / IMSI catcher, hạ cấp, DoS báo hiệu, phát hiện, NESAS/SCAS ---------- */
SCP.fbs={gen:'g4',ue:'multi',pw:30,suci:true,mrDet:true,ueDet:false,v:30,play:6,seed:4,
  nUe:20000,cap:400,uac:30,boff:15,ovl:true,nf:'gnb'};
const SCFB={t:0,R:null,lastDraw:-1,D:null,chk:{}};
const SCFBG=[['g2','Trạm 2G giả (GSM)'],['g4','eNB 4G giả'],['g5','gNB 5G SA giả']];
const SCFBU=[['sa','Máy chỉ 5G SA, tắt 2G'],['multi','Máy 4G/5G, vẫn bật 2G'],['legacy','Máy cũ 2G/3G/4G']];
const SCROADF=2000,SCLEG=[{x:250,y:120,p:46,l:'Trạm thật A'},{x:1700,y:120,p:46,l:'Trạm thật B'}],SCFBX={x:950,y:30};
function scFbSim(){const P=SCP.fbs,vms=P.v/3.6,T=SCROADF/vms,dt=0.2,n=Math.ceil(T/dt),r=nRng(P.seed*17+3),S=[],ev=[],msgs=[];
  const ue2g=P.ue!=='sa',ueGen=P.ue==='legacy'?'g4':'g5';let nIn=0,barred=false,tOn=0,exposed='',down=false,lost=0,det=-1,ueWarn=-1,authFail=0,inFbs=false,tEnter=-1;
  const sh=[0,0,0];const a=Math.exp(-vms*dt/50),b=Math.sqrt(1-a*a);
  const add=(t,p,m,ar,d,bad)=>msgs.push({t,p,m,a:ar,d:d||'',bad});
  for(let i=0;i<n;i++){const t=i*dt,x=Math.min(SCROADF,t*vms);for(let k=0;k<3;k++)sh[k]=a*sh[k]+b*nGs(r)*5;
    const rl=SCLEG.map((c,k)=>c.p-ndPLn(Math.hypot(x-c.x,c.y),2.1)+sh[k]),rs=Math.max(...rl),df=Math.hypot(x-SCFBX.x,SCFBX.y),rf=P.pw-ndPLn(df,2.1)+12+sh[2];
    /* UE có chọn trạm giả không: trạm giả phát ưu tiên cao, TAC lạ; 2G giả chỉ hút được UE còn bật 2G */
    const can=P.gen==='g2'?ue2g:P.gen==='g5'?ueGen==='g5':true,want=can&&!barred&&rf>rs+3&&rf>-110;
    if(want&&!inFbs&&nIn>0){inFbs=true;tEnter=t;nIn++;ev.push([t,'lại vào trạm giả','var(--warn)']);add(t,'RRC','Lại chọn trạm giả (mạnh hơn '+nF(rf-rs,1)+' dB)','UE','',1);}
    else if(want&&!inFbs){inFbs=true;tEnter=t;nIn++;ev.push([t,'vào trạm giả','var(--warn)']);
      if(P.gen==='g4'){add(t,'RRC','Chọn lại cell: trạm giả mạnh hơn '+nF(rf-rs,1)+' dB, TAC lạ','UE','',1);add(t+0.05,'NAS','Tracking Area Update Request','UE → eNB giả','');add(t+0.1,'NAS','Identity Request (IMSI) trước khi xác thực','eNB giả → UE','4G cho phép hỏi IMSI trước xác thực',1);add(t+0.15,'NAS','Identity Response: IMSI rõ','UE → eNB giả','IMSI bị lộ',1);exposed='IMSI';
        if(ue2g){add(t+0.25,'RRC','RRCConnectionRelease (chuyển hướng sang 2G)','eNB giả → UE','Ép hạ cấp xuống 2G không xác thực mạng',1);down=true;}else add(t+0.25,'NAS','TAU Reject (không bảo vệ)','eNB giả → UE','UE tạm mất dịch vụ 4G (DoS) đến khi chọn lại cell',1);}
      else if(P.gen==='g5'){add(t,'RRC','Chọn lại cell: gNB giả mạnh hơn '+nF(rf-rs,1)+' dB','UE','',1);add(t+0.05,'NAS','Registration Request (5G-GUTI hoặc SUCI)','UE → gNB giả','');add(t+0.1,'NAS','Identity Request','gNB giả → UE','');
        if(P.suci){add(t+0.15,'NAS','Identity Response: SUCI (mã hoá, đổi mỗi lần)','UE → gNB giả','Không lộ SUPI');exposed='';}else{add(t+0.15,'NAS','Identity Response: SUCI null-scheme','UE → gNB giả','MSIN lộ vì không cấp khoá nhà mạng',1);exposed='SUPI (null-scheme)';}
        add(t+0.2,'NAS','Authentication Request (AUTN giả)','gNB giả → UE','Không có K nên không tạo được MAC đúng');add(t+0.25,'NAS','Authentication Failure (#20 MAC failure)','UE → gNB giả','UE coi cell bị chặn, chọn lại cell thật',1);authFail++;
        if(P.ue==='multi'){add(t+0.3,'RRC','RRCRelease chuyển hướng (không bảo vệ)','gNB giả → UE','Nếu UE theo chuyển hướng xuống 2G thì vẫn có rủi ro',1);}}
      else{add(t,'RR','Chọn lại cell: BTS giả mạnh hơn','UE','2G không xác thực mạng',1);add(t+0.05,'MM','Location Updating Request','UE → BTS giả','');add(t+0.1,'MM','Identity Request (IMSI)','BTS giả → UE','',1);add(t+0.15,'MM','Identity Response: IMSI rõ','UE → BTS giả','',1);add(t+0.2,'RR','Ciphering Mode Command: A5/0 (không mã hoá)','BTS giả → UE','Cuộc gọi/SMS đi qua trạm giả có thể bị nghe',1);exposed='IMSI';down=true;}}
    if(inFbs&&P.gen!=='g5'&&rf<rs-3){inFbs=false;ev.push([t,'rời','var(--k1)']);}
    if(P.gen==='g5'&&inFbs&&t-tEnter>0.6){inFbs=false;barred=true;ev.push([t,'UE chặn cell giả','var(--k1)']);}
    if(inFbs){tOn+=dt;lost+=dt;}
    /* phát hiện phía mạng: UE ở trạm thật gửi MR thấy PCI lạ */
    if(P.mrDet&&det<0&&rf>-112&&!inFbs&&rf>rs-6){det=t;ev.push([t,'mạng phát hiện','var(--up)']);add(t,'RRC','MeasurementReport có PCI/CGI không có trong quy hoạch','UE → trạm thật','Hệ thống phát hiện trạm giả cảnh báo vị trí ước lượng');}
    if(P.ueDet&&ueWarn<0&&inFbs){ueWarn=t;add(t,'UE','Cảnh báo trên máy: mạng hỏi IMSI trước xác thực / ép 2G / không mã hoá','UE','Tính năng cảnh báo bảo mật di động trên một số hệ điều hành');}
    S.push({t,x,rs,rf,on:inFbs});}
  msgs.sort((a,b)=>a.t-b.t);
  return {T,S,ev,msgs,tOn,exposed,down,det,ueWarn,authFail};}
function scFbMap(){const R=SCFB.R,i=Math.min(R.S.length-1,Math.floor(SCFB.t/0.2)),s=R.S[i],W=720,H=190,X=x=>20+x/SCROADF*(W-40),Y=y=>160-y/140*130;
  let h=`<line x1="${X(0)}" y1="${Y(0)}" x2="${X(SCROADF)}" y2="${Y(0)}" class="ndroad"/>`;
  SCLEG.forEach(c=>{h+=`<circle cx="${X(c.x)}" cy="${Y(c.y)}" r="60" class="ndcov n"/><rect x="${X(c.x)-6}" y="${Y(c.y)-6}" width="12" height="12" class="ndbs n"/><text x="${X(c.x)}" y="${Y(c.y)-12}" class="u3x" text-anchor="middle">${nE(c.l)}</text>`;});
  const fr=18+SCP.fbs.pw*1.6;h+=`<circle cx="${X(SCFBX.x)}" cy="${Y(SCFBX.y)}" r="${fr}" class="scfbr"/><path d="M${X(SCFBX.x)} ${Y(SCFBX.y)-12} l8 14 h-16z" class="scfb"/><text x="${X(SCFBX.x)}" y="${Y(SCFBX.y)-16}" class="u3x" text-anchor="middle">Trạm giả (${nE(SCFBG.find(g=>g[0]===SCP.fbs.gen)[1])})</text>`;
  const ux=X(s.x),uy=Y(0);h+=`<line x1="${ux}" y1="${uy}" x2="${s.on?X(SCFBX.x):X(SCLEG[s.x<975?0:1].x)}" y2="${s.on?Y(SCFBX.y):Y(120)}" class="ndlnk ${s.on?'scw':'n'}"/><circle cx="${ux}" cy="${uy}" r="8" class="ndue${s.on?' scuebad':''}"/><text x="${ux}" y="${uy+22}" class="u3x" text-anchor="middle">UE ${s.on?'· trên trạm giả':''}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="u3svg" role="img" aria-label="UE đi qua vùng có trạm giả">${h}</svg>`;}
function scFbPlot(){const R=SCFB.R,pts=k=>R.S.filter((s,i)=>i%2===0).map(s=>[s.t,s[k]]),bands=[];let b0=null;R.S.forEach(s=>{if(s.on&&b0==null)b0=s.t;if(!s.on&&b0!=null){bands.push([b0,s.t,'var(--warn)',.18]);b0=null;}});if(b0!=null)bands.push([b0,R.T,'var(--warn)',.18]);
  const xt=[];for(let v=0;v<=R.T;v+=R.T>150?30:R.T>60?15:10)xt.push(v);
  return nPlot({w:680,h:200,x0:0,x1:R.T,y0:-130,y1:-40,yt:[-130,-110,-90,-70,-50],xt,series:[{pts:pts('rs'),c:'var(--nr)'},{pts:pts('rf'),c:'var(--warn)'}],bands,marks:R.ev.slice(0,10).map((e,i)=>[e[0],e[1],e[2],i%3]),cur:SCFB.t,ylab:'RSRP (dBm)',xlab:'thời gian (s)',aria:'RSRP trạm thật và trạm giả'});}
function scFbInd(){const P=SCP.fbs,R=SCFB.R;const L=[
  ['Báo cáo đo có PCI/CGI lạ (phía mạng)',P.mrDet,R.det>=0,'MR của UE ở cell thật thấy PCI không có trong quy hoạch, công suất bất thường.'],
  ['Authentication failure #20 tăng theo vùng',true,R.authFail>0,'Trạm giả không có K nên không tạo được AUTN đúng (5G/4G).'],
  ['TAU/Registration tăng đột biến ở cell biên',true,R.tOn>0,'UE quay lại mạng thật sau khi bị trạm giả đẩy ra.'],
  ['Mạng hỏi IMSI trước xác thực',P.ueDet,R.exposed==='IMSI','Bình thường hiếm; dấu hiệu IMSI catcher.'],
  ['Ép chuyển xuống 2G / không mã hoá (A5/0)',P.ueDet,R.down,'Tắt 2G trên máy loại bỏ đường hạ cấp này.']];
  return `<ul class="scind">${L.map(x=>`<li class="${x[2]?(x[1]?'hit':'miss'):'idle'}"><b>${nE(x[0])}</b><br><span class="note">${nE(x[3])}${x[2]&&!x[1]?' (chưa bật giám sát)':''}</span></li>`).join('')}</ul>`;}
function scFbOut(){const R=SCFB.R;return sKv('Thời gian bám trạm giả',nF(R.tOn,1)+' s',R.tOn?'scbad':'')+sKv('Danh tính lộ',R.exposed||'không',R.exposed?'scbad':'scok')+sKv('Bị hạ cấp',R.down?'có':'không',R.down?'scbad':'')+sKv('Mạng phát hiện',R.det>=0?'t = '+nF(R.det,1)+' s':'không',R.det>=0?'scok':'')+sKv('Cảnh báo trên máy',R.ueWarn>=0?'có':'không');}
/* bão báo hiệu */
function scDos(){const P=SCP.fbs,T=180,B=new Float64Array(T+260),ld=[],ok=[];for(let k=0;k<4;k++)B[k]+=P.nUe/4;  /* sau sự cố: gần như cùng lúc trong 4 s */
  const capEff=P.ovl?P.cap:P.cap*0.7;   /* không có overload control: AMF quá tải, hiệu suất giảm */
  const spread=(n,t0,a,b)=>{const w=Math.max(1,Math.round(b-a));for(let k=0;k<w;k++){const j=Math.min(B.length-1,t0+Math.round(a)+k);B[j]+=n/w;}};
  let done=0,rej=0,peak=0,t95=-1;
  for(let t=0;t<T;t++){const arr=B[t],adm=arr*(1-P.uac/100),barred=arr-adm;if(barred>0.01)spread(barred,t+1,0,Math.max(2,P.uac/5)*2);
    const srv=Math.min(adm,capEff),fail=adm-srv;done+=srv;rej+=fail;if(fail>0.01){if(P.ovl)spread(fail,t+1,P.boff*0.5,P.boff*1.5);else spread(fail,t+1,1,3);}
    const load=adm/P.cap*100;peak=Math.max(peak,load);ld.push([t,Math.min(load,400)]);ok.push([t,Math.min(100,done/P.nUe*100)]);if(t95<0&&done>=0.95*P.nUe)t95=t;}
  return {ld,ok,peak,rej,t95,T};}
function scDosPlot(D){const xt=[0,30,60,90,120,150,180];return nPlot({w:680,h:190,x0:0,x1:D.T,y0:0,y1:Math.max(120,Math.min(400,D.peak*1.05)),yt:[0,100,200,300,400].filter(v=>v<=Math.max(120,D.peak*1.05)),xt,series:[{pts:D.ld,c:'var(--warn)'},{pts:D.ok,c:'var(--k1)'}],hl:[[100,'var(--muted)','năng lực AMF']],ylab:'%',xlab:'giây sau sự cố',aria:'Tải AMF và tỉ lệ UE đã đăng ký lại'});}
/* NESAS / SCAS: danh mục kiểm thử mẫu theo NF (TS 33.117 chung + riêng) */
const SCSCAS=[
 ['gnb','gNB','33.511',['Không dùng NIA0 cho RRC/UP trừ khẩn cấp','Chọn thuật toán AS theo danh sách ưu tiên','Làm mới khoá khi PDCP COUNT sắp quay vòng','Bảo vệ F1/Xn/N2/N3 (IPsec/DTLS)','Kiểm tra replay của bản tin RRC']],
 ['cu','gNB tách CU/DU','33.523',['Bảo vệ F1-C, F1-U, E1','Phân tách CU-CP/CU-UP và khoá','Yêu cầu riêng cho DU']],
 ['amf','AMF','33.512',['Chọn thuật toán NAS và Security Mode Command','Từ chối NAS không toàn vẹn sau khi có bảo vệ','Kiểm tra RES*/HXRES*','Cấp lại 5G-GUTI','Chống phát lại NAS']],
 ['udm','UDM','33.514',['Giải mã SUCI (SIDF)','Đồng bộ SQN','Bảo vệ khoá nhà mạng']],
 ['ausf','AUSF','33.516',['So RES* với XRES*','Chỉ gửi KSEAF khi xác thực thành công','Xử lý đồng bộ lại']],
 ['sepp','SEPP','33.517',['Kiểm tra PLMN-ID với chứng thư N32','TLS N32-c, JWS/JWE PRINS','Ẩn topo']],
 ['upf','UPF','33.513',['Lọc gói GTP-U sai TEID','Bảo vệ N4/N3/N9','Không chuyển tiếp gói lạ']],
 ['smf','SMF','33.515',['Chính sách bảo mật UP (toàn vẹn, mã hoá)','Kiểm tra N4']],
 ['nrf','NRF','33.518',['Cấp OAuth 2.0 access token đúng phạm vi','Xác thực NF đăng ký']],
 ['nef','NEF','33.519',['Xác thực, phân quyền ứng dụng bên ngoài','Ẩn thông tin nội bộ']]];
const SCSCASG=['Quản lý tài khoản, mật khẩu (TS 33.117)','Ghi log sự kiện an ninh','Tắt dịch vụ, cổng không cần','Cứng hoá hệ điều hành, máy chủ web','Bảo vệ giao diện quản trị (TLS/SSH)','Quét lỗ hổng, fuzzing giao thức'];
function scScasHtml(){const P=SCP.fbs,n=SCSCAS.find(x=>x[0]===P.nf)||SCSCAS[0],list=n[3].concat(SCSCASG),c=SCFB.chk[n[0]]||{},done=list.filter((x,i)=>c[i]).length;
  return `<div class="e2go" style="margin-bottom:8px">${SCSCAS.map(x=>`<button type="button" class="btn sm${x[0]===n[0]?' pri':''}" data-sca="fbs:nf-${x[0]}">${nE(x[1])}</button>`).join('')}</div>
   <p class="e2x"><b>${nE(n[1])}</b> · TS ${n[2]} + TS 33.117 (yêu cầu chung)</p>
   <ul class="scchk">${list.map((x,i)=>`<li><label><input type="checkbox" data-sca="fbs:ck-${n[0]}-${i}"${c[i]?' checked':''}> ${nE(x)}${i<n[3].length?'':' <span class="note">(chung)</span>'}</label></li>`).join('')}</ul>
   ${nBars([['Đã kiểm',done/list.length*100,'var(--k1)']],100,' %',0)}`;}
SCR.fbs={
 html(){SCFB.R=scFbSim();SCFB.D=scDos();if(SCFB.t>SCFB.R.T)SCFB.t=0;
  return `<div class="panel"><h3>UE đi qua vùng có trạm giả</h3><div class="scroll"><div class="ndmap" id="scFbMap">${scFbMap()}</div></div>
   <div class="row"><button type="button" class="btn sm" data-sca="fbs:play" data-scplay>${SCS.pause?'▶ Chạy':'⏸ Dừng'}</button><button type="button" class="btn sm" data-sca="fbs:rst">⟲ Về đầu</button><button type="button" class="btn sm" data-sca="fbs:seed">Đổi bóng che</button><span class="note" id="scFbT"></span></div>
   <p class="note">Mô phỏng nhằm hiểu rủi ro và cách phát hiện, phòng vệ. Thiết bị phát trên tần số được cấp phép mà không có giấy phép là vi phạm pháp luật.</p></div>
  <div class="cols"><div>
   <div class="panel"><h3>RSRP trạm thật và trạm giả</h3><div class="scroll"><div class="ndw" id="scFbP">${scFbPlot()}</div></div><p class="legend"><span><i style="background:var(--nr)"></i>Trạm thật mạnh nhất</span><span><i style="background:var(--warn)"></i>Trạm giả</span><span><i style="background:var(--warn);opacity:.3"></i>UE đang bám trạm giả</span></p></div>
   <div class="panel"><h3>Nhật ký bản tin</h3><div id="scFbLog"></div></div>
  </div><div>
   <div class="panel"><h3>Kịch bản</h3><div class="ctl">
    ${sSel('fbs','gen','Loại trạm giả',SCFBG)}${sSel('fbs','ue','Loại máy',SCFBU)}
    ${sSl('fbs','pw','Công suất trạm giả',5,40,1,v=>v+' dBm')}
    <div class="c">${sChk('fbs','suci','SUCI có khoá nhà mạng (không null-scheme)','suciProfile')}${sChk('fbs','mrDet','Mạng phát hiện qua báo cáo đo','fbsDet')}${sChk('fbs','ueDet','Máy có cảnh báo bảo mật di động')}</div>
    ${sSl('fbs','v','Tốc độ UE',3,90,1,v=>v+' km/h')}${sSl('fbs','play','Tua nhanh',1,20,1,v=>'× '+v)}
   </div></div>
   <div class="panel"><h3>Kết quả lần chạy</h3><dl class="kv" id="scFbOut">${scFbOut()}</dl></div>
   <div class="panel"><h3>Chỉ báo phát hiện</h3><div id="scFbInd">${scFbInd()}</div></div>
  </div></div>
  <div class="panel"><h3>Mỗi thế hệ chống trạm giả đến đâu</h3><div class="scroll"><table class="ndtb"><thead><tr><th></th><th>2G</th><th>3G/4G</th><th>5G SA</th></tr></thead><tbody>
   <tr><td><b>Xác thực mạng</b></td><td>Không (chỉ mạng xác thực SIM)</td><td>Có (AKA hai chiều)</td><td>Có, mạng nhà xác nhận</td></tr>
   <tr><td><b>Lộ danh tính</b></td><td>IMSI khi bị hỏi</td><td>IMSI khi bị hỏi trước xác thực</td><td>Chỉ SUCI (trừ null-scheme)</td></tr>
   <tr><td><b>Nghe lén</b></td><td>A5/0 hoặc A5/1 yếu</td><td>Cần K; không nghe được nội dung</td><td>Cần K; thêm toàn vẹn UP tuỳ chọn</td></tr>
   <tr><td><b>Còn lại</b></td><td>—</td><td>Reject không bảo vệ (DoS), ép xuống 2G</td><td>Reject/Release không bảo vệ (DoS, hạ cấp nếu máy còn 2G), theo dõi qua phân trang</td></tr>
   <tr><td><b>Phòng vệ</b></td><td>Tắt 2G trên máy, mạng tắt 2G</td><td>Phát hiện qua MR, tắt 2G</td><td>SUCI, phát hiện qua MR (TS 33.501, phụ lục phát hiện trạm giả — cần đối chiếu), tắt 2G</td></tr></tbody></table></div></div>
  <div class="cols"><div class="panel"><h3>Bão báo hiệu sau sự cố</h3><div class="ctl">
    ${sSl('fbs','nUe','Số UE đăng ký lại',2000,60000,1000,v=>nF(v/1000)+' nghìn')}${sSl('fbs','cap','Năng lực AMF',100,2000,50,v=>v+' đăng ký/s')}
    ${sSl('fbs','uac','Chặn truy nhập (UAC barring)',0,90,5,v=>v+' %','','uac')}${sSl('fbs','boff','Back-off T3346 trung bình',2,60,1,v=>v+' s','','t3346')}
    <div class="c">${sChk('fbs','ovl','AMF dùng NGAP Overload Start + back-off','amfOvl')}</div></div>
   <div class="scroll"><div class="ndw" id="scDosP">${scDosPlot(SCFB.D)}</div></div><p class="legend"><span><i style="background:var(--warn)"></i>Tải AMF (% năng lực)</span><span><i style="background:var(--k1)"></i>% UE đã đăng ký lại</span></p><dl class="kv" id="scDosOut"></dl></div>
  <div class="panel"><h3>NESAS và SCAS</h3><p class="e2d">NESAS (GSMA) gồm hai phần: đánh giá quy trình phát triển và vòng đời sản phẩm của vendor, và đánh giá sản phẩm bởi phòng thử được công nhận theo SCAS của 3GPP. SCAS là bộ yêu cầu + ca kiểm thử cho từng loại NF (TS 33.5xx), dùng chung danh mục TS 33.117. Nhà mạng dùng kết quả NESAS làm điều kiện mua sắm và tự kiểm thử thêm khi nghiệm thu.</p><div id="scScas">${scScasHtml()}</div></div></div>`;},
 after(){this.dosOut();this.draw(true);},
 dosOut(){const D=SCFB.D,o=$('#scDosOut');if(o)o.innerHTML=sKv('Tải đỉnh',nF(D.peak)+' %',D.peak>150?'scbad':'')+sKv('Đăng ký bị từ chối (lần)',Math.round(D.rej))+sKv('Thời gian đạt 95 % UE',D.t95>=0?D.t95+' s':'> 180 s',D.t95<0||D.t95>60?'scwarn':'scok');},
 draw(force){const R=SCFB.R;if(!R)return;const k=Math.floor(SCFB.t*4);if(!force&&k===SCFB.lastDraw)return;SCFB.lastDraw=k;
  const m=$('#scFbMap');if(m)m.innerHTML=scFbMap();const p=$('#scFbP');if(p)p.innerHTML=scFbPlot();
  const L=$('#scFbLog');if(L){const ms=R.msgs.filter(x=>x.t<=SCFB.t),sl=ms.slice(-12);L.innerHTML=sLog(sl,sl.length-1);}
  const tt=$('#scFbT');if(tt){const i=Math.min(R.S.length-1,Math.floor(SCFB.t/0.2)),s=R.S[i];tt.textContent=`t = ${nF(SCFB.t,1)} / ${nF(R.T)} s · ${s.on?'đang bám trạm giả':'trạm thật'} · RSRP trạm giả ${nF(s.rf)} dBm`;}},
 tick(dt){if(!SCS.pause){SCFB.t+=dt*SCP.fbs.play;if(SCFB.t>SCFB.R.T)SCFB.t=0;}this.draw(dt===0);},
 upd(k){if(['play'].includes(k))return;if(['nUe','cap','uac','boff','ovl'].includes(k)){SCFB.D=scDos();const p=$('#scDosP');if(p)p.innerHTML=scDosPlot(SCFB.D);this.dosOut();return;}
  SCFB.R=scFbSim();if(SCFB.t>SCFB.R.T)SCFB.t=0;const o=$('#scFbOut');if(o)o.innerHTML=scFbOut();const d=$('#scFbInd');if(d)d.innerHTML=scFbInd();this.draw(true);},
 act(a,el){if(a==='rst'){SCFB.t=0;this.draw(true);}else if(a==='seed'){SCP.fbs.seed++;this.upd('seed');}
  else if(a.startsWith('nf-')){SCP.fbs.nf=a.slice(3);const s=$('#scScas');if(s)s.innerHTML=scScasHtml();}
  else if(a.startsWith('ck-')){const [,nf,i]=a.split('-');SCFB.chk[nf]=SCFB.chk[nf]||{};SCFB.chk[nf][i]=el.checked;const s=$('#scScas');if(s)s.innerHTML=scScasHtml();}}
};

/* ---------- Mục 6: Tham số, KPI, lỗi ---------- */
SCP.vd={grp:'all',q:'',kf:'all'};
/* [khoá, nhóm, tên/ý nghĩa 3GPP, Huawei, Nokia, Ericsson, điển hình, cờ: c = chuẩn 3GPP/thường gặp, v = cần đối chiếu] */
const SCPAR=[
 ['authMethod','Xác thực','authenticationMethod trong dữ liệu đăng ký UDM (5G_AKA, EAP_AKA_PRIME), TS 29.503','UDM: phương thức xác thực theo thuê bao/IMSI range','Cloud SDM: authentication method per profile','CCSM/UDM: authentication method (subscription)','5G_AKA cho đa số thuê bao','v'],
 ['suciProfile','Xác thực','Protection scheme (null, Profile A, Profile B) và HN public key id trên USIM (TS 31.102, EF SUCI_Calc_Info)','UDM SIDF: profile + key id','SIDF key management','CCSM SIDF: home network key','Profile A hoặc B, không null','v'],
 ['hnKey','Xác thực','Khoá riêng nhà mạng nhà cho SIDF, lưu HSM; xoay khoá theo key id','SIDF private key (HSM)','SIDF private key (HSM)','SIDF private key (HSM)','Xoay khoá có kế hoạch, giữ khoá cũ đến khi hết SIM cũ','v'],
 ['sqnDelta','Xác thực','Cửa sổ SQN: IND bit (5 bit), Δ, L (TS 33.102 Annex C)','AuC SQN scheme','SQN management','SQN management (CCSM)','IND 5 bit, Δ = 2^28','v'],
 ['reauth','Xác thực','Chính sách xác thực lại: mỗi Registration, định kỳ, khi đổi AMF','AMF: re-authentication policy','CMM: authentication frequency','PCC/AMF: authentication policy','Mỗi đăng ký ban đầu và định kỳ','v'],
 ['t3560','Xác thực','T3560 (AMF chờ Authentication Response / SM Complete), phát lại tối đa 4 lần','AMF NAS timer T3560','CMM T3560','PCC T3560','6 s','c'],
 ['t3520','Xác thực','T3520 (UE sau Authentication Failure), cố định trong TS 24.501','—','—','—','15 s','c'],
 ['nasCiph','Bảo vệ NAS/AS','Danh sách ưu tiên NEA cho NAS ở AMF','AMF: NAS ciphering algorithm priority','CMM: NAS encryption algorithm list','PCC: nasCipheringAlgorithms','NEA2 > NEA3 > NEA1','v'],
 ['nasInt','Bảo vệ NAS/AS','Danh sách ưu tiên NIA cho NAS ở AMF','AMF: NAS integrity algorithm priority','CMM: NAS integrity algorithm list','PCC: nasIntegrityAlgorithms','NIA2 > NIA3 > NIA1','v'],
 ['asCiph','Bảo vệ NAS/AS','Danh sách ưu tiên NEA cho RRC/UP ở gNB','gNB: cipher algorithm priority (GNBCIPHERCAP)','gNB: ciphering algorithm priority','GNBCUCPFunction: cipheringAlgorithmPrio','NEA2 > NEA3 > NEA1','v'],
 ['nullAlg','Bảo vệ NAS/AS','Cho phép NEA0/NIA0 (chỉ khẩn cấp không xác thực)','Null algorithm switch','actNullAlgorithms','nullIntegrityAllowed (khẩn cấp)','Tắt cho thuê bao thường','v'],
 ['keyRefresh','Bảo vệ NAS/AS','Làm mới KgNB khi PDCP COUNT gần quay vòng (intra-cell HO)','PDCP COUNT key refresh','Key refresh threshold','Key change / intra-cell HO','Tự động','v'],
 ['upIntPol','UP và truyền dẫn','Chính sách UP integrity/confidentiality theo DNN/S-NSSAI ở SMF (Required/Preferred/Not needed)','SMF: UP security policy','SMF (CMG): UP security policy','SMF (PCC): upSecurityPolicy','Preferred cho dịch vụ nhạy, Not needed cho eMBB','v'],
 ['ipsecProp','UP và truyền dẫn','Đề xuất IKEv2/ESP: AES-GCM, PRF SHA-256, DH group 19/20, lifetime','IKEPEER, IKECFG, IPSECPROPOSAL, IPSECPOLICY','IPSECC / IKE profile (AirScale)','Ikev2PolicyProfile, IpsecProposalProfile, IpsecTunnel','AES-GCM-256, group 20, IKE 24 h','v'],
 ['dpd','UP và truyền dẫn','Dead Peer Detection của IKEv2','IKEPEER DPD','DPD interval','Ikev2PolicyProfile: dpdTime','10–30 s','v'],
 ['f1Sec','UP và truyền dẫn','Bảo vệ F1 (IPsec hoặc DTLS) giữa DU và CU','F1 IPsec policy','F1 security','F1 IPsec (TermPointToGNBDU)','Bật khi F1 qua mạng không tin cậy','v'],
 ['macsec','UP và truyền dẫn','MACsec fronthaul (cipher suite GCM-AES-128/256, MKA)','Fronthaul MACsec (RRU–BBU)','Fronthaul MACsec','Fronthaul MACsec (Radio–Baseband)','Tuỳ mức rủi ro vị trí cáp','v'],
 ['mtuBh','UP và truyền dẫn','MTU backhaul và MSS clamp cho N3 qua IPsec','MTU / TCP MSS adjust','MTU','mtu (IpInterface)','≥ 1600 B hoặc hạ MTU UE','v'],
 ['certRenew','Chứng thư','Gia hạn chứng thư tự động qua CMPv2 (TS 33.310), ngưỡng trước hạn','CERTMK, CERTCHKTSK (tự động)','CMPv2 auto renewal','CertM: enrollment, renewal','30–60 ngày trước hạn','v'],
 ['crl','Chứng thư','Kiểm tra thu hồi CRL/OCSP và hành vi khi không tới được','CRL check policy','CRL/OCSP','CertM: crlCheck','CRL nội bộ, fail-closed có kiểm soát','v'],
 ['n32Sec','Roaming','Phương thức N32-f: TLS hoặc PRINS, danh sách đối tác và trust anchor','SEPP: N32 security','SEPP: N32 config','SC SEPP: N32 peer','TLS khi đi thẳng; PRINS qua IPX','v'],
 ['ss7fw','Roaming','Chính sách tường lửa SS7 theo GSMA FS.11 (loại 1/2/3)','Tường lửa SS7 (sản phẩm đối tác)','Signaling firewall','Signaling firewall đối tác','Bật cả 3 loại, chế độ chặn','v'],
 ['diaFw','Roaming','Tường lửa Diameter theo GSMA FS.19','DRA/DEA policy','DEA (Diameter Edge Agent)','DSC (Diameter Signaling Controller)','Kiểm tra realm/host','v'],
 ['gtpFw','Roaming','Tường lửa GTP-C/U theo GSMA FS.20','GTP firewall','GTP firewall','GTP firewall đối tác','Kiểm tra trạng thái phiên','v'],
 ['fbsDet','Phát hiện, chống DoS','Phát hiện trạm giả từ báo cáo đo (PCI/CGI lạ) và ANR bất thường','Rogue cell detection (cần đối chiếu)','Fake cell detection (SON)','Fake base station detection (cần đối chiếu)','Bật ở vùng nhạy cảm','v'],
 ['uac','Phát hiện, chống DoS','Unified Access Control (barring factor/time theo access category, SIB25)','UAC parameters (gNB)','UAC barring','UAC (NRCellCU)','Bật khi quá tải','v'],
 ['t3346','Phát hiện, chống DoS','Back-off T3346 do AMF trả khi quá tải (Registration Reject #22)','AMF overload back-off','CMM back-off timer','PCC: congestion back-off','15–30 phút cho bão lớn','v'],
 ['amfOvl','Phát hiện, chống DoS','NGAP Overload Start/Stop, giảm phần trăm tín hiệu từ gNB','AMF overload control','CMM overload','PCC overload protection','Bật','v']
];
/* [KPI, công thức, bộ đếm Huawei, Nokia, Ericsson, mục tiêu, mục, id KPI ở thẻ KPI] */
const SCKPI=[
 ['Tỉ lệ xác thực thành công (5G-AKA/EAP-AKA′)','Xác thực thành công / yêu cầu xác thực × 100 (AMF hoặc AUSF)','AMF: authentication success/attempt','CMM: authentication counters','PCC: authentication counters','≥ 99,5 %','aka','s_suci'],
 ['Tỉ lệ Synch failure (AUTS)','Authentication Failure #21 / Authentication Request × 100','AMF: auth failure cause 21','CMM: sync failure','PCC: sync failure','≤ 0,5 %','aka','s_synch'],
 ['Tỉ lệ MAC failure','Authentication Failure #20 / Authentication Request × 100','AMF: auth failure cause 20','CMM: MAC failure','PCC: MAC failure','≤ 0,1 %; tăng theo vùng: nghi trạm giả','aka','s_macf'],
 ['Tỉ lệ giải mã SUCI lỗi','Giải mã SUCI lỗi / tổng SUCI nhận × 100 (UDM/SIDF)','UDM: SUCI de-concealment fail','Cloud SDM: SIDF failure','CCSM: SIDF failure','≈ 0 %','aka','s_sucif'],
 ['Tỉ lệ Authentication Reject','Authentication Reject / Authentication Request × 100','AMF: auth reject','CMM: auth reject','PCC: auth reject','Theo dõi đột biến','aka',''],
 ['NAS Security Mode thành công','Security Mode Complete / Security Mode Command × 100','AMF: NAS SMC succ/att','CMM: SMC','PCC: SMC','≥ 99,9 %','key','s_smc'],
 ['AS Security Mode thành công','RRC SecurityModeComplete / SecurityModeCommand × 100 (gNB)','gNB: RRC SMC succ/att','gNB: SMC','gNB: SMC','≥ 99,9 %','key',''],
 ['Lỗi kiểm tra toàn vẹn (NAS/PDCP)','Số bản tin bị bỏ do MAC sai, theo cell/AMF','Integrity check failure','Integrity failure','Integrity failure','Gần 0; tăng sau HO: nghi lệch khoá/NCC','key',''],
 ['N32-c thiết lập thành công','Phiên N32-c TLS thành công / thử × 100','SEPP counters','SEPP counters','SC SEPP counters','≈ 100 %','roam','s_sepp'],
 ['Bản tin liên mạng bị chặn','Bị chặn / tổng bản tin liên mạng (SS7/Diameter/GTP) theo loại','Firewall báo hiệu','Firewall báo hiệu','Firewall báo hiệu','Theo dõi đột biến, xét chặn nhầm','roam','s_sig'],
 ['IKE/IPsec thiết lập thành công','IKE_SA thành công / thử × 100','IKE SA setup succ/att','IPsec tunnel counters','Ikev2 SA counters','≥ 99,9 %','tnl','s_ike'],
 ['Đường hầm IPsec sẵn sàng','Thời gian đường hầm lên / tổng thời gian × 100','IPsec tunnel availability','Tunnel availability','IpsecTunnel operationalState','≥ 99,99 %','tnl','s_vpn'],
 ['Chứng thư sắp hết hạn','Số chứng thư còn ≤ 30 ngày','CERTCHKTSK alarm','Certificate expiry alarm','CertM expiry alarm','0','tnl','s_cert'],
 ['Cảnh báo trạm giả','Số sự kiện PCI/CGI lạ trong báo cáo đo theo vùng','Rogue cell alarm (cần đối chiếu)','SON fake cell','—','Điều tra mọi cảnh báo','fbs','']
];
/* [tiêu đề, triệu chứng, nguyên nhân[], kiểm tra[], gợi ý vendor {h,n,e}, KPI, mục] */
const SCFLT=[
 ['Synch failure tăng đột biến','Nhiều Authentication Failure #21, đăng ký chậm',['Khôi phục UDM/HSS từ bản sao cũ làm SQN lùi','Chuyển thuê bao giữa hai HSS/UDM chưa đồng bộ SQN','SIM dùng trên mạng thử'],['Thời điểm tăng so với thay đổi phía UDM','Phân bố theo IMSI range','Có tự đồng bộ thành công sau AUTS'],{h:'Kiểm tra SQN trên UDM/HSS sau khôi phục',n:'Kiểm tra SQN management Cloud SDM',e:'Kiểm tra CCSM SQN sau migrate'},'Tỉ lệ Synch failure (AUTS)','aka'],
 ['MAC failure theo lô SIM','#20 tập trung một dải IMSI',['K/OPc nạp sai','Thuật toán sai (MILENAGE/TUAK, hằng số)'],['So dải IMSI lỗi với lô SIM','Đối chiếu file nạp SIM với UDM'],{h:'Kiểm tra dữ liệu Ki/OPc',n:'Kiểm tra SIM profile',e:'Kiểm tra CCSM credential'},'Tỉ lệ MAC failure','aka'],
 ['MAC failure theo vùng','#20 tăng ở vài cell, đủ loại SIM',['Trạm giả trong vùng','Cell lạ phát cùng PLMN'],['Báo cáo đo có PCI/CGI lạ','So với bản đồ trạm'],{h:'Bật phát hiện rogue cell',n:'SON fake cell',e:'Kiểm tra ANR, PCI lạ'},'Cảnh báo trạm giả','fbs'],
 ['SUCI không giải mã được','Registration Reject sau khi gửi SUCI, theo lô SIM',['Key id trên SIM không có ở SIDF','Xoay khoá chưa đồng bộ','Profile B nhưng SIDF chỉ hỗ trợ A'],['Key id và scheme trong SUCI','Cấu hình khoá SIDF'],{h:'Kiểm tra SIDF key',n:'Kiểm tra SIDF key',e:'Kiểm tra SIDF key'},'Tỉ lệ giải mã SUCI lỗi','aka'],
 ['5G SA lỗi đăng ký, 4G vẫn được','Thuê bao vào 4G bình thường, 5G SA bị từ chối',['Thiếu dữ liệu 5G trong UDM','Routing Indicator sai làm AMF chọn sai AUSF','SN name không cho phép'],['Trace Nausf/Nudm','Routing Indicator trên SIM'],{h:'Kiểm tra AUSF/UDM routing',n:'Kiểm tra NRF discovery AUSF',e:'Kiểm tra SC/NRF routing'},'Tỉ lệ xác thực thành công (5G-AKA/EAP-AKA′)','aka'],
 ['Security Mode Reject #23','UE từ chối NAS SMC',['Khả năng bảo mật UE bị sửa hoặc lưu sai ở AMF','Lỗi phần mềm UE/AMF khi mã hoá danh sách'],['So UE security capabilities ở Registration và SMC','Lọc theo dòng máy'],{h:'Trace NAS SMC',n:'Trace NAS SMC',e:'Trace NAS SMC'},'NAS Security Mode thành công','key'],
 ['RRC SecurityModeFailure','Lỗi AS SMC ở một số cell',['gNB chọn thuật toán UE không hỗ trợ','Lỗi phần mềm/license thuật toán'],['Danh sách ưu tiên AS','UE capabilities'],{h:'Kiểm tra GNBCIPHERCAP/GNBINTEGRITYCAP',n:'Kiểm tra danh sách thuật toán gNB',e:'Kiểm tra cipheringAlgorithmPrio'},'AS Security Mode thành công','key'],
 ['Lỗi toàn vẹn PDCP sau chuyển giao','RLF/re-establishment ngay sau HO',['NCC/NH lệch giữa gNB nguồn, đích','Lỗi tính KgNB* với PCI/ARFCN'],['Trace HO, NCC','Phân bố theo cặp cell'],{h:'Trace Xn HO',n:'Trace Xn HO',e:'Trace Xn HO'},'Lỗi kiểm tra toàn vẹn (NAS/PDCP)','key'],
 ['Tốc độ giảm khi bật toàn vẹn UP','Throughput phiên giảm, CPU CU-UP cao',['UE không hỗ trợ tốc độ đầy đủ','Năng lực toàn vẹn UP của CU-UP thấp'],['Chính sách UP theo DNN','Tải CU-UP'],{h:'Kiểm tra UP security policy',n:'Kiểm tra UP security policy',e:'Kiểm tra upSecurityPolicy'},'—','tnl'],
 ['N32-c thất bại với một đối tác','Roaming 5G với đối tác không chạy',['Chứng thư hết hạn','Trust anchor/PLMN-ID sai','Firewall chặn TLS'],['TLS alert trong log SEPP','Hạn chứng thư hai phía'],{h:'Kiểm tra SEPP N32 peer',n:'Kiểm tra SEPP peer',e:'Kiểm tra SC SEPP peer'},'N32-c thiết lập thành công','roam'],
 ['Roaming bị chặn nhầm','Khách roaming không đăng ký được, firewall báo chặn',['Quy tắc loại 3 quá chặt','Danh sách đối tác thiếu GT/realm'],['Log firewall theo bản tin','Danh sách GT/realm đối tác'],{h:'Kiểm tra whitelist',n:'Kiểm tra whitelist',e:'Kiểm tra whitelist'},'Bản tin liên mạng bị chặn','roam'],
 ['Trạm mất dịch vụ do IKE','Cell out of service, IKE AUTHENTICATION_FAILED',['Chứng thư hết hạn','NTP lệch','CRL không tới được'],['Hạn chứng thư, đồng bộ thời gian','Log SecGW'],{h:'Kiểm tra CERTCHKTSK, NTP',n:'Kiểm tra CMPv2, NTP',e:'Kiểm tra CertM, NTP'},'Chứng thư sắp hết hạn','tnl'],
 ['Mất gói lớn qua IPsec','Web chậm, tải lớn lỗi, ping nhỏ được',['Phân mảnh sau ESP vượt MTU','Firewall bỏ mảnh IP'],['Ping với DF ở các cỡ gói','MSS clamp'],{h:'Chỉnh MTU/TCP MSS',n:'Chỉnh MTU',e:'Chỉnh mtu'},'Đường hầm IPsec sẵn sàng','tnl'],
 ['UE bị ép xuống 2G trong vùng','Tỉ lệ thuê bao 2G tăng bất thường ở một khu',['Trạm giả chuyển hướng','Cấu hình chuyển hướng sai'],['Báo cáo đo PCI lạ','Lệnh Release with redirect'],{h:'Rogue cell detection',n:'SON',e:'ANR'},'Cảnh báo trạm giả','fbs'],
 ['Bão đăng ký sau sự cố','AMF quá tải sau khi khôi phục',['Mọi UE đăng ký lại cùng lúc','Không có back-off, UAC'],['Tải AMF theo giây','Registration Reject #22'],{h:'Bật overload control, T3346',n:'Bật CMM overload',e:'Bật PCC overload'},'Tỉ lệ xác thực thành công (5G-AKA/EAP-AKA′)','fbs']
];
function scParRows(){const P=SCP.vd,q=P.q.trim().toLowerCase(),v=nVn();
  const rows=SCPAR.filter(r=>(P.grp==='all'||r[1]===P.grp)&&(!q||r.join(' ').toLowerCase().includes(q)));
  const cols=v==='3gpp'?[3,4,5]:[{huawei:3,nokia:4,ericsson:5}[v]];
  return rows.map(r=>`<tr><td><span class="chip">${nE(r[1])}</span><br>${nE(r[2])}</td>${cols.map(c=>`<td class="u3tag">${nE(r[c])}</td>`).join('')}<td>${nE(r[6])}</td><td>${r[7]==='v'?'<span class="kpC mid">Cần đối chiếu</span>':'<span class="kpC ok">Theo chuẩn</span>'}</td></tr>`).join('')||'<tr><td colspan="6">Không có tham số khớp.</td></tr>';}
function scParHead(){const v=nVn();return `<tr><th>Tham số (3GPP / ý nghĩa)</th>${v==='3gpp'?'<th>Huawei</th><th>Nokia</th><th>Ericsson</th>':`<th>${nVName(v)}</th>`}<th>Điển hình</th><th>Độ tin cậy tên</th></tr>`;}
function scKpiRows(){const v=nVn(),f=SCP.vd.kf;return SCKPI.filter(k=>f==='all'||k[6]===f).map(k=>`<tr><td><b>${nE(k[0])}</b>${k[7]&&typeof KL!=='undefined'&&KL.find(x=>x.id===k[7])?`<br><button type="button" class="u3lnkbtn" data-scgo="kpi:${k[7]}">Mở ở thẻ KPI →</button>`:''}</td><td>${nE(k[1])}</td><td class="u3tag">${v==='3gpp'?['Huawei: '+k[2],'Nokia: '+k[3],'Ericsson: '+k[4]].map(nE).join('<br>'):nE(k[{huawei:2,nokia:3,ericsson:4}[v]])}<br><span class="kpC mid">cần đối chiếu</span></td><td>${nE(k[5])}</td><td><button type="button" class="btn sm" data-scgo="sc:${k[6]}">Mô phỏng →</button></td></tr>`).join('');}
function scFltHtml(){const v=nVn();return SCFLT.map(f=>`<details class="u3flt ndflt scflt"><summary><b>${nE(f[0])}</b></summary><p class="e2d">${nE(f[1])}</p><div class="u3two"><div><b>Nguyên nhân</b><ul class="u3ul">${f[2].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div><div><b>Kiểm tra</b><ul class="u3ul">${f[3].map(x=>`<li>${nE(x)}</li>`).join('')}</ul></div></div><p class="note">${v==='3gpp'?['Huawei: '+f[4].h,'Nokia: '+f[4].n,'Ericsson: '+f[4].e].map(nE).join(' · '):nVName(v)+': '+nE(f[4][v[0]])} (cần đối chiếu) · KPI: ${nE(f[5])} · <button type="button" class="u3lnkbtn" data-scgo="sc:${f[6]}">Xem mô phỏng →</button></p></details>`).join('');}
function scCalc(){const g=id=>{const e=$('#'+id);return e?+e.value:0;},o=$('#sccOut');if(!o)return;
  const rq=g('sccReq'),ok=g('sccOk'),sy=g('sccSy'),mf=g('sccMf'),su=g('sccSu'),sn=g('sccSn'),sa=g('sccSa'),sc=g('sccSc'),na=g('sccNa'),nc=g('sccNc'),ia=g('sccIa'),ic=g('sccIc');const p=(a,b,d)=>b?nF(a/b*100,d||2)+' %':'—';
  o.innerHTML=sKv('Tỉ lệ xác thực thành công',p(ok,rq))+sKv('Tỉ lệ Synch failure',p(sy,rq),sy/Math.max(1,rq)>0.005?'scwarn':'')+sKv('Tỉ lệ MAC failure',p(mf,rq),mf/Math.max(1,rq)>0.001?'scbad':'')+sKv('Tỉ lệ giải mã SUCI lỗi',p(su,sn,3))+sKv('NAS SMC thành công',p(sc,sa))+sKv('N32-c thành công',p(nc,na))+sKv('IKE thành công',p(ic,ia));}
SCR.vd={
 html(){const P=SCP.vd,grps=[...new Set(SCPAR.map(r=>r[1]))];
  return `<div class="panel"><h3>Bảng tham số bảo mật và xác thực</h3><p class="hint">Chọn vendor ở thanh trên để chỉ hiện cột của vendor đó. Tên gắn “Cần đối chiếu” là tên thường gặp, phải kiểm tra theo tài liệu release đang dùng.</p>
   <div class="ctl" style="margin-bottom:10px">${sSel('vd','grp','Nhóm',[['all','Tất cả']].concat(grps.map(g=>[g,g])))}<label class="c"><span class="cl">Lọc</span><input type="search" id="scvq" value="${nE(P.q)}" placeholder="Ví dụ: NEA, T3560, IKE"></label></div>
   <div class="scroll"><table class="ndtb"><thead id="scParH">${scParHead()}</thead><tbody id="scParB">${scParRows()}</tbody></table></div></div>
  <div class="panel"><h3>KPI theo dõi</h3><div class="ctl" style="margin-bottom:10px">${sSel('vd','kf','Theo mục',[['all','Tất cả']].concat(SCV.filter(v=>v[0]!=='vd').map(v=>[v[0],v[1]])))}</div>
   <div class="scroll"><table class="ndtb"><thead><tr><th>KPI</th><th>Công thức</th><th>Bộ đếm</th><th>Mục tiêu</th><th></th></tr></thead><tbody id="scKpB">${scKpiRows()}</tbody></table></div>
   <div class="u3calc"><b>Tính nhanh từ bộ đếm</b><div class="ctl ndcalc sccalc" style="margin-top:8px">
    ${[['sccReq','Yêu cầu xác thực',250000],['sccOk','Xác thực thành công',248900],['sccSy','Authentication Failure #21',620],['sccMf','Authentication Failure #20',85],['sccSn','SUCI nhận ở SIDF',180000],['sccSu','SUCI giải mã lỗi',3],['sccSa','NAS SMC gửi',248000],['sccSc','NAS SMC Complete',247900],['sccNa','N32-c thử',120],['sccNc','N32-c thành công',118],['sccIa','IKE_SA thử',5400],['sccIc','IKE_SA thành công',5396]].map(r=>`<label class="c"><span class="cl">${r[1]}</span><input type="number" id="${r[0]}" value="${r[2]}" min="0"></label>`).join('')}
   </div><dl class="kv" id="sccOut" style="margin-top:8px"></dl></div></div>
  <div class="panel"><h3>Lỗi thường gặp và cách kiểm tra</h3>${scFltHtml()}</div>
  <div class="panel"><h3>Tiêu chuẩn tham chiếu</h3><ul class="u3ul"><li>TS 33.501: kiến trúc và thủ tục bảo mật 5G (5G-AKA, EAP-AKA′, SUCI, khoá, SEPP, NDS)</li><li>TS 33.401 (4G), TS 33.102 (3G), TS 33.220 Annex B (KDF)</li><li>TS 33.210 (NDS/IP, IPsec), TS 33.310 (chứng thư, CMPv2)</li><li>TS 24.501 (5GMM cause, T3520, T3560), TS 29.503 (Nudm), TS 29.509 (Nausf), TS 29.573 (N32)</li><li>TS 33.117 và TS 33.511–33.537 (SCAS); GSMA NESAS; GSMA FS.11, FS.19, FS.20</li><li>RFC 9048 (EAP-AKA′), RFC 7748 (X25519), RFC 7296 (IKEv2), RFC 7383 (IKEv2 fragmentation), IEEE 802.1AE (MACsec)</li></ul></div>`;},
 after(){scCalc();},
 upd(k){if(k==='grp'){const b=$('#scParB');if(b)b.innerHTML=scParRows();}if(k==='kf'){const b=$('#scKpB');if(b)b.innerHTML=scKpiRows();}}
};
document.addEventListener('input',e=>{const t=e.target;if(t.id==='scvq'){SCP.vd.q=t.value;const b=$('#scParB');if(b)b.innerHTML=scParRows();}else if(t.id&&/^scc/.test(t.id))scCalc();});

/* ---------- Gắn thẻ vào ứng dụng: RENDER, KPI mới, tìm kiếm chung, liên kết E2E/KPI/thẻ cũ ---------- */
RENDER.sc=renderSc;
/* KPI mới cho thẻ KPI mạng (nhóm Bảo mật) */
(function(){if(typeof K!=='function'||typeof KL==='undefined')return;try{
  if(typeof KPB!=='undefined'&&!KPB.sec_smc)KPB.sec_smc={t:"NAS/AS Security Mode thất bại",
    st:["Tách NAS SMC (AMF) và AS SMC (gNB): xem bản tin nào bị từ chối hoặc hết giờ (T3560).","NAS: đọc 5GMM cause trong Security Mode Reject; #23 là khả năng bảo mật UE không khớp (bị sửa trên đường hoặc lưu sai).","AS: kiểm tra thuật toán gNB chọn có trong khả năng UE; xem license thuật toán (NEA3/ZUC).","Lọc theo dòng máy (TAC) và phiên bản phần mềm AMF/gNB; lỗi cụm theo máy là lỗi tương thích.","Kiểm tra danh sách ưu tiên NEA/NIA và việc cấm NEA0/NIA0."],
    ca:["Khả năng bảo mật UE bị sửa hoặc mã hoá sai","Thuật toán không hỗ trợ / thiếu license","Lỗi tính khoá (KAMF, KgNB) sau đổi AMF","Hết giờ do vô tuyến yếu"],
    pa:["Danh sách ưu tiên NEA/NIA ở AMF và gNB","Cho phép null algorithm","T3560"],cs:[],gen:1};
  const add=(a)=>{if(KL.some(k=>k.id===a[0]))return;K(...a);};
  add(["s_synch","SEC","sec","sat","Tỉ lệ Synch failure khi xác thực (AUTS)","ue,core,udm","sec_auth","g|%|0|3|d|0.5|1.5|0.2",
   "Synch failure % = Authentication Failure (cause #21) / Authentication Request × 100.","TS 33.102 §6.3.5 và Annex C (đồng bộ SQN), TS 24.501 (5GMM cause #21), TS 33.501 §6.1.3.",
   "?Counter lỗi xác thực theo cause ở AMF","?Counter lỗi xác thực theo cause ở AMF","?Counter lỗi xác thực theo cause ở AMF",
   "USIM thấy SQN không mới hơn: mạng phải đồng bộ lại bằng AUTS, kéo dài đăng ký.","Thấp, ổn định; tăng đột biến sau khôi phục hay chuyển dữ liệu UDM.",
   "core>ue:Authentication Request!A;ue>core:Authentication Failure #21 (AUTS);core>udm:Đồng bộ lại (RAND, AUTS);udm>core:Vector mới","t33501_suci"]);
  add(["s_macf","SEC","sec","sat","Tỉ lệ MAC failure khi xác thực","ue,core","sec_auth","g|%|0|1|d|0.1|0.5|0.02",
   "MAC failure % = Authentication Failure (cause #20) / Authentication Request × 100.","TS 33.501 §6.1.3, TS 24.501 (5GMM cause #20).",
   "?Counter lỗi xác thực theo cause ở AMF","?Counter lỗi xác thực theo cause ở AMF","?Counter lỗi xác thực theo cause ở AMF",
   "UE không xác thực được mạng: K/OPc sai theo lô SIM hoặc trạm giả trong vùng.","Rất thấp; tăng theo vùng là dấu hiệu trạm giả.",
   "core>ue:Authentication Request!A;ue>core:Authentication Failure #20 (MAC failure)","t33501_suci"]);
  add(["s_sucif","SEC","sec","sat","Tỉ lệ giải mã SUCI lỗi (SIDF)","udm","sec_auth","g|%|0|1|d|0.01|0.1|0.002",
   "SUCI lỗi % = SUCI không giải mã được / SUCI nhận ở SIDF × 100.","TS 33.501 §6.12.2 (SUCI), Annex C (ECIES).",
   "?Counter SIDF ở UDM","?Counter SIDF ở UDM","?Counter SIDF ở UDM",
   "SIDF không giải được SUCI (khoá/key id/scheme không khớp) nên UE không đăng ký được 5G.","Gần 0.",
   "ue>core:Registration Request (SUCI)!A;core>udm:Nudm_UEAuthentication_Get (SUCI);udm>core:Lỗi giải mã","t33501_suci"]);
  add(["s_smc","SEC","sec","sat","Tỉ lệ NAS Security Mode thành công","ue,core","sec_smc","r",
   "NAS SMC SR = Security Mode Complete / Security Mode Command × 100.","TS 33.501 §6.7.2 (NAS SMC), §6.7.4 (AS SMC); TS 24.501.",
   "?Counter NAS SMC ở AMF","?Counter NAS SMC ở AMF","?Counter NAS SMC ở AMF",
   "Không có SMC thành công thì không có bảo vệ NAS, phiên dừng.","Gần 100 %.",
   "core>ue:Security Mode Command!A;ue>core:Security Mode Complete!S","t33501_suci"]);
  const XN={s_synch:["Tỉ lệ lỗi đồng bộ SQN khi xác thực","Synch Fail","AUTS|Synch failure|SQN|cause 21","Tỉ lệ lần xác thực UE báo Synch failure (cause #21, kèm AUTS). Mạng đồng bộ lại SQN rồi xác thực lần nữa nên đăng ký chậm hơn; tăng đột biến thường do khôi phục hoặc chuyển dữ liệu UDM/HSS."],
    s_macf:["Tỉ lệ MAC failure khi xác thực","MAC Fail","MAC failure|cause 20|XMAC","Tỉ lệ lần USIM không xác thực được mạng (cause #20). Theo lô SIM là lỗi K/OPc; theo vùng là dấu hiệu trạm giả."],
    s_sucif:["Tỉ lệ giải mã SUCI lỗi","SUCI Fail","SIDF|de-concealment|SUCI decode","Tỉ lệ SUCI mà SIDF ở UDM không giải mã được do khoá, key id hay scheme không khớp với SIM."],
    s_smc:["Tỉ lệ NAS Security Mode thành công","NAS SMC SR","SMC|Security Mode|NAS security","Tỉ lệ AMF bật được bảo vệ NAS (chọn NEA/NIA) sau xác thực. Lỗi do khả năng bảo mật UE không khớp (#23) hoặc thuật toán."]};
  const EN={s_synch:"Authentication Synchronisation Failure Rate (AUTS)",s_macf:"Authentication MAC Failure Rate",s_sucif:"SUCI De-concealment Failure Rate",s_smc:"NAS Security Mode Command Success Rate"};
  for(const id in XN){const k=KL.find(x=>x.id===id);if(!k)continue;const x=XN[id];if(typeof KX!=='undefined')KX[id]=x;if(typeof KEN!=='undefined')KEN[id]=EN[id];
    k.fn=x[0];k.ab=[x[1]].concat(x[2].split('|'));k.gl=x[3];k.dn=k.fn+' ('+x[1]+')';k.en=EN[id];}
  /* đặt sau s_suci */
  const ids=['s_synch','s_macf','s_sucif','s_smc'],moved=ids.map(id=>{const i=KL.findIndex(k=>k.id===id);return i>=0?KL.splice(i,1)[0]:null;}).filter(Boolean);
  const j=KL.findIndex(k=>k.id==='s_suci');KL.splice(j>=0?j+1:KL.length,0,...moved);
}catch(e){console.error('KPI bảo mật mới',e);}})();
/* tìm kiếm chung */
if(typeof qSnap==='function'){const _qs=qSnap;qSnap=function(){_qs.apply(this,arguments);if(!QS||!QS.I||QS.sc)return;QS.sc=1;
  const CAT='Thẻ Bảo mật và xác thực';
  const body=$('#scBody'),cur=SCS.v;
  if(body){for(const [v,vn] of SCV){try{SCS.v=v;body.innerHTML=SCR[v].html();
    body.querySelectorAll('.panel').forEach(pn=>{const h=pn.querySelector('h3'),tt=h?h.textContent:vn,txt=qText(pn).slice(0,6000);if(txt.trim().length<12)return;
      qAdd(QS.I,CAT+' · '+vn,tt,txt,1,()=>{S.tab='sc';SCS.v=v;},()=>[...document.querySelectorAll('#t-sc .panel')].find(p=>{const x=p.querySelector('h3');return x&&x.textContent===tt;}));});}catch(e){console.error(e);}}
    SCS.v=cur;try{if(S.tab==='sc')renderSc();else body.innerHTML='';}catch(e){}}
  const go=(v,f)=>()=>{S.tab='sc';SCS.v=v;if(f)f();};
  SCPAR.forEach(r=>qAdd(QS.I,'Bảo mật · Tham số '+r[1],r[2],['Huawei: '+r[3],'Nokia: '+r[4],'Ericsson: '+r[5],'Điển hình: '+r[6]].join('. '),3,go('vd',()=>{SCP.vd.grp=r[1];SCP.vd.q='';}),'#scParB'));
  SCKPI.forEach(k=>qAdd(QS.I,'Bảo mật · KPI',k[0],[k[1],'Huawei: '+k[2],'Nokia: '+k[3],'Ericsson: '+k[4],k[5]].join('. '),3,go('vd'),'#scKpB'));
  SCFLT.forEach(f=>qAdd(QS.I,'Bảo mật · Lỗi thường gặp',f[0],[f[1],f[2].join('; '),f[3].join('; '),f[4].h,f[4].n,f[4].e].join('. '),3,go('vd'),()=>{const d=[...document.querySelectorAll('#t-sc .scflt')].find(x=>x.querySelector('summary').textContent===f[0]);if(d)d.open=true;return d;}));
  SCAM.forEach(([k,n])=>qAdd(QS.I,'Bảo mật · Phương thức xác thực',n,'AKA xác thực hai chiều, RAND AUTN RES XRES, KAUSF KSEAF KAMF KASME, SUPI SUCI IMSI, 5G-AKA EAP-AKA′ EPS-AKA UMTS AKA',3,go('aka',()=>{SCP.aka.meth=k;SCP.aka.fault='none';}),'#scAkaLad'));
  SCAF.filter(f=>f[0]!=='none').forEach(([k,n])=>qAdd(QS.I,'Bảo mật · Lỗi xác thực',n,'Authentication Failure cause #20 MAC failure, #21 Synch failure AUTS, Authentication Reject, SUCI SIDF, T3520',3,go('aka',()=>{SCP.aka.fault=k;}),'#scAkaLad'));
  Object.entries(SCKT).forEach(([k,n])=>qAdd(QS.I,'Bảo mật · Phân cấp khoá',n[2],n[5]+' Giữ ở '+n[3],3,go('key',()=>{SCK.sel=k;}),'#scKeySvg'));
  [0,1,2,3].forEach(a=>qAdd(QS.I,'Bảo mật · Thuật toán',SCALG[a][0],SCALG[a][1]+'. '+SCALG[a][3]+' EEA EIA NEA NIA',2,go('key'),'#scKeyOut'));
  SCRA.forEach(([k,n])=>qAdd(QS.I,'Bảo mật · SEPP / N32',n,'SEPP N32-c N32-f TLS PRINS JWE JWS IPX PLMN-ID roaming',2,go('roam',()=>{SCP.roam.atk=k;}),'#scRmLad'));
  SCSIG.filter(x=>!x[3]).forEach(x=>qAdd(QS.I,'Bảo mật · Tường lửa báo hiệu',x[1],x[2]+'. '+x[6]+' GSMA FS.11 FS.19 FS.20',2,go('roam'),'#scSigOut'));
  SCTF.forEach(([k,n])=>qAdd(QS.I,'Bảo mật · IPsec / IKEv2',n,'IKEv2 IKE_SA_INIT IKE_AUTH CMPv2 chứng thư SecGW NDS/IP ESP',2,go('tnl',()=>{SCP.tnl.flt=k;}),'#scIke'));
  SCFBG.forEach(([k,n])=>qAdd(QS.I,'Bảo mật · Trạm giả',n,'IMSI catcher fake base station trạm giả hạ cấp downgrade 2G phát hiện MR PCI lạ',2,go('fbs',()=>{SCP.fbs.gen=k;}),'#scFbMap'));
  SCSCAS.forEach(x=>qAdd(QS.I,'Bảo mật · NESAS/SCAS',x[1]+' · TS '+x[2],x[3].join('; ')+' SCAS NESAS TS 33.117',2,go('fbs',()=>{SCP.fbs.nf=x[0];}),'#scScas'));};}
/* thẻ Toàn trình E2E: nút sang thẻ này */
const SCE2V={reg:'aka',roam:'roam',ho:'key',data:'tnl'};
if(typeof e2Kpi==='function'){const _ke=e2Kpi;e2Kpi=function(){_ke.apply(this,arguments);const v=SCE2V[S.e2Sc];if(!v)return;const b=$('#e2Kpi .e2go');
  if(b&&!b.querySelector('[data-scgo]'))b.insertAdjacentHTML('afterbegin',`<button type="button" class="btn sm pri" data-scgo="sc:${v}">Bảo mật và xác thực · ${nE(SCV.find(x=>x[0]===v)[1])} →</button>`);};}
/* thẻ KPI: KPI bảo mật có nút sang mục tương ứng */
const SCKV={s_suci:'aka',s_synch:'aka',s_macf:'aka',s_sucif:'aka',s_smc:'key',s_sepp:'roam',s_sig:'roam',s_ike:'tnl',s_vpn:'tnl',s_cert:'tnl',s_ddos:'fbs'};
if(typeof kpDetHtml==='function'){const _kd=kpDetHtml;kpDetHtml=function(k){let h=_kd.apply(this,arguments);if(k&&SCKV[k.id]){const v=SCKV[k.id];h+=`<p class="u3kpl"><button type="button" class="btn sm" data-scgo="sc:${v}">Xem mô phỏng ở thẻ Bảo mật và xác thực · ${nE(SCV.find(x=>x[0]===v)[1])} →</button></p>`;}return h;};}
/* thẻ Roaming, Tường lửa, Truyền dẫn, Mạng lõi: thanh nút sang thẻ này */
const SCTABL={rm:[['roam','SEPP, N32, SS7/Diameter'],['aka','Xác thực khi roaming']],fw:[['roam','Tường lửa báo hiệu SS7/Diameter/GTP'],['tnl','IPsec, SecGW'],['fbs','Trạm giả, DoS']],tx:[['tnl','IPsec/SEG, MACsec, chi phí byte'],['fbs','Bão báo hiệu']],core:[['aka','5G-AKA, SUCI'],['key','Phân cấp khoá']]};
Object.keys(SCTABL).forEach(t=>{const f=RENDER[t];if(typeof f!=='function')return;RENDER[t]=function(){const r=f.apply(this,arguments);try{const sec=document.getElementById('t-'+t);if(sec&&!sec.querySelector('.sclkbar')){const h=`<div class="sclkbar nogl"><span>Mô phỏng chuyên sâu ở thẻ <b>Bảo mật và xác thực</b>:</span>${SCTABL[t].map(x=>`<button type="button" class="btn sm" data-scgo="sc:${x[0]}">${nE(x[1])} →</button>`).join('')}</div>`;const ld=sec.querySelector('.lead');if(ld)ld.insertAdjacentHTML('afterend',h);else sec.insertAdjacentHTML('afterbegin',h);}}catch(e){}return r;};});

