import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import Footer from '../Footer';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../Entryroute';
import {NavigationProp} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearProfileData,
  useLoadProfileData,
} from '../../features/Profile/ProfileSlice';
import {images} from '../../Utils/imagedata';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {UserServiceInstance} from '../../services/Userservice';
import {logout, setUser, useLoadUserData} from '../../features/user/userSlice';
import Loader from '../Loader';
import Login from '../../auth/Login';
import Video from 'react-native-video';

export default function Profile() {
  useLoadProfileData();
  useLoadUserData();

  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  let {user, token} = useSelector((state: any) => state.User);

  // console.log("User in profile", user);

  // const profileData = useSelector((state: any) => state.Profile.profileData);

  const [activeTab, setActiveTab] = useState('Posts');
  const [issetting, setIssetting] = useState(false);

  const fetchUserData = async () => {
    const data = {email: user.email, token};
    try {
      const res = await UserServiceInstance.getUserData(data);
      if (res?.userdata) {
        dispatch(setUser(res.userdata));
      }
    } catch (error) {
      console.log('Could not get the user data', error);
    }
  };

  // useEffect(() => {
  //   if (!user) fetchUserData();
  // }, [user]);

  const renderPost = ({item}: any) => (
    <TouchableOpacity
      style={styles.postWrapper}
      onPress={() => handlePostPress(item)}>
      {item.mediaType === 'image' ? (
        <Image source={{uri: item.image}} style={styles.postImage} />
      ) : (
        <Video
          resizeMode="cover"
          poster={item.image}
          source={{uri: item.image}}
          style={styles.postVideo}
          paused
        />
      )}
    </TouchableOpacity>
  );
  const handlePostPress = (post: any) => {
    const updatedPosts = user.posts.filter((item: any) => item._id !== post._id);
    updatedPosts.unshift(post); // Move the clicked post to the front
   let updatedUser = { ...user, posts: updatedPosts }
   navigation.navigate('Post', { user: updatedUser });
  };
  

  if (!user) {
    return (
      <ActivityIndicator
        size="large"
        color="white"
        style={{backgroundColor: '#212121'}}
      />
    );
  }

  const handleLogout = () => {
    setIssetting(false);
    dispatch(logout());
    clearProfileData();
    setIssetting(false);
    navigation.navigate('Login');
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.profileUsername}>{user?.username}</Text>
          <EntypoIcons name="chevron-small-down" color={'white'} size={28} />
        </View>
        <TouchableOpacity onPress={() => setIssetting(!issetting)}>
          <Icons
            name="hamburger"
            size={28}
            color={'white'}
            style={{marginRight: 10}}
          />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileInfo}>
        {user?.userStories ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('AllStories', {user: user})}
            style={{
              borderWidth: 2,
              borderColor: 'yellow',
              borderRadius: 50,
              padding: 5,
            }}>
            <Image
              style={styles.profileImage}
              source={{uri: user?.profilePic}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Image
              style={styles.profileImage}
              source={{uri: user?.profilePic}}
            />
          </TouchableOpacity>
        )}
        <View style={styles.statsWrapper}>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>{user.posts?.length}</Text>
            <Text style={styles.statsLabel}>Posts</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>{user.followers?.length}</Text>
            <Text style={styles.statsLabel}>Followers</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>{user.following?.length}</Text>
            <Text style={styles.statsLabel}>Following</Text>
          </View>
        </View>
      </View>

      {/* Bio Section */}
      <View style={styles.bioContainer}>
        {user.profile && (
          <>
            {user.profile.username && (
              <Text style={styles.bio}>{user?.profile?.username}</Text>
            )}
            {user.profile.name && (
              <Text style={styles.bio}>{user?.profile?.name}</Text>
            )}
            {/* {user.profile.username && (
              <Text style={styles.bio}>{user?.profile?.username}</Text>
            )} */}
            {user.profile.bio && (
              <Text style={styles.bio}>{user?.profile?.bio}</Text>
            )}
          </>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.archiveButton}>
          <Ionicons name="archive-outline" size={18} color="white" />
          <Text style={styles.buttonText}>Go to Archive</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('Posts')}
          style={activeTab === 'Posts' ? styles.activeTab : styles.tab}>
          <Ionicons name="grid-outline" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('Reels')}
          style={activeTab === 'Reels' ? styles.activeTab : styles.tab}>
          <Ionicons name="play-circle-outline" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('Tagged')}
          style={activeTab === 'Tagged' ? styles.activeTab : styles.tab}>
          <Ionicons name="person-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Posts/Reels/Tagged Grid */}
      <FlatList
        data={user.posts}
        renderItem={renderPost}
        keyExtractor={item => item?._id}
        numColumns={3}
        style={styles.postsContainer}
        contentContainerStyle={{paddingBottom: 60}} // Ensure there’s space for the footer
      />

      {/* Settings Modal */}
      {issetting && (
        <View style={styles.settingsModal}>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setIssetting(false);
              navigation.navigate('Signup');
            }}>
            <Text style={styles.modalButtonText}>Signup</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setIssetting(false);
              navigation.navigate('Login');
            }}>
            <Text style={styles.modalButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
            <Text style={styles.modalButtonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setIssetting(false);
              navigation.navigate('ChangePassword');
            }}>
            <Text style={styles.modalButtonText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer Component */}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileUsername: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 14,
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  statsWrapper: {
    flexDirection: 'row',
  },
  statsContainer: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  statsLabel: {
    fontSize: 14,
    color: 'gray',
  },
  bioContainer: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  bio: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  editProfileButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    paddingVertical: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  archiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 5,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tab: {
    alignItems: 'center',
    padding: 10,
  },
  activeTab: {
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  postsContainer: {
    minHeight: 200,
  },
  postWrapper: {
    width: '33.33%', // Each post takes one-third of the width
    padding: 1,
    // borderWidth: 2,
    // borderColor: "blue",
  },
  postImage: {
    width: '100%',
    height: 120, // Fixed height for posts
  },
  postVideo: {
    width: '100%',
    height: 120,
  },
  settingsModal: {
    position: 'absolute',
    top: 75,
    right: 10,
    zIndex: 1000,
    borderRadius: 8,
    backgroundColor: 'black',
  },
  modalButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
  },
});
