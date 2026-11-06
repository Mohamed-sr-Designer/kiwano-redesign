(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)), lerp=(a,b,t)=>a+(b-a)*t;
const still=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* Mobile menu */
const burger=$('.burger'),mob=$('.mob');
if(burger){burger.addEventListener('click',()=>{const o=mob.classList.toggle('open');burger.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''})}

/* Page wipe: the amber O closes over the page between routes */
const wipe=$('.wipe');
addEventListener('pageshow',()=>wipe&&wipe.classList.remove('on'));
document.addEventListener('click',e=>{
  const a=e.target.closest('a');if(!a||still||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey)return;
  const h=a.getAttribute('href');if(!h||h.startsWith('#')||a.target==='_blank'||/^(https?:|mailto:|tel:)/.test(h))return;
  e.preventDefault();wipe.classList.add('on');setTimeout(()=>location.href=a.href,340);
});

/* Reveal + count up */
const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;en.target.classList.add('in');io.unobserve(en.target);
  $$('[data-to]',en.target).concat(en.target.dataset.to?[en.target]:[]).forEach(count)}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});
$$('.rv').forEach(el=>io.observe(el));
function count(el){const to=+el.dataset.to,suf=el.dataset.suf||'';if(still){el.textContent=to+suf;return}
  const t0=performance.now(),d=1300;(function f(t){const k=clamp((t-t0)/d,0,1);el.textContent=Math.round(to*(1-Math.pow(1-k,3)))+suf;if(k<1)requestAnimationFrame(f)})(t0)}

/* Hero: travel through the O */
const hero=$('.hero');
if(hero){
  const amber=$('.h-amber'),reveal=$('.h-reveal'),scaler=$('.scaler'),spikes=$('.h-spikes'),copy=$('.h-copy'),hint=$('.h-hint'),end=$('.h-end'),fruit=$$('.h-fruit');
  const imgs=$$('img',scaler);let cur=0,locked=false;
  const show=i=>{imgs.forEach((m,k)=>m.classList.toggle('on',k===i));cur=i};show(0);
  if(!still)setInterval(()=>{if(!locked)show((cur+1)%(imgs.length-1))},2400);
  let W,H,cw,ch,R0,cx0,cy0;
  function size(){W=innerWidth;H=$('.hero-pin').offsetHeight;const m=W<=760;
    R0=m?Math.min(W*.36,H*.17):Math.min(W*.215,H*.34);cx0=m?W*.56:W*.74;cy0=m?H*.25:H*.42;
    cw=Math.max(W,H*16/9)*1.02;ch=cw*9/16;scaler.style.width=cw+'px';scaler.style.height=ch+'px';frame()}
  function frame(){
    const tot=hero.offsetHeight-H,p=still?0:clamp(-hero.getBoundingClientRect().top/Math.max(tot,1),0,1);
    const e=p*p*(3-2*p),HOLE=.44,r0=R0*HOLE,rEnd=Math.hypot(W,H)*.56,r=r0*Math.pow(rEnd/r0,Math.pow(p,1.25));
    const cx=lerp(cx0,W/2,e),cy=lerp(cy0,H/2,e),R=r/HOLE;
    amber.style.clipPath=`circle(${R}px at ${cx}px ${cy}px)`;
    reveal.style.clipPath=`circle(${r}px at ${cx}px ${cy}px)`;
    const k=Math.min(1,2.2*r/ch);
    scaler.style.transform=`translate(${cx-cw*k/2}px,${cy-ch*k/2}px) scale(${k})`;
    spikes.style.transform=`translate(${cx-100}px,${cy-100}px) scale(${R/100}) rotate(${p*70}deg)`;
    spikes.style.opacity=clamp(1-p/.42,0,1);
    const c=clamp(1-p/.2,0,1);copy.style.opacity=c;copy.style.transform=`translateY(${-p*160}px)`;copy.style.visibility=c?'':'hidden';
    if(hint)hint.style.opacity=c;
    fruit.forEach((f,i)=>{const dir=i?1:-1;f.style.transform=`translate(${dir*p*W*.5}px,${-p*H*(.7+i*.3)}px) rotate(${(i?18:-12)+p*90*dir}deg)`;f.style.opacity=clamp(1-p/.35,0,1)});
    if(p>.5&&!locked){locked=true;show(imgs.length-1)}else if(p<=.5&&locked){locked=false;show(0)}
    const q=clamp((p-.86)/.1,0,1);end.style.opacity=q;end.classList.toggle('on',q>.6);
  }
  addEventListener('resize',size);addEventListener('scroll',()=>requestAnimationFrame(frame),{passive:true});size();
  $$('img',scaler).forEach(i=>i.addEventListener('load',frame,{once:true}));
}

