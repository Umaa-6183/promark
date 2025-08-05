// mobile_app/promark-mobile/App.js

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, ScrollView,
  StyleSheet, ActivityIndicator, Alert, SafeAreaView
} from 'react-native';
import Constants from 'expo-constants';
import CampaignCarousel from './components/CampaignCarousel';
import RewardModal from './components/RewardModal';

const API_BASE = Constants.expoConfig.extra.API_BASE;

export default function App() {
  const [form, setForm] = useState({
    name: '', phone: '', transaction_id: '', purchased_item: '', future_interest: ''
  });
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [predictedAd, setPredictedAd] = useState(null);
  const [showReward, setShowReward] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${API_BASE}/campaigns`);
      const data = await res.json();
      setCampaigns(data);
    } catch (error) {
      console.log("❌ Campaign Fetch Error:", error.message);
      Alert.alert('Network Error', 'Could not fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const empty = Object.values(form).some(f => !f.trim());
    if (empty) return Alert.alert("Please fill out all fields");

    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          future_interest: form.future_interest.split(',').map(i => i.trim())
        })
      });

      const result = await res.json();

      if (res.ok) {
        setPredictedAd({
          title: result.predicted_ad,
          image: 'https://via.placeholder.com/300x150.png?text=' + encodeURIComponent(result.predicted_ad)
        });
        setShowReward(true);
      } else {
        Alert.alert('Error', result.detail || 'Something went wrong');
      }
    } catch (error) {
      console.log("❌ Feedback Submit Error:", error.message);
      Alert.alert("Network Error", "Could not submit feedback");
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

          <TextInput style={styles.input} placeholder="Your Name"
            value={form.name} onChangeText={text => setForm({ ...form, name: text })} />
          <TextInput style={styles.input} placeholder="Phone Number"
            value={form.phone} onChangeText={text => setForm({ ...form, phone: text })} />
          <TextInput style={styles.input} placeholder="Transaction ID"
            value={form.transaction_id} onChangeText={text => setForm({ ...form, transaction_id: text })} />
          <TextInput style={styles.input} placeholder="Purchased Item"
            value={form.purchased_item} onChangeText={text => setForm({ ...form, purchased_item: text })} />
          <TextInput style={styles.input} placeholder="Future Interest (comma-separated)"
            value={form.future_interest} onChangeText={text => setForm({ ...form, future_interest: text })} />

          <View style={{ marginTop: 10 }}>
            <Button title="🚀 Submit Feedback" onPress={handleSubmit} />
          </View>

          <Text style={styles.subheading}>🔥 Active Campaigns</Text>
          <CampaignCarousel campaigns={campaigns} />
        </ScrollView>
      )}

      <RewardModal
        visible={showReward}
        ad={predictedAd}
        onClose={() => setShowReward(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subheading: { fontSize: 18, marginTop: 20, fontWeight: 'bold' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10,
    marginVertical: 6, borderRadius: 5
  }
});
