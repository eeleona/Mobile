import { View, StyleSheet } from 'react-native';
import AppBar from '../design/AppBar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import VerifiedUsers from './VerifiedUsers';
import PendingUsers from './PendingUsers';
import AdminNavbar from '../design/AdminNavbar';

const Tab = createMaterialTopTabNavigator();

function ManageStaff () {
  return (
    <View style={styles.container}>
      <AppBar></AppBar>
      <Tab.Navigator>
        <Tab.Screen name="Verified Users" component={VerifiedUsers} style={styles.label}/>
        <Tab.Screen name="Pending Users" component={PendingUsers} style={styles.label}/>
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  label: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    color: 'red',
  }
});

export default ManageStaff;