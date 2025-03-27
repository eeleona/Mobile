import { View, StyleSheet } from 'react-native';
import AppBar from '../design/AppBar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Staff from './Staff';
import Admin from './Admin';

const Tab = createMaterialTopTabNavigator();

function ManageStaff () {
  return (
    <View style={styles.container}>
      <AppBar></AppBar>
      <Tab.Navigator>
        <Tab.Screen name="Staff" component={Staff} style={styles.label}/>
        <Tab.Screen name="Admin" component={Admin} style={styles.label}/>
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
    //fontWeight: 500,
  }
});

export default ManageStaff;