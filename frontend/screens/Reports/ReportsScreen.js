import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { reportsData } from "../../mockData";
import ReportsCard from "../../components/ReportsCard";
import { useNavigation } from "@react-navigation/native";

const ReportsScreen = () => {
  const navigation = useNavigation();

  return (
    <FlatList
      data={reportsData}
      style={{ paddingHorizontal: 15, paddingTop: 25 }}
      contentContainerStyle={{ paddingBottom: 80 }}
      renderItem={({ item }) => (
        <ReportsCard
          title={item.type}
          monthlyDigit={item.value}
          onClick={() => navigation.navigate("Report", {
            measurementType: item.type,
          })}
        />
      )}
    />
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({});
