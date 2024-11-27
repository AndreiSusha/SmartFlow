import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

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
          uri: 'https://cdn.pixabay.com/video/2022/05/29/118546-715412131_large.mp4',
        }}
        resizeMode="cover"
        shouldPlay
        isLooping
      />
      {/* Logo Image */}
      <View style={styles.overlay}>
        <Image
          source={require('../assets/images/24apps_logo.png')}
          style={styles.logo}
        />
      </View>
      {/* Button */}
      <View style={styles.button}>
        <TouchableOpacity style={styles.buttonLogin}>
          <LinearGradient
            colors={['#53B6C7', 'transparent']}
            start={[0, 0]}
            end={[0, 1]}
            style={[StyleSheet.absoluteFill, { borderRadius: 8 }]}
          />
          <Text
            style={styles.buttonTextLogin}
            onPress={() => navigation.navigate('Login')}
          >
            Login
          </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 142,
    height: 53,
    resizeMode: 'contain',
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    gap: 20,
  },
  buttonLogin: {
    backgroundColor: '#53B6C7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '90%',
    // Shadow for Android
    elevation: 10,
    // Shadow for iOS
    shadowColor: '#53B6C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  buttonTextLogin: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
