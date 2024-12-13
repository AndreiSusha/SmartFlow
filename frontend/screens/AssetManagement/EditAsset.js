import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import Input from "@components/Input";
import Button from "@components/Button"; 
import { defaultStyles } from "@styles/defaultStyles";
import { editAsset } from "../../api/AssetApi";
import { queryClient } from "../../api/QueryClient";

const EditAsset = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { asset } = route.params;

  const [title, setTitle] = useState(asset.asset_name ?? "");
  const [description, setDescription] = useState(asset.description ?? "");
  const [address, setAddress] = useState(asset.address ?? "");

  const isFormChanged = useMemo(() => {
    return (
      title !== asset.asset_name ||
      description !== asset.description ||
      address !== asset.address
    );
  }, [title, description, address, asset]);


  const { mutate, isLoading } = useMutation({
    mutationFn: ({id, name, description, address}) => editAsset(id, name, description, address),
    onSuccess: () => {
        queryClient.invalidateQueries(["AssetsList"]);
      navigation.goBack();
    },
    onError: (error) => {
      console.error("Edit Asset Error:", error);
    },
  });

  const handleContinue = () => {
    if (!isFormChanged || isLoading) return;
    mutate({
      id: asset.asset_id,
      name: title,
      description,
      address,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={defaultStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 80}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20, gap: 15 }}
          keyboardShouldPersistTaps="handled"
        >
          <Input
            label="Title"
            placeholder="Enter a title for the asset"
            value={title}
            onUpdateValue={setTitle}
          />
          <Input
            label="Description"
            placeholder="Enter a description for the asset"
            value={description}
            onUpdateValue={setDescription}
          />
          <Input
            label="Address"
            placeholder="Enter the asset's address"
            value={address}
            onUpdateValue={setAddress}
          />
        </ScrollView>
        <View style={{ paddingVertical: 10 }}>
          <Button
            onPress={handleContinue}
            isDisabled={!isFormChanged || isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default EditAsset;
