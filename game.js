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
function updateStreak() {
  streakCountEl.textContent = state.streak;

  // Also update streak display near lotus points in header
  let streakDisplay = document.querySelector(".streak-display");
  if (!streakDisplay) {
    streakDisplay = document.createElement("span");
    streakDisplay.className = "streak-display";
    streakDisplay.style.marginLeft = "0.6rem";
    streakDisplay.style.fontSize = "0.8rem";
    streakDisplay.style.color = "var(--primary-color)";
    
    const header = document.querySelector(".widget-header");
    if (header) {
      header.appendChild(streakDisplay);
    }
  }
  streakDisplay.textContent = `daily login streak: ${state.streak} 𖤣.𖥧.𖡼.⚘`;
}function updateLotusPoints() {
  lotusPointsEl.textContent = state.lotusPoints;
  saveState();
}
// Asset & Data Setup
const flowers = {
  daisy: { rarity: "common", water: 15, reward: 50 },
  marigold: { rarity: "common", water: 20, reward: 75 },
  pansies: { rarity: "common", water: 25, reward: 100 },
  nasturtium: { rarity: "common", water: 30, reward: 125 },
  geranium: { rarity: "common", water: 35, reward: 150 },
  begonia: { rarity: "common", water: 40, reward: 175 },
  sunflowers: { rarity: "common", water: 45, reward: 200 },
  cosmos: { rarity: "common", water: 50, reward: 225 },

  bluebells: { rarity: "uncommon", water: 55, reward: 300 },
  snapdragons: { rarity: "uncommon", water: 60, reward: 350 },
  morningglory: { rarity: "uncommon", water: 65, reward: 400 },
  tulips: { rarity: "uncommon", water: 70, reward: 450 },
  freesia: { rarity: "uncommon", water: 75, reward: 500 },
  anemone: { rarity: "uncommon", water: 80, reward: 550 },
  lavender: { rarity: "uncommon", water: 90, reward: 600 },
  daffodils: { rarity: "uncommon", water: 100, reward: 650 },

  cherryblossom: { rarity: "rare", water: 90, reward: 800 },
  lily: { rarity: "rare", water: 100, reward: 900 },
  rose: { rarity: "rare", water: 110, reward: 1000 },
  dahlia: { rarity: "rare", water: 120, reward: 1100 },
  hibiscus: { rarity: "rare", water: 130, reward: 1200 },
  peonies: { rarity: "rare", water: 140, reward: 1300 },
  gardenia: { rarity: "rare", water: 150, reward: 1400 },
  orchid: { rarity: "rare", water: 160, reward: 1500 },

  dandelionsummer: { rarity: "epic", water: 150, reward: 2000 },
  maplesaplingfall: { rarity: "epic", water: 165, reward: 2200 },
  helleborewinter: { rarity: "epic", water: 180, reward: 2400 },
  irisflowerspring: { rarity: "epic", water: 195, reward: 2600 },

  bleedingheartsvalentines: { rarity: "legendary", water: 210, reward: 2800 },
  shamrockcloverstp: { rarity: "legendary", water: 225, reward: 3000 },
  ipheionstarflower4th: { rarity: "legendary", water: 250, reward: 5000 },
  poinsettiacristmas: { rarity: "legendary", water: 300, reward: 5500 },
  taccabathalloween: { rarity: "legendary", water: 350, reward: 6000 }
};

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
state.waterGiven = {};
Object.keys(flowers).forEach(flowerName => {
  state.waterGiven[flowerName] = 0;
});
// Initialize seed inventory with 0 seeds
Object.keys(flowers).forEach(flower => {
  state.seedInventory[flower] = 0;
});
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
  const inventoryList = document.getElementById("seedInventory");
  inventoryList.innerHTML = "";

  Object.keys(flowers).forEach(flowerName => {
    const flower = flowers[flowerName];
    const count = state.seedInventory[flowerName];
    const cost = Math.floor(flower.reward / 10);
    const waterProgress = state.waterGiven[flowerName] || 0;
    const rarityBadge = `<span class="rarity-badge rarity-${flower.rarity}">${flower.rarity}</span>`;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${flowerName}</strong> ${rarityBadge} <br/>
      🌱 Seeds: ${count} | 💧 Water: ${waterProgress}/${flower.water} | 🌸 Reward: ${flower.reward} | 💰 Cost: ${cost}
      <br/>
      <button onclick="waterFlower('${flowerName}')">💧 Water</button>
      <button onclick="harvestFlower('${flowerName}')">🌸 Harvest</button>
    `;
    inventoryList.appendChild(li);
  });
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
function waterFlower(flowerName) {
  const flower = flowers[flowerName];
  if (!flower) return;

  // increase water given
  state.waterGiven[flowerName]++;

  // check progress
  const progress = state.waterGiven[flowerName];
  if (progress >= flower.water) {
    showPopupMessage(`💧 ${flowerName} is fully watered and ready to harvest!`);
  } else {
    const remaining = flower.water - progress;
    showPopupMessage(`💧 You watered ${flowerName}. ${remaining} more waters needed.`);
  }

  updateSeedInventory(); // show progress in inventory
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
function harvestFlower(flowerName) {
  const flower = flowers[flowerName];
  if (!flower) return;

  const waterGiven = state.waterGiven?.[flowerName] || 0;
  if (waterGiven < flower.water) {
    showPopupMessage(`💧 ${flowerName} needs ${flower.water - waterGiven} more water before harvest!`);
    return;
  }

  if (state.seedInventory[flowerName] > 0) {
    state.seedInventory[flowerName]--;
    state.harvestedFlowers.push(flowerName);
    state.lotusPoints += flower.reward;

    // reset water after harvesting
    state.waterGiven[flowerName] = 0;

    updateLotusPoints();
    updateSeedInventory();

    showPopupMessage(`🌸 You harvested a ${flowerName}! +${flower.reward} lotus points`);
  } else {
    showPopupMessage(`❌ No ${flowerName} seeds available to harvest.`);
  }
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
  const flowerNames = Object.keys(flowers);
  const flowerName = flowerNames[currentJournalIndex];
  const flower = flowers[flowerName];

  const imgSrc = `assets/seedjournal/${flowerName}-seed.png`;
  const isLocked = state.seedInventory[flowerName] === 0 && !state.harvestedFlowers.includes(flowerName);

  const rarityBadge = `<span class="rarity-badge rarity-${flower.rarity}">${flower.rarity}</span>`;

  seedJournalCard.innerHTML = `
    <img src="${isLocked ? "assets/seedjournal/locked-seed.png" : imgSrc}" alt="${flowerName} seed journal card" />
    <h3>${flowerName} ${rarityBadge}</h3>
    <p>Status: ${isLocked ? "🔒 Locked" : "✅ Unlocked"}</p>
    <p>Reward: 🌸 ${flower.reward} lotus points</p>
    <p>Water Needed: 💧 ${flower.water}</p>
  `;
}
  // Check if locked
  const isLocked = !state.inventory.includes(flowerName) && !state.harvestedFlowers.includes(flowerName);

  // Use specific locked image if locked, otherwise normal seed image
  const imgSrc = isLocked 
    ? `assets/seedjournal/${flowerName}-lockedseed.png`   // specific locked image
    : `assets/seedjournal/${flowerName}-seed.png`;       // normal seed image

  seedJournalCard.innerHTML = `
    <img src="${imgSrc}" alt="${flowerName} seed journal card" />
    <h3>${flowerName}</h3>
    <p>Status: ${isLocked ? "Locked" : "Unlocked"}</p>
    <p>Cost: 5 lotus points</p>
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
  const list = document.getElementById("buySeedsList");
  list.innerHTML = "";

  Object.keys(flowers).forEach(flowerName => {
    const flower = flowers[flowerName];
    const cost = Math.floor(flower.reward / 10); // adjustable later

    const li = document.createElement("li");
    li.innerHTML = `
      <button onclick="buySeed('${flowerName}')">
        Buy ${flowerName} 🌸 
        <span class="rarity-badge rarity-${flower.rarity}">${flower.rarity}</span> 
        (Cost: ${cost} lotus)
      </button>
    `;
    list.appendChild(li);
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

function buySeed(flowerName) {
  const cost = Math.floor(flowers[flowerName].reward / 10); 
  // or set a fixed cost property later

  if (state.lotusPoints < cost) {
    showPopupMessage(`need ${cost} lotus points to buy ${flowerName}`);
    return;
  }
  state.lotusPoints -= cost;
  state.seedInventory[flowerName]++;
  updateLotusPoints();
  updateSeedInventory();
  showPopupMessage(`bought 1 ${flowerName} seed 🌱`);
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
    showPopupMessage("daily watering limit reached :(");
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
