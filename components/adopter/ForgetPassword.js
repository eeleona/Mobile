import React, { useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard, StatusBar, Alert, ScrollView
} from 'react-native';
import { ApplicationProvider, Input } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import axios from 'axios';
import config from '../../server/config/config';
import { MaterialIcons } from '@expo/vector-icons';
import AppBar from '../design/AppBar';

const ForgetPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ email: '', code: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const toggleSecureEntry = () => setSecureTextEntry(!secureTextEntry);

  const renderPasswordIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <MaterialIcons
        name={secureTextEntry ? "visibility-off" : "visibility"}
        size={24}
        color="#FF4081"
        {...props}
      />
    </TouchableWithoutFeedback>
  );

  const renderEmailIcon = (props) => (
    <MaterialIcons name="email" size={20} color="#FF4081" {...props} />
  );

  const renderCodeIcon = (props) => (
    <MaterialIcons name="vpn-key" size={20} color="#FF4081" {...props} />
  );

  const handleVerifyCode = async () => {
    console.log('Verifying code...'); // Debug log
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
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Verification response:', response.data); // Debug log
      
      if (response.data.success) {
        console.log('Code verified successfully'); // Debug log
        setIsCodeVerified(true);
        setResetToken(response.data.resetToken);
        setStatus(prev => ({ ...prev, code: 'Code verified successfully.' }));
      } else {
        setError(response.data.message || 'Invalid verification code. Please request a new code.');
      }
    } catch (error) {
      console.error("Verification Error:", error.response?.data || error.message);
      if (error.response?.status === 400) {
        setError('This code has expired. Please request a new verification code.');
      } else {
        setError(error.response?.data?.message || 'Failed to verify code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setError('');
    setStatus({ email: '', code: '', password: '' });
    setVerificationCode(''); // Clear previous code
    setIsCodeVerified(false); // Reset verification status
    setResetToken(''); // Clear previous token

    try {
      const response = await axios.post(`${config.address}/api/user/forgotpassword`, { 
        email 
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setIsCodeSent(true);
        setStatus(prev => ({ ...prev, email: 'New verification code sent to email.' }));
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
        newPassword,
        resetToken
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
      setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.inner}>
            <AppBar title="Reset Password" />

            <View style={styles.formSection}>
              <Input
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                accessoryLeft={renderEmailIcon}
                keyboardType="email-address"
                autoCapitalize="none"
                status={status.email ? 'success' : 'basic'}
                caption={status.email}
                size="medium"
              />

              <TouchableOpacity 
                style={[
                  styles.button, 
                  !email && styles.disabledButton
                ]} 
                onPress={handleSendCode} 
                disabled={!email || isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Sending...' : 'Send Verification Code'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Input
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChangeText={(text) => {
                  const formattedText = text.replace(/[^0-9]/g, '').slice(0, 6);
                  setVerificationCode(formattedText);
                }}
                keyboardType="number-pad"
                accessoryLeft={renderCodeIcon}
                style={styles.input}
                editable={isCodeSent && !isCodeVerified}
                status={status.code ? 'success' : 'basic'}
                caption={status.code}
                maxLength={6}
                size="medium"
              />

              <TouchableOpacity
                style={[
                  styles.button, 
                  (!verificationCode || verificationCode.length !== 6 || isCodeVerified) && styles.disabledButton
                ]}
                onPress={handleVerifyCode}
                disabled={!verificationCode || verificationCode.length !== 6 || isCodeVerified || isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
            <Input
              style={styles.input}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={secureTextEntry}
              accessoryRight={renderPasswordIcon}
              disabled={!isCodeVerified} // Fix: Only check if the code is verified
              status={status.password ? 'success' : 'basic'}
              size="medium"
            />

            <Input
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureTextEntry}
              accessoryRight={renderPasswordIcon}
              disabled={!isCodeVerified} // Fix: Only check if the code is verified
              status={status.password ? 'success' : 'basic'}
              size="medium"
            />

              <TouchableOpacity
                style={[
                  styles.button, 
                  (!isCodeVerified || !newPassword || !confirmPassword || newPassword !== confirmPassword) && styles.disabledButton
                ]}
                onPress={handleResetPassword}
                disabled={!isCodeVerified || !newPassword || !confirmPassword || newPassword !== confirmPassword || isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Text>
              </TouchableOpacity>
            </View>

            {!!error && (
              <Text style={styles.error}>
                {error}
              </Text>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ApplicationProvider>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  inner: { 
    
    justifyContent: 'center',
  },
  formSection: {
    marginHorizontal: 20,
    marginVertical: 20,
    
  },
  input: { 
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderColor: '#e0e0e0'
  },
  button: {
    backgroundColor: '#FF66C4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16
  },
  error: { 
    color: '#d9534f', 
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14
  },
  success: { 
    color: '#5cb85c', 
    marginTop: 10,
    fontSize: 14
  },
});

export default ForgetPassword;