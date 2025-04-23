import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import config from '../../server/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const AddStaff = ({ navigation }) => {
  const [formData, setFormData] = useState({
    s_fname: '',
    s_lname: '',
    s_mname: '',
    s_add: '',
    s_contactnumber: '',
    s_position: '',
    s_gender: '',
    s_birthdate: '',
    s_email: ''
  });
  const [loading, setLoading] = useState(false);

  const verifyAdminAccess = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Login Required', 'Admin access required. Please log in.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
        return false;
      }

      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        await AsyncStorage.removeItem('authToken');
        Alert.alert('Session Expired', 'Your session has expired. Please log in again.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
        return false;
      }

      if (!['admin', 'super-admin'].includes(decodedToken.role)) {
        Alert.alert('Access Denied', 'Only administrators can perform this action.');
        return false;
      }

      return token;
    } catch (error) {
      console.error('Error verifying access:', error);
      Alert.alert('Error', 'Failed to verify permissions');
      return false;
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = await verifyAdminAccess();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${config.address}/api/staff/new`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Staff member added successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding staff:', error);
      Alert.alert('Error', 'Failed to add staff member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Staff</Text>
      
      <TextInput
        label="First Name"
        value={formData.s_fname}
        onChangeText={(text) => handleInputChange('s_fname', text)}
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Last Name"
        value={formData.s_lname}
        onChangeText={(text) => handleInputChange('s_lname', text)}
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Middle Name"
        value={formData.s_mname}
        onChangeText={(text) => handleInputChange('s_mname', text)}
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Address"
        value={formData.s_add}
        onChangeText={(text) => handleInputChange('s_add', text)}
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Contact Number"
        value={formData.s_contactnumber}
        onChangeText={(text) => handleInputChange('s_contactnumber', text)}
        style={styles.input}
        mode="outlined"
        keyboardType="phone-pad"
      />
      
      <TextInput
        label="Position"
        value={formData.s_position}
        onChangeText={(text) => handleInputChange('s_position', text)}
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Gender"
        value={formData.s_gender}
        onChangeText={(text) => handleInputChange('s_gender', text)}
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Birthdate"
        value={formData.s_birthdate}
        onChangeText={(text) => handleInputChange('s_birthdate', text)}
        style={styles.input}
        mode="outlined"
        placeholder="YYYY-MM-DD"
      />
      
      <TextInput
        label="Email"
        value={formData.s_email}
        onChangeText={(text) => handleInputChange('s_email', text)}
        style={styles.input}
        mode="outlined"
        keyboardType="email-address"
      />
      
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Staff'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FAF9F6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2a2a2a',
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: '#ff69b4',
  },
});

export default AddStaff;