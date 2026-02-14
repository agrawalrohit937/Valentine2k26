/**
 * Animations Module
 * Handles all visual animations and effects
 */

// ========== Floating Hearts Animation ==========
function createFloatingHearts() {
    const heartsContainer = document.getElementById('floatingHearts');
    if (!heartsContainer) return;
    
    const heartEmojis = ['💕', '💖', '💗', '💓', '💝', '❤️', '💘'];
    const numberOfHearts = 15;
    
    for (let i = 0; i < numberOfHearts; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            
            // Random horizontal position
            heart.style.left = Math.random() * 100 + '%';
            
            // Random animation delay and duration
            heart.style.animationDelay = Math.random() * 5 + 's';
            heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
            
            // Random size
            const size = Math.random() * 1 + 1;
            heart.style.fontSize = size + 'rem';
            
            heartsContainer.appendChild(heart);
            
            // Remove heart after animation completes
            setTimeout(() => {
                heart.remove();
            }, 20000);
        }, i * 300);
    }
    
    // Continuously create new hearts
    setInterval(() => {
        if (heartsContainer.children.length < numberOfHearts) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDelay = '0s';
            heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
            const size = Math.random() * 1 + 1;
            heart.style.fontSize = size + 'rem';
            heartsContainer.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 20000);
        }
    }, 2000);
}

// ========== Slider Value Updates ==========
function initializeSliders() {
    const sliders = document.querySelectorAll('.custom-slider');
    
    sliders.forEach(slider => {
        const sliderId = slider.id;
        const valueDisplay = document.getElementById(sliderId + '_value');
        
        if (!valueDisplay) return;
        
        // Initial value
        valueDisplay.textContent = slider.value;
        
        // Update on input
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            valueDisplay.textContent = value;
            
            // Add pulse animation to value
            valueDisplay.style.transform = 'scale(1.2)';
            setTimeout(() => {
                valueDisplay.style.transform = 'scale(1)';
            }, 200);
        });
        
        // Add smooth transition
        valueDisplay.style.transition = 'transform 0.2s ease';
    });
}

// ========== Progress Bar Animation ==========
function updateProgressBar() {
    const form = document.getElementById('compatibilityForm');
    if (!form) return;
    
    const allInputs = form.querySelectorAll('input[type="range"], select');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const progressLabel = document.getElementById('progressLabel');
    
    if (!allInputs.length || !progressBar) return;
    
    function calculateProgress() {
        let interactedCount = 0;
        let defaultCount = 0;
        
        allInputs.forEach(input => {
            if (input.type === 'range') {
                // Check if slider has been moved from default (5)
                if (input.value !== '5') {
                    interactedCount++;
                }
            } else {
                // For selects, check if value has been explicitly set
                if (input.value !== '') {
                    interactedCount++;
                } else {
                    defaultCount++;
                }
            }
        });
        
        const totalInputs = allInputs.length;
        const progress = Math.round((interactedCount / totalInputs) * 100);
        
        progressBar.style.width = progress + '%';
        progressPercent.textContent = progress + '%';
        
        // Update label based on progress
        if (progress === 0) {
            progressLabel.textContent = "Let's start your journey";
        } else if (progress < 25) {
            progressLabel.textContent = "Just getting started...";
        } else if (progress < 50) {
            progressLabel.textContent = "You're making progress!";
        } else if (progress < 75) {
            progressLabel.textContent = "More than halfway there!";
        } else if (progress < 100) {
            progressLabel.textContent = "Almost there!";
        } else {
            progressLabel.textContent = "Ready to discover! 💖";
        }
    }
    
    // Listen to all inputs
    allInputs.forEach(input => {
        input.addEventListener('input', calculateProgress);
        input.addEventListener('change', calculateProgress);
    });
    
    // Initial calculation
    calculateProgress();
}

