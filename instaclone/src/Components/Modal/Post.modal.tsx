import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import FeatherIcons from "react-native-vector-icons/Feather";
import AntDesignIcons from "react-native-vector-icons/AntDesign";
import { PostServiceInstance } from "../../services/postServie";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../features/user/userSlice";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../Entryroute";

interface PostmodalProps {
  PostData: any;
}
export const Postmodal: React.FC<PostmodalProps> = ({ PostData }) => {
  // console.log("PostData is in Postmodal ", PostData);
  const { token, user } = useSelector((state: any) => state.User);

  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // console.log("PostData is in Postmodal ", PostData);

  const [isdeleting, setIsdeleting] = useState(false);

  const handledeletePost = async () => {
    // console.log("PostData is in Postmodal ", PostData);
    setIsdeleting(true);
    const data = {
      token,
      postId: PostData.post._id,
    };
    try {
      const res = await PostServiceInstance.deletePost(data);
      console.log("res in Postmodal ", res);
      if (res) {
        console.log("post deleted succesfully in Posmodal");
        dispatch(setUser(res.userdata));
        navigation.navigate("Profile");
      }
    } catch (error) {
      setIsdeleting(false);
      console.log("could not delete the post", error);
    }
  };
  return (
    <View
      style={{
        position: "absolute",
        width: "99%",
        height: "30%",
        bottom: 0,
        backgroundColor: "#212121",
        justifyContent: "center",
      }}
    >
      <View style={{ alignItems: "center", justifyContent: "center", gap: 10 }}>
        {PostData.post.user._id == PostData.userID ? (
          <>
            <TouchableOpacity
              style={{
                width: "95%",
                height: 90,
                // borderWidth: 2,
                // borderColor: "blue",
                flexDirection: "row",
                paddingLeft: 30,
                alignItems: "center",
                gap: 20,
                backgroundColor: "#595959",
                borderRadius: 10,
              }}
            >
              <FeatherIcons name="edit-2" size={30} color="white" />
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
              >
                Edit Post
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: "95%",
                height: 90,
                // borderWidth: 2,
                // borderColor: "blue",
                flexDirection: "row",
                paddingLeft: 30,
                alignItems: "center",
                gap: 20,
                backgroundColor: "darkred",
                borderRadius: 10,
              }}
              disabled={isdeleting}
              onPress={handledeletePost}
            >
              <AntDesignIcons name="delete" size={35} color="red" />
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "red" }}>
                {isdeleting ? "Deleting..." : "Delete Post"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={{
              width: "95%",
              height: 90,
              // borderWidth: 2,
              // borderColor: "blue",
              flexDirection: "row",
              paddingLeft: 40,
              alignItems: "center",
              gap: 20,
              backgroundColor: "blue",
              borderRadius: 10,
            }}
          >
            <AntDesignIcons name="hearto" size={35} color="white" />
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
              Like
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
