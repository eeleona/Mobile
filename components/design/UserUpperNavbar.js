import './gesture-handler';
import { Searchbar } from 'react-native-paper';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';


const UserUpperNavbar = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <View style={styles.UpperNavbarContainer}>
        
        <Image style={styles.logo} source={require('../../assets/Images/nobglogo.png')}></Image>
        <Searchbar
            style={styles.Searchbar}
            onChangeText={setSearchQuery}
            value={searchQuery}
        />
    </View>
  );
};

const styles = StyleSheet.create({
    UpperNavbarContainer: {
        width: '100%',
        height: 90,
        backgroundColor: '#ff69b4',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        flexDirection: 'row',
        position: 'sticky',
        left: 0,
        right: 0,
        top: 0,
        paddingBottom: 10,
    },
    logo: {
        width: 40,
        height: 40,
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
    },
    Searchbar: {
        backgroundColor: 'white',
        width: '83%',
        height: '50%',
        alignItems: 'center',
        borderRadius: 10,
        color: 'black',
        marginTop: 42,
    },
});

export default UserUpperNavbar;