// Basic interactivity: mobile nav, hero slider, about carousel, form submit
document.addEventListener("DOMContentLoaded", () => {
  // mobile nav toggle
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  
  // Fungsi untuk menutup menu
  function closeMobileNav() {
    mainNav.classList.remove("open");
    navToggle.classList.remove("open");
  }

  navToggle &&
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
      navToggle.classList.toggle("open");
    });
    
  // TUTUP MENU SAAT LINK DIKLIK (Perbaikan baru)
  const navLinks = mainNav ? mainNav.querySelectorAll('a[href^="#"]') : [];
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });
  
  // set year
  document.getElementById("year").textContent = new Date().getFullYear();

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

  function next() {
    goTo(idx + 1);
  }
  function prev() {
    goTo(idx - 1);
  }

  function resetTimer() {
    clearInterval(heroTimer);
    heroTimer = setInterval(next, 6000);
  }

  if (slides.length) {
    renderDots();
    updateSlides();
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
        aboutTrack.scrollBy({
          left: -aboutTrack.clientWidth * 0.5,
          behavior: "smooth",
        });
      });
    aboutNext &&
      aboutNext.addEventListener("click", () => {
        aboutTrack.scrollBy({
          left: aboutTrack.clientWidth * 0.5,
          behavior: "smooth",
        });
      });
  }

  /* Form handling (dummy) */
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
      // simple success feedback
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

  document.querySelectorAll(".pill").forEach((el) => {
    observer.observe(el);
  });
});