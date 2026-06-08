// ─── SAVOLAR MA'LUMOTLARI ──────────────────────────────────────────────────
const questions = [
  {
    category: "O'zgaruvchilar",
    text: "Qaysi kalit so'z o'zgarmas qiymat e'lon qiladi?",
    options: ["var", "let", "const", "static"],
    correct: 2,
  },
  {
    category: "Operatorlar",
    text: "JavaScript'da '===' nima vazifa bajaradi?",
    options: [
      "Faqat qiymatni taqqoslaydi",
      "Qiymat va turini taqqoslaydi",
      "Qiymatni o'zgartiradi",
      "Ikkita o'zgaruvchini birlashtiradi",
    ],
    correct: 1,
  },
  {
    category: "Ma'lumot turlari",
    text: "typeof null nima qaytaradi?",
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    correct: 2,
  },
  {
    category: "Array",
    text: "Massiv oxiriga element qo'shish uchun qaysi metod ishlatiladi?",
    options: ["shift()", "unshift()", "pop()", "push()"],
    correct: 3,
  },
  {
    category: "Array metodlari",
    text: "arr.filter() qanday natija qaytaradi?",
    options: [
      "Har elementni o'zgartirib yangi massiv",
      "Shartga mos elementlardan yangi massiv",
      "Birinchi mos elementni",
      "Hisob-kitob qiymatini",
    ],
    correct: 1,
  },
  {
    category: "Funksiyalar",
    text: "Arrow function qaysi sintaksis bilan yoziladi?",
    options: [
      "function() {}",
      "func() =>",
      "() => {}",
      "def () {}",
    ],
    correct: 2,
  },
  {
    category: "String",
    text: "Template literal yozish uchun qaysi belgi ishlatiladi?",
    options: ["\" \"", "' '", "` `", "[ ]"],
    correct: 2,
  },
  {
    category: "Shartlar",
    text: "Ternary operator qanday yoziladi?",
    options: [
      "if ? else",
      "shart ? true : false",
      "shart :: true | false",
      "when ? then : else",
    ],
    correct: 1,
  },
  {
    category: "Obyektlar",
    text: "Object.keys() nima qaytaradi?",
    options: [
      "Qiymatlar massivi",
      "Kalit-qiymat juftliklari",
      "Kalitlar massivi",
      "Obyekt nusxasi",
    ],
    correct: 2,
  },
  {
    category: "Tsikllar",
    text: "for...of tsikli nima uchun ishlatiladi?",
    options: [
      "Obyekt xususiyatlari bo'ylab",
      "Faqat raqamlar uchun",
      "Massiv elementlari bo'ylab",
      "Cheksiz tsikl uchun",
    ],
    correct: 2,
  },
];

// ─── HOLATLAR ─────────────────────────────────────────────────────────────
const LETTERS = ["A", "B", "C", "D"];
const TIMER_MAX = 30;
const CIRCUMFERENCE = 2 * Math.PI * 18; // r=18

let currentIndex = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let timerInterval = null;
let timeLeft = TIMER_MAX;
let totalTimeUsed = 0;
let answered = false;
let shuffledQuestions = [];

// ─── DOM ELEMENTLARI ───────────────────────────────────────────────────────
const screenStart  = document.getElementById("screen-start");
const screenQuiz   = document.getElementById("screen-quiz");
const screenResult = document.getElementById("screen-result");

const btnStart  = document.getElementById("btn-start");
const btnRetry  = document.getElementById("btn-retry");
const btnShare  = document.getElementById("btn-share");

const qCounter   = document.getElementById("q-counter");
const timerNum   = document.getElementById("timer-num");
const ringFill   = document.getElementById("ring-fill");
const liveScore  = document.getElementById("live-score");
const progressBar = document.getElementById("progress-bar");

const qCategory  = document.getElementById("q-category");
const qText      = document.getElementById("q-text");
const optionsGrid = document.getElementById("options-grid");

const statScore   = document.getElementById("stat-score");
const statCorrect = document.getElementById("stat-correct");
const statWrong   = document.getElementById("stat-wrong");
const statTime    = document.getElementById("stat-time");
const resultBar   = document.getElementById("result-bar");
const resultPct   = document.getElementById("result-pct");
const resultEmoji = document.getElementById("result-emoji");
const resultTitle = document.getElementById("result-title");
const resultSub   = document.getElementById("result-subtitle");

// ─── YORDAMCHI FUNKSIYALAR ─────────────────────────────────────────────────

// Massivni aralashtirish (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showScreen(screen) {
  [screenStart, screenQuiz, screenResult].forEach(s => s.classList.add("hidden"));
  screen.classList.remove("hidden");
}

