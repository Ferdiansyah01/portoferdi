import Phaser from 'phaser';
import { SCENE_KEYS, TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, ZOOM, PLAYER_SPAWN, ZONES, TILES, OBJECT_TYPES, TILESET_KEY } from '../config/gameConfig.js';
import Player from '../entities/Player.js';
import InteractiveObject from '../entities/InteractiveObject.js';
import InputController from '../systems/InputController.js';
import ProximityManager from '../systems/ProximityManager.js';
import SaveManager from '../systems/SaveManager.js';
import projectsData from '../data/projects.json';
import skillsData   from '../data/skills.json';
import profileData  from '../data/profile.json';
import ProjectModal  from '../ui/ProjectModal.js';
import SkillsModal   from '../ui/SkillsModal.js';
import AboutModal    from '../ui/AboutModal.js';
import ContactModal  from '../ui/ContactModal.js';
import AudioManager  from '../systems/AudioManager.js';

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.WORLD });
    this._player         = null;
    this._inputController = null;
    this._proximityMgr   = null;
    this._modalOpen      = false;
    this._exiting        = false;
    this._activeModal    = null;
    this._exitObject     = null;
  }

  create() {
    const playerName = this.registry.get('playerName') || 'Guest';
    const muted      = this.registry.get('muted') || SaveManager.loadMutePreference();

    // ── Build the world map ──────────────────────────────────────────
    this._buildTilemap();

    // ── Spawn player ─────────────────────────────────────────────────
    const saved = SaveManager.loadPosition();
    const spawnX = (saved?.x ?? (PLAYER_SPAWN.x * TILE_SIZE)) ;
    const spawnY = (saved?.y ?? (PLAYER_SPAWN.y * TILE_SIZE));

    this._inputController = new InputController(this);
    this._player = new Player(this, spawnX, spawnY, this._inputController);

    // Collision: player ↔ wall layer
    this.physics.add.collider(this._player, this._collisionLayer);

    // ── Camera — adaptive zoom for mobile ────────────────────────────
    const isMobileCam = window.innerWidth < 768 || /Mobile|Android|iPhone/i.test(navigator.userAgent);
    const camZoom = isMobileCam ? 2 : ZOOM;
    this.cameras.main.setZoom(camZoom);
    this.cameras.main.startFollow(this._player, true, 0.12, 0.12);
    this.cameras.main.setBounds(
      0, 0,
      MAP_WIDTH  * TILE_SIZE,
      MAP_HEIGHT * TILE_SIZE,
    );

    // ── Interactive objects ───────────────────────────────────────────
    this._interactiveObjects = [];
    this._spawnInteractiveObjects();

    // ── Proximity system ──────────────────────────────────────────────
    this._proximityMgr = new ProximityManager(this, this._player);
    this._interactiveObjects.forEach((o) => this._proximityMgr.register(o));

    // Proximity events → UIScene
    this._proximityMgr.on('proximity-enter', (obj) => {
      this.scene.get(SCENE_KEYS.UI)?.showIndicator(obj, this.cameras.main);
    }, this);

    this._proximityMgr.on('proximity-exit', () => {
      this.scene.get(SCENE_KEYS.UI)?.hideIndicator();
    }, this);

    // ── Audio ─────────────────────────────────────────────────────────
    this._setupAudio(muted);

    // ── Keyboard ESC — close modal OR exit ────────────────────────────
    this.input.keyboard.on('keydown-ESC', () => {
      if (this._modalOpen) {
        this._closeModal();
      } else if (!this._exiting) {
        this._exitToMenu();
      }
    });

    // Save position & cleanup on shutdown — fix icon/exit kebawa bug
    this.events.once('shutdown', () => {
      // jangan overwrite spawn reset kalau lagi exiting via pintu
      if (!this._exiting && this._player) {
        SaveManager.savePosition(this._player.x, this._player.y);
      }
      this._inputController?.destroy();
      this._inputController = null;
      // destroy all interactive visuals biar ga nyangkut di MainMenu
      this._interactiveObjects?.forEach(o => { try { o.destroy(); } catch {} });
      this._interactiveObjects = [];
      this._exitObject = null;
      this._proximityMgr?.removeAllListeners?.();
      // hide indicator
      try { this.scene.get(SCENE_KEYS.UI)?.hideIndicator?.(); } catch {}
      // kill tweens & timers
      try { this.tweens.killAll(); } catch {}
      try { this.time.removeAllEvents(); } catch {}
      // clear flag so exit tidak double trigger
      this._modalOpen = false;
      this._exiting = false;
      // cancel global exit fallback timer if still pending
      if (window.__worldExitFallback) {
        clearTimeout(window.__worldExitFallback);
        window.__worldExitFallback = null;
      }
    });

    // Emit zone labels into world
    this._drawZoneLabels();

    // ── WOW Effects — biar luar biasa & ga monoton ─────────────────────
    this._createAtmosphere();
    this._createAmbientParticles();
    this._createZoneDecorations();
    this._createFloatingProps();

    // Low-end device banner
    this._checkDeviceCapability();
  }

  // ── Tilemap Builder ───────────────────────────────────────────────────
  _buildTilemap() {
    const data = this._generateMapData();

    const map = this.make.tilemap({
      data,
      tileWidth:  TILE_SIZE,
      tileHeight: TILE_SIZE,
    });

    const tileset = map.addTilesetImage(TILESET_KEY, TILESET_KEY, TILE_SIZE, TILE_SIZE);

    // Ground layer (non-colliding)
    this._groundLayer = map.createLayer(0, tileset, 0, 0);
    this._groundLayer.setDepth(0);

    // We'll manually define collision using a separate static group
    // (programmatic maps don't support layer.setCollisionByProperty directly)
    // Instead we use a "wall" overlay layer.
    const wallData = this._generateWallData();
    const wallMap  = this.make.tilemap({ data: wallData, tileWidth: TILE_SIZE, tileHeight: TILE_SIZE });
    const wallTileset = wallMap.addTilesetImage(TILESET_KEY, TILESET_KEY, TILE_SIZE, TILE_SIZE);
    this._collisionLayer = wallMap.createLayer(0, wallTileset, 0, 0);
    this._collisionLayer.setDepth(1);
    this._collisionLayer.setCollisionByExclusion([-1]);

    // World physics bounds
    this.physics.world.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);
  }

  /**
   * Generate the ground (floor) tile data as a 2D array.
   * Returns a MAP_HEIGHT × MAP_WIDTH matrix of tile indices.
   */
  _generateMapData() {
    const { FLOOR_WOOD, FLOOR_TILE, FLOOR_CARPET, FLOOR_DARK, PATH } = TILES;
    const rows = [];

    for (let y = 0; y < MAP_HEIGHT; y++) {
      const row = [];
      for (let x = 0; x < MAP_WIDTH; x++) {
        // Zone-based floor colours
        if (this._inZone(x, y, ZONES.ABOUT))    row.push(FLOOR_CARPET);
        else if (this._inZone(x, y, ZONES.PROJECTS)) row.push(FLOOR_DARK);
        else if (this._inZone(x, y, ZONES.SKILLS))   row.push(FLOOR_WOOD);
        else if (this._inZone(x, y, ZONES.CONTACT))  row.push(FLOOR_TILE);
        else row.push(PATH); // corridors / outer area
      }
      rows.push(row);
    }
    return rows;
  }

  /**
   * Generate wall/collision layer — walls around each zone and outer border.
   * Returns -1 (empty / passable) or a wall tile index.
   */
  _generateWallData() {
    const { WALL_TOP, WALL_SIDE, WALL_CORNER } = TILES;
    const grid = Array.from({ length: MAP_HEIGHT }, () =>
      Array(MAP_WIDTH).fill(-1),
    );

    const placeWalls = (zone) => {
      const { x, y, w, h } = zone;
      for (let tx = x; tx < x + w; tx++) {
        grid[y][tx]         = WALL_TOP;
        grid[y + h - 1][tx] = WALL_TOP;
      }
      for (let ty = y; ty < y + h; ty++) {
        grid[ty][x]         = WALL_SIDE;
        grid[ty][x + w - 1] = WALL_SIDE;
      }
      // Corners
      grid[y][x]             = WALL_CORNER;
      grid[y][x + w - 1]     = WALL_CORNER;
      grid[y + h - 1][x]     = WALL_CORNER;
      grid[y + h - 1][x + w - 1] = WALL_CORNER;

      // Door gaps (3-tile opening)
      // Top zones face down (door on bottom wall), bottom zones face up (door on top wall)
      const doorX = Math.floor(x + w / 2) - 1;
      const doorY = (y > 10) ? y : (y + h - 1);
      for (let dx = 0; dx < 3; dx++) {
        grid[doorY][doorX + dx] = -1;
      }
    };

    // Outer border walls
    for (let tx = 0; tx < MAP_WIDTH; tx++) {
      grid[0][tx]              = TILES.WALL_TOP;
      grid[MAP_HEIGHT - 1][tx] = TILES.WALL_TOP;
    }
    for (let ty = 0; ty < MAP_HEIGHT; ty++) {
      grid[ty][0]              = TILES.WALL_SIDE;
      grid[ty][MAP_WIDTH - 1]  = TILES.WALL_SIDE;
    }

    Object.values(ZONES).forEach(placeWalls);

    // ── EXIT door gap at bottom center outer wall (pintu keluar ke halaman utama)
    const exitX = Math.floor(MAP_WIDTH / 2) - 1;
    const exitY = MAP_HEIGHT - 1;
    for (let dx = 0; dx < 3; dx++) grid[exitY][exitX + dx] = -1;

    return grid;
  }

  _inZone(x, y, zone) {
    return x >= zone.x && x < zone.x + zone.w
        && y >= zone.y && y < zone.y + zone.h;
  }

  // ── Interactive Objects Spawner ────────────────────────────────────────
  _spawnInteractiveObjects() {
    const px = (tx) => (tx + 0.5) * TILE_SIZE;
    const py = (ty) => (ty + 0.5) * TILE_SIZE;

    // ── ABOUT ME ──────────────────────────────────────────────────────
    const aboutObj = new InteractiveObject(
      this, px(ZONES.ABOUT.x + 5), py(ZONES.ABOUT.y + 5), {
        id:    'about_board',
        type:  OBJECT_TYPES.ABOUT,
        label: 'About Me',
        data:  profileData,
      },
    );
    this._interactiveObjects.push(aboutObj);

    // ── PROJECTS ───────────────────────────────────────────────────────
    projectsData.forEach((proj, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const obj = new InteractiveObject(
        this,
        px(ZONES.PROJECTS.x + 4 + col * 6),
        py(ZONES.PROJECTS.y + 4 + row * 6),
        {
          id:   proj.mapObjectId,
          type: OBJECT_TYPES.PROJECT,
          label: proj.title,
          data:  proj,
        },
      );
      this._interactiveObjects.push(obj);
    });

    // ── SKILLS ────────────────────────────────────────────────────────
    const skillsObj = new InteractiveObject(
      this, px(ZONES.SKILLS.x + 5), py(ZONES.SKILLS.y + 5), {
        id:   'skills_shelf',
        type: OBJECT_TYPES.SKILLS,
        label: 'Skills',
        data: skillsData,
      },
    );
    this._interactiveObjects.push(skillsObj);

    // ── CONTACT ───────────────────────────────────────────────────────
    const contactObj = new InteractiveObject(
      this, px(ZONES.CONTACT.x + 5), py(ZONES.CONTACT.y + 5), {
        id:   'contact_desk',
        type: OBJECT_TYPES.CONTACT,
        label: 'Contact',
        data: profileData,
      },
    );
    this._interactiveObjects.push(contactObj);

    // ── EXIT DOOR ── Pintu keluar ke halaman utama ──────────────────────
    const exitTx = Math.floor(MAP_WIDTH / 2);
    const exitObj = new InteractiveObject(
      this, px(exitTx), py(MAP_HEIGHT - 2), {
        id:    'exit_door',
        type:  OBJECT_TYPES.EXIT,
        label: '🚪 Exit — Walk in or press E',
        data:  { title: 'Exit' },
      },
    );
    this._interactiveObjects.push(exitObj);
    this._exitObject = exitObj;
  }

  // ── Zone Labels ──────────────────────────────────────────────────────
  _drawZoneLabels() {
    const zoneInfo = [
      { zone: ZONES.ABOUT,    label: '[ ABOUT ME ]',   color: '#a78bfa' },
      { zone: ZONES.PROJECTS, label: '[ PROJECTS ]',   color: '#22d3ee' },
      { zone: ZONES.SKILLS,   label: '[ SKILLS ]',     color: '#34d399' },
      { zone: ZONES.CONTACT,  label: '[ CONTACT ]',    color: '#fbbf24' },
    ];

    // EXIT label at bottom center
    const exitTx = Math.floor(MAP_WIDTH / 2) * TILE_SIZE;
    const exitTy = (MAP_HEIGHT - 1.5) * TILE_SIZE;
    this.add.rectangle(exitTx, exitTy + 6, 42, 14, 0x0f0f1a, 0.85).setDepth(7).setStrokeStyle(1, 0xf59e0b, 0.6);
    this.add.text(exitTx, exitTy + 6, 'EXIT', {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '5px',
      color: '#fbbf24',
    }).setOrigin(0.5).setDepth(8);
    // Arrow pointing down
    const arrow = this.add.text(exitTx, exitTy + 18, '▼', {
      fontFamily: 'monospace', fontSize: '8px', color: '#fbbf24',
    }).setOrigin(0.5).setDepth(8);
    this.tweens.add({ targets: arrow, y: exitTy + 21, alpha: 0.4, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    zoneInfo.forEach(({ zone, label, color }) => {
      const tx = (zone.x + zone.w / 2) * TILE_SIZE;
      const ty = (zone.y + 2) * TILE_SIZE;
      this.add.text(tx, ty, label, {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '5px',
        color,
        stroke: '#000000',
        strokeThickness: 2,
        alpha: 0.75,
      }).setOrigin(0.5).setDepth(8);
    });
  }

  // ── Atmosphere — vignette, scanline, light rays ──────────────────────
  _createAtmosphere() {
    const w = MAP_WIDTH * TILE_SIZE;
    const h = MAP_HEIGHT * TILE_SIZE;
    const isMobile = window.innerWidth < 768;

    // Vignette overlay (fixed to camera)
    const vig = this.add.graphics().setScrollFactor(0).setDepth(100).setAlpha(isMobile ? 0.2 : 0.35);
    vig.fillGradientStyle(0x0f0f1a, 0x0f0f1a, 0x000000, 0x000000, 0.45);
    vig.fillRect(-400, -300, w + 800, 180);
    vig.fillGradientStyle(0x000000, 0x000000, 0x0f0f1a, 0x0f0f1a, 0.45);
    vig.fillRect(-400, h - 100, w + 800, 180);
    // Scanlines — skip on mobile for perf
    if (!isMobile) {
      for (let y = 0; y < h; y += 6) {
        this.add.rectangle(w/2, y, w, 1, 0xffffff, 0.015).setDepth(99);
      }
    }
    // Ambient light bloom per zone — soft glow blobs
    const blooms = [
      { x: ZONES.ABOUT.x + 10, y: ZONES.ABOUT.y + 8, color: 0x7c3aed, alpha: 0.08 },
      { x: ZONES.PROJECTS.x + 11, y: ZONES.PROJECTS.y + 8, color: 0x06b6d4, alpha: 0.07 },
      { x: ZONES.SKILLS.x + 10, y: ZONES.SKILLS.y + 8, color: 0x10b981, alpha: 0.07 },
      { x: ZONES.CONTACT.x + 11, y: ZONES.CONTACT.y + 8, color: 0xf59e0b, alpha: 0.07 },
    ];
    blooms.forEach(b => {
      const c = this.add.circle(b.x * TILE_SIZE, b.y * TILE_SIZE, 90, b.color, b.alpha).setDepth(2).setBlendMode(Phaser.BlendModes.ADD);
      if (!isMobile) this.tweens.add({ targets: c, alpha: b.alpha * 1.6, scale: 1.08, duration: 2500 + Math.random()*1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    });

    // Camera subtle breathing zoom — disable on mobile (mual & perf)
    if (!isMobile) {
      this.tweens.add({
        targets: this.cameras.main,
        zoom: ZOOM * 1.03,
        duration: 4000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  // ── Ambient Particles — fireflies, dust, floating code ───────────────
  _createAmbientParticles() {
    const w = MAP_WIDTH * TILE_SIZE;
    const h = MAP_HEIGHT * TILE_SIZE;
    const isMobile = window.innerWidth < 768;

    // Fireflies / dust — kurangi di mobile
    const fireflyCount = isMobile ? 8 : 22;
    for (let i = 0; i < fireflyCount; i++) {
      const x = Phaser.Math.Between(10, w - 10);
      const y = Phaser.Math.Between(10, h - 10);
      const p = this.add.circle(x, y, Phaser.Math.FloatBetween(1, 2.2), 0xfbbf24, Phaser.Math.FloatBetween(0.3, 0.7)).setDepth(7).setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({
        targets: p,
        x: x + Phaser.Math.Between(-60, 60),
        y: y + Phaser.Math.Between(-40, 40),
        alpha: 0.05,
        duration: Phaser.Math.Between(4000, 8000),
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: i * 120,
      });
      if (!isMobile) this.tweens.add({
        targets: p,
        scale: 1.6,
        duration: 1200,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      });
    }

    // Floating code snippets — skip di mobile
    if (!isMobile) {
      const codes = ['</>', '{ }', '01', '=>', 'npm', 'git', 'vue', 'php', '< />'];
      codes.forEach((txt, i) => {
        const x = Phaser.Math.Between(20, w - 20);
        const y = Phaser.Math.Between(20, h - 20);
        const t = this.add.text(x, y, txt, {
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '5px',
          color: '#2a2a4a',
        }).setOrigin(0.5).setDepth(3).setAlpha(0.35);
        this.tweens.add({
          targets: t,
          y: y - 16,
          alpha: 0.12,
          duration: 3000 + i * 250,
          yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: i * 200,
        });
        this.tweens.add({
          targets: t,
          angle: Phaser.Math.Between(-8, 8),
          duration: 2000 + i * 300,
          yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
      });
    }

    // Twinkling stars — kurangi di mobile
    const starCount = isMobile ? 5 : 12;
    for (let i = 0; i < starCount; i++) {
      const x = Phaser.Math.Between(ZONES.PROJECTS.x * TILE_SIZE + 10, (ZONES.PROJECTS.x + ZONES.PROJECTS.w) * TILE_SIZE - 10);
      const y = Phaser.Math.Between(ZONES.PROJECTS.y * TILE_SIZE + 20, (ZONES.PROJECTS.y + ZONES.PROJECTS.h) * TILE_SIZE - 20);
      const s = this.add.circle(x, y, 0.8, 0xffffff, 0.9).setDepth(4);
      this.tweens.add({ targets: s, alpha: 0.08, duration: 900 + i * 80, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: i * 150 });
    }
  }

  // ── Zone Decorations — props per zone biar ga monoton ────────────────
  _createZoneDecorations() {
    const tx = (x) => x * TILE_SIZE;
    const ty = (y) => y * TILE_SIZE;

    // ABOUT — warm cozy: plants sway, lamp flicker
    const aboutCx = (ZONES.ABOUT.x + ZONES.ABOUT.w/2) * TILE_SIZE;
    const aboutCy = (ZONES.ABOUT.y + ZONES.ABOUT.h/2) * TILE_SIZE;
    // Swaying plants
    ['🌿','🪴','🌱'].forEach((emoji, i) => {
      const px = aboutCx + (i - 1) * 28;
      const py = ty(ZONES.ABOUT.y + ZONES.ABOUT.h - 3);
      const e = this.add.text(px, py, emoji, { fontSize: '14px' }).setOrigin(0.5).setDepth(6);
      this.tweens.add({ targets: e, angle: 4, duration: 1600 + i*200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: e, y: py - 2, duration: 1800 + i*200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: i*300 });
    });
    // Lamp glow pulse
    const lamp = this.add.circle(tx(ZONES.ABOUT.x + 3), ty(ZONES.ABOUT.y + 3), 14, 0xfbbf24, 0.18).setDepth(5).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: lamp, alpha: 0.32, scale: 1.2, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // PROJECTS — tech lab: monitors flicker, neon
    for (let i = 0; i < 3; i++) {
      const mx = tx(ZONES.PROJECTS.x + 5 + i*6);
      const my = ty(ZONES.PROJECTS.y + 4);
      const scr = this.add.rectangle(mx, my, 16, 10, 0x0f172a).setDepth(5).setStrokeStyle(1, 0x06b6d4, 0.6);
      const glow = this.add.rectangle(mx, my, 12, 6, 0x06b6d4, 0.35).setDepth(6).setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({ targets: glow, alpha: 0.08, duration: 400 + i*150, yoyo: true, repeat: -1, ease: 'Stepped', delay: i*200 });
      this.tweens.add({ targets: scr, y: my - 1, duration: 2000 + i*400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    // SKILLS — library: floating books sparkle
    ['📘','📗','📙'].forEach((emoji, i) => {
      const bx = tx(ZONES.SKILLS.x + 6 + i*4);
      const by = ty(ZONES.SKILLS.y + 5);
      const b = this.add.text(bx, by, emoji, { fontSize: '12px' }).setOrigin(0.5).setDepth(6);
      this.tweens.add({ targets: b, y: by - 4, duration: 1700 + i*250, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: i*250 });
      // sparkle
      const sp = this.add.circle(bx + 6, by - 4, 1, 0x34d399, 0.9).setDepth(7).setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({ targets: sp, alpha: 0, scale: 2, duration: 1400, repeat: -1, delay: i*600, ease: 'Sine.easeInOut' });
    });

    // CONTACT — mail vibe: floating envelope, heart pulse
    const ex = tx(ZONES.CONTACT.x + ZONES.CONTACT.w/2);
    const ey = ty(ZONES.CONTACT.y + 6);
    const env = this.add.text(ex, ey, '✉️', { fontSize: '18px' }).setOrigin(0.5).setDepth(6);
    this.tweens.add({ targets: env, y: ey - 5, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: env, angle: 5, duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    const heart = this.add.text(ex + 18, ey - 6, '💌', { fontSize: '10px' }).setOrigin(0.5).setDepth(7);
    this.tweens.add({ targets: heart, y: ey - 14, alpha: 0.2, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 600 });

    // EXIT — door frame at bottom center
    const exX = Math.floor(MAP_WIDTH / 2) * TILE_SIZE;
    const exY = (MAP_HEIGHT - 1) * TILE_SIZE + 8;
    // door frame visual (2 pillars + top)
    this.add.rectangle(exX - 10, exY - 4, 4, 16, 0x78350f).setDepth(5);
    this.add.rectangle(exX + 10, exY - 4, 4, 16, 0x78350f).setDepth(5);
    this.add.rectangle(exX, exY - 12, 24, 4, 0x92400e).setDepth(5);
    // glowing exit portal
    const portal = this.add.rectangle(exX, exY - 2, 14, 12, 0xf59e0b, 0.28).setDepth(6).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: portal, alpha: 0.12, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    const exitIcon = this.add.text(exX, exY - 2, '🚪', { fontSize: '10px' }).setOrigin(0.5).setDepth(7);
    this.tweens.add({ targets: exitIcon, y: exY - 4, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  // ── Floating Props — clouds, petals biar world hidup ─────────────────
  _createFloatingProps() {
    const w = MAP_WIDTH * TILE_SIZE;
    // Slow clouds (semi-transparent rects)
    for (let i = 0; i < 4; i++) {
      const y = Phaser.Math.Between(30, 120);
      const cloud = this.add.rectangle(Phaser.Math.Between(-80, w), y, Phaser.Math.Between(80, 140), 12, 0xffffff, 0.06).setDepth(8).setScrollFactor(0.3);
      this.tweens.add({ targets: cloud, x: w + 100, duration: 25000 + i*5000, repeat: -1, ease: 'Linear', delay: i*3000 });
    }
    // Corridor light spots on ground
    for (let i = 0; i < 6; i++) {
      const x = Phaser.Math.Between(8, w-8);
      const y = Phaser.Math.Between(8, MAP_HEIGHT*TILE_SIZE-8);
      const spot = this.add.circle(x, y, 10, 0xffffff, 0.025).setDepth(2).setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({ targets: spot, alpha: 0.06, duration: 3000 + i*400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
  }

  // ── Audio — World lo-fi cozy exploration (118 BPM) ─────────────────
  _setupAudio(muted) {
    this._muted = muted;
    AudioManager.init(this);
    AudioManager.setMuted(muted);
    // Crossfade from menu BGM to world BGM
    AudioManager.playBGM(this, 'bgm_world', { volume: 0.30 });
    this._bgm = AudioManager._bgm;
  }

  toggleMute() {
    const nowMuted = AudioManager.toggle();
    this._muted = nowMuted;
    SaveManager.saveMutePreference(nowMuted);
    this._bgm = AudioManager._bgm;
    return nowMuted;
  }

  // ── Update Loop ───────────────────────────────────────────────────────
  update() {
    if (this._modalOpen || this._exiting) return;
    if (!this._player || !this._proximityMgr || !this._inputController) return;

    this._player.update();
    this._proximityMgr.update();

    // Jump — Space / ⤒ button, biar ga monoton cuma jalan
    if (this._inputController.isJumpJustPressed()) {
      this._player.jump();
    }

    // Auto-exit jika injak pintu — tidak perlu tekan E (lebih intuitif)
    if (this._exitObject && this._player) {
      const dx = this._player.x - this._exitObject.x;
      const dy = this._player.y - this._exitObject.y;
      if (Math.hypot(dx, dy) < 26) {
        this._exitToMenu();
        return;
      }
    }

    // Interaction — E (Space sekarang khusus jump)
    if (this._inputController.isActionJustPressed()) {
      const obj = this._proximityMgr.nearestObject;
      if (obj) {
        AudioManager.playSFX(this, 'sfx_interact', { volume: 0.6 });
        this._openModal(obj);
      }
    }

    // Auto-save position every 5 seconds (approximate via frame count)
    if (this.game.getFrame() % 300 === 0) {
      SaveManager.savePosition(this._player.x, this._player.y);
    }
  }

  // ── Exit to Main Menu ────────────────────────────────────────────────
  // Hanya via pintu — tidak lagi via tombol HUD kanan atas
  _exitToMenu() {
    if (this._exiting) return;
    if (this._modalOpen) return;
    this._exiting = true;

    // cegah double trigger via pintu / ESC
    if (window.__worldExitFallback) {
      clearTimeout(window.__worldExitFallback);
      window.__worldExitFallback = null;
    }

    try { AudioManager.playSFX(this, 'sfx_close', { volume: 0.6 }); } catch {}

    // reset spawn ke tengah biar tidak spawn di dinding pintu
    SaveManager.savePosition(PLAYER_SPAWN.x * TILE_SIZE, PLAYER_SPAWN.y * TILE_SIZE);

    // stop audio & visual
    AudioManager.stopAllImmediate();
    try { this.sound.stopAll(); } catch {}
    try { this.tweens.killAll(); } catch {}
    try { this.cameras.main.stopFollow(); } catch {}

    // bersihkan DOM HUD — supaya tidak kebawa ke MainMenu (penyebab hang)
    document.getElementById('hud')?.remove();
    document.getElementById('virtual-dpad')?.remove();
    document.getElementById('btn-action')?.remove();
    document.getElementById('btn-jump')?.remove();
    document.getElementById('interaction-indicator')?.classList.add('hidden');
    document.getElementById('lite-mode-banner')?.remove();

    // stop UI dulu
    try {
      if (this.scene.isActive(SCENE_KEYS.UI)) this.scene.stop(SCENE_KEYS.UI);
    } catch {}

    // langsung pindah ke MainMenu — JANGAN pakai camerafadeoutcomplete
    // event itu sering tidak fire kalau scene di-stop di dalam callback → hang
    // pakai timeout global yang reliable
    window.__worldExitFallback = setTimeout(() => {
      window.__worldExitFallback = null;
      try {
        if (this.scene.isActive(SCENE_KEYS.WORLD)) {
          this.scene.start(SCENE_KEYS.MAIN_MENU);
        } else {
          // fallback kalau scene sudah mati — reload aman
          if (!this.scene.isActive(SCENE_KEYS.MAIN_MENU)) this.scene.start(SCENE_KEYS.MAIN_MENU);
        }
      } catch (e) {
        console.warn('[World] exit failed, reload', e);
        window.location.reload();
      }
    }, 120);
  }

  // ── Modal Management ───────────────────────────────────────────────────
  _openModal(obj) {
    // Exit door — langsung keluar, bukan modal
    if (obj.type === OBJECT_TYPES.EXIT) {
      this._exitToMenu();
      return;
    }
    this._modalOpen = true;
    this.scene.pause();

    let modal;
    switch (obj.type) {
      case OBJECT_TYPES.PROJECT:
        modal = new ProjectModal(obj.data);
        break;
      case OBJECT_TYPES.SKILLS:
        modal = new SkillsModal(obj.data);
        break;
      case OBJECT_TYPES.ABOUT:
        modal = new AboutModal(obj.data);
        break;
      case OBJECT_TYPES.CONTACT:
        modal = new ContactModal(obj.data);
        break;
      default:
        this._modalOpen = false;
        this.scene.resume();
        return;
    }

    modal.open(() => this._closeModal());
    this._activeModal = modal;

    // Play SFX — retro RPG dialog open
    AudioManager.playSFX(this, 'sfx_open', { volume: 0.6 });
  }

  _closeModal() {
    if (!this._modalOpen) return;
    this._modalOpen = false;
    this._activeModal?.close();
    this._activeModal = null;
    AudioManager.playSFX(this, 'sfx_close', { volume: 0.5 });
    this.scene.resume();
  }

  // ── Device Capability Check ───────────────────────────────────────────
  _checkDeviceCapability() {
    const cores = navigator.hardwareConcurrency || 4;
    const isLowEnd = cores < 4 || window.innerWidth < 480 || /Android.*Chrome\/[.0-9]*\s/.test(navigator.userAgent);
    if (!isLowEnd) return;

    const banner = document.createElement('div');
    banner.id = 'lite-mode-banner';
    banner.innerHTML = `
      <div style="
        position:fixed; top:0; left:0; right:0; z-index:9998;
        background:rgba(15,15,26,0.95); border-bottom:1px solid #2a2a4a;
        padding:10px 16px; display:flex; align-items:center; justify-content:space-between;
        font-family:'Inter',sans-serif; font-size:0.78rem; color:#94a3b8;
        backdrop-filter:blur(8px);
      ">
        <span>⚡ This device may experience performance issues. Try <strong style="color:#06b6d4">Lite Mode</strong> for a smoother experience.</span>
        <div style="display:flex;gap:8px;flex-shrink:0;">
          <button onclick="document.getElementById('lite-mode-banner').remove()" style="background:none;border:1px solid #334155;border-radius:6px;padding:4px 10px;color:#94a3b8;cursor:pointer;font-size:0.75rem;">Dismiss</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
  }
}
