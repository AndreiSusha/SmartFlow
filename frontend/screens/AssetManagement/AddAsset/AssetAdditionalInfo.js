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
import { useNavigation } from "@react-navigation/native";
import { useToastStore } from "../../../stores/toastStore";

const AssetAdditionalInfo = () => {
  const [assetAdditionalInfo, setAssetAdditionalInfo] = useState("");

  const navigation = useNavigation();
  const { showToast } = useToastStore();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={defaultStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        // enabled
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
          <Button
            // onPress={() =>
            //   navigation.navigate("Main", {
            //     screen: "Settings",
            //     params: { screen: "AssetManagement" },
            //   })
            // }
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "Main",
                    params: {
                      screen: "Settings",
                      params: {
                        screen: "AssetManagement",
                        params: { showSuccessToast: true },
                      },
                    },
                  },
                ],
              })
            }
          >
            Save Asset
          </Button>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default AssetAdditionalInfo;
