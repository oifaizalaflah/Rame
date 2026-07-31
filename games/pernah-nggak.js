function initPernahNggak(container, players) {
    let questions = [];
    let currentQuestionIndex = 0;

    // Load & shuffle questions (langsung mode tongkrongan)
    questions = [...GameData.pernahNggak.tongkrongan].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    
    function renderGame() {
        container.innerHTML = `
            <div id="pn-game-container" style="flex-grow:1; display:flex; flex-direction:column; justify-content:flex-start; align-items:center; text-align:center; position:relative; width:100%; height:100%; padding: 30px 10px 20px 10px; cursor:pointer;">
                <h1 style="font-size: clamp(2rem, 8vw, 3rem); margin-bottom: 30px; margin-top: 10px; line-height:1.3; animation: fadeInDown 0.5s ease; color: var(--accent-pn);">
                    Pernah nggak...
                </h1>
                
                <div id="pn-question-box" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 40px 20px; width: 100%; min-height: 200px; display:flex; align-items:center; justify-content:center; box-shadow: 0 5px 20px rgba(0,0,0,0.3); backdrop-filter: blur(5px); margin-bottom: 30px;">
                    <h2 id="pn-question" style="color:var(--text-main); font-size: clamp(1.2rem, 5vw, 1.8rem); line-height: 1.5; margin:0; transition: all 0.3s ease;">
                        ${questions[currentQuestionIndex].replace(/^Pernah /i, '').charAt(0).toUpperCase() + questions[currentQuestionIndex].replace(/^Pernah /i, '').slice(1)}
                    </h2>
                </div>

                <div style="margin-top:auto; color:rgba(255,255,255,0.4); font-size: 0.85rem; animation: pulse 2s infinite;">
                    Tap di mana saja untuk lanjut
                </div>
            </div>
        `;

        const gameContainer = document.getElementById('pn-game-container');
        const qBox = document.getElementById('pn-question-box');
        const qText = document.getElementById('pn-question');

        gameContainer.addEventListener('click', () => {
            if (window.SoundEngine) SoundEngine.revealAnswer();

            // Animasi transisi
            qBox.style.transform = 'scale(0.95)';
            qText.style.opacity = '0';
            
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex >= questions.length) {
                    // Jika pertanyaan habis, kocok ulang
                    questions = questions.sort(() => Math.random() - 0.5);
                    currentQuestionIndex = 0;
                }
                
                // Update teks
                let nextText = questions[currentQuestionIndex].replace(/^Pernah /i, '');
                qText.innerText = nextText.charAt(0).toUpperCase() + nextText.slice(1);
                
                // Kembalikan animasi
                qBox.style.transform = 'scale(1)';
                qText.style.opacity = '1';
            }, 300);
        });
    }

    renderGame();
}
