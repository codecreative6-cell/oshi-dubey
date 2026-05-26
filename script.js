const mq = query => window.matchMedia && window.matchMedia(query).matches;
const prefersReducedMotion = mq('(prefers-reduced-motion: reduce)');
const coarsePointer = mq('(hover: none), (pointer: coarse)');
const finePointer = mq('(hover: hover) and (pointer: fine)');
const particleScale = prefersReducedMotion ? 0.18 : (coarsePointer ? 0.45 : 1);

document.body.classList.toggle('has-custom-cursor', finePointer && !prefersReducedMotion);

/* ══ PRELOADER — HAPPY BIRTHDAY ANIMATION ══ */
(function(){
  const phrase = "Happy Birthday!";
  const colors = ["#ffd6e0","#f9e4b7","#e8617a","#d4a84b","#f7b8c4","#9b50e0","#2ecc90","#fff6d6"];
  const container = document.getElementById('preHB');

  // Build letter spans
  phrase.split('').forEach((ch, i) => {
    if(ch === ' '){
      const sp = document.createElement('span');
      sp.className = 'hb-space';
      container.appendChild(sp);
    } else {
      const s = document.createElement('span');
      s.className = 'hb-letter';
      s.textContent = ch;
      s.style.animationDelay = (i * 0.07) + 's';
      // Stagger shimmer offset per letter
      s.style.backgroundPosition = (i * 20) + '% 50%';
      container.appendChild(s);
    }
  });

  // Spawn floating stars after letters appear
  setTimeout(() => {
    if(prefersReducedMotion) return;
    const wrap = document.querySelector('.pre-hb-wrap');
    const emojis = ['✨','🎉','⭐','🌸','🎊','💫','🌟'];
    const limit = coarsePointer ? 12 : 30;
    let count = 0;
    const interval = setInterval(() => {
      const el = document.createElement('span');
      el.className = 'pre-hb-star';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = (Math.random() * 100) + '%';
      el.style.bottom = '0px';
      el.style.animationDelay = (Math.random() * .5) + 's';
      wrap.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
      if(++count > limit) clearInterval(interval);
    }, 150);
  }, 800);

  // Confetti rain
  const confWrap = document.getElementById('preConfetti');
  const confColors = ['#e8617a','#d4a84b','#f7b8c4','#9b50e0','#2ecc90','#fff6d6','#40c0ff'];
  const preConfettiCount = Math.max(6, Math.round(38 * particleScale));
  for(let i = 0; i < preConfettiCount; i++){
    const c = document.createElement('div');
    c.className = 'pre-conf';
    c.style.left = (Math.random() * 100) + '%';
    c.style.top = (Math.random() * -120) + 'px';
    c.style.background = confColors[Math.floor(Math.random() * confColors.length)];
    c.style.width = (Math.random() * 8 + 4) + 'px';
    c.style.height = (Math.random() * 8 + 4) + 'px';
    c.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
    c.style.animationDuration = (Math.random() * 3 + 2.5) + 's';
    c.style.animationDelay = (Math.random() * 2.5) + 's';
    confWrap.appendChild(c);
  }
})();

window.addEventListener('load',()=>{
  document.getElementById('prefill').style.width='100%';
  setTimeout(()=>{
    document.getElementById('preloader').classList.add('hide');
    if(!prefersReducedMotion){
      setTimeout(launchConfetti,500);
      setTimeout(launchManyFireworks,800);
    }
  },2800);
});

/* ══ SCROLL PROGRESS ══ */
window.addEventListener('scroll',()=>{
  const s=document.documentElement.scrollTop;
  const h=document.documentElement.scrollHeight-window.innerHeight;
  document.getElementById('progress').style.width=(h>0 ? (s/h*100) : 0)+'%';
},{passive:true});

