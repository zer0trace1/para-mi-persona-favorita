"use strict";
const $ = (selector) => document.querySelector(selector);
const content = window.LOVE_CONTENT;
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
let toastTimeout;

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove("show"), 2400);
}

function hearts(x = innerWidth / 2, y = innerHeight / 2, count = 18) {
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = random(["💗", "💖", "💕", "🌸", "🎀"]);
    heart.style.left = `${x + (Math.random() - 0.5) * 120}px`;
    heart.style.top = `${y + (Math.random() - 0.5) * 60}px`;
    heart.style.setProperty("--dx", `${(Math.random() - 0.5) * 230}px`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1500);
  }
}

function celebrate() {
  hearts(innerWidth / 2, innerHeight / 2);
}

// Barra de lectura y animaciones suaves al hacer scroll.
addEventListener(
  "scroll",
  () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    $("#progress").style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
  },
  { passive: true },
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
} else {
  document
    .querySelectorAll(".reveal")
    .forEach((el) => el.classList.add("visible"));
}

// Medidor de amor.
let measuring = false;
$("#measure").addEventListener("click", () => {
  if (measuring) return;
  measuring = true;
  $("#fill").style.width = "100%";
  const started = performance.now();
  function animate(now) {
    const ratio = Math.min(1, (now - started) / 1600);
    $("#percentage").textContent =
      `${Math.floor((1 - (1 - ratio) ** 3) * 999)}%`;
    if (ratio < 1) requestAnimationFrame(animate);
    else {
      $("#percentage").textContent = "∞%";
      $("#meter-caption").textContent =
        "Ni la IA puede medir todo lo que sho te amo a vos.";
      measuring = false;
      celebrate();
    }
  }
  requestAnimationFrame(animate);
});

// Mimos editables en content.js.
let delivered = 0;
$("#compliment-btn").addEventListener("click", () => {
  $("#compliment").textContent = `«${random(content.compliments)}»`;
  delivered += 1;
  $("#compliment-counter").textContent = `Mimitos entregados: ${delivered}`;
  if (delivered % 5 === 0) celebrate();
});

// El botón NO se mueve tanto con ratón como con pantalla táctil.
let dodges = 0;
function dodgeNo(event) {
  if (event) event.preventDefault();
  dodges += 1;
  const button = $("#no");
  const x = Math.round((Math.random() - 0.5) * 100);
  const y = Math.round((Math.random() - 0.5) * 75);
  button.style.transform = `translate(${x}px, ${y}px) rotate(${Math.round((Math.random() - 0.5) * 26)}deg)`;
  $("#answer").textContent = random([
    "¿Perdona? Esa opción está averiada 🤨",
    "ERROR 404: respuesta no encontrada 🐈",
    "El gato acaba de suspenderte 😭",
    "JAJAJA buen intento, cariño 😌",
  ]);
  if (dodges >= 5) button.textContent = "vale, sí 😭";
}
$("#no").addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse") dodgeNo(event);
});
$("#no").addEventListener("click", dodgeNo);
$("#yes").addEventListener("click", () => {
  $("#answer").textContent = "¡¡YO MÁS!! Te has ganado 100000 besitos 💋";
  celebrate();
});

// Test multi-pregunta, todas las respuestas se editan en content.js.
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;
function renderQuiz() {
  const q = content.questions[quizIndex];
  quizAnswered = false;
  $("#quiz-count").textContent =
    `PREGUNTA ${quizIndex + 1} / ${content.questions.length}`;
  $("#quiz-question").textContent = q.question;
  $("#quiz-feedback").textContent = "";
  $("#quiz-next").classList.add("hidden");
  $("#quiz-options").replaceChildren();
  q.options.forEach((label, index) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.textContent = label;
    button.addEventListener("click", () => {
      if (quizAnswered) return;
      quizAnswered = true;
      const correct = index === q.correct;
      if (correct) quizScore += 1;
      button.classList.add(correct ? "correct" : "wrong");
      $("#quiz-options")
        .querySelectorAll("button")
        .forEach((other) => {
          other.disabled = true;
        });
      $("#quiz-feedback").textContent = correct
        ? q.feedback
        : "Fallaste, boluditaaaa. Pero te quiero igual 💕";
      $("#quiz-next").textContent =
        quizIndex === content.questions.length - 1
          ? "ver resultado ✨"
          : "siguiente →";
      $("#quiz-next").classList.remove("hidden");
      if (correct) hearts(innerWidth / 2, innerHeight / 2, 8);
    });
    $("#quiz-options").appendChild(button);
  });
}
function finishQuiz() {
  $("#quiz-count").textContent = "RESULTADOS OFICIALES";
  $("#quiz-question").textContent = "Compatibilidad: 1000000% 💘";
  $("#quiz-options").replaceChildren();
  $("#quiz-feedback").textContent =
    `Has acertado ${quizScore} de ${content.questions.length}, pero da igual: el resultado estaba amañado desde el principio.`;
  $("#quiz-next").textContent = "volver a jugar ↻";
  $("#quiz-next").classList.remove("hidden");
  celebrate();
}
$("#quiz-next").addEventListener("click", () => {
  if (quizIndex >= content.questions.length) {
    quizIndex = 0;
    quizScore = 0;
    renderQuiz();
  } else {
    quizIndex += 1;
    if (quizIndex === content.questions.length) finishQuiz();
    else renderQuiz();
  }
});
renderQuiz();

