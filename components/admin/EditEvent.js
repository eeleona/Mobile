import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';

const EditEvent = ({ route, navigation }) => {
  const { eventId, onUpdate } = route.params; // Changed from onGoBack to onUpdate
  const [eventDetails, setEventDetails] = useState(null);
  const [formData, setFormData] = useState({
    e_title: '',
    e_location: '',
    e_date: '',
    e_description: '',
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`${config.address}/api/events/all?t=${Date.now()}`);
        const event = response.data.theEvent.find(e => e._id === eventId);
        
        if (event) {
          setEventDetails(event);
          setFormData({
            e_title: event.e_title,
            e_location: event.e_location,
            e_date: event.e_date,
            e_description: event.e_description,
          });
          setImage(`${config.address}${event.e_image}?${Date.now()}`);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        Alert.alert('Error', 'Failed to load event details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    return (
      formData.e_title &&
      formData.e_location &&
      formData.e_date &&
      formData.e_description
    );
  };

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Token error:', error);
      return null;
    }
  };

  const handleSaveEvent = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const token = await getToken();
    if (!token) {
      Alert.alert('Error', 'Authentication required');
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append('e_title', formData.e_title);
    data.append('e_location', formData.e_location);
    data.append('e_date', formData.e_date);
    data.append('e_description', formData.e_description);

    if (image && image.startsWith('file://')) {
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      data.append('e_image', {
        uri: image,
        name: filename,
        type,
      });
    }

    try {
      const response = await axios.put(
        `${config.address}/api/events/update/${eventId}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data?.theUpdateEvent) {
        const updatedEvent = response.data.theUpdateEvent;
        
        // Update local state
        setEventDetails(updatedEvent);
        setFormData({
          e_title: updatedEvent.e_title,
          e_location: updatedEvent.e_location,
          e_date: updatedEvent.e_date,
          e_description: updatedEvent.e_description,
        });
        
        if (updatedEvent.e_image) {
          setImage(`${config.address}${updatedEvent.e_image}?${Date.now()}`);
        }

        Alert.alert('Success', 'Event updated successfully!', [
          { 
            text: 'OK', 
            onPress: () => {
              // Call the update callback if provided
              if (onUpdate) {
                onUpdate(updatedEvent);
              }
              
              // Navigate back with the updated event
              navigation.navigate({
                name: 'View Event', 
                params: { 
                  event: updatedEvent,
                  refresh: Date.now() 
                },
                merge: true
              });
            }
          }
        ]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Update error:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update event'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading event details...</Text>
      </View>
    );
  }

  if (!eventDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Event not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar />
      <View style={styles.formContainer}>
        <Text style={styles.label}>Event Name:</Text>
        <TextInput
          style={styles.input}
          value={formData.e_title}
          onChangeText={(text) => handleInputChange('e_title', text)}
        />

        <Text style={styles.label}>Location:</Text>
        <TextInput
          style={styles.input}
          value={formData.e_location}
          onChangeText={(text) => handleInputChange('e_location', text)}
        />

        <Text style={styles.label}>Date and Time:</Text>
        <TextInput
          style={styles.input}
          value={formData.e_date}
          onChangeText={(text) => handleInputChange('e_date', text)}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.e_description}
          onChangeText={(text) => handleInputChange('e_description', text)}
          multiline
        />

        <Text style={styles.label}>Event Image:</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePickerText}>Select Image</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
          onPress={handleSaveEvent}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  imagePicker: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  imagePickerText: {
    color: '#666',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditEvent;