# main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

# Initialize FastAPI app
app = FastAPI(title="ProMark API", version="1.0.0")


# Sample Campaign data (for now, using in-memory list)
campaigns = [
    {"id": 1, "name": "Store Launch Promo", "status": "active"},
    {"id": 2, "name": "Discount Week", "status": "scheduled"}
]


# Define request schema using Pydantic
class Campaign(BaseModel):
    id: int
    name: str
    status: str


@app.get("/")
def read_root():
    return {"message": "Welcome to the ProMark API"}


@app.get("/campaigns", response_model=List[Campaign])
def get_campaigns():
    return campaigns


@app.get("/campaigns/{campaign_id}", response_model=Campaign)
def get_campaign(campaign_id: int):
    for campaign in campaigns:
        if campaign["id"] == campaign_id:
            return campaign
    raise HTTPException(status_code=404, detail="Campaign not found")


@app.post("/campaigns", response_model=Campaign)
def create_campaign(campaign: Campaign):
    campaigns.append(campaign.dict())
    return campaign
