// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');

    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
        }
    }
});

// Form Submission
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: this.querySelector('input[type="text"]').value,
            phone: this.querySelector('input[type="tel"]').value,
            email: this.querySelector('input[type="email"]').value,
            service: this.querySelector('select').value,
            message: this.querySelector('textarea').value
        };

        // Simple validation
        if (!formData.name || !formData.phone || !formData.email || !formData.service) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // Get service name from select
        const serviceSelect = this.querySelector('select');
        const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;

        // Build WhatsApp message
        const whatsappMessage = `Olá! Tenho interesse nos serviços da Bini Garage.

DADOS DO CONTATO:
Nome: ${formData.name}
Telefone: ${formData.phone}
E-mail: ${formData.email}

SERVIÇO DESEJADO: ${serviceName}

MENSAGEM: ${formData.message || 'Não informada'}

Por favor, entre em contato para mais informações!`;

        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/5511921203059?text=${encodeURIComponent(whatsappMessage)}`;

        // Show notification and redirect
        showNotification('Redirecionando para WhatsApp...', 'success');

        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            this.reset();
        }, 1000);
    });
}

// Custom Video Audio Controls
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('bgVideo');
    const audioToggle = document.getElementById('audioToggle');

    if (!video || !audioToggle) {
        console.log('Vídeo ou botão de som não encontrado');
        return;
    }

    const audioIcon = audioToggle.querySelector('.audio-icon');
    let somAtivo = false;

    // Inicia o vídeo mudo
    function iniciarVideo() {
        video.muted = true;
        video.volume = 0;
        video.play().then(() => {
            console.log('Vídeo iniciado mudo com sucesso');
        }).catch(error => {
            console.log('Erro ao iniciar vídeo:', error);
        });
    }

    // Inicia o vídeo assim que possível
    iniciarVideo();
    console.log('Video controls inicializado. Clique no botão para ativar/desativar som.');

    // Controle simples do botão de som
    audioToggle.addEventListener('click', function(event) {
        event.stopPropagation();

        somAtivo = !somAtivo;

        if (somAtivo) {
            video.muted = false;
            video.volume = 1;
            if (audioIcon) audioIcon.textContent = '🔊';
            console.log('Som ativado');
        } else {
            video.muted = true;
            video.volume = 0;
            if (audioIcon) audioIcon.textContent = '🔇';
            console.log('Som desativado');
        }
    });
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');

    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-red)' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-size: 14px;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';

        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .about-text, .contact-item');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');

    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Phone number formatting
const phoneInput = document.querySelector('input[type="tel"]');

if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 0) {
            if (value.length <= 2) {
                value = `(${value}`;
            } else if (value.length <= 7) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
            }
        }

        e.target.value = value;
    });
}