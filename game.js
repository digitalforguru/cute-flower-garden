// --- Elements ---
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

// --- Flowers Data ---
const flowers = {
  // Common flowers
  daisy: { rarity: "common", water: 15, reward: 50 },
  marigold: { rarity: "common", water: 20, reward: 75 },
  pansies: { rarity: "common", water: 25, reward: 100 },
  nasturtium: { rarity: "common", water: 30, reward: 125 },
  geranium: { rarity: "common", water: 35, reward: 150 },
  begonia: { rarity: "common", water: 40, reward: 175 },
  sunflowers: { rarity: "common", water: 45, reward: 200 },
  cosmos: { rarity: "common", water: 50, reward: 225 },

  // Uncommon flowers
  bluebells: { rarity: "uncommon", water: 55, reward: 300 },
  snapdragons: { rarity: "uncommon", water: 60, reward: 350 },
  morningglory: { rarity: "uncommon", water: 65, reward: 400 },
  tulips: { rarity: "uncommon", water: 70, reward: 450 },
  freesia: { rarity: "uncommon", water: 75, reward: 500 },
  anemone: { rarity: "uncommon", water: 80, reward: 550 },
  lavender: { rarity: "uncommon", water: 90, reward: 600 },
  daffodils: { rarity: "uncommon", water: 100, reward: 650 },

  // Rare flowers
  cherryblossom: { rarity: "rare", water: 90, reward: 800 },
  lily: { rarity: "rare", water: 100, reward: 900 },
  rose: { rarity: "rare", water: 110, reward: 1000 },
  dahlia: { rarity: "rare", water: 120, reward: 1100 },
  hibiscus: { rarity: "rare", water: 130, reward: 1200 },
  peonies: { rarity: "rare", water: 140, reward: 1300 },
  gardenia: { rarity: "rare", water: 150, reward: 1400 },
  orchid: { rarity: "rare", water: 160, reward: 1500 },

  // Epic flowers
  dandelionsummer: { rarity: "epic", water: 150, reward: 2000 },
  maplesaplingfall: { rarity: "epic", water: 165, reward: 2200 },
  helleborewinter: { rarity: "epic", water: 180, reward: 2400 },
  irisspring: { rarity: "epic", water: 195, reward: 2600 },

  // Legendary flowers
  bleedingheartsvalentines: { rarity: "legendary", water: 210, reward: 2800 },
  shamrockstpatrick: { rarity: "legendary", water: 225, reward: 3000 },
  ipheion4th: { rarity: "legendary", water: 250, reward: 5000 },
  poinsettiachristmas: { rarity: "legendary", water: 300, reward: 5500 },
  taccabatflowerhalloween: { rarity: "legendary", water: 350, reward: 6000 }
};

const seeds = Object.keys(flowers);

// Rarity colors
const rarityColors = {
  common: "#a3f7a3",
  uncommon: "#cda4ff",
  rare: "#b22222",
  epic: "#800080",
  legendary: "#ffd700"
};

// --- State ---
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

// Initialize seeds and waterGiven
seeds.forEach(flower => {
  state.seedInventory[flower] = 0;
  state.waterGiven[flower] = 0;
});

// --- Local Storage ---
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);

    // Deep copy nested objects
    state.seedInventory = parsed.seedInventory || state.seedInventory;
    state.waterGiven = parsed.waterGiven || state.waterGiven;
    state.harvestedFlowers = parsed.harvestedFlowers || state.harvestedFlowers;
  }
}

// --- UI Updates ---
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
    const stage = state.flowerStage;
    gardenImage.src = `assets/flowers/${state.currentFlower}-${stage}.png`;
    gardenImage.alt = `${state.currentFlower} at ${stage}`;
  }
}

function updateSeedInventory() {
  seedInventoryEl.innerHTML = "";
  const ownedSeeds = Object.keys(state.seedInventory).filter(f => state.seedInventory[f] > 0);
  if (ownedSeeds.length === 0) {
    noSeedsText.style.display = "block";
    return;
  }
  noSeedsText.style.display = "none";

  ownedSeeds.forEach(flowerName => {
    const flower = flowers[flowerName];
    const count = state.seedInventory[flowerName];
    const li = document.createElement("div");
    li.className = "seed-item";
    li.dataset.seed = flowerName;
    li.innerHTML = `
      <strong>${flowerName}</strong><br/>
      <span style="color:${rarityColors[flower.rarity]}; font-size:10px;">${flower.rarity}</span><br/>
      Seeds: ${count} | 💧 ${state.waterGiven[flowerName] || 0}/${flower.water} | 🌸 ${flower.reward} lotus
    `;
    seedInventoryEl.appendChild(li);
  });
}

function updateVaseCollection() {
  vaseCollectionEl.innerHTML = "";
  if (state.harvestedFlowers.length === 0) return;
  state.harvestedFlowers.forEach(flower => {
    const img = document.createElement("img");
    img.src = `assets/vase/vase-${flower}.png`;
    img.alt = `vase with ${flower}`;
    img.className = "vase-item";
    vaseCollectionEl.appendChild(img);
  });
}

function showPopupMessage(msg) {
  popupMessage.textContent = msg;
  popupMessage.classList.add("visible");
  setTimeout(() => popupMessage.classList.remove("visible"), 2500);
}

