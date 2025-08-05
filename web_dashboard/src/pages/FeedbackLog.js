// src/pages/FeedbackLog.js

import React, { useEffect, useState } from "react";
import '../styles/FeedbackLog.css';
function FeedbackLog () {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/feedbacks")
      .then((res) => res.json())
      .then((data) =>  {
        console.log("Fetched feedbacks:", data.feedbacks);
        setFeedbacks(data.feedbacks);
      })
      .catch((err) => console.error("Error fetching feedbacks:", err));
  }, []);

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
            <th>Token</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb) => (
            <tr key={fb.token}>
              <td>{fb.name}</td>
              <td>{fb.phone}</td>
              <td>{fb.transaction_id}</td>
              <td>{fb.purchased_item}</td>
              <td>{fb.future_interest.join(", ")}</td>
              <td>{fb.predicted_ad}</td>
              <td>{fb.token}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FeedbackLog;
