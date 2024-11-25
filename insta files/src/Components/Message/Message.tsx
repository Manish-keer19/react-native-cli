import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import AntDesignIcons from "react-native-vector-icons/AntDesign";
import FeatherIcons from "react-native-vector-icons/Feather";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../Entryroute";
import { UserServiceInstance } from "../../services/Userservice";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function Message() {
  const { user } = useSelector((state: any) => state.User);
  const [usersData, setUsersData] = useState([]);
  const { token } = useSelector((state: any) => state.User);
  const [username, setUsername] = useState<string>("");
  const [serachData, setSerachData] = useState<[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const serchUserInMessage = async () => {
    const data = {
      token,
      searchTerm: username,
    };
    try {
      const res = await UserServiceInstance.searchUsersInMessage(data);
      console.log("res in serchUserInMessage", res);
      if (res) {
        setSerachData(res.users);
      }
    } catch (error) {
      console.log("could not get the searchUserInMessage", error);
    }
  };

  const fetchuserFollowingData = async () => {
    try {
      const response = await UserServiceInstance.fetchUserFollowingList({
        token,
      });

      console.log("response is ", response);
      if (response) {
        console.log("userfolowing data fetched");
        setUsersData(response.followingList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchuserFollowingData();
  }, [token]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 10 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Manish-keer19</Text>
        <FeatherIcons name="edit" color={"white"} size={30} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <AntDesignIcons name="search1" color={"#B0B0B0"} size={20} />
        <TextInput
          placeholder="Search"
          placeholderTextColor={"#B0B0B0"}
          style={styles.searchInput}
          value={username}
          onChangeText={(value) => {
            setUsername(value);
            serchUserInMessage();
          }}
        />
      </View>

      {/* Messages Section */}
      <ScrollView style={styles.messagesContainer}>
        {serachData.length > 0 && (
          <Text style={styles.sectionHeader}>Search Result</Text>
        )}
        {/* map through your serachData items */}
        {serachData.map((user: any, i) => (
          <TouchableOpacity
            style={styles.messageItem}
            key={i}
            onPress={() => navigation.navigate("UserChat", { user: user })}
          >
            <TouchableOpacity
              style={{
                borderWidth: user?.userStories ? 1 : 0, // Conditional border
                borderColor:
                  user?.userStories ? "yellow" : "transparent",
                borderRadius: 50,
                padding: user?.userStories ? 4 : 0,
              }}
              onPress={() => {
                if (user?.userStories) {
                  navigation.navigate("AllStories", { user: user });
                } else {
                  navigation.navigate("UserProfile", { userId: user?._id });
                }
              }}
            >
              <Image
                source={{
                  uri: user.profilePic,
                }}
                style={styles.userImage}
              />
            </TouchableOpacity>
            <View style={styles.messageDetails}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.messageText}>Mentioned you in a story</Text>
            </View>
            <AntDesignIcons
              name="camera"
              color={"#B0B0B0"}
              size={30}
              style={styles.cameraIcon}
            />
          </TouchableOpacity>
        ))}

        {/* Messages Header */}
        <Text style={styles.sectionHeader}>Messages</Text>
        {/* Map through your message items */}
        {usersData.map((user: any, i) => (
          <TouchableOpacity
            style={styles.messageItem}
            key={i}
            onPress={() => navigation.navigate("UserChat", { user: user })}
          >
            <TouchableOpacity
              style={{
                borderWidth: user?.userStories ? 1 : 0, // Conditional border
                borderColor:
                  user?.userStories ? "yellow" : "transparent",
                borderRadius: 50,
                padding: user?.userStories ? 4 : 0,
              }}
              onPress={() => {
                if (user?.userStories) {
                  navigation.navigate("AllStories", { user: user });
                } else {
                  navigation.navigate("UserProfile", { userId: user?._id });
                }
              }}
            >
              <Image
                source={{
                  uri: user.profilePic,
                }}
                style={styles.userImage}
              />
            </TouchableOpacity>
            <View style={styles.messageDetails}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.messageText}>Mentioned you in a story</Text>
            </View>
            <AntDesignIcons
              name="camera"
              color={"#B0B0B0"} // Changed to a lighter gray
              size={30}
              style={styles.cameraIcon}
            />
          </TouchableOpacity>
        ))}

        {/* Requests Header */}
        <Text style={styles.sectionHeader}>Requests</Text>
        {/* Example Requests */}
        {[...Array(5)].map((_, i) => (
          <View style={styles.messageItem} key={`request-${i}`}>
            <Image
              source={{
                uri: "https://res.cloudinary.com/manish19/image/upload/v1724059147/jyyudwmciv6tmudw2rf0.jpg", // Placeholder image URL for requests
              }}
              style={styles.userImage}
            />
            <View style={styles.messageDetails}>
              <Text style={styles.username}>New Request from User</Text>
              <Text style={styles.messageText}>Wants to connect with you</Text>
            </View>
            <AntDesignIcons
              name="user"
              color={"#B0B0B0"} // Changed to a lighter gray for requests
              size={30}
              style={styles.cameraIcon}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000", // Black for the overall background
  
  },
  header: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#333333", // Darker border for the header
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600", // Bold for emphasis
  },
  searchBar: {
    backgroundColor: "#1F1F1F", // Dark grey for the search bar
    height: 50,
    width: "90%",
    marginHorizontal: "auto",
    marginTop: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    color: "white",
    marginLeft: 10,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
    marginTop: 20,
  },
  sectionHeader: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#2A2A2A", // Darker message item background
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    gap: 19,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // marginRight: 10,
  },
  messageDetails: {
    flex: 1,
  },
  username: {
    fontWeight: "bold",
    color: "#ffffff", // White for username
  },
  messageText: {
    color: "#B0B0B0", // Light gray for message text
  },
  cameraIcon: {
    marginLeft: 10,
  },
});
