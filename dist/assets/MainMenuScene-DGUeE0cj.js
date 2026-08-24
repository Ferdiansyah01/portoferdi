import{P as u}from"./phaser-DGZayPUC.js";import{SCENE_KEYS as y}from"./gameConfig-D5w6vaLC.js";import{p as d,s as f,c as k,v as E,a as h,b as w}from"./index-C_-2Pg1M.js";import{p as I,s as B,A as l}from"./AudioManager-CmC_a3V4.js";const _={render(n){n.innerHTML=this._buildHTML(),this._bindEvents()},_buildHTML(){return`
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
            ${d.available?`
            <div class="hero-available">
              <span class="hero-available-dot"></span>
              Available for opportunities
            </div>`:""}
            <h1 class="hero-name">Hey, I'm <span>${d.name}</span>.</h1>
            <p class="hero-role">${d.role}</p>
            <p class="hero-bio">${d.bio}</p>
            <div class="hero-actions">
              ${d.resumeUrl?`
              <a href="${d.resumeUrl}" target="_blank" rel="noopener"
                 style="padding:12px 28px;border-radius:8px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;font-weight:600;text-decoration:none;transition:all 0.2s;"
                 onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
                📄 View Resume
              </a>`:""}
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
            ${I.map((n,e)=>`
              <article class="project-card">
                <div class="project-card-header">
                  ${n.thumbnail?`
                    <img src="${n.thumbnail}" alt="${n.title} thumbnail" loading="lazy"
                      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    />
                    <span style="display:none; font-size:2.5rem;">${["🛒","🤖","🎮","🚀","💡","📊"][e%6]}</span>
                  `:`${["🛒","🤖","🎮","🚀","💡","📊"][e%6]}`}
                </div>
                <div class="project-card-body">
                  <h3 class="project-card-title">${n.title}</h3>
                  <p class="project-card-desc">${n.shortDescription}</p>
                  <div class="project-chips">
                    ${n.techStack.slice(0,4).map(o=>`<span class="tech-chip">${o}</span>`).join("")}
                  </div>
                  <div class="project-links">
                    ${n.githubUrl?`<a href="${n.githubUrl}" target="_blank" rel="noopener" class="project-link project-link-github">GitHub</a>`:""}
                    ${n.demoUrl?`<a href="${n.demoUrl}"   target="_blank" rel="noopener" class="project-link project-link-demo">Live Demo</a>`:""}
                  </div>
                </div>
              </article>
            `).join("")}
          </div>
        </section>

        <!-- SKILLS -->
        <section id="lite-skills" class="lite-section">
          <p class="lite-section-label">◆ SKILLS</p>
          <h2 class="lite-section-title">My Toolkit</h2>
          <div class="skills-grid">
            ${B.map(n=>`
              <div>
                <div class="skill-category-title" style="color:${n.color};">
                  <span style="width:8px;height:8px;border-radius:2px;background:${n.color};display:inline-block;"></span>
                  ${n.category}
                </div>
                <div class="skill-items">
                  ${n.items.map(e=>`
                    <span class="skill-badge">
                      <span>${e.icon}</span>
                      <span>${e.name}</span>
                    </span>
                  `).join("")}
                </div>
              </div>
            `).join("")}
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
                <p style="color:#e2e8f0;font-weight:500;">${d.email}</p>
                <button id="lite-copy-email" style="
                  margin-top:10px; padding:8px 16px; border-radius:7px;
                  background:rgba(251,191,36,0.1); border:1px solid rgba(251,191,36,0.3);
                  color:#fbbf24; font-size:0.8rem; cursor:pointer; font-family:'Inter',sans-serif;
                  display:inline-flex; align-items:center; gap:6px;
                ">📋 Copy Email</button>
              </div>

              ${d.socials.map(n=>`
                <a href="${n.url}" target="_blank" rel="noopener" style="
                  padding:14px 16px; border-radius:12px;
                  background:#1a1a2e; border:1px solid #1e293b;
                  color:#94a3b8; text-decoration:none; font-size:0.875rem;
                  display:flex; align-items:center; gap:10px;
                  transition:all 0.2s;
                " onmouseover="this.style.borderColor='#7c3aed';this.style.color='#e2e8f0'"
                   onmouseout="this.style.borderColor='#1e293b';this.style.color='#94a3b8'">
                   ${n.platform==="GitHub"?"🐙":n.platform==="LinkedIn"?"💼":n.platform==="Instagram"?"📸":"🐦"}
                  ${n.platform}
                </a>
              `).join("")}
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
                ✉️ Direct to <b style="color:#94a3b8">${d.email}</b> via FormSubmit — no backend needed.
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
          Made with ♥ by ${d.name} &bull; Ferdi Developer
        </footer>
        <audio id="lite-bgm" src="/assets/audio/bgm/world.wav" loop preload="auto" style="display:none"></audio>
      </div>
    `},_bindEvents(){document.getElementById("hud")?.remove(),document.getElementById("virtual-dpad")?.remove(),document.getElementById("btn-action")?.remove(),document.getElementById("btn-jump")?.remove(),document.getElementById("interaction-indicator")?.classList.add("hidden");try{window.__devquest?.scene?.pause("MainMenuScene")}catch{}try{window.__devquest?.scene?.pause("WorldScene")}catch{}try{window.__devquest?.scene?.pause("UIScene")}catch{}try{const t=window.__devquest;t?.input&&(t.input.keyboard&&(t.input.keyboard.enabled=!1),t.input.mouse&&(t.input.mouse.enabled=!1),t.input.touch&&(t.input.touch.enabled=!1)),t?.scene?.scenes?.forEach(i=>{i.input?.keyboard&&(i.input.keyboard.enabled=!1),i.input?.mouse&&(i.input.mouse.enabled=!1),i.input?.touch&&(i.input.touch.enabled=!1)}),document.documentElement.style.overscrollBehavior="auto",document.body.style.overscrollBehavior="auto",document.documentElement.style.touchAction="auto",document.body.style.touchAction="auto"}catch{}const n=t=>{t&&["keydown","keyup","keypress"].forEach(i=>{t.addEventListener(i,a=>a.stopPropagation())})};n(document.getElementById("lite-contact-name")),n(document.getElementById("lite-contact-email")),n(document.getElementById("lite-contact-msg")),n(document.getElementById("player-name-input"));const e=document.getElementById("lite-bgm"),o=document.getElementById("lite-bgm-toggle"),c=document.getElementById("lite-bgm-vol");if(e){const t=localStorage.getItem("devquest_muted")==="true";e.volume=(c?.value||30)/100,e.muted=t,o&&(o.textContent=t?"🔇 BGM: OFF":"🔊 BGM: ON");const i=()=>{localStorage.getItem("devquest_muted")!=="true"&&e.play().catch(()=>{})};setTimeout(i,800),window.addEventListener("click",i,{once:!0}),o?.addEventListener("click",()=>{e.muted=!e.muted,localStorage.setItem("devquest_muted",e.muted),o.textContent=e.muted?"🔇 BGM: OFF":"🔊 BGM: ON",e.muted||e.play().catch(()=>{})}),c?.addEventListener("input",a=>{e.volume=a.target.value/100,e.muted&&e.volume>0&&(e.muted=!1,localStorage.setItem("devquest_muted","false"),o.textContent="🔊 BGM: ON")})}document.getElementById("lite-back-game-btn")?.addEventListener("click",()=>{document.body.classList.remove("lite-mode"),document.documentElement.classList.remove("lite-mode"),document.body.style.overflow="hidden";try{document.getElementById("lite-bgm")?.pause()}catch{}window.location.reload()}),document.getElementById("lite-copy-email")?.addEventListener("click",async function(){try{await navigator.clipboard.writeText(d.email),this.textContent="✅ Copied!",this.style.background="rgba(16,185,129,0.2)",this.style.borderColor="rgba(16,185,129,0.5)",this.style.color="#34d399",f("Email copied! 📋","#10b981"),setTimeout(()=>{this.innerHTML="📋 Copy Email",this.style.background="rgba(251,191,36,0.1)",this.style.borderColor="rgba(251,191,36,0.3)",this.style.color="#fbbf24"},2e3)}catch{const t=document.createElement("textarea");t.value=d.email,document.body.appendChild(t),t.select(),document.execCommand("copy"),t.remove(),f("Email copied! 📋","#10b981")}});const r=document.getElementById("lite-contact-msg"),s=document.getElementById("lite-char-count");r&&s&&r.addEventListener("input",()=>{s.textContent=`${r.value.length} / 500`,s.style.color=r.value.length>450?"#f59e0b":"#475569"}),document.getElementById("lite-send-btn")?.addEventListener("click",async()=>{const t=document.getElementById("lite-contact-name")?.value||"",i=document.getElementById("lite-contact-email")?.value||"",a=document.getElementById("lite-contact-msg")?.value||"",b=document.getElementById("lite-send-btn"),g=document.getElementById("lite-send-label"),m=document.getElementById("lite-status");k(["lite-contact-name","lite-contact-email","lite-contact-msg"]);const{valid:v,errors:p}=E({name:t,email:i,message:a});if(!v){p.name&&h(document.getElementById("lite-contact-name"),p.name),p.email&&h(document.getElementById("lite-contact-email"),p.email),p.message&&h(r,p.message),f(p.name||p.email||p.message,"#ef4444");return}b.disabled=!0,b.style.opacity="0.7",b.style.cursor="not-allowed",g&&(g.textContent="Sending... ⏳"),m&&(m.textContent="Sending...");const x=await w({name:t,email:i,message:a});b.disabled=!1,b.style.opacity="1",b.style.cursor="pointer",x.ok?(x.via==="ajax"?(f("Message sent! I'll reply soon ✨","#10b981"),m&&(m.textContent="✅ Sent! Check dianferdi01@gmail.com",m.style.color="#10b981")):(f("Opening email app — message ready ✉️","#0ea5e9"),m&&(m.textContent="📧 Email app opened",m.style.color="#0ea5e9")),document.getElementById("lite-contact-name").value="",document.getElementById("lite-contact-email").value="",r.value="",s&&(s.textContent="0 / 500"),g&&(g.textContent="Sent! ✅"),setTimeout(()=>{g&&(g.textContent="Send Message 🚀"),m&&(m.textContent="")},3e3)):(f("Failed, but saved locally. Try again ✨","#f59e0b"),m&&(m.textContent="⚠️ Saved locally",m.style.color="#f59e0b"),g&&(g.textContent="Send Message 🚀"))})}};class j extends u.Scene{constructor(){super({key:y.MAIN_MENU}),this._menuEl=null,this._playerName="Guest",this._muted=!1}create(){const{width:e,height:o}=this.scale;document.getElementById("hud")?.remove(),document.getElementById("virtual-dpad")?.remove(),document.getElementById("btn-action")?.remove(),document.getElementById("btn-jump")?.remove(),document.getElementById("interaction-indicator")?.classList.add("hidden");const c=document.getElementById("game-container");c&&(c.classList.remove("hidden"),c.style.display="flex",c.style.zIndex="5"),this.sound.mute=l.isMuted(),this._createBackground(e,o),this._muted=l.isMuted(),l.init(this),this._buildMenu(),this.time.delayedCall(300,()=>{this.scene.isActive(y.MAIN_MENU)&&(l._bgm&&l._bgm.key!=="bgm_menu"&&l.stopAllImmediate(),l.playBGM(this,"bgm_menu",{volume:.35}))}),this.events.once("shutdown",()=>{this._menuEl?.remove(),this._menuEl=null,this.time.removeAllEvents()})}_createBackground(e,o){this.add.rectangle(e/2,o/2,e,o,986906);for(let r=0;r<80;r++){const s=u.Math.Between(0,e),t=u.Math.Between(0,o),i=u.Math.FloatBetween(.5,2),a=u.Math.FloatBetween(.3,1),b=this.add.circle(s,t,i,16777215,a);this.tweens.add({targets:b,alpha:{from:a,to:.1},duration:u.Math.Between(800,2500),yoyo:!0,repeat:-1,delay:u.Math.Between(0,2e3),ease:"Sine.easeInOut"})}["{ }","< />","01","#!/","npm","git"].forEach((r,s)=>{const t=u.Math.Between(40,e-40),i=u.Math.Between(40,o-40),a=this.add.text(t,i,r,{fontFamily:"'Press Start 2P', monospace",fontSize:"6px",color:"#2a2a4a",alpha:.5}).setOrigin(.5);this.tweens.add({targets:a,y:i-20,alpha:.15,duration:3e3+s*400,yoyo:!0,repeat:-1,ease:"Sine.easeInOut",delay:s*300})})}_buildMenu(){this._menuEl&&this._menuEl.remove();const e=document.createElement("div");e.id="main-menu",e.innerHTML=`
      <div class="menu-wrapper">
        <!-- Logo / Title — FERDI DEVELOPER -->
        <div class="menu-title-block">
          <div class="menu-version-tag">v1.0 &bull; FERDI</div>
          <h1 class="menu-title pixel-font" style="font-size:clamp(1.6rem,6vw,2.4rem); letter-spacing:3px; line-height:1.3;">FERDI<span> DEVELOPER</span></h1>
          <p class="menu-subtitle">${d.role} &bull; Batujajar, Indonesia</p>
        </div>

        <!-- Name Input -->
        <div class="menu-name-section">
          <label class="menu-label pixel-font">Enter Your Name</label>
          <div class="menu-name-row">
            <input
              id="player-name-input"
              type="text"
              maxlength="12"
              placeholder="Adventurer"
              autocomplete="off"
              spellcheck="false"
              value="${this._playerName==="Guest"?"":this._playerName}"
            />
            <button id="btn-skip-name" class="btn-ghost" title="Skip">Skip</button>
          </div>
        </div>

        <!-- Menu Buttons -->
        <nav class="menu-nav">
          <button id="btn-start-game" class="menu-btn menu-btn--primary">
            <span class="menu-btn-icon">▶</span>
            Start View
          </button>
          <button id="btn-lite-mode" class="menu-btn menu-btn--secondary">
            <span class="menu-btn-icon">📋</span>
            Lite Mode
          </button>
          <button id="btn-instructions" class="menu-btn menu-btn--ghost">
            <span class="menu-btn-icon">❓</span>
            Instructions
          </button>
        </nav>

        <!-- Audio Toggle -->
        <button id="btn-mute-menu" class="menu-mute-btn" title="Toggle Audio">
          ${this._muted?"🔇":"🔊"}
        </button>

        <!-- Footer -->
        <p class="menu-footer pixel-font">
          Made with ♥ by ${d.name} &bull; Ferdi Developer
        </p>
      </div>
    `,this._applyMenuStyles(e),document.getElementById("app").appendChild(e),this._menuEl=e;const o=document.getElementById("game-container");o.style.zIndex="5",this._bindMenuEvents()}_applyMenuStyles(e){const o=document.createElement("style");o.textContent=`
      #main-menu {
        position: fixed;
        inset: 0;
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }
      .menu-wrapper {
        pointer-events: all;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        padding: 2.5rem 2rem;
        width: min(480px, 95vw);
        background: rgba(15, 15, 26, 0.92);
        border: 1px solid #2a2a4a;
        border-radius: 16px;
        backdrop-filter: blur(20px);
        box-shadow: 0 0 60px rgba(124, 58, 237, 0.15), 0 0 120px rgba(124, 58, 237, 0.05);
        animation: slide-up 0.4s ease;
      }
      .menu-wrapper::before {
        content: '';
        position: absolute;
        inset: -1px;
        border-radius: 17px;
        background: linear-gradient(135deg, rgba(124,58,237,0.3), transparent, rgba(6,182,212,0.2));
        pointer-events: none;
        z-index: -1;
      }
      .menu-version-tag {
        font-family: 'Press Start 2P', monospace;
        font-size: 6px;
        color: #7c3aed;
        background: rgba(124,58,237,0.15);
        padding: 3px 8px;
        border-radius: 4px;
        border: 1px solid rgba(124,58,237,0.3);
        margin-bottom: 4px;
      }
      .menu-title-block { text-align: center; }
      .menu-title {
        font-size: clamp(2rem, 8vw, 3rem);
        font-family: 'Press Start 2P', monospace;
        color: #e2e8f0;
        text-shadow: 0 0 20px rgba(124,58,237,0.8), 0 0 40px rgba(124,58,237,0.4);
        letter-spacing: 6px;
        margin: 0;
        animation: pixel-flicker 3s ease-in-out infinite;
      }
      .menu-title span { color: #7c3aed; }
      .menu-subtitle {
        font-size: 0.78rem;
        color: #94a3b8;
        margin-top: 4px;
        font-family: 'Inter', sans-serif;
      }
      .menu-name-section {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .menu-label {
        font-size: 7px;
        color: #94a3b8;
        letter-spacing: 1px;
      }
      .menu-name-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .menu-name-row input {
        flex: 1;
        background: rgba(26,26,46,0.8);
        border: 1px solid #2a2a4a;
        border-radius: 8px;
        padding: 10px 14px;
        color: #e2e8f0;
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        outline: none;
        transition: border-color 0.2s;
      }
      .menu-name-row input:focus { border-color: #7c3aed; }
      .menu-name-row input::placeholder { color: #475569; }
      .menu-nav {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .menu-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 14px 24px;
        border-radius: 10px;
        font-family: 'Press Start 2P', monospace;
        font-size: 10px;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        letter-spacing: 1px;
      }
      .menu-btn-icon { font-size: 14px; }
      .menu-btn--primary {
        background: linear-gradient(135deg, #7c3aed, #6d28d9);
        color: #fff;
        box-shadow: 0 4px 20px rgba(124,58,237,0.35);
      }
      .menu-btn--primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(124,58,237,0.5);
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      }
      .menu-btn--secondary {
        background: rgba(6,182,212,0.1);
        color: #06b6d4;
        border: 1px solid rgba(6,182,212,0.3);
      }
      .menu-btn--secondary:hover {
        background: rgba(6,182,212,0.2);
        transform: translateY(-2px);
        border-color: rgba(6,182,212,0.6);
      }
      .menu-btn--ghost {
        background: transparent;
        color: #94a3b8;
        border: 1px solid #2a2a4a;
      }
      .menu-btn--ghost:hover {
        color: #e2e8f0;
        border-color: #475569;
        background: rgba(255,255,255,0.04);
        transform: translateY(-1px);
      }
      .menu-mute-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255,255,255,0.06);
        border: 1px solid #2a2a4a;
        border-radius: 8px;
        padding: 6px 10px;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.2s;
      }
      .menu-mute-btn:hover { background: rgba(255,255,255,0.12); }
      .menu-footer {
        font-size: 6px;
        color: #334155;
        text-align: center;
      }
    `,e.appendChild(o)}_bindMenuEvents(){const e=document.getElementById("player-name-input"),o=document.getElementById("btn-start-game"),c=document.getElementById("btn-lite-mode"),r=document.getElementById("btn-instructions"),s=document.getElementById("btn-skip-name"),t=document.getElementById("btn-mute-menu"),i=()=>e.value.trim().replace(/[<>"']/g,"").slice(0,12)||"Guest";o.addEventListener("click",()=>{this._playerName=i(),this._startGame()}),s.addEventListener("click",()=>{this._playerName="Guest",e.value=""}),c.addEventListener("click",()=>{this._menuEl.remove(),document.body.classList.add("lite-mode"),document.documentElement.classList.add("lite-mode"),document.body.style.overflow="auto",document.documentElement.style.overflow="auto";const a=document.getElementById("game-container");a&&(a.style.display="none",a.classList.add("hidden")),l.stopAllImmediate();try{this.sound.stopAll()}catch{}_.render(document.getElementById("app")),window.scrollTo(0,0)}),r.addEventListener("click",()=>this._showInstructions()),t.addEventListener("click",()=>{const a=l.toggle();this._muted=a,t.textContent=a?"🔇":"🔊",!a&&!l._bgm?.isPlaying&&l.playBGM(this,"bgm_menu",{volume:.35}),l.playSFX(this,"sfx_interact")}),e.addEventListener("keydown",a=>{a.key==="Enter"&&o.click()})}_startGame(){l.playSFX(this,"sfx_open"),l.stopAllImmediate(),this.registry.set("playerName",this._playerName),this.registry.set("muted",this._muted);const e=document.getElementById("game-container");e.classList.remove("hidden"),e.style.zIndex="10",this._menuEl&&(this._menuEl.style.transition="opacity 0.2s",this._menuEl.style.opacity="0",setTimeout(()=>{this._menuEl?.remove(),this._menuEl=null},220)),setTimeout(()=>{try{this.scene.start(y.WORLD)}catch{}try{this.scene.start(y.UI)}catch{}},50)}_showInstructions(){if(document.getElementById("instructions-modal"))return;const o=document.createElement("div");o.id="instructions-modal",o.className="modal-backdrop",o.innerHTML=`
      <div class="modal-panel glass-card" style="max-width:500px;padding:2rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
          <h2 class="pixel-font" style="font-size:12px;color:#7c3aed;">CONTROLS</h2>
          <button id="close-instr" class="btn-ghost" style="font-size:1.2rem;">✕</button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
          <div>
            <h3 style="font-family:'Press Start 2P',monospace;font-size:8px;color:#06b6d4;margin-bottom:12px;">⌨️ Desktop</h3>
            <div class="instr-row"><kbd>W A S D</kbd><span>Move</span></div>
            <div class="instr-row"><kbd>↑ ↓ ← →</kbd><span>Move</span></div>
            <div class="instr-row"><kbd>E</kbd><span>Interact</span></div>
            <div class="instr-row"><kbd>Space</kbd><span>Jump ⤒</span></div>
            <div class="instr-row"><kbd>Esc</kbd><span>Close / Exit</span></div>
          </div>
          <div>
            <h3 style="font-family:'Press Start 2P',monospace;font-size:8px;color:#06b6d4;margin-bottom:12px;">📱 Mobile</h3>
            <div class="instr-row">🕹️<span>D-Pad (bottom left)</span></div>
            <div class="instr-row">🔵<span>E = Interact</span></div>
            <div class="instr-row">🟢<span>⤒ = Jump</span></div>
            <div class="instr-row">✕<span>Tap X to close modal</span></div>
          </div>
        </div>

        <div style="margin-top:1.5rem;padding:12px;background:rgba(124,58,237,0.1);border-radius:8px;border:1px solid rgba(124,58,237,0.2);">
          <p style="font-size:0.8rem;color:#94a3b8;line-height:1.6;">
            💡 Explore the virtual office to discover projects, skills, and contact info.
            Approach glowing objects and press <strong style="color:#fbbf24">E</strong> to interact!
          </p>
        </div>
      </div>
    `;const c=document.createElement("style");c.textContent=`
      .instr-row {
        display: flex; align-items: center; gap: 10px;
        margin-bottom: 8px; font-size: 0.8rem; color: #94a3b8;
      }
      kbd {
        background: #1e293b; border: 1px solid #334155;
        border-radius: 4px; padding: 2px 6px; font-size: 0.7rem;
        color: #e2e8f0; font-family: monospace; white-space: nowrap;
      }
    `,o.appendChild(c),document.getElementById("modal-portal").appendChild(o);const r=()=>o.remove();document.getElementById("close-instr").addEventListener("click",r),o.addEventListener("click",t=>{t.target===o&&r()});const s=t=>{t.key==="Escape"&&(r(),document.removeEventListener("keydown",s))};document.addEventListener("keydown",s)}}export{j as default};
