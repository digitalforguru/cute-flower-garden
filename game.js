// --- VARIABLES & DOM ELEMENTS ---
const lotusPointsEl = document.getElementById("lotus-points-value");
const gardenImage = document.getElementById("garden-image");
const seedInventoryEl = document.getElementById("seed-inventory");
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
const gardenSection = document.getElementById("garden-section");
const buySeedsListEl = document.getElementById("buy-seeds-list");

const STORAGE_KEY = "cuteGardenState";

// --- GAME STATE ---
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

const seeds = Object.keys(flowers);

const state = {
  lotusPoints: 20,
  streak: 0,
  currentFlower: null,
  flowerStage: "seedstage",
  harvestedFlowers: [],
  seedInventory: {},
  seedJournalIndex: 0,
  theme: "pink",
  lastLoginDate: null,
  waterGiven: {}
};

// Initialize inventories
seeds.forEach(flower => {
  state.seedInventory[flower] = 0;
  state.waterGiven[flower] = 0;
});

// --- LOCAL STORAGE ---
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) Object.assign(state, JSON.parse(saved));
}

// --- POPUPS ---
function showPopupMessage(msg) {
  popupMessage.textContent = msg;
  popupMessage.classList.add("visible");
  setTimeout(() => popupMessage.classList.remove("visible"), 2500);
}

// --- UI UPDATES ---
function updateLotusPoints() {
  lotusPointsEl.textContent = state.lotusPoints;
}

function updateStreak() {
  streakCountEl.textContent = state.streak;
}

function updateGardenImage() {
  if (!state.currentFlower) {
    gardenImage.src = "assets/garden/vacant.png";
    gardenImage.alt = "empty garden";
  } else {
    const imgPath = `assets/flowers/${state.currentFlower}-${state.flowerStage}.png`;
    gardenImage.src = imgPath;
    gardenImage.alt = `${state.currentFlower} at ${state.flowerStage.replace("stage","")}`;
  }
}

function updateSeedInventory() {
  seedInventoryEl.innerHTML = "";
  seeds.forEach(flowerName => {
    const flower = flowers[flowerName];
    const count = state.seedInventory[flowerName];
    const waterProgress = state.waterGiven[flowerName] || 0;
    const cost = getSeedCost(flowerName);
    const li = document.createElement("li");
    li.innerHTML = `<strong>${flowerName}</strong> 🌱${count} | 💧${waterProgress}/${flower.water} | 🌸${flower.reward} | 💰${cost}
      <button onclick="plantSeed('${flowerName}')">Plant</button>
    `;
    seedInventoryEl.appendChild(li);
  });
}

function updateVaseCollection() {
  vaseCollectionEl.innerHTML = "";
  if (state.harvestedFlowers.length === 0) {
    const p = document.createElement("p");
    p.textContent = "no harvested flowers yet";
    vaseCollectionEl.appendChild(p);
  }
  state.harvestedFlowers.forEach(flower => {
    const img = document.createElement("img");
    img.src = `assets/vase/vase-${flower}.png`;
    img.alt = flower;
    img.className = "vase-item";
    vaseCollectionEl.appendChild(img);
  });
}

// --- DAILY STREAK ---
function updateDailyStreak() {
  const today = new Date().toDateString();
  if (!state.lastLoginDate) {
    state.streak = 1;
  } else {
    const last = new Date(state.lastLoginDate);
    const diff = (new Date(today)-last)/(1000*60*60*24);
    state.streak = diff === 1 ? state.streak+1 : diff > 1 ? 1 : state.streak;
  }
  state.lastLoginDate = today;
  updateStreak();
  saveState();
}

// --- DAILY WATER ---
let dailyWaterCount = 0;
let lastWaterDate = null;
function resetDailyWaterIfNeeded() {
  const today = new Date().toDateString();
  if (lastWaterDate !== today) {
    dailyWaterCount = 0;
    lastWaterDate = today;
  }
}

// --- SEED COST ---
function getSeedCost(seedName) {
  const index = seeds.indexOf(seedName);
  return 5 + index * 2;
}

