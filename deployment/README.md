# 🚀 ProMark Deployment Guide

This folder contains deployment configurations for cloud hosting and CI/CD.

---

## 🌐 Backend Deployment (Render)

1. Visit: https://render.com
2. Sign in with GitHub
3. Click "New Web Service"
4. Connect to your repo
5. Set:
   - **Root Dir** = `backend`
   - **Build Command** = `pip install -r requirements.txt`
   - **Start Command** = `uvicorn main:app --host 0.0.0.0 --port 10000`
6. Hit **Deploy**

✅ Done! Your backend is now live.

---

## 🖥️ Frontend (React) — Optional Cloud Deployment

Use:
- [https://vercel.com](https://vercel.com)
- [https://netlify.com](https://netlify.com)

Set:
- **Root Dir** = `web_dashboard`
- **Build Command** = `npm run build`
- **Start** = automatic

---

## 📱 Mobile (Expo)

No cloud deploy needed. Just run:

```bash
cd mobile_app/promark-mobile
npm start

Then scan QR in the Expo Go app.

💡 Custom Envs
Use .env file if you move to PostgreSQL or Supabase:

DB_URL=your_cloud_db
API_KEY=...


---

## ✅ Done!

You now have:

✅ `backend/` → Deployed via Render  
✅ `web_dashboard/` → Ready for Netlify/Vercel  
✅ `mobile_app/` → QR-ready for Expo  
✅ `smart_contracts/` → Local simulation for transparency  
✅ `ml_models/` → AI predictions for analytics + feedback  
✅ `README.md` + `.env.example` → DevOps best practices

---


