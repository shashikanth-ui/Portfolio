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

/* ---------- Terminal system ---------- */
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

    const initialText = `This is a Fully Interactive Portfolio Page with a Linux Inspired Terminal

To Use the Portfolio Either <span class="highlight">use the navigation</span> Or <span class="highlight">explore the terminal</span>
To Begin, Type:

        <span class="command-bracket instruction-link" data-command="1">[1]</span> or <span class="command-text instruction-link" data-command="open aboutMe">[open aboutMe]</span>: Opens about me
        <span class="command-bracket instruction-link" data-command="2">[2]</span> or <span class="command-text instruction-link" data-command="open experience">[open experience]</span>: Opens my previous work experience
        <span class="command-bracket instruction-link" data-command="3">[3]</span> or <span class="command-text instruction-link" data-command="open work">[open work]</span>: Opens my projects on GitHub
        <span class="command-bracket instruction-link" data-command="4">[4]</span> or <span class="command-text instruction-link" data-command="open contactMe">[open contactMe]</span>: Runs contact me program in terminal
        <span class="command-bracket instruction-link" data-command="5">[5]</span> or <span class="command-text instruction-link" data-command="resume">[resume]</span>: Downloads my resume`;

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

        // Initialize listeners for specific tabs
        if (key === 'experience') {
            initializeExperienceListeners();
        }
        if (key === 'work') {
            initializeWorkListeners();
        }
        if (key === 'contact') {
            initContactFormListeners();
        }

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


        <span class="command-bracket instruction-link" data-command="1">[1]</span> or <span class="command-text instruction-link" data-command="open aboutMe">[open aboutMe]</span>: Opens about me
        <span class="command-bracket instruction-link" data-command="2">[2]</span> or <span class="command-text instruction-link" data-command="open experience">[open experience]</span>: Opens my previous work experience
        <span class="command-bracket instruction-link" data-command="3">[3]</span> or <span class="command-text instruction-link" data-command="open work">[open work]</span>: Opens my projects on GitHub
        <span class="command-bracket instruction-link" data-command="4">[4]</span> or <span class="command-text instruction-link" data-command="open contactMe">[open contactMe]</span>: Runs contact me program in terminal
        <span class="command-bracket instruction-link" data-command="5">[5]</span> or <span class="command-text instruction-link" data-command="resume">[resume]</span>: Downloads my resume`;
            
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
            const cleanOutput = fakeOutput.replace(`<span style="color: #00ff88;">${state.prompt}</span> ${cmd}\n`, '');
            appendOutput(cleanOutput + '\n');
        }
        return;
    }

    // Handle portfolio commands
    if (lc === "1" || lc === "open aboutme" || lc === "open about" || lc === "aboutme") {
        createOrSwitchTab("about", "About", getAboutContent());
    } else if (lc === "2" || lc === "open experience" || lc === "experience") {
        createOrSwitchTab("experience", "Experience", getExperienceContent());
    } else if (lc === "3" || lc === "open work" || lc === "work" || lc === "projects") {
        createOrSwitchTab("work", "Work", getWorkContent());
    } else if (lc === "4" || lc === "open contactme" || lc === "open contact" || lc === "contactme") {
        createOrSwitchTab("contact", "Contact", getContactContent());
    } else if (lc === '5' || lc === 'resume' || lc === 'download resume' || lc === 'get resume') {
        const link = document.createElement('a');
        link.href = './public/Pillala_Shashikanth_Resume.pdf';
        link.setAttribute('download', 'Pillala_Shashikanth_Resume.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        appendOutput('Downloading resume...\n');
        setTimeout(() => {
            appendOutput('Downloaded successfully.\n');
        }, 1000);
    } else if (lc === "help") {
        appendOutput(`<span style="color: #ffdd44;">Portfolio Commands:</span>
