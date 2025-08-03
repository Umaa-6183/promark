// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import FeedbackLog from './pages/FeedbackLog';
import CampaignManager from './pages/CampaignManager';
import Settings from './pages/Settings';
import './App.css'; // Main layout styles

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/feedback-log" element={<FeedbackLog />} />
            <Route path="/campaigns" element={<CampaignManager />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
