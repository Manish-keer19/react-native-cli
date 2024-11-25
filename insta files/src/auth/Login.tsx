import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../Entryroute';
import {AuthServiceInstance} from '../services/authServices';
import {useDispatch} from 'react-redux';
import {setToken, setUser} from '../features/user/userSlice';
import instaLogo from '../../assets/imges/instagram_logo2.png';

export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

  const handleSubmit = async () => {
    const data = {
      email,
      password,
    };
    console.log('data in login form is ', data);
    try {
      const res = await AuthServiceInstance.login(data);

      console.log('Res is ', res);
      if (res.success) {
        // alert("logged in succefully");
        dispatch(setToken(res.token));
        dispatch(setUser(res.userdata));
        setIsSubmiting(false);
        setEmail('');
        setPassword('');
        navigation.navigate('Home');
      }
    } catch (error) {
      console.log('could not login here in login.tsx', error);
      setIsSubmiting(false);
      setEmail('');
      setPassword('');
      Alert.alert('Could not login');
    }
  };
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={{width: 70, height: 70}} source={instaLogo} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#B0B0B0"
          value={email}
          onChangeText={value => {
            setEmail(value);
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor="#B0B0B0"
          value={password}
          onChangeText={value => {
            setPassword(value);
          }}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsSubmiting(true);
          handleSubmit();
        }}
        disabled={isSubmiting}>
        <Text style={styles.buttonText}>
          {isSubmiting ? 'Login please wait...' : 'Login'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Signup')}>
          {/* <Text style={styles.registerText}>Create New Account</Text> */}
          <Text style={styles.registerText}>Create New Account</Text>
        </TouchableOpacity>
        <Text style={styles.methodIcon}>Meta Icon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Set background color to black
    justifyContent: 'center',
    // paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginTop: 20,
    marginBottom: 20,
    gap: 15,
  },
  input: {
    borderWidth: 2,
    borderColor: 'pink',
    borderRadius: 20,
    padding: 16,
    marginVertical: 5,
    fontSize: 16,
    color: '#FFFFFF', // Set text color to white
  },
  button: {
    backgroundColor: '#0095F6',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPassword: {
    alignItems: 'center',
    marginVertical: 10,
  },
  forgotPasswordText: {
    color: '#0095F6',
  },
  footerContainer: {
    alignItems: 'center', // Center items in the footer
    marginTop: 20, // Optional margin for spacing
  },
  registerButton: {
    borderWidth: 2,
    borderColor: '#0095F6',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%', // Optional: Make the button full width
  },
  registerText: {
    color: '#0095F6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  methodIcon: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#B0B0B0',
  },
});
