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
  SafeAreaView, StatusBar
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import config from '../../server/config/config';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';

const AdminImg = require('../../assets/Images/nobglogo.png');

const UserNotif = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

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

  const markAsRead = async (notificationId, type) => {
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
      
      setNotifications(notifications.map(n => 
        n._id === notificationId ? {...n, isRead: true} : n
      ));

      // Navigate to Adoption Tracker for adoption-related notifications
      if (type === 'adoption') {
        navigation.navigate('Adoption Tracker');
      }
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
      onPress={() => markAsRead(item._id, item.type)}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.notificationHeader}>
          <MaterialIcons
            name={item.type === 'adoption' ? 'pets' : 'notifications'}
            size={24}
            color={item.isRead ? '#888' : '#ff69b4'}
            style={styles.notificationIcon}
          />
          <Text style={[
            styles.notificationTitle,
            item.isRead && styles.readTitle
          ]}>
            {item.type === 'adoption' ? 'New Adoption Request' : 'Notification'}
          </Text>
        </View>
        <Text style={[
          styles.message,
          item.isRead && styles.readMessage
        ]}>
          {item.message}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
          {!item.isRead && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>New</Text>
            </View>
          )}
        </View>
        {item.petImage && (
          <Image 
            source={{ uri: item.petImage }} 
            style={styles.petImage} 
            resizeMode="cover"
          />
        )}
      </View>
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff69b4" />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff69b4" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={50} color="#ff69b4" />
        <Text style={styles.errorText}>{error}</Text>
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
      <StatusBar barStyle="default" />
      <View style={styles.header}>
        <Image source={AdminImg} style={styles.logo} />
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="notifications-off" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>You'll see notifications here when you have them</Text>
          </View>
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
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    flex: 1,
  },
  listContainer: {
    paddingBottom: 100,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  unreadItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff69b4',
  },
  readItem: {
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationIcon: {
    marginRight: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#333',
  },
  readTitle: {
    color: '#888',
  },
  message: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#444',
    lineHeight: 22,
    marginBottom: 12,
  },
  readMessage: {
    color: '#666',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: '#888',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  unreadBadge: {
    backgroundColor: '#ff69b4',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  petImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FAF9F6',
  },
  errorText: {
    color: '#ff69b4',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    marginVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter_500Medium',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: '#ff69b4',
    padding: 12,
    borderRadius: 8,
    width: 150,
    alignItems: 'center',
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
});

export default UserNotif;