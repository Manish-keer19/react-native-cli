import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Slider from '@react-native-community/slider';
import RNFS, {ReadDirItem} from 'react-native-fs';
import Sound from 'react-native-sound';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import image from '../assets/images/manish.jpg';

// Music App component
export const MusicApp: React.FC = () => {
  const [musicFiles, setMusicFiles] = useState<ReadDirItem[]>([]);
  console.log("musicFiles is ", musicFiles);
  const [currentSound, setCurrentSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(1); // Avoid division by 0

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async (): Promise<void> => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      if (
        granted['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        fetchMusicFiles();
      } else {
        console.log('Storage permissions denied');
      }
    } else {
      fetchMusicFiles(); // Permissions not required on iOS
    }
  };

  const fetchMusicFiles = async (): Promise<void> => {
    const musicExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
    const storagePath = RNFS.ExternalStorageDirectoryPath;

    const recursiveSearch = async (path: string): Promise<ReadDirItem[]> => {
      const results: ReadDirItem[] = [];
      try {
        console.log(`Scanning directory: ${path}`);
        const files = await RNFS.readDir(path);
        for (const file of files) {
          if (file.isFile()) {
            const fileExtension = file.name
              .slice(file.name.lastIndexOf('.'))
              .toLowerCase();
            if (musicExtensions.includes(fileExtension)) {
              results.push(file);
            }
          } else if (file.isDirectory()) {
            const subResults = await recursiveSearch(file.path);
            results.push(...subResults);
          }
        }
      } catch (error) {
        console.warn(`Error reading directory ${path}:`, error);
      }
      return results;
    };

    try {
      const musicFiles = await recursiveSearch(storagePath);
      setMusicFiles(musicFiles);
      console.log('Music Files:', musicFiles);
    } catch (error) {
      console.error('Error fetching music files:', error);
    }
  };

  // Stop the current sound if any
  const stopCurrentSound = () => {
    if (currentSound) {
      currentSound.stop(() => {
        currentSound.release();
      });
    }
  };

  const playSound = (index: number) => {
    // Stop the current track if it's playing
    stopCurrentSound();

    const file = musicFiles[index];
    const sound = new Sound(file.path, '', error => {
      if (error) {
        console.log('Error loading sound:', error);
        return;
      }
      setDurationMillis(sound.getDuration());
      sound.play(success => {
        if (!success) {
          console.log('Playback failed due to audio decoding errors');
        }
        sound.release();
      });
    });

    setCurrentSound(sound);
    setCurrentTrackIndex(index);
    setIsPlaying(true);

    sound.getCurrentTime(seconds => {
      setPositionMillis(seconds * 1000);
    });
  };

  const pauseSound = () => {
    if (currentSound) {
      currentSound.pause();
      setIsPlaying(false);
    }
  };

  const seekTrack = (value: number) => {
    if (currentSound) {
      currentSound.setCurrentTime(value / 1000);
      setPositionMillis(value);
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % musicFiles.length;
    playSound(nextIndex);
  };

  const previousTrack = () => {
    const previousIndex =
      (currentTrackIndex - 1 + musicFiles.length) % musicFiles.length;
    playSound(previousIndex);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      {musicFiles.length > 0 && (
        <>
          {/* Album Artwork and Song Title Section */}
          <Image source={image} style={styles.albumArt} resizeMode="cover" />
          <Text style={styles.songTitle}>
            {musicFiles[currentTrackIndex].name}
          </Text>

          {/* Seek Bar */}
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={durationMillis || 1} // Avoid division by zero
            value={positionMillis}
            onSlidingComplete={seekTrack} // Seek to the new position
            minimumTrackTintColor="#FF6F61"
            maximumTrackTintColor="#FFFFFF"
            thumbTintColor="#FF6F61"
          />

          {/* Time Display */}
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {formatTime(positionMillis / 1000)}
            </Text>
            <Text style={styles.timeText}>
              {formatTime((durationMillis - positionMillis) / 1000)}
            </Text>
          </View>

          {/* Playback Controls */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={previousTrack}>
              <MaterialIcons name="skip-previous" size={50} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={
                isPlaying ? pauseSound : () => playSound(currentTrackIndex)
              }>
              <MaterialIcons
                name={isPlaying ? 'pause' : 'play-arrow'}
                size={50}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={nextTrack}>
              <MaterialIcons name="skip-next" size={50} color="white" />
            </TouchableOpacity>
          </View>

          {/* Display all tracks in a list */}
          <FlatList
            data={musicFiles}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => playSound(index)}
                style={styles.trackItem}>
                <Image source={image} style={styles.trackImage} />
                <Text style={styles.trackTitle}>{item.name}</Text>
              </TouchableOpacity>
            )}
            style={styles.trackList}
          />
        </>
      )}
    </View>
  );
};

// Styles for the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282C34',
    padding: 20,
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
    borderColor: '#FF6F61',
    borderWidth: 2,
  },
  songTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    textTransform: 'capitalize',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
    // backgroundColor:"blue"
  },
  slider: {
    width: '100%',
    height: 30,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  timeText: {
    color: '#FFF',
    fontSize: 16,
  },
  trackList: {
    marginTop: 20,
    width: '100%',
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
    marginBottom: 10,
    borderRadius: 10,
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  trackTitle: {
    color: '#FFF',
    fontSize: 16,
    flexShrink: 1,
  },
});

export default MusicApp;
