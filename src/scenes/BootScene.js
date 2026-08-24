import Phaser from 'phaser';
import { SCENE_KEYS, TILE_SIZE, TILES } from '../config/gameConfig.js';

/**
 * BootScene — Preloads all assets and shows a loading bar.
 * Generates programmatic textures so no PNG files are required for sprites.
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.BOOT });
  }

  preload() {
    this._createLoadingUI();

    this.load.on('progress', (v) => this._onProgress(v));
    this.load.on('complete', () => this._onComplete());

    // ── Audio — DevQuest Original Soundtrack ────────────────────────
    // Chiptune RPG BGM cocok biar ga garing: menu upbeat + world lo-fi
    this.load.audio('bgm_menu',     '/assets/audio/bgm/menu.wav');
    this.load.audio('bgm_world',    '/assets/audio/bgm/world.wav');
    this.load.audio('sfx_interact', '/assets/audio/sfx/interact.wav');
    this.load.audio('sfx_open',     '/assets/audio/sfx/open.wav');
    this.load.audio('sfx_close',    '/assets/audio/sfx/close.wav');

    // ── Tileset image (optional PNG drop-in) ─────────────────────────
    // this.load.image('office_tileset', '/assets/tilesets/office_tileset.png');

    // ── Character spritesheet (optional PNG drop-in) ──────────────────
    // this.load.spritesheet('player', '/assets/sprites/character.png', {
    //   frameWidth: 16, frameHeight: 16,
    // });

    this.load.on('filecomplete', (key, type, data) => {
      // Swallow errors — texture fallbacks created in create()
    });
    this.load.on('loaderror', (file) => {
      console.warn(`[BootScene] Failed to load: ${file.src}`);
    });

    // Fake a small load so the progress bar is visible
    this._simulateLoad();
  }

  _simulateLoad() {
    // We generate textures in create(), but show the bar anyway for UX
    let progress = 0;
    const tick = this.time.addEvent({
      delay: 20,
      repeat: 49,
      callback: () => {
        progress += 0.02;
        this._onProgress(Math.min(progress, 0.99));
      },
    });
    this._fakeTick = tick;
  }

  _createLoadingUI() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    // Dark background
    this.add.rectangle(cx, cy, width, height, 0x0f0f1a);

    // Scanline effect (subtle horizontal lines)
    const scanGfx = this.add.graphics();
    for (let y = 0; y < height; y += 4) {
      scanGfx.fillStyle(0x000000, 0.15);
      scanGfx.fillRect(0, y, width, 2);
    }

    // Title — FERDI DEVELOPER
    this.add.text(cx, cy - 80, 'FERDI', {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '20px',
      color: '#e2e8f0',
      stroke: '#1e1b4b',
      strokeThickness: 4,
    }).setOrigin(0.5);
    this.add.text(cx, cy - 58, 'DEVELOPER', {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '14px',
      color: '#7c3aed',
      stroke: '#2a0060',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(cx, cy - 48, 'Loading adventure...', {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '8px',
      color: '#94a3b8',
    }).setOrigin(0.5);

    // Progress bar track
    const barW = Math.min(360, width * 0.7);
    const barH = 14;
    const barX = cx - barW / 2;
    const barY = cy - 4;

    this.add.rectangle(cx, barY + barH / 2, barW + 4, barH + 4, 0x2a2a4a)
      .setOrigin(0.5);

    this._barBg = this.add.rectangle(cx, barY + barH / 2, barW, barH, 0x1a1a2e)
      .setOrigin(0.5);

    this._bar = this.add.graphics();
    this._barMeta = { x: barX, y: barY, w: barW, h: barH };

    // Percent text
    this._pctText = this.add.text(cx, barY + barH + 16, '0%', {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '7px',
      color: '#7c3aed',
    }).setOrigin(0.5);

    // Corner decorations
    const corners = [
      [8, 8], [width - 8, 8], [8, height - 8], [width - 8, height - 8],
    ];
    corners.forEach(([x, y]) => {
      this.add.text(x, y, '◆', {
        fontFamily: 'monospace', fontSize: '10px', color: '#2a2a4a',
      }).setOrigin(0.5);
    });
  }

  _onProgress(value) {
    const { x, y, w, h } = this._barMeta;
    this._bar.clear();

    // Gradient-like fill using two rects
    this._bar.fillStyle(0x4c1d95, 1);
    this._bar.fillRect(x, y, w * value, h);
    this._bar.fillStyle(0x7c3aed, 0.8);
    this._bar.fillRect(x, y, w * value, h / 2);

    this._pctText.setText(`${Math.round(value * 100)}%`);
  }

  _onComplete() {
    this._pctText.setText('100%');
    this._onProgress(1);
  }

  create() {
    // Generate all textures programmatically
    this._generatePlayerTexture();
    this._generateTilesetTexture();
    this._generateUITextures();

    // Short pause then launch menu
    this.time.delayedCall(400, () => {
      this.scene.start(SCENE_KEYS.MAIN_MENU);
    });
  }

  // ── Programmatic Texture Generation ────────────────────────────────

  /**
   * Generate a 48×64 spritesheet for the player.
   * 4 rows (down, left, right, up) × 3 frames (idle, walk1, walk2).
   * Each frame: 16×16 px.
   */
  _generatePlayerTexture() {
    if (this.textures.exists('player')) return;

    const FRAME_W = 16, FRAME_H = 16;
    const COLS = 3, ROWS = 4;
    const W = FRAME_W * COLS;
    const H = FRAME_H * ROWS;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Color palette
    const C = {
      skin:      '#f5c5a3',
      hair:      '#3d2b1f',
      hoodie:    '#7c3aed',
      hoodie2:   '#6d28d9',
      pants:     '#1e293b',
      shoes:     '#0f172a',
      eyes:      '#1e293b',
      outline:   '#1e1e1e',
    };

    const drawPixel = (x, y, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    };

    const drawFrame = (col, row, walkPhase) => {
      const ox = col * FRAME_W;
      const oy = row * FRAME_H;

      // Directions: 0=down, 1=left, 2=right, 3=up
      const facingDown  = row === 0;
      const facingLeft  = row === 1;
      const facingRight = row === 2;
      const facingUp    = row === 3;

      const legOffset = walkPhase === 1 ? -1 : walkPhase === 2 ? 1 : 0;

      // Body (torso) — 6px wide, 5px tall, centered at x=5
      const bx = ox + 5, by = oy + 6;
      // Draw hoodie body
      for (let dy = 0; dy < 5; dy++) {
        for (let dx = 0; dx < 6; dx++) {
          drawPixel(bx + dx, by + dy, dx === 0 || dx === 5 ? C.outline : (dy === 0 ? C.hoodie2 : C.hoodie));
        }
      }

      // Head — 6px wide, 5px tall
      const hx = ox + 5, hy = oy + 1;
      for (let dy = 0; dy < 5; dy++) {
        for (let dx = 0; dx < 6; dx++) {
          const isEdge = dx === 0 || dx === 5 || dy === 0 || dy === 4;
          drawPixel(hx + dx, hy + dy, isEdge ? C.outline : C.skin);
        }
      }

      // Hair (top 2 rows of head area)
      for (let dx = 1; dx < 5; dx++) {
        drawPixel(hx + dx, hy, C.hair);
        if (dx < 4) drawPixel(hx + dx, hy + 1, C.hair);
      }

      // Eyes (direction dependent)
      if (facingDown) {
        drawPixel(hx + 2, hy + 3, C.eyes);
        drawPixel(hx + 4, hy + 3, C.eyes);
      } else if (facingUp) {
        // Back of head, no eyes
        for (let dx = 1; dx < 5; dx++) drawPixel(hx + dx, hy + 2, C.hair);
      } else if (facingLeft) {
        drawPixel(hx + 1, hy + 3, C.eyes);
      } else if (facingRight) {
        drawPixel(hx + 4, hy + 3, C.eyes);
      }

      // Legs
      const ly = oy + 11;
      // Left leg
      drawPixel(ox + 6, ly + legOffset, C.pants);
      drawPixel(ox + 6, ly + 1 - legOffset, C.pants);
      drawPixel(ox + 6, ly + 2, C.shoes);
      // Right leg
      drawPixel(ox + 8, ly - legOffset, C.pants);
      drawPixel(ox + 8, ly + 1 + legOffset, C.pants);
      drawPixel(ox + 8, ly + 2, C.shoes);
    };

    for (let row = 0; row < ROWS; row++) {
      drawFrame(0, row, 0); // idle
      drawFrame(1, row, 1); // walk1
      drawFrame(2, row, 2); // walk2
    }

    const texture = this.textures.addCanvas('player', canvas);
    let frameIndex = 0;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        texture.add(frameIndex, 0, x * FRAME_W, y * FRAME_H, FRAME_W, FRAME_H);
        frameIndex++;
      }
    }
  }

  /**
   * Generate a 128×64 tileset image (8×4 tiles, each 16×16).
   * Tiles match the indices in gameConfig.js TILES object.
   */
  _generateTilesetTexture() {
    if (this.textures.exists('office_tileset')) return;

    const TILE = 16;
    const COLS = 8;
    const ROWS = 4;

    const canvas = document.createElement('canvas');
    canvas.width  = TILE * COLS;
    canvas.height = TILE * ROWS;
    const ctx = canvas.getContext('2d');

    const tile = (col, row, drawFn) => {
      const x = col * TILE;
      const y = row * TILE;
      ctx.save();
      ctx.translate(x, y);
      drawFn(ctx, TILE);
      ctx.restore();
    };

    const solidRect = (ctx, color, x = 0, y = 0, w = TILE, h = TILE) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    };

    // Row 0
    tile(0, 0, (c) => { // FLOOR_WOOD
      solidRect(c, '#7c4a1e');
      c.fillStyle = '#6b3d18';
      for (let i = 0; i < 4; i++) c.fillRect(0, i * 4, 16, 1);
      c.fillStyle = '#8b5a2b';
      c.fillRect(0, 0, 16, 1);
    });

    tile(1, 0, (c) => { // FLOOR_TILE
      solidRect(c, '#cbd5e1');
      c.fillStyle = '#94a3b8';
      c.fillRect(0, 0, 16, 1); c.fillRect(0, 0, 1, 16);
      c.fillRect(8, 0, 1, 16); c.fillRect(0, 8, 16, 1);
    });

    tile(2, 0, (c) => { // FLOOR_CARPET
      solidRect(c, '#4c1d95');
      c.fillStyle = '#5b21b6';
      for (let i = 2; i < 14; i += 4) {
        for (let j = 2; j < 14; j += 4) c.fillRect(i, j, 2, 2);
      }
    });

    tile(3, 0, (c) => { // WALL_TOP
      solidRect(c, '#334155');
      c.fillStyle = '#475569';
      for (let x = 0; x < 16; x += 8) {
        for (let y = 0; y < 16; y += 4) {
          c.fillRect(x + (y % 8 === 0 ? 0 : 4), y, 7, 3);
        }
      }
      c.fillStyle = '#1e293b';
      c.fillRect(0, 14, 16, 2);
    });

    tile(4, 0, (c) => { // WALL_SIDE
      solidRect(c, '#1e293b');
      c.fillStyle = '#334155';
      c.fillRect(0, 0, 3, 16);
      c.fillStyle = '#0f172a';
      c.fillRect(3, 0, 1, 16);
    });

    tile(5, 0, (c) => { // WALL_CORNER
      solidRect(c, '#1e293b');
      c.fillStyle = '#334155';
      c.fillRect(0, 0, 16, 3);
      c.fillRect(0, 0, 3, 16);
    });

    tile(6, 0, (c) => { // DESK
      solidRect(c, '#92400e');
      c.fillStyle = '#78350f';
      c.fillRect(0, 12, 16, 4);
      c.fillStyle = '#b45309';
      c.fillRect(0, 0, 16, 2);
      c.fillStyle = '#451a03';
      c.fillRect(1, 12, 2, 4); c.fillRect(13, 12, 2, 4);
    });

    tile(7, 0, (c) => { // SHELF
      solidRect(c, '#78350f');
      ['#3b82f6','#ef4444','#22c55e','#f59e0b','#a855f7'].forEach((col, i) => {
        c.fillStyle = col;
        c.fillRect(2 + i * 2, 3, 2, 6);
      });
      c.fillStyle = '#92400e';
      c.fillRect(0, 10, 16, 2);
      c.fillRect(0, 2, 16, 1);
    });

    // Row 1
    tile(0, 1, (c) => { // PLANT
      solidRect(c, '#78350f', 6, 11, 4, 5);
      c.fillStyle = '#15803d';
      [[6,4],[5,5],[7,5],[4,6],[8,6],[5,7],[7,7],[6,8],[5,6],[7,6]].forEach(([x,y]) => {
        c.fillRect(x, y, 2, 2);
      });
      c.fillStyle = '#166534';
      c.fillRect(6, 6, 2, 4);
    });

    tile(1, 1, (c) => { // COMPUTER
      solidRect(c, '#1e293b');
      c.fillStyle = '#06b6d4';
      c.fillRect(3, 2, 10, 7);
      c.fillStyle = '#0e7490';
      for (let y = 3; y < 8; y += 2) c.fillRect(4, y, 8, 1);
      c.fillStyle = '#475569';
      c.fillRect(6, 9, 4, 2); c.fillRect(5, 11, 6, 1);
      c.fillStyle = '#0f172a'; c.fillRect(0, 13, 16, 3);
    });

    tile(2, 1, (c) => { // ARCADE
      solidRect(c, '#4c1d95');
      c.fillStyle = '#6d28d9'; c.fillRect(2, 1, 12, 14);
      c.fillStyle = '#0f172a'; c.fillRect(4, 3, 8, 6);
      c.fillStyle = '#7c3aed';
      [[5,4],[8,4],[6,5],[7,6],[5,7],[8,7]].forEach(([x,y]) => c.fillRect(x,y,1,1));
      c.fillStyle = '#ef4444'; c.fillRect(4, 11, 3, 2);
      c.fillStyle = '#22c55e'; c.fillRect(9, 11, 3, 2);
    });

    tile(3, 1, (c) => { // DOOR
      solidRect(c, '#92400e');
      c.fillStyle = '#78350f'; c.fillRect(2, 0, 12, 16);
      c.fillStyle = '#b45309'; c.fillRect(2, 0, 1, 16); c.fillRect(13, 0, 1, 16);
      c.fillStyle = '#fbbf24'; c.fillRect(11, 7, 2, 2);
      c.fillStyle = '#7c2d12'; c.fillRect(5, 3, 4, 5); c.fillRect(5, 10, 4, 4);
    });

    tile(4, 1, (c) => { // RUG
      solidRect(c, '#dc2626');
      c.fillStyle = '#b91c1c';
      c.fillRect(1, 1, 14, 14);
      c.fillStyle = '#fbbf24';
      c.fillRect(2, 2, 12, 1); c.fillRect(2, 13, 12, 1);
      c.fillRect(2, 2, 1, 12); c.fillRect(13, 2, 1, 12);
      c.fillRect(6, 6, 4, 4);
    });

    tile(5, 1, (c) => { // WINDOW
      solidRect(c, '#1e3a5f');
      c.fillStyle = '#bae6fd'; c.fillRect(2, 1, 12, 13);
      c.fillStyle = '#7dd3fc'; c.fillRect(2, 1, 12, 4);
      c.fillStyle = '#78350f';
      c.fillRect(2, 1, 1, 13); c.fillRect(13, 1, 1, 13);
      c.fillRect(2, 1, 12, 1); c.fillRect(2, 13, 12, 1);
      c.fillRect(7, 1, 1, 13);
      c.fillStyle = '#f0f9ff'; c.fillRect(4, 4, 2, 2); // reflection
    });

    tile(6, 1, (c) => { // LAMP
      solidRect(c, '#1e293b');
      c.fillStyle = '#92400e'; c.fillRect(7, 9, 2, 6);
      c.fillStyle = '#fbbf24'; c.fillRect(4, 5, 8, 5);
      c.fillStyle = '#fde68a'; c.fillRect(5, 3, 6, 3);
      c.fillStyle = '#fffbeb';
      [[6,6],[7,6],[8,6],[6,7],[8,7]].forEach(([x,y]) => c.fillRect(x,y,1,1));
    });

    tile(7, 1, (c) => { // CHAIR
      solidRect(c, '#334155');
      c.fillStyle = '#1e293b'; c.fillRect(3, 1, 10, 8);
      c.fillStyle = '#475569'; c.fillRect(3, 1, 10, 2);
      c.fillStyle = '#334155'; c.fillRect(5, 9, 6, 2);
      c.fillRect(3, 11, 2, 4); c.fillRect(11, 11, 2, 4);
      c.fillRect(5, 13, 6, 2);
    });

    // Row 2 — FLOOR_DARK and PATH
    tile(0, 2, (c) => { // FLOOR_DARK
      solidRect(c, '#0f172a');
      c.fillStyle = '#1e293b';
      for (let i = 0; i < 4; i++) c.fillRect(0, i * 4, 16, 1);
    });

    tile(1, 2, (c) => { // PATH
      solidRect(c, '#44403c');
      c.fillStyle = '#57534e';
      c.fillRect(4, 4, 8, 8);
      c.fillStyle = '#292524';
      c.fillRect(0, 0, 16, 1); c.fillRect(0, 15, 16, 1);
    });

    // Fill remaining tiles with solid colors
    const extraColors = ['#1a1a2e','#16213e','#0d1117','#161b22','#21262d','#30363d'];
    for (let c = 2; c < COLS; c++) {
      for (let r = 2; r < ROWS; r++) {
        const idx = (r - 2) * (COLS - 2) + (c - 2);
        tile(c, r, (ctx2) => solidRect(ctx2, extraColors[idx % extraColors.length] || '#0f172a'));
      }
    }

    this.textures.addCanvas('office_tileset', canvas);
  }

  _generateUITextures() {
    // Small colored square for zone boundary debugging (dev only)
    const gfx = this.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0xfbbf24);
    gfx.fillRect(0, 0, 4, 4);
    gfx.generateTexture('debug_dot', 4, 4);
    gfx.destroy();
  }
}
