import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
// import { images } from "../../Utils/imagedata";
import {useSelector} from 'react-redux';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../Entryroute';
import {StoryServiceInstance} from '../../services/storyServices';

export default function Story() {
  const {user, token} = useSelector((state: any) => state.User);
  // console.log("user in story is", user);
  // console.log("user in story", user);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [allUserStories, setallUserStories] = useState([]);
  const [isStoryfetched, setisStoryfetched] = useState(false);

  // console.log("allUserStories", allUserStories);
  const getFollwerkiStorys = async () => {
    if (!token) {
      return;
    }
    const data = {
      token: token,
    };
    if (!data) {
      return;
    }

    try {
      const res = await StoryServiceInstance.getFolllowersStories(data);
      if (res.success) {
        // alert("bhai yaha aaya");
        const allUserStories = res?.stories
          .map((user: any) => user?.userStories) // Get each user's userStories array
          .flat(); // Flatten to create a single array of all user stories
        console.log('allUserStories', allUserStories);
        setallUserStories(allUserStories);
        setisStoryfetched(true);
      }
    } catch (error: any) {
      setisStoryfetched(false);
      console.log(
        'could not getFolllowersStories, some error occurred',
        error.response.data,
      );
      console.log('res is ', error.response.data);
    }
  };

  useEffect(() => {
    getFollwerkiStorys();
  }, [token, user]);
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent} // Use content container to limit items height
      >
        <TouchableOpacity
          style={styles.storyContainer}
          onPress={() => {
            user?.userStories?.length > 0
              ? navigation.navigate('AllStories')
              : navigation.navigate('AddStory');
            // :alert("add story first");
          }}>
          <View
            style={[
              user?.userStories?.length > 0
                ? styles.imageStoryContainer
                : styles.imageContainer,
            ]}>
            <Image
              style={styles.image}
              source={{
                uri: user?.profilePic,
              }}
            />
          </View>

          <Icon
            name="pluscircleo"
            size={30}
            color={'white'}
            style={{
              position: 'absolute',
              right: 14,
              top: 82,
              backgroundColor: 'blue',
              borderRadius: 50,
            }}
          />

          <Text style={styles.text}>{user?.username}</Text>
        </TouchableOpacity>
        {/* user's following stories  */}
        {allUserStories.map((item: any, itemIndex: any) => (
          <TouchableOpacity
            key={itemIndex}
            style={styles.storyContainer}
            onPress={() => {
              navigation.navigate('AllStories', {user: item.user});
            }}>
            <View style={styles.imageStoryContainer}>
              <Image
                style={styles.image}
                source={{
                  uri: item.user.profilePic,
                }}
              />
            </View>
            <Text style={styles.text}>{item.user.username}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Set max height to ScrollView to make it scrollable when content exceeds it
    maxHeight: 200, // Adjust this to your needs
    // borderWidth: 2,
    // borderColor: "pink",
    width: '100%',
    marginTop: 13,
  },
  scrollViewContent: {
    flexDirection: 'row', // Ensure horizontal layout
  },
  storyContainer: {
    // borderWidth: 2,
    // borderColor: "gold",
    width: 120, // Fixed width for each story
    height: 150, // Set height for each story
    alignItems: 'center',
    justifyContent: 'center',
    // marginRight: 10,
  },
  imageContainer: {
    // borderRadius: 50,
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: "pink",
  },
  imageStoryContainer: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'gold',
    borderRadius: 50,
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: 50,
  },
  text: {
    color: 'white',
    marginTop: 5,
    fontWeight: 'bold',
  },
});
