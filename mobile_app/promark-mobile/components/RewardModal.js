import React from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const RewardModal = ({ visible, onClose, ad }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>🎉 You've Earned Rewards!</Text>
          <Text style={styles.points}>+50 Points</Text>
          <Text style={styles.adText}>Special Offer for: <Text style={{ fontWeight: 'bold' }}>{ad}</Text></Text>

          <Image
            source={{ uri: `https://via.placeholder.com/300x150.png?text=${encodeURIComponent(ad)}` }}
            style={styles.adImage}
          />

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Awesome!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RewardModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: '#fff', padding: 25,
    borderRadius: 10, width: '85%', alignItems: 'center'
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  points: { fontSize: 18, color: '#28a745', fontWeight: 'bold', marginBottom: 10 },
  adText: { fontSize: 16, marginBottom: 10, textAlign: 'center' },
  adImage: { width: '100%', height: 120, borderRadius: 8, marginBottom: 15 },
  button: {
    backgroundColor: '#007bff', paddingVertical: 10,
    paddingHorizontal: 25, borderRadius: 6
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
