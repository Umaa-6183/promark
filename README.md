SmartAdX
SmartAdX is an intelligent advertising platform that collects customer feedback, predicts relevant ads using machine learning, and displays targeted campaigns. It includes:

Backend with FastAPI + ML model + SQLite

Mobile app using React Native (Expo)

Web dashboard using ReactJS + Charts + SQLite integration

Project Structure

ProMark/
├── backend/              # FastAPI backend + SQLite + ML
├── web_dashboard/        # ReactJS admin panel (Dashboard, Feedback Log, Campaigns, Settings)
├── mobile_app/
│   └── promark-mobile/   # Expo-based mobile app
├── smart_contracts/      # Feedback logging to simulated blockchain-like log
├── ml_models/            # ad_predictor.pkl and ad_encoder.pkl
└── deployment/           # (Optional) deployment configs

Backend Setup (/backend)

Requirements

Python 3.10+

pip install -r requirements.txt

SQLite3 (pre-installed with Python)

Run locally

cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

API Endpoints

| Method | Endpoint            | Description                      |
| ------ | ------------------- | -------------------------------- |
| GET    | `/campaigns`        | Fetch campaign data              |
| GET    | `/feedbacks`        | Return feedbacks from memory     |
| GET    | `/feedbacks-sqlite` | Return feedbacks from SQLite     |
| POST   | `/feedback`         | Submit feedback + get prediction |

Mobile App Setup (/mobile_app/promark-mobile)
Requirements
Node.js + npm

Expo CLI (npm install -g expo-cli)

Run locally

cd mobile_app/promark-mobile
npm install
npx expo start

The mobile app will:

Collect user feedback (name, phone, transaction, interest)

Submit to FastAPI backend

Show predicted ad + instant reward

Display active campaigns in a carousel

Web Dashboard Setup (/web_dashboard)

Requirements

Node.js + npm

Run locally

cd web_dashboard
npm install
npm start

Features

Admin dashboard with analytics

Feedback log table (via SQLite)

Campaign manager (create/view)

Settings section (UI only)

Pie chart (Ad distribution)

Bar chart (Interest trends)

Machine Learning

Located in ml_models/:

ad_predictor.pkl – trained classifier

ad_encoder.pkl – label encoder for interests

Used in /feedback route to predict relevant ad

Predictions stored along with feedback in feedbacks.db

Blockchain Log (Simulation)

Located in smart_contracts/log_chain.py

Feedbacks are hashed and appended to feedback_chain.json
(simulating a simple immutable log)
