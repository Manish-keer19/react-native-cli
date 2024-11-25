import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../Entryroute';
// import {images} from '../Utils/imagedata';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';

const Footer: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Type-safe navigation

  const user = useSelector((state: any) => state.User.user);

  if (!user) {
    return null;
  }

  return (
    <View style={styles.footer}>
      {/* Home Icon - Navigates to Home Screen */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home-outline" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Search')}>
        <Feather name="search" size={30} color="white" />
      </TouchableOpacity>

      {/* Add Icon - Navigates to Add Post Screen */}
      <TouchableOpacity onPress={() => navigation.navigate('AddPost')}>
        <Ionicons name="add-circle-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* Play Icon - Navigates to Video or Reels Screen */}
      <TouchableOpacity>
        <Ionicons name="play-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* Profile Icon - Navigates to Profile Screen */}
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <View style={styles.imgContainer}>
          <Image style={styles.imgstyle} source={{uri: user.profilePic}} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'black',
    borderTopWidth: 1,
    borderTopColor: 'pink',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  imgContainer: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgstyle: {width: '100%', height: '100%', borderRadius: 50},
});

export default Footer;
