import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../Entryroute';
import {AuthServiceInstance} from '../services/authServices';
import {useDispatch} from 'react-redux';
import {setToken, setUser} from '../features/user/userSlice';
import instaLogo from '../../assets/image/nstagram_logo2.png';
import {useForm, Controller} from 'react-hook-form';

interface LoginProps {
  email: string;
  password: string;
}
export default function Login() {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginProps>();
  const dispatch = useDispatch();
  // const [email, setEmail] = useState<string>('');
  // const [password, setPassword] = useState<string>('');
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    console.log('data in login form is ', data);
    setIsSubmiting(true);

    if (loading) {
      ToastAndroid.show('Please wait', ToastAndroid.SHORT);
    }
    try {
      const res = await AuthServiceInstance.login(data);

      console.log('Res is ', res);
      if (res.success) {
        ToastAndroid.show('logged in succefully', ToastAndroid.SHORT);
        dispatch(setToken(res.token));
        dispatch(setUser(res.userdata));
        setIsSubmiting(false);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.log('could not login here in login.tsx', error);
      setIsSubmiting(false);
      ToastAndroid.show('invalid password', ToastAndroid.LONG);
    }
  };
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={{width: 70, height: 70}} source={instaLogo} />
      </View>
      <View style={styles.inputContainer}>
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#B0B0B0"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.email && (
          <Text style={{color: 'red'}}>{errors.email.message}</Text>
        )}
        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 2,
              message: 'Password must be at least 6 characters',
            },
            maxLength: {
              value: 20,
              message: 'Password must be at most 20 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor="#B0B0B0"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.password && (
          <Text style={{color: 'red'}}>{errors.password.message}</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
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
