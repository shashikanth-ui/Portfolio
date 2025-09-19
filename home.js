/* ---------- Existing Globals & helpers ---------- */
const rand = (min, max) => Math.random() * (max - min) + min;

/* ---------- Binary rain ---------- */
const canvas = document.getElementById("binary-canvas");
const ctx = canvas.getContext("2d");
let cw = canvas.width = innerWidth;
let ch = canvas.height = innerHeight;

window.addEventListener("resize", () => {
  cw = canvas.width = innerWidth;
  ch = canvas.height = innerHeight;
  initBinary();
});

let columns = 0, drops = [], fontSize = 14;
let binaryFrameId;

function initBinary() {
  fontSize = Math.max(12, Math.floor(Math.min(cw, ch) * 0.015));
  columns = Math.floor(cw / fontSize);
  drops = new Array(columns).fill(1);
}
initBinary();

const chars = "01";

function drawBinary() {
  ctx.fillStyle = "rgba(26,26,46,0.06)";
  ctx.fillRect(0, 0, cw, ch);
  ctx.fillStyle = "#3d4f6b";
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < columns; i++) {
    const text = chars.charAt(Math.floor(Math.random() * chars.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > ch && Math.random() > 0.975) drops[i] = 0;
    drops[i] += rand(0.6, 1.6);
  }

  binaryFrameId = requestAnimationFrame(drawBinary);
}

binaryFrameId = requestAnimationFrame(drawBinary);

/* ---------- Glitch sequencing (kept intact) ---------- */
window.addEventListener("load", () => {
  const overlay = document.getElementById("glitchOverlay");
  const noise = document.getElementById("noise");
  const rgb = document.getElementById("rgbLayer");
  const tears = document.getElementById("tears");
  const access = document.getElementById("accessText");
  const main = document.getElementById("mainContent");

  function quickRGBPulse(duration = 250, op = 0.28) {
    rgb.style.opacity = op;
    rgb.style.transition = `opacity ${duration}ms linear`;
    setTimeout(() => { rgb.style.opacity = 0; }, duration);
    rgb.style.transform = `translateX(${Math.round(rand(-8,8))}px)`;
    setTimeout(() => { rgb.style.transform = ""; }, duration + 30);
  }

  function makeTearBurst(count = 6) {
    for (let i = 0; i < count; i++) {
      const w = rand(60, Math.min(600, innerWidth * 0.6));
      const h = rand(6, 30);
      const left = rand(0, innerWidth - w);
      const top = rand(0, innerHeight);
      const tear = document.createElement("div");
      tear.className = "tear";
      tear.style.left = `${left}px`;
      tear.style.top = `${top}px`;
      tear.style.width = `${w}px`;
      tear.style.height = `${h}px`;
      const tcol = Math.random() < 0.5 
        ? "linear-gradient(90deg,#00ffea55,#00ff66)" 
        : "linear-gradient(90deg,#ff00a255,#ffffff55)";
      tear.style.background = tcol;
      tears.appendChild(tear);
      setTimeout(() => tear.remove(), 600);
    }
  }

  function cameraShake(ms = 260) {
    const el = document.body;
    el.style.transition = `transform ${ms}ms cubic-bezier(.2,.9,.2,1)`;
    el.style.transform = `translate(${rand(-10,10)}px, ${rand(-6,6)}px) rotate(${rand(-0.6,0.6)}deg)`;
    setTimeout(() => { el.style.transform = ""; el.style.transition = ""; }, ms);
  }

  // Sequence
  setTimeout(() => {
    noise.style.opacity = 0.16;
    quickRGBPulse(220, 0.22);
    makeTearBurst(8);
    cameraShake(260);
  }, 160);

  setTimeout(() => {
    noise.style.opacity = 0.22;
    access.classList.add("glitching");
    access.style.opacity = 1;
    access.classList.add("jitter");
  }, 700);

  setTimeout(() => {
    quickRGBPulse(120, 0.45);
    makeTearBurst(12);
    cameraShake(320);
    noise.style.opacity = 0.36;
    setTimeout(() => noise.style.opacity = 0.16, 200);
  }, 1500);

  setTimeout(() => {
    access.classList.remove("jitter");
    access.classList.remove("glitching");
    const flickerTimes = [0, 80, 160, 260];
    flickerTimes.forEach((t) => {
      setTimeout(() => {
        access.classList.add("glitching");
        setTimeout(() => access.classList.remove("glitching"), 80);
      }, t + 1900);
    });
  }, 1900);

  setTimeout(() => {
    quickRGBPulse(200, 0.7);
    noise.style.opacity = 0.6;
    makeTearBurst(20);
    cameraShake(420);
    const flash = document.createElement("div");
    flash.style.position = "absolute";
    flash.style.inset = "0";
    flash.style.background = "#fff";
    flash.style.opacity = "0.06";
    flash.style.zIndex = 200;
    overlay.appendChild(flash);
    setTimeout(() => flash.remove(), 140);
    overlay.classList.add("blur-burst");
    setTimeout(() => overlay.classList.remove("blur-burst"), 500);
  }, 2350);

  // Reveal & stop binary rain
  setTimeout(() => {
    overlay.style.transition = "opacity 900ms cubic-bezier(.2,.9,.2,1)";
    overlay.style.opacity = 0;
    noise.style.opacity = 0;
    rgb.style.opacity = 0;
    main.style.opacity = 1;
    main.setAttribute("aria-hidden", "false");
    access.style.opacity = 0;

    // Stop binary rain
    cancelAnimationFrame(binaryFrameId);

    // clear canvas to dark background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, cw, ch);

    setTimeout(() => overlay.remove(), 1200);
  }, 3000);

  // ---- initialize terminal after reveal ----
  setTimeout(() => {
    try { initTerminalSystem(); } catch (e) { console.error(e); }
  }, 3400);
});

