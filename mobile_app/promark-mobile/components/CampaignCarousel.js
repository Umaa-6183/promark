// mobile_app/promark-mobile/components/CampaignCarousel.js

import React from 'react';
import { View, Image, Text, ScrollView, StyleSheet } from 'react-native';

const CampaignCarousel = ({ campaigns }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
    {campaigns.map((item, idx) => (
      <View key={idx} style={styles.card}>
        <Image source={{ uri: item.image_url }} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>
      </View>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  carousel: { marginTop: 20 },
  card: { marginHorizontal: 10, backgroundColor: '#f2f2f2', borderRadius: 10, padding: 10, width: 250 },
  image: { width: '100%', height: 120, borderRadius: 10 },
  title: { fontWeight: 'bold', fontSize: 16, marginTop: 5 },
  desc: { color: '#444' },
});

export default CampaignCarousel;
