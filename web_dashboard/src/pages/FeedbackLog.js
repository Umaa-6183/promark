// src/pages/FeedbackLog.js

import React, { useEffect, useState } from 'react';
import './FeedbackLog.css';

const FeedbackLog = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetch('/api/feedbacks')
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
      .catch((err) => console.error('Error fetching feedbacks:', err));
  }, []);

  return (
    <div className="feedback-log">
      <h2 className="page-title">Feedback Log</h2>
      <div className="feedback-table-wrapper">
        <table className="feedback-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Campaign</th>
              <th>Rating</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((f) => (
              <tr key={f.id}>
                <td>{f.user}</td>
                <td>{f.campaign}</td>
                <td>{f.rating}</td>
                <td>{f.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackLog;
