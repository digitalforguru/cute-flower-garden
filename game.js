// ====== SAFE DOM ELEMENTS ======
const getEl = id => document.getElementById(id);

const lotusPointsEl = getEl("lotus-points-value");
const waterCountEl = getEl("water-count-value");
const gardenImage = getEl("garden-image");
const seedInventoryEl = getEl("seed-inventory");
const noSeedsText = getEl("no-seeds-text");
const streakCountEl = getEl("streak-count");

const waterBtn = getEl("water-btn");
const harvestBtn = getEl("harvest-btn");

const seedJournalBtn = getEl("seed-journal-btn");
const buySeedListBtn = getEl("buy-seed-list-btn");
const seedJournalPopup = getEl("seed-journal-popup");
const buySeedsPopup = getEl("buy-seeds-popup");
const closeJournalBtn = getEl("close-journal-btn");
const closeBuySeedsBtn = getEl("close-buy-seeds-btn");

const seedJournalCard = getEl("seed-journal-card");
const prevSeedBtn = getEl("prev-seed-btn");
const nextSeedBtn = getEl("next-seed-btn");

const popupMessage = getEl("popup-message");

const vaseCollectionEl = getEl("vase-collection");
const themeDots = document.querySelectorAll(".theme-dot");
const gardenWidget = getEl("garden-widget");
const vaseWidget = getEl("vase-widget");

const buySeedsListEl = getEl("buy-seeds-list");
const buyWaterBtn = getEl("buy-water-btn");
const buyWaterListEl = getEl("buy-water-list");
const closeBuyWaterBtn = getEl("close-buy-water-btn");
const buyWaterPopup = getEl("buy-water-popup");

const seedInventoryPopup = getEl("seed-inventory-popup");
const closeSeedInventoryBtn = getEl("close-seed-inventory-btn");
const seedInventoryPopupList = getEl("seed-inventory-popup-list");

const STORAGE_KEY = "cuteGardenState";
const DAILY_WATER_BY_RARITY = {
  common: 10,
  uncommon: 20,
  rare: 25,
  epic: 35,
  legendary: 40
};

// ====== FLOWERS DATA ======
const flowers = {
  "daisy": { rarity: "common", water: 15, cost: 50, img: "daisy" },
  "marigold": { rarity: "common", water: 20, cost: 75, img: "marigold" },
  "pansies": { rarity: "common", water: 25, cost: 100, img: "pansies" },
  "nasturtiums": { rarity: "common", water: 30, cost: 125, img: "nasturtium" },
  "geraniums": { rarity: "common", water: 35, cost: 150, img: "geranium" },
  "begonias": { rarity: "common", water: 40, cost: 175, img: "begonia" },
  "sunflowers": { rarity: "common", water: 45, cost: 200, img: "sunflower" },
  "cosmos": { rarity: "common", water: 50, cost: 225, img: "cosmos" },
  "bluebells": { rarity: "uncommon", water: 55, cost: 300, img: "bluebells" },
  "snapdragons": { rarity: "uncommon", water: 60, cost: 350, img: "snapdragon" },
  "morning glories": { rarity: "uncommon", water: 65, cost: 400, img: "morningglory" },
  "tulips": { rarity: "uncommon", water: 70, cost: 450, img: "tulip" },
  "freesias": { rarity: "uncommon", water: 75, cost: 500, img: "freesia" },
  "anemones": { rarity: "uncommon", water: 80, cost: 550, img: "anemone" },
  "lavender": { rarity: "uncommon", water: 90, cost: 600, img: "lavender" },
  "daffodils": { rarity: "uncommon", water: 100, cost: 650, img: "daffodil" },
  "cherry blossom tree": { rarity: "rare", water: 90, cost: 800, img: "cherryblossom" },
  "lillies": { rarity: "rare", water: 100, cost: 900, img: "lily" },
  "roses": { rarity: "rare", water: 110, cost: 1000, img: "rose" },
  "dahlias": { rarity: "rare", water: 120, cost: 1100, img: "dahlia" },
  "hibiscus": { rarity: "rare", water: 130, cost: 1200, img: "hibiscus" },
  "peonies": { rarity: "rare", water: 140, cost: 1300, img: "peonies" },
  "gardenias": { rarity: "rare", water: 150, cost: 1400, img: "gardenia" },
  "orchids": { rarity: "rare", water: 160, cost: 1500, img: "orchid" },
  "dandelion x summer": { rarity: "epic", water: 150, cost: 2000, img: "dandelionsummer" },
  "maple sapling tree x fall": { rarity: "epic", water: 165, cost: 2200, img: "maplesaplingfall" },
  "hellebore flowers x winter": { rarity: "epic", water: 180, cost: 2400, img: "helleborewinter" },
  "iris flowers x spring": { rarity: "epic", water: 195, cost: 2600, img: "irisflowerspring" },
  "bleeding hearts x valentines": { rarity: "legendary", water: 210, cost: 2800, img: "bleedingheartsvalentines" },
  "shamrock clovers x st patricks day": { rarity: "legendary", water: 225, cost: 3000, img: "shamrockcloverstp" },
  "ipheion starflower x 4th of july": { rarity: "legendary", water: 250, cost: 5000, img: "ipheionstarflower4th" },
  "poinsettia x christmas": { rarity: "legendary", water: 300, cost: 5500, img: "poinsettiachristmas" },
  "tacca bat flower x halloween": { rarity: "legendary", water: 350, cost: 6000, img: "taccabathalloween" },
};

