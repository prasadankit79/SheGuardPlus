import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { Pressable, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export default function RootLayoutNav() {
  const { user, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;
    if (!user) {
      router.replace('/login');
    }
  }, [user, initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: '#1E88E5' }, // Sky Blue Nav Bar
        headerTintColor: '#fff',
        drawerActiveTintColor: '#1976D2',
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Home',
          title: 'SheGuard+',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          headerRight: () => (
            <Pressable onPress={() => router.push('/settings')} style={{ marginRight: 15 }}>
              <Ionicons name="settings-outline" size={24} color="white" />
            </Pressable>
          ),
        }}
      />
      <Drawer.Screen
        name="chatbot"
        options={{ drawerLabel: 'Instant Help', title: 'Instant Help (Chatbot)', drawerIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" size={size} color={color} /> }}
      />
      <Drawer.Screen
        name="live-location"
        options={{ drawerLabel: 'Live Location', title: 'Live Location Sharing', drawerItemStyle: { height: 0 } }}
      />
       <Drawer.Screen
        name="emergency-contacts"
        options={{ title: 'Emergency Contacts', drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="login"
        options={{ headerShown: false, drawerItemStyle: { height: 0 } }}
      />
    </Drawer>
  );
}