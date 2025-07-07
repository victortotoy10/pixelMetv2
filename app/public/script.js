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
    window.location.href = '/login'; // Redirige a la página de login
});


// Quita el listener de click del botón "proceed" (elimina o comenta esta parte):
// document.getElementById("proceed")?.addEventListener("click", async (e) => { ... });

// Pon el listener al <form> real:
const form = document.getElementById('registerForm');

form.addEventListener('submit', async (e) => {
  const emailInput = document.getElementById('email');
  const emailValue = emailInput.value.trim();

  // Verifica si falta el "@"
  const faltaArroba = !emailValue.includes('@');
  if (faltaArroba) {
    e.preventDefault(); // No envía

    const credencialesSection = document.getElementById('sectionCredenciales');

    // 1️⃣ Cierra todas las secciones y abre la de credenciales
    document.querySelectorAll(".accordion-item").forEach((i) => i.classList.remove("active"));
    credencialesSection.classList.add("active");
    credencialesSection.dataset.touched = 'true';
    credencialesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 2️⃣ Ahora sí, abre el teclado virtual si es necesario
    const tecladoVirtual = document.getElementById('teclado-virtual');
    if (tecladoVirtual && tecladoVirtual.style.display === 'none' && typeof crearTeclado === 'function') {
      crearTeclado(emailInput);
      isInputActive = true;
      console.log('[Validador] Teclado virtual abierto por validación.');

      setTimeout(() => {
        emailInput.focus();
        if (typeof autoHighlightFirstIncompleteElement === 'function') {
          autoHighlightFirstIncompleteElement(credencialesSection);
        }
      }, 200);
    } else {
      emailInput.focus();
      if (typeof autoHighlightFirstIncompleteElement === 'function') {
        autoHighlightFirstIncompleteElement(credencialesSection);
      }
    }

    // 🔑 Mensaje flotante personalizado
    showValidationMessage("⚠️ El correo debe incluir '@'.", "error");

    // Opcional: Forza burbuja HTML5 si quieres
    // emailInput.reportValidity();

    actualizarTodosLosEstadosGlobal();

    return; // Sale del submit
  }

  // El resto del submit sigue igual...
  if (!form.checkValidity()) {
    e.preventDefault(); // Evita el envío real

    const emailInput = document.getElementById('email');
    const credencialesSection = document.getElementById('sectionCredenciales');

    if (!emailInput.checkValidity()) {
      console.log('[Validador] Email inválido → abrir acordeón y forzar teclado virtual.');

      // Abre acordeón
      document.querySelectorAll(".accordion-item").forEach((i) => i.classList.remove("active"));
      credencialesSection.classList.add("active");
      credencialesSection.dataset.touched = 'true';

      credencialesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // === ✅ FORZA TECLADO VIRTUAL si NO está activo ===
      const tecladoVirtual = document.getElementById('teclado-virtual');
      if (tecladoVirtual && tecladoVirtual.style.display === 'none' && typeof crearTeclado === 'function') {
        crearTeclado(emailInput);
        isInputActive = true; // tu flag joystick
        console.log('[Validador] Teclado virtual abierto por validación.');

        // Espera breve antes de enfocar, para asegurar que el teclado está activo:
        setTimeout(() => {
          emailInput.focus();
          if (typeof autoHighlightFirstIncompleteElement === 'function') {
            autoHighlightFirstIncompleteElement(credencialesSection);
          }
        }, 200); // 200ms para garantizar que el teclado está activo
      } else {
        // Si ya está abierto, enfoca inmediatamente
        emailInput.focus();
        if (typeof autoHighlightFirstIncompleteElement === 'function') {
          autoHighlightFirstIncompleteElement(credencialesSection);
        }
      }

      // Mensaje flotante
      showValidationMessage("⚠️ El correo electrónico no es válido. Asegúrate de incluir '@'.", "error");

      // Forza burbuja HTML5
      emailInput.reportValidity();

      actualizarTodosLosEstadosGlobal();

      return;
    }

    return; // Si falla otro campo HTML5, puedes hacer algo similar
  }

  e.preventDefault(); // Evita reload real para el flujo simulado

  // ===================
  // Aquí sigue tu lógica de validación de secciones y simulación API
  // ===================

  actualizarTodosLosEstadosGlobal();

  const secciones = document.querySelectorAll(".accordion-item");
  let todoCompleto = true;
  let primeraIncompleta = null;

  secciones.forEach((item) => {
    const status = item.querySelector("[data-status]");
    const texto = status?.textContent.trim().toLowerCase();
    if (texto !== "completado") {
      todoCompleto = false;
      if (!primeraIncompleta) {
        primeraIncompleta = item;
      }
    }
  });

  if (!todoCompleto) {
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
    return;
  }

  // === Simula tu API ===
  showValidationMessage("⏳ Registrando cuenta...", "info");

  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const rolSection = document.getElementById('sectionRol');
  const rolSelected = rolSection?.querySelector('.role-option.selected')?.dataset.role;
  const gradoSection = document.getElementById('sectionGrado');
  const gradoSelected = gradoSection?.querySelector('.grade-option.selected')?.textContent;

  const simulateError = (email === 'error@test.com');

  try {
    const response = await new Promise(resolve => setTimeout(() => {
      if (simulateError) {
        resolve({ status: 400, message: "Este email ya está registrado." });
      } else {
        resolve({ status: 200, message: "Registro exitoso.", user: { email: email, rol: rolSelected } });
      }
    }, 2000));

    if (response.status === 200) {
      showValidationMessage("✅ ¡Registro exitoso!", "success");
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      showValidationMessage(`❌ Error en registro: ${response.message}`, "error");
    }
  } catch (error) {
    showValidationMessage(`❌ Error de conexión: ${error.message}`, "error");
  }
});