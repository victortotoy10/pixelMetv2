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

// === Imagen de fondo ===
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

// === Cargar imagen de fondo ===
function loadBackground(backgroundUrl) {
  backgroundImage = new Image();
  backgroundImage.src = backgroundUrl;
  backgroundImage.onload = () => {
    console.log("Background image loaded successfully:", backgroundUrl);
    drawBackground();
  };
  backgroundImage.onerror = () => {
    console.error("Failed to load background image:", backgroundUrl);
  };
}

// === Dibujar la imagen de fondo ===
function drawBackground() {
  // Limpiar el canvas
  floorCtx.clearRect(0, 0, BASE_CANVAS_WIDTH, BASE_CANVAS_HEIGHT);
  
  // Dibujar la imagen de fondo escalada para cubrir todo el canvas
  floorCtx.drawImage(
    backgroundImage,
    0, 0,
    BASE_CANVAS_WIDTH, BASE_CANVAS_HEIGHT
  );
}

// === Redimensionar canvas y volver a dibujar fondo ===
function resizeGame() {
  BASE_CANVAS_WIDTH = window.innerWidth;
  BASE_CANVAS_HEIGHT = window.innerHeight;
  floorCanvas.width = BASE_CANVAS_WIDTH;
  floorCanvas.height = BASE_CANVAS_HEIGHT;
  drawBackground();
}

window.addEventListener('resize', resizeGame);

// === Iniciar ===
startGame("level-1");
