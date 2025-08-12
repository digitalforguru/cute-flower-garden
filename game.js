// game.js - full integrated widget logic
// Make sure your assets folder matches the paths used below.

const STORAGE_KEY = "mini_garden_v1";

// exact flower list you gave (order preserved)
const FLOWERS = [
  "bluebells",
  "lily",
  "marigold",
  "daisy",
  "sunflower",
  "rose",
  "snapdragons",
  "peonies",
  "pansies",
  "cherryblossom",
  "lavender",
  "tulip",
];

// DEV mode: quick thresholds to test locally. Set to false for production (100/300/500).
const DEV_MODE = true;
const THRESHOLDS = DEV_MODE
  ? { sprout: 2, midgrowth: 4, mature: 6 }
  : { sprout: 100, midgrowth: 300, mature: 500 };

// seed cost (rose unlocked by default)
const SEED_COST_BASE = 30; // cost multiplier for buy list (you can adjust)
const STARTING_DAILY_WATER = 30;
const BUY_WATER_COST = 10; // lotus points
const BUY_WATER_AMOUNT = 3;
const BUY_SEED_REWARD = 0; // not used, buying costs points
const WATER_REWARD = 1; // optional: reward lotus per water
const HARVEST_REWARD = 20;

// UI elements
const widget = document.getElementById("garden-widget");
const lotusPointsSpan = document.getElementById("lotus-points-value");
const gardenImage = document.getElementById("garden-image");
const seedInventoryEl = document.getElementById("seed-inventory");
const vaseCollectionEl = document.getElementById("vase-collection");
const streakCountEl = document.getElementById("streak-count");

const seedJournalBtn = document.getElementById("seed-journal-btn");
const seedJournalPopup = document.getElementById("seed-journal-popup");
const closeJournalBtn = document.getElementById("close-journal-btn");
const seedJournalCard = document.getElementById("seed-journal-card");
const prevSeedBtn = document.getElementById("prev-seed-btn");
const nextSeedBtn = document.getElementById("next-seed-btn");

const buySeedListBtn = document.getElementById("buy-seed-list-btn");
const buySeedsPopup = document.getElementById("buy-seeds-popup");
const closeBuySeedsBtn = document.getElementById("close-buy-seeds-btn");
const buySeedsList = document.getElementById("buy-seeds-list");

const waterBtn = document.getElementById("water-btn");
const harvestBtn = document.getElementById("harvest-btn");
const buyWaterLink = document.getElementById("buy-water-link");

const popupMessage = document.getElementById("popup-message");
const themeDots = Array.from(document.querySelectorAll(".theme-dot"));

// default state
let state = {
  lotusPoints: 50,
  dailyWaterLeft: STARTING_DAILY_WATER,
  dailyWaterActions: 0, // for daily challenge (water 10)
  streak: 0,
  lastLoginDate: null,
  inventory: {}, // flowerId => qty (seedbags)
  planted: null, // { id, waterCount, plantedAt }
  harvested: [], // array of ids (vases collected)
  theme: "pink",
  journalIndex: 0,
};

// initialize inventory: rose unlocked by default (1)
FLOWERS.forEach((f) => (state.inventory[f] = 0));
state.inventory["rose"] = 1;

// STORAGE helpers
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      // merge parsed into state (preserve missing new keys)
      state = Object.assign(state, parsed);
      // ensure inventory entries exist
      FLOWERS.forEach((f) => {
        if (typeof state.inventory[f] !== "number") state.inventory[f] = 0;
      });
    } catch (e) {
      console.warn("failed parsing state, using defaults", e);
    }
  } else {
    saveState();
  }
}

