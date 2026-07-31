function initSiapaPaling(container, players) {
    let questions = [];
    let currentQuestionIndex = 0;

    // Load & shuffle questions
    questions = [...GameData.siapaPaling].sort(() => Math.random() - 0.5);
    
    function renderGame() {
        container.innerHTML = `
            <div id="sp-game-container" style="flex-grow:1; display:flex; flex-direction:column; justify-content:flex-start; align-items:center; text-align:center; position:relative; width:100%; height:100%; padding: 60px 10px 20px 10px; cursor:pointer;">
                
                <div style="font-size: 3.5rem; margin-bottom:20px; text-shadow: var(--neon-glow); animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">👉</div>
                
                <div id="sp-question-box" class="prompt-box animate-pop-in" style="width:100%; max-width:500px; transition: all 0.3s ease;">
                    <div id="sp-question-text" style="font-size:1.6rem; font-weight:bold; color:var(--text-main); line-height:1.4; transition: all 0.3s ease;">
                        ${questions[currentQuestionIndex]}
                    </div>
                </div>
                
                <p style="color:var(--text-muted); font-size:1rem; margin-top:25px; animation: fadeIn 1s;">Tunjuk temannya sekarang!</p>
                <p style="color:var(--accent-sp); font-size:0.9rem; margin-top:5px; opacity:0.8;">(Tap layar untuk soal selanjutnya)</p>
            </div>
        `;

        if (window.SoundEngine) SoundEngine.revealAnswer();

        const gameContainer = document.getElementById('sp-game-container');
        const qBox = document.getElementById('sp-question-box');
        const qText = document.getElementById('sp-question-text');
        
        gameContainer.addEventListener('click', () => {
            if (window.SoundEngine) SoundEngine.revealAnswer();

            // Animasi transisi mirip pernah-nggak
            qBox.style.transform = 'scale(0.95)';
            qText.style.opacity = '0';
            
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex >= questions.length) {
                    // Ulangi dari awal dengan shuffle baru kalau habis
                    questions = [...GameData.siapaPaling].sort(() => Math.random() - 0.5);
                    currentQuestionIndex = 0;
                    alert('Pertanyaan habis! Kita acak lagi dari awal ya.');
                }
                
                // Update teks
                qText.innerText = questions[currentQuestionIndex];
                
                // Kembalikan animasi
                qBox.style.transform = 'scale(1)';
                qText.style.opacity = '1';
            }, 300);
        });
    }

    renderGame();
}
