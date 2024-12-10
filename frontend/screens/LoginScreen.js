import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../stores/authStore";
import Button from "@components/Button";
import Input from "@components/Input";
import { ActivityIndicator } from "react-native"; // Add this import statement

const LoginScreen = () => {
  const [email, setEmail] = useState("shreyak@gmail.com");
  const [password, setPassword] = useState("shreya");
  const navigation = useNavigation();
  const { loading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in both fields");
      return;
    }

    try {
      await useAuthStore.getState().login(email, password);
      navigation.navigate("Home");
    } catch (error) {
      console.error(error);
      alert("Login failed. Please try again.");
    }
  };
  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back! Glad to see you, Again</Text>
      <View style={{ gap: 16, width: "100%" }}>
        <Input
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          label={"Email"}
          onUpdateValue={(text) => setEmail(text)}
        />
        <Input
          placeholder={"Enter your password"}
          value={password}
          label={"Password"}
          onUpdateValue={(text) => setPassword(text)}
          secureTextEntry
        />
      </View>

      {/* Forgot Password link */}
      <TouchableOpacity
        style={styles.forgotPasswordContainer}
        onPress={handleForgotPassword}
      >
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </TouchableOpacity>
      {/* Login button */}
      <Button onPress={handleLogin}>
        {loading ? <ActivityIndicator color="#fff" /> : "Login"}
      </Button>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 62,
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 26,
  },
  title: {
    fontSize: 30,
    fontFamily: "Urbanist-Bold",
    color: "#53B6C7",
    marginBottom: 28,
  },
  input: {
    height: 56,
    width: "100%",
    borderColor: "#53B6C7",
    borderWidth: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: "#53B6C7",
    borderRadius: 8,
    paddingHorizontal: 18,
    marginBottom: 13,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    fontFamily: "Urbanist-Regular",
  },

  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 13,
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#8391A1",
    fontFamily: "Urbanist-Regular",
  },
});
