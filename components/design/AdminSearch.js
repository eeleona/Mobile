import { Searchbar } from 'react-native-paper';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const AdminSearch = () => {
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
        backgroundColor: '#f6f6f6',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        flexDirection: 'row',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        padding: 10,
    },
    logo: {
        width: 50,
        height: 50,
        alignItems: 'center',
        marginRight: 10,
    },
    Searchbar: {
        backgroundColor: 'white',
        width: '83%',
        height: '50%',
        alignItems: 'center',
        borderRadius: 15,
        color: 'black',
        
    },
});

export default AdminSearch;
