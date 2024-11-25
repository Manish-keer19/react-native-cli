import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../Entryroute';
import {StoryServiceInstance} from '../../services/storyServices';
import {
  loadUserdata,
  setUser,
  useLoadUserData,
} from '../../features/user/userSlice';
import Video from 'react-native-video';
// import { ResizeMode, Video } from "expo-av";
export default function StoryEditModal({storydata, closeModal}: any) {
  const dispatch = useDispatch();
  const {token, user} = useSelector((state: any) => state.User);
  const [isdeleting, setIsdeleting] = useState(false);
  console.log('storydata', storydata);

  const handleDeleteStory = async () => {
    setIsdeleting(true);
    const data = {
      storyDocId: storydata.storyDocId,
      storyId: storydata.story._id,
      token: token,
    };
    console.log('data is ', data);
    try {
      const res = await StoryServiceInstance.deleteStory(data);
      console.log('res is in story edit modal', res);
      if (res) {
        setIsdeleting(false);
        console.log('Story deleted successfully');
        Alert.alert('story deleted successfully');
        dispatch(setUser(res.userdata));
        navigation.navigate('Home');
      }
    } catch (error) {
      setIsdeleting(false);
      console.log('could not delete the story', error);
    }
  };
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  console.log('storydata', storydata);
  const [storyInfo, setStoryInfo] = useState(storydata.story);
  return (
    <View style={{width: '100%', height: '100%'}}>
      <View
        style={{
          width: '100%',
          height: '40%',
          backgroundColor: '#212121',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Pressable
          style={{}}
          onPress={() => {
            closeModal();
          }}>
          {storyInfo?.mediaType === 'image' ? (
            <Image
              source={{uri: storyInfo.content}}
              style={{height: 250, width: 145}}
            />
          ) : (
            <Video
              paused
              resizeMode="cover"
              poster={storyInfo.content}
              style={{height: 250, width: 145}}
              source={{uri: storyInfo.content}}
            />
          )}
        </Pressable>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddStory')}
          style={{
            width: 90,
            height: 200,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
          }}>
          <MaterialIcons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View style={{width: '100%', height: '60%', backgroundColor: 'black'}}>
        <View
          style={{
            // borderWidth: 2,
            // borderColor: "blue",
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 10,
          }}>
          <View style={{flexDirection: 'row', gap: 10}}>
            <AntDesign name="eye" size={24} color="white" />
            <Text style={{color: 'white'}}>
              {storydata.story.watchedBy.length}
            </Text>
            {/* <Text style={{ color: "white" }}>{"10000000B"}</Text> */}
          </View>

          <TouchableOpacity onPress={handleDeleteStory} disabled={isdeleting}>
            {isdeleting ? (
              <View>
                <ActivityIndicator color="white" />
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  Please wait
                </Text>
              </View>
            ) : (
              <AntDesign name="delete" size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            padding: 15,
          }}>
          Veiwers
        </Text>
        <ScrollView
          style={{
            // borderWidth: 2,
            // borderColor: "pink",
            minHeight: 200,
          }}>
          {/* {[...Array(10)].map((_, i) => (
            <View
              key={i}
              style={{
                // borderWidth: 2,
                // borderColor: "orange",
                paddingHorizontal: 20,
                padding: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
              >
                <View>
                  <Image
                    source={{
                      uri: "https://res.cloudinary.com/manish19/image/upload/v1726506341/ftedkmcuqzwy97jwjdqu.jpg",
                    }}
                    style={{ height: 40, width: 40, borderRadius: 50 }}
                  />
                </View>
                <Text style={{ color: "white", fontSize: 16 }}>
                  {user?.username}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 20,
                  //   margin: 10,
                }}
              >
                <Entypo name="dots-three-vertical" size={24} color="white" />
                <FontAwesome name="share" size={24} color="white" />
              </View>
            </View>
          ))} */}

          {storydata.story.watchedBy.map((item: any, i: number) => (
            <View
              key={i}
              style={{
                // borderWidth: 2,
                // borderColor: "orange",
                paddingHorizontal: 20,
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 15,
                  cursor: 'pointer',
                }}>
                <TouchableOpacity
                  style={{
                    borderWidth: 2,
                    borderColor: 'gold',
                    borderRadius: 50,
                    padding: 2,
                  }}
                  onPress={() => {
                    closeModal();
                    navigation.navigate('AllStories', {user: item});
                  }}>
                  <Image
                    source={{
                      uri: item.profilePic,
                    }}
                    style={{height: 40, width: 40, borderRadius: 50}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    closeModal();
                    navigation.navigate('UserProfile', {userId: item._id});
                  }}>
                  <Text style={{color: 'white', fontSize: 16}}>
                    {item.username}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  //   margin: 10,
                }}>
                <Entypo name="dots-three-vertical" size={24} color="white" />
                <FontAwesome name="share" size={24} color="white" />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
