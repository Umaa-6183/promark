import React, { useState } from 'react';
import './CampaignManager.css';

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState([
    { id: 1, title: 'Summer Sale', image: 'https://via.placeholder.com/150', audience: 'Teens' },
    { id: 2, title: 'Back to School', image: 'https://via.placeholder.com/150', audience: 'Students' },
  ]);

  const [form, setForm] = useState({ title: '', image: '', audience: '' });
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    const newCampaign = { ...form, id: Date.now() };
    setCampaigns([newCampaign, ...campaigns]);
    setForm({ title: '', image: '', audience: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setCampaigns(campaigns.filter((c) => c.id !== id));
  };

  return (
    <div className="campaign-manager">
      <h2>📢 Campaign Manager</h2>
      <button className="add-btn" onClick={() => setShowForm(!showForm)}>
        ➕ Add New Campaign
      </button>

      {showForm && (
        <div className="campaign-form">
          <input
            type="text"
            placeholder="Campaign Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <input
            type="text"
            placeholder="Target Audience"
            value={form.audience}
            onChange={(e) => setForm({ ...form, audience: e.target.value })}
          />
          <button onClick={handleAdd}>✅ Save Campaign</button>
        </div>
      )}

      <table className="campaign-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Image</th>
            <th>Audience</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id}>
              <td>{c.title}</td>
              <td><img src={c.image} alt="ad" width="80" /></td>
              <td>{c.audience}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(c.id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignManager;