/* Services accordion */
$$('.srow>button').forEach(b=>b.addEventListener('click',()=>{const r=b.parentElement,was=r.classList.contains('open');
  $$('.srow').forEach(x=>{x.classList.remove('open');$('button',x).setAttribute('aria-expanded','false')});
  if(!was){r.classList.add('open');b.setAttribute('aria-expanded','true')}}));

/* Team dots: tap support */
$$('.dot').forEach(d=>d.addEventListener('click',()=>{const o=d.classList.contains('tip');$$('.dot.tip').forEach(x=>x.classList.remove('tip'));if(!o)d.classList.add('tip')}));

/* Process tracks + zigzag line */
const zigs=$$('[data-zig]');
function drawZig(z){const svg=$('svg.line',z),pts=$$('.pt',z);if(!svg||!pts.length||!z.offsetParent)return;
  const b=z.getBoundingClientRect();
  const d=pts.map((p,i)=>{const r=p.getBoundingClientRect();return (i?'L':'M')+(r.left-b.left+r.width/2).toFixed(1)+' '+(r.top-b.top+r.height/2).toFixed(1)}).join(' ');
  const path=$('path',svg);path.setAttribute('d',d);const L=path.getTotalLength();path.style.strokeDasharray=L;
  if(still){path.style.strokeDashoffset=0;return}
  path.style.transition='none';path.style.strokeDashoffset=L;path.getBoundingClientRect();path.style.transition='stroke-dashoffset 1.4s cubic-bezier(.3,.7,.2,1)';path.style.strokeDashoffset=0}
const zio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){drawZig(e.target);zio.unobserve(e.target)}}),{threshold:.2});
zigs.forEach(z=>zio.observe(z));
$$('[data-tabs]').forEach(tabs=>{const btns=$$('button',tabs);btns.forEach(b=>b.addEventListener('click',()=>{btns.forEach(x=>x.setAttribute('aria-selected',x===b));
  zigs.forEach(z=>{const on=z.dataset.zig===b.dataset.t;z.hidden=!on;if(on)drawZig(z)})}))});
addEventListener('resize',()=>zigs.forEach(drawZig));

/* Voices */
const qEl=$('.quote');
if(qEl){const btn=$$('.vlist button');const who=$('.vwho');
  const set=i=>{const b=btn[i];btn.forEach(x=>x.setAttribute('aria-pressed',x===b));qEl.textContent='"'+b.dataset.q+'"';qEl.classList.toggle('long',b.dataset.q.length>210);
    $('img',who).src=b.dataset.l;$('b',who).textContent=b.dataset.n;$('span',who).textContent=b.dataset.r;$('img',who).alt=b.dataset.n+' logo'};
  btn.forEach((b,i)=>b.addEventListener('click',()=>set(i)));set(2)}

/* Work filter + search */
const wg=$('.wgrid[data-filterable]');
if(wg){const cards=$$('.wc',wg),chips=$$('.chips button'),s=$('.wsearch'),emp=$('.wempty');let cat='all';
  const run=()=>{const q=(s.value||'').trim().toLowerCase();let n=0;cards.forEach(c=>{const ok=(cat==='all'||c.dataset.c.includes(cat))&&(!q||c.dataset.n.includes(q));c.hidden=!ok;if(ok)n++;c.classList.toggle('big',cat==='all'&&!q&&c.dataset.big==='1')});emp.hidden=n>0};
  chips.forEach(b=>b.addEventListener('click',()=>{chips.forEach(x=>x.setAttribute('aria-pressed',x===b));cat=b.dataset.c;run()}));s.addEventListener('input',run);
  const hash=location.hash.slice(1);const pre=chips.find(c=>c.dataset.c===hash);if(pre)pre.click()}

/* Team filter */
const tf=$$('[data-team]');
if(tf.length){const ms=$$('.tm');tf.forEach(b=>b.addEventListener('click',()=>{tf.forEach(x=>x.setAttribute('aria-pressed',x===b));const c=b.dataset.team;ms.forEach(m=>m.hidden=c!=='all'&&m.dataset.d!==c)}))}

