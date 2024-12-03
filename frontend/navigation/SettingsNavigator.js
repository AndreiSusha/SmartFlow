
import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "../screens/SettingsScreen";
import UserManagement from "../screens/UserManagmnet/UserManagemet";
import UserDetails from "../screens/UserManagmnet/UserDetails";
import AssetManagement from "../screens/AssetManagement/AssetManagement";
import { Platform } from "react-native";
import ChooseAssetType from "../screens/AssetManagement/AddAsset/ChooseAssetType";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@components/bottomsheets/BottomSheet";

const Stack = createStackNavigator();

const SettingsNavigator = () => {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

  const handleOptionSelect = (option) => {
    console.log("Selected option:", option);
    setBottomSheetVisible(false); // Close the bottom sheet after selection.
  };
  
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
          title: "User Management",
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
          title: "User Details",
          headerRight: () => (
            <>
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => setBottomSheetVisible(true)}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color="#53B6C7" marginRight={10} />
            </TouchableOpacity>

              <BottomSheet
              visible={isBottomSheetVisible}
              onClose={() => setBottomSheetVisible(false)}
              options={[
                { label: "Edit User", value: "edit", },
                { label: "Delete User", value: "delete" },
              ]}
              onSelect={handleOptionSelect}
              />
              </>
          ),
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
