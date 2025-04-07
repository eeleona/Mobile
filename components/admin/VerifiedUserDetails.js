import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Divider } from 'react-native-paper';
import AppBar from '../design/AppBar';
import config from '../../server/config/config';

const VerifiedUserDetails = ({ route, navigation }) => {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <AppBar title="Verified User Details" onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Section */}
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.profileImage}
              source={
                user.v_img
                  ? { uri: `${config.address}${user.v_img}` }
                  : require('../../assets/Images/user.png')
              }
              resizeMode="cover"
            />
          </View>

          <Text style={styles.name}>
            {user.v_fname} {user.v_mname ? `${user.v_mname}.` : ''} {user.v_lname}
          </Text>
          <View style={[styles.statusContainer, { backgroundColor: '#ff69b4' }]}>
            <Text style={styles.statusText}>{user.v_role}</Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Username:</Text>
            <Text style={styles.detailValue}>{user.v_username}</Text>
          </View>
          <View style={styles.separator} />

          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{user.v_emailadd}</Text>
          </View>
          <View style={styles.separator} />

          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Contact:</Text>
            <Text style={styles.detailValue}>{user.v_contactnumber}</Text>
          </View>
          <View style={styles.separator} />

          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={styles.detailValue}>{user.v_add}</Text>
          </View>
          <View style={styles.separator} />

          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Gender:</Text>
            <Text style={styles.detailValue}>{user.v_gender}</Text>
          </View>
          <View style={styles.separator} />

          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>Birthday:</Text>
            <Text style={styles.detailValue}>{user.v_birthdate}</Text>
          </View>
          <View style={styles.separator} />
        </View>

        {/* Valid ID Section */}
        {user.v_validID && (
          <View style={[styles.card, { marginTop: 16 }]}>
            <Text style={styles.sectionTitle}>Valid ID</Text>
            <Divider style={styles.divider} />
            <Image
              style={styles.validIdImage}
              source={{ uri: `${config.address}${user.v_validID}` }}
              resizeMode="contain"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#ff69b4',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2a2a2a',
    textAlign: 'center',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#ff69b4',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#e0e0e0',
    height: 1,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  detailLabel: {
    fontSize: 15,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    flex: 2,
    textAlign: 'right',
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  statusContainer: {
    marginTop: 12,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a2a2a',
    marginBottom: 12,
  },
  validIdImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
});

export default VerifiedUserDetails;