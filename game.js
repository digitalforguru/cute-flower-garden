// --- VARIABLES ---
const lotusPointsEl = document.getElementById("lotus-points-value");
const gardenImage = document.getElementById("garden-image");
const seedInventoryEl = document.getElementById("seed-inventory");
const noSeedsText = document.getElementById("no-seeds-text");
const streakCountEl = document.getElementById("streak-count");

const waterBtn = document.getElementById("water-btn");
const harvestBtn = document.getElementById("harvest-btn");
const buyWaterBtn = document.getElementById("buy-water-btn");

const seedJournalBtn = document.getElementById("buy-seed-list-btn"); // Combined button
const seedJournalPopup = document.getElementById("seed-journal-popup");
const seedJournalCard = document.getElementById("seed-journal-card");
const closeJournalBtn = document.getElementById("close-journal-btn");

const prevSeedBtn = document.getElementById("prev-seed-btn");
const nextSeedBtn = document.getElementById("next-seed-btn");

const popupMessage = document.getElementById("popup-message");
const vaseCollectionEl = document.getElementById("vase-collection");

const themeDots = document.querySelectorAll(".theme-dot");
const gardenWidget = document.getElementById("garden-widget");
const vaseWidget = document.getElementById("vase-widget");
const STORAGE_KEY = "cuteGardenState";

const gardenSection = document.getElementById("garden-section");

// --- ASSETS & DATA ---
const seeds = [
  "bluebells","lily","marigold","daisy","sunflower","rose",
  "snapdragons","peonies","pansies","cherryblossom","lavender","tulip"
];

// Flower water requirements (progressive)
const flowerWaterReq = {
  bluebells: [100,200,300],
  lily: [120,240,360],
  marigold: [140,280,420],
  daisy: [160,320,480],
  sunflower: [200,400,600],
  rose: [250,500,750],
  snapdragons: [300,600,900],
  peonies: [350,700,1050],
  pansies: [400,800,1200],
  cherryblossom: [500,1000,1500,2000],
  lavender: [450,900,1350],
  tulip: [300,600,900]
};

// Flower facts
const flowerFacts = { /* same as previous, omitted for brevity */ };

// --- GAME STATE ---
const state = {
  lotusPoints: 20,
  streak: 0,
  currentFlower: null,
  flowerStage: "seedstage",
  harvestedFlowers: [],
  seedInventory: {},
  seedJournalIndex: 0,
  theme: "pink",
  lastLoginDate: null,
  waterInventory: 0
};

// Initialize seed inventory
seeds.forEach(seed => state.seedInventory[seed] = 0);

// --- UTILITY FUNCTIONS ---
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if(savedState){
    Object.assign(state, JSON.parse(savedState));
  }
}

// --- UI UPDATES ---
function updateLotusPoints() { lotusPointsEl.textContent = state.lotusPoints; saveState(); }
function updateStreak() { streakCountEl.textContent = state.streak; }

function updateGardenImage() {
  if(!state.currentFlower){
    gardenImage.src="assets/garden/vacant.png";
    gardenImage.alt="empty garden";
  } else {
    gardenImage.src=`assets/flowers/${state.currentFlower}-${state.flowerStage}.png`;
    gardenImage.alt=`${state.currentFlower} at ${state.flowerStage.replace("stage","")}`;
  }
}

function updateSeedInventory(){
  seedInventoryEl.innerHTML="";
  let hasSeeds=false;
  seeds.forEach(seed=>{
    const count = state.seedInventory[seed];
    if(count>0){ hasSeeds=true;
      const seedDiv=document.createElement("div");
      seedDiv.className="seed-item";
      seedDiv.tabIndex=0;
      seedDiv.setAttribute("role","listitem");
      seedDiv.dataset.seed=seed;

      const img=document.createElement("img");
      img.src=`assets/seedbags/${seed}-seedbag.png`;
      img.alt=`${seed} seed bag`;
      seedDiv.appendChild(img);

      const label=document.createElement("span");
      label.className="seed-name";
      label.textContent=`${seed} (${count})`;
      seedDiv.appendChild(label);

      seedInventoryEl.appendChild(seedDiv);
    }
  });
  noSeedsText.style.display = hasSeeds ? "none" : "block";
}

