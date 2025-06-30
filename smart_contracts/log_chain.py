import json
import hashlib
import os
from datetime import datetime

CHAIN_PATH = os.path.join(os.path.dirname(__file__), "feedback_chain.json")


def hash_feedback(data: dict) -> str:
    stringified = json.dumps(data, sort_keys=True)
    return hashlib.sha256(stringified.encode()).hexdigest()


def log_to_chain(campaign_id: int, feedback_data: dict):
    entry = {
        "campaign_id": campaign_id,
        "feedback_hash": hash_feedback(feedback_data),
        "timestamp": datetime.now().isoformat()
    }

    try:
        with open(CHAIN_PATH, "r") as f:
            chain = json.load(f)
    except FileNotFoundError:
        chain = []

    chain.append(entry)

    with open(CHAIN_PATH, "w") as f:
        json.dump(chain, f, indent=2)

    return entry  # Optional: For debugging


CHAIN_PATH = os.path.join(os.path.dirname(__file__), "feedback_chain.json")


def hash_feedback(data: dict) -> str:
    stringified = json.dumps(data, sort_keys=True)
    return hashlib.sha256(stringified.encode()).hexdigest()


def log_to_chain(campaign_id: int, feedback_data: dict):
    entry = {
        "campaign_id": campaign_id,
        "feedback_hash": hash_feedback(feedback_data),
        "timestamp": datetime.now().isoformat()
    }

    try:
        with open(CHAIN_PATH, "r") as f:
            chain = json.load(f)
    except FileNotFoundError:
        chain = []

    chain.append(entry)

    with open(CHAIN_PATH, "w") as f:
        json.dump(chain, f, indent=2)

    return entry  # Optional: For debugging
