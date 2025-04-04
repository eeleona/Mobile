import { View, TextInput, Image, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import AdminHomepage from './AdminHomepage';
import Messages from './Messages';
import Notification from './Notification';
import LogIn from './LogIn';

const Tab = createMaterialTopTabNavigator();

function AdminPage() {
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Image source={require('../../assets/Images/nobglogo.png')} style={styles.logo} />
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#ff69b4" style={styles.searchIcon} />
          <TextInput placeholder="Search..." placeholderTextColor="#ff69b4" style={styles.input} />
        </View>
      </View>

      <Tab.Navigator
        screenOptions={({ route }) => {
          const { key, ...restProps } = route; // REMOVE `key`
          return {
            tabBarStyle: styles.tabBar,
            tabBarIndicatorStyle: styles.tabIndicator,
            tabBarLabelStyle: styles.tabLabel,
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'gray',
            tabBarIcon: ({ color }) => {
              let iconName;
              if (route.name === 'Homepage') iconName = 'home';
              else if (route.name === 'Inbox') iconName = 'inbox';
              else if (route.name === 'Notification') iconName = 'notifications';
              else if (route.name === 'Logout') iconName = 'logout';

              return <MaterialIcons name={iconName} size={20} color={color} />;
            },
          };
        }}
      >
        <Tab.Screen name="Homepage" component={AdminHomepage} />
        <Tab.Screen name="Inbox" component={Messages} />
        <Tab.Screen name="Notification" component={Notification} />
        <Tab.Screen name="Logout" component={LogIn} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  searchContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 5,
    elevation: 3,
    zIndex: 10,
    marginVertical: 5,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: 'white',
  },
  searchIcon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: 'gray',
  },
  tabBar: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    elevation: 3,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    
  },
  tabIndicator: {
    backgroundColor: '#ff69b4', // Pink BG for selected tab
    height: '100%',
    borderRadius: 20,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'none',
  },
});

export default AdminPage;
