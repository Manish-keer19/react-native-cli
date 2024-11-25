import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Footer from "../Components/Footer";
import { AuthServiceInstance } from "../services/authServices";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../Entryroute";

export default function Signup() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [step, setStep] = useState(1);
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [otp, setotp] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isUsernameAlreadyTaken, setIsUsernameAlreadyTaken] =
    useState<boolean>(false);

  const handlesingup = async () => {
    if (!email || !password || !otp || !username) {
      Alert.alert("Please fill all the fields");
    } else {
      const data = { email, password, otp, username };
      console.log("register button pressed");
      console.log("data is ", data);

      try {
        const res = await AuthServiceInstance.Signup(data);

        console.log("res is ", res);
        if (res) {
          navigation.navigate("Login");
        }
      } catch (error) {
        console.log("error", error);
        console.log("could not singup some error occured");
      }
    }
  };
  const handleGenerateOtp = async () => {
    const data = { email };
    console.log("data is ", data);
    try {
      const res = await AuthServiceInstance.generateOtp(data);

      console.log("res is ", res);

      setStep(3);
    } catch (error) {
      console.log("could not generate the otp", error);
    }
  };

  const handlecheckIfUsernameAlreadyTaken = async () => {
    const data = { username };

    if (username === "") {
      return   Alert.alert("Please enter username");
    }

    try {
      const res = await AuthServiceInstance.checkIfUsernameAlreadyTaken(data);
      if (res) {
        console.log("res is in singup ", res);
        setStep(2);
      } else {
        console.error("user name is already taken");
        setUsername("");
      }
    } catch (error) {
      console.error("could not check if username already taken", error);
      setUsername("");
    }
  };
  return (
    <View style={styles.container}>
      {/* Conditionally render the form based on the step */}
      {step === 1 && (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Choose username</Text>
            <Text style={styles.subtitle}>You can always change it later</Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="username"
              placeholderTextColor={"#aaa"}
              value={username}
              onChangeText={(value) => {
                setUsername(value);
              }}
            />
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handlecheckIfUsernameAlreadyTaken}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {step === 2 && (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Choose email</Text>
            <Text style={styles.subtitle}>You cannot change it later</Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="email"
              placeholderTextColor={"#aaa"}
              value={email}
              onChangeText={(value) => {
                setemail(value);
              }}
            />
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleGenerateOtp}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 3 && (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Create a Password</Text>
            <Text style={styles.subtitle}>
              For security, your password must be six characters or more
            </Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={"#aaa"}
              secureTextEntry={true} // Hide the password input
              value={password}
              onChangeText={(value) => {
                setpassword(value);
              }}
            />
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => setStep(4)}
            >
              <Text style={styles.nextButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {step == 4 && (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Otp for varification</Text>
            <Text style={styles.subtitle}>
              Enter OTP that we have sent to your email
            </Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Otp"
              placeholderTextColor={"#aaa"}
              value={otp}
              keyboardType="number-pad"
              onChangeText={(value) => {
                setotp(value);
              }}
            />
            <TouchableOpacity style={styles.nextButton} onPress={handlesingup}>
              <Text style={styles.nextButtonText}>Verify otp</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Footer />
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
