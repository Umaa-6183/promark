import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, ScrollView, StyleSheet,
  ActivityIndicator, Alert, SafeAreaView
} from 'react-native';
import Constants from 'expo-constants';
import RewardModal from './components/RewardModal';
import CampaignCarousel from './components/CampaignCarousel';

const API_BASE = Constants.expoConfig.extra.API_BASE;

export default function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    transaction_id: '',
    purchased_item: '',
    future_interest: ''
  });
  const [predictedAd, setPredictedAd] = useState(null);
  const [showReward, setShowReward] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${API_BASE}/campaigns`);
      const data = await res.json();
      setCampaigns(data);
    } catch (error) {
      console.error('❌ Error fetching campaigns:', error.message);
      Alert.alert('Network error', 'Unable to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    const { name, phone, transaction_id, purchased_item, future_interest } = form;

    if (!name || !phone || !transaction_id || !purchased_item || !future_interest) {
      Alert.alert('All fields are required');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          future_interest: future_interest.split(',').map(s => s.trim()),
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setPredictedAd({
          title: result.predicted_ad,
          image: result.ad_image || 'https://via.placeholder.com/200x100.png?text=Ad',
        });
        setShowReward(true);
      } else {
        console.error('Prediction error:', result);
        Alert.alert('Error', result.detail || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submit error:', error.message);
      Alert.alert('Network error');
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>📋 SmartAdX Feedback</Text>

          <TextInput style={styles.input} placeholder="Your Name" value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })} />
          <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad"
            value={form.phone} onChangeText={(text) => setForm({ ...form, phone: text })} />
          <TextInput style={styles.input} placeholder="Transaction ID" value={form.transaction_id}
            onChangeText={(text) => setForm({ ...form, transaction_id: text })} />
          <TextInput style={styles.input} placeholder="Purchased Item" value={form.purchased_item}
            onChangeText={(text) => setForm({ ...form, purchased_item: text })} />
          <TextInput style={styles.input} placeholder="Future Interest (comma-separated)"
            value={form.future_interest} onChangeText={(text) => setForm({ ...form, future_interest: text })} />

          <View style={{ marginTop: 10 }}>
            <Button title="🚀 Submit Feedback" onPress={submitFeedback} />
          </View>

          <Text style={styles.subheading}>🔥 Active Campaigns</Text>
          <CampaignCarousel campaigns={campaigns} />
        </ScrollView>
      )}

      <RewardModal visible={showReward} onClose={() => setShowReward(false)} ad={predictedAd} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 6,
    borderRadius: 5,
  },
});
