// ====== SAFE DOM ELEMENTS ======
const getEl = id => document.getElementById(id);

const lotusPointsEl = getEl("lotus-points-value");
const waterCountEl = getEl("water-count-value");
const gardenImage = getEl("garden-image");
const seedInventoryEl = getEl("seed-inventory");
const noSeedsText = getEl("no-seeds-text");
const streakCountEl = getEl("streak-count");

const waterBtn = getEl("water-btn");
const harvestBtn = getEl("harvest-btn");

// these IDs are expected in your HTML; if they differ, keep your current IDs
const seedJournalBtn = getEl("seed-journal-btn");
const buySeedListBtn = getEl("buy-seed-list-btn");
const buyWaterBtn = getEl("buy-water-btn");

const seedJournalPopup = getEl("seed-journal-popup");
const buySeedsPopup = getEl("buy-seeds-popup");
const buyWaterPopup = getEl("buy-water-popup");

const closeJournalBtn = getEl("close-journal-btn");
const closeBuySeedsBtn = getEl("close-buy-seeds-btn");
const closeBuyWaterBtn = getEl("close-buy-water-btn");

const seedJournalCard = getEl("seed-journal-card");
const prevSeedBtn = getEl("prev-seed-btn");
const nextSeedBtn = getEl("next-seed-btn");

const popupMessage = getEl("popup-message");

const vaseCollectionEl = getEl("vase-collection");
const themeDots = document.querySelectorAll(".theme-dot");
const gardenWidget = getEl("garden-widget");
const vaseWidget = getEl("vase-widget");

const buySeedsListEl = getEl("buy-seeds-list");
const buyWaterListEl = getEl("buy-water-list");

const seedInventoryPopup = getEl("seed-inventory-popup");
const closeSeedInventoryBtn = getEl("close-seed-inventory-btn");
const seedInventoryPopupList = getEl("seed-inventory-popup-list");
// ====== SEED ZOOM POPUP ======
const seedZoomPopup = getEl("seed-zoom-popup");
const seedZoomImg = getEl("seed-zoom-img");
const seedZoomName = getEl("seed-zoom-name");
const closeSeedZoomBtn = getEl("close-seed-zoom-btn");

// ====== STORAGE & CONSTANTS ======
const STORAGE_KEY = "cuteGardenState";
const DAILY_WATER_BY_RARITY = { common:10, uncommon:20, rare:25, epic:35, legendary:40 };

