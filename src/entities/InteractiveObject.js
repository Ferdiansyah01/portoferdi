/**
 * InteractiveObject — Represents a point of interest in the world.
 * Wraps a Phaser visual indicator and carries metadata for modal rendering.
 */
export default class InteractiveObject {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x - World x (tile center * tileSize)
   * @param {number} y - World y
   * @param {object} config
   * @param {string} config.id       - mapObjectId matching JSON data
   * @param {string} config.type     - 'project' | 'skills' | 'about' | 'contact'
   * @param {string} config.label    - Display name
   * @param {any}    config.data     - Parsed JSON data to pass to modal
   */
  constructor(scene, x, y, { id, type, label, data }) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.id = id;
    this.type = type;
    this.label = label;
    this.data = data;

    this._active = false;
    this._gfx = null;
    this._pulseTimer = null;

    this._createVisual();
  }

  _createVisual() {
    const typeColors = {
      project: 0x06b6d4,
      skills:  0x10b981,
      about:   0x7c3aed,
      contact: 0xf59e0b,
      exit:    0xf59e0b,
    };
    const color = typeColors[this.type] || 0x7c3aed;

    // Shadow ellipse under object
    const shadow = this.scene.add.ellipse(this.x, this.y + 10, 14, 6, 0x000000, 0.22).setDepth(4);

    // Outer ring
    const ring = this.scene.add.circle(this.x, this.y, 14, color, 0).setDepth(5).setStrokeStyle(1.5, color, 0.5);

    // Glow circle behind object (color per type)
    const glow = this.scene.add.circle(this.x, this.y, 12, color, 0.22).setDepth(5).setBlendMode(Phaser.BlendModes.ADD);

    // Icon based on type
    const icons = {
      project: '🖥️',
      skills:  '📚',
      about:   '👤',
      contact: '📬',
      exit:    '🚪',
    };
    const iconText = this.scene.add.text(this.x, this.y, icons[this.type] || '❓', {
      fontSize: '16px',
      resolution: 2,
    }).setOrigin(0.5).setDepth(6);

    // Bobbing icon
    this.scene.tweens.add({
      targets: iconText,
      y: this.y - 4,
      duration: 1200 + Math.random()*500,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    // Pulse glow
    this.scene.tweens.add({
      targets: glow,
      alpha: { from: 0.22, to: 0.48 },
      scale: { from: 1, to: 1.35 },
      duration: 900 + Math.random()*300,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    // Ring pulse
    this.scene.tweens.add({
      targets: ring,
      scale: { from: 1, to: 1.45 },
      alpha: { from: 0.5, to: 0 },
      duration: 1400,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Sparkles for non-project (extra wow)
    const sparkles = [];
    for (let i = 0; i < 2; i++) {
      const s = this.scene.add.circle(this.x + Phaser.Math.Between(-8,8), this.y + Phaser.Math.Between(-8,8), 1, 0xffffff, 0.85).setDepth(7).setBlendMode(Phaser.BlendModes.ADD);
      this.scene.tweens.add({
        targets: s,
        y: s.y - 10,
        alpha: 0,
        scale: 1.8,
        duration: 1300 + i*400,
        repeat: -1,
        delay: i*600 + Math.random()*800,
        ease: 'Sine.easeInOut',
      });
      sparkles.push(s);
    }

    this._shadow = shadow;
    this._ring = ring;
    this._glow = glow;
    this._icon = iconText;
    this._sparkles = sparkles;
    this._color = color;
  }

  /** Called by ProximityManager each frame */
  setActive(active) {
    if (this._active === active) return;
    this._active = active;

    // Highlight when in range — scale + bright + shadow
    this.scene.tweens.add({
      targets: [this._glow, this._ring],
      alpha: active ? 0.85 : 0.22,
      scale: active ? 1.25 : 1,
      duration: 220,
      ease: 'Back.easeOut',
    });
    this.scene.tweens.add({
      targets: this._icon,
      scale: active ? 1.18 : 1,
      duration: 200,
      ease: 'Back.easeOut',
    });
    this.scene.tweens.add({
      targets: this._shadow,
      alpha: active ? 0.35 : 0.22,
      scaleX: active ? 1.2 : 1,
      duration: 200,
    });
    // Sparkle burst on enter
    if (active) {
      this._sparkles.forEach(s => {
        s.setPosition(this.x + Phaser.Math.Between(-6,6), this.y);
        s.setAlpha(1).setScale(0.2);
        this.scene.tweens.add({
          targets: s,
          y: s.y - 14,
          alpha: 0,
          scale: 2,
          duration: 500,
          ease: 'Sine.easeOut',
        });
      });
      // subtle camera nudge
      this.scene.cameras.main.shake(80, 0.002);
    }
  }

  get isActive() { return this._active; }

  destroy() {
    this._shadow?.destroy();
    this._ring?.destroy();
    this._glow?.destroy();
    this._icon?.destroy();
    this._sparkles?.forEach(s => s.destroy());
  }
}
