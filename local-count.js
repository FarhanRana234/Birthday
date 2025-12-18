/* =============================
   GLOBAL COUNTDOWN (JAN 30)
============================= */

const countdownEl = document.createElement('div');
countdownEl.style.position = 'fixed';
countdownEl.style.top = '15px';
countdownEl.style.right = '15px';
countdownEl.style.background = 'rgba(255,255,255,0.25)';
countdownEl.style.backdropFilter = 'blur(8px)';
countdownEl.style.padding = '8px 14px';
countdownEl.style.borderRadius = '20px';
countdownEl.style.fontSize = '0.9rem';
countdownEl.style.zIndex = '9999';
document.body.appendChild(countdownEl);

function getNextBirthday() {
  const now = new Date();
  let year = now.getFullYear();

  // Jan 30
  let birthday = new Date(year, 0, 30, 0, 0, 0);

  // If birthday already passed today, move to next year
  if (now > new Date(year, 0, 30, 23, 59, 59, 999)) {
    birthday = new Date(year + 1, 0, 30, 0, 0, 0);
  }

  return birthday.getTime();
}

function updateCountdown() {
  const now = new Date();

  // Birthday start/end for full day
  const birthdayStart = new Date(now.getFullYear(), 0, 30, 0, 0, 0);
  const birthdayEnd = new Date(now.getFullYear(), 0, 30, 23, 59, 59, 999);

  if (now >= birthdayStart && now <= birthdayEnd) {
    countdownEl.innerText = '🎉 Happy Birthday!';
    return;
  }

  // Countdown to next birthday (recalculate dynamically)
  const nextBirthday = getNextBirthday();
  const diff = nextBirthday - now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  countdownEl.innerText = `⏳ ${days}d ${hours}h ${minutes}m to go`;
}

// Initial call + update every second
updateCountdown();
setInterval(updateCountdown, 1000);
