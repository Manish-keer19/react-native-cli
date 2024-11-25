import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
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
import CommentSection from './CommentSection';
import Octicons from 'react-native-vector-icons/Octicons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../Entryroute';
import {Postmodal} from '../Modal/Post.modal';
import Video from 'react-native-video';

export default function Posts({route}: any) {
  useLoadUserData();

  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [commentModal, setCommentModal] = useState<boolean>(false);
  const [post, setpost] = useState<[]>([]);
  const [posts, setposts] = useState<[]>([]);
  const [postlike, setpostlike] = useState<any | []>([]);
  const [PostModal, setPostModal] = useState<boolean>(false);
  const [PostData, setPostData] = useState<object>({});
  const anotheruser = route.params && route.params.user;
  let {user, token} = useSelector((state: any) => state.User);
  const [isVideoPlay, setIsVideoPlay] = useState<boolean>(false);
  const [playVideoIndex, setPlayVideoIndex] = useState<number>();

  const userId = user?._id;

  if (anotheruser) {
    user = anotheruser;
  }

  useEffect(() => {
    if (user && user.posts) {
      setposts(user.posts);

      let likes = user?.posts?.map((item: any) => {
        return item.likes.includes(userId);
      });
      setpostlike(likes);
      console.log('likes in posts', likes);
    }
  }, [user]); // Only run when 'user' changes

  const handleCreateLike = async (postId: any, i: any) => {
    setpostlike((prev: any) => {
      const newlike = [...prev];
      newlike[i] = true;
      return newlike;
    });

    // console.log("postlike is inside handleCreateLike ", postlike);

    console.log('create like pressed');
    console.log('post id is ', postId);
    const data = {postId, token};
    try {
      const res = await UserServiceInstance.createLike(data);
      console.log('res is ', res);
      if (res) {
        console.log('user liked successfully');
        dispatch(setUser(res.userdata));
      } else {
        setpostlike((prev: any) => {
          const newlike = [...prev];
          newlike[i] = false;
          return newlike;
        });
      }
    } catch (error) {
      setpostlike((prev: any) => {
        const newlike = [...prev];
        newlike[i] = false;
        return newlike;
      });
      console.log('could not create the like', error);
    }
  };

  const handleDeleteLike = async (postId: any, i: any) => {
    setpostlike((prev: any) => {
      const newlike = [...prev];
      newlike[i] = false;
      return newlike;
    });
    console.log('delete like pressed');
    console.log('post id is ', postId);
    const data = {
      postId,
      token,
    };
    try {
      const res = await UserServiceInstance.deleteLike(data);
      console.log('res is ', res);
      if (res) {
        dispatch(setUser(res.userdata));
      } else {
        setpostlike((prev: any) => {
          const newlike = [...prev];
          newlike[i] = true;
          return newlike;
        });
      }
    } catch (error) {
      setpostlike((prev: any) => {
        const newlike = [...prev];
        newlike[i] = true;
        return newlike;
      });
      console.log('could not delete the like', error);
    }
  };

  const handleshowCommentModal = (item: any) => {
    console.log('item is ', item);
    setpost(item);
    setCommentModal(true);
  };

  const handlePostModal = () => {
    setPostModal(true);
  };
  const handleplayVideo = (i: any) => {
    console.log('index is ', i);
    setPlayVideoIndex(i);
    setIsVideoPlay(true);
  };

  return (
    <View>
      <ScrollView
        style={styles.container}
        showsHorizontalScrollIndicator={false}>
        {/* Post Container */}
        {posts.map((item: any, i: number) => (
          <View style={styles.postContainer} key={i}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <Pressable
                style={styles.profileInfo}
                onPress={() => navigation.navigate('Post', {user: user})}>
                <TouchableOpacity
                  style={{
                    borderWidth: item.user?.userStories ? 2 : 0,
                    borderColor: 'gold',
                    borderRadius: item.user?.userStories ? 50 : 0,
                    padding: item.user?.userStories ? 2 : 0,
                  }}
                  onPress={() => {
                    if (item.user.userStories.length > 0) {
                      navigation.navigate('AllStories', {user: user});
                    } else {
                      setCommentModal(false);
                      navigation.navigate('UserProfile', {
                        userId: item?.user?._id,
                      });
                    }
                  }}>
                  <Image
                    source={{uri: user?.profilePic}}
                    style={styles.avatar}
                  />
                </TouchableOpacity>
                <View style={styles.userDetails}>
                  <Text style={styles.username}>{user?.username}</Text>
                  <Text style={styles.location}>{item?.location}</Text>
                </View>
              </Pressable>
              <TouchableOpacity
                style={{
                  // backgroundColor: "red",
                  padding: 10,
                  borderRadius: 10,
                }}
                onPress={() => {
                  setPostData({post: item, userID: userId});
                  setPostModal(true);
                }}>
                <Icons name="dots-three-vertical" color={'white'} size={20} />
              </TouchableOpacity>
            </View>

            {/* Post Image */}
            <View style={styles.postImageWrapper}>
              {item.mediaType === 'image' ? (
                <Image source={{uri: item.image}} style={styles.postImage} />
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

            {/* Like, Comment, Share, Save Section */}
            <View style={styles.actionIcons}>
              <View style={styles.leftIcons}>
                {postlike[i] ? (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 7,
                    }}
                    onPress={() => {
                      handleDeleteLike(item._id, i);
                    }}>
                    <FontAwesomeIcon name="heart" color={'red'} size={28} />
                    <Text style={{color: 'white'}}>{item?.likes?.length}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      handleCreateLike(item._id, i);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 7,
                    }}>
                    <FontAwesomeIcon name="heart-o" color={'white'} size={28} />
                    <Text style={{color: 'white'}}>{item?.likes?.length}</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => {
                    handleshowCommentModal(item);
                  }}
                  style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                  <Octicons name="comment" color={'white'} size={28} />
                  <Text style={{color: 'white'}}>{item?.comment?.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <FeatherIcon name="send" color={'white'} size={28} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <FeatherIcon name="bookmark" color={'white'} size={28} />
              </TouchableOpacity>
            </View>

            {/* Post Info */}
            <View style={styles.postInfo}>
              <Text style={styles.likesText}>{item?.likes?.length} likes</Text>
              <Text style={styles.postDescription}>
                <Text style={styles.username}>{user?.username} </Text>
                {item.caption}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <Footer />

      <Modal
        visible={commentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCommentModal(false)}>
        <CommentSection
          commentModal={commentModal}
          Posts={post} // This should be the specific post to comment on
          setCommentModal={setCommentModal}
        />
      </Modal>

      <Modal
        visible={PostModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPostModal(false)}>
        <Postmodal PostData={PostData} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    backgroundColor: 'black',
    paddingTop: 50,
  },
  postContainer: {
    minHeight: 200,
    marginBottom: 20,
    // borderColor: "#333",
    // borderWidth: 1,
    margin: 5,
    // padding: 5,
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
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,

    // marginRight: 10,
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
