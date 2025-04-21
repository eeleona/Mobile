import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
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
            <Text style={styles.statusText}>
              {user.v_role.charAt(0).toUpperCase() + user.v_role.slice(1)}
            </Text>
          </View>

          <Divider style={styles.divider} />

          {[
            { icon: 'person-outline', label: 'Username', value: user.v_username },
            { icon: 'email', label: 'Email Address', value: user.v_emailadd },
            { icon: 'phone', label: 'Contact Number', value: user.v_contactnumber },
            { icon: 'location-on', label: 'Address', value: user.v_add },
            { icon: 'wc', label: 'Gender', value: user.v_gender },
            { icon: 'cake', label: 'Birthday', value: user.v_birthdate },
          ].map((item, index) => (
            <View key={index}>
              <View style={styles.detailRow}>
                <MaterialIcons name={item.icon} size={20} color="#ff69b4" />
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>{item.label}:</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.value}>{item.value}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />
            </View>
          ))}
        </View>

        {/* Valid ID Section */}
        {user.v_validID && (
          <View style={styles.validID}>
            <TouchableOpacity style={styles.validIdButton} onPress={toggleValidIdVisibility}>
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
    marginTop: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    backgroundColor: '#ff69b4',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  labelContainer: {
    flex: 1,
    marginLeft: 8,
  },
  valueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  value: {
    fontSize: 14,
  },
  divider: {
    marginVertical: 5,
  },
  validID: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
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
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  validIdImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default VerifiedUserDetails;
