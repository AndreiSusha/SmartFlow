import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "@components/Button";
import { useNavigation } from "@react-navigation/native";

const LocationChoiceScreen = () => {
  const navigation = useNavigation();

  const handleSelectExisting = () => {
    navigation.navigate("SelectExistingLocation");
  };

  const handleAddNew = () => {
    navigation.navigate("AssetCountry");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Would you like to select an existing location or add a new one?
      </Text>
      <View style={styles.buttonsContainer}>
        <Button onPress={handleSelectExisting}>Select Existing Location</Button>
        <Button onPress={handleAddNew} style={{ marginTop: 16 }}>
          Add New Location
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 22,
    color: "#555",
    textAlign: "center",
    fontFamily: "Urbanist-Regular",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    width: "100%",
  },
});

export default LocationChoiceScreen;
