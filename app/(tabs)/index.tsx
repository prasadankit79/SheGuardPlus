import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import AsyncStorage from '@react-native-async-storage/async-storage';

// FeatureBox component (no changes here)
const FeatureBox = ({ iconName, title, onPress, isSpecial = false }) => {
  const boxStyle = isSpecial ? styles.contactUsBox : styles.featureBox;
  const textStyle = isSpecial ? styles.contactUsText : styles.featureText;
  const iconColor = isSpecial ? '#FFFFFF' : '#8E44AD';

  return (
    <Pressable style={boxStyle} onPress={onPress}>
      <Ionicons name={iconName} size={32} color={iconColor} />
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
};

export default function HomeScreen() {
  const router = useRouter();

  const handleContactUsPress = () => {
    const phoneNumber = '8658136967';
    const email = 'ankitprasad797979@gmail.com';

    Alert.alert(
      'Contact Us',
      'For any help or query, you can reach us via the options below.',
      [
        {
          text: 'Call Emergency No.',
          onPress: () => Linking.openURL(`tel:${phoneNumber}`),
        },
        {
          text: 'Send Email',
          onPress: () => Linking.openURL(`mailto:${email}`),
        },
      ],
      { cancelable: true }
    );
  };

  const features = [
    { icon: 'location-outline', title: 'Live Location Sharing', onPress: () => router.push('/live-location') },
    { icon: 'camera-outline', title: 'Live Location & Camera', onPress: () => router.push('/live-location-camera') },
    { icon: 'chatbubbles-outline', title: '24x7 Instant Chat', onPress: () => router.push('/chatbot') },
    { icon: 'alert-circle-outline', title: 'Body Shaming/ Harassment', onPress: () => router.push('/harassment') },
    // --- THIS IS THE ONLY LINE THAT HAS BEEN CHANGED ---
    { icon: 'mic-outline', title: 'Voice Message Incident', onPress: () => router.push('/voice-incident') },
    // ---
    { icon: 'help-buoy-outline', title: 'Common Problem', onPress: () => router.push('/common-problems') },
    { icon: 'call-outline', title: 'Contact Us', onPress: handleContactUsPress },
  ];

  const regularFeatures = features.slice(0, 6);
  const contactUsFeature = features[6];

  const handleSOSPress = async () => {
    const savedContactsJSON = await AsyncStorage.getItem('emergencyContacts');
    const savedContacts = savedContactsJSON ? JSON.parse(savedContactsJSON) : [];

    if (savedContacts.length === 0) {
      Alert.alert(
        "No Contacts Found",
        "Please add at least one emergency contact before using the SOS feature.",
        [
          { text: "Add Contacts", onPress: () => router.push('/emergency-contacts') },
          { text: "Cancel", style: "cancel" }
        ]
      );
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need location access to send your location in an emergency.');
      return;
    }

    Alert.alert("Getting Your Location...", "Please wait while we fetch your current position.");
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    const message = `I'm in some kind of Danger!!! Please help me. My Location is ${mapLink}`;
    
    const phoneNumbers = savedContacts.map(c => c.phone);

    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync(phoneNumbers, message);
    } else {
      Alert.alert("SMS Not Available", "We couldn't open your SMS app. Please send the message manually.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.welcomeText}>Welcome, stay safe.</Text>

      <View style={styles.sosOuterCircle}>
        <View style={styles.sosInnerCircle}>
          <Pressable style={styles.sosButton} onPress={handleSOSPress}>
            <Text style={styles.sosText}>SOS</Text>
            <Text style={styles.sosSubText}>"Bachao!"</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <Ionicons name="location" size={24} color="#2ECC71" />
          <Text style={styles.statusText}>Location ON</Text>
        </View>
        <View style={styles.statusItem}>
          <Ionicons name="wifi" size={24} color="#2ECC71" />
          <Text style={styles.statusText}>Online</Text>
        </View>
        <Pressable style={styles.statusItem} onPress={() => router.push('/emergency-contacts')}>
          <Ionicons name="people" size={24} color="#2ECC71" />
          <Text style={styles.statusText}>Contacts Added</Text>
        </Pressable>
      </View>

      <View style={styles.featuresGrid}>
        {regularFeatures.map((feature, index) => (
          <FeatureBox
            key={index}
            iconName={feature.icon}
            title={feature.title}
            onPress={feature.onPress}
          />
        ))}
      </View>

      <View style={styles.centeredBoxContainer}>
        <FeatureBox
          iconName={contactUsFeature.icon}
          title={contactUsFeature.title}
          onPress={contactUsFeature.onPress}
          isSpecial={true}
        />
      </View>
    </ScrollView>
  );
}

// Styles are unchanged
const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#F3E5F5',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A0C6B',
    textAlign: 'center',
    width: '100%',
    marginBottom: 20,
  },
  sosOuterCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(236, 65, 123, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  sosInnerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(236, 65, 123, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#EC417B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sosText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  sosSubText: {
    fontSize: 16,
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#4A0C6B',
    marginTop: 4,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  featureBox: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    height: 120,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureText: {
    marginTop: 8,
    fontSize: 14,
    color: '#4A0C6B',
    textAlign: 'center',
    fontWeight: '500',
  },
  centeredBoxContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  contactUsBox: {
    width: '60%',
    height: 70,
    backgroundColor: '#E74C3C',
    borderRadius: 35,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  contactUsText: {
    marginTop: 4,
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
});