import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

const assetTypes = [
  {
    id: 1,
    name: "Vechile",
    icon: "car-outline",
  },
  {
    id: 2,
    name: "Corporate Property",
    icon: "business-outline",
  },
  {
    id: 3,
    name: "Rental Apartment",
    icon: "home-outline",
  },
];

const ChooseAssetType = () => {
  const [selectedAssetType, setSelectedAssetType] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <View style={styles.optionsBlock}>
          {assetTypes.map((assetType, index) => {
            return (
              <TouchableOpacity
                onPress={() => setSelectedAssetType(assetType.id)}
                key={assetType.id}
                style={[
                  styles.selectionCard,
                  index < assetTypes.length - 1 && styles.separator,
                ]}
              >
                <View style={styles.cardInitials}>
                  <Ionicons name={assetType.icon} size={30} color="black" />
                  <Text style={styles.name}>{assetType.name}</Text>
                </View>
                {selectedAssetType === assetType.id && (
                  <Ionicons
                    name={"checkmark-circle-outline"}
                    size={30}
                    color="#A0C287"
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  optionsContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  optionsBlock: {
    backgroundColor: "white",
    width: "90%",
    marginTop: 20,
    borderRadius: 8,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardInitials: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "400",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  selectionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 6,
  },
  button: {
    height: 56,
    width: "90%",
    backgroundColor: "#53B6C7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Urbanist-Regular",
  },
});

export default ChooseAssetType;