/* ══ CURSOR + SPARKLE TRAIL ══ */
const cur=document.getElementById('cursor');
const ring=document.getElementById('cursor-ring');
const sc=document.getElementById('sparkle-canvas');
const sctx=sc.getContext('2d');
function resizeSC(){sc.width=window.innerWidth;sc.height=window.innerHeight}
let mx=0,my=0,sparks=[];
if(finePointer && !prefersReducedMotion){
  resizeSC(); window.addEventListener('resize',resizeSC);
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    cur.style.left=mx+'px';cur.style.top=my+'px';
    ring.style.left=mx+'px';ring.style.top=my+'px';
    if(Math.random()<.38) sparks.push({x:mx,y:my,vx:(Math.random()-.5)*3.5,vy:(Math.random()-.5)*3.5,r:Math.random()*4+1.5,a:1,c:Math.random()>.5?'#d4a84b':'#e8617a'});
  });
  (function spkLoop(){
    requestAnimationFrame(spkLoop);
    sctx.clearRect(0,0,sc.width,sc.height);
    sparks=sparks.filter(s=>s.a>.03);
    sparks.forEach(s=>{
      s.x+=s.vx;s.y+=s.vy;s.vy+=.07;s.a-=.028;
      sctx.save();sctx.globalAlpha=s.a;sctx.fillStyle=s.c;
      sctx.shadowBlur=8;sctx.shadowColor=s.c;
      sctx.beginPath();sctx.arc(s.x,s.y,s.r,0,Math.PI*2);sctx.fill();
      sctx.restore();
    });
  })();
}

/* ══ STAR FIELD ══ */
const sf=document.getElementById('starfield');
const sfx=sf.getContext('2d');
let SW,SH,stars=[];
function resizeSF(){SW=sf.width=window.innerWidth;SH=sf.height=window.innerHeight}
resizeSF();window.addEventListener('resize',resizeSF);
const starCount = Math.max(24, Math.round(140 * particleScale));
for(let i=0;i<starCount;i++) stars.push({x:Math.random()*2000,y:Math.random()*2000,r:Math.random()*1.7+.2,a:Math.random(),da:(Math.random()-.5)*.013,c:Math.random()>.5?'#d4a84b':Math.random()>.5?'#e8617a':'#b090ff'});
(function sfL(){
  if(!prefersReducedMotion) requestAnimationFrame(sfL);
  sfx.clearRect(0,0,SW,SH);
  stars.forEach(s=>{
    if(!prefersReducedMotion){s.a+=s.da;if(s.a<=0||s.a>=1)s.da*=-1;}
    sfx.save();sfx.globalAlpha=s.a*.5;sfx.fillStyle=s.c;
    sfx.shadowBlur=7;sfx.shadowColor=s.c;
    sfx.beginPath();sfx.arc(s.x%SW,s.y%SH,s.r,0,Math.PI*2);sfx.fill();
    sfx.restore();
    if(!prefersReducedMotion){s.y-=.1;if(s.y<0){s.y=SH;s.x=Math.random()*SW}}
  });
})();

/* ══ FALLING PETALS ══ */
const pCols=['#e8617a','#f7b8c4','#d4a84b','#c74f6a','#f9e4b7','#b090ff','#40c0a0'];
function spawnPetal(){
  const p=document.createElement('div');p.className='petal';
  p.style.left=Math.random()*100+'vw';
  p.style.background=pCols[Math.floor(Math.random()*pCols.length)];
  const d=5+Math.random()*10;p.style.width=d+'px';p.style.height=(d*1.3)+'px';
  p.style.borderRadius=['100% 0 100% 0','0 100% 0 100%','50%'][Math.floor(Math.random()*3)];
  p.style.animationDuration=(7+Math.random()*10)+'s';
  p.style.animationDelay=(Math.random()*4)+'s';
  p.style.opacity=.3+Math.random()*.6;
  document.body.appendChild(p);
  setTimeout(()=>p.remove(),18000);
}
if(!prefersReducedMotion){
  setInterval(spawnPetal,coarsePointer ? 900 : 450);
  const initialPetals = coarsePointer ? 5 : 12;
  for(let i=0;i<initialPetals;i++)setTimeout(spawnPetal,i*150);
}



