import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import config from '../../server/config/config';

const AdminImg = require('../../assets/Images/nobglogo.png');
const UserPh = require('../../assets/Images/user.png');

const Messages = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(false);
  const adminId = '670a04a34f63c22acf3d8c9a';
  const [senderId, setSenderId] = useState(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(`${config.address}`, {
      transports: ['websocket'],
      forceNew: true,
      jsonp: false
    });

    if (adminId) {
      socket.current.emit('joinRoom', adminId);
    }

    return () => {
      if (socket.current) {
        socket.current.off('receiveMessage');
        socket.current.disconnect();
      }
    };
  }, [adminId]);

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
      const response = await axios.get(`${config.address}/api/messages/users`);
      if (Array.isArray(response.data)) {
        const sortedUsers = response.data.map(user => ({
          ...user,
          latestMessage: user.latestMessage || { message: 'No messages yet' },
        }));
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSearchChange = (text) => {
    const value = text.toLowerCase();
    setSearchTerm(value);
    setFilteredUsers(
      value.trim() === '' ? users : users.filter(user => 
        user.name.toLowerCase().includes(value)
      )
    );
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
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => handleUserSelection(item)}
      >
        <Image source={userImage} style={styles.userImage} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userLastMessage} numberOfLines={1}>
            {item.latestMessage?.message || 'No messages yet'}
          </Text>
        </View>
        <Text style={styles.messageTimeSmall}>
          {item.latestMessage?.createdAt 
            ? formatMessageTime(item.latestMessage.createdAt)
            : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={AdminImg} style={styles.logo} />
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for people"
          value={searchTerm}
          onChangeText={handleSearchChange}
          onFocus={() => setShowSearchBox(true)}
        />
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item._id}
        style={styles.userList}
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
  searchContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
  },
  userList: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 3,
  },
  userLastMessage: {
    color: '#666',
    fontSize: 14,
  },
  messageTimeSmall: {
    fontSize: 12,
    color: '#999',
  },
});

export default Messages;