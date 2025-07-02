// utils.js - Funciones de utilidad comunes a toda la aplicación

// Referencia al contenedor de mensajes de validación (debe existir en el HTML: <div id="validation-message"></div>)
const validationMessageElement = document.getElementById('validation-message');
let messageTimeout; // Para controlar el temporizador de ocultar el mensaje

/**
 * Muestra un mensaje flotante en la parte inferior central de la pantalla.
 * El mensaje aparecerá en una posición fija en la pantalla (definida por CSS).
 * @param {string} message - El texto del mensaje a mostrar.
 * @param {'success' | 'error' | 'info'} type - El tipo de mensaje ('success', 'error', 'info').
 */
function showValidationMessage(message, type) {
    // console.log('showValidationMessage llamada con:', message, type); // Log de depuración
    if (!validationMessageElement) {
        console.error('showValidationMessage: Elemento #validation-message no encontrado. No se puede mostrar el mensaje.');
        return;
    }

    // Limpia cualquier temporizador de ocultado anterior para evitar superposiciones de mensajes
    clearTimeout(messageTimeout);

    validationMessageElement.textContent = message; // Establece el texto del mensaje
    // Asigna las clases CSS para el estilo y para activar la visibilidad y transición
    validationMessageElement.className = `validation-message ${type} show`;

    // Asegura que el elemento sea visible y ocupe espacio para la transición
    validationMessageElement.style.display = 'block'; 
    validationMessageElement.style.visibility = 'visible'; 

    // console.log('Mensaje:', validationMessageElement.textContent, 'Clases aplicadas:', validationMessageElement.className); // Log de depuración
    // console.log('Posición del mensaje: Manejada por CSS (position: fixed).'); // Log de depuración

    // Configura un temporizador para ocultar el mensaje después de 3 segundos
    messageTimeout = setTimeout(() => {
        validationMessageElement.classList.remove('show'); // Remueve la clase 'show' para iniciar la transición de ocultado
        // console.log('Mensaje ocultándose. Clases:', validationMessageElement.className); // Log de depuración
        
        // Limpia el texto y remueve todas las clases CSS después de la transición de ocultado
        // para que el elemento esté limpio para un futuro uso y no ocupe espacio en el DOM
        setTimeout(() => {
            validationMessageElement.textContent = '';
            validationMessageElement.className = 'validation-message';
            validationMessageElement.style.display = 'none'; 
            validationMessageElement.style.visibility = 'hidden'; 
            // console.log('Mensaje limpiado y oculto. Clases:', validationMessageElement.className); // Log de depuración
        }, 300); // El tiempo debe coincidir con la duración de la transición de opacidad en CSS
    }, 3000); // El mensaje permanece visible por 3 segundos
}

// --- Funciones de actualización de estado para secciones de acordeón (GLOBALES) ---

/**
 * Actualiza el indicador de estado de una sección de tipo 'Perfil' o 'Rol'.
 * @param {HTMLElement} item - El elemento del acordeón (div.accordion-item) de la sección Rol/Perfil.
 */
function actualizarEstadoRol(item) {
    const status = item?.querySelector("[data-status]");
    const selected = item?.querySelector(".role-option.selected");

    // console.log(`[utils.js] actualizarEstadoRol llamada para ${item.id || item.className}. Activo: ${item.classList.contains('active')}, Seleccionado: ${!!selected}, Tocado: ${item.dataset.touched === 'true'}`); // Log de depuración
    if (!status || !item) return; 

    if (selected) {
        status.textContent = "Completado";
        status.className = "status-label verde";
        item.dataset.touched = 'true'; 
        // console.log(`[utils.js] ${item.id}: Establecido a Completado (verde)`); // Log de depuración
    } else if (item.classList.contains('active')) {
        status.textContent = "En progreso";
        status.className = "status-label amarillo";
        item.dataset.touched = 'true'; 
        // console.log(`[utils.js] ${item.id}: Establecido a En progreso (amarillo)`); // Log de depuración
    } else if (item.dataset.touched === 'true') {
        status.textContent = "Pendiente";
        status.className = "status-label gris";
        // console.log(`[utils.js] ${item.id}: Establecido a Pendiente (rojo suave)`); // Log de depuración
    } else {
        status.textContent = "";
        status.className = "status-label";
        // console.log(`[utils.js] ${item.id}: Establecido a Vacío (sin estado)`); // Log de depuración
    }
}

/**
 * Actualiza el indicador de estado de una sección de tipo 'Grado Escolar'.
 * @param {HTMLElement} item - El elemento del acordeón (div.accordion-item) de la sección Grado Escolar.
 */
