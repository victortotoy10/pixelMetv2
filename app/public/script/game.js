const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();
playerImage.src = '/assets/sprites/personaje.png';

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillRect(100,50,100,100);
  // ctx.drawImage(playerImage, sx, sy, sw, sh, dx,dw,dh);
  // ctx.drawImage(playerImage, 0, 0, 1, 1, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  requestAnimationFrame(animate);


} 
animate();