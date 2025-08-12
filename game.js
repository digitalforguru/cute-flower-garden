// Game state
const flowers = [
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

// Seed descriptions (example placeholders)
const flowerDescriptions = {
  bluebells: "Delicate blue flowers that brighten the garden.",
  lily: "Elegant white flowers symbolizing purity.",
  marigold: "Bright orange flowers that repel pests.",
  daisy: "Simple and charming white petals with a yellow center.",
  sunflower: "Tall and cheerful, follows the sun.",
  rose: "Classic romantic flower with a sweet fragrance.",
  snapdragons: "Colorful flowers shaped like dragon mouths.",
  peonies: "Lush, fragrant blooms that signal spring.",
  pansies: "Small flowers with colorful “faces.”",
  cherryblossom: "Soft pink blossoms that bloom briefly.",
  lavender: "Fragrant purple spikes great for relaxation.",
  tulip: "Bold and vibrant spring flower.",
};

// Initial inventory: 2 seeds of each flower
const seedInventory = {};
flowers.forEach(f => (seedInventory[f] = 2));

// Vase collection (harvested flowers count)
const vaseCollection = {}; // flowerName => count

// Garden state: what flower is planted? null means vacant
let gardenFlower = null;
let lotusPoints = 5;
let waterCount = 3;

// DOM references
const lotusPointsValue = document.getElementById("lotus-points-value");
const gardenImage = document.getElementById("garden-image");
const seedInventoryDiv = document.getElementById("seed-inventory");
const vaseCollectionDiv = document.getElementById("vase-collection");

const seedJournalBtn = document.getElementById("seed-journal-btn");
const buySeedListBtn = document.getElementById("buy-seed-list-btn");

const seedJournalPopup = document.getElementById("seed-journal-popup");
const seedJournalCard = document.getElementById("seed-journal-card");
const closeJournalBtn = document.getElementById("close-journal-btn");
const prevSeedBtn = document.getElementById("prev-seed-btn");
const nextSeedBtn = document.getElementById("next-seed-btn");

const buySeedsPopup = document.getElementById("buy-seeds-popup");
const buySeedsList = document.getElementById("buy-seeds-list");
const closeBuySeedsBtn = document.getElementById("close-buy-seeds-btn");

const waterBtn = document.getElementById("water-btn");
const harvestBtn = document.getElementById("harvest-btn");
const buyWaterBtn = document.getElementById("buy-water-btn");

const popupMessage = document.getElementById("popup-message");

const themeDots = document.querySelectorAll(".theme-dot");
const gardenWidget = document.getElementById("garden-widget");

// Helpers
function updateLotusPoints(amount) {
  lotusPoints = Math.max(0, lotusPoints + amount);
  lotusPointsValue.textContent = lotusPoints;
}

function showPopupMessage(message, duration = 2000) {
  popupMessage.textContent = message;
  popupMessage.classList.remove("hidden");
  setTimeout(() => {
    popupMessage.classList.add("hidden");
  }, duration);
}

// Render seed inventory
function renderSeedInventory() {
  seedInventoryDiv.innerHTML = "";
  Object.entries(seedInventory).forEach(([flower, qty]) => {
    if (qty > 0) {
      const div = document.createElement("div");
      div.className = "seed-item";
      div.tabIndex = 0;
      div.setAttribute("role", "listitem");
      div.setAttribute("aria-label", `${flower}, quantity: ${qty}`);

      const img = document.createElement("img");
      img.src = `assets/seeds/${flower}-seed.png`;
      img.alt = `${flower} seed`;
      div.appendChild(img);

      const nameSpan = document.createElement("span");
      nameSpan.className = "seed-name";
      nameSpan.textContent = flower;
      div.appendChild(nameSpan);

      const qtySpan = document.createElement("span");
      qtySpan.className = "seed-qty";
      qtySpan.textContent = qty;
      div.appendChild(qtySpan);

      // Click or keyboard plant
      div.addEventListener("click", () => plantSeed(flower));
      div.addEventListener("keypress", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          plantSeed(flower);
        }
      });

      seedInventoryDiv.appendChild(div);
    }
  });
}

// Plant a seed in the garden
function plantSeed(flower) {
  if (gardenFlower !== null) {
    showPopupMessage("Garden already has a flower planted. Harvest first.");
    return;
  }
  if (seedInventory[flower] > 0) {
    seedInventory[flower]--;
    gardenFlower = flower;
    updateGardenImage();
    renderSeedInventory();
    showPopupMessage(`Planted a ${flower} seed 🌱`);
  } else {
    showPopupMessage(`No ${flower} seeds left. Buy more.`);
  }
}

// Update garden image based on planted flower
function updateGardenImage() {
  if (gardenFlower === null) {
    gardenImage.src = "assets/garden/vacant.png";
    gardenImage.alt = "Empty garden plot";
  } else {
    gardenImage.src = `assets/flowers/${gardenFlower}.png`;
    gardenImage.alt = `${gardenFlower} flower planted`;
  }
}

// Vase collection render
function renderVaseCollection() {
  vaseCollectionDiv.innerHTML = "";
  const totalVases = Object.values(vaseCollection).reduce((a,b) => a+b, 0);
  if (totalVases === 0) {
    vaseCollectionDiv.textContent = "No harvested vases yet.";
    return;
  }
  Object.entries(vaseCollection).forEach(([flower, count]) => {
    for(let i=0; i < count; i++) {
      const img = document.createElement("img");
      img.src = `assets/vases/${flower}-vase.png`;
      img.alt = `${flower} vase`;
      img.className = "vase-item";
      vaseCollectionDiv.appendChild(img);
    }
  });
}

