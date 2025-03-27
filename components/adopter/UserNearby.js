import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppBar from '../design/AppBar';
 
const { width } = Dimensions.get('window');
 
export default function Index() {
  const [selectedService, setSelectedService] = useState('Pet Grooming'); // Default service is Pet Grooming
 
  // Data for each service
  const servicesData = {
    'Pet Grooming': [
      {
        name: 'Happy Tails Pet Salon',
        address: '32 C Clemente Jose, Malibay, Pasay, 1300 Kalakhang Maynila',
        imageUrl: require('../../assets/Images/nss1.jpg'),
        description: 'Contact Number: 1234567',
      },
      {
        name: 'Dogs and The City',
        address: '116-117 South Parking SM Mall of Asia, Marina Way, Pasay, 1300',
        imageUrl: require('../../assets/Images/nss2.jpg'),
        description: 'Contact Number: 1234567',
      },
    ],
    'Pet Clinic': [
      {
        name: 'Carveldon Veterinary Center',
        address: '123 Clinic CPC, 21 Cartimar Ave, Pasay, 1300 Metro Manila, Pasay City',
        imageUrl: require('../../assets/Images/vc1.jpg'),
        description: 'Contact Number: 1234567',
      },
      {
        name: 'Cruz Veterinary Clinicl Clinic',
        address: 'Stall G, Felimarc Pet Center, 2189 A. Luna, Pasay, 1300 Metro Manila',
        imageUrl: require('../../assets/Images/vc2.jpg'),
        description: 'Contact Number: 1234567',
      },
    ],
    'Neutering': [
      {
        name: 'Pet Allies Animal Clinic',
        address: 'Unit 6, Megal Taft Bldg., 2140 Taft Ave.Cor. Taylo St., 55 Zone 7, Pasay, 1300 Metro Manila',
        imageUrl: require('../../assets/Images/nc1.jpg'),
        description: 'Contact Number: 1234567',
      },
      {
        name: 'Neuter for a Cause',
        address: 'The Veterinary Hub Pte. Corp',
        imageUrl: require('../../assets/Images/nc2.jpg'),
        description: 'Contact Number: 1234567',
      },
    ],
    'Pet Hotels': [
      {
        name: 'Dog Friend Hotel & SPA',
        address: 'Unit K & C Felimarc Center Taft Avenue (nearby Cartimar), Pasay City, Philippines',
        imageUrl: require('../../assets/Images/ph1.jpg'),
        description: 'Contact Number: 1234567',
      },
      {
        name: 'The Pup Club ',
        address: '31 Armstrong Ave corner Von Braun, Parañaque, Philippines',
        imageUrl: require('../../assets/Images/ph2.jpg'),
        description: 'Contact Number: 1234567',
      },
    ],
  };
 
  return (
    <ImageBackground
      source={require('../../assets/Images/shelter.jpg')} // Replace with your image URL
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
 
          {/* Main Title with Image */}
          <View style={styles.titleContainer}>
            <View style={styles.textWithImageContainer}>
              <View>
                <Text style={styles.nearbyText}>Nearby</Text>
                <Text style={styles.servicesText}>Services</Text>
                <Text style={styles.locationText}>IN PASAY CITY</Text>
              </View>
              <Image
                source={require('../../assets/Images/catdog.jpg')} // Replace with the correct path to your image
                style={styles.titleImage}
              />
            </View>
          </View>
 
          {/* Middle Navbar */}
          <View style={styles.middleNavBar}>
       
            <TouchableOpacity onPress={() => setSelectedService('Pet Grooming')}>
              <Text style={[styles.navLinkk, selectedService === 'Pet Grooming' ? styles.selectedNavLinkk : null]}>Pet Grooming</Text>
            </TouchableOpacity>
 
            <TouchableOpacity onPress={() => setSelectedService('Pet Clinic')}>
              <Text style={[styles.navLinkk, selectedService === 'Pet Clinic' ? styles.selectedNavLinkk : null]}>Pet Clinic</Text>
            </TouchableOpacity>
 
            <TouchableOpacity onPress={() => setSelectedService('Neutering')}>
              <Text style={[styles.navLinkk, selectedService === 'Neutering' ? styles.selectedNavLinkk : null]}>Neutering</Text>
            </TouchableOpacity>
 
            <TouchableOpacity onPress={() => setSelectedService('Pet Hotels')}>
              <Text style={[styles.navLinkk, selectedService === 'Pet Hotels' ? styles.selectedNavLinkk : null]}>Pet Hotels</Text>
            </TouchableOpacity>
          </View>
         
          {/* White Background and Content Below Middle Navbar */}
          <View style={styles.whiteBackground}>
            <Text style={styles.serviceTitle}>{selectedService.toUpperCase()}</Text>
            {servicesData[selectedService].map((service, index) => (
              <View key={index} style={styles.serviceCard}>
                <Image source={service.imageUrl} style={styles.serviceImage} />
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceAddress}>{service.address}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </View>
            ))}
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
    textAlign: 'center',
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
  titleContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  textWithImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearbyText: {
    fontSize: 58,
    color: '#f06292',
    marginBottom: -9,
    marginTop: 30,
    fontFamily: 'Inter_700Bold',
  },
  servicesText: {
    fontSize: 45,
    fontFamily: 'Inter_700Bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  locationText: {
    fontSize: 20,
    color: '#555',
    marginLeft: 20,
    fontFamily: 'Inter_500Medium',
  },
  titleImage: {
    width: 200, // Set the width of the image
    height: 140, // Set the height of the image
    borderRadius: 10,
    marginLeft: 19, // Space between the text and the image
    fontFamily: 'Inter_700Bold',
  },
  middleNavBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff5EE',
    paddingVertical: 10,
    marginBottom: 20,
  },
  navLinkk: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight:'bold',
    color: '#a0522d',
    paddingVertical: 8,
    paddingHorizontal: 1,
    borderRadius: 0, // Rounded corners
    borderStyle:'solid',
    fontFamily: 'Inter_700Bold',
    overflow: 'hidden',
  },
  selectedNavLinkk: {
    color: 'black',
    fontFamily: 'Inter_700Bold',
    borderTopWidth:3,
    borderColor:'#ff69b4',
    borderStartColor:'#ff69b4',
    borderBottomWidth: 3,
    overflow: 'hidden',
  },
  whiteBackground: {
    backgroundColor: '#fff', // White background added for the content section
    padding: 40,
    marginTop:-20,
 
  },
  serviceTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  serviceCard: {
    fontFamily: 'Inter_700Bold',
    marginBottom: 20,
    alignItems: 'center',
    
  },
  serviceImage: {
    width: width * 0.9,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold'
  },
  serviceAddress: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Inter_500Medium',
  },
});