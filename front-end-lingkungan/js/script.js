// File: js/script.js (VERSI FINAL - LENGKAP DENGAN PERBAIKAN BUG)

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. SETUP NAVIGASI MOBILE & TAHUN ---
    const navToggle = document.getElementById("nav-toggle");
    const mainNav = document.getElementById("main-nav");
    const yearEl = document.getElementById("year");

    function closeMobileNav() {
        mainNav.classList.remove("open");
        navToggle.classList.remove("open");
    }

    navToggle && navToggle.addEventListener("click", () => {
        mainNav.classList.toggle("open");
        navToggle.classList.toggle("open");
    });

    const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    if(yearEl) yearEl.textContent = new Date().getFullYear();


    /* --- HERO SLIDER --- */
    const slides = Array.from(document.querySelectorAll(".slide"));
    const prevBtn = document.querySelector(".slide-nav.prev");
    const nextBtn = document.querySelector(".slide-nav.next");
    const dotsWrap = document.getElementById("hero-dots");
    let idx = 0;
    let heroTimer = null;

    function renderDots() {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = "";
        slides.forEach((s, i) => {
            const btn = document.createElement("button");
            btn.className = i === idx ? "active" : "";
            btn.addEventListener("click", () => goTo(i));
            dotsWrap.appendChild(btn);
        });
    }

    function updateSlides() {
        slides.forEach((s, i) => s.classList.toggle("active", i === idx));
        renderDots();
    }

    function goTo(i) {
        idx = (i + slides.length) % slides.length;
        updateSlides();
        resetTimer();
    }

    function next() { goTo(idx + 1); }
    function prev() { goTo(idx - 1); }

    function resetTimer() {
        clearInterval(heroTimer);
        heroTimer = setInterval(next, 6000);
    }

    if (slides.length > 1) {
        updateSlides();
        resetTimer();
        nextBtn && nextBtn.addEventListener("click", next);
        prevBtn && prevBtn.addEventListener("click", prev);
    }

    /* --- ABOUT CAROUSEL --- */
    const aboutTrack = document.getElementById("about-track");
    const aboutPrev = document.querySelector(".about-prev");
    const aboutNext = document.querySelector(".about-next");

    if (aboutTrack) {
        aboutPrev && aboutPrev.addEventListener("click", () => {
            aboutTrack.scrollBy({ left: -aboutTrack.clientWidth * 0.5, behavior: "smooth" });
        });
        aboutNext && aboutNext.addEventListener("click", () => {
            aboutTrack.scrollBy({ left: aboutTrack.clientWidth * 0.5, behavior: "smooth" });
        });
    }

    /* --- 2. CEK STATUS LOGIN (NAVBAR) - KODE INI SUDAH DIKONSOLIDASI --- */
    const navAuthItem = document.getElementById("nav-auth-item");
    const myRole = localStorage.getItem("userRole");
    const myName = localStorage.getItem("userName");

    if (navAuthItem) {
        if (myRole && myName) {
            // Dropdown Ikon Profil
            navAuthItem.innerHTML = `
                <div class="user-profile-nav" style="position:relative;">
                    <button id="btn-profile-toggle" 
                            style="background:var(--card); border:1px solid #ccc; width:40px; height:40px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:101;">
                        <i data-feather="user"></i>
                    </button>
                    
                    <div id="profile-dropdown" style="position:absolute; right:0; top:45px; background:white; border-radius:8px; box-shadow:0 4px 15px rgba(0,0,0,0.1); width:200px; padding:10px; display:none; z-index:100;">
                        <p style="font-weight:bold; margin-bottom:5px;">Halo, ${myName}</p>
                        <p style="font-size:0.8rem; color:var(--muted); border-bottom:1px solid #eee; padding-bottom:10px;">Status: ${myRole.toUpperCase()}</p>
                        
                        <a href="user-settings.html" style="text-decoration:none; display:block; padding:8px 0; color:#333; font-size:0.9rem; margin-top:5px;">
                            ⚙️ Pengaturan Akun
                        </a>

                        <button id="btn-logout-dropdown" 
                                style="width:100%; text-align:left; padding:8px 0; background:none; border:none; color:#e74c3c; cursor:pointer; font-size:0.9rem; border-top:1px solid #eee; margin-top:5px;">
                            🚪 Logout
                        </button>
                    </div>
                </div>
            `;
            
            // Logika Dropdown di dalam sini (karena elemen ada)
            setTimeout(() => { 
                feather.replace(); // Panggil Feather Icons
                const toggleBtn = document.getElementById("btn-profile-toggle");
                const dropdown = document.getElementById("profile-dropdown");
                const logoutBtn = document.getElementById("btn-logout-dropdown");

                // Toggle logic
                if (toggleBtn) {
                    toggleBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
                    });
                }

                // Tutup kalau klik di luar area
                document.addEventListener('click', (e) => {
                    if (toggleBtn && dropdown && !toggleBtn.contains(e.target) && !dropdown.contains(e.target)) {
                        dropdown.style.display = 'none';
                    }
                });

                // Logout logic
                if (logoutBtn) {
                    logoutBtn.addEventListener("click", () => {
                        if(confirm("Yakin ingin keluar?")) {
                            localStorage.clear(); 
                            window.location.href = "index.html"; 
                        }
                    });
                }
            }, 500);

        } else {
            // BELUM LOGIN
            navAuthItem.innerHTML = `<a href="login.html" class="btn-login-nav">Masuk</a>`;
        }
    }


    /* --- 3. FITUR PETISI DINAMIS & LOGIKA DUKUNG --- */
    const petisiContainer = document.getElementById("petisi-container");
    const petisiStatsContainer = document.getElementById("petisi-stats"); 
    
    if (petisiContainer) {
        loadPetisi();
    }

    async function loadPetisi() {
        try {
            const response = await fetch('php/api_petisi.php?action=read');
            const data = await response.json();
            
            let totalDukungan = 0;
            let totalTarget = 0;
            let totalPetisiAktif = data.length;

            data.forEach(item => {
                totalDukungan += parseInt(item.jumlah_ttd);
                totalTarget += parseInt(item.target_ttd);
            });
            
            const totalProgress = totalTarget > 0 ? Math.min((totalDukungan / totalTarget) * 100, 100).toFixed(1) : 0;


            // --- MENGISI BLOK STATISTIK ---
            if (petisiStatsContainer) {
                petisiStatsContainer.innerHTML = `
                    <div class="stat-item">
                        <div class="stat-number">${totalPetisiAktif}</div>
                        <p>Kampanye Aktif</p>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${totalDukungan.toLocaleString('id-ID')}</div>
                        <p>Total Dukungan Masuk</p>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${totalProgress}%</div>
                        <p>Tercapai dari Semua Target</p>
                    </div>
                `;
            }

            // --- MENGISI KARTU PETISI (GRID) ---
            petisiContainer.innerHTML = ''; 

            if (totalPetisiAktif === 0) {
                petisiContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Belum ada kampanye aktif.</p>';
                return;
            }

            data.forEach(item => {
                const percent = Math.min((item.jumlah_ttd / item.target_ttd) * 100, 100);
                
                // <<< KODE CARD INI SUDAH DIPERBAIKI (TIDAK ADA SINTAKS GANDA) >>>
                const cardHTML = `
                    <article class="campaign-card">
                        <img src="img/${item.gambar}" alt="${item.judul}" class="campaign-img">
                        <div class="card-body">
                            <p class="muted">Lingkungan</p>
                            <h4>${item.judul}</h4>
                            <p class="card-desc">${item.deskripsi.substring(0, 100)}...</p>
                            
                            <div style="background:#eee; height:10px; border-radius:5px; margin:10px 0; overflow:hidden;">
                                <div style="background:var(--green); width:${percent}%; height:100%;"></div>
                            </div>
                            <p class="muted" style="font-size:0.85rem; margin-bottom:15px;">
                                <b>${item.jumlah_ttd}</b> dukungan dari target ${item.target_ttd}
                            </p>

                            <a href="petisi-detail.html?id=${item.id}" class="btn secondary" style="text-decoration: none; display: block;">Lihat Detail & Dukung</a>
                        </div>
                    </article>
                `;
                petisiContainer.innerHTML += cardHTML;
            });

        } catch (error) {
            console.error('Gagal memuat petisi:', error);
            if (petisiStatsContainer) petisiStatsContainer.innerHTML = '<p style="color:red; grid-column: 1 / -1;">Gagal koneksi ke server.</p>';
            petisiContainer.innerHTML = '<p style="color:red; grid-column: 1 / -1;">Gagal koneksi ke server.</p>';
        }
    }

    /* Catatan: Fungsi window.dukungPetisi dihapus dari sini karena tombol di Petisi.html
       sekarang mengarah ke halaman detail. Fungsi dukung akan berada di js/petisi-detail.js */


    /* --- 4. FITUR DONASI (VERSI FIX - KIRIM USER ID) --- */
    const formDonasi = document.getElementById("donasi-konfirmasi-form");
    if (formDonasi) {
        formDonasi.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            // AMBIL ID DARI LOCAL STORAGE
            const myId = localStorage.getItem("userId"); 
            if (!myId) {
                alert("🔒 Silakan LOGIN dulu untuk konfirmasi donasi.");
                window.location.href = "login.html";
                return;
            }

            const btn = formDonasi.querySelector("button[type='submit']");
            btn.disabled = true; btn.textContent = "Mengirim...";

            const formData = new FormData(formDonasi);
            formData.append('action', 'create');
            formData.append('user_id', myId); // <--- INI WAJIB KIRIM

            try {
                const res = await fetch('php/api_donasi.php', { method: 'POST', body: formData });
                const result = await res.json();
                if (result.status === 'success') {
                    alert(result.message);
                    formDonasi.reset();
                } else {
                    alert("Gagal: " + result.message);
                }
            } catch (error) {
                alert("Kesalahan koneksi.");
            } finally {
                btn.disabled = false; btn.textContent = "Konfirmasi Donasi";
            }
        });
    }
    
    /* SCROLL REVEAL (PILL) */
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((ent) => {
                if (ent.isIntersecting) ent.target.classList.add("reveal");
            });
        },
        { threshold: 0.18 }
    );
    document.querySelectorAll(".pill").forEach((el) => {
        observer.observe(el);
    });

