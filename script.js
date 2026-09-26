let player;
let isPlayerReady = false;

const ambientPlaylist = [
  { id: "JD-kMIpDfnY", title: "Cozy Rain Ambience & Lo-Fi Beats" },
  { id: "jfKfPfyJRdk", title: "Lofi Hip Hop Radio - Beats to Relax/Study to" },
  { id: "5qap5aO4i9A", title: "Lofi Hip Hop Radio - Beats to Sleep/Chill to" },
  { id: "lTRiuFIWV54", title: "Synthwave / Chillwave Aesthetic Night" }
];
let currentPlaylistIndex = 0;

let audioCtx = null;
let activeAmbientNodes = { rain: null, white: null, rumble: null };

function initAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playUiSound(type = 'click') {
  try {
    initAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'tab') {
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.06);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'defog') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {}
}

function toggleAtmosphereSound(type, btn) {
  initAudioContext();
  if (activeAmbientNodes[type]) {
    activeAmbientNodes[type].gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
    setTimeout(() => {
      if (activeAmbientNodes[type] && activeAmbientNodes[type].source) {
        activeAmbientNodes[type].source.stop();
      }
      activeAmbientNodes[type] = null;
    }, 300);
    btn.classList.remove('active');
    return;
  }

  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const filter = audioCtx.createBiquadFilter();
  const gainNode = audioCtx.createGain();

  if (type === 'rain') {
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    gainNode.gain.value = 0.025;
  } else if (type === 'white') {
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    gainNode.gain.value = 0.035;
  } else if (type === 'rumble') {
    filter.type = 'lowpass';
    filter.frequency.value = 120;
    gainNode.gain.value = 0.06;
  }

  whiteNoise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  whiteNoise.start();

  activeAmbientNodes[type] = { source: whiteNoise, gain: gainNode };
  btn.classList.add('active');
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('background', {
    events: {
      onReady: () => {
        isPlayerReady = true;
        player.mute();
        player.playVideo();
      },
      onStateChange: () => updateTickerTitle()
    }
  });
}

function updateTickerTitle() {
  const tickerText = document.getElementById('ticker-text');
  if (!tickerText) return;
  if (isPlayerReady && player && typeof player.getVideoData === 'function') {
    const data = player.getVideoData();
    if (data && data.title) {
      tickerText.textContent = data.title;
      return;
    }
  }
  tickerText.textContent = ambientPlaylist[currentPlaylistIndex].title;
}

