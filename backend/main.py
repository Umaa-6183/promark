import os
import uuid
import json
import pickle
import sqlite3
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import importlib.util
from database import create_feedback_table, insert_feedback, get_all_feedbacks

# ✅ Dynamic import for blockchain log
log_chain_path = os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..', 'smart_contracts', 'log_chain.py'))
spec = importlib.util.spec_from_file_location("log_chain", log_chain_path)
log_chain = importlib.util.module_from_spec(spec)
spec.loader.exec_module(log_chain)

app = FastAPI(title="SmartAdX API")

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Paths
BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, "feedbacks.db")
MODEL_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'ml_models'))
CAMPAIGN_FILE = os.path.join(BASE_DIR, "campaigns.json")
LOG_FILE = os.path.join(BASE_DIR, '..', 'smart_contracts', 'feedback_chain.json')

# ✅ Load campaigns from file
campaigns = []
if os.path.exists(CAMPAIGN_FILE):
    with open(CAMPAIGN_FILE, "r") as f:
        campaigns = json.load(f)

# ✅ Load ML model and encoder
with open(os.path.join(MODEL_DIR, "ad_predictor.pkl"), "rb") as f:
    ad_model = pickle.load(f)

with open(os.path.join(MODEL_DIR, "ad_encoder.pkl"), "rb") as f:
    ad_encoder = pickle.load(f)

# ✅ Create SQLite table (if not exists)
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS feedbacks (
            token TEXT PRIMARY KEY,
            name TEXT,
            phone TEXT,
            transaction_id TEXT,
            purchased_item TEXT,
            future_interest TEXT,
            predicted_ad TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

# ✅ Pydantic model
class FeedbackForm(BaseModel):
    name: str
    phone: str
    transaction_id: str
    purchased_item: str
    future_interest: list

# ✅ Routes
@app.get("/")
def root():
    return {"message": "Welcome to SmartAdX API"}

@app.get("/campaigns")
def get_campaigns():
    return campaigns

@app.get("/feedbacks")
def list_feedbacks():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM feedbacks")
    rows = cursor.fetchall()
    conn.close()

    feedbacks = []
    for row in rows:
        feedbacks.append({
            "token": row[0],
            "name": row[1],
            "phone": row[2],
            "transaction_id": row[3],
            "purchased_item": row[4],
            "future_interest": json.loads(row[5]),
            "predicted_ad": row[6]
        })
    return {"feedbacks": feedbacks}

@app.post("/feedback")
def receive_feedback(data: FeedbackForm):
    try:
        encoded_input = ad_encoder.transform([data.future_interest])
        prediction = ad_model.predict(encoded_input)[0]
        token = str(uuid.uuid4())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

    # ✅ Save to SQLite
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO feedbacks (
            token, name, phone, transaction_id,
            purchased_item, future_interest, predicted_ad
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        token, data.name, data.phone, data.transaction_id,
        data.purchased_item, json.dumps(data.future_interest), prediction
    ))
    conn.commit()
    conn.close()

    # ✅ Log to blockchain-like JSON log
    logs = []
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r") as f:
            logs = json.load(f)

    logs.append({
        "campaign_id": data.transaction_id,
        "feedback_hash": log_chain.hash_feedback({
            "token": token,
            "name": data.name,
            "phone": data.phone,
            "transaction_id": data.transaction_id,
            "purchased_item": data.purchased_item,
            "future_interest": data.future_interest,
            "predicted_ad": prediction
        }),
        "timestamp": str(uuid.uuid1().time)
    })

    with open(LOG_FILE, "w") as f:
        json.dump(logs, f, indent=2)

    return {
        "message": "✅ Feedback received",
        "predicted_ad": prediction,
        "token": token
    }
