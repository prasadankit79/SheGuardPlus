import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { Pressable, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { DrawerContentScrollView } from '@react-navigation/drawer';

// --- THIS IS OUR NEW CUSTOM BUTTON COMPONENT ---
// We are no longer using DrawerItem
const CustomDrawerButton = ({ label, icon, onPress }) => (
  <Pressable style={styles.drawerButton} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#333" style={styles.drawerIcon} />
    <Text style={styles.drawerLabel}>{label}</Text>
  </Pressable>
);

// --- UPDATED CUSTOM DRAWER CONTENT ---
function CustomDrawerContent(props) {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const menuItems = [
    { label: 'Home', icon: 'home-outline', screen: '/(tabs)' },
    { label: 'Instant Help', icon: 'chatbubbles-outline', screen: '/chatbot' },
    { label: 'FAQs', icon: 'help-circle-outline', screen: '/common-problems' },
    { label: 'Explore', icon: 'compass-outline', screen: '/explore' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#8E44AD' }}>
        <View style={styles.profileContainer}>
          <Ionicons name="person-circle-outline" size={60} color="#fff" />
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <CustomDrawerButton
                label={item.label}
                icon={item.icon}
                onPress={() => router.push(item.screen)}
              />
              <View style={styles.separator} />
            </React.Fragment>
          ))}
        </View>
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <CustomDrawerButton
          label="Logout"
          icon="log-out-outline"
          onPress={() => {
            if (signOut) signOut();
            router.replace('/login');
          }}
        />
      </View>
    </View>
  );
}


export default function RootLayoutNav() {
  const { user, initializing } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (initializing) return;
    const inAuthGroup = segments[0] !== 'login';
    if (!user && inAuthGroup) {
      router.replace('/login');
    } else if (user && !inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, initializing, segments]);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8E44AD" />
      </View>
    );
  }

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#8E44AD' },
        headerTintColor: '#fff',
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'SheGuard+',
          headerRight: () => (
            <Pressable onPress={() => router.push('/settings')} style={{ marginRight: 15 }}>
              <Ionicons name="settings-outline" size={24} color="white" />
            </Pressable>
          ),
        }}
      />
      <Drawer.Screen name="common-problems" options={{ title: 'Common Problems' }} />
      <Drawer.Screen name="explore" options={{ title: 'Explore' }} />
      <Drawer.Screen name="chatbot" options={{ title: 'Instant Help (Chatbot)' }} />
      <Drawer.Screen name="live-location" options={{ title: 'Live Location' }} />
      <Drawer.Screen name="emergency-contacts" options={{ title: 'Emergency Contacts' }} />
      <Drawer.Screen name="login" options={{ headerShown: false }} />
      <Drawer.Screen name="settings" options={{ title: 'Settings' }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  profileEmail: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    fontWeight: '500',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  // --- NEW STYLES FOR OUR CUSTOM BUTTON ---
  drawerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  drawerIcon: {
    marginRight: 20, // This creates the space between icon and text
  },
  drawerLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
  },
  footer: {
    paddingBottom: 20, // Add some space at the very bottom
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
});