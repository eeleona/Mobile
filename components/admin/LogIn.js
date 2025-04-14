import React, { useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View, Image,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useFonts, Inter_700Bold, Inter_500Medium, Inter_400Regular } from '@expo-google-fonts/inter';
import { ApplicationProvider, Input } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import config from '../../server/config/config';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons } from '@expo/vector-icons';

const LogIn = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderPasswordIcon = () => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <MaterialIcons
        name={secureTextEntry ? "visibility-off" : "visibility"}
        size={24}
        color="#aaa"
      />
    </TouchableWithoutFeedback>
  );

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${config.address}/api/user/login`, { username, password });
      const { accessToken } = response.data;

      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.setItem('authToken', accessToken);

      const decodedToken = jwt_decode(accessToken);
      const userRole = decodedToken.role;

      if (userRole === 'pending' || userRole === 'verified') {
        navigation.navigate('User Page');
      } else if (userRole === 'admin' || userRole === 'super-admin' || userRole === 'pending-admin') {
        navigation.navigate('Admin Page');
      } else {
        setError('Unauthorized role.');
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setError('Incorrect username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    navigation.navigate('Sign up');
  };

  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
    Inter_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <View style={styles.headercontainer}>
              <Image
                style={styles.header}
                source={require('../../assets/Images/loginheader2.png')}
                resizeMode="cover"
              />
            </View>

            <Animatable.View animation="fadeInUp" duration={800} style={styles.login}>
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,1)']}
                style={styles.gradient}
              >
                <View style={styles.formCenter}>
                  <View style={styles.welcome}>
                    <Text style={styles.appName}>Welcome to E-Pet Adopt!</Text>
                    <Text style={styles.subtext}>
                      Giving strays a chance to live life to their fullest
                    </Text>
                  </View>

                  <View style={styles.inputs}>
                    <Input
                      placeholder="Username"
                      style={styles.input}
                      value={username}
                      onChangeText={setUsername}
                      accessoryLeft={() => (
                        <MaterialIcons name="person" size={24} color="#aaa" />
                      )}
                      size="large"
                    />
                    <Input
                      placeholder="Password"
                      style={styles.input}
                      secureTextEntry={secureTextEntry}
                      value={password}
                      onChangeText={setPassword}
                      accessoryLeft={() => (
                        <MaterialIcons name="lock" size={24} color="#aaa" />
                      )}
                      accessoryRight={renderPasswordIcon}
                      size="large"
                    />
                    {error && (
                      <Animatable.Text animation="shake" duration={500} style={styles.error}>
                        {error}
                      </Animatable.Text>
                    )}
                  </View>

                  <View style={styles.buttons}>
                    <TouchableOpacity
                      style={[styles.loginbtn, isLoading && styles.disabledBtn]}
                      onPress={handleLogin}
                      disabled={isLoading}
                    >
                      <LinearGradient
                        colors={['#FF8DC7', '#FF69B4']}
                        style={styles.gradientBtn}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.btntext}>
                          {isLoading ? 'Logging in...' : 'Login'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.singupbtn} onPress={handleSignup}>
                      <Text style={styles.btntext2}>
                        Don't have an account? <Text style={styles.underline}>Sign up</Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </Animatable.View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ApplicationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  innerContainer: {
    flex: 1,
  },
  headercontainer: {
    width: '100%',
    height: '35%',
  },
  header: {
    width: '100%',
    height: '100%',
  },
  login: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  formCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  welcome: {
    alignItems: 'center',
    marginBottom: 30,
  },
  subtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  appName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: '#333',
  },
  inputs: {
    marginTop: 10,
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    borderColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttons: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginbtn: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 50,
    width: '100%',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.7,
  },
  btntext: {
    fontFamily: 'Inter_700Bold',
    color: 'white',
    fontSize: 16,
  },
  singupbtn: {
    marginTop: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btntext2: {
    fontFamily: 'Inter_500Medium',
    color: '#FF69B4',
    fontSize: 14,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  error: {
    color: '#FF5252',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
  },
});

export default LogIn;
