function initTruthOrDare(container, players) {
    let currentPlayer = '';
    let currentLevel = 'santai';
    let isPlaying = false;

    window.onGameBack = () => {
        if (isPlaying) {
            isPlaying = false;
            renderMenu();
            return true;
        }
        return false;
    };

    function renderMenu() {
        const levelHtml = `
        <div style="text-align:center; padding: 20px; margin-top: 30px;">
            <h2 style="margin-bottom: 10px;">Kesepakatan Dulu! 🤝</h2>
            <p style="color: var(--text-muted); margin-bottom: 40px; line-height: 1.5;">Berunding dulu gais, malam ini mau main aman aja atau mau bongkar aib brutal?</p>
            
            <button id="btn-pilih-santai" class="btn-primary" style="margin-bottom: 20px; background: #3b82f6; padding: 20px;">
                Santai 😌<br>
                <small style="font-weight:normal; font-size:0.9rem; opacity:0.8;">Aman untuk pertemanan</small>
            </button>
            
            <button id="btn-pilih-pedas" class="btn-primary" style="background: #ef4444; padding: 20px;">
                Pedas 🌶️<br>
                <small style="font-weight:normal; font-size:0.9rem; opacity:0.8;">Bongkar rahasia & mental breakdance</small>
            </button>
        </div>
    `;

    container.innerHTML = levelHtml;

    document.getElementById('btn-pilih-santai').addEventListener('click', () => {
        currentLevel = 'santai';
        isPlaying = true;
        startGame();
    });

    document.getElementById('btn-pilih-pedas').addEventListener('click', () => {
        currentLevel = 'pedas';
        isPlaying = true;
        startGame();
    });
    } // Akhir dari renderMenu

    function startGame() {
        const html = `
            <div class="turn-indicator">
                <span style="font-size:0.85rem; letter-spacing:1px;">MODE: <strong>${currentLevel.toUpperCase()}</strong></span>
                <span>Giliran:</span>
                <span id="tod-player" class="player-name-highlight">...</span>
            </div>
            
            <div id="tod-prompt" class="prompt-box">Klik tombol di bawah untuk memilih Truth atau Dare!</div>
            <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                <button id="btn-truth" class="btn-primary" style="background: var(--accent-tod); flex: 1;">TRUTH 😇</button>
                <button id="btn-dare" class="btn-primary" style="background: #111; border: 2px solid var(--accent-tod); flex: 1;">DARE 😈</button>
            </div>
            <button id="btn-next-player" class="btn-secondary">Ganti Pemain (Acak) 🎲</button>
        `;
        container.innerHTML = html;

        const elPlayer = document.getElementById('tod-player');
        const elPrompt = document.getElementById('tod-prompt');
        const btnTruth = document.getElementById('btn-truth');
        const btnDare = document.getElementById('btn-dare');
        const btnNext = document.getElementById('btn-next-player');

        function pickRandomPlayer() {
            btnTruth.disabled = true;
            btnDare.disabled = true;
            btnNext.disabled = true;
            
            let spins = 0;
            const maxSpins = 20;
            const spinSpeed = 80;

            elPrompt.innerHTML = "<em>Mengacak korban... 🎲</em>";
            
            elPlayer.style.display = "inline-block";
            elPlayer.style.transition = "transform 0.3s ease";
            elPlayer.style.color = "var(--primary)"; 

            const spinInterval = setInterval(() => {
                const randIndex = Math.floor(Math.random() * players.length);
                elPlayer.innerText = players[randIndex];
                elPlayer.style.transform = "scale(1.1)";
                if (window.SoundEngine) SoundEngine.nextQuestion(); // Tick sound
                
                setTimeout(() => elPlayer.style.transform = "scale(1)", spinSpeed/2);
                spins++;

                if (spins >= maxSpins) {
                    clearInterval(spinInterval);
                    
                    const finalIndex = Math.floor(Math.random() * players.length);
                    currentPlayer = players[finalIndex];
                    
                    elPlayer.style.transform = "scale(1.5)";
                    elPlayer.innerText = currentPlayer;
                    if (window.SoundEngine) SoundEngine.addScore(); // Ding sound for final pick
                    
                    setTimeout(() => {
                        elPlayer.style.transform = "scale(1)";
                    }, 400);

                    elPrompt.innerText = "Truth atau Dare? Milih yang jujur apa berani nih?";
                    
                    btnTruth.disabled = false;
                    btnDare.disabled = false;
                    btnNext.disabled = false;
                }
            }, spinSpeed);
        }

        btnTruth.addEventListener('click', () => {
            if (window.SoundEngine) SoundEngine.revealAnswer();
            const truths = GameData.truth[currentLevel];
            const randTruth = truths[Math.floor(Math.random() * truths.length)];
            elPrompt.innerHTML = `<div class="prompt-label" style="color: var(--accent-tod); font-weight:800; letter-spacing:2px; font-size:1.2rem; margin-bottom:15px; animation:popIn 0.3s ease;">TRUTH 😇</div><div class="prompt-text" style="font-size:1.3rem; line-height:1.4; animation:slideDownFade 0.4s ease;">${randTruth}</div>`;
        });

        btnDare.addEventListener('click', () => {
            if (window.SoundEngine) SoundEngine.revealAnswer();
            const dares = GameData.dare[currentLevel];
            const randDare = dares[Math.floor(Math.random() * dares.length)];
            elPrompt.innerHTML = `<div class="prompt-label" style="color: #c084fc; font-weight:800; letter-spacing:2px; font-size:1.2rem; margin-bottom:15px; animation:popIn 0.3s ease;">DARE 😈</div><div class="prompt-text" style="font-size:1.3rem; line-height:1.4; animation:slideDownFade 0.4s ease;">${randDare}</div>`;
        });

        btnNext.addEventListener('click', () => {
            pickRandomPlayer();
        });

        pickRandomPlayer();
    }

    // Mulai dengan menampilkan menu pilihan level
    renderMenu();
}
