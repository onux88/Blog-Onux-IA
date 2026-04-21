document.addEventListener('DOMContentLoaded', () => {

    // 1. Efecto Glassmorphism en el Navbar al hacer scroll
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('nav-scrolled');
            // Quitar estilos transparentes iniciales si tuviera
            navbar.classList.remove('border-transparent');
        } else {
            navbar.classList.remove('nav-scrolled');
            navbar.classList.add('border-transparent');
        }
    });

    // 2. Sistema de Filtrado de Posts por Categoría
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sections = document.querySelectorAll('.category-section');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Eliminar estado activo de todos los botones
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-teal-500', 'text-white');
                // Restauramos clases hover
                if (!b.classList.contains('active')) {
                    b.classList.add('hover:text-brand-500');
                }
            });

            // Añadir estado activo al botón clickeado
            btn.classList.add('active');
            btn.classList.remove('hover:text-brand-500');

            const categoryFilter = btn.getAttribute('data-filter');

            // Lógica de mostrar / ocultar secciones
            sections.forEach(section => {
                // Reiniciar animación quitando la clase
                section.classList.remove('animate-fade-up');

                if (categoryFilter === 'all') {
                    // Mostrar todas
                    section.style.display = 'block';
                    // Trigger reflow para reiniciar animación
                    void section.offsetWidth;
                    section.classList.add('animate-fade-up');
                } else {
                    const sectionTitleNodes = section.querySelector('h2');

                    if (section.id !== 'otras-paginas') {
                        // Comparar con el título de la sección (case-insensitive para evitar bugs de mayúsculas)
                        const title = sectionTitleNodes ? sectionTitleNodes.innerText.trim().toLowerCase() : '';
                        const filter = categoryFilter.toLowerCase();

                        if (title === filter) {
                            section.style.display = 'block';
                            void section.offsetWidth;
                            section.classList.add('animate-fade-up');
                        } else {
                            section.style.display = 'none';
                        }
                    } else {
                        // Ocultar "Otras Misiones" al filtrar por categoría específica
                        section.style.display = 'none';
                    }
                }

                // Limpiar la clase de animación después de que termine para que pueda volver a usarse
                setTimeout(() => {
                    section.classList.remove('animate-fade-up');
                }, 600);
            });

            // Smooth scroll leve para ubicar al usuario si está muy abajo
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                const navHeight = 120;
                const offsetPosition = document.getElementById('barra-filtros').offsetTop - navHeight;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 3. Animación de Cohete — Solo una vez (localStorage)
    const intro = document.getElementById('intro');
    const mainContent = document.getElementById('mainContent');
    const rocketAssembly = document.getElementById('rocket-assembly');
    const introTitle = document.getElementById('intro-title');
    const introSubtitle = document.getElementById('intro-subtitle');
    const rocketEffects = document.getElementById('rocket-engine-effects');
    const smokeContainer = document.querySelector('.smoke-particles-container');

    function mostrarContenido() {
        if (mainContent) {
            mainContent.style.display = '';
            mainContent.style.opacity = '1';
        }
        document.body.style.overflow = '';
    }

    if (localStorage.getItem('introVisto')) {
        // ✅ YA FUE VISTO: ocultar intro, mostrar contenido directo
        if (intro) intro.remove();
        mostrarContenido();
    } else {
        // 🚀 PRIMERA VEZ: ejecutar animación completa
        if (intro) intro.style.display = 'flex';
        if (mainContent) mainContent.style.opacity = '0';
        document.body.style.overflow = 'hidden';

        createStars('.stars-container', 80);
        createStars('.stars-container-2', 40);

        // T+0.5s: Título
        setTimeout(() => {
            introTitle.classList.remove('opacity-0', 'translate-y-10');
            introTitle.classList.add('opacity-100', 'translate-y-0');
        }, 500);

        // T+1.2s: Subtítulo
        setTimeout(() => {
            introSubtitle.classList.remove('opacity-0', 'translate-y-10');
            introSubtitle.classList.add('opacity-100', 'translate-y-0');
        }, 1200);

        // T+2.5s: Ignición
        let smokeInterval;
        setTimeout(() => {
            rocketEffects.classList.remove('opacity-0');
            rocketEffects.querySelector('.engine-flare').classList.add('animate-flicker');
            smokeInterval = setInterval(createSmoke, 50);
        }, 2500);

        // T+3.5s: Despegue
        setTimeout(() => {
            if (rocketAssembly) rocketAssembly.style.transform = 'translate(-50%, -150vh)';
        }, 3500);

        // T+5.5s: Fade out + revelar contenido
        setTimeout(() => {
            clearInterval(smokeInterval);
            if (intro) intro.style.opacity = '0';

            // Mostrar contenido con fade in
            mostrarContenido();

            // Limpiar intro del DOM y guardar flag
            setTimeout(() => {
                if (intro) intro.remove();
                localStorage.setItem('introVisto', 'true');
            }, 1000);
        }, 5500);
    }

    function createStars(selector, count) {
        const container = document.querySelector(selector);
        if (!container) return;
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'absolute bg-white rounded-full star-twinkle';
            const size = Math.random() * 2 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
            star.style.setProperty('--delay', (Math.random() * 5) + 's');
            container.appendChild(star);
        }
    }

    function createSmoke() {
        if (!smokeContainer) return;
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        const size = Math.random() * 40 + 20;
        smoke.style.width = size + 'px';
        smoke.style.height = size + 'px';
        smoke.style.left = (Math.random() * 40 - 20) + 'px';
        smoke.style.setProperty('--tx', (Math.random() * 100 - 50) + 'px');
        smoke.style.setProperty('--ty', (Math.random() * -100 - 50) + 'px');
        smokeContainer.appendChild(smoke);
        setTimeout(() => smoke.remove(), 2000);
    }


    // 4. Lógica del Modal Artemis y NASA API
    const modal = document.getElementById('artemis-modal');
    const btnOpenModals = document.querySelectorAll('.open-artemis-btn');
    const btnCloseModal = document.getElementById('close-artemis-btn');
    let nasaApiLoaded = false;

    if (btnOpenModals.length > 0 && modal) {
        // Función para cerrar modal
        const closeModalFunc = () => {
            modal.classList.add('opacity-0');
            modal.querySelector('div').classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = '';
            }, 300);
        };

        // Abrir Modal (iterar sobre todos los botones posibles)
        btnOpenModals.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                // Forzar reflow para animación
                void modal.offsetWidth;
                modal.classList.remove('opacity-0');
                modal.querySelector('div').classList.remove('scale-95');
                document.body.style.overflow = 'hidden';

                // Llamar a NASA API solo la primera vez que se abre
                if (!nasaApiLoaded) {
                    cargarNasaApi();
                }
            });
        });

        // Eventos de cierre
        btnCloseModal.addEventListener('click', closeModalFunc);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModalFunc();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModalFunc();
            }
        });
    }

    function cargarNasaApi() {
        const containerLo = document.getElementById('nasa-api-container');
        const contentDiv = document.getElementById('nasa-api-content');
        const img = document.getElementById('nasa-image');
        const title = document.getElementById('nasa-title');
        const desc = document.getElementById('nasa-desc');

        fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
            .then(res => {
                if (!res.ok) throw new Error('Error limitando API NASA');
                return res.json();
            })
            .then(data => {
                if (data.media_type === 'image') {
                    img.src = data.url;
                } else {
                    img.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800';
                }
                title.innerText = data.title || 'Foto de Astronomía';
                desc.innerText = data.explanation || '';

                containerLo.classList.add('hidden');
                contentDiv.classList.remove('hidden');
                nasaApiLoaded = true;
            })
            .catch(err => {
                console.error(err);
                title.innerText = 'Sistema de Exploración Off-line';
                desc.innerText = 'La conexión con la base de datos abierta de la NASA no está disponible en este instante.';
                img.src = 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=800&q=80';

                containerLo.classList.add('hidden');
                contentDiv.classList.remove('hidden');
                nasaApiLoaded = true; // No volver a intentar si falló recargará todo.
            });
    }

    // Estrellas de fondo para cohete inicial
    const starsContainer = document.querySelector('.stars-container');
    if (starsContainer) {
        for (let i = 0; i < 60; i++) {
            const star = document.createElement('div');
            star.className = 'absolute bg-white rounded-full';
            const size = Math.random() * 3 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.opacity = Math.random() * 0.7 + 0.3;
            if (Math.random() > 0.5) star.classList.add('animate-pulse');
            starsContainer.appendChild(star);
        }
    }
});

