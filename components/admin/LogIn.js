import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useFonts, Inter_700Bold, Inter_500Medium, Inter_400Regular } from '@expo-google-fonts/inter';
import { ApplicationProvider, Input } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import config from '../../server/config/config';

const LogIn = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
  
    try {
      const response = await axios.post(`${config.address}/api/user/login`, { username, password });
      const { accessToken } = response.data;
  
      // ✅ 1) Remove old token first
      await AsyncStorage.removeItem('authToken');
  
      // ✅ 2) Store the token correctly
      await AsyncStorage.setItem('authToken', accessToken);
  
      // ✅ 3) Retrieve it immediately to confirm
      const storedToken = await AsyncStorage.getItem('authToken');
      console.log("🔹 Retrieved Token Immediately After Storing:", storedToken);
  
      // ✅ 4) Decode token
      const decodedToken = jwt_decode(accessToken);
      console.log("✅ Decoded Token:", decodedToken);
  
      const userRole = decodedToken.role;
  
      // ✅ 5) Navigate based on role
      if (userRole === 'pending' || userRole === 'verified') {
        navigation.navigate('User Page');
      } else if (userRole === 'admin' || userRole === 'super-admin') {
        navigation.navigate('Admin Page');
      } else if (userRole === 'pending-admin') {
        navigation.navigate('Admin Page');
      } else {
        setError('Unauthorized role.');
      }
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data || error.message);
      setError('Incorrect username or password.');
    }
  };
  

  const handleSignup = () => {
    navigation.navigate('Sign up');
  };

  let [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
    Inter_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <View style={styles.container}>
        <View style={styles.headercontainer}>
          <Image
            style={styles.header}
            source={require('../../assets/Images/loginheader2.png')}
            resizeMode="cover"
          />
        </View>
        <View style={styles.login}>
          <View style={styles.welcome}>
            <Text style={styles.appName}>Welcome to E-Pet Adopt!</Text>
            <Text style={styles.subtext}>Giving strays a chance to live life to their fullest</Text>
          </View>
          <View style={styles.inputs}>
            <Input
              placeholder='Username'
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />
            <Input
              placeholder='Password'
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {error && <Text style={styles.error}>{error}</Text>}
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.loginbtn} onPress={handleLogin}>
              <Text style={styles.btntext}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.singupbtn} onPress={handleSignup}>
              <Text style={styles.btntext2}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ApplicationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headercontainer: {
    width: '100%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    height: '100%',
  },
  welcome: {
    marginTop: 50,
    alignItems: 'center',
    marginBottom: 30,
  },
  subtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: 'gray',
  },
  appName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 25,
  },
  inputs: {
    alignItems: 'center',
    marginTop: 30,
  },
  input: {
    width: '85%',
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#EEEEEE',
    
  },
  buttons: {
    alignItems: 'center',
    marginTop: 45,
  },
  loginbtn: {
    width: '85%',
    height: 50,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: '#ff69b4',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  btntext: {
    fontFamily: 'Inter_700Bold',
    color: 'white',
    fontSize: 18,
  },
  singupbtn: {
    width: '85%',
    height: 50,
    marginBottom: 10,
    backgroundColor: '#ffbdde',
    borderRadius: 5,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  btntext2: {
    fontFamily: 'Inter_700Bold',
    color: 'white',
    fontSize: 18,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default LogIn;
