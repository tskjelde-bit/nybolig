import projects from './data.js';

const container = document.getElementById('sky-container');
const modalOverlay = document.getElementById('modal-overlay');
const closeModalBtn = document.getElementById('close-modal');

// Modal Elements
const mTitle = document.getElementById('modal-title');
const mArea = document.getElementById('modal-area');
const mDesc = document.getElementById('modal-desc');
const mUnits = document.getElementById('modal-units');
const mPrice = document.getElementById('modal-price');
const mImage = document.getElementById('modal-image');

// Mapbox Configuration
mapboxgl.accessToken = 'pk.eyJ1IjoiZHJza2plbGRlIiwiYSI6ImNtazh0MmJ2aDFoMjUzZXNjMWg5Z2N6aGEifQ.MwnR35CAROeK21aodZ78hw';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/drskjelde/cmkm3e0hv00it01sd4ddd4syy?optimize=true', // forcing fresh fetch
    center: [10.7800, 59.9300], // Shifted slightly NE to center on projects
    zoom: 11.0 // Zoomed out slightly to fit Stovner and Holtet
});

// Add Navigation Control (Zoom +/- and Rotate)
map.addControl(new mapboxgl.NavigationControl({
    showCompass: true,
    showZoom: true,
    visualizePitch: true // Adds the pitch toggle visual if available in this version
}), 'top-right');

// Helper for Custom Spinners
window.adjustInput = function (id, delta) {
    const el = document.getElementById(id);
    if (!el) return;

    let currentVal = parseFloat(el.value);

    // If empty, resolve default from ID logic
    if (isNaN(currentVal)) {
        const defaults = {
            'growth-2026': 8,
            'growth-2027': 12,
            'growth-2028': 12,
            'growth-2029': 5
        };
        currentVal = defaults[id] || 0;
    }

    const newVal = currentVal + delta;
    // Round to 1 decimal place
    el.value = Math.round(newVal * 10) / 10;

    // Trigger update
    el.dispatchEvent(new Event('input'));
}

// ... (lines 16-124 skipped)

// Configuration for bubbles
const MIN_SIZE = 110;
const MAX_SIZE = 160;

// Coordinate matching (Approximate locations for Oslo projects)
const projectLocations = {
    "Åsjordet": [10.6450, 59.9280],
    "Fagerblom": [10.7800, 59.9300],
    "Fryd": [10.7850, 59.9250],
    "Frysjatunet": [10.7780, 59.9650],
    "Furuset": [10.8900, 59.9450],
    "Granstangen": [10.9000, 59.9500],
    "Grønvollkvartalet": [10.7950, 59.9130],
    "Haslevangen": [10.7900, 59.9250],
    "Holtet": [10.7800, 59.8780],
    "Kampenhagen": [10.7820, 59.9120],
    "Konows": [10.7700, 59.9030],
    "Landingsveien": [10.6650, 59.9580],
    "Lenschows": [10.7950, 59.9250],
    "Libakkløkka": [10.7900, 59.8800],
    "Linderudløkka": [10.8350, 59.9400],
    "Mariakvartalet": [10.7600, 59.9050],
    "Oen": [10.7950, 59.9200],
    "Over Torshov": [10.7700, 59.9350],
    "Staffeldts": [10.7380, 59.9180],
    "Stovner": [10.9250, 59.9600],
    "Ullernhøyden": [10.6500, 59.9250],
    "Ulvenplassen": [10.8050, 59.9250],
    "Vesteråsveien": [10.6400, 59.9350],
    "Villa Silur": [10.6550, 59.9300]
};