1,2,3,4,5 | open aboutMe|open experience|open work|open contactMe
resume: Downloads my resume

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
    
    const inputRow = document.getElementById('inputRow');
    const commandSection = document.querySelector('.command-section');
    
    if (inputRow && commandSection) {
        commandSection.appendChild(inputRow);
    }
    
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // =======================================================
    // CONTENT FUNCTIONS
    // =======================================================
    
    function getAboutContent() {
        return `
            <div class="content-container about-section">
                <div class="about-content">
                    <div class="about-text">
                        <div class="section-header">
                            <h2>About Me</h2>
                            <div class="header-line"></div>
                        </div>
                        <p>Hello! I'm Shashikanth, a full-stack developer and tech enthusiast based in India.</p>
                        <p>I build dynamic and responsive web applications, with a passion for clean code and user-centric design. When I'm not coding, I enjoy exploring new technologies and contributing to open-source projects.</p>
                        <p>Here are a few technologies I've worked with recently:</p>
                        <div class="tech-list">
                            <ul>
                            <li><span>▸</span>JavaScript (ES10+)</li>
                            <li><span>▸</span>Node.js / Express.js</li>
                            <li><span>▸</span>REST APIs</li>
                            </ul>

                            <ul>
                            <li><span>▸</span>HTML5 & (S)CSS</li>
                            <li><span>▸</span>Firebase</li>
                            <li><span>▸</span>PostgreSQL</li>
                            </ul>
                        </div>
                        <a href="./public/Pillala_Shashikanth_Resume.pdf" class="about-resume-btn" download>Download Resume</a>
                    </div>
                    <div class="about-photo">
                        <img src="./public/images/profilePicture.png" alt="Profile Photo" />
                    </div>
                </div>
            </div>
        `;
    }
    
    function getExperienceContent() {
        return `
            <div class="content-container exp-section">
                <div class="exp-wrapper">
                    <div class="section-header">
                        <h2>Where I've Worked</h2>
                        <div class="header-line"></div>
                    </div>
                    <div class="exp-content-layout">
                        <ul id="exp-sidebar" class="exp-sidebar">
                            <li><button class="exp-option active" data-target="prodigy">Prodigy InfoTech</button></li>
                            <li><button class="exp-option" data-target="ey">Edunet / EY</button></li>
                            <li><button class="exp-option" data-target="nitw">NIT Warangal</button></li>
                            <li><button class="exp-option" data-target="deloitte">Deloitte</button></li>
                            <li><button class="exp-option" data-target="ieee">IEEE (Volunteering)</button></li>
                            <li><button class="exp-option" data-target="education">Education</button></li>
                            <li><button class="exp-option" data-target="certs">Certifications</button></li>
                        </ul>
                        <section id="exp-content" class="exp-details">
                            <article id="prodigy" class="exp-detail active">
                                <h3>Full-Stack Web Development Intern <span>@ Prodigy InfoTech</span></h3>
                                <p class="exp-date">August 2024 - September 2024</p>
                                <ul>
                                    <li><span>▸</span>Successfully completed a one-month intensive internship in Full-Stack Web Development. </li>
                                    <li><span>▸</span>Received a Letter of Recommendation for exceptional performance, highlighting remarkable technical skills, professionalism, and a creative approach to solving complex problems. </li>
                                </ul>
                            </article>
                            <article id="ey" class="exp-detail">
                                <h3>Full-Stack Web Development Intern <span>@ Edunet / EY GDS</span></h3>
                                <p class="exp-date">February 2024 - April 2024</p>
                                <ul>
                                    <li><span>▸</span>Developed key features for a full-scale E-commerce Platform, including product catalogs, shopping cart functionality, and order management. </li>
                                    <li><span>▸</span>Built full-stack applications using Node.js, Express.js, EJS, and PostgreSQL. </li>
                                    <li><span>▸</span>Constructed secure REST APIs and implemented robust user authentication using OAuth/JWT mechanisms. </li>
                                </ul>
                            </article>
                            <article id="nitw" class="exp-detail">
                                <h3>Intern <span>@ NIT Warangal</span></h3>
                                <p class="exp-date">October 2024</p>
                                <ul>
                                    <li><span>▸</span>Built a comprehensive Freelance Portal featuring skill-based user search, messaging, and project posting functionalities. </li>
                                    <li><span>▸</span>Developed the application using Node.js, Express, and EJS, with Firebase for real-time database and authentication services. </li>
                                </ul>
                            </article>
                            <article id="deloitte" class="exp-detail">
                                <h3>Virtual Experience Program <span>@ Deloitte</span></h3>
                                <p class="exp-date">March 2023</p>
                                <ul>
                                    <li><span>▸</span>Completed a series of practical task modules in five key technology areas: Coding , Data Analysis , Development , Cyber Security , and Forensic Technology. </li>
                                </ul>
                            </article>
                            <article id="ieee" class="exp-detail">
                                <h3>Secretary & Publicity Lead <span>@ IEEE Student Branch</span></h3>
                                <p class="exp-date">2022 - 2024</p>
                                <ul>
                                    <li><span>▸</span>Served as Secretary and Publicity Lead, organizing and promoting numerous technical events, workshops, and seminars.</li>
                                    <li><span>▸</span>Co-organized two national-level flagship events, NSPC '23 and NSPC '24, managing logistics, speakers, and promotion.</li>
                                    <li><span>▸</span>Successfully brought over 300 delegates to each event through strategic outreach, social media campaigns, and effective team collaboration.</li>
                                    <li><span>▸</span>Enhanced member engagement by creating compelling promotional materials and fostering a collaborative community environment.</li>
                                </ul>
                            </article>
                            <article id="education" class="exp-detail">
                                <h3>B.Tech - Computer Science <span>@ Vaagdevi College of Engineering</span></h3>
                                <p class="exp-date">2021 - 2025 </p>
                                <ul>
                                    <li><span>▸</span>Current CGPA: 7.87</li>
                                    <li><span>▸</span>Actively engaged in practical, hands-on learning by developing various full-stack web applications as part of the curriculum.</li>
                                    <li><span>▸</span>Gained proficiency in core computer science subjects including Data Structures, Algorithms, Database Management, and Operating Systems.</li>
                                    <li><span>▸</span>Collaborated on group projects, honing teamwork, communication, and project management skills in an agile environment.</li>
                                </ul>
                            </article>
                             <article id="certs" class="exp-detail">
                                <h3>My Certifications & Digital Badges</h3>
                                <p class="exp-date">Continuous Learning & Skill Validation</p>
                                <ul class="certificate-list">
                                    <li><span>▸</span><a href="./public/images/aws_certificate.png" class="cert-link">AWS Academy Graduate - Cloud Foundations</a></li>
                                    <li><span>▸</span><a href="./public/images/prodigy_certificate.png" class="cert-link">Full-Stack Web Development - Prodigy InfoTech</a></li>
                                    <li><span>▸</span><a href="./public/images/ey_certificate.png" class="cert-link">Full-Stack Web Development - Edunet Foundation / EY</a></li>
                                    <li><span>▸</span><a href="./public/images/deloitte_certificate.png" class="cert-link">Technology Virtual Experience - Deloitte</a></li>
                                    <li><span>▸</span><a href="./public/images/udemy_certificate.png" class="cert-link">Full Stack Web Developer - Udemy</a></li>
                                </ul>
                            </article>
                        </section>
                    </div>
                </div>
            </div>
        `;
    }
    
    function getWorkContent() {
        return `
            <div class="content-container work-section">
                <div class="work-header">
                    <h2>Some Things That I've Built</h2>
                    <div class="header-line"></div>
                </div>
                <div class="projects-grid" id="projects-grid">
                    <div class="project-card">
                        <div class="project-header">
                            <svg class="folder-icon" width="40" height="32" viewBox="0 0 24 20" fill="currentColor"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/></svg>
                            <a href="https://github.com/shashikanth-ui/Portfolio" target="_blank" class="external-link-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/></svg>
                            </a>
                        </div>
                        <h3>Portfolio</h3>
                        <p>My personal portfolio website featuring a Linux-inspired interactive terminal. Built with vanilla JS, HTML, and CSS.</p>
                        <div class="tech-tags">
                            <span>JavaScript</span><span>HTML</span><span>CSS</span>
                        </div>
                    </div>
                    <div class="project-card">
                        <div class="project-header">
                            <svg class="folder-icon" width="40" height="32" viewBox="0 0 24 20" fill="currentColor"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/></svg>
                            <a href="https://github.com/shashikanth-ui/Freelance-Portal" target="_blank" class="external-link-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/></svg>
                            </a>
                        </div>
                        <h3>Freelance-Portal</h3>
                        <p>A server-side rendered portal for freelancers to find and post projects, built with Node.js and EJS.</p>
                        <div class="tech-tags">
                            <span>EJS</span><span>Node.js</span><span>Express</span><span>Firebase</span>
                        </div>
                    </div>
                    <div class="project-card">
                        <div class="project-header">
                            <svg class="folder-icon" width="40" height="32" viewBox="0 0 24 20" fill="currentColor"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/></svg>
                            <a href="https://github.com/shashikanth-ui/Ecommerce-Platform" target="_blank" class="external-link-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/></svg>
                            </a>
                        </div>
                        <h3>Ecommerce-Platform</h3>
                        <p>A full-featured e-commerce web application with product listings, a shopping cart, and order management.</p>
                        <div class="tech-tags">
                            <span>JavaScript</span><span>Node.js</span><span>PostgreSQL</span><span>EJS</span>
                        </div>
                    </div>
                    <div class="project-card project-hidden">
                        <div class="project-header">
                            <svg class="folder-icon" width="40" height="32" viewBox="0 0 24 20" fill="currentColor"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/></svg>
                            <a href="https://github.com/shashikanth-ui/Task-Manager-JS" target="_blank" class="external-link-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/></svg>
                            </a>
                        </div>
                        <h3>Task-Manager-JS</h3>
                        <p>An intuitive task management application to help organize and track daily tasks and to-do lists.</p>
                        <div class="tech-tags">
                            <span>JavaScript</span><span>CSS</span><span>HTML</span>
                        </div>
                    </div>
                    <div class="project-card project-hidden">
                        <div class="project-header">
                            <svg class="folder-icon" width="40" height="32" viewBox="0 0 24 20" fill="currentColor"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/></svg>
                            <a href="https://github.com/shashikanth-ui/Simon-game-New" target="_blank" class="external-link-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/></svg>
                            </a>
                        </div>
                        <h3>Simon-game-New</h3>
                        <p>A web-based version of the classic memory game 'Simon', built to test and improve memory skills.</p>
                        <div class="tech-tags">
                            <span>JavaScript</span><span>CSS</span><span>HTML</span>
                        </div>
                    </div>
                    <div class="project-card project-hidden">
                        <div class="project-header">
                            <svg class="folder-icon" width="40" height="32" viewBox="0 0 24 20" fill="currentColor"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/></svg>
                            <a href="https://github.com/shashikanth-ui/TIC---TAC---TOE" target="_blank" class="external-link-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/></svg>
                            </a>
                        </div>
                        <h3>TIC---TAC---TOE</h3>
                        <p>A classic Tic-Tac-Toe game created to practice and improve fundamental JavaScript logic.</p>
                        <div class="tech-tags">
                            <span>JavaScript</span><span>HTML</span><span>CSS</span>
                        </div>
                    </div>
                     <div class="project-card project-hidden">
                        <div class="project-header">
                            <svg class="folder-icon" width="40" height="32" viewBox="0 0 24 20" fill="currentColor"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/></svg>
                            <a href="https://github.com/shashikanth-ui/To-Do-List-JS" target="_blank" class="external-link-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/></svg>
                            </a>
                        </div>
                        <h3>To-Do-List-JS</h3>
                        <p>A classic To-Do List application to practice DOM manipulation and event handling in JavaScript.</p>
                        <div class="tech-tags">
                            <span>JavaScript</span><span>HTML</span><span>CSS</span>
                        </div>
                    </div>
                     <div class="project-card project-hidden">
                        <div class="project-header">
                            <svg class="folder-icon" width="40" height="32" viewBox="0 0 24 20" fill="currentColor"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/></svg>
                            <a href="https://github.com/shashikanth-ui/Weather-App-JS" target="_blank" class="external-link-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/></svg>
                            </a>
                        </div>
                        <h3>Weather-App-JS</h3>
                        <p>A weather application that fetches and displays current weather data from a third-party API.</p>
                        <div class="tech-tags">
                            <span>JavaScript</span><span>API</span><span>HTML</span><span>CSS</span>
                        </div>
                    </div>
                    <div class="project-card project-hidden">
                        <div class="project-header">
                            <svg class="folder-icon" width="40" height="32" viewBox="0 0 24 20" fill="currentColor"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/></svg>
                            <a href="https://github.com/shashikanth-ui/Blog-Website-JS" target="_blank" class="external-link-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/></svg>
                            </a>
                        </div>
                        <h3>Blog-Website-JS</h3>
                        <p>A dynamic blog website built to explore content management and dynamic page rendering.</p>
                        <div class="tech-tags">
                            <span>JavaScript</span><span>Node.js</span><span>EJS</span>
                        </div>
                    </div>
                    <div class="project-card project-hidden">
                        <div class="project-header">
                            <svg class="folder-icon" width="40" height="32" viewBox="0 0 24 20" fill="currentColor"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/></svg>
                            <a href="https://github.com/shashikanth-ui/Drum-Kit-JS" target="_blank" class="external-link-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/></svg>
                            </a>
                        </div>
                        <h3>Drum-Kit-JS</h3>
                        <p>An interactive drum kit that plays sounds on key presses, showcasing event handling for user input.</p>
                        <div class="tech-tags">
                            <span>JavaScript</span><span>HTML</span><span>CSS</span>
                        </div>
                    </div>
                     <div class="project-card project-hidden">
                        <div class="project-header">
                            <svg class="folder-icon" width="40" height="32" viewBox="0 0 24 20" fill="currentColor"><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/></svg>
                            <a href="https://github.com/shashikanth-ui/Dice-Gamee" target="_blank" class="external-link-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/></svg>
                            </a>
                        </div>
                        <h3>Dice-Gamee</h3>
                        <p>A simple and fun dice game to demonstrate core JavaScript logic and DOM manipulation.</p>
                        <div class="tech-tags">
                            <span>JavaScript</span><span>HTML</span><span>CSS</span>
                        </div>
                    </div>
                </div>
                <div class="load-more-container">
                    <button id="load-more-btn" class="load-more-btn">Load More</button>
                    <button id="show-less-btn" class="load-more-btn hidden-btn">Show Less</button>
                </div>
            </div>
        `;
    }
    
    function getContactContent() {
        return `
            <div class="content-container contact-section">
                <h2 class="contact-heading">Contact Me</h2>
                <p class="contact-subtitle">If you have a question or simply want to say hello.</p>
                <form id="contactForm" class="contact-form">
                    <input type="text" name="user_name" placeholder="Your Name" required>
                    <input type="email" name="user_email" placeholder="Your Email" required>
                    <input type="text" name="subject" placeholder="What You Want to Talk About" required>
                    <textarea name="message" placeholder="Your message here..." required></textarea>
                    <button type="submit" class="contact-submit-btn">Send Message</button>
                </form>
                <p id="formStatus" class="form-status"></p>
            </div>
        `;
    }

    function initCertificateModal() {
        const modal = document.getElementById('certificateModal');
        const modalImg = document.getElementById('certificateImage');
        const closeModal = document.querySelector('.close-modal');

        document.querySelectorAll('.cert-link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                modal.style.display = "block";
                modalImg.src = this.href;
            });
        });

        const close = () => {
            modal.style.display = "none";
        };

        closeModal.addEventListener('click', close);

        window.addEventListener('click', function (event) {
            if (event.target == modal) {
                close();
            }
        });
    }
    
    function initializeExperienceListeners() {
        const tabContent = document.getElementById('tab-experience');
        if (!tabContent) return;

        const sidebar = tabContent.querySelector("#exp-sidebar");
        if (!sidebar) {
            console.error("Experience sidebar not found. Listeners not attached.");
            return;
        }

        if (window.innerWidth > 768) {
            const buttons = sidebar.querySelectorAll(".exp-option");
            const details = tabContent.querySelectorAll(".exp-detail");
            
            buttons.forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation(); 
                    const targetId = btn.getAttribute("data-target");
                    
                    buttons.forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");

                    details.forEach(d => {
                        d.classList.remove('active');
                        if (d.id === targetId) {
                            d.classList.add('active');
                        }
                    });
                });
            });
        }
        // Init certificate modal listeners
        initCertificateModal();
    }

    function initializeWorkListeners() {
        const workTab = document.getElementById('tab-work');
        if (!workTab) return;

        const loadMoreBtn = workTab.querySelector("#load-more-btn");
        const showLessBtn = workTab.querySelector("#show-less-btn");
        const projectsGrid = workTab.querySelector("#projects-grid");
        
        if (!loadMoreBtn || !showLessBtn || !projectsGrid) return;

        loadMoreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            projectsGrid.querySelectorAll('.project-hidden').forEach(card => {
                card.classList.remove('project-hidden');
            });
            loadMoreBtn.classList.add('hidden-btn');
            showLessBtn.classList.remove('hidden-btn');
        });

        showLessBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const allProjects = projectsGrid.querySelectorAll('.project-card');
            allProjects.forEach((card, index) => {
                if (index >= 3) {
                    card.classList.add('project-hidden');
                }
            });
            showLessBtn.classList.add('hidden-btn');
            loadMoreBtn.classList.remove('hidden-btn');
            if (workTab) workTab.scrollTop = 0;
        });
    }

    // Handle contact form submission with EmailJS
    function initContactFormListeners() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formStatus = document.getElementById('formStatus');
            formStatus.textContent = 'Sending...';

            emailjs.sendForm('service_1ncugfi', 'template_zy3h933', this, 'diCEHKOZGExTWGStv')
                .then(() => {
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.style.color = '#00ff88';
                    contactForm.reset();
                    setTimeout(() => formStatus.textContent = '', 5000);
                }, (error) => {
                    formStatus.textContent = `Failed to send. Error: ${error.text}`;
                    formStatus.style.color = '#ff6b6b';
                    setTimeout(() => formStatus.textContent = '', 7000);
                });
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
        btn.addEventListener("click", (e) => {
            const cmd = btn.getAttribute("data-cmd");
            if (cmd) {
                if (btn.tagName === 'A') e.preventDefault();
                handleCommand(cmd);
            }
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
            if (historyIndex === -1) {
                historyIndex = state.history.length -1;
            } else {
                historyIndex = Math.max(0, historyIndex - 1);
            }
            cmdInput.value = state.history[historyIndex] || "";
            e.preventDefault();
        } else if (e.key === "ArrowDown") {
            if (state.history.length === 0 || historyIndex === -1) return;
            historyIndex = Math.min(state.history.length, historyIndex + 1);
            if (historyIndex >= state.history.length) {
                cmdInput.value = "";
                historyIndex = -1;
            } else {
                cmdInput.value = state.history[historyIndex] || "";
            }
            e.preventDefault();
        } else {
            historyIndex = -1;
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

    function setupInstructionListeners() {
        terminalOutput.addEventListener('click', function(e) {
            const link = e.target.closest('.instruction-link');
            if (link) {
                e.preventDefault();
                const command = link.dataset.command;
                if (command) {
                    handleCommand(command);
                }
            }
        });
    }

    // Initialize terminal
    terminalOutput.innerHTML = "";
    cmdInput.value = "";
    
    // Setup instruction listeners
    setupInstructionListeners();

    // Type intro text with formatting
    typeText(terminalOutput, initialText, 12, () => {
        // Add a newline after instructions
        terminalOutput.innerHTML += '\n\n';
        focusInput();
    });

    // Start with terminal tab active
    switchToTab("tab-terminal");
}

const phrases = ["Full Stack JS Dev   ", "Tech Enthusiast   ", "Creative Coder ⁴⁰⁴   "];
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

    if (!isDeleting && j === phrases[i].length) {
        isDeleting = true;
        setTimeout(loop, 3000);
        return;
    }

    if (isDeleting && j === 0) {
        isDeleting = false;
        i = (i + 1) % phrases.length;
    }

    const speed = isDeleting ? 60 : 120;
    setTimeout(loop, speed);
}

loop();

