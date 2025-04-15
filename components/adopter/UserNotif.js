// Notification.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import config from '../../server/config/config';

const AdminImg = require('../../assets/Images/nobglogo.png');
const UserNotif = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      // Get token the same way as in LogIn.js
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        setError('Not authenticated. Please login.');
        navigation.navigate('Login');
        return;
      }

      // Verify token validity (optional)
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        setError('Session expired. Please login again.');
        await AsyncStorage.removeItem('authToken');
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get(
        `${config.address}/api/notifications`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );
      
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      console.error("Notification fetch error:", err.response?.data || err.message);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        await AsyncStorage.removeItem('authToken');
        navigation.navigate('Login');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch notifications');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchNotifications();
    });

    return unsubscribe;
  }, [navigation]);

  const markAsRead = async (notificationId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.patch(
        `${config.address}/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      // Update local state
      setNotifications(notifications.map(n => 
        n._id === notificationId ? {...n, isRead: true} : n
      ));
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        item.isRead ? styles.readItem : styles.unreadItem
      ]}
      onPress={() => !item.isRead && markAsRead(item._id)}
    >
      <View style={styles.content}>
        <Text style={styles.message}>{item.message}</Text>
        <View style={styles.meta}>
          <Text style={styles.type}>{item.type}</Text>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {item.petImage && (
          <Image source={{ uri: item.petImage }} style={styles.petImage} />
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff69b4" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchNotifications}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Image source={AdminImg} style={styles.logo} />
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.empty}>No notifications found</Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ff69b4']}
            tintColor="#ff69b4"
          />
        }
      />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff69b4',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff69b4',
    // marginTop: 35,
    paddingHorizontal: 15,
    height: 80,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff69b4',
  },
  readItem: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    fontFamily: 'Inter_500Medium',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  type: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  date: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  petImage: {
    width: '100%',
    height: 150,
    borderRadius: 4,
    marginTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    marginBottom: 20,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter_400Regular',
  },
  retryButton: {
    backgroundColor: '#ff69b4',
    padding: 12,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontFamily: 'Inter_700Bold',
  },
});

export default UserNotif;