// === game.js ===

// ----------- Data & Constants -----------

const flowers = [
  { id: "bluebells", name: "bluebells", watersNeededBase: 100, price: 200 },
  { id: "marigold", name: "marigold", watersNeededBase: 120, price: 220 },
  { id: "lily", name: "lily", watersNeededBase: 140, price: 240 },
  { id: "sunflower", name: "sunflower", watersNeededBase: 160, price: 260 },
  { id: "peonies", name: "peonies", watersNeededBase: 180, price: 280 },
  { id: "pansies", name: "pansies", watersNeededBase: 200, price: 300 },
  { id: "rose", name: "rose", watersNeededBase: 100, price: 0 }, // free default
  { id: "cherryblossom", name: "cherryblossom", watersNeededBase: 220, price: 320 },
  { id: "snapdragons", name: "snapdragons", watersNeededBase: 240, price: 340 },
  { id: "tulip", name: "tulip", watersNeededBase: 260, price: 360 },
  { id: "lavender", name: "lavender", watersNeededBase: 280, price: 380 },
  { id: "daisy", name: "daisy", watersNeededBase: 300, price: 400 }
];

const growthStages = [
  { name: "seedstage", minWaters: 0 },
  { name: "sproutstage", minWaters: 100 },
  { name: "midgrowth", minWaters: 300 },
  { name: "matureflower", minWaters: 500 }
];

const themeList = ["pink", "beige", "lavender", "blue", "green"];

// ----------- Game State -----------

let gameState = {
  lotusPoints: 0,
  dailyWatersLeft: 30,
  dailyLoginStreak: 0,
  lastLoginDate: null,
  unlockedSeeds: ["rose"], // rose unlocked by default
  inventory: { rose: 1 }, // start with 1 rose seedbag
  garden: {
    flowerId: null, // current planted flower id
    waterCount: 0,
    stageIndex: 0
  },
  theme: "pink"
};

// ----------- DOM Elements -----------

const seedInventoryEl = document.getElementById("seed-inventory");
const seedJournalEl = document.getElementById("seed-journal");
const seedJournalPopup = document.getElementById("seed-journal-popup");
const seedJournalCloseBtn = document.getElementById("close-seed-journal");

const gardenEl = document.getElementById("garden");
const gardenPopup = document.getElementById("garden-popup");
const gardenPopupContent = document.getElementById("garden-popup-content");
const gardenPopupCloseBtn = document.getElementById("close-garden-popup");

const waterBtn = document.getElementById("water-btn");
const harvestBtn = document.getElementById("harvest-btn");
const buyWaterBtn = document.getElementById("buy-water-btn");
const buySeedButtons = document.querySelectorAll(".buy-seed-btn");

const lotusPointsEl = document.getElementById("lotus-points");
const dailyWatersLeftEl = document.getElementById("daily-waters-left");
const dailyLoginStreakEl = document.getElementById("daily-login-streak");

const themeButtons = document.querySelectorAll(".theme-dot");

const popupMessageEl = document.getElementById("popup-message");
const popupMessageCloseBtn = document.getElementById("popup-message-close");

const rainyDayPopup = document.getElementById("rainyday-popup");
const rainyDayBtn = document.getElementById("rainyday-btn");
const rainyPopupCloseBtn = document.getElementById("rainy-popup-close");

// ----------- Utils -----------

function saveGame() {
  localStorage.setItem("gardenGameState", JSON.stringify(gameState));
}

function loadGame() {
  const saved = localStorage.getItem("gardenGameState");
  if (saved) {
    gameState = JSON.parse(saved);
  } else {
    // Initialize default values on first load
    gameState.unlockedSeeds = ["rose"];
    gameState.inventory = { rose: 1 };
    gameState.dailyWatersLeft = 30;
    gameState.lotusPoints = 0;
    gameState.dailyLoginStreak = 0;
  }
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function isNewDay() {
  if (!gameState.lastLoginDate) return true;
  const last = new Date(gameState.lastLoginDate);
  const today = new Date();
  return formatDate(last) !== formatDate(today);
}

function updateDailyLogin() {
  const todayStr = formatDate(new Date());
  if (gameState.lastLoginDate === todayStr) return; // already counted today

  if (isNewDay()) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);

    if (gameState.lastLoginDate === yesterdayStr) {
      gameState.dailyLoginStreak += 1;
    } else {
      gameState.dailyLoginStreak = 1;
    }

    gameState.lastLoginDate = todayStr;
    gameState.dailyWatersLeft = 30; // reset daily waters
    saveGame();
  }
}

// Get flower object by id
function getFlowerById(id) {
  return flowers.find(f => f.id === id);
}

