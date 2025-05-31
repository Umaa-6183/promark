import os
import pickle
import numpy as np
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from database import FeedbackDB, SessionLocal

# Step 1: Initialize FastAPI app
app = FastAPI(title="ProMark API", version="1.0.0")

# Step 2: Load ML models (reach & clicks)
MODEL_DIR = os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..', 'ml_models'))

model_reach_path = os.path.join(MODEL_DIR, "model_reach.pkl")
model_clicks_path = os.path.join(MODEL_DIR, "model_clicks.pkl")

with open(model_reach_path, "rb") as f:
    model_reach = pickle.load(f)

with open(model_clicks_path, "rb") as f:
    model_clicks = pickle.load(f)

# Step 3: Load feedback classifier model (optional)
feedback_model_path = os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..', 'ml_models', 'feedback_classifier.pkl'))
print("🔍 Model path resolved to:", feedback_model_path)

try:
    with open(feedback_model_path, "rb") as f:
        feedback_model = pickle.load(f)
except Exception as e:
    print(f"⚠️ Could not load feedback model: {e}")
    feedback_model = None


# In-memory campaign list
campaigns = [
    {"id": 1, "name": "Store Launch Promo", "status": "active"},
    {"id": 2, "name": "Discount Week", "status": "scheduled"}
]

# In-memory feedback storage


# -------------------------------
# 🧩 API SCHEMAS
# -------------------------------


class Campaign(BaseModel):
    id: int
    name: str
    status: str


class Feedback(BaseModel):
    campaign_id: int
    feedback: str  # "like" or "dislike"


class CampaignFeatures(BaseModel):
    impressions: int
    duration: int

# -------------------------------
# 🌐 ROUTES
# -------------------------------


@app.get("/")
def read_root():
    return {"message": "Welcome to the ProMark API"}


@app.get("/campaigns", response_model=List[Campaign])
def get_campaigns():
    return campaigns


@app.get("/campaigns/{campaign_id}", response_model=Campaign)
def get_campaign(campaign_id: int):
    for campaign in campaigns:
        if campaign["id"] == campaign_id:
            return campaign
    raise HTTPException(status_code=404, detail="Campaign not found")


@app.post("/campaigns", response_model=Campaign)
def create_campaign(campaign: Campaign):
    campaigns.append(campaign.dict())
    return campaign


@app.get("/analytics")
def get_analytics():
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


@app.post("/feedback")
def post_feedback(fb: Feedback):
    db = SessionLocal()
    record = FeedbackDB(campaign_id=fb.campaign_id, feedback=fb.feedback)
    db.add(record)
    db.commit()
    db.refresh(record)
    db.close()
    return {"message": "Feedback saved to database", "data": fb}


@app.get("/feedbacks")
def get_feedbacks():
    db = SessionLocal()
    all_feedbacks = db.query(FeedbackDB).all()
    db.close()
    return {
        "feedbacks": [
            {"campaign_id": f.campaign_id, "feedback": f.feedback} for f in all_feedbacks
        ]
    }


@app.post("/predict-feedback")
def predict_feedback(data: CampaignFeatures):
    if not feedback_model:
        raise HTTPException(
            status_code=500, detail="Feedback model not available")

    X = np.array([[data.impressions, data.duration]])
    prediction = feedback_model.predict(X)[0]
    label = "like" if prediction == 1 else "dislike"
    return {"prediction": label}
