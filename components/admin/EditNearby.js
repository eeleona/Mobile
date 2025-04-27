import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Divider } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import config from '../../server/config/config';
import AppBar from '../design/AppBar';

const EditNearby = ({ route, navigation }) => {
  const { serviceId } = route.params;
  const [serviceDetails, setServiceDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    ns_name: '',
    ns_address: '',
    ns_pin: '',
    ns_type: '',
  });

  useEffect(() => {
    fetchServiceDetails();
  }, []);

  const fetchServiceDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Not authenticated. Please login.');
        navigation.navigate('Login');
        return;
      }

      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        Alert.alert('Error', 'Session expired. Please login again.');
        await AsyncStorage.removeItem('authToken');
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get(`${config.address}/api/service/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setServiceDetails(response.data);
      setFormData({
        ns_name: response.data.ns_name,
        ns_address: response.data.ns_address,
        ns_pin: response.data.ns_pin,
        ns_type: response.data.ns_type,
      });
    } catch (error) {
      console.error('Error fetching service details:', error);
      Alert.alert('Error', 'Failed to fetch service details.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Not authenticated. Please login.');
        navigation.navigate('Login');
        return;
      }

      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        Alert.alert('Error', 'Session expired. Please login again.');
        await AsyncStorage.removeItem('authToken');
        navigation.navigate('Login');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('ns_name', formData.ns_name);
      formDataToSend.append('ns_address', formData.ns_address);
      formDataToSend.append('ns_pin', formData.ns_pin);
      formDataToSend.append('ns_type', formData.ns_type);

      await axios.put(`${config.address}/api/service/update/${serviceId}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Service details updated successfully.');
      setIsEditing(false);
      fetchServiceDetails();
    } catch (error) {
      console.error('Error updating service:', error);
      Alert.alert('Error', 'Failed to update service details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF69C4" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <AppBar />
      
      <View style={styles.formContainer}>
        <Text style={styles.header}>Edit Nearby Service</Text>
        <Divider style={styles.sectionDivider} />

        {/* Service Name */}
        <Text style={styles.label}>Service Name:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={formData.ns_name}
            onChangeText={(text) => setFormData({ ...formData, ns_name: text })}
          />
        ) : (
          <Text style={styles.text}>{formData.ns_name}</Text>
        )}

        {/* Address */}
        <Text style={styles.label}>Address:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={formData.ns_address}
            onChangeText={(text) => setFormData({ ...formData, ns_address: text })}
          />
        ) : (
          <Text style={styles.text}>{formData.ns_address}</Text>
        )}

        {/* Google Maps Link */}
        <Text style={styles.label}>Google Maps Link:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={formData.ns_pin}
            onChangeText={(text) => setFormData({ ...formData, ns_pin: text })}
          />
        ) : (
          <Text style={styles.text}>{formData.ns_pin}</Text>
        )}

        {/* Service Type */}
        <Text style={styles.label}>Service Type:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={formData.ns_type}
            onChangeText={(text) => setFormData({ ...formData, ns_type: text })}
          />
        ) : (
          <Text style={styles.text}>{formData.ns_type}</Text>
        )}

        {/* Edit/Save Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={isEditing ? handleSaveChanges : handleEditToggle}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Save Changes' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF69C4',
    marginBottom: 12,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    margin: 15,
  },
  sectionDivider: {
    marginBottom: 18,
    backgroundColor: '#eee',
    height: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  editButton: {
    backgroundColor: '#cad47c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditNearby;