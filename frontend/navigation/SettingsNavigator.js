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
  import EditUser from "../screens/UserManagmnet/EditUser";
  import { useNavigation } from '@react-navigation/native';
  import ConfirmationModal from "@components/ConfirmationModal";
  import { useUserContext } from "../UserContext";
  

  const Stack = createStackNavigator();

  const SettingsNavigator = () => {
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const { removeUser } = useUserContext();
    const navigation = useNavigation();

    const handleDeleteUser = async () => {
      setModalVisible(false); // Close modal
      if (userIdToDelete) {
        try {
          // Make the DELETE API call to your backend with the user ID
          const response = await axios.delete(`https://192.168.0.103:3000/user/${userIdToDelete}`);
          console.log(response.data); // Handle success response
          
          // Remove the deleted user from the context
          removeUser(userIdToDelete);
  
          // Optionally, show a success message or perform additional logic here
          alert("User deleted successfully");
  
          // Navigate back after deletion
          navigation.goBack();
        } catch (error) {
          console.error("Error deleting user:", error);
          alert("Failed to delete user");
        }
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
                    style={{ marginRight: 5 }}
                    onPress={() => setBottomSheetVisible(true)}
                  >
                    <Ionicons name="ellipsis-horizontal" size={24} color="#53B6C7" />
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
                        setBottomSheetVisible(false); // Close the bottom sheet
                        setModalVisible(true);
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
