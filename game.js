/* =====================
VARIABLES & DOM ELEMENTS
===================== */
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

const flowerCardPopup = document.getElementById("flower-card-popup");
const closeFlowerCard = document.getElementById("close-flower-card");
const flowerNameEl = document.getElementById("flower-name");
const flowerFactEl = document.getElementById("flower-fact");
const flowerQuoteEl = document.getElementById("flower-quote");

const STORAGE_KEY = "cuteGardenState";

/* =====================
STATE & DATA
===================== */
const seeds = [
  "bluebells", "lily", "marigold", "daisy", "sunflower", "rose",
  "snapdragons", "peonies", "pansies", "cherryblossom", "lavender", "tulip"
];

// Flowers facts & quotes
const flowerData = {
 bluebells: [
    { fact: "Bluebells are symbols of gratitude.", quote: "Gratitude blooms in quiet hearts." },
    { fact: "They grow in dense clusters in spring.", quote: "Spring whispers in blue hues." },
    { fact: "Bluebells can carpet entire forests.", quote: "Nature paints with patience." },
    { fact: "They are perennial and return yearly.", quote: "True beauty always returns." }
  ],
  lily: [
    { fact: "Lilies symbolize purity and renewal.", quote: "Renew your soul like a lily." },
    { fact: "They grow from bulbs.", quote: "Great things grow from small beginnings." },
    { fact: "Lilies bloom in summer.", quote: "Patience brings color to life." },
    { fact: "They come in many colors.", quote: "Variety makes the world beautiful." }
  ],
  marigold: [
    { fact: "Marigolds are used to repel insects.", quote: "Protection blooms in gold." },
    { fact: "They symbolize warmth and creativity.", quote: "Let creativity bloom." },
    { fact: "Marigolds are edible flowers.", quote: "Beauty can nourish." },
    { fact: "They thrive in sunny spots.", quote: "Sunshine grows happiness." }
  ],
  daisy: [
    { fact: "Daisies symbolize innocence.", quote: "Innocence shines quietly." },
    { fact: "They can grow almost anywhere.", quote: "Resilience is beauty." },
    { fact: "Daisies close at night.", quote: "Rest brings renewal." },
    { fact: "They are part of the sunflower family.", quote: "Family bonds blossom." }
  ],
  sunflower: [
    { fact: "Sunflowers track the sun.", quote: "Follow your light." },
    { fact: "They can grow very tall.", quote: "Reach high and bloom." },
    { fact: "Sunflowers produce edible seeds.", quote: "Generosity grows." },
    { fact: "They symbolize adoration.", quote: "Love shines bright." }
  ],
  rose: [
    { fact: "Roses symbolize love and passion.", quote: "Love blooms endlessly." },
    { fact: "They have thorns to protect themselves.", quote: "Strength protects beauty." },
    { fact: "Roses come in many colors.", quote: "Diversity is elegance." },
    { fact: "Rose petals can be used in tea.", quote: "Beauty is nourishing." }
  ],
  snapdragons: [
    { fact: "Snapdragons are also called dragon flowers.", quote: "Courage blooms inside." },
    { fact: "They can be tall or short.", quote: "Greatness comes in all sizes." },
    { fact: "Snapdragons symbolize grace.", quote: "Grace grows quietly." },
    { fact: "They bloom in summer and fall.", quote: "Timing is everything." }
  ],
  peonies: [
    { fact: "Peonies symbolize prosperity.", quote: "Wealth blooms in patience." },
    { fact: "They have large, fragrant blooms.", quote: "Fragrance spreads joy." },
    { fact: "Peonies can live for decades.", quote: "Endurance creates beauty." },
    { fact: "They bloom in late spring.", quote: "Good things take time." }
  ],
  pansies: [
    { fact: "Pansies symbolize loving thoughts.", quote: "Thoughtfulness blooms." },
    { fact: "They come in many bright colors.", quote: "Colors spark joy." },
    { fact: "Pansies can survive light frost.", quote: "Resilience is beauty." },
    { fact: "They bloom in spring and fall.", quote: "Seasons of growth." }
  ],
  cherryblossom: [
    { fact: "Cherry blossoms symbolize renewal.", quote: "New beginnings bloom." },
    { fact: "They bloom in early spring.", quote: "Hope awakens softly." },
    { fact: "They have very short bloom periods.", quote: "Enjoy fleeting beauty." },
    { fact: "They are culturally significant in Japan.", quote: "Tradition blossoms." }
  ],
  lavender: [
    { fact: "Lavender has a calming scent.", quote: "Calmness grows quietly." },
    { fact: "It is used in aromatherapy.", quote: "Wellness blooms naturally." },
    { fact: "Lavender attracts pollinators.", quote: "Friendship blooms easily." },
    { fact: "It prefers sunny, well-drained soil.", quote: "Sun nurtures growth." }
  ],
  tulip: [
    { fact: "Tulips symbolize perfect love.", quote: "Love blooms beautifully." },
    { fact: "They come in nearly every color.", quote: "Variety creates beauty." },
    { fact: "Tulips were once worth more than gold.", quote: "Value is timeless." },
    { fact: "They bloom in spring.", quote: "Patience brings reward." }
  ]
};


