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

// New variables for daily water limit and garden click
let dailyWaterCount = 0;
let lastWaterDate = null;
const gardenSection = document.getElementById("garden-section");

// Asset & Data Setup
const seeds = [
  "bluebells", "lily", "marigold", "daisy", "sunflower", "rose",
  "snapdragons", "peonies", "pansies", "cherryblossom", "lavender", "tulip"
];

// Store for game state
const state = {
  lotusPoints: 20,
  streak: 0,
  currentFlower: null, // string of flower name
  flowerStage: "seedstage", // seedstage, sproutstage, midgrowth, matureflower
  harvestedFlowers: [],
  seedInventory: {},
  seedJournalIndex: 0,
  theme: "pink"
};

// Initialize seed inventory with 0 seeds
seeds.forEach(seed => state.seedInventory[seed] = 0);

// Utility function: update lotus points display
function updateLotusPoints() {
  lotusPointsEl.textContent = state.lotusPoints;
}

// Updated utility function: update streak display and add near lotus points
function updateStreak() {
  streakCountEl.textContent = state.streak;

  let streakDisplay = document.querySelector(".streak-display");
  if (!streakDisplay) {
    streakDisplay = document.createElement("span");
    streakDisplay.className = "streak-display";
    streakDisplay.style.marginLeft = "12px";
    streakDisplay.style.fontWeight = "300";
    streakDisplay.style.fontSize = "0.9rem";
    streakDisplay.style.color = "var(--primary-color)";

    const lotusPointsValue = document.getElementById("lotus-points-value");
    if (lotusPointsValue && lotusPointsValue.parentNode) {
      lotusPointsValue.parentNode.appendChild(streakDisplay);
    }
  }
  streakDisplay.textContent = `daily login streak: ${state.streak} ⟢`;
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

// Daily water reset helper
function resetDailyWaterIfNeeded() {
  const today = new Date().toDateString();
  if (lastWaterDate !== today) {
    dailyWaterCount = 0;
    lastWaterDate = today;
  }
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

// Updated water flower handler with daily water limit
function waterFlower() {
  resetDailyWaterIfNeeded();
  if (dailyWaterCount >= 25) {
    showPopupMessage("daily watering limit reached 💧");
    return;
  }

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
    dailyWaterCount++;
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

// Garden click opens seed journal or popup if no seed planted
gardenSection.addEventListener("click", () => {
  if (!state.currentFlower) {
    showPopupMessage("plant seed first!");
  } else {
    openSeedJournal();
  }
});

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
    <p>cost: ${getSeedCost(flower)} lotus points</p>
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

// Buy seeds popup (dynamic cost list)
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

// Dynamic cost for seeds
function getSeedCost(seedName) {
  const index = seeds.indexOf(seedName);
  if (index === -1) return 5; // default cost
  return 5 + index * 2; // cost increases by 2 per seed index
}

// Render buy seeds list with dynamic costs
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

// Button event listeners
waterBtn.addEventListener("click", waterFlower);
harvestBtn.addEventListener("click", harvestFlower);
buyWaterBtn.addEventListener("click", buyWater);

// Initialize UI with default state and reset daily water count
resetDailyWaterIfNeeded();
updateLotusPoints();
updateStreak();
updateGardenImage();
updateSeedInventory();
updateVaseCollection();
