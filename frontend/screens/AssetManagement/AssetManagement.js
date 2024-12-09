// <<<<<<< HEAD
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import React, { useEffect } from "react";
// =======
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
// >>>>>>> 563c6c3e0c9725ea89834196e4ef02a472fcae90
import AssetCard from "../../components/assetManagement/AssetCard";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useToastStore } from "../../stores/toastStore";

const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;

const AssetManagement = () => {
  const [assets, setAssets] = useState([]); // State to hold assets data
  const navigation = useNavigation();
  const route = useRoute();
  const { showSuccessToast } = route.params || {};
  const { showToast } = useToastStore();

  useEffect(() => {
    if (showSuccessToast) {
      showToast("Success!", "The asset was added successfully.", "success");
    }
  }, [showSuccessToast]);

  // Fetch assets data from the backend API
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch(`${API_IP}api/assets`);

        const data = await response.json();
        setAssets(data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchAssets();
  }, []); // Empty dependency array ensures this runs once after the initial render

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {assets.map((asset, index) => (
          <AssetCard
            key={index}
            title={asset.asset.name}
            address={asset.location.address}
            users={asset.usersAssigned}
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
