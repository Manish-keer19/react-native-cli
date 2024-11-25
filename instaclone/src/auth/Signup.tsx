// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ToastAndroid,
// } from 'react-native';
// import React, {useState} from 'react';
// import Footer from '../Components/Footer';
// import {AuthServiceInstance} from '../services/authServices';
// import {NavigationProp, useNavigation} from '@react-navigation/native';
// import {RootStackParamList} from '../../Entryroute';
// import {useForm, Controller} from 'react-hook-form';

// type SignupFormData = {
//   username: string;
//   email: string;
//   password: string;
//   otp: string;
// };

// export default function Signup() {
//   const {
//     control,
//     handleSubmit,
//     formState: {errors},
//   } = useForm<SignupFormData>();
//   const navigation = useNavigation<NavigationProp<RootStackParamList>>();
//   const [step, setStep] = useState(1);
//   const [email, setemail] = useState<string>('');
//   const [password, setpassword] = useState<string>('');
//   const [otp, setotp] = useState<string>('');
//   // const [username, setUsername] = useState<string>('');

//   const [isUsernameAlreadyTaken, setIsUsernameAlreadyTaken] =
//     useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(false);

//   const handlesingup = async (data: any) => {
//     if (!data.email || !data.password || !data.otp || !data.username) {
//       Alert.alert('Please fill all the fields');
//     } else {
//       console.log('register button pressed');
//       console.log('data is ', data);

//       try {
//         const res = await AuthServiceInstance.Signup(data);

//         console.log('res is ', res);
//         if (res) {
//           navigation.navigate('Login');
//         }
//       } catch (error) {
//         console.log('error', error);
//         console.log('could not singup some error occured');
//       }
//     }
//   };
//   const handleGenerateOtp = async () => {
//     const data = {email};
//     console.log('data is ', data);
//     try {
//       const res = await AuthServiceInstance.generateOtp(data);

//       console.log('res is ', res);

//       setStep(3);
//     } catch (error) {
//       console.log('could not generate the otp', error);
//     }
//   };

//   const handlecheckIfUsernameAlreadyTaken = async (data: any) => {
//     console.log('data is ', data);
//     ToastAndroid.show('checking USERNAME', ToastAndroid.SHORT);
//     try {
//       const res = await AuthServiceInstance.checkIfUsernameAlreadyTaken(data);
//       if (res) {
//         setLoading(false);
//         console.log('res is in singup ', res);
//         setStep(2);
//       } else {
//         setLoading(false);
//         ToastAndroid.show('user name is already taken', ToastAndroid.SHORT);
//       }
//     } catch (error) {
//       console.log('could not check username', error);
//       setLoading(false);
//       ToastAndroid.show('user name is already taken', ToastAndroid.SHORT);
//     }
//   };
//   return (
//     <View style={styles.container}>
//       {/* Conditionally render the form based on the step */}
//       {step === 1 && (
//         <View>
//           <View style={styles.header}>
//             <Text style={styles.title}>Choose username</Text>
//             <Text style={styles.subtitle}>You can always change it later</Text>
//           </View>
//           <View>
//             <View style={styles.formContainer}>
//               <Controller
//                 control={control}
//                 name="username"
//                 rules={{
//                   required: 'username is required',
//                   maxLength: {
//                     value: 30,
//                     message: 'username should be less than 10 characters',
//                   },
//                   minLength: {
//                     value: 3,
//                     message: 'username should be more than 3 characters',
//                   },
//                 }}
//                 render={({field: {onChange, onBlur, value}}) => (
//                   <TextInput
//                     style={styles.input}
//                     placeholder="username"
//                     placeholderTextColor={'#aaa'}
//                     value={value}
//                     onChangeText={value => {
//                       onChange(value);
//                     }}
//                   />
//                 )}
//               />
//               {errors.username && (
//                 <Text style={{color: 'red'}}>{errors.username.message}</Text>
//               )}
//             </View>

//             <TouchableOpacity
//               style={styles.nextButton}
//               onPress={handleSubmit(handlecheckIfUsernameAlreadyTaken)}>
//               <Text style={styles.nextButtonText}>Next</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//       {step === 2 && (
//         <View>
//           <View style={styles.header}>
//             <Text style={styles.title}>Choose email</Text>
//             <Text style={styles.subtitle}>You cannot change it later</Text>
//           </View>
//           <View style={styles.formContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="email"
//               placeholderTextColor={'#aaa'}
//               value={email}
//               onChangeText={value => {
//                 setemail(value);
//               }}
//             />
//             <TouchableOpacity
//               style={styles.nextButton}
//               onPress={handleGenerateOtp}>
//               <Text style={styles.nextButtonText}>Next</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}

