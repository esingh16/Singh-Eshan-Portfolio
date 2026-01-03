document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navbar = document.querySelector(".navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const themeToggle = document.getElementById("themeToggle");
  const progressBar = document.getElementById("scrollProgressBar");
  const heroSection = document.querySelector(".hero-section");
  const heroGradient = document.querySelector(".hero-gradient");
  const heroOrbits = document.querySelectorAll(".hero-orbit");

  // Theme toggle
  const storedTheme = localStorage.getItem("eshan-theme");
  if (storedTheme === "light") {
    body.classList.add("light");
  }

  function updateThemeIcon() {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector("i");
    if (!icon) return;
    icon.className = body.classList.contains("light")
      ? "fa-solid fa-sun"
      : "fa-solid fa-moon";
  }
  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("light");
      const mode = body.classList.contains("light") ? "light" : "dark";
      localStorage.setItem("eshan-theme", mode);
      updateThemeIcon();
    });
  }

  // Mobile nav
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navToggle && navMenu && navMenu.classList.contains("active")) {
        navToggle.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  });

  // Active nav + scroll progress
  const sections = document.querySelectorAll("section[id]");

  function markActiveNav() {
    const scrollY = window.pageYOffset + 120;
    sections.forEach((section) => {
      const id = section.getAttribute("id");
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const inView = scrollY >= top && scrollY < top + height;
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === "#" + id) {
          link.classList.toggle("active", inView);
        }
      });
    });
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }

    if (progressBar) {
      const doc = document.documentElement;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const scrolled = scrollHeight > 0 ? (window.pageYOffset / scrollHeight) * 100 : 0;
      progressBar.style.width = scrolled + "%";
    }

    markActiveNav();
  });

  markActiveNav();

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = target.offsetTop - 72;
      window.scrollTo({ top: offset, behavior: "smooth" });
    });
  });

  // Typewriter
  const typewriterEl = document.getElementById("typewriter");
  if (typewriterEl) {
    const roles = [
      "Data Science & AI Engineer",
      "ML/DL Engineer",
      "NLP & RAG Practitioner",
      "Full‑Stack AI Prototype Builder",
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
      const current = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      typewriterEl.textContent = current.slice(0, charIndex);

      if (!deleting && charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }

      if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }

      setTimeout(type, deleting ? 45 : 95);
    }

    setTimeout(type, 600);
  }

  // Reveal on scroll (with stagger support)
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target;

          if (target.classList.contains("reveal-stagger")) {
            const children = target.querySelectorAll(".reveal-item");
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add("visible");
              }, index * 120);
            });
          } else {
            target.classList.add("visible");
          }

          observer.unobserve(target);
        });
      },
      { threshold: 0.18 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // Metrics counter
  const metricEls = document.querySelectorAll(".metric-value");
  if (metricEls.length && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.target || "0");
          const decimals =
            el.dataset.target && el.dataset.target.includes(".")
              ? el.dataset.target.split(".")[1].length
              : 0;
          animateNumber(el, target, decimals);
          statsObserver.unobserve(el);
