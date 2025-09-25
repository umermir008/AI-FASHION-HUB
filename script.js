// AI Virtual Fashion Hub - Interactive JavaScript
// Powered by GSAP, Three.js, and WebGL

// Global variables
let scene, camera, renderer, heroModel;
let isLoading = true;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after content loads
    setTimeout(hideLoadingScreen, 2000);
    
    // Initialize all components
    initNavigation();
    initHero3D();
    initScrollAnimations();
    initInteractiveElements();
    initTypewriterEffect();
    initFormHandlers();
    initParticleBackground();
    
    // Register GSAP ScrollTrigger and ScrollTo plugins
    gsap.registerPlugin(ScrollTrigger, ScrollTo);
});

// Loading Screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    gsap.to(loadingScreen, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
            loadingScreen.style.display = 'none';
            isLoading = false;
            startMainAnimations();
        }
    });
}

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Enhanced mobile menu button interactions
    if (mobileMenuBtn) {
        // GSAP hover animations
        mobileMenuBtn.addEventListener('mouseenter', () => {
            gsap.to(mobileMenuBtn, {
                scale: 1.1,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
            
            gsap.to(mobileMenuBtn.querySelector('span'), {
                rotation: 180,
                scale: 1.2,
                duration: 0.4,
                ease: "back.out(1.7)"
            });
        });
        
        mobileMenuBtn.addEventListener('mouseleave', () => {
            if (!mobileMenuBtn.classList.contains('active')) {
                gsap.to(mobileMenuBtn, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                gsap.to(mobileMenuBtn.querySelector('span'), {
                    rotation: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });
        
        // Click animation
        mobileMenuBtn.addEventListener('mousedown', () => {
            gsap.to(mobileMenuBtn, {
                scale: 0.95,
                duration: 0.1,
                ease: "power2.out"
            });
        });
        
        mobileMenuBtn.addEventListener('mouseup', () => {
            gsap.to(mobileMenuBtn, {
                scale: 1.1,
                duration: 0.2,
                ease: "back.out(1.7)"
            });
        });
    }
    
    // Mobile menu toggle with enhanced animations
    mobileMenuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        
        if (isHidden) {
            // Opening animation
            mobileMenu.classList.remove('hidden');
            mobileMenuBtn.classList.add('active');
            
            // Button transformation
            gsap.to(mobileMenuBtn.querySelector('span'), {
                rotation: 90,
                scale: 0.9,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Menu entrance animation
            gsap.fromTo(mobileMenu, 
                { 
                    opacity: 0, 
                    y: -50,
                    backdropFilter: "blur(0px)"
                },
                { 
                    opacity: 1, 
                    y: 0,
                    backdropFilter: "blur(20px)",
                    duration: 0.4,
                    ease: "power3.out"
                }
            );
            
            // Animate menu items
            const menuItems = mobileMenu.querySelectorAll('a');
            gsap.fromTo(menuItems, 
                { 
                    opacity: 0, 
                    x: -30,
                    scale: 0.9
                },
                { 
                    opacity: 1, 
                    x: 0,
                    scale: 1,
                    duration: 0.3,
                    stagger: 0.1,
                    delay: 0.2,
                    ease: "back.out(1.7)"
                }
            );
        } else {
            // Closing animation
            mobileMenuBtn.classList.remove('active');
            
            // Button transformation
            gsap.to(mobileMenuBtn.querySelector('span'), {
                rotation: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Menu exit animation
            gsap.to(mobileMenu, {
                opacity: 0,
                y: -50,
                backdropFilter: "blur(0px)",
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => mobileMenu.classList.add('hidden')
            });
        }
    });
    
    // Close mobile menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            
            // Reset button animation
            gsap.to(mobileMenuBtn.querySelector('span'), {
                rotation: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
            
            gsap.to(mobileMenu, {
                opacity: 0,
                y: -50,
                duration: 0.3,
                onComplete: () => mobileMenu.classList.add('hidden')
            });
        });
        
        // Enhanced link hover effects
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                x: 10,
                color: "#FFD700",
                textShadow: "0 0 10px rgba(255, 215, 0, 0.6)",
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                x: 0,
                color: "#ffffff",
                textShadow: "none",
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Keyboard accessibility
    mobileMenuBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            mobileMenuBtn.click();
        }
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            mobileMenuBtn.click();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.classList.contains('hidden') && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.click();
        }
    });
    
    // Navbar scroll effect and active section highlighting
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Navbar background effect
        if (scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
        
        // Active section highlighting
        highlightActiveSection();
    });
}

// Highlight active navigation section
function highlightActiveSection() {
    const sections = ['hero', 'about', 'collections', 'tryon', 'contact'];
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const mobileLinks = document.querySelectorAll('#mobileMenu a[href^="#"]');
    
    let currentSection = 'hero';
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = sectionId;
            }
        }
    });
    
    // Update navigation links
    [...navLinks, ...mobileLinks].forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
            link.classList.add('text-golden');
            link.classList.remove('text-white');
        } else {
            link.classList.remove('text-golden');
            link.classList.add('text-white');
        }
    });
}

