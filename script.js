// Initialize EmailJS with your public key if available
if (window.emailjs && typeof emailjs.init === 'function') {
    emailjs.init('iDQQgCq8jlQ2Axu_q');
}

// Mobile menu toggle with animation
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const body = document.body;

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
}

const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

const savedTheme = localStorage.getItem('theme');
const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(savedTheme || (preferredDark ? 'dark' : 'light'));

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

function setTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    if (themeIcon) {
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
    localStorage.setItem('theme', theme);
}

// Close mobile menu when clicking links
if (hamburger && navLinks) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        });
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
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

// Active navigation highlight on scroll with Intersection Observer
const sections = document.querySelectorAll('section');
const navAnchors = document.querySelectorAll('.nav-links a');

const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -80% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navAnchors.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// Contact form submission with EmailJS
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

if (contactForm && formFeedback && submitBtn && btnText) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();
        
        // Basic validation
        if (!name || !email || !message) {
            showFeedback('⚠️ Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFeedback('⚠️ Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        setLoading(true);
        
        // Prepare template parameters for EmailJS
        const templateParams = {
            from_name: name,
            from_email: email,
            service: service || 'Not specified',
            message: message,
            to_email: 'shadowhachtech@gmail.com'
        };
        
        try {
            // Send email using EmailJS with your credentials if available
            if (window.emailjs && typeof emailjs.send === 'function') {
                const response = await emailjs.send(
                    'service_9596a95',        // Your EmailJS service ID
                    'template_ovexsps',        // Your EmailJS template ID
                    templateParams,
                    'iDQQgCq8jlQ2Axu_q'       // Your EmailJS public key
                );
                console.log('Email sent successfully!', response);
                showFeedback('✅ Thank you! Your message has been sent to shadowhachtech@gmail.com. We\'ll get back to you within 24 hours.', 'success');
                contactForm.reset();
            } else {
                showFeedback('⚠️ Email service is not available right now. Please email us directly at shadowhachtech@gmail.com', 'error');
            }
        } catch (error) {
            console.error('Email sending failed:', error);
            showFeedback('❌ Failed to send message. Please try again or email us directly at shadowhachtech@gmail.com', 'error');
        } finally {
            setLoading(false);
        }
    });
}

function showFeedback(message, type) {
    if (!formFeedback) return;
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback ${type}`;
    
    // Clear feedback after 8 seconds
    setTimeout(() => {
        if (!formFeedback) return;
        if (formFeedback.textContent === message) {
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';
        }
    }, 8000);
}

function setLoading(isLoading) {
    if (!submitBtn || !btnText) return;
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.innerHTML = '<span class="spinner"></span> Sending...';
    } else {
        submitBtn.disabled = false;
        btnText.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add subtle parallax effect to hero visual on mouse move
const heroVisual = document.querySelector('.hero-visual');
const floatingCards = document.querySelectorAll('.floating-card');

if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const moveX = (clientX - windowWidth / 2) * 0.01;
        const moveY = (clientY - windowHeight / 2) * 0.01;
        
        floatingCards.forEach((card, index) => {
            const factor = (index + 1) * 0.5;
            card.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
        });
    });
}

// Add scroll reveal animation
const observerReveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .project-card, .tech-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observerReveal.observe(el);
    
    // Trigger immediately if already visible
    if (el.getBoundingClientRect().top < window.innerHeight) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    }
});