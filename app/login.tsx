import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useRouter } from 'expo-router';
import CurvedButton from '../components/CurvedButton';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleAuth = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please enter both your email and password.');
      return;
    }

    if (isLogin) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          router.replace('/(tabs)');
        })
        .catch(error => {
          Alert.alert('Login Error', 'The email or password you entered is incorrect. Please try again.');
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          router.replace('/(tabs)');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            Alert.alert('Sign Up Error', 'An account with this email address already exists.');
          } else {
            Alert.alert('Sign Up Error', 'Could not create an account. Please try again.');
          }
        });
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="shield-checkmark" size={80} color="#1E88E5" style={{ marginBottom: 20 }} />
      <Text style={styles.title}>
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </Text>
      <Text style={styles.subtitle}>
        {isLogin ? 'Log in to your SheGuard+ account' : 'Get started with your safety net'}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <CurvedButton
          title={isLogin ? 'Login' : 'Create Account'}
          onPress={handleAuth}
          color="#1E88E5"
        />
      </View>

      <Pressable onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.toggleText}>
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
        </Text>
      </Pressable>
    </View> // <-- THIS IS THE FIX (was </Viw>)
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F3E5F5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  toggleText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '600',
  },
});;