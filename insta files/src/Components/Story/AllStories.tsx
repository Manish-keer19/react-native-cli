import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Pressable,
  Modal,
} from 'react-native';
import {useSelector} from 'react-redux';
import {StoryServiceInstance} from '../../services/storyServices';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import StoryEditModal from '../Modal/StoryEditModal';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../Entryroute';
import Video from 'react-native-video';

// const STORY_DURATION = 5000; // 10 seconds

export default function AllStories({route}: any) {
  let {user, token} = useSelector((state: any) => state.User);
  const currentUser = user;
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | any>();
  const progress = useRef(new Animated.Value(0)).current;
  // const timerRef = useRef<NodeJS.Timeout | null>(null);
  // const [stories, setStories] = useState<any>(null);
  const [stories, setStories] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [storyEditModal, setStoryEditModal] = useState(false);
  // const [mutedVideo, setMutedVideo] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const anotherUser = route.params && route.params.user;

  if (anotherUser) {
    user = anotherUser;
  }

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await StoryServiceInstance.getStories(user._id);
      if (res) {
        console.log('Res is ', res);
        setStories(res.story);
        setCurrentStoryIndex(0);
      }
    } catch (error) {
      console.log('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  // const story = {
  //   story: {
  //     _id: "671ce3d547c38efe28d4c5b0",
  //     user: "67132fb18cb9126630acbb2a",
  //     stories: [
  //       {
  //         content:
  //           "https://res.cloudinary.com/manish19/image/upload/v1729946581/stories/enis7ybthzw95x90fn3f.jpg",
  //         mediaType: "image",
  //         createdAt: "2024-10-26T12:43:01.781Z",
  //         publicId: "stories/enis7ybthzw95x90fn3f",
  //         _id: "671ce3d547c38efe28d4c5b1",
  //       },
  //       {
  //         content:
  //           "https://res.cloudinary.com/manish19/image/upload/v1729946654/stories/zayootnqqx43fm1v1l9g.jpg",
  //         mediaType: "image",
  //         createdAt: "2024-10-26T12:44:15.521Z",
  //         publicId: "stories/zayootnqqx43fm1v1l9g",
  //         _id: "671ce41f47c38efe28d4c5ba",
  //       },
  //       {
  //         content:
  //           "https://res.cloudinary.com/manish19/image/upload/v1730362893/stories/klvry9fveihbu8kxnkdr.jpg",
  //         mediaType: "image",
  //         createdAt: "2024-10-31T08:21:35.577Z",
  //         publicId: "stories/klvry9fveihbu8kxnkdr",
  //         _id: "67233e0f5c2aa9504e50d9d6",
  //       },
  //       {
  //         content:
  //           "https://res.cloudinary.com/manish19/image/upload/v1730362974/stories/srgoeu8rprudhh2jwonj.png",
  //         mediaType: "image",
  //         createdAt: "2024-10-31T08:22:56.329Z",
  //         publicId: "stories/srgoeu8rprudhh2jwonj",
  //         _id: "67233e605c2aa9504e50d9e0",
  //       },
  //     ],
  //     __v: 0,
  //   },
  // };
  useEffect(() => {
    fetchStories();
    // setStories(story.story);
    // setLoading(false);
  }, [user._id]);

  const handleNextStory = async () => {
    if (currentStoryIndex + 1 < stories?.stories.length) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      setCurrentStoryIndex(0); // loop back to the first story
    }

    // // Check if the user has watched the current story
    // if (
    //   !stories?.stories[currentStoryIndex].watchedBy.some(
    //     (user: any) => user._id === currentUser._id
    //   )
    // ) {

    //   if (user._id !== currentUser._id) {
    //     // await handleStoryWatched();
    //   } else {
    //     // console.log("how can i view own story");
    //   }
    //   // console.log("currenuserID is ", currentUser._id);
    //   // console.log("sotry data is ", stories?.stories[currentStoryIndex]);
    //   // console.log("You have not watched this story");
    // } else {
    //   console.log("You have already watched this story");
    // }
  };

  const handlePrevStory = async () => {
    if (currentStoryIndex - 1 >= 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else {
      setCurrentStoryIndex(stories?.stories.length - 1); // go to the last story
    }

    // Check if the user has watched the current story
    // if (
    //   !stories?.stories[currentStoryIndex].watchedBy.some(
    //     (user: any) => user._id === currentUser._id
    //   )
    // ) {
    //   if (user._id !== currentUser._id) {
    //     console.log("how can i view own story");
    //     await handleStoryWatched();
    //   } else {
    //     console.log("how can i view own story");
    //   }
    //   console.log("currenuserID is ", currentUser._id);
    //   console.log("sotry data is ", stories?.stories[currentStoryIndex]);
    //   // await handleStoryWatched(); // Mark the story as watched if not watched already
    //   console.log("You have not watched this story");
    // } else {
    //   console.log("You have already watched this story");
    // }
  };

  const calculateTimeAgo = (createdAt: string) => {
    const now = new Date();
    const storyDate = new Date(createdAt);
    const differenceInSeconds = Math.floor(
      (now.getTime() - storyDate.getTime()) / 1000,
    );

    if (differenceInSeconds < 60) return `${differenceInSeconds}s ago`;
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    if (differenceInMinutes < 60) return `${differenceInMinutes}m ago`;
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    if (differenceInHours < 24) return `${differenceInHours}h ago`;
    const differenceInDays = Math.floor(differenceInHours / 24);
    return `${differenceInDays}d ago`;
  };

  const handleStoryEdit = (item: any) => {
    console.log('story item is ', item);
    setStoryEditModal(true);
  };


  const handleStoryWatched = async (currentStoryIndex: number) => {
    console.log('currentStoryIndex is ', currentStoryIndex);
    try {
      // Check if the user has already watched the current story
      const alreadyWatched = stories?.stories[
        currentStoryIndex
      ]?.watchedBy.some(
        (watchedUser: any) => watchedUser._id === currentUser._id,
      );
      // console.log("alreadyWatched is ", alreadyWatched);

      if (alreadyWatched) {
        // console.log("bhai tu story dekh chuka h");
      }
      // Only proceed if the user hasn't watched the story yet
      else if (!alreadyWatched && user._id !== currentUser._id) {
        console.log('bhai tu story dekh sakta he h');
        const data = {
          token: token,
          userId: user._id,
          storyId: stories?.stories[currentStoryIndex]._id,
          storyDocId: stories._id,
        };

        try {
          const res = await StoryServiceInstance.addUserToStory(data);
          if (res.success) {
            console.log('you watched the story of ', user.username);
          } else {
            console.log(res.message);
          }
        } catch (error) {
          console.log('Error watching story:', error);
        }
      } else {
        console.log('bhai tu teri he story kese dekh sakta he h');
      }
    } catch (error) {
      console.error('Error watching story:', error);
    }
  };

  useEffect(() => {
    if (stories && stories?.stories && currentStoryIndex >= 0) {
      console.log('curentStoryIndex has changed');
      handleStoryWatched(currentStoryIndex);
    }
  }, [currentStoryIndex, stories]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.loadingText}>
          Please wait, stories are loading...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {stories?.stories.map((_: any, index: any) => (
          <View key={index} style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                index === currentStoryIndex
                  ? {flex: progress}
                  : index < currentStoryIndex
                  ? {flex: 1}
                  : {flex: 0},
              ]}
            />
          </View>
        ))}
      </View>

      <View style={styles.header}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {
            navigation.navigate('UserProfile', {
              userId: user._id,
            });
          }}>
          <View style={styles.userInfo}>
            <Image source={{uri: user?.profilePic}} style={styles.profilePic} />
            <View style={styles.addIcon}>
              <AntDesign name="plus" size={12} color="white" />
            </View>
          </View>
          <Text style={styles.username}>{user.username}</Text>
        </TouchableOpacity>
        <Text style={styles.timeAgo}>
          {calculateTimeAgo(stories?.stories[currentStoryIndex].createdAt)}
        </Text>
      </View>

      <View style={styles.storyImageContainer}>
        <TouchableOpacity
          style={styles.leftTouchableArea}
          onPress={handlePrevStory}
          activeOpacity={0.9}
        />
        {stories?.stories[currentStoryIndex].mediaType === 'image' ? (
          <Image
            style={styles.storyImage}
            source={{uri: stories?.stories[currentStoryIndex].content}}
          />
        ) : (
          <Video
            repeat
            style={styles.storyVideo}
            source={{uri: stories?.stories[currentStoryIndex].content}}
          />
        )}
        <TouchableOpacity
          style={styles.rightTouchableArea}
          onPress={handleNextStory}
          activeOpacity={0.9}
        />
      </View>

      {currentUser?._id === user?._id && (
        <Pressable
          style={{
            width: '100%',
            height: 70,
            // backgroundColor: "#494949",
            backgroundColor: 'black',
            position: 'absolute',
            bottom: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() =>
              handleStoryEdit(stories?.stories[currentStoryIndex])
            }>
            <Image
              source={{uri: user?.profilePic}}
              style={{width: 35, height: 35, borderRadius: 50, margin: 10}}
            />
            <Text style={{color: 'white', fontSize: 15, fontWeight: 'bold'}}>
              {user?.username}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
              marginRight: 15,
            }}>
            <FontAwesome name="facebook" size={24} color="white" />
            <AntDesign name="star" size={24} color="white" />
            <MaterialIcons name="send" size={24} color="white" />
            <MaterialIcons name="more" size={24} color="white" />
          </View>
        </Pressable>
      )}

      <Modal
        visible={storyEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setStoryEditModal(false)}>
        <StoryEditModal
          storydata={{
            storyDocId: stories._id,
            story: stories?.stories[currentStoryIndex],
          }}
          closeModal={() => setStoryEditModal(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1e1e1e',
    paddingTop:10,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    height: 2,
    zIndex: 1,
    // borderWidth:2,
    // borderColor:"blue"
  },
  progressBarBackground: {
    flex: 1,
    backgroundColor: 'gray',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  progressBarFill: {
    height: 1.25,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop:5,
    //  borderWidth:2,
    // borderColor:"blue"
  },
  userInfo: {
    position: 'relative',
    // borderWidth:2,
    // borderColor:"blue"
    width:30,
    height:30,
  },
  profilePic: {
   width:"100%",
   height:"100%",
    borderRadius: 50,
    //  borderWidth:2,
    // borderColor:"blue"
  },
  addIcon: {
    backgroundColor: 'blue',
    borderRadius: 50,
    width: 10,
    height: 10,
    position: 'absolute',
    bottom: 4,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    color: 'white',
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  timeAgo: {
    color: 'gray',
    marginLeft: 10,
    fontSize: 15,
  },
  storyImageContainer: {
    width: '100%',
    height: '85%',
    marginTop: 20,
    // alignItems: "center",
    justifyContent: 'center',
    flexDirection: 'row',

  },
  leftTouchableArea: {
    flex: 1,
    height: '100%',
    paddingLeft: 100,
    position: 'absolute',
    left: 0,
    zIndex: 10,
  },
  storyImage: {
    height: '100%',
    width: '95%',
    borderRadius: 10,
  },
  storyVideo: {
    height: '100%',
    width: '95%',
    borderRadius: 20,
  },
  rightTouchableArea: {
    flex: 1,
    height: '100%',
    paddingRight: 100,
    position: 'absolute',
    zIndex: 10,
    right: 0,
  },
});
