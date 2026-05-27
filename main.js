document.addEventListener("DOMContentLoaded", () => {

  /* ── Refs ────────────────────────────── */
  const body        = document.body;
  const nav         = document.getElementById("nav");
  const burger      = document.getElementById("navBurger");
  const navLinks    = document.getElementById("navLinks");
  const nls         = document.querySelectorAll(".nl");
  const themeBtn    = document.getElementById("themeBtn");
  const progressBar = document.getElementById("progress-bar");

  /* ── Theme ──────────────────────────── */
  if (localStorage.getItem("es-theme") === "dark") body.classList.add("dark");

  function syncIcon() {
    const icon = themeBtn?.querySelector("i");
    if (!icon) return;
    icon.className = body.classList.contains("dark") ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
  syncIcon();

  themeBtn?.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("es-theme", body.classList.contains("dark") ? "dark" : "light");
    syncIcon();
    // Brief flash on theme toggle
    const flash = document.createElement("div");
    Object.assign(flash.style, {
      position: "fixed", inset: 0, background: "rgba(217,119,6,0.04)",
      pointerEvents: "none", zIndex: 997, transition: "opacity 0.4s ease", opacity: 1,
    });
    document.body.appendChild(flash);
    requestAnimationFrame(() => { flash.style.opacity = 0; });
    flash.addEventListener("transitionend", () => flash.remove());
  });

  /* ── Mobile nav ─────────────────────── */
  burger?.addEventListener("click", () => {
    burger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  nls.forEach(nl => nl.addEventListener("click", () => {
    burger?.classList.remove("open");
    navLinks?.classList.remove("open");
  }));

  /* ── Scroll handler ─────────────────── */
  const sections = document.querySelectorAll("section[id]");

  function onScroll() {
    const sy = window.scrollY;
    nav?.classList.toggle("scrolled", sy > 10);

    if (progressBar) {
      const d = document.documentElement;
      const total = d.scrollHeight - d.clientHeight;
      progressBar.style.width = total > 0 ? `${(sy / total) * 100}%` : "0%";
    }

    const active = sy + 130;
    sections.forEach(s => {
      const inView = active >= s.offsetTop && active < s.offsetTop + s.offsetHeight;
      nls.forEach(nl => {
        if (nl.getAttribute("href") === `#${s.id}`) nl.classList.toggle("active", inView);
      });
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Smooth scroll ──────────────────── */
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

  /* ── Typewriter ─────────────────────── */
  const tw = document.getElementById("typewriter");
  if (tw) {
    const roles = [
      "Data Scientist", "AI/ML Engineer",
      "NLP and RAG Practitioner", "Agentic AI Builder", "Data Analyst",
    ];
    let ri = 0, ci = 0, del = false;
    function tick() {
      const cur = roles[ri];
      ci += del ? -1 : 1;
      tw.textContent = cur.slice(0, ci);
      if (!del && ci === cur.length) { del = true; setTimeout(tick, 2100); return; }
      if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; }
      setTimeout(tick, del ? 38 : 85);
    }
    setTimeout(tick, 700);
  }

  /* ── Staggered reveal ───────────────── */
  const revEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          // Stagger siblings within the same parent
          const siblings = [...(e.target.parentElement?.querySelectorAll(".reveal") || [])];
          const idx = siblings.indexOf(e.target);
          setTimeout(() => e.target.classList.add("visible"), idx * 75);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    revEls.forEach(el => obs.observe(el));
  } else {
    revEls.forEach(el => el.classList.add("visible"));
  }

  /* ── Counter animation (easeOutExpo) ── */
  const statEls = document.querySelectorAll(".stat-num");
  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  function animateNum(el, target, dec) {
    const start = performance.now();
    const duration = 1600;
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const val = easeOutExpo(t) * target;
      el.textContent = dec > 0 ? val.toFixed(dec) : Math.round(val);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const raw = el.dataset.target || "0";
        const dec = raw.includes(".") ? raw.split(".")[1].length : 0;
        animateNum(el, parseFloat(raw), dec);
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    statEls.forEach(el => obs.observe(el));
  }

  /* ── Project filter with fade ───────── */
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
        if (show) {
          card.style.display = "";
          card.style.opacity = "0";
          card.style.transform = "translateY(12px)";
          requestAnimationFrame(() => {
            card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            card.style.opacity = "1";
            card.style.transform = "";
          });
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* ── Tilt hero card ─────────────────── */
  const tilt = document.querySelector(".tilt-card");
  if (tilt) {
    let rafId;
    tilt.addEventListener("mousemove", e => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const r  = tilt.getBoundingClientRect();
        const rx = ((e.clientY - r.top)  / r.height - 0.5) * 11;
        const ry = ((e.clientX - r.left) / r.width  - 0.5) * -11;
        tilt.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.02)`;
      });
    });
    tilt.addEventListener("mouseleave", () => {
      tilt.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
      tilt.style.transform   = "perspective(900px) rotateX(0) rotateY(0) translateY(0) scale(1)";
      setTimeout(() => { tilt.style.transition = ""; }, 500);
    });
  }

  /* ── Magnetic buttons ───────────────── */
  document.querySelectorAll(".btn-primary, .btn-outline, .social-ico, .logo-mark").forEach(el => {
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * 0.22;
      const dy = (e.clientY - cy) * 0.22;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transition = "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)";
      el.style.transform  = "";
      setTimeout(() => { el.style.transition = ""; }, 400);
    });
  });

  /* ── Contact form ───────────────────── */
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

  /* ── Ambient particle canvas ────────── */
  (function() {
    const canvas = document.getElementById("ambient-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", () => { resize(); spawnParticles(); }, { passive: true });

    function isDark() { return document.body.classList.contains("dark"); }

    function spawnParticles() {
      particles = [];
      const count = Math.min(Math.floor(W * H / 18000), 55);
      for (let i = 0; i < count; i++) particles.push(makeParticle());
    }

    function makeParticle(x, y) {
      return {
        x: x ?? Math.random() * W,
        y: y ?? Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.35 + 0.05,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.008 + 0.003,
      };
    }
    spawnParticles();

    let mouseX = -999, mouseY = -999;
    window.addEventListener("mousemove", e => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });

    function draw(ts) {
      ctx.clearRect(0, 0, W, H);
      const dark = isDark();
      const baseColor = dark ? "245,158,11" : "217,119,6";

      particles.forEach((p, i) => {
        // Drift
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.speed;

        // Wrap
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        // Breathe
        const breathe = (Math.sin(p.phase) * 0.5 + 0.5);
        const alpha = p.alpha * (0.4 + breathe * 0.6);

        // Mouse repulsion
        const dx = p.x - mouseX, dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.5;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.8 + breathe * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseColor},${alpha})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const cx = p.x - q.x, cy = p.y - q.y;
          const d = Math.sqrt(cx * cx + cy * cy);
          if (d < 140) {
            const lineAlpha = (1 - d / 140) * 0.12 * (dark ? 1 : 0.7);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${baseColor},${lineAlpha})`;
            ctx.lineWidth   = 0.6;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  })();

  /* ── Grain canvas ───────────────────── */
  (function() {
    const canvas = document.getElementById("grain-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H;
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Draw static grain every 4 frames to save CPU
    let fc = 0;
    function drawGrain() {
      fc++;
      if (fc % 4 === 0) {
        const img = ctx.createImageData(W, H);
        for (let i = 0; i < img.data.length; i += 4) {
          const v = Math.random() * 255 | 0;
          img.data[i] = img.data[i+1] = img.data[i+2] = v;
          img.data[i+3] = 255;
        }
        ctx.putImageData(img, 0, 0);
      }
      requestAnimationFrame(drawGrain);
    }
    requestAnimationFrame(drawGrain);
  })();

  /* ── Sparks + ripple on click ───────── */
  window.addEventListener("pointerdown", e => {
    // Spark burst — 3 particles
    for (let i = 0; i < 3; i++) {
      const spark = document.createElement("div");
      spark.className = "spark";
      const angle  = (Math.random() - 0.5) * 60;
      const spread = Math.random() * 20 - 10;
      spark.style.left   = `${e.clientX + spread}px`;
      spark.style.top    = `${e.clientY + spread}px`;
      spark.style.transform = `translate(-50%,-50%) rotate(${angle}deg)`;
      document.body.appendChild(spark);
      spark.addEventListener("animationend", () => spark.remove());
    }

    // Ripple ring
    const ripple = document.createElement("div");
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top  = `${e.clientY}px`;
    document.body.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });

  /* ── Section entrance glow ──────────── */
  if ("IntersectionObserver" in window) {
    const headings = document.querySelectorAll(".section-heading");
    const hObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.textShadow = "0 0 40px rgba(217,119,6,0.12)";
          setTimeout(() => { e.target.style.textShadow = ""; }, 900);
        }
      });
    }, { threshold: 0.5 });
    headings.forEach(h => hObs.observe(h));
  }

  /* ── Skill list stagger on hover ────── */
  document.querySelectorAll(".skill-block").forEach(block => {
    block.addEventListener("mouseenter", () => {
      block.querySelectorAll(".skill-list li").forEach((li, i) => {
        li.style.transitionDelay = `${i * 30}ms`;
      });
    });
    block.addEventListener("mouseleave", () => {
      block.querySelectorAll(".skill-list li").forEach(li => {
        li.style.transitionDelay = "0ms";
      });
    });
  });

  /* ── Exp card subtle parallax ───────── */
  const expCards = document.querySelectorAll(".exp-item-wide .exp-body");
  window.addEventListener("mousemove", e => {
    const mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;
    expCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      card.style.backgroundPosition = `${50 + mx * 1.5}% ${50 + my * 1.5}%`;
    });
  }, { passive: true });
