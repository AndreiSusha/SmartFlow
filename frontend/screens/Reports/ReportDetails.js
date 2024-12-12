import { useState, useLayoutEffect } from "react";
import ElectricityReport from "../../components/reports/electricityReport";
import Co2Report from "../../components/reports/co2Report";
import HumidityReport from "../../components/reports/humidityReport";
import LightReport from "../../components/reports/lightReport";
import TemperatureReport from "../../components/reports/temperatureReport";
import VddReport from "../../components/reports/vddReport";
import { useNavigation } from "@react-navigation/native";
import { Platform } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getReportDetails } from "../../api/ReportsApi";
import { MEASUREMENT_CONFIG } from "../../constants/measurementTypes";

const REPORT_COMPONENTS = {
  co2_measurements: Co2Report,
  humidity_measurements: HumidityReport,
  light_measurements: LightReport,
  temperature_measurements: TemperatureReport,
  vdd_measurements: VddReport,
  electricity_measurements: ElectricityReport,
};

const ReportDetails = ({ route }) => {
  const navigation = useNavigation();
  const { measurementType, unit } = route.params;

  const [period, setPeriod] = useState("last_week");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ReportDetails", measurementType, period],
    queryFn: () => getReportDetails(3, measurementType, period),
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
        kWh: item.averageValue,
        cost: item.averageValue * 0.2,
      }));
    } else if (period === "last_3_months") {
      monthly_data = data.map((item) => ({
        date: new Date(item.date).getTime(),
        kWh: item.averageValue || 0,
        cost: (item.averageValue || 0) * 0.2,
      }));
      console.log("monthly_data: ", monthly_data);
    } else if (period === "past_year") {
      yearly_data = data.map((item) => ({
        date: new Date(item.monthLabel).getTime(),
        kWh: item.averageValue || 0,
        cost: (item.averageValue || 0) * 0.2,
      }));
      console.log("yearly_data: ", yearly_data);
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
    return null;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <ReportComponent
      weekly_data={weekly_data}
      monthly_data={monthly_data}
      yearly_data={yearly_data}
      period={period}
      setPeriod={setPeriod}
      unit={unit}
    />
  );
};

export default ReportDetails;
