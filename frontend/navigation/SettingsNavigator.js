import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "../screens/SettingsScreen";
import AssetManagement from "../screens/AssetManagement/AssetManagement";
import { Platform } from "react-native";
import ChooseAssetType from "../screens/AssetManagement/AddAsset/ChooseAssetType";

const Stack = createStackNavigator();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "#53B6C7",
        headerBackTitle: "",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerTitle: "Settings",
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="AssetManagement"
        component={AssetManagement}
        options={{
          headerStyle: {
            backgroundColor: "transparent",
            elevation: Platform.OS === "android" ? 0 : undefined,
          },
          title: "Asset Management",
        }}
      />
      <Stack.Screen
        name="ChooseAssetType"
        component={ChooseAssetType}
        options={{
          headerStyle: {
            backgroundColor: "transparent",
            elevation: Platform.OS === "android" ? 0 : undefined,
          },
          title: "Choose Asset Type",
          headerBackTitle: "",
        }}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;