import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Divider } from 'react-native-paper';
import AppBar from '../design/AppBar';
import axios from 'axios';
import config from '../../server/config/config';

const PendingAdoptionDetails = ({ route, navigation }) => {
  const { adoption } = route.params;
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(null);

  const handleAccept = async () => {
    setActionType('accept');
    try {
      setLoading(true);
      await axios.patch(`${config.address}${adoption._id}`, {
        visitDate: new Date().toISOString().split('T')[0],
        visitTime: '10:00',
      });
      Alert.alert('Success', 'Adoption has been accepted.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to accept adoption.');
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  const handleReject = async () => {
    setActionType('reject');
    try {
      setLoading(true);
      await axios.patch(`${config.address}${adoption._id}`, {
        rejection_reason: 'Not Suitable',
      });
      Alert.alert('Success', 'Adoption has been rejected.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to reject adoption.');
    } finally {
      setLoading(false);
      setActionType(null);
    }
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
          <DetailRow label="Name:" value={adoption.p_id?.p_name} />
          <DetailRow label="Type:" value={adoption.p_id?.p_type} />
          <DetailRow label="Breed:" value={adoption.p_id?.p_breed} />
          <DetailRow label="Gender:" value={adoption.p_id?.p_gender} />
          <DetailRow label="Age:" value={adoption.p_id?.p_age ? `${adoption.p_id.p_age} years` : null} />
        </View>

        {/* Adopter Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adopter Details</Text>
          <Divider style={styles.sectionDivider} />
          {adoption.v_id?.v_img ? (
            <Image
              style={styles.profileImage}
              source={{ uri: `${config.address}${adoption.v_id.v_img}` }}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No Profile Image</Text>
            </View>
          )}
          <DetailRow label="Name:" value={`${adoption.v_id?.v_fname} ${adoption.v_id?.v_lname}`} />
          <DetailRow label="Gender:" value={adoption.v_id?.v_gender} />
          <DetailRow label="Birthdate:" value={adoption.v_id?.v_birthdate} />
          <DetailRow label="Contact:" value={adoption.v_id?.v_contactnumber} />
          <DetailRow label="Occupation:" value={adoption.occupation} />
          <DetailRow label="Address:" value={adoption.v_id?.v_add} />
        </View>

        {/* Household Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Household Details</Text>
          <Divider style={styles.sectionDivider} />
          <DetailRow label="Home Type:" value={adoption.home_type} />
          <DetailRow label="Years resided in current home:" value={adoption.years_resided} />
          <DetailRow label="Number of Adults in Household:" value={adoption.adults_in_household} />
          <DetailRow label="Number of Children in Household:" value={adoption.children_in_household} />
          <DetailRow label="Allergic to Pets:" value={adoption.allergic_to_pets} />
          <DetailRow label="Household Description:" value={adoption.household_decription} />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={handleReject}
            disabled={loading}
          >
            {loading && actionType === 'reject' ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Reject</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={handleAccept}
            disabled={loading}
          >
            {loading && actionType === 'accept' ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Accept</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const DetailRow = ({ label, value }) => (
  <View>
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || 'N/A'}</Text>
    </View>
    <Divider style={styles.rowDivider} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#ff69b4',
    marginBottom: 12,
  },
  sectionDivider: {
    marginBottom: 12,
    backgroundColor: '#eee',
    height: 1,
  },
  rowDivider: {
    marginVertical: 8,
    backgroundColor: '#f0f0f0',
    height: 1,
  },
  petImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
    flex: 1,
    paddingLeft: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default PendingAdoptionDetails;