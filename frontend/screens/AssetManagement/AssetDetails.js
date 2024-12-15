import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@components/bottomsheets/BottomSheet";
import { Colors } from "@styles/Colors";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteAsset, getAsset } from "../../api/AssetApi";
import Overview from "@components/assetManagement/Overview";
import Personnel from "@components/assetManagement/Personnel";
import ConfirmationModal from "@components/ConfirmationModal";
import { queryClient } from "../../api/QueryClient";
import { useToastStore } from "../../stores/toastStore";

const AssetDetails = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const { showToast } = useToastStore();

  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const {
    data: asset,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["asset", id],
    queryFn: () => getAsset(id),
  });

  const mutation = useMutation({
    mutationFn: () => deleteAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["AssetsList"]);
      navigation.goBack();
      showToast("Success!", "The asset was deleted successfully.", "success");
    },
    onError: (error) => {
      showToast("Error", error.message || "Failed to delete asset.", "error");
      console.error("Error deleting asset:", error);
    },
  });

  useEffect(() => {
    console.log("Asset info: ", asset);
  }, [asset]);

  useLayoutEffect(() => {
    if (asset) {
      navigation.setOptions({
        title: asset.asset_name,
        headerRight: () => (
          <TouchableOpacity
            onPress={openBottomSheet}
            style={{ paddingRight: 20 }}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color={Colors.primary}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, asset]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  if (!asset) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No asset details found.</Text>
      </View>
    );
  }

  const menuOptions = [
    {
      label: "Delete",
      icon: "trash-outline",
      onPress: () => {
        handleDeletePress();
      },
    },
    {
      label: "Edit",
      icon: "create-outline",
      onPress: () => {
        handleEditPress();
      },
    },
    {
      label: "Add New user",
      icon: "person-add-outline",
      onPress: () => {
        navigation.navigate("AddNewUser", { assetId: asset.asset_id });
      },
    }
  ];

  const openBottomSheet = () => setIsBottomSheetVisible(true);
  const closeBottomSheet = () => setIsBottomSheetVisible(false);

  const handleDeletePress = () => {
    closeBottomSheet();
    setIsDeleteModalVisible(true);
    console.log("Delete asset modal visible: ", isDeleteModalVisible);
  };

  const handleEditPress = () => {
    navigation.navigate("EditAsset", { asset });
  };

  const confirmDelete = () => {
    mutation.mutate();
    setIsDeleteModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "overview" && styles.activeTab]}
            onPress={() => setActiveTab("overview")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "overview" && styles.activeTabText,
              ]}
            >
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "personnel" && styles.activeTab]}
            onPress={() => setActiveTab("personnel")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "personnel" && styles.activeTabText,
              ]}
            >
              Personnel
            </Text>
          </TouchableOpacity>
        </View>
        <View styles={styles.contentContainer}>
          {activeTab === "overview" && <Overview asset={asset} />}
          {activeTab === "personnel" && (
            <Personnel personnelList={asset.users} />
          )}
        </View>
      </View>

      <BottomSheet
        visible={isBottomSheetVisible}
        onClose={closeBottomSheet}
        options={menuOptions}
        onSelect={(option) => {
          option.onPress();
        }}
      />
      <ConfirmationModal
        visible={isDeleteModalVisible}
        title={"Confirm Removal"}
        message={
          "Are you sure you want to remove this location? This action cannot be undone."
        }
        onCancel={() => setIsDeleteModalVisible(false)}
        onConfirm={confirmDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: "row",
    borderColor: "#B2B2B2",
    borderWidth: 1,
    padding: 5,
    borderRadius: 26,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  activeTab: {
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 18,
  },
  tabText: {
    fontFamily: "Urbanist-Regular",
    fontSize: 17,
  },
  activeTabText: {
    color: Colors.white,
  },
  contentContainer: {
    flex: 1,
  },
});

export default AssetDetails;
