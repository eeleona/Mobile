import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Divider } from 'react-native-paper';
import axios from 'axios';
import config from '../../server/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import AppBar from '../design/AppBar';
import { MaterialIcons } from '@expo/vector-icons';

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
    <ScrollView style={styles.container}>
      <AppBar title="Add New Staff" onBackPress={() => navigation.goBack()} />

      <View style={styles.formContainer}>
      <Text style={styles.title}>Add New Staff</Text>
      <Divider style={styles.rowDivider} />
        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color="#ff69b4" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={formData.s_fname}
            onChangeText={(text) => handleInputChange('s_fname', text)}
            placeholder="First Name *"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color="#ff69b4" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={formData.s_lname}
            onChangeText={(text) => handleInputChange('s_lname', text)}
            placeholder="Last Name *"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color="#ff69b4" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={formData.s_mname}
            onChangeText={(text) => handleInputChange('s_mname', text)}
            placeholder="Middle Name"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="location-on" size={24} color="#ff69b4" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={formData.s_add}
            onChangeText={(text) => handleInputChange('s_add', text)}
            placeholder="Address"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="phone" size={24} color="#ff69b4" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={formData.s_contactnumber}
            onChangeText={(text) => handleInputChange('s_contactnumber', text)}
            placeholder="Contact Number"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="work" size={24} color="#ff69b4" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={formData.s_position}
            onChangeText={(text) => handleInputChange('s_position', text)}
            placeholder="Position *"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="wc" size={24} color="#ff69b4" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={formData.s_gender}
            onChangeText={(text) => handleInputChange('s_gender', text)}
            placeholder="Gender"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="cake" size={24} color="#ff69b4" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={formData.s_birthdate}
            onChangeText={(text) => handleInputChange('s_birthdate', text)}
            placeholder="Birthdate (YYYY-MM-DD)"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="#ff69b4" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={formData.s_email}
            onChangeText={(text) => handleInputChange('s_email', text)}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Add Staff</Text>
          )}
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
  formContainer: {
    padding: 20,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rowDivider: {
    backgroundColor: '#eee',
    height: 1,
    marginVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff69b4',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#ff69b4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
});

export default AddStaff;