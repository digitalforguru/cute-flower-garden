// --------------------
// Variables & DOM
// --------------------
const lotusPointsEl = document.getElementById("lotus-points-value");
const gardenImage = document.getElementById("garden-image");
const seedInventoryEl = document.getElementById("seed-inventory");
const streakCountEl = document.getElementById("streak-count");
const vaseCollectionEl = document.getElementById("vase-collection");

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

const themeDots = document.querySelectorAll(".theme-dot");
const gardenWidget = document.getElementById("garden-widget");
const vaseWidget = document.getElementById("vase-widget");

const STORAGE_KEY = "cuteGardenState";

// --------------------
// Game State
// --------------------
const flowers = {
  daisy: { rarity: "common", water: 15, cost: 50, img: "daisy" },
  marigold: { rarity: "common", water: 20, cost: 75, img: "marigold" },
  pansies: { rarity: "common", water: 25, cost: 100, img: "pansies" },
  nasturtium: { rarity: "common", water: 30, cost: 125, img: "nasturtium" },
  geranium: { rarity: "common", water: 35, cost: 150, img: "geranium" },
  begonia: { rarity: "common", water: 40, cost: 175, img: "begonia" },
  sunflowers: { rarity: "common", water: 45, cost: 200, img: "sunflower" },
  cosmos: { rarity: "common", water: 50, cost: 225, img: "cosmos" },

  bluebells: { rarity: "uncommon", water: 55, cost: 300, img: "bluebells" },
  snapdragon: { rarity: "uncommon", water: 60, cost: 350, img: "snapdragon" },
  morningglory: { rarity: "uncommon", water: 65, cost: 400, img: "morningglory" },
  tulip: { rarity: "uncommon", water: 70, cost: 450, img: "tulip" },
  freesia: { rarity: "uncommon", water: 75, cost: 500, img: "freesia" },
  anemone: { rarity: "uncommon", water: 80, cost: 550, img: "anemone" },
  lavender: { rarity: "uncommon", water: 90, cost: 600, img: "lavender" },
  daffodil: { rarity: "uncommon", water: 100, cost: 650, img: "daffodil" },

  cherryblossom: { rarity: "rare", water: 90, cost: 800, img: "cherryblossom" },
  lily: { rarity: "rare", water: 100, cost: 900, img: "lily" },
  rose: { rarity: "rare", water: 110, cost: 1000, img: "rose" },
  dahlia: { rarity: "rare", water: 120, cost: 1100, img: "dahlia" },
  hibiscus: { rarity: "rare", water: 130, cost: 1200, img: "hibiscus" },
  peonies: { rarity: "rare", water: 140, cost: 1300, img: "peonies" },
  gardenia: { rarity: "rare", water: 150, cost: 1400, img: "gardenia" },
  orchid: { rarity: "rare", water: 160, cost: 1500, img: "orchid" },

  dandelionsummer: { rarity: "epic", water: 150, cost: 2000, img: "dandelionsummer" },
  maplesaplingfall: { rarity: "epic", water: 165, cost: 2200, img: "maplesaplingfall" },
  helleborewinter: { rarity: "epic", water: 180, cost: 2400, img: "helleborewinter" },
  irisflowerspring: { rarity: "epic", water: 195, cost: 2600, img: "irisflowerspring" },

  bleedingheartsvalentines: { rarity: "legendary", water: 210, cost: 2800, img: "bleedingheartsvalentines" },
  shamrockcloverstp: { rarity: "legendary", water: 225, cost: 3000, img: "shamrockcloverstp" },
  ipheionstarflower4th: { rarity: "legendary", water: 250, cost: 5000, img: "ipheionstarflower4th" },
  poinsettiacristmas: { rarity: "legendary", water: 300, cost: 5500, img: "poinsettiacristmas" },
  taccabathalloween: { rarity: "legendary", water: 350, cost: 6000, img: "taccabathalloween" },
};

const seeds = Object.keys(flowers);

const state = {
  lotusPoints: 20,
  streak: 0,
  currentFlower: null,
  flowerStage: "seedstage",
  harvestedFlowers: [],
  seedInventory: {},
  waterGiven: {},
  theme: "pink",
  seedJournalIndex: 0,
  lastLoginDate: null
};

// Initialize waterGiven and seedInventory
seeds.forEach(f => {
  state.waterGiven[f] = 0;
  state.seedInventory[f] = 0;
});

// --------------------
// Save / Load State
// --------------------
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  const parsed = JSON.parse(saved);
  Object.assign(state, parsed);
  state.seedInventory = { ...parsed.seedInventory };
  state.waterGiven = { ...parsed.waterGiven };
}

