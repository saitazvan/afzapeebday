/* ══════════════════════════════════════════
   CURSOR
══════════════════════════════════════════ */
const xc=document.getElementById('xc'),xct=document.getElementById('xct');
let mx=0,my=0;
if(window.innerWidth>768){
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    xc.style.left=mx+'px';xc.style.top=my+'px';
    setTimeout(()=>{xct.style.left=mx+'px';xct.style.top=my+'px'},90);
  });
}

/* ══════════════════════════════════════════
   SPARKLE TRAIL on mouse move
══════════════════════════════════════════ */
let lastTrail=0;
document.addEventListener('mousemove',e=>{
  const now=Date.now();
  if(now-lastTrail<55) return;
  lastTrail=now;
  const t=document.createElement('div');t.className='mtrail';
  t.style.left=e.clientX+'px';t.style.top=e.clientY+'px';
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),620);
});

/* ══════════════════════════════════════════
   STARS
══════════════════════════════════════════ */
function mkStars(id,cls,n){
  const el=document.getElementById(id);if(!el)return;
  for(let i=0;i<n;i++){
    const s=document.createElement('div');const sz=Math.random()*2.6+.7;s.className=cls;
    Object.assign(s.style,{left:Math.random()*100+'%',top:Math.random()*100+'%',width:sz+'px',height:sz+'px','--d':(Math.random()*2.8+1.2)+'s',animationDelay:Math.random()*4+'s',opacity:Math.random()*.5+.15});
    el.appendChild(s);
  }
}
mkStars('lbg','lst',85);
mkStars('sfld','sd',150);

/* ══════════════════════════════════════════
   FLOATING SPARKLES in hero
══════════════════════════════════════════ */
(()=>{
  const h=document.getElementById('hero');
  for(let i=0;i<26;i++){
    const p=document.createElement('div');p.className='fsp';
    Object.assign(p.style,{left:Math.random()*100+'%',bottom:Math.random()*44+'%','--fs':(4+Math.random()*5)+'s','--fd':(Math.random()*7)+'s'});
    h.appendChild(p);
  }
})();

/* ══════════════════════════════════════════
   PER-LETTER INTERACTIVE TITLE
══════════════════════════════════════════ */
/* ══════════════════════════════════════════
   PARALLAX TILT on hero title (desktop)
══════════════════════════════════════════ */
const htblock=document.getElementById('htblock');
const hero=document.getElementById('hero');
if(window.innerWidth>768){
  hero.addEventListener('mousemove',e=>{
    const r=hero.getBoundingClientRect();
    const cx=(e.clientX-r.left)/r.width-.5;
    const cy=(e.clientY-r.top)/r.height-.5;
    htblock.style.transform=`rotateY(${cx*7}deg) rotateX(${-cy*4}deg) translateZ(12px)`;
  });
  hero.addEventListener('mouseleave',()=>{
    htblock.style.transform='rotateY(0) rotateX(0) translateZ(0)';
  });
}

/* ══════════════════════════════════════════
   CONFETTI ENGINE
══════════════════════════════════════════ */
const cv=document.getElementById('cvc'),ct=cv.getContext('2d');
let parts=[];
function resz(){cv.width=innerWidth;cv.height=innerHeight}
resz();window.addEventListener('resize',resz);
const COLS=['#c084fc','#f0abfc','#fbbf24','#a7f3d0','#e9d5ff','#f9a8d4','#fff','#d8b4fe','#fde68a','#fbcfe8'];

function mkP(x,y,left){
  const angle=left?(Math.random()*80+115):(Math.random()*80-45);
  const rad=angle*Math.PI/180,spd=Math.random()*18+9;
  return{x,y,vx:Math.cos(rad)*spd,vy:Math.sin(rad)*spd-(Math.random()*7+7),g:.54,
    col:COLS[0|Math.random()*COLS.length],sz:Math.random()*10+4,
    rot:Math.random()*360,rv:(Math.random()-.5)*13,op:1,life:0,
    shp:Math.random()>.4?'rect':'circ',wb:Math.random()*.08,ws:Math.random()*.05};
}
function cannon(left){
  const bx=left?0:cv.width,by=cv.height;
  for(let i=0;i<90;i++) parts.push(mkP(bx,by,left));
}
let raf;
function animC(){
  ct.clearRect(0,0,cv.width,cv.height);
  parts=parts.filter(p=>p.op>.02&&p.y<cv.height+80);
  parts.forEach(p=>{
    p.x+=p.vx+Math.sin(p.life*p.ws)*p.wb*22;
    p.y+=p.vy;p.vy+=p.g;p.rot+=p.rv;p.life++;
    if(p.life>58)p.op-=.013;
    ct.save();ct.globalAlpha=p.op;ct.translate(p.x,p.y);ct.rotate(p.rot*Math.PI/180);
    ct.fillStyle=p.col;
    if(p.shp==='circ'){ct.beginPath();ct.arc(0,0,p.sz/2,0,Math.PI*2);ct.fill();}
    else ct.fillRect(-p.sz/2,-p.sz/4,p.sz,p.sz/2);
    ct.restore();
  });
  if(parts.length) raf=requestAnimationFrame(animC);
  else ct.clearRect(0,0,cv.width,cv.height);
}
function fireCannons(){
  cannon(true);cannon(false);
  cancelAnimationFrame(raf);animC();
  /* second burst */
  setTimeout(()=>{cannon(true);cannon(false);},720);
}