function updateVaseCollection(){
  vaseCollectionEl.innerHTML="";
  if(state.harvestedFlowers.length===0){
    const emptyMsg=document.createElement("p");
    emptyMsg.textContent="no harvested flowers yet";
    emptyMsg.style.fontSize="11px";
    vaseCollectionEl.appendChild(emptyMsg);
    return;
  }
  state.harvestedFlowers.forEach(flower=>{
    const vaseImg=document.createElement("img");
    vaseImg.className="vase-item";
    vaseImg.src=`assets/vase/vase-${flower}.png`;
    vaseImg.alt=`vase with ${flower} flower`;
    vaseCollectionEl.appendChild(vaseImg);
  });
}

function showPopupMessage(msg){
  popupMessage.textContent=msg;
  popupMessage.classList.add("visible");
  setTimeout(()=>popupMessage.classList.remove("visible"),2500);
}

// --- PLANTING ---
function plantSeed(seedName){
  if(state.seedInventory[seedName]>0){
    state.currentFlower=seedName;
    state.flowerStage="seedstage";
    state.seedInventory[seedName]--;
    updateGardenImage();
    updateSeedInventory();
    showPopupMessage(`planted ${seedName} 🌱`);
  } else showPopupMessage(`no ${seedName} seeds`);
}

// --- WATER ---
let dailyWaterCount=0;
function waterFlower(multiplier=1){
  if(!state.currentFlower){ showPopupMessage("plant seed first 🌱"); return; }
  const maxWater=flowerWaterReq[state.currentFlower].reduce((a,b)=>a+b,0);
  if(state.waterInventory<=0){ showPopupMessage("no water 💧"); return; }
  const actualWater=Math.min(multiplier,state.waterInventory);
  state.waterInventory-=actualWater;

  // Simple growth logic
  const stages=["seedstage","sproutstage","midgrowth","matureflower"];
  let index=stages.indexOf(state.flowerStage);
  if(index<stages.length-1){
    state.flowerStage=stages[index+1];
    showPopupMessage(`watered ${state.currentFlower} x${actualWater} 🌸`);
  } else showPopupMessage("flower is mature 🌼");

  updateGardenImage();
  saveState();
}

// --- HARVEST ---
function harvestFlower(){
  if(!state.currentFlower){ showPopupMessage("plant seed first 🌱"); return; }
  if(state.flowerStage!=="matureflower"){ showPopupMessage("flower not mature 🌸"); return; }
  if(!state.harvestedFlowers.includes(state.currentFlower)) state.harvestedFlowers.push(state.currentFlower);
  state.lotusPoints+=5;
  showPopupMessage(`harvested ${state.currentFlower} 🌼 +5 lotus`);
  state.currentFlower=null;
  state.flowerStage="seedstage";
  updateGardenImage();
  updateVaseCollection();
  updateLotusPoints();
}

// --- BUY WATER ---
function buyWater(){
  const cost=5;
  const gain=8;
  if(state.lotusPoints<cost){ showPopupMessage("not enough points 💧"); return; }
  state.lotusPoints-=cost;
  state.waterInventory+=gain;
  updateLotusPoints();
  showPopupMessage(`bought ${gain} water 💧`);
}

// --- SEED INVENTORY CLICK ---
seedInventoryEl.addEventListener("click",e=>{
  const seedDiv=e.target.closest(".seed-item");
  if(seedDiv) plantSeed(seedDiv.dataset.seed);
});
seedInventoryEl.addEventListener("keydown",e=>{
  if((e.key==="Enter" || e.key===" ") && e.target.classList.contains("seed-item")){
    e.preventDefault();
    plantSeed(e.target.dataset.seed);
  }
});

