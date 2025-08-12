// Mini Pixel Garden game.js - compact widget version

// --- Flowers Data ---
const flowers = [
  { id: 'bluebells', name: 'bluebells', watersNeeded: 500 },
  { id: 'marigold', name: 'marigold', watersNeeded: 500 },
  { id: 'lily', name: 'lily', watersNeeded: 500 },
  { id: 'sunflower', name: 'sunflower', watersNeeded: 500 },
  { id: 'peonies', name: 'peonies', watersNeeded: 500 },
  { id: 'pansies', name: 'pansies', watersNeeded: 500 },
  { id: 'rose', name: 'rose', watersNeeded: 500 },
  { id: 'cherryblossom', name: 'cherry blossom', watersNeeded: 500 },
  { id: 'snapdragons', name: 'snapdragons', watersNeeded: 500 },
  { id: 'tulip', name: 'tulip', watersNeeded: 500 },
  { id: 'lavender', name: 'lavender', watersNeeded: 500 },
  { id: 'daisy', name: 'daisy', watersNeeded: 500 },
];

// Growth stages
const growthStages = [
  { id: 1, name: 'seedstage', waters: 0 },
  { id: 2, name: 'sproutstage', waters: 100 },
  { id: 3, name: 'midgrowth', waters: 300 },
  { id: 4, name: 'matureflower', waters: 500 },
];

// State keys for localStorage
const STORAGE_KEY = 'mini-pixel-garden-state-v2';

// State
let state = {
  lotusPoints: 0,
  dailyWater: 30,
  loginStreak: 0,
  lastLoginDate: null,
  flowerInventory: { rose: 1 }, // rose unlocked at start
  garden: { flowerId: null, waterCount: 0, stage: 1 },
  harvestedVases: {},
  seedJournalIndex: 0,
  theme: 'pink',
};

// Elements
const gardenImage = document.getElementById('garden-image');
const seedInventory = document.getElementById('seed-inventory');
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

const waterBtn = document.getElementById('water-btn');
const harvestBtn = document.getElementById('harvest-btn');
const buyWaterBtn = document.getElementById('buy-water-btn');

const popupMessage = document.getElementById('popup-message');
const vaseCollection = document.getElementById('vase-collection');
const loginStreakDisplay = document.getElementById('streak-count');
const lotusPointsDisplay = document.getElementById('lotus-points');
const themeDots = document.querySelectorAll('.theme-dot');


// --- Utility Functions ---

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    state = JSON.parse(saved);
    // Fix if any keys missing on update
    if (!state.flowerInventory) state.flowerInventory = { rose: 1 };
    if (!state.garden) state.garden = { flowerId: null, waterCount: 0, stage: 1 };
    if (!state.harvestedVases) state.harvestedVases = {};
    if (!state.loginStreak) state.loginStreak = 0;
    if (!state.lastLoginDate) state.lastLoginDate = null;
    if (!state.seedJournalIndex) state.seedJournalIndex = 0;
    if (!state.theme) state.theme = 'pink';
  }
}

// Show popup message inside widget center
function showPopupMessage(message, duration = 2500) {
  popupMessage.textContent = message;
  popupMessage.classList.remove('hidden');
  setTimeout(() => popupMessage.classList.add('hidden'), duration);
}

// Format flower name pretty
function formatName(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
}

// --- Theme Functions ---
function setTheme(theme) {
  const widget = document.getElementById('garden-widget');
  widget.className = ''; // clear all
  widget.classList.add(`theme-${theme}`);
  state.theme = theme;
  saveState();

  themeDots.forEach(dot => {
    dot.classList.toggle('active', dot.dataset.theme === theme);
  });
}

function loadTheme() {
  setTheme(state.theme);
}

// --- Garden Functions ---

function getCurrentFlower() {
  if (!state.garden.flowerId) return null;
  return flowers.find(f => f.id === state.garden.flowerId);
}

function getGrowthStage(waterCount) {
  for (let i = growthStages.length - 1; i >= 0; i--) {
    if (waterCount >= growthStages[i].waters) return growthStages[i];
  }
  return growthStages[0];
}

function updateGardenImage() {
  const flower = getCurrentFlower();
  if (!flower) {
    gardenImage.src = 'assets/garden/vacant.png';
    gardenImage.alt = 'empty garden plot';
    return;
  }
  const stage = getGrowthStage(state.garden.waterCount);
  gardenImage.src = `assets/flowers/${flower.id}-${stage.name}.png`;
  gardenImage.alt = `${flower.name} at ${stage.name.replace('stage','')}`;
}

