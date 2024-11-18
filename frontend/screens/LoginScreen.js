import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const login = () => {
    // Login logic here
    console.log('Logging in with:', email, password);
    // Redirect to main screen
    navigation.navigate('Main');
  };
  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Logic to handle forgot password
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back! Glad to see you, Again</Text>
      {/* Input block */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#8391A1"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#8391A1"
      />
      {/* Forgot Password link */}
      <TouchableOpacity
        style={styles.forgotPasswordContainer}
        onPress={handleForgotPassword}
      >
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </TouchableOpacity>
      {/* Login button */}
      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FAF9F9',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#53B6C7',
    fontFamily: 'Urbanist',
    marginBottom: 28,
  },
  input: {
    height: 56,
    width: 333,
    borderColor: '#53B6C7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 18,
    marginBottom: 13,
    fontFamily: 'Urbanist',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 13,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#8391A1',
    fontFamily: 'Urbanist',
  },
  button: {
    height: 56,
    width: 333,
    backgroundColor: '#53B6C7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'semibold',
    fontFamily: 'Urbanist',
  },
});
