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

  codeContent = document.querySelector('.code-content code');
  monitorContainer = document.querySelector('.monitor-container');
  isHovered = false;
  currentQuery = 0;

  const queries = [
    {
      prompt: 'chirag@portfolio:~$ ',
      command: 'SELECT * FROM developer_profile;',
      result: `
-- Basic Information
+---------------+--------------------------------+
| name          | Chirag Kottary                 |
| role          | Full Stack RPG Developer       |
| experience    | 1+ years                       |
| projects      | 10+                            |
| clients       | 2+                             |
+---------------+--------------------------------+`
    },
    {
      prompt: 'chirag@portfolio:~$ ',
      command: 'SELECT * FROM skills;',
      result: `
-- Technical Skills
+----------------+--------------------------------+
| category       | technologies                   |
+----------------+--------------------------------+
| Languages      | Java, JavaScript, TypeScript,  |
|                | HTML/CSS                       |
| Frameworks/DB  | React, Node.js, Express, Hono, |
|                | Recoil, PostgreSQL, MySQL,     |
|                | Prisma ORM, MongoDB, Tailwind, |
|                | Material-UI                    |
| Dev Tools      | Git, GitHub, VS Code,         |
|                | PyCharm, IntelliJ, Eclipse    |
+----------------+--------------------------------+`
    }
  ];

  let isTyping = false;

  // Typing animation function
  async function typeText(text, element, className = '') {
    if (isHovered) return;
    
    for (let char of text) {
      if (isHovered) break;
      
      if (className) {
        const span = document.createElement('span');
        span.className = className;
        span.textContent = char;
        element.appendChild(span);
      } else {
        element.insertAdjacentText('beforeend', char);
      }
      
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  // Display query result
  async function showQueryResult(result) {
    if (isHovered) return;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!isHovered) {
      const resultElement = document.createElement('pre');
      resultElement.className = 'result';
      resultElement.textContent = result;
      codeContent.appendChild(resultElement);
      
      // Scroll to bottom
      codeContent.parentElement.scrollTop = codeContent.parentElement.scrollHeight;
    }
  }

  // Main animation loop
  async function animateQueries() {
    while (true) {
      if (isHovered) {
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }

      const query = queries[currentQuery];
      
      // Create new line with prompt
      const line = document.createElement('div');
      line.className = 'command-line';
      codeContent.appendChild(line);
      
      // Type prompt
      await typeText(query.prompt, line, 'prompt');
      
      // Type command
      await typeText(query.command, line, 'command');
      
      // Show result
      await showQueryResult(query.result);
      
      // Move to next query
      currentQuery = (currentQuery + 1) % queries.length;
      
      // Pause between queries
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear terminal if we're back to the first query
      if (currentQuery === 0 && !isHovered) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        codeContent.innerHTML = '';
      }
    }
  }

  // Add hover listeners
  monitorContainer.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  monitorContainer.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  // Start animation
  animateQueries();

  // Add screen flicker effect
  function addScreenFlicker() {
    const monitor = document.querySelector('.monitor-screen');
    setInterval(() => {
      if (!isHovered && Math.random() < 0.1) {
        monitor.style.opacity = '0.8';
        setTimeout(() => {
          monitor.style.opacity = '1';
        }, 50);
      }
    }, 5000);
  }

  addScreenFlicker();

  let currentInput = '';
  let commandHistory = [];
  let historyIndex = -1;

  const availableCommands = {
    'help': () => `
Available commands:
+----------------+--------------------------------+
| Command        | Description                    |
+----------------+--------------------------------+
| help          | Show available commands         |
| about         | Display developer profile       |
| skills        | List technical skills          |
| experience    | Show work experience           |
| projects      | View project portfolio         |
| contact       | Get contact information        |
| github        | Show GitHub statistics         |
| clear         | Clear terminal screen          |
+----------------+--------------------------------+`,
    
    'about': async () => {
      const profile = `
-- Developer Profile
+---------------+--------------------------------+
| Name          | Chirag Kottary                 |
| Role          | Full Stack RPG Developer       |
| Experience    | 1+ years                       |
| Projects      | 10+                            |
| Clients       | 2+                             |
+---------------+--------------------------------+

Type 'skills' to view technical expertise
Type 'projects' to see my work`;
      
      await typeText(profile);
      return '';
    },
    
    'skills': async () => {
      const skills = `
-- Technical Skills
+----------------+--------------------------------+
| Category       | Technologies                   |
+----------------+--------------------------------+
| Languages      | Java, JavaScript, TypeScript,  |
|                | HTML/CSS                       |
| Frameworks/DB  | React, Node.js, Express, Hono, |
|                | Recoil, PostgreSQL, MySQL,     |
|                | Prisma ORM, MongoDB, Tailwind, |
|                | Material-UI                    |
| Dev Tools      | Git, GitHub, VS Code,         |
|                | PyCharm, IntelliJ, Eclipse    |
+----------------+--------------------------------+

Type 'experience' to see where I've applied these skills`;
      
      await typeText(skills);
      return '';
    },
    
    'experience': async () => {
      const exp = `
-- Work Experience
+----------------+--------------------------------+
| Company        | Hirademy Technologies         |
| Role          | Software Development Engineer   |
| Period        | Mar. 2024 – Sep. 2024          |
| Location      | Bangalore - Remote             |
+----------------+--------------------------------+
• Migrated frontend to React
• Developed OAuth systems
• Led team of 3 interns

+----------------+--------------------------------+
| Company        | Effinity                      |
| Role          | Junior Developer Intern        |
| Period        | Nov. 2022 - May. 2023         |
| Location      | Mangalore - OnSite            |
+----------------+--------------------------------+
• Improved software stability
• Built ReactJS components
• Created WhatsApp chatbot`;
      
      await typeText(exp);
      return '';
    },

    'projects': async () => {
      const projects = `
-- Recent Projects
+----------------+--------------------------------+
| Project        | Description                    |
+----------------+--------------------------------+
| Madhyamam      | • Content publishing platform  |
|                | • Built with React & Node.js   |
|                | • Improved user engagement     |
+----------------+--------------------------------+
| Payment App    | • Secure transaction system    |
|                | • Integrated multiple gateways |
|                | • Enhanced user security       |
+----------------+--------------------------------+
| RTO System     | • Vehicle registration manager |
|                | • Streamlined processes        |
|                | • Reduced processing time      |
+----------------+--------------------------------+`;
      
      await typeText(projects);
      return '';
    },

    'contact': async () => {
      const contact = `
-- Contact Information
+----------------+--------------------------------+
| Method         | Detail                         |
+----------------+--------------------------------+
| Email         | chiragkottary@gmail.com        |
| LinkedIn      | linkedin.com/in/chiragkottary  |
| GitHub        | github.com/ChiragKottary       |
| Location      | Mangalore, Karnataka           |
+----------------+--------------------------------+

Feel free to reach out!`;
      
      await typeText(contact);
      return '';
    },

    'clear': () => {
      codeContent.innerHTML = '';
      return '';
    },

    'github': async () => {
      const github = `
Fetching GitHub statistics...

• Username: ChiragKottary
• Repositories: 10+
• Main languages: JavaScript, Java, TypeScript
• Active contributor

Visit: github.com/ChiragKottary for more details`;
      
      await typeText(github);
      return '';
    }
  };

  async function typeText(text, speed = 10) {
    if (isTyping) return text;
    isTyping = true;
    
    const output = document.createElement('pre');
    output.className = 'result';
    codeContent.appendChild(output);
    
    const lines = text.split('\n');
    for (let line of lines) {
      output.textContent += line + '\n';
      await new Promise(resolve => setTimeout(resolve, speed));
      scrollToBottom();
    }
    
    isTyping = false;
    return '';
  }

  // Create new command line
  function createCommandLine() {
    const line = document.createElement('div');
    line.className = 'command-line';
    const prompt = document.createElement('span');
    prompt.className = 'prompt';
    prompt.textContent = 'chirag@portfolio:~$ ';
    line.appendChild(prompt);
    const input = document.createElement('span');
    input.className = 'current-input';
    line.appendChild(input);
    codeContent.appendChild(line);
    return input;
  }

  // Handle command execution
  async function executeCommand(cmd) {
    const command = cmd.trim().toLowerCase();
    if (command) {
      commandHistory.push(command);
      historyIndex = commandHistory.length;
      
      if (availableCommands[command]) {
        const result = await availableCommands[command]();
        if (result) {
          const output = document.createElement('pre');
          output.className = 'result';
          output.textContent = result;
          codeContent.appendChild(output);
        }
      } else {
        const error = document.createElement('div');
        error.className = 'error';
        error.textContent = `Command not found: ${command}. Type 'help' for available commands.`;
        codeContent.appendChild(error);
      }
    }
    currentInput = '';
    createCommandLine();
    scrollToBottom();
  }

  function scrollToBottom() {
    const scrollContainer = codeContent.parentElement;
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }

  function initTerminal() {
    codeContent.innerHTML = '';
    typeText(`
Welcome to Chirag's Portfolio Terminal
Type 'help' for available commands.
`);
    createCommandLine();
  }

  // Add visual focus indicator
  monitorContainer.addEventListener('mouseenter', () => {
    monitorContainer.classList.add('focused');
  });

  monitorContainer.addEventListener('mouseleave', () => {
    if (document.activeElement !== hiddenInput) {
      monitorContainer.classList.remove('focused');
    }
  });

  // Initialize
  initTerminal();
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

