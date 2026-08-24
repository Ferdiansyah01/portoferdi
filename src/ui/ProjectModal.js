import BaseModal from './BaseModal.js';

/**
 * ProjectModal — Displays a single project's details.
 * @param {object} project — entry from projects.json
 */
export default class ProjectModal extends BaseModal {
  _renderContent(proj) {
    const chips = proj.techStack
      .map((t) => `<span class="tech-chip">${t}</span>`)
      .join('');

    const githubBtn = proj.githubUrl
      ? `<a href="${proj.githubUrl}" target="_blank" rel="noopener" class="modal-action-btn modal-btn-github">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
           GitHub
         </a>`
      : '';

    const demoBtn = proj.demoUrl
      ? `<a href="${proj.demoUrl}" target="_blank" rel="noopener" class="modal-action-btn modal-btn-demo">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
           Live Demo
         </a>`
      : '';

    return `
      <div style="position:relative;">
        ${this._closeBtn()}

        <!-- Header gradient band -->
        <div style="
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%);
          padding: 2rem 2rem 1.5rem;
          border-radius: 12px 12px 0 0;
        ">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
            <span style="font-size:1.5rem">🖥️</span>
            <div>
              <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#a5b4fc;margin-bottom:4px;">${proj.year || ''}</p>
              <h2 style="font-size:1.35rem;font-weight:700;color:#e2e8f0;margin:0;">${proj.title}</h2>
            </div>
          </div>
          <p style="font-size:0.9rem;color:#cbd5e1;line-height:1.5;">${proj.shortDescription}</p>
        </div>

        <!-- Thumbnail (if available) -->
        ${proj.thumbnail ? `
        <div style="height:180px; overflow:hidden; background:#0f172a; border-bottom:1px solid #1e293b;">
          <img src="${proj.thumbnail}" alt="${proj.title}" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;display:block;"
            onerror="if(this.src.endsWith('.webp')){this.src=this.src.replace('.webp','.png')}else{this.style.display='none'; this.parentElement.innerHTML='<div style=\\'height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;background:linear-gradient(135deg,#1e1b4b,#312e81)\\'>🖥️</div>'}"
          />
        </div>` : ''}

        <!-- Body -->
        <div style="padding:1.5rem 2rem;">
          <!-- Full description -->
          <p style="font-size:0.875rem;color:#94a3b8;line-height:1.75;margin-bottom:1.5rem;">
            ${proj.fullDescription}
          </p>

          <!-- Tech stack -->
          <div style="margin-bottom:1.5rem;">
            <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#7c3aed;margin-bottom:10px;">TECH STACK</p>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">${chips}</div>
          </div>

          <!-- Action buttons -->
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            ${githubBtn}
            ${demoBtn}
          </div>
        </div>

        <style>
          .modal-action-btn {
            display:inline-flex; align-items:center; gap:8px;
            padding:10px 20px; border-radius:8px;
            font-family:'Inter',sans-serif; font-weight:600; font-size:0.85rem;
            text-decoration:none; transition:all 0.2s;
          }
          .modal-btn-github {
            background:#1e293b; color:#e2e8f0;
            border:1px solid #334155;
          }
          .modal-btn-github:hover { background:#334155; transform:translateY(-2px); }
          .modal-btn-demo {
            background:linear-gradient(135deg,#7c3aed,#6d28d9);
            color:#fff; border:none;
            box-shadow:0 4px 16px rgba(124,58,237,0.35);
          }
          .modal-btn-demo:hover { transform:translateY(-2px); box-shadow:0 6px 24px rgba(124,58,237,0.5); }
        </style>
      </div>
    `;
  }
}
