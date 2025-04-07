import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Divider } from 'react-native-paper';
import AppBar from '../design/AppBar';
import axios from 'axios';
import config from '../../server/config/config';

const PendingUserDetails = ({ route, navigation }) => {
  const { user } = route.params;

  const handleVerify = async () => {
    try {
      await axios.put(`${config.address}/${user._id}/role`, { p_role: 'verified' });
      Alert.alert('Success', 'User has been verified.');
      navigation.goBack();
    } catch (error) {
      console.error('Error verifying user:', error);
      Alert.alert('Error', 'Failed to verify user.');
    }
  };

  const handleReject = async () => {
    try {
      await axios.delete(`${config.address}/api/user/delete/${user._id}`);
      Alert.alert('Success', 'User has been rejected.');
      navigation.goBack();
    } catch (error) {
      console.error('Error rejecting user:', error);
      Alert.alert('Error', 'Failed to reject user.');
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
            <Text style={styles.detailValue}>{user.p_birthdate}</Text>
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
            onPress={handleReject}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.verifyButton]} 
            onPress={handleVerify}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
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
});

export default PendingUserDetails;