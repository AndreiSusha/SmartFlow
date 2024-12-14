import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import MonthDropdown from "../components/MonthDropdown";
import ReportCard from "../components/ReportCard";
import { Ionicons } from "@expo/vector-icons";
import DonutChart from "../components/reports/charts/DonutChart";
import { useQuery } from "@tanstack/react-query";
import { getAssets } from "../api/AssetApi";
import { useAuthStore } from "../stores/authStore";
import BottomSheet from "@components/bottomsheets/BottomSheet";
import AssetBottomSheet from "@components/bottomsheets/AssetBottomSheet";

const formatValue = (value, unit) => {
  const numValue = parseFloat(value);

  switch (unit) {
    case "V":
      return {
        display: `${(numValue / 1000000).toFixed(0)} MV`,
        numeric: numValue / 1000000,
      };
    case "°C":
      return {
        display: `${numValue.toFixed(0)} °C`,
        numeric: numValue,
      };
    case "ppm":
      return {
        display: `${numValue.toFixed(0)} ppm`,
        numeric: numValue,
      };
    case "%":
      return {
        display: `${numValue.toFixed(0)} %`,
        numeric: numValue,
      };
    default:
      return {
        display: value,
        numeric: numValue,
      };
  }
};

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [chartData, setChartData] = useState([]);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const { user, chosenAssetId, setChosenAssetId } = useAuthStore();

  const {
    data: assets = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["AssetsList"],
    queryFn: () => getAssets(user.user_id),
    // onSuccess: (assets) => {
    //   console.log("Fetched assets: ", assets);
    // },
  });

  useEffect(() => {
    if (!chosenAssetId && assets.length === 1) {
      console.log("Setting chosenAssetId to: ", assets[0]?.asset.id); // Debugging
      setChosenAssetId(assets[0]?.asset.id);
    }
  }, [assets, chosenAssetId, setChosenAssetId]);

  const chosenAssetName =
    assets.find((asset) => asset.asset.id === chosenAssetId)?.asset.name ||
    "Select an Asset";

  if (!assets || isLoading) {
    <View>
      <Text>Loading...</Text>
    </View>;
  }

  const fetchDataFromAPI = async (month) => {
    try {
      const API_IP = process.env.EXPO_PUBLIC_API_BASE_URL;
      const apiUrl = `${API_IP}api/measurements/last-calendar-month?month=${month}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const text = await response.text();
      console.log("Raw Response from API:", text);

      const data = JSON.parse(text);

      const formattedData = [
        {
          ...formatValue(
            data.temperature[0]?.total_value || 0,
            data.temperature[0]?.unit || ""
          ),
          color: "#53B6C7",
          radius: 70,
          strokeWidth: 15,
          label: "Temperature",
        },
        {
          ...formatValue(
            data.co2[0]?.total_value || 0,
            data.co2[0]?.unit || ""
          ),
          color: "#337EFF",
          radius: 70,
          strokeWidth: 15,
          label: "CO2",
        },
        {
          ...formatValue(
            data.vdd[0]?.total_value || 0,
            data.vdd[0]?.unit || ""
          ),
          color: "#A0C287",
          radius: 70,
          strokeWidth: 15,
          label: "VDD",
        },
        {
          ...formatValue(
            data.humidity[0]?.total_value || 0,
            data.humidity[0]?.unit || ""
          ),
          color: "#A9A9A9",
          radius: 70,
          strokeWidth: 15,
          label: "Humidity",
        },
      ];

      setChartData(formattedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        if (assets.length === 1) {
          return (
            <View style={styles.singleAssetContainer}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.selectorText}
              >
                {assets[0].asset.name}
              </Text>
            </View>
          );
        } else if (assets.length > 1) {
          return (
            <TouchableOpacity
              onPress={() => setIsBottomSheetVisible(true)}
              style={styles.selector}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.selectorText}
              >
                {chosenAssetName}
              </Text>
              <Ionicons name="chevron-down" size={26} color="#AEAEAE" />
            </TouchableOpacity>
          );
        } else {
          return (
            <View style={styles.singleAssetContainer}>
              <Text style={styles.selectorText}>No Assets Available</Text>
            </View>
          );
        }
      },
      headerTitle: "",
    });
  }, [assets, chosenAssetName, navigation, setIsBottomSheetVisible]);

  useEffect(() => {
    if (selectedMonth) {
      fetchDataFromAPI(selectedMonth);
    }
  }, [selectedMonth]);

  useEffect(() => {
    setShouldAnimate(isFocused);
  }, [isFocused]);

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Consumption Overview</Text>

        {/* Donut Chart */}
        <View style={styles.chartContainer}>
          {/* Month Dropdown */}
          <MonthDropdown
            selectedMonth={selectedMonth}
            setSelectedMonth={(month) => {
              console.log("Month selected from dropdown:", month);
              setSelectedMonth(month);
            }}
          />
          <View style={styles.rowContainer}>
            {/* Donut Charts */}
            {/* <View>
            {chartData.slice(0, 2).map((item, index) => (
              <DonutChart
                key={index}
                percentage={item.numeric}
                color={item.color}
                radius={item.radius}
                strokeWidth={item.strokeWidth}
                animate={shouldAnimate}
              />
            ))}
          </View>
          <View style={styles.chartCorner}>
            {chartData.slice(2).map((item, index) => (
              <DonutChart
                key={index}
                percentage={item.numeric}
                color={item.color}
                radius={item.radius}
                strokeWidth={item.strokeWidth}
                animate={shouldAnimate}
              />
            ))}
          </View> */}
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            {chartData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.colorBox, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reports */}
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitle}>Monthly reports</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Reports")}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Report Cards */}
        <View style={styles.cardGrid}>
          {chartData.map((report, index) => (
            <ReportCard
              key={index}
              title={report.label}
              value={`${report.display} ${report.unit}`}
              onPress={() =>
                navigation.navigate("Reports", {
                  screen: "Report",
                  params: { reportTitle: report.label },
                })
              }
            />
          ))}
        </View>
      </ScrollView>
      {/* <BottomSheet
        onSelect={() => setIsBottomSheetVisible(false)}
        options={menuOptions}
        visible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
      /> */}
      <AssetBottomSheet
        visible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        assets={assets}
        chosenAssetId={chosenAssetId}
        onAssetSelect={(assetId) => setChosenAssetId(assetId)}
      />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter-SemiBold",
    color: "#000000",
    marginBottom: 12,
  },
  chartContainer: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 21.18,
    padding: 16,
    marginBottom: 36,
    alignSelf: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: "relative",
  },
  rowContainer: {
    marginTop: 34,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  chartCorner: {
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    justifyContent: "flex-start",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginRight: 16,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#000000",
  },
  subtitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
    color: "#000000",
  },
  viewAll: {
    fontSize: 15,
    fontFamily: "Inter-Medium",
    color: "#A0C287",
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 7,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 180,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  selectorText: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#333333",
    flex: 1,
    marginRight: 8,
  },
  singleAssetContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 20,
  },
});
