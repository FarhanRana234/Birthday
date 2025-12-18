
    /* ===== MUSIC (mobile safe) ===== */
    document.body.addEventListener('click', () => {
    document.getElementById('bgMusic').play();
    }, { once: true });



  const slides = document.querySelectorAll('.slide');
  const nextBtn = document.querySelector('.nav.next');
  const prevBtn = document.querySelector('.nav.prev');
  const letter = document.getElementById('letter');
  const letterText = document.getElementById('letterText');
  const bgMusic = document.getElementById('bgMusic');

  let current = [...slides].findIndex(slide =>
    slide.classList.contains('active')
  );

  if (current === -1) current = 0;

  let userInteracted = false;

  /* 💌 Messages per photo */
  const messages = [
    "This picture reminds me of how effortlessly beautiful you are. The way you smile, the way you exist — it makes everything feel calm. The day you said you loved me was the best day of my life. I enjoy being with you more than anything else in this world :3 And I’m so lucky to call you mine. 💗",
    "This pictue reminds me of how your presence lights up my world. The jhumkas you wear, the lipstick shade you chose— just like the vibrant colours in this photo, the radiant smile you wear brightens even my darkest days. I'm endlessly grateful to have you by my side, filling my life with joy and love. thing is i love you very much :3 💗",
    "This picture reminds me of how you truly are my everything. Your childhood innocence shines through in this photo, and it captivates me every time I see it. The little heart you made with your hands just melts my heart. When its your birthday i just want you to look at this picture and think how far we have come :3 💗",
    "The way you stare into my soul in this picture just makes me fall for you all over again. i see my reflection in your eyes.. how deeply connected we are. The day you got your hair done- the way you just look at me with so much love and affection. I just want to remind you how much I adore you and cherish every moment we share together :3 💘"
  ];

  /* 🎵 Music per photo (MATCH INDEX WITH SLIDES) */
  const musicTracks = [
    "music/love1.mpeg",
    "music/love2.mpeg",
    "music/love3.mpeg",
    "music/love4.mpeg"
  ];

  /* ===== USER INTERACTION (MOBILE SAFE) ===== */
  document.body.addEventListener('click', () => {
    userInteracted = true;
    playMusic(current);
  }, { once: true });

  function playMusic(index) {
    if (!userInteracted) return;

    bgMusic.pause();
    bgMusic.src = musicTracks[index];
    bgMusic.load();
    bgMusic.play().catch(() => {});
  }

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');

    /* update letter */
    letter.classList.remove('show');
    letterText.textContent = messages[index];

    /* update music */
    playMusic(index);
  }

  function next() {
    current = (current + 1) % slides.length;
    showSlide(current);
  }

  function prev() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  }

  /* buttons */
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  

  /* initial text */
  letterText.textContent = messages[current];
