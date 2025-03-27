import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import UserNavbar from '../design/UserNavbar';
import AppBar from '../design/AppBar';

export default function AboutUs() {
  const [selectedNav, setSelectedNav] = useState(null);
  const windowHeight = Dimensions.get('window').height;

  // Debugging image paths
  console.log('Image Path 1:', require('../../assets/Images/shelterbg.jpg'));
  console.log('Image Path 2:', require('../../assets/Images/websisters.jpg'));
  console.log('Image Path 3:', require('../../assets/Images/mayor2.jpg'));

  return (
    <ImageBackground
      source={require('../../assets/Images/cdog.jpg')} // Check the path for background image
      style={styles.background}
      resizeMode="cover"
    >
      <AppBar></AppBar>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.7)']}
        style={styles.gradientOverlay}
        resizeMode="cover"
      >
        <ScrollView style={styles.container}>
          {/* Header */}

          {/* Main Section */}
          <View style={styles.mainSection}>
            <View style={styles.aboutUsSection}>
              <View style={styles.leftColumn}>
                {/* Displaying Images */}
                <Image
                  style={styles.aboutImg}
                  source={require('../../assets/Images/shelterbg.jpg')} // Ensure path is correct
                  alt="Pasay City Animal Shelter"
                />
                <Image
                  style={styles.aboutImg}
                  source={require('../../assets/Images/websisters.jpg')} // Ensure path is correct
                  alt="Team Picture"
                />
                <Image
                  style={styles.aboutImg2}
                  source={require('../../assets/Images/mayor2.jpg')} // Ensure path is correct
                  alt="Mayor Image"
                />
              </View>

              <View style={styles.rightColumn}>
                <Text style={styles.aboutTitle}>
                  About <Text style={styles.highlight}>Us</Text>
                </Text>
                <Text style={styles.aboutText}>
                  Pasay Animal Shelter, founded in 2021 with the support of Mayor Emi Calixto, is dedicated to rescuing and caring for animals in need. The shelter provides a safe haven for abandoned and stray animals, helping them find loving homes.
                  {'\n\n'}
                  The shelter's website was developed by students from the College of Information Technology at NU-MOA.
                </Text>
              </View>
            </View>

            <View style={styles.connectSection}>
              <View style={styles.connectBox}>
                <Text style={styles.connectTitle}>Connect with Us</Text>
                <Text style={styles.connectt}>Facebook: Pasay City Veterinary Office</Text>
                <Text style={styles.connectt}>Contact Number: 123456789</Text>
              </View>
              <Text style={styles.footerText}>(C) 2024 Websisters</Text>
            </View>
          </View>

          <UserNavbar></UserNavbar>
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
    height: '100%',
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
  mainSection: {
    flex: 1,
    marginTop: 10,
  },
  aboutUsSection: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#ffffffb0',
    borderRadius: 10,
  },
  leftColumn: {
    flex: 1,
    marginRight: 10,
  },
  aboutImg: {
    width: '100%',
    height: 150,
    marginBottom: 15,
    borderRadius: 10,
  },
  aboutImg2: {
    width: '100%',
    height: 150,
  },
  rightColumn: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 24,
    marginBottom: 10,
    fontFamily: 'Inter_700Bold',
  },
  highlight: {
    fontFamily: 'Inter_700Bold',
    color: '#ff66b2',
  },
  aboutText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 22,
    textAlign: 'justify',
    fontFamily: 'Inter_500Medium',
  },
  connectSection: {
    padding: 20,
    backgroundColor: '#f1f1f1',
  },
  connectBox: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  connectTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: '#ff66b2',
    fontFamily: 'Inter_700Bold',
  },
  connectt: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
  },
  footerText: {
    marginTop: 20,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
  },
});
