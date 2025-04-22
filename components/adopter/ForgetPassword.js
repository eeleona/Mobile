import React, { useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard, StatusBar, Alert, ScrollView
} from 'react-native';
import { ApplicationProvider, Input } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import axios from 'axios';
import config from '../../server/config/config';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts, Inter_700Bold, Inter_500Medium, Inter_400Regular } from '@expo-google-fonts/inter';
import AppBar from '../design/AppBar';

const ForgetPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({
    email: '',
    code: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const toggleSecureEntry = () => setSecureTextEntry(!secureTextEntry);

  const renderPasswordIcon = () => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <MaterialIcons
        name={secureTextEntry ? "visibility-off" : "visibility"}
        size={24}
        color="#FF4081"
      />
    </TouchableWithoutFeedback>
  );

  const renderEmailIcon = () => (
    <MaterialIcons name="email" size={20} color="#FF4081" />
  );

  const renderCodeIcon = () => (
    <MaterialIcons name="vpn-key" size={20} color="#FF4081" />
  );

  const handleSendCode = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setError('');
    setStatus({ email: '', code: '', password: '' });

    try {
      const response = await axios.post(`${config.address}/api/user/forgotpassword`, { email });
      if (response.data.success) {
        setIsCodeSent(true);
        setStatus(prev => ({ ...prev, email: 'Reset code sent to email.' }));
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
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setError('');
    setStatus(prev => ({ ...prev, code: '' }));

    try {
      const response = await axios.post(`${config.address}/api/user/verify-code`, {
        email,
        code: verificationCode
      });
      if (response.data.success) {
        setIsCodeVerified(true);
        setStatus(prev => ({ ...prev, code: 'Code verified successfully.' }));
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

    if (!isCodeVerified) {
      setError('Please verify the code first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setStatus(prev => ({ ...prev, password: '' }));

    try {
      const response = await axios.post(`${config.address}/api/user/reset-password`, {
        email,
        newPassword
      });
      if (response.data.success) {
        setStatus(prev => ({ ...prev, password: 'Password reset successfully.' }));
        Alert.alert(
          'Success',
          'Your password has been reset. Please log in with your new password.',
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <AppBar title="Forgot Password" />

            <ScrollView contentContainerStyle={styles.inner}>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              {status.email ? <Text style={styles.success}>{status.email}</Text> : null}
              <Input
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                accessoryLeft={renderEmailIcon}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.button} onPress={handleSendCode}>
                <Text style={styles.buttonText}>Send Code</Text>
              </TouchableOpacity>

              <Input
                placeholder="Verification Code"
                value={verificationCode}
                onChangeText={setVerificationCode}
                accessoryLeft={renderCodeIcon}
                style={styles.input}
                keyboardType="number-pad"
                maxLength={6}
                disabled={!isCodeSent}
              />
              <TouchableOpacity style={styles.button} onPress={handleVerifyCode} disabled={!isCodeSent}>
                <Text style={styles.buttonText}>Verify Code</Text>
              </TouchableOpacity>

              {status.code ? <Text style={styles.success}>{status.code}</Text> : null}

              <Input
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                accessoryRight={renderPasswordIcon}
                secureTextEntry={secureTextEntry}
                style={styles.input}
                disabled={!isCodeVerified}
              />
              <Input
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                accessoryRight={renderPasswordIcon}
                secureTextEntry={secureTextEntry}
                style={styles.input}
                disabled={!isCodeVerified}
              />
              <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={!isCodeVerified}>
                <Text style={styles.buttonText}>Reset Password</Text>
              </TouchableOpacity>

              {status.password ? <Text style={styles.success}>{status.password}</Text> : null}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ApplicationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    padding: 20,
    paddingTop: 50,
  },
  input: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#FF4081',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Inter_700Bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'Inter_500Medium',
  },
  success: {
    color: 'green',
    marginBottom: 10,
    fontFamily: 'Inter_500Medium',
  },
});

export default ForgetPassword;