const state = {
  lotusPoints: 20,
  streak: 0,
  currentFlower: null,
  flowerStage: "seedstage",
  harvestedFlowers: [],
  seedInventory: {},
  seedJournalIndex: 0,
  theme: "pink",
  lastLoginDate: null
};

// Initialize seed inventory
seeds.forEach(seed => state.seedInventory[seed] = 0);

// Daily water tracking
let dailyWaterCount = 0;
let lastWaterDate = null;

/* =====================
UTILITY FUNCTIONS
===================== */
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    const parsed = JSON.parse(savedState);
    Object.assign(state, parsed);
    if (parsed.seedInventory) state.seedInventory = {...parsed.seedInventory};
    if (parsed.harvestedFlowers) state.harvestedFlowers = [...parsed.harvestedFlowers];
  }
}

function showPopupMessage(message) {
  popupMessage.textContent = message;
  popupMessage.classList.add("visible");
  setTimeout(() => popupMessage.classList.remove("visible"), 2500);
}

function updateLotusPoints() {
  lotusPointsEl.textContent = state.lotusPoints;
  saveState();
}

function updateStreak() {
  streakCountEl.textContent = state.streak;
  let streakDisplay = document.querySelector(".streak-display");
  if (!streakDisplay) {
    streakDisplay = document.createElement("span");
    streakDisplay.className = "streak-display";
    streakDisplay.style.marginLeft = "0.6rem";
    streakDisplay.style.fontSize = "0.8rem";
    streakDisplay.style.color = "var(--primary-color)";
    const header = document.querySelector(".widget-header");
    if (header) header.appendChild(streakDisplay);
  }
  streakDisplay.textContent = `daily login streak: ${state.streak} ⟢`;
}

function updateGardenImage() {
  if (!state.currentFlower) {
    gardenImage.src = "assets/garden/vacant.png";
    gardenImage.alt = "empty garden";
  } else {
    const stage = state.flowerStage;
    const imgPath = `assets/flowers/${state.currentFlower}-${stage}.png`;
    gardenImage.src = imgPath;
    gardenImage.alt = `${state.currentFlower} at ${stage.replace("stage", "")}`;
  }
}

function updateSeedInventory() {
  seedInventoryEl.innerHTML = "";
  let hasSeeds = false;
  seeds.forEach(seed => {
    const count = state.seedInventory[seed];
    if (count > 0) {
      hasSeeds = true;
      const seedDiv = document.createElement("div");
      seedDiv.className = "seed-item";
      seedDiv.tabIndex = 0;
      seedDiv.dataset.seed = seed;
      const img = document.createElement("img");
      img.src = `assets/seedbags/${seed}-seedbag.png`;
      img.alt = `${seed} seed bag`;
      const label = document.createElement("span");
      label.textContent = `${seed} (${count})`;
      seedDiv.appendChild(img);
      seedDiv.appendChild(label);
      seedInventoryEl.appendChild(seedDiv);
    }
  });
  noSeedsText.style.display = hasSeeds ? "none" : "block";
}

function updateVaseCollection() {
  vaseCollectionEl.innerHTML = "";
  if (state.harvestedFlowers.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "no harvested flowers yet";
    emptyMsg.style.fontSize = "11px";
    emptyMsg.style.color = "var(--primary-color)";
    vaseCollectionEl.appendChild(emptyMsg);
    return;
  }
  state.harvestedFlowers.forEach(flower => {
    const vaseImg = document.createElement("img");
    vaseImg.className = "vase-item";
    vaseImg.src = `assets/vase/vase-${flower}.png`;
    vaseImg.alt = `vase with ${flower} flower`;
    vaseCollectionEl.appendChild(vaseImg);
  });
}

