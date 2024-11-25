// Loader.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

const Loader = ({ task }: any) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  // Spin Animation for rotating loader
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000, // Rotation speed
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  // Pulsating Animation for the processing circle
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseValue]);

  // Interpolating spin value for rotation effect
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      {/* Pulsating animated circle for processing */}
      <Animated.View
        style={[styles.pulsingCircle, { transform: [{ scale: pulseValue }] }]}
      />

      {/* Rotating animated gradient circle */}
      <Animated.View
        style={[styles.gradientCircle, { transform: [{ rotate: spin }] }]}
      />

      {/* Actual Spinner */}
      <Animated.View
        style={[styles.spinner, { transform: [{ rotate: spin }] }]}
      >
        <ActivityIndicator size="large" color="#fff" />
      </Animated.View>

      <Text style={styles.loadingText}>Processing...</Text>
      <Text style={styles.taskText}>
        {task || "Please wait, processing your request."}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Black background
  },
  spinner: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.2)", // Light border color for contrast
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    fontSize: 22,
    color: "#fff", // White text for black background
    fontWeight: "600",
    marginBottom: 10,
    textTransform: "capitalize",
  },
  taskText: {
    fontSize: 15,
    color: "#b3b3b3", // Grayish text for secondary information
    textAlign: "center",
    paddingHorizontal: 20,
  },
  gradientCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -100,
    marginTop: -100,
    zIndex: -1, // Gradient behind spinner
    borderWidth: 10,
    borderColor: "transparent",
    borderTopColor: "#FF7F50", // Gradient colors for modern feel
    borderRightColor: "#FF4500",
    borderBottomColor: "#FF69B4",
    borderLeftColor: "#8A2BE2",
    opacity: 0.7,
  },
  pulsingCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -125,
    marginTop: -125,
    backgroundColor: "rgba(255, 69, 0, 0.3)", // Pulsing effect background
    zIndex: -2, // Pulsing behind everything
  },
});

export default Loader;
