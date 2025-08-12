// game.js

// Constants & initial state
const STORAGE_KEY = 'mini-garden-state';

const flowers = [
  { id: 'bluebells', name: 'bluebells', watersNeeded: 7 },
  { id: 'marigold', name: 'marigold', watersNeeded: 8 },
  { id: 'lily', name: 'lily', watersNeeded: 6 },
  { id: 'sunflower', name: 'sunflower', watersNeeded: 9 },
  { id: 'peonies', name: 'peonies', watersNeeded: 7 },
  { id: 'pansies', name: 'pansies', watersNeeded: 5 },
  { id: 'rose', name: 'rose', watersNeeded: 6 },
  { id: 'cherryblossom', name: 'cherry blossom', watersNeeded: 8 },
  { id: 'snapdragons', name: 'snapdragons', watersNeeded: 7 },
  { id: 'tulip', name: 'tulip', watersNeeded: 6 },
  { id: 'lavender', name: 'lavender', watersNeeded: 5 },
  { id: 'daisy', name: 'daisy', watersNeeded: 5 }
];

// Initial garden state structure
let gardenState = {
  lotusPoints: 50,          // Starting points, enough to buy rose seed initially
  dailyStreak: 0,
  lastLoginDate: null,
  inventory: {              // flowerId => quantity
    rose: 1                 // rose unlocked by default
  },
  plantedFlower: null,      // flowerId
  waterCount: 0,            // waters on planted flower
  harvestedVases: [],       // list of flowerIds harvested
  theme: 'pink'
};

const gardenWidget = document.getElementById('garden-widget');
const lotusPointsSpan = document.getElementById('lotus-points-value');
const gardenImage = document.getElementById('garden-image');
const seedInventory = document.getElementById('seed-inventory');
const vaseCollection = document.getElementById('vase-collection');
const dailyStreakSpan = document.getElementById('streak-count');

const seedJournalBtn = document.getElementById('seed-journal-btn');
const seedJournalPopup = document.getElementById('seed-journal-popup');
const closeJournalBtn = document.getElementById('close-journal-btn');
const seedJournalCard = document.getElementById('seed-journal-card');
const prevSeedBtn = document.getElementById('prev-seed-btn');
const nextSeedBtn = document.getElementById('next-seed-btn');

const buySeedListBtn = document.getElementById('buy-seed-list-btn');
const buySeedsPopup = document.getElementById('buy-seeds-popup');
const closeBuySeedsBtn = document.getElementById('close-buy-seeds-btn');
const buySeedsList = document.getElementById('buy-seeds-list');

const popupMessage = document.getElementById('popup-message');

const waterBtn = document.getElementById('water-btn');
const harvestBtn = document.getElementById('harvest-btn');
const buyWaterBtn = document.getElementById('buy-water-btn');

const themeDots = document.querySelectorAll('.theme-dot');

let currentJournalIndex = 0;

// Utility Functions
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gardenState));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    gardenState = JSON.parse(saved);
  } else {
    saveState();
  }
}

// Update UI functions
function updateLotusPoints() {
  lotusPointsSpan.textContent = gardenState.lotusPoints;
}

function updateDailyStreak() {
  dailyStreakSpan.textContent = gardenState.dailyStreak;
}

function updateSeedInventory() {
  seedInventory.innerHTML = '';

  const flowerIds = Object.keys(gardenState.inventory);
  if (flowerIds.length === 0) {
    seedInventory.textContent = 'no seeds yet';
    return;
  }

  flowerIds.forEach(fid => {
    const qty = gardenState.inventory[fid];
    if (qty < 1) return;

    const flower = flowers.find(f => f.id === fid);
    if (!flower) return;

    const seedDiv = document.createElement('div');
    seedDiv.className = 'seed-item';
    seedDiv.setAttribute('tabindex', '0');
    seedDiv.setAttribute('role', 'button');
    seedDiv.setAttribute('aria-label', `plant ${flower.name} seed`);

    const img = document.createElement('img');
    img.src = `assets/seeds/${fid}-seedbag.png`;
    img.alt = `${flower.name} seed bag`;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'seed-name';
    nameSpan.textContent = flower.name;

    const qtySpan = document.createElement('span');
    qtySpan.className = 'seed-qty';
    qtySpan.textContent = `${qty}x`;

    seedDiv.appendChild(img);
    seedDiv.appendChild(nameSpan);
    seedDiv.appendChild(qtySpan);

    seedDiv.addEventListener('click', () => {
      plantSeed(fid);
    });

    seedDiv.addEventListener('keypress', e => {
      if (e.key === 'Enter') plantSeed(fid);
    });

    seedInventory.appendChild(seedDiv);
  });
}

