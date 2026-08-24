import BaseModal from './BaseModal.js';
import { validateContact, sendContactMessage, showContactToast, setFieldError, clearFieldErrors } from '../utils/contactService.js';

/**
 * ContactModal — Email copy, social links, optional message form.
 * @param {object} profile — from profile.json
 */
export default class ContactModal extends BaseModal {
  _renderContent(profile) {
    const socialLinks = profile.socials?.map((s) => {
      const colors = {
        github:    '#e2e8f0',
        linkedin:  '#0ea5e9',
        twitter:   '#38bdf8',
        instagram: '#e1306c',
      };
      return `
        <a href="${s.url}" target="_blank" rel="noopener" style="
          display:flex; align-items:center; gap:10px;
          padding:12px 16px; border-radius:10px;
          background:rgba(255,255,255,0.04); border:1px solid #1e293b;
          color:${colors[s.icon] || '#94a3b8'}; text-decoration:none;
          font-size:0.875rem; font-weight:500;
          transition:all 0.2s;
        " onmouseover="this.style.background='rgba(255,255,255,0.08)';this.style.borderColor='#334155'"
           onmouseout="this.style.background='rgba(255,255,255,0.04)';this.style.borderColor='#1e293b'">
           ${s.platform === 'GitHub' ? '🐙' : s.platform === 'LinkedIn' ? '💼' : s.platform === 'Instagram' ? '📸' : '🐦'}
          ${s.platform}
          <svg style="margin-left:auto;opacity:0.4" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      `;
    }).join('') || '';

    return `
      <div style="position:relative;">
        ${this._closeBtn()}

        <!-- Header -->
        <div style="
          background:linear-gradient(135deg,#431407,#7c2d12,#1e293b);
          padding:2rem;
          border-radius:12px 12px 0 0;
        ">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:1.5rem">📬</span>
            <div>
              <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#fcd34d;margin-bottom:4px;">GET IN TOUCH</p>
              <h2 style="font-size:1.35rem;font-weight:700;color:#e2e8f0;margin:0;">Say Hello! 👋</h2>
            </div>
          </div>
          <p style="font-size:0.85rem;color:#fed7aa;margin-top:8px;line-height:1.5;">
            I'm always open to new opportunities, collaborations, or just a good conversation.
          </p>
        </div>

        <!-- Body -->
        <div style="padding:1.5rem 2rem;display:flex;flex-direction:column;gap:1.25rem;">

          <!-- Email -->
          <div style="
            display:flex; align-items:center; justify-content:space-between;
            padding:14px 16px; border-radius:10px;
            background:rgba(251,191,36,0.08); border:1px solid rgba(251,191,36,0.25);
            flex-wrap:wrap; gap:10px;
          ">
            <div>
              <p style="font-family:'Press Start 2P',monospace;font-size:6px;color:#fbbf24;margin-bottom:4px;">EMAIL</p>
              <p style="color:#e2e8f0;font-size:0.9rem;font-weight:500;">${profile.email}</p>
            </div>
            <button id="copy-email-btn" style="
              background:rgba(251,191,36,0.15); border:1px solid rgba(251,191,36,0.35);
              border-radius:8px; padding:8px 16px; color:#fbbf24;
              font-size:0.8rem; font-weight:600; cursor:pointer;
              transition:all 0.2s; font-family:'Inter',sans-serif;
              display:flex; align-items:center; gap:6px; white-space:nowrap;
            ">
              📋 Copy Email
            </button>
          </div>

          <!-- Social Links -->
          ${socialLinks ? `
          <div>
            <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#7c3aed;margin-bottom:10px;">SOCIAL LINKS</p>
            <div style="display:flex;flex-direction:column;gap:8px;">${socialLinks}</div>
          </div>` : ''}

          <!-- Quick Message Form -->
          <div style="padding:16px;background:rgba(255,255,255,0.03);border-radius:10px;border:1px solid #1e293b;">
            <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#7c3aed;margin-bottom:12px;">QUICK MESSAGE</p>
            <input id="contact-name" type="text" placeholder="Your name" maxlength="40" style="
              width:100%; padding:10px 12px; border-radius:8px; margin-bottom:8px;
              background:#0f172a; border:1px solid #1e293b; color:#e2e8f0;
              font-family:'Inter',sans-serif; font-size:0.85rem; outline:none;
              transition:border-color 0.2s; box-sizing:border-box;
            " onfocus="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#7c3aed'" onblur="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#1e293b'" />
            <input id="contact-email-field" type="email" placeholder="your@email.com" maxlength="80" style="
              width:100%; padding:10px 12px; border-radius:8px; margin-bottom:8px;
              background:#0f172a; border:1px solid #1e293b; color:#e2e8f0;
              font-family:'Inter',sans-serif; font-size:0.85rem; outline:none;
              transition:border-color 0.2s; box-sizing:border-box;
            " onfocus="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#7c3aed'" onblur="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#1e293b'" />
            <textarea id="contact-msg" placeholder="Your message... (min 10 chars)" rows="3" maxlength="500" style="
              width:100%; padding:10px 12px; border-radius:8px; margin-bottom:4px;
              background:#0f172a; border:1px solid #1e293b; color:#e2e8f0;
              font-family:'Inter',sans-serif; font-size:0.85rem; outline:none;
              resize:vertical; transition:border-color 0.2s; box-sizing:border-box;
            " onfocus="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#7c3aed'" onblur="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#1e293b'"></textarea>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <span id="contact-char-count" style="font-size:0.7rem;color:#475569;">0 / 500</span>
              <span id="contact-status" style="font-size:0.7rem;color:#94a3b8;"></span>
            </div>
            <button id="contact-send-btn" style="
              width:100%; padding:12px; border-radius:8px;
              background:linear-gradient(135deg,#7c3aed,#6d28d9);
              color:#fff; font-weight:600; font-size:0.875rem;
              border:none; cursor:pointer; font-family:'Inter',sans-serif;
              transition:all 0.2s; display:flex;align-items:center;justify-content:center;gap:8px;
            " onmouseover="this.style.transform='translateY(-1px)'"
               onmouseout="this.style.transform='none'">
              <span id="contact-send-label">Send Message 🚀</span>
            </button>
            <p style="font-size:0.68rem;color:#475569;margin-top:8px;text-align:center;line-height:1.4;">
              ✉️ Direct to <b style="color:#94a3b8">${profile.email}</b> via FormSubmit — no backend needed.<br/>
              <span style="color:#334155">Fallback to email app if offline.</span>
            </p>
          </div>
        </div>
      </div>
    `;
  }