// ====== FLOWERS DATA ======
const flowers = {
  "daisy": { rarity: "common", water: 15, cost: 50, img: "daisy" },
  "marigold": { rarity: "common", water: 20, cost: 75, img: "marigold" },
  "pansies": { rarity: "common", water: 25, cost: 100, img: "pansies" },
  "nasturtiums": { rarity: "common", water: 30, cost: 125, img: "nasturtium" },
  "geraniums": { rarity: "common", water: 35, cost: 150, img: "geranium" },
  "begonias": { rarity: "common", water: 40, cost: 175, img: "begonia" },
  "sunflowers": { rarity: "common", water: 45, cost: 200, img: "sunflower" },
  "cosmos": { rarity: "common", water: 50, cost: 225, img: "cosmos" },
  "bluebells": { rarity: "uncommon", water: 55, cost: 300, img: "bluebells" },
  "snapdragons": { rarity: "uncommon", water: 60, cost: 350, img: "snapdragon" },
  "morning glories": { rarity: "uncommon", water: 65, cost: 400, img: "morningglory" },
  "tulips": { rarity: "uncommon", water: 70, cost: 450, img: "tulip" },
  "freesias": { rarity: "uncommon", water: 75, cost: 500, img: "freesia" },
  "anemones": { rarity: "uncommon", water: 80, cost: 550, img: "anemone" },
  "lavender": { rarity: "uncommon", water: 90, cost: 600, img: "lavender" },
  "daffodils": { rarity: "uncommon", water: 100, cost: 650, img: "daffodil" },
  "cherry blossom tree": { rarity: "rare", water: 90, cost: 800, img: "cherryblossom" },
  "lillies": { rarity: "rare", water: 100, cost: 900, img: "lily" },
  "roses": { rarity: "rare", water: 110, cost: 1000, img: "rose" },
  "dahlias": { rarity: "rare", water: 120, cost: 1100, img: "dahlia" },
  "hibiscus": { rarity: "rare", water: 130, cost: 1200, img: "hibiscus" },
  "peonies": { rarity: "rare", water: 140, cost: 1300, img: "peonies" },
  "gardenias": { rarity: "rare", water: 150, cost: 1400, img: "gardenia" },
  "orchids": { rarity: "rare", water: 160, cost: 1500, img: "orchid" },
  "dandelion x summer": { rarity: "epic", water: 150, cost: 2000, img: "dandelionsummer" },
  "maple sapling tree x fall": { rarity: "epic", water: 165, cost: 2200, img: "maplesaplingfall" },
  "hellebore flowers x winter": { rarity: "epic", water: 180, cost: 2400, img: "helleborewinter" },
  "iris flowers x spring": { rarity: "epic", water: 195, cost: 2600, img: "irisflowerspring" },
  "bleeding hearts x valentines": { rarity: "legendary", water: 210, cost: 2800, img: "bleedingheartsvalentines" },
  "shamrock clovers x st patricks day": { rarity: "legendary", water: 225, cost: 3000, img: "shamrockcloverstp" },
  "ipheion starflower x 4th of july": { rarity: "legendary", water: 250, cost: 5000, img: "ipheionstarflower4th" },
  "poinsettia x christmas": { rarity: "legendary", water: 300, cost: 5500, img: "poinsettiachristmas" },
  "tacca bat flower x halloween": { rarity: "legendary", water: 350, cost: 6000, img: "taccabathalloween" },
};
const seeds = Object.keys(flowers);

// ====== GAME STATE ======
const state = {
  lotusPoints: 20,
  streak: 0,
  currentFlower: null,
  flowerStage: "seedstage",
  harvestedFlowers: [],
  seedInventory: {},
  waterGiven: {},
  theme: "pink",
  seedJournalIndex: 0,
  lastLoginDate: null,
  watersToday: 0,
  lastWaterDate: null,
  boughtWaters: 0,
  tutorialSeen: false
};

// ====== INITIAL SEED ======
function giveWelcomeSeed() {
  if (!state.seedInventory["daisy"]) {
    state.seedInventory["daisy"] = 1;
    showPopupMessage("Welcome! 🌸 You got 1 free daisy seed!");
    saveState();
  }
}

// ====== UTILITIES ======
function getRarityColor(rarity) {
  switch(rarity) {
    case "common": return "#a8e6cf";
    case "uncommon": return "#cba4ff";
    case "rare": return "#b71c1c";
    case "epic": return "#9c27b0";
    case "legendary": return "#ffd700";
    default: return "#000";
  }
}

// quick small toast popup (keeps your existing behavior)
function showPopupMessage(msg) {
  if (!popupMessage) return;
  popupMessage.textContent = msg;
  popupMessage.classList.add("visible");
  // auto hide after 2.5s
  setTimeout(() => popupMessage.classList.remove("visible"), 2500);
}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function loadState() { const saved = localStorage.getItem(STORAGE_KEY); if(saved) Object.assign(state, JSON.parse(saved)); }
function normalizeFlowerKey(name) { return seeds.find(f => f.toLowerCase() === name.toLowerCase()) || name; }

// ====== UI UPDATES ======
function updateLotusPoints() { 
  if(lotusPointsEl) lotusPointsEl.textContent = ` ${state.lotusPoints} LP`; 
  saveState(); 
}

