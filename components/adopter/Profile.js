import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity,
  StyleSheet,
  Animated,
  TextInput
} from 'react-native';
import { Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts, Inter_700Bold, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
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
    Inter_600SemiBold,
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
          const imageUrl = `${config.address}${user.profileImage.replace(/\\/g, '/')}`;
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
        <TouchableOpacity 
          onPress={() => navigation.replace('Login')}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
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
    <View style={styles.container}>
      <AppBar title="My Profile" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage} disabled={uploading}>
            <Image
              source={
                image ? { uri: image } : 
                require('../../assets/Images/user.png')
              }
              style={styles.profileImage}
            />
            {uploading && (
              <View style={styles.imageOverlay}>
                <ActivityIndicator color="white" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.username}>{profileData.username}</Text>
          
          <View style={styles.statusContainer}>
            <MaterialIcons name="verified-user" size={18} color="white" />
            <Text style={styles.statusText}>Verified User</Text>
          </View>
        </View>

        {/* User Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <Divider style={styles.divider} />
          
          {[
            { icon: 'person-outline', label: 'First Name', value: editableData.firstName },
            { icon: 'person-outline', label: 'Last Name', value: editableData.lastName },
            { icon: 'cake', label: 'Birthday', value: editableData.birthday },
            { icon: 'wc', label: 'Gender', value: editableData.gender },
            { icon: 'location-on', label: 'Address', value: editableData.address },
          ].map((item, index) => (
            <View key={index}>
              <View style={styles.detailRow}>
                <MaterialIcons name={item.icon} size={20} color="#ff69b4" />
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>{item.label}</Text>
                </View>
                {isEditing ? (
                  <TextInput
                    style={styles.editableValue}
                    value={item.value}
                    onChangeText={(text) => handleChange(item.label.replace(' ', '').toLowerCase(), text)}
                  />
                ) : (
                  <View style={styles.valueContainer}>
                    <Text style={styles.value}>{item.value || 'Not specified'}</Text>
                  </View>
                )}
              </View>
              <Divider style={styles.divider} />
            </View>
          ))}
        </View>

        {/* Contact Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <Divider style={styles.divider} />
          
          {[
            { icon: 'phone', label: 'Contact Number', value: editableData.contactNumber },
            { icon: 'email', label: 'Email', value: editableData.email },
          ].map((item, index) => (
            <View key={index}>
              <View style={styles.detailRow}>
                <MaterialIcons name={item.icon} size={20} color="#ff69b4" />
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>{item.label}</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.value}>{item.value || 'Not specified'}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {isEditing ? (
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleSaveClick}
              disabled={uploading}
            >
              <Text style={styles.buttonText}>
                {uploading ? 'Saving...' : 'SAVE CHANGES'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.editButton]} 
              onPress={handleEditClick}
            >
              <Text style={styles.buttonText}>EDIT PROFILE</Text>
            </TouchableOpacity>
          )}
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
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF5252',
    marginBottom: 20,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  loginButton: {
    backgroundColor: '#ff69b4',
    padding: 15,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  profileHeader: {
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
    marginTop: 15,
    color: '#333',
    fontFamily: 'Inter_700Bold',
  },
  statusContainer: {
    flexDirection: 'row',
    backgroundColor: '#ff69b4',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
    fontFamily: 'Inter_600SemiBold',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#ff69b4',
    fontFamily: 'Inter_700Bold',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  labelContainer: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 15,
    color: '#353935',
    fontFamily: 'Inter_500Medium',
  },
  valueContainer: {
    flex: 2,
  },
  value: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'Inter_500Medium',
    textAlign: 'right',
  },
  editableValue: {
    flex: 2,
    fontSize: 15,
    color: '#333',
    fontFamily: 'Inter_500Medium',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 0,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  editButton: {
    backgroundColor: '#ff69b4',
  },
  saveButton: {
    backgroundColor: '#cad47c',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default Profile;