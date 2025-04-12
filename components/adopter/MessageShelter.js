import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import config from '../../server/config/config';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AdminImg from '../../assets/Images/nobglogo.png';

const MessageShelter = ({ route }) => {
  const { senderId, receiverId, receiverName, receiverImage, senderImage } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();
  const navigation = useNavigation();

  const socket = io(`${config.address}`, {
    secure: true,
    transports: ['websocket', 'polling']
  });

  useEffect(() => {
    socket.emit('joinRoom', senderId);
    fetchMessages();

    socket.on('receiveMessage', (newMessage) => {
      if (newMessage.senderId === receiverId || newMessage.senderId === senderId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        autoScrollChat();
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [senderId]);

  useEffect(() => {
    autoScrollChat();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${config.address}/api/messages/${senderId}/${receiverId}`);
      setMessages(response.data);
      autoScrollChat();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      senderId,
      receiverId,
      message,
    };

    socket.emit('sendMessage', newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage('');
    autoScrollChat();
  };

  const autoScrollChat = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header with back button and shelter name */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={AdminImg} style={styles.headerImage} />
        </TouchableOpacity>
        <Text style={styles.headerName}>Pasay City Animal Shelter</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((msg, index) => (
          <View key={index} style={msg.senderId === senderId ? styles.senderContainer : styles.receiverContainer}>
            {msg.senderId !== senderId ? (
              <View style={styles.messageRow}>
                <Image source={receiverImage} style={styles.messageImage} />
                <View style={styles.receiverMessage}>
                  <Text style={styles.messageText}>{msg.message}</Text>
                  <Text style={styles.messageTime}>{formatDate(msg.createdAt)}</Text>
                </View>
              </View>
            ) : (
              <View style={[styles.messageRow, styles.senderMessageRow]}>
                <View style={styles.senderMessage}>
                  <Text style={styles.messageText}>{msg.message}</Text>
                  <Text style={styles.messageTime}>{formatDate(msg.createdAt)}</Text>
                </View>
                <Image source={{ uri: senderImage }} style={styles.messageImage} />
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message"
          value={message}
          onChangeText={setMessage}
          multiline
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
    padding: 16,
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  senderContainer: {
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  receiverContainer: {
    marginBottom: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  senderMessageRow: {
    justifyContent: 'flex-end',
  },
  messageImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  receiverMessage: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 0,
    marginLeft: 8,
  },
  senderMessage: {
    backgroundColor: '#ffccd5',
    padding: 12,
    borderRadius: 16,
    borderBottomRightRadius: 0,
    marginRight: 8,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#ff758f',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MessageShelter;
