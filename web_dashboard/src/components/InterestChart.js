import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InterestChart = ({ feedbacks }) => {
  const [interestCounts, setInterestCounts] = useState({});

  useEffect(() => {
    const counts = {};
    feedbacks.forEach(fb => {
      fb.future_interest.forEach(item => {
        counts[item] = (counts[item] || 0) + 1;
      });
    });
    setInterestCounts(counts);
  }, [feedbacks]);

  const data = {
    labels: Object.keys(interestCounts),
    datasets: [
      {
        label: 'Interest Frequency',
        data: Object.values(interestCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      }
    ]
  };

  return (
    <div className="chart-card">
      <h3>📊 Interest Categories</h3>
      <Bar data={data} />
    </div>
  );
};

export default InterestChart;
