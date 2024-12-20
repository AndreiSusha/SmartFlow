import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "../screens/SettingsScreen";
import UserManagement from "../screens/UserManagmnet/UserManagemet";
import UserDetails from "../screens/UserManagmnet/UserDetails";
import AssetManagement from "../screens/AssetManagement/AssetManagement";
import ChangeEmail from "../screens/ChangeEmail";
import ChangePassword from "../screens/ChangePassword";
import { Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@components/bottomsheets/BottomSheet";
import EditUser from "../screens/UserManagmnet/EditUser";
import { useNavigation } from "@react-navigation/native";
import ConfirmationModal from "@components/ConfirmationModal";
import { useUserContext } from "../UserContext";
import axios from "axios";
import AssetDetails from "../screens/AssetManagement/AssetDetails";
import EditAsset from "../screens/AssetManagement/EditAsset";
import AddNewUser from "../screens/AssetManagement/AddNewUser";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";

const Stack = createStackNavigator();

const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;

const SettingsNavigator = () => {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const { removeUser } = useUserContext();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToastStore();

  const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleDeleteUser = async () => {
    setIsLoading(true);
    setModalVisible(false);

    try {
      if (!userIdToDelete) {
        showToast(
          "Deletion Failed",
          "User ID is missing. Cannot delete user.",
          "error",
          3000
        );
        setIsLoading(false);
        return;
      }

      const response = await axios.delete(`${API_IP}user/${userIdToDelete}`);

      if (response.status === 200) {
        removeUser(userIdToDelete);
        showToast("Success", "User deleted successfully.", "success", 3000);
        // Reset the navigation stack to include SettingsScreen and UserManagement
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Settings",
              state: {
                index: 1,
                routes: [
                  { name: "SettingsScreen" }, // The base screen in the nested stack
                  { name: "UserManagement" }, // The active screen
                ],
              },
            },
          ],
        });
      } else {
        showToast(
          "Deletion Failed",
          `Failed to delete user. Status: ${response.status}`,
          "error",
          3000
        );
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast(
        "Deletion Failed",
        "Failed to delete user. Check your connection.",
        "error",
        3000
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
          name="EditUser"
          component={EditUser}
          options={{
            headerStyle: {
              backgroundColor: "transparent",
              elevation: Platform.OS === "android" ? 0 : undefined,
            },
            title: "Edit User",
          }}
        />

        <Stack.Screen
          name="UserDetails"
          component={UserDetails}
          initialParams={{
            isModalVisible,
            setModalVisible,
          }} // Pass modal state and setter to UserDetails
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: "transparent",
              elevation: Platform.OS === "android" ? 0 : undefined,
            },
            title: "User Details",
            headerRight: () => (
              <>
                <TouchableOpacity
                  style={{ marginRight: 20 }}
                  onPress={() => setBottomSheetVisible(true)}
                >
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={24}
                    color="#53B6C7"
                  />
                </TouchableOpacity>

                {/* BottomSheet Component */}
                <BottomSheet
                  visible={isBottomSheetVisible}
                  onClose={() => setBottomSheetVisible(false)}
                  options={[
                    { label: "Edit User", value: "edit" },
                    { label: "Delete User", value: "delete" },
                  ]}
                  // onSelect={handleOptionSelect} // Use the function to handle option selection
                  onSelect={(option) => {
                    console.log("Selected option:", option);
                    if (option.value === "edit") {
                      setBottomSheetVisible(false);
                      navigation.navigate("EditUser");
                    } else if (option.value === "delete") {
                      setBottomSheetVisible(false);
                      const userId = navigation
                        .getState()
                        .routes.find((r) => r.name === "UserDetails")
                        ?.params?.userId;
                      console.log("Retrieved userId:", userId); // Debug log
                      if (userId) {
                        setUserIdToDelete(userId);
                        setModalVisible(true);
                        console.log("Modal set to visible"); // Debug log
                      } else {
                        console.error("User ID is missing from route params.");
                        showToast(
                          "Deletion Failed",
                          "User ID is missing. Cannot delete.",
                          "error",
                          3000
                        );
                      }
                    }
                  }}
                  
                />
              </>
            ),
          })}
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
        <Stack.Screen
          name="EditAsset"
          component={EditAsset}
          options={{
            headerStyle: {
              backgroundColor: "transparent",
              elevation: Platform.OS === "android" ? 0 : undefined,
            },
            title: "Edit Asset",
          }}
        />
        <Stack.Screen
          name="AddNewUser"
          component={AddNewUser}
          options={{
            headerStyle: {
              backgroundColor: "transparent",
              elevation: Platform.OS === "android" ? 0 : undefined,
            },
            title: "Add new user",
          }}
        />

<Stack.Screen
          name="ChangeEmail"
          component={ChangeEmail}
          options={{
            headerStyle: {
              backgroundColor: "transparent",
              elevation: Platform.OS === "android" ? 0 : undefined,
            },
            title: "Change Email",
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{
            headerStyle: {
              backgroundColor: "transparent",
              elevation: Platform.OS === "android" ? 0 : undefined,
            },
            title: "Change Password",
          }}
        />

      </Stack.Navigator>

      {/* Render the ConfirmationModal outside of Stack.Navigator */}
      <ConfirmationModal
        visible={isModalVisible}
        title="Confirm Removal"
        message="Are you sure you want to remove this user? This action cannot be undone."
        onConfirm={handleDeleteUser}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
};

export default SettingsNavigator;
