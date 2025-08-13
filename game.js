// Variables
const lotusPointsEl = document.getElementById("lotus-points-value");
const gardenImage = document.getElementById("garden-image");
const seedInventoryEl = document.getElementById("seed-inventory");
const noSeedsText = document.getElementById("no-seeds-text");
const streakCountEl = document.getElementById("streak-count");

const waterBtn = document.getElementById("water-btn");
const harvestBtn = document.getElementById("harvest-btn");
const buyWaterBtn = document.getElementById("buy-water-btn");

const seedJournalBtn = document.getElementById("seed-journal-btn");
const buySeedListBtn = document.getElementById("buy-seed-list-btn");
const seedJournalPopup = document.getElementById("seed-journal-popup");
const buySeedsPopup = document.getElementById("buy-seeds-popup");
const closeJournalBtn = document.getElementById("close-journal-btn");
const closeBuySeedsBtn = document.getElementById("close-buy-seeds-btn");

const seedJournalCard = document.getElementById("seed-journal-card");
const prevSeedBtn = document.getElementById("prev-seed-btn");
const nextSeedBtn = document.getElementById("next-seed-btn");

const popupMessage = document.getElementById("popup-message");

const vaseCollectionEl = document.getElementById("vase-collection");

const themeDots = document.querySelectorAll(".theme-dot");
const gardenWidget = document.getElementById("garden-widget");
const vaseWidget = document.getElementById("vase-widget");
const STORAGE_KEY = "cuteGardenState";

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    const parsed = JSON.parse(savedState);

    // Copy stored properties back into the state object
    Object.assign(state, parsed);

    // For nested objects like seedInventory, deep copy might be needed if mutated
    if (parsed.seedInventory) {
      state.seedInventory = {...parsed.seedInventory};
    }
    if (parsed.harvestedFlowers) {
      state.harvestedFlowers = [...parsed.harvestedFlowers];
    }
  }
}
}function updateLotusPoints() {
  lotusPointsEl.textContent = state.lotusPoints;
  saveState();
}
// Asset & Data Setup
const seeds = [
  "bluebells", "lily", "marigold", "daisy", "sunflower", "rose",
  "snapdragons", "peonies", "pansies", "cherryblossom", "lavender", "tulip"
];

// Store for game state
const state = {
  lotusPoints: 20,
  streak: 0,
  currentFlower: null,
  flowerStage: "seedstage",
  harvestedFlowers: [],
  seedInventory: {},
  seedJournalIndex: 0,
  theme: "pink",

  lastLoginDate: null  // <-- add this here
};

// Initialize seed inventory with 0 seeds
seeds.forEach(seed => state.seedInventory[seed] = 0);
function updateDailyStreak() {
  const today = new Date().toDateString();

  // First-time login or no previous date saved
  if (!state.lastLoginDate) {
    state.streak = 1;
    state.lastLoginDate = today;
    saveState();
    updateStreak();
    return;
  }

  if (state.lastLoginDate === today) {
    // Already logged in today, do nothing
    return;
  }

  const lastDate = new Date(state.lastLoginDate);
  const diffTime = new Date(today) - lastDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays === 1) {
    // Consecutive day: increment streak
    state.streak++;
  } else {
    // Missed day(s): reset streak
    state.streak = 1;
  }

  state.lastLoginDate = today;
  saveState();
  updateStreak();
}
// Utility function: update lotus points display
function updateLotusPoints() {
  lotusPointsEl.textContent = state.lotusPoints;
}

// Utility function: update streak display
function updateStreak() {
  streakCountEl.textContent = state.streak;
}

// Utility: update garden image
function updateGardenImage() {
  if (!state.currentFlower) {
    gardenImage.src = "assets/garden/vacant.png";
    gardenImage.alt = "empty garden";
  } else {
    const stage = state.flowerStage;
    const imgPath = `assets/flowers/${state.currentFlower}-${stage}.png`;
    gardenImage.src = imgPath;
    gardenImage.alt = `${state.currentFlower} at ${stage.replace("stage", "")}`;
  }
}