// Water flower action
waterBtn.addEventListener("click", () => {
  if (gardenFlower === null) {
    showPopupMessage("No flower planted to water.");
    return;
  }
  if (waterCount < 1) {
    showPopupMessage("You need to buy water first.");
    return;
  }
  waterCount--;
  updateLotusPoints(1); // watering rewards 1 lotus point
  showPopupMessage(`Watered ${gardenFlower}, +1 lotus point!`);
});

// Harvest flower action
harvestBtn.addEventListener("click", () => {
  if (gardenFlower === null) {
    showPopupMessage("No flower planted to harvest.");
    return;
  }
  // Harvest adds 3 lotus points and adds a vase to collection
  updateLotusPoints(3);
  vaseCollection[gardenFlower] = (vaseCollection[gardenFlower] || 0) + 1;
  gardenFlower = null;
  updateGardenImage();
  renderVaseCollection();
  showPopupMessage("Harvested flower! +3 lotus points.");
});

// Buy water action
const buyWaterLink = document.getElementById("buy-water-link");

buyWaterLink.addEventListener("click", (e) => {
  e.preventDefault();
  // Your existing buy water logic here
  if (lotusPoints < 2) {
    showPopupMessage("need at least 2 lotus points to buy water.");
    return;
  }
  updateLotusPoints(-2);
  waterCount++;
  showPopupMessage("bought water +1");
});

// Seed journal popup logic
let journalIndex = 0;

function openSeedJournal() {
  seedJournalPopup.classList.remove("hidden");
  seedJournalBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden"; // lock scroll
  showJournalCard(journalIndex);
  seedJournalPopup.focus();
}

function closeSeedJournal() {
  seedJournalPopup.classList.add("hidden");
  seedJournalBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "auto";
  seedJournalBtn.focus();
}

function showJournalCard(index) {
  if (index < 0) journalIndex = flowers.length -1;
  else if (index >= flowers.length) journalIndex = 0;
  else journalIndex = index;

  const flower = flowers[journalIndex];
  seedJournalCard.innerHTML = `
    <img src="assets/seeds/${flower}-seed.png" alt="${flower} seed" />
    <div class="seed-name">${flower}</div>
    <div class="seed-description">${flowerDescriptions[flower]}</div>
  `;
}

prevSeedBtn.addEventListener("click", () => {
  showJournalCard(journalIndex - 1);
});

nextSeedBtn.addEventListener("click", () => {
  showJournalCard(journalIndex + 1);
});

closeJournalBtn.addEventListener("click", closeSeedJournal);

seedJournalBtn.addEventListener("click", openSeedJournal);

// Buy seeds popup logic
function openBuySeeds() {
  buySeedsPopup.classList.remove("hidden");
  buySeedListBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  buySeedsPopup.focus();
}

function closeBuySeeds() {
  buySeedsPopup.classList.add("hidden");
  buySeedListBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "auto";
  buySeedListBtn.focus();
}

closeBuySeedsBtn.addEventListener("click", closeBuySeeds);
buySeedListBtn.addEventListener("click", openBuySeeds);

function renderBuySeedsList() {
  buySeedsList.innerHTML = "";
  flowers.forEach(flower => {
    const li = document.createElement("li");
    li.tabIndex = 0;
    li.setAttribute("role", "listitem");
    li.setAttribute("aria-label", `Buy ${flower} seed for 2 lotus points`);

    const img = document.createElement("img");
    img.src = `assets/seeds/${flower}-seed.png`;
    img.alt = `${flower} seed`;

    const nameSpan = document.createElement("span");
    nameSpan.className = "seed-name";
    nameSpan.textContent = flower;

    li.appendChild(img);
    li.appendChild(nameSpan);

    li.addEventListener("click", () => buySeed(flower));
    li.addEventListener("keypress", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        buySeed(flower);
      }
    });

    buySeedsList.appendChild(li);
  });
}

function buySeed(flower) {
  if (lotusPoints < 2) {
    showPopupMessage("Not enough lotus points to buy seed.");
    return;
  }
  updateLotusPoints(-2);
  seedInventory[flower] = (seedInventory[flower] || 0) + 1;
  renderSeedInventory();
  showPopupMessage(`Bought 1 ${flower} seed!`);
}

renderSeedInventory();
renderVaseCollection();
renderBuySeedsList();

// Theme switching
themeDots.forEach(dot => {
  dot.addEventListener("click", () => {
    const selectedTheme = dot.dataset.theme;
    gardenWidget.className = `theme-${selectedTheme}`;
    themeDots.forEach(d => {
      d.classList.remove("active");
      d.setAttribute("aria-checked", "false");
      d.tabIndex = -1;
    });
    dot.classList.add("active");
    dot.setAttribute("aria-checked", "true");
    dot.tabIndex = 0;
  });
});

// Accessibility: close popups on ESC key
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (!seedJournalPopup.classList.contains("hidden")) {
      closeSeedJournal();
    }
    if (!buySeedsPopup.classList.contains("hidden")) {
      closeBuySeeds();
    }
  }
});

// Make garden image button toggle popup (to show journal)
gardenImage.addEventListener("click", openSeedJournal);
gardenImage.addEventListener("keypress", e => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openSeedJournal();
  }
});
