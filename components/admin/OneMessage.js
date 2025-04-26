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
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const OneMessage = ({ route, navigation }) => {
  const { userId, userName, userImage } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const flatListRef = useRef(null);
  const socket = useRef(null);

  const adminId = "670a04a34f63c22acf3d8c9a".toString();

  // Network connectivity handler
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected && socket.current && !socket.current.connected) {
        socket.current.connect();
      }
    });

    return () => unsubscribe();
  }, []);

  // Socket.io connection setup
  useEffect(() => {
    const socketUrl = 'https://api.e-pet-adopt.site:8000';

    const socketOptions = {
      transports: ['websocket'],
      forceNew: true,
      upgrade: false,
      secure: true,
      rejectUnauthorized: false,
      timeout: 10000,
      pingTimeout: 30000,
      pingInterval: 25000,
      extraHeaders: __DEV__ ? {
        'Origin': Platform.OS === 'android' ? 'http://10.0.2.2' : 'http://localhost',
      } : undefined
    };

    socket.current = io(socketUrl, socketOptions);

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
      'pong'
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
    });

    return () => {
      if (socket.current) {
        socket.current.off('receiveMessage');
        socket.current.disconnect();
      }
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Fetch messages when userId changes
  useEffect(() => {
    if (userId) {
      fetchMessages(userId);
    }
  }, [userId]);

  const fetchMessages = async (selectedUserId) => {
    try {
      console.log("Fetching messages for users:", adminId, selectedUserId);
      const response = await fetch(
        `${config.address}/api/messages/${adminId}/${selectedUserId}`,
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
      console.log("Messages fetched successfully:", data.length);
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      Alert.alert("Error", "Failed to load messages");
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !userId || !isConnected) {
      Alert.alert("Error", "Cannot send message - no network connection");
      return;
    }

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
    
      setMessages((prevMessages) => [...prevMessages, messageWithTimestamp]);
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
        item.senderId === adminId ? styles.adminWrapper : styles.userWrapper,
      ]}
    >
      {item.senderId === adminId ? (
        <>
          <View style={styles.messageContainer}>
            <Text style={styles.adminMessageText}>{item.message}</Text>
            <Text style={styles.adminTimestamp}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <Image source={AdminImg} style={styles.adminAvatar} />
        </>
      ) : (
        <>
          <Image
            source={userImage ? { uri: userImage } : UserPh}
            style={styles.userAvatar}
          />
          <View style={styles.messageContainer}>
            <Text style={styles.userMessageText}>{item.message}</Text>
            <Text style={styles.userTimestamp}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </>
      )}
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
          <MaterialIcons name="keyboard-arrow-left" size={32} color="white" />
        </TouchableOpacity>
        <Image
          source={userImage ? { uri: userImage } : UserPh}
          style={styles.headerAvatar}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>{userName || "User"}</Text>
          <Text style={styles.statusText}>
            {isConnected ? 'Online' : 'Offline'}
          </Text>
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
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white", // Changed to white
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
    borderColor: "white",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    color: "#333", // Changed to dark color for white header
    fontSize: 18,
    fontWeight: "bold",
  },
  statusText: {
    color: "#666", // Changed to darker color
    fontSize: 12,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messagesContent: {
    paddingTop: 15,
    paddingBottom: 20,
  },
  messageWrapper: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "flex-end",
  },
  adminWrapper: {
    justifyContent: "flex-end",
  },
  userWrapper: {
    justifyContent: "flex-start",
  },
  messageContainer: {
    borderRadius: 18,
    padding: 12,
    maxWidth: "70%",
    marginHorizontal: 8,
  },
  adminMessageText: {
    fontSize: 16,
    color: "white", // White text for pink bubbles
  },
  userMessageText: {
    fontSize: 16,
    color: "#333", // Dark text for white bubbles
  },
  adminAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  adminTimestamp: {
    fontSize: 12,
    marginTop: 4,
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
  },
  userTimestamp: {
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
  // Message bubble styles
  adminMessage: {
    backgroundColor: "#FF69B4", // Pink for admin
    borderTopRightRadius: 4,
    marginLeft: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  userMessage: {
    backgroundColor: "white", // White for user
    borderTopLeftRadius: 4,
    marginRight: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
});

export default OneMessage;