import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@components/bottomsheets/BottomSheet";
import { Colors } from "@styles/Colors";
import { useToastStore } from "../../stores/toastStore";

const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;

const AssetDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { asset } = route.params;
  const { showToast } = useToastStore();

  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: asset.asset.name,
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
  }, [navigation, asset.asset.name]);

  const menuOptions = [
    {
      label: "Delete",
      onPress: () => {
        handleDeletePress();
      },
    },
    // Add more options as needed
  ];

  // DELETE LATER
  useEffect(() => {
    console.log(asset);
  }, []);

  const openBottomSheet = () => setIsBottomSheetVisible(true);
  const closeBottomSheet = () => setIsBottomSheetVisible(false);

  const handleDeletePress = () => {
    setIsDeleteModalVisible(true);
    closeBottomSheet();
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${API_IP}/api/assets/${asset.location.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Add any authorization headers if required
          },
        }
      );

      if (response.ok) {
        setIsDeleting(false);
        setIsDeleteModalVisible(false);
        showToast("Success", "Asset was deleted successfully.", "success");
        navigation.navigate("AssetManagement", { refresh: true });
      } else {
        const errorData = await response.json();
        setIsDeleting(false);
        setIsDeleteModalVisible(false);
        showToast(
          "Error",
          errorData.message || "Failed to delete asset.",
          "error"
        );
      }
    } catch (error) {
      setIsDeleting(false);
      setIsDeleteModalVisible(false);
      showToast("Error", "An error occurred. Please try again.", "error");
      console.error("Error deleting asset:", error);
    }
  };

  const renderDeleteConfirmationModal = () => (
    <Modal
      transparent
      visible={isDeleteModalVisible}
      animationType="fade"
      onRequestClose={() => setIsDeleteModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsDeleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirm Deletion</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete this asset?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsDeleteModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={confirmDelete}
                  disabled={isDeleting}
                >
                  <Text style={styles.deleteButtonText}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{asset.asset.name}</Text>
      <Text style={styles.address}>{asset.location.address}</Text>
      {/* Display other asset details */}
      <Text style={styles.detail}>Type: {asset.asset.type}</Text>
      {/* Add more details as needed */}
      <BottomSheet
        visible={isBottomSheetVisible}
        onClose={closeBottomSheet}
        options={menuOptions}
        onSelect={(option) => {
          option.onPress();
        }}
      />
      {renderDeleteConfirmationModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  address: {
    fontSize: 18,
    color: "#666",
    marginVertical: 8,
  },
  detail: {
    fontSize: 16,
    marginVertical: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    color: "#333",
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    marginRight: 15,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.primary,
  },
  deleteButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  deleteButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default AssetDetails;
