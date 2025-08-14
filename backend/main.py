from fastapi import FastAPI, HTTPException 
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from typing import List
import random
import json
import os
# Local import for DB setup
from database import create_feedback_table



BASE_DIR = os.path.dirname(__file__)

feedback_db_path = os.path.join(BASE_DIR, "feedbacks.db")
promark_db_path = os.path.join(BASE_DIR, "promark.db")

# Example:
conn = sqlite3.connect(feedback_db_path)

app = FastAPI()

# Enable CORS for both dashboard and mobile
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- MODELS ----------
class Feedback(BaseModel):
    name: str
    phone: str
    transaction_id: str
    purchased_item: str
    future_interest: List[str]

# ---------- PREDICTION LOGIC ----------
def predict_campaign(future_interest: List[str]) -> str:
    """Simple prediction based on future interest keywords."""
    interest_map = {
        "electronics": ["Smartphone Sale", "Laptop Discounts", "Gadget Clearance"],
        "fashion": ["Clothing Deals", "Shoe Sale", "Accessories Discount"],
        "groceries": ["Fresh Produce Offer", "Dairy Deals", "Organic Food Sale"],
        "sports": ["Sports Gear Sale", "Fitness Equipment Offer", "Outdoor Gear Discount"],
    }
    for interest in future_interest:
        key = interest.strip().lower()
        if key in interest_map:
            return random.choice(interest_map[key])
    return random.choice(["Mega Sale", "Festival Offer", "Clearance Discount"])

# ---------- ROUTES ----------
@app.post("/feedback")
def submit_feedback(feedback: Feedback):
    """Store feedback, generate prediction, return it."""
    try:
        prediction = predict_campaign(feedback.future_interest)

        conn = sqlite3.connect(feedback_db_path)
        c = conn.cursor()
        c.execute("""
            INSERT INTO feedbacks (name, phone, transaction_id, purchased_item, future_interest, predicted_ad)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            feedback.name,
            feedback.phone,
            feedback.transaction_id,
            feedback.purchased_item,
            json.dumps(feedback.future_interest),  # <-- store as JSON string
            prediction
        ))
        conn.commit()
        conn.close()

        return {"status": "success", "prediction": prediction}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ...existing code...
@app.get("/feedbacks")
def get_feedbacks():
    try:
        conn = sqlite3.connect(feedback_db_path)
        c = conn.cursor()
        c.execute("""
            SELECT token, name, phone, transaction_id, purchased_item, future_interest, predicted_ad
            FROM feedbacks ORDER BY rowid DESC
        """)
        rows = c.fetchall()
        conn.close()

        feedback_list = [
            {
                "token": row[0],
                "name": row[1],
                "phone": row[2],
                "transaction_id": row[3],
                "purchased_item": row[4],
                "future_interest": json.loads(row[5]) if row[5] else [],
                "predicted_ad": row[6]
            }
            for row in rows
        ]
        return {"status": "success", "feedbacks": feedback_list}

    except Exception as e:
        # Always return feedbacks as an array, even on error
        return {"status": "error", "feedbacks": [], "detail": str(e)}
# ...existing code...


@app.get("/campaigns")
def get_campaigns():
    """Return all campaigns with image URLs."""
    try:
        conn = sqlite3.connect(promark_db_path)
        c = conn.cursor()
        # Ensure column names match db_setup.py: id, name, description, image_url
        c.execute("SELECT id, name, description, image_url FROM campaigns")
        rows = c.fetchall()
        conn.close()

        campaigns = [
            {"id": row[0], "name": row[1], "description": row[2], "image_url": row[3]}
            for row in rows
        ]
        return {"status": "success", "campaigns": campaigns}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
def get_stats():
    """Return stats for dashboard charts."""
    try:
        conn = sqlite3.connect(feedback_db_path)
        c = conn.cursor()
        c.execute("SELECT future_interest, predicted_ad FROM feedbacks")
        rows = c.fetchall()
        conn.close()

        interest_count = {}
        ad_distribution = {}

        for future_interest, predicted_ad in rows:
            if future_interest:
                for interest in future_interest.split(","):
                    interest = interest.strip()
                    interest_count[interest] = interest_count.get(interest, 0) + 1

            if predicted_ad:
                ad_distribution[predicted_ad] = ad_distribution.get(predicted_ad, 0) + 1

        return {
            "interest_count": interest_count,
            "ad_distribution": ad_distribution
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------- INIT DBs ----------
@app.on_event("startup")
def startup_event():
    create_feedback_table()  # Sets up feedbacks.db if not exists

@app.get("/")
def root():
    return {"message": "ProMark Backend is running"}
