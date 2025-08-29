// File: app/live-location.tsx
import React, { useState, useEffect } from 'react';
// Add Platform to this import line from react-native
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, Platform } from 'react-native'; 
import * as Location from 'expo-location';

// The rest of the file is the same, but ensure it starts with "export default"
export default function LiveLocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [subscription, setSubscription] = useState<Location.LocationSubscription | null>(null);

  const startTracking = async () => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Foreground location access is required to start sharing.');
      return;
    }

    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Background location access is required for continuous sharing.');
      return;
    }

    setIsTracking(true);

    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (newLocation) => {
        setLocation(newLocation);
      }
    );
    setSubscription(sub);
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
    setLocation(null);
  };

  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [subscription]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Location Sharing</Text>
      <View style={styles.buttonContainer}>
        {!isTracking ? (
          <Button title="Start Sharing" onPress={startTracking} color="#4CAF50" />
        ) : (
          <Button title="Stop Sharing" onPress={stopTracking} color="#EF5350" />
        )}
      </View>

      {isTracking && (
        <View style={styles.locationContainer}>
          {location ? (
            <>
              <Text style={styles.label}>Current Location:</Text>
              <Text style={styles.coords}>Latitude: {location.coords.latitude.toFixed(6)}</Text>
              <Text style={styles.coords}>Longitude: {location.coords.longitude.toFixed(6)}</Text>
              <Text style={styles.coords}>Speed: {(location.coords.speed! * 3.6).toFixed(2)} km/h</Text>
            </>
          ) : (
            <View>
              <ActivityIndicator size="large" color="#8E44AD" />
              <Text style={styles.waitingText}>Waiting for first location update...</Text>
            </View>
          )}
        </View>
      )}

      <Text style={styles.disclaimer}>
        In a real app, your location would be securely sent to your emergency contacts while sharing is active.
      </Text>
    </View>
  );
}

// Styles are unchanged
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  buttonContainer: { width: '80%', marginBottom: 30 },
  locationContainer: { padding: 20, borderRadius: 10, backgroundColor: '#f0f0f0', alignItems: 'center', width: '100%'},
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  coords: { fontSize: 16, marginBottom: 5, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
  waitingText: { marginTop: 10, color: 'gray' },
  disclaimer: { position: 'absolute', bottom: 20, textAlign: 'center', color: 'gray', paddingHorizontal: 30 },
});