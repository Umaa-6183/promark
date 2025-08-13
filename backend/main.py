from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI()

# Allow CORS for frontend and mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to your domains later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# Database helpers
# ------------------------------

# Feedbacks DB
FEEDBACK_DB = "feedbacks.db"

def init_feedback_db():
    conn = sqlite3.connect(FEEDBACK_DB)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS feedbacks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT,
            name TEXT,
            phone TEXT,
            transaction_id TEXT,
            purchased_item TEXT,
            future_interest TEXT,
            rating INTEGER,
            predicted_ad TEXT
        )
    """)
    conn.commit()
    conn.close()

def insert_feedback(data: dict):
    conn = sqlite3.connect(FEEDBACK_DB)
    c = conn.cursor()
    c.execute("""
        INSERT INTO feedbacks
        (token, name, phone, transaction_id, purchased_item, future_interest, rating, predicted_ad)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["token"],
        data["name"],
        data["phone"],
        data["transaction_id"],
        data["purchased_item"],
        data["future_interest"],
        data.get("rating", 3),
        data["predicted_ad"]
    ))
    conn.commit()
    conn.close()

# Campaigns DB
CAMPAIGN_DB = "promark.db"

def get_campaigns():
    conn = sqlite3.connect(CAMPAIGN_DB)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS campaigns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            image_url TEXT
        )
    """)
    conn.commit()
    c.execute("SELECT name, description, image_url FROM campaigns")
    rows = c.fetchall()
    conn.close()
    return [{"name": r[0], "description": r[1], "image_url": r[2]} for r in rows]

# ------------------------------
# Prediction Logic
# ------------------------------
def predict_campaign(future_interest, rating):
    # Ensure string for prediction
    if isinstance(future_interest, list):
        future_interest = ", ".join(future_interest)
    if not isinstance(future_interest, str):
        future_interest = str(future_interest)

    fi_lower = future_interest.lower()

    if "laptop" in fi_lower:
        return "Laptop Accessories"
    elif "phone" in fi_lower or "mobile" in fi_lower:
        return "Mobile Covers"
    elif "shoes" in fi_lower:
        return "Sports Shoes"
    elif "watch" in fi_lower:
        return "Smart Watches"
    else:
        return "General Offers"

# ------------------------------
# Routes
# ------------------------------

@app.post("/feedback")
async def submit_feedback(feedback: dict):
    try:
        token = feedback.get("token")
        name = feedback.get("name")
        phone = feedback.get("phone")
        transaction_id = feedback.get("transaction_id")
        purchased_item = feedback.get("purchased_item")
        future_interest = feedback.get("future_interest", "")
        rating = feedback.get("rating", 3)

        # Convert list to string if needed
        if isinstance(future_interest, list):
            future_interest = ", ".join(future_interest)

        predicted_ad = predict_campaign(future_interest, rating)

        insert_feedback({
            "token": token,
            "name": name,
            "phone": phone,
            "transaction_id": transaction_id,
            "purchased_item": purchased_item,
            "future_interest": future_interest,
            "rating": rating,
            "predicted_ad": predicted_ad
        })

        return {"status": "success", "prediction": predicted_ad}

    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/campaigns")
async def campaigns():
    try:
        return {"status": "success", "campaigns": get_campaigns()}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ------------------------------
# Initialize DB on startup
# ------------------------------
@app.on_event("startup")
def startup_event():
    init_feedback_db()

