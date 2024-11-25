import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather'; // Feather
import {UserServiceInstance} from '../../services/Userservice';
import {useSelector} from 'react-redux';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../Entryroute';

export default function SearchComponent() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const token = useSelector((state: any) => state.User.token);
  const [searchText, setSearchText] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [crossShow, setCrossShow] = useState<boolean>(false);

  const handleSearch = async (text: string) => {
    setSearchText(text);
    setCrossShow(true);

    if (text === '') {
      setCrossShow(false);
    }
    const data = {searchTerm: text, token};

    try {
      const res = await UserServiceInstance.serchUser(data);

      if (res && res.users) {
        const results = res.users;
        const filtered = results.filter((user: any) =>
          user.username.toLowerCase().includes(text.toLowerCase()),
        );
        console.log('filtered', filtered);
        setFilteredResults(filtered);
      }
    } catch (error) {
      console.log('Could not search the user', error);
      Alert.alert('Could not search the user');
    }
  };

  const renderItem = ({item}: any) => (
    <TouchableOpacity
      style={styles.userContainer}
      onPress={() => {
        console.log('item in renderItem is ', item);
        navigation.navigate('UserProfile', {user: item});
      }}>
      <Image source={{uri: item.profilePic}} style={styles.userImage} />
      <View>
        <Text style={styles.username}>{item?.username}</Text>
        <Text style={styles.fullname}>{item?.profile?.name}</Text>
        <Text style={styles.followerInfo}>
          Followed by Vishal Rajput and 100+ others
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={{
            // borderWidth: 2,
            // borderColor: "yellow",
            paddingVertical: 10,
          }}
          onPress={() => navigation.goBack()}>
          <AntDesignIcons name="arrowleft" color="white" size={30} />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <Feather name="search" size={20} color="#B5651D" />

          <TextInput
            style={styles.searchInput}
            placeholder="Search by username..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={handleSearch}
          />
          {crossShow && (
            <EntypoIcons
              name="cross"
              color="white"
              size={25}
              onPress={() => {
                setSearchText('');
                setFilteredResults([]);
              }}
            />
          )}
        </View>
      </View>

      <FlatList
        data={filteredResults}
        keyExtractor={(item: any) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.noResultsText}>No results found</Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    paddingHorizontal: 10,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  searchInput: {
    color: 'white',
    marginLeft: 10,
    flex: 1,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    // borderBottomColor: "#444",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  username: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  fullname: {
    fontSize: 16,
    color: 'white',
  },
  followerInfo: {
    color: '#888',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  listContent: {
    flexGrow: 1,
    marginTop: 20,
  },
});
