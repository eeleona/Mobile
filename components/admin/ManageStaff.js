import { View, StyleSheet } from 'react-native';
import AppBar from '../design/AppBar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import VerifiedUsers from './VerifiedUsers';
import PendingUsers from './PendingUsers';
import PendingAdoptions from './PendingAdoptions';
import Admin from './Admin';
import Staff from './Staff';

const Tab = createMaterialTopTabNavigator();

function ManageStaff() {
  return (
    <View style={styles.container}>
      <AppBar />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarIndicatorStyle: styles.tabIndicator,
          tabBarLabelStyle: styles.tabLabel,
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Staff" component={Staff} />
        <Tab.Screen name="Admin" component={Admin} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  tabBar: {
    backgroundColor: 'white',
    elevation: 5,
    height: 50,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabIndicator: {
    backgroundColor: '#ff69b4', // Pink background for selected tab
    height: '100%', // Cover the entire height
    borderRadius: 10,
  },
  tabLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'none',
  },
});

export default ManageStaff;