function openSeedZoom(fName) {
  const f = flowers[fName];
  if (!f) return;
  const isLocked = !(state.seedInventory[fName] > 0 || state.harvestedFlowers.includes(fName));

  seedZoomName.textContent = fName + (isLocked ? " 🔒" : "");

  seedZoomImg.src = isLocked 
      ? `assets/seedjournal/${f.img}-lockedseed.png` 
      : `assets/seedjournal/${f.img}-seed.png`;

  seedZoomPopup.classList.remove("hidden");

  // --- ANIMATION START ---
  const cardImg = document.querySelector(`.seed-item[data-seed="${fName}"] img`) || document.querySelector(".journal-img");
  if (!cardImg) return;

  const cardRect = cardImg.getBoundingClientRect();
  const gardenRect = gardenWidget.getBoundingClientRect();

  // start position = card image
  seedZoomImg.style.top = `${cardRect.top}px`;
  seedZoomImg.style.left = `${cardRect.left}px`;
  seedZoomImg.style.width = `${cardRect.width}px`;
  seedZoomImg.style.height = `${cardRect.height}px`;

  // force reflow
  seedZoomImg.getBoundingClientRect();

  // end position = garden widget size
  seedZoomImg.style.top = `${gardenRect.top}px`;
  seedZoomImg.style.left = `${gardenRect.left}px`;
  seedZoomImg.style.width = `${gardenRect.width}px`;
  seedZoomImg.style.height = `${gardenRect.height}px`;
}

if(closeSeedZoomBtn) closeSeedZoomBtn.addEventListener("click", () => {
  seedZoomPopup.classList.add("hidden");
});

  const cardRect = cardImg.getBoundingClientRect();

  // animate back
  seedZoomImg.style.top = `${cardRect.top}px`;
  seedZoomImg.style.left = `${cardRect.left}px`;
  seedZoomImg.style.width = `${cardRect.width}px`;
  seedZoomImg.style.height = `${cardRect.height}px`;

  // hide popup after animation
  setTimeout(() => seedZoomPopup.classList.add("hidden"), 350);
});

// ====== WATER COUNT UI ======
function updateWaterCount() {
  if(!waterCountEl) return;

  // total waters = daily waters left + bought waters
  const totalWaters = (state.watersToday || 0) + (state.boughtWaters || 0);
  const dailyWaters = state.watersToday || 0;

  waterCountEl.textContent = `💧 Total waters: ${totalWaters} | 💧 Daily waters left: ${dailyWaters}`;
  saveState();
}

function updateStreak() { if(streakCountEl) streakCountEl.textContent = state.streak; saveState(); }

function updateGardenImage() {
  if(!gardenImage) return;
  if(!state.currentFlower) {
    gardenImage.src = "assets/garden/vacant.png";
    gardenImage.alt = "empty garden";
  } else {
    const f = flowers[normalizeFlowerKey(state.currentFlower)];
    if(!f) return console.error("Garden flower not found:", state.currentFlower);
    gardenImage.src = `assets/flowers/${f.img}-${state.flowerStage}.png`;
    gardenImage.alt = `${state.flowerStage}`;
  }
}

function updateVaseCollection() {
  if(!vaseCollectionEl) return;
  vaseCollectionEl.innerHTML = "";
  if(!state.harvestedFlowers.length) {
    vaseCollectionEl.textContent = "no harvested flowers yet";
    return;
  }
  state.harvestedFlowers.forEach(fName => {
    const f = flowers[normalizeFlowerKey(fName)];
    if(!f) return;
    const img = document.createElement("img");
    img.src = `assets/vase/vase-${f.img}.png`;
    img.alt = fName;
    img.className = "vase-item";
    vaseCollectionEl.appendChild(img);
  });
}

// ====== SEED INVENTORY POPUP ======
if(gardenImage) gardenImage.addEventListener("click", ()=>{ seedInventoryPopup.classList.toggle("hidden"); renderSeedInventoryPopup(); });
if(closeSeedInventoryBtn) closeSeedInventoryBtn.addEventListener("click", ()=> seedInventoryPopup.classList.add("hidden"));