// Initialize Hero 3D Model
function initHero3D() {
    const container = document.getElementById('hero3DModel');
    if (!container) return;
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(384, 384); // 96 * 4 (24rem in Tailwind)
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x00D4FF, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    const neonLight = new THREE.PointLight(0xFF006E, 0.8, 100);
    neonLight.position.set(-10, 5, 5);
    scene.add(neonLight);
    
    // Create a futuristic sneaker/jacket placeholder
    createHeroModel();
    
    // Position camera
    camera.position.z = 5;
    
    // Start render loop
    animate3D();
}

function createHeroModel() {
    // Create a futuristic sneaker shape using basic geometries
    const group = new THREE.Group();
    
    // Main body of sneaker
    const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 3);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00D4FF,
        transparent: true,
        opacity: 0.9,
        shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);
    
    // Sole
    const soleGeometry = new THREE.BoxGeometry(2.2, 0.3, 3.2);
    const soleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xFF006E,
        transparent: true,
        opacity: 0.8
    });
    const sole = new THREE.Mesh(soleGeometry, soleMaterial);
    sole.position.y = -0.55;
    group.add(sole);
    
    // Accent lines
    for (let i = 0; i < 3; i++) {
        const lineGeometry = new THREE.BoxGeometry(2.1, 0.05, 0.1);
        const lineMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8AC926,
            emissive: 0x8AC926,
            emissiveIntensity: 0.3
        });
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.position.set(0, 0.2 - i * 0.2, 1.5);
        group.add(line);
    }
    
    // Add wireframe overlay for futuristic look
    const wireframeGeometry = new THREE.BoxGeometry(2.5, 1.2, 3.5);
    const wireframeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00D4FF,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    group.add(wireframe);
    
    heroModel = group;
    scene.add(heroModel);
}

function animate3D() {
    requestAnimationFrame(animate3D);
    
    if (heroModel && !isLoading) {
        // Smooth rotation
        heroModel.rotation.y += 0.01;
        heroModel.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        
        // Floating animation
        heroModel.position.y = Math.sin(Date.now() * 0.002) * 0.2;
    }
    
    renderer.render(scene, camera);
}

// Main animations after loading
function startMainAnimations() {
    // Hero section entrance
    gsap.fromTo("#hero h1", {
        y: 100,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out"
    });
    
    gsap.fromTo("#hero p", {
        y: 50,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        delay: 0.3,
        ease: "power3.out"
    });
    
    gsap.fromTo("#hero .flex", {
        y: 30,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.6,
        ease: "power3.out"
    });
    
    // Initialize hero button links
    initHeroButtons();
}

// Initialize hero section button functionality
function initHeroButtons() {
    const exploreBtn = document.querySelector('#hero .bg-gradient-to-r');
    const tryBtn = document.querySelector('#hero .glass');
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: "#collections",
                ease: "power2.inOut"
            });
        });
    }
    
    if (tryBtn) {
        tryBtn.addEventListener('click', () => {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: "#tryon",
                ease: "power2.inOut"
            });
        });
    }
}

// Scroll-triggered animations
function initScrollAnimations() {
    // About section
    gsap.fromTo("#about .aspect-video", {
        x: -100,
        opacity: 0
    }, {
        x: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
            trigger: "#about",
            start: "top 80%",
            toggleActions: "play none none reset"
        }
    });
    
    gsap.fromTo("#about .space-y-6", {
        x: 100,
        opacity: 0
    }, {
        x: 0,
        opacity: 1,
        duration: 1,
        delay: 0.3,
        scrollTrigger: {
            trigger: "#about",
            start: "top 80%",
            toggleActions: "play none none reset"
        }
    });
    
    // Collections grid animation
    gsap.fromTo("#collectionsGrid .card-3d", {
        y: 100,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: "#collections",
            start: "top 80%",
            toggleActions: "play none none reset"
        }
    });
    
    // Virtual try-on section
    gsap.fromTo("#avatarContainer", {
        scale: 0.8,
        opacity: 0
    }, {
        scale: 1,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
            trigger: "#tryon",
            start: "top 80%",
            toggleActions: "play none none reset"
        }
    });
    
    // Newsletter form
    gsap.fromTo("#newsletterForm", {
        y: 50,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
            trigger: "#contact",
            start: "top 80%",
            toggleActions: "play none none reset"
        }
    });
    
    // Footer slide in
    gsap.fromTo("footer", {
        y: 100,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
            trigger: "footer",
            start: "top 90%",
            toggleActions: "play none none reset"
        }
    });
}

// Typewriter effect for About section
function initTypewriterEffect() {
    const textElement = document.querySelector('#about .space-y-4 p');
    if (!textElement) return;
    
    const text = textElement.textContent;
    textElement.textContent = '';
    
    ScrollTrigger.create({
        trigger: "#about",
        start: "top 70%",
        onEnter: () => {
            let i = 0;
            const typewriter = setInterval(() => {
                if (i < text.length) {
                    textElement.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typewriter);
                }
            }, 30);
        }
    });
}