document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('start-screen');
  const profileName = document.getElementById('profile-name');
  const profileBio = document.getElementById('profile-bio');
  const visitorCount = document.getElementById('visitor-count');
  
  const homeThemeBtn = document.getElementById('home-theme');
  const hackerThemeBtn = document.getElementById('hacker-theme');
  const discordThemeBtn = document.getElementById('discord-theme');
  const timeThemeBtn = document.getElementById('time-theme');

  const volumeIcon = document.getElementById('volume-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const volTooltip = document.getElementById('vol-tooltip');
  const transparencySlider = document.getElementById('transparency-slider');
  const snowToggleBtn = document.getElementById('snow-toggle-btn');
  const defogBtn = document.getElementById('defog-glass-btn');
  
  const profileBlock = document.getElementById('profile-block');
  const skillsBlock = document.getElementById('skills-block');
  const discordBlock = document.getElementById('discord-block');
  const timeBlock = document.getElementById('time-block');
  const activeCards = [profileBlock, skillsBlock, discordBlock, timeBlock];

  const shortcutHud = document.getElementById('shortcut-hud');
  const cinemaExitHint = document.getElementById('cinema-exit-hint');
  const lightningFlash = document.getElementById('lightning-flash');
  let isCinemaMode = false;
  let isClockMinimalMode = false;

  const actionToast = document.getElementById('action-toast');
  const cardShareBtn = document.getElementById('card-share-btn');
  const shareBtnText = document.getElementById('share-btn-text');

  const DISCORD_USER_ID = "1245196598368141424";
  const lanyardAvatar = document.getElementById('lanyard-avatar');
  const lanyardStatusDot = document.getElementById('lanyard-status-dot');
  const lanyardUsername = document.getElementById('lanyard-username');
  const lanyardCustomStatus = document.getElementById('lanyard-custom-status');
  const lanyardActivity = document.getElementById('lanyard-activity');
  const discordHeaderDot = document.getElementById('discord-header-dot');
  const discordHeaderText = document.getElementById('discord-header-text');

  const digitalClock = document.getElementById('digital-clock');
  const clockDate = document.getElementById('clock-date');
  const chicagoWeatherVal = document.getElementById('chicago-weather-val');
  const chicagoWindHumidity = document.getElementById('chicago-wind-humidity');
  const chicagoSunCycle = document.getElementById('chicago-sun-cycle');
  const celestialIcon = document.getElementById('celestial-phase-icon');
  const uptimeCounter = document.getElementById('uptime-counter');

  const deviceBatteryChip = document.getElementById('device-battery-chip');
  const networkChip = document.getElementById('network-chip');
  const deviceSpecChip = document.getElementById('device-spec-chip');

  const pythonBar = document.getElementById('python-bar');
  const cppBar = document.getElementById('cpp-bar');
  const csharpBar = document.getElementById('csharp-bar');

  const cursor = document.querySelector('.custom-cursor');

  const dropboardDrawer = document.getElementById('dropboard-drawer');
  const drawerTabHandle = document.getElementById('drawer-tab-handle');
  const cardMusicBtn = document.getElementById('card-music-btn');
  const trackProgressContainer = document.getElementById('track-progress-container');
  const trackProgressFill = document.getElementById('track-progress-fill');
  const audioTimeStamp = document.getElementById('audio-time-stamp');
  const prevTrackBtn = document.getElementById('prev-track-btn');
  const nextTrackBtn = document.getElementById('next-track-btn');
  const eqModeBadge = document.getElementById('eq-mode-badge');
  const visModeBadge = document.getElementById('vis-mode-badge');

  const scratchpadArea = document.getElementById('scratchpad-area');
  const bgDimSlider = document.getElementById('bg-dim-slider');
  const bgDimVal = document.getElementById('bg-dim-val');
  const glassBlurSlider = document.getElementById('glass-blur-slider');
  const glassBlurVal = document.getElementById('glass-blur-val');

  const badgeInspectorModal = document.getElementById('badge-inspector-modal');
  const badgeModalImg = document.getElementById('badge-modal-img');
  const badgeModalTitle = document.getElementById('badge-modal-title');
  const badgeModalDesc = document.getElementById('badge-modal-desc');
  const badgeModalClose = document.getElementById('badge-modal-close');

  let isMuted = false;
  let previousVolume = volumeSlider ? parseFloat(volumeSlider.value) : 0.3;

  if (scratchpadArea) {
    scratchpadArea.value = localStorage.getItem('ramen_scratchpad') || "";
    scratchpadArea.addEventListener('input', () => {
      localStorage.setItem('ramen_scratchpad', scratchpadArea.value);
    });
  }

  if (bgDimSlider) {
    bgDimSlider.addEventListener('input', () => {
      const val = bgDimSlider.value;
      document.documentElement.style.setProperty('--bg-dim', val);
      if (bgDimVal) bgDimVal.textContent = `${Math.round(val * 100)}%`;
    });
  }

  if (glassBlurSlider) {
    glassBlurSlider.addEventListener('input', () => {
      const val = glassBlurSlider.value;
      document.documentElement.style.setProperty('--card-blur', `${val}px`);
      if (glassBlurVal) glassBlurVal.textContent = `${val}px`;
    });
  }

  document.querySelectorAll('.palette-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.className = `home-theme ${btn.getAttribute('data-palette')}`;
      playUiSound('click');
      showToast("Palette Updated ✨");
    });
  });

  document.getElementById('gen-rain-btn')?.addEventListener('click', function() { toggleAtmosphereSound('rain', this); });
  document.getElementById('gen-white-btn')?.addEventListener('click', function() { toggleAtmosphereSound('white', this); });
  document.getElementById('gen-rumble-btn')?.addEventListener('click', function() { toggleAtmosphereSound('rumble', this); });

  if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
      function updateBattery() {
        if (deviceBatteryChip) {
          const icon = battery.charging ? '⚡' : '🔋';
          deviceBatteryChip.textContent = `${icon} ${Math.round(battery.level * 100)}%`;
        }
      }
      updateBattery();
      battery.addEventListener('levelchange', updateBattery);
      battery.addEventListener('chargingchange', updateBattery);
    });
  }

  function updateNetworkStatus() {
    if (networkChip) {
      networkChip.textContent = navigator.onLine ? '📶 Online' : '⚠️ Offline';
      networkChip.style.color = navigator.onLine ? 'var(--fluff-cream)' : '#f87171';
    }
  }
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  updateNetworkStatus();

  if (deviceSpecChip) {
    deviceSpecChip.textContent = `${navigator.platform.includes('Mac') ? 'macOS' : 'Windows'} • WebGL`;
  }

  function defogWindow() {
    playUiSound('defog');
    showToast("Window Defogged ✨");
  }
  if (defogBtn) defogBtn.addEventListener('click', defogWindow);

  let siteStartTime = Date.now();
  setInterval(() => {
    const elapsedSec = Math.floor((Date.now() - siteStartTime) / 1000);
    const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
    const secs = String(elapsedSec % 60).padStart(2, '0');
    if (uptimeCounter) uptimeCounter.textContent = `Up ${mins}:${secs}`;
  }, 1000);

  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  if (!isTouchDevice && cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.style.display = 'block';
    });
    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'scale(0.85) translate(-50%, -50%)';
      playUiSound('click');
    });
    document.addEventListener('mouseup', () => cursor.style.transform = 'scale(1) translate(-50%, -50%)');
  }

  // FIXED: Parallax without losing coordinate centering
  const bgIframe = document.getElementById('background');
  if (!isTouchDevice && bgIframe) {
    gsap.set(bgIframe, { xPercent: -50, yPercent: -50 });
    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = ((e.clientX - centerX) / centerX) * -24;
      const moveY = ((e.clientY - centerY) / centerY) * -24;

      gsap.to(bgIframe, {
        x: moveX,
        y: moveY,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  }

  // FIXED: 3D Card Tilt without layer intersection
  activeCards.forEach(el => {
    if (!el) return;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const tiltX = ((e.clientY - centerY) / rect.height) * -10;
      const tiltY = ((e.clientX - centerX) / rect.width) * 10;

      gsap.to(el, {
        rotationX: tiltX,
        rotationY: tiltY,
        transformPerspective: 1200,
        transformOrigin: "center center",
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  });

  // Weather precipitation
  const weatherCanvas = document.getElementById('weather-canvas');
  const weatherCtx = weatherCanvas.getContext('2d');
  let isSnowMode = false;

  function resizeWeatherCanvas() {
    weatherCanvas.width = window.innerWidth;
    weatherCanvas.height = window.innerHeight;
  }
  resizeWeatherCanvas();
  window.addEventListener('resize', resizeWeatherCanvas);

  const particles = [];
  for (let i = 0; i < 75; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      len: Math.random() * 16 + 8,
      radius: Math.random() * 2.5 + 1.2,
      speed: Math.random() * 3.2 + 2.2,
      snowSpeed: Math.random() * 1.2 + 0.6,
      wobble: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.35 + 0.2
    });
  }

  function renderWeather() {
    weatherCtx.clearRect(0, 0, weatherCanvas.width, weatherCanvas.height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (isSnowMode) {
        p.wobble += 0.02;
        p.y += p.snowSpeed;
        p.x += Math.sin(p.wobble) * 0.7;
        weatherCtx.fillStyle = `rgba(253, 244, 255, ${p.opacity})`;
        weatherCtx.beginPath();
        weatherCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        weatherCtx.fill();
      } else {
        p.y += p.speed;
        p.x -= 0.4;
        weatherCtx.strokeStyle = `rgba(196, 181, 253, ${p.opacity})`;
        weatherCtx.lineWidth = 1.2;
        weatherCtx.beginPath();
        weatherCtx.moveTo(p.x, p.y);
        weatherCtx.lineTo(p.x - 1, p.y + p.len);
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
    if (snowToggleBtn) snowToggleBtn.classList.toggle('active', isSnowMode);
    showToast(isSnowMode ? 'Snowfall active' : 'Rain ambience active');
  }
  if (snowToggleBtn) snowToggleBtn.addEventListener('click', toggleSnowMode);

  // Raindrop beads
  const glassCanvas = document.getElementById('raindrop-canvas');
  const glassCtx = glassCanvas.getContext('2d');
  function resizeGlassCanvas() {
    glassCanvas.width = window.innerWidth;
    glassCanvas.height = window.innerHeight;
  }
  resizeGlassCanvas();
  window.addEventListener('resize', resizeGlassCanvas);

  const droplets = [];
  for (let i = 0; i < 85; i++) {
    droplets.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.8,
      speed: Math.random() < 0.18 ? Math.random() * 0.3 + 0.08 : 0,
      alpha: Math.random() * 0.35 + 0.3
    });
  }

  function renderGlassDroplets() {
    glassCtx.clearRect(0, 0, glassCanvas.width, glassCanvas.height);
    for (let i = 0; i < droplets.length; i++) {
      const d = droplets[i];
      glassCtx.fillStyle = `rgba(0, 0, 0, ${d.alpha * 0.35})`;
      glassCtx.beginPath();
      glassCtx.arc(d.x + 1, d.y + 1.5, d.r, 0, Math.PI * 2);
      glassCtx.fill();

      const grad = glassCtx.createRadialGradient(d.x - d.r * 0.3, d.y - d.r * 0.3, d.r * 0.1, d.x, d.y, d.r);
      grad.addColorStop(0, `rgba(255, 255, 255, ${d.alpha * 0.95})`);
      grad.addColorStop(0.6, `rgba(196, 181, 253, ${d.alpha * 0.45})`);
      grad.addColorStop(1, `rgba(40, 42, 65, ${d.alpha * 0.55})`);

      glassCtx.fillStyle = grad;
      glassCtx.beginPath();
      glassCtx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      glassCtx.fill();

      if (d.speed > 0) {
        d.y += d.speed;
        if (d.y > glassCanvas.height + 20) {
          d.y = -10;
          d.x = Math.random() * glassCanvas.width;
        }
      }
    }
    requestAnimationFrame(renderGlassDroplets);
  }
  renderGlassDroplets();

  // Chicago Weather
  async function fetchChicagoWeather() {
    try {
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.85&longitude=-87.65&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m&daily=sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago');
      const data = await res.json();
      if (data && data.current) {
        const temp = Math.round(data.current.temperature_2m);
        const feels = Math.round(data.current.apparent_temperature);
        const humidity = data.current.relative_humidity_2m;
        const wind = Math.round(data.current.wind_speed_10m);
        
        if (chicagoWeatherVal) chicagoWeatherVal.textContent = `${temp}°F (Feels ${feels}°)`;
        if (chicagoWindHumidity) chicagoWindHumidity.textContent = `${wind} mph • ${humidity}% hum`;

        if (data.daily && data.daily.sunset && data.daily.sunset[0]) {
          const sunsetTime = new Date(data.daily.sunset[0]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          if (chicagoSunCycle) chicagoSunCycle.textContent = `Sunset at ${sunsetTime}`;
        }
      }
    } catch (err) {
      if (chicagoWeatherVal) chicagoWeatherVal.textContent = "68°F (Feels 66°)";
    }
  }
  fetchChicagoWeather();
  setInterval(fetchChicagoWeather, 600000);

  const sparkColors = ['#c4b5fd', '#a5f3fc', '#fbcfe8', '#fdf4ff'];
  function createSparks(x, y) {
    for (let i = 0; i < 6; i++) {
      const spark = document.createElement('div');
      spark.className = 'click-spark';
      spark.style.backgroundColor = sparkColors[Math.floor(Math.random() * sparkColors.length)];
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      document.body.appendChild(spark);

      const angle = (Math.PI * 2 * i) / 6;
      const distance = Math.floor(Math.random() * 35) + 20;
      gsap.to(spark, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0.3,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => spark.remove()
      });
    }
  }
  document.addEventListener('pointerdown', (e) => createSparks(e.clientX, e.clientY));

  const eqModes = ['Chill', 'Bass Boost', 'Treble'];
  let currentEqIndex = 0;
  if (eqModeBadge) {
    eqModeBadge.addEventListener('click', () => {
      currentEqIndex = (currentEqIndex + 1) % eqModes.length;
      eqModeBadge.textContent = `EQ: ${eqModes[currentEqIndex]}`;
      showToast(`EQ: ${eqModes[currentEqIndex]}`);
      playUiSound('click');
    });
  }

  const visModes = ['Bars', 'Ribbon Wave', 'Mirror'];
  let currentVisIndex = 0;
  if (visModeBadge) {
    visModeBadge.addEventListener('click', () => {
      currentVisIndex = (currentVisIndex + 1) % visModes.length;
      visModeBadge.textContent = `Vis: ${visModes[currentVisIndex]}`;
      showToast(`Visualizer: ${visModes[currentVisIndex]}`);
      playUiSound('click');
    });
  }

  const lineCanvas = document.getElementById('line-visualizer');
  const lineCtx = lineCanvas.getContext('2d');
  function resizeLineCanvas() {
    const width = window.innerWidth <= 430 ? Math.min(window.innerWidth * 0.9, 350) : 820;
    lineCanvas.width = width * window.devicePixelRatio;
    lineCanvas.height = 34 * window.devicePixelRatio;
    lineCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resizeLineCanvas();
  window.addEventListener('resize', resizeLineCanvas);

  const barHeights = new Array(48).fill(3);
  let audioTick = 0;

  function renderLineVisualizer() {
    requestAnimationFrame(renderLineVisualizer);
    const width = window.innerWidth <= 430 ? Math.min(window.innerWidth * 0.9, 350) : 820;
    const height = 34;
    lineCtx.clearRect(0, 0, width, height);

    const isPlaying = isPlayerReady && player && player.getPlayerState && player.getPlayerState() === 1;
    const currentVol = isMuted ? 0 : parseFloat(volumeSlider.value);
    audioTick += 0.045;

    for (let i = 0; i < 48; i++) {
      let targetH = 3;
      if (isPlaying && currentVol > 0) {
        const bass = Math.sin(audioTick * 2.8 + i * 0.2);
        const mids = Math.cos(audioTick * 4.6 + i * 0.35);
        targetH = Math.max(3, Math.abs(bass * 0.6 + mids * 0.4) * 30 * currentVol);
      }
      barHeights[i] += (targetH - barHeights[i]) * 0.22;
    }

    if (currentVisIndex === 0) {
      for (let i = 0; i < 48; i++) {
        const x = i * (width / 48) + 2;
        const bH = barHeights[i];
        const y = height - bH;
        const grad = lineCtx.createLinearGradient(0, height, 0, y);
        grad.addColorStop(0, 'rgba(165, 243, 252, 0.25)');
        grad.addColorStop(1, 'rgba(196, 181, 253, 0.95)');
        lineCtx.fillStyle = grad;
        lineCtx.beginPath();
        lineCtx.roundRect(x, y, (width / 48) - 4, bH, [2, 2, 2, 2]);
        lineCtx.fill();
      }
    } else if (currentVisIndex === 1) {
      lineCtx.beginPath();
      lineCtx.strokeStyle = 'rgba(196, 181, 253, 0.9)';
      lineCtx.lineWidth = 2.5;
      for (let i = 0; i < 48; i++) {
        const x = i * (width / 47);
        const y = height - barHeights[i];
        if (i === 0) lineCtx.moveTo(x, y);
        else lineCtx.lineTo(x, y);
      }
      lineCtx.stroke();
    } else {
      for (let i = 0; i < 48; i++) {
        const x = i * (width / 48) + 2;
        const halfH = barHeights[i] / 2;
        lineCtx.fillStyle = 'rgba(165, 243, 252, 0.85)';
        lineCtx.fillRect(x, (height / 2) - halfH, (width / 48) - 4, barHeights[i]);
      }
    }
  }
  renderLineVisualizer();

  function seekTrackFromEvent(e, container) {
    if (!isPlayerReady || !player || !player.getDuration) return;
    const rect = container.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    player.seekTo(player.getDuration() * pct, true);
    trackProgressFill.style.width = `${pct * 100}%`;
    playUiSound('click');
  }
  lineCanvas.addEventListener('click', (e) => seekTrackFromEvent(e, lineCanvas));
  trackProgressContainer.addEventListener('click', (e) => seekTrackFromEvent(e, trackProgressContainer));

  function formatTrackTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  setInterval(() => {
    if (isPlayerReady && player && player.getCurrentTime && player.getDuration) {
      const cur = player.getCurrentTime() || 0;
      const dur = player.getDuration() || 0;
      if (dur > 0 && trackProgressFill) {
        trackProgressFill.style.width = `${(cur / dur) * 100}%`;
        if (audioTimeStamp) audioTimeStamp.textContent = `${formatTrackTime(cur)} / ${formatTrackTime(dur)}`;
      }
    }
  }, 400);

  function playPlaylistTrack(index) {
    currentPlaylistIndex = (index + ambientPlaylist.length) % ambientPlaylist.length;
    const track = ambientPlaylist[currentPlaylistIndex];
    if (isPlayerReady && player && typeof player.loadVideoById === 'function') {
      player.loadVideoById({ videoId: track.id, startSeconds: 0 });
      if (typeof player.setLoop === 'function') player.setLoop(true);
    } else if (bgIframe) {
      bgIframe.src = `https://www.youtube-nocookie.com/embed/${track.id}?enablejsapi=1&autoplay=1&mute=0&controls=0&loop=1&playlist=${track.id}&playsinline=1`;
    }
    showToast(`Track: ${track.title}`);
    updateTickerTitle();
  }

  if (prevTrackBtn) prevTrackBtn.addEventListener('click', () => { playPlaylistTrack(currentPlaylistIndex - 1); playUiSound('click'); });
  if (nextTrackBtn) nextTrackBtn.addEventListener('click', () => { playPlaylistTrack(currentPlaylistIndex + 1); playUiSound('click'); });

  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast(`Mood set to ${btn.getAttribute('data-mood')} ✨`);
      playUiSound('tab');
    });
  });

  function toggleDrawer() {
    dropboardDrawer.classList.toggle('open');
    playUiSound('tab');
  }
  if (drawerTabHandle) drawerTabHandle.addEventListener('click', toggleDrawer);
  if (cardMusicBtn) cardMusicBtn.addEventListener('click', toggleDrawer);

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const vid = btn.getAttribute('data-video');
      const foundIdx = ambientPlaylist.findIndex(t => t.id === vid);
      if (foundIdx !== -1) playPlaylistTrack(foundIdx);
      else if (isPlayerReady && player) player.loadVideoById({ videoId: vid, startSeconds: 0 });
    });
  });

  function startExperience() {
    startScreen.classList.add('hidden');
    playUiSound('tab');
    
    if (isPlayerReady && player) {
      player.unMute();
      player.setVolume(volumeSlider.value * 100);
      player.playVideo();
    }
    
    profileBlock.classList.remove('hidden');
    gsap.fromTo(profileBlock, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
    if (profileName) profileName.textContent = "RAMEN";
    typeWriterBio();
    fetchDiscordPresence();
    updateChicagoTime();

    const obj = { val: 0 };
    gsap.to(obj, {
      val: 263115,
      duration: 2.2,
      ease: 'power2.out',
      onUpdate: () => { if (visitorCount) visitorCount.textContent = Math.floor(obj.val).toLocaleString(); }
    });
    setTimeout(updateTickerTitle, 1000);
  }

  startScreen.addEventListener('click', startExperience);
  startScreen.addEventListener('touchstart', (e) => { e.preventDefault(); startExperience(); });

  const bioMessages = [
    "Im sorry...", "Developing in Python, CSS, and JavaScript",
    "Playing CRK (CookieRun: Kingdom)", "We do not lick the dog",
    "I am a person :)", "i dont get it, why?"
  ];
  let bioText = '';
  let bioIndex = 0;
  let bioMessageIndex = 0;
  let isBioDeleting = false;

  function typeWriterBio() {
    if (!isBioDeleting && bioIndex < bioMessages[bioMessageIndex].length) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex + 1);
      bioIndex++;
    } else if (isBioDeleting && bioIndex > 0) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex - 1);
      bioIndex--;
    } else if (bioIndex === bioMessages[bioMessageIndex].length) {
      isBioDeleting = true;
      setTimeout(typeWriterBio, 2200);
      return;
    } else if (bioIndex === 0 && isBioDeleting) {
      isBioDeleting = false;
      bioMessageIndex = (bioMessageIndex + 1) % bioMessages.length;
    }
    if (profileBio) profileBio.textContent = bioText + '|';
    setTimeout(typeWriterBio, isBioDeleting ? 25 : 60);
  }

  function updateVolume(val) {
    if (isPlayerReady && player) {
      player.setVolume(val * 100);
      player.unMute();
    }
    isMuted = false;
    volumeSlider.value = val;
    if (volTooltip) volTooltip.textContent = `${Math.round(val * 100)}%`;
  }

  volumeSlider.addEventListener('input', () => updateVolume(volumeSlider.value));
  document.querySelector('.volume-control')?.addEventListener('wheel', (e) => {
    e.preventDefault();
    const step = e.deltaY < 0 ? 0.05 : -0.05;
    const newVal = Math.max(0, Math.min(1, parseFloat(volumeSlider.value) + step));
    updateVolume(newVal);
  });

  volumeIcon.addEventListener('click', () => {
    if (!isPlayerReady || !player) return;
    if (!isMuted) {
      previousVolume = volumeSlider.value > 0 ? volumeSlider.value : 0.3;
      isMuted = true;
      player.mute();
      volumeSlider.value = 0;
      if (volTooltip) volTooltip.textContent = '0%';
      showToast('Muted');
    } else {
      isMuted = false;
      volumeSlider.value = previousVolume;
      player.unMute();
      player.setVolume(previousVolume * 100);
      if (volTooltip) volTooltip.textContent = `${Math.round(previousVolume * 100)}%`;
      showToast('Unmuted');
    }
  });

  if (transparencySlider) {
    transparencySlider.addEventListener('input', () => {
      const fluffBg = `rgba(30, 32, 50, ${transparencySlider.value})`;
      activeCards.forEach(c => { if (c) c.style.background = fluffBg; });
    });
  }

  document.querySelectorAll('.badge-container').forEach(badgeEl => {
    badgeEl.addEventListener('click', () => {
      badgeModalTitle.textContent = badgeEl.getAttribute('data-badge');
      badgeModalDesc.textContent = badgeEl.getAttribute('data-desc');
      badgeModalImg.src = badgeEl.getAttribute('data-img');
      badgeInspectorModal.classList.add('active');
      playUiSound('tab');
    });
  });
  badgeModalClose?.addEventListener('click', () => badgeInspectorModal.classList.remove('active'));

  const allTabs = [
    { name: 'profile', el: profileBlock, btn: homeThemeBtn },
    { name: 'skills', el: skillsBlock, btn: hackerThemeBtn },
    { name: 'discord', el: discordBlock, btn: discordThemeBtn },
    { name: 'time', el: timeBlock, btn: timeThemeBtn }
  ];
  let currentActiveTab = 'profile';

  function switchTab(targetName) {
    if (targetName === currentActiveTab) return;
    playUiSound('tab');

    const outgoing = allTabs.find(t => t.name === currentActiveTab);
    const incoming = allTabs.find(t => t.name === targetName);

    allTabs.forEach(t => t.btn && t.btn.classList.remove('active'));
    if (incoming.btn) incoming.btn.classList.add('active');

    if (outgoing && outgoing.el) {
      gsap.to(outgoing.el, { opacity: 0, y: 30, duration: 0.3, onComplete: () => outgoing.el.classList.add('hidden') });
    }

    if (incoming && incoming.el) {
      incoming.el.classList.remove('hidden');
      gsap.fromTo(incoming.el, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.1 });
      if (incoming.name === 'skills') {
        gsap.to(pythonBar, { width: '87%', duration: 1.2 });
        gsap.to(cppBar, { width: '15%', duration: 1.2 });
        gsap.to(csharpBar, { width: '35%', duration: 1.2 });
      }
    }
    currentActiveTab = targetName;
  }

  if (homeThemeBtn) homeThemeBtn.addEventListener('click', () => switchTab('profile'));
  if (hackerThemeBtn) hackerThemeBtn.addEventListener('click', () => switchTab('skills'));
  if (discordThemeBtn) discordThemeBtn.addEventListener('click', () => { switchTab('discord'); fetchDiscordPresence(); });
  if (timeThemeBtn) timeThemeBtn.addEventListener('click', () => { switchTab('time'); updateChicagoTime(); fetchChicagoWeather(); });

  if (cardShareBtn) {
    cardShareBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href);
      shareBtnText.textContent = "Copied! ✨";
      showToast('Profile URL copied ✨');
      setTimeout(() => shareBtnText.textContent = "Share", 2000);
    });
  }

  document.getElementById('discord-header-pill')?.addEventListener('click', () => {
    navigator.clipboard.writeText('sirramenboi');
    showToast('Copied handle (@sirramenboi) ✨');
    playUiSound('toast');
  });

  function showToast(msg) {
    if (!actionToast) return;
    actionToast.textContent = msg;
    actionToast.classList.remove('hidden');
    gsap.fromTo(actionToast, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.25 });
    setTimeout(() => {
      gsap.to(actionToast, { opacity: 0, y: 15, duration: 0.25, onComplete: () => actionToast.classList.add('hidden') });
    }, 2200);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') { e.preventDefault(); toggleDrawer(); return; }
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key.toLowerCase() === 'f') {
      isCinemaMode = !isCinemaMode;
      [profileBlock, skillsBlock, discordBlock, timeBlock, document.getElementById('music-ticker-pill'), lineCanvas, trackProgressContainer, document.querySelector('.controls'), document.querySelector('.top-controls')].forEach(el => el && el.classList.toggle('cinema-hidden', isCinemaMode));
      cinemaExitHint.classList.toggle('hidden', !isCinemaMode);
      return;
    }
    if (e.key.toLowerCase() === 'h') {
      isClockMinimalMode = !isClockMinimalMode;
      [profileBlock, skillsBlock, discordBlock].forEach(el => el && el.classList.toggle('cinema-hidden', isClockMinimalMode));
      switchTab('time');
      return;
    }
    if (e.key.toLowerCase() === 's') { toggleSnowMode(); return; }
    if (e.key.toLowerCase() === 'c') { defogWindow(); return; }
    if (e.key.toLowerCase() === 'm') { volumeIcon.click(); return; }
    if (e.key === 'Escape') {
      shortcutHud.classList.add('hidden');
      badgeInspectorModal.classList.remove('active');
      if (dropboardDrawer.classList.contains('open')) toggleDrawer();
      return;
    }
    if (['1', '2', '3', '4'].includes(e.key)) {
      const map = { '1': 'profile', '2': 'skills', '3': 'discord', '4': 'time' };
      switchTab(map[e.key]);
    }
  });

  // Right-Click Context Menu Override
  const customContextMenu = document.getElementById('custom-context-menu');

  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (!customContextMenu) return;

    let posX = e.clientX;
    let posY = e.clientY;

    const menuWidth = 200;
    const menuHeight = 170;

    if (posX + menuWidth > window.innerWidth) posX = window.innerWidth - menuWidth - 10;
    if (posY + menuHeight > window.innerHeight) posY = window.innerHeight - menuHeight - 10;

    customContextMenu.style.left = `${posX}px`;
    customContextMenu.style.top = `${posY}px`;
    customContextMenu.classList.remove('hidden');
    gsap.fromTo(customContextMenu, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.15 });
  });

  window.addEventListener('click', (e) => {
    if (customContextMenu && !customContextMenu.contains(e.target)) {
      customContextMenu.classList.add('hidden');
    }
  });

  document.getElementById('ctx-copy-link')?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Profile URL copied ✨');
    customContextMenu.classList.add('hidden');
  });

  document.getElementById('ctx-defog')?.addEventListener('click', () => {
    defogWindow();
    customContextMenu.classList.add('hidden');
  });

  document.getElementById('ctx-cinema')?.addEventListener('click', () => {
    isCinemaMode = !isCinemaMode;
    [profileBlock, skillsBlock, discordBlock, timeBlock, document.getElementById('music-ticker-pill'), lineCanvas, trackProgressContainer, document.querySelector('.controls'), document.querySelector('.top-controls')].forEach(el => el && el.classList.toggle('cinema-hidden', isCinemaMode));
    cinemaExitHint.classList.toggle('hidden', !isCinemaMode);
    customContextMenu.classList.add('hidden');
  });

  document.getElementById('ctx-source')?.addEventListener('click', () => {
    window.open('https://github.com/superrabbitkev-dotcom', '_blank');
    customContextMenu.classList.add('hidden');
  });

  async function fetchDiscordPresence() {
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
      const data = await res.json();
      if (!data.success) return;
      const user = data.data;

      if (lanyardUsername) lanyardUsername.textContent = user.discord_user.global_name || user.discord_user.username;
      if (discordHeaderDot) discordHeaderDot.className = `discord-status-dot-inline ${user.discord_status}`;
      if (discordHeaderText) discordHeaderText.textContent = user.discord_status.toUpperCase();
      if (user.discord_user.avatar && lanyardAvatar) {
        lanyardAvatar.src = `https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar}.${user.discord_user.avatar.startsWith('a_') ? 'gif' : 'png'}`;
      }
      if (lanyardStatusDot) lanyardStatusDot.className = `status-${user.discord_status}`;

      const customStatus = user.activities.find(a => a.type === 4);
      if (lanyardCustomStatus) lanyardCustomStatus.textContent = customStatus && customStatus.state ? `"${customStatus.state}"` : "";

      if (user.listening_to_spotify && user.spotify && lanyardActivity) {
        lanyardActivity.innerHTML = `
          <strong>Listening to Spotify:</strong>
          <div class="activity-banner-wrap">
            <img src="${user.spotify.album_art_url}" class="activity-large-image" alt="Album Art">
            <div class="activity-text-details">
              <span><strong>${user.spotify.song}</strong></span>
              <span style="opacity:0.8">by ${user.spotify.artist}</span>
            </div>
          </div>
        `;
        return;
      }

      const activity = user.activities.find(a => a.type !== 4);
      if (activity && lanyardActivity) {
        lanyardActivity.innerHTML = `<strong>Playing:</strong> ${activity.name}<br><span style="opacity:0.8">${activity.details || ''}</span>`;
      } else if (lanyardActivity) {
        lanyardActivity.textContent = "Currently inactive / chilling";
      }
    } catch (e) {}
  }

  function updateChicagoTime() {
    const now = new Date();
    if (digitalClock) digitalClock.textContent = now.toLocaleTimeString('en-US', { timeZone: 'America/Chicago', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (clockDate) clockDate.textContent = now.toLocaleDateString('en-US', { timeZone: 'America/Chicago', weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
    
    const tzUtc = document.getElementById('tz-utc');
    const tzTokyo = document.getElementById('tz-tokyo');
    const tzLondon = document.getElementById('tz-london');
    if (tzUtc) tzUtc.textContent = `UTC: ${now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: false })}`;
    if (tzTokyo) tzTokyo.textContent = `Tokyo: ${now.toLocaleTimeString('en-US', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: true })}`;
    if (tzLondon) tzLondon.textContent = `London: ${now.toLocaleTimeString('en-US', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const hour = parseInt(now.toLocaleTimeString('en-US', { timeZone: 'America/Chicago', hour12: false, hour: 'numeric' }), 10);
    const isDay = hour >= 6 && hour < 19;

    if (celestialIcon) {
      celestialIcon.innerHTML = isDay ? 
        `<svg viewBox="0 0 24 24" fill="none" stroke="#fde047" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>` :
        `<svg viewBox="0 0 24 24" fill="none" stroke="#a5f3fc" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  }

  setInterval(updateChicagoTime, 1000);
  setInterval(fetchDiscordPresence, 15000);
});
