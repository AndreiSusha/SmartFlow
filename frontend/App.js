import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';

import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MyTabs from './navigation/TabNavigator';
import UserManagement from './screens/UserManagemet';
import UserDetails from './screens/UserDetails';
const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts(customFonts);

  const { isAuthenticated } = useAuthStore();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#53B6C7" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Main"
          component={MyTabs}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="UserManagement"
          component={UserManagement}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="UserDetails"
          component={UserDetails}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
