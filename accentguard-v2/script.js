// Global JavaScript for AccentGuard

// Global variables
let recognition;
let isRecording = false;
let currentMode = 'interview';
let apiKey = 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Demo API key - replace with your actual key
let lastTranscript = '';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeSpeechRecognition();
    setupEventListeners();
    loadApiKey();
    updateDemoPhrases(currentMode); // Initialize demo phrases
});

function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            console.log('Speech recognition started');
            updateStatus('Listening... Speak naturally');
        };

        recognition.onresult = function(event) {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            updateTranscription(finalTranscript, interimTranscript);
            
            // Send to Gemini when we have substantial new content
            if (finalTranscript.length > lastTranscript.length + 10) {
                lastTranscript = finalTranscript;
                sendToGemini(finalTranscript);
            }
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            updateStatus(`Error: ${event.error}`);
        };

        recognition.onend = function() {
            if (isRecording) {
                recognition.start();
            }
        };
    } else {
        updateStatus('Speech recognition not supported in this browser. Please use Chrome or Edge.');
    }
}

function setupEventListeners() {
    // Mode selection (if exists on page)
    document.querySelectorAll('.mode-btn, .demo-mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.mode-btn, .demo-mode-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentMode = this.dataset.mode;
            updateDemoPhrases(currentMode);
        });
    });

    // Record button (if exists on page)
    const recordBtn = document.getElementById('recordBtn') || document.getElementById('demoRecordBtn');
    if (recordBtn) {
        recordBtn.addEventListener('click', toggleRecording);
    }

    // API key save (if exists on page)
    const saveKeyBtn = document.getElementById('saveKey') || document.getElementById('modalSaveKey');
    if (saveKeyBtn) {
        saveKeyBtn.addEventListener('click', saveApiKey);
    }

    // Modal controls (if exists on page)
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Clear button (if exists on page)
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearTranscription);
    }

    // Change mode button (if exists on page)
    const changeModeBtn = document.getElementById('changeMode');
    if (changeModeBtn) {
        changeModeBtn.addEventListener('click', changeMode);
    }
}

function loadApiKey() {
    // Check if we have a hardcoded API key (for demo purposes)
    if (apiKey && apiKey !== 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
        const recordBtn = document.getElementById('recordBtn') || document.getElementById('demoRecordBtn');
        if (recordBtn) {
            recordBtn.disabled = false;
        }
        updateStatus('Ready to start recording!');
        return;
    }
    
    // Fallback to saved key
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        apiKey = savedKey;
        const apiInput = document.getElementById('apiKey') || document.getElementById('modalApiKey');
        if (apiInput) {
            apiInput.value = '••••••••••••••••';
        }
        const recordBtn = document.getElementById('recordBtn') || document.getElementById('demoRecordBtn');
        if (recordBtn) {
            recordBtn.disabled = false;
        }
        const apiSection = document.querySelector('.api-key-section, .api-setup');
        if (apiSection) {
            apiSection.style.display = 'none';
        }
        updateStatus('Ready to start recording!');
    } else {
        // Show API key section if no key is available
        const apiSection = document.querySelector('.api-key-section, .api-setup');
        if (apiSection) {
            apiSection.style.display = 'block';
        }
        updateStatus('Please enter your API key to get started');
        
        // Show modal on demo page
        if (document.getElementById('apiModal')) {
            showModal();
        }
    }
}

function saveApiKey() {
    const keyInput = document.getElementById('apiKey') || document.getElementById('modalApiKey');
    const key = keyInput.value.trim();
    
    if (!key) {
        alert('Please enter your Gemini API key');
        return;
    }

    apiKey = key;
    localStorage.setItem('gemini_api_key', key);
    
    const apiSection = document.querySelector('.api-key-section, .api-setup');
    if (apiSection) {
        apiSection.style.display = 'none';
    }
    
    const recordBtn = document.getElementById('recordBtn') || document.getElementById('demoRecordBtn');
    if (recordBtn) {
        recordBtn.disabled = false;
    }
    
    updateStatus('API key saved! Ready to start recording.');
    
    // Close modal if open
    closeModal();
}