// Finn.no Links
const finnLinks = {
    "Åsjordet": "https://www.finn.no/realestate/project/ad.html?finnkode=434021788",
    "Fagerblom": "https://www.finn.no/realestate/project/ad.html?finnkode=420230241",
    "Fryd": "https://www.finn.no/realestate/project/ad.html?finnkode=413702401",
    "Frysjatunet": "https://www.finn.no/realestate/project/ad.html?finnkode=305564584",
    "Furuset": "https://www.finn.no/realestate/project/ad.html?finnkode=421200375",
    "Granstangen": "https://www.finn.no/realestate/project/ad.html?finnkode=438582879",
    "Grønvollkvartalet": "https://www.finn.no/realestate/project/ad.html?finnkode=437124418",
    "Haslevangen": "https://www.finn.no/realestate/project/ad.html?finnkode=406343945",
    "Holtet": "https://www.finn.no/realestate/project/ad.html?finnkode=407192035",
    "Kampenhagen": "https://www.finn.no/realestate/projectunit/ad.html?finnkode=442556154",
    "Konows": "https://www.finn.no/realestate/project/ad.html?finnkode=405781299",
    "Landingsveien": "https://www.finn.no/realestate/projectsingle/ad.html?finnkode=390844378",
    "Lenschows": "https://www.finn.no/realestate/project/ad.html?finnkode=414716227",
    "Libakkløkka": "https://www.finn.no/realestate/project/ad.html?finnkode=442589075",
    "Linderudløkka": "https://www.finn.no/realestate/project/ad.html?finnkode=425271805",
    "Mariakvartalet": "https://www.finn.no/realestate/project/ad.html?finnkode=431263163",
    "Oen": "https://www.finn.no/realestate/project/ad.html?finnkode=427490823",
    "Over Torshov": "https://www.finn.no/realestate/projectsingle/ad.html?finnkode=441600333",
    // Staffeldts gate 2: No link
    "Stovner": "https://www.finn.no/realestate/project/ad.html?finnkode=436825628",
    "Ullernhøyden": "https://www.finn.no/realestate/project/ad.html?finnkode=409940269",
    "Ulvenplassen": "https://www.finn.no/realestate/project/ad.html?finnkode=389063569",
    "Vesteråsveien": "https://www.finn.no/realestate/project/ad.html?finnkode=412361233",
    "Villa Silur": "https://naabo.no/prosjekter/boliger-til-salgs/villa-silur/til-salgs"
};

// Zones for random placement (Residential areas in Oslo)
const randomZones = [
    [10.65, 59.93], // Ullern/Røa (West)
    [10.72, 59.94], // Nordberg/Tåsen (North-West)
    [10.79, 59.93], // Grefsen/Sinsen (North-Central)
    [10.93, 59.95], // Stovner/Grorud (North-East)
    [10.82, 59.91], // Helsfyr/Løren (East)
    [10.85, 59.87], // Nordstrand (South-East)
    [10.76, 59.92], // Grünerløkka/Sagene (Central)
];

const coordinateCache = {};

function getCoordinates(name) {
    // Return cached coordinates if available
    if (coordinateCache[name]) {
        return coordinateCache[name];
    }

    let baseCoords = null;

    // 1. Try to find a specific match
    for (const [key, coords] of Object.entries(projectLocations)) {
        if (name.includes(key)) {
            baseCoords = [...coords];
            break;
        }
    }

    // 2. If not found, pick a random residential zone
    if (!baseCoords) {
        const randomZone = randomZones[Math.floor(Math.random() * randomZones.length)];
        baseCoords = [...randomZone];
    }

    // 3. Apply LARGE distributed scatter (Neighborhood level)
    // 0.04 deg lng ~= 2.2km | 0.02 deg lat ~= 2.2km
    // This spreads them out significantly around their "center"
    const spreadLng = (Math.random() - 0.5) * 0.06;
    const spreadLat = (Math.random() - 0.5) * 0.03;

    const finalCoords = [baseCoords[0] + spreadLng, baseCoords[1] + spreadLat];

    // Cache the result
    coordinateCache[name] = finalCoords;

    return finalCoords;
}

function getFinnLink(name) {
    for (const [key, url] of Object.entries(finnLinks)) {
        if (name.includes(key)) return url;
    }
    return null;
}