const seeds = Object.keys(flowers);

// ====== GAME STATE ======
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
  lastLoginDate: null,
  watersToday: 0,
  lastWaterDate: null
};

// Initialize seedInventory and waterGiven
function giveWelcomeSeed() {
  if (!state.seedInventory["daisy"]) {
    state.seedInventory["daisy"] = 1;
    showPopupMessage("Welcome! 🌸 You got 1 free daisy seed!");
    saveState();
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
  if (!popupMessage) return;
  popupMessage.textContent = msg;
  popupMessage.classList.add("visible");
  setTimeout(() => popupMessage.classList.remove("visible"), 2500);
}

// ====== SAVE / LOAD ======
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) Object.assign(state, JSON.parse(saved));
}

// ====== FLOWER KEY NORMALIZATION ======
function normalizeFlowerKey(name) {
  return seeds.find(f => f.toLowerCase() === name.toLowerCase()) || name;
}

// ====== UI UPDATES ======
function updateLotusPoints() { if(lotusPointsEl) lotusPointsEl.textContent = state.lotusPoints; saveState(); }
function updateWaterCount() { if(waterCountEl) waterCountEl.textContent = state.watersToday; saveState(); }
function updateStreak() { if(streakCountEl) streakCountEl.textContent = state.streak; saveState(); }

function updateGardenImage() {
  if (!gardenImage) return;
  if (!state.currentFlower) {
    gardenImage.src = "assets/garden/vacant.png";
    gardenImage.alt = "empty garden";
  } else {
    const fName = normalizeFlowerKey(state.currentFlower);
    const f = flowers[fName];
    if (!f) return console.error("Garden flower not found:", state.currentFlower);
    gardenImage.src = `assets/flowers/${f.img}-${state.flowerStage}.png`;
    gardenImage.alt = `${state.currentFlower} at ${state.flowerStage}`;
  }
}

function updateVaseCollection() {
  if (!vaseCollectionEl) return;
  vaseCollectionEl.innerHTML = "";
  if (!state.harvestedFlowers.length) {
    vaseCollectionEl.textContent = "no harvested flowers yet";
    return;
  }
  state.harvestedFlowers.forEach(fName => {
    const key = normalizeFlowerKey(fName);
    const f = flowers[key];
    if (!f) return console.warn("Vase flower not found:", fName);
    const img = document.createElement("img");
    img.src = `assets/vase/vase-${f.img}.png`;
    img.alt = fName;
    img.className = "vase-item";
    vaseCollectionEl.appendChild(img);
  });
}

const seedInventoryPopup = getEl("seed-inventory-popup");
const closeSeedInventoryBtn = getEl("close-seed-inventory-btn");
const seedInventoryPopupList = getEl("seed-inventory-popup-list");