/* --- 5. FITUR RELAWAN (VERSI FIX - KIRIM USER ID) --- */
    const formRelawan = document.getElementById("relawan-signup-form");
    if (formRelawan) {
        formRelawan.addEventListener("submit", async (e) => {
            e.preventDefault();

            // 1. AMBIL ID DARI LOCAL STORAGE (WAJIB LOGIN)
            const currentUserId = localStorage.getItem("userId"); 

            if (!currentUserId || currentUserId === "undefined") {
                alert("🔒 Akses Ditolak! Anda harus LOGIN terlebih dahulu untuk mendaftar relawan.");
                window.location.href = "login.html";
                return;
            }

            const btn = formRelawan.querySelector("button[type='submit']");
            const txt = btn.textContent;
            btn.textContent = "Mendaftar...";
            btn.disabled = true;

            const formData = new FormData(formRelawan);
            formData.append('action', 'create');
            // --- INI KUNCINYA: Masukkan ID User ke data yang dikirim ---
            formData.append('user_id', currentUserId); 

            try {
                const res = await fetch('php/api_relawan.php', { method: 'POST', body: formData });
                const result = await res.json();
                
                if (result.status === 'success') {
                    alert(result.message);
                    formRelawan.reset();
                } else {
                    alert("Gagal: " + result.message);
                }
            } catch (error) {
                console.error(error);
                alert("Kesalahan koneksi. Pastikan Apache & MySQL nyala.");
            } finally {
                btn.textContent = txt;
                btn.disabled = false;
            }
        });
    }

    /* --- 6. FITUR LIGHTBOX (POP UP GAMBAR) --- */
    const modal = document.getElementById("lightbox-modal");
    const modalImg = document.getElementById("lightbox-image");
    const closeBtn = document.querySelector(".lightbox-close");

    const images = document.querySelectorAll(".carousel-track img, .slide img");

    if (modal && images.length > 0) {
        images.forEach(img => {
            img.style.cursor = "zoom-in"; 
            img.title = "Klik untuk memperbesar";

            img.addEventListener('click', (e) => {
                modalImg.src = img.src;
                modal.classList.add("active");
            });
        });

        function closeModal() {
            modal.classList.remove("active");
        }

        if(closeBtn) closeBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && modal.classList.contains("active")) {
                closeModal();
            }
        });
    }
});