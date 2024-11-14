import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
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
      {/* Logo Image */}
      <View style={styles.overlay}>
        <Image
          source={require('../assets/24apps_logo.png')}
          style={styles.logo}
        />
      </View>
      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonTextRegister}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonLogin}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonTextLogin}>Login</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '45%',
  },
  logo: {
    width: 172,
    height: 93,
    resizeMode: 'contain',
  },
  buttons: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    gap: 20,
  },
  buttonRegister: {
    backgroundColor: '#53B6C7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '90%',
    // Shadow for Android
    elevation: 10,
    // Shadow for iOS
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  buttonLogin: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '90%',
    borderWidth: 1.5,
    borderColor: '#53B6C7',
  },
  buttonTextRegister: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonTextLogin: {
    color: '#53B6C7',
    fontSize: 16,
    textAlign: 'center',
  },
});
