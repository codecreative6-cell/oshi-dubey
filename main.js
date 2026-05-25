/* ── SCROLL PROGRESS BAR ── */
const scrollBar=document.getElementById('scroll-bar');
window.addEventListener('scroll',()=>{
  const pct=window.scrollY/(document.body.scrollHeight-window.innerHeight)*100;
  scrollBar.style.width=pct+'%';
},{passive:true});

/* ── dual cursor + SPARK TRAIL ── */
const cur=document.getElementById('cur');
const ring=document.getElementById('cur-ring');
let rx=0,ry=0,tx=0,ty=0;
const SPARK_COLORS=['#ff6500','#e8007a','#00ddc8','#ffc93c'];
let sparkCount=0;
document.addEventListener('mousemove',e=>{
  tx=e.clientX;ty=e.clientY;
  cur.style.left=tx+'px';cur.style.top=ty+'px';
  /* spawn spark every 3rd move */
  if(++sparkCount%3===0){
    const sp=document.createElement('div');
    sp.className='spark';
    sp.style.left=tx+'px';
    sp.style.top=ty+'px';
    sp.style.background=SPARK_COLORS[Math.floor(Math.random()*SPARK_COLORS.length)];
    sp.style.width=(3+Math.random()*5)+'px';
    sp.style.height=sp.style.width;
    sp.style.boxShadow=`0 0 6px ${sp.style.background}`;
    const angle=Math.random()*Math.PI*2;
    const dist=20+Math.random()*30;
    sp.style.setProperty('--tx',Math.cos(angle)*dist+'px');
    sp.style.setProperty('--ty',Math.sin(angle)*dist+'px');
    document.body.appendChild(sp);
    setTimeout(()=>sp.remove(),600);
  }
});
/* cursor grows on interactive elements */
document.querySelectorAll('a,button,.gc,.pill,.diya,.ln,.lx').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.classList.add('big');ring.classList.add('big');});
  el.addEventListener('mouseleave',()=>{cur.classList.remove('big');ring.classList.remove('big');});
});
function animRing(){
  rx+=(tx-rx)*.1;ry+=(ty-ry)*.1;
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
}animRing();

/* ── HERO: split "OSHI" into animated letters ── */
const line1=document.getElementById('line1-wrap');
'OSHI'.split('').forEach((ch,i)=>{
  const s=document.createElement('span');
  s.className='ltr';
  s.textContent=ch;
  s.style.animationDelay=(.4+i*.12)+'s';
  line1.appendChild(s);
});

/* ── HERO: typewriter kicker ── */
const kickerEl=document.getElementById('hero-kicker');
const kickerText='✦ Classical Dancer · Artist · Birthday Celebration ✦';
let ki=0;
function typeKicker(){
  if(ki<=kickerText.length){
    kickerEl.textContent=kickerText.slice(0,ki);
    kickerEl.style.opacity='1';
    ki++;
    setTimeout(typeKicker,ki<3?0:42);
  }
}
setTimeout(typeKicker,500);

/* ── HERO: staggered pill pop ── */
document.querySelectorAll('.pill').forEach((p,i)=>{
  p.style.animationDelay=(1.8+i*.09)+'s';
});

/* ── SPLIT-TEXT WORD REVEAL (about-title, gal-title) ── */
function splitWords(el){
  if(!el)return;
  el.classList.add('split-reveal');
  /* operate on child spans, not the element itself */
  el.querySelectorAll('span,p,.about-body').forEach(node=>{
    /* skip non-text parents */
  });
  /* wrap words in each direct text block */
  const wrap=(node)=>{
    const txt=node.textContent.trim();
    if(!txt)return;
    node.innerHTML=txt.split(' ').map(w=>`<span class="word"><span class="inner">${w}</span></span>`).join(' ');
  };
  el.childNodes.forEach(n=>{if(n.nodeType===3&&n.textContent.trim())wrap(el);});
}

/* ── ABOUT TITLE split-reveal ── */
(()=>{
  const t=document.querySelector('.about-title');
  if(!t)return;
  /* wrap lines manually */
  t.querySelectorAll('br').forEach(br=>{br.replaceWith(' ');});
  const raw=t.innerHTML.replace(/<span[^>]*>(.*?)<\/span>/g,'$1');
  const words=raw.split(/\s+/).filter(Boolean);
  t.innerHTML=words.map(w=>`<span class="word"><span class="inner">${w}</span></span>`).join(' ');
  t.classList.add('split-reveal');
  new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting)t.classList.add('on');
  },{threshold:.3}).observe(t);
})();

