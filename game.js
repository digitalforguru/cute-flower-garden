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
const themeDots = document.querySelectorAll(".theme-dot");
const gardenWidget = document.getElementById("garden-widget");
const vaseWidget = document.getElementById("vase-widget");
const buySeedsListEl = document.getElementById("buy-seeds-list");

const STORAGE_KEY = "cuteGardenState";

// ====== FLOWERS DATA ======
const flowers = {
  daisy: { rarity: "common", water: 15, cost: 50, img: "daisy" },
  marigold: { rarity: "common", water: 20, cost: 75, img: "marigold" },
  pansies: { rarity: "common", water: 25, cost: 100, img: "pansies" },
  nasturtium: { rarity: "common", water: 30, cost: 125, img: "nasturtium" },
  geranium: { rarity: "common", water: 35, cost: 150, img: "geranium" },
  begonia: { rarity: "common", water: 40, cost: 175, img: "begonia" },
  sunflower: { rarity: "common", water: 45, cost: 200, img: "sunflower" },
  cosmos: { rarity: "common", water: 50, cost: 225, img: "cosmos" },

  bluebells: { rarity: "uncommon", water: 55, cost: 300, img: "bluebells" },
  snapdragons: { rarity: "uncommon", water: 60, cost: 350, img: "snapdragon" },
  morningglory: { rarity: "uncommon", water: 65, cost: 400, img: "morningglory" },
  tulips: { rarity: "uncommon", water: 70, cost: 450, img: "tulip" },
  freesia: { rarity: "uncommon", water: 75, cost: 500, img: "freesia" },
  anemone: { rarity: "uncommon", water: 80, cost: 550, img: "anemone" },
  lavender: { rarity: "uncommon", water: 90, cost: 600, img: "lavender" },
  daffodils: { rarity: "uncommon", water: 100, cost: 650, img: "daffodil" },

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
  poinsettiachristmas: { rarity: "legendary", water: 300, cost: 5500, img: "poinsettiachristmas" },
  taccabathalloween: { rarity: "legendary", water: 350, cost: 6000, img: "taccabathalloween" }
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
  seedJournalIndex: 0,
  theme: "pink",
  lastLoginDate: null
};

// Initialize inventory
seeds.forEach(f => {
  state.seedInventory[f] = 0;
  state.waterGiven[f] = 0;
});

// ====== LOCAL STORAGE ======
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  Object.assign(state, JSON.parse(saved));
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
function showPopup(msg) {
  popupMessage.textContent = msg;
  popupMessage.classList.add("visible");
  setTimeout(() => popupMessage.classList.remove("visible"), 2500);
}

// ====== UI UPDATES ======
function updateLotusPoints() { lotusPointsEl.textContent = state.lotusPoints; saveState(); }
function updateStreak() { streakCountEl.textContent = state.streak; saveState(); }
function applyTheme() {
  gardenWidget.className = `theme-${state.theme}`;
  vaseWidget.className = `theme-${state.theme}`;
  themeDots.forEach(dot => dot.classList.toggle("active", dot.dataset.theme === state.theme));
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
    const p = document.createElement("p"); p.textContent = "no harvested flowers yet"; vaseCollectionEl.appendChild(p); return;
  }
  state.harvestedFlowers.forEach(f => {
    const img = document.createElement("img");
    img.src = `assets/vase/vase-${f}.png`;
    img.alt = f;
    img.className = "vase-item";
    vaseCollectionEl.appendChild(img);
  });
}

function updateSeedInventory() {
  seedInventoryEl.innerHTML = "";
  const owned = Object.keys(state.seedInventory).filter(f => state.seedInventory[f] > 0);
  if (!owned.length) { noSeedsText.style.display = "block"; return; }
  noSeedsText.style.display = "none";

  owned.forEach(f => {
    const flower = flowers[f];
    const div = document.createElement("div");
    div.className = "seed-item";
    div.dataset.seed = f;
    div.tabIndex = 0;
    div.innerHTML = `
      <img src="assets/seedbags/${flower.img}-seed.png" alt="${f}" class="seed-img"/>
      <p class="seed-name">${f}</p>
      <p class="seed-rarity" style="color:${getRarityColor(flower.rarity)}">${flower.rarity}</p>
      <p class="seed-count">x${state.seedInventory[f]}</p>
      <p>💧 ${state.waterGiven[f]}/${flower.water} | 🌸 ${flower.cost} LP</p>
      <button onclick="plantSeed('${f}')">Plant 🌱</button>
    `;
    seedInventoryEl.appendChild(div);
  });
}

// ====== SEED JOURNAL ======
function updateSeedJournalCard() {
  const f = seeds[state.seedJournalIndex];
  const flower = flowers[f];
  const isLocked = state.seedInventory[f] === 0 && !state.harvestedFlowers.includes(f);
  const imgSrc = `assets/seedjournal/${flower.img}-seed${isLocked ? "-locked" : ""}.png`;

  seedJournalCard.innerHTML = `
    <img src="${imgSrc}" alt="${f}" />
    <p>${f}</p>
    <p style="color:${getRarityColor(flower.rarity)}">${flower.rarity}</p>
    <p>Water: ${flower.water}</p>
    <p>Reward: ${flower.cost} LP</p>
  `;
}

