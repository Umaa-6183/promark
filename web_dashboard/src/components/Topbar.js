// src/components/Topbar.js

import React from 'react';
import { Menu } from 'lucide-react';
import '../styles/Topbar.css';

const Topbar = ({ onMenuClick }) => {
  return (
    <div className="topbar">
      <div className="menu-icon" onClick={onMenuClick}>
        <Menu size={24} />
      </div>
      <div className="topbar-title">SmartAdX Dashboard</div>
    </div>
  );
};

export default Topbar;
