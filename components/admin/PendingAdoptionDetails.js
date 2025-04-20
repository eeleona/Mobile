import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import AppBar from '../design/AppBar';
import axios from 'axios';
import config from '../../server/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PendingAdoptionDetails = ({ route, navigation }) => {
  const { adoption } = route.params;
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(null);

  const verifyAdminAccess = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Login Required', 'Admin access required. Please log in.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
        return false;
      }

      const userRole = await AsyncStorage.getItem('userRole');
      if (!['admin', 'super-admin'].includes(userRole)) {
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

  const handleAccept = async () => {
    const token = await verifyAdminAccess();
    if (!token) return;
    Alert.alert('Success', 'Adoption accepted!');
  };

  const handleReject = async () => {
    const token = await verifyAdminAccess();
    if (!token) return;
    Alert.alert('Success', 'Adoption rejected!');
  };

  const formatContactNumber = (number) => {
    if (!number) return 'N/A';
    const numStr = number.toString(); // Ensure it's a string
    if (numStr.startsWith('63')) {
      // Convert international format to local format
      return `0${numStr.slice(2, 5)} ${numStr.slice(5, 8)} ${numStr.slice(8)}`;
    }
    return numStr.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  };

  return (
    <View style={styles.container}>
      <AppBar />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Pet Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pet Details</Text>
          <Divider style={styles.sectionDivider} />
          {adoption.p_id?.pet_img?.[0] ? (
            <Image
              style={styles.petImage}
              source={{ uri: `${config.address}${adoption.p_id.pet_img[0]}` }}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No Image Available</Text>
            </View>
          )}
          <DetailRow icon="pets" label="Name:" value={adoption.p_id?.p_name} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="category" label="Type:" value={adoption.p_id?.p_type} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="pets" label="Breed:" value={adoption.p_id?.p_breed} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="male" label="Gender:" value={adoption.p_id?.p_gender} />
          <Divider style={styles.rowDivider} />
          <DetailRow
            icon="calendar-today"
            label="Age:"
            value={adoption.p_id?.p_age ? `${adoption.p_id.p_age} years` : null}
          />
        </View>

        {/* Adopter Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adopter Details</Text>
          <Divider style={styles.sectionDivider} />
          {adoption.v_id?.v_img ? (
          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={{ uri: `${config.address}${adoption.v_id.v_img}` }}
            />
            
          </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No Profile Image</Text>
            </View>
          )}
          <DetailRow icon="person" label="Name:" value={`${adoption.v_id?.v_fname} ${adoption.v_id?.v_lname}`} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="male" label="Gender:" value={adoption.v_id?.v_gender} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="cake" label="Birthdate:" value={adoption.v_id?.v_birthdate} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="phone" label="Contact:" value={formatContactNumber(adoption.v_id?.v_contactnumber)} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="work" label="Occupation:" value={adoption.occupation} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="home" label="Address:" value={adoption.v_id?.v_add} />
        </View>

        {/* Adoption Form Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adoption Form Details</Text>
          <Divider style={styles.sectionDivider} />
          <DetailRow icon="home" label="Home Type:" value={adoption.home_type} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="calendar-today" label="Years Resided:" value={adoption.years_resided} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="people" label="Adults in Household:" value={adoption.adults_in_household} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="child-care" label="Children in Household:" value={adoption.children_in_household} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="pets" label="Allergic to Pets:" value={adoption.allergic_to_pets} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="description" label="Household Description:" value={adoption.household_description} />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={handleAccept}
            disabled={loading && actionType === 'accept'}
          >
            {loading && actionType === 'accept' ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Accept</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={handleReject}
            disabled={loading && actionType === 'reject'}
          >
            {loading && actionType === 'reject' ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Reject</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <MaterialIcons name={icon} size={20} color="#ff69b4" style={styles.detailIcon} />
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || 'N/A'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ff69b4',
    marginBottom: 12,
  },
  sectionDivider: {
    marginBottom: 12,
    backgroundColor: '#eee',
    height: 1,
  },
  petImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ff69b4',
  },
  verifiedStatus: {
    marginTop: 8,
    fontSize: 14,
    color: '#ff69b4',
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  rowDivider: {
    backgroundColor: '#eee',
    height: 1,
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PendingAdoptionDetails;