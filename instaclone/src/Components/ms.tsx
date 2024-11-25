
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as MediaLibrary from "expo-media-library";
import { Video } from "expo-av";
import {
  Ionicons,
  Entypo,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";

export default function AddPost() {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [recentMedia, setRecentMedia] = useState<MediaLibrary.Asset[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [folders, setFolders] = useState<
    { id: string; title: string; firstImage: string | null }[]
  >([]);
  const [isAlbumVisible, setIsAlbumVisible] = useState(false);
  

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
      if (status === "granted") {
        await fetchRecentMedia();
        await fetchFolders();
      } else {
        Alert.alert(
          "Permission needed",
          "We need access to your media to proceed."
        );
      }
    })();
  }, []);

  const fetchRecentMedia = async (firstImages: number = 60) => {
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: ["photo", "video"],
      first: firstImages,
      sortBy: [["creationTime", false]],
    });
    setRecentMedia(media.assets);
    setSelectedMedia(media.assets[0]?.uri);
    setMediaType(media.assets[0]?.mediaType === "video" ? "video" : "image");
  };

  const fetchFolders = async () => {
    const albums = await MediaLibrary.getAlbumsAsync();
    const folderWithImages = await Promise.all(
      albums.map(async (album) => {
        const albumMedia = await MediaLibrary.getAssetsAsync({
          album: album.id,
          mediaType: ["photo", "video"],
          first: 1,
        });
        return {
          id: album.id,
          title: album.title,
          firstImage: albumMedia.assets[0]?.uri || null,
        };
      })
    );
    setFolders(folderWithImages);
  };

  const fetchMediaFromFolder = async (folderId: string) => {
    const media = await MediaLibrary.getAssetsAsync({
      album: folderId,
      mediaType: ["photo", "video"],
      first: 50,
    });
    setRecentMedia(media.assets);
    setSelectedMedia(media.assets[0]?.uri);
    setMediaType(media.assets[0]?.mediaType === "video" ? "video" : "image");
  };

  const fetchAllVideos = async () => {
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: ["video"],
    });
    setRecentMedia(media.assets);
    setSelectedMedia(media.assets[0]?.uri);
    setMediaType("video");
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>New Post</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="arrow-forward" size={28} color="#3897f0" />
        </TouchableOpacity>
      </View>

      {/* Media Preview Section */}
      <View style={styles.mediaPreviewContainer}>
        {selectedMedia ? (
          mediaType === "video" ? (
            <Video
              source={{ uri: selectedMedia }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay
              isLooping
              style={styles.mediaPreview}
            />
          ) : (
            <Image
              source={{ uri: selectedMedia }}
              style={styles.mediaPreview}
            />
          )
        ) : (
          <Text style={styles.placeholderText}>
            Select an image or video from your gallery
          </Text>
        )}
      </View>

      {/* Recent Media Section */}
      <View style={styles.mediaContainer}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setIsAlbumVisible(!isAlbumVisible)}
        >
          <Text style={styles.sectionTitle}>Recent Media</Text>
          <Entypo name="chevron-small-down" size={25} color={"white"} />
        </TouchableOpacity>
        <FlatList
          data={recentMedia}
          keyExtractor={(item) => item.id}
          numColumns={4}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedMedia(item.uri);
                setMediaType(item.mediaType === "video" ? "video" : "image");
              }}
            >
              <Image source={{ uri: item.uri }} style={styles.galleryItem} />
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Album Modal */}
      {isAlbumVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.albumHeader}>
            <TouchableOpacity onPress={() => setIsAlbumVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.selectAlbumText}>Select Album</Text>
          </View>

          {/* Options for Recent, Photos, and Videos */}
          <View style={styles.albumOptions}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                fetchRecentMedia();
                setIsAlbumVisible(false);
              }}
            >
              <FontAwesome5 name="photo-video" size={25} color="white" />
              <Text style={styles.optionText}>Recent</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                fetchRecentMedia(1000);
                setIsAlbumVisible(false);
              }}
            >
              <MaterialIcons name="photo" size={25} color="white" />
              <Text style={styles.optionText}>Photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                fetchAllVideos();
                setIsAlbumVisible(false);
              }}
            >
              <FontAwesome5 name="photo-video" size={25} color="white" />
              <Text style={styles.optionText}>Videos</Text>
            </TouchableOpacity>
          </View>

          {/* Album List */}
          <FlatList
            numColumns={4}
            data={folders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ width: "25%" }}
                onPress={() => fetchMediaFromFolder(item.id)}
              >
                <Image
                  source={{ uri: item.firstImage }}
                  style={styles.galleryItem}
                />
                <Text style={styles.albumTitle}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#1a1a1a",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  iconButton: {
    padding: 5,
  },
  mediaPreviewContainer: {
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#212121",
    borderRadius: 15,
  },
  mediaPreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderText: {
    color: "#fff",
    textAlign: "center",
  },
  mediaContainer: {
    height: "60%",
    padding: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  galleryItem: {
    width: 90,
    height: 90,
    margin: 5,
    borderRadius: 5,
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#292929",
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  albumHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  cancelText: {
    color: "#fff",
    fontSize: 18,
  },
  selectAlbumText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  albumOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  optionText: {
    color: "#fff",
    marginLeft: 10,
  },
  albumTitle: {
    color: "#fff",
    textAlign: "center",
    marginTop: 5,
  },
});
