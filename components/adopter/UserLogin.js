import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ImageBackground} from 'react-native';
import { ApplicationProvider, Divider, Input, Text } from '@ui-kitten/components';
import axios from 'axios';
import {  useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
import * as eva from '@eva-design/eva';
import config from './config';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';


const UserLogin = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  let [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSignup = () => {
    navigation.navigate('Sign up');
  };

  const handleLogin = () => {
    navigation.navigate('User Homepage');
  };


  // const handleLogin = async () => {
  //   try {
  //     const response = await axios.post(`${config.address}/api/user/login`, {
  //       username,
  //       password
  //     });
  //     console.log('Server response:', response);
  
  //     const token = response.data.accessToken;
  //     await AsyncStorage.setItem('token', token);
      
  //     const decodedToken = jwtDecode(token);
  //     const userRole = decodedToken.role;
  
  //     if (userRole === 'pending' || userRole === 'verified') {
  //       navigation.navigate('User Homepage');
  //     } else if (userRole === 'super-admin') {
  //       navigation.navigate('Admin Homepage');
  //     }
  
  //   } catch (err) {
  //     console.error('Error logging in:', err.response?.data || err.message);
  //     setError('Invalid username or password');
  //   }
  // };


  return (
  <ApplicationProvider {...eva} theme={eva.light}>
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../assets/Images/nobglogo.png')}
        resizeMode="contain"
      />
        <Text style={styles.loginText}>Welcome!</Text>
        <View style={styles.labelcontainer}>
          <Text style={styles.label}>Username</Text>
        </View>
        <Input
          style={styles.placeholder}
          value={username}
          onChangeText={(text)=>{setUsername(text)}}
        />
        <View style={styles.labelcontainer}>
          <Text style={styles.label}>Password</Text>
        </View>
        <Input
          style={styles.placeholder}
          secureTextEntry={true}
          value={password}
          onChangeText={(text)=>{setPassword(text)}}
        />
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Divider />
        <View style={styles.signupcontainer}>
          <TouchableOpacity style={styles.signUpLink} onPress={handleSignup}>
          <Text style={styles.signUpLink}>Create Account</Text></TouchableOpacity>
        </View>
        </View>
  </ApplicationProvider>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  background: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'inline-flex',
    zIndex: -1, 
    backgroundColor: 'white',
  },
  logo: {
    marginTop: 100,
    width: 250,
    height: 250,
  },
  loginText: {
    marginTop: 25,
    marginBottom: 35,
    color: 'black',
    fontSize: 45,
    fontFamily: 'Inter_700Bold',
    textTransform: 'capitalize',
    wordWrap: 'break-word',
  },
  labelcontainer: {
    width: '100%',
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    alignItems: 'flex-start',
    marginLeft: 33,
    fontFamily: 'Inter_500Medium',
  },
  placeholder: {
    marginTop: 10,
    marginBottom: 20,
    width: "85%",
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  button: {
    width: 320,
    height: 70,
    boxShadow: '0px 4px 4px 2px rgba(0, 0, 0, 0.25)',
    backgroundColor: '#FF9DD9',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    textTransform: 'capitalize',
    wordWrap: 'break-word',
  },
  signupcontainer: {
    flexDirection: 'row',
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    wordWrap: 'break-word',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpLink: {
    marginLeft: 2,
    color: '#FF66C4',
    fontFamily: 'Inter_500Medium',
  },
  error: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Inter',
    marginTop: 20,
  }
});
export default UserLogin;