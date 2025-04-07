import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { PaperProvider, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import config from '../../server/config/config';

const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchPendingUsers = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(`${config.address}/api/user/all`);
      setPendingUsers(response.data.users.filter(user => user.p_role === 'pending'));
    } catch (error) {
      console.error('Error fetching pending users:', error);
      Alert.alert('Error', 'Failed to fetch pending users.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userContainer}
      onPress={() => navigation.navigate('View Pending User', { user: item })}
    >
      <Image
        style={styles.userThumbnail}
        source={{ uri: `${config.address}${item.p_img}` }}
        defaultSource={require('../../assets/Images/user.png')}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {item.p_fname} {item.p_mname} {item.p_lname}
        </Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.userDetails}>Gender: {item.p_gender}</Text>
          <Text style={styles.userDetails} numberOfLines={1}>
            Address: {item.p_add}
          </Text>
        </View>
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
            keyExtractor={(item) => item._id || Math.random().toString()}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No pending users found.</Text>
            }
            refreshing={refreshing}
            onRefresh={fetchPendingUsers}
          />
        )}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  appbar: {
    backgroundColor: '#ff69b4',
    elevation: 0,
  },
  appbarTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  userThumbnail: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#ff69b4',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a2a2a',
    marginBottom: 8,
  },
  detailsContainer: {
    marginTop: 4,
  },
  userDetails: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  listContainer: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 30,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 30,
  },
});

export default PendingUsers;