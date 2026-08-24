/**
 * contactService.js — Shared logic for Quick Message (Game Modal + Lite Mode)
 * Makes the form actually work via FormSubmit AJAX + mailto fallback.
 * No backend / API key needed — uses dianferdi01@gmail.com directly.
 */
import profileData from '../data/profile.json';

const TARGET_EMAIL = profileData.email || 'dianferdi01@gmail.com';
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${TARGET_EMAIL}`;

// simple email regex
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateContact({ name, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required';
  else if (name.trim().length < 2) errors.name = 'Name too short';
  if (!email.trim()) errors.email = 'Email is required';
  else if (!isValidEmail(email.trim())) errors.email = 'Invalid email format';
  if (!message.trim()) errors.message = 'Message is required';
  else if (message.trim().length < 10) errors.message = 'Message too short (min 10 chars)';
  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Send contact message.
 * Tries FormSubmit AJAX first, fallback to mailto.
 * @returns {Promise<{ok:boolean, via:'ajax'|'mailto'|'stored', error?:string}>}
 */
export async function sendContactMessage({ name, email, message }) {
  const payload = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    _subject: `DevQuest Portfolio — Message from ${name.trim() || 'Visitor'}`,
    _template: 'table',
    _captcha: 'false',
  };

  // Store locally always (so it "berjalan" even offline, for demo/portfolio review)
  try {
    const history = JSON.parse(localStorage.getItem('devquest_messages') || '[]');
    history.push({ ...payload, date: new Date().toISOString(), to: TARGET_EMAIL });
    localStorage.setItem('devquest_messages', JSON.stringify(history.slice(-20)));
  } catch {}

  // 1) Try AJAX to FormSubmit
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(FORMSUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok) {
      // FormSubmit returns {success: "true"} or similar
      return { ok: true, via: 'ajax' };
    }
    throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    console.warn('[contactService] AJAX failed, fallback to mailto:', err?.message);
    // 2) Fallback: open mailto (must be called in user gesture context)
    try {
      const subject = encodeURIComponent(payload._subject);
      const body = encodeURIComponent(`From: ${payload.name} <${payload.email}>\n\n${payload.message}`);
      // Use hidden anchor to trigger mailto without popup blocker as much as possible
      window.location.href = `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;
      // also try window.open as backup
      // window.open(`mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`, '_blank');
      return { ok: true, via: 'mailto' };
    } catch (e) {
      return { ok: false, via: 'stored', error: e.message };
    }
  }
}

export function showContactToast(message, color = '#10b981') {
  // Try game toast first, fallback to lite toast, else create one
  let toast = document.getElementById('toast') || document.getElementById('lite-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'lite-toast';
    toast.style.cssText = `
      position:fixed; bottom:20px; left:50%; transform:translateX(-50%);
      padding:12px 20px; border-radius:8px; color:#fff; font-size:0.85rem;
      font-family:'Inter',sans-serif; z-index:9999; transition:opacity 0.2s;
      box-shadow:0 4px 20px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.background = color;
  toast.style.opacity = '1';
  toast.classList?.remove('hidden');
  toast.style.display = 'block';
  clearTimeout(showContactToast._t);
  showContactToast._t = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => { toast.style.display = 'none'; }, 200);
    toast.classList?.add('hidden');
  }, 3500);
}

/**
 * Attach validation UI helpers
 */
export function setFieldError(inputEl, errorMsg) {
  if (!inputEl) return;
  inputEl.style.borderColor = errorMsg ? '#ef4444' : '#1e293b';
  let errEl = inputEl.parentElement?.querySelector('.field-error');
  // if input is direct inside container without wrapper, create sibling
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.className = 'field-error';
    errEl.style.cssText = 'font-size:0.7rem;color:#ef4444;margin:-4px 0 8px;';
    inputEl.insertAdjacentElement('afterend', errEl);
  }
  errEl.textContent = errorMsg || '';
  errEl.style.display = errorMsg ? 'block' : 'none';
}

export function clearFieldErrors(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) setFieldError(el, '');
  });
}
