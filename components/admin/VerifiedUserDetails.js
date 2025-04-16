import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';

const VerifiedUserDetails = ({ route, navigation }) => {
  const { user } = route.params;
  const [isValidIdVisible, setIsValidIdVisible] = useState(false);
  const [arrowRotation] = useState(new Animated.Value(0));

  const toggleValidIdVisibility = () => {
    setIsValidIdVisible(!isValidIdVisible);

    Animated.timing(arrowRotation, {
      toValue: isValidIdVisible ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const arrowRotationStyle = {
    transform: [
      {
        rotate: arrowRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '90deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <AppBar title="Verified User Details" onBackPress={() => navigation.goBack()} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Section */}
        <View style={styles.profile}>
          <View style={styles.imageContainer}>
            <Image
              style={[styles.profileImage, { borderColor: '#ff69b4' }]}
              source={
                user.v_img
                  ? { uri: `${config.address}${user.v_img}` }
                  : require('../../assets/Images/user.png')
              }
              resizeMode="contain"
            />
          </View>

          <Text style={styles.name}>
            {user.v_fname} {user.v_mname ? `${user.v_mname}.` : ''} {user.v_lname}
          </Text>

          <View style={styles.statusContainer}>
            <MaterialIcons name="verified-user" size={20} color="white" />
            <Text style={styles.statusText}>{user.v_role}</Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.detailItem}>
            <View style={styles.detailLabel}>
              <MaterialIcons name="person-outline" size={20} color="#ff69b4" />
              <Text style={styles.labelText}>Username</Text>
            </View>
            <Text style={styles.detailValue}>{user.v_username}</Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailLabel}>
              <MaterialIcons name="email" size={20} color="#ff69b4" />
              <Text style={styles.labelText}>Email Address</Text>
            </View>
            <Text style={styles.detailValue}>{user.v_emailadd}</Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailLabel}>
              <MaterialIcons name="phone" size={20} color="#ff69b4" />
              <Text style={styles.labelText}>Contact Number</Text>
            </View>
            <Text style={styles.detailValue}>{user.v_contactnumber}</Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailLabel}>
              <MaterialIcons name="location-on" size={20} color="#ff69b4" />
              <Text style={styles.labelText}>Address</Text>
            </View>
            <Text style={styles.detailValue}>{user.v_add}</Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailLabel}>
              <MaterialIcons name="wc" size={20} color="#ff69b4" />
              <Text style={styles.labelText}>Gender</Text>
            </View>
            <Text style={styles.detailValue}>{user.v_gender}</Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailLabel}>
              <MaterialIcons name="cake" size={20} color="#ff69b4" />
              <Text style={styles.labelText}>Birthday</Text>
            </View>
            <Text style={styles.detailValue}>{user.v_birthdate}</Text>
          </View>
        </View>

        {/* Valid ID Section */}
        {user.v_validID && (
          <View style={styles.validID}>
            <TouchableOpacity 
              style={styles.validIdButton} 
              onPress={toggleValidIdVisibility}
            >
              <View style={styles.detailLabel}>
                <MaterialIcons name="verified" size={20} color="#ff69b4" />
                <Text style={styles.sectionTitle}>Valid ID</Text>
              </View>
              <Animated.View style={arrowRotationStyle}>
                <MaterialIcons name="keyboard-arrow-right" size={24} color="#333" />
              </Animated.View>
            </TouchableOpacity>
            
            {isValidIdVisible && (
              <View style={styles.imageContainer}>
                <Image
                  style={styles.validIdImage}
                  source={{ uri: `${config.address}${user.v_validID}` }}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  profile: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  validID: {
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  validIdButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 10,
    borderWidth: 4,
  },
  validIdImage: {
    marginTop: 10,
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  name: {
    marginTop: 15,
    fontSize: 24,
    color: '#2a2a2a',
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
  },
  detailItem: {
    marginBottom: 15,
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  labelText: {
    fontSize: 16,
    color: '#ff69b4',
    marginLeft: 10,
    fontFamily: 'Inter_500Medium',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    marginLeft: 30,
    fontFamily: 'Inter_500Medium',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#333',
    marginLeft: 10,
    fontFamily: 'Inter_700Bold',
  },
  divider: {
    marginVertical: 15,
    backgroundColor: '#e6dde3',
    height: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff69b4',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 16,
  },
});

export default VerifiedUserDetails;