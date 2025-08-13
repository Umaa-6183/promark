from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import json
import os

app = FastAPI()

# Enable CORS for web dashboard & mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your domains if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database paths (make sure these match your folder structure)
FEEDBACKS_DB = os.path.join(os.path.dirname(__file__), "feedbacks.db")
CAMPAIGNS_DB = os.path.join(os.path.dirname(__file__), "promark.db")

BASE_IMAGE_URL = "http://127.0.0.1:8000/images/"  # Change to your deployed backend URL

# ---------------- Prediction Logic ----------------
def predict_campaign(future_interest):
    """Predict campaign name based on future interest."""
    if not future_interest:
        return "General Offers"

    # Ensure we work with a list
    if isinstance(future_interest, str):
        try:
            future_interest = json.loads(future_interest)
            if not isinstance(future_interest, list):
                future_interest = [future_interest]
        except:
            future_interest = [future_interest]
    elif not isinstance(future_interest, list):
        future_interest = [str(future_interest)]

    # Lowercase all
    future_interest = [str(item).lower() for item in future_interest]

    # Simple keyword matching
    if any("electronics" in item for item in future_interest):
        return "Electronics Mega Sale"
    if any("fashion" in item for item in future_interest):
        return "Fashion Fiesta"
    if any("grocery" in item for item in future_interest):
        return "Grocery Discounts"
    if any("travel" in item for item in future_interest):
        return "Travel Deals"

    return "Special Offers"

# ---------------- Routes ----------------

@app.post("/feedback")
async def submit_feedback(request: Request):
    """Save feedback & return predicted ad."""
    data = await request.json()

    # Extract and validate fields
    name = data.get("name")
    phone = data.get("phone")
    transaction_id = data.get("transaction_id")
    purchased_item = data.get("purchased_item")
    future_interest = data.get("future_interest")

    if not all([name, phone, transaction_id, purchased_item]):
        raise HTTPException(status_code=400, detail="Missing required fields")

    # Ensure future_interest is stored as JSON array
    if isinstance(future_interest, str):
        try:
            parsed = json.loads(future_interest)
            if isinstance(parsed, list):
                future_interest = parsed
            else:
                future_interest = [future_interest]
        except:
            future_interest = [future_interest]
    elif not isinstance(future_interest, list):
        future_interest = [str(future_interest)]

    # Predict campaign
    predicted_ad = predict_campaign(future_interest)

    # Save to feedbacks.db
    conn = sqlite3.connect(FEEDBACKS_DB)
    c = conn.cursor()
    c.execute("""
        INSERT INTO feedbacks (name, phone, transaction_id, purchased_item, future_interest, predicted_ad)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        name,
        phone,
        transaction_id,
        purchased_item,
        json.dumps(future_interest),
        predicted_ad
    ))
    conn.commit()
    conn.close()

    return {"status": "success", "prediction": predicted_ad}


@app.get("/feedbacks")
def get_feedbacks():
    """Return all feedbacks with consistent future_interest format."""
    conn = sqlite3.connect(FEEDBACKS_DB)
    c = conn.cursor()
    c.execute("SELECT id, name, phone, transaction_id, purchased_item, future_interest, predicted_ad FROM feedbacks")
    rows = c.fetchall()
    conn.close()

    feedback_list = []
    for row in rows:
        try:
            fi = json.loads(row[5])
            if not isinstance(fi, list):
                fi = [fi]
        except:
            fi = [row[5]] if row[5] else []
        feedback_list.append({
            "id": row[0],
            "name": row[1],
            "phone": row[2],
            "transaction_id": row[3],
            "purchased_item": row[4],
            "future_interest": fi,
            "predicted_ad": row[6]
        })

    return {"feedbacks": feedback_list}


@app.get("/campaigns")
def get_campaigns():
    """Return all campaigns with proper image URLs."""
    conn = sqlite3.connect(CAMPAIGNS_DB)
    c = conn.cursor()
    c.execute("SELECT id, name, description, image_url FROM campaigns")
    rows = c.fetchall()
    conn.close()

    campaigns_list = []
    for row in rows:
        img_url = row[3]
        if img_url and not img_url.startswith("http"):
            img_url = BASE_IMAGE_URL + img_url
        campaigns_list.append({
            "id": row[0],
            "name": row[1],
            "description": row[2],
            "image_url": img_url
        })

    return {"campaigns": campaigns_list}


@app.get("/stats")
def get_stats():
    """Return interest counts & ad distribution for dashboard charts."""
    conn = sqlite3.connect(FEEDBACKS_DB)
    c = conn.cursor()
    c.execute("SELECT future_interest, predicted_ad FROM feedbacks")
    rows = c.fetchall()
    conn.close()

    interest_counts = {}
    ad_distribution = {}

    for fi_raw, ad in rows:
        # Count interests
        try:
            fi_list = json.loads(fi_raw)
            if not isinstance(fi_list, list):
                fi_list = [fi_list]
        except:
            fi_list = [fi_raw] if fi_raw else []

        for interest in fi_list:
            interest = str(interest).lower()
            interest_counts[interest] = interest_counts.get(interest, 0) + 1

        # Count ad predictions
        if ad:
            ad_distribution[ad] = ad_distribution.get(ad, 0) + 1

    return {
        "interest_counts": interest_counts,
        "ad_distribution": ad_distribution
    }
