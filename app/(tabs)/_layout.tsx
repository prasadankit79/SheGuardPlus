import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8E44AD',
        headerShown: false, // Important: This hides the second header
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="common-problems"
        options={{
          title: 'FAQs',
          tabBarIcon: ({ color }) => <AntDesign name="questioncircle" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}