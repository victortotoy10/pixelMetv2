// joystick.js

// Referencia a todos los items del acordeón para gestionar su estado 'active'
let accordionItems = []; // Se inicializa aquí, se llenará en DOMContentLoaded
// Lista de todos los elementos navegables principales: items del acordeón y botones de acción
let navigableElements = []; // Se inicializa aquí, se llenará en DOMContentLoaded

let sectionIndex = 0; // Índice del elemento actualmente resaltado en 'navigableElements'
let optionIndex = -1; // Índice de la opción/input resaltada dentro de una sección activa
let ñCounter = 0; // Contador para la tecla Ñ (usada para cerrar secciones)
let ñTimeout = null; // Timeout para resetear el contador de Ñ
let isInputActive = false; // Indica si un input está activo y el teclado virtual podría estar visible

// Inicializa el estado del acordeón y el resaltado al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    // Determina el tipo de página y establece los elementos navegables
    const registrationAccordions = document.querySelectorAll('.accordion-item');
    const loginForm = document.getElementById('login-form'); // Nuevo: Identifica el formulario de login por su ID

    if (registrationAccordions.length > 0) {
        // Estamos en la página de registro (index.html)
        accordionItems = Array.from(registrationAccordions); // Reasigna global
        navigableElements = Array.from(document.querySelectorAll('.accordion-item, .actions button')); // Reasigna global
    } else if (loginForm) { // Si existe el formulario de login
        // Estamos en la página de login (login.html)
        accordionItems = []; // No hay acordeones en la página de login
        navigableElements = Array.from(loginForm.querySelectorAll('input, button')); // Inputs y botones dentro del formulario de login
    } else {
        // Fallback para otras páginas si joystick.js se incluye por error
        console.warn('joystick.js: No se encontraron elementos navegables específicos para este tipo de página.');
        navigableElements = [];
    }

    // Lógica común de inicialización para ambos tipos de página
    if (accordionItems.length > 0) {
        accordionItems.forEach(i => i.classList.remove('active'));
    }

    // Solo intentar resaltar si hay elementos navegables
    if (navigableElements.length > 0) {
        resaltarElemento(0); // Resalta el primer elemento del conjunto determinado
    } else {
        console.warn('joystick.js: No hay elementos para navegar en esta página.');
    }
});

/**
 * Reinicia el flag isInputActive a false.
 * Esta función es llamada desde teclado.js cuando el teclado virtual se oculta.
 */
function resetInputActiveState() {
    isInputActive = false;
    console.log('[joystick.js] isInputActive reiniciado a false.'); // Log de depuración
}

/**
 * Helper para verificar si un elemento es uno de los botones de acción principales.
 * (Válido para index.html y login.html)
 * @param {HTMLElement} element - El elemento DOM a verificar.
 * @returns {boolean} - True si es un botón de acción principal, false en caso contrario.
 */
function isActionButton(element) {
    return element.id === 'skip' || element.id === 'proceed' || // IDs de index.html
           element.id === 'loginAccessButton' || element.id === 'registerButton'; // IDs de login.html
}

/**
 * Resalta visualmente el elemento actualmente seleccionado por el joystick.
 * Aplica 'resaltado-externo' a secciones de acordeón cerradas o a botones.
 * Al moverse entre elementos principales, cierra cualquier sección de acordeón que estuviera abierta.
 * @param {number} index - El índice del elemento a resaltar en 'navigableElements'.
 */
function resaltarElemento(index) {
    navigableElements.forEach((element, i) => {
        element.classList.remove('resaltado-externo'); // Quita el resaltado de todos los elementos

        // Lógica específica para los accordion-item: asegúrate de que estén cerrados
        // cuando el foco principal del joystick se mueve fuera de ellos o entre ellos.
        if (element.classList.contains('accordion-item')) {
            element.classList.remove('active'); // Cierra la sección si se mueve el foco principal
        }

        if (i === index) {
            element.classList.add('resaltado-externo'); // Añade el resaltado al elemento actual
            element.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Desplaza la vista suavemente
        }
    });
    sectionIndex = index; // Actualiza el índice global del elemento actualmente resaltado
    optionIndex = -1; // Reinicia el índice de opciones/inputs internas de la sección
    ñCounter = 0; // Reinicia el contador de la Ñ
    isInputActive = false; // Reinicia el estado de input activo
}

