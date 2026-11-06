
/* ===== Giao diện công nghệ: nền, hero, menu điện thoại, hiệu ứng chuyển thẻ, số chạy (đợt 13) ===== */
(function(){
  const curTab=()=>{try{return S.tab;}catch(e){return null;}};
  const reduced=()=>!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  /* nền sao */
  const sky=document.createElement('div');sky.className='gx-sky';sky.setAttribute('aria-hidden','true');sky.innerHTML='<i></i><i></i><i></i>';document.body.prepend(sky);
  /* hero: vòng quỹ đạo, trạm phát sóng lan toả */
  const top=document.querySelector('header.top');
  if(top){const fx=document.createElement('div');fx.className='hero-fx';fx.setAttribute('aria-hidden','true');
    fx.innerHTML=`<svg viewBox="0 0 640 320"><ellipse class="ring" cx="320" cy="160" rx="300" ry="90"/><ellipse class="ring r2" cx="320" cy="160" rx="230" ry="64"/><ellipse class="ring" cx="320" cy="160" rx="150" ry="40" style="opacity:.18"/>
      <path class="wave" d="M490 130 a40 40 0 0 1 60 0"/><path class="wave" d="M490 130 a40 40 0 0 1 60 0"/><path class="wave" d="M490 130 a40 40 0 0 1 60 0"/>
      <path class="tower" d="M516 150 l4 -22 l4 22 z M512 178 l8 -30 l8 30 h-3 l-5 -18 l-5 18 z"/><circle class="tower" cx="520" cy="126" r="3.5"/></svg>`;
    top.prepend(fx);
    const by=top.querySelector('.by')||top.querySelector('.sub');
    const n=(s)=>{try{return s();}catch(e){return 0;}};
    const st=[[n(()=>document.querySelectorAll('#tabs [data-tab]').length),'thẻ mô phỏng'],[n(()=>KL.length),'KPI'],[n(()=>E2S.length),'luồng E2E'],[4,'chế độ mạng'],[3,'vendor']];
    const box=document.createElement('div');box.className='hero-stats nogl';box.innerHTML=st.filter(x=>x[0]).map(x=>`<span><b data-gxc="${x[0]}">${x[0]}</b>${x[1]}</span>`).join('');
    if(by)by.after(box);else top.querySelector('.wrap').append(box);}
  /* số chạy: đếm lên tới giá trị đang hiển thị (không đụng nếu nội dung bị vẽ lại giữa chừng) */
  const NUM=/-?\d{1,3}(?:\.\d{3})+(?:,\d+)?|-?\d+(?:,\d+)?/;
  function fmt(v,dec,th){let s=Math.abs(v).toFixed(dec).split('.');if(th)s[0]=s[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.');return (v<0?'-':'')+s[0]+(dec?','+s[1]:'');}
  function countNode(tn,dur){const txt=tn.nodeValue,m=txt.match(NUM);if(!m)return;const raw=m[0],th=/\.\d{3}/.test(raw),dec=(raw.split(',')[1]||'').length,val=parseFloat(raw.replace(/\./g,'').replace(',','.'));
    if(!isFinite(val)||Math.abs(val)<2&&dec===0)return;const pre=txt.slice(0,m.index),post=txt.slice(m.index+raw.length);let last=null;const t0=performance.now();
    const step=now=>{if(last!==null&&tn.nodeValue!==last)return;const k=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-k,3),s=pre+fmt(val*e,dec,th)+post;tn.nodeValue=s;last=s;if(k<1)requestAnimationFrame(step);else tn.nodeValue=txt;};requestAnimationFrame(step);}
  function countIn(root,sel,dur){if(!root||reduced())return;root.querySelectorAll(sel).forEach((el,i)=>{if(i>60)return;const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let tn;while((tn=w.nextNode())){if(NUM.test(tn.nodeValue)){countNode(tn,dur||700);break;}}});}
  window.gxCount=root=>countIn(root,'[data-ndcount]',600);
  if(!reduced())setTimeout(()=>countIn(document.querySelector('.hero-stats'),'b',1200),250);
  /* chuyển thẻ: thêm lớp .tin để các khung hiện dần, rồi cho số chạy */
  let lastTab=null,tinT=0;
  function onTab(){const t=curTab();if(!t||t===lastTab)return;const first=lastTab===null;lastTab=t;mnuSync();if(first)return;const sec=document.getElementById('t-'+t);if(!sec||reduced())return;
    sec.classList.remove('tin');void sec.offsetWidth;sec.classList.add('tin');clearTimeout(tinT);tinT=setTimeout(()=>sec.classList.remove('tin'),900);
    setTimeout(()=>countIn(sec,'.kv dd,.kpBig,.kpGv,[data-ndcount],.ndbr b',800),260);mnuSync();}
  if(typeof renderAll==='function'){const _ra=renderAll;renderAll=function(){const r=_ra.apply(this,arguments);try{onTab();}catch(e){}return r;};}
  /* menu theo nhóm cho điện thoại */
  const bar=document.querySelector('.bar .wrap'),tabs=document.getElementById('tabs');
  if(bar&&tabs){
    const btn=document.createElement('button');btn.type='button';btn.className='mnuBtn nogl';btn.setAttribute('aria-haspopup','dialog');btn.setAttribute('aria-controls','mnu');btn.innerHTML='<span class="mi" aria-hidden="true">☰</span><span class="mc"></span><span aria-hidden="true">▾</span>';
    bar.insertBefore(btn,document.getElementById('tabWrap'));
    const mnu=document.createElement('div');mnu.id='mnu';mnu.className='mnu nogl';mnu.hidden=true;mnu.setAttribute('role','dialog');mnu.setAttribute('aria-modal','true');mnu.setAttribute('aria-label','Chọn nội dung mô phỏng');
    mnu.innerHTML='<div class="mbg" data-mclose></div><div class="mpn"><div class="mhd"><b>Chọn nội dung</b><button type="button" class="mx" data-mclose aria-label="Đóng">×</button></div><input type="search" id="mnuQ" placeholder="Lọc tên thẻ…" autocomplete="off"><div id="mnuL"></div></div>';
    document.body.append(mnu);
    const NEW=['leo'];
    function list(q){q=(q||'').trim().toLowerCase();let h='';tabs.querySelectorAll('.tgrp').forEach(g=>{const gn=g.querySelector('.tgn').textContent,its=[...g.querySelectorAll('[data-tab]')].filter(b=>!q||b.textContent.toLowerCase().includes(q)||gn.toLowerCase().includes(q));
      if(!its.length)return;h+=`<div class="mg">${gn}</div>`+its.map(b=>`<button type="button" class="mt" data-mtab="${b.dataset.tab}" aria-current="${b.dataset.tab===(curTab())}">${b.textContent}${NEW.includes(b.dataset.tab)?' <span class="mnew">mới</span>':''}</button>`).join('');});
      document.getElementById('mnuL').innerHTML=h||'<p class="note">Không có thẻ khớp.</p>';}
    window.mnuSync=function(){const t=curTab(),b=tabs.querySelector(`[data-tab="${t}"]`),g=b&&b.closest('.tgrp');btn.querySelector('.mc').innerHTML=b?`${b.textContent} <small>· ${g?g.querySelector('.tgn').textContent:''}</small>`:'Chọn nội dung';};
    const open=()=>{list('');mnu.hidden=false;document.getElementById('mnuQ').value='';btn.setAttribute('aria-expanded','true');setTimeout(()=>{const c=mnu.querySelector('[aria-current="true"]')||mnu.querySelector('.mt');if(c)c.focus();},30);document.documentElement.style.overflow='hidden';};
    const close=()=>{mnu.hidden=true;btn.setAttribute('aria-expanded','false');document.documentElement.style.overflow='';btn.focus();};
    btn.addEventListener('click',open);
    mnu.addEventListener('click',e=>{if(e.target.closest('[data-mclose]')){close();return;}const t=e.target.closest('[data-mtab]');if(!t)return;const b=tabs.querySelector(`[data-tab="${t.dataset.mtab}"]`);close();if(b)b.click();});
    mnu.addEventListener('input',e=>{if(e.target.id==='mnuQ')list(e.target.value);});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mnu.hidden)close();});
    mnuSync();}
  function mnuSync(){if(window.mnuSync)window.mnuSync();}
  /* màu thanh trạng thái theo giao diện */
  function meta(){const d=document.documentElement.dataset.theme==='dark';document.querySelectorAll('meta[name="theme-color"]').forEach(m=>m.setAttribute('content',d?'#040B1A':'#EEF4FB'));}
  new MutationObserver(meta).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});meta();
})();

