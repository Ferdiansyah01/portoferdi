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

    // Virtual joystick state (analog -1..1)
    this._joyX = 0; this._joyY = 0;
    this._vDir = { up: false, down: false, left: false, right: false };
    this._vAction = false;

    // Action "just pressed" — consume it once
    this._actionConsumed = false;
    this._prevActionState = false;

    // Detect touch device and show joystick
    this._isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (this._isTouchDevice) {
      this._buildJoystick();
    }
  }

  _buildJoystick() {
    // Joystick base
    const joy = document.createElement('div');
    joy.id = 'virtual-joystick';
    joy.innerHTML = `<div id="joy-stick"></div>`;
    document.body.appendChild(joy);

    const stick = document.getElementById('joy-stick');

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

    // Joystick logic — analog stick
    const baseR = 52; // radius
    const maxDist = 36;
    let active = false;
    let touchId = null;

    const getCenter = () => {
      const r = joy.getBoundingClientRect();
      return { x: r.left + r.width/2, y: r.top + r.height/2 };
    };
    const setStick = (dx, dy) => {
      const dist = Math.hypot(dx, dy);
      const clamped = Math.min(dist, maxDist);
      const ang = Math.atan2(dy, dx);
      const cx = dist > 0 ? Math.cos(ang) * clamped : 0;
      const cy = dist > 0 ? Math.sin(ang) * clamped : 0;
      stick.style.transform = `translate(calc(-50% + ${cx}px), calc(-50% + ${cy}px))`;
      // normalize -1..1
      this._joyX = clamped > 8 ? cx / maxDist : 0;
      this._joyY = clamped > 8 ? cy / maxDist : 0;
      // also set vDir for compat
      this._vDir.up = this._joyY < -0.3; this._vDir.down = this._joyY > 0.3;
      this._vDir.left = this._joyX < -0.3; this._vDir.right = this._joyX > 0.3;
    };
    const reset = () => {
      stick.style.transform = 'translate(-50%, -50%)';
      this._joyX = 0; this._joyY = 0;
      this._vDir = { up:false, down:false, left:false, right:false };
    };

    const onStart = (x,y,id) => { active=true; touchId=id; const c=getCenter(); setStick(x-c.x, y-c.y); };
    const onMove = (x,y,id) => { if(!active || (id!==null && id!==touchId)) return; const c=getCenter(); setStick(x-c.x, y-c.y); };
    const onEnd = (id) => { if(id!==null && id!==touchId) return; active=false; touchId=null; reset(); };

    joy.addEventListener('touchstart', (e)=>{ if(e.cancelable) e.preventDefault(); const t=e.changedTouches[0]; onStart(t.clientX,t.clientY,t.identifier); }, {passive:false});
    joy.addEventListener('touchmove', (e)=>{ if(e.cancelable) e.preventDefault(); const t=[...e.changedTouches].find(t=>t.identifier===touchId)||e.changedTouches[0]; if(t) onMove(t.clientX,t.clientY,t.identifier); }, {passive:false});
    joy.addEventListener('touchend', (e)=>{ if(e.cancelable) e.preventDefault(); const t=e.changedTouches[0]; onEnd(t.identifier); }, {passive:false});
    joy.addEventListener('touchcancel', (e)=>{ const t=e.changedTouches[0]; onEnd(t?.identifier); });
    // mouse fallback for testing di desktop
    joy.addEventListener('mousedown', (e)=> onStart(e.clientX,e.clientY,null));
    window.addEventListener('mousemove', (e)=> onMove(e.clientX,e.clientY,null));
    window.addEventListener('mouseup', ()=> onEnd(null));

    // Action button (E) — fix Intervention: cek cancelable
    const safePrevent = (e)=>{ if(e.cancelable) e.preventDefault(); };
    actionBtn.addEventListener('touchstart', (e) => { safePrevent(e); this._vAction = true; }, {passive:false});
    actionBtn.addEventListener('touchend',   (e) => { safePrevent(e); this._vAction = false; }, {passive:false});
    actionBtn.addEventListener('mousedown',  () => { this._vAction = true; });
    actionBtn.addEventListener('mouseup',    () => { this._vAction = false; });

    // Jump button (Space)
    this._vJump = false;
    jumpBtn.addEventListener('touchstart', (e) => { safePrevent(e); this._vJump = true; }, {passive:false});
    jumpBtn.addEventListener('touchend',   (e) => { safePrevent(e); this._vJump = false; }, {passive:false});
    jumpBtn.addEventListener('mousedown',  () => { this._vJump = true; });
    jumpBtn.addEventListener('mouseup',    () => { this._vJump = false; });
    jumpBtn.addEventListener('mouseleave', () => { this._vJump = false; });
  }

  _isTyping() {
    const el = document.activeElement;
    return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
  }

  /**
   * @returns {{ x: number, y: number }} — components are -1..1 (analog joystick)
   */
  getDirection() {
    if (this._isTyping()) return { x: 0, y: 0 };
    // Joystick analog prioritaskan di mobile
    if (this._isTouchDevice && (Math.abs(this._joyX) > 0 || Math.abs(this._joyY) > 0)) {
      return { x: this._joyX, y: this._joyY };
    }
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
    document.getElementById('virtual-joystick')?.remove();
    document.getElementById('btn-action')?.remove();
    document.getElementById('btn-jump')?.remove();
  }
}
