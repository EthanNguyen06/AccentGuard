// Practice page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializePracticePage();
});

function initializePracticePage() {
    // Set up mode selection
    setupModeSelection();
    
    // Set up practice interface
    setupPracticeInterface();
}

function setupModeSelection() {
    const modeCards = document.querySelectorAll('.mode-card');
    
    modeCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            modeCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Get the mode
            currentMode = this.dataset.mode;
            
            // Update the interface
            updateModeTitle(currentMode);
            
            // ✅ Update phrases
            updateDemoPhrases(currentMode);
            
            // Show practice interface
            showPracticeInterface();
        });
    });
}

function setupPracticeInterface() {
    // Hide practice interface initially
    const practiceInterface = document.getElementById('practiceInterface');
    if (practiceInterface) {
        practiceInterface.style.display = 'none';
    }
}

function updateModeTitle(mode) {
    const titleEl = document.getElementById('currentModeTitle');
    if (!titleEl) return;
    
    const modeTitles = {
        interview: 'Interview Practice',
        presentation: 'Presentation Skills',
        meeting: 'Meeting Communication'
    };
    
    titleEl.textContent = modeTitles[mode] || 'Practice Mode';
}

function showPracticeInterface() {
    const modeSelection = document.getElementById('modeSelection');
    const practiceInterface = document.getElementById('practiceInterface');
    
    if (modeSelection && practiceInterface) {
        modeSelection.style.display = 'none';
        practiceInterface.style.display = 'block';
        
        // Scroll to practice interface
        practiceInterface.scrollIntoView({ behavior: 'smooth' });
    }
}

// Override the change mode function for practice page
function changeMode() {
    const modeSelection = document.getElementById('modeSelection');
    const practiceInterface = document.getElementById('practiceInterface');
    
    if (modeSelection && practiceInterface) {
        practiceInterface.style.display = 'none';
        modeSelection.style.display = 'block';
        
        // Scroll to mode selection
        modeSelection.scrollIntoView({ behavior: 'smooth' });
    }
}
