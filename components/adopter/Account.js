import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
import config from '../../server/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Account = ({ navigation }) => {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    address: '',
    avatar: require('../../assets/Images/user.png'),
    birthday: '',
    gender: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          navigation.replace('Login');
          return;
        }

        setAvatarLoading(true);
        const response = await axios.get(`${config.address}/api/user/profile`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const user = response.data.user;
        const fullName = `${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}`;
        
        let avatarSource = require('../../assets/Images/user.png');
        if (user.avatar) {
          try {
            const avatarUrl = `${config.address}/${user.avatar.replace(/\\/g, '/')}`;
            await Image.prefetch(avatarUrl);
            avatarSource = { uri: avatarUrl };
          } catch (imgError) {
            console.log('Using default avatar due to error:', imgError);
          }
        }
        
        setUserData({
          username: user.username || '',
          firstName: user.firstName || '',
          middleName: user.middleName || '',
          lastName: user.lastName || '',
          fullName,
          email: user.email || '',
          contactNumber: user.contactNumber || '',
          address: user.address || '',
          birthday: user.birthday || '',
          gender: user.gender || '',
          role: user.role || '',
          avatar: avatarSource
        });
        
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again.');
        
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('authToken');
          navigation.replace('Login');
        }
      } finally {
        setLoading(false);
        setAvatarLoading(false);
      }
    };

    fetchUserData();
  }, [navigation]);

  let [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff69b4" />
      </View>
    );
  }

  const handleAdopt = () => {
    navigation.navigate('My Adoptions');
  };

  const handleProfile = () => {
    navigation.navigate('Profile', { userData });
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
    setLogoutModalVisible(false);
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatContactNumber = (number) => {
    if (!number) return 'Not specified';
    const numStr = String(number);
    if (numStr.startsWith('63')) {
      return `+63 ${numStr.slice(2, 5)} ${numStr.slice(5, 8)} ${numStr.slice(8)}`;
    }
    return numStr;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff69b4" />
        <Text style={styles.loadingText}>Loading your account...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            useEffect(() => {}, []);
          }}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <PaperProvider>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            {avatarLoading ? (
              <View style={styles.avatarPlaceholder}>
                <ActivityIndicator size="small" color="#ff69b4" />
              </View>
            ) : (
              <Image 
                source={userData.avatar} 
                style={styles.avatar}
                resizeMode="cover"
                onError={() => {
                  setUserData(prev => ({
                    ...prev,
                    avatar: require('../../assets/Images/user.png')
                  }));
                }}
              />
            )}
            <View style={styles.userInfo}>
              <Text style={styles.welcome}>Hello, </Text>
              <Text style={styles.welcome2}>{userData.username || 'User'}!</Text>
              <Text style={styles.userRole}>{userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : ''}</Text>
            </View>
          </View>
        </View>

        {/* <View style={styles.userDetailsContainer}>
          <Text style={styles.detailsHeader}>Account Information</Text>
          <View style={styles.detailsContent}>
            <Text style={styles.detailLabel}>Full Name: <Text style={styles.detailValue}>{userData.fullName}</Text></Text>
            <Text style={styles.detailLabel}>Email: <Text style={styles.detailValue}>{userData.email || 'Not specified'}</Text></Text>
            <Text style={styles.detailLabel}>Birthday: <Text style={styles.detailValue}>{formatDate(userData.birthday)}</Text></Text>
            <Text style={styles.detailLabel}>Gender: <Text style={styles.detailValue}>{userData.gender || 'Not specified'}</Text></Text>
            <Text style={styles.detailLabel}>Contact: <Text style={styles.detailValue}>{formatContactNumber(userData.contactNumber)}</Text></Text>
            <Text style={styles.detailLabel}>Address: <Text style={styles.detailValue}>{userData.address || 'Not specified'}</Text></Text>
          </View>
        </View> */}
        
        <View style={styles.navContainer}>
          <TouchableOpacity style={styles.navButton} onPress={handleProfile}>
            <Text style={styles.navButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleAdopt}>
            <Text style={styles.navButtonText}>My Adoptions</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={logoutModalVisible}
          onRequestClose={cancelLogout}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Logout</Text>
              <Text style={styles.modalText}>Are you sure you want to log out?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={cancelLogout}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={confirmLogout}
                >
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
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter_500Medium',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F4F4F4',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3333',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter_500Medium',
  },
  retryButton: {
    backgroundColor: '#ff69b4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  header: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#ff69b4',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#ff69b4',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  userInfo: {
    flex: 1,
  },
  welcome: {
    fontFamily: 'Inter_500Medium',
    color: '#333',
    fontSize: 20,
  },
  welcome2: {
    fontFamily: 'Inter_700Bold',
    color: '#ff69b4',
    fontSize: 24,
  },
  userRole: {
    fontFamily: 'Inter_500Medium',
    color: '#666',
    fontSize: 14,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  userDetailsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailsHeader: {
    fontSize: 20,
    color: '#ff69b4',
    fontFamily: 'Inter_700Bold',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  detailsContent: {
    marginLeft: 4,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    marginVertical: 6,
    color: '#555',
  },
  detailValue: {
    fontFamily: 'Inter_700Bold',
    color: '#333',
  },
  navContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 16,
  },
  navButton: {
    width: '90%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    paddingLeft: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
  },
  navButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#333',
  },
  bottomContainer: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  logoutButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#ff69b4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  modalText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#ff69b4',
    marginLeft: 8,
  },
  modalButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: 'white',
  },
});

export default Account;