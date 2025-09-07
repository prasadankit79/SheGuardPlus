import React from 'react';
import { Tabs } from 'expo-router';

// We have removed the old icon imports as they are no longer needed.

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // This style correctly hides the bottom tab bar.
        tabBarStyle: { display: 'none' },
      }}
    >
      {/* This layout should ONLY define the screens that exist inside the (tabs) folder. */}
      <Tabs.Screen
        name="index" // This is your Home screen (app/(tabs)/index.tsx)
        options={{
          title: 'Home',
        }}
      />
      
      {/* The <Tabs.Screen> for "common-problems" and "explore" have been REMOVED from this file
        because their actual files are now in the main app/ folder.
      */}
    </Tabs>
  );
}