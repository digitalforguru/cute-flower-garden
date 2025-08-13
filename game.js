// =========================
// Game State
// =========================
let state = {
  lotusPoints: 0,
  streak: 0,
  lastLoginDate: null,
  seeds: [],
  water: 0,
  garden: null,
  harvested: []
};

// =========================
// DOM Elements
// =========================
const lotusPointsValue = document.getElementById("lotus-points-value");
const streakCountEl = document.getElementById("streak-count");
const gardenImage = document.getElementById("garden-image");
const seedInventory = document.getElementById("seed-inventory");
const noSeedsText = document.getElementById("no-seeds-text");

const waterBtn = document.getElementById("water-btn");
const harvestBtn = document.getElementById("harvest-btn");
const buyWaterBtn = document.getElementById("buy-water-btn");

const seedJournalBtn = document.getElementById("seed-journal-btn");
const buySeedListBtn = document.getElementById("buy-seed-list-btn");

const seedJournalPopup = document.getElementById("seed-journal-popup");
const buySeedsPopup = document.getElementById("buy-seeds-popup");

const popupMessage = document.getElementById("popup-message");


// =========================
// Utility Functions
// =========================
function saveState() {
  localStorage.setItem("gardenGameState", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("gardenGameState");
  if (saved) {
    state = JSON.parse(saved);
  }
}

// Update lotus points
function updateLotusPoints() {
  lotusPointsValue.textContent = state.lotusPoints;
}

// FINAL updateStreak function (only one left)
function updateStreak() {
  streakCountEl.textContent = state.streak;

  const streakDisplay = document.querySelector(".widget-header .streak-display");
  if (!streakDisplay) {
    const streakSpan = document.createElement("span");
    streakSpan.classList.add("streak-display");
    streakSpan.style.marginLeft = "10px";
    streakSpan.style.fontSize = "12px";
    streakSpan.style.userSelect = "none";
    document.querySelector(".widget-header").appendChild(streakSpan);
  }

  document.querySelector(".widget-header .streak-display").textContent =
    `daily login streak: ${state.streak} ⟢`;
}

// =========================
// Streak Logic
// =========================
function updateDailyStreak() {
  const today = new Date().toDateString();

  if (state.lastLoginDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (state.lastLoginDate === yesterday.toDateString()) {
      state.streak += 1; // consecutive login
    } else {
      state.streak = 1; // reset streak
    }

    state.lastLoginDate = today;
    saveState();
  }
  updateStreak();
}

// =========================
// Game Actions
// =========================
function waterPlant() {
  if (state.water > 0 && state.garden) {
    state.water -= 1;
    state.garden.watered = (state.garden.watered || 0) + 1;
    if (state.garden.watered >= state.garden.requiredWater) {
      harvestBtn.disabled = false;
    }
    saveState();
    render();
  } else {
    showPopupMessage("You need water to water your plant!");
  }
}

function harvestPlant() {
  if (state.garden) {
    state.harvested.push(state.garden);
    state.garden = null;
    state.lotusPoints += 5;
    saveState();
    render();
  }
}

function buyWater() {
  if (state.lotusPoints >= 2) {
    state.lotusPoints -= 2;
    state.water += 1;
    saveState();
    render();
  } else {
    showPopupMessage("Not enough lotus points!");
  }
}

// =========================
// Seed Inventory Logic
// =========================
function renderSeedInventory() {
  seedInventory.innerHTML = "";
  if (state.seeds.length === 0) {
    noSeedsText.style.display = "block";
    return;
  }
  noSeedsText.style.display = "none";

  state.seeds.forEach((seed, index) => {
    const seedEl = document.createElement("button");
    seedEl.textContent = seed.name;
    seedEl.onclick = () => plantSeed(index);
    seedInventory.appendChild(seedEl);
  });
}

function plantSeed(index) {
  if (!state.garden) {
    state.garden = {
      ...state.seeds[index],
      watered: 0
    };
    state.seeds.splice(index, 1);
    saveState();
    render();
  } else {
    showPopupMessage("Garden already has a plant!");
  }
}

// =========================
// Render Function
// =========================
function render() {
  updateLotusPoints();
  updateStreak();

  if (state.garden) {
    gardenImage.src = state.garden.image;
  } else {
    gardenImage.src = "assets/garden/vacant.png";
  }

  renderSeedInventory();
}

// =========================
// Popup Messages
// =========================
function showPopupMessage(message) {
  popupMessage.textContent = message;
  popupMessage.classList.remove("hidden");
  setTimeout(() => popupMessage.classList.add("hidden"), 2000);
}

// =========================
// Event Listeners
// =========================
waterBtn.addEventListener("click", waterPlant);
harvestBtn.addEventListener("click", harvestPlant);
buyWaterBtn.addEventListener("click", buyWater);

gardenImage.addEventListener("click", () => {
  if (state.garden) {
    showPopupMessage(
      `${state.garden.name} — ${state.garden.requiredWater - (state.garden.watered || 0)} waters until harvest!`
    );
  } else {
    showPopupMessage("No plant in garden!");
  }
});

// =========================
// Init
// =========================
loadState();
updateDailyStreak();
render();