/* ══ IMAGES ══ */
const imgList=[
  "img/img (1).JPG","img/img (2).JPG","img/img (3).JPG","img/img (4).JPG",
  "img/img (5).JPG","img/img (6).JPG","img/img (7).JPG","img/img (8).JPG",
  "img/img (9).JPG","img/img (10).JPG","img/img (11).JPG","img/img (12).JPG",
  "img/img (13).JPG","img/img (14).JPG","img/img (15).JPG","img/img (16).JPG",
  "img/img (17).JPG","img/img (18).JPG","img/img (19).jpg","img/img (20).JPG",
  "img/img (21).jpg","img/img (22).JPG","img/img (23).JPG","img/img (24).JPG",
  "img/img (25).JPG","img/img (26).JPG","img/img (27).JPG"
];
const photoWords=[
  "Grace","Glow","Dream","Poise","Art","Spark","Vibe","Style","Bloom",
  "Radiance","Charm","Muse","Joy","Motion","Power","Royal","Sky","Rhythm",
  "Diva","Spirit","Fire","Magic","Dance","Legacy","Queen","Elegance","Wonder"
];
const photoEmojis=[
  "&#127801;","&#10024;","&#127769;","&#128171;","&#127912;","&#9889;","&#128526;","&#128081;","&#127800;",
  "&#9728;","&#128150;","&#127917;","&#128522;","&#128131;","&#128293;","&#128142;","&#9729;","&#127926;",
  "&#128139;","&#127775;","&#10084;","&#10024;","&#128131;","&#127942;","&#128081;","&#127802;","&#128525;"
];

/* ══ 3D CAROUSEL ══ */
const cRing=document.getElementById('cRing');
const cScene=document.querySelector('.carousel-scene');
const cImgs=imgList.slice(0,12);
const cN=cImgs.length;
const cCards=[];
const supports3DCarousel = window.CSS && CSS.supports && CSS.supports('transform-style','preserve-3d');
cImgs.forEach((src,i)=>{
  const card=document.createElement('div');card.className='c-card';
  card.innerHTML=`<img src="${src}" alt="" loading="lazy">`;
  card.onclick=()=>openLB(i);
  cRing.appendChild(card);
  cCards.push(card);
});
function layoutCarousel(){
  if(!supports3DCarousel) return;
  const sceneW=cScene.clientWidth||window.innerWidth;
  const phone=window.innerWidth<=640;
  const cardW=Math.round(Math.min(phone?126:210,Math.max(phone?92:130,sceneW*(phone?0.3:0.15))));
  const cardH=Math.round(cardW*1.28);
  const idealR=(cardW/2)/Math.tan(Math.PI/cN);
  const maxR=sceneW*(phone?0.42:0.36);
  const radius=Math.round(Math.max(cardW*1.05,Math.min(idealR*1.08,maxR)));
  cCards.forEach((card,i)=>{
    card.style.width=cardW+'px';
    card.style.height=cardH+'px';
    card.style.marginLeft=(-cardW/2)+'px';
    card.style.marginTop=(-cardH/2)+'px';
    card.style.transform=`rotateY(${i*(360/cN)}deg) translateZ(${radius}px)`;
  });
}
layoutCarousel();
let carouselResizeTimer;
window.addEventListener('resize',()=>{
  clearTimeout(carouselResizeTimer);
  carouselResizeTimer=setTimeout(layoutCarousel,120);
});
window.addEventListener('orientationchange',()=>setTimeout(layoutCarousel,240));

/* ══ GALLERY ══ */
const gal=document.getElementById('gallery');
imgList.forEach((src,i)=>{
  const item=document.createElement('div');item.className='g-item';
  const word=photoWords[i]||'Memory';
  const emoji=photoEmojis[i]||'&#10024;';
  item.innerHTML=`<img src="${src}" alt="Oshi ${i+1} - ${word}" loading="lazy"><div class="g-overlay"><div class="g-caption"><span class="g-label">✦</span><span class="g-emoji">${emoji}</span><span class="g-word">${word}</span></div></div>`;
  item.onclick=()=>openLB(i);
  if(finePointer && !prefersReducedMotion){
    item.addEventListener('mousemove',e=>{
      const r=item.getBoundingClientRect();
      const xP=(e.clientX-r.left)/r.width-.5,yP=(e.clientY-r.top)/r.height-.5;
      item.style.transform=`perspective(600px) rotateY(${xP*12}deg) rotateX(${-yP*12}deg) scale(1.02)`;
    });
    item.addEventListener('mouseleave',()=>{item.style.transform=''});
  }
  gal.appendChild(item);
});

