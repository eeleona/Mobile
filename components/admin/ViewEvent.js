import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Divider } from 'react-native-paper';
import config from '../../server/config/config';
import AppBar from '../design/AppBar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewEvent = ({ route, navigation }) => {
  const [event] = useState(route.params.event);
  const [eventData, setEventData] = useState(route.params.event);
  const [isDeleting, setIsDeleting] = useState(false);
  const [token, setToken] = useState(null);

  // Load token from AsyncStorage when component mounts
  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        setToken(storedToken);
      } catch (error) {
        console.error('Error getting token:', error);
        Alert.alert('Error', 'Failed to load authentication token');
      }
    };
    
    getToken();
  }, []);

  // In ViewEvent.js, modify the handleEdit function:
  const handleEdit = () => {
    navigation.navigate('Edit Event', { 
      event: eventData,
      onGoBack: (updatedEvent) => {
        if (updatedEvent) {
          setEventData(updatedEvent);
          Alert.alert('Success', 'Event updated successfully');
        }
      }
    });
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: confirmDelete, style: 'destructive' }
      ]
    );
  };

  const confirmDelete = async () => {
    if (!token) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`${config.address}/api/events/delete/${event._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      Alert.alert('Success', 'Event deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
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
          <DetailItem 
            icon="📅" 
            label="Date" 
            value={new Date(event.e_date).toLocaleString()} 
          />
          
          <Divider style={styles.divider} />
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.descriptionText}>{event.e_description}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.editButton]}
              onPress={handleEdit}
            >
              <Text style={styles.buttonText}>Edit Event</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Delete Event</Text>
              )}
            </TouchableOpacity>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#FF66C4',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ViewEvent;