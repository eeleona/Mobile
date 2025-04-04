import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Divider } from 'react-native-paper';
import AppBar from '../design/AppBar';
import axios from 'axios';
import config from '../../server/config/config'; // Import your config for API address

const PendingAdoptionDetails = ({ route, navigation }) => {
  const { adoption } = route.params;
  const [loading, setLoading] = useState(false);

  // Handle Accept Adoption
  const handleAccept = async () => {
    try {
      setLoading(true);
      await axios.patch(`${config.address}${adoption._id}`, {
        visitDate: new Date().toISOString().split('T')[0], // Example: today's date
        visitTime: '10:00', // Example: fixed time
      });
      Alert.alert('Success', 'Adoption has been accepted.');
      navigation.goBack();
    } catch (error) {
      console.error('Error accepting adoption:', error);
      Alert.alert('Error', 'Failed to accept adoption.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Reject Adoption
  const handleReject = async () => {
    try {
      setLoading(true);
      await axios.patch(`${config.address}${adoption._id}`, {
        rejection_reason: 'Not Suitable', // Example: fixed reason
      });
      Alert.alert('Success', 'Adoption has been rejected.');
      navigation.goBack();
    } catch (error) {
      console.error('Error rejecting adoption:', error);
      Alert.alert('Error', 'Failed to reject adoption.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppBar title="Pending Adoption Details" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Pet Details */}
        <View style={styles.section}>
          <Text style={styles.title}>Pet Details</Text>
          {adoption.p_id?.pet_img?.[0] ? (
            <Image
              style={styles.petImage}
              source={{ uri: `${config.address}${adoption.p_id.pet_img[0]}` }}
            />
          ) : (
            <Text style={styles.noImageText}>No image available</Text>
          )}
          <Text style={styles.detail}>Name: {adoption.p_id?.p_name}</Text>
          <Text style={styles.detail}>Type: {adoption.p_id?.p_type}</Text>
          <Text style={styles.detail}>Breed: {adoption.p_id?.p_breed}</Text>
          <Text style={styles.detail}>Gender: {adoption.p_id?.p_gender}</Text>
          <Text style={styles.detail}>Age: {adoption.p_id?.p_age} years</Text>
        </View>

        

        {/* Adopter Details */}
        <View style={styles.section}>
          <Text style={styles.title}>Adopter Details</Text>
          <Text style={styles.detail}>Name: {adoption.v_id?.v_fname} {adoption.v_id?.v_lname}</Text>
          <Text style={styles.detail}>Birthdate: {adoption.v_id?.v_birthdate}</Text>
          <Text style={styles.detail}>Gender: {adoption.v_id?.v_gender}</Text>
          <Text style={styles.detail}>Username: {adoption.v_id?.v_username}</Text>
          <Text style={styles.detail}>Email: {adoption.v_id?.v_emailadd}</Text>
          <Text style={styles.detail}>Contact: {adoption.v_id?.v_contactnumber}</Text>
          <Text style={styles.detail}>Address: {adoption.v_id?.v_add}</Text>
          <Text style={styles.detail}>Role: {adoption.v_id?.v_role}</Text>
          <Text style={styles.sectionTitle}>Valid ID</Text>
          {adoption.v_id?.v_validID ? (
            <Image
              style={styles.validIdImage}
              source={{ uri: `${config.address}${adoption.v_id.v_validID}` }}
            />
          ) : (
            <Text style={styles.noImageText}>No valid ID available</Text>
          )}
        </View>

        

        {/* Household Details */}
        <View style={styles.section}>
          <Text style={styles.title}>Household Details</Text>
          <Text style={styles.detail}>Occupation: {adoption.occupation}</Text>
          <Text style={styles.detail}>Home Type: {adoption.home_type}</Text>
          <Text style={styles.detail}>Years Resided: {adoption.years_resided}</Text>
          <Text style={styles.detail}>Adults in Household: {adoption.adults_in_household}</Text>
          <Text style={styles.detail}>Children in Household: {adoption.children_in_household}</Text>
          <Text style={styles.detail}>Allergic to Pets: {adoption.allergic_to_pets}</Text>
          <Text style={styles.detail}>Household Description: {adoption.household_description}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.rejectButton} onPress={handleReject} disabled={loading}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept} disabled={loading}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff69b4',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  petImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  validIdImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  noImageText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  divider: {
    marginVertical: 15,
    backgroundColor: '#ccc',
    height: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default PendingAdoptionDetails;