// --------------------
// Utility Functions
// --------------------
function showPopup(message) {
  popupMessage.textContent = message;
  popupMessage.classList.add("visible");
  setTimeout(() => popupMessage.classList.remove("visible"), 2000);
}

function updateLotusPoints() {
  lotusPointsEl.textContent = state.lotusPoints;
  saveState();
}

function updateStreak() {
  streakCountEl.textContent = state.streak;
}

function applyTheme() {
  gardenWidget.className = `theme-${state.theme}`;
  vaseWidget.className = `theme-${state.theme}`;
  themeDots.forEach(dot => {
    const isActive = dot.dataset.theme === state.theme;
    dot.classList.toggle("active", isActive);
    dot.setAttribute("aria-checked", isActive);
    dot.tabIndex = isActive ? 0 : -1;
  });
}

// --------------------
// Garden Image
// --------------------
function updateGardenImage() {
  if (!state.currentFlower) {
    gardenImage.src = "assets/garden/vacant.png";
    gardenImage.alt = "empty garden";
  } else {
    const stage = state.flowerStage;
    gardenImage.src = `assets/flowers/${state.currentFlower}-${stage}.png`;
    gardenImage.alt = `${state.currentFlower} at ${stage}`;
  }
}

// --------------------
// Vase Collection
// --------------------
function updateVaseCollection() {
  vaseCollectionEl.innerHTML = "";
  if (state.harvestedFlowers.length === 0) {
    const p = document.createElement("p");
    p.textContent = "no harvested flowers yet";
    vaseCollectionEl.appendChild(p);
    return;
  }
  state.harvestedFlowers.forEach(f => {
    const img = document.createElement("img");
    img.src = `assets/vase/vase-${f}.png`;
    img.alt = f;
    img.className = "vase-item";
    vaseCollectionEl.appendChild(img);
  });
}

// --------------------
// Seed Inventory
// --------------------
function updateSeedInventory() {
  seedInventoryEl.innerHTML = "";
  Object.keys(state.seedInventory).forEach(f => {
    const count = state.seedInventory[f];
    if (count <= 0) return;
    const flower = flowers[f];

    const div = document.createElement("div");
    div.className = "seed-item";
    div.dataset.seed = f;
    div.tabIndex = 0;
    div.innerHTML = `
      <img src="assets/seedbags/${flower.img}-seed.png" alt="${f}" class="seed-img"/>
      <p class="seed-name">${f}</p>
      <p class="seed-rarity rarity-${flower.rarity}">${flower.rarity}</p>
      <p class="seed-count">x${count}</p>
    `;
    div.addEventListener("click", () => plantSeed(f));
    seedInventoryEl.appendChild(div);
  });
}

// --------------------
// Plant / Water / Harvest
// --------------------
function plantSeed(f) {
  if (state.seedInventory[f] <= 0) {
    showPopup(`No ${f} seeds`);
    return;
  }
  state.currentFlower = f;
  state.flowerStage = "seedstage";
  state.seedInventory[f]--;
  updateGardenImage();
  updateSeedInventory();
  showPopup(`Planted ${f} 🌱`);
  saveState();
}

let dailyWaterCount = 0;
let lastWaterDate = null;
function resetDailyWaterIfNeeded() {
  const today = new Date().toDateString();
  if (lastWaterDate !== today) {
    dailyWaterCount = 0;
    lastWaterDate = today;
  }
}

function waterFlower() {
  resetDailyWaterIfNeeded();
  if (!state.currentFlower) return showPopup("Plant a seed first 🌱");
  if (dailyWaterCount >= 25) return showPopup("Daily water limit reached");

  state.waterGiven[state.currentFlower]++;
  dailyWaterCount++;

  const flower = flowers[state.currentFlower];
  const progress = state.waterGiven[state.currentFlower];

  if (progress >= flower.water) {
    showPopup(`${state.currentFlower} fully watered 🌸`);
  } else {
    showPopup(`Watered ${state.currentFlower} 💧 (${progress}/${flower.water})`);
  }

  // Update growth stage
  const stages = ["seedstage", "sproutstage", "midgrowth", "matureflower"];
  let idx = stages.indexOf(state.flowerStage);
  if (idx < stages.length - 1) state.flowerStage = stages[idx + 1];

  updateGardenImage();
  updateSeedInventory();
  saveState();
}