if (gardenImage) gardenImage.addEventListener("click", () => {
  seedInventoryPopup.classList.toggle("hidden");
  renderSeedInventoryPopup();
});

if (closeSeedInventoryBtn) closeSeedInventoryBtn.addEventListener("click", () => {
  seedInventoryPopup.classList.add("hidden");
});

// Render seeds inside popup
function renderSeedInventoryPopup() {
  seedInventoryPopupList.innerHTML = "";
  Object.entries(state.seedInventory).forEach(([name, qty]) => {
    if (qty > 0) {
      const btn = document.createElement("button");
      btn.textContent = `${name} (${qty})`;
      btn.onclick = () => {
        plantSeed(name);
        seedInventoryPopup.classList.add("hidden");
      };
      seedInventoryPopupList.appendChild(btn);
    }
  });
}

// ====== SEED INVENTORY ======
function updateSeedInventory() {
  if (!seedInventoryEl) return;
  seedInventoryEl.innerHTML = "";
  const owned = seeds.filter(f => state.seedInventory[f] > 0);
  if (!owned.length) {
    if(noSeedsText) noSeedsText.style.display = "block";
    return;
  }
  if(noSeedsText) noSeedsText.style.display = "none";

  owned.forEach(fName => {
    const f = flowers[fName];
    if (!f) return console.warn("Seed inventory flower not found:", fName);
    const div = document.createElement("div");
    div.className = "seed-item";
    div.dataset.seed = fName;
    div.innerHTML = `
      <img src="assets/seedbags/${f.img}-seedbag.png" alt="${fName}" class="seed-img"/>
      <p class="seed-name">${fName}</p>
      <p class="seed-rarity" style="color:${getRarityColor(f.rarity)}">${f.rarity}</p>
      <p class="seed-count">x${state.seedInventory[fName]}</p>
    `;
    div.addEventListener("click", () => plantSeed(fName));
    seedInventoryEl.appendChild(div);
  });
}

// ====== SEED JOURNAL ======
function updateSeedJournalCard() {
  if (!seedJournalCard) return;
  const idx = state.seedJournalIndex;
  const fName = seeds[idx];
  const f = flowers[fName];
  if (!f) return console.warn("Seed journal flower not found:", fName);
  const isLocked = !(state.seedInventory[fName] > 0 || state.harvestedFlowers.includes(fName));
  const imgSrc = isLocked ? `assets/seedjournal/${f.img}-lockedseed.png` : `assets/seedjournal/${f.img}-seed.png`;

  seedJournalCard.innerHTML = `
    <img src="${imgSrc}" alt="${fName}" class="journal-img"/>
    <p class="journal-name">${fName}</p>
    <p class="journal-rarity" style="color:${getRarityColor(f.rarity)}">${f.rarity}</p>
    <p>Water Needed: 💧 ${f.water}</p>
    <p>Cost: 🌸 ${f.cost}</p>
    <p>Status: ${isLocked ? "🔒 Locked" : "✅ Unlocked"}</p>
  `;
}

// ====== PLANT / WATER / HARVEST ======
function plantSeed(fName) {
  if (!state.seedInventory[fName] || state.seedInventory[fName] <= 0) {
    return showPopupMessage(`No ${fName} seeds`);
  }
  state.currentFlower = fName;
  state.flowerStage = "seedstage";
  state.seedInventory[fName]--;
  updateGardenImage();
  updateSeedInventory();
  saveState();
  showPopupMessage(`Planted ${fName} 🌱`);
}

function resetDailyWaterIfNeeded() {
  const today = new Date().toDateString();
  if (state.lastWaterDate !== today) {
    state.lastWaterDate = today;

    const rarities = ["common", "uncommon", "rare", "epic", "legendary"];
    let highestRarity = "common";

    for (const fName of seeds) {
      if (state.seedInventory[fName] > 0) {
        const r = flowers[fName].rarity;
        if (rarities.indexOf(r) > rarities.indexOf(highestRarity)) {
          highestRarity = r;
        }
      }
    }

    state.watersToday = DAILY_WATER_BY_RARITY[highestRarity] || 10;
    showPopupMessage(`+${state.watersToday} daily waters for your ${highestRarity} plants 💧`);
    saveState();
  }
}

