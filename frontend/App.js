import React,{useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
import AuthNavigator from "./navigation/AuthNavigator";
import customFonts from "./config/fonts";
import { useAuthStore } from "./stores/authStore";
import ToastNotification from "./components/ToastNotification";

import { UserProvider } from "./UserContext";
import TabNavigator from "./navigation/TabNavigator";

import AppNavigator from "./navigation/AppNavigator";



const App = () => {
  const [fontsLoaded] = useFonts(customFonts);

  const { isAuthenticated, loadAuthState  } = useAuthStore();

  useEffect(() => {
    // Load authentication state when app starts
    loadAuthState();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#53B6C7" />
      </View>
    );
  }
  return (
    <>

      <UserProvider>
        <NavigationContainer>
          {isAuthenticated ? <TabNavigator /> : <AuthNavigator />}
        </NavigationContainer>
        <ToastNotification />
      </UserProvider>

    </>
  );
};

export default App;