/* Services page scrollspy */
const svLinks=$$('.svnav a');
if(svLinks.length){const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)svLinks.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-35% 0px -60% 0px'});$$('.sv').forEach(s=>sio.observe(s))}

/* Video modal + inline players */
const modal=$('.modal');
function yt(id){return `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="KIWANO video" allow="autoplay;encrypted-media;fullscreen" allowfullscreen></iframe>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-yt]');if(!b)return;
  if(b.dataset.inline!==undefined){b.parentElement.innerHTML=yt(b.dataset.yt);return}
  $('.box',modal).innerHTML=yt(b.dataset.yt);modal.classList.add('open');$('.close',modal).focus()});
if(modal){const close=()=>{modal.classList.remove('open');$('.box',modal).innerHTML=''};$('.close',modal).addEventListener('click',close);modal.addEventListener('click',e=>{if(e.target===modal)close()});addEventListener('keydown',e=>{if(e.key==='Escape')close()})}

/* Work cursor */
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!still){const c=document.createElement('div');c.className='cur';c.textContent='OPEN';c.setAttribute('aria-hidden','true');document.body.append(c);
  addEventListener('mousemove',e=>{c.style.setProperty('--x',e.clientX+'px');c.style.setProperty('--y',e.clientY+'px');c.classList.toggle('on',!!e.target.closest('.wc,.scard a.fig,.minis a'))},{passive:true})}

/* Brief builder */
const bb=$('#brief');
if(bb){const crew={ads:['Creative copywriters for the screenplay','Videographers and an on-location crew','Food stylists and chefs when the product is food'],prod:['Videographers and photographers','Food stylists, hand models and chefs','Reel-makers and video editors'],social:['An account manager as your single link','Creative copywriters and graphic designers','Community management and media buyers'],talent:['PR and talent management','Copywriters for scenarios and scripts','An account manager to run it A to Z'],design:['Graphic designers','Motion graphics designers','A creative strategist for the tone of voice']};
  const out={ads:['Screenplay and concept','Shoot and post-production','Final ad delivery'],prod:['Videography','Set-up, product and lifestyle photography','Reels for TikTok and Instagram'],social:['Monthly content agenda','Digital analysis and media buying reports','Monthly social listening report'],talent:['Influencer research and shortlist','Negotiated deals','Scenarios and scripts'],design:['Social media designs and motion','Branding and typography','Outdoor printings']};
  const list=$('#crew'),deliv=$('#deliv'),go=$('#wa'),mail=$('#mail'),err=$('.err');
  const val=n=>(bb.elements[n]&&bb.elements[n].value||'').trim();
  function sel(){return $$('input[name=svc]:checked',bb)}
  function render(){const s=sel();const c=[...new Set(s.flatMap(i=>crew[i.value]))],o=[...new Set(s.flatMap(i=>out[i.value]))];
    list.innerHTML=(c.length?c:['Pick at least one craft to see your crew']).map(x=>`<li>${x}</li>`).join('');
    deliv.innerHTML=(o.length?o:['Your first outputs appear here']).map(x=>`<li>${x}</li>`).join('');
    const msg=['Hi KIWANO, I would like to start a brief.','',`Name: ${val('name')}`,`Brand: ${val('brand')}`,`Phone: ${val('phone')}`,`Stage: ${val('stage')}`,`Needs: ${s.map(i=>i.dataset.l).join(', ')}`,`Goal: ${val('goal')}`].join('\n');
    go.href='https://wa.me/201005420322?text='+encodeURIComponent(msg);mail.href='mailto:info@kiwanomedia.com?subject='+encodeURIComponent('New brief: '+(val('brand')||'KIWANO website'))+'&body='+encodeURIComponent(msg)}
  bb.addEventListener('input',render);bb.addEventListener('change',render);
  bb.addEventListener('submit',e=>e.preventDefault());
  const pre=location.hash.slice(1);const pi=$(`input[value="${pre}"]`,bb);if(pi)pi.checked=true;
  [go,mail].forEach(a=>a.addEventListener('click',e=>{const miss=!sel().length?'Pick at least one craft first.':(!val('name')||!val('brand'))?'Add your name and brand so we know who is asking.':'';err.textContent=miss;if(miss)e.preventDefault()}));
  render()}
})();