// Price Growth Index (Base 2025 = 100)
// Dynamic calculation based on user input
let growthData = {};

function calculateQuarterlyIndices(startYear, startValue, annualRate) {
    // 1. L = ln(1 + G)
    const G = annualRate / 100;
    const L = Math.log(1 + G);

    // 2. Weights: Q1: 45%, Q2: 27.5%, Q3: 19.5%, Q4: 8% (Updated matches popup)
    const weights = [0.45, 0.275, 0.195, 0.08];

    // 3. Calculate quarterly end values
    let currentVal = startValue;
    const quarters = [];

    for (let i = 0; i < 4; i++) {
        // Li = wi * L
        const Li = weights[i] * L;

        // qi = exp(Li) - 1
        const qi = Math.exp(Li) - 1;

        // Update index: Next = Current * (1 + qi)
        currentVal = currentVal * (1 + qi);

        quarters.push(currentVal);
    }

    return quarters;
}

function updateGrowthModel() {
    // Get inputs (or use placeholders as defaults)
    const defs = { 2026: 5.0, 2027: 9.5, 2028: 8.5, 2029: 6.0 };
    const rates = {};

    [2026, 2027, 2028, 2029].forEach(y => {
        const el = document.getElementById(`growth-${y}`);
        let val = parseFloat(el.value);
        if (isNaN(val)) val = defs[y]; // Fallback to default
        rates[y] = val;
    });

    // Calculate Indices
    // Base End 2025 = 100
    let lastIndex = 100.00;

    // 2026
    const q26 = calculateQuarterlyIndices(2026, lastIndex, rates[2026]);
    growthData["2026-1"] = q26[0]; growthData["2026-2"] = q26[1]; growthData["2026-3"] = q26[2]; growthData["2026-4"] = q26[3];
    lastIndex = q26[3];

    // 2027
    const q27 = calculateQuarterlyIndices(2027, lastIndex, rates[2027]);
    growthData["2027-1"] = q27[0]; growthData["2027-2"] = q27[1]; growthData["2027-3"] = q27[2]; growthData["2027-4"] = q27[3];
    lastIndex = q27[3];

    // 2028
    const q28 = calculateQuarterlyIndices(2028, lastIndex, rates[2028]);
    growthData["2028-1"] = q28[0]; growthData["2028-2"] = q28[1]; growthData["2028-3"] = q28[2]; growthData["2028-4"] = q28[3];
    lastIndex = q28[3];

    // 2029
    const q29 = calculateQuarterlyIndices(2029, lastIndex, rates[2029]);
    growthData["2029-1"] = q29[0]; growthData["2029-2"] = q29[1]; growthData["2029-3"] = q29[2]; growthData["2029-4"] = q29[3];

    // Refresh UI
    console.log("Updated Growth Model:", growthData);
    init(); // Re-render markers with new ROI

    // If side panel is open for a project, refresh it? 
    // Simplified: init() redraws markers. If user clicks again, they see new data. 
    // Ideally we should refresh the open panel too but user didn't explicitly ask for complex state sync.
    // However, init() clears markers which might "disconnect" the open panel visually if we relied on marker refs.
    // But openModal is separate.
}

// Bind Inputs
document.addEventListener('DOMContentLoaded', () => {
    [2026, 2027, 2028, 2029].forEach(y => {
        const el = document.getElementById(`growth-${y}`);
        if (el) el.addEventListener('input', updateGrowthModel);
    });
    // Initial Calc
    updateGrowthModel();
});

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    if (typeof priceStr === 'number') return priceStr;
    // Remove " kr" and spaces/non-breaking spaces
    const clean = String(priceStr).replace(/\s|kr| /g, '').replace(/,/g, '.');
    return parseInt(clean) || 0;
}

// Filter State
let currentFilter = 'active'; // 'active' or 'sold'
let currentYearFilter = 'all'; // 'all', 2026, 2027, 2028, 2029