function renderSeedInventoryPopup() {
  if(!seedInventoryPopupList) return;
  seedInventoryPopupList.innerHTML = "";
  Object.entries(state.seedInventory).forEach(([name, qty]) => {
    if(qty>0){
      const btn = document.createElement("button");
      btn.textContent = `${name} (${qty})`;
      btn.onclick = () => { plantSeed(name); seedInventoryPopup.classList.add("hidden"); };
      seedInventoryPopupList.appendChild(btn);
    }
  });
}

function updateSeedInventory() {
  if(!seedInventoryEl) return;
  seedInventoryEl.innerHTML = "";
  const owned = seeds.filter(f => state.seedInventory[f]>0);
  if(!owned.length){ if(noSeedsText) noSeedsText.style.display="block"; return; }
  if(noSeedsText) noSeedsText.style.display="none";

  owned.forEach(fName => {
    const f = flowers[fName]; if(!f) return;
    const div = document.createElement("div");
    div.className = "seed-item seed-glow";
    div.dataset.seed = fName;
    div.innerHTML = `
      <img src="assets/seedbags/${f.img}-seedbag.png" alt="${fName}" class="seed-img"/>
      <p class="seed-name">${fName}</p>
      <p class="seed-rarity" style="color:${getRarityColor(f.rarity)}">${f.rarity}</p>
      <p class="seed-count">x${state.seedInventory[fName]}</p>
    `;
    div.addEventListener("click", ()=>plantSeed(fName));
    seedInventoryEl.appendChild(div);
  });
}

// ====== SEED JOURNAL ======
function updateSeedJournalCard() {
  if (!seedJournalCard) return;

  const idx = state.seedJournalIndex;
  const fName = seeds[idx];
  const f = flowers[fName];
  if (!f) return;

  const isLocked = !(state.seedInventory[fName] > 0 || state.harvestedFlowers.includes(fName));
  const imgSrc = isLocked 
    ? `assets/seedjournal/${f.img}-lockedseed.png` 
    : `assets/seedjournal/${f.img}-seed.png`;

  // --- Set the card HTML ---
  seedJournalCard.innerHTML = `
    <div class="journal-container">
      <div class="journal-img-wrapper" style="display:flex;align-items:center;gap:6px;">
        <button id="prev-seed-btn-small" class="nav-btn nav-left" aria-label="prev">◀</button>
        <div style="border:2px dashed rgba(231,84,128,0.4); padding:6px; border-radius:10px;">
          <img src="${imgSrc}" alt="${fName}" class="journal-img" style="width:140px;height:140px;object-fit:contain;border-radius:8px;"/>
        </div>
        <button id="next-seed-btn-small" class="nav-btn nav-right" aria-label="next">▶</button>
      </div>
      <div class="journal-info" style="margin-top:8px;text-align:center;">
        <p class="journal-name">${fName}</p>
        <p class="journal-rarity" style="color:${getRarityColor(f.rarity)}">${f.rarity}</p>
        <p class="journal-water">Water Needed: 💧 ${f.water}</p>
        <p class="journal-cost">Cost: 🌸 ${f.cost}</p>
        <p class="journal-status">${isLocked ? "🔒 Locked" : "✅ Unlocked"}</p>
      </div>
    </div>
  `;

  // --- Attach event listeners after HTML exists ---

  // Zoom on image click
  const journalImg = seedJournalCard.querySelector(".journal-img");
  if (journalImg) {
    journalImg.addEventListener("click", () => openSeedZoom(fName));
  }

  // Small nav buttons
  const prevSmall = document.getElementById("prev-seed-btn-small");
  const nextSmall = document.getElementById("next-seed-btn-small");

  if (prevSmall) {
    prevSmall.addEventListener("click", () => {
      state.seedJournalIndex = (state.seedJournalIndex - 1 + seeds.length) % seeds.length;
      updateSeedJournalCard();
    });
  }

  if (nextSmall) {
    nextSmall.addEventListener("click", () => {
      state.seedJournalIndex = (state.seedJournalIndex + 1) % seeds.length;
      updateSeedJournalCard();
    });
  }
}

