import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Navbar from './Navbar';
import Story from './Story';
import Feed from './Feed';
import Footer from '../Footer';
import AntDesign from 'react-native-vector-icons/AntDesign';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <Navbar />
        <Story />
        <Feed />
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollView: {
    paddingBottom: 70, // Add padding to avoid content being hidden behind footer
  },
});

export default HomeScreen;
