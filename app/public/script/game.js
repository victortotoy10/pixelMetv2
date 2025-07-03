import { loadLevel } from "./loader.js";

// === Parámetros base para escalado y tamaño de tiles ===
const BASE_TILE_SIZE = 10; // Tamaño original de cada tile en el tileset
const PIXEL_SCALE = 6;     // Escalado global de pixel art
const TILE_SIZE = BASE_TILE_SIZE * PIXEL_SCALE;

// === Tamaño del canvas ===
let BASE_CANVAS_WIDTH = window.innerWidth;
let BASE_CANVAS_HEIGHT = window.innerHeight;

// === Canvas y contexto para dibujar el terreno ===
const floorCanvas = document.getElementById("floorCanvas");
const floorCtx = floorCanvas.getContext("2d");
floorCanvas.width = BASE_CANVAS_WIDTH;
floorCanvas.height = BASE_CANVAS_HEIGHT;
floorCtx.imageSmoothingEnabled = false;

// === Imagen del tileset (terreno) ===
let backgroundImage = null;

// === Inicia el juego cargando el nivel ===
function startGame(levelName) {
  loadLevel(levelName)
    .then(levelData => {
      console.log(`Level ${levelName} loaded successfully.`);
      loadBackground(levelData.background);
    })
    .catch(err => console.error(err));
}

// === Cargar imagen del tileset de terreno ===
function loadBackground(tilesetUrl) {
  backgroundImage = new Image();
  backgroundImage.src = tilesetUrl;
  backgroundImage.onload = () => {
    console.log("Tileset loaded successfully:", tilesetUrl);
    drawChessBoard();
  };
  backgroundImage.onerror = () => {
    console.error("Failed to load tileset:", tilesetUrl);
  };
}

// === Dibujar el terreno como tablero de ajedrez ===
// Recorre el canvas pintando tiles oscuros y claros alternados
function drawChessBoard() {
  for (let y = 0; y < Math.ceil(BASE_CANVAS_HEIGHT / TILE_SIZE); y++) {
    for (let x = 0; x < Math.ceil(BASE_CANVAS_WIDTH / TILE_SIZE); x++) {
      const isDark = (x + y) % 2 === 0;
      const srcX = isDark ? 37 : 20; // Posiciones en el tileset para tile oscuro/claro
      const srcY = 20;
      floorCtx.drawImage(
        backgroundImage,
        srcX, srcY,
        BASE_TILE_SIZE, BASE_TILE_SIZE,
        x * TILE_SIZE, y * TILE_SIZE,
        TILE_SIZE, TILE_SIZE
      );
    }
  }
}

// === Redimensionar canvas y volver a dibujar terreno ===
function resizeGame() {
  BASE_CANVAS_WIDTH = window.innerWidth;
  BASE_CANVAS_HEIGHT = window.innerHeight;
  floorCanvas.width = BASE_CANVAS_WIDTH;
  floorCanvas.height = BASE_CANVAS_HEIGHT;
  drawChessBoard();
}

window.addEventListener('resize', resizeGame);

// === Iniciar ===
startGame("level-1");
