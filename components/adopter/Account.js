import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
import config from '../../server/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Account = ({ navigation }) => {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    fullName: '',
    email: '',
    contactNumber: '',
    address: '',
    avatar: require('../../assets/Images/user.png'),
    birthdate: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const response = await axios.get(`${config.API_URL}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const user = response.data;
          setUserData({
            username: user.username || '',
            fullName: user.fullName || '',
            email: user.email || '',
            contactNumber: user.contactNumber || '',
            address: user.address || '',
            birthdate: user.birthdate || '',
            avatar: user.avatar 
              ? { uri: `${config.API_URL}/${user.avatar}` } 
              : require('../../assets/Images/user.png')
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  let [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
  });

  if (!fontsLoaded || loading) {
    return null;
  }

  const handleAdopt = () => {
    navigation.navigate('My Adoptions');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setLogoutModalVisible(false);
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Image 
              source={userData.avatar} 
              style={styles.avatar} 
              onError={() => setUserData(prev => ({
                ...prev,
                avatar: require('../../assets/Images/user.png')
              }))}
            />
            <View style={styles.userInfo}>
              <Text style={styles.welcome}>Hello, </Text>
              <Text style={styles.welcome2}>{userData.username || 'User'}!</Text>
            </View>
          </View>
        </View>

        <View style={styles.userDetailsContainer}>
          <Text style={styles.detailsHeader}>Account Information</Text>
          <View style={styles.detailsContent}>
            <Text style={styles.detailLabel}>Full Name: <Text style={styles.detailValue}>{userData.fullName}</Text></Text>
            <Text style={styles.detailLabel}>Email: <Text style={styles.detailValue}>{userData.email}</Text></Text>
            <Text style={styles.detailLabel}>Birthdate: <Text style={styles.detailValue}>{formatDate(userData.birthdate)}</Text></Text>
            <Text style={styles.detailLabel}>Contact Number: <Text style={styles.detailValue}>{userData.contactNumber}</Text></Text>
            <Text style={styles.detailLabel}>Address: <Text style={styles.detailValue}>{userData.address}</Text></Text>
          </View>
        </View>
        
        <View style={styles.navContainer}>
          <TouchableOpacity style={styles.nav} onPress={handleProfile}>
            <Text style={styles.navtext}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nav} onPress={handleAdopt}>
            <Text style={styles.navtext}>My Adoptions</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Confirmation Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={logoutModalVisible}
          onRequestClose={() => setLogoutModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Logout</Text>
              <Text style={styles.modalText}>Are you sure you want to log out?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButtonCancel} onPress={cancelLogout}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonConfirm} onPress={confirmLogout}>
                  <Text style={styles.modalButtonText}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
  },
  header: {
    width: '95%',
    height: 110,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
    elevation: 3,
    flexDirection: 'row',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  welcome: {
    fontFamily: 'Inter_500Medium',
    color: 'black',
    fontSize: 30,
  },
  welcome2: {
    fontFamily: 'Inter_700Bold',
    color: '#ff69b4',
    fontSize: 30,
    marginLeft: 5,
  },
  userDetailsContainer: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  detailsHeader: {
    fontSize: 22,
    color: '#ff69b4',
    fontFamily: 'Inter_700Bold',
    marginBottom: 10,
  },
  detailsContent: {
    marginLeft: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    marginVertical: 5,
    color: '#555',
  },
  detailValue: {
    fontFamily: 'Inter_700Bold',
    color: '#333',
  },
  navContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  nav: {
    width: '95%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    padding: 10,
    elevation: 3,
    marginBottom: 10,
  },
  navtext: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    marginBottom: 30,
    alignItems: 'center',
  },
  logoutButton: {
    width: '95%',
    height: 50,
    backgroundColor: '#ff69b4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  logoutText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
    alignItems: 'center',
  },
  modalButtonConfirm: {
    flex: 1,
    backgroundColor: '#ff69b4',
    borderRadius: 5,
    padding: 10,
    marginLeft: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    fontFamily: 'Inter_500Medium',
    color: 'white',
  },
});

export default Account;