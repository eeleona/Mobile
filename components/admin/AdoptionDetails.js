import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Divider } from 'react-native-paper';
import AppBar from '../design/AppBar';
import { useFonts, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import config from '../../server/config/config';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AdoptionDetails = ({ route, navigation }) => {
    const { adoption } = route.params;

    let [fontsLoaded] = useFonts({ Inter_700Bold, Inter_500Medium });
    if (!fontsLoaded) return null;

    // Status Stepper Component
    const StatusStepper = ({ status }) => {
        const steps = ['Submitted', 'Accepted', 'Scheduled', 'Completed'];
        
        const getActiveStep = () => {
            switch (status?.toLowerCase()) {
                case 'pending': return 1;
                case 'accepted': return 2;
                case 'scheduled': return 3;
                case 'completed': return 4;
                default: return 1;
            }
        };

        const activeStep = getActiveStep();

        return (
            <View style={styles.stepperContainer}>
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <View style={styles.stepContainer}>
                            <View style={[
                                styles.stepCircle,
                                index < activeStep && styles.completedStep,
                                index === activeStep - 1 && styles.activeStep
                            ]}>
                                {index < activeStep ? (
                                    <Icon name="check" size={16} color="#FFF" />
                                ) : (
                                    <Text style={styles.stepNumber}>{index + 1}</Text>
                                )}
                            </View>
                            <Text style={[
                                styles.stepLabel,
                                index < activeStep && styles.completedLabel,
                                index === activeStep - 1 && styles.activeLabel
                            ]}>
                                {step}
                            </Text>
                        </View>
                        {index < steps.length - 1 && (
                            <View style={[
                                styles.stepLine,
                                index < activeStep - 1 && styles.completedLine
                            ]} />
                        )}
                    </React.Fragment>
                ))}
            </View>
        );
    };

    // Enhanced DetailRow with icons
    const DetailRow = ({ label, value, iconName }) => (
        <View>
            <View style={styles.detailRow}>
                <View style={styles.labelContainer}>
                    <Icon 
                        name={iconName} 
                        size={18} 
                        color="#ff69b4" 
                        style={styles.icon} 
                    />
                    <Text style={styles.detailLabel}>{label}</Text>
                </View>
                <Text style={styles.detailValue}>{value || 'N/A'}</Text>
            </View>
            <Divider style={styles.rowDivider} />
        </View>
    );

    return (
        <View style={styles.container}>
            <AppBar title="Adoption Details" onBackPress={() => navigation.goBack()} />
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Header Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Adoption Application</Text>
                    <Divider style={styles.sectionDivider} />
                    <DetailRow 
                        label="Submitted At:" 
                        value={new Date(adoption.a_submitted_at).toLocaleDateString()} 
                        iconName="event" 
                    />
                    <DetailRow 
                        label="Status:" 
                        value={adoption.status} 
                        iconName="info" 
                    />
                    <StatusStepper status={adoption.status} />
                </View>

                {/* Pet Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pet Details</Text>
                    <Divider style={styles.sectionDivider} />
                    {adoption.p_id?.pet_img?.[0] ? (
                        <Image 
                            source={{ uri: `${config.address}${adoption.p_id.pet_img[0]}` }} 
                            style={styles.petImage} 
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.placeholderText}>No image available</Text>
                        </View>
                    )}
                    <DetailRow label="Name:" value={adoption.p_id?.p_name} iconName="pets" />
                    <DetailRow label="Type:" value={adoption.p_id?.p_type} iconName="category" />
                    <DetailRow label="Breed:" value={adoption.p_id?.p_breed} iconName="straighten" />
                    <DetailRow label="Gender:" value={adoption.p_id?.p_gender} iconName="wc" />
                    <DetailRow 
                        label="Age:" 
                        value={adoption.p_id?.p_age ? `${adoption.p_id.p_age} years` : null} 
                        iconName="cake" 
                    />
                </View>

                {/* Adopter Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Adopter Details</Text>
                    <Divider style={styles.sectionDivider} />
                    {adoption.v_id?.v_img ? (
                        <Image 
                            source={{ uri: `${config.address}${adoption.v_id.v_img}` }} 
                            style={styles.profileImage} 
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.placeholderText}>No image available</Text>
                        </View>
                    )}
                    <DetailRow 
                        label="Name:" 
                        value={`${adoption.v_id?.v_fname} ${adoption.v_id?.v_lname}`} 
                        iconName="person" 
                    />
                    <DetailRow 
                        label="Username:" 
                        value={adoption.v_id?.v_username} 
                        iconName="alternate-email" 
                    />
                    <DetailRow 
                        label="Email:" 
                        value={adoption.v_id?.v_emailadd} 
                        iconName="email" 
                    />
                    <DetailRow 
                        label="Contact:" 
                        value={adoption.v_id?.v_contactnumber} 
                        iconName="phone" 
                    />
                    <DetailRow 
                        label="Address:" 
                        value={adoption.v_id?.v_add} 
                        iconName="home" 
                    />
                    <DetailRow 
                        label="Birthdate:" 
                        value={adoption.v_id?.v_birthdate} 
                        iconName="cake" 
                    />
                    <DetailRow 
                        label="Gender:" 
                        value={adoption.v_id?.v_gender} 
                        iconName="wc" 
                    />
                    <DetailRow 
                        label="Occupation:" 
                        value={adoption.occupation} 
                        iconName="work" 
                    />
                </View>

                {/* Household Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Household Information</Text>
                    <Divider style={styles.sectionDivider} />
                    <DetailRow 
                        label="Years in current address:" 
                        value={adoption.years_resided} 
                        iconName="calendar-today" 
                    />
                    <DetailRow 
                        label="Adults in household:" 
                        value={adoption.adults_in_household} 
                        iconName="people" 
                    />
                    <DetailRow 
                        label="Children in household:" 
                        value={adoption.children_in_household} 
                        iconName="child-care" 
                    />
                    <DetailRow 
                        label="Allergic to pets:" 
                        value={adoption.allergic_to_pets} 
                        iconName="warning" 
                    />
                    <DetailRow 
                        label="Home type:" 
                        value={adoption.home_type} 
                        iconName="apartment" 
                    />
                    <DetailRow 
                        label="Household Description:" 
                        value={adoption.household_description} 
                        iconName="description" 
                    />
                    
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 24,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ff69b4',
        marginBottom: 12,
        fontFamily: 'Inter_700Bold',
    },
    sectionDivider: {
        marginBottom: 12,
        backgroundColor: '#eee',
        height: 1,
    },
    rowDivider: {
        marginVertical: 8,
        backgroundColor: '#f0f0f0',
        height: 1,
    },
    petImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#f0f0f0',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginBottom: 16,
        backgroundColor: '#f0f0f0',
    },
    imagePlaceholder: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    placeholderText: {
        color: '#999',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '700',
        fontFamily: 'Inter_700Bold',
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
        textAlign: 'right',
        flex: 1,
        paddingLeft: 16,
        fontFamily: 'Inter_500Medium',
    },
    householdDescription: {
        marginTop: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: '#333',
        marginTop: 4,
        fontFamily: 'Inter_500Medium',
    },
    // Status Stepper Styles
    stepperContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    stepContainer: {
        alignItems: 'center',
        minWidth: 80,
    },
    stepCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedStep: {
        backgroundColor: '#4CAF50',
    },
    activeStep: {
        backgroundColor: '#ff69b4',
    },
    stepNumber: {
        color: '#757575',
        fontWeight: 'bold',
    },
    stepLabel: {
        marginTop: 5,
        color: '#757575',
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Inter_500Medium',
    },
    completedLabel: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    activeLabel: {
        color: '#ff69b4',
        fontWeight: 'bold',
    },
    stepLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 5,
    },
    completedLine: {
        backgroundColor: '#4CAF50',
    },
});

export default AdoptionDetails;