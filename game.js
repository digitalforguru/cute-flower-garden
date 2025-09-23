// ---------------------- Variables ----------------------
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
const gardenSection = document.getElementById("garden-section");
const buySeedsListEl = document.getElementById("buy-seeds-list");

const STORAGE_KEY = "cuteGardenState";

// ---------------------- State ----------------------
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

// Initialize waterGiven and seedInventory
const flowers = {
  // Common
  daisy: { rarity: "common", water: 15, cost: 50, reward: 50 },
  marigold: { rarity: "common", water: 20, cost: 75, reward: 75 },
  pansies: { rarity: "common", water: 25, cost: 100, reward: 100 },
  nasturtium: { rarity: "common", water: 30, cost: 125, reward: 125 },
  geranium: { rarity: "common", water: 35, cost: 150, reward: 150 },
  begonia: { rarity: "common", water: 40, cost: 175, reward: 175 },
  sunflowers: { rarity: "common", water: 45, cost: 200, reward: 200 },
  cosmos: { rarity: "common", water: 50, cost: 225, reward: 225 },
  // Uncommon
  bluebells: { rarity: "uncommon", water: 55, cost: 300, reward: 300 },
  snapdragons: { rarity: "uncommon", water: 60, cost: 350, reward: 350 },
  morningglory: { rarity: "uncommon", water: 65, cost: 400, reward: 400 },
  tulips: { rarity: "uncommon", water: 70, cost: 450, reward: 450 },
  freesia: { rarity: "uncommon", water: 75, cost: 500, reward: 500 },
  anemone: { rarity: "uncommon", water: 80, cost: 550, reward: 550 },
  lavender: { rarity: "uncommon", water: 90, cost: 600, reward: 600 },
  daffodils: { rarity: "uncommon", water: 100, cost: 650, reward: 650 },
  // Rare
  cherryblossom: { rarity: "rare", water: 90, cost: 800, reward: 800 },
  lily: { rarity: "rare", water: 100, cost: 900, reward: 900 },
  rose: { rarity: "rare", water: 110, cost: 1000, reward: 1000 },
  dahlia: { rarity: "rare", water: 120, cost: 1100, reward: 1100 },
  hibiscus: { rarity: "rare", water: 130, cost: 1200, reward: 1200 },
  peonies: { rarity: "rare", water: 140, cost: 1300, reward: 1300 },
  gardenia: { rarity: "rare", water: 150, cost: 1400, reward: 1400 },
  orchid: { rarity: "rare", water: 160, cost: 1500, reward: 1500 },
  // Epic
  dandelionsummer: { rarity: "epic", water: 150, cost: 2000, reward: 2000 },
  maplesaplingfall: { rarity: "epic", water: 165, cost: 2200, reward: 2200 },
  helleborewinter: { rarity: "epic", water: 180, cost: 2400, reward: 2400 },
  irisflowerspring: { rarity: "epic", water: 195, cost: 2600, reward: 2600 },
  // Legendary
  bleedingheartsvalentines: { rarity: "legendary", water: 210, cost: 2800, reward: 2800 },
  shamrockcloverstp: { rarity: "legendary", water: 225, cost: 3000, reward: 3000 },
  ipheionstarflower4th: { rarity: "legendary", water: 250, cost: 5000, reward: 5000 },
  poinsettiacristmas: { rarity: "legendary", water: 300, cost: 5500, reward: 5500 },
  taccabathalloween: { rarity: "legendary", water: 350, cost: 6000, reward: 6000 }
};

const seeds = Object.keys(flowers);

seeds.forEach(f => {
  state.waterGiven[f] = 0;
  state.seedInventory[f] = 0;
});

// ---------------------- LocalStorage ----------------------
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    Object.assign(state, JSON.parse(saved));
  }
}

// ---------------------- UI Update ----------------------
function updateLotusPoints() {
  lotusPointsEl.textContent = state.lotusPoints;
  saveState();
}

function updateStreak() {
  streakCountEl.textContent = state.streak;
}

function updateGardenImage() {
  if (!state.currentFlower) {
    gardenImage.src = "assets/garden/vacant.png";
    gardenImage.alt = "empty garden";
  } else {
    gardenImage.src = `assets/flowers/${state.currentFlower}-${state.flowerStage}.png`;
    gardenImage.alt = `${state.currentFlower} at ${state.flowerStage}`;
  }
}

