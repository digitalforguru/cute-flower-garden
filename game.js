// Variables
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

// Asset & Data Setup
const seeds = [
  "bluebells", "lily", "marigold", "daisy", "sunflower", "rose",
  "snapdragons", "peonies", "pansies", "cherryblossom", "lavender", "tulip"
];

// Store for game state
const state = {
  lotusPoints: 20,
  streak: 0,
  currentFlower: null, // string of flower name
  flowerStage: "seedstage", // seedstage, sproutstage, midgrowth, matureflower
  harvestedFlowers: [],
  seedInventory: {},
  seedJournalIndex: 0,
  theme: "pink"
};

// Initialize seed inventory with 0 seeds
seeds.forEach(seed => state.seedInventory[seed] = 0);

// Utility function: update lotus points display
function updateLotusPoints() {
  lotusPointsEl.textContent = state.lotusPoints;
}

// Utility function: update streak display
function updateStreak() {
  streakCountEl.textContent = state.streak;
}

// Utility: update garden image
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

// Update seed inventory display
function updateSeedInventory() {
  seedInventoryEl.innerHTML = "";
  let hasSeeds = false;
  seeds.forEach(seed => {
    const count = state.seedInventory[seed];
    if (count > 0) {
      hasSeeds = true;
      const seedDiv = document.createElement("div");
      seedDiv.className = "seed-item";
      seedDiv.setAttribute("tabindex", "0");
      seedDiv.setAttribute("role", "listitem");
      seedDiv.setAttribute("aria-label", `${seed} seed, count ${count}`);
      seedDiv.dataset.seed = seed;

      const img = document.createElement("img");
      img.src = `assets/seedbags/${seed}-seedbag.png`;
      img.alt = `${seed} seed bag`;
      seedDiv.appendChild(img);

      const label = document.createElement("span");
      label.className = "seed-name";
      label.textContent = `${seed} (${count})`;
      seedDiv.appendChild(label);

      seedInventoryEl.appendChild(seedDiv);
    }
  });
  noSeedsText.style.display = hasSeeds ? "none" : "block";
}

// Update vase shelf display
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

// Show popup message with auto hide
function showPopupMessage(message) {
  popupMessage.textContent = message;
  popupMessage.classList.add("visible");
  popupMessage.classList.remove("hidden");
  setTimeout(() => {
    popupMessage.classList.remove("visible");
    popupMessage.classList.add("hidden");
  }, 2500);
}

// Plant seed handler
function plantSeed(seedName) {
  if (state.seedInventory[seedName] > 0) {
    state.currentFlower = seedName;
    state.flowerStage = "seedstage";
    state.seedInventory[seedName]--;
    updateGardenImage();
    updateSeedInventory();
    showPopupMessage(`planted ${seedName} seed 🌱`);
  } else {
    showPopupMessage(`no ${seedName} seeds available`);
  }
}

// Water flower handler
function waterFlower() {
  if (!state.currentFlower) {
    showPopupMessage("plant a seed first 🌱");
    return;
  }
  const stages = ["seedstage", "sproutstage", "midgrowth", "matureflower"];
  let currentIndex = stages.indexOf(state.flowerStage);
  if (currentIndex < stages.length - 1) {
    state.flowerStage = stages[currentIndex + 1];
    updateGardenImage();
    showPopupMessage(`your ${state.currentFlower} grew! 🌸`);
  } else {
    showPopupMessage("flower is already mature 🌼");
  }
}

// Harvest flower handler
function harvestFlower() {
  if (!state.currentFlower) {
    showPopupMessage("plant and grow a flower first 🌱");
    return;
  }
  if (state.flowerStage !== "matureflower") {
    showPopupMessage("flower is not mature yet 🌸");
    return;
  }
  // Add to harvested
  if (!state.harvestedFlowers.includes(state.currentFlower)) {
    state.harvestedFlowers.push(state.currentFlower);
  }
  // Add lotus points for harvest
  state.lotusPoints += 5;
  updateLotusPoints();

  showPopupMessage(`harvested ${state.currentFlower} 🌼 +5 points`);

  // Reset garden
  state.currentFlower = null;
  state.flowerStage = "seedstage";
  updateGardenImage();
  updateVaseCollection();
}

// Buy water handler
function buyWater() {
  if (state.lotusPoints < 3) {
    showPopupMessage("need 3 points to buy water 💧");
    return;
  }
  state.lotusPoints -= 3;
  updateLotusPoints();
  showPopupMessage("bought water 💧");
}

// Seed inventory click handler to plant seed
seedInventoryEl.addEventListener("click", e => {
  const seedDiv = e.target.closest(".seed-item");
  if (seedDiv) {
    const seedName = seedDiv.dataset.seed;
    plantSeed(seedName);
  }
});

seedInventoryEl.addEventListener("keydown", e => {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("seed-item")) {
    e.preventDefault();
    plantSeed(e.target.dataset.seed);
  }
});

// Button event listeners
waterBtn.addEventListener("click", waterFlower);
harvestBtn.addEventListener("click", harvestFlower);
buyWaterBtn.addEventListener("click", buyWater);

// Theme switching handler
themeDots.forEach(dot => {
  dot.addEventListener("click", () => {
    const newTheme = dot.dataset.theme;
    if (state.theme === newTheme) return;

    state.theme = newTheme;

    // Update garden and vase theme classes
    gardenWidget.className = "";
    gardenWidget.classList.add(`theme-${newTheme}`);
    vaseWidget.className = "";
    vaseWidget.classList.add(`theme-${newTheme}`);

    // Update theme dots aria-checked and tabindex
    themeDots.forEach(td => {
      td.setAttribute("aria-checked", td.dataset.theme === newTheme ? "true" : "false");
      td.tabIndex = td.dataset.theme === newTheme ? 0 : -1;
    });
  });
});