function harvestFlower() {
  if (!state.currentFlower) return showPopup("Plant a seed first 🌱");

  const flower = flowers[state.currentFlower];
  const water = state.waterGiven[state.currentFlower];
  if (water < flower.water) return showPopup(`Needs ${flower.water - water} more water`);

  // Harvest
  state.harvestedFlowers.push(state.currentFlower);
  state.lotusPoints += flower.cost;
  state.waterGiven[state.currentFlower] = 0;
  state.currentFlower = null;
  state.flowerStage = "seedstage";
  updateGardenImage();
  updateVaseCollection();
  updateLotusPoints();
  updateSeedInventory();
  showPopup("Harvested flower 🌸");
  saveState();
}

// --------------------
// Buy Water / Seeds
// --------------------
function buyWater() {
  if (state.lotusPoints < 3) return showPopup("Need 3 lotus points to buy water");
  state.lotusPoints -= 3;
  updateLotusPoints();
  showPopup("Bought water 💧");
}

function getSeedCost(f) {
  return flowers[f].cost;
}

function buySeed(f) {
  const cost = getSeedCost(f);
  if (state.lotusPoints < cost) return showPopup(`Need ${cost} lotus points`);
  state.lotusPoints -= cost;
  state.seedInventory[f]++;
  updateLotusPoints();
  updateSeedInventory();
  showPopup(`Bought 1 ${f} seed 🌱`);
  saveState();
}

// --------------------
// Seed Journal
// --------------------
function updateSeedJournalCard() {
  const idx = state.seedJournalIndex;
  const f = seeds[idx];
  const flower = flowers[f];
  const isLocked = state.seedInventory[f] === 0 && !state.harvestedFlowers.includes(f);
  seedJournalCard.innerHTML = `
    <img src="assets/seedjournal/${flower.img}-seed${isLocked ? "-locked" : ""}.png" alt="${f}" />
    <p>${f}</p>
    <p class="rarity-${flower.rarity}">${flower.rarity}</p>
    <p>Water: ${flower.water}</p>
    <p>Cost: ${flower.cost}</p>
  `;
}

function prevSeedJournal() {
  if (state.seedJournalIndex > 0) state.seedJournalIndex--;
  updateSeedJournalCard();
}

function nextSeedJournal() {
  if (state.seedJournalIndex < seeds.length - 1) state.seedJournalIndex++;
  updateSeedJournalCard();
}

// --------------------
// Theme Buttons
// --------------------
themeDots.forEach(dot => {
  dot.addEventListener("click", () => {
    state.theme = dot.dataset.theme;
    applyTheme();
    saveState();
  });
});

// --------------------
// Event Listeners
// --------------------
waterBtn.addEventListener("click", waterFlower);
harvestBtn.addEventListener("click", harvestFlower);
buyWaterBtn.addEventListener("click", buyWater);

seedJournalBtn.addEventListener("click", () => {
  seedJournalPopup.classList.toggle("hidden");
  updateSeedJournalCard();
});
buySeedListBtn.addEventListener("click", () => {
  buySeedsPopup.classList.toggle("hidden");
  renderBuySeedsList();
});

closeJournalBtn.addEventListener("click", () => seedJournalPopup.classList.add("hidden"));
closeBuySeedsBtn.addEventListener("click", () => buySeedsPopup.classList.add("hidden"));

prevSeedBtn.addEventListener("click", prevSeedJournal);
nextSeedBtn.addEventListener("click", nextSeedJournal);

// Buy Seeds Popup
const buySeedsListEl = document.getElementById("buy-seeds-list");
function renderBuySeedsList() {
  buySeedsListEl.innerHTML = "";
  seeds.forEach(f => {
    const li = document.createElement("li");
    const flower = flowers[f];
    li.innerHTML = `
            <span class="seed-name">${f}</span>
      <span class="rarity rarity-${flower.rarity}">${flower.rarity}</span>
      <span class="seed-cost">Cost: ${flower.cost} LP</span>
    `;
    li.tabIndex = 0;
    li.className = "buy-seed-item";
    li.addEventListener("click", () => {
      buySeed(f);
      renderBuySeedsList(); // Update inventory in shop view
    });
    buySeedsListEl.appendChild(li);
  });
}

// --------------------
// Daily Streak Logic
// --------------------
function checkDailyStreak() {
  const today = new Date().toDateString();
  if (state.lastLoginDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (state.lastLoginDate === yesterday) {
      state.streak++;
    } else {
      state.streak = 1;
    }
    state.lastLoginDate = today;
    updateStreak();
    saveState();
  }
}

// --------------------
// Initialization
// --------------------
function initGame() {
  loadState();
  updateLotusPoints();
  updateStreak();
  applyTheme();
  updateGardenImage();
  updateSeedInventory();
  updateVaseCollection();
  checkDailyStreak();
}

initGame();