// Update seed inventory display
function updateSeedInventory() {
  seedInventoryEl.innerHTML = "";
  let hasSeeds = false;
  seeds.forEach(seed => {
    const count = state.seedInventory[seed];
    if (count > 0) {
      hasSeeds = true;
      const seedDiv = document.createElement("div");
      seedDiv.className = "seed-item";
      seedDiv.setAttribute("tabindex", "0");
      seedDiv.setAttribute("role", "listitem");
      seedDiv.setAttribute("aria-label", `${seed} seed, count ${count}`);
      seedDiv.dataset.seed = seed;

      const img = document.createElement("img");
      img.src = `assets/seedbags/${seed}-seedbag.png`;
      img.alt = `${seed} seed bag`;
      seedDiv.appendChild(img);

      const label = document.createElement("span");
      label.className = "seed-name";
      label.textContent = `${seed} (${count})`;
      seedDiv.appendChild(label);

      seedInventoryEl.appendChild(seedDiv);
    }
  });
  noSeedsText.style.display = hasSeeds ? "none" : "block";
}

// Update vase shelf display
function updateVaseCollection() {
  vaseCollectionEl.innerHTML = "";
  if (state.harvestedFlowers.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "no harvested flowers yet";
    emptyMsg.style.fontSize = "11px";
    emptyMsg.style.color = "var(--primary-color)";
    vaseCollectionEl.appendChild(emptyMsg);
    return;
  }
  state.harvestedFlowers.forEach(flower => {
    const vaseImg = document.createElement("img");
    vaseImg.className = "vase-item";
    vaseImg.src = `assets/vase/vase-${flower}.png`;
    vaseImg.alt = `vase with ${flower} flower`;
    vaseCollectionEl.appendChild(vaseImg);
  });
}

// Show popup message with auto hide
function showPopupMessage(message) {
  popupMessage.textContent = message;
  popupMessage.classList.add("visible");
  setTimeout(() => {
    popupMessage.classList.remove("visible");
  }, 2500);
}

// Plant seed handler
function plantSeed(seedName) {
  if (state.seedInventory[seedName] > 0) {
    state.currentFlower = seedName;
    state.flowerStage = "seedstage";
    state.seedInventory[seedName]--;
    updateGardenImage();
    updateSeedInventory();
    showPopupMessage(`planted ${seedName} seed 🌱`);
  } else {
    showPopupMessage(`no ${seedName} seeds available`);
  }
}

// Water flower handler
function waterFlower() {
  if (!state.currentFlower) {
    showPopupMessage("plant a seed first 🌱");
    return;
  }
  const stages = ["seedstage", "sproutstage", "midgrowth", "matureflower"];
  let currentIndex = stages.indexOf(state.flowerStage);
  if (currentIndex < stages.length - 1) {
    state.flowerStage = stages[currentIndex + 1];
    updateGardenImage();
    showPopupMessage(`your ${state.currentFlower} grew! 🌸`);
  } else {
    showPopupMessage("flower is already mature 🌼");
  }
}

// Harvest flower handler
function harvestFlower() {
  if (!state.currentFlower) {
    showPopupMessage("plant and grow a flower first 🌱");
    return;
  }
  if (state.flowerStage !== "matureflower") {
    showPopupMessage("flower is not mature yet 🌸");
    return;
  }
  // Add to harvested
  if (!state.harvestedFlowers.includes(state.currentFlower)) {
    state.harvestedFlowers.push(state.currentFlower);
  }
  // Add lotus points for harvest
  state.lotusPoints += 5;
  updateLotusPoints();

  showPopupMessage(`harvested ${state.currentFlower} 🌼 +5 points`);

  // Reset garden
  state.currentFlower = null;
  state.flowerStage = "seedstage";
  updateGardenImage();
  updateVaseCollection();
}

// Buy water handler
function buyWater() {
  if (state.lotusPoints < 3) {
    showPopupMessage("need 3 points to buy water 💧");
    return;
  }
  state.lotusPoints -= 3;
  updateLotusPoints();
  showPopupMessage("bought water 💧");
}

// Seed inventory click handler to plant seed
seedInventoryEl.addEventListener("click", e => {
  const seedDiv = e.target.closest(".seed-item");
  if (seedDiv) {
    const seedName = seedDiv.dataset.seed;
    plantSeed(seedName);
  }
});

seedInventoryEl.addEventListener("keydown", e => {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("seed-item")) {
    e.preventDefault();
    plantSeed(e.target.dataset.seed);
  }
});

// Button event listeners
waterBtn.addEventListener("click", waterFlower);
harvestBtn.addEventListener("click", harvestFlower);
buyWaterBtn.addEventListener("click", buyWater);

