import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";
import NetInfo from '@react-native-community/netinfo';
import io from "socket.io-client";
import config from "../../server/config/config";
import UserPh from "../../assets/Images/user.png";
import AdminImg from "../../assets/Images/nobglogo.png";

const OneMessage = ({ route, navigation }) => {
  const { userId, userName, userImage } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const flatListRef = useRef(null);
  const socket = useRef(null);

  const adminId = "670a04a34f63c22acf3d8c9a".toString();

  // SSL workaround for Android in development
  useEffect(() => {
    if (__DEV__ && Platform.OS === 'android') {
      // const http = require('http');
      // const https = require('https');
      // const httpAgent = new http.Agent();
      // const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    
      global._fetch = global.fetch;
      global.fetch = (url, options) => {
        const agent = url.startsWith('https') ? httpsAgent : httpAgent;
        return global._fetch(url, { ...options, agent });
      };
    }
    
  }, []);

  // Socket.io connection setup
  useEffect(() => {
    const socketUrl = 'https://api.e-pet-adopt.site:8000';
  
  socket.current = io(socketUrl, {
    // Force WebSocket transport only
    transports: ['websocket'],
    
    // Set secure based on environment
    secure: !__DEV__,
    
    // Other options
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    rejectUnauthorized: !__DEV__,
    
    // For Android development
    agent: Platform.OS === 'android' && __DEV__ 
      ? new (require('https').Agent({ rejectUnauthorized: false })) 
      : undefined,
    });

    // Debugging events
    const socketEvents = [
      'connect',
      'connect_error',
      'disconnect',
      'error',
      'reconnect',
      'reconnect_attempt',
      'reconnecting',
      'reconnect_error',
      'reconnect_failed',
      'ping',
      'pong',
    ];
  
    socketEvents.forEach(event => {
      socket.current.on(event, (data) => {
        console.log(`Socket ${event}:`, data || '');
      });
    });
  
    socket.current.on('connect', () => {
      console.log('✅ Socket connected! ID:', socket.current.id);
      socket.current.emit('joinRoom', adminId);
    });
  
    socket.current.on('connect_error', (err) => {
      console.log('Connection error:', err);
      Alert.alert("Connection Error", "Failed to connect to the server");
    });
  
    socket.current.on('receiveMessage', (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
    });
  
    return () => {
      if (socket.current) {
        socket.current.off('receiveMessage');
        socket.current.disconnect();
      }
    };
  }, []);
  

  // Fetch messages when userId changes
  useEffect(() => {
    if (userId) {
      fetchMessages(userId);
    }
  }, [userId]);

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const fetchMessages = async (selectedUserId) => {
    try {
      console.log("Fetching messages for users:", adminId, selectedUserId);
      const response = await fetch(
        `${config.address}/api/messages/${adminId}/${selectedUserId}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Messages fetched successfully:", data.length);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      Alert.alert("Error", "Failed to load messages");
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !userId) return;
  
    setIsLoading(true);

    try {
      const newMessage = {
        senderId: adminId,
        receiverId: userId,
        message: message.trim(),
      };

      socket.current.emit("sendMessage", newMessage);

      const messageWithTimestamp = {
        ...newMessage,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, messageWithTimestamp]);
      setMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const isAdmin = item.senderId === adminId;

    return (
      <View
        style={[
          styles.messageContainer,
          isAdmin ? styles.adminMessage : styles.userMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Image
          source={userImage ? { uri: userImage } : UserPh}
          style={styles.userAvatar}
        />
        <Text style={styles.headerText}>{userName || "User"}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesContent}
        style={styles.messagesContainer}
        onContentSizeChange={scrollToBottom}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
          editable={!isLoading}
        />
        <TouchableOpacity 
          onPress={handleSendMessage} 
          style={[styles.sendButton, isLoading && styles.disabledButton]}
          disabled={isLoading}
        >
          <Text style={styles.sendButtonText}>{isLoading ? "..." : "Send"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  adminMessage: {
    alignSelf: "flex-end",
  },
  userMessage: {
    alignSelf: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    backgroundColor: "#e1f5fe",
    padding: 10,
    borderRadius: 8,
    maxWidth: "70%",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#2196f3",
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});


export default OneMessage;