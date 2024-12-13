import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Colors } from "@styles/Colors";
import { UserCard } from "@components/userManagmnet/UserCard";
import { Ionicons } from "@expo/vector-icons"; 

const Personnel = ({ personnelList }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={personnelList}
        keyExtractor={(item) => item.user_id.toString()}
        renderItem={({ item }) => (
          <UserCard name={item.user_name} branch={item.user_email} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="person-circle-outline" 
              size={60}
              color={Colors.gray}
              style={styles.icon}
            />
            <Text style={styles.emptyText}>No personnel assigned.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  icon: {
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.gray,
  },
});

export default Personnel;
