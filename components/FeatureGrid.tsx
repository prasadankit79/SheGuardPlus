// File: components/FeatureGrid.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Entypo, FontAwesome5, AntDesign, Ionicons } from '@expo/vector-icons';
import FeatureButton from './FeatureButton';

const FeatureGrid = () => {
  const router = useRouter();

  const features = [
    // Update the onPress handler for this feature
    { icon: <MaterialCommunityIcons name="share-variant" size={32} color="#8E44AD" />, text: 'Live Location Sharing', onPress: () => router.push('/live-location') },
    { icon: <Entypo name="camera" size={32} color="#8E44AD" />, text: 'Live Location & Camera', onPress: () => {} },
    { icon: <FontAwesome5 name="microphone" size={32} color="#8E44AD" />, text: 'Voice Message Incident', onPress: () => {} },
    { icon: <MaterialCommunityIcons name="comment-alert" size={32} color="#8E44AD" />, text: 'Body Shaming Harassment', onPress: () => {} },
    { icon: <AntDesign name="questioncircleo" size={32} color="#8E44AD" />, text: 'Common Problems', onPress: () => router.push('/common-problems') },
    { icon: <Ionicons name="chatbubbles-sharp" size={32} color="#8E44AD" />, text: '24x7 Instant Chat', onPress: () => {} },
  ];
  // ... rest of the component is the same
  return (
    <View style={styles.grid}>
      {features.map((feature, index) => (
        <FeatureButton key={index} icon={feature.icon} text={feature.text} onPress={feature.onPress} />
      ))}
    </View>
  );
};
// ... styles are the same
const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 10,
  },
});
export default FeatureGrid;