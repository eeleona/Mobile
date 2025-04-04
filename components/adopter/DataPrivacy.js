import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, CheckBox, Alert, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppBar from '../design/AppBar';
 
export default function DataPrivacy() {
  const [selectedService, setSelectedService] = useState('Pet Grooming'); // Default service is Pet Grooming
  const [isChecked, setIsChecked] = useState(false); // Checkbox state for data privacy agreement
 
  const handleContinue = () => {
    if (isChecked) {
      Alert.alert("Success", "You have agreed to the terms and conditions.");
      // You can now navigate to another service or action
    } else {
      Alert.alert("Warning", "You must agree to the terms and conditions before continuing.");
    }
  };
 
  return (
    <ImageBackground
      source={require('../../assets/Images/shelter.jpg')} // Replace with the new image
      style={styles.background}
      resizeMode="cover"
    >
      <AppBar></AppBar>
      {/* Gradient overlay for better text contrast */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.7)']}
        style={styles.gradientOverlay}
      >
        <ScrollView style={styles.container}>
          {/* Header */}
          
 
          {/* Data Privacy Section */}
          <View style={styles.contentBox}>
            <Text style={styles.privacyHeader}>DATA PRIVACY</Text>
            <Text style={styles.paragraph}>
              Your privacy is important to us. This statement outlines how we collect, use, and protect your information when you sign up for our service.
              Here's a summary of how we handle your information.
            </Text>
 
            <Text style={styles.subHeader}>What We Collect:</Text>
            <Text style={styles.paragraph}>- Basic information (name, email, phone and address)</Text>
            <Text style={styles.paragraph}>- Additional details about your preferences and usage of our app</Text>
 
            <Text style={styles.subHeader}>How We Use It:</Text>
            <Text style={styles.paragraph}>- To manage your account and deliver our services.</Text>
            <Text style={styles.paragraph}>- To personalize your experience and send relevant updates.</Text>
            <Text style={styles.paragraph}>- To analyze trends and improve our app.</Text>
 
            <Text style={styles.subHeader}>Security and Sharing:</Text>
            <Text style={styles.paragraph}>- We keep your data secure and don't sell it to third parties.</Text>
            <Text style={styles.paragraph}>- Trusted partners may access your info to support our services.</Text>
 
            <Text style={styles.subHeader}>Your Rights:</Text>
            <Text style={styles.paragraph}>- You can access, correct, or delete your data anytime.</Text>
 
            <Text style={styles.subHeader}>Contact Us:</Text>
            <Text style={styles.paragraph}>- For questions or concerns, reach out to us.</Text>
 
            {/* Checkbox Section */}
            <View style={styles.checkboxContainer}>
              
              <Text style={styles.checkboxLabel}>I agree with the terms and conditions.</Text>
            </View>
 
            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, isChecked ? styles.buttonEnabled : styles.buttonDisabled]}
                onPress={handleContinue}
                disabled={!isChecked}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
 
              <TouchableOpacity style={styles.goBackButton}>
                <Text style={styles.goBackText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%', // Ensure the background covers the entire screen
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ff69b4',
  },
  logo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLink: {
    marginHorizontal: 10,
    fontSize: 16,
    color: 'white',
  },
  selectedNavLink: {
    color: 'black',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#ff69b4',
  },
  signUpBtn: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  signUpText: {
    color: '#ff69b4',
    fontWeight: 'bold',
  },
  contentBox: {
    backgroundColor: 'white',
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  privacyHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonEnabled: {
    backgroundColor: '#ff69b4',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  goBackButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'green',
  },
  goBackText: {
    color: '#fff',
    fontSize: 18,
  },
});