import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import AppBar from '../design/AppBar';
import axios from 'axios';
import config from '../../server/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const PendingAdoptionDetails = ({ route, navigation }) => {
  const { adoption } = route.params;
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

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

  const handleAccept = async () => {
    if (!visitDate || !visitTime) {
      Alert.alert('Validation Error', 'Please select both date and time for the home visit');
      return;
    }

    setLoading(true);
    setActionType('accept');
    try {
      const token = await verifyAdminAccess();
      if (!token) return;
  
      const response = await axios.patch(
        `${config.address}/api/adoption/approve/${adoption._id}`,
        { visitDate, visitTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      Alert.alert('Success', 'Adoption request approved and visit scheduled!');
      navigation.goBack();
    } catch (error) {
      console.error('Error accepting adoption:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 
        `Request failed with status ${error.response?.status}` ||
        'Failed to approve adoption'
      );
    } finally {
      setLoading(false);
      setShowAcceptModal(false);
    }
  };
  
  const handleReject = async () => {
    if (!rejectionReason || (rejectionReason === 'Other' && !otherReason)) {
      Alert.alert('Validation Error', 'Please select or specify a reason for rejection');
      return;
    }

    setLoading(true);
    setActionType('reject');
    try {
      const token = await verifyAdminAccess();
      if (!token) return;
  
      const reason = rejectionReason === 'Other' ? otherReason : rejectionReason;
      const response = await axios.patch(
        `${config.address}/api/adoption/decline/${adoption._id}`,
        { rejection_reason: reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      Alert.alert('Success', 'Adoption request declined!');
      navigation.goBack();
    } catch (error) {
      console.error('Error rejecting adoption:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 
        `Request failed with status ${error.response?.status}` ||
        'Failed to decline adoption'
      );
    } finally {
      setLoading(false);
      setShowRejectModal(false);
    }
  };

  const formatContactNumber = (number) => {
    if (!number) return 'N/A';
    const numStr = number.toString();
    if (numStr.startsWith('63')) {
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
          <DetailRow icon="pets" label="Type:" value={adoption.p_id?.p_type} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="pets" label="Breed:" value={adoption.p_id?.p_breed} />
          <Divider style={styles.rowDivider} />
          <DetailRow icon="pets" label="Gender:" value={adoption.p_id?.p_gender} />
          <Divider style={styles.rowDivider} />
          <DetailRow
            icon="pets"
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
            style={[styles.button, styles.rejectButton]}
            onPress={() => setShowRejectModal(true)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => setShowAcceptModal(true)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Accept Adoption Modal */}
      <Modal
        visible={showAcceptModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAcceptModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Schedule Home Visit</Text>
            
            <Text style={styles.modalSubtitle}>Please select date and time for the home visit:</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Select Date (YYYY-MM-DD)"
              value={visitDate}
              onChangeText={setVisitDate}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Select Time (HH:MM)"
              value={visitTime}
              onChangeText={setVisitTime}
            />
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAcceptModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAccept}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reject Adoption Modal */}
      <Modal
        visible={showRejectModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Reject Adoption Request</Text>
            
            <Text style={styles.modalSubtitle}>Please select reason for rejection:</Text>
            
            <View style={styles.reasonContainer}>
              <TouchableOpacity
                style={[
                  styles.reasonButton,
                  rejectionReason === 'Incomplete Information' && styles.selectedReason
                ]}
                onPress={() => setRejectionReason('Incomplete Information')}
              >
                <Text style={styles.reasonText}>Incomplete Information</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.reasonButton,
                  rejectionReason === 'Not Suitable' && styles.selectedReason
                ]}
                onPress={() => setRejectionReason('Not Suitable')}
              >
                <Text style={styles.reasonText}>Not Suitable</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.reasonButton,
                  rejectionReason === 'Pet Already Adopted' && styles.selectedReason
                ]}
                onPress={() => setRejectionReason('Pet Already Adopted')}
              >
                <Text style={styles.reasonText}>Pet Already Adopted</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.reasonButton,
                  rejectionReason === 'Other' && styles.selectedReason
                ]}
                onPress={() => setRejectionReason('Other')}
              >
                <Text style={styles.reasonText}>Other</Text>
              </TouchableOpacity>
            </View>
            
            {rejectionReason === 'Other' && (
              <TextInput
                style={styles.input}
                placeholder="Please specify reason..."
                value={otherReason}
                onChangeText={setOtherReason}
              />
            )}
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowRejectModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleReject}
                disabled={loading || !rejectionReason || (rejectionReason === 'Other' && !otherReason)}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Confirm Rejection</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 10,
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
    backgroundColor: '#cad47c',
  },
  rejectButton: {
    backgroundColor: '#fc6868',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff69b4',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#fc6868',
  },
  confirmButton: {
    backgroundColor: '#cad47c',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reasonContainer: {
    marginBottom: 15,
  },
  reasonButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedReason: {
    backgroundColor: '#ff69b4',
    borderColor: '#ff69b4',
  },
  reasonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default PendingAdoptionDetails;