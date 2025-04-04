import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import AdminSearch from '../design/AdminSearch';
import { PaperProvider } from 'react-native-paper';
import UserNavbar from '../design/UserNavbar';
import {  useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
const Account = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'Pasay Animal Shelter', message: 'You: Thank you so much!', image: require('../../assets/Images/nobglogo.png') },
  ]);

  const [searchText, setSearchText] = useState('');
  const [personSearchText, setPersonSearchText] = useState('');

  const showMessageDetails = (item) => {
    navigation.navigate('Chat', { message: item });
  };

  let [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleAdopt = () => {
    navigation.navigate('My Adoptions');
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
      <AdminSearch></AdminSearch>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          
            <Image style={styles.addicon} source={require('../../assets/Images/accicon.png')}></Image>
          
        <Text style={styles.welcome}>Hello, </Text>
          <Text style={styles.welcome2}>Bunnie!</Text>
        </View>
      </View>
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.nav}>
          <Text style={styles.navtext}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nav} onPress={handleAdopt}>
          <Text style={styles.navtext}>My Adoptions</Text>
        </TouchableOpacity>
      </View>
      <UserNavbar></UserNavbar>
      </View>
      
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  headerContainer: {
    width: '100%',
    height: '14%',
    alignItems: 'center',
    alignContent: 'flex-end',
    marginTop: 100,
  },
  header: {
    width: '95%',
    height: 110,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'flex-end',
    alignContent: 'center',
    padding: 10,
    elevation: 3,
    flexDirection: 'row',
  },
  addicon: {
    width: 90,
    height: 90,
    elevation: 3,
  },
  welcome: {
    fontFamily: 'Inter_500Medium',
    color: 'black',
    fontSize: 30,
    marginLeft: 10,
    marginTop: 10,
  },
  welcome2: {
    fontFamily: 'Inter_700Bold',
    color: '#ff69b4',
    fontSize: 30,
    marginTop: 10,
  },
  navContainer: {
    width: '100%',
    height: '15%',
    alignItems: 'center',
    alignContent: 'flex-end',
  },
  nav: {
    width: '95%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    alignContent: 'center',
    padding: 10,
    elevation: 3,
    flexDirection: 'row',
    marginBottom: 5,
  },
  navtext: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
  }

});

export default Account;