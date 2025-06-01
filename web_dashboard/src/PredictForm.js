import React, { useState } from 'react';
import { predictFeedback } from './api';

const PredictForm = () => {
  const [form, setForm] = useState({ impressions: '', duration: '' });
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    const res = await predictFeedback({
      impressions: parseInt(form.impressions),
      duration: parseInt(form.duration)
    });
    setResult(res.prediction);
  };

  return (
    <div className="p-4 border mt-8 bg-gray-50 rounded">
      <h3 className="font-semibold text-lg mb-2">🤖 Predict Campaign Feedback</h3>
      <input type="number" placeholder="Impressions"
        value={form.impressions}
        onChange={(e) => setForm({ ...form, impressions: e.target.value })}
        className="border p-2 mr-2" />
      <input type="number" placeholder="Duration (days)"
        value={form.duration}
        onChange={(e) => setForm({ ...form, duration: e.target.value })}
        className="border p-2 mr-2" />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
        Predict
      </button>
      {result && <p className="mt-2 text-green-600 font-bold">Prediction: {result}</p>}
    </div>
  );
};

export default PredictForm;
