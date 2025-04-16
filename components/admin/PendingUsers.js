import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, TextInput
} from 'react-native';
import axios from 'axios';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import config from '../../server/config/config';
import { MaterialIcons } from '@expo/vector-icons'; // Add this to your imports


const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get(`${config.address}/api/user/all`);
      const pending = response.data.users.filter(user => user.p_role === 'pending');
      setPendingUsers(pending);
      setFilteredUsers(pending);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPendingUsers();
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const query = text.toLowerCase();
    const filtered = pendingUsers.filter(user =>
      `${user.p_fname} ${user.p_mname} ${user.p_lname}`.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.userContainer, styles.pendingBorder]}
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
        <View style={styles.pendingBadge}>
          <Text style={styles.pendingText}>PENDING</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.loadingText}>Loading pending users...</Text>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <MaterialIcons
          name="search"
          size={24}
          color="#ff69b4"
          style={styles.searchIcon}
        />
      </View>


        <FlatList
          data={filteredUsers}
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
              <Image
                source={require('../../assets/Images/pawicon2.png')}
                style={styles.pawIcon}
                resizeMode="contain"
              />
              <Text style={styles.emptyText}>No Pending Users</Text>
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
    backgroundColor: '#FAF9F6',
  },
  loadingIndicator: {
    marginBottom: 16,
  },
  loadingText: {
    color: '#ff69b4',
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 6,
    borderRadius: 10,
    borderColor: '#eee',
    borderWidth: 1,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  
  searchBar: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  
  searchIcon: {
    marginLeft: 8,
  },
  
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  pendingBorder: {
    borderLeftWidth: 6,
    borderLeftColor: '#ffe261',
  },
  userThumbnail: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#ffe261',
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
  pendingBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#FFFACD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  pendingText: {
    color: '#FF8C00',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  pawIcon: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default PendingUsers;
