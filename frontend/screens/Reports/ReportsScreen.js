import React from "react";
import { FlatList, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { getAssetMeasurements } from "../../api/ReportsApi";
import ReportsCard from "../../components/ReportsCard";
import { MEASUREMENT_CONFIG } from "../../constants/measurementTypes";

const ReportsScreen = () => {
  const navigation = useNavigation();

  const {
    data: assetMeasurements,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["AssetMeasurements"],
    queryFn: () => getAssetMeasurements(1),
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error: {error.message}</Text>;

  console.log("assetMeasurements: ", assetMeasurements);

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

export default ReportsScreen;
