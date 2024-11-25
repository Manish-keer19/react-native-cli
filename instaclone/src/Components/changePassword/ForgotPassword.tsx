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

export default function ForgotPassword() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setemail] = useState<string>("");
  const [step, setstep] = useState<number>(1);
  const [otp, setOtp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isoptgenerating, setIsoptgenerating] = useState<boolean>(false);
  const [isResetPassword, setisResetPassword] = useState<boolean>(false);

  const handleGenerateOtp = async () => {
    const data = { email };
    console.log("data is ", data);
    try {
      setIsoptgenerating(true);
      const res = await AuthServiceInstance.sendOtp(data);
      if (res) {
        setIsoptgenerating(false);
        setstep(2);
      }

      console.log("res is ", res);
    } catch (error) {
      setIsoptgenerating(false);
      console.log("could not generate the otp", error);
    }
  };

  const handleResetPassword = async () => {
    const data = { email, otp, password };
    console.log("data is ", data);
    try {
      setisResetPassword(true);
      const res = await AuthServiceInstance.ResetPassword(data);
      console.log("res is ", res);
      if (res) {
        setisResetPassword(false);
        // alert("password changed successfully");
        navigation.navigate("Login");
      } else {
        setisResetPassword(false);
       Alert.alert("reset password failed");
        setemail("");
        setOtp("");
        setPassword("");
      }
    } catch (error) {
      setemail("");
      setOtp("");
      setPassword("");
      setisResetPassword(false);
      console.log("could not ResetPassword", error);
    }
  };
  return (
    <View style={styles.container}>
      {step == 1 && (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Enter your email</Text>
            <Text style={styles.subtitle}>we will send you a otp</Text>
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
              onPress={handleGenerateOtp}
            >
              <Text style={styles.nextButtonText}>
                {isoptgenerating ? "Generating otp..." : "Generate otp"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {step == 2 && (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Enter password</Text>
            <Text style={styles.subtitle}>Enter password for {email}</Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="password"
              placeholderTextColor={"#aaa"}
              value={password}
              onChangeText={(value) => {
                // console.log("email is ", email);
                setPassword(value);
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
            <Text style={styles.title}>Enter otp</Text>
            <Text style={styles.subtitle}>
              we have sent you an otp on email {email}{" "}
            </Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Otp"
              placeholderTextColor={"#aaa"}
              value={otp}
              onChangeText={(value) => {
                // console.log("email is ", email);
                setOtp(value);
              }}
            />
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleResetPassword}
            >
              <Text style={styles.nextButtonText}>
                {isResetPassword ? "Resetting password....." : "Reset password"}
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