// Seed journal navigation variables
let currentJournalIndex = 0;

// Function to open seed journal popup
function openSeedJournal() {
  if (Object.values(state.seedInventory).every(count => count === 0)) {
    showPopupMessage("no seeds in inventory to view");
    return;
  }
  currentJournalIndex = 0;
  renderSeedJournalCard(currentJournalIndex);
  seedJournalPopup.classList.remove("hidden");
  seedJournalPopup.setAttribute("aria-expanded", "true");
  seedJournalBtn.setAttribute("aria-expanded", "true");
  seedJournalPopup.focus();
}

// Function to close seed journal popup
function closeSeedJournal() {
  seedJournalPopup.classList.add("hidden");
  seedJournalPopup.setAttribute("aria-expanded", "false");
  seedJournalBtn.setAttribute("aria-expanded", "false");
  seedJournalBtn.focus();
}

// Render seed journal card info
function renderSeedJournalCard(index) {
  const seedNames = Object.keys(state.seedInventory).filter(seed => state.seedInventory[seed] > 0);
  if (seedNames.length === 0) {
    seedJournalCard.innerHTML = "<p>no seeds in journal</p>";
    return;
  }
  const seed = seedNames[index];
  const count = state.seedInventory[seed];

  seedJournalCard.innerHTML = `
    <img src="assets/seedbags/${seed}-seedbag.png" alt="${seed} seed bag" />
    <p><strong>${seed}</strong></p>
    <p>Quantity: ${count}</p>
    <p>Click a seed in inventory to plant it in the garden.</p>
  `;
}

// Navigate to previous seed in journal
function prevSeed() {
  const seedNames = Object.keys(state.seedInventory).filter(seed => state.seedInventory[seed] > 0);
  if (seedNames.length === 0) return;

  currentJournalIndex = (currentJournalIndex - 1 + seedNames.length) % seedNames.length;
  renderSeedJournalCard(currentJournalIndex);
}

// Navigate to next seed in journal
function nextSeed() {
  const seedNames = Object.keys(state.seedInventory).filter(seed => state.seedInventory[seed] > 0);
  if (seedNames.length === 0) return;

  currentJournalIndex = (currentJournalIndex + 1) % seedNames.length;
  renderSeedJournalCard(currentJournalIndex);
}

// Buy seeds popup controls
const buySeedsList = document.getElementById("buy-seeds-list");

// Populate buy seeds list
function populateBuySeedsList() {
  buySeedsList.innerHTML = "";
  seeds.forEach(seed => {
    const li = document.createElement("li");
    li.setAttribute("tabindex", "0");
    li.setAttribute("role", "option");
    li.textContent = `${seed} seed - 5 points`;
    li.dataset.seed = seed;
    buySeedsList.appendChild(li);
  });
}

// Buy seed handler when clicking in buy seeds popup
buySeedsList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  const seed = li.dataset.seed;
  buySeed(seed);
});

// Keyboard support for buying seeds (Enter or Space)
buySeedsList.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.tagName === "LI") {
    e.preventDefault();
    const seed = e.target.dataset.seed;
    buySeed(seed);
  }
});

// Buy a seed if enough lotus points
function buySeed(seedName) {
  if (state.lotusPoints < 5) {
    showPopupMessage("need 5 points to buy seed 🌱");
    return;
  }
  state.lotusPoints -= 5;
  state.seedInventory[seedName]++;
  updateLotusPoints();
  updateSeedInventory();
  showPopupMessage(`bought 1 ${seedName} seed 🌱`);
}

// Open buy seeds popup
function openBuySeedsPopup() {
  populateBuySeedsList();
  buySeedsPopup.classList.remove("hidden");
  buySeedsPopup.setAttribute("aria-expanded", "true");
  buySeedListBtn.setAttribute("aria-expanded", "true");
  buySeedsPopup.focus();
}

// Close buy seeds popup
function closeBuySeedsPopup() {
  buySeedsPopup.classList.add("hidden");
  buySeedsPopup.setAttribute("aria-expanded", "false");
  buySeedListBtn.setAttribute("aria-expanded", "false");
  buySeedListBtn.focus();
}

// Event listeners for popup buttons
seedJournalBtn.addEventListener("click", () => {
  if (seedJournalPopup.classList.contains("hidden")) {
    openSeedJournal();
  } else {
    closeSeedJournal();
  }
});

buySeedListBtn.addEventListener("click", () => {
  if (buySeedsPopup.classList.contains("hidden")) {
    openBuySeedsPopup();
  } else {
    closeBuySeedsPopup();
  }
});

closeJournalBtn.addEventListener("click", closeSeedJournal);
closeBuySeedsBtn.addEventListener("click", closeBuySeedsPopup);

// Keyboard accessibility: close popups on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!seedJournalPopup.classList.contains("hidden")) {
      closeSeedJournal();
    }
    if (!buySeedsPopup.classList.contains("hidden")) {
      closeBuySeedsPopup();
    }
  }
});

// Seed journal navigation buttons
prevSeedBtn.addEventListener("click", prevSeed);
nextSeedBtn.addEventListener("click", nextSeed);

// Keyboard support for prev/next buttons (Enter or Space)
prevSeedBtn.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    prevSeed();
  }
});
nextSeedBtn.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    nextSeed();
  }
});

// Initial setup
updateLotusPoints();
updateStreak();
updateGardenImage();
updateSeedInventory();
updateVaseCollection();

// Set initial theme aria states properly
themeDots.forEach(dot => {
  dot.setAttribute("aria-checked", dot.classList.contains("active") ? "true" : "false");
  dot.tabIndex = dot.classList.contains("active") ? 0 : -1;
});
