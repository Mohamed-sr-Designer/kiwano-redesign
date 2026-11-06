(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)), lerp=(a,b,t)=>a+(b-a)*t, smooth=t=>t*t*(3-2*t);
const still=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* Mobile menu */
const burger=$('.burger'),mob=$('.mob');
if(burger)burger.addEventListener('click',()=>{const o=mob.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.textContent=o?'Close':'Menu';document.body.style.overflow=o?'hidden':''});

/* Reveal */
const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{threshold:.12});
$$('.rv,.peek').forEach(el=>io.observe(el));

/* The character watches the cursor */
if($('.pupil')&&!still){const eyes=$$('.eye');
  addEventListener('pointermove',e=>{eyes.forEach(g=>{const r=g.getBoundingClientRect();if(!r.width)return;const mirrored=g.parentElement.hasAttribute('transform');const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),d=Math.hypot(dx,dy)||1,k=Math.min(1,d/260);
    $('.pupil',g).setAttribute('transform',`translate(${((mirrored?-1:1)*dx/d*k*11).toFixed(1)} ${(dy/d*k*4.5).toFixed(1)})`)})},{passive:true})}

/* Entrance: he walks in, says hello, then his face opens like a door */
const gate=$('.gate');
if(gate&&!still){
  const pin=$('.gate-pin'),figs=$$('.fig'),L=$('.door.l'),R=$('.door.r'),ins=$('.st-in'),hi=$('.hi'),tx=$$('.g-t'),wms=$$('.wm'),floors=$$('.floor');
  const VW=320,VH=480,MX=160,MY=215,MH=403;let W,H,u,s0,x0,y0;
  function size(){W=innerWidth;H=pin.offsetHeight;u=1.28*H/MH;
    const target=Math.min(H*.8,W*1.25);s0=target/(VH*u);
    figs.forEach(f=>{f.style.width=VW*u+'px';f.style.height=VH*u+'px'});
    x0=W/2-MX*u*s0;y0=H*.965-VH*u*s0;frame()}
  function frame(){const p=clamp(-gate.getBoundingClientRect().top/Math.max(gate.offsetHeight-H,1),0,1);
    const z=smooth(clamp(p/.5,0,1)),o=smooth(clamp((p-.46)/.36,0,1));
    const s=lerp(s0,1,z),x=lerp(x0,W/2-MX*u,z),y=lerp(y0,H/2-MY*u,z);
    figs.forEach(f=>f.style.transform=`translate(${x}px,${y}px) scale(${s})`);
    L.style.transform=`translateX(${-o*102}%)`;R.style.transform=`translateX(${o*102}%)`;
    L.style.visibility=R.style.visibility=o>=1?'hidden':'';L.style.setProperty('--seam',clamp(o/.04,0,1));R.style.setProperty('--seam',clamp(o/.04,0,1));
    const t=clamp(1-p/.08,0,1);tx.forEach(e=>e.style.opacity=t);if(p>.02)hi.classList.remove('on');
    wms.forEach(e=>e.style.opacity=.13*clamp(1-p/.22,0,1));floors.forEach(e=>e.style.transform=`translateY(${p*500}%)`);
    const q=smooth(clamp((p-.74)/.14,0,1));ins.style.opacity=q;ins.style.transform=`translateY(${(1-q)*24}px)`;
  }
  addEventListener('resize',size);addEventListener('scroll',()=>requestAnimationFrame(frame),{passive:true});size();
  const doors=[L,R];doors.forEach(d=>d.classList.add('intro'));
  setTimeout(()=>{doors.forEach(d=>{d.classList.remove('intro');d.classList.add('waved')});if(scrollY<40)hi.classList.add('on')},2050);

  /* Reel behind the doors, shown only once it actually plays */
  const yt=$('.yt');
  if(yt){let started=false;const load=()=>{if(started)return;started=true;
      const id=yt.dataset.id;yt.innerHTML=`<iframe id="bgv" src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1" title="" tabindex="-1" allow="autoplay;encrypted-media"></iframe>`;
      const f=$('iframe',yt);f.addEventListener('load',()=>{f.contentWindow.postMessage(JSON.stringify({event:'listening',id:'bgv'}),'*')})};
    addEventListener('message',e=>{if(!/youtube/.test(e.origin))return;try{const d=JSON.parse(e.data);if(d.info&&d.info.playerState===1)setTimeout(()=>yt.classList.add('on'),1600)}catch(_){}});
    addEventListener('scroll',function s(){if(scrollY>H*.4){load();removeEventListener('scroll',s)}},{passive:true})}
}

