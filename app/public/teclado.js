// teclado.js

const teclado = document.getElementById('teclado-virtual');
const overlay = document.getElementById('modal-overlay');
let teclas = [];
let teclaIndex = 0;
let mayusActivas = false; // Controla el estado de Bloq Mayús (⇧)
let modoTecladoActual = 'letras'; // 'letras' o 'numeros' para alternar layouts
let entradaReciente = false; // Previene doble pulsación al activar una tecla con el joystick

let activeInputTarget = null; // <<< VARIABLE GLOBAL para el input objetivo >>>

// --- DEFINICIÓN DE LAYOUTS DEL TECLADO ---
const layoutLetras = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
    ['123', '.', '@', 'Espacio', '⏎']
];

const layoutNumeros = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['ABC', '0', '⌫', '⏎']
];


/**
 * Crea y muestra el teclado virtual en pantalla, asociado a un input específico.
 * @param {HTMLInputElement} input - El campo de input al que se asocia el teclado.
 */
function crearTeclado(input) {
    teclado.innerHTML = '';
    teclas = [];
    activeInputTarget = input; // <<< ASIGNA EL INPUT OBJETIVO GLOBALMENTE AQUÍ >>>

    // --- Estilos generales del contenedor del teclado (Mayormente en styles.css) ---
    teclado.style.display = 'flex'; // Necesario para JS (cambia de none a flex)
    teclado.style.flexDirection = 'column'; // Necesario para JS (determina layout)
    teclado.style.padding = '8px'; // Mantener si styles.css no lo tiene.
    teclado.style.background = '#212121'; // Mantener si styles.css no lo tiene.
    teclado.style.borderRadius = '12px'; // Mantener si styles.css no lo tiene.
    teclado.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)'; // Mantener si styles.css no lo tiene.
    teclado.style.position = 'absolute'; // Necesario para JS (posicionamiento flotante)
    teclado.style.zIndex = '1000'; // Necesario para JS (orden de apilamiento)
    teclado.style.maxWidth = 'max-content'; // Mantener si styles.css no lo tiene.
    teclado.style.minWidth = modoTecladoActual === 'letras' ? '500px' : '200px'; 
    teclado.style.minHeight = '250px'; // Mantener si styles.css no lo tiene.
    teclado.style.overflow = 'visible'; // Mantener si styles.css no lo tiene.

    // Control del Overlay (usará activeInputTarget para el blur)
    overlay.onclick = () => {
        teclado.style.display = 'none';
        overlay.style.display = 'none'; // Oculta también el overlay
        if (activeInputTarget) { activeInputTarget.blur(); }
        if (typeof resetInputActiveState === 'function') { resetInputActiveState(); }
    };
    teclado.onclick = (e) => { e.stopPropagation(); };


    const currentLayout = modoTecladoActual === 'letras' ? layoutLetras : layoutNumeros;

    currentLayout.forEach((fila, filaIdx) => {
        const filaDiv = document.createElement('div');
        // Estos estilos de filaDiv son la base, se asume que styles.css los tiene para la regla general
        filaDiv.style.display = 'flex'; 
        filaDiv.style.justifyContent = 'center';
        filaDiv.style.margin = '2px 0'; 
        filaDiv.style.gap = '6px'; 

        // Estilos específicos de espaciado para las filas (son dinámicos por lo que se quedan en JS)
        if (modoTecladoActual === 'letras') {
            if (filaIdx === 1) { filaDiv.style.paddingLeft = '20px'; filaDiv.style.paddingRight = '20px'; }
            else if (filaIdx === 2) { filaDiv.style.paddingLeft = '40px'; filaDiv.style.paddingRight = '40px'; }
            else if (filaIdx === 3) { filaDiv.style.marginTop = '8px'; filaDiv.style.alignItems = 'flex-end'; }
        } else { // Estilos para el layout numérico
            filaDiv.style.gap = '8px';
            if (filaIdx === currentLayout.length - 1) { filaDiv.style.marginTop = '8px'; }
        }

        fila.forEach((t, colIdx) => {
            const btn = document.createElement('button');
            let textoTecla = t;

            if (t === '⌫') { } // No hace nada especial para el texto, se asigna abajo
            else if (t.length === 1 && t.match(/[a-zñ]/i)) { textoTecla = mayusActivas ? t.toUpperCase() : t.toLowerCase(); }
            else if (t === '⇧') { textoTecla = '⇧'; }
            else if (t === '⏎') { textoTecla = 'Enter'; }
            else if (t === 'Espacio') { textoTecla = 'space'; }
            else if (t === '@') { textoTecla = '@'; }

            btn.textContent = textoTecla; 
            btn.className = 'tecla';
            btn.dataset.tecla = t;
            btn.dataset.fila = filaIdx;
            btn.dataset.col = colIdx;

            // --- Estilos de los botones individuales (la mayoría en styles.css) ---
            // Aquí solo mantenemos los overrides dinámicos que no son manejados por styles.css.
            // Para las propiedades de color y fondo base, styles.css lo maneja.
            // Para el tamaño de fuente general, styles.css lo maneja.
            // Para el padding/margin/border/radius base, styles.css lo maneja.
            // Para min-width/height base, styles.css lo maneja.

            // Estilos especiales para teclas con funciones específicas o tamaños distintos (se quedan en JS si son dinámicos)
            if (t === 'Espacio') {
                btn.style.flexGrow = '1';
                btn.style.minWidth = '180px';
            } else if (t === '⌫') {
                btn.style.minWidth = '50px';
                btn.style.fontWeight = 'bold';
                btn.style.fontSize = '1.4em';
            } else if (t === '⏎') {
                btn.style.minWidth = '60px';
                btn.style.fontSize = '1.4em';
            } else if (t === '⇧') {
                btn.style.minWidth = '60px';
                btn.style.fontSize = '1.5em';
                if (mayusActivas) { /* styles.css maneja .tecla-activa-permanente */ }
            } else if (t === '123' || t === 'ABC' || t === '.') {
                btn.style.minWidth = '60px';
                btn.style.fontSize = '1em';
            } else if (t === '@') {
                btn.style.minWidth = '60px';
                btn.style.fontSize = '1.6em';
            } else if (modoTecladoActual === 'numeros' && t.match(/[0-9]/)) {
                btn.style.minWidth = '60px';
                btn.style.fontSize = '1.5em';
            }
            
            // Este onclick es para la interacción con el mouse (clics directos)
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (activeInputTarget) { // Asegura que activeInputTarget exista
                    ejecutarTecla(t, activeInputTarget); // Llama a ejecutarTecla con el input activo
                }
            };

            filaDiv.appendChild(btn);
            teclas.push(btn);
        });
        teclado.appendChild(filaDiv);
    });

    teclaIndex = 0;
    resaltarTecla(); // Llama a resaltarTecla para aplicar el highlight inicial

    // --- Posicionamiento del teclado ---
    const rect = input.getBoundingClientRect(); // Usa 'input' para el cálculo inicial de la posición
    teclado.style.top = `${rect.bottom + window.scrollY + 8}px`; // 8px debajo del input
    const inputCenterX = rect.left + rect.width / 2;
    teclado.style.left = `${inputCenterX - teclado.offsetWidth / 2}px`;
    
    // Ajustes para asegurar que el teclado no se salga de los límites de la ventana
    if (parseFloat(teclado.style.left) < 0) {
        teclado.style.left = '0px';
    } else if (parseFloat(teclado.style.left) + teclado.offsetWidth > window.innerWidth) {
        teclado.style.left = `${window.innerWidth - teclado.offsetWidth}px`;
    }
    console.log(`[teclado.js] Teclado posicionado en: top ${teclado.style.top}, left ${teclado.style.left}`); // NUEVO LOG DE POSICIONAMIENTO

    entradaReciente = true;
    setTimeout(() => entradaReciente = false, 150);
}

