/**
 * Form Handler Module
 * Handles form submission and API communication
 */

// ========== Form Submission Handler ==========
function initializeFormHandler() {
    const form = document.getElementById('compatibilityForm');
    const submitButton = document.getElementById('submitButton');
    
    if (!form || !submitButton) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable submit button
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        const originalText = submitButton.querySelector('.button-text').textContent;
        submitButton.querySelector('.button-text').textContent = 'Analyzing...';
        
        try {
            // Collect form data
            const formData = collectFormData();
            
            // Validate form data
            if (!validateFormData(formData)) {
                throw new Error('Please fill out all fields');
            }
            
            // Make prediction request
            const result = await submitPrediction(formData);
            
            // Display results
            displayResults(result);
            
        } catch (error) {
            console.error('Error:', error);
            showError(error.message || 'An error occurred. Please try again.');
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            submitButton.querySelector('.button-text').textContent = originalText;
        }
    });
}

// ========== Collect Form Data ==========
function collectFormData() {
    const form = document.getElementById('compatibilityForm');
    const formElements = form.elements;
    
    return {
        rating_attractiveness: parseInt(formElements['rating_attractiveness'].value),
        rating_sincerity: parseInt(formElements['rating_sincerity'].value),
        rating_intelligence: parseInt(formElements['rating_intelligence'].value),
        rating_fun: parseInt(formElements['rating_fun'].value),
        rating_ambition: parseInt(formElements['rating_ambition'].value),
        rating_interests: parseInt(formElements['rating_interests'].value),
        pref_attractiveness: parseInt(formElements['pref_attractiveness'].value),
        pref_sincerity: parseInt(formElements['pref_sincerity'].value),
        pref_intelligence: parseInt(formElements['pref_intelligence'].value),
        pref_fun: parseInt(formElements['pref_fun'].value),
        pref_ambition: parseInt(formElements['pref_ambition'].value),
        pref_interests: parseInt(formElements['pref_interests'].value),
        interest_correlation: parseFloat(formElements['interest_correlation'].value),
        age_diff: parseInt(formElements['age_diff'].value),
        same_race: parseInt(formElements['same_race'].value)
    };
}

// ========== Validate Form Data ==========
function validateFormData(data) {
    // Check if all required fields are present
    const requiredFields = [
        'rating_attractiveness', 'rating_sincerity', 'rating_intelligence',
        'rating_fun', 'rating_ambition', 'rating_interests',
        'pref_attractiveness', 'pref_sincerity', 'pref_intelligence',
        'pref_fun', 'pref_ambition', 'pref_interests',
        'interest_correlation', 'age_diff', 'same_race'
    ];
    
    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null || data[field] === '') {
            return false;
        }
    }
    
    return true;
}

// ========== Submit Prediction to Backend ==========
async function submitPrediction(data) {
    const response = await fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
    }
    
    return await response.json();
}

// ========== Display Results ==========
function displayResults(result) {
    // Hide form section
    const formSection = document.getElementById('formSection');
    const resultsSection = document.getElementById('resultsSection');
    const heroSection = document.getElementById('heroSection');
    
    if (formSection && resultsSection) {
        formSection.style.display = 'none';
        heroSection.style.display = 'none';
        resultsSection.style.display = 'block';
        
        // Update result content
        updateResultContent(result);
        
        // Animate results
        if (window.animateResult) {
            window.animateResult(result.compatibility_percentage, result.compatible);
        }
        
        // Show confetti for high compatibility
        if (result.compatibility_percentage >= 70 && window.createConfetti) {
            setTimeout(() => {
                window.createConfetti();
            }, 1500);
        }
        
        // Smooth scroll to results
        if (window.smoothScrollToResults) {
            window.smoothScrollToResults();
        }
    }
}

// ========== Update Result Content ==========
function updateResultContent(result) {
    const interpretationTitle = document.getElementById('interpretationTitle');
    const interpretationMessage = document.getElementById('interpretationMessage');
    
    if (interpretationTitle && interpretationMessage) {
        interpretationTitle.textContent = result.interpretation;
        interpretationMessage.textContent = result.message;
    }
    
    // Update colors based on compatibility
    const resultCard = document.querySelector('.result-card');
    if (resultCard) {
        if (result.compatibility_percentage >= 70) {
            resultCard.style.borderColor = 'rgba(230, 57, 70, 0.3)';
        } else if (result.compatibility_percentage >= 40) {
            resultCard.style.borderColor = 'rgba(139, 92, 246, 0.3)';
        } else {
            resultCard.style.borderColor = 'rgba(156, 163, 175, 0.3)';
        }
    }
}

// ========== Show Error Message ==========
function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #E63946, #D81159);
        color: white;
        padding: 1rem 2rem;
        border-radius: 1rem;
        box-shadow: 0 8px 32px rgba(230, 57, 70, 0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideDown 0.3s ease-out;
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
            errorDiv.remove();
        }, 300);
    }, 3000);
}

// ========== Try Again Handler ==========
function initializeTryAgainButton() {
    const tryAgainButton = document.getElementById('tryAgainButton');
    
    if (!tryAgainButton) return;
    
    tryAgainButton.addEventListener('click', () => {
        // Hide results section
        const formSection = document.getElementById('formSection');
        const resultsSection = document.getElementById('resultsSection');
        const heroSection = document.getElementById('heroSection');
        
        if (formSection && resultsSection) {
            resultsSection.style.display = 'none';
            formSection.style.display = 'block';
            heroSection.style.display = 'block';
            
            // Reset form
            resetForm();
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

// ========== Reset Form ==========
function resetForm() {
    const form = document.getElementById('compatibilityForm');
    if (!form) return;
    
    // Reset all sliders to default value (5)
    const sliders = form.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.value = 5;
        const valueDisplay = document.getElementById(slider.id + '_value');
        if (valueDisplay) {
            valueDisplay.textContent = '5';
        }
    });
    
    // Reset all selects to default values
    document.getElementById('interestCorrelation').value = '0.6';
    document.getElementById('ageDiff').value = '5';
    document.getElementById('sameRace').value = '1';
    
    // Reset progress bar
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const progressLabel = document.getElementById('progressLabel');
    
    if (progressBar && progressPercent && progressLabel) {
        progressBar.style.width = '0%';
        progressPercent.textContent = '0%';
        progressLabel.textContent = "Let's start your journey";
    }
    
    // Reset result circle
    const circleProgress = document.getElementById('circleProgress');
    if (circleProgress) {
        circleProgress.style.strokeDashoffset = '565.48';
    }
}

// ========== Initialize All Handlers ==========
function initializeHandlers() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeFormHandler();
            initializeTryAgainButton();
        });
    } else {
        initializeFormHandler();
        initializeTryAgainButton();
    }
}

// Start handlers
initializeHandlers();

// Add CSS for error notification animation
if (!document.getElementById('error-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'error-notification-styles';
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);
}