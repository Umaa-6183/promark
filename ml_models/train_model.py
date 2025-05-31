import pandas as pd
from sklearn.linear_model import LinearRegression
import pickle

# Sample training data
data = pd.DataFrame({
    "impressions": [1000, 2000, 3000, 4000, 5000],
    "duration": [3, 4, 5, 6, 7],
    "reach": [400, 800, 1200, 1600, 2000],
    "clicks": [100, 200, 300, 400, 500]
})

# Train models for reach and clicks
model_reach = LinearRegression().fit(
    data[["impressions", "duration"]], data["reach"])
model_clicks = LinearRegression().fit(
    data[["impressions", "duration"]], data["clicks"])

# Save models
with open("model_reach.pkl", "wb") as f:
    pickle.dump(model_reach, f)

with open("model_clicks.pkl", "wb") as f:
    pickle.dump(model_clicks, f)

print("✅ Models saved successfully.")
