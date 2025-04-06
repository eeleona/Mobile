import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Divider } from 'react-native-paper';
import AppBar from '../design/AppBar'; // Import your custom AppBar
import axios from 'axios';
import config from '../../server/config/config';

const PendingUserDetails = ({ route, navigation }) => {
  const { user } = route.params;

  // Handle Verify User
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

  // Handle Reject User
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
        <View style={styles.profile}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.profileImage}
              source={{ uri: `${config.address}${user.p_img}` }}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.name}>{user.p_fname} {user.p_mname}. {user.p_lname}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.detail}>Username: {user.p_username}</Text>
          <Text style={styles.detail}>Email Address: {user.p_emailadd}</Text>
          <Text style={styles.detail}>Contact Number: {user.p_contactnumber}</Text>
          <Text style={styles.detail}>Address: {user.p_add}</Text>
          <Text style={styles.detail}>Gender: {user.p_gender}</Text>
          <Text style={styles.detail}>Birthday: {user.p_birthdate}</Text>
          <Text style={styles.detail}>Role: {user.p_role}</Text>
        </View>
        <View style={styles.validID}>
          <Text style={styles.sectionTitle}>Valid ID</Text>
          <View style={styles.imageContainer}>
            <Image
              style={styles.validIdImage}
              source={{ uri: `${config.address}${user.p_validID}` }}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
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
    backgroundColor: '#f6f6f6',
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  profile: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  validID: {
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  validIdImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  name: {
    fontSize: 24,
    color: '#ff69b4',
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
  },
  detail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Inter_500Medium',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 10,
    fontFamily: 'Inter_700Bold',
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
  verifyButton: {
    backgroundColor: '#adc890',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    
  },
  rejectButton: {
    backgroundColor: '#d95555',
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

export default PendingUserDetails;