/**
 * ARGABIM - Core Interaction Engine
 * Optimized for performance and smooth UX
 */

// --- 0. Security & Environment Checks ---
/* global THREE, supabase */
// Force HTTPS in production
if (
    location.protocol !== 'https:' &&
    location.protocol !== 'file:' &&
    location.hostname !== 'localhost' &&
    location.hostname !== '127.0.0.1' &&
    location.hostname !== ''
) {
    location.replace('https://' + location.hostname + location.pathname + location.search);
}

// Disable Right Click
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Disable Inspection Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
document.addEventListener('keydown', (e) => {
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
    ) {
        e.preventDefault();
    }
});

// --- 0.1 Preloader Logic ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
        }, 1000);
    }
});




// --- 1. Navigation & Scroll Effects ---
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-nav');
    const backToTop = document.getElementById('back-to-top');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Progress bar logic
        const scrollProgress = document.getElementById('scroll-progress');
        if (scrollProgress) {
            const winScroll = window.pageYOffset || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + '%';
        }

        // Sidebar navigation dots logic
        // Updated ordered list of sections
        const sections = ['home', 'about', 'services', 'commitments', 'works', 'contact'];
        const dots = document.querySelectorAll('.side-dot');

        let currentSectionIndex = -1;

        sections.forEach((id, index) => {
            const section = document.getElementById(id);
            if (section) {
                const rect = section.getBoundingClientRect();
                // Check if the top of the section is within the viewport (with offset)
                // OR if the bottom of the section is still in view
                // We use a larger window to detect active state more robustly
                if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
                    currentSectionIndex = index;
                }
            }
        });

        if (currentSectionIndex !== -1) {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentSectionIndex]) dots[currentSectionIndex].classList.add('active');
        }

        // Header glass effect
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back to top visibility
        if (backToTop) {
            if (scrollY > 500) {
                backToTop.style.display = 'flex';
                setTimeout(() => backToTop.classList.add('visible'), 10);
            } else {
                backToTop.classList.remove('visible');
                setTimeout(() => {
                    if (!backToTop.classList.contains('visible')) {
                        backToTop.style.display = 'none';
                    }
                }, 300);
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 2. Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('overflow-hidden');
        });

        // Close menu when clicking a link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('overflow-hidden');
            });
        });
    }

    // --- 3. Reveal Animations (Intersection Observer) ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

    // --- 3.1 Service Cards Flip (Replacing inline onclick) ---
    document.querySelectorAll('.service-flip-container').forEach(card => {
        card.addEventListener('click', function () {
            this.classList.toggle('flipped');
        });

        // Add keyboard accessibility (Enter/Space to flip)
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('flipped');
            }
        });
    });

    // --- Supabase Configuration (Obfuscated) ---
    const _0x1a2b = (str) => atob(str);
    const _0x4f3d = {
        u: 'aHR0cHM6Ly95dGpjaG15eWd3eGh6bHB1eXNwaS5zdXBhYmFzZS5jbw==',
        k: 'c2JfcHVibGlzaGFibGVfdWloOWEtNlRsdjBKMEpoaUREcWQzUV9fVVZUbGZVRQ=='
    };

    let _supabase;
    try {
        if (window.supabase) {
            _supabase = window.supabase.createClient(_0x1a2b(_0x4f3d.u), _0x1a2b(_0x4f3d.k));
        } else {
            console.error("Supabase SDK non trouvé.");
        }
    } catch (e) {
        console.error("Erreur d'initialisation Supabase:", e);
    }

    // --- 4. Form Submission ---
    const quoteForm = document.getElementById('quote-form');
    // Timestamp when the form/page loaded to detect instant bot submissions
    const formLoadTime = Date.now();

    if (quoteForm) {
        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // --- Check if Supabase is initialized ---
            if (!_supabase) {
                alert("Le service d'envoi est temporairement indisponible (SDK non chargé). Veuillez nous contacter par téléphone.");
                console.error("Supabase SDK not initialized.");
                return;
            }

            // --- 4.0. Time-Based Bot Detection (< 2 seconds) ---
            if (Date.now() - formLoadTime < 2000) {
                console.warn('Bot detected: Submission too fast.');
                return;
            }

            // --- 4.1. Honeypot Anti-Spam Check ---
            // If the hidden field 'website_check' is filled, it's a bot.
            const honeypot = document.getElementById('website_check');
            if (honeypot && honeypot.value !== '') {
                console.warn('Bot detected by honeypot.');
                // Simulate success to fool the bot
                setTimeout(() => { window.location.href = 'thanks.html'; }, 500);
                return;
            }

            // --- 4.2. Local Storage Rate Limiting (1 submission per 10 mins) ---
            const lastSubmission = localStorage.getItem('last_submission_time');
            if (lastSubmission && Date.now() - parseInt(lastSubmission) < 10 * 60 * 1000) {
                alert("Veuillez patienter quelques minutes avant de renvoyer un message.");
                return;
            }

            const btn = quoteForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Envoi en cours...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            // Simple Input Sanitization & Validation
            const sanitize = (str) => {
                const temp = document.createElement('div');
                temp.textContent = str;
                return temp.innerHTML;
            };

            const formData = new FormData(quoteForm);
            const rawEmail = formData.get('email');
            const rawMsg = formData.get('message');
            const rawName = formData.get('first_name') + ' ' + formData.get('last_name');

            // Regex Validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(rawEmail)) {
                alert("Email invalide.");
                btn.innerText = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
                return;
            }

            // Length Validation (Prevent massive payloads)
            if (rawMsg.length > 2000 || rawName.length > 100) {
                alert("Message ou nom trop long.");
                btn.innerText = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
                return;
            }

            const payload = {
                first_name: sanitize(formData.get('first_name')),
                last_name: sanitize(formData.get('last_name')),
                email: sanitize(rawEmail),
                message: sanitize(rawMsg),
                metadata: { source: 'website_contact_form' }
            };

            try {
                const { data, error } = await _supabase
                    .from('contacts')
                    .insert([payload]);

                if (error) {
                    console.error('Détails de l\'erreur Supabase:', error);
                    throw error;
                }

                // Success: Set Rate Limit Timestamp
                localStorage.setItem('last_submission_time', Date.now().toString());

                // Redirect to success page instead of alert
                window.location.href = 'thanks.html';

            } catch (err) {
                console.error('Erreur attrapée:', err);
                // GENERIC ERROR MESSAGE FOR CLIENTS (Security Best Practice)
                // Do not expose internal error details like 'Row Level Security' or 'Table not found'
                alert("Une erreur technique est survenue lors de l'envoi. Veuillez réessayer plus tard ou nous contacter directement par email.");
            } finally {
                btn.innerText = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
            }
        });
    } else {
        console.warn("Formulaire de devis introuvable.");
    }

    // --- 5. Smooth Anchor Links (with Offset) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const offset = 100; // Account for fixed header
                const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 7. Typewriter Effect ---
    const titleElement = document.getElementById('hero-title');
    if (titleElement) {
        titleElement.textContent = ''; // Reset content explicitly
        const textToType = "Concevoir l'Invisible, Maîtriser le Futur.";
        let charIndex = 0;

        function typeWriter() {
            if (charIndex <= textToType.length) {
                // Use substring to ensure stable text update
                titleElement.textContent = textToType.substring(0, charIndex);
                charIndex++;
                setTimeout(typeWriter, 50); // Typing speed
            } else {
                // Highlight keywords after typing is done
                titleElement.innerHTML = titleElement.innerHTML.replace("l'Invisible", '<span class="gradient-text">l\'Invisible</span>');
                // Remove cursor blink after a while
                setTimeout(() => {
                    titleElement.classList.remove('typing-cursor');
                }, 3000);
            }
        }
        // Start typing ALMOST IMMEDIATELY (was 1000ms)
        setTimeout(typeWriter, 100);
    }

    // --- 8. 3D Tilt Effect on Cards (Contact & Services) ---
    const cards = document.querySelectorAll('.contact-card, .service-flip-container');
    cards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });

    function handleTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;

        // Dynamic shadow/glow
        const shadowX = (x - centerX) / 10;
        const shadowY = (y - centerY) / 10;
        card.style.boxShadow = `${-shadowX}px ${-shadowY}px 20px rgba(0, 212, 255, 0.2)`;
    }

    function resetTilt(e) {
        const card = e.currentTarget;
        card.style.transform = ''; // Revert to CSS (removes inline transform)
        card.style.boxShadow = ''; // Revert to CSS (removes inline shadow)
    }

    // --- 9. Neural Network Background Animation ---
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resizing() {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        }

        window.addEventListener('resize', resizing);
        resizing();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(100, 200, 255, 0.5)';
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const numParticles = 40; // Adjust for density
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animateNeural() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(100, 200, 255, ${1 - distance / 100})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateNeural);
        }

        initParticles();
        animateNeural();
    }

    // --- 10. Thanks Page Auto-Redirection ---
    if (document.body.classList.contains('thanks-page')) {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 10000);
    }
});