//       {step === 3 && (
//         <View>
//           <View style={styles.header}>
//             <Text style={styles.title}>Create a Password</Text>
//             <Text style={styles.subtitle}>
//               For security, your password must be six characters or more
//             </Text>
//           </View>
//           <View style={styles.formContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               placeholderTextColor={'#aaa'}
//               secureTextEntry={true} // Hide the password input
//               value={password}
//               onChangeText={value => {
//                 setpassword(value);
//               }}
//             />
//             <TouchableOpacity
//               style={styles.nextButton}
//               onPress={() => setStep(4)}>
//               <Text style={styles.nextButtonText}>Sign Up</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//       {step == 4 && (
//         <View>
//           <View style={styles.header}>
//             <Text style={styles.title}>Otp for varification</Text>
//             <Text style={styles.subtitle}>
//               Enter OTP that we have sent to your email
//             </Text>
//           </View>
//           <View style={styles.formContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Otp"
//               placeholderTextColor={'#aaa'}
//               value={otp}
//               keyboardType="number-pad"
//               onChangeText={value => {
//                 setotp(value);
//               }}
//             />
//             <TouchableOpacity style={styles.nextButton} onPress={handlesingup}>
//               <Text style={styles.nextButtonText}>Verify otp</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//       <Footer />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     paddingTop: 60,
//   },
//   header: {
//     marginBottom: 30,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   subtitle: {
//     textAlign: 'center',
//     // borderWidth:2,
//     // borderColor:"yellow",
//     width: '80%',
//     fontSize: 14,
//     color: '#888',
//     marginTop: 5,
//   },
//   formContainer: {
//     width: '100%',
//     padding: 20,
//     borderRadius: 10,
//     // alignItems: 'center',
//   },
//   input: {
//     color: '#fff',
//     borderWidth: 1,
//     backgroundColor: '#212121',
//     borderRadius: 5,
//     padding: 10,
//     width: '100%',
//     fontSize: 16,
//   },
//   nextButton: {
//     backgroundColor: '#3897f0',
//     width: '90%',
//     borderRadius: 5,
//     alignItems: 'center',
//     padding: 10,
//     alignSelf: 'center',
//   },
//   nextButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import Footer from '../Components/Footer';
import {AuthServiceInstance} from '../services/authServices';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../Entryroute';
import {useForm, Controller} from 'react-hook-form';

type SignupFormData = {
  username: string;
  email: string;
  password: string;
  otp: string;
};

export default function Signup() {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignupFormData>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isOtpGenerating, setIsOtpGenerating] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handlesingup = async (data: SignupFormData) => {
    setLoading(true);
    ToastAndroid.show('Please wait while we register you', ToastAndroid.SHORT);
    if (!data.email || !data.password || !data.otp || !data.username) {
      ToastAndroid.show('Please fill all the fields', ToastAndroid.LONG);
    } else {
      console.log('register button pressed');
      console.log('data is ', data);

      try {
        const res = await AuthServiceInstance.Signup(data);
        if (res) {
          navigation.navigate('Login');
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.log('error', error);
      }
    }
  };

  const handleGenerateOtp = async (data: any) => {
    setIsOtpGenerating(true);
    ToastAndroid.show('Generating Otp', ToastAndroid.SHORT);
    console.log('data in handleGenerateOtp is ', data);
    try {
      const res = await AuthServiceInstance.generateOtp(data);
      if (res) {
        setStep(3);
        setIsOtpGenerating(false);
      }
    } catch (error) {
      ToastAndroid.show('Could not generate the otp', ToastAndroid.LONG);
      setIsOtpGenerating(false);
      console.log('could not generate the otp', error);
    }
  };

  const handleCheckIfUsernameAlreadyTaken = async (data: any) => {
    ToastAndroid.show('checking USERNAME', ToastAndroid.SHORT);
    try {
      const res = await AuthServiceInstance.checkIfUsernameAlreadyTaken(data);
      if (res) {
        setStep(2);
      } else {
        ToastAndroid.show('Username is already taken', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('could not check username', error);
      ToastAndroid.show('Username is already taken', ToastAndroid.SHORT);
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
            <Controller
              control={control}
              name="username"
              rules={{
                required: 'Username is required',
                maxLength: {
                  value: 30,
                  message: 'Username should be less than 30 characters',
                },
                minLength: {
                  value: 3,
                  message: 'Username should be more than 3 characters',
                },
              }}
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor={'#aaa'}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.username && (
              <Text style={{color: 'red'}}>{errors.username.message}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleSubmit(handleCheckIfUsernameAlreadyTaken)}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Choose email</Text>
            <Text style={styles.subtitle}>You cannot change it later</Text>
          </View>
          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Please enter a valid email address',
                },
              }}
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={'#aaa'}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.email && (
              <Text style={{color: 'red'}}>{errors.email.message}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleSubmit(handleGenerateOtp)}>
            <Text style={styles.nextButtonText}>
              {isOtpGenerating ? 'Sending otp' : 'Next'}
            </Text>
          </TouchableOpacity>
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
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 2,
                  message: 'Password should be at least 6 characters',
                },
              }}
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={'#aaa'}
                  secureTextEntry={true} // Hide the password input
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.password && (
              <Text style={{color: 'red'}}>{errors.password.message}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setStep(4)} // Manually proceed to the next step
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 4 && (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>OTP for Verification</Text>
            <Text style={styles.subtitle}>
              Enter OTP that we have sent to your email
            </Text>
          </View>
          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="otp"
              rules={{
                required: 'OTP is required',
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: 'Please enter a valid OTP',
                },
              }}
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="OTP"
                  placeholderTextColor={'#aaa'}
                  value={value}
                  keyboardType="number-pad"
                  onChangeText={onChange}
                />
              )}
            />
            {errors.otp && (
              <Text style={{color: 'red'}}>{errors.otp.message}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleSubmit(handlesingup)}>
            <Text style={styles.nextButtonText}>
              {loading ? 'Loading' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    textAlign: 'center',
    width: '80%',
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  formContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    color: '#fff',
    borderWidth: 1,
    backgroundColor: '#212121',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#3897f0',
    width: '90%',
    borderRadius: 5,
    alignItems: 'center',
    padding: 10,
    alignSelf: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