/* Work strips */
const strips=$$('.strip');
if(strips.length){const set=s=>strips.forEach(x=>x.classList.toggle('on',x===s));
  strips.forEach(s=>{s.addEventListener('mouseenter',()=>set(s));s.addEventListener('focus',()=>set(s))})}

/* Quotes */
const qEl=$('.quote');
if(qEl){const data=JSON.parse($('#qd').textContent);let i=2;const n=$('.q-who');
  const show=k=>{i=(k+data.length)%data.length;qEl.textContent='"'+data[i][2]+'"';n.innerHTML=`<b>${data[i][0]}</b><br><span class="dim">${data[i][1]}</span>`};
  $('[data-q=prev]').addEventListener('click',()=>show(i-1));$('[data-q=next]').addEventListener('click',()=>show(i+1))}

/* Work filter */
const wg=$('.wgrid[data-f]');
if(wg){const cards=$$('.wc',wg),chips=$$('.fil button');
  const pick=c=>{chips.forEach(x=>x.setAttribute('aria-pressed',x.dataset.c===c));cards.forEach(k=>k.hidden=!(c==='all'||k.dataset.c.includes(c)))};
  chips.forEach(b=>b.addEventListener('click',()=>pick(b.dataset.c)));
  const h=location.hash.slice(1);if(chips.some(c=>c.dataset.c===h))pick(h)}

/* Video */
const modal=$('.modal');
const ytf=id=>`<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="KIWANO video" allow="autoplay;encrypted-media;fullscreen" allowfullscreen></iframe>`;
document.addEventListener('click',e=>{const b=e.target.closest('[data-yt]');if(!b)return;
  if(b.dataset.inline!==undefined){b.parentElement.innerHTML=ytf(b.dataset.yt);return}
  $('.boxv',modal).innerHTML=ytf(b.dataset.yt);modal.classList.add('open');$('.cl',modal).focus()});
if(modal){const c=()=>{modal.classList.remove('open');$('.boxv',modal).innerHTML=''};$('.cl',modal).addEventListener('click',c);modal.addEventListener('click',e=>{if(e.target===modal)c()});addEventListener('keydown',e=>{if(e.key==='Escape')c()})}

/* Brief */
const bb=$('#brief');
if(bb){const go=$('#wa'),mail=$('#mail'),err=$('.err');
  const val=n=>(bb.elements[n]&&bb.elements[n].value||'').trim(),sel=()=>$$('input[name=svc]:checked',bb);
  function render(){const msg=['Hi KIWANO, I would like to start a brief.','',`Name: ${val('name')}`,`Brand: ${val('brand')}`,`Phone: ${val('phone')}`,`Needs: ${sel().map(i=>i.dataset.l).join(', ')}`,`Goal: ${val('goal')}`].join('\n');
    go.href='https://wa.me/201005420322?text='+encodeURIComponent(msg);mail.href='mailto:info@kiwanomedia.com?subject='+encodeURIComponent('New brief: '+(val('brand')||'KIWANO website'))+'&body='+encodeURIComponent(msg)}
  bb.addEventListener('input',render);bb.addEventListener('submit',e=>e.preventDefault());
  const pi=$(`input[value="${location.hash.slice(1)}"]`,bb);if(pi)pi.checked=true;
  [go,mail].forEach(a=>a.addEventListener('click',e=>{const m=!sel().length?'Pick at least one service first.':(!val('name')||!val('brand'))?'Add your name and brand so we know who is asking.':'';err.textContent=m;if(m)e.preventDefault()}));
  render()}
})();
