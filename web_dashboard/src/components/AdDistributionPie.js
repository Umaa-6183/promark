import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdDistributionPie = ({ feedbacks }) => {
  const [adCounts, setAdCounts] = useState({});

  useEffect(() => {
    const counts = {};
    feedbacks.forEach(fb => {
      counts[fb.predicted_ad] = (counts[fb.predicted_ad] || 0) + 1;
    });
    setAdCounts(counts);
  }, [feedbacks]);

  const data = {
    labels: Object.keys(adCounts),
    datasets: [{
      data: Object.values(adCounts),
      backgroundColor: [
        '#4bc0c0', '#36a2eb', '#ff6384', '#ffcd56', '#9966ff'
      ]
    }]
  };

  return (
    <div className="chart-card">
      <h3>🥧 Ad Prediction Distribution</h3>
      <Pie data={data} />
    </div>
  );
};

export default AdDistributionPie;
