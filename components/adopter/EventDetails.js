import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { Divider } from 'react-native-paper';
import axios from 'axios';
import config from '../../server/config/config';
import AppBar from '../design/AppBar';

const EventDetails = ({ route, navigation }) => {
  const [event, setEvent] = useState(route.params?.event || null);
  const [loading, setLoading] = useState(!route.params?.event);

  useEffect(() => {
    if (!route.params?.event && route.params?.eventId) {
      const fetchEventDetails = async () => {
        try {
          const response = await axios.get(`${config.address}/api/events/${route.params.eventId}`);
          setEvent(response.data);
        } catch (error) {
          console.error('Error fetching event details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchEventDetails();
    }
  }, [route.params]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff69b4" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <AppBar title="Event Details" onBackPress={() => navigation.goBack()} />
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="default" />
      <AppBar title="Event Details" onBackPress={() => navigation.goBack()} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.eventImage}
            source={
              event.e_image 
                ? { uri: `${config.address}${event.e_image}?${Date.now()}` }
                : require('../../assets/Images/nobglogo.png')
            }
            resizeMode="cover"
          />
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.eventTitle}>{event.e_title}</Text>
          
          <DetailItem icon="📍" label="Location" value={event.e_location} />
          <DetailItem 
            icon="📅" 
            label="Date" 
            value={new Date(event.e_date).toLocaleString()} 
          />
          
          <Divider style={styles.divider} />
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.descriptionText}>
              {event.e_description || 'No description available'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailIcon}>{icon}</Text>
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  eventImage: {
    width: '100%',
    height: 250,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff69b4',
    marginBottom: 16,
    fontFamily: 'Inter_700Bold',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter_500Medium',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Inter_400Regular',
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#eee',
    height: 1,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionLabel: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter_500Medium',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default EventDetails;