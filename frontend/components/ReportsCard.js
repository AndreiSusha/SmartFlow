import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ReportsCard = ({ title, iconName, onClick }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onClick}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <View style={styles.iconWrapper}>
          <Ionicons
            name={iconName || "help-outline"}
            size={24}
            color="#007AFF"
          />
        </View>

        <View style={styles.textWrapper}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );
};

export default ReportsCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E6F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
});
