import React, { useState } from 'react';
import '../styles/Settings.css';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');

  const handleSave = () => {
    alert('✅ Preferences saved successfully!');
  };

  return (
    <div className="settings-page">
      <h2>⚙️ Settings</h2>

      <div className="setting-group">
        <label>🌙 Dark Mode:</label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </div>

      <div className="setting-group">
        <label>🔔 Enable Notifications:</label>
        <input
          type="checkbox"
          checked={notifications}
          onChange={() => setNotifications(!notifications)}
        />
      </div>

      <div className="setting-group">
        <label>🌐 Language:</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="es">Spanish</option>
        </select>
      </div>

      <button className="save-btn" onClick={handleSave}>💾 Save Preferences</button>
    </div>
  );
};

export default Settings;