// ========== Scroll Animations ==========
function initializeScrollAnimations() {
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
    
    // Observe all trait sections
    const traitSections = document.querySelectorAll('.trait-section');
    traitSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// ========== Result Animation ==========
// function animateResult(percentage, compatible) {
//     const resultIcon = document.getElementById('resultIcon');
//     const resultTitle = document.getElementById('resultTitle');
//     const percentageNumber = document.getElementById('percentageNumber');
//     const circleProgress = document.getElementById('circleProgress');
    
//     if (!resultIcon || !resultTitle || !percentageNumber || !circleProgress) return;
    
//     // Set icon based on compatibility
//     resultIcon.textContent = compatible ? '❤️' : '💔';
//     resultTitle.textContent = compatible ? 'Compatible!' : 'Not Quite...';
    
//     // Animate percentage from 0 to actual value
//     let currentPercentage = 0;
//     const duration = 2000; // 2 seconds
//     const increment = percentage / (duration / 16); // 60fps
    
//     const percentageInterval = setInterval(() => {
//         currentPercentage += increment;
//         if (currentPercentage >= percentage) {
//             currentPercentage = percentage;
//             clearInterval(percentageInterval);
//         }
//         percentageNumber.textContent = Math.round(currentPercentage);
//     }, 16);
    
//     // Animate circle
//     const circumference = 2 * Math.PI * 90; // radius = 90
//     const offset = circumference - (percentage / 100) * circumference;
    
//     setTimeout(() => {
//         circleProgress.style.strokeDashoffset = offset;
//     }, 500);
    
//     // Add gradient to circle
//     const svgElement = document.querySelector('.circle-svg');
//     if (svgElement && !document.getElementById('circleGradient')) {
//         const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
//         const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
//         gradient.setAttribute('id', 'circleGradient');
//         gradient.innerHTML = `
//             <stop offset="0%" style="stop-color:#E63946;stop-opacity:1" />
//             <stop offset="50%" style="stop-color:#D81159;stop-opacity:1" />
//             <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
//         `;
//         defs.appendChild(gradient);
//         svgElement.insertBefore(defs, svgElement.firstChild);
//     }
// }

// function animateResult(percentage) {
//     const resultIcon = document.getElementById('resultIcon');
//     const percentageNumber = document.getElementById('percentageNumber');
//     const circleProgress = document.getElementById('circleProgress');

//     if (!percentageNumber || !circleProgress) return;

//     // ❤️ ICON BASED ON PERCENTAGE (NO TITLE HERE)
//     if (resultIcon) {
//         if (percentage >= 70) {
//             resultIcon.textContent = '❤️';
//         } else if (percentage >= 40) {
//             resultIcon.textContent = '💫';
//         } else {
//             resultIcon.textContent = '💔';
//         }
//     }

//     // 🔢 Animate percentage number
//     let current = 0;
//     const duration = 1500;
//     const increment = percentage / (duration / 16);

//     const interval = setInterval(() => {
//         current += increment;
//         if (current >= percentage) {
//             current = percentage;
//             clearInterval(interval);
//         }
//         percentageNumber.textContent = Math.round(current);
//     }, 16);

//     // ⭕ Circle animation
//     const circumference = 2 * Math.PI * 90;
//     const offset = circumference - (percentage / 100) * circumference;

//     setTimeout(() => {
//         circleProgress.style.strokeDashoffset = offset;
//     }, 300);
// }

// function animateResult(percentage) {
//     const percentageNumber = document.getElementById('percentageNumber');
//     const circleProgress = document.getElementById('circleProgress');

//     if (!percentageNumber || !circleProgress) return;

//     const radius = 90;
//     const circumference = 2 * Math.PI * radius;

//     // 🔁 RESET (THIS IS THE MAGIC)
//     circleProgress.style.transition = 'none';
//     circleProgress.style.strokeDasharray = circumference;
//     circleProgress.style.strokeDashoffset = circumference;

//     // force browser reflow
//     circleProgress.getBoundingClientRect();

//     // 🔄 enable animation again
//     circleProgress.style.transition = 'stroke-dashoffset 1.2s ease';

//     // ⭕ animate circle
//     const offset = circumference - (percentage / 100) * circumference;
//     circleProgress.style.strokeDashoffset = offset;

//     // 🔢 animate number
//     let current = 0;
//     const duration = 1200;
//     const increment = percentage / (duration / 16);

//     const interval = setInterval(() => {
//         current += increment;
//         if (current >= percentage) {
//             current = percentage;
//             clearInterval(interval);
//         }
//         percentageNumber.textContent = Math.round(current);
//     }, 16);
// }

function animateResult(percentage) {
    const percentageNumber = document.getElementById('percentageNumber');
    const circleProgress = document.getElementById('circleProgress');

    if (!percentageNumber || !circleProgress) return;

    // 1. Get the actual radius from the element
    const radius = circleProgress.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    // 2. STROKE RESET (Force the browser to see it's at 0)
    circleProgress.style.transition = 'none'; 
    circleProgress.style.strokeDasharray = `${circumference} ${circumference}`;
    circleProgress.style.strokeDashoffset = circumference;

    // 3. FORCE REFLOW (The "Duty" Fix)
    // This line is mandatory to make the transition work
    void circleProgress.offsetWidth; 

    // 4. START ANIMATION
    setTimeout(() => {
        circleProgress.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        const offset = circumference - (percentage / 100) * circumference;
        circleProgress.style.strokeDashoffset = offset;
    }, 50);

    // 5. NUMBER ANIMATION
    let current = 0;
    const duration = 1500;
    const startTime = performance.now();

    function updateNumber(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const val = Math.floor(progress * percentage);
        
        percentageNumber.textContent = val;

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            percentageNumber.textContent = Math.round(percentage);
        }
    }
    requestAnimationFrame(updateNumber);
}


// ========== Confetti Effect (for high compatibility) ==========
function createConfetti() {
    const colors = ['#E63946', '#D81159', '#FFB4D0', '#FFD700', '#8B5CF6'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.opacity = '1';
            confetti.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '50%';
            
            document.body.appendChild(confetti);
            
            const fallDuration = Math.random() * 3 + 2;
            const fallDistance = window.innerHeight + 50;
            const sway = (Math.random() - 0.5) * 200;
            
            confetti.animate([
                {
                    transform: `translateY(0px) translateX(0px) rotate(0deg)`,
                    opacity: 1
                },
                {
                    transform: `translateY(${fallDistance}px) translateX(${sway}px) rotate(${Math.random() * 720}deg)`,
                    opacity: 0
                }
            ], {
                duration: fallDuration * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            setTimeout(() => {
                confetti.remove();
            }, fallDuration * 1000);
        }, i * 30);
    }
}

// ========== Smooth Scroll to Results ==========
function smoothScrollToResults() {
    const resultsSection = document.getElementById('resultsSection');
    if (!resultsSection) return;
    
    setTimeout(() => {
        resultsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 300);
}

// ========== Initialize All Animations ==========
function initializeAnimations() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createFloatingHearts();
            initializeSliders();
            updateProgressBar();
            initializeScrollAnimations();
        });
    } else {
        createFloatingHearts();
        initializeSliders();
        updateProgressBar();
        initializeScrollAnimations();
    }
}

// Start animations
initializeAnimations();

// Export functions for use in other modules
window.animateResult = animateResult;
window.createConfetti = createConfetti;
window.smoothScrollToResults = smoothScrollToResults;
