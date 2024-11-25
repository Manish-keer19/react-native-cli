import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useRef} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {StoryServiceInstance} from '../../services/storyServices';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../Entryroute';
import {Tuple} from '@reduxjs/toolkit';
import {setUser} from '../../features/user/userSlice';
import {Alert} from 'react-native';
import Video from 'react-native-video';

export default function CreateStory({route}: any) {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {user, token} = useSelector((state: any) => state.User);
  const {mediaData} = route.params;

  console.log('imagdata is ', mediaData);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [file, setFile] = useState(mediaData);
  const imageRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [newText, setNewText] = useState('');
  const [ispostSubmiting, setIspostSubmiting] = useState(false);
  const handleShare = async () => {
    setIspostSubmiting(true);
    let uri;
    let media;
    try {
      media = {
        uri: file.uri, // URI of the image
        type: file.mediaType || 'image/jpeg',
        name: Date.now().toString(), // Filename
      };

      console.log('media is ', media);
      const formData = new FormData();
      formData.append('media', {
        uri: media.uri,
        type: media.type,
        name: media.name,
      });
      formData.append('token', token);

      console.log('form data is ', formData);

      const res = await StoryServiceInstance.creatStory(formData);
      navigation.navigate('Home');
      if (res) {
        console.log('res in createstory', res);
        dispatch(setUser(res.userdata));
      } else {
        setIspostSubmiting(false);
        Alert.alert('could not creaet the post pleases try again');
      }
    } catch (error) {
      setIspostSubmiting(false);
      console.error('Error uploading image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AntDesign name="left" size={24} color="white" style={styles.icon} />
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="alphabetical-variant"
            size={24}
            color="white"
            style={styles.icon}
            onPress={() => setModalVisible(true)} // Open modal for adding text
          />
          <MaterialCommunityIcons
            name="sticker-emoji"
            size={24}
            color="white"
            style={{
              backgroundColor: '#393939',
              padding: 10,
              borderRadius: 50,
            }}
          />
          <MaterialCommunityIcons
            name="movie-filter"
            size={24}
            color="white"
            style={{
              backgroundColor: '#393939',
              padding: 10,
              borderRadius: 50,
            }}
          />
          <MaterialCommunityIcons
            name="music"
            size={24}
            color="white"
            style={{
              backgroundColor: '#393939',
              padding: 10,
              borderRadius: 50,
            }}
          />
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={24}
            color="white"
            style={{
              backgroundColor: '#393939',
              padding: 10,
              borderRadius: 50,
            }}
          />
        </View>
      </View>

      <Pressable style={styles.imageContainer}>
        {mediaData?.mediaType?.startsWith('image') ? (
          <Image
            style={styles.image}
            source={{
              uri: file?.uri,
            }}
          />
        ) : (
          <Video
            // repeat
            style={styles.video}
            source={{
              uri: file?.uri,
            }}
          />
        )}
      </Pressable>

      <View style={styles.footer}>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.storyButton}
            onPress={handleShare}
            disabled={ispostSubmiting}>
            <Image style={styles.storyImage} source={{uri: user?.profilePic}} />
            <Text style={styles.buttonText}>
              {ispostSubmiting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              gap: 7,
              alignItems: 'center',
              backgroundColor: '#212121',
              padding: 15,
              marginLeft: 10,
              borderRadius: 20,
              width: 170,
            }}>
            <AntDesign name="star" size={24} color="gold" />
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              Close friends
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 50,
              marginLeft: 5,
            }}>
            <AntDesign
              name="right"
              size={24}
              color="black"
              style={{fontWeight: 'bold'}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#030303',
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    paddingTop: 60,
    flexDirection: 'row',
    zIndex: 99,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  icon: {
    backgroundColor: '#393939',
    padding: 10,
    borderRadius: 50,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  video: {
    // borderWidth:2,
    // borderColor:"yellow",
    width: '100%',
    height: '70%',
  },
  zoomedImageContainer: {
    width: '100%',
    height: '100%',
  },
  zoomedImage: {
    width: '100%',
    height: '100%',
    zIndex: 999,
  },
  footer: {
    width: '100%',
    position: 'absolute',
    zIndex: 99,
    bottom: 0,
    padding: 10,
  },
  footerContainer: {
    width: '80%',
    flexDirection: 'row',
    zIndex: 99,
    alignItems: 'center',
  },
  storyButton: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: '#212121',
    padding: 15,
    borderRadius: 20,
    width: 170,
  },
  storyImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
