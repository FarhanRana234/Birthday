function startFloatingEmojis() {
  const emojis = ['💖','💕','💗','💓','💝','✨','🌸','🦋','🌟','💫'];
  setInterval(() => {
    const emoji = document.createElement('div');
    emoji.className = 'floating-emoji';
    emoji.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    emoji.style.left = Math.random()*100+'vw';
    emoji.style.top = (Math.random()*50 - 20) + 'vh'; // random start
    const size = 20 + Math.random()*20;
    emoji.style.fontSize = size+'px';
    const duration = 4 + Math.random()*4;
    emoji.style.setProperty('--duration', duration+'s');
    const swayAmount = Math.random()*60-30;
    emoji.style.setProperty('--sway', swayAmount+'px');
    emoji.style.opacity = 1; // make visible
    document.body.appendChild(emoji);
    setTimeout(()=>emoji.remove(), (duration*1000)+100);
  },800);
}

/* =============================
     CONFETTI
============================= */
function launchConfetti(count = 30) {
  for(let i=0;i<count;i++){
    const c = document.createElement('div');
    c.className='confetti';
    c.style.left = Math.random()*100+'vw';
    c.style.backgroundColor = `hsl(${Math.random()*360},70%,80%)`;
    c.style.width = c.style.height = 5+Math.random()*8+'px';
    c.style.animationDuration = 2+Math.random()*2+'s';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),4000);
  }
}

/* =============================
     GATE UNLOCK
============================= */
function unlock() {
  const pass = document.getElementById('password').value;
  const gate = document.getElementById('gate');
  const content = document.getElementById('content');
  const music = document.getElementById('bgMusic');

  if(pass==='jan30'){
    gate.classList.add('glow');

    // Play music
    music.volume = 0.3;
    music.play().catch(()=>createMusicToggle());

    // Confetti + emojis
    launchConfetti();
    setTimeout(startFloatingEmojis,1000);

    // Fade out gate
    gate.style.opacity='0';
    gate.style.transform='scale(0.95)';
    gate.style.transition='opacity 0.6s ease, transform 0.6s ease';

    setTimeout(()=>{
      gate.style.display='none';
      content.classList.remove('hidden');
      content.classList.add('unlock-animate');
      // Initialize memory reveal
      initMemoryReveal();
    },600);
  }else{
    gate.classList.add('glow');
    setTimeout(()=>gate.classList.remove('glow'),800);
    const input = document.getElementById('password');
    input.style.animation='shake 0.5s';
    setTimeout(()=>{ input.style.animation=''; input.value=''; input.focus(); },500);
  }
}
document.getElementById('password').addEventListener('keydown', e=>{
  if(e.key==='Enter') unlock();
});

// =============================
// DEVICE DETECTION
// =============================
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

// =============================
// MUSIC TOGGLE WITH STATE SYNC
// =============================
function createMusicToggle() {
  if (document.getElementById('musicToggle')) return;

  const music = document.getElementById('bgMusic');
  if (!music) return;

  const toggle = document.createElement('button');
  toggle.id = 'musicToggle';
  toggle.style.cssText = `
    position: fixed; bottom:20px; right:20px; padding:10px 20px;
    background:#ff6b93; color:white; border:none; border-radius:25px;
    cursor:pointer; z-index:1001; font-family:'Poppins',sans-serif;
    box-shadow:0 4px 15px rgba(255,107,147,0.3);
  `;
  document.body.appendChild(toggle);

  // Update toggle label based on music state
  function updateToggleLabel() {
    toggle.innerHTML = music.paused ? '🎵 Play Music' : '🎵 Mute';
  }

  // Initial label
  updateToggleLabel();

  // Click event toggles music
  toggle.addEventListener('click', () => {
    if (music.paused) {
      music.volume = 0.3;
      music.play().catch(() => console.warn('Autoplay blocked'));
    } else {
      music.pause();
    }
    updateToggleLabel();
  });

  // Listen for any play/pause events to keep label in sync
  music.addEventListener('play', updateToggleLabel);
  music.addEventListener('pause', updateToggleLabel);
}

// Initialize toggle after page load
window.addEventListener('load', createMusicToggle);

