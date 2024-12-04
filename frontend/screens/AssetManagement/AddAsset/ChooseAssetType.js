import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Button from "@components/Button";

const iconMapping = {
  "Corporate Property": "business-outline",
  "Vehicle": "car-outline",
  "Rental Apartment": "home-outline",
};

const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;


const ChooseAssetType = () => {
  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const [assetTypes, setAssetTypes] = useState([]);
  const navigation = useNavigation();

  // Fetch asset types from the backend
  useEffect(() => {
    const fetchAssetTypes = async () => {
      try {
        const response = await fetch(
          `${API_IP}/api/asset-types`
        ); // Replace with your API endpoint
        const data = await response.json();
        setAssetTypes(data);
      } catch (error) {
        console.error("Failed to fetch asset types", error);
      }
    };

    fetchAssetTypes();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <View style={styles.optionsBlock}>
          {assetTypes.map((assetType, index) => {
            const icon = iconMapping[assetType.type_name] || "help-outline"; // Default icon if type_name not matched
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
                  <Ionicons name={icon} size={30} color="black" />
                  <Text style={styles.name}>{assetType.type_name}</Text>
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

      <Button
        style={styles.button}
        onPress={() => navigation.navigate("AssetCountry")}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Button>
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
