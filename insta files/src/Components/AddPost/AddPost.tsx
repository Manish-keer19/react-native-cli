import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../Entryroute';
import {PermissionsAndroid, Platform} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Video from 'react-native-video';

interface Folder {
  id: string;
  title: string;
  firstImage: string | null;
}

export default function AddPost() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [file, setFile] = useState<any>(null); // Update type to `any`
  const [selectedMedia, setSelectedMedia] = useState<string>();
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [recentMedia, setRecentMedia] = useState<any[]>([]); // Update type to `any[]`
  const [hasPermission, setHasPermission] = useState<boolean>();
  const [folders, setFolders] = useState<Folder[]>([]); // Update type to `Folder[]`
  const [isAlbumVisible, setIsAlbumVisible] = useState(false);
  console.log('selected media is ', selectedMedia);
  console.log('media type is ', mediaType);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Access Storage Permission',
          message:
            'This app needs access to your storage to display images and videos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    (async () => {
      const hasPermission = await requestPermissions();
      setHasPermission(hasPermission);
      if (hasPermission) {
        fetchRecentMedia();
        fetchFolders();
      }
    })();
  }, []);

  const fetchMediaFromFolder = async (folderId: string) => {
    const media = await CameraRoll.getPhotos({
      first: 50,
      assetType: 'All',
      groupName: folderId,
    });
    console.log('media is ', media);

    setRecentMedia(
      media.edges.map(edge => ({
        uri: edge.node.image?.uri, // Ensure we are accessing the correct URI for both images and videos
        mediaType: edge.node.type,
      })),
    );

    const selectedItem = media.edges[0]?.node;

    if (selectedItem) {
      if (selectedItem.type?.startsWith('video')) {
        // For videos, get the URI from node.image.uri
        setSelectedMedia(selectedItem?.image?.uri); // Using image.uri for video
        setMediaType('video');
      } else {
        // For images, get the URI from node.image.uri
        setSelectedMedia(selectedItem?.image?.uri);
        setMediaType('image');
      }
    }
  };

  const fetchFolders = async () => {
    try {
      const albums = await CameraRoll.getAlbums({
        assetType: 'All',
      });
      console.log('albums is ', albums);

      const folderWithImages = await Promise.all(
        albums.map(async album => {
          const albumMedia = await CameraRoll.getPhotos({
            first: 1,
            assetType: 'All',
            groupName: album.title,
          });

          console.log('albumMedia is ', albumMedia);
          return {
            id: Date.now().toString(), // Use a unique identifier
            title: album.title,
            firstImage: albumMedia.edges[0]?.node.image.uri || null,
          };
        }),
      );

      // Filter out empty albums
      const nonEmptyFolders = folderWithImages.filter(
        folder => folder.firstImage,
      );
      setFolders(nonEmptyFolders);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  // Fetch recent media from the device
  const fetchRecentMedia = async () => {
    const media = await CameraRoll.getPhotos({
      first: 50, // Fetch first 50 files
      assetType: 'All', // Fetch both images and videos
    });

    setRecentMedia(
      media.edges.map(edge => ({
        uri: edge.node.image?.uri, // Ensure we are accessing the correct URI for both images and videos
        mediaType: edge.node.type,
      })),
    );
  };

  // Handle the create post button click
  const handlePostCreate = () => {
    if (!file) {
      console.log('No file selected');
      return; // Prevent navigation if file is not selected
    }
    console.log('file is ', file);
    navigation.navigate('CreatePost', {file1: file});
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons
            name="close"
            size={28}
            color="white"
            onPress={() => navigation.navigate('Home')}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>New Post</Text>
        <TouchableOpacity style={styles.iconButton} onPress={handlePostCreate}>
          <Ionicons name="arrow-forward" size={28} color="#3897f0" />
        </TouchableOpacity>
      </View>

      {/* Media Preview Section */}
      <View style={styles.mediaPreviewContainer}>
        {selectedMedia && mediaType ? (
          mediaType === 'video' ? (
            <Video
              source={{uri: selectedMedia}}
              style={styles.mediaPreview}
              controls={true}
              repeat
            />
          ) : (
            <>
              <Image
                source={{uri: selectedMedia}}
                style={styles.mediaPreview}
              />
            </>
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
          onPress={() => setIsAlbumVisible(!isAlbumVisible)}>
          <Text style={styles.sectionTitle}>Recent Media</Text>
          <Entypo name="chevron-small-down" size={25} color={'white'} />
        </TouchableOpacity>
        <FlatList
          data={recentMedia}
          keyExtractor={item => item.uri || String(item.id)}
          numColumns={4}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                console.log('item is ', item);
                setFile(item);
                setSelectedMedia(item.uri);
                setMediaType(
                  item.mediaType.startsWith('video') ? 'video' : 'image',
                );
              }}>
              <Image source={{uri: item.uri}} style={styles.galleryItem} />
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
              onPress={async () => {
                setIsAlbumVisible(false);
                fetchRecentMedia();
              }}>
              <FontAwesome5 name="photo-video" size={25} color="white" />
              <Text style={styles.optionText}>Recent</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setIsAlbumVisible(false);
                fetchRecentMedia();
              }}>
              <MaterialIcons name="photo" size={25} color="white" />
              <Text style={styles.optionText}>Photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setIsAlbumVisible(false);
                fetchRecentMedia();
              }}>
              <FontAwesome5 name="photo-video" size={25} color="white" />
              <Text style={styles.optionText}>Videos</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            numColumns={4}
            data={folders}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{width: '25%'}}
                onPress={() => {
                  fetchMediaFromFolder(item.title);
                  setIsAlbumVisible(false);
                }}>
                <Image
                  source={{uri: item.firstImage}}
                  style={styles.galleryItem}
                />
                <Text>{item.title}</Text>
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
    backgroundColor: '#0d0d0d',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    padding:5,
    
    // borderWidth: 2,
    // borderColor: 'white',
  },
  headerText: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconButton: {
    padding: 5,
  },
  mediaPreviewContainer: {
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121',
    borderRadius: 15,
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  placeholderText: {
    color: '#fff',
    textAlign: 'center',
  },
  mediaContainer: {
    height: '60%',
    padding: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  galleryItem: {
    width: 90,
    height: 90,
    margin: 5,
    borderRadius: 5,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#292929',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  albumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
  },
  selectAlbumText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  albumOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  option: {
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    marginTop: 5,
  },
});
