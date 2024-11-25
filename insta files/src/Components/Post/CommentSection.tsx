import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  BackHandler,
  Pressable,
  Button,
  TouchableHighlight,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import { CommentServiceInstance } from "../../services/CommentServices";
import { setUser } from "../../features/user/userSlice";

import {
  NavigationProp,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";
import { RootStackParamList } from "../../../Entryroute";

// Define types for User, Comment, and Props
type User = {
  name: string;
  profilePic: string;
};

type SubComment = {
  id: number;
  text: string;
  user: User;
};

type Comment = {
  id: number;
  text: string;
  user: User;
  subComments: SubComment[];
};

interface CommentSectionProps {
  commentModal: boolean;
  setCommentModal: (value: boolean) => void;
  Posts: any;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  Posts,
  commentModal,
  setCommentModal,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const token = useSelector((state: any) => state.User.token);
  const dispatch = useDispatch();
  // console.log("comment is in comment section ", comment);
  const [commentText, setCommentText] = useState<string>("");
  const [subCommentText, setSubCommentText] = useState<string>("");
  const [comments, setComments] = useState<any[]>();
  const [CommentEditModal, setCommentEditModal] = useState(false);
  console.log("comments in comment section ", comments);
  const [showSharebtn, setShowSharebtn] = useState<boolean>(false);
  const [commentId, setCommentId] = useState<string>("");
  const user = useSelector((state: any) => state.User.user);

  console.log("user in comment section ", user);

  console.log("post in comment section ", Posts);
  console.log("comment is in comment section ", comments);

  useEffect(() => {
    setComments(Posts?.comment);
  }, [Posts]);

  // useEffect(() => {
  //   const backAction = () => {
  //     setCommentModal(false); // Close the modal
  //     setCommentText("");
  //     setShowSharebtn(false);
  //     return true; // Prevent default back button behavior
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );

  //   return () => backHandler.remove(); // Cleanup event listener
  // }, [setCommentModal]);

  const handleCloseModal = () => {
    setCommentEditModal(false);
  };

  const handleCreateComment = async (postId: any) => {
    // console.log("postId is handleCreateComment", postId);
    // console.log("comment is ", commentText);

    if (commentText == "") {
      return Alert.alert("Comment cannot be empty");
    }

    const newcomment = {
      user: {
        username: user.username,
        profilePic: user.profilePic,
      },
      comment: commentText,
      _id: Date.now(),
    };
    // update the ui with the new comment
    setComments((prevcomment: any) => [...prevcomment, newcomment]);
    const data = { postId, comment: commentText, token };
    console.log("data in handleCreateComment", data);

    try {
      setCommentText("");
      const res = await CommentServiceInstance.creatComment(data);
      console.log("res is ", res);
      if (res) {
        console.log("Comment created succesfuul in comment section");
        dispatch(setUser(res.userdata));
      } else {
        console.log("now we are deleting  the dumy comment");
        setComments((prevComments: any) =>
          prevComments.filter(
            (comment: any) => comment.comment !== newcomment.comment
          )
        );
      }
    } catch (error) {
      console.log("could not create the comment");
      setComments((prevComments: any) =>
        prevComments.filter(
          (comment: any) => comment.comment !== newcomment.comment
        )
      );
    }
  };

  const handelDeleteComment = async () => {
    // console.log("comment id is ",commentId);
    const commentToDelete = comments?.find(
      (comment: any) => comment._id === commentId
    );
    console.log("commentToDelete is ", commentToDelete);
    if (!commentToDelete) {
      return Alert.alert("Comment not found");
    }

    setComments((prevComments: any) =>
      prevComments.filter((comment: any) => comment._id !== commentId)
    );
    const data = { commentId, token };
    try {
      const res = await CommentServiceInstance.deleteComment(data);
      console.log("res is ", res);
      if (res) {
        console.log("Comment deleted succesfuul in comment section");
        // dispatch(setUser(res.userdata));
      } else {
        setComments((prevComments: any) => [...prevComments, commentToDelete]);
      }
    } catch (error) {
      console.log("could not delete the comment");
      setComments((prevComments: any) => [...prevComments, commentToDelete]);
    }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.indicator}></View>

      <Text style={styles.title}>Comments</Text>

      <FlatList
        // style={{borderWidth:2,borderColor:"blue"}}
        // showsVerticalScrollIndicator={false}
        data={comments}
        keyExtractor={(item) => item?._id?.toString()}
        renderItem={({ item }: any) => (
          <Pressable
            onLongPress={() => {
              console.log("item.id is ", item?._id);
              setCommentId(item?._id);
              setCommentEditModal(true);
            }}
            delayLongPress={300}
            onPress={() => {
              setCommentEditModal(false);
            }}
            // style={{ borderWidth: 2, borderColor: "gold" }}
          >
            <View style={styles.commentContainer}>
              <TouchableOpacity
                style={{
                  borderWidth: item.user.userStories?.length > 0 ? 2 : 0,
                  borderColor: "yellow",
                  borderRadius: item.user.userStories?.length > 0 ? 50 : 0,
                  padding: item.user.userStories?.length > 0 ? 3 : 0,
                }}
                onPress={() => {
                  if (item?.user?.userStories?.length > 0) {
                    setCommentModal(false);
                    navigation.navigate("AllStories", { user: item?.user });
                  } else {
                    setCommentModal(false);
                    setCommentModal(false);
                    navigation.navigate("UserProfile", {
                      userId: item?.user?._id,
                    });
                  }
                }}
              >
                <Image
                  style={styles.profilePic}
                  source={{ uri: item?.user?.profilePic }}
                />
              </TouchableOpacity>

              <View style={styles.commentTextContainer}>
                <Text style={styles.username}>{item?.user?.username}</Text>
                <Text style={styles.commentText}>{item?.comment}</Text>
                <View>
                  <TouchableOpacity style={{}}>
                    <Text style={{ color: "#3897f0" }}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Ionicons name="heart-outline" size={20} color="white" />
            </View>
            {CommentEditModal && item._id === commentId && (
              <View
                style={{
                  width: 170,
                  // height: 120,
                  minHeight: 70,
                  // backgroundColor: "#303030",
                  borderRadius: 10,
                  gap: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  // marginTop:10 ,
                }}
              >
                {item.user._id === user._id ? (
                  <>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#363636",
                        width: "90%",
                        borderRadius: 10,
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 3,
                        justifyContent: "center",
                      }}
                    >
                      <AntDesign name="edit" size={20} color="white" />

                      <Text
                        style={{
                          color: "white",
                          padding: 10,
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "darkred",
                        width: "90%",
                        borderRadius: 10,
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 3,
                        justifyContent: "center",
                      }}
                      onPress={handelDeleteComment}
                    >
                      <AntDesign name="delete" size={20} color="white" />
                      <Text
                        style={{
                          color: "white",
                          padding: 10,
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "darkblue",
                      width: "90%",
                      borderRadius: 10,
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 3,
                      justifyContent: "center",
                    }}
                  >
                    {/* <AntDesign name="like2" size={20} color="white" /> */}
                    {/* <AntDesign name="heart" size={20} color="white" /> */}
                    <AntDesign name="hearto" size={20} color="white" />
                    <Text
                      style={{
                        color: "white",
                        padding: 10,
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      Like
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Pressable>
        )}
      />

      {/* <ScrollView>
        {comments?.map((item: any, i: any) => (
          <Pressable
            key={item._id}
            onLongPress={() => {
              console.log("item.id is ", item?._id);
              setCommentId(item?._id);
              setCommentEditModal(true);
            }}
            delayLongPress={300}
            onPress={() => {
              setCommentEditModal(false);
            }}
            // style={{ borderWidth: 2, borderColor: "gold" }}
          >
            <View style={styles.commentContainer}>
              <Image
                style={styles.profilePic}
                source={{ uri: item?.user?.profilePic }}
              />

              <View style={styles.commentTextContainer}>
                <Text style={styles.username}>{item?.user?.username}</Text>
                <Text style={styles.commentText}>{item?.comment}</Text>
                <View>
                  <TouchableOpacity style={{}}>
                    <Text style={{ color: "#3897f0" }}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Ionicons name="heart-outline" size={20} color="white" />
            </View>
            {CommentEditModal && item._id === commentId && (
              <View
                style={{
                  width: 160,
                  height: 100,
                  backgroundColor: "#303030",
                  borderRadius: 10,
                  gap: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "brown",
                    width: "90%",
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", padding: 10 }}>edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "darkred",
                    width: "90%",
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                  onPress={handelDeleteComment}
                >
                  <Text style={{ color: "white", padding: 10 }}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView> */}

      <View style={styles.inputContainer}>
        <Image style={styles.profilePic} source={{ uri: user?.profilePic }} />
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor="#888"
          value={commentText}
          onChangeText={(value) => {
            if (value == "") {
              setShowSharebtn(false);
            }
            setShowSharebtn(true);
            setCommentText(value);
          }}
        />
        {showSharebtn ? (
          <TouchableOpacity>
            <MaterialIcons
              name="send"
              size={32}
              color="#007AFF"
              style={styles.sendIcon}
              onPress={() => {
                handleCreateComment(Posts?._id);
              }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stickerIcon}>
            <Ionicons name="happy-outline" size={28} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: "100%",
    backgroundColor: "#212121",
    minHeight: "95%",
    position: "absolute",
    bottom: 0,
    // top: 10,
    alignSelf: "center",
    borderRadius: 10,
    padding: 15,
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: "pink",
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: 10,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
    gap: 15,
    // borderWidth:2,
    // borderColor:"blue"
  },

  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentTextContainer: {
    flex: 1,
    marginLeft: 10,
    gap: 8,
    // borderWidth:2,
    // borderColor:"blue"
  },
  username: {
    color: "#f9f9f9",
    fontSize: 14,
    fontWeight: "bold",
  },
  commentText: {
    color: "white",
    fontSize: 16,
  },
  replyButton: {
    marginTop: 5,
    backgroundColor: "#333",
    padding: 5,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  replyButtonText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  subCommentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 5,
    marginLeft: 50, // Indent sub-comments
  },
  subProfilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  subCommentTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  subCommentText: {
    color: "white",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  input: {
    flex: 1,
    backgroundColor: "#333",
    color: "white",
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  sendIcon: {
    marginLeft: 10,
    padding: 5,
    // borderWidth: 1,
    // borderColor: "blue",
  },
  stickerIcon: {
    marginLeft: 10,
  },
});

export default CommentSection;
