// Demo page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeDemoPage();
});

function initializeDemoPage() {
    // Set up demo-specific event listeners
    setupDemoControls();
    
    // Initialize animations
    initializeAnimations();
}

function setupDemoControls() {
    // Demo mode buttons
    const demoModeBtns = document.querySelectorAll('.demo-mode-btn');
    demoModeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            demoModeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentMode = this.dataset.mode;
        });
    });
    
    // Demo record button
    const demoRecordBtn = document.getElementById('demoRecordBtn');
    if (demoRecordBtn) {
        demoRecordBtn.addEventListener('click', function() {
            if (!apiKey || apiKey === 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
                showModal();
                return;
            }
            toggleRecording();
        });
    }
    
    // Modal controls
    const modal = document.getElementById('apiModal');
    if (modal) {
        // Close modal button
        const closeBtn = document.getElementById('closeModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        // Save key button
        const saveBtn = document.getElementById('modalSaveKey');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                saveApiKey();
                // Update demo button state
                const demoBtn = document.getElementById('demoRecordBtn');
                if (demoBtn) {
                    demoBtn.disabled = false;
                }
            });
        }
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

function initializeAnimations() {
    // Start speech wave animation
    startSpeechWaveAnimation();
    
    // Start AI brain animation
    startAIBrainAnimation();
    
    // Start privacy animation
    startPrivacyAnimation();
}

function startSpeechWaveAnimation() {
    const waves = document.querySelectorAll('.speech-wave .wave');
    if (waves.length === 0) return;
    
    waves.forEach((wave, index) => {
        wave.style.animationDelay = `${index * 0.2}s`;
        wave.style.animation = 'speechWave 1.5s ease-in-out infinite';
    });
}

function startAIBrainAnimation() {
    const connections = document.querySelectorAll('.ai-connections .connection');
    if (connections.length === 0) return;
    
    connections.forEach((connection, index) => {
        connection.style.animationDelay = `${index * 0.5}s`;
        connection.style.animation = 'aiConnection 2s ease-in-out infinite';
    });
}

function startPrivacyAnimation() {
    const shield = document.querySelector('.privacy-demo .shield');
    const lock = document.querySelector('.privacy-demo .lock-icon');
    
    if (shield) {
        shield.style.animation = 'shieldPulse 3s ease-in-out infinite';
    }
    
    if (lock) {
        lock.style.animation = 'lockRotate 4s linear infinite';
    }
}

// Override the showModal function for demo page
function showModal() {
    const modal = document.getElementById('apiModal');
    if (modal) {
        modal.style.display = 'flex';
        // Focus on input
        const input = document.getElementById('modalApiKey');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    }
}

// Override the closeModal function for demo page
function closeModal() {
    const modal = document.getElementById('apiModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Demo-specific feedback display
function displayDemoFeedback(feedback) {
    const feedbackEl = document.getElementById('demoFeedback');
    const contentEl = document.getElementById('demoFeedbackContent');
    
    if (!feedbackEl || !contentEl) return;
    
    // Split feedback into items and format
    const tips = feedback.split('\n').filter(tip => tip.trim().length > 0);
    
    contentEl.innerHTML = tips.map(tip => 
        `<div class="demo-feedback-item">${tip.replace(/^\d+\.?\s*[-•]\s*/, '').trim()}</div>`
    ).join('');
    
    feedbackEl.style.display = 'block';
    feedbackEl.scrollIntoView({ behavior: 'smooth' });
}

// Override the displayFeedback function for demo page
function displayFeedback(feedback) {
    displayDemoFeedback(feedback);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes speechWave {
        0%, 100% { height: 10px; }
        50% { height: 30px; }
    }
    
    @keyframes aiConnection {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
    }
    
    @keyframes shieldPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    @keyframes lockRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .speech-wave .wave {
        background: linear-gradient(135deg, #667eea, #764ba2);
        width: 4px;
        height: 10px;
        margin: 0 2px;
        border-radius: 2px;
        display: inline-block;
    }
    
    .ai-connections .connection {
        width: 20px;
        height: 2px;
        background: #667eea;
        margin: 5px 0;
        border-radius: 1px;
    }
`;
document.head.appendChild(style);

// Recording state
let isRecording = false;

// Toggle recording function
function toggleRecording() {
    const button = document.getElementById('demoRecordBtn');
    const status = document.getElementById('demoStatus');
    const transcription = document.getElementById('demoTranscription');
    
    if (!button || !status || !transcription) return;
    
    isRecording = !isRecording;
    
    if (isRecording) {
        // Start recording
        button.innerHTML = '<span class="record-icon">⬤</span> Stop Recording';
        button.classList.add('recording');
        status.textContent = 'Recording in progress...';
        transcription.textContent = 'Listening...';
        
        // Start the actual recording here
        startRecording();
    } else {
        // Stop recording
        button.innerHTML = '<span class="record-icon">🎤</span> Start Demo Recording';
        button.classList.remove('recording');
        status.textContent = 'Recording stopped';
        
        // Stop the actual recording here
        stopRecording();
    }
}

// Start recording function
function startRecording() {
    // Request microphone access
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // Create MediaRecorder instance
            const mediaRecorder = new MediaRecorder(stream);
            window.mediaRecorder = mediaRecorder;
            
            // Set up data handling
            const audioChunks = [];
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            
            // When recording stops
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                // Process the recorded audio
                processAudio(audioBlob);
            };
            
            // Start recording
            mediaRecorder.start();
        })
        .catch(error => {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone. Please check permissions.');
            toggleRecording(); // Reset recording state
        });
}

// Stop recording function
function stopRecording() {
    if (window.mediaRecorder && window.mediaRecorder.state !== 'inactive') {
        window.mediaRecorder.stop();
    }
}

// Process recorded audio
function processAudio(audioBlob) {
    // Show loading state
    const loadingEl = document.getElementById('demoLoading');
    if (loadingEl) loadingEl.style.display = 'block';
    
    // Example processing - replace with actual API call
    setTimeout(() => {
        // Hide loading
        if (loadingEl) loadingEl.style.display = 'none';
        
        // Show example feedback
        displayDemoFeedback(
            "1. Your pace was good and consistent\n" +
            "2. Consider using more professional terminology\n" +
            "3. Watch out for filler words like 'um' and 'uh'"
        );
    }, 2000);
}
