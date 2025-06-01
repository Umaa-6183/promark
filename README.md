📣 ProMark: AI-Powered, Privacy-Aware Proximity Marketing System
🎓 A full-stack AI/ML research project for real-time advertising, feedback prediction, and campaign analytics

🚀 Overview
ProMark is a system designed to ensure transparency, intelligence, and privacy in proximity marketing using:

🧠 Supervised Machine Learning

📊 Campaign Analytics

📱 Mobile + Web Interfaces

🔐 Blockchain Simulation for Auditability

🧠 Features
| Component           | Description                                            |
| ------------------- | ------------------------------------------------------ |
| 🧠 ML Models        | Predict campaign reach, clicks, and feedback           |
| 📊 Web Dashboard    | Admin UI to monitor, analyze, and manage campaigns     |
| 📱 Mobile App       | Users give feedback, see campaigns, run ML predictions |
| 🔐 Smart Contracts  | Simulated blockchain logs for trust & transparency     |
| ☁️ Cloud Deployment | Fully deployed backend (Render) and mobile (Expo)      |


🗂️ Project Structure

ProMark/
├── backend/             # FastAPI + SQLite + ML API
├── web_dashboard/       # ReactJS admin UI
├── mobile_app/          # Expo-based mobile app
├── ml_models/           # ML training scripts + saved .pkl models
├── smart_contracts/     # Simulated blockchain logs
├── deployment/          # Render + Vercel setup & docs
└── README.md            # You are here!

🧪 Machine Learning Models

| Model File                | Role                                  |
| ------------------------- | ------------------------------------- |
| `model_reach.pkl`         | Predicts campaign reach               |
| `model_clicks.pkl`        | Predicts ad clicks                    |
| `feedback_classifier.pkl` | Predicts user feedback (like/dislike) |

📁 Training Scripts:

cd ml_models
python train_model.py             # reach & clicks
python train_feedback_model.py    # feedback classifier

🔧 How to Run
1. 🌐 Backend (FastAPI)
   
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

API Docs: http://localhost:8000/docs

2. 📊 Web Dashboard (React)
   
cd web_dashboard
npm install
npm start

📍 Visit: http://localhost:3000

3. 📱 Mobile App (Expo)

cd mobile_app/promark-mobile
npm install
npm start

🔍 Replace localhost with your local IP inside App.js:

const API_BASE = 'http://192.168.X.X:8000';

Scan QR with Expo Go app on your phone.

4. 🔐 Smart Contracts (Simulation)

cd smart_contracts
node simulator.js

Creates:

campaign_chain.json

feedback_chain.json

☁️ Deployment
🔧 Backend: Render.com

💻 Frontend: (Optional) Vercel/Netlify

📱 Mobile: Expo Go (no deploy needed)

| Step | Action                            | Result                                      |
| ---- | --------------------------------- | ------------------------------------------- |
| 1️⃣  | Create campaign on dashboard      | Appears in mobile + chart updates           |
| 2️⃣  | Submit feedback via mobile        | Stored in DB + visualized on dashboard      |
| 3️⃣  | Predict feedback (mobile or web)  | Output from real ML model                   |
| 4️⃣  | Trigger smart contract simulation | Blockchain-like audit trail in `.json` logs |

📸 Screenshots (Optional)
Add screenshots of:

Campaign analytics bar chart

Feedback chart (like/dislike)

Mobile app with feedback buttons

Swagger API docs


✅ Built With
Python 3.10 + FastAPI

ReactJS + Tailwind

React Native / Expo

SQLite + pickle models

scikit-learn, pandas, numpy, recharts

📚 Research Scope

M.Tech Project:
Cross-Cultural, Context-Aware Multi-Modal Emotion & Feedback Recognition in Proximity Advertising

ProMark demonstrates:

Supervised learning (classification & regression)

Real-time user feedback loops

Interoperability of AI + UI + blockchain-inspired trust

🤝 Acknowledgements
scikit-learn

FastAPI

React Native Expo

Render.com

💡 Inspired by IEEE Paper: ProMark: Ensuring Transparency and Privacy-Awareness in Proximity Marketing Campaigns

🧾 License
MIT — use, improve, and credit freely!

📬 Contact
Author: Umaa-6183
Supervisor: Kamal Sir
GitHub Repo: ProMark GitHub