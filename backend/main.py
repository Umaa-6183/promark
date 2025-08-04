import os
import uuid
import json
import pickle
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import importlib.util
from routes import campaigns

# ✅ Import SQLite database utilities
from database import create_feedback_table, insert_feedback, get_all_feedbacks

# ✅ Initialize FastAPI
app = FastAPI(title="SmartAdX API")

app.include_router(campaigns.router)
# ✅ Enable CORS for frontend/mobile access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Paths
BASE_DIR = os.path.dirname(__file__)
CAMPAIGN_FILE = os.path.join(BASE_DIR, "campaigns.json")
MODEL_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'ml_models'))
LOG_FILE = os.path.abspath(os.path.join(BASE_DIR, '..', 'smart_contracts', 'feedback_chain.json'))

# ✅ Dynamically import log_chain.py from smart_contracts
log_chain_path = os.path.abspath(os.path.join(BASE_DIR, '..', 'smart_contracts', 'log_chain.py'))
spec = importlib.util.spec_from_file_location("log_chain", log_chain_path)
log_chain = importlib.util.module_from_spec(spec)
spec.loader.exec_module(log_chain)

# ✅ Load campaigns from file
if os.path.exists(CAMPAIGN_FILE):
    with open(CAMPAIGN_FILE, "r") as f:
        campaigns = json.load(f)
else:
    campaigns = []

# ✅ Load ML model and encoder
with open(os.path.join(MODEL_DIR, "ad_predictor.pkl"), "rb") as f:
    ad_model = pickle.load(f)

with open(os.path.join(MODEL_DIR, "ad_encoder.pkl"), "rb") as f:
    ad_encoder = pickle.load(f)

# ✅ Create SQLite table at startup
create_feedback_table()

# ✅ Pydantic model for feedback form
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
    return {"feedbacks": get_all_feedbacks()}

@app.post("/feedback")
def receive_feedback(data: FeedbackForm):
    try:
        encoded_input = ad_encoder.transform([data.future_interest])
        prediction = ad_model.predict(encoded_input)[0]
        token = str(uuid.uuid4())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

    entry = {
        "token": token,
        "name": data.name,
        "phone": data.phone,
        "transaction_id": data.transaction_id,
        "purchased_item": data.purchased_item,
        "future_interest": data.future_interest,
        "predicted_ad": prediction
    }

    # ✅ Store in SQLite database
    insert_feedback(entry)

    # ✅ Log to blockchain-like log file
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r") as f:
            logs = json.load(f)
    else:
        logs = []

    logs.append({
        "campaign_id": data.transaction_id,
        "feedback_hash": log_chain.hash_feedback(entry),
        "timestamp": str(uuid.uuid1().time)
    })

    with open(LOG_FILE, "w") as f:
        json.dump(logs, f, indent=2)

    return {
        "message": "✅ Feedback received",
        "predicted_ad": prediction,
        "token": token
    }
