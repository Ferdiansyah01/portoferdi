/**
 * BaseModal — Shared logic for all content modals.
 * Subclasses implement _renderContent(data) → HTML string.
 */
export default class BaseModal {
  constructor(data) {
    this.data     = data;
    this._el      = null;
    this._onClose = null;
  }

  open(onClose) {
    this._onClose = onClose;

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'active-modal-backdrop';

    backdrop.innerHTML = `
      <div class="modal-panel glass-card" style="padding:0;overflow:hidden;">
        ${this._renderContent(this.data)}
      </div>
    `;

    document.getElementById('modal-portal').appendChild(backdrop);
    this._el = backdrop;

    // Close on backdrop click
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.close();
    });

    // Close on Esc
    this._escHandler = (e) => {
      if (e.key === 'Escape') this.close();
    };
    document.addEventListener('keydown', this._escHandler);

    // Close button
    backdrop.querySelector('.modal-close-btn')?.addEventListener('click', () => this.close());
  }

  close() {
    if (!this._el || this._isClosing) return;
    this._isClosing = true;
    this._el.style.opacity = '0';
    this._el.style.transition = 'opacity 0.2s ease';
    setTimeout(() => {
      this._el?.remove();
      this._el = null;
    }, 200);
    document.removeEventListener('keydown', this._escHandler);
    this._onClose?.();
  }

  /** Override in subclass */
  _renderContent(data) {
    return `<div style="padding:2rem;"><p>No content</p></div>`;
  }

  _closeBtn() {
    return `
      <button class="modal-close-btn" title="Close (Esc)" style="
        position:absolute; top:1rem; right:1rem;
        background:rgba(255,255,255,0.08); border:1px solid #2a2a4a;
        border-radius:8px; width:32px; height:32px;
        color:#94a3b8; cursor:pointer; font-size:1rem;
        transition:background 0.2s, color 0.2s;
        display:flex; align-items:center; justify-content:center;
        z-index:10;
      " onmouseover="this.style.background='rgba(255,255,255,0.15)';this.style.color='#e2e8f0'"
         onmouseout="this.style.background='rgba(255,255,255,0.08)';this.style.color='#94a3b8'">
        ✕
      </button>
    `;
  }
}
