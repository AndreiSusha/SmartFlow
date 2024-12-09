import React from "react";
import { View, StyleSheet } from "react-native";
import InfoItem from "./InfoItem";

const Overview = ({ asset }) => {
  const infoData = [
    {
      iconName: "business-outline",
      label: "Building ID",
      value: asset.id,
    },
    {
      iconName: "document-text-outline",
      label: "Description",
      value: asset.description,
    },
    {
      iconName: "location-outline",
      label: "Address",
      value: asset.address,
    },
    {
      iconName: "call-outline",
      label: "Contact Information",
      value: asset.contact_info,
    },
  ];

  const filteredInfoData = infoData.filter(
    (item) => item.value != null && item.value !== ""
  );

  return (
    <View style={styles.container}>
      {filteredInfoData.map((item, index) => (
        <View key={index}>
          <InfoItem
            iconName={item.iconName}
            label={item.label}
            value={item.value}
          />
          <View style={styles.separator} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    margin: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 12,
  },
});

export default Overview;
