import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import axios from 'axios';
import { Card, Title, Paragraph } from 'react-native-paper';
import config from '../../server/config/config';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${config.address}/api/feedback`);
      setFeedbacks(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const renderFeedbackItem = ({ item }) => (
    <Card style={styles.feedbackCard}>
      <Card.Content>
        <Title>{item.userName || 'Anonymous User'}</Title>
        <Paragraph>{item.feedbackText}</Paragraph>
        <Text style={styles.dateText}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        {item.rating && (
          <Text style={styles.ratingText}>
            Rating: {'⭐'.repeat(item.rating)}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF66C4" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading feedbacks: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {feedbacks.length === 0 ? (
        <View style={styles.centerContainer}>
          <Image 
            source={require('../../assets/Images/pawicon2.png')} 
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>No feedbacks yet.</Text>
        </View>
      ) : (
        <FlatList
          data={feedbacks}
          renderItem={renderFeedbackItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchFeedbacks}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    tintColor: '#FF66C4',
  },
  emptyText: {
    fontSize: 18,
    color: '#718096',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  feedbackCard: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  dateText: {
    fontSize: 12,
    color: '#718096',
    marginTop: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#FFD700',
    marginTop: 5,
  },
});

export default Feedbacks;