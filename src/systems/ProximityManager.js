import { INTERACT_RADIUS } from '../config/gameConfig.js';

/**
 * ProximityManager — Each update(), checks distances from the player
 * to all registered InteractiveObjects. Fires proximity-enter/exit events
 * and tracks the single nearest active object.
 */
export default class ProximityManager {
  /**
   * @param {Phaser.Scene} scene
   * @param {import('../entities/Player.js').default} player
   */
  constructor(scene, player) {
    this.scene  = scene;
    this.player = player;

    /** @type {import('../entities/InteractiveObject.js').default[]} */
    this._objects = [];
    this._nearest = null;

    this._eventEmitter = new Phaser.Events.EventEmitter();
  }

  /**
   * Register an InteractiveObject to track.
   * @param {import('../entities/InteractiveObject.js').default} obj
   */
  register(obj) {
    this._objects.push(obj);
  }

  /**
   * Call once per frame from WorldScene.update().
   */
  update() {
    if (!this.player || !this.player.active) return;

    const px = this.player.x;
    const py = this.player.y;

    let nearestDist = Infinity;
    let nearestObj  = null;

    // Find nearest within radius
    for (const obj of this._objects) {
      const dx = obj.x - px;
      const dy = obj.y - py;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= INTERACT_RADIUS && dist < nearestDist) {
        nearestDist = dist;
        nearestObj  = obj;
      }
    }

    // State transitions
    if (nearestObj !== this._nearest) {
      // Deactivate previous
      if (this._nearest) {
        this._nearest.setActive(false);
        this._eventEmitter.emit('proximity-exit', this._nearest);
      }
      // Activate new
      if (nearestObj) {
        nearestObj.setActive(true);
        this._eventEmitter.emit('proximity-enter', nearestObj);
      }
      this._nearest = nearestObj;
    }
  }

  /** @returns {import('../entities/InteractiveObject.js').default|null} */
  get nearestObject() { return this._nearest; }

  on(event, fn, context) {
    this._eventEmitter.on(event, fn, context);
    return this;
  }

  off(event, fn, context) {
    this._eventEmitter.off(event, fn, context);
    return this;
  }
}
