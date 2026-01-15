const API_BASE = "http://localhost:8000";

const subtitleEl = document.getElementById("subtitle");
const statusEl = document.getElementById("status");
const panelBodyEl = document.getElementById("panelBody");
const lastUpdatedEl = document.getElementById("lastUpdated");

const duluthCenter = [46.777, -92.095]; // [lat, lon]
const map = L.map("map", { zoomControl: true }).setView(duluthCenter, 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

// Marker storage by MMSI
const markers = new Map();
let selectedMmsi = null;

function iconForType(vesselType) {
  // Simple, readable marker styling without heavy assets
  const label = vesselType?.slice(0, 1)?.toUpperCase() || "?";
  const html = `<div class="vessel-pin"><div class="vessel-pin__dot">${label}</div></div>`;
  return L.divIcon({
    className: "vessel-icon",
    html,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

// Add minimal CSS for the divIcon
const style = document.createElement("style");
style.textContent = `
  .vessel-icon { }
  .vessel-pin__dot {
    width: 26px; height: 26px;
    border-radius: 999px;
    display: grid; place-items: center;
    font-weight: 700;
    font-size: 12px;
    border: 1px solid rgba(255,255,255,0.25);
    background: rgba(122,162,247,0.25);
    color: rgba(230,238,248,0.95);
    backdrop-filter: blur(6px);
  }
  .vessel-pin__dot.selected {
    outline: 2px solid rgba(122,162,247,0.9);
  }
`;
document.head.appendChild(style);

function formatVessel(v) {
  const lines = [
    `<div style="font-weight:650; font-size:14px; color: rgba(230,238,248,0.95);">${escapeHtml(v.name || "Unknown")}</div>`,
    `<div style="margin-top:6px;">Type: ${escapeHtml(v.vessel_type || "other")}</div>`,
    `<div>MMSI: ${escapeHtml(v.mmsi || "")}</div>`,
    `<div>Speed: ${Number(v.sog_knots).toFixed(1)} kn</div>`,
    `<div>Course: ${Number(v.cog_deg).toFixed(0)}°</div>`,
    `<div>Updated: ${escapeHtml(v.last_updated_utc || "")}</div>`,
  ];
  return lines.join("");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setSelected(mmsi) {
  selectedMmsi = mmsi;

  // Update marker appearance
  for (const [id, marker] of markers.entries()) {
    const el = marker.getElement();
    if (!el) continue;
    const dot = el.querySelector(".vessel-pin__dot");
    if (!dot) continue;
    dot.classList.toggle("selected", id === selectedMmsi);
  }
}

function upsertMarker(v) {
  const id = v.mmsi;
  const latlng = [v.lat, v.lon];

  if (!markers.has(id)) {
    const marker = L.marker(latlng, { icon: iconForType(v.vessel_type) })
      .addTo(map)
      .on("click", () => {
        panelBodyEl.innerHTML = formatVessel(v);
        setSelected(id);
      });

    markers.set(id, marker);
  } else {
    markers.get(id).setLatLng(latlng);
  }
}

function pruneMissing(currentIds) {
  for (const [id, marker] of markers.entries()) {
    if (!currentIds.has(id)) {
      map.removeLayer(marker);
      markers.delete(id);
      if (selectedMmsi === id) {
        selectedMmsi = null;
        panelBodyEl.textContent = "Tap a vessel marker to see details.";
      }
    }
  }
}

async function fetchVessels() {
  const url = `${API_BASE}/vessels`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function tick() {
  try {
    statusEl.textContent = "Live (dev)";
    const data = await fetchVessels();

    subtitleEl.textContent = data.area_name || "—";
    lastUpdatedEl.textContent = `Generated: ${data.generated_at_utc || "—"}`;

    const currentIds = new Set();
    for (const v of data.vessels || []) {
      currentIds.add(v.mmsi);
      upsertMarker(v);
    }
    pruneMissing(currentIds);

    // Keep selected panel fresh if we have selection
    if (selectedMmsi && (data.vessels || []).some(x => x.mmsi === selectedMmsi)) {
      const selected = (data.vessels || []).find(x => x.mmsi === selectedMmsi);
      panelBodyEl.innerHTML = formatVessel(selected);
      setSelected(selectedMmsi);
    }
  } catch (e) {
    statusEl.textContent = "Offline (dev)";
  }
}

tick();
setInterval(tick, 3000);
