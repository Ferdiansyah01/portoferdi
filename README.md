# DevQuest 🎮

> An RPG-style interactive developer portfolio built with **Phaser 3 + Vite + Tailwind CSS**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-devquest.vercel.app-7c3aed?style=flat-square)](https://devquest.vercel.app)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 📝 Customizing Your Content

All portfolio data lives in **JSON files** — no code changes needed!

### Profile Info → `src/data/profile.json`
Edit your name, role, bio, email, resume URL, and social links.

### Projects → `src/data/projects.json`
Each project entry:
```json
{
  "id": "project-01",
  "title": "Project Name",
  "shortDescription": "One sentence.",
  "fullDescription": "2-4 sentences.",
  "techStack": ["React", "Node.js"],
  "githubUrl": "https://github.com/you/repo",
  "demoUrl": "https://your-demo.com",
  "year": "2024",
  "mapObjectId": "arcade_01"
}
```

> **`mapObjectId`** must be unique per project. To add a new project, duplicate an entry and give it a new `mapObjectId` (e.g. `arcade_04`).

### Skills → `src/data/skills.json`
Grouped by category. Each skill has a `name`, `level` (`advanced`/`intermediate`/`beginner`), and `icon` (emoji).

---

## 🎨 Swapping Assets

| Asset | Location | Notes |
|-------|----------|-------|
| Character sprite | `public/assets/sprites/character.png` | 48×64 px, 4 rows × 3 cols (16×16 each) |
| Tileset | `public/assets/tilesets/office_tileset.png` | 128×64 px, 8×4 tiles (16×16 each) |
| BGM | `public/assets/audio/bgm/world.ogg` | Drop in + uncomment in `BootScene.js` |
| SFX | `public/assets/audio/sfx/interact.ogg` | Same as above |
| Profile avatar | `public/assets/profile/avatar.png` | Used in About modal + OG image |
| Resume | `public/assets/profile/cv.pdf` | Linked from About modal + Lite Mode |

---

## 🗺️ Map Layout

The world map is `48 × 36` tiles (each tile = 16px), rendered at 3× zoom.

| Zone | Position | Content |
|------|----------|---------|
| About Me | Top-left | Profile, bio, resume |
| Projects | Top-right | Arcade machines per project |
| Skills | Bottom-left | Bookshelf with skill categories |
| Contact | Bottom-right | Reception desk, email, socials |

Player spawns at tile `(24, 18)` — center of the map.

---

## ⌨️ Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Move | `WASD` / Arrow Keys | Virtual D-Pad |
| Interact | `E` / `Space` | Action button |
| Close modal | `Esc` | Tap `✕` |

---

## 🔧 Config Tweaks

All magic numbers are in `src/config/gameConfig.js`:

```js
export const PLAYER_SPEED    = 150; // pixels/second
export const INTERACT_RADIUS = 52;  // proximity trigger distance
export const ZOOM            = 3;   // camera zoom level
```

---

## 📬 Contact Form

The contact form defaults to a `mailto:` fallback. To use a real backend:

1. **Formspree:** Create a form at [formspree.io](https://formspree.io), then in `ContactModal.js` and `LiteModeView.js` add `fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body: formData })`.
2. **EmailJS:** Add their SDK and replace the send button handler.

---

## 🚀 Deployment

```bash
# Vercel (recommended)
npx vercel

# GitHub Pages
npm run build
# Push dist/ to gh-pages branch
```

The `vercel.json` is pre-configured for SPA routing.

---

## 📁 Project Structure

```
devquest/
├── src/
│   ├── config/gameConfig.js    ← All magic numbers
│   ├── data/                   ← Edit these for your content
│   │   ├── profile.json
│   │   ├── projects.json
│   │   └── skills.json
│   ├── scenes/                 ← Phaser scenes
│   ├── entities/               ← Player, InteractiveObject
│   ├── systems/                ← Input, Proximity, Save
│   └── ui/                     ← Modal components + Lite Mode
└── public/assets/              ← Drop PNG/audio files here
```

---

## 📄 License

MIT — feel free to fork and make it your own!
