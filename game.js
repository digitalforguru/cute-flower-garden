// ====== VARIABLES & DOM ELEMENTS ======
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
const gardenSection = document.getElementById("garden-section");
const themeDots = document.querySelectorAll(".theme-dot");
const gardenWidget = document.getElementById("garden-widget");
const vaseWidget = document.getElementById("vase-widget");

const STORAGE_KEY = "cuteGardenState";

// ====== GAME STATE ======
const state = {
  lotusPoints: 20,
  streak: 0,
  currentFlower: null,
  flowerStage: "seedstage",
  harvestedFlowers: [],
  seedInventory: {},
  waterGiven: {},
  seedJournalIndex: 0,
  theme: "pink",
  lastLoginDate: null
};

// ====== FLOWERS DATA ======
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
  poinsettiachristmas: { rarity: "legendary", water: 300, reward: 5500 },
  taccabathalloween: { rarity: "legendary", water: 350, reward: 6000 }
};

const seeds = Object.keys(flowers);

// ====== INITIALIZE STATE ======
seeds.forEach(flower => {
  state.seedInventory[flower] = 0;
  state.waterGiven[flower] = 0;
});

// ====== LOCAL STORAGE ======
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    Object.assign(state, JSON.parse(saved));
  }
}

// ====== UTILITY ======
function getRarityColor(rarity) {
  switch(rarity) {
    case "common": return "#a8e6cf";
    case "uncommon": return "#cba4ff";
    case "rare": return "#b71c1c";
    case "epic": return "#9c27b0";
    case "legendary": return "#ffd700";
    default: return "#000";
  }
}

function showPopupMessage(msg) {
  popupMessage.textContent = msg;
  popupMessage.classList.add("visible");
  setTimeout(() => popupMessage.classList.remove("visible"), 2500);
}

// ====== UPDATE UI ======
function updateLotusPoints() {
  lotusPointsEl.textContent = state.lotusPoints;
  saveState();
}

function updateStreak() {
  streakCountEl.textContent = state.streak;
  saveState();
}

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

function updateSeedInventory() {
  seedInventoryEl.innerHTML = "";
  const owned = Object.keys(state.seedInventory).filter(f => state.seedInventory[f] > 0);
  if (owned.length === 0) {
    noSeedsText.style.display = "block";
    return;
  } else noSeedsText.style.display = "none";

  owned.forEach(flowerName => {
    const f = flowers[flowerName];
    const li = document.createElement("div");
    li.className = "seed-item";
    li.dataset.seed = flowerName;
    li.innerHTML = `
      <strong>${flowerName}</strong> <span style="color:${getRarityColor(f.rarity)}">${f.rarity}</span>
      <br/>🌱 ${state.seedInventory[flowerName]} | 💧 ${state.waterGiven[flowerName]}/${f.water} | 🌸 ${f.reward} lotus
      <br/><button onclick="plantSeed('${flowerName}')">Plant 🌱</button>
    `;
    seedInventoryEl.appendChild(li);
  });
}

function updateVaseCollection() {
  vaseCollectionEl.innerHTML = "";
  if (!state.harvestedFlowers.length) {
    const p = document.createElement("p");
    p.textContent = "no harvested flowers yet";
    vaseCollectionEl.appendChild(p);
    return;
  }
  state.harvestedFlowers.forEach(flower => {
    const img = document.createElement("img");
    img.src = `assets/vase/vase-${flower}.png`;
    img.alt = flower;
    img.className = "vase-item";
    vaseCollectionEl.appendChild(img);
  });
}

// ====== SEED JOURNAL ======
let currentJournalIndex = 0;
function updateSeedJournalCard() {
  const flowerName = seeds[currentJournalIndex];
  const f = flowers[flowerName];
  const isLocked = state.seedInventory[flowerName] === 0 && !state.harvestedFlowers.includes(flowerName);
  const imgSrc = isLocked ? `assets/seedjournal/${flowerName}-lockedseed.png` : `assets/seedjournal/${flowerName}-seed.png`;

  seedJournalCard.innerHTML = `
    <img src="${imgSrc}" alt="${flowerName} seed"/>
    <h3>${flowerName} <span style="color:${getRarityColor(f.rarity)}">${f.rarity}</span></h3>
    <p>Status: ${isLocked ? "🔒 Locked" : "✅ Unlocked"}</p>
    <p>Water Needed: 💧 ${f.water}</p>
    <p>Reward: 🌸 ${f.reward}</p>
  `;
}

