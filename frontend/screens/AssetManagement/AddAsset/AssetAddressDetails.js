import {
    View,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
  } from "react-native";
  import React, { useState } from "react";
  import Button from "@components/Button";
  import Input from "@components/Input";
  import { defaultStyles } from "@styles/defaultStyles";
import { useNavigation } from "@react-navigation/native";
  
  const AssetAddressDetails = () => {
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const navigation = useNavigation();
  
    const isFormValid = city && address && postalCode;
  
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={defaultStyles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          enabled
          keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 80}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20, gap: 15 }}
          >
            <Input
              placeholder="Enter the city or town"
              value={city}
              label="City/Town"
              onUpdateValue={setCity}
            />
            <Input
              placeholder="Enter the address"
              value={address}
              label="Address"
              onUpdateValue={setAddress}
            />
            <Input
              placeholder="Enter the postal code"
              value={postalCode}
              label="Postal Code"
              keyboardType="numeric"
              onUpdateValue={setPostalCode}
            />
          </ScrollView>
          <View>
            <Button
              isDisabled={!isFormValid}
              onPress={() => navigation.navigate("AssetAdditionalInfo")}
            >
              Continue
            </Button>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  };
  
  export default AssetAddressDetails;
  