import React, { useRef, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const CampaignCarousel = ({ campaigns }) => {
  const scrollRef = useRef(null);
  let scrollX = 0;
  let direction = 1;

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollX += direction * width * 0.8;

        if (scrollX >= campaigns.length * (width * 0.8)) {
          scrollX = 0; // reset scroll
        }

        scrollRef.current.scrollTo({ x: scrollX, animated: true });
      }
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [campaigns]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled={false}
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
    width: width * 0.8,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  image: {
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    color: '#666',
    fontSize: 13,
  },
});

export default CampaignCarousel;
