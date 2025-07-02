# 🕹️ Exit the Castle — Documentación del Juego

Este proyecto es un juego de estilo retro desarrollado con JavaScript puro y renderizado mediante `Canvas`. El jugador debe abrirse paso combatiendo enemigos, recolectando llaves y cruzando puertas para avanzar entre niveles.

---

## 📦 Estructura General

- `game.js`: contiene toda la lógica del juego
- `output_tileset.png`: spritesheet que incluye terreno, enemigos, proyectiles, etc.
- `new_player.png`: sprite separado para el personaje
- `public/`: carpeta donde se alojan las imágenes
- `index.html`: inserta y carga el canvas del juego

---

## 🎯 Objetivo

- Controlar al jugador con WASD o flechas
- Disparar con el mouse
- Eliminar enemigos y recoger la llave
- Llegar a la puerta y avanzar de nivel
- Sobrevivir tantos niveles como sea posible

---

## 🧱 Sistema de Tiles y Mapas

El suelo se representa como una matriz de números (mapa lógico). Cada número representa un tipo de bloque visual que se recorta desde el spritesheet.

### Ejemplo de mapa de nivel:

```js
levels.push({
  map: [
    [9, 9],            // dimensiones: columnas × filas
    [0, 1, 1, ..., 0], // datos de tiles
    [4, 1]             // posición de la puerta
  ],
  enemyPositions: [[64, 24]],
  playerPosition: [64, 80]
});
