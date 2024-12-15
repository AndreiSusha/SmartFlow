import { useState, useLayoutEffect } from "react";
import ElectricityReport from "../../components/reports/electricityReport";
import Co2Report from "../../components/reports/co2Report";
import HumidityReport from "../../components/reports/humidityReport";
import LightReport from "../../components/reports/lightReport";
import TemperatureReport from "../../components/reports/temperatureReport";
import VddReport from "../../components/reports/vddReport";
import { useNavigation } from "@react-navigation/native";
import { Platform, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getReportDetails } from "../../api/ReportsApi";
import { MEASUREMENT_CONFIG } from "../../constants/measurementTypes";
import { useAuthStore } from "../../stores/authStore";

const REPORT_COMPONENTS = {
  co2_measurements: Co2Report,
  humidity_measurements: HumidityReport,
  light_measurements: LightReport,
  temperature_measurements: TemperatureReport,
  vdd_measurements: VddReport,
};

const ReportDetails = ({ route }) => {
  const navigation = useNavigation();
  const { measurementType, unit, aggrType } = route.params;
  const { chosenAssetId } = useAuthStore();

  const [period, setPeriod] = useState("last_week");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ReportDetails", measurementType, period],
    queryFn: () =>
      getReportDetails(chosenAssetId, measurementType, period, aggrType),
    enabled: !!measurementType,
  });

  const config = MEASUREMENT_CONFIG[measurementType] || {
    title: measurementType,
  };

  let weekly_data = [];
  let monthly_data = [];
  let yearly_data = [];

  const ReportComponent = REPORT_COMPONENTS[measurementType];

  if (data && Array.isArray(data)) {
    if (period === "last_week") {
      weekly_data = data.map((item) => ({
        date: new Date(item.date).getTime(),
        value: item.averageValue,
        cost: item.averageValue * 0.2,
      }));
    } else if (period === "last_3_months") {
      monthly_data = data.map((item) => ({
        date: new Date(item.date).getTime(),
        value: item.averageValue || 0,
        cost: (item.averageValue || 0) * 0.2,
      }));
    } else if (period === "past_year") {
      yearly_data = data.map((item) => ({
        date: new Date(item.monthLabel).getTime(),
        value: item.averageValue || 0,
        cost: (item.averageValue || 0) * 0.2,
      }));
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${config.title} Report`,
      headerStyle: {
        backgroundColor: "transparent",
        elevation: Platform.OS === "android" ? 0 : undefined,
      },
      headerTintColor: "#53B6C7",
      headerBackTitleVisible: false,
      headerTitleAlign: "center",
    });
  }, [navigation, config.title]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!data || data.length === 0 || isError) {
    return (
      <View style={styles.noDataContainer}>
        <Ionicons name="document-text-outline" size={64} color="#A0A0A0" />
        <Text style={styles.noDataText}>No Data Available</Text>
        <Text style={styles.noDataSubText}>
          Check back later, or try a different asset.
        </Text>
      </View>
    );
  }

  return (
    <ReportComponent
      weekly_data={weekly_data}
      monthly_data={monthly_data}
      yearly_data={yearly_data}
      period={period}
      setPeriod={setPeriod}
      unit={unit}
      aggrType={aggrType}
    />
  );
};

export default ReportDetails;

const styles = StyleSheet.create({
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
