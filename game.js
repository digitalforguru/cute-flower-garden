// DOM elements
const gardenWidget = document.getElementById('garden-widget');
const gardenImage = document.getElementById('garden-image');
const seedInventory = document.getElementById('seed-inventory');
const vaseCollection = document.getElementById('vase-collection');
const lotusPointsDisplay = document.getElementById('lotus-points-value');
const dailyStreakDisplay = document.getElementById('streak-count');
const popupMessage = document.getElementById('popup-message');

const seedJournalPopup = document.getElementById('seed-journal-popup');
const seedJournalBtn = document.getElementById('seed-journal-btn');
const closeJournalBtn = document.getElementById('close-journal-btn');
const seedJournalCard = document.getElementById('seed-journal-card');
const prevSeedBtn = document.getElementById('prev-seed-btn');
const nextSeedBtn = document.getElementById('next-seed-btn');

const buySeedsPopup = document.getElementById('buy-seeds-popup');
const buySeedListBtn = document.getElementById('buy-seed-list-btn');
const closeBuySeedsBtn = document.getElementById('close-buy-seeds-btn');
const buySeedsList = document.getElementById('buy-seeds-list');

const waterBtn = document.getElementById('water-btn');
const harvestBtn = document.getElementById('harvest-btn');
const buyWaterBtn = document.getElementById('buy-water-btn');

const themeDots = [...document.querySelectorAll('.theme-dot')];

let currentJournalIndex = 0;
let popupTimeoutId = null;

// Sample flowers data (make sure to update or load your own data)
const flowers = [
  { id: 'bluebells', name: 'bluebells', watersNeeded: 3 },
  { id: 'roses', name: 'roses', watersNeeded: 5 },
  { id: 'daisies', name: 'daisies', watersNeeded: 4 },
  // add more flowers as needed
];

// Initial garden state, loaded from localStorage or defaults
let gardenState = {
  inventory: {},         // flowerId => quantity (seeds owned)
  plantedFlower: null,   // flowerId currently planted
  waterCount: 0,         // how many times watered current plant
  harvestedVases: [],    // array of flowerIds harvested (for vases)
  lotusPoints: 0,        // currency points
  dailyStreak: 0,
  lastLoginDate: null,
  theme: 'pink'
};

// --- STORAGE FUNCTIONS ---
function saveState() {
  localStorage.setItem('gardenState', JSON.stringify(gardenState));
}

function loadState() {
  const saved = localStorage.getItem('gardenState');
  if (saved) {
    try {
      gardenState = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse garden state:', e);
    }
  }
}

// --- UI UPDATE FUNCTIONS ---
function updateLotusPoints() {
  lotusPointsDisplay.textContent = gardenState.lotusPoints;
}

function updateDailyStreak() {
  dailyStreakDisplay.textContent = gardenState.dailyStreak;
}

function updateSeedInventory() {
  seedInventory.innerHTML = '';
  Object.entries(gardenState.inventory).forEach(([flowerId, qty]) => {
    if (qty < 1) return;
    const flower = flowers.find(f => f.id === flowerId);
    if (!flower) return;

    const div = document.createElement('div');
    div.className = 'seed-item';
    div.tabIndex = 0;
    div.setAttribute('role', 'listitem');
    div.title = `plant ${flower.name} seed`;

    div.innerHTML = `
      <img src="assets/seedbags/${flowerId}-seedbag.png" alt="${flower.name} seed bag" draggable="false" />
      <div class="seed-name">${flower.name}</div>
      <div class="seed-qty">${qty}</div>
    `;

    div.addEventListener('click', () => plantSeed(flowerId));
    div.addEventListener('keypress', e => {
      if (e.key === 'Enter') plantSeed(flowerId);
    });

    seedInventory.appendChild(div);
  });
}

function updateGardenImage() {
  if (!gardenState.plantedFlower) {
    gardenImage.src = 'assets/garden/vacant.png';
    gardenImage.alt = 'empty garden';
    return;
  }
  const flower = flowers.find(f => f.id === gardenState.plantedFlower);
  if (!flower) {
    gardenImage.src = 'assets/garden/vacant.png';
    gardenImage.alt = 'empty garden';
    return;
  }

  // Determine stage based on waterCount
  const w = gardenState.waterCount;
  let stage = 'seedstage';

  if (w >= flower.watersNeeded) stage = 'matureflower';
  else if (w >= flower.watersNeeded * 0.66) stage = 'midgrowth';
  else if (w >= flower.watersNeeded * 0.33) stage = 'sproutstage';

  gardenImage.src = `assets/flowers/${flower.id}-${stage}.png`;
  gardenImage.alt = `${flower.name} at ${stage.replace('stage', '')}`;
}

function updateVaseCollection() {
  vaseCollection.innerHTML = '';
  gardenState.harvestedVases.forEach(flowerId => {
    // Use your naming: vase-flowerid.png
    const img = document.createElement('img');
    img.className = 'vase-item';
    img.src = `assets/vase/vase-${flowerId}.png`;
    img.alt = `${flowerId} harvested vase`;
    vaseCollection.appendChild(img);
  });
}

function showPopupMessage(msg) {
  popupMessage.textContent = msg;
  popupMessage.classList.remove('hidden');

  // Clear previous timeout if any
  if (popupTimeoutId) clearTimeout(popupTimeoutId);
  popupTimeoutId = setTimeout(() => {
    popupMessage.classList.add('hidden');
  }, 2500);
}

function updateTheme(theme) {
  gardenWidget.className = '';
  gardenWidget.classList.add(`theme-${theme}`);
  gardenState.theme = theme;
  saveState();

  themeDots.forEach(dot => {
    const isActive = dot.dataset.theme === theme;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-checked', isActive ? 'true' : 'false');
    dot.tabIndex = isActive ? 0 : -1;
  });
}

// --- GAME LOGIC ---
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

// --- SEED JOURNAL POPUP ---
function openSeedJournal() {
  seedJournalPopup.classList.remove('hidden');
  seedJournalBtn.setAttribute('aria-expanded', 'true');
  currentJournalIndex = 0;

  // Show first unlocked seed or default to first flower
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
    <img src="assets/seedjournal/${flower.id}-seed.png" alt="${flower.name} seed" draggable="false" />
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

// --- BUY SEEDS POPUP ---
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
    if (owned) return; // skip owned seeds

    const li = document.createElement('li');
    li.textContent = flower.name;
    li.tabIndex = 0;
    li.setAttribute('role', 'option');
    li.addEventListener('click', () => buySeed(flower.id));
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

// --- DAILY LOGIN STREAK ---
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

// --- EVENT LISTENERS ---
themeDots.forEach(dot => {
  dot.addEventListener('click', () => {
    updateTheme(dot.dataset.theme);
  });
});

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

// --- INITIALIZATION ---
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
