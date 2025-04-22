import React, { useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard, StatusBar, Alert
} from 'react-native';
import { ApplicationProvider, Input } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import axios from 'axios';
import config from '../../server/config/config';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts, Inter_700Bold, Inter_500Medium, Inter_400Regular } from '@expo-google-fonts/inter';
import AppBar from '../design/AppBar';

const ForgetPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: verification, 3: new password
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

  const handleSendCode = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${config.address}/api/user/forgot-password`, { email });
      if (response.data.success) {
        setStep(2);
      } else {
        setError(response.data.message || 'Failed to send verification code.');
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError('Please enter the verification code.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${config.address}/api/user/verify-reset-code`, {
        email,
        code: verificationCode
      });
      if (response.data.success) {
        setStep(3);
      } else {
        setError(response.data.message || 'Invalid verification code.');
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setError('Failed to verify code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${config.address}/api/user/reset-password`, {
        email,
        code: verificationCode,
        newPassword
      });
      if (response.data.success) {
        Alert.alert(
          'Success',
          'Your password has been reset successfully. You can now login with your new password.',
          [{ text: 'OK', onPress: () => navigation.navigate('LogIn') }]
        );
      } else {
        setError(response.data.message || 'Failed to reset password.');
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
        <AppBar />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <StatusBar barStyle="default" />
            
              <Animatable.View animation="fadeInUp" duration={800} style={styles.form}>
                <Text style={styles.title}>Reset Password</Text>

                {step === 1 && (
                  <>
                    <Input
                      placeholder="Email Address"
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      accessoryLeft={() => (
                        <MaterialIcons name="email" size={24} color="#aaa" />
                      )}
                      size="large"
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                    <TouchableOpacity
                      style={[styles.button, isLoading && styles.disabledBtn]}
                      onPress={handleSendCode}
                      disabled={isLoading}
                    >
                      <LinearGradient
                        colors={['#FF8DC7', '#FF69B4']}
                        style={styles.gradientBtn}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.buttonText}>
                          {isLoading ? 'Sending...' : 'Send Verification Code'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Input
                      placeholder="Verification Code"
                      style={styles.input}
                      value={verificationCode}
                      onChangeText={setVerificationCode}
                      accessoryLeft={() => (
                        <MaterialIcons name="verified" size={24} color="#aaa" />
                      )}
                      size="large"
                      keyboardType="number-pad"
                    />
                    <TouchableOpacity
                      style={[styles.button, isLoading && styles.disabledBtn]}
                      onPress={handleVerifyCode}
                      disabled={isLoading}
                    >
                      <LinearGradient
                        colors={['#FF8DC7', '#FF69B4']}
                        style={styles.gradientBtn}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.buttonText}>
                          {isLoading ? 'Verifying...' : 'Verify Code'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                )}

                {step === 3 && (
                  <>
                    <Input
                      placeholder="New Password"
                      style={styles.input}
                      secureTextEntry={secureTextEntry}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      accessoryLeft={() => (
                        <MaterialIcons name="lock" size={24} color="#aaa" />
                      )}
                      accessoryRight={renderPasswordIcon}
                      size="large"
                    />
                    <Input
                      placeholder="Confirm New Password"
                      style={styles.input}
                      secureTextEntry={secureTextEntry}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      accessoryLeft={() => (
                        <MaterialIcons name="lock" size={24} color="#aaa" />
                      )}
                      size="large"
                    />
                    <TouchableOpacity
                      style={[styles.button, isLoading && styles.disabledBtn]}
                      onPress={handleResetPassword}
                      disabled={isLoading}
                    >
                      <LinearGradient
                        colors={['#FF8DC7', '#FF69B4']}
                        style={styles.gradientBtn}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.buttonText}>
                          {isLoading ? 'Resetting...' : 'Reset Password'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                )}

                {error && (
                  <Animatable.Text animation="shake" duration={500} style={styles.error}>
                    {error}
                  </Animatable.Text>
                )}

                <TouchableOpacity 
                  style={styles.backToLogin} 
                  onPress={() => navigation.navigate('LogIn')}
                >
                  <Text style={styles.backToLoginText}>Back to Login</Text>
                </TouchableOpacity>
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
  gradient: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
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
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 50,
    width: '100%',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
  },
  gradientBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: 'Inter_700Bold',
    color: 'white',
    fontSize: 16,
  },
  error: {
    color: '#FF5252',
    fontSize: 14,
    marginTop: 15,
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
  },
  backToLogin: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backToLoginText: {
    fontFamily: 'Inter_500Medium',
    color: '#FF69B4',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default ForgetPassword;