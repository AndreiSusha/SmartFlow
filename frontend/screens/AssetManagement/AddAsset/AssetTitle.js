import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Button from "@components/Button";
import Input from "@components/Input";
import { defaultStyles } from "@styles/defaultStyles";
import { useNavigation } from "@react-navigation/native";
import { AssetDataContext } from "../../../util/addAsset-context";

const AssetTitle = () => {
  const [assetName, setAssetName] = useState("");
  const navigation = useNavigation();
  const { updateAssetData } = useContext(AssetDataContext);

  const handleContinue = () => {
    updateAssetData("assetName", assetName);
    navigation.navigate("AssetCountry");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={defaultStyles.container}
        behavior="height"
        enabled
        keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 80}
      >
        <View style={{ flex: 1 }}>
          <Input
            placeholder="Enter the name of the asset"
            value={assetName}
            label="Asset Title"
            onUpdateValue={setAssetName}
          />
        </View>
        <View>
          <Button
            isDisabled={!assetName}
            onPress={handleContinue}
          >
            Continue
          </Button>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default AssetTitle;