// Rasca y gana: compatible con ratón y táctil, sin librerías externas.
const canvas = $("#scratch");
const scratchArea = $("#scratch-area");
const context = canvas.getContext("2d");
let scratching = false;
let strokes = 0;
let scratchComplete = false;
function resetScratch() {
  $("#prize").textContent = random(content.prizes);
  const bounds = scratchArea.getBoundingClientRect();
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(bounds.width * ratio);
  canvas.height = Math.round(bounds.height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.globalCompositeOperation = "source-over";
  context.fillStyle = "#ec8aab";
  context.fillRect(0, 0, bounds.width, bounds.height);
  context.fillStyle = "#fff";
  context.font = "800 22px DM Sans, sans-serif";
  context.textAlign = "center";
  context.fillText("RASCA AQUÍ ✨", bounds.width / 2, bounds.height / 2 + 7);
  context.globalCompositeOperation = "destination-out";
  canvas.hidden = false;
  strokes = 0;
  scratchComplete = false;
}
function scratchAt(event) {
  if (!scratching || scratchComplete) return;
  const rect = canvas.getBoundingClientRect();
  context.beginPath();
  context.arc(
    event.clientX - rect.left,
    event.clientY - rect.top,
    22,
    0,
    Math.PI * 2,
  );
  context.fill();
  strokes += 1;
  if (strokes > 85) {
    scratchComplete = true;
    canvas.hidden = true;
    toast("¡Premio desbloqueado! 💗");
    celebrate();
  }
}
canvas.addEventListener("pointerdown", (event) => {
  scratching = true;
  canvas.setPointerCapture(event.pointerId);
  scratchAt(event);
});
canvas.addEventListener("pointermove", scratchAt);
canvas.addEventListener("pointerup", () => {
  scratching = false;
});
canvas.addEventListener("pointercancel", () => {
  scratching = false;
});
$("#new-prize").addEventListener("click", resetScratch);
resetScratch();

// Ruleta de planes: cada sector es de 60 grados.
const wheel = $("#wheel");
wheel
  .querySelectorAll("span")
  .forEach((span, i) => span.style.setProperty("--i", i));
let currentAngle = 0;
let spinning = false;
$("#spin").addEventListener("click", () => {
  if (spinning) return;
  spinning = true;
  $("#spin").disabled = true;
  $("#wheel-result").textContent = "El universo está deliberando…";
  const picked = Math.floor(Math.random() * content.plans.length);
  // Cada cuña se centra en 30, 90, 150... grados. Se alinea el centro al puntero superior.
  const target = (360 - (picked * 60 + 30)) % 360;
  const normalized = ((currentAngle % 360) + 360) % 360;
  currentAngle += 360 * 5 + ((target - normalized + 360) % 360);
  wheel.style.transform = `rotate(${currentAngle}deg)`;
  setTimeout(() => {
    $("#wheel-result").textContent = content.plans[picked];
    spinning = false;
    $("#spin").disabled = false;
    celebrate();
  }, 4100);
});

// Carta y sorpresa.
$("#letter-content").textContent = content.letter;
$("#envelope").addEventListener("click", () => {
  const opening = $("#letter").hidden;
  $("#letter").hidden = !opening;
  $("#envelope").setAttribute("aria-expanded", String(opening));
  if (opening) celebrate();
});
function closeModal() {
  $("#modal").hidden = true;
}
$("#secret-btn").addEventListener("click", () => {
  $("#modal").hidden = false;
  celebrate();
});
$("#modal-close").addEventListener("click", closeModal);
$("#modal").addEventListener("click", (event) => {
  if (event.target === $("#modal")) closeModal();
});
$("#claim").addEventListener("click", () => {
  toast("¡Canjeado! Enseña esta pantalla para cobrar 😚");
  celebrate();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});
