// --- VARIABLES ---
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

const STORAGE_KEY = "cuteGardenState";

// --- DATA ---
const seeds = [
  "bluebells", "lily", "marigold", "daisy", "sunflower", "rose",
  "snapdragons", "peonies", "pansies", "cherryblossom", "lavender", "tulip"
];

// Water needed per flower stage (increasing with rarity)
const flowerWaterStages = {
  bluebells: [50, 100, 150],
  lily: [60, 120, 180],
  marigold: [70, 140, 210],
  daisy: [80, 160, 240],
  sunflower: [100, 200, 300],
  rose: [120, 240, 360],
  snapdragons: [150, 300, 450],
  peonies: [180, 360, 540],
  pansies: [200, 400, 600],
  cherryblossom: [300, 600, 900, 1200],
  lavender: [250, 500, 750],
  tulip: [100, 200, 300]
};

// --- INITIAL STATE ---
const state = {
  lotusPoints: 20,
  streak: 0,
  currentFlower: null,
  flowerStage: "seedstage",
  flowerWatered: 0,
  harvestedFlowers: [],
  seedInventory: {},
  seedJournalIndex: 0,
  theme: "pink",
  lastLoginDate: null
};

// Initialize inventory
seeds.forEach(seed => state.seedInventory[seed] = 0);

// --- UTILITIES ---
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) Object.assign(state, JSON.parse(saved));
}

// Update display
function updateLotusPoints() { lotusPointsEl.textContent = state.lotusPoints; saveState(); }
function updateStreak() { streakCountEl.textContent = state.streak; }
function updateGardenImage() {
  if (!state.currentFlower) {
    gardenImage.src = "assets/garden/vacant.png";
    gardenImage.alt = "empty garden";
  } else {
    gardenImage.src = `assets/flowers/${state.currentFlower}-${state.flowerStage}.png`;
    gardenImage.alt = `${state.currentFlower} at ${state.flowerStage.replace("stage","")}`;
  }
}
function showPopupMessage(msg) {
  popupMessage.textContent = msg;
  popupMessage.classList.add("visible");
  setTimeout(() => popupMessage.classList.remove("visible"), 2500);
}

// --- SEED INVENTORY ---
function updateSeedInventory() {
  seedInventoryEl.innerHTML = "";
  let hasSeeds = false;
  seeds.forEach(seed => {
    const count = state.seedInventory[seed];
    if (count > 0) {
      hasSeeds = true;
      const div = document.createElement("div");
      div.className = "seed-item";
      div.setAttribute("tabindex","0");
      div.setAttribute("role","listitem");
      div.dataset.seed = seed;

      const img = document.createElement("img");
      img.src = `assets/seedbags/${seed}-seedbag.png`;
      img.alt = `${seed} seed`;
      img.style.width = "36px";
      img.style.height = "36px";
      img.style.objectFit = "contain";
      div.appendChild(img);

      const label = document.createElement("span");
      label.textContent = `${seed} (${count})`;
      label.className = "seed-name";
      div.appendChild(label);

      seedInventoryEl.appendChild(div);
    }
  });
  noSeedsText.style.display = hasSeeds ? "none" : "block";
}

// --- VASE ---
function updateVaseCollection() {
  vaseCollectionEl.innerHTML = "";
  if (!state.harvestedFlowers.length) {
    const p = document.createElement("p");
    p.textContent = "no harvested flowers yet";
    p.style.fontSize = "11px";
    vaseCollectionEl.appendChild(p);
    return;
  }
  state.harvestedFlowers.forEach(flower => {
    const img = document.createElement("img");
    img.src = `assets/vase/vase-${flower}.png`;
    img.alt = `vase with ${flower}`;
    img.className = "vase-item";
    vaseCollectionEl.appendChild(img);
  });
}

// --- PLANT / WATER / HARVEST ---
function plantSeed(seed) {
  if (state.seedInventory[seed] <= 0) return showPopupMessage("no seeds available 🌱");
  state.currentFlower = seed;
  state.flowerStage = "seedstage";
  state.flowerWatered = 0;
  state.seedInventory[seed]--;
  updateGardenImage();
  updateSeedInventory();
  showPopupMessage(`planted ${seed} 🌱`);
}

function waterFlower(times=1) {
  if (!state.currentFlower) return showPopupMessage("plant a seed first 🌱");
  const waterNeeded = flowerWaterStages[state.currentFlower];
  let stageIndex = ["seedstage","sproutstage","midgrowth","matureflower"].indexOf(state.flowerStage);
  if (stageIndex >= waterNeeded.length) return showPopupMessage("flower fully grown 🌼");

  let totalWaters = 0;
  for (let i=0;i<times;i++) {
    if (state.flowerWatered < waterNeeded[stageIndex]) {
      state.flowerWatered++;
      totalWaters++;
      if (state.flowerWatered >= waterNeeded[stageIndex]) {
        stageIndex++;
        state.flowerStage = ["seedstage","sproutstage","midgrowth","matureflower"][stageIndex];
      }
    }
  }
  updateGardenImage();
  showPopupMessage(`watered ${state.currentFlower} x${totalWaters} 💧`);
}

function harvestFlower() {
  if (!state.currentFlower) return showPopupMessage("plant and grow flower first 🌱");
  if (state.flowerStage !== "matureflower") return showPopupMessage("flower not mature 🌸");
  if (!state.harvestedFlowers.includes(state.currentFlower)) state.harvestedFlowers.push(state.currentFlower);
  state.lotusPoints += 5;
  updateLotusPoints();
  showPopupMessage(`harvested ${state.currentFlower} 🌼 +5 points`);
  state.currentFlower = null;
  state.flowerStage = "seedstage";
  state.flowerWatered = 0;
  updateGardenImage();
  updateVaseCollection();
}

