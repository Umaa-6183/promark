import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

import Dashboard from './pages/Dashboard';
import FeedbackLog from './pages/FeedbackLog';
import CampaignManager from './pages/CampaignManager';
import Settings from './pages/Settings';

import './styles/App.css'; // optional global styles

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // set to false if you want it closed by default

  return (
    <Router>
      <div className="app">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-content">
          <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/feedback-log" element={<FeedbackLog />} />
              <Route path="/campaigns" element={<CampaignManager />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
