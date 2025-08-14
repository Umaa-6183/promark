// src/pages/FeedbackLog.js

import React, { useEffect, useState } from "react";
import '../styles/FeedbackLog.css';
function FeedbackLog () {
  const [feedbacks, setFeedbacks] = useState([]);

  // ...existing code...
  useEffect(() => {
    fetch("https://promark.onrender.com/feedbacks")
      .then((res) => res.json())
      .then((data) =>  {
        // Ensure feedbacks is always an array
        const safeFeedbacks = Array.isArray(data.feedbacks) ? data.feedbacks : [];
        setFeedbacks(safeFeedbacks);
      })
      .catch((err) => {
        console.error("Error fetching feedbacks:", err);
        setFeedbacks([]); // fallback to empty array on error
      });
},   []);
// ...existing code...

  return (
    <div className="feedback-log">
      <h2>Feedback Log</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Transaction ID</th>
            <th>Purchased Item</th>
            <th>Future Interests</th>
            <th>Predicted Ad</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback , index) => (
            <tr key={index}>
              <td>{feedback.name}</td>
              <td>{feedback.phone}</td>
              <td>{feedback.transaction_id}</td>
              <td>{feedback.purchased_item}</td>
              <td>{feedback.future_interest.join(", ")}</td>
              <td>{feedback.predicted_ad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FeedbackLog;
