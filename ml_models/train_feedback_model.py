import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

# Use existing feedback data or simulate
data_path = os.path.join("..", "backend", "feedback_data.json")

# For testing purposes, use synthetic labeled data
data = pd.DataFrame({
    "impressions": [1000, 2000, 3000, 4000, 5000, 1500, 2500, 4500],
    "duration":    [1, 2, 3, 4, 5, 1, 2, 5],
    "feedback":    ["like", "like", "dislike", "dislike", "like", "like", "dislike", "like"]
})

data['label'] = data['feedback'].map({'like': 1, 'dislike': 0})
X = data[['impressions', 'duration']]
y = data['label']

clf = RandomForestClassifier().fit(X, y)

with open("feedback_classifier.pkl", "wb") as f:
    pickle.dump(clf, f)

print("✅ Trained and saved feedback classifier.")
