const btn = document.querySelector(".index-start-btn");

function navigateWithFade() {
  document.body.style.opacity = 0;
  setTimeout(() => {
    window.location.href = "home.html";
  }, 300);
}

// Click, touch, and Enter key
function enableNavigation() {
  btn.addEventListener("click", navigateWithFade);
  btn.addEventListener("touchstart", navigateWithFade);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") navigateWithFade();
  });
}

// =====================
// TYPING EFFECT
// =====================
const paragraphs = document.querySelectorAll(".index-content p");
const cursor = document.querySelector(".cursor");
let current = 0;

function typeParagraph() {
  if (current >= paragraphs.length) {
    // Show button after all paragraphs typed
    btn.style.display = "block";
    enableNavigation();
    return;
  }

  const p = paragraphs[current];
  const text = p.dataset.text;
  let i = 0;

  if (!p.contains(cursor)) p.appendChild(cursor);

  function typeChar() {
    if (i < text.length) {
      p.textContent = text.substring(0, i + 1);
      p.appendChild(cursor);
      i++;
      setTimeout(typeChar, 50);
    } else {
      current++;
      setTimeout(typeParagraph, 300);
    }
  }

  typeChar();
}

typeParagraph();


// =====================
// HACKER BACKGROUND
// =====================
const canvas = document.getElementById("hacker-bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const binary = "01@!#$%^&*";
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(0);

function draw() {
  // subtle fading to keep letters visible longer
  ctx.fillStyle = "rgba(0, 0, 0, 0.03)"; // very small alpha
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00FF00";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const char = binary.charAt(Math.floor(Math.random() * binary.length));
    ctx.fillText(char, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i] += 0.15; // keeps fall speed visible
  }

  requestAnimationFrame(draw);
}

draw();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