window.setFilter = function (filterType) {
    currentFilter = filterType;
    updateFilterUI();
    init();
}

window.setYearFilter = function (year) {
    currentYearFilter = year;
    updateFilterUI();
    init();
}

function updateFilterUI() {
    // Status Buttons
    const btnActive = document.getElementById('filter-active');
    const btnSold = document.getElementById('filter-sold');
    if (btnActive) btnActive.classList.toggle('active', currentFilter === 'active');
    if (btnSold) btnSold.classList.toggle('active', currentFilter === 'sold');

    // Year Buttons
    const btnAll = document.getElementById('filter-year-all');
    if (btnAll) btnAll.classList.toggle('active', currentYearFilter === 'all');

    [2026, 2027, 2028, 2029].forEach(y => {
        const el = document.getElementById(`filter-${y}`);
        if (el) el.classList.toggle('active', currentYearFilter === y);
    });
}

// ... existing code ...

function getCompletionDate(inputStr) {
    // Handle either "completion_text" or raw description
    const text = inputStr ? String(inputStr).toLowerCase() : "";

    let year = 2027; // Default
    let quarter = 2; // Default (Q2)

    // Extract Year
    const yearMatch = text.match(/20\d{2}/);
    if (yearMatch) {
        year = parseInt(yearMatch[0]);
    }

    // Heuristics for Quarter
    if (text.includes("1. kvartal") || text.includes("q1") || text.includes("vinter")) quarter = 1;
    else if (text.includes("2. kvartal") || text.includes("q2") || text.includes("vår") || text.includes("1. halvår")) quarter = 2;
    else if (text.includes("3. kvartal") || text.includes("q3") || text.includes("sommer")) quarter = 3;
    else if (text.includes("4. kvartal") || text.includes("q4") || text.includes("høst") || text.includes("2. halvår")) quarter = 4;

    // Specific month fallback (regex from before)
    const dateMatch = text.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (dateMatch) {
        year = parseInt(dateMatch[3]) + 2; // +2 years estimation
        quarter = Math.floor((parseInt(dateMatch[2]) + 3) / 3);
    }

    return { year, quarter, key: `${year}-${quarter}` };
}

function calculateROI(price, completionKey) {
    // Use dynamic Baseline from growth model (Q1 2026)
    // If growthData isn't ready yet, fallback.
    const currentIdx = growthData["2026-1"] || 102.74;
    const futureIdx = growthData[completionKey] || 135.00; // Fallback to ~2028 if unknown

    // Gain = Price * (FutureIndex - CurrentIndex) / CurrentIndex
    const growthFactor = (futureIdx - currentIdx) / currentIdx;
    const gain = price * growthFactor;

    return Math.round(gain);
}

function formatCurrency(num) {
    return new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(num);
}

// ... existing code ...

