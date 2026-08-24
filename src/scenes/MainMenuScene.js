import Phaser from 'phaser';
import { SCENE_KEYS } from '../config/gameConfig.js';
import profile from '../data/profile.json';
import LiteModeView from '../ui/LiteModeView.js';
import AudioManager from '../systems/AudioManager.js';

/**
 * MainMenuScene — Pixel-art styled main menu rendered as a DOM overlay.
 * The canvas shows an animated starfield background.
 */
export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.MAIN_MENU });
    this._menuEl = null;
    this._playerName = 'Guest';
    this._muted = false;
  }

  create() {
    const { width, height } = this.scale;

    // Clean any leftover HUD/exit icon from previous World — cegah kebawa
    document.getElementById('hud')?.remove();
    document.getElementById('virtual-dpad')?.remove();
    document.getElementById('btn-action')?.remove();
    document.getElementById('btn-jump')?.remove();
    document.getElementById('interaction-indicator')?.classList.add('hidden');
    // Ensure game container visible
    const gc0 = document.getElementById('game-container');
    if (gc0) { gc0.classList.remove('hidden'); gc0.style.display = 'flex'; gc0.style.zIndex = '5'; }
    // Reset Phaser sound mute to stored pref
    this.sound.mute = AudioManager.isMuted();

    // Animated background
    this._createBackground(width, height);

    // Load mute preference
    this._muted = AudioManager.isMuted();
    AudioManager.init(this);

    // Build DOM menu
    this._buildMenu();

    // Auto-play menu BGM — pastikan world track sudah di-stop
    this.time.delayedCall(300, () => {
      if (!this.scene.isActive(SCENE_KEYS.MAIN_MENU)) return;
      // if world BGM still lingering, hard stop first
      if (AudioManager._bgm && AudioManager._bgm.key !== 'bgm_menu') {
        AudioManager.stopAllImmediate();
      }
      AudioManager.playBGM(this, 'bgm_menu', { volume: 0.35 });
    });

    // Cleanup on shutdown — biar menu tidak kebawa ke world
    this.events.once('shutdown', () => {
      this._menuEl?.remove();
      this._menuEl = null;
      // kill pending delayedCalls
      this.time.removeAllEvents();
    });
  }

  _createBackground(width, height) {
    // Dark BG
    this.add.rectangle(width / 2, height / 2, width, height, 0x0f0f1a);

    // Animated star particles
    const stars = [];
    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.FloatBetween(0.5, 2);
      const alpha = Phaser.Math.FloatBetween(0.3, 1);
      const star = this.add.circle(x, y, size, 0xffffff, alpha);
      stars.push(star);

      // Twinkle
      this.tweens.add({
        targets: star,
        alpha: { from: alpha, to: 0.1 },
        duration: Phaser.Math.Between(800, 2500),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000),
        ease: 'Sine.easeInOut',
      });
    }

    // Floating pixel decorations
    const symbols = ['{ }', '< />', '01', '#!/', 'npm', 'git'];
    symbols.forEach((sym, i) => {
      const x = Phaser.Math.Between(40, width - 40);
      const y = Phaser.Math.Between(40, height - 40);
      const t = this.add.text(x, y, sym, {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '6px',
        color: '#2a2a4a',
        alpha: 0.5,
      }).setOrigin(0.5);

      this.tweens.add({
        targets: t,
        y: y - 20,
        alpha: 0.15,
        duration: 3000 + i * 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: i * 300,
      });
    });
  }

  _buildMenu() {
    // Remove existing if any
    if (this._menuEl) this._menuEl.remove();

    const el = document.createElement('div');
    el.id = 'main-menu';
    el.innerHTML = `
      <div class="menu-wrapper">
        <!-- Logo / Title — FERDI DEVELOPER -->
        <div class="menu-title-block">
          <div class="menu-version-tag">v1.0 &bull; FERDI</div>
          <h1 class="menu-title pixel-font" style="font-size:clamp(1.6rem,6vw,2.4rem); letter-spacing:3px; line-height:1.3;">FERDI<span> DEVELOPER</span></h1>
          <p class="menu-subtitle">${profile.role} &bull; Batujajar, Indonesia</p>
        </div>

        <!-- Name Input -->
        <div class="menu-name-section">
          <label class="menu-label pixel-font">Enter Your Name</label>
          <div class="menu-name-row">
            <input
              id="player-name-input"
              type="text"
              maxlength="12"
              placeholder="Adventurer"
              autocomplete="off"
              spellcheck="false"
              value="${this._playerName === 'Guest' ? '' : this._playerName}"
            />
            <button id="btn-skip-name" class="btn-ghost" title="Skip">Skip</button>
          </div>
        </div>

        <!-- Menu Buttons -->
        <nav class="menu-nav">
          <button id="btn-start-game" class="menu-btn menu-btn--primary">
            <span class="menu-btn-icon">▶</span>
            Start View
          </button>
          <button id="btn-lite-mode" class="menu-btn menu-btn--secondary">
            <span class="menu-btn-icon">📋</span>
            Lite Mode
          </button>
          <button id="btn-instructions" class="menu-btn menu-btn--ghost">
            <span class="menu-btn-icon">❓</span>
            Instructions
          </button>
        </nav>

        <!-- Audio Toggle -->
        <button id="btn-mute-menu" class="menu-mute-btn" title="Toggle Audio">
          ${this._muted ? '🔇' : '🔊'}
        </button>

        <!-- Footer -->
        <p class="menu-footer pixel-font">
          Made with ♥ by ${profile.name} &bull; Ferdi Developer
        </p>
      </div>
    `;

    this._applyMenuStyles(el);
    document.getElementById('app').appendChild(el);
    this._menuEl = el;

    // Bring game container behind
    const gc = document.getElementById('game-container');
    gc.style.zIndex = '5';

    this._bindMenuEvents();
  }

  _applyMenuStyles(el) {
    const style = document.createElement('style');
    style.textContent = `
      #main-menu {
        position: fixed;
        inset: 0;
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }
      .menu-wrapper {
        pointer-events: all;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        padding: 2.5rem 2rem;
        width: min(480px, 95vw);
        background: rgba(15, 15, 26, 0.92);
        border: 1px solid #2a2a4a;
        border-radius: 16px;
        backdrop-filter: blur(20px);
        box-shadow: 0 0 60px rgba(124, 58, 237, 0.15), 0 0 120px rgba(124, 58, 237, 0.05);
        animation: slide-up 0.4s ease;
      }
      .menu-wrapper::before {
        content: '';
        position: absolute;
        inset: -1px;
        border-radius: 17px;
        background: linear-gradient(135deg, rgba(124,58,237,0.3), transparent, rgba(6,182,212,0.2));
        pointer-events: none;
        z-index: -1;
      }
      .menu-version-tag {
        font-family: 'Press Start 2P', monospace;
        font-size: 6px;
        color: #7c3aed;
        background: rgba(124,58,237,0.15);
        padding: 3px 8px;
        border-radius: 4px;
        border: 1px solid rgba(124,58,237,0.3);
        margin-bottom: 4px;
      }
      .menu-title-block { text-align: center; }
      .menu-title {
        font-size: clamp(2rem, 8vw, 3rem);
        font-family: 'Press Start 2P', monospace;
        color: #e2e8f0;
        text-shadow: 0 0 20px rgba(124,58,237,0.8), 0 0 40px rgba(124,58,237,0.4);
        letter-spacing: 6px;
        margin: 0;
        animation: pixel-flicker 3s ease-in-out infinite;
      }
      .menu-title span { color: #7c3aed; }
      .menu-subtitle {
        font-size: 0.78rem;
        color: #94a3b8;
        margin-top: 4px;
        font-family: 'Inter', sans-serif;
      }
      .menu-name-section {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .menu-label {
        font-size: 7px;
        color: #94a3b8;
        letter-spacing: 1px;
      }
      .menu-name-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .menu-name-row input {
        flex: 1;
        background: rgba(26,26,46,0.8);
        border: 1px solid #2a2a4a;
        border-radius: 8px;
        padding: 10px 14px;
        color: #e2e8f0;
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        outline: none;
        transition: border-color 0.2s;
      }
      .menu-name-row input:focus { border-color: #7c3aed; }
      .menu-name-row input::placeholder { color: #475569; }
      .menu-nav {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .menu-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 14px 24px;
        border-radius: 10px;
        font-family: 'Press Start 2P', monospace;
        font-size: 10px;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        letter-spacing: 1px;
      }
      .menu-btn-icon { font-size: 14px; }
      .menu-btn--primary {
        background: linear-gradient(135deg, #7c3aed, #6d28d9);
        color: #fff;
        box-shadow: 0 4px 20px rgba(124,58,237,0.35);
      }
      .menu-btn--primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(124,58,237,0.5);
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      }
      .menu-btn--secondary {
        background: rgba(6,182,212,0.1);
        color: #06b6d4;
        border: 1px solid rgba(6,182,212,0.3);
      }
      .menu-btn--secondary:hover {
        background: rgba(6,182,212,0.2);
        transform: translateY(-2px);
        border-color: rgba(6,182,212,0.6);
      }
      .menu-btn--ghost {
        background: transparent;
        color: #94a3b8;
        border: 1px solid #2a2a4a;
      }
      .menu-btn--ghost:hover {
        color: #e2e8f0;
        border-color: #475569;
        background: rgba(255,255,255,0.04);
        transform: translateY(-1px);
      }
      .menu-mute-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255,255,255,0.06);
        border: 1px solid #2a2a4a;
        border-radius: 8px;
        padding: 6px 10px;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.2s;
      }
      .menu-mute-btn:hover { background: rgba(255,255,255,0.12); }
      .menu-footer {
        font-size: 6px;
        color: #334155;
        text-align: center;
      }
    `;
    el.appendChild(style);
  }

  _bindMenuEvents() {
    const nameInput = document.getElementById('player-name-input');
    const btnStart   = document.getElementById('btn-start-game');
    const btnLite    = document.getElementById('btn-lite-mode');
    const btnInstr   = document.getElementById('btn-instructions');
    const btnSkip    = document.getElementById('btn-skip-name');
    const btnMute    = document.getElementById('btn-mute-menu');

    const getName = () => {
      const v = nameInput.value.trim();
      // Basic sanitization
      return v.replace(/[<>"']/g, '').slice(0, 12) || 'Guest';
    };

    btnStart.addEventListener('click', () => {
      this._playerName = getName();
      this._startGame();
    });

    btnSkip.addEventListener('click', () => {
      this._playerName = 'Guest';
      nameInput.value = '';
    });

    btnLite.addEventListener('click', () => {
      this._menuEl.remove();
      document.body.classList.add('lite-mode');
      document.documentElement.classList.add('lite-mode');
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      // Hide Phaser canvas so lite content visible
      const gc = document.getElementById('game-container');
      if (gc) { gc.style.display = 'none'; gc.classList.add('hidden'); }
      // HARD stop menu BGM immediately — cegah 2 sound (Phaser + HTMLAudio)
      AudioManager.stopAllImmediate();
      try { this.sound.stopAll(); } catch {}
      LiteModeView.render(document.getElementById('app'));
      window.scrollTo(0, 0);
    });

    btnInstr.addEventListener('click', () => this._showInstructions());

    btnMute.addEventListener('click', () => {
      const nowMuted = AudioManager.toggle();
      this._muted = nowMuted;
      btnMute.textContent = nowMuted ? '🔇' : '🔊';
      // if unmuted and no BGM playing, start it
      if (!nowMuted && !AudioManager._bgm?.isPlaying) {
        AudioManager.playBGM(this, 'bgm_menu', { volume: 0.35 });
      }
      AudioManager.playSFX(this, 'sfx_interact');
    });

    // Enter key submits
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnStart.click();
    });
  }

  _startGame() {
    // Play SFX + stop menu BGM
    AudioManager.playSFX(this, 'sfx_open');
    AudioManager.stopAllImmediate();

    // Pass player name + mute state to WorldScene
    this.registry.set('playerName', this._playerName);
    this.registry.set('muted', this._muted);

    // Show game canvas
    const gc = document.getElementById('game-container');
    gc.classList.remove('hidden');
    gc.style.zIndex = '10';

    // Fade out menu DOM element (fast — 200ms)
    if (this._menuEl) {
      this._menuEl.style.transition = 'opacity 0.2s';
      this._menuEl.style.opacity = '0';
      setTimeout(() => {
        this._menuEl?.remove();
        this._menuEl = null;
      }, 220);
    }

    // scene.start(WORLD) auto-stops MAIN_MENU, so no delayedCall needed.
    // Small delay to let DOM fade start, but use scene events not this.time.
    setTimeout(() => {
      try { this.scene.start(SCENE_KEYS.WORLD); } catch {}
      try { this.scene.start(SCENE_KEYS.UI); } catch {}
    }, 50);
  }

  _showInstructions() {
    const existing = document.getElementById('instructions-modal');
    if (existing) return;

    const modal = document.createElement('div');
    modal.id = 'instructions-modal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-panel glass-card" style="max-width:500px;padding:2rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
          <h2 class="pixel-font" style="font-size:12px;color:#7c3aed;">CONTROLS</h2>
          <button id="close-instr" class="btn-ghost" style="font-size:1.2rem;">✕</button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
          <div>
            <h3 style="font-family:'Press Start 2P',monospace;font-size:8px;color:#06b6d4;margin-bottom:12px;">⌨️ Desktop</h3>
            <div class="instr-row"><kbd>W A S D</kbd><span>Move</span></div>
            <div class="instr-row"><kbd>↑ ↓ ← →</kbd><span>Move</span></div>
            <div class="instr-row"><kbd>E</kbd><span>Interact</span></div>
            <div class="instr-row"><kbd>Space</kbd><span>Jump ⤒</span></div>
            <div class="instr-row"><kbd>Esc</kbd><span>Close / Exit</span></div>
          </div>
          <div>
            <h3 style="font-family:'Press Start 2P',monospace;font-size:8px;color:#06b6d4;margin-bottom:12px;">📱 Mobile</h3>
            <div class="instr-row">🕹️<span>D-Pad (bottom left)</span></div>
            <div class="instr-row">🔵<span>E = Interact</span></div>
            <div class="instr-row">🟢<span>⤒ = Jump</span></div>
            <div class="instr-row">✕<span>Tap X to close modal</span></div>
          </div>
        </div>

        <div style="margin-top:1.5rem;padding:12px;background:rgba(124,58,237,0.1);border-radius:8px;border:1px solid rgba(124,58,237,0.2);">
          <p style="font-size:0.8rem;color:#94a3b8;line-height:1.6;">
            💡 Explore the virtual office to discover projects, skills, and contact info.
            Approach glowing objects and press <strong style="color:#fbbf24">E</strong> to interact!
          </p>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .instr-row {
        display: flex; align-items: center; gap: 10px;
        margin-bottom: 8px; font-size: 0.8rem; color: #94a3b8;
      }
      kbd {
        background: #1e293b; border: 1px solid #334155;
        border-radius: 4px; padding: 2px 6px; font-size: 0.7rem;
        color: #e2e8f0; font-family: monospace; white-space: nowrap;
      }
    `;
    modal.appendChild(style);
    document.getElementById('modal-portal').appendChild(modal);

    const close = () => modal.remove();
    document.getElementById('close-instr').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

    const escHandler = (e) => {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); }
    };
    document.addEventListener('keydown', escHandler);
  }
}