function buyWater(times=1) {
  let cost = 5 * times;
  let gain = 8 * times;
  if (state.lotusPoints < cost) return showPopupMessage(`need ${cost} lotus points 💧`);
  state.lotusPoints -= cost;
  updateLotusPoints();
  // optional: store water to some counter
  showPopupMessage(`bought water x${gain} 💧`);
}

// --- SEED CLICK ---
seedInventoryEl.addEventListener("click", e => {
  const div = e.target.closest(".seed-item");
  if (div) plantSeed(div.dataset.seed);
});
seedInventoryEl.addEventListener("keydown", e => {
  if ((e.key === "Enter" || e.key===" ") && e.target.classList.contains("seed-item")) {
    plantSeed(e.target.dataset.seed);
  }
});

// --- BUTTON EVENTS ---
waterBtn.addEventListener("click",()=>waterFlower(1)); // could add popup choice for x10, x100 later
harvestBtn.addEventListener("click", harvestFlower);
buyWaterBtn.addEventListener("click",()=>buyWater(1));

seedJournalBtn.addEventListener("click",()=>seedJournalPopup.classList.toggle("hidden"));
buySeedListBtn.addEventListener("click",()=>{ buySeedsPopup.classList.toggle("hidden"); renderBuySeedsList(); });
closeJournalBtn.addEventListener("click",()=>seedJournalPopup.classList.add("hidden"));
closeBuySeedsBtn.addEventListener("click",()=>buySeedsPopup.classList.add("hidden"));

// --- THEME DOTS ---
themeDots.forEach(dot=>{
  dot.addEventListener("click",()=>{
    state.theme = dot.dataset.theme;
    gardenWidget.className=`theme-${state.theme}`;
    vaseWidget.className=`theme-${state.theme}`;
    themeDots.forEach(td=>{td.setAttribute("aria-checked", td.dataset.theme===state.theme?"true":"false"); td.tabIndex=td.dataset.theme===state.theme?0:-1;});
    saveState();
  });
});

// --- BUY SEEDS ---
const buySeedsListEl = document.getElementById("buy-seeds-list");
function getSeedCost(seed){ return 5 + seeds.indexOf(seed)*2; }
function renderBuySeedsList(){
  buySeedsListEl.innerHTML="";
  seeds.forEach(seed=>{
    const li=document.createElement("li");
    li.textContent=`${seed} - ${getSeedCost(seed)} lotus points`;
    li.tabIndex=0; li.dataset.seed=seed;
    buySeedsListEl.appendChild(li);
  });
}
function buySeed(seed){
  const cost = getSeedCost(seed);
  if(state.lotusPoints<cost) return showPopupMessage(`need ${cost} lotus points`);
  state.lotusPoints -= cost;
  state.seedInventory[seed]++;
  updateLotusPoints(); updateSeedInventory();
  showPopupMessage(`bought 1 ${seed} 🌱`);
  buySeedsPopup.classList.add("hidden");
}
buySeedsListEl.addEventListener("click", e=>{ if(e.target.tagName==="LI") buySeed(e.target.dataset.seed); });
buySeedsListEl.addEventListener("keydown", e=>{ if((e.key==="Enter"||e.key===" ") && e.target.tagName==="LI") buySeed(e.target.dataset.seed); });

// --- SEED JOURNAL ---
let currentJournalIndex=0;
prevSeedBtn.addEventListener("click",()=>{ if(currentJournalIndex>0){ currentJournalIndex--; updateSeedJournalCard(); } });
nextSeedBtn.addEventListener("click",()=>{ if(currentJournalIndex<seeds.length-1){ currentJournalIndex++; updateSeedJournalCard(); } });
function updateSeedJournalCard(){
  const flower=seeds[currentJournalIndex];
  const locked = state.seedInventory[flower]===0 && !state.harvestedFlowers.includes(flower);
  seedJournalCard.innerHTML=`
    <img src="${locked?'assets/seedjournal/locked-seed.png':`assets/seedjournal/${flower}-seed.png`}" alt="${flower}" />
    <p>${flower}</p>
    <p>${locked?'locked':'unlocked'}</p>
    <p>cost: 5 lotus points</p>
  `;
}

// --- FLOWER FACT ---
const flowerFactPopup = document.getElementById("flower-fact-popup");
function showFlowerFact(){
  if(!state.currentFlower) return showPopupMessage("plant seed first!");
  const facts = flowerFacts[state.currentFlower];
  if(!facts) return;
  const {fact, quote} = facts[Math.floor(Math.random()*facts.length)];
  flowerFactPopup.innerHTML=`
    <p style="font-weight:bold">${state.currentFlower}</p>
    <p>${fact}</p>
    <p style="font-style:italic">"${quote}"</p>
    <button id="close-flower-fact" style="margin-top:0.5rem;">close</button>
  `;
  flowerFactPopup.classList.add("visible");
  document.getElementById("close-flower-fact").addEventListener("click",()=>flowerFactPopup.classList.remove("visible"));
}
gardenSection.addEventListener("click", showFlowerFact);

// --- INITIALIZE ---
loadState();
updateLotusPoints();
updateStreak();
updateGardenImage();
updateSeedInventory();
updateVaseCollection();
