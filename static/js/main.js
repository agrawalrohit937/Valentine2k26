/**
 * Main JavaScript Module
 * Additional interactions and utilities
 */

// ========== Page Load Enhancements ==========
document.addEventListener('DOMContentLoaded', () => {
    
    // Add smooth reveal to hero section
    const heroSection = document.getElementById('heroSection');
    if (heroSection) {
        heroSection.style.opacity = '0';
        setTimeout(() => {
            heroSection.style.transition = 'opacity 0.8s ease-out';
            heroSection.style.opacity = '1';
        }, 100);
    }
    
    // Add hover effects to trait sections
    addTraitSectionHoverEffects();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
    
    // Add touch gestures for mobile
    addTouchGestures();
    
    // Monitor form changes for auto-save (optional)
    monitorFormChanges();
    
    // Add custom cursor effect (optional)
    addCustomCursor();
});

// ========== Trait Section Hover Effects ==========
function addTraitSectionHoverEffects() {
    const traitSections = document.querySelectorAll('.trait-section');
    
    traitSections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.01)';
            this.style.boxShadow = '0 16px 48px rgba(230, 57, 70, 0.25)';
        });
        
        section.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 32px rgba(230, 57, 70, 0.2)';
        });
    });
}

// ========== Keyboard Shortcuts ==========
function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Press 'R' to reset form (only when results are shown)
        if (e.key === 'r' || e.key === 'R') {
            const resultsSection = document.getElementById('resultsSection');
            if (resultsSection && resultsSection.style.display !== 'none') {
                const tryAgainButton = document.getElementById('tryAgainButton');
                if (tryAgainButton) {
                    tryAgainButton.click();
                }
            }
        }
        
        // Press 'Enter' on last input to submit
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.type !== 'submit') {
            const form = document.getElementById('compatibilityForm');
            const submitButton = document.getElementById('submitButton');
            if (form && submitButton && document.activeElement === e.target) {
                e.preventDefault();
                submitButton.click();
            }
        }
    });
}

// ========== Touch Gestures for Mobile ==========
function addTouchGestures() {
    let touchStartY = 0;
    let touchEndY = 0;
    
    const resultsSection = document.getElementById('resultsSection');
    
    if (resultsSection) {
        resultsSection.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, false);
        
        resultsSection.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, false);
    }
    
    function handleSwipe() {
        // Swipe up to refresh/try again
        if (touchStartY - touchEndY > 100) {
            const tryAgainButton = document.getElementById('tryAgainButton');
            if (tryAgainButton && resultsSection.style.display !== 'none') {
                // Add visual feedback
                resultsSection.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    resultsSection.style.transform = 'translateY(0)';
                }, 200);
            }
        }
    }
}

// ========== Form Auto-Save (Local Storage) ==========
function monitorFormChanges() {
    const form = document.getElementById('compatibilityForm');
    if (!form) return;
    
    // Load saved form data on page load
    loadFormData();
    
    // Save form data on input change
    const allInputs = form.querySelectorAll('input, select');
    allInputs.forEach(input => {
        input.addEventListener('change', saveFormData);
    });
}

function saveFormData() {
    const form = document.getElementById('compatibilityForm');
    if (!form) return;
    
    const formData = {};
    const allInputs = form.querySelectorAll('input[type="range"], select');
    
    allInputs.forEach(input => {
        formData[input.name] = input.value;
    });
    
    try {
        localStorage.setItem('loveCompatibilityFormData', JSON.stringify(formData));
    } catch (error) {
        console.log('Could not save form data:', error);
    }
}

function loadFormData() {
    try {
        const savedData = localStorage.getItem('loveCompatibilityFormData');
        if (!savedData) return;
        
        const formData = JSON.parse(savedData);
        const form = document.getElementById('compatibilityForm');
        if (!form) return;
        
        // Restore form values
        Object.keys(formData).forEach(name => {
            const input = form.elements[name];
            if (input) {
                input.value = formData[name];
                
                // Update slider value displays
                if (input.type === 'range') {
                    const valueDisplay = document.getElementById(input.id + '_value');
                    if (valueDisplay) {
                        valueDisplay.textContent = formData[name];
                    }
                }
            }
        });
    } catch (error) {
        console.log('Could not load form data:', error);
    }
}

