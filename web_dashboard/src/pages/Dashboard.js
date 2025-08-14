import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InterestChart from '../components/InterestChart';
import AdDistributionPie from '../components/AdDistributionPie';
import '../styles/Dashboard.css';

const API_BASE = 'https://promark.onrender.com';

function Dashboard() {
  const [interestData, setInterestData] = useState({});
  const [adData, setAdData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/stats`);
        setInterestData(res.data.interest_count || {});
        setAdData(res.data.ad_distribution || {});
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Calculate summary stats from interestData and adData
  const totalFeedbacks = Object.values(interestData).reduce((sum, val) => sum + val, 0);
  const totalInterestCategories = Object.keys(interestData).length;
  const totalPredictedAds = Object.keys(adData).length;

  return (
    <div className="dashboard-container">
      <h2>📊 Dashboard Overview</h2>

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          {/* Chart Section */}
          <div className="charts">
            <div className="chart-card">
              <InterestChart data={interestData} />
            </div>
            <div className="chart-card">
              <AdDistributionPie data={adData} />
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-summary">
            <p><strong>Total Feedbacks:</strong> {totalFeedbacks}</p>
            <p><strong>Interest Categories:</strong> {totalInterestCategories}</p>
            <p><strong>Predicted Ads:</strong> {totalPredictedAds}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