// --- PLANT SEED ---
function plantSeed(seedName) {
  if (state.seedInventory[seedName] > 0) {
    state.currentFlower = seedName;
    state.flowerStage = "seedstage";
    state.seedInventory[seedName]--;
    updateGardenImage();
    updateSeedInventory();
    showPopupMessage(`planted ${seedName} 🌱`);
  } else showPopupMessage(`no ${seedName} seeds available`);
}

// --- WATER FLOWER ---
function waterFlower(flowerName = null) {
  resetDailyWaterIfNeeded();
  const target = flowerName || state.currentFlower;
  if (!target) return showPopupMessage("plant a seed first 🌱");
  if (dailyWaterCount >= 25) return showPopupMessage("daily watering limit reached 💧");

  state.waterGiven[target] = (state.waterGiven[target] || 0) + 1;
  dailyWaterCount++;

  const stages = ["seedstage","sproutstage","midgrowth","matureflower"];
  let idx = stages.indexOf(state.flowerStage);
  if (state.currentFlower === target && idx < stages.length-1) {
    state.flowerStage = stages[idx+1];
    updateGardenImage();
    showPopupMessage(`💧 ${target} grew! Stage: ${state.flowerStage}`);
  }

  if (state.waterGiven[target] >= flowers[target].water)
    showPopupMessage(`🌸 ${target} is ready to harvest!`);
  else
    showPopupMessage(`💧 ${target}: ${flowers[target].water - state.waterGiven[target]} waters left`);

  updateSeedInventory();
  saveState();
}

// --- HARVEST FLOWER ---
function harvestFlower(flowerName = null) {
  const target = flowerName || state.currentFlower;
  if (!target) return showPopupMessage("plant a seed first 🌱");
  const flower = flowers[target];
  const waterGiven = state.waterGiven[target] || 0;
  if (waterGiven < flower.water) return showPopupMessage(`💧 ${target} needs ${flower.water-waterGiven} more water`);

  // Harvest logic
  state.harvestedFlowers.push(target);
  state.lotusPoints += flower.reward;
  state.waterGiven[target] = 0;

  if (!flowerName) {
    state.currentFlower = null;
    state.flowerStage = "seedstage";
    updateGardenImage();
  }

  updateSeedInventory();
  updateVaseCollection();
  updateLotusPoints();
  showPopupMessage(`🌸 harvested ${target}! +${flower.reward} lotus points`);
}

// --- BUY WATER ---
function buyWater() {
  if (state.lotusPoints < 3) return showPopupMessage("need 3 lotus to buy water 💧");
  state.lotusPoints -= 3;
  updateLotusPoints();
  showPopupMessage("bought water 💧");
}

// --- SEED JOURNAL ---
let currentJournalIndex = 0;
function openSeedJournal() {
  seedJournalPopup.classList.remove("hidden");
  seedJournalBtn.setAttribute("aria-expanded","true");
  currentJournalIndex = 0;
  updateSeedJournalCard();
  seedJournalPopup.focus();
}

function closeSeedJournal() {
  seedJournalPopup.classList.add("hidden");
  seedJournalBtn.setAttribute("aria-expanded","false");
  seedJournalBtn.focus();
}

function updateSeedJournalCard() {
  const flowerName = seeds[currentJournalIndex];
  const flower = flowers[flowerName];
  const isLocked = state.seedInventory[flowerName] === 0 && !state.harvestedFlowers.includes(flowerName);
  const imgSrc = isLocked ? `assets/seedjournal/${flowerName}-lockedseed.png` : `assets/seedjournal/${flowerName}-seed.png`;
  const rarityBadge = `<span class="rarity-badge rarity-${flower.rarity}">${flower.rarity}</span>`;
  seedJournalCard.innerHTML = `
    <img src="${imgSrc}" alt="${flowerName} seed journal card" />
    <h3>${flowerName} ${rarityBadge}</h3>
    <p>Status: ${isLocked ? "🔒 Locked" : "✅ Unlocked"}</p>
    <p>Reward: 🌸 ${flower.reward} lotus points</p>
    <p>Water Needed: 💧 ${flower.water}</p>
  `;
}

