import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import io from 'socket.io-client/dist/socket.io';
import config from '../../server/config/config';
import AdminImg from '../../assets/Images/nobglogo.png';
import UserPh from '../../assets/Images/user.png';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import jwtDecode from 'jwt-decode';


const MessageShelter = ({ route, navigation }) => {
  const adminId = "670a04a34f63c22acf3d8c9a";
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState(null);
  
  const receiverId = adminId;
  const receiverName = "Pasay City Animal Shelter";
  const receiverImage = AdminImg;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  const socket = useRef(null);

  // Get user data from token
  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert("Login Required", "Please log in to send messages");
          navigation.goBack();
          return;
        }
  
        const decoded = jwtDecode(token);
        console.log('Decoded user token:', decoded);
        if (!decoded.id) {
          throw new Error("Invalid token format");
        }
  
        setCurrentUserId(decoded.id);
        setUserName(decoded.name || 'User');
        
        // Properly handle user image
        if (decoded.image) {
          // Check if image is a full URL or needs server path
          const imageUri = decoded.image.startsWith('http') 
            ? decoded.image 
            : `${config.address}${decoded.image}`;
          setUserImage({ uri: imageUri });
        } else {
          setUserImage(UserPh);
        }
  
      } catch (error) {
        console.error("Error getting user data:", error);
        Alert.alert("Error", "Failed to load user data");
        navigation.goBack();
      }
    };
  
    getUserData();
  }, []);

  // Network connectivity handler
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Network state changed:', state.isConnected);
      setIsConnected(state.isConnected);
      if (state.isConnected && socket.current && !socket.current.connected) {
        socket.current.connect();
      }
    });

    return () => unsubscribe();
  }, []);

  // Socket.io connection setup
  useEffect(() => {
    if (!currentUserId) return;

    const socketUrl = config.address.replace('https://', 'wss://');
    
    const socketOptions = {
      transports: ['websocket'],
      secure: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      rejectUnauthorized: false,
      forceNew: true,
      timeout: 10000,
      pingTimeout: 30000,
      pingInterval: 25000,
      extraHeaders: __DEV__ ? {
              'Origin': Platform.OS === 'android' ? 'http://10.0.2.2' : 'http://localhost',
            } : undefined
    };

    socket.current = io(socketUrl, socketOptions);

    socket.current.on('connect', () => {
      console.log('✅ User Chat Socket connected! ID:', socket.current.id);
      socket.current.emit('joinRoom', currentUserId);
    });

    socket.current.on('connect_error', (err) => {
      console.log('🔥 User Chat Connection error:', err.message);
      Alert.alert("Connection Error", "Failed to connect to the server");
    });

    socket.current.on('disconnect', (reason) => {
      console.log('❌ User Chat Socket disconnected:', reason);
    });

    socket.current.on('receiveMessage', (newMessage) => {
      console.log('User received new message:', newMessage);
      if (newMessage.senderId === receiverId || newMessage.senderId === currentUserId) {
        setMessages(prev => [...prev, newMessage]);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.off('receiveMessage');
        socket.current.disconnect();
      }
    };
  }, [currentUserId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Fetch messages when we have valid IDs
  useEffect(() => {
    if (currentUserId && receiverId) {
      fetchMessages();
    }
  }, [currentUserId, receiverId]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
  
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error("No token found");
      }
  
      const response = await fetch(
        `${config.address}/api/messages/${currentUserId}/${receiverId}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
  
      const data = await response.json();
      
  
      // Sort messages by creation time
      const sortedMessages = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to load messages.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      Alert.alert("Error", "Message cannot be empty");
      return;
    }

    if (!isConnected) {
      Alert.alert("Error", "No network connection");
      return;
    }

    if (!currentUserId) {
      Alert.alert("Error", "User not identified");
      return;
    }

    setIsLoading(true);
  
    try {
      const newMessage = {
        senderId: currentUserId,
        receiverId: receiverId,
        message: message.trim(),
      };

      console.log('Sending message:', newMessage);
      socket.current.emit("sendMessage", newMessage);
    
      const messageWithTimestamp = {
        ...newMessage,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
    
      setMessages(prev => [...prev, messageWithTimestamp]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageItem = ({ item }) => (
    <View
      style={[
        styles.messageWrapper,
        item.senderId === currentUserId ? styles.senderWrapper : styles.receiverWrapper,
      ]}
    >
      {item.senderId === currentUserId ? (
        <>
          <View style={[styles.messageContainer, styles.senderMessage]}>
            <Text style={styles.senderMessageText}>{item.message}</Text>
            <Text style={styles.senderTimestamp}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <Image 
            source={userImage} 
            style={styles.senderAvatar} 
            onError={() => setUserImage(UserPh)} // Fallback to default image if error
          />
        </>
      ) : (
        <>
          <Image 
            source={receiverImage} 
            style={styles.receiverAvatar} 
          />
          <View style={[styles.messageContainer, styles.receiverMessage]}>
            <Text style={styles.receiverMessageText}>{item.message}</Text>
            <Text style={styles.receiverTimestamp}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </>
      )}
    </View>
  );
  if (!currentUserId) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={32} color="#FF69B4" />
        </TouchableOpacity>
        <Image
          source={receiverImage}
          style={styles.headerAvatar}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>{receiverName}</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesContent}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Loading messages...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
            </View>
          )
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
          editable={!isLoading && isConnected}
          multiline
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={[
            styles.sendButton,
            (isLoading || !isConnected) && styles.disabledButton
          ]}
          disabled={isLoading || !isConnected}
        >
          <MaterialIcons 
            name="send" 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#FF69B4",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 6,
    backgroundColor: '#f5f5f5',
  },
  messagesContent: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  messageWrapper: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "flex-end",
  },
  senderWrapper: {
    justifyContent: "flex-end",
  },
  receiverWrapper: {
    justifyContent: "flex-start",
  },
  messageContainer: {
    borderRadius: 18,
    padding: 12,
    maxWidth: "70%",
    marginHorizontal: 8,
  },
  senderMessage: {
    backgroundColor: "#FF69B4",
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  receiverMessage: {
    backgroundColor: "white",
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  senderMessageText: {
    fontSize: 16,
    color: "white",
  },
  receiverMessageText: {
    fontSize: 16,
    color: "#333",
  },
  senderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#eee',
  },
  receiverAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  senderTimestamp: {
    fontSize: 12,
    marginTop: 4,
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
  },
  receiverTimestamp: {
    fontSize: 12,
    marginTop: 4,
    color: "rgba(0,0,0,0.5)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: "#FF69B4",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default MessageShelter;