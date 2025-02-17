// Theme toggle functionality
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  document.documentElement.setAttribute(
    "data-theme",
    prefersDark ? "dark" : "light"
  );

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
  });
}

// Skill icons data
const skills = [
  {
    name: "HTML5",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    name: "CSS3",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "Python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "Git",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
];

// Enhanced mobile menu functionality
function initMobileMenu() {
  const nav = document.querySelector("nav");
  const menuButton = document.createElement("button");
  menuButton.className = "mobile-menu-toggle";
  menuButton.innerHTML = '<i class="fas fa-bars"></i>';
  menuButton.setAttribute("aria-label", "Toggle menu");

  // Create backdrop
  const backdrop = document.createElement("div");
  backdrop.className = "menu-backdrop";
  document.body.appendChild(backdrop);

  // Convert existing ul to nav-list
  const navList = nav.querySelector("ul");
  navList.classList.add("nav-list");

  nav.insertBefore(menuButton, nav.firstChild);

  function closeMenu() {
    navList.classList.remove("active");
    backdrop.classList.remove("active");
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.style.overflow = "";
  }

  // Toggle menu
  menuButton.addEventListener("click", e => {
    e.stopPropagation();
    const isOpen = navList.classList.contains("active");

    if (isOpen) {
      closeMenu();
    } else {
      navList.classList.add("active");
      backdrop.classList.add("active");
      menuButton.innerHTML = '<i class="fas fa-times"></i>';
      document.body.style.overflow = "hidden";
    }
  });

  // Close menu when clicking backdrop
  backdrop.addEventListener("click", closeMenu);

  // Close menu when clicking links
  navList.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close menu on resize if screen becomes larger
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  // Handle escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });
}

// Responsive floating skills
function createFloatingSkills() {
  const container = document.querySelector(".floating-skills");
  if (!container) return;

  // Clear existing skills
  container.innerHTML = "";

  // Determine number of skills based on screen size
  const screenWidth = window.innerWidth;
  let visibleSkills = skills;

  if (screenWidth < 480) {
    visibleSkills = skills.slice(0, 4); // Show fewer skills on mobile
  } else if (screenWidth < 768) {
    visibleSkills = skills.slice(0, 6); // Show more skills on tablet
  }

  visibleSkills.forEach(skill => {
    const skillElement = document.createElement("div");
    skillElement.className = "skill-icon";
    skillElement.innerHTML = `
      <img src="${skill.icon}" alt="${skill.name}">
      <span class="skill-tooltip">${skill.name}</span>
    `;

    // Responsive positioning
    const left = Math.random() * (container.offsetWidth - 80);
    const top = Math.random() * (container.offsetHeight - 80);

    skillElement.style.left = `${left}px`;
    skillElement.style.top = `${top}px`;

    container.appendChild(skillElement);
    animateSkill(skillElement);
  });
}

// Enhanced skill animation for better performance
function animateSkill(element) {
  let x = parseFloat(element.style.left);
  let y = parseFloat(element.style.top);
  let dx = (Math.random() - 0.5) * 1.5; // Reduced speed
  let dy = (Math.random() - 0.5) * 1.5;
  let lastUpdate = performance.now();

  function update(currentTime) {
    const container = document.querySelector(".floating-skills");
    if (!container) return;

    // Time-based animation
    const delta = (currentTime - lastUpdate) / 16; // Normalize to 60fps
    lastUpdate = currentTime;

    x += dx * delta;
    y += dy * delta;

    // Responsive boundaries
    const bounds = container.getBoundingClientRect();
    if (x <= 0 || x >= bounds.width - 80) dx = -dx;
    if (y <= 0 || y >= bounds.height - 80) dy = -dy;

    // Keep within bounds
    x = Math.max(0, Math.min(x, bounds.width - 80));
    y = Math.max(0, Math.min(y, bounds.height - 80));

    element.style.left = `${x}px`;
    element.style.top = `${y}px`;

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Responsive scroll handling
function initScrollHandling() {
  let ticking = false;
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");

  function updateActiveSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${section.id}`) {
            link.classList.add("active");
          }
        });
      }
    });
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateActiveSection);
      ticking = true;
    }
  });
}

// Responsive form handling
function initFormHandling() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const inputs = form.querySelectorAll("input, textarea");

  inputs.forEach(input => {
    // Add touch device support
    input.addEventListener("focus", () => {
      input.classList.add("focused");
    });

    input.addEventListener("blur", () => {
      if (!input.value) {
        input.classList.remove("focused");
      }
    });
  });

  // Enhanced form submission
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = "Sending...";

    try {
      // Add your form submission logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert("Thank you for your message! I will get back to you soon.");
      form.reset();
    } catch (error) {
      alert(
        "Sorry, there was an error sending your message. Please try again."
      );
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = "Send Message";
    }
  });
}

// Window resize handler
function handleResize() {
  let resizeTimeout;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      createFloatingSkills(); // Recreate skills with new layout
    }, 250);
  });
}

// Certification slider functionality
function initCertificationSlider() {
  const slider = document.querySelector(".certification-slider");
  const prevBtn = document.querySelector(".slider-arrow.prev");
  const nextBtn = document.querySelector(".slider-arrow.next");

  if (!slider || !prevBtn || !nextBtn) return;

  const cardWidth = slider.querySelector(".certification-card").offsetWidth;
  const gap = 32; // 2rem gap
  const scrollAmount = cardWidth + gap;
  let autoplayInterval;

  function updateArrowVisibility() {
    prevBtn.style.opacity = slider.scrollLeft <= 0 ? "0.5" : "1";
    nextBtn.style.opacity =
      slider.scrollLeft >= slider.scrollWidth - slider.offsetWidth - 1
        ? "0.5"
        : "1";
  }

  function nextSlide() {
    if (slider.scrollLeft >= slider.scrollWidth - slider.offsetWidth - 1) {
      // If we're at the end, scroll back to start
      slider.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    } else {
      slider.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }

  function prevSlide() {
    slider.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  }

  // Start autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 3000); // Rotate every 3 seconds
  }

  // Stop autoplay
  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Add event listeners
  prevBtn.addEventListener("click", () => {
    prevSlide();
    stopAutoplay();
    startAutoplay(); // Reset the timer
  });

  nextBtn.addEventListener("click", () => {
    nextSlide();
    stopAutoplay();
    startAutoplay(); // Reset the timer
  });

  // Pause autoplay when hovering over the slider
  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);

  // Pause autoplay when touching on mobile
  slider.addEventListener("touchstart", stopAutoplay);
  slider.addEventListener("touchend", startAutoplay);

  slider.addEventListener("scroll", updateArrowVisibility);
  window.addEventListener("resize", updateArrowVisibility);

  // Initial setup
  updateArrowVisibility();
  startAutoplay();

  // Clean up on page visibility change
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });
}

// Initialize everything when the page loads
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileMenu();
  createFloatingSkills();
  initScrollHandling();
  initFormHandling();
  handleResize();
  initGitHubStats();
  initCertificationSlider();

  // Prevent transitions on load
  document.body.classList.add("no-transition");
  requestAnimationFrame(() => {
    document.body.classList.remove("no-transition");
  });
});

// Add smooth scrolling with offset for fixed header
document.querySelectorAll("nav a").forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const section = document.querySelector(this.getAttribute("href"));
    const headerOffset = document.querySelector("nav").offsetHeight;
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  });
});

// Add this to your existing JavaScript
function initGitHubStats() {
  const githubContainer = document.querySelector(".github-container");
  if (!githubContainer) return;

  // Add loading state
  const images = githubContainer.querySelectorAll("img");
  images.forEach(img => {
    img.style.opacity = "0";
    const skeleton = document.createElement("div");
    skeleton.className = "loading-skeleton";
    img.parentNode.insertBefore(skeleton, img);

    img.onload = () => {
      img.style.opacity = "1";
      skeleton.remove();
    };
  });
}
