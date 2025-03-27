import { View, StyleSheet } from 'react-native';
import AppBar from '../design/AppBar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ActiveAdoptions from './ActiveAdoptions';
import PendingAdoptions from './PendingAdoptions';


const Tab = createMaterialTopTabNavigator();

function ManageAdoptions () {
  return (
    <View style={styles.container}>
      <AppBar></AppBar>
      <Tab.Navigator>
        <Tab.Screen name="Active Adoptions" component={ActiveAdoptions} style={styles.label}/>
        <Tab.Screen name="Pending Adoptions" component={PendingAdoptions} style={styles.label}/>
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

export default ManageAdoptions;