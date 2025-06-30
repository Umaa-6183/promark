import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MultiLabelBinarizer

# 🧪 Dummy training data
X_raw = [
    ["Tablet", "Laptop"],
    ["Smartwatch"],
    ["Tablet", "Smartwatch"],
    ["Laptop"],
    ["Camera"],
    ["Tablet", "Camera"]
]

y = ["Gadget Promo", "Wearables", "Mixed",
     "Gadget Promo", "Photography", "Mixed"]

# 🎛️ Encode list of interests into numeric features
encoder = MultiLabelBinarizer()
X = encoder.fit_transform(X_raw)

# 🧠 Train model
model = RandomForestClassifier()
model.fit(X, y)

# 💾 Save model
with open("ad_predictor.pkl", "wb") as f:
    pickle.dump(model, f)

# 💾 Save encoder
with open("ad_encoder.pkl", "wb") as f:
    pickle.dump(encoder, f)

print("✅ ad_predictor.pkl and ad_encoder.pkl saved.")
