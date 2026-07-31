const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

window.SoundEngine = {
    // Soft sweeping pop for opening answers
    revealAnswer: function() {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    },

    // Subtle modern 'click/tick' for changing questions
    nextQuestion: function() {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    },

    // Soft low click for back navigation
    back: function() {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    },

    // Soft pleasant chime for scoring points
    addScore: function() {
        initAudio();
        
        const playTone = (freq, delay) => {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime + delay);
            gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + delay + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + 0.4);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start(audioCtx.currentTime + delay);
            osc.stop(audioCtx.currentTime + delay + 0.4);
        };

        // Play an ascending major interval (C6 then E6)
        playTone(1046.50, 0);       // C6
        playTone(1318.51, 0.08);    // E6
    },

    // Soft low thud for minus score
    minusScore: function() {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
    },

    // Epic arpeggio for winning the game
    winGame: function() {
        initAudio();
        
        const playTone = (freq, delay, duration) => {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime + delay);
            gainNode.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + delay + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start(audioCtx.currentTime + delay);
            osc.stop(audioCtx.currentTime + delay + duration);
        };

        // C Major Arpeggio (C5, E5, G5, C6)
        playTone(523.25, 0, 0.4);       // C5
        playTone(659.25, 0.1, 0.4);     // E5
        playTone(783.99, 0.2, 0.4);     // G5
        playTone(1046.50, 0.3, 0.8);    // C6 (longer duration for the final note)
    }
};

// Inisialisasi audio di interaksi pertama (wajib buat browser HP)
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });
