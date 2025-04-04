import React, { useState } from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, View, Modal, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper';

const Notification = ({ navigation }) => {
  const [hasNotification, setHasNotification] = useState(false);
  const [notificationsData, setNotificationsData] = useState([
    { id: 1, type: 'Adoption', message: 'Chris Turbo submitted an Adoption Application for Bella.', read: false },
    { id: 2, type: 'Adoption', message: 'Jake Lonio submitted an Adoption Application for Labubu.', read: false },
    { id: 3, type: 'Adoption', message: 'Julia Manolo added Bella in their favorites.', read: false },
    { id: 7, type: 'Adoption', message: 'Update: Event successfully updated', read: false },
  ]);

  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const [editMessage, setEditMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const updateNotification = () => {
    if (selectedNotificationId && editMessage.trim()) {
      const updatedNotifications = notificationsData.map((notification) => {
        if (notification.id === selectedNotificationId) {
          return { ...notification, message: editMessage };
        }
        return notification;
      });
      setNotificationsData(updatedNotifications);
      setSelectedNotificationId(null);
      setEditMessage('');
      setModalVisible(false);
    }
  };

  const toggleNotificationReadStatus = (notificationId) => {
    const updatedNotifications = notificationsData.map((notification) => {
      if (notification.id === notificationId) {
        return { ...notification, read: !notification.read };
      }
      return notification;
    });
    setNotificationsData(updatedNotifications);
  };

  return (
    <PaperProvider>
    <View style={styles.container}>
      
      <Text style={styles.welcome}>Notifications</Text>
      <View style={styles.notificationList}>
        {notificationsData.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[styles.notificationItem, notification.read && styles.readNotification]}
            onPress={() => handleNotificationDetails(notification.id)}
            onLongPress={() => {
              toggleNotificationReadStatus(notification.id);
              setSelectedNotificationId(notification.id);
              setEditMessage(notification.message);
              setModalVisible(true);
            }}
          >
            <FontAwesome
              name={notification.type === 'Adoption' ? 'paw' : 'stethoscope'}
              size={24}
              color={notification.type === 'Adoption' ? '#FF66C4' : 'orange'} 
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.message}>{notification.message}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
    </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F6',
  },
  logo: {
    width: 40,
    height: 40,
  },
  navBar: {
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF', 
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcome: {
    fontFamily: 'Inter',
    marginTop: 130,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 30,
    marginLeft: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 12,
    color: '#000000',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginHorizontal: 5,
},
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notificationList: {
    flex: 1,
    paddingTop: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  readNotification: {
    backgroundColor: '#f0f0f0', 
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#FF66C4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Notification;
