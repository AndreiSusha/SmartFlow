import { View, Text, StyleSheet, TouchableOpacity,ScrollView, } from "react-native";
import React, { useEffect, useState } from "react";
import AssetCard from "../../components/assetManagement/AssetCard";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useToastStore } from "../../stores/toastStore";


const AssetManagement = () => {
  const [assets, setAssets] = useState([]); // State to hold assets data
  const navigation = useNavigation();

    // Fetch assets data from the backend API
    useEffect(() => {
      const fetchAssets = async () => {
        try {
          const response = await fetch("http://your_ip_address:3000/api/assets");
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
      {assets.map((asset,index) => (
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