function updateVaseCollection() {
  vaseCollectionEl.innerHTML = "";
  if (!state.harvestedFlowers.length) {
    const p = document.createElement("p");
    p.textContent = "no harvested flowers yet";
    p.style.fontSize = "11px";
    p.style.color = "var(--primary-color)";
    vaseCollectionEl.appendChild(p);
    return;
  }
  state.harvestedFlowers.forEach(flower => {
    const img = document.createElement("img");
    img.src = `assets/vase/vase-${flower}.png`;
    img.alt = `vase with ${flower}`;
    img.className = "vase-item";
    vaseCollectionEl.appendChild(img);
  });
}

function getRarityColor(rarity) {
  switch(rarity) {
    case "common": return "lightgreen";
    case "uncommon": return "lavender";
    case "rare": return "darkred";
    case "epic": return "purple";
    case "legendary": return "gold";
    default: return "white";
  }
}

// ---------------------- Seed Inventory ----------------------
function updateSeedInventory() {
  seedInventoryEl.innerHTML = "";
  const ownedSeeds = Object.keys(state.seedInventory).filter(s => state.seedInventory[s] > 0);
  if (!ownedSeeds.length) {
    noSeedsText.style.display = "block";
    return;
  } else {
    noSeedsText.style.display = "none";
  }

  ownedSeeds.forEach(seedName => {
    const count = state.seedInventory[seedName];
    const rarityColor = getRarityColor(flowers[seedName].rarity);

    const div = document.createElement("div");
    div.className = "seed-item";
    div.dataset.seed = seedName;
    div.tabIndex = 0;

    div.innerHTML = `
      <img src="assets/seedbags/${seedName}.png" alt="${seedName}" style="width:40px; height:40px;" />
      <div style="text-align:center; font-size:10px;">${seedName}</div>
      <div style="text-align:center; font-size:10px; color:${rarityColor}">${flowers[seedName].rarity}</div>
      <div style="text-align:center; font-size:10px;">x${count}</div>
    `;
    seedInventoryEl.appendChild(div);
  });
}

// ---------------------- Seed Journal ----------------------
let currentJournalIndex = 0;

function updateSeedJournalCard() {
  const flowerName = seeds[currentJournalIndex];
  const flower = flowers[flowerName];
  const isLocked = state.seedInventory[flowerName] === 0 && !state.harvestedFlowers.includes(flowerName);
  const imgSrc = isLocked ? `assets/seedjournal/${flowerName}-lockedseed.png` : `assets/seedjournal/${flowerName}-seed.png`;
  const color = getRarityColor(flower.rarity);

  seedJournalCard.innerHTML = `
    <img src="${imgSrc}" alt="${flowerName}" style="width:80px; height:80px;" />
    <h3>${flowerName}</h3>
    <div style="font-size:12px; color:${color}">${flower.rarity}</div>
    <p>Water Needed: ${flower.water}</p>
    <p>Cost: ${flower.cost} lotus points</p>
  `;
}

// ---------------------- Buy Seeds ----------------------
function renderBuySeedsList() {
  buySeedsListEl.innerHTML = "";
  seeds.forEach(seedName => {
    const flower = flowers[seedName];
    const color = getRarityColor(flower.rarity);
    const li = document.createElement("li");
    li.innerHTML = `<button onclick="buySeed('${seedName}')">${seedName} <span style="color:${color}; font-size:10px;">${flower.rarity}</span> (Cost: ${flower.cost})</button>`;
    buySeedsListEl.appendChild(li);
  });
}

