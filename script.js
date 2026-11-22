const THEMES = [
  {
    label: "1-bosqich (Sandal yog‘ochi)",
    ar: "سُبْحَانَ اللَّهِ",
    uz: "SubhanAllah",
    bg: "#f4efe6",
    bgAccent: "#e6dccb",
    text: "#2c251d",
    muted: "#7a6e5f",
    accent: "#9c6635",
    cord: "#4a3525",
    beadLight: "#dfb17e",
    beadMid: "#9c6635",
    beadDark: "#4e2f14",
    card: "rgba(255, 255, 255, 0.65)",
    border: "rgba(74, 53, 37, 0.14)"
  },
  {
    label: "2-bosqich (Yong‘oq yog‘ochi)",
    ar: "الْحَمْدُ لِلَّهِ",
    uz: "Alhamdulillah",
    bg: "#e7efe8",
    bgAccent: "#cfdcd1",
    text: "#1d2b22",
    muted: "#566b5d",
    accent: "#2e6f40",
    cord: "#2e3d33",
    beadLight: "#a47551",
    beadMid: "#694429",
    beadDark: "#331e10",
    card: "rgba(255, 255, 255, 0.65)",
    border: "rgba(29, 43, 34, 0.14)"
  },
  {
    label: "3-bosqich (Qora ebonit)",
    ar: "اللَّهُ أَكْبَرُ",
    uz: "Allahu Akbar",
    bg: "#1f242d",
    bgAccent: "#13171d",
    text: "#f3ead8",
    muted: "#a99f8d",
    accent: "#d4af37",
    cord: "#8c7353",
    beadLight: "#70665c",
    beadMid: "#36312c",
    beadDark: "#141210",
    card: "rgba(255, 255, 255, 0.08)",
    border: "rgba(243, 234, 216, 0.15)"
  },
  {
    label: "4-bosqich (Zumrad tosh)",
    ar: "لَا إِلَٰهَ إِلَّا اللَّهُ",
    uz: "La ilaha illalloh",
    bg: "#2b1d24",
    bgAccent: "#1a1015",
    text: "#f7e7ce",
    muted: "#bfa78a",
    accent: "#4aa382",
    cord: "#b89258",
    beadLight: "#4aa382",
    beadMid: "#1e6b50",
    beadDark: "#0b3627",
    card: "rgba(255, 255, 255, 0.08)",
    border: "rgba(247, 231, 206, 0.16)"
  }
];

const DEFAULT_ZIKRS = [
  { id: "z1", category: "namoz", uz: "SubhanAllah", ar: "سُبْحَانَ اللَّهِ", meaning: "Alloh barcha nuqsonlardan pokdir", target: 33 },
  { id: "z2", category: "namoz", uz: "Alhamdulillah", ar: "الْحَمْدُ لِلَّهِ", meaning: "Barcha hamd-u sanolar Allohga xosdir", target: 33 },
  { id: "z3", category: "namoz", uz: "Allahu Akbar", ar: "اللَّهُ أَكْبَرُ", meaning: "Alloh buyukdir", target: 33 },
  { id: "z4", category: "kundalik", uz: "Astag‘firulloh", ar: "أَسْتَغْفِرُ اللَّهَ", meaning: "Allohdan mag‘firat so‘rayman", target: 100 },
  { id: "z5", category: "kundalik", uz: "SubhanAllohi va bihamdihi", ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", meaning: "Allohga hamd aytgan holda Uni poklayman", target: 100 },
  { id: "z6", category: "kundalik", uz: "Salavot (Allohumma solli a’la Muhammad)", ar: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ", meaning: "Ey Alloh, Muhammad (s.a.v.) ga salavot yo‘lla", target: 33 }
];

const todayKey = new Date().toISOString().slice(0, 10);

let state = {
  cycleCount: parseInt(localStorage.getItem("nt_cycle") || "0", 10),
  totalCount: parseInt(localStorage.getItem("nt_total") || "0", 10),
  todayCount: localStorage.getItem("nt_date") === todayKey
    ? parseInt(localStorage.getItem("nt_today") || "0", 10)
    : 0,
  dailyGoal: parseInt(localStorage.getItem("nt_daily_goal") || "100", 10),
  targetMode: parseInt(localStorage.getItem("nt_target_mode") || "33", 10),
  soundEnabled: localStorage.getItem("nt_sound") !== "false",
  vibeEnabled: localStorage.getItem("nt_vibe") !== "false",
  activeZikr: JSON.parse(localStorage.getItem("nt_active_zikr") || "null"),
  customZikrs: JSON.parse(localStorage.getItem("nt_custom_zikrs") || "[]")
};

function saveState() {
  localStorage.setItem("nt_cycle", state.cycleCount);
  localStorage.setItem("nt_total", state.totalCount);
  localStorage.setItem("nt_date", todayKey);
  localStorage.setItem("nt_today", state.todayCount);
  localStorage.setItem("nt_daily_goal", state.dailyGoal);
  localStorage.setItem("nt_target_mode", state.targetMode);
  localStorage.setItem("nt_sound", state.soundEnabled);
  localStorage.setItem("nt_vibe", state.vibeEnabled);
  localStorage.setItem("nt_active_zikr", JSON.stringify(state.activeZikr));
  localStorage.setItem("nt_custom_zikrs", JSON.stringify(state.customZikrs));
}

function goToScreen(screenName) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(`screen-${screenName}`).classList.add("active");

  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.go === screenName);
  });

  if (screenName === "zikrlar") renderZikrList();
  refreshAllUI(false);
}

