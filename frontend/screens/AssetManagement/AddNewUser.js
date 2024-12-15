import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import Input from "@components/Input";
import Button from "@components/Button";
import { ScrollView } from "react-native-gesture-handler";
import { addUser } from "../../api/AssetApi";
import { useToastStore } from "../../stores/toastStore";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useAuthStore } from "../../stores/authStore";
import { queryClient } from "../../api/QueryClient";

const AddNewUser = ({ route }) => {
  const { assetId } = route.params;
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [userSummary, setUserSummary] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { mutate, isLoading } = useMutation({
    mutationFn: (userData) => addUser(userData),
    onSuccess: () => {
      navigation.goBack();
      showToast("Success", "User added successfully", "success");
      queryClient.invalidateQueries(["AssetsList"]);
    },
    onError: () => {
      showToast("Error", "Failed to add user", "error");
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleSaveAsset = () => {
    const userData = {
      username,
      email,
      password_hash: password,
      role_id: 2,
      customer_id: user.customer_id,
      asset_id: assetId,
      ...(userSummary ? { user_summary: userSummary } : null),
      ...(phoneNumber ? { phone_number: phoneNumber } : null),
    };

    console.log(userData);

    mutate(userData);
  };

  const isDisabled = !username || !email || !password;

  return (
    <View style={styles.container}>
      <ScrollView>
        <Input
          label="Username"
          placeholder="Enter username"
          value={username}
          onUpdateValue={setUsername}
        />
        <Input
          label="Email"
          placeholder="Enter email"
          value={email}
          keyboardType="email-address"
          onUpdateValue={setEmail}
        />
        <Input
          label="Password"
          placeholder="Enter password"
          secure={true}
          value={password}
          onUpdateValue={setPassword}
        />
        <Input
          label="Summary (Optional)"
          placeholder="Enter user summary"
          value={userSummary}
          onUpdateValue={setUserSummary}
          multiline={true}
        />
        <Input
          label="Phone Number (Optional)"
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onUpdateValue={setPhoneNumber}
        />
      </ScrollView>

      <Button isDisabled={isDisabled} onPress={handleSaveAsset}>
        Create User
      </Button>
    </View>
  );
};

export default AddNewUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