// ====== PLANT/WATER/HARVEST ======
function plantSeed(fName){
  if(!state.seedInventory[fName]||state.seedInventory[fName]<=0) return showPopupMessage(`No ${fName} seeds`);
  state.currentFlower=fName;
  state.flowerStage="seedstage";
  state.seedInventory[fName]--;
  updateGardenImage(); updateSeedInventory(); saveState();
  showPopupMessage(`Planted ${fName} 🌱`);
}

// ====== DAILY WATER LOGIC ======
function resetDailyWaterIfNeeded() {
  const today = new Date().toDateString();
  if(state.lastWaterDate !== today) {
    state.lastWaterDate = today;

    // Determine highest rarity owned
    const rarities=["common","uncommon","rare","epic","legendary"];
    let highest="common";
    seeds.forEach(fName=>{
      if(state.seedInventory[fName]>0){
        const r=flowers[fName].rarity;
        if(rarities.indexOf(r)>rarities.indexOf(highest)) highest=r;
      }
    });

    const newDailyWater = DAILY_WATER_BY_RARITY[highest] || 10;
    // add to leftover daily waters (so previously unused daily waters remain)
    state.watersToday = (state.watersToday || 0) + newDailyWater;
    showPopupMessage(`+${newDailyWater} daily waters for your ${highest} plants 💧`);
    saveState();
  }
}

// ====== WATER FLOW UPDATE ======
function waterFlower() {
  resetDailyWaterIfNeeded();
  if(!state.currentFlower) return showPopupMessage("Plant a seed first 🌱");
  
  // Use daily waters first, then bought waters
  if((state.watersToday || 0) <= 0 && (state.boughtWaters || 0) <= 0) 
    return showPopupMessage("No water left! Buy more 💧");

  const fName = state.currentFlower;
  const flower = flowers[normalizeFlowerKey(fName)];

  // Prioritize daily waters
  if((state.watersToday || 0) > 0) state.watersToday--;
  else state.boughtWaters--;

  state.waterGiven[fName] = (state.waterGiven[fName]||0)+1;

  const total = flower.water;
  const waters = state.waterGiven[fName];
  const stage1=Math.ceil(total/4), stage2=Math.ceil(total/2), stage3=Math.ceil(total*3/4);

  if(waters>=total) state.flowerStage="matureflower";
  else if(waters>=stage3) state.flowerStage="matureflower";
  else if(waters>=stage2) state.flowerStage="midgrowth";
  else if(waters>=stage1) state.flowerStage="sproutstage";
  else state.flowerStage="seedstage";

  updateGardenImage(); updateSeedInventory(); updateWaterCount(); saveState();
  if(waters>=total) showPopupMessage(`${fName} is ready to harvest! 🌸`);
  else showPopupMessage(`Watered ${fName} 💧 (${waters}/${total})`);
}

function harvestFlower() {
  if(!state.currentFlower) return showPopupMessage("Plant a seed first 🌱");
  const f = flowers[normalizeFlowerKey(state.currentFlower)];
  if((state.waterGiven[state.currentFlower]||0)<f.water) return showPopupMessage(`${state.currentFlower} needs more water`);
  state.harvestedFlowers.push(state.currentFlower);
  state.lotusPoints+=f.cost;
  state.waterGiven[state.currentFlower]=0;
  state.currentFlower=null;
  state.flowerStage="seedstage";
  updateGardenImage(); updateVaseCollection(); updateLotusPoints(); updateSeedInventory(); saveState();
  showPopupMessage(`Harvested flower 🌸 +${f.cost} LP`);
}

// ====== BUY WATER UPDATE ======
function renderBuyWaterList() {
  if(!buyWaterListEl) return;
  buyWaterListEl.innerHTML="";
  const options=[ {qty:5,cost:5},{qty:10,cost:9},{qty:20,cost:18} ];
  options.forEach(opt=>{
    const li=document.createElement("li");
    li.className="buy-water-item";
    li.tabIndex=0;
    li.textContent=`💧 ${opt.qty} waters - Cost: ${opt.cost} LP`;
    li.addEventListener("click",()=>{
      if(state.lotusPoints<opt.cost) return showPopupMessage("Not enough lotus points");
      state.lotusPoints-=opt.cost;
      state.boughtWaters = (state.boughtWaters || 0) + opt.qty;
      updateLotusPoints(); updateWaterCount(); saveState();
      showPopupMessage(`Bought ${opt.qty} water 💧`);
    });
    buyWaterListEl.appendChild(li);
  });
}

