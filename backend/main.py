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
def predict_campaign(future_interest, rating):
    """
    A simple AI/ML placeholder logic that predicts an ad campaign
    based on future interest keywords and user rating.
    You can replace this with your real ML model later.
    """
    # Normalize input
    if isinstance(future_interest, str):
        future_interest = future_interest.lower()
    elif isinstance(future_interest, list):
        future_interest = " ".join(future_interest).lower()
    else:
        future_interest = ""

    # Sample prediction logic
    if "electronics" in future_interest:
        return "Exclusive Deals on Electronics"
    elif "fashion" in future_interest:
        return "Latest Fashion Trends Sale"
    elif "groceries" in future_interest:
        return "Fresh Grocery Discounts"
    elif rating and rating >= 4:
        return "Loyalty Bonus Offer"
    else:
        # Fallback generic ad
        campaigns = [
            "Mega Festive Sale",
            "Limited Time Discount",
            "Buy 1 Get 1 Free",
            "Seasonal Clearance Offer"
        ]
        return random.choice(campaigns)

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