// ─── Toggle expandible para tarjetas de misión ───────────────────────────────
function toggleMission(id) {
    const panel = document.getElementById(id + '-details');
    const chevron = document.getElementById(id + '-chevron');
    const label = document.getElementById(id + '-btn-text');

    if (!panel) return;

    const isOpen = panel.style.maxHeight && panel.style.maxHeight !== '0px';

    if (isOpen) {
        panel.style.maxHeight = '0px';
        chevron.style.transform = 'rotate(0deg)';
        label.textContent = 'Ver más detalles';
    } else {
        // Altura real del contenido para animar suavemente
        panel.style.maxHeight = panel.scrollHeight + 'px';
        chevron.style.transform = 'rotate(180deg)';
        label.textContent = 'Ver menos';
    }
}

// 🍪 SISTEMA DE COOKIES PROFESIONAL 🍪
function initCookies() {
    const consent = localStorage.getItem('cookie_consent');

    // Si ya decidió, no hacemos nada más
    if (consent) {
        if (consent === 'accepted' || JSON.parse(consent).analytics) {
            loadAnalytics();
        }
        return;
    }

    // Crear HTML del Banner
    const bannerHTML = `
    <div id="cookie-banner" class="cookie-banner p-4 md:p-6 opacity-0">
        <div class="max-w-7xl mx-auto cookie-glass rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
            <div class="flex-1 text-center md:text-left">
                <h3 class="text-white text-xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                    <span>🍪</span> Tu privacidad importa
                </h3>
                <p class="text-slate-300 text-sm md:text-base leading-relaxed">
                    Utilizamos cookies propias y de terceros para mejorar tu experiencia y analizar el tráfico. 
                    Puedes aceptar todas, rechazarlas o configurar tus preferencias. 
                    Consulta nuestra <a href="cookies.html" class="text-teal-400 hover:underline font-semibold">Política de Cookies</a>.
                </p>
            </div>
            <div class="flex flex-wrap justify-center gap-3 w-full md:w-auto">
                <button id="btn-config-cookies" class="px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 font-semibold hover:bg-slate-800 hover:text-white transition-all text-sm">
                    Configurar
                </button>
                <button id="btn-reject-cookies" class="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 hover:text-white transition-all text-sm">
                    Rechazar
                </button>
                <button id="btn-accept-cookies" class="px-8 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-teal-500/20 hover:scale-105 transition-all text-sm">
                    Aceptar todas
                </button>
            </div>
        </div>
    </div>

    <!-- Modal de Configuración -->
    <div id="cookie-modal" class="cookie-modal-overlay fixed inset-0 flex items-center justify-center p-4">
        <div class="cookie-modal bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <div class="p-8 border-b border-white/5 bg-slate-800/50">
                <h2 class="text-white text-2xl font-bold">Configuración de Cookies</h2>
                <p class="text-slate-400 text-sm mt-1">Personaliza tu experiencia de navegación.</p>
            </div>
            <div class="p-8 space-y-6">
                <div class="flex items-center justify-between gap-4">
                    <div class="flex-1">
                        <h4 class="text-white font-semibold">Cookies Necesarias</h4>
                        <p class="text-slate-500 text-xs">Esenciales para el funcionamiento básico del sitio.</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" checked disabled>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="flex items-center justify-between gap-4">
                    <div class="flex-1">
                        <h4 class="text-white font-semibold">Cookies Analíticas</h4>
                        <p class="text-slate-500 text-xs">Nos ayudan a entender cómo usas el blog para mejorar el contenido.</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="check-analytics" checked>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            <div class="p-8 bg-slate-800/30 flex justify-end gap-4">
                <button id="btn-save-config" class="w-full py-3 rounded-xl bg-teal-500 text-white font-bold hover:bg-teal-600 transition-all">
                    Guardar Preferencias
                </button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', bannerHTML);

    const banner = document.getElementById('cookie-banner');
    const modal = document.getElementById('cookie-modal');

    // Mostrar banner con delay suave
    setTimeout(() => {
        banner.classList.add('show');
        banner.classList.remove('opacity-0');
    }, 1000);

    // Eventos
    document.getElementById('btn-accept-cookies').addEventListener('click', () => saveConsent({ analytics: true }));
    document.getElementById('btn-reject-cookies').addEventListener('click', () => saveConsent({ analytics: false }));

    document.getElementById('btn-config-cookies').addEventListener('click', () => {
        modal.classList.add('show');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
    });

    document.getElementById('btn-save-config').addEventListener('click', () => {
        const analytics = document.getElementById('check-analytics').checked;
        saveConsent({ analytics });
    });

    function saveConsent(prefs) {
        localStorage.setItem('cookie_consent', JSON.stringify(prefs));
        banner.classList.remove('show');
        modal.classList.remove('show');

        if (prefs.analytics) {
            loadAnalytics();
        }
    }
}

function loadAnalytics() {
    console.log("🚀 Cookies analíticas aceptadas. Cargando scripts de tracking...");
    // Aquí se inyectarían scripts como Google Analytics
    // Example:
    /*
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    */
}

// Iniciar sistema de cookies
initCookies();

