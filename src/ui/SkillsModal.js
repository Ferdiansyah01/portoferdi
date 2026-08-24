import BaseModal from './BaseModal.js';

/**
 * SkillsModal — Displays skills grouped by category.
 * @param {Array} skills — array from skills.json
 */
export default class SkillsModal extends BaseModal {
  _renderContent(skills) {
    const levelDot = (level) => {
      const dots = { advanced: 3, intermediate: 2, beginner: 1 };
      const count = dots[level] ?? 1;
      return Array(3).fill(0).map((_, i) =>
        `<span style="width:6px;height:6px;border-radius:50%;display:inline-block;background:${i < count ? 'currentColor' : 'rgba(148,163,184,0.25)'};"></span>`
      ).join('');
    };

    const categoryHTML = skills.map((cat) => `
      <div style="margin-bottom:1.25rem;">
        <div style="
          display:flex; align-items:center; gap:8px;
          margin-bottom:10px;
          font-family:'Press Start 2P',monospace; font-size:7px;
          color:${cat.color || '#7c3aed'};
        ">
          <span style="
            display:inline-block; width:8px; height:8px; border-radius:2px;
            background:${cat.color || '#7c3aed'};
          "></span>
          ${cat.category.toUpperCase()}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${cat.items.map((skill) => `
            <div class="skill-badge" style="position:relative;">
              <span style="font-size:14px">${skill.icon}</span>
              <span style="color:#e2e8f0;">${skill.name}</span>
              <span style="display:flex;gap:2px;margin-left:4px;color:${cat.color || '#7c3aed'};">
                ${levelDot(skill.level)}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    return `
      <div style="position:relative;">
        ${this._closeBtn()}

        <!-- Header -->
        <div style="
          background:linear-gradient(135deg,#064e3b,#065f46,#14532d);
          padding:2rem 2rem 1.5rem;
          border-radius:12px 12px 0 0;
        ">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:1.5rem">📚</span>
            <div>
              <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#6ee7b7;margin-bottom:4px;">SKILL LIBRARY</p>
              <h2 style="font-size:1.35rem;font-weight:700;color:#e2e8f0;margin:0;">Technical Skills</h2>
            </div>
          </div>
          <p style="font-size:0.85rem;color:#a7f3d0;margin-top:8px;line-height:1.5;">
            Explore my toolkit — grouped by discipline.
          </p>
        </div>

        <!-- Skill grid -->
        <div style="padding:1.5rem 2rem;">
          ${categoryHTML}

          <!-- Legend -->
          <div style="
            margin-top:1rem; padding:12px; border-radius:8px;
            background:rgba(255,255,255,0.04); border:1px solid #1e293b;
            display:flex; gap:16px; flex-wrap:wrap;
            font-size:0.75rem; color:#64748b;
          ">
            <span>● ● ● Advanced</span>
            <span>● ● ○ Intermediate</span>
            <span>● ○ ○ Beginner</span>
          </div>
        </div>
      </div>
    `;
  }
}
