# HarborFrame

> A wall-mounted ambient display for visualizing live AIS vessel traffic in the Duluth, MN harbor region.

[![Status](https://img.shields.io/badge/status-work--in--progress-yellow)](https://github.com)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)

## Overview

HarborFrame is a wall-mounted ambient display that visualizes boat traffic via live-ish AIS vessel data within the harbor/coastal region of Duluth MN. A personal project I started as a gift for a family member, it is designed to function as a standalone, always-on display suitable for a home or office setting.

This repository currently contains a local development setup using sample vessel data. Live AIS data integration is planned.



**Current Status:** Local development with sample data | Live AIS integration coming soon

---

## 🏗️ Repository Structure

```
harborframe/
├── collector/          # FastAPI backend service
│   ├── main.py         # API endpoints and vessel data service
│   └── requirements.txt
├── display/            # Frontend web interface
│   ├── index.html      # Main application page
│   ├── app.js          # Map rendering and data polling logic
│   └── style.css       # Visual styling
├── docs/               # Project documentation (planned)
└── scripts/            # Deployment and utility scripts (planned)
```

### Components

**`collector/`**  
FastAPI backend exposing a RESTful `/vessels` endpoint. Currently serves sample vessel data for development and testing.

**`display/`**  
Interactive Leaflet-based map interface that polls the backend and renders vessel positions with metadata overlays.

---

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Optional: HTTP server for serving static files

### 1. Start the Backend

Navigate to the collector directory and set up the Python environment:

**macOS / Linux:**
```bash
cd collector
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Windows (PowerShell):**
```powershell
cd collector
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Verify the backend is running:**
- 🏥 Health check: http://localhost:8000/health
- 📚 API documentation: http://localhost:8000/docs
- 🚢 Sample vessel data: http://localhost:8000/vessels

### 2. Launch the Display

**Option A: Direct File Access** *(simplest)*
```bash
# Simply open in your browser
open display/index.html  # macOS
# or drag the file into your browser
```

**Option B: Local HTTP Server** *(recommended)*
```bash
cd display
python -m http.server 5173
# Navigate to: http://localhost:5173
```

---

## ✨ Features

### Current
- 🗺️ Interactive Leaflet map centered on Duluth harbor
- 🚢 Vessel markers with position and metadata
- 📍 Click markers to view detailed vessel information
- 🔄 Real-time polling for position updates
- 📱 Responsive design for various screen sizes

### Planned
- 🌊 Live AIS data ingestion via WebSocket or REST API
- 🎬 Smooth vessel movement animations
- 🎨 Custom ambient display themes optimized for wall mounting
- 🖥️ Touchscreen kiosk mode for Raspberry Pi deployment
- ⚠️ Offline mode and stale data indicators
- 🔔 Notifications for vessels of interest
- 📊 Historical track replay

---

## 🛠️ Tech Stack

- **Backend:** FastAPI, Python 3.8+, Uvicorn
- **Frontend:** Vanilla JavaScript, Leaflet.js, HTML5/CSS3
- **Deployment Target:** Raspberry Pi with touchscreen (planned)

---

## 📝 Development Notes

This is an active work-in-progress being developed for a family member. The current implementation uses mock data for development purposes. Integration with live AIS data sources is the next major milestone.

Contributions, suggestions, and feedback are welcome as the project evolves!

---

## 📄 License

To be determined
