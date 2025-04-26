import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import UserNavbar from '../design/UserNavbar';
import { MaterialIcons } from '@expo/vector-icons';

const AdoptionProcess = ({ route, navigation }) => {
  return (
    <ImageBackground 
      source={require('../../assets/Images/pasayshelter.jpg')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.content}>
            <Text style={styles.ty}>Thank you for trusting E-Pet Adopt!</Text>
            <Text style={styles.message}>
              The adoption will be processed by the shelter.
              Please check your inbox/email regularly for an update.
            </Text>
            
            <TouchableOpacity 
              onPress={() => navigation.navigate('User Inbox')} 
              style={[styles.button, { backgroundColor: '#ff69b4' }]}
            >
              <MaterialIcons name="email" size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Contact the shelter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => navigation.navigate('Adoption Tracker')} 
              style={[styles.button, { backgroundColor: '#ff69b4' }]}
            >
              <MaterialIcons name="pets" size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Track Adoption</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => navigation.navigate('User Page')} 
              style={[styles.button, { backgroundColor: '#cad47c' }]}
            >
              <MaterialIcons name="home" size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Back to Homepage</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    marginHorizontal: 15,
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'Inter_500Medium',
    color: '#555',
    lineHeight: 26,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#ff69b4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 5,
  },
  ty: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontFamily: 'Inter_700Bold',
    color: '#ff69b4',
    paddingHorizontal: 20,
    lineHeight: 36,
  },
});

export default AdoptionProcess;