// ui updates
function updateLotusUI() {
  lotusPointsSpan.textContent = state.lotusPoints;
}
function updateStreakUI() {
  streakCountEl.textContent = state.streak;
}
function getStageName(waters) {
  if (waters >= THRESHOLDS.mature) return "matureflower";
  if (waters >= THRESHOLDS.midgrowth) return "midgrowth";
  if (waters >= THRESHOLDS.sprout) return "sproutstage";
  return "seedstage";
}
function updateGardenImage() {
  if (!state.planted) {
    gardenImage.src = "assets/garden/vacant.png";
    gardenImage.alt = "empty garden";
    return;
  }
  const id = state.planted.id;
  const stage = getStageName(state.planted.waterCount);
  // IMPORTANT: filenames like bluebells-seedstage.png (hyphen not dot)
  gardenImage.src = `assets/flowers/${id}-${stage}.png`;
  gardenImage.alt = `${id} at ${stage}`;
}
function renderInventory() {
  seedInventoryEl.innerHTML = "";
  // show only owned seeds as requested (grid 6 across)
  FLOWERS.forEach((id) => {
    const qty = state.inventory[id] || 0;
    if (qty > 0) {
      const div = document.createElement("div");
      div.className = "seed-item";
      div.setAttribute("role", "button");
      div.setAttribute("tabindex", "0");
      div.setAttribute("aria-label", `plant ${id} seed, quantity ${qty}`);
      div.dataset.id = id;

      const img = document.createElement("img");
      img.src = `assets/seedbags/${id}-seedbag.png`;
      img.alt = `${id} seed bag`;
      img.draggable = false;

      const name = document.createElement("div");
      name.className = "seed-name";
      name.textContent = id;

      const qtyEl = document.createElement("div");
      qtyEl.className = "seed-qty";
      qtyEl.textContent = `${qty}x`;

      div.appendChild(img);
      div.appendChild(name);
      div.appendChild(qtyEl);

      div.addEventListener("click", () => plantSeed(id));
      div.addEventListener("keydown", (e) => {
        if (e.key === "Enter") plantSeed(id);
      });

      seedInventoryEl.appendChild(div);
    }
  });

  // if no owned seeds at all, show message
  const totalOwned = FLOWERS.reduce((s, f) => s + (state.inventory[f] || 0), 0);
  if (totalOwned === 0) {
    seedInventoryEl.textContent = "no seeds yet";
  }
}
function renderVases() {
  vaseCollectionEl.innerHTML = "";
  if (!state.harvested.length) {
    vaseCollectionEl.textContent = "no harvested vases yet";
    return;
  }
  // show up to latest few
  state.harvested.forEach((id) => {
    const img = document.createElement("img");
    img.className = "vase-item";
    // filenames like vase-bluebells.png
    img.src = `assets/vase/vase-${id}.png`;
    img.alt = `${id} vase`;
    vaseCollectionEl.appendChild(img);
  });
}

// popup message centered inside widget
let popupTimer = null;
function showPopup(msg, ms = 2500) {
  if (popupTimer) {
    clearTimeout(popupTimer);
    popupTimer = null;
  }
  popupMessage.textContent = msg;
  popupMessage.classList.remove("hidden");
  popupTimer = setTimeout(() => {
    popupMessage.classList.add("hidden");
  }, ms);
}

// seed journal
function openSeedJournal() {
  seedJournalPopup.classList.remove("hidden");
  seedJournalBtn.setAttribute("aria-expanded", "true");
  // pick first owned or first overall
  const firstOwned = FLOWERS.findIndex((f) => state.inventory[f] > 0);
  state.journalIndex = firstOwned >= 0 ? firstOwned : 0;
  renderJournalCard();
}
function closeSeedJournal() {
  seedJournalPopup.classList.add("hidden");
  seedJournalBtn.setAttribute("aria-expanded", "false");
}
function renderJournalCard() {
  const idx = ((state.journalIndex % FLOWERS.length) + FLOWERS.length) % FLOWERS.length;
  const id = FLOWERS[idx];
  const owned = state.inventory[id] > 0;
  // image from seedjournal folder: assets/seedjournal/flowerid-seed.png
  const imgSrc = owned ? `assets/seedjournal/${id}-seed.png` : `assets/seedjournal/locked-seed.png`;
  seedJournalCard.innerHTML = `
    <img src="${imgSrc}" alt="${id} seed card" draggable="false" />
    <div class="seed-name">${id}</div>
    <div style="font-size:12px;color:#666;margin:6px 0">${owned ? 'unlocked' : 'locked'}</div>
    <div style="font-size:12px;color:#444;margin-bottom:6px">${getSeedDescription(id)}</div>
    ${owned ? '' : `<button id="buy-from-journal" class="buy-inline" data-id="${id}">buy for ${seedCost(id)} lotus</button>`}
  `;
  // attach inline buy button if present
  const buyInline = document.getElementById("buy-from-journal");
  if (buyInline) buyInline.addEventListener("click", () => buySeed(id));
}
function journalPrev() {
  state.journalIndex = (state.journalIndex - 1 + FLOWERS.length) % FLOWERS.length;
  renderJournalCard();
}
function journalNext() {
  state.journalIndex = (state.journalIndex + 1) % FLOWERS.length;
  renderJournalCard();
}

