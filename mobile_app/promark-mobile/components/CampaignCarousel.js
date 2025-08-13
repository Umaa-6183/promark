import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const CampaignCarousel = ({ campaigns }) => {
  const flatListRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!campaigns || campaigns.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (index + 1) % campaigns.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setIndex(nextIndex);
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [index, campaigns]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image_url }}
        style={{ width: 300, height: 150, borderRadius: 10 }}
        resizeMode="cover"
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={campaigns}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        pagingEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  card: {
    width: width * 0.85,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 8,
  },
  desc: {
    fontSize: 14,
    color: '#555',
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
});

export default CampaignCarousel;
