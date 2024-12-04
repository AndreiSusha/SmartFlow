import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import Button from "@components/Button";
import Input from "@components/Input";
import { defaultStyles } from "@styles/defaultStyles";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useToastStore } from "../../../stores/toastStore";

const AssetAdditionalInfo = () => {
  const [assetAdditionalInfo, setAssetAdditionalInfo] = useState("");

  const navigation = useNavigation();
  const { showToast } = useToastStore();

  const handleSaveAsset = () => {
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
                        params: { showSuccessToast: true },
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
