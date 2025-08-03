# backend/routes/campaigns.py

from fastapi import APIRouter
import json
import os

router = APIRouter()

@router.get("/campaigns")
def get_campaigns():
    # Adjust path to correctly point to campaigns.json
    json_path = os.path.join(os.path.dirname(__file__), "../campaigns.json")
    with open(json_path, "r") as f:
        campaigns = json.load(f)
    return campaigns
