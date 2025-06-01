import os
import pickle
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI(title="ProMark API", version="1.0.0")

# CORS for React & Mobile
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..', 'ml_models'))
model_reach = pickle.load(
    open(os.path.join(MODEL_DIR, "model_reach.pkl"), "rb"))
model_clicks = pickle.load(
    open(os.path.join(MODEL_DIR, "model_clicks.pkl"), "rb"))

# Feedback classifier
feedback_model_path = os.path.join(MODEL_DIR, "feedback_classifier.pkl")
if os.path.exists(feedback_model_path):
    model_feedback = pickle.load(open(feedback_model_path, "rb"))
else:
    model_feedback = None

campaigns = [
    {"id": 1, "name": "Store Launch Promo", "status": "active"},
    {"id": 2, "name": "Discount Week", "status": "scheduled"},
]


class Campaign(BaseModel):
    id: int
    name: str
    status: str


class Feedback(BaseModel):
    campaign_id: int
    feedback: str


class PredictInput(BaseModel):
    impressions: int
    duration: int


@app.get("/")
def root():
    return {"message": "Welcome to the ProMark API"}


@app.get("/campaigns", response_model=List[Campaign])
def get_campaigns():
    return campaigns


@app.post("/campaigns", response_model=Campaign)
def add_campaign(c: Campaign):
    campaigns.append(c.dict())
    return c


@app.get("/analytics")
def get_analytics():
    results = []
    for c in campaigns:
        X = np.array([[3000, 5]])
        results.append({
            "name": c["name"],
            "reach": int(model_reach.predict(X)[0]),
            "clicks": int(model_clicks.predict(X)[0])
        })
    return {"data": results}


feedback_store = []


@app.post("/feedback")
def store_feedback(fb: Feedback):
    feedback_store.append(fb.dict())
    with open("feedback_data.json", "w") as f:
        json.dump(feedback_store, f)
    return {"message": "Feedback stored", "data": fb}


@app.get("/feedbacks")
def get_feedbacks():
    return {"feedbacks": feedback_store}


@app.post("/predict-feedback")
def predict_feedback(data: PredictInput):
    if model_feedback is None:
        raise HTTPException(
            status_code=500, detail="Feedback model not available")
    X = np.array([[data.impressions, data.duration]])
    pred = model_feedback.predict(X)[0]
    return {"prediction": pred}
