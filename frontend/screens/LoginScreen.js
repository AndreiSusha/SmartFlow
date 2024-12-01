
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';
import { useAuthStore } from '../stores/authStore';
import Button from '@components/Button';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    // Login logic here
    console.log('Logging in with:', email, password);
    // Redirect to main screen
    login();
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
        placeholderTextColor="#D9D9D9"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#D9D9D9"
      />
      {/* Forgot Password link */}
      <TouchableOpacity
        style={styles.forgotPasswordContainer}
        onPress={handleForgotPassword}
      >
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </TouchableOpacity>
      {/* Login button */}
      <Button onPress={handleLogin}>Login</Button>
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
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 32,

  },
  title: {
    fontSize: 30,
    fontFamily: 'Urbanist-Bold',
    color: '#53B6C7',
    marginBottom: 28,
  },
  input: {
    height: 56,
    width: '100%',
    borderColor: '#53B6C7',
    borderWidth: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: '#53B6C7',
    borderRadius: 8,
    paddingHorizontal: 18,
    marginBottom: 13,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    fontFamily: 'Urbanist-Regular',
  },

  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 13,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#8391A1',
    fontFamily: 'Urbanist-Regular',
  },


});
