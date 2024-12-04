import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { useNavigation } from "@react-navigation/native";
  import Input from "@components/Input";
  import Button from "@components/Button";
  
  const EnterAssetDetails = ({ route }) => {
    const navigation = useNavigation();
    const { assetId } = route.params;
  
    const [assetName, setAssetName] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [extraDetails, setExtraDetails] = useState("");
  
    const isDisabled =
      !assetName || !country || !city || !streetAddress || !postalCode;
  
    useEffect(() => {
      console.log("Asset ID", assetId);
    }, [assetId]);
  
    return (
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
      >
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Input
              placeholder="Enter asset name"
              value={assetName}
              label="Title"
              onUpdateValue={setAssetName}
            />
            <Input
              placeholder="Enter country"
              value={country}
              label="Country"
              onUpdateValue={setCountry}
            />
            <Input
              placeholder="Enter city or town"
              value={city}
              label="City/Town"
              onUpdateValue={setCity}
            />
            <Input
              placeholder="Enter street address"
              value={streetAddress}
              label="Street Address"
              onUpdateValue={setStreetAddress}
            />
            <Input
              placeholder="Enter postal code"
              value={postalCode}
              label="Postal Code"
              onUpdateValue={setPostalCode}
            />
            <Input
              placeholder="Add any extra details (optional)"
              value={extraDetails}
              label="Extra Details"
              onUpdateValue={setExtraDetails}
            />
          </ScrollView>
          <View style={styles.buttonWrapper}>
            <Button
              isDisabled={isDisabled}
              onPress={() => navigation.navigate("AssetManagement")}
            >
              Save
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };
  
  const styles = StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: Platform.OS === "android" ? 35 : 5,
      paddingBottom: 20,
    },
    buttonWrapper: {
      paddingHorizontal: 20,
      paddingBottom: Platform.OS === "ios" ? 35 : 20,
    },
  });
  
  export default EnterAssetDetails;