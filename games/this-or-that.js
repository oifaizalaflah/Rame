function initThisOrThat(container, players) {
    let questions = [];
    let currentQuestionIndex = 0;

    // Load & shuffle questions
    questions = [...GameData.thisThat.tongkrongan].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;

    function renderGame() {
        const q = questions[currentQuestionIndex];
        
        container.innerHTML = `
            <div id="tt-game-container" style="flex-grow:1; display:flex; flex-direction:column; width:100%; height:100%; position:relative; overflow:hidden; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin-bottom: 20px;">
                
                <!-- Option A (Atas) -->
                <div class="tt-option" id="tt-option-a" style="flex:1; display:flex; justify-content:center; align-items:center; text-align:center; padding:30px; background: linear-gradient(135deg, #ef4444, #b91c1c); cursor:pointer; transition: all 0.3s ease; position:relative;">
                    <h2 style="color:white; font-size: clamp(1.2rem, 6vw, 2rem); margin:0; text-shadow: 0 2px 4px rgba(0,0,0,0.3); z-index: 2; animation: fadeIn 0.4s ease;">
                        ${q.a}
                    </h2>
                </div>

                <!-- Option B (Bawah) -->
                <div class="tt-option" id="tt-option-b" style="flex:1; display:flex; justify-content:center; align-items:center; text-align:center; padding:30px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); cursor:pointer; transition: all 0.3s ease; position:relative;">
                    <h2 style="color:white; font-size: clamp(1.2rem, 6vw, 2rem); margin:0; text-shadow: 0 2px 4px rgba(0,0,0,0.3); z-index: 2; animation: fadeIn 0.4s ease;">
                        ${q.b}
                    </h2>
                </div>

            </div>
            
            <div style="text-align:center; color:rgba(255,255,255,0.4); font-size: 0.85rem; margin-top: 10px; margin-bottom: 10px; animation: pulse 2s infinite;">
                Pilih dan tap salah satu untuk lanjut
            </div>
        `;

        const optA = document.getElementById('tt-option-a');
        const optB = document.getElementById('tt-option-b');

        function nextQuestion(chosenElement) {
            // Animasi klik (membesar sesaat)
            chosenElement.style.flex = "1.5";
            
            if (window.SoundEngine) SoundEngine.revealAnswer();

            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex >= questions.length) {
                    // Jika pertanyaan habis, kocok ulang
                    questions = questions.sort(() => Math.random() - 0.5);
                    currentQuestionIndex = 0;
                }
                renderGame();
            }, 300);
        }

        optA.addEventListener('click', () => nextQuestion(optA));
        optB.addEventListener('click', () => nextQuestion(optB));
    }

    renderGame();
}
