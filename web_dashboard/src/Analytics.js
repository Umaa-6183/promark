import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchAnalytics } from './api';

const Analytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAnalytics().then(res => setData(res.data));
  }, []);

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-2">📊 Campaign Reach & Clicks (Live)</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="reach" fill="#3498db" />
          <Bar dataKey="clicks" fill="#e74c3c" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Analytics;
