/**
 * Swayambhoo Sanctuary Application Engine
 * Contains: Audio Architecture Playlist Config, Box Breathing Loop, Framework Controls
 */

// 1. DATA MATRIX: Audio Playlist Configuration File Setup
// To customize audio files, swap the 'audioUrl' parameters out with relative paths (e.g., 'audio/breath.mp3') 
// or public web links hosted via Github raw assets.
const playlist = [
    {
        id: 0,
        title: "Cosmic Breathwork Alignment",
        category: "Mindfulness & Breathwork",
        icon: "ri-windy-line",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        desc: "Clear mental fog, slow your nervous system down, and anchor your presence into the current moment."
    },
    {
        id: 1,
        title: "Deep Space Restorative Sleep",
        category: "Deep Sleep & Relaxation",
        icon: "ri-moon-clear-line",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        desc: "Unwind cerebral friction with smooth resonant tones designed to shift brainwave states into alpha/theta patterns."
    },
    {
        id: 2,
        title: "Vijayee Bhav Abundance Blueprint",
        category: "Confidence & Abundance",
        icon: "ri-copper-coin-line",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        desc: "Reprogram baseline identity assumptions. Designed to match subconscious visualization steps."
    },
    {
        id: 3,
        title: "Sovereign Shield Neural Release",
        category: "Stress & Anxiety Relief",
        icon: "ri-shield-flash-line",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        desc: "Dissolve cortisol-driven tension build-ups via custom low-frequency target frequencies."
    }
];

// State variables tracking application usage
let currentTrackIndex = 0;
let isPlaying = false;
let breathingInterval = null;
let breathingActive = false;

// UI DOM Component Selections
const nativeAudio = document.getElementById('native-audio');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progressWrapper = document.getElementById('progress-wrapper');
const timeElapsed = document.getElementById('time-elapsed');
const timeTotal = document.getElementById('time-total');
const volumeSlider = document.getElementById('volume-slider');
const muteBtn = document.getElementById('mute-btn');

const currentTitle = document.getElementById('current-title');
const currentCategory = document.getElementById('current-category');
const libraryContainer = document.getElementById('library-container');

const startBreathBtn = document.getElementById('start-breath-btn');
const breathNode = document.getElementById('breath-node');
const breathPrompt = document.getElementById('breath-prompt');

// Initialize the Sanctuary Dashboard
document.addEventListener('DOMContentLoaded', () => {
    buildLibraryGrid();
    loadTrack(currentTrackIndex);
    setupEventListeners();
});

// Build the Grid Cards dynamically out of object array metrics
function buildLibraryGrid() {
    libraryContainer.innerHTML = '';
    playlist.forEach((track) => {
        const cardHTML = `
            <div class="glass-panel meditation-card">
                <div class="card-art-frame">
                    <i class="${track.icon}"></i>
                </div>
                <h3>${track.title}</h3>
                <p>${track.desc}</p>
                <button class="btn btn-secondary card-play-btn" onclick="directPlayTrack(${track.id})">
                    <i class="ri-play-mini-line"></i> Listen Now
                </button>
            </div>
        `;
        libraryContainer.innerHTML += cardHTML;
    });
}

// Track Management Core Controls
function loadTrack(index) {
    currentTrackIndex = index;
    const track = playlist[currentTrackIndex];
    nativeAudio.src = track.audioUrl;
    currentTitle.textContent = track.title;
    currentCategory.textContent = track.category;
    
    // Reset tracker components
    progressBar.style.width = '0%';
    timeElapsed.textContent = '00:00';
    timeTotal.textContent = '00:00';
}

function playTrack() {
    isPlaying = true;
    nativeAudio.play();
    playBtn.innerHTML = '<i class="ri-pause-fill"></i>';
}

function pauseTrack() {
    isPlaying = false;
    nativeAudio.pause();
    playBtn.innerHTML = '<i class="ri-play-fill"></i>';
}

function directPlayTrack(id) {
    loadTrack(id);
    playTrack();
}