// buy seeds popup
function openBuySeeds() {
  buySeedsPopup.classList.remove("hidden");
  buySeedListBtn.setAttribute("aria-expanded", "true");
  renderBuySeedsList();
}
function closeBuySeeds() {
  buySeedsPopup.classList.add("hidden");
  buySeedListBtn.setAttribute("aria-expanded", "false");
}
function seedCost(id) {
  // rose free
  const idx = FLOWERS.indexOf(id);
  if (id === "rose") return 0;
  return SEED_COST_BASE * Math.max(1, idx); // scalable costs per index
}
function renderBuySeedsList() {
  buySeedsList.innerHTML = "";
  FLOWERS.forEach((id) => {
    const owned = state.inventory[id] > 0;
    const li = document.createElement("li");
    li.tabIndex = 0;
    li.className = "buy-seed-row";
    li.innerHTML = `
      <img src="assets/seedjournal/${id}-seed.png" alt="${id} seed" draggable="false" />
      <div style="flex:1;">
        <div style="font-weight:600;color:var(--primary-color)">${id}</div>
        <div style="font-size:12px;color:#666">${owned ? 'owned' : `cost: ${seedCost(id)} lotus`}</div>
      </div>
      <div>
        ${owned ? '<small style="color:#888">owned</small>' : `<button class="buy-seed-btn" data-id="${id}">buy</button>`}
      </div>
    `;
    buySeedsList.appendChild(li);
  });
  // add listeners to buy buttons
  buySeedsList.querySelectorAll(".buy-seed-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = btn.dataset.id;
      buySeed(id);
    });
  });
}

// buy seed function
function buySeed(id) {
  const cost = seedCost(id);
  if (state.lotusPoints < cost) {
    showPopup("not enough lotus points");
    return;
  }
  state.lotusPoints -= cost;
  state.inventory[id] = (state.inventory[id] || 0) + 1;
  saveState(); updateAllUI();
  showPopup(`${id} seed purchased!`);
  // close buy popup if open
  if (!buySeedsPopup.classList.contains("hidden")) closeBuySeeds();
}

// planting
function plantSeed(id) {
  if (!state.inventory[id] || state.inventory[id] < 1) {
    showPopup("you don't own that seed");
    return;
  }
  if (state.planted) {
    showPopup("garden slot already planted - harvest first");
    return;
  }
  state.inventory[id] -= 1;
  state.planted = { id, waterCount: 0, plantedAt: Date.now() };
  saveState(); updateAllUI();
  showPopup(`planted ${id} seed`);
}

// watering
function waterPlant() {
  if (!state.planted) { showPopup("plant a seed first"); return; }
  if (state.dailyWaterLeft <= 0) { showPopup("no waters left today - buy more"); return; }
  state.dailyWaterLeft--;
  state.planted.waterCount++;
  state.dailyWaterActions++;
  // optional small reward per water
  state.lotusPoints += WATER_REWARD;
  // daily challenge: water 10 times -> reward 25 lotus (only once per day)
  if (state.dailyWaterActions === 10) {
    state.lotusPoints += 25;
    showPopup("daily challenge complete! +25 lotus");
  } else {
    showPopup("watered! +1 lotus");
  }
  saveState(); updateAllUI();
  // auto-harvest hint
  if (state.planted.waterCount >= THRESHOLDS.mature) {
    showPopup("your flower is ready to harvest!");
  }
}

// harvest
function harvestPlant() {
  if (!state.planted) { showPopup("nothing to harvest"); return; }
  if (state.planted.waterCount < THRESHOLDS.mature) { showPopup("not ready to harvest"); return; }
  const id = state.planted.id;
  state.harvested.push(id);
  state.planted = null;
  state.lotusPoints += HARVEST_REWARD;
  saveState(); updateAllUI();
  showPopup(`harvested ${id}! +${HARVEST_REWARD} lotus`);
}

// buy water link handler
function buyWaterHandler(e) {
  e.preventDefault();
  if (state.lotusPoints < BUY_WATER_COST) { showPopup("not enough lotus points to buy water"); return; }
  state.lotusPoints -= BUY_WATER_COST;
  state.dailyWaterLeft += BUY_WATER_AMOUNT;
  saveState(); updateAllUI();
  showPopup(`bought ${BUY_WATER_AMOUNT} waters`);
}

