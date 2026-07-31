// State Manager
const AppState = {
    players: [],
    currentGame: null,
};

// DOM Elements
const screens = {
    welcome: document.getElementById('welcome-screen'),
    menu: document.getElementById('main-menu'),
    game: document.getElementById('game-container')
};

const UI = {
    playerInput: document.getElementById('player-input'),
    btnStart: document.getElementById('btn-start'),
    btnResetPlayers: document.getElementById('btn-reset-players'),
    btnBackMenu: document.getElementById('btn-back-menu'),
    gameCards: document.querySelectorAll('.game-card'),
    gameTitle: document.getElementById('current-game-title'),
    gameContent: document.getElementById('game-content')
};

// Inisialisasi Aplikasi
function init() {
    loadPlayers();
    
    // Kalau ada pemain, langsung ke menu. Kalau tidak, ke welcome.
    if (AppState.players.length > 0) {
        showScreen('menu');
    } else {
        showScreen('welcome');
    }

    setupEventListeners();
    initSmoothScroll();
}

// Navigasi Layar
function showScreen(screenName) {
    // Sembunyikan semua
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    // Tampilkan yang dipilih
    screens[screenName].classList.add('active');
}

// LocalStorage Handlers
function loadPlayers() {
    const saved = localStorage.getItem('tongkrongan_players');
    if (saved) {
        AppState.players = JSON.parse(saved);
    }
}

function savePlayers(playersArray) {
    localStorage.setItem('tongkrongan_players', JSON.stringify(playersArray));
    AppState.players = playersArray;
}

// Event Listeners
function setupEventListeners() {
    // Mulai Main (Simpan Pemain)
    UI.btnStart.addEventListener('click', () => {
        const input = UI.playerInput.value;
        if (!input.trim()) {
            alert('Isi nama teman-temanmu dulu dong!');
            return;
        }

        // Pisahkan pakai koma, bersihkan spasi, dan hilangkan yang kosong
        const names = input.split(',')
            .map(n => n.trim())
            .filter(n => n.length > 0);
            
        if (names.length < 2) {
            alert('Minimal 2 orang lah masa main sendiri? 😅');
            return;
        }

        savePlayers(names);
        showScreen('menu');
    });

    // Reset Pemain
    UI.btnResetPlayers.addEventListener('click', () => {
        if(confirm('Yakin mau reset pemain? Data yang sekarang bakal hilang lho.')) {
            localStorage.removeItem('tongkrongan_players');
            AppState.players = [];
            UI.playerInput.value = '';
            showScreen('welcome');
        }
    });

    // Pilih Game
    UI.gameCards.forEach(card => {
        card.addEventListener('click', () => {
            if (window.SoundEngine) SoundEngine.revealAnswer();
            
            const gameId = card.getAttribute('data-game');
            const gameName = card.querySelector('h3').innerText;
            
            AppState.currentGame = gameId;
            UI.gameTitle.innerText = gameName;
            
            // Panggil inisialisasi game spesifik
            launchGame(gameId);
            showScreen('game');
        });
    });

    // Kembali ke Menu
    UI.btnBackMenu.addEventListener('click', () => {
        if (window.SoundEngine) SoundEngine.nextQuestion();
        
        // Cek apakah game aktif punya sub-menu (misal: kembali dari permainan ke pemilihan mode)
        if (typeof window.onGameBack === 'function') {
            const handled = window.onGameBack();
            if (handled) return; // Jika di-handle oleh game, batalkan kembali ke menu utama
        }
        
        AppState.currentGame = null;
        window.onGameBack = null; // Reset hook
        UI.gameContent.innerHTML = ''; // Bersihkan arena
        showScreen('menu');
    });
}

// Game Launcher Manager
function launchGame(gameId) {
    UI.gameContent.innerHTML = ''; // Bersihkan container dulu
    
    // Nanti logika masing-masing game akan didefinisikan di file js terpisah 
    // dan dipanggil di sini.
    if(gameId === 'truth-or-dare' && typeof initTruthOrDare === 'function') {
        initTruthOrDare(UI.gameContent, AppState.players);
    } 
    else if(gameId === 'cerdas-cermat' && typeof initCerdasCermat === 'function') {
        initCerdasCermat(UI.gameContent, AppState.players);
    }
    else if(gameId === 'tebak-kata' && typeof initTebakKata === 'function') {
        initTebakKata(UI.gameContent, AppState.players);
    }
    else if(gameId === 'pernah-nggak' && typeof initPernahNggak === 'function') {
        initPernahNggak(UI.gameContent, AppState.players);
    }
    else if(gameId === 'this-or-that' && typeof initThisOrThat === 'function') {
        initThisOrThat(UI.gameContent, AppState.players);
    }
    else if(gameId === 'siapa-paling' && typeof initSiapaPaling === 'function') {
        initSiapaPaling(UI.gameContent, AppState.players);
    }
    else if(gameId === 'tentang-kita' && typeof initTentangKita === 'function') {
        initTentangKita(UI.gameContent, AppState.players);
    }
    else {
        UI.gameContent.innerHTML = '<div class="prompt-box">Game belum tersedia! Coba yang lain.</div>';
    }
}

// Jalankan App
init();

// Custom Smooth Scroll for PC Mouse Wheel (Dynamic)
function initSmoothScroll() {
    const scrollStates = new Map();

    window.addEventListener('wheel', (e) => {
        // Cari elemen terdekat yang bisa di-scroll
        let targetNode = e.target;
        while (targetNode && targetNode !== document.body && targetNode !== document) {
            if (targetNode.scrollHeight > targetNode.clientHeight) {
                const overflowY = window.getComputedStyle(targetNode).overflowY;
                if (overflowY === 'auto' || overflowY === 'scroll') {
                    break; // Ketemu elemen yang scrollable
                }
            }
            targetNode = targetNode.parentNode;
        }

        // Jika ketemu elemen scrollable, kita bajak scrollnya biar smooth
        if (targetNode && targetNode !== document.body && targetNode !== document) {
            e.preventDefault();

            if (!scrollStates.has(targetNode)) {
                scrollStates.set(targetNode, { targetY: targetNode.scrollTop, isAnimating: false });
            }
            const state = scrollStates.get(targetNode);

            if (!state.isAnimating) state.targetY = targetNode.scrollTop;
            state.targetY += e.deltaY * 1.5;
            state.targetY = Math.max(0, Math.min(state.targetY, targetNode.scrollHeight - targetNode.clientHeight));

            if (!state.isAnimating) {
                state.isAnimating = true;
                const animate = () => {
                    let dy = state.targetY - targetNode.scrollTop;
                    if (Math.abs(dy) < 0.5) {
                        targetNode.scrollTop = state.targetY;
                        state.isAnimating = false;
                    } else {
                        targetNode.scrollTop += dy * 0.1;
                        requestAnimationFrame(animate);
                    }
                };
                requestAnimationFrame(animate);
            }
        }
    }, { passive: false });
}