/* ── GALLERY TITLE FLICKER ── */
(()=>{
  const gt=document.querySelector('.gal-title');
  if(!gt)return;
  new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting)gt.classList.add('flicker-on');
  },{threshold:.4}).observe(gt);
})();

/* ── ABOUT INK REVEAL ── */
(()=>{
  const al=document.querySelector('.about-left');
  if(!al)return;
  new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting)al.classList.add('ink-on');
  },{threshold:.2}).observe(al);
})();

/* ── HERO PARTICLE CANVAS ── */
(function(){
  const canvas=document.getElementById('hero-canvas');
  const hero=document.getElementById('hero');
  const ctx=canvas.getContext('2d');
  function resize(){canvas.width=hero.offsetWidth;canvas.height=hero.offsetHeight;}
  resize();
  window.addEventListener('resize',resize);
  const COLORS=['#ff6500','#e8007a','#00ddc8','#ffc93c','#f0eeff'];
  const N=90;
  class Particle{
    constructor(){this.reset(true);}
    reset(cold){
      this.x=Math.random()*canvas.width;
      this.y=cold?Math.random()*canvas.height:canvas.height+10;
      this.r=Math.random()*2.2+.6;
      this.color=COLORS[Math.floor(Math.random()*COLORS.length)];
      this.vx=(Math.random()-.5)*.5;
      this.vy=-(Math.random()*1.1+.3);
      this.alpha=Math.random()*.7+.2;
      this.flicker=Math.random()*Math.PI*2;
      this.flickerSpeed=Math.random()*.06+.02;
      this.star=Math.random()<.04;
      if(this.star){this.vx=(Math.random()-.5)*6;this.vy=-(Math.random()*5+3);this.tail=Math.random()*40+20;}
    }
    update(){
      this.x+=this.vx;this.y+=this.vy;this.flicker+=this.flickerSpeed;
      if(this.y<-20||this.x<-20||this.x>canvas.width+20)this.reset(false);
    }
    draw(){
      const a=this.alpha*(0.6+0.4*Math.sin(this.flicker));
      ctx.save();ctx.globalAlpha=a;
      if(this.star){
        ctx.strokeStyle=this.color;ctx.lineWidth=this.r;
        ctx.beginPath();ctx.moveTo(this.x,this.y);
        ctx.lineTo(this.x-this.vx*(this.tail/6),this.y-this.vy*(this.tail/6));ctx.stroke();
      } else {
        const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r*4);
        g.addColorStop(0,this.color);g.addColorStop(1,'transparent');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(this.x,this.y,this.r*4,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=this.color;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();
      }
      ctx.restore();
    }
  }
  const particles=Array.from({length:N},()=>new Particle());
  let mx=-9999,my=-9999;
  hero.addEventListener('mousemove',e=>{const rect=hero.getBoundingClientRect();mx=e.clientX-rect.left;my=e.clientY-rect.top;});
  hero.addEventListener('mouseleave',()=>{mx=-9999;my=-9999;});
  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      if(!p.star){
        const dx=mx-p.x,dy=my-p.y,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<140){p.vx+=dx/dist*.05;p.vy+=dy/dist*.05;}
        p.vx*=.99;p.vy=Math.min(p.vy*.99,-.1);
      }
      p.update();p.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── HERO IMAGE PARALLAX ── */
(function(){
  const wrap=document.getElementById('heroImgWrap');
  const inner=document.getElementById('heroImgInner');
  if(!wrap||!inner)return;
  document.addEventListener('mousemove',e=>{
    const cx=window.innerWidth/2,cy=window.innerHeight/2;
    const dx=(e.clientX-cx)/cx,dy=(e.clientY-cy)/cy;
    wrap.style.transform=`perspective(800px) rotateY(${dx*6}deg) rotateX(${-dy*4}deg) translateZ(0)`;
    inner.style.transform=`translateX(${dx*-8}px) translateY(${dy*-6}px)`;
  });
  document.addEventListener('mouseleave',()=>{
    wrap.style.transform='perspective(800px) rotateY(0) rotateX(0)';
    inner.style.transform='none';
  });
})();

/* ── CARD GALLERY ── */
const words=['Grace','Fire','Soul','Flow','Mudra','Rasa','Taal','Light','Rhythm','Earth','Bloom','Prayer','Storm','Lotus','Myth','Voice','Breath','Sacred','Raw','Pure','Divine','Star','Dream','Glory','Wild','Truth','Eternal'];
const lowercaseSet=new Set([19,21]);
function imgPath(n){const ext=lowercaseSet.has(n)?'.jpg':'.JPG';return `img/img (${n})${ext}`;}

const grid=document.getElementById('grid');
let imgs=[];
for(let i=1;i<=27;i++){
  const p=imgPath(i);
  imgs.push(p);
  const word=words[i-1]||'Art';
  const div=document.createElement('div');
  div.className='gc';
  div.dataset.i=i-1;
  div.innerHTML=`
    <div class="gc-streak"></div>
    <div class="gc-img-wrap">
      <img src="${p}" alt="${word}" loading="lazy">
      <div class="gc-num">${String(i).padStart(2,'0')}</div>
    </div>
    <div class="gc-foot">
      <span class="gc-word">${word}</span>
      <div class="gc-bar"></div>
    </div>`;
  grid.appendChild(div);
  div.addEventListener('click',e=>{
    /* ripple */
    const r=document.createElement('div');
    r.className='gc-ripple';
    const rect=div.getBoundingClientRect();
    const size=Math.max(rect.width,rect.height)*1.4;
    r.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
    div.appendChild(r);
    setTimeout(()=>r.remove(),600);
    openLB(i-1);
  });
  /* 3D tilt on hover */
  div.addEventListener('mousemove',e=>{
    const rect=div.getBoundingClientRect();
    const cx=(e.clientX-rect.left)/rect.width-.5;
    const cy=(e.clientY-rect.top)/rect.height-.5;
    div.style.setProperty('--rx',(-cy*14)+'deg');
    div.style.setProperty('--ry',(cx*14)+'deg');
  });
  div.addEventListener('mouseleave',()=>{
    div.style.setProperty('--rx','0deg');
    div.style.setProperty('--ry','0deg');
  });
}

/* staggered card entrance */
const cardObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const idx=Array.from(grid.children).indexOf(e.target);
      e.target.style.animationDelay=(idx%6)*.07+'s';
      e.target.classList.add('card-visible');
      cardObs.unobserve(e.target);
    }
  });
},{threshold:.1});
document.querySelectorAll('.gc').forEach(el=>cardObs.observe(el));