// ====== BUY SEEDS ======
function buySeed(fName) {
  const f = flowers[normalizeFlowerKey(fName)];
  if(!f) return;
  if(state.lotusPoints<f.cost) return showPopupMessage(`Not enough lotus points`);
  state.lotusPoints-=f.cost;
  state.seedInventory[fName]=(state.seedInventory[fName]||0)+1;
  updateLotusPoints(); updateSeedInventory(); renderBuySeedsList(); saveState();
  showPopupMessage(`Bought 1 ${fName} seed 🌱`);
}

function renderBuySeedsList() {
  if(!buySeedsListEl) return;
  buySeedsListEl.innerHTML="";
  seeds.forEach(fName=>{
    const f=flowers[fName]; if(!f) return;
    const li=document.createElement("li");
    li.className="buy-seed-item";
    li.tabIndex=0;
    li.innerHTML=`<span class="seed-name">${fName}</span> <span class="seed-rarity" style="color:${getRarityColor(f.rarity)}">${f.rarity}</span> <span class="seed-cost">Cost: ${f.cost} LP</span>`;
    li.addEventListener("click",()=>buySeed(fName));
    buySeedsListEl.appendChild(li);
  });
}

// ====== SEED JOURNAL NAVIGATION ======
if(prevSeedBtn) prevSeedBtn.addEventListener("click", () => {
  state.seedJournalIndex = (state.seedJournalIndex - 1 + seeds.length) % seeds.length;
  updateSeedJournalCard();
});
if(nextSeedBtn) nextSeedBtn.addEventListener("click", () => {
  state.seedJournalIndex = (state.seedJournalIndex + 1) % seeds.length;
  updateSeedJournalCard();
});

// ====== THEME SELECTOR ======
themeDots.forEach(dot => {
  dot.addEventListener("click", () => {
    state.theme = dot.dataset.theme;
    applyTheme();
    saveState();
  });
});

function applyTheme() {
  if(gardenWidget) gardenWidget.className = `theme-${state.theme}`;
  if(vaseWidget) vaseWidget.className = `theme-${state.theme}`;
  themeDots.forEach(d => d.classList.toggle("active", d.dataset.theme === state.theme));
}

// ====== DAILY STREAK ======
function checkDailyStreak() {
  const today = new Date().toDateString();
  if (state.lastLoginDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    state.streak = state.lastLoginDate === yesterday ? state.streak + 1 : 1;
    state.lastLoginDate = today;
    updateStreak();
    saveState();
  }
}

// ====== POPUP BUTTONS (normal popups) ======
[
  { btn: seedJournalBtn, popup: seedJournalPopup, update: updateSeedJournalCard },
  { btn: buySeedListBtn, popup: buySeedsPopup, update: renderBuySeedsList },
  { btn: buyWaterBtn, popup: buyWaterPopup, update: renderBuyWaterList }
].forEach(({btn, popup, update}) => {
  if(!btn) return;
  btn.addEventListener("click", () => {
    [seedJournalPopup, buySeedsPopup, buyWaterPopup].forEach(p => p.classList.add("hidden"));
    const isHidden = popup.classList.contains("hidden");
    if(isHidden) {
      popup.classList.remove("hidden");
      if(update) update();
    }
  });
});

[
  { btn: closeJournalBtn, popup: seedJournalPopup },
  { btn: closeBuySeedsBtn, popup: buySeedsPopup },
  { btn: closeBuyWaterBtn, popup: buyWaterPopup }
].forEach(({btn, popup}) => {
  if(btn) btn.addEventListener("click", () => popup.classList.add("hidden"));
});