/* ══ INTERSECTION OBSERVER ══ */
function observeOnce(selector,className,options){
  const items=document.querySelectorAll(selector);
  if(!('IntersectionObserver' in window)){
    items.forEach(el=>el.classList.add(className));
    return;
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add(className);
        observer.unobserve(entry.target);
      }
    });
  },options);
  items.forEach(el=>observer.observe(el));
}
observeOnce('.g-item,.reveal','vis',{threshold:.08});
observeOnce('.msgs-grid','anim-in',{threshold:.06});
observeOnce('.story-frame','story-vis',{threshold:.08});
observeOnce('.cake-section','cake-vis',{threshold:.06});
observeOnce('.tw-section','tw-vis',{threshold:.1});
observeOnce('.section-badge','badge-in',{threshold:.5});

/* ══ LIGHTBOX ══ */
let lbIdx=0;
function openLB(i){lbIdx=i;document.getElementById('lbImg').src=imgList[i];document.getElementById('lbCt').textContent=`${i+1} / ${imgList.length}`;document.getElementById('lb').classList.add('open');document.body.style.overflow='hidden'}
function closeLB(){document.getElementById('lb').classList.remove('open');document.body.style.overflow=''}
function lbNav(d){lbIdx=(lbIdx+d+imgList.length)%imgList.length;openLB(lbIdx)}
document.getElementById('lb').addEventListener('click',function(e){if(e.target===this)closeLB()});
document.addEventListener('keydown',e=>{
  const lb=document.getElementById('lb');
  const isOpen=lb.classList.contains('open');
  if(e.key==='Escape' && isOpen) closeLB();
  if(!isOpen) return;
  if(e.key==='ArrowRight') lbNav(1);
  if(e.key==='ArrowLeft') lbNav(-1);
});

/* ══ FIREWORKS ══ */
const fwc=document.getElementById('fireworks');
const fwx=fwc.getContext('2d');
function resizeFW(){fwc.width=window.innerWidth;fwc.height=window.innerHeight}
resizeFW();window.addEventListener('resize',resizeFW);
let fwP=[];
function launchFW(x,y){
  if(prefersReducedMotion) return;
  const cols=['#f9c83a','#e8617a','#d4a84b','#f7b8c4','#c8a8f9','#80ffcc'];
  const burstCount = Math.max(10, Math.round(30 * particleScale));
  for(let i=0;i<burstCount;i++){
    const a=Math.random()*Math.PI*2,sp=Math.random()*5+1.5;
    fwP.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,a:.65,r:Math.random()*2+.7,c:cols[Math.floor(Math.random()*cols.length)],g:.08});
  }
}
(function fwLoop(){
  if(!prefersReducedMotion) requestAnimationFrame(fwLoop);
  fwx.clearRect(0,0,fwc.width,fwc.height);
  fwP=fwP.filter(p=>p.a>.025);
  fwP.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.vx*=.96;p.vy*=.96;p.a-=.022;
    fwx.save();fwx.globalAlpha=p.a;fwx.fillStyle=p.c;fwx.shadowBlur=4;fwx.shadowColor=p.c;
    fwx.beginPath();fwx.arc(p.x,p.y,p.r,0,Math.PI*2);fwx.fill();fwx.restore();
  });
})();
function launchManyFireworks(){
  if(prefersReducedMotion) return;
  const burstTotal = coarsePointer ? 2 : 4;
  for(let i=0;i<burstTotal;i++) setTimeout(()=>launchFW(Math.random()*window.innerWidth,Math.random()*window.innerHeight*.55),i*350);
}

/* ══ CONFETTI ══ */
function launchConfetti(){
  if(prefersReducedMotion) return;
  const cf=document.getElementById('cfWrap');
  const cols=['#e8617a','#d4a84b','#f7b8c4','#fff6d6','#c74f6a','#f9c83a','#fff','#c8a8f9','#80ffcc'];
  const confettiCount = Math.max(35, Math.round(200 * particleScale));
  for(let i=0;i<confettiCount;i++){
    const c=document.createElement('div');c.className='cf';
    c.style.left=Math.random()*100+'vw';c.style.top='-12px';
    c.style.background=cols[Math.floor(Math.random()*cols.length)];
    c.style.borderRadius=Math.random()>.5?'50%':'2px';
    const sz=3+Math.random()*9;c.style.width=sz+'px';c.style.height=sz+'px';
    c.style.animationDelay=Math.random()*2.5+'s';
    c.style.animationDuration=(2.5+Math.random()*3)+'s';
    cf.appendChild(c);setTimeout(()=>c.remove(),7000);
  }
}

