import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Divider } from 'react-native-paper';
import config from '../../server/config/config';
import AppBar from '../design/AppBar';

const ViewEvent = ({ route, navigation }) => {
  const [event] = useState(route.params.event);

  const handleEdit = () => {
    navigation.navigate('Edit Event', { 
      eventId: event._id,
    });
  };

  return (
    <View style={styles.container}>
      <AppBar title="Event Details" onBackPress={() => navigation.goBack()} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Event Image */}
        <View style={styles.imageContainer}>
          <Image
            style={styles.eventImage}
            source={{ uri: `${config.address}${event.e_image}?${Date.now()}` }}
            resizeMode="cover"
          />
        </View>

        {/* Event Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.eventTitle}>{event.e_title}</Text>
          
          <DetailItem icon="📍" label="Location" value={event.e_location} />
          <DetailItem icon="📅" label="Date" value={new Date(event.e_date).toDateString()} />
          
          <Divider style={styles.divider} />
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.descriptionText}>{event.e_description}</Text>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
});

export default ViewEvent;