document.querySelectorAll("[data-go]").forEach(el => {
  el.addEventListener("click", () => goToScreen(el.dataset.go));
});

document.getElementById("startTasbihBtn").addEventListener("click", () => goToScreen("tasbih"));

const cordPath = document.getElementById("cordPath");
const beadsGroup = document.getElementById("beadsGroup");
const pathLength = cordPath.getTotalLength();

const BASE_POSITIONS = [
  0.04, 0.095, 0.15, 0.205, 0.26, 0.315, 0.37,
  0.72, 0.775, 0.83, 0.885, 0.94
];
const ACTIVE_INDEX = 6;
const SLIDE_TARGET = 0.665;
let beads = [];
let isAnimating = false;

function initBeads() {
  beadsGroup.innerHTML = "";
  beads = BASE_POSITIONS.map((pos, idx) => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", idx === ACTIVE_INDEX ? "16.5" : "15.5");
    circle.setAttribute("fill", "url(#beadGrad)");

    const grain = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    grain.setAttribute("rx", "11");
    grain.setAttribute("ry", "5");
    grain.setAttribute("fill", "none");
    grain.setAttribute("stroke", "rgba(0,0,0,0.18)");
    grain.setAttribute("stroke-width", "1");

    g.appendChild(circle);
    g.appendChild(grain);
    beadsGroup.appendChild(g);
    placeBeadAt(g, pos);
    return g;
  });
}

function placeBeadAt(el, ratio) {
  const dist = Math.max(0, Math.min(1, ratio)) * pathLength;
  const pt = cordPath.getPointAtLength(dist);
  const ptAhead = cordPath.getPointAtLength(Math.min(pathLength, dist + 2));
  const angle = Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x) * (180 / Math.PI);
  el.setAttribute("transform", `translate(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)}) rotate(${angle.toFixed(1)})`);
}

let audioCtx = null;
function playWoodClick() {
  if (!state.soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.045);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.055);
  } catch (e) {}
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function applyTheme(themeIndex) {
  const t = THEMES[themeIndex % THEMES.length];
  const root = document.documentElement.style;

  root.setProperty("--bg-color", t.bg);
  root.setProperty("--bg-accent", t.bgAccent);
  root.setProperty("--text-main", t.text);
  root.setProperty("--text-muted", t.muted);
  root.setProperty("--accent", t.accent);
  root.setProperty("--card-bg", t.card);
  root.setProperty("--border-color", t.border);

  cordPath.setAttribute("stroke", t.cord);
  document.getElementById("stopLight").setAttribute("stop-color", t.beadLight);
  document.getElementById("stopMid").setAttribute("stop-color", t.beadMid);
  document.getElementById("stopDark").setAttribute("stop-color", t.beadDark);

  document.getElementById("stageLabel").textContent = t.label;

  const uzText = state.activeZikr ? state.activeZikr.uz : t.uz;
  const arText = state.activeZikr ? state.activeZikr.ar : t.ar;

  document.getElementById("zikrUz").textContent = uzText;
  document.getElementById("zikrAr").textContent = arText;
  document.getElementById("homeCurrentUz").textContent = uzText;
  document.getElementById("homeCurrentAr").textContent = arText;
}

