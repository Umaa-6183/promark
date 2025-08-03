// src/components/RecentFeedbackTable.js
const RecentFeedbackTable = ({ feedbacks }) => (
  <table className="feedback-table">
    <thead>
      <tr>
        <th>Token</th><th>Name</th><th>Purchased</th><th>Predicted Ad</th>
      </tr>
    </thead>
    <tbody>
      {feedbacks.map((f, idx) => (
        <tr key={idx}>
          <td>{f.token.slice(0, 8)}</td>
          <td>{f.name}</td>
          <td>{f.purchased_item}</td>
          <td>{f.predicted_ad}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default RecentFeedbackTable;
