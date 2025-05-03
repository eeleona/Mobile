import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, Image,
  ActivityIndicator, RefreshControl, TouchableOpacity
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import config from '../../server/config/config';
import { MaterialIcons } from '@expo/vector-icons';

const AdminImg = require('../../assets/Images/nobglogo.png');

const Notification = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setError('Not authenticated. Please login.');
        navigation.navigate('Login');
        return;
      }

      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        setError('Session expired. Please login again.');
        await AsyncStorage.removeItem('authToken');
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get(`${config.address}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(response.data);
      setError(null);
    } catch (err) {
      console.error("Notification fetch error:", err.message);
      if (err.response?.status === 401) {
        await AsyncStorage.removeItem('authToken');
        setError('Session expired. Please login again.');
        navigation.navigate('Login');
      } else {
        setError('Failed to fetch notifications');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchNotifications();
    });
    return unsubscribe;
  }, [navigation]);

  const markAsRead = async (notificationId, type) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.patch(`${config.address}/api/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(notifications.map(n =>
        n._id === notificationId ? { ...n, isRead: true } : n
      ));

      if (type === 'adoption') {
        navigation.navigate('Manage Adoptions');
      }
    } catch (err) {
      console.error("Mark as read error:", err.message);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        item.isRead ? styles.readItem : styles.unreadItem
      ]}
      onPress={() => markAsRead(item._id, item.type)}
    >
      <View style={styles.content}>
        <View style={styles.row}>
          <MaterialIcons
            name={item.type === 'adoption' ? 'pets' : 'notifications'}
            size={22}
            color={item.type === 'adoption' ? '#ff69b4' : '#999'}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.message}>{item.message}</Text>
        </View>
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchNotifications}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={AdminImg} style={styles.logo} />
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.empty}>No notifications found</Text>}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff69b4',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationItem: {
    backgroundColor: '#fff',
    
    padding: 16,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff69b4',
  },
  readItem: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    color: '#333',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  type: {
    color: '#777',
    fontSize: 13,
  },
  date: {
    color: '#777',
    fontSize: 13,
  },
  petImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginTop: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#999',
  },
  retryButton: {
    backgroundColor: '#ff69b4',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


export default Notification;