// Theme switching handler
themeDots.forEach(dot => {
  dot.addEventListener("click", () => {
    const newTheme = dot.dataset.theme;
    if (state.theme === newTheme) return;

    state.theme = newTheme;

    // Update garden and vase theme classes
    gardenWidget.className = "";
    gardenWidget.classList.add(`theme-${newTheme}`);
    vaseWidget.className = "";
    vaseWidget.classList.add(`theme-${newTheme}`);

    // Update theme dots aria-checked and tabindex
    themeDots.forEach(td => {
      td.setAttribute("aria-checked", td.dataset.theme === newTheme ? "true" : "false");
      td.tabIndex = td.dataset.theme === newTheme ? 0 : -1;
    });
  });
});

// Seed journal navigation variables
let currentJournalIndex = 0;

function openSeedJournal() {
  seedJournalPopup.classList.remove("hidden");
  seedJournalBtn.setAttribute("aria-expanded", "true");
  currentJournalIndex = 0;
  updateSeedJournalCard();
  seedJournalPopup.focus();
}

function closeSeedJournal() {
  seedJournalPopup.classList.add("hidden");
  seedJournalBtn.setAttribute("aria-expanded", "false");
  seedJournalBtn.focus();
}

function updateSeedJournalCard() {
  const flower = seeds[currentJournalIndex];
  const imgSrc = `assets/seedjournal/${flower}-seed.png`;
  const isLocked = state.seedInventory[flower] === 0 && !state.harvestedFlowers.includes(flower);
  seedJournalCard.innerHTML = `
    <img src="${isLocked ? "assets/seedjournal/locked-seed.png" : imgSrc}" alt="${flower} seed journal card" />
    <p>${flower}</p>
    <p>${isLocked ? "locked" : "unlocked"}</p>
    <p>cost: 5 lotus points</p>
  `;
}

function prevSeedJournal() {
  if (currentJournalIndex > 0) {
    currentJournalIndex--;
    updateSeedJournalCard();
  }
}

function nextSeedJournal() {
  if (currentJournalIndex < seeds.length - 1) {
    currentJournalIndex++;
    updateSeedJournalCard();
  }
}

// Buy seeds popup (simplified example)
function openBuySeedsPopup() {
  buySeedsPopup.classList.remove("hidden");
  buySeedListBtn.setAttribute("aria-expanded", "true");
  buySeedsPopup.focus();
  renderBuySeedsList();
}

function closeBuySeedsPopup() {
  buySeedsPopup.classList.add("hidden");
  buySeedListBtn.setAttribute("aria-expanded", "false");
  buySeedListBtn.focus();
}

const buySeedsListEl = document.getElementById("buy-seeds-list");

function renderBuySeedsList() {
  buySeedsListEl.innerHTML = "";
  seeds.forEach(seed => {
    const li = document.createElement("li");
    li.textContent = `${seed} - 5 lotus points`;
    li.tabIndex = 0;
    li.dataset.seed = seed;
    buySeedsListEl.appendChild(li);
  });
}

// Buy seeds click handler
buySeedsListEl.addEventListener("click", e => {
  if (e.target.tagName === "LI") {
    const seed = e.target.dataset.seed;
    buySeed(seed);
  }
});
buySeedsListEl.addEventListener("keydown", e => {
  if ((e.key === "Enter" || e.key === " ") && e.target.tagName === "LI") {
    e.preventDefault();
    const seed = e.target.dataset.seed;
    buySeed(seed);
  }
});

function buySeed(seedName) {
  if (state.lotusPoints < 5) {
    showPopupMessage("need 5 lotus points to buy seed");
    return;
  }
  state.lotusPoints -= 5;
  state.seedInventory[seedName]++;
  updateLotusPoints();
  updateSeedInventory();
  showPopupMessage(`bought 1 ${seedName} seed 🌱`);
  closeBuySeedsPopup();
}

// Event listeners for popups close buttons
closeJournalBtn.addEventListener("click", closeSeedJournal);
closeBuySeedsBtn.addEventListener("click", closeBuySeedsPopup);

// Open popups buttons
seedJournalBtn.addEventListener("click", () => {
  if (seedJournalPopup.classList.contains("hidden")) openSeedJournal();
  else closeSeedJournal();
});
buySeedListBtn.addEventListener("click", () => {
  if (buySeedsPopup.classList.contains("hidden")) openBuySeedsPopup();
  else closeBuySeedsPopup();
});

