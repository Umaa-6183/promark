import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InterestChart from '../components/InterestChart';
import AdDistributionPie from '../components/AdDistributionPie';
import '../styles/Dashboard.css';

const API_BASE = 'https://promark.onrender.com'; // Change if your backend is different

function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`${API_BASE}/feedbacks-sqlite`);
        setFeedbacks(res.data.feedbacks || []);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>📊 Dashboard Overview</h2>

      {loading ? (
        <p>Loading feedback data...</p>
      ) : (
        <>
          {/* Chart Section */}
          <div className="charts">
            <div className="chart-card">
              <InterestChart feedbacks={feedbacks} />
            </div>
            <div className="chart-card">
              <AdDistributionPie feedbacks={feedbacks} />
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-summary">
            <p><strong>Total Feedbacks:</strong> {feedbacks.length}</p>
            <p><strong>Unique Users:</strong> {new Set(feedbacks.map(fb => fb.phone)).size}</p>
            <p><strong>Predicted Ads:</strong> {new Set(feedbacks.map(fb => fb.predicted_ad)).size}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
