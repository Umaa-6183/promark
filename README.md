# SmartAdX 🎯
**An AI-Powered, Privacy-Aware Feedback and Ad Prediction System for Electronic Retail**

> Built with FastAPI · ReactJS · React Native · Scikit-Learn · Python · JSON Chain · Render · Expo

---

## 📌 Project Overview

**SmartAdX** is an advanced proximity marketing and feedback system tailored for **electronics retail environments**.  
It uses supervised **AI/ML models** to analyze customer feedback, predict future interests, and display **personalized advertisements** — in real time.

---

## 🚀 Live Demo

- 🌐 Backend API: [`https://promark-backend.onrender.com`](https://promark-backend.onrender.com)
- 📱 Mobile App: Built with **React Native + Expo** (customer feedback & ad display)
- 💻 Web Dashboard: Admin interface to monitor campaigns & predictions

---

## 💡 Use Case

A customer purchases a gadget → fills a feedback form → backend processes it → ML model predicts what they might buy next → the **predicted ad is instantly shown** to them via the mobile app.

---

## 🧠 Key Features

| Feature                             | Description                                                                 |
|-------------------------------------|-----------------------------------------------------------------------------|
| 📋 Feedback Form                    | Full details: name, phone, item purchased, future interests                |
| 🤖 ML Prediction                    | Predicts next likely electronics product the customer might be interested in |
| 🔐 Privacy-Aware Logging            | Blockchain-like immutable feedback log using SHA256 hashes & timestamp     |
| 📲 Real-Time Ad Display             | Personalized ad shown instantly in Expo app after feedback submission      |
| 📊 Admin Dashboard                  | View analytics & ML results using ReactJS + Tailwind                       |
| 🌐 Auto-Deployed Backend            | FastAPI backend hosted on **Render.com** with auto-redeploy on Git push    |

---

## 🧰 Tech Stack

| Layer         | Technologies Used                                           |
|---------------|-------------------------------------------------------------|
| 🔧 Backend     | Python · FastAPI · Pickle · Scikit-learn                    |
| 🎨 Web App     | ReactJS · Tailwind CSS · Chart.js                           |
| 📱 Mobile App  | React Native · Expo · REST API                              |
| 🔐 Blockchain  | Simulated smart contracts via hashed JSON logs             |
| ☁ Deployment   | Render (Backend) · GitHub CI · Local development tools      |

---

## 📁 Folder Structure

SmartAdX/
├── backend/ # FastAPI backend + ML integration
├── web_dashboard/ # ReactJS dashboard with Tailwind charts
├── mobile_app/ # React Native app for user feedback
├── ml_models/ # Training scripts + ad_predictor.pkl
├── smart_contracts/ # Feedback logging with hash + timestamp
├── deployment/ # Render deployment config (render.yaml)
└── README.md


---

## 🔍 How It Works (Flow)

1. **Customer buys a product** in-store  
2. **Fills feedback form** in the mobile app (Expo)  
3. Form is submitted to **FastAPI backend**  
4. ML model (`ad_predictor.pkl`) predicts what product they're likely to purchase next  
5. Result is displayed instantly on-screen  
6. Feedback is stored in memory and logged in an **immutable blockchain-style JSON ledger**  

---

## 🧠 Machine Learning (Supervised)

| Model Name           | Algorithm          | Input Features                       | Output                 |
|----------------------|--------------------|--------------------------------------|------------------------|
| `ad_predictor.pkl`   | Logistic Regression (multi-class) | Future interest categories | Next ad category       |
| `train_ad_predictor.py` | Training script for simulated electronics preferences | Trains & saves model |

---

## 🔒 Privacy and Trust

- All feedback is logged using a **hash chain structure**
- Each feedback has a `SHA-256` hash and timestamp
- Stored inside: `smart_contracts/feedback_chain.json`

---

## 📦 Installation & Local Setup

### ✅ Backend (FastAPI)
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # (or source venv/bin/activate on Mac/Linux)
pip install -r requirements.txt
uvicorn main:app --reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

✅ Web Dashboard

cd web_dashboard
npm install
npm start

✅ Mobile App (Expo)

cd mobile_app/promark-mobile
npm install
npx expo start

Important: Use your local IP in App.js instead of localhost for backend access in Expo app.

📊 Sample Feedback Entry

{
  "name": "Ankit",
  "phone": "9876543210",
  "transaction_id": "TXN12345",
  "purchased_item": "Smartphone",
  "future_interest": ["Smartwatch", "Tablet"]
}


🧬 Example Prediction Response

{
  "message": "Feedback received",
  "predicted_ad": "Smartwatch"
}

📚 Literature References
A. Gilal et al., "ProMark: Ensuring Transparency and Privacy-Awareness in Proximity Marketing Advertising Campaigns", IEEE Access, 2021

ACM Survey, "Context-Aware Proactive Systems using ML", ACM Computing Surveys, 2020

FastAPI · React Native · Scikit-learn Official Docs

📌 Authors & Contributors
🧑‍💻 Karan Singh J – Project Lead

🤖 Assisted by Kamal Raj 

🎓 Rajarajeswari College of Engineering

📎 License
MIT License – use, modify and contribute freely 🎉

