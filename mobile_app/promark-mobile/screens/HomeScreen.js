// mobile_app/promark-mobile/screens/HomeScreen.js

import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import FeedbackForm from '../components/FeedbackForm';
import RewardModal from '../components/RewardModal';
import CampaignCarousel from '../components/CampaignCarousel';

const HomeScreen = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async (formData) => {
    const response = await fetch('http://<YOUR_BACKEND_URL>/submit-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (data.campaign) {
      setNewCampaign(data.campaign);
      setCampaigns((prev) => [data.campaign, ...prev]);
      setModalVisible(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <FeedbackForm onSubmit={handleSubmit} />
      <CampaignCarousel campaigns={campaigns} />
      <RewardModal
        visible={modalVisible}
        campaign={newCampaign}
        onSave={() => setModalVisible(false)}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
};

export default HomeScreen;
