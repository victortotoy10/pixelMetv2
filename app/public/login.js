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
        window.location.href = '/register'; // Redirige a la página de registro
    });

    // --- Lógica del Botón "Acceder" (#loginAccessButton) ---
    // Este botón (azul) es el que realiza la autenticación en la página de login
    loginAccessButton?.addEventListener('click', async () => {
        // Aquí deberías validar el login (ejemplo ficticio)
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        // Simulación de validación (reemplaza por tu lógica real)
        const loginExitoso = email && password; // Cambia por tu verificación real

        if (loginExitoso) {
            window.location.href = "/play";
        } else {
            alert("Credenciales incorrectas");
        }
    });

    // --- joystick.js se encarga de la navegación con K y flechas ---
    // La adaptación de joystick.js en su DOMContentLoaded ya maneja los inputs y botones de login.html.
});