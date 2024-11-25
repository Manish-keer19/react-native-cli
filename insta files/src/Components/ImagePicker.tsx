import React, { useState } from "react";
import { Button, Image, View, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImagePicker1() {
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);

  // Function to pick an image
  const pickImage = async () => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("status is ", status);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Pick an image from the gallery
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use "Videos" for picking video, or "All" for both
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Use the URI of the selected image
    }
  };

  // Function to pick a video
  const pickVideo = async () => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Pick a video from the gallery
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos, // Specify Videos for video picking
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri); // Use the URI of the selected video
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Pick an image from gallery" onPress={pickImage} />
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, marginTop: 10 }}
        />
      )}

      <Button title="Pick a video from gallery" onPress={pickVideo} />
      {video && <Text style={{ marginTop: 10 }}>Video Selected: {video}</Text>}
    </View>
  );
}