/**
 * Resalta visualmente la tecla actual en el teclado virtual.
 * Gestiona la clase 'tecla-activa' para el resaltado del joystick
 * y 'tecla-activa-permanente' para el estado de Bloq Mayús.
 */
function resaltarTecla() {
    console.log(`[teclado.js] resaltarTecla llamada. TeclaIndex: ${teclaIndex}`); // NUEVO LOG DE RESALTADO
    teclas.forEach((btn, i) => {
        if (btn.dataset.tecla === '⇧' && mayusActivas) {
            btn.classList.add('tecla-activa-permanente');
            btn.classList.toggle('tecla-activa', i === teclaIndex && !mayusActivas);
        } else {
            btn.classList.toggle('tecla-activa', i === teclaIndex);
            btn.classList.remove('tecla-activa-permanente'); 
        }
    });
}

/**
 * Ejecuta la acción asociada a una tecla del teclado virtual.
 * @param {string} t - El valor de la tecla.
 * @param {HTMLInputElement} input - El campo de input asociado.
 */
function ejecutarTecla(t, input) {
    console.log(`[teclado.js] ejecutarTecla llamada para: ${t}. Input actual: ${input.id}`); // Log para depuración

    switch (t) {
        case '⌫':
            input.value = input.value.slice(0, -1);
            break;
        case 'Espacio':
            input.value += ' ';
            break;
        case '⏎': // Tecla Enter (finalizar entrada)
            input.blur();
            teclado.style.display = 'none';
            overlay.style.display = 'none';
            if (typeof resetInputActiveState === 'function') { resetInputActiveState(); }
            return;
        case '⇧': // Tecla Bloq Mayús: alterna mayúsculas/minúsculas
            mayusActivas = !mayusActivas;
            crearTeclado(activeInputTarget); // Usa activeInputTarget aquí
            return;
        case '123': // Cambiar a layout numérico
            modoTecladoActual = 'numeros';
            crearTeclado(activeInputTarget); // Usa activeInputTarget aquí
            return;
        case 'ABC': // Cambiar a layout de letras
            modoTecladoActual = 'letras';
            crearTeclado(activeInputTarget); // Usa activeInputTarget aquí
            return;
        case '.': // Añadir un punto
            input.value += '.';
            break;
        case '@': // Añadir un arroba
            input.value += '@';
            break;
        default: // Cualquier otra tecla (letras, números)
            if (t.length === 1 && t.match(/[a-zñ]/i)) {
                input.value += mayusActivas ? t.toUpperCase() : t.toLowerCase();
            } else {
                input.value += t;
            }
    }

    input.focus();
    try {
      if (["text", "password", "search", "tel", "url"].includes(input.type)) {
        input.select();
      }
    } catch (err) {
      console.warn(`[teclado.js] input.select() falló en input tipo ${input.type}:`, err);
    }

    const item = input.closest(".accordion-item");
    if (item) {
        setTimeout(() => {
            if (typeof evaluarEstadoSeccion === 'function') { evaluarEstadoSeccion(item); }
        }, 0);
    }
}