function refreshAllUI(showNotice = false) {
  const themeIndex = Math.floor(state.cycleCount / 33);
  applyTheme(themeIndex);

  const displayCycle = state.targetMode === 33
    ? (state.cycleCount === 0 ? 0 : ((state.cycleCount - 1) % 33) + 1)
    : state.cycleCount;

  document.getElementById("cycleCount").textContent = displayCycle;
  document.getElementById("totalBadge").textContent = `Jami: ${state.totalCount}`;
  document.getElementById("targetToggleBtn").textContent =
    state.targetMode === 0 ? "Maqsad: ∞" : `Maqsad: ${state.targetMode}`;

  document.getElementById("soundBtn").textContent =
    state.soundEnabled ? "🔊 Ovoz: Yoqilgan" : "🔇 Ovoz: O‘chiq";

  document.getElementById("homeTodayCount").textContent = state.todayCount;
  document.getElementById("homeDailyGoal").textContent = state.dailyGoal;

  const pct = Math.min(100, Math.round((state.todayCount / state.dailyGoal) * 100));
  document.getElementById("dailyPercent").textContent = `${pct}%`;
  const circumference = 251.2;
  document.getElementById("dailyRing").style.strokeDashoffset =
    circumference - (pct / 100) * circumference;

  document.getElementById("homeGoalStatus").textContent =
    pct >= 100 ? "Barakalla! Kunlik maqsad bajarildi 🎉" : "Kunlik zikr rejangizni davom ettiring";

  document.getElementById("homeCurrentCycle").textContent =
    state.targetMode === 0 ? `${state.cycleCount} ta sanaldi` : `${displayCycle} / ${state.targetMode}`;

  document.getElementById("statToday").textContent = state.todayCount;
  document.getElementById("statTotal").textContent = state.totalCount;
  document.getElementById("statCycles").textContent = Math.floor(state.totalCount / 33);
  document.getElementById("dailyGoalSelect").value = state.dailyGoal;
  document.getElementById("soundCheckbox").checked = state.soundEnabled;
  document.getElementById("vibeCheckbox").checked = state.vibeEnabled;

  if (showNotice) {
    const nextTheme = THEMES[themeIndex % THEMES.length];
    const nextName = state.activeZikr ? state.activeZikr.uz : nextTheme.uz;
    showToast(`33 ta to‘ldi! Keyingi: ${nextName}`);
  }
}

function animateBeadSlide() {
  if (isAnimating) return;
  isAnimating = true;

  const duration = 200;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    for (let i = 0; i < ACTIVE_INDEX; i++) {
      const from = BASE_POSITIONS[i];
      const to = BASE_POSITIONS[i + 1];
      placeBeadAt(beads[i], from + (to - from) * ease);
    }

    const activeFrom = BASE_POSITIONS[ACTIVE_INDEX];
    placeBeadAt(beads[ACTIVE_INDEX], activeFrom + (SLIDE_TARGET - activeFrom) * ease);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      playWoodClick();
      if (state.vibeEnabled && navigator.vibrate) navigator.vibrate(18);

      const prev33 = Math.floor((state.cycleCount === 0 ? 0 : state.cycleCount - 1) / 33);
      state.cycleCount += 1;
      state.totalCount += 1;
      state.todayCount += 1;
      saveState();

      const new33 = Math.floor((state.cycleCount - 1) / 33);
      const hit33 = new33 > prev33 && state.cycleCount > 1;

      if (state.targetMode > 0 && state.cycleCount % state.targetMode === 0 && !hit33) {
        showToast(`${state.targetMode} ta zikr bajarildi!`);
      }

      const countEl = document.getElementById("cycleCount");
      countEl.classList.add("bump");
      setTimeout(() => countEl.classList.remove("bump"), 140);

      refreshAllUI(hit33);
      BASE_POSITIONS.forEach((pos, idx) => placeBeadAt(beads[idx], pos));
      isAnimating = false;
    }
  }

  requestAnimationFrame(step);
}