function toggleRecording() {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

function startRecording() {
    if (recognition && apiKey) {
        isRecording = true;
        recognition.start();
        
        const btn = document.getElementById('recordBtn') || document.getElementById('demoRecordBtn');
        if (btn) {
            btn.classList.add('recording');
            btn.innerHTML = '<span class="record-icon">⏹️</span><span class="record-text">Stop Recording</span>';
        }
        
        const transcription = document.getElementById('transcription') || document.getElementById('demoTranscription');
        if (transcription) {
            transcription.classList.add('active');
        }
        
        const feedback = document.getElementById('feedback') || document.getElementById('demoFeedback');
        if (feedback) {
            feedback.style.display = 'none';
        }
        lastTranscript = '';
    }
}

function stopRecording() {
    isRecording = false;
    if (recognition) {
        recognition.stop();
    }
    
    const btn = document.getElementById('recordBtn') || document.getElementById('demoRecordBtn');
    if (btn) {
        btn.classList.remove('recording');
        btn.innerHTML = '<span class="record-icon">🎤</span><span class="record-text">Start Recording</span>';
    }
    
    const transcription = document.getElementById('transcription') || document.getElementById('demoTranscription');
    if (transcription) {
        transcription.classList.remove('active');
    }
}

function updateStatus(message) {
    const statusEl = document.getElementById('status') || document.getElementById('demoStatus');
    if (statusEl) {
        statusEl.textContent = message;
    }
}

function updateTranscription(final, interim) {
    const transcriptionEl = document.getElementById('transcription') || document.getElementById('demoTranscription');
    if (transcriptionEl) {
        const finalText = final || 'Your speech will appear here...';
        const interimText = interim ? ` <em>(${interim})</em>` : '';
        
        transcriptionEl.innerHTML = `<strong>${finalText}</strong>${interimText}`;
    }
}

async function sendToGemini(transcript) {
    if (!apiKey) return;

    showLoading(true);
    
    try {
        const prompt = generatePrompt(transcript, currentMode);
        console.log('Sending to Gemini:', prompt);
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('API Error Response:', errorData);
            throw new Error(`API Error: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        console.log('Gemini Response:', data);
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const feedback = data.candidates[0].content.parts[0].text;
            displayFeedback(feedback);
        } else if (data.error) {
            throw new Error(`Gemini API Error: ${data.error.message}`);
        } else {
            throw new Error('Unexpected response format from Gemini API');
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        // Try fallback feedback if API fails
        const fallbackFeedback = generateFallbackFeedback(transcript, currentMode);
        displayFeedback(fallbackFeedback.join('\n'));
    } finally {
        showLoading(false);
    }
}

        function generatePrompt(transcript, mode) {
            const modeContext = {
                interview: "professional interview setting where you need to make a strong impression",
                presentation: "business presentation to colleagues where you want to convey expertise",
                meeting: "team meeting discussion where you want to contribute effectively"
            };

            return `You are a direct, honest communication coach analyzing a specific speech transcript. 

CONTEXT: The speaker is practicing for a ${modeContext[mode]}. 

ACTUAL SPEECH: "${transcript}"

TASK: Analyze this EXACT speech and provide 2-3 specific, actionable tips based on what they actually said. Be very specific about their content, words, and delivery patterns.

ANALYSIS REQUIREMENTS:
1. Count actual filler words ("um", "uh", "like") in their speech
2. Analyze their sentence structure and length
3. Check for specific words/phrases they used
4. Assess their confidence level based on their word choices
5. Look for mode-specific issues (interview: personalization, presentation: structure, meeting: collaboration)

FORMAT: Return only the tips as a simple list. Reference specific parts of their speech.

EXAMPLES of specific feedback:
- "You used 'um' 3 times in 20 seconds - practice pausing silently instead"
- "Your sentence about 'the project' was 45 words long - break it into 2-3 shorter sentences"
- "You said 'I think' twice - replace with confident statements like 'I believe' or 'Based on my experience'"
- "You mentioned 'we' only once - for meetings, use more collaborative language like 'our team' or 'together we can'"

Be VERY specific about their actual words and patterns. Don't give generic advice.`;
        }

function generateFallbackFeedback(transcript, mode) {
    const tips = [];
    
    // Analyze the actual transcript content dynamically
    const wordCount = transcript.split(' ').length;
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const hasFillers = /um|uh|like|you know/i.test(transcript);
    const fillerCount = (transcript.match(/um|uh|like|you know/gi) || []).length;
    const hesitationWords = (transcript.match(/i think|maybe|perhaps|sort of|kind of/gi) || []).length;
    
    // Dynamic length analysis
    if (wordCount < 10) {
        tips.push(`Your response is only ${wordCount} words - too brief for ${mode}. Expand with specific examples and details.`);
    } else if (wordCount > 80) {
        tips.push(`You spoke ${wordCount} words - that's too long. Cut by 30% and focus on your 3 strongest points.`);
    } else if (wordCount < 20) {
        tips.push(`At ${wordCount} words, give more substance. Add concrete examples or data to support your statements.`);
    }
    
    // Dynamic filler word analysis
    if (hasFillers) {
        if (fillerCount > 3) {
            tips.push(`You used filler words ${fillerCount} times in ${Math.ceil(wordCount/3)} seconds - this makes you sound unprepared. Practice pausing silently instead.`);
        } else {
            tips.push(`You have ${fillerCount} filler words in your speech - eliminate 'um', 'uh', and 'like' for more professional delivery.`);
        }
    }
    
    // Dynamic sentence structure analysis
    if (sentences.length > 0) {
        const avgWordsPerSentence = wordCount / sentences.length;
        if (avgWordsPerSentence > 25) {
            tips.push(`Your sentences average ${Math.round(avgWordsPerSentence)} words each - too complex. Break into shorter, clearer statements.`);
        } else if (avgWordsPerSentence < 8) {
            tips.push(`Your sentences are too short (${Math.round(avgWordsPerSentence)} words average) - combine related thoughts into complete sentences.`);
        }
    }
    
    // Dynamic confidence analysis
    if (hesitationWords > 0) {
        tips.push(`You used hesitant language ${hesitationWords} times ('I think', 'maybe') - replace with confident statements like 'I believe' or 'Based on my experience'.`);
    }
    
    // Mode-specific dynamic feedback
    if (mode === 'interview') {
        const personalWords = (transcript.match(/\b(i|my|me|myself)\b/gi) || []).length;
        if (personalWords < 2) {
            tips.push("You're not personalizing your answer - use 'I' statements and share specific experiences from your background.");
        }
        if (!/experience|worked|accomplished|achieved|learned|grew/i.test(transcript)) {
            tips.push("Include specific examples from your experience - mention projects, achievements, or challenges you've overcome.");
        }
    } else if (mode === 'presentation') {
        if (!/first|second|third|next|finally|in conclusion|overview|summary/i.test(transcript)) {
            tips.push("Your presentation lacks structure - organize with clear transitions like 'First', 'Second', 'Finally' or 'In conclusion'.");
        }
        if (!/data|results|analysis|findings|recommendation/i.test(transcript)) {
            tips.push("Add concrete data or results to support your points - presentations need evidence and analysis.");
        }
    } else if (mode === 'meeting') {
        const teamWords = (transcript.match(/\b(we|our|team|together|collaborate|us)\b/gi) || []).length;
        if (teamWords < 2) {
            tips.push("You're speaking only about yourself - include team perspective with words like 'we', 'our team', or 'together we can'.");
        }
        if (!/what do you think|thoughts|input|feedback|suggest/i.test(transcript)) {
            tips.push("Encourage collaboration - ask for others' input with phrases like 'What are your thoughts?' or 'I'd like your feedback'.");
        }
    }
    
    // Ensure we always have at least one specific tip
    if (tips.length === 0) {
        tips.push(`Your delivery needs work - practice speaking slower, louder, and with more conviction for ${mode} settings.`);
    }
    
    return tips;
}

function displayFeedback(feedback) {
    const feedbackEl = document.getElementById('feedback') || document.getElementById('demoFeedback');
    const contentEl = document.getElementById('feedbackContent') || document.getElementById('demoFeedbackContent');
    
    if (!feedbackEl || !contentEl) return;
    
    // Split feedback into items and format
    const tips = feedback.split('\n').filter(tip => tip.trim().length > 0);
    
    contentEl.innerHTML = tips.map(tip => 
        `<div class="feedback-item">${tip.replace(/^\d+\.?\s*[-•]\s*/, '').trim()}</div>`
    ).join('');
    
    feedbackEl.style.display = 'block';
    feedbackEl.scrollIntoView({ behavior: 'smooth' });
}

function showLoading(show) {
    const loadingEl = document.getElementById('loading') || document.getElementById('demoLoading');
    if (loadingEl) {
        loadingEl.style.display = show ? 'block' : 'none';
    }
}

function setDemoPhrase(phrase) {
    const transcriptionEl = document.getElementById('transcription') || document.getElementById('demoTranscription');
    if (transcriptionEl) {
        transcriptionEl.innerHTML = `<strong>${phrase}</strong>`;
        transcriptionEl.classList.add('active');
    }
    
    if (apiKey) {
        sendToGemini(phrase);
    } else {
        const feedbackEl = document.getElementById('feedback') || document.getElementById('demoFeedback');
        if (feedbackEl) {
            feedbackEl.style.display = 'none';
        }
        updateStatus('Please set up your API key first to get feedback on demo phrases.');
    }
}

function updateDemoPhrases(mode) {
    const titleElement = document.getElementById('modeSpecificTitle');
    const container = document.getElementById('demoPhrasesContainer');
    
    if (!titleElement || !container) return;
    
    const modeTitles = {
        interview: 'Interview',
        presentation: 'Presentation',
        meeting: 'Meeting'
    };
    
    const phrases = {
        interview: [
            "Tell me about yourself and your experience.",
            "What are your greatest strengths and how do they apply to this role?",
            "Can you describe a challenging project you've worked on recently?",
            "Where do you see yourself in five years?"
        ],
        presentation: [
            "Our quarterly results show a 15% increase in revenue.",
            "I'd like to propose a new marketing strategy for the next quarter.",
            "The data clearly indicates that customer satisfaction has improved.",
            "Let me walk you through our findings and recommendations."
        ],
        meeting: [
            "I think we should consider alternative approaches to this problem.",
            "Based on my research, I believe we need to adjust our timeline.",
            "Can we discuss the budget implications of this proposal?",
            "I'd like to get everyone's input on the next steps."
        ]
    };
    
    // Update title
    titleElement.textContent = modeTitles[mode] || 'Practice';
    
    // Update phrases - check if it's phrase-grid or demo-phrase structure
    const isPhraseGrid = container.classList.contains('phrase-grid');
    const phraseClass = isPhraseGrid ? 'phrase-item' : 'demo-phrase';
    
    container.innerHTML = phrases[mode].map(phrase => 
        `<div class="${phraseClass}" onclick="setDemoPhrase(this.textContent)">"${phrase}"</div>`
    ).join('');
}

// Modal functions
function showModal() {
    const modal = document.getElementById('apiModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal() {
    const modal = document.getElementById('apiModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Additional utility functions
function clearTranscription() {
    const transcriptionEl = document.getElementById('transcription') || document.getElementById('demoTranscription');
    if (transcriptionEl) {
        transcriptionEl.innerHTML = 'Your speech will appear here...';
        transcriptionEl.classList.remove('active');
    }
    
    const feedbackEl = document.getElementById('feedback') || document.getElementById('demoFeedback');
    if (feedbackEl) {
        feedbackEl.style.display = 'none';
    }
    
    lastTranscript = '';
}

function changeMode() {
    const modeSelection = document.getElementById('modeSelection');
    const practiceInterface = document.getElementById('practiceInterface');
    
    if (modeSelection && practiceInterface) {
        modeSelection.style.display = 'block';
        practiceInterface.style.display = 'none';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('apiModal');
    if (event.target === modal) {
        closeModal();
    }
});

