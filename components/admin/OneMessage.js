import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet,
  FlatList, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import config from '../../server/config/config';

// Create socket connection outside component
const socket = io(`${config.address}`, {
  secure: true,
  transports: ['websocket', 'polling']
});

const OneMessage = ({ navigation, route }) => {
  const { userId, userName, userImage } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const flatListRef = useRef(null);
  const adminId = '670a04a34f63c22acf3d8c9a';
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (adminId) {
      // Join room with admin ID
      socket.emit('joinRoom', adminId);
    }

    return () => {
      socket.off('receiveMessage');
    };
  }, [adminId]);

  useEffect(() => {
    fetchUsers();
    if (userId) {
      fetchMessages(userId);
    }
  }, [userId]);

  useEffect(() => {
    socket.on('receiveMessage', (newMessage) => {
      // Add new message to messages list
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      // Update the latest message in users list
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === newMessage.senderId || user._id === newMessage.receiverId
            ? { ...user, latestMessage: newMessage.message }
            : user
        )
      );
      
      scrollToBottom();
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${config.address}/api/messages/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(response.data)) {
        const sortedUsers = response.data.map(user => ({
          ...user,
          latestMessage: user.latestMessage || { message: 'No messages yet' }
        }));
        
        setUsers(sortedUsers);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      Alert.alert('Error', 'Failed to load users');
    }
  };

  const fetchMessages = async (selectedUserId) => {
    try {
      if (!selectedUserId) return;
      
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${config.address}/api/messages/${adminId}/${selectedUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !userId || isSending) return;

    setIsSending(true);

    const newMessage = {
      senderId: adminId,
      receiverId: userId,
      message: message.trim(),
    };

    // Emit the message through socket
    socket.emit('sendMessage', newMessage);

    // Update the local messages state immediately
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage('');
    scrollToBottom();
    setIsSending(false);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (flatListRef.current && messages.length > 0) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString([], {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
    });
  };

  const renderMessage = ({ item }) => {
    const isAdmin = item.senderId === adminId;
    const isPending = item.pending;
    const isFailed = item.error;
    
    return (
      <View style={[styles.messageRow, isAdmin ? styles.alignRight : styles.alignLeft]}>
        {!isAdmin && (
          <Image
            source={userImage ? { uri: userImage } : require('../../assets/Images/user.png')}
            style={styles.avatar}
          />
        )}
        <View style={[
          styles.bubble, 
          isAdmin ? styles.adminBubble : styles.userBubble,
          isPending && styles.pendingBubble,
          isFailed && styles.failedBubble
        ]}>
          <Text style={isAdmin ? styles.adminText : styles.userText}>
            {item.message}
          </Text>
          <Text style={styles.timeText}>
            {isPending ? 'Sending...' : 
             isFailed ? 'Failed to send' : 
             formatMessageTime(item.createdAt)}
          </Text>
        </View>
        {isAdmin && (
          <Image
            source={require('../../assets/Images/nobglogo.png')}
            style={styles.avatar}
          />
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#fff" />
        </TouchableOpacity>
        <Image
          source={userImage ? { uri: userImage } : require('../../assets/Images/user.png')}
          style={styles.headerAvatar}
        />
        <Text style={styles.headerTitle}>{userName}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item._id || `msg-${index}`}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#ccc"
          multiline
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity 
          onPress={handleSendMessage} 
          style={[styles.sendButton, (isSending || !message.trim()) && styles.disabledButton]}
          disabled={isSending || !message.trim()}
        >
          <MaterialIcons 
            name="send" 
            size={24} 
            color={isSending || !message.trim() ? '#aaa' : '#fff'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A67D8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 4,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 8,
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  messagesContainer: {
    padding: 12,
    paddingBottom: 80,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-end',
  },
  alignLeft: {
    justifyContent: 'flex-start',
  },
  alignRight: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 6,
  },
  bubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 14,
  },
  userBubble: {
    backgroundColor: '#E2E8F0',
    borderTopLeftRadius: 0,
  },
  adminBubble: {
    backgroundColor: '#5A67D8',
    borderTopRightRadius: 0,
  },
  pendingBubble: {
    opacity: 0.7,
  },
  failedBubble: {
    backgroundColor: '#ffcccc',
  },
  userText: {
    color: '#333',
    fontSize: 15,
  },
  adminText: {
    color: '#fff',
    fontSize: 15,
  },
  timeText: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#5A67D8',
    borderRadius: 20,
    padding: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});

export default OneMessage;