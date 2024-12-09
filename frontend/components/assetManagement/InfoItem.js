import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { Colors } from "@styles/Colors";

const InfoItem = ({ iconName, label, value }) => (
  <View style={styles.infoSection}>
    <Ionicons
      name={iconName}
      size={25}
      style={styles.icon}
    />
    <View style={styles.col}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  infoSection: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  col: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 14,
    color: "#666",
  },
});

export default InfoItem;
