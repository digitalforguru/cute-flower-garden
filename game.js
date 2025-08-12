// -- Game Data --

const flowers = [
  { id: 'bluebells', name: 'bluebells', watersNeeded: 500 },
  { id: 'peonies', name: 'peonies', watersNeeded: 500 },
  { id: 'cherryblossom', name: 'cherryblossom', watersNeeded: 500 },
  { id: 'daisy', name: 'daisy', watersNeeded: 500 },
  { id: 'lavender', name: 'lavender', watersNeeded: 500 },
  { id: 'lily', name: 'lily', watersNeeded: 500 },
  { id: 'marigold', name: 'marigold', watersNeeded: 500 },
  { id: 'pansies', name: 'pansies', watersNeeded: 500 },
  { id: 'sunflower', name: 'sunflower', watersNeeded: 500 },
  { id: 'rose', name: 'rose', watersNeeded: 500 },
  { id: 'snapdragons', name: 'snapdragons', watersNeeded: 500 },
  { id: 'tulip', name: 'tulip', watersNeeded: 500 },
];

const growthStages = [
  { id: 1, name: "seedstage", threshold: 0 },
  { id: 2, name: "sproutstage", threshold: 100 },
  { id: 3, name: "midgrowth", threshold: 300 },
  { id: 4, name: "matureflower", threshold: 500 },
];

// -- State --
let gardenState = {
  flowerId: 'rose',  // default flower unlocked at start
  waterCount: 0,
  stage: 1,
};

let seedInventory = {
  rose: 1, // unlocked start with 1 rose seed
  // others start locked, zero count
};

let harvestedVases = {}; // flowerId => count

let lotusPoints = 0;
let dailyWater = 30;

let loginStreak = 0;
let lastLoginDate = null;

// -- DOM elements --
const gardenImage = document.getElementById("gardenImage");
const waterBtn = document.getElementById("waterBtn");
const harvestBtn = document.getElementById("harvestBtn");
const buyWaterBtn = document.getElementById("buyWaterBtn");
const seedInventoryDiv = document.getElementById("seedInventory");
const seedJournalBtn = document.getElementById("seedJournalBtn");
const seedJournal = document.getElementById("seedJournal");
const seedCardsContainer = document.getElementById("seedCardsContainer");
const closeJournalBtn = document.getElementById("closeJournalBtn");
const vaseShelf = document.getElementById("vaseShelf");
const popupMessage = document.getElementById("popupMessage");
const flowerCard = document.getElementById("flowerCard");
const flowerCardContent = document.getElementById("flowerCardContent");
const closeFlowerCardBtn = document.getElementById("closeFlowerCardBtn");
const themeDots = document.querySelectorAll(".theme-dot");
const streakCountSpan = document.getElementById("streakCount");
const lotusPointsSpan = document.getElementById("lotusPoints");

// --- Helper Functions ---

function getGrowthStage(waterCount) {
  for (let i = growthStages.length - 1; i >= 0; i--) {
    if (waterCount >= growthStages[i].threshold) return growthStages[i];
  }
  return growthStages[0];
}

function saveGame() {
  localStorage.setItem("gardenState", JSON.stringify(gardenState));
  localStorage.setItem("seedInventory", JSON.stringify(seedInventory));
  localStorage.setItem("harvestedVases", JSON.stringify(harvestedVases));
  localStorage.setItem("lotusPoints", lotusPoints);
  localStorage.setItem("dailyWater", dailyWater);
  localStorage.setItem("loginStreak", loginStreak);
  localStorage.setItem("lastLoginDate", lastLoginDate);
}

function loadGame() {
  const loadedGarden = JSON.parse(localStorage.getItem("gardenState"));
  if (loadedGarden) gardenState = loadedGarden;

  const loadedInventory = JSON.parse(localStorage.getItem("seedInventory"));
  if (loadedInventory) seedInventory = loadedInventory;

  const loadedVases = JSON.parse(localStorage.getItem("harvestedVases"));
  if (loadedVases) harvestedVases = loadedVases;

  lotusPoints = parseInt(localStorage.getItem("lotusPoints")) || 0;
  dailyWater = parseInt(localStorage.getItem("dailyWater")) || 30;
  loginStreak = parseInt(localStorage.getItem("loginStreak")) || 0;
  lastLoginDate = localStorage.getItem("lastLoginDate") || null;

  updateLoginStreak();
}

