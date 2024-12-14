import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import React, { useEffect } from "react";
import AssetCard from "../../components/assetManagement/AssetCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useToastStore } from "../../stores/toastStore";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getAssets } from "../../api/AssetApi";
import { useAuthStore } from "../../stores/authStore";

const AssetManagement = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { showSuccessAddToast, showSuccessDeleteToast } = route.params || {};
  const { showToast } = useToastStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (showSuccessAddToast) {
      showToast("Success!", "The asset was added successfully.", "success");
    }
  }, [showSuccessAddToast, showSuccessDeleteToast]);

  const {
    data: assets,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["AssetsList"],
    queryFn: () => getAssets(user.user_id),
  });


  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {assets.map((asset) => (
          <AssetCard
            key={asset.asset.id}
            title={asset.asset.name}
            address={asset.location.address}
            users={asset.usersAssigned}
            onPress={() =>
              navigation.navigate("AssetDetails", { id: asset.asset.id })
            }
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
  scrollContainer: {
    paddingBottom: 30,
  },
});

export default AssetManagement;