/* ══════════════════════════════════════════
   LOCK / PASSWORD
══════════════════════════════════════════ */
const ANS="AZVAN SAIT",WORDS=ANS.split(' ');
let hintLvl=0;
const bgMusic=document.getElementById('bgMusic'),musicBtn=document.getElementById('musicBtn');
function toggleMusic(){
  const txt=musicBtn.querySelector('span');
  if(bgMusic.paused){
    bgMusic.volume=.38;
    bgMusic.play().then(()=>{
      musicBtn.classList.add('playing');
      musicBtn.setAttribute('aria-label','Pause background music');
      txt.textContent='Pause';
    }).catch(()=>{
      txt.textContent='Add track';
      musicBtn.setAttribute('aria-label','Add music file to enable playback');
    });
  }else{
    bgMusic.pause();
    musicBtn.classList.remove('playing');
    musicBtn.setAttribute('aria-label','Play background music');
    txt.textContent='Music';
  }
}
function buildBoxes(){
  const c=document.getElementById('lboxes');c.innerHTML='';
  WORDS.forEach((w,wi)=>{
    if(wi>0){const g=document.createElement('div');g.className='lgap';c.appendChild(g);}
    const grp=document.createElement('div');grp.className='lgrp';
    w.split('').forEach((_,li)=>{
      const b=document.createElement('input');b.className='lb';b.maxLength=1;b.id=`b${wi}_${li}`;
      b.addEventListener('input',e=>{
        e.target.value=e.target.value.toUpperCase();
        if(e.target.value){
          const nx=document.getElementById(`b${wi}_${li+1}`)||(wi<WORDS.length-1?document.getElementById(`b${wi+1}_0`):null);
          if(nx)nx.focus();
        }
      });
      b.addEventListener('keydown',e=>{
        if(e.key==='Backspace'&&!e.target.value){
          const pv=li>0?document.getElementById(`b${wi}_${li-1}`):(wi>0?document.getElementById(`b${wi-1}_${WORDS[wi-1].length-1}`):null);
          if(pv){pv.value='';pv.focus();}
        }
        if(e.key==='Enter')checkAns();
      });
      grp.appendChild(b);
    });
    c.appendChild(grp);
  });
  setTimeout(()=>document.getElementById('b0_0')?.focus(),400);
}
buildBoxes();

function getTyped(){return WORDS.map((w,wi)=>w.split('').map((_,li)=>document.getElementById(`b${wi}_${li}`)?.value||' ').join('')).join(' ');}
function checkAns(){
  const typed=getTyped().trim().toUpperCase();
  const hEl=document.getElementById('hbox');
  if(typed===ANS){
    WORDS.forEach((w,wi)=>w.split('').forEach((_,li)=>{const b=document.getElementById(`b${wi}_${li}`);if(b){b.classList.remove('no');b.classList.add('ok');}}));
    hEl.innerHTML='<span class="hok"><i class="fa-solid fa-check-circle"></i>&nbsp;Welcome aboard, Captain! 🎉 Opening your page…</span>';
    setTimeout(()=>{
      const ov=document.getElementById('lock');
      const reveal=document.getElementById('boardingReveal');
      ov.classList.add('departing');
      ov.style.transition='opacity .65s ease';ov.style.opacity='0';
      setTimeout(()=>{
        ov.style.display='none';
        reveal.classList.add('on');

        // AUTO PLAY MUSIC
        if(bgMusic.paused){
          bgMusic.volume = .38;
          bgMusic.play().catch(()=>{});
          musicBtn.classList.add('playing');
          musicBtn.setAttribute('aria-label','Pause background music');
          musicBtn.querySelector('span').textContent='Pause';
        }

      },650);
      setTimeout(()=>{
        reveal.style.display='none';
        musicBtn.classList.add('on');
        fireCannons();
      },2700);
    },850);
    return;
  }
  WORDS.forEach((w,wi)=>w.split('').forEach((ch,li)=>{
    const b=document.getElementById(`b${wi}_${li}`);if(!b)return;
    b.classList.remove('ok','no');
    b.classList.add(b.value.toUpperCase()===ch?'ok':'no');
  }));
  const hints=[
    "Hmm, not quite! Think carefully 💜",
    "Hint: It's a person's name — first name starts with <b>A</b>",
    "Hint: First name has 5 letters, starts with A, ends with N",
    "Hint: Last name starts with <b>S</b> and ends with <b>T</b>",
    "Hint: First name is <b>Azvan</b> — now the last name!",
    "Almost! Full name: <b>Azvan ____</b> — 4 letters, starts with S 😄"
  ];
  hEl.innerHTML=`<span class="hno"><i class="fa-solid fa-circle-info"></i>&nbsp;${hints[Math.min(hintLvl,hints.length-1)]}</span>`;
  hintLvl++;
}

