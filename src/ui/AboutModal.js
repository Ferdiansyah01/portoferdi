import BaseModal from './BaseModal.js';

/**
 * AboutModal — Displays profile info.
 * @param {object} profile — from profile.json
 */
export default class AboutModal extends BaseModal {
  _renderContent(profile) {
    const socialBtns = profile.socials?.map((s) => {
      const icons = {
        github:    '🐙',
        linkedin:  '💼',
        twitter:   '🐦',
        instagram: '📸',
      };
      return `
        <a href="${s.url}" target="_blank" rel="noopener" class="social-link-btn">
          ${icons[s.icon] || '🔗'} ${s.platform}
        </a>
      `;
    }).join('') || '';

    const availableBadge = profile.available
      ? `<span style="display:inline-flex;align-items:center;gap:5px;padding:3px 10px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.4);border-radius:99px;font-size:0.7rem;color:#34d399;">
           <span style="width:6px;height:6px;border-radius:50%;background:#10b981;animation:pulse-glow 1.5s ease infinite;"></span>
           Available for opportunities
         </span>`
      : '';

    return `
      <div style="position:relative;">
        ${this._closeBtn()}

        <!-- Header -->
        <div style="
          background:linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b);
          padding:2rem;
          border-radius:12px 12px 0 0;
          display:flex; align-items:center; gap:1.5rem;
          flex-wrap:wrap;
        ">
          <!-- Avatar -->
          ${profile.avatar ? `
          <img src="${profile.avatar}" alt="${profile.name}"
            style="
              width:80px; height:80px; border-radius:50%; flex-shrink:0;
              object-fit:cover;
              border:3px solid rgba(196,181,253,0.3);
              box-shadow:0 0 24px rgba(124,58,237,0.4);
              background:#1e1b4b;
            "
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div style="
            width:80px; height:80px; border-radius:50%; flex-shrink:0;
            background:linear-gradient(135deg,#7c3aed,#06b6d4);
            display:none; align-items:center; justify-content:center;
            font-size:2.5rem;
            border:3px solid rgba(196,181,253,0.3);
            box-shadow:0 0 24px rgba(124,58,237,0.4);
          ">👨‍💻</div>
          ` : `
          <div style="
            width:80px; height:80px; border-radius:50%; flex-shrink:0;
            background:linear-gradient(135deg,#7c3aed,#06b6d4);
            display:flex; align-items:center; justify-content:center;
            font-size:2.5rem;
            border:3px solid rgba(196,181,253,0.3);
            box-shadow:0 0 24px rgba(124,58,237,0.4);
          ">👨‍💻</div>
          `}

          <div style="flex:1;min-width:200px;">
            <div style="margin-bottom:8px;">${availableBadge}</div>
            <h2 style="font-size:1.35rem;font-weight:700;color:#e2e8f0;margin:0 0 4px;">${profile.name}</h2>
            <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#a5b4fc;">${profile.role}</p>
            ${profile.location ? `<p style="font-size:0.8rem;color:#64748b;margin-top:6px;">📍 ${profile.location}</p>` : ''}
          </div>
        </div>

        <!-- Body -->
        <div style="padding:1.5rem 2rem;">
          <!-- Bio -->
          <p style="font-size:0.9rem;color:#94a3b8;line-height:1.75;margin-bottom:1.5rem;">
            ${profile.bio}
          </p>

          <!-- Social links -->
          ${socialBtns ? `
          <div style="margin-bottom:1.5rem;">
            <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#7c3aed;margin-bottom:10px;">FIND ME ON</p>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">${socialBtns}</div>
          </div>` : ''}

          <!-- Resume -->
          ${profile.resumeUrl ? `
          <a href="${profile.resumeUrl}" target="_blank" rel="noopener" class="btn-primary" style="display:inline-flex;align-items:center;gap:8px;text-decoration:none;padding:10px 24px;border-radius:8px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;font-weight:600;font-size:0.875rem;">
            📄 Download Resume
          </a>` : ''}
        </div>

        <style>
          .social-link-btn {
            display:inline-flex; align-items:center; gap:6px;
            padding:8px 14px; border-radius:8px;
            background:rgba(255,255,255,0.05); border:1px solid #2a2a4a;
            color:#94a3b8; text-decoration:none; font-size:0.8rem;
            transition:all 0.2s;
          }
          .social-link-btn:hover {
            background:rgba(124,58,237,0.15);
            border-color:rgba(124,58,237,0.4);
            color:#e2e8f0; transform:translateY(-1px);
          }
        </style>
      </div>
    `;
  }
}
