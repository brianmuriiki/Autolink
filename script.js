/* ============================================
   AUTOLINK TECH - JAVASCRIPT
   Enhanced for accessibility & performance
   ============================================ */

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================
class ContactForm {
    constructor(formElement) {
        this.form = formElement;
        this.fields = formElement.querySelectorAll('[aria-invalid]');
        this.submitBtn = formElement.querySelector('#submitBtn');
        this.btnText = this.submitBtn.querySelector('.btn-text');
        this.btnLoading = this.submitBtn.querySelector('.btn-loading');
        
        this.init();
    }
    
    init() {
        // Real-time validation on blur and input
        this.fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => {
                if (field.getAttribute('aria-invalid') === 'true') {
                    this.validateField(field);
                }
            });
        });
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        const errorSpan = field.closest('.form-group').querySelector('.field-error');
        let isValid = true;
        let errorMessage = '';
        
        if (required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        } else if (type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number (10+ digits)';
            }
        } else if (field.minLength && value.length < field.minLength) {
            isValid = false;
            errorMessage = `Must be at least ${field.minLength} characters`;
        }
        
        field.setAttribute('aria-invalid', !isValid);
        field.closest('.form-group').classList.toggle('success', isValid && value);
        errorSpan.textContent = errorMessage;
        
        return isValid;
    }
    
    validateAll() {
        let isFormValid = true;
        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });
        return isFormValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        if (!this.validateAll()) {
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            const formData = new FormData(this.form);
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                this.showSuccess();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            this.showError('Something went wrong. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    setLoadingState(loading) {
        this.submitBtn.disabled = loading;
        this.btnText.style.display = loading ? 'none' : 'inline';
        this.btnLoading.style.display = loading ? 'inline-flex' : 'none';
    }
    
    showSuccess() {
        this.form.innerHTML = `
            <div class="form-success" role="alert">
                <i class="fas fa-check-circle"></i>
                <h3>Message Sent!</h3>
                <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
            </div>
        `;
    }
    
    showError(message) {
        // Check if error div exists, if not create it
        let errorDiv = this.form.querySelector('.form-error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-error-message';
            errorDiv.style.cssText = 'color: var(--error); background: var(--error-bg); padding: 12px; border-radius: 8px; margin-bottom: 16px; text-align: center; font-weight: 600;';
            errorDiv.setAttribute('role', 'alert');
            this.form.insertBefore(errorDiv, this.form.firstChild);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

// ============================================
// NAVIGATION
// ============================================
class Navigation {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.navLinks = document.getElementById('navLinks');
        this.overlay = document.getElementById('navOverlay');
        this.body = document.body;
        
        if (this.hamburger && this.navLinks) {
            this.init();
        }
    }
    
    init() {
        // Hamburger menu toggle
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking overlay
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeMenu());
        }
        
        // Close menu when clicking nav links
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navLinks.classList.contains('active')) {
                this.closeMenu();
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navLinks.classList.contains('active') && 
                !this.navLinks.contains(e.target) && 
                !this.hamburger.contains(e.target)) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        const isOpen = !this.navLinks.classList.contains('active');
        this.hamburger.classList.toggle('active');
        this.navLinks.classList.toggle('active');
        if (this.overlay) {
            this.overlay.classList.toggle('active');
        }
        this.body.classList.toggle('no-scroll', isOpen);
        this.hamburger.setAttribute('aria-expanded', isOpen);
        this.hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    }
    
    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navLinks.classList.remove('active');
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
        this.body.classList.remove('no-scroll');
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.hamburger.setAttribute('aria-label', 'Open navigation menu');
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ============================================
// ACTIVE NAVIGATION HIGHLIGHT
// ============================================
class ActiveNavigation {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navAnchors = document.querySelectorAll('.nav-links a');
        
        if (this.sections.length && this.navAnchors.length) {
            this.init();
        }
    }
    
    init() {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    this.updateActiveLink(currentId);
                }
            });
        }, observerOptions);
        
        this.sections.forEach(section => observer.observe(section));
    }
    
    updateActiveLink(currentId) {
        this.navAnchors.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
            }
        });
    }
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal');
        
        if (this.elements.length) {
            this.init();
        }
    }
    
    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.elements.forEach(el => observer.observe(el));
        
        // Show elements that are already visible on page load
        this.elements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }
}

// ============================================
// PARALLAX EFFECT (Desktop Only)
// ============================================
class ParallaxEffect {
    constructor() {
        this.heroVisual = document.querySelector('.hero-visual');
        this.floatingCards = document.querySelectorAll('.floating-card');
        
        // Only enable on desktop
        if (this.heroVisual && this.floatingCards.length && window.innerWidth > 768) {
            this.init();
        }
    }
    
    init() {
        let ticking = false;
        
        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.moveCards(e);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    moveCards(e) {
        const { clientX, clientY } = e;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const moveX = (clientX - windowWidth / 2) * 0.01;
        const moveY = (clientY - windowHeight / 2) * 0.01;
        
        this.floatingCards.forEach((card, index) => {
            const factor = (index + 1) * 0.5;
            card.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
        });
    }
}

// ============================================
// DARK MODE (Applied by default)
// ============================================
class DarkMode {
    constructor() {
        this.init();
    }
    
    init() {
        // Apply dark mode by default
        document.body.classList.add('dark-mode');
    }
}

// ============================================
// INITIALIZE ALL MODULES
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        new ContactForm(contactForm);
    }
    
    // Initialize navigation
    new Navigation();
    
    // Initialize smooth scroll
    new SmoothScroll();
    
    // Initialize active navigation
    new ActiveNavigation();
    
    // Initialize scroll reveal
    new ScrollReveal();
    
    // Initialize parallax (desktop only)
    new ParallaxEffect();
    
    // Initialize dark mode
    new DarkMode();
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Re-initialize parallax if window size changes significantly
    if (window.innerWidth > 768) {
        new ParallaxEffect();
    }
}, 250));

// ============================================
// SERVICE WORKER (Optional - for PWA)
// ============================================
// Uncomment to enable service worker
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js')
//             .then(registration => console.log('SW registered'))
//             .catch(error => console.log('SW registration failed'));
//     });
// }