// Determine growth stage based on water count and waters needed
function getGrowthStage(flowerId, waterCount) {
  const flower = getFlowerById(flowerId);
  if (!flower) return 0;

  const needed = flower.watersNeededBase;
  if (waterCount >= needed * 5) return 3; // matureflower
  if (waterCount >= needed * 3) return 2; // midgrowth
  if (waterCount >= needed) return 1; // sproutstage
  return 0; // seedstage
}

// ----------- Rendering -----------

function renderSeedInventory() {
  seedInventoryEl.innerHTML = "";
  // Show seedbags only for unlocked seeds with quantity > 0
  flowers.forEach(flower => {
    const qty = gameState.inventory[flower.id] || 0;

    const seedSlot = document.createElement("div");
    seedSlot.className = "seed-slot";

    if (qty > 0) {
      const img = document.createElement("img");
      img.src = `assets/seedbags/${flower.id}-seedbag.png`;
      img.alt = `${flower.name} seed bag`;
      img.title = `${flower.name} seed bag`;
      img.className = "seedbag-img";
      seedSlot.appendChild(img);

      const label = document.createElement("div");
      label.className = "seed-label";
      label.innerHTML = `<span class="seed-name">${flower.name}</span><br><span class="seed-qty">${qty}x</span>`;
      seedSlot.appendChild(label);
    } else {
      // blank placeholder for empty slot
      const blank = document.createElement("div");
      blank.className = "seedbag-blank";
      seedSlot.appendChild(blank);
    }

    seedInventoryEl.appendChild(seedSlot);
  });
}

function renderSeedJournal() {
  seedJournalEl.innerHTML = "";
  flowers.forEach(flower => {
    const unlocked = gameState.unlockedSeeds.includes(flower.id);
    const img = document.createElement("img");
    img.src = unlocked
      ? `assets/seedjournal/${flower.id}-seed.png`
      : `assets/seedjournal/locked-seed.png`;
    img.alt = unlocked ? flower.name : "locked seed";
    img.title = flower.name;
    img.className = "seed-journal-img";
    seedJournalEl.appendChild(img);
  });
}

function renderGarden() {
  const flowerId = gameState.garden.flowerId;
  const waterCount = gameState.garden.waterCount;
  gardenEl.innerHTML = "";

  if (!flowerId) {
    const vacantImg = document.createElement("img");
    vacantImg.src = "assets/garden/vacant.png";
    vacantImg.alt = "vacant garden spot";
    vacantImg.className = "garden-img";
    gardenEl.appendChild(vacantImg);
    return;
  }

  const stageIndex = getGrowthStage(flowerId, waterCount);
  const flower = getFlowerById(flowerId);
  const stageName = growthStages[stageIndex]?.name || "seedstage";

  const flowerImg = document.createElement("img");
  flowerImg.src = `assets/flowers/${flower.id}-${stageName}.png`;
  flowerImg.alt = `${flower.name} - ${stageName}`;
  flowerImg.className = "garden-img";
  gardenEl.appendChild(flowerImg);
}

// ----------- Popups -----------

function showSeedJournalPopup() {
  renderSeedJournal();
  seedJournalPopup.classList.remove("hidden");
}

function closeSeedJournalPopup() {
  seedJournalPopup.classList.add("hidden");
}

function showGardenPopup() {
  if (!gameState.garden.flowerId) return;

  const flower = getFlowerById(gameState.garden.flowerId);
  const stageIndex = getGrowthStage(flower.id, gameState.garden.waterCount);
  const stageName = growthStages[stageIndex]?.name || "seedstage";
  const watersNeeded = flower.watersNeededBase * [1, 1, 3, 5][stageIndex]; // rough multiplier

  gardenPopupContent.innerHTML = `
    <h3>${flower.name}</h3>
    <img src="assets/flowers/${flower.id}-${stageName}.png" alt="${flower.name} ${stageName}" class="popup-flower-img" />
    <p>growth stage: <strong>${stageName}</strong></p>
    <p>waters: <strong>${gameState.garden.waterCount} / ${watersNeeded}</strong></p>
    <p>waters needed for next stage or harvest</p>
  `;
  gardenPopup.classList.remove("hidden");
}

function closeGardenPopupFunc() {
  gardenPopup.classList.add("hidden");
}

function showPopupMessage(msg) {
  popupMessageEl.textContent = msg;
  popupMessageEl.classList.remove("hidden");
  setTimeout(() => {
    popupMessageEl.classList.add("hidden");
  }, 2000);
}

// ----------- Actions -----------

function waterPlant() {
  if (gameState.dailyWatersLeft <= 0) {
    showPopupMessage("no waters left today 💧");
    return;
  }
  if (!gameState.garden.flowerId) {
    showPopupMessage("plant a seed first 🌱");
    return;
  }
  gameState.garden.waterCount += 1;
  gameState.dailyWatersLeft -= 1;

  // Auto stage update handled by getGrowthStage on render
  if (getGrowthStage(gameState.garden.flowerId, gameState.garden.waterCount) === 3) {
    showPopupMessage("your flower is ready to harvest! 🌸");
  }

  saveGame();
  renderGarden();
  updateUI();
}