/**
 * Abre la sección de acordeón actualmente resaltada.
 * Solo funciona si el elemento resaltado es un 'accordion-item' y no un botón.
 */
function abrirSeccion() {
    const currentElement = navigableElements[sectionIndex];
    if (!currentElement.classList.contains('accordion-item')) return; // Asegura que solo actúe en secciones de acordeón

    accordionItems.forEach(i => i.classList.remove('active')); // Cierra todas las secciones
    currentElement.classList.add('active'); // Activa (abre) la sección
    currentElement.classList.remove('resaltado-externo'); // Quita el resaltado externo
    optionIndex = -1; // Reinicia el índice de opciones/inputs internas
    ñCounter = 0; // Reinicia el contador de la Ñ
    if (typeof actualizarTodosLosEstadosGlobal === 'function') { // Llama a la función global de utils.js
        actualizarTodosLosEstadosGlobal();
    }
}

/**
 * Maneja la lógica para cerrar una sección activa al presionar la tecla Ñ dos veces.
 * Solo funciona si el elemento actual es un 'accordion-item' y está activo (abierto).
 */
function manejarTeclaÑ() {
    const currentElement = navigableElements[sectionIndex];
    if (!currentElement.classList.contains('accordion-item') || !currentElement.classList.contains('active')) return;

    const tecladoActivo = document.getElementById('teclado-virtual')?.style.display !== 'none';
    const inputFoco = document.activeElement.tagName === 'INPUT';
    if (inputFoco || tecladoActivo) return;

    ñCounter++;
    if (ñCounter === 2) {
        currentElement.classList.remove('active');
        resaltarElemento(sectionIndex);
        ñCounter = 0;
        if (typeof actualizarTodosLosEstadosGlobal === 'function') { // Llama a la función global de utils.js
            actualizarTodosLosEstadosGlobal();
        }
    }

    clearTimeout(ñTimeout);
    ñTimeout = setTimeout(() => {
        ñCounter = 0;
    }, 2500);
}

/**
 * Mueve la selección entre los elementos principales navegables (secciones de acordeón y botones de acción),
 * en dirección vertical (arriba o abajo).
 * @param {'up' | 'down'} dir - Dirección del movimiento.
 */
function moverElemento(dir) {
    sectionIndex += dir === 'down' ? 1 : -1;
    if (sectionIndex < 0) sectionIndex = navigableElements.length - 1;
    if (sectionIndex >= navigableElements.length) sectionIndex = 0;
    resaltarElemento(sectionIndex);
}

/**
 * Mueve la selección horizontalmente entre los botones de acción principales.
 * @param {'left' | 'right'} dir - Dirección del movimiento.
 */
function moverEntreBotonesAccion(dir) {
    if (navigableElements.length < 2) return;

    const buttonLeft = navigableElements[navigableElements.length - 2];
    const buttonRight = navigableElements[navigableElements.length - 1];

    const currentActiveButton = navigableElements[sectionIndex];

    let targetButton = null;

    if (dir === 'right') {
        if (currentActiveButton === buttonLeft) {
            targetButton = buttonRight;
        } else {
            targetButton = buttonLeft;
        }
    } else { // dir === 'left'
        if (currentActiveButton === buttonRight) {
            targetButton = buttonLeft;
        } else {
            targetButton = buttonRight;
        }
    }

    if (targetButton) {
        sectionIndex = navigableElements.indexOf(targetButton);
        resaltarElemento(sectionIndex);
    }
}


/**
 * Mueve la selección entre las opciones internas de una sección de acordeón activa.
 * @param {'up' | 'down'} dir - Dirección del movimiento.
 */
function moverOpcionInterna(dir) {
    const current = navigableElements[sectionIndex];
    if (!current.classList.contains('accordion-item') || !current.classList.contains('active')) return;

    const opciones = current.querySelectorAll('.role-option, .grade-option');
    if (!opciones.length) return;

    optionIndex += dir === 'down' ? 1 : -1;
    if (optionIndex < 0) optionIndex = opciones.length - 1;
    if (optionIndex >= opciones.length) optionIndex = 0;

    opciones.forEach((op, i) => {
        op.classList.toggle('resaltado', i === optionIndex);
    });
    isInputActive = false;
}

/**
 * Mueve la selección entre los campos de input dentro de una sección de acordeón activa.
 * @param {'up' | 'down'} dir - Dirección del movimiento.
 */
