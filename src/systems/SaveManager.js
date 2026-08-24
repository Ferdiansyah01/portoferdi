/**
 * SaveManager — Persists player state to localStorage.
 */
export default class SaveManager {
  static KEYS = {
    POSITION: 'devquest_pos',
    MUTED:    'devquest_muted',
    NAME:     'devquest_name',
  };

  static savePosition(x, y) {
    localStorage.setItem(SaveManager.KEYS.POSITION, JSON.stringify({ x, y }));
  }

  static loadPosition() {
    try {
      const raw = localStorage.getItem(SaveManager.KEYS.POSITION);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  static saveMutePreference(muted) {
    localStorage.setItem(SaveManager.KEYS.MUTED, muted ? 'true' : 'false');
  }

  static loadMutePreference() {
    return localStorage.getItem(SaveManager.KEYS.MUTED) === 'true';
  }

  static saveName(name) {
    localStorage.setItem(SaveManager.KEYS.NAME, name);
  }

  static loadName() {
    return localStorage.getItem(SaveManager.KEYS.NAME) || 'Guest';
  }

  static clearAll() {
    Object.values(SaveManager.KEYS).forEach((k) => localStorage.removeItem(k));
  }
}
