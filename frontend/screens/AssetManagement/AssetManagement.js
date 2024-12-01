import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import AssetCard from "../../components/assetManagement/AssetCard";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useToastStore } from "../../stores/toastStore";

const ASSETS = [
  {
    id: 1,
    title: "Asset 1",
    address: "123 Main St",
    users: 5,
  },
  {
    id: 2,
    title: "Asset 2",
    address: "456 Elm St",
    users: 3,
  },
  {
    id: 3,
    title: "Asset 3",
    address: "789 Oak St",
    users: 2,
  },
];

const AssetManagement = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      {ASSETS.map((asset) => (
        <AssetCard
          key={asset.id}
          title={asset.title}
          address={asset.address}
          users={asset.users}
        />
      ))}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("ChooseAssetType")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#53B6C7",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});

export default AssetManagement;
