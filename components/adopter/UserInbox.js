import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecepientLogo from '../../assets/Images/nobglogo.png';
import config from '../../server/config/config';

const AdminImg = require('../../assets/Images/nobglogo.png');
const UserInbox = () => {
  const navigation = useNavigation();
  const [senderId, setSenderId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(token);
        setSenderId(decodedToken.id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChatPress = () => {
    navigation.navigate('Message Shelter', {
      senderId: 'sampleSenderId', // Temporary hardcoded value for testing
      receiverId: '670a04a34f63c22acf3d8c9a', // Admin's fixed ID
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
              <Image source={AdminImg} style={styles.logo} />
              <Text style={styles.headerTitle}>Messages</Text>
            </View>
      
      <TouchableOpacity style={styles.chatItem} onPress={handleChatPress}>
        <Image source={RecepientLogo} style={styles.chatImage} />
        <View style={styles.chatContent}>
          <Text style={styles.chatName}>Pasay City Animal Shelter</Text>
          <Text style={styles.chatPreview}>Tap to view messages</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff69b4',
    marginTop: 35,
    paddingHorizontal: 15,
    height: 80,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  chatImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatPreview: {
    color: '#666',
    marginTop: 4,
  },
});

export default UserInbox;