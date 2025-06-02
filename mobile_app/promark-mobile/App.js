import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Constants from 'expo-constants';

const API_BASE = 'http://192.168.X.X:8000';
 // Replace this with your local IP

export default function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [impressions, setImpressions] = useState('');
  const [duration, setDuration] = useState('');
  const [prediction, setPrediction] = useState('');

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${API_BASE}/campaigns`);
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFeedback = async (campaignId, feedback) => {
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaign_id: campaignId, feedback }),
      });
      const data = await res.json();
      console.log('Feedback response:', data);
      Alert.alert('Feedback Sent', `Feedback: ${feedback}`);
    } catch (error) {
      console.error('Error sending feedback:', error);
      Alert.alert('Error', 'Failed to send feedback.');
    }
  };

  const handlePredict = async () => {
    try {
      const res = await fetch(`${API_BASE}/predict-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          impressions: parseInt(impressions),
          duration: parseInt(duration),
        }),
      });
      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err) {
      console.log("Prediction error:", err);
      Alert.alert("Error", "Prediction failed.");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => sendFeedback(item.id, 'like')}>
          <Text style={styles.feedbackBtn}>👍 Like</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => sendFeedback(item.id, 'dislike')}>
          <Text style={styles.feedbackBtn}>👎 Dislike</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📣 Campaigns</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0066cc" />
      ) : (
        <FlatList
          data={campaigns}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}

      <Text style={styles.section}>🤖 Predict Feedback</Text>

      <TextInput
        placeholder="Impressions"
        keyboardType="numeric"
        value={impressions}
        onChangeText={setImpressions}
        style={styles.input}
      />
      <TextInput
        placeholder="Duration (days)"
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
        style={styles.input}
      />
      <TouchableOpacity style={styles.predictBtn} onPress={handlePredict}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Predict</Text>
      </TouchableOpacity>

      {prediction && (
        <Text style={styles.predictionText}>
          🎯 Predicted Feedback: <Text style={{ fontWeight: 'bold' }}>{prediction}</Text>
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: Constants.statusBarHeight, padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  card: { padding: 15, marginVertical: 8, backgroundColor: '#f0f0f0', borderRadius: 8 },
  title: { fontSize: 18, fontWeight: '600' },
  status: { fontSize: 14, color: '#555' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  feedbackBtn: { fontSize: 16, color: '#007BFF', paddingHorizontal: 10 },
  section: { fontSize: 20, marginTop: 30, marginBottom: 10, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 6 },
  predictBtn: { backgroundColor: '#28a745', padding: 10, borderRadius: 5 },
  predictionText: { marginTop: 10, fontSize: 16, color: '#333' },
});
