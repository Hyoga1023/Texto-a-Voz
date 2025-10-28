// ==========================================================
// ⚡ GSAP-ANIMATIONS.JS: Animaciones de Interfaz y Microinteracciones
// ==========================================================

// 🎯 matchMedia para responsividad de animaciones
const tts_matchMedia = gsap.matchMedia();

// ----------------------------------------------------------
// 🚀 INICIALIZACIÓN Y CARGA
// ----------------------------------------------------------

tts_matchMedia.add("(min-width: 992px)", () => {
    console.log("GSAP: Activando Animaciones de Escritorio.");

    // Animación de Carga Inicial (Fade-in escalado)
    gsap.from("header, .control-panel, .text-area-section", {
        opacity: 0,
        y: 50,
        scale: 0.98,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15
    });

    // Microinteracción de Botón (Revertida al salir del hover)
    gsap.utils.toArray(".main-btn").forEach(btn => {
        gsap.to(btn, {
            // Animación de la sombra/brillo
            boxShadow: "0 0 15px rgba(75, 233, 163, 0.5)", 
            scale: 1.05,
            duration: 0.15,
            paused: true,
            ease: "power1.out"
        }).revert();
    });

    return () => {}; // Cleanup
});

tts_matchMedia.add("(max-width: 991px)", () => {
    console.log("GSAP: Activando Animaciones Móviles (Simplificadas).");

    // Animación de Carga Inicial simplificada
    gsap.from("header, .tts-container > *", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power1.out",
        stagger: 0.1
    });

    return () => {}; // Cleanup
});

// ----------------------------------------------------------
// ⚙️ FUNCIONES DE MICROINTERACCIÓN (Llamadas desde main-core.js)
// ----------------------------------------------------------

/**
 * Anima la barra de progreso.
 * @param {number} percent - Porcentaje de progreso (0-100).
 */
window.animateProgress = function(percent) {
    const progressEl = document.getElementById('progress');
    const progressTextEl = document.getElementById('progress-text');
    const container = document.getElementById('progress-container');
    
    if (progressEl && progressTextEl && container) {
        gsap.to(progressEl, {
            width: `${percent}%`,
            duration: 0.5,
            ease: "power2.out"
        });
        progressTextEl.textContent = `${Math.round(percent)}%`;
        
        // Mostrar/Ocultar el contenedor de progreso con animación
        const shouldShow = percent > 0 && percent < 100;
        gsap.to(container, {
            height: shouldShow ? 10 : 0,
            opacity: shouldShow ? 1 : 0,
            duration: 0.3,
            display: shouldShow ? 'block' : 'none'
        });
    }
};

/**
 * Anima el cambio de valor de Tasa/Tono.
 * @param {HTMLElement} element - El elemento Span que muestra el valor.
 */
window.animateValueUpdate = function(element) {
    gsap.fromTo(element, { scale: 1.2, color: '#4BE9A3' }, { 
        scale: 1, 
        color: '#EBEBF2', 
        duration: 0.4, 
        ease: "power1.out" 
    });
};

/**
 * Anima el mensaje de estado (Success, Error, Info).
 * @param {HTMLElement} statusEl - El elemento div.status-message.
 */
window.animateStatusMessage = function(statusEl) {
    gsap.fromTo(statusEl, { scale: 0.95, opacity: 0 }, { 
        scale: 1, 
        opacity: 1, 
        duration: 0.3, 
        ease: "back.out(1.7)" 
    });
};

/**
 * Anima la aparición/desaparición del modal de ayuda.
 * @param {HTMLElement} help - El modal.
 * @param {boolean} isHidden - True si está oculto.
 */
window.animateHelpModal = function(help, isHidden) {
    const content = help.querySelector('.help-content');

    if (isHidden) {
        // Mostrar
        help.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        gsap.to(help, { opacity: 1, pointerEvents: 'auto', duration: 0.3 });
        gsap.fromTo(content, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" });
    } else {
        // Ocultar
        gsap.to(content, { y: 20, opacity: 0, duration: 0.2 });
        gsap.to(help, { opacity: 0, pointerEvents: 'none', duration: 0.3, delay: 0.1, onComplete: () => {
            help.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }});
    }
};