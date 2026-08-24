/**
 * gameConfig.js — All magic numbers and constants in one place.
 * Edit here instead of hunting through scene/entity files.
 */

export const TILE_SIZE = 16;        // px per tile
export const MAP_WIDTH  = 48;       // tiles wide
export const MAP_HEIGHT = 36;       // tiles tall
export const ZOOM = 3;              // camera zoom (16px tiles → 48px rendered)

export const PLAYER_SPEED    = 150; // px/s
export const INTERACT_RADIUS = 52;  // px — proximity trigger distance (world space, before zoom)
export const INTERACT_KEY    = 'E';

export const SCENE_KEYS = {
  BOOT:      'BootScene',
  MAIN_MENU: 'MainMenuScene',
  WORLD:     'WorldScene',
  UI:        'UIScene',
};

export const TILESET_KEY = 'office_tileset';
export const PLAYER_KEY  = 'player';

// Tileset tile indices (0-based, row-major within the PNG)
export const TILES = {
  FLOOR_WOOD:    0,
  FLOOR_TILE:    1,
  FLOOR_CARPET:  2,
  WALL_TOP:      3,
  WALL_SIDE:     4,
  WALL_CORNER:   5,
  DESK:          6,
  SHELF:         7,
  PLANT:         8,
  COMPUTER:      9,
  ARCADE:        10,
  DOOR:          11,
  RUG:           12,
  WINDOW:        13,
  LAMP:          14,
  CHAIR:         15,
  // Decorative (non-colliding)
  FLOOR_DARK:    16,
  PATH:          17,
};

// Interactive object types
export const OBJECT_TYPES = {
  PROJECT: 'project',
  SKILLS:  'skills',
  ABOUT:   'about',
  CONTACT: 'contact',
  EXIT:    'exit',
};

// Zone spawn point (tile coordinates for player start)
export const PLAYER_SPAWN = { x: 24, y: 18 };

// Audio keys
export const AUDIO = {
  BGM_WORLD:    'bgm_world',
  SFX_INTERACT: 'sfx_interact',
  SFX_OPEN:     'sfx_open',
  SFX_STEP:     'sfx_step',
};

// Map zone regions (in tiles) — used for visual theming
export const ZONES = {
  ABOUT:   { x: 1,  y: 1,  w: 20, h: 16 },
  PROJECTS:{ x: 25, y: 1,  w: 22, h: 16 },
  SKILLS:  { x: 1,  y: 19, w: 20, h: 16 },
  CONTACT: { x: 25, y: 19, w: 22, h: 16 },
};