function waterFlower() {
  resetDailyWaterIfNeeded();
  if (!state.currentFlower) return showPopupMessage("Plant a seed first 🌱");
  if (state.watersToday <= 0) return showPopupMessage("No water left! Buy more 💧");

  const flowerName = state.currentFlower;
  const flower = flowers[normalizeFlowerKey(flowerName)];
  state.waterGiven[flowerName] = (state.waterGiven[flowerName] || 0) + 1;
  state.watersToday--;

  const totalWater = flower.water;
  const waters = state.waterGiven[flowerName];
  const stage1 = Math.ceil(totalWater / 4);
  const stage2 = Math.ceil(totalWater / 2);
  const stage3 = Math.ceil((totalWater * 3) / 4);

  if (waters >= totalWater) state.flowerStage = "matureflower";
  else if (waters >= stage3) state.flowerStage = "matureflower";
  else if (waters >= stage2) state.flowerStage = "midgrowth";
  else if (waters >= stage1) state.flowerStage = "sproutstage";
  else state.flowerStage = "seedstage";

  updateGardenImage();
  updateSeedInventory();
  updateWaterCount();
  saveState();

  if (waters >= flower.water) showPopupMessage(`${flowerName} is ready to harvest! 🌸`);
  else showPopupMessage(`Watered ${flowerName} 💧 (${waters}/${flower.water})`);
}

function harvestFlower() {
  if (!state.currentFlower) return showPopupMessage("Plant a seed first 🌱");
  const f = flowers[normalizeFlowerKey(state.currentFlower)];
  if ((state.waterGiven[state.currentFlower] || 0) < f.water) return showPopupMessage(`${state.currentFlower} needs more water`);

  state.harvestedFlowers.push(state.currentFlower);
  state.lotusPoints += f.cost;
  state.waterGiven[state.currentFlower] = 0;
  state.currentFlower = null;
  state.flowerStage = "seedstage";

  updateGardenImage();
  updateVaseCollection();
  updateLotusPoints();
  updateSeedInventory();
  saveState();
  showPopupMessage(`Harvested flower 🌸 +${f.cost} LP`);
}

// ====== BUY WATER ======
if (buyWaterBtn) buyWaterBtn.addEventListener("click", () => {
  const isHidden = buyWaterPopup.classList.contains("hidden");

  seedJournalPopup.classList.add("hidden");
  buySeedsPopup.classList.add("hidden");
  buyWaterPopup.classList.add("hidden");

  if(isHidden) {
    buyWaterPopup.classList.remove("hidden");
    renderBuyWaterList();
  }
});

function renderBuyWaterList() {
  if (!buyWaterListEl) return;
  buyWaterListEl.innerHTML = "";
  const options = [
    { qty: 5, cost: 5 },
    { qty: 10, cost: 9 },
    { qty: 20, cost: 18 }
  ];

  options.forEach(opt => {
    const li = document.createElement("li");
    li.className = "buy-water-item";
    li.tabIndex = 0;
    li.textContent = `💧 ${opt.qty} waters - Cost: ${opt.cost} LP`;
    li.addEventListener("click", () => {
          if (state.lotusPoints < opt.cost) return showPopupMessage("Not enough lotus points");
      state.lotusPoints -= opt.cost;
      state.watersToday += opt.qty;
      updateLotusPoints();
      updateWaterCount();
      saveState();
      showPopupMessage(`Bought ${opt.qty} water 💧`);
    });
    buyWaterListEl.appendChild(li);
  });
}

// ====== BUY SEEDS ======
function buySeed(fName) {
  const f = flowers[normalizeFlowerKey(fName)];
  if (!f) return console.warn("Buy seed flower not found:", fName);
  if (state.lotusPoints < f.cost) return showPopupMessage(`Not enough lotus points`);
  state.lotusPoints -= f.cost;
  state.seedInventory[fName] = (state.seedInventory[fName] || 0) + 1;
  updateLotusPoints();
  updateSeedInventory();
  renderBuySeedsList();
  saveState();
  showPopupMessage(`Bought 1 ${fName} seed 🌱`);
}

