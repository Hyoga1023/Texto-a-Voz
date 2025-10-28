// ==========================================================
// 🚨 SWEETALERT-CONFIG.JS: SweetAlert2 Personalizado
// ==========================================================

// 💡 Base de configuración con nuestros colores (Dark Neumorphism)
const baseSwalConfig = {
    customClass: {
        popup: 'swal-popup-custom',
        confirmButton: 'swal-btn-confirm',
        cancelButton: 'swal-btn-cancel'
    },
    background: '#232949', // Deep Violet (Color de Card)
    color: '#EBEBF2',      // Light Silver (Color de Texto)
};

// 💡 Inyectar CSS para SweetAlert2 personalizado (Colores de la paleta)
document.addEventListener('DOMContentLoaded', () => {
    const swalStyles = document.createElement('style');
    swalStyles.innerHTML = `
        /* Colores Base */
        .swal2-popup {
            border-radius: 15px !important;
            box-shadow: 7px 7px 15px #131327, -7px -7px 15px #2E2E5B !important;
        }
        /* Botón de Confirmación (Acento: Electric Green) */
        .swal-btn-confirm {
            background-color: #4BE9A3 !important; 
            color: #1A1A2E !important; /* Texto oscuro sobre acento */
            font-weight: bold !important;
            border: none !important;
        }
        /* Botón de Cancelar/Secundario (Color de Fondo de Control) */
        .swal-btn-cancel {
            background-color: #1A1A2E !important; 
            color: #EBEBF2 !important;
            border: 1px solid #2E2E5B !important;
        }
        /* Color de Iconos */
        .swal2-icon.swal2-error [class^=swal2-x-line] { background: #E94B4B !important; }
        .swal2-icon.swal2-info { border-color: #4299e1 !important; color: #4299e1 !important; }
        .swal2-icon.swal2-success { border-color: #4BE9A3 !important; color: #4BE9A3 !important; }
    `;
    document.head.appendChild(swalStyles);
});

// ----------------------------------------------------------
// ⚙️ FUNCIONES DE ALERTA (Llamadas desde main-core.js)
// ----------------------------------------------------------

/**
 * Muestra un error crítico con la estética personalizada.
 * @param {string} message - Mensaje de error.
 */
window.showCriticalErrorSwal = function(message) {
    Swal.fire({
        ...baseSwalConfig,
        icon: 'error',
        title: 'Error Crítico 💥',
        text: message,
        confirmButtonText: 'Entendido',
        iconColor: '#E94B4B' // Fire Red
    });
};

/**
 * Muestra la alerta de bienvenida al cargar.
 */
window.showWelcomeAlert = function() {
    Swal.fire({
        ...baseSwalConfig,
        title: 'Bienvenido a TTS X 🎧',
        html: 'Comienza a escribir o **arrastra un PDF**. Presiona <kbd>F1</kbd> para ver los atajos de teclado.',
        icon: 'info',
        confirmButtonText: '¡Comencemos!',
        iconColor: '#4BE9A3' // Electric Green
    });
};