function harvestFlower() {
  if (!gameState.garden.flowerId) {
    showPopupMessage("no flower to harvest 🌼");
    return;
  }
  if (getGrowthStage(gameState.garden.flowerId, gameState.garden.waterCount) < 3) {
    showPopupMessage("flower not mature yet 🌱");
    return;
  }

  // Add harvested flower to vase shelf (TODO: implement vase widget)
  showPopupMessage("harvested flower! +50 lotus points 🌺");
  gameState.lotusPoints += 50;
  gameState.garden.flowerId = null;
  gameState.garden.waterCount = 0;

  saveGame();
  renderGarden();
  updateUI();
}

function buyWater() {
  if (gameState.lotusPoints < 10) {
    showPopupMessage("not enough lotus points to buy water 💧");
    return;
  }
  gameState.lotusPoints -= 10;
  gameState.dailyWatersLeft += 10;
  showPopupMessage("bought 10 waters 💧");

  saveGame();
  updateUI();
}

function buySeed(flowerId) {
  const flower = getFlowerById(flowerId);
  if (!flower) return;

  if (gameState.unlockedSeeds.includes(flowerId)) {
    showPopupMessage(`${flower.name} already unlocked 🌸`);
    return;
  }

  if (gameState.lotusPoints < flower.price) {
    showPopupMessage("not enough lotus points 💰");
    return;
  }

  gameState.lotusPoints -= flower.price;
  gameState.unlockedSeeds.push(flowerId);
  gameState.inventory[flowerId] = 1;
  showPopupMessage(`unlocked and added ${flower.name} seedbag! 🌸`);

  saveGame();
  renderSeedInventory();
  renderSeedJournal();
  updateUI();
}

function plantSeed(flowerId) {
  if (!gameState.inventory[flowerId] || gameState.inventory[flowerId] < 1) {
    showPopupMessage("you don’t have that seed in inventory 🌱");
    return;
  }
  if (gameState.garden.flowerId) {
    showPopupMessage("harvest current flower first 🌸");
    return;
  }

  gameState.garden.flowerId = flowerId;
  gameState.garden.waterCount = 0;
  gameState.inventory[flowerId] -= 1;
  if (gameState.inventory[flowerId] === 0) delete gameState.inventory[flowerId];

  showPopupMessage(`planted ${flowerId} seed 🌱`);

  saveGame();
  renderSeedInventory();
  renderGarden();
  updateUI();
}

// ----------- UI Updates -----------

function updateUI() {
  lotusPointsEl.textContent = gameState.lotusPoints;
  dailyWatersLeftEl.textContent = gameState.dailyWatersLeft;
  dailyLoginStreakEl.textContent = gameState.dailyLoginStreak;

  renderSeedInventory();
  renderGarden();
}

// ----------- Theme -----------

function setTheme(theme) {
  if (!themeList.includes(theme)) theme = "pink";
  gameState.theme = theme;
  document.body.className = theme;
  localStorage.setItem("gardenTheme", theme);
  themeButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });
}

function loadTheme() {
  const saved = localStorage.getItem("gardenTheme");
  if (saved && themeList.includes(saved)) {
    setTheme(saved);
  } else {
    setTheme("pink");
  }
}

// ----------- Daily Login & Waters -----------

function checkDailyReset() {
  updateDailyLogin();
  saveGame();
  updateUI();
}

// ----------- Event Listeners -----------

seedJournalCloseBtn.addEventListener("click", closeSeedJournalPopup);
gardenPopupCloseBtn.addEventListener("click", closeGardenPopupFunc);

document.getElementById("open-seed-journal-btn").addEventListener("click", showSeedJournalPopup);
gardenEl.addEventListener("click", showGardenPopup);

waterBtn.addEventListener("click", waterPlant);
harvestBtn.addEventListener("click", harvestFlower);
buyWaterBtn.addEventListener("click", buyWater);

themeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    setTheme(btn.dataset.theme);
  });
});

// Buy seed buttons (assumed in seed journal, add dynamically)
seedJournalEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("seed-journal-img")) {
    const flowerId = flowers.find(f => f.id === e.target.alt)?.id;
    if (!flowerId) return;

    if (!gameState.unlockedSeeds.includes(flowerId)) {
      buySeed(flowerId);
    } else {
      // If unlocked, try to plant from inventory directly
      if (gameState.inventory[flowerId] > 0) {
        plantSeed(flowerId);
      } else {
        showPopupMessage(`no ${flowerId} seeds left in inventory 🌱`);
      }
    }
  }
});

// ----------- Init -----------

function init() {
  loadGame();
  loadTheme();
  checkDailyReset();
  updateUI();
}

init();
