// === Data & Constants ===

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
  { name: 'seedstage', minWater: 0 },
  { name: 'sproutstage', minWater: 100 },
  { name: 'midgrowth', minWater: 300 },
  { name: 'matureflower', minWater: 500 },
];

// === Elements ===
const gardenImage = document.getElementById('garden-image');
const seedInventory = document.getElementById('seed-inventory');
const seedJournal = document.getElementById('seed-journal');
const seedJournalPopup = document.getElementById('seed-journal-popup');
const closeJournalBtn = document.getElementById('close-journal-btn');
const waterBtn = document.getElementById('water-btn');
const harvestBtn = document.getElementById('harvest-btn');
const buyWaterBtn = document.getElementById('buy-water-btn');
const pointsDisplay = document.getElementById('points-display');
const vaseShelf = document.getElementById('vase-shelf');
const flowerCardPopup = document.getElementById('flower-card-popup');
const flowerCardContent = document.getElementById('flower-card-content');
const closeFlowerCardBtn = document.getElementById('close-flower-card');
const rainyPopup = document.getElementById('rainy-popup');
const rainyPopupBtn = document.getElementById('rainy-popup-btn');
const themeDots = document.querySelectorAll('.theme-dot');
const gardenWidget = document.getElementById('garden-widget');

// === Game State ===
let gardenState = {
  flowerId: null,
  waterCount: 0,
  stage: 0,
};

let ownedSeeds = ['rose']; // starts with rose unlocked
let seedInventoryCount = {}; // tracks counts of seeds in inventory
let harvestedFlowers = {}; // tracks harvested flower counts
let lotusPoints = 0;
let dailyWaterLimit = 30;
let dailyWaterUsed = 0;
let currentTheme = 'theme-pink';

// === Init ===

function loadGame() {
  const saved = JSON.parse(localStorage.getItem('gardenState'));
  if (saved) {
    gardenState = saved.gardenState;
    ownedSeeds = saved.ownedSeeds || ['rose'];
    seedInventoryCount = saved.seedInventoryCount || {};
    harvestedFlowers = saved.harvestedFlowers || {};
    lotusPoints = saved.lotusPoints || 0;
    dailyWaterUsed = saved.dailyWaterUsed || 0;
    currentTheme = saved.currentTheme || 'theme-pink';
  }
  setTheme(currentTheme);
  updateUI();
}

function saveGame() {
  localStorage.setItem(
    'gardenState',
    JSON.stringify({
      gardenState,
      ownedSeeds,
      seedInventoryCount,
      harvestedFlowers,
      lotusPoints,
      dailyWaterUsed,
      currentTheme,
    })
  );
}

// === UI Update ===

function updateUI() {
  updateGardenImage();
  updateSeedInventory();
  updatePointsDisplay();
  updateVaseShelf();
  updateButtons();
}

function updateGardenImage() {
  if (!gardenState.flowerId) {
    gardenImage.src = 'assets/garden/vacant.png';
    gardenImage.alt = 'empty garden';
    return;
  }
  const flower = flowers.find(f => f.id === gardenState.flowerId);
  const stageName = growthStages
    .slice()
    .reverse()
    .find(s => gardenState.waterCount >= s.minWater)?.name || 'seedstage';

  gardenState.stage = growthStages.findIndex(s => s.name === stageName);
  gardenImage.src = `assets/flowers/${flower.id}-${stageName}.png`;
  gardenImage.alt = `${flower.name} at ${stageName}`;
}

function updateSeedInventory() {
  seedInventory.innerHTML = '';
  ownedSeeds.forEach(seedId => {
    const img = document.createElement('img');
    img.src = `assets/seedbags/${seedId}-seedbag.png`;
    img.alt = `${seedId} seed bag`;
    img.title = seedId;
    img.classList.add('seed-bag');
    img.tabIndex = 0;
    img.addEventListener('click', () => plantSeed(seedId));
    seedInventory.appendChild(img);
  });
}

function updatePointsDisplay() {
  pointsDisplay.innerHTML = '';
  const img = document.createElement('img');
  img.src = 'https://spaces-cdn.clipsafari.com/cnhul66rcm4tiea3ng9oeiseuh0b'; // Lotus icon link (replace with your own or this)
  img.alt = 'lotus points icon';
  img.width = 26;
  img.height = 26;

  const span = document.createElement('span');
  span.textContent = `${lotusPoints}`;

  pointsDisplay.appendChild(img);
  pointsDisplay.appendChild(span);
}

function updateVaseShelf() {
  vaseShelf.innerHTML = '';
  flowers.forEach(flower => {
    const img = document.createElement('img');
    const harvestedCount = harvestedFlowers[flower.id] || 0;
    if (harvestedCount > 0) {
      img.src = `assets/vase/vase-${flower.id}.png`;
      img.alt = `${flower.name} vase`;
      img.title = `${flower.name} x${harvestedCount}`;
    } else {
      img.src = 'assets/vase/vase-locked.png';
      img.alt = 'locked vase';
      img.title = 'locked vase';
    }
    img.classList.add('vase');
    vaseShelf.appendChild(img);
  });
}

function updateButtons() {
  waterBtn.disabled = dailyWaterUsed >= dailyWaterLimit || !gardenState.flowerId;
  harvestBtn.disabled = gardenState.stage < 3; // must be matureflower
  buyWaterBtn.disabled = lotusPoints < 10; // cost of water is 10 lotus points
}

// === Actions ===

