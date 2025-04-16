import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import UserNavbar from '../design/UserNavbar';


const AdoptionProcess = ({ route, navigation }) => {
  return (
    <View style={styles.container}>
      
      <View style={styles.content}>
      <Text style={styles.ty}>Thank you for trusting E-Pet Adopt!</Text>
        <Text style={styles.message}>
          The adoption will be processed by the shelter.
          Please check your inbox/email regularly for an update.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('User Inbox')} style={[styles.button, { backgroundColor: '#cad47c' }]}>
          <Text style={styles.buttonText}>Contact the shelter</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MyAdoptions')} style={[styles.button, { backgroundColor: '#ff69b4' }]}>
          <Text style={styles.buttonText}>Track Adoption</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('User Page')} style={[styles.button, { backgroundColor: '#ff69b4' }]}>
          <Text style={styles.buttonText}>Back to Homepage</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    alignItems: 'center',
  },
  message: {
    marginTop: 20,
    fontSize: 17,
    marginHorizontal: 15,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Inter_500Medium',
  },
  button: {
    backgroundColor: '#cad47c',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter_500Medium',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Inter_500Medium',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, 
  },
  ty: {
    fontSize: 40,
    textAlign: 'center',
    marginTop: 300,
    fontFamily: 'Inter_700Bold',
    color: '#ff69b4',
  },
});

export default AdoptionProcess;