function moverEntreInputs(dir) {
    const current = navigableElements[sectionIndex];
    if (!current.classList.contains('accordion-item') || !current.classList.contains('active')) return;

    const inputs = current.querySelectorAll('input');
    if (!inputs.length) return;

    optionIndex += dir === 'down' ? 1 : -1;
    if (optionIndex < 0) optionIndex = inputs.length - 1;
    if (optionIndex >= inputs.length) optionIndex = 0;

    inputs.forEach((inp, i) => {
        inp.classList.toggle('resaltado', i === optionIndex);
        if (i !== optionIndex) inp.blur();
    });
    isInputActive = false;
}

/**
 * Activa el campo de input actualmente resaltado (le da foco y, si existe, abre el teclado virtual).
 * Solo funciona si el elemento actual es un 'accordion-item' activo.
 */
function activarInput() {
    const current = navigableElements[sectionIndex];
    if (!current.classList.contains('accordion-item') || !current.classList.contains('active')) return;

    const input = current.querySelectorAll('input')[optionIndex];
    if (!input) return;

    if (!isInputActive) {
        isInputActive = true;
        console.log('[joystick.js] activarInput: Intentando activar input y crear teclado.'); // Debug log
        
        if (typeof crearTeclado === 'function') {
            crearTeclado(input); // Primero, crea y hace visible el teclado virtual
        }

        input.focus();
        input.select();
    } else {
        console.log('[joystick.js] activarInput: Input ya marcado como activo. No reactivando.'); // Debug log
    }
}

/**
 * Selecciona la opción interna actualmente resaltada (ej. Estudiante, 1ro de Bachillerato).
 * Solo funciona si el elemento actual es un 'accordion-item' activo.
 */
function seleccionarOpcion() {
    const current = navigableElements[sectionIndex];
    if (!current.classList.contains('accordion-item') || !current.classList.contains('active')) return;

    const opciones = current.querySelectorAll('.role-option, .grade-option');
    if (!opciones.length || optionIndex < 0) return;

    opciones.forEach(op => op.classList.remove('selected', 'resaltado'));
    const opcion = opciones[optionIndex];
    opcion.classList.add('selected');
    opcion.click?.();
}

/**
 * Cuando se abre una sección incompleta (por fallo de validación),
 * esta función la recorre para resaltar el primer input vacío o la primera opción sin seleccionar.
 * Esto ayuda al usuario a saber dónde empezar a corregir.
 * @param {HTMLElement} sectionElement - La sección de acordeón que se acaba de abrir (primeraIncompleta).
 */
function autoHighlightFirstIncompleteElement(sectionElement) {
    if (!sectionElement || !sectionElement.classList.contains('active')) {
        console.log('[joystick.js] Sección no activa o inválida para auto-resaltado.');
        return;
    }

    // Actualizar el sectionIndex global del joystick para que apunte a la sección recién abierta.
    const newSectionIndex = navigableElements.indexOf(sectionElement);
    if (newSectionIndex !== -1) {
        sectionIndex = newSectionIndex;
        const prevResaltadoElement = navigableElements[newSectionIndex];
        if (prevResaltadoElement && prevResaltadoElement.classList.contains('resaltado-externo')) {
             prevResaltadoElement.classList.remove('resaltado-externo');
        }
        console.log(`[joystick.js] sectionIndex actualizado a: ${sectionIndex} para la sección ${sectionElement.querySelector('.header-text').textContent}.`);
    } else {
        console.error('[joystick.js] Error: La sección a auto-resaltar no fue encontrada en la lista de elementos navegables.');
        return;
    }

    const inputs = sectionElement.querySelectorAll('input');
    const options = sectionElement.querySelectorAll('.role-option, .grade-option');

    let targetIndex = -1;
    let targetType = null;

    if (inputs.length > 0) {
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value.trim() === '') {
                targetIndex = i;
                targetType = 'input';
                break;
            }
        }
    }

    if (targetIndex === -1 && options.length > 0) {
        const selectedOption = sectionElement.querySelector('.role-option.selected, .grade-option.selected');
        if (!selectedOption) {
                targetIndex = 0;
                targetType = 'option';
        }
    }

    if (targetIndex !== -1) {
        optionIndex = targetIndex;
        if (targetType === 'input') {
            inputs.forEach((inp, i) => { inp.classList.toggle('resaltado', i === optionIndex); });
        } else if (targetType === 'option') {
            options.forEach((op, i) => { op.classList.toggle('resaltado', i === optionIndex); });
        }
        console.log(`[joystick.js] Auto-resaltado: ${targetType} en índice ${optionIndex} en la sección ${sectionElement.querySelector('.header-text').textContent}.`);
    } else {
        console.log('[joystick.js] No se encontró elemento incompleto para auto-resaltar en la sección', sectionElement.querySelector('.header-text').textContent, '.');
    }
}


