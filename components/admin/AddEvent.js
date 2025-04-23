import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import config from '../../server/config/config';
import AppBar from '../design/AppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const AddEvent = ({ navigation }) => {
  const [formData, setFormData] = useState({
    e_title: '',
    e_location: '',
    e_date: '',
    e_description: '',
    e_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      setToken(storedToken);
    };
    loadToken();
  }, []);

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
    formDataToSend.append('e_date', `${formData.e_date}T00:00:00`);
    formDataToSend.append('e_description', formData.e_description);

    if (formData.e_image) {
      formDataToSend.append('e_image', {
        uri: formData.e_image.uri,
        type: 'image/jpeg',
        name: 'event_image.jpg',
      });
    }

    try {
      const response = await axios.post(
        `${config.address}/api/events/new`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      Alert.alert('Success', 'Event created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Create error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <AppBar title="Add New Event" onBackPress={() => navigation.goBack()} />

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
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <MaterialIcons name="add-a-photo" size={28} color="#ff69b4" />
          <Text style={styles.imageButtonText}>Select Image</Text>
        </TouchableOpacity>

        {formData.e_image && (
          <Image source={{ uri: formData.e_image.uri }} style={styles.imagePreview} />
        )}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Create Event</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  formContainer: { padding: 20, margin: 20, backgroundColor: 'white', elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,borderRadius: 12, },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ff69b4',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  imageButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 2,
  },
  submitButton: {
    backgroundColor: '#ff69b4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#ff69b4',
  },
});

export default AddEvent;