/**
 * Mueve la selección (resaltado) de la tecla actual dentro del teclado virtual,
 * siguiendo una dirección (arriba, abajo, izquierda, derecha).
 * @param {'up' | 'down' | 'left' | 'right'} dir - Dirección del movimiento.
 */
function moverTecla(dir) {
    console.log(`[teclado.js] moverTecla llamada. Dir: ${dir}`); // NUEVO LOG
    if (!teclas.length) return;

    let currentBtn = teclas[teclaIndex];
    let currentFila = parseInt(currentBtn.dataset.fila);
    let currentCol = parseInt(currentBtn.dataset.col);

    let newFila = currentFila;
    let newCol = currentCol;

    const currentLayout = modoTecladoActual === 'letras' ? layoutLetras : layoutNumeros;

    switch (dir) {
        case 'up':
            newFila = Math.max(0, currentFila - 1);
            if (newFila !== currentFila) {
                let targetFila = currentLayout[newFila];
                newCol = Math.min(currentCol, targetFila.length - 1);
            }
            break;
        case 'down':
            newFila = Math.min(currentLayout.length - 1, currentFila + 1);
            if (newFila !== currentFila) {
                let targetFila = currentLayout[newFila];
                newCol = Math.min(currentCol, targetFila.length - 1);
            }
            break;
        case 'left':
            newCol = Math.max(0, currentCol - 1);
            break;
        case 'right':
            newCol = Math.min(currentLayout[currentFila].length - 1, currentCol + 1);
            break;
    }

    let nextBtn = teclas.find(btn =>
        parseInt(btn.dataset.fila) === newFila &&
        parseInt(btn.dataset.col) === newCol
    );

    if (nextBtn) {
        teclaIndex = teclas.indexOf(nextBtn);
        resaltarTecla();
    } else {
        // Fallback: Si no se encuentra una tecla directa (por ejemplo, en un layout irregular),
        // la selección permanece en la tecla actual. Se podría implementar una lógica
        // más compleja para buscar la tecla "más cercana" si fuera necesario.
    }
}