/* ══════════════════════════════════════════
   GALLERY
══════════════════════════════════════════ */
const CLOUDS=[
  {l:"Cute",e:"😍",id:"charming",src:"images/cute.JPG",dur:"5.2s",del:"0s"},
  {l:"Chaotic",e:"🌪️",id:"chaotic",src:"images/chaotic.JPG",dur:"6.1s",del:"0.5s"},
  {l:"Cool",e:"😎",id:"cool",src:"images/cool.JPG",dur:"4.8s",del:"1s"},
  {l:"Dreamy",e:"🍁",id:"dreamy",src:"images/dreamy.JPG",dur:"7s",del:"0.25s"},
  {l:"Goofy",e:"😂",id:"goofy",src:"images/goofy.JPG",dur:"5.6s",del:"0.75s"},
  {l:"Glowing",e:"💫",id:"glowing",src:"images/glowing.JPG",dur:"6.4s",del:"0.15s"},
  {l:"Brave",e:"🦋",id:"brave",src:"images/brave.JPG",dur:"4.9s",del:"0.6s"},
  {l:"Adorable",e:"🌸",id:"adorable",src:"images/adorable.JPG",dur:"5.8s",del:"0.35s"},
];
let curC=null;

function cloudSVG(){
  /* unique filter id per cloud */
  const uid='cf'+Math.random().toString(36).slice(2,7);
  return `<svg viewBox="0 0 188 108" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    <defs>
      <filter id="${uid}" x="-8%" y="-8%" width="116%" height="128%">
        <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="rgba(80,30,180,.14)"/>
      </filter>
      <radialGradient id="${uid}g" cx="38%" cy="30%" r="65%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#f2e8ff"/>
      </radialGradient>
    </defs>
    <g filter="url(#${uid})">
      <ellipse cx="94"  cy="88"  rx="86"  ry="22" fill="url(#${uid}g)"/>
      <ellipse cx="38"  cy="70"  rx="38"  ry="33" fill="url(#${uid}g)"/>
      <ellipse cx="74"  cy="58"  rx="42"  ry="37" fill="url(#${uid}g)"/>
      <ellipse cx="116" cy="54"  rx="46"  ry="40" fill="url(#${uid}g)"/>
      <ellipse cx="155" cy="65"  rx="36"  ry="30" fill="url(#${uid}g)"/>
      <ellipse cx="94"  cy="42"  rx="30"  ry="26" fill="url(#${uid}g)"/>
      <ellipse cx="76"  cy="57"  rx="20"  ry="12" fill="white" opacity=".35"/>
    </g>
  </svg>`;
}

function buildClouds(){
  const g=document.getElementById('gclouds');
  CLOUDS.forEach(c=>{
    const tile=document.createElement('div');
    tile.className='cltile';
    tile.style.cssText=`--cbd:${c.dur};--cldl:${c.del}`;
    tile.innerHTML=`<div class="cloud-svg-c">${cloudSVG()}</div>
      <div class="cloudlabel"><span class="clemoji">${c.e}</span><span class="cllbl">${c.l}</span></div>`;
    tile.addEventListener('click',()=>openG(c));
    /* touch ripple */
    tile.addEventListener('touchstart',()=>{tile.style.transform='scale(.95)'},{passive:true});
    tile.addEventListener('touchend',()=>{tile.style.transform=''},{passive:true});
    g.appendChild(tile);
  });
}
buildClouds();

