import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useContext, useState } from "react";
import Button from "@components/Button";
import Input from "@components/Input";
import { defaultStyles } from "@styles/defaultStyles";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useToastStore } from "../../../stores/toastStore";
import { AssetDataContext } from "../../../util/addAsset-context";

const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;

const AssetAdditionalInfo = () => {
  const [assetAdditionalInfo, setAssetAdditionalInfo] = useState("");
  const { assetData, updateLocationData } = useContext(AssetDataContext);

  const navigation = useNavigation();
  const { showToast } = useToastStore();

  const handleSaveAsset = async () => {
    updateLocationData("additionalInformation", assetAdditionalInfo);

    try {
      const response = await fetch(`${API_IP}/api/add-new-asset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assetData),
      });

      if (response.ok) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: "Main",
                state: {
                  routes: [
                    {
                      name: "Settings",
                      state: {
                        routes: [
                          { name: "SettingsScreen" },
                          {
                            name: "AssetManagement",
                            params: { showSuccessAddToast: true },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          })
        );
      } else {
        const errorData = await response.json();
        console.error("Error saving asset:", errorData);
        showToast("Error", "Failed to save asset.", "error");
      }
    } catch (error) {
      console.error("Error saving asset:", error);
      showToast("Error", "Failed to save asset.", "error");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={defaultStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 80}
      >
        <View style={{ flex: 1 }}>
          <Input
            placeholder="Enter any additional details about the asset"
            value={assetAdditionalInfo}
            label="Additional Information (optional)"
            onUpdateValue={setAssetAdditionalInfo}
          />
        </View>
        <View>
          <Button onPress={handleSaveAsset}>Save Asset</Button>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default AssetAdditionalInfo;