function updateLoginStreak() {
  const today = new Date().toDateString();
  if (lastLoginDate === today) return; // already counted today

  if (lastLoginDate) {
    const lastDate = new Date(lastLoginDate);
    const diff = (new Date(today) - lastDate) / (1000 * 3600 * 24);
    if (diff === 1) {
      loginStreak++;
      showPopup(`streak increased! 🌿 ${loginStreak} days`);
    } else {
      loginStreak = 1;
      showPopup("streak reset :(");
    }
  } else {
    loginStreak = 1;
    showPopup("welcome to your first streak day! 🌞");
  }

  lastLoginDate = today  localStorage.setItem("loginStreak", loginStreak);
  localStorage.setItem("lastLoginDate", lastLoginDate);
  updateUI();
}

function showPopup(message, duration = 2000) {
  popupMessage.textContent = message;
  popupMessage.classList.add("visible");
  setTimeout(() => {
    popupMessage.classList.remove("visible");
  }, duration);
}

// Update UI elements to reflect current state
function updateUI() {
  // Update garden image based on flower and growth stage
  const flower = flowers.find(f => f.id === gardenState.flowerId);
  if (!flower) {
    gardenImage.src = "assets/garden/vacant.png";
  } else {
    const stage = getGrowthStage(gardenState.waterCount);
    gardenState.stage = stage.id;
    gardenImage.src = `assets/flowers/${flower.id}-${stage.name}.png`;
    gardenImage.alt = `${flower.name} - ${stage.name}`;
  }

  // Update seed inventory display (only owned seeds)
  seedInventoryDiv.innerHTML = "";
  Object.entries(seedInventory).forEach(([flowerId, count]) => {
    if (count > 0) {
      const img = document.createElement("img");
      img.src = `assets/seedbags/${flowerId}-seedbag.png`;
      img.alt = `${flowerId} seed bag`;
      img.title = `${flowerId} seed bag (${count})`;
      seedInventoryDiv.appendChild(img);
    }
  });

  // Update vase shelf display
  vaseShelf.innerHTML = "";
  flowers.forEach(flower => {
    const vaseImg = document.createElement("img");
    if (harvestedVases[flower.id] > 0) {
      vaseImg.src = `assets/vase/vase-${flower.id}.png`;
      vaseImg.alt = `${flower.name} vase`;
      vaseImg.title = `${flower.name} vase`;
    } else {
      vaseImg.src = "assets/vase/vase-locked.png";
      vaseImg.alt = "locked vase";
      vaseImg.title = "locked vase";
    }
    vaseShelf.appendChild(vaseImg);
  });

  // Update points and streak counters
  lotusPointsSpan.textContent = lotusPoints;
  streakCountSpan.textContent = loginStreak;

  // Update buttons icons size
  waterBtn.querySelector("img").style.width = "48px";
  waterBtn.querySelector("img").style.height = "48px";
  harvestBtn.querySelector("img").style.width = "48px";
  harvestBtn.querySelector("img").style.height = "48px";
}

// Water the current flower
function waterPlant() {
  if (dailyWater <= 0) {
    showPopup("no water left for today! buy more 💧");
    return;
  }
  dailyWater--;
  gardenState.waterCount += 50; // watering adds 50 points per click
  showPopup("you watered your flower! 💧");
  saveGame();
  updateUI();
}

