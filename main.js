document.addEventListener("DOMContentLoaded", () => {
  const body      = document.body;
  const navbar    = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu   = document.getElementById("navMenu");
  const navLinks  = document.querySelectorAll(".nav-link");
  const themeToggle = document.getElementById("themeToggle");
  const progressBar = document.getElementById("scrollProgressBar");

  /* ── Theme ──────────────────────────────── */
  const storedTheme = localStorage.getItem("eshan-theme");
  if (storedTheme === "light") body.classList.add("light");

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
      localStorage.setItem("eshan-theme", body.classList.contains("light") ? "light" : "dark");
      updateThemeIcon();
    });
  }

  /* ── Mobile nav ─────────────────────────── */
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  /* ── Scroll behaviours ───────────────────── */
  const sections = document.querySelectorAll("section[id]");

  function markActiveNav() {
    const scrollY = window.pageYOffset + 130;
    sections.forEach(section => {
      const id     = section.getAttribute("id");
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const inView = scrollY >= top && scrollY < top + height;
      navLinks.forEach(link => {
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.toggle("active", inView);
        }
      });
    });
  }

  window.addEventListener("scroll", () => {
    // Navbar
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 12);
    }

    // Progress bar
    if (progressBar) {
      const doc = document.documentElement;
      const scrollH = doc.scrollHeight - doc.clientHeight;
      const pct = scrollH > 0 ? (window.pageYOffset / scrollH) * 100 : 0;
      progressBar.style.width = `${pct}%`;
    }

    markActiveNav();
  }, { passive: true });

  markActiveNav();

  /* ── Smooth scroll ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 72, behavior: "smooth" });
    });
  });

  /* ── Typewriter ──────────────────────────── */
  const typewriterEl = document.getElementById("typewriter");
  if (typewriterEl) {
    const roles = [
      "Data Scientist",
      "AI/ML Engineer",
      "NLP & RAG Practitioner",
      "Agentic AI Builder",
      "Data Analyst",
    ];
    let ri = 0, ci = 0, deleting = false;

    function type() {
      const current = roles[ri];
      ci += deleting ? -1 : 1;
      typewriterEl.textContent = current.slice(0, ci);

      if (!deleting && ci === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
      if (deleting && ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
      }
      setTimeout(type, deleting ? 40 : 90);
    }
    setTimeout(type, 700);
  }

  /* ── Reveal on scroll ────────────────────── */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.14 }
    );
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("visible"));
  }

  /* ── Metrics counter ─────────────────────── */
  const metricEls = document.querySelectorAll(".metric-value");

  function animateNumber(el, target, decimals) {
    let current = 0;
    const frames = 70, stepTime = 1400 / frames, inc = target / frames;
    const timer = setInterval(() => {
      current = Math.min(current + inc, target);
      el.textContent = decimals === 0 ? Math.round(current) : current.toFixed(decimals);
      if (current >= target) clearInterval(timer);
    }, stepTime);
  }

  if (metricEls.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el  = e.target;
        const raw = el.dataset.target || "0";
        const dec = raw.includes(".") ? raw.split(".")[1].length : 0;
        animateNumber(el, parseFloat(raw), dec);
        obs.unobserve(el);
      }),
      { threshold: 0.5 }
    );
    metricEls.forEach(el => obs.observe(el));
  }

  /* ── Project filter ──────────────────────── */
  const projectTabs  = document.querySelectorAll(".project-tab");
  const projectCards = document.querySelectorAll(".project-card");

  projectTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter || "all";
      projectTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      projectCards.forEach(card => {
        const cats = (card.dataset.category || "").split(" ");
        const show = filter === "all" || cats.includes(filter.toLowerCase());
        card.style.display = show ? "" : "none";
      });
    });
  });

  /* ── Tilt hero card ──────────────────────── */
  const tiltCard = document.querySelector(".tilt-card");
  if (tiltCard) {
    tiltCard.addEventListener("mousemove", e => {
      const rect = tiltCard.getBoundingClientRect();
      const rx = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
      const ry = ((e.clientX - rect.left) / rect.width  - 0.5) * -10;
      tiltCard.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    tiltCard.addEventListener("mouseleave", () => {
      tiltCard.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
    });
  }

  /* ── Contact form ────────────────────────── */
  const contactForm = document.getElementById("contactForm");
  const formStatus  = document.getElementById("formStatus");

  function setFormStatus(msg, type = "info") {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.style.color = type === "error" ? "#f87171" : type === "success" ? "#34d399" : "#94a3b8";
  }

  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      const name    = document.getElementById("name")?.value.trim();
      const email   = document.getElementById("emailInput")?.value.trim();
      const type    = document.getElementById("type")?.value;
      const message = document.getElementById("message")?.value.trim();

      if (!name || !email || !type || !message) {
        e.preventDefault();
        setFormStatus("Please fill in all fields.", "error");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        e.preventDefault();
        setFormStatus("Please provide a valid email address.", "error");
        return;
      }
      setFormStatus("Sending your message…", "info");
    });
  }

  /* ── Parallax network layer ──────────────── */
  const networkLayer = document.querySelector(".data-network-layer");
  window.addEventListener("scroll", () => {
    if (!networkLayer) return;
    const offset = window.scrollY * 0.025;
    const scale  = 1 + window.scrollY * 0.0001;
    networkLayer.style.transform = `translateY(${offset}px) scale(${scale})`;
  }, { passive: true });

  /* ── Electric sparks ─────────────────────── */
  function createSpark(x, y) {
    const spark = document.createElement("div");
    spark.className = "spark";
    spark.style.left = `${x}px`;
    spark.style.top  = `${y}px`;
    document.body.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove());
  }

  window.addEventListener("pointerdown", e => createSpark(e.clientX, e.clientY));
});
