import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet
} from 'react-native';
import RewardModal from './components/RewardModal';
import CampaignCarousel from './components/CampaignCarousel';

export default function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [purchasedItem, setPurchasedItem] = useState('');
  const [futureInterest, setFutureInterest] = useState('');
  const [rewardVisible, setRewardVisible] = useState(false);
  const [predictedAd, setPredictedAd] = useState('');
  const [campaigns, setCampaigns] = useState([]);

  // ✅ Fetch campaigns on mount
  useEffect(() => {
  fetch('https://promark.onrender.com/campaigns')
    .then((res) => res.json())
    .then((data) => {
      console.log('Fetched campaigns:', data);
      // Adapt to array or object automatically
      if (Array.isArray(data)) {
        setCampaigns(data);
      } else if (data.campaigns) {
        setCampaigns(data.campaigns);
      } else {
        setCampaigns([]);
      }
    })
    .catch((error) => {
      console.error('Failed to fetch campaigns:', error);
    });
}, []);


  const handleSubmit = async () => {
    if (!name || !phone || !transactionId || !purchasedItem || !futureInterest) {
      Alert.alert('Please fill all fields');
      return;
    }

    const payload = {
      name,
      phone,
      transaction_id: transactionId,
      purchased_item: purchasedItem,
      future_interest: futureInterest.split(',').map((item) => item.trim()),
    };

    try {
      const response = await fetch('https://promark.onrender.com/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.prediction) {
        setPredictedAd(data.prediction);
        setRewardVisible(true);

        // Reset form
        setName('');
        setPhone('');
        setTransactionId('');
        setPurchasedItem('');
        setFutureInterest('');
      } else {
        Alert.alert('Submission failed', data.message || 'Try again');
      }
    } catch (error) {
      console.error('Feedback submission failed:', error);
      Alert.alert('Error', 'Network or server issue. Try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>ProMark Feedback Form</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
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
          placeholder="Future Interests (comma-separated)"
          value={futureInterest}
          onChangeText={setFutureInterest}
        />

        <View style={styles.buttonContainer}>
          <Button title="Submit Feedback" onPress={handleSubmit} />
        </View>

        <Text style={styles.subtitle}>🎯 Active Campaigns</Text>
        <CampaignCarousel campaigns={campaigns} />
      </ScrollView>

      <RewardModal
        visible={rewardVisible}
        onClose={() => setRewardVisible(false)}
        predictedAd={predictedAd}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scroll: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 20,
    textAlign: 'center',
    color: '#444',
  },
});