/* ---------- Terminal system (UPDATED - FIX 2 & FAKE COMMANDS) ---------- */
function initTerminalSystem() {
  // Elements
  const cmdInput = document.getElementById("cmdInput");
  const terminalOutput = document.getElementById("terminalOutput");
  const promptText = document.getElementById("promptText");
  const tabsBar = document.getElementById("tabsBar");
  const tabAdd = document.getElementById("tabAdd");
  const terminalPanel = document.querySelector(".terminal-panel");
  const verticalEmail = document.getElementById("verticalEmail");
  const navButtons = document.querySelectorAll(".nav-btn");
  const heroSection = document.getElementById("heroSection");



  // Focus behavior
  function focusInput() {
    cmdInput.focus();
  }

  // Terminal state
  const state = {
    tabs: {
      "tab-terminal": {
        id: "tab-terminal",
        name: "Terminal",
        contentEl: document.getElementById("tab-terminal"),
        isActive: true
      }
    },
    nextTabIndex: 1,
    history: [],
    prompt: promptText.textContent || "guest@PillalaShashikanth:~$",
    currentDirectory: "~"
  };

  // Sequential tab order for + button
  const tabSequence = ['about', 'experience', 'work', 'contact'];
  let currentTabSequenceIndex = 0;

  // FORMATTED INITIAL TEXT - INSPIRATION MATCH
  const initialText = `This is a Fully Interactive Portfolio Page with a Linux Inspired Terminal

To Use the Portfolio Either <span class="highlight">use the navigation</span> Or <span class="highlight">explore the terminal</span>
To Begin, Type:

        <span class="command-bracket">[1]</span> or <span class="command-text">[open aboutMe]</span>: Opens about me
        <span class="command-bracket">[2]</span> or <span class="command-text">[open experience]</span>: Opens my previous work experience
        <span class="command-bracket">[3]</span> or <span class="command-text">[open work]</span>: Opens my projects on GitHub
        <span class="command-bracket">[4]</span> or <span class="command-text">[open contactMe]</span>: Runs contact me program in terminal`;

  // FIX 2: HELPER FUNCTION TO ADD GREEN PROMPT TO ALL OUTPUTS
  function addPromptToOutput(text) {
    const lines = text.split('\n');
    const promptedLines = lines.map(line => {
      if (line.trim() === '') return line;
      return `<span style="color: #00ff88;">${state.prompt}</span> ${line}`;
    });
    return promptedLines.join('\n');
  }

  // Typewriter function with HTML formatting
  function typeText(targetEl, text, speed = 15, cb) {
    let i = 0;
    targetEl.innerHTML = "";
    
    const tick = () => {
      if (i < text.length) {
        targetEl.innerHTML = text.substring(0, i + 1);
        i++;
        targetEl.scrollTop = targetEl.scrollHeight;
        setTimeout(tick, speed);
      } else {
        if (cb) cb();
      }
    };
    tick();
  }

  // Create new tab function
  function createOrSwitchTab(key, title, contentHtml) {
    const tabId = `tab-${key}`;

    if (state.tabs[tabId]) {
      switchToTab(tabId);
      return;
    }

    // create tab button
    const tabItem = document.createElement("div");
    tabItem.className = "tab-item";
    tabItem.setAttribute("data-tabid", tabId);
    tabItem.setAttribute("role", "tab");
    tabItem.innerHTML = `<span class="tab-title">${escapeHtml(title)}</span><button class="tab-close" title="Close tab" data-tabid="${tabId}">×</button>`;
    tabsBar.insertBefore(tabItem, tabAdd);

    // create content panel
    const panel = document.createElement("div");
    panel.className = "tab-content";
    panel.id = tabId;
    panel.setAttribute("data-tabname", title);
    panel.innerHTML = contentHtml;

    terminalPanel.appendChild(panel);

    // register
    state.tabs[tabId] = {
      id: tabId,
      name: title,
      contentEl: panel,
      tabEl: tabItem,
      isActive: false
    };

    // attach events
    tabItem.addEventListener("click", () => switchToTab(tabId));
    const closeBtn = tabItem.querySelector(".tab-close");
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeTab(tabId);
    });

    switchToTab(tabId);
  }

  function switchToTab(tabId) {
    // deactivate all tab items and contents
    Object.values(state.tabs).forEach((t) => {
      if (t.tabEl) t.tabEl.classList.remove("active");
      if (t.contentEl) t.contentEl.classList.remove("active");
      t.isActive = false;
    });

    // activate requested
    const t = state.tabs[tabId];
    if (!t) return;
    
    if (!t.tabEl) {
      t.tabEl = document.querySelector(`.tab-item[data-tabid="${tabId}"]`);
    }
    
    if (t.tabEl) t.tabEl.classList.add("active");
    if (t.contentEl) {
      t.contentEl.classList.add("active");
      t.contentEl.scrollTop = 0;
    }
    t.isActive = true;

    // Show/hide hero section only for terminal tab
    if (tabId === "tab-terminal") {
      if (heroSection) heroSection.style.display = "block";
    } else {
      if (heroSection) heroSection.style.display = "none";
    }

    focusInput();
  }

  function closeTab(tabId) {
    if (tabId === "tab-terminal") return;

    const t = state.tabs[tabId];
    if (!t) return;

    // remove DOM
    if (t.tabEl && t.tabEl.parentNode) t.tabEl.parentNode.removeChild(t.tabEl);
    if (t.contentEl && t.contentEl.parentNode) t.contentEl.parentNode.removeChild(t.contentEl);

    // delete state
    delete state.tabs[tabId];

    // Reset sequence index when tabs are closed
    updateTabSequenceIndex();

    // switch to terminal
    switchToTab("tab-terminal");
  }

  // Update tab sequence index based on open tabs
  function updateTabSequenceIndex() {
    // Find the first tab in sequence that's not open
    for (let i = 0; i < tabSequence.length; i++) {
      const tabId = `tab-${tabSequence[i]}`;
      if (!state.tabs[tabId]) {
        currentTabSequenceIndex = i;
        return;
      }
    }
    // If all tabs are open, reset to 0
    currentTabSequenceIndex = 0;
  }

  // Sequential tab opening function
  function openNextSequentialTab() {
    // Check if all tabs are already open
    const allTabsOpen = tabSequence.every(key => state.tabs[`tab-${key}`]);
    if (allTabsOpen) {
      appendOutput(`<span style="color: #00ff88;">${state.prompt}</span> All tabs are already open!\n`);
      return;
    }

    // Find the next unopened tab
    const nextKey = tabSequence[currentTabSequenceIndex];
    const tabMappings = {
      'about': { title: 'About', content: getAboutContent() },
      'experience': { title: 'Experience', content: getExperienceContent() },
      'work': { title: 'Work', content: getWorkContent() },
      'contact': { title: 'Contact', content: getContactContent() }
    };

    if (nextKey && tabMappings[nextKey]) {
      createOrSwitchTab(nextKey, tabMappings[nextKey].title, tabMappings[nextKey].content);
      currentTabSequenceIndex = (currentTabSequenceIndex + 1) % tabSequence.length;
      updateTabSequenceIndex();
    }
  }

  // Escape HTML helper
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // FIX 2: FAKE TERMINAL COMMANDS
  function handleFakeCommands(cmd) {
  const lc = cmd.toLowerCase().trim();
  
  switch(lc) {
    case 'ls':
      return `<span style="color: #ffdd44;">about.txt</span>  <span style="color: #ffdd44;">experience.txt</span>  <span style="color: #ffdd44;">projects.txt</span>  <span style="color: #ffdd44;">contact.txt</span>
<span style="color: #00ff88;">Documents/</span>  <span style="color: #00ff88;">Pictures/</span>  <span style="color: #00ff88;">Videos/</span>`;

    case 'pwd':
      return `/home/guest`;

    case 'whoami':
      return `guest`;

    case 'date':
      const now = new Date();
      return `${now.toDateString()} ${now.toTimeString()}`;

    case 'uname':
    case 'uname -a':
      return `Linux portfolio 5.15.0-portfolio #1 SMP Portfolio x86_64 GNU/Linux`;

    case 'clear':
      const instructionText = `This is a Fully Interactive Portfolio Page with a Linux Inspired Terminal


To Use the Portfolio Either <span class="highlight">use the navigation</span> Or <span class="highlight">explore the terminal</span>
To Begin, Type:


        <span class="command-bracket">[1]</span> or <span class="command-text">[open aboutMe]</span>: Opens about me
        <span class="command-bracket">[2]</span> or <span class="command-text">[open experience]</span>: Opens my previous work experience
        <span class="command-bracket">[3]</span> or <span class="command-text">[open work]</span>: Opens my projects on GitHub
        <span class="command-bracket">[4]</span> or <span class="command-text">[open contactMe]</span>: Runs contact me program in terminal`;
      
      terminalOutput.innerHTML = instructionText + '\n\n';
      return '';


      case 'cat about.txt':
        return `<span style="color: #00ff88;">${state.prompt}</span> cat about.txt
Full-Stack Developer with expertise in web technologies, AI, and VR development.
Currently seeking new opportunities to contribute to innovative projects.`;

      case 'cat experience.txt':
        return `<span style="color: #00ff88;">${state.prompt}</span> cat experience.txt
- Full-Stack Development
- VR Development
- AI Integration`;

      case 'cat projects.txt':
        return `<span style="color: #00ff88;">${state.prompt}</span> cat projects.txt
- Interactive Portfolio
- Web Applications  
- VR Projects`;

      case 'cat contact.txt':
        return `<span style="color: #00ff88;">${state.prompt}</span> cat contact.txt
Email: pillalashashikanth1@gmail.com
Portfolio: Interactive Terminal Interface`;

      case 'echo hello':
        return `<span style="color: #00ff88;">${state.prompt}</span> echo hello
hello`;

      case 'ps':
        return `<span style="color: #00ff88;">${state.prompt}</span> ps
  PID TTY          TIME CMD
 1234 pts/0    00:00:01 portfolio
 5678 pts/0    00:00:00 terminal`;

      case 'history':
        let histOutput = `<span style="color: #00ff88;">${state.prompt}</span> history\n`;
        state.history.forEach((h, i) => {
          histOutput += `${i + 1}  ${h}\n`;
        });
        return histOutput;

      default:
        return null;
    }
  }

  // FIX 2: UPDATED COMMAND HANDLING WITH FAKE COMMANDS AND GREEN PROMPTS
