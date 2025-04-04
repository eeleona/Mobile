import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import UserNavbar from '../design/UserNavbar';
import AppBar from '../design/AppBar';

const Submission = ({ navigation}) => {
  const handleButton1Press = () => {
    navigation.navigate('User Inbox')
  };

  const handleButton2Press = () => {
    navigation.navigate('User Homepage')
  };

  return (
    <View style={styles.container}>
    <AppBar></AppBar>
    <View style={styles.container}>
        <Image
        style={styles.image}
        source={require('../../assets/Images/submit.png')}
        resizeMode='contain'
      />

      <TouchableOpacity onPress={handleButton1Press} style={styles.button}>
        <Text style={styles.buttonText}>Message Shelter</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleButton2Press} style={styles.button1}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 500,
    height: 200,
    marginBottom: 250,
    marginTop: 20,
  },

  button: {
    backgroundColor: '#cad47c',
    padding: 10,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
    marginBottom: 5,
    marginTop: -130,
  },
  button1: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Submission;