import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { Divider } from 'react-native-paper';
import AppBar from '../design/AppBar';
import axios from 'axios';
import config from '../../server/config/config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

const PendingUserDetails = ({ route, navigation }) => {
  const { user } = route.params;
  const [loading, setLoading] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showValidId, setShowValidId] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false); // State for the verify confirmation modal

  const handleVerify = async () => {
    setLoading(true);
    try {
      await axios.delete(`${config.address}/api/user/delete/transfer/${user._id}`);
      
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
      setShowVerifyModal(false); // Close the modal after verification
    }
  };

  const handleReject = async () => {
    if (!declineReason) {
      Alert.alert('Error', 'Please select a reason for rejection');
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${config.address}/api/user/delete/${user._id}`);
      
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
              style={[styles.profileImage, { borderColor: '#ffe261' }]}
              source={{ uri: `${config.address}${user.p_img}` }}
              defaultSource={require('../../assets/Images/user.png')}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.name}>{user.p_fname} {user.p_mname} {user.p_lname}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>PENDING</Text>
          </View>
          
          <Divider style={styles.divider} />

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Account Details</Text>
            
            <View style={styles.detailContainer}>
              <View style={styles.detailLabelContainer}>
                <Icon name="person" size={20} color="#ff69b4" />
                <Text style={styles.detailLabel}>Username</Text>
              </View>
              <Text style={styles.detailValue}>{user.p_username}</Text>
            </View>
            
            <View style={styles.detailContainer}>
              <View style={styles.detailLabelContainer}>
                <Icon name="email" size={20} color="#ff69b4" />
                <Text style={styles.detailLabel}>Email</Text>
              </View>
              <Text style={styles.detailValue}>{user.p_emailadd}</Text>
            </View>
            
            <View style={styles.detailContainer}>
              <View style={styles.detailLabelContainer}>
                <Icon name="phone" size={20} color="#ff69b4" />
                <Text style={styles.detailLabel}>Contact</Text>
              </View>
              <Text style={styles.detailValue}>{user.p_contactnumber}</Text>
            </View>
            
            <View style={styles.detailContainer}>
              <View style={styles.detailLabelContainer}>
                <Icon name="home" size={20} color="#ff69b4" />
                <Text style={styles.detailLabel}>Address</Text>
              </View>
              <Text style={styles.detailValue}>{user.p_add}</Text>
            </View>
            
            <View style={styles.detailContainer}>
              <View style={styles.detailLabelContainer}>
                <Icon name="wc" size={20} color="#ff69b4" />
                <Text style={styles.detailLabel}>Gender</Text>
              </View>
              <Text style={styles.detailValue}>{user.p_gender}</Text>
            </View>
            
            <View style={[styles.detailContainer, styles.birthdayContainer]}>
              <View style={styles.detailLabelContainer}>
                <Icon name="cake" size={20} color="#ff69b4" />
                <Text style={styles.detailLabel}>Birthday</Text>
              </View>
              <Text style={styles.detailValue}>
                {new Date(user.p_birthdate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Valid ID Section */}
        <View style={[styles.card, { marginTop: 16 }]}>
          <TouchableOpacity 
            style={styles.validIdHeader} 
            onPress={() => setShowValidId(!showValidId)}
          >
            <View style={styles.validIdTitleContainer}>
              <Icon name="verified-user" size={24} color="#ff69b4" />
              <Text style={styles.validIdTitle}>Valid ID</Text>
            </View>
            <Icon 
              name={showValidId ? 'keyboard-arrow-down' : 'keyboard-arrow-right'} 
              size={28} 
              color="#ff69b4" 
            />
          </TouchableOpacity>
          
          {showValidId && (
            <Animatable.View 
              animation="fadeIn"
              duration={300}
              style={styles.validIdContent}
            >
              <Image
                style={styles.validIdImage}
                source={{ uri: `${config.address}${user.p_validID}` }}
                resizeMode="contain"
                onError={(e) => console.log('Failed to load image:', e.nativeEvent.error)}
              />
            </Animatable.View>
          )}
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
            onPress={() => setShowVerifyModal(true)} // Open the verify confirmation modal
            disabled={loading}
          >
            {loading && !showDeclineModal ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
            {/* Decline Reason Modal */}
      <Modal
        visible={showDeclineModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDeclineModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View 
            animation="fadeInUp"
            duration={300}
            style={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Reason for Rejection</Text>
            
            <View style={styles.reasonContainer}>
              {['Invalid details', 'Not qualified', 'Other'].map((reason) => (
                <TouchableOpacity 
                  key={reason}
                  style={[
                    styles.reasonButton, 
                    declineReason === reason && styles.selectedReason
                  ]}
                  onPress={() => setDeclineReason(reason)}
                >
                  <Text style={styles.reasonText}>{reason}</Text>
                </TouchableOpacity>
              ))}
              
              {declineReason === 'Other' && (
                <TextInput
                  style={styles.reasonInput}
                  placeholder="Please specify reason..."
                  value={otherReason}
                  onChangeText={setOtherReason}
                  multiline
                  numberOfLines={3}
                />
              )}
            </View>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowDeclineModal(false);
                  setDeclineReason('');
                  setOtherReason('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.modalButton, 
                  styles.confirmButton,
                  (!declineReason || (declineReason === 'Other' && !otherReason)) && styles.disabledButton
                ]}
                onPress={handleReject}
                disabled={!declineReason || (declineReason === 'Other' && !otherReason)}
              >
                <Text style={styles.confirmButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </Modal>

      {/* Verify Confirmation Modal */}
      <Modal
        visible={showVerifyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowVerifyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View 
            animation="fadeInUp"
            duration={300}
            style={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Confirm Verification</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to verify this user? They will be notified via email.
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowVerifyModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleVerify}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </Modal>
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
    paddingBottom: 48,
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
    borderWidth: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2a2a2a',
    textAlign: 'center',
    marginBottom: 4,
  },
  statusContainer: {
    backgroundColor: '#FFFACD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 10,
  },
  statusText: {
    color: '#FF8C00',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#e0e0e0',
    height: 1,
  },
  detailsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff69b4',
    marginBottom: 12,
  },
  detailContainer: {
    marginBottom: 12,
  },
  birthdayContainer: {
    marginBottom: 8,
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    paddingLeft: 28,
  },
  validIdHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  validIdTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  validIdTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff69b4',
    marginLeft: 10,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  validIdContent: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validIdImage: {
    width: '100%',
    minHeight: 200,
    maxHeight: 300,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  verifyButton: {
    backgroundColor: '#cad47c',
  },
  rejectButton: {
    backgroundColor: '#fc6868',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  reasonContainer: {
    marginBottom: 20,
  },
  reasonButton: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  selectedReason: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFA500',
  },
  reasonText: {
    fontSize: 15,
    color: '#333',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: '#cad47c',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PendingUserDetails;