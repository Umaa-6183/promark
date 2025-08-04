import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = width * 0.05;

const CampaignCarousel = ({ campaigns }) => {
  const listRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (campaigns.length === 0 || !listRef.current) return;
      const nextIndex = (currentIndex + 1) % campaigns.length;
      listRef.current.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, campaigns]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      {item.description && <Text style={styles.desc}>{item.description}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={campaigns}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH + SPACING,
          offset: (CARD_WIDTH + SPACING) * index,
          index,
        })}
        style={{ overflow: 'visible' }}
      />
    </View>
  );
};

export default CampaignCarousel;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  card: {
    width: CARD_WIDTH,
    marginHorizontal: SPACING / 2,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  desc: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    marginTop: 4,
  },
});
