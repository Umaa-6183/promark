import React, { useEffect, useState } from 'react';
import { fetchCampaigns, createCampaign } from './api';
import Analytics from './Analytics';
import FeedbackChart from './FeedbackChart';
import PredictForm from './PredictForm';

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', status: '' });

  useEffect(() => {
    fetchCampaigns().then(setCampaigns);
  }, []);

  const handleCreate = async () => {
    await createCampaign({
      id: parseInt(form.id),
      name: form.name,
      status: form.status
    });
    fetchCampaigns().then(setCampaigns);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">ProMark Admin Dashboard</h1>

      <div className="mb-4">
        <h2 className="font-semibold">Create Campaign</h2>
        <input placeholder="ID" className="border p-1 mr-2"
          value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} />
        <input placeholder="Name" className="border p-1 mr-2"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Status" className="border p-1 mr-2"
          value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} />
        <button onClick={handleCreate} className="bg-green-500 text-white px-3 py-1 rounded">
          Create
        </button>
      </div>

      <h2 className="font-semibold mb-2">Campaigns</h2>
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map(c => (
            <tr key={c.id}>
              <td className="p-2 border">{c.id}</td>
              <td className="p-2 border">{c.name}</td>
              <td className="p-2 border">{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Analytics />
      <FeedbackChart />
      <PredictForm />
    </div>
  );
}

export default App;