/* ══ BLOW CANDLES ══ */
let blown=false;
function blowCandles(){
  if(blown)return;blown=true;
  const flames=document.querySelectorAll('.flame-outer,.flame-inner');
  flames.forEach((f,i)=>{
    setTimeout(()=>{
      f.style.transform='scaleX(2.5) scaleY(.1)';
      f.style.opacity='0';f.style.transition='all .25s ease';
    },i*60);
  });
  setTimeout(()=>{
    launchManyFireworks();launchConfetti();
    document.getElementById('blowBtn').innerHTML='🎊 Happy Birthday Oshi!! 🎊';
    document.getElementById('blowBtn').style.background='linear-gradient(135deg,rgba(212,168,75,.35),rgba(232,64,90,.35))';
    document.getElementById('blowBtn').style.boxShadow='0 0 40px rgba(212,168,75,.5),0 0 80px rgba(212,168,75,.2)';
    document.getElementById('blowBtn').style.color='#fff';
    document.getElementById('blowSub').textContent='🌟 Your wish is sent to the universe! 🌟';
    // add pulsing glow to cake
    document.getElementById('cakeScene').style.filter='drop-shadow(0 0 60px rgba(212,168,75,.7)) drop-shadow(0 0 120px rgba(232,64,90,.4))';
  },800);
  setTimeout(()=>{launchManyFireworks();launchConfetti();},3500);
}

/* auto burst on load — single gentle burst */
if(!prefersReducedMotion) setTimeout(()=>{launchManyFireworks();launchConfetti();},3000);

/* ══ FLOATING HEARTS emitter ══ */
const heartEmojis=['♥','🌸','✦','💛','🌟','✨','💖'];
function spawnHeart(){
  const h=document.createElement('span');
  h.className='heart-float';
  h.textContent=heartEmojis[Math.floor(Math.random()*heartEmojis.length)];
  h.style.left=(5+Math.random()*90)+'vw';
  h.style.bottom='0px';
  h.style.color=['#e8617a','#f7b8c4','#d4a84b','#c8a8f9','#fff6d6'][Math.floor(Math.random()*5)];
  h.style.setProperty('--hx',(Math.random()*60-30)+'px');
  const dur=6+Math.random()*7;
  h.style.animationDuration=dur+'s';
  h.style.animationDelay=(Math.random()*1.5)+'s';
  h.style.fontSize=(10+Math.random()*14)+'px';
  document.body.appendChild(h);
  setTimeout(()=>h.remove(),(dur+2)*1000);
}
if(!prefersReducedMotion){
  setInterval(spawnHeart,coarsePointer ? 2400 : 1400);
  const initialHearts = coarsePointer ? 2 : 5;
  for(let i=0;i<initialHearts;i++) setTimeout(spawnHeart,i*400);
}

/* ══ CLICK RIPPLE ══ */
document.addEventListener('click',e=>{
  if(prefersReducedMotion) return;
  const r=document.createElement('div');
  r.className='page-ripple';
  r.style.left=e.clientX+'px';
  r.style.top=e.clientY+'px';
  document.body.appendChild(r);
  r.addEventListener('animationend',()=>r.remove());
});

/* ══ GOLD DUST on scroll ══ */
let lastDustY=0;
window.addEventListener('scroll',()=>{
  if(prefersReducedMotion) return;
  const sy=window.scrollY;
  if(Math.abs(sy-lastDustY)>60){
    lastDustY=sy;
    const dustCount = coarsePointer ? 1 : 3;
    for(let i=0;i<dustCount;i++){
      const d=document.createElement('div');
      d.className='gdust';
      d.style.left=(10+Math.random()*80)+'vw';
      d.style.top=(20+Math.random()*60)+'vh';
      d.style.setProperty('--dx',(Math.random()*50-25)+'px');
      const dur=2.5+Math.random()*2;
      d.style.animationDuration=dur+'s';
      document.body.appendChild(d);
      setTimeout(()=>d.remove(),(dur+.5)*1000);
    }
  }
},{passive:true});