// ====== PLANT, WATER, HARVEST ======
function plantSeed(seedName) {
  if (!state.seedInventory[seedName] || state.seedInventory[seedName] <= 0) {
    showPopupMessage(`No ${seedName} seeds`);
    return;
  }
  state.currentFlower = seedName;
  state.flowerStage = "seedstage";
  state.seedInventory[seedName]--;
  updateGardenImage();
  updateSeedInventory();
  saveState();
  showPopupMessage(`Planted ${seedName} 🌱`);
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
  const target = state.currentFlower;
  if (!target) { showPopupMessage("Plant a seed first 🌱"); return; }
  if (dailyWaterCount >= 25) { showPopupMessage("Daily watering limit reached"); return; }

  state.waterGiven[target]++;
  dailyWaterCount++;

  const stages = ["seedstage","sproutstage","midgrowth","matureflower"];
  let idx = stages.indexOf(state.flowerStage);
  if (idx < stages.length-1) state.flowerStage = stages[idx+1];

  updateGardenImage();
  updateSeedInventory();
  saveState();

  const f = flowers[target];
  if (state.waterGiven[target] >= f.water) {
    showPopupMessage(`${target} is ready to harvest! 🌸`);
  } else {
    showPopupMessage(`Watered ${target}. ${f.water - state.waterGiven[target]} more to grow`);
  }
}

function harvestFlower() {
  const target = state.currentFlower;
  if (!target) { showPopupMessage("Plant a seed first 🌱"); return; }
  const f = flowers[target];
  if (state.waterGiven[target] < f.water) { showPopupMessage(`${target} needs more water!`); return; }

  state.harvestedFlowers.push(target);
  state.lotusPoints += f.reward;
  state.waterGiven[target] = 0;
  state.currentFlower = null;
  state.flowerStage = "seedstage";

  updateLotusPoints();
  updateVaseCollection();
  updateGardenImage();
  updateSeedInventory();
  saveState();
  showPopupMessage(`Harvested ${target}! 🌸 +${f.reward} lotus`);
}

// ====== BUY WATER & SEEDS ======
function buyWater() {
  if (state.lotusPoints < 3) { showPopupMessage("Need 3 lotus points 💧"); return;  }
  state.lotusPoints -= 3;
  updateLotusPoints();
  showPopupMessage("Bought 1 water 💧");
  saveState();
}

// Example seed shop (buy seeds)
function buySeed(flowerName) {
  const f = flowers[flowerName];
  if (!f) return;

  if (state.lotusPoints < f.reward) {
    showPopupMessage(`Not enough lotus points to buy ${flowerName}`);
    return;
  }

  state.lotusPoints -= f.reward;
  state.seedInventory[flowerName]++;
  updateLotusPoints();
  updateSeedInventory();
  updateBuySeedsList();
  saveState();
  showPopupMessage(`Bought 1 ${flowerName} seed 🌱`);
}

// ====== UPDATE BUY SEEDS LIST ======
function updateBuySeedsList() {
  const listEl = document.getElementById("buy-seeds-list");
  listEl.innerHTML = "";
  seeds.forEach(flowerName => {
    const f = flowers[flowerName];
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${flowerName}</strong> <span style="color:${getRarityColor(f.rarity)}">${f.rarity}</span>
      <br/>Water: ${f.water} | Cost: ${f.reward} lotus
      <br/><button onclick="buySeed('${flowerName}')">Buy Seed 🌱</button>
    `;
    listEl.appendChild(li);
  });
}

// ====== SEED JOURNAL NAVIGATION ======
prevSeedBtn.addEventListener("click", () => {
  currentJournalIndex = (currentJournalIndex - 1 + seeds.length) % seeds.length;
  updateSeedJournalCard();
});

nextSeedBtn.addEventListener("click", () => {
  currentJournalIndex = (currentJournalIndex + 1) % seeds.length;
  updateSeedJournalCard();
});

// ====== POPUP OPEN/CLOSE ======
seedJournalBtn.addEventListener("click", () => {
  seedJournalPopup.classList.remove("hidden");
  updateSeedJournalCard();
});

buySeedListBtn.addEventListener("click", () => {
  buySeedsPopup.classList.remove("hidden");
  updateBuySeedsList();
});

closeJournalBtn.addEventListener("click", () => seedJournalPopup.classList.add("hidden"));
closeBuySeedsBtn.addEventListener("click", () => buySeedsPopup.classList.add("hidden"));

// ====== BUTTON EVENTS ======
waterBtn.addEventListener("click", waterFlower);
harvestBtn.addEventListener("click", harvestFlower);
buyWaterBtn.addEventListener("click", buyWater);

// ====== PLANT SEED FUNCTION ======
window.plantSeed = plantSeed; // expose globally for inline onclick

// ====== THEME SELECTOR ======
themeDots.forEach(dot => {
  dot.addEventListener("click", () => {
    themeDots.forEach(d => d.classList.remove("active"));
    dot.classList.add("active");
    const theme = dot.dataset.theme;
    state.theme = theme;
    gardenWidget.className = `theme-${theme}`;
    saveState();
  });
});

// ====== INITIAL LOAD ======
function init() {
  loadState();
  updateLotusPoints();
  updateStreak();
  updateGardenImage();
  updateSeedInventory();
  updateVaseCollection();
  updateSeedJournalCard();
  updateBuySeedsList();

  // Apply theme
  gardenWidget.className = `theme-${state.theme}`;
  themeDots.forEach(d => {
    d.classList.toggle("active", d.dataset.theme === state.theme);
  });
}

init();
