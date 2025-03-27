import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import AdminNavbar from '../design/AdminNavbar';
import AppBar from '../design/AppBar';

// Sample data to mimic service lists
const SERVICES = {
  'Veterinary Clinics': [
    {
      name: 'Carveldon Veterinary Center',
      address: 'CPC, 21 Cartimar Ave, Pasay, 1300 Metro Manila',
      image: require('../../assets/Images/vetone.png'),
    },
    {
      name: 'Cruz Veterinary Clinic',
      address: 'Stall G, Felimarc Pet Center, 2189 A. Luna, Pasay, 1300 Metro Manila',
      image: require('../../assets/Images/vettwo.png'),
    },
  ],
  'Neutering Clinics': [
    {
      name: 'Pet Allies Animal Clinic',
      address: 'Unit 6, Megal Taft Bldg., 2140 Taft Ave.Cor.',
      image: require('../../assets/Images/locOne.png'),
    },
    {
      name: 'The Veterinary Hub Pte. Corp',
      address: 'Unit W Zone V, 1300 Taft Ave, Pasay, Metro Manila',
      image: require('../../assets/Images/locTwo.png'),
    },
  ],
  'Pet Hotels': [
    {
      name: 'Dog Friend Hotel & SPA',
      address: 'Unit K & C Felimarc Center Taft Avenue',
      image: require('../../assets/Images/hotelone.png'),
    },
    {
      name: 'The Pup Club',
      address: '131 Armstrong Ave corner Von Braun, Parañaque, Philippines',
      image: require('../../assets/Images/hotelTwo.png'),
    },
  ],
  'Pet Grooming': [
    {
      name: 'Happy Tails Pet Salon',
      address: '32 C Clemente Jose, Malibay, Pasay, 1300 Kalakhang Maynila',
      image: require('../../assets/Images/salonOne.png'),
    },
    {
      name: 'Dogs and The City',
      address: '116-117 South parking SM Mall of Asia, Parañaque, Philippines',
      image: require('../../assets/Images/salonTwo.png'),
    },
  ],
};

const ManageNearby = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [hasNotification, setHasNotification] = useState(false);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredServices([]);
    } else {
      const filtered = Object.keys(SERVICES).filter((service) =>
        service.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  };

  const onButtonPress = (route) => {
    if (route === 'Notifications') {
      setHasNotification(false);
    }
    navigation.navigate(route);
  };

  const renderServiceList = (service) => {
    return (
      <FlatList
        data={SERVICES[service]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.clinicContainer}>
            <View style={styles.clinicItem}>
              <Image source={item.image} style={styles.clinicImage} />
              <View style={styles.clinicDetails}>
                <Text style={styles.clinicName}>{item.name}</Text>
                <Text style={styles.clinicAddress}>{item.address}</Text>
              </View>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.buttonText}>EDIT</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <AppBar></AppBar>
      <Text style={styles.heading}>Nearby Services</Text>
      <Image
        style={styles.map}
        source={require('../../assets/Images/pasaymap.png')}
        resizeMode="contain"
      />
      
      <View style={styles.buttonContainerr}>
        {filteredServices.length > 0 ? (
          filteredServices.map((service, index) => (
            <View key={index} style={{ marginHorizontal: 10}}>
              <Text style={styles.title}>{service}</Text>
              {renderServiceList(service)}
            </View>
          ))
        ) : (
          <FlatList
            style={styles.flat}
            data={Object.keys(SERVICES)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.serviceCategoryContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setFilteredServices([item]);
                  }}
                  style={[styles.buttons, { backgroundColor: '#cad47c', color: 'white'}]}
                >
                  <Text style={styles.buttonText}>{item.toUpperCase()}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
      <AdminNavbar></AdminNavbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  heading: {
    fontFamily: 'Inter_700Bold',
    color: '#ff69b4',
    fontSize: 30,
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 15,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    marginBottom: 10,
  },
  map: {
    width: "100%", 
    height: "30%",
  },
  searchBarContainer: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#000',
    paddingVertical: 40,
    fontFamily: 'Inter_500Medium',
  },
  searchBar: {
    width: '80%',
    height: 20,
    borderWidth: 1,
    borderColor: '#A9A9A9',
    boxShadow: '4px 4px 11.5px 4px rgba(12, 12, 13, 0.10)',
    borderRadius: 20,
    padding: 10,
  },
  flat: {
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Inter_700Bold',
    color: 'white',
  },
  button: {
    width: '80%',
    height: 30,
    borderRadius: 40,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    backgroundColor: '#E6A1C2',
    fontFamily: 'Inter_700Bold',
},
  buttonContainerr: {
    marginTop: 20,
    justifyContent: 'space-between',
  },
  serviceCategoryContainer: {
    padding: 1,
    elevation: 5,
  },
  clinicContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  clinicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },
  clinicImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  clinicDetails: {
    flex: 1,
  },
  clinicName: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Inter_500Medium',
  },
  clinicAddress: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Inter_500Medium',
  },
  bookButton: {
    backgroundColor: '#FF66C4',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttons: {
    backgroundColor: '#FF66C4',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    fontFamily: 'Inter_700Bold',
  },
});

export default ManageNearby;