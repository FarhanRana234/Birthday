
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
    "One of my favorites tbh :3. this picture just truly resembles you. your beauty. I LOVE THAT SMILE SO MUCHHH., And I dont want the world to see us... cuz i dont think they'll understand. , 'I just want you to know who iam..' because i'll always be here for you. Be it in happiness, In sorrow. I put this song cuz you love it so much-, it goes like 'Youre the closest to heaven that I'll ever be' it really suits you hehe.. :), i just dont wanna miss you rn (i still do). ANOTHA ONE 'I give up forever to touch. cuz i know that you feel me somehow..' the urge to just hug you and never let go is so strong rn :3",
    "Those jhumkas you wear, the lipstick shade you wanted me to chosse-, The way you smile with your eyes closed i just love it so much-,  'When we are apart.. and im missing you, i close my eyes and all i see you is you.. and the small things you do.', I love every single detail about you. from start to finish. 'Cause i love the smile. things that you do. They just remind me why i fell for you...' (dont mind me being corny. i just think of you like ALOT-) :3 ",
    "Oh and now this hehehehe. you probably wondering why i chosse this picture right? and that song :3. i just saw it in your spotify playlist, it reminded me of you. i used to sing this song so much. this song reminds me of how well get older- together :3  'im getting old and i need something to rely on-(you hehe)'. i just want you to know that no matter what happens-, ill always be here for you. through thick and thin. through ups and downs. 'Cause i love you more than i love myself.. and thats saying something hehe :3 (so why dont we go? somwhere only we know)",
    "This picture is just a random one from my album.. (uhmuhm) but you know what? i just love you in any dress. any day, any hour, any minute. 'where have you been..' is like in a context of us finding each other. like where WERE YOU ALL THIS TIME? who wouldve thought you had a crush one me? ME?. im just so glad that you told me- Cuz I enjoy loving you so much. be whatever our past be. we share things alot :3. im just very possesive of you sometimes- i dont love it. but i cant help it yk. i dont want you to leave me :3. 'I never knew somebody like you.. somebody.. falling just as hard' (like i fell for you 💗)"
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
