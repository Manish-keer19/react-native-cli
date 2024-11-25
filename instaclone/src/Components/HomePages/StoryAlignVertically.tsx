
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import React from "react";

export default function Story() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}  // Vertical scroll now
        contentContainerStyle={styles.scrollViewContent} // Use content container to limit items height
      >
        {/* Repeat stories */}
        {[...Array(6)].map((_, index) => (
          <View
            key={index}
            style={styles.storyContainer}
          >
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{
                  uri: "https://res.cloudinary.com/manish19/image/upload/v1726506341/ftedkmcuqzwy97jwjdqu.jpg",
                }}
              />
            </View>
            <Text style={styles.text}>Manish keer</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Set height to allow vertical scrolling
    flex: 1,
    width: "100%",
  },
  scrollViewContent: {
    flexDirection: 'column', // Ensure vertical layout
    alignItems: 'center', // Center items horizontally
  },
  storyContainer: {
    width: 120, // Fixed width for each story
    height: 150, // Set height for each story
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15, // Add space between stories
  },
  imageContainer: {
    borderWidth: 2,
    borderRadius: 50,
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "yellow",
  },
  image: {
    width: "90%",
    height: "90%",
    borderRadius: 50,
  },
  text: {
    color: "white",
    marginTop: 5,
    fontWeight: "bold",
  },
});

