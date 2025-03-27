import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AdminSearch from '../design/AdminSearch';
import UserNavbar from '../design/UserNavbar';
import UserUpperNavbar from '../design/UserUpperNavbar';
import {  useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';

const UserHomepage = ({ navigation }) => {
  const [selectedNav, setSelectedNav] = useState(null); // State to track which nav item is clicked

  const handleNearby = () => {
    navigation.navigate('User Nearby Services');
  };
  const handleEvent = () => {
    navigation.navigate('User Events');
  };
  const handlePet = () => {
    navigation.navigate('Adopt A Pet');
  };
  const handleAboutus = () => {
    navigation.navigate('About Us');
  };

  let [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <UserUpperNavbar></UserUpperNavbar>
      <ImageBackground
        source={require('../../assets/Images/pasayshelter.jpg')} // Replace with your image URL
        style={styles.mainSection}
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['rgba(255,255,255,1)', 'rgba(255,105,180,0.5)', 'rgba(255,255,255,0.1)']}
          style={styles.gradient}
        >
          {/* White Overlay Gradient */}
              <View style={styles.textRow}>
              <Text style={styles.mainTitle}>Providing </Text>
                <Text style={styles.subTextt}>pets a </Text>
                <Text style={styles.homeText}>Home,</Text>
                <Text style={styles.subTextt}>and a </Text>
                <Text style={styles.familyText}>Family</Text>
                <Text style={styles.subTextt}> to grow.</Text>
                <TouchableOpacity style={styles.aboutus} onPress={handleAboutus}>
                <Text style={styles.aboutusText}>About Us</Text>
              </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.aboutus} onPress={handleAboutus}>
                <Text style={styles.aboutusText}>About Us</Text>
              </TouchableOpacity>
              
            
          
        </LinearGradient>
      </ImageBackground>

      {/* Service Section */}
      <View style={styles.servicesSection}>
        {/* Nearby Services */}
        <TouchableOpacity style={styles.serviceCard} onPress={handleNearby}>
          <Image
            source={require('../../assets/Images/logo1.jpg')} // Replace with your image URL or local asset
            style={styles.serviceIcon}
          />
          <View style={styles.descript}>
            <Text style={styles.serviceText}>Nearby Services</Text>
          </View>
        </TouchableOpacity>

        {/* Events */}
        <TouchableOpacity style={styles.serviceCard} onPress={handleEvent}>
          <Image
            source={require('../../assets/Images/logo2.jpg')} // Replace with your image URL or local asset
            style={styles.serviceIcon}
          />
          <View style={styles.descript}>
            <Text style={styles.serviceText}>Events</Text>
          </View>
        </TouchableOpacity>

        {/* Adopt a Pet */}
        <TouchableOpacity style={styles.serviceCard} onPress={handlePet}>
          <Image
           source={require('../../assets/Images/logo3.jpg')} // Replace with your image URL or local asset
            style={styles.serviceIcon}
          />
          <View style={styles.descript}>
            <Text style={styles.serviceText}>Adopt a Pet</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Why Adopt Section */}
      <View style={styles.whyAdoptSection}>
        <ImageBackground
          source={require('../../assets/Images/catdog.jpg')} // Replace with your pet-related image
          style={styles.petImage}
        />
        <Text style={styles.whyAdoptTitle}>Why <Text style={styles.adoptHighlight}>Adopt?</Text></Text>
        <Text style={styles.whyAdoptDescription}>
          By adopting from the Pasay Animal Shelter, you're opening your heart and home to a wonderful pet who's ready to shower you with love and companionship. Each adoption creates space for more animals to be rescued, giving you the chance to make a meaningful difference in both their lives and your community.
        </Text>
        <Text style={styles.footerText}>(C) 2024 Websiters</Text>

      </View>
      <UserNavbar></UserNavbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // MIDDLE SECTION
  mainSection: {
    width: '100%',
    height: 500,
    marginTop: 10,
    elevation: 5,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  whiteOverlay: {
    position: 'relative',
  },
  mainTitle: {
    fontSize: 45,
    textAlign: 'left',
    fontFamily: 'Inter_700Bold',
    color: '#ff69b4',
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    marginTop:-250,
  },
  
  textRow: {
    marginLeft: 20,
    marginTop: 160,
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },

  subTextt: {
    fontSize: 30,
    color: '#545454',
    textAlign: 'left',
    fontFamily: 'Inter_500Medium',
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  
  homeText: {
    fontStyle: 'italic',
    fontSize: 40,
    color: '#545454',
    fontFamily: 'serif',
    fontWeight:'bold',
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  
  familyText: {
    fontSize: 45,
    color: '#ff69b4',
    fontFamily: 'Inter_700Bold',
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  
  adoptBtn: {
    width: 160,
    height: 50,
    backgroundColor: '#ff69b4',
    borderRadius: 25,
  },
  
  adoptText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // SERVICES SECTION
  servicesSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingTop: 100,
    paddingBottom: 50,
    backgroundColor: '#fff',
    marginTop: -255,
    marginBottom: -50,
  },
  serviceCard: {
    alignItems: 'center',
    width: '30%',
    padding: 10,
    marginBottom: -0.5,
    marginTop: -100,
  },
  serviceIcon: {
    width: 90,
    height: 100,
    marginBottom: 5,
    elevation: 10,
  },
  serviceText: {
    width: 200,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
    marginBottom: 5,
  },
  subText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 5,
  },
  whyAdoptSection: {
    marginBottom: -0.5,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#fce4ec',
  },
  petImage: {
    width: 200,
    height: 130,
    borderRadius: 40,
    marginBottom: 20,
  },
  whyAdoptTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  adoptHighlight: {
    color: '#ff69b4',
  },
  whyAdoptDescription: {
    textAlign: 'center',
    color: 'black',
  },
  footerText: {
    marginTop: 20,
    color: '#777',
  },
  aboutus: {
    marginTop: 40,
    width: 160,
    height: 50,
    backgroundColor: '#ff69b4',
    fontFamily: 'Inter_700Bold',
    borderRadius: 10,
    alignContent: 'center',
    justifyContent: 'center',
  },
  aboutusText: {
    fontSize: 25,
    fontFamily: 'Inter_700Bold',
    color: 'white',
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },

});

export default UserHomepage;
