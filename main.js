document.addEventListener("DOMContentLoaded", () => {
  /* ── Elements ──────────────────────────── */
  const body       = document.body;
  const nav        = document.getElementById("nav");
  const burger     = document.getElementById("navBurger");
  const navLinks   = document.getElementById("navLinks");
  const nls        = document.querySelectorAll(".nl");
  const themeBtn   = document.getElementById("themeBtn");
  const progressBar = document.getElementById("progress-bar");

  /* ── Dark mode (saved preference) ──────── */
  if (localStorage.getItem("es-theme") === "dark") {
    body.classList.add("dark");
  }
  function syncThemeIcon() {
    if (!themeBtn) return;
    const icon = themeBtn.querySelector("i");
    if (!icon) return;
    icon.className = body.classList.contains("dark")
      ? "fa-solid fa-sun"
      : "fa-solid fa-moon";
  }
  syncThemeIcon();

  themeBtn?.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("es-theme", body.classList.contains("dark") ? "dark" : "light");
    syncThemeIcon();
  });

  /* ── Mobile nav ─────────────────────────── */
  burger?.addEventListener("click", () => {
    burger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  nls.forEach(nl => nl.addEventListener("click", () => {
    burger.classList.remove("open");
    navLinks.classList.remove("open");
  }));

  /* ── Scroll: progress + nav ─────────────── */
  const sections = document.querySelectorAll("section[id]");

  function onScroll() {
    const sy = window.scrollY;

    // Navbar shadow
    nav?.classList.toggle("scrolled", sy > 10);

    // Progress bar
    if (progressBar) {
      const d = document.documentElement;
      const total = d.scrollHeight - d.clientHeight;
      progressBar.style.width = total > 0 ? `${(sy / total) * 100}%` : "0%";
    }

    // Active nav link
    const scrollY = sy + 120;
    sections.forEach(section => {
      const id = section.id;
      const top = section.offsetTop;
      const inView = scrollY >= top && scrollY < top + section.offsetHeight;
      nls.forEach(nl => {
        if (nl.getAttribute("href") === `#${id}`) nl.classList.toggle("active", inView);
      });
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Smooth scroll ──────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 70, behavior: "smooth" });
    });
  });

  /* ── Typewriter ─────────────────────────── */
  const tw = document.getElementById("typewriter");
  if (tw) {
    const roles = [
      "Data Scientist",
      "AI/ML Engineer",
      "NLP and RAG Practitioner",
      "Agentic AI Builder",
      "Data Analyst",
    ];
    let ri = 0, ci = 0, del = false;
    function tick() {
      const cur = roles[ri];
      ci += del ? -1 : 1;
      tw.textContent = cur.slice(0, ci);
      if (!del && ci === cur.length) { del = true; setTimeout(tick, 2000); return; }
      if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; }
      setTimeout(tick, del ? 40 : 88);
    }
    setTimeout(tick, 700);
  }

  /* ── Reveal on scroll ───────────────────── */
  const revEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    revEls.forEach(el => obs.observe(el));
  } else {
    revEls.forEach(el => el.classList.add("visible"));
  }

  /* ── Stat counters ──────────────────────── */
  const statEls = document.querySelectorAll(".stat-num");
  function animateNum(el, target, dec) {
    let cur = 0;
    const frames = 65, step = 1300 / frames, inc = target / frames;
    const t = setInterval(() => {
      cur = Math.min(cur + inc, target);
      el.textContent = dec > 0 ? cur.toFixed(dec) : Math.round(cur);
      if (cur >= target) clearInterval(t);
    }, step);
  }
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const raw = el.dataset.target || "0";
        const dec = raw.includes(".") ? raw.split(".")[1].length : 0;
        animateNum(el, parseFloat(raw), dec);
        obs.unobserve(el);
      }),
      { threshold: 0.5 }
    );
    statEls.forEach(el => obs.observe(el));
  }

  /* ── Project filter ─────────────────────── */
  const ptabs  = document.querySelectorAll(".ptab");
  const pcards = document.querySelectorAll(".proj-card");
  ptabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter || "all";
      ptabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      pcards.forEach(card => {
        const cats = (card.dataset.category || "").split(" ");
        const show = filter === "all" || cats.includes(filter);
        card.style.display = show ? "" : "none";
      });
    });
  });

  /* ── Tilt hero card ─────────────────────── */
  const tilt = document.querySelector(".tilt-card");
  if (tilt) {
    tilt.addEventListener("mousemove", e => {
      const r  = tilt.getBoundingClientRect();
      const rx = ((e.clientY - r.top)  / r.height - 0.5) * 9;
      const ry = ((e.clientX - r.left) / r.width  - 0.5) * -9;
      tilt.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
    });
    tilt.addEventListener("mouseleave", () => {
      tilt.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0)";
    });
  }

  /* ── Contact form ───────────────────────── */
  const form   = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const setStatus = (msg, type) => {
    if (!status) return;
    status.textContent = msg;
    status.style.color = type === "error" ? "#ef4444" : type === "success" ? "#22c55e" : "#7a726a";
  };
  form?.addEventListener("submit", e => {
    const name  = document.getElementById("name")?.value.trim();
    const email = document.getElementById("emailInput")?.value.trim();
    const type  = document.getElementById("type")?.value;
    const msg   = document.getElementById("message")?.value.trim();
    if (!name || !email || !type || !msg) { e.preventDefault(); setStatus("Please fill in all fields.", "error"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { e.preventDefault(); setStatus("Please provide a valid email.", "error"); return; }
    setStatus("Sending your message…", "");
  });

  /* ── Grain canvas ───────────────────────── */
  const canvas = document.getElementById("grain-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w, h;
    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);
    function drawGrain() {
      const img = ctx.createImageData(w, h);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255 | 0;
        img.data[i] = img.data[i+1] = img.data[i+2] = v;
        img.data[i+3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      requestAnimationFrame(drawGrain);
    }
    drawGrain();
  }

  /* ── Sparks on click ────────────────────── */
  window.addEventListener("pointerdown", e => {
    const spark = document.createElement("div");
    spark.className = "spark";
    spark.style.left = `${e.clientX}px`;
    spark.style.top  = `${e.clientY}px`;
    document.body.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove());
  });
});
