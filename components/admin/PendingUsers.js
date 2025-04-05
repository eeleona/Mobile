import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import config from '../../server/config/config';


const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Fetch pending users
  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get(`${config.address}/api/user/all`);
      setPendingUsers(response.data.users.filter(user => user.p_role === 'pending')); // Filter pending users
    } catch (error) {
      console.error('Error fetching pending users:', error);
      Alert.alert('Error', 'Failed to fetch pending users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // Render each user item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userContainer}
      onPress={() => navigation.navigate('View Pending User', { user: item })}
    >
      {/* User Image */}
      <Image
        style={styles.userThumbnail}
        source={{ uri: `${config.address}${item.p_img}` }}
      />
      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.p_fname} {item.p_mname} {item.p_lname}</Text>
        <Text style={styles.userDetails}>Gender: {item.p_gender}</Text>
        <Text style={styles.userDetails}>Address: {item.p_add}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <FlatList
            data={pendingUsers}
            renderItem={renderItem}
            keyExtractor={(item) => item._id || Math.random().toString()} // Fallback for missing _id
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<Text style={styles.emptyText}>No pending users found.</Text>}
          />
        )}
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
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});

export default PendingUsers;