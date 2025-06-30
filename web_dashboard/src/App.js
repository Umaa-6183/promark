import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

const API_BASE = "https://promark-backend.onrender.com"; // Replace with your Render backend if different

function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/feedbacks`);
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">📊 SmartAdX Admin Dashboard</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading feedbacks...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded border border-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4">Token</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Transaction</th>
                <th className="py-2 px-4">Purchased</th>
                <th className="py-2 px-4">Interests</th>
                <th className="py-2 px-4">Predicted Ad</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{fb.token}</td>
                  <td className="py-2 px-4">{fb.name}</td>
                  <td className="py-2 px-4">{fb.transaction_id}</td>
                  <td className="py-2 px-4">{fb.purchased_item}</td>
                  <td className="py-2 px-4">{fb.future_interest.join(", ")}</td>
                  <td className="py-2 px-4 text-green-600 font-semibold">{fb.predicted_ad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
