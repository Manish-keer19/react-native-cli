import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Footer from '../Footer';
import Icons from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import {UserServiceInstance} from '../../services/Userservice';
import {setUser, useLoadUserData} from '../../features/user/userSlice';
import CommentSection from '../Post/CommentSection';
import Octicons from 'react-native-vector-icons/Octicons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../Entryroute';
import {Postmodal} from '../Modal/Post.modal';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Posts() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const [commentModal, setCommentModal] = useState(false);
  const [post, setPost] = useState<[]>([]);
  const {user, token} = useSelector((state: any) => state.User);

  // console.log("user is ", user?._id);
  // console.log("token is ", token);
  const userId = user?._id;

  const [posts, setPosts] = useState<any[]>([]);
  const [postLikeStatus, setPostLikeStatus] = useState<boolean[]>([]);
  const [postData, setPostData] = useState<object>({});
  const [postModal, setPostModal] = useState(false);
  const [users, setUsers] = useState<[]>([]);
  const [isVideoPlay, setIsVideoPlay] = useState<boolean>(false);
  const [playVideoIndex, setPlayVideoIndex] = useState<number>();

  const handleLikeToggle = async (postId: any, i: number, isLiked: boolean) => {
    setPostLikeStatus(prev => {
      const newStatus = [...prev];
      newStatus[i] = !isLiked;
      return newStatus;
    });

    const data = {postId, token};
    try {
      const res = isLiked
        ? await UserServiceInstance.deleteLike(data)
        : await UserServiceInstance.createLike(data);

      if (res) {
        dispatch(setUser(res.userdata));
      } else {
        setPostLikeStatus(prev => {
          const newStatus = [...prev];
          newStatus[i] = isLiked; // Revert the like status on failure
          return newStatus;
        });
      }
    } catch (error) {
      // console.error("Error toggling like:", error);
      setPostLikeStatus(prev => {
        const newStatus = [...prev];
        newStatus[i] = isLiked; // Revert the like status on error
        return newStatus;
      });
    }
  };

  const handleshowCommentModal = (item: any) => {
    setPost(item);
    setCommentModal(true);
  };

  const fetchUserFeed = async () => {
    const data = {token};
    try {
      const res = await UserServiceInstance.fetchUserFeed(data);
      if (res) {
        const allPosts = setAllPosts(res.userFeed);
        console.log('All Posts:', allPosts); // Log all posts
        setPosts(allPosts);
      }
    } catch (error) {
      console.error('Could not fetch user feed:', error);
    }
  };

  const setAllPosts = (users: any) => {
    const data = users.flatMap((user: any) =>
      user.posts.map((post: any) => ({
        ...post,
        user: user,
      })),
    );

    const likes = data.map((item: any) => item.likes.includes(userId));
    setPostLikeStatus(likes);
    return data;
  };

  useEffect(() => {
    fetchUserFeed();
    console.log('posts is ', posts);
  }, [user, token, posts.length]);

  const handleplayVideo = (i: any) => {
    console.log('index is ', i);
    setPlayVideoIndex(i);
    setIsVideoPlay(true);
  };
  return (
    <>
      {!user || !token || posts.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black',
            width: '100%',
            minHeight: 400,
            position: 'relative',
            zIndex: 999,
          }}>
          <View style={{alignItems: 'center', gap: 10}}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
              Welcome {user?.username} 👋 in manish's instagram
            </Text>
            <Text style={{color: 'white', fontSize: 16, fontWeight: 'heavy'}}>
              Please follow some users
            </Text>
          </View>
        </View>
      ) : (
        <View style={{position: 'relative'}}>
          <ScrollView
            style={styles.container}
            showsHorizontalScrollIndicator={false}>
            {posts.map((item: any, i: number) => (
              <View style={styles.postContainer} key={i}>
                <View style={styles.postHeader}>
                  <Pressable
                    style={styles.profileInfo}
                    onPress={() =>
                      navigation.navigate('UserProfile', {userId: item?.user})
                    }>
                    {item?.user?.userStories ? (
                      <TouchableOpacity
                        style={{
                          borderWidth: 2,
                          borderColor: 'yellow',
                          borderRadius: 50,
                          padding: 3,
                        }}
                        onPress={() =>
                          navigation.navigate('AllStories', {
                            user: item.user,
                          })
                        }>
                        <Image
                          source={{uri: item?.user?.profilePic}}
                          style={styles.avatar}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity>
                        <Image
                          source={{uri: item?.user?.profilePic}}
                          style={styles.avatar}
                        />
                      </TouchableOpacity>
                    )}

                    <View style={styles.userDetails}>
                      <Text style={styles.username}>
                        {item?.user?.username}
                      </Text>
                      <Text style={styles.location}>{item?.location}</Text>
                    </View>
                  </Pressable>
                  <TouchableOpacity
                    style={{padding: 10, borderRadius: 10}}
                    onPress={() => {
                      setPostData({post: item, userID: user._id});
                      setPostModal(true);
                    }}>
                    <Icons
                      name="dots-three-vertical"
                      color={'white'}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.postImageWrapper}>
                  {item.mediaType === 'image' ? (
                    <Image
                      source={{uri: item.image}}
                      style={styles.postImage}
                    />
                  ) : isVideoPlay && i === playVideoIndex ? (
                    <Video
                      source={{uri: item.image}}
                      style={styles.postImage}
                      // controls
                      paused={!(i === playVideoIndex)}
                      resizeMode="contain"
                      repeat
                      controls
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleplayVideo(i)}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#212121',
                        padding: 15,
                        borderRadius: 20,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: 15,
                        }}>
                        Click to play video
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.actionIcons}>
                  <View style={styles.leftIcons}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 7,
                      }}
                      onPress={() =>
                        handleLikeToggle(item._id, i, postLikeStatus[i])
                      }>
                      <FontAwesomeIcon
                        name={postLikeStatus[i] ? 'heart' : 'heart-o'}
                        color={postLikeStatus[i] ? 'red' : 'white'}
                        size={28}
                      />
                      <Text style={{color: 'white'}}>
                        {item?.likes?.length}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleshowCommentModal(item)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 7,
                      }}>
                      <Octicons name="comment" color={'white'} size={28} />
                      <Text style={{color: 'white'}}>
                        {item?.comment?.length}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <FeatherIcon name="send" color={'white'} size={28} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity>
                    <FeatherIcon name="bookmark" color={'white'} size={28} />
                  </TouchableOpacity>
                </View>

                <View style={styles.postInfo}>
                  <Text style={styles.likesText}>
                    {item?.likes?.length} likes
                  </Text>
                  <Text style={styles.postDescription}>
                    <Text style={styles.username}>{item?.user?.username} </Text>
                    {item.caption}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <Modal
            visible={commentModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setCommentModal(false)}>
            <CommentSection
              commentModal={commentModal}
              Posts={post}
              setCommentModal={setCommentModal}
            />
          </Modal>

          <Modal
            visible={postModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setPostModal(false)}>
            <Postmodal PostData={postData} />
          </Modal>

          <Footer />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: '100%',
    backgroundColor: 'black',
  },
  postContainer: {
    minHeight: 200,
    marginBottom: 20,
    margin: 5,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: "yellow",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userDetails: {
    justifyContent: 'center',
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  location: {
    color: 'gray',
    fontSize: 12,
  },
  postImageWrapper: {
    width: '100%',
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  leftIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  postInfo: {
    padding: 10,
  },
  likesText: {
    color: 'white',
    fontWeight: 'bold',
  },
  postDescription: {
    color: 'white',
    marginTop: 5,
  },
});