// ====== PLANT / WATER / HARVEST ======
function plantSeed(f) {
  if (!state.seedInventory[f]) return showPopup(`No ${f} seeds`);
  state.currentFlower = f;
  state.flowerStage = "seedstage";
  state.seedInventory[f]--;
  updateGardenImage();
  updateSeedInventory();
  showPopup(`Planted ${f} 🌱`);
  saveState();
}

let dailyWaterCount = 0, lastWaterDate = null;
function resetDailyWaterIfNeeded() {
  const today = new Date().toDateString();
  if (lastWaterDate !== today) { dailyWaterCount = 0; lastWaterDate = today; }
}

function waterFlower() {
  resetDailyWaterIfNeeded();
  if (!state.currentFlower) return showPopup("Plant a seed first 🌱");
  if (dailyWaterCount >= 25) return showPopup("Daily water limit reached");

  state.waterGiven[state.currentFlower]++;
  dailyWaterCount++;
  const f = flowers[state.currentFlower];
  if (state.waterGiven[state.currentFlower] >= f.water) showPopup(`${state.currentFlower} fully watered 🌸`);
  else showPopup(`Watered ${state.currentFlower} 💧 (${state.waterGiven[state.currentFlower]}/${f.water})`);

  const stages = ["seedstage","sproutstage","midgrowth","matureflower"];
  let idx = stages.indexOf(state.flowerStage);
  if (idx < stages.length-1) state.flowerStage = stages[idx+1];

  updateGardenImage(); updateSeedInventory(); saveState();
}

function harvestFlower() {
  if (!state.currentFlower) return showPopup("Plant a seed first 🌱");
  const f = flowers[state.currentFlower];
  if (state.waterGiven[state.currentFlower] < f.water) return showPopup(`Needs ${f.water - state.waterGiven[state.currentFlower]} more water`);

  state.harvestedFlowers.push(state.currentFlower);
  state.lotusPoints += f.cost;
  state.waterGiven[state.currentFlower] = 0;
  state.currentFlower = null; state.flowerStage = "seedstage";
  updateGardenImage(); updateVaseCollection(); updateLotusPoints(); updateSeedInventory(); showPopup("Harvested flower 🌸"); saveState();
}

// ====== BUY WATER / SEEDS ======
function buyWater() {
  if (state.lotusPoints < 3) return showPopup("Need 3 lotus points 💧");
  state.lotusPoints -= 3; updateLotusPoints(); showPopup("Bought water 💧"); saveState();
}

function buySeed(f) {
  const flower = flowers[f];
  if (state.lotusPoints < flower.cost) return showPopup(`Need ${flower.cost} LP`);
  state.lotusPoints -= flower.cost; state.seedInventory[f]++;
  updateLotusPoints(); updateSeedInventory(); renderBuySeedsList(); showPopup(`Bought 1 ${f} seed 🌱`); saveState();
}

// ====== SEED JOURNAL NAV ======
prevSeedBtn.addEventListener("click", () => { state.seedJournalIndex = (state.seedJournalIndex - 1 + seeds.length) % seeds.length; updateSeedJournalCard(); });
nextSeedBtn.addEventListener("click", () => { state.seedJournalIndex = (state.seedJournalIndex + 1) % seeds.length; updateSeedJournalCard(); });

// ====== POPUP BUTTONS ======
seedJournalBtn.addEventListener("click", () => { seedJournalPopup.classList.toggle("hidden"); updateSeedJournalCard(); });
buySeedListBtn.addEventListener("click", () => { buySeedsPopup.classList.toggle("hidden"); renderBuySeedsList(); });
closeJournalBtn.addEventListener("click", () => seedJournalPopup.classList.add("hidden"));
closeBuySeedsBtn.addEventListener("click", () => buySeedsPopup.classList.add("hidden"));

// ====== BUY SEEDS LIST ======
function renderBuySeedsList() {
  buySeedsListEl.innerHTML = "";
  seeds.forEach(f => {
    const flower = flowers[f];
    const li = document.createElement("li");
    li.className = "buy-seed-item"; li.tabIndex = 0;
    li.innerHTML = `<span class="seed-name">${f}</span> <span class="rarity" style="color:${getRarityColor(flower.rarity)}">${flower.rarity}</span> <span class="seed-cost">Cost: ${flower.cost} LP</span>`;
    li.addEventListener("click", () => buySeed(f));
    buySeedsListEl.appendChild(li);
  });
}

// ====== THEME SELECTOR ======
themeDots.forEach(dot => dot.addEventListener("click", () => { state.theme = dot.dataset.theme; applyTheme(); saveState(); }));

// ====== BUTTON EVENTS ======
waterBtn.addEventListener("click", waterFlower);
harvestBtn.addEventListener("click", harvestFlower);
buyWaterBtn.addEventListener("click", buyWater);

// ====== DAILY STREAK ======
function checkDailyStreak() {
  const today = new Date().toDateString();
  if (state.lastLoginDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    state.streak = (state.lastLoginDate === yesterday) ? state.streak+1 : 1;
    state.lastLoginDate = today; updateStreak(); saveState();
  }
}

// ====== INIT ======
function init() {
  loadState();
  updateLotusPoints();
  updateStreak();
  applyTheme();
  updateGardenImage();
  updateSeedInventory();
  updateVaseCollection();
  updateSeedJournalCard();
  renderBuySeedsList();
  checkDailyStreak();
}
init();
window.plantSeed = plantSeed;
