import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, FlatList } from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import axios from 'axios';
import config from '../../server/config/config';

const OneMessage = ({ navigation, route }) => {
  const { userId, userName, userImage } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const adminId = '670a04a34f63c22acf3d8c9a';
  
  // Initialize socket
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

    fetchMessages();

    socket.current.on('receiveMessage', (newMessage) => {
      if (newMessage.senderId === userId || newMessage.receiverId === userId) {
        setMessages(prev => [...prev, newMessage]);
        scrollToBottom();
      }
    });

    return () => {
      if (socket.current) {
        socket.current.off('receiveMessage');
        socket.current.disconnect();
      }
    };
  }, [userId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${config.address}/api/messages/${adminId}/${userId}`
      );
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      senderId: adminId,
      receiverId: userId,
      message,
    };

    socket.current.emit('sendMessage', newMessage);
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollToEnd({ animated: true });
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderMessage = ({ item }) => {
    const isAdmin = item.senderId === adminId;
    const placeholderImage = require('../../assets/Images/user.png');

    return (
      <View style={[
        styles.messageContainer,
        isAdmin ? styles.adminMessage : styles.userMessage
      ]}>
        {!isAdmin && (
          <Image 
            source={userImage ? { uri: userImage } : placeholderImage} 
            style={styles.messageImage} 
          />
        )}
        
        <View style={[
          styles.messageBubble,
          isAdmin ? styles.adminBubble : styles.userBubble
        ]}>
          <Text style={isAdmin ? styles.adminText : styles.userText}>
            {item.message}
          </Text>
          <Text style={styles.messageTime}>
            {formatMessageTime(item.createdAt)}
          </Text>
        </View>
        
        {isAdmin && (
          <Image 
            source={require('../../assets/Images/nobglogo.png')} 
            style={styles.messageImage} 
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Image 
          source={userImage ? { uri: userImage } : require('../../assets/Images/user.png')} 
          style={styles.headerImage} 
        />
        <Text style={styles.headerName}>{userName}</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={messagesEndRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type your message"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 40,
  },
  backButton: {
    fontSize: 24,
    marginRight: 15,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  headerName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  adminMessage: {
    justifyContent: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-start',
  },
  messageImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 5,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 5,
  },
  adminBubble: {
    backgroundColor: '#FF66C4',
    borderTopRightRadius: 0,
  },
  userBubble: {
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 0,
  },
  adminText: {
    color: 'white',
  },
  userText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    color: 'white',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    height: '10%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#FF66C4',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OneMessage;