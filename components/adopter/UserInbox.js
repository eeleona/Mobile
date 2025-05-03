import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, Image, TouchableOpacity, 
  StyleSheet, FlatList, StatusBar, Alert 
} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import RecepientLogo from '../../assets/Images/nobglogo.png';
import config from '../../server/config/config';
import { MaterialIcons } from '@expo/vector-icons';

const AdminImg = require('../../assets/Images/nobglogo.png');

const UserInbox = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latestMessage, setLatestMessage] = useState(null);
  const adminId = '670a04a34f63c22acf3d8c9a';
  const socket = useRef(null);

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.log('No token found. Redirecting to login.');
          navigation.navigate('LogIn');
          return;
        }

        const decoded = jwtDecode(token);
        console.log('Decoded user:', decoded);

        if (!decoded?.id) {
          console.log('Invalid token structure. Redirecting to login.');
          navigation.navigate('LogIn');
          return;
        }

        setUserId(decoded.id);
      } catch (error) {
        console.error('Error decoding token:', error);
        Alert.alert('Error', 'Session expired. Please log in again.');
        navigation.navigate('LogIn');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Setup socket connection
  useEffect(() => {
    if (!userId) return;

    const socketUrl = () => {
      if (__DEV__) {
        // For development, remove port if already included in config.address
        const baseUrl = config.address.replace(/^https?:\/\//, 'wss://');
        return baseUrl.includes(':') ? baseUrl : `${baseUrl}:8000`;
      }
      // For production - force secure connection
      return 'wss://api.e-pet-adopt.site:8000'; // Single port specification
    };

    const socketOptions = {
          transports: ['polling'],
          path: '/socket.io',
          secure: true,
          rejectUnauthorized: false, // TEMPORARY for debugging
          forceNew: true,
          timeout: 20000,
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
          pingTimeout: 25000,
          pingInterval: 20000,
          query: {
            adminId: '670a04a34f63c22acf3d8c9a' // Pass adminId as query parameter
          }
        };
      
        console.log('Connecting to WebSocket:', socketUrl());
      
        socket.current = io(socketUrl(), socketOptions);

    socket.current.on('connect', () => {
      console.log('✅ User Socket connected!');
    });

    socket.current.on('connect_error', (err) => {
      console.log('🔥 User Connection error:', err.message);
    });

    socket.current.on('disconnect', (reason) => {
      console.log('❌ User Socket disconnected:', reason);
    });

    socket.current.on('receiveMessage', (newMessage) => {
      console.log('📥 New incoming message:', newMessage);
      if (newMessage.senderId === adminId || newMessage.receiverId === userId) {
        setLatestMessage(newMessage);
      }
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [userId]);

  // Fetch latest messages
  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      try {
        console.log("Fetching messages for users:", adminId, userId);
        const response = await fetch(
          `${config.address}/api/messages/${adminId}/${userId}`,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.length > 0) {
          const sortedMessages = [...data].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setLatestMessage(sortedMessages[0]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        Alert.alert('Error', 'Failed to load messages.');
      }
    };

    fetchMessages();
  }, [userId]);

  const handleChatPress = () => {
    if (!userId) {
      Alert.alert('Login Required', 'Please log in to start chatting.');
      navigation.navigate('LogIn');
      return;
    }

    navigation.navigate('Message Shelter', {
      userId,
      adminId,
    });
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
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
      <StatusBar barStyle="default" />
      <View style={styles.header}>
        <Image source={AdminImg} style={styles.logo} />
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <TouchableOpacity style={styles.chatItem} onPress={handleChatPress}>
        <Image source={RecepientLogo} style={styles.chatImage} />
        <View style={styles.chatInfo}>
          <Text style={styles.chatName}>Pasay City Animal Shelter</Text>
          <Text style={styles.chatMessage}>
            {latestMessage ? latestMessage.message : 'No messages yet.'}
          </Text>
        </View>
        <View style={styles.chatMeta}>
          <Text style={styles.chatTime}>
            {latestMessage ? formatMessageTime(latestMessage.createdAt) : ''}
          </Text>
          
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16,
    backgroundColor: '#ff69b4',
  },
  logo: { width: 40, height: 40, marginRight: 12 },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  chatItem: { 
    flexDirection: 'row', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderColor: '#ddd', 
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  chatImage: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ff69b4',
  },
  chatInfo: { flex: 1 },
  chatName: { 
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#2a2a2a',
  },
  chatMessage: { 
    fontSize: 14, 
    color: '#777', 
    marginTop: 4 
  },
  chatMeta: { 
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  chatTime: { 
    fontSize: 12, 
    color: '#aaa',
    marginBottom: 4,
  },
});

export default UserInbox;