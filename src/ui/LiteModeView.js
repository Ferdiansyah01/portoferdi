import profileData  from '../data/profile.json';
import projectsData from '../data/projects.json';
import skillsData   from '../data/skills.json';
import { validateContact, sendContactMessage, showContactToast, setFieldError, clearFieldErrors } from '../utils/contactService.js';

/**
 * LiteModeView — A full scrollable DOM page built from the same JSON data
 * as the game. No Phaser loaded. Used as a lightweight fallback.
 *
 * Usage: LiteModeView.render(containerElement)
 */
const LiteModeView = {
  render(container) {
    container.innerHTML = this._buildHTML();
    this._bindEvents();
  },

  _buildHTML() {
    return `
      <style>
        /* LiteMode scoped styles */
        #lite-root {
          font-family: 'Inter', sans-serif;
          background: var(--color-bg, #0f0f1a);
          color: var(--color-text, #e2e8f0);
          min-height: 100vh;
          min-height: 100dvh;
          overscroll-behavior: auto;
          -webkit-overflow-scrolling: touch;
        }
        .lite-nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(15,15,26,0.9); backdrop-filter: blur(16px);
          border-bottom: 1px solid #1e293b;
          padding: 0 2rem;
          padding-top: env(safe-area-inset-top);
          display: flex; align-items: center; justify-content: space-between;
          height: 60px;
        }
        @media (max-width: 768px) {
          .lite-nav { padding: 0 1rem; height: 54px; }
          .lite-logo { font-size: 10px; }
          #lite-hero { min-height: auto; padding-top: 1rem; }
          .hero-name { font-size: clamp(1.8rem, 8vw, 2.5rem) !important; }
          .lite-section { padding: 2.5rem 1rem !important; }
          .projects-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .hero-actions { flex-direction: column; }
          .hero-actions a { text-align: center; justify-content: center; }
        }
        .lite-logo {
          font-family: 'Press Start 2P', monospace;
          font-size: 12px; color: #7c3aed;
          text-shadow: 0 0 10px rgba(124,58,237,0.5);
        }
        .lite-nav-links { display: flex; gap: 1.5rem; }
        .lite-nav-links a {
          color: #64748b; font-size: 0.875rem; text-decoration: none;
          transition: color 0.2s;
        }
        .lite-nav-links a:hover { color: #e2e8f0; }

        .lite-section {
          max-width: 1000px; margin: 0 auto; padding: 5rem 2rem;
        }
        .lite-section-label {
          font-family: 'Press Start 2P', monospace;
          font-size: 8px; color: #7c3aed; margin-bottom: 1rem;
          letter-spacing: 2px;
        }
        .lite-section-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 700; color: #e2e8f0; margin-bottom: 1rem;
        }

        /* Hero */
        #lite-hero {
          min-height: 100vh; display: flex; align-items: center;
          background: radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.15) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.1) 0%, transparent 60%);
        }
        .hero-available {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 99px;
          background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3);
          font-size: 0.75rem; color: #34d399; margin-bottom: 1.5rem;
        }
        .hero-available-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #10b981;
          animation: pulse-glow 1.5s ease infinite;
        }
        .hero-name { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; }
        .hero-name span { color: #7c3aed; }
        .hero-role {
          font-family: 'Press Start 2P', monospace; font-size: 11px;
          color: #64748b; margin: 1rem 0;
        }
        .hero-bio { max-width: 600px; color: #94a3b8; line-height: 1.75; font-size: 1rem; }
        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 2rem; }

        /* Projects grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem; margin-top: 2.5rem;
        }
        .project-card {
          background: #1a1a2e; border: 1px solid #1e293b; border-radius: 14px;
          overflow: hidden; transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
        }
        .project-card:hover {
          transform: translateY(-4px);
          border-color: #7c3aed;
          box-shadow: 0 8px 32px rgba(124,58,237,0.2);
        }
        .project-card-header {
          height: 160px;
          background: linear-gradient(135deg, #1e1b4b, #312e81);
          display: flex; align-items: center; justify-content: center;
          font-size: 2.5rem;
          overflow: hidden;
          position: relative;
        }
        .project-card-header img {
          width: 100%; height: 100%; object-fit: cover;
          display: block;
        }
        .project-card-body { padding: 1.25rem; }
        .project-card-title { font-size: 1rem; font-weight: 700; margin-bottom: 6px; }
        .project-card-desc { font-size: 0.8rem; color: #64748b; line-height: 1.6; margin-bottom: 12px; }
        .project-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 14px; }
        .project-links { display: flex; gap: 8px; }
        .project-link {
          flex: 1; text-align: center; padding: 7px; border-radius: 7px;
          font-size: 0.75rem; font-weight: 600; text-decoration: none;
          transition: all 0.2s;
        }
        .project-link-github {
          background: rgba(255,255,255,0.06); color: #94a3b8; border: 1px solid #1e293b;
        }
        .project-link-github:hover { background: rgba(255,255,255,0.12); color: #e2e8f0; }
        .project-link-demo {
          background: linear-gradient(135deg,#7c3aed,#6d28d9); color: #fff;
        }
        .project-link-demo:hover { opacity: 0.9; transform: translateY(-1px); }

        /* Skills */
        .skills-grid { display: flex; flex-direction: column; gap: 2rem; margin-top: 2.5rem; }
        .skill-category-title {
          display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
          font-family: 'Press Start 2P', monospace; font-size: 8px;
        }
        .skill-items { display: flex; flex-wrap: wrap; gap: 8px; }

        /* Contact section */
        #lite-contact {
          background: radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%);
        }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2.5rem; }
        @media (max-width: 640px) {
          .contact-grid { grid-template-columns: 1fr; }
          .lite-nav-links { display: none; }
        }

        /* Footer */
        .lite-footer {
          text-align: center; padding: 3rem 2rem; color: #334155;
          border-top: 1px solid #1e293b;
          font-family: 'Press Start 2P', monospace; font-size: 6px;
        }

        /* Back to game button */
        .back-to-game-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 8px; font-size: 0.8rem; font-weight: 600;
          background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.3);
          color: #a78bfa; cursor: pointer; text-decoration: none;
          transition: all 0.2s;
        }
        .back-to-game-btn:hover {
          background: rgba(124,58,237,0.2); border-color: rgba(124,58,237,0.5);
          color: #c4b5fd;
        }
      </style>

      <div id="lite-root">
        <!-- NAV -->
        <nav class="lite-nav">
          <span class="lite-logo">FD</span>
          <div class="lite-nav-links">
            <a href="#lite-about">About</a>
            <a href="#lite-projects">Projects</a>
            <a href="#lite-skills">Skills</a>
            <a href="#lite-contact">Contact</a>
          </div>
          <button id="lite-back-game-btn" class="back-to-game-btn">🎮 Play Game</button>
        </nav>

        <!-- HERO / ABOUT -->
        <section id="lite-hero">
          <div class="lite-section" id="lite-about">
            ${profileData.available ? `
            <div class="hero-available">
              <span class="hero-available-dot"></span>
              Available for opportunities
            </div>` : ''}
            <h1 class="hero-name">Hey, I'm <span>${profileData.name}</span>.</h1>
            <p class="hero-role">${profileData.role}</p>
            <p class="hero-bio">${profileData.bio}</p>
            <div class="hero-actions">
              ${profileData.resumeUrl ? `
              <a href="${profileData.resumeUrl}" target="_blank" rel="noopener"
                 style="padding:12px 28px;border-radius:8px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;font-weight:600;text-decoration:none;transition:all 0.2s;"
                 onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
                📄 View Resume
              </a>` : ''}
              <a href="#lite-contact"
                 style="padding:12px 28px;border-radius:8px;background:transparent;color:#e2e8f0;font-weight:600;text-decoration:none;border:1px solid #2a2a4a;transition:all 0.2s;"
                 onmouseover="this.style.borderColor='#7c3aed';this.style.background='rgba(124,58,237,0.08)'" onmouseout="this.style.borderColor='#2a2a4a';this.style.background='transparent'">
                Say Hello 👋
              </a>
            </div>
          </div>
        </section>

        <!-- PROJECTS -->
        <section id="lite-projects" class="lite-section" style="padding-top:6rem;">
          <p class="lite-section-label">◆ PROJECTS</p>
          <h2 class="lite-section-title">Things I've Built</h2>
          <p style="color:#64748b;max-width:560px;line-height:1.7;">
            A selection of projects I'm proud of. Each one taught me something new.
          </p>
          <div class="projects-grid">
            ${projectsData.map((p, i) => `
              <article class="project-card">
                <div class="project-card-header">
                  ${p.thumbnail ? `
                    <img src="${p.thumbnail}" alt="${p.title} thumbnail" loading="lazy"
                      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    />
                    <span style="display:none; font-size:2.5rem;">${ ['🛒','🤖','🎮','🚀','💡','📊'][i % 6] }</span>
                  ` : `${ ['🛒','🤖','🎮','🚀','💡','📊'][i % 6] }`
                  }
                </div>
                <div class="project-card-body">
                  <h3 class="project-card-title">${p.title}</h3>
                  <p class="project-card-desc">${p.shortDescription}</p>
                  <div class="project-chips">
                    ${p.techStack.slice(0, 4).map((t) => `<span class="tech-chip">${t}</span>`).join('')}
                  </div>
                  <div class="project-links">
                    ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noopener" class="project-link project-link-github">GitHub</a>` : ''}
                    ${p.demoUrl   ? `<a href="${p.demoUrl}"   target="_blank" rel="noopener" class="project-link project-link-demo">Live Demo</a>` : ''}
                  </div>
                </div>
              </article>
            `).join('')}
          </div>
        </section>

        <!-- SKILLS -->
        <section id="lite-skills" class="lite-section">
          <p class="lite-section-label">◆ SKILLS</p>
          <h2 class="lite-section-title">My Toolkit</h2>
          <div class="skills-grid">
            ${skillsData.map((cat) => `
              <div>
                <div class="skill-category-title" style="color:${cat.color};">
                  <span style="width:8px;height:8px;border-radius:2px;background:${cat.color};display:inline-block;"></span>
                  ${cat.category}
                </div>
                <div class="skill-items">
                  ${cat.items.map((s) => `
                    <span class="skill-badge">
                      <span>${s.icon}</span>
                      <span>${s.name}</span>
                    </span>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- CONTACT -->
        <section id="lite-contact" class="lite-section">
          <p class="lite-section-label">◆ CONTACT</p>
          <h2 class="lite-section-title">Let's Work Together</h2>
          <p style="color:#64748b;max-width:520px;line-height:1.7;margin-bottom:0.5rem;">
            Whether you have a project in mind, a question, or just want to say hi — my inbox is always open.
          </p>
          <div class="contact-grid">
            <!-- Direct links -->
            <div style="display:flex;flex-direction:column;gap:12px;">
              <div style="
                padding:16px; border-radius:12px;
                background:#1a1a2e; border:1px solid #1e293b;
              ">
                <p style="font-family:'Press Start 2P',monospace;font-size:6px;color:#fbbf24;margin-bottom:6px;">EMAIL</p>
                <p style="color:#e2e8f0;font-weight:500;">${profileData.email}</p>
                <button id="lite-copy-email" style="
                  margin-top:10px; padding:8px 16px; border-radius:7px;
                  background:rgba(251,191,36,0.1); border:1px solid rgba(251,191,36,0.3);
                  color:#fbbf24; font-size:0.8rem; cursor:pointer; font-family:'Inter',sans-serif;
                  display:inline-flex; align-items:center; gap:6px;
                ">📋 Copy Email</button>
              </div>

              ${profileData.socials.map((s) => `
                <a href="${s.url}" target="_blank" rel="noopener" style="
                  padding:14px 16px; border-radius:12px;
                  background:#1a1a2e; border:1px solid #1e293b;
                  color:#94a3b8; text-decoration:none; font-size:0.875rem;
                  display:flex; align-items:center; gap:10px;
                  transition:all 0.2s;
                " onmouseover="this.style.borderColor='#7c3aed';this.style.color='#e2e8f0'"
                   onmouseout="this.style.borderColor='#1e293b';this.style.color='#94a3b8'">
                   ${s.platform === 'GitHub' ? '🐙' : s.platform === 'LinkedIn' ? '💼' : s.platform === 'Instagram' ? '📸' : '🐦'}
                  ${s.platform}
                </a>
              `).join('')}
            </div>

            <!-- Message form -->
            <div style="background:#1a1a2e;border:1px solid #1e293b;border-radius:12px;padding:1.5rem;">
              <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#7c3aed;margin-bottom:1rem;">SEND A MESSAGE</p>
              <input id="lite-contact-name" type="text" placeholder="Your name" maxlength="40" style="
                width:100%;padding:10px 12px;border-radius:8px;margin-bottom:8px;
                background:#0f172a;border:1px solid #1e293b;color:#e2e8f0;
                font-family:'Inter',sans-serif;font-size:0.85rem;outline:none;box-sizing:border-box;
              " onfocus="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#7c3aed'" onblur="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#1e293b'" />
              <input id="lite-contact-email" type="email" placeholder="your@email.com" maxlength="80" style="
                width:100%;padding:10px 12px;border-radius:8px;margin-bottom:8px;
                background:#0f172a;border:1px solid #1e293b;color:#e2e8f0;
                font-family:'Inter',sans-serif;font-size:0.85rem;outline:none;box-sizing:border-box;
              " onfocus="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#7c3aed'" onblur="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#1e293b'" />
              <textarea id="lite-contact-msg" rows="4" placeholder="Your message... (min 10 chars)" maxlength="500" style="
                width:100%;padding:10px 12px;border-radius:8px;margin-bottom:4px;
                background:#0f172a;border:1px solid #1e293b;color:#e2e8f0;
                font-family:'Inter',sans-serif;font-size:0.85rem;outline:none;resize:vertical;box-sizing:border-box;
              " onfocus="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#7c3aed'" onblur="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#1e293b'"></textarea>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <span id="lite-char-count" style="font-size:0.7rem;color:#475569;">0 / 500</span>
                <span id="lite-status" style="font-size:0.7rem;color:#94a3b8;"></span>
              </div>
              <button id="lite-send-btn" style="
                width:100%;padding:12px;border-radius:8px;
                background:linear-gradient(135deg,#7c3aed,#6d28d9);
                color:#fff;font-weight:600;border:none;cursor:pointer;
                font-family:'Inter',sans-serif;font-size:0.875rem;transition:opacity 0.2s;
                display:flex;align-items:center;justify-content:center;gap:8px;
              " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                <span id="lite-send-label">Send Message 🚀</span>
              </button>
              <p style="font-size:0.68rem;color:#475569;margin-top:8px;text-align:center;line-height:1.4;">
                ✉️ Direct to <b style="color:#94a3b8">${profileData.email}</b> via FormSubmit — no backend needed.
              </p>
            </div>
          </div>
        </section>

        <!-- FOOTER -->
        <footer class="lite-footer">
          <div style="display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:8px;">
            <button id="lite-bgm-toggle" style="padding:6px 12px;border-radius:99px;background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.3);color:#a78bfa;font-size:0.7rem;cursor:pointer;">🔊 BGM: ON</button>
            <input id="lite-bgm-vol" type="range" min="0" max="100" value="30" style="width:120px;accent-color:#7c3aed;" />
          </div>
          Made with ♥ by ${profileData.name} &bull; Ferdi Developer
        </footer>
        <audio id="lite-bgm" src="/assets/audio/bgm/world.wav" loop preload="auto" style="display:none"></audio>
      </div>
    `;
  },

  _bindEvents() {
    // bersihkan sisa HUD game biar tidak overlay di mobile lite
    document.getElementById('hud')?.remove();
    document.getElementById('virtual-dpad')?.remove();
    document.getElementById('btn-action')?.remove();
    document.getElementById('btn-jump')?.remove();
    document.getElementById('interaction-indicator')?.classList.add('hidden');
    // pause Phaser biar hemat baterai di mobile
    try { window.__devquest?.scene?.pause('MainMenuScene'); } catch {}
    try { window.__devquest?.scene?.pause('WorldScene'); } catch {}
    try { window.__devquest?.scene?.pause('UIScene'); } catch {}

    // FIX: Phaser InputController captures WASD+E+Space + touch — disable di lite mode
    // biar Send a Message bisa ketik & scroll touchpad/mouse pad lancar
    try {
      const game = window.__devquest;
      if (game?.input) {
        if (game.input.keyboard) game.input.keyboard.enabled = false;
        if (game.input.mouse) game.input.mouse.enabled = false;
        if (game.input.touch) game.input.touch.enabled = false;
      }
      game?.scene?.scenes?.forEach(s => {
        if (s.input?.keyboard) s.input.keyboard.enabled = false;
        if (s.input?.mouse) s.input.mouse.enabled = false;
        if (s.input?.touch) s.input.touch.enabled = false;
      });
      // paksa browser boleh scroll
      document.documentElement.style.overscrollBehavior = 'auto';
      document.body.style.overscrollBehavior = 'auto';
      document.documentElement.style.touchAction = 'auto';
      document.body.style.touchAction = 'auto';
    } catch {}
    // stopPropagation biar Phaser tidak preventDefault saat ngetik
    const stopCapture = (el) => {
      if (!el) return;
      ['keydown','keyup','keypress'].forEach(evt => {
        el.addEventListener(evt, (e) => e.stopPropagation());
      });
    };
    stopCapture(document.getElementById('lite-contact-name'));
    stopCapture(document.getElementById('lite-contact-email'));
    stopCapture(document.getElementById('lite-contact-msg'));
    // juga untuk hero name input jika ada
    stopCapture(document.getElementById('player-name-input'));

    // Lite BGM — cozy lo-fi world theme (118 BPM) via HTMLAudio
    const liteAudio = document.getElementById('lite-bgm');
    const liteToggle = document.getElementById('lite-bgm-toggle');
    const liteVol = document.getElementById('lite-bgm-vol');
    if (liteAudio) {
      const muted = localStorage.getItem('devquest_muted') === 'true';
      liteAudio.volume = (liteVol?.value || 30) / 100;
      liteAudio.muted = muted;
      if (liteToggle) liteToggle.textContent = muted ? '🔇 BGM: OFF' : '🔊 BGM: ON';
      // Autoplay try after gesture
      const tryPlay = () => {
        if (localStorage.getItem('devquest_muted') === 'true') return;
        liteAudio.play().catch(()=>{});
      };
      // delay a bit then try
      setTimeout(tryPlay, 800);
      // unlock on first click
      window.addEventListener('click', tryPlay, { once:true });
      liteToggle?.addEventListener('click', () => {
        liteAudio.muted = !liteAudio.muted;
        localStorage.setItem('devquest_muted', liteAudio.muted);
        liteToggle.textContent = liteAudio.muted ? '🔇 BGM: OFF' : '🔊 BGM: ON';
        if (!liteAudio.muted) liteAudio.play().catch(()=>{});
      });
      liteVol?.addEventListener('input', (e) => {
        liteAudio.volume = e.target.value / 100;
        if (liteAudio.muted && liteAudio.volume>0) {
          liteAudio.muted=false;
          localStorage.setItem('devquest_muted','false');
          liteToggle.textContent='🔊 BGM: ON';
        }
      });
    }

    // Back to game
    document.getElementById('lite-back-game-btn')?.addEventListener('click', () => {
      document.body.classList.remove('lite-mode');
      document.documentElement.classList.remove('lite-mode');
      document.body.style.overflow = 'hidden';
      try{ document.getElementById('lite-bgm')?.pause(); }catch{}
      // Reload to re-initialize game cleanly
      window.location.reload();
    });

    // Copy email (lite mode) — same UX as game modal
    document.getElementById('lite-copy-email')?.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(profileData.email);
        this.textContent = '✅ Copied!';
        this.style.background='rgba(16,185,129,0.2)'; this.style.borderColor='rgba(16,185,129,0.5)'; this.style.color='#34d399';
        showContactToast('Email copied! 📋','#10b981');
        setTimeout(() => { this.innerHTML = '📋 Copy Email'; this.style.background='rgba(251,191,36,0.1)'; this.style.borderColor='rgba(251,191,36,0.3)'; this.style.color='#fbbf24'; }, 2000);
      } catch {
        const ta=document.createElement('textarea'); ta.value=profileData.email; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
        showContactToast('Email copied! 📋','#10b981');
      }
    });

    // Send message — now actually working (shared service with Game modal)
    const liteMsgEl = document.getElementById('lite-contact-msg');
    const liteCharCount = document.getElementById('lite-char-count');
    if (liteMsgEl && liteCharCount) {
      liteMsgEl.addEventListener('input', () => {
        liteCharCount.textContent = `${liteMsgEl.value.length} / 500`;
        liteCharCount.style.color = liteMsgEl.value.length > 450 ? '#f59e0b' : '#475569';
      });
    }
    document.getElementById('lite-send-btn')?.addEventListener('click', async () => {
      const name    = document.getElementById('lite-contact-name')?.value || '';
      const email   = document.getElementById('lite-contact-email')?.value || '';
      const message = document.getElementById('lite-contact-msg')?.value || '';
      const btn = document.getElementById('lite-send-btn');
      const label = document.getElementById('lite-send-label');
      const status = document.getElementById('lite-status');

      clearFieldErrors(['lite-contact-name','lite-contact-email','lite-contact-msg']);
      const { valid, errors } = validateContact({ name, email, message });
      if (!valid) {
        if (errors.name) setFieldError(document.getElementById('lite-contact-name'), errors.name);
        if (errors.email) setFieldError(document.getElementById('lite-contact-email'), errors.email);
        if (errors.message) setFieldError(liteMsgEl, errors.message);
        showContactToast(errors.name || errors.email || errors.message, '#ef4444');
        return;
      }

      btn.disabled = true; btn.style.opacity='0.7'; btn.style.cursor='not-allowed';
      if (label) label.textContent='Sending... ⏳';
      if (status) status.textContent='Sending...';

      const result = await sendContactMessage({ name, email, message });

      btn.disabled=false; btn.style.opacity='1'; btn.style.cursor='pointer';
      if (result.ok) {
        if (result.via==='ajax') {
          showContactToast('Message sent! I\'ll reply soon ✨','#10b981');
          if (status){status.textContent='✅ Sent! Check dianferdi01@gmail.com'; status.style.color='#10b981';}
        } else {
          showContactToast('Opening email app — message ready ✉️','#0ea5e9');
          if (status){status.textContent='📧 Email app opened'; status.style.color='#0ea5e9';}
        }
        document.getElementById('lite-contact-name').value='';
        document.getElementById('lite-contact-email').value='';
        liteMsgEl.value=''; if (liteCharCount) liteCharCount.textContent='0 / 500';
        if (label) label.textContent='Sent! ✅';
        setTimeout(()=>{ if(label) label.textContent='Send Message 🚀'; if(status) status.textContent=''; },3000);
      } else {
        showContactToast('Failed, but saved locally. Try again ✨','#f59e0b');
        if (status){status.textContent='⚠️ Saved locally'; status.style.color='#f59e0b';}
        if (label) label.textContent='Send Message 🚀';
      }
    });
  },
};

export default LiteModeView;