function updateGardenImage() {
  if (!gardenState.plantedFlower) {
    gardenImage.src = 'assets/garden/vacant.png';
    gardenImage.alt = 'empty garden';
  } else {
    const flower = flowers.find(f => f.id === gardenState.plantedFlower);
    if (!flower) {
      gardenImage.src = 'assets/garden/vacant.png';
      gardenImage.alt = 'empty garden';
      return;
    }

    const growthPercent = Math.min(1, gardenState.waterCount / flower.watersNeeded);
    let stage = 'seedling';
    if (growthPercent > 0.75) stage = 'blooming';
    else if (growthPercent > 0.4) stage = 'growing';

    gardenImage.src = `assets/flowers/${flower.id}-${stage}.png`;
    gardenImage.alt = `${flower.name} flower at ${stage} stage`;
  }
}

function updateVaseCollection() {
  vaseCollection.innerHTML = '';
  if (gardenState.harvestedVases.length === 0) {
    vaseCollection.textContent = 'no harvested vases yet';
    return;
  }
  gardenState.harvestedVases.forEach(fid => {
    const flower = flowers.find(f => f.id === fid);
    if (!flower) return;
    const img = document.createElement('img');
    img.className = 'vase-item';
    img.src = `assets/vases/${fid}-vase.png`;
    img.alt = `${flower.name} harvested vase`;
    vaseCollection.appendChild(img);
  });
}

function showPopupMessage(msg) {
  popupMessage.textContent = msg;
  popupMessage.classList.remove('hidden');
  setTimeout(() => {
    popupMessage.classList.add('hidden');
  }, 2500);
}

function updateTheme(theme) {
  gardenWidget.className = '';
  gardenWidget.classList.add(`theme-${theme}`);
  gardenState.theme = theme;
  saveState();
  themeDots.forEach(dot => {
    dot.classList.toggle('active', dot.dataset.theme === theme);
    dot.setAttribute('aria-checked', dot.dataset.theme === theme ? 'true' : 'false');
  });
}

// Game logic functions
function plantSeed(flowerId) {
  if (!gardenState.inventory[flowerId] || gardenState.inventory[flowerId] < 1) {
    showPopupMessage("you don't have this seed");
    return;
  }
  gardenState.plantedFlower = flowerId;
  gardenState.waterCount = 0;
  showPopupMessage(`planted ${flowerId} seed!`);
  saveState();
  updateGardenImage();
}

function waterPlant() {
  if (!gardenState.plantedFlower) {
    showPopupMessage("plant a seed first");
    return;
  }
  gardenState.waterCount++;
  showPopupMessage('watered your flower!');
  saveState();
  updateGardenImage();
  checkHarvestReady();
}

function checkHarvestReady() {
  if (!gardenState.plantedFlower) return false;
  const flower = flowers.find(f => f.id === gardenState.plantedFlower);
  if (!flower) return false;
  if (gardenState.waterCount >= flower.watersNeeded) {
    showPopupMessage('your flower is ready to harvest!');
    return true;
  }
  return false;
}

function harvestFlower() {
  if (!checkHarvestReady()) {
    showPopupMessage('not ready to harvest yet!');
    return;
  }
  const flowerId = gardenState.plantedFlower;
  gardenState.harvestedVases.push(flowerId);
  gardenState.plantedFlower = null;
  gardenState.waterCount = 0;
  gardenState.lotusPoints += 20;
  showPopupMessage('flower harvested! +20 lotus points');
  saveState();
  updateGardenImage();
  updateVaseCollection();
  updateLotusPoints();
}

// Buying water: costs 10 lotus points and adds 3 waters (max 15)
function buyWater() {
  if (gardenState.lotusPoints < 10) {
    showPopupMessage("not enough lotus points to buy water");
    return;
  }
  gardenState.lotusPoints -= 10;
  gardenState.waterCount = Math.min(gardenState.waterCount + 3, 15);
  showPopupMessage('bought 3 waters');
  saveState();
  updateLotusPoints();
  updateGardenImage();
}

// Seed Journal popup controls
function openSeedJournal() {
  seedJournalPopup.classList.remove('hidden');
  seedJournalBtn.setAttribute('aria-expanded', 'true');
  currentJournalIndex = 0;

  // Show first unlocked seed or rose by default
  const firstUnlockedIndex = flowers.findIndex(f => gardenState.inventory[f.id] && gardenState.inventory[f.id] > 0);
  if (firstUnlockedIndex !== -1) currentJournalIndex = firstUnlockedIndex;

  renderSeedJournalCard();
}

