// Use your Render-deployed backend
export const API_BASE = "https://promark.onrender.com";

export const fetchCampaigns = async () => {
  const res = await fetch(`${API_BASE}/campaigns`);
  return await res.json();
};

export const fetchAnalytics = async () => {
  const res = await fetch(`${API_BASE}/analytics`);
  return await res.json();
};

export const fetchFeedbacks = async () => {
  const res = await fetch(`${API_BASE}/feedbacks`);
  return await res.json();
};

export const predictFeedback = async (payload) => {
  const res = await fetch(`${API_BASE}/predict-feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return await res.json();
};

export const createCampaign = async (payload) => {
  const res = await fetch(`${API_BASE}/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return await res.json();
};