function createCloud(project) {
    // Use completion_text if available, else description fallback
    const completionSource = project.completion_text || project.description;
    const completion = getCompletionDate(completionSource);

    // FILTER LOGIC
    // 1. Status Filter (Active/Sold)
    const isActive = project.active === true; // Strict check
    if (currentFilter === 'active' && !isActive) return null;
    if (currentFilter === 'sold' && isActive) return null;

    // 2. Year Filter
    if (currentYearFilter !== 'all') {
        const projYear = completion.year;
        if (currentYearFilter === 2029) {
            // "2029..." means 2029 and later
            if (projYear < 2029) return null;
        } else {
            // Exact match for 2026, 2027, 2028
            if (projYear !== currentYearFilter) return null;
        }
    }

    const el = document.createElement('div');
    el.classList.add('cloud-bubble');

    // Verify units to avoid division by zero
    const total = project.units || 1;
    const sold = project.sold || 0;
    const unsold = total - sold;

    const avgPrice = parsePrice(project.price_from);

    // (completion calculated above)

    const estimatedGain = calculateROI(avgPrice, completion.key);
    const gainFormatted = formatCurrency(estimatedGain);

    // Calculate Percent for Styling
    let roiPercent = 0;
    if (avgPrice > 0) {
        roiPercent = (estimatedGain / avgPrice) * 100;
    }
    const isHighReturn = roiPercent >= 15;

    // HTML Structure - SPLIT DESIGN WITH IMAGE
    // Left: Image
    // Right: Header + Footer
    const safeName = project.name.replace(/\s+/g, '_');
    const imgSrc = `prosjektbilder/${safeName}.jpg`;
    const fallbackImg = `housing_${Math.floor(Math.random() * 5) + 1}.jpg`;

    el.innerHTML = `
        <div class="bubble-row">
            <div class="bubble-image">
                <img src="${imgSrc}" onerror="this.onerror=null;this.src='${fallbackImg}';" />
            </div>
            <div class="bubble-content">
                <div class="bubble-header">
                    <h3 style="margin: 0; font-size: 0.85rem; font-weight: 700; color: white;">${project.name}</h3>
                </div>
                <div class="bubble-footer ${isHighReturn ? 'high-return' : ''}">
                    <p class="roi-label">
                        🖩 +${gainFormatted}
                    </p>
                </div>
            </div>
        </div>
    `;

    // Mapbox Marker logic
    const coords = getCoordinates(project.name);

    // Create a CONTAINER for the marker
    const markerContainer = document.createElement('div');
    markerContainer.className = 'marker-container';

    // Remove direct centering styles - rely on CSS Flexbox/Block in .marker-container
    el.style.position = '';
    el.style.left = '';
    el.style.top = '';
    el.style.marginLeft = '';
    el.style.marginTop = '';

    markerContainer.appendChild(el);

    // Create Custom Marker using the container
    const marker = new mapboxgl.Marker({
        element: markerContainer,
        anchor: 'center'
    })
        .setLngLat(coords)
        .addTo(map);

    // Store marker in DOM element for easy removal
    markerContainer._mapboxMarker = marker;

    // Animation properties - applied to the INNER bubble 'el'
    const duration = 4 + Math.random() * 6;
    const delay = Math.random() * -5;

    el.style.animation = `float ${duration}s ease-in-out infinite`;
    el.style.animationDelay = `${delay}s`;

    // Click Interaction
    markerContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(project);
    });

    // Store reference in global list
    if (!window.bubbleElements) window.bubbleElements = [];
    window.bubbleElements.push(markerContainer);

    // Track markers to clear them later
    if (!window.currentMarkers) window.currentMarkers = [];
    window.currentMarkers.push(marker);

    return markerContainer;
}



// Z-Index Cycling Logic
setInterval(() => {
    if (!window.bubbleElements) return;
    window.bubbleElements.forEach(container => {
        container.style.zIndex = 100 + Math.floor(Math.random() * 100);
    });
}, 2000);

