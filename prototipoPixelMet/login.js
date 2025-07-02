// login.js - Lógica específica para la página de inicio de sesión

document.addEventListener('DOMContentLoaded', () => {
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    
    // Referencias a los botones
    const registerButton = document.getElementById('registerButton');     // Es el botón IZQUIERDO (blanco), redirige a registro
    const loginAccessButton = document.getElementById('loginAccessButton'); // Es el botón DERECHO (azul), realiza autenticación

    // --- Adaptación de listeners para inputs de Credenciales de Acceso (login) ---
    // Se asegura de que la sección exista antes de añadir listeners
    const credencialesSectionLogin = document.getElementById('sectionCredencialesLogin');
    if (credencialesSectionLogin) {
        const inputsInLoginCreds = credencialesSectionLogin.querySelectorAll('input');
        inputsInLoginCreds.forEach(input => {
            input.addEventListener('input', () => evaluarEstadoInputs(credencialesSectionLogin));
            input.addEventListener('focus', () => evaluarEstadoInputs(credencialesSectionLogin));
            input.addEventListener('blur', () => {
                setTimeout(() => evaluarEstadoInputs(credencialesSectionLogin), 50);
            });
        });
    }

    // --- Adaptación de listeners para opciones de "Tu Rol" (login) ---
    // Se asegura de que la sección exista antes de añadir listeners
    const rolSectionLogin = document.getElementById('sectionRolLogin');
    if (rolSectionLogin) {
        document.querySelectorAll(".role-option").forEach((option) => {
            option.addEventListener("click", () => {
                document.querySelectorAll(".role-option").forEach((o) =>
                    o.classList.remove("selected")
                );
                option.classList.add("selected");
                actualizarTodosLosEstadosGlobal(); // Llama a la función global de utils.js
            });
        });
    }
    
    // Inicializar todos los estados al cargar la página de login
    actualizarTodosLosEstadosGlobal();


    // --- Lógica del Botón "Registrar" (#registerButton) ---
    // Este botón (blanco) ahora redirige a la página de registro
    registerButton?.addEventListener('click', () => {
        window.location.href = 'index.html'; // Redirige a la página de registro
    });

    // --- Lógica del Botón "Acceder" (#loginAccessButton) ---
    // Este botón (azul) es el que realiza la autenticación en la página de login
    loginAccessButton?.addEventListener('click', async () => {
        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();

        // Limpiar resaltados anteriores
        loginEmailInput.classList.remove('resaltado');
        loginPasswordInput.classList.remove('resaltado');
        
        // Re-evaluar estado visual de inputs para quitar 'input-pendiente' si se llenó
        evaluarEstadoInputs(credencialesSectionLogin); 


        if (email === '' || password === '') {
            showValidationMessage('⚠️ Por favor, ingresa tu email y contraseña.', 'error');
            // Resaltar el primer campo vacío
            if (email === '') {
                loginEmailInput.classList.add('resaltado');
            } else if (password === '') {
                loginPasswordInput.classList.add('resaltado');
            }
        } else {
            // Lógica real de inicio de sesión (simulada)
            if (email === 'test@pixelmet.com' && password === 'password123') {
                showValidationMessage('✅ ¡Inicio de sesión exitoso!', 'success');
                // Aquí iría la redirección a la nueva página (ej. dashboard.html)
                // setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
            } else {
                showValidationMessage('❌ Credenciales incorrectas. Intenta de nuevo.', 'error');
            }
        }
    });

    // --- joystick.js se encarga de la navegación con K y flechas ---
    // La adaptación de joystick.js en su DOMContentLoaded ya maneja los inputs y botones de login.html.
});