// ========== Clear Saved Data ==========
function clearSavedFormData() {
    try {
        localStorage.removeItem('loveCompatibilityFormData');
    } catch (error) {
        console.log('Could not clear saved data:', error);
    }
}

// ========== Custom Cursor Effect (Optional) ==========
function addCustomCursor() {
    // Only add on desktop devices
    if (window.innerWidth < 768) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid rgba(230, 57, 70, 0.5);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.15s ease, opacity 0.15s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Smooth cursor follow
    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
    
    // Scale cursor on interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, select, .trait-section');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = 'rgba(230, 57, 70, 1)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = 'rgba(230, 57, 70, 0.5)';
        });
    });
}

// ========== Add Loading Indicator ==========
function showLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingIndicator';
    loadingDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            padding: 2rem 3rem;
            border-radius: 1.5rem;
            box-shadow: 0 8px 32px rgba(230, 57, 70, 0.2);
            z-index: 10000;
            text-align: center;
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 4px solid #FFE5EC;
                border-top-color: #E63946;
                border-radius: 50%;
                margin: 0 auto 1rem;
                animation: spin 1s linear infinite;
            "></div>
            <p style="
                font-family: 'DM Sans', sans-serif;
                font-size: 1rem;
                font-weight: 600;
                color: #E63946;
                margin: 0;
            ">Analyzing your compatibility...</p>
        </div>
    `;
    document.body.appendChild(loadingDiv);
}

function hideLoadingIndicator() {
    const loadingDiv = document.getElementById('loadingIndicator');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// ========== Add Particle Effect on Hover ==========
function addParticleEffect(element) {
    element.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const particles = ['💕', '✨', '💖', '⭐'];
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.textContent = particles[Math.floor(Math.random() * particles.length)];
                particle.style.cssText = `
                    position: fixed;
                    left: ${rect.left + Math.random() * rect.width}px;
                    top: ${rect.top + Math.random() * rect.height}px;
                    font-size: 1rem;
                    pointer-events: none;
                    z-index: 9999;
                    animation: particleFloat 1s ease-out forwards;
                `;
                document.body.appendChild(particle);
                
                setTimeout(() => particle.remove(), 1000);
            }, i * 50);
        }
    });
}

// Add particle effect style
if (!document.getElementById('particle-effect-styles')) {
    const style = document.createElement('style');
    style.id = 'particle-effect-styles';
    style.textContent = `
        @keyframes particleFloat {
            0% {
                opacity: 1;
                transform: translateY(0) scale(0);
            }
            50% {
                opacity: 1;
                transform: translateY(-30px) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-60px) scale(0.5);
            }
        }
    `;
    document.head.appendChild(style);
}

// Apply particle effect to submit button
setTimeout(() => {
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        addParticleEffect(submitButton);
    }
}, 1000);

// ========== Easter Egg: Konami Code ==========
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    // Create a burst of hearts
    const heartBurst = ['💕', '💖', '💗', '💓', '💝', '❤️', '💘', '💞'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = heartBurst[Math.floor(Math.random() * heartBurst.length)];
            heart.style.cssText = `
                position: fixed;
                left: 50%;
                top: 50%;
                font-size: 2rem;
                pointer-events: none;
                z-index: 9999;
                animation: easterEggBurst 1.5s ease-out forwards;
            `;
            
            const angle = (Math.PI * 2 * i) / 30;
            const distance = 200;
            heart.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
            heart.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
            
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 1500);
        }, i * 30);
    }
}

// Add easter egg animation style
if (!document.getElementById('easter-egg-styles')) {
    const style = document.createElement('style');
    style.id = 'easter-egg-styles';
    style.textContent = `
        @keyframes easterEggBurst {
            0% {
                opacity: 1;
                transform: translate(-50%, -50%) translate(0, 0) scale(0);
            }
            50% {
                opacity: 1;
                transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(1.5);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0.5);
            }
        }
    `;
    document.head.appendChild(style);
}

// Export functions for global use
window.showLoadingIndicator = showLoadingIndicator;
window.hideLoadingIndicator = hideLoadingIndicator;
window.clearSavedFormData = clearSavedFormData;

console.log('💝 AI Love Compatibility Checker loaded successfully!');
console.log('💡 Tip: Try the Konami Code for a surprise! ↑↑↓↓←→←→BA');