function prevTrack() {
    let targetIndex = currentTrackIndex - 1;
    if (targetIndex < 0) targetIndex = playlist.length - 1;
    loadTrack(targetIndex);
    if (isPlaying) playTrack();
}

function nextTrack() {
    let targetIndex = currentTrackIndex + 1;
    if (targetIndex >= playlist.length) targetIndex = 0;
    loadTrack(targetIndex);
    if (isPlaying) playTrack();
}

// Format raw audio timing metrics cleanly to read human MM:SS structure
function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Handle timeline scrubbing updates
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = nativeAudio.duration;
    if (duration) {
        nativeAudio.currentTime = (clickX / width) * duration;
    }
}

// Event Bindings Mapping Setup
function setupEventListeners() {
    playBtn.addEventListener('click', () => (isPlaying ? pauseTrack() : playTrack()));
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    
    // Audio engine telemetry monitors
    nativeAudio.addEventListener('timeupdate', () => {
        const { duration, currentTime } = nativeAudio;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            timeElapsed.textContent = formatTime(currentTime);
            timeTotal.textContent = formatTime(duration);
        }
    });

    nativeAudio.addEventListener('ended', nextTrack);

    progressWrapper.addEventListener('click', setProgress);
    
    // Control volume tracking configuration
    volumeSlider.addEventListener('input', (e) => {
        nativeAudio.volume = e.target.value;
        if (nativeAudio.volume === 0) {
            muteBtn.innerHTML = '<i class="ri-volume-mute-fill"></i>';
        } else {
            muteBtn.innerHTML = '<i class="ri-volume-up-fill"></i>';
        }
    });

    muteBtn.addEventListener('click', () => {
        if (nativeAudio.volume > 0) {
            nativeAudio.volume = 0;
            volumeSlider.value = 0;
            muteBtn.innerHTML = '<i class="ri-volume-mute-fill"></i>';
        } else {
            nativeAudio.volume = 0.7;
            volumeSlider.value = 0.7;
            muteBtn.innerHTML = '<i class="ri-volume-up-fill"></i>';
        }
    });

    // Wire Up the Guided Breathing engine button interface
    startBreathBtn.addEventListener('click', toggleBreathingSpace);
}

// 3. LOGICAL ENGINE: 4-4-4 Box Breathing Logic Engine Loop
function toggleBreathingSpace() {
    if (breathingActive) {
        clearInterval(breathingInterval);
        breathingActive = false;
        startBreathBtn.textContent = "Begin Breathwork";
        startBreathBtn.classList.remove('btn-primary');
        startBreathBtn.classList.add('btn-secondary');
        breathNode.className = "breath-circle";
        breathPrompt.textContent = "Ready";
    } else {
        breathingActive = true;
        startBreathBtn.textContent = "Stop Session";
        startBreathBtn.classList.add('btn-primary');
        runBreathingCycle(); // Kick off sequence tracking instantly
    }
}

function runBreathingCycle() {
    let phase = 0; // Steps coordinate: 0 = Inhale, 1 = Hold, 2 = Exhale, 3 = Hold Empty
    
    const executionCycle = () => {
        if (!breathingActive) return;
        
        switch (phase) {
            case 0:
                breathPrompt.textContent = "Inhale";
                breathNode.className = "breath-circle inhale";
                phase = 1;
                break;
            case 1:
                breathPrompt.textContent = "Hold";
                breathNode.className = "breath-circle inhale hold";
                phase = 2;
                break;
            case 2:
                breathPrompt.textContent = "Exhale";
                breathNode.className = "breath-circle exhale";
                phase = 3;
                break;
            case 3:
                breathPrompt.textContent = "Hold";
                breathNode.className = "breath-circle";
                phase = 0;
                break;
        }
    };
    
    executionCycle(); // Fire layout adjustments instantly
    breathingInterval = setInterval(executionCycle, 4000); // Pulse modifications systematically every 4 seconds
}