/* ── GHUNGROO particles in gallery ── */
(()=>{
  const gal=document.getElementById('gallery');
  if(!gal)return;
  const colors=['#ffc93c','#ff6500','#e8007a','#00ddc8'];
  function spawnGhungroo(){
    const g=document.createElement('div');
    g.className='ghungroo';
    g.style.left=(5+Math.random()*90)+'%';
    g.style.bottom=(Math.random()*30)+'%';
    g.style.background=colors[Math.floor(Math.random()*colors.length)];
    g.style.animationDuration=(4+Math.random()*5)+'s';
    g.style.animationDelay=(Math.random()*2)+'s';
    g.style.width=g.style.height=(4+Math.random()*6)+'px';
    gal.appendChild(g);
    setTimeout(()=>g.remove(),(9000));
  }
  setInterval(spawnGhungroo,600);
  for(let i=0;i<8;i++)setTimeout(spawnGhungroo,i*200);
})();

/* ── LIGHTBOX with slide transitions ── */
const lb=document.getElementById('lb');
const lbImg=document.getElementById('lbImg');
const lbCounter=document.getElementById('lb-counter');
let ci=0;

function updateCounter(){
  if(lbCounter)lbCounter.textContent=`${ci+1} / ${imgs.length}`;
}
function openLB(i){
  ci=i;lbImg.src=imgs[i];
  lb.classList.add('open');
  updateCounter();
}
function navigate(dir){
  /* slide out */
  lbImg.className=dir>0?'slide-out-left':'slide-out-right';
  setTimeout(()=>{
    ci=(ci+dir+imgs.length)%imgs.length;
    lbImg.src=imgs[ci];
    lbImg.className=dir>0?'slide-in-right':'slide-in-left';
    updateCounter();
    setTimeout(()=>lbImg.className='',350);
  },280);
}
document.getElementById('lbX').onclick=()=>lb.classList.remove('open');
lb.addEventListener('click',e=>{if(e.target===lb)lb.classList.remove('open');});
document.getElementById('lbPrev').onclick=()=>navigate(-1);
document.getElementById('lbNext').onclick=()=>navigate(1);
/* swipe support */
let lbTouchX=0;
lb.addEventListener('touchstart',e=>{lbTouchX=e.touches[0].clientX;},{passive:true});
lb.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-lbTouchX;
  if(Math.abs(dx)>50)navigate(dx<0?1:-1);
});
document.addEventListener('keydown',e=>{
  if(!lb.classList.contains('open'))return;
  if(e.key==='ArrowLeft')navigate(-1);
  if(e.key==='ArrowRight')navigate(1);
  if(e.key==='Escape')lb.classList.remove('open');
});