// garden card click: show a small in-widget card (we reuse seed journal opening to show current planted flower)
function showFlowerCard() {
  if (!state.planted) { showPopup("no planted flower - plant a seed"); return; }
  const id = state.planted.id;
  // open journal with this flower selected
  state.journalIndex = FLOWERS.indexOf(id);
  openSeedJournal();
}

// daily streak logic: call at init
function updateDailyLogin() {
  const today = new Date().toDateString();
  if (state.lastLoginDate === today) return; // already counted
  // check yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  if (state.lastLoginDate === yesterdayStr) state.streak++;
  else state.streak = 1;
  state.lastLoginDate = today;
  // reset daily water & counters
  state.dailyWaterLeft = STARTING_DAILY_WATER;
  state.dailyWaterActions = 0;
  saveState(); updateAllUI();
  showPopup(`daily login: streak ${state.streak}`);
}

// helper: description for seed journal
function getSeedDescription(id) {
  const map = {
    bluebells: "soft little blue bell clusters.",
    lily: "delicate petals, classic silhouette.",
    marigold: "bright and cheerful orange blooms.",
    daisy: "simple sunny petals.",
    sunflower: "tall and sunny, follows the sun.",
    rose: "classic, romantic petals.",
    snapdragons: "quirky dragon-shaped blooms.",
    peonies: "full and lush petals.",
    pansies: "tiny faces of color.",
    cherryblossom: "soft pink spring clouds.",
    lavender: "calming purple spikes.",
    tulip: "bold tulip cup flowers."
  };
  return map[id] || "";
}

// theme switching
function applyTheme(theme) {
  widget.className = "";
  widget.classList.add(`theme-${theme}`);
  state.theme = theme;
  // set CSS vars for consistency (some fallbacks)
  // these classes are defined in CSS, just saving state here
  saveState();
  // update active dots
  themeDots.forEach(d => {
    d.classList.toggle("active", d.dataset.theme === theme);
    d.setAttribute("aria-checked", d.dataset.theme === theme ? "true" : "false");
  });
}

// render UI all
function updateAllUI() {
  updateLotusUI();
  updateStreakUI();
  renderInventory();
  renderVases();
  updateGardenImage();
  // popup message position etc handled in CSS
}

// INITIALIZE & BINDINGS
function init() {
  loadState();
  // Attach theme handlers
  themeDots.forEach(dot => {
    dot.addEventListener("click", () => applyTheme(dot.dataset.theme));
  });
  // Attach UI handlers
  seedJournalBtn.addEventListener("click", openSeedJournal);
  closeJournalBtn.addEventListener("click", closeSeedJournal);
  prevSeedBtn.addEventListener("click", journalPrev);
  nextSeedBtn.addEventListener("click", journalNext);

  buySeedListBtn.addEventListener("click", openBuySeeds);
  closeBuySeedsBtn.addEventListener("click", closeBuySeeds);

  waterBtn.addEventListener("click", waterPlant);
  harvestBtn.addEventListener("click", harvestPlant);
  buyWaterLink.addEventListener("click", buyWaterHandler);

  gardenImage.addEventListener("click", showFlowerCard);
  gardenImage.addEventListener("keydown", (e) => {
    if (e.key === "Enter") showFlowerCard();
  });

  // buy seeds click delegation inside popup
  buySeedsList.addEventListener("click", (e) => {
    const btn = e.target.closest(".buy-seed-btn");
    if (!btn) return;
    const id = btn.dataset.id;
    buySeed(id);
  });

  // ensure buy seeds list is populated on open
  buySeedListBtn.addEventListener("click", renderBuySeedsList);

  // journal open/close accessibility
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!seedJournalPopup.classList.contains("hidden")) closeSeedJournal();
      if (!buySeedsPopup.classList.contains("hidden")) closeBuySeeds();
    }
  });

  // daily login + reset
  updateDailyLogin();

  // small rainy-day chance to reward user (5% chance)
  if (Math.random() < 0.05) {
    state.lotusPoints += 50;
    // also water planted once
    if (state.planted) {
      state.planted.waterCount++;
    }
    saveState();
    updateAllUI();
    showPopup("rainy day! +50 lotus and auto-water 🌧");
  }

  // render UI
  updateAllUI();
}

// run init
init();