function resetDailyWaterIfNeeded() {
  const today = new Date().toDateString();
  if (lastWaterDate !== today) {
    dailyWaterCount = 0;
    lastWaterDate = today;
  }
}

/* =====================
DAILY STREAK
===================== */
function updateDailyStreak() {
  const today = new Date().toDateString();
  if (!state.lastLoginDate) {
    state.streak = 1;
    state.lastLoginDate = today;
    saveState();
    updateStreak();
    return;
  }
  if (state.lastLoginDate === today) return;
  const lastDate = new Date(state.lastLoginDate);
  const diffTime = new Date(today) - lastDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  state.streak = diffDays === 1 ? state.streak + 1 : 1;
  state.lastLoginDate = today;
  saveState();
  updateStreak();
}

/* =====================
FLOWER CARD POPUP
===================== */
function showFlowerCard(flowerName) {
  const data = flowerData[flowerName] || {
    fact: "Plant a seed and water it to grow a flower.",
    quote: "The best time to plant a tree was 20 years ago. The second best time is now."
  };
  flowerNameEl.textContent = flowerName || "No Flower";
  flowerFactEl.textContent = data.fact;
  flowerQuoteEl.textContent = data.quote;
  flowerCardPopup.style.display = "block";
}

closeFlowerCard.addEventListener("click", () => {
  flowerCardPopup.style.display = "none";
});

gardenSection.addEventListener("click", () => {
  if (!state.currentFlower) showPopupMessage("plant seed first!");
  else showFlowerCard(state.currentFlower);
});

/* =====================
PLANT / WATER / HARVEST
===================== */
function plantSeed(seedName) {
  if (state.seedInventory[seedName] > 0) {
    state.currentFlower = seedName;
    state.flowerStage = "seedstage";
    state.seedInventory[seedName]--;
    updateGardenImage();
    updateSeedInventory();
    showPopupMessage(`planted ${seedName} seed 🌱`);
  } else showPopupMessage(`no ${seedName} seeds available`);
}

function waterFlower() {
  resetDailyWaterIfNeeded();
  if (!state.currentFlower) return showPopupMessage("plant a seed first 🌱");
  if (dailyWaterCount >= 25) return showPopupMessage("daily watering limit reached 💧");
  const stages = ["seedstage", "sproutstage", "midgrowth", "matureflower"];
  const index = stages.indexOf(state.flowerStage);
  if (index < stages.length - 1) {
    state.flowerStage = stages[index + 1];
    updateGardenImage();
    showPopupMessage(`your ${state.currentFlower} grew! 🌸`);
    dailyWaterCount++;
  } else showPopupMessage("flower is already mature 🌼");
}

function harvestFlower() {
  if (!state.currentFlower) return showPopupMessage("plant and grow a flower first 🌱");
  if (state.flowerStage !== "matureflower") return showPopupMessage("flower is not mature yet 🌸");
  if (!state.harvestedFlowers.includes(state.currentFlower)) state.harvestedFlowers.push(state.currentFlower);
  state.lotusPoints += 5;
  updateLotusPoints();
  showPopupMessage(`harvested ${state.currentFlower} 🌼 +5 points`);
  state.currentFlower = null;
  state.flowerStage = "seedstage";
  updateGardenImage();
  updateVaseCollection();
}

function buyWater() {
  if (state.lotusPoints < 3) return showPopupMessage("need 3 points to buy water 💧");
  state.lotusPoints -= 3;
  updateLotusPoints();
  showPopupMessage("bought water 💧");
}

/* =====================
SEED JOURNAL
===================== */
let currentJournalIndex = 0;

function openSeedJournal() {
  seedJournalPopup.classList.remove("hidden");
  seedJournalBtn.setAttribute("aria-expanded", "true");
  currentJournalIndex = 0;
  updateSeedJournalCard();
  seedJournalPopup.focus();
}

function closeSeedJournal() {
  seedJournalPopup.classList.add("hidden");
  seedJournalBtn.setAttribute("aria-expanded", "false");
  seedJournalBtn.focus();
}

function updateSeedJournalCard() {
  const flower = seeds[currentJournalIndex];
  const imgSrc = `assets/seedjournal/${flower}-seed.png`;
  const isLocked = state.seedInventory[flower] === 0 && !state.harvestedFlowers.includes(flower);
  seedJournalCard.innerHTML = `
    <img src="${isLocked ? "assets/seedjournal/locked-seed.png" : imgSrc}" alt="${flower} seed journal card" />
    <p>${flower}</p>
    <p>${isLocked ? "locked" : "unlocked"}</p>
    <p>cost: ${getSeedCost(flower)} lotus points</p>
  `;
}

