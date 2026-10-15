// ---- balloons ----
const balloonColors=['#3f8ee0','#123a6b','#bfe0ff','#8fc4f0'];
const balloonsWrap=document.getElementById('balloons');
for(let i=0;i<10;i++){
  const b=document.createElement('div');
  b.className='balloon'+(i>=6?' extra-balloon':'');
  b.style.left=(Math.random()*90)+'%';
  b.style.background=balloonColors[i%balloonColors.length];
  b.style.animationDuration=(7+Math.random()*6)+'s';
  b.style.animationDelay=(Math.random()*6)+'s';
  balloonsWrap.appendChild(b);
}

// ---- small floating hearts along with balloons ----
const heartIcons=['💙','🩵','💖','💗','💕'];
for(let j=0;j<14;j++){
  const h=document.createElement('div');
  h.className='float-heart';
  h.textContent=heartIcons[j%heartIcons.length];
  h.style.left=(Math.random()*94)+'%';
  h.style.fontSize=(12+Math.random()*12)+'px';
  h.style.animationDuration=(6+Math.random()*6)+'s';
  h.style.animationDelay=(Math.random()*7)+'s';
  balloonsWrap.appendChild(h);
}

// ---- clone teddy to the left side (so both animate) ----
document.getElementById('teddyL').innerHTML=document.getElementById('teddyR').innerHTML;

// ---- teddies release letter balloons: HAPPY BIRTHDAY SHIVU ----
const greeting='HAPPY BIRTHDAY SHIVU';
let letterIdx=0, letterTimer=null, letterSide=0;
const letterColors=['#3f8ee0','#123a6b','#5aa5ea','#2a5fa0'];
function releaseLetter(){
  const ch=greeting[letterIdx];
  letterIdx=(letterIdx+1)%greeting.length;
  if(ch===' ')return;
  const right=letterSide%2===0;
  letterSide++;
  const el=document.getElementById(right?'teddyR':'teddyL');
  if(!el)return;
  const r=el.getBoundingClientRect();
  const b=document.createElement('div');
  b.className='letter-balloon';
  b.textContent=ch;
  b.style.left=(right? r.left+r.width*0.88 : r.left+r.width*0.12)+'px';
  b.style.top=(r.top+r.height*0.5)+'px';
  b.style.background=letterColors[letterIdx%letterColors.length];
  b.style.setProperty('--dx',(right?1:-1)*(20+Math.random()*30)+'px');
  b.addEventListener('animationend',()=>b.remove());
  document.body.appendChild(b);
}
function startLetters(){
  stopLetters();
  letterIdx=0;letterSide=0;
  letterTimer=setInterval(releaseLetter,650);
}
function stopLetters(){
  if(letterTimer){clearInterval(letterTimer);letterTimer=null;}
  document.querySelectorAll('.letter-balloon').forEach(e=>e.remove());
}

// ---- screen navigation ----
function goTo(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  stopSparkles();
  stopLetters();
  
  if(id==='screen5')startSparkles();
}

// ---- sparkles (final screen) ----
let sparkleTimer=null;
function startSparkles(){
  const c=document.getElementById('sparkles');
  c.innerHTML='';
  const colors=['#ffce54','#ffffff','#8fc4f0','#ffe9a8','#3f8ee0'];
  function make(){
    const s=document.createElement('span');
    s.className='sparkle';
    const size=8+Math.random()*18;
    s.style.left=(Math.random()*100)+'%';
    s.style.top=(Math.random()*100)+'%';
    s.style.width=s.style.height=size+'px';
    s.style.background=colors[Math.floor(Math.random()*colors.length)];
    s.style.filter='drop-shadow(0 0 4px rgba(255,206,84,0.8))';
    s.style.animationDuration=(1.2+Math.random()*1.6)+'s';
    c.appendChild(s);
    setTimeout(()=>s.remove(),3000);
  }
  for(let i=0;i<25;i++)make();
  sparkleTimer=setInterval(make,140);
}
function stopSparkles(){
  if(sparkleTimer){clearInterval(sparkleTimer);sparkleTimer=null;}
  const c=document.getElementById('sparkles');
  if(c)c.innerHTML='';
}

// ---- name personalization ----
document.getElementById('startBtn').addEventListener('click',()=>{
  startMusic();
  goTo('screen2');
});

document.getElementById('toGallery').addEventListener('click',()=>goTo('screen3'));
document.getElementById('toLetter').addEventListener('click',()=>goTo('screen4'));
document.getElementById('toFinal').addEventListener('click',()=>goTo('screen5'));
document.getElementById('restartBtn').addEventListener('click',()=>{
  document.querySelectorAll('.flame').forEach(f=>f.style.display='block');
  document.querySelectorAll('.smoke').forEach(s=>s.classList.remove('show'));
  document.getElementById('wishMsg').classList.remove('show');
  document.getElementById('toGallery').style.display='none';
  blownCount=0;
  goTo('screen1');
});

// ---- candle blowing ----
let blownCount=0;
const totalCandles=3;
document.querySelectorAll('.flame').forEach(flame=>{
  flame.addEventListener('click',()=>{
    if(flame.style.display==='none')return;
    const id=flame.getAttribute('data-id');
    flame.style.display='none';
    const smoke=document.querySelector('.smoke[data-id="'+id+'"]');
    smoke.classList.add('show');
    blownCount++;
    if(blownCount>=totalCandles){
      document.getElementById('wishMsg').classList.add('show');
      document.getElementById('toGallery').style.display='inline-block';
    }
  });
});

// ---- background music: simple "Happy Birthday" tune via Web Audio ----
let audioCtx=null;
let musicOn=false;
let musicTimer=null;

const melody=[ // [frequency, duration in seconds]
  [392,0.35],[392,0.2],[440,0.55],[392,0.55],[523,0.55],[494,1.1],
  [392,0.35],[392,0.2],[440,0.55],[392,0.55],[587,0.55],[523,1.1],
  [392,0.35],[392,0.2],[784,0.55],[659,0.55],[523,0.55],[494,0.55],[440,1.1],
  [698,0.35],[698,0.2],[659,0.55],[523,0.55],[587,0.55],[523,1.4]
];

function playMelody(){
  if(!audioCtx)return;
  let t=audioCtx.currentTime+0.1;
  melody.forEach(([freq,dur])=>{
    const osc=audioCtx.createOscillator();
    const gain=audioCtx.createGain();
    osc.type='triangle';
    osc.frequency.value=freq;
    gain.gain.setValueAtTime(0,t);
    gain.gain.linearRampToValueAtTime(0.12,t+0.05);
    gain.gain.linearRampToValueAtTime(0,t+dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t+dur+0.05);
    t+=dur;
  });
  const totalDur=melody.reduce((a,[,d])=>a+d,0);
  musicTimer=setTimeout(()=>{ if(musicOn) playMelody(); },(totalDur+0.8)*1000);
}

function startMusic(){
  try{
    if(!audioCtx){ audioCtx=new (window.AudioContext||window.webkitAudioContext)(); }
    if(audioCtx.state==='suspended'){ audioCtx.resume(); }
    musicOn=true;
    document.getElementById('musicBtn').textContent='🔊';
    playMelody();
  }catch(e){ console.error('Audio error',e); }
}
function stopMusic(){
  musicOn=false;
  if(musicTimer)clearTimeout(musicTimer);
  document.getElementById('musicBtn').textContent='🔇';
}
document.getElementById('musicBtn').addEventListener('click',()=>{
  if(musicOn){ stopMusic(); } else { startMusic(); }
});