// Initialize EmailJS
(function() {
  emailjs.init("uII5gZ5SVHh2I7as1");
})();

// Alert function
function showAlert(message, type) {
  const alertContainer = document.querySelector('.alert-container');
  const alert = document.createElement('div');
  alert.className = `alert ${type}`;
  
  const icon = type === 'success' 
    ? '<i class="fas fa-check-circle"></i>' 
    : '<i class="fas fa-exclamation-circle"></i>';
  
  alert.innerHTML = `${icon}${message}`;
  alertContainer.appendChild(alert);

  setTimeout(() => {
    alert.classList.add('fade-out');
    setTimeout(() => {
      alert.remove();
    }, 500);
  }, 3000);
}

// Contact form handler
window.sendMail = async function(event) {
  event.preventDefault();

  const submitBtn = document.getElementById('submit-btn');
  const buttonText = submitBtn.querySelector('.button-text');
  const form = document.getElementById('contact-form');

  submitBtn.classList.add('loading');
  buttonText.textContent = 'Sending...';
  submitBtn.disabled = true;

  const templateParams = {
    from_name: form.name.value,
    from_email: form.email.value,
    message: form.message.value,
  };

  try {
    await emailjs.send(
      'service_x8hfw5q',
      'template_wx2aucg',
      templateParams
    );

    submitBtn.classList.remove('loading');
    submitBtn.classList.add('success');
    buttonText.textContent = 'Message Sent!';
    showAlert('Message sent successfully!', 'success');
    form.reset();

    setTimeout(() => {
      submitBtn.classList.remove('success');
      submitBtn.disabled = false;
      buttonText.textContent = 'Send Message';
    }, 3000);

  } catch (error) {
    console.error('Failed to send email:', error);
    submitBtn.classList.remove('loading');
    submitBtn.classList.add('error');
    buttonText.textContent = 'Failed to Send';
    showAlert('Failed to send message. Please try again.', 'error');

    setTimeout(() => {
      submitBtn.classList.remove('error');
      submitBtn.disabled = false;
      buttonText.textContent = 'Send Message';
    }, 3000);
  }

  return false;
};
