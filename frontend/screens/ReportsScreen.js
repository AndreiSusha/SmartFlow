import React from "react";
import { FlatList, StyleSheet} from "react-native";
import { reportsData } from "../mockData";
import ReportsCard from "../components/ReportsCard";



const ReportsScreen = () => {
  return (
    <FlatList
      data={reportsData}
      style={{ paddingHorizontal: 15, paddingTop: 10 }}
      contentContainerStyle={{ paddingBottom: 80 }}
      renderItem={({ item }) => (
          <ReportsCard title={item.type} monthlyDigit={item.value} />
      )}
    />
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({});
