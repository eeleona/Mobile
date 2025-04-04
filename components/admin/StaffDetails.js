import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Divider } from 'react-native-paper';
import AppBar from '../design/AppBar';

const StaffDetails = ({ route, navigation }) => {
  const { staff } = route.params;

  return (
    <View style={styles.container}>
      <AppBar />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profile}>
          <Text style={styles.name}>{staff.s_fname} {staff.s_lname}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.detail}>Position: {staff.s_position}</Text>
          <Text style={styles.detail}>Email Address: {staff.s_email}</Text>
          <Text style={styles.detail}>Contact Number: {staff.s_contact}</Text>
          <Text style={styles.detail}>Address: {staff.s_address}</Text>
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
  divider: {
    marginVertical: 15,
    backgroundColor: '#ccc',
    height: 1,
  },
});

export default StaffDetails;