// Seed journal navigation buttons
prevSeedBtn.addEventListener("click", prevSeedJournal);
nextSeedBtn.addEventListener("click", nextSeedJournal);

// Keyboard navigation for popups ESC to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!seedJournalPopup.classList.contains("hidden")) closeSeedJournal();
    if (!buySeedsPopup.classList.contains("hidden")) closeBuySeedsPopup();
  }
});

// Initialize UI with default state
updateLotusPoints();
updateStreak();
updateGardenImage();
updateSeedInventory();
updateVaseCollection();

// --- ADDITIONS & UPDATES ONLY ---
// Variables & DOM (add this for garden click text handler and streak display container)
const gardenSection = document.getElementById("garden-section");


// Track daily water usage & last water date for reset
let dailyWaterCount = 0;
let lastWaterDate = null;

// Helper: reset daily water count if date changed
function resetDailyWaterIfNeeded() {
  const today = new Date().toDateString();
  if (lastWaterDate !== today) {
    dailyWaterCount = 0;
    lastWaterDate = today;
  }
}

// Update streak: add function to update display, move streak count near lotus points
function updateStreak() {
  streakCountEl.textContent = state.streak;
  // Also update streak display near lotus points in header (create/update span if missing)
  let streakDisplay = document.querySelector(".streak-display");
  if (!streakDisplay) {
    streakDisplay = document.createElement("span");
    streakDisplay.className = "streak-display";
    // Insert streak display after lotus points in header
    const header = document.querySelector(".widget-header");
    const lotusPointsDiv = document.getElementById("lotus-points");
    if (header && lotusPointsDiv) {
      const container = document.createElement("div");
      container.className = "header-right";
      container.appendChild(lotusPointsDiv);
      container.appendChild(streakDisplay);
      header.appendChild(container);
    }
  }
  streakDisplay.textContent = `daily login streak: ${state.streak} 𖤣.𖥧.𖡼.⚘`;
}

// Call updateStreak once here to initialize streak display in header
updateStreak();

// Garden section click handler for flower info or alert
gardenSection.addEventListener("click", () => {
  if (!state.currentFlower) {
    showPopupMessage("plant seed first!");
  } else {
    openSeedJournal(); // Opens flower info (seed journal) on garden click
  }
});

// Water flower handler update: add daily water limit check and reset logic
function waterFlower() {
  resetDailyWaterIfNeeded();
  if (!state.currentFlower) {
    showPopupMessage("plant a seed first 🌱");
    return;
  }
  if (dailyWaterCount >= 25) {
    showPopupMessage("daily watering limit reached 💧");
    return;
  }
  const stages = ["seedstage", "sproutstage", "midgrowth", "matureflower"];
  let currentIndex = stages.indexOf(state.flowerStage);
  if (currentIndex < stages.length - 1) {
    state.flowerStage = stages[currentIndex + 1];
    updateGardenImage();
    showPopupMessage(`your ${state.currentFlower} grew! 🌸`);
    dailyWaterCount++;
  } else {
    showPopupMessage("flower is already mature 🌼");
  }
}

// Buy seed cost increases by seed index (easy to hard flowers cost more)
function getSeedCost(seedName) {
  const index = seeds.indexOf(seedName);
  if (index === -1) return 5; // fallback
  return 5 + index * 2; // base 5 + 2 points per seed index step
}

// Update buy seeds popup rendering with dynamic costs
function renderBuySeedsList() {
  buySeedsListEl.innerHTML = "";
  seeds.forEach(seed => {
    const cost = getSeedCost(seed);
    const li = document.createElement("li");
    li.textContent = `${seed} - ${cost} lotus points`;
    li.tabIndex = 0;
    li.dataset.seed = seed;
    buySeedsListEl.appendChild(li);
  });
}

// Buy seed handler update to use dynamic cost
function buySeed(seedName) {
  const cost = getSeedCost(seedName);
  if (state.lotusPoints < cost) {
    showPopupMessage(`need ${cost} lotus points to buy seed`);
    return;
  }
  state.lotusPoints -= cost;
  state.seedInventory[seedName]++;
  updateLotusPoints();
  updateSeedInventory();
  showPopupMessage(`bought 1 ${seedName} seed 🌱`);
  closeBuySeedsPopup();
}

loadState();       // Load saved state first
updateDailyStreak();  // Update streak based on last login date

// Then update UI
updateLotusPoints();
updateStreak();
updateGardenImage();
updateSeedInventory();
updateVaseCollection();
