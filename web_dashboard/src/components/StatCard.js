import React from 'react';
import '../styles/StatCard.css';

const StatCard = ({ title, value, icon }) => (
  <div className="stat-card">
    <div className="icon">{icon}</div>
    <div className="details">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  </div>
);

export default StatCard;
