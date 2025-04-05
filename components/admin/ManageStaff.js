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
    backgroundColor: '#F4F4F4',
  },
  tabBar: {
    backgroundColor: 'white',
    elevation: 5,
    height: 50,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  tabIndicator: {
    backgroundColor: '#ff69b4', // Pink background for selected tab
    height: '100%', // Cover the entire height
    borderRadius: 10,
  },
  tabLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    textTransform: 'none',
  },
});

export default ManageStaff;