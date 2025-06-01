import React, { useEffect, useState } from 'react';
import { BarChart, XAxis, YAxis, Bar, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchFeedbacks } from './api';

const FeedbackChart = () => {
  const [data, setData] = useState([{ like: 0, dislike: 0 }]);

  useEffect(() => {
    fetchFeedbacks().then(res => {
      const counts = { like: 0, dislike: 0 };
      res.feedbacks.forEach(fb => counts[fb.feedback]++);
      setData([counts]);
    });
  }, []);

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-2">📊 Feedback Summary</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="feedback" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="like" fill="#2ecc71" />
          <Bar dataKey="dislike" fill="#e67e22" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeedbackChart;
