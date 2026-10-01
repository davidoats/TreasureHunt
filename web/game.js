(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const startOverlay = document.getElementById('startOverlay');
  const startButton = document.getElementById('startButton');

  const SCREEN_W = 1024;
  const SCREEN_H = 768;
  const WORLD_COLS = 50;
  const WORLD_ROWS = 50;
  const BASE_TILE = 64;
  const MIN_TILE = 32;
  const MAX_TILE = 64;
  const BASE_SPEED_TILES_PER_SEC = 7.5;

  // Embedded map data so the game works when index.html is opened with file://.
  const WORLD_MAP = [
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,2,2,2,2,2,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,1,1,1,1,1,4,4,4,4,4,4,4,4,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,1,3,3,3,1,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,4,4,4,4,0,5,5,5,5,5,5,5,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,1,3,3,3,1,4,4,4,4,4,4,4,4,0,0,0,0,0,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,1,3,3,3,1,4,4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,1,3,3,3,1,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,1,1,3,1,1,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,0,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,0,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,0,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,0,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,4,4,4,4,4,4,4,4,4,4,4,4,4,0,5,0,4,4,4,4,4,4,4,4,4,4,4,5,5,5,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,4,4,4,4,4,4,4,4,4,4,4,4,0,0,5,0,0,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,4,4,4,4,4,4,4,4,4,4,4,0,0,0,5,0,0,0,4,4,4,4,4,4,4,4,5,5,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,4,4,4,0,4,4,4,4,4,4,4,0,0,0,5,0,0,0,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,4,4,4,0,4,4,4,4,4,4,4,4,0,0,5,0,0,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,4,4,4,0,4,4,4,4,4,4,4,4,4,0,5,0,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,4,4,4,0,0,0,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,4,4,4,4,4,0,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,4,4,4,4,4,0,4,4,4,4,4,4,4,4,5,4,4,4,0,4,4,4,4,4,4,4,0,5,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,4,4,4,4,1,0,1,4,4,4,4,4,4,4,5,4,4,4,4,4,4,0,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,0,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,0,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,0,4,4,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,0,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,4,0,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,0,4,4,4,4,4,0,0,0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,4,4,4,4,4,0,0,4,0,0,4,0,0,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]
  ];

  const TILE_FILES = [
    'res/tiles/grass.png',
    'res/tiles/wall.png',
    'res/tiles/water.png',
    'res/tiles/earth.png',
    'res/tiles/tree.png',
    'res/tiles/sand.png'
  ];
  const TILE_COLLISION = [false, true, true, false, true, false];

  const IMAGE_FILES = {
    key: 'res/objects/key.png',
    door: 'res/objects/door.png',
    chest: 'res/objects/chest.png',
    boots: 'res/objects/boots.png',
    up1: 'res/player/boy_up_1.png',
    up2: 'res/player/boy_up_2.png',
    down1: 'res/player/boy_down_1.png',
    down2: 'res/player/boy_down_2.png',
    left1: 'res/player/boy_left_1.png',
    left2: 'res/player/boy_left_2.png',
    right1: 'res/player/boy_right_1.png',
    right2: 'res/player/boy_right_2.png'
  };

  const sounds = {
    music: new Audio('res/sound/BlueBoyAdventure.wav'),
    coin: new Audio('res/sound/coin.wav'),
    fanfare: new Audio('res/sound/fanfare.wav'),
    powerup: new Audio('res/sound/powerup.wav'),
    unlock: new Audio('res/sound/unlock.wav')
  };
  sounds.music.loop = true;
  sounds.music.volume = 0.55;

  const images = {};
  const tiles = [];
  let map = [];
  let running = false;
  let lastTime = 0;
  let tileSize = BASE_TILE;
  let message = '';
  let messageUntil = 0;
  let gameFinished = false;
  let animationClock = 0;
  let spriteFrame = 1;

  const keysDown = new Set();

  const player = {
    x: 23,
    y: 21,
    direction: 'down',
    keyCount: 0,
    speedMultiplier: 1,
    // Java solidArea: 20,24,24,32 in a 64px tile.
    hitbox: { x: 20 / 64, y: 24 / 64, w: 24 / 64, h: 32 / 64 }
  };

  let objects = [];

  function resetObjects() {
    objects = [
      { type: 'key',   x: 23, y: 7,  collision: false, active: true },
      { type: 'key',   x: 23, y: 40, collision: false, active: true },
      { type: 'chest', x: 9,  y: 7,  collision: false, active: true },
      { type: 'door',  x: 10, y: 11, collision: true,  active: true },
      { type: 'key',   x: 37, y: 7,  collision: false, active: true },
      { type: 'door',  x: 14, y: 28, collision: true,  active: true },
      { type: 'door',  x: 8,  y: 20, collision: true,  active: true },
      { type: null,    x: 0,  y: 0,  collision: false, active: false },
      { type: 'boots', x: 37, y: 42, collision: false, active: true }
    ];
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Could not load ${src}`));
      img.src = src;
    });
  }

  async function loadAssets() {
    const tileImgs = await Promise.all(TILE_FILES.map(loadImage));
    tileImgs.forEach((img, i) => tiles[i] = img);

    await Promise.all(Object.entries(IMAGE_FILES).map(async ([name, src]) => {
      images[name] = await loadImage(src);
    }));

    // Use the embedded row-major map instead of fetch(), which browsers block
    // for local file:// pages.
    map = WORLD_MAP.map(row => row.slice());
  }

  function playSound(name) {
    const source = sounds[name];
    if (!source) return;
    source.currentTime = 0;
    source.play().catch(() => {});
  }

  function showMessage(text) {
    message = text;
    messageUntil = performance.now() + 2000;
  }

  function playerRectAt(x, y) {
    const h = player.hitbox;
    return { x: x + h.x, y: y + h.y, w: h.w, h: h.h };
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function tileBlocked(col, row) {
    if (col < 0 || row < 0 || col >= WORLD_COLS || row >= WORLD_ROWS) return true;
    return TILE_COLLISION[map[row][col]] === true;
  }

  function hitsBlockedTile(rect) {
    const left = Math.floor(rect.x);
    const right = Math.floor(rect.x + rect.w - 0.0001);
    const top = Math.floor(rect.y);
    const bottom = Math.floor(rect.y + rect.h - 0.0001);
    return tileBlocked(left, top) || tileBlocked(right, top) || tileBlocked(left, bottom) || tileBlocked(right, bottom);
  }

  function findCollidingObject(rect) {
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      if (!obj || !obj.active || !obj.type) continue;
      // SuperObject solidArea is 0,0,48,48 in a 64px tile.
      const objRect = { x: obj.x, y: obj.y, w: 48 / 64, h: 48 / 64 };
      if (rectsOverlap(rect, objRect)) return i;
    }
    return -1;
  }

  function interactObject(index) {
    if (index < 0) return false;
    const obj = objects[index];
    if (!obj?.active) return false;

    switch (obj.type) {
      case 'key':
        player.keyCount++;
        obj.active = false;
        playSound('coin');
        showMessage('You got a key!');
        return false;

      case 'door':
        if (player.keyCount > 0) {
          obj.active = false;
          player.keyCount--;
          playSound('unlock');
          showMessage("You've opened the door!");
          return false;
        }
        showMessage('You need a key to enter!');
        return true;

      case 'chest':
        if (!gameFinished) {
          gameFinished = true;
          sounds.music.pause();
          playSound('fanfare');
        }
        return false;

      case 'boots':
        player.speedMultiplier = 1.25;
        obj.active = false;
        playSound('powerup');
        return false;

      default:
        return obj.collision === true;
    }
  }

  function tryMove(dx, dy) {
    if (gameFinished) return;
    const nextX = player.x + dx;
    const nextY = player.y + dy;
    const nextRect = playerRectAt(nextX, nextY);

    if (hitsBlockedTile(nextRect)) return;

    const objectIndex = findCollidingObject(nextRect);
    if (objectIndex >= 0) {
      const blocks = interactObject(objectIndex);
      if (blocks) return;
    }

    player.x = nextX;
    player.y = nextY;
  }

  function update(dt) {
    const zoomHeld = keysDown.has('v');
    const zoomRate = 120; // pixels of tile size per second, matching the rapid Java zoom.
    if (zoomHeld) tileSize = Math.max(MIN_TILE, tileSize - zoomRate * dt);
    else tileSize = Math.min(MAX_TILE, tileSize + zoomRate * dt);

    let direction = null;
    // Same priority order as the Java version.
    if (keysDown.has('w') || keysDown.has('arrowup')) direction = 'up';
    else if (keysDown.has('s') || keysDown.has('arrowdown')) direction = 'down';
    else if (keysDown.has('d') || keysDown.has('arrowright')) direction = 'right';
    else if (keysDown.has('a') || keysDown.has('arrowleft')) direction = 'left';

    if (direction && !gameFinished) {
      player.direction = direction;
      const dist = BASE_SPEED_TILES_PER_SEC * player.speedMultiplier * dt;
      if (direction === 'up') tryMove(0, -dist);
      if (direction === 'down') tryMove(0, dist);
      if (direction === 'left') tryMove(-dist, 0);
      if (direction === 'right') tryMove(dist, 0);

      animationClock += dt;
      if (animationClock >= 0.133) {
        spriteFrame = spriteFrame === 1 ? 2 : 1;
        animationClock = 0;
      }
    }
  }

  function camera() {
    return {
      x: player.x * tileSize - (SCREEN_W / 2 - tileSize / 2),
      y: player.y * tileSize - (SCREEN_H / 2 - tileSize / 2)
    };
  }

  function drawWorld(cam) {
    const minCol = Math.max(0, Math.floor(cam.x / tileSize) - 2);
    const maxCol = Math.min(WORLD_COLS - 1, Math.ceil((cam.x + SCREEN_W) / tileSize) + 2);
    const minRow = Math.max(0, Math.floor(cam.y / tileSize) - 2);
    const maxRow = Math.min(WORLD_ROWS - 1, Math.ceil((cam.y + SCREEN_H) / tileSize) + 2);

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const tileNum = map[row][col];
        const img = tiles[tileNum];
        if (!img) continue;
        const sx = Math.round(col * tileSize - cam.x);
        const sy = Math.round(row * tileSize - cam.y);
        const s = Math.ceil(tileSize) + 1;
        ctx.drawImage(img, sx, sy, s, s);
      }
    }
  }

  function drawObjects(cam) {
    for (const obj of objects) {
      if (!obj || !obj.active || !obj.type) continue;
      const img = images[obj.type];
      if (!img) continue;
      const sx = obj.x * tileSize - cam.x;
      const sy = obj.y * tileSize - cam.y;
      if (sx < -tileSize * 2 || sy < -tileSize * 2 || sx > SCREEN_W + tileSize || sy > SCREEN_H + tileSize) continue;
      ctx.drawImage(img, Math.round(sx), Math.round(sy), Math.ceil(tileSize), Math.ceil(tileSize));
    }
  }

  function drawPlayer() {
    const name = `${player.direction}${spriteFrame}`;
    const img = images[name] || images.down1;
    const screenX = SCREEN_W / 2 - tileSize / 2;
    const screenY = SCREEN_H / 2 - tileSize / 2;
    ctx.drawImage(img, Math.round(screenX), Math.round(screenY), Math.ceil(tileSize), Math.ceil(tileSize));
  }

  function drawUI(now) {
    ctx.fillStyle = '#fff';
    ctx.font = '40px Arial, sans-serif';
    ctx.textBaseline = 'alphabetic';

    if (gameFinished) {
      const text = 'You Found the Treasure!';
      const width = ctx.measureText(text).width;
      ctx.fillText(text, SCREEN_W / 2 - width / 2, SCREEN_H / 2);
      return;
    }

    ctx.drawImage(images.key, tileSize / 2, tileSize / 2, tileSize, tileSize);
    ctx.fillText(`x ${player.keyCount}`, 95, 80);

    if (now < messageUntil) {
      ctx.font = '30px Arial, sans-serif';
      ctx.fillText(message, 420, 300);
    }
  }

  function draw(now) {
    ctx.clearRect(0, 0, SCREEN_W, SCREEN_H);
    const cam = camera();
    drawWorld(cam);
    drawObjects(cam);
    drawPlayer();
    drawUI(now);
  }

  function frame(now) {
    if (!running) return;
    if (!lastTime) lastTime = now;
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    update(dt);
    draw(now);
    requestAnimationFrame(frame);
  }

  function normalizedKey(event) {
    return event.key.toLowerCase();
  }

  window.addEventListener('keydown', event => {
    const key = normalizedKey(event);
    if (['w','a','s','d','v','arrowup','arrowdown','arrowleft','arrowright'].includes(key)) {
      event.preventDefault();
      keysDown.add(key);
    }
  }, { passive: false });

  window.addEventListener('keyup', event => {
    keysDown.delete(normalizedKey(event));
  });

  window.addEventListener('blur', () => keysDown.clear());

  async function start() {
    startOverlay.classList.add('hidden');
    try {
      sounds.music.currentTime = 0;
      await sounds.music.play();
    } catch (_) {
      // Browsers can still block audio in edge cases; gameplay continues.
    }
    lastTime = performance.now();
    running = true;
    requestAnimationFrame(frame);
  }

  resetObjects();
  loadAssets()
    .then(() => {
      draw(performance.now());
      startButton.disabled = false;
      startButton.addEventListener('click', start, { once: true });
    })
    .catch(err => {
      console.error(err);
      startButton.textContent = 'Failed to load game';
      startButton.disabled = true;
    });
})();