function openG(c){
  curC=c.id;
  document.getElementById('pttl').textContent=`${c.e} ${c.l}`;
  const img=document.getElementById('pimg'),ph=document.getElementById('pph');
  img.style.display='none';
  img.alt=`${c.l} memory`;
  ph.style.display='flex';ph.style.flexDirection='column';ph.style.alignItems='center';
  ph.innerHTML='<i class="fa-regular fa-image"></i>Loading memory...';
  img.onload=()=>{
    if(curC!==c.id)return;
    img.style.display='block';
    ph.style.display='none';
  };
  img.onerror=()=>{
    if(curC!==c.id)return;
    img.style.display='none';
    ph.style.display='flex';
    ph.innerHTML=`<i class="fa-regular fa-image"></i>Add your local photo at<br><code>${c.src}</code>`;
  };
  img.src=c.src;
  document.getElementById('gpop').classList.add('on');
}
function closeG(){document.getElementById('gpop').classList.remove('on');}
document.getElementById('gpop').addEventListener('click',e=>{if(e.target===document.getElementById('gpop'))closeG();});

/* ══════════════════════════════════════════
   WISH / CANDLE
══════════════════════════════════════════ */
let blown=false;
function startWish(){
  const b=document.getElementById('bwish');b.disabled=true;b.innerHTML='<i class="fa-solid fa-microphone-lines"></i> Listening…';
  document.getElementById('mtip').classList.add('on');
  navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{
    const ac=new(window.AudioContext||window.webkitAudioContext)(),an=ac.createAnalyser();
    an.fftSize=256;ac.createMediaStreamSource(stream).connect(an);
    const d=new Uint8Array(an.frequencyBinCount);let t=0;
    const iv=setInterval(()=>{
      an.getByteFrequencyData(d);
      const avg=d.reduce((a,b)=>a+b,0)/d.length;t++;
      if(avg>15||t>110){clearInterval(iv);stream.getTracks().forEach(t=>t.stop());ac.close();blowC();}
    },80);
  }).catch(()=>setTimeout(blowC,2500));
}
function blowC(){
  if(blown)return;blown=true;
  ['fl1','fl2','fl3'].forEach((id,i)=>setTimeout(()=>{
    const el=document.getElementById(id);
    if(el){el.style.transition='opacity .5s,transform .5s';el.style.opacity='0';el.style.transform='scaleY(0) translateY(-12px)';}
  },i*190));
  document.getElementById('bwish').innerHTML='<i class="fa-solid fa-star"></i> Wish sent to the universe ✨';
  document.getElementById('mtip').innerHTML='<i class="fa-solid fa-heart"></i>&nbsp;Your wish is floating up to the stars…';
  setTimeout(()=>{fireCannons();spawnHearts();},500);
  setTimeout(()=>{const nb=document.getElementById('bnote');nb.style.display='inline-flex';nb.classList.add('on');},1600);
}
function spawnHearts(){
  const em=['💜','💫','🌸','✨','🎀','❤️','⭐','🌟'];
  for(let i=0;i<18;i++){
    setTimeout(()=>{
      const h=document.createElement('div');h.className='fh';
      h.textContent=em[0|Math.random()*em.length];
      Object.assign(h.style,{left:(15+Math.random()*70)+'%',bottom:'35%','--fhd':(3+Math.random()*2.5)+'s','--fhs':(1+Math.random()*.9)+'rem'});
      document.body.appendChild(h);setTimeout(()=>h.remove(),5500);
    },i*150);
  }
}
let musicVolumeBeforeNote=.38;
function openNote(){
  if(!bgMusic.paused){
    musicVolumeBeforeNote=bgMusic.volume;
    bgMusic.volume=.12;
  }
  document.getElementById('npop').classList.add('on');
}
function closeNote(){
  document.getElementById('npop').classList.remove('on');
  if(!bgMusic.paused)bgMusic.volume=musicVolumeBeforeNote;
}
document.getElementById('npop').addEventListener('click',e=>{if(e.target===document.getElementById('npop'))closeNote();});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    closeG();
    closeNote();
  }
});

/* ══════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
══════════════════════════════════════════ */
const revObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('in');});
},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.rev,.revl,.revr,.rev-scale').forEach(el=>revObs.observe(el));

/* stagger gallery cloud tiles */
const cloudObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      document.querySelectorAll('.cltile').forEach((t,i)=>{
        setTimeout(()=>t.classList.add('in'),i*90);
      });
      cloudObs.disconnect();
    }
  });
},{threshold:.06});
const fc=document.querySelector('.cltile');
if(fc)cloudObs.observe(fc);

/* ══════════════════════════════════════════
   SCROLL PARALLAX — hero drifting clouds
══════════════════════════════════════════ */
window.addEventListener('scroll',()=>{
  const sy=window.scrollY;
  document.querySelectorAll('.bgcld').forEach((c,i)=>{
    c.style.transform=`translateY(${sy*(i===0?.18:.12)}px)`;
  });
  /* fade hero pilot on scroll out */
  const ps=document.getElementById('pilotScene');
  if(ps){
    const fade=Math.max(0,1-sy/300);
    ps.style.opacity=fade;
    ps.style.transform=`translateY(${sy*.15}px)`;
  }
},{passive:true});
