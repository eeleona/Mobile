import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { Divider } from 'react-native-paper';
import AppBar from '../design/AppBar';
import axios from 'axios';
import config from '../../server/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PendingAdoptionDetails = ({ route, navigation }) => {
  const { adoption } = route.params;
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(null);
  
  // For accept flow
  const [showDateModal, setShowDateModal] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  
  // For reject flow
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const verifyAdminAccess = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert(
          'Login Required',
          'Admin access required. Please log in.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
        return false;
      }

      // Verify user role
      const userRole = await AsyncStorage.getItem('userRole');
      if (!['admin', 'super-admin'].includes(userRole)) {
        Alert.alert(
          'Access Denied',
          'Only administrators can perform this action.'
        );
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
    setShowDateModal(true);
  };

  const handleReject = async () => {
    const token = await verifyAdminAccess();
    if (!token) return;
    setShowRejectModal(true);
  };

  const handleRejectionReasonChange = (value) => {
    setRejectionReason(value);
    if (value !== 'Other') {
      setOtherReason('');
    }
  };

  const submitAcceptance = async () => {
    try {
      setLoading(true);
      setActionType('accept');
      
      if (!visitDate) {
        Alert.alert("Error", "Please select a visit date.");
        return;
      }

      if (!visitTime) {
        Alert.alert("Error", "Please select a visit time.");
        return;
      }

      if (visitTime < "09:00" || visitTime > "15:00") {
        Alert.alert("Invalid Time", "Please select a time between 9:00 AM and 3:00 PM.");
        return;
      }

      const token = await verifyAdminAccess();
      if (!token) return;

      const response = await axios.patch(
        `${config.address}/api/adoption/approve/${adoption._id}`,
        { visitDate, visitTime },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Adoption has been accepted and visit scheduled.');
        setShowDateModal(false);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error accepting adoption:', error);
      let errorMessage = 'Failed to accept adoption. Please try again.';
      
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  const submitRejection = async () => {
    try {
      setLoading(true);
      setActionType('reject');
      
      const token = await verifyAdminAccess();
      if (!token) return;
      
      const rejectionReasonToSend = rejectionReason === 'Other' ? otherReason : rejectionReason;

      if (!rejectionReasonToSend) {
        Alert.alert('Error', 'Please provide a reason for rejection.');
        return;
      }

      const response = await axios.patch(
        `${config.address}/api/adoption/decline/${adoption._id}`,
        { rejection_reason: rejectionReasonToSend },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Adoption has been rejected.');
        setShowRejectModal(false);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error rejecting adoption:', error);
      let errorMessage = 'Failed to reject adoption. Please try again.';
      
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 9; hour <= 15; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(
          <TouchableOpacity
            key={timeString}
            style={[
              styles.timeOption,
              visitTime === timeString && styles.selectedTimeOption
            ]}
            onPress={() => setVisitTime(timeString)}
          >
            <Text style={[
              styles.timeOptionText,
              visitTime === timeString && styles.selectedTimeOptionText
            ]}>
              {timeString}
            </Text>
          </TouchableOpacity>
        );
      }
    }
    return options;
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
          <DetailRow label="Household Description:" value={adoption.household_description} />
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

      {/* Date/Time Modal for Acceptance */}
      <Modal
        visible={showDateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Visit</Text>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Select Date</Text>
              <TextInput
                style={styles.input}
                type="date"
                value={visitDate}
                onChangeText={setVisitDate}
                placeholder="YYYY-MM-DD"
              />
              
              <Text style={styles.modalLabel}>Select Time (9AM-3PM)</Text>
              <View style={styles.timeOptionsContainer}>
                {generateTimeOptions()}
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitAcceptance}
                disabled={!visitDate || !visitTime || loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDateModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rejection Reason Modal */}
      <Modal
        visible={showRejectModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reject Adoption</Text>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Reason for Rejection</Text>
              <View style={styles.reasonOptions}>
                <TouchableOpacity
                  style={[
                    styles.reasonOption,
                    rejectionReason === 'Not Suitable' && styles.selectedReasonOption
                  ]}
                  onPress={() => handleRejectionReasonChange('Not Suitable')}
                >
                  <Text style={[
                    styles.reasonOptionText,
                    rejectionReason === 'Not Suitable' && styles.selectedReasonOptionText
                  ]}>Not Suitable</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.reasonOption,
                    rejectionReason === 'Incomplete Information' && styles.selectedReasonOption
                  ]}
                  onPress={() => handleRejectionReasonChange('Incomplete Information')}
                >
                  <Text style={[
                    styles.reasonOptionText,
                    rejectionReason === 'Incomplete Information' && styles.selectedReasonOptionText
                  ]}>Incomplete Information</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.reasonOption,
                    rejectionReason === 'Other' && styles.selectedReasonOption
                  ]}
                  onPress={() => handleRejectionReasonChange('Other')}
                >
                  <Text style={[
                    styles.reasonOptionText,
                    rejectionReason === 'Other' && styles.selectedReasonOptionText
                  ]}>Other</Text>
                </TouchableOpacity>
              </View>
              
              {rejectionReason === 'Other' && (
                <>
                  <Text style={styles.modalLabel}>Please specify</Text>
                  <TextInput
                    style={styles.input}
                    value={otherReason}
                    onChangeText={setOtherReason}
                    placeholder="Enter reason..."
                  />
                </>
              )}
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitRejection}
                disabled={!rejectionReason || (rejectionReason === 'Other' && !otherReason) || loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Confirm Reject</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowRejectModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    height: 400,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff69b4',
  },
  modalBody: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  timeOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeOption: {
    width: '30%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedTimeOption: {
    backgroundColor: '#ff69b4',
    borderColor: '#ff69b4',
  },
  timeOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTimeOptionText: {
    color: 'white',
    fontWeight: '500',
  },
  reasonOptions: {
    marginBottom: 20,
  },
  reasonOption: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedReasonOption: {
    backgroundColor: '#ff69b4',
    borderColor: '#ff69b4',
  },
  reasonOptionText: {
    color: '#333',
  },
  selectedReasonOptionText: {
    color: 'white',
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#ff69b4',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
});

export default PendingAdoptionDetails;