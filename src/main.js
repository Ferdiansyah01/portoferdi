/**
 * main.js — Entry point.
 *
 * On page load, renders the Main Menu via a lightweight shell
 * (no Phaser loaded yet — keeps initial payload small for Lite Mode).
 *
 * When the user clicks "Start Game", Phaser is lazy-imported and
 * the full game starts.
 */
import './style.css';
import LiteModeView from './ui/LiteModeView.js';

// ─── Bootstrap ─────────────────────────────────────────────────────────────
const app = document.getElementById('app');

// Show splash / boot shell immediately so users see something fast
renderBootShell();

async function renderBootShell() {
  // We render a very lightweight HTML shell first.
  // The actual Phaser scenes are lazy-imported only when "Start Game" is clicked.
  const shell = document.createElement('div');
  shell.id = 'boot-shell';
  shell.style.cssText = `
    position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
    background:#0f0f1a;z-index:5;
  `;
  shell.innerHTML = `
    <div style="text-align:center;">
      <div style="
        font-family:'Press Start 2P',monospace;font-size:clamp(1.2rem,4vw,2rem);
        color:#e2e8f0;text-shadow:0 0 20px rgba(124,58,237,0.8);
        animation:pixel-flicker 3s ease-in-out infinite;
        letter-spacing:4px;margin-bottom:8px;line-height:1.4;
      ">FERDI<span style="color:#7c3aed"> DEVELOPER</span></div>
      <div style="
        font-family:'Press Start 2P',monospace;font-size:8px;color:#334155;
        animation:pixel-flicker 2s ease-in-out 0.5s infinite;
      ">Initializing...</div>
    </div>
  `;
  document.body.appendChild(shell);

  // Lazy-load Phaser + scenes
  const [
    { default: Phaser },
    { default: gameConfig },
    { default: BootScene },
    { default: MainMenuScene },
    { default: WorldScene },
    { default: UIScene },
  ] = await Promise.all([
    import('phaser'),
    import('./config/gameConfig.js').then(m => ({ default: m })),
    import('./scenes/BootScene.js'),
    import('./scenes/MainMenuScene.js'),
    import('./scenes/WorldScene.js'),
    import('./scenes/UIScene.js'),
  ]);

  shell.remove();

  // ── Phaser Game Config — adaptive for mobile ────────────────────────
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth < 768;
  const mobileZoom = isMobile ? 2 : gameConfig.ZOOM;
  // mobile pakai viewport penuh biar canvas pas di layar
  const baseW = gameConfig.MAP_WIDTH  * gameConfig.TILE_SIZE * mobileZoom;
  const baseH = gameConfig.MAP_HEIGHT * gameConfig.TILE_SIZE * mobileZoom;

  const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#0f0f1a',
    scale: {
      mode:       Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width:      baseW,
      height:     baseH,
      min: { width: 320,  height: 240 },
      max: { width: 2560, height: 1440 },
      // jaga aspect di mobile notch & keyboard
      expandParent: false,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    dom: {
      createContainer: true,
    },
    // input: prevent default hanya untuk game keys, biar input text tetep bisa
    input: {
      keyboard: { target: window },
      mouse: { preventDefaultMove: false },
      touch: { capture: true },
    },
    scene: [BootScene, MainMenuScene, WorldScene, UIScene],
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    // expose zoom for scenes
    customMobileZoom: mobileZoom,
  };

  // Make game container visible
  const gc = document.getElementById('game-container');
  gc.classList.remove('hidden');
  gc.style.display = 'flex';
  gc.style.zIndex  = '5';

  // Instantiate Phaser
  const game = new Phaser.Game(config);

  // Mobile: handle orientation / resize
  window.addEventListener('resize', () => { try { game.scale.refresh(); } catch {} });
  window.addEventListener('orientationchange', () => { setTimeout(() => { try { game.scale.refresh(); } catch {} }, 300); });
  // prevent double-tap zoom on game — jangan block 2-finger scroll di Lite Mode
  document.addEventListener('touchstart', (e) => {
    if (document.body.classList.contains('lite-mode')) return;
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });
  let lastTouch = 0;
  document.addEventListener('touchend', (e) => {
    if (document.body.classList.contains('lite-mode')) return;
    const now = Date.now();
    if (now - lastTouch <= 300) e.preventDefault();
    lastTouch = now;
  }, { passive: false });
  // allow wheel/touchpad scroll in Lite Mode — Phaser capture jangan ditahan
  window.addEventListener('wheel', (e) => {
    if (document.body.classList.contains('lite-mode')) e.stopPropagation();
  }, { passive: true });

  // Expose for debugging
  window.__devquest = game;
}
