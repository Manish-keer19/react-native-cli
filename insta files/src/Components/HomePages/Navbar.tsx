import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation
import {NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../../Entryroute';
import AntDesign from 'react-native-vector-icons/AntDesign';
export default function Navbar() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Get the navigation object

  return (
    <View style={styles.navbar}>
      <View
        style={{
          height: 50,
          width: 140,
          borderRadius: 10,
          marginLeft: 10,
        }}>
        <Image
          style={{resizeMode: 'contain', width: '100%', height: '100%'}}
          source={{
            uri: 'https://imgs.search.brave.com/AOZMwK1wRINJH7S9_po0yGAh21Gv7ga7NAcpyc8o0WQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA3LzMzLzkxLzM2/LzM2MF9GXzczMzkx/MzY4OF9SeUI5QWRS/Q3J4Tk1WdksxMTU0/UTNPZHc0UFFxZEJ1/Wi5qcGc',
          }}
        />
        {/* <AntDesign name="instagram" size={45} color={"white"} /> */}
      </View>

      <View style={{flexDirection: 'row', gap: 25, marginRight: 20}}>
        {/* Like Icon */}
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Icon name="hearto" size={30} color={'white'} style={styles.icon} />
        </TouchableOpacity>

        {/* Message Icon */}
        <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
          <Icon name="message1" size={30} color={'white'} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    // borderWidth: 2,
    // borderColor: 'gold',
    flexDirection: 'row',
    paddingTop: 15,
    justifyContent: 'space-between',
    width: '100%',
    
  },
  icon: {},
});
