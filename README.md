# AccentGuard - Communication Confidence Coach

A professional, multi-page web application that uses AI to provide real-time, supportive feedback for professional communication, helping speakers build confidence regardless of their accent or background.

## Features
- **Real-time Feedback**: Get instant tips on clarity, filler words, and delivery.
- **AI-Powered Analysis**: Uses Google Gemini API to provide personalized coaching.
- **Accent-Inclusive**: Focuses on clarity and confidence, not changing your accent.
- **Professional Scenarios**: Practice for interviews, presentations, and meetings.
- **Privacy-First**: Speech is analyzed securely and not stored permanently.

## Setup
1. **Clone the repository**
```
git clone https://github.com/EthanNguyen06/AccentGuard.git
cd AccentGuard
```
2. **Open `index.html` in your browser.**
3. **Enter your Gemini API key in the setup box (shown the first time).**
4. **Start practicing!**


## Gemini API Key

### Option 1: Use with Your API Key
1. **Get your free Gemini API key:** Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Replace the demo key:** Open `script.js` and replace the demo API key with your real key
3. **Open the app:** Open `index.html` in your browser

### Option 2: Enter API Key in App
1. **Open the app:** Open `index.html` in your browser
2. **Enter API key:** When prompted, paste your Gemini API key

## Project Structure
```
AccentGuard/
│
├── about.css          # Styles specific to the About page
├── about.html         # About page (project mission, solution, impact, etc.)
│
├── demo.css           # Styles specific to the Demo page
├── demo.html          # Demo page (interactive AI-powered demo)
├── demo.js            # JavaScript specific to the Demo page
│
├── index.html         # Homepage of the project
│
├── package.json       # Node.js metadata (dependencies, scripts, etc.)
│
├── practice.css       # Styles specific to the Practice page
├── practice.html      # Practice page (interactive speech practice with AI feedback)
├── practice.js        # JavaScript specific to the Practice page
│
├── README.md          # Project documentation (description, setup, usage, etc.)
│
├── script.js          # Global JavaScript logic (speech recognition, Gemini API calls, etc.)
│
├── start.bat          # Windows batch script to start/run the project
│
└── styles.css    
```

## How It Works
1. Uses the Web Speech API to capture your speech and transcribe it live.
2. Sends your transcript to the Gemini API for smart feedback.
3. Displays mode-specific suggestions (e.g., interview, meeting, presentation).
4. Try out example prompts if you just want to test quickly.

