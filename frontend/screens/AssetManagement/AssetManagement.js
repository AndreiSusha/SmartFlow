import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import AssetCard from "../../components/assetManagement/AssetCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useToastStore } from "../../stores/toastStore";
import { Ionicons } from "@expo/vector-icons";

const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();
  const { showSuccessToast } = route.params || {};
  const { showToast } = useToastStore();

  useEffect(() => {
    navigation.setOptions({});
  }, [navigation]);

  useEffect(() => {
    if (showSuccessToast) {
      showToast("Success!", "The asset was added successfully.", "success");
    }
  }, [showSuccessToast]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch(`${API_IP}/api/assets`);

        const data = await response.json();
        setAssets(data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchAssets();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {assets.map((asset, index) => (
          <AssetCard
            key={index}
            title={asset.asset.name}
            address={asset.location.address}
            users={asset.usersAssigned}
            onPress={() => navigation.navigate("AssetDetails", { asset })}
          />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddAssetNavigator")}
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