function plantSeed(seedId) {
  if (gardenState.flowerId) {
    alertPopup('please harvest current flower before planting a new seed.');
    return;
  }
  if (!seedInventoryCount[seedId]) seedInventoryCount[seedId] = 0;
  if (seedInventoryCount[seedId] <= 0) {
    alertPopup(`you have no ${seedId} seeds left!`);
    return;
  }
  gardenState.flowerId = seedId;
  gardenState.waterCount = 0;
  gardenState.stage = 0;
  seedInventoryCount[seedId]--;
  updateUI();
  saveGame();
}

function waterPlant() {
  if (dailyWaterUsed >= dailyWaterLimit) {
    alertPopup("you've used all your waters for today!");
    return;
  }
  if (!gardenState.flowerId) {
    alertPopup('please plant a seed first.');
    return;
  }
  gardenState.waterCount++;
  dailyWaterUsed++;
  updateUI();
  saveGame();
  checkDailyChallenge();
}

function harvestFlower() {
  if (gardenState.stage < 3) {
    alertPopup('flower is not ready to harvest yet!');
    return;
  }
  harvestedFlowers[gardenState.flowerId] = (harvestedFlowers[gardenState.flowerId] || 0) + 1;
  lotusPoints += 20;
  gardenState.flowerId = null;
  gardenState.waterCount = 0;
  gardenState.stage = 0;
  updateUI();
  saveGame();
  alertPopup('flower harvested! +20 lotus points');
}

function buyWater() {
  if (lotusPoints < 10) {
    alertPopup("you don't have enough lotus points to buy water!");
    return;
  }
  lotusPoints -= 10;
  dailyWaterUsed = Math.max(dailyWaterUsed - 5, 0); // gives back 5 waters
  updateUI();
  saveGame();
  alertPopup('bought 5 waters!');
}

// === Seed Journal Popup ===

function showSeedJournal() {
  seedJournalPopup.classList.remove('hidden');
  seedJournal.innerHTML = '';
  
  flowers.forEach(flower => {
    const img = document.createElement('img');
    if (ownedSeeds.includes(flower.id)) {
      img.src = `assets/seedjournal/${flower.id}-seed.png`;
      img.alt = `${flower.name} seed`;
      img.title = flower.name;
    } else {
      img.src = 'assets/seedjournal/locked-seed.png';
      img.alt = 'locked seed';
      img.title = 'locked seed';
    }
    img.classList.add('seed-bag');
    seedJournal.appendChild(img);
  });
}

function closeSeedJournal() {
  seedJournalPopup.classList.add('hidden');
}

// === Flower Card Popup ===

function showFlowerCard() {
  if (!gardenState.flowerId) return;
  flowerCardContent.innerHTML = '';
  const flower = flowers.find(f => f.id === gardenState.flowerId);
  if (!flower) return;
  
  const stageName = growthStages[gardenState.stage]?.name || 'seedstage';
  
  flowerCardContent.innerHTML = `
    <h3>${flower.name}</h3>
    <img src="assets/flowers/${flower.id}-${stageName}.png" alt="${flower.name} flower" />
    <p>waters: ${gardenState.waterCount} / ${flower.watersNeeded}</p>
    <p>growth stage: ${stageName}</p>
  `;
  flowerCardPopup.classList.remove('hidden');
}

function closeFlowerCardPopup() {
  flowerCardPopup.classList.add('hidden');
}

// === Rainy Day Popup ===

function triggerRainyDay() {
  if (Math.random() < 0.1) { // 10% chance daily
    dailyWaterUsed = Math.max(dailyWaterUsed - 3, 0);
    lotusPoints += 50;
    updateUI();
    saveGame();
    rainyPopup.classList.remove('hidden');
  }
}

function closeRainyPopup() {
  rainyPopup.classList.add('hidden');
}

// === Alert Popup ===

function alertPopup(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'popup alert-popup';
  alertDiv.textContent = message;
  gardenWidget.appendChild(alertDiv);
  setTimeout(() => {
    alertDiv.remove();
  }, 2200);
}

document.addEventListener('DOMContentLoaded', () => {
  const themeDots = document.querySelectorAll('.theme-dot');
  const gardenWidget = document.getElementById('garden-widget');

  // Load saved or default theme
  const savedTheme = localStorage.getItem('gardenTheme') || 'pink';
  setTheme(savedTheme);

  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      setTheme(dot.dataset.theme);
    });
  });

  function setTheme(theme) {
    // Remove all theme classes
    gardenWidget.classList.remove('pink', 'beige', 'lavender', 'blue', 'green');

    // Add new theme class
    gardenWidget.classList.add(theme);

    // Save theme
    localStorage.setItem('gardenTheme', theme);

    // Update active button styles
    themeDots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.theme === theme);
    });
  }
});

// === Daily Challenge (Water 10 times) ===
function checkDailyChallenge() {
  if (gardenState.waterCount >= 10) {
    alertPopup('daily challenge complete! you watered 10 times today 🌿');
  }
}

// === Event Listeners ===

waterBtn.addEventListener('click', waterPlant);
harvestBtn.addEventListener('click', harvestFlower);
buyWaterBtn.addEventListener('click', buyWater);
seedJournalPopup.querySelector('#close-journal-btn').addEventListener('click', closeSeedJournal);
document.getElementById('seed-journal-btn').addEventListener('click', showSeedJournal);
gardenImage.addEventListener('click', showFlowerCard);
closeFlowerCardBtn.addEventListener('click', closeFlowerCardPopup);
rainyPopupBtn.addEventListener('click', closeRainyPopup);

// === Start ===
loadGame();
updateUI();
triggerRainyDay();