function prevSeedJournal() {
  if (currentJournalIndex > 0) currentJournalIndex--;
  updateSeedJournalCard();
}

function nextSeedJournal() {
  if (currentJournalIndex < seeds.length-1) currentJournalIndex++;
  updateSeedJournalCard();
}

// --- BUY SEEDS POPUP ---
function openBuySeedsPopup() {
  buySeedsPopup.classList.remove("hidden");
  buySeedListBtn.setAttribute("aria-expanded","true");
  renderBuySeedsList();
  buySeedsPopup.focus();
}

function closeBuySeedsPopup() {
  buySeedsPopup.classList.add("hidden");
  buySeedListBtn.setAttribute("aria-expanded","false");
  buySeedListBtn.focus();
}

function renderBuySeedsList() {
  buySeedsListEl.innerHTML = "";
  seeds.forEach(seed => {
    const cost = getSeedCost(seed);
    const li = document.createElement("li");
    li.innerHTML = `<button onclick="buySeed('${seed}')">Buy ${seed} 🌸 (${cost} lotus)</button>`;
    buySeedsListEl.appendChild(li);
  });
}

function buySeed(seedName) {
  const cost = getSeedCost(seedName);
  if (state.lotusPoints < cost) return showPopupMessage(`need ${cost} lotus points`);
  state.lotusPoints -= cost;
  state.seedInventory[seedName]++;
  updateLotusPoints();
  updateSeedInventory();
  showPopupMessage(`bought 1 ${seedName} seed 🌱`);
  closeBuySeedsPopup();
}

// --- EVENT LISTENERS ---
waterBtn.addEventListener("click", () => waterFlower());
harvestBtn.addEventListener("click", () => harvestFlower());
buyWaterBtn.addEventListener("click", buyWater);

seedInventoryEl.addEventListener("click", e => {
  const seedDiv = e.target.closest(".seed-item");
  if (seedDiv) plantSeed(seedDiv.dataset.seed);
});

gardenSection.addEventListener("click", () => {
  if (!state.currentFlower) showPopupMessage("plant seed first!");
  else openSeedJournal();
});

themeDots.forEach(dot => {
  dot.addEventListener("click", () => {
    const newTheme = dot.dataset.theme;
    if (state.theme === newTheme) return;
    state.theme = newTheme;
    gardenWidget.className = `theme-${newTheme}`;
    vaseWidget.className = `theme-${newTheme}`;
    themeDots.forEach(td => {
      td.setAttribute("aria-checked", td.dataset.theme===newTheme?"true":"false");
      td.tabIndex = td.dataset.theme===newTheme?0:-1;
    });
  });
});

// Seed journal navigation
prevSeedBtn.addEventListener("click", prevSeedJournal);
nextSeedBtn.addEventListener("click", nextSeedJournal);

// Popup buttons
closeJournalBtn.addEventListener("click", closeSeedJournal);
closeBuySeedsBtn.addEventListener("click", closeBuySeedsPopup);

seedJournalBtn.addEventListener("click", () => {
  if (seedJournalPopup.classList.contains("hidden")) openSeedJournal();
  else closeSeedJournal();
});

buySeedListBtn.addEventListener("click", () => {
  if (buySeedsPopup.classList.contains("hidden")) openBuySeedsPopup();
  else closeBuySeedsPopup();
});

// ESC key
document.addEventListener("keydown", e => {
  if (e.key==="Escape") {
    if (!seedJournalPopup.classList.contains("hidden")) closeSeedJournal();
    if (!buySeedsPopup.classList.contains("hidden")) closeBuySeedsPopup();
  }
});

// --- INITIALIZE ---
loadState();
updateDailyStreak();
updateLotusPoints();
updateStreak();
updateGardenImage();
updateSeedInventory();
updateVaseCollection();
