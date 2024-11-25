import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {io} from 'socket.io-client';
import {useDispatch, useSelector} from 'react-redux';
import {useLoadUserData} from '../../features/user/userSlice';
import {MessageServiceInstance} from '../../services/MessageService';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {BASE_URL} from '../../services/apiClient';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../Entryroute';
import sockeslice, {
  addUser,
  isUserOnline,
  removeUser,
} from '../../features/socket/onlineUsersSlice';

export default function UserChat({route}: any) {
  useLoadUserData();
  const currentUser = useSelector((state: any) => state.User.user);
  // console.log("currentUser in user chat", currentUser);

  const {user} = route.params || {};

  // console.log("user in user chat", user);
  // Reference to ScrollView

  const dispatch = useDispatch();
  const onlineUsers = useSelector(
    (state: any) => state.onlineUsers.onlineUsers,
  );

  const scrollViewRef = useRef<ScrollView>(null);
  const currentUserId = currentUser?._id;
  const anotherUserId = user?._id;
  const [messages, setMessages] = useState<any>();
  const [messageEditModal, setMessageEditModal] = useState(false);
  // console.log("messages in user chat", messages);
  const [message, setMessage] = useState('');
  const [selectedMessageID, setselectedMessageID] = useState<string>('');
  const [selectedMessageText, setSelectedMessageText] = useState<string>('');
  const [isEditable, setIsEditable] = useState<boolean>(false);
  console.log('online users in user chat', onlineUsers);

  const [isOnline, setIsOnline] = useState(
    useSelector((state: any) => isUserOnline(state, user._id)),
  );

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const inputRef = useRef<TextInput | null>(null);

  // Connect to socket server
  const socket = io(BASE_URL);
  const handleSendMessage = async () => {
    inputRef.current?.blur();
    if (isEditable) {
      // alert("editable true bro");

      console.log('anotaher user id is ', anotherUserId);
      console.log('current user id is ', currentUserId);
      const data = {
        currentUserId: currentUserId,
        anotherUserId: anotherUserId,
        messageId: selectedMessageID,
        message: message,
      };

      try {
        const res = await MessageServiceInstance.editMessage(data);
        console.log('res is', res);
        if (res) {
          // alert("message edited successfully");
          setMessages(res.messages.messages);
          setMessage('');
          setMessageEditModal(false);
          setIsEditable(false);
          scrollViewRef.current?.scrollToEnd({animated: true});
        } else {
          setMessage('');
          setIsEditable(false);
          setMessageEditModal(false);
        }
      } catch (error) {
        setMessage('');
        setMessageEditModal(false);
        console.log('could not edit the message', error);
      }
    } else {
      // if (messages.length > 0) {
      //   const messageData = {
      //     sender: {
      //       _id: currentUserId,
      //     },
      //     message: message,
      //   };

      //   setMessages((prev: any) => [...prev, messageData]);
      // }

      scrollViewRef.current?.scrollToEnd({animated: true});

      const messageObj = {
        currentUser: currentUserId,
        anotherUser: anotherUserId,
        sender: currentUser?._id,
        message: message,
      }; // Mark the message as sent by "me"
      socket.emit('sendMessage', messageObj); // Send message to server
      setMessage('');
    }
  };

  useEffect(() => {
    // socket.on('receiveMessage', (message: any) => {
    //   const messageData = {
    //     message: message,
    //     sender: {
    //       _id: currentUserId,
    //       profilePic: currentUser?.profilePic,
    //     },
    //     createdAt: Date.now(),
    //     _id: Date.now().toString(),
    //   };
    //   console.log('messageData in user chat recevemessage', messageData);
    //   setMessages((prev: any) => [...prev, messageData]);
    //   // Scroll to the end when a new message is received
    //   scrollViewRef.current?.scrollToEnd({animated: true});
    // });

    socket.on('receiveAllMessage', (messageData: any) => {
      console.log(
        'messageData in user chat  in receiveAllMessage',
        messageData,
      );
      setMessages(messageData.messages);
      // Scroll to the end when a new message is received
      scrollViewRef.current?.scrollToEnd({animated: true});
    });

    return () => {
      socket.off('receiveMessage'); // Clean up the listener on component unmount
      socket.off('receiveAllMessage');
    };
  }, []);

  const fetchMessages = async () => {
    const data = {
      anotherUserId: anotherUserId,
      currentUserId: currentUserId,
    };
    try {
      const res = await MessageServiceInstance.getMessages(data);
      console.log('res in user chat', res);
      if (res) {
        setMessages(res.messages.messages);
        scrollViewRef.current?.scrollToEnd({animated: true});
      }
    } catch (error) {
      console.log('could not get the messages', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user]);

  const handleDeleteMessage = async () => {
    const data = {
      currentUserId: currentUserId,
      anotherUserId: anotherUserId,
      messageId: selectedMessageID,
    };
    try {
      const res = await MessageServiceInstance.deleteMessage(data);
      console.log('res is', res);
      if (res) {
        const messages = res.messages;
        console.log('Message deletd succefully');
        setMessages(res.messages.messages);
        scrollViewRef.current?.scrollToEnd({animated: true});
      } else {
        setMessageEditModal(false);
      }
    } catch (error) {
      setMessageEditModal(false);
      console.error('could not delete the message', error);
    }
  };

  const handleEditMessage = (msg: any) => {
    setMessageEditModal(false);
    console.log('message is ', msg);
    setMessage(msg.message);
    inputRef.current?.focus();
    setIsEditable(true);
  };
  useEffect(() => {
    // Emit online status when user connects
    socket.emit('userOnline', currentUserId);

    // Listen for 'userhasOnline' event to add user
    socket.on('userhasOnline', ({userId, socketId}) => {
      dispatch(addUser({userId, socketId: socketId}));
      console.log('User has added in onlineUsers', onlineUsers); // Logs updated onlineUsers state
    });

    // Listen for 'disconnect' event to remove user
    socket.on('userOffline', socketId => {
      console.log('User disconnected:', socketId);
      // Find userId by matching socketId
      const userId = Object.entries(onlineUsers).find(
        ([userId, socketId]) => socketId === socketId,
      )?.[0];

      if (userId) {
        dispatch(removeUser({userId}));
        console.log('User has removed in onlineUsers', onlineUsers); // Logs updated onlineUsers state
      }
    });

    return () => {
      socket.disconnect(); // Clean up on component unmount
    };
  }, []);

  useEffect(() => {
    if (messages?.length > 0) {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{padding: 10}}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => {
              console.log('user id ', user?._id);
              navigation.navigate('UserProfile', {userId: user?._id});
            }}>
            <Image
              source={{
                uri: user?.profilePic,
              }}
              style={styles.userImage}
            />

            <View>
              <Text style={styles.userName}>{user?.username}</Text>
              <Text style={styles.userStatus}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <MaterialIcons name="call" size={24} color="white" />
          <FontAwesome name="video-camera" size={24} color="white" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        ref={scrollViewRef} // Attach ref to ScrollView
        style={styles.messageContainer}
        showsVerticalScrollIndicator={false}>
        {messages?.length > 0 ? (
          <View style={styles.messageWrapper}>
            {messages.map((msg: any, i: any) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.message,
                  msg.sender?._id == currentUser?._id
                    ? styles.userMessage
                    : styles.otherUserMessage,
                ]}
                onPress={() => {
                  setMessageEditModal(false);
                }}
                onLongPress={() => {
                  setselectedMessageID(msg._id);
                  setMessageEditModal(true);
                }}>
                <View
                  style={{
                    // borderWidth: 2,
                    // borderColor: "yellow",
                    gap: 30,
                  }}>
                  {msg.sender?._id == currentUser?._id ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',

                        gap: 10,
                      }}>
                      <Text style={styles.userMessageText}>{msg.message}</Text>

                      <Image
                        source={{
                          uri: msg.sender?.profilePic,
                        }}
                        style={styles.userImageSmall}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <TouchableOpacity
                        style={{}}
                        onPress={() =>
                          navigation.navigate('UserProfile', {
                            userId: msg.sender?._id,
                          })
                        }>
                        <Image
                          source={{
                            uri: msg.sender?.profilePic,
                          }}
                          style={styles.otherUserImageSmall}
                        />
                      </TouchableOpacity>
                      <Text style={styles.otherUserMessageText}>
                        {msg.message}
                      </Text>
                    </View>
                  )}

                  {messageEditModal && msg._id == selectedMessageID && (
                    <View
                      style={{
                        width: 170,
                        // height: 120,
                        minHeight: 70,
                        // backgroundColor: "#303030",
                        borderRadius: 10,
                        gap: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        // marginTop:10 ,
                      }}>
                      {msg.sender?._id == currentUser?._id ? (
                        <>
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#363636',
                              width: '90%',
                              borderRadius: 10,
                              alignItems: 'center',
                              flexDirection: 'row',
                              gap: 3,
                              justifyContent: 'center',
                            }}
                            onPress={() => {
                              handleEditMessage(msg);
                            }}>
                            <AntDesign name="edit" size={20} color="white" />

                            <Text
                              style={{
                                color: 'white',
                                padding: 10,
                                fontSize: 15,
                                fontWeight: 'bold',
                              }}>
                              edit
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              backgroundColor: 'darkred',
                              width: '90%',
                              borderRadius: 10,
                              alignItems: 'center',
                              flexDirection: 'row',
                              gap: 3,
                              justifyContent: 'center',
                            }}
                            onPress={handleDeleteMessage}>
                            <AntDesign name="delete" size={20} color="white" />
                            <Text
                              style={{
                                color: 'white',
                                padding: 10,
                                fontSize: 15,
                                fontWeight: 'bold',
                              }}>
                              Delete
                            </Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <TouchableOpacity
                          style={{
                            backgroundColor: 'darkblue',
                            width: '90%',
                            borderRadius: 10,
                            alignItems: 'center',
                            flexDirection: 'row',
                            gap: 3,
                            justifyContent: 'center',
                          }}>
                          {/* <AntDesign name="like2" size={20} color="white" /> */}
                          {/* <AntDesign name="heart" size={20} color="white" /> */}
                          <AntDesign name="hearto" size={20} color="white" />
                          <Text
                            style={{
                              color: 'white',
                              padding: 10,
                              fontSize: 15,
                              fontWeight: 'bold',
                            }}>
                            Like
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 600,
              // borderWidth:2,
              // borderColor:"blue"
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                lineHeight: 30,
              }}>
              No messages yet please start conversation
            </Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons name="camera" size={24} color="white" />
          <TextInput
            ref={inputRef}
            multiline
            // textAlignVertical="top"
            style={styles.textInput}
            placeholder="Message..."
            placeholderTextColor={'white'}
            value={message}
            onChangeText={value => setMessage(value)}
          />
        </View>
        <View style={styles.iconContainer}>
          {message.length > 0 ? (
            <TouchableOpacity
              style={{
                marginRight: 10,
                backgroundColor: 'darkblue',
                padding: 15,
                borderRadius: 10,
              }}>
              <FontAwesome
                name="paper-plane"
                size={24}
                color="white"
                onPress={handleSendMessage}
              />
            </TouchableOpacity>
          ) : (
            <>
              {/* <FontAwesome name="microphone" size={24} color="white" /> */}
              <FontAwesome name="image" size={24} color="white" />
              <MaterialCommunityIcons
                name="sticker-emoji"
                size={24}
                color="white"
              />
              {/* <FontAwesome name="plus" size={24} color="white" /> */}
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  userName: {
    color: 'white',
  },
  userStatus: {
    color: 'white',
    fontSize: 13,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 15,
    marginRight: 10,
  },
  messageContainer: {
    marginTop: 20,
    maxHeight: 550,
    // borderWidth: 2,
    // borderColor: "yellow",
  },
  messageWrapper: {
    paddingHorizontal: 10,
    marginTop: 20,
    // borderWidth: 2,
    // borderColor: "blue",
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    // borderWidth: 2,
    // borderColor: "blue",
  },
  userMessage: {
    // borderWidth: 2,
    // borderColor: "white",
    justifyContent: 'flex-end',
    marginRight: 2,
    gap: 10,
  },
  userMessageText: {
    color: 'white',
    backgroundColor: '#212121',
    textAlign: 'center',
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
    marginLeft: 10,
  },
  otherUserMessage: {
    justifyContent: 'flex-start',
    gap: 10,
  },
  otherUserMessageText: {
    // color: 'black',
    color: 'white',
    // backgroundColor: 'white',
    backgroundColor: 'brown',
    textAlign: 'center',
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
    marginRight: 10,
  },
  otherUserImageSmall: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  userImageSmall: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#393939',
    position: 'absolute',
    bottom: 20,
    width: '98%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    minHeight: 50,
  },

  textInput: {
    color: 'white',
    // borderWidth: 2,
    // borderColor: 'blue',
    paddingRight: 80,
    maxWidth: '78%',
  },

  iconContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
});
