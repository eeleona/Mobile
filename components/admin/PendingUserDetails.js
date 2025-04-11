import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Divider } from 'react-native-paper';
import AppBar from '../design/AppBar';
import axios from 'axios';
import config from '../../server/config/config';

const PendingUserDetails = ({ route, navigation }) => {
  const { user } = route.params;
  const [loading, setLoading] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      // Transfer user from pending to verified collection
      await axios.delete(`${config.address}/api/user/delete/transfer/${user._id}`);
      
      // Send verification email
      const emailData = {
        to: user.p_emailadd,
        subject: 'Your Account Has Been Verified',
        text: `Dear ${user.p_fname},\n\nWe are pleased to inform you that your account has been verified. You can now log in and start using our services.\n\nBest regards,\nThe Pet Adoption Team`
      };
      await axios.post(`${config.address}/api/send-email`, emailData);
      
      Alert.alert('Success', 'User has been verified and notified via email.');
      navigation.goBack();
    } catch (error) {
      console.error('Error verifying user:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to verify user.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!declineReason) {
      Alert.alert('Error', 'Please select a reason for rejection');
      return;
    }

    setLoading(true);
    try {
      // Delete the pending user
      await axios.delete(`${config.address}/api/user/delete/${user._id}`);
      
      // Send rejection email
      const reasonText = declineReason === 'Other' ? otherReason : declineReason;
      const emailData = {
        to: user.p_emailadd,
        subject: 'Your Account Application Status',
        text: `Dear ${user.p_fname},\n\nWe regret to inform you that your account application has been declined. Reason: ${reasonText}\n\nIf you have any questions, please contact us.\n\nBest regards,\nThe Pet Adoption Team`
      };
      await axios.post(`${config.address}/api/send-email`, emailData);
      
      Alert.alert('Success', 'User has been rejected and notified via email.');
      navigation.goBack();
    } catch (error) {
      console.error('Error rejecting user:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to reject user.');
    } finally {
      setLoading(false);
      setShowDeclineModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppBar title="Pending User Details" onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Section */}
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.profileImage}
              source={{ uri: `${config.address}${user.p_img}` }}
              defaultSource={require('../../assets/Images/user.png')}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.name}>{user.p_fname} {user.p_mname} {user.p_lname}</Text>
          <Text style={styles.role}>{user.p_role}</Text>
          
          <Divider style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Username:</Text>
            <Text style={styles.detailValue}>{user.p_username}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{user.p_emailadd}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact:</Text>
            <Text style={styles.detailValue}>{user.p_contactnumber}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={styles.detailValue}>{user.p_add}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gender:</Text>
            <Text style={styles.detailValue}>{user.p_gender}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Birthday:</Text>
            <Text style={styles.detailValue}>
              {new Date(user.p_birthdate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Valid ID Section */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={styles.sectionTitle}>Valid ID</Text>
          <Divider style={styles.divider} />
          <Image
            style={styles.validIdImage}
            source={{ uri: `${config.address}${user.p_validID}` }}
            resizeMode="contain"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.rejectButton]} 
            onPress={() => setShowDeclineModal(true)}
            disabled={loading}
          >
            {loading && showDeclineModal ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Reject</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.verifyButton]} 
            onPress={handleVerify}
            disabled={loading}
          >
            {loading && !showDeclineModal ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Decline Reason Modal */}
        {showDeclineModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Reason for Rejection</Text>
              
              <View style={styles.reasonContainer}>
                <TouchableOpacity 
                  style={[styles.reasonButton, declineReason === 'Invalid details' && styles.selectedReason]}
                  onPress={() => setDeclineReason('Invalid details')}
                >
                  <Text>Invalid details</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.reasonButton, declineReason === 'Not qualified' && styles.selectedReason]}
                  onPress={() => setDeclineReason('Not qualified')}
                >
                  <Text>Not qualified</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.reasonButton, declineReason === 'Other' && styles.selectedReason]}
                  onPress={() => setDeclineReason('Other')}
                >
                  <Text>Other</Text>
                </TouchableOpacity>
                
                {declineReason === 'Other' && (
                  <TextInput
                    style={styles.reasonInput}
                    placeholder="Please specify"
                    value={otherReason}
                    onChangeText={setOtherReason}
                  />
                )}
              </View>
              
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowDeclineModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleReject}
                  disabled={!declineReason || (declineReason === 'Other' && !otherReason)}
                >
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#ff69b4',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2a2a2a',
    textAlign: 'center',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#ff69b4',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#e0e0e0',
    height: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a2a2a',
    marginBottom: 12,
  },
  validIdImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  reasonContainer: {
    marginBottom: 20,
  },
  reasonButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedReason: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ff69b4',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#F44336',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PendingUserDetails;