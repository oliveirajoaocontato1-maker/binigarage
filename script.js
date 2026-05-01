// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

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

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.98)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    }
});

// Form Submission
document.querySelector('.contact-form form').addEventListener('submit', function(e) {
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

// Custom Video Audio Controls
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('bgVideo');
    const audioToggle = document.getElementById('audioToggle');
    const volumeControl = document.getElementById('volumeControl');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    const audioIcon = audioToggle.querySelector('.audio-icon');
    const audioText = audioToggle.querySelector('.audio-text');
    
    let isAudioEnabled = false;
    
    // Force video to play
    function forceVideoPlay() {
        if (video) {
            video.play().then(() => {
                console.log('Video is playing');
            }).catch(error => {
                console.log('Video play failed:', error);
                // Try to play muted first, then unmute
                video.muted = true;
                video.play().then(() => {
                    console.log('Video playing muted');
                }).catch(err => {
                    console.log('Muted play also failed:', err);
                });
            });
        }
    }
    
    // Try to play video immediately
    forceVideoPlay();
    
    // Also try when page is fully loaded
    window.addEventListener('load', forceVideoPlay);
    
    // Try again when user interacts
    document.addEventListener('click', forceVideoPlay, { once: true });
    
    // Simple audio activation - only on explicit user click
    function enableAudioOnFirstInteraction() {
        const enableAudio = (event) => {
            // Only activate on actual click, not mousemove or keydown
            if (event.type === 'click' && !isAudioEnabled) {
                event.preventDefault();
                event.stopPropagation();
                
                // Create a user gesture context
                const userGesture = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                
                // Try to unmute within user gesture context
                try {
                    video.muted = false;
                    video.volume = volumeSlider.value / 100;
                    isAudioEnabled = true;
                    
                    // Update UI
                    audioIcon.textContent = '';
                    audioText.textContent = 'Desativar Som';
                    volumeControl.style.display = 'flex';
                } catch (error) {
                    console.log('Audio activation failed:', error);
                }
                
                // Remove this listener
                document.removeEventListener('click', enableAudio);
            }
        };
        
        // Only listen for click events - more reliable
        document.addEventListener('click', enableAudio);
    }
    
    // Start listening for first interaction
    enableAudioOnFirstInteraction();
    
    // Manual toggle as backup
    audioToggle.addEventListener('click', function() {
        if (!isAudioEnabled) {
            // Enable audio
            video.muted = false;
            video.volume = volumeSlider.value / 100;
            isAudioEnabled = true;
            
            // Update UI
            audioIcon.textContent = '';
            audioText.textContent = 'Desativar Som';
            volumeControl.style.display = 'flex';
            
            showNotification('Som ativado! Use o controle de volume.', 'success');
        } else {
            // Disable audio
            video.muted = true;
            isAudioEnabled = false;
            
            // Update UI
            audioIcon.textContent = '';
            audioText.textContent = 'Ativar Som';
            volumeControl.style.display = 'none';
            
            showNotification('Som desativado.', 'info');
        }
    });
    
    // Volume control
    volumeSlider.addEventListener('input', function() {
        const volume = this.value;
        video.volume = volume / 100;
        volumeValue.textContent = volume + '%';
        
        // Update icon based on volume
        if (volume == 0) {
            audioIcon.textContent = '';
        } else if (volume < 50) {
            audioIcon.textContent = '';
        } else {
            audioIcon.textContent = '';
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
        setTimeout(() => notification.remove(), 300);
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
document.querySelector('input[type="tel"]').addEventListener('input', function(e) {
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
