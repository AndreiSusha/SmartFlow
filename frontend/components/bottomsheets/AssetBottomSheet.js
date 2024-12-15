import {
  View,
  Text,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { queryClient } from "../../api/QueryClient";

const AssetBottomSheet = ({
  visible,
  onClose,
  assets,
  chosenAssetId = 3,
  onAssetSelect,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <ScrollView>
                {assets.map((asset) => (
                  <TouchableOpacity
                    onPress={() => {
                      onAssetSelect(asset.asset.id);
                      onClose();
                      queryClient.invalidateQueries("AssetMeasurements");
                    }}
                    key={asset.asset.id}
                    style={[
                      styles.option,
                      asset.asset.id === chosenAssetId && styles.chosenAsset,
                    ]}
                  >
                    <Text
                      style={[
                        styles.assetNameText,
                        asset.asset.id === chosenAssetId &&
                          styles.chosenAssetNameText,
                      ]}
                    >
                      {asset.asset.name}
                    </Text>
                    <Text
                      style={[
                        styles.assetLocationText,
                        asset.asset.id === chosenAssetId &&
                          styles.chosenAssetLocationText,
                      ]}
                    >
                      {asset.location.address}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 30,
    minHeight: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  assetNameText: {
    fontSize: 20,
  },
  assetLocationText: {
    color: "#8A8A8A",
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  chosenAsset: {
    backgroundColor: "#86b367",
  },
  chosenAssetNameText: {
    color: "#fff",
  },
  chosenAssetLocationText: {
    color: "#ffffff",
  },
});

export default AssetBottomSheet;