  open(onClose) {
    super.open(onClose);
    this._bindContactEvents();
  }

  _bindContactEvents() {
    // FIX: stop Phaser capture biar bisa ketik asdwe & spasi di form
    const stopCapture = (el) => {
      if (!el) return;
      ['keydown','keyup','keypress'].forEach(evt => el.addEventListener(evt, (e) => e.stopPropagation()));
    };
    stopCapture(document.getElementById('contact-name'));
    stopCapture(document.getElementById('contact-email-field'));
    stopCapture(document.getElementById('contact-msg'));

    // Copy email button
    const copyBtn = document.getElementById('copy-email-btn');
    if (copyBtn && this.data.email) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(this.data.email);
          copyBtn.textContent = '✅ Copied!';
          copyBtn.style.background = 'rgba(16,185,129,0.2)';
          copyBtn.style.borderColor = 'rgba(16,185,129,0.5)';
          copyBtn.style.color = '#34d399';
          this._showToast('Email copied to clipboard! 📋');
          setTimeout(() => {
            copyBtn.innerHTML = '📋 Copy Email';
            copyBtn.style.background = 'rgba(251,191,36,0.15)';
            copyBtn.style.borderColor = 'rgba(251,191,36,0.35)';
            copyBtn.style.color = '#fbbf24';
          }, 2000);
        } catch {
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = this.data.email;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
          this._showToast('Email copied! 📋');
        }
      });
    }

    // Send button — now actually working via FormSubmit AJAX + mailto fallback
    const sendBtn = document.getElementById('contact-send-btn');
    const sendLabel = document.getElementById('contact-send-label');
    const statusEl = document.getElementById('contact-status');
    const msgEl = document.getElementById('contact-msg');
    const charCount = document.getElementById('contact-char-count');
    if (msgEl && charCount) {
      msgEl.addEventListener('input', () => {
        charCount.textContent = `${msgEl.value.length} / 500`;
        charCount.style.color = msgEl.value.length > 450 ? '#f59e0b' : '#475569';
      });
    }
    if (sendBtn) {
      sendBtn.addEventListener('click', async () => {
        const name    = document.getElementById('contact-name')?.value || '';
        const email   = document.getElementById('contact-email-field')?.value || '';
        const message = document.getElementById('contact-msg')?.value || '';

        clearFieldErrors(['contact-name','contact-email-field','contact-msg']);
        const { valid, errors } = validateContact({ name, email, message });
        if (!valid) {
          if (errors.name) setFieldError(document.getElementById('contact-name'), errors.name);
          if (errors.email) setFieldError(document.getElementById('contact-email-field'), errors.email);
          if (errors.message) setFieldError(msgEl, errors.message);
          showContactToast(errors.name || errors.email || errors.message, '#ef4444');
          return;
        }

        // Loading state
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.7';
        sendBtn.style.cursor = 'not-allowed';
        if (sendLabel) sendLabel.textContent = 'Sending... ⏳';
        if (statusEl) statusEl.textContent = 'Sending...';

        const result = await sendContactMessage({ name, email, message });

        sendBtn.disabled = false;
        sendBtn.style.opacity = '1';
        sendBtn.style.cursor = 'pointer';

        if (result.ok) {
          if (result.via === 'ajax') {
            showContactToast('Message sent! I\'ll reply soon ✨', '#10b981');
            if (statusEl) { statusEl.textContent = '✅ Sent! Check dianferdi01@gmail.com'; statusEl.style.color = '#10b981'; }
          } else if (result.via === 'mailto') {
            showContactToast('Opening email app — message ready to send ✉️', '#0ea5e9');
            if (statusEl) { statusEl.textContent = '📧 Email app opened'; statusEl.style.color = '#0ea5e9'; }
          }
          // clear form
          document.getElementById('contact-name').value = '';
          document.getElementById('contact-email-field').value = '';
          msgEl.value = '';
          if (charCount) charCount.textContent = '0 / 500';
          if (sendLabel) sendLabel.textContent = 'Sent! ✅';
          setTimeout(() => { if (sendLabel) sendLabel.textContent = 'Send Message 🚀'; if (statusEl) statusEl.textContent = ''; }, 3000);
        } else {
          showContactToast('Failed, but saved locally. Try again ✨', '#f59e0b');
          if (statusEl) { statusEl.textContent = '⚠️ Saved locally'; statusEl.style.color = '#f59e0b'; }
          if (sendLabel) sendLabel.textContent = 'Send Message 🚀';
        }
      });
    }
  }

  _showToast(message, color = '#10b981') {
    showContactToast(message, color);
  }
}
