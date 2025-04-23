import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { ApplicationProvider, Input, Button, Layout } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../../server/config/config';
import AppBar from '../design/AppBar';

const Profile = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  let [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('No access token found.');
        setLoading(false);
        navigation.replace('Login');
        return;
      }

      try {
        const response = await axios.get(`${config.address}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,  
            'Content-Type': 'application/json'
          }
        });

        const user = response.data.user;
        setProfileData(user);
        setEditableData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          birthday: user.birthday || '',
          gender: user.gender || '',
          address: user.address || '',
          contactNumber: user.contactNumber ? user.contactNumber.toString() : '',
          email: user.email || ''
        });

        if (user.profileImage) {
          // Construct proper image URL
          const imageUrl = `${config.address}${user.profileImage.replace(/\\/g, '/')}`;
          console.log('Profile image URL:', imageUrl); // For debugging
          setImage(imageUrl);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.response?.data?.message || 'Failed to fetch profile');
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('authToken');
          navigation.replace('Login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error("No access token found.");
        return;
      }

      setUploading(true);
      const response = await axios.put(
        `${config.address}/api/user/profile/update`, 
        editableData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        setProfileData({ ...profileData, ...editableData });
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (name, value) => {
    setEditableData({ ...editableData, [name]: value });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      setUploading(true);
      
      const formData = new FormData();
      formData.append('profileImage', {
        uri,
        type: 'image/jpeg',
        name: 'profile.jpg'
      });

      const response = await axios.put(
        `${config.address}/api/user/profile/image`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        const imageUrl = `${config.address}/${response.data.imagePath.replace(/\\/g, '/')}`;
        setImage(imageUrl);
        Alert.alert("Success", "Profile image updated!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to update profile image.");
    } finally {
      setUploading(false);
    }
  };

  const formatContactNumber = (number) => {
    if (!number) return '';
    const numStr = number.toString();
    return `+${numStr.slice(0, 2)} ${numStr.slice(2, 5)} ${numStr.slice(5, 8)} ${numStr.slice(8)}`;
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff69b4" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          onPress={() => navigation.replace('Login')}
          style={styles.loginButton}
        >
          Go to Login
        </Button>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text>No profile data available</Text>
      </View>
    );
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layout style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <AppBar />
          <View style={styles.header}>
            <TouchableOpacity onPress={pickImage} disabled={uploading}>
              <Image
                source={
                  image ? { uri: image } : 
                  require('../../assets/Images/user.png')
                }
                style={styles.profileImage}
                onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
              />
              {uploading && (
                <View style={styles.imageOverlay}>
                  <ActivityIndicator color="white" />
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.username}>{profileData.username}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Information</Text>
            <Input
              label="First Name"
              value={editableData.firstName}
              onChangeText={(text) => handleChange('firstName', text)}
              disabled={!isEditing}
              style={styles.input}
              textStyle={styles.inputText}
            />
            <Input
              label="Last Name"
              value={editableData.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
              disabled={!isEditing}
              style={styles.input}
              textStyle={styles.inputText}
            />
            <Input
              label="Birthday"
              value={editableData.birthday}
              onChangeText={(text) => handleChange('birthday', text)}
              disabled={!isEditing}
              style={styles.input}
              textStyle={styles.inputText}
            />
            <Input
              label="Gender"
              value={editableData.gender}
              onChangeText={(text) => handleChange('gender', text)}
              disabled={!isEditing}
              style={styles.input}
              textStyle={styles.inputText}
            />
            <Input
              label="Address"
              value={editableData.address}
              onChangeText={(text) => handleChange('address', text)}
              disabled={!isEditing}
              style={styles.input}
              textStyle={styles.inputText}
              multiline
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <Input
              label="Contact Number"
              value={formatContactNumber(editableData.contactNumber)}
              disabled
              style={styles.input}
              textStyle={styles.inputText}
            />
            <Input
              label="Email"
              value={editableData.email}
              disabled
              style={styles.input}
              textStyle={styles.inputText}
            />
          </View>

          <View style={styles.buttonContainer}>
            {isEditing ? (
              <Button 
                style={styles.saveButton} 
                onPress={handleSaveClick}
                disabled={uploading}
              >
                {uploading ? 'Saving...' : 'SAVE CHANGES'}
              </Button>
            ) : (
              <Button 
                style={styles.editButton} 
                onPress={handleEditClick}
              >
                EDIT PROFILE
              </Button>
            )}
          </View>
        </ScrollView>
      </Layout>
    </ApplicationProvider>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: '#FF5252',
    marginBottom: 20,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#ff69b4',
    borderColor: '#ff69b4',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ff69b4',
  },
  imageOverlay: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333333',
    fontFamily: 'Inter_700Bold',
  },
  adoptionsButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#ff69b4',
    borderColor: '#ff69b4',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#ff69b4',
    fontFamily: 'Inter_700Bold',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  inputText: {
    color: '#333333',
  },
  buttonContainer: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  editButton: {
    borderRadius: 8,
    backgroundColor: '#ff69b4',
    borderColor: '#ff69b4',
  },
  saveButton: {
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
};

export default Profile;