import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image, Modal, Button, KeyboardAvoidingView, Platform } from 'react-native';

import { PaperProvider } from 'react-native-paper';

const Messages = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'Bunnie A. Brown', message: 'You: Thank you so much!', image: require('../../assets/Images/verified.jpg') },
    { id: '2', sender: 'Mahra L. Amil', message: 'You: Your verification is pending.', image: require('../../assets/Images/mahra.jpg') },
  ]);

  const [searchText, setSearchText] = useState('');
  const [personSearchText, setPersonSearchText] = useState('');

  const showMessageDetails = (item) => {
    navigation.navigate('Chat', { message: item });
  };


  const renderMessageItem = ({ item }) => (
    <TouchableOpacity onPress={() => showMessageDetails(item)}>
      <View style={styles.messageItem}>
        <Image source={item.image} style={styles.avatar} />
        <View style={styles.messageDetails}>
          <Text style={styles.sender}>{item.sender}</Text>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredMessages = messages.filter((msg) =>
    msg.sender.toLowerCase().includes(searchText.toLowerCase())
  );


  return (
    <PaperProvider>
    <View style={styles.container}>
      
      <Text style={styles.welcome}>Messages</Text>
      <View style={styles.whitebg}>
      
      <FlatList
        data={filteredMessages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
      />
      </View>
    </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  logo: {
    width: 40,
    height: 40,
  },
  whitebg: { backgroundColor: 'white'},
  welcome: {
    fontFamily: 'Inter',
    marginTop: 130,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 32,
    marginLeft: 15,
    marginBottom: 15,
  },
  navBar: {
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF', 
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 12,
    color: '#000000',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginHorizontal: 5,
},
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 5,
  },
  messageDetails: {
    flex: 1,
  },
  sender: {
    fontWeight: 'bold',
  },
  message: {
    color: '#666',
  },
  addButton: {
    backgroundColor: '#ff66c4',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#FF66C4',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButtonText: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#44c856',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedPersonItem: {
    backgroundColor: '#e0e0e0',
  },
  personName: {
    marginLeft: 10,
  },
  sendButton: {
    backgroundColor: '#FF66C4',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#FF66C4',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
});

export default Messages;