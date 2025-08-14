import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InterestChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Interest Frequency',
        data: Object.values(data),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      }
    ]
  };

  return (
    <div className="chart-card">
      <h3>📊 Interest Categories</h3>
      <Bar data={chartData} />
    </div>
  );
};

export default InterestChart;
