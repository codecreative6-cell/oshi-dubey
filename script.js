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
    const wrap = document.querySelector('.pre-hb-wrap');
    const emojis = ['✨','🎉','⭐','🌸','🎊','💫','🌟'];
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
      if(++count > 30) clearInterval(interval);
    }, 150);
  }, 800);

  // Confetti rain
  const confWrap = document.getElementById('preConfetti');
  const confColors = ['#e8617a','#d4a84b','#f7b8c4','#9b50e0','#2ecc90','#fff6d6','#40c0ff'];
  for(let i = 0; i < 38; i++){
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
    setTimeout(launchConfetti,500);
    setTimeout(launchManyFireworks,800);
  },2800);
});

/* ══ SCROLL PROGRESS ══ */
window.addEventListener('scroll',()=>{
  const s=document.documentElement.scrollTop;
  const h=document.documentElement.scrollHeight-window.innerHeight;
  document.getElementById('progress').style.width=(s/h*100)+'%';
});

/* ══ CURSOR + SPARKLE TRAIL ══ */
const cur=document.getElementById('cursor');
const ring=document.getElementById('cursor-ring');
const sc=document.getElementById('sparkle-canvas');
const sctx=sc.getContext('2d');
function resizeSC(){sc.width=window.innerWidth;sc.height=window.innerHeight}
resizeSC(); window.addEventListener('resize',resizeSC);
let mx=0,my=0,sparks=[];
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

/* ══ STAR FIELD ══ */
const sf=document.getElementById('starfield');
const sfx=sf.getContext('2d');
let SW,SH,stars=[];
function resizeSF(){SW=sf.width=window.innerWidth;SH=sf.height=window.innerHeight}
resizeSF();window.addEventListener('resize',resizeSF);
for(let i=0;i<140;i++) stars.push({x:Math.random()*2000,y:Math.random()*2000,r:Math.random()*1.7+.2,a:Math.random(),da:(Math.random()-.5)*.013,c:Math.random()>.5?'#d4a84b':Math.random()>.5?'#e8617a':'#b090ff'});
(function sfL(){
  requestAnimationFrame(sfL);
  sfx.clearRect(0,0,SW,SH);
  stars.forEach(s=>{
    s.a+=s.da;if(s.a<=0||s.a>=1)s.da*=-1;
    sfx.save();sfx.globalAlpha=s.a*.5;sfx.fillStyle=s.c;
    sfx.shadowBlur=7;sfx.shadowColor=s.c;
    sfx.beginPath();sfx.arc(s.x%SW,s.y%SH,s.r,0,Math.PI*2);sfx.fill();
    sfx.restore();s.y-=.1;if(s.y<0){s.y=SH;s.x=Math.random()*SW}
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
setInterval(spawnPetal,450);for(let i=0;i<12;i++)setTimeout(spawnPetal,i*150);

/* ══ TYPEWRITER ══ */
const quotes=[
  "She is clothed in strength and dignity, and she laughs without fear of the future.",
  "There is no force equal to a woman determined to rise.",
  "She wore her scars as her best outfit — a stunning dress made of hellfire, and she was the queen who set it ablaze.",
  "To the world you may be one person, but to one person you may be the world."
];
let qi=0,ci=0,typing=true;
const tw=document.getElementById('typewriter');
function typeStep(){
  if(typing){
    if(ci<quotes[qi].length){tw.textContent=quotes[qi].slice(0,++ci);setTimeout(typeStep,38)}
    else{typing=false;setTimeout(typeStep,2800)}
  } else {
    if(ci>0){tw.textContent=quotes[qi].slice(0,--ci);setTimeout(typeStep,16)}
    else{typing=true;qi=(qi+1)%quotes.length;setTimeout(typeStep,400)}
  }
}
setTimeout(typeStep,3500);

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
cImgs.forEach((src,i)=>{
  const card=document.createElement('div');card.className='c-card';
  card.innerHTML=`<img src="${src}" alt="" loading="lazy">`;
  card.onclick=()=>openLB(i);
  cRing.appendChild(card);
  cCards.push(card);
});
function layoutCarousel(){
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
  item.addEventListener('mousemove',e=>{
    const r=item.getBoundingClientRect();
    const xP=(e.clientX-r.left)/r.width-.5,yP=(e.clientY-r.top)/r.height-.5;
    item.style.transform=`perspective(600px) rotateY(${xP*12}deg) rotateX(${-yP*12}deg) scale(1.02)`;
  });
  item.addEventListener('mouseleave',()=>{item.style.transform=''});
  gal.appendChild(item);
});

/* ══ INTERSECTION OBSERVER ══ */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target)}});
},{threshold:.08});
document.querySelectorAll('.g-item,.reveal').forEach(el=>obs.observe(el));

/* ══ LIGHTBOX ══ */
let lbIdx=0;
function openLB(i){lbIdx=i;document.getElementById('lbImg').src=imgList[i];document.getElementById('lbCt').textContent=`${i+1} / ${imgList.length}`;document.getElementById('lb').classList.add('open');document.body.style.overflow='hidden'}
function closeLB(){document.getElementById('lb').classList.remove('open');document.body.style.overflow=''}
function lbNav(d){lbIdx=(lbIdx+d+imgList.length)%imgList.length;openLB(lbIdx)}
document.getElementById('lb').addEventListener('click',function(e){if(e.target===this)closeLB()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLB();if(e.key==='ArrowRight')lbNav(1);if(e.key==='ArrowLeft')lbNav(-1)});

/* ══ FIREWORKS ══ */
const fwc=document.getElementById('fireworks');
const fwx=fwc.getContext('2d');
function resizeFW(){fwc.width=window.innerWidth;fwc.height=window.innerHeight}
resizeFW();window.addEventListener('resize',resizeFW);
let fwP=[];
function launchFW(x,y){
  const cols=['#f9c83a','#e8617a','#d4a84b','#f7b8c4','#c8a8f9','#80ffcc'];
  for(let i=0;i<30;i++){
    const a=Math.random()*Math.PI*2,sp=Math.random()*5+1.5;
    fwP.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,a:.65,r:Math.random()*2+.7,c:cols[Math.floor(Math.random()*cols.length)],g:.08});
  }
}
(function fwLoop(){
  requestAnimationFrame(fwLoop);
  fwx.clearRect(0,0,fwc.width,fwc.height);
  fwP=fwP.filter(p=>p.a>.025);
  fwP.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.vx*=.96;p.vy*=.96;p.a-=.022;
    fwx.save();fwx.globalAlpha=p.a;fwx.fillStyle=p.c;fwx.shadowBlur=4;fwx.shadowColor=p.c;
    fwx.beginPath();fwx.arc(p.x,p.y,p.r,0,Math.PI*2);fwx.fill();fwx.restore();
  });
})();
function launchManyFireworks(){
  for(let i=0;i<4;i++) setTimeout(()=>launchFW(Math.random()*window.innerWidth,Math.random()*window.innerHeight*.55),i*350);
}

/* ══ CONFETTI ══ */
function launchConfetti(){
  const cf=document.getElementById('cfWrap');
  const cols=['#e8617a','#d4a84b','#f7b8c4','#fff6d6','#c74f6a','#f9c83a','#fff','#c8a8f9','#80ffcc'];
  for(let i=0;i<200;i++){
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
setTimeout(()=>{launchManyFireworks();launchConfetti();},3000);
