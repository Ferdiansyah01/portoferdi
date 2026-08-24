/**
 * AudioManager — Centralized BGM & SFX controller for DevQuest.
 * Works with Phaser SoundManager + graceful fallback to HTMLAudio.
 * Handles: autoplay policy, mute persistence, crossfade.
 */
export default class AudioManager {
  static _bgm = null;
  static _muted = localStorage.getItem('devquest_muted') === 'true';
  static _scene = null;
  static _volume = 0.4;

  static init(scene) {
    this._scene = scene;
    this._muted = localStorage.getItem('devquest_muted') === 'true';
  }

  static isMuted() { return this._muted; }

  static setMuted(muted) {
    this._muted = muted;
    localStorage.setItem('devquest_muted', muted);
    if (this._scene?.sound) this._scene.sound.mute = muted;
    if (this._bgm) {
      if (muted) {
        try { this._bgm.pause(); } catch {}
      } else {
        // resume or start playing if was blocked by mute
        try {
          if (!this._bgm.isPlaying) {
            // try resume context then play
            const ctx = this._scene?.sound?.context;
            if (ctx && ctx.state === 'suspended') ctx.resume();
            this._bgm.play();
            if (this._scene) this._scene.tweens.add({ targets: this._bgm, volume: this._volume, duration: 500 });
          } else {
            this._bgm.resume();
          }
        } catch(e){ console.warn('[AudioManager] resume failed', e); }
      }
    } else if (!muted && this._scene) {
      // no bgm yet but unmuted — try to start current scene's bgm via fallback
      // MainMenu will handle via its mute button, WorldScene via its own
    }
  }

  static toggle() {
    this.setMuted(!this._muted);
    return this._muted;
  }

  /**
   * Play BGM with crossfade, loop, respects mute & autoplay.
   * Call after user gesture.
   */
  static playBGM(scene, key, { volume = 0.4, loop = true } = {}) {
    this._scene = scene;
    this._volume = volume;
    if (!scene?.sound || !scene.cache?.audio?.exists(key)) {
      console.warn(`[AudioManager] Audio not loaded: ${key}`);
      return;
    }
    // stop previous with fade out
    if (this._bgm && this._bgm.key !== key) {
      const old = this._bgm;
      scene.tweens.add({
        targets: old,
        volume: 0,
        duration: 600,
        onComplete: () => { try{ old.stop(); old.destroy(); } catch{} }
      });
    } else if (this._bgm) {
      try{ this._bgm.stop(); } catch{}
    }

    const bgm = scene.sound.add(key, { loop, volume: 0 });
    this._bgm = bgm;

    if (this._muted) {
      scene.sound.mute = true;
      // keep reference so unmute can resume — don't play now
      return;
    }
    scene.sound.mute = false;

    // try play, if locked wait for unlock (autoplay policy)
    const tryPlay = () => {
      if (this._muted) return;
      // Phaser locks WebAudio until first user gesture
      if (scene.sound.locked) {
        // wait for Phaser's unlock event
        scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
          if (this._muted) return;
          try { bgm.play(); } catch(e){ console.warn('[AudioManager] play failed', e); }
          scene.tweens.add({ targets: bgm, volume, duration: 800 });
        });
        // try to unlock context explicitly
        try { scene.sound.unlock(); } catch {}
        return;
      }
      // ensure AudioContext resumed (Chrome suspends)
      try {
        const ctx = scene.sound.context;
        if (ctx && ctx.state === 'suspended') ctx.resume();
      } catch {}
      if (!bgm.isPlaying) {
        try { bgm.play(); } catch(e){ console.warn('[AudioManager] play failed', e); }
      }
      scene.tweens.add({ targets: bgm, volume, duration: 800 });
    };
    tryPlay();

    // also ensure resume on first user interaction if blocked
    const unlock = () => {
      try {
        const ctx = scene.sound.context;
        if (ctx && ctx.state === 'suspended') ctx.resume();
        if (scene.sound.locked) scene.sound.unlock();
      } catch {}
      if (!this._muted && !bgm.isPlaying) tryPlay();
    };
    // use once + also listen for any click/key/touch
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
  }

  static playSFX(scene, key, { volume = 0.6 } = {}) {
    if (this._muted) return;
    if (!scene?.sound || !scene.cache?.audio?.exists(key)) return;
    try { scene.sound.play(key, { volume }); } catch {}
  }

  static stopBGM(fade = 600) {
    if (!this._bgm) return;
    // if scene is shutting down tweens will be killed, so stop immediately
    const sceneActive = this._scene && this._scene.scene && this._scene.scene.isActive(this._scene.scene.key);
    if (fade > 0 && this._scene && sceneActive && this._scene.tweens) {
      try {
        this._scene.tweens.add({
          targets: this._bgm,
          volume: 0,
          duration: fade,
          onComplete: () => { try{ this._bgm.stop(); this._bgm.destroy(); } catch{}; this._bgm = null; }
        });
        return;
      } catch {}
    }
    // immediate stop fallback — prevents world track kebawa ke menu & double di lite
    try{ this._bgm.stop(); } catch{}
    try{ this._bgm.destroy(); } catch{}
    this._bgm = null;
    // also ensure global sound not still playing
    try { this._scene?.sound?.stopAll(); } catch {}
  }

  // hard stop all — call before scene transition to avoid 2 sounds
  static stopAllImmediate() {
    try { this._scene?.sound?.stopAll(); } catch {}
    if (this._bgm) { try{ this._bgm.stop(); this._bgm.destroy(); } catch{} }
    this._bgm = null;
  }
}