// --- 6. Interactive 3D Object: "The BIM Core" ---
function init3DBuilding(retryCount = 0) {
    const container = document.getElementById('building-3d-container');

    if (typeof THREE === 'undefined') {
        if (retryCount < 10) {
            setTimeout(() => init3DBuilding(retryCount + 1), 500);
        }
        return;
    }
    if (!container) return;

    container.innerHTML = ''; // Reset

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();

    // Camera settings - Adapted for wide container
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(-5, 0, 24); // Move camera LEFT (-5) so object appears RIGHT.
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- MATERIALS ---
    // 1. Tech Wireframe (Cyan/Blue)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    // 2. Solid Core (Dark Grey/Metal)
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0x222233,
        roughness: 0.4,
        metalness: 0.8,
        flatShading: true
    });

    // 3. Glowing Accents
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ff, // Magenta accent
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });

    // --- GEOMETRY: THE BIM CORE ---
    const objectGroup = new THREE.Group();

    // Layer 1: Outer Shell (Icosahedron - Structural Grid)
    const outerGeo = new THREE.IcosahedronGeometry(4.5, 1);
    const outerShell = new THREE.Mesh(outerGeo, wireframeMaterial);
    objectGroup.add(outerShell);

    // Layer 2: Inner Core (Dodecahedron - The "Data" Block)
    const innerGeo = new THREE.DodecahedronGeometry(2.5, 0);
    const innerCore = new THREE.Mesh(innerGeo, coreMaterial);
    objectGroup.add(innerCore);

    // Layer 3: Floating Points (Nodes)
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 40;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 12;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    objectGroup.add(particles);

    // Layer 4: Orbital Rings (Coordination)
    const ringGeo = new THREE.TorusGeometry(6, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x444455, transparent: true, opacity: 0.3 });

    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    objectGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 2;
    objectGroup.add(ring2);

    scene.add(objectGroup);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00d4ff, 2);
    dirLight1.position.set(10, 10, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xff00ff, 2);
    dirLight2.position.set(-10, -10, 10);
    scene.add(dirLight2);

    // --- INTERACTION ---

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    container.style.cursor = 'grab';

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
        container.style.cursor = 'grabbing';
    });

    // Listen on window to handle release outside the container
    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'grab';
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        // Rotate object based on drag
        objectGroup.rotation.y += deltaX * 0.005;
        objectGroup.rotation.x += deltaY * 0.005;

        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // --- ANIMATION LOOP & OPTIMIZATION ---
    let isVisible = true;

    // Observer to pause rendering when off-screen (Performance)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
        });
    }, { threshold: 0 });
    observer.observe(container);

    function animate() {
        requestAnimationFrame(animate);

        // Skip rendering if not visible to save battery/GPU
        if (!isVisible) return;

        // Auto-rotation when not dragging
        if (!isDragging) {
            objectGroup.rotation.y += 0.0015; // Douce rotation automatique
        }

        // Constant Idle Animation
        outerShell.rotation.y += 0.002;
        outerShell.rotation.z -= 0.001;

        innerCore.rotation.x -= 0.005;
        innerCore.rotation.y -= 0.005;

        ring1.rotation.x += 0.01;
        ring1.rotation.y += 0.005;

        ring2.rotation.y -= 0.01;

        particles.rotation.y = -Date.now() * 0.0001;

        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        if (container.clientWidth && container.clientHeight) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });


}

// --- Initialisation de la scène 3D ---
setTimeout(init3DBuilding, 100);
