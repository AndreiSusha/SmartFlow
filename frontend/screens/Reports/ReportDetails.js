import { useEffect, useLayoutEffect } from "react";
import ElectricityReport from "../../components/reports/electricityReport";
import { useNavigation } from "@react-navigation/native";
import { Platform } from "react-native";

const ReportDetails = () => {
  const navigation = useNavigation();
  const today = new Date();

  const DATA_WEEKLY = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    kWh: Math.random() * 10 + 5,
    cost: (Math.random() * 10 + 5) * 0.2,
  }));

  const DATA_MONTHLY = Array.from({ length: 13 }, (_, i) => {
    const weekStartDate = new Date(today);
    weekStartDate.setDate(weekStartDate.getDate() - (12 - i) * 7);
    const weekLabel = weekStartDate.toLocaleDateString("default", {
      month: "numeric",
      day: "numeric",
    });
    return {
      weekIndex: i + 1,
      weekLabel,
      kWh: Math.random() * 70 + 30,
      cost: (Math.random() * 70 + 30) * 0.2,
    };
  });

  const DATA_YEARLY = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    kWh: Math.random() * 300 + 100,
    cost: (Math.random() * 300 + 100) * 0.2,
  }));

  useEffect(() => {
    console.log("DATA_WEEKLY:", DATA_WEEKLY);
    console.log("DATA_MONTHLY:", DATA_MONTHLY);
    console.log("DATA_YEARLY:", DATA_YEARLY);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Electricity Report",
      headerStyle: {
        backgroundColor: "transparent",
        elevation: Platform.OS === "android" ? 0 : undefined, // Removes shadow on Android
      },
      headerTintColor: "#53B6C7",
      headerBackTitleVisible: false,
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ElectricityReport
      weekly_data={DATA_WEEKLY}
      monthly_data={DATA_MONTHLY}
      yearly_data={DATA_YEARLY}
    />
  );
};

export default ReportDetails;
