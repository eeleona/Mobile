import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, parseISO } from 'date-fns';

const EditEvent = ({ route, navigation }) => {
  // Safely destructure with defaults
  const { 
    event: initialEvent = {}, 
    onGoBack = null 
  } = route.params || {};
  
  const [formData, setFormData] = useState({
    e_title: initialEvent.e_title || '',
    e_location: initialEvent.e_location || '',
    e_date: initialEvent.e_date ? format(parseISO(initialEvent.e_date), 'yyyy-MM-dd') : '',
    e_description: initialEvent.e_description || '',
  });
  
  const [imageUri, setImageUri] = useState(
    initialEvent.e_image ? `${config.address}${initialEvent.e_image}` : null
  );
  const [originalImage] = useState(
    initialEvent.e_image ? `${config.address}${initialEvent.e_image}` : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (!storedToken) {
          Alert.alert('Error', 'Authentication required');
          navigation.goBack();
          return;
        }
        setToken(storedToken);
      } catch (error) {
        console.error('Token error:', error);
        Alert.alert('Error', 'Failed to load authentication token');
      }
    };
    loadToken();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.e_title.trim()) {
      Alert.alert('Error', 'Event title is required');
      return false;
    }
    if (!formData.e_date.trim()) {
      Alert.alert('Error', 'Event date is required');
      return false;
    }
    return true;
  };

  const handleSaveEvent = async () => {
    if (!validateForm()) return;
    if (!token) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('e_title', formData.e_title);
      data.append('e_location', formData.e_location);
      data.append('e_date', `${formData.e_date}T00:00:00`);
      data.append('e_description', formData.e_description);

      if (imageUri && imageUri.startsWith('file://')) {
        data.append('e_image', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'event_image.jpg'
        });
      } else if (!imageUri && originalImage) {
        data.append('e_image', '');
      }

      const response = await axios.put(
        `${config.address}/api/events/update/${initialEvent._id}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const updatedEvent = response.data.theUpdateEvent || response.data.event;
      if (!updatedEvent) {
        throw new Error('Invalid response from server');
      }

      Alert.alert('Success', 'Event updated successfully');
      
      // Call the callback if it exists
      if (typeof onGoBack === 'function') {
        onGoBack(updatedEvent);
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Update error:', error);
      let errorMessage = 'Failed to update event';
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.statusText || 
                      `Server error: ${error.response.status}`;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <AppBar title="Edit Event" onBackPress={() => navigation.goBack()} />
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Event Title *</Text>
        <TextInput
          style={styles.input}
          value={formData.e_title}
          onChangeText={(text) => handleInputChange('e_title', text)}
          placeholder="Enter event title"
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={formData.e_location}
          onChangeText={(text) => handleInputChange('e_location', text)}
          placeholder="Enter location"
        />

        <Text style={styles.label}>Date *</Text>
        <TextInput
          style={styles.input}
          value={formData.e_date}
          onChangeText={(text) => handleInputChange('e_date', text)}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.e_description}
          onChangeText={(text) => handleInputChange('e_description', text)}
          placeholder="Enter description"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Event Image</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePickerText}>Select Image</Text>
          )}
        </TouchableOpacity>

        {imageUri && (
          <TouchableOpacity 
            style={styles.removeImageButton}
            onPress={() => setImageUri(null)}
          >
            <Text style={styles.removeImageText}>Remove Image</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSaveEvent}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginBottom: 10,
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
  removeImageButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  removeImageText: {
    color: '#F44336',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#FF66C4',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ff99d6',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditEvent;