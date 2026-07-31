function initSiapaPaling(container, players) {
    let questions = [];
    let currentQuestionIndex = 0;

    // Load & shuffle questions
    questions = [...GameData.siapaPaling].sort(() => Math.random() - 0.5);
    
    function renderGame() {
        container.innerHTML = `
            <div id="sp-game-container" style="flex-grow:1; display:flex; flex-direction:column; justify-content:flex-start; align-items:center; text-align:center; position:relative; width:100%; height:100%; padding: 60px 10px 20px 10px; cursor:pointer;">
                
                <div style="font-size: 3.5rem; margin-bottom:20px; text-shadow: var(--neon-glow); animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">👉</div>
                
                <div id="sp-question" class="prompt-box animate-pop-in" style="font-size:1.6rem; font-weight:bold; color:var(--text-main); line-height:1.4; width:100%; max-width:500px;">
                    ${questions[currentQuestionIndex]}
                </div>
                
                <p style="color:var(--text-muted); font-size:1rem; margin-top:25px; animation: fadeIn 1s;">Tunjuk temannya sekarang!</p>
                <p style="color:var(--accent-sp); font-size:0.9rem; margin-top:5px; opacity:0.8;">(Tap layar untuk soal selanjutnya)</p>
            </div>
        `;

        if (window.SoundEngine) SoundEngine.revealAnswer();

        const gameContainer = document.getElementById('sp-game-container');
        
        gameContainer.addEventListener('click', () => {
            currentQuestionIndex++;
            if (currentQuestionIndex >= questions.length) {
                // Ulangi dari awal dengan shuffle baru kalau habis
                questions = [...GameData.siapaPaling].sort(() => Math.random() - 0.5);
                currentQuestionIndex = 0;
                alert('Pertanyaan habis! Kita acak lagi dari awal ya.');
            }
            
            // Animasi transisi
            const qEl = document.getElementById('sp-question');
            if(qEl) {
                qEl.style.transition = 'all 0.2s ease-out';
                qEl.style.opacity = '0';
                qEl.style.transform = 'scale(0.9)';
            }
            
            setTimeout(() => {
                renderGame();
            }, 200);
        });
    }

    renderGame();
}
