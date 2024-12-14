import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { getAssetMeasurements } from "../../api/ReportsApi";
import ReportsCard from "../../components/ReportsCard";
import { MEASUREMENT_CONFIG } from "../../constants/measurementTypes";
import { useAuthStore } from "../../stores/authStore";
import { Ionicons } from "@expo/vector-icons";


const ReportsScreen = () => {
  const navigation = useNavigation();
  const { chosenAssetId } = useAuthStore();

  const {
    data: assetMeasurements,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["AssetMeasurements", chosenAssetId],
    queryFn: () => getAssetMeasurements(chosenAssetId),
  });



  if (!chosenAssetId) {
    return (
      <View style={styles.noDataContainer}>
        <Ionicons name="folder-open-outline" size={64} color="#A0A0A0" />
        <Text style={styles.noDataText}>No Data Available</Text>
        <Text style={styles.noDataSubText}>
          Try selecting an asset to view its data.
        </Text>
      </View>
    );
  }
  
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  
  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }
  
  if (!assetMeasurements || assetMeasurements.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Ionicons name="folder-open-outline" size={64} color="#A0A0A0" />
        <Text style={styles.noDataText}>No Data Available</Text>
        <Text style={styles.noDataSubText}>
          Try selecting a different asset or check back later.
        </Text>
      </View>
    );
  }
  

  return (
    <FlatList
      data={assetMeasurements}
      keyExtractor={(item, index) => index.toString()}
      style={{ paddingHorizontal: 15, paddingTop: 25 }}
      contentContainerStyle={{ paddingBottom: 80 }}
      renderItem={({ item }) => {
        const config = MEASUREMENT_CONFIG[item.measurement_type] || {
          icon: "help-outline",
          title: item.measurement_type,
        };

        return (
          <ReportsCard
            title={config.title}
            iconName={config.icon}
            onClick={() =>
              navigation.navigate("Report", {
                measurementType: item.measurement_type,
                unit: item.unit,
                aggrType: item.aggr_type,
              })
            }
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  noDataSubText: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default ReportsScreen;
