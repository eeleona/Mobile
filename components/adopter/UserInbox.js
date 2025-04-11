import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import config from '../../server/config/config';

const UserPh = require('../../assets/Images/user.png');

const UserInbox = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);

        const res = await axios.get(`${config.address}/api/messages/inbox/${decoded.id}`);
        setConversations(res.data); // Assume your backend returns an array of { receiverId, receiverName, receiverImage, lastMessage }
      } catch (err) {
        console.error('Error fetching inbox:', err);
      }
    };

    fetchConversations();
  }, []);

  const handleChatPress = (conversation) => {
    navigation.navigate('ChatScreen', {
      receiverId: conversation.receiverId,
      receiverName: conversation.receiverName,
      receiverImage: conversation.receiverImage,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Inbox</Text>
      {conversations.map((conv, index) => (
        <TouchableOpacity key={index} style={styles.chatPreview} onPress={() => handleChatPress(conv)}>
          <Image
            source={conv.receiverImage ? { uri: `${config.address}${conv.receiverImage}` } : UserPh}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{conv.receiverName}</Text>
            <Text style={styles.message} numberOfLines={1}>{conv.lastMessage}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#FF66C4',
  },
  chatPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    fontSize: 14,
    color: '#666',
  },
});

export default UserInbox;