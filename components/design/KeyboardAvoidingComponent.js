import { SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, StatusBar } from "react-native";

const KeyboardAvoidingComponent = ({ children, style, backgroundColor }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor:  backgroundColor }}>
            <KeyboardAvoidingView 
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.contentContainer, style]}>
            {children}
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        padding: 20,
        paddingTop: Platform.OS === "android" ?
        StatusBar.currentHeight + 50 : 50,
    }
})

export default KeyboardAvoidingComponent;