// =============================
// MEMORY NAVIGATION
// =============================
let currentMemory = 0;
const memories = document.querySelectorAll('.memory-card');
const hint = document.querySelector('.tap-hint');
const bgMusic = document.getElementById('bgMusic');

// Reset all videos
function resetAllVideos() {
  memories.forEach(m => {
    const vid = m.querySelector('video');
    if (vid) {
      vid.muted = true;
      vid.pause();
      vid.currentTime = 0;
    }
  });
}

// Show memory at given index
function showMemory(index) {
  memories.forEach((m, i) => {
    m.classList.remove('active');

    const vid = m.querySelector('video');
    if (vid && !(m.classList.contains('final') && i === index)) {
      vid.muted = true;
      vid.pause();
      vid.currentTime = 0;
    }
  });

  if (memories[index]) memories[index].classList.add('active');
}

// Advance to next memory
function nextMemory() {
  const activeCard = memories[currentMemory];

  // Final video handling
  if (activeCard.classList.contains('final')) {
    hint.innerText = 'Video is playing 💝';
    if (bgMusic && !bgMusic.paused) bgMusic.pause();

    const video = activeCard.querySelector('video');
    if (video) {
      video.muted = false;
      video.currentTime = 0;
      video.play();

      video.onended = () => {
        currentMemory = 0;
        resetAllVideos();
        showMemory(currentMemory);
        hint.innerText = 'tap anywhere 💫';
        if (bgMusic) bgMusic.play();
      };
    }
  } else {
    // Normal memory progression
    if (currentMemory < memories.length - 1) currentMemory++;
    else currentMemory = 0;

    showMemory(currentMemory);
    hint.innerText = 'tap anywhere 💫';
  }
}

// Initialize first memory
resetAllVideos();
showMemory(currentMemory);
hint.style.opacity = '1';

// Attach event listeners depending on device
memories.forEach(card => {
  if (isMobile) {
    // Tap only on mobile
    card.addEventListener('touchstart', e => {
      e.stopPropagation();
      e.preventDefault();
      nextMemory();
    }, {passive: false});
  } else {
    // Click on desktop
    card.addEventListener('click', nextMemory);
  }
});

// Prevent accidental scroll triggering memory next (mobile)
if (isMobile) {
  let touchStartY = 0;
  document.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, {passive: true});
  document.addEventListener('touchend', e => {
    const touchEndY = e.changedTouches[0].clientY;
    if (Math.abs(touchEndY - touchStartY) > 50) e.preventDefault();
  }, {passive: false});
}


/* =============================
     STORY BUTTON
============================= */
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('storyBtn').addEventListener('click',()=>{
    const letter = document.querySelector('.letter');
    letter.classList.remove('hidden');
    document.getElementById('storyBtn').style.display='none';
    letter.style.opacity='0';
    setTimeout(()=>{ letter.style.transition='opacity 1s ease'; letter.style.opacity='1'; },100);
  });
});

/* =============================
     TRANSITION SOUND
============================= */
function playTransitionSound(){
  const audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.frequency.value=523.25; osc.type='sine';
  gain.gain.setValueAtTime(0.1,audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01,audioCtx.currentTime+0.5);
  osc.start(); osc.stop(audioCtx.currentTime+0.5);
}

/* =============================
     STYLING INSERTIONS
============================= */
const style = document.createElement('style');
style.textContent=`
  @keyframes shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-10px);}75%{transform:translateX(10px);}}
  @keyframes gentlePulse{0%,100%{background-color:transparent;}50%{background-color:rgba(255,182,193,0.1);}}
  @keyframes glow{0%,100%{box-shadow:0 0 5px #ff6b93;}50%{box-shadow:0 0 20px #ff6b93,0 0 30px #ff9ec0;}}
  .glow{animation:glow 0.8s ease;}
  .unlock-animate{animation:fadeInUp 1s ease;}
  @keyframes fadeInUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  .memory-card{opacity:0;transform:translateY(20px);transition:all 0.8s cubic-bezier(0.4,0,0.2,1);}
  .memory-card.active{opacity:1;transform:translateY(0);}
  .memory-card img{transition:transform 0.5s ease;}
  .tap-hint{opacity:0;transition:opacity 1s ease;animation:float 3s ease-in-out infinite;}
  @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
`;
document.head.appendChild(style);
