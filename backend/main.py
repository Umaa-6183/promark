import os
import sqlite3
import uuid
import json
from typing import List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from routes import campaigns
from database import create_feedback_table, insert_feedback, get_all_feedbacks

# ✅ Initialize FastAPI app
app = FastAPI(title="SmartAdX API")

# ✅ Enable CORS (for web + mobile)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include campaign router
app.include_router(campaigns.router)

# ✅ Create feedback table on startup
create_feedback_table()

# ✅ Campaigns.json loader
BASE_DIR = os.path.dirname(__file__)
CAMPAIGN_FILE = os.path.join(BASE_DIR, "campaigns.json")
if os.path.exists(CAMPAIGN_FILE):
    with open(CAMPAIGN_FILE, "r") as f:
        campaign_data = json.load(f)
else:
    campaign_data = []

# ✅ Feedback model
class Feedback(BaseModel):
    name: str
    phone: str
    transaction_id: str
    purchased_item: str
    future_interest: List[str]

# ✅ Dummy prediction logic (can be replaced with ML model)
def predict_campaign(feedback_text: str, rating: int) -> str:
    """
    Simple rule-based campaign prediction logic.
    Always returns a valid campaign name.
    """

    # Ensure feedback_text is a string
    feedback_text = (feedback_text or "").lower().strip()

    # Rule-based prediction
    if rating >= 4:
        if "discount" in feedback_text or "sale" in feedback_text:
            return "Discount Campaign"
        elif "new" in feedback_text or "launch" in feedback_text:
            return "New Product Launch"
        else:
            return "General Offers Campaign"

    elif rating == 3:
        return "Engagement Campaign"

    elif rating <= 2:
        if "issue" in feedback_text or "bad" in feedback_text:
            return "Customer Support Follow-up"
        else:
            return "Re-engagement Campaign"

    # Fallback (just in case)
    return "General Campaign"

# ✅ Root route
@app.get("/")
def home():
    return {"message": "SmartAdX API Running"}

# ✅ Return all campaigns
@app.get("/campaigns")
def get_campaigns():
    return campaign_data

# ✅ Return all feedbacks
@app.get("/feedbacks")
def all_feedbacks():
    return {"feedbacks": get_all_feedbacks()}

# ✅ Submit feedback with prediction
@app.post("/feedback")
async def submit_feedback(feedback: dict):
    """
    Store feedback from mobile app and return ad prediction
    """
    try:
        # Extract required fields
        token = feedback.get("token")
        name = feedback.get("name")
        phone = feedback.get("phone")
        transaction_id = feedback.get("transaction_id")
        purchased_item = feedback.get("purchased_item")
        future_interest = feedback.get("future_interest", "")
        rating = feedback.get("rating", 3)

        # Ensure future_interest is stored as string or list
        if isinstance(future_interest, str):
            future_interest_json = future_interest
        else:
            future_interest_json = json.dumps(future_interest)

        # Run prediction
        predicted_ad = predict_campaign(future_interest, rating)

        # Insert into DB
        insert_feedback({
            "token": token,
            "name": name,
            "phone": phone,
            "transaction_id": transaction_id,
            "purchased_item": purchased_item,
            "future_interest": future_interest_json,
            "predicted_ad": predicted_ad
        })

        return {"status": "success", "prediction": predicted_ad}

    except Exception as e:
        return {"status": "error", "message": str(e)}
