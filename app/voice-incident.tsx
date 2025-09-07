import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av'; // We are now correctly using the stable expo-av
import { useRouter } from 'expo-router';
import * as SMS from 'expo-sms';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../config/firebaseConfig';

export default function VoiceIncidentScreen() {
  const router = useRouter();
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [status, setStatus] = useState('Press the button to record your incident');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    (async () => {
      await Audio.requestPermissionsAsync();
    })();
  }, []);

  async function startRecording() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const { recording } = await Audio.Recording.createAsync(
         Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setRecordingUri(null);
      setStatus('Recording...');
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Could not start recording.');
    }
  }

  async function stopRecording() {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordingUri(uri);
    setRecording(null);
    setStatus('Recording complete. Press "Submit" to send it.');
  }

  async function submitIncident() {
    if (!recordingUri) {
      Alert.alert('No Recording', 'Please record your incident first.');
      return;
    }

    setIsUploading(true);
    setStatus('Submitting your recording...');

    try {
      const response = await fetch(recordingUri);
      const blob = await response.blob();
      const userId = auth.currentUser.uid;
      const userEmail = auth.currentUser.email;
      const storageRef = ref(storage, `incidents/${userId}/${Date.now()}.m4a`);
      await uploadBytes(storageRef, blob);
      const audioURL = await getDownloadURL(storageRef);

      const ownerPhoneNumber = '8658136967';
      const notificationMessage = `New voice incident reported by user (${userEmail}). Listen to the recording here: ${audioURL}`;

      const isSmsAvailable = await SMS.isAvailableAsync();
      if (isSmsAvailable) {
        await SMS.sendSMSAsync([ownerPhoneNumber], notificationMessage);
        Alert.alert(
          'Submission Successful',
          'Your voice incident has been securely submitted.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        throw new Error('SMS service is not available on this device.');
      }
    } catch (error) {
      console.error('Failed to submit incident:', error);
      Alert.alert('Submission Failed', 'There was an error. Please try again.');
    } finally {
      setIsUploading(false);
      setStatus('Press the button to record your incident');
    }
  }

  return (
    <View style={styles.container}>
      <Ionicons name="shield-checkmark-outline" size={80} color="#4A0C6B" />
      <Text style={styles.header}>Report a Voice Incident</Text>
      <Text style={styles.statusText}>{status}</Text>

      <Pressable
        style={[styles.recordButton, isRecording ? styles.recordingButton : {}]}
        onPress={isRecording ? stopRecording : startRecording}
        disabled={isUploading || !!recordingUri}
      >
        <Ionicons name={isRecording ? "stop-circle" : "mic-circle"} size={100} color="#fff" />
      </Pressable>

      {recordingUri && !isUploading && (
        <View style={styles.buttonContainer}>
           <Pressable style={styles.secondaryButton} onPress={() => setRecordingUri(null)}>
                 <Text style={styles.secondaryButtonText}>Record Again</Text>
            </Pressable>
            <Pressable
                style={styles.submitButton}
                onPress={submitIncident}
            >
                <Text style={styles.submitButtonText}>Submit Incident</Text>
            </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A0C6B',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  statusText: {
    fontSize: 16,
    color: '#6A1B9A',
    marginBottom: 40,
    textAlign: 'center',
  },
  recordButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#8E44AD',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
  },
  recordingButton: {
    backgroundColor: '#E74C3C',
  },
  buttonContainer: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#27AE60',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 10,
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#8E44AD',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});