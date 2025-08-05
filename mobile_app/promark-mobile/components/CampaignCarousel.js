import React, { useRef, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const CampaignCarousel = ({ campaigns }) => {
  const scrollRef = useRef(null);
  let scrollX = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && campaigns.length > 0) {
        scrollX += width * 0.85;

        if (scrollX >= campaigns.length * width * 0.85) {
          scrollX = 0;
        }

        scrollRef.current.scrollTo({ x: scrollX, animated: true });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [campaigns]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.carousel}
    >
      {campaigns.map((campaign) => (
        <View key={campaign.id} style={styles.card}>
          <Image source={{ uri: campaign.image_url }} style={styles.image} />
          <Text style={styles.title}>{campaign.title}</Text>
          <Text style={styles.description}>{campaign.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  carousel: {
    marginTop: 10,
  },
  card: {
    width: width * 0.85,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});

export default CampaignCarousel;
