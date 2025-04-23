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
import io from "socket.io-client";
import config from "../../server/config/config";
import UserPh from "../../assets/Images/user.png";
import AdminImg from "../../assets/Images/nobglogo.png";

// Modify your socket initialization in OneMessage.js
const socket = io(`${config.address}`, {
  transports: ['websocket', 'polling'], // Use both like the web version does
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  forceNew: true,
  secure: true, // Enable secure connection
  rejectUnauthorized: false // Important for self-signed certificates in development
});

if (__DEV__ && Platform.OS === 'android') {
  // For Android devices in development
  console.log("Applying development SSL workaround");
  
  // This bypasses SSL certificate verification in development only
  // IMPORTANT: Remove this for production builds!
  process.nextTick = setImmediate;
}

const OneMessage = ({ route, navigation }) => {
  const { userId, userName, userImage } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  const adminId = "670a04a34f63c22acf3d8c9a".toString();

  // Add this to your component
  useEffect(() => {
    console.log("Attempting to connect to socket at:", config.address);
    
    socket.on('connect', () => {
      console.log('Socket connected successfully with ID:', socket.id);
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      console.error('Socket connection error details:', error.message);
    });
    
    socket.on('error', (error) => {
      console.error('Socket general error:', error);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
    
    // Your existing socket code...
    
    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('error');
      socket.off('disconnect');
      socket.off('receiveMessage');
    };
  }, []);

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
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !userId) return;
  
    setIsLoading(true);
    
    try {
      // Create message object exactly like the web version
      const newMessage = {
        senderId: adminId,
        receiverId: userId,
        message: message.trim(),
      };
      
      // Send via socket.io first (like the web version)
      socket.emit("sendMessage", newMessage);
      
      // Update local state with the new message
      // Add temporary id and timestamp for display
      const messageWithTimestamp = {
        ...newMessage,
        _id: Date.now().toString(), // Temporary ID
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
          editable={!isLoading}
        />
        <TouchableOpacity 
          onPress={handleSendMessage} 
          style={[styles.sendButton, isLoading && styles.disabledButton]}
          disabled={isLoading}
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