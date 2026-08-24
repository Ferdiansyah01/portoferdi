/**
 * InputController — Abstracts keyboard and virtual D-pad into one interface.
 *
 * Usage:
 *   const ic = new InputController(scene);
 *   // In update():
 *   const { x, y } = ic.getDirection(); // -1, 0, or 1
 *   const acted = ic.isActionPressed();
 */
export default class InputController {
  constructor(scene) {
    this.scene = scene;

    // Keyboard cursors + WASD
    this._cursors = scene.input.keyboard.createCursorKeys();
    this._wasd = scene.input.keyboard.addKeys({
      up:     Phaser.Input.Keyboard.KeyCodes.W,
      down:   Phaser.Input.Keyboard.KeyCodes.S,
      left:   Phaser.Input.Keyboard.KeyCodes.A,
      right:  Phaser.Input.Keyboard.KeyCodes.D,
    });
    this._actionKey  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this._jumpKey    = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this._spaceKey   = this._jumpKey; // alias for backward compat
    this._escKey     = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this._prevJumpState = false;

    // Virtual D-pad state
    this._vDir = { up: false, down: false, left: false, right: false };
    this._vAction = false;

    // Action "just pressed" — consume it once
    this._actionConsumed = false;
    this._prevActionState = false;

    // Detect touch device and show D-pad
    this._isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (this._isTouchDevice) {
      this._buildVirtualDPad();
    }
  }

  _buildVirtualDPad() {
    const dpad = document.createElement('div');
    dpad.id = 'virtual-dpad';

    dpad.innerHTML = `
      <button id="dpad-empty-tl"></button>
      <button id="dpad-up"    style="grid-column:2;grid-row:1" title="Up">▲</button>
      <button id="dpad-empty-tr"></button>
      <button id="dpad-left"  style="grid-column:1;grid-row:2" title="Left">◀</button>
      <button id="dpad-empty-c" style="grid-column:2;grid-row:2;background:rgba(255,255,255,0.04);border-radius:8px;"></button>
      <button id="dpad-right" style="grid-column:3;grid-row:2" title="Right">▶</button>
      <button id="dpad-empty-bl"></button>
      <button id="dpad-down"  style="grid-column:2;grid-row:3" title="Down">▼</button>
      <button id="dpad-empty-br"></button>
    `;

    document.body.appendChild(dpad);

    const actionBtn = document.createElement('button');
    actionBtn.id = 'btn-action';
    actionBtn.textContent = 'E';
    actionBtn.title = 'Interact (E)';
    document.body.appendChild(actionBtn);

    const jumpBtn = document.createElement('button');
    jumpBtn.id = 'btn-jump';
    jumpBtn.textContent = '⤒';
    jumpBtn.title = 'Jump (Space)';
    jumpBtn.style.cssText = `
      position:fixed; bottom:3rem; right:7.5rem; z-index:150;
      width:48px; height:48px; border-radius:50%;
      background:rgba(16,185,129,0.18); border:2px solid rgba(52,211,153,0.5);
      color:#6ee7b7; font-weight:700; font-size:1.1rem; cursor:pointer;
      box-shadow:0 4px 12px rgba(16,185,129,0.3); backdrop-filter:blur(6px);
    `;
    document.body.appendChild(jumpBtn);
    this._jumpBtn = jumpBtn;

    // Bind D-pad buttons
    const dirs = ['up', 'down', 'left', 'right'];
    dirs.forEach((dir) => {
      const btn = document.getElementById(`dpad-${dir}`);
      if (!btn) return;
      const setDir = (val) => { this._vDir[dir] = val; };
      btn.addEventListener('touchstart', (e) => { e.preventDefault(); setDir(true); });
      btn.addEventListener('touchend',   (e) => { e.preventDefault(); setDir(false); });
      btn.addEventListener('mousedown',  () => setDir(true));
      btn.addEventListener('mouseup',    () => setDir(false));
      btn.addEventListener('mouseleave', () => setDir(false));
    });

    // Action button (E)
    actionBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this._vAction = true; });
    actionBtn.addEventListener('touchend',   (e) => { e.preventDefault(); this._vAction = false; });
    actionBtn.addEventListener('mousedown',  () => { this._vAction = true; });
    actionBtn.addEventListener('mouseup',    () => { this._vAction = false; });

    // Jump button (Space) — biar ga monoton cuma jalan
    this._vJump = false;
    jumpBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this._vJump = true; });
    jumpBtn.addEventListener('touchend',   (e) => { e.preventDefault(); this._vJump = false; });
    jumpBtn.addEventListener('mousedown',  () => { this._vJump = true; });
    jumpBtn.addEventListener('mouseup',    () => { this._vJump = false; });
    jumpBtn.addEventListener('mouseleave', () => { this._vJump = false; });
  }

  _isTyping() {
    const el = document.activeElement;
    return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
  }

  /**
   * @returns {{ x: number, y: number }} — components are -1, 0, or 1
   */
  getDirection() {
    if (this._isTyping()) return { x: 0, y: 0 };
    const up    = this._cursors.up.isDown    || this._wasd.up.isDown    || this._vDir.up;
    const down  = this._cursors.down.isDown  || this._wasd.down.isDown  || this._vDir.down;
    const left  = this._cursors.left.isDown  || this._wasd.left.isDown  || this._vDir.left;
    const right = this._cursors.right.isDown || this._wasd.right.isDown || this._vDir.right;

    return {
      x: (right ? 1 : 0) - (left ? 1 : 0),
      y: (down  ? 1 : 0) - (up   ? 1 : 0),
    };
  }

  /**
   * Returns true once per press (edge-triggered, not level-triggered).
   * Action = E (interact) — Space dipisah jadi Jump
   */
  isActionJustPressed() {
    if (this._isTyping()) return false;
    const current = Phaser.Input.Keyboard.JustDown(this._actionKey)
      || this._vAction;

    if (current && !this._prevActionState) {
      this._prevActionState = true;
      return true;
    }
    if (!current) this._prevActionState = false;
    return false;
  }

  isJumpJustPressed() {
    if (this._isTyping()) return false;
    const current = Phaser.Input.Keyboard.JustDown(this._jumpKey)
      || this._vJump;

    if (current && !this._prevJumpState) {
      this._prevJumpState = true;
      return true;
    }
    if (!current) this._prevJumpState = false;
    return false;
  }

  isEscapeJustPressed() {
    return Phaser.Input.Keyboard.JustDown(this._escKey);
  }

  destroy() {
    document.getElementById('virtual-dpad')?.remove();
    document.getElementById('btn-action')?.remove();
    document.getElementById('btn-jump')?.remove();
  }
}
