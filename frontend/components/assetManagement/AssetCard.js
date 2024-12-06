import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AssetCard = ({ title, address, users, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={18} color="#53B6C7" />
          <Text style={styles.detailText}>{address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={18} color="#53B6C7" />
          <Text style={styles.detailText}>{users} users assigned</Text>
        </View>
      </View>
      <View style={styles.iconContainer}>
        <Ionicons name="chevron-forward-outline" size={28} color="#53B6C7" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  detailText: {
    fontSize: 15,
    color: "#666666",
    marginLeft: 10,
    fontWeight: "500",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
  },
});

export default AssetCard;