// ====== Tutorial / Help popup (injected if missing) ======
function ensureTutorialElements() {
  if(!gardenWidget) return;

  // info button (bottom-right of widget)
  if(!getEl("tutorial-info-btn")) {
    const infoBtn = document.createElement("button");
    infoBtn.id = "tutorial-info-btn";
    infoBtn.setAttribute("aria-label","open tutorial");
    infoBtn.title = "help / tutorial";
    infoBtn.style.cssText = "position:absolute;right:10px;bottom:10px;width:32px;height:32px;border-radius:50%;border:2px solid var(--primary-color);background:var(--background-color);cursor:pointer;";
    infoBtn.textContent = "i";
    infoBtn.addEventListener("click", showTutorialPopup);
    gardenWidget.appendChild(infoBtn);
  }

  // tutorial popup container
  if(!getEl("tutorial-popup")) {
    const pop = document.createElement("div");
    pop.id = "tutorial-popup";
    pop.className = "popup hidden";
    pop.setAttribute("role","dialog");
    pop.style.cssText = "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width: 90%;max-width: 300px;z-index:1200;";
    pop.innerHTML = `
      <h3 id="tutorial-title">welcome to my lil flowers 🌸</h3>
      <div id="tutorial-body" style="text-align:left;font-size:12px;line-height:1.3;margin-top:8px;">
        <p>thank you for joining! here's a quick guide:</p>
        <ul>
          <li>click the garden to plant seeds</li>
          <li>water your plants with daily waters or bought waters</li>
          <li>earn lotus points (LP) by harvesting flowers to buy more seeds</li>
        </ul>
        <p><strong>LP</strong> = lotus points used to buy seeds and water.</p>
      </div>
      <div style="margin-top:8px;display:flex;gap:8px;">
        <button id="tutorial-close-btn" style="flex:1;padding:6px;border-radius:8px;border:2px solid var(--primary-color);background:var(--primary-color);color:white;">let's grow 🌱</button>
        <button id="tutorial-dismiss-btn" style="flex:1;padding:6px;border-radius:8px;border:2px solid var(--primary-color);background:transparent;color:var(--primary-color);">close</button>
      </div>
    `;
    gardenWidget.appendChild(pop);

    // attach listeners
    getEl("tutorial-close-btn").addEventListener("click", () => {
      closeTutorialPopup();
      state.tutorialSeen = true;
      saveState();
    });
    getEl("tutorial-dismiss-btn").addEventListener("click", () => {
      closeTutorialPopup();
    });
  }
}

function showTutorialPopup() {
  const pop = getEl("tutorial-popup");
  if(!pop) return;
  pop.classList.remove("hidden");
}

function closeTutorialPopup() {
  const pop = getEl("tutorial-popup");
  if(!pop) return;
  pop.classList.add("hidden");
}

// ====== BUTTON EVENTS ======
if (waterBtn) waterBtn.addEventListener("click", waterFlower);
if (harvestBtn) harvestBtn.addEventListener("click", harvestFlower);

// ====== GLOBAL FUNCTIONS ======
window.plantSeed = plantSeed;

// ====== INITIALIZATION ======
function initGame() {
  loadState();

  // ensure tutorial/info button exists
  ensureTutorialElements();

  // Intro tutorial on first run
  if(!state.tutorialSeen) {
    // mark seen so it doesn't spam on next load (optional: change behavior)
    showTutorialPopup();
    state.tutorialSeen = true;
    saveState();
  }

  giveWelcomeSeed();
  updateLotusPoints();
  updateWaterCount();
  updateStreak();
  applyTheme();
  updateGardenImage();
  updateSeedInventory();
  updateVaseCollection();
  renderBuySeedsList();
  updateSeedJournalCard();
  checkDailyStreak();
  renderBuyWaterList();
}

// Prevent double initialization
if(gardenWidget && !gardenWidget.dataset.initialized) {
  gardenWidget.dataset.initialized = "true";
  initGame();
}
