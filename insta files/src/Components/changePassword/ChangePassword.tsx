import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
import React, { useState } from "react";
import { AuthServiceInstance } from "../../services/authServices";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../Entryroute";
import { useSelector } from "react-redux";

export default function ChangePassword() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const token = useSelector((state: any) => state.User.token);
  const [email, setemail] = useState<string>("");
  const [newPassword, setnewPassword] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [ischangepassword, setIschangepassword] = useState<boolean>(false);
  const [step, setstep] = useState<number>(1);

  const handleChangPassword = async () => {
    const data = { email, newPassword, oldPassword, token };
    console.log("data is ", data);
    try {
      setIschangepassword(true);
      const res = await AuthServiceInstance.changePassword(data);
      console.log("res is ", res);
      if (res) {
        setIschangepassword(false);
        Alert.alert("password change succefully");
        navigation.navigate("Profile");
      } else {
        setIschangepassword(false);
      }
    } catch (error) {
      setemail("");
      setIschangepassword(false);
      console.log("could not ResetPassword", error);
    }
  };
  return (
    <View style={styles.container}>
      {step == 1 && (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Enter your email</Text>
            <Text style={styles.subtitle}>
              please enter for change tha password{" "}
            </Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="email"
              placeholderTextColor={"#aaa"}
              value={email}
              onChangeText={(value) => {
                // console.log("email is ", email);
                setemail(value);
              }}
            />
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => {
                setstep(2);
              }}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {step === 2 && (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Enter old password</Text>
            <Text style={styles.subtitle}>please enter your old password</Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="old password"
              placeholderTextColor={"#aaa"}
              value={oldPassword}
              onChangeText={(value) => {
                // console.log("email is ", email);
                setOldPassword(value);
              }}
            />
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => setstep(3)}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {step == 3 && (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Enter new password</Text>
            <Text style={styles.subtitle}>please enter your new password</Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="new password"
              placeholderTextColor={"#aaa"}
              value={newPassword}
              onChangeText={(value) => {
                setnewPassword(value);
              }}
            />
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleChangPassword}
            >
              <Text style={styles.nextButtonText}>
                {ischangepassword
                  ? "changing password....."
                  : "change password"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    textAlign: "center",
    // borderWidth:2,
    // borderColor:"yellow",
    width: "80%",
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  formContainer: {
    width: "100%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    color: "#fff",
    borderWidth: 1,
    backgroundColor: "#212121",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 20,
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#3897f0",
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    padding: 10,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
