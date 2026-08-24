import { PLAYER_SPEED, TILE_SIZE } from '../config/gameConfig.js';

/**
 * Player — The avatar the user controls.
 * Extends Phaser.Physics.Arcade.Sprite.
 * All input reading delegated to InputController.
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x - World x in pixels
   * @param {number} y - World y in pixels
   * @param {import('../systems/InputController.js').default} inputController
   */
  constructor(scene, x, y, inputController) {
    super(scene, x, y, 'player');

    this.scene = scene;
    this._inputCtrl = inputController;

    // Add to scene's display list and physics world
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics body
    this.setCollideWorldBounds(true);
    this.body.setSize(10, 10);       // Smaller hitbox than sprite for feel
    this.body.setOffset(3, 6);

    // Sprite display
    this.setDepth(10);

    // State
    this._facing = 'down'; // 'up' | 'down' | 'left' | 'right'
    this._isMoving = false;
    this._isJumping = false;
    this._dustTimer = 0;

    // Register animations
    this._createAnimations();
    this._createShadow();
    this._createIdleBob();
  }

  _createShadow() {
    this._shadow = this.scene.add.ellipse(this.x, this.y + 7, 12, 5, 0x000000, 0.28).setDepth(9);
  }

  _createIdleBob() {
    // Breathing effect that DOESN'T move physics body — only visual scale
    // Previously tweened `y` caused snap-back to spawn when idle resumed
    this._bobTween = this.scene.tweens.add({
      targets: this,
      scaleY: 1.02,
      scaleX: 0.985,
      duration: 900,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      paused: true,
    });
  }

  _spawnDust() {
    const d = this.scene.add.circle(this.x + Phaser.Math.Between(-4,4), this.y + 6, 1.5, 0xffffff, 0.28).setDepth(8);
    this.scene.tweens.add({
      targets: d,
      y: d.y - 4,
      alpha: 0,
      scale: 2.2,
      duration: 420,
      ease: 'Sine.easeOut',
      onComplete: () => d.destroy(),
    });
  }

  jump() {
    if (this._isJumping) return;
    this._isJumping = true;
    // pause idle bob selama lompat
    if (this._bobTween && !this._bobTween.paused) {
      this._bobTween.pause();
      this.setScale(1);
    }
    const startY = this.y;
    // visual hop — tidak ubah physics body Y permanen, cuma sprite
    this.scene.tweens.add({
      targets: this,
      y: startY - 14,
      duration: 160,
      ease: 'Quad.easeOut',
      yoyo: true,
      onComplete: () => {
        this.y = startY;
        this._isJumping = false;
        // landing dust + squash
        this._spawnDust();
        this.scene.tweens.add({
          targets: this,
          scaleY: 0.88,
          scaleX: 1.12,
          duration: 80,
          yoyo: true,
          ease: 'Quad.easeOut',
          onComplete: () => this.setScale(1),
        });
        this.scene.tweens.add({
          targets: this._shadow,
          scaleX: 1.35,
          scaleY: 0.6,
          alpha: 0.18,
          duration: 80,
          yoyo: true,
          ease: 'Quad.easeOut',
        });
      },
    });
    // shadow mengecil pas di udara
    this.scene.tweens.add({
      targets: this._shadow,
      scaleX: 0.72,
      scaleY: 0.72,
      alpha: 0.16,
      duration: 160,
      ease: 'Quad.easeOut',
    });
    // SFX
    try { this.scene.sound.play('sfx_interact', { volume: 0.35 }); } catch {}
  }

  get isJumping() { return this._isJumping; }

  _createAnimations() {
    const anims = this.scene.anims;

    // Guard — don't re-register if already done
    if (anims.exists('walk-down')) return;

    // Row 0 = down, Row 1 = left, Row 2 = right, Row 3 = up
    // Columns: 0=idle, 1=walk1, 2=walk2 → frame indices per row
    const dirs = [
      { key: 'walk-down',  start: 0 },
      { key: 'walk-left',  start: 3 },
      { key: 'walk-right', start: 6 },
      { key: 'walk-up',    start: 9 },
    ];

    dirs.forEach(({ key, start }) => {
      anims.create({
        key,
        frames: anims.generateFrameNumbers('player', {
          frames: [start, start + 1, start + 2],
        }),
        frameRate: 8,
        repeat: -1,
      });

      anims.create({
        key: key.replace('walk', 'idle'),
        frames: anims.generateFrameNumbers('player', { frames: [start] }),
        frameRate: 4,
        repeat: -1,
      });
    });
  }

  update() {
    // Keep shadow under feet
    if (this._shadow) {
      this._shadow.setPosition(this.x, this.y + 7);
      this._shadow.setAlpha(this._isMoving ? 0.22 : 0.28);
      this._shadow.setScale(this._isMoving ? 1.1 : 1);
    }

    const dir = this._inputCtrl.getDirection();
    const moving = dir.x !== 0 || dir.y !== 0;

    // Velocity
    if (moving) {
      // Normalize diagonal movement
      const len = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
      this.setVelocity(
        (dir.x / len) * PLAYER_SPEED,
        (dir.y / len) * PLAYER_SPEED,
      );

      // Determine facing direction (priority: vertical over horizontal)
      if (dir.y > 0)      this._facing = 'down';
      else if (dir.y < 0) this._facing = 'up';
      else if (dir.x < 0) this._facing = 'left';
      else if (dir.x > 0) this._facing = 'right';

    } else {
      this.setVelocity(0, 0);
    }

    // Dust trail when moving — stop bob immediately so character diem di tempat
    if (moving) {
      this._dustTimer += this.scene.game.loop.delta;
      if (this._dustTimer > 110) {
        this._dustTimer = 0;
        this._spawnDust();
      }
      if (this._bobTween?.isPaused?.() === false) {
        this._bobTween.pause();
        this.setScale(1); // reset visual so tidak ketahan di scale 1.02
      }
    } else {
      // idle bob resume — hanya scale, tidak gerakin posisi jadi tetap diem
      if (this._bobTween?.isPaused?.()) this._bobTween.resume();
    }

    // Animations
    const animKey = moving
      ? `walk-${this._facing}`
      : `idle-${this._facing}`;

    if (this.anims.currentAnim?.key !== animKey) {
      this.play(animKey);
    }

    this._isMoving = moving;
  }

  destroy(fromScene) {
    this._shadow?.destroy();
    this._bobTween?.remove();
    super.destroy(fromScene);
  }

  get facing() { return this._facing; }
  get isMoving() { return this._isMoving; }
}
