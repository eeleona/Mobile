import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const UserPetGrooming = ({ navigation }) => {
  const [hasNotification, setHasNotification] = useState(false);

  const onButtonPress = (route) => {
    if (route === 'Notifications') {
      setHasNotification(false);
    }
    navigation.navigate(route);
  };

const topButtons = [
  { title: 'Home', route: 'Home Page', isBottom: true },
  { title: 'Messages', route: 'Messages' },
  { title: 'Notifications', route: 'Notifications', isBottom: true },
  { title: 'Log Out', route: 'Log In', isBottom: true },
];

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <View style={styles.logoContainer}>
        <Image
            source={require('../../assets/Images/nobglogo.png')}
            style={styles.logo}/>
        </View>
        <View style={styles.buttonsContainer}>
          {topButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => onButtonPress(button.route)}>
              <Text style={styles.buttonText}>{button.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Text style={styles.title}>PET GROOMING</Text>
      <View style={styles.clinicContainer}>
        <View style={styles.clinicItem}>
          <Image
            source={require('../../assets/Images/salonOne.png')}
            style={styles.clinicImage}
          />
          <View style={styles.clinicDetails}>
            <Text style={styles.clinicName}>Happy Tails Pet Salon</Text>
            <Text style={styles.clinicAddress}>32 C Clemente Jose, Malibay, Pasay,</Text>
            <Text style={styles.clinicAddress}>1300 Kalakhang Maynila</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.buttonText}>BOOK NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.clinicContainer}>
        <View style={styles.clinicItem}>
          <Image
            source={require('../../assets/Images/salonTwo.png')}
            style={styles.clinicImage}
          />
          <View style={styles.clinicDetails}>
            <Text style={styles.clinicName}>Dogs and The City</Text>
            <Text style={styles.clinicAddress}>116-117 South parking SM Mall of Asia,</Text>
            <Text style={styles.clinicAddress}>Parañaque, Philippines</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.buttonText}>BOOK NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  title: {
    fontSize: 24,
    //fontWeight: 'bold',
    marginBottom: 20,
  },
  clinicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  clinicItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clinicImage: {
    width: 120,
    height: 120,
    marginRight: 10,
    borderRadius: 10,
  },
  clinicDetails: {
    flex: 1,
    marginLeft: 10,
  },
  clinicName: {
    fontSize: 16, // Adjusted fontSize
    //fontWeight: 'bold', // Bold font weight
    marginBottom: 3, // Reduced margin
  },
  clinicAddress: {
    fontSize: 12, // Adjusted fontSize
    color: '#666666',
  },
  bookButton: {
    backgroundColor: '#FF66C4',
    borderRadius: 20,
    paddingVertical: 6, // Adjusted padding
    paddingHorizontal: 12, // Adjusted padding
    marginTop: 8, // Adjusted margin
  },
  buttonText: {
    color: 'white',
    //fontWeight: 'bold',
    fontSize: 12, // Adjusted fontSize
  },
});
export default UserPetGrooming;