import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../server/config/config';
import { useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
import AuthContext from '../context/AuthContext';

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
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  let [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.s_fname) errors.s_fname = "First name is required";
    if (!formData.s_lname) errors.s_lname = "Last name is required";
    if (!formData.s_mname) errors.s_mname = "Middle name is required";
    if (!formData.s_add) errors.s_add = "Address is required";
    if (!formData.s_contactnumber) errors.s_contactnumber = "Contact number is required";
    if (!formData.s_position) errors.s_position = "Position is required";
    if (!formData.s_gender) errors.s_gender = "Gender is required";
    if (!formData.s_birthdate) errors.s_birthdate = "Birthdate is required";
    if (!formData.s_email) {
      errors.s_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.s_email)) {
      errors.s_email = "Email is invalid";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.post(`${config.address}/api/staff/new`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Add New Staff</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={[styles.input, formErrors.s_fname && styles.errorInput]}
            value={formData.s_fname}
            onChangeText={(text) => handleInputChange('s_fname', text)}
            placeholder="Enter first name"
          />
          {formErrors.s_fname && <Text style={styles.errorText}>{formErrors.s_fname}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={[styles.input, formErrors.s_lname && styles.errorInput]}
            value={formData.s_lname}
            onChangeText={(text) => handleInputChange('s_lname', text)}
            placeholder="Enter last name"
          />
          {formErrors.s_lname && <Text style={styles.errorText}>{formErrors.s_lname}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Middle Name</Text>
          <TextInput
            style={[styles.input, formErrors.s_mname && styles.errorInput]}
            value={formData.s_mname}
            onChangeText={(text) => handleInputChange('s_mname', text)}
            placeholder="Enter middle name"
          />
          {formErrors.s_mname && <Text style={styles.errorText}>{formErrors.s_mname}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radioButton, formData.s_gender === 'Male' && styles.radioSelected]}
              onPress={() => handleInputChange('s_gender', 'Male')}
            >
              <Text style={styles.radioText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, formData.s_gender === 'Female' && styles.radioSelected]}
              onPress={() => handleInputChange('s_gender', 'Female')}
            >
              <Text style={styles.radioText}>Female</Text>
            </TouchableOpacity>
          </View>
          {formErrors.s_gender && <Text style={styles.errorText}>{formErrors.s_gender}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Position</Text>
          <TextInput
            style={[styles.input, formErrors.s_position && styles.errorInput]}
            value={formData.s_position}
            onChangeText={(text) => handleInputChange('s_position', text)}
            placeholder="Enter position"
          />
          {formErrors.s_position && <Text style={styles.errorText}>{formErrors.s_position}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, formErrors.s_add && styles.errorInput]}
            value={formData.s_add}
            onChangeText={(text) => handleInputChange('s_add', text)}
            placeholder="Enter address"
            multiline
          />
          {formErrors.s_add && <Text style={styles.errorText}>{formErrors.s_add}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={[styles.input, formErrors.s_contactnumber && styles.errorInput]}
            value={formData.s_contactnumber}
            onChangeText={(text) => handleInputChange('s_contactnumber', text)}
            placeholder="Enter contact number"
            keyboardType="phone-pad"
          />
          {formErrors.s_contactnumber && <Text style={styles.errorText}>{formErrors.s_contactnumber}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Birthdate</Text>
          <TextInput
            style={[styles.input, formErrors.s_birthdate && styles.errorInput]}
            value={formData.s_birthdate}
            onChangeText={(text) => handleInputChange('s_birthdate', text)}
            placeholder="YYYY-MM-DD"
          />
          {formErrors.s_birthdate && <Text style={styles.errorText}>{formErrors.s_birthdate}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, formErrors.s_email && styles.errorInput]}
            value={formData.s_email}
            onChangeText={(text) => handleInputChange('s_email', text)}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {formErrors.s_email && <Text style={styles.errorText}>{formErrors.s_email}</Text>}
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Add Staff</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    padding: 20,
  },
  header: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#2a2a2a',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#2a2a2a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    backgroundColor: '#fff',
  },
  errorInput: {
    borderColor: '#ff4757',
  },
  errorText: {
    color: '#ff4757',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter_500Medium',
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: 8,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  radioSelected: {
    backgroundColor: '#ff69b4',
    borderColor: '#ff69b4',
  },
  radioText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#2a2a2a',
  },
  submitButton: {
    backgroundColor: '#ff69b4',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#fff',
  },
});

export default AddStaff;