// 🔑 Bloque central de control de teclado para el JOYSTICK
document.addEventListener('keydown', (e) => {
    const tecladoVirtualElement = document.getElementById('teclado-virtual');
    const tecladoActivo = tecladoVirtualElement && tecladoVirtualElement.style.display !== 'none';
    const inputConFoco = document.activeElement.tagName === 'INPUT';

    // ***** IMPORTANTE PARA EVITAR CONFLICTOS CON EL TECLADO VIRTUAL *****
    if (tecladoActivo || inputConFoco) {
            if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'k', 'K'].includes(e.key)) {
                e.preventDefault();
            }
            return;
    }
    // ***** FIN DE LA ZONA DE CONFLICTO *****

    const currentElement = navigableElements[sectionIndex];
    const isAccordionItem = currentElement.classList.contains('accordion-item');
    const isActiveAccordion = isAccordionItem && currentElement.classList.contains('active');
    const isCurrentActionButton = isActionButton(currentElement);

    console.log(`[joystick.js] Keydown event: ${e.key}, currentElement:`, currentElement, `isActionButton: ${isActionButton}`);

    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            if (isActiveAccordion) {
                const hayInputs = currentElement.querySelectorAll('input').length > 0;
                const hayOpciones = currentElement.querySelectorAll('.role-option, .grade-option').length > 0;
                hayInputs ? moverEntreInputs('down') : moverOpcionInterna('down');
            } else {
                moverElemento('down');
            }
            break;

        case 'ArrowUp':
            e.preventDefault();
            if (isActiveAccordion) {
                const hayInputs = currentElement.querySelectorAll('input').length > 0;
                const hayOpciones = currentElement.querySelectorAll('.role-option, .grade-option').length > 0;
                hayInputs ? moverEntreInputs('up') : moverOpcionInterna('up');
            } else {
                moverElemento('up');
            }
            break;

        case 'ArrowLeft':
            e.preventDefault();
            if (isCurrentActionButton) {
                moverEntreBotonesAccion('left');
            } else {
            }
            break;

        case 'ArrowRight':
            e.preventDefault();
            if (isCurrentActionButton) {
                moverEntreBotonesAccion('right');
            } else {
            }
            break;

        case 'k':
        case 'K':
            e.preventDefault();
            console.log(`[joystick.js] K pressed. isActiveAccordion: ${isActiveAccordion}, optionIndex: ${optionIndex}, currentElement:`, currentElement);
            if (isActiveAccordion) {
                const hayInputs = currentElement.querySelectorAll('input').length > 0;
                const hayOpciones = currentElement.querySelectorAll('.role-option, .grade-option').length > 0;

                console.log(`[joystick.js] K in active accordion. hayInputs: ${hayInputs}, hayOpciones: ${hayOpciones}`);

                if (hayInputs) {
                    console.log(`[joystick.js] K in input section. optionIndex antes: ${optionIndex}`);
                    if (optionIndex === -1) {
                        optionIndex = 0;
                    }
                    console.log(`[joystick.js] K in input section. optionIndex después: ${optionIndex}`);
                    activarInput();
                } else if (hayOpciones) {
                    console.log(`[joystick.js] K in option section. optionIndex antes: ${optionIndex}`);
                    if (optionIndex === -1) {
                        optionIndex = 0;
                    }
                    console.log(`[joystick.js] K in option section. optionIndex después: ${optionIndex}`);
                    seleccionarOpcion();
                } else {
                    console.log(`[joystick.js] K in active accordion, but no inputs/options found.`);
                }
            } else if (isAccordionItem && !isActiveAccordion) {
                abrirSeccion();
                console.log('[joystick.js] Opening section.');
            } else if (isCurrentActionButton) {
                currentElement.click();
                console.log(`[joystick.js] Clicking button: ${currentElement.id}`);
            }
            break;

        case 'ñ':
        case 'Ñ':
            manejarTeclaÑ();
            break;
    }
});