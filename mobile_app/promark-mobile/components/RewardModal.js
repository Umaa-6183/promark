import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

export default function RewardModal({ visible, onClose, predictedAd }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>🎉 Thank You!</Text>
          <Text style={styles.text}>You've earned 50 SmartPoints</Text>
          <Text style={styles.text}>Use code <Text style={styles.code}>SMART50</Text> for 10% OFF</Text>

          {/* 🔥 Personalized Prediction Message */}
          {predictedAd && (
            <Text style={styles.prediction}>
              🎯 Personalized Ad Recommendation: {predictedAd}
            </Text>
          )}

          <Button title="Close" onPress={onClose} color="#2196F3" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  code: {
    fontWeight: 'bold',
    color: '#e91e63',
  },
  prediction: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#4caf50',
    textAlign: 'center',
  },
});
