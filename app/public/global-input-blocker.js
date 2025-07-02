// global-input-blocker.js

document.addEventListener('DOMContentLoaded', () => {
    const isVirtualKeyboardElement = (target) => target.closest('#teclado-virtual') !== null;
    const isMainActionButton = (target) => target.id === 'skip' || target.id === 'proceed' ||
                                         target.id === 'loginAccessButton' || target.id === 'registerButton';

    // 1. Prevenir todos los *clics de mouse reales* en elementos interactivos que no sean del teclado virtual
    // Se usa la fase de captura (true) para interceptar el evento antes de que llegue a su destino.
    document.body.addEventListener('click', (e) => {
        // Permitir clics si provienen del teclado virtual o del overlay (para cerrar el teclado)
        if (isVirtualKeyboardElement(e.target) || e.target.id === 'modal-overlay') {
            return;
        }

        // Permitir clics programáticos (e.isTrusted === false).
        // Los clics simulados por joystick.js (element.click()) tienen isTrusted en false.
        if (!e.isTrusted) {
            console.log('[blocker] Click programático permitido en:', e.target);
            return;
        }

        // Para clics de mouse *reales* (e.isTrusted === true) en cualquier otro elemento interactivo:
        // Bloquear el clic y detener su propagación.
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.classList.contains('role-option') || e.target.classList.contains('grade-option') || e.target.closest('.accordion-header')) {
             e.preventDefault();
             e.stopPropagation();
             console.log('[blocker] Click de mouse real bloqueado en:', e.target);
        }
        
    }, true); // Usar fase de captura para interceptar temprano

    // 2. Prevenir la entrada de teclado físico y la navegación con Tab, a menos que el teclado virtual esté activo.
    document.addEventListener('keydown', (e) => {
        const tecladoVirtual = document.getElementById('teclado-virtual');
        const tecladoActivo = tecladoVirtual && tecladoVirtual.style.display !== 'none';

        // Si el teclado virtual está activo, permitir que teclado.js maneje TODOS los eventos de teclado.
        if (tecladoActivo) {
            return;
        }

        // Si el teclado virtual NO está activo, permitir solo las teclas del joystick.
        const joystickKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'k', 'K', 'ñ', 'Ñ'];
        if (joystickKeys.includes(e.key)) {
            return; // No bloquear, dejar que joystick.js gestione
        }

        // Para TODAS las demás teclas (ej: escritura directa, Tab, Enter del teclado físico, etc.):
        // Prevenir el comportamiento por defecto y detener la propagación.
        // Esto inhabilita el teclado de la laptop para interacción general.
        e.preventDefault();
        e.stopPropagation();
        console.log(`[blocker] Tecla ${e.key} del teclado físico bloqueada.`);
    }, true); // Usar fase de captura para interceptar temprano

    // 3. Prevenir que los inputs y botones ganen foco directamente por clics del mouse o tabulación
    document.querySelectorAll('input, button').forEach(el => {
        el.addEventListener('mousedown', (e) => {
            const tecladoVirtual = document.getElementById('teclado-virtual');
            const tecladoActivo = tecladoVirtual && tecladoVirtual.style.display !== 'none';
            
            // Permitir mousedown si es en una tecla del teclado virtual O si el teclado virtual está activo
            if (isVirtualKeyboardElement(e.target) || tecladoActivo) {
                return;
            }

            // Para clics de mouse reales fuera del teclado virtual, prevenir el comportamiento por defecto de mousedown (que a menudo dispara el foco)
            e.preventDefault();
            console.log('[blocker] Foco por mousedown prevenido en:', el);
        });
    });

    // 4. Prevenir que los elementos ganen foco por otros medios (ej. Tab, o foco programático no deseado)
    document.addEventListener('focusin', (e) => {
        const tecladoVirtual = document.getElementById('teclado-virtual');
        const tecladoActivo = tecladoVirtual && tecladoVirtual.style.display !== 'none';
        
        // Si el teclado virtual NO está activo y el foco intenta ir a un input o botón (que no sean los principales de acción manejados por joystick)
        if (!tecladoActivo && (e.target.tagName === 'INPUT' || (e.target.tagName === 'BUTTON' && !isMainActionButton(e.target)))) {
            e.preventDefault(); // Bloquear el foco
            e.target.blur(); // Asegurarse de que el elemento no retenga el foco
            console.log('[blocker] Foco bloqueado en:', e.target);
        }
    }, true); // Usar fase de captura
});