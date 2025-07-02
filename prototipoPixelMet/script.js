// script.js - Lógica específica para la página de REGISTRO

// Acordeón funcional: Maneja la apertura y cierre de las secciones al hacer clic en sus cabeceras.
document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
        const item = header.closest(".accordion-item"); // Obtiene el contenedor de la sección del acordeón
        const isOpen = item.classList.contains("active"); // Comprueba si la sección ya está abierta

        // Cierra todas las secciones del acordeón para asegurar que solo una esté abierta a la vez
        document.querySelectorAll(".accordion-item").forEach((i) =>
            i.classList.remove("active")
        );

        // Si la sección no estaba abierta, la activa (la abre)
        // Y la marca como 'tocada' para la lógica de estado "Pendiente"
        if (!isOpen) {
            item.classList.add("active");
            item.dataset.touched = 'true'; // Marca la sección como 'tocada' al abrirse por clic
        }

        // Después de cualquier cambio de estado (abrir/cerrar), actualiza los indicadores visuales de todas las secciones
        actualizarTodosLosEstadosGlobal(); // Llama a la función global de utils.js
    });
});

// Perfil: Maneja la selección visual de las opciones "Estudiante" / "Profesor" y actualiza su estado.
document.querySelectorAll(".role-option").forEach((option) => {
    option.addEventListener("click", () => {
        // Remueve la clase 'selected' de todas las opciones de rol para deseleccionar
        document.querySelectorAll(".role-option").forEach((o) =>
            o.classList.remove("selected")
        );
        // Añade la clase 'selected' a la opción clicada
        option.classList.add("selected");
        // Llama a la función global para asegurar que todos los estados visuales se actualicen de forma consistente
        actualizarTodosLosEstadosGlobal(); // Llama a la función global de utils.js
    });
});

// Grado Escolar: Maneja la selección visual de las opciones de grado y actualiza su estado.
document.querySelectorAll(".grade-option").forEach((option) => {
    option.addEventListener("click", () => {
        // Remueve la clase 'selected' de todas las opciones de grado
        document.querySelectorAll(".grade-option").forEach((o) =>
            o.classList.remove("selected")
        );
        // Añade la clase 'selected' a la opción clicada
        option.classList.add("selected");
        // Llama a la función global para asegurar la consistencia de los estados
        actualizarTodosLosEstadosGlobal(); // Llama a la función global de utils.js
    });
});

// Asigna event listeners a los campos de input de texto para actualizar su estado dinámicamente.
document.querySelectorAll(".accordion-item").forEach((item) => {
    const inputs = item.querySelectorAll("input"); // Obtiene inputs en cada sección

    inputs.forEach((input) => {
        // Actualiza el estado al escribir
        input.addEventListener("input", () => evaluarEstadoInputs(item)); // Llama a la función global de utils.js
        // Actualiza a "En progreso" cuando un input gana foco
        input.addEventListener("focus", () => evaluarEstadoInputs(item)); // Llama a la función global de utils.js
        // Actualiza el estado cuando un input pierde foco (con un pequeño retardo para evitar race conditions)
        input.addEventListener("blur", () => {
            setTimeout(() => {
                evaluarEstadoInputs(item); // Llama a la función global de utils.js
            }, 50);
        });
    });
});

// Llama a 'actualizarTodosLosEstadosGlobal' cuando el DOM ha sido completamente cargado.
// Esto asegura que los indicadores de estado se inicialicen correctamente (vacíos por defecto).
window.addEventListener('DOMContentLoaded', actualizarTodosLosEstadosGlobal);


// --- Lógica para el botón "Iniciar sesión" (redirige a login.html) ---
document.getElementById("skip")?.addEventListener("click", () => {
    window.location.href = 'login.html'; // Redirige a la página de login
});


// Event listener para el botón "Registrar" (#proceed)
document.getElementById("proceed")?.addEventListener("click", async (e) => { // Añadir 'async' aquí
    e.preventDefault(); 
    // console.log('Botón Registrar clicado.'); // Log de depuración

    actualizarTodosLosEstadosGlobal(); // Asegura que los estados de todas las secciones estén actualizados

    const secciones = document.querySelectorAll(".accordion-item");
    let todoCompleto = true;
    let primeraIncompleta = null;

    secciones.forEach((item) => {
        const status = item.querySelector("[data-status]");
        const texto = status?.textContent.trim().toLowerCase();
        // console.log(`Sección: ${item.querySelector('.header-text').textContent}, Estado: "${texto}"`);

        if (texto !== "completado") {
            todoCompleto = false;
            if (!primeraIncompleta) {
                primeraIncompleta = item;
            }
        }
    });

    // --- Lógica de validación final y feedback al usuario ---
    if (!todoCompleto) { // Si no está completo, muestra error local y sale
        showValidationMessage("⚠️ Aún hay secciones incompletas.", "error");
        
        document.querySelectorAll(".accordion-item").forEach((i) =>
            i.classList.remove("active")
        );
        if (primeraIncompleta) {
            primeraIncompleta.classList.add('active');
            primeraIncompleta.scrollIntoView({ behavior: 'smooth', block: 'center' });

            if (typeof autoHighlightFirstIncompleteElement === 'function') {
                autoHighlightFirstIncompleteElement(primeraIncompleta);
            }
        }
        actualizarTodosLosEstadosGlobal();
        return; // Sale de la función, no intenta simular API
    }

    // Si todo está completo, simular llamada a la API de registro
    showValidationMessage("⏳ Registrando cuenta...", "info"); // Mensaje de carga (de utils.js)

    // Simular el envío de datos de registro
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rolSection = document.getElementById('sectionRol');
    const rolSelected = rolSection?.querySelector('.role-option.selected')?.dataset.role;
    const gradoSection = document.getElementById('sectionGrado');
    const gradoSelected = gradoSection?.querySelector('.grade-option.selected')?.textContent;

    // Puedes simular un error basado en alguna condición (ej. un email específico)
    const simulateError = (email === 'error@test.com');

    try {
        // Simulación de fetch a un endpoint de registro
        const response = await new Promise(resolve => setTimeout(() => {
            if (simulateError) {
                resolve({ status: 400, message: "Este email ya está registrado." });
            } else {
                resolve({ status: 200, message: "Registro exitoso.", user: { email: email, rol: rolSelected } });
            }
        }, 2000)); // Simula 2 segundos de latencia de red

        if (response.status === 200) {
            showValidationMessage("✅ ¡Registro exitoso!", "success"); // (de utils.js)
            // Aquí iría la lógica post-registro, por ejemplo, redirigir a la página de login
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirige a la página de login
            }, 1000);
        } else {
            showValidationMessage(`❌ Error en registro: ${response.message}`, "error"); // (de utils.js)
        }
    } catch (error) {
        showValidationMessage(`❌ Error de conexión: ${error.message}`, "error"); // (de utils.js)
    }
});