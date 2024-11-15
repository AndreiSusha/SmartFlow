import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>LoginScreen</Text>
      <Button
        title="Home"
        onPress={() => navigation.navigate('Main')} 
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
