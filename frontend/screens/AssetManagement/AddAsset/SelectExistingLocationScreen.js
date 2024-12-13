import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Button from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AssetDataContext } from "../../../util/addAsset-context";
import { useQuery } from "@tanstack/react-query";
import { getLocations } from "../../../api/AssetApi";
import { ScrollView } from "react-native-gesture-handler";

const SelectExistingLocationScreen = () => {
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const navigation = useNavigation();
  const { setLocationChoice, updateExistingLocationId } =
    useContext(AssetDataContext);

  const { data: locations, isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getLocations(3),
  });

  const handleContinue = () => {
    if (selectedLocationId) {
      setLocationChoice("existing");
      updateExistingLocationId(selectedLocationId);
      navigation.navigate("AssetAdditionalInfo");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#53B6C7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {locations.length === 0 ? (
        <Text style={styles.noLocationsText}>No existing locations found.</Text>
      ) : (
        <ScrollView>
          {locations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={[
                styles.locationCard,
                selectedLocationId === location.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedLocationId(location.id)}
            >
              <View>
                <Text style={styles.locationName}>{location.address}</Text>
                <Text style={styles.locationDetails}>
                  {location.city}, {location.country}
                </Text>
                <Text style={styles.locationDetails}>
                  Postal Code: {location.zip_code}
                </Text>
              </View>
              {selectedLocationId === location.id && (
                <Text style={styles.checkmark}>✔</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <Button
        onPress={handleContinue}
        isDisabled={!selectedLocationId || locations.length === 0}
        style={styles.button}
      >
        Continue
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  noLocationsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
  },
  locationCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#53B6C7",
  },
  locationName: {
    fontSize: 16,
    fontWeight: "500",
  },
  locationDetails: {
    fontSize: 14,
    color: "#555",
  },
  checkmark: {
    fontSize: 20,
    color: "#53B6C7",
  },
  button: {
    marginTop: 20,
  },
});

export default SelectExistingLocationScreen;
