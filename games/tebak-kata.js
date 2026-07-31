function initTebakKata(container, players) {
    let currentCategory = '';
    let words = [];
    let currentWordIndex = 0;

    const categoryLabels = {
        hewan: "🦁 Hewan",
        film: "🎬 Film & Tokoh",
        profesi: "👷 Profesi",
        tempat: "🗺️ Tempat & Negara",
        makanan: "🍔 Makanan & Minuman",
        brand: "🛍️ Merek & Brand",
        artis: "🎸 Artis & Penyanyi",
        benda: "🛋️ Benda di Sekitar",
        kartun: "🎌 Anime & Kartun",
        lagu: "🎶 Lagu Hits"
    };

    // Tambahkan style animasi ripple sekali saja
    if (!document.getElementById('tk-styles')) {
        const style = document.createElement('style');
        style.id = 'tk-styles';
        style.innerHTML = `
            @keyframes tkRippleAnim {
                to { transform: scale(3); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    function renderCategorySelection() {
        let catHtml = `
            <div style="text-align:center; padding: 5px; animation: popIn 0.3s ease;">
                <h3 style="margin-bottom:15px; color:var(--text-main);">Pilih Kategori Tebakan</h3>
                <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:20px;">Mode Santai: 1 orang menebak 1 kata. Ketuk layar untuk lanjut ke kata berikutnya!</p>
                <div class="category-grid">
        `;
        
        for (const [key, label] of Object.entries(categoryLabels)) {
            const wordCount = GameData.tebakKata[key] ? GameData.tebakKata[key].length : 0;
            catHtml += `
                <button class="btn-category" data-cat="${key}" ${wordCount === 0 ? 'disabled' : ''}>
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
                if (GameData.tebakKata[cat] && GameData.tebakKata[cat].length > 0) {
                    if (window.SoundEngine) SoundEngine.revealAnswer(); 
                    
                    currentCategory = cat;
                    words = [...GameData.tebakKata[cat]].sort(() => Math.random() - 0.5);
                    currentWordIndex = 0;
                    
                    // Langsung render overlay-nya supaya layar gelap duluan
                    renderActiveGame();

                    // Panggil Fullscreen API di background tanpa harus nge-block UI
                    setTimeout(async () => {
                        try {
                            const el = document.documentElement;
                            if (el.requestFullscreen) await el.requestFullscreen();
                            if (screen.orientation && screen.orientation.lock) {
                                await screen.orientation.lock('landscape');
                            }
                        } catch(err) {
                            console.warn("Fullscreen/Orientation lock fallback:", err);
                        }
                    }, 50);
                }
            });
        });
    }

    function renderActiveGame() {
        // Hapus overlay lama jika ada
        const oldOverlay = document.getElementById('tk-overlay');
        if (oldOverlay) document.body.removeChild(oldOverlay);

        const overlay = document.createElement('div');
        overlay.id = 'tk-overlay';
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:radial-gradient(circle at center, #1e293b, var(--bg-color)); z-index:99999; display:flex; align-items:center; justify-content:center; overflow:hidden; opacity:0; transition: opacity 0.3s ease; user-select:none;';
        
        // Memaksa orientasi ke landscape melalui manipulasi ukuran dan rotasi CSS
        const inner = document.createElement('div');
        inner.style.cssText = 'display:flex; flex-direction:column; align-items:center; justify-content:space-between; position:absolute; top:50%; left:50%; transition: all 0.3s ease; transform-origin: center center; padding: 20px; box-sizing: border-box;';
        
        const checkOrientation = () => {
            if (window.innerHeight > window.innerWidth) {
                // Portrait -> Putar 90 derajat jadi landscape buatan
                inner.style.width = window.innerHeight + 'px';
                inner.style.height = window.innerWidth + 'px';
                inner.style.transform = 'translate(-50%, -50%) rotate(90deg)';
            } else {
                // Udah Landscape Asli -> Biarin
                inner.style.width = window.innerWidth + 'px';
                inner.style.height = window.innerHeight + 'px';
                inner.style.transform = 'translate(-50%, -50%) rotate(0deg)';
            }
        };
        
        window.addEventListener('resize', checkOrientation);
        checkOrientation();

        // Layout menggunakan Flexbox agar teksnya tetap berada di tengah tanpa tertimpa
        inner.innerHTML = `
            <!-- Header -->
            <!-- Header -->
            <div style="position:absolute; top:20px; left:20px; z-index:10;">
                <button id="tk-close" style="background:rgba(255,255,255,0.1); border:none; color:white; padding:10px 15px; border-radius:10px; font-size:1rem; backdrop-filter:blur(5px); display:flex; align-items:center; gap:5px; pointer-events:auto;"><span>🔙</span> Keluar</button>
            </div>
            
            <div style="width:100%; text-align:center; padding-top: 20px; z-index:5;">
                <div id="tk-timer" style="font-size:8vmin; color:white; font-weight:900; font-family:monospace; text-shadow:0 5px 15px rgba(0,0,0,0.5); line-height:1;">60s</div>
            </div>

            <div style="position:absolute; top:30px; right:20px; z-index:10; text-align:right;">
                <div style="font-size:2.5vmin; color:var(--accent-tebak); letter-spacing:4px; font-weight:800; text-transform:uppercase; text-shadow:0 2px 10px rgba(16, 185, 129, 0.4);">${categoryLabels[currentCategory]}</div>
            </div>

            <!-- Main Word Container -->
            <div style="flex-grow:1; display:flex; align-items:center; justify-content:center; width:100%; padding:0 20px;">
                <div id="tk-word" style="font-size:clamp(3rem, 15vmin, 10rem); font-weight:900; text-align:center; width:100%; word-wrap:break-word; text-transform:uppercase; text-shadow:0 10px 40px rgba(0,0,0,0.6); line-height:1.1;"></div>
            </div>

            <!-- Footer -->
            <div style="font-size:2vmin; color:rgba(255,255,255,0.3); animation: pulse 2s infinite; letter-spacing:2px; font-weight:500; text-align:center; padding-bottom:10px;">KETUK DI MANA SAJA UNTUK KATA SELANJUTNYA</div>
        `;
        
        overlay.appendChild(inner);
        document.body.appendChild(overlay);

        // Fade in
        setTimeout(() => overlay.style.opacity = '1', 50);

        const wordEl = inner.querySelector('#tk-word');
        const timerEl = inner.querySelector('#tk-timer');
        let currentWordTimer = null;
        let timeLeft = 60;
        
        const startTimer = () => {
            clearInterval(currentWordTimer);
            timeLeft = 60;
            timerEl.innerText = timeLeft + 's';
            timerEl.style.color = 'white';
            
            currentWordTimer = setInterval(() => {
                timeLeft--;
                timerEl.innerText = timeLeft + 's';
                
                if (timeLeft <= 10) {
                    timerEl.style.color = '#ef4444'; // Merah pas mau habis
                }
                
                if (timeLeft <= 0) {
                    clearInterval(currentWordTimer);
                    if (window.SoundEngine && typeof SoundEngine.wrongAnswer === 'function') {
                        SoundEngine.wrongAnswer(); // Bunyi tetot kalau habis
                    }
                    showNext();
                }
            }, 1000);
        };

        const showNext = () => {
            if (currentWordIndex >= words.length) {
                words = [...words].sort(() => Math.random() - 0.5);
                currentWordIndex = 0;
            }
            
            wordEl.style.opacity = '0';
            wordEl.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                wordEl.innerText = words[currentWordIndex];
                wordEl.style.transition = 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                wordEl.style.opacity = '1';
                wordEl.style.transform = 'scale(1)';
                currentWordIndex++;
                startTimer(); // Mulai ulang timer tiap ganti kata
            }, 150);
            
            if (window.SoundEngine) SoundEngine.revealAnswer();
        };

        // Mulai kata pertama
        showNext();

        // Event listener klik layar
        overlay.addEventListener('click', (e) => {
            // Cek klik Keluar
            if (e.target.closest('#tk-close')) {
                clearInterval(currentWordTimer); // Stop timer pas keluar
                overlay.style.opacity = '0';
                if (window.SoundEngine) SoundEngine.minusScore();
                
                // Exit fullscreen
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(()=>{});
                }
                if (screen.orientation && screen.orientation.unlock) {
                    screen.orientation.unlock();
                }

                setTimeout(() => {
                    if (overlay.parentNode) document.body.removeChild(overlay);
                    window.removeEventListener('resize', checkOrientation);
                }, 300);
                return;
            }

            // Ripple Effect Animation
            const ripple = document.createElement('div');
            const rect = overlay.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.15);
                width: ${size}px;
                height: ${size}px;
                left: ${e.clientX - size/2}px;
                top: ${e.clientY - size/2}px;
                transform: scale(0);
                animation: tkRippleAnim 0.5s linear;
                pointer-events: none;
                z-index: 10000;
            `;
            overlay.appendChild(ripple);
            setTimeout(() => { if (ripple.parentNode) ripple.remove(); }, 500);

            showNext();
        });
    }

    renderCategorySelection();
}
