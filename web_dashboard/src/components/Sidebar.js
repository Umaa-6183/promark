import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => (
  <div className="sidebar">
    <h2 className="logo">SmartAdX</h2>
    <nav>
      <NavLink to="/" end activeclassname="active">Dashboard</NavLink>
      <NavLink to="/feedback-log" activeclassname="active">Feedback Log</NavLink>
      <NavLink to="/campaigns" activeclassname="active">Campaign Manager</NavLink>
      <NavLink to="/settings" activeclassname="active">Settings</NavLink>
    </nav>
  </div>
);

export default Sidebar;