function renderBuySeedsList() {
  if(!buySeedsListEl) return;
  buySeedsListEl.innerHTML = "";
  seeds.forEach(fName => {
    const f = flowers[fName];
    if (!f) return console.warn("Render seed list flower not found:", fName);
    const li = document.createElement("li");
    li.className = "buy-seed-item";
    li.tabIndex = 0;
    li.innerHTML = `<span class="seed-name">${fName}</span> <span class="seed-rarity" style="color:${getRarityColor(f.rarity)}">${f.rarity}</span> <span class="seed-cost">Cost: ${f.cost} LP</span>`;
    li.addEventListener("click", () => buySeed(fName));
    buySeedsListEl.appendChild(li);
  });
}

// ====== SEED JOURNAL NAVIGATION ======
if(prevSeedBtn) prevSeedBtn.addEventListener("click", () => {
  state.seedJournalIndex = (state.seedJournalIndex - 1 + seeds.length) % seeds.length;
  updateSeedJournalCard();
});
if(nextSeedBtn) nextSeedBtn.addEventListener("click", () => {
  state.seedJournalIndex = (state.seedJournalIndex + 1) % seeds.length;
  updateSeedJournalCard();
});

// ====== THEME SELECTOR ======
themeDots.forEach(dot => {
  dot.addEventListener("click", () => {
    state.theme = dot.dataset.theme;
    applyTheme();
    saveState();
  });
});

function applyTheme() {
  if (gardenWidget) gardenWidget.className = `theme-${state.theme}`;
  if (vaseWidget) vaseWidget.className = `theme-${state.theme}`;
  themeDots.forEach(d => d.classList.toggle("active", d.dataset.theme === state.theme));
}

// ====== DAILY STREAK ======
function checkDailyStreak() {
  const today = new Date().toDateString();
  if (state.lastLoginDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    state.streak = state.lastLoginDate === yesterday ? state.streak + 1 : 1;
    state.lastLoginDate = today;
    updateStreak();
    saveState();
  }
}

// ====== POPUP BUTTONS ======
[ 
  { btn: seedJournalBtn, popup: seedJournalPopup, update: updateSeedJournalCard },
  { btn: buySeedListBtn, popup: buySeedsPopup, update: renderBuySeedsList },
  { btn: buyWaterBtn, popup: buyWaterPopup, update: renderBuyWaterList }
].forEach(({btn, popup, update}) => {
  if(!btn) return;
  btn.addEventListener("click", () => {
    const isHidden = popup.classList.contains("hidden");
    [seedJournalPopup, buySeedsPopup, buyWaterPopup].forEach(p => p.classList.add("hidden"));
    if(isHidden) {
      popup.classList.remove("hidden");
      if(update) update();
    }
  });
});

[ 
  { btn: closeJournalBtn, popup: seedJournalPopup },
  { btn: closeBuySeedsBtn, popup: buySeedsPopup },
  { btn: closeBuyWaterBtn, popup: buyWaterPopup }
].forEach(({btn, popup}) => {
  if(btn) btn.addEventListener("click", () => popup.classList.add("hidden"));
});

// ====== BUTTON EVENTS ======
if (waterBtn) waterBtn.addEventListener("click", waterFlower);
if (harvestBtn) harvestBtn.addEventListener("click", harvestFlower);

// ====== GLOBAL FUNCTIONS ======
window.plantSeed = plantSeed;

// ====== INITIALIZATION ======
function initGame() {
  loadState();
  giveWelcomeSeed();
  updateLotusPoints();
  updateWaterCount();
  updateStreak();
  applyTheme();
  updateGardenImage();
  updateSeedInventory();
  updateVaseCollection();
  renderBuySeedsList();
  updateSeedJournalCard();
  checkDailyStreak();
  renderBuyWaterList();
}

// Prevent double widgets by checking if the container exists
if(gardenWidget && !gardenWidget.dataset.initialized) {
  gardenWidget.dataset.initialized = "true";
  initGame();
}
