import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ChatScreen = ({navigation}) => {
  const [hasNotification, setHasNotification] = useState(false);

const onButtonPress = (route) => {
    if (route === 'Notifications') {
      setHasNotification(false);
    }
    navigation.navigate(route);
  };

const topButtons = [
  { title: 'Home', route: 'Home Page', isBottom: true },
  { title: 'Messages', route: 'Messages' },
  { title: 'Notifications', route: 'Notifications', isBottom: true },
  { title: 'Log Out', route: 'Log In', isBottom: true },
];
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <View style={styles.logoContainer}>
        <Image
            source={require('../../assets/Images/nobglogo.png')}
            style={styles.logo}/>
        </View>
        <View style={styles.buttonsContainer}>
          {topButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => onButtonPress(button.route)}>
              <Text style={styles.buttonText}>{button.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.avatarContainer}>
        <Image
          source={require('../../assets/Images/pasaypups.png')} 
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.shelter}>PASAY PUPS</Text>
          <Text>A group of caring individuals </Text>
          <Text>dedicated to making a difference</Text>
          <Text>in the lives of dogs and cats in an</Text>
          <Text>impoverished area of Pasay City.</Text>
        </View>
      </View>
      <View style={styles.convoCon}>
        <View style={[styles.message, styles.response]}>
          <Text style={styles.sMessage}>Thank you so much!</Text>
          <Image
            source={require('../../assets/Images/profiledp.png')} 
            style={styles.smallAvatar}
          />
        </View>
        <View style={styles.message}>
          <Image
            source={require('../../assets/Images/pasaypups.png')} 
            style={styles.smallAvatar}
          />
          <Text style={styles.rMessage}>Your adoption is being processed. Thank you, Anne!</Text>
        </View>
        <View style={[styles.message, styles.response]}>
          <Text style={styles.sMessage}>How's my adoption?</Text>
          <Image
            source={require('../../assets/Images/profiledp.png')} 
            style={styles.smallAvatar}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
        />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 40,
    height: 40,
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
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textContainer: {
    marginLeft: 10,
  },
  shelter: {
    //fontWeight: 'bold',
    fontSize: 18,
  },
  shelterDesc: {
    marginTop: 5,
    color: '#666666',
  },
  convoCon: {
    flex: 1,
    flexDirection: 'column-reverse', 
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  response: {
    justifyContent: 'flex-end', 
  },
  sMessage: {
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  rMessage: {
    backgroundColor: '#F1F0F0',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: 'black',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#FFFFFF',
    //fontWeight: 'bold',
  },
});

export default ChatScreen;
