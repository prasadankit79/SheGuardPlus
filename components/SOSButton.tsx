import React, { useEffect, useRef } from 'react'; // Import useRef
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native'; // Import Animated and Easing

interface SOSButtonProps {
  onPress: () => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({ onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current; // Initial value for scale

  useEffect(() => {
    // This function defines one pulse cycle
    const pulse = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1, // Scale up to 110%
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, // Scale back down to original size
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => pulse()); // Loop the animation indefinitely
    };

    pulse(); // Start the animation when the component mounts
  }, [scaleAnim]);

  return (
    <View style={styles.sosContainer}>
      <TouchableOpacity onPress={onPress} style={styles.sosButtonOuter}>
        <View style={styles.sosButtonMiddle}>
          <Animated.View // Use Animated.View for the inner button
            style={[
              styles.sosButtonInner,
              {
                transform: [{ scale: scaleAnim }], // Apply the animated scale
              },
            ]}
          >
            <Text style={styles.sosText}>SOS</Text>
            <Text style={styles.sosSubText}>"Bachao!"</Text>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sosContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  sosButtonOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(236, 64, 122, 0.2)', // Lighter pink
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButtonMiddle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(236, 64, 122, 0.4)', // Medium pink
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButtonInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#EC407A', // Vibrant pink
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  sosText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  sosSubText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SOSButton;