function actualizarEstadoGrado(item) {
    const status = item?.querySelector("[data-status]");
    const selected = item?.querySelector(".grade-option.selected");

    // console.log(`[utils.js] actualizarEstadoGrado llamada para ${item.id || item.className}. Activo: ${item.classList.contains('active')}, Seleccionado: ${!!selected}, Tocado: ${item.dataset.touched === 'true'}`); // Log de depuración
    if (!status || !item) return; 

    if (selected) {
        status.textContent = "Completado";
        status.className = "status-label verde";
        item.dataset.touched = 'true';
        // console.log(`[utils.js] ${item.id}: Completado (verde)`); // Log de depuración
    } else if (item.classList.contains('active')) {
        status.textContent = "En progreso";
        status.className = "status-label amarillo";
        item.dataset.touched = 'true';
        // console.log(`[utils.js] ${item.id}: En progreso (amarillo)`); // Log de depuración
    } else if (item.dataset.touched === 'true') {
        status.textContent = "Pendiente";
        status.className = "status-label gris";
        // console.log(`[utils.js] ${item.id}: Pendiente (rojo suave)`); // Log de depuración
    } else {
        status.textContent = "";
        status.className = "status-label";
        // console.log(`[utils.js] ${item.id}: Vacío (sin estado)`); // Log de depuración
    }
}

/**
 * Evalúa el estado de una sección que contiene campos de texto (ej. "Credenciales de Acceso", "Información Personal").
 * @param {HTMLElement} item - El elemento del acordeón (div.accordion-item) a evaluar.
 */
function evaluarEstadoInputs(item) {
    const status = item.querySelector("[data-status]");
    const inputs = item.querySelectorAll("input");

    // console.log(`[utils.js] evaluarEstadoInputs llamada para ${item.id || item.className}. Activo: ${item.classList.contains('active')}`); // Log de depuración
    if (!status || inputs.length === 0) { return; } 

    let allFilled = true;
    let anyFilled = false;
    let hasFocus = false;

    inputs.forEach((input) => {
        if (input.value.trim() === "") {
            allFilled = false;
        } else {
            anyFilled = true;
        }
        if (input === document.activeElement) {
            hasFocus = true;
        }
    });

    const isActiveSection = item.classList.contains('active');

    // Lógica para marcar como 'tocada' (data-touched)
    if (isActiveSection || hasFocus || anyFilled) {
        item.dataset.touched = 'true';
    }

    if (allFilled) {
        status.textContent = "Completado";
        status.className = "status-label verde";
        item.dataset.touched = 'true'; 
        // console.log(`[utils.js] ${item.id}: Completado (verde)`); // Log de depuración
    } else if (isActiveSection || hasFocus) {
        status.textContent = "En progreso";
        status.className = "status-label amarillo";
        // console.log(`[utils.js] ${item.id}: En progreso (amarillo)`); // Log de depuración
    } else if (item.dataset.touched === 'true') {
        status.textContent = "Pendiente";
        status.className = "status-label gris";
        // console.log(`[utils.js] ${item.id}: Pendiente (rojo suave)`); // Log de depuración
    } else {
        status.textContent = "";
        status.className = "status-label";
        delete item.dataset.touched; 
        // console.log(`[utils.js] ${item.id}: Vacío (sin estado)`); // Log de depuración
    }
}

/**
 * Función global para actualizar el estado de todas las secciones del acordeón en la página actual.
 * Debería ser llamada en el DOMContentLoaded y después de interacciones clave.
 * Utiliza IDs específicos para mayor robustez.
 */
function actualizarTodosLosEstadosGlobal() {
    // console.log('[utils.js] actualizarTodosLosEstadosGlobal llamada'); // Log de depuración
    // Para la sección "Tu Rol" (puede estar en index.html o login.html)
    const rolSection = document.getElementById('sectionRol') || document.getElementById('sectionRolLogin');
    if (rolSection) {
        actualizarEstadoRol(rolSection);
    }

    // Para la sección "Credenciales de Acceso" (puede estar en index.html o login.html)
    const credencialesSection = document.getElementById('sectionCredenciales') || document.getElementById('sectionCredencialesLogin');
    if (credencialesSection) {
        evaluarEstadoInputs(credencialesSection);
    }

    // Para la sección "Grado Escolar" (solo en página de registro)
    const gradoSection = document.getElementById('sectionGrado');
    if (gradoSection) {
        actualizarEstadoGrado(gradoSection);
    }
}