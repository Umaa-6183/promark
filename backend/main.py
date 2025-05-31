# main.py
from fastapi import Body
import os
import pickle
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List

# Step 1: Initialize FastAPI app
app = FastAPI(title="ProMark API", version="1.0.0")

# Step 2: Load trained ML models from ../ml_models
MODEL_DIR = os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..', 'ml_models'))

model_reach_path = os.path.join(MODEL_DIR, "model_reach.pkl")
model_clicks_path = os.path.join(MODEL_DIR, "model_clicks.pkl")

with open(model_reach_path, "rb") as f:
    model_reach = pickle.load(f)

with open(model_clicks_path, "rb") as f:
    model_clicks = pickle.load(f)

# In-memory campaign list (temporary simulation)
campaigns = [
    {"id": 1, "name": "Store Launch Promo", "status": "active"},
    {"id": 2, "name": "Discount Week", "status": "scheduled"}
]

# Define request schema using Pydantic


class Campaign(BaseModel):
    id: int
    name: str
    status: str

# Root route


@app.get("/")
def read_root():
    return {"message": "Welcome to the ProMark API"}

# Get all campaigns


@app.get("/campaigns", response_model=List[Campaign])
def get_campaigns():
    return campaigns

# Get a single campaign


@app.get("/campaigns/{campaign_id}", response_model=Campaign)
def get_campaign(campaign_id: int):
    for campaign in campaigns:
        if campaign["id"] == campaign_id:
            return campaign
    raise HTTPException(status_code=404, detail="Campaign not found")

# Create a new campaign


@app.post("/campaigns", response_model=Campaign)
def create_campaign(campaign: Campaign):
    campaigns.append(campaign.dict())
    return campaign

# Step 3: Get real analytics predictions using ML models


@app.get("/analytics")
def get_analytics():
    # Simulated campaign feature input (replace with real DB in future)
    campaign_data = [
        {"name": "Campaign 1", "impressions": 3000, "duration": 5},
        {"name": "Campaign 2", "impressions": 5000, "duration": 6},
        {"name": "Campaign 3", "impressions": 2000, "duration": 4},
    ]

    results = []
    for c in campaign_data:
        features = np.array([[c["impressions"], c["duration"]]])
        reach = int(model_reach.predict(features)[0])
        clicks = int(model_clicks.predict(features)[0])
        results.append({
            "name": c["name"],
            "reach": reach,
            "clicks": clicks
        })

    return {"data": results}


feedback_store = []  # In-memory storage for now


class Feedback(BaseModel):
    campaign_id: int
    feedback: str  # "like" or "dislike"


@app.post("/feedback")
def post_feedback(fb: Feedback):
    feedback_store.append(fb.dict())
    return {"message": "Feedback received", "data": fb}