function buySeed(seedName) {
  const flower = flowers[seedName];
  if (!flower) return;
  if (state.lotusPoints < flower.cost) {
    showPopupMessage(`need ${flower.cost} lotus points to buy ${seedName}`);
    return;
  }
  state.lotusPoints -= flower.cost;
  state.seedInventory[seedName] = (state.seedInventory[seedName] ||   state.seedInventory[seedName] + 1;
  updateLotusPoints();
  updateSeedInventory();
  showPopupMessage(`🌱 Bought 1 ${seedName} seed`);
  saveState();
}

// ---------------------- Planting ----------------------
gardenSection.addEventListener("click", () => {
  if (!state.currentFlower) return;
  const seedName = state.currentFlower;
  if (state.seedInventory[seedName] > 0) {
    state.seedInventory[seedName]--;
    state.flowerStage = "planted";
    updateSeedInventory();
    updateGardenImage();
    showPopupMessage(`🌱 Planted ${seedName}`);
    saveState();
  }
});

// Clicking a seed in inventory sets it as currentFlower
seedInventoryEl.addEventListener("click", (e) => {
  const seedItem = e.target.closest(".seed-item");
  if (!seedItem) return;
  state.currentFlower = seedItem.dataset.seed;
  state.flowerStage = "seedstage";
  updateGardenImage();
  saveState();
});

// ---------------------- Watering ----------------------
waterBtn.addEventListener("click", () => {
  const f = state.currentFlower;
  if (!f) return showPopupMessage("Select a flower to water");
  state.waterGiven[f] = (state.waterGiven[f] || 0) + 1;
  showPopupMessage(`💧 Watered ${f} (${state.waterGiven[f]}/${flowers[f].water})`);
  if (state.waterGiven[f] >= flowers[f].water) {
    state.flowerStage = "grown";
    showPopupMessage(`🌸 ${f} is fully grown!`);
  }
  updateGardenImage();
  saveState();
});

// ---------------------- Harvest ----------------------
harvestBtn.addEventListener("click", () => {
  const f = state.currentFlower;
  if (!f) return showPopupMessage("No flower planted");
  if (state.flowerStage !== "grown") return showPopupMessage(`${f} is not fully grown`);
  state.harvestedFlowers.push(f);
  state.currentFlower = null;
  state.flowerStage = "seedstage";
  state.waterGiven[f] = 0;
  state.lotusPoints += flowers[f].reward;
  updateLotusPoints();
  updateVaseCollection();
  updateGardenImage();
  showPopupMessage(`🎉 Harvested ${f} (+${flowers[f].reward} lotus points)`);
  saveState();
});

// ---------------------- Buy Water ----------------------
buyWaterBtn.addEventListener("click", () => {
  if (state.lotusPoints < 50) return showPopupMessage("Need 50 lotus points to buy water");
  state.lotusPoints -= 50;
  showPopupMessage("💧 Bought 1 extra water for your flowers");
  updateLotusPoints();
  saveState();
});

// ---------------------- Popups ----------------------
function showPopupMessage(msg) {
  popupMessage.textContent = msg;
  popupMessage.classList.remove("hidden");
  setTimeout(() => popupMessage.classList.add("hidden"), 2000);
}

// ---------------------- Seed Journal Navigation ----------------------
nextSeedBtn.addEventListener("click", () => {
  currentJournalIndex = (currentJournalIndex + 1) % seeds.length;
  updateSeedJournalCard();
});

prevSeedBtn.addEventListener("click", () => {
  currentJournalIndex = (currentJournalIndex - 1 + seeds.length) % seeds.length;
  updateSeedJournalCard();
});

// ---------------------- Popup Buttons ----------------------
seedJournalBtn.addEventListener("click", () => {
  seedJournalPopup.classList.remove("hidden");
  updateSeedJournalCard();
});

closeJournalBtn.addEventListener("click", () => seedJournalPopup.classList.add("hidden"));

buySeedListBtn.addEventListener("click", () => {
  buySeedsPopup.classList.remove("hidden");
  renderBuySeedsList();
});

closeBuySeedsBtn.addEventListener("click", () => buySeedsPopup.classList.add("hidden"));

// ---------------------- Theme Selector ----------------------
themeDots.forEach(dot => {
  dot.addEventListener("click", () => {
    state.theme = dot.dataset.theme;
    applyTheme();
    saveState();
  });
});

function applyTheme() {
  gardenWidget.className = `theme-${state.theme}`;
  vaseWidget.className = `theme-${state.theme}`;
  themeDots.forEach(dot => {
    dot.classList.toggle("active", dot.dataset.theme === state.theme);
    dot.setAttribute("aria-checked", dot.dataset.theme === state.theme);
    dot.tabIndex = dot.dataset.theme === state.theme ? 0 : -1;
  });
}

// ---------------------- Init ----------------------
function init() {
  loadState();
  updateLotusPoints();
  updateStreak();
  updateSeedInventory();
  updateVaseCollection();
  updateGardenImage();
  applyTheme();
}

init();
