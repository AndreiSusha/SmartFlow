import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "../screens/SettingsScreen";
import UserManagement from "../screens/UserManagemet";
import UserDetails from "../screens/UserDetails";
import AssetManagement from "../screens/AssetManagement/AssetManagement";
import { Platform, TouchableOpacity } from "react-native";
import ChooseAssetType from "../screens/AssetManagement/AddAsset/ChooseAssetType";
import EnterAssetDetails from "../screens/AssetManagement/AddAsset/EnterAssetDetails";
import AssetDetails from "../screens/AssetManagement/AssetDetails";

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
        name="UserManagement"
        component={UserManagement}
        options={{
          headerStyle: {
            backgroundColor: "transparent",
            elevation: Platform.OS === "android" ? 0 : undefined,
          },
          title: "Asset Management",
        }}
      />
      <Stack.Screen
        name="UserDetails"
        component={UserDetails}
        options={{
          headerStyle: {
            backgroundColor: "transparent",
            elevation: Platform.OS === "android" ? 0 : undefined,
          },
          title: "Asset Management",
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
        name="AssetDetails"
        component={AssetDetails}
        options={{
          headerStyle: {
            backgroundColor: "transparent",
            elevation: Platform.OS === "android" ? 0 : undefined,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
