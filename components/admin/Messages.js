import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  StyleSheet, FlatList, Animated, Easing, StatusBar
} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import config from '../../server/config/config';

const AdminImg = require('../../assets/Images/nobglogo.png');
const UserPh = require('../../assets/Images/user.png');

const Messages = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [latestMessage, setLatestMessage] = useState(null);
  const adminId = '670a04a34f63c22acf3d8c9a';
  const socket = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

    // Handle socket events
    socket.current.on('connect', () => {
      console.log('✅ Socket connected! ID:', socket.current.id);
      // No need for separate joinRoom emit if using query params
    });
  
    socket.current.on('connect_error', (err) => {
      console.log('🔥 Connection failed:', {
        error: err.message,
        type: err.type,
        url: socketUrl(),
        attemptedOptions: socketOptions
      });
    });

    socket.current.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    socket.current.on('receiveMessage', (newMessage) => {
      console.log('Received message:', newMessage);
      if (newMessage.senderId === adminId || newMessage.receiverId === userId) {
        setLatestMessage(newMessage);
      }
      // Handle incoming message update logic
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);
  

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!socket.current) return;

    socket.current.on('receiveMessage', (newMessage) => {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === newMessage.senderId || user._id === newMessage.receiverId
            ? { ...user, latestMessage: newMessage }
            : user
        )
      );
    });

    return () => {
      if (socket.current) socket.current.off('receiveMessage');
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const [usersRes, messagesRes] = await Promise.all([
        axios.get(`${config.address}/api/messages/users`),
        axios.get(`${config.address}/api/messages/latest-messages`)
      ]);
  
      const usersData = usersRes.data;
      const latestMessages = messagesRes.data;
  
      // Attach the latest message to each user
      const usersWithLatestMessages = usersData.map(user => {
        // Find the latest message involving this user
        const matchedMsg = latestMessages.find(
          msg =>
            msg.senderId === user._id || msg.receiverId === user._id
        );
  
        return {
          ...user,
          latestMessage: matchedMsg
            ? {
                message: matchedMsg.latestMessage,
                createdAt: matchedMsg.createdAt
              }
            : { message: 'No messages yet' }
        };
      });
  
      setUsers(usersWithLatestMessages);
      setFilteredUsers(usersWithLatestMessages);
  
      // Animate list appearance
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
  
    } catch (error) {
      console.error('Failed to fetch users or messages:', error);
    }
  };
  

  const handleSearchChange = (text) => {
    const value = text.toLowerCase();
    setSearchTerm(value);
    const filtered = value.trim() === ''
      ? users
      : users.filter(user =>
          user.name.toLowerCase().includes(value)
        );
    setFilteredUsers(filtered);
  };

  const handleUserSelection = (user) => {
    navigation.navigate('Chat History', {
      userId: user._id,
      userName: user.name,
      userImage: user.image
        ? `${config.address}/${user.image.replace(/^\/+/, '')}`.replace('undefined/', '')
        : null
    });
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderUserItem = ({ item }) => {
    const userImage = item.image
      ? { uri: `${config.address}/${item.image.replace(/^\/+/, '')}`.replace('undefined/', '') }
      : UserPh;

    return (
      <TouchableOpacity style={styles.userItem} onPress={() => handleUserSelection(item)}>
        <Image source={userImage} style={styles.userImage} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userLastMessage} numberOfLines={1}>
            {item.latestMessage?.message || 'No messages yet'}
          </Text>
        </View>
        <Text style={styles.messageTimeSmall}>
          {formatMessageTime(item.latestMessage?.createdAt)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="default" />
      <View style={styles.header}>
        <Image source={AdminImg} style={styles.logo} />
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={22} color="#ff69b4" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          value={searchTerm}
          onChangeText={handleSearchChange}
          placeholderTextColor="#aaa"
        />
      </View>

      <Animated.FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item._id}
        style={[styles.userList, { opacity: fadeAnim }]}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff69b4',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  userList: {
    flex: 1,
    marginBottom: 60,
  },
  listContent: {
    paddingBottom: 30,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  userImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ff69b4',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2a2a2a',
  },
  userLastMessage: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  messageTimeSmall: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default Messages;