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
    document.addEventListener("DOMContentLoaded", () => {
    
    /* 1. TAB SWITCHER (Login <-> Register) */
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const formLoginUser = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener("click", () => {
            tabLogin.classList.add("active");
            tabRegister.classList.remove("active");
            formLoginUser.classList.add("active");
            formRegister.classList.remove("active");
        });
        tabRegister.addEventListener("click", () => {
            tabRegister.classList.add("active");
            tabLogin.classList.remove("active");
            formRegister.classList.add("active");
            formLoginUser.classList.remove("active");
        });
    }

    /* 2. FUNGSI FETCH KE PHP */
    async function authRequest(dataPayload) {
        try {
            const response = await fetch('php/auth.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataPayload)
            });
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            alert("Gagal terhubung ke server database.");
            return { status: 'error' };
        }
    }

    /* 3. HANDLE REGISTER USER */
    if (formRegister) {
        formRegister.addEventListener("submit", async (e) => {
            e.preventDefault();
            const result = await authRequest({
                action: 'register',
                nama: document.getElementById("reg-name").value,
                email: document.getElementById("reg-email").value,
                password: document.getElementById("reg-password").value
            });

            if (result.status === 'success') {
                alert(result.message);
                window.location.reload(); // Refresh agar bisa login
            } else {
                alert(result.message);
            }
        });
    }

    /* 4. HANDLE LOGIN USER BIASA */
    if (formLoginUser) {
        formLoginUser.addEventListener("submit", async (e) => {
            e.preventDefault();
            const result = await authRequest({
                action: 'login',
                role: 'user', // Identitas User
                email: document.getElementById("login-email").value,
                password: document.getElementById("login-password").value
            });
            handleLoginResult(result);
        });
    }

    /* 5. HANDLE LOGIN ADMIN */
    const formAdmin = document.getElementById("form-admin-login");
    if (formAdmin) {
        formAdmin.addEventListener("submit", async (e) => {
            e.preventDefault();
            const result = await authRequest({
                action: 'login',
                role: 'admin', // Identitas Admin
                email: document.getElementById("admin-email").value,
                password: document.getElementById("admin-password").value
            });
            handleLoginResult(result);
        });
    }

    /* FUNGSI SUKSES LOGIN */
    function handleLoginResult(result) {
        if (result.status === 'success') {
            // Simpan data sesi ke browser
            localStorage.setItem("userRole", result.data.role);
            localStorage.setItem("userName", result.data.nama);
            alert(`Login Berhasil! Halo, ${result.data.nama}`);
            window.location.href = "index.html"; // Redirect ke home
        } else {
            alert(result.message); // Tampilkan error dari PHP
        }
    }
});
});