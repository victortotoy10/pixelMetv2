let accordionItems = [];
let navigableElements = [];

let sectionIndex = 0;
let optionIndex = -1;
let ñCounter = 0;
let ñTimeout = null;
let isInputActive = false;
let botonesIgnoradosInicialmente = [false, false];
let bloquearPrimeraTeclaVirtual = false;

window.addEventListener('DOMContentLoaded', () => {
    const registrationAccordions = document.querySelectorAll('.accordion-item');
    const loginForm = document.getElementById('login-form');

    if (registrationAccordions.length > 0) {
        accordionItems = Array.from(registrationAccordions);
        navigableElements = Array.from(document.querySelectorAll('.accordion-item, .actions button'));
    } else if (loginForm) {
        accordionItems = [];
        navigableElements = Array.from(loginForm.querySelectorAll('input, button'));
    } else {
        console.warn('joystick.js: No se encontraron elementos navegables específicos para este tipo de página.');
        navigableElements = [];
    }

    if (accordionItems.length > 0) {
        accordionItems.forEach(i => i.classList.remove('active'));
    }

    if (navigableElements.length > 0) {
        resaltarElemento(0);
    } else {
        console.warn('joystick.js: No hay elementos para navegar en esta página.');
    }
});

function resetInputActiveState() {
    isInputActive = false;
    console.log('[joystick.js] isInputActive reiniciado a false.');
}

function isActionButton(element) {
    return element.id === 'skip' || element.id === 'proceed' ||
           element.id === 'loginAccessButton' || element.id === 'registerButton';
}

