import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const video = React.useRef(null);
  return (
    <View style={styles.container}>
      {/* Video player */}
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: 'https://cdn.pixabay.com/video/2024/10/13/236189_large.mp4',
        }}
        resizeMode="cover"
        shouldPlay
        isLooping
      />
      {/* Text */}
      <View style={styles.overlay}>
        <Text style={styles.text}>Welcome to Smart Flow!</Text>
      </View>
      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(0, 0, 0, 0.0)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '25%',
  },
  text: {
    color: 'white',
    fontSize: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: 100,
    // Shadow for Android
    elevation: 10,
    // Shadow for iOS
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
});
