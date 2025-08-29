import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import { auth, db } from '../../config/firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

// Import our classic components
import SOSButton from '../../components/SOSButton';
import StatusDisplay from '../../components/StatusDisplay';

// Import our modern Tile component
import Tile from '../../components/Tile';

export default function HomeScreen() {
  const router = useRouter();
  const [locationStatus, setLocationStatus] = useState<Location.PermissionStatus>(
    Location.PermissionStatus.UNDETERMINED
  );

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationStatus(status);
    })();
  }, []);

  const handleSOS = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Not Logged In", "Please log in to use the SOS feature.");
      return;
    }
    if (locationStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Location access is required.');
      return;
    }

    const contactsCollection = collection(db, 'users', userId, 'emergencyContacts');
    const contactsSnapshot = await getDocs(contactsCollection);
    const phoneNumbers = contactsSnapshot.docs.map(doc => doc.data().phoneNumber);

    if (phoneNumbers.length === 0) {
      Alert.alert('No Contacts', 'Please add emergency contacts in Settings.');
      return;
    }

    Alert.alert("Fetching Location", "Getting your current location...");
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`; // Corrected Google Maps URL

    let sosMessage = "EMERGENCY! I need help. My current location is: [location]";
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists() && docSnap.data().sosMessage) {
      sosMessage = docSnap.data().sosMessage;
    }
    
    const finalMessage = sosMessage.replace('[location]', mapsUrl);
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync(phoneNumbers, finalMessage);
    } else {
      Alert.alert('SMS Not Available', 'Your device cannot send SMS messages.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* SOS Button and Status Display are unchanged */}
        <SOSButton onPress={handleSOS} />
        <StatusDisplay
          locationStatus={locationStatus}
          onViewContacts={() => router.push('/emergency-contacts')}
        />

        {/* Render the grid of tiles below */}
        <View style={styles.tilesContainer}>
          <Tile
            icon="share-social"
            title="Live Location"
            onPress={() => router.push('/live-location')}
            iconColor="#1E88E5"
          />
          {/* --- ADD THIS NEW TILE --- */}
          <Tile
            icon="chatbubbles"
            title="Instant Help"
            onPress={() => router.push('/chatbot')}
            iconColor="#009688" // A nice teal color for help
          />
          {/* ----------------------- */}
          <Tile
            icon="camera"
            title="Live Camera"
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development.')}
            iconColor="#4CAF50"
          />
          <Tile
            icon="mic"
            title="Record Incident"
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development.')}
            iconColor="#FFC107"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5', // Light purple background
  },
  tilesContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 5,
    marginTop: 20,
  },
});