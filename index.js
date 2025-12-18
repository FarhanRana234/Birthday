document.addEventListener('DOMContentLoaded', () => {
  /* =============================
     AUDIO SETUP
  ============================= */
  const bgMusic = document.getElementById('bgMusic');
  bgMusic.loop = true;
  bgMusic.preload = 'auto';
  bgMusic.volume = 1;
  bgMusic.muted = false;

  const birthdayTracks = [
    'music/birthday1.mp3',
    'music/birthday2.mp3'
  ];
  const birthdayAudio = new Audio(
    birthdayTracks[Math.floor(Math.random() * birthdayTracks.length)]
  );
  birthdayAudio.loop = false;
  birthdayAudio.preload = 'auto';
  birthdayAudio.volume = 1;
  birthdayAudio.muted = false;

  // Prime audio
  bgMusic.load();
  birthdayAudio.load();

  /* =============================
     DATE CHECK
  ============================= */
  const today = new Date();
  const test = false; // 🔴 set false when live
  const isBirthday = test || (today.getMonth() === 0 && today.getDate() === 30);

  /* =============================
     MUSIC BUTTONS
  ============================= */
  const mainPlayBtn = document.getElementById('playBgMusicBtn'); // main page
  const birthdayPlayBtn = document.getElementById('playBirthdayMusicBtn'); // birthday screen

  function playBgMusic() {
    bgMusic.load();
    bgMusic.play().catch(() => {});
  }

  function playBirthdayMusic() {
    // Pick a random track each time
    const track = birthdayTracks[Math.floor(Math.random() * birthdayTracks.length)];
    birthdayAudio.src = track;
    birthdayAudio.load();
    birthdayAudio.play().catch(() => {});
  }

  mainPlayBtn?.addEventListener('click', () => {
    playBgMusic();
  });

  birthdayPlayBtn?.addEventListener('click', () => {
    playBirthdayMusic();
  });

  /* =============================
     NORMAL DAY
  ============================= */
  if (!isBirthday) return;

  /* =============================
     CONFETTI
  ============================= */
  function launchConfetti(count = 40) {
    for (let i = 0; i < count; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.position = 'fixed';
      c.style.top = '-10px';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.width = c.style.height = 6 + Math.random() * 8 + 'px';
      c.style.backgroundColor = `hsl(${Math.random() * 360},70%,80%)`;
      c.style.borderRadius = '50%';
      c.style.pointerEvents = 'none';
      c.style.zIndex = '99999';
      const duration = 2 + Math.random() * 2;
      const delay = Math.random();
      c.style.animation = `confettiFall ${duration}s linear ${delay}s forwards`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), (duration + delay) * 1000);
    }
  }

  /* =============================
     BIRTHDAY SCREEN
  ============================= */
  const birthdayScreen = document.getElementById('birthdayScreen');
  const candle = document.getElementById('candle');

  birthdayScreen.style.display = 'flex';
  birthdayScreen.style.flexDirection = 'column';

  const leftSticker = birthdayScreen.querySelector('.sticker.left');
  const rightSticker = birthdayScreen.querySelector('.sticker.right');
  const wavingSticker = birthdayScreen.querySelector('.sticker.left.wave');

  setTimeout(() => {
    leftSticker?.classList.add('peek-in');
    rightSticker?.classList.add('peek-in');
  }, 200);

  setTimeout(() => wavingSticker?.classList.add('play'), 1400);
  setTimeout(() => {
    leftSticker?.classList.add('float');
    rightSticker?.classList.add('float');
  }, 3000);

  launchConfetti(60);

  /* =============================
     CANDLE
  ============================= */
  let candleBlown = false;

  function blowCandle() {
    if (candleBlown) return;
    candleBlown = true;
    candle.textContent = '💨';

    fadeOutBirthdayMusic(() => {
      playBgMusic();
    });

    setTimeout(() => {
      birthdayScreen.style.display = 'none';
    }, 1500);
  }

  candle.addEventListener('click', blowCandle);

  /* =============================
     AUDIO FADE
  ============================= */
  function fadeOutBirthdayMusic(done) {
    const duration = 1000;
    const interval = 50;
    const step = birthdayAudio.volume / (duration / interval);
    const fade = setInterval(() => {
      if (birthdayAudio.volume > step) {
        birthdayAudio.volume -= step;
      } else {
        clearInterval(fade);
        birthdayAudio.pause();
        birthdayAudio.currentTime = 0;
        birthdayAudio.volume = 1;
        done?.();
      }
    }, interval);
  }

  /* =============================
     MIC BLOW (DESKTOP ONLY)
  ============================= */
  let micCanTrigger = true;
  function startMicDetection() {
    if (!navigator.mediaDevices || /Mobi|Android/i.test(navigator.userAgent)) return;

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const ctx = new AudioContext();
      const mic = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();

      mic.connect(analyser);
      analyser.fftSize = 2048;

      const data = new Uint8Array(analyser.fftSize);
      const threshold = 0.25;

      function listen() {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);

        if (rms > threshold && micCanTrigger) {
          micCanTrigger = false;
          blowCandle();
        }

        requestAnimationFrame(listen);
      }

      ctx.resume().then(listen);
    }).catch(() => {});
  }

  startMicDetection();
});

/* =============================
   PREVENT MOBILE SCROLL
============================= */
document.getElementById('birthdayScreen')
  ?.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
