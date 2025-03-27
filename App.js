import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';

// Importing all components
import AdminHomepage from './components/admin/AdminHomepage';
import Messages from './components/admin/Messages';
import Notification from './components/admin/Notification';
import LogIn from './components/admin/LogIn';
import ManagePets from './components/admin/ManagePets';
import ManageNearby from './components/admin/ManageNearby';
import ManageStaff from './components/admin/ManageStaff';
import ManageUser from './components/admin/ManageUser';
import Events from './components/admin/Events';
import Feedbacks from './components/admin/Feedbacks';
import ActiveAdoptions from './components/admin/ActiveAdoptions';
import Neutering from './components/admin/Neutering';
import UserLogin from './components/adopter/UserLogin';
import Welcome from './components/adopter/Welcome';
import UserHomepage from './components/adopter/UserHomepage';
import AboutUs from './components/adopter/AboutUs';
import AdoptAPet from './components/adopter/AdoptAPet';
import AdoptionProcess from './components/adopter/AdoptionProcess';
import Submission from './components/adopter/Submission';
import UserNearby from './components/adopter/UserNearby';
import AdminNavbar from './components/design/AdminNavbar';
import PetDetails from './components/admin/PetDetails';
import VerifiedUsers from './components/admin/VerifiedUsers';
import PendingUsers from './components/admin/PendingUsers';
import Admin from './components/admin/Admin';
import Staff from './components/admin/Staff';
import AddEvent from './components/admin/AddEvent';
import AddStaff from './components/admin/AddStaff';
import DataPrivacy from './components/adopter/DataPrivacy';
import Signup from './components/adopter/Signup';
import UserEvents from './components/adopter/UserEvents';
import PendingAdoptions from './components/admin/PendingAdoptions';
import ManageAdoptions from './components/admin/ManageAdoptions';
import UserInbox from './components/adopter/UserInbox';
import UserNotif from './components/adopter/UserNotif';
import AdoptionForm from './components/adopter/AdoptionForm';
import SignupInfo from './components/adopter/SignupInfo';
import Account from './components/adopter/Account';
import MyAdoptions from './components/adopter/MyAdoptions';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {/* SUPER ADMIN NAVIGATIONS */}
        
        <Stack.Screen name='Admin Navbar' component={AdminNavbar} options={{ headerShown: false }} />
        <Stack.Screen name='Login' component={LogIn} options={{ headerShown: false }} />
        <Stack.Screen name='Admin Homepage' component={AdminHomepage} options={{ headerShown: false }} />
        <Stack.Screen name='Inbox' component={Messages} options={{ headerShown: false }} />
        <Stack.Screen name='Notifications' component={Notification} options={{ headerShown: false }} />

        {/* SUPER ADMIN MODULES */}
        <Stack.Screen name='Feedback' component={Feedbacks} options={{ headerShown: false }} />
        <Stack.Screen name='Events' component={Events} options={{ headerShown: false }} />
        <Stack.Screen name='Adoptions' component={ActiveAdoptions} options={{ headerShown: false }} />
        <Stack.Screen name='Manage Staff' component={ManageStaff} options={{ headerShown: false }} />
        <Stack.Screen name='Manage Pet' component={ManagePets} options={{ headerShown: false }} />
        <Stack.Screen name='Manage User' component={ManageUser} options={{ headerShown: false }} />
        <Stack.Screen name='Manage Nearby Services' component={ManageNearby} options={{ headerShown: false }} />
        <Stack.Screen name='Neutering Services' component={Neutering} options={{ headerShown: false }} />
        <Stack.Screen name='Verified Users' component={VerifiedUsers} options={{ headerShown: false }} />
        <Stack.Screen name='Pending Users' component={PendingUsers} options={{ headerShown: false }} />
        <Stack.Screen name='Admins' component={Admin} options={{ headerShown: false }} />
        <Stack.Screen name='Staff' component={Staff} options={{ headerShown: false }} />
        <Stack.Screen name='Add Event' component={AddEvent} options={{ headerShown: false }} />
        <Stack.Screen name='Add Staff' component={AddStaff} options={{ headerShown: false }} />
        <Stack.Screen name='Active Adoptions' component={ActiveAdoptions} options={{ headerShown: false }} />
        <Stack.Screen name='Pending Adoptions' component={PendingAdoptions} options={{ headerShown: false }} />
        <Stack.Screen name='Manage Adoptions' component={ManageAdoptions} options={{ headerShown: false }} />
        

        {/* ADOPTER LOGIN */}
        <Stack.Screen name='Sign up' component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name='Sign up Info' component={SignupInfo} options={{ headerShown: false }} />
        <Stack.Screen name='Welcome' component={Welcome} options={{ headerShown: false }} />
        
        {/* ADOPTER TOP NAVIGATIONS */}
        <Stack.Screen name='About Us' component={AboutUs} options={{ headerShown: false }} />
        <Stack.Screen name='User Homepage' component={UserHomepage} options={{ headerShown: false }} />
        
        {/* ADOPTER MODULES */}
        <Stack.Screen name='Adopt A Pet' component={AdoptAPet} options={{ headerShown: false }} />
        <Stack.Screen name='Adoption Process' component={AdoptionProcess} options={{ headerShown: false }} />
        <Stack.Screen name='Submission' component={Submission} options={{ headerShown: false }} />
        <Stack.Screen name='User Nearby Services' component={UserNearby} options={{ headerShown: false }} />
        <Stack.Screen name='Account' component={Account} options={{ headerShown: false }} />
        <Stack.Screen name='My Adoptions' component={MyAdoptions} options={{ headerShown: false }} />

        {/* ADOPTER SUB-MODULES */}
        <Stack.Screen name='Data Privacy' component={DataPrivacy} options={{ headerShown: false }} />
        <Stack.Screen name='User Events' component={UserEvents} options={{ headerShown: false }} />
        <Stack.Screen name='User Inbox' component={UserInbox} options={{ headerShown: false }} />
        <Stack.Screen name='User Notif' component={UserNotif} options={{ headerShown: false }} />
        <Stack.Screen name='Adoption Form' component={AdoptionForm} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
