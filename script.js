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
  const navButtons = [homeThemeBtn, hackerThemeBtn, discordThemeBtn, timeThemeBtn];

  const resultsButton = document.getElementById('results-theme');
  const resultsButtonContainer = document.getElementById('results-button-container');
  const resultsHint = document.getElementById('results-hint');

  const volumeIcon = document.getElementById('volume-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const transparencySlider = document.getElementById('transparency-slider');
  const snowToggleBtn = document.getElementById('snow-toggle-btn');
  
  // Tab Containers
  const profileBlock = document.getElementById('profile-block');
  const skillsBlock = document.getElementById('skills-block');
  const discordBlock = document.getElementById('discord-block');
  const timeBlock = document.getElementById('time-block');

  // HUD, Cinema & Lightning Elements
  const shortcutHud = document.getElementById('shortcut-hud');
  const cinemaExitHint = document.getElementById('cinema-exit-hint');
  const lightningFlash = document.getElementById('lightning-flash');
  let isCinemaMode = false;

  // Context Menu & Toast Elements
  const contextMenu = document.getElementById('custom-context-menu');
  const actionToast = document.getElementById('action-toast');

  // Lanyard Status Elements
  const DISCORD_USER_ID = "1245196598368141424";
  const lanyardAvatar = document.getElementById('lanyard-avatar');
  const lanyardStatusDot = document.getElementById('lanyard-status-dot');
  const lanyardUsername = document.getElementById('lanyard-username');
  const lanyardCustomStatus = document.getElementById('lanyard-custom-status');
  const lanyardActivity = document.getElementById('lanyard-activity');

  // Clock & Weather Elements
  const digitalClock = document.getElementById('digital-clock');
  const clockDate = document.getElementById('clock-date');
  const tzName = document.getElementById('tz-name');
  const chicagoWeatherVal = document.getElementById('chicago-weather-val');

  const pythonBar = document.getElementById('python-bar');
  const cppBar = document.getElementById('cpp-bar');
  const csharpBar = document.getElementById('csharp-bar');

  const profilePicture = document.querySelector('.profile-picture');
  const profileContainer = document.querySelector('.profile-container');
  const cursor = document.querySelector('.custom-cursor');

  // Dropboard & Music Elements
  const dropboardDrawer = document.getElementById('dropboard-drawer');
  const drawerTabHandle = document.getElementById('drawer-tab-handle');
  const cardMusicBtn = document.getElementById('card-music-btn');
  const ytCustomInput = document.getElementById('yt-custom-input');
  const ytLoadBtn = document.getElementById('yt-load-btn');
  const drawerFeedback = document.getElementById('drawer-feedback');
  const trackProgressFill = document.getElementById('track-progress-fill');

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

  // Background Parallax
  const bgIframe = document.getElementById('background');
  if (!isTouchDevice && bgIframe) {
    const parallaxState = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const targetX = ((e.clientX - centerX) / centerX) * -25;
      const targetY = ((e.clientY - centerY) / centerY) * -25;

      gsap.to(parallaxState, {
        x: targetX,
        y: targetY,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: () => {
          bgIframe.style.setProperty('--parallax-x', `${parallaxState.x}px`);
          bgIframe.style.setProperty('--parallax-y', `${parallaxState.y}px`);
        }
      });
    });
  }

  // Mocha Card Acrylic Glare
  const activeCards = [profileBlock, skillsBlock, discordBlock, timeBlock];

  function updateCardGlare(e, element) {
    const rect = element.getBoundingClientRect();
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    element.style.setProperty('--glare-x', `${x}px`);
    element.style.setProperty('--glare-y', `${y}px`);
  }

  // Soft Mocha Lightning Flash
  function triggerLightningFlash() {
    if (!lightningFlash) return;

    gsap.timeline()
      .to(lightningFlash, { opacity: 0.75, duration: 0.04, ease: 'power1.out' })
      .to(lightningFlash, { opacity: 0.15, duration: 0.06 })
      .to(lightningFlash, { opacity: 0.85, duration: 0.05 })
      .to(lightningFlash, { opacity: 0.25, duration: 0.08 })
      .to(lightningFlash, { opacity: 0, duration: 0.5, ease: 'power2.out' });

    const nextInterval = Math.floor(Math.random() * 10001) + 10000;
    setTimeout(triggerLightningFlash, nextInterval);
  }
  setTimeout(triggerLightningFlash, Math.floor(Math.random() * 6000) + 7000);

  // Weather Particles
  const weatherCanvas = document.getElementById('weather-canvas');
  const weatherCtx = weatherCanvas.getContext('2d');
  let isSnowMode = false;

  function resizeWeatherCanvas() {
    weatherCanvas.width = window.innerWidth;
    weatherCanvas.height = window.innerHeight;
  }
  resizeWeatherCanvas();
  window.addEventListener('resize', resizeWeatherCanvas);

  const particleCount = 80;
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      len: Math.random() * 18 + 8,
      radius: Math.random() * 2 + 1,
      speed: Math.random() * 3.5 + 2.5,
      snowSpeed: Math.random() * 1.3 + 0.7,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.025 + 0.01,
      opacity: Math.random() * 0.35 + 0.15
    });
  }

  function renderWeather() {
    weatherCtx.clearRect(0, 0, weatherCanvas.width, weatherCanvas.height);

    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];

      if (isSnowMode) {
        p.wobble += p.wobbleSpeed;
        p.y += p.snowSpeed;
        p.x += Math.sin(p.wobble) * 0.65;

        weatherCtx.fillStyle = `rgba(205, 214, 244, ${p.opacity})`;
        weatherCtx.beginPath();
        weatherCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        weatherCtx.fill();
      } else {
        p.y += p.speed;
        p.x -= 0.5;

        weatherCtx.strokeStyle = `rgba(137, 180, 250, ${p.opacity})`;
        weatherCtx.lineWidth = 1.1;
        weatherCtx.lineCap = 'round';
        weatherCtx.beginPath();
        weatherCtx.moveTo(p.x, p.y);
        weatherCtx.lineTo(p.x - 1.5, p.y + p.len);
        weatherCtx.stroke();
      }

      if (p.y > weatherCanvas.height) {
        p.y = -20;
        p.x = Math.random() * weatherCanvas.width;
      }
    }
    requestAnimationFrame(renderWeather);
  }
  renderWeather();

  function toggleSnowMode() {
    isSnowMode = !isSnowMode;
    if (snowToggleBtn) {
      snowToggleBtn.classList.toggle('active', isSnowMode);
    }
  }

  if (snowToggleBtn) {
    snowToggleBtn.addEventListener('click', toggleSnowMode);
  }

  // Chicago Weather Sync
  const weatherCodeMap = {
    0: "Clear Sky ☀️",
    1: "Mainly Clear 🌤️",
    2: "Partly Cloudy ⛅",
    3: "Overcast ☁️",
    45: "Foggy 🌫️",
    51: "Light Drizzle 🌧️",
    61: "Rainy 🌧️",
    63: "Moderate Rain 🌧️",
    65: "Heavy Rain ⛈️",
    71: "Slight Snow ❄️",
    73: "Moderate Snow ❄️",
    75: "Heavy Snow ❄️",
    95: "Thunderstorm ⚡"
  };

  async function fetchChicagoWeather() {
    try {
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.85&longitude=-87.65&current=temperature_2m,weather_code&temperature_unit=fahrenheit');
      const data = await res.json();
      if (data && data.current) {
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        const condition = weatherCodeMap[code] || "Overcast ☁️";
        
        if (chicagoWeatherVal) {
          chicagoWeatherVal.textContent = `${temp}°F • ${condition}`;
        }

        if ([71, 73, 75, 77, 85, 86].includes(code) && !isSnowMode) {
          toggleSnowMode();
        }
      }
    } catch (err) {
      if (chicagoWeatherVal) chicagoWeatherVal.textContent = "68°F • Clear 🌙";
    }
  }
  fetchChicagoWeather();
  setInterval(fetchChicagoWeather, 600000);

  // Soft Mocha Sparks
  const sparkColors = ['#89b4fa', '#b4befe', '#74c7ec', '#cdd6f4', '#f5c2e7'];

  function createSparks(x, y) {
    const sparkCount = 7;

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
      const distance = Math.floor(Math.random() * 40) + 25;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;

      gsap.to(spark, {
        x: targetX,
        y: targetY,
        opacity: 0,
        scale: Math.random() * 0.4 + 0.2,
        duration: Math.random() * 0.35 + 0.3,
        ease: 'power2.out',
        onComplete: () => spark.remove()
      });
    }
  }

  document.addEventListener('pointerdown', (e) => {
    createSparks(e.clientX, e.clientY);
  });

  // Mocha Line Visualizer
  const lineCanvas = document.getElementById('line-visualizer');
  const lineCtx = lineCanvas.getContext('2d');

  function resizeLineCanvas() {
    const width = window.innerWidth <= 430 ? Math.min(window.innerWidth * 0.9, 350) : 820;
    const height = window.innerWidth <= 430 ? 28 : 36;
    lineCanvas.width = width * window.devicePixelRatio;
    lineCanvas.height = height * window.devicePixelRatio;
    lineCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resizeLineCanvas();
  window.addEventListener('resize', resizeLineCanvas);

  const numBars = 52;
  const barHeights = new Array(numBars).fill(2);
  let audioTick = 0;

  function renderLineVisualizer() {
    requestAnimationFrame(renderLineVisualizer);

    const width = window.innerWidth <= 430 ? Math.min(window.innerWidth * 0.9, 350) : 820;
    const height = window.innerWidth <= 430 ? 28 : 36;

    lineCtx.clearRect(0, 0, width, height);

    const isPlaying = isPlayerReady && player && player.getPlayerState && player.getPlayerState() === 1;
    const currentVol = isMuted ? 0 : parseFloat(volumeSlider.value);

    audioTick += 0.05;

    const barWidth = width / numBars;
    const spacing = 3;

    let bassMagnitude = 0;

    for (let i = 0; i < numBars; i++) {
      let targetH = 2;

      if (isPlaying && currentVol > 0) {
        const bass = Math.sin(audioTick * 3 + i * 0.2);
        const mids = Math.cos(audioTick * 5 + i * 0.4);
        const highs = Math.sin(audioTick * 7 + i * 0.7);

        const mixed = Math.abs(bass * 0.55 + mids * 0.3 + highs * 0.15);
        targetH = Math.max(2, mixed * (height - 4) * currentVol);

        if (i < 8) {
          bassMagnitude += Math.abs(bass);
        }
      }

      barHeights[i] += (targetH - barHeights[i]) * 0.2;

      const x = i * barWidth + spacing / 2;
      const bH = barHeights[i];
      const y = height - bH;

      const grad = lineCtx.createLinearGradient(0, height, 0, y);
      grad.addColorStop(0, 'rgba(116, 199, 236, 0.2)');
      grad.addColorStop(1, 'rgba(137, 180, 250, 0.95)');

      lineCtx.fillStyle = grad;
      lineCtx.fillRect(x, y, barWidth - spacing, bH);
    }

    // Card Bass Bounce
    let scaleVal = 1;
    if (isPlaying && currentVol > 0) {
      const avgBass = bassMagnitude / 8;
      const bassPulse = Math.pow(avgBass, 3);
      scaleVal = 1 + bassPulse * 0.025 * currentVol;
    }

    activeCards.forEach(card => {
      if (card && !card.classList.contains('hidden')) {
        card.style.setProperty('--bass-scale', scaleVal.toFixed(4));
      }
    });
  }

  renderLineVisualizer();

  // Track Duration Bar
  function updateTrackProgress() {
    if (isPlayerReady && player && player.getCurrentTime && player.getDuration) {
      const cur = player.getCurrentTime() || 0;
      const dur = player.getDuration() || 0;
      if (dur > 0 && trackProgressFill) {
        const pct = (cur / dur) * 100;
        trackProgressFill.style.width = `${pct}%`;
      }
    }
  }
  setInterval(updateTrackProgress, 400);

  // Dropboard Drawer
  function toggleDrawer() {
    dropboardDrawer.classList.toggle('open');
    if (dropboardDrawer.classList.contains('open')) {
      setTimeout(() => ytCustomInput.focus(), 120);
    } else {
      ytCustomInput.blur();
    }
  }

  if (drawerTabHandle) drawerTabHandle.addEventListener('click', toggleDrawer);
  if (cardMusicBtn) cardMusicBtn.addEventListener('click', toggleDrawer);

  function extractYouTubeID(input) {
    input = input.trim();
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = input.match(regex);
    if (match && match[1]) return match[1];
    if (input.length === 11 && !input.includes('/') && !input.includes('.')) return input;
    return null;
  }

  function loadCustomSong() {
    const rawVal = ytCustomInput.value;
    const videoId = extractYouTubeID(rawVal);

    if (!videoId) {
      drawerFeedback.textContent = "Invalid YouTube link or ID.";
      drawerFeedback.style.color = "#f38ba8";
      return;
    }

    try {
      if (isPlayerReady && player && typeof player.loadVideoById === 'function') {
        player.loadVideoById({
          videoId: videoId,
          startSeconds: 0
        });
        if (typeof player.setLoop === 'function') player.setLoop(true);
      } else {
        bgIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=0&controls=0&loop=1&playlist=${videoId}&playsinline=1`;
      }

      drawerFeedback.textContent = `Loaded track [${videoId}]`;
      drawerFeedback.style.color = "#a6e3a1";
      ytCustomInput.value = "";

      setTimeout(() => {
        if (dropboardDrawer.classList.contains('open')) toggleDrawer();
      }, 1000);
    } catch (err) {
      drawerFeedback.textContent = "Error loading track.";
      drawerFeedback.style.color = "#f38ba8";
    }
  }

  if (ytLoadBtn) ytLoadBtn.addEventListener('click', loadCustomSong);
  if (ytCustomInput) {
    ytCustomInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') loadCustomSong();
    });
  }

  // Typewriter Start Screen
  const startMessages = ["Click to open profile"];
  const startMessage = startMessages[0];
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
      { opacity: 0, y: -40, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out', onComplete: () => {
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
    "Developing in Python, CSS, and JavaScript",
    "Playing CRK (CookieRun: Kingdom)",
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
      profileBlock.style.background = `rgba(30, 30, 46, ${alpha})`;
      skillsBlock.style.background = `rgba(30, 30, 46, ${alpha})`;
      discordBlock.style.background = `rgba(30, 30, 46, ${alpha})`;
      timeBlock.style.background = `rgba(30, 30, 46, ${alpha})`;
    });
  }

  // 3D Card Tilt
  function handleTilt(e, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const maxTilt = 12;
    const tiltX = ((clientY - centerY) / rect.height) * maxTilt;
    const tiltY = -((clientX - centerX) / rect.width) * maxTilt;

    gsap.to(element, {
      rotationX: tiltX,
      rotationY: tiltY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000
    });

    updateCardGlare(e, element);
  }

  function resetTilt(element) {
    gsap.to(element, { rotationX: 0, rotationY: 0, duration: 0.5, ease: 'power2.out' });
  }

  activeCards.forEach(el => {
    el.addEventListener('mousemove', (e) => handleTilt(e, el));
    el.addEventListener('mouseleave', () => resetTilt(el));
    el.addEventListener('touchend', () => resetTilt(el));
  });

  // Profile Picture Spin
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

  // Tab Switcher
  const allTabs = [
    { name: 'profile', el: profileBlock, theme: 'home-theme', btn: homeThemeBtn },
    { name: 'skills', el: skillsBlock, theme: 'hacker-theme', btn: hackerThemeBtn },
    { name: 'discord', el: discordBlock, theme: 'discord-theme', btn: discordThemeBtn },
    { name: 'time', el: timeBlock, theme: 'time-theme', btn: timeThemeBtn }
  ];

  let currentActiveTab = 'profile';

  function switchTab(targetName) {
    if (targetName === currentActiveTab) return;

    const currentIndex = allTabs.findIndex(t => t.name === currentActiveTab);
    const targetIndex = allTabs.findIndex(t => t.name === targetName);
    const movingDown = targetIndex > currentIndex;

    const outgoing = allTabs[currentIndex];
    const incoming = allTabs[targetIndex];

    navButtons.forEach(btn => btn?.classList.remove('active'));
    incoming.btn?.classList.add('active');

    // Outgoing Vertical Wipe
    if (outgoing && outgoing.el) {
      gsap.to(outgoing.el, {
        y: movingDown ? -50 : 50,
        opacity: 0,
        filter: 'blur(6px)',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          outgoing.el.classList.add('hidden');
          gsap.set(outgoing.el, { y: 0, filter: 'blur(0px)' });
        }
      });
    }

    // Incoming Vertical Wipe
    if (incoming && incoming.el) {
      incoming.el.classList.remove('hidden');
      document.body.className = incoming.theme;

      gsap.fromTo(incoming.el,
        {
          y: movingDown ? 50 : -50,
          opacity: 0,
          filter: 'blur(6px)'
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.38,
          ease: 'power2.out',
          delay: 0.06
        }
      );

      if (incoming.name === 'skills') {
        if (pythonBar) gsap.to(pythonBar, { width: '87%', duration: 1.2, ease: 'power2.out' });
        if (cppBar) gsap.to(cppBar, { width: '15%', duration: 1.2, ease: 'power2.out' });
        if (csharpBar) gsap.to(csharpBar, { width: '35%', duration: 1.2, ease: 'power2.out' });
      }
    }

    currentActiveTab = targetName;

    if (resultsButtonContainer) {
      if (targetName === 'skills') {
        resultsButtonContainer.classList.remove('hidden');
      } else {
        resultsButtonContainer.classList.add('hidden');
      }
    }
  }

  // Button Listeners
  if (homeThemeBtn) homeThemeBtn.addEventListener('click', () => switchTab('profile'));
  if (hackerThemeBtn) hackerThemeBtn.addEventListener('click', () => switchTab('skills'));
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
      fetchChicagoWeather();
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

  // Cinema Mode & Shortcut HUD
  const uiElementsToFade = [
    profileBlock,
    skillsBlock,
    discordBlock,
    timeBlock,
    document.getElementById('line-visualizer'),
    document.getElementById('track-progress-container'),
    document.querySelector('.controls'),
    document.querySelector('.top-controls'),
    document.getElementById('dropboard-drawer'),
    resultsButtonContainer
  ];

  function toggleCinemaMode() {
    isCinemaMode = !isCinemaMode;

    uiElementsToFade.forEach(el => {
      if (el) el.classList.toggle('cinema-hidden', isCinemaMode);
    });

    if (isCinemaMode) {
      cinemaExitHint.classList.remove('hidden');
      if (!shortcutHud.classList.contains('hidden')) {
        shortcutHud.classList.add('hidden');
      }
    } else {
      cinemaExitHint.classList.add('hidden');
    }
  }

  function toggleShortcutHud() {
    shortcutHud.classList.toggle('hidden');
  }

  if (shortcutHud) {
    shortcutHud.addEventListener('click', (e) => {
      if (e.target === shortcutHud) shortcutHud.classList.add('hidden');
    });
  }

  // Custom Context Menu & Toast
  function showToast(msg) {
    if (!actionToast) return;
    actionToast.textContent = msg;
    actionToast.classList.remove('hidden');
    gsap.fromTo(actionToast, 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
    );
    setTimeout(() => {
      gsap.to(actionToast, {
        opacity: 0,
        y: 15,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => actionToast.classList.add('hidden')
      });
    }, 2000);
  }

  function hideContextMenu() {
    if (contextMenu && !contextMenu.classList.contains('hidden')) {
      gsap.to(contextMenu, {
        opacity: 0,
        scale: 0.92,
        duration: 0.12,
        ease: 'power2.in',
        onComplete: () => contextMenu.classList.add('hidden')
      });
    }
  }

  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    if (!contextMenu) return;

    const menuWidth = 220;
    const menuHeight = 220;

    let posX = e.clientX;
    let posY = e.clientY;

    if (posX + menuWidth > window.innerWidth) {
      posX = window.innerWidth - menuWidth - 10;
    }
    if (posY + menuHeight > window.innerHeight) {
      posY = window.innerHeight - menuHeight - 10;
    }

    contextMenu.style.left = `${posX}px`;
    contextMenu.style.top = `${posY}px`;

    contextMenu.classList.remove('hidden');
    gsap.fromTo(contextMenu,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.18, ease: 'power2.out' }
    );
  }, { capture: true });

  document.addEventListener('pointerdown', (e) => {
    if (contextMenu && !contextMenu.contains(e.target)) {
      hideContextMenu();
    }
  });

  document.getElementById('ctx-copy-link')?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Copied profile URL');
    hideContextMenu();
  });

  document.getElementById('ctx-toggle-cinema')?.addEventListener('click', () => {
    toggleCinemaMode();
    hideContextMenu();
  });

  document.getElementById('ctx-toggle-weather')?.addEventListener('click', () => {
    toggleSnowMode();
    showToast(isSnowMode ? 'Snowfall mode' : 'Rain mode');
    hideContextMenu();
  });

  document.getElementById('ctx-toggle-music')?.addEventListener('click', () => {
    toggleDrawer();
    hideContextMenu();
  });

  document.getElementById('ctx-close')?.addEventListener('click', () => {
    hideContextMenu();
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      toggleDrawer();
      return;
    }

    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === '/') {
      e.preventDefault();
      toggleShortcutHud();
      return;
    }

    if (e.key.toLowerCase() === 'f') {
      e.preventDefault();
      toggleCinemaMode();
      return;
    }

    if (e.key.toLowerCase() === 's') {
      e.preventDefault();
      toggleSnowMode();
      return;
    }

    if (e.key === 'Escape') {
      if (!contextMenu.classList.contains('hidden')) {
        hideContextMenu();
      } else if (!shortcutHud.classList.contains('hidden')) {
        shortcutHud.classList.add('hidden');
      } else if (isCinemaMode) {
        toggleCinemaMode();
      } else if (dropboardDrawer.classList.contains('open')) {
        toggleDrawer();
      }
      return;
    }

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
        fetchChicagoWeather();
        break;
      case 'm':
        toggleMuteState();
        break;
    }
  });

  // Lanyard Presence Resolver
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
  }

  setInterval(updateChicagoTime, 1000);
  setInterval(fetchDiscordPresence, 15000);

  typeWriterStart();
});