// Harvest the flower if mature
function harvestFlower() {
  const flower = flowers.find(f => f.id === gardenState.flowerId);
  if (!flower) return;

  if (gardenState.waterCount >= flower.watersNeeded) {
    // Harvest flower
    harvestedVases[flower.id] = (harvestedVases[flower.id] || 0) + 1;
    lotusPoints += 10;
    showPopup("harvested! +10 lotus points 🌸");
    // Reset plant to no flower / vacant
    gardenState.flowerId = null;
    gardenState.waterCount = 0;
    saveGame();
    updateUI();
  } else {
    showPopup("flower not ready to harvest 🌱");
  }
}

// Buy water using lotus points
function buyWater() {
  const waterCost = 5;
  if (lotusPoints < waterCost) {
    showPopup("not enough lotus points! 🌸");
    return;
  }
  lotusPoints -= waterCost;
  dailyWater += 10;
  showPopup("bought 10 water drops 💧");
  saveGame();
  updateUI();
}

// Open seed journal popup
function showSeedJournal() {
  seedJournal.classList.remove("hidden");
  renderSeedJournalCards();
}

// Close seed journal popup
function closeSeedJournal() {
  seedJournal.classList.add("hidden");
}

// Render the seed cards in the seed journal
function renderSeedJournalCards() {
  seedCardsContainer.innerHTML = "";
  flowers.forEach(flower => {
    const img = document.createElement("img");
    if (seedInventory[flower.id] && seedInventory[flower.id] > 0) {
      img.src = `assets/seedjournal/${flower.id}-seed.png`;
      img.alt = `${flower.name} seed`;
      img.title = flower.name;
    } else {
      img.src = `assets/seedjournal/locked-seed.png`;
      img.alt = "locked seed";
      img.title = "locked seed";
    }
    seedCardsContainer.appendChild(img);
  });
}

// Show popup with flower details on garden click
function showFlowerCard() {
  if (!gardenState.flowerId) return;
  flowerCardContent.innerHTML = "";
  const flower = flowers.find(f => f.id === gardenState.flowerId);
  if (!flower) return;

  const stage = getGrowthStage(gardenState.waterCount);

  const html = `
    <h3 id="flowerCardTitle">${flower.name}</h3>
    <img src="assets/flowers/${flower.id}-${stage.name}.png" alt="${flower.name} flower" />
    <p>waters: ${gardenState.waterCount} / ${flower.watersNeeded}</p>
    <p>growth stage: ${stage.name}</p>
  `;
  flowerCardContent.innerHTML = html;
  flowerCard.classList.remove("hidden");
}

// Close flower card popup
function closeFlowerCardPopup() {
  flowerCard.classList.add("hidden");
}

// Theme switching
function setTheme(theme) {
  const container = document.getElementById("widget-container");
  container.className = theme;
  localStorage.setItem("gardenTheme", theme);

  // Update active class on theme buttons
  themeDots.forEach(dot => {
    dot.classList.toggle("active", dot.dataset.theme === theme);
  });
}

// Load saved theme or default
function loadTheme() {
  const savedTheme = localStorage.getItem("gardenTheme") || "pink";
  setTheme(savedTheme);
}

// Event Listeners
waterBtn.addEventListener("click", waterPlant);
harvestBtn.addEventListener("click", harvestFlower);
buyWaterBtn.addEventListener("click", buyWater);
seedJournalBtn.addEventListener("click", showSeedJournal);
closeJournalBtn.addEventListener("click", closeSeedJournal);
gardenImage.addEventListener("click", showFlowerCard);
closeFlowerCardBtn.addEventListener("click", closeFlowerCardPopup);
themeDots.forEach(dot => {
  dot.addEventListener("click", () => {
    setTheme(dot.dataset.theme);
  });
});

// Daily reset water at midnight (simple version)
function dailyResetCheck() {
  const now = new Date();
  const lastReset = localStorage.getItem("lastResetDate");
  const today = now.toDateString();

  if (lastReset !== today) {
    dailyWater = 30;
    localStorage.setItem("dailyWater", dailyWater);
    localStorage.setItem("lastResetDate", today);
  }
}

// Initialize game
function init() {
  loadGame();
  loadTheme();
  dailyResetCheck();
  updateUI();
  updateLoginStreak();
}

init();
