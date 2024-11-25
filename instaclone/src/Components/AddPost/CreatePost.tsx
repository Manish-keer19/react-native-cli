import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {PostServiceInstance} from '../../services/postServie';
import {UserServiceInstance} from '../../services/Userservice';
import {setUser} from '../../features/user/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../Entryroute';
import {useForm, Controller} from 'react-hook-form';

interface FormData {
  caption: string;
  location: string;
}

export default function CreatePost({route}: any) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>();
  const {file1} = route.params;
  console.log('file1 is ', file1);
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [image1, setImage1] = useState<string | null>(file1.uri);
  const [file, setFile] = useState<object | null>(file1);
  const [caption, setCaption] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // New state to track button status

  const token = useSelector((state: any) => state.User.token);
  const user = useSelector((state: any) => state.User.user);
  console.log('token i createPost', token);
  // const fetchuserData = async () => {
  //   const data = {
  //     email: user.email,
  //   };
  //   try {
  //     const res = await UserServiceInstance.getUserData(data);
  //     console.log("res in profile section", res);
  //     if (res.userdata) {
  //       console.log("res in profile section", res.userdata);
  //       dispatch(setUser(res.userdata));
  //       return true;
  //     }
  //   } catch (error) {
  //     console.log("could not get the userdata", error);
  //     return false;
  //   }
  // };

  const onsubmit = async (data: any) => {
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true); // Disable the button

    const formData = new FormData();
    formData.append('caption', data.caption);
    formData.append('location', data.location);
    formData.append('token', token);

    // Ensure file1 is properly structured
    if (file1 && file1.uri) {
      const fileToUpload = {
        uri: file1.uri, // URI of the image
        type: file1.mediaType,
        name: Date.now().toString(), // Filename
      };

      formData.append('image', fileToUpload); // Append the image correctly
      console.log('formData is ', formData);
    } else {
      console.error('Image file is not defined properly.');
    }

    try {
      const res = await PostServiceInstance.createPost(formData);
      console.log('res is ', res);
      if (res) {
        console.log('post created');
        dispatch(setUser(res.userdata));
        navigation.navigate('Profile');
      }
    } catch (error) {
      console.log('error creating post', error);
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.image1Picker}>
        {image1 ? (
          <Image source={{uri: image1}} style={styles.selectedImage1} />
        ) : (
          <Text style={styles.pickImage1Text}>Select an Image1</Text>
        )}
      </TouchableOpacity>

      <Controller
        name="caption"
        control={control}
        rules={{
          required: 'Caption is required',
          maxLength: {
            value: 100,
            message: 'Caption should be less than 100 characters',
          },
          minLength: {
            value: 3,
            message: 'Caption should be more than 3 characters',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            placeholder="Write a caption..."
            placeholderTextColor="#888"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
          />
        )}
      />
      {errors.caption && (
        <Text style={{color: 'red'}}>{errors.caption.message}</Text>
      )}

      {/* Location Input */}
      <Controller
        name="location"
        control={control}
        rules={{
          required: 'Location is required',
          minLength: {
            value: 3,
            message: 'Location should be more than 3 characters',
          },
          maxLength: {
            value: 30,
            message: 'Location should be less than 30 characters',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            placeholder="Add location"
            placeholderTextColor="#888"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.location && (
        <Text style={{color: 'red'}}>{errors.location.message}</Text>
      )}

      {/* Share Button */}
      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleSubmit(onsubmit)}
        disabled={isSubmitting} // Disable button if submitting
      >
        <Text style={styles.shareButtonText}>
          {isSubmitting ? 'Sharing...' : 'Share'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#000', // Set background to black
    paddingTop: 50,
  },
  image1Picker: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e2e2e', // Dark background for image1 picker
    height: 300,
    marginBottom: 20,
  },
  selectedImage1: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pickImage1Text: {
    color: '#888', // Light text for "Select an Image1"
    fontSize: 18,
  },
  input: {
    borderColor: '#555', // Dark border color for inputs
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    color: '#fff', // White text for inputs
  },
  shareButton: {
    backgroundColor: '#3897f0', // Instagram blue for share button
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  shareButtonText: {
    color: '#fff', // White text for share button
    fontSize: 16,
    fontWeight: 'bold',
  },
});