// Helper to generate stats HTML for a single project (or sub-project)
function generateStatsHTML(p, index = null) {
    const units = p.units || 0;
    const sold = p.sold || 0;
    const forSale = units - sold;
    const avgPrice = parsePrice(p.price_from);

    const completionSource = p.completion_text || p.description;
    const completion = getCompletionDate(completionSource);
    const estimatedGain = calculateROI(avgPrice, completion.key);

    let roiPercent = 0;
    if (avgPrice > 0) roiPercent = (estimatedGain / avgPrice) * 100;
    const roiPercentFormatted = roiPercent.toFixed(1).replace('.', ',');

    const title = index !== null ? `<div class="sub-project-title">Byggetrinn ${index + 1}</div>` : '';

    // Blue Button style
    const linkHTML = p.link ?
        `<div style="grid-column: 1/-1; margin-top: 8px; text-align: center;">
            <a href="${p.link}" target="_blank" style="background: #3b82f6; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600; font-size: 0.85rem; transition: background 0.2s;">Se annonse på FINN</a>
         </div>`
        : '';

    return `
        <div class="stat-group" style="${index > 0 ? 'margin-top: 24px; paddingTop: 16px;' : ''}">
            ${title}
            <div class="stat-item" style="text-align: center;">
                <span class="label">Antall solgte</span>
                <span class="value">${sold} / ${units}</span>
            </div>
            <div class="stat-item" style="text-align: center;">
                <span class="label">Antall til salgs</span>
                <span class="value">${forSale}</span>
            </div>
            <div class="stat-item" style="text-align: center;">
                <span class="label">Snittpris</span>
                <span class="value">${formatCurrency(avgPrice)}</span>
            </div>
            <div class="stat-item" style="text-align: center;">
                <span class="label">Ferdigstillelse</span>
                <span class="value">Q${completion.quarter} ${completion.year}</span>
            </div>
            <div class="stat-item" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; margin-top: 8px; grid-column: 1 / -1; display:flex; flex-direction: column; align-items: center; text-align: center;">
                 <div style="display: flex; align-items: center; justify-content: center; gap: 8px; position: relative;">
                     <span class="label" style="color: white; font-weight: 700; font-size: 1.1rem;">FORVENTET <span style="font-weight: 400; text-transform: none;">(netto)</span> AVKASTNING</span>
                     <div class="info-icon" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                     </div>
                     <div class="hidden" style="position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); width: 280px; background: #ffffff; color: #162233; padding: 16px; border-radius: 12px; font-size: 0.9rem; text-transform: none; text-align: left; margin-bottom: 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.4); z-index: 1000; pointer-events: auto; cursor: default;">
                         <div onclick="this.parentElement.classList.add('hidden')" style="position: absolute; top: 12px; right: 12px; cursor: pointer; opacity: 0.5; padding: 4px;">
                             <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                 <line x1="1" y1="1" x2="13" y2="13"></line>
                                 <line x1="1" y1="13" x2="13" y2="1"></line>
                             </svg>
                         </div>
                         <h4 style="margin: 0 0 8px 0; font-size: 1.05rem; color: #162233; font-weight: 700; padding-right: 16px;">Slik vektes årsveksten på sesonger</h4>
                         <p style="margin: 0 0 12px 0; color: #162233; line-height: 1.4;">
                            <span style="color: #3b82f6; font-weight: 700;">Sesongmønsteret er front‑lastet:</span> Den årlige prisutviklingen fordeles ulikt på kvartalene for å speile historiske mønstre i Oslo‑markedet.
                         </p>
                         <p style="margin: 0 0 4px 0; font-weight: 600; color: #162233;">Vektene som brukes er faste:</p>
                         <ul style="margin: 0 0 12px 0; padding-left: 16px; color: #162233; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                             <li>Q1: 45%</li>
                             <li>Q2: 27,5%</li>
                             <li>Q3: 19,5%</li>
                             <li>Q4: 8%</li>
                         </ul>
                         <p style="margin: 0; color: #475569; font-size: 0.85rem; line-height: 1.3;">
                            <strong>Komponert beregning:</strong> Hver kvartalsvekst beregnes slik at sammensatt effekt av alle fire kvartaler alltid gir nøyaktig den årlige prosenten du har angitt.
                         </p>
                     </div>
                 </div>
                 <span style="color: #94a3b8; font-size: 0.95rem; font-weight: 400; text-transform: none; margin-top: 4px;">(basert på <span style="color: #3b82f6; font-weight: 700;">${(growthData[completion.key] - 100).toFixed(1).replace('.', ',')}%</span> prisvekst)</span>
                 <span class="value" style="color: #4ecb8d; font-size: 1.6rem; margin-top: 8px; font-weight: 700;">+${formatCurrency(estimatedGain)} / ${roiPercentFormatted}% *</span>
                 <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 4px; font-weight: 400;">* Beregnet på snittpris i prosjektet</div>
                 
                <div style="margin-top: 12px; position: static;">
                    <a href="#" onclick="event.preventDefault(); window.openCalculationMethodModal();" style="color: rgba(255,255,255,0.6); font-size: 0.8rem; text-decoration: underline; cursor: pointer; display: block;">Hvordan er estimert prisvekst beregnet?</a>
                </div>
            </div>
            </div>
            ${linkHTML}
        </div>
    `;
}

