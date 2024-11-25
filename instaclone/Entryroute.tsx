// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import HomeScreen from "./src/Components/HomePages/HomeScreen";
// import Profile from "./src/Components/Profile/Profile";
// import AddPost from "./src/Components/AddPost/AddPost";
// import ImagePicker1 from "./src/Components/ImagePicker";
// import EditProfile from "./src/Components/EditProfile";
// import Post from "./src/Components/Post/Posts";
// import Login from "./src/auth/Login";
// import Signup from "./src/auth/Signup";
// import Message from "./src/Components/Message/Message";
// import Notification from "./src/Components/Notification/Notification";
// import Loader from "./src/Components/Loader";
// import CreatePost from "./src/Components/AddPost/CreatePost";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useLoadUserData } from "./src/features/user/userSlice";
// import Search from "./src/Components/search/Search";
// import UserProfile from "./src/Components/search/UserProfile";
// import CommentModal from "./src/Components/Post/CommentSection";
// import CommentSection from "./src/Components/Post/CommentSection";
// import { ActivityIndicator, View } from "react-native";

// const Stack = createNativeStackNavigator();

// export type RootStackParamList = {
//   Home: undefined;
//   AddPost: undefined;
//   Reels: undefined;
//   Profile: undefined | { user: any };
//   ImagePicker: undefined;
//   EditProfile: undefined;
//   Post: undefined | { user: any };
//   Login: undefined;
//   Signup: undefined;
//   Messages: undefined;
//   Notification: undefined;
//   Loader: undefined;
//   CreatePost: { file1: object | null | undefined };
//   Search: undefined;
//   UserProfile: undefined | { user: any };
//   CommentSection:
//     | undefined
//     | { commentModal: any; setCommentModal: any; Posts: any };
// };

// export default function Entryroute() {
//   useLoadUserData();

//   const { token, user } = useSelector((state: any) => state.User);

//   // const [initialPage, setInitialPage] = useState<string>("Login");
//   // const [initialPage, setInitialPage] = useState<string>("Post");
//   const [initialPage, setInitialPage] = useState<string | null>(null);

//   console.log("token in entryroute ", token);
//   console.log("user in entryroute ", user);

//   console.log("initialPage is ", initialPage);

//   if (!token && !user) {
//   }

//   if (user === null || token === null) {
//     return (
//       <View
//         style={{
//           width: "100%",
//           height: "100%",
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: "black",
//         }}
//       >
//         <ActivityIndicator size="large" color="white" />
//       </View>
//     );
//   }

//   useEffect(() => {
//     // Set the initial page based on user presence
//     setInitialPage(token && user ? "Home" : "Login");
//   }, [token, user]); // Add 'user' as a dependency

//   console.log("initial page is ", initialPage);
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{ headerShown: false }}
//         initialRouteName={initialPage} // Fallback to "Login" if initialPage is empty
//         // initialRouteName={"Search"}
//       >
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="Profile" component={Profile} />
//         <Stack.Screen name="AddPost" component={AddPost} />
//         <Stack.Screen name="ImagePicker" component={ImagePicker1} />
//         <Stack.Screen name="EditProfile" component={EditProfile} />
//         <Stack.Screen name="Post" component={Post} />
//         <Stack.Screen name="Login" component={Login} />
//         <Stack.Screen name="Signup" component={Signup} />
//         <Stack.Screen name="Messages" component={Message} />
//         <Stack.Screen name="Notification" component={Notification} />
//         <Stack.Screen name="Loader" component={Loader} />
//         <Stack.Screen name="CreatePost" component={CreatePost} />
//         <Stack.Screen name="Search" component={Search} />
//         <Stack.Screen name="UserProfile" component={UserProfile} />
//         {/* <Stack.Screen name="CommentSection" component={CommentSection} /> */}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './src/Components/HomePages/HomeScreen';
import Profile from './src/Components/Profile/Profile';
import AddPost from './src/Components/AddPost/AddPost';
import EditProfile from './src/Components/EditProfile';
import Post from './src/Components/Post/Posts';
import Login from './src/auth/Login';
import Signup from './src/auth/Signup';
import Message from './src/Components/Message/Message';
import Notification from './src/Components/Notification/Notification';
import Loader from './src/Components/Loader';
import CreatePost from './src/Components/AddPost/CreatePost';
import Search from './src/Components/search/Search';
import UserProfile from './src/Components/search/UserProfile';
import {useEffect, useState} from 'react';
import ForgotPassword from './src/Components/changePassword/ForgotPassword';
import ChangePassword from './src/Components/changePassword/ChangePassword';
import {useLoadUserData} from './src/features/user/userSlice';
import AddStory from './src/Components/Story/AddStory';
import CreateStory from './src/Components/Story/CreateStory';
import AllStories from './src/Components/Story/AllStories';
import ChatScreen from './src/Components/Message/ChatScreen';
import UserChat from './src/Components/Message/UserChat';
import AudioCall from './src/Components/Message/AudioCall';
import {ActivityIndicator, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined | {user: any};
  AddPost: undefined;
  ImagePicker: undefined;
  EditProfile: undefined;
  Post: undefined | {user?: any; userId?: any};
  Login: undefined;
  Signup: undefined;
  Messages: undefined;
  Notification: undefined;
  Loader: undefined;
  CreatePost: {file1: object | null | undefined};
  Search: undefined;
  UserProfile: undefined | {user?: any; userId?: any};
  ForgotPassword: undefined;
  ChangePassword: undefined;
  AddStory: undefined;
  CreateStory: undefined | {mediaData: any};
  AllStories: undefined | {user: any};
  ChatScreen: undefined;
  UserChat: undefined | {user: any};
  AudioCall: undefined;
};

export default function Entryroute() {
  useLoadUserData();
  const [initialPage, setInitialPage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('userData');

        setInitialPage(token && user ? 'Home' : 'Login');
      } catch (error) {
        console.error('Error retrieving token or user:', error);
        setInitialPage('Login'); // Default to Login if error occurs
      } finally {
        setLoading(false); // Set loading to false after check
      }
    };

    checkUserAuth();
  }, []);

  if (loading) {
    // Display loading indicator while fetching user and token from AsyncStorage
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#212121',
        }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={initialPage}
        // initialRouteName={'Login'}
        // initialRouteName={"Post"}
        // initialRouteName={"CreateStory"}
        // initialRouteName={"AllStories"}
        // initialRouteName={"ChatScreen"}
        // initialRouteName={"UserChat"}
        // initialRouteName={"Messages"}
        // initialRouteName={"AudioCall"}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="AddPost" component={AddPost} />

        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Messages" component={Message} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Loader" component={Loader} />
        <Stack.Screen name="CreatePost" component={CreatePost} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="AddStory" component={AddStory} />
        <Stack.Screen name="CreateStory" component={CreateStory} />
        <Stack.Screen name="AllStories" component={AllStories} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="UserChat" component={UserChat} />
        <Stack.Screen name="AudioCall" component={AudioCall} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
