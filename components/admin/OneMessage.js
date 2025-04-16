import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet,
  FlatList, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import axios from 'axios';
import config from '../../server/config/config';
import { MaterialIcons } from '@expo/vector-icons';

const OneMessage = ({ navigation, route }) => {
  const { userId, userName, userImage } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const adminId = '670a04a34f63c22acf3d8c9a';

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(`${config.address}`, {
      transports: ['websocket'],
      forceNew: true,
      jsonp: false,
    });

    if (adminId) socket.current.emit('joinRoom', adminId);

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
      const response = await axios.get(`${config.address}/api/messages/${adminId}/${userId}`);
      setMessages(response.data);
      scrollToBottom();
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollToEnd({ animated: true });
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString([], {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const newMessage = {
      senderId: adminId,
      receiverId: userId,
      message: message.trim(),
    };
    const tempMessage = {
      ...newMessage,
      _id: 'temp-' + Date.now(),
      createdAt: new Date().toISOString(),
      pending: true,
    };
    setMessages(prev => [...prev, tempMessage]);
    setMessage('');
    scrollToBottom();

    try {
      const response = await axios.post(`${config.address}/api/messages/send`, newMessage);
      const sent = response.data?.newMessage;
      if (sent) {
        setMessages(prev =>
          prev.map(msg => (msg._id === tempMessage._id ? sent : msg))
        );
        socket.current.emit('sendMessage', sent);
      }
    } catch (err) {
      console.error('Send failed:', err);
      setMessages(prev =>
        prev.map(msg =>
          msg._id === tempMessage._id ? { ...msg, error: true } : msg
        )
      );
      Alert.alert('Failed to send', 'Try again.', [
        { text: 'Retry', onPress: () => handleSendMessage() },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const renderMessage = ({ item }) => {
    const isAdmin = item.senderId === adminId;
    const bubbleStyle = isAdmin ? styles.adminBubble : styles.userBubble;
    const textStyle = isAdmin ? styles.adminText : styles.userText;
    const timeStyle = isAdmin ? styles.adminTime : styles.userTime;
    const avatar = isAdmin
      ? require('../../assets/Images/nobglogo.png')
      : userImage
      ? { uri: userImage }
      : require('../../assets/Images/user.png');

    return (
      <View style={[styles.messageRow, isAdmin ? styles.alignRight : styles.alignLeft]}>
        {!isAdmin && <Image source={avatar} style={styles.avatar} />}
        <View style={[styles.bubble, bubbleStyle]}>
          <Text style={textStyle}>{item.message}</Text>
          <Text style={timeStyle}>
            {item.pending ? 'Sending...' : formatMessageTime(item.createdAt)}
          </Text>
        </View>
        {isAdmin && <Image source={avatar} style={styles.avatar} />}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#fff" />
        </TouchableOpacity>
        <Image
          source={userImage ? { uri: userImage } : require('../../assets/Images/user.png')}
          style={styles.headerImage}
        />
        <Text style={styles.headerName}>{userName}</Text>
      </View>

      <FlatList
        ref={messagesEndRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => item._id || index.toString()}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
          <MaterialIcons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF66C4',
    padding: 15,
    paddingTop: 50,
  },
  headerImage: { width: 36, height: 36, borderRadius: 18, marginHorizontal: 10 },
  headerName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  messagesContainer: { paddingVertical: 10, paddingHorizontal: 12 },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-end',
  },
  alignRight: { justifyContent: 'flex-end' },
  alignLeft: { justifyContent: 'flex-start' },
  avatar: { width: 32, height: 32, borderRadius: 16, marginHorizontal: 8 },
  bubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  adminBubble: {
    backgroundColor: '#FF66C4',
    borderTopRightRadius: 0,
  },
  userBubble: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#eee',
  },
  adminText: { color: 'white', fontSize: 14 },
  userText: { color: '#333', fontSize: 14 },
  adminTime: { color: '#ffe5f1', fontSize: 10, textAlign: 'right', marginTop: 4 },
  userTime: { color: '#aaa', fontSize: 10, textAlign: 'right', marginTop: 4 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  input: {
    flex: 1,
    height: 45,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 15,
    marginRight: 10,
  },
  sendBtn: {
    backgroundColor: '#FF66C4',
    padding: 12,
    borderRadius: 25,
  },
});

export default OneMessage;
