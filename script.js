let player;
let isPlayerReady = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('background', {
    events: {
      onReady: () => {
        isPlayerReady = true;
        player.mute();
        player.playVideo();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('start-screen');
  const startText = document.getElementById('start-text');
  const profileName = document.getElementById('profile-name');
  const profileBio = document.getElementById('profile-bio');
  const visitorCount = document.getElementById('visitor-count');
  
  const homeThemeBtn = document.getElementById('home-theme');
  const hackerThemeBtn = document.getElementById('hacker-theme');
  const discordThemeBtn = document.getElementById('discord-theme');

  const resultsButton = document.getElementById('results-theme');
  const resultsButtonContainer = document.getElementById('results-button-container');
  const resultsHint = document.getElementById('results-hint');

  const volumeIcon = document.getElementById('volume-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const transparencySlider = document.getElementById('transparency-slider');
  
  const profileBlock = document.getElementById('profile-block');
  const skillsBlock = document.getElementById('skills-block');
  const discordBlock = document.getElementById('discord-block');

  const pythonBar = document.getElementById('python-bar');
  const cppBar = document.getElementById('cpp-bar');
  const csharpBar = document.getElementById('csharp-bar');

  const profilePicture = document.querySelector('.profile-picture');
  const profileContainer = document.querySelector('.profile-container');
  const cursor = document.querySelector('.custom-cursor');

  // Lanyard Elements
  const DISCORD_USER_ID = "1245196598368141424";
  const lanyardAvatar = document.getElementById('lanyard-avatar');
  const lanyardStatusDot = document.getElementById('lanyard-status-dot');
  const lanyardUsername = document.getElementById('lanyard-username');
  const lanyardCustomStatus = document.getElementById('lanyard-custom-status');
  const lanyardActivity = document.getElementById('lanyard-activity');

  let isMuted = false;

  // Custom Cursor
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  if (isTouchDevice) {
    document.body.classList.add('touch-device');
    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      cursor.style.left = touch.clientX + 'px';
      cursor.style.top = touch.clientY + 'px';
      cursor.style.display = 'block';
    });
    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      cursor.style.left = touch.clientX + 'px';
      cursor.style.top = touch.clientY + 'px';
      cursor.style.display = 'block';
    });
    document.addEventListener('touchend', () => {
      cursor.style.display = 'none'; 
    });
  } else {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.style.display = 'block';
    });
    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'scale(0.8) translate(-50%, -50%)';
    });
    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'scale(1) translate(-50%, -50%)';
    });
  }

  // Typewriter Start Screen
  const startMessages = ["Click here to see the Website!"];
  const startMessage = startMessages[Math.floor(Math.random() * startMessages.length)];
  let startTextContent = '';
  let startIndex = 0;
  let startCursorVisible = true;

  function typeWriterStart() {
    if (startIndex < startMessage.length) {
      startTextContent = startMessage.slice(0, startIndex + 1);
      startIndex++;
    }
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
    setTimeout(typeWriterStart, 100);
  }

  setInterval(() => {
    startCursorVisible = !startCursorVisible;
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
  }, 500);

  function initializeVisitorCounter() {
    let totalVisitors = Math.floor(Math.random() * 900000) + 100000;
    if (visitorCount) visitorCount.textContent = totalVisitors.toLocaleString();
  }
  initializeVisitorCounter();

  function startExperience() {
    startScreen.classList.add('hidden');
    
    if (isPlayerReady && player) {
      player.unMute();
      player.setVolume(volumeSlider.value * 100);
      player.playVideo();
    }

    profileBlock.classList.remove('hidden');
    gsap.fromTo(profileBlock,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', onComplete: () => {
        profileBlock.classList.add('profile-appear');
        profileContainer.classList.add('orbit');
      }}
    );

    if (profileName) {
      profileName.textContent = "RAMEN";
    }

    typeWriterBio();
    fetchDiscordPresence();
  }

  startScreen.addEventListener('click', startExperience);
  startScreen.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startExperience();
  });

  // Profile Bio Typewriter
  const bioMessages = [
    "MentalKatt <3",
    "I love developing in Python, CSS, and JavaScript",
    "I Love playing CRK (CookieRun: Kingdom)",
    "We do not lick the dog",
    "I am a person :)",
    "Taken! Love them to the stars and back!"
  ];
  let bioText = '';
  let bioIndex = 0;
  let bioMessageIndex = Math.floor(Math.random() * bioMessages.length);
  let isBioDeleting = false;
  let bioCursorVisible = true;

  function typeWriterBio() {
    if (!isBioDeleting && bioIndex < bioMessages[bioMessageIndex].length) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex + 1);
      bioIndex++;
    } else if (isBioDeleting && bioIndex > 0) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex - 1);
      bioIndex--;
    } else if (bioIndex === bioMessages[bioMessageIndex].length) {
      isBioDeleting = true;
      setTimeout(typeWriterBio, 2000);
      return;
    } else if (bioIndex === 0 && isBioDeleting) {
      isBioDeleting = false;
      bioMessageIndex = Math.floor(Math.random() * bioMessages.length);
    }

    profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
    setTimeout(typeWriterBio, isBioDeleting ? 20 : Math.floor(Math.random() * 101) + 30);
  }

  setInterval(() => {
    bioCursorVisible = !bioCursorVisible;
    if (profileBio) profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
  }, 500);

  // Volume Controls
  volumeIcon.addEventListener('click', () => {
    if (!isPlayerReady || !player) return;
    isMuted = !isMuted;
    if (isMuted) {
      player.mute();
      volumeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`;
    } else {
      player.unMute();
      volumeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
    }
  });

  volumeSlider.addEventListener('input', () => {
    if (!isPlayerReady || !player) return;
    player.setVolume(volumeSlider.value * 100);
    player.unMute();
    isMuted = false;
    volumeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });

  if (transparencySlider) {
    transparencySlider.addEventListener('input', () => {
      const alpha = transparencySlider.value;
      profileBlock.style.background = `rgba(0, 0, 0, ${alpha})`;
      skillsBlock.style.background = `rgba(0, 0, 0, ${alpha})`;
      discordBlock.style.background = `rgba(0, 0, 0, ${alpha})`;
    });
  }

  // 3D Card Tilt
  function handleTilt(e, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const maxTilt = 15;
    const tiltX = ((clientY - centerY) / rect.height) * maxTilt;
    const tiltY = -((clientX - centerX) / rect.width) * maxTilt;

    gsap.to(element, {
      rotationX: tiltX,
      rotationY: tiltY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  }

  function resetTilt(element) {
    gsap.to(element, { rotationX: 0, rotationY: 0, duration: 0.5, ease: 'power2.out' });
  }

  [profileBlock, skillsBlock, discordBlock].forEach(el => {
    el.addEventListener('mousemove', (e) => handleTilt(e, el));
    el.addEventListener('mouseleave', () => resetTilt(el));
    el.addEventListener('touchend', () => resetTilt(el));
  });

  // Profile picture spin
  profilePicture.addEventListener('click', () => {
    profileContainer.classList.remove('fast-orbit', 'orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    setTimeout(() => {
      profileContainer.classList.remove('fast-orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('orbit');
    }, 500);
  });

  // Tab Switching Logic
  const allTabs = [
    { name: 'profile', el: profileBlock, theme: 'home-theme' },
    { name: 'skills', el: skillsBlock, theme: 'hacker-theme' },
    { name: 'discord', el: discordBlock, theme: 'discord-theme' }
  ];

  function switchTab(targetName) {
    allTabs.forEach(tab => {
      if (tab.name === targetName) {
        if (tab.el.classList.contains('hidden')) {
          tab.el.classList.remove('hidden');
          gsap.fromTo(tab.el,
            { x: 60, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
          );
        }
        document.body.className = tab.theme;

        if (tab.name === 'skills') {
          if (pythonBar) gsap.to(pythonBar, { width: '87%', duration: 1.2, ease: 'power2.out' });
          if (cppBar) gsap.to(cppBar, { width: '15%', duration: 1.2, ease: 'power2.out' });
          if (csharpBar) gsap.to(csharpBar, { width: '35%', duration: 1.2, ease: 'power2.out' });
        }
      } else {
        if (!tab.el.classList.contains('hidden')) {
          gsap.to(tab.el, {
            x: -60,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => tab.el.classList.add('hidden')
          });
        }
      }
    });

    if (resultsButtonContainer) {
      if (targetName === 'skills') {
        resultsButtonContainer.classList.remove('hidden');
      } else {
        resultsButtonContainer.classList.add('hidden');
      }
    }
  }

  if (homeThemeBtn) {
    homeThemeBtn.addEventListener('click', () => switchTab('profile'));
  }

  if (hackerThemeBtn) {
    hackerThemeBtn.addEventListener('click', () => switchTab('skills'));
  }

  if (discordThemeBtn) {
    discordThemeBtn.addEventListener('click', () => {
      switchTab('discord');
      fetchDiscordPresence();
    });
  }

  if (resultsButton) {
    resultsButton.addEventListener('click', () => {
      if (!skillsBlock.classList.contains('hidden')) {
        switchTab('profile');
      } else {
        switchTab('skills');
      }
    });
  }

  // Fetch Live Discord Activity from Lanyard
  async function fetchDiscordPresence() {
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
      const data = await res.json();
      if (!data.success) return;

      const user = data.data;

      // Global or username
      lanyardUsername.textContent = user.discord_user.global_name || user.discord_user.username;

      // User Avatar
      if (user.discord_user.avatar) {
        const ext = user.discord_user.avatar.startsWith('a_') ? 'gif' : 'png';
        lanyardAvatar.src = `https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar}.${ext}`;
      }

      // Online status dot
      lanyardStatusDot.className = `status-${user.discord_status}`;

      // Custom Status
      const custom = user.activities.find(a => a.type === 4);
      lanyardCustomStatus.textContent = (custom && custom.state) ? custom.state : "";

      // Real-time activity (Spotify, Games, or Idle)
      if (user.listening_to_spotify && user.spotify) {
        lanyardActivity.innerHTML = `<strong>Listening to Spotify:</strong><br>${user.spotify.song} - ${user.spotify.artist}`;
      } else {
        const game = user.activities.find(a => a.type !== 4);
        if (game) {
          const detail = game.details ? `<br><span style="opacity:0.8">${game.details}</span>` : '';
          const state = game.state ? `<br><span style="opacity:0.6">${game.state}</span>` : '';
          lanyardActivity.innerHTML = `<strong>Playing:</strong> ${game.name}${detail}${state}`;
        } else {
          lanyardActivity.textContent = "Currently inactive / chilling";
        }
      }
    } catch (err) {
      lanyardActivity.textContent = "Offline or Lanyard unreachable";
    }
  }

  // Poll presence every 15 seconds
  setInterval(fetchDiscordPresence, 15000);

  typeWriterStart();
});
