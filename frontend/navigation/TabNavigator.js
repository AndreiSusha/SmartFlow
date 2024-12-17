import React, { useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ReportsScreen from "../screens/Reports/ReportsScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import Test from "../screens/test";
import ReportsNavigator from "./ReportsNavigator";
import SettingsNavigator from "./SettingsNavigator";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Reports") {
            iconName = focused ? "clipboard" : "clipboard-outline";
          } else if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#53B6C7",
        tabBarInactiveTintColor: "#000000",
        headerShown: false,
        tabBarStyle: {
          display: route.name === "AddNewUser" ? "none" : "flex",
        },
      })}
    >
      <Tab.Screen
        name="Reports"
        component={ReportsNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: true, headerTintColor: "#53B6C7" }}
      />

      <Tab.Screen name="Settings" component={SettingsNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
