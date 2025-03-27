import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { PaperProvider, Button } from 'react-native-paper';
import AdminSearch from '../design/AdminSearch';
import AdminNavbar from '../design/AdminNavbar';
import {  useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';

const AdminHomepage = ({ navigation }) => {
  const handlePet = () => {
    navigation.navigate('Manage Pet');
  };
  const handleUser = () => {
    navigation.navigate('Manage User');
  };
  const handleStaff = () => {
    navigation.navigate('Manage Staff');
  };
  const handleNearby = () => {
    navigation.navigate('Manage Nearby Services');
  };
  const handleEvents = () => {
    navigation.navigate('Events');
  };
  const handleFeedback = () => {
    navigation.navigate('Feedback');
  };
  const handleAdoptions = () => {
    navigation.navigate('Manage Adoptions');
  };

  let [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <AdminSearch></AdminSearch>
        <View style={styles.welcomecontainer}>
          <Image style={styles.pawicon} source={require('../../assets/Images/pawicon.png')}></Image>
          <Text style={styles.welcome}>Welcome, Admin!</Text>
        </View>
        <View style={styles.module1}>
        <View style={styles.service}>
            <TouchableOpacity style={styles.button} onPress={handleEvents}>
              <View style={styles.iconcontainer}>
                <Image style={styles.icon} source={require('../../assets/Images/events.png')}/>
              </View>
              <Text style={styles.labels}>Events</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleFeedback}>
              <View style={styles.iconcontainer}>
                <Image style={styles.icon} source={require('../../assets/Images/feedback.png')}/>
              </View>
              <Text style={styles.labels}>Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleAdoptions}>
            <View style={styles.iconcontainer}>
              <Image style={styles.icon} source={require('../../assets/Images/application.png')}/>
            </View>
            <Text style={styles.labels}>Adoptions</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.dahsboardContainer}>
          <Image style={styles.header} source={require('../../assets/Images/dahsboard.png')}></Image>
        </View>
        <View style={styles.modules}>
          <View style={styles.manage}>
            <TouchableOpacity style={styles.button} onPress={handlePet}>
              <View style={styles.iconcontainer}>
                <Image style={styles.icon} source={require('../../assets/Images/pet.png')}/>
              </View>
              <Text style={styles.labels}>Pets</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleUser}>
              <View style={styles.iconcontainer}> 
                <Image style={styles.icon} source={require('../../assets/Images/user.png')}/>
              </View>
              <Text style={styles.labels}>Users</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleStaff}>
            <View style={styles.iconcontainer}>
              <Image style={styles.icon} source={require('../../assets/Images/staff.png')}/>
              </View>
              <Text style={styles.labels}>Staff</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNearby}>
            <View style={styles.iconcontainer}>
              <Image style={styles.icon} source={require('../../assets/Images/nearby.png')}/>
              </View>
              <Text style={styles.labels}>Nearby</Text>
            </TouchableOpacity>
          </View>
        </View>
        <AdminNavbar></AdminNavbar>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  welcomecontainer: {
    marginLeft: 1,
    marginTop: 100,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  pawicon: {
    marginTop: 8,
    width: 80,
    height: 80,
  },
  welcome: {
    fontFamily: 'Inter_700Bold',
    color: '#89a66b',
    fontSize: 25,
  },
  header: {
    width: '100%',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    backgroundImage: 'linear-gradient(180deg, rgba(255, 255, 255, 0.20) 0%, rgba(213.56, 13.35, 133.48, 0.20) 65%)',
  },
  module1: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 155,
  },
  modules: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 155,
    marginTop: 20,
  },
  manage: {
    padding: 10,
    width: '100%',
    height: 140,
    justifyContent: 'space-between',
    flexDirection: 'row',
    fontFamily: 'Inter',
  },
  service: {
    padding: 10,
    width: '100%',
    height: 140,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    fontFamily: 'Inter',
  },
  button: {
    width: '23%',
    height: 95,
    backgroundColor: 'white',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    elevation: 7,
    borderRadius: 20
  },
  iconcontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 95,
  },
  icon: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labels: {
    fontFamily: 'Inter_500Medium',
    color: 'black',
    fontSize: 11,
    wordWrap: 'break-word',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    textAlign: 'center',
  }
});

export default AdminHomepage;