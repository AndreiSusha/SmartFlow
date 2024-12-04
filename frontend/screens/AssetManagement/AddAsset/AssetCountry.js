import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Button from "@components/Button";
import Input from "@components/Input";
import { defaultStyles } from "@styles/defaultStyles";
import { useNavigation } from "@react-navigation/native";
import { AssetDataContext } from "../../../util/addAsset-context";

const AssetCountry = () => {
  const [assetCountry, setAssetCountry] = useState("");
  const navigation = useNavigation();
  const { updateLocationData } = useContext(AssetDataContext);

  const handleContinue = () => {
    updateLocationData("country", assetCountry);
    navigation.navigate("AssetAddressDetails");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={defaultStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled
        keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
      >
        <View style={{ flex: 1 }}>
          <Input
            placeholder="Enter the country where the asset is located"
            value={assetCountry}
            label="Asset Country"
            onUpdateValue={setAssetCountry}
          />
        </View>
        <View>
          <Button isDisabled={!assetCountry} onPress={handleContinue}>
            Continue
          </Button>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default AssetCountry;
