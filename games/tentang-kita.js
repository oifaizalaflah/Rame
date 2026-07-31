function initTentangKita(container, players) {
    let currentMode = '';
    let questions = [];
    let currentQuestionIndex = 0;
    let isPlaying = false; // Lacak status apakah sedang main atau di menu pilihan mode

    // Hook untuk tombol kembali di app.js
    window.onGameBack = () => {
        if (isPlaying) {
            isPlaying = false;
            renderMenu();
            return true; // Handle tombol back (jangan kembali ke main menu)
        }
        return false; // Kembali ke main menu
    };

    function renderMenu() {
        container.innerHTML = `
            <div style="text-align:center; padding: 20px; margin-top: 10px; animation: popIn 0.3s ease;">
                <h2 style="margin-bottom:15px; color:var(--text-main); font-size:1.8rem;">Tentang Kita 💭</h2>
                <p style="color:var(--text-muted); font-size:1rem; margin-bottom:30px; line-height: 1.5;">
                    Pilih edisi untuk memulai <i>deep talk</i> malam ini. Jawab dengan jujur dari hati.
                </p>
                
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <button class="btn-primary" data-mode="tongkrongan_perspektif" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 15px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
                        <span style="font-weight:bold; font-size:1.1rem;">🍻 Tongkrongan: Perspektif</span><br>
                        <small style="font-size:0.85rem; font-weight:normal; opacity:0.8;">Diskusi opini & pandangan hidup</small>
                    </button>

                    <button class="btn-primary" data-mode="tongkrongan_pengalaman" style="background: linear-gradient(135deg, #0ea5e9, #0369a1); padding: 15px; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);">
                        <span style="font-weight:bold; font-size:1.1rem;">🏕️ Tongkrongan: Pengalaman</span><br>
                        <small style="font-size:0.85rem; font-weight:normal; opacity:0.8;">Berbagi cerita gokil & kejadian tak terlupakan</small>
                    </button>
                </div>
            </div>
        `;

        const btns = container.querySelectorAll('.btn-primary');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.SoundEngine) SoundEngine.revealAnswer();
                currentMode = btn.getAttribute('data-mode');
                
                // Load & shuffle questions
                questions = [...GameData.tentangKita[currentMode]].sort(() => Math.random() - 0.5);
                currentQuestionIndex = 0;
                isPlaying = true;
                
                renderGame();
            });
        });
    }

    function renderGame() {
        const q = questions[currentQuestionIndex];
        
        let themeColor = "";
        let modeTitle = "";
        if (currentMode === "pasangan_perspektif") {
            themeColor = "linear-gradient(135deg, #ec4899, #be185d)";
            modeTitle = "Pasangan - Perspektif";
        } else if (currentMode === "pasangan_pengalaman") {
            themeColor = "linear-gradient(135deg, #d946ef, #a21caf)";
            modeTitle = "Pasangan - Pengalaman";
        } else if (currentMode === "tongkrongan_perspektif") {
            themeColor = "linear-gradient(135deg, #3b82f6, #1d4ed8)";
            modeTitle = "Tongkrongan - Perspektif";
        } else {
            themeColor = "linear-gradient(135deg, #0ea5e9, #0369a1)";
            modeTitle = "Tongkrongan - Pengalaman";
        }
        
        container.innerHTML = `
            <div id="tk-game-container" style="flex-grow:1; display:flex; flex-direction:column; justify-content:flex-start; align-items:center; text-align:center; position:relative; width:100%; padding-top:20px;">
                
                <span style="display:inline-block; padding: 5px 15px; background: rgba(255,255,255,0.1); border-radius: 20px; font-size: 0.85rem; color: #cbd5e1; margin-bottom: 20px;">
                    ${modeTitle}
                </span>

                <div class="tk-card" style="width: 100%; min-height: 250px; background: ${themeColor}; border-radius: 20px; padding: 30px 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin-bottom: 30px; animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                    <h2 style="color:white; font-size: clamp(1.2rem, 5vw, 1.8rem); line-height: 1.5; margin:0; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                        "${q}"
                    </h2>
                </div>
                
                <p style="color:var(--text-muted); font-size: 0.9rem; margin-bottom: 20px; padding: 0 20px;">
                    Diskusikan secara jujur dan terbuka. Kalau sudah puas ngobrol, lanjut ke pertanyaan berikutnya.
                </p>

                <button id="btn-next-tk" class="btn-primary" style="width: 100%; max-width: 300px;">
                    Pertanyaan Berikutnya ➡️
                </button>
            </div>
        `;

        document.getElementById('btn-next-tk').addEventListener('click', () => {
            if (window.SoundEngine) SoundEngine.revealAnswer();
            
            const card = container.querySelector('.tk-card');
            card.style.animation = 'none'; // reset
            card.style.transform = 'scale(0.95)';
            card.style.opacity = '0';
            card.style.transition = 'all 0.2s ease';
            
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex >= questions.length) {
                    // Jika pertanyaan habis, kocok ulang
                    questions = questions.sort(() => Math.random() - 0.5);
                    currentQuestionIndex = 0;
                }
                renderGame();
            }, 200);
        });
    }

    renderMenu();
}