// Make function globally available
window.openCalculationMethodModal = function () {
    // Check if already open
    if (document.getElementById('viz-calc-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'viz-calc-modal';
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 99999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); cursor: default; opacity: 0; transition: opacity 0.3s ease;";

    modal.innerHTML = `
        <div style="width: 600px; max-width: 90%; background: #ffffff; color: #162233; padding: 32px; border-radius: 16px; font-size: 0.95rem; text-align: left; box-shadow: 0 20px 60px rgba(0,0,0,0.6); position: relative; max-height: 90vh; overflow-y: auto; transform: scale(0.95); transition: transform 0.3s ease;">
            <!-- Close Button -->
            <div id="close-calc-modal" style="position: absolute; top: 16px; right: 16px; cursor: pointer; opacity: 0.6; padding: 8px; transition: opacity 0.2s;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
            </div>
            
            <!-- Content -->
            <h4 style="margin: 0 0 20px 0; font-size: 1.4rem; color: #162233; font-weight: 700; padding-right: 32px;">ℹ️ Slik har jeg beregnet prognosene for Oslo</h4>
            <p style="margin-bottom: 20px; font-size: 1.05rem; line-height: 1.6;">For å gi deg et mest mulig realistisk bilde av boligprisutviklingen i Oslo de neste årene, har jeg sammenstilt data fra flere ulike analysemiljøer. Siden ingen enkeltaktør har en fasit som strekker seg så langt frem i tid, har jeg laget et "konsensus-estimat" basert på følgende metode:</p>
            <ul style="margin: 0 0 24px 0; padding-left: 24px; list-style-type: disc;">
                <li style="margin-bottom: 16px; line-height: 1.6;"><strong>2026 (+5,0 %):</strong> Dette tallet er hentet direkte fra <strong>Eiendom Norge</strong> sin spesifikke prognose for Oslo. Tallet støttes av <strong>SSB</strong> og <strong>Prognosesenteret</strong>, som alle er enige om at det store tilbudet av bruktboliger (særlig tidligere utleieboliger) vil dempe prisveksten noe i år, til tross for reallønnsvekst.</li>
                <li style="margin-bottom: 16px; line-height: 1.6;"><strong>2027 (+9,5 %) og 2028 (+8,5 %):</strong> Disse tallene er utledet fra <strong>Samfunnsøkonomisk Analyse (SØA)</strong> sin langtidsrapport. De spår en samlet prisvekst i Oslo på ca. 30 % i perioden 2025–2028. Når vi trekker fra veksten for 2025 og 2026, gjenstår en betydelig vekst som jeg har fordelt på 2027 og 2028. Det er i disse årene "nyboligtørken" i Oslo ventes å treffe markedet med full kraft, noe som presser prisene opp.</li>
                <li style="margin-bottom: 0; line-height: 1.6;"><strong>2029 (+6,0 %):</strong> For dette året finnes det foreløpig ingen offisielle rapporter. Jeg har derfor lagt til grunn en <strong>kvalifisert gjetning</strong>. Antakelsen er at prispresset dempes noe sammenlignet med toppen i 2027/28, men at det store etterslepet på boligbygging vil holde veksten høyere enn normal prisstigning også i 2029.</li>
            </ul>
            <p style="margin: 0; color: #475569; font-size: 0.9rem; padding-top: 16px; border-top: 1px solid #e2e8f0;"><strong>Kilder benyttet:</strong> Statistisk sentralbyrå (SSB), Eiendom Norge, Samfunnsøkonomisk Analyse (SØA) og Prognosesenteret.</p>
        </div>
    `;

    document.body.appendChild(modal);

    // Animation in
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modal.querySelector('div').style.transform = 'scale(1)';
    });

    // Close Handler
    const close = () => {
        modal.style.opacity = '0';
        modal.querySelector('div').style.transform = 'scale(0.95)';
        setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('#close-calc-modal').onclick = close;
    modal.onclick = (e) => {
        if (e.target === modal) close();
    };
};

