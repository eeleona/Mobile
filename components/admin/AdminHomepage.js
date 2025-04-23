import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Dimensions, ImageBackground, FlatList, Modal } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';
import Carousel from "react-native-reanimated-carousel";
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const AdminHomepage = ({ navigation }) => {
  // Navigation handlers
  const handlePet = () => { navigation.navigate('Manage Pet'); };
  const handleUser = () => { navigation.navigate('Manage User'); };
  const handleStaff = () => { navigation.navigate('Manage Staff'); };
  const handleNearby = () => { navigation.navigate('Manage Nearby Services'); };
  const handleEvents = () => { navigation.navigate('Events'); };
  const handleFeedback = () => { navigation.navigate('Feedback'); };
  const handleAdoptions = () => { navigation.navigate('Manage Adoptions'); };
  const handleAdminlogs = () => { navigation.navigate('Admin Logs'); };
  const handlePendingUsers = () => { navigation.navigate('Pending Users'); };
  const handleVerifiedUsers = () => { navigation.navigate('Verified Users'); };
  const handleActiveAdoptions = () => { navigation.navigate('Active Adoptions'); };
  const handlePendingAdoptions = () => { navigation.navigate('Pending Adoptions'); };

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Searchable items
  const searchItems = [
    { name: 'Adoptions', action: handleAdoptions },
    { name: 'Active Adoptions', action: handleActiveAdoptions },
    { name: 'Pending Adoptions', action: handlePendingAdoptions },
    { name: 'Events', action: handleEvents },
    { name: 'Feedback', action: handleFeedback },
    { name: 'Nearby Services', action: handleNearby },
    { name: 'Pets', action: handlePet },
    { name: 'Users', action: handleUser },
    { name: 'Pending Users', action: handlePendingUsers },
    { name: 'Verified Users', action: handleVerifiedUsers },
    { name: 'Staff', action: handleStaff },
    { name: 'Admin', action: () => { navigation.navigate('Manage Staff') } }, // Add appropriate navigation if needed
    { name: 'Admin Logs', action: handleAdminlogs },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const results = searchItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSearchItemPress = (action) => {
    action();
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const slides = [
    { count: 9, label: 'Pets', image: require('../../assets/Images/card1.png') },
    { count: 3, label: 'Verified Users', image: require('../../assets/Images/card2.png') },
    { count: 1, label: 'Admin', image: require('../../assets/Images/card3.png') },
    { count: 2, label: 'Active Adoptions', image: require('../../assets/Images/card4.png') },
    { count: 3, label: 'Barangays', image: require('../../assets/Images/card5.png') },
  ];

  let [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/Images/pasayshelter.jpg')}
          style={styles.mainSection}
        >
          <LinearGradient
            colors={['rgb(216, 17, 133)', 'rgb(224, 118, 184)', 'rgba(248, 190, 222, 0.36)']}
            style={styles.gradient}
          >
            <View style={styles.searchContainer}>
              <Image 
                source={require('../../assets/Images/nobglogo.png')} 
                style={styles.logo} 
                accessibilityLabel="App logo"
              />
              <Text style={styles.welcome1}>Welcome, </Text><Text style={styles.welcome2}>Super Admin! </Text>
            </View> 
            
            {/* Search Results Modal */}
            {showSearchResults && (
              <View style={styles.searchResultsContainer}>
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.name}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.searchResultItem}
                      onPress={() => handleSearchItemPress(item.action)}
                    >
                      <Text style={styles.searchResultText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  style={styles.searchResultsList}
                />
              </View>
            )}

            <View style={styles.welcomecontainer}>
              <Image style={styles.pawicon} source={require('../../assets/Images/pawicon.png')}></Image>
              <Text style={styles.welcome}>Dashboard</Text>
            </View>
            
            <View style={styles.carouselContainer}>
              <Carousel
                ref={carouselRef}
                loop
                width={width}
                height={230}
                data={slides}
                autoPlay
                autoPlayInterval={4000}
                scrollAnimationDuration={900}
                pagingEnabled
                onSnapToItem={(index) => setActiveIndex(index)}
                renderItem={({ item, index, animationValue }) => {
                  const animatedStyle = useAnimatedStyle(() => {
                    const scale = interpolate(
                      animationValue.value,
                      [-1, 0, 1],
                      [0.1, 1, 0.1],
                      Extrapolate.CLAMP
                    );
                    return { transform: [{ scale }] };
                  });

                  return (
                    <Animated.View style={[styles.card, animatedStyle]}>
                      <View style={styles.cardTextContainer}>
                        <View style={styles.cardRow}>
                          <Text style={styles.cardCount}>{item.count}</Text>
                          <Text style={styles.cardLabel}>{item.label}</Text>
                        </View>
                        <Text style={styles.cardDescription}>
                          Total number of {item.label.toLowerCase()} in E-Pet Adopt.
                        </Text>
                      </View>
                      <Image source={item.image} style={styles.cardImage} />
                    </Animated.View>
                  );
                }}
              />

              <View style={styles.paginationContainer}>
                {slides.map((_, index) => (
                  <View key={index} style={[styles.paginationDot, activeIndex === index && styles.activeDot]} />
                ))}
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.module1}>
          <Text style={styles.serviceTitle}>Services</Text>
          <View style={styles.service}>
            <TouchableOpacity style={styles.button} onPress={handleAdoptions}>
              <View style={styles.iconcontainer}>
                <Image style={styles.icon} source={require('../../assets/Images/manageadoption.png')}/>
              </View>
              <Text style={styles.labels}>Adoptions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleEvents}>
              <View style={styles.iconcontainer}>
                <Image style={styles.icon} source={require('../../assets/Images/manageevent.png')}/>
              </View>
              <Text style={styles.labels}>Events</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleFeedback}>
              <View style={styles.iconcontainer}>
                <Image style={styles.icon} source={require('../../assets/Images/managefeedback.png')}/>
              </View>
              <Text style={styles.labels}>Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNearby}>
              <View style={styles.iconcontainer}>
                <Image style={styles.icon} source={require('../../assets/Images/managenearby.png')}/>
              </View>
              <Text style={styles.labels}>Nearby</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.modules}>
          <Text style={styles.infoTitle}>Information Management</Text>
          <View style={styles.manage}>
            <TouchableOpacity style={styles.button} onPress={handlePet}>
              <View style={styles.iconcontainer}>
                <Image style={styles.icon} source={require('../../assets/Images/managepet.png')}/>
              </View>
              <Text style={styles.labels}>Pets</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleUser}>
              <View style={styles.iconcontainer}> 
                <Image style={styles.icon} source={require('../../assets/Images/manageuser.png')}/>
              </View>
              <Text style={styles.labels}>Users</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleStaff}>
              <View style={styles.iconcontainer}>
                <Image style={styles.icon} source={require('../../assets/Images/managestaff.png')}/>
              </View>
              <Text style={styles.labels}>Staff</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleAdminlogs}>
              <View style={styles.iconcontainer}>
                <Image style={styles.icon} source={require('../../assets/Images/managelogs.png')}/>
              </View>
              <Text style={styles.labels}>Admin Logs</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 15,
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
    borderColor: '#ff69b4',
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  searchIcon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: 'black',
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 110,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    zIndex: 20,
    maxHeight: 300,
  },
  searchResultsList: {
    padding: 10,
  },
  searchResultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchResultText: {
    color: '#333',
    fontSize: 16,
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
    borderColor: '#ff69b4',
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  searchIcon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#ff69b4',
  },
  mainSection: {
    width: '100%',
    
  },
  gradient: {
    paddingBottom: 15,
    width: '100%',
  },
  carouselContainer: {
    alignItems: 'center',
  },
  card: {
    width: '90%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 20,
  },
  
  cardTextContainer: {
    flex: 1,
    paddingLeft: 10,
    marginTop: 30,
  },
  
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  cardCount: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#ff69b4',
    marginRight: 5,
  },
  
  cardLabel: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 30,
    marginLeft: 5,
  },
  
  cardDescription: {
    fontSize: 12,
    color: '#777',
    marginTop: 20,
  },
  
  cardImage: {
    width: 160, // Adjusted width
    height: '80%', // Full height
    
    
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    backgroundColor: '#89a66b',
  },
  welcomecontainer: {
    marginLeft: 1,
    marginTop: 100,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  pawicon: {
    marginTop: 8,
    width: 80,
    height: 80,
  },
  welcome1: {
    fontFamily: 'Inter_700Bold',
    color: 'black',
    fontSize: 25,
  },
  welcome2: {
    fontFamily: 'Inter_700Bold',
    color: '#ff69b4',
    fontSize: 25,
  },
  welcome: {
    fontFamily: 'Inter_700Bold',
    color: 'white',
    fontSize: 25,
  },
  header: {
    width: '100%',
    backgroundImage: 'linear-gradient(180deg, rgba(255, 255, 255, 0.20) 0%, rgba(213.56, 13.35, 133.48, 0.20) 65%)',
  },
  serviceTitle: {
    fontFamily: 'Inter_700Bold',
    color: '#353935',
    fontSize: 25,
    textAlign: 'left', // Align text to the left
    width: '100%', // Ensure it spans the full width
    paddingLeft: 25, // Add padding for spacing
  },
  module1: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 100,
    marginTop: 60,
  },
  infoTitle: {
    fontFamily: 'Inter_700Bold',
    color: '#353935',
    fontSize: 25,
    marginTop: 30,
    textAlign: 'left', // Align text to the left
    width: '100%', // Ensure it spans the full width
    paddingLeft: 25, // Add padding for spacing
  },
  modules: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 100,
    marginTop: 60,
  },
  manage: {
    padding: 10,
    width: '100%',
    height: 140,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    fontFamily: 'Inter',
  },
  service: {
    padding: 10,
    width: '100%',
    height: 140,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    fontFamily: 'Inter',
  },
  button: {
    width: '20%',
    height: 80,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconcontainer: {
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    width: '100%',
    height: '100%', // Ensure it takes the full height of the button
  },
  icon: {
    width: 50,
    height: 50,
  },
  labels: {
    fontFamily: 'Inter_500Medium',
    color: 'black',
    fontSize: 13,
    wordWrap: 'break-word',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    textAlign: 'center',
  }
});

export default AdminHomepage;