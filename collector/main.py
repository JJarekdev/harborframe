from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Literal, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# ---- Models ----

VesselType = Literal["cargo", "tanker", "tug", "passenger", "pleasure", "other"]


class Vessel(BaseModel):
    mmsi: str = Field(..., description="Maritime Mobile Service Identity")
    name: str
    vessel_type: VesselType
    lat: float
    lon: float
    sog_knots: float = Field(..., description="Speed over ground, knots")
    cog_deg: float = Field(..., description="Course over ground, degrees")
    heading_deg: Optional[float] = Field(None, description="Heading degrees, if known")
    last_updated_utc: str = Field(..., description="ISO 8601 UTC timestamp")


class VesselsResponse(BaseModel):
    area_name: str
    bbox: List[float]  # [minLon, minLat, maxLon, maxLat]
    generated_at_utc: str
    vessels: List[Vessel]


# ---- App ----

app = FastAPI(title="HarborFrame Collector", version="0.1.0")

# Allow the static display to fetch from this backend during dev.
# For kiosk/local deployment later, you can tighten this.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Duluth / Canal Park / Aerial Lift Bridge-ish bbox (starter)
# Format: [minLon, minLat, maxLon, maxLat]
DULUTH_BBOX = [-92.115, 46.760, -92.085, 46.790]


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/vessels", response_model=VesselsResponse)
def vessels() -> VesselsResponse:
    now = datetime.now(timezone.utc).isoformat()

    # Fake sample vessels roughly near the canal/harbor
    sample = [
        Vessel(
            mmsi="366123450",
            name="LAKE SUPERIOR TRADER",
            vessel_type="cargo",
            lat=46.7765,
            lon=-92.0955,
            sog_knots=9.4,
            cog_deg=55.0,
            heading_deg=52.0,
            last_updated_utc=now,
        ),
        Vessel(
            mmsi="367890120",
            name="HARBOR TUG AURORA",
            vessel_type="tug",
            lat=46.7728,
            lon=-92.0920,
            sog_knots=6.1,
            cog_deg=210.0,
            heading_deg=208.0,
            last_updated_utc=now,
        ),
        Vessel(
            mmsi="368555777",
            name="NORTH SHORE FERRY",
            vessel_type="passenger",
            lat=46.7782,
            lon=-92.1005,
            sog_knots=12.7,
            cog_deg=95.0,
            heading_deg=96.0,
            last_updated_utc=now,
        ),
        Vessel(
            mmsi="369111222",
            name="SAILBOAT MINNOW",
            vessel_type="pleasure",
            lat=46.7840,
            lon=-92.1030,
            sog_knots=4.2,
            cog_deg=140.0,
            heading_deg=None,
            last_updated_utc=now,
        ),
    ]

    return VesselsResponse(
        area_name="Duluth Harbor (Dev Sample)",
        bbox=DULUTH_BBOX,
        generated_at_utc=now,
        vessels=sample,
    )