/* ── reveal (non-gallery elements) ── */
const obs=new IntersectionObserver(en=>{
  en.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on');});
},{threshold:.1});
document.querySelectorAll('.rev').forEach(el=>obs.observe(el));

/* ── STAGE FINALE ── */
(function(){
  /* pelmet fringe */
  const fr=document.getElementById('fringeRow');
  for(let i=0;i<55;i++){
    const s=document.createElement('span');
    s.style.height=(14+Math.random()*16)+'px';
    s.style.animationDelay=(Math.random()*2.5)+'s';
    fr.appendChild(s);
  }

  /* ── OUTRO STARS CANVAS ── */
  const starsCanvas=document.getElementById('outro-stars');
  if(starsCanvas){
    const sc=starsCanvas.getContext('2d');
    function resizeStars(){starsCanvas.width=starsCanvas.offsetWidth;starsCanvas.height=starsCanvas.offsetHeight;}
    resizeStars();
    window.addEventListener('resize',resizeStars);
    const stars=Array.from({length:120},()=>({
      x:Math.random()*starsCanvas.width,y:Math.random()*starsCanvas.height,
      r:Math.random()*1.5+.3,a:Math.random(),
      flicker:Math.random()*Math.PI*2,fs:Math.random()*.04+.01
    }));
    function starLoop(){
      sc.clearRect(0,0,starsCanvas.width,starsCanvas.height);
      stars.forEach(s=>{
        s.flicker+=s.fs;
        const a=s.a*(0.5+0.5*Math.sin(s.flicker));
        sc.globalAlpha=a;
        sc.fillStyle='#f0eeff';
        sc.beginPath();sc.arc(s.x,s.y,s.r,0,Math.PI*2);sc.fill();
      });
      requestAnimationFrame(starLoop);
    }starLoop();
  }

  /* confetti canvas */
  const canvas=document.getElementById('confetti-canvas');
  const ctx=canvas.getContext('2d');
  function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  resizeCanvas();
  window.addEventListener('resize',resizeCanvas);
  const C_COLORS=['#ff6500','#ffc93c','#e8007a','#00ddc8','#fff0a0','#ff9f45','#d000ff'];
  let pieces=[],animId=null;
  function launchConfetti(){
    if(animId)cancelAnimationFrame(animId);
    pieces=[];
    for(let i=0;i<260;i++){
      pieces.push({
        x:Math.random()*canvas.width,y:-30-Math.random()*300,
        w:4+Math.random()*10,h:3+Math.random()*6,
        col:C_COLORS[Math.floor(Math.random()*C_COLORS.length)],
        rot:Math.random()*Math.PI*2,rv:(Math.random()-.5)*.18,
        vx:(Math.random()-.5)*5,vy:2+Math.random()*4,al:1,
        circle:Math.random()<.3,wobble:Math.random()*Math.PI*2,ws:Math.random()*.08+.03
      });
    }
    tick();
  }
  function tick(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let any=false;
    pieces.forEach(p=>{
      p.x+=p.vx+Math.sin(p.wobble)*1.5;p.y+=p.vy;p.rot+=p.rv;p.wobble+=p.ws;
      if(p.y>canvas.height*.6)p.al-=.014;
      if(p.al<=0)return;
      any=true;
      ctx.save();ctx.globalAlpha=Math.max(0,p.al);
      ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.col;
      if(p.circle){ctx.beginPath();ctx.arc(0,0,p.w/2,0,Math.PI*2);ctx.fill();}
      else{ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);}
      ctx.restore();
    });
    if(any)animId=requestAnimationFrame(tick);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }

  /* curtain auto-open */
  const btn=document.getElementById('openBtn');
  const outro=document.getElementById('outro');
  btn.style.display='none';
  const curtainIO=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting && !outro.classList.contains('open')){
      outro.classList.add('open');
      setTimeout(launchConfetti,1900);
      curtainIO.disconnect();
    }
  },{threshold:0.3});
  curtainIO.observe(outro);

  /* diyas — staggered entrance */
  const row=document.getElementById('diyaRow');
  const msg=document.getElementById('diyaMsg');
  const N=9; let lit=0;
  for(let i=0;i<N;i++){
    const d=document.createElement('div');
    d.className='diya';
    d.innerHTML='<div class="diya-flame"></div><div class="diya-wick"></div><div class="diya-body"></div>';
    d.addEventListener('click',()=>{
      if(d.classList.contains('lit'))return;
      d.classList.add('lit'); lit++;
      if(lit===N){msg.style.opacity='1'; launchConfetti();}
    });
    row.appendChild(d);
    /* stagger entrance */
    setTimeout(()=>d.classList.add('diya-entered'), 2200+i*120);
  }
})();
