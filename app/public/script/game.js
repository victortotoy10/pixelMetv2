import { loadLevel } from "./loader.js";

const BASE_TILE_SIZE = 16; // Original size of a tile in your sprite sheet
const SCALE_FACTOR = 5;    // Adjust this value to make your terrain bigger
const TILE_SIZE = BASE_TILE_SIZE * SCALE_FACTOR; // Actual size of the tile on the canvas

const BASE_CANVAS_WIDTH = 640; // Scaled width of your canvas
const BASE_CANVAS_HEIGHT = 480; // Scaled height of your canvas

const floorCanvas = document.getElementById("floorCanvas");
const floorCtx = floorCanvas.getContext("2d");
floorCanvas.width = BASE_CANVAS_WIDTH;
floorCanvas.height = BASE_CANVAS_HEIGHT;

const spritesCanvas = document.getElementById("spritesCanvas");
const spritesCtx = spritesCanvas.getContext("2d");
spritesCanvas.width = BASE_CANVAS_WIDTH;
spritesCanvas.height = BASE_CANVAS_HEIGHT;

let npcs = [];
let objects = [];
let backgroundImage = null;

function startGame(levelName) {
  loadLevel(levelName)
    .then(levelData => {
      console.log(`Level ${levelName} loaded successfully.`);

      loadBackground(levelData.background);
      loadNPCs(levelData.npcs);
      loadObjects(levelData.objects);

      requestAnimationFrame(gameLoop);
    })
    .catch(err => console.error(err));
}

function loadBackground(tilesetUrl) {
  backgroundImage = new Image();
  backgroundImage.src = tilesetUrl;
  backgroundImage.onload = () => {
    console.log("Tileset loaded successfully:", tilesetUrl);
    drawChessBoard(); // Call the function that draws the background with tiles
  };
  backgroundImage.onerror = () => {
    console.error("Failed to load tileset:", tilesetUrl);
  };
}

function drawChessBoard() {
  for (let y = 0; y < BASE_CANVAS_HEIGHT / TILE_SIZE; y++) {
    for (let x = 0; x < BASE_CANVAS_WIDTH / TILE_SIZE; x++) {
      const isDark = (x + y) % 2 === 0;

      const srcX = isDark ? 40 : 20;
      const srcY = 20;

      floorCtx.drawImage(
        backgroundImage,
        srcX, srcY,
        BASE_TILE_SIZE, BASE_TILE_SIZE, // Use BASE_TILE_SIZE for the source (what is cut from the sprite sheet)
        x * TILE_SIZE, y * TILE_SIZE,   // Destination on the canvas (scaled position)
        TILE_SIZE, TILE_SIZE            // Size on the canvas (scaled size)
      );
    }
  }
}

function loadNPCs(npcData) {
  npcs = npcData.map(npc => {
    const img = new Image();
    img.src = npc.sprite;
    return {
      ...npc,
      img,
      // Scale the position and size of the NPC
      x: npc.x * SCALE_FACTOR,
      y: npc.y * SCALE_FACTOR,
      width: (npc.width || BASE_TILE_SIZE) * SCALE_FACTOR, // Use npc's width/height if available; otherwise, use the base tile size
      height: (npc.height || BASE_TILE_SIZE) * SCALE_FACTOR
    };
  });
}

function loadObjects(objectData) {
  objects = objectData.map(obj => {
    return {
      ...obj,
      srcX: obj.tileCol * BASE_TILE_SIZE, // Continue using BASE_TILE_SIZE for the source
      srcY: obj.tileRow * BASE_TILE_SIZE, // Continue using BASE_TILE_SIZE for the source
      // Scale the position of the object
      x: obj.x * SCALE_FACTOR,
      y: obj.y * SCALE_FACTOR
    };
  });
}

function gameLoop() {
  // Clear the sprites canvas for the next frame
  spritesCtx.clearRect(0, 0, BASE_CANVAS_WIDTH, BASE_CANVAS_HEIGHT);

  // Render NPCs
  npcs.forEach(npc => {
    if (npc.img.complete) {
      // Draw NPCs with scaled dimensions
      spritesCtx.drawImage(npc.img, npc.x, npc.y, npc.width, npc.height);
    }
  });

  // Render objects
  objects.forEach(obj => {
    spritesCtx.drawImage(
      backgroundImage,
      obj.srcX, obj.srcY,
      BASE_TILE_SIZE, BASE_TILE_SIZE, // Source size from the sprite sheet
      obj.x, obj.y,                   // Destination on the canvas (scaled position)
      TILE_SIZE, TILE_SIZE            // Scaled size on the canvas
    );
  });

  requestAnimationFrame(gameLoop);
}

startGame("level-1");