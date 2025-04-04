import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; // Ensure you have this library installed
import AppBar from '../design/AppBar'; // Import your custom AppBar
import config from '../../server/config/config'; // Import your config for API address

const VerifiedUserDetails = ({ route, navigation }) => {
  const { user } = route.params; // Get the selected user details from route params
  const [isValidIdVisible, setIsValidIdVisible] = useState(false);
  const [arrowRotation] = useState(new Animated.Value(0));

  const toggleValidIdVisibility = () => {
    setIsValidIdVisible(!isValidIdVisible);

    // Animate the arrow rotation
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
      {/* Custom AppBar */}
      <AppBar title="Verified User Details" onBackPress={() => navigation.goBack()} />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profile}>
          {/* Profile Picture */}
          <View style={styles.imageContainer}>
            <Image
              style={styles.profileImage}
              source={{ uri: `${config.address}${user.v_img}` }}
              resizeMode="contain"
            />
          </View>

          {/* User Details */}
          <Text style={styles.name}>{user.v_fname} {user.v_mname} {user.v_lname}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.detail}>Username: {user.v_username}</Text>
          <Text style={styles.detail}>Email Address: {user.v_emailadd}</Text>
          <Text style={styles.detail}>Contact Number: {user.v_contactnumber}</Text>
          <Text style={styles.detail}>Address: {user.v_add}</Text>
          <Text style={styles.detail}>Gender: {user.v_gender}</Text>
          <Text style={styles.detail}>Birthday: {user.v_birthdate}</Text>
          <Text style={styles.detail}>Role: {user.v_role}</Text>
        </View>

        {/* Valid ID Section */}
        <View style={styles.validID}>
          <TouchableOpacity style={styles.validIdButton} onPress={toggleValidIdVisibility}>
            <Text style={styles.sectionTitle}>View Valid ID</Text>
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
  },
  validID: {
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  validIdButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  validIdImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  name: {
    fontSize: 24,
    color: '#ff69b4',
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
  },
  detail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Inter_500Medium',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'Inter_700Bold',
  },
  divider: {
    marginVertical: 15,
    backgroundColor: '#ccc',
    height: 1,
  },
});

export default VerifiedUserDetails;