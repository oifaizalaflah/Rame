function initCerdasCermat(container, players) {
    let currentCategory = '';
    let currentQuestionIndex = 0;
    let questions = [];
    let scores = {};
    let isPlaying = false;
    
    players.forEach(p => scores[p] = 0);

    window.onGameBack = () => {
        if (isPlaying) {
            isPlaying = false;
            renderCategorySelection();
            return true; // Handle back button inside game
        }
        return false; // Let app.js handle going back to main menu
    };

    const categories = {
        umum: "🌍 Pengetahuan Umum",
        sejarah: "📜 Sejarah",
        teknologi: "💻 Teknologi & Sains",
        hiburan: "🎬 Hiburan & Film",
        agama: "🕌 Agama",
        olahraga: "⚽ Olahraga",
        kuliner: "🍔 Kuliner",
        geografi: "🗺️ Geografi",
        bahasa: "🗣️ Bahasa & Sastra",
        otomotif: "🚗 Otomotif"
    };

    function renderCategorySelection() {
        let catHtml = `
            <div style="text-align:center; padding: 5px;">
                <h3 style="margin-bottom:15px; color:var(--text-main);">Pilih Kategori Kuis</h3>
                <div class="category-grid">
        `;
        
        for (const [key, label] of Object.entries(categories)) {
            const qCount = GameData.cerdasCermat[key] ? GameData.cerdasCermat[key].length : 0;
            catHtml += `
                <button class="btn-category" data-cat="${key}" ${qCount === 0 ? 'disabled' : ''}>
                    ${label}
                </button>
            `;
        }

        catHtml += `</div></div>`;
        container.innerHTML = catHtml;

        const btns = container.querySelectorAll('.btn-category');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.getAttribute('data-cat');
                if(GameData.cerdasCermat[cat] && GameData.cerdasCermat[cat].length > 0) {
                    if (window.SoundEngine) SoundEngine.revealAnswer();
                    currentCategory = cat;
                    // Mengacak soal
                    questions = [...GameData.cerdasCermat[cat]].sort(() => Math.random() - 0.5);
                    currentQuestionIndex = 0;
                    isPlaying = true;
                    renderGame();
                }
            });
        });
    }

    let questionScored = false;

    const reRenderScoreboard = (highlightPlayer = null) => {
        const listEl = document.querySelector('.scoreboard-list');
        const currentScroll = listEl ? listEl.scrollTop : 0;
        
        const containerEl = document.querySelector('.scoreboard-container');
        if (containerEl) {
            containerEl.outerHTML = renderScoreboardHTML();
            const newListEl = document.querySelector('.scoreboard-list');
            if (newListEl) newListEl.scrollTop = currentScroll;
            
            if (highlightPlayer) {
                const safeId = highlightPlayer.replace(/\s+/g, '-').toLowerCase();
                const rowEl = document.getElementById(`row-${safeId}`);
                if (rowEl) {
                    rowEl.style.transition = 'all 0.3s ease';
                    rowEl.style.transform = 'scale(1.05)';
                    rowEl.style.backgroundColor = 'rgba(16, 185, 129, 0.4)'; 
                    rowEl.style.zIndex = '10';
                    
                    setTimeout(() => {
                        rowEl.style.transform = 'scale(1)';
                        rowEl.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    }, 300);
                }
            }
            
            bindScore();
        }
    };

    const bindScore = () => {
        const addBtns = container.querySelectorAll('.btn-add-score');
        const minusBtns = container.querySelectorAll('.btn-minus-score');
        
        if (questionScored) {
            addBtns.forEach(b => {
                b.style.opacity = '0.3';
                b.style.cursor = 'not-allowed';
            });
        }

        minusBtns.forEach(btn => {
            btn.onclick = () => {
                const p = btn.getAttribute('data-player');
                if (scores[p] > 0) {
                    scores[p]--;
                    if (window.SoundEngine) SoundEngine.minusScore();
                    if (questionScored) questionScored = false;
                    reRenderScoreboard();
                }
            };
        });

        addBtns.forEach(btn => {
            btn.onclick = () => {
                if (questionScored) return;
                const p = btn.getAttribute('data-player');
                scores[p]++;
                questionScored = true;
                if (window.SoundEngine) SoundEngine.addScore();
                reRenderScoreboard(p);
            };
        });
    };

    function renderGame() {
        if (currentQuestionIndex >= questions.length) {
            let highestScore = -1;
            let winners = [];
            players.forEach(p => {
                if (scores[p] > highestScore) {
                    highestScore = scores[p];
                    winners = [p];
                } else if (scores[p] === highestScore) {
                    winners.push(p);
                }
            });

            const winnerText = highestScore > 0 
                ? `Pemenangnya:<br><span style="font-size:2rem; color:var(--primary); text-transform:uppercase; text-shadow:var(--neon-glow); font-weight:800; display:block; margin: 10px 0;">${winners.join(' & ')}</span>dengan ${highestScore} poin! 🏆`
                : `Permainan Seri!<br>Belum ada yang mencetak poin.`;

            container.innerHTML = `
                <div style="text-align:center; margin-bottom: 15px; flex-shrink: 0; background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01)); border-radius:20px; padding:30px 20px; border:1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <h2 style="color:var(--text-main); margin-bottom: 20px; font-size:1.3rem;">Kategori Habis! 🎉</h2>
                    <div style="margin-bottom:25px; font-size:1.1rem; line-height:1.4;">
                        ${winnerText}
                    </div>
                    <button id="btn-back-cat" class="btn-primary" style="background: linear-gradient(to right, #3b82f6, #2dd4bf); box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); border:none; padding:15px; font-size:1.1rem; width:100%; border-radius:12px;">Pilih Kategori Lain 🔄</button>
                </div>
                ${renderScoreboardHTML(true)}
            `;
            
            if (highestScore > 0) {
                if (window.SoundEngine) SoundEngine.winGame();
                if (typeof confetti === 'function') {
                    const duration = 3000;
                    const end = Date.now() + duration;
                    (function frame() {
                        confetti({
                            particleCount: 5,
                            angle: 60,
                            spread: 55,
                            origin: { x: 0 },
                            colors: ['#8b5cf6', '#3b82f6', '#10b981']
                        });
                        confetti({
                            particleCount: 5,
                            angle: 120,
                            spread: 55,
                            origin: { x: 1 },
                            colors: ['#8b5cf6', '#3b82f6', '#10b981']
                        });
                        if (Date.now() < end) requestAnimationFrame(frame);
                    }());
                }
            }

            document.getElementById('btn-back-cat').addEventListener('click', renderCategorySelection);
            return;
        }

        const currentQ = questions[currentQuestionIndex];
        questionScored = false;

        const existingWrapper = document.getElementById('game-wrapper');
        
        if (existingWrapper) {
            document.getElementById('q-counter').innerHTML = `Soal ${currentQuestionIndex + 1} dari ${questions.length}`;
            document.getElementById('q-text').innerHTML = currentQ.q;
            document.getElementById('a-text').innerHTML = currentQ.a;
            
            const ansBox = document.getElementById('answer-box');
            ansBox.style.display = 'none';
            ansBox.classList.remove('animate-slide-down');
            
            document.getElementById('btn-reveal').style.display = 'block';
            
            const nextBtn = document.getElementById('btn-next');
            nextBtn.innerHTML = currentQuestionIndex === questions.length - 1 ? 'Selesai & Lihat Pemenang 🏆' : 'Pertanyaan Selanjutnya ⏭️';
            nextBtn.style.display = 'none';
            nextBtn.classList.remove('animate-pop-in');
            
            const promptBox = document.getElementById('prompt-container');
            promptBox.style.transition = '';
            promptBox.style.opacity = '';
            promptBox.style.transform = '';
            
            promptBox.classList.remove('animate-pop-in');
            void promptBox.offsetWidth;
            promptBox.classList.add('animate-pop-in');
            
            reRenderScoreboard();
            return;
        }

        container.innerHTML = `
            <div id="game-wrapper" style="display: flex; flex-direction: column; height: 100%;">
                <div class="turn-indicator" style="margin-bottom: 8px; flex-shrink: 0;">
                    <span style="font-size:0.75rem; letter-spacing:1px; color:var(--accent-cerdas);">KATEGORI: <strong>${categories[currentCategory].toUpperCase()}</strong></span>
                    <span id="q-counter" style="font-size:0.75rem; color:var(--text-muted);">Soal ${currentQuestionIndex + 1} dari ${questions.length}</span>
                </div>
                
                <div id="prompt-container" class="prompt-box animate-pop-in" style="min-height: auto; padding: 25px 20px; margin-bottom: 15px; display:flex; flex-direction:column; justify-content:center; flex-shrink: 0;">
                    <div style="font-size: 0.85rem; color: var(--accent-cerdas); font-weight: 800; letter-spacing: 2px; margin-bottom: 15px; text-transform: uppercase;">PERTANYAAN</div>
                    <div id="q-text" class="prompt-text" style="font-size: 1.15rem; font-weight: 500;">${currentQ.q}</div>
                    
                    <div id="answer-box" style="display:none; margin-top:20px; padding-top:15px; border-top:1px solid rgba(255,255,255,0.1); width:100%; color:var(--accent-tebak); font-weight:700; font-size:1.2rem;">
                        <span style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:5px; font-weight:normal;">Jawaban:</span>
                        <span id="a-text">${currentQ.a}</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px; flex-shrink: 0;">
                    <button id="btn-reveal" class="btn-primary" style="background: var(--accent-cerdas); padding: 12px; font-size: 1.05rem;">Buka Jawaban 👀</button>
                    <button id="btn-next" class="btn-primary" style="display:none; background: linear-gradient(to right, #4f46e5, #7c3aed); padding: 12px; font-size: 1.05rem; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4); border:none;">${currentQuestionIndex === questions.length - 1 ? 'Selesai & Lihat Pemenang 🏆' : 'Pertanyaan Selanjutnya ⏭️'}</button>
                </div>
                
                <div id="scoreboard-container-wrapper" style="display: flex; flex-direction: column; flex: 1; min-height: 0;">
                    ${renderScoreboardHTML()}
                </div>
            </div>
        `;

        // Reset state scoring untuk soal baru
        questionScored = false;

        document.getElementById('btn-reveal').addEventListener('click', () => {
            if (window.SoundEngine) SoundEngine.revealAnswer();
            const ansBox = document.getElementById('answer-box');
            ansBox.style.display = 'block';
            void ansBox.offsetWidth;
            ansBox.classList.add('animate-slide-down');
            
            document.getElementById('btn-reveal').style.display = 'none';
            
            const nextBtn = document.getElementById('btn-next');
            nextBtn.style.display = 'block';
            nextBtn.classList.add('animate-pop-in');
        });

        document.getElementById('btn-next').addEventListener('click', () => {
            if (window.SoundEngine) SoundEngine.revealAnswer();
            
            const promptBox = document.getElementById('prompt-container');
            if (promptBox) {
                promptBox.style.transition = 'all 0.2s ease-out';
                promptBox.style.opacity = '0';
                promptBox.style.transform = 'scale(0.95)';
            }
            setTimeout(() => {
                currentQuestionIndex++;
                renderGame();
            }, 200);
        });

        // Pastikan tombol skor bisa di-klik di soal pertama
        bindScore();
    }



    function renderScoreboardHTML(isGameOver = false) {
        let html = `
            <div class="scoreboard-container" style="display: flex; flex-direction: column; flex: 1; overflow: hidden; min-height: 120px;">
                <h4 style="text-align:center; margin-bottom:10px; font-size:0.9rem; color:var(--text-muted); flex-shrink: 0;">${isGameOver ? '🏆 Klasemen Akhir' : '🏆 Klasemen Skor'}</h4>
                <div class="scoreboard-list" style="overflow-y: auto; flex: 1; min-height: 0; padding-right: 5px;">
        `;
        
        let displayPlayers = [...players];
        displayPlayers.sort((a, b) => {
            if (scores[b] !== scores[a]) {
                return scores[b] - scores[a];
            }
            return a.localeCompare(b);
        });
        
        let maxScore = Math.max(...Object.values(scores));
        if (maxScore === 0) maxScore = -1;

        displayPlayers.forEach(p => {
            const isWinner = isGameOver && scores[p] === maxScore && maxScore > 0;
            const safeId = p.replace(/\s+/g, '-').toLowerCase();
            
            html += `
                <div id="row-${safeId}" class="score-row" style="position:relative; display:flex; justify-content:space-between; align-items:center; padding: 10px 15px; margin-bottom: 6px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    <span style="font-weight:600;">${p}</span>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <span style="font-size:1.2rem; font-weight:bold;">${scores[p]}</span>
                        ${!isGameOver ? `
                            <button class="btn-minus-score" data-player="${p}">-1</button>
                            <button class="btn-add-score" data-player="${p}">+1</button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        html += `</div></div>`;
        return html;
    }

    // Mulai dengan menampilkan layar pilih kategori
    renderCategorySelection();
}
