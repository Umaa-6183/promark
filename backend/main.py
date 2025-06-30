import os
import sys
import uuid
import json
import pickle
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import importlib.util

# ✅ Dynamically import log_chain.py
log_chain_path = os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..', 'smart_contracts', 'log_chain.py'))
spec = importlib.util.spec_from_file_location("log_chain", log_chain_path)
log_chain = importlib.util.module_from_spec(spec)
spec.loader.exec_module(log_chain)

# ✅ Initialize FastAPI
app = FastAPI(title="SmartAdX API")

# ✅ Enable CORS for frontend/mobile access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load ML model and encoder
MODEL_DIR = os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..', 'ml_models'))
with open(os.path.join(MODEL_DIR, "ad_predictor.pkl"), "rb") as f:
    ad_model = pickle.load(f)

with open(os.path.join(MODEL_DIR, "ad_encoder.pkl"), "rb") as f:
    ad_encoder = pickle.load(f)

# ✅ In-memory stores
feedback_store = []
campaigns = []

# ✅ Pydantic model for feedback form


class FeedbackForm(BaseModel):
    name: str
    phone: str
    transaction_id: str
    purchased_item: str
    future_interest: list


@app.get("/")
def root():
    return {"message": "Welcome to SmartAdX API"}


@app.get("/campaigns")
def get_campaigns():
    return campaigns


@app.get("/feedbacks")
def list_feedbacks():
    return {"feedbacks": feedback_store}


@app.post("/feedback")
def receive_feedback(data: FeedbackForm):
    try:
        # 🔁 Encode future interest using the encoder
        encoded_input = ad_encoder.transform([data.future_interest])
        prediction = ad_model.predict(encoded_input)[0]
        token = str(uuid.uuid4())
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Prediction failed: {str(e)}")

    # ✅ Feedback Entry
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

    # ✅ Log to pseudo blockchain file
    log_path = os.path.abspath(os.path.join(os.path.dirname(
        __file__), '..', 'smart_contracts', 'feedback_chain.json'))
    if os.path.exists(log_path):
        with open(log_path, "r") as f:
            logs = json.load(f)
    else:
        logs = []

    logs.append({
        "campaign_id": data.transaction_id,
        "feedback_hash": log_chain.hash_feedback(entry),
        "timestamp": str(uuid.uuid1().time)
    })

    with open(log_path, "w") as f:
        json.dump(logs, f, indent=2)

    return {
        "message": "✅ Feedback received",
        "predicted_ad": prediction,
        "token": token
    }
