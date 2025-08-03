// mobile_app/promark-mobile/components/FeedbackForm.js

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

const FeedbackForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    transactionId: '',
    product: '',
    interestedIn: '',
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Submit Feedback</Text>

      {Object.entries(form).map(([key, value]) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key === 'interestedIn' ? 'Interested in next? (e.g., iPad)' : key}
          value={value}
          onChangeText={(text) => handleChange(key, text)}
        />
      ))}

      <Button title="Submit & Earn Points" onPress={() => onSubmit(form)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15 },
  input: { backgroundColor: '#eee', padding: 10, marginVertical: 6, borderRadius: 5 },
  label: { fontSize: 18, marginBottom: 10 },
});

export default FeedbackForm;
