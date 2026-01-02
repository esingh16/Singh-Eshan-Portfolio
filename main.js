// ===========================
// DOM Ready
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navbar = document.querySelector(".navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const themeToggle = document.getElementById("themeToggle");
  const progressBar = document.getElementById("scrollProgressBar");

  // ===========================
  // Theme toggle (dark / light)
  // ===========================
  const storedTheme = localStorage.getItem("eshan-theme");
  if (storedTheme === "light") {
    body.classList.add("light");
  }

  function updateThemeIcon() {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector("i");
    if (!icon) return;
    if (body.classList.contains("light")) {
      icon.className = "fa-solid fa-sun";
    } else {
      icon.className = "fa-solid fa-moon";
    }
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

  // ===========================
  // Mobile menu toggle
  // ===========================
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

  // ===========================
  // Navbar scroll behavior & active link
  // ===========================
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

    // scroll progress
    if (progressBar) {
      const doc = document.documentElement;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const scrolled = scrollHeight > 0 ? (window.pageYOffset / scrollHeight) * 100 : 0;
      progressBar.style.width = scrolled + "%";
    }

    markActiveNav();
  });

  // initial
  markActiveNav();

  // ===========================
  // Smooth scrolling
  // ===========================
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

  // ===========================
  // Typewriter effect
  // ===========================
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
      if (deleting) {
        charIndex--;
      } else {
        charIndex++;
      }

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

      const speed = deleting ? 45 : 95;
      setTimeout(type, speed);
    }

    setTimeout(type, 600);
  }

  // ===========================
  // Intersection reveal
  // ===========================
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // ===========================
  // Stats counter
  // ===========================
  const metricEls = document.querySelectorAll(".metric-value");
  if (metricEls.length && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.target || "0");
          const decimals = el.dataset.target?.includes(".")
            ? el.dataset.target.split(".")[1].length
            : 0;
          animateNumber(el, target, decimals);
          statsObserver.unobserve(el);
        });
      },
      { threshold: 0.45 }
    );

    metricEls.forEach((el) => statsObserver.observe(el));
  }

  function animateNumber(el, target, decimals) {
    let current = 0;
    const frames = 80;
    const increment = target / frames;
    const duration = 1500;
    const stepTime = duration / frames;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent =
        decimals > 0 ? current.toFixed(decimals) : Math.round(current);
    }, stepTime);
  }

  // ===========================
  // Project tab filter
  // ===========================
  const projectTabs = document.querySelectorAll(".project-tab");
  const projectCards = document.querySelectorAll(".project-card");

  projectTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter || "all";

      projectTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      projectCards.forEach((card) => {
        const category = card.dataset.category || "";
        const categories = category.split(/\s+/);

        const show =
          filter === "all" ? true : categories.includes(filter.toLowerCase());
        card.style.display = show ? "block" : "none";
      });
    });
  });

  // ===========================
  // Tilt effect for hero card
  // ===========================
  const tiltCard = document.querySelector(".tilt-card");
  if (tiltCard) {
    tiltCard.addEventListener("mousemove", (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 18;
      const rotateY = (centerX - x) / 18;
      tiltCard.style.transform = `
        perspective(900px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-4px)
      `;
    });

    tiltCard.addEventListener("mouseleave", () => {
      tiltCard.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  }

  // ===========================
  // Contact form (front‑end validation only)
  // ===========================
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  function setFormStatus(message, type = "info") {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.style.color =
      type === "error"
        ? "#ef4444"
        : type === "success"
        ? "#4ade80"
        : "#9ca3af";
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name")?.value.trim();
      const email = document.getElementById("emailInput")?.value.trim();
      const type = document.getElementById("type")?.value;
      const message = document.getElementById("message")?.value.trim();

      if (!name || !email || !type || !message) {
        setFormStatus("Please fill in all fields.", "error");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFormStatus("Please provide a valid email address.", "error");
        return;
      }

      // simulate success for now
      setFormStatus("Thanks for reaching out! Your message has been queued.", "success");
      contactForm.reset();
      setTimeout(() => setFormStatus("", "info"), 4500);
    });
  }
});
