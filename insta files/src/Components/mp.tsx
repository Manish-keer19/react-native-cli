// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Image,
//   Alert,
//   FlatList,
// } from "react-native";
// import React from "react";
// import { useState, useEffect } from "react";
// import * as MediaLibrary from "expo-media-library";
// import { Ionicons, Entypo } from "@expo/vector-icons";

// export default function AddPost() {
//   const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
//   const [recentMedia, setRecentMedia] = useState<MediaLibrary.Asset[]>([]);
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//       if (status === "granted") {
//         fetchRecentMedia();
//         // fetchFolders();
//       } else {
//         Alert.alert(
//           "Permission needed",
//           "We need access to your media to proceed."
//         );
//       }
//     })();
//   }, []);

//   const fetchRecentMedia = async () => {
//     const media = await MediaLibrary.getAssetsAsync({
//       mediaType: ["photo", "video"], // Fetch both images and videos
//       first: 20, // Fetch recent 20 media items
//       sortBy: [["creationTime", false]], // Sort by newest items
//     });
//     setRecentMedia(media.assets);
//     setSelectedMedia(media.assets[0]?.uri); // Set the first image as default selected
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header Section */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.iconButton}>
//           <Ionicons name="close" size={28} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>New Post</Text>
//         <TouchableOpacity style={styles.iconButton}>
//           <Ionicons name="arrow-forward" size={28} color="#3897f0" />
//         </TouchableOpacity>
//       </View>

//       {/* Image Preview Section */}
//       <View style={styles.imagePreviewContainer}>
//         {selectedMedia ? (
//           <Image source={{ uri: selectedMedia }} style={styles.imagePreview} />
//         ) : (
//           <Text style={styles.imageText}>
//             Select an image or video from your gallery
//           </Text>
//         )}
//       </View>
//       <View
//         style={{
//           width: "100%",
//           height: "60%",
//           // borderWidth: 2,
//           // borderColor: "blue",
//         }}
//       >
//         <TouchableOpacity
//           style={{ flexDirection: "row", alignItems: "center" }}
//         >
//           <Text style={styles.sectionTitle}>Recent Media</Text>
//           <Entypo name="chevron-small-down" size={25} color={"white"} />
//         </TouchableOpacity>
//         <FlatList
//           data={recentMedia}
//           keyExtractor={(item) => item.id}
//           numColumns={4}
//           renderItem={({ item }) => (
//             <TouchableOpacity onPress={() => setSelectedMedia(item.uri)}>
//               <Image source={{ uri: item.uri }} style={styles.galleryItem} />
//             </TouchableOpacity>
//           )}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   iconButton: {
//     padding: 5,
//   },
//   imagePreviewContainer: {
//     height: "40%",
//     justifyContent: "center",
//     alignItems: "center",
//     marginVertical: 15,
//     borderRadius: 20,
//     overflow: "hidden",
//     backgroundColor: "#212121",
//   },
//   imagePreview: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//   },
//   imageText: {
//     color: "#fff",
//     textAlign: "center",
//   },
//   sectionTitle: {
//     color: "#fff",
//     fontSize: 16,
//     marginVertical: 10,
//     marginLeft: 10,
//   },
//   galleryItem: {
//     width: "25%",
//     height: 100,
//     aspectRatio: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     margin: 4,
//     borderRadius: 1,
//   },
// });

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
import {
  Ionicons,
  Entypo,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";

export default function AddPost() {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [recentMedia, setRecentMedia] = useState<MediaLibrary.Asset[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [folders, setFolders] = useState<
    { id: string; title: string; firstImage: string | null }[]
  >([]);
  const [isaurdataclicke, setIsaurdataclicke] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
      if (status === "granted") {
        fetchRecentMedia();
      } else {
        Alert.alert(
          "Permission needed",
          "We need access to your media to proceed."
        );
      }
    })();
  }, []);

  const fetchRecentMedia = async () => {
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: ["photo", "video"],
      first: 100,
      sortBy: [["creationTime", false]],
    });
    setRecentMedia(media.assets);
    setSelectedMedia(media.assets[0]?.uri);
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

      {/* Image Preview Section */}
      <View style={styles.imagePreviewContainer}>
        {selectedMedia ? (
          <Image source={{ uri: selectedMedia }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imageText}>
            Select an image or video from your gallery
          </Text>
        )}
      </View>

      {/* Recent Media Section */}
      <View style={styles.mediaContainer}>
        <TouchableOpacity style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Media</Text>
          <Entypo name="chevron-small-down" size={25} color={"white"} />
        </TouchableOpacity>
        <FlatList
          data={recentMedia}
          keyExtractor={(item) => item.id}
          numColumns={4}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedMedia(item.uri)}>
              <Image source={{ uri: item.uri }} style={styles.galleryItem} />
            </TouchableOpacity>
          )}
        />
      </View>

      <View
        style={{
          width: "99%",
          height: "99%",
          backgroundColor: "#292929",
          position: "absolute",
          zIndex: 2,
          top: 100,
          left: 2,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            width: 60,
            height: 4,
            backgroundColor: "#f7f7f7",
            marginBottom: 20,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        ></View>

        <View style={{ flexDirection: "row", gap: 70, padding: 20 }}>
          <TouchableOpacity>
            <Text style={{ color: "white", fontSize: 20 }}>Cancle</Text>
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
            Select album
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            height: 60,
            marginTop: 20,
            // borderWidth: 2,
            // borderColor: "red",
            alignItems: "center",
            paddingLeft: 30,
            flexDirection: "row",
            gap: 10,
          }}
        >
          <View
            style={{
              alignItems: "center",
              width: 60,
              gap: 8,
              // borderWidth: 2,
              // borderColor: "gold",
            }}
          >
            <FontAwesome5 name="photo-video" size={25} color="white" />
            <Text style={{ color: "white" }}>Recent</Text>
          </View>
          <View
            style={{
              alignItems: "center",
              width: 60,
              gap: 8,
              // borderWidth: 2,
              // borderColor: "gold",
            }}
          >
            <MaterialIcons name="photo" size={25} color="white" />
            <Text style={{ color: "white" }}>photos</Text>
          </View>
          <View
            style={{
              alignItems: "center",
              width: 60,
              gap: 8,
              // borderWidth: 2,
              // borderColor: "gold",
            }}
          >
            <FontAwesome5 name="photo-video" size={25} color="white" />
            <Text style={{ color: "white" }}>Videos</Text>
          </View>
        </View>
        <View>
          <Text style={{ color: "white", marginLeft: 20 }}>Albums</Text>
          <TouchableOpacity>
            <Text
              style={{
                color: "white",
                marginLeft: 20,
                
              }}
            >
              See all
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            data={folders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <Image source={{ uri: item.firstImage }} style={styles.galleryItem} />
              </TouchableOpacity>
            )}
          />  
        </View>
        <Text>another album</Text>
        <View>
          <FlatList
            data={folders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <Image source={{ uri: item.firstImage }} style={styles.galleryItem} />
              </TouchableOpacity>
            )}
          />  
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#0d0d0d",
    paddingTop: 20,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  iconButton: {
    padding: 5,
  },
  imagePreviewContainer: {
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#212121",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageText: {
    color: "#fff",
    textAlign: "center",
  },
  mediaContainer: {
    width: "100%",
    height: "60%",
    padding: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    marginRight: 5,
    fontWeight: "600",
  },
  galleryItem: {
    width: "25%",
    height: 90,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
    borderRadius: 10,
    borderColor: "#444",
    borderWidth: 1,
  },
});
