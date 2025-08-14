import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdDistributionPie = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [{
      data: Object.values(data),
      backgroundColor: [
        '#4bc0c0', '#36a2eb', '#ff6384', '#ffcd56', '#9966ff'
      ]
    }]
  };

  return (
    <div className="chart-card">
      <h3>🥧 Ad Prediction Distribution</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default AdDistributionPie;
