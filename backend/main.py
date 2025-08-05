import os
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
def predict_campaign(future_interests: List[str]) -> str:
    interests = [x.lower() for x in future_interests]
    if "shoes" in interests:
        return "Sportswear Campaign"
    elif "laptop" in interests:
        return "Electronics Campaign"
    elif "travel" in interests:
        return "Travel Offers"
    elif "fashion" in interests:
        return "Clothing & Fashion"
    else:
        return "General Discounts Campaign"

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
def submit_feedback(data: Feedback):
    try:
        prediction = predict_campaign(data.future_interest)
        token = str(uuid.uuid4())

        entry = {
            "token": token,
            "name": data.name,
            "phone": data.phone,
            "transaction_id": data.transaction_id,
            "purchased_item": data.purchased_item,
            "future_interest": data.future_interest,
            "predicted_ad": prediction
        }

        insert_feedback(entry)

        return {
            "status": "success",
            "prediction": prediction,
            "token": token
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feedback failed: {str(e)}")
