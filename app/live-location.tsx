import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function LiveLocationScreen() {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    // Request permission and get the user's initial location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Permission Denied', 'We need location access to show you on the map.');
        router.back();
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const handleShareLocation = async () => {
    setIsSharing(true);
    try {
      // 1. Load contacts
      const savedContactsJSON = await AsyncStorage.getItem('emergencyContacts');
      const savedContacts = savedContactsJSON ? JSON.parse(savedContactsJSON) : [];

      if (savedContacts.length === 0) {
        Alert.alert('No Contacts Found', 'Please add at least one emergency contact before sharing your location.', [
          { text: "Add Contacts", onPress: () => router.push('/emergency-contacts') }
        ]);
        setIsSharing(false);
        return;
      }

      // 2. Prepare the message
      const { latitude, longitude } = location.coords;
      const mapLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      const message = `Hi, I am sharing my current location with you. You can see me here: ${mapLink}`;
      
      const phoneNumbers = savedContacts.map(c => c.phone);

      // 3. Send the SMS
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync(phoneNumbers, message);
      } else {
        Alert.alert("SMS Not Available", "We couldn't open your SMS app.");
      }
    } catch (error) {
      console.error("Failed to share location:", error);
      Alert.alert("Error", "An unexpected error occurred while trying to share your location.");
    }
    setIsSharing(false);
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = 'Your current location is shown below.';
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Share Your Location</Text>
      <Text style={styles.statusText}>{text}</Text>
      
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
            />
          </MapView>
        ) : (
          <ActivityIndicator size="large" color="#8E44AD" />
        )}
      </View>

      <Pressable 
        style={styles.shareButton} 
        onPress={handleShareLocation} 
        disabled={!location || isSharing}
      >
        {isSharing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="share-social-outline" size={24} color="#fff" />
            <Text style={styles.shareButtonText}>Share My Location Now</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4A0C6B',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#6A1B9A',
    marginBottom: 20,
    textAlign: 'center',
  },
  mapContainer: {
    width: '100%',
    height: '60%',
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0BBE4',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#8E44AD'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: '#27AE60',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});