import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { Platform, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts, Inter_700Bold } from '@expo-google-fonts/inter';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const AppBar = () => {
    const navigation = useNavigation();
    const route = useRoute();

    let [fontsLoaded] = useFonts({ Inter_700Bold });
    if (!fontsLoaded) return null;

    return (
        <Appbar.Header style={styles.appbar}>
            {navigation.canGoBack() && (
                <Appbar.Action icon={() => <MaterialIcons name="keyboard-arrow-left" size={30} color="white" />} onPress={() => navigation.goBack()} />
            )}
            <Appbar.Content title={route.name} titleStyle={styles.title} />
            <Appbar.Action icon={MORE_ICON} color="white" onPress={() => {}} />
        </Appbar.Header>
    );
};

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#ff69b4',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    title: {
        color: 'white',
        fontSize: 22,
        marginTop: 5,
        fontWeight: 'bold',
        fontFamily: 'Inter_700Bold',
    },
});

export default AppBar;
