import React, { useState, useEffect } from "react";
import { StyleSheet, View} from "react-native";
import axios from "axios";
import { useUserContext } from "../../UserContext";
import Input from "@components/Input";
import Button from "@components/Button";
import { useToastStore } from "../../stores/toastStore";

const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;

const EditUser = ({ route, navigation }) => {
  const { userDetails, setUserDetails } = useUserContext();
  const { showToast } = useToastStore();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [location, setLocation] = useState(null);
  const [summary, setSummary] = useState(null);
  const [phone, setPhone] = useState(null);
  const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;
  useEffect(() => {
    if (!userDetails) return;
    setUserId(userDetails.id);
    setUsername(userDetails.username);
    setEmail(userDetails.email);
    setLocation(userDetails.asset_name);
    setSummary(userDetails.user_summary);
    setPhone(userDetails.phone_number);
    //setUserDetails(null);
  }, [userDetails]);

  const handleSave = async () => {
    try {
      const response = await axios.put(`${API_IP}user/${userId}`, {
        username,
        email,
        asset_name: location,
        user_summary: summary,
        phone_number: phone,
      });

      if (response.status === 200) {
        showToast("Success", "User updated successfully.", "success", 3000);
        // Use goBack to return to the previous screen
        navigation.goBack();
      } else {
        showToast(
          "Unexpected Response",
          `Status: ${response.status}`,
          "warning",
          3000
        );      }
    } catch (error) {
      console.error("Error updating user:", error);
      showToast("Error", errorMessage, "error", 3000);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="User Name"
        placeholder="User name"
        value={username}
        onUpdateValue={setUsername}
      />
      <Input
        label="Email"
        placeholder="Enter your email"
        value={email}
        onUpdateValue={setEmail}
      />

      <Input
        label="Phone Number"
        placeholder="Phone number"
        value={phone}
        onUpdateValue={setPhone}
      />
      <Input
        label="User Summary"
        placeholder="User summary"
        value={summary}
        onUpdateValue={setSummary}
      />

      <View style={styles.buttonContainer}>
        {/* <Button title="Save" onPress={handleSave} /> */}
        <Button onPress={handleSave}> Save</Button>
      </View>
    </View>
  );
};

export default EditUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