function openModal(project) {
    // Determine image path based on project name
    const safeName = project.name.replace(/\s+/g, '_');
    const imgSrc = `prosjektbilder/${safeName}.jpg`;
    const fallbackImg = `housing_${Math.floor(Math.random() * 5) + 1}.jpg`;

    // Prepare Stats Logic
    let statsHTML = '';

    if (project.subProjects && project.subProjects.length > 1) {
        // Render Multiple Sections
        project.subProjects.forEach((sub, idx) => {
            statsHTML += generateStatsHTML(sub, idx);
        });
    } else {
        // Render Single (use main project object)
        statsHTML = generateStatsHTML(project);
    }

    // Common Description (use first valid description)
    const description = (project.description || "").replace(/<[^>]*>?/gm, '\n');


    // Check view mode (Desktop vs Mobile)
    if (window.innerWidth > 1024) {
        // RENDER TO SIDE PANEL
        const panel = document.getElementById('detail-panel');

        // Generate HTML
        panel.innerHTML = `
            <div class="side-panel-content">
                <!-- <span class="area-tag">${project.area || "Oslo"}</span> -->
                <h2>${project.name}</h2>
                <div class="side-image-wrapper">
                    <img src="${imgSrc}" alt="${project.name}" onerror="this.onerror=null;this.src='${fallbackImg}';" />
                </div>

                <div class="modal-stats">
                    ${statsHTML}
                </div>

                <div id="modal-actions"></div>
            </div>
        `;
        // Removed separate "Mer info" button logic

    } else {
        // RENDER TO MODAL (Mobile/Tablet)
        const mTitle = document.getElementById('modal-title');
        const mArea = document.getElementById('modal-area');
        const mImage = document.getElementById('modal-image');
        const modalOverlay = document.getElementById('modal-overlay');

        mTitle.textContent = project.name;
        // mArea.textContent = project.area || "Oslo"; // Hidden per request

        mImage.src = imgSrc;
        mImage.onerror = function () { this.src = fallbackImg; };

        // Stats
        const statsContainer = document.querySelector('.modal-stats');
        if (statsContainer) {
            statsContainer.innerHTML = statsHTML;
        }

        // Actions (cleared)
        const actionsContainer = document.getElementById('modal-actions');
        actionsContainer.innerHTML = '';

        modalOverlay.classList.remove('hidden');
    }
}


function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

// Event Listeners for Modal
document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Helper to Merge Duplicates
function mergeProjects(rawProjects) {
    const mergedMap = new Map();

    rawProjects.forEach(p => {
        const name = p.name.trim();

        if (mergedMap.has(name)) {
            const existing = mergedMap.get(name);

            // Merge Logic
            existing.units += (p.units || 0);
            existing.sold += (p.sold || 0);

            if (p.price_from > 0 && (existing.price_from === 0 || p.price_from < existing.price_from)) {
                existing.price_from = p.price_from;
            }

            if (p.active) existing.active = true;

            // Add to subProjects
            existing.subProjects.push(p);

        } else {
            // Clone and init subProjects
            const clone = { ...p };
            clone.subProjects = [{ ...p }]; // Include self as first subproject
            mergedMap.set(name, clone);
        }
    });

    return Array.from(mergedMap.values());
}

// Initialize
function init() {
    // Clear existing markers
    if (window.currentMarkers) {
        window.currentMarkers.forEach(marker => marker.remove());
    }
    window.currentMarkers = [];
    window.bubbleElements = [];

    // Merge Data before rendering
    const mergedProjects = mergeProjects(projects);

    mergedProjects.forEach(project => {

        createCloud(project);
    });
}

// ... existing resizing code ...
init();