function resaltarElemento(index) {
    navigableElements.forEach((element, i) => {
        element.classList.remove('resaltado-externo');

        if (element.classList.contains('accordion-item')) {
            element.classList.remove('active');
        }

        if (i === index) {
            element.classList.add('resaltado-externo');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
    sectionIndex = index;
    optionIndex = -1;
    ñCounter = 0;
    isInputActive = false;
}

function abrirSeccion() {
    const currentElement = navigableElements[sectionIndex];
    if (!currentElement.classList.contains('accordion-item')) return;

    accordionItems.forEach(i => i.classList.remove('active'));
    currentElement.classList.add('active');
    currentElement.classList.remove('resaltado-externo');
    optionIndex = -1;
    ñCounter = 0;
    if (typeof actualizarTodosLosEstadosGlobal === 'function') {
        actualizarTodosLosEstadosGlobal();
    }
}

function manejarTeclaÑ() {
    const currentElement = navigableElements[sectionIndex];
    if (!currentElement.classList.contains('accordion-item') || !currentElement.classList.contains('active')) return;

    const tecladoActivo = document.getElementById('teclado-virtual')?.style.display !== 'none';
    const inputConFoco = document.activeElement.tagName === 'INPUT';
    if (inputConFoco || tecladoActivo) return;

    ñCounter++;
    if (ñCounter === 2) {
        currentElement.classList.remove('active');
        resaltarElemento(sectionIndex);
        ñCounter = 0;
        if (typeof actualizarTodosLosEstadosGlobal === 'function') {
            actualizarTodosLosEstadosGlobal();
        }
    }

    clearTimeout(ñTimeout);
    ñTimeout = setTimeout(() => {
        ñCounter = 0;
    }, 2500);
}

function moverElemento(dir) {
    sectionIndex += dir === 'down' ? 1 : -1;
    if (sectionIndex < 0) sectionIndex = navigableElements.length - 1;
    if (sectionIndex >= navigableElements.length) sectionIndex = 0;
    resaltarElemento(sectionIndex);
}

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
    } else {
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

function activarInput() {
    const current = navigableElements[sectionIndex];
    if (!current.classList.contains('accordion-item') || !current.classList.contains('active')) return;

    const input = current.querySelectorAll('input')[optionIndex];
    if (!input) return;

    if (!isInputActive) {
        isInputActive = true;
        bloquearPrimeraTeclaVirtual = true; // <<<<<<< BLOQUEA
        console.log('[joystick.js] activarInput: Bloquear primera K en teclado virtual.');
        if (typeof crearTeclado === 'function') {
            crearTeclado(input);
        }
        input.focus();
        input.select();
    } else {
        console.log('[joystick.js] activarInput: Input ya marcado como activo. No reactivando.');
    }
}

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

function getSectionIndex(sectionElement) {
  // Busca el índice de la sección en navigableElements
  return navigableElements.indexOf(sectionElement);
}

function autoHighlightFirstIncompleteElement(sectionElement) {
  let found = false;

  // Prioridad: primero inputs vacíos o inválidos
  const inputs = sectionElement.querySelectorAll('input');
  inputs.forEach((input, idx) => {
    if (!found && (input.value.trim() === '' || !input.checkValidity())) {
      sectionIndex = getSectionIndex(sectionElement);
      optionIndex = idx;
      found = true;
      // Resalta visualmente el input
      inputs.forEach((inp, i) => inp.classList.toggle('resaltado', i === optionIndex));
      input.focus();
      console.log(`[joystick.js] Auto-resaltado: input "${input.name}" en índice ${optionIndex} en la sección ${sectionElement.querySelector('.header-text')?.textContent}.`);
    }
  });

  // Si no hay inputs incompletos, revisa opciones tipo rol/grade
  if (!found) {
    const options = sectionElement.querySelectorAll('.role-option, .grade-option');
    let firstUnselected = -1;
    options.forEach((opt, idx) => {
      if (!found && !opt.classList.contains('selected')) {
        sectionIndex = getSectionIndex(sectionElement);
        optionIndex = idx;
        found = true;
        options.forEach((o, i) => o.classList.toggle('resaltado', i === optionIndex));
        console.log(`[joystick.js] Auto-resaltado: opción sin seleccionar en la sección ${sectionElement.querySelector('.header-text')?.textContent}.`);
      }
    });
  }

  // Si nada, fallback
  if (!found) {
    sectionIndex = getSectionIndex(sectionElement);
    optionIndex = -1;
    console.log(`[joystick.js] Auto-resaltado: Nada por resaltar en ${sectionElement.querySelector('.header-text')?.textContent}.`);
  }
}


document.addEventListener('keydown', (e) => {
    const tecladoVirtualElement = document.getElementById('teclado-virtual');
    const tecladoActivo = tecladoVirtualElement && tecladoVirtualElement.style.display !== 'none';
    const inputConFoco = document.activeElement.tagName === 'INPUT';

    if (tecladoActivo || inputConFoco) {
            if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'k', 'K'].includes(e.key)) {
                e.preventDefault();
            }
            return;
    }

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

// ===============================
//  GAMEPAD API (ESP32 BLE) - INTEGRACIÓN REAL
// ===================================
let gamepadPolling = false;
let lastGamepadState = { axes: [0, 0], buttons: [false, false] };
let lastMoveTime = 0;
let joystickStartupTime = Date.now();
const moveCooldown = 300;
const threshold = 0.5;

function pollGamepad() {
  const gamepads = navigator.getGamepads();
  const gp = Array.from(gamepads).find(g => g && g.connected);

  if (Date.now() - joystickStartupTime < 2000) {
    requestAnimationFrame(pollGamepad);
    return;
  }

  if (!gp) {
    console.warn('[joystick-debug] Gamepad no detectado.');
    gamepadPolling = false;
    return;
  }

  let ejeX = gp.axes[0];
  let ejeY = gp.axes[1];

  ejeX = Math.min(1, Math.max(-1, ejeX));
  ejeY = Math.min(1, Math.max(-1, ejeY));
  const btnA = gp.buttons[0]?.pressed;
  const btnB = gp.buttons[1]?.pressed;

  const rawDebug = {
    ejeX: ejeX.toFixed(2),
    ejeY: ejeY.toFixed(2),
    btnA,
    btnB,
    tiempoDesdeInicio: Date.now() - joystickStartupTime
  };
  console.table(rawDebug);

  const horizontal = Math.abs(ejeX) > threshold ? ejeX : 0;
  const vertical = Math.abs(ejeY) > threshold ? ejeY : 0;

  const now = Date.now();
  let dir = null;

  if (now - lastMoveTime > moveCooldown) {
    const keyboardEvent = (key) => document.dispatchEvent(new KeyboardEvent('keydown', { key }));

    if (vertical < -threshold && lastGamepadState.axes[1] >= -threshold) {
      keyboardEvent('ArrowUp');
      lastMoveTime = now;
      dir = 'up';
      console.log('[joystick-debug] Simular tecla ↑');
    }
    if (vertical > threshold && lastGamepadState.axes[1] <= threshold) {
      keyboardEvent('ArrowDown');
      lastMoveTime = now;
      dir = 'down';
      console.log('[joystick-debug] Simular tecla ↓');
    }
    if (horizontal < -threshold && lastGamepadState.axes[0] >= -threshold) {
      keyboardEvent('ArrowLeft');
      lastMoveTime = now;
      dir = 'left';
      console.log('[joystick-debug] Simular tecla ←');
    }
    if (horizontal > threshold && lastGamepadState.axes[0] <= threshold) {
      keyboardEvent('ArrowRight');
      lastMoveTime = now;
      dir = 'right';
      console.log('[joystick-debug] Simular tecla →');
    }
  }

  if (btnA && !lastGamepadState.buttons[0] && !botonesIgnoradosInicialmente[0]) {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));
    console.log('[joystick-debug] Simular tecla K desde botón A');
  }

  if (btnB && !lastGamepadState.buttons[1] && !botonesIgnoradosInicialmente[1]) {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ñ' }));
    console.log('[joystick-debug] Simular tecla Ñ desde botón B');
  }

  if (horizontal === 0 && vertical === 0) {
      dir = null;
  }
  
  actualizarVisualJoystick(dir, [btnA, btnB]);

  lastGamepadState = {
    axes: [horizontal, vertical],
    buttons: [btnA, btnB],
  };

  requestAnimationFrame(pollGamepad);
}

window.addEventListener('gamepadconnected', (e) => {
  console.log('Gamepad conectado:', e.gamepad);
  lastGamepadState = { axes: [0, 0], buttons: [false, false] };
  gamepadPolling = true;
  joystickStartupTime = Date.now();
  pollGamepad();
});

window.addEventListener('gamepaddisconnected', (e) => {
  console.log('Gamepad desconectado:', e.gamepad);
  gamepadPolling = false;
});

window.addEventListener('load', () => {
  const gamepads = navigator.getGamepads();
  const active = Array.from(gamepads).find(gp => gp && gp.connected);
  if (active) {
    console.log('Gamepad ya estaba conectado al cargar. Forzando polling...');
    gamepadPolling = true;
    lastGamepadState = { axes: [0, 0], buttons: [false, false] };
    joystickStartupTime = Date.now();
    pollGamepad();
  }
});

function actualizarVisualJoystick(dir, botones) {
  ['up', 'down', 'left', 'right'].forEach(d => {
    document.querySelector(`.joy-dir.${d}`)?.classList.toggle('active', d === dir);
  });
  document.getElementById('joy-btn-a')?.classList.toggle('active', botones[0]);
  document.getElementById('joy-btn-b')?.classList.toggle('active', botones[1]);
}