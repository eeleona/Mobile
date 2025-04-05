import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ScrollView, Dimensions, Image, StyleSheet } from 'react-native';
import axios from 'axios';

import AppBar from '../design/AppBar';

const { width } = Dimensions.get('window'); // Get the screen width

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    { id: 1, title: 'Slide 1', image: 'https://via.placeholder.com/300x150' },
    { id: 2, title: 'Slide 2', image: 'https://via.placeholder.com/300x150' },
    { id: 3, title: 'Slide 3', image: 'https://via.placeholder.com/300x150' },
  ];

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / width);
    setActiveIndex(currentIndex);
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://192.168.0.110:8000/api/feedback'); // Replace with your API endpoint
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };
    fetchFeedbacks();
  }, []);

  const renderFeedback = ({ item }) => (
    <View style={styles.feedbackContainer}>
      <View style={styles.feedbackHeader}>
        <Text style={styles.username}>{item.adopterUsername}</Text>
        <StarRating
          rating={item.feedbackRating}
          starSize={20}
          color="gold"
          onChange={() => {}} // No-op since this is for display only
        />
      </View>
      <Text style={styles.feedbackText}>{item.feedbackText}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppBar></AppBar>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <Image source={{ uri: slide.image }} style={styles.image} />
            <Text style={styles.title}>{slide.title}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot, // Highlight the active dot
            ]}
          />
        ))}
      </View>
      
      <FlatList
        data={feedbacks}
        renderItem={renderFeedback}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No feedbacks found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  slide: {
    width: width, // Set the width of each slide to the screen width
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: '90%',
    height: 150,
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#ff69b4', // Highlighted color for the active dot
  },
  listContainer: {
    paddingBottom: 20,
  },
  feedbackContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  feedbackText: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Feedbacks;