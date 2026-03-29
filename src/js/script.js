/* ============================================
   BUILDORA — Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- Cursor Glow ---
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // --- Navbar Scroll ---
    const navbar = document.getElementById('navbar');
    const featuresGlow = document.getElementById('features-glow');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        navbar.classList.toggle('scrolled', scrolled > 50);
        
        if (featuresGlow) {
            // Apply lightweight parallax margin translation
            featuresGlow.style.marginTop = `${scrolled * 0.15}px`;
        }
    });

    // --- Typewriter Effect ---
    const words = ['Get You Hired', 'Matter', 'Stand Out', 'Launch Careers', 'Impress Recruiters'];
    let wordIndex = 0, charIndex = 0, isDeleting = false;
    const typewriter = document.getElementById('typewriter');
    function type() {
        const currentWord = words[wordIndex];
        typewriter.textContent = isDeleting
            ? currentWord.substring(0, charIndex--)
            : currentWord.substring(0, charIndex++);
        let delay = isDeleting ? 40 : 80;
        if (!isDeleting && charIndex > currentWord.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex < 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 300;
        }
        setTimeout(type, delay);
    }
    type();

    // --- Hero Particles ---
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
            particlesContainer.appendChild(particle);
        }
    }

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.dataset.target;
                const suffix = entry.target.closest('.stat')?.querySelector('.stat-label')?.textContent.includes('%') ? '%' : '+';
                let current = 0;
                const increment = target / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    entry.target.textContent = Math.floor(current) + suffix;
                }, 25);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    // --- Steps Animation ---
    const steps = document.querySelectorAll('.step');
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });
    steps.forEach(s => stepObserver.observe(s));

    // --- Feature Cards Fade In ---
    const featureCards = document.querySelectorAll('.feature-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0px)';
                    setTimeout(() => { entry.target.style.transform = ''; }, 650);
                }, i * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });

    // --- Project Filters ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            projectCards.forEach(card => {
                const show = filter === 'all' || card.dataset.category === filter;
                card.style.opacity = show ? '1' : '0.15';
                card.style.transform = show ? 'scale(1)' : 'scale(0.95)';
                card.style.pointerEvents = show ? 'auto' : 'none';
            });
        });
    });

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // --- Premium 3D Tilt Effect on Dashboard Preview ---
    const dashPreview = document.querySelector('.dashboard-preview');
    const heroVisual = document.querySelector('.hero-visual');
    if (dashPreview && heroVisual) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const rotateX = (y / (rect.height / 2)) * -12;
            const rotateY = (x / (rect.width / 2)) * 12;
            
            dashPreview.style.transition = 'transform 0.1s ease-out';
            dashPreview.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
        });
        heroVisual.addEventListener('mouseleave', () => {
            dashPreview.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
            dashPreview.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    }

    // --- Pricing Card Hover ---
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 0 40px rgba(124, 58, 237, 0.2)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
    });
});