/* ══ MOUSE PARALLAX on hero elements ══ */
const heroName=document.querySelector('.hero-name');
const heroSub=document.querySelector('.hero-sub');
const namGlow=document.querySelector('.name-glow');
if(finePointer && !prefersReducedMotion){
  document.addEventListener('mousemove',e=>{
    const xN=(e.clientX/window.innerWidth-.5)*18;
    const yN=(e.clientY/window.innerHeight-.5)*10;
    if(heroName) heroName.style.transform=`translate(${xN*.4}px,${yN*.4}px)`;
    if(heroSub) heroSub.style.transform=`translate(${xN*.2}px,${yN*.2}px)`;
    if(namGlow) namGlow.style.transform=`translate(${xN*.6}px,${yN*.6}px)`;
    /* aurora mouse drift */
    const aurora=document.getElementById('aurora');
    if(aurora) aurora.style.transform=`translate(${xN*.35}px,${yN*.25}px)`;
  });
}

/* ══ SCROLL PARALLAX on story images ══ */
let storyScrollPending=false;
window.addEventListener('scroll',()=>{
  if(prefersReducedMotion || storyScrollPending) return;
  storyScrollPending=true;
  requestAnimationFrame(()=>{
    document.querySelectorAll('.story-media img').forEach(img=>{
      const rect=img.closest('.story-frame').getBoundingClientRect();
      const center=rect.top+rect.height/2-window.innerHeight/2;
      const shift=center*.06;
      img.style.transform=`scale(1.08) translateY(${shift}px)`;
    });
    /* hero subtle scroll push */
    const heroEl=document.querySelector('.hero');
    if(heroEl){
      const sy=window.scrollY;
      const hi=heroEl.offsetHeight;
      if(sy<hi && !finePointer){
        const pct=sy/hi;
        if(heroName) heroName.style.transform=`translateY(${pct*28}px)`;
      }
    }
    storyScrollPending=false;
  });
},{passive:true});

/* ══ GALLERY heading sparkle burst ── */
(()=>{
  const galH=document.querySelector('.gallery-section h2');
  if(!galH || prefersReducedMotion || !('IntersectionObserver' in window)) return;
  const galObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        let count=0;
        const burst=setInterval(()=>{
          const s=document.createElement('span');
          s.className='heart-float';
          s.textContent=['✦','✨','🌸','⭐','💫'][Math.floor(Math.random()*5)];
          const rect=galH.getBoundingClientRect();
          s.style.left=(rect.left+Math.random()*rect.width)+'px';
          s.style.top=(rect.bottom+window.scrollY)+'px';
          s.style.position='absolute';
          s.style.color='#d4a84b';
          s.style.animationDuration='2.5s';
          s.style.fontSize=(10+Math.random()*12)+'px';
          document.body.appendChild(s);
          setTimeout(()=>s.remove(),3000);
          if(++count>(coarsePointer ? 6 : 14)) clearInterval(burst);
        },90);
        galObs.unobserve(e.target);
      }
    });
  },{threshold:.5});
  galObs.observe(galH);
})();

/* ══ WISH BODY: stagger paragraph ── */
(()=>{
  const wb=document.querySelector('.wish-body');
  if(!wb) return;
  if(!('IntersectionObserver' in window)){
    wb.style.opacity='1';wb.style.transform='none';
    return;
  }
  const wObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        wb.style.opacity='1';wb.style.transform='none';
        wObs.unobserve(e.target);
      }
    });
  },{threshold:.2});
  wObs.observe(wb);
})();

/* ══ MSG CARDS: mini sparkle on hover ── */
document.querySelectorAll('.msg-card').forEach(card=>{
  if(!finePointer || prefersReducedMotion) return;
  card.addEventListener('mouseenter',()=>{
    for(let i=0;i<6;i++){
      const s=document.createElement('span');
      s.className='heart-float';
      s.textContent=['✦','✨','🌸','💫','⭐'][Math.floor(Math.random()*5)];
      const rect=card.getBoundingClientRect();
      s.style.left=(rect.left+Math.random()*rect.width)+'px';
      s.style.top=(rect.top+window.scrollY+rect.height*.7)+'px';
      s.style.position='absolute';
      s.style.animationDuration='2s';
      s.style.fontSize=(8+Math.random()*10)+'px';
      s.style.color=card.style.getPropertyValue('--mc-col')||'#d4a84b';
      document.body.appendChild(s);
      setTimeout(()=>s.remove(),2500);
    }
  });
});

/* ══ MESSAGE CARDS — no JS needed ══ */
