   import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

const Welcome = ({ navigation, name }) => {
  const onButtonPress1 = () => {
    navigation.navigate('Rehome')
  };
  const onButtonPress2 = () => {
    navigation.navigate('Adopt')
  };
  const onButtonPress3 = () => {
    navigation.navigate('Home Fur-ever')
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hi, {name}</Text>
      <Text style={styles.message}>You have successfully created an account.</Text>
      <View style={styles.gradient}></View>
      <View style={styles.imageContainer}>
        <ImageBackground
          source={require('../../assets/Images/mainbg2.png')}
          style={styles.background}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onButtonPress1} style={[styles.button, { backgroundColor: '#FF66C4' }]}>
              <Text style={styles.buttonText}>Continue Adoption</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onButtonPress2} style={[styles.btn, { backgroundColor: '#32CD32' }]}>
              <Text style={styles.buttonText}>Continue Browsing</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onButtonPress3} style={[styles.button, { backgroundColor: '#FF66C4' }]}>
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50, 
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    width: '100%',
  },
  background: {
    width: '100%',
    height: 130,
    bottom: 148,
  },
  gradient : {
    width: "150%",
    height: "20%",
    backgroundImage: "linear-gradient(to right, #FF66C4, #FFDE59)",
    left: -50,
    top: -18,
  },
  greeting: {
    fontSize: 24,
    //fontWeight: 'bold',
    marginBottom: 10,
    top: -20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#36454F',
    top: -15,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginTop: 10,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    left: 90
  },
   
  button: {
    backgroundColor: '#29e342',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 200,
  },
  btn: {
    backgroundColor: '#32CD32',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    //fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Welcome;