/**
 * Simula la pulsación de la tecla actualmente resaltada en el teclado virtual.
 * Se usa cuando el joystick "confirma" una selección.
 * Esta función ya no se llama directamente por K o Ñ.
 */
// REMOVED presionarTeclaActual()
/*
function presionarTeclaActual() {
    if (entradaReciente) return;
    teclas[teclaIndex]?.click();
    entradaReciente = true;
    setTimeout(() => entradaReciente = false, 150);
}
*/

// 🔑 Bloque de control de teclado PRINCIPAL para el TECLADO VIRTUAL
document.addEventListener('keydown', (e) => {
    const tecladoActivo = teclado.style.display !== 'none';
    const esFlecha = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key);

    // Si el teclado virtual NO está activo, este listener no hace nada y permite que otros scripts capturen el evento.
    if (!tecladoActivo) return;

    // --- MANEJO ESPECIAL DE LA TECLA Ñ COMO "ENTER" EN EL TECLADO VIRTUAL ---
    if (e.key === 'ñ' || e.key === 'Ñ') {
        e.preventDefault();
        // Llama directamente a ejecutarTecla con '⏎' y el input activo global
        if (activeInputTarget) { // Asegura que activeInputTarget exista
            ejecutarTecla('⏎', activeInputTarget); // <<< LLAMADA DIRECTA >>>
        }
        return;
    }

    // --- Manejo de las teclas de flecha (navegación interna del teclado virtual) ---
    if (esFlecha) {
        e.preventDefault();
        moverTecla(e.key.replace('Arrow', '').toLowerCase());
        return;
    }

    // --- Manejo de la tecla 'K' (selección/activación de tecla virtual) ---
    if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        if (typeof bloquearPrimeraTeclaVirtual !== 'undefined' && bloquearPrimeraTeclaVirtual) {
            console.log('[teclado.js] Ignorando primera K porque bloquearPrimeraTeclaVirtual=true');
            bloquearPrimeraTeclaVirtual = false; // <<<<<<< Desbloquea para siguientes K
            return;
        }

        if (teclas[teclaIndex] && activeInputTarget) {
            ejecutarTecla(teclas[teclaIndex].dataset.tecla, activeInputTarget);
        }
        return;
    }

    // --- Manejo de la tecla 'Escape' (cerrar teclado virtual) ---
    if (e.key === 'Escape') {
        e.preventDefault();
        teclado.style.display = 'none';
        overlay.style.display = 'none';
        if (activeInputTarget) { // Usa activeInputTarget para blur
            activeInputTarget.blur();
        }
        if (typeof resetInputActiveState === 'function') { resetInputActiveState(); }
        return;
    }

    // --- BLOQUEO DE TODAS LAS DEMÁS TECLAS ---
    e.preventDefault();
    e.stopPropagation();
});