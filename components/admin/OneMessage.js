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
      rejectUnauthorized: false,  // <-- accept self-signed certs (development)
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
      scrollToBottom();
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
      scrollToBottom();
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
        item.senderId === adminId ? styles.alignRight : styles.alignLeft,
      ]}
    >
      <Image
        source={item.senderId === adminId ? AdminImg : (userImage ? { uri: userImage } : UserPh)}
        style={styles.avatar}
      />
      <View
        style={[
          styles.messageContainer,
          item.senderId === adminId
            ? styles.adminMessage
            : styles.userMessage,
        ]}
      >
        <Text style={[
          styles.messageText,
          item.senderId === adminId && styles.adminText
        ]}>
          {item.message}
        </Text>
        <Text style={[
          styles.timestamp,
          item.senderId === adminId && styles.adminTimestamp
        ]}>
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
        {!isConnected && (
          <View style={styles.connectionStatus}>
            <Text style={styles.connectionStatusText}>Offline</Text>
          </View>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesContent}
        style={styles.messagesContainer}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
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
          <Text style={styles.sendButtonText}>
            {isLoading ? "Sending..." : "Send"}
          </Text>
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
    backgroundColor: "#FF69B4",
    paddingVertical: 15,
    paddingHorizontal: 10,
    elevation: 3,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: "white",
    fontSize: 24,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  connectionStatus: {
    backgroundColor: 'red',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  connectionStatusText: {
    color: 'white',
    fontSize: 12,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageWrapper: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "flex-end",
  },
  alignRight: {
    justifyContent: "flex-end",
  },
  alignLeft: {
    justifyContent: "flex-start",
  },
  messageContainer: {
    borderRadius: 18,
    padding: 12,
    maxWidth: "70%",
  },
  adminMessage: {
    backgroundColor: "#FF69B4",
    borderTopRightRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  userMessage: {
    backgroundColor: "#e5e5ea",
    borderTopLeftRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  adminText: {
    color: "white",
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    color: "rgba(0,0,0,0.5)",
  },
  adminTimestamp: {
    color: "rgba(255,255,255,0.7)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#FF69B4",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default OneMessage;