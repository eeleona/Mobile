import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import config from '../../server/config/config';
import { MaterialIcons } from '@expo/vector-icons';
import AppBar from '../design/AppBar';

const VerifiedUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${config.address}/api/verified/all`);
      setAllUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching verified users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderItem = ({ item }) => {
    const imageSource = item.v_img
      ? { uri: `${config.address}${item.v_img}` }
      : require('../../assets/Images/user.png');

    return (
      <TouchableOpacity
        style={styles.userContainer}
        onPress={() => navigation.navigate('View Verified User', { user: item })}
      >
        <Image style={styles.userThumbnail} source={imageSource} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item.v_fname} {item.v_mname}. {item.v_lname}
          </Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.userDetails}>Gender: {item.v_gender}</Text>
            <Text style={styles.userDetails} numberOfLines={1}>
              Address: {item.v_add}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <PaperProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            animating={true} 
            size="large" 
            color="#ff69b4"
            style={styles.loadingIndicator}
          />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        
        <FlatList
          data={allUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item._id || Math.random().toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#ff69b4']}
              tintColor="#ff69b4"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="people-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No verified users found</Text>
            </View>
          }
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingIndicator: {
    marginBottom: 16,
  },
  loadingText: {
    color: '#ff69b4',
    fontSize: 16,
    fontWeight: '500',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default VerifiedUsers;