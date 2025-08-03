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
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      Alert.alert('❌ Network error', 'Unable to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (
      !form.name || !form.phone || !form.transaction_id ||
      !form.purchased_item || !form.future_interest
    ) {
      Alert.alert('All fields are required');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          future_interest: form.future_interest.split(',').map(item => item.trim())
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setPredictedAd({
          title: result.predicted_ad,
          image: result.ad_image || 'https://via.placeholder.com/200x100.png?text=Ad' // fallback
        });
        setShowReward(true);
      } else {
        console.error('Prediction error:', result);
        Alert.alert('Error', result.detail || 'Something went wrong');
      }

    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Network error');
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      {loading ? (
        <View style={[styles.container, { flex: 1, justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>📋 SmartAdX Feedback</Text>

          <TextInput
            placeholder="Your Name"
            style={styles.input}
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />
          <TextInput
            placeholder="Phone Number"
            keyboardType="phone-pad"
            style={styles.input}
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
          />
          <TextInput
            placeholder="Transaction ID"
            style={styles.input}
            value={form.transaction_id}
            onChangeText={(text) => setForm({ ...form, transaction_id: text })}
          />
          <TextInput
            placeholder="Purchased Item"
            style={styles.input}
            value={form.purchased_item}
            onChangeText={(text) => setForm({ ...form, purchased_item: text })}
          />
          <TextInput
            placeholder="Future Interest (comma-separated)"
            style={styles.input}
            value={form.future_interest}
            onChangeText={(text) => setForm({ ...form, future_interest: text })}
          />

          <View style={{ marginTop: 10 }}>
            <Button title="🚀 Submit Feedback" onPress={submitFeedback} />
          </View>

          <Text style={styles.subheading}>🔥 Active Campaigns</Text>

          <CampaignCarousel campaigns={campaigns} />

        </ScrollView>
      )}

      {/* 🎁 Reward Pop-up */}
      <RewardModal
        visible={showReward}
        onClose={() => setShowReward(false)}
        ad={predictedAd}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subheading: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 6,
    borderRadius: 5
  }
});
