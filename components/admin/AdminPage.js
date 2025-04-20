import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Image, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Text 
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import AdminHomepage from './AdminHomepage';
import Messages from './Messages';
import Notification from './Notification';

const Tab = createMaterialTopTabNavigator();

// Empty component for the logout tab
function EmptyScreen() {
  return null;
}

function AdminPage({ navigation }) {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogoutPress = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    // Add any logout logic here (clear tokens, etc.)
    navigation.navigate('Login'); // Navigate to login screen
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelLogout}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.logoutButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.buttonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: styles.tabBar,
          tabBarIndicatorStyle: styles.tabIndicator,
          tabBarLabelStyle: styles.tabLabel,
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
          tabBarIcon: ({ color }) => {
            let iconName;
            switch (route.name) {
              case 'Homepage':
                iconName = 'home';
                break;
              case 'Inbox':
                iconName = 'inbox';
                break;
              case 'Notification':
                iconName = 'notifications';
                break;
              case 'Logout':
                iconName = 'logout';
                break;
              default:
                iconName = 'error';
            }
            return (
              <MaterialIcons 
                name={iconName} 
                size={20} 
                color={color} 
                accessibilityLabel={`${route.name} tab icon`}
              />
            );
          },
        })}
      >
        <Tab.Screen 
          name="Homepage" 
          component={AdminHomepage} 
          options={{ tabBarLabel: 'Home' }}
        />
        <Tab.Screen 
          name="Inbox" 
          component={Messages} 
          options={{ tabBarLabel: 'Messages' }}
        />
        <Tab.Screen 
          name="Notification" 
          component={Notification} 
        />
        <Tab.Screen 
          name="Logout" 
          component={EmptyScreen}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              handleLogoutPress();
            },
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  tabBar: {
    position: 'absolute',
    bottom: 15,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    elevation: 3,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabIndicator: {
    backgroundColor: '#ff69b4',
    height: '100%',
    borderRadius: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'none',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    zIndex: 1000, // <-- add this
    elevation: 10, // <-- add this
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff69b4',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  logoutButton: {
    backgroundColor: '#ff69b4',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default React.memo(AdminPage);