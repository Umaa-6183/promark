# 📣 ProMark: AI-Powered Proximity Marketing Platform

**ProMark** is a full-stack, real-time, AI-integrated proximity marketing system that ensures transparency and privacy-awareness in advertising campaigns.

## 🎯 Features

✅ ReactJS Admin Dashboard  
✅ Expo-based Mobile App  
✅ FastAPI Backend with ML Models  
✅ SQLite Database for persistent feedback  
✅ AI-powered predictions using scikit-learn 
✅ Smart contract simulation (Hyperledger Fabric - JS)  
✅ Deployment-ready structure with Render + GitHub Actions  
✅ Render Deployment (Free cloud backend)  
✅ GitHub Integration & Auto Deploy

---

## 📦 Project Structure

ProMark/
├── backend/ # FastAPI backend + SQLite + ML model serving
├── ml_models/ # Trained .pkl model files + training scripts
├── web_dashboard/ # ReactJS frontend (campaign analytics & UI)
├── mobile_app/ # React Native mobile app using Expo
├── smart_contracts/ # Simulated blockchain smart contracts (JS)
├── deployment/ # Render configs, .envs, future cloud scripts
├── README.md # You're here!

---

## 🚀 Live Backend API

🔗 [https://promark-backend.onrender.com](https://promark-backend.onrender.com)  
📚 [Swagger Docs](https://promark-backend.onrender.com/docs)

Testable endpoints:
- `/campaigns`  
- `/analytics`  
- `/feedback`  
- `/feedbacks`  
- `/predict-feedback`

---

## ⚙️ How to Run Locally

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

### 2.Train ML Model

```bash
cd ml_models
python train_model.py
python train_feedback_model.py

### 3. Web Dashboard(React)

cd web_dashboard
npm install
npm start

### 4. Mobile App (Expo)

cd mobile_app/promark-mobile
npm install
npm start

Machine Learning Models
model_reach.pkl — Predicts campaign reach

model_clicks.pkl — Predicts number of ad clicks

feedback_classifier.pkl — Predicts user sentiment from campaign inputs

All models use scikit-learn and were trained on synthetic + collected feedback.

📊 Core APIs
Method	Route	Description
GET	/campaigns	Fetch all campaigns
POST	/campaigns	Create a new campaign
GET	/analytics	Predict reach & clicks (ML)
POST	/feedback	Submit user feedback
GET	/feedbacks	Get all feedbacks (DB)
POST	/predict-feedback	Predict like/dislike (ML)

🧾 License
MIT — Free to use for educational and research purposes.

👨‍💻 Built by
UmaaSV 2025
📧 Contact: [your-email@example.com]
🌐 GitHub: github.com/Umaa-6183


</details>

✅ Save the file (`Ctrl + S`)

---

### ✅ 4. **Push It to GitHub**

Now open terminal inside `ProMark/`:

```bash
cd C:\Users\umaam\OneDrive\Desktop\ProMark

git add README.md
git commit -m "Add project README"
git push
