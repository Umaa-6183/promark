import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import pickle

# Sample training dataset (You can expand this)
data = pd.DataFrame({
    "transaction_id": ["T1", "T2", "T3", "T4", "T5"],
    "purchased_item": ["Laptop", "Phone", "TV", "Tablet", "Camera"],
    "future_interest": [
        "Mouse,Keyboard",
        "Earphones,Charger",
        "Soundbar,HDMI Cable",
        "Stylus,Case",
        "Tripod,Lens"
    ],
    "ad_category": ["Accessories", "Audio", "Home Entertainment", "Tablet Accessories", "Photography"]
})

# Encode interests as features
def encode_interests(interests):
    interest_list = interests.split(",")
    keywords = ["Mouse", "Keyboard", "Earphones", "Charger", "Soundbar", "HDMI Cable", "Stylus", "Case", "Tripod", "Lens"]
    return [1 if kw in interest_list else 0 for kw in keywords]

X = data["future_interest"].apply(encode_interests).tolist()
y = data["ad_category"]

# Train model
model = DecisionTreeClassifier()
model.fit(X, y)

# Save model
with open("ad_predictor.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Model trained and saved as ad_predictor.pkl")