// --- THEME DOTS ---
themeDots.forEach(dot=>{
  dot.addEventListener("click",()=>{
    const newTheme=dot.dataset.theme;
    if(state.theme===newTheme) return;
    state.theme=newTheme;
    gardenWidget.className=`theme-${newTheme}`;
    vaseWidget.className=`theme-${newTheme}`;
    themeDots.forEach(td=>{
      td.setAttribute("aria-checked", td.dataset.theme===newTheme?"true":"false");
      td.tabIndex=td.dataset.theme===newTheme?0:-1;
    });
    saveState();
  });
});

// --- SEED JOURNAL + BUY SEEDS COMBINED ---
let currentJournalIndex=0;

function renderSeedJournal(){
  const flower=seeds[currentJournalIndex];
  const cost=5 + seeds.indexOf(flower)*2;
  const isLocked=state.seedInventory[flower]===0 && !state.harvestedFlowers.includes(flower);

  seedJournalCard.innerHTML=`
    <img src="${isLocked?'assets/seedjournal/locked-seed.png':`assets/seedjournal/${flower}-seed.png`}" alt="${flower} seed journal" />
    <p style="font-size:10px">${flower}</p>
    <p style="font-size:10px">${isLocked?"locked":"unlocked"}</p>
    <p style="font-size:10px">cost: ${cost} lotus</p>
    <button id="buy-seed-btn">buy seed</button>
  `;

  const buyBtn=document.getElementById("buy-seed-btn");
  buyBtn.addEventListener("click",()=>buySeed(flower,cost));
}

function buySeed(seedName,cost){
  if(state.lotusPoints<cost){ showPopupMessage(`need ${cost} lotus`); return; }
  state.lotusPoints-=cost;
  state.seedInventory[seedName]++;
  updateLotusPoints();
  updateSeedInventory();
  showPopupMessage(`bought ${seedName} seed 🌱`);
  renderSeedJournal();
}

// --- NAVIGATION ---
prevSeedBtn.addEventListener("click",()=>{if(currentJournalIndex>0){currentJournalIndex--; renderSeedJournal();}});
nextSeedBtn.addEventListener("click",()=>{if(currentJournalIndex<seeds.length-1){currentJournalIndex++; renderSeedJournal();}});

// --- BUTTON EVENTS ---
gardenSection.addEventListener("click",showFlowerFact);
waterBtn.addEventListener("click",()=>waterFlower(1));
harvestBtn.addEventListener("click",harvestFlower);
buyWaterBtn.addEventListener("click",buyWater);
seedJournalBtn.addEventListener("click",()=>{
  seedJournalPopup.classList.toggle("hidden");
  renderSeedJournal();
});
closeJournalBtn.addEventListener("click",()=>seedJournalPopup.classList.add("hidden"));

// --- FLOWER FACT POPUP ---
const flowerFactPopup=document.createElement("div");
flowerFactPopup.id="flower-fact-popup";
flowerFactPopup.setAttribute("role","dialog");
flowerFactPopup.setAttribute("aria-modal","true");
flowerFactPopup.setAttribute("tabindex","-1");
document.body.appendChild(flowerFactPopup);

function showFlowerFact(){
  if(!state.currentFlower){ showPopupMessage("plant seed first!"); return; }
  const facts=flowerFacts[state.currentFlower];
  if(!facts) return;
  const {fact,quote}=facts[Math.floor(Math.random()*facts.length)];
  flowerFactPopup.innerHTML=`
    <p style="font-weight:bold;margin-bottom:0.3rem">${state.currentFlower}</p>
    <p style="font-size:10px">${fact}</p>
    <p style="font-style:italic;font-size:9px;margin-top:0.3rem">"${quote}"</p>
    <button id="close-flower-fact">close</button>
  `;
  flowerFactPopup.classList.add("visible");
  document.getElementById("close-flower-fact").addEventListener("click",()=>flowerFactPopup.classList.remove("visible"));
}

// --- INITIALIZE ---
loadState();
updateLotusPoints();
updateStreak();
updateGardenImage();
updateSeedInventory();
updateVaseCollection();