// --- Seed Journal ---
function updateSeedJournalCard() {
  const flowerName = seeds[state.seedJournalIndex];
  const flower = flowers[flowerName];
  const isLocked = state.seedInventory[flowerName] === 0 && !state.harvestedFlowers.includes(flowerName);
  const imgSrc = isLocked ? `assets/seedjournal/${flowerName}-lockedseed.png` : `assets/seedjournal/${flowerName}-seed.png`;

  seedJournalCard.innerHTML = `
    <img src="${imgSrc}" alt="${flowerName} seed" />
    <h3>${flowerName}</h3>
    <span style="color:${rarityColors[flower.rarity]}; font-size:12px;">${flower.rarity}</span><br/>
    Status: ${isLocked ? "🔒 Locked" : "✅ Unlocked"}<br/>
    Water needed: ${flower.water} | Reward: ${flower.reward} lotus
  `;
}

// --- Seed Journal Navigation ---
function prevSeedJournal() { if(state.seedJournalIndex>0){state.seedJournalIndex--; updateSeedJournalCard();} }
function nextSeedJournal() { if(state.seedJournalIndex<seeds.length-1){state.seedJournalIndex++; updateSeedJournalCard();} }

// --- Buy Seeds ---
function getSeedCost(seed) { return flowers[seed].reward; }
function renderBuySeedsList() {
  buySeedsListEl.innerHTML = "";
  seeds.forEach(seed => {
    const flower = flowers[seed];
    const li = document.createElement("li");
    li.innerHTML = `<button onclick="buySeed('${seed}')">${seed} <span style="color:${rarityColors[flower.rarity]}; font-size:10px;">${flower.rarity}</span> (Cost: ${
    ${flower.reward} lotus)</button>`;
    buySeedsListEl.appendChild(li);
  });
}

function buySeed(seed) {
  const cost = flowers[seed].reward;
  if (state.lotusPoints >= cost) {
    state.lotusPoints -= cost;
    state.seedInventory[seed] = (state.seedInventory[seed] || 0) + 1;
    updateLotusPoints();
    updateSeedInventory();
    showPopupMessage(`Bought 1 ${seed} seed!`);
    saveState();
  } else {
    showPopupMessage("Not enough lotus points!");
  }
}

// --- Watering ---
function waterFlower() {
  if (!state.currentFlower) { showPopupMessage("Plant a flower first!"); return; }
  const flower = flowers[state.currentFlower];
  state.waterGiven[state.currentFlower] = (state.waterGiven[state.currentFlower] || 0) + 1;
  showPopupMessage(`Watered ${state.currentFlower}! (${state.waterGiven[state.currentFlower]}/${flower.water})`);
  if (state.waterGiven[state.currentFlower] >= flower.water) {
    state.flowerStage = "grown";
    showPopupMessage(`${state.currentFlower} is ready to harvest!`);
  }
  updateGardenImage();
  updateSeedInventory();
  saveState();
}

// --- Harvest ---
function harvestFlower() {
  if (!state.currentFlower || state.flowerStage !== "grown") { showPopupMessage("Nothing ready to harvest!"); return; }
  const flower = flowers[state.currentFlower];
  state.harvestedFlowers.push(state.currentFlower);
  state.lotusPoints += flower.reward;
  showPopupMessage(`Harvested ${state.currentFlower} for ${flower.reward} lotus!`);
  state.currentFlower = null;
  state.flowerStage = "seedstage";
  updateGardenImage();
  updateLotusPoints();
  updateSeedInventory();
  updateVaseCollection();
  saveState();
}

// --- Planting ---
gardenSection.addEventListener("click", () => {
  const ownedSeeds = Object.keys(state.seedInventory).filter(s => state.seedInventory[s] > 0);
  if (ownedSeeds.length === 0) { showPopupMessage("No seeds to plant!"); return; }
  // Plant first available seed (or you could prompt selection)
  const seedToPlant = ownedSeeds[0];
  state.currentFlower = seedToPlant;
  state.flowerStage = "seedstage";
  state.waterGiven[seedToPlant] = 0;
  state.seedInventory[seedToPlant]--;
  updateSeedInventory();
  updateGardenImage();
  showPopupMessage(`Planted ${seedToPlant}!`);
  saveState();
});

// --- Theme ---
themeDots.forEach(dot => {
  dot.addEventListener("click", () => {
    const theme = dot.dataset.theme;
    gardenWidget.className = `theme-${theme}`;
    state.theme = theme;
    themeDots.forEach(d => d.setAttribute("aria-checked","false"));
    dot.setAttribute("aria-checked","true");
    saveState();
  });
});

// --- Popups ---
seedJournalBtn.addEventListener("click", ()=>{seedJournalPopup.classList.remove("hidden"); updateSeedJournalCard();});
closeJournalBtn.addEventListener("click", ()=>seedJournalPopup.classList.add("hidden"));
prevSeedBtn.addEventListener("click", prevSeedJournal);
nextSeedBtn.addEventListener("click", nextSeedJournal);

buySeedListBtn.addEventListener("click", ()=>{buySeedsPopup.classList.remove("hidden"); renderBuySeedsList();});
closeBuySeedsBtn.addEventListener("click", ()=>buySeedsPopup.classList.add("hidden"));

// --- Buttons ---
waterBtn.addEventListener("click", waterFlower);
harvestBtn.addEventListener("click", harvestFlower);
buyWaterBtn.addEventListener("click", ()=>{state.lotusPoints+=50; updateLotusPoints(); showPopupMessage("Bought 50 lotus points water!");});

// --- Init ---
function init() {
  loadState();
  updateLotusPoints();
  updateStreak();
  updateGardenImage();
  updateSeedInventory();
  updateVaseCollection();
  // Set theme
  gardenWidget.className = `theme-${state.theme}`;
  themeDots.forEach(d => { d.setAttribute("aria-checked", d.dataset.theme===state.theme?"true":"false"); });
}

init();
