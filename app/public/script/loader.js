export function loadLevel(levelName) {
  return fetch(`/levels/${levelName}.json`)
    .then(response => {
      if (!response.ok) throw new Error(`No se pudo cargar nivel ${levelName}`);
      return response.json();
    });
}