// ─── TAYMER ───────────────────────────────────────────────────────────────
function startTimer() {
  timeLeft = TIMER_MAX;
  updateTimerUI();

  timerInterval = setInterval(() => {
    timeLeft--;
    totalTimeUsed++;
    updateTimerUI();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimerUI() {
  timerNum.textContent = timeLeft;

  // Ring animatsiyasi
  const offset = CIRCUMFERENCE * (1 - timeLeft / TIMER_MAX);
  ringFill.style.strokeDashoffset = offset;

  // Rang o'zgarishi
  if (timeLeft > 15) {
    ringFill.style.stroke = "#FFD93D"; // yellow
  } else if (timeLeft > 8) {
    ringFill.style.stroke = "#FF6B35"; // orange
  } else {
    ringFill.style.stroke = "#FF4747"; // red
  }
}

// ─── SAVOL KO'RSATISH ─────────────────────────────────────────────────────
function loadQuestion() {
  answered = false;
  const q = shuffledQuestions[currentIndex];

  // Header
  qCounter.textContent = `${currentIndex + 1} / ${shuffledQuestions.length}`;
  liveScore.textContent = score;
  progressBar.style.width = `${(currentIndex / shuffledQuestions.length) * 100}%`;

  // Savol
  qCategory.textContent = q.category;
  qText.textContent = q.text;

  // Variantlar
  optionsGrid.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `<span class="opt-letter">${LETTERS[i]}</span>${opt}`;
    btn.addEventListener("click", () => handleAnswer(i));
    optionsGrid.appendChild(btn);
  });

  // Taymer
  startTimer();
}

// ─── JAVOB BERISH ─────────────────────────────────────────────────────────
function handleAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  stopTimer();

  const q = shuffledQuestions[currentIndex];
  const btns = optionsGrid.querySelectorAll(".option-btn");

  // To'g'ri javobni har doim ko'rsatish
  btns[q.correct].classList.add("correct");

  if (selectedIndex === q.correct) {
    // To'g'ri — vaqtga qarab ball hisoblash
    const timeBonus = Math.floor((timeLeft / TIMER_MAX) * 100);
    score += 100 + timeBonus;
    correctCount++;
  } else {
    // Noto'g'ri
    btns[selectedIndex].classList.add("wrong");
    wrongCount++;
  }

  // Barcha tugmalarni o'chirish
  btns.forEach(b => b.disabled = true);
  liveScore.textContent = score;

  // Keyingi savolga o'tish
  setTimeout(() => {
    currentIndex++;
    if (currentIndex < shuffledQuestions.length) {
      loadQuestion();
    } else {
      showResult();
    }
  }, 1200);
}

// ─── VAQT TUGASHI ─────────────────────────────────────────────────────────
function handleTimeout() {
  if (answered) return;
  answered = true;

  const q = shuffledQuestions[currentIndex];
  const btns = optionsGrid.querySelectorAll(".option-btn");

  // To'g'ri javobni ko'rsatish
  btns[q.correct].classList.add("correct");
  btns.forEach(b => b.disabled = true);
  wrongCount++;

  setTimeout(() => {
    currentIndex++;
    if (currentIndex < shuffledQuestions.length) {
      loadQuestion();
    } else {
      showResult();
    }
  }, 1200);
}

// ─── NATIJA ───────────────────────────────────────────────────────────────
function showResult() {
  progressBar.style.width = "100%";
  showScreen(screenResult);

  const total = shuffledQuestions.length;
  const pct = Math.round((correctCount / total) * 100);
  const avgTime = Math.round(totalTimeUsed / total);

  statScore.textContent   = score;
  statCorrect.textContent = correctCount;
  statWrong.textContent   = wrongCount;
  statTime.textContent    = avgTime + "s";
  resultPct.textContent   = pct + "%";

  // Progress bar animatsiyasi (kechiktirilgan)
  setTimeout(() => {
    resultBar.style.width = pct + "%";
  }, 200);

  // Baho berish
  if (pct >= 90) {
    resultEmoji.textContent = "🏆";
    resultTitle.textContent = "Ustaxona!";
    resultSub.textContent = "Siz JavaScript bo'yicha haqiqiy ekspertsiz!";
  } else if (pct >= 70) {
    resultEmoji.textContent = "🎉";
    resultTitle.textContent = "Ajoyib!";
    resultSub.textContent = "Siz juda yaxshi natija ko'rsatdingiz!";
  } else if (pct >= 50) {
    resultEmoji.textContent = "💪";
    resultTitle.textContent = "Yaxshi!";
    resultSub.textContent = "Yana bir oz mashq qilsangiz — zo'r bo'lasiz!";
  } else {
    resultEmoji.textContent = "📚";
    resultTitle.textContent = "O'qib chiqing!";
    resultSub.textContent = "Asoslarni yana bir bor ko'rib chiqing.";
  }
}

// ─── QAYTADAN BOSHLASH ────────────────────────────────────────────────────
function resetGame() {
  currentIndex   = 0;
  score          = 0;
  correctCount   = 0;
  wrongCount     = 0;
  totalTimeUsed  = 0;
  answered       = false;
  resultBar.style.width = "0%";
  shuffledQuestions = shuffle(questions);
}

// ─── NUSXALASH ────────────────────────────────────────────────────────────
function copyResult() {
  const pct = Math.round((correctCount / shuffledQuestions.length) * 100);
  const text =
    `🎮 BrainBlast — JS Quiz\n` +
    `─────────────────────\n` +
    `⭐ Ball:      ${score}\n` +
    `✅ To'g'ri:  ${correctCount} / ${shuffledQuestions.length}\n` +
    `📊 Foiz:     ${pct}%\n` +
    `─────────────────────\n` +
    `Siz ham sinab ko'ring!`;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      btnShare.textContent = "✅ Nusxalandi!";
      setTimeout(() => (btnShare.textContent = "📋 Natijani Nusxalash"), 2000);
    })
    .catch(() => {
      alert(text);
    });
}

// ─── HODISALAR ────────────────────────────────────────────────────────────
btnStart.addEventListener("click", () => {
  resetGame();
  showScreen(screenQuiz);
  loadQuestion();
});

btnRetry.addEventListener("click", () => {
  resetGame();
  showScreen(screenQuiz);
  loadQuestion();
});

btnShare.addEventListener("click", copyResult);