function showFlowerDetails() {
  const flower = getCurrentFlower();
  if (!flower) {
    showPopupMessage('no flower planted');
    return;
  }
  const stage = getGrowthStage(state.garden.waterCount);
  const watersLeft = Math.max(flower.watersNeeded - state.garden.waterCount, 0);

  showPopupMessage(
    `${flower.name} - stage: ${stage.name.replace('stage','')} | waters left: ${watersLeft}`,
    3500
  );
}

// --- Seed Inventory ---

function updateSeedInventory() {
  seedInventory.innerHTML = '';
  const flowerIds = Object.keys(state.flowerInventory);
  if (flowerIds.length === 0) {
    seedInventory.textContent = 'no seeds owned yet';
    return;
  }
  flowerIds.forEach(id => {
    const qty = state.flowerInventory[id];
    const flower = flowers.find(f => f.id === id);
    if (!flower) return;

    const seedItem = document.createElement('div');
    seedItem.className = 'seed-item';
    seedItem.tabIndex = 0;
    seedItem.setAttribute('role', 'button');
    seedItem.setAttribute('aria-label', `plant ${flower.name} seed`);

    const img = document.createElement('img');
    img.src = `assets/seedjournal/${id}-seedbag.png`;
    img.alt = `${flower.name} seed bag`;
    seedItem.appendChild(img);

    const name = document.createElement('div');
    name.className = 'seed-name';
    name.textContent = flower.name;
    seedItem.appendChild(name);

    const qtyEl = document.createElement('div');
    qtyEl.className = 'seed-qty';
    qtyEl.textContent = `${qty}x`;
    seedItem.appendChild(qtyEl);

    seedItem.addEventListener('click', () => plantSeed(id));
    seedItem.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        plantSeed(id);
      }
    });

    seedInventory.appendChild(seedItem);
  });
}

// Plant a seed from inventory to garden
function plantSeed(flowerId) {
  if (!state.flowerInventory[flowerId] || state.flowerInventory[flowerId] <= 0) {
    showPopupMessage('you do not own this seed');
    return;
  }
  state.garden.flowerId = flowerId;
  state.garden.waterCount = 0;
  state.garden.stage = 1;
  state.flowerInventory[flowerId]--;
  if (state.flowerInventory[flowerId] <= 0) delete state.flowerInventory[flowerId];

  showPopupMessage(`planted ${flowerId} seed`);
  saveState();
  updateSeedInventory();
  updateGardenImage();
}

// --- Seed Journal ---

function openSeedJournal() {
  seedJournalPopup.classList.remove('hidden');
  state.seedJournalIndex = getFirstUnlockedSeedIndex();
  renderSeedJournalCard();
}

function closeSeedJournal() {
  seedJournalPopup.classList.add('hidden');
}

function getFirstUnlockedSeedIndex() {
  for (let i = 0; i < flowers.length; i++) {
    if (state.flowerInventory[flowers[i].id] > 0) return i;
  }
  return 0; // default to first flower if none unlocked
}

function renderSeedJournalCard() {
  const flower = flowers[state.seedJournalIndex];
  if (!flower) return;

  const isUnlocked = state.flowerInventory[flower.id] > 0;
  seedJournalCard.innerHTML = `
    <img src="assets/seedjournal/${flower.id}-seed.png" alt="${flower.name} seed" />
    <h3>${flower.name}</h3>
    <p>${isUnlocked ? 'unlocked' : 'locked'}</p>
  `;
}

// Navigate seeds journal
function nextSeed() {
  state.seedJournalIndex = (state.seedJournalIndex + 1) % flowers.length;
  renderSeedJournalCard();
}

function prevSeed() {
  state.seedJournalIndex = (state.seedJournalIndex - 1 + flowers.length) % flowers.length;
  renderSeedJournalCard();
}

// Buy seeds popup

function openBuySeedsList() {
  buySeedsPopup.classList.remove('hidden');
  buySeedsList.innerHTML = '';

  flowers.forEach(flower => {
    const ownedQty = state.flowerInventory[flower.id] || 0;
    if (ownedQty > 0) return; // skip seeds already owned

    const li = document.createElement('li');
    li.textContent = flower.name;
    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    li.setAttribute('aria-label', `buy ${flower.name} seed for 100 lotus points`);

    li.addEventListener('click', () => buySeed(flower.id));
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        buySeed(flower.id);
      }
    });

    buySeedsList.appendChild(li);
  });
}

function closeBuySeedsList() {
  buySeedsPopup.classList.add('hidden');
}