function prevSeedJournal() { if (currentJournalIndex > 0) { currentJournalIndex--; updateSeedJournalCard(); } }
function nextSeedJournal() { if (currentJournalIndex < seeds.length - 1) { currentJournalIndex++; updateSeedJournalCard(); } }

/* =====================
BUY SEEDS
===================== */
function getSeedCost(seedName) {
  const index = seeds.indexOf(seedName);
  return index === -1 ? 5 : 5 + index * 2;
}

function renderBuySeedsList() {
  buySeedsListEl.innerHTML = "";
  seeds.forEach(seed => {
    const cost = getSeedCost(seed);
    const li = document.createElement("li");
    li.textContent = `${seed} - ${cost} lotus points`;
    li.tabIndex = 0;
    li.dataset.seed = seed;
    buySeedsListEl.appendChild(li);
  });
}

function openBuySeedsPopup() {
  buySeedsPopup.classList.remove("hidden");
  buySeedListBtn.setAttribute("aria-expanded", "true");
  buySeedsPopup.focus();
  renderBuySeedsList();
}

function closeBuySeedsPopup() {
  buySeedsPopup.classList.add("hidden");
  buySeedListBtn.setAttribute("aria-expanded", "false");
  buySeedListBtn.focus();
}

function buySeed(seedName) {
  const cost = getSeedCost(seedName);
  if (state.lotusPoints < cost) return showPopupMessage(`need ${cost} lotus points to buy seed`);
  state.lotusPoints -= cost;
  state.seedInventory[seedName]++;
  updateLotusPoints();
  updateSeedInventory();
  showPopupMessage(`bought 1 ${seedName} seed 🌱`);
  closeBuySeedsPopup();
}

/* =====================
EVENT LISTENERS
===================== */
seedInventoryEl.addEventListener("click", e => {
  const seedDiv = e.target.closest(".seed-item");
  if (seedDiv) plantSeed(seedDiv.dataset.seed);
});

seedInventoryEl.addEventListener("keydown", e => {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("seed-item")) {
    e.preventDefault();
    plantSeed(e.target.dataset.seed);
  }
});

waterBtn.addEventListener("click", waterFlower);
harvestBtn.addEventListener("click", harvestFlower);
buyWaterBtn.addEventListener("click", buyWater);

seedJournalBtn.addEventListener("click", () => seedJournalPopup.classList.contains("hidden") ? openSeedJournal() : closeSeedJournal());
buySeedListBtn.addEventListener("click", () => buySeedsPopup.classList.contains("hidden") ? openBuySeedsPopup() : closeBuySeedsPopup());
closeJournalBtn.addEventListener("click", closeSeedJournal);
closeBuySeedsBtn.addEventListener("click", closeBuySeedsPopup);
prevSeedBtn.addEventListener("click", prevSeedJournal);
nextSeedBtn.addEventListener("click", nextSeedJournal);

buySeedsListEl.addEventListener("click", e => {
  if (e.target.tagName === "LI") buySeed(e.target.dataset.seed);
});
buySeedsListEl.addEventListener("keydown", e => {
  if ((e.key === "Enter" || e.key === " ") && e.target.tagName === "LI") { e.preventDefault(); buySeed(e.target.dataset.seed); }
});

themeDots.forEach(dot => dot.addEventListener("click", () => {
  const newTheme = dot.dataset.theme;
  if (state.theme === newTheme) return;
  state.theme = newTheme;
  gardenWidget.className = `theme-${newTheme}`;
  vaseWidget.className = `theme-${newTheme}`;
  themeDots.forEach(td => { td.setAttribute("aria-checked", td.dataset.theme === newTheme ? "true" : "false"); td.tabIndex = td.dataset.theme === newTheme ? 0 : -1; });
}));

document.addEventListener("keydown", e => {
  if (e.key === "Escape") { if (!seedJournalPopup.classList.contains("hidden")) closeSeedJournal(); if (!buySeedsPopup.classList.contains("hidden")) closeBuySeedsPopup(); if (flowerCardPopup.style.display === "block") flowerCardPopup.style.display = "none"; }
});

/* =====================
INITIALIZE
===================== */
loadState();
updateDailyStreak();
updateLotusPoints();
updateStreak();
updateGardenImage();
updateSeedInventory();
updateVaseCollection();
