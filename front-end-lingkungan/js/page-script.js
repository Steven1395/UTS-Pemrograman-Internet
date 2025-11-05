// Basic interactivity: mobile nav, form submit, scroll reveal
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

    /* Form handling (khusus halaman relawan) */
    const form = document.getElementById("relawan-signup-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            // Validasi sederhana
            const data = new FormData(form);
            const email = data.get("email") || "";
            const first = data.get("first") || "";
            if (!email || !first || !/^\S+@\S+\.\S+$/.test(email)) {
                alert("Tolong isi semua kolom yang ditandai bintang (*).");
                return;
            }
            // Feedback
            const btn = form.querySelector('button[type="submit"]');
            btn.textContent = "Terkirim ✓";
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = "Kirim Pendaftaran";
                btn.disabled = false;
                form.reset();
                alert("Terima kasih! Pendaftaran Anda telah kami terima.");
            }, 1800);
        });
    }

    /* Scroll reveal for .pill (kartu petisi & donasi) */
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((ent) => {
                if (ent.isIntersecting) ent.target.classList.add("reveal");
            });
        },
        { threshold: 0.18 }
    );

    // Terapkan ke semua elemen .pill (Kartu petisi, kartu donasi)
    document.querySelectorAll(".pill").forEach((el) => {
        observer.observe(el);
    });
});