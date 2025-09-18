/* Globals */
const rand = (min, max) => Math.random() * (max - min) + min;
/* ---------- Binary rain ---------- */
const canvas = document.getElementById("binary-canvas");
const ctx = canvas.getContext("2d");
let cw = canvas.width = innerWidth;
let ch = canvas.height = innerHeight;
window.addEventListener("resize", () => { cw = canvas.width = innerWidth; ch = canvas.height = innerHeight; initBinary(); });
let columns = 0, drops = [], fontSize = 14;
function initBinary() {
  fontSize = Math.max(12, Math.floor(Math.min(cw, ch) * 0.015));
  columns = Math.floor(cw / fontSize);
  drops = new Array(columns).fill(1);
}
initBinary();
const chars = "01";
function drawBinary() {
  ctx.fillStyle = "rgba(0,0,0,0.06)";
  ctx.fillRect(0, 0, cw, ch);
  ctx.fillStyle = "#00FF66";
  ctx.font = `${fontSize}px monospace`;
  for (let i = 0; i < columns; i++) {
    const text = chars.charAt(Math.floor(Math.random() * chars.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > ch && Math.random() > 0.975) drops[i] = 0;
    drops[i] += rand(0.6, 1.6);
  }
  requestAnimationFrame(drawBinary);
}
requestAnimationFrame(drawBinary);
/* ---------- Glitch sequencing ---------- */
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
    setTimeout(()=> { rgb.style.transform = ""; }, duration+30);
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
      const tcol = Math.random() < 0.5 ? "linear-gradient(90deg,#00ffea55,#00ff66)" : "linear-gradient(90deg,#ff00a255,#ffffff55)";
      tear.style.background = tcol;
      tears.appendChild(tear);
      setTimeout(()=> tear.remove(), 600);
    }
  }
  function cameraShake(ms = 260) {
    const el = document.body;
    el.style.transition = `transform ${ms}ms cubic-bezier(.2,.9,.2,1)`;
    el.style.transform = `translate(${rand(-10,10)}px, ${rand(-6,6)}px) rotate(${rand(-0.6,0.6)}deg)`;
    setTimeout(()=> { el.style.transform = ""; el.style.transition = ""; }, ms);
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
    setTimeout(()=> noise.style.opacity = 0.16, 200);
  }, 1500);
  setTimeout(() => {
    access.classList.remove("jitter");
    access.classList.remove("glitching");
    const flickerTimes = [0, 80, 160, 260];
    flickerTimes.forEach((t) => {
      setTimeout(() => {
        access.classList.add("glitching");
        setTimeout(()=> access.classList.remove("glitching"), 80);
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
    setTimeout(()=> flash.remove(), 140);
    overlay.classList.add("blur-burst");
    setTimeout(() => overlay.classList.remove("blur-burst"), 500);
  }, 2350);
  // Reveal
  setTimeout(() => {
    overlay.style.transition = "opacity 900ms cubic-bezier(.2,.9,.2,1)";
    overlay.style.opacity = 0;
    noise.style.opacity = 0;
    rgb.style.opacity = 0;
    main.style.opacity = 1;
    main.setAttribute("aria-hidden", "false");
    access.style.opacity = 0;
    setTimeout(() => overlay.remove(), 1200);
  }, 3000);
});
