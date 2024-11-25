import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../Entryroute';

// Sample notifications with a single post image and user image
const notifications = [
  {
    id: 1,
    type: 'follow',
    username: 'vishal Rajput',
    time: 'Yesterday',
    imageUri:
      'https://res.cloudinary.com/manish19/image/upload/v1725781643/jjlvg8e1yww6cacpl25s.jpg',
    postImageUri:
      'https://res.cloudinary.com/manish19/image/upload/v1725781643/jjlvg8e1yww6cacpl25s.jpg',
  },
  {
    id: 2,
    type: 'like',
    username: 'Nilesh keer',
    time: '2 days ago',
    imageUri:
      'https://res.cloudinary.com/manish19/image/upload/v1725781643/jjlvg8e1yww6cacpl25s.jpg',
    postImageUri:
      'https://res.cloudinary.com/manish19/image/upload/v1725781643/jjlvg8e1yww6cacpl25s.jpg',
  },
  {
    id: 3,
    type: 'follow',
    username: 'prakhar rajput',
    time: '3 days ago',
    imageUri:
      'https://res.cloudinary.com/manish19/image/upload/v1725781643/jjlvg8e1yww6cacpl25s.jpg',
    postImageUri:
      'https://res.cloudinary.com/manish19/image/upload/v1725781643/jjlvg8e1yww6cacpl25s.jpg',
  },
  {
    id: 4,
    type: 'like',
    username: 'Manish keer',
    time: '4 days ago',
    imageUri:
      'https://res.cloudinary.com/manish19/image/upload/v1725781643/jjlvg8e1yww6cacpl25s.jpg',
    postImageUri:
      'https://res.cloudinary.com/manish19/image/upload/v1725781643/jjlvg8e1yww6cacpl25s.jpg',
  },
  // Add more notifications as needed
];

export default function Notification() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          }}
          onPress={() => [navigation.navigate('Home')]}>
          <AntDesignIcons name="arrowleft" color="#FFFFFF" size={30} />
        </TouchableOpacity>
          <Text style={styles.headerText}>Notifications</Text>
      </View>

      <ScrollView style={styles.notificationsContainer}>
        {/* Notifications List */}
        {notifications.map(notification => (
          <View style={styles.notificationItem} key={notification.id}>
            <Image
              source={{uri: notification.imageUri}}
              style={styles.userImage}
            />
            <View style={styles.notificationDetails}>
              <Text style={styles.notificationText}>
                <Text style={styles.username}>{notification.username}</Text>{' '}
                {notification.type === 'follow'
                  ? 'started following you'
                  : 'liked your post'}
              </Text>
              <Text style={styles.timeText}>{notification.time}</Text>
              {notification.type === 'like' && (
                <View style={styles.postImageContainer}>
                  <Image
                    source={{uri: notification.postImageUri}}
                    style={styles.postImage}
                  />
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background for the container
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    // borderWidth: 2,
    // borderColor: 'gold',
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#FFFFFF', // White color for the header text
  },
  notificationsContainer: {
    // paddingHorizontal: 20,
    // borderWidth:2,
    // borderColor:"gold"
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: 10,
    // backgroundColor: "#333333", // Dark gray for the notification item
    borderRadius: 10,
    padding: 10,
    // borderWidth:2,
    // borderColor:"red"
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  notificationDetails: {
    flex: 1,
    // borderWidth:2,
    // borderColor: "#FFFFFF",
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
  },
  notificationText: {
    color: '#FFFFFF', // White color for notification text
  },
  username: {
    fontWeight: 'bold',
  },
  timeText: {
    color: '#AAAAAA', // Light gray for the time text
    fontSize: 12,
  },
  postImageContainer: {
    marginTop: 10,
  },
  postImage: {
    width: 50, // Smaller width for post images
    height: 50, // Smaller height for post images
    // borderRadius: 10,
    resizeMode: 'cover',
    marginRight: 10, // Spacing between images
  },
});