function buySeed(flowerId) {
  const cost = 100;
  if (state.lotusPoints < cost) {
    showPopupMessage('not enough lotus points');
    return;
  }
  state.lotusPoints -= cost;
  state.flowerInventory[flowerId] = 1;
  showPopupMessage(`bought ${flowerId} seed`);
  saveState();
  updateSeedInventory();
  closeBuySeedsList();
}

// --- Watering & Harvesting ---

function waterPlant() {
  if (!state.garden.flowerId) {
    showPopupMessage('plant a seed first');
    return;
  }
  if (state.dailyWater <= 0) {
    showPopupMessage('no water left, buy more');
    return;
  }
  state.dailyWater--;
  state.garden.waterCount++;

  // Update stage if needed
  let newStage = getGrowthStage(state.garden.waterCount).id;
  if (newStage !== state.garden.stage) {
    state.garden.stage = newStage;
    if (newStage === growthStages.length) {
      showPopupMessage('flower fully grown! ready to harvest');
    }
  }
  showPopupMessage('watered flower');
  saveState();
  updateUI();
}

function harvestFlower() {
  if (!state.garden.flowerId) {
    showPopupMessage('nothing planted to harvest');
    return;
  }
  if (state.garden.stage < growthStages.length) {
    showPopupMessage('flower not fully grown');
    return;
  }

  const flowerId = state.garden.flowerId;
  state.harvestedVases[flowerId] = (state.harvestedVases[flowerId] || 0) + 1;
  state.lotusPoints += 50; // reward lotus points
  state.garden = { flowerId: null, waterCount: 0, stage: 1 };

  showPopupMessage('harvested flower! +50 lotus points');
  saveState();
  updateUI();
}

// Buy water
function buyWater() {
  const cost = 10;
  if (state.lotusPoints < cost) {
    showPopupMessage('not enough lotus points');
    return;
  }
  state.lotusPoints -= cost;
  state.dailyWater += 10;
  showPopupMessage('bought 10 water units');
  saveState();
  updateUI();
}

// --- Vase Shelf ---

function updateVaseShelf() {
  vaseCollection.innerHTML = '';
  Object.entries(state.harvestedVases).forEach(([flowerId, qty]) => {
    if (qty <= 0) return;
    const img = document.createElement('img');
    img.className = 'vase-item';
    img.src = `assets/vase/${flowerId}-vase.png`;
    img.alt = `${flowerId} harvested vase`;
    img.title = `${flowerId} vase x${qty}`;
    vaseCollection.appendChild(img);
  });
}

// --- Daily Login Streak ---

function updateLoginStreak() {
  const today = new Date().toDateString();
  if (state.lastLoginDate !== today) {
    // If yesterday was last login, increment streak else reset
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (state.lastLoginDate === yesterday) {
      state.loginStreak++;
    } else {
      state.loginStreak = 1;
    }
    state.lastLoginDate = today;
    state.lotusPoints += 20; // daily bonus lotus points
    showPopupMessage(`daily login! +20 lotus points`);
    saveState();
  }
  loginStreakDisplay.textContent = state.loginStreak;
}

// --- Update UI ---

function updateUI() {
  updateGardenImage();
  updateSeedInventory();
  updateVaseShelf();
  lotusPointsDisplay.textContent = state.lotusPoints;
  loginStreakDisplay.textContent = state.loginStreak;
  // Update garden image alt already in updateGardenImage()
}

// --- Event Listeners ---

gardenImage.addEventListener('click', () => {
  showFlowerDetails();
});

seedJournalBtn.addEventListener('click', () => {
  openSeedJournal();
});

closeJournalBtn.addEventListener('click', () => {
  closeSeedJournal();
});

prevSeedBtn.addEventListener('click', () => {
  prevSeed();
});

nextSeedBtn.addEventListener('click', () => {
  nextSeed();
});

buySeedListBtn.addEventListener('click', () => {
  openBuySeedsList();
});

closeBuySeedsBtn.addEventListener('click', () => {
  closeBuySeedsList();
});

buySeedsList.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    buySeed(e.target.textContent.toLowerCase().replace(/\s/g, ''));
  }
});

waterBtn.addEventListener('click', () => {
  waterPlant();
});

harvestBtn.addEventListener('click', () => {
  harvestFlower();
});

buyWaterBtn.addEventListener('click', () => {
  buyWater();
});

themeDots.forEach(dot => {
  dot.addEventListener('click', () => {
    setTheme(dot.dataset.theme);
  });
});

// --- Init ---

function init() {
  loadState();
  loadTheme();
  updateUI();
  updateLoginStreak();
}

init();
