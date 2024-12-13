import { View, Text, Platform } from "react-native";
import React from "react";
import ChooseAssetType from "../screens/AssetManagement/AddAsset/ChooseAssetType";
import AssetTitle from "../screens/AssetManagement/AddAsset/AssetTitle";
import { createStackNavigator } from "@react-navigation/stack";
import AssetCountry from "../screens/AssetManagement/AddAsset/AssetCountry";
import AssetAddressDetails from "../screens/AssetManagement/AddAsset/AssetAddressDetails";
import AssetAdditionalInfo from "../screens/AssetManagement/AddAsset/AssetAdditionalInfo";
import { AssetDataProvider } from "../util/addAsset-context";
import LocationChoiceScreen from "../screens/AssetManagement/AddAsset/LocationChoiceScreen";
import SelectExistingLocationScreen from "../screens/AssetManagement/AddAsset/SelectExistingLocationScreen";

const Stack = createStackNavigator();

const AddAssetNavigator = () => {
  return (
    <AssetDataProvider>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: "#53B6C7",
          headerBackTitle: "",
          headerTitleAlign: "center",
        }}
      >
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
        <Stack.Screen
          name="AssetTitle"
          component={AssetTitle}
          options={{
            headerStyle: {
              backgroundColor: "transparent",
              elevation: Platform.OS === "android" ? 0 : undefined,
            },
            title: "Enter Asset Title",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="LocationChoice"
          component={LocationChoiceScreen}
          options={{
            headerStyle: {
              backgroundColor: "transparent",
              elevation: Platform.OS === "android" ? 0 : undefined,
            },
            title: "Choose Location",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="SelectExistingLocation"
          component={SelectExistingLocationScreen}
          options={{
            headerStyle: {
              backgroundColor: "transparent",
              elevation: Platform.OS === "android" ? 0 : undefined,
            },
            title: "Select Location",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="AssetCountry"
          component={AssetCountry}
          options={{
            headerStyle: {
              backgroundColor: "transparent",
              elevation: Platform.OS === "android" ? 0 : undefined,
            },
            title: "Enter Asset Country",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="AssetAddressDetails"
          component={AssetAddressDetails}
          options={{
            headerStyle: {
              backgroundColor: "transparent",
              elevation: Platform.OS === "android" ? 0 : undefined,
            },
            title: "Enter Asset Address Details",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="AssetAdditionalInfo"
          component={AssetAdditionalInfo}
          options={{
            headerStyle: {
              backgroundColor: "transparent",
              elevation: Platform.OS === "android" ? 0 : undefined,
            },
            title: "Enter Additional Information",
            headerBackTitle: "",
          }}
        />
      </Stack.Navigator>
    </AssetDataProvider>
  );
};

export default AddAssetNavigator;
