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
  
  // Navigation Buttons
  const homeThemeBtn = document.getElementById('home-theme');
  const hackerThemeBtn = document.getElementById('hacker-theme');
  const discordThemeBtn = document.getElementById('discord-theme');
  const timeThemeBtn = document.getElementById('time-theme');

  const resultsButton = document.getElementById('results-theme');
  const resultsButtonContainer = document.getElementById('results-button-container');
  const resultsHint = document.getElementById('results-hint');

  const volumeIcon = document.getElementById('volume-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const transparencySlider = document.getElementById('transparency-slider');
  
  // Tab Containers
  const profileBlock = document.getElementById('profile-block');
  const skillsBlock = document.getElementById('skills-block');
  const discordBlock = document.getElementById('discord-block');
  const timeBlock = document.getElementById('time-block');

  // Lanyard Status Elements
  const DISCORD_USER_ID = "1245196598368141424";
  const lanyardAvatar = document.getElementById('lanyard-avatar');
  const lanyardStatusDot = document.getElementById('lanyard-status-dot');
  const lanyardUsername = document.getElementById('lanyard-username');
  const lanyardCustomStatus = document.getElementById('lanyard-custom-status');
  const lanyardActivity = document.getElementById('lanyard-activity');

  // Clock Elements
  const digitalClock = document.getElementById('digital-clock');
  const clockDate = document.getElementById('clock-date');
  const tzName = document.getElementById('tz-name');
  const activityStatus = document.getElementById('activity-status');

  const pythonBar = document.getElementById('python-bar');
  const cppBar = document.getElementById('cpp-bar');
  const csharpBar = document.getElementById('csharp-bar');

  const profilePicture = document.querySelector('.profile-picture');
  const profileContainer = document.querySelector('.profile-container');
  const cursor = document.querySelector('.custom-cursor');

  let isMuted = false;
  let previousVolume = volumeSlider ? volumeSlider.value : 0.3;

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

  // Neon Click Sparks Generator
  const sparkColors = ['#00CED1', '#ff6b9e', '#22C55E', '#00f2fe', '#ffffff'];

  function createSparks(x, y) {
    const sparkCount = 8;

    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div');
      spark.className = 'click-spark';

      const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
      spark.style.backgroundColor = color;
      spark.style.color = color;
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;

      document.body.appendChild(spark);

      const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5);
      const distance = Math.floor(Math.random() * 45) + 30;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;

      gsap.to(spark, {
        x: targetX,
        y: targetY,
        opacity: 0,
        scale: Math.random() * 0.4 + 0.2,
        duration: Math.random() * 0.4 + 0.35,
        ease: 'power2.out',
        onComplete: () => spark.remove()
      });
    }
  }

  document.addEventListener('pointerdown', (e) => {
    createSparks(e.clientX, e.clientY);
  });

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
    updateChicagoTime();
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

  // Volume Controls with Memory Toggle
  function toggleMuteState() {
    if (!isPlayerReady || !player) return;

    if (!isMuted) {
      previousVolume = volumeSlider.value > 0 ? volumeSlider.value : 0.3;
      isMuted = true;
      player.mute();
      volumeSlider.value = 0;
      volumeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`;
    } else {
      isMuted = false;
      volumeSlider.value = previousVolume;
      player.unMute();
      player.setVolume(previousVolume * 100);
      volumeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
    }
  }

  volumeIcon.addEventListener('click', toggleMuteState);

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
      timeBlock.style.background = `rgba(0, 0, 0, ${alpha})`;
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

  [profileBlock, skillsBlock, discordBlock, timeBlock].forEach(el => {
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

  // 4-Tab Switcher Logic
  const allTabs = [
    { name: 'profile', el: profileBlock, theme: 'home-theme' },
    { name: 'skills', el: skillsBlock, theme: 'hacker-theme' },
    { name: 'discord', el: discordBlock, theme: 'discord-theme' },
    { name: 'time', el: timeBlock, theme: 'time-theme' }
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

  // Button Listeners
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

  if (timeThemeBtn) {
    timeThemeBtn.addEventListener('click', () => {
      switchTab('time');
      updateChicagoTime();
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

  // Keyboard Navigation & Mute
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key.toLowerCase()) {
      case '1':
        switchTab('profile');
        break;
      case '2':
        switchTab('skills');
        break;
      case '3':
        switchTab('discord');
        fetchDiscordPresence();
        break;
      case '4':
        switchTab('time');
        updateChicagoTime();
        break;
      case 'm':
        toggleMuteState();
        break;
    }
  });

  // Discord Asset Resolver
  function resolveDiscordAsset(appId, assetId) {
    if (!assetId) return null;
    if (assetId.startsWith('mp:external/')) {
      return `https://media.discordapp.net/external/${assetId.replace('mp:external/', '')}`;
    }
    if (assetId.startsWith('spotify:')) {
      return `https://i.scdn.co/image/${assetId.replace('spotify:', '')}`;
    }
    return `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.png`;
  }

  // Fetch Live Presence via Lanyard
  async function fetchDiscordPresence() {
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
      const data = await res.json();
      if (!data.success) return;

      const user = data.data;

      lanyardUsername.textContent = user.discord_user.global_name || user.discord_user.username;

      if (user.discord_user.avatar) {
        const ext = user.discord_user.avatar.startsWith('a_') ? 'gif' : 'png';
        lanyardAvatar.src = `https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar}.${ext}`;
      }

      lanyardStatusDot.className = `status-${user.discord_status}`;

      const customStatus = user.activities.find(a => a.type === 4);
      if (customStatus && customStatus.state) {
        lanyardCustomStatus.textContent = `"${customStatus.state}"`;
      } else {
        lanyardCustomStatus.textContent = "";
      }

      if (user.listening_to_spotify && user.spotify) {
        const albumImg = user.spotify.album_art_url 
          ? `<img src="${user.spotify.album_art_url}" class="activity-large-image" alt="Album Art">` 
          : '';

        lanyardActivity.innerHTML = `
          <strong>Listening to Spotify:</strong>
          <div class="activity-banner-wrap">
            ${albumImg}
            <div class="activity-text-details">
              <span><strong>${user.spotify.song}</strong></span>
              <span style="opacity:0.8">by ${user.spotify.artist}</span>
              <span style="opacity:0.6">${user.spotify.album}</span>
            </div>
          </div>
        `;
        return;
      }

      const activity = user.activities.find(a => a.type !== 4);
      if (activity) {
        let artworkUrl = null;

        if (activity.assets && activity.assets.large_image) {
          artworkUrl = resolveDiscordAsset(activity.application_id, activity.assets.large_image);
        }

        const imgTag = artworkUrl 
          ? `<img src="${artworkUrl}" class="activity-large-image" alt="Activity Artwork">` 
          : '';

        const header = activity.type === 2 ? 'Listening to' : 'Playing';
        const details = activity.details ? `<span>${activity.details}</span>` : '';
        const state = activity.state ? `<span style="opacity:0.75">${activity.state}</span>` : '';

        lanyardActivity.innerHTML = `
          <strong>${header}: ${activity.name}</strong>
          <div class="activity-banner-wrap">
            ${imgTag}
            <div class="activity-text-details">
              ${details}
              ${state}
            </div>
          </div>
        `;
      } else {
        lanyardActivity.textContent = "Currently inactive / chilling";
      }
    } catch (err) {
      lanyardActivity.textContent = "Offline or Lanyard unreachable";
    }
  }

  // Chicago Local Time Clock
  function updateChicagoTime() {
    const now = new Date();

    const timeOptions = {
      timeZone: 'America/Chicago',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    digitalClock.textContent = now.toLocaleTimeString('en-US', timeOptions);

    const dateOptions = {
      timeZone: 'America/Chicago',
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    clockDate.textContent = now.toLocaleDateString('en-US', dateOptions);

    const tzString = now.toLocaleTimeString('en-US', { timeZone: 'America/Chicago', timeZoneName: 'short' });
    const code = tzString.split(' ').pop();
    tzName.textContent = `Central Time (${code})`;

    const hour = parseInt(now.toLocaleTimeString('en-US', { timeZone: 'America/Chicago', hour: 'numeric', hour12: false }));
    if (hour >= 1 && hour < 8) {
      activityStatus.textContent = "Likely Sleeping / AFK 🌙";
      activityStatus.style.color = "#ffbe76";
    } else {
      activityStatus.textContent = "Active / Available ⚡";
      activityStatus.style.color = "#43e97b";
    }
  }

  setInterval(updateChicagoTime, 1000);
  setInterval(fetchDiscordPresence, 15000);

  typeWriterStart();
});
