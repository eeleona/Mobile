import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter';

const AppBar = () => {
    const navigation = useNavigation();
    const route = useRoute();

    let [fontsLoaded] = useFonts({ Inter_700Bold, Inter_500Medium });
    if (!fontsLoaded) return null;

    return (
        <Appbar.Header style={styles.appbar}>
            {/* Back Button (Properly Centered Vertically) */}
            {navigation.canGoBack() && (
                <Appbar.Action 
                    style={styles.backButton} // Ensures full height & centered
                    icon={() => <MaterialIcons name="keyboard-arrow-left" size={32} color="#2a2a2a" />} 
                    onPress={() => navigation.goBack()} 
                />
            )}

            {/* Centered Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{route.name}</Text>
            </View>
        </Appbar.Header>
    );
};

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#FAF9F6',
        height: 70, // Taller app bar
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: 56,
        height: '100%', // Ensure full height
        justifyContent: 'center', // Center the icon vertically
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#2a2a2a',
        fontFamily: 'Inter_700Bold',
        marginTop: 8,
    },
    
    
});

export default AppBar;
