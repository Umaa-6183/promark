import os
import uuid
import json
import pickle
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from smart_contracts.log_chain import log_to_chain

# Initialize FastAPI app
app = FastAPI(title="SmartAdX API")

# Enable CORS for frontend/mobile integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model on startup
MODEL_PATH = os.path.join(os.path.dirname(
    __file__), "../ml_models/ad_predictor.pkl")
with open(MODEL_PATH, "rb") as f:
    ad_model = pickle.load(f)

# In-memory simulated DB
feedback_store = []
campaigns = []  # Optional if you plan to add campaign creation

# Data model for feedback form


class FeedbackForm(BaseModel):
    name: str
    phone: str
    transaction_id: str
    purchased_item: str
    future_interest: list  # e.g., ["Smartwatch", "Tablet"]


@app.get("/")
def root():
    return {"message": "Welcome to SmartAdX API"}


@app.get("/campaigns")
def get_campaigns():
    return campaigns


@app.post("/feedback")
def receive_feedback(data: FeedbackForm):
    token = str(uuid.uuid4())
    prediction = ad_model.predict([data.future_interest])[0]

    entry = {
        "token": token,
        "name": data.name,
        "phone": data.phone,
        "transaction_id": data.transaction_id,
        "purchased_item": data.purchased_item,
        "future_interest": data.future_interest,
        "predicted_ad": prediction
    }

    feedback_store.append(entry)

    # ✅ Log to blockchain-like JSON file with hash + timestamp
    log_to_chain(data.transaction_id, entry)

    return {"message": "Feedback received", "predicted_ad": prediction}


@app.get("/feedbacks")
def list_feedbacks():
    return {"feedbacks": feedback_store}