function closeSeedJournal() {
  seedJournalPopup.classList.add('hidden');
  seedJournalBtn.setAttribute('aria-expanded', 'false');
}

function renderSeedJournalCard() {
  const flower = flowers[currentJournalIndex];
  if (!flower) return;

  const owned = gardenState.inventory[flower.id] && gardenState.inventory[flower.id] > 0;
  seedJournalCard.innerHTML = `
    <img src="assets/seeds/${flower.id}-seed.png" alt="${flower.name} seed" />
    <h4>${flower.name}</h4>
    <p>${owned ? 'unlocked' : 'locked'}</p>
  `;
}

function nextSeedCard() {
  currentJournalIndex = (currentJournalIndex + 1) % flowers.length;
  renderSeedJournalCard();
}

function prevSeedCard() {
  currentJournalIndex = (currentJournalIndex - 1 + flowers.length) % flowers.length;
  renderSeedJournalCard();
}

// Buy seeds popup
function openBuySeedsPopup() {
  buySeedsPopup.classList.remove('hidden');
  buySeedListBtn.setAttribute('aria-expanded', 'true');
  renderBuySeedsList();
}

function closeBuySeedsPopup() {
  buySeedsPopup.classList.add('hidden');
  buySeedListBtn.setAttribute('aria-expanded', 'false');
}

function renderBuySeedsList() {
  buySeedsList.innerHTML = '';
  flowers.forEach(flower => {
    const owned = gardenState.inventory[flower.id] && gardenState.inventory[flower.id] > 0;
    if (owned) return; // don't show owned seeds for buying

    const li = document.createElement('li');
    li.textContent = flower.name;
    li.tabIndex = 0;
    li.setAttribute('role', 'option');
    li.addEventListener('click', () => {
      buySeed(flower.id);
    });
    li.addEventListener('keypress', e => {
      if (e.key === 'Enter') buySeed(flower.id);
    });
    buySeedsList.appendChild(li);
  });
}

function buySeed(flowerId) {
  const cost = 30;
  if (gardenState.lotusPoints < cost) {
    showPopupMessage("not enough lotus points to buy this seed");
    return;
  }
  gardenState.lotusPoints -= cost;
  gardenState.inventory[flowerId] = 1;
  showPopupMessage(`${flowerId} seed purchased!`);
  saveState();
  updateLotusPoints();
  updateSeedInventory();
  closeBuySeedsPopup();
}

// Daily login streak logic (call once on load)
function updateLoginStreak() {
  const today = new Date().toDateString();
  if (gardenState.lastLoginDate === today) return; // already counted today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  if (gardenState.lastLoginDate === yesterdayStr) {
    gardenState.dailyStreak++;
  } else {
    gardenState.dailyStreak = 1;
  }
  gardenState.lastLoginDate = today;
  saveState();
  updateDailyStreak();
  showPopupMessage(`daily streak: ${gardenState.dailyStreak}`);
}

// Theme switching event
themeDots.forEach(dot => {
  dot.addEventListener('click', () => {
    updateTheme(dot.dataset.theme);
  });
});

// Event listeners
seedJournalBtn.addEventListener('click', openSeedJournal);
closeJournalBtn.addEventListener('click', closeSeedJournal);
prevSeedBtn.addEventListener('click', prevSeedCard);
nextSeedBtn.addEventListener('click', nextSeedCard);

buySeedListBtn.addEventListener('click', openBuySeedsPopup);
closeBuySeedsBtn.addEventListener('click', closeBuySeedsPopup);

waterBtn.addEventListener('click', waterPlant);
harvestBtn.addEventListener('click', harvestFlower);
buyWaterBtn.addEventListener('click', buyWater);

gardenImage.addEventListener('click', () => {
  if (!gardenState.plantedFlower) {
    showPopupMessage('plant a seed first!');
    return;
  }
  const flower = flowers.find(f => f.id === gardenState.plantedFlower);
  if (!flower) return;
  const waters = gardenState.waterCount;
  const needed = flower.watersNeeded;
  showPopupMessage(`${flower.name}: ${waters}/${needed} waters`);
});

// Initialization
function init() {
  loadState();
  updateTheme(gardenState.theme);
  updateLotusPoints();
  updateDailyStreak();
  updateSeedInventory();
  updateGardenImage();
  updateVaseCollection();
  updateLoginStreak();
}

init();
