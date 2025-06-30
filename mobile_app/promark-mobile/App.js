import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, FlatList,
  StyleSheet, ScrollView, ActivityIndicator, Alert
} from 'react-native';

const API_BASE = 'https://promark-backend.onrender.com';

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

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${API_BASE}/campaigns`);
      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
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
        setPredictedAd(result.predicted_ad);
        Alert.alert('✅ Feedback Submitted', `📢 Predicted Ad: ${result.predicted_ad}`);
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📋 SmartAdX Feedback Form</Text>

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

      {predictedAd && (
        <View style={styles.result}>
          <Text style={styles.prediction}>📢 Predicted Ad: {predictedAd}</Text>
        </View>
      )}

      <Text style={styles.subheading}>📣 Campaigns</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0066cc" />
      ) : (
        <FlatList
          data={campaigns}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.campaignTitle}>{item.name}</Text>
              <Text style={styles.status}>Status: {item.status}</Text>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subheading: { fontSize: 18, marginTop: 20, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 6,
    borderRadius: 5
  },
  result: {
    marginVertical: 12,
    padding: 10,
    backgroundColor: '#e3f7e3',
    borderRadius: 6
  },
  prediction: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold'
  },
  card: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 6
  },
  campaignTitle: { fontSize: 16, fontWeight: 'bold' },
  status: { fontSize: 14, color: '#666' },
});
