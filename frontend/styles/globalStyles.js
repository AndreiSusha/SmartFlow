import { StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

export const useGlobalStyles = () => {
  const [fontsLoaded] = useFonts({
    'Urbanist-Regular': require('./assets/fonts/Urbanist-Regular.ttf'),
    'Urbanist-Bold': require('./assets/fonts/Urbanist-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return StyleSheet.create({
    text: {
      fontFamily: 'Urbanist-Regular',
    },
    boldText: {
      fontFamily: 'Urbanist-Bold',
    },
  });
};