// Interactive elements
function initInteractiveElements() {
    // Collection card interactions
    const cards = document.querySelectorAll('.card-3d');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Button ripple effects
    const rippleButtons = document.querySelectorAll('.ripple');
    rippleButtons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Avatar controls
    const changeOutfitBtn = document.getElementById('changeOutfitBtn');
    const rotateAvatarBtn = document.getElementById('rotateAvatarBtn');
    const zoomBtn = document.getElementById('zoomBtn');
    
    if (changeOutfitBtn) {
        changeOutfitBtn.addEventListener('click', () => {
            const avatar = document.querySelector('#avatarContainer .text-6xl');
            const outfits = ['🧑‍💼', '🧑‍🎨', '🧑‍🔬', '🧑‍🚀', '🧑‍🎤'];
            const randomOutfit = outfits[Math.floor(Math.random() * outfits.length)];
            
            gsap.to(avatar, {
                scale: 0,
                duration: 0.2,
                onComplete: () => {
                    avatar.textContent = randomOutfit;
                    gsap.to(avatar, { scale: 1, duration: 0.2 });
                }
            });
        });
    }
    
    if (rotateAvatarBtn) {
        rotateAvatarBtn.addEventListener('click', () => {
            const avatar = document.querySelector('#avatarContainer .text-6xl');
            gsap.to(avatar, {
                rotation: "+=360",
                duration: 1,
                ease: "power2.out"
            });
        });
    }
    
    if (zoomBtn) {
        zoomBtn.addEventListener('click', () => {
            const container = document.getElementById('avatarContainer');
            gsap.to(container, {
                scale: container.style.transform.includes('scale(1.2)') ? 1 : 1.2,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    }
    
    // Category, size, and color selector interactions
    initSelectors();
}

function initSelectors() {
    // Category selector
    const categoryButtons = document.querySelectorAll('#tryon .grid.grid-cols-3 button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => {
                btn.classList.remove('bg-neon-blue/20', 'border-neon-blue');
                btn.classList.add('border-gray-600');
            });
            button.classList.add('bg-neon-blue/20', 'border-neon-blue');
            button.classList.remove('border-gray-600');
        });
    });
    
    // Size selector
    const sizeButtons = document.querySelectorAll('#tryon .grid.grid-cols-5 button');
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            sizeButtons.forEach(btn => {
                btn.classList.remove('bg-neon-pink/20', 'border-neon-pink');
                btn.classList.add('border-gray-600');
            });
            button.classList.add('bg-neon-pink/20', 'border-neon-pink');
            button.classList.remove('border-gray-600');
        });
    });
    
    // Color selector
    const colorButtons = document.querySelectorAll('#tryon .flex.space-x-3 button');
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            colorButtons.forEach(btn => {
                btn.classList.remove('border-neon-blue', 'border-neon-pink', 'border-neon-green', 'border-white');
            });
            
            // Add appropriate border color based on button color
            if (button.classList.contains('bg-blue-500')) {
                button.classList.add('border-neon-blue');
            } else if (button.classList.contains('bg-pink-500')) {
                button.classList.add('border-neon-pink');
            } else if (button.classList.contains('bg-green-500')) {
                button.classList.add('border-neon-green');
            } else {
                button.classList.add('border-white');
            }
        });
    });
}

function createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        pointer-events: none;
        z-index: 1;
    `;
    
    button.appendChild(ripple);
    
    gsap.to(ripple, {
        scale: 1,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => ripple.remove()
    });
}

// Form handlers
function initFormHandlers() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(newsletterForm);
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Animate button
            gsap.to(submitBtn, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
            
            submitBtn.textContent = 'Joining...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.textContent = '✓ Welcome to the Future!';
                submitBtn.classList.remove('from-neon-blue', 'to-neon-pink');
                submitBtn.classList.add('bg-green-500');
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.add('from-neon-blue', 'to-neon-pink');
                    submitBtn.classList.remove('bg-green-500');
                    newsletterForm.reset();
                }, 3000);
            }, 2000);
        });
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            // Calculate offset for fixed navbar (80px height)
            const offsetTop = targetId === '#hero' ? 0 : 80;
            
            gsap.to(window, {
                duration: 1.2,
                scrollTo: {
                    y: target,
                    offsetY: offsetTop
                },
                ease: "power2.inOut"
            });
        }
    });
});

// Parallax effect for background elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.parallax');
    
    parallax.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        gsap.set(element, {
            y: scrolled * speed
        });
    });
});

// Resize handler for 3D model
window.addEventListener('resize', () => {
    if (camera && renderer) {
        const container = document.getElementById('hero3DModel');
        if (container) {
            const size = Math.min(384, container.offsetWidth);
            renderer.setSize(size, size);
            camera.aspect = 1;
            camera.updateProjectionMatrix();
        }
    }
});

// Performance optimization: Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});

// Initialize particle background
function initParticleBackground() {
    const particleBg = document.getElementById('particleBg');
    if (!particleBg) return;
    
    // Create floating particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        // Random colors
        const colors = ['#00D4FF', '#FF006E', '#8AC926'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particleBg.appendChild(particle);
    }
}

console.log('🌟 AI Virtual Fashion Hub Initialized Successfully!');
console.log('🚀 Powered by GSAP, Three.js, and Futuristic Web Technologies');