function handleCommand(raw) {
  const cmd = (raw || "").trim();
  if (!cmd) {
    return;
  }

  state.history.push(cmd);
  const lc = cmd.toLowerCase();

  // ALWAYS show the command with prompt first
  appendOutput(`<span style="color: #00ff88;">${state.prompt}</span> ${cmd}\n`);

  // Check for fake terminal commands first
  const fakeOutput = handleFakeCommands(cmd);
  if (fakeOutput !== null) {
    if (fakeOutput !== '') {
      // Remove the prompt from fake output since we already added it above
      const cleanOutput = fakeOutput.replace(`<span style="color: #00ff88;">${state.prompt}</span> ${cmd}\n`, '');
      appendOutput(cleanOutput + '\n');
    }
    return;
  }

  // Handle portfolio commands (remove the prompt lines from these since we added it above)
  if (lc === "1" || lc === "open aboutme" || lc === "open about" || lc === "aboutme") {
    createOrSwitchTab("about", "About", getAboutContent());
  } else if (lc === "2" || lc === "open experience" || lc === "experience") {
    createOrSwitchTab("experience", "Experience", getExperienceContent());
  } else if (lc === "3" || lc === "open work" || lc === "work" || lc === "projects") {
    createOrSwitchTab("work", "Work", getWorkContent());
  } else if (lc === "4" || lc === "open contactme" || lc === "open contact" || lc === "contactme") {
    createOrSwitchTab("contact", "Contact", getContactContent());
  } else if (lc === "help") {
    appendOutput(`<span style="color: #ffdd44;">Portfolio Commands:</span>
1,2,3,4 | open aboutMe|open experience|open work|open contactMe

<span style="color: #ffdd44;">Terminal Commands:</span>
ls, pwd, whoami, date, uname, clear, cat, echo, ps, history, help
`);
  } else {
    appendOutput(`<span style="color: #ff6b6b;">Command not found:</span> ${escapeHtml(cmd)}
Type 'help' for list of commands.
`);
  }
}

  function appendOutput(text) {
  terminalOutput.innerHTML += text;
  
  // Move input row right after the new content
  const inputRow = document.getElementById('inputRow');
  const commandSection = document.querySelector('.command-section');
  
  if (inputRow && commandSection) {
    commandSection.appendChild(inputRow);
  }
  
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}




  // Content functions - NO name/role in other tabs
  function getAboutContent() {
    return `
      <div style="padding:20px; color:#ffffff; font-family:'Twemoji Country Flags', '2 Lines Regular', monospace; font-size:10px; line-height:1.6; ">
        <h2 style="color:#ff4d9f; font-size:16px; margin-bottom:20px;">About Me</h2>
        <p style="margin-bottom:16px;">Hello! I'm a passionate Full-Stack Developer with expertise in web technologies, AI, and VR development.</p>
        <p style="margin-bottom:16px;">I specialize in creating interactive web experiences and building modern applications using cutting-edge technologies.</p>
        <p style="color:#00ff88; margin-bottom:16px;">Currently seeking new opportunities to apply my skills and contribute to innovative projects.</p>
        <div style="margin-top:20px;">
          <h3 style="color:#ffdd44; font-size:12px; margin-bottom:12px;">Skills & Technologies</h3>
          <p style="margin-bottom:8px;">• Frontend: React, Vue.js, HTML5, CSS3, JavaScript</p>
          <p style="margin-bottom:8px;">• Backend: Node.js, Python, Express, FastAPI</p>
          <p style="margin-bottom:8px;">• Databases: MongoDB, PostgreSQL, MySQL</p>
          <p style="color:#00ff88;">• Tools: Git, Docker, AWS, Linux</p>
        </div>
      </div>
    `;
  }

  function getExperienceContent() {
    return `
      <div style="padding:20px; color:#ffffff; font-family:'Twemoji Country Flags', '2 Lines Regular', monospace; font-size:10px; line-height:1.6; ">
        <h2 style="color:#ff4d9f; font-size:16px; margin-bottom:20px;">Experience</h2>
        <div style="margin-bottom:20px;">
          <h3 style="color:#ffdd44; font-size:12px; margin-bottom:8px;">Full-Stack Development</h3>
          <p style="margin-bottom:12px;">Frontend & Backend development with modern frameworks and technologies.</p>
          <p style="margin-bottom:12px;">Built responsive web applications, RESTful APIs, and database systems.</p>
        </div>
        <div style="margin-bottom:20px;">
          <h3 style="color:#ffdd44; font-size:12px; margin-bottom:8px;">VR Development</h3>
          <p style="margin-bottom:12px;">Creating immersive VR experiences and interactive prototypes.</p>
          <p style="margin-bottom:12px;">Working with Unity, Unreal Engine, and WebXR technologies.</p>
        </div>
        <div>
          <h3 style="color:#ffdd44; font-size:12px; margin-bottom:8px;">AI Integration</h3>
          <p style="margin-bottom:12px;">Building AI-powered applications and implementing machine learning solutions.</p>
          <p style="color:#00ff88;">Experience with TensorFlow, PyTorch, and various AI APIs.</p>
        </div>
      </div>
    `;
  }

  function getWorkContent() {
    return `
      <div style="padding:20px; color:#ffffff; font-family:'Twemoji Country Flags', '2 Lines Regular', monospace; font-size:10px; line-height:1.6; ">
        <h2 style="color:#ff4d9f; font-size:16px; margin-bottom:20px;">Projects</h2>
        <div style="margin-bottom:20px;">
          <h3 style="color:#ffdd44; font-size:12px; margin-bottom:8px;">Interactive Portfolio</h3>
          <p style="margin-bottom:12px;">Linux-inspired terminal interface with dynamic tabs and command processing.</p>
          <p style="margin-bottom:12px;">Built with vanilla JavaScript, CSS Grid, and modern web technologies.</p>
        </div>
        <div style="margin-bottom:20px;">
          <h3 style="color:#ffdd44; font-size:12px; margin-bottom:8px;">Web Applications</h3>
          <p style="margin-bottom:12px;">Modern responsive web applications with cutting-edge technologies.</p>
          <p style="margin-bottom:12px;">Full-stack projects using React, Node.js, and database integration.</p>
        </div>
        <div style="margin-bottom:20px;">
          <h3 style="color:#ffdd44; font-size:12px; margin-bottom:8px;">VR Projects</h3>
          <p style="margin-bottom:12px;">Immersive virtual reality experiences and interactive environments.</p>
          <p style="margin-bottom:12px;">Developed using Unity 3D and Unreal Engine with VR SDKs.</p>
        </div>
        <p style="color:#00ff88; margin-top:20px; padding-top:16px; border-top:1px solid rgba(0,255,136,0.2);">
          Visit my GitHub: <a href="https://github.com/ShashikanthPillala" style="color:#ffdd44; text-decoration:underline;">github.com/ShashikanthPillala</a>
        </p>
      </div>
    `;
  }

  function getContactContent() {
    return `
      <div class="contact-form">
        <h2 class="contact-heading">Contact Me</h2>
        <p class="contact-subtitle">If you have a question or simply want to say hello.</p>
        
        <form id="contactForm">
          <div class="form-group">
            <input type="email" class="form-input" name="email" placeholder="Your Email" required>
          </div>
          <div class="form-group">
            <input type="text" class="form-input" name="subject" placeholder="What You Want to Talk About" required>
          </div>
          <div class="form-group">
            <textarea class="form-textarea" name="message" placeholder="Your message here..." required></textarea>
          </div>
          <button type="submit" class="submit-btn">Submit</button>
        </form>
      </div>
    `;
  }

  // Handle contact form submission
  function setupContactForm() {
    document.addEventListener('submit', function(e) {
      if (e.target && e.target.id === 'contactForm') {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Create mailto link
        const mailtoLink = `mailto:pillalashashikanth1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${email}\n\n${message}`)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        appendOutput(`<span style="color: #00ff88;">${state.prompt}</span> Contact form submitted! Opening your email client...\n`);
        
        // Reset form
        e.target.reset();
      }
    });
  }

  // Input handling
  cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = cmdInput.value;
      handleCommand(val);
      cmdInput.value = "";
    }
  });

  // Navigation buttons
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cmd = btn.getAttribute("data-cmd");
      handleCommand(cmd);
    });
  });

  // Vertical email clicking opens contact tab
  verticalEmail.addEventListener("click", () => {
    handleCommand("open contactMe");
  });

  // Make terminal tab clickable
  document.addEventListener('click', function(e) {
    if (e.target.closest('.tab-item[data-tabid="tab-terminal"]')) {
      switchToTab('tab-terminal');
    }
  });

  // Focus input when clicking terminal window
  document.getElementById("terminalWindow").addEventListener("click", (e) => {
    focusInput();
  });

  // Command history navigation
  let historyIndex = -1;
  cmdInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      if (state.history.length === 0) return;
      historyIndex = Math.max(0, historyIndex + (historyIndex === -1 ? state.history.length - 1 : -1));
      cmdInput.value = state.history[historyIndex] || "";
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (state.history.length === 0) return;
      if (historyIndex === -1) return;
      historyIndex = Math.min(state.history.length - 1, historyIndex + 1);
      cmdInput.value = state.history[historyIndex] || "";
      if (historyIndex === state.history.length - 1) historyIndex = -1;
      e.preventDefault();
    }
  });

  // Tab add button event listener - sequential opening
  tabAdd.addEventListener("click", () => {
    openNextSequentialTab();
  });

  // Tab management with event delegation
  tabsBar.addEventListener("click", (ev) => {
    const t = ev.target;
    if (t.classList.contains("tab-close")) {
      const id = t.getAttribute("data-tabid");
      if (id) closeTab(id);
    }
  });

  // Initialize terminal
  terminalOutput.innerHTML = "";
  cmdInput.value = "";

  // Setup contact form handling
  setupContactForm();

  // Type intro text with formatting
// Type intro text with formatting
typeText(terminalOutput, initialText, 12, () => {
  // Add a newline after instructions
  terminalOutput.innerHTML += '\n\n';
  focusInput();
});

  // Start with terminal tab active
  switchToTab("tab-terminal");



}

const phrases = ["Full Stack JS Dev  ", "Tech Enthusiast   ", "Creative Coder ⁴⁰⁴  "];
const el = document.getElementById("typingaddedbyme");

let i = 0, j = 0, currentPhrase = [], isDeleting = false;

function loop() {
  el.innerHTML = currentPhrase.join("");

  if (!isDeleting && j < phrases[i].length) {
    currentPhrase.push(phrases[i][j]);
    j++;
  }

  if (isDeleting && j > 0) {
    currentPhrase.pop();
    j--;
  }

  // ✅ Word fully typed
  if (!isDeleting && j === phrases[i].length) {
    isDeleting = true;
    setTimeout(loop, 3000); // ⏸ 2s pause before deleting
    return;
  }

  // ✅ Word fully deleted
  if (isDeleting && j === 0) {
    isDeleting = false;
    i = (i + 1) % phrases.length;
  }

  const speed = isDeleting ? 60 : 120; // typing vs deleting speed
  setTimeout(loop, speed);
}

loop();
