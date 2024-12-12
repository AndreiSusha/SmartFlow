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
import { useMutation } from "@tanstack/react-query";
import { addAsset } from "../../../api/AssetApi";

const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;

const AssetAdditionalInfo = () => {
  const [assetAdditionalInfo, setAssetAdditionalInfo] = useState("");
  const { assetData, updateAssetData } = useContext(AssetDataContext);

  const navigation = useNavigation();
  const { showToast } = useToastStore();

  const { mutate, isLoading } = useMutation({
    mutationFn: (dataToSend) => addAsset(dataToSend),
    onSuccess: () => {
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
    },
    onError: (error) => {
      showToast("Error", "Failed to save asset.", "error");
      console.error("Add Asset Error:", error);
    },
  });

  const handleSaveAsset = async () => {
    updateAssetData("additionalInformation", assetAdditionalInfo);

    const dataToSend = {
      ...assetData,
      additionalInformation: assetAdditionalInfo,
    };

    mutate(dataToSend);
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
