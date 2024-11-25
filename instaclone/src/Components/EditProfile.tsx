

import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../Entryroute';
import Footer from './Footer';
import {useDispatch, useSelector} from 'react-redux';
import {setProfileData} from '../features/Profile/ProfileSlice';
import {ProfileServiceInstance} from '../services/ProfileService';
import {setUser} from '../features/user/userSlice';
import {UserServiceInstance} from '../services/Userservice';
import {launchImageLibrary} from 'react-native-image-picker';

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {token, user} = useSelector((state: any) => state.User);

  // State management
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [pronoun, setPronoun] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Function to fetch user data after profile update
  const fetchUserData = async () => {
    const data = {email: user.email, token};
    try {
      const res = await UserServiceInstance.getUserData(data);
      if (res.userdata) {
        dispatch(setUser(res.userdata));
      }
    } catch (error) {
      console.log('Could not get the user data', error);
    }
  };

  // Function to handle profile update
  const handleSubmit = async () => {
    setLoading(true);
    const data = new FormData();

    // Append form data
    data.append('token', token);

    if (name || username || bio || pronoun) {
      data.append('name', name);
      data.append('username', username);
      data.append('bio', bio);
      data.append('pronoun', pronoun);
      data.append('email', user?.email);
    }
    if (profileImage) {
      data.append('profileImage', {
        uri: profileImage,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
    }

    try {
      const res = await ProfileServiceInstance.updateProfile(data);
      if (res) {
        await fetchUserData();
        dispatch(setProfileData(res.data));
        navigation.navigate('Profile');
      }
    } catch (error) {
      console.log('Could not edit the profile', error);
    } finally {
      setLoading(false); // Ensure loading state is reset
      resetForm(); // Reset form fields
    }
  };

  // Function to reset form fields
  const resetForm = () => {
    setName('');
    setUsername('');
    setBio('');
    setPronoun('');
    setProfileImage(null);
  };

  // Function to pick an image from the gallery
  const PickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo', // Only pick images
        quality: 1, // Set quality of the image
        maxWidth: 800, // Optionally limit width
        maxHeight: 800, // Optionally limit height
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert('Error', response.errorMessage);
        } else {
          // Add a check to make sure assets exists and is not empty
          if (response.assets && response.assets.length > 0) {
            const imageUri = response.assets[0]?.uri;
            if (imageUri) {
              setProfileImage(imageUri); // Set the selected image URI
            }
          }
        }
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>
      <View style={styles.imageContainer}>
        <Pressable onPress={PickImage}>
          {profileImage ? (
            <Image source={{uri: profileImage}} style={styles.image} />
          ) : (
            <View style={{alignItems:'center',gap:10}}>
            <Image source={{uri:user?.profilePic}} style={styles.image} />
            <Text style={styles.chooseImageText}>Choose Profile Image</Text>
            </View>
          )}
        </Pressable>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Name"
          placeholderTextColor={'white'}
          style={styles.textInput}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Username"
          placeholderTextColor={'white'}
          style={styles.textInput}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Pronoun"
          placeholderTextColor={'white'}
          style={styles.textInput}
          value={pronoun}
          onChangeText={setPronoun}
        />
        <TextInput
          placeholder="Bio"
          placeholderTextColor={'white'}
          style={styles.textInput}
          value={bio}
          onChangeText={setBio}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.btn, styles.cancelBtn]}
          onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.btnText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.saveBtn]}
          disabled={loading}
          onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.btnText}>Save</Text>
          )}
        </Pressable>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    backgroundColor: 'black',
    // paddingTop: 46,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    margin:10
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  chooseImageText: {
    color: 'white',
    textAlign: 'center',
    padding: 10,
    borderColor: 'pink',
    borderWidth: 0.9,
    borderRadius: 5,
  },
  inputContainer: {
    marginTop: 30,
    gap: 25,
    width: '90%',
    alignSelf: 'center',
  },
  textInput: {
    borderColor: 'pink',
    borderWidth: 0.9,
    borderRadius: 5,
    padding: 10,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    width: '90%',
    alignSelf: 'center',
  },
  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelBtn: {
    backgroundColor: 'blue',
  },
  saveBtn: {
    backgroundColor: 'red',
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
