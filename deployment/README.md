# 🚀 ProMark Deployment Guide

This folder contains deployment setup and instructions for the ProMark project.

---

## 1. 🌐 Backend Deployment (FastAPI on Render)

### ✅ Already Deployed:
🔗 [https://promark-backend.onrender.com](https://promark-backend.onrender.com)

### 🛠 To Redeploy Manually:

1. Go to [https://render.com](https://render.com)
2. Log in with your GitHub (Umaa-6183)
3. Click **New + → Web Service**
4. Choose your repo → `promark-backend`
5. Fill the fields:
   - **Environment:** Python 3
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port 10000`
   - **Root Directory:** `backend`
6. Hit **Create Web Service**

✅ Backend auto-deploys every time you push to GitHub!

---

## 2. 🖥️ Web Dashboard Deployment (React)

### Option 1: Local Run

```bash
cd web_dashboard
npm install
npm start

Option 2: Deploy to Vercel (Optional)
Go to https://vercel.com

Click "Import Project" → Connect your GitHub

Choose the web_dashboard folder

Set Root Directory = web_dashboard

Auto-build & deploy 🚀

3. 📱 Mobile App (Expo)
No hosting needed! Use Expo Go.

bash
Copy code
cd mobile_app/promark-mobile
npm install
npm start
📱 Scan the QR code in Expo Go app to run it on your phone.

4. 🔐 Environment Variables (Optional)
If needed in future:

bash
Copy code
.env
bash
Copy code
DB_PATH=sqlite:///./feedbacks.db
RENDER_KEY=your-api-key

5. 📂 Deployment Files
File	Description
render.yaml	Backend deploy config (for Render.com)
.env.example	Template for your .env variables

✅ Done!
Once deployed, your API is always live at:

🌐 https://promark-backend.onrender.com
📚 Docs: /docs


---

### ✅ Step 2: (Optional) Create `.env.example`

Only if you're using `.env` in future (currently not needed for SQLite, but useful for PostgreSQL/Supabase):

📄 `deployment/.env.example`

```bash
DB_PATH=sqlite:///./feedbacks.db
RENDER_KEY=your-api-key
