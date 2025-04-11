import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import AppBar from '../design/AppBar';
import { useFonts, Inter_700Bold, Inter_600SemiBold, Inter_500Medium } from '@expo-google-fonts/inter';

export default function AboutUs() {
  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_600SemiBold,
    Inter_500Medium,
  });
  
  if (!fontsLoaded) return null;

  return (
    <ImageBackground
      source={require('../../assets/Images/cdog.jpg')}
      style={styles.background}
      resizeMode="cover"
      blurRadius={2}
    >
      <AppBar />
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.85)', 'rgba(255, 255, 255, 0.9)']}
        style={styles.gradientOverlay}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Main Content */}
          <View style={styles.mainSection}>
            <View style={styles.aboutUsCard}>
              <Text style={styles.sectionTitle}>
                About <Text style={styles.highlight}>Us</Text>
              </Text>
              
              <View style={styles.imageGrid}>
                <Image
                  style={styles.imageLarge}
                  source={require('../../assets/Images/shelterbg.jpg')}
                />
                <View style={styles.imageRow}>
                  <Image
                    style={styles.imageSmall}
                    source={require('../../assets/Images/websisters.jpg')}
                  />
                  <Image
                    style={styles.imageSmall}
                    source={require('../../assets/Images/mayor2.jpg')}
                  />
                </View>
              </View>

              <Text style={styles.aboutText}>
                Pasay Animal Shelter, founded in 2021 with the support of Mayor Emi Calixto, is dedicated to rescuing and caring for animals in need. The shelter provides a safe haven for abandoned and stray animals, helping them find loving homes.
                {'\n\n'}
                The shelter's website was developed by students from the College of Information Technology at NU-MOA.
              </Text>
            </View>

            {/* Connect Section */}
            <View style={styles.connectCard}>
              <Text style={styles.connectTitle}>Connect With Us</Text>
              
              <View style={styles.contactItem}>
                <MaterialIcons name="facebook" size={24} color="#4267B2" />
                <Text style={styles.contactText}>Pasay City Veterinary Office</Text>
              </View>
              
              <View style={styles.contactItem}>
                <MaterialIcons name="phone" size={24} color="#FF66C4" />
                <Text style={styles.contactText}>123-456-7890</Text>
              </View>
              
              <View style={styles.contactItem}>
                <MaterialIcons name="email" size={24} color="#FF66C4" />
                <Text style={styles.contactText}>contact@pasayanimalshelter.com</Text>
              </View>
              
              <View style={styles.contactItem}>
                <MaterialIcons name="location-on" size={24} color="#FF66C4" />
                <Text style={styles.contactText}>Pasay City, Metro Manila</Text>
              </View>
            </View>

            <Text style={styles.footerText}>© 2024 Websisters | NU-MOA</Text>
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
    flex: 1,
    width: '100%',
  },
  gradientOverlay: {
    flex: 1,
    paddingTop: 20,
  },
  mainSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  highlight: {
    color: '#FF66C4',
  },
  aboutUsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  imageGrid: {
    marginBottom: 20,
  },
  imageLarge: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 10,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageSmall: {
    width: '48%',
    height: 150,
    borderRadius: 15,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    fontFamily: 'Inter_500Medium',
    textAlign: 'justify',
  },
  connectCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  connectTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: '#FF66C4',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#333',
    flex: 1,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
    fontFamily: 'Inter_500Medium',
  },
});