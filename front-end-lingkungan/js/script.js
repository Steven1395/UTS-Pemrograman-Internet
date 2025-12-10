// Basic interactivity: mobile nav, hero slider, about carousel, form submit
document.addEventListener("DOMContentLoaded", () => {
    // mobile nav toggle
    const navToggle = document.getElementById("nav-toggle");
    const mainNav = document.getElementById("main-nav");

    function closeMobileNav() {
        mainNav.classList.remove("open");
        navToggle.classList.remove("open");
    }

    navToggle &&
        navToggle.addEventListener("click", () => {
            mainNav.classList.toggle("open");
            navToggle.classList.toggle("open");
        });

    // TUTUP MENU SAAT LINK DIKLIK
    const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    // set year
    const yearEl = document.getElementById("year");
    if(yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /* HERO SLIDER */
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

    // Hanya jalankan slider jika ada lebih dari 1 slide
    if (slides.length > 1) {
        updateSlides(); // Panggil pertama kali
        resetTimer();
        nextBtn && nextBtn.addEventListener("click", next);
        prevBtn && prevBtn.addEventListener("click", prev);
    }

    /* ABOUT simple carousel - scroll by width */
    const aboutTrack = document.getElementById("about-track");
    const aboutPrev = document.querySelector(".about-prev");
    const aboutNext = document.querySelector(".about-next");

    if (aboutTrack) {
        aboutPrev &&
            aboutPrev.addEventListener("click", () => {
                aboutTrack.scrollBy({ left: -aboutTrack.clientWidth * 0.5, behavior: "smooth" });
            });
        aboutNext &&
            aboutNext.addEventListener("click", () => {
                aboutTrack.scrollBy({ left: aboutTrack.clientWidth * 0.5, behavior: "smooth" });
            });
    }

    /* Lightbox Logic */
    const lightboxModal = document.getElementById("lightbox-modal");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxClose = document.querySelector(".lightbox-close");
    // Targetkan gambar di carousel 'Tentang Kami'
    const carouselImages = document.querySelectorAll(".carousel-track img");

    if (lightboxModal) {
        carouselImages.forEach(img => {
            img.addEventListener('click', () => {
                const imgSrc = img.getAttribute('src');
                lightboxImage.setAttribute('src', imgSrc);
                lightboxModal.classList.add('active');
            });
        });

        // Menutup modal saat tombol (X) diklik
        lightboxClose && lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
        });

        // Menutup modal saat area luar gambar (modal itu sendiri) diklik
        lightboxModal.addEventListener('click', (e) => {
            if (e.target.id === 'lightbox-modal') {
                lightboxModal.classList.remove('active');
            }
        });
    }

    /* Form handling (Hanya untuk form signup di home) */
    const form = document.getElementById("signup-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = new FormData(form);
            const email = data.get("email") || "";
            if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                alert("Tolong masukkan email yang valid ya.");
                return;
            }
            const btn = form.querySelector('button[type="submit"]');
            btn.textContent = "Terkirim ✓";
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = "Bergabung Sekarang";
                btn.disabled = false;
                form.reset();
            }, 1800);
        });
    }

    /* Scroll reveal for .pill */
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((ent) => {
                if (ent.isIntersecting) ent.target.classList.add("reveal");
            });
        },
        { threshold: 0.18 }
    );

    // Terapkan ke semua elemen .pill (Kontribusi, dll)
    document.querySelectorAll(".pill").forEach((el) => {
        observer.observe(el);
    });

    // -------------------------------------------------------------
    // BAGIAN DI BAWAH INI SEBELUMNYA TIDAK JALAN KARENA SALAH POSISI
    // SEKARANG SUDAH DIPERBAIKI (Tidak ada nested Event Listener)
    // -------------------------------------------------------------

    /* --- FITUR LOGIN/LOGOUT NAVIGASI --- */
    const navAuthItem = document.getElementById("nav-auth-item");
    
    // Cek apakah user sudah login (Data dari localStorage yang disimpan saat login)
    const userRole = localStorage.getItem("userRole");
    const userName = localStorage.getItem("userName");

    if (navAuthItem) {
        if (userRole && userName) {
            // JIKA SUDAH LOGIN: Tampilkan Foto Profil
            // Pastikan file 'img/user-default.png' sudah ada di foldermu
            navAuthItem.innerHTML = `
                <img src="img/user-default.png" alt="Profil ${userName}" class="nav-profile-img" id="btn-logout" title="Klik untuk Logout">
            `;

            // Tambahkan fitur Logout saat gambar diklik
            // Kita pakai setTimeout agar elemen gambar ter-render dulu sebelum ditambah event click
            setTimeout(() => {
                const logoutBtn = document.getElementById("btn-logout");
                if(logoutBtn){
                    logoutBtn.addEventListener("click", () => {
                        const confirmLogout = confirm(`Halo ${userName}, apakah Anda ingin keluar (Logout)?`);
                        if (confirmLogout) {
                            localStorage.clear(); // Hapus data sesi
                            window.location.reload(); // Refresh halaman
                        }
                    });
                }
            }, 100);

        } else {
            // JIKA BELUM LOGIN: Tampilkan Tombol Masuk
            navAuthItem.innerHTML = `
                <a href="login.html" class="btn-login-nav">Masuk</a>
            `;
        }
    }
});