document.getElementById("tapArea").addEventListener("click", animateBeadSlide);

document.getElementById("targetToggleBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  const modes = [33, 99, 0];
  const next = modes[(modes.indexOf(state.targetMode) + 1) % modes.length];
  state.targetMode = next;
  saveState();
  refreshAllUI(false);
});

document.getElementById("resetCycleBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  state.cycleCount = 0;
  state.activeZikr = null;
  saveState();
  refreshAllUI(false);
  showToast("Sanoq nolga tushirildi");
});

document.getElementById("soundBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  state.soundEnabled = !state.soundEnabled;
  saveState();
  refreshAllUI(false);
});

let currentCat = "all";

function renderZikrList() {
  const container = document.getElementById("zikrListContainer");
  const allZikrs = [...DEFAULT_ZIKRS, ...state.customZikrs];
  const filtered = currentCat === "all"
    ? allZikrs
    : allZikrs.filter(z => z.category === currentCat);

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:24px;">Bu bo‘limda hozircha zikr yo‘q</p>`;
    return;
  }

  filtered.forEach(z => {
    const div = document.createElement("div");
    div.className = "zikr-item";
    div.innerHTML = `
      <div class="zi-top">
        <span class="zi-uz">${z.uz}</span>
        <span class="zi-target">${z.target} ta</span>
      </div>
      <div class="zi-ar">${z.ar || ""}</div>
      <div class="zi-meaning">${z.meaning || ""}</div>
    `;
    div.addEventListener("click", () => {
      state.activeZikr = z;
      state.cycleCount = 0;
      state.targetMode = z.target || 33;
      saveState();
      goToScreen("tasbih");
      showToast(`Tanlandi: ${z.uz}`);
    });
    container.appendChild(div);
  });
}

document.querySelectorAll("#categoryTabs .tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll("#categoryTabs .tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentCat = tab.dataset.cat;
    renderZikrList();
  });
});

const modal = document.getElementById("customModal");
function openModal() { modal.classList.add("open"); }
function closeModal() { modal.classList.remove("open"); }

document.getElementById("openCustomModalBtn").addEventListener("click", openModal);
document.getElementById("quickCustomCard").addEventListener("click", openModal);
document.getElementById("addZikrFromListBtn").addEventListener("click", openModal);
document.getElementById("closeModalBtn").addEventListener("click", closeModal);

document.getElementById("saveCustomZikrBtn").addEventListener("click", () => {
  const uz = document.getElementById("customUzInput").value.trim();
  const ar = document.getElementById("customArInput").value.trim();
  const meaning = document.getElementById("customMeaningInput").value.trim();
  const target = parseInt(document.getElementById("customTargetInput").value, 10);

  if (!uz) {
    showToast("Zikr nomini kiriting");
    return;
  }

  const newZikr = {
    id: "c_" + Date.now(),
    category: "custom",
    uz,
    ar,
    meaning: meaning || "Shaxsiy zikr",
    target
  };

  state.customZikrs.unshift(newZikr);
  state.activeZikr = newZikr;
  state.cycleCount = 0;
  state.targetMode = target;
  saveState();

  document.getElementById("customUzInput").value = "";
  document.getElementById("customArInput").value = "";
  document.getElementById("customMeaningInput").value = "";
  closeModal();
  goToScreen("tasbih");
  showToast(`Qo‘shildi: ${uz}`);
});

document.getElementById("dailyGoalSelect").addEventListener("change", (e) => {
  state.dailyGoal = parseInt(e.target.value, 10);
  saveState();
  refreshAllUI(false);
});

document.getElementById("soundCheckbox").addEventListener("change", (e) => {
  state.soundEnabled = e.target.checked;
  saveState();
  refreshAllUI(false);
});

document.getElementById("vibeCheckbox").addEventListener("change", (e) => {
  state.vibeEnabled = e.target.checked;
  saveState();
});

document.getElementById("clearAllDataBtn").addEventListener("click", () => {
  state.cycleCount = 0;
  state.totalCount = 0;
  state.todayCount = 0;
  state.activeZikr = null;
  saveState();
  refreshAllUI(false);
  showToast("Barcha statistika tozalandi");
});

initBeads();
refreshAllUI(false);