import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AdminSearch from '../design/AdminSearch';
import UserNavbar from '../design/UserNavbar';
import AdminNavbar from '../design/AdminNavbar';

const AdoptionProcess = () => {
  return (
    <View style={styles.container}>
      <AdminSearch></AdminSearch>
      <View style={styles.content}>
      <Text style={styles.ty}>Thank you for trusting E-Pet Adopt!</Text>
        <Text style={styles.message}>
          The adoption will be processed by the shelter.
          Please check your inbox/email regularly for an update.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Message')} style={[styles.button, { backgroundColor: '#cad47c' }]}>
          <Text style={styles.buttonText}>Contact the shelter</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Adopt')} style={[styles.button, { backgroundColor: '#ff69b4' }]}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
      <UserNavbar></UserNavbar>
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
