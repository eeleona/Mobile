import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import {Divider, Checkbox, Modal, Button, Portal, RadioButton, TextInput } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const AdoptionDetails = ({ route, navigation }) => {
  const { adoption } = route.params;
  const [loading, setLoading] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [failedReason, setFailedReason] = useState('');
  const [otherFailedReason, setOtherFailedReason] = useState('');
  const [showCompleteConfirmModal, setShowCompleteConfirmModal] = useState(false);
  const [checklists, setChecklists] = useState({
    complied_papers: { isChecked: false, dateChecked: null },
    home_visit_successful: { isChecked: false, dateChecked: null }
  });
  const [pendingCheckbox, setPendingCheckbox] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  useEffect(() => {
    if (adoption && adoption._id) {
      // Initialize checklist with adoption data
      setChecklists({
        complied_papers: adoption.complied_papers || { isChecked: false, dateChecked: null },
        home_visit_successful: adoption.home_visit_successful || { isChecked: false, dateChecked: null }
      });
    }
  }, [adoption]);

  const handleChecklistChange = async (field) => {
    const now = new Date();
    
    // Update the checklist state
    setChecklists(prev => ({
      ...prev,
      [field]: { isChecked: true, dateChecked: now }
    }));
    
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      
      // Call API to persist the update
      await axios.patch(`${config.address}/api/adoption/checklist/${adoption._id}`, {
        field: field,
        dateChecked: now
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setShowConfirmModal(false);
      setPendingCheckbox(null);
      Alert.alert('Success', 'Checklist item updated successfully');
    } catch (error) {
      console.error('Error updating checklist:', error);
      Alert.alert('Error', 'Failed to update checklist. Please try again.');
      
      // Revert the checklist state on error
      setChecklists(prev => ({
        ...prev,
        [field]: { isChecked: false, dateChecked: null }
      }));
    }
  };

  const handleFail = () => {
    setShowFailedModal(true);
  };

  const handleSubmitFailed = async () => {
    setLoading(true);
    if (!adoption || !adoption._id) {
      Alert.alert('Error', 'No adoption selected');
      setLoading(false);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      
      await axios.patch(`${config.address}/api/adoption/fail/${adoption._id}`, { 
        reason: failedReason === 'Other' ? otherFailedReason : failedReason 
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setLoading(false);
      setShowFailedModal(false);
      Alert.alert('Success', 'Adoption marked as failed');
      navigation.goBack(); // Return to previous screen
    } catch (err) {
      console.error("Error failing adoption:", err);
      Alert.alert('Error', 'Failed to mark adoption as failed. Please try again.');
      setLoading(false);
    }
  };

  const handleComplete = () => {
    setShowCompleteConfirmModal(true);
  };

  const handleCompleteAdoption = async () => {
    setLoading(true);
    if (!adoption || !adoption._id) {
      Alert.alert('Error', 'No adoption selected');
      setLoading(false);
      return;
    }
    
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      await axios.patch(`${config.address}/api/adoption/complete/${adoption._id}`, {
        complied_papers: checklists.complied_papers,
        home_visit_successful: checklists.home_visit_successful
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setLoading(false);
      setShowCompleteConfirmModal(false);
      Alert.alert('Success', 'Adoption marked as complete');
      navigation.goBack(); // Return to previous screen
    } catch (err) {
      console.error("Error completing adoption:", err);
      Alert.alert('Error', 'Failed to mark adoption as complete. Please try again.');
      setLoading(false);
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

  const StatusStepper = ({ status }) => {
    const steps = ['Submitted', 'Accepted', 'Completed'];

    const getActiveStep = () => {
      switch (status?.toLowerCase()) {
        case 'pending':
        case 'submitted':
          return 1;
        case 'accepted':
          return 2;
        case 'completed':
          return 3;
        default:
          return 1;
      }
    };

    const activeStep = getActiveStep();

    return (
      <View style={styles.stepperContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.stepCircle,
                  index < activeStep && styles.completedStep,
                  index === activeStep - 1 && styles.activeStep,
                ]}
              >
                {index < activeStep ? (
                  <MaterialIcons name="check" size={16} color="#FFF" />
                ) : (
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  index < activeStep && styles.completedLabel,
                  index === activeStep - 1 && styles.activeLabel,
                ]}
              >
                {step}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  index < activeStep - 1 && styles.completedLine,
                ]}
              />
            )}
          </React.Fragment>
        ))}
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

  const isActive = adoption?.status?.toLowerCase() === 'accepted';


  return (
    <PaperProvider>
    <View style={styles.container}>
      <AppBar title="Adoption Details" onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adoption Application</Text>
          <Divider style={styles.sectionDivider} />
          <DetailRow
            icon="event"
            label="Submitted At:"
            value={new Date(adoption.a_submitted_at).toLocaleDateString()}
          />
          <Divider style={styles.rowDivider} />
          <DetailRow
            icon="info"
            label="Status:"
            value={adoption.status}
          />
          <Divider style={styles.rowDivider} />
          <StatusStepper status={adoption.status} />

          {isActive && (
            <View style={styles.checklistContainer}>
              <Text style={styles.checklistTitle}>Requirements</Text>
              <Divider style={styles.sectionDivider} />
              
              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => {
                  if (!checklists.complied_papers.isChecked) {
                    setPendingCheckbox('complied_papers');
                    setShowConfirmModal(true);
                  }
                }}
                disabled={checklists.complied_papers.isChecked}
              >
                <Checkbox
                  status={checklists.complied_papers.isChecked ? 'checked' : 'unchecked'}
                  color="#ff69b4"
                  disabled={checklists.complied_papers.isChecked}
                />
                <Text style={styles.checkboxLabel}>Complete Adoption Papers</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => {
                  if (!checklists.home_visit_successful.isChecked) {
                    setPendingCheckbox('home_visit_successful');
                    setShowConfirmModal(true);
                  }
                }}
                disabled={checklists.home_visit_successful.isChecked}
              >
                <Checkbox
                  status={checklists.home_visit_successful.isChecked ? 'checked' : 'unchecked'}
                  color="#ff69b4"
                  disabled={checklists.home_visit_successful.isChecked}
                />
                <Text style={styles.checkboxLabel}>Successful Home Visit</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Action Buttons - Only show for active adoptions */}
          {isActive && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.failButton]}
                onPress={handleFail}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Fail</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button, 
                  styles.completeButton,
                  (!checklists.complied_papers.isChecked || !checklists.home_visit_successful.isChecked) && styles.disabledButton
                ]}
                onPress={handleComplete}
                disabled={loading || !checklists.complied_papers.isChecked || !checklists.home_visit_successful.isChecked}
              >
                <Text style={styles.buttonText}>Complete</Text>
              </TouchableOpacity>
            </View>
          )}
        
        </View>

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
          <DetailRow
            icon="phone"
            label="Contact:"
            value={formatContactNumber(adoption.v_id?.v_contactnumber)}
          />
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
      </ScrollView>
      {/* Modal for confirming checklist item */}
      <Portal>
        <Modal 
          visible={showConfirmModal} 
          onDismiss={() => setShowConfirmModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Confirm Checklist</Text>
          <Text style={styles.modalText}>
            Are you sure you want to mark <Text style={styles.boldText}>
              {pendingCheckbox === 'complied_papers' ? 'Complied Papers' : 'Successful Home Visit'}
            </Text> as completed? This cannot be undone.
          </Text>
          <View style={styles.modalButtonContainer}>
            <Button 
              mode="contained" 
              onPress={() => handleChecklistChange(pendingCheckbox)}
              style={styles.confirmButton}
            >
              Confirm
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => setShowConfirmModal(false)}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Modal for completing adoption - Enhanced */}
      <Portal>
        <Modal 
          visible={showCompleteConfirmModal} 
          onDismiss={() => setShowCompleteConfirmModal(false)}
          contentContainerStyle={[styles.modalContainer, styles.elevatedModal]}
        >
          <View style={styles.modalHeader}>
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={[styles.modalTitle, styles.successTitle]}>Confirm Adoption Completion</Text>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              You are about to mark this adoption as successfully completed. Please verify all requirements:
            </Text>
            
            <View style={styles.requirementsList}>
              <View style={styles.requirementItem}>
                <MaterialIcons 
                  name={checklists.complied_papers.isChecked ? "check-box" : "check-box-outline-blank"} 
                  size={20} 
                  color={checklists.complied_papers.isChecked ? "#4CAF50" : "#757575"} 
                />
                <Text style={styles.requirementText}>Complete Adoption Papers</Text>
              </View>
              
              <View style={styles.requirementItem}>
                <MaterialIcons 
                  name={checklists.home_visit_successful.isChecked ? "check-box" : "check-box-outline-blank"} 
                  size={20} 
                  color={checklists.home_visit_successful.isChecked ? "#4CAF50" : "#757575"} 
                />
                <Text style={styles.requirementText}>Successful Home Visit</Text>
              </View>
            </View>
            
            <Text style={styles.modalWarning}>
              <MaterialIcons name="warning" size={16} color="#FF9800" /> 
              {' '}This action cannot be undone.
            </Text>
          </View>
          
          <View style={styles.modalFooter}>
            <Button 
              mode="outlined" 
              onPress={() => setShowCompleteConfirmModal(false)}
              style={[styles.modalButton, styles.cancelButton]}
              labelStyle={styles.cancelButtonLabel}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleCompleteAdoption}
              style={[styles.modalButton, styles.successButton]}
              loading={loading}
              disabled={!checklists.complied_papers.isChecked || !checklists.home_visit_successful.isChecked}
            >
              Confirm Completion
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Modal for failing adoption - Enhanced */}
      <Portal>
        <Modal 
          visible={showFailedModal} 
          onDismiss={() => setShowFailedModal(false)}
          contentContainerStyle={[styles.modalContainer, styles.elevatedModal]}
        >
          <View style={styles.modalHeader}>
            <MaterialIcons name="error" size={24} color="#F44336" />
            <Text style={[styles.modalTitle, styles.errorTitle]}>Adoption Unsuccessful</Text>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Please select the primary reason why this adoption is not successful:
            </Text>
            
            <RadioButton.Group 
              onValueChange={value => {
                setFailedReason(value);
                if (value !== 'Other') {
                  setOtherFailedReason('');
                }
              }} 
              value={failedReason}
            >
              <View style={styles.radioItem}>
                <RadioButton value="Incompatible with pet" color="#F44336" />
                <Text style={styles.radioLabel}>Incompatible with pet</Text>
              </View>
              
              <View style={styles.radioItem}>
                <RadioButton value="Incomplete documentation" color="#F44336" />
                <Text style={styles.radioLabel}>Incomplete documentation</Text>
              </View>
              
              <View style={styles.radioItem}>
                <RadioButton value="No longer interested" color="#F44336" />
                <Text style={styles.radioLabel}>No longer interested</Text>
              </View>
              
              <View style={styles.radioItem}>
                <RadioButton value="Failed home visit" color="#F44336" />
                <Text style={styles.radioLabel}>Failed home visit</Text>
              </View>
              
              <View style={styles.radioItem}>
                <RadioButton value="Other" color="#F44336" />
                <Text style={styles.radioLabel}>Other reason</Text>
              </View>
            </RadioButton.Group>
            
            {failedReason === 'Other' && (
              <TextInput
                label="Please specify the reason"
                value={otherFailedReason}
                onChangeText={text => setOtherFailedReason(text)}
                style={styles.textInput}
                mode="outlined"
                multiline
                numberOfLines={3}
              />
            )}
            
            <Text style={styles.modalWarning}>
              <MaterialIcons name="warning" size={16} color="#F44336" /> 
              {' '}This will permanently mark the adoption as failed.
            </Text>
          </View>
          
          <View style={styles.modalFooter}>
            <Button 
              mode="outlined" 
              onPress={() => setShowFailedModal(false)}
              style={[styles.modalButton, styles.cancelButton]}
              labelStyle={styles.cancelButtonLabel}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleSubmitFailed}
              style={[styles.modalButton, styles.errorButton]}
              loading={loading}
              disabled={failedReason === '' || (failedReason === 'Other' && otherFailedReason === '')}
            >
              Submit
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
    </PaperProvider>
  );
};

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
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  stepContainer: {
    alignItems: 'center',
    minWidth: 80,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedStep: {
    backgroundColor: '#4CAF50',
  },
  activeStep: {
    backgroundColor: '#ff69b4',
  },
  stepNumber: {
    color: '#757575',
    fontWeight: 'bold',
  },
  stepLabel: {
    marginTop: 5,
    color: '#757575',
    fontSize: 12,
    textAlign: 'center',
  },
  completedLabel: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  activeLabel: {
    color: '#ff69b4',
    fontWeight: 'bold',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  completedLine: {
    backgroundColor: '#4CAF50',
  },
  checklistContainer: {
    marginTop: 16,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff69b4',
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkboxLabel: {
    marginLeft: 2,
    fontSize: 14,
    color: '#333',
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
  failButton: {
    backgroundColor: '#fc6868',
  },
  completeButton: {
    backgroundColor: '#cad47c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  elevatedModal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalContent: {
    marginBottom: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
  },
  successTitle: {
    color: '#4CAF50',
    marginLeft: 8,
  },
  errorTitle: {
    color: '#F44336',
    marginLeft: 8,
  },
  requirementsList: {
    marginVertical: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  radioLabel: {
    fontSize: 14,
    marginLeft: 8,
  },
  modalWarning: {
    fontSize: 13,
    color: '#757575',
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  errorButton: {
    backgroundColor: '#fc6868',
  },
  cancelButton: {
    borderColor: '#757575',
  },
  cancelButtonLabel: {
    color: '#757575',
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 14,
  },
  boldText: {
    fontWeight: 'bold',
  },
  modalButton: {
    marginLeft: 10,
    minWidth: 120,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: '#ff69b4',
    marginLeft: 10,
  },
  cancelButton: {
    borderColor: '#ff69b4',
    marginLeft: 10,
  },
  textInput: {
    marginTop: 10,
    marginBottom: 20,
  }
});

export default AdoptionDetails;