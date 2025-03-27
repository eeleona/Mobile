import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { PaperProvider, Icon, BottomNavigation} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


const AdminNavbar = () => {
  const navigation = useNavigation ()
  const handleHome = () => {
    navigation.navigate('Admin Homepage');
  };
  const handleInbox = () => {
    navigation.navigate('Inbox');
  };
  const handleNotif = () => {
    navigation.navigate('Notifications');
  };
  const handleLogout = () => {
    navigation.navigate('Admin Login');
  };

return (
  <PaperProvider>
    <View style={styles.navBarContainer}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.button} onPress={handleHome}>
          <View style={styles.iconcontainer}>
            <Image style={styles.icon} source={require('../../assets/Images/home.png')}/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleInbox}>
          <View style={styles.iconcontainer}> 
            <Image style={styles.icon} source={require('../../assets/Images/inbox.png')}/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNotif}>
          <View style={styles.iconcontainer}>
            <Image style={styles.icon} source={require('../../assets/Images/notif.png')}/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <View style={styles.iconcontainer}>
            <Image style={styles.icon} source={require('../../assets/Images/logout.png')}/>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </PaperProvider>
);
};

const styles = StyleSheet.create({
  navBarContainer: {
    width: '100%',
    height: 80,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  navBar: {
    width: '100%',
    height: '100%',
    boxShadow: '16px 16px 11.5px 30px rgba(12, 12, 13, 0.10)',
    flexDirection: 'row',
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF', 
    alignItems: 'center',
    fontFamily: 'Inter',
  },
  button: {
    width: '25%',
    height: '100%',
    backgroundColor: 'white',
  },
  icon: {
    width: '30%',
    height: '50%',
    alignItems: 'center',
  },
  iconcontainer: {
    paddingTop: 15,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
})

export default AdminNavbar;