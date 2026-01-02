// ===========================
// Navigation & Scroll Effects
// ===========================
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Mobile Navigation Toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (navToggle && navMenu) {
        navToggle.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  });

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Active navigation link on scroll
  const sections = document.querySelectorAll("section[id]");

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavLink);

  // ===========================
  // Smooth Scrolling
  // ===========================
  document
    .querySelectorAll('a[href^="#"]')
    .forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        e.preventDefault();
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      });
    });

  // ===========================
  // Intersection Observer for Animations
  // ===========================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll(
    ".service-card, .project-card, .cert-card, .contact-card, .timeline-item"
  );
  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // ===========================
  // Skills Animation
  // ===========================
  const skillTags = document.querySelectorAll(".skill-tag");
  skillTags.forEach((tag, index) => {
    tag.style.opacity = "0";
    tag.style.transform = "scale(0.8)";
    tag.style.transition = `opacity 0.3s ease ${
      index * 0.05
    }s, transform 0.3s ease ${index * 0.05}s`;
  });

  const skillsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tags = entry.target.querySelectorAll(".skill-tag");
          tags.forEach((tag) => {
            tag.style.opacity = "1";
            tag.style.transform = "scale(1)";
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  const skillCategories = document.querySelectorAll(".skill-category");
  skillCategories.forEach((category) => {
    skillsObserver.observe(category);
  });

  // ===========================
  // Contact Form Handler
  // ===========================
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  function showMessage(text, type) {
    if (!formMessage) return;
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = "block";

    setTimeout(() => {
      formMessage.style.display = "none";
    }, 5000);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !subject || !message) {
        showMessage("Please fill in all fields.", "error");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showMessage("Please enter a valid email address.", "error");
        return;
      }

      showMessage(
        "Thank you for your message! I will get back to you soon.",
        "success"
      );
      contactForm.reset();
    });
  }

  // ===========================
  // Typing Animation for Hero Subtitle
  // ===========================
  const subtitleElement = document.querySelector(".hero-subtitle");
  if (subtitleElement) {
    const titles = [
      "Data Science & AI Engineer",
      "Machine Learning Specialist",
      "Full-Stack AI Developer",
      "Predictive Analytics Expert",
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
      const currentTitle = titles[titleIndex];
      if (isDeleting) {
        subtitleElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        subtitleElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentTitle.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 500;
      }

      setTimeout(typeEffect, typingSpeed);
    }

    setTimeout(typeEffect, 1000);
  }

  // ===========================
  // Stats Counter Animation
  // ===========================
  function animateCounter(element, target, decimals = 0) {
    let current = 0;
    const steps = 100;
    const increment = target / steps;
    const duration = 2000;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent =
        decimals > 0 ? current.toFixed(decimals) : Math.floor(current);
    }, stepTime);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll(".stat-number");
          statNumbers.forEach((stat) => {
            const target = parseFloat(stat.textContent);
            const decimals = stat.textContent.includes(".")
              ? stat.textContent.split(".")[1].length
              : 0;
            animateCounter(stat, target, decimals);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroStats = document.querySelector(".hero-stats");
  if (heroStats) {
    statsObserver.observe(heroStats);
  }

  // ===========================
  // Parallax Effect for Hero Background
  // ===========================
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector(".animated-gradient");
    if (heroBackground) {
      heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });

  // ===========================
  // Project Card Hover Effects
  // ===========================
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.3s ease";
    });

    card.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });
  });

  // ===========================
  // Service Card Animations
  // ===========================
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const icon = this.querySelector(".service-icon");
      if (icon) {
        icon.style.transform = "scale(1.1) rotate(5deg)";
        icon.style.transition = "transform 0.3s ease";
      }
    });

    card.addEventListener("mouseleave", function () {
      const icon = this.querySelector(".service-icon");
      if (icon) {
        icon.style.transform = "scale(1) rotate(0deg)";
      }
    });
  });

  // ===========================
  // Scroll Progress Indicator
  // ===========================
  const scrollProgress = document.createElement("div");
  scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    z-index: 9999;
    transition: width 0.1s ease;
    width: 0;
  `;
  document.body.appendChild(scrollProgress);

  window.addEventListener("scroll", function () {
    const windowHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled =
      windowHeight > 0
        ? (window.pageYOffset / windowHeight) * 100
        : 0;
    scrollProgress.style.width = scrolled + "%";
  });

  // ===========================
  // Initialize Animations on Load
  // ===========================
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");
    updateActiveNavLink();
  });
});

// ===========================
// Utility Functions
// ===========================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
