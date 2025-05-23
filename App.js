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
import UserHomepage from './components/adopter/UserHomepage';
import AboutUs from './components/adopter/AboutUs';
import AdoptAPet from './components/adopter/AdoptAPet';
import AdoptionProcess from './components/adopter/AdoptionProcess';
import UserNearby from './components/adopter/UserNearby';
import PetDetails from './components/admin/PetDetails';
import VerifiedUsers from './components/admin/VerifiedUsers';
import PendingUsers from './components/admin/PendingUsers';
import Admin from './components/admin/Admin';
import Staff from './components/admin/Staff';
import AddEvent from './components/admin/AddEvent';
import AddStaff from './components/admin/AddStaff';
import Signup from './components/adopter/Signup';
import UserEvents from './components/adopter/UserEvents';
import PendingAdoptions from './components/admin/PendingAdoptions';
import ManageAdoptions from './components/admin/ManageAdoptions';
import UserInbox from './components/adopter/UserInbox';
import UserNotif from './components/adopter/UserNotif';
import AdoptionForm from './components/adopter/AdoptionForm';
import Account from './components/adopter/Account';
import MyAdoptions from './components/adopter/MyAdoptions';
import AdoptionDetails from './components/admin/AdoptionDetails';
import AdminPage from './components/admin/AdminPage';
import EditEvent from './components/admin/EditEvent';
import VerifiedUserDetails from './components/admin/VerifiedUserDetails';
import PendingUserDetails from './components/admin/PendingUserDetails';
import PendingAdoptionDetails from './components/admin/PendingAdoptionDetails';
import ViewEvent from './components/admin/ViewEvent';
import AdminLogs from './components/admin/AdminLogs';
import UserPage from './components/adopter/UserPage';
import OneMessage from './components/admin/OneMessage';
import AdoptThePet from './components/adopter/AdoptThePet';
import EventDetails from './components/adopter/EventDetails';
import Profile from './components/adopter/Profile';
import MessageShelter from './components/adopter/MessageShelter';
import AdoptionTracker from './components/adopter/AdoptionTracker';
import ForgetPassword from './components/adopter/ForgetPassword';
import EditNearby from './components/admin/EditNearby';
import FeedbackForm from './components/adopter/FeedbackForm';


export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>

        <Stack.Screen name='Login' component={LogIn} options={{ headerShown: false }} />
        <Stack.Screen name='Forget Password' component={ForgetPassword} options={{ headerShown: false }} />

        {/* SUPER ADMIN PAGES */}
        <Stack.Screen name='Admin Page' component={AdminPage} options={{ headerShown: false }} />
        <Stack.Screen name='Admin Homepage' component={AdminHomepage} options={{ headerShown: false }} />
        <Stack.Screen name='Inbox' component={Messages} options={{ headerShown: false }} />
        <Stack.Screen name='Chat History' component={OneMessage} options={{ headerShown: false }} />
        <Stack.Screen name='Notifications' component={Notification} options={{ headerShown: false }} />
        
        {/* SUPER ADMIN MODULES */}
        <Stack.Screen name='Manage Adoptions' component={ManageAdoptions} options={{ headerShown: false }} />
        <Stack.Screen name='Active Adoptions' component={ActiveAdoptions} options={{ headerShown: false }} />
        <Stack.Screen name='Pending Adoptions' component={PendingAdoptions} options={{ headerShown: false }} />
        <Stack.Screen name='View Active Adoption' component={AdoptionDetails} options={{ headerShown: false }} />
        <Stack.Screen name='View Pending Adoption' component={PendingAdoptionDetails} options={{ headerShown: false }} />

        <Stack.Screen name='Events' component={Events} options={{ headerShown: false }} />
        <Stack.Screen name='View Event' component={ViewEvent} options={{ headerShown: false }} />
        <Stack.Screen name='Edit Event' component={EditEvent} options={{ headerShown: false }} />
        <Stack.Screen name='Add Event' component={AddEvent} options={{ headerShown: false }} />
        
        <Stack.Screen name='Feedback' component={Feedbacks} options={{ headerShown: false }} />
        
        <Stack.Screen name='Manage Nearby Services' component={ManageNearby} options={{ headerShown: false }} />
        <Stack.Screen name='Edit Nearby' component={EditNearby} options={{ headerShown: false }} />

        <Stack.Screen name='Manage Pet' component={ManagePets} options={{ headerShown: false }} />
        <Stack.Screen name='View Pet Details' component={PetDetails} options={{ headerShown: false }} />
        
        <Stack.Screen name='Manage User' component={ManageUser} options={{ headerShown: false }} />
        <Stack.Screen name='Verified Users' component={VerifiedUsers} options={{ headerShown: false }} />
        <Stack.Screen name='Pending Users' component={PendingUsers} options={{ headerShown: false }} />
        <Stack.Screen name='View Verified User' component={VerifiedUserDetails} options={{ headerShown: false }} />
        <Stack.Screen name='View Pending User' component={PendingUserDetails} options={{ headerShown: false }} />

        <Stack.Screen name='Manage Staff' component={ManageStaff} options={{ headerShown: false }} />
        <Stack.Screen name='Admins' component={Admin} options={{ headerShown: false }} />
        <Stack.Screen name='Staff' component={Staff} options={{ headerShown: false }} />
        <Stack.Screen name='Add Staff' component={AddStaff} options={{ headerShown: false }} />

        <Stack.Screen name='Admin Logs' component={AdminLogs} options={{ headerShown: false }} />

        
        {/* ADOPTER CREATE ACCOUNT */}
        <Stack.Screen name='Sign up' component={Signup} options={{ headerShown: false }} />
        
        {/* ADOPTER HOMEPAGE */}
        <Stack.Screen name='User Page' component={UserPage} options={{ headerShown: false }} />
        <Stack.Screen name='About Us' component={AboutUs} options={{ headerShown: false }} />
        <Stack.Screen name='User Homepage' component={UserHomepage} options={{ headerShown: false }} />
        
        {/* ADOPTER MODULES */}
        <Stack.Screen name='Adopt A Pet' component={AdoptAPet} options={{ headerShown: false }} />
        <Stack.Screen name='Adopt The Pet' component={AdoptThePet} options={{ headerShown: false }} />
        <Stack.Screen name='Adoption Form' component={AdoptionForm} options={{ headerShown: false }} />
        <Stack.Screen name='Adoption Process' component={AdoptionProcess} options={{ headerShown: false }} />
        
        <Stack.Screen name='User Events' component={UserEvents} options={{ headerShown: false }} />
        <Stack.Screen name='Event Details' component={EventDetails} options={{ headerShown: false }} /> 

        <Stack.Screen name='User Nearby Services' component={UserNearby} options={{ headerShown: false }} />

        <Stack.Screen name='Account' component={Account} options={{ headerShown: false }} />
        <Stack.Screen name='My Profile' component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name='Adoption Tracker' component={MyAdoptions} options={{ headerShown: false }} />
        <Stack.Screen name='View Adoption' component={AdoptionTracker} options={{ headerShown: false }} />
        <Stack.Screen name='Submit Feedback' component={FeedbackForm} options={{ headerShown: false }} />
        
        <Stack.Screen name='User Inbox' component={UserInbox} options={{ headerShown: false }} />
        <Stack.Screen name='Message Shelter' component={MessageShelter} options={{ headerShown: false }} />
        <Stack.Screen name='User Notif' component={UserNotif} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}
