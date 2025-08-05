import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import RewardModal from './components/RewardModal';
import CampaignCarousel from './components/CampaignCarousel';
import Constants from 'expo-constants';
const apiBase = Constants.expoConfig.extra.API_BASE;

export default function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [purchasedItem, setPurchasedItem] = useState('');
  const [futureInterest, setFutureInterest] = useState('');
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  // Fetch campaigns from backend
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('https://promark.onrender.com/campaigns');
      const data = await res.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error.message);
      Alert.alert('Error', 'Unable to load campaigns');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!name || !phone || !transactionId || !purchasedItem || !futureInterest) {
      Alert.alert('Missing Fields', 'Please fill all the fields');
      return;
    }

    try {
      const response = await fetch('https://promark.onrender.com/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          transactionId,
          purchasedItem,
          futureInterest,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Submission failed');
      }

      const data = await response.json();
      console.log('✅ Feedback submitted:', data);
      setShowRewardModal(true);
    } catch (error) {
      console.log('❌ Submission error:', error.message);
      Alert.alert('Network Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.heading}>📝 SmartAdX Feedback</Text>

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="numeric"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Transaction ID"
        value={transactionId}
        onChangeText={setTransactionId}
      />
      <TextInput
        style={styles.input}
        placeholder="Purchased Item"
        value={purchasedItem}
        onChangeText={setPurchasedItem}
      />
      <TextInput
        style={styles.input}
        placeholder="Future Interest (comma-separated)"
        value={futureInterest}
        onChangeText={setFutureInterest}
      />

      <View style={styles.button}>
        <Button title="🚀 SUBMIT FEEDBACK" onPress={handleSubmit} color="#2196F3" />
      </View>

      <Text style={styles.sectionTitle}>🔥 Active Campaigns</Text>
      <CampaignCarousel campaigns={campaigns} />

      <RewardModal visible={showRewardModal} onClose={() => setShowRewardModal(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
