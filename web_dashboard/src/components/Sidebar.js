// src/components/Sidebar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, MessageCircle, Settings, Megaphone } from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`sidebar ${!isOpen ? 'closed' : ''}`}>
      <div className="close-icon" onClick={onClose}>
        <X />
      </div>
      <ul>
        <li>
          <NavLink to="/" onClick={onClose}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/feedback-log" onClick={onClose}>
            <MessageCircle size={18} /> Feedback Log
          </NavLink>
        </li>
        <li>
          <NavLink to="/campaigns" onClick={onClose}>
            <Megaphone size={18} /> Campaign Manager
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" onClick={onClose}>
            <Settings size={18} /> Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
