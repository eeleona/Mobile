import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import config from '../../server/config/config';

const VerifiedUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const navigation = useNavigation();

  // Fetch verified users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${config.address}/api/verified/all`);
      setAllUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching verified users:', error);
      Alert.alert('Error', 'Failed to fetch users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Render each user item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userContainer}
      onPress={() => navigation.navigate('View Verified User', { user: item })}
    >
      {/* User Image */}
      <Image
        style={styles.userThumbnail}
        source={{ uri: `${config.address}${item.v_img}` }}
      />
      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.v_fname} {item.v_mname}. {item.v_lname}</Text>
        <Text style={styles.userDetails}>Gender: {item.v_gender}</Text>
        <Text style={styles.userDetails}>Address: {item.v_add}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <FlatList
          data={allUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item._id || Math.random().toString()} // Fallback for missing _id
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No verified users found.</Text>}
        />
      </View>
    </PaperProvider>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    padding: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 8,
    elevation: 3,
  },
  userThumbnail: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2a2a2a',
  },
  userDetails: {
    fontSize: 14,
    color: 'gray',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});

export default VerifiedUsers;