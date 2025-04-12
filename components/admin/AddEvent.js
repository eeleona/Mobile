import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image, 
  ActivityIndicator, 
  Alert,
  Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import config from '../../server/config/config';
import { useAuth } from '../context/AuthContext';

const AddEvent = ({ navigation }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    e_title: '',
    e_location: '',
    e_date: '',
    e_description: '',
    e_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setFormData({ ...formData, e_image: result.assets[0] });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const validateEvent = () => {
    if (!formData.e_title.trim()) {
      Alert.alert('Error', 'Event title is required');
      return false;
    }
    if (!formData.e_date.trim()) {
      Alert.alert('Error', 'Event date is required');
      return false;
    }
    if (!formData.e_description.trim()) {
      Alert.alert('Error', 'Event description is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEvent()) return;
    if (!token) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('e_title', formData.e_title);
    formDataToSend.append('e_location', formData.e_location);
    formDataToSend.append('e_date', formData.e_date);
    formDataToSend.append('e_description', formData.e_description);
    
    if (formData.e_image) {
      formDataToSend.append('e_image', {
        uri: formData.e_image.uri,
        type: 'image/jpeg',
        name: 'event_image.jpg'
      });
    }

    try {
      const response = await axios.post(
        `${config.address}/api/events/new`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data) {
        Alert.alert('Success', 'Event created successfully');
        setFormData({
          e_title: '',
          e_location: '',
          e_date: '',
          e_description: '',
          e_image: null,
        });
        setShowModal(false);
        navigation.goBack();
      }
    } catch (error) {
      let errorMessage = 'Failed to create event';
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Create New Event</Text>

        <TextInput
          placeholder="Event Title *"
          value={formData.e_title}
          onChangeText={(text) => handleInputChange('e_title', text)}
          style={styles.input}
        />

        <TextInput
          placeholder="Location"
          value={formData.e_location}
          onChangeText={(text) => handleInputChange('e_location', text)}
          style={styles.input}
        />

        <TextInput
          placeholder="Date (YYYY-MM-DD) *"
          value={formData.e_date}
          onChangeText={(text) => handleInputChange('e_date', text)}
          style={styles.input}
        />

        <TextInput
          placeholder="Description *"
          value={formData.e_description}
          onChangeText={(text) => handleInputChange('e_description', text)}
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity 
          onPress={pickImage} 
          style={styles.imageButton}
        >
          <Text style={styles.imageButtonText}>
            {formData.e_image ? 'Change Image' : 'Select Image'}
          </Text>
        </TouchableOpacity>

        {formData.e_image && (
          <Image 
            source={{ uri: formData.e_image.uri }} 
            style={styles.previewImage} 
            resizeMode="cover"
          />
        )}

        <TouchableOpacity 
          onPress={handleSubmit} 
          style={[styles.submitButton, loading && styles.disabledButton]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Create Event</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#FF66C4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddEvent;