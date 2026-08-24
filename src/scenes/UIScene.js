import Phaser from 'phaser';
import { SCENE_KEYS, ZOOM } from '../config/gameConfig.js';

/**
 * UIScene — Runs in parallel with WorldScene (not paused when world pauses).
 * Manages the HUD and "Press E" interaction indicator.
 */
export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.UI });
    this._indicatorEl  = null;
    this._hudEl        = null;
    this._currentObj   = null;
  }

  create() {
    this._indicatorEl = document.getElementById('interaction-indicator');
    this._buildHUD();

    // Clean up DOM on scene shutdown — biar ga kebawa ke halaman utama
    this.events.once('shutdown', () => {
      this._hudEl?.remove();
      this._hudEl = null;
      this.hideIndicator();
      // remove ESC listener to prevent duplicate
      this.input.keyboard.off('keydown-ESC');
    });
    this.events.once('destroy', () => {
      this._hudEl?.remove();
      this.hideIndicator();
    });
  }

  // ── HUD ────────────────────────────────────────────────────────────────
  _buildHUD() {
    if (this._hudEl) this._hudEl.remove();

    const playerName = this.registry.get('playerName') || 'Guest';

    const hud = document.createElement('div');
    hud.id = 'hud';
    hud.style.cssText = 'position:fixed;top:10px;left:10px;right:10px;display:flex;justify-content:space-between;align-items:center;z-index:90;pointer-events:none;';
    hud.innerHTML = `
      <div id="hud-name" title="Your adventurer name" style="
        font-family:'Press Start 2P',monospace;
        font-size:7px;
        color:#94a3b8;
        background:rgba(15,15,26,0.75);
        border:1px solid #2a2a4a;
        border-radius:8px;
        padding:6px 10px;
        backdrop-filter:blur(8px);
        pointer-events:all;
      ">⚔️ ${playerName}</div>

      <button id="hud-mute-btn" title="Toggle Audio" style="
        background:rgba(15,15,26,0.75);
        border:1px solid #2a2a4a;
        border-radius:8px;
        padding:6px 10px;
        font-size:16px;
        cursor:pointer;
        backdrop-filter:blur(8px);
        transition:background 0.2s;
        pointer-events:all;
      ">🔊</button>
    `;

    document.body.appendChild(hud);
    this._hudEl = hud;

    // Sync mute state
    const muteBtn = document.getElementById('hud-mute-btn');
    const muted = this.registry.get('muted') || false;
    muteBtn.textContent = muted ? '🔇' : '🔊';

    muteBtn.addEventListener('click', () => {
      const worldScene = this.scene.get(SCENE_KEYS.WORLD);
      if (worldScene && typeof worldScene.toggleMute === 'function') {
        const nowMuted = worldScene.toggleMute();
        muteBtn.textContent = nowMuted ? '🔇' : '🔊';
      }
    });

    // ESC handling is done by WorldScene — no duplicate listener here
    // to prevent: modal close + exit triggering in the same frame
  }

  // ── Interaction Indicator ───────────────────────────────────────────────
  /**
   * Show the "Press E" indicator above a world object.
   * @param {import('../entities/InteractiveObject.js').default} obj
   * @param {Phaser.Cameras.Scene2D.Camera} worldCamera
   */
  showIndicator(obj, worldCamera) {
    if (!this._indicatorEl) return;
    this._currentObj = obj;

    // Convert world coords → screen coords using camera
    const worldX = obj.x * worldCamera.zoom - worldCamera.scrollX * worldCamera.zoom;
    const worldY = obj.y * worldCamera.zoom - worldCamera.scrollY * worldCamera.zoom;

    const screenX = worldCamera.x + worldX;
    const screenY = worldCamera.y + worldY - 32 * worldCamera.zoom;

    this._indicatorEl.style.left = `${screenX}px`;
    this._indicatorEl.style.top  = `${screenY}px`;
    this._indicatorEl.classList.remove('hidden');
    this._indicatorEl.style.opacity = '1';
  }

  hideIndicator() {
    if (!this._indicatorEl) return;
    this._indicatorEl.classList.add('hidden');
    this._currentObj = null;
  }

  update() {
    // Continuously update indicator position if object is active
    if (this._currentObj) {
      const worldScene = this.scene.get(SCENE_KEYS.WORLD);
      if (worldScene && worldScene.cameras) {
        this.showIndicator(this._currentObj, worldScene.cameras.main);
      }
    }
  }

  destroy() {
    this._hudEl?.remove();
    this.hideIndicator();
  }
}
